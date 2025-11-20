@echo off
setlocal
cd /d "%~dp0"

rem Atalho 1-clique para abrir o Catálogo de módulos.
rem Reaproveita o bootstrap (healthcheck, venv, deps) do RingLight_Iniciar.
call RingLight_Iniciar.bat CATALOGO

endlocal
exit /b %ERRORLEVEL%
