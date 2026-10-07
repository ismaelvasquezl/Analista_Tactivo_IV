// Datos decodificados de informes Hudl Wyscout (dato de evento oficial: xG, PPDA, redes de pase).
// Salto de calidad vs proxies CFDB/FBref/datalabs. NO editar a mano salvo al cargar nuevos informes.
const WYSCOUT = {
  fuente: "Hudl Wyscout — Informe Partido",
  actualizado: "2026-10-07",
  nota: "Dato de evento oficial. Único rival con cobertura Wyscout por ahora: Colo-Colo (5 partidos). Los demás usan proxies etiquetados.",
  equipos: {
    "Colo-Colo": {
      dt: "F. Ortiz",
      formacionBase: "3-4-2-1",
      nPartidos: 5,
      resumen: "Equipo de alta eficiencia de remate (no de dominio físico) que construye por el centro con Vidal y V. Méndez. Su rendimiento depende MUCHO de si alinea titulares o rota.",
      partidos: [
        { j: 19, fecha: "2026-08-16", rival: "O'Higgins",       loc: "L", gf: 2, ga: 2, xi: "Mixto",   xg: 1.79, xgRival: 0.83, pos: 59, ppda: 8.3,  duelos: 44, goles: ["50' Leandro Hernández", "77' Javier Correa"] },
        { j: 20, fecha: "2026-08-23", rival: "U. de Chile",      loc: "V", gf: 2, ga: 1, xi: "Titular", xg: 2.40, xgRival: 2.49, pos: 41, ppda: 9.3,  duelos: 47, goles: ["29' Á. Madrid", "53' Javier Correa"] },
        { j: 21, fecha: "2026-08-30", rival: "Audax Italiano",   loc: "L", gf: 5, ga: 1, xi: "Titular", xg: 3.16, xgRival: 1.40, pos: 59, ppda: 18.7, duelos: 45, goles: ["15' Correa", "31' Pastrán", "61' L. Hernández", "79' Correa", "82' L. Hernández"] },
        { j: 22, fecha: "2026-09-06", rival: "Huachipato",       loc: "V", gf: 0, ga: 0, xi: "Rotado",  xg: 2.21, xgRival: 0.98, pos: 77, ppda: 5.5,  duelos: 50, goles: [] },
        { j: 23, fecha: "2026-09-13", rival: "Concepción",       loc: "L", gf: 1, ga: 1, xi: "Rotado",  xg: 1.26, xgRival: 0.67, pos: 70, ppda: 7.4,  duelos: 45, goles: ["77' Fernando Martínez (en contra, a favor de CC)"] }
      ],
      // Red de pases (vs Audax): % de juego por carril + centralidad (combinaciones por jugador)
      redPases: {
        carriles: { izq: 19, centro: 60, der: 21 },
        enlaceTop: "Vidal ↔ V. Méndez (17 combinaciones, la más usada)",
        centralidad: [
          { n: "V. Méndez", d: 5, c: 80 }, { n: "Vidal", d: 23, c: 67 },
          { n: "Madrid", d: 8, c: 39 }, { n: "Villagra", d: 2, c: 36 },
          { n: "L. Hernández", d: 24, c: 36 }, { n: "Rojas", d: 28, c: 34 },
          { n: "Pastrán", d: 10, c: 34 }, { n: "Ulloa", d: 26, c: 31 },
          { n: "Sosa", d: 4, c: 31 }, { n: "Correa", d: 9, c: 14 }
        ]
      },
      jugadores: [
        { n: "Arturo Vidal", d: 23, rol: "Central-líbero · cerebro de salida", metr: "100 pases / 88% y 67 combos (vs Audax); 16 progresivos; gana 86% de duelos defensivos." },
        { n: "Víctor Méndez", d: 5, rol: "Pivote distribuidor", metr: "Mayor volumen: 104 pases / 81%, 80 combos. Asistió el 2º gol a U. de Chile con un centro." },
        { n: "Javier Correa", d: 9, rol: "Punta de referencia", metr: "Gol + xA constantes (0.93 y 0.59 xG). CAE MUCHO EN OFFSIDE: 3-4 por partido." },
        { n: "Á. Madrid", d: 8, rol: "Interior llegador (RCMF)", metr: "Gol a U. de Chile (0.80 xG) + asistencia a Audax (0.44 xA)." },
        { n: "Leandro Hernández", d: 24, rol: "Enganche llegador", metr: "Doblete vs Audax (0.80 xG). Ataca el área desde segunda línea." },
        { n: "L. Pastrán", d: 10, rol: "Enganche", metr: "1.09 xG y gol vs Audax (remate de 0.90 PsxG)." }
      ],
      fortalezas: [
        "Eficiencia y calidad de remate: ~2.16 xG/partido con picos de 3.16 (vs Audax).",
        "Salida limpia desde Vidal (88% de acierto, 16 progresivos) y distribución de V. Méndez.",
        "Llegada de segunda línea que define: Madrid, Leandro Hernández y Pastrán anotaron.",
        "Centros de V. Méndez a Correa y peligro de balón parado (córners rematados por Vidal/Madrid)."
      ],
      vulnerabilidades: [
        "NO gana los duelos: 44-50% en los 5 partidos; se les puede competir físico y por la 2ª pelota.",
        "Espacio a espalda de los carrileros Rojas/Ulloa: U. de Chile generó 2.49 xG por esos canales.",
        "Correa propenso al fuera de juego (3-4/partido): una línea de offside firme lo anula.",
        "Presión pasiva inicial cuando el rival sale a jugar (PPDA 25.2 en el 1T vs Audax).",
        "Con equipo rotado pierde contundencia: domina el balón (70-77%) pero no convierte."
      ],
      recomendaciones: [
        "Anticipar el XI: si Colo-Colo rota, un bloque bajo disciplinado lo frustra (Huachipato y Concepción empataron encerrados).",
        "Cerrar el carril central (60% de su juego) y poner pantalla sobre Vidal para cortar la 1ª progresión.",
        "Doblar la marca sobre Rojas/Ulloa para cortar los centros a Correa y cubrir su espalda.",
        "Marcar a los interiores llegadores (8, 24, 10) y defender la 2ª jugada de córner.",
        "Línea de offside firme vs Correa; disputar el duelo y atacar su balón parado (Coquimbo es 4º de la liga en córners)."
      ],
      // Validación cruzada de fuentes
      cross: {
        wyscout: { xgProm: 2.16, golProm: 2.0, posProm: 61.2, ppdaProm: 9.8, duelosProm: 46.2 },
        cfdb:    { gfpg: 2.09, gapg: 0.96, pts: 54, pos: 1 },
        datalabs2025: { posesion: 62, tiros: 16.23, pases: 83.97 },
        veredicto: "Triangulación consistente: xG Wyscout 2.16 ≈ goles CFDB 2.09/PJ; posesión Wyscout 61% ≈ datalabs 62%; pase ~81% ≈ 84%. Wyscout AÑADE lo que los agregados ocultan: la debilidad en duelos (46%) y el efecto rotación."
      },
      // Ilustraciones tácticas por zonas — grid 6 bandas (0=defensa propia … 5=finalización) × 3 columnas [izq,centro,der].
      // Intensidad 0..1 derivada de los informes Wyscout (DATO) + ubicación táctica (INFERENCIA). Mejorable con más partidos.
      // Lente Juego de Posición (Óscar Cano / FC Barcelona) en las interpretaciones.
      zonas: {
        nota: "Dirección de ataque: hacia arriba. Zonas sobre el modelo de 18 (6 bandas × 3 carriles). DATO Wyscout + INFERENCIA táctica.",
        capas: [
          { id: "creacion", label: "Origen de la creación", tipo: "heat", color: "gold",
            grid: [[0.10,0.60,0.10],[0.40,0.95,0.45],[0.25,0.85,0.30],[0.15,0.40,0.20],[0.10,0.25,0.15],[0.05,0.15,0.10]],
            interp: "La creación nace del EJE CENTRAL: Vidal (central-líbero) inicia y V. Méndez la ordena (el pivote baja como «tercer central», superioridad en primera línea — Juego de Posición puro). 60% del juego por el centro. Para cortarla: pantalla sobre Vidal y cerrar la línea de pase interior a Méndez." },
          { id: "pases", label: "Mapa de pases (red)", tipo: "net",
            interp: "Red de combinaciones: nodos = centralidad (toques), columna central cargada. El enlace Vidal↔Méndez es el más usado. Villagra/Sosa (centrales de fuera) son salidas secundarias; los carrileros Rojas/Ulloa dan la amplitud que abre la línea de pase interior." },
          { id: "pasesClave", label: "Pases clave (dónde se generan)", tipo: "heat", color: "gold",
            grid: [[0.00,0.05,0.00],[0.05,0.10,0.05],[0.10,0.30,0.10],[0.20,0.75,0.20],[0.25,0.90,0.30],[0.10,0.40,0.15]],
            interp: "Los pases clave NACEN DEL CENTRO (Z10→Z14): V. Méndez es la fuente (3 clave + 3 asist vs Audax), con Correa cayendo a recibir (2 clave) y Madrid de interior (1 clave, 2 asist). Casi no crean por banda. Cerrar la línea de Méndez hacia la Z14 y vigilar la caída de Correa seca su creación." },
          { id: "duelosPerdidos", label: "Duelos perdidos", tipo: "heat", color: "red",
            grid: [[0.05,0.10,0.05],[0.10,0.15,0.10],[0.20,0.30,0.20],[0.35,0.45,0.35],[0.55,0.60,0.55],[0.60,0.75,0.60]],
            interp: "Pierden más duelos en CAMPO RIVAL (duelos ofensivos 35-40% ganados; total 44-50% en los 5 partidos). No dominan el choque: Coquimbo puede competir la 2ª pelota, el juego aéreo y el duelo en el último tercio del rival." },
          { id: "perdidas", label: "Pérdidas de balón", tipo: "heat", color: "red",
            grid: [[0.05,0.10,0.05],[0.10,0.20,0.15],[0.30,0.50,0.35],[0.50,0.50,0.55],[0.60,0.50,0.85],[0.40,0.45,0.45]],
            interp: "Pierden sobre todo por los CARRILES de los carrileros (Rojas 21 y Ulloa 16 pérdidas vs Audax) y al progresar por el centro. Ahí nacen transiciones: si Coquimbo roba en esos pasillos, ataca una estructura estirada." },
          { id: "ataqueFinalizacion", label: "Ataque y finalización", tipo: "heat", color: "gold",
            grid: [[0.00,0.05,0.00],[0.05,0.10,0.05],[0.15,0.25,0.20],[0.30,0.45,0.35],[0.45,0.60,0.50],[0.40,0.95,0.50]],
            interp: "Atacan por centro y centro-derecha y FINALIZAN en zona central del área (Correa de referencia). El pico de peligro es el frontal/punto de penalti; los centros de V. Méndez buscan ahí. Defender el primer palo y la 2ª jugada de córner." },
          { id: "desprotegidas", label: "Zonas que dejan desprotegidas (al atacar)", tipo: "red",
            grid: [[0.30,0.15,0.30],[0.75,0.30,0.80],[0.80,0.40,0.85],[0.50,0.30,0.55],[0.20,0.15,0.25],[0.10,0.10,0.10]],
            interp: "INTERPRETACIÓN CLAVE: con los carrileros (Rojas/Ulloa) altos en 3-4-2-1, al atacar deja desprotegidos los PASILLOS a espalda de los carrileros y los MEDIOS-ESPACIOS junto a los centrales de fuera (Villagra der / Sosa izq). U. de Chile generó 2.49 xG por ahí. Plan Coquimbo: atacar al espacio detrás del carrilero en transición rápida y fijar a los centrales de fuera para abrir el medio-espacio (buscar profundidad a través de la anchura)." },
          { id: "debilidadDefensiva", label: "Debilidad defensiva (aérea) por jugador", tipo: "weakdef",
            interp: "DATO (2 partidos titulares): ROJO = débil en el aire. El punto flaco es VILLAGRA (RCB, 20% de duelos aéreos ganados) en el centro-derecha de su área, y el carril IZQUIERDO (Sosa 43%, Ulloa 40%). Vidal (60%) y Rojas (75%) son fuertes. El EQUIPO gana <50% de los aéreos. Plan Coquimbo: cargar córners y centros al centro-derecha del área (zona de Villagra) y al segundo palo izquierdo; buscar el duelo aéreo donde son flojos." }
        ],
        defensores: [
          { d: 4,  n: "Sosa",     x: 95,  y: 375, aer: 43 },
          { d: 23, n: "Vidal",    x: 150, y: 365, aer: 60 },
          { d: 2,  n: "Villagra", x: 205, y: 375, aer: 20 },
          { d: 26, n: "Ulloa",    x: 50,  y: 245, aer: 40 },
          { d: 28, n: "Rojas",    x: 250, y: 245, aer: 75 },
          { d: 25, n: "Maureira", x: 150, y: 430, aer: null }
        ],
        // nodos para la red de pases (coords viewBox 300×460, ataque hacia arriba) — tamaño ∝ centralidad vs Audax
        nodos: [
          { d: 25, n: "Maureira", x: 150, y: 430, c: 10 },
          { d: 4,  n: "Sosa",     x: 95,  y: 375, c: 31 },
          { d: 23, n: "Vidal",    x: 150, y: 365, c: 67 },
          { d: 2,  n: "Villagra", x: 205, y: 375, c: 36 },
          { d: 26, n: "Ulloa",    x: 50,  y: 245, c: 31 },
          { d: 5,  n: "V. Méndez",x: 130, y: 280, c: 80 },
          { d: 8,  n: "Madrid",   x: 175, y: 280, c: 39 },
          { d: 28, n: "Rojas",    x: 250, y: 245, c: 34 },
          { d: 10, n: "Pastrán",  x: 120, y: 190, c: 34 },
          { d: 24, n: "L. Hdez",  x: 185, y: 190, c: 36 },
          { d: 9,  n: "Correa",   x: 150, y: 105, c: 14 }
        ],
        edges: [[25,23,1],[25,4,1],[25,2,1],[23,5,3],[23,4,2],[23,2,2],[5,8,2],[5,10,2],[5,26,2],[8,24,2],[8,28,2],[10,9,1],[24,9,1],[5,24,1]]
      },
      // Balón parado (DATO Wyscout, 5 partidos) — ofensivo y defensivo + debilidad aérea.
      balonParado: {
        porPartido: [
          { rival: "O'Higgins",   cf: 9, cfRem: 3, caf: 4, cafRem: 1, aer: 28 },
          { rival: "U. de Chile", cf: 6, cfRem: 2, caf: 4, cafRem: 3, aer: 50 },
          { rival: "Audax",       cf: 4, cfRem: 1, caf: 6, cafRem: 3, aer: 46 },
          { rival: "Huachipato",  cf: 8, cfRem: 4, caf: 2, cafRem: 1, aer: 55 },
          { rival: "Concepción",  cf: 9, cfRem: 3, caf: 3, cafRem: 2, aer: 32 }
        ],
        ofensivo: {
          cornersProm: 7.2, pctRemate: 36, lanzador: "V. Méndez (córners) + sus centros",
          rematadores: "Vidal y Á. Madrid rematan tras córner",
          veredicto: "Genera MUCHO córner (7,2/partido) pero solo ~36% termina en remate: amenaza de volumen, baja conversión. Tiros libres poco productivos."
        },
        defensivo: {
          cornersContraProm: 3.8, pctRemateContra: 53, aerialTeamProm: 42,
          veredicto: "VULNERABLE defendiendo balón parado: aunque concede pocos córners (3,8/PJ), el 53% termina en remate y gana solo 42% de los duelos aéreos (28% vs O'Higgins). Explotable para Coquimbo, 4º de la liga en córners."
        },
        debilidadAerea: "Punto flaco aéreo: Villagra (RCB, 20% ganados) en el centro-derecha del área, y el carril izquierdo (Sosa 43%, Ulloa 40%). Vidal (60%) y Rojas (75%) son fuertes. Cargar al centro-derecha y segundo palo izquierdo."
      },
      pasesClave: {
        zona: "Centro, Z10 a Z14",
        leaders: [
          { n: "V. Méndez", d: 5, clave: 3, asist: 3 },
          { n: "Javier Correa", d: 9, clave: 2, asist: 2 },
          { n: "Á. Madrid", d: 8, clave: 1, asist: 2 },
          { n: "Joaquín Sosa", d: 4, clave: 1, asist: 1 }
        ],
        interp: "La creación de ocasiones pasa por el centro: V. Méndez es el generador principal de pases clave desde el pivote, Correa baja a recibir entre líneas (Z14) y Madrid llega de interior. Casi no generan por banda. Secar a Méndez y la caída de Correa reduce su peligro de creación."
      },
      arquero: {
        nombre: "G. Maureira", nota: "Titular en 3 de los 5 (Vózinha en los rotados).",
        inicio: "Inicia CORTO por el centro hacia Vidal y los centrales (84% de acierto de pase). Juego largo escaso y flojo: 58% de acierto en pases fuera del primer tercio. Cesión al arquero alta (22 en 3 partidos): el equipo juega a sus pies.",
        distribucion: { total: "69/58 (84%)", largo: "24/14 (58%)", cesiones: 22 },
        tirosEnContra: 11, goles: 5, paradas: 6, reflejo: 4, savePct: 55, aereos: "0/0", salidas: 7,
        falencias: [
          "NO sale a disputar centros: 0 duelos aéreos ganados/disputados en 3 partidos; solo reclama balones sueltos SIN oposición (2 'pedidas' vs U. de Chile, 2 vs O'Higgins, 0 vs Audax).",
          "Lo baten por el CENTRO: de los goles recibidos (n=4), la mayoría entraron bajo-centro y uno por arriba (un remate de 0.08 de xCG que debió atajar) → fallo de posicionamiento/reacción, no de palo.",
          "~55% de atajada sobre tiros al arco (6 paradas / 11 a puerta, 5 goles): bajo para un titular, y 4 de 6 paradas son de reflejo → llega tarde y reacciona.",
          "Pocas salidas como líbero (4/0/3): no cubre la espalda de la última línea alta."
        ],
        // Dónde lo baten (DATO goal-frame, n=4 goles → muestra chica): arco 3 columnas × 2 alturas.
        goalZones: { alto: [0.30, 0.60, 0.30], bajo: [0.40, 0.90, 0.40] },
        dondeRematar: "DATO (goles recibidos, n=4): lo baten por el CENTRO — sobre todo bajo-centro, y una vez por arriba. NO por las esquinas: su problema es posicional, no de un palo débil. Recomendado: remate raso y centrado a media altura, remate de primera al rebote, y probar el globo/remate alto (lo superaron arriba). Y lo más rentable: CARGAR CENTROS — no sale a disputarlos (0 aéreos).",
        perfilCentros: "¿Qué perfil es más débil para cortar centros o al salir? El dato no aísla un lado izq/der del arquero: su debilidad es que NO sale a disputar (0 aéreos; solo reclama balones sueltos). El peligro llegó por VOLUMEN de centros a la derecha-centro de Colo-Colo (Morales metió 7 vs U. de Chile) que acabaron en remate de cabeza — zona del aéreo-débil Villagra. Al salir, muestra insuficiente para un lado débil; el patrón es que no cubre la espalda de la línea alta.",
        fuente: "Wyscout — estadísticas de arquero, 3 partidos de Maureira (mapas de tiros al arco y de centros en contra revisados)."
      }
    }
  }
};

/* ============================================================================
 * PLANTILLA para añadir un rival cuando llegue su informe Hudl Wyscout.
 * Copiar dentro de WYSCOUT.equipos con la clave = nombre del club (coincide con
 * el fixture, ver ALIAS en lecturas_rivales.html). Con solo pegar este bloque, la
 * página del club renderiza sola: tabla de partidos, xG, red de pases, láminas de
 * zonas, balón parado y la capa de DEBILIDAD AÉREA por jugador. Rellenar solo lo
 * que el informe entregue; dejar lo que no haya como null/[] (no inventar).
 * ----------------------------------------------------------------------------
 * "Nombre Club": {
 *   dt:"", formacionBase:"", nPartidos:0, resumen:"",
 *   partidos:[{j,fecha,rival,loc,gf,ga,xi,xg,xgRival,pos,ppda,duelos,goles:[]}],
 *   redPases:{carriles:{izq,centro,der}, enlaceTop:"", centralidad:[{n,d,c}]},
 *   jugadores:[{n,d,rol,metr}], fortalezas:[], vulnerabilidades:[], recomendaciones:[],
 *   cross:{wyscout:{xgProm,golProm,posProm,ppdaProm,duelosProm}, cfdb:{}, datalabs2025:{}, veredicto:""},
 *   zonas:{ nota:"", capas:[ {id,label,tipo:"heat"|"red"|"net"|"weakdef",color,grid:[6x3],interp} ],
 *           nodos:[{d,n,x,y,c}], edges:[[d1,d2,w]],
 *           // debilidad aérea por jugador (ataque hacia arriba, defensa abajo):
 *           defensores:[{d,n,x,y,aer}] },  // aer = % duelos aéreos ganados; null si no hay dato
 *   balonParado:{ porPartido:[{rival,cf,cfRem,caf,cafRem,aer}],
 *     ofensivo:{cornersProm,pctRemate,lanzador,rematadores,veredicto},
 *     defensivo:{cornersContraProm,pctRemateContra,aerialTeamProm,veredicto},
 *     debilidadAerea:"" }
 * }
 * ==========================================================================*/
