# AUDITORIA — Preventivas no Kanban + Notificações

> **Status:** ABERTA · Reportada por William em 23/04/2026 · v3.49.1
> **Severidade:** Média — afeta UX e regras de notificação.
> **Itens auditados:** geração de cards · timer no card · push notifications · in-app notifications · digest worker

---

## 1. QUANDO uma preventiva vira card no Kanban

### Função: `gerarCardsPreventivas()` (manutencao/index.html:3941)

Roda **toda vez que `manutencao/preventivas` OU `manutencao/kanban` muda no Firebase**. Disparado por dois `onValue` listeners.

### Regras atuais de geração de card:

| Regra | Comportamento |
|---|---|
| `p.ultima` ausente | **NÃO gera** card (preventiva nunca executada) |
| `p.freq === 1` (diária) | **NÃO gera** card (diárias só notificam, não viram card) |
| Hierarquia semanal | **Só a maior frequência** da semana × máquina gera card. Ex: se RET-01 tem semanal+mensal vencendo na mesma semana, só a mensal vira card. (v3.32.4) |
| `proxima > hoje` | **NÃO gera** card (não venceu ainda — fix v3.48.3 do `today()` midnight) |
| `proxima <= hoje` | **GERA** card no `col=todo`, `urg=alta`, `tipo=preventiva` |
| Já tem card desta preventiva (`col!=done`) | **NÃO gera** duplicado |

### Schema do card gerado:
```js
{
  titulo: p.tarefa,
  desc:   'Vencida em DD/MM/YYYY. Responsável: X. obs',
  equip:  p.equip,
  setor:  p.setor,
  tipo:   'preventiva',
  urg:    'alta',
  col:    'todo',
  data:   nowStr(),
  autor:  'Sistema',
  prevId: <chave da preventiva>,
  resp:   p.resp || '',
}
```

### ⚠️ Observações:
- Preventivas **diárias (freq=1)** NUNCA viram card — só notificam via digest worker das 07:30 BRT.
- Card NÃO ganha `respKey` automaticamente. Backfill v3.48.6 cobre, mas cards novos gerados pelo Sistema ficam sem respKey até o próximo backfill.

---

## 2. PARA QUEM o card aparece no Kanban

### Visibilidade dos cards: TODOS veem TODOS os cards.

Não há filtro de visibilidade no Kanban — qualquer user logado no Manutenção vê todos os cards. Filtros existem mas são opt-in (chips no topo).

### Permissões nas ações dos cards:
| Ação | Quem pode |
|---|---|
| Visualizar card | Todos |
| Iniciar (▶) | Todos |
| Concluir (✓) | Todos |
| Editar (✎) | Admin · autor · responsável |
| Excluir | Admin (gated por `canUser('deletarPreventiva')` na tabela; sem gate no card) |
| Reatribuir (avatar click) | Admin |

---

## 3. NOTIFICAÇÕES — mapeamento completo

### Tipos de notificação no sistema:

| Tipo | Trigger | Destino | Push (FCM) | In-app | Banner Kanban |
|---|---|---|---|---|---|
| **Preventiva vence** (vira card) | `gerarCardsPreventivas` → `notificarPreventiva` | `dest:'todos'` mas filtra por `payload.resp === state.user` (ou admin) | ✅ Sim | ✅ Sim | ✅ Sim (07:30-08:00 + só pro resp · v3.48.3) |
| **Card novo aparece** (qualquer) | `checkNotifNovosCards` → `dispararNotif` | Filtro local: só responsável OU admin | ✅ Sim | ❌ Não | ❌ Não |
| **Renotificação** | `agendarRenotif` `setInterval` | Mesmo filtro de cima | ✅ Sim a cada **24h** (comment diz 5min mas o código tá 24h) | ❌ | ❌ |
| **Re-notif diária ao boot** | `reNotificarPreventivasPendentes` (5s após login) | Só **admin** dispara; chama `notificarPreventiva` pra cada vencida | ✅ Sim | ✅ Sim | ✅ Sim |
| **Digest diário** (Cloudflare worker) | Cron `30 10 * * 1-5` (07:30 BRT) | `dest:<resp>` específico, ignora admin/joacir/william | ✅ Sim | ✅ Sim | ❌ |
| **Reatribuição** | `confirmarReatribuicao` | `dest:<chave do novo resp>` | ✅ Sim | ✅ Sim | ❌ |
| **Notif manual admin** | `enviarNotifAdmin` | `dest:<escolhido>` ou `'todos'` | ✅ Sim | ✅ Sim | ❌ |
| **Resumo "enquanto você estava fora"** | `verificarNotificacoesPerdidas` (3s após login) | Só pro user logado, 1x por dia | ❌ | ✅ Sim (chip "Enquanto você estava fora") | ❌ |

### Filtros de destinatário no `onValue('manutencao/fcmPending')`:

```js
// 1. Filtro por dest específico
const dest = payload.dest || 'todos';
if (dest !== 'todos') {
  const destNome = USERS[dest] ? USERS[dest].nome : dest;
  if (destNome !== state.user) return;
}
// 2. Filtro por responsável (notif automáticas)
if (payload.tipo !== 'manual' && !state.isAdmin && payload.resp && payload.resp !== state.user) return;
```

**Tradução:**
- Notif `manual` (admin enviou): vai pra todos os destinatários do `dest`.
- Notif automática (preventiva, etc): admin/gerente recebem TUDO; users normais só recebem se `payload.resp === state.user`.

### ⚠️ PROBLEMAS IDENTIFICADOS:

1. **Comment vs código**: `agendarRenotif` diz "a cada 5 minutos" mas o `setInterval` tá em `24 * 60 * 60 * 1000` (24h). Ou o comment tá errado ou o intervalo regrediu. **Ação:** definir o que deveria ser e alinhar comment+código.

2. **`USERS = {}` quebra o lookup `dest`**: o filtro `USERS[dest] ? USERS[dest].nome : dest` agora SEMPRE cai no `else` porque USERS foi zerado em v3.48.0. Funciona por sorte porque `dest` agora é o nome direto, mas poderia falhar se algum payload antigo passar a chave.

3. **Comment do worker stale**: src/index.js linha 6 diz "08:30 BRT (11:30 UTC)" mas o cron tá em 07:30 BRT (10:30 UTC) desde v3.48.3.

4. **`notificarPreventiva` envia `dest: 'todos'`**: depende do filtro client-side pra distribuir corretamente. Funciona, mas o histórico do `fcmPending` cresce sem critério. Ideal: salvar `dest: <chave do resp>` direto.

5. **Cards de Sistema sem `respKey`**: cards gerados via `gerarCardsPreventivas` gravam só `resp` (nome). Backfill cobre depois, mas até lá o stack de avatares e dedup podem falhar.

---

## 4. TIMER no card — estado atual e o que falta

### Estado atual (v3.49.1):

`buildCard()` no Kanban tem essa lógica de data:

```js
if (ts) {
    const ageDays = Math.floor((Date.now() - ts) / 86400000);
    if (c.col === 'doing') {
      const { txt } = _tempoDecorrido(ts);    // ← TIMER (h/min/s)
      dateTxt = txt; dateCls = 'overdue';
    } else {
      dateTxt = _relativeDate(ts);            // ← Apenas DATA RELATIVA ("Hoje", "Ontem", "3d atrás")
      if (c.col !== 'done' && ageDays > 7) dateCls = 'overdue';
    }
  }
```

### O que o William reportou:

- Em "A Fazer": só mostra "ONTEM" / "HOJE" / "3d atrás" — **sem hora/min**.
- Em "Em Andamento": mostra **timer ativo** "14H 42MIN".

### Proposta:

**Adicionar timer também em "A Fazer"** mostrando há quanto tempo o card está esperando ser iniciado. Cor diferente do "doing" pra distinguir:
- 🟢 Verde até 24h ("Apareceu há 5h 12min")
- 🟡 Amarelo entre 24h e 72h ("Apareceu há 2d 3h")
- 🔴 Vermelho >72h ("Apareceu há 5d ⚠ ação urgente")

E no "Em Andamento" manter o timer ativo (já existe), mas com cor:
- 🟢 Verde até 4h ("Em execução · 2h 15min")
- 🟡 Amarelo 4h-8h
- 🔴 Vermelho >8h

Mockup visual em `mockup-timer-cards.html`.

---

## 5. AÇÕES PROPOSTAS (a executar quando aprovado)

### Bloco A — Timer + tempo no card
- [ ] Adicionar timer "Apareceu há Xh Ymin" em cards de **A Fazer** (não só Em Andamento)
- [ ] Sistema de cor por idade (verde / amarelo / vermelho)
- [ ] _tickTimers (já existe) atualiza ambos os tipos a cada minuto

### Bloco B — Cleanup de notificações
- [ ] Corrigir `agendarRenotif`: definir intervalo real (5min ou 24h?) e atualizar comment
- [ ] `notificarPreventiva` passar `dest: <chave do resp>` em vez de `'todos'`
- [ ] Atualizar comment do worker pra "07:30 BRT"
- [ ] Cards gerados pelo Sistema gravar `respKey` direto (não esperar backfill)

### Bloco C — Documentação visível
- [ ] Pequeno tooltip/info no Kanban listando as regras de notif (pra users entenderem quando recebem o quê)

---

*Auditoria registrada antes de qualquer correção. Atualizar este doc à medida que cada bloco for executado.*
