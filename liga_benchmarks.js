// Benchmarks de liga (promedios oficiales) — fuente: bartidata.com/datalabs (API-Football).
// Los CSV son TOTALES AGREGADOS de la competición completa (una fila por temporada), no data por
// equipo ni por jugador. Sirven como REFERENCIA DE LIGA para contextualizar métricas propias.
// rating = rating de jugador promedio (escala API-Football/CFDB) · pase = % de pases completados ·
// tiros = tiros por partido · resto = totales de temporada. El archivo de Copa Chile venía
// DUPLICADO del Campeonato 2026 (no aporta data real de copa).
const LIGA_BENCH = {
  fuente: "bartidata.com/datalabs (API-Football)",
  seasons: {
    "2024": {rating:6.87, pase:75.19, tiros:12.79, goles:647, asist:451, amar:1320, pj:239},
    "2025": {rating:6.89, pase:77.19, tiros:13.07, goles:619, asist:401, amar:1325, pj:239},
    "2026": {rating:6.80, pase:77.79, tiros:12.63, goles:379, asist:244, amar:725,  pj:113}
  },
  actual: {rating:6.80, pase:77.79, tiros:12.63}   // temporada en curso (2026)
};
