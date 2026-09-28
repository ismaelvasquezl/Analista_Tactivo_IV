// Copa Chile 2026 — fase de grupos. Fuente: CFDB league_standings("Copa Chile") — DATO oficial.
// Barrido: 2026-09-28. Freshness CFDB: último partido cargado 2026-09-27.
// NOTA CFDB: group_fixtures_remaining=0 significa que CFDB no tiene MÁS partidos de grupo cargados,
// NO que la fase esté matemáticamente cerrada. Los partidos jugados son desiguales (6 a 8 por equipo),
// así que los líderes de grupo son DATO, pero la clasificación definitiva se confirma con la próxima ronda.
const COPACHILE = {
  fuente: "CFDB league_standings (Copa Chile 2026)",
  actualizado: "2026-09-28",
  freshness: "2026-09-27",
  fase: "Fase de grupos (8 grupos × 4 equipos)",
  nota: "Líderes de cada grupo = DATO. 'Clasificado' es provisional: CFDB no confirma cierre de fase (partidos jugados desiguales). Coquimbo Unido lidera el Grupo A invicto (4-3-0).",
  coquimboId: 244,
  groups: {
    "Grupo A": [
      {pos:1, team:"Coquimbo Unido", id:244, pj:7, w:4, d:3, l:0, gf:10, ga:4,  gd:6,  pts:15, st:"W1"},
      {pos:2, team:"Deportes Iquique", id:288, pj:8, w:3, d:3, l:2, gf:14, ga:11, gd:3,  pts:12, st:"L1"},
      {pos:3, team:"Deportes Limache", id:321, pj:6, w:2, d:2, l:2, gf:11, ga:11, gd:0,  pts:8,  st:"L1"},
      {pos:4, team:"San Marcos de Arica", id:205, pj:6, w:0, d:1, l:5, gf:2,  ga:13, gd:-11, pts:1, st:"L4"}
    ],
    "Grupo B": [
      {pos:1, team:"Universidad Católica", id:245, pj:8, w:5, d:2, l:1, gf:15, ga:10, gd:5,  pts:17, st:"D2"},
      {pos:2, team:"Everton", id:320, pj:8, w:2, d:3, l:3, gf:11, ga:11, gd:0,  pts:9,  st:"D1"},
      {pos:3, team:"San Luis de Quillota", id:8, pj:6, w:1, d:3, l:2, gf:11, ga:10, gd:1,  pts:6,  st:"W1"},
      {pos:4, team:"Deportes Copiapó", id:248, pj:6, w:1, d:1, l:4, gf:3,  ga:10, gd:-7, pts:4, st:"L4"}
    ],
    "Grupo C": [
      {pos:1, team:"Deportes Antofagasta", id:2, pj:8, w:6, d:2, l:0, gf:17, ga:7,  gd:10, pts:20, st:"W1"},
      {pos:2, team:"Cobreloa", id:299, pj:7, w:2, d:2, l:3, gf:8,  ga:8,  gd:0,  pts:8,  st:"L1"},
      {pos:3, team:"Deportes La Serena", id:257, pj:6, w:2, d:1, l:3, gf:7,  ga:10, gd:-3, pts:7, st:"L1"},
      {pos:4, team:"Cobresal", id:271, pj:6, w:0, d:2, l:4, gf:2,  ga:7,  gd:-5, pts:2, st:"W1"}
    ],
    "Grupo D": [
      {pos:1, team:"Universidad de Chile", id:210, pj:8, w:5, d:2, l:1, gf:15, ga:8,  gd:7,  pts:17, st:"D1"},
      {pos:2, team:"Unión La Calera", id:312, pj:8, w:3, d:4, l:1, gf:14, ga:7,  gd:7,  pts:13, st:"D2"},
      {pos:3, team:"Unión San Felipe", id:4, pj:6, w:2, d:1, l:3, gf:6,  ga:8,  gd:-2, pts:7, st:"L1"},
      {pos:4, team:"Santiago Wanderers", id:3, pj:6, w:1, d:0, l:5, gf:7,  ga:18, gd:-11, pts:3, st:"L4"}
    ],
    "Grupo E": [
      {pos:1, team:"Colo-Colo", id:278, pj:8, w:5, d:2, l:1, gf:16, ga:8,  gd:8,  pts:17, st:"W1"},
      {pos:2, team:"O'Higgins", id:297, pj:8, w:5, d:2, l:1, gf:18, ga:10, gd:8,  pts:17, st:"W2"},
      {pos:3, team:"Recoleta", id:6, pj:6, w:1, d:2, l:3, gf:6,  ga:11, gd:-5, pts:5, st:"L1"},
      {pos:4, team:"Unión Española", id:301, pj:6, w:1, d:1, l:4, gf:4,  ga:11, gd:-7, pts:4, st:"L3"}
    ],
    "Grupo F": [
      {pos:1, team:"Ñublense", id:309, pj:8, w:5, d:1, l:2, gf:11, ga:8,  gd:3,  pts:16, st:"W1"},
      {pos:2, team:"Curicó Unido", id:12, pj:8, w:3, d:2, l:3, gf:10, ga:13, gd:-3, pts:11, st:"L2"},
      {pos:3, team:"Rangers", id:7, pj:6, w:2, d:0, l:4, gf:4,  ga:7,  gd:-3, pts:6,  st:"L3"},
      {pos:4, team:"Universidad de Concepción", id:310, pj:6, w:1, d:1, l:4, gf:8, ga:12, gd:-4, pts:4, st:"L2"}
    ],
    "Grupo G": [
      {pos:1, team:"Deportes Santa Cruz", id:5, pj:8, w:4, d:1, l:3, gf:13, ga:11, gd:2,  pts:13, st:"L3"},
      {pos:2, team:"Audax Italiano", id:279, pj:8, w:4, d:1, l:3, gf:9,  ga:8,  gd:1,  pts:13, st:"L1"},
      {pos:3, team:"Palestino", id:290, pj:6, w:3, d:1, l:2, gf:12, ga:9,  gd:3,  pts:10, st:"L1"},
      {pos:4, team:"Magallanes", id:11, pj:6, w:0, d:0, l:6, gf:5,  ga:15, gd:-10, pts:0, st:"L5"}
    ],
    "Grupo H": [
      {pos:1, team:"Concepcion", id:316, pj:8, w:6, d:1, l:1, gf:16, ga:6,  gd:10, pts:19, st:"W2"},
      {pos:2, team:"Puerto Montt", id:13, pj:8, w:4, d:1, l:3, gf:11, ga:8,  gd:3,  pts:13, st:"L1"},
      {pos:3, team:"Huachipato", id:319, pj:6, w:2, d:0, l:4, gf:7,  ga:9,  gd:-2, pts:6, st:"D1"},
      {pos:4, team:"Deportes Temuco", id:10, pj:6, w:1, d:2, l:3, gf:4,  ga:8,  gd:-4, pts:5, st:"L3"}
    ]
  }
};
