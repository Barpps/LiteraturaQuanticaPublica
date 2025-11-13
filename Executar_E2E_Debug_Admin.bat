@echo off
setlocal ENABLEDELAYEDEXECUTION
cd /d "%~dp0"

:: Perfil temporario do navegador p/ evitar cache/ extensoes
set "RL_PROFILE=%TEMP%\ringlight_e2e_profile"
if exist "%RL_PROFILE%" rd /s /q "%RL_PROFILE%" >nul 2>&1

:: Cria venv se necessario
set "PY=py -3"
where py >nul 2>&1 || set "PY=python"
if not exist .venv\Scripts\python.exe (
  %PY% -m venv .venv || (echo [ERRO] Falha ao criar venv & pause & exit /b 1)
)
".venv\Scripts\python.exe" -m pip install --upgrade pip >nul
".venv\Scripts\pip.exe" install -r requirements.txt || (echo [ERRO] pip & pause & exit /b 1)

:: Reinicia o servidor Flask
for /f "tokens=2" %%P in ('tasklist ^| find /i "python.exe"') do (
  rem opcional: finalizar instancias antigas (nao fatal)
)

echo Iniciando servidor...
start "RingLight-Server" cmd /c ".\.venv\Scripts\python.exe app.py"
timeout /t 2 >nul

:: Monta URL com debug + autorun + nobuffer
set "TS=%RANDOM%%RANDOM%"
set "URL=http://127.0.0.1:5000/?debug=1&autorun=1&autoexport=1&nocache=%TS%"

:: Abre no Edge (flags para autoplay e sem extensoes)
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
  start "RingLight-E2E" "%EDGE%" --user-data-dir="%RL_PROFILE%" --disable-extensions --autoplay-policy=no-user-gesture-required --new-window "%URL%"
) else (
  set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  if exist "%CHROME%" (
    start "RingLight-E2E" "%CHROME%" --user-data-dir="%RL_PROFILE%" --disable-extensions --autoplay-policy=no-user-gesture-required --new-window "%URL%"
  ) else (
    start "" "%URL%"
  )
)

echo Abrindo %URL%
echo Se o autorun nao iniciar, clique no botao "Full E2E" no painel Debug.
echo (O script criou um perfil temporario sem cache em %RL_PROFILE%)
exit /b 0

