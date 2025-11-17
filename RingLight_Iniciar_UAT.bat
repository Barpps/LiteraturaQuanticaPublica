@echo off
setlocal
cd /d "%~dp0"

rem Atalho direto para o ambiente UAT (Pintura Viva habilitada, /UAT).
call RingLight_Iniciar.bat UAT

endlocal
exit /b %ERRORLEVEL%

