/* =========================================================================
   CENTRO DE ANÁLISIS · COQUIMBO UNIDO — CONTENIDO EDITABLE
   -------------------------------------------------------------------------
   Este archivo es el que ACTUALIZAS a medida que avanzamos.
   - Para añadir un rival/pre-partido nuevo: copia un objeto dentro de
     REPORTES.rivales[] siguiendo el modelo de "Deportes Concepción".
   - Para dejar constancia de avances: añade una línea en REPORTES.bitacora[].
   - Los números de Coquimbo (defensa/intensidad) salen del dato real 2026
     ya validado; si cambian, edítalos aquí en un solo lugar.
   Estados válidos: "DATO" | "REQUIERE_VERIFICACION" | "HIPOTESIS"
   ========================================================================= */
const REPORTES = {
  actualizado: "2026-08-21",

  // ---- Perfil interpretativo de Coquimbo (2026) ----
  coquimbo: {
    titular: "Campeón vigente 2025 · reactivo, intenso y de ataque lateral",
    perfil: [
      "Equipo REACTIVO, no dominador: posesión ~49% y correlación posesión→goles negativa. Rinde mejor sin la obligación de tener el balón (último caso: empató 1-1 en Concepción con solo 38% de balón).",
      "Ataque muy LATERAL: 24,2 centros/partido (rango 11–47). Es su sello y su límite: si le cierran las bandas, se vuelve previsible.",
      "Defensa permeable para un campeón (1,22 GC/PJ) y muy expuesta: concede 10,8 tiros/PJ; corr(tiros concedidos→goles)=+0,71.",
      "Indisciplina severa y doméstica: 8 rojas en 18 de Liga (0 en Libertadores)."
    ],
    defensa: [   // {k, v, nota}  — Liga 2026, 18 PJ
      { k: "Goles en contra", v: "1,22 /PJ", nota: "Permeable" },
      { k: "Tiros concedidos", v: "10,8 /PJ (SoT 3,6)", nota: "Concede volumen" },
      { k: "Atajadas · Save%", v: "2,4 /PJ · 67%", nota: "Arco exigido" },
      { k: "Clean sheets", v: "3/18 (17%)", nota: "Poca portería a cero" },
      { k: "Entradas+intercepciones", v: "≈20,8 /PJ", nota: "Recuperación activa" }
    ],
    intensidad: [
      { k: "Centros", v: "24,2 /PJ (11–47)", nota: "Frecuencia de ataque lateral, muy alta" },
      { k: "Faltas", v: "11,8 /PJ (7–18)", nota: "Intensidad de duelo media-alta" },
      { k: "Tarjetas", v: "55A · 8R", nota: "Intensidad que se le va de las manos" },
      { k: "Posesión", v: "49,2%", nota: "Reactivo" }
    ],
    jugadores: [ // {n, rol, aporte, nota, tag}
      { n: "Nicolás Johansen", rol: "Delantero", aporte: "6 goles", nota: "Máximo goleador (26% del total); de él depende el gol", tag: "clave" },
      { n: "Cristián Zavala", rol: "Mediocampista", aporte: "2G · 3A", nota: "El más determinante por 90' (0,67 G+A/90)", tag: "forma" },
      { n: "Juan Cornejo", rol: "Lateral izq.", aporte: "6 asistencias", nota: "Máximo creador desde banda y balón parado", tag: "clave" },
      { n: "Guido Vadalá / A. Camargo", rol: "Medias puntas", aporte: "3G c/u", nota: "Segunda línea de llegada", tag: "" },
      { n: "Diego Sánchez", rol: "Arquero (39a)", aporte: "2,4 atajadas/PJ", nota: "Sostiene; Save% carrera 69,5%", tag: "" },
      { n: "M. Fernández / Gazzolo", rol: "Centrales", aporte: "Ejes titulares", nota: "Propensos a expulsión (Fernández 2R en 2026)", tag: "alerta" }
    ]
  },

  // ---- Rivales / pre-partidos (AÑADIR AQUÍ nuevos objetos) ----
  rivales: [
    {
      nombre: "Universidad de Concepción",
      tipo: "PRÓXIMO · 2 SEP (Local)",
      ficha: [
        { k: "Apodo / ciudad", v: "El Campanil · Concepción, Biobío", estado: "DATO" },
        { k: "Liga 2026", v: "20 PJ · 6-4-10 · 22 pts · DG −18 (zona de descenso)", estado: "DATO" },
        { k: "Perfil", v: "Ataque muy pobre (0,80 GF/PJ) y defensa frágil (1,70 GC/PJ). Posesión ~49%", estado: "DATO" },
        { k: "Clave del cruce", v: "DE VISITANTE es un colador: 1-3-6, 2,40 goles en contra/PJ (mañana juega de visita en Coquimbo)", estado: "DATO" },
        { k: "Formaciones", v: "4-1-4-1 / 3-4-3 / 4-4-2 (flexible)", estado: "DATO" },
        { k: "Forma últimos 5", v: "L-L-L-L-W (8 goles encajados en 5)", estado: "DATO" },
        { k: "Disciplina", v: "Muy físico e indisciplinado: 117 amarillas y 9 rojas en la temporada", estado: "DATO" },
        { k: "Sede / público", v: "Coquimbo (Sánchez Rumoroso) — posible 'sin público' por la sanción del caso Huachipato", estado: "REQUIERE_VERIFICACION" }
      ],
      jugadores: [
        { n: "Cecilio Waterman", rol: "Delantero", aporte: "4 goles", nota: "La referencia: 44 tiros, 54% al arco. Casi todo el peligro pasa por él", tag: "alerta" },
        { n: "Jeison Fuentealba", rol: "MF/FW", aporte: "3G", nota: "Segundo artillero, llega desde el medio", tag: "" },
        { n: "Agustín Urzi", rol: "MF/FW", aporte: "1G · 3A", nota: "El principal creador del equipo", tag: "clave" },
        { n: "Facundo Mater", rol: "Mediocampista", aporte: "Motor de corte", nota: "22 int + 25 entradas ganadas: su recuperador clave", tag: "" },
        { n: "C. Mesías / J. Espejo", rol: "MF / carrilero", aporte: "Duelo y centros", nota: "Mesías 27 faltas (foul-heavy); Espejo 53 centros por banda", tag: "" }
      ],
      h2h: [
        { fecha: "2026-01-31", comp: "Liga (MW1)", sede: "Visita", res: "L", gc: "0-1",
          detalle: "1ª fecha: Coquimbo cayó, superado 13-8 en tiros y con 1 solo remate al arco (50% posesión)." }
      ],
      resumenH2H: "1 partido 2026: 0V-0E-1D, 0-1 (arranque flojo del aurinegro). El regreso es en Coquimbo, donde el rival rinde mucho peor que de local.",
      lecturaH2H: "Rival en crisis y en descenso: marca poquísimo y de visitante concede 2,40/PJ. Es una oportunidad clara para Coquimbo de local. El riesgo NO es el rival, son dos factores propios: (1) la 'trampa del dominio' — ya empató/perdió partidos teniendo el balón sin convertir (66% vs D. Concepción, 64% vs Huachipato, sin gol); (2) la posible sanción de jugar SIN público. Si Coquimbo ataca con criterio (no solo centros) y mantiene disciplina, debería ganar.",
      prediccion: [
        { esc: "Victoria Coquimbo", p: "~55%" },
        { esc: "Empate", p: "~25%" },
        { esc: "Victoria U. de Concepción", p: "~20%" },
        { esc: "Over 2.5 goles", p: "~48%" },
        { esc: "Ambos marcan", p: "~45%" }
      ],
      marcador: "2-0 o 1-0 Coquimbo (favorito claro)",
      confianza: "MEDIA-ALTA (dato real de ambos; ajustar si es sin público)",
      claves: [
        "Evitar la 'trampa del dominio': atacar el intervalo y por dentro, no solo centrar. Contra un rival que se cierra, la previsibilidad por banda ya costó puntos.",
        "Presionar su salida: marca poquísimo y comete muchas pérdidas; recuperar alto y golpear rápido explota su fragilidad visitante (2,40 GC/PJ).",
        "Anular a Waterman (su única vía real) y sostener la disciplina: ellos provocan y cometen muchas faltas (117 amarillas)."
      ],
      pendientes: ["Confirmar condición de público (sanción ANFP) y parte de lesiones/suspensiones"],
      charts: {
        radar: {
          labels: ["Ataque (GF/PJ)","Solidez (inv. GC)","Posesión","Over 2.5%","Ambos marcan%","Vallas invictas%"],
          coq: [54, 39, 49, 50, 67, 17],
          riv: [31, 15, 50, 50, 45, 25]
        },
        shooters: [
          { n:"Waterman", sh:44, gsh:0.09, g:4 },
          { n:"Fuentealba", sh:28, gsh:0.11, g:3 },
          { n:"Mater", sh:29, gsh:0.00, g:0 },
          { n:"Urzi", sh:23, gsh:0.04, g:1 },
          { n:"Mesías", sh:20, gsh:0.05, g:1 }
        ],
        defensores: [
          { n:"F. Mater", int:22, tklw:25 },
          { n:"O. González", int:21, tklw:14 },
          { n:"C. Mesías", int:11, tklw:24 },
          { n:"B. Ogaz", int:12, tklw:21 },
          { n:"L. González", int:23, tklw:8 }
        ],
        homeAway: { gf:[0.80,0.80], gc:[1.00,2.40], rec:["5-1-4","1-3-6"] },
        form5_riv: [0,0,0,0,3]
      }
    },
    {
      nombre: "Universidad Católica",
      tipo: "PRE-PARTIDO · 26 AGO",
      ficha: [
        { k: "Ciudad / Región", v: "Las Condes, Santiago (RM) · DT Daniel Garnero · capitán Zampedri", estado: "DATO" },
        { k: "Liga 2026 (al MW20)", v: "20 PJ · 9-3-8 · 30 pts · GF 42 / GC 30", estado: "DATO" },
        { k: "Perfil", v: "Ofensivo y de posesión (~55%): 2,10 GF/PJ pero 1,50 GC/PJ", estado: "DATO" },
        { k: "Formaciones", v: "4-2-3-1 / 4-1-4-1 / 4-3-3 (flexible)", estado: "DATO" },
        { k: "Forma reciente", v: "En caída: perdió 4 de sus últimos 6; venía de L-W-D-L-L y sumó otra derrota", estado: "DATO" },
        { k: "Último (MW20)", v: "PERDIÓ 1-2 vs Ñublense EN CASA (42% posesión, 1 de 10 al arco, único gol de penal)", estado: "DATO" }
      ],
      ultimoRival: "22-ago, San Carlos: U. Católica 1-2 Ñublense. El equipo de posesión fue dominado en su casa (42% de balón, superado 14-10 en tiros y 7-1 en tiros al arco). Su único gol fue un penal de Zampedri (75'); de juego abierto no marcó. Ñublense (3-5-2) le ganó el balón, atacó por fuera (21 centros) y lo liquidó en el 88'. Es el 'cómo' para hacerle daño.",
      jugadores: [
        { n: "Fernando Zampedri", rol: "Delantero", aporte: "23 goles", nota: "Letal: 50% SoT y 0,31 g/tiro. LA amenaza; reducirle servicios.", tag: "alerta" },
        { n: "Justo Giani", rol: "MF/FW", aporte: "9G · 5A", nota: "Mucho volumen (83 tiros) pero baja eficiencia (0,11 g/tiro)", tag: "" },
        { n: "Clemente Montes", rol: "Mediocampista", aporte: "5G · 6A", nota: "Máximo creador junto a Palavecino", tag: "clave" },
        { n: "M. Palavecino / C. Cuevas", rol: "Mediocampistas", aporte: "6A y 5A", nota: "Cuevas además centra muchísimo (101 centros)", tag: "" },
        { n: "Jhojan Valencia / Gary Medel", rol: "Mediocentros", aporte: "Corte y duelo", nota: "Valencia 34 Int/44 TklW (y 48 faltas); Medel jerarquía", tag: "" }
      ],
      h2h: [
        { fecha: "2026-02-21", comp: "Liga", sede: "Visita", res: "L", gc: "1-3",
          detalle: "En San Carlos; UCA 59% posesión. Coquimbo cayó ante el rival más goleador." }
      ],
      resumenH2H: "1 partido (dato): 0V-0E-1D, 1-3 en contra. Muestra mínima; el regreso sería en Coquimbo (a confirmar sede).",
      lecturaH2H: "En febrero UCA ganó 3-1 con su versión buena. Pero llega en CRISIS: acaba de perder 1-2 en casa con Ñublense, dominado y con su ataque apagado (1 tiro al arco de 10; solo marcó de penal). El manual quedó a la vista: negarle el balón y atacar sus transiciones lo desarma. Coquimbo, reactivo por naturaleza, encaja con ese plan mejor que nadie — y juega en casa.",
      prediccion: [
        { esc: "Victoria Coquimbo", p: "~44%" },
        { esc: "Empate", p: "~28%" },
        { esc: "Victoria U. Católica", p: "~28%" },
        { esc: "Over 2.5 goles", p: "~58%" },
        { esc: "Ambos marcan", p: "~60%" }
      ],
      marcador: "1-1 o 2-1 Coquimbo (rival en horas bajas)",
      confianza: "MEDIA-ALTA (dato real de ambos + forma reciente del rival)",
      claves: [
        "Negarle el balón y golpear en transición: Ñublense le ganó la posesión (58-42) y lo mató a la contra. Es la vía, y es el ADN de Coquimbo.",
        "Contener a Zampedri: sin penal, UCA casi no crea (1 tiro al arco de 10). Marca de referencia y cortar el servicio = ataque rival neutralizado.",
        "Disciplina y balón parado: no regalar penales (su único gol reciente fue de penal) ni superioridades; Coquimbo llega con 8 rojas en Liga."
      ],
      pendientes: ["Sede y parte de lesiones/suspensiones del 26-ago (confirmar en fuente oficial)"],
      // Datos para gráficos futboleros (índices 0-100 donde aplica)
      charts: {
        radar: {
          labels: ["Ataque (GF/PJ)","Solidez (inv. GC)","Posesión","Over 2.5%","Ambos marcan%","Vallas invictas%"],
          coq: [54, 39, 49, 50, 67, 17],
          riv: [81, 25, 55, 74, 63, 20]
        },
        shooters: [ // x=tiros, y=g/tiro, r~goles
          { n:"Zampedri", sh:74, gsh:0.31, g:23 },
          { n:"Giani", sh:83, gsh:0.11, g:9 },
          { n:"Montes", sh:38, gsh:0.13, g:5 },
          { n:"Palavecino", sh:34, gsh:0.06, g:2 },
          { n:"Martínez", sh:23, gsh:0.09, g:2 }
        ],
        defensores: [ // Int + TklW por jugador (temporada)
          { n:"J. Valencia", int:34, tklw:44 },
          { n:"J.I. Díaz", int:40, tklw:22 },
          { n:"C. Cuevas", int:26, tklw:33 },
          { n:"S. Arancibia", int:8, tklw:20 },
          { n:"D. González", int:15, tklw:20 }
        ],
        form5_riv: [3,1,0,0,0] // W-D-L-L-L: la última derrota (1-2 vs Ñublense) confirma la caída
      }
    },
    {
      nombre: "Deportes Concepción",
      tipo: "H2H · JUGADO 23-AGO",
      ficha: [
        { k: "Ciudad / Región", v: "Concepción, Biobío", estado: "DATO" },
        { k: "Apodo / colores", v: "El León de Collao · lila y blanco", estado: "DATO" },
        { k: "Estadio", v: "Ester Roa Rebolledo (Collao)", estado: "DATO" },
        { k: "Liga 2026 (al MW20)", v: "8-3-9 · DT Fernando Díaz · capitán Mario Sandoval", estado: "DATO" },
        { k: "Sistema usado vs Coquimbo", v: "4-4-2", estado: "DATO" }
      ],
      h2h: [ // enfrentamientos con dato real (2 en 2026)
        { fecha: "2026-02-28", comp: "Liga (MW5)", sede: "Local", res: "L", gc: "0-1",
          detalle: "66% posesión, 17-8 en tiros, 36 centros, 1 roja: dominó y perdió." },
        { fecha: "2026-08-23", comp: "Liga (MW20)", sede: "Visita", res: "D", gc: "1-1",
          detalle: "Se adelantó (Camargo 7'), cedió el empate (Cáceres 62'). Solo 38% posesión y 5 tiros; 5 amarillas defendiendo la ventaja." }
      ],
      resumenH2H: "2 partidos 2026: 0V-1E-1D · goles 1-2. Coquimbo todavía sin ganarle: perdió dominando y empató cediendo el balón.",
      lecturaH2H: "Rival espejo del problema aurinegro. En febrero tuvo el balón (66%) y cayó; en agosto renunció al balón (38%), pegó primero y aguantó a base de faltas (17) e intercepciones (13) para rescatar el 1-1. Dos formas de no ganarle: cuando propone se expone, y cuando aguanta se le escapa el punto tarde.",
      prediccion: [ // histórico (partidos ya jugados)
        { esc: "Partidos 2026", p: "2" },
        { esc: "Coquimbo V-E-D", p: "0-1-1" },
        { esc: "Goles (Coq–DCo)", p: "1–2" },
        { esc: "Patrón repetido", p: "Coquimbo no domina y sobrevive" }
      ],
      marcador: "Resultados reales: 0-1 (feb) y 1-1 (ago)",
      confianza: "HISTÓRICO · 2 partidos reales (no es pronóstico)",
      claves: [
        "Contra su 4-4-2, atacar el intervalo entre línea y volante en vez de sólo centrar (36 centros y 0 goles en el 1er duelo).",
        "Cuando se juega con ventaja, sostenerla sin caer en 5 amarillas: gestionar la falta táctica.",
        "Cortar su transición: el empate llegó de una jugada elaborada (asistencia de Cavalleri a Cáceres)."
      ],
      pendientes: ["Ficha de jugadores del rival (opcional, para próximos cruces)"]
    }
  ],

  // ---- Informe táctico 7 preguntas (por rival) ----
  informe7: {
    rival: "Universidad de Concepción",
    partido: "Coquimbo Unido vs U. de Concepción · 2 sep (Local)",
    _archivo_uca: "Informe previo de U. Católica disponible en la ficha del rival (sección Rivales).",
    resumen: "U. de Concepción llega en CRISIS y zona de descenso: 6-4-10, 22 pts, DG −18. Es el reverso de Coquimbo: marca poquísimo (0,80 GF/PJ) y defiende mal, sobre todo de visita, donde es un colador (1-3-6, 2,40 GC/PJ) — y mañana juega precisamente de visitante en Coquimbo. Físico e indisciplinado (117 amarillas, 9 rojas). Su peligro pasa casi exclusivamente por Cecilio Waterman. Llega de L-L-L-L-W. La clave del partido no es tanto el rival como Coquimbo: evitar la 'trampa del dominio' (tener el balón y no marcar, como vs D. Concepción y Huachipato) y aprovechar su fragilidad visitante. Coquimbo es favorito claro de local.",
    preguntas: [
      { n:1, t:"¿Cómo se organiza?",
        dato:"Sistemas variables: 4-1-4-1 (6), 3-4-3 (3), 4-4-2 (3). Posesión ~49% (DATO).",
        inf:"Sin una identidad fija: alterna línea de 4 y de 3. Como visitante tiende a un bloque medio-bajo que igual se rompe (INFERENCIA)." },
      { n:2, t:"¿Cómo construye y progresa?",
        dato:"Ataque de muy bajo rendimiento: 16 goles en 20 (0,80/PJ). Urzi es el principal creador (3 asist.); Espejo aporta volumen de centro (53) (DATO).",
        inf:"Construcción pobre; progresa poco y depende de acciones individuales y del envío por fuera. Si se le presiona la salida, sufre (INFERENCIA)." },
      { n:3, t:"¿Cómo genera peligro?",
        dato:"Waterman: 4 goles, 44 tiros, 54% al arco — casi todo pasa por él. Equipo con G/Sh 0,06 (muy ineficiente) (DATO).",
        inf:"Dependencia casi total de Waterman como referencia. Ataque de bajo volumen y baja calidad de ocasión: si se le anula, casi no crea (INFERENCIA)." },
      { n:4, t:"¿Qué hace tras pérdida?",
        dato:"Muy físico: 455 faltas en la temporada; comete muchas para frenar (DATO).",
        inf:"Recurre a la falta táctica, pero de visita se desarma (2,40 GC/PJ): la transición rápida le hace mucho daño (INFERENCIA)." },
      { n:5, t:"¿Cómo defiende?",
        dato:"1,70 GC/PJ (2,40 de visita), 25% de vallas invictas (mejor de local que fuera). Mater y O. González sostienen atrás (DATO).",
        inf:"Defensa frágil, sobre todo lejos de casa. Es agresiva y comete faltas, lo que también regala balón parado a favor del rival (INFERENCIA)." },
      { n:6, t:"¿Qué hace en balón parado?",
        dato:"Envía muchos centros (Espejo, 53) y comete/recibe muchas faltas (DATO parcial).",
        inf:"Posible amenaza aérea por su físico, pero su indisciplina (117A/9R) le da a Coquimbo faltas peligrosas a favor. A confirmar con vídeo (HIPÓTESIS)." }
    ],
    patrones: [
      { p:"Marca poquísimo (0,80 GF/PJ) y de visita concede 2,40/PJ", i:"Rival en descenso, muy vulnerable fuera de casa", x:"Atacar con volumen y criterio; presión alta para robar y golpear rápido su fragilidad visitante", ev:"alta" },
      { p:"Todo su peligro pasa por Waterman (4g, 44 tiros)", i:"Sin él, casi no crea", x:"Marca de referencia sobre Waterman y cortar el servicio; el resto tira poco y mal", ev:"alta" },
      { p:"Muy físico e indisciplinado (117A, 9R, 455 faltas)", i:"Regala faltas y provoca", x:"Explotar el balón parado a favor y mantener la cabeza fría (no entrar en su juego)", ev:"media" },
      { p:"COQUIMBO: 'trampa del dominio' (>60% posesión y 0 goles vs D. Concepción y Huachipato)", i:"Tener el balón no equivale a marcar", x:"Atacar el intervalo y por dentro, no solo centrar; el rival se cerrará", ev:"alta" },
      { p:"Posible sanción 'sin público' a Coquimbo", i:"Podría perderse el factor localía", x:"Plan mental/logístico para jugar a puertas cerradas; no depender del empuje de la hinchada", ev:"media" }
    ],
    top3: [
      "Ganar por criterio, no por dominio: atacar el intervalo y por dentro (la 'trampa del dominio' ya costó puntos); el rival se meterá atrás.",
      "Presión alta + transición: marca poquísimo y de visita concede 2,40/PJ. Robar arriba y golpear rápido es la vía más directa.",
      "Anular a Waterman y aprovechar su indisciplina (117 amarillas) con balón parado a favor; confirmar si se juega con o sin público."
    ],
    limitaciones: "Sin StatsBomb/tracking público para Chile: no hay mapas de pases, PPDA ni posiciones promedio. Las respuestas combinan dato agregado y de partido (FBref) con inferencia táctica marcada; confirmar con vídeo."
  },

  // ---- Bitácora de avances (AÑADIR líneas nuevas arriba) ----
  bitacora: [
    { fecha: "2026-09-01", nota: "Cargado el perfil completo de U. de Concepción (rival del 2-sep): 6-4-10, 22 pts, DG −18, en descenso; de visita concede 2,40/PJ. Ficha, jugadores, radar, dispersión de tiro, líderes defensivos y gráfico local/visita. Predicción: Coquimbo favorito (~55%). Nueva sección 'Patrones & Mejora' con la 'trampa del dominio' (posesión vs goles) y media móvil de forma. Informe 7 preguntas actualizado a este rival." },
    { fecha: "2026-08-30", nota: "Cargado Coquimbo 0-1 Huachipato (MW21) SUSPENDIDO al 71' por bomba de ruido al arquero rival (C. Bravo). Resultado NO oficial (pendiente Tribunal ANFP); no cuenta en récord ni promedios. Coquimbo arriesga multa (hasta 500 UF) y 1-5 partidos sin público. Parcial: 64% posesión y 32 centros sin gol. Preparado el próximo rival U. de Concepción (2-sep, local), pendiente de su export. Fuentes: T13, La Tercera, informe arbitral ANFP." },
    { fecha: "2026-08-24", nota: "Actualizado el rival U. Católica con su MW20: PERDIÓ 1-2 EN CASA vs Ñublense, dominado (42% posesión, 1 tiro al arco de 10, gol solo de penal). Nueva forma 9-3-8; predicción a favor de Coquimbo revisada al alza (~44%). Informe 7 preguntas actualizado con la fórmula de Ñublense (negar balón + transición). Validado con player stats del partido." },
    { fecha: "2026-08-23", nota: "Cargado el partido D. Concepción 1-1 Coquimbo (MW20): gol de Camargo (7'), empate de Cáceres (62'). Coquimbo con 38% de balón y 5 tiros. Actualizados totales de Liga a 18 PJ (7-5-6, 26 pts, GF 25 / GC 22) y el H2H vs D. Concepción a 2 partidos (0-1-1). Nota: el reporte lista a Héctor Caputto como DT de Coquimbo." },
    { fecha: "2026-08-21", nota: "Añadido informe táctico de 7 preguntas de U. Católica (organización, construcción, peligro, transición, defensa, balón parado y plan propio) con dato real + inferencia marcada." },
    { fecha: "2026-08-21", nota: "Añadido pre-partido U. Católica (26-ago) con dato FBref real: perfil, jugadores, arquero y predicción actualizada. Nuevos gráficos futboleros: radar comparativo, dispersión volumen-vs-eficacia de tiro y líderes defensivos. Paleta amarillo/negro." },
    { fecha: "2026-08-21", nota: "Creado el Centro de Análisis. Cargado perfil Coquimbo 2026 (25 partidos), defensa/intensidad y pre-partido vs Deportes Concepción." }
  ]
};
