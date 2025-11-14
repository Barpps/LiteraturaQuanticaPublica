import { HarmoniaAudio } from './harmonia_audio.js';

const presetSelect = document.getElementById('presetSelect');
const freqSelect = document.getElementById('freqSelect');
const binauralCheckbox = document.getElementById('binauralCheckbox');
const overlayCheckbox = document.getElementById('overlayCheckbox');
const volumeRange = document.getElementById('volumeRange');
const volumeLabel = document.getElementById('volumeLabel');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const stateText = document.getElementById('stateText');
const helperText = document.getElementById('helperText');
const geometryOverlay = document.getElementById('geometryOverlay');

const audio = new HarmoniaAudio();
window.harmoniaAudio = audio;

const PRESETS = {
  harmonia: {
    label: 'Harmonia',
    colors: {
      start: '#c5961f',
      mid: '#e0b64f',
      end: '#3c2a10'
    },
    defaultFreq: 528,
    binauralHz: 6
  },
  paz: {
    label: 'Paz',
    colors: {
      start: '#2f6f92',
      mid: '#58b3c5',
      end: '#041b26'
    },
    defaultFreq: 639,
    binauralHz: 6
  },
  conexao: {
    label: 'Conexão',
    colors: {
      start: '#4b3b9c',
      mid: '#7f5fd6',
      end: '#0a0c24'
    },
    defaultFreq: 741,
    binauralHz: 7
  },
  prosperidade: {
    label: 'Prosperidade',
    colors: {
      start: '#0b5c3b',
      mid: '#18a96c',
      end: '#031712'
    },
    defaultFreq: 888,
    binauralHz: 6
  }
};

function setState(kind) {
  if (kind === 'idle') {
    stateText.textContent = 'Aguardando seu toque para iniciar a Harmonia.';
  } else if (kind === 'playing') {
    stateText.textContent = 'Harmonia ativa. Use o som como pano de fundo suave.';
  } else if (kind === 'paused') {
    stateText.textContent = 'Harmonia em pausa. Toque em Play para retomar.';
  } else if (kind === 'error') {
    stateText.textContent = 'O navegador bloqueou o áudio. Toque em Play novamente ou verifique permissões.';
  }
}

function applyPreset(key) {
  const preset = PRESETS[key] || PRESETS.harmonia;
  const root = document.documentElement;
  root.style.setProperty('--harmonia-start', preset.colors.start);
  root.style.setProperty('--harmonia-mid', preset.colors.mid);
  root.style.setProperty('--harmonia-end', preset.colors.end);
  audio.setBinauralOffset(preset.binauralHz);

  if (preset.defaultFreq) {
    const freqStr = String(preset.defaultFreq);
    if (freqSelect) {
      freqSelect.value = freqStr;
    }
    audio.setBaseFrequency(preset.defaultFreq);
  }
}

function updateVolumeLabel() {
  const val = Number(volumeRange.value || 0);
  const pct = Math.round((val / 0.6) * 100);
  volumeLabel.textContent = isFinite(pct) ? (pct + '%') : '';
}

presetSelect.addEventListener('change', function () {
  applyPreset(presetSelect.value);
});

freqSelect.addEventListener('change', function () {
  const v = parseFloat(freqSelect.value);
  if (v > 0) {
    audio.setBaseFrequency(v);
  }
});

binauralCheckbox.addEventListener('change', function () {
  const enabled = binauralCheckbox.checked;
  audio.setBinaural(enabled);
  if (enabled) {
    if (!audio.canBinaural()) {
      helperText.textContent = 'Modo binaural ativo. Use fones estéreo para melhor efeito.';
    } else {
      helperText.textContent = 'Modo binaural ativo. Recomendado uso com fones.';
    }
  } else {
    helperText.textContent = '';
  }
});

overlayCheckbox.addEventListener('change', function () {
  if (!geometryOverlay) return;
  if (overlayCheckbox.checked) {
    geometryOverlay.classList.remove('off');
  } else {
    geometryOverlay.classList.add('off');
  }
});

volumeRange.addEventListener('input', function () {
  const v = parseFloat(volumeRange.value);
  audio.setVolume(v);
  updateVolumeLabel();
});
volumeRange.addEventListener('change', function () {
  const v = parseFloat(volumeRange.value);
  audio.setVolume(v);
  updateVolumeLabel();
});

playBtn.addEventListener('click', async function () {
  try {
    await audio.play();
    setState('playing');
  } catch (e) {
    setState('error');
  }
});

pauseBtn.addEventListener('click', async function () {
  await audio.pause();
  setState('paused');
});

async function enterFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    try {
      await el.requestFullscreen();
    } catch (e) {}
  }
}

fullscreenBtn.addEventListener('click', function () {
  enterFullscreen();
});

window.addEventListener('beforeunload', function () {
  audio.stopAndClose();
});

// Estado inicial
applyPreset('harmonia');
audio.setVolume(parseFloat(volumeRange.value || '0.3'));
updateVolumeLabel();
setState('idle');

