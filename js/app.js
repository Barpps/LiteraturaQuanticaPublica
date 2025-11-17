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
const moduleSel = document.getElementById('moduleSel');

// Garante lista de módulos consistente (inclui PLENITUDE)
if (moduleSel) {
  moduleSel.innerHTML = [
    { v: 'static/config/modules/frequencias_diarias.json', t: 'Prosperidade Consciente + Serenidade' },
    { v: 'static/config/modules/silencio_entre_os_raios.json', t: 'O Silêncio entre os Raios' },
    { v: 'static/config/modules/presenca_divina_acao.json', t: 'Presença Divina na Ação' },
    { v: 'static/config/modules/paz_por_do_sol.json', t: 'PAZ — Pôr do Sol da Integração' },
    { v: 'static/config/modules/plenitude_coluna_de_luz.json', t: 'PLENITUDE — Coluna de Luz do Todo' }
  ].map(function(o, i){
    return '<option value=\"' + o.v + '\"' + (i===0 ? ' selected' : '') + '>' + o.t + '</option>';
  }).join('');
}

if (moduleSel) {
  const optPinturaViva = document.createElement('option');
  optPinturaViva.value = 'static/config/modules/pintura_viva.json';
  optPinturaViva.textContent = 'Pintura Viva na Prosperidade Serena';
  moduleSel.appendChild(optPinturaViva);
}

// Use relative path so it works both locally and on GitHub Pages subpaths
let configUrl = (moduleSel && moduleSel.value) ? moduleSel.value : 'static/config/modules/frequencias_diarias.json';
let audio = new SessionAudio(configUrl);
const visuals = new Visuals(canvas);

function phaseLabel(idx) {
  const labels = [
    'Fase 1 - Ativar',
    'Fase 2 - Harmonizar',
    'Fase 3 - Expandir',
    'Fase 4 - Dissolver'
  ];
  return (idx >= 0 && idx < labels.length) ? labels[idx] : ('Fase ' + (idx + 1));
}

function attachPhaseLabelOverride(target) {
  if (target && typeof target.currentPhaseName === 'function' && typeof target.currentPhaseIndex === 'function') {
    const originalCurrentPhaseIndex = target.currentPhaseIndex.bind(target);
    target.currentPhaseName = function () {
      const idx = originalCurrentPhaseIndex();
      return phaseLabel(idx);
    };
  }
}

attachPhaseLabelOverride(audio);

// Override rótulos dos módulos na combo, para nomes finais
if (moduleSel) {
  const labelOverrides = {
    'static/config/modules/frequencias_diarias.json': 'Prosperidade + Serenidade',
    'static/config/modules/silencio_entre_os_raios.json': 'O Silêncio entre os Raios',
    'static/config/modules/presenca_divina_acao.json': 'Presença na Ação',
    'static/config/modules/paz_por_do_sol.json': 'Pôr do Sol da Integração',
    'static/config/modules/plenitude_coluna_de_luz.json': 'Plenitude + Luz',
    'static/config/modules/pintura_viva.json': 'Pintura Viva na Prosperidade Serena'
  };
  for (let i = 0; i < moduleSel.options.length; i++) {
    const opt = moduleSel.options[i];
    const label = labelOverrides[opt.value];
    if (label) opt.textContent = label;
  }
}
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
  let cfg;
  try {
    cfg = await audio.init();
  } catch (e) {
    try { console.error('Falha ao carregar módulo inicial', configUrl, e); } catch (_) {}
    try { alert('Não foi possível carregar o módulo inicial.\nVerifique sua conexão e tente novamente.'); } catch (_) {}
    return;
  }
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
  // Tema especial para Pintura Viva: ondas no fundo
  if (configUrl.indexOf('pintura_viva') !== -1) {
    document.body.classList.add('theme-pintura-viva');
  } else {
    document.body.classList.remove('theme-pintura-viva');
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
if (moduleSel) moduleSel.addEventListener('change', async function(){
  const wasPlaying = audio && audio._started;
  const prevUrl = configUrl;
  const prevAudio = audio;
  const newUrl = moduleSel.value;

  const nextAudio = new SessionAudio(newUrl);
  attachPhaseLabelOverride(nextAudio);

  let cfg;
  try {
    cfg = await nextAudio.init();
  } catch (e) {
    try { console.error('Falha ao trocar de módulo', newUrl, e); } catch (_) {}
    try { alert('Não foi possível carregar o novo módulo.\nMantendo o módulo anterior.'); } catch (_) {}
    moduleSel.value = prevUrl;
    window.audio = prevAudio;
    return;
  }

  if (prevAudio) await prevAudio.fadeOutAndStop(0.8);

  configUrl = newUrl;
  audio = nextAudio;
  window.audio = audio;

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
  if (configUrl.indexOf('pintura_viva') !== -1) {
    document.body.classList.add('theme-pintura-viva');
  } else {
    document.body.classList.remove('theme-pintura-viva');
  }
  if (wasPlaying) playBtn.click();
});

// Beat mode selector
const modeSel = document.getElementById('modeSel');
modeSel.addEventListener('change', function(){ if (audio && audio.setBeatMode) { audio.setBeatMode(modeSel.value); } });

init();

// Public UI: keep fullscreen button above control bar
(function(){
  try{
    var btn=document.getElementById('fsBtn');
    var controls=document.getElementById('controls');
    if(!btn||!controls) return;
    function update(){
      try {
        var h=controls.getBoundingClientRect().height||56;
        btn.style.bottom = (h + 14) + 'px';
      } catch(e){}
    }
    window.addEventListener('resize',update);
    window.addEventListener('orientationchange',update);
    setTimeout(update,100);
  }catch(e){}
})();
