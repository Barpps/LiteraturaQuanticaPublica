# -*- coding: utf-8 -*-
"""
Narração simples usando Azure Speech (MP3 + WAV).

Boas práticas aplicadas:
- Voz padrão: pt-BR-MacerioMultilingualNeural (Macerio, HD).
- Chaves: SPEECH_KEY / SPEECH_REGION (com fallback para AZURE_SPEECH_KEY / AZURE_SPEECH_REGION).
- Conteúdo: meditação, ritmo levemente mais lento (prosody rate ~0.9).
"""

import os
import pathlib
from xml.sax.saxutils import escape

try:
    import azure.cognitiveservices.speech as speechsdk
except ImportError:
    speechsdk = None


def load_dotenv_if_present() -> None:
    """
    Carrega variáveis de um arquivo .env na raiz do repo,
    se existir, sem sobrescrever valores já presentes no ambiente.
    """
    repo_root = pathlib.Path(__file__).resolve().parent.parent
    env_path = repo_root / ".env"
    if not env_path.exists():
        return

    try:
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()
            if key and key not in os.environ:
                os.environ[key] = value
    except OSError:
        # Falha em ler o .env não deve impedir o restante do script.
        return


def load_text() -> str:
    """
    Lê o texto de narração a partir de um arquivo.

    Caminhos candidatos (relativos ao repo):
      - NaraçõesEspeciais/narracao_simples.txt
      - NaraçõesEspeciais/O que você descreve não é fraqueza.txt
    """
    repo_root = pathlib.Path(__file__).resolve().parent.parent

    # Atenção: o Windows pode mostrar caracteres estranhos no nome da pasta,
    # mas o caminho lógico continua funcionando.
    base_dir = repo_root / "NaraçõesEspeciais"

    candidates = [
        base_dir / "narracao_simples.txt",
        base_dir / "O que você descreve não é fraqueza.txt",
    ]

    for path in candidates:
        if not path.exists():
            continue
        # Tenta primeiro UTF-8, depois cp1252 (Windows)
        try:
            return path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            return path.read_text(encoding="cp1252")

    raise FileNotFoundError(
        "Nenhum arquivo de texto encontrado para narração.\n"
        "Crie um destes arquivos em NaraçõesEspeciais/:\n"
        "  - narracao_simples.txt\n"
        "  - O que você descreve não é fraqueza.txt"
    )


def build_speech_config(output_format=None):
    """
    Cria a configuração do Azure Speech a partir de variáveis de ambiente.

    Antes de rodar:
      - Defina SPEECH_KEY com a sua chave (ou AZURE_SPEECH_KEY como legado)
      - Opcional: SPEECH_REGION (padrão: brazilsouth)
    """
    if speechsdk is None:
        raise RuntimeError(
            "Biblioteca 'azure-cognitiveservices-speech' não encontrada.\n"
            "Instale dentro do seu .venv com:\n"
            "  .venv\\Scripts\\pip install azure-cognitiveservices-speech"
        )

    key = (
        os.environ.get("SPEECH_KEY")
        or os.environ.get("AZURE_SPEECH_KEY")
        or ""
    ).strip()
    region = (
        os.environ.get("SPEECH_REGION")
        or os.environ.get("AZURE_SPEECH_REGION")
        or "brazilsouth"
    ).strip()

    if not key:
        raise RuntimeError(
            "Defina a variável de ambiente SPEECH_KEY (ou AZURE_SPEECH_KEY) com sua chave do Azure Speech."
        )

    speech_config = speechsdk.SpeechConfig(subscription=key, region=region)

    # Voz padrão recomendada nos testes (HD).
    speech_config.speech_synthesis_voice_name = "pt-BR-MacerioMultilingualNeural"

    if output_format is not None:
        speech_config.set_speech_synthesis_output_format(output_format)

    return speech_config


def build_ssml(text: str) -> str:
    """
    Constrói SSML para meditação: voz Macerio, ritmo levemente mais lento.
    """
    escaped = escape(text)
    return (
        "<speak version='1.0' xml:lang='pt-BR'>"
        "<voice name='pt-BR-MacerioMultilingualNeural'>"
        "<prosody rate='0.9'>"
        f"{escaped}"
        "</prosody>"
        "</voice>"
        "</speak>"
    )


def synthesize_to_mp3(text: str) -> pathlib.Path:
    """
    Gera um MP3 único com todo o texto.

    Saída padrão:
      NaraçõesEspeciais/narracao_simples.mp3
    """
    repo_root = pathlib.Path(__file__).resolve().parent.parent
    out_dir = repo_root / "NaraçõesEspeciais"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "narracao_simples.mp3"

    speech_config = build_speech_config(
        speechsdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3
    )
    audio_config = speechsdk.audio.AudioOutputConfig(filename=str(out_path))

    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=audio_config,
    )

    ssml = build_ssml(text)
    result = synthesizer.speak_ssml_async(ssml).get()

    if result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
        raise RuntimeError(f"Falha na síntese de áudio (MP3): {result.reason}")

    return out_path


def synthesize_to_wav(text: str) -> pathlib.Path:
    """
    Gera um WAV (PCM) com o mesmo texto, para referência.

    Saída padrão:
      NaraçõesEspeciais/narracao_simples.wav
    """
    repo_root = pathlib.Path(__file__).resolve().parent.parent
    out_dir = repo_root / "NaraçõesEspeciais"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "narracao_simples.wav"

    speech_config = build_speech_config(
        speechsdk.SpeechSynthesisOutputFormat.Riff16Khz16BitMonoPcm
    )
    audio_config = speechsdk.audio.AudioOutputConfig(filename=str(out_path))

    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=audio_config,
    )

    ssml = build_ssml(text)
    result = synthesizer.speak_ssml_async(ssml).get()

    if result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
        raise RuntimeError(f"Falha na síntese de áudio (WAV): {result.reason}")

    return out_path


def main() -> None:
    # Carrega variáveis definidas em .env (se existir)
    load_dotenv_if_present()

    if speechsdk is None:
        print(
            "Biblioteca 'azure-cognitiveservices-speech' não encontrada.\n"
            "Instale dentro do seu .venv com:\n"
            "  .venv\\Scripts\\pip install azure-cognitiveservices-speech\n"
        )
        return

    try:
        text = load_text()
    except Exception as exc:  # noqa: BLE001
        print(f"[ERRO] Problema ao ler o texto: {exc}")
        return

    if not text.strip():
        print("[AVISO] O arquivo de texto está vazio. Edite antes de rodar a narração.")
        return

    try:
        mp3_path = synthesize_to_mp3(text)
        wav_path = synthesize_to_wav(text)
    except Exception as exc:  # noqa: BLE001
        print(f"[ERRO] Falha ao gerar áudio: {exc}")
        return

    print("[OK] Narração gerada com sucesso (Macerio, meditação):")
    print(f"  MP3: {mp3_path}")
    print(f"  WAV: {wav_path}")


if __name__ == "__main__":
    main()
