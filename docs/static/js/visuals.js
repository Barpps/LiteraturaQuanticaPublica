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
    // Fótons (Pintura Viva)
    this.photons = [];
    this._lastPhotonTime = 0;
    this._photonEnabled = false;
  }

  init({ breathingBpm = 3.6, rotationRadPerSec = 0.08, brightnessMax = 0.78, petals = 12, flowerOpacity = 1.0, palette = null, centralSphere = false, geometry = null, maxMicropulsesPerCycle = null } = {}) {
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
    this.geometry = geometry || { type: 'flower', metatronOpacity: 0.3 };
    // Ativa fótons apenas para geometria específica (ex.: Pintura Viva)
    this._photonEnabled = !!(this.geometry && this.geometry.type === 'pintura_viva');
    // JSON overrides ÔÇö ring thickness and secondary pulse alpha (8%ÔÇô20%).
    // Important: if secondaryPulseAlpha is not provided, preserve previous behavior
    // (dynamic alpha based on brightness), i.e., don't force a constant.
    this.ringLineWidth = (this.geometry && this.geometry.ringLineWidth != null) ? this.geometry.ringLineWidth : 3.5;
    this.secondaryPulseAlpha = (this.geometry && this.geometry.secondaryPulseAlpha != null)
      ? Math.min(0.20, Math.max(0.08, this.geometry.secondaryPulseAlpha))
      : null; // null => use dynamic alpha later
    this.maxMicropulsesPerCycle = maxMicropulsesPerCycle || null;
    this._cycleIndex = 0;
    this._micropulsesSoFar = 0;

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
    // inicia transi├º├úo suave de brilho entre fases (300ÔÇô500ms)
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

    // Limpa canvas mantendo transpar├¬ncia para o fundo em tela cheia
    ctx.clearRect(0, 0, width, height);

    // Time base
    const t = performance.now() / 1000;
    const breath = (Math.sin(2 * Math.PI * this.breathHz * t) + 1) / 2; // 0..1
    // breathing size (Pintura Viva respira um pouco mais)
    let pulseBase = 0.85;
    let pulseAmp = 0.15;
    if (this.geometry && this.geometry.type === 'pintura_viva') {
      pulseBase = 0.80;
      pulseAmp = 0.25;
    }
    const pulseScale = pulseBase + pulseAmp * breath;
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
          // controla micropulsos por ciclo de respira├º├úo
          const ci = Math.floor(t * this.breathHz);
          if (ci !== this._cycleIndex) {
            this._cycleIndex = ci;
            this._micropulsesSoFar = 0;
          }
          if (this.maxMicropulsesPerCycle == null || this._micropulsesSoFar < this.maxMicropulsesPerCycle) {
            this.sparkEnergy = 1.0; // will decay
            this._micropulsesSoFar++;
          }
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

    // Para manter toda a Flor da Vida (12 c├¡rculos de raio r, centros a r),
    // o di├ómetro total ├® 4r. Garantimos 4r <= 0.94*minDim (margem segura maior aproveitamento).
    const minDim = Math.min(width, height);
    const baseR = (minDim * 0.94) / 4; // cabe integralmente com margem
    const radius = baseR * pulseScale;

    // Colors: golden-emerald dominant, rose-gold accent
    const dom = this._rgba(this.palette.dominant, brightness);
    const gold = this._rgba(this.palette.gold || '#ffd700', brightness);
    const roseGold = this._rgba(this.palette.rose || 'rgba(255, 182, 193, 0.6)', Math.max(0.05, brightness * 0.6));
    const secAlphaPulse = (this.secondaryPulseAlpha != null) ? this.secondaryPulseAlpha : (0.3 * (0.65 + 0.35 * breath));
    const violet = this._rgba(this.palette.violet || '#CAC2FF', secAlphaPulse);

    if (this.geometry && (this.geometry.type === 'ring' || this.geometry.type === 'pintura_viva')) {
      // Ring central
      ctx.lineWidth = this.ringLineWidth;
      ctx.strokeStyle = gold;
      this._circle(ctx, 0, 0, radius);
    } else {
      // Flower of Life (12 circles around 1 center)
      this._flowerOfLife(ctx, radius, gold, dom);
    }

    // Geometrias de apoio
    const support = (this.geometry && this.geometry.support) || 'metatron';
    const supportOpacity = (this.geometry && this.geometry.supportOpacity != null)
      ? this.geometry.supportOpacity
      : secAlphaPulse;

    if (support === 'flower') {
      const prevOpacity = this.flowerOpacity;
      this.flowerOpacity = supportOpacity;
      this._flowerOfLife(ctx, radius * 0.95, this._withAlpha(gold, supportOpacity), this._withAlpha(dom, supportOpacity));
      this.flowerOpacity = prevOpacity;
    } else {
      this._metatronsCube(ctx, radius * 0.9, this._withAlpha(violet, supportOpacity));
    }

    // Camadas adicionais apenas para Pintura Viva
    if (this._photonEnabled) {
      const softStroke = this._withAlpha(gold, 0.12);
      const softViolet = this._withAlpha(violet, 0.12);
      this._vesicaPiscis(ctx, radius * 0.90, softStroke);
      this._merkabaStar(ctx, radius * 0.70, softViolet);
      this._phiSpiral(ctx, radius * 0.88, this._withAlpha(gold, 0.18));
      // Metatron etérico extra no centro
      this._metatronsCube(ctx, radius * 0.55, this._withAlpha(violet, 0.10));
    }

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
    const aura = this.palette.aura || 'rgba(255, 182, 193, 0.07)';
    glow.addColorStop(0, this._rgba(this.palette.gold || '#ffd700', 0.15 * breath));
    glow.addColorStop(0.5, aura);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Fótons no núcleo (apenas se habilitado)
    if (this._photonEnabled) {
      this._updateAndDrawPhotons(ctx, t, radius);
    }

    ctx.restore();
  }

  _updateAndDrawPhotons(ctx, t, radius) {
    const maxPhotons = 7;
    const centerX = 0;
    const centerY = 0;
    const dt = 1 / this.targetFps;

    // Geração pseudo-aleatória com intervalo médio 0.6–1.2s
    if (this.photons.length < maxPhotons) {
      const interval = 0.6 + Math.random() * 0.6;
      if (t - this._lastPhotonTime > interval) {
        this._lastPhotonTime = t;
        const pRadius = radius * 0.18;
        const px = centerX + (Math.random() - 0.5) * pRadius * 0.3;
        const py = centerY + (Math.random() - 0.5) * pRadius * 0.3;
        const lifeMax = 2.5 + Math.random(); // 2.5–3.5s
        const size = 2 + Math.random() * 4;
        this.photons.push({
          x: px,
          y: py,
          life: 0,
          lifeMax: lifeMax,
          size: size
        });
      }
    }

    const palette = this.palette || {};
    const baseInner = palette.whiteLight || palette.gold || '#FFDFA6';

    const alive = [];
    for (let i = 0; i < this.photons.length; i++) {
      const p = this.photons[i];
      const lifeDt = dt;
      p.life += lifeDt;
      // leve subida
      p.y -= lifeDt * radius * 0.08;
      if (p.life < p.lifeMax) {
        alive.push(p);
        const tt = p.life / p.lifeMax;
        let alpha;
        if (tt < 0.3) {
          alpha = tt / 0.3;
        } else if (tt > 0.7) {
          alpha = (1 - tt) / 0.3;
        } else {
          alpha = 1;
        }
        alpha = Math.max(0, Math.min(alpha, 1)) * 0.8;

        ctx.save();
        ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0, this._rgba(baseInner, 1));
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    this.photons = alive;
  }

  _flowerOfLife(ctx, r, colorCenter, colorRing) {
    const isPintura = this.geometry && this.geometry.type === 'pintura_viva';
    ctx.lineWidth = isPintura ? 2.4 : 2;
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

  _vesicaPiscis(ctx, r, stroke) {
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.2;
    const offset = r * (1 / 1.618); // aproximação Phi
    this._circle(ctx, -offset, 0, r);
    this._circle(ctx, offset, 0, r);
    ctx.restore();
  }

  _merkabaStar(ctx, r, stroke) {
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.2;
    const drawTriangle = (angleOffset) => {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = angleOffset + (i / 3) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };
    drawTriangle(-Math.PI / 2);
    drawTriangle(Math.PI / 2);
    ctx.restore();
  }

  _phiSpiral(ctx, r, stroke) {
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    const turns = 3;
    const steps = 140;
    const phi = 1.618;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * (Math.PI * 2 * turns);
      const rr = r * Math.pow(1 / phi, (steps - i) / steps);
      const x = Math.cos(t) * rr * 0.9;
      const y = Math.sin(t) * rr * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
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
  _clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
}
