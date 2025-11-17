# RingLight – Sessão 90 min (Flask + WebAudio + Canvas)

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

Também é possível usar o wrapper legado `Iniciar_Frequencias.bat`, que agora apenas delega para `RingLight_Iniciar.bat` (aceita os mesmos parâmetros `UAT`/`DEBUG`).

## Execução manual

1) Ambiente virtual e dependências

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
source .venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
```

2) Servidor

```bash
python app.py
```

3) Navegador

```text
http://127.0.0.1:5000/        # app principal
http://127.0.0.1:5000/debug   # debug + E2E
http://127.0.0.1:5000/UAT     # UAT com Pintura Viva
```

## Estrutura

- `app.py` – servidor Flask (estático) com rotas `/`, `/debug` e `/UAT`.
- `static/index.html` – UI principal (controles, pop-ups, fullscreen, timer).
- `static/UAT.html` – variante com classe `enable-pintura-viva` no `<body>` (habilita módulo Pintura Viva).
- `static/index_debug.html` – UI com painel “Debug & E2E”.
- `static/js/app.js` – ligação UI ↔ `audioEngine`/`visuals` (compatível com Edge/Chrome estáveis).
- `static/js/audioEngine.js` – motor WebAudio, 4 fases, modos Auto/Binaural/Isocrônico.
- `static/js/visuals.js` – geometria (Flower/Ring/Metatron/Plenitude/Pintura Viva), micropulsos ≤ 3, rotação suave.
- `static/js/e2e.js` – runner E2E (autorun + export JSON em Downloads).
- `static/css/styles.css` – tema RingLight; fundo radial azul‑violeta + tema especial Pintura Viva.
- `static/config/session.json` – parâmetros base da sessão (durações, respiração, etc.).
- `static/config/modules/*.json` – presets de módulos (parâmetros visuais/sonoros, incluindo Pintura Viva).

## E2E e Relatórios

- Página: `http://127.0.0.1:5000/debug`.
- Autorun: `http://127.0.0.1:5000/debug?autorun=1&autoexport=1`.
- O relatório é salvo como `ringlight_e2e_report.json` em Downloads.
- Exemplos de relatórios capturados localmente: `local-report.json` e `uat-report.json` (no root do projeto).

## Publicar no Git / Deploy (opcional)

- Se já existir remoto `origin`, você pode:
  - usar `Git_Publicar_E2E_Verde.bat` para commitar e criar a tag `e2e-green-YYYYMMDD` (baseline com E2E verde);  
  - usar `Git_Publicar_Web_Kit.bat` para gerar `dist/web`, sincronizar `docs/` e publicar um Web Kit pronto para GitHub Pages.
- Para um remoto separado de produção (ex.: `site`), há também:
  - `Publicar_Versao_Estavel.bat` – copia `static/` para `docs/` e faz push de `docs/` para o remoto `site` via `git subtree`.

Mais detalhes sobre ambientes e fluxo de promoção (Local → UAT → PRD) em `VERSIONS.md`.

## Solução de problemas (Windows)

- Python embutido (sem venv/pip): instale o Python 3.12+ completo em https://www.python.org/downloads/ com “Add to PATH” e “pip”.
- Se o navegador não tocar áudio no primeiro PLAY, clique uma vez no botão (políticas do navegador exigem gesto do usuário).
- Em Edge/Chrome, use versões atuais; o código está compatível com sintaxe estável (sem `??` ou `?.`).

