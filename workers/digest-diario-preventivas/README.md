# Fiobras · Digest Diário de Preventivas

Worker Cloudflare que roda **segunda a sexta às 08:30 BRT**, agrupa as preventivas diárias (`freq=1`) por responsável e empilha push em `manutencao/fcmPending`. O Worker FCM existente escuta esse path e entrega as notificações.

## Arquitetura

```
┌─────────────────────┐         ┌──────────────────────┐         ┌──────────┐
│ Worker "digest"     │  08:30  │ Firebase RTDB        │         │ FCM Push │
│ (cron 11:30 UTC)    │ ──────▶ │ /manutencao/         │ ──────▶ │ → Técnicos
│ · lê preventivas    │         │   fcmPending         │         │          │
│ · agrupa por resp   │         └──────────────────────┘         └──────────┘
│ · empilha payloads  │                   ▲
└─────────────────────┘                   │ (onValue existente)
                                          │
                                ┌──────────────────────┐
                                │ Worker FCM (já ativo)│
                                │ · pega pendências    │
                                │ · envia push         │
                                └──────────────────────┘
```

## Setup (5 passos — 10 minutos)

### 1. Pré-requisitos
- Node.js 18+ instalado
- Conta Cloudflare Workers (grátis até 100k requests/dia)

### 2. Instalar Wrangler CLI
```bash
npm install -g wrangler@latest
wrangler login    # abre browser pra autorizar
```

### 3. Configurar secrets
Na pasta deste Worker (`workers/digest-diario-preventivas/`), cole **o mesmo service account** usado no backup GitHub Actions (você já tem):

```bash
cd workers/digest-diario-preventivas

# Service account JSON inteiro (do arquivo fiobras-hub-firebase-adminsdk-*.json)
wrangler secret put FIREBASE_SERVICE_ACCOUNT
# → cola o JSON inteiro (do { ao }) e Enter

# URL do RTDB
wrangler secret put FIREBASE_DB_URL
# → cola: https://fiobras-hub-default-rtdb.firebaseio.com

# (opcional) Users que NÃO recebem notificação — admin/gerentes
wrangler secret put ADMIN_ROLES
# → cola: admin,joacir,william
# (padrão se não setar: admin,joacir,william)
```

### 4. Deploy

```bash
wrangler deploy
```

Vai imprimir algo tipo:
```
Published fiobras-digest-diario
  trigger: cron 30 11 * * 1-5
  URL:     https://fiobras-digest-diario.<seu-usuario>.workers.dev
```

### 5. Testar manualmente antes de esperar o cron

Abre no browser (ou via curl):
```
https://fiobras-digest-diario.<seu-usuario>.workers.dev/run
```

Resposta (JSON):
```json
{
  "ok": true,
  "diariasTotal": 5,
  "tecnicosNotificados": 2,
  "enviados": [
    { "resp": "Vorlei",   "qtd": 3, "pushId": "-Nabc123..." },
    { "resp": "Hernandes","qtd": 2, "pushId": "-Nxyz789..." }
  ]
}
```

Se retornar `ok: false`, o `error` explica o que faltou.

## Verificar que funcionou

1. No **Firebase Console** → Realtime Database → navega pra `manutencao/fcmPending`
2. Devem aparecer 2 novos registros (um por técnico)
3. O Worker FCM existente deve pegar esses registros e enviar push real

## Logs e monitoramento

```bash
wrangler tail          # logs em tempo real
```

Ou no dashboard Cloudflare → Workers → fiobras-digest-diario → Logs.

## Cron schedule (`30 11 * * 1-5`)

- `30 11`    → minuto 30 da hora 11 UTC = **08:30 BRT**
- `* *`      → qualquer dia do mês/mês
- `1-5`      → segunda a sexta (0=dom, 6=sáb)

Pra mudar horário, edita `wrangler.toml` e faz `wrangler deploy` de novo.

## Custos

- **Cloudflare Workers Free:** 100k requests/dia. Este worker faz ~10 requests por execução × 5 dias = ~50/semana. Longe do limite.
- **Firebase RTDB:** 1 read completo de preventivas + N writes no fcmPending. Inclusa no free tier.

**Total: zero custo.**

## Troubleshooting

| Erro | Causa | Fix |
|---|---|---|
| "FIREBASE_SERVICE_ACCOUNT secret não definido" | Secret não foi adicionado | `wrangler secret put FIREBASE_SERVICE_ACCOUNT` |
| "Falha ao obter access_token" | JSON do service account inválido ou expirado | Re-baixa do Firebase Console |
| "PERMISSION_DENIED" no Firebase | Service account sem role "Firebase Admin SDK Administrator Service Agent" | Adiciona role no IAM do GCP |
| Cron não dispara | Normal nas primeiras 24h após deploy. Teste via `/run` manualmente | Aguarda ou dispara manual |

## Histórico de versões

- **v1.0 (v3.32.6 do HUB):** primeira versão. Lê `freq=1`, agrupa por `resp`, publica em `manutencao/fcmPending`.

---

*Desenvolvido junto com o Fiobras HUB · bumpa versão quando mudar a lógica.*
