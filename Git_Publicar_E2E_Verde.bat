@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

where git >nul 2>&1 || (echo [ERRO] git nao encontrado. Instale Git for Windows. & pause & exit /b 1)

for /f %%d in ('powershell -NoLogo -NoProfile -Command "Get-Date -Format yyyyMMdd"') do set "DT=%%d"
set "TAG=e2e-green-%DT%"
set "MSG=E2E green baseline %DT% (debug overlay + audio/visual fixes)"

rem Verifica se ha remoto configurado
for /f "tokens=2 delims=:" %%r in ('git remote -v ^| findstr /i "(fetch)" ^| findstr /i "origin"') do set "ORIGIN=%%r"
if not defined ORIGIN (
  echo [ERRO] Nenhum remoto "origin" configurado.
  echo Use: git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
  echo Depois rode este .bat novamente.
  pause & exit /b 1
)

echo [Git] Preparando commit e tag %TAG%
git add -A || (echo [ERRO] git add falhou & pause & exit /b 1)
git commit -m "%MSG%" || echo [Git] Nada para commitar (ok)

git tag -f %TAG%
git push origin HEAD || (echo [ERRO] git push do commit falhou & pause & exit /b 1)
git push origin --tags || (echo [ERRO] git push das tags falhou & pause & exit /b 1)

echo [Git] Publicado com sucesso em origin (%TAG%).
pause
exit /b 0

