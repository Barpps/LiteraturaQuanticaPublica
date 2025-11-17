# RingLight – Ambientes e Versões

Este arquivo registra como os ambientes se relacionam com o código local.

## Ambientes

- **Local (DEV)**  
  - Servidor: `python app.py` (via `RingLight_Iniciar.bat`).  
  - Rotas principais:  
    - `/` – app principal (referência PRD).  
    - `/debug` – painel Debug + Full E2E.  
    - `/UAT` – variante UAT com módulo **Pintura Viva** habilitado.

- **UAT**  
  - Espelha o comportamento de `/UAT` rodando local.  
  - Deve sempre passar no Full E2E com **todos os módulos**, incluindo Pintura Viva.

- **PRD**  
  - Publicado a partir de `docs/` (GitHub Pages ou remoto `site`).  
  - Conteúdo vem de `static/` ou `dist/web` conforme o script de publicação.

## Fonte da Verdade

- `static/` é a base canônica do front (HTML/CSS/JS + `config/modules`).
- `docs/` e `dist/` são artefatos gerados:
  - `tools/build_web_kit.py` → `dist/web` (Web Kit) e `dist/portable` (Portable).  
  - `Git_Publicar_Web_Kit.bat` → publica `dist/web` em `docs/` (GitHub Pages).  
  - `Publicar_Versao_Estavel.bat` → copia `static/` para `docs/` e faz push para remoto `site`.

## Módulo Pintura Viva

- Configuração: `static/config/modules/pintura_viva.json`.  
- Habilitado na UI quando o `body` tem a classe `enable-pintura-viva` (ex.: `static/UAT.html`).  
- Visual especial:
  - `geometry.type = "pintura_viva"` com rotação mais lenta e micropulsos suaves.  
  - Tema `theme-pintura-viva` aplicado em `app.js` (fundo com ondas dourado‑violeta, sem estrobo).

## Critério de Liberação (Pintura Viva)

1. **Local** (`/UAT`) com Pintura Viva estável (testes manuais + Full E2E verde).  
2. **UAT** espelhando o mesmo código de `static/` e com E2E verde para todos os módulos.  
3. Somente então promover para **PRD**, regenerando `docs/` a partir da base atual e publicando via script:
   - `Git_Publicar_Web_Kit.bat` **ou** `Publicar_Versao_Estavel.bat` (conforme fluxo escolhido).

