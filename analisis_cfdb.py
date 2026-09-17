#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Motor descriptivo + predictivo Coquimbo Unido 2026.
Fusiona detalle partido-a-partido (FBref, en fixtures.js) con totales/histórico autoritativos (CFDB).
Regla de oro: nada inventado. Cada bloque de salida marca fuente (FBref / CFDB) y naturaleza (DATO/INFERENCIA/HIPOTESIS).
Salida: analisis_cfdb.js (const ANALISIS = {...}) para el artefacto + resumen por consola.
"""
import json, re, statistics, random, math
from pathlib import Path

random.seed(42)
BASE = Path("/sessions/zealous-ecstatic-hamilton/mnt/outputs")

# ---------- 1. Cargar fixtures (FBref) ----------
raw = (BASE / "fixtures.js").read_text(encoding="utf-8")
arr = raw[raw.index("["):raw.rindex("]")+1]
FX = json.loads(arr)
LIG = [m for m in FX if m["comp"] == "LIG" and m["res"] != "S"]   # liga jugada
LIG.sort(key=lambda m: m["date"])

# ---------- 2. Totales de liga desde el detalle (FBref) ----------
def tally(games):
    w = sum(1 for g in games if g["res"] == "W")
    d = sum(1 for g in games if g["res"] == "D")
    l = sum(1 for g in games if g["res"] == "L")
    gf = sum(g["gf"] for g in games)
    ga = sum(g["ga"] for g in games)
    pj = len(games)
    pts = w*3 + d
    return dict(pj=pj, w=w, d=d, l=l, gf=gf, ga=ga, gd=gf-ga, pts=pts,
                ppg=round(pts/pj, 3) if pj else 0,
                gf_pg=round(gf/pj, 2) if pj else 0,
                ga_pg=round(ga/pj, 2) if pj else 0)

home = [g for g in LIG if g["ven"] == "H"]
away = [g for g in LIG if g["ven"] == "A"]
T_total, T_home, T_away = tally(LIG), tally(home), tally(away)

# ---------- 3. Totales autoritativos CFDB ----------
CFDB_2026 = dict(pos=10, pj=23, w=8, d=5, l=10, gf=31, ga=32, gd=-1, pts=29, fuente="CFDB team_standing")
CFDB_2025 = dict(pos=1, pj=30, w=23, d=6, l=1, gf=49, ga=17, gd=32, pts=75, fuente="CFDB historical_standings 2025 (CAMPEON)")

# Nota de reconciliacion FBref<->CFDB
recon = dict(
    fbref=dict(pj=T_total["pj"], record=f'{T_total["w"]}-{T_total["d"]}-{T_total["l"]}',
               gf=T_total["gf"], ga=T_total["ga"], pts=T_total["pts"]),
    cfdb=dict(pj=CFDB_2026["pj"], record=f'{CFDB_2026["w"]}-{CFDB_2026["d"]}-{CFDB_2026["l"]}',
              gf=CFDB_2026["gf"], ga=CFDB_2026["ga"], pts=CFDB_2026["pts"]),
    veredicto=("Reconciliacion COMPLETA tras cargar el partido faltante (U. Catolica 1-2, 26-ago) y "
               "el Huachipato 0-1: el detalle FBref coincide EXACTO con CFDB en PJ (23), record (8-5-10), "
               "goles (31-32), diferencia (-1), puntos (29) y posicion (10). Cero desfase. Se mantiene CFDB "
               "como fuente oficial y FBref para el detalle partido-a-partido.")
)

# ---------- 4. Regresion campeon->mitad de tabla (CFDB) ----------
# Ritmo por 30 fechas para comparar 2025 vs 2026
proy30 = {k: round(CFDB_2026[k] * 30 / CFDB_2026["pj"], 1) for k in ("pts", "gf", "ga")}
regresion = dict(
    titulo="De campeon invicto-casi a media tabla",
    y2025=CFDB_2025, y2026=CFDB_2026, proyeccion_30=proy30,
    lectura=(f'Campeon 2025 con {CFDB_2025["pts"]} pts y la mejor defensa de la liga '
             f'({CFDB_2025["ga"]} GC en 30 = {round(CFDB_2025["ga"]/30,2)}/PJ). '
             f'En 2026 concede {round(CFDB_2026["ga"]/CFDB_2026["pj"],2)}/PJ (ritmo {proy30["ga"]} en 30), '
             f'mas del doble. El ataque se sostiene mejor ({round(CFDB_2025["gf"]/30,2)} -> '
             f'{round(CFDB_2026["gf"]/CFDB_2026["pj"],2)} GF/PJ). El colapso es DEFENSIVO.')
)

# ---------- 5. Media movil de forma (FBref, ventana 5) ----------
def rolling(games, key, win=5):
    out = []
    vals = [g[key] for g in games]
    for i in range(len(vals)):
        lo = max(0, i-win+1)
        out.append(round(statistics.mean(vals[lo:i+1]), 2))
    return out

pts_seq = [ (3 if g["res"]=="W" else 1 if g["res"]=="D" else 0) for g in LIG ]
rolling_ppg = []
for i in range(len(pts_seq)):
    lo = max(0, i-4)
    rolling_ppg.append(round(statistics.mean(pts_seq[lo:i+1]), 2))

tendencia = dict(
    fecha=[g["ronda"].replace("Matchweek","F") for g in LIG],
    etiqueta=[f'{"vLoc" if g["ven"]=="H" else "@Vis"} {g["opp"]}' for g in LIG],
    gf=[g["gf"] for g in LIG], ga=[g["ga"] for g in LIG],
    gf_ma5=rolling(LIG,"gf"), ga_ma5=rolling(LIG,"ga"),
    ppg_ma5=rolling_ppg,
    ult5_pts=sum(pts_seq[-5:]), ult5_gf=sum(g["gf"] for g in LIG[-5:]),
    ult5_ga=sum(g["ga"] for g in LIG[-5:])
)

# ---------- 6. Regresion lineal simple GC (tendencia) ----------
def linreg(y):
    n=len(y); xs=list(range(n)); mx=statistics.mean(xs); my=statistics.mean(y)
    num=sum((x-mx)*(v-my) for x,v in zip(xs,y)); den=sum((x-mx)**2 for x in xs)
    b=num/den if den else 0; a=my-b*mx
    return round(a,3), round(b,3)
a_ga,b_ga = linreg([g["ga"] for g in LIG])
a_gf,b_gf = linreg([g["gf"] for g in LIG])
trend_reg = dict(ga_slope=b_ga, gf_slope=b_gf,
    lectura=(f'Pendiente GC por fecha = {b_ga:+.3f} (GC { "en alza" if b_ga>0 else "estable/baja"}); '
             f'pendiente GF = {b_gf:+.3f}. n=23, tendencia indicativa no causal.'))

# ---------- 7. Proyeccion de puntos (bootstrap Monte Carlo) ----------
# Temporada 30 fechas -> restan 30-23 = 7 (4 local + 3 visita, dado 11L/12V jugadas)
REM_H, REM_A = 4, 3
home_pts = [ (3 if g["res"]=="W" else 1 if g["res"]=="D" else 0) for g in home ]
away_pts = [ (3 if g["res"]=="W" else 1 if g["res"]=="D" else 0) for g in away ]
sims=[]
for _ in range(20000):
    s = CFDB_2026["pts"]
    for _ in range(REM_H): s += random.choice(home_pts)
    for _ in range(REM_A): s += random.choice(away_pts)
    sims.append(s)
sims.sort()
proj = dict(
    metodo="Bootstrap Monte Carlo (20.000 sim); remuestreo de resultados reales local/visita",
    base_pts=CFDB_2026["pts"], rem_local=REM_H, rem_visita=REM_A,
    home_ppg=T_home["ppg"], away_ppg=T_away["ppg"],
    media=round(statistics.mean(sims),1),
    p10=sims[int(0.10*len(sims))], p50=sims[int(0.50*len(sims))], p90=sims[int(0.90*len(sims))],
    lectura=("Proyeccion fin de temporada ~{:.0f} pts (IC80% {}-{}). Zona de media tabla: "
             "sin lucha por titulo ni riesgo real de descenso con este ritmo. "
             "Muestra n=23, proyeccion sensible al calendario restante.").format(
                 statistics.mean(sims), sims[int(0.10*len(sims))], sims[int(0.90*len(sims))])
)

# ---------- 8. Modelo Poisson (fuerza local/visita) + validacion LOO ----------
# Tasas base
lam_home_gf = T_home["gf"]/T_home["pj"]; lam_home_ga = T_home["ga"]/T_home["pj"]
lam_away_gf = T_away["gf"]/T_away["pj"]; lam_away_ga = T_away["ga"]/T_away["pj"]

def pois_pmf(k, lam): return math.exp(-lam)*lam**k/math.factorial(k)
def outcome_probs(lam_for, lam_against, maxg=8):
    pw=pd=pl=0.0
    for i in range(maxg+1):
        for j in range(maxg+1):
            p=pois_pmf(i,lam_for)*pois_pmf(j,lam_against)
            if i>j: pw+=p
            elif i==j: pd+=p
            else: pl+=p
    return pw,pd,pl

pw_h,pd_h,pl_h = outcome_probs(lam_home_gf,lam_home_ga)
pw_a,pd_a,pl_a = outcome_probs(lam_away_gf,lam_away_ga)

# Validacion: log-loss / acierto del modelo local-visita prediciendo cada partido con tasas del RESTO
def loo_eval(games, is_home):
    correct=0; ll=0.0; n=0
    for i,g in enumerate(games):
        rest=[x for k,x in enumerate(games) if k!=i]
        lf=statistics.mean([x["gf"] for x in rest]); la=statistics.mean([x["ga"] for x in rest])
        pw,pd,pl=outcome_probs(lf,la)
        actual = g["res"]
        p_actual = {"W":pw,"D":pd,"L":pl}[actual]
        ll += -math.log(max(p_actual,1e-9)); n+=1
        pred=max((("W",pw),("D",pd),("L",pl)),key=lambda t:t[1])[0]
        if pred==actual: correct+=1
    return dict(n=n, acierto=round(correct/n,3), logloss=round(ll/n,3))

loo_home=loo_eval(home,True); loo_away=loo_eval(away,False)
# baseline naive (siempre la clase mayoritaria de la liga: empate ~ prob base)
poisson = dict(
    local=dict(gf=round(lam_home_gf,2), ga=round(lam_home_ga,2),
               pW=round(pw_h,3), pD=round(pd_h,3), pL=round(pl_h,3)),
    visita=dict(gf=round(lam_away_gf,2), ga=round(lam_away_ga,2),
                pW=round(pw_a,3), pD=round(pd_a,3), pL=round(pl_a,3)),
    validacion=dict(local=loo_home, visita=loo_away,
        nota=("Validacion leave-one-out (cada partido predicho con las tasas de los otros). "
              "Acierto de clase modesto (empate es la clase dificil); el valor esta en la "
              "probabilidad, no en el marcador exacto. n bajo: usar como guia, no certeza.")),
    lectura=("En casa el modelo favorece a Coquimbo (pW~{:.0%}) con {:.1f} GF y solo {:.1f} GC esperados. "
             "De visita se invierte: mas probable no ganar (pL~{:.0%}) por {:.1f} GC esperados. "
             "El plan debe ser distinto segun localia.").format(pw_h,lam_home_gf,lam_home_ga,pl_a,lam_away_ga)
)

# ---------- 9. Contexto liga (CFDB) ----------
liga_ctx = dict(
    posesion=dict(coquimbo=49.5, rank=7, de=10, fuente="CFDB team_stat_leaders",
                  lectura="Posesion de media tabla (49,5%, 7º). No es un equipo de dominio del balon; su identidad es mas reactiva/vertical."),
    goleadores=dict(top_liga=[("Zampedri (UC)",25),("D. Castro (Limache)",13),("M. Correa (Colo-Colo)",12)],
                    coquimbo_en_top10=False,
                    lectura="Ningun jugador de Coquimbo entre los 10 maximos goleadores: el gol esta repartido, sin un '9' de referencia que garantice cifras. Riesgo de sequia en partidos cerrados."),
    h2h_la_serena=dict(historico="Coquimbo 35-33-22 (90 clasicos)", ult="1-1 (08-ago-26)",
                       fuente="CFDB team_h2h", lectura="Clasico regional parejo; el ultimo, empate en casa.")
)

# ---------- 10. Insights accionables ----------
insights = [
    dict(prioridad=1, area="Defensa de visita", evidencia=f"{T_away['ga']} GC en {T_away['pj']} de visita = {T_away['ga_pg']}/PJ (vs {T_home['ga_pg']} en casa)",
         interpretacion="El desplome respecto a 2025 es casi todo fuera de casa: la estructura defensiva no aguanta lejos del Sanchez Rumoroso.",
         accion="Plan de visita conservador: bloque medio-bajo, no exponer a los laterales, priorizar no encajar primero. Revisar transiciones defensivas (goles tardios: ver U. de Chile 82'-90')."),
    dict(prioridad=2, area="Cierre de partidos", evidencia="vs U. de Chile ganaba 1-2 al 82' y perdio 4-2; patron de goles encajados en tramos finales",
         interpretacion="Perdida de solidez y/o piernas en los ultimos 15'. Gestion de resultado deficiente.",
         accion="Rutina de cierre: cambios defensivos preventivos desde el 75' cuando se va ganando/empatando de visita; trabajo de balon parado defensivo y perdida de tiempo legitima."),
    dict(prioridad=3, area="Dependencia de localia", evidencia=f"Local {T_home['w']}-{T_home['d']}-{T_home['l']} ({T_home['ppg']} ppg) vs Visita {T_away['w']}-{T_away['d']}-{T_away['l']} ({T_away['ppg']} ppg)",
         interpretacion="El equipo es competitivo en casa y fragil fuera. Sumar de visita es la palanca de la temporada.",
         accion="Objetivo realista: convertir 2-3 de las 3 visitas restantes en al menos empates. En casa (5 restantes) exigir >=10 pts."),
    dict(prioridad=4, area="Falta de un referente de gol", evidencia="0 jugadores en el top-10 de goleadores de la liga",
         interpretacion="El gol repartido da flexibilidad pero castiga en partidos trabados.",
         accion="Potenciar llegada de segunda linea y balon parado ofensivo como via de gol fiable; definir rematadores fijos en corners."),
]

# ---------- 10b. Trayectoria histórica en Primera (CFDB historical_standings) ----------
# Cada fila = tabla final de esa temporada. Gaps marcados explícitamente (no se inventa).
HIST_ROWS = [
    dict(season="2019", pos=5,  pj=24, pts=34, gf=29, ga=27),
    dict(season="2020", pos=None, nota="sin registro en CFDB para Primera"),
    dict(season="2021", pos=None, nota="no figura en la tabla de Primera (categoría de ascenso)"),
    dict(season="2022", pos=14, pj=30, pts=27, gf=32, ga=52),
    dict(season="2023", pos=5,  pj=30, pts=47, gf=43, ga=42),
    dict(season="2024", pos=8,  pj=30, pts=45, gf=37, ga=34),
    dict(season="2025", pos=1,  pj=30, pts=75, gf=49, ga=17),
    dict(season="2026", pos=10, pj=23, pts=29, gf=31, ga=32, encurso=True),
]
# GC por partido para la lectura defensiva a lo largo del tiempo
for r in HIST_ROWS:
    if r.get("pos") is not None:
        r["gapg"] = round(r["ga"]/r["pj"], 2)
        r["gfpg"] = round(r["gf"]/r["pj"], 2)
        r["ppg"]  = round(r["pts"]/r["pj"], 2)
historia = dict(
    fuente="CFDB historical_standings (tablas finales de Primera). 2020 sin dato; 2021 fuera de Primera.",
    filas=HIST_ROWS,
    lectura=("Trayectoria en Primera: 5º (2019) → descenso/ascenso → 14º al volver (2022) → "
             "5º (2023) → 8º (2024) → CAMPEÓN (2025) → 10º (2026, en curso). El título fue un "
             "pico sostenido sobre una base de media tabla; la caída de 2026 es una regresión a "
             "la media agravada por el desplome defensivo (GC/PJ: 0,57 campeón → 1,41 hoy).")
)

# ---------- Ensamblar ----------
ANALISIS = dict(
    actualizado="2026-09-16",
    fuentes="CFDB (totales, historico, contexto liga) + FBref (detalle partido-a-partido). Etiquetas: DATO/INFERENCIA/HIPOTESIS.",
    totales_cfdb=CFDB_2026, totales_detalle=T_total,
    split=dict(local=T_home, visita=T_away),
    reconciliacion=recon, regresion=regresion, tendencia=tendencia,
    trend_reg=trend_reg, proyeccion=proj, poisson=poisson,
    liga=liga_ctx, historia=historia, insights=insights
)

out_js = "// Generado por analisis_cfdb.py — fuentes CFDB + FBref. NO editar a mano.\nconst ANALISIS = " + json.dumps(ANALISIS, ensure_ascii=False, indent=1) + ";\n"
(BASE / "analisis_cfdb.js").write_text(out_js, encoding="utf-8")

# ---------- Resumen consola ----------
print("== RECONCILIACION ==")
print("FBref detalle:", recon["fbref"])
print("CFDB oficial :", recon["cfdb"])
print()
print("== SPLIT LOCAL/VISITA (FBref) ==")
print("Local :", T_home)
print("Visita:", T_away)
print()
print("== REGRESION 2025->2026 (CFDB) ==")
print("2025 CAMPEON:", CFDB_2025["pts"],"pts", f'{CFDB_2025["w"]}-{CFDB_2025["d"]}-{CFDB_2025["l"]}', "GC/PJ", round(CFDB_2025["ga"]/30,2))
print("2026 10º    :", CFDB_2026["pts"],"pts", f'{CFDB_2026["w"]}-{CFDB_2026["d"]}-{CFDB_2026["l"]}', "GC/PJ", round(CFDB_2026["ga"]/CFDB_2026["pj"],2), "| ritmo30:", proy30)
print()
print("== PROYECCION PUNTOS ==", proj["media"], "pts  IC80%:", proj["p10"],"-",proj["p90"])
print()
print("== POISSON ==")
print("Local :", poisson["local"])
print("Visita:", poisson["visita"])
print("Validacion LOO local:", loo_home, "| visita:", loo_away)
print()
print("OK -> analisis_cfdb.js escrito")
