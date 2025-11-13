@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

set "PY=.venv\Scripts\python.exe"
if not exist %PY% (
  where py >nul 2>&1 && set "PY=py -3"
)
if not exist %PY% (
  where python >nul 2>&1 && set "PY=python"
)
if not defined PY (
  echo [ERRO] Python nao encontrado.
  pause & exit /b 1
)

echo [Build] Gerando dist/web e dist/portable...
%PY% tools\build_web_kit.py || (echo [ERRO] build falhou & pause & exit /b 1)

echo [ZIP] Compactando pacotes...
if exist dist\RingLight_Web_Kit.zip del /q dist\RingLight_Web_Kit.zip
if exist dist\RingLight_Portable.zip del /q dist\RingLight_Portable.zip

powershell -NoLogo -NoProfile -Command "Compress-Archive -Path 'dist/web/*' -DestinationPath 'dist/RingLight_Web_Kit.zip' -Force" || (echo [ERRO] zip web falhou & pause & exit /b 1)
powershell -NoLogo -NoProfile -Command "Compress-Archive -Path 'dist/portable/*' -DestinationPath 'dist/RingLight_Portable.zip' -Force" || (echo [ERRO] zip portable falhou & pause & exit /b 1)

echo [OK] Pacotes gerados em .\dist\
dir dist\*.zip
pause
exit /b 0

