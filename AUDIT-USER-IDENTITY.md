# AUDITORIA — Resolução de identidade de usuários

> **Status:** ABERTA · Reportada por William em 22/04/2026 · v3.48.3
> **Severidade:** Alta — afeta histórico, avatares, cards, atribuições.

---

## 1. O problema observado

William trocou o nome cadastrado em **Minha Conta** de `William Schulz` → `William` (pra encurtar).

Resultado no CRM, aba **Histórico** de um lead:
- Entry 1 (antiga, 11:53): "Movido de X para Y" — autor: chip com avatar verde + **William Schulz**
- Entry 2 (nova, 15:14): "Responsável trocado de William Schulz para William por admin" — autor: chip com avatar cinza + **William**

O sistema renderizou **dois usuários distintos** quando, na verdade, é a mesma pessoa (mesma chave `admin`, só mudou o display name).

---

## 2. Causa raiz

Em vários pontos do sistema, a identidade do user é **gravada e/ou resolvida pelo NOME literal** em vez da CHAVE imutável.

Quando William grava uma entry em `historico` com `autor: "William Schulz"` e depois muda o `nomeCompleto` em `users-profile/admin` pra "William", o frontend:

1. Tenta resolver `"William Schulz"` via `_resolveUserKey()` (busca case-insensitive em USERS) → **não acha** (porque agora users-profile.admin.nomeCompleto = "William")
2. Cai no fallback de "user desconhecido" → avatar cinza, sem foto, sem agrupamento
3. A entry nova grava `autor: "William"` → resolve OK pra `admin`
4. Stack de avatares dedup por nome → vê 2 nomes diferentes → 2 avatares

**Mesmo bug que apareceu em CRM v3.47.6** (admin sumido + duplicação no stack), só que ali foi corrigido pra dedup por chave dentro do mesmo render. Não foi corrigido nas entries gravadas no banco com nome literal.

---

## 3. Onde o nome é gravado em vez da chave

Mapeamento (não exaustivo — precisa varredura completa):

### CRM (`crm/index.html`)
| Path Firebase | Campo problemático | Como deveria |
|---|---|---|
| `crm/leads/{id}/historico/[].autor` | string com nome | gravar `autorKey` (chave do user) |
| `crm/leads/{id}/responsavel` | string com nome | gravar `responsavelKey` |
| `crm/leads/{id}/colaboradores` | array de nomes | array de chaves |
| `crm/log/{id}/by` | nome | chave |

### Manutenção (`manutencao/index.html`)
| Path | Campo | Notas |
|---|---|---|
| `manutencao/kanban/{id}/resp` | string com nome | usado em filtros e notificações |
| `manutencao/kanban/{id}/autor` | string com nome | aparece no avatar stack |
| `manutencao/kanban/{id}/log/[].resp` | nome | participantes |
| `manutencao/kanban/{id}/comments/[].autor` | nome | |
| `manutencao/preventivas/{id}/resp` | nome | feed do banner + push |
| `manutencao/historico/{id}/by` | nome | |
| `manutencao/fcmPending/{id}/resp` + `de` | nome | filtro de quem recebe push |

### HUB (`index.html`)
| Path | Campo | Notas |
|---|---|---|
| `audit-log/{id}/by` | já é chave (✓) | OK |
| `cores-2026/{id}/criadoPor` | nome | (precisa confirmar) |
| `cores-2026/{id}/historico/[].by` | mistura | há backfill v2 que tenta corrigir |
| `timeline-2026/{id}/criadoPor` | nome | idem |

---

## 4. Por que o `_resolveUserKey()` existente não resolve

`_resolveUserKey(nomeOuKey)` faz busca case-insensitive em `USERS[k].nome`. Funciona enquanto o nome **gravado no passado** == nome **atual** do user.

Se o user trocar nome:
- `USERS["admin"].nome = "William"` (novo)
- Entries antigas têm `autor: "William Schulz"` (antigo)
- `_resolveUserKey("William Schulz")` → **não encontra** → retorna null → cai no avatar cinza

A partir da v3.48.0 com USERS lendo de Firebase, isso fica ainda mais frágil porque qualquer admin pode trocar nome de qualquer user a qualquer hora.

---

## 5. Decisões propostas pelo William (22/04/2026)

1. **Usuários comuns NÃO podem mais editar o próprio `nomeCompleto`** em Minha Conta. Campo vira read-only com tooltip "fale com o admin pra alterar".
2. **Apenas o admin master (William)** pode editar `nomeCompleto` de qualquer user — pelo painel **Gerenciar Usuários**.
3. **Trocar nome** dispara automaticamente um audit-log + avisa que entries antigas vão usar o nome novo nos avatares (graças à correção do passo 6).

---

## 6. Plano técnico (a executar quando aprovado)

### Fase A — Bloqueio preventivo (rápido, baixo risco)
- [ ] Modal "Minha Conta" no HUB: campo `nomeCompleto` vira `disabled` pra todos exceto admin master.
- [ ] Mensagem clara: "Pra alterar seu nome, fale com William."
- [ ] Audit-log toda alteração de nome feita pelo admin: `{action:'user.renameNome', target:userKey, details:{de, para}}`.

### Fase B — Migração de schema (médio prazo, requer cuidado)
- [ ] **Passo 1 — Gravar chave junto do nome em entries NOVAS:**
  - CRM: ao gravar entry em `historico`, gravar `autor: nome, autorKey: chave`.
  - Manutenção: idem em `kanban.resp`, `kanban.autor`, `comments.autor`, `historico.by`, `fcmPending.resp/de`.
- [ ] **Passo 2 — Render reescrito pra preferir chave:**
  - `entry.autorKey` → resolve nome ATUAL via `users-profile/<autorKey>/nomeCompleto`
  - Fallback: `entry.autor` (string literal) só pra entries antigas sem `autorKey`
- [ ] **Passo 3 — Backfill one-shot:**
  - Script que percorre todas as entries antigas (`historico`, `kanban.log`, `comments`, etc) e adiciona `autorKey` resolvido via `_resolveUserKey(autor)` no momento do backfill.
  - Flag `localStorage["fiobras-backfill-userkey-v1"]` pra rodar 1x.
  - Entries que `_resolveUserKey` não consegue resolver no momento do backfill ficam com `autorKey: null` (avatar cinza, mas sem alarme).

### Fase C — Stack avatares dedup por chave (não por nome)
- [ ] Já corrigido em parte pra CRM (v3.47.6 — `_crmResolveUserKey`).
- [ ] Aplicar mesmo padrão em **toda renderização de avatar stack** (Manutenção `kc2-avs`, audit-log, sessões ativas, etc).

### Fase D — Validação
- [ ] Trocar nome do William em ambiente de teste: avatares antigos e novos do William em todos os módulos passam a renderizar com a foto/cor única dele.

---

## 7. Lições gerais

- **Identidade SEMPRE pela chave imutável.** Nome é dado de display, pode mudar.
- **Toda gravação de "quem fez algo" deve incluir tanto a chave (canônica) quanto o nome (snapshot histórico).** Snapshot só pra entries onde a chave não pode ser resolvida no futuro (user excluído, etc).
- **Stack/dedup/agrupamento NUNCA por nome literal — sempre por chave.**
- **Permitir trocar nome só pelo admin** reduz a superfície de bug, mas a fonte do problema é arquitetural — o fix real é na Fase B/C.

---

*Auditoria registrada antes de qualquer correção, pra preservar o histórico do problema.
Atualizar este doc à medida que cada fase for executada.*
