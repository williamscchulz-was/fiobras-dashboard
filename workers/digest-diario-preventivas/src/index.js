/**
 * Fiobras HUB — Worker "Digest Diário de Preventivas"
 * ═════════════════════════════════════════════════════════════════════
 * Roda 08:30 BRT (11:30 UTC), segunda a sexta.
 *
 * O que faz:
 *  1. Autentica no Firebase via service account (gera ID token OAuth)
 *  2. Lê `manutencao/preventivas` e filtra as com freq=1 (diárias)
 *  3. Agrupa por `resp` (técnico)
 *  4. Ignora admins/gerentes (ADMIN_ROLES secret)
 *  5. Pra cada técnico: push em `manutencao/fcmPending` com a lista
 *     de preventivas diárias dele. O Worker FCM existente escuta
 *     esse path e entrega via push nativo.
 *
 * Se o técnico não tiver preventiva diária, nada é enviado.
 */

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runDigest(env));
  },
  // Endpoint manual pra testar (opcional): GET /run → dispara execução
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/run') {
      const r = await runDigest(env);
      return new Response(JSON.stringify(r, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response('Fiobras · Digest Diário de Preventivas\n\nPOST /run pra testar manualmente.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};

async function runDigest(env) {
  const startedAt = new Date().toISOString();
  try {
    if (!env.FIREBASE_SERVICE_ACCOUNT) throw new Error('FIREBASE_SERVICE_ACCOUNT secret não definido');
    if (!env.FIREBASE_DB_URL)          throw new Error('FIREBASE_DB_URL secret não definido');

    const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
    const adminRoles = (env.ADMIN_ROLES || 'admin,joacir,william')
      .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    // 1. OAuth token via service account (signed JWT)
    const accessToken = await getAccessToken(sa);

    // 2. Fetch das preventivas + máquinas
    const [prevsRes, maqsRes] = await Promise.all([
      fetch(env.FIREBASE_DB_URL + '/manutencao/preventivas.json?access_token=' + accessToken),
      fetch(env.FIREBASE_DB_URL + '/manutencao/maquinas.json?access_token=' + accessToken)
    ]);
    const prevs = await prevsRes.json() || {};
    const maqs  = await maqsRes.json() || {};

    // 3. Filtra só as DIÁRIAS (freq=1)
    const diarias = Object.entries(prevs)
      .map(([k, v]) => ({ ...v, _key: k }))
      .filter(p => parseInt(p.freq) === 1);

    // 4. Agrupa por responsável (nome)
    const porResp = {};
    diarias.forEach(p => {
      if (!p.resp) return;
      const respLower = String(p.resp).toLowerCase().trim();
      if (adminRoles.includes(respLower)) return; // admin/gerente não recebe
      if (!porResp[p.resp]) porResp[p.resp] = [];
      porResp[p.resp].push(p);
    });

    // 5. Pra cada técnico com preventivas, grava payload em manutencao/fcmPending
    const enviados = [];
    for (const [resp, lista] of Object.entries(porResp)) {
      const lines = lista.map(p => {
        const maq = Object.entries(maqs).map(([k, v]) => ({ ...v, _key: k }))
          .find(m => m._key === (p.maqKey || p.maquinaKey));
        const maqNome = maq ? (maq.tag ? maq.tag + ' · ' + maq.nome : maq.nome) : (p.equip || '—');
        return maqNome + ' · ' + (p.tarefa || '—');
      });
      const payload = {
        titulo: 'Preventivas diárias de hoje (' + lista.length + ')',
        corpo:  lines.slice(0, 3).join(' | ') + (lines.length > 3 ? ' + ' + (lines.length-3) + ' mais' : ''),
        ts:     Date.now(),
        resp:   resp,
        de:     'Digest diário',
        tipo:   'digest-diario',
        dest:   resp, // enviado pra este user específico
      };
      const pushRes = await fetch(env.FIREBASE_DB_URL + '/manutencao/fcmPending.json?access_token=' + accessToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const pushData = await pushRes.json();
      enviados.push({ resp, qtd: lista.length, pushId: pushData.name });
    }

    const result = {
      ok: true, startedAt, finishedAt: new Date().toISOString(),
      diariasTotal: diarias.length,
      tecnicosNotificados: enviados.length,
      enviados
    };
    console.log('Digest diário OK:', JSON.stringify(result));
    return result;
  } catch (e) {
    const err = { ok: false, startedAt, error: e.message, stack: e.stack };
    console.error('Digest diário FALHOU:', JSON.stringify(err));
    return err;
  }
}

// ═══ OAuth: gera access_token via JWT assinado ═══════════════════════════
async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss:   sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  };
  const encHeader = base64url(JSON.stringify(header));
  const encClaim  = base64url(JSON.stringify(claim));
  const toSign    = encHeader + '.' + encClaim;
  const signature = await signRS256(toSign, sa.private_key);
  const jwt       = toSign + '.' + signature;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Falha ao obter access_token: ' + JSON.stringify(data));
  return data.access_token;
}

function base64url(input) {
  const str = typeof input === 'string' ? input : new TextDecoder().decode(input);
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function base64urlBytes(bytes) {
  let binary = '';
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.byteLength; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
async function signRS256(data, pemKey) {
  // Converte PEM pra CryptoKey
  const pemBody = pemKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');
  const binary = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', binary,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
  const sigBuffer = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    new TextEncoder().encode(data)
  );
  return base64urlBytes(sigBuffer);
}
