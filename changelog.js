/* Fiobras HUB — CHANGELOG (extraído do index.html v3.25.1)
   Carregado sob demanda quando o user clica na pílula de versão. */
window.CHANGELOG = [
  {
    v:'3.33.0', d:'21 abr 2026', current:true,
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
