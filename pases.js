// Pases y posesión por partido — fuente CFDB team_match_stats (DATO). Clave = fecha.
// p = posesión %, a = % de pases completados (accuracy). CFDB no expone el conteo bruto de pases,
// solo la precisión; por eso "pases concretados" se lee como % de acierto por partido.
// El Huachipato del 30-ago (fixture makeup) no tiene stats cargadas en CFDB -> null.
const PASES = {
 "2026-01-31":{p:50,a:80}, "2026-02-07":{p:35,a:72}, "2026-02-14":{p:50,a:70},
 "2026-02-21":{p:42,a:75}, "2026-02-28":{p:67,a:85}, "2026-03-07":{p:43,a:71},
 "2026-03-14":{p:50,a:72}, "2026-04-03":{p:58,a:83}, "2026-04-19":{p:42,a:73},
 "2026-04-24":{p:42,a:76}, "2026-05-03":{p:39,a:67}, "2026-05-15":{p:51,a:72},
 "2026-05-22":{p:47,a:70}, "2026-05-31":{p:62,a:83}, "2026-06-13":{p:59,a:83},
 "2026-08-01":{p:51,a:77}, "2026-08-08":{p:60,a:70}, "2026-08-23":{p:38,a:67},
 "2026-08-26":{p:49,a:81}, "2026-08-30":{p:null,a:null}, "2026-09-02":{p:60,a:83},
 "2026-09-05":{p:39,a:70}, "2026-09-12":{p:55,a:84}
};
