"""
Ingestor de TABLAS FINALES por temporada -> rendimiento_temporadas.json

Alimenta la base con las tablas oficiales que exportes/pegues (ANFP, FBref,
ESPN, Soccerway) como CSV o .xls (HTML). Aplica las reglas de validación del
encargo y no inventa datos: lo que no venga en la tabla queda null.

CSV/XLS esperado (una fila por equipo, encabezados flexibles):
    Equipo, Pos, Pts, PJ, PG, PE, PP, GF, GC
    (acepta variantes EN: Team, Pos, Pts, Pld/MP, W, D, L, GF, GA)

Uso:
    python ingest_standings.py  tabla_2024.csv  2024  [--map map_equipos.csv]

Validaciones aplicadas:
    PJ == PG+PE+PP            (si no, marca INCONSISTENTE)
    DG  = GF-GC              (se calcula)
    rendimiento% = Pts/(PJ*3)*100
    Cruce de nombres de equipo -> id_equipo (equipos_base.json)
"""
from __future__ import annotations
import sys, json, re, unicodedata
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).parent
BASE = json.load(open(ROOT / "equipos_base.json", encoding="utf8"))

def norm(s):
    s = ''.join(c for c in unicodedata.normalize('NFD', str(s)) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', s.lower())

# índice nombre->id desde equipos_base (nombre completo, abreviado y apodo)
NAME2ID = {}
for e in BASE["equipos"]:
    for k in (e["nombre_completo"], e["nombre_abreviado"], e["id_equipo"]):
        NAME2ID[norm(k)] = e["id_equipo"]

COLMAP = {  # variantes -> canónico
    'equipo':'Equipo','team':'Equipo','club':'Equipo',
    'pos':'Pos','posicion':'Pos','posición':'Pos','#':'Pos',
    'pts':'Pts','puntos':'Pts',
    'pj':'PJ','pld':'PJ','mp':'PJ','j':'PJ',
    'pg':'PG','w':'PG','g':'PG',
    'pe':'PE','d':'PE','e':'PE',
    'pp':'PP','l':'PP','p':'PP',
    'gf':'GF',
    'gc':'GC','ga':'GC',
}

def read_table(path):
    p = Path(path)
    if p.suffix.lower() in ('.xls', '.xlsx', '.html', '.htm'):
        df = pd.read_html(path)[0]
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [c[-1] for c in df.columns]
    else:
        df = pd.read_csv(path)
    df.columns = [COLMAP.get(str(c).strip().lower(), str(c).strip()) for c in df.columns]
    return df

def match_id(name):
    n = norm(name)
    if n in NAME2ID: return NAME2ID[n]
    for k, v in NAME2ID.items():          # match parcial
        if k and (k in n or n in k): return v
    return None

def run(table_path, temporada, out=ROOT / "rendimiento_temporadas.json"):
    df = read_table(table_path)
    doc = json.load(open(out, encoding="utf8"))
    rows = [r for r in doc["rendimiento"] if r["temporada"] != temporada]  # reemplaza la temporada
    added, issues = 0, []
    for _, r in df.iterrows():
        if 'Equipo' not in r or pd.isna(r.get('Equipo')): continue
        eid = match_id(r['Equipo'])
        if not eid:
            issues.append(f"SIN_ID: '{r['Equipo']}'"); continue
        def gi(k):
            v = r.get(k)
            return None if v is None or pd.isna(v) else int(v)
        pj, pg, pe, pp = gi('PJ'), gi('PG'), gi('PE'), gi('PP')
        gf, gc, pts, pos = gi('GF'), gi('GC'), gi('Pts'), gi('Pos')
        estado = "VERIFICADO"
        if None not in (pj, pg, pe, pp) and pj != pg + pe + pp:
            estado = "INCONSISTENTE_PJ"; issues.append(f"{eid}: PJ({pj})!=PG+PE+PP({pg+pe+pp})")
        dg = (gf - gc) if None not in (gf, gc) else None
        rend = round(pts / (pj * 3) * 100, 2) if None not in (pts, pj) and pj else None
        rows.append(dict(id_equipo=eid, temporada=temporada, posicion_final=pos, puntos=pts,
            pj=pj, pg=pg, pe=pe, pp=pp, gf=gf, gc=gc, dg=dg, rendimiento_porcentaje=rend,
            goles_por_partido_local=None, goles_por_partido_visita=None, goles_contra_por_partido=None,
            posesion_promedio=None, precision_pases=None, tiros_por_partido=None, tiros_puerta_por_partido=None,
            amarillas_total=None, rojas_total=None, faltas_por_partido=None,
            racha_invicta_max=None, racha_ganadora_max=None, racha_perdedora_max=None, racha_sin_ganar_max=None,
            asistencia_promedio=None, asistencia_total=None, asistencia_max_partido=None, asistencia_min_partido=None,
            estado_validacion=estado))
        added += 1
    doc["rendimiento"] = sorted(rows, key=lambda x: (x["temporada"], x["posicion_final"] or 99))
    json.dump(doc, open(out, "w", encoding="utf8"), ensure_ascii=False, indent=2)
    print(f"[{temporada}] {added} equipos cargados y validados -> {out.name}")
    if issues:
        print("  Avisos:"); [print("   -", i) for i in issues]

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("uso: python ingest_standings.py <tabla.csv|.xls> <temporada>"); sys.exit(1)
    run(sys.argv[1], sys.argv[2])
