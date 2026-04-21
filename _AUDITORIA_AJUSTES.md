# Auditoria de Ajustes · v3.32+

Lista de ajustes acumulada conforme William reporta. Não implementar nada antes de ele finalizar a lista e aprovar mockups por bloco.

---

## Ajuste 1 · Card de máquina (Manutenção → Inventário)

**Onde:** painel "Máquinas" → cards do inventário (renderizados em `renderMaquinas()` no `manutencao/index.html`).

**Bugs:**
- **Texto bugado:** "24 preventivas cadastradas · ver no detalhe" aparece com problema de renderização (parte do texto verde/cinza cortada ou estranha — visível no print).

**Redesign solicitado** (referência: card "Bank Account · Chase Bank"):
- Header pequeno em DM Mono UPPERCASE no canto superior esquerdo (ex: "MÁQUINA · MECÂNICA")
- Badge no canto superior direito (estilo "VERIFIED" verde) — pode ser status (ativo/parado) ou só o código
- Nome principal grande e ar de respiração (Outfit 700, mais peso que hoje)
- Linha de identificação tipo "•••••• 6789" — adaptar pro nosso contexto: pode ser TAG/série da máquina em DM Mono
- Nome do responsável/zelador da máquina (se houver) — análogo ao "Darrell Williamson"
- Localização (setor/posição na fábrica) — análogo ao endereço
- Bordas mais suaves (radius lg), background dark mais profundo, sem border-left destacada
- Mais espaçamento interno (padding generoso)

**Status:** aguardando próximos ajustes do William antes de mockar.

---

## Ajuste 2 · Unificar "+ Preventiva" com multi-select (remover "+ Em massa")

**Onde:** painel Preventiva → botões do topo (hoje 2 botões: "+ Preventiva" e "+ Em massa").

**Mudança:**
- Remover o botão **"+ Em massa"** e o modal separado (v3.32.5 inteiro).
- No modal **"+ Preventiva"** (o único restante), transformar o campo **Máquina** (hoje `<select>` single) em **multi-select** (checkbox list ou select múltiplo).
- Se user marca **1 máquina** → salva 1 preventiva (fluxo atual)
- Se user marca **N máquinas** → salva N preventivas em lote (mesmos campos, loop de `_fbPushPrev`)

**Motivo:** UX mais simples — 1 botão só, o usuário decide quantas máquinas aplicar ao mesmo tempo na hora.

**Impacto:**
- Remove: botão "+ Em massa", modal `#modal-massa`, funções `abrirModalMassa`, `_massaToggle`, `_massaMarcarTodas`, `_massaLimpar`, `_massaFiltrar`, `_massaAtualizarSummary`, `confirmarMassa`, CSS do modal novo
- Modifica: `#pv-maquina` vira multi-select + `salvarPreventiva` ganha loop

**Status:** aguardando próximos ajustes do William antes de mockar.

---

## Ajuste 3 · Tabela Preventiva · botões de ação + permissão de delete

**Onde:** painel Preventiva → tabela (desktop) renderizada em `renderPreventiva()`.

**Bugs/mudanças:**
- 🐛 **Botões Executar, Editar e Deletar NÃO funcionam** (clicar não faz nada) — investigar handler/onclick
- ❌ **Remover botão "Executar"** da tabela (o ✓). Execução acontece pelo fluxo do Kanban, não direto na tabela.
- ✏ Manter botão **Editar**
- 🗑 **Deletar** gated por permissão (só admin + Joacir por default)
- Aplicar **também nos cards mobile** (v3.31.0)

---

## 🆕 REGRA GERAL · Regras de permissão viram "poderes" configuráveis

**Estabelecida por William em 21/04/2026:**

> Toda vez que conversarmos sobre regras de permissão (tipo "só X pode deletar"), criar campo na **tela de Gestão de Usuários** (painel admin) pra admin poder ligar/desligar por user.

**Implementação padrão:**
1. Poder vira campo em `users-profile/{user}/powers/{nomeDoPoder}` (boolean)
2. Checkbox na tela Editar Usuário (`geuModal` no HUB)
3. Default sensato por role
4. Helper `canUser(userKey, poder)` pra checar
5. UI esconde botão quando user não tem o poder
6. **Não hardcodar nomes** (`if user === 'joacir'`) — usar sempre o poder via helper

**Já salvo em memória persistente** (`feedback_regras_como_poder.md`) pra valer em todas as próximas conversas.

**Poderes identificados até agora:**

| Poder | Default admin | Default gerente | Default user |
|---|---|---|---|
| `deletarPreventiva` | true | true | false |
| `executarPreventiva` | true | true | true |
| `exportarDados` | true | true | false |
| `editarMaquina` | true | true | false |
| `reatribuirCard` | true | true | false |

---

## Ajuste 4 · Kanban Manutenção · redesign visual

**Onde:** painel Kanban do Manutenção → colunas + cards.

**Referência visual enviada** (print dark com "Untitled / To Do / Doing"):
- Fundo dark cinza escuro com boa respiração
- **Header de coluna minimalista:** nome grande + count discreto (ex: "To Do  8 Tasks") + botões `+` e `⋯` à direita
- **Cards com hierarquia clara:**
  - Tags coloridas na parte superior (pills pequenas estilo `UX/UI`, `No billing`, `Management`, `QA`, `Add Status`)
  - Data pequena no canto superior direito (ex: "3 Jun")
  - Título em bold, bom peso
  - Footer com:
    - **Stack de avatares** (já temos, só aplicar consistente)
    - Contador de chat/comentários (💬 3)
    - Play/timer (▶)
    - Timer em estado ativo (ex: `16:32 h` em vermelho quando está rodando)
  - **Barra de progresso fina** na base do card (roxa ou cor da urgência)
  - "Est: X h" estimativa à direita (tempo estimado pra tarefa)
- **Card com mídia:** suporte a **thumbnail/screenshot grande** dentro do card (ex: foto do problema capturada na demanda)
- **Estado "Doing" destaca** timers rodando (cards ficam mais cheios de info/atividade)

**Adaptações pro nosso contexto:**
- Tags = tipo de demanda (Preventiva / Corretiva / Melhoria) + urgência (Alta/Média/Baixa)
- Timer = tempo decorrido desde `col: 'doing'` (já temos `_iniciarTimers` / `_tickTimers`)
- Foto = `card.foto` se houver (hoje já existe o campo)
- "Est. h" = campo `horasEstimadas` (novo, opcional)
- Comentários = `card.log.length` ou campo novo

**Status:** aguardando próximos ajustes. Mockup será feito junto com os outros no momento da revisão.

---

## Ajuste 5 · Calendário · supressão visual está agressiva demais

**Onde:** painel Preventiva → calendário → renderização de eventos do dia (`_buildEventMap`).

**Bug observado** (print 21/04/2026):
- 5 preventivas Semanais (`freq=7`) da MESMA máquina (RET-01) com mesma `ultima=16/04` → todas vencem em **23/04** (mesma semana)
- Tarefas DIFERENTES: Abrir tampas, Conferir tensão, Verificar vazamento, Verificar folgas, Limpar ventilação
- Calendário mostra **apenas 1** ("RET-01 · Retorcedeira VTS 07 2001")

**Causa:** a v3.32.4 (cascata + supressão) agrupa por `(semana, máquina)` e mantém só a de **maior freq**. Quando todas têm a MESMA freq, fica só a "primeira" (não-determinística). Bug de regra.

**Regra correta:**
- Mesma máquina + mesma semana + frequências **DIFERENTES** → só a **maior** aparece (Anual absorve Semanal — comportamento atual ✓)
- Mesma máquina + mesma semana + **MESMA frequência** → **TODAS** aparecem (são tarefas distintas, não hierarquia)

**Fix esperado em `_buildEventMap`:**
- Agrupar por `(semana, máquina, freq)` em vez de `(semana, máquina)`
- Mantém o filtro de hierarquia: se uma máquina tem Anual + Semanal, só Anual aparece (Semanal é absorvida pela cascata)
- Mas se tem 5 Semanais distintas, todas aparecem no dia

**Aplicar mesma regra em `gerarCardsPreventivas`** (Kanban).

---

*Próximos ajustes serão adicionados aqui pelo William.*
