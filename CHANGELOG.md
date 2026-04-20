# Fiobras HUB — Histórico de versões

Histórico resumido em formato leve. **Detalhes completos em `changelog.js`** (carregado em runtime quando user clica na pílula de versão no app).

> Esta é a versão "para humanos lerem no editor". A versão programática é o array em `changelog.js` que renderiza no painel "Central de Atualizações" do HUB.

---

```
<!--
  ╔═══════════════════════════════════════════════════════════════╗
  FIOBRAS HUB — CHANGELOG
  ╠═══════════════════════════════════════════════════════════════╣
  v3.25.0  18/04/2026 Modernização visual: ícone Aurora
    (PWA + splash + sidenav + login brand) + login glass.
  v3.24.0  18/04/2026 PWA polish: botão "Instalar app"
    no header (Chrome/Edge/Android) + tooltip iOS Safari +
    dark mode auto via prefers-color-scheme.
  v3.23.2  18/04/2026 audit-log + active-sessions viraram
    listeners lazy (ativam quando admin abre painel).
  v3.23.1  18/04/2026 Breakpoints unificados nos sub-apps
    (CRM, Preço, Manutenção). Projeto inteiro = 5 valores.
  v3.23.0  18/04/2026 Breakpoints unificados no hub.css
    (7 valores → 5: 360/480/640/768/1024). Vars no :root.
    Sub-apps em v3.23.1 (split pra testar isolado).
  v3.22.2  18/04/2026 A11y: role=dialog auto + aria-label
    auto + trapFocus + prefers-reduced-motion global.
  v3.22.1  18/04/2026 Chart.js lazy-loaded sob demanda
    (-220ms FCP boot inicial; -80KB pra quem nunca abre
    Histórico/Produção).
  v3.22.0  18/04/2026 PWA: Service Worker cache-first +
    inputs 16px em mobile (anti-zoom iOS) + toast offline
    + toast "Nova versão disponível" pra atualização.
  v3.21.17 17/04/2026 Timeline: FIX bug crítico — set tava
    sobrescrevendo o nó. Race condition no boot apagava
    registros antigos. Agora grava 1 registro por vez.
  v3.21.16 17/04/2026 CRM: fix aba Histórico (regressão).
    logEvento/renderHistoricoGlobal/setLogFiltro sumiram
    numa refactor antiga → aba vivia vazia. Reimplementado.
  v3.21.15 17/04/2026 CRM: pacote estético colunas (A+B+C+D+F)
    A) header pill com bullet colorido + count em chip.
    B) botão + no header → cria lead direto naquela etapa.
    C) bg sage nas colunas (cards continuam brancos).
    D) KPI bar topo: pipe / proposta / fechados mês / tempo.
    F) avatar do responsável (último autor) no footer card.
  v3.21.14 17/04/2026 CRM: fix drag HTML5 (a/svg arrastáveis
    + dragleave flicker + drop em filhos não detectava).
  v3.21.13 17/04/2026 CRM: drag HTML5 nativo desktop, sem
    drag mobile (só ✈) + tempo virou "·4d" discreto.
  v3.21.12 17/04/2026 CRM: sempre abre na aba Pipeline.
  v3.21.11 17/04/2026 CRM: reestruturação interação cards
    • Botão ✈ usa data-action delegado (sem onclick string).
    • Drag system idempotente via delegation no #pipeline.
    • Popover fecha via pointerdown capture (mais confiável).
  v3.21.10 17/04/2026 CRM: clique no popover move direto +
    botão paper plane no card (estilo Telegram).
  v3.21.9 17/04/2026  Fix CRM drag com mouse (sem long-press)
    • Mouse arrasta direto (>6px). Touch mantém long-press.
  v3.21.8 17/04/2026  CRM: card clean + drag mobile + pill
    • Card redesign: logo + nome + meta linha + ações ícones.
    • Pill "→ próxima etapa" no footer (1 clique avança).
    • Long-press em qualquer card = drag (funciona no mobile).
    • Popover de mover (ligações tel:, wa.me, mailto: inline).
  v3.21.7 16/04/2026  CRM: cards mais clean (linhas alinhadas)
    • Header com nome maior + tag de fibra à direita.
    • Body em linhas label:valor (Empresa/Entrada/Telefone…).
    • Botões de ação mantidos.
  v3.21.6 16/04/2026  Fix CRM hist + nova etapa + Preço gate
    • CRM addHist: re-render imediato pós-salvar.
    • Pipeline: nova etapa "Encam. p/ Representante".
    • Preço: gate de sessão deixa qualquer user logado.
  v3.21.5 16/04/2026  Admin vê senhas + abre módulo liberado
    • Painel admin: senha plain revelável + definir senha.
    • Login abre no primeiro módulo liberado do user.
    • CRM: FAB "Registrar lead" sempre visível.
  v3.21.4 16/04/2026  Iframe altura fixa — scroll só interno
    • Iframe deixa de esticar; scroll fica dentro do iframe.
    • Página HUB não rola junto. Tabs fixed funcionam.
  v3.21.3 16/04/2026  Fix tabs Preço/Manut: move pro body JS
    • Bootstrap move .tabs pro body c/ position:fixed inline.
  v3.21.2 16/04/2026  Sub-tabs fixed (sticky não funcionava)
    • Posição fixed em vez de sticky pra estabilidade.
    • body padding-top compensa altura das tabs.
  v3.21.1 16/04/2026  Sub-tabs sticky no Preço/CRM/Manutenção
    • Subheader das abas internas fica congelado ao rolar.
  v3.21.0 16/04/2026  Role 'gerente' (acesso total sem admin)
    • Hierarquia: Administrador > Gerente > Usuário.
    • Gerente vê tudo, mas sem painel admin.
    • Labels friendly (Usuário/Gerente/Administrador).
  v3.20.5 16/04/2026  Fix editar/resetar user din. + selectAll
    • abrirEditarUsuario e resetarSenhaUser usam getUser.
    • Botões "Marcar todos" e "Limpar" nos módulos.
  v3.20.4 16/04/2026  Stats Cor: liberada com módulo Produção
    • TAB_PERMS e RESTRICTED_TABS zerados.
    • Quem acessa Produção acessa Stats Cor automaticamente.
    • Seção "Abas restritas" do modal some quando vazia.
  v3.20.3 16/04/2026  Backfill cores → Geovani (registrante)
    • Antes: admin. Corrigido para Geovani.
    • Re-roda automaticamente (flag v2).
  v3.20.2 16/04/2026  Backfill: cores antigas → autor admin
    • Cores sem criadoPor recebem 'admin' (one-shot).
    • Avatar agora aparece no card de cores legacy.
  v3.20.1 16/04/2026  Fix userChip: resolve chave por nome
    • togglePrioridadeCor gravava nome em vez de chave.
    • _resolveUserKey: fallback case-insensitive por nome.
    • Apontamento e Timeline também passam a gravar chave.
  v3.20.0 16/04/2026  Avatares unificados (userChip em todo)
    • Sessões ativas e Gerenciar usuários: agora userChip.
    • Mesmo avatar (foto ou iniciais) em qualquer lista.
  v3.19.0 16/04/2026  Avatares no lugar de nomes em listas
    • userChip(userKey, {size}) helper central.
    • Aplicado: card Cor (criador), card Timeline (autor),
      modal Cor (histórico), audit log.
    • Hover desktop: tooltip nativo. Mobile: tap = toast.
    • Cor agora rastreia criador (criadoPor) + by no histó.
  v3.18.0 16/04/2026  CRM/Preço visual + iframe full + prioridade
    • Preço e CRM padronizados ao HUB (mesma receita Manut).
    • Iframe estica até bottom (flex 1, sem espaço vazio).
    • Desenv. Cor: estrela de prioridade. Sobe pra topo.
    • Histórico registra priorizada/despriorizada.
  v3.17.0 16/04/2026  Manutenção: visual padronizado ao HUB
    • Tokens light/dark sincronizados (sage clarinho/Apple).
    • Tipografia Outfit Black 900 nos títulos/KPIs.
    • Tabs internas no padrão DM Mono uppercase do HUB.
    • Cards/buttons/inputs no border-radius e bordas HUB.
    • Cores semânticas (prioridade/tipo/coluna) preservadas.
  v3.16.0 16/04/2026  Migração: fiobras-preco → fiobras-hub
    • Banco renomeado pra fiobras-hub-default-rtdb.
    • Config Firebase trocada nos 4 arquivos.
    • Dados migrados via export/import JSON.
  v3.15.0 16/04/2026  Banco protegido (Firebase Anon Auth)
    • signInAnonymously no HUB e nos 3 sub-apps.
    • Rules .read/.write: auth != null (firebase-rules.json).
    • Login user+senha custom continua igual.
  v3.14.0 16/04/2026  Nova identidade visual (símbolo F+ponto)
    • Símbolo: F com braço do meio = ponto amarelo.
    • SVG inline em sidenav, splash, login.
    • Wordmark "Fiobras" + sub "H U B" letterspacing.
    • Favicon SVG inline (data URI).
    • Ícones PWA 192/512 gerados em runtime via canvas.
  v3.13.0 15/04/2026  +7 users, sessões ativas, filtros log
    • +Hernandes,Vorlei,Pedro,Ivonei,Roland (manutenção)
    • +Jacques,Suyanne (CRM)
    • Modal "Sessões ativas" com heartbeat 60s.
    • Botão "Forçar logout" remoto.
    • Filtros no histórico (user, ação, período).
  v3.12.0 15/04/2026  CRUD de usuários + audit log
    • Criar/excluir usuários via UI (users-config Firebase).
    • Login dropdown agora é dinâmico (USERS + dinâmicos).
    • Audit log: todas as ações de admin gravadas.
    • Botão "Histórico" no painel mostra últimas 100.
  v3.11.0 15/04/2026  Permissões por aba editáveis na UI
    • Editar usuário ganha seção "Abas restritas".
    • RESTRICTED_TABS define quais abas têm acesso limitado.
    • Profile.tabsAllowedOverride sobrepõe TAB_PERMS.
  v3.10.0 15/04/2026  Permissões editáveis na UI (admin)
    • Painel ganha Editar: role, turno, módulos liberados.
    • Helpers getEffectiveRole/Turno/Modules com override.
    • canAccessModule consulta override via Firebase.
  v3.9.0  15/04/2026  Usuários: Edilson + Joacir, painel
    • Adicionados Edilson e Joacir (role: producao).
    • Popup obrigatório "Definir senha" no 1º login.
    • Painel "Gerenciar usuários" no dropdown admin.
    • Reset de senha individual.
  v3.8.2  15/04/2026  Fix Manut.: bootstrap usa '__admin__'
    • Select interno usa '__admin__' (não 'admin'); fix
      libera abas admin-only (Preventiva/Máquinas/Histórico/
      Relatórios) que estavam escondidas por CSS.
  v3.8.1  15/04/2026  Fix Manutenção: splash + body close bug
    • Splash interno escondido (era visual fora do HUB).
    • Bootstrap real antes do </body> (regex pegou primeiro
      </body> que tava em string JS, quebrou tudo).
    • #app{display:block!important} defensivo.
  v3.8.0  15/04/2026  Manutenção integrada via /manutencao/
    • Sub-app em /manutencao/index.html (5500 linhas).
    • firebase-messaging-sw.js copiado pra FCM funcionar.
    • Bootstrap simula login com USERS.admin.
    • WIP removido do módulo Manutenção.
  v3.7.1  15/04/2026  CRM: corte temporal — leads desde 2026
    • Pipeline e Dashboard só mostram leads >= 01/01/2026.
    • Lista mantém catálogo completo (incl. pre-2026).
    • Helper leadsAtivos() filtra por window._leads.data.
  v3.7.0  15/04/2026  Sidebar com toggle expand/collapse
    • 64px (ícones) ↔ 232px (com nomes dos módulos).
    • Botão de toggle no header da sidebar (centro→direita).
    • Estado persistido em localStorage.
    • Mobile: pílula flutuante mantida.
  v3.6.0  15/04/2026  Sistema de tags semânticas (8 variantes)
    • Tokens CSS: success/warning/info/submitted/review/
      danger/neutral/brand (light + dark).
    • Componente .tag base + 8 modificadores + .tag--sm.
    • +8 ícones (alert-triangle, loader, paper-plane, eye,
      badge-check, x-circle, info, check).
    • Desenv. Cor: badges migrados pra .tag + ícone.
  v3.5.0  15/04/2026  Refinamento visual: ícones + Outfit 900
    • Biblioteca de ícones SVG <symbol> em <defs> único.
    • Ícones unificados em line stroke 1.5 round.
    • Outfit Black 900 em hero/KPI/brand/dropdown name.
    • Sidebar/mobile pill/topbar/dropdown migrados.
  v3.4.0  15/04/2026  CRM integrado via /crm/ iframe
    • Sub-app em /crm/index.html (adaptado de fiobras-crm).
    • Shell interno (.header + splash + login) escondido.
    • Bootstrap: mapeia HUB admin → CRM admin.
    • WIP removido do módulo CRM.
  v3.3.0  15/04/2026  Timeline: filtro por tag + contador
    • Barra de pílulas acima do feed (toggle por tag).
    • Contador de registros ao lado do título.
    • Empty state específico pra filtro ativo.
  v3.2.1  15/04/2026  Breadcrumb HUB › Módulo + tabs limpos
    • Breadcrumb padronizado: "HUB › [módulo]".
    • Iframe modules (Preço/CRM/Manut.) escondem tab-bar.
    • Gerencial/Produção mantêm tab-bar (múltiplas abas).
  v3.2.0  15/04/2026  Preço: shell interno removido (UX)
    • Header verde duplicado com topbar do HUB: removido.
    • Toggle tema + logout internos removidos (só no HUB).
    • Footer removido dentro do iframe.
    • Mobile: tabs viram scroll horizontal (sem dropdown).
    • Cache-buster: iframe.src = preco/?v=CURRENT_VERSION.
  v3.1.2  15/04/2026  Fix Preço: bootstrap nunca injetado
    • v3.1.1 tinha bug no script Python: bootstrap era
      substituído em string sem </body>, então nunca
      chegou no arquivo. Agora adicionado manualmente.
  v3.1.1  15/04/2026  Fix Preço: tela preta (tabs stripadas)
    • Preservadas appHeader/appTabs internas do price.
    • Bootstrap chama showApp('Admin') em DOMContentLoaded.
    • Stubs ocultos de splash/loginScreen pra JS legado.
  v3.1.0  15/04/2026  Preço de Venda integrado via /preco/
    • Sub-app em /preco/index.html embutido via iframe.
    • Sessão + tema sincronizados com o HUB.
    • Lazy-load: iframe só carrega no primeiro acesso.
    • WIP removido do módulo Preço (admin-only ativo).
  v3.0.2  15/04/2026  Fix dropdown clip (real) + cache bust
    • Dropdown movido pro body on open (sai do stacking ctx).
    • CSS ganha ?v=3.0.2 pra invalidar cache GitHub Pages.
  v3.0.1  15/04/2026  Minha Conta + fix dropdown clip
    • Minha Conta: nome, email, senha (SHA-256), foto.
    • Cada user edita o próprio perfil via dropdown.
    • Login respeita senha cadastrada (não só admin).
    • Dropdown agora position:fixed (não clipa mais).
    • Path Firebase novo: users-profile/{user}.
  v3.0.0  15/04/2026  Refactor prep: CSS split + Manut + CRM
    • CSS extraído pra css/hub.css (index −1750 linhas).
    • Módulos Manutenção e CRM adicionados (placeholder).
    • Sidenav, header e pílula mobile atualizadas.
    • Próximas sessões: extrair JS de cada módulo existente.
  v2.9.0  15/04/2026  Timeline: tags (Desenv/Problemas/Melh.)
    • Cada registro tem 1 tag obrigatória.
    • 3 tags de sistema: Desenv. de fios, Problemas, Melhor.
    • Admin cria tags custom (nome + cor) em Gerenciar tags.
    • Chip colorido no card do feed + modal detalhe.
    • Path Firebase novo: timeline-tags (só custom).
  v2.8.1  14/04/2026  Fix shell: dropdown cortado + crumb
  v2.8.0  14/04/2026  Shell novo: sidebar + topbar + user
    • Sidebar à esquerda com ícones dos módulos.
    • Topbar com breadcrumb (módulo › aba) e dropdown user.
    • Token --bg-deep (profundidade em camadas no dark).
    • Tema, versão e logout migrados pro dropdown do user.
    • Mobile: sidebar some, mantém pílula flutuante.
  v2.7.4  14/04/2026  Stats Cor: navegação de mês + Lucivane
  v2.7.3  14/04/2026  Fix: botão Lançar Mês (Stats Cor)
  v2.7.2  14/04/2026  Fix: texto da tab ativa sumia em mobile
  v2.7.1  14/04/2026  Mobile: fix cadeado + tabs fixas
    • Cadeado sumia pra admin (CSS agora respeita .locked).
    • Tabs secundárias em mobile: grid fixo, sem arrastar.
    • Labels curtas via data-short pra caber em 5 abas.
  v2.7.0  14/04/2026  Timeline: múltiplas fotos HD + legendas
    • Até 4 fotos por registro, cada uma com legenda própria.
    • Qualidade: 1200px máx, JPEG 0.82 (~210KB/foto).
    • Schema: fotos:[{data,desc}]; fallback p/ foto legacy.
    • Card no feed mostra 1ª foto + badge +N se houver mais.
    • Modal detalhe: stack vertical com legenda em itálico.
  v2.6.3  10/04/2026  Cor: fix botões edit no modal detalhe
  v2.6.2  10/04/2026  Stats Cor: gráfico hist + botão lançar
  v2.6.1  10/04/2026  Cor: ações inline no card (rollback)
  v2.6.0  09/04/2026  Stats Cor — mix de tingimento por fibra
  v2.5.0  09/04/2026  Mobile First · Fases 1+2+3+4+5+rename
    Fase 1 — Fundações técnicas:
    • Anti-zoom iOS: inputs em mobile com font-size 16px.
    • Touch optimization: -webkit-tap-highlight-color:
      transparent global + touch-action:manipulation nos
      elementos tocáveis (remove delay 300ms).
    • overflow-x:hidden proteção extra no .wrap mobile.
    Fase 2 — Nav pílula flutuante + permissões:
    • Pílula flutuante estilo Nubank no rodapé em ≤640px.
    • Todos os módulos visíveis pra todos os usuários.
    • Módulos sem permissão: opacity + cadeado SVG no canto
      + toast "Sem permissão" ao tocar.
    • Footer escondido em mobile (espaço pra pílula).
    Fase 3 — Formulários mdet encorpados:
    • Cada métrica vira card branco grande com hierarquia
      Poppins (label 12px sentence case, input 16px).
    • Selos M/P/S viram grid 3-col legível abaixo do input.
    • Histórico colapsado: só o ano mais recente.
    • Produção mdet ganha mesmo tratamento + charts menores.
    Fase 4 — Tap-to-detail em Desenv. Cor:
    • Cards minimais (código + cliente/cor + badge + dias).
    • Tap abre modal bottom-sheet com foto, chips, histórico
      timeline vertical e ações agrupadas.
    • Cadeado SVG também no header pill 3D desktop — só
      aparece no módulo sem permissão (admin não vê cadeado).
    • switchModule unificado: trata WIP e permissão.
    Fase 5 — Polish final:
    • Tabs horizontais com fade lateral (mask-image).
    • Header mobile com altura natural (saiu height:48px).
    Rename:
    • Módulo "Resultados" passa a se chamar "Gerencial".
  v2.4.0  08/04/2026  Módulo Apontamento Tintoria
    • Nova aba \"Apontamento\" dentro do módulo Produção.
    • Calendário mensal + detalhe do dia com 3 turnos
      (3º → 1º → 2º) e 4 fibras (CO / PAC / PES / CV).
    • 3 líderes de turno: Adelir (1º), Alexander (2º),
      Djoniffer (3º) — só editam próprio turno (read-only
      nos demais com cadeado + banner amarelo).
    • Chefes (Anderson/Aldo/Geovani) e admin editam tudo.
    • Totais do dia calculados em tempo real.
    • Botão pílula Apple-style com sombra verde.
    • Firebase path: apontamento-tintoria-2026.
  v2.3.0  08/04/2026  Rename → HUB · Apple style · pill 3D
    • Rename "Fiobras Dashboard" → "Fiobras HUB".
    • Tema light: paleta sage clarinho + cards brancos puros.
    • Tema dark: Apple style (camadas de cinza, não preto).
    • Header: pill 3D nos módulos com 3 botões.
    • Novo módulo Preço de Venda (em construção, badge WIP).
  v2.2.6  07/04/2026  Ícone de pausa ao lado dos dias
    • Pequeno SVG de pausa antes do "7 dias" quando enviada.
  v2.2.5  07/04/2026  Tirado riscado do contador pausado
    • "7 dias" só esmaecido em cinza, sem line-through.
  v2.2.4  07/04/2026  Regra de pausa de prazo corrigida
    • Desenvolvida não pausa mais — equipe ainda ativa.
    • Só Enviada (cliente externo) pausa o contador.
  v2.2.3  07/04/2026  Tema light reformulado (cream warm)
    • Saiu o branco puro #FFFFFF que cansava a vista.
    • Entrou paleta cream warm: bg #F2F0E9, surface #FBFAF5.
  v2.2.2  07/04/2026  Indicador de tempo pausado em Desenv.Cor
    • Cards Enviada/Desenvolvida ganham label "tempo pausado".
    • Contador de dias riscado em cinza enquanto pausado.
  v2.2.1  07/04/2026  Fix Timeline + schema completo
    • Fix do "undefined" nos cards (fallback evt.objetivo).
    • Schema completo: Objetivo + Descrição + Resultado.
  v2.2.0  07/04/2026  Header limpo + Central de Atualizações
    • Header redesenhado: nav minimal sem fundo verde sólido.
    • Módulos (Resultados/Produção) movidos pra dentro do hdr.
    • Tabs internas mais compactas com underline verde fino.
    • Central de Atualizações: clique na pílula de versão.
    • Remove badge duplicado de nível no Acumulado 2026.
  v2.1.1  02/04/2026  Timeline detalhe + edição + compressão
    • Card minimalista no feed (desc truncada 2 linhas, 1 chip).
    • Modal detalhe ao clicar: foto grande, desc completa, chips.
    • Edição por qualquer usuário; exclusão apenas admin.
    • Compressão de foto: 300px max, JPEG iterativo até <100KB.
    • Fix div balance panel-cores (timeline não renderizava).
  v2.1.0  02/04/2026  Navegação modular + Timeline
    • Seletor de módulo entre header e abas (Resultados / Produção).
    • Módulo Resultados: abas 2026 + Histórico (admin only).
    • Módulo Produção: abas Produção + Desenv. Cor + Timeline.
    • Role produção: abre direto no módulo Produção.
    • Timeline: feed vertical (estilo Nubank) de registros de
      testes de produção. Campos: descrição (obrig.), cliente,
      OP, cor (opcionais), foto (upload + compressão 480px JPEG).
    • Foto fullscreen ao toque, exclusão por admin, agrupamento
      por data (Hoje/Ontem/dd-mm-aaaa), Firebase tempo real.
    • Fix LL Ajustado 2025: 4.457.229 → 4.404.551.
  v2.0.6  01/04/2026  Fix PDF — mostra só o relatório resumido
    • Exportar PDF agora exibe apenas o relatório (produção ou
      desenv. cor), sem KPIs, meses ou conteúdo extra.
    • Print CSS condicional via classe no body (print-prod-rel
      / print-cor-rel) com cleanup via afterprint.
  v2.0.5  01/04/2026  Relatório mensal na aba Produção
    • Botão "Relatório" no detalhe do mês (aba Produção), habili-
      tado quando todos os campos estão preenchidos.
    • Modal com resumo: cada métrica vs meta + status + bônus.
    • Exportar PDF do relatório via impressão (window.print).
  v2.0.4  01/04/2026  Fix vírgula + IPAC acumulado + alinhamento
    • Receita Bruta e LL Ajustado aceitam vírgula decimal.
    • IPAC: sync inicial preenche todos os meses da Produção
      ao carregar (corrige acumulado 2026 e Histórico).
    • Alinhamento vertical dos campos no detalhe do mês.
  v2.0.3  01/04/2026  Fix efic >100% + sync IPAC Prod→2026
    • Campos percentual (Efic. Tinturaria, Repasse, Reprocesso)
      agora exibem corretamente valores ≥100% (ex: 101,00%).
    • IPAC: ao salvar na aba Produção, preenche automaticamente
      na aba 2026 (readonly) e aparece no Histórico.
    • IPAC armazenado em kg (consistente com dados históricos).
  v2.0.2  31/03/2026  Edição nome/obs produção + fix PDF
    • Botão Editar (nome da cor + obs) visível para todos os
      usuários (produção e admin) em todas as cores.
    • Modal leve para editar apenas Nome da Cor e Observações.
    • Admin mantém "Editar Tudo" (modal completo) em ativas.
    • Obs exibida no card quando preenchida.
    • Fix PDF: @media print agora mostra #panel-cores para
      que o relatório renderize corretamente ao imprimir.
  v2.0.1  31/03/2026  Fix mobile · ícones header · tema
    • Ícones header: fix oval no iOS (touch target 44×44).
    • Notch spacer separado do header (não estica ícones).
    • Tema claro: data-theme="light" explícito no HTML.
    • color-scheme:light no :root + meta theme-color dinâmico.
    • Mobile: header/tabs/filtros/modais responsivos.
  v2.0.0  30/03/2026  Aba Produção + Desenv. Cor + gráficos
    • Aba Produção: IPAC (CV+CO+PES+PAC), Efic. Tinturaria,
      Efic. Repasse (3 turnos + média), Dias Desenv.,
      Reprocesso. Prêmios por nível (Meta/Plus/Super).
    • Aba Desenvolvimento de Cor: lista individual por cor,
      fluxo Entrada→Desenvolvida→Enviada→Aprovada,
      pausa/retomada, dias úteis (feriados Indaial/SC),
      filtros por status/mês/cliente, Firebase tempo real.
    • Gráficos split 50/50 nos cards de produção (Chart.js),
      acumulativos até o mês selecionado, linhas de meta.
    • Usuário Geovani adicionado (sem senha, role produção).
    • Bug ponto/vírgula corrigido em todos os inputs.
    • IPAC calculado: (CV+CO)×2,16 + PES + PAC
    • Nomenclatura: Meta / Meta Plus / Super Meta (produção).
  v1.0.0  30/03/2026  Refatoração completa + Login + PWA
    • Fase 1: Alinhamento FIOBRAS_BASE v2 (tokens, header,
      dark mode, Outfit, linha tricolor, SVGs, toast).
    • Fase 2: Login (admin+senha, Anderson/Aldo sem senha),
      splash screen, PWA completo (manifest, ícones, SW).
    • Fase 3: Gráficos adaptativos ao tema, acumBadge,
      bônus anual, IPAC/Clientes como acompanhamento.
    • Fase 4: Refatoração JS (nomes legíveis, comentários),
      CSS organizado em 17 seções.
  v0.8.0  —           Versão original (pré-refatoração)
-->
```
