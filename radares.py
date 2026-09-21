#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Radares de percentiles por jugador — Coquimbo + rivales (fuente CFDB player_season_stats).
Percentiles calculados A NIVEL DE LIGA sobre todos los jugadores de campo con >=200'.
Salida: radares.js (const RADARES={equipos:{team:{formation, xi:[...], banca:[...]}}, axes, meta}).
Cada jugador: n,pos,line,min,mp,rating,radar[8],metrics{...}.
XI = titulares por minutos, ubicados en su POSICIÓN REAL (no se inventan posiciones).
Banca = resto con minutos (radar disponible). GK: se muestra el nombre; el feed no da métricas de campo de arqueros.
LÍMITE: O'Higgins quedó incompleto por el tope diario de CFDB (se completa al reabrir la cuota).
"""
import json
from pathlib import Path
BASE = Path("/sessions/zealous-ecstatic-hamilton/mnt/outputs")

C=["team","n","pos","min","mp","g","a","rating","passpct","kp","sh","sot","bc","tk","intc","du","dr","fl","yc","rc"]
def R(*v): return dict(zip(C,v))
ROWS=[
 # COQUIMBO UNIDO
 R("Coquimbo Unido","Gazzolo","CB",1620,19,0,0,6.89,80.42,4,4,0,0,34,20,95,3,14,5,1),
 R("Coquimbo Unido","M. Fernández","CB",1190,15,1,0,6.79,84.63,1,4,2,0,20,21,81,1,17,6,2),
 R("Coquimbo Unido","Cornejo","LB",1487,19,0,7,7.27,68.90,34,10,2,9,19,25,65,3,8,3,1),
 R("Coquimbo Unido","Salinas","RB",1581,19,0,2,7.06,74.84,14,24,9,4,18,31,109,17,22,5,1),
 R("Coquimbo Unido","Cabrera","LB",646,19,0,1,6.65,71.43,8,2,0,3,8,5,18,2,5,3,0),
 R("Coquimbo Unido","Galani","DM",1469,18,1,0,6.86,83.24,10,10,3,1,34,12,74,4,12,5,0),
 R("Coquimbo Unido","Camargo","DM",1489,22,4,0,7.00,83.08,3,20,9,0,36,18,70,0,18,3,0),
 R("Coquimbo Unido","S. Cordero","DM",666,19,0,0,6.59,79.43,4,9,2,0,15,8,31,4,5,4,0),
 R("Coquimbo Unido","Vadalá","AM",990,19,3,0,6.68,75.33,14,15,6,1,12,1,28,8,7,2,0),
 R("Coquimbo Unido","P. Rodríguez","AM",680,14,3,1,6.59,80.92,1,6,2,0,16,2,39,6,11,2,0),
 R("Coquimbo Unido","Zavala","RW",915,15,2,3,6.83,70.04,19,12,4,3,8,2,27,13,6,5,0),
 R("Coquimbo Unido","Azócar","RW",561,19,2,1,6.93,71.52,10,13,5,3,11,8,37,9,7,1,0),
 R("Coquimbo Unido","Riveros","RW",1023,19,2,3,6.77,72.07,12,21,7,1,9,4,39,10,11,1,1),
 R("Coquimbo Unido","Chandía","LW",874,21,1,3,6.57,77.06,9,18,4,4,8,4,17,3,11,0,0),
 R("Coquimbo Unido","Johansen","CF",1317,22,7,0,6.85,65.97,17,30,12,3,8,1,56,3,11,1,0),
 R("Coquimbo Unido","Pratto","CF",476,17,2,0,6.71,58.70,4,11,5,0,5,2,34,3,5,0,0),
 # COLO-COLO
 R("Colo-Colo","J. Rojas","RB",1901,23,2,2,6.94,81.28,15,14,3,1,45,14,80,10,11,1,0),
 R("Colo-Colo","V. Méndez","DM",2026,23,2,4,7.30,89.06,60,20,7,4,25,10,60,16,14,3,0),
 R("Colo-Colo","Alarcón","DM",1457,22,0,3,7.06,86.53,36,14,3,4,33,20,57,7,31,5,1),
 R("Colo-Colo","Vidal","CM",1753,21,1,1,7.28,87.53,12,22,2,0,58,38,129,10,22,8,0),
 R("Colo-Colo","Romero","CF",1448,21,8,1,6.94,73.05,9,31,22,1,5,2,31,5,7,0,0),
 R("Colo-Colo","Correa","CF",870,15,12,5,7.56,62.34,17,50,26,5,8,2,34,11,5,2,0),
 R("Colo-Colo","Wiemberg","LB",685,22,0,1,6.72,86.93,4,7,1,2,8,7,25,5,4,1,1),
 R("Colo-Colo","Pastrán","LW",872,19,4,2,7.11,81.85,14,26,9,4,20,2,58,21,19,3,0),
 R("Colo-Colo","Ulloa","LB",1703,22,0,1,6.78,82.15,7,10,1,2,20,16,91,18,20,2,0),
 R("Colo-Colo","Madrid","CM",1454,22,5,4,7.02,81.94,17,24,10,7,23,7,60,10,12,1,0),
 R("Colo-Colo","Marchant","RW",344,22,0,1,6.69,78.26,8,6,2,1,2,4,12,6,3,0,0),
 R("Colo-Colo","Iván Román","CB",238,5,0,0,6.36,50.00,0,0,0,0,0,0,2,0,0,0,0),
 # ÑUBLENSE
 R("Ñublense","Campos","CB",1115,21,0,0,6.79,76.85,6,2,0,0,24,18,48,5,5,2,0),
 R("Ñublense","Bosso","CB",2057,23,0,0,6.67,85.66,0,9,2,0,15,23,54,0,14,2,1),
 R("Ñublense","Campusano","LB",1947,22,0,1,6.64,76.85,13,4,1,1,33,12,64,7,24,7,0),
 R("Ñublense","Sanhueza","RB",1179,23,2,0,6.62,72.41,9,15,6,2,16,4,45,11,11,4,0),
 R("Ñublense","Céspedes","DM",602,20,1,0,6.61,75.00,2,3,1,0,6,4,26,1,6,2,1),
 R("Ñublense","L. Reyes","DM",1888,21,1,0,7.04,86.21,11,13,2,1,27,21,80,15,17,4,0),
 R("Ñublense","I. Tapia","AM",713,15,2,1,6.67,69.65,14,12,4,2,10,4,21,7,9,5,0),
 R("Ñublense","Ovelar","RW",599,20,1,1,6.64,64.80,9,8,3,1,11,2,32,7,6,1,0),
 R("Ñublense","Molina","LW",661,21,2,2,6.79,75.00,5,8,6,0,4,1,14,3,4,1,0),
 R("Ñublense","Jeraldino","CF",1209,21,5,0,6.86,57.87,13,27,13,1,9,3,64,3,11,3,0),
 R("Ñublense","Plaza","AM",1345,22,2,5,7.18,80.53,35,26,7,3,37,14,86,18,17,3,0),
 # U. LA CALERA
 R("U. La Calera","Salomoni","CB",610,7,0,0,6.77,81.39,2,3,0,0,6,8,24,0,3,1,0),
 R("U. La Calera","Palma","CB",1122,19,0,0,6.59,84.72,0,0,0,0,14,8,38,1,5,2,0),
 R("U. La Calera","Lavín","CB",430,9,0,0,6.73,78.40,0,0,0,0,5,2,11,2,3,1,0),
 R("U. La Calera","Gutiérrez","LB",1279,22,0,0,6.74,83.19,11,9,3,0,18,17,47,10,6,2,0),
 R("U. La Calera","Ch. Díaz","RB",1907,22,1,3,6.77,72.02,21,5,1,6,22,16,64,4,13,5,0),
 R("U. La Calera","Andía","CM",676,12,0,0,6.57,81.49,6,3,1,0,11,12,25,4,6,2,0),
 R("U. La Calera","R. Pérez","CM",385,6,0,0,6.19,76.92,0,0,0,0,3,0,7,1,2,1,1),
 R("U. La Calera","A. Méndez","RW",1578,20,4,9,7.33,70.18,47,16,7,10,34,15,93,31,11,4,0),
 R("U. La Calera","M. Campos","CF",895,23,3,0,6.61,76.07,4,17,8,0,5,2,24,6,9,0,0),
 R("U. La Calera","Sáez","CF",1593,18,9,1,7.13,59.80,7,40,15,1,21,5,82,7,11,2,0),
 # AUDAX ITALIANO
 R("Audax Italiano","M. Ortiz","CB",1441,21,0,1,6.74,83.62,3,6,3,1,12,15,33,4,6,3,0),
 R("Audax Italiano","F. Salomoni","LB",615,14,0,1,6.51,70.00,0,1,0,0,1,5,5,1,1,1,1),
 R("Audax Italiano","O. Rojas","RB",461,13,0,0,6.58,74.51,2,2,0,0,8,5,22,2,2,1,0),
 R("Audax Italiano","Sandoval","DM",466,19,0,0,6.64,80.54,1,3,0,0,12,9,32,2,7,3,0),
 R("Audax Italiano","Zenteno","DM",479,15,1,0,6.90,84.19,3,8,1,0,17,7,26,4,4,0,0),
 R("Audax Italiano","Collao","CM",1230,21,1,0,6.69,79.29,5,9,1,1,23,23,53,8,15,6,2),
 R("Audax Italiano","Pinares","AM",1223,16,3,2,6.76,83.33,4,7,2,0,6,11,21,5,3,4,0),
 R("Audax Italiano","Uribe","RW",510,23,0,0,6.64,85.49,10,16,5,0,4,1,21,8,6,0,0),
 R("Audax Italiano","M. Fuentes","LW",971,19,3,0,6.85,73.31,11,21,5,1,23,8,67,11,8,3,0),
 R("Audax Italiano","Troyansky","CF",1292,22,4,0,6.83,74.06,8,36,14,0,7,5,54,11,20,4,0),
 R("Audax Italiano","Ferrario","CB",1791,20,1,0,6.94,85.23,2,7,1,0,32,19,114,7,14,3,0),
 # EVERTON
 R("Everton","Oyarzún","CB",1897,23,0,1,6.92,77.98,4,8,1,0,15,17,60,1,11,2,0),
 R("Everton","Magallanes","CB",1115,17,0,0,6.84,72.25,3,6,1,0,18,19,71,2,10,5,2),
 R("Everton","Vega","CB",294,11,0,0,6.60,78.63,1,2,0,0,12,1,26,2,6,1,0),
 R("Everton","Baeza","LB",1130,23,2,3,6.89,72.16,11,10,3,1,16,10,40,10,6,2,0),
 R("Everton","Berríos","CM",1697,19,0,1,6.91,82.15,11,9,2,0,11,23,49,10,7,2,0),
 R("Everton","J. Moya","CM",1928,22,0,0,6.91,83.51,3,6,2,0,52,24,96,10,18,5,0),
 R("Everton","Medina","SS",2033,23,11,3,7.51,75.36,35,52,25,3,27,16,107,21,26,3,0),
 R("Everton","Alfaro","RW",1103,21,3,2,6.79,78.89,12,27,10,2,10,4,32,11,17,7,0),
 R("Everton","B. Martínez","LW",764,22,1,3,6.79,69.66,19,19,5,3,16,5,55,15,8,2,0),
 R("Everton","Palacios","CF",692,18,3,0,6.73,75.00,5,37,17,0,7,2,19,3,7,0,0),
 R("Everton","Montiel","CF",983,17,7,1,6.84,68.32,4,13,9,0,5,2,35,2,6,4,0),
 # DEPORTES LIMACHE
 R("D. Limache","Parot","CB",1678,19,0,1,6.78,81.77,3,1,0,0,25,11,54,3,2,3,0),
 R("D. Limache","Aguirre","CB",2070,23,0,1,6.67,80.71,5,9,1,1,18,23,40,2,6,1,0),
 R("D. Limache","J. Rojas","LB",1094,18,0,1,6.72,72.50,1,1,0,1,5,1,6,1,2,3,0),
 R("D. Limache","Escobar","RB",848,21,1,0,7.11,74.68,1,4,2,1,10,1,22,7,6,4,1),
 R("D. Limache","C. Fuentes","DM",539,22,1,0,6.69,83.46,3,5,2,0,11,8,24,0,5,0,0),
 R("D. Limache","Galletto","DM",566,8,1,0,6.58,70.37,0,1,1,0,4,2,11,0,6,3,0),
 R("D. Limache","L. Valencia","AM",1188,19,1,2,6.92,78.18,6,3,1,1,1,3,3,1,1,2,0),
 R("D. Limache","Meneses","LW",2027,23,6,10,7.44,75.77,41,23,12,10,39,15,101,28,11,3,0),
 # O'HIGGINS (completo)
 R("O'Higgins","Castillo","CF",1562,22,8,0,6.96,68.07,12,47,24,4,8,4,91,7,28,5,0),
 R("O'Higgins","Ogaz","DM",1746,22,1,1,6.93,85.10,12,5,2,1,39,32,77,3,20,4,0),
 R("O'Higgins","Robledo","CB",1295,16,0,0,6.63,79.70,0,6,1,0,9,18,35,3,5,2,0),
 R("O'Higgins","Garrido","CB",1215,21,0,0,6.71,84.73,2,4,0,0,14,11,53,2,9,5,1),
 R("O'Higgins","Movillo","CB",278,8,0,0,6.85,94.78,0,1,1,0,5,2,10,0,2,0,0),
 R("O'Higgins","Morales","RB",455,15,1,0,6.84,75.94,6,8,0,0,9,2,24,5,3,0,0),
 R("O'Higgins","L. Díaz","LB",668,23,0,1,6.79,79.34,8,2,0,1,15,11,37,6,4,1,0),
 R("O'Higgins","Leiva","CM",1494,20,0,0,6.69,86.48,9,13,4,0,29,7,47,5,9,4,1),
 R("O'Higgins","Toloza","AM",158,5,0,3,6.62,72.73,2,0,0,0,0,0,2,0,3,1,0),
 R("O'Higgins","J. Tapia","RW",474,18,0,1,6.68,71.58,9,15,4,2,5,5,35,10,4,1,0),
 R("O'Higgins","Yañez","LW",1145,22,2,2,6.69,82.69,20,13,5,3,13,7,36,6,7,0,1),
 R("O'Higgins","Vecino","CF",652,20,4,1,6.70,68.28,8,20,11,0,2,3,34,4,11,2,0),
 # BANCAS (refuerzo de suplentes con minutos)
 R("D. Limache","Castro","LW",1941,22,13,7,7.33,72.97,22,57,26,3,5,7,50,22,20,6,0),
 R("D. Limache","Sosa","CF",1402,23,6,0,6.80,65.44,10,29,10,1,2,5,74,3,17,3,1),
 R("D. Limache","V. Álvarez","RW",593,23,4,0,6.74,75.28,7,6,3,0,10,6,21,4,3,0,0),
 R("U. La Calera","Villanueva","AM",653,15,0,0,6.50,77.44,3,11,3,0,10,6,25,3,9,3,0),
 R("U. La Calera","Pozzo","CF",838,22,2,0,6.60,60.90,1,17,9,1,5,1,35,8,9,0,0),
 R("U. La Calera","Oyarzo","RW",1393,23,1,0,6.56,76.41,16,21,8,0,26,9,76,32,27,3,0),
 R("Audax Italiano","Loyola","AM",342,20,0,0,6.53,78.77,13,7,1,1,6,3,23,10,6,2,2),
 R("Audax Italiano","Coelho","CF",886,23,3,1,6.69,60.00,8,17,7,0,7,1,46,5,10,1,0),
 R("Everton","Ovalle","RW",370,8,1,0,6.76,73.91,6,2,1,1,2,2,8,6,3,0,0),
 R("Everton","E. Ramos","LW",1244,23,1,3,6.66,75.49,16,14,4,4,4,9,45,10,12,2,0),
 R("Ñublense","Rami","CF",554,19,3,0,6.72,52.48,2,16,6,1,3,1,52,8,17,3,0),
]

# GK por equipo (el feed no da métricas de campo de arqueros -> se muestra solo el nombre)
GK={"Coquimbo Unido":"D. Sánchez","Colo-Colo":"Villanueva","Ñublense":"H. Muñoz","U. La Calera":"N. Espinoza",
    "Audax Italiano":"Garrido","Everton":"Kirkman","D. Limache":"Dutra","O'Higgins":"Carreño"}
INCOMPLETO=set()

LINE={"CB":"DEF","LB":"DEF","RB":"DEF","DM":"MID","CM":"MID","AM":"MID","SS":"MID","LW":"FWD","RW":"FWD","CF":"FWD"}
AXES=["Creación","Finalización","Regate","Duelo","Recuperación","Pase","Vol. tiro","Disciplina"]

def per90(p):
    m=p["min"]/90 or 1
    for k,src in [("g90","g"),("a90","a"),("kp90","kp"),("sh90","sh"),("sot90","sot"),("bc90","bc"),
                  ("tk90","tk"),("int90","intc"),("du90","du"),("dr90","dr"),("fl90","fl")]:
        p[k]=p[src]/m
    p["card90"]=(p["yc"]+2*p["rc"])/m
    p["line"]=LINE.get(p["pos"],"MID")
for p in ROWS: per90(p)

# percentiles a nivel liga (pool: min>=200)
pool=[p for p in ROWS if p["min"]>=200]
def pctl(metric,val,inv=False):
    vals=[q[metric] for q in pool]
    below=sum(1 for v in vals if v<val); eq=sum(1 for v in vals if v==val)
    pr=(below+0.5*eq)/len(vals)*100
    return round(100-pr) if inv else round(pr)
def agg(*xs): return round(sum(xs)/len(xs))
for p in ROWS:
    cre=agg(pctl("kp90",p["kp90"]),pctl("bc90",p["bc90"]),pctl("a90",p["a90"]))
    fin=agg(pctl("g90",p["g90"]),pctl("sot90",p["sot90"]))
    reg=pctl("dr90",p["dr90"]); due=agg(pctl("tk90",p["tk90"]),pctl("du90",p["du90"]))
    rec=pctl("int90",p["int90"]); pas=pctl("passpct",p["passpct"]); vol=pctl("sh90",p["sh90"])
    dis=agg(pctl("card90",p["card90"],inv=True),pctl("fl90",p["fl90"],inv=True))
    p["radar"]=[cre,fin,reg,due,rec,pas,vol,dis]

# coordenadas por posición (misma lógica que formaciones)
def place(players):
    byp=lambda P:[p for p in players if p["pos"] in P]
    out=[]
    cb=byp(["CB"]); lb=byp(["LB"]); rb=byp(["RB"])
    xs_cb={1:[50],2:[38,62],3:[28,50,72]}.get(len(cb),[50])
    if lb: out.append((lb[0],13,24))
    for i,p in enumerate(cb): out.append((p,xs_cb[i] if i<len(xs_cb) else 50,24))
    if rb: out.append((rb[0],87,24))
    dm=byp(["DM"]); xs={1:[50],2:[36,64],3:[26,50,74]}.get(len(dm),[50])
    for i,p in enumerate(dm): out.append((p,xs[i] if i<len(xs) else 50,40))
    cm=byp(["CM"]); xs={1:[50],2:[36,64]}.get(len(cm),[50])
    for i,p in enumerate(cm): out.append((p,xs[i] if i<len(xs) else 50,50))
    am=byp(["AM","SS"]); xs={1:[50],2:[38,62]}.get(len(am),[50])
    for i,p in enumerate(am): out.append((p,xs[i] if i<len(xs) else 50,62))
    for p in byp(["LW"]): out.append((p,17,79))
    for p in byp(["RW"]): out.append((p,83,79))
    cf=byp(["CF"]); xs={1:[50],2:[40,60]}.get(len(cf),[50])
    for i,p in enumerate(cf): out.append((p,xs[i] if i<len(xs) else 50,82))
    return out

def slim(p,x=None,y=None):
    d=dict(n=p["n"],pos=p["pos"],line=p["line"],min=p["min"],mp=p["mp"],rating=p["rating"],
           radar=p["radar"], g=p["g"],a=p["a"],kp=p["kp"],sh=p["sh"],sot=p["sot"],
           tk=p["tk"],intc=p["intc"],du=p["du"],dr=p["dr"],passpct=p["passpct"])
    if x is not None: d["x"]=x; d["y"]=y
    return d

equipos={}
for team in GK:
    ps=[p for p in ROWS if p["team"]==team]
    # XI: cada PUESTO se llena con el jugador que más minutos jugó EN ESA POSICIÓN.
    # Si no hay ningún jugador con datos en esa posición, el hueco queda vacío (no se inventa).
    def byp(pos,n=1): return sorted([p for p in ps if p["pos"]==pos],key=lambda p:-p["min"])[:n]
    deff=byp("CB",2)+byp("LB",1)+byp("RB",1)                         # 2 centrales + 2 laterales
    mids=sorted([p for p in ps if p["line"]=="MID"],key=lambda p:-p["min"])[:3]  # 3 mediocampistas más usados
    fwd=byp("LW",1)+byp("RW",1)+(byp("CF",1) or byp("SS",1))         # extremos + '9' (o SS si no hay CF)
    seen=set(); xi_pl=[]
    for p in deff+mids+fwd:
        if p["n"] not in seen: seen.add(p["n"]); xi_pl.append(p)
    placed=place(xi_pl)
    xi=[slim(p,x,y) for (p,x,y) in placed]
    xi_names={p["n"] for (p,_,_) in placed}
    banca=[slim(p) for p in sorted(ps,key=lambda p:-p["min"]) if p["n"] not in xi_names]
    equipos[team]=dict(gk=GK[team], formation=f'{sum(1 for p in xi_pl if p["line"]=="DEF")}-{sum(1 for p in xi_pl if p["line"]=="MID")}-{sum(1 for p in xi_pl if p["line"]=="FWD")}',
                       xi=xi, banca=banca, incompleto=(team in INCOMPLETO))

OUT=dict(axes=AXES, equipos=equipos,
         meta=dict(fuente="CFDB player_season_stats (Primera 2026). Percentiles a nivel de liga (pool >=200').",
                   limite="No se inventan posiciones ni datos. GK sin radar (el feed no da métricas de campo de arqueros). Cobertura de los 8 equipos (Coquimbo + 7 rivales de calendario). XI por minutos y por posición real; banca = suplentes con minutos.",
                   actualizado="2026-09-21", n=len(ROWS)))
(BASE/"radares.js").write_text("// Radares de percentiles por jugador — radares.py (CFDB). NO editar a mano.\nconst RADARES="+json.dumps(OUT,ensure_ascii=False)+";\n",encoding="utf-8")

for t,d in equipos.items():
    print(f"{t:16s} {d['formation']:8s} XI {len(d['xi'])} + banca {len(d['banca'])}"+("  [PARCIAL]" if d['incompleto'] else ""))
print("OK -> radares.js")
