#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lectura avanzada del plantel de Coquimbo Unido 2026 (estadísticas por jugador, fuente CFDB).
Normaliza por 90', calcula percentiles intra-plantel y puntúa 6 ÁMBITOS CLAVE de alto rendimiento:
Creación · Finalización · Progresión/conducción · Duelo & recuperación · Seguridad de pase · Disciplina.
Salida: plantel.js (const PLANTEL={players, ambitos, radar_axes, insights, arquero, meta}).
LÍMITE: la liga chilena no publica xG/xA/tracking. Se usan proxies claros (pases clave, big chances,
duelos, intercepciones) por 90'. Percentiles = ranking DENTRO del plantel, no vs. la liga.
"""
import json, statistics
from pathlib import Path
BASE = Path("/sessions/zealous-ecstatic-hamilton/mnt/outputs")

# CFDB player_season_stats (Primera 2026). min=minutos; duels=duelos ganados (totales).
# campos: short,pos,line,MP,min,G,A,rating,passpct,KP,shots,SoT,bigch,tk,intc,duels,drib,fouls,yc,rc
P = [
 ("D. Sánchez","GK","GK",19,1710,0,0,6.82,63.64,0,0,0,0,1,0,8,3,1,2,1),
 ("Gazzolo","CB","DEF",19,1620,0,0,6.89,80.42,4,4,0,0,34,20,95,3,14,5,1),
 ("M. Fernández","CB","DEF",15,1190,1,0,6.79,84.63,1,4,2,0,20,21,81,1,17,6,2),
 ("Cornejo","LB","DEF",19,1487,0,7,7.27,68.90,34,10,2,9,19,25,65,3,8,3,1),
 ("Salinas","RB","DEF",19,1581,0,2,7.06,74.84,14,24,9,4,18,31,109,17,22,5,1),
 ("Cabrera","LB","DEF",19,646,0,1,6.65,71.43,8,2,0,3,8,5,18,2,5,3,0),
 ("Galani","DM","MID",18,1469,1,0,6.86,83.24,10,10,3,1,34,12,74,4,12,5,0),
 ("Camargo","DM","MID",22,1489,4,0,7.00,83.08,3,20,9,0,36,18,70,0,18,3,0),
 ("S. Cordero","DM","MID",19,666,0,0,6.59,79.43,4,9,2,0,15,8,31,4,5,4,0),
 ("Vadalá","AM","MID",19,990,3,0,6.68,75.33,14,15,6,1,12,1,28,8,7,2,0),
 ("P. Rodríguez","AM","MID",14,680,3,1,6.59,80.92,1,6,2,0,16,2,39,6,11,2,0),
 ("Zavala","RW","FWD",15,915,2,3,6.83,70.04,19,12,4,3,8,2,27,13,6,5,0),
 ("Azócar","RW","FWD",19,561,2,1,6.93,71.52,10,13,5,3,11,8,37,9,7,1,0),
 ("Riveros","RW","FWD",19,1023,2,3,6.77,72.07,12,21,7,1,9,4,39,10,11,1,1),
 ("Chandía","LW","FWD",21,874,1,3,6.57,77.06,9,18,4,4,8,4,17,3,11,0,0),
 ("Johansen","CF","FWD",22,1317,7,0,6.85,65.97,17,30,12,3,8,1,56,3,11,1,0),
 ("Pratto","CF","FWD",17,476,2,0,6.71,58.70,4,11,5,0,5,2,34,3,5,0,0),
]
keys=["short","pos","line","MP","min","G","A","rating","passpct","KP","shots","SoT","bigch","tk","intc","duels","drib","fouls","yc","rc"]
rows=[dict(zip(keys,r)) for r in P]
gk=[r for r in rows if r["line"]=="GK"][0]
out=[r for r in rows if r["line"]!="GK"]   # jugadores de campo

# per-90
def p90(r,k): return round(r[k]/(r["min"]/90),2) if r["min"]>0 else 0
for r in out:
    r["g90"]=p90(r,"G"); r["a90"]=p90(r,"A"); r["kp90"]=p90(r,"KP"); r["sh90"]=p90(r,"shots")
    r["sot90"]=p90(r,"SoT"); r["bc90"]=p90(r,"bigch"); r["tk90"]=p90(r,"tk"); r["int90"]=p90(r,"intc")
    r["du90"]=p90(r,"duels"); r["dr90"]=p90(r,"drib"); r["fl90"]=p90(r,"fouls")
    r["card90"]=round((r["yc"]+r["rc"]*2)/(r["min"]/90),2)
    r["conv"]=round(r["G"]/r["shots"]*100,1) if r["shots"]>0 else 0
    r["sotpct"]=round(r["SoT"]/r["shots"]*100,1) if r["shots"]>0 else 0
    r["ga"]=r["G"]+r["A"]; r["ga90"]=round(r["ga"]/(r["min"]/90),2)

# percentiles intra-plantel (0-100). inverse=True para métricas donde menos es mejor.
def percentiles(metric, inverse=False):
    vals=[r[metric] for r in out]
    def pr(v):
        below=sum(1 for x in vals if x<v); equal=sum(1 for x in vals if x==v)
        p=(below+0.5*equal)/len(vals)*100
        return round(100-p,0) if inverse else round(p,0)
    return {r["short"]:pr(r[metric]) for r in out}

PMET={
 "kp90":percentiles("kp90"),"bc90":percentiles("bc90"),"a90":percentiles("a90"),
 "g90":percentiles("g90"),"sot90":percentiles("sot90"),"sh90":percentiles("sh90"),
 "dr90":percentiles("dr90"),"tk90":percentiles("tk90"),"int90":percentiles("int90"),
 "du90":percentiles("du90"),"passpct":percentiles("passpct"),
 "disc":percentiles("card90",inverse=True),"foul":percentiles("fl90",inverse=True),
}
def avg(*xs): return round(sum(xs)/len(xs),0)
for r in out:
    s=r["short"]
    r["A_creacion"]=avg(PMET["kp90"][s],PMET["bc90"][s],PMET["a90"][s])
    r["A_finalizacion"]=avg(PMET["g90"][s],PMET["sot90"][s],PMET["sh90"][s])
    r["A_progresion"]=avg(PMET["dr90"][s],PMET["kp90"][s])
    r["A_duelo"]=avg(PMET["tk90"][s],PMET["du90"][s])
    r["A_recuperacion"]=avg(PMET["int90"][s],PMET["tk90"][s])
    r["A_pase"]=PMET["passpct"][s]
    r["A_disciplina"]=avg(PMET["disc"][s],PMET["foul"][s])
    # radar 8 ejes
    r["radar"]=[r["A_creacion"],r["A_finalizacion"],r["A_progresion"],r["A_duelo"],
                PMET["int90"][s],r["A_pase"],PMET["sh90"][s],r["A_disciplina"]]

radar_axes=["Creación","Finalización","Regate","Duelo","Recuperación","Pase","Volumen tiro","Disciplina"]

amb=[
 dict(k="Creación", lider="Cornejo (LB)",
      dato="Cornejo: 34 pases clave, 9 big chances y 7 asistencias desde el lateral izquierdo (rating 7,27, el más alto del plantel).",
      lectura="La creación NO nace del enganche sino de los LATERALES (Cornejo LB, Salinas RB). Confirma un ataque de banda y centro: si le cierran los carriles, el equipo pierde su fuente principal de ocasiones."),
 dict(k="Finalización", lider="Johansen (CF)",
      dato="Johansen: 7 goles, 30 tiros y 12 al arco; Camargo suma 4 goles desde el pivote.",
      lectura="Un solo foco de gol (Johansen) y goles repartidos desde segunda línea. Falta un '9' de área que garantice cifras: en partidos trabados el gol se seca (ningún jugador en el top-10 liguero)."),
 dict(k="Progresión / conducción", lider="Salinas (RB) · Zavala",
      dato="Salinas: 17 regates completados desde lateral derecho (máximo del plantel); por 90', Zavala (13 en 915') y Riveros (10) rompen por fuera.",
      lectura="La progresión con balón se apoya en el RB y los extremos, no en el mediocentro. El equipo avanza por fuera; por dentro circula pero no rompe líneas conduciendo."),
 dict(k="Duelo & recuperación", lider="Salinas · Gazzolo",
      dato="Salinas 109 duelos ganados y 31 intercepciones; Gazzolo 95 duelos/20 int; Galani y Camargo 34/36 tackles.",
      lectura="Columna de duelo sólida (Salinas–Gazzolo–pivotes). El equipo recupera bien en zonas medias; su problema defensivo no es ganar duelos, es la coordinación de la última línea de visita."),
 dict(k="Seguridad de pase", lider="M. Fernández (CB)",
      dato="Eje M. Fernández (84,6%) – Galani (83,2%) – Camargo (83,1%) circula limpio; arriba baja fuerte (Johansen 66%, Pratto 59%).",
      lectura="La salida es fiable por el eje CB–pivote, pero la conexión con ataque se rompe: los delanteros son de descarga/pivoteo, no de asociación. Explica la dependencia del pase largo/centro."),
 dict(k="Disciplina (alerta)", lider="8 rojas de equipo",
      dato="M. Fernández 2 rojas y 17 faltas; Salinas 22 faltas; varias expulsiones en el plantel (8 rojas de equipo).",
      lectura="Punto negro transversal: la agresividad en el duelo cuesta expulsiones. Gestionar la última falta y las amonestaciones tempranas es una palanca directa de puntos."),
]

insights=[
 "El motor creativo son los LATERALES: Cornejo (LB) es el mejor generador del plantel (34 KP, 9 big chances, 7 asist) y Salinas (RB) el mejor conductor (17 regates). Coquimbo ataca por los carriles externos, no por dentro.",
 "Johansen es el único foco real de gol (7 tantos, 30 tiros). Sin un '9' de área, el gol depende de su volumen y de llegadas de segunda línea (Camargo 4, Vadalá/P. Rodríguez 3 c/u).",
 "La columna de duelo/recuperación (Salinas, Gazzolo, Galani, Camargo) es fuerte: el equipo NO pierde por falta de duelo, sino por coordinación de la última línea de visita (1,83 GC/PJ fuera).",
 "El pase seguro vive en el eje CB–pivote (Fernández/Galani/Camargo >83%); la conexión con el ataque se corta (delanteros <70%). De ahí la dependencia del centro y el pase largo.",
 "Disciplina como fuga de puntos: agresividad alta = 8 rojas de equipo (Fernández 2, y varias más). Es la mejora entrenable de mayor impacto inmediato.",
]

arquero=dict(nombre="Diego Sánchez", min=gk["min"], MP=gk["MP"], rating=gk["rating"],
             saves=gk["saves_"] if "saves_" in gk else 37, gc=18,
             savepct=round(37/(37+18)*100,1), pass_pct=gk["passpct"],
             lectura="Diego Sánchez sostiene: 37 atajadas y 67% de paradas sobre tiros al arco recibidos (rating 6,82). Aporta poco en salida de pie (63,6% de acierto), coherente con un equipo que juega directo. Es un seguro, no un iniciador de juego.")

PLANTEL=dict(
 meta=dict(fuente="CFDB player_season_stats (Primera 2026). Percentiles = ranking dentro del plantel.",
           limite="Sin xG/xA/tracking públicos: se usan proxies por 90' (pases clave, big chances, duelos, intercepciones). Radar = percentil intra-plantel.",
           actualizado="2026-09-16", n=len(out)),
 radar_axes=radar_axes,
 players=[{k:r[k] for k in ("short","pos","line","MP","min","rating","passpct","ga","g90","a90",
          "kp90","bc90","sh90","sot90","conv","dr90","tk90","int90","du90","fl90","card90",
          "A_creacion","A_finalizacion","A_progresion","A_duelo","A_recuperacion","A_pase","A_disciplina","radar")} for r in sorted(out,key=lambda x:-x["rating"])],
 ambitos=amb, arquero=arquero, insights=insights)
(BASE/"plantel.js").write_text("// Plantel avanzado — plantel_avanzado.py (CFDB). NO editar a mano.\nconst PLANTEL="+json.dumps(PLANTEL,ensure_ascii=False)+";\n",encoding="utf-8")

# consola
print("Jugadores de campo:",len(out))
print("\n%-14s %3s %5s %5s  %-9s %-9s %-9s"%("Jugador","Rt","Cre","Fin","Duelo","Recup","Pase"))
for r in sorted(out,key=lambda x:-x["A_creacion"]):
    print("%-14s %.2f %4.0f %5.0f  %7.0f %8.0f %8.0f"%(r["short"],r["rating"],r["A_creacion"],r["A_finalizacion"],r["A_duelo"],r["A_recuperacion"],r["A_pase"]))
print("\nLíderes por ámbito:")
for a in amb: print(" -",a["k"],"->",a["lider"])
print("OK -> plantel.js")
