// SessionAudio: WebAudio engine matching the 4-phase spec
// - Phase 1 (0-5m): 174 + fade-in 432/528, master fade-in 2m
// - Phase 2 (5-60m): add isochronic 7.5 Hz, brown noise, + harmonics 639/852
// - Phase 3 (60-80m): add 963; +2ÔÇô3 dB highs and reverb
// - Phase 4 (80-90m): remove highs + isochronic; keep 174 until final fade-out

export class SessionAudio {
  constructor(configUrl) {
    this.configUrl = configUrl;
    this.ctx = null;
    this.nodes = {};
    this.phases = [
      { name: 'Fase 1 ÔÇö Ativa├º├úo', start: 0, end: 300 },
      { name: 'Fase 2 ÔÇö Harmonia', start: 300, end: 3600 },
      { name: 'Fase 3 ÔÇö Expans├úo', start: 3600, end: 4800 },
      { name: 'Fase 4 ÔÇö Dissolu├º├úo', start: 4800, end: 5400 }
    ];
    this._startEpoch = 0;
    this._started = false;
    this._forcedPhase = null;
    this._beatMode = 'auto'; // auto | binaural | iso
    this._activeBeatType = 'iso';
    // Normalize em-dash to ASCII hyphen to avoid mojibake on some setups
    try {
      this.phases = (this.phases || []).map(function(p){
        if (!p) return p;
        if (p.name) { p.name = String(p.name).replace(/\u2014/g, ' - '); }
        return p;
      });
    } catch (e) {}
  }

  async init() {
    const res = await fetch(this.configUrl);
    this.cfg = await res.json();
    return this.cfg;
  }

  _createContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC({
        latencyHint: 'interactive',
        sampleRate: this.cfg.sampleRate
      });
    }
  }

  _gain(value = 1.0) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(value, this.ctx.currentTime);
    return g;
  }

  _tone(freq) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    return osc;
  }

  _brownNoiseBuffer(seconds = 3) {
    const sr = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, seconds * sr, sr);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      // Brown-ish noise via leaky integration
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      data[i] = lastOut * 3.5; // normalize-ish
    }
    return buffer;
  }

  _pinkNoiseBuffer(seconds = 3) {
    // Pink noise using Paul Kellet's filter approximation
    const sr = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, seconds * sr, sr);
    const data = buffer.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i=0;i<data.length;i++){
      const white = Math.random()*2-1;
      b0 = 0.99886*b0 + white*0.0555179;
      b1 = 0.99332*b1 + white*0.0750759;
      b2 = 0.96900*b2 + white*0.1538520;
      b3 = 0.86650*b3 + white*0.3104856;
      b4 = 0.55000*b4 + white*0.5329522;
      b5 = -0.7616*b5 - white*0.0168980;
      data[i] = (b0+b1+b2+b3+b4+b5+b6*0.5362)*0.11;
      b6 = white*0.115926;
    }
    return buffer;
  }

  _makeReverbImpulse(seconds = 1.8, decay = 2.5) {
    const sr = this.ctx.sampleRate;
    const length = seconds * sr;
    const impulse = this.ctx.createBuffer(2, length, sr);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        // Exponential decay noise impulse
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }

  _scheduleParam(param, when, value, ramp = null, endTime = null) {
    const t0 = when;
    if (ramp && endTime) {
      param.setValueAtTime(param.value, this._startEpoch + t0);
      param.linearRampToValueAtTime(value, this._startEpoch + endTime);
    } else {
      param.setValueAtTime(value, this._startEpoch + t0);
    }
  }

  async start() {
    this._createContext();
    const ctx = this.ctx;
    const cfg = this.cfg;

    // Master buses
    const dryBus = this._gain(1);
    const master = this._gain(0);
    const shelf = ctx.createBiquadFilter();
    shelf.type = 'highshelf';
    shelf.frequency.setValueAtTime(cfg.shelf.highStartHz, ctx.currentTime);
    shelf.gain.setValueAtTime(0, ctx.currentTime);

    // Reverb (parallel)
    const convolver = ctx.createConvolver();
    convolver.buffer = this._makeReverbImpulse();
    const reverbWet = this._gain(cfg.reverb.wetGain);

    // Connect graph
    const duck = this._gain(1); // para janelas de sil├¬ncio (m├│dulos opcionais)
    const panner = this.ctx.createStereoPanner();
    dryBus.connect(panner);
    panner.connect(duck).connect(master);
    // Optional archetypal mask (peaking around given Hz)
    const maskPeak = this.ctx.createBiquadFilter();
    maskPeak.type = 'peaking';
    maskPeak.frequency.setValueAtTime((this.cfg.mask && this.cfg.mask.hz) || 600, ctx.currentTime);
    maskPeak.Q.setValueAtTime(1.0, ctx.currentTime);
    maskPeak.gain.setValueAtTime((this.cfg.mask && this.cfg.mask.gainDb) || 0, ctx.currentTime);

    master.connect(maskPeak);
    maskPeak.connect(shelf);
    shelf.connect(ctx.destination);

    dryBus.connect(convolver);
    convolver.connect(reverbWet);
    reverbWet.connect(ctx.destination);

    // Tones
    const drone174 = this._tone(cfg.frequenciesHz.drone);
    const g174 = this._gain(0.20);
    drone174.connect(g174).connect(dryBus);

    // Optional fundamental (e.g., 396 Hz)
    let toneFund = null, gFund = null;
    if (cfg.frequenciesHz.fundamental) {
      toneFund = this._tone(cfg.frequenciesHz.fundamental);
      gFund = this._gain(0);
      toneFund.connect(gFund).connect(dryBus);
    }

    const tone432 = this._tone(432);
    const g432 = this._gain(0);
    tone432.connect(g432).connect(dryBus);

    const tone528 = this._tone(528);
    const g528 = this._gain(0);
    tone528.connect(g528).connect(dryBus);

    const tone639 = this._tone(639);
    const g639 = this._gain(0);
    tone639.connect(g639).connect(dryBus);

    const tone852 = this._tone(852);
    const g852 = this._gain(0);
    tone852.connect(g852).connect(dryBus);

    const tone963 = this._tone(963);
    const g963 = this._gain(0);
    tone963.connect(g963).connect(dryBus);

    // Brainwave: binaural (preferred) or isochronic fallback
    const preferBinaural = !!(cfg.brainwave && cfg.brainwave.preferBinaural);
    const carrierHz = (cfg.brainwave && cfg.brainwave.carrierHz) || 432;
    const bwHz = (cfg.brainwave && cfg.brainwave.binauralHz) || cfg.isochronicHz || 7.5;
    const canStereo = (ctx.destination.maxChannelCount || 2) >= 2;
    let useBinaural = preferBinaural && canStereo;

    // Isochronic path (default off; enabled if !useBinaural)
    const isoCarrier = this._tone(carrierHz);
    const isoGain = this._gain(0);
    isoCarrier.connect(isoGain).connect(dryBus);
    const lfo = this._tone(cfg.isochronicHz || bwHz);
    lfo.type = 'sine';
    const lfoScale = this._gain(0.0);
    const lfoOffset = new ConstantSourceNode(ctx, { offset: 0.0 });
    lfo.connect(lfoScale);
    lfoScale.connect(isoGain.gain);
    lfoOffset.connect(isoGain.gain);

    // Binaural path (two carriers L/R)
    let binL = null, binR = null, gBinL = null, gBinR = null, panL = null, panR = null;
    if (useBinaural) {
      const detune = bwHz / 2;
      binL = this._tone(carrierHz - detune);
      binR = this._tone(carrierHz + detune);
      gBinL = this._gain(0);
      gBinR = this._gain(0);
      panL = this.ctx.createStereoPanner(); panL.pan.setValueAtTime(-1, ctx.currentTime);
      panR = this.ctx.createStereoPanner(); panR.pan.setValueAtTime(1, ctx.currentTime);
      binL.connect(gBinL).connect(panL).connect(dryBus);
      binR.connect(gBinR).connect(panR).connect(dryBus);
    }

    // Start time for all sources (pre-buffer configurable)
    const prebuffer = cfg.prebufferSec || 2.0;
    const now = ctx.currentTime + prebuffer;
    this._startEpoch = now;

    // Noise bed
    const noiseGain = this._gain(0);
    const noiseType = (cfg.noiseType || 'brown').toLowerCase();
    const startables = [];
    let noise = null; // define to avoid ReferenceError in nodes bundle
    if (noiseType === 'pink+brownblend') {
      const pink = ctx.createBufferSource();
      pink.buffer = this._pinkNoiseBuffer(4);
      pink.loop = true;
      const brown = ctx.createBufferSource();
      brown.buffer = this._brownNoiseBuffer(4);
      brown.loop = true;
      const pinkG = this._gain(0.6);
      const brownG = this._gain(0.4);
      pink.connect(pinkG).connect(noiseGain);
      brown.connect(brownG).connect(noiseGain);
      startables.push(pink, brown);
    } else {
      noise = ctx.createBufferSource();
      noise.buffer = this._brownNoiseBuffer(4);
      noise.loop = true;
      const noiseLP = ctx.createBiquadFilter();
      noiseLP.type = 'lowpass';
      noiseLP.frequency.setValueAtTime(1200, ctx.currentTime);
      noise.connect(noiseLP).connect(noiseGain);
      startables.push(noise);
    }
    noiseGain.connect(dryBus);

    // Start oscillators/sources
    startables.push(
      drone174, tone432, tone528, tone639, tone852, tone963,
      isoCarrier, lfo, lfoOffset
    );
    if (toneFund) startables.push(toneFund);
    if (binL) startables.push(binL);
    if (binR) startables.push(binR);
    startables.forEach(n => { try { n.start(now); } catch (e) {} });

    // Schedule per-phase envelopes
    // Phase 1: master fade-in 2m; 432/528 emerge slowly over 5m
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(1.0, now + 120);

    g432.gain.setValueAtTime(0.0, now);
    g528.gain.setValueAtTime(0.0, now);
    if (cfg.moduleId === 'silencio_entre_os_raios') {
      g432.gain.linearRampToValueAtTime(0.10, now + 180);
      g528.gain.linearRampToValueAtTime(0.0, now + 180);
    } else if (cfg.moduleId === 'presenca_divina_acao') {
      g432.gain.linearRampToValueAtTime(0.12, now + 240);
      g528.gain.linearRampToValueAtTime(0.06, now + 300);
    } else if (cfg.moduleId === 'paz_por_do_sol') {
      g432.gain.linearRampToValueAtTime(0.12, now + 240);
      g528.gain.linearRampToValueAtTime(0.06, now + 300);
    } else {
      g432.gain.linearRampToValueAtTime(0.12, now + 300);
      g528.gain.linearRampToValueAtTime(0.12, now + 300);
    }
    if (gFund) { gFund.gain.setValueAtTime(0.0, now); gFund.gain.linearRampToValueAtTime(0.16, now + 180); }

    // Phase 2 (start @300s): add isochronic, noise, 639/852
    g639.gain.setValueAtTime(0.0, now + 300);
    g852.gain.setValueAtTime(0.0, now + 300);
    if (cfg.moduleId === 'silencio_entre_os_raios') {
      g639.gain.linearRampToValueAtTime(0.05, now + 360);
      g852.gain.linearRampToValueAtTime(0.0, now + 360);
    } else {
      g639.gain.linearRampToValueAtTime(0.08, now + 420);
      g852.gain.linearRampToValueAtTime(0.08, now + 420);
    }

    if (useBinaural) {
      // engage binaural gently
      gBinL.gain.setValueAtTime(0.0, now + 300);
      gBinR.gain.setValueAtTime(0.0, now + 300);
      gBinL.gain.linearRampToValueAtTime(0.08, now + 360);
      gBinR.gain.linearRampToValueAtTime(0.08, now + 360);
      // keep iso off
      lfoScale.gain.setValueAtTime(0.0, now + 300);
      lfoOffset.offset.setValueAtTime(0.0, now + 300);
      this._activeBeatType = 'binaural';
    } else {
      lfoScale.gain.setValueAtTime(0.0, now + 300);
      lfoScale.gain.linearRampToValueAtTime(0.04, now + 360);
      lfoOffset.offset.setValueAtTime(0.0, now + 300);
      lfoOffset.offset.linearRampToValueAtTime(0.06, now + 360);
      this._activeBeatType = 'iso';
    }

    // Noise level: if config noiseLevelDb given, convert to gain
    const noiseTarget = (typeof cfg.noiseLevelDb === 'number') ? Math.max(0.001, this._dbToGain(cfg.noiseLevelDb)) : 0.06;
    noiseGain.gain.setValueAtTime(0.0, now + 300);
    noiseGain.gain.linearRampToValueAtTime(noiseTarget, now + 360);

    // Phase 3 (start @3600s): add 963; boost highs + reverb 2ÔÇô3 dB over ~2m
    g963.gain.setValueAtTime(0.0, now + 3600);
    g963.gain.linearRampToValueAtTime(0.07, now + 3660);
    if (cfg && cfg.moduleId === 'silencio_entre_os_raios') {
      try {
        g963.gain.cancelScheduledValues(now + 3600);
      } catch {}
      g963.gain.setValueAtTime(0.0, now + 3600);
      g963.gain.linearRampToValueAtTime(0.0, now + 3660);
    }

    const phase3End = now + 3720; // +2m for tone and fx to settle
    shelf.gain.setValueAtTime(0.0, now + 3600);
    // Reverb wet gain +2.5 dB
    const wet0 = reverbWet.gain.value;
    const wetTarget = wet0 * this._dbToGain(cfg.reverb.boostDbPhase3);
    reverbWet.gain.setValueAtTime(wet0, now + 3600);
    reverbWet.gain.linearRampToValueAtTime(wetTarget, phase3End);

    // Also brighten using a gentle shelf
    shelf.gain.setValueAtTime(0.0, now + 3600);
    shelf.gain.linearRampToValueAtTime(cfg.shelf.phase3BoostDb, phase3End);

    // Phase 4 (start @4800s): remove highs + isochronic + extras; keep 174 and fade out at end
    // Reduce highs
    shelf.gain.linearRampToValueAtTime(cfg.shelf.phase4CutDb, now + 4920);
    // Remove isochronic + noise + extra tones
    lfoScale.gain.linearRampToValueAtTime(0.0, now + 4920);
    lfoOffset.offset.linearRampToValueAtTime(0.0, now + 4920);
    noiseGain.gain.linearRampToValueAtTime(0.0, now + 4920);
    g963.gain.linearRampToValueAtTime(0.0, now + 4920);
    g852.gain.linearRampToValueAtTime(0.0, now + 4920);
    g639.gain.linearRampToValueAtTime(0.0, now + 4920);
    g528.gain.linearRampToValueAtTime(0.0, now + 5100);
    g432.gain.linearRampToValueAtTime(0.0, now + 5100);

    // Keep 174 until final fade out
    g174.gain.setValueAtTime(g174.gain.value, now + 5100);
    g174.gain.linearRampToValueAtTime(0.0, now + 5400);
    master.gain.linearRampToValueAtTime(0.0001, now + 5400);

    // Pan LFO (optional)
    if (cfg.pan && (cfg.pan.lfoHz || cfg.pan.depth)) {
      const lfoPan = this._tone(cfg.pan.lfoHz || 0.03);
      const panDepth = (cfg.pan && (typeof cfg.pan.depth === 'number')) ? cfg.pan.depth : 0.8;
      const panScale = this._gain(panDepth);
      lfoPan.connect(panScale).connect(panner.pan);
      lfoPan.start(now);
      this.nodes.lfoPan = lfoPan;
      this.nodes.panScale = panScale;
      this.nodes.panner = panner;
    } else {
      this.nodes.panner = panner;
    }

    // Save for stop()
    this.nodes = {
      master, shelf, reverbWet, duck, panner,
      drone174, g174,
      tone432, g432, tone528, g528, tone639, g639, tone852, g852, tone963, g963,
      toneFund, gFund,
      isoCarrier, isoGain, lfo, lfoScale, lfoOffset,
      binL, gBinL, binR, gBinR,
      noise, noiseGain,
      maskPeak,
      noiseKind: noiseType
    };
    this._started = true;

    // Optional: schedule silence windows from config
    this._scheduleSilenceWindows(now);

    // Apply initial mode rule (auto/binaural/iso)
    this._applyMode(this._beatMode);
  }

  async pause() {
    if (!this.ctx || !this._started) return;
    try {
      const t = this.ctx.currentTime;
      if (this.nodes && this.nodes.master && this.nodes.master.gain) {
        try {
          this.nodes.master.gain.cancelScheduledValues(t);
          // quick soft mute before suspending (helps on some browsers)
          this.nodes.master.gain.setTargetAtTime(0.0001, t, 0.06);
        } catch (e) {}
      }
      await new Promise(function(res){ setTimeout(res, 120); });
      await this.ctx.suspend();
    } catch (e) {}
  }

  async resume() {
    if (!this.ctx || !this._started) return;
    try {
      await this.ctx.resume();
      const t = this.ctx.currentTime;
      if (this.nodes && this.nodes.master && this.nodes.master.gain) {
        try {
          this.nodes.master.gain.cancelScheduledValues(t);
          // bring master back smoothly
          this.nodes.master.gain.setTargetAtTime(1.0, t, 0.12);
        } catch (e) {}
      }
    } catch (e) {}
  }

  isPaused() { return !!this.ctx && this.ctx.state === 'suspended'; }

  fallbackToIso() {
    if (!this._started || !this.nodes) return;
    const now = this.ctx.currentTime;
    const n = this.nodes;
    try {
      if (n.gBinL) {
        n.gBinL.gain.linearRampToValueAtTime(0.0, now + 0.2);
        n.gBinR.gain.linearRampToValueAtTime(0.0, now + 0.2);
      }
      if (n.lfoScale && n.lfoOffset) {
        n.lfoScale.gain.cancelScheduledValues(now);
        n.lfoOffset.offset.cancelScheduledValues(now);
        n.lfoScale.gain.linearRampToValueAtTime(0.04, now + 0.4);
        n.lfoOffset.offset.linearRampToValueAtTime(0.06, now + 0.4);
      }
      // Track current mode/depth for diagnostics and E2E
      this._activeBeatType = 'iso';
      n.panDepth = 0.25;
    } catch {}
  }

  async fadeOutAndStop(seconds = 1.5) {
    if (!this.ctx || !this._started) return;
    try {
      const t = this.ctx.currentTime;
      this.nodes.master.gain.cancelScheduledValues(t);
      this.nodes.master.gain.setTargetAtTime(0.0001, t, Math.max(0.05, seconds / 5));
      await new Promise(res => setTimeout(res, seconds * 1000));
    } catch {}
    this.stop();
  }

  stop() {
    if (!this.ctx) return;
    try {
      this.ctx.close();
    } catch {}
    this.ctx = null;
    this.nodes = {};
    this._started = false;
    this._forcedPhase = null;
  }

  currentTime() {
    if (!this.ctx) return 0;
    return Math.max(0, Math.min(5400, this.ctx.currentTime - this._startEpoch));
  }

  currentPhaseIndex() {
    if (this._forcedPhase !== null) return this._forcedPhase;
    const t = this.currentTime();
    for (let i = 0; i < this.phases.length; i++) {
      const p = this.phases[i];
      if (t >= p.start && t < p.end) return i;
    }
    return this.phases.length - 1;
  }

  currentPhaseName() {
    const s = this.phases[this.currentPhaseIndex()].name;
    try {
      let out = String(s)
        .replace(/\u2014/g, ' - ')
        .replace(/ÔÇö/g, ' - ')
        .replace(/â€”/g, ' - ')
        .replace(/â€“/g, ' - ');
      // Remove diacritics to avoid mojibake on some Windows/Edge setups
      if (out && out.normalize) {
        out = out.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
      return out;
    } catch (e) { return s; }
  }

  _dbToGain(db) {
    return Math.pow(10, db / 20);
  }

  // Force-phase: quick crossfade to parameters of a target phase
  setPhaseIndex(index, rampSec = 1.0) {
    if (!this._started || !this.nodes.master) return;
    this._forcedPhase = Math.max(0, Math.min(3, index));
    const n = this.nodes;
    const t = this.ctx.currentTime;
    const ramp = (param, v) => {
      try {
        param.cancelScheduledValues(t);
        param.linearRampToValueAtTime(v, t + rampSec);
      } catch {}
    };

    // Defaults
    let g174 = 0.20, g432 = 0.12, g528 = 0.12, g639 = 0.0, g852 = 0.0, g963 = 0.0;
    let lfoDepth = 0.0, lfoBase = 0.0, noise = 0.0, shelfDb = 0.0, wetDb = 0.0;

    if (index === 0) {
      // Fase 1 ÔÇö Ativa├º├úo
      g639 = 0.0; g852 = 0.0; g963 = 0.0;
      lfoDepth = 0.0; lfoBase = 0.0; noise = 0.0; shelfDb = 0.0; wetDb = 0.0;
    } else if (index === 1) {
      // Fase 2 ÔÇö Harmonia
      g639 = 0.08; g852 = 0.08; g963 = 0.0;
      lfoDepth = 0.04; lfoBase = 0.06; noise = 0.06; shelfDb = 0.0; wetDb = 0.0;
    } else if (index === 2) {
      // Fase 3 ÔÇö Expans├úo
      g639 = 0.08; g852 = 0.08; g963 = 0.07;
      lfoDepth = 0.04; lfoBase = 0.06; noise = 0.06; shelfDb = this.cfg.shelf.phase3BoostDb; wetDb = this.cfg.reverb.boostDbPhase3;
    } else if (index === 3) {
      // Fase 4 ÔÇö Dissolu├º├úo
      g432 = 0.0; g528 = 0.0; g639 = 0.0; g852 = 0.0; g963 = 0.0;
      lfoDepth = 0.0; lfoBase = 0.0; noise = 0.0; shelfDb = this.cfg.shelf.phase4CutDb; wetDb = 0.0;
    }

    ramp(n.g174.gain, g174);
    ramp(n.g432.gain, g432);
    ramp(n.g528.gain, g528);
    ramp(n.g639.gain, g639);
    ramp(n.g852.gain, g852);
    ramp(n.g963.gain, g963);
    ramp(n.lfoScale.gain, lfoDepth);
    ramp(n.lfoOffset.offset, lfoBase);
    ramp(n.noiseGain.gain, noise);
    ramp(n.shelf.gain, shelfDb);
    if (wetDb !== 0.0) {
      const wetTarget = n.reverbWet.gain.value * this._dbToGain(wetDb);
      ramp(n.reverbWet.gain, wetTarget);
    }

    // When user jumps phases, ensure master is audible (do not keep long 2m fade)
    try {
      n.master.gain.cancelScheduledValues(t);
      n.master.gain.linearRampToValueAtTime(1.0, t + Math.max(0.3, rampSec));
    } catch (e) {}
  }

  setBeatMode(mode) {
    this._beatMode = mode || 'auto';
    this._applyMode(this._beatMode);
  }

  activeBeatType() { return this._activeBeatType; }

  _applyMode(mode) {
    if (!this._started || !this.nodes.master) return;
    const now = this.ctx.currentTime;
    const n = this.nodes;
    const cfg = this.cfg;
    const canStereo = (this.ctx.destination.maxChannelCount || 2) >= 2;
    let target = mode;
    if (mode === 'auto') {
      target = (document.visibilityState === 'visible' && canStereo) ? 'binaural' : 'iso';
    }

    if (target === 'binaural') {
      // ramp iso down, binaural up
      try {
        n.lfoScale.gain.linearRampToValueAtTime(0.0, now + 0.4);
        n.lfoOffset.offset.linearRampToValueAtTime(0.0, now + 0.4);
        if (n.gBinL && n.gBinR) {
          n.gBinL.gain.linearRampToValueAtTime(0.08, now + 0.6);
          n.gBinR.gain.linearRampToValueAtTime(0.08, now + 0.6);
        }
        if (n.panScale) n.panScale.gain.linearRampToValueAtTime(0.6, now + 0.6);
      } catch {}
      this._activeBeatType = 'binaural';
      n.panDepth = 0.6;
    } else { // iso
      try {
        if (n.gBinL && n.gBinR) {
          n.gBinL.gain.linearRampToValueAtTime(0.0, now + 0.4);
          n.gBinR.gain.linearRampToValueAtTime(0.0, now + 0.4);
        }
        n.lfoScale.gain.linearRampToValueAtTime(0.04, now + 0.6);
        n.lfoOffset.offset.linearRampToValueAtTime(0.06, now + 0.6);
        if (n.panScale) n.panScale.gain.linearRampToValueAtTime(0.25, now + 0.6); // ambiente: 0.2ÔÇô0.3
      } catch {}
      this._activeBeatType = 'iso';
      n.panDepth = 0.25;
    }
  }

  _scheduleSilenceWindows(startTime) {
    const cfg = this.cfg;
    if (!cfg.silenceWindows) return;
    const sw = cfg.silenceWindows;
    const every = Math.max(5, sw.everySec || 30);
    const dur = Math.max(0.5, sw.durationSec || 2.0);
    const depthDb = sw.depthDb || -18; // redu├º├úo de volume
    const fade = Math.max(20, sw.fadeMs || 100) / 1000;
    const minGain = Math.max(0.0001, this._dbToGain(depthDb));
    const total = 5400; // 90 min
    const g = this.nodes.duck.gain;
    const t0 = startTime + 8; // espera inicial pequena
    for (let t = 0; t < total; t += every) {
      const a = t0 + t;
      // fade down
      g.setValueAtTime(1.0, a);
      g.linearRampToValueAtTime(minGain, a + fade);
      // hold
      g.setValueAtTime(minGain, a + fade + Math.max(0, dur - 2 * fade));
      // fade up
      g.linearRampToValueAtTime(1.0, a + dur);
    }
  }
}

