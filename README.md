# RingLight — Sessão 90 min (Flask + WebAudio + Canvas)

Estrutura estável para executar localmente sessões de 90 minutos com áudio em WebAudio e visual sagrado em Canvas, servidos por Flask. Inclui página de Debug + E2E com export de relatório.

## Como executar (1 clique)
- Windows (app principal / referência PRD):
  - duplo clique em `RingLight_Iniciar.bat` → abre `http://127.0.0.1:5000/`.
- Windows (UAT com Pintura Viva):
  - duplo clique em `RingLight_Iniciar_UAT.bat` **ou**
  - `RingLight_Iniciar.bat UAT` → abre `http://127.0.0.1:5000/UAT`.
- Windows (E2E/Debug):
  - `RingLight_E2E_Autorun.bat` → abre `/debug?autorun=1&autoexport=1` e exporta relatório.
- Linux:
  - `./iniciar_frequencias.sh` (torne executável com `chmod +x iniciar_frequencias.sh`).

O wrapper legado `Iniciar_Frequencias.bat` delega para `RingLight_Iniciar.bat` (aceita `UAT`/`DEBUG`).

## Execução manual
1) Ambiente virtual e dependências
```
python -m venv .venv
.venv\Scripts\activate   # Windows
source .venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
```
2) Servidor
```
python app.py
```
3) Navegador
```
http://127.0.0.1:5000/        # app principal
http://127.0.0.1:5000/debug   # debug + E2E
http://127.0.0.1:5000/UAT     # UAT com Pintura Viva
```

## Estrutura
- `app.py` — servidor Flask (estático) com rotas `/`, `/debug` e `/UAT`.
- `static/index.html` — UI principal (controles, pop-ups, fullscreen, timer).
- `static/UAT.html` — variante com tema Pintura Viva.
- `static/index_debug.html` — UI com painel “Debug & E2E”.
- `static/js/app.js` — ligação UI → `audioEngine`/`visuals`.
- `static/js/audioEngine.js` — motor WebAudio, 4 fases, modos Auto/Binaural/Isocrônico.
- `static/js/visuals.js` — geometria (Flower/Ring/Metatron/Plenitude/Pintura Viva), micropulsos ≤ 3, rotação suave.
- `static/js/e2e.js` — runner E2E (autorun + export JSON em Downloads).
- `static/css/styles.css` — tema RingLight; fundo radial; tema Pintura Viva.
- `static/config/session.json` — parâmetros base da sessão.
- `static/config/modules/*.json` — presets de módulos (incl. Pintura Viva).
- `docs/` — versão publicada (GitHub Pages / PRD); sincronizada a partir de `static/`.

## E2E e Relatórios
- Página: `http://127.0.0.1:5000/debug`.
- Autorun: `http://127.0.0.1:5000/debug?autorun=1&autoexport=1`.
- Relatório salvo como `ringlight_e2e_report.json` em Downloads.
- Exemplos de relatórios legados: `local-report.json` e `uat-report.json` (na raiz).

## Publicar no Git / Deploy (opcional)
- Se já existir remoto `origin`:
  - `Git_Publicar_E2E_Verde.bat` → commit + tag `e2e-green-YYYYMMDD` (baseline E2E verde);
  - `Git_Publicar_Web_Kit.bat` → gera `dist/web`, sincroniza `docs/` e publica no Pages.
- Para remoto separado de produção (ex.: `site`):
  - `Publicar_Versao_Estavel.bat` → copia `static/` para `docs/` e faz push de `docs/` via `git subtree`.

## Solução de problemas (Windows)
- Python embutido (sem venv/pip): instale Python 3.12+ em https://www.python.org/downloads/ com “Add to PATH” e “pip”.
- Sem áudio no primeiro PLAY: clique uma vez (gesto do usuário exigido pelo navegador).
- Use navegadores atualizados; o código está compatível com sintaxe estável (sem `??` ou `?.`).
