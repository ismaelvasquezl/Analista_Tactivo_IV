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
  actualizado: "2026-09-03",

  // ---- Perfil interpretativo de Coquimbo (2026) ----
  coquimbo: {
    titular: "Campeón vigente 2025 · reactivo, intenso y de ataque lateral",
    perfil: [
      "Equipo REACTIVO, no dominador: posesión ~50% y correlación posesión→goles negativa. Ante rivales que se cierran debe evitar la 'trampa del dominio': lo logró venciendo 1-0 a U. de Concepción con 60% de balón, tras insistir hasta el 85'.",
      "Ataque muy LATERAL: 24,9 centros/partido (rango 11–47). Es su sello y su límite: si le cierran las bandas, se vuelve previsible.",
      "Defensa que mejora: 1,16 GC/PJ y ya 21% de vallas invictas; sigue concediendo volumen (10,8 tiros/PJ; corr tiros→goles +0,71).",
      "Indisciplina doméstica: 8 rojas en 19 de Liga (0 en Libertadores)."
    ],
    defensa: [   // {k, v, nota}  — Liga 2026, 19 PJ
      { k: "Goles en contra", v: "1,16 /PJ", nota: "Mejorando" },
      { k: "Tiros concedidos", v: "10,8 /PJ (SoT 35%)", nota: "Concede volumen" },
      { k: "Atajadas · Save%", v: "2,4 /PJ · ~68%", nota: "Arco fiable" },
      { k: "Clean sheets", v: "4/19 (21%)", nota: "Al alza (venía de 17%)" },
      { k: "Entradas+intercepciones", v: "≈21,5 /PJ", nota: "Recuperación activa" }
    ],
    intensidad: [
      { k: "Centros", v: "24,9 /PJ (11–47)", nota: "Frecuencia de ataque lateral, muy alta" },
      { k: "Faltas", v: "11,8 /PJ (7–18)", nota: "Intensidad de duelo media-alta" },
      { k: "Tarjetas", v: "56A · 8R", nota: "Foco disciplinario tras la suspensión" },
      { k: "Posesión", v: "49,8%", nota: "Reactivo" }
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
      nombre: "Universidad de Chile",
      tipo: "PRÓXIMO · VISITA (Nacional)",
      ficha: [
        { k: "Ciudad / apodo", v: "Santiago · La U · DT Fernando Gago", estado: "DATO" },
        { k: "Sede del partido", v: "VISITA para Coquimbo — Estadio Nacional. Contexto difícil: la U es 6-3-1 de local", estado: "DATO" },
        { k: "Liga 2026", v: "21 PJ · 10-6-5 · 36 pts · DG +11 (arriba en la tabla)", estado: "DATO" },
        { k: "Perfil", v: "PROPONENTE y sólido: 58% posesión, 1,33 GF/PJ y solo 0,81 GC/PJ (43% de vallas invictas)", estado: "DATO" },
        { k: "Local vs visita", v: "Fortísimo de local (6-3-1, 1,70 GF / 0,70 GC) — justo donde juega Coquimbo", estado: "DATO" },
        { k: "Formaciones", v: "4-2-3-1 (7), 3-4-3 (6), 4-1-4-1 (3) — flexible, usa línea de 3", estado: "DATO" },
        { k: "Forma últimos 5", v: "W-W-W-L-L (venía muy fuerte, dos tropiezos recientes)", estado: "DATO" }
      ],
      jugadores: [
        { n: "Eduardo Vargas", rol: "Delantero", aporte: "8G · 3A", nota: "El killer: 50 tiros, 0,16 g/tiro. Referencia y máximo goleador", tag: "alerta" },
        { n: "Agustín Arce", rol: "MF/FW", aporte: "4G", nota: "Segundo artillero, llega desde el medio", tag: "" },
        { n: "M. Guerrero", rol: "Mediocampista", aporte: "3G · 3A · 80 centros", nota: "Amplitud y creación por fuera", tag: "clave" },
        { n: "F. Hormazábal", rol: "Carrilero", aporte: "40 int · 63 centros", nota: "Lateral de ida y vuelta: defiende y desborda", tag: "" },
        { n: "Charles Aránguiz", rol: "Mediocampista", aporte: "Jerarquía", nota: "El cerebro: organiza y recupera (22 entradas)", tag: "clave" },
        { n: "G. Castellón", rol: "Arquero", aporte: "Muchas vallas invictas", nota: "Arco fiable (43% CS del equipo)", tag: "" }
      ],
      h2h: [
        { fecha: "2026-03-14", comp: "Liga (MW7)", sede: "Local", res: "L", gc: "0-1",
          detalle: "Coquimbo cayó en casa pese a dominar (51% posesión, 19 tiros): otra vez el patrón de dominar sin marcar." }
      ],
      resumenH2H: "1 partido 2026: 0V-0E-1D, 0-1 en casa. Ahora el regreso es EN EL NACIONAL, de visita: el examen más duro del tramo.",
      lecturaH2H: "Rival de nivel superior y, encima, de local: propone, tiene el balón (58%) y defiende de maravilla (0,81 GC/PJ; solo 0,70 en casa). Coquimbo va de visitante, donde es más abierto (concede 1,50/PJ). La U es clara favorita. El plan realista es de partido chico: bloque compacto, no exponerse al ida y vuelta, marca especial a Vargas y apostar a un golpe de eficacia o de balón parado. Sumar aquí sería un golazo anímico.",
      prediccion: [
        { esc: "Victoria Coquimbo", p: "~25%" },
        { esc: "Empate", p: "~27%" },
        { esc: "Victoria U. de Chile", p: "~48%" },
        { esc: "Over 2.5 goles", p: "~46%" },
        { esc: "Ambos marcan", p: "~46%" }
      ],
      marcador: "0-1 o 1-2 U. de Chile (favorita de local)",
      confianza: "MEDIA-ALTA (dato real de ambos; sede confirmada: visita)",
      claves: [
        "Partido chico de visita: bloque compacto y NO entrar en el ida y vuelta (de visitante Coquimbo concede 1,50/PJ). Ceder balón sin ceder ocasiones.",
        "Marca especial a Vargas y cerrar los centros de Guerrero/Hormazábal: la amplitud de la U es su fuente de peligro en el Nacional.",
        "Apostar al golpe: eficacia máxima en la contra y en el balón parado; con 0,70 GC/PJ de local, las ocasiones serán pocas y hay que aprovecharlas."
      ],
      pendientes: ["Confirmar sede (local/visita) y parte de lesiones"],
      charts: {
        radar: { labels: ["Ataque (GF/PJ)","Solidez (inv. GC)","Posesión","Over 2.5%","Ambos marcan%","Vallas invictas%"],
          coq: [54, 39, 49, 50, 67, 17], riv: [51, 60, 58, 48, 48, 43] },
        shooters: [ { n:"Vargas", sh:50, gsh:0.16, g:8 }, { n:"Arce", sh:38, gsh:0.11, g:4 }, { n:"Guerrero", sh:36, gsh:0.08, g:3 }, { n:"Hormazábal", sh:23, gsh:0.09, g:2 }, { n:"Lucero", sh:21, gsh:0.05, g:1 } ],
        defensores: [ { n:"Hormazábal", int:40, tklw:23 }, { n:"Poblete", int:16, tklw:25 }, { n:"Zaldivia", int:23, tklw:12 }, { n:"Aránguiz", int:14, tklw:22 }, { n:"N. Ramírez", int:13, tklw:17 } ],
        homeAway: { gf:[1.70,1.00], gc:[0.70,0.91], rec:["6-3-1","4-3-4"] },
        form5_riv: [3,3,3,0,0]
      }
    },
    {
      nombre: "Universidad de Concepción",
      tipo: "H2H · JUGADO 2-SEP (1-0)",
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
          detalle: "1ª fecha: Coquimbo cayó, superado 13-8 en tiros y con 1 solo remate al arco (50% posesión)." },
        { fecha: "2026-09-02", comp: "Liga (MW16)", sede: "Local", res: "W", gc: "1-0",
          detalle: "Coquimbo rompió la 'trampa del dominio': 60% posesión, 18 tiros y 38 centros, y lo resolvió tarde con Riveros (85', asist. Zavala). Waterman, anulado." }
      ],
      resumenH2H: "2 partidos 2026: 1V-0E-1D · goles 1-1. En casa se impuso 1-0 pese a que costó (dominó todo el partido y marcó al 85').",
      lecturaH2H: "Se cumplió el plan: Coquimbo dominó a un rival que se metió atrás (5-3-2), evitó la esterilidad y ganó por la mínima. Refuerza la lectura de que su margen está en la PACIENCIA y el criterio ofensivo, no en tener más balón. Waterman, su única vía, quedó sin servicio.",
      prediccion: [
        { esc: "Partidos 2026", p: "2" },
        { esc: "Coquimbo V-E-D", p: "1-0-1" },
        { esc: "Goles (Coq–UdC)", p: "1–1" },
        { esc: "Resultado clave", p: "1-0 local (Riveros 85')" }
      ],
      marcador: "Último: 1-0 (2-sep, Riveros)",
      confianza: "HISTÓRICO · partido jugado",
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
    rival: "Universidad de Chile",
    partido: "U. de Chile vs Coquimbo Unido · VISITA (Estadio Nacional)",
    resumen: "El examen más duro del tramo, y encima de visita. La U (DT Fernando Gago) es de los mejores: 36 pts, 58% de posesión y una defensa sólida (0,81 GC/PJ, 43% de vallas invictas; 0,70 de local). Es un PROPONENTE que domina el balón — Coquimbo no lo tendrá. En el Nacional la U es 6-3-1 y Coquimbo es más abierto de visitante (concede 1,50/PJ). La clave no es competir por la posesión, sino ser un equipo chico eficaz: bloque compacto, no exponerse al ida y vuelta, marca especial a Vargas y golpe de eficacia o balón parado. Favorita clara: la U.",
    preguntas: [
      { n:1, t:"¿Cómo se organiza?",
        dato:"Sistemas 4-2-3-1 (7), 3-4-3 (6), 4-1-4-1 (3). Posesión 58% (DATO).",
        inf:"Proponente con bloque adelantado; alterna línea de 3 para dar amplitud con carrileros. Estructura pensada para tener y mover el balón (INFERENCIA)." },
      { n:2, t:"¿Cómo construye y progresa?",
        dato:"Construye desde atrás con posesión; progresa por FUERA con carrileros que centran muchísimo (Morales 126, Guerrero 80, Hormazábal 63). Aránguiz organiza por dentro (DATO).",
        inf:"Ataque paciente y de amplitud: estira al rival y busca el centro o la llegada de segunda línea. Su salida es limpia; presionarla arriba es costoso (INFERENCIA)." },
      { n:3, t:"¿Cómo genera peligro?",
        dato:"Eduardo Vargas 8 goles (0,16 g/tiro, el más eficaz); Arce 4; Guerrero 3G+3A. Volumen de centros y de tiro (DATO).",
        inf:"Peligro por Vargas en el área + llegadas y centros desde las bandas. Genera con criterio y variedad, no depende de un solo recurso (INFERENCIA)." },
      { n:4, t:"¿Qué hace tras pérdida?",
        dato:"Como dominador, contrapresiona alto para recuperar. De visita concede algo más (0,91 vs 0,70 de local) (DATO).",
        inf:"Al tener el balón y subir carrileros, deja espacio a su espalda: esa es la ÚNICA grieta real para Coquimbo, vía transición rápida (INFERENCIA)." },
      { n:5, t:"¿Cómo defiende?",
        dato:"0,81 GC/PJ (0,70 de local), 43% de vallas invictas. Zaldivia/N. Ramírez firmes; arquero Castellón fiable (DATO).",
        inf:"Defensa sólida y bien poblada, difícil de romper de frente. Romperla exige criterio (intervalos, transición), no volumen de centro (INFERENCIA)." },
      { n:6, t:"¿Qué hace en balón parado?",
        dato:"Mucho centro y físico arriba (Vargas, centrales) (DATO parcial).",
        inf:"Amenaza aérea en córner/falta lateral. A favor de Coquimbo: la U no es especialmente indisciplinada, así que habrá pocas faltas peligrosas regaladas (HIPÓTESIS; confirmar en vídeo)." }
    ],
    patrones: [
      { p:"Domina el balón (58%) y presiona alto", i:"Coquimbo no competirá por la posesión", x:"Bloque compacto y transición al espacio de sus carrileros; ceder balón sin ceder ocasiones", ev:"alta" },
      { p:"Ataca por amplitud (carrileros centran 60-126)", i:"Su banda es la fuente de peligro", x:"Cerrar bandas, ganar el área y no permitir centros cómodos", ev:"alta" },
      { p:"Vargas killer (8 g, 0,16 g/tiro)", i:"Con pocas ocasiones define", x:"Marca de referencia sobre Vargas; negarle el balón en el área", ev:"alta" },
      { p:"Muy sólida de local (0,70 GC/PJ, 43% CS)", i:"Las ocasiones serán muy pocas", x:"Máxima eficacia y balón parado: convertir la que llegue", ev:"alta" },
      { p:"COQUIMBO abierto de visita (1,50 GC/PJ)", i:"Riesgo de entrar en un ida y vuelta que no le conviene", x:"Priorizar orden y equilibrio; no dejarse arrastrar al partido de la U", ev:"media" }
    ],
    top3: [
      "Partido chico y compacto: ceder el balón sin ceder ocasiones y explotar la espalda de sus carrileros en transición — su única grieta.",
      "Anular a Vargas y cerrar los centros (Morales/Guerrero/Hormazábal): la amplitud es su arma en el Nacional.",
      "Máxima eficacia y balón parado: la U concede 0,70 de local; habrá pocas y hay que meterlas. Sumar ahí sería un golazo anímico."
    ],
    limitaciones: "Sin StatsBomb/tracking público para Chile: no hay mapas de pases, PPDA ni posiciones promedio. Las respuestas combinan dato agregado y de partido (FBref) con inferencia táctica marcada; confirmar con vídeo."
  },

  // ---- Bitácora de avances (AÑADIR líneas nuevas arriba) ----
  bitacora: [
    { fecha: "2026-09-03", nota: "BARRIDO DE CIERRE: reconciliados todos los totales acumulados (Liga 8-5-6, 29 pts, GF 26/GC 22, DG +4; 19 PJ). Corregidos textos antiguos (reporte, 'cómo leer', tendencia y visita 1,50 GC/PJ); el reporte y el resumen de tendencia ahora se calculan en vivo desde fixtures.js para no volver a quedar viejos. Corregido el bug del mapa de calor de Coquimbo (clasificación de línea). Fecha del sitio: 2026-09-03." },
    { fecha: "2026-09-03", nota: "Informe 7Q, predicción y todas las secciones actualizadas al rival actual: U. de Chile (visita, Estadio Nacional). Mapa de calor y 'once por minutos' ahora son SELECCIONABLES por equipo (Coquimbo + 3 rivales), calculados con el reparto de minutos por línea + stats. Correcciones: DT U. de Chile = Fernando Gago; DT Coquimbo = Hernán Caputto." },
    { fecha: "2026-09-03", nota: "Cargado próximo rival U. de Chile (fuerte: 36 pts, 58% posesión, 0,81 GC/PJ, 43% vallas invictas) con ficha, jugadores, radar y gráficos. NUEVA 'Pizarra táctica dinámica': cancha con formación y formación rival, fichas arrastrables que al clic muestran stats y aptitud del jugador para el rol (principios por posición) + lectura formación↔estilo. Roster de la U (30 jug.) con datos por jugador para el análisis de aptitud." },
    { fecha: "2026-09-02", nota: "Cargado Coquimbo 1-0 U. de Concepción (MW16): gol de Riveros (85', asist. Zavala). Dominó (60%, 18 tiros, 38 centros) y esta vez SÍ convirtió: rompió la 'trampa del dominio'. Liga: 8-5-6, 29 pts, GF 26/GC 22. H2H vs U. de Concepción a 2 (1-0-1). Nuevas métricas avanzadas (conversión, precisión, dominio de tiro, fiabilidad defensiva). Oficial ANFP: el partido con Huachipato se REANUDARÁ (no forfait). Fuentes: Emol, Radio Maray, En Cancha." },
    { fecha: "2026-09-01", nota: "Cargado el perfil completo de U. de Concepción (rival del 2-sep): 6-4-10, 22 pts, DG −18, en descenso; de visita concede 2,40/PJ. Ficha, jugadores, radar, dispersión de tiro, líderes defensivos y gráfico local/visita. Predicción: Coquimbo favorito (~55%). Nueva sección 'Patrones & Mejora' con la 'trampa del dominio' (posesión vs goles) y media móvil de forma. Informe 7 preguntas actualizado a este rival." },
    { fecha: "2026-08-30", nota: "Cargado Coquimbo 0-1 Huachipato (MW21) SUSPENDIDO al 71' por bomba de ruido al arquero rival (C. Bravo). Resultado NO oficial (pendiente Tribunal ANFP); no cuenta en récord ni promedios. Coquimbo arriesga multa (hasta 500 UF) y 1-5 partidos sin público. Parcial: 64% posesión y 32 centros sin gol. Preparado el próximo rival U. de Concepción (2-sep, local), pendiente de su export. Fuentes: T13, La Tercera, informe arbitral ANFP." },
    { fecha: "2026-08-24", nota: "Actualizado el rival U. Católica con su MW20: PERDIÓ 1-2 EN CASA vs Ñublense, dominado (42% posesión, 1 tiro al arco de 10, gol solo de penal). Nueva forma 9-3-8; predicción a favor de Coquimbo revisada al alza (~44%). Informe 7 preguntas actualizado con la fórmula de Ñublense (negar balón + transición). Validado con player stats del partido." },
    { fecha: "2026-08-23", nota: "Cargado el partido D. Concepción 1-1 Coquimbo (MW20): gol de Camargo (7'), empate de Cáceres (62'). Coquimbo con 38% de balón y 5 tiros. Actualizados totales de Liga a 18 PJ (7-5-6, 26 pts, GF 25 / GC 22) y el H2H vs D. Concepción a 2 partidos (0-1-1). Nota: el reporte lista a Héctor Caputto como DT de Coquimbo." },
    { fecha: "2026-08-21", nota: "Añadido informe táctico de 7 preguntas de U. Católica (organización, construcción, peligro, transición, defensa, balón parado y plan propio) con dato real + inferencia marcada." },
    { fecha: "2026-08-21", nota: "Añadido pre-partido U. Católica (26-ago) con dato FBref real: perfil, jugadores, arquero y predicción actualizada. Nuevos gráficos futboleros: radar comparativo, dispersión volumen-vs-eficacia de tiro y líderes defensivos. Paleta amarillo/negro." },
    { fecha: "2026-08-21", nota: "Creado el Centro de Análisis. Cargado perfil Coquimbo 2026 (25 partidos), defensa/intensidad y pre-partido vs Deportes Concepción." }
  ]
};
