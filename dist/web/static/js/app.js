import { SessionAudio } from './audioEngine.js';
import { Visuals } from './visuals.js';

const playBtn = document.getElementById('play');
const stopBtn = document.getElementById('stop');
const timerEl = document.getElementById('timer');
const phaseEl = document.getElementById('phase');
const prevPhaseBtn = document.getElementById('prevPhase');
const nextPhaseBtn = document.getElementById('nextPhase');
const exitBtn = document.getElementById('exitBtn');
const modalIntent = document.getElementById('modal-intent');
const modalSeal = document.getElementById('modal-seal');
const intentOk = document.getElementById('intent-ok');
const sealOk = document.getElementById('seal-ok');
const sealCancel = document.getElementById('seal-cancel');
const intentTitle = document.getElementById('intent-title');
const intentText = document.getElementById('intent-text');
const sealTitle = document.getElementById('seal-title');
const sealText = document.getElementById('seal-text');
const canvas = document.getElementById('viz');
const bwStatus = document.getElementById('bwStatus');

let configUrl = '/static/config/modules/frequencias_diarias.json';
let audio = new SessionAudio(configUrl);
const visuals = new Visuals(canvas);
// Expose for quick console checks
window.audio = audio;
window.visuals = visuals;

let timerInterval = null;

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return (String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0'));
}

function normalizeLabel(s){
  try {
    return String(s)
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, ' - ')
      .replace(/ÔÇö|â€”|â€“/g, ' - ')
      .replace(/\s*-\s*/g, ' - ');
  } catch (e) { return s; }
}

async function init() {
  const cfg = await audio.init();
  if (cfg.popups && cfg.popups.intent) {
    intentTitle.textContent = cfg.popups.intent.title || intentTitle.textContent;
    intentText.innerHTML = cfg.popups.intent.message || intentText.innerHTML;
  }
  if (cfg.popups && cfg.popups.seal) {
    sealTitle.textContent = cfg.popups.seal.title || sealTitle.textContent;
    sealText.innerHTML = cfg.popups.seal.message || sealText.innerHTML;
  }
  visuals.init({
    breathingBpm: cfg.breathingBpm,
    rotationRadPerSec: cfg.rotationRadPerSec,
    brightnessMax: cfg.brightnessMax,
    petals: (cfg.visual ? cfg.visual.flowerPetals : undefined),
    flowerOpacity: (cfg.visual ? cfg.visual.flowerOpacity : undefined),
    palette: (cfg.visual ? cfg.visual.palette : undefined),
    centralSphere: (cfg.visual ? cfg.visual.centralSphere : undefined),
    geometry: (cfg.visual ? cfg.visual.geometry : undefined),
    maxMicropulsesPerCycle: (cfg.visual ? cfg.visual.maxMicropulsesPerCycle : undefined)
  });
  if (cfg.visual && cfg.visual.palette && cfg.visual.palette.bg1) {
    const p = cfg.visual.palette;
    document.body.style.setProperty('--bg1', p.bg1);
    document.body.style.setProperty('--bg2', p.bg2 || p.bg1);
    document.body.style.setProperty('--bg3', p.bg3 || p.bg2 || p.bg1);
  }
  visuals.setAudioTimeProvider(function(){ return audio.currentTime(); });
  visuals.animate();
}

let intentionShown = false;

async function enterFullscreenIfPossible() {
  const docEl = document.documentElement;
  if (docEl.requestFullscreen) {
    try { await docEl.requestFullscreen(); } catch (e) {}
  }
}

function showModal(el) { el.classList.remove('hidden'); }
function hideModal(el) { el.classList.add('hidden'); }

window.__ringPlay = async function () {
  try {
    if (audio && audio._started && audio.isPaused && audio.isPaused()) {
      await audio.resume();
      visuals.setActive(true);
      return;
    }
    if (!intentionShown) {
      showModal(modalIntent);
      intentOk.focus();
      return;
    }
    await audio.start();
    visuals.setActive(true);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function(){
      try {
        const t = audio.currentTime();
        timerEl.textContent = (formatTime(t) + ' / 90:00');
        phaseEl.textContent = normalizeLabel(audio.currentPhaseName());
        visuals.setPhase(audio.currentPhaseIndex());
        if (audio.activeBeatType) {
          const mode = audio.activeBeatType();
          bwStatus.textContent = (mode === 'binaural') ? 'Binaural ativo' : 'Isocrônico ativo';
        }
      } catch (e) {}
    }, 500);
  } catch (e) { try { console.error('audio.start() failed', e); } catch(_) {} }
};
playBtn.addEventListener('click', window.__ringPlay);

intentOk.addEventListener('click', async function(){
  hideModal(modalIntent);
  intentionShown = true;
  await enterFullscreenIfPossible();
  try {
    if (screen.orientation && screen.orientation.lock && window.innerHeight > window.innerWidth) {
      await screen.orientation.lock('landscape');
    }
  } catch (e) {}
  playBtn.click();
});

modalIntent.addEventListener('keydown', function(e){
  if (e.key === 'Enter') { intentOk.click(); }
});

window.__ringStop = async function(){
  try { if (audio && audio.pause) await audio.pause(); } catch (e) {}
  visuals.setActive(false);
};
stopBtn.addEventListener('click', window.__ringStop);

window.__ringPrev = function(){
  const idx = Math.max(0, audio.currentPhaseIndex() - 1);
  audio.setPhaseIndex(idx, 1.0);
  visuals.setPhase(idx);
  phaseEl.textContent = normalizeLabel(audio.currentPhaseName());
};
prevPhaseBtn.addEventListener('click', window.__ringPrev);

window.__ringNext = function(){
  const idx = Math.min(3, audio.currentPhaseIndex() + 1);
  audio.setPhaseIndex(idx, 1.0);
  visuals.setPhase(idx);
  phaseEl.textContent = normalizeLabel(audio.currentPhaseName());
};
nextPhaseBtn.addEventListener('click', window.__ringNext);

window.__ringExit = function(){
  showModal(modalSeal);
  sealOk.focus();
};
exitBtn.addEventListener('click', window.__ringExit);

sealOk.addEventListener('click', async function(){
  await audio.fadeOutAndStop(1.5);
  visuals.setActive(false);
  if (document.fullscreenElement) {
    try { await document.exitFullscreen(); } catch (e) {}
  }
  hideModal(modalSeal);
  if (timerInterval) clearInterval(timerInterval);
  timerEl.textContent = '00:00 / 90:00';
  phaseEl.textContent = 'Pronto';
});

sealCancel.addEventListener('click', function(){ hideModal(modalSeal); });
modalSeal.addEventListener('keydown', function(e){
  if (e.key === 'Escape') { sealCancel.click(); }
  if (e.key === 'Enter') { sealOk.click(); }
});

// Fullscreen auto-hide controls
const controls = document.getElementById('controls');
let hideTimer = null;
function scheduleHideControls() {
  if (!document.fullscreenElement) return;
  controls.classList.remove('hidden');
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(function(){ controls.classList.add('hidden'); }, 3000);
}
function onFsChange() {
  const fs = !!document.fullscreenElement;
  document.body.classList.toggle('is-fullscreen', fs);
  if (fs) { controls.classList.remove('hidden'); scheduleHideControls(); }
  else { controls.classList.remove('hidden'); }
}
document.addEventListener('fullscreenchange', onFsChange);
document.addEventListener('mousemove', scheduleHideControls);
document.addEventListener('touchstart', scheduleHideControls);

// Fallback binaural->iso when tab hidden
document.addEventListener('visibilitychange', function(){
  if (document.visibilityState === 'hidden' && audio && audio.fallbackToIso) {
    audio.fallbackToIso();
  }
});

// Re-entry fullscreen
const fsBtn = document.getElementById('fsBtn');
fsBtn.addEventListener('click', function(){ enterFullscreenIfPossible(); });

// Module selector
const moduleSel = document.getElementById('moduleSel');
moduleSel.addEventListener('change', async function(){
  const wasPlaying = audio && audio._started;
  if (audio) await audio.fadeOutAndStop(0.8);
  configUrl = moduleSel.value;
  audio = new SessionAudio(configUrl);
  window.audio = audio;
  const cfg = await audio.init();
  if (cfg.popups && cfg.popups.intent) {
    intentTitle.textContent = cfg.popups.intent.title || intentTitle.textContent;
    intentText.innerHTML = cfg.popups.intent.message || intentText.innerHTML;
  }
  if (cfg.popups && cfg.popups.seal) {
    sealTitle.textContent = cfg.popups.seal.title || sealTitle.textContent;
    sealText.innerHTML = cfg.popups.seal.message || sealText.innerHTML;
  }
  visuals.init({
    breathingBpm: cfg.breathingBpm,
    rotationRadPerSec: cfg.rotationRadPerSec,
    brightnessMax: cfg.brightnessMax,
    petals: (cfg.visual ? cfg.visual.flowerPetals : undefined),
    flowerOpacity: (cfg.visual ? cfg.visual.flowerOpacity : undefined),
    palette: (cfg.visual ? cfg.visual.palette : undefined),
    centralSphere: (cfg.visual ? cfg.visual.centralSphere : undefined),
    geometry: (cfg.visual ? cfg.visual.geometry : undefined),
    maxMicropulsesPerCycle: (cfg.visual ? cfg.visual.maxMicropulsesPerCycle : undefined)
  });
  visuals.setAudioTimeProvider(function(){ return audio.currentTime(); });
  if (cfg.visual && cfg.visual.palette && cfg.visual.palette.bg1) {
    const p = cfg.visual.palette;
    document.body.style.setProperty('--bg1', p.bg1);
    document.body.style.setProperty('--bg2', p.bg2 || p.bg1);
    document.body.style.setProperty('--bg3', p.bg3 || p.bg2 || p.bg1);
  }
  if (wasPlaying) playBtn.click();
});

// Beat mode selector
const modeSel = document.getElementById('modeSel');
modeSel.addEventListener('change', function(){ if (audio && audio.setBeatMode) { audio.setBeatMode(modeSel.value); } });

init();
