@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo [FrequenciasDiarias] Preparando ambiente...

rem Detecta Python (py -3 preferido) ou cai para python
set "PYCMD="
where py >nul 2>&1 && set "PYCMD=py -3"
if not defined PYCMD (
  where python >nul 2>&1 && set "PYCMD=python"
)

if not defined PYCMD (
  echo ERRO: Python 3 nao encontrado. Instale de https://www.python.org/downloads/ com Add to PATH.
  pause
  exit /b 1
)

for /f "delims=" %%V in ('%PYCMD% --version 2^>^&1') do set "PYVER=%%V"
set "USE_PY=%PYCMD%"
echo %PYVER% | findstr /c:"3.14" >nul
if %errorlevel%==0 (
  where python >nul 2>&1 && set "USE_PY=python"
)
echo Usando %USE_PY% - %PYVER%

if not exist .venv\Scripts\python.exe (
  echo Criando ambiente virtual .venv com %USE_PY% ...
  %USE_PY% -m venv .venv 2>nul
)

if not exist .venv\Scripts\python.exe (
  echo Tentando criar venv com "python"...
  python -m venv .venv 2>nul
)

if not exist .venv\Scripts\python.exe (
  echo Tentando criar venv com "py -3.12"...
  py -3.12 -m venv .venv 2>nul
)

if not exist .venv\Scripts\python.exe (
  echo AVISO: Nao foi possivel criar o venv. Provavel Python "embeddable" sem venv/pip.
  echo Baixe o instalador completo do Python 3.12+ e habilite pip e Add to PATH.
  echo Link: https://www.python.org/downloads/
  pause
  exit /b 1
)

echo Instalando dependencias...
".venv\Scripts\python.exe" -m pip install --upgrade pip
".venv\Scripts\pip.exe" install -r requirements.txt || (
  echo ERRO: Falha no pip. Verifique sua internet e tente novamente.
  pause
  exit /b 1
)

echo Iniciando servidor Flask...
start "" ".\.venv\Scripts\python.exe" app.py

echo Abrindo no navegador...
timeout /T 2 /NOBREAK >nul
start "" http://127.0.0.1:5000/

echo Pronto! Caso o navegador nao abra, acesse: http://127.0.0.1:5000/
echo Para encerrar, feche a janela do servidor.
exit /b 0
