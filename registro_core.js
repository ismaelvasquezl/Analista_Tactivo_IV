/* ============================================================================
 * registro_core.js — Núcleo de lógica de negocio del "Registro Táctico en Vivo"
 * Módulo del Football Tactical Analysis Framework.
 * Sin dependencias. UMD: funciona en el navegador (window.RegCore) y en Node
 * (module.exports) para poder ejecutar pruebas unitarias.
 * Toda la lógica pura vive aquí, separada de la interfaz.
 * ==========================================================================*/
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RegCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- Catálogos (español) ---------- */
  const EVENT_TYPES = {
    corner_for:        { label: 'Tiro de esquina a favor',    org: 'offensive',  side: 'for',     group: 'setpiece', color: '#4a90ff', key: '1' },
    free_kick_for:     { label: 'Tiro libre a favor',         org: 'offensive',  side: 'for',     group: 'setpiece', color: '#a78bfa', key: '2' },
    goal_for:          { label: 'Gol a favor',                org: 'offensive',  side: 'for',     group: 'setpiece', color: '#38d98a', key: '3' },
    corner_against:    { label: 'Tiro de esquina en contra',  org: 'defensive',  side: 'against', group: 'setpiece', color: '#f5a623', key: '4' },
    free_kick_against: { label: 'Tiro libre en contra',       org: 'defensive',  side: 'against', group: 'setpiece', color: '#ff8a5c', key: '5' },
    goal_against:      { label: 'Gol en contra',              org: 'defensive',  side: 'against', group: 'setpiece', color: '#ff5f5f', key: '6' },
    offensive_phase:   { label: 'Fase ofensiva',              org: 'offensive',  side: 'for',     group: 'phase',    color: '#3fd0c4', key: '7' },
    defensive_phase:   { label: 'Fase defensiva',             org: 'defensive',  side: 'for',     group: 'phase',    color: '#e8a13a', key: '8' },
    turnover:          { label: 'Pérdida de balón',           org: 'transition', side: 'for',     group: 'phase',    color: '#9aa7b2', key: '9' }
  };

  const STATUS_LABELS = {
    not_started: 'No iniciado', first_half: 'Primer tiempo', halftime: 'Entretiempo',
    second_half: 'Segundo tiempo', extra_time_first_half: 'Prórroga primer tiempo',
    extra_time_second_half: 'Prórroga segundo tiempo', paused: 'Pausado', finished: 'Finalizado'
  };

  // Períodos "de fútbol" (el estado 'paused' no es un período; se guarda el período subyacente).
  const PERIOD_LABELS = {
    first_half: 'Primer tiempo', halftime: 'Entretiempo', second_half: 'Segundo tiempo',
    extra_time_first_half: 'Prórroga primer tiempo', extra_time_second_half: 'Prórroga segundo tiempo'
  };

  const FIELD_SIDES = { left: 'Izquierda', center: 'Centro', right: 'Derecha', unspecified: 'Sin especificar' };
  const FIELD_ZONES = {
    own_half: 'Campo propio', middle_third: 'Zona media', final_third: 'Último tercio',
    own_box: 'Área propia', opponent_box: 'Área rival', unspecified: 'Sin especificar'
  };
  const OUTCOMES = ['Gol', 'Remate', 'Despeje', 'Recuperación', 'Sin remate', 'Otro'];

  /* ---------- Utilidades de tiempo ---------- */
  function pad2(n) { return String(n).padStart(2, '0'); }

  function formatMMSS(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds || 0));
    return pad2(Math.floor(s / 60)) + ':' + pad2(s % 60);
  }

  function splitTime(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds || 0));
    return { minute: Math.floor(s / 60), second: s % 60, total: s };
  }

  /**
   * Cronómetro por marcas de tiempo (robusto a cambios de pestaña / navegación).
   * segments: [{start:epochMs, end:epochMs|null}]. Se calcula el elapsed real
   * sumando los intervalos; el último abierto (end=null) implica "corriendo".
   */
  function computeElapsedSeconds(segments, nowMs) {
    if (!Array.isArray(segments)) return 0;
    const now = typeof nowMs === 'number' ? nowMs : Date.now();
    let ms = 0;
    for (const seg of segments) {
      if (!seg || typeof seg.start !== 'number') continue;
      const end = (typeof seg.end === 'number') ? seg.end : now;
      if (end > seg.start) ms += (end - seg.start);
    }
    return Math.floor(ms / 1000);
  }

  function isClockRunning(segments) {
    return Array.isArray(segments) && segments.length > 0 &&
      segments[segments.length - 1].end == null;
  }

  // Operaciones inmutables sobre segments
  function clockStart(segments, nowMs) {
    const now = typeof nowMs === 'number' ? nowMs : Date.now();
    if (isClockRunning(segments)) return segments.slice();
    return (segments || []).concat([{ start: now, end: null }]);
  }
  function clockPause(segments, nowMs) {
    const now = typeof nowMs === 'number' ? nowMs : Date.now();
    if (!isClockRunning(segments)) return (segments || []).slice();
    const out = segments.slice();
    out[out.length - 1] = { start: out[out.length - 1].start, end: now };
    return out;
  }
  function clockResume(segments, nowMs) { return clockStart(segments, nowMs); }

  /* ---------- Identificadores ---------- */
  function genSessionId(date) {
    const d = date || new Date();
    return 'MATCH-' +
      d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + '-' +
      pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds());
  }
  function genEventId(seedNow) {
    const t = (typeof seedNow === 'number' ? seedNow : Date.now());
    return 'EVT-' + t.toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  /* ---------- Clasificación y marcador ---------- */
  function organizationOf(eventType) {
    const m = EVENT_TYPES[eventType];
    return m ? m.org : 'offensive';
  }
  function associatedTeam(eventType, analyzedTeam, opponentTeam) {
    const m = EVENT_TYPES[eventType];
    return (m && m.side === 'against') ? (opponentTeam || 'Rival') : (analyzedTeam || 'Equipo analizado');
  }

  function isActive(ev) { return ev && !ev.deleted; }

  function computeScore(events) {
    let sFor = 0, sAgainst = 0;
    for (const ev of (events || [])) {
      if (!isActive(ev)) continue;
      if (ev.eventType === 'goal_for') sFor++;
      else if (ev.eventType === 'goal_against') sAgainst++;
    }
    return { scoreFor: sFor, scoreAgainst: sAgainst };
  }

  /* ---------- Agregación estadística ---------- */
  function avg(list) {
    const v = list.filter(x => typeof x === 'number' && !isNaN(x));
    if (!v.length) return null;
    return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100) / 100;
  }

  function aggregateStats(events) {
    const active = (events || []).filter(isActive);
    const counts = {};
    Object.keys(EVENT_TYPES).forEach(k => (counts[k] = 0));
    let offensive = 0, defensive = 0, transitions = 0;
    const byPeriod = {}, byZone = {}, bySide = {};
    const offEff = [], defRisk = [];

    for (const ev of active) {
      if (counts[ev.eventType] != null) counts[ev.eventType]++;
      const org = organizationOf(ev.eventType);
      if (org === 'offensive') { offensive++; if (typeof ev.effectivenessLevel === 'number') offEff.push(ev.effectivenessLevel); }
      else if (org === 'defensive') { defensive++; if (typeof ev.riskLevel === 'number') defRisk.push(ev.riskLevel); }
      else { transitions++; }
      byPeriod[ev.period] = (byPeriod[ev.period] || 0) + 1;
      const z = ev.fieldZone || 'unspecified'; byZone[z] = (byZone[z] || 0) + 1;
      const s = ev.fieldSide || 'unspecified'; bySide[s] = (bySide[s] || 0) + 1;
    }

    const setPiecesFor = counts.corner_for + counts.free_kick_for;   // acciones ofensivas de balón parado (sin gol)
    const setPiecesAgainst = counts.corner_against + counts.free_kick_against;

    return {
      counts,
      totals: { offensive, defensive, transitions, events: active.length },
      phases: { offensive: counts.offensive_phase, defensive: counts.defensive_phase },
      turnovers: counts.turnover,
      goals: { for: counts.goal_for, against: counts.goal_against },
      corners: { for: counts.corner_for, against: counts.corner_against },
      freeKicks: { for: counts.free_kick_for, against: counts.free_kick_against },
      setPieces: { for: setPiecesFor, against: setPiecesAgainst },
      setPieceBalance: (setPiecesFor + counts.goal_for) - (setPiecesAgainst + counts.goal_against),
      eventBalance: offensive - defensive,
      offensiveEffectiveness: avg(offEff),
      defensiveRisk: avg(defRisk),
      byPeriod, byZone, bySide,
      score: computeScore(active)
    };
  }

  /* ---------- Momentos críticos (regla configurable) ---------- */
  const DEFAULT_CRITICAL = {
    goals: true,
    riskThreshold: 4,
    consecutiveDefensive: 2,
    consecutiveWindowSec: 300,   // 5 min
    lateWindowSec: 600           // últimos 10 min de cada tiempo
  };

  function detectCriticalMoments(events, cfg) {
    const c = Object.assign({}, DEFAULT_CRITICAL, cfg || {});
    const active = (events || []).filter(isActive)
      .slice().sort((a, b) => a.totalElapsedSeconds - b.totalElapsedSeconds);
    const flagged = new Map(); // id -> {event, reasons:[]}
    const push = (ev, reason) => {
      if (!flagged.has(ev.id)) flagged.set(ev.id, { event: ev, reasons: [] });
      const r = flagged.get(ev.id).reasons; if (r.indexOf(reason) < 0) r.push(reason);
    };

    for (const ev of active) {
      if (c.goals && (ev.eventType === 'goal_for' || ev.eventType === 'goal_against')) push(ev, 'Gol');
      if (typeof ev.riskLevel === 'number' && ev.riskLevel >= c.riskThreshold) push(ev, 'Riesgo ≥ ' + c.riskThreshold);
    }

    // Ventana de últimos 10 min de cada tiempo: aprox. minuto de período >= 35 (1T) / >= 80 total no fiable,
    // usamos minuto local del período estimado por saltos de período.
    // Regla simple y transparente: minuto de partido dentro de [40,45+] o [85,90+].
    for (const ev of active) {
      const min = Math.floor(ev.totalElapsedSeconds / 60);
      if ((ev.period === 'first_half' && min >= 40) ||
          (ev.period === 'second_half' && min >= 85) ||
          (ev.period === 'extra_time_first_half' && min >= 100) ||
          (ev.period === 'extra_time_second_half' && min >= 115)) {
        push(ev, 'Tramo final de tiempo');
      }
    }

    // 2+ eventos defensivos consecutivos en < 5 min
    const defOnly = active.filter(e => organizationOf(e.eventType) === 'defensive');
    for (let i = 0; i + (c.consecutiveDefensive - 1) < defOnly.length; i++) {
      const a = defOnly[i], b = defOnly[i + c.consecutiveDefensive - 1];
      if (b.totalElapsedSeconds - a.totalElapsedSeconds <= c.consecutiveWindowSec) {
        for (let k = i; k <= i + c.consecutiveDefensive - 1; k++) push(defOnly[k], 'Racha defensiva (' + c.consecutiveDefensive + ' en <5min)');
      }
    }
    return Array.from(flagged.values()).sort((x, y) => x.event.totalElapsedSeconds - y.event.totalElapsedSeconds);
  }

  /* ---------- Resumen ejecutivo (reglas, sin inventar) ---------- */
  function periodOfMaxDefense(byPeriod, events) {
    // Devuelve el período con más eventos defensivos.
    const defByPeriod = {};
    (events || []).filter(isActive).forEach(ev => {
      if (organizationOf(ev.eventType) === 'defensive') defByPeriod[ev.period] = (defByPeriod[ev.period] || 0) + 1;
    });
    let best = null, n = 0;
    Object.keys(defByPeriod).forEach(p => { if (defByPeriod[p] > n) { n = defByPeriod[p]; best = p; } });
    return best ? { period: best, count: n } : null;
  }

  function generateExecutiveSummary(session, events, stats) {
    const s = stats || aggregateStats(events);
    const active = (events || []).filter(isActive);
    if (!active.length) return 'Sesión sin eventos registrados. No hay datos suficientes para generar un resumen.';
    const team = (session && session.analyzedTeam) || 'El equipo analizado';
    const parts = [];
    parts.push(
      team + ' registró ' + s.setPieces.for + ' acción(es) de balón detenido a favor' +
      (s.setPieces.for ? ' (' + s.corners.for + ' tiro(s) de esquina y ' + s.freeKicks.for + ' tiro(s) libre)' : '') +
      (s.goals.for ? ', más ' + s.goals.for + ' gol(es) a favor' : '') + '.'
    );
    parts.push(
      'A nivel defensivo enfrentó ' + s.setPieces.against + ' acción(es) de balón detenido del rival' +
      (s.goals.against ? ' y recibió ' + s.goals.against + ' gol(es)' : '') + '.'
    );
    const md = periodOfMaxDefense(s.byPeriod, active);
    if (md) parts.push('El período de mayor exposición defensiva fue ' + (PERIOD_LABELS[md.period] || md.period).toLowerCase() + ' (' + md.count + ' evento(s)).');
    if (s.defensiveRisk != null) parts.push('El riesgo defensivo promedio registrado fue ' + s.defensiveRisk + '/5.');
    if (s.offensiveEffectiveness != null) parts.push('La efectividad ofensiva media fue ' + s.offensiveEffectiveness + '/5.');
    return parts.join(' ');
  }

  /* ---------- Exportación CSV (UTF-8 + BOM) ---------- */
  const CSV_COLUMNS = [
    ['sessionId', 'ID de sesión'], ['id', 'ID de evento'], ['matchDate', 'Fecha del partido'],
    ['analyzedTeam', 'Equipo analizado'], ['opponentTeam', 'Equipo rival'], ['competition', 'Competición'],
    ['analyst', 'Analista'], ['period', 'Período'], ['minute', 'Minuto'], ['second', 'Segundo'],
    ['totalElapsedSeconds', 'Tiempo total (s)'], ['organization', 'Tipo de organización'],
    ['eventLabel', 'Evento'], ['associatedTeam', 'Equipo asociado'], ['fieldSide', 'Sector'],
    ['fieldZone', 'Zona'], ['taker', 'Jugador ejecutor'], ['involvedPlayer', 'Jugador involucrado'],
    ['outcome', 'Resultado'], ['riskLevel', 'Riesgo'], ['effectivenessLevel', 'Efectividad'],
    ['notes', 'Observaciones'], ['createdAt', 'Creado'], ['updatedAt', 'Última edición']
  ];

  function csvEscape(v) {
    if (v == null) return '';
    const s = String(v);
    return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  // Devuelve una fila "aplanada" y legible (español) por evento.
  function eventToRow(session, ev) {
    const org = organizationOf(ev.eventType);
    return {
      sessionId: session.id, id: ev.id, matchDate: session.matchDate || '',
      analyzedTeam: session.analyzedTeam || '', opponentTeam: session.opponentTeam || '',
      competition: session.competition || '', analyst: session.analyst || '',
      period: PERIOD_LABELS[ev.period] || STATUS_LABELS[ev.period] || ev.period || '',
      minute: Math.floor(ev.totalElapsedSeconds / 60), second: ev.totalElapsedSeconds % 60,
      totalElapsedSeconds: ev.totalElapsedSeconds,
      organization: org === 'offensive' ? 'Ofensiva' : org === 'defensive' ? 'Defensiva' : 'Transición',
      eventLabel: (EVENT_TYPES[ev.eventType] || {}).label || ev.eventType,
      associatedTeam: ev.associatedTeam || associatedTeam(ev.eventType, session.analyzedTeam, session.opponentTeam),
      fieldSide: FIELD_SIDES[ev.fieldSide] || '', fieldZone: FIELD_ZONES[ev.fieldZone] || '',
      taker: ev.taker || '', involvedPlayer: ev.involvedPlayer || '',
      outcome: ev.outcome || '', riskLevel: ev.riskLevel == null ? '' : ev.riskLevel,
      effectivenessLevel: ev.effectivenessLevel == null ? '' : ev.effectivenessLevel,
      notes: ev.notes || '', createdAt: ev.createdAt || '', updatedAt: ev.updatedAt || ''
    };
  }

  function buildCSV(session, events, opts) {
    const withBom = !opts || opts.bom !== false;
    const rows = (events || []).filter(isActive)
      .slice().sort((a, b) => a.totalElapsedSeconds - b.totalElapsedSeconds)
      .map(ev => eventToRow(session, ev));
    const header = CSV_COLUMNS.map(c => csvEscape(c[1])).join(';');
    const body = rows.map(r => CSV_COLUMNS.map(c => csvEscape(r[c[0]])).join(';')).join('\n');
    const text = header + '\n' + body;
    return (withBom ? '﻿' : '') + text;
  }

  function safeFileBase(session) {
    const clean = s => (s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]/g, '');
    return 'Analisis_Tactico_' + (clean(session.analyzedTeam) || 'Equipo') + '_vs_' +
      (clean(session.opponentTeam) || 'Rival') + '_' + (session.matchDate || 'sin-fecha');
  }

  /* ---------- Validación ---------- */
  function validateSession(s) {
    const errs = [];
    if (!s || !String(s.analyzedTeam || '').trim()) errs.push('Equipo analizado es obligatorio.');
    if (!s || !String(s.opponentTeam || '').trim()) errs.push('Equipo rival es obligatorio.');
    if (!s || !String(s.matchDate || '').trim()) errs.push('Fecha del partido es obligatoria.');
    if (!s || !String(s.analyst || '').trim()) errs.push('Analista responsable es obligatorio.');
    return errs;
  }
  function isValidEmail(x) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(x || '').trim()); }

  return {
    EVENT_TYPES, STATUS_LABELS, PERIOD_LABELS, FIELD_SIDES, FIELD_ZONES, OUTCOMES, CSV_COLUMNS, DEFAULT_CRITICAL,
    pad2, formatMMSS, splitTime, computeElapsedSeconds, isClockRunning, clockStart, clockPause, clockResume,
    genSessionId, genEventId, organizationOf, associatedTeam, computeScore, aggregateStats,
    detectCriticalMoments, generateExecutiveSummary, buildCSV, eventToRow, safeFileBase,
    validateSession, isValidEmail, avg
  };
});
