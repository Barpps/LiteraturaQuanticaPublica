// Edge/Chrome-safe E2E runner. No optional chaining, no top-level await.

function qs(id){ return document.getElementById(id); }
function log(s, cls){ var b = qs('e2eBody'); if(!b) return; var p = document.createElement('div'); if(cls) p.className = cls; p.textContent = s; b.appendChild(p); b.scrollTop = b.scrollHeight; }
function sleep(ms){ return new Promise(function(res){ setTimeout(res, ms); }); }
function now(){ return (performance && performance.now ? performance.now() : Date.now()); }

function downloadJson(name, data){
  try {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name || 'ringlight_e2e_report.json';
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
  } catch(e) {}
}

function getParams(){
  var out = {};
  try {
    (window.location.search.replace('?','').split('&') || []).forEach(function(kv){
      var p = kv.split('='); if (p.length >= 1) out[decodeURIComponent(p[0])] = decodeURIComponent(p[1]||'');
    });
  } catch(e){}
  return out;
}

function label(s){
  try {
    return String(s)
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, ' - ')
      .replace(/ÔÇö|â€”|â€“/g, ' - ')
      .replace(/\s*-\s*/g, ' - ');
  } catch(e) { return s; }
}

async function runModule(modName, cfgUrl){
  var report = { module: modName, cfgUrl: cfgUrl, steps: [], ok: true };
  function step(name, ok, notes){ report.steps.push({ name: name, ok: !!ok, notes: notes||'' }); if(!ok) report.ok=false; }

  // Switch module via UI to reuse app.js init
  try {
    var moduleSel = qs('moduleSel');
    moduleSel.value = cfgUrl;
    var evt = new Event('change'); moduleSel.dispatchEvent(evt);
    log('Carregando: ' + modName, 'mono');
  } catch(e) { step('Selecionar módulo', false, String(e)); return report; }

  await sleep(200);
  var audio = window.audio, visuals = window.visuals;
  var cfg = null;
  try {
    var cfgRes = await fetch(cfgUrl); cfg = await cfgRes.json();
    step('JSON carregado', true, 'ok');
    // Basic props
    var hasGeom = !!(cfg.visual && cfg.visual.geometry);
    var hasRingDial = (cfg.visual && cfg.visual.geometry && (cfg.visual.geometry.ringLineWidth!=null));
    var hasSecAlpha = (cfg.visual && cfg.visual.geometry && (cfg.visual.geometry.secondaryPulseAlpha!=null || cfg.visual.geometry.secondaryPulseAlpha===null));
    step('Propriedades visuais', (hasGeom && hasRingDial && hasSecAlpha), 'geometry/ringLineWidth/secondaryPulseAlpha');
  } catch(e){ step('Carregar JSON', false, String(e)); }

  // Start audio with a user gesture proxy: click PLAY programmatically (still runs under the Full E2E button click)
  try {
    if (window.__ringPlay) { await window.__ringPlay(); }
    await sleep(3000); // prebuffer ~2.5s
    audio = window.audio; visuals = window.visuals;
    step('Audio start', (audio && audio._started), 'started=' + (audio && audio._started));
  } catch(e){ step('Audio start', false, String(e)); }

  // Engine checks
  try {
    var n = (audio && audio.nodes) || {};
    var has432 = !!(n.tone432 && n.tone432.frequency);
    var has174 = !!(n.drone174 && n.drone174.frequency);
    var okHz = has432 && has174;
    step('Tons base (432/174)', okHz, okHz? 'ok':'osc ausente');

    var mode = (audio && audio.activeBeatType && audio.activeBeatType()) || 'n/a';
    step('Beat mode ativo', (mode==='binaural' || mode==='iso'), mode);

    // Module-specific tones/mask
    var want528 = false, want963 = false, wantFund = false, wantMask = false, wantBlend = false;
    try {
      var tones = (cfg && cfg.frequenciesHz && cfg.frequenciesHz.tones) || [];
      want528 = tones.indexOf(528) >= 0;
      want963 = tones.indexOf(963) >= 0;
      wantFund = !!(cfg && cfg.frequenciesHz && cfg.frequenciesHz.fundamental);
      wantMask = !!(cfg && cfg.mask && typeof cfg.mask.hz === 'number');
      wantBlend = ((cfg && (cfg.noiseType||'').toLowerCase()) === 'pink+brownblend');
    } catch(e){}

    var ok528 = !want528 || !!(n.tone528 && n.g528);
    var ok963 = !want963 || !!(n.tone963 && n.g963);
    var okFund = !wantFund || !!(n.toneFund && n.gFund);
    step('Tons por módulo', (ok528 && ok963 && okFund), JSON.stringify({has528: !!(n.tone528), has963: !!(n.tone963), hasFund: !!(n.toneFund)}));

    // Mask 600Hz +2dB (PAZ)
    var okMask = !wantMask || (n.maskPeak && Math.abs(n.maskPeak.gain.value - ((cfg && cfg.mask && cfg.mask.gainDb)||0)) < 0.6);
    step('Máscara 600Hz', okMask, n.maskPeak ? ('gain=' + n.maskPeak.gain.value.toFixed(2)) : 'no mask');

    // Noise blend kind
    var okNoise = !wantBlend || (n.noiseKind === 'pink+brownblend');
    step('Ruído pink+brownBlend', okNoise, 'kind=' + (n.noiseKind||'n/a'));
  } catch(e){ step('Engine nodes', false, String(e)); }

  // Visual checks
  try {
    var geom = visuals && visuals.geometry;
    var okGeom = !!geom;
    var okRingDial = (geom && (visuals.ringLineWidth!=null));
    // Accept null (dynamic) or numeric secondaryPulseAlpha as OK
    var okSecAlpha = (geom && (visuals.secondaryPulseAlpha===null || typeof visuals.secondaryPulseAlpha === 'number'));
    var okMicrop = (!visuals.maxMicropulsesPerCycle || visuals.maxMicropulsesPerCycle <= 3);
    var okRot = (visuals.rotSpeed >= 0.03 && visuals.rotSpeed <= 0.1);
    step('Visual geometry', (okGeom && okRingDial && okSecAlpha && okMicrop && okRot), JSON.stringify({type: geom&&geom.type, ringLineWidth: visuals.ringLineWidth, secAlpha: visuals.secondaryPulseAlpha, micropulses: visuals.maxMicropulsesPerCycle, rot: visuals.rotSpeed}));
  } catch(e){ step('Visual state', false, String(e)); }

  // Phase and stop/resume
  try {
    var p0 = audio.currentPhaseIndex();
    audio.setPhaseIndex(Math.min(3, p0+1), 0.5);
    visuals.setPhase(Math.min(3, p0+1));
    await sleep(800);
    step('Troca de fase', (audio.currentPhaseIndex() !== p0), 'p=' + audio.currentPhaseIndex());

    await audio.pause(); await sleep(200);
    var paused = (audio.ctx && audio.ctx.state === 'suspended');
    await audio.resume(); await sleep(200);
    var running = (audio.ctx && audio.ctx.state === 'running');
    step('Stop/Resume', (paused && running), 'paused=' + paused + ', running=' + running);
  } catch(e){ step('Fase/STOP', false, String(e)); }

  // Mode switching + fallback
  try {
    var modeSel = qs('modeSel');
    function setMode(m){ modeSel.value = m; var evt = new Event('change'); modeSel.dispatchEvent(evt); }
    setMode('binaural'); await sleep(900);
    var m1 = audio.activeBeatType();
    var pan1 = (audio.nodes && (audio.nodes.panDepth!=null ? audio.nodes.panDepth : (audio.nodes.panScale && audio.nodes.panScale.gain.value))) || 0;
    var ok1 = (m1==='binaural' && pan1 > 0.4);
    step('Modo Fones (Binaural)', ok1, 'mode=' + m1 + ', panDepth=' + (pan1.toFixed?pan1.toFixed(2):pan1));

    setMode('iso'); await sleep(900);
    var m2 = audio.activeBeatType();
    var pan2 = (audio.nodes && (audio.nodes.panDepth!=null ? audio.nodes.panDepth : (audio.nodes.panScale && audio.nodes.panScale.gain.value))) || 0;
    var ok2 = (m2==='iso' && pan2 <= 0.3 + 1e-3);
    step('Modo Ambiente (Isocrônico)', ok2, 'mode=' + m2 + ', panDepth=' + (pan2.toFixed?pan2.toFixed(2):pan2));

    setMode('auto'); await sleep(600);
    // Fallback explícito
    if (audio.fallbackToIso) { audio.fallbackToIso(); }
    await sleep(600);
    var mf = audio.activeBeatType();
    var okFbk = (mf==='iso');
    step('Fallback para Isocrônico', okFbk, 'mode=' + mf);

    // Retorno ao Auto (esperado binaural em estéreo)
    setMode('auto'); await sleep(800);
    var ma = audio.activeBeatType();
    step('Retorno Auto', (ma==='binaural' || ma==='iso'), 'mode=' + ma);
  } catch(e){ step('Modo/Fallback', false, String(e)); }

  return report;
}

async function runE2E(){
  var report = { ts: new Date().toISOString(), results: [], ok: true, ua: navigator.userAgent };
  var modules = [
    { n:'Prosperidade Consciente + Serenidade', u:'static/config/modules/frequencias_diarias.json' },
    { n:'O Silêncio entre os Raios', u:'static/config/modules/silencio_entre_os_raios.json' },
    { n:'Presença Divina na Ação', u:'static/config/modules/presenca_divina_acao.json' },
    { n:'PAZ — Pôr do Sol da Integração', u:'static/config/modules/paz_por_do_sol.json' }
  ];

  log('Iniciando Full E2E...', 'mono');
  for (var i=0;i<modules.length;i++){
    var r = await runModule(modules[i].n, modules[i].u);
    report.results.push(r);
    log((r.ok? 'OK: ':'FALHA: ') + modules[i].n, (r.ok? 'ok' : 'err'));
    if(!r.ok) report.ok=false;
  }
  log('E2E concluído: ' + (report.ok? 'OK' : 'FALHAS'), (report.ok? 'ok':'err'));
  window.__E2E_REPORT__ = report;
  return report;
}

function hookUI(){
  var btn = qs('btnE2E');
  if (btn) btn.addEventListener('click', function(){
    runE2E();
  });
  var exp = qs('btnExport');
  if (exp) exp.addEventListener('click', function(){
    var r = window.__E2E_REPORT__ || { note: 'Sem dados. Rode o Full E2E primeiro.' };
    downloadJson('ringlight_e2e_report.json', r);
  });
}

function autorunIfRequested(){
  var p = getParams();
  if (p && (p.autorun==='1' || p.autorun==='true')) {
    // Nota: precisa de clique do usuário em alguns navegadores para iniciar áudio;
    // autorun aqui dispara a sequência, mas o primeiro PLAY ainda pode requerer gesto.
    setTimeout(function(){
      try { runE2E().then(function(rep){ if (p.autoexport==='1' || p.autoexport==='true') downloadJson('ringlight_e2e_report.json', rep); }); } catch(e){}
    }, 300);
  }
}

// Boot
hookUI();
autorunIfRequested();
