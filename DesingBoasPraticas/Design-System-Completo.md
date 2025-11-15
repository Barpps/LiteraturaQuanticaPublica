# 🎨 Academia ProFlow - Design System v1.0

## 📋 ÍNDICE
1. [Paleta de Cores](#paleta-de-cores)
2. [Tipografia](#tipografia)
3. [Componentes](#componentes)
4. [Grids & Layout](#grids--layout)
5. [Páginas & Templates](#páginas--templates)
6. [Guia de Implementação](#guia-de-implementação)

---

## 🎨 PALETA DE CORES

### Cores Primárias
```
Gradiente Principal: #667eea → #764ba2
├─ Azul Puro: #667eea (Energia, Confiança)
├─ Roxo Vibrante: #764ba2 (Criatividade, Espiritualidade)
└─ Transição: Gradient 135deg

Cor Secundária (Destaque): #00d4ff (Ciano Brilhante)
├─ Uso: CTAs, Hover, Ênfase
├─ Sombra: rgba(0, 212, 255, 0.3)
└─ Glow: box-shadow 0 0 15px rgba(0, 212, 255, 0.6)
```

### Cores Neutrais
```
Background Escuro: #0a0e27 (Fundo primário)
├─ Uso: Body background
├─ Profundidade: Oferece contraste máximo
└─ Acessibilidade: WCAG AA+

Overlay Leve: rgba(255,255,255,0.08) - Cards/Containers
Overlay Médio: rgba(0,0,0,0.2) - Backgrounds de Componentes
Overlay Escuro: rgba(0,0,0,0.3) - Elementos Primários

Texto Primário: #ffffff (100%)
Texto Secundário: rgba(255,255,255,0.7) (70%)
Texto Terciário: rgba(255,255,255,0.5) (50%)
Texto Desabilitado: rgba(255,255,255,0.3) (30%)
```

### Cores dos 7 Raios Cósmicos
```
🔴 Red Ray: #ff4444
   └─ Poder, Vontade, Determinação

🟠 Orange Ray: #ff8800
   └─ Criatividade, Vitalidade

🟡 Yellow Ray: #ffdd00
   └─ Inteligência, Sabedoria

🟢 Green Ray: #00dd00
   └─ Cura, Harmonia, Compaixão

🔵 Blue Ray: #0088ff
   └─ Comunicação, Verdade

🟣 Indigo Ray: #4400ff
   └─ Intuição, Visão Divina

🟣 Violet Ray: #aa00ff
   └─ Transformação, Alquimia

⚪ White Ray: #ffffff
   └─ Síntese, Totalidade
```

### Estados de Componentes
```
Active: linear-gradient(135deg, #667eea, #764ba2) + border #00d4ff
Hover: rgba(102,126,234,0.2) background
Focus: box-shadow 0 0 10px rgba(0,212,255,0.3)
Disabled: opacity 0.5 + cursor not-allowed
Loading: animation pulse 1.5s ease-in-out infinite
```

---

## 🔤 TIPOGRAFIA

### Font Stack (Web Safe)
```css
/* Sistema Operacional Primeiro */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

/* Fallback para monospace (código) */
font-family: 'Courier New', 'Courier', monospace;
```

### Escalas de Tamanho
```
H1 - Display: 32px | Weight 700 | Line-height 1.2
     └─ Uso: Títulos principais, Landing

H2 - Large: 24px | Weight 700 | Line-height 1.3
     └─ Uso: Seções, Títulos de página

H3 - Medium: 18px | Weight 600 | Line-height 1.4
     └─ Uso: Subtítulos, Card titles

Body - Regular: 14px | Weight 400 | Line-height 1.6
     └─ Uso: Parágrafo, Descrições

Small - Compact: 12px | Weight 400 | Line-height 1.5
     └─ Uso: Labels, Hints, Metadata

Tiny - Minimal: 10px | Weight 600 | Line-height 1.4
     └─ Uso: Tags, Badges, Status indicators
```

### Pesos
```
700 - Bold (Títulos, Destaques)
600 - Semi-Bold (Subtítulos, Labels)
400 - Regular (Corpo, Descrições)
300 - Light (Subtexto, Secundário)
```

### Variações
```
Text Uppercase: text-transform uppercase + letter-spacing 1px
     └─ Uso: Labels, Headers, CTAs

Text Monospace: font-family 'Courier New'
     └─ Uso: Timers, Valores, Código

Letter Spacing: 0.5px - 2px conforme tamanho
```

---

## 🧩 COMPONENTES

### Botões

#### Button Primary (CTA)
```
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Color: white
Padding: 12px 24px
Border: none
Border-radius: 8px
Font-weight: 600
Font-size: 14px

Hover: transform translateY(-2px) + box-shadow 0 10px 25px rgba(102,126,234,0.4)
Active: transform scale(0.98) + no shadow
Focus: box-shadow 0 0 10px rgba(0,212,255,0.5)
Disabled: opacity 0.5 + cursor not-allowed
```

#### Button Secondary
```
Background: rgba(255,255,255,0.1)
Color: #00d4ff
Border: 1px solid rgba(0,212,255,0.3)
Padding: 10px 20px
Border-radius: 8px
Font-weight: 600
Font-size: 13px

Hover: background rgba(0,212,255,0.15) + border-color #00d4ff
Active: background rgba(0,212,255,0.25)
Focus: box-shadow 0 0 10px rgba(0,212,255,0.4)
```

#### Button Outline (Fases)
```
Background: rgba(255,255,255,0.05)
Color: rgba(255,255,255,0.6)
Border: 2px solid rgba(255,255,255,0.2)
Padding: 10px 16px
Border-radius: 8px
Font-weight: 600
Font-size: 12px
Text-transform: uppercase

Active state:
  Background: linear-gradient(135deg, #667eea, #764ba2)
  Color: white
  Border-color: #00d4ff
  Box-shadow: 0 0 10px rgba(0,212,255,0.3)
```

### Cards
```
Background: rgba(255,255,255,0.08)
Border: 1px solid rgba(255,255,255,0.15)
Border-radius: 12px
Padding: 16px
Backdrop-filter: blur(10px) (Glassmorphism)

Hover: 
  Background: rgba(255,255,255,0.12)
  Border-color: rgba(0,212,255,0.3)

Variants:
  - Primary (Com gradiente): rgba(102,126,234,0.2) → rgba(118,75,162,0.2)
  - Secondary (Escura): rgba(0,0,0,0.3)
  - Info (Ciana): background rgba(0,212,255,0.1) + border #00d4ff
```

### Badges/Tags
```
Background: rgba(255,255,255,0.08)
Color: rgba(255,255,255,0.7)
Border: 1px solid rgba(255,255,255,0.15)
Border-radius: 6px
Padding: 4px 8px
Font-size: 10px
Font-weight: 600

Active:
  Background: linear-gradient(135deg, rgba(0,212,255,0.3), rgba(102,126,234,0.3))
  Color: #00d4ff
  Border-color: #00d4ff
  Box-shadow: 0 0 10px rgba(0,212,255,0.2)
```

### Inputs/Sliders
```
Range (Volume/Values):
  Height: 4px
  Background: rgba(255,255,255,0.2)
  Border-radius: 2px
  Thumb: 14px circle
  Thumb Background: linear-gradient(135deg, #667eea, #764ba2)
  
Text Input:
  Background: rgba(255,255,255,0.08)
  Border: 1px solid rgba(255,255,255,0.15)
  Color: white
  Padding: 10px 12px
  Border-radius: 8px
  Font-size: 14px
  
  Focus: 
    Border-color: #00d4ff
    Box-shadow: 0 0 10px rgba(0,212,255,0.3)
    Background: rgba(255,255,255,0.12)
```

### Headers
```
Background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #0a0e27 100%)
Padding: 16px
Border-bottom: 1px solid rgba(255,255,255,0.1)
Text-align: center

H1: 20px | White | Weight 700
Subtitle: 12px | rgba(255,255,255,0.7) | Weight 300
```

### Status/Status Indicators
```
Default:
  Background: rgba(0,0,0,0.3)
  Color: rgba(255,255,255,0.7)
  Border: 1px solid rgba(255,255,255,0.1)
  Padding: 8px 12px
  Border-radius: 8px
  Font-size: 11px

Active:
  Background: rgba(0,212,255,0.15)
  Color: #00d4ff
  Border-color: rgba(0,212,255,0.3)
  
Pulse Animation:
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
```

---

## 📐 GRIDS & LAYOUT

### Container Sizes
```
Mobile: 100vw (full width)
Tablet: 100vw com max-width 800px
Desktop: 100vw com max-width 1200px

Padding (responsive):
  Mobile: 10px - 16px
  Tablet: 16px - 24px
  Desktop: 24px - 32px
```

### Grid Systems
```
3-Column Grid (Raios):
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;

2-Column Grid (Botões):
  grid-template-columns: 1fr 1fr;
  gap: 8px;

1-Column Grid (Full-width):
  grid-template-columns: 1fr;
  grid-column: 1 / -1;
```

### Flexbox Patterns
```
Header (Center):
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

Navigation Horizontal:
  display: flex;
  gap: 12px;
  align-items: center;
```

### Spacing Scale
```
xs: 4px
sm: 6px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
3xl: 32px
```

---

## 🖼️ PÁGINAS & TEMPLATES

### Página 1: LANDING PAGE (Inicial)

**Objetivo**: Apresentar Academia ProFlow, chamar ação

**Seções**:
```
1. Hero Header
   - Background: Full gradient principal
   - H1: "Academia ProFlow" (36px, branco)
   - Tagline: "Frequências + Intenção Vibracional" (14px, ciano)
   - CTA: Botão grande "Começar Agora" (Primary)
   - Ícone: 🎵⚡💪

2. Features Grid (3 colunas)
   - Card 1: Ruído Marrom
     Icon: 🔊
     Title: "Ruído Harmônico"
     Description: "Base contínua sem interferência"
   
   - Card 2: Controle Manual
     Icon: 🎮
     Title: "Seu Ritmo"
     Description: "Você controla cada fase"
   
   - Card 3: 7 Raios
     Icon: ✨
     Title: "Energia Cósmica"
     Description: "Sincronize seus 7 corpos"

3. How It Works (Timeline)
   1️⃣ Selecione Fase
   2️⃣ Ajuste Volume
   3️⃣ Comece Treino
   4️⃣ Integre Energia

4. CTA Section
   - Headline: "Pronto para Transformar?"
   - Button: "Abrir App" (Primary)
   - Button: "Ver Guia" (Secondary)

5. Footer
   - Links: Home | Guia | Informações | Contato
   - Social: [Icons]
   - Copyright
```

**Cores**: Gradient principal + Destaques ciano
**Layout**: Flex vertical, max-width 1200px
**Fontes**: H1 32px | Subtitles 14px | Body 14px

---

### Página 2: GUIA DO USUÁRIO

**Objetivo**: Educar sobre uso, fases, frequências

**Seções**:
```
1. Header
   - Title: "Guia Completo" (24px)
   - Breadcrumb: Home > Guia

2. Table of Contents (Sidebar fixo em desktop)
   - 📍 Começar Rápido
   - 🎵 Entender Frequências
   - 🎮 Controles
   - 🔥 Aquecimento
   - 💪 Treino
   - 😌 Recuperação
   - 🆘 Troubleshooting

3. Content Sections (Scrollable)
   
   a) Quick Start (Cards lado a lado)
      Card 1: Setup
      Card 2: Phase Selection
      Card 3: Volume Control
      Card 4: Start
   
   b) Phase Details (3 Cards em grid)
      🔥 Aquecimento
      💪 Treino
      😌 Recuperação
      
      Cada card com:
      - Frequências (Badge com Hz)
      - Raios (Mini badges cores)
      - Descrição (14px)
      - Dicas (12px, secundário)
   
   c) FAQ (Accordions expandíveis)
      Q: "O ruído interfere nos benefícios?"
      A: "Não, frequências..."
      
      Q: "Quanto tempo por fase?"
      A: "Você controla..."

4. Footer
   - Back to Top
   - Related Resources
```

**Cores**: Cards com gradient primário + Texto branco
**Layout**: Sidebar + Main content (2 col desktop, 1 col mobile)
**Componentes**: Cards, Accordions, Code blocks para snippets

---

### Página 3: INFORMAÇÕES & RECURSOS

**Objetivo**: Informações sobre frequências, raios, ciência

**Seções**:
```
1. Hero
   - Title: "Ciência & Espiritualidade"
   - Description: "Entenda a tecnologia"

2. Frequências Solfeggio (Cards em grid 3x)
   - 174 Hz: Alívio
   - 285 Hz: Energia
   - 396 Hz: Liberação
   - (... 9 frequências total)
   
   Card:
   - Frequência (destaque em ciano)
   - Nome
   - Efeito (descrição)
   - Neurotransmissor (badge)
   - Corpo Sutil (badge)

3. 7 Raios Cósmicos (Cards com cores correspondentes)
   - Cada ray com:
     - Cor do ray (fundo)
     - Nome (branco)
     - Qualidade (descrição)
     - Chakra correspondente

4. Neurotransmitters (Tabela ou Cards)
   - Dopamina: Frequências que ativam
   - Serotonina: Frequências que ativam
   - Endorfinas: Frequências que ativam
   - (... etc)

5. Research Section
   - Estudos citados
   - Links para fontes
   - Citações com background card
```

**Cores**: Utilizar cores dos raios para cada seção
**Layout**: Grid responsivo 3-2-1 colunas
**Componentes**: Cards grande, Badges, Tables, Quotes

---

### Página 4: MODELOS DE BOTÕES (Showcase)

**Objetivo**: Documentação visual de todos os botões

**Seções**:
```
1. Primary Buttons
   ▶ COMEÇAR TREINO (ativo)
   ▶ COMEÇAR TREINO (hover)
   ▶ COMEÇAR TREINO (disabled)

2. Secondary Buttons
   ⏹ PARAR (ativo)
   ⏹ PARAR (hover)
   ⏹ PARAR (disabled)

3. Outline Buttons (Fases)
   🔥 AQUECIMENTO (inactive)
   🔥 AQUECIMENTO (active)
   💪 TREINO (inactive)
   💪 TREINO (active)
   😌 RECUPERAÇÃO (inactive)

4. Icon Buttons
   ▶ (play)
   ⏸ (pause)
   ⏹ (stop)
   ↻ (reset)

5. Badges & Pills
   Red Ray (com cor)
   Orange Ray (com cor)
   Yellow Ray (com cor)
   (... todos 8)

6. Sizes
   Large: 16px padding
   Regular: 12px padding
   Small: 8px padding
   Compact: 6px padding

7. States Documentation
   Normal → Hover → Active → Focus → Disabled
```

**Layout**: Grid showcase, cada botão com label
**Código**: Snippets HTML/CSS embaixo de cada componente

---

## 🎯 GUIA DE IMPLEMENTAÇÃO

### Passo 1: Cores Globais (CSS Variables)
```css
:root {
  --color-primary-start: #667eea;
  --color-primary-end: #764ba2;
  --color-accent: #00d4ff;
  --color-bg-dark: #0a0e27;
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255,255,255,0.7);
  --color-overlay-light: rgba(255,255,255,0.08);
  --color-overlay-dark: rgba(0,0,0,0.3);
}
```

### Passo 2: Fontes
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### Passo 3: Reset Global
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100vh;
  background: var(--color-bg-dark);
}
```

### Passo 4: Componentes Reutilizáveis
```
Cada componente em arquivo separado:
- _buttons.css
- _cards.css
- _inputs.css
- _badges.css
- _headers.css
```

### Passo 5: Páginas
```
Estrutura de arquivos:
/pages
  /landing.html
  /guide.html
  /info.html
  /buttons.html
/styles
  /global.css
  /components/
    _buttons.css
    _cards.css
    ...
```

---

## 📱 RESPONSIVIDADE

### Breakpoints
```
Mobile: 320px - 480px
Tablet: 480px - 768px
Desktop: 768px+

Media Queries:
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

### Adaptações por Breakpoint
```
Mobile:
- Font-size: -2px
- Padding: -50%
- Grid: 1 coluna
- Buttons: Full width

Tablet:
- Font-size: -1px
- Padding: -25%
- Grid: 2 colunas
- Buttons: 50% width

Desktop:
- Font-size: Normal
- Padding: Normal
- Grid: 3-4 colunas
- Buttons: Flex
```

---

## 🎨 EXAMPLES & SNIPPETS

### Card Component
```html
<div class="card card-primary">
  <h3>Título</h3>
  <p>Descrição aqui</p>
  <button class="btn btn-primary">Ação</button>
</div>
```

### Button Primary
```html
<button class="btn btn-primary">▶ Começar</button>
```

### Badge/Pill
```html
<span class="badge badge-active">🟢 Active</span>
```

### Grid Layout
```html
<div class="grid grid-3">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

---

## ✅ CHECKLIST PARA DEV

- [ ] Importar Google Fonts (Inter)
- [ ] Criar arquivo de CSS variables
- [ ] Implementar componentes base
- [ ] Testar em mobile (S24, iPhone)
- [ ] Testar em tablet
- [ ] Testar em desktop
- [ ] Validar contraste WCAG
- [ ] Testar velocidade de carregamento
- [ ] Implementar dark mode (se necessário)
- [ ] Adicionar hover/focus states

---

## 📚 RECURSOS PARA PASSAR AO DEV

1. Este documento (Design System)
2. HTML de Componentes (próximo arquivo)
3. CSS Completo (se quiser)
4. Figma/Sketch (opcional)
5. Color Palette Reference (visual)

