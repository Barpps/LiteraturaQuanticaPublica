@echo off
setlocal
cd /d "%~dp0"

set "TARGET=%CD%\RingLight_Iniciar.bat"
set "SHORTCUT=%USERPROFILE%\Desktop\RingLight.lnk"
set "ICON=%SystemRoot%\System32\shell32.dll, 43"

echo Criando atalho em: %SHORTCUT%
powershell -NoProfile -Command ^
 "$W=new-object -ComObject WScript.Shell; ^
  $S=$W.CreateShortcut('%SHORTCUT%'); ^
  $S.TargetPath='%TARGET%'; ^
  $S.WorkingDirectory='%CD%'; ^
  $S.WindowStyle=7; ^
  $S.IconLocation='%ICON%'; ^
  $S.Description='Inicia o RingLight (verifica servidor e abre o app)'; ^
  $S.Save()"

if exist "%SHORTCUT%" (
  echo Atalho criado com sucesso.
) else (
  echo [ERRO] Nao foi possivel criar o atalho.
)
pause

