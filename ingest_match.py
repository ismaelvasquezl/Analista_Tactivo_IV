#!/usr/bin/env python3
"""
INGEST DE PARTIDO — Centro de Análisis Coquimbo Unido
=====================================================
Procesa los player stats (.xls de FBref) de UN partido y, en un solo paso:
  1) recalcula la fila del partido en  fixtures.js
  2) regenera  ultimo_partido.js  con el detalle individual de ambos equipos

Los KPIs, la tendencia, el fixture y los gráficos del artefacto se recalculan
solos al recargar index.html (leen fixtures.js / ultimo_partido.js).

USO
---
  python ingest_match.py --coq COQ_players.xls --opp RIVAL_players.xls --meta meta.json
  (opcional)  --gk-coq COQ_gk.xls  --gk-opp RIVAL_gk.xls  --dir .

meta.json (los datos que NO están en los player stats):
{
  "date": "2026-08-23", "time": "12:00", "comp": "LIG", "ronda": "Matchweek 20",
  "ven": "A", "opp": "D. Concepción", "ref": "Franco Jiménez",
  "form": "4-1-4-1", "oppForm": "4-4-2",
  "goles": [
    {"min":"7'",  "jug":"Alejandro Camargo", "eq":"COQ", "nota":"0-1"},
    {"min":"62'", "jug":"Ariel Cáceres",     "eq":"DCO", "nota":"asist. Cavalleri; 1-1"}
  ]
}

Notas:
- El equipo Coquimbo se detecta por apellidos conocidos; el otro archivo es el rival.
- Idempotente: si ya existe una fila con la misma fecha+rival en fixtures.js, la reemplaza.
- No toca las tablas narrativas de reportes.js (esas se editan a mano si cambian
  los promedios de temporada; los KPIs numéricos del artefacto sí se recalculan).
"""
from __future__ import annotations
import argparse, json, math, re, sys
from pathlib import Path
import pandas as pd

COQ_SURNAMES = {"Sánchez", "Sanchez", "Zavala", "Cornejo", "Camargo", "Gazzolo",
                "Cordero", "Soza", "Chandía", "Chandia", "Johansen", "Vadalá",
                "Vadala", "Azócar", "Azocar", "Rodríguez", "Hernández", "Cabrera", "Pons"}

def _fix(s):
    if not isinstance(s, str): return s
    try: return s.encode("latin1").decode("utf8")
    except Exception: return s

def _flat(df):
    cols = []
    for c in df.columns:
        c = " ".join(str(x) for x in c if "Unnamed" not in str(x)).strip() if isinstance(c, tuple) else str(c)
        c = re.sub(r"^(Performance|Playing Time) ", "", c)
        cols.append(c)
    df.columns = cols
    return df

def read_players(path):
    df = _flat(pd.read_html(path)[0])
    df["Player"] = df["Player"].map(_fix)
    for c in df.columns:
        if c not in ("Player", "Nation", "Pos", "#", "Age"):
            df[c] = pd.to_numeric(df[c], errors="coerce")
    return df[~df["Player"].astype(str).str.contains("Player|Total", na=False)].copy()

def is_coquimbo(df):
    names = " ".join(df["Player"].astype(str))
    return sum(s in names for s in COQ_SURNAMES) >= 2

def I(x):
    return 0 if (x is None or (isinstance(x, float) and math.isnan(x))) else int(x)

def team_totals(df):
    g = lambda c: I(df[c].sum()) if c in df.columns else 0
    return dict(sh=g("Sh"), sot=g("SoT"), gls=g("Gls"), ast=g("Ast"),
                cy=g("CrdY"), cr=g("CrdR"), fls=g("Fls"), crs=g("Crs"),
                intc=g("Int"), tklw=g("TklW"))

def player_rows(df):
    out = []
    for _, r in df.iterrows():
        out.append(dict(n=r["Player"], pos=r.get("Pos", ""), min=I(r.get("Min")),
                        sh=I(r.get("Sh")), sot=I(r.get("SoT")), g=I(r.get("Gls")), a=I(r.get("Ast")),
                        cy=I(r.get("CrdY")), cr=I(r.get("CrdR")), fls=I(r.get("Fls")),
                        crs=I(r.get("Crs")), tklw=I(r.get("TklW")), intc=I(r.get("Int"))))
    return sorted(out, key=lambda x: -x["min"])

def load_js_array(path, varname):
    txt = Path(path).read_text(encoding="utf8")
    m = re.search(rf"const\s+{varname}\s*=\s*(\[.*\]|\{{.*\}})\s*;", txt, re.S)
    return json.loads(m.group(1)) if m else None

def write_js(path, varname, obj):
    Path(path).write_text(f"const {varname}=" + json.dumps(obj, ensure_ascii=False) + ";",
                          encoding="utf8")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--coq", help="player stats .xls de Coquimbo (autodetecta si se omite)")
    ap.add_argument("--opp", help="player stats .xls del rival")
    ap.add_argument("--files", nargs=2, help="dos .xls (Coquimbo y rival, en cualquier orden)")
    ap.add_argument("--meta", required=True, help="meta.json con fecha/comp/ven/opp/ref/form/goles")
    ap.add_argument("--gk-coq"); ap.add_argument("--gk-opp")
    ap.add_argument("--dir", default=".", help="carpeta con fixtures.js / ultimo_partido.js")
    a = ap.parse_args()

    paths = a.files if a.files else [a.coq, a.opp]
    if not all(paths):
        sys.exit("Indica --coq y --opp, o --files A.xls B.xls")
    dfa, dfb = read_players(paths[0]), read_players(paths[1])
    coq_df, opp_df = (dfa, dfb) if is_coquimbo(dfa) else (dfb, dfa)

    meta = json.loads(Path(a.meta).read_text(encoding="utf8"))
    ct, ot = team_totals(coq_df), team_totals(opp_df)
    gf = ct["gls"]; ga = ot["gls"]
    res = "W" if gf > ga else "L" if gf < ga else "D"

    d = Path(a.dir)
    # 1) fixtures.js
    fx = load_js_array(d / "fixtures.js", "FIXTURES") or []
    row = dict(date=meta["date"], time=meta.get("time"), comp=meta.get("comp", "LIG"),
               ronda=meta.get("ronda"), ven=meta.get("ven", "H"), opp=meta["opp"],
               res=res, gf=gf, ga=ga, poss=meta.get("poss"), att=meta.get("att"),
               cap=meta.get("cap"), form=meta.get("form"), oppForm=meta.get("oppForm"),
               ref=meta.get("ref"), shf=ct["sh"], sof=ct["sot"], sha=ot["sh"], soa=ot["sot"],
               cy=ct["cy"], cr=ct["cr"], fls=ct["fls"], crs=ct["crs"], intc=ct["intc"], tklw=ct["tklw"])
    fx = [x for x in fx if not (x.get("date") == row["date"] and x.get("opp") == row["opp"])]
    fx.append(row)
    fx.sort(key=lambda x: (x.get("date") or "", 0 if x.get("comp") == "LIG" else 1))
    write_js(d / "fixtures.js", "FIXTURES", fx)

    # 2) ultimo_partido.js
    ult = dict(rival=meta["opp"], marcador=f"{ga}-{gf}", fecha=meta["date"],
               ronda=f"{'Liga' if meta.get('comp')=='LIG' else 'Libertadores'} · {meta.get('ronda','')}",
               sede=("Local" if meta.get("ven") == "H" else "Visita") + f" ({meta.get('venueName','')})",
               arbitro=meta.get("ref", ""), goles=meta.get("goles", []),
               coq=player_rows(coq_df), dco=player_rows(opp_df))
    write_js(d / "ultimo_partido.js", "ULT", ult)

    # resumen en consola (verificación)
    print(f"✓ {meta['opp']} {ga}-{gf} Coquimbo  ({res})  [{meta.get('comp')}, {meta.get('ronda')}]")
    print(f"  Coquimbo: {ct['sh']} tiros ({ct['sot']} al arco) · {ct['cy']}🟨 {ct['cr']}🟥 · {ct['fls']} faltas · {ct['crs']} centros · {ct['intc']} int · {ct['tklw']} TklW")
    print(f"  Rival:    {ot['sh']} tiros ({ot['sot']} al arco)")
    print(f"  fixtures.js -> {len(fx)} partidos · ultimo_partido.js regenerado ({len(ult['coq'])} jug. Coquimbo)")
    print("  Recarga index.html para ver la actualización.")

if __name__ == "__main__":
    main()
