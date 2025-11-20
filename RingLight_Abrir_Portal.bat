@echo off
setlocal
cd /d "%~dp0"

set "TARGET=/links"
set "PORT=%PORT%"
if not defined PORT set "PORT=%RINGLIGHT_PORT%"
if not defined PORT set "PORT=5000"
set "URL=http://127.0.0.1:%PORT%%TARGET%"

rem Detecta Python (py -3 preferido)
set "PYCMD="
where py >nul 2>&1 && set "PYCMD=py -3"
if not defined PYCMD where python >nul 2>&1 && set "PYCMD=python"
if not defined PYCMD (
  echo [ERRO] Python nao encontrado. Instale em https://www.python.org/downloads/ e marque "Add to PATH".
  pause & exit /b 1
)

if not exist .venv\Scripts\python.exe (
  echo [RingLight] Criando venv...
  %PYCMD% -m venv .venv || (echo [ERRO] Falha ao criar venv & pause & exit /b 1)
)

echo [RingLight] Instalando dependencias (portal)...
".venv\Scripts\python.exe" -m pip install --upgrade pip >nul
".venv\Scripts\pip.exe" install -r requirements.txt || (echo [ERRO] pip falhou & pause & exit /b 1)

echo [RingLight] Iniciando servidor Flask...
start "RingLight-Server" /min cmd /c ".\\.venv\Scripts\python.exe app.py"

echo [RingLight] Abrindo %URL%
start "" %URL%

echo [RingLight] Portal aberto. Se o browser nao abrir, acesse: %URL%
exit /b 0
