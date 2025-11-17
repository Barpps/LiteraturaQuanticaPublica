@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

set "PORT=5000"
set "TARGET=/"
if /I "%~1"=="UAT" set "TARGET=/UAT"
if /I "%~1"=="DEBUG" set "TARGET=/debug"
set "URL=http://127.0.0.1:%PORT%%TARGET%"
set "VENV=.venv\Scripts\python.exe"

echo [RingLight] Verificando servidor em %URL%
call :is_up
if /I "%UP%"=="True" (
  echo [RingLight] Servidor ja esta em execucao.
  goto :open
)

echo [RingLight] Servidor nao encontrado. Preparando ambiente...
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

echo [RingLight] Instalando dependencias...
".venv\Scripts\python.exe" -m pip install --upgrade pip >nul
".venv\Scripts\pip.exe" install -r requirements.txt || (echo [ERRO] pip falhou & pause & exit /b 1)

echo [RingLight] Iniciando servidor Flask...
start "RingLight-Server" /min cmd /c ".\.venv\Scripts\python.exe app.py"

echo [RingLight] Aguardando servidor ficar disponivel...
for /L %%S in (1,1,30) do (
  call :is_up >nul
  if /I "!UP!"=="True" goto :open
  timeout /t 1 >nul
)
echo [ERRO] Nao foi possivel conectar em %URL% apos 30s.
echo Verifique o terminal do servidor (janela com titulo "RingLight-Server").
pause & exit /b 1

:open
echo [RingLight] Abrindo %URL%
start "" %URL%
exit /b 0

:is_up
set "UP=False"
for /f %%r in ('powershell -NoLogo -NoProfile -Command "try{(Invoke-WebRequest -UseBasicParsing -Uri %URL% -TimeoutSec 1).StatusCode -eq 200}catch{$false}"') do set "UP=%%r"
exit /b 0
