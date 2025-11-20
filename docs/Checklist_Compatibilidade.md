# Checklist de Compatibilidade & Performance — RingLight

## Navegadores recomendados
- Desktop: Edge/Chrome (versão estável), Firefox recente.
- Mobile: Chrome/Edge Android; Safari iOS (testar áudio permitido após gesto).
- AudioContext iniciado somente após clique em PLAY (conforme políticas de autoplay).

## Itens de verificação rápida
- **Render**: `/` (app), `/UAT` (tema Pintura Viva), `/debug` (overlay E2E), `home.html`, `guia.html`, `fragmentos*.html`.
- **Controles**: PLAY/STOP/Avançar/Voltar fase, saída + modais de intenção/selamento, fullscreen (botão Tela Cheia), skip-link via Tab.
- **Áudio**: binaural com fones, isocrônico sem fones/aba em background (ver texto “Binaural ativo/Isocrônico ativo”).
- **Visual**: micropulsos suaves, fundo gradiente sem estrobo, animação Pintura Viva ok.
- **Fallback**: ao trocar de módulo, fade-out do anterior; se fetch falhar, alerta mantém módulo anterior.
- **Reentrada**: em `/debug`, botões “Full E2E” e “Exportar Relatório”.

## Performance (manual)
- Abrir DevTools → Performance ou Timeline e validar FPS ~60 em desktop; quedas pontuais são aceitáveis em hardware modesto.
- Testar em laptop com bateria para checar consumo moderado (não usar filtros pesados).
- Validar que ao perder foco a aba reduz para target ~15 fps (throttling via visibilitychange).

## Mobile
- Gestos: clique único em PLAY antes de áudio iniciar.
- Fullscreen: alguns browsers móveis podem perguntar permissão; se negar, app segue funcional.
- Rotação: testar orientação retrato/paisagem; canvas usa min(96vw,96vh).

## Diagnóstico rápido (quando houver dúvida)
- Se áudio não sai: conferir volumes do SO/navegador; tentar modo isocrônico; verificar se gesto foi dado.
- Se animação travar: reduzir abas abertas; voltar à aba (visibilitychange força isocrônico se necessário).
- Se fetch de módulo falhar: mensagem já orienta a manter módulo anterior.

## Quando marcar “ok”
- Páginas renderizam sem artefatos, textos legíveis e navegação fluida em Edge/Chrome/Firefox recentes.
- Áudio toca após gesto em mobile e desktop, com status correto (Binaural/Isocrônico).
- Controles e modais acessíveis via teclado (Tab → Enter/Escape), fullscreen reentrando sem travas.
