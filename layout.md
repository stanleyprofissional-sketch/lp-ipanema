# Especificação de Layout - Edifício Ipanema

> **Direção de Arte:** Minimalista, Sofisticado, Exclusivo.
> **Fontes:** Plus Jakarta Sans (Headings) + Inter (Body)
> **Cores:** #0f172a (Primary), #f8fafc (Background), #64748b (Muted), #ffffff (Accent/Text)

---

## Seção 1: Hero (Aprovado)
**(Já implementado em index.html - Manter exatamente como está)**

### Arquetipo e Constraints
- **Arquetipo:** Hero Dominante
- **Constraints:** Imagem Fullbleed + Overlay Gradiente + Tipografia Clamp
- **Justificativa:** Impacto visual imediato, destacando a exclusividade e a imagem de alta qualidade.

### Conteúdo
- Tag: "Jockey Club • Teresina"
- Headline: "Viva o Auge da Exclusividade no Coração do Jockey"
- Subheadline: "Apartamento de luxo com 167m², 3 suítes e lazer completo a passos da Av. Jóquei Clube."
- CTA: "Agendar Visita Exclusiva"

### Layout
- **Altura:** 100dvh (min 600px).
- **Estrutura:** Imagem de fundo absoluta com overlay. Conteúdo centralizado verticalmente e horizontalmente (max-width 900px).
- **Z-Index:** Background 1, Overlay 2, Content 3.

### Animacoes
- **Sequência:** FadeUpstaggeada (Tag -> Headline -> Sub -> CTA).
- **Duração:** 0.8s ease-out.
- **Delay:** Inicial 0ms, incrementos de 200ms.

---

## Seção 2: Para Quem é (Aprovado)
**(Já implementado em index.html - Manter exatamente como está)**

### Arquetipo e Constraints
- **Arquetipo:** Split Vertical (50/50 em Desktop)
- **Constraints:** Grid Clean + Icones Minimalistas + Image Frame
- **Justificativa:** Separação clara entre a promessa emocional (texto) e a prova visual (imagem de família/lifestyle).

### Conteúdo
- Tag: "Seu Novo Estilo de Vida"
- Título: "O Lar Que Você e Sua Família Merecem"
- Features: Privacidade Total, Localização Premium, Família em Primeiro Lugar, Imóvel Novo.
- Imagem: Lifestyle.

### Layout
- **Grid:** 1fr 1fr (gap: 4rem a 6rem).
- **Mobile:** Stack vertical (Imagem primeiro ou depois, conforme CSS atual: Imagem order -1).

---

## Seção 3: O Apartamento (Detalhes)

### Arquetipo e Constraints
- **Arquetipo:** Bento Box (Grid Assimétrico)
- **Constraints:** Cards Minimalistas + Hover Lift + Glassmorphism (sutil)
- **Justificativa:** Apresentar múltiplas características técnicas de forma organizada, moderna e não monótona.

### Conteúdo
- **Título:** "Sofisticação e Espaço em Cada Detalhe"
- **Cards (Grid Items):**
  1. **Destaque (Large) - [span 2 cols]:** "167m² de área privativa" (Foco em espaço).
  2. **Card - [span 1 col]:** "3 Suítes plenas + 1 quarto" (Privacidade).
  3. **Card - [span 1 col]:** "Varanda na Sala e no Quarto Principal" (Conexão exterior).
  4. **Card - [span 1 col]:** "3 Vagas + Depósito" (Comodidade).
  5. **Card - [span 1 col]:** "Cozinha Espaçosa + DCE" (Funcionalidade).

### Layout
- **Container:** Standard (1200px).
- **Grid Desktop:** 3 colunas x 2 linhas.
  - Item 1 (167m²): Grid area 1 / 1 / 2 / 3.
  - Outros itens preenchem o restante.
- **Grid Mobile:** 1 coluna (gap: 1.5rem).

### Tipografia
- Cards Títulos: 1.25rem, Bold (Plus Jakarta).
- Cards Texto: 1rem, Regular (Inter), cor #64748b.

### Cores
- Cards BG: #ffffff.
- Border: 1px solid #e2e8f0.
- Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05).

### Interatividade
- **Hover:** TranslateY(-5px), Shadow aumenta para `0 20px 25px -5px rgba(0,0,0,0.1)`. Transição 0.3s ease.

---

## Seção 4: Galeria de Ambientes (Carrossel Imersivo)

### Arquetipo e Constraints
- **Arquetipo:** Carousel Standard (Full Width / Container Broad)
- **Constraints:** Drag Interface + Imagens High-Res + Indicadores Minimalistas
- **Justificativa:** O usuário pediu especificamente carrosséis. Permitir que o usuário "navegue" pelo apartamento aumenta o desejo.

### Conteúdo
- **Título:** "Explore Seu Novo Lar"
- **Slides (Imagens):**
  1. Sala de Estar Integrada
  2. Suíte Master
  3. Varanda Gourmet
  4. Cozinha
  5. Banheiros
- **Legendas:** Pequena descrição sobreposta ou abaixo de cada imagem.

### Layout
- **Container:** Extrapolado (Wider than text container) ou Full Width.
- **Aspect Ratio Imagens:** 16:9 ou 21:9 (Cinemático).
- **Navegação:** Setas laterais customizadas (círculos brancos com ícones finos) + Dots indicator abaixo.

### Interatividade
- **Drag:** Cursor "Grab" ao passar o mouse.
- **Scroll Snap:** Suave.
- **Lightbox:** (Opcional) Clique para expandir em tela cheia.

---

## Seção 5: Lazer e Convivência

### Arquetipo e Constraints
- **Arquetipo:** Masonry ou Checkerboard (Alternado)
- **Constraints:** Imagem Recortada (Clip Path sutil ou Border Radius alto) + Texto Descritivo Lateral
- **Justificativa:** Destacar que não é apenas um apartamento, mas um complexo de lazer.

### Conteúdo
- **Título:** "Lazer de Resort, Privacidade de Casa"
- **Itens:**
  - Piscina (Imagem + Texto)
  - Área Gourmet (Imagem + Texto)
  - Salão de Festas (Texto + Imagem)
  - Academia / Quadra (Imagem + Texto)

### Layout
- **Estrutura:** Lista de features alternadas (Zig-Zag).
  - Row 1: Imagem Esq | Texto Dir
  - Row 2: Texto Esq | Imagem Dir
- **Espaçamento:** Generoso entre linhas (8rem).
- **Imagens:** Aspect Ratio 4:3, Border Radius 12px.

### Animacoes
- **Scroll:** Fade In + Slide Up conforme o usuário desce.
- **Imagens:** Zoom In sutil (Scale 1.05) no hover do container.

---

## Seção 6: Localização (Google Maps Integrado)

### Arquetipo e Constraints
- **Arquetipo:** Split Assimétrico (Mapa Maior | Lista Menor) ou Map Full Width com Card Flutuante
- **Constraints:** Map Custom Style (Cores do tema - Gray/Blue) + Interactive Pointers
- **Justificativa:** Solicitação explícita do usuário. Mostrar a conveniência de morar no Jockey.

### Conteúdo
- **Título:** "A Melhor Localização de Teresina"
- **Mapa:** Iframe do Google Maps (Estilizado ou padrão limpo). Centralizado na Rua Epaminondas Castelo Branco.
- **Lista de Proximidade (ao lado ou sobreposto):**
  - Av. Jóquei Clube (20m)
  - Colégio Lerote / Dom Barreto
  - Supermercados
  - Restaurantes

### Layout
- **Opção A (Split):**
  - Coluna Esq (40%): Lista de pontos de interesse com ícones e distância (caminhada/carro).
  - Coluna Dir (60%): Mapa interativo ocupando toda a altura do container.
- **Altura:** Min 500px.

### Interatividade
- **Mapa:** Funcional (Zoom, Pan).
- **Lista:** Hover no item da lista pode destacar o pino no mapa (se implementar API avançada) ou apenas dar highlight no texto.
- **Botão:** "Abrir no Google Maps" (Externo) para rotas.

---

## Seção 7: Investimento e Depoimentos

### Arquetipo e Constraints
- **Arquetipo:** Contained Center (Foco)
- **Constraints:** Visual Clean + Prova Social Sutil
- **Justificativa:** Informar valor e passar confiança antes do CTA final.

### Conteúdo
- **Investimento:**
  - "Investimento: R$ 1.690.000,00" (Destaque)
  - "Financiamento Bancário | Entrada Facilitada"
- **Depoimento:** Card simples com aspas grandes, texto itálico e nome do cliente.
- **FAQ:** Accordion (Perguntas e Respostas fechadas inicialmente).

### Layout
- **Container:** Estreito (max-width 800px) para leitura focada.
- **Fundo:** Levemente diferente (#f1f5f9) para separar visualmente.
- **FAQ:** Bordas finas (#e2e8f0) entre itens. Seta que gira ao abrir.

---

## Seção 8: CTA Final e Footer

### Arquetipo e Constraints
- **Arquetipo:** Minimal
- **Constraints:** High Contrast (Fundo Escuro - Primary Color)
- **Justificativa:** Chamada final clara e encerramento elegante.

### Conteúdo
- **CTA:** "Pronto para morar no melhor do Jockey?"
- **Botão:** "Agendar Visita Agora" (Branco sobre Fundo Escuro).
- **Footer:** Copyright, contato do corretor (Vitor Sady), CRECI.

### Layout
- **Background:** var(--color-primary) #0f172a.
- **Texto:** Branco (#ffffff).
- **Alinhamento:** Centralizado.
- **Padding:** 6rem top/bottom.

---

## Responsividade Global

- **Mobile (< 768px):**
  - Grids viram 1 coluna.
  - Carrossel ocupa 100% largura da tela.
  - Padding lateral reduzido (1.5rem).
  - Fontes ajustadas (H1: 2.5rem, H2: 2rem).
- **Tablet (768px - 1024px):**
  - Grids de 2 colunas mantidos.
  - Paddings ajustados.
