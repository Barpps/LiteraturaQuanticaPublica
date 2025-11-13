#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname "$0")"

echo "[FrequenciasDiarias] Preparando ambiente..."

if ! command -v python3 >/dev/null 2>&1; then
  echo "[ERRO] python3 nao encontrado. Instale python3, python3-venv e python3-pip."
  echo "Ubuntu/Debian: sudo apt install -y python3 python3-venv python3-pip"
  exit 1
fi

if [ ! -d .venv ]; then
  echo "Criando ambiente virtual (.venv)..."
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "Iniciando servidor Flask..."
python app.py &
sleep 2

URL="http://127.0.0.1:5000/"
echo "Abrindo no navegador: $URL"
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then
  open "$URL" || true
fi

echo "Servidor rodando. Pressione Ctrl+C aqui para encerrar se iniciou no terminal."
