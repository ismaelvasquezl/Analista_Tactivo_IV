#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Motor de proyección + pre-match — Coquimbo Unido 2026.
- Monte Carlo de la tabla final con el FIXTURE REAL de Coquimbo (calendario oficial confirmado por el usuario)
  y completación aproximada por fuerzas para el resto de la liga.
- Predicción Poisson (Dixon-Coles-lite) por partido: 1X2, goles esperados, Over 2.5, ambos marcan.
- Pre-match por rival (posición, forma L5, H2H, fuerzas, predicción, lectura táctica honesta).
Fuentes: CFDB league_standings / team_form / team_h2h / player_top_scorers (DATO). Etiquetas INFERENCIA donde toca.
Salidas: sim_tabla.js (const SIMTABLA) + rivales_prematch.js (const RIVALES).
LÍMITES: la liga chilena no publica xG/tracking -> fuerzas derivadas de goles reales. CFDB no expone el
calendario exacto de los otros 15 equipos -> su resto se aproxima. Coquimbo juega su calendario real (7 fechas).
"""
import json, random, math
from collections import defaultdict
from pathlib import Path

random.seed(42)
BASE = Path("/sessions/zealous-ecstatic-hamilton/mnt/outputs")
N_SIM = 20000
TOTAL_FECHAS = 30
HFA = 1.20
RELEGA = 2; COPA_LIB = 4; COPA_TOT = 8

# ---- Tabla actual CFDB (DATO): nombre, PJ, pts, GF, GA ----
TB = [
 ("Colo-Colo",23,54,48,22),("U. Católica",23,42,50,33),("U. de Chile",23,42,35,19),
 ("Everton",23,36,37,25),("Palestino",23,36,36,33),("D. Limache",23,33,43,35),
 ("Ñublense",23,32,28,31),("D. Concepción",23,31,25,26),("La Serena",23,30,34,38),
 ("Coquimbo Unido",22,29,31,31),("Audax Italiano",23,28,26,31),("O'Higgins",23,27,28,36),
 ("Huachipato",21,25,29,39),("Cobresal",23,24,34,44),("U. de Concepción",22,22,17,37),
 ("U. La Calera",23,17,19,40),
]
teams=[t[0] for t in TB]
pj={t[0]:t[1] for t in TB}; pts0={t[0]:t[2] for t in TB}
gf0={t[0]:t[3] for t in TB}; ga0={t[0]:t[4] for t in TB}

tot_g=sum(gf0.values()); tot_pj=sum(pj.values()); league_avg=tot_g/tot_pj
att={t:(gf0[t]/pj[t])/league_avg for t in teams}
dfn={t:(ga0[t]/pj[t])/league_avg for t in teams}
def lam(team,opp,is_home):
    base=league_avg*att[team]*dfn[opp]
    return max(0.05, base*(HFA if is_home else 1.0))

# ---- Fixture REAL de Coquimbo (calendario oficial; H=local, A=visita) ----
COQ="Coquimbo Unido"
COQ_FIX=[
 dict(date="2026-10-11", opp="Colo-Colo",      ven="H", comp="LIG"),
 dict(date="2026-10-25", opp="Ñublense",       ven="A", comp="LIG"),
 dict(date="2026-11-01", opp="U. La Calera",   ven="H", comp="LIG"),
 dict(date="2026-11-08", opp="Audax Italiano", ven="A", comp="LIG"),
 dict(date="2026-11-22", opp="Everton",        ven="H", comp="LIG"),
 dict(date="2026-11-29", opp="D. Limache",     ven="H", comp="LIG"),
 dict(date="2026-12-06", opp="O'Higgins",      ven="A", comp="LIG"),
]
COPA=[dict(date="2026-09-22",opp="Cobreloa",ven="A",comp="COPA",nota="Copa Chile · Octavos IDA"),
      dict(date="2026-10-07",opp="Cobreloa",ven="H",comp="COPA",nota="Copa Chile · Octavos VUELTA")]
coq_opps={f["opp"] for f in COQ_FIX}

# ---- Poisson helpers ----
def sim_goals(l):
    Lx=math.exp(-l); k=0; p=1.0
    while True:
        k+=1; p*=random.random()
        if p<=Lx: return k-1
def outcome_matrix(lf,la,maxg=9):
    pw=pd=pl=0.0; over=0.0; btts=0.0; egf=lf; ega=la
    for i in range(maxg+1):
        pi=math.exp(-lf)*lf**i/math.factorial(i)
        for j in range(maxg+1):
            pj_=math.exp(-la)*la**j/math.factorial(j); p=pi*pj_
            if i>j: pw+=p
            elif i==j: pd+=p
            else: pl+=p
            if i+j>2.5: over+=p
            if i>=1 and j>=1: btts+=p
    return dict(pW=round(pw,3),pD=round(pd,3),pL=round(pl,3),
                egf=round(egf,2),ega=round(ega,2),over25=round(over,3),btts=round(btts,3))

def coq_match_pred(opp,ven):
    if ven=="H": lf=lam(COQ,opp,True); la=lam(opp,COQ,False)
    else:        lf=lam(COQ,opp,False); la=lam(opp,COQ,True)
    m=outcome_matrix(lf,la)
    # marcador más probable
    best=(0,0,0.0)
    for i in range(6):
        for j in range(6):
            p=(math.exp(-lf)*lf**i/math.factorial(i))*(math.exp(-la)*la**j/math.factorial(j))
            if p>best[2]: best=(i,j,p)
    m["marcador"]=f"{best[0]}-{best[1]}"; m["marcador_p"]=round(best[2],3)
    return m

# ---- Monte Carlo tabla (Coquimbo real; resto aproximado por fuerzas, juego independiente) ----
pos_counts={t:[0]*17 for t in teams}; pts_final=defaultdict(list)
champ=defaultdict(int); top4=defaultdict(int); top8=defaultdict(int); releg=defaultdict(int)
rem_solo={}
for t in teams:
    r=TOTAL_FECHAS-pj[t]
    if t==COQ: r=0                       # sus 7 partidos van explícitos
    elif t in coq_opps: r=r-1            # su partido vs Coquimbo va explícito
    rem_solo[t]=max(0,r)

for _ in range(N_SIM):
    P=dict(pts0); GFx=dict(gf0); GAx=dict(ga0)
    # partidos reales de Coquimbo (consistentes para ambos equipos)
    for f in COQ_FIX:
        opp=f["opp"]; h=(f["ven"]=="H")
        lf=lam(COQ,opp,h); la=lam(opp,COQ,not h)
        g1=sim_goals(lf); g2=sim_goals(la)
        GFx[COQ]+=g1; GAx[COQ]+=g2; GFx[opp]+=g2; GAx[opp]+=g1
        if g1>g2: P[COQ]+=3
        elif g1<g2: P[opp]+=3
        else: P[COQ]+=1; P[opp]+=1
    # resto de equipos: juego independiente vs rival aleatorio por fuerzas
    for t in teams:
        for _ in range(rem_solo[t]):
            opp=random.choice([x for x in teams if x!=t])
            h=random.random()<0.5
            lf=lam(t,opp,h)
            g1=sim_goals(lf); g2=sim_goals(lam(opp,t,not h))
            GFx[t]+=g1; GAx[t]+=g2
            if g1>g2: P[t]+=3
            elif g1==g2: P[t]+=1
    rank=sorted(teams,key=lambda t:(P[t],GFx[t]-GAx[t],GFx[t]),reverse=True)
    for i,t in enumerate(rank):
        pos=i+1; pos_counts[t][pos]+=1
        if pos==1: champ[t]+=1
        if pos<=COPA_LIB: top4[t]+=1
        if pos<=COPA_TOT: top8[t]+=1
        if pos>=17-RELEGA: releg[t]+=1
    for t in teams: pts_final[t].append(P[t])

def pctl(a,q): b=sorted(a); return b[min(len(b)-1,int(q*len(b)))]
rows=[]
for t in teams:
    pf=pts_final[t]; modal=max(range(1,17),key=lambda p:pos_counts[t][p])
    rows.append(dict(team=t,pj=pj[t],pts_now=pts0[t],att=round(att[t],2),dfn=round(dfn[t],2),
        pts_med=round(sum(pf)/len(pf),1),pts_p05=pctl(pf,0.05),pts_p95=pctl(pf,0.95),pos_mode=modal,
        p_champ=round(champ[t]/N_SIM,4),p_top4=round(top4[t]/N_SIM,4),
        p_top8=round(top8[t]/N_SIM,4),p_releg=round(releg[t]/N_SIM,4),
        pos_dist=[round(pos_counts[t][p]/N_SIM,4) for p in range(1,17)]))
rows.sort(key=lambda r:-r["pts_med"])
COQROW=next(r for r in rows if r["team"]==COQ)

SIM=dict(meta=dict(
    modelo="Monte Carlo (%d sim) · Poisson Dixon-Coles-lite · HFA=%.2f"%(N_SIM,HFA),
    fuente="Tabla y goles: CFDB league_standings (DATO). Coquimbo con calendario oficial real (7 fechas).",
    limite=("La liga no publica xG/tracking: fuerzas derivadas de goles reales. El calendario exacto de los "
            "otros 15 equipos no está en CFDB: su resto se aproxima por fuerzas (juego independiente). "
            "Según el calendario oficial a Coquimbo le restan 7 partidos (termina en 29 PJ); la tabla sugería 8, "
            "posible fecha pendiente aún no calendarizada — no se inventa."),
    league_avg=round(league_avg,3),fecha="2026-09-16",
    zonas="Descenso = 2 últimos. Top-4 ≈ Libertadores, Top-8 ≈ zona internacional (aprox)."),
    tabla=rows, coquimbo=COQROW)
(BASE/"sim_tabla.js").write_text("// Monte Carlo tabla — sim_montecarlo.py (CFDB + calendario real). NO editar a mano.\nconst SIMTABLA="+json.dumps(SIM,ensure_ascii=False)+";\n",encoding="utf-8")

# ================= PRE-MATCH POR RIVAL =================
# Datos CFDB embebidos (DATO): standing, forma L5 (más reciente primero), H2H, goleador destacado.
STAND={r["team"]:r for r in [dict(team=t[0],pos=i+1,pj=t[1],pts=t[2],gf=t[3],ga=t[4]) for i,t in enumerate(TB)]}
# forma L5: lista de (res,gf,ga,ven) reciente->antiguo
FORM={
 "Colo-Colo":[("D",1,1,"H"),("D",0,0,"A"),("W",5,1,"H"),("W",2,1,"A"),("D",2,2,"H")],
 "Ñublense":[("L",1,3,"H"),("L",1,2,"A"),("L",0,2,"A"),("L",0,1,"H"),("W",2,1,"A")],
 "U. La Calera":[("W",1,0,"H"),("L",1,2,"A"),("L",0,1,"H"),("D",0,0,"A"),("L",1,2,"A")],
 "Audax Italiano":[("W",1,0,"H"),("W",1,0,"A"),("L",1,5,"A"),("D",0,0,"H"),("D",1,1,"A")],
 "Everton":[("W",3,1,"A"),("L",0,1,"H"),("W",3,0,"A"),("W",3,1,"H"),("D",1,1,"H")],
 "D. Limache":[("L",0,1,"A"),("W",3,0,"H"),("W",2,0,"H"),("L",0,3,"H"),("W",3,1,"A")],
 "O'Higgins":[("L",0,1,"A"),("W",2,1,"H"),("L",2,3,"A"),("L",0,1,"H"),("D",2,2,"A")],
}
# H2H all-time (Coquimbo persp): W-D-L y últimos 5 (concis)
H2H={
 "Colo-Colo":dict(w=11,d=19,l=35,tot=65,ult="1-0,0-3,1-1,1-0,0-2",nota="Desventaja histórica marcada; en casa le ganó los últimos dos (1-0)."),
 "Ñublense":dict(w=7,d=3,l=6,tot=16,ult="1-1,2-1,0-0,1-0,0-0",nota="Historial parejo; Coquimbo fuerte de local."),
 "U. La Calera":dict(w=13,d=10,l=11,tot=34,ult="0-1,1-0,2-1,2-0,4-1",nota="Favorable en liga; cayó los dos de Copa de la Liga 0-1."),
 "Audax Italiano":dict(w=16,d=11,l=26,tot=53,ult="3-0,1-0,2-1,1-1,1-0",nota="Desventaja histórica pero invicto en los últimos 5 (goleó 3-0)."),
 "Everton":dict(w=19,d=18,l=29,tot=66,ult="1-1,2-1,0-0,2-2,2-1",nota="Invicto en los últimos 5 cruces (2 W, 3 E)."),
 "D. Limache":dict(w=4,d=2,l=2,tot=8,ult="1-1,1-1,3-2,3-2,2-1",nota="Rival nuevo; Coquimbo ganó los dos de liga (3-2, 2-1)."),
 "O'Higgins":dict(w=20,d=11,l=21,tot=52,ult="0-0,1-0,2-0,1-1,2-0",nota="Todo igualado histórico; Coquimbo invicto en los últimos 5."),
}
GOLEADOR={"Colo-Colo":"M. Correa (12) y M. Romero (8)","D. Limache":"D. Castro (13, 2º de la liga)",
 "Everton":"A. Medina (11)","U. La Calera":"J. Sáez (9)","Ñublense":"—","Audax Italiano":"—","O'Higgins":"—"}

def forma_pts(f): return sum(3 if x[0]=="W" else 1 if x[0]=="D" else 0 for x in f)
def lectura(opp,ven,pred):
    s=STAND[opp]; gapg=s["ga"]/s["pj"]; gfpg=s["gf"]/s["pj"]; fp=forma_pts(FORM[opp])
    amenazas=[]; debil=[]
    if gfpg>=1.5 or att[opp]>1.15: amenazas.append(f"ataque productivo ({gfpg:.2f} GF/PJ; goleador {GOLEADOR[opp]})")
    if att[opp]>1.25: amenazas.append("uno de los ataques top de la liga")
    if fp>=11: amenazas.append(f"llega enchufado ({fp}/15 pts en sus últimos 5)")
    if gapg>=1.5 or dfn[opp]>1.2: debil.append(f"concede mucho ({gapg:.2f} GC/PJ): premiar la llegada")
    if fp<=4: debil.append(f"en crisis de forma ({fp}/15 en los últimos 5)")
    if s["pos"]>=13: debil.append("pelea abajo, presión de resultado")
    if not amenazas: amenazas.append(f"equilibrado ({gfpg:.2f} GF/PJ), sin un '9' de referencia")
    if not debil: debil.append(f"sólido atrás ({gapg:.2f} GC/PJ): habrá que ser paciente")
    fav = "Coquimbo favorito" if pred["pW"]>pred["pL"]+0.08 else ("rival favorito" if pred["pL"]>pred["pW"]+0.08 else "partido parejo")
    plan=(f"{'De local, ' if ven=='H' else 'De visita, '}"
          + ("proponer y explotar que concede: " if (gapg>=1.4 or dfn[opp]>1.15) else "orden y golpear en transición: ")
          + ("nuestro punto débil es la defensa de visita (1,83 GC/PJ), así que " if ven=="A" else "")
          + ("no regalar el primer gol y sostener el bloque." if ven=="A" else "imponer ritmo en el Sánchez Rumoroso, donde el equipo compite mejor."))
    return dict(favorito=fav,amenazas=amenazas,debilidades=debil,plan=plan)

def build_q7(opp,ven,s,pred,L):
    gfpg=s["gf"]/s["pj"]; gapg=s["ga"]/s["pj"]; fp=forma_pts(FORM[opp]); h=H2H[opp]
    racha=FORM[opp][0][0]; rachaTxt={"W":"viene de ganar","D":"viene de empatar","L":"viene de perder"}[racha]
    p=pred
    return [
     dict(q="1. ¿Cómo llega el rival?",
          a=f"{s['pos']}º con {s['pts']} pts ({gfpg:.2f} GF/PJ, {gapg:.2f} GC/PJ). En sus últimos 5 sumó {fp}/15 y {rachaTxt}. Localía del partido: Coquimbo de {'local' if ven=='H' else 'visita'}."),
     dict(q="2. ¿De dónde vienen sus goles?",
          a=(f"Ataque {'potente' if att[opp]>1.15 else ('discreto' if att[opp]<0.9 else 'medio')} ({gfpg:.2f} GF/PJ, índice {att[opp]:.2f}). "
             + (f"Referencia de gol: {GOLEADOR[opp]}." if GOLEADOR[opp]!='—' else "Gol repartido, sin un '9' de referencia claro."))),
     dict(q="3. ¿Dónde es vulnerable?",
          a=(f"Concede {gapg:.2f} GC/PJ (índice defensivo {dfn[opp]:.2f}). "
             + ("Defensa frágil: premiar la llegada y el segundo balón." if (gapg>=1.4 or dfn[opp]>1.15) else "Defensa sólida: habrá que generar con paciencia y balón parado."))),
     dict(q="4. ¿A quién vigilar?",
          a=(f"{GOLEADOR[opp]} en ataque." if GOLEADOR[opp]!='—' else "Sin un goleador destacado; atención a las llegadas de segunda línea y al balón parado.")),
     dict(q="5. ¿Qué dice el head-to-head?",
          a=f"Histórico Coquimbo {h['w']}-{h['d']}-{h['l']} en {h['tot']} duelos. Últimos: {h['ult']}. {h['nota']}"),
     dict(q="6. ¿Qué proyecta el modelo?",
          a=(f"1X2 (Coquimbo): {round(p['pW']*100)}% / {round(p['pD']*100)}% / {round(p['pL']*100)}%. "
             f"Goles esperados {p['egf']}-{p['ega']}, marcador más probable {p['marcador']}. "
             f"Over 2.5: {round(p['over25']*100)}%; ambos marcan: {round(p['btts']*100)}%. Veredicto: {L['favorito']}.")),
     dict(q="7. ¿Cuál es el plan para ganarle?",
          a=f"{L['plan']} A explotar: {L['debilidades'][0]}. A neutralizar: {L['amenazas'][0]}."),
    ]

rivales=[]
for f in COQ_FIX:
    opp=f["opp"]; s=STAND[opp]; pred=coq_match_pred(opp,f["ven"])
    _lect=lectura(opp,f["ven"],pred)
    rivales.append(dict(
        q7=build_q7(opp,f["ven"],s,pred,_lect),
        date=f["date"], opp=opp, ven=f["ven"], comp="Liga",
        pos=s["pos"], pj=s["pj"], pts=s["pts"], gf=s["gf"], ga=s["ga"],
        gfpg=round(s["gf"]/s["pj"],2), gapg=round(s["ga"]/s["pj"],2),
        att=round(att[opp],2), dfn=round(dfn[opp],2),
        forma=FORM[opp], forma_pts=forma_pts(FORM[opp]),
        h2h=H2H[opp], goleador=GOLEADOR[opp], pred=pred, lectura=lectura(opp,f["ven"],pred)))
RIV=dict(meta=dict(fuente="CFDB league_standings/team_form/team_h2h/player_top_scorers (DATO) + predicción Poisson Dixon-Coles-lite.",
                   limite="Sin xG/tracking públicos: fuerzas por goles reales. Lecturas tácticas = INFERENCIA sobre datos, no observación de video.",
                   actualizado="2026-09-16"),
         fixture=COQ_FIX+COPA, rivales=rivales)
(BASE/"rivales_prematch.js").write_text("// Pre-match rivales — sim_montecarlo.py (CFDB). NO editar a mano.\nconst RIVALES="+json.dumps(RIV,ensure_ascii=False)+";\n",encoding="utf-8")

# ---- Consola ----
print("Liga avg:",round(league_avg,3))
print("\n== PROYECCIÓN COQUIMBO (fixture real) ==")
print("Pts %d -> mediana %.1f (IC90%% %d-%d) | pos %dº | top8 %.0f%% | desc %.2f%%"%(
    COQROW["pts_now"],COQROW["pts_med"],COQROW["pts_p05"],COQROW["pts_p95"],COQROW["pos_mode"],
    COQROW["p_top8"]*100,COQROW["p_releg"]*100))
print("\n== PRE-MATCH (predicción por partido, Coquimbo persp.) ==")
for r in rivales:
    p=r["pred"]
    print("%-16s (%s) pos%2d  W/D/L %2.0f/%2.0f/%2.0f  xGoles %.1f-%.1f  O2.5 %2.0f%%  marc %s  [%s]"%(
        r["opp"],r["ven"],r["pos"],p["pW"]*100,p["pD"]*100,p["pL"]*100,p["egf"],p["ega"],
        p["over25"]*100,p["marcador"],r["lectura"]["favorito"]))
print("\nOK -> sim_tabla.js + rivales_prematch.js")
