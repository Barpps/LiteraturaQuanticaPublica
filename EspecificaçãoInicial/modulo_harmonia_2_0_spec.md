# Módulo Harmonia 2.0 — Especificação Técnica & Vibracional
Versão: 1.0  
Responsável funcional: Gabriel (Literatura Quântica / RingLight)  
Responsável técnico: DEV Front + Audio/Visual

---

## 1. Propósito do Módulo

Criar um **preset de Harmonia** aprimorado que integre:

- **Frequências sonoras** (mono + binaural) alinhadas ao framework dos 7 corpos / 7 raios.  
- **Paletas de luz gradientes dinâmicas**, em **full screen**, coerentes com o propósito vibracional.  
- **Geometria sagrada** (ex.: Flor da Vida / Metatron / anéis concêntricos) como overlay suave.  

> **Intenção:** proporcionar uma experiência de “campo harmônico” estável, suave, sem estrobo, que possa ser usada como pano de fundo para meditação, foco ou descanso leve.  
> Sem alegações terapêuticas.

---

## 2. Escopo do Módulo Harmonia 2.0

Este módulo será o **laboratório de novas funcionalidades**, testando:

1. **Fundo full screen gradiente dinâmico** (sem quadrado central fixo).
2. **Overlay de geometria sagrada** com opacidade controlável.
3. **Frequências pré-definidas** por intenção (ex.: Harmonia, Paz, Conexão, Prosperidade).  
4. **Modo Binaural** opcional (com checagem básica de uso com fones).  
5. **Controles refinados de UI** para desktop e mobile.

### 2.1. Controles previstos (UI)

Baseados no layout atual (imagem de referência):

- Dropdown **Preset**: `Harmonia`, `Paz`, `Conexão`, `Prosperidade` (podem crescer depois).
- Botões: `Play`, `Pause`, `Tela cheia`.
- Dropdown **Frequência base**: ex.: `528 Hz`, `639 Hz`, `741 Hz`, `888 Hz` etc.
- Checkbox `Binaural`.
- Checkbox `Overlay Metatron` (ou nome do overlay selecionado).
- Slider **Volume** (com limite recomendado de ~0.6).
- Texto auxiliar:  
  > “Use com moderação. Evite uso contínuo por mais de 90 minutos.”

---

## 3. Framework Vibracional — Regras Gerais

### 3.1. Princípios de Som

- **Sem estrobo sonoro** (nada de liga/desliga brusco).
- **Fade in** mínimo: 2–3 segundos ao iniciar.
- **Fade out** mínimo: 2 segundos ao pausar/parar.
- Manter **ondas senoidais** puras para o módulo base (sem distorção).
- Binaural:  
  - Frequência base ex.: 639 Hz no ouvido esquerdo.  
  - Offset binaural ex.: 4–8 Hz no ouvido direito (delta/θ leve).  
  - Ajustar por módulo (ex.: Harmonia: 6 Hz; Sono profundo: 4 Hz).

### 3.2. Princípios de Luz

- **Nada de flashing** agressivo.  
- Transições **gradientes suaves** (0.8–2 s) no máximo.  
- Evitar contraste extremo “preto absoluto x branco absoluto” piscando.
- Preferir movimentos lentos: **fades, ondas, respiração**.

### 3.3. Geometria Sagrada

- Apenas **linhas suaves**, cores claras, opacidade entre **8% e 28%**.  
- Geometria nunca deve competir com o fundo nem com o texto.  
- Pensar como “overlay etérico”, não como elemento principal de UI.

---

## 4. Sistema de Paletas & Gradientes

### 4.1. Paleta-base para Harmonia (Exemplo em tons dourados)

Referência visual: fundo dourado com flor da vida clara (como na imagem enviada).

```js
// Exemplo de paleta para HARMONIA (dourado suave)
const HARMONIA_COLORS = {
  start: "#c5961f",   // dourado médio
  mid:   "#e0b64f",   // dourado claro
  end:   "#3c2a10"    // marrom-dourado profundo
};
```

### 4.2. Paleta por intenção (sugestão inicial)

- **Harmonia** → Dourado suave  
  - Gradiente radial + leve radial invertido para profundidade.
- **Paz** → Azul-esverdeado / água-marinha  
- **Conexão** → Violeta + azul escuro (campo sutil / espiritual).  
- **Prosperidade** → Dourado + verde esmeralda.

```css
/* Exemplo de fundo full-screen com gradiente para HARMONIA */
body {
  min-height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background:
    radial-gradient(circle at top, #e0b64f 0%, #c5961f 40%, #3c2a10 100%);
}
```

### 4.3. Dinâmica dos Gradientes

- Opção A (mais simples): gradiente fixo por preset.  
- Opção B (mais avançada): leve animação temporal (ex.: “respiração” de luminosidade).

Exemplo com animação leve em CSS (sem exagero):

```css
@keyframes breathingGlow {
  0%   { filter: brightness(1); }
  50%  { filter: brightness(1.08); }
  100% { filter: brightness(1); }
}

.gradient-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  animation: breathingGlow 12s ease-in-out infinite;
}
```

> **Boa prática:** manter animações lentas (≥ 8s por ciclo) para evitar fadiga visual.

---

## 5. Geometria Sagrada — Overlay

### 5.1. Conceito

- Usar **SVG** ou **Canvas** para desenhar a geometria (Flor da Vida / Metatron).  
- Centralizada, **escala responsiva**, mantendo proporção em mobile e desktop.
- Cor: geralmente **branco suave** ou **dourado claro**, com opacidade baixa.

### 5.2. Exemplo de overlay com SVG

```html
<div class="geometry-overlay">
  <!-- Placeholder: SVG da Flor da Vida -->
  <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
    <g stroke="rgba(255, 255, 255, 0.18)" fill="none" stroke-width="1.2">
      <!-- Círculos exemplos; ideal gerar via script -->
      <circle cx="100" cy="100" r="60" />
      <circle cx="70"  cy="100" r="60" />
      <circle cx="130" cy="100" r="60" />
      <!-- etc. -->
    </g>
  </svg>
</div>
```

```css
.geometry-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
```

### 5.3. Boas práticas

- Permitir **toggle** (`Overlay Metatron` ON/OFF).  
- Prever futura expansão para múltiplas geometrias (`Flor da Vida`, `Cubo de Metatron`, `Anel Solar`, etc.).  
- Evitar muito detalhe em telas muito pequenas (ocultar partes finas se `max-width < 360px`).

---

## 6. Engine de Áudio — Web Audio API (Guia)

### 6.1. Estrutura sugerida

- `AudioContext` único por app.  
- Para o módulo Harmonia:
  - `oscBase` → frequência principal (ex.: 639 Hz).  
  - `oscBinaural` (opcional) → `freqBase + offset` (ex.: +6 Hz).  
  - `gainMaster` → volume geral.  
  - `gainBinaural` → ajusta intensidade relativa do segundo canal.

### 6.2. Exemplo simplificado (pseudo-código JS)

```js
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

function createHarmoniaNodes(freqBase = 639, binaural = false, offset = 6) {
  const oscL = ctx.createOscillator();
  const oscR = ctx.createOscillator();
  const gainL = ctx.createGain();
  const gainR = ctx.createGain();
  const merger = ctx.createChannelMerger(2);

  oscL.type = "sine";
  oscR.type = "sine";

  oscL.frequency.value = freqBase;
  oscR.frequency.value = binaural ? freqBase + offset : freqBase;

  gainL.gain.value = 0.5;
  gainR.gain.value = 0.5;

  oscL.connect(gainL).connect(merger, 0, 0);
  oscR.connect(gainR).connect(merger, 0, 1);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);

  merger.connect(masterGain).connect(ctx.destination);

  return { oscL, oscR, masterGain };
}
```

### 6.3. Fade in / Fade out

```js
function fadeIn(masterGain, target = 0.3, time = 3) {
  const now = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(target, now + time);
}

function fadeOut(masterGain, time = 2) {
  const now = ctx.currentTime;
  const current = masterGain.gain.value;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(current, now);
  masterGain.gain.linearRampToValueAtTime(0, now + time);
}
```

> **Boa prática:** sempre tratar erros de autoplay (necessidade de gesto do usuário) e exibir mensagem amigável.

---

## 7. Layout Responsivo — Diretrizes

### 7.1. Full Screen Visual

- Fundo gradiente ocupa **100% da viewport** (desktop e mobile).
- Controles de UI alinhados **na parte inferior**, com:  
  - Container com bordas arredondadas.  
  - Fundo semi-transparente (glassmorphism leve).

```css
.controls-panel {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 640px;
  margin: 0 auto 16px auto;
  padding: 12px 16px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  color: #f5f5f5;
}
```

### 7.2. Mobile

- Usar `font-size` entre 12–14px nos controles.  
- Garantir espaço mínimo de toque (botões ≥ 40px de altura).  
- Evitar muitos elementos por linha (quebrar em 2 linhas se necessário).

### 7.3. Desktop

- Manter proporção visual com mais respiro lateral.  
- Controles centralizados na parte inferior (não fixar 100% wide se não quiser).

---

## 8. Estados e Feedbacks

### 8.1. Estados do Player

- `Idle` → texto: “Aguardando seu toque para iniciar a Harmonia.”  
- `Playing` → texto: “Harmonia ativa. Use o som como pano de fundo suave.”  
- `Paused` → texto: “Harmonia em pausa. Toque em Play para retomar.”  
- `Error/Autoplay` → texto: “O navegador bloqueou o áudio. Toque em Play novamente.”

### 8.2. Indicadores sutis

- Pequena animação de **leve expansão** da geometria ou halo quando `Playing`.  
- Parar animação quando `Paused`.

---

## 9. Checklist de Implementação

- [ ] Fundo full screen gradiente dinâmico implementado para o preset Harmonia.  
- [ ] Overlay de geometria sagrada com opacidade controlável e toggle.  
- [ ] Engine de áudio com:
  - [ ] Oscilador base + suporte a binaural.  
  - [ ] Fade in / fade out suaves.  
  - [ ] Controle de volume funcional.  
- [ ] Layout responsivo: testado em mobile (Android, iOS) e desktop.  
- [ ] Mensagens de estado claras para o usuário.  
- [ ] Limite de uso orientativo (texto de 90 minutos) visível.  

---

## 10. Próximos Passos Possíveis

- Adicionar **presets adicionais** (7 corpos / 7 raios).  
- Integrar **visual_schedule** vindo do backend (ex.: variações de cor programadas).  
- Suporte a **perfis de usuário** com presets favoritos.  

---

### Notas finais ao DEV

- Prioridade absoluta: **suavidade e coerência vibracional**.  
- Se precisar escolher entre “efeito visual chamativo” e “calma do campo”, escolha sempre a **calma**.  
- Estruture o módulo de forma **extensível**, já prevendo novos presets sem reescrever o core.
