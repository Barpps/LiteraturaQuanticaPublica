# RingLight — Sessão 90 min (Flask + WebAudio + Canvas)

Estrutura estável para executar localmente sessões de 90 minutos com áudio em WebAudio e visual sagrado em Canvas, servidos por Flask. Inclui página de Debug + E2E com export de relatório.

## Como executar (1 clique)

- Windows (app principal): dê dois cliques em `RingLight_Iniciar.bat`.
- Windows (E2E/Debug): use `RingLight_E2E_Autorun.bat` (abre `/debug?autorun=1&autoexport=1` e salva o relatório em Downloads).
- Linux: `./iniciar_frequencias.sh` (torne executável com `chmod +x iniciar_frequencias.sh`).

## Execução manual

1) Ambiente virtual e dependências
```
python -m venv .venv
.venv\Scripts\activate   (Windows)
source .venv/bin/activate (Linux/macOS)
pip install -r requirements.txt
```
2) Servidor
```
python app.py
```
3) Navegador
```
http://127.0.0.1:5000          (app principal)
http://127.0.0.1:5000/debug    (debug + E2E)
```

## Estrutura

- `app.py` — servidor Flask (estático) + rotas `/` e `/debug`.
- `static/index.html` — UI principal (controles, pop-ups, fullscreen, timer).
- `static/index_debug.html` — UI com painel “Debug & E2E”.
- `static/js/app.js` — ligação UI ↔ `audioEngine`/`visuals` (Edge‑safe).
- `static/js/audioEngine.js` — motor WebAudio, 4 fases, modos Auto/Binaural/Isocrônico.
- `static/js/visuals.js` — geometria (Flower/Ring/Metatron), micropulsos ≤ 3, rotação.
- `static/js/e2e.js` — runner E2E (autorun + export JSON em Downloads).
- `static/css/styles.css` — tema RingLight; fundo radial azul‑violeta.
- `static/config/modules/*.json` — presets de módulos (parâmetros visuais/sonoros).

## E2E e Relatórios

- Página: `http://127.0.0.1:5000/debug`.
- Autorun: `http://127.0.0.1:5000/debug?autorun=1&autoexport=1`.
- O relatório é salvo como `ringlight_e2e_report.json` em Downloads.

## Publicar no Git (opcional)

- Se já existir remoto `origin`, execute `Git_Publicar_E2E_Verde.bat` para commitar e criar a tag `e2e-green-YYYYMMDD`.
- Se não houver remoto, o script informa o comando `git remote add origin ...`.

## Solução de problemas (Windows)

- Python embutido (sem venv/pip): instale o Python 3.12+ completo em https://www.python.org/downloads/ com “Add to PATH” e “pip”.
- Se o navegador não tocar áudio no primeiro PLAY, clique uma vez no botão (políticas do navegador exigem gesto do usuário).
- Em Edge, evite versões antigas; o código está compatível com sintaxe estável (sem `??` ou `?.`).
