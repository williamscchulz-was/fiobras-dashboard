# Backup automático do Firebase RTDB

## O que faz

- Roda **2x por dia** (03h e 15h BRT) via GitHub Actions cron + tem botão pra rodar manual.
- Baixa o JSON inteiro do RTDB `fiobras-hub`.
- Comprime com gzip (~85% menor).
- Sobe como **artifact privado** do workflow (retém **90 dias**).

## Setup inicial (faz 1x só, ~5min)

### 1. Gerar service account no Firebase Console

1. Abre o [Firebase Console](https://console.firebase.google.com/) → projeto **`fiobras-hub`**
2. Engrenagem ⚙ ao lado de "Project Overview" → **Project settings**
3. Aba **Service accounts**
4. Botão **"Generate new private key"** → confirma → baixa o JSON
   (algo como `fiobras-hub-firebase-adminsdk-XXXXX-YYYYYY.json`)
5. **Guarda esse arquivo num lugar seguro** (cofre de senhas / OneDrive privado).
   Ele dá acesso TOTAL ao banco.

### 2. Adicionar como secret no GitHub

1. Abre [repo no GitHub](https://github.com/williamscchulz-was/fiobras-dashboard) → **Settings**
2. **Secrets and variables** → **Actions** → **New repository secret**
3. Preenche:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Secret:** abre o JSON que baixou e **cola o conteúdo INTEIRO** (do `{` ao `}`)
4. **Add secret**

### 3. Testar (dispara backup manual)

1. GitHub repo → aba **Actions** → workflow **"Backup Firebase RTDB"** (esquerda)
2. Botão **"Run workflow"** (direita) → branch `main` → **Run workflow**
3. Espera ~30 segundos. Quando virar verde, abre a run, scroll até o final → **Artifacts**
4. Baixa o `.zip` → dentro tem `backup-YYYY-MM-DDTHH-MM.json.gz`

Se rodar OK, daí em diante o cron toma conta sozinho.

## Como restaurar de um backup

Cenário: alguém apagou dados sem querer e precisa voltar.

```bash
# 1. Descomprime o backup
gunzip backup-2026-04-17T18-00.json.gz   # vira backup-2026-04-17T18-00.json

# 2. Inspeciona (opcional, ver o que tem)
python -c "import json; d=json.load(open('backup-2026-04-17T18-00.json')); print({k:len(v) if isinstance(v,dict) else type(v).__name__ for k,v in d.items()})"
```

Pra restaurar **um nó específico** (ex: timeline-2026), tem 2 caminhos:

**A. Manual via Firebase Console**
1. Console → Realtime Database → no nó que quer restaurar
2. ⋮ → **Import JSON** → seleciona o trecho do backup
3. Confirma (CUIDADO: substitui o nó atual)

**B. Script Node** (pra restauração granular sem sobrescrever tudo — recomendado)

Posso gerar um script `restore.js` sob demanda quando precisar. Pede no chat algo como:
> "restaura `timeline-2026` do backup `backup-2026-04-17T18-00.json.gz`"

E gero o HTML/script com `update(child(ref, id), evt)` pra cada registro (método safe v3.21.17, não sobrescreve).

## Custos

- **GitHub Actions:** workflow roda em ~30s, 2x/dia = ~60s/dia = ~30min/mês. Limite free de minutos = 2.000/mês. **Margem: 60x.**
- **Artifact storage:** ~150kb por backup × 60 backups (90 dias × 2/dia) = ~9MB. Limite free = 500MB. **Margem: 50x.**
- **Firebase:** read inteiro do DB = 1 op por backup. Free tier sobra pra essa.

**Total: zero custo.**

## Retenção mais longa (opcional, futuro)

90 dias é o máx que GitHub Actions retém artifacts no plano free. Pra histórico mais longo:

- **Opção 1:** Criar repo PRIVADO `fiobras-backups` e o workflow commita lá com nome `YYYY-MM-DD-HH.json.gz`. Retenção infinita via Git. Pede pra eu adicionar quando quiser.
- **Opção 2:** Sobe pro Cloudflare R2 (free até 10GB) ou Backblaze B2. Configuração extra.

## Troubleshooting

- **"Permission denied" no script:** service account não tem permissão. No Firebase Console → IAM → service account precisa de role `Firebase Admin SDK Administrator Service Agent` (geralmente vem por padrão quando gerada pelo console).
- **"snapshot vazio":** o DB está zerado ou auth falhou silenciosamente. Checa o secret `FIREBASE_SERVICE_ACCOUNT`.
- **Workflow não roda no horário:** GitHub Actions cron não é 100% pontual (pode atrasar até 30min em horários de pico). Se importar muito horário exato, dispara manual ou usa Cloudflare Worker (mais preciso).
