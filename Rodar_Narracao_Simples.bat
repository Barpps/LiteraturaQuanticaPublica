@echo off
setlocal

REM Ativa o ambiente virtual e roda a narracao simples, gerando MP3 e WAV.

if not exist ".venv\Scripts\python.exe" (
  echo [ERRO] Ambiente .venv nao encontrado. Rode Iniciar_Frequencias.bat uma vez para criar.
  pause
  goto :eof
)

REM Dependencia (apenas na primeira vez, se faltar):
REM   .venv\Scripts\pip install azure-cognitiveservices-speech
REM
REM Opcional: use um arquivo .env na raiz para configurar sua chave:
REM   1) Copie .env.example para .env
REM   2) Edite SPEECH_KEY e SPEECH_REGION no .env

call ".venv\Scripts\activate.bat"
python "scripts\run_narracao_simples.py"

echo.
echo [INFO] Se nao houver erros, os arquivos estarao em:
echo   NaraçõesEspeciais\narracao_simples.mp3
echo   NaraçõesEspeciais\narracao_simples.wav
echo.
pause
