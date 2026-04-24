/* Fiobras HUB — CHANGELOG (extraído do index.html v3.25.1)
   Carregado sob demanda quando o user clica na pílula de versão. */
window.CHANGELOG = [
  {
    v:'4.8.0', d:'24 abr 2026', current:true,
    items:[
      {type:'feat', title:'Timeline · cards desktop com 2 colunas (descrição + resultado side-by-side).',
        desc:'Mockup mockup-timeline-desktop-dual aprovado pelo William.\n\nNo desktop, cada card da Timeline ganha uma SEGUNDA COLUNA interna com a descrição completa + resultado dos testes ao lado das fotos — aproveitando o espaço grande que ficava vazio. No mobile mantém o stacked (lê-se desc/resultado abrindo o detalhe).\n\n=== ESTRUTURA NOVA ===\nCard `.tl-entry` vira grid `1.1fr 1px 1fr`:\n• `.tl-entry-l` (esquerda): meta + título + sub + fotos + autor (igual v4.5)\n• `.tl-entry-divider` (1px vertical)\n• `.tl-entry-r` (direita): 2 blocos novos\n  - `.tl-block` "Objetivo / descrição" (dot verde)\n  - `.tl-block` "Resultado" (dot azul)\n\nCada bloco tem header DM Mono uppercase pequeno + corpo Poppins .82rem line-height 1.55. Line-clamp 6 com ellipsis pra não estourar (clique abre detalhe pra ver completo).\n\n=== FALLBACKS ===\n• Sem `descricao`: mostra "Sem descrição" em italic muted\n• Sem `resultado`: mostra "Sem resultado" em italic muted\n• Mantém ambos os blocos visíveis (consistência visual entre cards)\n\n=== MOBILE (≤768px) ===\n• `.tl-entry{display:block}` — colapsa pra 1 coluna\n• `.tl-entry-divider{display:none}`\n• `.tl-entry-r{display:none}` — esconde a coluna direita inteira\n• Mantém o stacked atual (idêntico v4.5)\n• Pra ler desc/resultado: tap no card → abre `tlAbrirDetalhe` (modal mostra tudo)\n\n=== LÓGICA INTACTA ===\n• tlDados, tlFilterTag, tlAbrirDetalhe, userChip, agrupamento por dia, variant por tag, tlFormatTime, tlRenderTagChip, fotos com legenda.\n• Schema sem mudança: usa `evt.descricao` e `evt.resultado` (campos existentes desde v2.x).\n\nÚltimo dos 3 mockups aprovados pelo ciclo do dia. Próximo: v4.9.0 Apontamento redesign completo.'}
    ]
  },
  {
    v:'4.7.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Desenv. Cor · compactação + paginação 20/pág.',
        desc:'Mockup mockup-cor-compacto-paginacao aprovado pelo William.\n\n=== COMPACTAÇÃO ===\n• KPIs: font-size 1.85→1.65rem, padding menor (14/16/12)\n• "Prazo mensal" cards verticais 90px → CHIPS HORIZONTAIS inline\n  (~36px de altura, scroll H em mobile, ocupam 1/3 do espaço anterior)\n• Tabela: padding row 13/14 → 10/12 (~10% menor)\n• Gap entre seções 30px → 8-14px\n\n=== PAGINAÇÃO (NOVO) ===\n• Default: 20 cores/página\n• Seletor de itens/pág: 20 / 50 / 100 (persistido em localStorage `fiobras-cor-perpage`)\n• Controles: ‹ 1 2 3 ... N › com ellipsis quando passa de 5 páginas\n• Página atual destacada em verde Fiobras\n• Footer: "Mostrando 1–20 de 312 cores"\n• Reset automático pra página 1 quando filtros mudam\n• Total mantém contagem real (independente da paginação)\n\nFunções novas:\n• window.corPage / window.corPerPage (state global)\n• corPageReset() — chamado pelos onchange dos filtros\n• corPageGo(p) — navega pra página\n• corPagePerSet(p) — muda items/pág + persiste\n\nRegra: 1 página? Mostra só info+seletor (sem botões). Página atual > totalPg após filtro? Auto-clamp pra última página válida.\n\nLógica backend INTACTA: filtros, ordenação (prioritárias→abertas→aprovadas→data desc), KPIs, calcDiasAtivos, todos os quick buttons textuais, Opção E prioridade.\n\nPróximo: v4.8.0 Timeline desktop dual-col, v4.9.0 Apontamento redesign.'}
    ]
  },
  {
    v:'4.6.2', d:'24 abr 2026',
    items:[
      {type:'fix', title:'Mobile · Produção mdet com inputs em 1 coluna (era 2, números grandes estouravam).',
        desc:'BUG (reportado por screenshot): no mobile da aba Produção, dentro do card "IPAC", os 4 inputs de fibra (CV/CO/PES/PAC) renderizavam em grid 2x2. Como os números podem ser grandes (ex: CO=109.787,96 = 10 chars), os valores estouravam visualmente o card direito.\n\nCAUSA: regra `#prodDet .prod-fields{grid-template-columns:1fr 1fr !important}` em @media(max-width:480px) — forçava 2 colunas no iPhone (393px) deixando cada input com ~150px disponíveis; suficiente pra rótulo mas não pra valores grandes.\n\nFIX: trocada pra `1fr` (1 coluna) em todo mobile ≤480px. Cada input agora ocupa toda largura disponível (~340px), comporta números até 12 chars sem estourar. Aplica a TODOS os 5 prod-groups (IPAC, Tinturaria, Repasse, Dias, Reprocesso).\n\nDesktop intacto — `auto-fit, minmax(120px,1fr)` continua, então em telas grandes mostra 4 inline.\n\n1 linha trocada em css/hub.css (1582). Patch dentro da major v4.0.0.'}
    ]
  },
  {
    v:'4.6.1', d:'24 abr 2026',
    items:[
      {type:'fix', title:'Cabeçalhos · regra .gx-h virou GLOBAL (era escopada só pro Gerencial).',
        desc:'BUG: o estilo `.gx-h` (cabeçalho minimal DM Mono uppercase) estava escopado em `#panel-metas, #panel-historico` no css/hub.css. Como Produção/Cor/Apontamento/Stats Cor/Timeline também usam a classe `.gx-h` (introduzida nas entregas v4.1-4.6), os cabeçalhos dessas abas caíam no default e renderizavam como texto Poppins branco normal.\n\nSintomas (reportados por screenshots):\n• Produção: "Acumulado 2026", "Meses · clique...", "Prêmios Produção" em texto branco grande\n• Cor: "Cores" em texto branco grande\n• Stats Cor: idem topo\n\nFIX: removido o escopo `#panel-metas, #panel-historico` das 3 regras (.gx-h base, :first-child, ::after). Como `.gx-h` só é usada nos panels redesenhados, zero risco de vazar pra outros componentes.\n\nLinhas tocadas: css/hub.css 2882-2891 (-3 seletores escopados, +1 regra global). Patch dentro da major v4.0.0.'}
    ]
  },
  {
    v:'4.6.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Mobile · ajustes pras 5 abas redesenhadas (último commit da v4.x).',
        desc:'v4.0.0 entrega #7 (final) · Padrão mobile aprovado em mockup-mobile-todas-abas (iPhone + Android).\n\nMEDIA QUERIES @media(max-width:640px) escopadas por #panel-*:\n\nCOR (Tabela densa colapsa):\n• Header da tabela some\n• Cada row vira card vertical (auto + 1fr + auto / 4 rows):\n  ↳ row1: prio btn · ref · fibra chip\n  ↳ row2: nome (full width)\n  ↳ row3: status · dias\n  ↳ row4: actions full-width (qbtns flex 1)\n• Cliente oculto (vai pra detalhe ao tocar)\n• Border-left mantida pra prio (Opção E)\n\nPRODUÇÃO:\n• Mdet padding reduzido (18/16)\n• Header empilhado (título cima, ações embaixo)\n• KPI val Outfit 1.5rem (era 1.85)\n\nAPONTAMENTO:\n• Calendário compacto (padding 14/12)\n• Day panel padding 18/14\n\nSTATS COR:\n• Fibras tabs scroll horizontal (Total/CO/PAC/PES/CV)\n• Cada chip flex-shrink:0\n\nTIMELINE B:\n• Data label horizontal (era sticky lateral)\n• Vira pill compacta no topo de cada grupo\n• Linha vertical removida (cards stacked)\n• Photos grids responsivos full-width\n\nGERAL:\n• Wrap padding: 14px lateral (era 28)\n• Botões cor-toolbar font menor\n\nFIM da major v4.0.0 (7 entregas):\n#1 v4.0.0 feriados 2026-2050 · #2 v4.1.0 Cor · #3 v4.2.0 Apontamento\n#4 v4.3.0 Produção · #5 v4.4.0 Stats Cor · #6 v4.5.0 Timeline B\n#7 v4.6.0 Mobile (este)'}
    ]
  },
  {
    v:'4.5.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Timeline · Layout Journal (agrupado por dia · Opção B aprovada).',
        desc:'v4.0.0 entrega #6 · Mockup mockup-cor-timeline-opcoes (Opção B) aprovado pelo William.\n\nLAYOUT JOURNAL:\n• Entradas agrupadas por DIA (cronológico desc)\n• Coluna esquerda 140px · sticky · data grande Outfit ExtraBold (verde Fiobras 2.2rem)\n  ↳ "17 / ABR · 26 / QUI / 1 reg"\n• Coluna direita · entradas conectadas por linha vertical (border-left 2px) com bolinhas coloridas (info=azul / danger=vermelho / warning=amarelo)\n• Cards: time + tag + título + sub + fotos + autor\n\nLÓGICA TAGS → VARIANT (cor da bolinha + border hover):\n• desenvolvimento/desenv/teste → info (azul)\n• problema/erro/falha → danger (vermelho)\n• melhoria/otimizacao → warning (amarelo)\n\nFOTOS:\n• 1 foto → grid 1 col (16:10)\n• 2 fotos → grid 2 col\n• 3-4 fotos → grid 4 col (square)\n• 5+ fotos → 3 fotos + tile "+N more"\n\nMOBILE (≤768px):\n• Data label vira inline horizontal (não mais sticky lateral)\n• Linha vertical removida (cards stacked diretamente)\n• Padding reduzido\n\nLÓGICA INTACTA:\n• tlDados (entries do Firebase)\n• tlFilterTag (filtro por tag)\n• tlRenderFilterBar (chips de tags com contadores)\n• tlAbrirDetalhe (modal completo · click no card)\n• tlFormatTime (HH:MM)\n• userChip (avatar do criador)\n• tlRenderTagChip (chip da tag custom)\n\nCSS escopado em #panel-timeline (~70 linhas). Esconde .tl-feed:not(.tl-journal) e .tl-date-sep antigos.'}
    ]
  },
  {
    v:'4.4.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Stats Cor · full-width + gx-h (CSS .sc-* já no padrão).',
        desc:'v4.0.0 entrega #5 · O CSS .sc-fibras/sc-months/sc-detail/sc-donut/sc-hist já era moderno. Mudanças mínimas:\n\n• HTML: 3 .sh+h2+sh-line trocados por gx-h DM Mono\n• HTML: subtítulo "mix de tingimento por fibra/categoria" inline no gx-h principal\n• HTML: botão "Lançar mês" reposicionado pro canto direito do gx-h (era em toolbar separada)\n\nCSS escopado em #panel-statscor:\n• Full-width (max-width:none, padding 24/28/80)\n• Estilo do botão "Lançar mês" inline (verde Fiobras pill)\n• Esconde .sh legacy\n\nLógica intacta: scSetFibra, abrirScLancamento, renderStatsCor, donut SVG, plurianual, 6 categorias (Branco/Clara/Média/Escura/Intensa/Preta), por fibra (Total/CO/PAC/PES/CV).'}
    ]
  },
  {
    v:'4.3.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Produção · padrão Gerencial v3 escopado em #panel-producao.',
        desc:'v4.0.0 entrega #4 · Aplica o mesmo polish do Gerencial v3.56.x na aba Produção.\n\nHTML:\n• 3 .sh+h2+sh-line trocados por gx-h DM Mono uppercase\n• Subtítulo "mensal por métrica" inline no gx-h dos Prêmios\n• Removido subtítulo redundante "Prêmio mensal por métrica..."\n\nCSS escopado em #panel-producao:\n• Full-width (max-width:none, padding 24/28/80)\n• KPIs: padding 18/20/16, border 14, border-top 4 colorido, valor Outfit 800 1.85rem, hover translateY -2px\n• Months grid: 12 colunas, padding 11/8/9, mc-name 600\n• Mdet: padding 24/26, border 16, barra verde gradient (008835→3ECF6E→008835), border-bottom no header\n• Premio block: bg transparent (sem card-em-card)\n\nLógica intacta: renderProducao, renderProdKPI (com YoY vs 2025/2024 nos KPIs), renderProdMeses, renderProdDetalhe (5 grupos: IPAC, Tinturaria, Repasse, Dias, Reprocesso), renderProdPremio, calcIpac, getNivelIpac, salvarMesProd, abrirRelatorioProd.\n\nReusa CSS já existente do .kpi/.mc/.mdet (definido em css/hub.css base).'}
    ]
  },
  {
    v:'4.2.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Apontamento Tintoria · full-width + gx-h minimal (CSS já estava no padrão).',
        desc:'v4.0.0 entrega #3 · O CSS .apt-* (calendário, day panel, turnos, totais) já estava no padrão visual aprovado (Outfit/DM Mono, verde Fiobras, sem branco/preto puro). Mudanças mínimas:\n\n• HTML: substituí h2 "Apontamento · Tintoria" + .sh-line por gx-h DM Mono uppercase (mesmo padrão do Gerencial v3 · 4.x)\n• HTML: badge "X DIAS" reposicionado pro canto direito do gx-h\n• CSS: full-width #panel-apontamento .wrap (max-width:none, padding 24/28/80)\n\nLógica preservada 100%: aptMesNav, salvarApontamento, calendário com dias filled/selected/today, 3 turnos, 4 fibras (CV/CO/PES/PAC), totais (horas/kg), readonly banner pra restrição de role/turno.\n\nNenhum elemento novo · CSS só ~5 linhas.'}
    ]
  },
  {
    v:'4.1.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Desenv. Cor · redesign completo (tabela densa + cor por fibra + Opção E prioridade).',
        desc:'v4.0.0 entrega #2 · Mockup mockup-cor-tabela-fluxo-v2 + cor por fibra + prioridade Opção E aprovados pelo William.\n\n=== O QUE MUDOU ===\n\nLAYOUT:\n• Cards verticais → TABELA DENSA (mais informação por dobra, ordenável por colunas)\n• Filtros (status/mês/fibra/busca) ganharam visual unificado\n• KPI strip alinhado ao padrão Gerencial v3 (border-top colorido)\n• Sem h2 "Desenvolvimento de Cor 2026" / "Filtros" / "Cores" — viraram gx-h DM Mono pequenos\n\nCOR POR FIBRA (paleta):\n• CO (algodão) = azul #0A84FF\n• PAC (acrílico) = amarelo #FFCB00 (light: #A07A00)\n• CV (viscose) = verde #3ECF6E\n• PES (poliéster) = roxo #BF5AF2\n• Outra = cinza\n\nPRIORIDADE (Opção E):\n• Botão circular alert vermelho substitui a estrela amarela\n• Linha inteira ganha bg vermelho sutil + border-left 4px quando prioritária\n• Desabilitado em finalizadas (aprovada/cancelada)\n• Boolean ON/OFF (não 3 níveis) — mantém lógica backend\n\nQUICK BUTTONS:\n• Textuais grandes contextuais (vêm direto de acoesPossiveis())\n• Verde primário pro próximo passo (Desenvolvida/Aprovar/Cliente aprovou)\n• Vermelho outline pra Cancelar\n• Sem emojis — só palavras + ícone SVG (eye) pra "ver detalhes"\n\nDIAS ÚTEIS:\n• Pause icon SVG ao lado quando status=enviada (timer pausado)\n• Vermelho quando >10 dias em aberto (warn)\n• Verde quando aprovada\n• Badge "OP>30D" empilhada quando ultrapassa 30 dias corridos\n• Lógica calcDiasAtivos backend INTACTA (incluindo feriados v4.0.0)\n\n=== LÓGICA BACKEND PRESERVADA 100% ===\n• calcDiasAtivos (pausa em enviada, retoma em em_ajuste)\n• corTemOp30 (dias corridos > 30)\n• acoesPossiveis (botões mostrados por status)\n• togglePrioridadeCor (boolean + histórico)\n• corAcao (mover status com confirmação)\n• abrirCorDetalhe (modal com fotos, timeline, edição)\n• Ordenação: prioritárias primeiro → abertas → aprovadas no fim → por data entrada desc\n• Filtros: status, mês de entrada, fibra, busca em cor/cliente/codigo\n• KPIs: Total Ativas / Em Aberto / Aprovadas / Média Aprovadas (+ Canceladas e OP>30 condicionais)\n• Prazo mensal: cores aprovadas agrupadas por mês de aprovação, OK se ≤10d sem OP>30\n\n=== ELEMENTOS ESCONDIDOS (legacy) ===\n.sh, .cor-card, .cor-filtros (escopados em #panel-cores)\n\n=== ARQUIVOS TOCADOS ===\n• index.html: panel-cores HTML + renderCoresLista() reescritos\n• css/hub.css: ~190 linhas novas escopadas em #panel-cores'}
    ]
  },
  {
    v:'4.0.1', d:'24 abr 2026',
    items:[
      {type:'fix', title:'Feriados · Indaial corrigido pra 21/03 (emancipação Decreto 526/1934).',
        desc:'William confirmou: o aniversário oficial de Indaial-SC é em 21 de março — data da emancipação política do município (Decreto nº 526 de 1934).\n\nA colonização começou entre 1859-1860 com imigrantes alemães, mas a emancipação (separação de Blumenau) foi em 1934. A cidade celebra o aniversário no dia 21/03.\n\nAntes (3.x): hardcoded 29/06 (origem desconhecida)\nv4.0.0: troquei pra 25/06 (data da fundação da colônia)\nv4.0.1: corrigido pra 21/03 (emancipação política)\n\nAtualizado em ambos os arquivos: index.html (IIFE generator) e data/feriados-2026-2050.js (módulo standalone).'}
    ]
  },
  {
    v:'4.0.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'v4.0.0 · MAJOR · Redesign do módulo Produção · feriados 2026-2050.',
        desc:'Início da major v4.0.0 — redesign completo do módulo Produção (5 abas + mobile) com padrão visual aprovado pelo William.\n\n=== ENTREGA #1 desta major: Feriados 2026-2050 ===\n\nANTES: array hardcoded só de 2026 (16 datas) — depois disso, diasUteis() não excluiria feriados.\n\nAGORA: gerador automático cobrindo 2026-2050 via algoritmo Anonymous Gregorian (calcula domingo de Páscoa pra cada ano) + offsets:\n• Carnaval segunda = Páscoa − 48\n• Carnaval terça = Páscoa − 47\n• Quarta de Cinzas = Páscoa − 46\n• Sexta-feira Santa = Páscoa − 2\n• Corpus Christi = Páscoa + 60\n\nFERIADOS COBERTOS (16/ano · 25 anos = 400 datas):\n• 8 nacionais fixos: Confraternização (1/1), Tiradentes (21/4), Trabalho (1/5), Independência (7/9), Aparecida (12/10), Finados (2/11), República (15/11), Natal (25/12)\n• Móveis: Carnaval seg+ter, Quarta Cinzas, Sexta Santa, Corpus Christi\n• Consciência Negra (20/11) — nacional desde 2024\n• SC Data Magna (11/08)\n• Indaial 25/06 (fundação 1860 — antes era 29/06, aguardando confirmação)\n\nIMPLEMENTAÇÃO: IIFE no boot popula window._FERIADOS_FIOBRAS, FERIADOS_SET cobre tudo. diasUteis() existente (que já usa FERIADOS_SET) ganha 24 anos extras de cobertura sem alteração.\n\nNo arquivo data/feriados-2026-2050.js fica a versão ES module standalone pra reuso.\n\nPRÓXIMOS COMMITS DA v4.0.0 (em ordem):\n• Cor (Opção E prioridade + cor por fibra)\n• Apontamento\n• Produção (5 grupos)\n• Stats Cor\n• Timeline B\n• Mobile pra todas as abas'}
    ]
  },
  {
    v:'3.56.3', d:'24 abr 2026',
    items:[
      {type:'fix', title:'Gerencial · "Progresso & Prêmios" movido pro final da página.',
        desc:'William: o quadro de Progresso & Prêmios é consequência dos dados — faz mais sentido vir DEPOIS de visualizar/lançar os meses, não antes.\n\nNova ordem da aba 2026:\n1. Acumulado 2026 (KPIs com YoY)\n2. Meses · clique para lançar\n3. Resultado de [mês] (mdet · aparece quando seleciona)\n4. Progresso & Prêmios 2026 (Achievement Ladder · final)\n\nAntes: Progresso vinha entre KPIs e Meses. Agora KPIs → ação (lançar) → consequência (Progresso/Prêmios).'}
    ]
  },
  {
    v:'3.56.2', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Gerencial · "Progresso por nível de meta" + "Prêmios" UNIFICADOS num único bloco (Achievement Ladder).',
        desc:'Conceito A do mockup-progresso-premios-unificado.html aprovado pelo William.\n\nANTES (2 blocos separados):\n• Progresso por nível de meta: 6 barras (2 métricas × 3 níveis)\n• Prêmios: 3 cards (Meta/Plus/Super) com Receita+Lucro+Bônus em cada\n\nDEPOIS (1 bloco unificado "Progresso & Prêmios 2026"):\n• 3 cards lado a lado (Meta → Plus → Super)\n• Cada card tem header com nome + sublabel ("Nível base"/"+5%"/"+10%") + TOTAL ACUMULADO grande à direita\n• Dentro: 2 mini-painéis (Receita Bruta · LL Ajustado)\n• Cada mini-painel: nome + %atingido grande + barra de progresso + R$ realizado/meta + chips de meses batidos + linha de bônus (mensal + anual + total da métrica)\n\nMUDANÇAS CÓDIGO:\n• Nova função renderProgressoPremios() substitui renderAnual + renderPremio (math intacto)\n• Função antiga renderAnual + renderPremio mantidas no código mas não chamadas (compat)\n• #progressoPremiosGrid no HTML substitui #anualGrid + #premioGrid (mantidos hidden pra não quebrar)\n• CSS escopado #panel-metas .pp-* (170 linhas)\n\nVALORES PREMIOS confirmados (já existentes no código):\n• Meta: R$ 500/mês por métrica · Bônus anual R$ 2.500\n• Meta Plus: R$ 1.000/mês por métrica · Bônus anual R$ 8.000\n• Super Meta: R$ 1.621/mês por métrica · Bônus anual R$ 15.000 (Receita) / R$ 20.000 (LL)\n\nGANHO: ~280px de altura recuperados (eram 2 seções com h2+border, agora 1 sem repetição)'}
    ]
  },
  {
    v:'3.56.1', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Gerencial · polish mais agressivo (full-width + KPIs grandes + mdet hero forte).',
        desc:'Ajuste pós v3.56.0: William reportou que as mudanças ficaram sutis demais. Aplicado polish realmente visível.\n\nFULL-WIDTH:\n• Sai o `max-width:1160px` do .wrap em panel-metas + panel-historico — agora usa toda a largura da tela com padding 36px lateral. ~370px de espaço vazio por lado eliminado em monitor 1920px.\n\nKPIs MAIORES (mais impacto visual):\n• Padding 14/16/12 → 22/24/20\n• Border-top 3px → 4px (mais marcante)\n• Border-radius 10 → 14\n• Valor: Outfit ExtraBold 1.55rem → 2.4rem (+55%)\n• Label uppercase em vez de mixed case\n• Hover translateY(-2px)\n• YoY com font-size maior (.78/.85 era .66/.72)\n\nMONTHS GRID (chips mais visíveis):\n• Padding 10/6/8 → 14/8/12\n• Gap 5 → 8\n• mc-name fonte .58 → .65rem, weight 500 → 600\n• mc-mini fonte .62 → .78rem com Outfit Bold (era DM Mono)\n\nMDET (hero card forte):\n• Padding 22/24 → 28/32\n• Border-radius 14 → 16\n• Barra verde topo: 3px sólido → 4px gradient (verde escuro → bright → escuro)\n• Header com border-bottom + padding 18\n• Título: Outfit Bold .95rem → ExtraBold 1.15rem\n• Mês destacado em verde com capitalize\n• Grid gap 16 → 24 (mais respiro entre as 4 colunas)\n\nANUAL BLOCK (progresso meta):\n• Padding 20/22 → 26/30\n• Gap entre Receita/LL: 24 → 40\n• Bars 6px → 8px\n• Label .6rem 600 → .65rem 600 com mais letter-spacing\n• Pct min-width 42 → 54, font .72 → .8rem\n\nResultado: muito mais respiro, hierarquia visual clara, valores em destaque.'}
    ]
  },
  {
    v:'3.56.0', d:'24 abr 2026',
    items:[
      {type:'feat', title:'Gerencial · redesign minimal aplicado (mockup-gerencial-v3 aprovado).',
        desc:'Primeiro sistema do HUB principal a receber o padrão minimal aprovado pelo William em mockup-gerencial-v3.html. Aba "2026" + aba "Histórico".\n\nMUDANÇAS HTML (panel-metas + panel-historico):\n• Cabeçalhos `<div class="sh"><h2>...</h2><div class="sh-line"></div></div>` (4 ocorrências) → `<div class="gx-h">...</div>` (DM Mono uppercase com line discreta).\n• Removido box-shadow inline do botão Zerar.\n\nMUDANÇAS CSS (css/hub.css +180 linhas, escopo `#panel-metas`):\n• KPI cards: padding 18→14, border-top 3px colorido, sem shadow, valor em Outfit ExtraBold (era DM Mono).\n• Anual block: padding 22→20, gap 28→24, progress-fill com radius pill.\n• Months grid: chips menores (padding 10→10/6/8), bullet de nível ≤5px, sem shadow, mc-dot escondido (redundante com mc-lvl).\n• Mdet (resultado do mês): hero card com barra verde gradient no topo, mantém 4 colunas paralelas (Receita/LL/IPAC/Clientes), inputs em hero style com focus glow.\n• Mdet input field: height 40, prefix sem bg colorido (era verde), Outfit no input.\n• Mdet histórico: linhas com border-bottom dashed (era line-height pesado).\n• Mdet níveis (M/P/S): footer mini chips separados por border-top.\n• Prêmios: cards com border-top colorido por nível (verde/azul/amarelo), sem shadow, premio-block sem fundo (vira transparent — só é container).\n• Histórico (charts): chart-card com border 1px (era 1.5), sem shadow.\n\nRESPEITA:\n• Toda a matemática (renderKpiStrip, renderAnual, renderMeses, renderDetalhe, renderPremio) intocada.\n• Comparação YoY no topo (que já existia).\n• Progresso por nível de meta com barras Super/Plus/Meta (que já existia).\n• 4 colunas paralelas no lançamento (Receita/LL/IPAC/Clientes) com input + histórico anos + footer M/P/S.\n• Bullet de nível atingido nos meses (verde=meta, azul=plus, amarelo=super).\n\nREGRAS NOVAS aplicadas:\n• Sem branco/preto puro (tokens locais off-black/off-white quando aplicável).\n• Cabeçalhos só quando necessário (DM Mono uppercase com line — não h2 com border espesso).\n\nPRÓXIMOS sistemas a receber o mesmo tratamento (faseado): Produção, Cor, Apontamento, Timeline, Stats Cor, CRM, Manutenção. Mockup completo em mockup-hub-todos-v2.html.'}
    ]
  },
  {
    v:'3.55.2', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Preço · polish visual + fontes do design system (Outfit/Poppins/DM Mono).',
        desc:'Ajuste fino do redesign minimal v3.55.0 — observação do William sobre fontes fora do padrão e light/dark mode.\n\n• FONTES: removido Inter (não é do design system do HUB). Tudo agora usa Outfit (display/títulos), Poppins (UI/botões) e DM Mono (eyebrows/números/IDs) conforme CLAUDE.md.\n\n• TOGGLE Com/Sem tingimento: ativo era branco-em-preto invertido (estranho em light). Agora usa verde Fiobras (#008835 light, #3ECF6E dark) — consistente com ICMS/Meta/Save.\n\n• HERO RESULT: gradient sutil que sumia em light mode → trocado por surface sólido com border + barra verde no topo (3px gradient verde→bright). Funciona igual nos dois temas.\n\n• INPUTS: border 1.5px → 1px (mais clean). Border-radius 8 → 10. Height 46 → 48. Focus glow verde adicionado (box-shadow 3px). Mesma melhoria no .mn-edit-input (custo hora editável).\n\n• ICMS / META / FIO PILLS: hover state verde antes era inexistente em mn-icms — agora pinta border+texto verde no hover.\n\n• TIPOGRAFIA: hero h1 1.4 → 1.25rem (menos ego, mais ar). Eyebrows DM Mono com mais letter-spacing (2.2px). Hist-card name +Outfit weight, KPI value 1.4 → 1.45rem.\n\n• CARDS HISTÓRICO: hover translateX 2px verde + avatar 38 → 40px.\n\n• EMPTY STATE: bg surface + border dashed (era texto solto).\n\n• BUTTONS save/add: text-transform uppercase + transform translateY(-1px) no hover.\n\n• SPACING: container padding 24/22/60 → 28/24/64 (mais respirável). Sections 26 → 28px gap.'}
    ]
  },
  {
    v:'3.55.1', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Preço · hotfix tela em branco (SyntaxError quebrava o script principal).',
        desc:'Bug crítico do v3.55.0: tela do Preço carregava completamente em branco (só mostrava o header e as tabs). Causa: na linha 1927 das overrides v3.55.0 redeclarei `const _origRenderCustos` que JÁ existia desde v3.54.2 (linha 1666 — wrap do applyCustosPermissions). SyntaxError "Identifier _origRenderCustos has already been declared" parava o parse do script INTEIRO, então NENHUMA função (switchTab, calcVendas, applyTheme, etc) era declarada → tela branca + console silencioso (Firebase callbacks ainda rodavam mas as functions não existiam).\n\nFix: renomeado pra `_mnOrigRenderCustos`. node --check passa, switchTab/calcVendas existem no window, panel-vendas ativa corretamente, hero render OK.\n\nLição: na próxima vez que adicionar `const _origXxx`, grep antes pra ver se já existe.'}
    ]
  },
  {
    v:'3.55.0', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Preço · redesign minimal completo nas 6 abas (mockup aprovado pelo William).',
        desc:'Mockup mockup-preco-minimal-completo.html aprovado.\n\nMINIMAL UNIVERSAL nas 4 abas de cálculo (Vendas/Tingimento/Preparação/Retorção):\n• Removidos os "steps numerados 1/2/3" (bullets verdes gigantes) — viraram eyebrows DM Mono pequenos.\n• Removidas as fix-chips decorativas de margens (Lucro op/Desp op/JCP/IRPJ+CSLL) — viram hidden state pra calc functions.\n• Removido o campo "Retorção/Preparação" da aba Vendas (não usado).\n• Cards de preço empilhados → HERO RESULT card único no topo do resultado, com preço grande Outfit Light (3.4rem), margem consolidada e lucro líquido em DM Mono à direita, breakdown (custo total · tributos · lucro) no rodapé.\n• Meta de margem: 6 botões soltos → SEGMENTED CONTROL inline com labels completas (0%, JCP+0%, JCP+3%, JCP+5%, JCP+10%, JCP+25%).\n• ICMS do fornecedor (Vendas): 5 botões com estilo unificado verde Fiobras quando ativo.\n• "Custo real do fio" virou strip linha verde discreta.\n• Cadeado emoji 🔒/🔓 (Preparação/Retorção) substituído por botão "EDITAR" textual integrado ao input — clica vira "SALVAR".\n• Animação flash verde nos números ao recalcular.\n\nCUSTOS:\n• Header com search bar + botões "+ Cor", "+ Tipo de fio", "Salvar alterações" todos em pill estilo único.\n• Tipos de fio viram PILLS (era tabs retangulares) com badge "base/auto" indicando se é CO ou derivado.\n• Tabela editável inline limpa (sem pills brancas, headers DM Mono uppercase).\n• Multiplicadores % editáveis em TEMPO REAL pra fios derivados — sem cadeado/modo edição. Salva auto após 600ms de pausa.\n\nHISTÓRICO:\n• KPI bar no topo (Cotações 30d, Ticket médio, Clientes únicos).\n• Filtro busca em pill arredondada.\n• Cards modernos com avatar gradient colorido por cliente (hash do nome → 7 paletas).\n• Ações de editar/excluir em botões circulares só pra admin.\n\nFÓRMULAS BACKEND INTOCADAS: calcResultado, resolverLucroParaMeta, ICMS_FUNDOS, PIS_COFINS_AL, IRPJ_RATE, cenariosVenda, cenariosServico, MULTIPLICADORES — todos preservados. Apenas a renderização (innerHTML pra hero) e os seletores dos handlers (setICMS, setVModo, setTarget*, toggleCustoHora*) foram adaptados pros novos elementos via overrides em window.* no fim do script.\n\nFonte: o redesign segue o mockup interativo aprovado em mockup-preco-minimal-completo.html.'}
    ]
  },
  {
    v:'3.54.3', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Preço · aba Custos com design alinhado ao HUB (sem pills brancas, headers DM Mono, save em verde).',
        desc:'Bug visual: na aba Custos > CO os inputs apareciam com pill outline branco/cinza ao redor de cada célula da tabela, headers em ciano, botão "Salvar Alterações" em amarelo. Quebrava completamente o design system (verde Fiobras + Outfit/DM Mono).\n\nCausa: regra global `input[type="text"], input[type="number"] { border:1.5px solid var(--border2) !important }` (linha 678) aplicava nos inputs DENTRO da tabela, criando double border (linha-da-célula + pill do input).\n\nFix:\n• Override específico `.cores-table td input` com `border:none !important; padding:0 !important` — input volta a ser invisível dentro da célula.\n• Header `.cores-table th`: cyan (var(--blue)) → DM Mono var(--muted) uppercase, sem bg colorido.\n• Botão "Salvar Alterações" (.save-btn): yellow → green Fiobras com hover invertido (preenche verde).\n• Estado escuro do header (sem bg cinza, transparente).'}
    ]
  },
  {
    v:'3.54.2', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Preço · admin/gerente conseguem editar percentuais dos derivados (CV/PAC/PES) + botão "Editar %" mais limpo.',
        desc:'Bug: ao clicar no cadeado da tabela de fios derivados, nada acontecia. `__hubBootPreco` (bootstrap do iframe) não setava `isAdmin=true` quando admin/gerente abria o módulo. Daí `toggleMultEdit()` retornava no `if(!isAdmin)return;` e a edição nunca destravava.\n\nFix: bootstrap agora lê `localStorage["fiobras-dash-auth"]` (mesmo padrão da v3.52.5 do CRM), resolve role real via cache de users-profile e seta `isAdmin = (role === "admin" || role === "gerente")`.\n\nVisual: substituído o cadeado emoji 🔒/🔓 por botão "Editar %" / "Salvar" estilizado (verde Fiobras, padding adequado, bordas e estados claros). A barra superior dos derivados ganhou flex-wrap pra não quebrar em mobile estreito.'}
    ]
  },
  {
    v:'3.54.1', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · técnico e gerente sem flag só veem aba Kanban (mockup aprovado).',
        desc:'Mockup mockup-abas-por-role.html aprovado.\n\nAntes: qualquer user com módulo Manutenção via 6 abas (Dashboard, Kanban, Preventiva, Máquinas, Histórico, Relatórios). Técnico via Dashboard/Kanban/Histórico, admin via tudo.\n\nAgora:\n• Admin → vê TODAS as 6 abas\n• Gerente COM supervisaoManutencao=true (Joacir) → vê TODAS\n• Gerente SEM flag (Edilson, Jairo) → SÓ Kanban\n• Producao com módulo Manutenção (Vorlei, Pedro) → SÓ Kanban\n\nNovo body class `is-mn-superv` adicionado ao body se admin ou gerente com flag. CSS:\n  body:not(.is-mn-superv) .tab-btn.admin-only { display: none; }\n\nDashboard ganhou class `admin-only` (antes era visível pra todos). Mesmo critério aplicado no bottom-nav mobile.\n\nReusa o flag supervisaoManutencao da v3.52.7 (Editar Usuário no HUB → toggle "Supervisiona Manutenção" pra gerentes). Quem você marcar como supervisor lá já ganha acesso completo às abas.\n\nDoLogout limpa body.is-mn-superv também.'}
    ]
  },
  {
    v:'3.54.0', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · Templates de preventiva por frequência (cadastro de máquina) + +Preventiva puxa templates.',
        desc:'Mockup mockup-templates-preventiva.html aprovado.\n\nNOVO SCHEMA: manutencao/maquinas/{key}/prevsTemplate = { diaria:[], semanal:[{tarefa,obs}], quinzenal:[], mensal:[], trimestral:[], semestral:[], anual:[] }\n\nMODAL "EDITAR MÁQUINA":\n• Antes: textarea único pra todas preventivas (uma por linha)\n• Agora: TABS por frequência com bullet colorido + contador. Cada tarefa: nome + observação opcional + botão remover. "+ Adicionar tarefa [freq]" no fim.\n• Migração automática: se a máquina tem prevs (string/array antigos) mas não tem prevsTemplate, joga tudo na aba "Semanal" pra admin recategorizar.\n• Salva mantém prevs (legacy) sincronizado pra retrocompat.\n\nMODAL "+ NOVA PREVENTIVA":\n• Quando muda a frequência selecionada → recarrega templates daquela freq da máquina selecionada\n• Cada item template mostra nome + observação (em itálico embaixo)\n• Multi-select continua igual (marca várias → cria todas de uma vez)\n• Obs do template entra como obs da preventiva criada (junta com obs do form se ambos preenchidos)\n• Custom continua disponível pra adicionar tarefa fora do template\n\nINTEGRAÇÃO COM v3.53.0: cadastrar 5 anuais via templates → no Kanban viram 1 card só "Preventiva Anual · RET-02 · 5 tarefas" automaticamente (agrupamento natural).'}
    ]
  },
  {
    v:'3.53.0', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · Cards de preventiva agrupados por máquina+freq+resp + checklist com auto-mover.',
        desc:'Demanda do Joacir aprovada via mockup-card-agrupado-checklist.html.\n\nAGRUPAMENTO: 5 cards "Semanal RET-01" → 1 card só "Preventiva Semanal · RET-01" com badge "5 tarefas". Agrupa por (tipo=preventiva, máquina, frequência, responsável, coluna). Cada user vê só o agrupamento dos cards onde é resp.\n\nCARD AGRUPADO mostra:\n• Avatar do responsável\n• Título: "Preventiva Semanal · RET-01"\n• Badge azul: 📋 5 tarefas\n• Timer + barra de progresso (% checklist)\n• Botões ▶ Iniciar / ◀ Voltar / ✓ Concluir todas\n\nCLICK no card agrupador abre modal-pv-checklist com:\n• Info da máquina (status, próxima execução, tempo em execução, responsável)\n• Checklist de cada tarefa (checkbox + nome + última execução)\n• Footer: progresso (X/Y) + botão "Concluir todas"\n\nAÇÕES NO CHECKLIST:\n• Click no item → toggle done (sem modal de assinatura por item, agiliza UX)\n• Quando 100% checados → AUTO MOVE pra "Concluído" + fecha modal\n• Botão "Concluir todas" → marca todos + move pra done\n\nATALHOS NO CARD KANBAN:\n• ▶ Iniciar: move TODAS as tarefas do grupo pra "Em Andamento"\n• ✓ Concluir todas: marca todas + move pra "Concluído" (cascata pras menores roda automático)\n• ◀ Voltar: volta todas pra "A Fazer"\n\nCASCATA: ao concluir o grupo, cada tarefa atualiza ultima=hoje na sua preventiva (Firebase). A regra de cascata pra freqs menores (v3.50.0) continua valendo — concluir mensal de RET-01 fecha cards menores absorvidos.\n\nCards não-preventiva (demanda/instalação/corretiva): continuam soltos, sem agrupamento. Preventiva única: vira card normal (grupo de 1 → render normal).'}
    ]
  },
  {
    v:'3.52.7', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Filtro de técnicos por gerência: novo flag "supervisiona Manutenção" no painel admin.',
        desc:'Resolve o caso do William: Edilson e Jairo são gerentes mas não atuam na Manutenção; Joacir é gerente E supervisiona Manutenção. Antes todos apareciam (admin/gerente entram no toggle por default).\n\nNovo campo: <code>users-profile/{user}/supervisaoManutencao</code> (boolean).\n\nUI no HUB:\n• Gerenciar Usuários → Editar usuário\n• Quando role = Gerente, aparece toggle "Supervisiona Manutenção"\n• Marca/desmarca por user. Salva no users-profile.\n• Outros roles: campo escondido (admin sempre supervisiona implicitamente; producao usa modulesAllowedOverride).\n\nFiltro do toggle no Kanban da Manutenção:\n• producao com módulo manutencao → aparece (técnicos)\n• gerente COM supervisaoManutencao=true → aparece (Joacir)\n• gerente sem flag → some (Edilson, Jairo)\n• admin master → some (William supervisiona via "Time")\n\nWilliam: pra fazer Joacir aparecer, vai em Gerenciar Usuários → editar Joacir → marcar "Supervisiona Manutenção" → Salvar.'}
    ]
  },
  {
    v:'3.52.6', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · Toggle de técnicos clean (4 ajustes aprovados).',
        desc:'Mockup mockup-toggle-cleanup.html aprovado, fixes 1-4:\n\n1) CAIXA DE DEBUG REMOVIDA do canto inferior direito (era pra dev temporário). _debugKanbanOnScreen deletada. window.__debugKanban no console mantido caso precise debug futuro.\n\n2) PILLS SÓ COM NOME (sem avatar/foto/iniciais coloridas). Mais clean, escala melhor com vários técnicos. Pills "Meus" e "Time" em azul (especiais), técnicos em cinza/verde.\n\n3) CONTAGEM SÓ POR RESPONSÁVEL (ignora autor). Antes Edilson aparecia com badge "1" porque criou uma demanda pro Joacir — agora conta só quem é responsável. Edilson sem badge se ele só criou.\n\n4) DEFAULT "TIME" FORÇADO pra admin/gerente. Limpeza one-shot do localStorage["fio_kb_view_*"] antigo via flag fio_kb_view_reset_v1 (roda 1x). Admin abre sempre vendo tudo.\n\n#5 ADIADO: ocultar gerentes do toggle. William quer entender melhor o role producao vs gerente — Joacir é gerente de manutenção, deve aparecer; Edilson/Jairo são gerentes de outras áreas. Vai auditar role na próxima rodada.'}
    ]
  },
  {
    v:'3.52.5', d:'23 abr 2026',
    items:[
      {type:'high', title:'Sub-apps · iframe agora respeita user logado no HUB (não força mais admin).',
        desc:'BUG RAIZ: o iframe do Manutenção (e CRM) tinha um bootstrap que FORÇAVA login local como admin no boot, ignorando quem estava logado no HUB.\n\nDetecção: Vorlei (técnico) entrava no HUB → abria Manutenção → o iframe fazia auto-login como admin → state.isAdmin=true → toggle de técnicos aparecia + Kanban mostrava todos os cards (não só os do Vorlei).\n\nCausa: havia uma função _autoLoginViaHub() que tentava ler `window.getCurrentUser()` — função que vive NO PARENT (HUB), não dentro do iframe. Como `window.getCurrentUser` é undefined no iframe, a função sempre falhava → caía no force-admin do __hubBootManut.\n\nFIX (mockup-bug-iframe-login.html aprovado pelo William):\n\n• Manutenção: _autoLoginViaHub reescrita pra ler `localStorage["fiobras-dash-auth"]` DIRETO (compartilhado entre HUB e iframes do mesmo subdomain). Resolve role real via cache de users-profile/users-config.\n\n• Manutenção: __hubBootManut não força mais admin. Tenta _autoLoginViaHub primeiro. Só cai pra tela de login local se não houver sessão (ex: alguém abriu manutencao/ direto sem passar pelo HUB).\n\n• CRM: __hubBootCrm fazia `window._user.papel = "admin"` SEMPRE. Agora detecta role real do user (admin/gerente do HUB → papel admin no CRM; producao → papel comum).\n\n• Preço: já não tinha esse bug (não força admin), só revela a UI.\n\nResultado: Vorlei entra no Manutenção, vê SÓ os cards dele, sem toggle. William entra, vê tudo + toggle.'}
    ]
  },
  {
    v:'3.52.4', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · 2 bugs do toggle de técnico (CSS dentro de @media + default admin).',
        desc:'Diagnóstico via overlay v3.52.2:\n\n1) AVATARES VISUAIS BUGADOS: o CSS do toggle (.kb-view-pick, .kb-view-circle, etc) E dos campos de contexto (.ca-ctx) estavam dentro de `@media(max-width:768px)` desde v3.50.2/v3.51.0 (fui inserindo após .btn-notif-test que tava dentro do @media e não percebi). Resultado: estilos só aplicavam em mobile. Em desktop os botões viravam texto puro colado. FIX: bloco inteiro movido pra top-level.\n\n2) ADMIN VIA "MEUS" POR DEFAULT: William é admin mas não tem cards próprios → Kanban ficava vazio mesmo com toggle funcionando. FIX: admin/gerente agora abre default em "Time inteiro" (faz sentido — supervisor vê tudo). Técnico continua "meus" fixo.'}
    ]
  },
  {
    v:'3.52.3', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · admin/gerente perdeu o toggle e via Kanban vazio.',
        desc:'BUG diagnosticado via overlay v3.52.2:\n  state.user="William" · state.userKey="admin"\n  ehAdminGer=false (deveria true)\n  state.isAdmin=true (correto)\n\nCausa: _ehGerenteOuAdmin priorizava window.getCurrentUser() — função que NÃO existe dentro do iframe do Manutenção. Caía no fallback que lê users-profile/admin/roleOverride. Como William não tem roleOverride explícito (role vem hardcoded como admin via USERS), a leitura retornava undefined → role default "producao" → função retornava false.\n\nFix: prioridade pra state.isAdmin que já é setado em _autoLoginViaHub como `u.isAdmin || u.isGerente` (cobre admin + gerente, fonte mais confiável dentro do iframe).\n\nResultado: admin volta a ver toggle de técnicos + Kanban populado. Vorlei (técnico) continua só vendo os dele.'}
    ]
  },
  {
    v:'3.52.2', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · debug ON-SCREEN do Kanban vazio (sem precisar console).',
        desc:'William reportou que não conseguia digitar no console pra rodar __debugKanban().\n\nAgora: quando o Kanban renderiza vazio MAS tem cards no banco, aparece automaticamente uma caixa amarela no canto inferior direito com:\n• state.user, state.userKey, resolved\n• ehAdminGer, state.isAdmin\n• Total cards × visíveis\n• Os 6 primeiros cards com seus campos resp/respKey/autor/autorKey\n• Resultado do filtro pra cada um\n\nWilliam: print da caixinha amarela quando aparecer.'}
    ]
  },
  {
    v:'3.52.1', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · 4 erros após cleanup v3.52.0 (refs órfãs + SW clone bug).',
        desc:'William reportou 4 erros no console após v3.52.0:\n\n1) `initNotificacoes is not defined` — chamada residual em doLogin (não removida na limpeza). FIX: removida.\n\n2) `renderPecas is not defined` — função stub jamais implementada que ficou sendo chamada no onValue de pecas. FIX: removida a chamada.\n\n3) `onPvTarefaChange is not defined` — função obsoleta exportada na lista mas já tinha sido removida há tempos. FIX: tirada do export.\n\n4) `Failed to execute clone on Response: Response body is already used` no sw.js — bug do staleWhileRevalidate. O clone era chamado dentro de `caches.open().then(cache => cache.put(req, res.clone()))`, async DEPOIS do `return res`. O browser já tinha começado a consumir o body. FIX: clone IMEDIATO antes de schedule do put.'}
    ]
  },
  {
    v:'3.52.0', d:'23 abr 2026',
    items:[
      {type:'high', title:'Manutenção · Cleanup geral: notificações DELETADAS por completo + helper de debug.',
        desc:'Pacotão de limpeza após auditoria (AUDIT-CLEANUP-v3.52.md).\n\n═══ ARQUIVOS DELETADOS ═══\n• manutencao/firebase-messaging-sw.js — SW do FCM\n• workers/digest-diario-preventivas/ — pasta inteira do worker Cloudflare\n• Pasta workers/ ficou vazia (também removida)\n\n═══ FUNÇÕES JS DELETADAS (eram no-ops) ═══\n• notificarPreventiva, reNotificarPreventivasPendentes\n• mostrarNotif, checkNotifNovosCards, dispararNotif, agendarRenotif\n• initNotificacoes, toggleNotifPermission, _atualizarNotifSwitch\n• mostrarBannerNotif, esconderBannerNotif, pedirPermissaoNotif\n• abrirModalNotifAdmin, enviarNotifAdmin\n• exibirInAppNotif, fecharInAppNotif\n• verificarNotificacoesPerdidas, abrirModalNotifHistorico\n• marcarTodasLidas, atualizarBadgeNotif\n• resetNotificacoesDiarias, agendarResetMeiaNoite\n• enviarDigestDiario, agendarDigestDiario\n• initFCMToken, _fbSaveToken, _fbPushFCMPending\n• updateBanner (banner kanban de preventivas vencidas)\n• Variáveis: notifPermission, inAppTimer, prevCardIds, notifIntervals\n• Bloco de registro do SW (navigator.serviceWorker.register)\n\n═══ HTML DELETADO ═══\n• #kanban-banner\n• #inapp-notif (popup interno)\n• #modal-notif-admin + #modal-notif-historico\n• Botões: #btn-notif-test · #btn-ver-notifs · #btn-notif-toggle · #btn-notif-count\n\n═══ HOSTS LEGACY removidos ═══\n• #prev-tbody, #prev-cards-mobile, #prev-pagination (substituídos por pv-machine-list em v3.48.9)\n• Função _prevGoPage (paginação saiu)\n\n═══ CSS LIMPO ═══\n• Regras .prev-card, .prev-card-*, .prev-pagination, .prev-page-btn\n• Refs a #kanban-banner, #inapp-notif, #btn-notif-*\n• .btn-notif-label, #btn-notif-test\n\n═══ DEBUG VORLEI ═══\nNovo helper window.__debugKanban() — rodar no console pra ver:\n• state.user, state.userKey, resolved key\n• isAdminGer\n• Pra cada card: campos resp/respKey/autor/autorKey + se passa filtro\n\nWilliam: se Kanban do Vorlei continuar vazio depois desse deploy, abre F12 → console → digita __debugKanban() → enter → me manda print do output.\n\nResultado: -650 linhas no manutencao/index.html. Sistema bem mais limpo, fácil de manter. Quando voltar a fazer notificações, recriamos do zero com regra documentada.'}
    ]
  },
  {
    v:'3.51.2', d:'23 abr 2026',
    items:[
      {type:'fix', title:'HUB · 2 bugs no auto-login: pedia senha de novo + abria módulo errado.',
        desc:'BUGS reportados pelo William após Ctrl+Shift+R com Vorlei (técnico):\n\n1) POPUP "DEFINIR SENHA" aparecia mesmo com senha já cadastrada.\n2) App abria no módulo Produção, mas Vorlei só tem Manutenção liberado.\n\nCausa raiz comum: o splash de auto-login dura 800ms e dispara setupTabs + checkDefinirSenha em 600ms. Mas o Firebase pode levar 1-3s pra carregar `window._usersProfile`. Sem o profile:\n• checkDefinirSenha vê profile.senhaHash undefined → mostra popup\n• setupTabs vê modulesAllowedOverride undefined → cai no DEFAULT_MODULES_BY_ROLE.producao = [producao,manutencao,crm] → abre Produção\n\nFix: ambas as funções agora detectam se _usersProfile foi populado. Se não, fazem retry a cada 500ms (até 8s). Quando Firebase chegar com os dados reais, executam com o profile correto.\n\nResultado: técnico abre direto no único módulo liberado e não vê popup de senha desnecessário.'}
    ]
  },
  {
    v:'3.51.1', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · Kanban: técnico não via os próprios cards (filtro por nome literal vs canônico).',
        desc:'BUG: William reportou que após v3.50.4 o Kanban do Vorlei (técnico) ficou vazio mesmo tendo cards atribuídos a ele.\n\nCausa: o filtro `eMeu` comparava `card.resp` com `state.user` por string literal. Mas:\n• state.user = profile.nomeCompleto (ex: "Vorlei Gomes")\n• card.resp = nome curto na preventiva (ex: "Vorlei")\n→ "Vorlei Gomes" !== "Vorlei" → filtro retornava false → todos os cards sumiam.\n\nFix: passa a usar `_resolveUserKey()` em ambos os lados pra resolver pra chave canônica ("vorlei") antes de comparar. Match correto independente de qual variação do nome esteja gravada. Mesma correção aplicada em moverCard().'}
    ]
  },
  {
    v:'3.51.0', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · 2 melhorias: mover card smart por role + 4 dados de contexto no detalhe da preventiva.',
        desc:'Mockups aprovados em mockup-mover-card-smart.html e mockup-card-detalhe-completo.html.\n\n═══ Melhoria 1 · Mover card smart por role ═══\n\nAntes: TODO clique em ▶ ou ✓ (exceto preventiva→done) abria modal "Registrar Movimentação" pedindo "Quem está executando" — redundante pra técnico (só pode ser ele mesmo).\n\nAgora:\n• Card é do próprio user (resp/respKey/autor/autorKey === você) → MOVE DIRETO sem modal\n• Card de outro (admin/gerente movendo no lugar) → abre modal pra escolher quem executou\n• Preventiva → done: continua abrindo modal de assinatura digital (regra antiga, prova de execução)\n\nResultado: técnico só vê modal quando há real ambiguidade. Admin/gerente decide quem registra.\n\n═══ Melhoria 2 · 4 dados de contexto no modal Editar (preventiva only) ═══\n\nAo clicar num card de preventiva, o modal Editar agora mostra 4 seções extras destacadas em verde, ANTES da descrição:\n\n• 🔧 Status da máquina — bolinha colorida (verde Ativa · amarelo Em manutenção · vermelho Parada). Lê de manutencao/maquinas/{key}/status.\n\n• 🔄 Próxima execução prevista — calcula hoje + freq da preventiva. Mostra "DD/MM/YYYY (em N dias)" + frequência.\n\n• ⚡ Tarefas absorvidas pela cascata — lista preventivas da MESMA máquina com freq menor que estão vencidas. Reflete a regra v3.50.0 (concluir essa também marca elas). Só aparece se há absorvidas.\n\n• 📅 Últimas execuções — top 3 do histórico filtrando por equip+tarefa similar. Mostra avatar (foto se cadastrada), nome de quem fez, observação e data. Se nada, mostra "Sem execuções anteriores registradas".\n\nTodos os dados vêm de paths que JÁ EXISTEM (manutencao/maquinas, manutencao/preventivas, manutencao/historico). Sem campo novo no schema.\n\nNovo card (sem prevId) e cards de demanda/instalação NÃO mostram essas seções.'}
    ]
  },
  {
    v:'3.50.4', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · 2 bugs do toggle de técnico (visual quebrado + Vorlei vendo a barra).',
        desc:'Bugs reportados pelo William na v3.50.2:\n\n1) AVATARES BUGADOS — barra renderizava como texto puro (sem círculos). Causa: usei <button> que tem default styles do user-agent (inline-block, padding/border bizarros) que sobrescreviam o flex/column do .kb-view-pick. Fix: trocado pra <div role="button" tabindex="0">. Layout volta ao normal.\n\n2) VORLEI (TÉCNICO) VENDO A BARRA — checagem usava `state.isAdmin` que pode estar desatualizado/incorreto. Fix: novo helper `_ehGerenteOuAdmin()` lê o role atual via `getCurrentUser()` do HUB (single source of truth com fallback pro state.userProfiles[key].roleOverride). Mais robusto, não depende de state legado.\n\nResultado: técnico nunca vê a barra. Admin/gerente vê com avatares redondos coloridos como esperado.'}
    ]
  },
  {
    v:'3.50.3', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Gerenciar Usuários · ordenação hierárquica (admin → gerente → usuário, alfabético).',
        desc:'Antes: lista vinha desordenada do Object.entries(getAllUsers()) — sem garantia de ordem.\n\nAgora: admin no topo, depois gerentes, depois usuários comuns. Dentro de cada grupo, ordenação alfabética por nome.\n\nUsa getEffectiveRole() pra pegar o role atual considerando overrides. Comparação caseinsensitive.'}
    ]
  },
  {
    v:'3.50.2', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · Kanban: toggle de avatar pra admin/gerente filtrar por técnico.',
        desc:'Mockup aprovado em mockup-toggle-por-tecnico.html (Opção 2 — Avatar row).\n\n• Barra de toggle aparece SÓ pra admin/gerente, acima das colunas do Kanban.\n• Botões: ★ Meus · <Avatar de cada técnico> · ⊕ Time inteiro\n• Default ao logar: "Meus" (foco nas próprias tarefas)\n• Click num técnico → filtra cards desse user\n• Click em "Time" → vê tudo (comportamento da v3.50.0 antiga)\n• Estado salvo em localStorage["fio_kb_view_<userKey>"] — Joacir abre sempre na visão que deixou\n• Lista de técnicos puxada DINAMICAMENTE do Firebase (users-config + users-profile)\n  - Filtro: active !== false E (role admin/gerente OU modulesAllowedOverride.includes("manutencao"))\n  - Mesmo helper já usado em _popUserSelect (form +Demanda) e abrirModalReatribuir\n  - Cadastrar técnico novo no HUB (com módulo Manutenção) → aparece no toggle SEM deploy\n• Badge vermelho com contagem de cards abertos por user\n• Foto se cadastrada (users-profile/foto), senão iniciais com cor por hash determinística\n• Técnico (producao) NÃO vê o toggle — segue regra v3.50.1 (sempre só os dele)'}
    ]
  },
  {
    v:'3.50.1', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · Kanban: filtro de visibilidade por user + campo "última execução" no modal.',
        desc:'2 ajustes solicitados pelo William:\n\n1) DESCRIÇÃO AUTOMÁTICA NO CARD DE PREVENTIVA REMOVIDA\n   • Antes: ao gerar card, desc ficava "Vencida em 23/04/2026. Responsável: Vorlei."\n   • Agora: desc vai vazia (técnico preenche com observações ao executar)\n   • Card grava `ultimaExec` separadamente (metadado readonly)\n   • Modal Editar Solicitação ganhou campo "Última execução desta preventiva" READONLY (só visível em cards de preventiva). Mostra "DD/MM/YYYY por <Tecnico>" ou "Nunca executada".\n\n2) FILTRO DE VISIBILIDADE POR USUÁRIO\n   • Antes: TODOS viam TODOS os cards do Kanban\n   • Agora: usuário comum (não admin/gerente) só vê cards onde:\n     - é responsável (resp/respKey) OU\n     - é autor (autor/autorKey)\n   • Admin/gerente continuam vendo tudo\n   • Comparação prefere chave canônica (sobrevive a rename), com fallback pro nome literal pra cards antigos sem *Key.'}
    ]
  },
  {
    v:'3.50.0', d:'23 abr 2026',
    items:[
      {type:'high', title:'Manutenção · 3 blocos: nova hierarquia de preventivas + timer no card + nuke geral nas notificações.',
        desc:'═══ BLOCO 1 · Hierarquia nova de preventivas (Opção B aprovada) ═══\n\n• gerarCardsPreventivas reescrita: agrupamento por MÁQUINA (sem janela semanal). Pra cada máquina, identifica a maior frequência VENCIDA — só ela vira card. Menores vencidas da mesma máquina ficam absorvidas (não viram cards separados).\n• Antes: agrupava por SEMANA × máquina. Bug: anual e semanal pendentes em semanas diferentes viravam 2 cards.\n• NOVO: preventivas SEM `ultima` viram card também (vencidas desde sempre, antes ficavam órfãs).\n• Cards gerados pelo Sistema agora gravam `respKey` direto + `maqKey` (sem esperar backfill).\n\nCascata refinada na CONCLUSÃO:\n• Antes: cascateava ultima=hoje em TODAS as menores da máquina (queimava preventivas com folga).\n• AGORA: cascateia só nas VENCIDAS (proxima <= hoje OU sem ultima).\n• Bonus: ao concluir card maior, fecha automaticamente os cards das preventivas absorvidas (col=done).\n\n═══ BLOCO 2 · Timer no card (mockup aprovado) ═══\n\n• A FAZER agora mostra timer com h/min (antes só "ONTEM/HOJE/3d atrás")\n• Cor escala por idade:\n  - A FAZER: 🟢 <24h "esperando" · 🟡 24-72h · 🔴 >72h "⚠ urgente"\n  - EM ANDAMENTO: 🟢 <4h "Em execução" · 🟡 4-8h · 🔴 >8h\n• Pulse dot pulsando ao lado do tempo (animação 2s)\n• Atualização automática a cada 60s via _tickTimers (sem re-render)\n\n═══ BLOCO 3 · NUKE geral nas notificações ═══\n\nTudo de notificação foi removido (será reconstruído depois com regras claras):\n• Push native via FCM\n• In-app notif (banner top)\n• Banner kanban "preventivas vencidas"\n• Modal "Enviar notificação" (admin)\n• Modal histórico de notificações\n• Switch 🔔 no header\n• Re-notificação automática (24h)\n• Re-notif diária no boot\n• Resumo "enquanto você estava fora"\n• Digest diário (Cloudflare worker desativado: cron=[])\n• FCM token init\n\nFunções viraram no-ops pra não quebrar callers existentes. CSS esconde a UI dos botões/banners/modais. Worker re-deployado sem cron — backend pronto pra rebuild quando necessário.\n\nDoc: AUDIT-PREVENTIVAS-NOTIF.md tem o levantamento completo.'}
    ]
  },
  {
    v:'3.49.1', d:'23 abr 2026',
    items:[
      {type:'fix', title:'Auto-login não funcionava (race condition Firebase × checkAuth).',
        desc:'BUG: William reportou que mesmo com sessão válida em localStorage, a tela de login aparecia ao reabrir.\n\nCausa: checkAuth() no boot exigia `getUser(s.user)` retornar dados, mas getUser depende de `window._usersConfig` e `window._usersProfile` que carregam ASYNC do Firebase. No boot, esses objetos estão vazios → getUser retorna null → fallback mostrava login screen mesmo com cache válido.\n\nFix: checkAuth agora confia no cache do localStorage (que já tem nome+role+expires). Mostra splash "Bem-vindo de volta" IMEDIATAMENTE sem esperar Firebase. Validação de "user ativo" + renovação de TTL acontecem em background quando Firebase chegar (1s/3s/6s).\n\nResultado: ao reabrir o app com sessão válida, splash welcome aparece em <100ms sem flash de login.'}
    ]
  },
  {
    v:'3.49.0', d:'23 abr 2026',
    items:[
      {type:'feat', title:'Auto-login perfeito · cache local + splash personalizado + trocar conta.',
        desc:'Mockup aprovado em mockup-autologin.html.\n\nMUDANÇAS:\n\n1) SEM FLASH DE LOGIN\n   • #loginScreen agora vem com class="hide" no HTML por default\n   • checkAuth() roda no boot e remove .hide SÓ se cache ausente/expirado\n   • Antes: tela de login aparecia brevemente antes do checkAuth esconder. Agora: nunca aparece se há sessão válida.\n\n2) SPLASH PERSONALIZADO "Bem-vindo de volta, <Nome>"\n   • Avatar grande (foto ou iniciais) + greeting + nome em destaque + spinner\n   • Duração 800ms (vs 2400ms do login normal) — rápido o suficiente pra não atrasar, lento o suficiente pra registrar visualmente\n   • Modo ativado via showSplash(nome, role, {welcomeBack:true})\n   • CSS .splash.welcome-mode esconde a barra de loading e o splash-user genérico\n\n3) BOTÃO "Não é você? Trocar conta"\n   • Discreto no rodapé do splash welcome (só visível no modo welcome back)\n   • Click chama trocarConta() → clearSession + remove fiobras-remember + reload\n   • Crucial pra device compartilhado (PC do laboratório, tablet do chão)\n\n4) RENOVAÇÃO AUTOMÁTICA DO TTL NO BOOT\n   • Cada checkAuth() bem-sucedido chama setSession(s.user) → renova TTL pra +30d\n   • User ativo nunca expira; user inativo por 30d cai no login\n\n5) DETECÇÃO DE USER INATIVO NO BOOT\n   • Se profile.active === false ao carregar com sessão válida → limpa cache + mostra login + alert "Usuário inativo. Contate o admin."\n   • Antes: user inativo entrava direto e travava em telas vazias.\n\nSchema do cache (localStorage["fiobras-dash-auth"]) inalterado: {user, role, nome, ts, expires, remember}. Zero migração.\n\nFluxo: App abre → lê cache (5ms) → splash "Bem-vindo, William" (800ms) → dashboard.'}
    ]
  },
  {
    v:'3.48.9', d:'22 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · Preventivas agrupadas POR MÁQUINA (mockup aprovado).',
        desc:'Antes: 1 linha por tarefa. Máquina com 12 preventivas = 12 linhas repetindo equipamento, setor, responsável.\n\nAgora (redesign aprovado pelo William em _mockup-v3.48.9-preventivas.html):\n\n• 1 CARD por máquina mostrando:\n  - Tag verde do código (RET-01) + nome da máquina\n  - 3 contadores coloridos: ATRASADAS (vermelho) · PRÓXIMAS (amarelo) · OK (verde)\n  - Sub-line com setor + alerta de atraso ou próxima vencer\n  - Stack de avatares dos responsáveis (até 3 + "+N" se mais)\n  - Chevron pra expandir\n\n• CLICK expande mostrando tarefas agrupadas por FREQUÊNCIA com bullet colorido:\n  🟣 Diária (1d)\n  🔵 Semanal (2-7d)\n  🟦 Quinzenal (8-15d)\n  🟢 Mensal (16-35d)\n  🟡 Trimestral (36-100d)\n  🩷 Semestral (101-200d)\n  🔴 Anual (201d+)\n\n• Cada tarefa expandida: nome · responsável · "última → próxima" · chip de status · editar/excluir.\n\n• Ordenação dos cards: mais atrasadas primeiro → próxima vencer mais cedo → tag alfabética.\n\n• Mobile: contadores escondidos no card colapsado, layout simplifica nas tarefas (toca pra editar).\n\n• Estado de expansão preservado em memória (Set _pvExpanded) — NÃO persiste entre reloads (intencional).\n\n• Busca filtra preventivas por tarefa, máquina, código, responsável, setor, obs — máquinas com 0 matches somem.\n\n• Paginação removida (não faz mais sentido com agrupamento por máquina). Hosts legados (prev-tbody, prev-cards-mobile, prev-pagination) mantidos hidden pra evitar quebrar refs.'}
    ]
  },
  {
    v:'3.48.8', d:'22 abr 2026',
    items:[
      {type:'fix', title:'Login · checkbox "Manter conectado" invisível (CSS legado branco sobrescrevia o dark glass).',
        desc:'BUG: William reportou que o login "tem o botão mas não salva". Print mostrou o card de login BRANCO (deveria ser dark glass desde v3.25.0) com o checkbox visível mas SEM o texto da label "Manter conectado neste dispositivo".\n\nCausa: dois blocos `.login-card` no hub.css:\n  - Linha 41 (moderno v3.25.0): dark glass com backdrop-filter, fundo rgba(12,18,14,0.55), texto branco\n  - Linha 1760 (legado): `background:#fff` com texto verde\n\nCSS source order: o LEGADO ganhava (definido depois). Resultado:\n  - Card branco em vez de dark glass\n  - Label "Manter conectado" tem `color:rgba(255,255,255,.72)` → texto BRANCO no fundo BRANCO → invisível\n  - Campo de senha tinha `height:0` (transição com classe .show) também legado\n\nFix: deletado todo o bloco legado (linhas 1755-1781). Mantida só uma regra essencial pra visibilidade do password field via classe `.show`:\n  .login-pass-wrap:not(.show){display:none;}\n\nResultado:\n  - Card volta pro dark glass moderno\n  - "Manter conectado neste dispositivo" agora visível ao lado do checkbox\n  - Senha aparece quando user selecionado tem senha cadastrada\n  - O save em si JÁ FUNCIONAVA (setSession grava em localStorage com TTL 30d) — a percepção de "não salva" vinha da UI quebrada que escondia o feedback do checkbox.'}
    ]
  },
  {
    v:'3.48.7', d:'22 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · Kanban: 1 lugar pra mudar responsável + sync resp/respKey.',
        desc:'2 problemas reportados pelo William após v3.48.6:\n\n1) DOIS LUGARES pra mudar responsável: o card tinha avatar clicável → modal Reatribuir, MAS o form Editar Solicitação também tinha dropdown Responsável. Confuso.\n   FIX: removido o dropdown do Editar (display:none na edição). Reatribuir vira a única forma de trocar responsável de um card existente. O form de "+ Demanda" mantém o dropdown (admin atribui na criação).\n\n2) Mudar responsável de UM card supostamente "mudava de todos pro mesmo". Provável causa: respKey ficava STALE — Reatribuir só atualizava `resp` (nome), mas NÃO atualizava `respKey` (chave canônica). Em buildCard a prioridade é `c.respKey || c.resp`, então o avatar continuava puxando o respKey antigo (gravado pelo backfill). Edit form tinha o mesmo problema.\n   FIX: confirmarReatribuicao + salvarCardAdmin (edit) agora atualizam `resp` E `respKey` JUNTOS. Cada card mantém seu próprio par sincronizado.\n\nResultado esperado: trocar responsável afeta SÓ aquele card, e o avatar reflete a mudança imediatamente.'}
    ]
  },
  {
    v:'3.48.6', d:'22 abr 2026',
    items:[
      {type:'high', title:'Auditoria de identidade · Fases A+B+C+D + worker push 07:30 + limpeza fantasma.',
        desc:'Pacotão fechando todas as pendências da auditoria registrada em AUDIT-USER-IDENTITY.md + 2 itens extras.\n\n━━━ FASE A · Bloqueio preventivo ━━━\n• Campo "Nome completo" em Minha Conta agora é READ-ONLY pra todos exceto admin master (William)\n• Mensagem de aviso: "Pra alterar seu nome, fale com o administrador"\n• Painel "Editar Usuário" (admin only) ganhou campo Nome completo editável — admin master pode trocar nome de qualquer user\n• Trocar nome dispara audit-log (action: user.renameNome, details: {de, para})\n\n━━━ FASE B · Schema migrate (gravar autorKey junto do nome) ━━━\nCRM: 7 gravações de `autor` agora também gravam `autorKey`\n  - Trocar responsável (modal Reatribuir + form Editar lead)\n  - Cadastrar lead novo\n  - Mover etapa (drag, popover, modal)\n  - Marcar perdido\n  - Adicionar interação no histórico do cliente\n  - Migrar lead → cliente\n  - Helper canônico _crmAutor() centraliza a captura\n\nCRM lead: ganha `responsavelKey` quando admin atribui\nManutenção: cards novos gravam `autorKey` + `respKey`. Comments gravam `autorKey`.\n\n━━━ FASE C · Render preferir chave ━━━\nCRM:\n  - leadColaboradores() → prefere h.autorKey > h.autor\n  - renderHist() → prefere h.autorKey > _crmResolveUserKey(h.autor)\n  - leadResponsavel() → prefere l.responsavelKey + resolve nome via users-profile\nManutenção:\n  - avatar() puxa nome friendly de state.userProfiles[key].nomeCompleto SEMPRE\n  - buildCard() do Kanban → respKey > autorKey > resp > autor\n\nResultado: trocar nome de qualquer user em Gerenciar Usuários propaga em TODOS os históricos antigos automaticamente. Avatares dedupam por chave (não por string).\n\n━━━ FASE D · Backfill one-shot ━━━\nNova função window._backfillUserKeys() — roda 1x quando admin abre Gerenciar Usuários (flag fiobras-backfill-userkey-v1).\nPercorre:\n  - crm/leads/{id}/historico/{j}/autor (sem autorKey)\n  - crm/leads/{id}/responsavel (sem responsavelKey)\n  - crm/clientes/{id}/timeline/{j}/autor\n  - manutencao/kanban/{id}/{autor,resp,comments[].autor}\nResolve nome → chave via _resolveUserKey() e adiciona campo *Key sem alterar o nome original (preserva snapshot histórico).\nUsa multipath update do Firebase pra eficiência. Toast mostra quantos campos foram atualizados.\n\n━━━ EXTRAS ━━━\n• Worker Cloudflare "fiobras-digest-diario" deployado: cron passou de 08:30 → 07:30 BRT (10:30 UTC). URL: https://fiobras-digest-diario.williamscchulz.workers.dev — Push diário das preventivas chega às 07:30 a partir de hoje.\n• Limpeza one-shot (limparCardsFantasma) remove cards de preventiva em "A Fazer" cuja data próxima é > hoje (gerados antes do fix do today() midnight em v3.48.3). Roda 1x via flag fiobras-cleanup-cards-fantasma-v1, só admin. Toast mostra quantos foram removidos.\n\nDoc: AUDIT-USER-IDENTITY.md atualizado a cada fase concluída.'}
    ]
  },
  {
    v:'3.48.5', d:'22 abr 2026',
    items:[
      {type:'feat', title:'Login · checkbox "Manter conectado" (auto-login por 30 dias).',
        desc:'Antes a sessão durava 24h fixos — todo dia precisava re-logar. Agora:\n\n• Checkbox "Manter conectado neste dispositivo" no card de login (entre senha e botão Entrar)\n• Marcado por padrão (default true) — quem não quiser desmarca\n• Marcado: TTL = 30 dias (login automático ao reabrir o app/aba)\n• Desmarcado: TTL = 24h (comportamento antigo)\n• Preferência salva em localStorage (fiobras-remember) — próxima visita o checkbox volta no estado escolhido\n• Renovação automática (toast "Sessão expira em X min") herda o TTL escolhido — se você marcou Manter, renova +30d; se não, renova +24h\n\nSegurança: como o token tá em localStorage, qualquer pessoa com acesso físico ao device entra. Pra equipamento compartilhado (PC do laboratório, tablet do chão de fábrica) basta desmarcar.'}
    ]
  },
  {
    v:'3.48.4', d:'22 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · Kanban: card minimalista (avatar grande à esquerda, click abre detalhes).',
        desc:'Redesign aprovado pelo William após mockup (_mockup-v3.48.3.html).\n\nMudanças visuais:\n• Avatar 22px → 44px (foto/iniciais bem visíveis, do responsável)\n• Altura do card 150px → ~70px (cabe 2× mais cards na tela)\n• Tags 3 chips no topo → 1 linha de meta única (RET-01 · Tipo · Data relativa)\n• Borda esquerda colorida indica urgência (vermelho/laranja/verde)\n• Botões de ação direita: ▶ Iniciar / ◀ Voltar / ✓ Concluir / ✎ Editar\n• Excluir saiu do card → vai pro modal de detalhe (evita acidente)\n• Comments badge mostra contador só quando >0\n• Mobile: avatar 38px, esconde chip de urgência (fica só borda)\n\nInteração:\n• Click no card chama abrirDetalheCard() — quem pode editar (admin/autor/resp) abre modal de edição (mostra desc, peças, equipamento, todos os campos). Quem só pode ler expande comentários inline.\n• Click no avatar (admin) → modal Reatribuir Responsável (mantido)\n• Click nos botões de ação → stopPropagation (não abre modal sem querer)\n• Drag-and-drop preservado (HTML5 nativo)\n\nClasse nova: .kc3 (substitui .kc2 nos cards do Kanban). Estilos antigos .kc2-* mantidos no CSS pra outros usos (thumb da máquina, etc).'}
    ]
  },
  {
    v:'3.48.3', d:'22 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · Kanban: 5 ajustes (banner timing/filter · tooltip avatar · peças · vencida bug · push 07:30).',
        desc:'Pacote de ajustes na tela do Kanban (mockup do redesign do card em _mockup-v3.48.3.html aguardando aprovação):\n\n• BANNER vermelho "preventivas vencidas pendentes" agora só aparece (a) entre 07:30-08:00 BRT (b) pro user RESPONSÁVEL daquela preventiva. Fora dessa janela ou pra outros users, fica só o card no Kanban — não polui mais a tela. Banner reavalia a cada minuto pra esconder/aparecer sozinho.\n\n• TOOLTIP do avatar (.av-tip em tokens.css) ancorado à esquerda em vez de centralizado. Antes vazava do card quando avatar tava no canto esquerdo do footer. Agora estica só pra direita, dentro do card.\n\n• BOTÃO peças removido do card Kanban. Estava poluindo. Peças continuam acessíveis via modal de detalhe.\n\n• BUG "Vencida 23/04 quando hoje é 22/04": função today() retornava `new Date()` com hora atual, enquanto parseDt(p.ultima) zerava pra 00:00. Resultado: diffDays(today=15:00, prox=23/04 00:00) = 0.4 → round(0) → triggava como "vencida hoje". Fix: today() agora seta hours 0,0,0,0 — diff vira 1 dia inteiro (não dispara).\n\n• PUSH digest diário do worker Cloudflare movido de 08:30 BRT → 07:30 BRT (cron "30 10 * * 1-5"). Precisa wrangler deploy pra aplicar.'}
    ]
  },
  {
    v:'3.48.2', d:'22 abr 2026',
    items:[
      {type:'fix', title:'Pós-ZERO HARDCODE · 3 fixes (senha "FIXA" · modal Reatribuir · William sumido).',
        desc:'Bugs reportados após v3.48.0 (eliminação de USERS hardcoded):\n\n1) HUB · Painel "Gerenciar usuários" mostrava tag "FIXA" e desabilitava botão Resetar pra users que vieram do seed antigo (admin/joacir). Causa: `getAllUsers()` agora retorna `senha: p.senhaPlain` pra TODOS os users (não tem mais conceito de hardcoded), mas a lógica de tag ainda checava `u.senha !== null` como sinal de "fixa". Fix: tag virou só "definida" / "sem senha", e admin pode resetar QUALQUER senha. resetarSenhaUser passa `{senhaHash:null, senhaPlain:null}` (Firebase update merge precisa de null explícito pra remover campo).\n\n2) Manutenção · Modal "Reatribuir Responsável" mostrava TODOS os users do HUB (incluindo CRM, Produção, etc). Devia mostrar só users com acesso ao módulo Manutenção. Fix: `abrirModalReatribuir()` filtra por `role === admin || gerente || modulesAllowedOverride.includes(manutencao)`. Mesmo filtro aplicado em `_popUserSelect()` (selects de demanda/preventiva/máquina). Modal agora também mostra foto, label do role (Admin/Gerente/Técnico) e estado vazio.\n\n3) Manutenção · William Schulz (admin) não aparecia em listas. Causa: filtros excluíam role admin/gerente. Fix: incluídos explicitamente.'}
    ]
  },
  {
    v:'3.48.1', d:'22 abr 2026', items:[
      {type:'fix', title:'Manutenção · avatar com foto cinza (background-size: auto vs cover).',
        desc:'BUG: William reportou avatar do Vorlei cinza no card de máquina mesmo com foto cadastrada. Não era hardcode (suspeita inicial), era um BUG SUTIL DE CSS.\n\nDiagnóstico via preview/eval:\n  cs.backgroundImage = url(data:image/jpeg;...) ✓ foto carregada\n  cs.backgroundSize = "auto" ❌ deveria ser "cover"\n\nCausa: a regra `.av.u-vorlei { background: linear-gradient(...) }` usa SHORTHAND `background:`. Shorthand RESETA todas as sub-propriedades, incluindo `background-size: auto` (default). Quando o JS adiciona `style="background-image:url(...)"` inline, o background-size do CSS da regra .u-vorlei (auto) ganha por especificidade — daí a foto carrega mas é renderizada no tamanho original (centenas de pixels) e só uma esquina aparece nos 32x32 do avatar.\n\nFix: função avatar() do Manutenção adiciona inline `background-size:cover; background-position:center` junto com `background-image`. Especificidade inline ganha do shorthand da classe.\n\nHUB e CRM não tinham o bug porque usam `<img>` element em vez de background-image.\n\nValidado: backgroundSize agora "cover", foto preenche o avatar.'}
    ]
  },
  {
    v:'3.48.0', d:'22 abr 2026',
    items:[
      {type:'high', title:'ZERO HARDCODE de usuários · USERS lê 100% do Firebase.',
        desc:'Conclusão da auditoria arquitetural. Todos os usuários hardcoded foram removidos:\n\n• HUB index.html: const USERS = {} (era 17 entries)\n• Manutenção: const USERS = {} (era admin/joacir)\n• Manutenção: 4 selects com 23 <option> hardcoded → populate dinâmico via _popUserSelect()\n• CRM: AVATAR_GRADIENTS hardcoded de 7 cores → função hash determinística (mesmo user sempre mesma cor, funciona pra QUALQUER user)\n\nFonte única de verdade: Firebase\n  - users-config/{key} = lista canônica + nome\n  - users-profile/{key} = foto, role, senha plain\n\ngetUser(key) e getAllUsers() agora derivam 100% do Firebase. Validado via preview/eval:\n  USERS = []  (vazio)\n  getUser("admin") → "William Schulz" (do Firebase)\n  getUser("vorlei") → "Vorlei" (do Firebase)\n  18 users em users-config + 18 em users-profile\n\nFallback de offline:\n• Cache localStorage (v3.43.0) cobre uso normal — usuários aparecem instantâneos no boot\n• Se Firebase off + cache vazio (1ª visita máquina nova sem net): splash "Conectando ao servidor..." com spinner + botão Tentar novamente\n• ZERO senha hardcoded — admin/joacir lêem senhaPlain de users-profile (gravado via seed v2 v3.45.0)\n\nResultado: criar/editar/excluir user no painel admin propaga em TODOS os apps imediatamente. Adicionar user novo apareceu nos selects do Manutenção sem deploy. Trocar foto no HUB → atualiza avatar do CRM em segundos.'}
    ]
  },
  {
    v:'3.47.8', d:'22 abr 2026',
    items:[
      {type:'feat', title:'CRM · admin pode deletar entries do histórico do lead.',
        desc:'Cada entry do histórico ganhou botão lixeira (visível só pra admin). Click pede confirmação com preview do conteúdo a deletar — se confirmar, remove a entry do array `historico` no Firebase.\n\nUtilidade:\n• Limpar testes acidentais (movimentações errôneas)\n• Remover entries de auditoria que poluem timeline\n• Corrigir interações registradas equivocadamente\n\nLog em crm/log: cada deleção registra "Histórico deletado · <descrição> · por <admin>" pra rastreio.\n\nNão deleta o lead em si — só a entry específica. Outras entries permanecem.'}
    ]
  },
  {
    v:'3.47.7', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM · histórico do lead mostra QUEM fez cada ação (avatar + nome).',
        desc:'BUG: aba HISTÓRICO mostrava "Movido de X para Y" / "Retornamos por WhatsApp" mas SEM o autor. Embora o `autor` fosse gravado no Firebase, renderHist() nunca renderizava esse campo.\n\nFix: renderHist() agora mostra chip ao lado do badge de tipo:\n  [📷 William]    ← avatar pequeno + nome do user\n\n• Avatar 18px com foto se cadastrada, senão inicial em gradient cinza\n• Nome vem do users-profile/users-config ATUAL (não do nome literal gravado no histórico) — se trocar nome do user no HUB, propaga em todas as entries\n• Resolve via _crmResolveUserKey (igual leadColaboradores) — mesmo padrão de dedup\n• Compat: usa h.texto OU h.acao como conteúdo (entries antigas e novas)\n• Compat: usa h.ts OU h.data pra timestamp\n\nResultado: agora dá pra rastrear quem fez cada movimentação.'}
    ]
  },
  {
    v:'3.47.6', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM · 2 fixes: admin aparece como responsável + dedup do stack por chave (não nome).',
        desc:'BUG 1: Admin (William) não aparecia na lista de "Trocar responsável".\nCausa: filtro `if (k === "admin") return false` excluía a chave técnica, mas William é uma pessoa real (admin com nomeCompleto preenchido).\nFix: filtro só exclui se nomeCompleto for literalmente "admin" (genérico). Se tem nome real (ex: "William Alexander Schulz"), aparece na lista.\n\nBUG 2: Trocar nome do admin (de "William Alexander Schulz" para "William Schulz") criava DOIS avatares no stack do card — um pro nome antigo (gravado em entries antigas do histórico) e outro pro nome novo.\nCausa: leadColaboradores() deduplicava pelo NOME LITERAL. Quando o nome muda, entries antigas no Firebase ficam com nome velho e novas com nome novo → 2 keys diferentes → 2 avatares.\nFix: dedup agora usa USER KEY (resolvendo nome → chave via _crmResolveUserKey). "William Alexander Schulz" e "William Schulz" ambos resolvem pra chave `admin` → contam como 1 user só. Nome exibido no tooltip vem SEMPRE do users-profile/users-config (nome atual), não do nome gravado no histórico.\n\nResultado: trocar nome no HUB propaga em tempo real pros tooltips. Stack não duplica mais.'}
    ]
  },
  {
    v:'3.47.5', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM · KPI bar do Pipeline removida (William: "inútil").',
        desc:'Barra com 4 cards (Em pipeline / Em proposta / Fechados no mês / Tempo médio) escondida no topo do Pipeline. Pipeline já mostra count em cada coluna, então a barra era redundante. Lógica de cálculo mantida no código (caso queira reativar).'}
    ]
  },
  {
    v:'3.47.4', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM · novo lead registra criador no histórico + mover etapa pega user real.',
        desc:'BUG 1: "Novo Lead" não mostrava avatar do criador no card.\nCausa: salvarLead() criava com historico=[]. leadColaboradores() não tinha entry de "Cadastrou lead" pra extrair criador.\nFix: ao criar (salvarLead com _id null), adiciona automaticamente:\n  historico = [{ acao: "Cadastrou lead", autor: <user atual>, data: ISO }]\n\nBUG 2: Mover lead pra outra etapa registrava "Usuário" genérico.\nCausa: usuario = window._user?.nome — null quando vem do HUB iframe (sessão fica em __hubSession).\nFix: usa getCurrentUser() (Fase 1 da auditoria) com fallback chain pra todas as fontes (_user → __hubSession → localStorage).\n\nResultado:\n• Novo lead criado AGORA mostra avatar do criador no stack do card\n• Mover etapa registra o user que moveu (avatar aparece no stack)\n• Aplicado em moverDireto + 4 outras funções que registravam histórico\n\nLeads ANTIGOS sem histórico continuam sem avatar (sem como recuperar autor passado). Daqui pra frente todos terão.'}
    ]
  },
  {
    v:'3.47.3', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM · tooltip ainda vazava em avatares do meio do stack.',
        desc:'BUG persistente: v3.47.1 só corrigiu o first-child do stack. Avatares do meio (ex: 2º "admin" no card do Celso) continuavam centralizados → tooltip vazava pra esquerda do card.\n\nFix mais agressivo: TODOS os tooltips do stack alinhados pela ESQUERDA do avatar (left:0 + transform:none). Setinha aponta pra posição correta (left:13px). max-width:220px + white-space:normal evitam overflow horizontal mesmo com nome longo (quebra linha em vez de estender).\n\nCSS com !important pra sobrescrever a regra base do .cs-tip.'}
    ]
  },
  {
    v:'3.47.2', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM · "Nenhum usuário disponível pra atribuir" — modal trocar resp ficava vazio.',
        desc:'BUG: clicar em trocar responsável mostrava erro "Nenhum usuário disponível pra atribuir" mesmo com 17 users cadastrados no HUB.\n\nCausa: o filtro do modal exigia `nomeCompleto` ou `nome` em users-profile, mas pra users criados via painel admin do HUB, o nome vive em users-config (não em users-profile). CRM nunca lia users-config.\n\nFix:\n• onValue de users-config adicionado (mesma lógica de users-profile)\n• Cache localStorage também\n• crmTrocarResp e _crmPopularRespSelect agora montam a lista a partir da UNIÃO de users-config + users-profile\n• Nome friendly tem prioridade: profile.nomeCompleto > config.nome > profile.nome > key\n• _crmResolveUserKey também busca em users-config (corrige avatar de users que só existem lá)\n\nResultado: lista de "trocar responsável" mostra todos os users do sistema. Avatar dos cards puxa nome/foto mesmo se profile estiver incompleto.'}
    ]
  },
  {
    v:'3.47.1', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM · tooltip do stack de avatares vazava pra fora do card.',
        desc:'BUG: hover no avatar admin (esquerda do stack) abria tooltip centralizado que ultrapassava a borda esquerda do card e ficava cortado.\n\nFix:\n• Removido min-width:160px (tooltip agora se adapta ao conteúdo)\n• Quando avatar é o PRIMEIRO do stack, tooltip alinha à esquerda (left:0) com a setinha apontando pro avatar\n• overflow:visible forçado em .crm-card, .card-foot, .av-stack pra garantir que tooltip não seja cortado pelos pais\n• Tooltip continua centralizado pros avatares do meio do stack'}
    ]
  },
  {
    v:'3.47.0', d:'22 abr 2026',
    items:[
      {type:'feat', title:'CRM · modal visual pra trocar responsável + filtro de "U"/inativos.',
        desc:'William reportou: "ta ruim de mexer" (prompt nativo do JS), "tirar esse user padrão da lista" (avatar "U" cinza aparecia nos cards).\n\nDuas mudanças:\n\n1. MODAL VISUAL próprio substitui o prompt nativo:\n   - Cabeçalho com título do lead\n   - Mostra responsável atual destacado em âmbar\n   - Lista scrollable com avatar (foto se houver) + nome de cada user\n   - Click seleciona (border verde + checkmark)\n   - Botões Cancelar/Salvar fixos no rodapé\n   - Animação fade-in + backdrop-filter blur\n\n2. FILTRO de users genéricos no leadColaboradores() e na lista do modal:\n   - "Sistema", "Usuário", "Usuario", "U", "admin", "Fiobras" não aparecem mais\n   - Users marcados como `active: false` (v3.46.0) também filtrados\n   - Nome friendly "atual" no badge âmbar quando o user já é o responsável\n\nResultado: o "U" cinza some dos cards. Trocar responsável vira fluxo visual e claro.'}
    ]
  },
  {
    v:'3.46.0', d:'22 abr 2026',
    items:[
      {type:'high', title:'Fases 4+5+6 da auditoria · auto-login + aviso sessão + status ativo/inativo.',
        desc:'FASE 4 — Auto-login no Manutenção via sessão do HUB:\n• _autoLoginViaHub() roda no boot do sub-app\n• Lê getCurrentUser() (sessão do HUB) e popula state.user/userKey/isAdmin diretamente\n• User não vê tela de login do Manutenção quando vem do HUB\n• Login local fica como fallback (acesso direto /manutencao/)\n\nFASE 5 — Aviso visual de sessão expirando:\n• Helper _checkSessionExpiring() roda a cada 60s no HUB\n• 1h antes da expiração: toast âmbar "Sua sessão expira em X min" + botão "Renovar"\n• Click em "Renovar" estende +24h\n• Sessão expirada: alerta + reload pra tela de login\n\nFASE 6 — Campo `active` em users-profile:\n• Toggle "Ativo/Inativo" no modal Editar Usuário (default: ativo)\n• Login bloqueado pra inativos com mensagem "Usuário inativo. Contate um administrador"\n• Painel admin mostra users inativos com opacity reduzida + badge "INATIVO" cinza\n• Histórico do user é preservado (não deleta nada)\n• Útil pra desligar funcionário sem perder dados ou rastros'}
    ]
  },
  {
    v:'3.45.0', d:'22 abr 2026',
    items:[
      {type:'feat', title:'Fase 3 da auditoria · admin/joacir migrados pra users-config com flag protected.',
        desc:'Antes: admin e joacir eram hardcoded em const USERS no HUB e Manutenção. Painel admin não conseguia editar/excluir esses 2 (eram "intocáveis" via UI).\n\nAgora: aplicarUsuariosSeedV2() roda 1x quando admin abre Gerenciar Usuários (flag fiobras-users-seed-v2). Garante:\n• users-config/admin = { nome:"Admin", role:"admin", protected:true }\n• users-config/joacir = { nome:"Joacir", role:"gerente", protected:true }\n• users-profile/{key}/senhaPlain = senha hardcoded (caso ainda não tenha)\n\nFlag `protected: true` substitui o hardcode. isUserDinamico() retorna false pra users com protected, escondendo botões de excluir no painel — mas admin continua podendo editar role, foto, módulos liberados etc.\n\nResultado: admin/joacir são gerenciados via Firebase como qualquer outro user, mas o sistema impede exclusão acidental.\n\nFallback de segurança: USERS hardcoded continua existindo no código pra casos extremos (Firebase fora do ar). Em runtime, getUser() prioriza users-config + users-profile.'}
    ]
  },
  {
    v:'3.44.0', d:'22 abr 2026',
    items:[
      {type:'high', title:'AUTH UNIFICADO · helper getCurrentUser() em todos os apps + sessão expira em 24h (Fases 1+2 da auditoria).',
        desc:'Início da unificação completa do sistema de autenticação. Antes existiam 3 sistemas paralelos de login (HUB, Manutenção, CRM) com checagens de admin diferentes em cada lugar.\n\nFASE 1 — Helper window.getCurrentUser() em TODOS os apps:\n• Mesma assinatura nos 4 apps: { key, nome, role, isAdmin, isGerente, foto, powers, expiresAt }\n• Lê localStorage.fiobras-dash-auth (gravado pelo HUB) e enriquece com users-profile do Firebase\n• Substitui 12+ checagens diferentes de admin que existiam (state.isAdmin, _user.papel, state.user.role, etc)\n• _crmIsAdmin() agora delega ao helper unificado\n\nFASE 2 — Sessão única expira em 24h:\n• HUB grava campo `expires` na sessão (Date.now() + 24h)\n• getCurrentUser() retorna null se sessão expirou (e remove do localStorage)\n• Sub-apps (Manutenção, CRM, Preço) gates de boot agora verificam expiração: sessão velha = "Acesse pelo HUB"\n• Compat: sessões antigas sem campo `expires` ganham 24h a partir do `ts` original\n\nResultado: admin no HUB = admin em todos os sub-apps. Trocou senha → invalidou. Não tem como ficar com sessão antiga rodando indefinidamente.\n\nPróximo: Fase 3 — migrar admin/joacir hardcoded pra users-config (eliminar últimos hardcodes).'}
    ]
  },
  {
    v:'3.43.2', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM · admin via HUB iframe agora reconhecido (campo Resp ficava bloqueado).',
        desc:'BUG: William reportou "sou admin mas aparece a mensagem apenas administrador pode editar". Confirmado via preview/eval: window._user = null quando CRM roda via iframe do HUB (sessão fica em window.__hubSession e localStorage["fiobras-dash-auth"]).\n\nMinha checagem (window._user.papel === "admin") só detectava login DIRETO no CRM, ignorando admin vindo do HUB.\n\nFix: novo helper _crmIsAdmin() verifica TODAS as fontes:\n  1. window._user.papel (login direto CRM)\n  2. window.__hubSession.role/papel (iframe do HUB)\n  3. localStorage fiobras-dash-auth (fallback)\n\nAplicado em:\n  - _crmPopularRespSelect (campo Responsável do modal)\n  - avatarChip (avatar clicável no card)\n  - avatarStack (ícone de edit verde)\n  - crmTrocarResp (prompt direto)\n  - salvarLead (registra no histórico)\n\nNome do admin no histórico também passa a usar __hubSession.user como fallback.'}
    ]
  },
  {
    v:'3.43.1', d:'22 abr 2026',
    items:[
      {type:'feat', title:'CRM · campo "Responsável" no modal de edição (admin altera direto).',
        desc:'William reportou que não conseguia trocar o responsável — o ícone de edit ao lado do stack de avatares (v3.42.0) era discreto demais e ele não viu.\n\nMudança: campo "Responsável" agora aparece dentro do modal de edição do lead (aba DADOS, abaixo do "Próximo follow-up"). Select com todos os users do users-profile.\n\n• Pra ADMIN: select editável; ao salvar, se mudou, registra no histórico ("Responsável trocado de X para Y" com autor)\n• Pra usuário comum: select disabled (visualização apenas) com title "Apenas administradores podem alterar"\n• Valor inicial = l.responsavel atual OU último autor do histórico (legacy)\n• Se o resp atual está fora da lista (legacy), entra como primeira opção pra preservar\n\nO ícone discreto do card continua funcionando (v3.42.0), mas agora a UX principal é via modal.'}
    ]
  },
  {
    v:'3.43.0', d:'22 abr 2026',
    items:[
      {type:'high', title:'CRÍTICO · cache de users-profile em localStorage (resolve avatares cinza definitivamente).',
        desc:'Diagnóstico estrutural: o problema de avatares cinza (Vorlei, Joacir, etc) NÃO era cache do SW como eu vinha apostando. Era RACE CONDITION:\n\n1. Sub-app boot → cards renderizam IMEDIATAMENTE com state.userProfiles vazio\n2. Avatar() retorna iniciais cinza (sem foto)\n3. Firebase users-profile chega ~500ms-3s depois\n4. Re-render acontece, mas se houver qualquer hiccup (rede lenta, painel não-ativo, click em outro lugar), o card já visualizado pelo user fica com foto ANTIGA cacheada visualmente\n\nFIX ESTRUTURAL — cache cross-app via localStorage:\n• HUB grava users-profile em localStorage["fiobras-users-profile-cache"] toda vez que Firebase atualiza\n• Sub-apps (Manutenção, CRM) lêem esse cache SINCRONAMENTE no boot, ANTES de qualquer renderização\n• state.userProfiles começa POPULADO com a última versão conhecida (não vazio)\n• Quando Firebase chega, atualiza com versão fresh\n• Resultado: cards renderizam com FOTO desde o primeiro frame\n\nMesma estratégia pra users-config (cacheado em "fiobras-users-config-cache").\n\nUSERS local do Manutenção também é hidratado SÍNCRONO do cache (não precisa esperar Firebase pra _resolveUserKey funcionar).\n\nPra primeira sessão (cache vazio): mantém comportamento antigo, mas dali em diante sempre pega instantâneo.'}
    ]
  },
  {
    v:'3.42.0', d:'22 abr 2026',
    items:[
      {type:'feat', title:'CRM · stack de colaboradores no card (mockup aprovado).',
        desc:'Antes: card mostrava SÓ o último autor do histórico. Agora mostra TODOS os participantes do lead empilhados.\n\n• Ordem cronológica (criador primeiro)\n• Max 4 visíveis + chip "+N" agrupando os restantes\n• Hover em cada avatar abre tooltip dark minimalista com:\n  - Nome (Outfit 700)\n  - Ação simplificada (Cadastrou / Assumiu lead / Retorno feito / Comentou / Mudou de etapa / etc)\n  - Data em DM Mono verde (ex: 09/04)\n• Avatar do responsável atual ganha box-shadow verde sutil + badge "RESP" no tooltip\n• Avatar tem foto se cadastrada em users-profile, senão gradient + iniciais\n• Hover sobe 3px + scale 1.1 + tooltip aparece com seta\n\nAjustes:\n• Função leadColaboradores(l) extrai users únicos do l.historico + l.responsavel em ordem cronológica\n• _crmSimplifyAcao(acao) reduz texto longo do histórico pra 1-2 palavras\n• avatarStack(colabs, leadId) renderiza\n\nÍcone de edit verde aparece ao lado do stack pra ADMIN — clique troca responsável (label visível "admin: trocar resp" no hover, em vez de só o avatar invisível).'},
      {type:'feat', title:'HUB · botão "Atualizar app" no dropdown do user (limpa cache forçado).',
        desc:'William reportou múltiplas vezes que avatares/funções novas não apareciam no navegador dele mesmo após releases — sempre era cache antigo do Service Worker. O auto-update existente (toast "Nova versão") não era suficiente porque ele às vezes ignorava o toast ou o re-check do SW estava com janela longa.\n\nNovo: botão "Atualizar app" no dropdown do user (no HUB). Click executa:\n  - caches.delete() de TODOS os caches do SW\n  - serviceWorker.getRegistrations().forEach(r => r.unregister())\n  - location.reload(true)\n\nResolve qualquer "ficou cinza/sumiu/não atualizou" em 2 segundos. Use sempre que algo parecer estranho após release.'}
    ]
  },
  {
    v:'3.41.1', d:'22 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · re-render do CARD DE MÁQUINA quando users-profile carrega.',
        desc:'BUG: avatar do responsável (Vorlei, Joacir, etc) ficava CINZA mesmo após Firebase carregar a foto. Eu confirmei via preview/eval que avatar() retornava o HTML correto com foto base64, mas o card visual continuava sem foto.\n\nCausa: o helper _rebuildUsersFromFirebase (v3.41.0) chamava renderKanban/renderPreventiva/renderHistorico mas FALTAVA renderMaquinas e renderDashboard. Como o card de máquina é renderizado uma vez no boot (antes do users-profile chegar), ele ficava com avatar fallback (iniciais cinza) pra sempre.\n\nFix: incluí renderMaquinas e renderDashboard no rebuild. Agora qualquer mudança em users-profile/users-config dispara re-render de TODAS as views.'},
      {type:'feat', title:'CRM · admin pode trocar responsável de qualquer card.',
        desc:'William reportou que precisa trocar o responsável dos cards do CRM (ex: lead criado pela Suyanne, mas atribuído ao William).\n\nNovo: clicar no avatar do responsável (no card do pipeline) abre prompt com lista numerada dos users disponíveis pra escolher novo responsável. Só funciona pra admin (papel === "admin"); pra outros users, avatar fica não-clicável.\n\nQuando troca:\n- Salva campo `l.responsavel` no Firebase (campo novo, prevalece sobre o legacy do histórico)\n- Adiciona entry no histórico do lead: "Responsável trocado de X para Y por <admin>"\n- Loga em crm/log pra auditoria\n- Re-renderiza pipeline\n\nleadResponsavel(l) atualizado pra priorizar l.responsavel; fallback ao último autor do histórico (legacy).'}
    ]
  },
  {
    v:'3.41.0', d:'22 abr 2026',
    items:[
      {type:'high', title:'AUDITORIA + REFATORAÇÃO · base única de usuários (Firebase como Source of Truth).',
        desc:'William reportou que avatares de Suyanne/Vorlei não puxavam consistentemente em todos os apps. AUDITORIA revelou 4 fontes paralelas de users no sistema:\n\n1. HUB index.html: USERS hardcoded (17 entries)\n2. HUB: users-config (Firebase) com 18 entries\n3. HUB: users-profile (Firebase) com 18 entries (foto/nome)\n4. Manutenção: USERS hardcoded próprio (7 entries)\n5. CRM: AVATAR_GRADIENTS hardcoded (6 entries) — corrigido v3.40.4\n\nQualquer divergência entre essas fontes causava inconsistências (foto não puxava, nome aparecia errado, user faltava em select).\n\nREFATORAÇÃO v3.41.0 — fonte unificada:\n• users-config (Firebase) = LISTA CANÔNICA de chaves de usuário (CRUD admin)\n• users-profile (Firebase) = METADATA enriquecida (foto, nomeCompleto, role, senhaPlain)\n• USERS hardcoded = APENAS admin/joacir (fallback offline pra autenticação local)\n\nManutenção:\n• USERS local agora começa com 2 entries (admin/joacir)\n• Função _rebuildUsersFromFirebase() merge users-config + users-profile e enriquece USERS em runtime\n• onValue tanto pra users-config quanto users-profile (antes só profile)\n• STANDARD_USERS deriva dinamicamente após Firebase carregar\n• Nome friendly prioriza nomeCompleto > config.nome > USERS.nome\n\nResultado validado via preview/eval:\n- USERS começa com 2, cresce pra 18 quando Firebase chega\n- avatar("Suyanne") → resolve "suyanne", retorna foto base64 ✓\n- avatar("Vorlei") → resolve "vorlei", retorna foto base64 ✓\n\nAgora qualquer user adicionado/editado pelo painel admin do HUB aparece automaticamente em TODOS os sub-apps com nome+foto corretos. Zero hardcode pra propagar.'}
    ]
  },
  {
    v:'3.40.4', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRM agora puxa avatar/foto do users-profile do HUB (não tinha conexão).',
        desc:'AUDITORIA: William reportou que avatares só funcionavam na Timeline e Desenv. Cor (módulos nativos do HUB). Em CRM apareciam só iniciais cinza, mesmo pra users com foto cadastrada.\n\nCausa: o sub-app CRM tinha sua própria função `avatarFor(name)` com mapa hardcoded `AVATAR_GRADIENTS` (6 users) e ZERO conexão com `users-profile` do Firebase. Qualquer user fora do hardcoded virava círculo cinza, e ninguém puxava foto.\n\nNo Manutenção isso já tinha sido corrigido na v3.39.0 com expansão dinâmica do USERS via onValue de users-profile. Agora aplico padrão equivalente no CRM:\n\n• onValue(ref(db,"users-profile")) → window._userProfiles\n• `_crmResolveUserKey(nome)` resolve nome→chave matchando por nomeCompleto/nome/primeiro nome\n• `avatarFor(name)` agora pega foto do profile se existir\n• `avatarChip(name, size)` renderiza background-image quando tem foto\n\nTeste confirmado via preview: avatarFor("William") retorna foto base64 ✓; avatarFor("Givago") retorna gradient cinza (Givago é cliente externo, não user — comportamento correto).'}
    ]
  },
  {
    v:'3.40.3', d:'22 abr 2026',
    items:[
      {type:'fix', title:'CRÍTICO · "+ Preventiva" não salvava (toast() undefined no sub-app).',
        desc:'Diagnóstico via preview/eval: salvarPreventiva() chamava toast(...) na linha 5031, mas toast() NÃO existia no sub-app Manutenção (só no HUB). Erro silencioso ReferenceError travava a função APÓS o _fbPushPrev rodar — então a preventiva era de fato adicionada no Firebase, mas o modal não fechava e parecia que "não salvou".\n\nIntroduzi as 14 chamadas de toast() na refatoração v3.35.0 sem checar que o sub-app não tem essa função (tem apenas exibirInAppNotif e mostrarNotif).\n\nFix: shim global no sub-app Manutenção:\n```\nfunction toast(msg, tipo, durMs) {\n  exibirInAppNotif(tipo === "err" ? "⚠ Aviso" : "Manutenção", msg, "");\n}\nwindow.toast = toast;\n```\n\nResolve as 14 chamadas de uma vez: salvarPreventiva, deletarPreventiva (defense-in-depth), demanda, multi-tarefa, sistema de poderes (gated delete) etc.'}
    ]
  },
  {
    v:'3.40.2', d:'22 abr 2026',
    items:[
      {type:'fix', title:'2 fixes urgentes: crop modal por trás + nav mobile dos sub-apps duplicada.',
        desc:'1) Modal de Crop de imagem aparecia POR TRÁS do modal "Editar Usuário" (ambos com z-index 200; o crop foi inserido antes no DOM). Sem ver o modal, click "Aplicar recorte" caía no overlay do modal de baixo, parecia que "não salvava". Fix: cropModal ganhou z-index:9999 inline.\n\n2) No mobile, dentro de um sub-app (Manutenção/CRM), apareciam DUAS pílulas de navegação: a do sub-app POR CIMA da do HUB. Fix: detecta `window !== window.top` no boot do sub-app e adiciona class `in-hub-frame` no <html>; CSS esconde a bottom-nav do sub-app quando essa class está presente. Aplicado em Manutenção e CRM (Preço não tem nav mobile).'}
    ]
  },
  {
    v:'3.40.1', d:'22 abr 2026',
    items:[
      {type:'fix', title:'Service Worker · update mais agressivo (boot + 5 min em vez de só 30 min).',
        desc:'Diagnóstico: William reportou que ao selecionar imagem do avatar, "nada acontece". Eu confirmei via preview/eval que ANTES do hard reload todas as funções da v3.40.0 (abrirCropModal, cropConfirm, aplicarUsuariosSeed) apareciam undefined no window — ou seja, o navegador estava servindo o JS cacheado pelo Service Worker da release anterior.\n\nO SW já tinha mecanismo de auto-update + toast "Atualizar agora" + skipWaiting. Mas o re-check só acontecia a cada 30 minutos de uso, então users que abriam o app recém após uma release nova podiam ficar várias horas com cache stale.\n\nFix: chama reg.update() IMEDIATAMENTE no boot do app + setInterval de 5 min em vez de 30 min. Combinado com o toast existente, o user vê a opção de atualizar muito mais cedo. Zero impacto em performance porque o reg.update() é só uma comparação de hash, não baixa nada se nada mudou.\n\nNada de feature nova nesta release — só o fix do mecanismo de update. As funcionalidades da v3.40.0 (crop interativo, poderes condicionais, migração USERS) já estavam funcionando, era só o cache antigo que escondia.'}
    ]
  },
  {
    v:'3.40.0', d:'22 abr 2026',
    items:[
      {type:'high', title:'HUB · 3 ajustes estruturais (auditoria 22/04).',
        desc:'1) CROP interativo de imagem ao adicionar avatar. Antes o sistema cortava automático do centro. Agora abre modal com a imagem cheia, slider de zoom (1× → 4× do tamanho mínimo) e drag pra reposicionar. Quadrado verde marca a área que vira o avatar 400×400 JPEG 0.85. Funciona pro user editar a própria foto (Minha Conta) e pro admin editar foto de qualquer user (Editar Usuário).\n\n2) PODERES CONDICIONAIS: os 5 poderes (deletarPreventiva/executarPreventiva/exportarDados/editarMaquina/reatribuirCard) são todos do módulo Manutenção. Agora os toggles SÓ ficam editáveis se o user tem "Manutenção" marcado em Módulos liberados. Se não tem, aparece aviso vermelho "⚠ Esses poderes só valem dentro do Manutenção. Marque Manutenção em Módulos liberados acima pra ativar." e os toggles ficam disabled. Re-render reativo: marcar/desmarcar Manutenção atualiza o estado dos poderes na hora.\n\n3) MIGRAÇÃO USERS HARDCODED → users-config (auditoria estrutural pedida pelo William: "não podemos ter user hardcode"). Seed roda 1x quando admin abre Gerenciar Usuários: copia os 17 USERS hardcoded pra users-config no Firebase + senha plain do admin pra users-profile. Flag fiobras-users-seed-v1 garante que roda só uma vez. Depois disso, isUserDinamico() retorna true pra todos (exceto chave "admin" que continua protegida contra exclusão). Admin agora edita/exclui qualquer user (Anderson, Vorlei, etc) via UI sem precisar mexer no código. Compatibilidade: USERS hardcoded continua existindo como fallback até toda base estar migrada.'}
    ]
  },
  {
    v:'3.39.0', d:'21 abr 2026',
    items:[
      {type:'feat', title:'Manutenção + HUB · 4 ajustes (auditoria 21/04 tarde).',
        desc:'1) Coluna Responsável adicionada à tabela de Preventivas (entre Frequência e Última). Mostra avatar xs + nome. colspan ajustado de 8 → 9.\n\n2) AUDITORIA avatar do William: o sub-app Manutenção tem USERS hardcoded (admin/joacir/hernandes/vorlei/pedro/ivonei/roland) e William não estava lá. Quando aparecia "W" num card, `_resolveUserKey` não achava e caía em default cinza. Fix: o onValue de users-profile agora EXPANDE dinamicamente o USERS local pra incluir qualquer user do HUB que tenha profile (nomeCompleto + chave). Assim o avatar resolve a chave certa, lê foto do users-profile/{key}/foto e aplica a cor da paleta `.u-{key}` quando existe.\n\n3) Botão "+ Demanda" voltou ao topo do Kanban (eu tinha tirado pra "limpar" mas sumiu junto). Toolbar simplificada: só o botão, alinhado à direita. O "+" na coluna A Fazer continua funcionando como atalho.\n\n4) Botão de olho de senha aparecia só pra users com senhaPlain salvo (a partir da v3.21.5). Users antigos (que cadastraram antes ou via Minha Conta) só têm senhaHash e o olho sumia. Agora o olho aparece sempre que tem senha; se não tem versão visualizável, clicar mostra toast explicando "cadastrada antes do sistema guardar versão visualizável — redefinir pelo cadeado pra poder visualizar".'}
    ]
  },
  {
    v:'3.38.0', d:'21 abr 2026',
    items:[
      {type:'feat', title:'Manutenção + HUB · 8 ajustes da auditoria noturna (21/04).',
        desc:'1) Card Kanban: data saiu do canto superior (sobrepunha botões de ação) e foi pro footer junto com estimativa. Cor vermelha + ícone ⚠ quando age > 7 dias (em qualquer coluna ≠ done). Card "doing" continua vermelho com dot pulsante.\n\n2) Light mode no Kanban: quando o HUB está em tema light, o board ganha fundo sage claro, cards brancos, tags pastel, mantendo toda a hierarquia visual do dark.\n\n3+4) Modal Nova/Editar Preventiva aumentado (540 → 640px), modal de Máquina também (520 → 620px) com max-width:94vw. Não corta mais em viewports apertados.\n\n5) Nova Solicitação: campo "Seu nome" virou SELECT dos usuários do sistema (merge USERS local + users do HUB via userProfiles). Ninguém de fora solicita.\n\n6) Estimativa vira DIAS em vez de horas. Chip no card mostra "Nd" (ex: "3d"). Retrocompat: cards antigos com horasEstimadas continuam mostrando "Nh".\n\n7) Título separado do equipamento: modal de demanda ganhou campo "Título" obrigatório + select de máquinas cadastradas. Antes o título era auto-gerado concatenando equip+desc, ficava redundante. Agora título = o problema ("Vazamento no hidráulico"), equip = a máquina (RET-01).\n\n8) HUB: admin pode editar foto/avatar de qualquer user no painel "Editar Usuário". Avatar preview + botão Escolher imagem + Remover. Crop quadrado automático 400px JPEG 0.82 (mesmo pipeline do mcFotoChange). Salva em users-profile/{user}/foto.'}
    ]
  },
  {
    v:'3.37.0', d:'21 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · 4 ajustes de polish (auditoria 21/04 noite).',
        desc:'1) Toolbar de pills de filtro do Kanban REMOVIDA (Mecânica/Elétrica/Preventiva/Demanda/Alta/Média/Baixa/nomes). Estava poluindo o topo do board. Botão "+ Demanda" agora vive dentro da coluna "A Fazer" do novo Kanban (v3.36.0).\n\n2) Tabela de Preventivas ganhou busca + paginação (5 por página). Busca filtra por tarefa, equipamento, responsável, setor e observações em tempo real. Paginação mostra "‹ 1 2 3 … N ›" com janela responsiva + chip "X / N" no final. Contador "N de M resultados" no topo quando filtra.\n\n3) Aba padrão ao abrir Manutenção agora é **Kanban** (antes abria em Dashboard). Mais direto pra quem usa o sistema no dia-a-dia.\n\n4) Foto do William (e outros users do HUB que não estão no USERS local do sub-app) agora puxa correto no avatar stack. Fix: `_resolveUserKey` ganha fallback pra `state.userProfiles` (onde estão todos os users do HUB), matchando por chave OU por nomeCompleto/nome.'}
    ]
  },
  {
    v:'3.36.0', d:'21 abr 2026',
    items:[
      {type:'high', title:'Kanban Manutenção · redesign completo estilo Linear/Trello dark (Ajuste 4 auditoria v3.32+).',
        desc:'Board inteiro agora é dark coeso (sempre, mesmo em light mode do HUB — coerente com o card de máquina). Redesign baseado na referência que William enviou.\n\nNova anatomia dos cards:\n• Thumbnail grande no topo quando tem foto (em vez de img menor meio do card)\n• Tags coloridas topo: tipo (Preventiva/Corretiva/Melhoria/Demanda) + urgência (Alta/Média/Baixa) + setor\n• Data relativa canto superior direito ("Hoje" / "Ontem" / "3d atrás" / "25 Abr")\n• Em cards "Em Andamento": data vira timer ativo em vermelho com dot pulsante (● 16:32h)\n• Título Outfit 700 grande\n• Linha de equipamento com tag verde DM Mono (código da máquina) + nome\n• Footer: stack de avatares + contador comentários + chip de peças + chip horas estimadas\n• Barra de progresso fina na base (índigo todo / âmbar doing / verde done)\n• Botões de ação (iniciar/concluir/editar/deletar) compactos no canto superior direito\n\nCabeçalhos de coluna minimalistas: nome grande + dot colorido (doing pulsa) + count em chip + botão "+" pra adicionar (só na coluna A Fazer).\n\nCampos novos opcionais no schema manutencao/kanban/{id}:\n• horasEstimadas (number): aparece como chip "2h" no footer\n• progresso (0-100): opcional; default é automático por col (todo=0, doing=50, done=100)\n• foto (já existia): agora vira banner visual no topo do card\n\nComentários inline preservados mas colapsados por padrão — clica no ícone 💬 pra expandir. Drag & drop HTML5, botões iniciar/concluir/editar/deletar mantidos.\n\nHelpers novos: _relativeDate(ts) pra formatar data humana, _kcToggleExtras pra expandir comentários. _tickTimers atualizado pra .kc2-date[data-col="doing"].\n\nFixes URGENTES que entraram junto:\n• Modal "+ Preventiva" multi-tarefa estava cortado em tela apertada (width:540px inline sem max-width) → agora width:540px + max-width:94vw. ts-head ganhou flex-wrap pra os botões Todas/Limpar não sumirem.\n• Card de Máquina: badge "ATIVA" sobrepunha os botões QR/Editar/Deletar (ambos no canto superior direito). Botões moveram pro FOOTER à direita — badge fica sozinha no topo, sem conflito.'}
    ]
  },
  {
    v:'3.35.0', d:'21 abr 2026',
    items:[
      {type:'high', title:'Manutenção · +Preventiva multi-tarefa + card light mode + "Responsável" (Ajuste 2 + polish do Ajuste 1).',
        desc:'Pacote consolidando vários ajustes da auditoria v3.32+:\n\n— AJUSTE 2 · Modal +Preventiva agora é multi-tarefa —\nFluxo: 1 máquina → marca N tarefas distintas (mesma freq/data/resp) → loop de _fbPushPrev. Caso real do William: RET-01 com 5 tarefas semanais (abrir tampas, conferir tensão, verificar vazamento, verificar folgas, limpar ventilação) — antes precisava abrir o modal 5x; agora 1x marca todas.\n\nLista de tarefas vem do campo m.prevs da máquina (badge cinza "PADRÃO"). Input no rodapé permite adicionar tarefa custom on-the-fly (badge verde "+ADIC.") — entra na lista já marcada. Botões "Todas" / "Limpar" pra agilizar.\n\nSummary dinâmico abaixo da lista + texto do botão Salvar muda conforme N selecionadas: "Salvar preventiva" / "Salvar 5 preventivas".\n\nEdição (clicar ✏): multi-select some, vira campo texto simples — edita só aquela 1 preventiva.\n\nRemovido: botão "+ Em massa" da toolbar, modal #modal-massa inteiro, todas as funções _massa* / abrirModalMassa / confirmarMassa, CSS .mass-* (introduzidos na v3.32.5). Preventivas criadas via "+ Em massa" antes ficam intactas.\n\n— AJUSTE 1 polish · Card de máquina —\n• "ZELADOR" → "RESPONSÁVEL" (label mais coerente com o resto do sistema)\n• Light mode coerente: card vira branco/sage no tema light (em vez de preto chapado destoando do fundo). Mantém toda a hierarquia visual e badges semânticas adaptadas.\n• Auto-fill: ao escolher uma máquina no modal +Preventiva, campo Responsável puxa automático o m.responsavel da máquina (se não estiver editando).\n\nLabel do campo no cadastro de máquina também trocado de "Zelador responsável" → "Responsável".'}
    ]
  },
  {
    v:'3.34.0', d:'21 abr 2026',
    items:[
      {type:'high', title:'Manutenção · card de Máquina redesign estilo Bank Account (Ajuste 1 auditoria v3.32+).',
        desc:'Redesign completo do card no painel Máquinas. Inspirado no card "Bank Account · Chase Bank" enviado pelo William. Card dark sempre (independente do tema), bordas arredondadas 18px, glow verde sutil no canto.\n\nNova anatomia:\n• Eyebrow DM Mono UPPERCASE (ex: "MÁQUINA · MECÂNICA")\n• Badge de status canto superior direito com cor semântica (verde=ATIVA, âmbar=EM MANUT., vermelho=PARADA) com dot pulsante\n• Nome grande Outfit Black 900 (1.15rem)\n• Linha de identificação estilo "•••••• RET-01" (adaptação do "•••••• 6789" do Chase)\n• Footer com avatar + nome do zelador responsável à esquerda, localização física à direita\n• Botões QR/Editar/Deletar no canto superior direito (delete só admin)\n\n3 campos NOVOS no cadastro de máquina:\n• status: "ativa" | "manutencao" | "parada" (default: ativa pra retrocompat)\n• responsavel: chave do user (select dos USERS não-admin)\n• localizacao: texto livre até 40 chars\n\nFallbacks:\n• Sem responsavel → avatar "—" cinza + "Não definido" em itálico\n• Sem localizacao → esconde bloco direito do footer\n• Sem status → assume "ativa" (badge verde)\n\nBug fix: linha "24 preventivas cadastradas · ver no detalhe" removida do card (o texto cortado que aparecia estranho no print). A contagem agora vive apenas no modal de edição.\n\nMobile (≤768px): padding menor, nome 1rem, footer compacto.'}
    ]
  },
  {
    v:'3.33.0', d:'21 abr 2026',
    items:[
      {type:'high', title:'Sistema de Poderes · permissões granulares configuráveis por usuário (REGRA GERAL da auditoria v3.32+).',
        desc:'Estabelecida regra universal: toda vez que William definir "X pode Y", não hardcoda no código — cria um toggle no painel admin. Assim ele gerencia tudo por UI sem precisar de deploy.\n\n5 poderes iniciais:\n• deletarPreventiva (default usuário: NÃO · Joacir override: SIM via seed)\n• executarPreventiva (default usuário: SIM)\n• exportarDados (default usuário: NÃO)\n• editarMaquina (default usuário: NÃO)\n• reatribuirCard (default usuário: NÃO)\n\nArquitetura:\n• Schema: users-profile/{user}/powers/{poder} = bool\n• Helper global canUser(userKey, poder) no HUB e no sub-app Manutenção\n• Admin/Gerente sempre têm tudo (bypass) — toggles só aplicam pra Usuário comum\n• Seed inicial roda 1x (flag localStorage fiobras-powers-seed-v1): popula defaults pra todos os users cadastrados + override do Joacir em deletarPreventiva=true\n\nUI nova: seção "⚡ Poderes" no modal Editar Usuário (painel admin). 5 linhas com ícone colorido por urgência, nome, descrição, default da role e toggle iOS-style. Quando role vira admin/gerente, toggles ficam desabilitados + opacity reduzida (acesso automático).\n\nPrimeira aplicação (Ajuste 3b): botão Deletar da tabela/cards mobile de preventivas só aparece se canUser("deletarPreventiva"). Função também faz defense-in-depth (recusa com toast se chamada via console sem o poder).'}
    ]
  },
  {
    v:'3.32.8', d:'21 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · botões Editar/Deletar da tabela Preventiva não funcionavam + remove botão Executar da tabela (Ajuste 3a auditoria v3.32+).',
        desc:'Bug: os onclick da tabela desktop usavam \\\\x27 (duas barras) em vez de \\\\x27 (uma), fazendo o HTML renderizar literalmente \\\\x27 em vez de aspa simples. Clique não fazia nada (erro silencioso no attr).\n\nFix: \\\\x27 → \\\\x27 nos 3 botões. Cards mobile já estavam corretos.\n\nAlém disso, botão Executar (✓) removido da tabela desktop — execução passa pelo fluxo do Kanban, não direto da tabela. Botão Concluir continua nos cards mobile.\n\nDeletar ainda aberto pra todos (gated virá após implementação do sistema de powers — Ajuste 3b).'}
    ]
  },
  {
    v:'3.32.7', d:'21 abr 2026',
    items:[
      {type:'fix', title:'Manutenção · calendário + Kanban mostravam só 1 preventiva quando várias da mesma máquina venciam no mesmo dia (Ajuste 5 auditoria v3.32+).',
        desc:'Bug da supressão visual introduzida na v3.32.4: agrupava por (semana, máquina) e mantinha só a de MAIOR freq. Quando TODAS tinham a mesma freq (ex: 5 tarefas Semanais distintas da RET-01 vencendo no mesmo dia), só uma aparecia — as outras 4 sumiam.\n\nRegra corrigida:\n• Freqs DIFERENTES na mesma semana+máquina → só a maior aparece (cascata preservada: Anual absorve Semanal)\n• MESMA freq (tarefas distintas) → TODAS aparecem\n\nFix em _buildEventMap (calendário) e gerarCardsPreventivas (Kanban): agrupa por (semana, máquina), descobre freq máxima e mantém TODAS as preventivas daquela freq máxima.'}
    ]
  },
  {
    v:'3.32.6', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Notificação diária de preventivas via Cloudflare Worker (Item 8 — último do ciclo v3.10).',
        desc:'Novo Worker Cloudflare "fiobras-digest-diario" em /workers/digest-diario-preventivas/. Cron 08:30 BRT (seg-sex) lê preventivas diárias (freq=1), agrupa por responsável, ignora admin/gerentes, e empilha payload em manutencao/fcmPending — o Worker FCM existente entrega o push.\n\nArquitetura desacoplada: este Worker NÃO envia FCM diretamente, só publica. O Worker FCM atual (que já funciona) cuida da entrega. Isso permite testar/trocar cron sem mexer no pipeline de notificações.\n\nAuth: usa a MESMA service account do backup GitHub Actions (FIREBASE_SERVICE_ACCOUNT já existe). Gera OAuth token via JWT RS256 no próprio Worker usando Web Crypto API.\n\nSetup pro William (5 passos, ~10min):\n1. npm install -g wrangler@latest\n2. wrangler login\n3. cd workers/digest-diario-preventivas\n4. wrangler secret put FIREBASE_SERVICE_ACCOUNT (cola JSON)\n   wrangler secret put FIREBASE_DB_URL (cola URL)\n5. wrangler deploy\n\nBonus: endpoint GET /run pra disparar manualmente (teste sem esperar 24h). README detalhado em /workers/digest-diario-preventivas/README.md.\n\nCiclo v3.10 COMPLETO (10/10 itens) — fim.'}
    ]
  },
  {
    v:'3.32.5', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · cadastro em massa de preventivas (Item 4 do ciclo v3.10).',
        desc:'Novo botão "+ Em massa" ao lado do "+ Preventiva" abre modal pra cadastrar a mesma preventiva em várias máquinas de uma vez.\n\nCampos únicos (aplicados em todas):\n• Tarefa (select com todas as tarefas padrão de todas as máquinas + "Outra")\n• Frequência\n• Setor\n• Última execução\n• Responsável\n\nLista de máquinas com checkbox (multi-select):\n• Busca por código/nome em tempo real\n• Botões "Marcar todas" / "Limpar"\n• Resumo verde: "N máquinas selecionadas · serão cadastradas N preventivas"\n\nAo confirmar: loop de _fbPushPrev N vezes. Toast final confirma. Cada preventiva criada vem com obs "[lote] cadastrada via cadastro em massa" pra rastrear origem.'}
    ]
  },
  {
    v:'3.32.4', d:'19 abr 2026',
    items:[
      {type:'high', title:'Manutenção · hierarquia de preventivas (cascata) + supressão visual (Itens 1+2+3).',
        desc:'Maior mudança lógica do ciclo v3.10.\n\n' +
        'ITEM 1 — Cascata ao concluir:\n' +
        'Quando uma preventiva de frequência maior é executada, as menores da MESMA máquina também são marcadas como executadas (ultima = hoje). Ex: Anual concluída em 15/03 → Semestral/Trimestral/Mensal/Quinzenal/Semanal da mesma máquina também viram executadas em 15/03, e próxima data recalcula a partir disso. Diária (freq=1) fica fora — tem ciclo próprio.\n\n' +
        'Implementado em confirmarAssinatura(): após atualizar a preventiva executada, itera sobre state.preventivas e atualiza todas com mesma maqKey + freq menor. Obs gravada: "[cascata] executada junto com <tarefa maior>".\n\n' +
        'ITEM 2 — Supressão visual (calendário + Kanban):\n' +
        'Mesma semana, mesma máquina → só a preventiva de maior hierarquia aparece. Ex: se na semana 23-29 tem Anual + Semestral + Trimestral + Semanal da Retorcedeira 1, só a Anual aparece no calendário e como card no Kanban. As menores ficam implícitas (serão executadas em cascata).\n\n' +
        'Implementado via helper _weekKey(date) (ISO 8601) + agrupamento por (semana, maqKey) pegando o de maior freq. Aplicado em _buildEventMap() (calendário) e gerarCardsPreventivas() (Kanban).\n\n' +
        'ITEM 3 — Recálculo pela data real de execução:\n' +
        'JÁ ESTAVA IMPLEMENTADO desde versões anteriores. confirmarAssinatura() faz "ultima: hoje" (data real de execução, não programada). O cálculo da próxima é sempre ultima + freq, respeitando atrasos.'}
    ]
  },
  {
    v:'3.32.3', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · avatares no lugar de nome + stack +N (Item 10 do ciclo v3.10).', desc:'Sistema unificado de avatares. Cor consistente por usuário (gradient fixo), iniciais quando não tem foto, foto se cadastrada em users-profile. 4 tamanhos (xs/sm/md/lg).\n\nHelpers globais:\n• avatar(nomeOuKey, size) → <span> com foto ou iniciais + tooltip com nome completo\n• avatarStack([users], size) → até 2 visíveis, resto vira chip +N\n• _avStackExpand() → click no +N expande dropdown com todos os participantes\n\nCSS em /css/tokens.css (compartilhado entre os 4 apps).\n\nAplicado em:\n• Cards Kanban: stack com autor + resp + quem reatribuiu + quem executou\n• Calendário · lista do dia: avatar do resp em cada preventiva\n• Cards mobile de preventiva: chip "Resp [avatar]" na meta line\n\nListener onValue em users-profile no Manutenção — quando user cadastra foto no HUB, Manutenção atualiza automaticamente.\n\nPaleta por user: Admin preto · William verde · Joacir teal · Hernandes azul · Vorlei laranja · Pedro roxo · Ivonei amarelo · Roland vermelho.'}
    ]
  },
  {
    v:'3.32.2', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · switch de notificações no header (Item 6 do ciclo v3.10).', desc:'Antes: banner "Ative as notificações" aparecia TODA vez que o app abria — incomodava usuários recorrentes.\n\nAgora:\n• Popup automático removido. initNotificacoes() só sincroniza estado do SO com o switch.\n• Novo botão 🔔/🔕 no header (ao lado do toggle dark mode) — chama toggleNotifPermission()\n• 1ª vez que user clica: pede permissão ao navegador\n• Se concedida: fica 🔔 ativo. Clicar de novo silencia (flag fio_notif_silenciar no localStorage)\n• Se silenciado: vira 🔕. Clicar reativa.\n• Se bloqueado no SO: toast orienta "libere em Configurações do site"\n• mostrarNotif() respeita a flag de silenciar\n\nNão tem como revogar permissão via JS (limitação do browser) — a flag silenciar faz o papel de "desligar" dentro do app.'}
    ]
  },
  {
    v:'3.32.1', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · frequência Diária no cadastro de preventivas (Item 7 do ciclo v3.10).', desc:'Adicionada opção "Diária (1d)" no select de frequência do form de preventiva.\n\nFrequências completas agora: Diária · Semanal · Quinzenal · Mensal · Trimestral · Semestral · Anual.\n\nRegra especial da Diária: NÃO aparece no calendário nem gera card no Kanban — é usada só como base pra notificação diária (Item 8). Filtros implementados:\n• _buildEventMap() ignora freq=1\n• gerarCardsPreventivas() ignora freq=1\n\nPreparação pro v3.32.6 (notificação cron 08:30 via Worker).'}
    ]
  },
  {
    v:'3.32.0', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · cards de Máquinas compactos.', desc:'Primeiro item do ciclo v3.10 do doc de Preventivas (renumerado v3.32.x aqui). Cards do inventário de máquinas ficaram compactos:\n\n• Código (m.tag) agora aparece como chip verde DM Mono no topo (antes vinha colado no subtítulo "RET-01 · Mecânica")\n• Nome da máquina em Outfit 900, hierarquia clara\n• Meta line única: Modelo + Ano + Setor (antes tinha 2 linhas)\n• Lista de 20 preventivas padrão SAI do card — substituída por "20 preventivas cadastradas · ver no detalhe" (acessível via botão Editar que já existia)\n\nAltura do card: ~500px → ~110px (-78%). Scroll da grid muito mais usável.\n\nSchema do Firebase inalterado. Só mudança visual no render. Compatível com cards sem tag (não mostra chip).\n\nItem 9 (Hub · permissão Gerente) auditado e fechado como "não-bug" — já funciona: getEffectiveModules("gerente") retorna ALL_MODULES automático.'}
    ]
  },
  {
    v:'3.31.3', d:'19 abr 2026',
    items:[
      {type:'high', title:'FIX REAL Manutenção · tabela de Preventivas vazia (ReferenceError silencioso).', desc:'Causa raiz real: CHECK_SVG_STR, EDIT_SVG_STR, DEL_SVG_STR eram usadas no renderPreventiva mas NUNCA foram definidas em lugar nenhum do código.\n\nComo renderMaquinas usa EDIT_SVG e DEL_SVG (sem _STR) LOCAIS, provavelmente era um typo antigo no renderPreventiva. Porém como William nunca teve preventivas cadastradas com dados válidos, nunca caiu no branch do render → ReferenceError nunca disparou → bug dormiu por meses.\n\nAgora com 5 preventivas, o render entra no loop, tenta referenciar CHECK_SVG_STR, dá ReferenceError, o JS interrompe mid-render → tbody fica vazio.\n\nFix: constantes globais CHECK_SVG_STR, EDIT_SVG_STR, DEL_SVG_STR definidas no topo do script (junto com VERSION/USERS). Agora renderPreventiva executa sem erro.'},
      {type:'feat', title:'Resumo de notificações "Enquanto você estava fora" não repete.', desc:'Antes: toda vez que o app carregava, mostrava o mesmo resumo de "X notificações não vistas" mesmo se já tinha mostrado minutos antes. Bug irritante.\n\nAgora: quando o resumo é mostrado, o timestamp atual é salvo em localStorage (fio_resumo_last_ts_<user>). Na próxima verificação, filtra pendentes com ts > last-seen → só mostra notificações REALMENTE novas desde a última visualização.\n\nPor usuário: se admin e Jacques usam o mesmo navegador/dispositivo, cada um tem seu last-seen separado.'}
    ]
  },
  {
    v:'3.31.2', d:'19 abr 2026',
    items:[
      {type:'high', title:'Fix REAL Manutenção · switchTab não re-renderizava ao trocar de aba.', desc:'A causa raiz do bug reportado. switchTab() só tinha re-render pra dashboard e relatórios — outros 4 tabs (preventiva, maquinas, historico, kanban) mantinham o último render.\n\nCenário: user abre Manutenção → tab Dashboard ativo. Firebase onValue dispara e chama renderPreventiva (state correto). MAS o tbody tá num painel inativo. Quando user clica em "Preventiva", switchTab só mudava display — tbody continua com o que foi renderizado antes.\n\nSe o cache local (localStorage) tinha state.preventivas vazio/antigo, o primeiro render do boot escrevia "Nenhuma" no tbody, e esse HTML ficava até o user recarregar a página. Mesmo com dados novos do Firebase, o tbody não era atualizado pra quem estava vendo outra aba.\n\nFix: switchTab e switchTabMobile agora re-renderizam quando o user troca pra qualquer aba (preventiva/maquinas/historico/kanban/relatorios).\n\nCombina com fix defensivo v3.31.1 (array ou object) — 2 camadas de segurança.'}
    ]
  },
  {
    v:'3.31.1', d:'19 abr 2026',
    items:[
      {type:'high', title:'Fix Manutenção · tabela de Preventivas dizia "Nenhuma" mesmo tendo cadastro.', desc:'Bug reportado pelo William: havia 5 preventivas cadastradas (apareciam no calendário dia 23/abril) mas a tabela "Plano Preventivo" mostrava "Nenhuma preventiva cadastrada".\n\nCausa: em certos cenários (provavelmente cache local restaurando state como Object em vez de Array, ou edge case de hydration), state.preventivas virava Object ao invés de Array. O check "if (!all.length)" dava true em Object (que não tem .length), caindo na empty state.\n\nFix defensivo em renderPreventiva:\n• Se Array.isArray(state.preventivas) → usa direto\n• Se for Object (bug de hydration) → converte via Object.entries().map()\n• Se null/undefined → vazio\n\nConsole.warn se conversão acontecer pra captura de telemetria.'}
    ]
  },
  {
    v:'3.31.0', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Manutenção · Preventivas viram cards em mobile.', desc:'Antes: tabela com 8 colunas (Tarefa/Equipamento/Setor/Freq/Última/Próxima/Status/Ações) com scroll horizontal em mobile. Difícil de usar na fábrica (com luva). Texto comprimido, font 9-11px, scroll-x desorientador.\n\nAgora em telas ≤640px a tabela some e cards verticais aparecem:\n• Border lateral colorida (verde OK / amarelo Próxima / vermelho Atrasada)\n• Chip de status no canto superior direito (ex: "Atrasada 5d", "Em 3d", "Hoje")\n• Meta line com Freq/Última/Próxima em DM Mono\n• 3 ações inline: botão "✓ Concluir" (verde, 2/3 da largura) + Editar + Deletar\n• Todos touch-friendly (44px+ min-height)\n\nDesktop não muda (tabela continua igual). Duplicação minima (mesmo dataset, 2 renders).'},
      {type:'feat', title:'firebase-messaging-sw.js no PRECACHE.', desc:'O service worker do FCM (notificações push do Manutenção) agora é pré-cacheado pelo SW principal na instalação. Notificações recebem tratamento mesmo no 1º boot offline. Adicionado em /sw.js PRECACHE.'},
      {type:'note', title:'Audit mobile dos 6 painéis do Manutenção.', desc:'Verificados: Dashboard (OK), Kanban (scroll-x OK), Máquinas (cards 1-col OK), Histórico (lista OK), Relatórios (donut+lista OK). Único problema crítico era a tabela de Preventivas (resolvido acima). Modais já viraram bottom-sheet via tokens.css v3.28.0.'}
    ]
  },
  {
    v:'3.30.0', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Sub-apps mais rápidos via prefetch passivo + skeleton loader.', desc:'Antes: ao clicar num módulo (Preço/CRM/Manutenção) pela 1ª vez, demorava 1-2s pra carregar (parse 118-253KB + Firebase auth + listeners).\n\nAgora 2 técnicas combinadas:\n• <link rel="preconnect"> pra Firebase RTDB no <head> do HUB — abre TCP+TLS em paralelo com o boot. Quando user abre sub-app, handshake já tá pronto.\n• <link rel="prefetch"> dos 3 sub-apps no <head> — browser baixa em background quando idle (depois do boot, sem competir). NÃO ativa Firebase, NÃO renderiza, NÃO abre WebSocket. Quando user clica, vem do cache HTTP, instantâneo.\n\nBonus: skeleton loader (spinner verde discreto) no iframe-wrap enquanto carrega — feedback visual em vez de tela preta.\n\nIMPORTANTE: NÃO foi feito o pre-load de iframes ATIVOS (que abriria 25 conexões WebSocket simultâneas). Prefetch passivo é a abordagem correta.'},
      {type:'feat', title:'Preço · redesign minimal + chips compactos pros valores fixos.', desc:'Antes: nos 4 abas (Vendas, Tingimento, Preparação, Retorção) os steps "Outros custos" tinham 6 campos visualmente iguais — 2 editáveis (R$ Retorção/Outros) e 4 fixos (Lucro op, Desp op, JCP, IRPJ+CSLL). Layout cheio, espaço sobrando, "unfinished".\n\nAgora hierarquia visual clara:\n• Editáveis ocupam 2 colunas como cards\n• Fixos viram chips compactos numa linha (pílulas com pontuação % minúscula + label + valor)\n• Visual mais profissional, mais denso, foco no que o usuário pode editar\n\nMudanças técnicas:\n• Helper g() agora lê de input OU de span[data-value] — pra Lucro Op (calculado dinamicamente) que virou chip\n• Helper setVal() pra escrever em qualquer um\n• Grid mudou de minmax(175px, 1fr) pra minmax(140px, 180px) com justify-content:start (campos com max-width pra não esticar)\n• Mobile: grid colapsa pra 2 colunas em ≤640px (chips wrap natural)'},
      {type:'feat', title:'Mobile-friendly fix nos campos do Preço.', desc:'Inputs já tinham font-size:16px global (v3.22.0) — mas o grid antigo do Preço (cols-auto minmax 175px) ficava cramped em mobile pequeno. Novo grid (cols-fixed minmax 140-180px) colapsa pra 2 colunas em mobile e os chips fixos quebram naturalmente em múltiplas linhas. Sem zoom iOS.'}
    ]
  },
  {
    v:'3.29.0', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Imagens com loading="lazy" + decoding="async".', desc:'Todas as 12 tags <img> nos templates do HUB e Manutenção (Timeline fotos, Cor detalhe, Minha Conta avatar, modal lightbox, preview de upload) agora têm loading="lazy" + decoding="async".\n\nGanho:\n• Browser só baixa a imagem quando ela tá perto de aparecer no viewport\n• decoding="async" libera o main thread durante decode\n• Timeline com 4+ registros: economiza ~200KB no boot inicial\n• Cor detalhe: foto só baixa quando user abre o modal\n\nNão afeta imagens base64 inline (já estão no DOM).'}
    ]
  },
  {
    v:'3.28.0', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Modais viraram bottom-sheet em mobile.', desc:'Antes: em mobile, modais apareciam como caixinhas pequenas centralizadas no meio da tela — difícil ler em iPhone Pro Max, fora do padrão moderno.\n\nAgora: em telas ≤640px, modais com classe .modal-bg viram slide-up cobrindo a base com:\n• Drag handle (barra cinza) no topo, indicando que pode arrastar\n• Border-radius 20px nos cantos superiores (Apple-like)\n• Animação slide-up 280ms cubic-bezier (suave)\n• Padding-bottom respeita safe-area-inset (notch/home bar)\n• max-height 90vh + scroll interno se conteúdo grande\n• Largura cheia da tela (mais espaço pra ler)\n\nRegra UNIVERSAL no /css/tokens.css — aplica nos 4 apps (HUB, CRM, Preço, Manutenção) automaticamente. Desktop não muda (modal continua centralizado).\n\nRespeita prefers-reduced-motion (animação instantânea — já coberto pelo bloco global v3.22.2).'}
    ]
  },
  {
    v:'3.27.0', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Design tokens compartilhados (/css/tokens.css).', desc:'Antes: cada sub-app tinha :root próprio com vars duplicadas (--green declarado 4 vezes em 4 arquivos). Mudar uma cor exigia editar 4 lugares.\n\nAgora: novo arquivo /css/tokens.css com 30+ tokens semânticos:\n• Surfaces: --t-bg, --t-surface, --t-surface-2/-3, --t-bg-deep\n• Borders: --t-border, --t-border-2/-3\n• Text: --t-text, --t-text-2, --t-muted, --t-muted-2\n• Brand: --t-brand, --t-brand-hover, --t-brand-soft\n• Status: --t-info/success/warn/danger (com variantes -soft)\n• Radius: --t-radius-xs/sm/md/lg/xl/pill (importado do v3.26.0)\n• Tipografia: --t-font-display/body/mono\n• Sombras: --t-shadow-sm/md/lg/xl\n• Dark mode: variantes em [data-theme="dark"]\n\n4 apps linkam o tokens.css antes do CSS interno. Aliases retrocompat (--green, --red, etc.) garantem que CSS antigo continua funcionando enquanto migra naturalmente.\n\nAdicionado ao PRECACHE do SW. Cache hit instantâneo na 2ª visita.\n\nGanho: single source of truth. Mudou cor brand uma vez = 4 apps mudam juntos.'}
    ]
  },
  {
    v:'3.26.0', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Border-radius padronizado em escala universal.', desc:'Antes: cada arquivo usava raios diferentes (HUB 12px, CRM 8px, Preço 8/14/16, Manutenção 8/10/12). Sem consistência visual entre HUB e sub-apps.\n\nAgora escala universal de 6 valores no :root do hub.css:\n• --t-radius-xs: 4px (badges, micro-tags, progress bars)\n• --t-radius-sm: 8px (inputs, buttons, chips)\n• --t-radius-md: 12px (cards, painéis pequenos)\n• --t-radius-lg: 16px (modais, painéis grandes)\n• --t-radius-xl: 20px (pills arredondadas grandes)\n• --t-radius-pill: 999px (pílulas totais)\n\nMigração: 212 substituições em 4 arquivos (hub.css 85, CRM 37, Preço 29, Manutenção 61). Mass replace conservador via regex específica em border-radius:Npx — round to nearest scale value.\n\nGanho: UI mais coerente entre os 4 apps. Manutenção futura mais fácil (vars semânticas em vez de magic numbers).'}
    ]
  },
  {
    v:'3.25.1', d:'19 abr 2026',
    items:[
      {type:'feat', title:'Logo Aurora revertido pro original (verde sólido).', desc:'A v3.25.0 trouxe o ícone "aurora" (dark com glow verde emergindo da base). Decisão revisada: voltar pro ícone original — quadrado verde Brand com símbolo F branco + ponto amarelo (v3.14.0). Mais leve visualmente, mais reconhecível, mais coerente com o resto da identidade Fiobras (minimalista verde+amarelo).\n\nReverteu:\n• PWA icons (192/512) — função _buildHubIcon volta pra versão simples (1 fillStyle)\n• Splash 120px, login brand 44px, sidenav logo 34px — quadrado verde sólido\n• Componente .aurora-icon mantido como classe (compat) mas estilo agora é verde sólido\n\nMantido:\n• Login glass (bg dark + card backdrop-filter) — fica\n• Splash bg dark — fica\n• Símbolo F + ponto amarelo intacto'},
      {type:'high', title:'CHANGELOG extraído pra changelog.js (lazy-loaded).', desc:'Antes: array CHANGELOG de ~95KB carregado em runtime no boot, mesmo pra quem nunca abre a Central de Atualizações. Agora: vive em /changelog.js separado, carregado via dynamic script tag SÓ quando user clica na pílula de versão. Promise cached. Cache do SW (v3.22.0) garante 2ª visita instantânea.\n\nGanho: -95KB do bundle JS principal (-50ms parse em mobile fraco).'},
      {type:'note', title:'Comments box-drawing do topo movidos pra CHANGELOG.md.', desc:'O comment ASCII bonito de 28KB no topo do index.html era inútil em runtime. Agora o histórico humano-readable vive em /CHANGELOG.md (raiz do repo). Topo do index.html ficou com 1 linha de pointer.\n\nGanho: -28KB do bundle inicial.'}
    ]
  },
  {
    v:'3.25.0', d:'18 abr 2026',
    items:[
      {type:'feat', title:'Modernização visual: ícone Aurora aplicado em todos os pontos da marca.', desc:'Substitui o fundo verde sólido por uma "aurora" — base dark com glow verde emergindo da parte de baixo do ícone. Símbolo Fiobras (F branco com ponto amarelo, introduzido v3.14.0) preservado em 100% dos lugares.\n\nOnde aparece:\n• Ícones PWA (192px e 512px) — função _buildHubIcon refatorada pra desenhar gradient + 3 radial gradients (glow verde principal, glow secundário, highlight branco) + símbolo F em cima\n• Splash screen do HUB (120px)\n• Brand block do login (44px)\n• Logo da sidenav desktop (34px com box-shadow simulando aurora)\n• Apple touch icon (mesmo manifest icon de 512px)\n\nFavicon (32px) mantém o símbolo verde original — em pixels tão pequenos o aurora não rende bem.\n\nReceita CSS reutilizável: .aurora-icon com 5 tamanhos (.aurora-xs/sm/md/lg/xl).'},
      {type:'feat', title:'Login Glass — tela de entrada redesenhada.', desc:'Background dark com aurora verde emergente da base. Card centralizado com backdrop-filter blur(24px) + saturate. Brand block "Fiobras HUB" com ícone aurora 44px ao lado.\n\nHierarquia interna:\n• Brand block (centralizado, ícone + nome)\n• Título "Entrar na sua conta" (Outfit 400 1.5rem)\n• Subtítulo "Acesso restrito · Fiobras Fios Tintos" (Poppins 300, muted)\n• Campo Usuário (dropdown estilo glass)\n• Campo Senha (slide-down condicional)\n• CTA "ENTRAR" verde com gradient + glow + uppercase letterspacing\n• Footer "Sistema interno · v3.25.0"\n\nLogin sempre dark independente do tema escolhido pelo user pós-login. Animações de boot (bg fade-in 0.4s + card slide-up 0.5s) respeitam prefers-reduced-motion.\n\nLógica de auth (SHA-256 + salt + Anonymous Auth + senha condicional + força-logout) intacta. Mudança 100% visual.'},
      {type:'feat', title:'Splash redesenhada com aurora 120px.', desc:'Mesma identidade do login: bg dark com glow + ícone aurora central + nome "Fiobras HUB" abaixo + barra de progresso minimalista verde animada.'}
    ]
  },
  {
    v:'3.24.0', d:'18 abr 2026',
    items:[
      {type:'feat', title:'Botão "Instalar app" no header (Chrome/Edge/Android).', desc:'Quando o app atende critérios PWA (já atende: SW + manifest + HTTPS), o navegador dispara beforeinstallprompt. Capturamos esse evento e revelamos botão verde "↓ Instalar app" no canto direito do header. Click → diálogo nativo de instalação. Aceita = botão some.\n\nMobile: botão vira ícone só (sem o texto), pra não competir com a pílula de versão.\n\niOS Safari: o evento beforeinstallprompt NÃO é disparado lá. Quando detecta Safari iOS + não-instalado, mostra botão que ao clicar abre tooltip educativo: "Toque em Compartilhar → Adicionar à Tela de Início". Tooltip mostra uma vez (flag em localStorage); usuário marca "Entendi" e some pra sempre.'},
      {type:'feat', title:'Dark mode automático respeita SO.', desc:'Antes: app sempre abria em light, exceto se user clicasse no toggle "Tema escuro". Agora respeita prefers-color-scheme do SO no boot — mas SÓ se user nunca tiver escolhido manualmente.\n\nLógica:\n• Tem fiobras-dash-theme no localStorage? Usa essa preferência (mantém comportamento atual pra usuários antigos).\n• Não tem? Usa prefers-color-scheme do SO como default.\n\nBonus: listener pra mudanças do SO em tempo real — se você muda o tema do macOS/Windows, o HUB acompanha (só se nunca escolheu manual). Toggle continua funcionando e vira fonte da verdade quando clicado.'}
    ]
  },
  {
    v:'3.23.2', d:'18 abr 2026',
    items:[
      {type:'feat', title:'audit-log + active-sessions viraram listeners lazy.', desc:'Antes esses 2 listeners do Firebase eram ativados no boot pra TODOS os usuários — mas só admin abre os painéis correspondentes. Desperdício de conexão WebSocket + bytes transferidos.\n\nAgora seguem padrão activate/deactivate:\n• abrirAuditLog() → window._activateAuditLog() → conecta\n• fecharAuditLog() → window._deactivateAuditLog() → desconecta\n• Mesmo padrão pro asModal (sessões ativas).\n\nGanho: -2 conexões WebSocket no boot, -7KB iniciais, -200ms em 4G ruim. Importante: audit-log cresce com o tempo (1 entry por ação) — adiar evita que esse peso encha pra usuários não-admin.\n\nNo total: dos 12 listeners do HUB, 10 ficam eager (justificados) e 2 ficam lazy.'}
    ]
  },
  {
    v:'3.23.1', d:'18 abr 2026',
    items:[
      {type:'feat', title:'Breakpoints unificados nos sub-apps (CRM, Preço, Manutenção).', desc:'Conclusão da migração iniciada em v3.23.0. Aplicada a mesma escala (360/480/640/768/1024) em CRM, Preço e Manutenção.\n\nMigrações:\n• CRM: 4 valores → 2 (520→480, 700→640) — 8 linhas alteradas\n• Preço: 5 valores → 2 (500→480, 600→640, 700→640, 900→1024, 1200→1024) — 8 linhas\n• Manutenção: 6 valores → 4 (380→360, 680→640, 700→640) — 3 linhas\n\nProjeto inteiro: 13 valores únicos → 5 valores. Manutenção muito mais simples agora.'}
    ]
  },
  {
    v:'3.23.0', d:'18 abr 2026',
    items:[
      {type:'feat', title:'Breakpoints unificados no css/hub.css (7 → 5 valores).', desc:'Antes o projeto tinha 13 breakpoints diferentes em 4 arquivos (hub.css + 3 sub-apps): 360, 380, 480, 500, 520, 600, 640, 680, 700, 768, 860, 900, 1200. Manutenção difícil.\n\nAgora escala universal de 5 valores: 360 (Galaxy A10/Android low-end) · 480 (mobile padrão) · 640 (phablet/landscape) · 768 (tablet portrait) · 1024 (desktop). Documentada em :root como CSS vars (--bp-xs/sm/md/lg/xl).\n\nMigração no hub.css:\n• 600 → 640 (40px pra cima — phablet)\n• 700 → 640 (60px — semantically MD)\n• 860 → 1024 (esconder pílula 3D ainda funciona)\n\nSub-apps (CRM/Preço/Manutenção) ficam pra v3.23.1 — split intencional pra você testar o HUB isolado primeiro. Pode ser que regras se ativem 40-60px antes/depois do que ativavam.'}
    ]
  },
  {
    v:'3.22.2', d:'18 abr 2026',
    items:[
      {type:'feat', title:'A11y: 16 modais agora têm role/aria/trapFocus + buttons icon-only ganham aria-label automaticamente.', desc:'Patch invisível pra quem usa mouse mas crítico pra quem usa screen reader (VoiceOver iOS / TalkBack Android / NVDA). 4 melhorias num init JS auto:\n\n1) initA11y() percorre todos .modal-bg e adiciona role="dialog" + aria-modal="true" + aria-labelledby (achando o título dentro). Aplica em runtime — não precisa editar 16 modais 1 por 1.\n\n2) Mesma função copia title="..." → aria-label="..." em todos os buttons icon-only sem aria. Re-roda a cada 3s pra capturar UI dinâmica (cards renderizados, popovers).\n\n3) Trap focus via MutationObserver: quando .modal-bg ganha .open ou display!=none, foca no 1º elemento interativo + trava Tab dentro do modal (Shift+Tab cicla). Quando fecha, libera.\n\n4) Bloco @media (prefers-reduced-motion: reduce) global em hub.css + 3 sub-apps. Animations e transitions viram instantâneas pra quem ativou "Reduzir movimento" no SO. Não desliga estados visuais (hover/focus continuam).'}
    ]
  },
  {
    v:'3.22.1', d:'18 abr 2026',
    items:[
      {type:'feat', title:'Chart.js carrega sob demanda (lazy-load).', desc:'Antes: ~80KB do Chart.js baixados no boot, bloqueando o parser por ~220ms — mesmo pra quem nunca abre Histórico nem Produção. Agora: tag <script> bloqueante removida do <head>. Helper loadChartJs() injeta dynamic script só quando alguém precisa. Promise é cached — múltiplas chamadas baixam 1 vez só.\n\nrenderCharts() (Histórico) e renderProducao() (Produção) viraram async + await loadChartJs() antes de usar new Chart().\n\nGanho: -220ms no FCP boot inicial (qualquer rede). Custo: 1ª abertura de Histórico ou Produção tem +220ms (uma vez só, depois cache do SW assume).'}
    ]
  },
  {
    v:'3.22.0', d:'18 abr 2026',
    items:[
      {type:'high', title:'PWA: Service Worker agora faz cache de verdade.', desc:'O SW antigo só tinha estratégia "Offline 503" — cada visita re-baixava ~1MB. Agora estratégia por tipo de recurso:\n• cache-first: fontes Google + Chart.js (CDNs estáticos)\n• stale-while-revalidate: hub.css + sub-apps HTML\n• network-first: index.html (pega versão nova quando online)\n• pass-through: Firebase RTDB (real-time, NÃO cacheia)\n\nResultado estimado: FCP de ~2.4s → ~0.9s em visita recorrente (~65% mais rápido). Funciona offline (app abre do cache, dados Firebase ficam congelados na última leitura).\n\nSW agora é arquivo físico (/sw.js) em vez de Blob URL — alguns browsers não permitem cache cross-fetch via Blob. Versionamento: cache name = fiobras-hub-v3.22.0. Cada bump invalida cache antigo automaticamente.'},
      {type:'feat', title:'Toast "Nova versão disponível · Atualizar".', desc:'Quando deploy novo é detectado pelo SW, aparece toast preto no rodapé: "Nova versão disponível [Atualizar]". Clica = manda SKIP_WAITING pro SW novo + reload automático. App pergunta a cada 30min se tem update.'},
      {type:'feat', title:'Toast online/offline.', desc:'Quando rede cai: chip laranja no topo "⚠ Você está offline · alterações ficam pendentes". Quando volta: chip verde "✓ Conectado" (some em 2.5s).'},
      {type:'high', title:'Inputs com font-size 16px global (anti-zoom iOS).', desc:'iOS dá zoom automático ao focar input com font-size < 16px — UX horrível em mobile. Vários campos no HUB (Timeline, Apontamento, Stats Cor, modais) e nos sub-apps (CRM, Preço, Manutenção) tinham 12-14px. Agora regra base "input, select, textarea { font-size: 16px }" em todos os 4 apps. Override só em desktop com mouse (pointer:fine + min-width:768px) pra manter densidade alta nos modais. Não causa zoom em Android (chrome respeita), só melhora touch target.'}
    ]
  },
  {
    v:'3.21.17', d:'17 abr 2026',
    items:[
      {type:'high', title:'Timeline: FIX bug crítico que apagava registros antigos.', desc:'Bug grave descoberto: a função _salvarTlFirebase usava set(tlRef, dados) — que SOBRESCREVE o nó inteiro do Firebase. Combinado com race condition no boot (Firebase onValue ainda não retornou + user já abre modal e salva), o tlDados em memória estava {} (vazio), aí o save mandava set(tlRef, {idNovo: evt}) e APAGAVA todos os registros antigos.\n\nFix: criadas duas funções novas — _salvarTlEvento(id, evt) usa update(child(tlRef, id), evt) que grava SÓ aquele registro sem tocar nos outros. _removerTlEvento(id) usa remove(child(tlRef, id)). O tlSave legacy fica como fallback mas não é mais usado.\n\nAtenção: registros antigos que sumiram não voltam (perdidos no Firebase). A partir de agora, novos saves não causam mais isso.'}
    ]
  },
  {
    v:'3.21.16', d:'17 abr 2026',
    items:[
      {type:'high', title:'CRM: fix aba "Histórico de atividades" (regressão grave).', desc:'A aba Histórico estava aparecendo vazia — nunca salvava nada. Causa: as funções logEvento(), renderHistoricoGlobal() e setLogFiltro() sumiram do código numa refactor antiga, mas as chamadas espalhadas por todo o CRM continuavam ali (novo lead, editar, mover etapa, excluir, importar CSV). Como logEvento nem existia, cada chamada falhava silenciosamente e nada chegava no Firebase.\n\nReimplementado: logEvento grava em crm/log via window._logPush. renderHistoricoGlobal lê o log, filtra (por tipo e busca), agrupa por data (Hoje / Ontem / DD de mês), monta cards com ícone da ação + descrição + detalhe + avatar do usuário + "há X min/h/d". setLogFiltro aplica o chip ativo.'}
    ]
  },
  {
    v:'3.21.15', d:'17 abr 2026',
    items:[
      {type:'feat', title:'CRM Pipeline: pacote estético inspirado no Excermol (A+B+C+D+F).', desc:'Cinco melhorias de uma vez no visual do pipeline:\n\n• A · header da coluna estilo pill: bullet colorido (●) + nome em Outfit 700 + count em chip DM Mono. Mais visual e organizado.\n\n• B · botão "+" no header de cada coluna: clica e cria lead direto NAQUELA etapa, com qual=quente já setado. Atalho útil que economiza cliques.\n\n• C · background sage (#F4F6F0) nas colunas. Cards continuam brancos. Dá hierarquia visual e separa cada lane do canvas.\n\n• D · KPI bar no topo do Pipeline: 4 métricas — leads em pipe, em proposta, fechados no mês corrente, tempo médio na etapa. Atualiza junto com o render.\n\n• F · avatar do responsável no footer do card (chip circular com gradient). Pega o último autor do histórico (quem mexeu por último). Cores dedicadas: William/Geovani verde, Jacques roxo, Suyanne laranja, Edilson azul, Joacir verde-água, admin preto.\n\nEmpty state também ficou mais bonito: "arraste um lead ou clique no +" em estado pontilhado quando coluna vazia.'}
    ]
  },
  {
    v:'3.21.14', d:'17 abr 2026',
    items:[
      {type:'high', title:'CRM: fix bugs do drag HTML5 nativo (3 de uma vez).', desc:'A v3.21.13 trouxe drag HTML5 mas tinha 3 bugs sutis:\n\n1. Quando user clicava no ícone de telefone/wa/email pra arrastar, o browser iniciava drag do <a> (link), não do card. Isso fazia o drag dar erro ou nem iniciar. Fix: dragstart só aceita se e.target é o próprio card; CSS desabilita drag nos filhos via -webkit-user-drag:none.\n\n2. dragleave disparava toda vez que o cursor passava entre cards filhos da coluna — fazia o highlight verde piscar feio. Fix: usa contador de dragenter/dragleave por zona (WeakMap), só remove highlight quando contador chega a zero.\n\n3. Drop em cima de outro card filho da coluna não era detectado direito porque o card interceptava. Fix: pointer-events:none nos filhos quando a coluna tá em drag-over.\n\nResultado: drag fluido sem flicker, funciona arrastando o card por qualquer área neutra (logo, nome, área central). Não dispara mais quando pega no telefone/wa.'}
    ]
  },
  {
    v:'3.21.13', d:'17 abr 2026',
    items:[
      {type:'high', title:'CRM: drag voltou a HTML5 nativo (desktop) + sem drag em mobile.', desc:'O sistema com Pointer Events ficou frágil — muito acoplado, edge cases difíceis. Voltei pro padrão do mercado: cada plataforma usa seu mecanismo nativo.\n\nDesktop: card tem draggable="true". Drag/drop tratado por dragstart/dragover/drop nativos via delegation no #pipeline. Click normal abre o modal — o browser distingue sozinho click vs drag, sem código custom. É como Trello/Linear funcionam.\n\nMobile: SEM drag (HTML5 drag não funciona em touch nativo, e Pointer Events virou bug). Tap abre o modal, botão ✈ é o ÚNICO jeito de mover. Detecção via matchMedia("(pointer:coarse)").\n\nResultado: ~70% menos código, zero conflito tap-vs-drag, comportamento previsível.'},
      {type:'feat', title:'CRM: tempo na etapa virou "·4d" discreto ao lado da empresa.', desc:'Antes era pill vermelha "4d na etapa" na meta line — chamava muita atenção. Agora vira só "·4d" em DM Mono cinza ao lado do nome da empresa. Limite de alerta subiu de 3 dias pra 7 dias (mais realista). A partir de 7d fica vermelho/bold pra sinalizar lead parado.'}
    ]
  },
  {
    v:'3.21.12', d:'17 abr 2026',
    items:[
      {type:'feat', title:'CRM: sempre abre na aba Pipeline (todos os usuários).', desc:'Antes a tela inicial era diferente por usuário: admin via Dashboard, Suyanne via Lista, Jacques via Pipeline. William pediu pra padronizar — todo mundo abre direto no Pipeline (que é onde a operação acontece). As outras abas continuam acessíveis pelo menu de cima, só não são mais a tela inicial.'}
    ]
  },
  {
    v:'3.21.11', d:'17 abr 2026',
    items:[
      {type:'high', title:'CRM: reestruturação completa da interação dos cards.', desc:'Versões anteriores tinham bugs sutis: o popover montava handlers via string de onclick (frágil), o drag system reanexava listeners a cada render (vazamento), e o fecha-popover usava setTimeout no listener de click que conflitava com o pointer system. Resultado: clicar numa etapa no popover às vezes não funcionava.\n\nReescrita: drag e popover agora têm regras claras e isoladas. Drag usa event delegation no container (idempotente — não reanexa). Popover usa data-action delegado dentro do próprio popover (sem onclick string). Fecha via pointerdown na fase de captura. Botão ✈ tem stopPropagation pra não disparar drag. Comportamento: tap rápido = abre lead; long-press touch ou click+drag mouse = drag; click no ✈ = popover; click numa etapa = move direto.'}
    ]
  },
  {
    v:'3.21.10', d:'17 abr 2026',
    items:[
      {type:'high', title:'CRM: clicar numa etapa no popover move direto.', desc:'Bug v3.21.8/.9: clicar em "Proposta Enviada" no popover abria OUTRO modal pedindo confirmação com observação opcional. User não percebia e achava que não tinha movido. Agora o clique move direto + registra "Movido de X para Y" no histórico automaticamente. Toast confirma. Mesmo comportamento pro drag (arrastar e soltar = move direto, sem modal). Exceção: arrastar pra "Perdido" abre o modal de motivo (necessário pra justificar a perda).'},
      {type:'feat', title:'Botão "mover" virou ícone paper plane (estilo Telegram).', desc:'Antes era pill com texto "→ Retorno feito". Agora é botão circular pequeno com ícone de avião de papel inclinado, na cor da etapa atual. Hover pinta sólido + leve translação. Mais clean, ocupa menos espaço, combina com a estética dos outros ícones de ação (telefone/wa/email).'}
    ]
  },
  {
    v:'3.21.9', d:'17 abr 2026',
    items:[
      {type:'high', title:'Fix CRM: drag com mouse não funcionava.', desc:'Bug do v3.21.8: o long-press de 280ms valia pra TODOS os tipos de input — incluindo mouse. Mas no desktop ninguém segura o card antes de arrastar, o user clica e move direto. Agora detecta pointerType: mouse arrasta imediato (a partir de 6px de movimento), touch/pen mantém long-press 280ms (necessário pra não conflitar com scroll vertical). Tap rápido continua abrindo o modal do lead.'}
    ]
  },
  {
    v:'3.21.8', d:'17 abr 2026',
    items:[
      {type:'feat', title:'CRM: card redesign clean + drag funciona em mobile.', desc:'Inspirado no Excermol. Estrutura nova: borda colorida só no topo + header com logo (iniciais) + nome em Outfit Black 900 + empresa abaixo. Tag de fibra (produto) como pill. Meta linha única com data + tempo na etapa (vermelho se >=3 dias parado). Footer com avatares de ação direta: 📞 tel:, 💬 wa.me, 📧 mailto: — clica e abre. Sem mais "label: valor" empilhado.'},
      {type:'feat', title:'Pill "→ próxima etapa" no canto do card.', desc:'Mostra qual é a próxima etapa direto no card (ex: "→ Retorno feito"). 1 clique avança. Clica de novo abre popover com TODAS as etapas + opção "Marcar como perdido". Estilo de tag pill (Poppins 500, soft background da cor da etapa).'},
      {type:'high', title:'Drag manual agora funciona em mobile (touch).', desc:'Antes o drag usava HTML5 drag-and-drop nativo via card-handle, que não funciona em touchscreen — só desktop. Agora usa Pointer Events: long-press 280ms em qualquer lugar do card ativa modo arrastar (visual: scale 0.97 + sombra). Solta sobre uma coluna pra mover. Tap rápido abre o modal do lead. Funciona igual em mouse, touch e pen.'}
    ]
  },
  {
    v:'3.21.7', d:'16 abr 2026',
    items:[
      {type:'feat', title:'CRM: cards do pipeline mais clean (linhas alinhadas).', desc:'Inspirado no estilo "Truth" que você mandou: header com nome maior em Outfit Black 900 + tag de fibra (produto) à direita como pill discreto. Body reorganizado em linhas tipo "label: valor" alinhadas (Empresa, Entrada, Telefone, Última interação) — mais arejado e fácil de bater o olho. Tag de tempo na etapa fica embaixo, separada. Botões de avançar etapa + perdido mantidos pra agilidade. Híbrido entre o card antigo cheio e o estilo cartão limpo do mockup.'}
    ]
  },
  {
    v:'3.21.6', d:'16 abr 2026',
    items:[
      {type:'high', title:'CRM: histórico de atividades não renderizava após salvar.', desc:'O addHist gravava no Firebase corretamente, mas não chamava renderHist após — então o user via o textarea limpar mas a interação não aparecia na lista. Aí parecia que tinha sumido / não salvou. Corrigido: addHist agora atualiza state local + re-renderiza imediato (sem esperar Firebase ecoar). Próxima abertura do lead já mostra o histórico atualizado.'},
      {type:'feat', title:'Nova etapa do pipeline: "Encam. p/ Representante".', desc:'Adicionada entre Proposta Enviada e Negociação. Cor da coluna: verde água (#0d8a6c). Aparece no kanban (desktop + mobile), no select de etapa do form de novo lead, no badge interno do card e no export CSV. PROX_ETAPA atualizado: proposta → representante → negociacao → fechado.'},
      {type:'high', title:'Preço de Venda: gate hardcoded admin-only.', desc:'O hubIntegration do /preco/index.html tinha if(sess.user !== "admin") que bloqueava qualquer user não-admin (incluindo Jacques que tinha permissão configurada no painel HUB). Corrigido — agora o gate só verifica se há sessão válida; quem chega no /preco/ já passou pelo canAccessModule do HUB que faz o controle granular.'}
    ]
  },
  {
    v:'3.21.5', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Painel admin: ver senha dos usuários + definir.', desc:'Cada linha da lista Gerenciar Usuários agora tem um botão de cadeado pra "Definir senha" (admin escolhe nova diretamente, sem precisar resetar e esperar o user fazer no próximo login). Quando user (ou admin via essa ação) define a senha, salva também em users-profile/{user}/senhaPlain além do hash. Aparece um chip da senha escondido por default + botão de olho ao lado do status — clica e revela. Útil pra recuperar senha esquecida sem ter que zerar e esperar. Audit log registra a ação. Reset apaga tanto hash quanto plain.'},
      {type:'high', title:'Login abre no primeiro módulo liberado.', desc:'Antes admin/gerente caíam em Gerencial e produção em Produção — mas se um user tivesse permissões customizadas (ex: só CRM), entrava na tela bloqueada do módulo padrão. Agora setupTabs consulta getEffectiveModules e abre no primeiro módulo realmente acessível: admin/gerente vai pra Gerencial se incluído (default), senão pega o primeiro liberado da lista. User só com CRM já abre direto no CRM.'},
      {type:'high', title:'CRM: botão "Registrar lead" sempre visível.', desc:'O botão estava no header interno do CRM, que escondi pelo override de visual padrão. Resultado: usuários do CRM (que não admin) não conseguiam adicionar leads novos. Solução: o FAB flutuante (#fabNovo, círculo verde no canto inferior direito) que antes só aparecia em mobile na view Lista, agora aparece sempre — qualquer view, qualquer tela. Botão único e simples.'}
    ]
  },
  {
    v:'3.21.4', d:'16 abr 2026',
    items:[
      {type:'high', title:'Tabs do Preço/Manutenção sumiam ao rolar — root cause real.', desc:'O problema não era CSS interno do sub-app. Era o WRAPPER do iframe no HUB: tinha min-height (não height fixo), então o iframe esticava até o conteúdo do sub-app inteiro. Quem rolava era a página principal do HUB — o iframe inteiro subia junto e o position:fixed interno seguia (porque é relativo ao iframe, que tava se movendo). CRM funcionava só porque o conteúdo dele cabia. Fix: panel-preco/crm/manutencao + .subapp-frame-wrap + .subapp-frame agora têm height:calc(100vh - 80px) FIXO + overflow:hidden no wrap. Resultado: o iframe ocupa exato o espaço disponível, scroll fica DENTRO dele, e tabs com position:fixed se ancoram no topo do viewport interno como esperado.'},
      {type:'note', title:'Mobile: 110px em vez de 80px.', desc:'Mobile tem topbar mais compacto + pílula flutuante embaixo, então o cálculo é calc(100vh - 110px) pra dar espaço aos dois.'}
    ]
  },
  {
    v:'3.21.3', d:'16 abr 2026',
    items:[
      {type:'high', title:'Tabs do Preço e Manutenção: move pro body via JS.', desc:'No CRM o position:fixed funcionou direto. No Preço e Manutenção alguma regra CSS interna ou pai com transform/overflow estava quebrando o fixed declarativo. Solução robusta: bootstrap de cada um agora move o elemento .tabs pro <body> direto via appendChild + aplica position:fixed inline. Garante que o "fixed" se ancore no viewport do iframe sem ancestor interferir.'}
    ]
  },
  {
    v:'3.21.2', d:'16 abr 2026',
    items:[
      {type:'high', title:'Sub-tabs do Preço/CRM/Manutenção: fixed em vez de sticky.', desc:'A tentativa anterior com position:sticky não estava funcionando dentro do iframe — o subheader sumia ao rolar mesmo. Mudei pra position:fixed com top:0 + body padding-top:46px pra compensar a altura. Mais previsível em qualquer browser/contexto. As abas internas agora ficam coladas no topo do iframe ao rolar pra baixo.'}
    ]
  },
  {
    v:'3.21.1', d:'16 abr 2026',
    items:[
      {type:'high', title:'Sub-tabs do Preço/CRM/Manutenção agora ficam sticky.', desc:'O subheader com as abas internas (Vendas/Tingimento/Preparação/Retorção/Custos/Histórico no Preço; Pipeline/Lista/Dashboard no CRM; Dashboard/Kanban/Histórico/etc. na Manutenção) sumia ao rolar a página pra baixo. Agora ele fica congelado no topo do iframe — quando você desce na lista/kanban, as abas continuam acessíveis sem precisar voltar pro topo. Aplicado nos 3 sub-apps com position:sticky;top:0;z-index:50; também garantido que html/body do iframe sejam o scroll container (overflow-y:auto).'}
    ]
  },
  {
    v:'3.21.0', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Novo role: Gerente.', desc:'Hierarquia de papéis agora tem 3 níveis: Administrador (você) > Gerente > Usuário. O Gerente tem acesso total a todos os módulos do HUB (Gerencial, Produção, Preço, Manutenção, CRM) e pode mexer em tudo dentro deles. A única coisa que NÃO pode é o painel administrativo: gerenciar usuários, editar permissões, resetar senhas e ver audit log/sessões ativas — isso continua exclusivo do Administrador. Útil pra delegar uso completo do sistema sem perder controle de quem entra e quem mexe em quem.'},
      {type:'high', title:'Labels friendly: Usuário / Gerente / Administrador.', desc:'O role interno "producao" continua igual no Firebase pra não quebrar dados antigos, mas a UI agora mostra "Usuário" em vez de "Produção" — fica mais claro que é o usuário comum, e abre espaço pro novo "Gerente". Painel "Gerenciar usuários" e topbar do user mostram o label friendly.'},
      {type:'note', title:'Visibilidade dinâmica do editor.', desc:'Quando você muda o role pra Administrador ou Gerente no painel Editar Usuário, a seção "Módulos liberados" some — eles têm acesso automático a tudo, então não faz sentido configurar. Aparece um aviso explicando: "Gerente tem acesso automático a todos os módulos. Não pode gerenciar usuários (só Administrador)". Ao voltar pra Usuário, a seção volta com os defaults.'},
      {type:'note', title:'Como aplicar agora.', desc:'Vai em Gerenciar usuários, abre Editar do usuário que deseja promover, escolhe Gerente, salva. Próximo login dele vai ter acesso ao HUB inteiro. Se quiser depois voltar pra Usuário comum, mesma coisa em ordem reversa.'}
    ]
  },
  {
    v:'3.20.5', d:'16 abr 2026',
    items:[
      {type:'high', title:'Editar/resetar usuário criado pela UI dava "Usuário inválido".', desc:'Os handlers abrirEditarUsuario, salvarEditarUsuario, abrirCriarUsuario e excluirUsuarioDinamico estavam consultando USERS[userKey] direto (só os hardcoded) em vez de getUser(userKey) que faz merge com users-config (criados via UI). Resultado: Jairo (ou qualquer outro user criado pela UI) caía no toast "Usuário inválido" ao tentar editar/resetar. Substituído pelos 4 handlers usarem getUser, que cobre os dois mundos.'},
      {type:'feat', title:'Botões "Marcar todos" e "Limpar" no editor de módulos.', desc:'No painel Editar Usuário, ao lado do label "Módulos liberados", aparecem 2 botões pequenos. "Marcar todos" libera os 5 módulos de uma vez (Gerencial / Produção / Preço / Manutenção / CRM); "Limpar" desmarca tudo. Útil pra usuários admin (marca todos) ou pra começar do zero. Defaults por role continuam sendo aplicados quando o user é criado.'}
    ]
  },
  {
    v:'3.20.4', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Stats Cor liberada pra todos do módulo Produção.', desc:'Antes Stats Cor tinha allowlist hardcoded (admin + Anderson + Aldo + Geovani + Lucivane). Agora qualquer usuário com acesso ao módulo Produção também acessa Stats Cor automaticamente — incluindo os líderes de turno (Adelir/Alexander/Djoniffer) que antes não viam. TAB_PERMS e RESTRICTED_TABS foram zerados; a seção "Abas restritas" do painel Editar Usuário some automaticamente quando não há abas restritas configuradas. Se algum dia precisar restringir alguma aba específica, basta popular o objeto RESTRICTED_TABS no código que a seção volta a aparecer.'}
    ]
  },
  {
    v:'3.20.3', d:'16 abr 2026',
    items:[
      {type:'high', title:'Backfill cores: registrante real é Geovani.', desc:'A v3.20.2 atribuiu admin como autor das cores antigas, mas quem cadastra cores no dia a dia da fábrica é o Geovani. Backfill v2 corrige: pra cada cor com criadoPor=admin (ou sem criadoPor), atribui geovani. Mesma coisa pro by do primeiro evento do histórico. Roda automaticamente quando você (admin) acessar o HUB pela próxima vez. Cores criadas a partir da v3.19.0 (com autor real gravado) não são afetadas.'}
    ]
  },
  {
    v:'3.20.2', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Backfill: cores antigas ganham autor.', desc:'Cores cadastradas antes da v3.19.0 (que introduziu o campo criadoPor) não tinham autor — então o avatar não aparecia no card. Agora um backfill one-shot atribui criadoPor=\'admin\' (e by:\'admin\' no primeiro evento do histórico) pra todas as cores que estão sem. Roda automaticamente no boot quando o admin abre o HUB pela primeira vez após a atualização. Flag em localStorage garante que só roda uma vez (se quiser re-rodar, apaga fiobras-backfill-cores-autor-v1 do localStorage). Resultado: cards antigos passam a mostrar a foto do admin como criador.'}
    ]
  },
  {
    v:'3.20.1', d:'16 abr 2026',
    items:[
      {type:'high', title:'Foto não aparecia no histórico priorizada/despriorizada.', desc:'O togglePrioridadeCor (v3.18.0) tava gravando `by: window._currentUserName` (que é o NOME de exibição, ex: "Admin") em vez de `by: getSession().user` (que é a CHAVE, ex: "admin"). O userChip esperava a chave pra buscar o profile/foto, então registros antigos do tipo by:"Admin" caíam em fallback de iniciais sem foto. Mesma coisa no Timeline (criadoPor) e Apontamento (by). Corrigido nos 3 lugares.'},
      {type:'high', title:'Fallback robusto pra registros legacy.', desc:'Adicionado helper _resolveUserKey que tenta achar a chave do usuário a partir do nome (case-insensitive) — primeiro pelo USERS hardcoded, depois pelo nomeCompleto do profile. Resolve registros antigos sem precisar de migração de dados. Se mesmo assim não achar, renderiza só com iniciais (sem foto, mas mostra o nome no tooltip).'}
    ]
  },
  {
    v:'3.20.0', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Avatares unificados em todo o HUB.', desc:'Todos os lugares que mostram usuário agora usam o mesmo helper userChip — Sessões Ativas e painel Gerenciar Usuários (que tinham o avatar próprio gu-row-av) passam a renderizar com o componente unificado. Resultado: quem tem foto cadastrada (Minha Conta) vê foto em qualquer lugar; quem não tem vê iniciais com gradient verde Fiobras (admin com gradient preto). Comportamento consistente: hover desktop = nome em tooltip, tap mobile = toast.'}
    ]
  },
  {
    v:'3.19.0', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Avatares no lugar de nomes em listas e cards.', desc:'Padrão Linear/Notion: nome de usuário em lista vira avatar pequeno (22px). No hover (desktop) aparece tooltip nativo com nome; no tap (mobile) toast curto. Cards ficam mais compactos e a identificação visual é mais rápida — você reconhece quem é por cor/foto antes de ler. Quando expande o card pra modal de detalhe, o nome continua visível por extenso ao lado do avatar.'},
      {type:'high', title:'Aplicado em 4 lugares.', desc:'(1) Card de Desenv. Cor: avatar do criador no canto direito do card. (2) Card de Timeline: avatar do autor substitui texto. (3) Modal de detalhe da Cor (histórico interno): cada ação agora tem avatar do autor ao lado da data. (4) Histórico de alterações do painel admin: avatar antes do nome em cada entrada do audit log.'},
      {type:'note', title:'Helper userChip(userKey, opts) central.', desc:'Função única reutilizável (em outros lugares onde precisar). Aceita size custom (default 22px). Usa foto do users-profile se cadastrada (Minha Conta), senão renderiza iniciais (até 2 letras) com gradiente verde Fiobras. Admin tem gradiente preto. Mobile clica = toast com nome.'},
      {type:'note', title:'Cor agora rastreia criador.', desc:'Antes a Cor não tinha campo criadoPor (só Timeline tinha). Agora ao cadastrar nova cor, salva criadoPor + entry by no histórico. Cores antigas (sem criador) mostram o card sem avatar — sem quebrar nada. Cada mudança de status (desenvolvida/enviada/aprovada/etc.) também grava o by, então o histórico interno tem rastreabilidade completa de quem fez o quê.'}
    ]
  },
  {
    v:'3.18.0', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Preço e CRM padronizados ao visual do HUB.', desc:'Mesma receita aplicada na Manutenção (v3.17.0): tokens light/dark sincronizados (sage clarinho #EDF1EA / Apple style), tipografia Outfit Black 900 nos números principais, tabs internas em DM Mono uppercase, cards/buttons/inputs com border-radius do padrão HUB (14px cards, 8px controles), inputs com font-size 16px em mobile (anti-zoom iOS). Os 3 sub-apps agora têm visual consistente entre si e com o resto do HUB.'},
      {type:'high', title:'Iframe estica até o final (sem espaço vazio embaixo).', desc:'Os panels Preço/CRM/Manutenção tinham um espaço chato embaixo do iframe — o min-height usava 100vh que não considerava o topbar+padding do shell. Reescrito com flex: o panel vira flex-column, o wrap do iframe pega flex:1, e o iframe estica naturalmente pra preencher o que sobrou do .main-col. Resultado: bottom do sub-app encosta no bottom do HUB.'},
      {type:'feat', title:'Desenv. Cor: prioridade.', desc:'Toggle de estrela (amarela quando ativa) ao lado do código de cada cor na lista. Cor priorizada sobe pra topo da lista (ordenação: prioritárias abertas → demais abertas → fechadas, mantendo a data de entrada como tiebreaker). Cor com prioridade ganha borda esquerda amarela e box-shadow sutil amarelo. Toggle disponível pra admin + produção. Não-priorizadas e cores aprovadas/canceladas não aparecem como priorizadas (mesmo que tenham o flag) — uma vez fechadas, prioridade perde sentido. Histórico do registro grava a ação (priorizada/despriorizada) com data e usuário pra auditoria.'},
      {type:'note', title:'Cache-buster CSS bump pra 3.18.0.', desc:'Atualizado pra forçar reload do hub.css que tinha ficado em ?v=3.14.0 desde o último release de identidade visual. Necessário pros estilos novos do iframe stretch e da estrela de prioridade aparecerem.'}
    ]
  },
  {
    v:'3.17.0', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Manutenção: visual completo no padrão HUB.', desc:'O sub-app de Manutenção rodava com visual próprio (paleta levemente diferente, fonte, bordas). Agora os tokens CSS interno são sobrepostos pra usar exatamente os mesmos do HUB: bg sage clarinho #EDF1EA no light, Apple style (#1C1C1E/#2C2C2E/#3A3A3C) no dark; fontes Outfit/Poppins/DM Mono nos lugares certos; border-radius 14px nos cards, 8px nos botões e inputs; tabs internas em DM Mono uppercase como o HUB.'},
      {type:'high', title:'Outfit Black 900 nos KPIs e títulos.', desc:'Valores grandes do Dashboard interno do Manutenção (total de demandas, em andamento, etc.) e títulos de seções agora usam Outfit weight 900 com letterspacing -.015em — mesma presença visual de display dos KPIs do Gerencial e Stats Cor do HUB.'},
      {type:'note', title:'Cores semânticas preservadas.', desc:'Tudo o que tinha cor com significado funcional foi mantido como estava: vermelho/amarelo/verde das tags Alta/Média/Baixa, azul/verde dos tipos Mecânica/Elétrica, bullets das colunas Kanban (A fazer, Em andamento, Concluído). Só o "chrome" (paleta de fundo, fontes, bordas, espaçamentos) virou padrão HUB.'},
      {type:'note', title:'Mobile: anti-zoom iOS aplicado.', desc:'Inputs do Manutenção em mobile agora usam font-size:16px (regra do HUB §6.1) — Safari/iOS não dá mais zoom automático ao focar campos. Container interno respeita padding-bottom:96px pra não esconder conteúdo atrás da pílula flutuante de navegação.'}
    ]
  },
  {
    v:'3.16.0', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Migração de Firebase: fiobras-preco → fiobras-hub.', desc:'Projeto Firebase trocado pra refletir o nome real do produto. Dados completos exportados via JSON do projeto antigo (fiobras-preco) e importados no novo (fiobras-hub) — zero perda. Config atualizada nos 4 arquivos: HUB (index.html), Preço (preco/index.html), CRM (crm/index.html), Manutenção (manutencao/index.html + firebase-messaging-sw.js do FCM). URL nova do banco: https://fiobras-hub-default-rtdb.firebaseio.com.'},
      {type:'note', title:'O que NÃO mudou.', desc:'Login user+senha custom continua igual. Anonymous Auth continua sendo usado pelas rules. Estrutura de paths (metas-2026, cores-2026, crm/, manutencao/, etc.) idêntica. Pra usuário final é transparente — só o nome do projeto no console do Firebase mudou.'},
      {type:'note', title:'Projeto antigo fica como backup.', desc:'O fiobras-preco continua existindo no Firebase Console com os dados intactos. Nenhuma escrita nova vai mais pra ele. Se quiser deletar pra economizar inventário no console, pode (Project Settings → Geral → Delete project), mas não tem custo manter parado. Recomendo manter por algumas semanas como backup, depois exclui.'}
    ]
  },
  {
    v:'3.15.0', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Banco de dados protegido com Firebase Anonymous Auth.', desc:'Antes o banco fiobras-preco estava em "test mode" com rules abertas e prazo de expiração — qualquer um com o URL conseguia ler/escrever. Agora o HUB e os 3 sub-apps (Preço, CRM, Manutenção) chamam signInAnonymously() ao iniciar; isso dá um UID Firebase ao browser. As rules do banco passam a exigir auth != null pra ler ou escrever — quem tentar acessar o URL direto fora do app é bloqueado pelo Firebase. Login do HUB (user + senha custom) NÃO mudou — a auth anônima do Firebase é puramente técnica, transparente pro usuário.'},
      {type:'high', title:'Como aplicar as rules no Firebase Console.', desc:'Arquivo firebase-rules.json no repo tem o conteúdo a copiar. Passo a passo: (1) Abrir Firebase Console → Realtime Database → aba "Regras". (2) Apagar tudo que tá lá. (3) Colar o conteúdo do firebase-rules.json. (4) Clicar Publicar. Pronto. O acesso ao banco direto via URL passa a ser bloqueado, mas o HUB e sub-apps continuam funcionando porque cada um faz signInAnonymously antes das primeiras operações.'},
      {type:'note', title:'Roadmap futuro.', desc:'Anonymous Auth dá um UID por dispositivo (renova a cada limpeza de cache), então não dá pra escrever rules tipo "só o admin escreve em /audit-log". Pra granularidade real precisaria Firebase Auth com email/senha (custom claims). Por agora é o suficiente — bloqueia bots e curiosos com a URL, sem atrapalhar o login custom.'}
    ]
  },
  {
    v:'3.14.0', d:'16 abr 2026',
    items:[
      {type:'feat', title:'Nova identidade visual: símbolo F com ponto amarelo.', desc:'Marca da Fiobras HUB redesenhada — letra F com o braço do meio substituído por um círculo amarelo (conceito "F + hub"). 3 symbols novos no defs SVG: i-fiobras-symbol (verde sobre fundo claro), i-fiobras-symbol-inv (branco sobre fundo verde, pra usar em sidenav/splash), i-fiobras-mark (símbolo dentro do quadrado verde com cantos arredondados, pra ícones grandes).'},
      {type:'high', title:'Aplicações: sidenav, splash, login, favicon, PWA.', desc:'Sidenav: o quadradinho verde no topo agora exibe a versão invertida do símbolo (F branco + ponto amarelo) em vez do texto "F". Quando expandida, "Fiobras" em Outfit 600 + "H U B" em Outfit 300 com letterspacing 3px (verde). Splash e login: marca composta (símbolo + Fiobras + HUB) centralizada. Favicon: SVG inline via data URI no <link rel="icon">. Apple touch icon: idem. Ícones PWA 192/512 são gerados em runtime via canvas a partir das proporções oficiais do símbolo (rect vertical, rect horizontal, círculo amarelo) — não dependem mais de PNG estáticos.'},
      {type:'note', title:'Manifest: nome PWA ajustado pra "Fiobras HUB".', desc:'O manifest tinha name="Fiobras Dashboard" e short_name="Dashboard" desde o nome legado. Agora name="Fiobras HUB" e short_name="HUB", e background_color do splash do PWA mudou pra verde (#008835) pra combinar com a identidade.'}
    ]
  },
  {
    v:'3.13.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'+7 usuários (manutenção e CRM).', desc:'Adicionados ao USERS hardcoded: Hernandes, Vorlei, Pedro, Ivonei e Roland (técnicos da equipe de manutenção, vindos do app standalone williamscchulz-was/manutencao) + Jacques e Suyanne (equipe comercial, vindos do app fiobras-crm). Total agora: 1 admin + 16 produção. Todos entram com role producao default e sem senha — no primeiro login disparam o popup de definir senha. O admin (William) configura permissões granulares depois pelo Editar.'},
      {type:'feat', title:'Sessões ativas com força logout remoto.', desc:'Novo botão de pessoas no header do painel admin abre o modal "Sessões ativas". Mostra todos os usuários com login ativo (heartbeat enviado a cada 60 segundos pro path active-sessions/{user}). Mostra plataforma detectada (Android/iPhone/iPad/Windows/macOS/Linux) e quanto tempo desde o último ping. Botão "Forçar logout" em cada user que não seja você mesmo: marca um flag em force-logout/{user} com timestamp; o cliente do alvo, no próximo check, vê que o flag é mais recente que o início da sessão e desloga sozinho com aviso. Saída pela aba também limpa a sessão (beforeunload).'},
      {type:'feat', title:'Filtros no histórico de alterações.', desc:'Modal "Histórico" agora tem 3 selects no topo: por usuário (todos/Admin/Anderson/...), por ação (Criar/Excluir/Editar/Resetar/Definir), por período (Tudo/24h/7d/30d). Filtros combinam — escolhe os 3 e a lista fica enxuta. Útil quando o log crescer (atualmente 100 entries no max).'},
      {type:'note', title:'Paths Firebase novos.', desc:'active-sessions/{user} = { lastSeen, userAgent, startedAt }. force-logout/{user} = { ts }. Heartbeat só roda enquanto a aba está aberta. Se a aba fecha de forma anormal (crash, kill), a entry de active-sessions vai expirar naturalmente quando passar dos 5 minutos do filtro de "ativo".'}
    ]
  },
  {
    v:'3.12.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Criar e excluir usuários direto pela UI.', desc:'No painel "Gerenciar usuários" agora tem um botão verde "+ Novo" no topo. Abre modal pedindo chave (login lowercase, sem espaços), nome de exibição e role (Produção/Administrador). Usuário criado entra sem senha — no primeiro login dele aparece o popup de definir senha. Permissões granulares (módulos/abas) são configuradas depois pelo botão Editar (lápis). Os usuários dinâmicos aparecem com um botão de lixeira vermelho ao lado dos botões padrão; os 11 hardcoded (admin + produção originais) NÃO podem ser excluídos pra preservar referências em registros antigos.'},
      {type:'high', title:'Login dropdown agora é dinâmico.', desc:'Antes o select da tela de login tinha 5 options hardcoded (Admin/Anderson/Aldo/Geovani/Lucivane). Agora é populado em runtime com TODOS os usuários (USERS hardcoded + dinâmicos do Firebase users-config). Lista é ordenada com Admin no topo e o resto alfabético por nome. Edilson, Joacir e os 3 líderes de turno (Adelir/Alexander/Djoniffer) que estavam ausentes da seleção agora aparecem.'},
      {type:'feat', title:'Audit log: histórico de ações administrativas.', desc:'Tudo que admin faz no painel agora vira registro no path audit-log do Firebase (timestamp + quem + ação + alvo + detalhes). Coberto: criar usuário, excluir usuário, editar permissões (role/turno/módulos/abas), resetar senha de outro usuário, e definir senha do próprio user no primeiro login. No header do painel "Gerenciar usuários" tem um botão de relógio que abre o modal "Histórico de alterações" com as últimas 100 entradas, ordenadas por mais recente.'},
      {type:'note', title:'Path Firebase novo.', desc:'users-config/{key} guarda os users criados via UI (pronto pra acesso de leitura via getAllUsers helper que faz merge com USERS hardcoded). audit-log/{ts_id} é append-only — cada entrada é um id único (al_<ts>_<rand>) com chaves ts/by/action/target/details. Limpeza periódica do log fica pra evolução futura (não é crítico — Firebase RTDB aguenta).'}
    ]
  },
  {
    v:'3.11.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Permissões por aba editáveis na UI.', desc:'Painel "Editar usuário" ganha uma seção "Abas restritas" com checkboxes pra cada aba que tem acesso limitado. Hoje a única é "Stats Cor (Produção)" — o admin marca/desmarca pra cada user e a permissão é aplicada no próximo login dele. Quando uma nova aba precisar de restrição (ex: Lançar Mês, Histórico Plurianual, etc.), basta adicionar uma entry em RESTRICTED_TABS no código e ela aparece automaticamente no painel.'},
      {type:'high', title:'tabsAllowedOverride no profile.', desc:'Novo campo: users-profile/{user}/tabsAllowedOverride = { tabName: bool }. canAccessTab consulta primeiro o override; se não existir, cai no TAB_PERMS hardcoded como fallback. Admin tem bypass automático (sempre acessa abas restritas — proteção contra trancar a si mesmo no painel). Mantém retrocompatibilidade: se nada configurado, comportamento idêntico à v3.10.x.'},
      {type:'note', title:'Quando precisar de aba nova restrita.', desc:'Adiciona em RESTRICTED_TABS no JS (ex: relatorios:"Relatórios"). A aba aparece no checkbox section do modal e o admin distribui acesso. Sem necessidade de alterar TAB_PERMS hardcoded — o tabsAllowedOverride do profile cobre.'}
    ]
  },
  {
    v:'3.10.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Permissões editáveis na UI (admin only).', desc:'Cada linha do painel "Gerenciar usuários" agora tem um botão de lápis (editar). Abre um modal com 3 controles: tipo de acesso (Produção/Administrador), turno (Nenhum/1/2/3 — só serve pro Apontamento) e checkboxes dos 5 módulos (Gerencial, Produção, Preço, Manutenção, CRM). Marque os que esse user enxerga; os não marcados ficam com cadeado pra ele. Mudanças entram em vigor no próximo login do usuário (não muda a sessão atual dele).'},
      {type:'high', title:'Sistema de overrides via Firebase.', desc:'Os campos novos vivem em users-profile/{user}: roleOverride (string), turnoOverride (number ou null), modulesAllowedOverride (array de modules). Helpers getEffectiveRole/Turno/Modules consultam os overrides primeiro, fallback pro USERS hardcoded. canAccessModule passou a usar getEffectiveModules — agora o cadeado dos módulos respeita o que o admin configurou. doLogin e showSplash usam getEffectiveRole pra decidir o role da sessão atual.'},
      {type:'note', title:'Defaults preservados.', desc:'Se o admin não configurou nada, cada user mantém o role/turno/modulos default que veio do USERS hardcoded (admin vê tudo, produção vê producao+manutencao+crm). Configuração só sobrepõe quando explicitamente setada. Reverter pra default = limpar os campos override no Firebase (futuro: botão "Restaurar padrão" no modal).'},
      {type:'note', title:'Próxima evolução.', desc:'Permissões granulares por aba (TAB_PERMS — hoje só Stats Cor é restrita por allowlist hardcoded) também passarão pro painel admin numa próxima versão. Mesmo padrão: array no profile, helper canAccessTab consulta override.'}
    ]
  },
  {
    v:'3.9.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Edilson e Joacir adicionados como usuários.', desc:'Dois usuários novos no HUB com role `producao` (sem turno). Passam a ver Produção, Manutenção e CRM por padrão; Gerencial e Preço bloqueados (cadeado), a definir granular depois. Total de usuários sobe pra 11 (1 admin + 10 produção).'},
      {type:'feat', title:'Popup obrigatório "Definir senha" no primeiro login.', desc:'Quando um usuário entra e ainda não tem senha cadastrada (USERS.senha=null e sem senhaHash no profile), aparece automaticamente um modal pedindo pra criar uma senha de pelo menos 4 caracteres. Sem botão de cancelar — é obrigatório seguir. A senha é salva como SHA-256 + salt no path users-profile/{user}/senhaHash. Nos próximos logins, esse user passa a precisar da senha.'},
      {type:'high', title:'Painel "Gerenciar usuários" no dropdown do admin.', desc:'No dropdown do user (canto superior direito), o admin agora vê uma opção nova: "Gerenciar usuários". Abre um modal com a lista dos 11 usuários do HUB — cada linha mostra avatar, nome, role/turno, status da senha (fixa/definida/sem senha) e um botão "Resetar senha". Resetar = apaga senhaHash do Firebase, e no próximo login do usuário o popup de definir senha aparece de novo. Ferramenta pra quando alguém esquece a senha ou pra forçar troca por motivo de segurança.'},
      {type:'note', title:'Próximo: permissões granulares.', desc:'A partir do painel atual, próxima evolução é permitir editar `role` e `turno` de cada user, e adicionar permissões granulares por aba (TAB_PERMS) editáveis na UI ao invés de hardcoded no JS. Por enquanto, mudança de role/turno continua via edição do USERS no index.html.'}
    ]
  },
  {
    v:'3.8.2', d:'15 abr 2026',
    items:[
      {type:'high', title:'Manutenção: admin só via Dashboard e Kanban (sem Preventiva, Máquinas, Histórico, Relatórios).', desc:'No app standalone do Manutenção, o select de login tem opção com value `__admin__` (que internamente o doLogin mapeia pra USERS.admin). Meu bootstrap setava `sel.value = "admin"` direto — como `admin` não é um value válido em nenhuma <option>, o browser silenciosamente vira `value = ""` (string vazia). Aí o doLogin abortava no primeiro check `if (!sel)` e nunca chegava a marcar `body.is-admin`, que é justamente o que faz o CSS revelar as abas admin-only (Preventiva/Máquinas/Histórico/Relatórios). Corrigido pra usar `__admin__` no value e tudo libera.'}
    ]
  },
  {
    v:'3.8.1', d:'15 abr 2026',
    items:[
      {type:'high', title:'Manutenção: splash azul cobrindo tudo + tela não abria.', desc:'Dois bugs conjugados na v3.8.0. Primeiro: o splash interno (fundo azul "Fiobras MANUTENÇÃO" com loading bar) não tava escondido — visualmente fora do padrão HUB e cobrindo o app por 2.5s mesmo logado. Segundo, mais grave: meu script Python que adapta o HTML usava regex non-greedy pra achar o <body>...</body>, e o manutencao.html original tem `</body>` literal dentro de uma string JS (usado pra gerar HTML de QR code via window.open). Resultado: meu bootstrap foi injetado NO MEIO de uma string JS, quebrando todo o JS subsequente. Agora regex usa rfind() pra pegar o ÚLTIMO </body> (o real), bootstrap fica no lugar certo. CSS extra: #app{display:block!important} defensivo caso doLogin trave em algum init de FCM/notif.'}
    ]
  },
  {
    v:'3.8.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Manutenção ativa dentro do HUB.', desc:'Sistema de Manutenção (antes WIP, repo williamscchulz-was/manutencao) agora vive em /manutencao/index.html e é embutido via iframe no panel-manutencao do HUB. Todas as views internas (Dashboard, Kanban, Histórico, Preventivas, Peças, Máquinas) funcionam como o app standalone original. Mesmo Firebase project (fiobras-preco), mesmos paths (manutencao/kanban, manutencao/pecas, manutencao/preventivas, etc.) — zero migração de dados.'},
      {type:'high', title:'FCM (push notifications) preservado.', desc:'O firebase-messaging-sw.js (service worker pra push) foi copiado pra /manutencao/ junto com o index.html. Quando alguém abre o módulo Manutenção pela primeira vez, o browser pede permissão de notificação e registra o token FCM no path manutencao/fcmTokens. O Cloudflare Worker que dispara as pushes continua funcionando exatamente como antes.'},
      {type:'high', title:'Shell interno escondido + bootstrap simulando login.', desc:'O .header verde do app standalone fica display:none (HUB já tem topbar). A login-screen é escondida e o bootstrap chama doLogin() programaticamente: seleciona "admin" no dropdown interno do app, preenche a senha "admin" e dispara o fluxo normal — state.user/isAdmin setados, abas filtradas por permissão, FCM inicializado, etc. Resultado: a abertura do módulo é instantânea, sem login extra.'},
      {type:'note', title:'Mapeamento de usuário simples por enquanto.', desc:'Todos os HUB users que entram em Manutenção viram "Admin" do app interno (acesso total). Manutenção tem 7 usuários internos (admin/joacir/hernandes/vorlei/pedro/ivonei/roland) com permissões diferentes — granularidade HUB→Manutenção pode vir depois (ex: HUB william=joacir admin, demais=hernandes técnico). Por agora, simples e funcional.'}
    ]
  },
  {
    v:'3.7.1', d:'15 abr 2026',
    items:[
      {type:'feat', title:'CRM: corte temporal — só leads de 2026 em diante.', desc:'Pipeline (kanban) e Dashboard (KPIs/contadores) agora só consideram leads com data >= 01/01/2026. Os antigos continuam intactos no Firebase, mas saem da operação ativa — viram histórico. A Lista de leads mantém o catálogo completo, incluindo pre-2026, pra você poder consultar quando precisar (ex: quem foi cliente em 2025, contato antigo, etc.).'},
      {type:'note', title:'Como funciona internamente.', desc:'Adicionada constante CRM_CUTOFF_TS = 01/01/2026 e helper leadsAtivos() que filtra window._leads pelo campo `data` (timestamp ms). renderPipeline() e renderDashboard() leem do helper; renderLista() lê do raw window._leads. Reversível: se quiser voltar a tratar pre-2026 algum dia, é só mudar a constante.'}
    ]
  },
  {
    v:'3.7.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Sidebar com toggle expand/collapse.', desc:'A sidebar lateral (desktop) agora alterna entre dois estados: colapsada (68px, só ícones — padrão) e expandida (232px, com nomes dos módulos visíveis ao lado dos ícones). Botão de toggle vive no header da sidebar — quando colapsada, fica centralizado (ocupa o lugar do logo, que esconde com fade); quando expandida, vai pra direita, lado a lado com logo + brand "Fiobras HUB". Click-to-toggle (sem hover-to-expand). Estado persistido em localStorage (key fiobras-hub-sidebar-expanded), então o usuário escolhe uma vez e fica.'},
      {type:'high', title:'Itens lockados ganham apresentação melhor quando expandidos.', desc:'Em modo colapsado, módulos lockados (ex: Gerencial pra produção) mostram um pin de cadeado pequeno no canto superior direito do botão. Em modo expandido, esse cadeado vira um ícone normal alinhado à direita do nome — fica óbvio que tá bloqueado e por quê, sem visual de badge espremido. Tooltips são desabilitados quando a sidebar está expandida (nome já aparece).'},
      {type:'note', title:'Mobile inalterado.', desc:'A pílula flutuante v2.5.0 continua sendo a navegação mobile. Sidebar tem display:none em ≤640px (já era assim). Toggle só funciona em desktop, por design.'},
      {type:'note', title:'Versão no rodapé da sidebar.', desc:'Quando expandida, mostra "v3.7.0" discreto no rodapé (DM Mono, muted). Mais um ponto pra confirmar qual versão tá rodando sem precisar abrir o histórico.'}
    ]
  },
  {
    v:'3.6.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Sistema de tags semânticas com 8 variantes.', desc:'Implementado o componente .tag com 8 modificadores definidos em CSS tokens: success (verde), warning (amarelo), info (azul), submitted (roxo), review (mostarda), danger (vermelho), neutral (cinza esverdeado), brand (verde Fiobras suave). Cada variante tem par de tokens bg/fg adaptados pra light e dark, garantindo contraste consistente. .tag e .tag--sm para densidades diferentes (lista vs card resumido). Componente reutilizável em qualquer status/badge novo do HUB.'},
      {type:'high', title:'Desenv. Cor: badges de status migrados.', desc:'Cada estado da pipeline de cor (Entrada, Desenvolvida, Enviada, Em Ajuste, Aprovada, Cancelada) agora usa o componente .tag com a variante semântica correta + ícone à esquerda — Entrada (warning + alert-triangle), Desenvolvida (info + loader), Enviada (submitted + paper-plane), Em Ajuste (review + eye), Aprovada (success + badge-check), Cancelada (danger + x-circle). STATUS_CONFIG ganhou os campos `variant` e `icon` mantendo `cor`/`bg` pra retrocompat com o histórico timeline interno.'},
      {type:'feat', title:'+8 ícones na biblioteca SVG.', desc:'alert-triangle, loader, paper-plane, eye, badge-check, x-circle, info, check — todos no mesmo padrão Lucide-style (line stroke 1.5 round, fill none, currentColor). Ficam disponíveis pra usar em qualquer tag ou contexto.'},
      {type:'note', title:'Próxima frente.', desc:'v3.7.0 vai adicionar toggle expand/collapse na sidebar (64px ↔ 240px com nomes dos módulos visíveis quando expandida). Persiste no localStorage. Mobile mantém a pílula flutuante.'}
    ]
  },
  {
    v:'3.5.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Tipografia display: Outfit Black 900.', desc:'A Outfit já estava no stack, mas só usávamos até weight 800. Agora a 900 (Black) entra nos lugares de display: nome do usuário no dropdown, brand "F" da sidebar, valores de KPI, login hero e splash. Stack ganha presença de produto polido sem precisar de fonte nova. Letter-spacing negativo (-.01em a -.02em) ajuda em tamanhos grandes pra não parecerem soltos. Aplicado pontualmente — botões, sub-tabs, labels e corpo continuam Poppins, e tags ficam Poppins 500 como antes.'},
      {type:'feat', title:'Biblioteca de ícones unificada.', desc:'Criado um <svg defs> único no topo do body com 17 ícones SVG <symbol> da família Lucide-style: line stroke 1.5 round, fill none, currentColor. Acesso via <svg class="icon"><use href="#i-..."/></svg>. Sidebar (5 módulos + histórico), pílula mobile (5 módulos), topbar (theme toggle + caret) e dropdown do user (4 itens) migrados pro novo padrão. Resultado: menos KB de SVG inline duplicado e visual coeso entre todos os ícones.'},
      {type:'note', title:'Classe .icon com tamanhos canônicos.', desc:'.icon (18px), .icon.sm (14px stroke 1.75), .icon.xs (12px stroke 1.75), .icon.lg (22px). Contextos específicos (sidenav-item, mnav-ic, etc.) podem fazer override de tamanho via CSS. Stroke-width sobe ligeiramente em ícones pequenos pra manter legibilidade.'},
      {type:'note', title:'Próximas frentes do refinamento visual.', desc:'v3.6.0 vai trazer o sistema de tags semânticas (8 variantes: success/warning/info/submitted/review/danger/neutral/brand) generalizando o padrão da Timeline pro HUB todo. v3.7.0 adiciona toggle de expand/collapse na sidebar (64px ↔ 240px com nomes dos módulos visíveis). Cada uma vira commit isolado, sem bundlar.'}
    ]
  },
  {
    v:'3.4.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'CRM ativo dentro do HUB.', desc:'O sistema de CRM (antes WIP, repo williamscchulz-was/fiobras-crm) agora vive em /crm/index.html e é embutido via iframe no panel-crm do HUB. Todas as views internas (Dashboard, Pipeline, Lista de clientes) funcionam como no app standalone — zero migração de dados porque o Firebase project (fiobras-preco) e os paths (crm/clientes, crm/leads, crm/log) são os mesmos.'},
      {type:'high', title:'Shell interno do CRM removido, tema sincronizado.', desc:'Mesma receita da Preço: .header interno + splash + loginScreen escondidos via override <style>. Tabs do CRM grudam no topo do iframe. Tema lê fiobras-dash-theme do HUB e escuta postMessage pra mudanças em tempo real. Cache-buster ?v=CURRENT_VERSION na src do iframe.'},
      {type:'note', title:'Mapeamento de usuário: HUB → CRM admin.', desc:'Por enquanto todo HUB user que entra no CRM vira "CRM admin" (com acesso total). O CRM original tinha 3 perfis internos (admin/jacques/suyanne) com permissões diferentes. Mapeamento granular HUB→CRM pode vir depois — basta estender o bootstrap se quiser diferenciar views iniciais ou permissões.'},
      {type:'note', title:'WIP removido do módulo CRM.', desc:'Sidenav e header desktop não mostram mais badge/lock. Acesso liberado pra todos os usuários do HUB. Se quiser restringir depois, é só adicionar regra em canAccessModule.'}
    ]
  },
  {
    v:'3.3.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Timeline: filtro por tag.', desc:'Agora acima do feed da Timeline aparece uma barra de pílulas (Todas / Desenvolvimento / Problemas / Melhorias / +custom). Tap na pílula filtra o feed pra mostrar só registros daquela tag. Tap de novo na mesma pílula volta pra "Todas". As pílulas mostram a cor da tag quando ativas e um contador de registros embutido. Tags sem registro são escondidas automaticamente pra não poluir.'},
      {type:'high', title:'Contador de registros ao lado do título.', desc:'Quando a Timeline está sem filtro, aparece "12 registros" (ou "1 registro") ao lado do título. Quando filtrado, mostra "3 de 12" — fica claro quantos registros batem com a tag ativa vs o total. Ajuda a navegar quando a base crescer.'},
      {type:'note', title:'Empty state específico pra filtro.', desc:'Se aplica um filtro e não bate nada, a mensagem vazia muda pra "Nenhum registro com essa tag · Tente outra tag ou toque em Todas" em vez do genérico. Sutileza mas guia o usuário pra voltar ao estado completo.'}
    ]
  },
  {
    v:'3.2.1', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Breadcrumb padronizado: HUB › Módulo.', desc:'Antes o crumb mostrava "Módulo › Aba" (ex: "Preço de Venda › Preço", "Produção › Cor"). Agora mostra "HUB › Módulo" sempre — mais simples, mais limpo e mais consistente com apps tipo Nubank/SaaS modernos. Abas ativas continuam visíveis via underline verde no tab-bar pra quem está em Gerencial ou Produção. O "HUB" na esquerda fica muted e o nome do módulo na direita é o destaque.'},
      {type:'high', title:'Iframe-modules escondem tab-bar.', desc:'Preço, CRM e Manutenção são módulos que vivem dentro de iframes e têm sua navegação interna própria. A barra de "1 tab só" (Formação de Preço / CRM / Manutenção) que o HUB exibia por cima era redundância pura e consumia ~40px verticais. Agora o switchModule detecta esses módulos e esconde o tab-bar do HUB por inteiro; pra Gerencial e Produção o tab-bar continua aparecendo normal porque tem múltiplas abas úteis (2026/Histórico, Produção/Cor/Apontamento/Timeline/Stats).'},
      {type:'note', title:'Lazy-load migrou pro switchModule.', desc:'Antes o carregamento do iframe rodava dentro do switchTab (porque cada módulo iframe tinha uma "tab" com mesmo nome). Agora que o tab-bar some pra esses módulos, o lazy-load e cache-buster (?v=CURRENT_VERSION) rodam direto do switchModule quando detecta um iframe-module.'}
    ]
  },
  {
    v:'3.2.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Preço: shell interno removido, conteúdo encosta no topo.', desc:'O sub-app do Preço chegou na v3.1.x com todo o chrome do app standalone — header verde com "Fiobras · Formação de Preço · v3.4.0 · tema · logout" e um footer com copyright. Isso duplicava uma parte (topbar do HUB já mostra o breadcrumb e controles) e roubava ~70px verticais no topo pra nada. Agora o iframe aplica um <style> de override que esconde .header, .footer, .mob-overlay e .mob-dropdown, e grud a barra de abas (Vendas, Tingimento, etc.) direto no topo do iframe. Mais espaço útil, menos ruído visual, shell único do HUB por fora.'},
      {type:'high', title:'Tema e logout só no HUB.', desc:'O toggle de tema e o botão de logout agora existem em um lugar só — o dropdown de user do HUB. Antes tinha toggle duplicado dentro do iframe que só mudava o iframe, criando dessincronia. A lógica de postMessage já propagava o tema do HUB pro iframe; ao tirar o toggle interno, eliminamos a fonte conflitante.'},
      {type:'high', title:'Mobile: tabs do preço viram scroll horizontal.', desc:'O price tinha um dropdown hamburger pra navegação mobile, também parte do header verde. Com o header fora, as 6 abas internas aparecem como barra horizontal rolável em mobile (padrão que o HUB já usa no seu próprio tabs bar). Uma forma só de navegar dentro do sistema, consistente com o resto do HUB.'},
      {type:'note', title:'Cache-buster na src do iframe.', desc:'iframe.src agora vem com ?v=CURRENT_VERSION no final. A cada bump o browser é forçado a baixar a versão nova do sub-app — resolve o problema de usuários ficarem com versão antiga cacheada quando a gente corrige algo dentro do /preco/. Mesma técnica do <link href="css/hub.css?v=..."> que usamos antes. Vai valer pra CRM e Manutenção também.'}
    ]
  },
  {
    v:'3.1.2', d:'15 abr 2026',
    items:[
      {type:'high', title:'Preço continuou com tela preta na v3.1.1.', desc:'A correção anterior não subiu porque meu script Python tinha um bug sutil: tentei dar replace do </body> por bootstrap+</body>, mas no intermediário o </body> tinha sido REMOVIDO da string (capturei numa variável mas não incluí na concatenação). Resultado: preco/index.html saiu sem </body> e sem o bootstrap. Corrigi manualmente agora — script de bootstrap injetado direto antes do </html>, revela appHeader/appTabs, chama showApp() numa trycatch, e se algo falhar força a ativação da primeira tab (Vendas). Também adicionei stubs ocultos de appFooter/mob-overlay/mob-dropdown pra silenciar null errors do código legado do price.'}
    ]
  },
  {
    v:'3.1.1', d:'15 abr 2026',
    items:[
      {type:'high', title:'Preço de Venda abria como tela preta.', desc:'Na v3.1.0 eu tinha stripado aggressivamente o body do /preco/index.html — removi splash, login, appHeader E appTabs. O problema: sem appTabs, as 6 sub-abas (Vendas, Tingimento, etc.) deixavam de existir, e como os panels são hidden por default e só ativam via switchTab, tudo ficava invisível = tela preta. Agora o strip preserva appHeader e appTabs (o shell interno do price), e removo só o splash (chato no iframe) e a tela de login (substituída pelo gate de sessão do HUB). Adicionei stubs ocultos pros IDs splash/loginScreen pra não quebrar código legado que checa esses elementos. O bootstrap no DOMContentLoaded chama showApp("Admin") — o próprio fluxo original do price que revela o header+tabs e ativa a primeira aba.'}
    ]
  },
  {
    v:'3.1.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Preço de Venda ativo dentro do HUB.', desc:'O sistema de Formação de Preço (antes WIP) agora vive em /preco/index.html e é carregado via iframe dentro do panel-preco do HUB. Todas as 6 abas internas (Vendas, Tingimento, Preparação/Repasse, Retorção, Custos, Histórico) funcionam como o app standalone original, mas agora dentro do shell unificado — sidebar, topbar e user dropdown do HUB continuam visíveis por fora.'},
      {type:'high', title:'Sessão e tema sincronizados automaticamente.', desc:'O sub-app lê a sessão do HUB via localStorage (fiobras-dash-auth) — quem não é admin cai numa tela "Abrir pelo HUB" com link pra raiz, mantendo a permissão admin-only do módulo. Tema é propagado via postMessage quando o toggle é clicado no HUB; o iframe aplica data-theme sem reload. No primeiro load do iframe, tema também é enviado via evento load.'},
      {type:'note', title:'Lazy-load: iframe só carrega quando abre o módulo.', desc:'No boot do HUB o iframe fica com src vazio. Quando o user clica Preço de Venda pela primeira vez, o src é setado e o sub-app carrega. Se sai e volta, mantém montado (sem recarregar). Mesma mecânica pronta pra CRM e Manutenção quando chegarem.'},
      {type:'note', title:'Abordagem iframe vs integração inline.', desc:'Optei por /preco/ em vez de trazer o código inline pro index.html porque o price tinha 60+ funções JS com nomes que colidiam com o HUB (switchTab, canAccessTab, fecharModal, renderHistorico, toast, _salvarFirebase). Renomear tudo seria centenas de changes e risco alto. Com iframe, zero colisão, cada sistema mantém seu próprio contexto, e a integração visual segue coesa porque ambos compartilham fonts/paleta do BASE.'}
    ]
  },
  {
    v:'3.0.2', d:'15 abr 2026',
    items:[
      {type:'high', title:'Dropdown do user continuava clipando.', desc:'O fix anterior (position:fixed + z-index 9999) não pegou porque o GitHub Pages serve o css/hub.css como arquivo separado e pode estar cacheado no browser com a versão antiga das regras de posicionamento. Agora aplico dois remédios combinados: (1) o <link> do CSS ganha ?v=3.0.2 como cache-buster — força download do stylesheet novo no primeiro load desta versão; (2) ao abrir, o dropdown é movido (appendChild) pra document.body, escapando de qualquer stacking context trap do topbar. Click-outside atualizado pra considerar o novo parent.'}
    ]
  },
  {
    v:'3.0.1', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Minha Conta: nome completo, email, senha e foto.', desc:'Cada usuário agora pode editar o próprio perfil pelo dropdown do user (canto superior direito → Minha conta). Quatro campos: foto (upload + crop quadrado automático + compressão), nome completo (substitui o display name do HUB), email (aparece no dropdown) e senha opcional. A senha é guardada como SHA-256 com salt no Firebase — evita ver em texto plano. Cada um edita só o próprio; admin também.'},
      {type:'high', title:'Login respeita senha cadastrada de qualquer usuário.', desc:'Antes só o admin pedia senha. Agora: se um usuário definiu senha em Minha Conta, o campo de senha aparece automaticamente no login quando esse user é selecionado. Produção continua podendo entrar sem senha se preferir — só passa a exigir se definir uma.'},
      {type:'high', title:'Dropdown do user não clipa mais.', desc:'O dropdown estava com a parte de cima cortada (avatar + nome sumindo atrás do pill). Reescrito de position:absolute pra position:fixed com coordenadas computadas dinamicamente do bounding rect do pill + z-index 9999. Remove qualquer chance de stacking context trap. Reposiciona sozinho ao redimensionar a janela.'},
      {type:'note', title:'Path Firebase novo: users-profile.', desc:'users-profile/{user}/{nomeCompleto, email, foto, senhaHash}. Só o próprio usuário grava no próprio ramo (validação client-side — Firebase RTDB rules ficam pra depois). Dados antigos hardcoded em USERS (nome/senha do admin) continuam valendo como fallback.'}
    ]
  },
  {
    v:'3.0.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Refactor prep: CSS separado + novos módulos.', desc:'Primeiro passo do refactor pra ES modules (planejado nas próximas sessões). Todo o CSS do HUB (~1750 linhas) saiu do index.html pra `css/hub.css`, linkado via `<link>`. O index.html desce de 6461 pra ~4700 linhas — fica mais fácil de navegar e editar. Comportamento visual idêntico, só split físico.'},
      {type:'feat', title:'Manutenção e CRM adicionados como módulos.', desc:'Dois módulos novos aparecem na sidebar, no header desktop e na pílula mobile: Manutenção (ícone de chave inglesa) e CRM (ícone de pessoas). Ambos abrem pra uma tela de placeholder "em construção" — estão prontos pra receber o código dos sistemas que o William tem prontos pra trazer pra dentro do HUB. Acesso liberado pra todos os usuários por enquanto; granularidade por aba a definir quando o conteúdo real entrar.'},
      {type:'note', title:'Bump MAJOR: paradigma em transição.', desc:'v3.0.0 marca o início da transição de monolito → ES modules. Nas próximas sessões cada módulo existente (Gerencial, Produção, Cor, Apontamento, Timeline, Stats Cor) será extraído pra seu próprio arquivo `.js` sob `js/modules/`, com Firebase em `js/firebase.js` e state compartilhado em `js/state.js`. Extração gradual, um commit por módulo, zero regressão.'}
    ]
  },
  {
    v:'2.9.0', d:'15 abr 2026',
    items:[
      {type:'feat', title:'Timeline: tag obrigatória por registro.', desc:'Cada registro da Timeline agora precisa de uma tag. Três tags de sistema já vêm prontas — Desenvolvimento de fios (azul), Problemas (vermelho) e Melhorias (verde) — e o admin pode criar tags customizadas adicionais (Pedido especial, Urgência, etc.) pelo botão "+ Gerenciar" que aparece só pra ele no seletor. No card do feed a tag vira um chip colorido ao lado do chip de cor/cliente; no modal de detalhe aparece logo no topo dos chips.'},
      {type:'high', title:'Admin pode criar/excluir tags customizadas.', desc:'No modal "Gerenciar tags" dá pra criar tags novas escolhendo nome + uma das 6 cores pré-definidas (azul, vermelho, verde, amarelo, roxo, cinza). Tags de sistema aparecem na lista mas têm badge "sistema" e não podem ser excluídas — garantia de que o vocabulário básico não some por acidente. Excluir uma tag customizada não apaga os registros que a usam; eles simplesmente ficam com o chip "sem tag" (cinza discreto), fácil de reeditar depois.'},
      {type:'note', title:'Path Firebase novo: timeline-tags.', desc:'Só tags customizadas são persistidas; as 3 de sistema ficam hardcoded no código pra não haver risco de bootstrap vazio. Fallback pra registros antigos (sem campo `tag`): renderiza chip "sem tag" no feed e o modal de edição exige escolha de tag ao salvar — migração natural, sem script destrutivo.'}
    ]
  },
  {
    v:'2.8.1', d:'14 abr 2026',
    items:[
      {type:'high', title:'Dropdown do user ficava cortado no topo.', desc:'O .main-col tinha overflow:hidden pra o border-radius funcionar, mas isso cortava o dropdown do usuário (que é position:absolute e escapa o limite do container). Removi o overflow:hidden e apliquei o border-radius direto na topbar sticky — ela agora é quem "recorta" o topo do canvas. Dropdown volta a aparecer inteiro com avatar + nome + email.'},
      {type:'high', title:'Breadcrumb mostrava sempre "— › —".', desc:'O setupTabs seta o módulo/aba inicial direto via .classList.add("active") sem passar pelo switchModule/switchTab, então o breadcrumb nunca era atualizado na carga. Criei updateCrumbFromState() que lê o estado atual (módulo ativo + tab ativa) e preenche o crumb corretamente. Chamada adicionada no final do setupTabs. Agora o crumb mostra "Gerencial › 2026" ou "Produção › Cor" direto no primeiro render.'},
      {type:'note', title:'Sidenav também ativa na carga inicial.', desc:'O item da sidebar correspondente ao módulo inicial (Gerencial pra admin, Produção pra produção) também não estava recebendo a classe .active porque o setupTabs não chamava switchModule. Corrigido: sidenav agora destaca o módulo ativo já na primeira render, com a barrinha verde lateral.'}
    ]
  },
  {
    v:'2.8.0', d:'14 abr 2026',
    items:[
      {type:'feat', title:'Shell redesenhado: sidebar + topbar com user dropdown.', desc:'Redesign de navegação inspirado em apps SaaS modernos. Sidebar estreita à esquerda com ícones dos 3 módulos (Gerencial, Produção, Preço) + divider + histórico de versões. Módulo ativo ganha barrinha verde lateral e highlight sutil. Topbar no topo mostra breadcrumb (módulo › aba ativa), botão de tema e bloco do usuário à direita (avatar + nome + role). Clicar no user abre dropdown com Minha conta, Tema, Histórico de versões e Sair. O header antigo com a pílula 3D de módulos foi aposentado no desktop.'},
      {type:'high', title:'Profundidade visual em camadas (dark mode).', desc:'Novo token --bg-deep (#0D0E10) serve como camada mais escura do shell; o bg dos painéis fica destacado como um "card flutuante" dentro dele, com border-radius 18px e borda suave. Três níveis de cinza agora: bg-deep (wrapper) → bg (canvas principal) → surface (cards internos). Light mode fica neutro (bg-deep = bg).'},
      {type:'note', title:'Mobile preservado.', desc:'No mobile (≤640px) a sidebar some, o shell perde borda/radius e a topbar fica slim com só o avatar à direita. A pílula flutuante estilo Nubank no rodapé (v2.5.0) continua sendo a nav primária em mobile. Dropdown do user vira bottom-sheet largo.'},
      {type:'note', title:'Minha conta: em breve.', desc:'O item "Minha conta" do dropdown ainda está parcial — cadastro/edição de email e o fluxo de senha no login chegam na v2.8.1. Por enquanto, clicar na opção mostra um toast informativo.'}
    ]
  },
  {
    v:'2.7.4', d:'14 abr 2026',
    items:[
      {type:'feat', title:'Lançar mês agora navega entre meses.', desc:'O modal Lançar Mês do Stats Cor ganhou um seletor de mês com setas ‹ / › no header. Antes, o modal abria travado no último mês com dados e qualquer Salvar sobrescrevia — não dava pra criar um mês novo (abril, por exemplo). Agora ao abrir o modal, ele cai direto no primeiro mês SEM dados do ano atual (típico caso de uso: lançar o mês corrente). As setas navegam livremente pra qualquer mês de jan a dez. Um badge logo abaixo do nome do mês indica se é "Novo mês" (verde) ou "Atualizando dados existentes" (amarelo), pra ninguém sobrescrever dados sem querer.'},
      {type:'high', title:'Botão Lançar mês liberado pra Lucivane.', desc:'Antes só admin podia lançar. Agora quem tem acesso à aba Stats Cor (admin, Anderson, Aldo, Geovani, Lucivane) pode lançar/atualizar meses. A permissão da aba já filtra quem pode ver o botão — líderes de turno continuam sem acesso porque não veem a aba.'}
    ]
  },
  {
    v:'2.7.3', d:'14 abr 2026',
    items:[
      {type:'high', title:'Botão "Lançar mês" do Stats Cor não abria.', desc:'A função abrirScLancamento() estava adicionando a classe "show" no modal, mas o CSS do .modal-bg só responde à classe "open" (igual todos os outros modais do HUB). Incompatibilidade de classe — o modal até existia no DOM, só que o display:none do CSS nunca virava display:flex. Corrigido pra usar "open" na abertura e no fechamento.'}
    ]
  },
  {
    v:'2.7.2', d:'14 abr 2026',
    items:[
      {type:'high', title:'Texto da aba ativa sumia em mobile.', desc:'Colisão de pseudo-elemento: o ::after já é usado pelo underline verde do .active (content:"") e na v2.7.1 eu reaproveitei o mesmo ::after pra renderizar a label curta (content:attr(data-short)). Quando a aba ficava ativa, o content:"" sobrescrevia o attr(data-short) e o texto sumia. Corrigido trocando a label curta pra ::before, que ninguém mais usa.'}
    ]
  },
  {
    v:'2.7.1', d:'14 abr 2026',
    items:[
      {type:'high', title:'Cadeado aparecia pra todo mundo na pílula mobile.', desc:'O ícone de cadeado da pílula flutuante mobile estava com display:flex fixo no CSS — aparecia mesmo quando o botão NÃO estava com a classe .locked. Resultado: admin via cadeado em todos os 3 módulos. Corrigido: cadeado agora fica display:none por padrão e só aparece quando o botão tem .locked, igual o CSS do header desktop já fazia certo.'},
      {type:'high', title:'Tabs secundárias ficam fixas em mobile.', desc:'As abas dentro dos módulos (Produção, Desenv. Cor, Apontamento, Timeline, Stats Cor) estavam com scroll horizontal — dava pra arrastar de lado. Em mobile isso é confuso e parece bug. Agora em ≤480px as abas viram grid com larguras iguais (repeat(auto-fit, minmax(0,1fr))) — ocupam toda a largura disponível, sem arrasto. Pra caber em 5 abas, cada botão mostra uma label curta (Cor / Apont. / Stats) via atributo data-short; no desktop segue mostrando o nome completo.'}
    ]
  },
  {
    v:'2.7.0', d:'14 abr 2026',
    items:[
      {type:'feat', title:'Timeline: múltiplas fotos com legenda por foto.', desc:'Agora cada registro da Timeline aceita até 4 fotos, e cada foto tem seu próprio campo de legenda opcional. No modal de edição, as fotos aparecem empilhadas numa lista — cada uma com sua thumb + textarea de legenda + botão de remover. Botão "Adicionar foto" abaixo da lista (desabilita quando atinge o limite de 4). No card do feed, a primeira foto aparece como thumb com um badge "+N" no canto quando há mais. Ao abrir o detalhe do registro, as fotos aparecem uma embaixo da outra, cada uma com sua legenda em itálico discreto logo abaixo.'},
      {type:'high', title:'Qualidade de foto 4× melhor.', desc:'Compressão reformulada: lado máximo subiu de 300px pra 1200px, qualidade JPEG inicial de 0.5 pra 0.82, e o algoritmo agora usa smoothing de alta qualidade no canvas. Cada foto fica em ~210KB (vs ~80KB antes) mas finalmente dá pra ver textura de tecido, mancha, variação de cor, detalhe fino. Com 4 fotos/registro o payload fica em ~840KB, folgado pro Firebase.'},
      {type:'note', title:'Schema novo com fallback pro legado.', desc:'Campo fotos:[{data,desc}] substitui foto:string. Registros antigos continuam funcionando — ao abrir, o código detecta foto (string) e converte pra [{data:foto,desc:""}] na leitura, e ao salvar já grava no schema novo. Zero migração destrutiva, zero perda de dados.'},
      {type:'note', title:'Splash: versão agora é dinâmica.', desc:'A versão no splash estava hardcoded em v2.4.0 desde abril e não atualizava junto com os bumps. Agora o splash lê direto do CURRENT_VERSION no JS, então todo bump futuro reflete automaticamente sem precisar editar o HTML do splash.'}
    ]
  },
  {
    v:'2.6.6', d:'10 abr 2026',
    items:[
      {type:'feat', title:'Nome editado da cor substitui o código no card.', desc:'Quando você edita uma cor e preenche o campo Nome, agora esse nome aparece como título principal do card (substituindo o código original) e a linha de baixo mostra só o cliente. O modal de detalhe segue o mesmo padrão: título principal usa o nome editado, e o código original aparece como sub se for diferente. Cores sem nome customizado continuam mostrando o código.'}
    ]
  },
  {
    v:'2.6.5', d:'10 abr 2026',
    items:[
      {type:'high', title:'Botões do modal de detalhe de cor finalmente funcionam.', desc:'Bug crítico: os botões do modal de detalhe (Editar Nome/Obs, Editar Tudo, Excluir, Aprovar, Cancelar, etc) usavam c.id pra passar o ID da cor pro handler — mas o objeto c vinha direto de coresData[id] sem o campo id injetado (diferente da lista de cards que faz Object.entries e injeta o id). Resultado: c.id era undefined, e os handlers chamavam coresData[\"undefined\"] que não existia. Corrigido usando a const local id que está no escopo da renderCorDetalhe.'}
    ]
  },
  {
    v:'2.6.4', d:'10 abr 2026',
    items:[
      {type:'high', title:'Botões do modal de detalhe robustos.', desc:'Os botões "Editar Nome/Obs", "Editar Tudo" e "Excluir" do modal de detalhe agora têm error handling com toast visível e usam (arguments[0]||window.event).stopPropagation() em vez de event.stopPropagation() — algumas situações de browser passavam onclick sem um event no escopo, fazendo o handler inteiro falhar antes de chegar na função. Também aumentei o delay do fechamento do modal de detalhe pra 80ms.'}
    ]
  },
  {
    v:'2.6.3', d:'10 abr 2026',
    items:[
      {type:'high', title:'Botões "Editar Nome/Obs" e "Editar Tudo" do modal de detalhe consertados.', desc:'Ao clicar nesses botões, a tela ficava em branco. Causa: a sequência fecharCorDet() seguida de editarNomeObs() criava uma race condition — o modal de detalhe fechava antes do modal de edição abrir, deixando o usuário sem nada na tela. Agora os botões usam wrappers que abrem o modal de edição PRIMEIRO e só depois fecham o de detalhe (com 50ms de delay pra garantir que o DOM atualize).'},
      {type:'note', title:'event.stopPropagation em todos os botões do modal.', desc:'Adicionado por garantia em todos os botões de ação dentro do modal de detalhe pra evitar que cliques propaguem pro overlay e fechem o modal acidentalmente.'}
    ]
  },
  {
    v:'2.6.2', d:'10 abr 2026',
    items:[
      {type:'high', title:'Stats Cor: gráfico histórico plurianual corrigido.', desc:'O gráfico mostrava só a barra TOTAL e as barras anuais (2020-2026) ficavam em branco. Era um problema clássico de altura percentual em pais sem altura definida — os segmentos coloridos viravam 0 porque o pai colapsava. Refeito o CSS do gráfico com altura concreta no chart container e flex:1 nas barras.'},
      {type:'high', title:'Botão "Lançar mês" agora clica de verdade.', desc:'O botão estava dentro do header da seção (.sh) que tinha um divisor flex:1 cobrindo a área de hit do botão, deixando ele visualmente lá mas inacessível ao clique. Movido pra própria toolbar dedicada (.sc-toolbar) embaixo do título, com z-index pra garantir.'}
    ]
  },
  {
    v:'2.6.1', d:'10 abr 2026',
    items:[
      {type:'high', title:'Ações de cor voltam direto no card.', desc:'Rollback parcial do tap-to-detail v2.5.0 só pro Desenv. Cor. Os botões de ação (Aprovar, Enviar ao cliente, Em ajuste, Cancelar, etc.) agora aparecem direto no card de cor, sem precisar abrir o modal. O modal de detalhe continua acessível clicando no card pra ver foto, histórico e ações de admin (Editar/Excluir). Tap-to-detail da Timeline continua intacto — só Desenv. Cor voltou pro padrão antigo.'},
      {type:'note', title:'Bug fix: Gerencial não renderizava após v2.6.0.', desc:'A subscription Firebase do Stats Cor foi colocada por engano no bloco de script normal — onde db, ref, onValue e update não existem (esses símbolos só vivem no escopo do <script type=module>). ReferenceError no boot quebrava todo o restante do init, deixando Gerencial em branco. Corrigido movendo a subscription pro bloco module e expondo via window._mixCoresData / window._salvarScFirebase, igual fazem os outros módulos.'}
    ]
  },
  {
    v:'2.6.0', d:'09 abr 2026',
    items:[
      {type:'high', title:'Nova aba Stats Cor — mix de tingimento por fibra.', desc:'Dentro do módulo Produção, quinta aba. Mostra a distribuição de cores tingidas (Branco / Clara / Média / Escura / Intensa / Preta) em kg e %, separado por fibra (Total, CO, PAC, PES, CV). Donut interativo do mês selecionado + lista com barras + KPIs de dominante e comparativo vs ano anterior.'},
      {type:'high', title:'Gráfico histórico plurianual com barra TOTAL.', desc:'Abaixo do detalhe do mês, um gráfico de barras empilhadas 100% com os 6 últimos anos (2021 → 2026) culminando numa barra TOTAL destacada em verde que mostra o % geral acumulado. Dá pra ver de relance a evolução do mix e o quanto cada categoria pesou na história da Fiobras.'},
      {type:'high', title:'Nova usuária: Lucivane.', desc:'Adicionada ao sistema com role produção. Aparece no dropdown de login junto com Anderson, Aldo e Geovani.'},
      {type:'feat', title:'Paleta mono verde Fiobras nas categorias de cor.', desc:'Escala do verde clarinho (Branco) ao quase-preto (Preta), passando pelo verde Fiobras (#008835) na Média. 100% coerente com a identidade visual do sistema.'},
      {type:'feat', title:'Permissão granular por aba (novidade no sistema).', desc:'Antes a permissão era só por módulo. Agora abas específicas podem ter sua própria lista de usuários permitidos — Stats Cor é o primeiro exemplo: só admin, Anderson, Aldo, Geovani e Lucivane veem. Os líderes de turno (Adelir, Alexander, Djoniffer) não veem a aba.'},
      {type:'feat', title:'Modal Lançar Mês — admin only.', desc:'Botão "+ Lançar mês" no header da aba (aparece só pro admin). Abre modal com seletor de fibra (4 abas CO/PAC/PES/CV) e 6 inputs por fibra (um por categoria). Total da fibra calculado na hora. Salva direto no Firebase em mix-cores-{ano}.'},
      {type:'note', title:'Histórico 2021–2026 importado da planilha.', desc:'Os dados de 6 anos da planilha ESTATÍSTICA DE CORES TINGIDAS FIOBRAS já foram importados na primeira rodagem — ~8,13M kg tingidos distribuídos em 72 meses × 4 fibras × 6 categorias.'}
    ]
  },
  {
    v:'2.5.0', d:'09 abr 2026',
    items:[
      {type:'high', title:'Patch Mobile First — completo (Fases 1 a 5).', desc:'Grande patch pra deixar o HUB 100% mobile friendly, em 5 fases encadeadas: fundações técnicas, pílula flutuante, formulários encorpados, tap-to-detail no Desenv. Cor e polish final. Inclui o rename do módulo Resultados → Gerencial.'},
      {type:'high', title:'Módulo Resultados agora se chama Gerencial.', desc:'Melhor reflete o escopo real do módulo: metas financeiras, histórico plurianual, prêmios, e tudo relacionado à visão executiva/gerencial da empresa. O que muda é só o nome — as abas internas (2026 / Histórico) continuam iguais.'},
      {type:'high', title:'Pílula flutuante de navegação no mobile.', desc:'Estilo Nubank/iOS: no celular, os módulos (Gerencial / Produção / Preço) agora ficam numa pílula flutuante no rodapé, com fundo branco translúcido, blur, sombra verde no ativo. Sobe junto quando você rola, sempre ao alcance do polegar. No desktop continua com o pill 3D no header.'},
      {type:'high', title:'Cadeado nos módulos sem permissão — desktop e mobile.', desc:'Agora todos os usuários enxergam todos os módulos, mas aqueles que não têm acesso aparecem com cadeado SVG sobreposto + opacity reduzida. Admin nunca vê cadeado (tem acesso a tudo). Anderson/Aldo/Geovani veem cadeado em Gerencial e Preço. Toque mostra toast "Sem permissão".'},
      {type:'high', title:'Desenv. Cor: tap-to-detail em modal bottom-sheet.', desc:'Os cards de cor agora são mínimos (código + cliente/cor + badge de status + dias). Toca num card e abre um modal bottom-sheet com foto grande, 3 chips (Status/Prazo/Fibra), observações em destaque, histórico em timeline vertical com bolinhas coloridas e ações agrupadas no final (Aprovar, Em ajuste, Editar, Excluir). Mesmo padrão visual da Timeline.'},
      {type:'high', title:'Formulários mdet redesenhados em mobile.', desc:'Em Gerencial (Metas 2026) e Produção (detalhe do mês), cada métrica agora vira um card branco encorpado com label grande (Poppins sentence case, não mais MAIÚSCULAS comprimidas), input grande de 16px (sem zoom iOS), selos M/P/S em grid 3-col legíveis embaixo e histórico colapsado em uma linha discreta "vs 2025 · 1.31M · ↑8,2%".'},
      {type:'feat', title:'Tabs horizontais com fade lateral.', desc:'Em mobile, quando as abas internas do módulo não cabem todas na tela, as laterais ganham um fade suave indicando que tem mais conteúdo pra scrollar.'},
      {type:'feat', title:'Inputs em mobile não dão mais zoom no iOS.', desc:'Safari dá autozoom quando você toca num input com fonte menor que 16px. Agora todos os inputs em telas ≤480px usam exatamente 16px, eliminando o zoom-e-desalinha irritante.'},
      {type:'feat', title:'Toques mais rápidos e sem flash cinza.', desc:'Adicionado touch-action:manipulation nos botões e cards (remove o delay de 300ms do duplo-toque) e tap-highlight transparent global (acaba com o flash cinza feio do Android ao tocar).'},
      {type:'feat', title:'switchModule unificado.', desc:'A função que troca de módulo agora trata sozinha WIP e permissão. Antes tinha lógica duplicada entre header e pílula mobile. Menos código, menos chance de bug.'},
      {type:'note', title:'Footer escondido em mobile.', desc:'Pra liberar espaço pra pílula flutuante. Os mesmos controles (tema, logout) continuam no header. No desktop o footer segue normal.'},
      {type:'note', title:'Header mobile com altura natural.', desc:'Saiu a altura forçada de 48px. Agora o header se ajusta ao próprio conteúdo — mais limpo, mais consistente com safe-area.'},
      {type:'note', title:'Proteção extra contra scroll horizontal.', desc:'overflow-x:hidden no .wrap mobile além do body. Previne glitch de card que "vaza" em raras situações de conteúdo dinâmico.'}
    ]
  },
  {
    v:'2.4.0', d:'08 abr 2026',
    items:[
      {type:'high', title:'Nova aba Apontamento na Produção.', desc:'Os líderes de turno agora lançam a produção da tintoria direto pelo HUB. Calendário do mês, toca no dia, escolhe o turno, preenche horas e as 4 fibras (CO, PAC, PES, CV). Salva instantâneo no Firebase.'},
      {type:'feat', title:'3 novos usuários: Adelir, Alexander e Djoniffer.', desc:'Líderes de turno do 1º, 2º e 3º respectivamente. Cada um só edita o próprio turno — os outros aparecem em somente leitura com cadeado e banner de aviso. Chefes (Anderson/Aldo/Geovani) e admin editam qualquer turno.'},
      {type:'feat', title:'Calendário visual com status.', desc:'Dias preenchidos aparecem em verde com bolinha. Fins de semana esmaecidos. Dia de hoje destacado. Toca e abre o detalhe com as 3 abas de turno (3º → 1º → 2º, ordem cronológica).'},
      {type:'feat', title:'Totais do dia em tempo real.', desc:'Conforme digita os kg, o total do turno atualiza na hora. O footer mostra horas do dia e total em kg somando os 3 turnos — pega os outros dois do Firebase e o atual do input.'},
      {type:'note', title:'Botão salvar pílula Apple-style.', desc:'Botão grande, 100% arredondado, sombra verde projetada. Muda pra desabilitado com cadeado quando você tá olhando turno que não é seu.'}
    ]
  },
  {
    v:'2.3.0', d:'08 abr 2026',
    items:[
      {type:'high', title:'Renomeado para Fiobras HUB.', desc:'O sistema agora se chama Fiobras HUB — refletindo melhor o que ele virou: ponto único de entrada pra todos os fluxos da empresa, não só dashboard. Mesmo app, nome novo.'},
      {type:'feat', title:'Tema light reformulado (sage + branco).', desc:'Saiu o cream warm. Entrou paleta sage clarinho de fundo com cards brancos puros. Pertence à família cromática do verde Fiobras e tem mais respiração.'},
      {type:'feat', title:'Tema dark Apple style.', desc:'Saiu o preto puro #0A0A0A. Entrou cinza em camadas (#1C1C1E → #2C2C2E → #3A3A3C) seguindo o padrão de iOS. Mais elegante, menos pesado.'},
      {type:'feat', title:'Pill 3D nos módulos.', desc:'O seletor de módulos virou um pill 3D tátil estilo iOS, com efeito de profundidade e botão ativo em verde Fiobras chapado. Funciona em ambos os temas.'},
      {type:'feat', title:'Novo módulo Preço de Venda.', desc:'Adicionado o terceiro módulo no header (badge WIP — em construção). Quando estiver pronto, vai consolidar a formação de preço dentro do HUB.'}
    ]
  },
  {
    v:'2.2.6', d:'07 abr 2026',
    items:[
      {type:'note', title:'Ícone de pausa também ao lado dos dias.', desc:'Quando o status é Enviada, agora aparece um pequeno ícone de pausa antes do "7 dias" no card. A label "tempo pausado" segue acima do badge — agora tem dois pontos visuais reforçando o estado.'}
    ]
  },
  {
    v:'2.2.5', d:'07 abr 2026',
    items:[
      {type:'note', title:'Tirado o riscado do contador pausado.', desc:'Quando o status é Enviada, o "7 dias" não fica mais riscado — só esmaecido em cinza. Riscado dava impressão de valor cancelado/inválido, mas o número tá correto, é o acumulado real até o envio. A label "tempo pausado" ao lado já comunica o estado.'}
    ]
  },
  {
    v:'2.2.4', d:'07 abr 2026',
    items:[
      {type:'high', title:'Regra de pausa de prazo corrigida.', desc:'Status "Desenvolvida" agora não pausa mais o contador — equipe ainda tá ativa nessa fase (aprovação interna, aguardando envio). Só "Enviada ao cliente" pausa o prazo, porque aí depende de resposta externa.'},
      {type:'note', desc:'O histórico de cores existentes recalcula automaticamente — se você tinha alguma cor parada em Desenvolvida há vários dias, vai notar o contador pulando pra frente.'}
    ]
  },
  {
    v:'2.2.3', d:'07 abr 2026',
    items:[
      {type:'high', title:'Tema light reformulado.', desc:'Saiu o branco puro que cansava a vista. Entrou uma paleta cream warm (papel) muito mais confortável pra usar o dia inteiro. Combina melhor com o verde Fiobras inclusive.'},
      {type:'note', desc:'Tema dark continua igual.'}
    ]
  },
  {
    v:'2.2.2', d:'07 abr 2026',
    items:[
      {type:'feat', title:'Indicador de tempo pausado em Desenv. Cor.', desc:'Cards com status Enviada ou Desenvolvida agora mostram um ícone de pausa com a label "tempo pausado" abaixo do badge, e o contador de dias fica riscado em cinza pra deixar claro que a contagem está congelada.'},
      {type:'note', desc:'A lógica de cálculo de dias úteis ativos não mudou — só ganhou indicação visual.'}
    ]
  },
  {
    v:'2.2.1', d:'07 abr 2026',
    items:[
      {type:'feat', title:'Timeline com Objetivo + Descrição + Resultado.', desc:'Modal de registro voltou ao schema completo: campo Objetivo (obrigatório) como título do card, Descrição do que foi feito, e Resultado separado.'},
      {type:'note', desc:'Fix do "undefined" que aparecia em registros antigos. Eles continuam aparecendo normalmente via fallback no campo Objetivo.'}
    ]
  },
  {
    v:'2.2.0', d:'07 abr 2026',
    items:[
      {type:'feat', title:'Header redesenhado.', desc:'Navegação minimal sem fundo verde sólido. Os módulos Resultados e Produção agora ficam dentro do header em uma única linha. Tudo respira mais.'},
      {type:'high', title:'Central de Atualizações.', desc:'Esta janela aqui — clique na pílula de versão a qualquer momento pra ver o que mudou. Aparece automaticamente uma vez quando há nova versão.'},
      {type:'feat', title:'Tabs internas mais limpas.', desc:'Tipografia DM Mono compacta com underline verde fino no ativo.'},
      {type:'note', desc:'Removido o badge duplicado de nível no Acumulado 2026 (já tinha o card de KPIs mostrando os números).'}
    ]
  },
  {
    v:'2.1.1', d:'02 abr 2026',
    items:[
      {type:'feat', title:'Timeline com detalhe ao tap.', desc:'Card minimalista no feed com descrição truncada. Tap abre modal com foto grande, descrição completa e chips.'},
      {type:'feat', title:'Edição aberta na Timeline.', desc:'Qualquer usuário edita; exclusão segue restrita ao admin.'},
      {type:'feat', title:'Compressão de foto otimizada.', desc:'JPEG iterativo até ficar abaixo de 100KB com 300px de lado máximo.'},
      {type:'note', desc:'Fix de div balance no panel-cores que estava impedindo a Timeline de renderizar.'}
    ]
  },
  {
    v:'2.1.0', d:'02 abr 2026',
    items:[
      {type:'feat', title:'Navegação modular.', desc:'Seletor de módulo entre header e abas: Resultados (admin) e Produção (todos).'},
      {type:'feat', title:'Timeline criada.', desc:'Feed vertical estilo Nubank de registros de testes de produção. Campos: descrição, cliente, OP, cor, foto.'},
      {type:'feat', title:'Role produção.', desc:'Anderson, Aldo e Geovani abrem direto no módulo Produção, sem ver Resultados.'}
    ]
  }
];
