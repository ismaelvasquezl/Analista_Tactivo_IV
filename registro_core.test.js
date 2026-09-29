/* Pruebas unitarias del núcleo (ejecutar: node registro_core.test.js).
 * Sin framework: asserts simples y un contador. */
const C = require('./registro_core.js');
let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; } else { fail++; console.error('  ✗ FALLO:', msg); } }
function eq(a, b, msg) { ok(JSON.stringify(a) === JSON.stringify(b), (msg || '') + ' (esperado ' + JSON.stringify(b) + ', obtuvo ' + JSON.stringify(a) + ')'); }

/* 1) Conversión de tiempo */
eq(C.formatMMSS(0), '00:00', 'formatMMSS 0');
eq(C.formatMMSS(2058), '34:18', 'formatMMSS 2058');
eq(C.splitTime(2058), { minute: 34, second: 18, total: 2058 }, 'splitTime 2058');

/* 2) Cronómetro por marcas (pausa/reanudación exacta) */
(function () {
  // corre 60s, pausa 30s (no cuenta), reanuda y corre 40s => 100s
  const t0 = 1000000;
  let seg = C.clockStart([], t0);
  eq(C.computeElapsedSeconds(seg, t0 + 60000), 60, 'clock corre 60s');
  seg = C.clockPause(seg, t0 + 60000);
  eq(C.computeElapsedSeconds(seg, t0 + 90000), 60, 'pausa no acumula');
  ok(!C.isClockRunning(seg), 'pausado => no corriendo');
  seg = C.clockResume(seg, t0 + 90000);
  ok(C.isClockRunning(seg), 'reanudado => corriendo');
  eq(C.computeElapsedSeconds(seg, t0 + 130000), 100, 'total 60+40=100s tras reanudar');
})();

/* 3) Marcador y su recálculo */
(function () {
  const evs = [
    { id: 'a', eventType: 'goal_for' },
    { id: 'b', eventType: 'goal_against' },
    { id: 'c', eventType: 'goal_for' },
    { id: 'd', eventType: 'corner_for' }
  ];
  eq(C.computeScore(evs), { scoreFor: 2, scoreAgainst: 1 }, 'marcador 2-1');
  // eliminar un gol a favor (soft delete) => recalcula 1-1
  evs[0].deleted = true;
  eq(C.computeScore(evs), { scoreFor: 1, scoreAgainst: 1 }, 'recalcula al eliminar gol');
})();

/* 4) Clasificación ofensiva/defensiva y equipo asociado */
eq(C.organizationOf('corner_for'), 'offensive', 'corner_for ofensivo');
eq(C.organizationOf('goal_against'), 'defensive', 'goal_against defensivo');
eq(C.associatedTeam('goal_for', 'Coquimbo', 'Colo-Colo'), 'Coquimbo', 'gol a favor => analizado');
eq(C.associatedTeam('corner_against', 'Coquimbo', 'Colo-Colo'), 'Colo-Colo', 'contra => rival');

/* 5) Agregación estadística */
(function () {
  const evs = [
    { id: '1', eventType: 'corner_for', period: 'first_half', totalElapsedSeconds: 100, effectivenessLevel: 4, fieldZone: 'final_third', fieldSide: 'right' },
    { id: '2', eventType: 'free_kick_for', period: 'first_half', totalElapsedSeconds: 200, effectivenessLevel: 2, fieldZone: 'final_third', fieldSide: 'left' },
    { id: '3', eventType: 'goal_for', period: 'second_half', totalElapsedSeconds: 3000, fieldZone: 'opponent_box', fieldSide: 'center' },
    { id: '4', eventType: 'corner_against', period: 'second_half', totalElapsedSeconds: 3100, riskLevel: 5, fieldZone: 'own_box', fieldSide: 'left' },
    { id: '5', eventType: 'goal_against', period: 'second_half', totalElapsedSeconds: 3200, riskLevel: 3, fieldZone: 'own_box', fieldSide: 'center' }
  ];
  const s = C.aggregateStats(evs);
  eq(s.totals, { offensive: 3, defensive: 2, transitions: 0, events: 5 }, 'totales off/def');
  eq(s.goals, { for: 1, against: 1 }, 'goles');
  eq(s.corners, { for: 1, against: 1 }, 'corners');
  eq(s.setPieces, { for: 2, against: 1 }, 'balón parado');
  eq(s.offensiveEffectiveness, 3, 'efectividad media (4,2 => 3)');
  eq(s.defensiveRisk, 4, 'riesgo medio (5,3 => 4)');
  eq(s.byPeriod, { first_half: 2, second_half: 3 }, 'distribución por período');
  eq(s.score, { scoreFor: 1, scoreAgainst: 1 }, 'score dentro de stats');
})();

/* 5b) Fases y transición (nuevos tipos) */
(function () {
  eq(C.organizationOf('offensive_phase'), 'offensive', 'fase ofensiva => offensive');
  eq(C.organizationOf('defensive_phase'), 'defensive', 'fase defensiva => defensive');
  eq(C.organizationOf('turnover'), 'transition', 'pérdida de balón => transition');
  const evs = [
    { id: '1', eventType: 'offensive_phase', period: 'first_half', totalElapsedSeconds: 60 },
    { id: '2', eventType: 'defensive_phase', period: 'first_half', totalElapsedSeconds: 120 },
    { id: '3', eventType: 'turnover', period: 'first_half', totalElapsedSeconds: 180 },
    { id: '4', eventType: 'goal_for', period: 'first_half', totalElapsedSeconds: 240 }
  ];
  const s = C.aggregateStats(evs);
  eq(s.totals, { offensive: 2, defensive: 1, transitions: 1, events: 4 }, 'transición no infla off/def de balón parado');
  eq(s.phases, { offensive: 1, defensive: 1 }, 'conteo de fases');
  eq(s.turnovers, 1, 'conteo de pérdidas');
  eq(s.setPieces, { for: 0, against: 0 }, 'las fases no cuentan como balón parado');
  eq(s.score, { scoreFor: 1, scoreAgainst: 0 }, 'gol sigue contando marcador');
})();

/* 6) Momentos críticos */
(function () {
  const evs = [
    { id: 'g', eventType: 'goal_for', period: 'first_half', totalElapsedSeconds: 600 },
    { id: 'r', eventType: 'corner_against', period: 'second_half', totalElapsedSeconds: 2700, riskLevel: 5 },
    { id: 'l', eventType: 'free_kick_for', period: 'second_half', totalElapsedSeconds: 5200 } // min 86 => tramo final 2T
  ];
  const cm = C.detectCriticalMoments(evs);
  ok(cm.find(x => x.event.id === 'g' && x.reasons.includes('Gol')), 'gol es crítico');
  ok(cm.find(x => x.event.id === 'r' && x.reasons.some(r => r.indexOf('Riesgo') === 0)), 'riesgo 5 es crítico');
  ok(cm.find(x => x.event.id === 'l' && x.reasons.includes('Tramo final de tiempo')), 'tramo final 2T');
})();

/* 7) Exportación CSV (BOM + filas + orden) */
(function () {
  const session = { id: 'MATCH-X', analyzedTeam: 'Coquimbo', opponentTeam: 'Colo-Colo', matchDate: '2026-09-29', competition: 'Liga', analyst: 'Ismael' };
  const evs = [
    { id: 'b', eventType: 'goal_for', period: 'second_half', totalElapsedSeconds: 3000 },
    { id: 'a', eventType: 'corner_for', period: 'first_half', totalElapsedSeconds: 100, notes: 'con; punto y coma' }
  ];
  const csv = C.buildCSV(session, evs);
  ok(csv.charCodeAt(0) === 0xFEFF, 'CSV inicia con BOM');
  const lines = csv.replace('﻿', '').split('\n');
  eq(lines.length, 3, 'CSV: 1 encabezado + 2 filas');
  ok(lines[1].indexOf('00:0') === -1, 'columnas separadas por ;');
  ok(lines[1].split(';')[1] === 'a', 'ordenado por tiempo (evento a primero)');
  ok(csv.indexOf('"con; punto y coma"') > -1, 'escapa ; entre comillas');
})();

/* 8) IDs y validación */
ok(/^MATCH-\d{8}-\d{6}$/.test(C.genSessionId(new Date(2026, 8, 29, 15, 30, 0))), 'formato ID sesión');
eq(C.genSessionId(new Date(2026, 8, 29, 15, 30, 0)), 'MATCH-20260929-153000', 'ID sesión exacto');
eq(C.validateSession({ analyzedTeam: 'A', opponentTeam: '', matchDate: '2026-01-01', analyst: 'X' }).length, 1, 'valida rival faltante');
ok(C.isValidEmail('a@b.cl') && !C.isValidEmail('mal-correo'), 'validación email');

/* Resultado */
console.log('\n' + (fail === 0 ? '✓ TODAS OK' : '✗ CON FALLOS') + ' — ' + pass + ' pasaron, ' + fail + ' fallaron.');
process.exit(fail === 0 ? 0 : 1);
