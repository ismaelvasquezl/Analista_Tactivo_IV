/* Pruebas del núcleo TrazoXI (ejecutar: node trazoxi_core.test.js).
 * Sin framework: asserts simples y un contador. */
const C = require('./trazoxi_core.js');
let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; } else { fail++; console.error('  ✗ FALLO:', msg); } }
function eq(a, b, msg) { ok(JSON.stringify(a) === JSON.stringify(b), (msg || '') + ' (esperado ' + JSON.stringify(b) + ', obtuvo ' + JSON.stringify(a) + ')'); }
function close(a, b, tol, msg) { ok(typeof a === 'number' && Math.abs(a - b) <= tol, (msg || '') + ' (esperado ~' + b + ', obtuvo ' + a + ')'); }

/* 1) Tiempo */
eq(C.formatMMSS(0), '00:00', 'formatMMSS 0');
eq(C.formatMMSS(2058), '34:18', 'formatMMSS 2058');
eq(C.splitTime(2058), { minute: 34, second: 18, total: 2058 }, 'splitTime');

/* 2) Cronómetro (pausa/reanuda exacto) */
(function () {
  const t0 = 1000000;
  let seg = C.clockStart([], t0);
  eq(C.computeElapsedSeconds(seg, t0 + 60000), 60, 'corre 60s');
  seg = C.clockPause(seg, t0 + 60000);
  eq(C.computeElapsedSeconds(seg, t0 + 90000), 60, 'pausa no acumula');
  seg = C.clockResume(seg, t0 + 90000);
  eq(C.computeElapsedSeconds(seg, t0 + 130000), 100, '60+40=100s');
})();

/* 3) Modelo de 18 zonas */
eq(C.zoneBand('Z1'), 1, 'Z1 banda 1');
eq(C.zoneBand('Z18'), 6, 'Z18 banda 6');
eq(C.zoneCol('Z1'), 1, 'Z1 col izq');
eq(C.zoneCol('Z6'), 3, 'Z6 col der');
eq(C.tercioOfZone('Z2'), 'Iniciación', 'Z2 iniciación');
eq(C.tercioOfZone('Z8'), 'Creación', 'Z8 creación');
eq(C.tercioOfZone('Z17'), 'Finalización', 'Z17 finalización');
eq(C.carrilOfZone('Z16'), 'Banda izq', 'Z16 banda izq');
eq(C.carrilOfZone('Z17'), 'Central', 'Z17 central');
eq(C.zoneFromBandCol(6, 2), 'Z17', 'banda6 col2 => Z17');

/* 4) Clasificación y fase sugerida */
eq(C.orgOfEtiqueta('finalizacion'), 'offensive', 'finalización ofensiva');
eq(C.orgOfEtiqueta('presion'), 'defensive', 'presión defensiva');
eq(C.orgOfEtiqueta('perdida'), 'defensive', 'pérdida => transición defensiva');
eq(C.faseSugerida('recuperacion'), 'tran_of', 'recuperación => transición ofensiva');

/* 5) Marcador desde goles (resultado 'Gol' + equipo) */
(function () {
  const evs = [
    { id: 'a', etiqueta: 'finalizacion', resultado: 'Gol', equipo: 'propio', totalElapsedSeconds: 600 },
    { id: 'b', etiqueta: 'finalizacion', resultado: 'Gol', equipo: 'rival', totalElapsedSeconds: 1200 },
    { id: 'c', etiqueta: 'finalizacion', resultado: 'Gol', equipo: 'propio', totalElapsedSeconds: 2000 }
  ];
  eq(C.computeScore(evs), { scoreFor: 2, scoreAgainst: 1 }, 'marcador 2-1');
  eq(C.marcadorAt(evs, 1300), 'Empatando', 'al min ~21 iba 1-1');
  eq(C.marcadorAt(evs, 700), 'Ganando', 'al min ~11 iba 1-0');
  evs[0].deleted = true;
  eq(C.computeScore(evs), { scoreFor: 1, scoreAgainst: 1 }, 'recalcula al eliminar gol');
})();

/* 6) Agregación */
(function () {
  const evs = [
    { id: '1', etiqueta: 'inicio_salida', fase: 'org_of', zona: 'Z5', period: 'first_half', totalElapsedSeconds: 60, marcador: 'Empatando' },
    { id: '2', etiqueta: 'finalizacion', fase: 'org_of', zona: 'Z17', period: 'first_half', totalElapsedSeconds: 600, resultado: 'Gol', equipo: 'propio', marcador: 'Empatando' },
    { id: '3', etiqueta: 'presion', fase: 'org_def', zona: 'Z8', period: 'second_half', totalElapsedSeconds: 3000, marcador: 'Ganando' },
    { id: '4', etiqueta: 'finalizacion', fase: 'org_of', zona: 'Z16', period: 'second_half', totalElapsedSeconds: 3200, resultado: 'Parada', equipo: 'propio', marcador: 'Ganando' }
  ];
  const s = C.aggregateStats(evs);
  eq(s.totals, { offensive: 3, defensive: 1, neutral: 0, events: 4 }, 'totales org');
  eq(s.goals, { for: 1, against: 0 }, 'goles');
  eq(s.byTercio, { 'Iniciación': 1, 'Creación': 1, 'Finalización': 2 }, 'tercios');
  eq(s.remates, 2, 'finalizaciones');
  eq(s.conversionRemate, 50, 'conversión 1/2 = 50%');
  eq(s.byMarcador, { 'Ganando': 2, 'Empatando': 2, 'Perdiendo': 0 }, 'por marcador');
})();

/* 7) La tesis: recuperación + point-biserial */
(function () {
  // caso controlado: apoyos altos => recupera; apoyos bajos => no
  const mk = (apoyos, reaccion, marcador) => ({ id: 'p' + Math.random(), etiqueta: 'perdida', apoyos, reaccion, marcador, totalElapsedSeconds: 100 });
  const evs = [
    mk(4, 'Recuperada ≤5s', 'Empatando'), mk(5, 'Recuperada ≤5s', 'Empatando'), mk(6, 'Recuperada ≤5s', 'Ganando'),
    mk(1, 'Repliegue', 'Perdiendo'), mk(2, 'Contra concedida', 'Perdiendo'), mk(3, 'Repliegue', 'Empatando')
  ];
  const rec = C.recoveryStats(evs);
  eq(rec.n, 6, 'n pérdidas con reacción');
  eq(rec.recovered, 3, 'recuperadas ≤5s');
  eq(rec.rate, 50, 'tasa 50%');
  const pb = C.pointBiserial(C.recoveryPairs(evs));
  close(pb.r, 0.88, 0.02, 'point-biserial ≈ 0.88');
  eq(pb.n, 6, 'pb n=6');
  // muestra insuficiente
  eq(C.pointBiserial([{ x: 1, y: 1 }]).r, null, 'pb null con n<3');
})();

/* 8) Secuencias (las 4 preguntas) */
(function () {
  const seqs = [
    { id: 's1', tipo: 'Tras recuperación', tStart: 100, tEnd: 112, pases: 4, resultado: 'Remate' },
    { id: 's2', tipo: 'Tras recuperación', tStart: 200, tEnd: 206, pases: 2, resultado: 'Pérdida' },
    { id: 's3', tipo: 'Saque de arco en contra', tStart: 300, tEnd: 309, resultado: 'Recuperamos' }
  ];
  const st = C.sequenceStats(seqs);
  eq(st['Tras recuperación'].n, 2, 'n tras recuperación');
  eq(st['Tras recuperación'].duracionMedia, 9, 'duración media (12,6)=9');
  eq(st['Tras recuperación'].pasesMedio, 3, 'pases medio (4,2)=3');
  eq(st['Tras recuperación'].pctRemate, 50, '% remate 1/2');
  eq(st['Saque de arco en contra'].duracionMedia, 9, 'tiempo recuperar 9s');
})();

/* 9) CSV con el esquema de la plantilla */
(function () {
  const session = { analyzedTeam: 'Coquimbo Unido', opponentTeam: 'Cobreloa', matchDate: '2026-09-22', analyst: 'Ismael' };
  const evs = [
    { id: 'b', etiqueta: 'finalizacion', fase: 'org_of', zona: 'Z17', resultado: 'Gol', equipo: 'propio', totalElapsedSeconds: 3840, marcador: 'Empatando' },
    { id: 'a', etiqueta: 'perdida', fase: 'tran_def', zona: 'Z8', reaccion: 'Recuperada ≤5s', apoyos: 3, equipo: 'propio', totalElapsedSeconds: 600, nota: 'con; punto y coma' }
  ];
  const csv = C.buildCSV(session, evs);
  ok(csv.charCodeAt(0) === 0xFEFF, 'CSV inicia con BOM');
  const lines = csv.replace('﻿', '').split('\n');
  eq(lines.length, 3, '1 encabezado + 2 filas');
  ok(lines[0].indexOf('Apoyos al perder (≤10m)') > -1, 'encabezado = esquema plantilla');
  ok(lines[1].split(';')[0] === '1' && lines[1].indexOf('perdida') === -1, 'ordenado por tiempo; etiqueta como label');
  ok(lines[1].indexOf('Pérdida') > -1, 'etiqueta en español (Pérdida)');
  ok(csv.indexOf('"con; punto y coma"') > -1, 'escapa ; entre comillas');
})();

/* 10) IDs y validación */
ok(/^TRZ-\d{8}-\d{6}$/.test(C.genSessionId(new Date(2026, 8, 22, 20, 30, 0))), 'formato ID sesión');
eq(C.genSessionId(new Date(2026, 8, 22, 20, 30, 0)), 'TRZ-20260922-203000', 'ID sesión exacto');
eq(C.validateSession({ analyzedTeam: 'A', opponentTeam: '', matchDate: '2026-01-01', analyst: 'X' }).length, 1, 'valida rival faltante');
ok(C.isValidEmail('a@b.cl') && !C.isValidEmail('mal'), 'validación email');

/* 11) Motor de interpretación táctica */
(function () {
  const mk = (etq, extra) => Object.assign({ etiqueta: etq, zona: 'Z8', tercio: 'Creación', totalElapsedSeconds: 100 }, extra || {});
  // contrapresión baja => alerta con recomendación de replegar
  const evs = [
    mk('perdida', { reaccion: 'Repliegue', apoyos: 1, marcador: 'Empatando' }),
    mk('perdida', { reaccion: 'Contra concedida', apoyos: 2, marcador: 'Empatando' }),
    mk('perdida', { reaccion: 'Repliegue', apoyos: 1, marcador: 'Perdiendo' }),
    mk('perdida', { reaccion: 'Recuperada ≤5s', apoyos: 5, marcador: 'Ganando', zona: 'Z2', tercio: 'Iniciación' })
  ];
  const reads = C.tacticalReads(evs, [], { analyzedTeam: 'Coquimbo' });
  ok(Array.isArray(reads) && reads.length > 0, 'devuelve lecturas');
  const cp = reads.find(r => r.clave === 'Contrapresión tras pérdida');
  ok(cp && /[DATO]/.test(cp.obs) && cp.rec.length > 0, 'lectura de contrapresión con obs+rec');
  ok(reads.every(r => r.evidencia === 'baja' || r.evidencia === 'media'), 'evidencia acotada (baja/media)');
  ok(C.dataHonestyNotes().length >= 3, 'notas de honestidad de datos');
  // sin eventos => sin lecturas, sin romper
  ok(Array.isArray(C.tacticalReads([], [], {})) && C.tacticalReads([], [], {}).length === 0, 'vacío => []');
})();

console.log('\n' + (fail === 0 ? '✓ TODAS OK' : '✗ CON FALLOS') + ' — ' + pass + ' pasaron, ' + fail + ' fallaron.');
process.exit(fail === 0 ? 0 : 1);
