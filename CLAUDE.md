# Fiobras HUB — CLAUDE.md

> **Contexto persistente do projeto para o Claude Code.** Leia este documento no início de toda sessão antes de tocar em código. Ele descreve o que o sistema é, como está construído, as regras não-negociáveis e o workflow de entrega esperado.
>
> **Versão do doc:** 2.18 — 18/04/2026
> **Versão atual do HUB:** v3.24.0
> **Mantenedor:** William Schulz · Fiobras Fios Tintos Ltda.
> **Repo:** `williamscchulz-was/fiobras-dashboard` (branch `main`)
> **Domínio:** `https://hub.fiobras.com.br`

---

## 1. O que é o projeto

**Fiobras HUB** é o **mini-ERP interno da Fiobras Fios Tintos** — uma plataforma única, mobile-first, onde toda a operação da empresa converge: resultados gerenciais, produção mensal, desenvolvimento de cor, apontamento de tintoria por turno, timeline de testes/ocorrências, estatística de mix de tingimento, formação de preço, manutenção preventiva/corretiva e CRM.

**Para que serve:**
- **Direção** acompanha KPIs do ano (Receita Bruta, LL Ajustado, IPAC, Clientes Novos) e bate metas por nível (Meta / Meta Plus / Super Meta).
- **Produção** lança produção mensal de fios (CV, CO, PES, PAC), eficiências e reprocesso.
- **Laboratório** gerencia pipeline de desenvolvimento de cor e registra testes/ocorrências na Timeline.
- **Líderes de turno** apontam produção da tintoria por turno e fibra.
- **Comercial** usa CRM (leads, pipeline, clientes).
- **Manutenção** controla kanban de demandas, preventivas, peças, máquinas (com push notifications via FCM).
- **Admin** define preços de venda (formação completa por fio/serviço).

**Visão de longo prazo:** substituir planilhas paralelas, grupos de WhatsApp e comunicação verbal por uma única fonte de verdade, acessível via PWA no celular e no desktop.

---

## 2. Stack tecnológica

### Frontend
- **HTML + CSS + Vanilla JS** num único arquivo `index.html` (~6800 linhas) + CSS extraído em `css/hub.css` (~1900 linhas).
- **Sem frameworks.** Zero React/Vue/Svelte/Tailwind compilado. **Zero build step.**
- **Fontes:** Outfit (display, incl. weight 900 Black), Poppins (UI), DM Mono (números/IDs) — Google Fonts via CDN. Variable: `wght@300..900` na Outfit.
- **Charts:** Chart.js 4.x via CDN — **lazy-loaded** sob demanda via `loadChartJs()` (v3.22.1). Helper retorna Promise cached; `renderCharts`/`renderProducao` aguardam load antes de instanciar `new Chart()`.
- **Ícones:** SVG inline com `<symbol>`/`<use>` (biblioteca unificada line stroke 1.5 round). **Zero emoji na UI.** Zero CDN de ícones.

### Sub-apps integrados via iframe (v3.1.0+)
3 sistemas externos vivem como pastas separadas no repo, embutidos via iframe no HUB:
- `preco/index.html` — Formação de preço (adaptado de `williamscchulz-was/fiobras-price`)
- `crm/index.html` — CRM (adaptado de `williamscchulz-was/fiobras-crm`)
- `manutencao/index.html` + `manutencao/firebase-messaging-sw.js` — Manutenção (adaptado de `williamscchulz-was/manutencao`, com FCM)

Cada sub-app:
- Compartilha sessão do HUB via `localStorage` (`fiobras-dash-auth`)
- Sincroniza tema via `localStorage` + `postMessage`
- Faz `signInAnonymously` no Firebase pra passar pelas rules
- Tem seu próprio shell visual escondido via override CSS no topo do body

### Backend
- **Firebase Realtime Database** — projeto **`fiobras-hub`** (renomeado de `fiobras-preco` na v3.16.0).
- URL: `https://fiobras-hub-default-rtdb.firebaseio.com`.
- **Firebase Anonymous Auth** ligado (v3.15.0). Rules: `{".read":"auth!=null",".write":"auth!=null"}` — ver `firebase-rules.json`.
- Sync em tempo real via `onValue`; gravação via `set` / `update`.

### Hospedagem
- **GitHub Pages** no repo `williamscchulz-was/fiobras-dashboard`, branch `main`.
- Custom domain: `hub.fiobras.com.br` (CNAME → `williamscchulz-was.github.io.`).
- HTTPS via Let's Encrypt (Enforce HTTPS ativo).
- Deploy via **commit/push direto pro main** (William autorizou; ver §8.5).

### Backup automático (v3.21.17)
- **Workflow GitHub Actions** roda 2x/dia (03h e 15h BRT).
- Path: `.github/workflows/backup-firebase.yml` + `.github/scripts/backup.js`.
- Usa service account do Firebase (secret `FIREBASE_SERVICE_ACCOUNT`).
- Salva o JSON inteiro do RTDB comprimido com gzip como **artifact privado** (15 dias retenção, definido pelo William).
- Botão manual disponível em Actions → "Backup Firebase RTDB" → Run workflow.
- Setup completo documentado em `.github/BACKUP_SETUP.md`.
- Custo: zero (GitHub Actions free tier sobra 60x).

### PWA
- Instalável em iOS, Android, Windows.
- Manifest gerado em runtime via JS blob.
- Ícones 192/512 gerados em runtime via canvas a partir do símbolo SVG (v3.14.0).
- Favicon SVG inline via data URI.
- Tema verde `#008835` na barra de status.
- **Service Worker `/sw.js`** (v3.22.0, arquivo físico — não Blob): cache-first pra fontes/Chart.js, stale-while-revalidate pra CSS/HTML local, network-first pra HTML raiz, pass-through pra Firebase. Cache name versionado por release (`fiobras-hub-v${VERSION}`). Toast "Nova versão · Atualizar" quando deploy novo detectado. Toast online/offline.

---

## 3. Arquivos principais

| Arquivo | Papel |
|---|---|
| `index.html` | **Shell + 2 módulos nativos** (Gerencial, Produção/Cor/Apontamento/Timeline/Stats Cor). ~6800 linhas. |
| `css/hub.css` | CSS principal extraído (v3.0.0). Linkado via `<link rel="stylesheet" href="css/hub.css?v=X.X.X">` (cache-buster). |
| `preco/index.html` | Sub-app Preço (iframe). |
| `crm/index.html` | Sub-app CRM (iframe). |
| `manutencao/index.html` | Sub-app Manutenção (iframe). |
| `manutencao/firebase-messaging-sw.js` | Service worker do FCM (push notifications). |
| `firebase-rules.json` | Rules pra colar no Firebase Console (auth != null). |
| `CNAME` | Custom domain GitHub Pages: `hub.fiobras.com.br`. |
| `README.md` | README curto do repo. |
| `CLAUDE.md` | Este documento. |

**Dentro do `index.html` há dois blocos `<script>` distintos:**
- **Script normal** — lógica da UI, state local, helpers, render.
- **Script `type="module"`** (final) — importa Firebase SDK, define `db`, `ref`, `onValue`, `set`, `update`, `getAuth`, `signInAnonymously`, e expõe funções de persistência via `window._salvarXxxFirebase`. **Símbolos do module NÃO vazam pro script normal.** Sempre gravar Firebase a partir do bloco module.

**SVG `<defs>` global** no topo do body com biblioteca de ícones e símbolos da marca:
- Ícones (line stroke 1.5 round): `i-dashboard`, `i-factory`, `i-dollar`, `i-tool`, `i-users`, `i-lock`, `i-sun`, `i-moon`, `i-logout`, `i-x`, `i-clock`, `i-user`, `i-chevron-down`, `i-plus`, `i-pencil`, `i-trash`, `i-panel-toggle`, `i-alert-triangle`, `i-loader`, `i-paper-plane`, `i-eye`, `i-badge-check`, `i-x-circle`, `i-info`, `i-check`
- Marca: `i-fiobras-symbol` (verde), `i-fiobras-symbol-inv` (branco), `i-fiobras-mark` (com fundo verde)

---

## 4. Estrutura de dados (Firebase Realtime Database)

**Backend único: Firebase Realtime Database** (projeto `fiobras-hub`).

### Paths atuais

| Path | Conteúdo | Schema resumido |
|---|---|---|
| `metas-2026` | Lançamentos mensais Gerencial. | `{mes}/{metrica} = valor` |
| `producao-2026` | Produção mensal de fios. | `{mes}/{cv,co,pes,pac,efTinturaria,efRepasse,diasDesenv,reprocesso}` |
| `cores-2026` | Desenv. de cor. | `{id}/{codigo,cliente,cor,status,prioridade,criadoPor,historico:[{acao,data,by}],foto,obs,...}` |
| `apontamento-tintoria-2026` | Lançamento diário tintoria. | `{mes}/{dia}/{turno}/{fibra} = kg` |
| `timeline-2026` | Timeline (testes, ocorrências). Múltiplas fotos + tag obrigatória. | `{id}/{objetivo,cliente,op,cor,tag,fotos:[{data,desc}],desc,resultado,criadoPor,...}` |
| `mix-cores-{ano}` | Stats Cor. **Populado 2020-2026.** | `{mes}/{fibra}/{categoria} = kg` |
| `timeline-tags` | Tags customizadas da Timeline. | `{id}/{nome,cor}` |
| `users-profile/{user}` | Perfil do usuário (foto, email, senha hash + plain, nome completo, role override). | `{nomeCompleto, email, foto, senhaHash, senhaPlain, roleOverride, turnoOverride, modulesAllowedOverride, tabsAllowedOverride}` |
| `users-config/{user}` | Usuários criados via UI (admin). | `{nome, role, senha:null}` |
| `audit-log/{id}` | Log de ações administrativas. | `{ts, by, action, target, details}` |
| `active-sessions/{user}` | Heartbeat de sessões ativas. | `{lastSeen, userAgent, startedAt}` |
| `force-logout/{user}` | Sinaliza logout forçado pelo admin. | `{ts}` |
| **CRM** (paths não-prefixados) | | |
| `crm/clientes`, `crm/leads`, `crm/log`, `crm/usuarios` | Dados do CRM (escritos pelo sub-app). | varia |
| **Manutenção** | | |
| `manutencao/kanban`, `manutencao/pecas`, `manutencao/preventivas`, `manutencao/maquinas`, `manutencao/historico`, `manutencao/fcmTokens`, `manutencao/fcmPending` | Dados do Manutenção. | varia |
| **Preço** (paths top-level legacy) | | |
| `cadastro`, `custoHoraRetorcao`, `custoHoraPreparacao`, `multiplicadores`, `historico-precos` | Dados do Preço. | varia |

### Fibras e categorias (Stats Cor)
- **Fibras:** `co`, `pac`, `pes`, `cv`. Total = soma dinâmica.
- **Categorias:** `branco`, `clara`, `media`, `escura`, `intensa`, `preta`.

### Regras de gravação
- **Sempre passar pelo bloco module.** Funções expostas via `window._salvarTlFirebase`, `window._salvarAptFirebase`, `window._salvarUserProfile`, `window._gravarAuditLog`, etc.
- **Nunca hardcodear credenciais** no client.
- **Sem migrações destrutivas sem aprovação explícita.**
- **Fallbacks pra schema antigo obrigatórios** — registros antigos continuam funcionando via fallback (ex: `evt.objetivo || evt.desc`).
- **Backfills one-shot** salvam flag em localStorage pra não rodar duas vezes (ex: `fiobras-backfill-cores-autor-v2`).
- **NUNCA usar `set(ref, objetoInteiro)` em coleções keyed por ID** (timeline-2026, cores-2026, crm/leads, audit-log, etc). Race condition no boot (Firebase ainda não retornou `onValue` → state em memória vazio → save sobrescreve TUDO no nó). **Padrão correto:** `update(child(ref, id), payload)` pra criar/atualizar 1 registro, `remove(child(ref, id))` pra excluir. Fix histórico v3.21.17 (timeline perdeu registros antigos). Single-doc stores como `metas-2026`/`producao-2026` com chave determinística (mes/dia) ainda podem usar `set` no path completo `set(child(ref, mes), valor)` — risco zero de sobrescrita global.

### Firebase Rules
```json
{ "rules": { ".read": "auth != null", ".write": "auth != null" } }
```
HUB e os 3 sub-apps fazem `signInAnonymously` no boot pra passar pelas rules. Login user+senha custom é separado (vive em localStorage), independente do Firebase Auth.

---

## 5. Features implementadas (estado atual — v3.21.4)

### Shell (v2.8.0+, v3.7.0)
- **Desktop:** sidebar à esquerda colapsável (68px ↔ 232px com toggle), topbar com breadcrumb (`HUB › Módulo`), dropdown de usuário (Minha conta, Tema, Versões, Gerenciar usuários se admin, Sair).
- **Mobile (≤640px):** sidebar some; pílula flutuante estilo Nubank no rodapé com 5 módulos.
- **Tema:** light (sage clarinho `#EDF1EA` + brancos) ↔ dark (Apple style `#1C1C1E`/`#2C2C2E`/`#3A3A3C`). Toggle no dropdown propaga pra iframes via postMessage.

### Módulo Gerencial (admin only)
- **2026** — KPIs, progresso por nível, lançamento mensal, prêmios.
- **Histórico** — comparativo plurianual 2020-2026.

### Módulo Produção (5 abas)
- **Produção** — produção mensal de fios + IPAC + eficiências.
- **Desenv. Cor** — pipeline. Estrela de prioridade (admin+produção). `criadoPor` rastreado. Avatar do criador no card. Modal detalhe com histórico timeline + avatares. Ações inline.
- **Apontamento** — calendário tintoria, 3 turnos × 4 fibras. Líderes editam só próprio turno.
- **Timeline** — feed Nubank, até 4 fotos HD por registro com legendas, tag obrigatória, filtro por tag + contador.
- **Stats Cor** — mix por fibra/categoria, donut SVG, histórico plurianual com TOTAL acumulado, modal "Lançar Mês".

### Módulo Preço (sub-app /preco/, admin only)
6 abas internas: Vendas, Tingimento, Preparação/Repasse, Retorção, Custos, Histórico. Tabs internas com `position:fixed` (movidas pro body via JS no bootstrap).

### Módulo Manutenção (sub-app /manutencao/, todos)
6 abas internas (admin vê todas; demais só Dashboard/Kanban/Histórico): Dashboard, Kanban, Preventiva, Máquinas, Histórico, Relatórios. Push notifications FCM ativas via Cloudflare Worker. Bootstrap autentica como admin interno (`__admin__`).

### Módulo CRM (sub-app /crm/, todos)
3 views: Dashboard, Pipeline (kanban), Lista. **Tela inicial = sempre Pipeline** (v3.21.12, todos os usuários). **Pipeline visual v3.21.15:** cabeçalho de cada coluna em estilo pill (bullet colorido + nome Outfit 700 + count em chip + botão `+` que cria lead direto naquela etapa); colunas com bg sage `#F4F6F0` (cards continuam brancos); KPI bar no topo (em pipe / em proposta / fechados no mês / tempo médio); avatar do responsável (último autor do histórico) no footer do card com cores dedicadas por user. **Corte temporal:** Pipeline e Dashboard só consideram leads com `data >= 01/01/2026` (constante `CRM_CUTOFF_TS`); Lista mostra catálogo completo. **Pipeline com 6 etapas + Perdido:** Novo Lead → Retorno Feito → Proposta Enviada → Encam. p/ Representante (v3.21.6) → Negociação → Fechado. **Cards redesign v3.21.8 (Excermol-style):** borda colorida só no topo + header com logo iniciais + nome Outfit Black 900 + empresa abaixo + tag de fibra (produto) + meta linha única (data + tempo na etapa, vermelho se ≥3d) + footer com avatares de ação direta (📞 tel:, 💬 wa.me, 📧 mailto:) + botão circular paper plane (estilo Telegram) no canto que abre popover com todas as etapas. **Clicar numa etapa no popover MOVE DIRETO** (registra "Movido de X para Y" no histórico + toast). Drag também move direto. Exceção: ir pra "Perdido" abre modal pedindo motivo. **Drag por plataforma** (v3.21.13): desktop usa HTML5 `draggable="true"` nativo (drag/drop padrão tipo Trello). Mobile detecta via `matchMedia('(pointer:coarse)')` e desabilita drag — único caminho pra mover é o botão ✈. Click no card sempre abre o modal. Tempo na etapa virou "·4d" discreto ao lado da empresa, alerta vermelho só ≥7 dias. FAB "Registrar lead" sempre visível (v3.21.5).

### Sistema de roles (v3.10.0+, v3.21.0)
3 níveis hierárquicos:
- **`admin`** — controle total, único com acesso ao painel admin (gerenciar usuários, audit log, sessões ativas).
- **`gerente`** — vê todos os módulos automaticamente, pode mexer em tudo, mas SEM painel admin.
- **`producao`** (label "Usuário") — configurável por módulo. Default: vê Produção, Manutenção e CRM.

Hierarquia interna preserva string `producao` pra retrocompat. Labels friendly via `ROLE_LABELS = { admin:'Administrador', gerente:'Gerente', producao:'Usuário' }`.

### Painel admin (v3.9.0+)
Acessível pelo dropdown do user só pra admin:
- **Gerenciar usuários** — lista os 17 users (USERS hardcoded + dinâmicos do Firebase). Cada linha: avatar, nome, role/turno, status da senha + chip da senha plain (escondido, revela com botão de olho — v3.21.5). Botões: editar (lápis), definir senha (cadeado, v3.21.5), resetar senha, excluir (só dinâmicos).
- **+ Novo usuário** — modal pra criar (chave login + nome + role). Salva em `users-config`.
- **Editar usuário** — role select (Usuário/Gerente/Administrador), turno, módulos liberados (com Marcar todos / Limpar). Seção módulos some quando role=admin/gerente. Mudanças efetivam no próximo login.
- **Sessões ativas** — lista users com login recente (heartbeat 60s, ativo se < 5 min). Botão "Forçar logout" (marca `force-logout/{user}`).
- **Histórico de alterações** (audit log) — últimas 100 ações filtráveis por user/ação/período.

### Login + senha (v3.0.1+, v3.9.0, v3.21.5)
- Login: dropdown dinâmico com todos os users (USERS hardcoded + dinâmicos).
- Senha: SHA-256 + salt fixo (`fiobras-hub-v3`), gravada em `users-profile/{user}/senhaHash`. Versão plain também salva em `senhaPlain` (v3.21.5) — admin pode revelar no painel.
- Admin tem senha hardcoded `'admin'` em USERS.
- Demais entram sem senha; popup obrigatório no primeiro login pede definir.
- Reset de senha pelo admin → próximo login do user dispara o popup novamente.
- Admin pode definir senha pra qualquer user diretamente (botão de cadeado no painel).
- Login abre no primeiro módulo liberado do user (v3.21.5) — não cai mais em tela bloqueada.

### Avatares (v3.19.0+)
Helper `userChip(userKey, {size})` central. Usa foto do `users-profile` (Minha Conta) ou iniciais com gradient verde Fiobras (admin gradient preto). Hover desktop = tooltip nativo; tap mobile = toast com nome.

Aplicado em: cards de Cor (criador), Timeline (autor), modal Cor (histórico interno), audit log, Sessões ativas, Gerenciar usuários.

`_resolveUserKey()` tolera registros legacy que gravaram nome em vez de chave (busca case-insensitive).

### Identidade visual (v3.14.0)
Marca: letra F com braço do meio = ponto amarelo. SVG `<symbol>` no defs.
- Sidenav logo: símbolo branco + ponto amarelo dentro do quadrado verde.
- Splash + login: marca composta (símbolo + Fiobras + HUB).
- Favicon: SVG inline data URI no `<link rel="icon">`.
- PWA icons: gerados runtime via canvas.

### Tags semânticas (v3.6.0)
Componente `.tag` com 8 modificadores: `success`, `warning`, `info`, `submitted`, `review`, `danger`, `neutral`, `brand`. Tokens CSS em `:root` e `[data-theme="dark"]`. Padrão pill, ícone à esquerda, Poppins 500. `.tag--sm` pra densidades.

Status do Cor migrados pra `.tag` + ícone semântico (entrada=warning+alert, desenvolvida=info+loader, enviada=submitted+paper-plane, em_ajuste=review+eye, aprovada=success+badge-check, cancelada=danger+x-circle).

### Central de Atualizações (v2.2.0+)
Clique na pílula de versão no header → modal com histórico (`CHANGELOG` array).

---

## 6. Versionamento e changelog

**Versão atual:** `v3.24.0` (18/04/2026).

**Fonte de verdade do changelog:** array `CHANGELOG` dentro do `index.html` + comment block box-drawing no topo do arquivo. Os dois devem estar em sync.

### Marcos importantes

| Versão | Marco |
|---|---|
| v3.24.0 | PWA polish: botão "Instalar app" no header (Chrome/Edge/Android via `beforeinstallprompt`) + tooltip educativo iOS Safari + dark mode auto via `prefers-color-scheme` (respeita SO se nunca escolheu manual). |
| v3.23.2 | `audit-log` e `active-sessions` viraram listeners lazy (ativam quando admin abre painel via `_activateXxx`/`_deactivateXxx`). -2 conexões WebSocket no boot. |
| v3.23.1 | Breakpoints unificados nos sub-apps (CRM/Preço/Manutenção). Projeto inteiro: 13 valores → 5. |
| v3.23.0 | Breakpoints unificados no `hub.css` — escala universal `360/480/640/768/1024` (era 7 valores, agora 5). CSS vars em `:root`. Sub-apps em v3.23.1. |
| v3.22.2 | A11y: init JS auto aplica `role=dialog`/`aria-modal`/`aria-labelledby` em todos `.modal-bg` + copia `title`→`aria-label` em buttons icon-only + trapFocus via MutationObserver + `prefers-reduced-motion` global. |
| v3.22.1 | Chart.js lazy-load via `loadChartJs()` (Promise cached). `renderCharts`/`renderProducao` viram async. -220ms FCP boot inicial. |
| v3.22.0 | PWA: Service Worker cache-first/SWR/network-first (FCP -65% em retorno) + inputs 16px global (anti-zoom iOS) + toast online/offline + toast "Nova versão". `/sw.js` arquivo físico. |
| v3.21.17 | **FIX CRÍTICO** Timeline: `set(tlRef, dados)` sobrescrevia o nó. Agora grava 1 registro por vez via `update(child(tlRef, id), evt)`. |
| v3.21.16 | CRM: fix aba Histórico de atividades (regressão — funções logEvento/renderHistoricoGlobal tinham sumido). |
| v3.21.15 | CRM Pipeline: pacote estético (header pill + botão `+` por coluna + bg sage + KPI bar topo + avatar responsável no card). |
| v3.21.14 | CRM: fix drag HTML5 (a/svg/button arrastáveis + dragleave flicker + drop em filhos). |
| v3.21.13 | CRM: drag voltou pra HTML5 nativo (desktop). Mobile sem drag (só botão ✈). Tempo "·4d" discreto, alerta a partir de 7d. |
| v3.21.12 | CRM: sempre abre na aba Pipeline (todos os usuários). |
| v3.21.11 | CRM: reestruturação interação cards (drag + popover idempotentes via delegation, sem onclick string). |
| v3.21.10 | CRM popover move direto (sem modal de confirmação) + botão paper plane no card. |
| v3.21.9 | Fix CRM drag com mouse (arrasta direto, sem long-press). Touch mantém long-press 280ms. |
| v3.21.8 | CRM card redesign clean (Excermol-style) + drag mobile via Pointer Events + pill "→ próxima etapa" + popover. |
| v3.21.7 | CRM cards mais clean (linhas alinhadas + header limpo). |
| v3.21.6 | CRM: fix re-render histórico + nova etapa "Encam. p/ Representante" + Preço libera não-admin. |
| v3.21.5 | Admin vê/define senha (`senhaPlain` + olho) + abre 1º módulo liberado + CRM FAB sempre. |
| v3.21.x | Role gerente + tabs sticky/fixed (Preço/CRM/Manutenção). |
| v3.18-3.20 | Avatares unificados, prioridade Cor, padronização visual sub-apps, fix tabs. |
| v3.16.0 | **Migração Firebase: fiobras-preco → fiobras-hub.** |
| v3.15.0 | **Firebase Anonymous Auth + rules `auth != null`.** |
| v3.14.0 | **Nova identidade visual** (símbolo F com ponto amarelo). |
| v3.13.0 | +7 users (manutenção+CRM), sessões ativas, filtros audit log. |
| v3.12.0 | CRUD usuários via UI + audit log. |
| v3.11.0 | Permissões por aba editáveis (depois removido em v3.20.4). |
| v3.10.0 | Painel admin: editar role/turno/módulos. |
| v3.9.0 | Edilson + Joacir + popup senha + painel "Gerenciar usuários". |
| v3.8.0 | Manutenção integrada via /manutencao/ iframe (FCM ativo). |
| v3.7.0 | Sidebar com toggle expand/collapse. |
| v3.6.0 | Sistema de tags semânticas (8 variantes). |
| v3.5.0 | Refinamento visual: Outfit Black 900 + ícones unificados. |
| v3.4.0 | CRM integrado via /crm/ iframe. |
| v3.3.0 | Timeline: filtro por tag + contador. |
| v3.1.0 | **Preço integrado via /preco/ iframe** (primeira integração de sub-app). |
| v3.0.0 | **CSS split** (`css/hub.css`) + módulos placeholder Manutenção/CRM. |
| v2.9.0 | Timeline: tags (Desenv/Problemas/Melhorias). |
| v2.8.0 | Shell novo: sidebar + topbar + user dropdown. |

---

## 7. Princípios e práticas não-negociáveis

### 7.1 Mobile-first obrigatório
**Regra mais importante.** Toda feature funciona em **mobile (320-480px) E desktop**. Nada vai pra `main` sem cobrir os dois.

Zonas de atenção mobile:
- Inputs: `font-size: 16px` mínimo (anti-zoom iOS).
- Touch targets: altura ≥44px.
- Modais viram bottom-sheet (slide from bottom).
- Tabelas: evitar; se inevitável, scroll horizontal explícito.
- Pílula flutuante mobile (`.mnav-pill`): reservar `padding-bottom: 110px` no `.wrap`.
- Toast: `bottom: 96px + safe-area` mobile.
- `overflow-x: hidden` de proteção.

### 7.2 Zero atrito
Login simples (dropdown de user + senha quando definida). Acesso instantâneo via PWA. Sem cadastro externo.

### 7.3 Tempo real
Firebase sincroniza ao vivo via `onValue`. Sem "salvar e atualizar".

### 7.4 Confiável
Dados nunca se perdem. Operações reversíveis quando possível. **Nunca rodar migração destrutiva sem aprovação explícita.**

### 7.5 Discreto e coeso
UI minimalista, sem ruído visual. **Zero emoji.** Todo módulo segue o mesmo design system (sage clarinho/Apple dark, Outfit/Poppins/DM Mono, ícones line stroke 1.5 round).

### 7.6 Mockup-first pra mudanças estruturais
Mudanças que envolvem layout, hierarquia visual, navegação ou nova feature visível **começam com mockup** (desktop + mobile lado a lado). Exceções diretas: bug fix isolado, ajuste de padding, ícone trocado, label corrigido, lógica.

### 7.7 Phase-by-phase validation
Uma mudança por vez. Bundlar é OK quando: (a) triviais e fortemente relacionadas, (b) cleanup óbvio dependência, (c) usuário pediu "faz tudo".

### 7.8 Fallbacks pra schema legado
Toda mudança de schema inclui fallback. Migração natural via leitura tolerante. Backfills automáticos com flag em localStorage pra rodar uma vez só.

### 7.9 Segurança de credenciais
Nunca hardcodar senhas/tokens/API keys do CLIENT. Senhas de user vão como SHA-256 + salt em `users-profile/{user}/senhaHash`. Rules do Firebase exigem `auth != null` (Anonymous Auth resolve transparente).

### 7.10 Comunicação direta
Português brasileiro casual. William usa voz-pra-texto — interpretar pelo contexto. Sem floreio. Resposta começa com ação/resultado. Explicar **porquê** quando decisão técnica é tomada.

---

## 8. Workflow de entrega

### 8.1 Checklist pra cada nova feature
1. **Entender o intent.** Perguntar se ambíguo. Não inventar.
2. **Mockup primeiro** se estrutural (§7.6).
3. **Aprovação** antes de tocar código.
4. **Identificar versão** (patch ou minor) e bumpar nos **4 lugares**.
5. **Implementar phase-by-phase**, validando.
6. **Schema novo?** Adicionar fallback.
7. **Path Firebase novo?** Documentar aqui no CLAUDE.md (§4).
8. **Mobile-first:** testar em 320-480px.
9. **Validar:** sintaxe JS + tags balanceadas + linhas.
10. **Commit + push pro main** (ver §8.5).
11. **Resumo curto** do que mudou.
12. **Atualizar CLAUDE.md** quando trouxer novo path/módulo/role/regra.

### 8.2 Versionamento estrito
**Toda alteração no `index.html` bumpa a versão. Sem exceção.**

- **MAJOR** (`X.x.x`) — refatoração grande, mudança de paradigma (raro).
- **MINOR** (`x.X.x`) — nova feature, novo módulo, mudança visível.
- **PATCH** (`x.x.X`) — bug fix, ajuste, refinamento.

**Os 4 lugares pra bumpar sempre:**
1. **Comment block** box-drawing no topo do `index.html`.
2. **Constante `CURRENT_VERSION`** no JS.
3. **Pílula `.hdr-pill`** no header (`vX.X.X`).
4. **Array `CHANGELOG`** — entry no topo + mover `current:true` pra entry nova.

**Cache-buster CSS:** ao bumpar o CSS, atualizar também o `?v=X.X.X` no `<link rel="stylesheet" href="css/hub.css?v=...">` pra forçar reload.

**Cache-buster sub-apps (iframe):** já é automático — o `iframe.src = 'preco/?v=' + CURRENT_VERSION` no `loadSubApp()`.

### 8.3 Validação após cada edição
Trio obrigatório:
```bash
# 1. Sintaxe JS (extrair scripts inline e rodar node --check)
python -c "import re; ..." && node --check _t.js
# 2. Tags HTML balanceadas (div, button, span)
# 3. Total de linhas (sanity check)
wc -l index.html
```
Pega 95% dos erros antes de chegar no usuário.

### 8.4 Testes pré-deploy
- Hard refresh (`Ctrl+Shift+R`) pra forçar reload.
- Aba anônima: testa fluxo de login do zero.
- Console (F12): zero erro `permission_denied` (rules) e zero `ReferenceError`.

### 8.5 Deploy / Git workflow
**William autorizou commits e pushes diretos pro `main` sem pedir aprovação a cada ação.** Worktree usa branch `claude/kind-kapitsa` que tracks origin/main; push via:
```bash
git push origin HEAD:main
```

**Operações destrutivas que ainda exigem confirmação explícita:**
- `git reset --hard`
- `git push --force` / `--force-with-lease`
- `git clean -f`, `git restore .`, `git checkout -- .`
- Deletar branches
- Qualquer coisa que possa perder trabalho não commitado

GitHub Pages rebuilda automaticamente em 1-2 min após push.

---

## 9. Padrões técnicos

### 9.0 Breakpoints (v3.23.0)
Escala universal de 5 valores. **Todo novo `@media` deve usar exclusivamente esses números:**
- `360px` (--bp-xs) — Galaxy A10, Android low-end
- `480px` (--bp-sm) — mobile padrão
- `640px` (--bp-md) — phablet, mobile landscape
- `768px` (--bp-lg) — tablet portrait
- `1024px` (--bp-xl) — desktop pequeno

CSS vars documentadas no `:root` do `hub.css`. Não usar valores intermediários (520, 680, 700, 860, etc) — consolida pra cima ou pra baixo na escala.

### 9.1 Timezone e datas
- **Timezone:** America/Sao_Paulo (UTC-3).
- **Salvar em memória:** ISO local string ou timestamp UTC consistente. Nunca misturar.
- **Datas relativas em contexto:** sempre converter "quinta" → data absoluta ao gravar.

### 9.2 Escopo do JS (dois `<script>`)
- **Símbolos `const`/`let` dentro do module NÃO vazam pro script normal.** `db`, `ref`, `onValue`, `update`, `set`, `getAuth` são const de módulo.
- **Padrão de ponte:** módulo expõe via `window._salvarXxxFirebase` / `window._xxxData`. Script normal chama via `window.`.
- **Lição v2.6.1:** subscription Firebase no script normal quebra boot com `ReferenceError`. Sempre no bloco module.

### 9.3 Babel-safe / browser-native
- **Sem transpilação.** JS roda nativo em browsers modernos (Chromium, Safari iOS 15+, Firefox).
- **OK usar:** arrow functions, async/await, optional chaining (`?.`), nullish coalescing (`??`), template literals, destructuring, spread, modules ES nativo.
- **Evitar:** decorators, top-level await, features stage < 4.
- **CSS:** `color-mix()` ok, `:has()` ok, custom properties, container queries ok.

### 9.4 Permissões
- `getEffectiveRole(userKey)` / `getEffectiveTurno(userKey)` / `getEffectiveModules(userKey)` retornam o efetivo (override do profile > USERS hardcoded > default por role).
- **Admin/gerente sempre veem todos os módulos** (ALL_MODULES) — overrides são ignorados pra eles.
- `canAccessModule(mod)` checa user logado contra `getEffectiveModules`.
- `canAccessTab(tab)` consulta `TAB_PERMS[tab]` (hoje vazio) + override do profile + admin tem bypass.
- **Toda exclusão/operação destrutiva é gated por role.** Botão de excluir não existe pra produção. Painel admin checa `window._userRole === 'admin'` em cada handler sensível.

### 9.5 Fotos e assets
- **Compressão no client** antes de gravar em Firebase.
- **Timeline:** 1200px máx, JPEG 0.82 (~210KB/foto). Até 4 fotos por registro com legenda. Schema `fotos:[{data,desc}]`.
- **Avatar (Minha Conta):** crop quadrado 400px, JPEG 0.82.

### 9.6 Ícones e tipografia
- **Ícones: SVG `<symbol>` no defs global, usar via `<svg class="icon"><use href="#i-..."/></svg>`.** Stroke 1.5 round, fill none, currentColor.
- **Tipografia:**
  - Outfit (display, weights 300-900) — Outfit Black 900 em hero/KPI/brand/dropdown name.
  - Poppins (UI, body, tags).
  - DM Mono (números, IDs, eyebrows uppercase, audit log timestamps).
- Labels em **sentence case**, eyebrows em DM Mono UPPERCASE.

### 9.7 Tema (light/dark)
Tokens CSS em `:root` e `[data-theme="dark"]`:
- `--bg`, `--bg-deep`, `--surface`, `--surface2`, `--border`, `--border2`, `--text`, `--muted`, `--muted2`.
- 8 pares de tokens de tag (`--tag-success-bg/fg`, etc.).
- **Light:** sage clarinho `#EDF1EA` + brancos puros.
- **Dark:** Apple style — `#1C1C1E` / `#2C2C2E` / `#3A3A3C`, nunca preto puro.

### 9.8 Sub-apps (iframes)
- 3 sistemas (`preco/`, `crm/`, `manutencao/`) vivem como pastas separadas, embutidos via iframe.
- **Iframe altura fixa** (v3.21.4): `.subapp-frame-wrap`, `.subapp-frame` e o `.panel#panel-{mod}.active` têm `height:calc(100vh - 80px)` (110px mobile) com `overflow:hidden` no wrap. Garante scroll só dentro do iframe — caso contrário, position:fixed das tabs internas falha.
- **Sticky → fixed**: tabs internas dos sub-apps são movidas pro `<body>` via JS no bootstrap + `position:fixed;top:0` inline.
- **Cache-buster** automático via `?v=CURRENT_VERSION` no `iframe.src`.
- Cada sub-app tem override CSS no topo do body (esconde header/login/splash internos, aplica tokens do HUB, ajusta tabs).
- Cada sub-app faz `signInAnonymously` no boot.

---

## 10. Coisas que NÃO devem acontecer

- ❌ **Deploy desktop-only.** Mobile 320-480px sempre testado.
- ❌ **Bumpar versão em um só lugar.** Sempre os 4 (comment block, `CURRENT_VERSION`, `.hdr-pill`, `CHANGELOG`).
- ❌ **Esquecer cache-buster CSS** ao mexer no `hub.css`.
- ❌ **Emoji na UI.** Zero.
- ❌ **Framework/build step.** Vanilla JS num único HTML.
- ❌ **Hardcodar senhas/tokens/API keys** no client.
- ❌ **Migração destrutiva sem aprovação explícita.** Backfills sempre com flag em localStorage pra rodar uma vez.
- ❌ **Mudança de schema sem fallback** pra dados legados.
- ❌ **Gravar Firebase a partir do script normal.** Sempre pelo bloco module.
- ❌ **Inputs com `font-size < 16px` em mobile** (iOS dá zoom).
- ❌ **Esconder módulos sem permissão.** Mostrar com cadeado SVG + toast.
- ❌ **Tap-to-detail em listas com ações frequentes.** Aprendido na v2.6.1.
- ❌ **Bundlar múltiplas mudanças** num turn sem pedido explícito.
- ❌ **Mockup só desktop** pra mudança estrutural.
- ❌ **Floreio na resposta.** Sem "Ótima ideia!".
- ❌ **`git reset --hard`, `--force`, `rm -rf`** sem pedido explícito.
- ❌ **Criar arquivos `.md` de planejamento/análise** sem o William pedir.
- ❌ **Modificar `FIOBRAS_BASE.md`** a partir deste projeto — vive em outro lugar.
- ❌ **Mexer em `firebase-rules.json` sem testar via aba anônima** depois de aplicar.
- ❌ **Adicionar Firebase Auth com email/senha.** William escolheu manter login custom user+senha; Anonymous Auth resolve as rules sem mudar UX.
- ❌ **`set(ref, objetoInteiroDaColecao)`** — sobrescreve o nó. Sempre `update(child(ref, id), payload)` pra coleções keyed por ID. (Bug v3.21.17 que apagou registros da Timeline.)

---

## 11. Notas finais

- **Documento vivo.** Atualizar quando paths Firebase mudarem, módulos forem adicionados, roles redefinidas, regras estabelecidas. Última grande revisão: 16/04/2026 (v2.0 do doc, refletindo HUB v3.21.4).
- **Em conflito entre este `CLAUDE.md` e instruções verbais:** as instruções vencem; doc é atualizado.
- **Memória persistente** do William em `C:/Users/willi/.claude/projects/.../memory/MEMORY.md` — autoriza commits/pushes diretos em main.
- **Regra §7.1 (mobile-first obrigatório)** é a mais importante. Estabelecida na v2.5.0.

---

*Fiobras HUB — mini-ERP têxtil interno · CLAUDE.md v2.18 · 18/04/2026*
