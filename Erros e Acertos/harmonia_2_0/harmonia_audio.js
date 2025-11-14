// HarmoniaAudio: engine simples para o módulo Harmonia 2.0
// - Seno puro L/R com opção binaural (offset em Hz)
// - Fade in/out suaves
// - Volume limitado a ~0.6 para uso de fundo

export class HarmoniaAudio {
  constructor() {
    this.ctx = null;
    this.nodes = null;
    this.baseFreq = 639;
    this.binauralEnabled = false;
    this.binauralOffset = 6;
    this.volume = 0.3;
    this.fadeInSec = 2.5;
    this.fadeOutSec = 2.0;
    this.state = 'idle'; // idle | playing | paused | error
  }

  _ensureContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    }
  }

  _disposeNodes() {
    if (!this.nodes || !this.ctx) {
      this.nodes = null;
      return;
    }
    const ctx = this.ctx;
    try {
      if (this.nodes.oscL) {
        this.nodes.oscL.stop(ctx.currentTime + 0.05);
        this.nodes.oscL.disconnect();
      }
    } catch (e) {}
    try {
      if (this.nodes.oscR) {
        this.nodes.oscR.stop(ctx.currentTime + 0.05);
        this.nodes.oscR.disconnect();
      }
    } catch (e) {}
    try {
      if (this.nodes.masterGain) {
        this.nodes.masterGain.disconnect();
      }
    } catch (e) {}
    this.nodes = null;
  }

  _createNodes() {
    this._disposeNodes();
    const ctx = this.ctx;
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    const gainL = ctx.createGain();
    const gainR = ctx.createGain();
    const merger = ctx.createChannelMerger(2);
    const masterGain = ctx.createGain();

    oscL.type = 'sine';
    oscR.type = 'sine';

    const now = ctx.currentTime;
    const base = this.baseFreq;
    const rightFreq = this.binauralEnabled ? (base + this.binauralOffset) : base;

    oscL.frequency.setValueAtTime(base, now);
    oscR.frequency.setValueAtTime(rightFreq, now);

    gainL.gain.setValueAtTime(0.5, now);
    gainR.gain.setValueAtTime(0.5, now);

    oscL.connect(gainL).connect(merger, 0, 0);
    oscR.connect(gainR).connect(merger, 0, 1);

    masterGain.gain.setValueAtTime(0, now);
    merger.connect(masterGain).connect(ctx.destination);

    oscL.start(now + 0.01);
    oscR.start(now + 0.01);

    this.nodes = {
      oscL,
      oscR,
      gainL,
      gainR,
      merger,
      masterGain
    };
  }

  async play() {
    try {
      this._ensureContext();
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this._createNodes();
      this._fadeIn();
      this.state = 'playing';
    } catch (e) {
      this.state = 'error';
      throw e;
    }
  }

  async pause() {
    if (!this.ctx || !this.nodes || this.state !== 'playing') return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const g = this.nodes.masterGain.gain;
    try {
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(0.0001, now + this.fadeOutSec);
    } catch (e) {}
    const self = this;
    await new Promise(function (resolve) {
      setTimeout(resolve, self.fadeOutSec * 1000 + 80);
    });
    this._disposeNodes();
    this.state = 'paused';
  }

  _fadeIn() {
    if (!this.nodes || !this.ctx) return;
    const now = this.ctx.currentTime;
    const g = this.nodes.masterGain.gain;
    try {
      g.cancelScheduledValues(now);
      g.setValueAtTime(0, now);
      g.linearRampToValueAtTime(Math.min(0.6, this.volume), now + this.fadeInSec);
    } catch (e) {}
  }

  setBaseFrequency(freqHz) {
    const f = Number(freqHz);
    if (!isFinite(f) || f <= 0) return;
    this.baseFreq = f;
    if (this.nodes && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.nodes.oscL.frequency.linearRampToValueAtTime(f, now + 0.3);
        const rightFreq = this.binauralEnabled ? (f + this.binauralOffset) : f;
        this.nodes.oscR.frequency.linearRampToValueAtTime(rightFreq, now + 0.3);
      } catch (e) {}
    }
  }

  setBinaural(enabled) {
    this.binauralEnabled = !!enabled;
    if (this.nodes && this.ctx) {
      const now = this.ctx.currentTime;
      const f = this.baseFreq;
      const rightFreq = this.binauralEnabled ? (f + this.binauralOffset) : f;
      try {
        this.nodes.oscR.frequency.linearRampToValueAtTime(rightFreq, now + 0.4);
      } catch (e) {}
    }
  }

  setBinauralOffset(offsetHz) {
    const o = Number(offsetHz);
    if (!isFinite(o) || o <= 0) return;
    this.binauralOffset = o;
    if (this.nodes && this.ctx && this.binauralEnabled) {
      const now = this.ctx.currentTime;
      const rightFreq = this.baseFreq + this.binauralOffset;
      try {
        this.nodes.oscR.frequency.linearRampToValueAtTime(rightFreq, now + 0.4);
      } catch (e) {}
    }
  }

  setVolume(v) {
    const val = Math.max(0, Math.min(0.6, Number(v)));
    this.volume = val;
    if (this.nodes && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        const g = this.nodes.masterGain.gain;
        g.cancelScheduledValues(now);
        g.linearRampToValueAtTime(val, now + 0.25);
      } catch (e) {}
    }
  }

  canBinaural() {
    if (!this.ctx) return true;
    try {
      const dest = this.ctx.destination;
      const ch = dest.maxChannelCount || dest.channelCount || 2;
      return ch >= 2;
    } catch (e) {
      return true;
    }
  }

  async stopAndClose() {
    await this.pause();
    if (this.ctx) {
      try {
        await this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
    this.state = 'idle';
  }
}

