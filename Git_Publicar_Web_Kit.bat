@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

call Criar_Web_Kit_Zip.bat || (echo [ERRO] build/zip falhou & exit /b 1)

where git >nul 2>&1 || (echo [ERRO] git nao encontrado. Instale Git for Windows. & pause & exit /b 1)

for /f %%d in ('powershell -NoLogo -NoProfile -Command "Get-Date -Format yyyyMMdd"') do set "DT=%%d"
set "TAG=webkit-%DT%"
set "MSG=Web Kit build %DT% (dist/web para Pages + zips em dist/)"

echo [Git] Preparando docs/ para GitHub Pages...
if exist docs rmdir /s /q docs
mkdir docs || (echo [ERRO] criar docs falhou & pause & exit /b 1)
xcopy /E /I /Y dist\web docs\ >nul || (echo [ERRO] copiar web->docs falhou & pause & exit /b 1)

echo [Git] Commit + tag
git add -A || (echo [ERRO] git add falhou & pause & exit /b 1)
git commit -m "%MSG%" || echo [Git] Nada para commitar (ok)
git tag -f %TAG%

echo [Git] Push (HEAD + tags)
git push origin HEAD || (echo [ERRO] git push HEAD falhou & pause & exit /b 1)
git push origin --tags || (echo [ERRO] git push tags falhou & pause & exit /b 1)

echo [OK] Publicado. Habilite GitHub Pages em Settings -> Pages -> Source = docs/ (branch padrao).
echo Zips prontos em .\dist\ para enviar manualmente ou anexar em uma Release.
pause
exit /b 0

