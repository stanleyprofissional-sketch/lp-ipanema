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

document.addEventListener('DOMContentLoaded', function () {
    initForms();
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
                    // Success: Show Success Step
                    showQuizSuccess();
                    if (window.fbq) window.fbq('track', 'CompleteRegistration');
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
    if (e.key === 'Escape' && quizModal && quizModal.classList.contains('open')) {
        closeQuizModal();
    }
});
