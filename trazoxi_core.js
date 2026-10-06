/* ============================================================================
 * trazoxi_core.js — Núcleo de lógica del "Registro Táctico TrazoXI".
 * Evolución del registro del Football Tactical Analysis Framework, ahora sobre
 * el DICCIONARIO de la plantilla TrazoXI: 6 fases, 13 etiquetas, 18 zonas,
 * carriles, marcador, presión, resultado, rompe línea, reacción tras pérdida y
 * apoyos. Incluye el instrumento de la tesis (Point-Biserial) y el cómputo de
 * secuencias de posesión (las 4 preguntas).
 *
 * Sin dependencias. UMD: navegador (window.TrazoCore) y Node (module.exports)
 * para pruebas. Toda la lógica pura vive aquí, separada de la interfaz.
 * ==========================================================================*/
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TrazoCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* =========================================================================
   * 1 · CATÁLOGOS — el diccionario de la plantilla TrazoXI
   * =======================================================================*/
  const FASES = {
    org_of:   { label: 'Org. ofensiva',        org: 'offensive' },
    org_def:  { label: 'Org. defensiva',       org: 'defensive' },
    tran_of:  { label: 'Transición ofensiva',  org: 'offensive' },
    tran_def: { label: 'Transición defensiva', org: 'defensive' },
    abp_of:   { label: 'ABP ofensivo',         org: 'offensive' },
    abp_def:  { label: 'ABP defensivo',        org: 'defensive' }
  };

  // 13 etiquetas. `fase` = fase sugerida al registrar; `key` = atajo de teclado.
  // `needs` marca campos que conviene completar para esa etiqueta.
  const ETIQUETAS = {
    inicio_salida:   { label: 'Inicio / Salida',       fase: 'org_of',   key: '1', color: '#4a90ff' },
    progresion:      { label: 'Progresión',            fase: 'org_of',   key: '2', color: '#5aa8ff' },
    ultimo_pase:     { label: 'Último pase / Centro',  fase: 'org_of',   key: '3', color: '#38b6ff' },
    finalizacion:    { label: 'Finalización',          fase: 'org_of',   key: '4', color: '#38d98a', needs: ['resultado'] },
    recuperacion:    { label: 'Recuperación',          fase: 'tran_of',  key: '5', color: '#3fd0c4' },
    ataque_tran:     { label: 'Ataque en transición',  fase: 'tran_of',  key: '6', color: '#2fd6b6' },
    presion:         { label: 'Presión',               fase: 'org_def',  key: '7', color: '#f5a623' },
    accion_def:      { label: 'Acción defensiva',      fase: 'org_def',  key: '8', color: '#e8a13a' },
    defensa_area:    { label: 'Defensa del área',      fase: 'org_def',  key: '9', color: '#ff8a5c' },
    perdida:         { label: 'Pérdida',               fase: 'tran_def', key: '0', color: '#9aa7b2', needs: ['apoyos', 'reaccion'] },
    abp_of:          { label: 'ABP ofensivo',          fase: 'abp_of',   key: 'q', color: '#a78bfa' },
    abp_def:         { label: 'ABP defensivo',         fase: 'abp_def',  key: 'w', color: '#c08bff' },
    incidencia:      { label: 'Incidencia',            fase: null,       key: 'e', color: '#7f8c98' }
  };

  const TERCIOS = ['Iniciación', 'Creación', 'Finalización'];
  const CARRILES = ['Banda izq', 'Half-space izq', 'Central', 'Half-space der', 'Banda der'];
  const MARCADORES = ['Ganando', 'Empatando', 'Perdiendo'];
  const PRESIONES = ['Nula', 'Media', 'Alta', 'Orientada'];
  const RESULTADOS = ['Gol', 'Ocasión', 'Parada', 'Fuera', 'Bloqueo', 'Despeje', 'Robo', 'Falta', 'Pérdida', 'Éxito', 'Superada'];
  const ROMPE = ['Sí', 'No', '—'];
  const REACCIONES = ['Recuperada ≤5s', 'Repliegue', 'Contra concedida', 'Falta táctica', '—'];
  const EQUIPOS = { propio: 'Equipo analizado', rival: 'Rival' };

  const SEQ_TIPOS = ['Tras recuperación', 'Saque de arco a favor', 'Saque de arco en contra'];
  const SEQ_RESULTADOS = ['Pérdida', 'Remate', 'Gol', 'Concede saque', 'Recuperamos', 'Falta'];

  const STATUS_LABELS = {
    not_started: 'No iniciado', first_half: 'Primer tiempo', halftime: 'Entretiempo',
    second_half: 'Segundo tiempo', extra_time_first_half: 'Prórroga 1T',
    extra_time_second_half: 'Prórroga 2T', paused: 'Pausado', finished: 'Finalizado'
  };
  const PERIOD_LABELS = {
    first_half: 'Primer tiempo', halftime: 'Entretiempo', second_half: 'Segundo tiempo',
    extra_time_first_half: 'Prórroga 1T', extra_time_second_half: 'Prórroga 2T'
  };

  /* =========================================================================
   * 2 · MODELO DE 18 ZONAS (numeradas desde la defensa propia)
   *   Z1–Z3 defensa · Z4–Z6 salida · Z7–Z9 medio def · Z10–Z12 medio of ·
   *   Z13–Z15 creación · Z16–Z18 finalización.  6 bandas × 3 columnas.
   * =======================================================================*/
  const ZONAS = Array.from({ length: 18 }, (_, i) => 'Z' + (i + 1));

  function zoneNum(zona) { const n = parseInt(String(zona).replace(/^Z/, ''), 10); return (n >= 1 && n <= 18) ? n : null; }
  function zoneBand(zona) { const n = zoneNum(zona); return n ? Math.ceil(n / 3) : null; }      // 1..6
  function zoneCol(zona) { const n = zoneNum(zona); return n ? ((n - 1) % 3) + 1 : null; }       // 1 izq · 2 centro · 3 der
  function tercioOfZone(zona) {
    const b = zoneBand(zona); if (!b) return '';
    return b <= 2 ? 'Iniciación' : b <= 4 ? 'Creación' : 'Finalización';
  }
  function carrilOfZone(zona) {
    const c = zoneCol(zona); return c === 1 ? 'Banda izq' : c === 3 ? 'Banda der' : 'Central';
  }
  function zoneFromBandCol(band, col) {
    if (band < 1 || band > 6 || col < 1 || col > 3) return null;
    return 'Z' + ((band - 1) * 3 + col);
  }

  /* =========================================================================
   * 3 · TIEMPO Y CRONÓMETRO (por marcas; robusto a cambios de pestaña)
   * =======================================================================*/
  function pad2(n) { return String(n).padStart(2, '0'); }
  function formatMMSS(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds || 0));
    return pad2(Math.floor(s / 60)) + ':' + pad2(s % 60);
  }
  function splitTime(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds || 0));
    return { minute: Math.floor(s / 60), second: s % 60, total: s };
  }
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
    return Array.isArray(segments) && segments.length > 0 && segments[segments.length - 1].end == null;
  }
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

  /* =========================================================================
   * 4 · IDENTIFICADORES
   * =======================================================================*/
  function genSessionId(date) {
    const d = date || new Date();
    return 'TRZ-' + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + '-' +
      pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds());
  }
  function genEventId(seedNow) {
    const t = (typeof seedNow === 'number' ? seedNow : Date.now());
    return 'EV-' + t.toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }
  function genSeqId(seedNow) {
    const t = (typeof seedNow === 'number' ? seedNow : Date.now());
    return 'SQ-' + t.toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  }

  /* =========================================================================
   * 5 · CLASIFICACIÓN, MARCADOR Y EQUIPO
   * =======================================================================*/
  function orgOfFase(faseId) { const f = FASES[faseId]; return f ? f.org : 'neutral'; }
  function orgOfEtiqueta(etqId) {
    const e = ETIQUETAS[etqId]; if (!e) return 'neutral';
    return e.fase ? orgOfFase(e.fase) : 'neutral';
  }
  function faseSugerida(etqId) { const e = ETIQUETAS[etqId]; return e ? e.fase : null; }
  function isActive(ev) { return ev && !ev.deleted; }

  // Un gol es un evento con resultado 'Gol'. El equipo decide a favor / en contra.
  function isGoal(ev) { return ev && ev.resultado === 'Gol'; }
  function computeScore(events) {
    let f = 0, a = 0;
    for (const ev of (events || [])) {
      if (!isActive(ev) || !isGoal(ev)) continue;
      if (ev.equipo === 'rival') a++; else f++;
    }
    return { scoreFor: f, scoreAgainst: a };
  }
  function marcadorFromScore(scoreFor, scoreAgainst) {
    if (scoreFor > scoreAgainst) return 'Ganando';
    if (scoreFor < scoreAgainst) return 'Perdiendo';
    return 'Empatando';
  }
  // Marcador del equipo analizado en el instante del evento (según goles previos).
  function marcadorAt(events, totalElapsedSeconds, excludeId) {
    let f = 0, a = 0;
    for (const ev of (events || [])) {
      if (!isActive(ev) || !isGoal(ev)) continue;
      if (excludeId && ev.id === excludeId) continue;
      if (ev.totalElapsedSeconds < totalElapsedSeconds) { if (ev.equipo === 'rival') a++; else f++; }
    }
    return marcadorFromScore(f, a);
  }

  /* =========================================================================
   * 6 · AGREGACIÓN ESTADÍSTICA
   * =======================================================================*/
  function emptyCount(keys) { const o = {}; keys.forEach(k => (o[k] = 0)); return o; }
  function avg(list) {
    const v = (list || []).filter(x => typeof x === 'number' && !isNaN(x));
    if (!v.length) return null;
    return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100) / 100;
  }

  function aggregateStats(events) {
    const active = (events || []).filter(isActive);
    const byEtiqueta = emptyCount(Object.keys(ETIQUETAS));
    const byFase = emptyCount(Object.keys(FASES));
    const byZona = emptyCount(ZONAS);
    const byTercio = { 'Iniciación': 0, 'Creación': 0, 'Finalización': 0 };
    const byCarril = emptyCount(CARRILES);
    const byMarcador = { 'Ganando': 0, 'Empatando': 0, 'Perdiendo': 0 };
    const byPeriod = {};
    let offensive = 0, defensive = 0, neutral = 0;

    for (const ev of active) {
      if (byEtiqueta[ev.etiqueta] != null) byEtiqueta[ev.etiqueta]++;
      if (ev.fase && byFase[ev.fase] != null) byFase[ev.fase]++;
      if (ev.zona && byZona[ev.zona] != null) byZona[ev.zona]++;
      const terc = ev.tercio || tercioOfZone(ev.zona); if (byTercio[terc] != null) byTercio[terc]++;
      if (ev.carril && byCarril[ev.carril] != null) byCarril[ev.carril]++;
      if (ev.marcador && byMarcador[ev.marcador] != null) byMarcador[ev.marcador]++;
      byPeriod[ev.period] = (byPeriod[ev.period] || 0) + 1;
      const org = ev.fase ? orgOfFase(ev.fase) : orgOfEtiqueta(ev.etiqueta);
      if (org === 'offensive') offensive++; else if (org === 'defensive') defensive++; else neutral++;
    }

    const score = computeScore(active);
    const finalizaciones = active.filter(e => e.etiqueta === 'finalizacion');
    const remates = finalizaciones.length;
    const golesPropios = active.filter(e => isGoal(e) && e.equipo !== 'rival').length;

    return {
      totals: { offensive, defensive, neutral, events: active.length },
      byEtiqueta, byFase, byZona, byTercio, byCarril, byMarcador, byPeriod,
      goals: { for: score.scoreFor, against: score.scoreAgainst },
      score,
      remates,
      conversionRemate: remates ? Math.round(golesPropios / remates * 100) : null
    };
  }

  /* =========================================================================
   * 7 · LA TESIS — recuperación tras pérdida + Point-Biserial
   *   Variable binaria: reacción === 'Recuperada ≤5s'.
   *   Predictor continuo: apoyos al perder (≤10m).
   * =======================================================================*/
  function recoveryStats(events) {
    const perdidas = (events || []).filter(e => isActive(e) && e.etiqueta === 'perdida' && e.reaccion && e.reaccion !== '—');
    const n = perdidas.length;
    const rec = perdidas.filter(e => e.reaccion === 'Recuperada ≤5s').length;
    const byReaccion = {};
    REACCIONES.forEach(r => (byReaccion[r] = 0));
    perdidas.forEach(e => { byReaccion[e.reaccion] = (byReaccion[e.reaccion] || 0) + 1; });
    const byMarcador = {};
    MARCADORES.forEach(m => {
      const sub = perdidas.filter(e => e.marcador === m);
      const r = sub.filter(e => e.reaccion === 'Recuperada ≤5s').length;
      byMarcador[m] = { n: sub.length, recovered: r, rate: sub.length ? Math.round(r / sub.length * 100) : null };
    });
    return { n, recovered: rec, rate: n ? Math.round(rec / n * 100) : null, byReaccion, byMarcador };
  }

  // Correlación punto-biserial entre x (continua) e y (binaria 0/1).
  // r = ((M1 - M0) / sn) * sqrt(p1 * p0), con sn = desv. estándar poblacional de x.
  function pointBiserial(pairs) {
    const data = (pairs || []).filter(p => p && typeof p.x === 'number' && !isNaN(p.x) && (p.y === 0 || p.y === 1));
    const n = data.length;
    const g1 = data.filter(p => p.y === 1), g0 = data.filter(p => p.y === 0);
    if (n < 3 || !g1.length || !g0.length) return { r: null, n: n, n1: g1.length, n0: g0.length, reason: 'muestra insuficiente' };
    const xs = data.map(p => p.x);
    const mean = xs.reduce((a, b) => a + b, 0) / n;
    const sn = Math.sqrt(xs.reduce((a, b) => a + (b - mean) * (b - mean), 0) / n);
    if (sn === 0) return { r: null, n: n, n1: g1.length, n0: g0.length, reason: 'sin varianza' };
    const m1 = g1.reduce((a, b) => a + b.x, 0) / g1.length;
    const m0 = g0.reduce((a, b) => a + b.x, 0) / g0.length;
    const p1 = g1.length / n, p0 = g0.length / n;
    const r = ((m1 - m0) / sn) * Math.sqrt(p1 * p0);
    return { r: Math.round(r * 1000) / 1000, n: n, n1: g1.length, n0: g0.length, m1: Math.round(m1 * 100) / 100, m0: Math.round(m0 * 100) / 100 };
  }

  // Pares (apoyos, recuperada≤5s) listos para el point-biserial, desde las pérdidas.
  function recoveryPairs(events) {
    return (events || [])
      .filter(e => isActive(e) && e.etiqueta === 'perdida' && typeof e.apoyos === 'number' && e.reaccion && e.reaccion !== '—')
      .map(e => ({ x: e.apoyos, y: e.reaccion === 'Recuperada ≤5s' ? 1 : 0 }));
  }
  function thesisAnalysis(events) {
    return { recovery: recoveryStats(events), pointBiserial: pointBiserial(recoveryPairs(events)) };
  }

  /* =========================================================================
   * 8 · SECUENCIAS DE POSESIÓN — las 4 preguntas
   * =======================================================================*/
  function sequenceDuration(seq) {
    if (seq && typeof seq.tStart === 'number' && typeof seq.tEnd === 'number' && seq.tEnd >= seq.tStart) return seq.tEnd - seq.tStart;
    return null;
  }
  function sequenceStats(sequences) {
    const out = {};
    SEQ_TIPOS.forEach(tipo => {
      const sub = (sequences || []).filter(s => s && !s.deleted && s.tipo === tipo);
      const durs = sub.map(sequenceDuration).filter(d => typeof d === 'number');
      const pases = sub.map(s => s.pases).filter(p => typeof p === 'number');
      const remates = sub.filter(s => s.resultado === 'Remate' || s.resultado === 'Gol').length;
      out[tipo] = {
        n: sub.length,
        duracionMedia: durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length * 10) / 10 : null,
        pasesMedio: pases.length ? Math.round(pases.reduce((a, b) => a + b, 0) / pases.length * 10) / 10 : null,
        pctRemate: sub.length ? Math.round(remates / sub.length * 100) : null
      };
    });
    return out;
  }

  /* =========================================================================
   * 9 · MOMENTOS CRÍTICOS (regla transparente)
   * =======================================================================*/
  function detectCriticalMoments(events) {
    const active = (events || []).filter(isActive).slice().sort((a, b) => a.totalElapsedSeconds - b.totalElapsedSeconds);
    const flagged = new Map();
    const push = (ev, reason) => {
      if (!flagged.has(ev.id)) flagged.set(ev.id, { event: ev, reasons: [] });
      const r = flagged.get(ev.id).reasons; if (r.indexOf(reason) < 0) r.push(reason);
    };
    for (const ev of active) {
      if (isGoal(ev)) push(ev, ev.equipo === 'rival' ? 'Gol en contra' : 'Gol a favor');
      if (ev.etiqueta === 'perdida' && ev.reaccion === 'Contra concedida') push(ev, 'Pérdida → contra concedida');
      if (ev.etiqueta === 'finalizacion' && (ev.resultado === 'Ocasión' || ev.resultado === 'Parada')) push(ev, 'Ocasión clara');
      const min = Math.floor(ev.totalElapsedSeconds / 60);
      if ((ev.period === 'first_half' && min >= 40) || (ev.period === 'second_half' && min >= 85)) push(ev, 'Tramo final de tiempo');
    }
    return Array.from(flagged.values()).sort((x, y) => x.event.totalElapsedSeconds - y.event.totalElapsedSeconds);
  }

  /* =========================================================================
   * 10 · EXPORTACIÓN CSV — esquema EXACTO de la hoja "Registro" de la plantilla
   * =======================================================================*/
  const CSV_COLUMNS = [
    ['id', 'ID'], ['clip', 'Clip (min vídeo)'], ['minPartido', 'Min partido'], ['equipoNombre', 'Equipo'],
    ['jugador', 'Jugador'], ['faseLabel', 'Fase'], ['etiquetaLabel', 'Etiqueta'], ['tercio', 'Tercio'],
    ['zona', 'Zona'], ['carril', 'Carril'], ['marcador', 'Marcador'], ['presion', 'Presión rival'],
    ['resultado', 'Resultado'], ['rompe', 'Rompe línea'], ['reaccion', 'Reacción tras pérdida'],
    ['apoyos', 'Apoyos al perder (≤10m)'], ['nota', 'Nota']
  ];
  function csvEscape(v) {
    if (v == null) return '';
    const s = String(v);
    return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function equipoNombre(ev, session) {
    return ev.equipo === 'rival' ? (session.opponentTeam || 'Rival') : (session.analyzedTeam || 'Equipo');
  }
  function eventToRow(session, ev) {
    return {
      id: ev.seq != null ? ev.seq : ev.id,
      clip: ev.clip || '',
      minPartido: Math.floor((ev.totalElapsedSeconds || 0) / 60),
      equipoNombre: equipoNombre(ev, session),
      jugador: ev.jugador || '',
      faseLabel: ev.fase && FASES[ev.fase] ? FASES[ev.fase].label : '',
      etiquetaLabel: ETIQUETAS[ev.etiqueta] ? ETIQUETAS[ev.etiqueta].label : (ev.etiqueta || ''),
      tercio: ev.tercio || tercioOfZone(ev.zona) || '',
      zona: ev.zona || '',
      carril: ev.carril || '',
      marcador: ev.marcador || '',
      presion: ev.presion || '',
      resultado: ev.resultado || '',
      rompe: ev.rompe || '',
      reaccion: ev.reaccion || '',
      apoyos: (typeof ev.apoyos === 'number') ? ev.apoyos : '',
      nota: ev.nota || ''
    };
  }
  function buildCSV(session, events, opts) {
    const withBom = !opts || opts.bom !== false;
    const rows = (events || []).filter(isActive).slice()
      .sort((a, b) => a.totalElapsedSeconds - b.totalElapsedSeconds)
      .map((ev, i) => { ev = Object.assign({}, ev, { seq: i + 1 }); return eventToRow(session, ev); });
    const header = CSV_COLUMNS.map(c => csvEscape(c[1])).join(';');
    const body = rows.map(r => CSV_COLUMNS.map(c => csvEscape(r[c[0]])).join(';')).join('\n');
    return (withBom ? '﻿' : '') + header + '\n' + body;
  }
  function safeFileBase(session) {
    const clean = s => (s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]/g, '');
    return 'TrazoXI_Registro_' + (clean(session.analyzedTeam) || 'Equipo') + '_vs_' +
      (clean(session.opponentTeam) || 'Rival') + '_' + (session.matchDate || 'sin-fecha');
  }

  /* =========================================================================
   * 11 · RESUMEN EJECUTIVO (reglas, sin inventar) + VALIDACIÓN
   * =======================================================================*/
  function generateExecutiveSummary(session, events) {
    const active = (events || []).filter(isActive);
    if (!active.length) return 'Sesión sin eventos. No hay datos suficientes para un resumen.';
    const s = aggregateStats(active);
    const th = thesisAnalysis(active);
    const team = (session && session.analyzedTeam) || 'El equipo analizado';
    const parts = [];
    parts.push(team + ' registró ' + active.length + ' evento(s): ' + s.totals.offensive + ' ofensivos, ' +
      s.totals.defensive + ' defensivos. Marcador ' + s.score.scoreFor + '-' + s.score.scoreAgainst + '.');
    if (s.remates) parts.push('Finalizaciones: ' + s.remates + (s.conversionRemate != null ? ' (conversión ' + s.conversionRemate + '%).' : '.'));
    if (th.recovery.n) parts.push('Tras pérdida, recuperó en ≤5s el ' + th.recovery.rate + '% de las veces (n=' + th.recovery.n + ').');
    if (th.pointBiserial.r != null) parts.push('Relación apoyos→recuperación (point-biserial): r=' + th.pointBiserial.r + ' con n=' + th.pointBiserial.n + ' (evidencia ' + (th.pointBiserial.n >= 20 ? 'media' : 'baja') + ' por tamaño muestral).');
    return parts.join(' ');
  }
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
    FASES, ETIQUETAS, TERCIOS, CARRILES, MARCADORES, PRESIONES, RESULTADOS, ROMPE, REACCIONES, EQUIPOS,
    SEQ_TIPOS, SEQ_RESULTADOS, STATUS_LABELS, PERIOD_LABELS, ZONAS, CSV_COLUMNS,
    pad2, formatMMSS, splitTime, computeElapsedSeconds, isClockRunning, clockStart, clockPause, clockResume,
    genSessionId, genEventId, genSeqId,
    zoneNum, zoneBand, zoneCol, tercioOfZone, carrilOfZone, zoneFromBandCol,
    orgOfFase, orgOfEtiqueta, faseSugerida, isActive, isGoal, computeScore, marcadorFromScore, marcadorAt,
    aggregateStats, avg, recoveryStats, pointBiserial, recoveryPairs, thesisAnalysis,
    sequenceDuration, sequenceStats, detectCriticalMoments,
    eventToRow, buildCSV, safeFileBase, generateExecutiveSummary, validateSession, isValidEmail
  };
});
