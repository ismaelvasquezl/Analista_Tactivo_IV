// Liga Primera División 2026 — informe de LIGA Hudl Wyscout (dato de evento real para los 16 equipos).
// Reemplaza a los proxies (datalabs 2025) como fuente de estilo/rendimiento. Fuente oficial del club.
// xptsD = xPoints - Puntos reales (POSITIVO = merece MÁS puntos de los que tiene = infrarrendimiento).
const LIGA_WY = {
  fuente: "Hudl Wyscout — Resumen Informe, Chile Primera División 2026 (tras 23 fechas)",
  actualizado: "2026-10-08",
  nota: "Dato de evento de liga: xG/xGA/xPoints reales de los 16 equipos + líderes individuales. Es el insumo que reemplaza los proxies.",
  ligaProm: { xg: 32.4, goles: 32.4 },
  teams: [
    { pos:1,  team:"Colo-Colo",               pts:54, pj:23, w:17, d:3, l:3,  gf:48, ga:22, gd:26,  xg:44.1, xga:23.3, xgdif:20.8, xpts:44.8, xptsD:-9.2 },
    { pos:2,  team:"Universidad Católica",     pts:42, pj:23, w:13, d:3, l:7,  gf:50, ga:33, gd:17,  xg:35.5, xga:26.4, xgdif:9.2,  xpts:36.6, xptsD:-5.4 },
    { pos:3,  team:"Universidad de Chile",     pts:42, pj:23, w:12, d:6, l:5,  gf:35, ga:19, gd:16,  xg:37.9, xga:25.1, xgdif:12.8, xpts:38.7, xptsD:-3.3 },
    { pos:4,  team:"Palestino",                pts:36, pj:23, w:11, d:3, l:9,  gf:36, ga:33, gd:3,   xg:38.0, xga:31.5, xgdif:6.5,  xpts:33.5, xptsD:-2.5 },
    { pos:5,  team:"Deportes Limache",         pts:33, pj:23, w:10, d:3, l:10, gf:43, ga:35, gd:8,   xg:36.9, xga:38.0, xgdif:-1.1, xpts:30.9, xptsD:-2.1 },
    { pos:6,  team:"Everton",                  pts:33, pj:23, w:9,  d:6, l:8,  gf:34, ga:26, gd:8,   xg:36.3, xga:32.3, xgdif:4.0,  xpts:33.6, xptsD:0.6 },
    { pos:7,  team:"Ñublense",                 pts:32, pj:23, w:8,  d:8, l:7,  gf:28, ga:31, gd:-3,  xg:31.1, xga:32.9, xgdif:-1.8, xpts:31.4, xptsD:-0.6 },
    { pos:8,  team:"D. Concepción",            pts:31, pj:23, w:9,  d:4, l:10, gf:25, ga:26, gd:-1,  xg:31.8, xga:27.9, xgdif:3.8,  xpts:33.0, xptsD:2.0 },
    { pos:9,  team:"Huachipato",               pts:31, pj:23, w:9,  d:4, l:10, gf:32, ga:39, gd:-7,  xg:31.4, xga:39.1, xgdif:-7.7, xpts:26.9, xptsD:-4.1 },
    { pos:10, team:"Deportes La Serena",       pts:30, pj:23, w:7,  d:9, l:7,  gf:34, ga:38, gd:-4,  xg:29.6, xga:38.1, xgdif:-8.5, xpts:26.6, xptsD:-3.4 },
    { pos:11, team:"Coquimbo Unido",           pts:29, pj:23, w:8,  d:5, l:10, gf:31, ga:32, gd:-1,  xg:35.8, xga:27.4, xgdif:8.4,  xpts:36.6, xptsD:7.6 },
    { pos:12, team:"Audax Italiano",           pts:28, pj:23, w:7,  d:7, l:9,  gf:26, ga:31, gd:-5,  xg:25.5, xga:30.6, xgdif:-5.0, xpts:28.0, xptsD:0.0 },
    { pos:13, team:"O'Higgins",                pts:27, pj:23, w:8,  d:3, l:12, gf:28, ga:36, gd:-8,  xg:33.2, xga:34.5, xgdif:-1.3, xpts:30.1, xptsD:3.1 },
    { pos:14, team:"Unión La Calera",          pts:23, pj:23, w:6,  d:5, l:12, gf:23, ga:35, gd:-12, xg:25.1, xga:32.3, xgdif:-7.2, xpts:27.9, xptsD:4.9 },
    { pos:15, team:"Universidad de Concepción",pts:22, pj:23, w:6,  d:4, l:13, gf:17, ga:39, gd:-22, xg:27.3, xga:45.4, xgdif:-18.1,xpts:22.6, xptsD:0.6 },
    { pos:16, team:"Cobresal",                 pts:21, pj:23, w:6,  d:3, l:14, gf:32, ga:47, gd:-15, xg:28.9, xga:43.8, xgdif:-14.9,xpts:23.3, xptsD:2.3 }
  ],
  leaders: {
    goleadores: [ // {n, team, goles, por90, xg}
      {n:"F. Zampedri", team:"Universidad Católica", g:24, p90:1.09, xg:14.99},
      {n:"D. Castro", team:"Deportes Limache", g:13, p90:0.55, xg:11.19},
      {n:"Javier Correa", team:"Colo-Colo", g:12, p90:1.09, xg:8.10},
      {n:"A. Medina", team:"Everton", g:11, p90:0.44, xg:10.38},
      {n:"Lionel Altamirano", team:"Huachipato", g:10, p90:0.51, xg:9.07},
      {n:"N. Da Silva", team:"Palestino", g:9, p90:0.60, xg:8.33},
      {n:"S. Sáez", team:"Unión La Calera", g:9, p90:0.46, xg:9.89},
      {n:"E. Vargas", team:"Universidad de Chile", g:9, p90:0.44, xg:9.05}
    ],
    jugadasClave: [ // {n, team, por90}
      {n:"M. Plaza", team:"Ñublense", p90:2.38},
      {n:"Kevin Méndez", team:"Unión La Calera", p90:2.29},
      {n:"Juan Cornejo", team:"Coquimbo Unido", p90:2.14},
      {n:"B. Carvallo", team:"Cobresal", p90:2.11},
      {n:"F. González", team:"O'Higgins", p90:2.08},
      {n:"Víctor Méndez", team:"Colo-Colo", p90:1.98},
      {n:"J. Vargas", team:"Deportes La Serena", p90:1.92},
      {n:"M. Morales", team:"Universidad de Chile", p90:1.84}
    ],
    toquesArea: [ // {n, team, por90}
      {n:"Javier Correa", team:"Colo-Colo", p90:6.63},
      {n:"N. Montiel", team:"Everton", p90:5.17},
      {n:"Nicolás Johansen", team:"Coquimbo Unido", p90:5.16},
      {n:"Maximiliano Romero", team:"Colo-Colo", p90:4.85},
      {n:"G. Graciani", team:"Ñublense", p90:4.65},
      {n:"C. Montes", team:"Universidad Católica", p90:4.48},
      {n:"C. Palacios", team:"Everton", p90:4.42},
      {n:"E. Vargas", team:"Universidad de Chile", p90:4.40}
    ],
    duelosDef: [ // {n, team, por90, pct}
      {n:"S. Díaz", team:"Deportes La Serena", p90:8.21, pct:70},
      {n:"R. Martínez", team:"Deportes Limache", p90:8.02, pct:64},
      {n:"Salvador Cordero", team:"Coquimbo Unido", p90:8.01, pct:58},
      {n:"F. Faúndez", team:"O'Higgins", p90:7.97, pct:59},
      {n:"Lucas Velásquez", team:"Huachipato", p90:7.93, pct:55},
      {n:"J. Valencia", team:"Universidad Católica", p90:7.81, pct:62}
    ]
  }
};

// Estilo por equipo (Hudl Wyscout liga 2026, págs. formaciones/fase ofensiva/duelos).
// form=formación principal(%) · cross90=centros/90 · box90=toques área/90 · of/def=duelos of/def ganados% · aer=aéreos ganados%
LIGA_WY.estilo = {
  "Colo-Colo":{form:"3-4-2-1",formPct:35.7,cross90:17.81,box90:20.44,of:37,def:65,aer:46},
  "Universidad Católica":{form:"4-2-3-1",formPct:39.4,cross90:16.36,box90:15.56,of:39,def:62,aer:52},
  "Universidad de Chile":{form:"4-2-3-1",formPct:19.9,cross90:17.11,box90:19.91,of:39,def:63,aer:47},
  "Palestino":{form:"4-3-3",formPct:28.9,cross90:16.53,box90:15.09,of:40,def:61,aer:50},
  "Deportes Limache":{form:"4-2-3-1",formPct:22.9,cross90:15.69,box90:15.88,of:38,def:62,aer:43},
  "Everton":{form:"4-4-1-1",formPct:34.4,cross90:16.11,box90:17.74,of:41,def:62,aer:42},
  "Ñublense":{form:"3-5-2",formPct:38.2,cross90:15.67,box90:16.40,of:35,def:61,aer:47},
  "D. Concepción":{form:"4-1-4-1",formPct:51.7,cross90:15.65,box90:14.70,of:40,def:62,aer:45},
  "Huachipato":{form:"3-4-1-2",formPct:19.6,cross90:13.58,box90:14.02,of:36,def:59,aer:47},
  "Deportes La Serena":{form:"4-2-3-1",formPct:32.2,cross90:9.45,box90:11.46,of:33,def:62,aer:48},
  "Coquimbo Unido":{form:"4-2-3-1",formPct:52.8,cross90:17.32,box90:18.12,of:35,def:64,aer:53,golBP:16,ranks:{cross:3,box:3,def:1,aer:4}},
  "Audax Italiano":{form:"3-5-2",formPct:18.4,cross90:12.93,box90:11.51,of:38,def:61,aer:45},
  "O'Higgins":{form:"4-2-3-1",formPct:57.3,cross90:18.28,box90:16.48,of:43,def:64,aer:47},
  "Unión La Calera":{form:"4-2-3-1",formPct:33.6,cross90:16.99,box90:14.51,of:36,def:64,aer:46},
  "Universidad de Concepción":{form:"4-1-4-1",formPct:21.1,cross90:14.55,box90:14.70,of:38,def:61,aer:46},
  "Cobresal":{form:"4-4-2",formPct:24.7,cross90:13.27,box90:14.52,of:38,def:59,aer:49}
};
