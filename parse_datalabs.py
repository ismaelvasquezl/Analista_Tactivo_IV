#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parseo de los CSV por jugador de datalabs (API-Football) — 16 equipos Campeonato 2026.
Segunda fuente (NO sobrescribe CFDB). Aporta métricas nuevas: rating API-Football y
partidos_ganados (=> win% con el jugador en cancha). Salida: datalabs.js.
"""
import csv, glob, json, unicodedata, re
from pathlib import Path
UP = Path("/sessions/zealous-ecstatic-hamilton/mnt/uploads")
OUT = Path("/sessions/zealous-ecstatic-hamilton/mnt/outputs")

TEAMMAP = {
 "Coquimbo_Unido":"Coquimbo Unido","Colo_colo":"Colo-Colo","UdeChile":"Universidad de Chile",
 "UdeConcepcion":"Universidad de Concepción","UCalera":"Unión La Calera","UCatolica":"Universidad Católica",
 "Palestino":"Palestino","ohiggins":"O'Higgins","ñublense":"Ñublense","Huachipato":"Huachipato",
 "Everton":"Everton","Deportes_Limache":"D. Limache","D_LaSerena":"Deportes La Serena",
 "Deportes_Concepcion":"D. Concepción","Cobresal":"Cobresal","Audax_Italiano":"Audax Italiano"}

def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z ]','',s).strip()

def to_int(x):
    x=(x or '').strip(); return int(x) if x.isdigit() else 0
def to_f(x):
    try: return round(float(x),2)
    except: return None

players=[]
for f in sorted(glob.glob(str(UP/"2026_*_Campeonato_Chileno_datalabs-resultado.csv"))):
    fn=Path(f).name
    key=fn.replace("2026_","").replace("_Campeonato_Chileno_datalabs-resultado.csv","")
    if key not in TEAMMAP:      # los archivos de liga agregada (sin equipo) se saltan
        continue
    team=TEAMMAP[key]
    for r in csv.DictReader(open(f, encoding='utf-8')):
        nm=(r.get('jugador') or '').strip()
        if not nm: continue
        mp=to_int(r.get('partidos_jugados')); mg=to_int(r.get('partidos_ganados'))
        players.append(dict(
            team=team, n=nm, nkey=norm(nm),
            surname=norm(nm).split()[-1] if norm(nm) else '',
            g=to_int(r.get('goles')), a=to_int(r.get('asistencias')),
            ratingAPI=to_f(r.get('rating_promedio')), min=to_int(r.get('minutos')),
            mp=mp, mg=mg, winpct=(round(mg/mp*100) if mp else None)))

DATA=dict(fuente="bartidata.com/datalabs (API-Football)",
          nota="Segunda fuente por jugador (rating API-Football, minutos, PJ, partidos ganados con el jugador). Difiere de CFDB en rating/minutos: se muestra como contraste, no reemplaza a CFDB.",
          actualizado="2026-09-23", players=players)
(OUT/"datalabs.js").write_text("// Datalabs (API-Football) por jugador — parse_datalabs.py. Segunda fuente. NO editar a mano.\nconst DATALABS="+json.dumps(DATA,ensure_ascii=False)+";\n",encoding="utf-8")

print(f"equipos: {len(set(p['team'] for p in players))} | jugadores: {len(players)}")
# sanity: comparación rating API vs CFDB para Coquimbo (top por minutos)
coq=sorted([p for p in players if p['team']=='Coquimbo Unido'],key=lambda p:-p['min'])[:6]
print("\nCoquimbo (API-Football): jugador | ratingAPI | min | PJ | ganados | win%")
for p in coq: print(f"  {p['n']:<20} {p['ratingAPI']}  {p['min']:>5}  {p['mp']:>2}  {p['mg']:>2}  {p['winpct']}%")
print("OK -> datalabs.js")
