// Swiper Carousel
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        640: {
            slidesPerView: 1.2,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 2.2,
            spaceBetween: 40,
        },
    },
});

// FAQ Accordion Logic
document.querySelectorAll('.accordion-header').forEach(function (button) {
    button.addEventListener('click', function () {
        var accordionItem = button.parentElement;
        var isActive = accordionItem.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.accordion-item').forEach(function (item) {
            item.classList.remove('active');
            item.querySelector('.accordion-content').style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
            accordionItem.classList.add('active');
            var content = accordionItem.querySelector('.accordion-content');
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

// ==========================================
// Lead Form + Qualification Modal Logic
// ==========================================

// ==========================================
// UTM Capture
// ==========================================
const _urlParams = new URLSearchParams(window.location.search);
const utmParams = {
    utm_source: _urlParams.get('utm_source') || '',
    utm_medium: _urlParams.get('utm_medium') || '',
    utm_content: _urlParams.get('utm_content') || '',
};

document.addEventListener('DOMContentLoaded', function () {
    initForms();
    initVideoControl();
});

// Store lead data globally to pass to quiz
let currentLeadData = {
    name: '',
    phone: ''
};

function initForms() {
    const leadForm = document.getElementById('lead-form');
    const quizForm = document.getElementById('quiz-form');
    const phoneInput = document.querySelector("#phone");

    // Initialize intl-tel-input
    let iti;
    if (phoneInput) {
        iti = window.intlTelInput(phoneInput, {
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js",
            initialCountry: "br",
            preferredCountries: ["br", "pt", "us"],
            separateDialCode: true,
            strictMode: true,
        });
    }

    // Handle Lead Form Submit
    if (leadForm) {
        leadForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = leadForm.querySelector('[type="submit"]');
            const feedback = leadForm.querySelector('.form-feedback');

            // Validation
            if (iti && !iti.isValidNumber()) {
                if (feedback) {
                    feedback.textContent = 'Por favor, insira um número de WhatsApp válido.';
                    feedback.classList.add('error');
                    feedback.style.display = 'block';
                }
                return;
            }

            // Prepare Data
            const formData = new FormData(leadForm);
            if (iti) {
                formData.set('phone', iti.getNumber()); // Full international number
            }

            // Save for next step
            currentLeadData.name = formData.get('name');
            currentLeadData.phone = formData.get('phone');

            // UI Loading
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            if (feedback) feedback.style.display = 'none';

            try {
                const response = await fetch(leadForm.getAttribute('action'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                if (response.ok) {
                    // Success: Open Modal
                    openQuizModal();
                    leadForm.reset();
                    if (window.fbq) window.fbq('track', 'Lead'); // Facebook Pixel
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: 'Contact',
                        utm_source: utmParams.utm_source,
                        utm_medium: utmParams.utm_medium,
                        utm_content: utmParams.utm_content,
                    }); // GTM
                } else {
                    throw new Error('Erro no envio');
                }
            } catch (error) {
                console.error('Form error:', error);
                if (feedback) {
                    feedback.textContent = 'Erro ao enviar. Tente novamente.';
                    feedback.classList.add('error');
                    feedback.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Handle Quiz Form Submit
    if (quizForm) {
        quizForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = quizForm.querySelector('[type="submit"]');
            const feedback = quizForm.querySelector('.form-feedback');

            // Populate hidden fields with lead data
            document.getElementById('quiz-lead-name').value = currentLeadData.name;
            document.getElementById('quiz-lead-phone').value = currentLeadData.phone;

            const formData = new FormData(quizForm);

            // UI Loading
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Confirmando...';
            if (feedback) feedback.style.display = 'none';

            try {
                const response = await fetch(quizForm.getAttribute('action'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                if (response.ok) {
                    // GTM: FormCompleted com UTMs
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: 'FormCompleted',
                        utm_source: utmParams.utm_source,
                        utm_medium: utmParams.utm_medium,
                        utm_content: utmParams.utm_content,
                    });

                    // N8N: enviar apenas se renda = Sim
                    const incomeValue = formData.get('income');
                    if (incomeValue === 'Sim') {
                        sendToN8N({
                            name: currentLeadData.name,
                            phone: currentLeadData.phone,
                            urgency: formData.get('urgency'),
                            income: incomeValue,
                            utm_source: utmParams.utm_source,
                            utm_medium: utmParams.utm_medium,
                            utm_content: utmParams.utm_content,
                        });
                    }

                    // Sync to Bolten CRM (Update with Quiz Data)
                    syncToBolten({
                        name: currentLeadData.name,
                        phone: currentLeadData.phone,
                        urgency: formData.get('urgency'),
                        income: formData.get('income'),
                        status: 'Lead Qualificado'
                    });

                    // Redirecionar para página de obrigado
                    window.location.href = '/obrigado.html';
                } else {
                    throw new Error('Erro no envio');
                }
            } catch (error) {
                console.error('Quiz error:', error);
                if (feedback) {
                    feedback.textContent = 'Erro ao enviar. Tente novamente.';
                    feedback.classList.add('error');
                    feedback.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

// Modal Logic
const quizModal = document.getElementById('quiz-modal');
const quizStep1 = document.getElementById('quiz-step-1');
const quizSuccess = document.getElementById('quiz-success');

function openQuizModal() {
    if (!quizModal) return;
    quizModal.classList.add('open');
    quizModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset steps
    quizStep1.classList.add('active');
    quizSuccess.classList.remove('active');
}

function showQuizSuccess() {
    quizStep1.classList.remove('active');
    quizSuccess.classList.add('active');

    // Update name in success message
    const nameDisplay = document.getElementById('user-name-display');
    if (nameDisplay) nameDisplay.textContent = currentLeadData.name.split(' ')[0];
}

function closeQuizModal() {
    if (!quizModal) return;
    quizModal.classList.remove('open');
    quizModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Close Triggers
document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeQuizModal);
});

if (quizModal) {
    quizModal.addEventListener('click', (e) => {
        if (e.target === quizModal) closeQuizModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (quizModal && quizModal.classList.contains('open')) {
            closeQuizModal();
        }
        if (lightboxModal && lightboxModal.classList.contains('open')) {
            closeLightbox();
        }
    }
});

// ==========================================
// Lightbox Gallery Logic
// ==========================================
const bentoCards = document.querySelectorAll('.bento-card');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCloseBtn = document.querySelector('.lightbox-close');

function openLightbox(imgSrc) {
    if (!lightboxModal || !lightboxImg) return;

    // Configura a imagem (removendo parâmetros de resize se for CDN, ou mantendo a URL original se for local)
    // Para simplificar, vamos pegar o src atual
    lightboxImg.src = imgSrc;

    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Limpa a fonte da imagem após uma breve pausa para a animação
    setTimeout(() => {
        if (lightboxImg) lightboxImg.src = '';
    }, 300);
}

// Adiciona listener em cada card do Bento Grid
bentoCards.forEach(card => {
    // Muda cursor para indicar que é clicável
    card.style.cursor = 'pointer';

    card.addEventListener('click', () => {
        const bgImg = card.querySelector('.bento-bg');
        if (bgImg) {
            // Remove w e q parameters para carregar a original
            let fullImgSrc = bgImg.src;
            fullImgSrc = fullImgSrc.replace(/&w=\d+/, '');
            fullImgSrc = fullImgSrc.replace(/&q=\d+/, '');

            openLightbox(fullImgSrc);
        }
    });
});

if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target === lightboxCloseBtn) {
            closeLightbox();
        }
    });
}


// ==========================================
// Video Section Control
// ==========================================

function initVideoControl() {
    const videoWrapper = document.querySelector('.video-wrapper');
    const video = videoWrapper?.querySelector('video');
    const playBtn = videoWrapper?.querySelector('.video-play-btn');

    if (videoWrapper && video) {
        const icon = playBtn?.querySelector('i');

        videoWrapper.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', () => {
            videoWrapper.classList.add('playing');
            if (icon) {
                icon.classList.remove('ph-play');
                icon.classList.add('ph-pause');
            }
        });

        video.addEventListener('pause', () => {
            videoWrapper.classList.remove('playing');
            if (icon) {
                icon.classList.remove('ph-pause');
                icon.classList.add('ph-play');
            }
        });


    }
}

// ==========================================
// Bolten.io CRM Integration
// ==========================================

// ==========================================
// Scroll Depth Tracking (50%, 75%, 90%)
// ==========================================

(function () {
    const thresholds = [50, 75, 90];
    const fired = {};

    function getScrollPercent() {
        const el = document.documentElement;
        const scrollTop = window.scrollY || el.scrollTop;
        const scrollHeight = el.scrollHeight - el.clientHeight;
        return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
    }

    function onScroll() {
        const pct = getScrollPercent();
        thresholds.forEach(function (threshold) {
            if (!fired[threshold] && pct >= threshold) {
                fired[threshold] = true;

                // Meta Pixel
                if (window.fbq) {
                    fbq('trackCustom', 'ScrollDepth', { depth: threshold + '%' });
                }

                // GTM dataLayer
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'scroll_depth',
                    scroll_threshold: threshold + '%'
                });
            }
        });

        // Remove listener quando todos dispararam
        if (Object.keys(fired).length === thresholds.length) {
            window.removeEventListener('scroll', onScroll);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();

// ==========================================
// Bolten.io CRM Integration
// ==========================================

// ==========================================
// N8N Integration
// ==========================================

const N8N_WEBHOOK_URL = 'https://vitorsady-n8n-editor.duk7p3.easypanel.host/webhook-test/novo-lead';

async function sendToN8N(data) {
    try {
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        console.log('N8N: dados enviados com sucesso.');
    } catch (error) {
        console.error('N8N: erro ao enviar dados:', error);
    }
}

async function syncToBolten(data) {
    try {
        console.log('Sincronizando com Bolten.io...');
        const response = await fetch('/.netlify/functions/bolten-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Sucesso Bolten.io:', result.message);
        } else {
            console.warn('Aviso Bolten.io:', result.error);
        }
    } catch (error) {
        // We log but don't break the UI if CRM sync fails
        console.error('Erro na sincronização CRM:', error);
    }
}
