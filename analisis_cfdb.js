// Generado por analisis_cfdb.py — fuentes CFDB + FBref. NO editar a mano.
const ANALISIS = {
 "actualizado": "2026-09-16",
 "fuentes": "CFDB (totales, historico, contexto liga) + FBref (detalle partido-a-partido). Etiquetas: DATO/INFERENCIA/HIPOTESIS.",
 "totales_cfdb": {
  "pos": 10,
  "pj": 22,
  "w": 8,
  "d": 5,
  "l": 9,
  "gf": 31,
  "ga": 31,
  "gd": 0,
  "pts": 29,
  "fuente": "CFDB team_standing"
 },
 "totales_detalle": {
  "pj": 22,
  "w": 8,
  "d": 5,
  "l": 9,
  "gf": 30,
  "ga": 30,
  "gd": 0,
  "pts": 29,
  "ppg": 1.318,
  "gf_pg": 1.36,
  "ga_pg": 1.36
 },
 "split": {
  "local": {
   "pj": 10,
   "w": 4,
   "d": 3,
   "l": 3,
   "gf": 12,
   "ga": 8,
   "gd": 4,
   "pts": 15,
   "ppg": 1.5,
   "gf_pg": 1.2,
   "ga_pg": 0.8
  },
  "visita": {
   "pj": 12,
   "w": 4,
   "d": 2,
   "l": 6,
   "gf": 18,
   "ga": 22,
   "gd": -4,
   "pts": 14,
   "ppg": 1.167,
   "gf_pg": 1.5,
   "ga_pg": 1.83
  }
 },
 "reconciliacion": {
  "fbref": {
   "pj": 22,
   "record": "8-5-9",
   "gf": 30,
   "ga": 30,
   "pts": 29
  },
  "cfdb": {
   "pj": 22,
   "record": "8-5-9",
   "gf": 31,
   "ga": 31,
   "pts": 29
  },
  "veredicto": "Coinciden exactamente en PJ (22), record (8-5-9), puntos (29) y posicion (10). Los goles difieren en +1 GF y +1 GC (CFDB 31-31 vs detalle 30-30): diferencia neutra en GD (0 en ambos) y sin efecto en tabla. Probable discrepancia de 1 gol en un marcador entre feeds. Se adoptan los totales CFDB como DATO oficial; el detalle FBref se mantiene para el analisis partido-a-partido."
 },
 "regresion": {
  "titulo": "De campeon invicto-casi a media tabla",
  "y2025": {
   "pos": 1,
   "pj": 30,
   "w": 23,
   "d": 6,
   "l": 1,
   "gf": 49,
   "ga": 17,
   "gd": 32,
   "pts": 75,
   "fuente": "CFDB historical_standings 2025 (CAMPEON)"
  },
  "y2026": {
   "pos": 10,
   "pj": 22,
   "w": 8,
   "d": 5,
   "l": 9,
   "gf": 31,
   "ga": 31,
   "gd": 0,
   "pts": 29,
   "fuente": "CFDB team_standing"
  },
  "proyeccion_30": {
   "pts": 39.5,
   "gf": 42.3,
   "ga": 42.3
  },
  "lectura": "Campeon 2025 con 75 pts y la mejor defensa de la liga (17 GC en 30 = 0.57/PJ). En 2026 concede 1.41/PJ (ritmo 42.3 en 30), mas del doble. El ataque se sostiene mejor (1.63 -> 1.41 GF/PJ). El colapso es DEFENSIVO."
 },
 "tendencia": {
  "fecha": [
   "F 1",
   "F 2",
   "F 3",
   "F 4",
   "F 5",
   "F 6",
   "F 7",
   "F 8",
   "F 10",
   "F 11",
   "F 9",
   "F 12",
   "F 13",
   "F 14",
   "F 15",
   "F 17",
   "F 18",
   "F 20",
   "F 21",
   "F 16",
   "F 22",
   "F 23"
  ],
  "etiqueta": [
   "@Vis U Concepción",
   "vLoc Palestino",
   "@Vis La Serena",
   "@Vis U. Católica",
   "vLoc D. Concepción",
   "@Vis Huachipato",
   "vLoc Univ. de Chile",
   "vLoc Cobresal",
   "vLoc Ñublense",
   "@Vis Unión La Calera",
   "@Vis Colo-Colo",
   "vLoc Audax Italiano",
   "@Vis Everton",
   "@Vis CD Limache",
   "vLoc O'Higgins",
   "@Vis Palestino",
   "vLoc La Serena",
   "@Vis D. Concepción",
   "vLoc Huachipato",
   "vLoc U. de Concepción",
   "@Vis Universidad de Chile",
   "@Vis Cobresal"
  ],
  "gf": [
   0,
   3,
   1,
   1,
   0,
   3,
   0,
   3,
   1,
   2,
   1,
   3,
   1,
   3,
   0,
   1,
   1,
   1,
   0,
   1,
   2,
   2
  ],
  "ga": [
   1,
   1,
   0,
   3,
   1,
   1,
   1,
   2,
   1,
   1,
   3,
   0,
   1,
   2,
   0,
   2,
   1,
   1,
   1,
   0,
   4,
   3
  ],
  "gf_ma5": [
   0,
   1.5,
   1.33,
   1.25,
   1,
   1.6,
   1,
   1.4,
   1.4,
   1.8,
   1.4,
   2,
   1.6,
   2,
   1.6,
   1.6,
   1.2,
   1.2,
   0.6,
   0.8,
   1,
   1.2
  ],
  "ga_ma5": [
   1,
   1,
   0.67,
   1.25,
   1.2,
   1.2,
   1.2,
   1.6,
   1.2,
   1.2,
   1.6,
   1.4,
   1.2,
   1.4,
   1.2,
   1,
   1.2,
   1.2,
   1,
   1,
   1.4,
   1.8
  ],
  "ppg_ma5": [
   0,
   1.5,
   2,
   1.5,
   1.2,
   1.8,
   1.2,
   1.2,
   1.4,
   2,
   1.4,
   2,
   1.6,
   2,
   1.6,
   1.6,
   1.2,
   1.2,
   0.6,
   1,
   1,
   0.8
  ],
  "ult5_pts": 4,
  "ult5_gf": 6,
  "ult5_ga": 9
 },
 "trend_reg": {
  "ga_slope": 0.037,
  "gf_slope": -0.002,
  "lectura": "Pendiente GC por fecha = +0.037 (GC en alza); pendiente GF = -0.002. n=22, tendencia indicativa no causal."
 },
 "proyeccion": {
  "metodo": "Bootstrap Monte Carlo (20.000 sim); remuestreo de resultados reales local/visita",
  "base_pts": 29,
  "rem_local": 5,
  "rem_visita": 3,
  "home_ppg": 1.5,
  "away_ppg": 1.167,
  "media": 40.0,
  "p10": 35,
  "p50": 40,
  "p90": 45,
  "lectura": "Proyeccion fin de temporada ~40 pts (IC80% 35-45). Zona de media tabla: sin lucha por titulo ni riesgo real de descenso con este ritmo. Muestra n=22, proyeccion sensible al calendario restante."
 },
 "poisson": {
  "local": {
   "gf": 1.2,
   "ga": 0.8,
   "pW": 0.454,
   "pD": 0.3,
   "pL": 0.246
  },
  "visita": {
   "gf": 1.5,
   "ga": 1.83,
   "pW": 0.317,
   "pD": 0.226,
   "pL": 0.457
  },
  "validacion": {
   "local": {
    "n": 10,
    "acierto": 0.4,
    "logloss": 1.186
   },
   "visita": {
    "n": 12,
    "acierto": 0.5,
    "logloss": 1.084
   },
   "nota": "Validacion leave-one-out (cada partido predicho con las tasas de los otros). Acierto de clase modesto (empate es la clase dificil); el valor esta en la probabilidad, no en el marcador exacto. n bajo: usar como guia, no certeza."
  },
  "lectura": "En casa el modelo favorece a Coquimbo (pW~45%) con 1.2 GF y solo 0.8 GC esperados. De visita se invierte: mas probable no ganar (pL~46%) por 1.8 GC esperados. El plan debe ser distinto segun localia."
 },
 "liga": {
  "posesion": {
   "coquimbo": 49.5,
   "rank": 7,
   "de": 10,
   "fuente": "CFDB team_stat_leaders",
   "lectura": "Posesion de media tabla (49,5%, 7º). No es un equipo de dominio del balon; su identidad es mas reactiva/vertical."
  },
  "goleadores": {
   "top_liga": [
    [
     "Zampedri (UC)",
     25
    ],
    [
     "D. Castro (Limache)",
     13
    ],
    [
     "M. Correa (Colo-Colo)",
     12
    ]
   ],
   "coquimbo_en_top10": false,
   "lectura": "Ningun jugador de Coquimbo entre los 10 maximos goleadores: el gol esta repartido, sin un '9' de referencia que garantice cifras. Riesgo de sequia en partidos cerrados."
  },
  "h2h_la_serena": {
   "historico": "Coquimbo 35-33-22 (90 clasicos)",
   "ult": "1-1 (08-ago-26)",
   "fuente": "CFDB team_h2h",
   "lectura": "Clasico regional parejo; el ultimo, empate en casa."
  }
 },
 "historia": {
  "fuente": "CFDB historical_standings (tablas finales de Primera). 2020 sin dato; 2021 fuera de Primera.",
  "filas": [
   {
    "season": "2019",
    "pos": 5,
    "pj": 24,
    "pts": 34,
    "gf": 29,
    "ga": 27,
    "gapg": 1.12,
    "gfpg": 1.21,
    "ppg": 1.42
   },
   {
    "season": "2020",
    "pos": null,
    "nota": "sin registro en CFDB para Primera"
   },
   {
    "season": "2021",
    "pos": null,
    "nota": "no figura en la tabla de Primera (categoría de ascenso)"
   },
   {
    "season": "2022",
    "pos": 14,
    "pj": 30,
    "pts": 27,
    "gf": 32,
    "ga": 52,
    "gapg": 1.73,
    "gfpg": 1.07,
    "ppg": 0.9
   },
   {
    "season": "2023",
    "pos": 5,
    "pj": 30,
    "pts": 47,
    "gf": 43,
    "ga": 42,
    "gapg": 1.4,
    "gfpg": 1.43,
    "ppg": 1.57
   },
   {
    "season": "2024",
    "pos": 8,
    "pj": 30,
    "pts": 45,
    "gf": 37,
    "ga": 34,
    "gapg": 1.13,
    "gfpg": 1.23,
    "ppg": 1.5
   },
   {
    "season": "2025",
    "pos": 1,
    "pj": 30,
    "pts": 75,
    "gf": 49,
    "ga": 17,
    "gapg": 0.57,
    "gfpg": 1.63,
    "ppg": 2.5
   },
   {
    "season": "2026",
    "pos": 10,
    "pj": 22,
    "pts": 29,
    "gf": 31,
    "ga": 31,
    "encurso": true,
    "gapg": 1.41,
    "gfpg": 1.41,
    "ppg": 1.32
   }
  ],
  "lectura": "Trayectoria en Primera: 5º (2019) → descenso/ascenso → 14º al volver (2022) → 5º (2023) → 8º (2024) → CAMPEÓN (2025) → 10º (2026, en curso). El título fue un pico sostenido sobre una base de media tabla; la caída de 2026 es una regresión a la media agravada por el desplome defensivo (GC/PJ: 0,57 campeón → 1,41 hoy)."
 },
 "insights": [
  {
   "prioridad": 1,
   "area": "Defensa de visita",
   "evidencia": "22 GC en 12 de visita = 1.83/PJ (vs 0.8 en casa)",
   "interpretacion": "El desplome respecto a 2025 es casi todo fuera de casa: la estructura defensiva no aguanta lejos del Sanchez Rumoroso.",
   "accion": "Plan de visita conservador: bloque medio-bajo, no exponer a los laterales, priorizar no encajar primero. Revisar transiciones defensivas (goles tardios: ver U. de Chile 82'-90')."
  },
  {
   "prioridad": 2,
   "area": "Cierre de partidos",
   "evidencia": "vs U. de Chile ganaba 1-2 al 82' y perdio 4-2; patron de goles encajados en tramos finales",
   "interpretacion": "Perdida de solidez y/o piernas en los ultimos 15'. Gestion de resultado deficiente.",
   "accion": "Rutina de cierre: cambios defensivos preventivos desde el 75' cuando se va ganando/empatando de visita; trabajo de balon parado defensivo y perdida de tiempo legitima."
  },
  {
   "prioridad": 3,
   "area": "Dependencia de localia",
   "evidencia": "Local 4-3-3 (1.5 ppg) vs Visita 4-2-6 (1.167 ppg)",
   "interpretacion": "El equipo es competitivo en casa y fragil fuera. Sumar de visita es la palanca de la temporada.",
   "accion": "Objetivo realista: convertir 2-3 de las 3 visitas restantes en al menos empates. En casa (5 restantes) exigir >=10 pts."
  },
  {
   "prioridad": 4,
   "area": "Falta de un referente de gol",
   "evidencia": "0 jugadores en el top-10 de goleadores de la liga",
   "interpretacion": "El gol repartido da flexibilidad pero castiga en partidos trabados.",
   "accion": "Potenciar llegada de segunda linea y balon parado ofensivo como via de gol fiable; definir rematadores fijos en corners."
  }
 ]
};
