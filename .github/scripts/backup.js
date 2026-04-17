/**
 * Backup do Firebase RTDB → JSON gzip local.
 * Rodado pelo workflow .github/workflows/backup-firebase.yml.
 *
 * Env esperado:
 *   FIREBASE_SERVICE_ACCOUNT  → JSON inteiro do service account (GitHub secret)
 *   FIREBASE_DB_URL           → URL do RTDB (definido no workflow)
 */

const admin = require('firebase-admin');
const fs = require('fs');
const zlib = require('zlib');

const SA = process.env.FIREBASE_SERVICE_ACCOUNT;
const DB_URL = process.env.FIREBASE_DB_URL;

if (!SA)     { console.error('ERRO: FIREBASE_SERVICE_ACCOUNT não definido'); process.exit(1); }
if (!DB_URL) { console.error('ERRO: FIREBASE_DB_URL não definido');         process.exit(1); }

let credentials;
try {
  credentials = JSON.parse(SA);
} catch (e) {
  console.error('ERRO: FIREBASE_SERVICE_ACCOUNT não é JSON válido:', e.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: DB_URL
});

(async () => {
  const t0 = Date.now();
  console.log('[backup] lendo /', DB_URL);
  const snap = await admin.database().ref('/').once('value');
  const data = snap.val();
  if (!data) { console.error('ERRO: snapshot vazio (perigoso)'); process.exit(2); }

  const json = JSON.stringify(data);
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16); // YYYY-MM-DDTHH-MM
  const file = `backup-${ts}.json.gz`;

  const gz = zlib.gzipSync(json, { level: 9 });
  fs.writeFileSync(file, gz);

  const ms = Date.now() - t0;
  const topLevel = Object.keys(data).length;
  console.log(`[backup] OK · ${file} · ${gz.length} bytes (raw ${json.length}) · ${topLevel} top-level keys · ${ms}ms`);

  // Resumo curto pra step summary
  console.log('\n--- resumo top-level ---');
  for (const k of Object.keys(data).sort()) {
    const v = data[k];
    const n = typeof v === 'object' && v !== null ? Object.keys(v).length : 1;
    console.log(`  ${k}: ${n}`);
  }
  process.exit(0);
})().catch(e => {
  console.error('ERRO FATAL:', e);
  process.exit(3);
});
