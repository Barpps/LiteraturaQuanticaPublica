@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

set "TARGET=/"
if /I "%~1"=="UAT" set "TARGET=/UAT"
if /I "%~1"=="DEBUG" set "TARGET=/debug"
if /I "%~1"=="CATALOGO" set "TARGET=/catalogo"

set "PORT=%PORT%"
if not defined PORT set "PORT=%RINGLIGHT_PORT%"
if not defined PORT set "PORT=5000"

set "BASE=http://127.0.0.1:%PORT%"
set "URL=%BASE%%TARGET%"
set "PING_URL=%BASE%/"
set "HEALTH_URL=%BASE%/healthz"
set "VENV=.venv\Scripts\python.exe"
set "DEPS_MARKER=.venv\.deps_hash"

echo [RingLight] Verificando servidor em %HEALTH_URL%
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

if not exist "%VENV%" (
  echo [RingLight] Criando venv...
  %PYCMD% -m venv .venv || (echo [ERRO] Falha ao criar venv & pause & exit /b 1)
)

rem Calcula hash de requirements.txt para evitar reinstalar quando ja satisfaz
set "REQ_HASH="
for /f "usebackq tokens=* delims=" %%H in (`powershell -NoLogo -NoProfile -Command "(Get-FileHash -Algorithm SHA256 'requirements.txt').Hash"`) do (
  set "REQ_HASH=%%H"
)
if not defined REQ_HASH set "REQ_HASH=unknown"

set "NEED_PIP=1"
if exist "%DEPS_MARKER%" (
  set /p OLD_HASH=<"%DEPS_MARKER%"
  if /I "!OLD_HASH!"=="!REQ_HASH!" set "NEED_PIP=0"
)

if "!NEED_PIP!"=="1" (
  echo [RingLight] Instalando dependencias...
  "%VENV%" -m pip install --upgrade pip >nul
  "%VENV%" -m pip install -r requirements.txt || (echo [ERRO] pip falhou & pause & exit /b 1)
  >"%DEPS_MARKER%" echo !REQ_HASH!
) else (
  echo [RingLight] Dependencias ja instaladas (hash !REQ_HASH!).
)

echo [RingLight] Iniciando servidor Flask...
start "RingLight-Server" /min cmd /c "\"%VENV%\" app.py"

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
for /f %%r in ('powershell -NoLogo -NoProfile -Command "try{(Invoke-WebRequest -UseBasicParsing -Uri %HEALTH_URL% -TimeoutSec 1).StatusCode -eq 200}catch{$false}"') do set "UP=%%r"
if /I "%UP%"=="True" exit /b 0
for /f %%r in ('powershell -NoLogo -NoProfile -Command "try{(Invoke-WebRequest -UseBasicParsing -Uri %PING_URL% -TimeoutSec 1).StatusCode -eq 200}catch{$false}"') do set "UP=%%r"
exit /b 0
