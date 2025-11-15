# 🖼️ Academia ProFlow - Especificações de Páginas

## 📑 ESTRUTURA DO SITE

```
/
├── index.html (Landing Page)
├── guide.html (Guia do Usuário)
├── info.html (Informações & Recursos)
├── components.html (Showcase de Componentes)
└── /styles
    ├── global.css
    ├── components/
    │   ├── buttons.css
    │   ├── cards.css
    │   ├── inputs.css
    │   └── badges.css
    └── pages/
        ├── landing.css
        ├── guide.css
        └── info.css
```

---

## 📱 PÁGINA 1: LANDING PAGE (index.html)

### Objetivo
Apresentar Academia ProFlow, destacar diferenciais, chamar à ação

### Seções

#### 1. Hero Section
```
Background: Full-screen gradient 135deg #667eea → #764ba2
Layout: Flex column, center
Content:
  - Emoji grande: 🎵
  - H1: "Academia ProFlow"
    Font: 48px bold, white
    Style: Gradient text
  
  - H2: "Frequências + Intenção Vibracional"
    Font: 20px, ciano (#00d4ff)
  
  - P: Tagline curta (50 caracteres max)
    Font: 16px, rgba(255,255,255,0.7)
  
  - CTA Button: "Abrir App" 
    Style: btn btn-primary, grande (16px font-size)
    Action: Link para Academia ProFlow app

Height: 100vh (fullscreen)
Padding: var(--spacing-3xl) horizontal
```

#### 2. Features Section
```
Title: "Por Que Academia ProFlow?"
Layout: Grid 3 colunas (responsive 1 col mobile)
Gap: var(--spacing-2xl)

Cards (3):
  1️⃣ Ruído Marrom
     Icon: 🔊 (grande, 48px)
     Title: "Base Harmônica Contínua" (18px, bold)
     Description: "Ruído marrom gerado sinteticamente que cria ambiente relaxante sem interferir nos benefícios das frequências Solfeggio." (14px)
     Background: card card-primary
  
  2️⃣ Controle Manual
     Icon: 🎮 (grande, 48px)
     Title: "100% Seu Ritmo" (18px, bold)
     Description: "Você controla cada fase do treino. Sem timer automático, você decide quando mudar de fase conforme se sente." (14px)
     Background: card card-primary
  
  3️⃣ Sincronização
     Icon: ✨ (grande, 48px)
     Title: "7 Corpos + 7 Raios" (18px, bold)
     Description: "Integre seus sete corpos sutis com os sete raios cósmicos para harmonia e performance máxima." (14px)
     Background: card card-primary

Padding: var(--spacing-2xl)
Border-radius: 12px
```

#### 3. How It Works Section
```
Title: "Como Funciona em 4 Passos"
Layout: Flex horizontal com linha conectora (ou timeline vertical mobile)

Steps (com números/ícones):
  1️⃣ "Selecione Fase"
      Descrição: Aquecimento, Treino ou Recuperação
  
  2️⃣ "Ajuste Volume"
      Descrição: Controle o ruído marrom (0-100%)
  
  3️⃣ "Comece Treino"
      Descrição: Clique em TOCAR e sinta as frequências
  
  4️⃣ "Integre Energia"
      Descrição: Suas células vibram em sincronia com os 7 raios

Card por step: Mínimo 200px, com ícone grande + título + descrição
```

#### 4. Frequências Quick View
```
Title: "As Frequências Solfeggio"
Layout: Grid 3 colunas (responsive 2-1 col)

Cards (mostrando 6 principais):
  174 Hz | 285 Hz | 396 Hz | 528 Hz | 639 Hz | 963 Hz

Card por frequência:
  - Número grande: 174 Hz (cor gradiente, 28px bold)
  - Nome: "Alívio" (14px, ciano)
  - Efeito: "Reduz dor, aterramento" (12px, secundário)
  - Badge: "Chakra Raiz" (pequeno, badge style)

Link: "Ver Todas as Frequências" → info.html
```

#### 5. Testimonials/Social Proof (Opcional)
```
Title: "O Que Usuários Dizem"
Layout: Carousel ou grid 2 colunas

Cards:
  ⭐⭐⭐⭐⭐ "Transformou meu treino completamente"
  - Nome: Usuário
  - Localização: São Paulo, BR

Link: "Ver mais reviews" → external
```

#### 6. CTA Section
```
Background: Gradient com efeito de brilho
Layout: Flex column, center
Content:
  H2: "Pronto para Revolucionar seu Treino?" (24px, white)
  P: "Alinhe sua energia com as frequências cósmicas" (14px)
  
  Buttons lado a lado:
  - "Abrir App ProFlow" (btn-primary, grande)
  - "Ler Documentação" (btn-secondary) → guide.html

Padding: var(--spacing-3xl)
Border-radius: 16px
```

#### 7. Footer
```
Layout: 4 colunas (responsive: 2-1)

Coluna 1: Logo + Descrição
  "Academia ProFlow - Harmonia Vibracional para Performance"

Coluna 2: Links
  - Home
  - Guia
  - Frequências
  - Contato

Coluna 3: Social
  - Twitter
  - Instagram
  - YouTube

Coluna 4: Newsletter
  "Receba dicas sobre frequências"
  Input + Button Subscribe

Bottom: Copyright © 2025
```

---

## 📚 PÁGINA 2: GUIA DO USUÁRIO (guide.html)

### Objetivo
Educação completa sobre como usar Academia ProFlow

### Layout
Sidebar fixa esquerda (desktop) + Content area fluida

### Sections

#### Sidebar (Fixed Left)
```
Width: 250px (desktop), collapse mobile
Background: rgba(255,255,255,0.05)
Border-right: 1px solid rgba(255,255,255,0.1)

Navigation Items (com ícones):
  📍 Começar Rápido
  🎵 Entender Frequências
  🎮 Controles
  🔥 Aquecimento
  💪 Treino
  😌 Recuperação
  🆘 Troubleshooting
  ⚙️ Configurações

Style:
  - Ativo: background gradient + border left ciano
  - Hover: background rgba(255,255,255,0.1)
  - Font: 14px, peso 500
```

#### Content Area
```
Max-width: calc(100% - 250px)
Padding: var(--spacing-2xl)

Sections:

1. QUICK START
   Title: "Começar em 5 Minutos"
   Layout: Grid 4 colunas com números
   
   Step 1: "Abra App"
     Card com instrução
   Step 2: "Escolha Fase"
     Card com ilustração
   Step 3: "Ajuste Volume"
     Card com slider preview
   Step 4: "Clique TOCAR"
     Card com botão
   
   Cada card: 160px min, com ícone grande + título + descrição curta

2. FREQUÊNCIAS
   Title: "Entenda as Frequências Solfeggio"
   
   Table/Cards com:
   | Frequência | Nome | Efeito | Neurotransmissor | Chakra |
   | 174 Hz | Alívio | Reduz dor | Endorfinas | Raiz |
   ...
   
   Style: Cards em grid 2-3 colunas com hover

3. 3 FASES EM DETALHE
   
   🔥 AQUECIMENTO
   - Frequências: 396 + 285 Hz (badges)
   - Raios: Red + Orange (mini badges cores)
   - Corpos: Físico + Etérico
   - O que fazer: Numbered list
     1. Mobilidade articular
     2. Alongamento dinâmico
     3. Respiração consciente
     4. Ativar sistema nervoso
   - Dica: "Use 40% volume para máximo foco energético"
   - Tempo recomendado: 10-20 minutos
   
   (Repete padrão para Treino e Recuperação)

4. FAQ
   Accordion components:
   
   Q: "O ruído marrom interfere nos benefícios das frequências?"
   A: "Não. O ruído marrom (20-200 Hz) e frequências Solfeggio (174-963 Hz) vibram em bandas diferentes. Seu cérebro entreina ambos sem conflito..."
   
   Q: "Quanto tempo devo ficar em cada fase?"
   A: "Você controla! Não há limite. Aquecimento 10-20 min, Treino 30-60 min, Recuperação indefinida..."
   
   Q: "Funcionam fones normais ou precisa especial?"
   A: "Qualquer fone funciona. Para binaural (máxima efetividade), use fones que separam L-R..."
   
   Q: "Posso usar enquanto durmo?"
   A: "Sim! Recuperação é ideal para dormir com 100% volume..."

   Style: Expandir ao clicar, smooth animation
```

---

## 🔬 PÁGINA 3: INFORMAÇÕES & RECURSOS (info.html)

### Objetivo
Informação científica e educacional profunda

### Sections

#### 1. Hero Simplificado
```
Background: Gradient
Title: "Ciência & Espiritualidade"
Subtitle: "Entenda a Tecnologia por Trás de Academia ProFlow"
```

#### 2. Frequências Completas (Tabela/Cards)
```
Title: "As 9 Frequências Solfeggio"
Layout: Grid 3 colunas (responsive)

Para cada frequência, card com:
- Número grande: 174 Hz (ciano, 32px)
- Nome: Alívio (18px, bold)
- Descrição: "Reduz dor física, conecta com Terra" (14px)
- Chakra: Badge "Muladhara" (12px, com cor)
- Corpo: Badge "Físico" (12px)
- Neurotransmissores: "Endorfinas" (badge, cor especial)
- Efeito na Academia: "Alívio de dor muscular" (italic, 13px)
- Cor de fundo: Gradiente baseado na cor da frequência

9 frequências: 174, 285, 396, 417, 528, 639, 741, 852, 963 Hz

Click para expandir card e ver mais detalhes
```

#### 3. 7 Raios Cósmicos
```
Title: "Os 7 Raios Cósmicos"
Layout: Grid 2 colunas desktop, 1 mobile

Para cada raio:
Ray Card (fundo com cor do raio):
  - Nome: "Red Ray" (20px, white)
  - Número: "#1" (pequeno, superior direita)
  - Qualidades: "Vontade, Poder, Determinação" (14px)
  - Descrição: Parágrafo explicativo (13px, lighter)
  - Chakra: "Muladhara - Raiz" (badge)
  - Corpo: "Físico" (badge)
  - Frequência: "174 Hz" (badge)

Cards com cores dos raios: Red, Orange, Yellow, Green, Blue, Indigo, Violet
```

#### 4. Neurotransmitters Deep Dive
```
Title: "Neurotransmissores & Frequências"

Para cada neurotransmissor, card grande:

🟡 DOPAMINA - Sistema de Recompensa
  Descrição: Parágrafo sobre função
  Frequências que ativam: 285 Hz • 528 Hz • 741 Hz • 963 Hz
    (cada uma como badge clickável)
  Efeitos na Academia: "Motivação, Prazer, Foco" (lista)
  Baixa: "Sem energia, treino arrastado"
  Alta: "Motivado, busca desafios"

(Repete para: Serotonina, Endorfinas, Oxitocina, Noradrenalina, GABA)

Layout: Cards em grid 2-3 colunas, expandíveis
```

#### 5. Ondas Cerebrais
```
Title: "Padrões de Ondas Cerebrais"
Layout: Vertical timeline ou cards

Delta (0-4 Hz) → Cor roxa
  Descrição
  Uso: Sono profundo
  Frequências: 174 Hz

Theta (4-8 Hz) → Cor azul
  Descrição
  Uso: Meditação profunda
  Frequências: 396 Hz, 285 Hz

Alfa (7-13 Hz) → Cor verde
Beta (13-30 Hz) → Cor laranja
Gama (30-50 Hz) → Cor vermelha

Cada card com: nome, Hz range, cor correspondente, descrição, uso
```

#### 6. Pesquisa & Citações
```
Title: "Fundamentos Científicos"

Quote Cards (com fundo especial):
  "A ressonância Schumann de 7.83 Hz sincroniza ondas cerebrais com frequência terrestre"
  - Referência: Nikolai Tesla
  
  "Frequências Solfeggio geram vibrações no DNA"
  - Estudo: Glen Rein, 1988
  
  "528 Hz reduz estresse significativamente em 5 minutos"
  - Pesquisa: Universidade de Tóquio, 2018

Links para papers/sources quando possível
```

#### 7. Downloads & Resources
```
Button Grid:
  📄 "Guia Completo PDF" (download)
  📊 "Tabela de Frequências" (download)
  🎵 "Audio Samples" (link)
  📚 "Referencias Científicas" (link)

Cada button: btn-secondary, com ícone
```

---

## 🎨 PÁGINA 4: COMPONENTES SHOWCASE (components.html)

Já criada em Design-System-Showcase.html

---

## 🎯 ESPECIFICAÇÕES GERAIS

### Breakpoints
```css
Desktop: 1200px+
Tablet: 768px - 1200px
Mobile: 320px - 768px

@media (max-width: 1200px) { ... }
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

### Performance
- ✓ Lazy load images
- ✓ Minify CSS/JS
- ✓ Compress images (WebP)
- ✓ Cache headers
- ✓ CDN para assets

### SEO
```html
<title>Academia ProFlow - Frequências Solfeggio para Performance</title>
<meta name="description" content="...">
<meta name="keywords" content="frequências, solfeggio, meditação...">
```

### Acessibilidade
- ✓ Alt text em imagens
- ✓ ARIA labels em botões
- ✓ Contraste WCAG AA+
- ✓ Keyboard navigation
- ✓ Focus states visíveis

### Mobile Considerations
- ✓ Touch targets mínimo 44x44px
- ✓ Font size mínimo 16px
- ✓ Padding em botões mobile
- ✓ Single column layout
- ✓ Viewport correct

---

## 📋 CHECKLIST PARA DEV

- [ ] Criar estrutura de arquivos
- [ ] Implementar global.css
- [ ] Criar components CSS
- [ ] Página landing
- [ ] Página guide
- [ ] Página info
- [ ] Página components
- [ ] Testar responsivo
- [ ] Testar performance
- [ ] SEO setup
- [ ] Analytics integrado
- [ ] Deploy

