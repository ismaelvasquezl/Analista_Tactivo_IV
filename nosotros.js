// Autoanálisis Coquimbo Unido — Hudl Wyscout "Informe de Equipo · últimos 5 partidos" + liga 2026.
// Dato de evento real agregado de los 5: U.Chile 2-4 (V,L), U.Concepción 1-0 (L,W), U.Católica 1-2 (L,L),
// Concepción 1-1 (V,D), La Serena 1-1 (L,D). NO editar a mano salvo al cargar nuevos informes.
const NOSOTROS = {
  fuente: "Hudl Wyscout — Informe de Equipo (últimos 5) + Resumen de liga 2026",
  actualizado: "2026-10-08",
  ult5: { pj:5, w:1, d:2, l:2, gf:6, ga:8, nota:"1-2-2 en los últimos 5; 6 goles a favor, 8 en contra." },
  temporada: { pos:11, pts:29, xg:35.8, xga:27.4, xgdif:8.4, xpts:36.6, xptsD:7.6,
    titular:"4-4-2 / 4-2-3-1",
    headline:"Coquimbo es el equipo que MÁS infrarrinde de la liga: xPoints 36,6 vs 29 reales (+7,6). xG 35,8 (4º ataque) y dif. de xG +8,4 (top-4): juego de zona alta pese a ir 11º. El margen se pierde en definición (6 goles con xG alto) y en encajar sobre lo esperado (las caídas tardías)." },
  // jugadores: dato agregado de los 5 partidos. pases=intentados, pasesPct=% completados.
  players: [
    {d:13,n:"Diego Sánchez",pos:"GK",grupo:"GK",edad:39,alt:184,pj:5,min:508,g:0,xg:0,a:0,xa:0,tiros:0,tirosArco:0,pases:null,pasesPct:null,nota:"Arquero titular los 5 partidos. Perfil de experiencia (39) y mando de área; su lectura fina de atajada/salida requiere su página de arquero (fase 2)."},
    {d:2,n:"Benjamín Gazzolo",pos:"RCB",grupo:"DEF",edad:29,alt:182,pj:5,min:457,g:0,xg:0,a:0,xa:0,tiros:0,tirosArco:0,pases:152,pasesPct:87,nota:"Central de SALIDA LIMPIA: 152 pases al 87%, el más fiable en la primera fase. Eje de la construcción desde atrás."},
    {d:26,n:"Lukas Soza",pos:"LCB",grupo:"DEF",edad:28,alt:177,pj:3,min:296,g:0,xg:0.18,a:0,xa:0,tiros:2,tirosArco:1,pases:103,pasesPct:81,nota:"Central izquierdo solvente con balón (81%); aporta llegada ocasional (0.18 xG)."},
    {d:4,n:"Elvis Hernández",pos:"RCB",grupo:"DEF",edad:27,alt:182,pj:3,min:204,g:0,xg:0,a:0,xa:0,tiros:0,tirosArco:0,pases:61,pasesPct:89,nota:"El central más preciso en el pase (89%) en su muestra; opción fiable para iniciar."},
    {d:3,n:"Manuel Fernández",pos:"LCB",grupo:"DEF",edad:37,alt:180,pj:1,min:92,g:0,xg:0,a:0,xa:0,tiros:0,tirosArco:0,pases:31,pasesPct:77,nota:"Veteranía y jerarquía; muestra corta (1 partido)."},
    {d:19,n:"Joshua Arancibia",pos:"RCB",grupo:"DEF",edad:21,alt:183,pj:1,min:52,g:0,xg:0,a:0,xa:0,tiros:0,tirosArco:0,pases:19,pasesPct:68,nota:"Central juvenil (21, 183cm): proyección; muestra mínima."},
    {d:16,n:"Juan Cornejo",pos:"LB",grupo:"LAT",edad:36,alt:177,pj:5,min:412,g:0,xg:0,a:0,xa:0.90,tiros:1,tirosArco:0,pases:176,pasesPct:66,nota:"El CARRILERO CREADOR: 3º de la LIGA en pases clave (2,14/90) y 0,90 de xA generado. Su proyección y último pase son vía principal de ataque."},
    {d:17,n:"Francisco Salinas",pos:"RB",grupo:"LAT",edad:26,alt:179,pj:4,min:409,g:0,xg:0.26,a:0,xa:0.80,tiros:2,tirosArco:2,pases:243,pasesPct:73,nota:"Mayor VOLUMEN de pase del equipo (243): lateral muy involucrado en la circulación, con 0,80 de xA. Amplitud y salida por su banda."},
    {d:28,n:"Sebastián Cabrera",pos:"LB",grupo:"LAT",edad:28,alt:175,pj:3,min:222,g:0,xg:0.12,a:0,xa:0.34,tiros:3,tirosArco:1,pases:98,pasesPct:81,nota:"Lateral alternativo fiable con balón (81%) y con llegada (3 remates, 0,34 xA)."},
    {d:8,n:"Alejandro Camargo",pos:"RDMF",grupo:"VOL",edad:37,alt:175,pj:5,min:431,g:1,xg:0.85,a:0,xa:0,tiros:6,tirosArco:3,pases:218,pasesPct:84,nota:"PIVOTE eje: 218 pases al 84% (equilibrio + jerarquía), y encima aporta gol (1, 0.85 xG, 6 remates). Ordenador del juego."},
    {d:7,n:"Sebastián Galani",pos:"LDMF",grupo:"VOL",edad:29,alt:177,pj:4,min:409,g:0,xg:0.01,a:0,xa:0,tiros:1,tirosArco:0,pases:209,pasesPct:82,nota:"METRÓNOMO en el doble pivote: 209 pases al 82%. Capitán habitual; da el tempo y el equilibrio defensivo."},
    {d:15,n:"Cristián Zavala",pos:"RAMF",grupo:"VOL",edad:27,alt:175,pj:4,min:374,g:0,xg:0.32,a:1,xa:1.76,tiros:5,tirosArco:2,pases:147,pasesPct:60,nota:"EL DESEQUILIBRANTE: 34 regates (15 exitosos) y 1,76 de xA — el MÁXIMO creador real del equipo. Su 60% de pase refleja que asume riesgo; es la chispa en el último tercio."},
    {d:18,n:"Pablo Rodríguez",pos:"AMF",grupo:"VOL",edad:19,alt:null,pj:5,min:343,g:1,xg:1.23,a:1,xa:0.16,tiros:4,tirosArco:1,pases:127,pasesPct:74,nota:"JUVENIL (19) que ya pesa: 1 gol (1.23 xG) + 1 asistencia en 5 partidos como enganche. Llegada al área y criterio; pieza de futuro y presente."},
    {d:14,n:"Salvador Cordero",pos:"LDMF",grupo:"VOL",edad:30,alt:177,pj:4,min:185,g:0,xg:0.36,a:0,xa:0.07,tiros:4,tirosArco:1,pases:74,pasesPct:81,nota:"EL RECUPERADOR: 3º de la LIGA en duelos defensivos (8,01/90, 58%). Músculo y corte en el medio; sostiene la fase defensiva."},
    {d:30,n:"Benjamín Chandía",pos:"LAMF",grupo:"VOL",edad:23,alt:166,pj:5,min:176,g:1,xg:0.34,a:0,xa:0.39,tiros:2,tirosArco:2,pases:57,pasesPct:63,nota:"Extremo regateador (166cm, desborde): 1 gol y 0,39 xA en pocos minutos. Revulsivo de profundidad y 1v1."},
    {d:10,n:"Guido Vadalá",pos:"AMF",grupo:"VOL",edad:29,alt:169,pj:3,min:128,g:0,xg:0.27,a:0,xa:0,tiros:1,tirosArco:1,pases:19,pasesPct:74,nota:"Enganche de pausa; muestra corta, aporta entre líneas (0.27 xG)."},
    {d:11,n:"Alejandro Azócar",pos:"LAMF",grupo:"VOL",edad:25,alt:180,pj:2,min:102,g:0,xg:0.05,a:0,xa:0.11,tiros:1,tirosArco:1,pases:20,pasesPct:75,nota:"Extremo alternativo; pocos minutos."},
    {d:9,n:"Nicolás Johansen",pos:"CF",grupo:"DEL",edad:27,alt:182,pj:5,min:373,g:1,xg:1.11,a:0,xa:0.25,tiros:9,tirosArco:3,pases:84,pasesPct:61,nota:"EL 9 REFERENCIA: 3º de la LIGA en toques en el área (5,16/90), 9 remates y 1,11 xG. Fija centrales y ataca el área; su volumen de remate es el motor ofensivo. Margen de mejora en conversión (1 gol / 1,11 xG)."},
    {d:27,n:"Luis Riveros",pos:"CF",grupo:"DEL",edad:28,alt:178,pj:3,min:256,g:1,xg:1.25,a:0,xa:0.25,tiros:7,tirosArco:1,pases:83,pasesPct:63,nota:"Delantero de área: 1 gol con 1,25 xG y 7 remates. Buena generación de ocasión; afinar puntería (solo 1 de 7 al arco)."},
    {d:29,n:"F. Pons",pos:"CF",grupo:"DEL",edad:30,alt:186,pj:4,min:136,g:0,xg:0.60,a:0,xa:0,tiros:4,tirosArco:1,pases:31,pasesPct:48,nota:"CF de relevo con peso aéreo (186cm): referencia para balón largo y balón parado; 4 remates y 0,60 xG en pocos minutos, pero 0 goles — afinar definición."},
    {d:31,n:"D. Pereira",pos:"LWF",grupo:"VOL",edad:null,alt:null,pj:1,min:12,g:0,xg:0,a:0,xa:0,tiros:0,tirosArco:0,pases:8,pasesPct:88,nota:"Debut con 12' ante U. Católica como extremo (LWF). Muestra mínima: 8 pases al 88% y 2/2 regates — primer contacto prometedor, sin datos suficientes para concluir."}
  ],
  // lecturas por fase (equipo), con dato Wyscout
  fases: {
    ofensiva: "Ataque de zona alta por volumen (xG 35,8, 4º de la liga). Vías: proyección del carrilero Cornejo (2,14 pases clave/90) + volumen de Salinas, desequilibrio de Zavala (34 regates, 1,76 xA) y el 9 Johansen fijando (5,16 toques de área/90). Déficit claro: CONVERSIÓN — se crea más de lo que se concreta.",
    defensiva: "Buen xGA (27,4, top-5), pero encaja por encima de lo esperado (32 GC): el problema no es estructural sino de MOMENTOS — concentración en tramos finales y balón parado. Sostén en Cordero (duelos) y la salida limpia de los centrales (Gazzolo 87%).",
    balonParado: "Coquimbo es 4º de la liga en córners generados (volumen alto). El peso aéreo está en Pons (186), Gazzolo (182), E.Hernández/Arancibia (182-183). Oportunidad: convertir ese volumen de córner en gol (igual que exigimos a los rivales, aquí es palanca propia)."
  },
  // confianza / muestra
  confianza: "Dato de evento Hudl (agregado de 5 partidos + temporada de liga). Alta confianza en volúmenes (minutos, pases, remates, xG/xA, duelos). Los MAPAS usan nuestras métricas reales por jugador/línea (DATO) ubicadas sobre el modelo de 18 zonas (INFERENCIA de posición): el informe no trae coordenadas (x,y) por evento.",
  // Mapas por zona (ataque hacia arriba). Grids 6 bandas × 3 columnas [izq,centro,der], intensidad 0..1.
  zonas: {
    nota: "DATO Wyscout (volúmenes reales por jugador/línea) + INFERENCIA de ubicación por posición (sin x,y).",
    capas: [
      { id:"calor", label:"Mapa de calor (actividad)", tipo:"heat", color:"gold",
        grid:[[0.08,0.35,0.10],[0.30,0.55,0.35],[0.50,0.70,0.55],[0.45,0.60,0.55],[0.35,0.50,0.48],[0.20,0.55,0.30]],
        interp:"Actividad concentrada en el CENTRO del mediocampo (dobles pivotes Camargo 218 y Galani 209 pases) y por la banda DERECHA (Salinas, 243 pases, el mayor volumen). Johansen fija arriba por el centro. Perfil de circulación central con salida por los carrileros." },
      { id:"pasesClave", label:"Pases clave / creación (dónde se generan)", tipo:"heat", color:"gold",
        grid:[[0,0.05,0],[0.05,0.10,0.05],[0.20,0.30,0.20],[0.45,0.55,0.50],[0.55,0.75,0.60],[0.30,0.45,0.35]],
        interp:"La creación nace de los CARRILEROS y de la Z14: Cornejo (0,90 xA, banda izq, 3º de la liga en pases clave 2,14/90), Salinas (0,80 xA, banda der) y Zavala en el frontal del área (1,76 xA, el máximo creador). Asistencias convertidas: Zavala y P. Rodríguez. Vía principal: centro de carrilero + último pase de Zavala." },
      { id:"perdidas", label:"Mapa de pérdidas de balón", tipo:"red",
        grid:[[0.05,0.10,0.05],[0.15,0.20,0.15],[0.30,0.35,0.30],[0.50,0.45,0.50],[0.65,0.55,0.65],[0.50,0.60,0.55]],
        interp:"Perdemos sobre todo en CAMPO RIVAL y por las BANDAS: Cornejo 75, Salinas 74, Zavala 70, Johansen 73 balones perdidos (jugadores de riesgo/ataque). Ahí nacen las transiciones en contra — foco: cobertura y repliegue tras pérdida por el carril del carrilero." },
      { id:"aereos", label:"Duelos aéreos por jugador", tipo:"weakdef",
        interp:"Aéreo del equipo 53% (4º de la liga). FUERTES: Cornejo (68%) y Gazzolo (60%). FLOJOS: Salinas y Soza (48%) y sobre todo Cabrera (29%) → cuidar su lado al defender centros. Arriba, Pons (186 cm) es la referencia aérea ofensiva para balón parado y balón largo." },
      { id:"transiciones", label:"Transiciones / recuperaciones", tipo:"heat", color:"gold",
        grid:[[0.10,0.20,0.10],[0.25,0.40,0.30],[0.50,0.70,0.55],[0.45,0.55,0.50],[0.20,0.30,0.25],[0.05,0.10,0.05]],
        interp:"Recuperamos en el MEDIO: Camargo 86 recuperaciones, Galani 50, Cornejo 59 — bloque medio que roba en zonas 7-9. Cordero (3º de la liga en duelos defensivos) refuerza. Desde ahí, la salida a transición busca a los carrileros. Palanca: acelerar la 1ª decisión tras robo." }
    ],
    defensores: [
      { d:2,  n:"Gazzolo",  x:150, y:365, aer:60 },
      { d:26, n:"Soza",     x:110, y:372, aer:48 },
      { d:16, n:"Cornejo",  x:48,  y:250, aer:68 },
      { d:17, n:"Salinas",  x:252, y:250, aer:48 },
      { d:28, n:"Cabrera",  x:56,  y:308, aer:29 },
      { d:29, n:"Pons",     x:150, y:110, aer:null }
    ]
  }
};
