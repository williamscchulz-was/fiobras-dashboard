# Auditoria + Cleanup — v3.52.0

> Pacotão de limpeza. Tudo que tava como `// no-op` ou desativado vai pra fora.

## ❌ Notificações — DELETAR TUDO

Ja foi neutralizado em v3.50.0 (no-ops + UI escondida). Agora vai fora de verdade. Quando voltar a fazer notificações, recriamos do zero com regra clara.

### Arquivos a deletar
- `manutencao/firebase-messaging-sw.js` — SW do FCM (Cloudflare worker já desativado v3.50.0)
- `workers/digest-diario-preventivas/` — worker do digest (cron já desabilitado v3.50.0)

### `manutencao/index.html` — remover (eram no-ops):

**Funções stub (todas deletar):**
- `notificarPreventiva` · `reNotificarPreventivasPendentes`
- `mostrarNotif` · `checkNotifNovosCards` · `dispararNotif` · `agendarRenotif`
- `initNotificacoes` · `toggleNotifPermission` · `_atualizarNotifSwitch`
- `mostrarBannerNotif` · `esconderBannerNotif` · `pedirPermissaoNotif`
- `abrirModalNotifAdmin` · `enviarNotifAdmin`
- `exibirInAppNotif` · `fecharInAppNotif`
- `verificarNotificacoesPerdidas` · `abrirModalNotifHistorico`
- `marcarTodasLidas` · `atualizarBadgeNotif`
- `resetNotificacoesDiarias` · `agendarResetMeiaNoite`
- `enviarDigestDiario` · `agendarDigestDiario`
- `initFCMToken` · `_fbSaveToken`
- `updateBanner` (banner de preventivas vencidas)

**Variáveis globais a remover:**
- `notifPermission`, `inAppTimer`, `prevCardIds`, `notifIntervals`
- `state._lastFcmPending`

**Refs no boot/login a remover:**
- `if (typeof initNotificacoes === 'function') initNotificacoes();`
- `if (typeof agendarDigestDiario === 'function') agendarDigestDiario();`
- `if (typeof resetNotificacoesDiarias === 'function') resetNotificacoesDiarias();`
- `if (typeof verificarNotificacoesPerdidas === 'function') verificarNotificacoesPerdidas();`
- `if (typeof reNotificarPreventivasPendentes === 'function') reNotificarPreventivasPendentes();`
- `if (window._swRegistration && typeof initFCMToken === 'function') initFCMToken(window._swRegistration);`
- Bloco `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./firebase-messaging-sw.js'...`

**HTML a remover:**
- `#kanban-banner`
- `#inapp-notif`
- `#modal-notif-admin` + `#modal-notif-historico`
- Botões: `#btn-notif-test` · `#btn-ver-notifs` · `#btn-notif-toggle` · `#btn-notif-count`

**`window._fbPushFCMPending`** vai virar `undefined` (não mais no-op). Caller que sobrar quebra com erro claro.

**CSS:** todos `display:none !important` desses IDs já viram dispensáveis.

## 🧹 Outros zumbis

- `manutencao/index.html` hosts legacy hidden:
  - `<table><tbody id="prev-tbody"></tbody></table>` (substituído por `#pv-machine-list` v3.48.9)
  - `<div id="prev-cards-mobile"></div>`
  - `<div id="prev-pagination"></div>`
  - Funções: `_prevOnSearch` (mantém — busca ainda usa), `_prevGoPage` (sai — sem paginação)

- `manutencao/firebase-messaging-sw.js` — comentado v2.2 mas nunca mais usado depois de v3.50.0

## 🐛 Debug do Vorlei (Kanban vazio)

Vou adicionar um `window.__debugKanban()` no console que dump:
- `state.user`, `state.userKey`
- `state.cards.length` + amostra dos primeiros 3
- Resultado do filtro pra cada um

Pra William rodar no console se persistir e me mandar print.

## Resumo

- **-650 linhas** estimadas em manutencao/index.html
- **-2 arquivos** (FCM SW + worker dir inteiro)
- Bundle mais leve, menos confusão pro próximo dev
- Quando reativar notificações, começamos do zero com regra documentada
