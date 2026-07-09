/* =========================================================================
   ATLÉTICO GRAU · CENTRO DE DATOS (data.js)
   -------------------------------------------------------------------------
   FUENTE DE LOS DATOS ACTUALES:
   - Roster / métricas agregadas de jugador: ESPN (plantel 2026). Son totales
     de temporada 2026 (pueden combinar Apertura + refuerzos de Clausura).
   - Resultados confirmados y posición: prensa deportiva (Infobae, Depor,
     Bolavip, TVPerú) para el Torneo Apertura 2026.
   - Los match logs granulares de FBref (remates por partido, xG, atajadas por
     partido, tarjetas por partido) NO pudieron extraerse automáticamente
     (bloqueo del extractor). Los campos marcados como `null` o arrays vacíos
     están LISTOS para que el analista los cargue desde FBref sin tocar el resto.

   CÓMO ACTUALIZAR:
   1. Abre los match logs de FBref (shooting / keeper / misc / schedule).
   2. Copia cada partido como un objeto dentro de GRAU.matchLogs[] siguiendo
      el esquema documentado más abajo.
   3. Guarda y recarga el index.html. Los gráficos que dependen de match logs
      se activan solos cuando el array deja de estar vacío.
   ========================================================================= */

const GRAU = {

  meta: {
    club: "Atlético Grau",
    ciudad: "Piura, Perú",
    liga: "Liga 1 Perú 2026",
    dt: "Gerardo Ameli",
    dtAnterior: "Ángel Comizzo",
    apodo: "El Albo",
    actualizado: "2026-07-09",
    notaFuente: "Roster: ESPN 2026 (agregado de temporada). Resultados: prensa deportiva. Sin match logs FBref cargados aún."
  },

  // --- Posición confirmada (dato) al cierre del Apertura 2026 ---
  standing: {
    torneo: "Torneo Apertura 2026",
    posicion: 16,
    equipos: 18,
    puntos: 16,
    jugados: 17,
    difGoles: -6,
    nota: "Posición y puntos = dato de prensa. Detalle W/D/L y goles por partido: parcialmente confirmado abajo."
  },

  /* Resultados CONFIRMADOS (subconjunto verificado por prensa).
     No es la tabla completa de 17 fechas: faltan fechas por confirmar.
     local: true = jugó de local (cuando se pudo confirmar; null si no).  */
  resultados: [
    { fecha: 1,  rival: "UTC",                  gf: 0, gc: 2, res: "L", local: null, torneo: "AP", nota: "Inicio flojo" },
    { fecha: 2,  rival: "Sport Boys",           gf: 0, gc: 1, res: "L", local: null, torneo: "AP" },
    { fecha: 3,  rival: "Juan Pablo II",        gf: 1, gc: 2, res: "L", local: null, torneo: "AP" },
    { fecha: 4,  rival: "Comerciantes Unidos",  gf: 1, gc: 3, res: "L", local: null, torneo: "AP" },
    { fecha: 5,  rival: "Sport Huancayo",       gf: 0, gc: 0, res: "E", local: null, torneo: "AP" },
    { fecha: 6,  rival: "FC Cajamarca",         gf: 1, gc: 0, res: "V", local: null, torneo: "AP", nota: "Gol de penal del arquero P. Álvarez" },
    { fecha: 10, rival: "Sporting Cristal",     gf: 4, gc: 1, res: "V", local: null, torneo: "AP", nota: "Mejor resultado del tramo" },
    { fecha: 11, rival: "Los Chankas",          gf: 0, gc: 2, res: "L", local: false, torneo: "AP" },
    { fecha: 12, rival: "Alianza Lima",         gf: 0, gc: 1, res: "L", local: false, torneo: "AP", nota: "En Trujillo" },
    { fecha: 13, rival: "ADT",                  gf: 0, gc: 1, res: "L", local: false, torneo: "AP", nota: "Gol tempranero de Guivin" },
    { fecha: 17, rival: "CD Moquegua",          gf: 1, gc: 0, res: "V", local: null, torneo: "AP" }
  ],

  /* Roster completo (ESPN 2026). Campos:
     n=nombre, pos=GK/DEF/MID/FWD, edad, nac, ap=apariciones, sub=ingresos,
     g=goles, a=asistencias, sh=remates, sot=remates al arco,
     fc=faltas cometidas, fs=faltas recibidas, ta=amarillas, tr=rojas,
     saves=atajadas(GK), gc=goles concedidos(GK)  */
  roster: [
    // Arqueros
    { n:"Patricio Álvarez", pos:"GK", edad:32, nac:"PER", ap:15, sub:0, g:0, a:0, sh:0,  sot:0,  fc:0,  fs:0,  ta:2, tr:0, saves:52, gc:17 },
    { n:"Aamet Calderón",   pos:"GK", edad:28, nac:"PER", ap:2,  sub:0, g:0, a:0, sh:0,  sot:0,  fc:0,  fs:0,  ta:0, tr:0, saves:5,  gc:1 },
    { n:"Aarom Fuentes",    pos:"GK", edad:24, nac:"PER", ap:0,  sub:0, g:0, a:0, sh:0,  sot:0,  fc:0,  fs:0,  ta:0, tr:0, saves:0,  gc:0 },
    { n:"Breyner Vilela",   pos:"GK", edad:18, nac:"PER", ap:0,  sub:0, g:0, a:0, sh:0,  sot:0,  fc:0,  fs:0,  ta:0, tr:0, saves:0,  gc:0 },
    // Defensas
    { n:"Rodrigo Tapia",    pos:"DEF", edad:31, nac:"ARG", ap:17, sub:0, g:1, a:0, sh:4,  sot:1,  fc:19, fs:6,  ta:2, tr:0 },
    { n:"Lucas Acevedo",    pos:"DEF", edad:34, nac:"ARG", ap:16, sub:0, g:0, a:0, sh:7,  sot:2,  fc:26, fs:10, ta:3, tr:1 },
    { n:"Elsar Rodas",      pos:"DEF", edad:32, nac:"PER", ap:16, sub:4, g:0, a:1, sh:6,  sot:1,  fc:18, fs:18, ta:2, tr:0 },
    { n:"Ignacio Tapia",    pos:"DEF", edad:27, nac:"CHI", ap:13, sub:0, g:0, a:0, sh:3,  sot:3,  fc:12, fs:7,  ta:5, tr:0 },
    { n:"Diego Rodríguez",  pos:"DEF", edad:24, nac:"PER", ap:9,  sub:1, g:0, a:0, sh:0,  sot:0,  fc:5,  fs:5,  ta:2, tr:0 },
    { n:"Gabriel Alfaro",   pos:"DEF", edad:23, nac:"PER", ap:7,  sub:4, g:0, a:0, sh:3,  sot:1,  fc:5,  fs:0,  ta:0, tr:0 },
    { n:"Christian Vásquez",pos:"DEF", edad:26, nac:"PER", ap:5,  sub:1, g:0, a:0, sh:6,  sot:0,  fc:6,  fs:2,  ta:1, tr:0 },
    { n:"José Ataupillco",  pos:"DEF", edad:25, nac:"PER", ap:4,  sub:0, g:1, a:0, sh:2,  sot:1,  fc:4,  fs:0,  ta:2, tr:0 },
    { n:"Arnold Flores",    pos:"DEF", edad:22, nac:"PER", ap:3,  sub:3, g:0, a:0, sh:1,  sot:0,  fc:4,  fs:0,  ta:0, tr:0 },
    // Mediocampistas
    { n:"Luis Benites",     pos:"MID", edad:30, nac:"PER", ap:16, sub:9, g:3, a:1, sh:20, sot:11, fc:12, fs:11, ta:2, tr:0 },
    { n:"Rafael Guarderas", pos:"MID", edad:32, nac:"PER", ap:16, sub:0, g:0, a:2, sh:5,  sot:1,  fc:21, fs:7,  ta:4, tr:0 },
    { n:"Adrián De La Cruz",pos:"MID", edad:22, nac:"PER", ap:14, sub:6, g:0, a:0, sh:9,  sot:3,  fc:12, fs:2,  ta:0, tr:0 },
    { n:"Paulo de la Cruz", pos:"MID", edad:26, nac:"PER", ap:12, sub:5, g:0, a:0, sh:16, sot:7,  fc:6,  fs:6,  ta:0, tr:1 },
    { n:"Diego Barreto",    pos:"MID", edad:33, nac:"PAR", ap:11, sub:5, g:0, a:0, sh:13, sot:4,  fc:6,  fs:2,  ta:1, tr:0 },
    { n:"César Vásquez",    pos:"MID", edad:23, nac:"PER", ap:11, sub:6, g:1, a:0, sh:7,  sot:4,  fc:5,  fs:7,  ta:0, tr:0 },
    { n:"Freddy Oncoy",     pos:"MID", edad:25, nac:"PER", ap:10, sub:6, g:0, a:0, sh:0,  sot:0,  fc:8,  fs:2,  ta:1, tr:0 },
    { n:"Pablo Lavandeira", pos:"MID", edad:36, nac:"URU", ap:8,  sub:1, g:0, a:0, sh:16, sot:3,  fc:4,  fs:10, ta:0, tr:0 },
    { n:"Eslyn Correa",     pos:"MID", edad:21, nac:"PER", ap:3,  sub:3, g:0, a:0, sh:0,  sot:0,  fc:1,  fs:0,  ta:0, tr:0 },
    { n:"Henri Espinoza",   pos:"MID", edad:19, nac:"PER", ap:1,  sub:1, g:0, a:0, sh:0,  sot:0,  fc:0,  fs:1,  ta:0, tr:0 },
    // Delanteros
    { n:"Raúl Ruidíaz",     pos:"FWD", edad:35, nac:"PER", ap:16, sub:3, g:3, a:0, sh:56, sot:23, fc:13, fs:18, ta:2, tr:0 },
    { n:"Nicolás Delgadillo",pos:"FWD",edad:28, nac:"ARG", ap:13, sub:8, g:1, a:0, sh:13, sot:7,  fc:8,  fs:5,  ta:1, tr:0 },
    { n:"Yamir Ruidíaz",    pos:"FWD", edad:24, nac:"PER", ap:7,  sub:6, g:0, a:1, sh:3,  sot:0,  fc:7,  fs:1,  ta:0, tr:0 },
    { n:"Adrián Fernández", pos:"FWD", edad:33, nac:"PAR", ap:0,  sub:0, g:0, a:0, sh:0,  sot:0,  fc:0,  fs:0,  ta:0, tr:0 }
  ],

  /* =====================================================================
     MATCH LOGS FBref — VACÍO (pendiente de carga manual).
     Esquema por partido:
     {
       fecha: 11, rival:"Los Chankas", local:false, res:"L",
       sh: 9, sot: 3, xg: 0.8,           // shooting log
       shConcedidos: 14, sotConcedidos: 6, xgConcedido: 1.9,  // rival
       saves: 4, gcArquero: 2,           // keeper log
       ta: 2, tr: 0, faltas: 13,         // misc log
       golesAFavorMin: [],               // minutos de gol propio (para tercios)
       golesEnContraMin: [22, 78]        // minutos de gol recibido (para tercios)
     }
     ===================================================================== */
  matchLogs: [],

  /* Timing de goles por tercio — se autocalcula desde matchLogs[].golesXMin
     cuando existan. Mientras esté vacío, el panel de tercios muestra el
     método y la plantilla, no gráficos inventados. */
  tercios: {
    labels: ["0-15", "16-30", "31-45+", "46-60", "61-75", "76-90+"],
    golesAFavor: null,   // se llenará al cargar matchLogs
    golesEnContra: null
  }
};
