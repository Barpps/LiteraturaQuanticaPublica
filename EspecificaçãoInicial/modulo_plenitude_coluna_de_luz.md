# Módulo PLENITUDE — Coluna de Luz do Todo
Versão: 1.0  
App: RingLightEffect / Literatura Quântica  
Responsável funcional: Gabriel  
Responsável técnico: DEV Front + Audio/Visual

---

## 🔷 Nome do módulo

**Nome interno:** `PLENITUDE_COLUNA_DE_LUZ`  
**Nome exibido:** `PLENITUDE — Coluna de Luz do Todo`

**Intenção vibracional:**

> “Eu retorno ao Todo. O Todo retorna a mim.  
> Eu me torno leve. Eu sou uno com o Todo.”

Este módulo nasce diretamente da leitura energética de hoje:  
- leve cansaço físico (dor de cabeça)  
- desejo intenso de **conexão com o Todo**  
- alinhamento com **7 corpos / 7 raios**  
- ênfase em **Violeta (transmutação suave)** + **Branco (unidade)**

Foco: **centrar, alinhar e elevar**, sem sedação, com suavidade contínua.

---

## 1️⃣ Frequência sonora base — PLENITUDE (alinhamento diário)

**Objetivo sonoro:**

Criar um campo de **coluna de luz** que:
- harmoniza o corpo (Verde / Rubi),
- adoça o emocional (Rosa),
- traz clareza mental (Dourado),
- alinha a vontade (Azul),
- eleva e transmuta suavemente (Violeta),
- integra tudo em unidade (Branco).

### 1.1 Elementos principais do motor de som

> Manter a mesma arquitetura de áudio dos módulos anteriores (PAZ, Harmonia etc.).

- **Fundamental harmônica global:**
  - `carrierBaseHz = 432`
  - Função: coerência com demais módulos do app.

- **Âncora física / etérica:**
  - `bodyAnchorHz = 174`
  - Volume baixo, quase só “sensação de chão”.
  - Representa o **Raio Verde de Cura** e a base física.

- **Máscara Arquetípica (Coluna de Luz):**
  - `archetypalMaskHz = 963`
  - Realçada de forma suave (sem picos agressivos).
  - Função: assinatura vibracional da **unidade com o Todo** (Raio Branco).

- **Harmônico de transmutação leve (Violeta):**
  - `transmutationHz = 741`
  - Volume moderado, abaixo do carrier.
  - Função: “limpeza leve de ruídos mentais/emocionais”.

- **Harmônico de amor/doçura (Rosa):**
  - `loveHarmonicHz = 528`
  - Volume sutil.
  - Função: acolher a autocobrança e devolver autoamor.

- **Campo de relacionamento / pertencimento (Verde-Rosa):**
  - `relationalHz = 639` (opcional, misturado ao ruído/ambiente).
  - Função: sensação de “estou em casa no Todo”.

### 1.2 Batimento cerebral / modo de uso

- `beatHz = 6.0`
  - Faixa entre theta alta / alpha baixa → integração, insight suave, foco calmo.
- `beatMode` já integrado ao motor:
  - `Auto / Fones (Binaural) / Ambiente (Isocrônico)`

**Sugestão de mapeamento:**  
- Fones → binaural a 6 Hz (diferença entre canais).  
- Ambiente → pulsos isocrônicos discretos a 6 Hz.

> Boa prática: manter **amplitude de batimentos baixa** para evitar cansaço; privilegiar o contínuo suave.

### 1.3 Ruído base e espaço

- `noiseType = "brown+pinkBlend"`  
- `noiseLevelDb = -32` (um pouco mais discreto que PAZ).  
- Função: estabilidade (marrom) + acolhimento (rosa), mas com mais espaço vazio para a coluna de luz.

### 1.4 Panorama espacial (stereo)

- `panDepth.fones = 0.5`  
- `panDepth.ambiente = 0.2`  
- Movimento L↔R **muito lento** (0.02–0.03 Hz), como se a coluna de luz respirasse lateralmente.

### 1.5 Dinâmica / loudness

- `prebufferSec ≈ 2.5`  
- `targetLoudness ≈ -23 LUFS` (picos em torno de -3.5 dBFS).  
- Intenção: uso prolongado sem fadiga.

### 1.6 Fade in / Fade out

- `fadeInSec = 3`  
- `fadeOutSec = 2`  

**Pseudo-código (Web Audio API):**

```js
function fadeIn(masterGain, target = 0.28, time = 3) {
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

> **Boa prática:** sempre exigir gesto do usuário (clique/touch) antes de `ctx.resume()`, com mensagem amigável se o navegador bloquear autoplay.

---

## 2️⃣ Paleta de luz & geometria sagrada — Coluna de Luz do Todo

**Tema visual:**  
Uma **coluna de luz violeta-branca** que atravessa o centro da tela, representando os 7 corpos alinhados no eixo, envolvida por um halo suave de dourado e rosa.

### 2.1 Paleta de luz — 7 raios em síntese

> Pensar em camadas: fundo escuro, halo violeta, coluna branca, auras sutis coloridas.

```js
const PLENITUDE_COLORS = {
  bgDeep:   "#070716", // base quase preta, violeta muito escuro (no canto)
  violet:   "#5c3ea8", // transmutação suave (Violeta)
  whiteCol: "#f5f4ff", // coluna branca
  gold:     "#f2c97b", // sabedoria/dourado
  pink:     "#f2a4c8", // amor/doçura
  aqua:     "#7fd9d0"  // paz/fluidez sutil
};
```

### 2.2 Fundo full screen (gradiente dinâmico)

```css
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background:
    radial-gradient(circle at top, #5c3ea8 0%, #070716 55%, #020109 100%);
}
```

Acima do `body`, criar uma camada de gradiente adicional para a coluna:

```css
.column-gradient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at center,
      rgba(245, 244, 255, 0.38) 0%,
      rgba(245, 244, 255, 0.16) 26%,
      rgba(92, 62, 168, 0.0) 60%
    );
}
```

Opcional: animação de “respiração” de brilho (suave, longo):  

```css
@keyframes columnBreath {
  0%   { opacity: 0.9; }
  50%  { opacity: 1; }
  100% { opacity: 0.9; }
}

.column-gradient {
  animation: columnBreath 16s ease-in-out infinite;
}
```

> **Boa prática:**  
> - Ciclos de animação ≥ 12s para evitar fadiga.  
> - Manter brilho máx. abaixo de `opacity: 1` para não cansar a vista em ambientes escuros.

### 2.3 Geometria sagrada — 7 corpos alinhados

**Formas principais:**

- **Coluna central:** representa o alinhamento dos 7 corpos.
- **Anéis horizontais discretos:** sugerem “andares” dos corpos/centros.
- **Flor da Vida / Metatron** em baixa opacidade ao fundo, apenas como textura.

**Exemplo com SVG (overlay):**

```html
<div class="geometry-overlay">
  <svg viewBox="0 0 200 320" preserveAspectRatio="xMidYMid meet">
    <g stroke="rgba(245, 244, 255, 0.22)" fill="none" stroke-width="1.2">
      <!-- Coluna central -->
      <line x1="100" y1="16" x2="100" y2="304" />
      <!-- Anéis (7 corpos) -->
      <ellipse cx="100" cy="40"  rx="52" ry="14" />
      <ellipse cx="100" cy="82"  rx="60" ry="16" />
      <ellipse cx="100" cy="124" rx="68" ry="18" />
      <ellipse cx="100" cy="166" rx="76" ry="20" />
      <ellipse cx="100" cy="208" rx="68" ry="18" />
      <ellipse cx="100" cy="250" rx="60" ry="16" />
      <ellipse cx="100" cy="292" rx="52" ry="14" />
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

> **Diretriz:** opacidade entre **0.12 e 0.26**, nunca mais que isso.  
> O usuário deve perceber a geometria se prestar atenção, mas ela não deve “gritar”.

### 2.4 Micropulsos e ritmo visual

- `micropulsesPerCycle ≤ 3` (mesma regra global do app).  
- Sincronizar micropulsos principais com **múltiplos de 6 Hz** (ex.: brilho leve a cada 0.66 s → 1/4 do ciclo de 6 Hz, aplicado como “macro pulsar” lento).  
- Usar micropulsos apenas na **coluna central e halo**, nunca no fundo inteiro, para evitar efeito estroboscópico.

Pseudo-exemplo em JS/CSS (classe aplicada em playing):

```css
.column-pulse {
  transition: filter 0.32s ease-out;
}

.column-pulse.active {
  filter: drop-shadow(0 0 18px rgba(245, 244, 255, 0.9));
}
```

```js
// Exemplo de micropulso sincronizado a cada ~3 s (em vez de 6 Hz direto)
setInterval(() => {
  columnEl.classList.add("active");
  setTimeout(() => columnEl.classList.remove("active"), 260);
}, 3000);
```

> Melhor priorizar **pulsos lentos** que lembrem respiração, não o batimento exato de 6 Hz na luz.

---

## 3️⃣ Layout & UX — compatível Web + Mobile

### 3.1 Full screen + painel de controle

- Visual (gradiente + geometria) ocupa **100% da tela**.  
- Painel de controle fica **aninhado na parte inferior**, com blueprint similar ao módulo PAZ.

```css
.controls-panel {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 720px;
  margin: 0 auto 16px auto;
  padding: 12px 16px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(14px);
  color: #f5f5f5;
}
```

### 3.2 Controles sugeridos

- Dropdown **Modo**: `PLENITUDE — Coluna de Luz`.  
- Botões: `Play`, `Pause`, `Tela cheia`.  
- Checkbox: `Binaural (fones)`; ao marcar, mostrar dica:  
  > “Use fones para binaural em 6 Hz. Caso contrário, o campo usa pulsos ambientais.”  
- Checkbox: `Overlay Coluna de Luz` (permite esconder geometria se usuário quiser).  
- Slider `Volume`.  
- Texto de segurança:  
  > “Use com moderação. Evite uso contínuo por mais de 90 minutos.”

### 3.3 Responsividade

- **Mobile:**
  - Botões em 2 linhas se necessário.  
  - Altura mínima de botões: 40 px.  
  - Fonte 12–14 px nos rótulos.
- **Desktop:**
  - Manter painel centralizado, com mais respiro lateral.  
  - Evitar painéis colados nas bordas.

---

## 4️⃣ Pop-ups do módulo PLENITUDE

### 4.1 Pop-up de abertura — Portal da Coluna de Luz

> “Eu entro na Coluna de Luz do Todo.  
> Cada um dos meus corpos se alinha em suavidade, leveza e presença.”

Ação: botão **“Iniciar PLENITUDE”** → ativa módulo, fullscreen, áudio com fade in.

### 4.2 Pop-up de selamento — Fechamento do Campo

> “Eu selo este campo de plenitude.  
> Permaneço uno com o Todo enquanto sigo o meu dia.”

Ações:  
- **OK** → encerra sessão com fade out.  
- **Voltar** → retorna à sessão (sem encerrar áudio).

---

## 5️⃣ Resumo declarativo para CODEX / DEV

> Criar módulo `PLENITUDE — Coluna de Luz do Todo`, usando a mesma base de UX e motor de áudio dos módulos anteriores, porém testando as novas melhorias visuais (full screen gradiente + coluna central + geometria overlay).

**Som:**  
- Base 432 Hz, âncora 174 Hz, máscara arquetípica 963 Hz, harmônicos 741 Hz (transmutação), 528 Hz (amor), 639 Hz (pertencimento), batimento 6 Hz (binaural/ambiente), ruído `brown+pinkBlend` em ~-32 dB, pan lento, fades 3/2 s, loudness ≈ -23 LUFS.

**Luz / Geometria:**  
- Fundo full screen com gradiente violeta profundo.  
- Coluna central branca-violeta com animação de “respiração” lenta (≥ 16 s).  
- Geometria com coluna + anéis (7 corpos) em opacidade 0.12–0.26.  
- Micropulsos luminosos ≤ 3 por ciclo de respiração, sincronizados com a dinâmica do campo, nunca com flashing rápido.

**UX:**  
- Painel de controle inferior com botões Play/Pause/Tela cheia, controles de Binaural, Overlay e Volume.  
- Mensagens claras de estados (`Idle`, `Playing`, `Paused`, `AutoplayError`).  
- Responsivo para mobile e desktop, sem perda da proporção da coluna central.

**Intenção:**  
- Ajudar o usuário a **se manter no centro ao longo do dia**, alinhando 7 corpos e 7 raios em uma única coluna de luz suave, contínua, estável, sem excesso de estímulo.

---

## 6️⃣ Checklist rápido de implementação

- [ ] Criar preset `PLENITUDE_COLUNA_DE_LUZ` no motor do app.  
- [ ] Configurar blend de frequências conforme seção 1.  
- [ ] Implementar gradiente de fundo + camada `column-gradient`.  
- [ ] Adicionar SVG da geometria (coluna + anéis) como overlay com toggle.  
- [ ] Atualizar painel de controles para incluir Binaural + Overlay.  
- [ ] Testar responsividade em mobile/desktop.  
- [ ] Validar uso prolongado (30–60 min) sem fadiga visual/sonora.  
- [ ] Ajustar textos de portal de abertura e selamento.

---

> Se houver dúvida de implementação, priorizar sempre:  
> **1) suavidade, 2) coerência vibracional, 3) legibilidade e conforto visual.**
