# Frequencias Diarias — Sessao 90 min (Python + HTML)

Estrutura minima para executar localmente uma sessao de 90 minutos com audio gerado no navegador (Web Audio API) e visual de geometria sagrada em Canvas, servidos por um app Flask simples.

## Como executar (1 clique)

- Windows: de dois cliques em `Iniciar_Frequencias.bat`. Ele cria o venv, instala dependencias, inicia o servidor e abre o navegador automaticamente.
- Linux: de dois cliques em `iniciar_frequencias.sh` (ou execute pelo terminal). Ele faz o mesmo processo.

## Como executar (manual)

1) Opcional: crie um ambiente virtual e instale dependencias

```
python -m venv .venv
.venv\Scripts\activate   (Windows)
source .venv/bin/activate (Linux/macOS)
pip install -r requirements.txt
```

2) Inicie o servidor local

```
python app.py
```

3) Abra o navegador em

```
http://127.0.0.1:5000
```

Clique em "PLAY" para iniciar. O audio e sintetizado no browser e as fases sao agendadas automaticamente (0–90 min).

## Estrutura

- `app.py` — servidor Flask (estatico)
- `static/index.html` — UI com controles e timer
- `static/js/audioEngine.js` — motor de audio (Web Audio API) com agendamento das 4 fases
- `static/js/visuals.js` — geometria sagrada (Flor da Vida + Cubo de Metatron), respiracao e rotacao
- `static/css/styles.css` — tema neon dourado-esmeralda + rosa-dourado; fundo azul‑violeta
- `static/config/session.json` — parametros (frequencias, tempos, brilho, rotacao, etc.)

## Especificacao implementada

- Fase 1 (0–5 min):
  - Drone 174 Hz ativo desde o inicio
  - 432/528 Hz emergem lentamente (fade-in ao longo dos 5 min)
  - Fade-in global de 2 min no volume
- Fase 2 (5–60 min):
  - Entra batimento isocronico 7.5 Hz (AM sutil)
  - Ruido marrom de base + harmonicos 639 Hz / 852 Hz
  - Campo estavel, sem variacao ritmica perceptivel
- Fase 3 (60–80 min):
  - Introduz 963 Hz discretamente
  - Aumento leve de brilho (shelf de altas) e reverberacao (~+2–3 dB no wet)
- Fase 4 (80–90 min):
  - Remove altas frequencias e isocronico gradualmente
  - Permanece apenas 174 Hz ate o fade-out final

Visuals: paleta neon dourado‑esmeralda com rosa‑dourado, respiracao luminosa 3–4 bpm (~0,06 Hz), rotacao leve (0,08 rad/s), brilho max. ~78% de tela, Cubo de Metatron 30% de transparencia, fundo azul‑violeta.

## Observacoes

- A sintese e toda client‑side (sem arquivos WAV grandes). Se desejar uma alternativa baseada em arquivo WAV (como o exemplo em `Arquivos101125/meditacao_quantica.html`), posso adicionar um gerador offline em Python (streaming) depois.
- Ajustes finos (ganhos, curvas de fade, filtros) podem ser feitos em `static/config/session.json`.

## Solucao de problemas (Windows)

- Mensagem: `... foi inesperado neste momento.`
  - Execute `Iniciar_Frequencias.bat` pelo Prompt para ver mensagens (CMD). O script detecta Python e cria o venv.
- Mensagem ao criar venv: `Could not find platform independent libraries <prefix>`
  - Seu Python parece ser a versao "embeddable" (sem venv/pip). Instale o Python completo 3.12+ em https://www.python.org/downloads/ marcando "Add Python to PATH" e "pip". Depois rode o `.bat`.
