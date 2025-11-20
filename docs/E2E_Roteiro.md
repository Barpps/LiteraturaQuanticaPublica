# Roteiro Rápido — E2E & Relatórios (RingLight)

## Rotas e gatilhos
- `/debug` — página de diagnóstico com overlay E2E.
- `/debug?autorun=1&autoexport=1` — roda E2E completo e exporta JSON para Downloads.
- Scripts Windows: `RingLight_E2E_Autorun.bat` (ou `RingLight_Iniciar.bat DEBUG` para abrir `/debug` manual).

## Passo a passo manual (desktop)
1) Iniciar servidor (`RingLight_Iniciar.bat` ou `python app.py`).
2) Abrir `/debug`.
3) Confirmar que o overlay mostra botões **Full E2E** e **Exportar Relatório**.
4) Clicar em **Full E2E** → esperar conclusão; checar log no painel.
5) Clicar em **Exportar Relatório** → confirmar download (padrão: `ringlight_e2e_report.json`).

## Passo a passo autorun (desktop)
1) Executar `RingLight_E2E_Autorun.bat` (ou abrir `/debug?autorun=1&autoexport=1`).
2) Aguardar 30s se servidor não estiver iniciado (script inicia o Flask).
3) Validar que o navegador abriu `/debug` com parâmetros `autorun=1&autoexport=1`.
4) Verificar em Downloads se o arquivo `ringlight_e2e_report.json` foi salvo.

## Itens a conferir durante o E2E
- PLAY inicia áudio; modais de intenção/selamento aparecem e aceitam teclado.
- Timer avança; fase atual reflete labels das 4 fases.
- Status binaural/iso muda conforme beat mode.
- Troca de módulo não quebra (fallback de erro mantém anterior).
- Fullscreen entra/sai sem travas; controles auto-escondem em FS.
- Pintura Viva tema ok quando parâmetro/module ativo.

## Relatórios existentes
- `local-report.json`, `uat-report.json` — baselines prévias (15/11/2025). Observação: podem ter sido salvos com encoding misto; mantenha-os como referência e gere um novo `ringlight_e2e_report.json` via autorun para comparar.

## Dicas rápidas
- Se o áudio não iniciar, clique PLAY (gesto requerido) e teste modo isocrônico.
- Se fetch de módulo falhar, alerta mantém módulo atual (não interrompe E2E principal).
- Para repetir testes em UAT/Pintura Viva, abra `/UAT` e depois `/debug` no mesmo servidor.
