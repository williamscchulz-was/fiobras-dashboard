/**
 * Feriados Fiobras · 2026 → 2050
 * ============================================================
 * Calculado via algoritmo Anonymous Gregorian (Páscoa) + offsets
 *  · Carnaval (segunda) = Páscoa − 48
 *  · Carnaval (terça)   = Páscoa − 47
 *  · Quarta de Cinzas   = Páscoa − 46
 *  · Sexta-feira Santa  = Páscoa − 2
 *  · Corpus Christi     = Páscoa + 60
 *
 * Inclui:
 *  · Nacionais fixos (Confraternização, Tiradentes, Trabalho, Indep,
 *    Aparecida, Finados, República, Natal)
 *  · Nacionais móveis (Carnaval seg+ter, Quarta Cinzas, Sexta Santa, Corpus)
 *  · SC: Data Magna (11/08 fixo)
 *  · Indaial: Aniversário (25/06 fixo · fundação 1860)
 *
 * Uso:
 *   import { FERIADOS_FIOBRAS, isFeriado } from './data/feriados-2026-2050.js';
 *   if (isFeriado('2027-04-15')) { ... }
 */

// ───────── Algoritmo Anonymous Gregorian (Páscoa) ─────────
function calcPascoa(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

// Helper · adiciona/subtrai dias e retorna ISO (YYYY-MM-DD)
function shiftISO(date, deltaDays) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

// ───────── Gera todos os feriados de um ano ─────────
function feriadosDoAno(year) {
  const pascoa = calcPascoa(year);
  return [
    `${year}-01-01`,                  // Confraternização Universal
    shiftISO(pascoa, -48),            // Carnaval (segunda)
    shiftISO(pascoa, -47),            // Carnaval (terça)
    shiftISO(pascoa, -46),            // Quarta-feira de Cinzas
    shiftISO(pascoa, -2),             // Sexta-feira Santa
    shiftISO(pascoa, 0),              // Páscoa (domingo · não é feriado oficial mas listamos)
    `${year}-03-21`,                  // Aniversário de Indaial · emancipação Decreto 526/1934
    `${year}-04-21`,                  // Tiradentes
    `${year}-05-01`,                  // Dia do Trabalho
    shiftISO(pascoa, 60),             // Corpus Christi
    `${year}-08-11`,                  // Data Magna SC
    `${year}-09-07`,                  // Independência do Brasil
    `${year}-10-12`,                  // Nossa Senhora Aparecida
    `${year}-11-02`,                  // Finados
    `${year}-11-15`,                  // Proclamação da República
    `${year}-11-20`,                  // Consciência Negra (nacional desde 2024)
    `${year}-12-25`,                  // Natal
  ];
}

// ───────── Mapa pré-calculado 2026-2050 ─────────
export const FERIADOS_FIOBRAS = {};
for (let y = 2026; y <= 2050; y++) {
  FERIADOS_FIOBRAS[y] = feriadosDoAno(y).sort();
}

// Set único de todos os feriados (lookup O(1))
export const FERIADOS_SET = new Set(
  Object.values(FERIADOS_FIOBRAS).flat()
);

// Helper público
export function isFeriado(iso) {
  return FERIADOS_SET.has(iso);
}

// Conta dias úteis (seg-sex, exclui feriados) entre duas datas ISO
// Não conta o dia inicial (igual lógica atual do diasUteis no index.html)
export function diasUteis(dataIni, dataFim) {
  if (!dataIni || !dataFim) return 0;
  const d1 = new Date(dataIni + 'T00:00:00');
  const d2 = new Date(dataFim + 'T00:00:00');
  if (d2 <= d1) return 0;
  let count = 0;
  const cur = new Date(d1);
  cur.setDate(cur.getDate() + 1); // Não conta o dia de entrada
  while (cur <= d2) {
    const dow = cur.getDay();
    const iso = cur.toISOString().slice(0, 10);
    if (dow !== 0 && dow !== 6 && !FERIADOS_SET.has(iso)) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

// Para uso vanilla (não-module): expõe global se rodando no browser sem module
if (typeof window !== 'undefined' && !window.FERIADOS_FIOBRAS) {
  window.FERIADOS_FIOBRAS = FERIADOS_FIOBRAS;
  window.FERIADOS_SET = FERIADOS_SET;
  window.isFeriado = isFeriado;
}
