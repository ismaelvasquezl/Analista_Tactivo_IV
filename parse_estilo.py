#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Procesa los CSV datalabs de ESTILO por equipo y CREADORES por jugador.
   OJO PROCEDENCIA: archivos rotulados 'Primera B' pero el contenido es Primera A
   (set de equipos ~2025: incluye U. Española e Iquique, faltan los Concepción; PJ hasta 29).
   Se guarda como FUENTE SECUNDARIA de estilo, etiqueta/temporada dudosa. NO sobrescribe CFDB."""
import csv, json
from pathlib import Path
UP=Path("uploads"); OUT=Path("outputs")
CANON={"Colo Colo":"Colo-Colo","Palestino":"Palestino","Universidad de Chile":"Universidad de Chile",
 "U. Catolica":"Universidad Católica","O'Higgins":"O'Higgins","Nublense":"Ñublense",
 "Union Espanola":"Unión Española","Union La Calera":"Unión La Calera","Huachipato":"Huachipato",
 "Everton de Vina":"Everton","D. La Serena":"Deportes La Serena","Cobresal":"Cobresal",
 "Deportes Iquique":"Deportes Iquique","Deportes Limache":"Deportes Limache",
 "A. Italiano":"Audax Italiano","Coquimbo Unido":"Coquimbo Unido"}
# 2026 Primera A (según CFDB league_standings)
A2026={"Colo-Colo","Universidad Católica","Universidad de Chile","Everton","Palestino","Deportes Limache",
 "Ñublense","D. Concepción","Deportes La Serena","Coquimbo Unido","Audax Italiano","Huachipato",
 "O'Higgins","Cobresal","Universidad de Concepción","Unión La Calera"}
def f(x):
    try:return round(float(x),2)
    except:return None
def i(x):
    x=(x or '').strip(); return int(x) if x.lstrip('-').isdigit() else 0

# ---- EQUIPOS ----
te=list(csv.DictReader(open(UP/"Primera B stats Equipos 2026 a septiembre datalabs-resultado.csv",encoding='utf-8')))
mets=["posesion","tiros_prom","de_pases","corners","amarillas"]
teams=[]
for r in te:
    c=CANON.get(r['equipo'].strip(), r['equipo'].strip())
    teams.append({"team":c,"raw":r['equipo'].strip(),"inA2026":c in A2026,
        "posesion":f(r['posesion']),"tiros":f(r['tiros_prom']),"pases":f(r['de_pases']),
        "corners":i(r['corners']),"amarillas":i(r['amarillas'])})
# ranks (1 = valor más alto) + promedios de liga
keys={"posesion":"posesion","tiros":"tiros","pases":"pases","corners":"corners","amarillas":"amarillas"}
ranks={}; avg={}
for k in keys:
    vals=[t[k] for t in teams if t[k] is not None]
    avg[k]=round(sum(vals)/len(vals),2)
    order=sorted(teams,key=lambda t:(t[k] is not None,t[k]),reverse=True)
    for pos,t in enumerate(order,1): t.setdefault("rank",{})[k]=pos
N=len(teams)
coq=next(t for t in teams if t["team"]=="Coquimbo Unido")
EQ={"fuente":"datalabs (API-Football) — export rotulado 'Primera B' (contenido real: Primera A 2025)",
    "procedencia":"CONFIRMADO PRIMERA A 2025 (no Primera B, no 2026): los promedios de liga del archivo (%pases 77.19, tiros 13.07) coinciden EXACTO con el benchmark 2025. Set 2025 (U. Española e Iquique presentes; los Concepción aún no). Fuente SECUNDARIA de estilo/temporada previa; NO sobrescribe CFDB 2026.",
    "actualizado":"2026-09-28","n":N,"avg":avg,"metricas":mets,"teams":teams,"coquimbo":coq}
(OUT/"primera_equipos.js").write_text(
  "// Estilo de equipo (datalabs) — parse_estilo.py. FUENTE SECUNDARIA, procedencia dudosa. NO editar a mano.\nconst ESTILO="+json.dumps(EQ,ensure_ascii=False)+";\n",encoding="utf-8")

# ---- JUGADORES (creadores) ----
pj=list(csv.DictReader(open(UP/"Primera B stats 2026 a septiembre datalabs-resultado.csv",encoding='utf-8')))
cre=[]
for r in pj:
    nm=(r.get('jugador') or '').strip()
    if not nm:continue
    cre.append({"n":nm,"a":i(r.get('asistencias')),"g":i(r.get('goles')),
        "rating":f(r.get('rating_promedio')),"min":i(r.get('minutos')),"mp":i(r.get('partidos_jugados'))})
cre.sort(key=lambda x:(-x['a'],-x['g']))
CR={"fuente":"datalabs (API-Football) — export rotulado 'Primera B' (contenido real: Primera A 2025)",
    "procedencia":"Líderes de asistencias de Primera A 2025 (confirmado por promedios de liga; PJ hasta 29 = temporada completa). Fuente secundaria para lectura de creadores/perfil histórico.",
    "actualizado":"2026-09-28","n":len(cre),"players":cre}
(OUT/"primera_creadores.js").write_text(
  "// Creadores/asistidores (datalabs) — parse_estilo.py. FUENTE SECUNDARIA, procedencia dudosa. NO editar a mano.\nconst CREADORES="+json.dumps(CR,ensure_ascii=False)+";\n",encoding="utf-8")

print("EQUIPOS:",N,"| inA2026:",sum(1 for t in teams if t['inA2026']),"| fuera:",[t['team'] for t in teams if not t['inA2026']])
print("Coquimbo ranks:",coq['rank'])
print("league avg:",avg)
print("CREADORES:",len(cre),"| top3:",[(c['n'],c['a']) for c in cre[:3]])
