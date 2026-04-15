# Fiobras HUB — CLAUDE.md

> **Contexto persistente do projeto para o Claude Code.** Leia este documento no início de toda sessão antes de tocar em código. Ele descreve o que o sistema é, como está construído, as regras não-negociáveis e o workflow de entrega esperado.
>
> **Versão do doc:** 1.1 — 15/04/2026
> **Versão atual do HUB:** v2.9.0
> **Mantenedor:** William Schulz · Fiobras Fios Tintos Ltda.
> **Repo:** `williamscchulz-was/fiobras-dashboard` (branch `main`)

---

## 1. O que é o projeto

**Fiobras HUB** é o **mini-ERP interno da Fiobras Fios Tintos** — uma plataforma única, mobile-first, onde toda a operação da empresa converge: resultados gerenciais, produção mensal e diária, desenvolvimento de cor, apontamento de tintoria por turno, timeline de testes/ocorrências e estatística de mix de tingimento.

**Para que serve:**
- **Direção** acompanha KPIs do ano (Receita Bruta, LL Ajustado, IPAC, Clientes Novos) e bate metas por nível (Meta / Meta Plus / Super Meta).
- **Produção** lança produção mensal de fios (CV, CO, PES, PAC), eficiências e reprocesso.
- **Laboratório** gerencia pipeline de desenvolvimento de cor (entrada → desenvolvida → enviada → em ajuste → aprovada/cancelada) e registra testes/ocorrências na Timeline.
- **Líderes de turno** (Adelir/Alexander/Djoniffer) apontam produção da tintoria por turno e fibra.
- **Todos** consultam histórico plurianual e estatística de mix de cor por fibra.

**Visão de longo prazo (12-18 meses):** substituir planilhas paralelas, grupos de WhatsApp e comunicação verbal por uma única fonte de verdade, acessível via PWA no celular e no desktop. Próximos módulos no roadmap: **Lançamento de Produção Diária**, **Envio de Relatórios**, **Preço de Venda** (hoje WIP), estoque, manutenção, CRM leve.

**Nome:** "HUB" substituiu "Fiobras Dashboard" na v2.3.0 — reflete o papel real (ponto único de entrada), não só a primeira encarnação (dashboard de metas).

---

## 2. Stack tecnológica

### Frontend
- **HTML + CSS + Vanilla JS** num único arquivo `index.html` (~6200 linhas em v2.8.1).
- **Sem frameworks.** Zero React/Vue/Svelte/Tailwind compilado. **Zero build step.**
- **Fontes:** Outfit (display), Poppins (UI), DM Mono (números/IDs) — Google Fonts via CDN.
- **Charts:** Chart.js 4.x via CDN.
- **Ícones:** SVG inline. **Zero emoji na UI.** Zero CDN de ícones.

### Backend
- **Firebase Realtime Database** — projeto `fiobras-preco`.
- URL: `https://fiobras-preco-default-rtdb.firebaseio.com`.
- Sync em tempo real via `onValue`; gravação via `set` / `update`.
- Cada feature usa um path separado pra isolar dados (ver §4).

### Hospedagem
- **GitHub Pages** no repo `williamscchulz-was/fiobras-dashboard`, branch `main`.
- Deploy via **Fiobras Deployer** (ferramenta interna separada).

### PWA
- Instalável em iOS, Android, Windows.
- Manifest gerado via JS blob (não estático).
- Ícones programáticos (180/192/512px) — fundo verde Fiobras `#008835` + símbolo branco.
- Tema verde na barra de status.

---

## 3. Arquivos principais

| Arquivo | Papel |
|---|---|
| `index.html` | **Toda a aplicação.** ~6200 linhas: HTML estrutural, CSS em `<style>`, lógica em dois `<script>` (um normal + um `type="module"` pro Firebase SDK). |
| `README.md` | README curto do repo (GitHub Pages). |
| `CLAUDE.md` | Este documento. Contexto persistente pro Claude Code. |
| `FIOBRAS_BASE.md` | Design system universal Fiobras (fora deste repo, em outro projeto). Fonte de verdade pra cores brand, tipografia, componentes base. |

**Ferramentas separadas (não são parte do HUB, mas convivem):**
- `importar-stats-cor.html` — importador one-shot do histórico de mix de cor (2020-2026). Rodado uma vez, arquivado.
- **Fiobras Deployer** — ferramenta externa que faz o push pro GitHub Pages (config em `deployer/` no Firebase, separado do HUB).

**Dentro do `index.html` há dois blocos `<script>` distintos:**
- **Script normal** (topo do JS) — lógica da UI, state local, helpers, render.
- **Script `type="module"`** (final) — importa Firebase SDK, define `db`, `ref`, `onValue`, `set`, `update`, e expõe funções de persistência via `window._salvarXxxFirebase`, `window._mixCoresData`, etc. **Essa separação é importante:** símbolos do module (`db`, `ref`, ...) NÃO são visíveis no script normal. Sempre gravar Firebase a partir do bloco module.

---

## 4. Estrutura de dados (Firebase Realtime Database)

**Backend único: Firebase Realtime Database** (projeto `fiobras-preco`).

### Paths atuais (v2.8.1)

| Path | Conteúdo | Schema resumido |
|---|---|---|
| `metas-2026` | Lançamentos mensais: Receita Bruta, LL Ajustado, IPAC, Clientes Novos. | `{mes}/{metrica} = valor` |
| `producao-2026` | Produção mensal de fios. | `{mes}/{cv,co,pes,pac,efTinturaria,efRepasse,diasDesenv,reprocesso}` |
| `cores-2026` | Desenv. de cor — entrada, status, histórico, obs, fotos. | `{id}/{codigo,cliente,cor,status,historico:[...],foto,obs,...}` |
| `apontamento-tintoria-2026` | Lançamento diário da tintoria por turno/fibra. | `{mes}/{dia}/{turno}/{fibra} = kg` |
| `timeline-2026` | Eventos (testes, ocorrências). Desde v2.7.0 suporta múltiplas fotos. | `{id}/{objetivo,cliente,op,cor,fotos:[{data,desc}],desc,resultado,...}` |
| `mix-cores-{ano}` | Stats Cor — mix de tingimento por fibra/categoria. **Populado 2020-2026.** | `{mes}/{fibra}/{categoria} = kg` · ex: `mix-cores-2026/2/co/branco = 44327.31` |
| `config/adminPassword` | Senha do admin (não hardcoded no client). | string |
| `deployer/` | Config do Fiobras Deployer (auth, token, webhook, history). **Separado do HUB.** | — |

### Fibras e categorias (Stats Cor)
- **Fibras:** `co` (CO/Algodão), `pac` (PAC/Acrílico), `pes` (PES/Poliéster), `cv` (CV/Viscose). Agregado "total" é soma dinâmica.
- **Categorias:** `branco`, `clara`, `media`, `escura`, `intensa`, `preta`.

### Paths futuros (roadmap)

| Path | Conteúdo |
|---|---|
| `producao-diaria/{ano}/{mes}/{dia}/{id}` | Lançamentos granulares de produção diária. |
| `relatorios/templates/{id}` | Templates de relatório. |
| `relatorios/disparos/{id}` | Histórico de disparos. |
| `relatorios/destinatarios/{id}` | Lista de destinatários. |

### Regras de gravação
- **Sempre passar pelo bloco module.** Funções expostas via `window._salvarTlFirebase`, `window._salvarAptFirebase`, `window._salvarScFirebase`, etc.
- **Nunca hardcodear credenciais** — senhas vão em `config/{nome}` no Firebase.
- **Sem migrações destrutivas sem aprovação explícita.**
- **Fallbacks pra schema antigo obrigatórios** — ex: `const titulo = evt.objetivo || evt.desc || '(sem título)';`. Ao editar registro antigo, ele carrega via fallback e ao salvar é gravado com schema novo (migração natural).

---

## 5. Features implementadas (estado atual — v2.8.1)

### Shell (v2.8.0+)
- **Desktop:** sidebar à esquerda com ícones dos módulos, topbar com breadcrumb (módulo › aba) e dropdown de usuário (tema, versão, logout). Token `--bg-deep` pra profundidade em camadas no dark.
- **Mobile (≤640px):** sidebar some; mantém pílula flutuante estilo Nubank no rodapé (Gerencial/Produção/Preço).

### Gerencial (admin only)
- **2026** — KPIs do ano (Receita Bruta, LL Ajustado, IPAC, Clientes Novos), progresso anual por nível (Meta / Meta Plus / Super Meta), lançamento mês a mês, prêmios mensais e anuais.
- **Histórico** — comparativo plurianual 2020-2026 com gráficos.

### Produção (todos os usuários, com granularidade por aba)
- **Produção** — produção mensal de fios (CV, CO, PES, PAC), IPAC calculado, eficiência tinturaria/repasse, dias desenvolvimento, reprocesso.
- **Desenv. Cor** — pipeline de cores: entrada → desenvolvida → enviada → em_ajuste → aprovada/cancelada. Indicador de tempo pausado (só "enviada" pausa, porque depende de cliente externo). Ações inline no card (Aprovar/Enviar/Em ajuste/Cancelar). Modal de detalhe com foto, chips, histórico timeline vertical, ações de admin.
- **Apontamento** — lançamento diário da tintoria. Calendário mensal → detalhe do dia com 3 turnos (3º → 1º → 2º) e 4 fibras (CO/PAC/PES/CV). Líderes de turno editam só o próprio turno (outros turnos read-only com cadeado + banner amarelo).
- **Timeline** — feed vertical estilo Nubank. Desde v2.7.0: **até 4 fotos HD** por registro (1200px máx, JPEG 0.82, ~210KB/foto), cada foto com legenda própria. Card mostra 1ª foto + badge +N. Modal detalhe em stack vertical com legenda em itálico. Fallback pra registros com `foto` legacy único.
- **Stats Cor** *(v2.6.0+, permissão por aba)* — estatística de mix de cor tingida por fibra. Filtro de fibra (Total/CO/PAC/PES/CV) + calendário de meses (com navegação de mês, v2.7.4) + donut SVG do mês selecionado + lista de categorias com barras + KPIs (dominante e vs ano anterior) + histórico plurianual 2020-2026 culminando em barra **TOTAL** destacada em verde com % geral acumulado. Modal "Lançar Mês" (admin) com 4 abas de fibra × 6 inputs cada. **Acesso:** admin + Anderson + Aldo + Geovani + Lucivane.

### Preço de Venda (WIP — em construção)
Placeholder visível. Admin vê badge "WIP" + toast "em construção"; produção vê cadeado + toast "Sem permissão".

### Sistema de permissões (v2.5.0+ / v2.6.0+)
- **Módulos:** todos visíveis pra todos. Sem permissão = opacity reduzida + cadeado SVG + toast "Sem permissão".
- **Abas:** permissão granular via `TAB_PERMS = { statscor: ['admin','anderson','aldo','geovani','lucivane'] }`. Abas sem permissão ficam `display:none` (não mostram cadeado — seria visualmente confuso em sub-abas).
- **WIP vs Locked:** se usuário não tem permissão E módulo é WIP, **cadeado vence** (permissão tem prioridade).

### Usuários (v2.8.1)

| Usuário | Role | Turno | Senha | Observação |
|---|---|---|---|---|
| William (admin) | `admin` | — | sim | Acesso total. |
| Anderson | `producao` | — | não | Produção + Stats Cor. Gerencial/Preço bloqueados. |
| Aldo | `producao` | — | não | Idem. |
| Geovani | `producao` | — | não | Idem. |
| Lucivane | `producao` | — | não | Idem (acesso a Stats Cor). |
| Adelir | `producao` | 1º | não | **Sem Stats Cor.** Apontamento só edita 1º turno. |
| Alexander | `producao` | 2º | não | **Sem Stats Cor.** Apontamento só edita 2º turno. |
| Djoniffer | `producao` | 3º | não | **Sem Stats Cor.** Apontamento só edita 3º turno. |

Usuários em `USERS` dentro do `<script>` do `index.html`. Schema:
```js
{ nome: 'Nome Display', senha: null|'senha', role: 'admin'|'producao', turno: 1|2|3|undefined }
```

### Central de Atualizações (v2.2.0+)
Clique na pílula de versão no header abre modal com histórico (`CHANGELOG` array).

### PWA
Instalável. Login simples sem cadastro (só seleciona usuário; senha só pro admin).

---

## 6. Versão atual e changelog

**Versão atual:** `v2.8.1` (14/04/2026).

### Changelog resumido (top-down, mais recente primeiro)

| Versão | Data | Resumo |
|---|---|---|
| **v2.8.1** | 14/04/2026 | Fix shell: dropdown cortado + breadcrumb. |
| **v2.8.0** | 14/04/2026 | Shell novo: sidebar + topbar + user dropdown. Token `--bg-deep`. Mobile mantém pílula flutuante. |
| v2.7.4 | 14/04/2026 | Stats Cor: navegação de mês + Lucivane. |
| v2.7.3 | 14/04/2026 | Fix botão Lançar Mês (Stats Cor). |
| v2.7.2 | 14/04/2026 | Fix texto da tab ativa sumia em mobile. |
| v2.7.1 | 14/04/2026 | Mobile: fix cadeado (admin) + tabs fixas em grid + labels `data-short`. |
| **v2.7.0** | 14/04/2026 | Timeline: múltiplas fotos HD + legendas (até 4 fotos, 1200px, JPEG 0.82). |
| v2.6.3 | 10/04/2026 | Cor: fix botões edit no modal detalhe. |
| v2.6.2 | 10/04/2026 | Stats Cor: gráfico histórico + botão lançar. |
| v2.6.1 | 10/04/2026 | **Cor: rollback parcial** — ações voltam pro card (tap-to-detail só quebrou fluxo). Fix boot: subscription Stats Cor no módulo correto. |
| **v2.6.0** | 09/04/2026 | **Stats Cor** — mix de tingimento por fibra. Paleta mono verde Fiobras. Permissão granular por aba (`TAB_PERMS`). Lucivane adicionada. |
| **v2.5.0** | 09/04/2026 | **Patch Mobile First** (5 fases bundladas): anti-zoom iOS, nav pílula flutuante, mdet encorpados, tap-to-detail Cor (depois revertido), polish. Rename "Resultados" → "Gerencial". |
| v2.4.0 | 08/04/2026 | Módulo Apontamento Tintoria. 3 líderes de turno adicionados. |
| v2.3.0 | 08/04/2026 | Rename "Dashboard" → "HUB". Tema light sage clarinho + dark Apple style. Pill 3D de módulos. Preço de Venda como WIP. |
| v2.2.x | — | Desenv. Cor: indicador tempo pausado; regra de pausa ("enviada" pausa). |
| v2.2.0 | — | Header limpo + Central de Atualizações. |
| v2.1.x | — | Nav modular + Timeline (feed Nubank). |

**Fonte de verdade do changelog:** array `CHANGELOG` dentro do `index.html` + comment block box-drawing no topo do arquivo. Os dois devem estar em sync.

---

## 7. Princípios e práticas não-negociáveis

### 7.1 Mobile-first obrigatório
**Regra mais importante do projeto.** Toda feature nasce pensando em **celular ≤375px** e só depois escala pro desktop. **Nenhuma mudança vai pra `main` sem estar adequada mobile E desktop simultaneamente.** Faixa crítica mobile: **320px–480px** (iPhone SE até iPhone 14 Pro).

Zonas de atenção mobile:
- Inputs: `font-size: 16px` mínimo (senão iOS dá zoom).
- Touch targets: altura ≥44px.
- Cards densos viram 1-col encorpado com hierarquia vertical.
- Modais viram bottom-sheet (slide from bottom) com handle de arrastar.
- Tabelas: evitar. Se inevitável, scroll horizontal explícito.
- Pílula flutuante mobile (`.mnav-pill`): reservar `padding-bottom: 110px` no `.wrap`.
- Toast: `bottom: 96px + safe-area` em mobile (não colidir com pílula).
- `overflow-x: hidden` de proteção.

### 7.2 Zero atrito
Login simples (só seleciona usuário). Acesso instantâneo via PWA. Sem cadastro.

### 7.3 Tempo real
Firebase sincroniza ao vivo via `onValue`. Sem "salvar e atualizar".

### 7.4 Confiável
Dados nunca se perdem. Operações reversíveis quando possível. **Nunca rodar migração destrutiva sem aprovação explícita.**

### 7.5 Discreto e coeso
UI minimalista, sem ruído visual. **Zero emoji.** Todo módulo segue `FIOBRAS_BASE.md` — parece um produto único, não 5 ferramentas separadas.

### 7.6 Mockup-first pra mudanças estruturais
Mudanças que envolvem layout, hierarquia visual, navegação ou nova feature visível **começam com mockup** (desktop + mobile lado a lado), com opções e trade-offs, antes de tocar em código. Exceções que vão direto: bug fix isolado, ajuste pequeno de padding/margem, ícone trocado, label corrigido, campo num form existente, lógica de cálculo.

### 7.7 Phase-by-phase validation
Uma mudança por vez. Não bundlar várias coisas no mesmo turn sem aprovação explícita. Bundlar é OK só quando: (a) triviais e fortemente relacionadas, (b) cleanup óbvio que é dependência, (c) usuário pediu explicitamente "faz tudo de uma vez".

### 7.8 Fallbacks pra schema legado
Toda mudança de schema inclui fallback. Migração natural (carregar via fallback ao editar, gravar com schema novo ao salvar).

### 7.9 Segurança de credenciais
Nunca hardcodear senhas/tokens/API keys. Senhas em `config/{nome}` no Firebase. Tokens externos idealmente em Cloud Functions (não no client).

### 7.10 Comunicação direta
Português brasileiro casual. William usa voz-pra-texto — interpretar pelo contexto. Sem floreio. Resposta começa com ação/resultado. Explicar **porquê** quando decisão técnica é tomada (decisões silenciosas viram bugs futuros).

---

## 8. Workflow de entrega

### 8.1 Checklist pra cada nova feature

1. **Entender o intent.** Perguntar se ambíguo. Não inventar.
2. **Mockup primeiro** se estrutural (§7.6). Desktop **E** mobile.
3. **Aprovação do mockup** antes de tocar no `index.html`.
4. **Identificar versão correta** (patch ou minor) e bumpar nos **4 lugares**.
5. **Implementar phase-by-phase**, validando cada etapa.
6. **Schema novo?** Adicionar fallback pra dados legados.
7. **Path Firebase novo?** Documentar aqui no CLAUDE.md (§4).
8. **Permissão por role?** Produção vê cadeado (não esconder).
9. **Mobile-first:** testar em 320-480px. Modal vira bottom-sheet? Inputs ≥16px? Conteúdo não fica atrás da pílula flutuante?
10. **Desktop:** layout respira em >1024px? Sidebar e topbar seguem funcionando?
11. **Validar:** sintaxe JS + tags balanceadas + linhas.
12. **Salvar em outputs**, `present_files`.
13. **Resumo curto** do que mudou + por quê.
14. **Atualizar CLAUDE.md** se trouxe novo path, módulo, role ou regra.

### 8.2 Versionamento estrito

**Toda alteração no `index.html` bumpa a versão. Sem exceção.**

- **MAJOR** (`X.x.x`) — refatoração grande, mudança de paradigma (raro).
- **MINOR** (`x.X.x`) — nova feature, novo módulo, mudança visível significativa.
- **PATCH** (`x.x.X`) — bug fix, ajuste pequeno, refinamento.

**Os 4 lugares pra atualizar sempre:**
1. **Comment block** box-drawing no topo do `index.html`.
2. **Constante `CURRENT_VERSION`** no JS (usada pela Central de Atualizações).
3. **Pílula no header** (`<div class="hdr-pill">vX.X.X</div>` — hoje dentro do topbar/dropdown).
4. **Array `CHANGELOG`** — adicionar entry no topo, mover flag `current:true` pra entry nova.

### 8.3 Validação após cada edição

Trio obrigatório:
```bash
# 1. Sintaxe JS (extrair scripts inline e rodar node --check)
python3 -c "import re; ... extrair" && node --check /tmp/extracted.js
# 2. Tags HTML balanceadas (div, button, span, nav, style)
# 3. Total de linhas (sanity check)
wc -l index.html
```
Pega 95% dos erros antes de chegar no usuário.

### 8.4 Salvar e apresentar

1. `cp index.html /mnt/user-data/outputs/index.html` (ou equivalente no ambiente).
2. `present_files` com o output.
3. Resumo curto (sem repetir code todo).

### 8.5 Deploy

Deploy é feito pelo **Fiobras Deployer** (ferramenta externa). Claude **não faz push** nem interage com Git sem pedido explícito.

---

## 9. Padrões técnicos

### 9.1 Timezone e datas
- **Timezone:** America/Sao_Paulo (UTC-3). Toda data exibida é local do Brasil.
- **Ao salvar datas em memória:** ISO local string ou timestamp UTC consistente. Nunca misturar.
- **Ao converter relativas em absolutas (memória/contexto):** sempre converter "quinta" → data absoluta no momento da conversa.

### 9.2 Escopo do JS
- Dois blocos `<script>`: normal e `type="module"`.
- **Símbolos `const`/`let` dentro do module NÃO vazam pro script normal.** `db`, `ref`, `onValue`, `update`, `set` são const de módulo.
- **Padrão de ponte:** módulo expõe funções via `window._salvarXxxFirebase`, `window._xxxData`. Script normal chama `window._salvarTlFirebase(...)` etc.
- **Lição v2.6.1:** pôr subscription Firebase no script normal quebra todo o boot com `ReferenceError`. Sempre no bloco module.

### 9.3 Babel-safe / browser-native
- **Sem transpilação.** Todo JS tem que rodar nativo em browsers modernos (Chromium recente, Safari iOS 15+, Firefox recente).
- **OK usar:** arrow functions, async/await, optional chaining (`?.`), nullish coalescing (`??`), template literals, destructuring, spread/rest, `for...of`, modules ES nativo.
- **Evitar:** decorators, private class fields (`#foo`) se duvidoso, top-level await, features stage < 4.
- **CSS:** `color-mix()` ok (fallback quando crítico), `:has()` ok, custom properties, container queries ok.

### 9.4 Permissões
- **Checar permissão ANTES de renderizar ações destrutivas.** Botão de excluir não existe pra produção.
- **Toda exclusão é gated por role** — checar `USERS[currentUser].role === 'admin'` (ou equivalente).
- **Permissão granular por aba:** `canAccessTab(tab)` consulta `TAB_PERMS[tab]`. Abas não listadas herdam do módulo.

### 9.5 Fotos e assets
- **Compressão no client** antes de gravar em Firebase.
- **Timeline (v2.7.0):** 1200px máx, JPEG qualidade 0.82 (~210KB/foto). Até 4 fotos por registro, cada uma com legenda. Schema: `fotos: [{data, desc}]`. Fallback pra `foto` legacy único.

### 9.6 Ícones e tipografia
- **Ícones: SVG inline sempre.** Zero emoji, zero CDN.
- **Tipografia:** Outfit (display), Poppins (UI), DM Mono (números/IDs). Labels em **sentence case** (não all-caps).

### 9.7 Tema (light/dark)
- Tokens CSS: `--bg`, `--bg-deep` (v2.8.0+), `--surface`, `--surface2`, `--border`, `--border2`, `--text`, `--muted`, `--muted2`.
- **Light:** sage clarinho bg + cards brancos puros (v2.3.0+).
- **Dark:** Apple style — camadas de cinza `#1C1C1E` / `#2C2C2E` / `#3A3A3C`, nunca preto puro.

---

## 10. Coisas que NÃO devem acontecer

- ❌ **Deploy desktop-only.** Se mobile 320-480px não foi testado/adaptado, não é pronto.
- ❌ **Bumpar versão em um só lugar.** Sempre os 4 lugares (comment block, `CURRENT_VERSION`, pílula, `CHANGELOG`).
- ❌ **Esquecer de bumpar versão** quando edita `index.html`.
- ❌ **Emoji na UI.** Zero.
- ❌ **Framework/build step.** Nada de React/Vue/Tailwind compilado/webpack. Vanilla JS num único HTML.
- ❌ **Hardcodar senhas/tokens/API keys** no `index.html`.
- ❌ **Migração destrutiva sem aprovação explícita.**
- ❌ **Mudança de schema sem fallback** pra dados legados.
- ❌ **Gravar Firebase a partir do script normal.** Sempre pelo bloco module.
- ❌ **Inputs com `font-size < 16px` em mobile** (iOS dá zoom).
- ❌ **Esconder módulos sem permissão.** Mostrar com cadeado SVG + toast.
- ❌ **Esconder abas com cadeado** — abas sem permissão ficam `display:none` (diferente de módulos). Cadeado em sub-aba polui visualmente.
- ❌ **Tap-to-detail em listas com ações frequentes.** Aprendido na v2.6.1 — Desenv. Cor precisa das ações inline no card. Tap-to-detail só pra **listas de leitura** (Timeline, históricos).
- ❌ **Bundlar múltiplas mudanças** num turn sem pedido explícito do William.
- ❌ **Mockup só desktop** pra mudança estrutural.
- ❌ **Implementar feature estrutural** sem aprovação do mockup.
- ❌ **Floreio na resposta.** Sem "Ótima ideia!". Começa com ação/resultado.
- ❌ **Fazer push pro GitHub ou rodar destrutivo (git reset --hard, force push, rm -rf)** sem pedido explícito.
- ❌ **Criar arquivos `.md` de planejamento/análise** sem o William pedir. Trabalhar do contexto da conversa.
- ❌ **Modificar `FIOBRAS_BASE.md`** a partir deste projeto — ele é fonte universal, vive em outro lugar.

---

## 11. Notas finais

- **Este documento é vivo.** Atualizar quando paths Firebase mudarem, módulos forem adicionados, roles forem redefinidas, regras forem estabelecidas.
- **Em caso de conflito entre este `CLAUDE.md` e `FIOBRAS_BASE.md`:** BASE vence em design system universal; este vence em decisões específicas do HUB.
- **Em caso de conflito entre este doc e instruções verbais do William:** as instruções verbais vencem, e este doc deve ser atualizado pra refletir a nova regra.
- **A regra §7.1 (mobile-first obrigatório)** é a mais importante. Foi estabelecida na v2.5.0 porque o HUB até então era "desktop-first com remendos mobile". Não deixe isso voltar a acontecer.

---

*Fiobras HUB — mini-ERP têxtil interno · CLAUDE.md v1.0 · 15/04/2026*
