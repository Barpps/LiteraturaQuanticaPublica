@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

echo ======================================================
echo  Publicar Versao Estavel do RingLight
echo ======================================================
echo.
echo Este script vai:
echo   1) Copiar o conteudo de "static/" para "docs/" (site).
echo   2) Fazer commit no repo atual (origin).
echo   3) Publicar "docs/" no repo publico configurado como remoto "site".
echo.
echo Recomendado: rodar o E2E em http://127.0.0.1:5000/debug
echo e somente depois usar este script.
echo.
set /p CONF="Digite SIM para publicar a versao atual em producao: "
if /I not "%CONF%"=="SIM" goto :abort

echo.
echo [1/4] Verificando git e remotos...
where git >nul 2>&1 || (echo [ERRO] git nao encontrado. Instale Git for Windows. & pause & exit /b 1)

git remote get-url site >nul 2>&1 || (
  echo [ERRO] Remoto "site" nao configurado.
  echo Use, por exemplo:
  echo   git remote add site https://github.com/SEU_USUARIO/SEU_REPO_PUBLICO.git
  echo e rode este .bat novamente.
  pause & exit /b 1
)

echo.
echo [2/4] Copiando static/ para docs/ ...
if not exist docs mkdir docs
robocopy static docs /E /NFL /NDL /NJH /NJS /NC /NS >nul
if errorlevel 8 (
  echo [ERRO] Falha ao copiar arquivos para docs/.
  pause & exit /b 1
)

echo.
echo [3/4] Commit no repo privado (origin)...
git add -A || (echo [ERRO] git add falhou. & pause & exit /b 1)
git commit -m "Publicar versao estavel: sincronizar static/ com docs/" || echo [Git] Nada novo para commitar (ok).

for /f %%d in ('powershell -NoLogo -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmm"') do set "TS=%%d"
set "BRANCH_TEMP=site_pub_%TS%"

echo.
echo [4/4] Publicando docs/ no repo publico (remoto "site")...
git subtree split --prefix docs -b %BRANCH_TEMP% || (echo [ERRO] git subtree split falhou. & pause & exit /b 1)
git push -f site %BRANCH_TEMP%:main || (echo [ERRO] git push para remoto "site" falhou. & pause & exit /b 1)

echo.
echo [OK] Versao estavel publicada no remoto "site" (branch main).
echo Abra o GitHub Pages do repo publico para conferir o deploy.
pause
exit /b 0

:abort
echo Operacao cancelada. Nada foi publicado.
pause
exit /b 0

