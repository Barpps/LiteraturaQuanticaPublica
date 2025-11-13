export class Visuals {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    this.active = false;
    this.rotation = 0;
    this.phaseIndex = 0;
    this.phaseBrightness = [1.0, 1.0, 1.15, 0.85];
    this.getAudioTime = () => 0; // injected provider
    this.sparkLastBeat = -1;
    this.sparkEnergy = 0; // decays
    this.lastFrameTs = 0;
    this.targetFps = 60;
    this.visible = true;
    this._phaseBlend = { from: 0, to: 0, start: 0, dur: 0 };
  }

  init({ breathingBpm = 3.6, rotationRadPerSec = 0.08, brightnessMax = 0.78, petals = 12, flowerOpacity = 1.0, palette = null, centralSphere = false } = {}) {
    this.breathHz = breathingBpm / 60;
    this.rotSpeed = rotationRadPerSec;
    this.brightnessMax = brightnessMax;
    this.petals = petals || 12;
    this.flowerOpacity = flowerOpacity || 1.0;
    this.palette = palette || {
      dominant: '#00ffaa',
      gold: '#ffd700',
      rose: 'rgba(255,182,193,0.6)',
      violet: 'rgba(138,43,226,0.3)'
    };
    this.centralSphere = centralSphere;

    const resize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = Math.min(vw, vh) * 0.96; // usa 96% do menor lado para margens
      this.canvas.width = size;
      this.canvas.height = size;
    };
    window.addEventListener('resize', resize);
    resize();

    // Frame throttling inteligente
    const onVis = () => {
      this.visible = (document.visibilityState === 'visible');
      this.targetFps = this.visible ? 60 : 15; // reduz quando aba nao esta ativa
    };
    document.addEventListener('visibilitychange', onVis);
    onVis();
  }

  setActive(on) { this.active = on; }

  setPhase(i) {
    // inicia transição suave de brilho entre fases (300–500ms)
    const now = performance.now();
    this._phaseBlend = { from: this.phaseIndex, to: i, start: now, dur: 400 };
    this.phaseIndex = i;
  }
  setAudioTimeProvider(fn) { if (typeof fn === 'function') this.getAudioTime = fn; }

  animate(ts) {
    // Throttle frames para estabilidade termica/CPU
    const now = ts || performance.now();
    const minDelta = 1000 / this.targetFps;
    if (!this.lastFrameTs || (now - this.lastFrameTs) >= minDelta) {
      this._drawFrame();
      this.lastFrameTs = now;
    }
    requestAnimationFrame((t) => this.animate(t));
  }

  _drawFrame() {
    const ctx = this.ctx;
    const { width, height } = this.canvas;

    // Limpa canvas mantendo transparência para o fundo em tela cheia
    ctx.clearRect(0, 0, width, height);

    // Time base
    const t = performance.now() / 1000;
    const breath = (Math.sin(2 * Math.PI * this.breathHz * t) + 1) / 2; // 0..1
    const pulseScale = 0.85 + 0.15 * breath; // breathing size
    // blend de brilho por fase
    let phaseMul = this.phaseBrightness[this.phaseIndex] || 1.0;
    if (this._phaseBlend.dur > 0) {
      const k = Math.min(1, (performance.now() - this._phaseBlend.start) / this._phaseBlend.dur);
      const a = this.phaseBrightness[this._phaseBlend.from] || 1.0;
      const b = this.phaseBrightness[this._phaseBlend.to] || 1.0;
      phaseMul = a + (b - a) * k;
      if (k >= 1) this._phaseBlend.dur = 0;
    }
    let brightness = this.brightnessMax * (0.65 + 0.35 * breath) * phaseMul;

    // Spark synced to every 4th isochronic beat (7.5 Hz)
    const audioT = this.getAudioTime();
    const isoHz = 7.5;
    if (audioT > 0) {
      const beat = Math.floor(audioT * isoHz);
      if (beat !== this.sparkLastBeat) {
        // Trigger spark on every 4th beat
        if ((beat % 4) === 0) {
          this.sparkEnergy = 1.0; // will decay
        }
        this.sparkLastBeat = beat;
      }
      // Exponential decay of spark ~300ms
      this.sparkEnergy *= 0.90;
      brightness += 0.05 * this.sparkEnergy; // +5% peak, subtle
    }

    // Rotation
    this.rotation += this.rotSpeed * (1 / 60);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(this.rotation);

    // Para manter toda a Flor da Vida (12 círculos de raio r, centros a r),
    // o diâmetro total é 4r. Garantimos 4r <= 0.94*minDim (margem segura maior aproveitamento).
    const minDim = Math.min(width, height);
    const baseR = (minDim * 0.94) / 4; // cabe integralmente com margem
    const radius = baseR * pulseScale;

    // Colors: golden-emerald dominant, rose-gold accent
    const dom = this._rgba(this.palette.dominant, brightness);
    const gold = this._rgba(this.palette.gold || '#ffd700', brightness);
    const roseGold = this._rgba(this.palette.rose || 'rgba(255, 182, 193, 0.6)', Math.max(0.05, brightness * 0.6));
    const violet = this._rgba(this.palette.violet || 'rgba(138, 43, 226, 0.3)', brightness * 0.3);

    // Flower of Life (12 circles around 1 center)
    this._flowerOfLife(ctx, radius, gold, dom);

    // Metatron’s Cube overlay at 30% transparency
    this._metatronsCube(ctx, radius * 0.9, violet);

    // Central golden sphere if enabled
    if (this.centralSphere) {
      const r = radius * 0.22;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, this._rgba(this.palette.gold || '#ffd700', 0.9));
      g.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Soft glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.2);
    glow.addColorStop(0, `rgba(255, 215, 0, ${0.15 * breath})`);
    // Aura rosada constante 5–8%
    glow.addColorStop(0.5, `rgba(255, 182, 193, 0.07)`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  _flowerOfLife(ctx, r, colorCenter, colorRing) {
    ctx.lineWidth = 2;
    // center
    ctx.strokeStyle = this._withAlpha(colorCenter, Math.min(1, this.flowerOpacity));
    this._circle(ctx, 0, 0, r);
    // 12 around
    ctx.strokeStyle = this._withAlpha(colorRing, Math.min(1, this.flowerOpacity));
    const n = this.petals || 12;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      this._circle(ctx, x, y, r);
    }
  }

  _metatronsCube(ctx, size, stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    // 13 points (fruit of life approximation)
    const points = [];
    points.push([0, 0]);
    const ringR = size * 0.5;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      points.push([Math.cos(a) * ringR, Math.sin(a) * ringR]);
    }
    const ringR2 = size * 0.9;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      points.push([Math.cos(a) * ringR2, Math.sin(a) * ringR2]);
    }
    // connect all
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        ctx.beginPath();
        ctx.moveTo(points[i][0], points[i][1]);
        ctx.lineTo(points[j][0], points[j][1]);
        ctx.stroke();
      }
    }
  }

  _circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  _rgba(color, alpha) {
    // if already rgba or has alpha
    if (color.startsWith('rgba')) return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^\)]+\)/, `rgba($1,$2,$3,${alpha})`);
    if (color.startsWith('rgb')) return color.replace(/rgb\(([^,]+),([^,]+),([^\)]+)\)/, `rgba($1,$2,$3,${alpha})`);
    // hex
    const c = color.replace('#','');
    const bigint = parseInt(c.length===3 ? c.split('').map(x=>x+x).join('') : c, 16);
    const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  _withAlpha(col, alpha) { return this._rgba(this._rgba(col,1), alpha); }
}
