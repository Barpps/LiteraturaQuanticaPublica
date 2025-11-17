@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

rem ---------------------------------------------------------------------------
rem Iniciar_Frequencias.bat
rem Wrapper legada que delega para o launcher principal RingLight_Iniciar.bat.
rem
rem Uso:
rem   - Duplo clique          -> abre app principal em /
rem   - Iniciar_Frequencias.bat UAT   -> abre /UAT (Pintura Viva habilitada)
rem   - Iniciar_Frequencias.bat DEBUG -> abre /debug (painel E2E)
rem ---------------------------------------------------------------------------

echo [FrequenciasDiarias] Chamando launcher RingLight...
call RingLight_Iniciar.bat %*

endlocal
exit /b %ERRORLEVEL%
