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
      "Equipo REACTIVO, no dominador: posesión ~50% y correlación posesión→goles negativa (−0,20). Rinde mejor sin la obligación de tener el balón.",
      "Ataque muy LATERAL: 24,9 centros/partido (rango 14–47). Es su sello y su límite: si le cierran las bandas, se vuelve previsible.",
      "Defensa permeable para un campeón (1,24 GC/PJ) y muy expuesta: concede 10,3 tiros/PJ; corr(tiros concedidos→goles)=+0,71.",
      "Indisciplina severa y doméstica: 8 rojas en 17 de Liga (0 en Libertadores)."
    ],
    defensa: [   // {k, v, nota}
      { k: "Goles en contra", v: "1,24 /PJ", nota: "Permeable" },
      { k: "Tiros concedidos", v: "10,3 /PJ (SoT 3,7)", nota: "Concede volumen" },
      { k: "Atajadas · Save%", v: "2,4 /PJ · 66%", nota: "Arco exigido" },
      { k: "Clean sheets", v: "3/17 (18%)", nota: "Poca portería a cero" },
      { k: "Entradas+intercepciones", v: "20,9 /PJ", nota: "Recuperación activa" }
    ],
    intensidad: [
      { k: "Centros", v: "24,9 /PJ (14–47)", nota: "Frecuencia de ataque lateral, muy alta" },
      { k: "Faltas", v: "11,5 /PJ (7–18)", nota: "Intensidad de duelo media-alta" },
      { k: "Tarjetas", v: "50A · 8R", nota: "Intensidad que se le va de las manos" },
      { k: "Posesión", v: "49,9%", nota: "Reactivo" }
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
      nombre: "Deportes Concepción",
      tipo: "PRE-PARTIDO",
      ficha: [
        { k: "Ciudad / Región", v: "Concepción, Biobío", estado: "DATO" },
        { k: "Apodo / colores", v: "El León de Collao · lila y blanco", estado: "DATO" },
        { k: "Estadio", v: "Ester Roa Rebolledo (Collao)", estado: "REQUIERE_VERIFICACION" },
        { k: "Participación Liga 2026", v: "A confirmar en fuente oficial", estado: "REQUIERE_VERIFICACION" },
        { k: "Entrenador / goleador 2026", v: "—", estado: "REQUIERE_VERIFICACION" }
      ],
      h2h: [ // enfrentamientos con dato real
        { fecha: "2026-02-28", comp: "Liga", sede: "Local", res: "L", gc: "0-1",
          detalle: "66% posesión, 17-8 en tiros, 3 SoT c/u, 36 centros, 1 roja Coquimbo" }
      ],
      resumenH2H: "1 partido (dato): 0V-0E-1D, 0-1. Muestra mínima (n=1): sin tendencia, solo lectura.",
      lecturaH2H: "El partido más ilustrativo del patrón aurinegro: dominó balón (66%) y tiros (17-8) y perdió en casa, con una roja y 36 centros. Prototipo de rival incómodo: le ceden la pelota y lo castigan en pocas acciones.",
      prediccion: [ // baja confianza
        { esc: "Victoria Coquimbo", p: "~42%" },
        { esc: "Empate", p: "~30%" },
        { esc: "Victoria D. Concepción", p: "~28%" },
        { esc: "Over 2.5 goles", p: "~50%" },
        { esc: "Ambos marcan", p: "~60%" }
      ],
      marcador: "1-1 o 1-0 Coquimbo",
      confianza: "BAJA (n=1 en H2H; rival sin datos cargados)",
      claves: [
        "No enamorarse del centro: alternar ataque interior (tercer hombre por half-space) para no ser previsible.",
        "Disciplina en el eje: evitar la falta de último recurso; quedar con diez ya costó el 0-1.",
        "Cortar el volumen de tiro rival (su talón, corr +0,71 con goles)."
      ],
      pendientes: ["Jugadores clave / goleadores", "Estadísticas defensivas", "Forma últimos 5-10", "Lesiones / suspensiones"]
    }
  ],

  // ---- Bitácora de avances (AÑADIR líneas nuevas arriba) ----
  bitacora: [
    { fecha: "2026-08-21", nota: "Creado el Centro de Análisis. Cargado perfil Coquimbo 2026 (25 partidos), defensa/intensidad y pre-partido vs Deportes Concepción." }
  ]
};
