#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scouting de liga — Coquimbo Unido 2026 (fuente CFDB player_stat_leaders + player_season_stats).
Sugiere >=3 candidatos por puesto en las MÉTRICAS donde Coquimbo está bajo, con scoring compuesto
(percentil normalizado por métrica relevante, ponderado) y comparación vs nuestro titular actual.
Salida: scouting.js (const SCOUTING={...}).
LÍMITE HONESTO: cobertura = Primera División. CFDB no expone métricas avanzadas por jugador de
Primera B (Segunda) vía sus rankings, así que NO se inventan candidatos de Segunda. El "índice de
encaje" usa el acumulado de temporada; una versión ponderada por forma (últimas 5) requiere datos
partido a partido (mejora futura). Se reejecuta al re-extraer líderes -> el scouting se actualiza.
"""
import json
from pathlib import Path
BASE = Path("/sessions/zealous-ecstatic-hamilton/mnt/outputs")

# candidatos: (n, team, min, mp, g, a, rating, pass, kp, sh, sot, bc, tk, intc, du, dr, fl, yc, rc)
K=["n","team","min","mp","g","a","rating","pass","kp","sh","sot","bc","tk","intc","du","dr","fl","yc","rc"]
def mk(*v): return dict(zip(K,v))
POOL={
 "CF":[mk("Jorge Sáez","U. La Calera",1593,18,9,1,7.13,59.80,7,40,15,1,21,5,82,7,11,2,0),
       mk("Nelson Da Silva","Palestino",1225,17,9,2,7.03,62.60,11,46,19,1,7,1,82,7,19,3,1),
       mk("Arnaldo Castillo","O'Higgins",1562,22,8,0,6.96,68.07,12,47,24,4,8,4,91,7,28,5,0)],
 "AM":[mk("Matías Plaza","Ñublense",1345,22,2,5,7.18,80.53,35,26,7,3,37,14,86,18,17,3,0),
       mk("Bryan Carvallo","Cobresal",1194,21,1,5,7.09,82.65,43,21,6,3,17,9,67,17,15,1,0),
       mk("Matías Palavecino","U. Católica",1268,21,2,6,7.17,81.10,29,30,11,10,13,5,57,21,10,3,1)],
 "CB":[mk("Enzo Ferrario","Audax Italiano",1791,20,1,0,6.94,85.23,2,7,1,0,32,19,114,7,14,3,0),
       mk("Rafael Caroca","Huachipato",1890,21,1,0,6.90,89.80,3,13,4,1,28,32,97,1,13,3,0),
       mk("Franco Bechtholdt","Cobresal",1381,20,0,0,6.69,84.24,0,4,0,0,37,22,79,1,21,4,1)],
 "DM":[mk("Francis Mac Allister","Deportes La Serena",1683,20,0,0,6.78,77.48,2,8,0,0,44,25,88,5,13,7,1),
       mk("Jhojan Valencia","U. Católica",1456,21,0,0,6.85,86.04,10,10,2,0,42,19,73,9,30,7,0),
       mk("Felipe Ogaz","O'Higgins",1746,22,1,1,6.93,85.10,12,5,2,1,39,32,77,3,20,4,0)],
}
# titular actual de Coquimbo (baseline) por puesto: (nombre, headline metric value)
BASE_INC={
 "CF":dict(nombre="Johansen", g90=round(7/(1317/90),2), conv=round(7/30*100,1)),
 "AM":dict(nombre="Vadalá", kp90=round(14/(990/90),2)),
 "CB":dict(nombre="Gazzolo", int90=round(20/(1620/90),2), duel90=round(95/(1620/90),2), passpct=80.4),
 "DM":dict(nombre="Camargo", tk90=round(36/(1489/90),2), int90=round(18/(1489/90),2)),
}
NEED={
 "CF":dict(titulo="Delantero centro goleador", porque="Ningún jugador de Coquimbo en el top-10 de la liga; el gol depende solo de Johansen (0,48 g/90). Falta un '9' que garantice cifras.", metrica="goles por 90'", ref=f"Johansen {BASE_INC['CF']['g90']} g/90"),
 "AM":dict(titulo="Enganche creador (por dentro)", porque="La creación nace de los laterales (Cornejo), no del enganche. Nuestros AM aportan poco pase clave central.", metrica="pases clave por 90'", ref=f"Vadalá {BASE_INC['AM']['kp90']} PC/90"),
 "CB":dict(titulo="Central de solidez y salida", porque="Fragilidad de visita (1,83 GC/PJ). Se busca un central que sume intercepción, duelo y pase seguro para blindar la última línea.", metrica="intercepciones por 90' + % pase", ref=f"Gazzolo {BASE_INC['CB']['int90']} int/90, {BASE_INC['CB']['passpct']}% pase"),
 "DM":dict(titulo="Pivote recuperador", porque="Para proteger la línea de fondo de visita se necesita un volante de marca de alto volumen de recuperación.", metrica="entradas + intercepciones por 90'", ref=f"Camargo {BASE_INC['DM']['tk90']} tk/90"),
}
# métricas relevantes y pesos por puesto (para el índice de encaje)
WEIGHTS={
 "CF":{"g90":.40,"sot90":.25,"conv":.20,"bc90":.15},
 "AM":{"kp90":.40,"bc90":.25,"a90":.20,"dr90":.15},
 "CB":{"int90":.30,"du90":.30,"tk90":.20,"pass":.20},
 "DM":{"tk90":.35,"int90":.25,"du90":.20,"pass":.20},
}
HEADLINE={"CF":("g90","g/90"),"AM":("kp90","PC/90"),"CB":("int90","int/90"),"DM":("tk90","tk/90")}

def per90(p):
    m=p["min"]/90
    p["g90"]=round(p["g"]/m,2); p["a90"]=round(p["a"]/m,2); p["kp90"]=round(p["kp"]/m,2)
    p["sh90"]=round(p["sh"]/m,2); p["sot90"]=round(p["sot"]/m,2); p["bc90"]=round(p["bc"]/m,2)
    p["tk90"]=round(p["tk"]/m,2); p["int90"]=round(p["intc"]/m,2); p["du90"]=round(p["du"]/m,2)
    p["dr90"]=round(p["dr"]/m,2); p["fl90"]=round(p["fl"]/m,2)
    p["conv"]=round(p["g"]/p["sh"]*100,1) if p["sh"] else 0
    p["card90"]=round((p["yc"]+2*p["rc"])/m,2)

def build_group(pos):
    cands=POOL[pos]
    for p in cands: per90(p)
    w=WEIGHTS[pos]; keys=list(w)
    # min-max por métrica dentro del pool
    rng={k:(min(p[k] for p in cands),max(p[k] for p in cands)) for k in keys}
    def norm(p,k):
        lo,hi=rng[k]; return 50 if hi==lo else round((p[k]-lo)/(hi-lo)*100)
    for p in cands:
        p["fit"]=round(sum(w[k]*norm(p,k) for k in keys))
        hk,hu=HEADLINE[pos]; p["headline"]=hu; p["headline_val"]=p[hk]
        # razón + standout
        best=max(keys,key=lambda k:w[k]*norm(p,k))
        LB={"g90":"goles/90","sot90":"tiros al arco/90","conv":"conversión","bc90":"big chances/90",
            "kp90":"pases clave/90","a90":"asistencias/90","dr90":"regates/90","int90":"intercepciones/90",
            "du90":"duelos ganados/90","tk90":"entradas/90","pass":"% de pase"}
        p["standout"]=LB[best]
    cands.sort(key=lambda p:-p["fit"])
    # delta vs titular en la métrica headline
    for p in cands:
        if pos=="CF": d=p["g90"]-BASE_INC["CF"]["g90"]; base=f"Johansen {BASE_INC['CF']['g90']}"
        elif pos=="AM": d=p["kp90"]-BASE_INC["AM"]["kp90"]; base=f"Vadalá {BASE_INC['AM']['kp90']}"
        elif pos=="CB": d=p["int90"]-BASE_INC["CB"]["int90"]; base=f"Gazzolo {BASE_INC['CB']['int90']}"
        else: d=p["tk90"]-BASE_INC["DM"]["tk90"]; base=f"Camargo {BASE_INC['DM']['tk90']}"
        p["delta"]=round(d,2); p["delta_txt"]=f"{'+' if d>=0 else ''}{round(d,2)} vs {base}"
    return cands

def card(p):
    return {k:p[k] for k in ("n","team","mp","min","rating","pass","g","a","fit","headline","headline_val",
            "standout","delta_txt","g90","a90","kp90","sh90","sot90","conv","bc90","tk90","int90","du90","dr90","card90")}

grupos=[]
for pos in ["CF","AM","CB","DM"]:
    cands=build_group(pos)
    grupos.append(dict(pos=pos, need=NEED[pos], baseline=BASE_INC[pos], candidatos=[card(p) for p in cands]))

# tendencias / impacto (lectura de alto rendimiento)
tendencias=[
 "El mercado de '9' en la liga tiene dos perfiles: killers de volumen (Da Silva 3,4 tiros/90, 0,66 g/90) y definidores eficientes (Sáez 22% conversión). Coquimbo, que crea por banda, se beneficia más de un rematador de volumen dentro del área.",
 "La creación central de élite está en equipos que no pelean arriba (Carvallo en Cobresal 3,2 PC/90; Palavecino en UC con 10 big chances): oportunidad de mercado — talento creativo en clubes de media/baja tabla.",
 "Los mejores centrales por intercepción+pase (Caroca 89,8% pase y 1,5 int/90; Ferrario 5,7 duelos/90) están en equipos que igual conceden mucho: el dato individual separa al jugador del contexto de su equipo.",
 "En pivotes recuperadores, el volumen de entradas suele venir con costo disciplinario (Mac Allister 7A+1R); Ogaz combina recuperación alta (32 int) con mejor disciplina: perfil más 'limpio'.",
]
impacto=[
 dict(t="Prioridad 1 · un '9' de volumen", d="El techo goleador hoy depende de un solo jugador (Johansen 0,48 g/90). Un delantero tipo Da Silva (0,66 g/90, 3,4 tiros/90) elevaría la producción sin cambiar el estilo de centros."),
 dict(t="Prioridad 2 · creación por dentro", d="Sumar un enganche como Carvallo (3,2 PC/90) o Palavecino (10 big chances) reduciría la dependencia de los laterales y daría una segunda vía de gol en partidos trabados."),
 dict(t="Prioridad 3 · blindaje de la última línea", d="Para la fragilidad de visita, un central-interceptor con salida limpia (Caroca) o un pivote como Ogaz (32 int, buena disciplina) atacan directamente la causa de los goles fuera de casa."),
 dict(t="Método de decisión", d="Cada candidato trae un índice de encaje (0-100) y su diferencia vs nuestro titular en la métrica objetivo: la administración prioriza por impacto sobre la necesidad, no por nombre."),
]

SCOUT=dict(
 meta=dict(fuente="CFDB player_stat_leaders + player_season_stats (Primera División 2026, DATO).",
           metodo="Índice de encaje = percentil normalizado (min-max) por métrica relevante del puesto, ponderado. Excluye jugadores de Coquimbo (son la línea base).",
           limite="Cobertura: Primera División. CFDB no expone métricas avanzadas por jugador de Primera B (Segunda) vía sus rankings — no se inventan candidatos de Segunda. Índice sobre acumulado de temporada; forma reciente (últimas 5) es mejora futura (requiere datos por partido).",
           actualizado="2026-09-17"),
 grupos=grupos, tendencias=tendencias, impacto=impacto)
(BASE/"scouting.js").write_text("// Scouting de liga — scouting.py (CFDB). NO editar a mano.\nconst SCOUTING="+json.dumps(SCOUT,ensure_ascii=False)+";\n",encoding="utf-8")

# consola
for g in grupos:
    print("\n==",g["pos"],"·",g["need"]["titulo"],"==")
    for c in g["candidatos"]:
        print(f"  fit {c['fit']:3d}  {c['n']:20s} {c['team']:18s} {c['headline_val']} {c['headline']}  ({c['delta_txt']})  destaca: {c['standout']}")
print("\nOK -> scouting.js")
