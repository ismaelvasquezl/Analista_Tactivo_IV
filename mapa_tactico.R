# =====================================================================
# Mapa táctico por 18 zonas — Coquimbo Unido 2026
# Versión estática 300 DPI (ggplot2) para informes/PDF.
# Fuente de datos: CFDB (posición real + estadísticas por jugador).
# Función = INFERENCIA de stats reales /90 (no datos de evento):
#   Finalización = g/90 / 0.5 + tiros_al_arco/90 / 1.2
#   Creación     = pases_clave/90 / 2.5 + asistencias/90 / 0.4
#   Recuperación = entradas/90 / 2.5 + intercepciones/90 / 1.5
#   -> función dominante (si todas < 0.55 => "Equilibrado")
# LÍMITE: la liga chilena no publica datos de evento (x,y); NO se calculan
#   toques en Zona 14 / pases entre líneas / carries con número (sería inventar).
#   Con un feed Wyscout/StatsBomb se computarían de verdad.
# Requisitos: install.packages(c("ggplot2","dplyr","ggforce"))
# =====================================================================
library(ggplot2); library(dplyr)

# ---- XI de Coquimbo (posición real; x=0-100 izq→der, y=0-100 arco propio→rival) ----
# min,g,a,kp,sh,sot,tk,intc desde CFDB (season 2026)
xi <- tribble(
  ~jugador,        ~pos,~x, ~y, ~min,~g,~a,~kp,~sh,~sot,~tk,~intc,
  "D. Sánchez",    "GK",50,  6, 1710, 0, 0,  0,  0,  0,  1,  0,
  "Cornejo",       "LB",13, 24, 1487, 0, 7, 34, 10,  2, 19, 25,
  "Gazzolo",       "CB",38, 24, 1620, 0, 0,  4,  4,  0, 34, 20,
  "M. Fernández",  "CB",62, 24, 1190, 1, 0,  1,  4,  2, 20, 21,
  "Salinas",       "RB",87, 24, 1581, 0, 2, 14, 24,  9, 18, 31,
  "Camargo",       "DM",36, 40, 1489, 4, 0,  3, 20,  9, 36, 18,
  "Galani",        "DM",64, 40, 1469, 1, 0, 10, 10,  3, 34, 12,
  "Vadalá",        "AM",50, 62,  990, 3, 0, 14, 15,  6, 12,  1,
  "Chandía",       "LW",17, 79,  874, 1, 3,  9, 18,  4,  8,  4,
  "Riveros",       "RW",83, 79, 1023, 2, 3, 12, 21,  7,  9,  4,
  "Johansen",      "CF",50, 82, 1317, 7, 0, 17, 30, 12,  8,  1
)

# ---- Función inferida ----
xi <- xi %>% mutate(
  m   = min/90,
  fin = (g/m)/0.5 + (sot/m)/1.2,
  cre = (kp/m)/2.5 + (a/m)/0.4,
  rec = (tk/m)/2.5 + (intc/m)/1.5,
  best = pmax(fin, cre, rec),
  funcion = case_when(
    best < 0.55            ~ "Equilibrado",
    fin >= cre & fin >= rec ~ "Finalizador",
    cre >= rec              ~ "Creador",
    TRUE                    ~ "Recuperador"),
  # zona 1-18 (6 bandas x 3 columnas)
  col  = pmin(2, pmax(0, floor(x/(100/3)))),
  row  = pmin(5, pmax(0, floor(y/(100/6)))),
  zona = row*3 + col + 1
)
col_func <- c("Finalizador"="#ff6f6f","Creador"="#ffd21f","Recuperador"="#6fb2ff","Equilibrado"="#c9c9c9","GK"="#c9c9c9")
xi$funcion[xi$pos=="GK"] <- "GK"

# ---- Grilla de 18 zonas ----
zonas <- expand.grid(r=0:5, c=0:2) %>% mutate(
  num = r*3 + c + 1,
  xc  = (c+0.5)*100/3, yc = (r+0.5)*100/6,
  z14 = num==14)

# ---- Dibujo ----
p <- ggplot() +
  # césped + zonas
  annotate("rect", xmin=0, xmax=100, ymin=0, ymax=100, fill="#0b2a12", color="white", linewidth=.5) +
  geom_rect(data=filter(zonas,z14), aes(xmin=c*100/3,xmax=(c+1)*100/3,ymin=r*100/6,ymax=(r+1)*100/6),
            fill="#ffd21f", alpha=.18, color="#ffd21f") +
  geom_hline(yintercept=seq(100/6,500/6,by=100/6), color="white", alpha=.15) +
  geom_vline(xintercept=c(100/3,200/3), color="white", alpha=.15) +
  geom_text(data=zonas, aes(xc, yc, label=num, fontface=ifelse(z14,"bold","plain")),
            color=ifelse(zonas$z14,"#ffd21f","white"), alpha=ifelse(zonas$z14,.9,.18), size=4) +
  annotate("rect", xmin=28, xmax=72, ymin=94, ymax=100, fill=NA, color="white", alpha=.2) +
  annotate("text", x=50, y=97, label="ÁREA RIVAL", color="white", alpha=.4, size=2.6) +
  # jugadores
  geom_point(data=xi, aes(x, y, size=min, fill=funcion), shape=21, color="black", stroke=.7) +
  geom_text(data=xi, aes(x, y, label=pos), size=2.4, fontface="bold") +
  geom_text(data=xi, aes(x, y-5, label=jugador), color="white", size=2.6) +
  scale_fill_manual(values=col_func, name="Función (inferida)") +
  scale_size(range=c(5,11), guide="none") +
  coord_fixed(ratio=1, xlim=c(-2,102), ylim=c(-2,102), expand=FALSE) +
  labs(title="Coquimbo Unido · Mapa táctico por 18 zonas",
       subtitle="Posición real (CFDB) · función inferida de stats /90 · Zona 14 resaltada",
       caption=paste0("Fuente: CFDB. Función = inferencia (no datos de evento). ",
                      "La liga chilena no publica x,y: no se muestran toques en Zona 14 / pases entre líneas / carries con número.")) +
  theme_void(base_size=12) +
  theme(plot.background=element_rect(fill="#0e141b", color=NA),
        text=element_text(color="#f4f6f8"),
        plot.title=element_text(color="#ffd21f", face="bold", size=16),
        plot.subtitle=element_text(color="#9fb0bd", size=10),
        plot.caption=element_text(color="#9fb0bd", size=7, hjust=0),
        legend.position="bottom", legend.text=element_text(color="#f4f6f8"),
        legend.title=element_text(color="#f4f6f8"))

ggsave("mapa_tactico_coquimbo.png", p, width=8, height=9, dpi=300, bg="#0e141b")
cat("OK -> mapa_tactico_coquimbo.png (300 DPI)\n")
