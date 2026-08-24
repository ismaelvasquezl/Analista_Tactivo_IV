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
      nombre: "Universidad Católica",
      tipo: "PRE-PARTIDO · 26 AGO",
      ficha: [
        { k: "Ciudad / Región", v: "Las Condes, Santiago (RM)", estado: "DATO" },
        { k: "Liga 2026", v: "19 PJ · 9-3-7 · 30 pts · DG +13", estado: "DATO" },
        { k: "Perfil", v: "Ofensivo y de posesión (55,8%): 2,16 GF/PJ pero 1,47 GC/PJ", estado: "DATO" },
        { k: "Formaciones", v: "4-2-3-1 / 4-1-4-1 / 4-3-3 (flexible)", estado: "DATO" },
        { k: "Forma últimos 5", v: "L-W-D-L-L (4 GF / 9 GC) — bache defensivo", estado: "DATO" },
        { k: "Arquero", v: "V. Bernedo: 70,4% atajadas, 7 CS, pero 98 SoT recibidos", estado: "DATO" }
      ],
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
      lecturaH2H: "UCA es lo opuesto a Coquimbo: quiere el balón y ataca con volumen y un killer (Zampedri). Pero concede mucho, sobre todo de visita (1,56 GC/PJ) y llega en mala racha. El duelo enfrenta al reactivo local (Coquimbo) contra un proponente en horas bajas.",
      prediccion: [
        { esc: "Victoria Coquimbo", p: "~38%" },
        { esc: "Empate", p: "~28%" },
        { esc: "Victoria U. Católica", p: "~34%" },
        { esc: "Over 2.5 goles", p: "~62%" },
        { esc: "Ambos marcan", p: "~65%" }
      ],
      marcador: "1-1 o 2-1 (partido abierto)",
      confianza: "MEDIA (ambos equipos con dato real 2026; 1 H2H)",
      claves: [
        "Contener a Zampedri: es clínico con pocas ocasiones (0,31 g/tiro). Reducir el servicio interior y el volumen de tiro (talón de Coquimbo: +0,71 tiros→goles).",
        "Atacar la fragilidad visitante de UCA (1,56 GC/PJ y 9 goles en sus últimos 5): presionar su salida y aprovechar transiciones.",
        "Disciplina: con 8 rojas en Liga, no regalar superioridad a un rival que promedia 2,16 goles."
      ],
      pendientes: ["Sede y parte de lesiones/suspensiones del 26-ago (confirmar en fuente oficial)"],
      // Datos para gráficos futboleros (índices 0-100 donde aplica)
      charts: {
        radar: {
          labels: ["Ataque (GF/PJ)","Solidez (inv. GC)","Posesión","Over 2.5%","Ambos marcan%","Vallas invictas%"],
          coq: [54, 38, 50, 53, 65, 18],
          riv: [83, 27, 56, 74, 63, 21]
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
        form5_riv: [0,3,1,0,0] // L-W-D-L-L en puntos
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
    rival: "Universidad Católica",
    partido: "Coquimbo Unido vs U. Católica · 26 ago",
    resumen: "U. Católica llega como el equipo más ofensivo de la Liga (2,16 goles/PJ, 30 pts) pero también permeable (1,47 GC/PJ; 98 remates al arco recibidos). Propone con posesión (55,8%) y sistemas flexibles (4-2-3-1 / 4-1-4-1 / 4-3-3). Su peligro se concentra en Fernando Zampedri (23 goles, letal con pocas ocasiones) y en la creación por izquierda (Cuevas, 101 centros; Montes y Palavecino, 6 asistencias cada uno). Cruza un bache: L-W-D-L-L con 9 goles encajados en 5, y de visita concede 1,56/PJ. Es el opuesto natural de Coquimbo: quiere el balón, nosotros somos reactivos. La clave no es quitarle la pelota, sino castigar sus transiciones y su fragilidad defensiva, y negar servicio a Zampedri.",
    // 7 preguntas: dato real + inferencia marcada
    preguntas: [
      { n:1, t:"¿Cómo se organiza?",
        dato:"Sistemas 4-2-3-1 (9), 4-1-4-1 (8) y 4-3-3 (2). Posesión media 55,8% (DATO).",
        inf:"Equipo de balón con línea media-alta: al proponer tanto, adelanta bloque y deja espacio a la espalda (INFERENCIA). Con o sin balón mantiene estructura de 4 atrás y un pivote (Medel/Valencia) como ancla." },
      { n:2, t:"¿Cómo construye y progresa?",
        dato:"Reparto de asistencias entre Montes (6), Palavecino (6) y Cuevas (5); Cuevas suma 101 centros (DATO).",
        inf:"Construye desde atrás con posesión y progresa sobre todo por izquierda (Cuevas como carrilero-creador); conectores interiores Montes/Palavecino entre líneas (INFERENCIA). Riesgo: si se le presiona la primera línea, pierde fluidez." },
      { n:3, t:"¿Cómo genera peligro?",
        dato:"2,16 goles/PJ; Zampedri 23 goles (50% SoT, 0,31 g/tiro); Giani 9 goles con 83 tiros (0,11); Over 2,5 en 74% (DATO).",
        inf:"Dos vías: el finalizador de área (Zampedri, remata poco y mata) y el volumen exterior (centros de Cuevas, tiros de Giani). Zona de llegada probable: área y segundo palo por centro (INFERENCIA; sin shot-map público)." },
      { n:4, t:"¿Qué hace tras pérdida?",
        dato:"De visita concede 1,56 GC/PJ y encajó 9 goles en sus últimos 5; Valencia acumula 48 faltas (DATO).",
        inf:"Al jugar alto queda expuesto a la contra; recurre a falta táctica (Valencia) para frenar transiciones. Es su mayor vulnerabilidad y encaja con el ADN reactivo de Coquimbo (INFERENCIA)." },
      { n:5, t:"¿Cómo defiende?",
        dato:"1,47 GC/PJ, 98 remates al arco recibidos, solo 21% de vallas invictas; Bernedo 70,4% de atajadas (DATO).",
        inf:"Defensa adelantada y agresiva pero permeable: concede muchos remates. El arquero sostiene, pero el bloque deja llegar. Marca de área y comportamiento aéreo: sin dato público → verificar en vídeo (HIPÓTESIS)." },
      { n:6, t:"¿Qué hace en balón parado?",
        dato:"Cuevas es el gran lanzador desde banda (101 centros); Zampedri, referencia de área (DATO parcial).",
        inf:"Probable amenaza en córner/falta lateral con servicio de Cuevas a la cabeza de Zampedri; especialista de falta frontal sin confirmar (HIPÓTESIS; requiere vídeo)." }
    ],
    // Pregunta 7: patrón -> interpretación -> propuesta
    patrones: [
      { p:"Propone con posesión y línea alta (55,8%)", i:"Deja espacio a la espalda de su defensa", x:"Transiciones rápidas (5-8 s) y desmarques a la espalda de sus laterales — nuestro juego reactivo lo favorece", ev:"alta" },
      { p:"Depende de Zampedri como finalizador (23 g, 0,31 g/tiro)", i:"Con pocas ocasiones hace daño; vive del servicio", x:"Marca de referencia + cortar centros y pases interiores hacia él; aceptar que otros tiren de lejos", ev:"alta" },
      { p:"Crea y sobrecarga por izquierda (Cuevas, 101 centros)", i:"Su banda izquierda es su fuente de peligro… y su espalda", x:"Reforzar nuestro costado derecho, presionar la salida de Cuevas y atacar el espacio que deja al subir", ev:"media" },
      { p:"Concede muchos remates (98 SoTA) y peor de visita (1,56 GC/PJ)", i:"Es vulnerable, sobre todo fuera de casa", x:"Subir volumen y calidad de llegada; presionar su primera línea para forzar pérdidas altas", ev:"alta" },
      { p:"Giani dispara mucho y mal (83 tiros, 0,11 g/tiro)", i:"Remate exterior de baja calidad", x:"Orientar la defensa a proteger el área y ceder el tiro lejano de Giani, cerrando a Zampedri", ev:"media" },
      { p:"Mala racha (9 goles en contra en 5)", i:"Confianza defensiva baja", x:"Golpear temprano para profundizar la duda y obligarlos a exponerse aún más", ev:"media" }
    ],
    top3: [
      "Plan de transición: recuperar y atacar en pocos segundos el espacio a la espalda de su línea alta. Es donde más sufre y donde Coquimbo es mejor.",
      "Neutralizar a Zampedri: marca de referencia y corte del servicio (centros/pase interior). Aceptar el tiro lejano de Giani como 'mal menor'.",
      "Explotar su fragilidad visitante y su banda izquierda con llegadas de segunda línea — y máxima disciplina (nuestras 8 rojas) ante un rival que promedia 2,16 goles."
    ],
    limitaciones: "Sin StatsBomb/tracking público para Chile: no hay mapas de pases, PPDA ni posiciones promedio. Las respuestas de organización, presión y balón parado combinan dato agregado (FBref) con inferencia táctica marcada; confirmar con vídeo."
  },

  // ---- Bitácora de avances (AÑADIR líneas nuevas arriba) ----
  bitacora: [
    { fecha: "2026-08-23", nota: "Cargado el partido D. Concepción 1-1 Coquimbo (MW20): gol de Camargo (7'), empate de Cáceres (62'). Coquimbo con 38% de balón y 5 tiros. Actualizados totales de Liga a 18 PJ (7-5-6, 26 pts, GF 25 / GC 22) y el H2H vs D. Concepción a 2 partidos (0-1-1). Nota: el reporte lista a Héctor Caputto como DT de Coquimbo." },
    { fecha: "2026-08-21", nota: "Añadido informe táctico de 7 preguntas de U. Católica (organización, construcción, peligro, transición, defensa, balón parado y plan propio) con dato real + inferencia marcada." },
    { fecha: "2026-08-21", nota: "Añadido pre-partido U. Católica (26-ago) con dato FBref real: perfil, jugadores, arquero y predicción actualizada. Nuevos gráficos futboleros: radar comparativo, dispersión volumen-vs-eficacia de tiro y líderes defensivos. Paleta amarillo/negro." },
    { fecha: "2026-08-21", nota: "Creado el Centro de Análisis. Cargado perfil Coquimbo 2026 (25 partidos), defensa/intensidad y pre-partido vs Deportes Concepción." }
  ]
};
