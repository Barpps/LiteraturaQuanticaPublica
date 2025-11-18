#!/usr/bin/env python3
"""
Builds a distributable Web Kit from the current project.

Outputs:
  - dist/web/         -> site estático com paths relativos (serve em qualquer host HTTPS)
  - dist/portable/    -> cópia mínima para rodar local (RingLight_Iniciar.bat + app.py + static)

Uso:
  python tools/build_web_kit.py
"""
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT / 'static'
DIST = ROOT / 'dist'
WEB = DIST / 'web'
PORTABLE = DIST / 'portable'


def clean_dir(p: Path) -> None:
  if p.exists():
    # Windows pode marcar arquivos/cópias anteriores como somente leitura;
    # este handler ajusta permissões e tenta remover novamente.
    def _on_rm_error(func, path, exc_info):
      try:
        os.chmod(path, 0o700)
        func(path)
      except OSError:
        # fallback: ignora entrada problemática para não quebrar o build
        pass

    shutil.rmtree(p, onerror=_on_rm_error)
  p.mkdir(parents=True, exist_ok=True)


def copy_static(dst: Path) -> None:
  shutil.copytree(STATIC, dst / 'static')


def rewrite_index(src: Path, dst: Path) -> None:
  text = src.read_text(encoding='utf-8', errors='ignore')
  # Troca paths absolutos por relativos para hospedar em subcaminhos (GitHub Pages)
  text = text.replace('/static/', 'static/')
  # favicon também relativo
  text = text.replace('href="/favicon.ico"', 'href="favicon.ico"')
  dst.write_text(text, encoding='utf-8')


def write_pwa_files(dst: Path) -> None:
  # Manifest mínimo; ícones são opcionais
  manifest = {
    "name": "RingLight",
    "short_name": "RingLight",
    "start_url": "index.html",
    "display": "standalone",
    "background_color": "#0B0522",
    "theme_color": "#12072F",
    "icons": []
  }
  import json
  (dst / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
  sw = """
self.addEventListener('install', (e)=>{self.skipWaiting()});
self.addEventListener('activate', (e)=>{self.clients.claim()});
"""
  (dst / 'sw.js').write_text(sw, encoding='utf-8')


def build_web() -> None:
  clean_dir(WEB)
  copy_static(WEB)
  # Reescreve as páginas principais:
  # - index.html -> HOME (landing)
  # - app.html   -> Sessão principal de 90 min
  index_src = STATIC / 'index.html'
  home_src = STATIC / 'home.html'

  if index_src.exists():
    rewrite_index(index_src, WEB / 'app.html')

  if home_src.exists():
    rewrite_index(home_src, WEB / 'index.html')
  elif index_src.exists():
    # Fallback: se não houver HOME, usar o app como landing
    rewrite_index(index_src, WEB / 'index.html')

  # Debug/E2E
  debug_src = STATIC / 'index_debug.html'
  if debug_src.exists():
    rewrite_index(debug_src, WEB / 'index_debug.html')

  # Manifest + service worker (opcional)
  write_pwa_files(WEB)


def build_portable() -> None:
  clean_dir(PORTABLE)
  # Copia estáticos, app e scripts essenciais para rodar localmente
  shutil.copytree(STATIC, PORTABLE / 'static')
  for fname in ['app.py', 'RingLight_Iniciar.bat', 'iniciar_frequencias.sh', 'requirements.txt']:
    src = ROOT / fname
    if src.exists():
      shutil.copy2(src, PORTABLE / fname)


def main() -> None:
  DIST.mkdir(exist_ok=True)
  build_web()
  build_portable()
  print(f"OK: Web Kit em {WEB}")
  print(f"OK: Portable em {PORTABLE}")


if __name__ == '__main__':
  main()

