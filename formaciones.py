#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XI probable por POSICIÓN REAL — Coquimbo + 7 rivales de liga (fuente CFDB team_squad).
Regla: NO se inventan posiciones. Cada jugador se coloca solo en la posición que registra en CFDB.
Selección: titulares recientes (jugadores vistos en el último partido del equipo). Coquimbo por minutos.
Salida: formaciones.js (const FORMACIONES={coquimbo, rivales{...}, meta}).
"""
import json
from pathlib import Path
BASE = Path("/sessions/zealous-ecstatic-hamilton/mnt/outputs")

# XI por posición real (CFDB). pos ∈ GK,CB,LB,RB,DM,CM,AM,SS,LW,RW,CF
XI = {
 "Coquimbo Unido":dict(nota="4-2-1-3 · XI por minutos jugados (CFDB).", dt="Hernán Caputto", xi=[
   ("D. Sánchez","GK"),("Salinas","RB"),("Gazzolo","CB"),("M. Fernández","CB"),("Cornejo","LB"),
   ("Camargo","DM"),("Galani","DM"),("Vadalá","AM"),("Riveros","RW"),("Chandía","LW"),("Johansen","CF")]),
 "Colo-Colo":dict(nota="XI reciente; Vidal y Correa rotaron en la última fecha.", dt=None, xi=[
   ("Villanueva","GK"),("J. Rojas","RB"),("Olguín","CB"),("B. Torres","CB"),("Wiemberg","LB"),
   ("V. Méndez","DM"),("Alarcón","DM"),("Madrid","CM"),("Marchant","RW"),("Pastrán","LW"),("Romero","CF")]),
 "Ñublense":dict(nota="XI reciente (racha de 4 derrotas).", dt=None, xi=[
   ("H. Muñoz","GK"),("Sanhueza","RB"),("Salomon","CB"),("Campos","CB"),("Campusano","LB"),
   ("Céspedes","DM"),("L. Reyes","DM"),("I. Tapia","AM"),("Ovelar","RW"),("Molina","LW"),("Jeraldino","CF")]),
 "U. La Calera":dict(nota="XI reciente; colista, arriesga.", dt=None, xi=[
   ("N. Espinoza","GK"),("Ch. Díaz","RB"),("Salomoni","CB"),("Palma","CB"),("Gutiérrez","LB"),
   ("Andía","DM"),("R. Pérez","DM"),("J. Cruz","AM"),("A. Méndez","RW"),("Hiriart","LW"),("Sáez","CF")]),
 "Audax Italiano":dict(nota="XI reciente; Pinares como faro creativo.", dt=None, xi=[
   ("Garrido","GK"),("O. Rojas","RB"),("Monreal","CB"),("Ferrario","CB"),("F. Salomoni","LB"),
   ("Sandoval","DM"),("Zenteno","DM"),("Pinares","AM"),("Uribe","RW"),("Fuentes","LW"),("Pizarro","CF")]),
 "Everton":dict(nota="XI reciente; Medina (SS) enganche-goleador.", dt=None, xi=[
   ("Kirkman","GK"),("Opazo","RB"),("Oyarzún","CB"),("Vega","CB"),("Baeza","LB"),
   ("Berríos","DM"),("Charrupí","CM"),("Medina","SS"),("Alfaro","RW"),("B. Martínez","LW"),("Palacios","CF")]),
 "D. Limache":dict(nota="XI reciente; Castro (13 goles) por izquierda.", dt=None, xi=[
   ("Dutra","GK"),("Escobar","RB"),("Parot","CB"),("Aguirre","CB"),("J. Rojas","LB"),
   ("Fuentes","DM"),("Galletto","DM"),("Valencia","AM"),("V. Álvarez","RW"),("Castro","LW"),("Sosa","CF")]),
 "O'Higgins":dict(nota="XI reciente.", dt=None, xi=[
   ("Carreño","GK"),("Morales","RB"),("Robledo","CB"),("Movillo","CB"),("L. Díaz","LB"),
   ("Ogaz","DM"),("Leiva","CM"),("Toloza","AM"),("J. Tapia","RW"),("Yañez","LW"),("Bou","CF")]),
}

def place(xi):
    byp=lambda P:[p for p in xi if p[1] in P]
    out=[]
    # GK
    for n,_ in byp(["GK"]): out.append((n,"GK",50,7))
    # línea defensiva (LB, CBs, RB) en y=24
    lb=byp(["LB"]); rb=byp(["RB"]); cb=byp(["CB"])
    xs_cb={1:[50],2:[38,62],3:[30,50,70]}.get(len(cb),[50])
    if lb: out.append((lb[0][0],"LB",13,24))
    for i,(n,_) in enumerate(cb): out.append((n,"CB",xs_cb[i] if i<len(xs_cb) else 50,24))
    if rb: out.append((rb[0][0],"RB",87,24))
    # doble/simple pivote (DM) y=39
    dm=byp(["DM"]); xs_dm={1:[50],2:[36,64]}.get(len(dm),[50])
    for i,(n,_) in enumerate(dm): out.append((n,"DM",xs_dm[i] if i<len(xs_dm) else 50,39))
    # CM y=49
    cm=byp(["CM"]); xs_cm={1:[50],2:[36,64],3:[28,50,72]}.get(len(cm),[50])
    for i,(n,_) in enumerate(cm): out.append((n,"CM",xs_cm[i] if i<len(xs_cm) else 50,49))
    # AM/SS y=61
    am=byp(["AM","SS"]); xs_am={1:[50],2:[38,62]}.get(len(am),[50])
    for i,(n,pp) in enumerate(am): out.append((n,pp,xs_am[i] if i<len(xs_am) else 50,61))
    # ataque: LW/RW/CF y=80
    for n,_ in byp(["LW"]): out.append((n,"LW",17,79))
    for n,_ in byp(["RW"]): out.append((n,"RW",83,79))
    cf=byp(["CF"]); xs_cf={1:[50],2:[40,60]}.get(len(cf),[50])
    for i,(n,_) in enumerate(cf): out.append((n,"CF",xs_cf[i] if i<len(xs_cf) else 50,82))
    return out

def formation_label(xi):
    c=lambda P:sum(1 for p in xi if p[1] in P)
    d=c(["CB","LB","RB"]); mid=c(["DM","CM"]); attm=c(["AM","SS"]); fw=c(["LW","RW","CF"])
    return (f"{d}-{mid}-{attm}-{fw}" if attm else f"{d}-{mid}-{fw}")

def build(name):
    d=XI[name]; pl=place(d["xi"])
    return dict(nombre=name, dt=d.get("dt"), nota=d["nota"], formation=formation_label(d["xi"]),
                players=[dict(n=n,pos=pos,x=x,y=y) for (n,pos,x,y) in pl])

FORM=dict(
 meta=dict(fuente="CFDB team_squad (posición real de cada jugador) + titularidad reciente. Coquimbo por minutos.",
           limite="No se inventan posiciones: cada ficha ocupa solo la posición registrada en CFDB. XI probable, no confirmado (sin parte oficial de alineación).",
           actualizado="2026-09-16"),
 coquimbo=build("Coquimbo Unido"),
 rivales={k:build(k) for k in XI if k!="Coquimbo Unido"})
(BASE/"formaciones.js").write_text("// Formaciones por posición real — formaciones.py (CFDB). NO editar a mano.\nconst FORMACIONES="+json.dumps(FORM,ensure_ascii=False)+";\n",encoding="utf-8")

for k in [ "Coquimbo Unido","Colo-Colo","Everton","O'Higgins"]:
    b=build(k); print(f"{k:16s} {b['formation']:9s} ({len(b['players'])} jug)")
print("OK -> formaciones.js")
