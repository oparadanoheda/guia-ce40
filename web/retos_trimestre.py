# M28 · Retos del trimestre: una hoja por curso y trimestre, al estilo Bebras (4 retos), y una página de soluciones
# por curso con lo que evalúa cada reto (criterio 4.1 o 4.2 y aspecto de la rúbrica M19).
# La usa materiales.py (m28). Los retos con cuadrícula se comprueban con el simulador al generar.
import materiales as M
from svgkit import SJ, shape_svg, simulate, path_cells, arrow_svg

E = M.E
CSS = """<style>
.rt-nom{display:flex;gap:8mm;font-size:10.5pt}.rt-nom span{flex:1;border-bottom:1px solid #9aa1ad;padding-bottom:1mm}
.rt-grid{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr) minmax(0,1fr);gap:4mm}
.rt{display:flex;flex-direction:column;gap:2mm;min-height:0;overflow:hidden}
.rt-h{display:flex;align-items:center;gap:2.5mm;font:700 11.5pt Bahnschrift,'Segoe UI',sans-serif}
.rt-n{display:inline-grid;place-items:center;width:7.5mm;height:7.5mm;border-radius:50%;background:var(--c);color:#fff;font:700 11pt Bahnschrift,'Segoe UI'}
.rt-e{margin:0;font-size:10pt;line-height:1.35}
.rt-c{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:safe center;gap:2.5mm}
.rt-row{display:flex;align-items:center;justify-content:center;gap:2.5mm;flex-wrap:wrap}
.rt-op{display:grid;gap:2.5mm;width:100%}
.rt-o{border:1.4px solid #9aa1ad;border-radius:2mm;padding:2mm 2mm 2mm 6.5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5mm;position:relative;min-height:15mm;font-size:9.5pt;text-align:center}
.rt-o>i{position:absolute;top:.8mm;left:1.6mm;font:700 10pt Bahnschrift,'Segoe UI';font-style:normal;color:#6b7385}
.rt-r{font-size:10pt;display:flex;align-items:flex-end;gap:2mm;width:100%}.rt-r span{flex:1;border-bottom:1px solid #1a1d24;height:7mm}
.rt-sq{display:inline-block;width:11mm;height:11mm;border:1.6px solid #1a1d24;border-radius:2mm;background:#fff}
.rt-fig{display:inline-block;width:10mm;height:10mm}
.rt-k{display:flex;flex-direction:column;align-items:center;gap:1.5mm}
.rt-scr{display:flex;flex-direction:column;gap:2px;align-items:flex-start}
.rt-b{display:inline-block;border-radius:4px;padding:2px 7px;font:600 8.5pt 'Segoe UI',sans-serif;border:1px solid rgba(0,0,0,.12)}
.rt-b.hat{border-radius:12px 12px 4px 4px;padding-top:7px}
.rt-cb{display:inline-flex;flex-direction:column;align-items:flex-start}
.rt-cb>.top,.rt-cb>.mid{padding:2px 7px;font:600 8.5pt 'Segoe UI',sans-serif}.rt-cb>.top{border-radius:4px 4px 0 0}
.rt-cb>.arm{display:flex}.rt-cb>.arm>.bar{width:10px}.rt-cb>.arm>.in{display:flex;flex-direction:column;gap:2px;padding:2px 0 2px 2px;min-height:5px}
.rt-cb>.foot{height:7px;width:52px;border-radius:0 0 4px 4px}
.sm .rt-b,.sm .rt-cb>.top,.sm .rt-cb>.mid{font-size:7.3pt;padding:1px 6px}.sm .rt-b.hat{padding-top:5px}
.rt-t{font-size:9pt;color:#434a59;text-align:center;margin:0}
.rt-sol table{font-size:9pt}.rt-sol td{padding:1.6mm 2mm}.rt-sol th{padding:1.6mm 2mm}
.rt-sol h2{margin:1mm 0 0}
</style>"""

ROJO, AZUL, VERDE, AMAR = "#cf3f36", "#2c5bbf", "#2a8f4f", "#e8b000"
ARROW = {"F": "#2c5bbf", "R": "#2a8f4f", "L": "#df7619", "B": "#6c44b0"}


# ------------------------------------------------------------------ piezas de dibujo
def fig(shape, color, mm=10):
    return f'<span class="rt-fig" style="width:{mm}mm;height:{mm}mm">{shape_svg(shape, color, 40)}</span>'


def hueco(mm=10):
    return fig("blank", None, mm)


def ops(items, cols=None, letras="ABCD"):
    cols = cols or len(items)
    cells = "".join(f'<div class="rt-o"><i>{letras[i]}</i>{it}</div>' for i, it in enumerate(items))
    return f'<div class="rt-op" style="grid-template-columns:repeat({cols},minmax(0,1fr))">{cells}</div>'


def resp(label="Respuesta:"):
    return f'<div class="rt-r">{label} <span></span></div>'


def resps(*labels):
    return "".join(resp(lb) for lb in labels)


def sq():
    return '<span class="rt-sq"></span>'


def picto(name, mm=18):
    return M.pimg(name, mm)


def con_casilla(name, mm=18):
    return f'<div class="rt-k">{picto(name, mm)}{sq()}</div>'


def tarjeta(k, mm=10):
    return f'<span style="display:inline-block;width:{mm}mm;height:{mm}mm">{arrow_svg(k, 100, ARROW[k])}</span>'


def repite(n, mm=10):
    return (f'<span style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:{mm}mm;height:{mm}mm;'
            f'border-radius:{mm * .14}mm;background:{SJ["ctrl"]};color:#fff;font:700 {mm * .2:.1f}mm/1 Bahnschrift,sans-serif">REPITE'
            f'<b style="font-size:{mm * .42:.1f}mm">×{n}</b></span>')


def prog(seq, numbered=True, bugs=()):
    return M.mini_prog(seq, bugs=bugs, numbered=numbered)


def cuad(size, start, d, goal, rocks=(), mm=42, path=None):
    return f'<div style="width:{mm}mm">{M.grid_svg(size, start, d, goal, list(rocks), cell=40, path=path)}</div>'


def comprueba(start, d, goal, size, bueno, malo=None, rocks=()):
    r = simulate(start, d, bueno, size, set(rocks))
    assert r and r[0] == goal, ("el programa bueno no llega", bueno)
    if malo:
        r = simulate(start, d, malo, size, set(rocks))
        assert not (r and r[0] == goal), ("el programa con bicho llega", malo)


def bloque(color, label, icon="", kind="normal", tc="#fff", w=30, h=17):
    return f'<span style="display:inline-block;width:{w}mm;height:{h}mm">{M.puzzle_block(color, label, icon, 200, 110, kind, tc)}</span>'


def _b(col, text, hat=False, txt="#fff"):
    return f'<div class="rt-b{" hat" if hat else ""}" style="background:{col};color:{txt}">{text}</div>'


def _c(col, secciones, txt="#fff"):
    """Bloque en C con una o varias secciones: [(cabecera, [bloques]), ("si no", [bloques])…]."""
    out = ['<div class="rt-cb">']
    for i, (cab, dentro) in enumerate(secciones):
        out.append(f'<div class="{"top" if i == 0 else "mid"}" style="background:{col};color:{txt}">{cab}</div>')
        out.append(f'<div class="arm"><div class="bar" style="background:{col}"></div><div class="in">{"".join(dentro)}</div></div>')
    out.append(f'<div class="foot" style="background:{col}"></div></div>')
    return "".join(out)


def sb(cat, text, hat=False):
    return _b(M.SCR[cat], text, hat, "#1a1d24" if cat == "eve" else "#fff")


def sc(cat, text, *inner):
    return _c(M.SCR[cat], [(text, list(inner))])


def sif(cond, entonces, si_no=None):
    """Scratch: si … entonces (y si no), en un solo bloque."""
    return _c(M.SCR["con"], [(f"si {cond} entonces", list(entonces))] + ([("si no", list(si_no))] if si_no is not None else []))


def pila(*blocks, sm=False):
    return f'<div class="rt-scr{" sm" if sm else ""}">{"".join(blocks)}</div>'


def mk(cat, text):
    return _b(M.MC[cat], text)


def mkc(cat, text, *inner):
    return _c(M.MC[cat], [(text, list(inner))])


def mif(*ramas):
    """MakeCode: si … entonces / si no, si … / si no, en un solo bloque. ramas = (condición o None, [bloques])."""
    sec = []
    for i, (cond, dentro) in enumerate(ramas):
        cab = f"si {cond} entonces" if i == 0 else ("si no" if cond is None else f"si no, si {cond} entonces")
        sec.append((cab, list(dentro)))
    return _c(M.MC["log"], sec)


def progs(seq, mm=7.5, numbered=True):
    """Programa de tarjetas en pequeño, para los que tienen muchas tarjetas o van dentro de una opción."""
    cells = "".join('<span style="display:inline-flex;flex-direction:column;align-items:center;gap:.3mm">'
                    + (f'<i style="font:600 6.5pt Segoe UI;color:#6b7385;font-style:normal">{i + 1}</i>' if numbered else "")
                    + tarjeta(c, mm) + "</span>" for i, c in enumerate(seq))
    return f'<div style="display:flex;gap:1mm;align-items:flex-end;justify-content:center">{cells}</div>'


def placa(nombre, grupo, envia=False):
    return (f'<div style="border:1.6px solid #1a1d24;border-radius:2mm;padding:2mm 3mm;text-align:center;font-size:9pt;'
            f'background:{"#eaf0fb" if envia else "#fff"}"><b style="font-size:12pt">{nombre}</b><br>grupo {grupo}'
            f'{"<br><b>envía</b>" if envia else ""}</div>')


def camino_svg(kind, mm=16):
    """Dibujo del recorrido del robot: cuadrado, línea o L (vista desde arriba)."""
    pts = {"cuadrado": "10,50 10,10 50,10 50,50 10,50", "linea": "8,30 52,30", "ele": "15,8 15,50 52,50",
           "escalera": "8,52 8,38 22,38 22,24 36,24 36,10 52,10"}[kind]
    return (f'<svg viewBox="0 0 60 60" style="width:{mm}mm;height:{mm}mm"><polyline points="{pts}" fill="none" stroke="#df7619" '
            f'stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def cuadrados(n, mm=5.5):
    return '<span style="display:inline-flex;gap:.8mm">' + "".join(f'<span style="width:{mm}mm;height:{mm}mm;background:{AZUL};border-radius:.6mm"></span>' for _ in range(n)) + "</span>"


def puntos(n, mm=3.4):
    filas = [n // 2, n - n // 2]
    return ('<span style="display:inline-flex;flex-direction:column;gap:1mm">' + "".join(
        '<span style="display:flex;gap:1mm">' + "".join(f'<span style="width:{mm}mm;height:{mm}mm;border-radius:50%;background:{ROJO}"></span>' for _ in range(k)) + "</span>"
        for k in filas) + "</span>")


def pista(celdas, mm=12, robot_en=None):
    out = []
    for i, c in enumerate(celdas):
        inner = (picto(c, mm - 3) if c else "")
        if i == robot_en:
            inner = f'<span style="position:relative;display:block">{inner}<span style="position:absolute;right:-1mm;bottom:-1mm;width:6mm;height:6mm">{M.robot_svg("E", 60)}</span></span>'
        out.append(f'<div style="width:{mm}mm;height:{mm}mm;border:1.3px solid #9aa1ad;display:flex;align-items:center;justify-content:center;position:relative">'
                   f'<span style="position:absolute;top:.3mm;left:.8mm;font:600 7pt Segoe UI;color:#6b7385">{i + 1}</span>{inner}</div>')
    return f'<div style="display:flex">{"".join(out)}</div>'


def oca(n, en, dado, mm=8.2):
    """Tablero de la oca: casillas numeradas, una ficha en la casilla «en» y el dado que ha salido."""
    cel = "".join(f'<div style="width:{mm}mm;height:{mm}mm;border:1.3px solid #9aa1ad;display:flex;align-items:center;justify-content:center;'
                  f'font:600 8pt Segoe UI;color:#6b7385;background:{"#fff4e3" if i == en else "#fff"}">'
                  + (f'<span style="width:{mm * .62}mm;height:{mm * .62}mm;border-radius:50%;background:{ROJO};color:#fff;display:grid;place-items:center;font-weight:700">{i}</span>' if i == en else str(i))
                  + "</div>" for i in range(1, n + 1))
    pips = {1: [(50, 50)], 2: [(28, 28), (72, 72)], 3: [(28, 28), (50, 50), (72, 72)], 4: [(28, 28), (72, 28), (28, 72), (72, 72)],
            5: [(28, 28), (72, 28), (50, 50), (28, 72), (72, 72)], 6: [(28, 26), (28, 50), (28, 74), (72, 26), (72, 50), (72, 74)]}[dado]
    d = ('<svg viewBox="0 0 100 100" style="width:11mm;height:11mm"><rect x="5" y="5" width="90" height="90" rx="16" fill="#fff" stroke="#1a1d24" stroke-width="4"/>'
         + "".join(f'<circle cx="{x}" cy="{y}" r="9" fill="#1a1d24"/>' for x, y in pips) + "</svg>")
    return f'<div class="rt-row"><div style="display:flex">{cel}</div>{d}</div>'


def recta(maxn, icon="gato", en=0, mm=7):
    cells = "".join(f'<div style="width:{mm}mm;text-align:center;font:600 9pt Segoe UI;border-top:2px solid #1a1d24;padding-top:1mm;position:relative">'
                    f'<span style="position:absolute;top:-1.6mm;left:50%;width:2px;height:3mm;background:#1a1d24"></span>{i}</div>' for i in range(maxn + 1))
    ic = f'<img src="{M._ppath(icon)}" alt="" style="width:9mm;height:9mm;display:block;margin-left:{en * mm + mm / 2 - 4.5}mm">'
    return f'<div>{ic}<div style="display:flex">{cells}</div></div>'


def leds(lit, mm=16):
    x0, y0 = lit
    cells = "".join(f'<rect x="{2 + x * 11}" y="{2 + y * 11}" width="9" height="9" rx="1.5" fill="{ROJO if (x, y) == (x0, y0) else "#2d313a"}"/>'
                    for y in range(5) for x in range(5))
    return f'<svg viewBox="0 0 57 57" style="width:{mm}mm;height:{mm}mm"><rect width="57" height="57" rx="4" fill="#111"/>{cells}</svg>'


def barras(datos, maxv=7, mm=58):
    W, H, bw = 200, 120, 30
    out = [f'<svg viewBox="0 0 {W} {H + 34}" style="width:{mm}mm">']
    for v in range(0, maxv + 1):
        y = H - v * (H - 10) / maxv
        out.append(f'<line x1="26" x2="{W}" y1="{y}" y2="{y}" stroke="#e3e6ec"/><text x="20" y="{y + 3}" font-size="8" text-anchor="end" fill="#6b7385">{v}</text>')
    for i, (name, v) in enumerate(datos):
        x = 36 + i * 42
        y = H - v * (H - 10) / maxv
        out.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{H - y}" fill="{AZUL}"/>')
        out.append(f'<image href="{M._ppath(name)}" x="{x}" y="{H + 3}" width="{bw}" height="{bw}"/>')
    out.append(f'<line x1="26" x2="{W}" y1="{H}" y2="{H}" stroke="#1a1d24" stroke-width="1.5"/></svg>')
    return "".join(out)


def arbol_animales(mm=78):
    P = M._ppath
    n = lambda x, y, t: (f'<rect x="{x - 46}" y="{y - 12}" width="92" height="24" rx="6" fill="#fff4e6" stroke="#e07a1f" stroke-width="1.5"/>'
                         f'<text x="{x}" y="{y + 4}" font-size="10" font-weight="700" text-anchor="middle">{t}</text>')
    hoja = lambda x, y, name: f'<rect x="{x - 19}" y="{y - 19}" width="38" height="38" rx="5" fill="#fff" stroke="#9aa1ad"/><image href="{P(name)}" x="{x - 16}" y="{y - 16}" width="32" height="32"/>'
    lab = lambda x, y, t, c: f'<rect x="{x - 11}" y="{y - 7}" width="22" height="13" rx="6" fill="{c}"/><text x="{x}" y="{y + 3}" font-size="8" font-weight="700" fill="#fff" text-anchor="middle">{t}</text>'
    s = [f'<svg viewBox="0 0 300 170" style="width:{mm}mm" font-family="Segoe UI,sans-serif"><g stroke="#1a1d24" stroke-width="1.5">',
         '<line x1="150" y1="22" x2="80" y2="62"/><line x1="150" y1="22" x2="220" y2="62"/>',
         '<line x1="80" y1="74" x2="45" y2="128"/><line x1="80" y1="74" x2="115" y2="128"/><line x1="220" y1="74" x2="185" y2="128"/><line x1="220" y1="74" x2="255" y2="128"/></g>',
         n(150, 18, "¿Tiene plumas?"), n(80, 66, "¿Puede volar?"), n(220, 66, "¿Vive en el agua?"),
         lab(108, 40, "SÍ", VERDE), lab(192, 40, "NO", ROJO), lab(55, 98, "SÍ", VERDE), lab(105, 98, "NO", ROJO), lab(195, 98, "SÍ", VERDE), lab(245, 98, "NO", ROJO),
         hoja(45, 145, "pajaro"), hoja(115, 145, "avestruz"), hoja(185, 145, "pez"), hoja(255, 145, "perro"), "</svg>"]
    return "".join(s)


def diagrama(pasos):
    """Diagrama de flujo en vertical: (forma, texto) con forma o (óvalo), r (rectángulo), d (rombo con sus dos salidas)."""
    out = []
    for k, t in pasos:
        if k == "o":
            out.append(f'<div style="border:2px solid {VERDE};background:#e9f5ee;border-radius:8mm;padding:1mm 4mm;font:700 8.5pt Segoe UI">{t}</div>')
        elif k == "r":
            out.append(f'<div style="border:2px solid {AZUL};background:#eaf0fb;border-radius:1mm;padding:1mm 3mm;font:600 8.5pt Segoe UI">{t}</div>')
        else:
            q, si, no = t
            out.append(f'<div style="display:flex;align-items:center;gap:2mm"><div style="border:2px solid #df7619;background:#fff4e3;padding:1mm 3mm;'
                       f'clip-path:polygon(8% 0,92% 0,100% 50%,92% 100%,8% 100%,0 50%);font:700 8.5pt Segoe UI">{q}</div>'
                       f'<div style="font-size:8pt;line-height:1.3"><b style="color:{VERDE}">SÍ:</b> {si}<br><b style="color:{ROJO}">NO:</b> {no}</div></div>')
        out.append('<div style="font-size:9pt;line-height:1;color:#6b7385">↓</div>')
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:.6mm">' + "".join(out[:-1]) + "</div>"


def mando(mm=30):
    return (f'<svg viewBox="0 0 120 70" style="width:{mm}mm"><rect x="2" y="2" width="116" height="66" rx="10" fill="#b98a5c"/>'
            f'<polygon points="35,14 40,28 55,28 43,37 47,52 35,43 23,52 27,37 15,28 30,28" fill="#c9ced8" stroke="#6b7385"/>'
            f'<circle cx="85" cy="35" r="17" fill="#c9ced8" stroke="#6b7385"/></svg>')


def reto(n, titulo, enun, cuerpo):
    return (f'<div class="box rt"><div class="rt-h"><span class="rt-n">{n}</span>{E(titulo)}</div>'
            f'<p class="rt-e">{enun}</p><div class="rt-c">{cuerpo}</div></div>')


# ------------------------------------------------------------------ los retos de cada curso
# Cada reto: (título, enunciado, cuerpo, solución, qué evalúa)
def retos_1():
    comprueba((1, 3), "N", (2, 1), 4, "FFRF")
    for m in ("FRFF", "FFLF"):
        assert simulate((1, 3), "N", m, 4, set()) is None or simulate((1, 3), "N", m, 4, set())[0] != (2, 1)
    comprueba((0, 3), "N", (2, 1), 4, "FFRFF", "FFLFF")
    comprueba((0, 3), "N", (2, 2), 4, "FRFF", "FRFR")
    t1 = [
        ("Ordena los pasos", "Para lavarse las manos, ¿qué va primero, qué después y qué al final? Escribe 1, 2 y 3.",
         '<div class="rt-row">' + con_casilla("secar_toalla", 22) + con_casilla("grifo_abrir", 22) + con_casilla("frotar_jabon", 22) + "</div>",
         "Abrir el grifo 1, enjabonarse 2, secarse 3. En la hoja queda 3 · 1 · 2.", "4.1 · Da y sigue instrucciones en orden"),
        ("¿Qué viene ahora?", "Mira la fila. ¿Qué figura va en el hueco? Rodéala.",
         '<div class="rt-row">' + fig("c", ROJO) + fig("t", AZUL) + fig("c", ROJO) + fig("t", AZUL) + fig("c", ROJO) + hueco() + "</div>"
         + ops([fig("c", ROJO, 12), fig("t", AZUL, 12), fig("s", VERDE, 12)]),
         "B, el triángulo azul: el patrón es círculo, triángulo.", "4.1 · Patrones"),
        ("¿Qué programa llega al tesoro?", "El robot mira hacia arriba. ¿Con qué tarjetas llega al tesoro? Rodéalo.",
         '<div class="rt-row" style="flex-wrap:nowrap">' + cuad(4, (1, 3), "N", (2, 1), mm=30) + '<div style="flex:1">'
         + ops([progs("FFRF", 8, False), progs("FRFF", 8, False), progs("FFLF", 8, False)], 1) + "</div></div>",
         "A: avanza, avanza, gira a la derecha, avanza.", "4.2 · Programa el robot con tarjetas"),
        ("Busca el bicho", "Este programa tiene un bicho: el robot no llega al tesoro. Rodea la tarjeta que está mal.",
         cuad(4, (0, 3), "N", (2, 1), mm=38) + prog("FFLFF"),
         "La tarjeta 3: tiene que ser «gira a la derecha».", "4.1 · Encuentra un error y lo arregla"),
    ]
    t2 = [
        ("¿Cuántas palmadas?", "REPITE 3 veces: una palmada. ¿Cuántas palmadas damos? Rodea.",
         '<div class="rt-row">' + repite(3, 15) + picto("aplaudir", 16) + "</div>"
         + ops(['<div class="rt-row">' + picto("aplaudir", 8) + "</div>", '<div class="rt-row">' + picto("aplaudir", 8) * 2 + "</div>",
                '<div class="rt-row">' + picto("aplaudir", 8) * 3 + "</div>"]),
         "C: 3 palmadas.", "4.1 · Repetición"),
        ("Lo mismo, más corto", "El robot avanza 4 veces. ¿Qué programa corto hace lo mismo? Rodéalo.",
         prog("FFFF", False) + ops(['<div class="rt-row" style="gap:1mm;flex-wrap:nowrap">' + repite(2, 8) + tarjeta("F", 8) + "</div>",
                                    '<div class="rt-row" style="gap:1mm;flex-wrap:nowrap">' + repite(4, 8) + tarjeta("F", 8) + "</div>",
                                    '<div class="rt-row" style="gap:1mm;flex-wrap:nowrap">' + repite(4, 8) + tarjeta("R", 8) + "</div>"]),
         "B: REPITE ×4 y avanza.", "4.1 · Repetición: programas más cortos"),
        ("¿Dónde termina el robot?", "El robot sale de la casa y sigue los bloques. Rodea la casilla donde termina.",
         '<div class="rt-row" style="gap:0;flex-wrap:nowrap">' + bloque(SJ["evento"], "EMPIEZA", M.glyph("flag", "#1a1d24", 5), "hat", "#1a1d24", 22, 14)
         + bloque(SJ["mov"], "AVANZA", "", "normal", "#fff", 20, 14) + bloque(SJ["mov"], "AVANZA", "", "normal", "#fff", 20, 14)
         + bloque(SJ["fin"], "FIN", "", "end", "#fff", 15, 14) + "</div>" + pista(["casa", "", "arbol", "", "colegio"], 14),
         "En el árbol (casilla 3): avanza dos casillas desde la casa.", "4.2 · Bloques de papel"),
        ("¿Cómo sigue?", "Cada vez hay un cuadrado más. ¿Cuál es la figura siguiente? Rodéala.",
         '<div class="rt-row">' + cuadrados(1) + "<b>·</b>" + cuadrados(2) + "<b>·</b>" + cuadrados(3) + "<b>·</b> ?</div>"
         + ops([cuadrados(3, 3.8), cuadrados(4, 3.8), cuadrados(5, 3.8)]),
         "B: 4 cuadrados.", "4.1 · Patrones que crecen"),
    ]
    t3 = [
        ("¿Cuál usa menos tarjetas?", "Los dos programas llevan al robot al mismo sitio. Rodea el que usa menos tarjetas.",
         ops([prog("FFF", False), '<div class="rt-row">' + repite(3) + tarjeta("F") + "</div>"], 1),
         "B: 2 tarjetas en lugar de 3. Eso es optimizar.", "4.1 · Optimizar"),
        ("La misión en orden", "El robot sale, para en correos y llega a la meta. Escribe 1, 2 y 3 en el orden de la misión.",
         '<div class="rt-row">' + "".join(f'<div class="rt-k">{picto(n, 19)}<b style="font-size:9pt">{t}</b>{sq()}</div>'
                                         for n, t in (("buzon", "CORREOS"), ("bandera_meta", "META"), ("bandera_salida", "SALIDA"))) + "</div>",
         "Salida 1, correos 2, meta 3. En la hoja queda 2 · 3 · 1.", "4.1 · Planificar en orden"),
        ("Busca el bicho", "El robot tiene que llegar al tesoro, pero no llega. Rodea la tarjeta que está mal.",
         cuad(4, (0, 3), "N", (2, 2), mm=38) + prog("FRFR"),
         "La tarjeta 4: tiene que ser «avanza».", "4.1 · Encuentra un error y lo arregla"),
        ("¿Qué dibuja el robot?", "REPITE 4 veces: avanza y gira a la derecha. ¿Qué camino dibuja? Rodéalo.",
         '<div class="rt-row">' + repite(4, 13) + tarjeta("F", 13) + tarjeta("R", 13) + "</div>"
         + ops([camino_svg("cuadrado"), camino_svg("linea"), camino_svg("ele")]),
         "A: un cuadrado (4 lados y 4 giros iguales).", "4.1 · Repetición y figuras"),
    ]
    return t1, t2, t3


def retos_2():
    comprueba((0, 3), "N", (3, 0), 4, "FFFRFFF", "FRFRFLF")
    comprueba((0, 3), "N", (2, 1), 4, "FFRFF", "FFRFR")
    t1 = [
        ("¿Qué va en los huecos?", "Mira la fila. ¿Qué dos figuras van en los huecos? Rodea.",
         '<div class="rt-row" style="gap:1.4mm;flex-wrap:nowrap">' + fig("c", ROJO, 7.5) + fig("t", AZUL, 7.5) + fig("s", VERDE, 7.5) + fig("c", ROJO, 7.5)
         + fig("t", AZUL, 7.5) + fig("s", VERDE, 7.5) + fig("c", ROJO, 7.5) + hueco(7.5) + hueco(7.5) + "</div>"
         + ops(['<div class="rt-row" style="gap:1mm;flex-wrap:nowrap">' + fig("t", AZUL, 9) + fig("s", VERDE, 9) + "</div>", '<div class="rt-row" style="gap:1mm;flex-wrap:nowrap">' + fig("s", VERDE, 9) + fig("t", AZUL, 9) + "</div>", '<div class="rt-row" style="gap:1mm;flex-wrap:nowrap">' + fig("c", ROJO, 9) + fig("t", AZUL, 9) + "</div>"]),
         "A: triángulo y cuadrado.", "4.1 · Patrones"),
        ("Un patrón que crece", "Figura 1, figura 2, figura 3… ¿Cuántos puntos tendrá la figura 4? Rodea.",
         '<div class="rt-row">' + puntos(2) + "<b>·</b>" + puntos(4) + "<b>·</b>" + puntos(6) + "<b>·</b> ?</div>" + ops(["<b style='font-size:16pt'>7</b>", "<b style='font-size:16pt'>8</b>", "<b style='font-size:16pt'>10</b>"]),
         "B: 8 puntos (cada figura tiene 2 más).", "4.1 · Patrones que crecen"),
        ("¿Cuántas casillas?", "REPITE 3 veces: avanza, avanza. ¿Cuántas casillas avanza el robot? Rodea.",
         '<div class="rt-row">' + repite(3, 13) + tarjeta("F", 13) + tarjeta("F", 13) + "</div>" + ops(["<b style='font-size:16pt'>3</b>", "<b style='font-size:16pt'>5</b>", "<b style='font-size:16pt'>6</b>"]),
         "C: 6 casillas (2 + 2 + 2 = 3 × 2).", "4.1 · Bucles y suma repetida"),
        ("Dos bichos", "El robot tiene que llegar al tesoro. Este programa tiene dos bichos: rodea las dos tarjetas que están mal.",
         cuad(4, (0, 3), "N", (3, 0), mm=34) + progs("FRFRFLF", 9.2),
         "Las tarjetas 2 y 6: las dos tienen que ser «avanza».", "4.1 · Encuentra y arregla errores"),
    ]
    t2 = [
        ("SI… ENTONCES", "SI el muñeco está en verde, ENTONCES cruzo. SI NO, espero. El muñeco está así: ¿qué hago? Rodea.",
         picto("semaforo_peatones_rojo", 24) + ops([picto("paso_cebra", 15) + "cruzo", picto("bordillo", 15) + "espero"]),
         "B: espero en el bordillo (está en rojo).", "4.1 · Condiciones"),
        ("CUANDO pasa algo…", "Programa: CUANDO suena la campana → saltamos. Suena la campana: ¿qué hacemos? Rodea.",
         '<div class="rt-row">' + bloque(SJ["evento"], "CUANDO SUENA", M.glyph("bell", "#1a1d24", 6), "hat", "#1a1d24", 28, 15) + picto("saltar", 15) + "</div>"
         + ops([picto("aplaudir", 15), picto("saltar", 15), picto("agacharse", 15)]),
         "B: saltar.", "4.1 · Eventos"),
        ("La regla secreta", "La máquina ha repartido las cosas en dos cajas con una regla secreta. ¿En qué caja va la estrella roja? Rodea.",
         '<div class="rt-row"><div class="rt-k"><b>Caja 1</b><div class="rt-row">' + fig("c", ROJO, 8) + fig("s", ROJO, 8) + fig("t", ROJO, 8) + "</div></div>"
         + '<div class="rt-k"><b>Caja 2</b><div class="rt-row">' + fig("c", AZUL, 8) + fig("s", AZUL, 8) + fig("t", AZUL, 8) + "</div></div>"
         + fig("st", ROJO, 12) + "</div>" + ops([picto("caja", 13) + "Caja 1", picto("caja", 13) + "Caja 2"]),
         "A, la caja 1: la regla es el color (lo rojo, a la caja 1).", "4.1 · Clasificar con una regla"),
        ("El árbol de preguntas", "Pienso un animal. No tiene plumas y vive en el agua. ¿Cuál es? Rodéalo en el árbol.",
         arbol_animales(80), "El pez.", "4.1 · Preguntas de sí o no (condiciones)"),
    ]
    t3 = [
        ("Con menos tarjetas", "Este programa tiene 9 tarjetas. Con REPITE, ¿cuántas hacen falta? Rodea.",
         progs("FFFFRFFFF", 8, False) + ops(["<b style='font-size:16pt'>5</b>", "<b style='font-size:16pt'>7</b>", "<b style='font-size:16pt'>9</b>"]),
         "A: 5 tarjetas (REPITE ×4 avanza · gira · REPITE ×4 avanza).", "4.1 · Optimizar con REPITE"),
        ("El gato de ScratchJr", "El gato empieza en el 0. ¿En qué número termina? Rodéalo.",
         '<div class="rt-row" style="gap:0;flex-wrap:nowrap">' + bloque(SJ["evento"], "", M.glyph("flag", "#1a1d24", 6), "hat", "#1a1d24", 16, 15)
         + bloque(SJ["mov"], "AVANZA 2", "", "normal", "#fff", 24, 15) + bloque(SJ["mov"], "AVANZA 3", "", "normal", "#fff", 24, 15)
         + bloque(SJ["fin"], "FIN", "", "end", "#fff", 15, 15) + "</div>" + recta(8, "gato", 0, 8),
         "En el 5 (2 + 3).", "4.2 · ScratchJr"),
        ("Cuando lo toco", "¿Con qué bloque hace algo el gato cuando lo tocas? Rodéalo.",
         ops([bloque(SJ["evento"], "EMPIEZA", M.glyph("flag", "#1a1d24", 6), "hat", "#1a1d24", 25, 16),
              bloque(SJ["evento"], "CUANDO TOCO", M.glyph("touch", "#1a1d24", 6), "hat", "#1a1d24", 25, 16),
              bloque(SJ["fin"], "FIN", "", "end", "#fff", 18, 16)]),
         "B: «cuando toco» (la mano amarilla).", "4.1 · Eventos"),
        ("Busca el bicho", "El robot tiene que llegar al tesoro. Rodea la tarjeta que está mal.",
         cuad(4, (0, 3), "N", (2, 1), mm=38) + prog("FFRFR"),
         "La tarjeta 5: tiene que ser «avanza».", "4.1 · Encuentra y arregla errores"),
    ]
    return t1, t2, t3


def retos_3():
    t1 = [
        ("El diagrama", "Sigue el diagrama con el número 14. ¿Con qué número terminas?",
         diagrama([("o", "EMPIEZA"), ("r", "Número: 14"), ("d", ("¿Es mayor que 10?", "réstale 10", "súmale 5")),
                   ("d", ("¿Es par?", "divídelo entre 2", "súmale 1")), ("o", "TERMINA")]) + resp(),
         "2: 14 es mayor que 10 → 4; 4 es par → 2.", "4.1 · Diagramas de flujo"),
        ("Un triángulo", "Para dibujar un triángulo: REPITE 3 veces · avanza 3 · gira __ grados. ¿Cuánto hay que girar? Rodea.",
         '<div class="rt-row">' + fig("t", VERDE, 18) + "</div>" + ops(["<b style='font-size:15pt'>60°</b>", "<b style='font-size:15pt'>90°</b>", "<b style='font-size:15pt'>120°</b>"]),
         "C: 120 grados (360 ÷ 3). 60 es el ángulo de dentro, no el giro.", "4.1 · Bucles y polígonos"),
        ("La oca de las condiciones", "Estás en la casilla 6 y sacas un 5. La regla dice: «SI sacas par, avanza 2. SI NO, retrocede 1». ¿En qué casilla acabas?",
         oca(10, 6, 5) + resp("Casilla:"),
         "En la 5: el 5 es impar, así que retrocedes 1.", "4.1 · Condiciones (si… si no)"),
        ("El gráfico de la votación", "¿Qué mascota es la más votada (la moda)? ¿Cuántos votos hay en total?",
         barras([("perro", 6), ("gato", 4), ("pez", 2), ("pajaro", 5)]) + resps("Moda:", "Total:"),
         "Moda: el perro (6 votos). Total: 17 votos.", "4.1 · Datos: tablas y gráficos"),
    ]
    t2 = [
        ("¿Qué dice el gato?", "Lee el programa. ¿Qué número dice el gato al final?",
         pila(sb("eve", "al hacer clic en " + M.FLAG, True), sb("var", "dar a puntos el valor 0"), sc("con", "repetir 3", sb("var", "sumar a puntos 2")), sb("apa", "decir puntos")) + resp(),
         "6 (0 + 2 + 2 + 2).", "4.2 · Scratch: variables y bucles"),
        ("Las flechas", "El gato está en x: 0. Pulsas → , → y ← . ¿En qué x termina?",
         pila(sb("eve", "al presionar tecla flecha derecha", True), sb("mov", "sumar a x 10")) + pila(sb("eve", "al presionar tecla flecha izquierda", True), sb("mov", "sumar a x -10")) + resp("x:"),
         "x: 10 (10 + 10 − 10).", "4.2 · Scratch: eventos y coordenadas"),
        ("Busca el bicho", "Los puntos se borran todo el rato y nunca suben. ¿Qué bloque está mal colocado? Rodéalo.",
         pila(sb("eve", "al hacer clic en " + M.FLAG, True), sc("con", "por siempre", sb("var", "dar a puntos el valor 0"),
                                                          sif("¿tocando Manzana?", [sb("var", "sumar a puntos 1")]))),
         "«dar a puntos el valor 0»: va antes del «por siempre», no dentro.", "4.1 · Depura"),
        ("Los disfraces", "El gato tiene 2 disfraces y empieza con el 1. ¿Con qué disfraz termina? Rodea.",
         pila(sb("eve", "al hacer clic en " + M.FLAG, True), sb("apa", "cambiar disfraz a disfraz1"), sc("con", "repetir 5", sb("apa", "siguiente disfraz")))
         + ops([picto("gato", 13) + "disfraz 1", picto("gato_tumbado", 13) + "disfraz 2"]),
         "B, el disfraz 2: cambia 5 veces (1 → 2 → 1 → 2 → 1 → 2).", "4.1 · Bucles (repetir)"),
    ]
    t3 = [
        ("¿Qué conduce?", "¿Qué objetos dejan pasar la electricidad? Rodéalos todos.",
         ops([picto("aluminio", 12) + "aluminio", picto("goma", 12) + "goma", picto("lapiz", 12) + "mina del lápiz",
              picto("madera", 12) + "madera", picto("cuchara", 12) + "cuchara de metal", picto("papel", 12) + "papel"], 3, "ABCDEF"),
         "A, C y E: aluminio, mina de grafito y metal. No conducen la goma, la madera ni el papel.", "4.2 · Circuitos: conductores y aislantes"),
        ("¿Suena o no suena?", "El plátano está conectado a ESPACIO en el Makey Makey. ¿En qué caso suena la nota? Rodea.",
         ops([picto("platano", 11) + "Ana toca el plátano, pero no toca EARTH.", picto("platano", 11) + "Leo sujeta la pinza de EARTH y toca el plátano.",
              picto("madera", 11) + "Eva sujeta EARTH y toca la mesa de madera."], 1),
         "B: el circuito se cierra (EARTH, Leo y el plátano).", "4.2 · Makey Makey: el circuito cerrado"),
        ("Más corto", "Este programa repite lo mismo 4 veces. Con un «repetir», ¿cuántos bloques quedan debajo del evento? Rodea.",
         '<div class="rt-row" style="flex-wrap:nowrap;align-items:center;width:100%">'
         + pila(sb("eve", "al hacer clic en " + M.FLAG, True), *([sb("mov", "mover 10 pasos"), sb("con", "esperar 0.5 segundos")] * 4), sm=True)
         + '<div style="width:22mm">' + ops(["<b style='font-size:14pt'>3</b>", "<b style='font-size:14pt'>4</b>", "<b style='font-size:14pt'>8</b>"], 1) + "</div></div>",
         "A: 3 (repetir 4 con «mover» y «esperar» dentro). Antes había 8.", "4.1 · Optimizar"),
        ("El mando", "En el mando, la estrella va a ESPACIO y el círculo a FLECHA ARRIBA. ¿Qué botón hace que diga «El Retiro»? Rodea.",
         '<div class="rt-row">' + mando(32) + pila(sb("eve", "al presionar tecla espacio", True), sb("apa", "decir El Retiro"))
         + pila(sb("eve", "al presionar tecla flecha arriba", True), sb("apa", "decir La Cibeles")) + "</div>"
         + ops([fig("st", "#9aa1ad", 12) + "estrella", fig("c", "#9aa1ad", 12) + "círculo"]),
         "A: la estrella (va a ESPACIO).", "4.2 · Makey Makey y Scratch: eventos"),
    ]
    return t1, t2, t3


def retos_4():
    t1 = [
        ("El rosetón", "¿Cuántos cuadrados dibuja este programa? Sumando solo los giros de 30 grados, ¿cuántos grados gira en total?",
         pila(sc("con", "repetir 12", sc("con", "repetir 4", sb("mov", "mover 80 pasos"), sb("mov", "girar ↻ 90 grados")), sb("mov", "girar ↻ 30 grados")))
         + resps("Cuadrados:", "Grados:"),
         "12 cuadrados. 12 × 30 = 360 grados: una vuelta entera.", "4.1 · Bucles anidados"),
        ("La variable", "¿Cuánto vale puntos al final?",
         pila(sb("eve", "al hacer clic en " + M.FLAG, True), sb("var", "dar a puntos el valor 5"), sb("var", "sumar a puntos 3"),
              sb("var", "sumar a puntos -2"), sb("var", "sumar a puntos 4")) + resp("puntos ="),
         "10 (5 + 3 − 2 + 4).", "4.1 · Variables"),
        ("Adivina el número", "El ordenador piensa un número del 1 al 20. Dices 10: «es más grande». Dices 15: «es más pequeño». ¿Qué números pueden ser? ¿Cuál dirías ahora?",
         resps("Pueden ser:", "Diría:"),
         "11, 12, 13 o 14. Lo mejor es partir por la mitad: 12 o 13.", "4.1 · Condiciones (mayor y menor) y estrategia"),
        ("El resto", "Completa. ¿Es par o impar? ¿Es múltiplo de 5?",
         '<div class="rt-scr" style="font-size:11pt;gap:3mm"><span>23 módulo 2 = ___ → ¿par o impar? ________</span><span>30 módulo 5 = ___ → ¿múltiplo de 5? ________</span></div>',
         "23 módulo 2 = 1 → impar. 30 módulo 5 = 0 → sí, es múltiplo de 5.", "4.1 · Resto de la división (módulo)"),
    ]
    t2 = [
        ("Coordenadas", "El personaje está en x: −50. Pulsas la flecha derecha 3 veces. ¿En qué x acaba?",
         pila(sb("eve", "al presionar tecla flecha derecha", True), sb("mov", "sumar a x 20")) + resp("x:"),
         "x: 10 (−50 + 20 + 20 + 20).", "4.2 · Scratch: coordenadas"),
        ("Puntos y vidas", "Empiezas con 0 puntos y 3 vidas. Coges 4 premios y el enemigo te toca 2 veces. ¿Cuántos puntos y vidas tienes? ¿Has perdido?",
         pila(sif("¿tocando Premio?", [sb("var", "sumar a puntos 1")]), sif("¿tocando Enemigo?", [sb("var", "sumar a vidas -1")]),
              sif("vidas = 0", [sb("apa", "decir Has perdido")])) + resps("Puntos:", "Vidas:"),
         "4 puntos y 1 vida: todavía no has perdido.", "4.1 · Variables y condiciones"),
        ("Mensajes", "Al llegar a 5 puntos, el premio envía «nivel 2». ¿Qué pasa? Rodea todo lo que ocurre.",
         pila(sif("puntos = 5", [sb("eve", "enviar nivel 2")])) + '<div class="rt-row">'
         + pila(sb("eve", "al recibir nivel 2", True), sb("apa", "cambiar fondo a noche")) + pila(sb("eve", "al recibir nivel 2", True), sb("var", "dar a velocidad el valor 10")) + "</div>"
         + ops(["Cambia el fondo", "El enemigo va más rápido", "El personaje se esconde"]),
         "A y B. Ningún programa hace C.", "4.2 · Eventos múltiples: mensajes"),
        ("Busca el bicho", "Cuando el enemigo toca al personaje, se pierden las 3 vidas de golpe. ¿Por qué? ¿Cómo lo arreglas?",
         pila(sb("eve", "al hacer clic en " + M.FLAG, True), sc("con", "por siempre", sif("¿tocando Personaje?", [sb("var", "sumar a vidas -1")])))
         + resps("Por qué:", "Arreglo:"),
         "Mientras se tocan, el «si» se cumple muchas veces por segundo. Arreglo: después de restar, «ir a posición aleatoria» o «esperar 1 segundos».", "4.1 · Depura y mejora"),
    ]
    t3 = [
        ("El quiz del mando", "En esta pregunta, la respuesta buena es la 2 (correcta = 2). Pulsas el botón 3 y después el 2. ¿Cuántos puntos? ¿Cuántas veces dice «Inténtalo otra vez»?",
         pila(sb("eve", "al presionar tecla flecha derecha (botón 3)", True), sif("correcta = 3", [sb("var", "sumar a puntos 1")], [sb("apa", "decir Inténtalo otra vez")])) + '<p class="rt-t">(los botones 1 y 2 tienen el mismo programa, con su número)</p>'
         + resps("Puntos:", "«Inténtalo otra vez»:"),
         "1 punto y 1 «Inténtalo otra vez».", "4.1 · Variables y condiciones"),
        ("Un bloque propio", "El gato está en y: 0 y usa «saltar 50». ¿Hasta qué y sube? ¿En qué y termina?",
         pila(sb("eve", "definir saltar (altura)", True), sb("mov", "sumar a y altura"), sb("con", "esperar 0.3 segundos"), sb("mov", "sumar a y (0 - altura)"))
         + resps("Sube hasta y:", "Termina en y:"),
         "Sube hasta y: 50 y vuelve a y: 0.", "4.1 · Bloques propios: generalizar"),
        ("Optimizar", "Este programa hace lo mismo 4 veces seguidas. ¿Cuántos bloques tiene? ¿Cuántos con un «repetir»?",
         '<div class="rt-row" style="flex-wrap:nowrap;align-items:center;width:100%">'
         + pila(sb("eve", "al hacer clic en " + M.FLAG, True), *([sb("mov", "mover 10 pasos"), sb("mov", "girar ↻ 90 grados")] * 4), sm=True)
         + '<div style="flex:1">' + resps("Ahora:", "Con repetir:") + "</div></div>",
         "Ahora 8; con «repetir 4» y los dos dentro, 3. Se ahorran 5.", "4.1 · Optimizar"),
        ("El vídeo para el QR", "Vais a grabar un vídeo de vuestro juego para un código QR. ¿Qué se puede grabar? Rodea.",
         ops([picto("mano", 13) + "Las manos pulsando el mando", picto("foto", 13) + "Las caras de los compañeros", picto("escribir", 13) + "El nombre completo de un alumno"]),
         "Solo A. Sin caras ni nombres completos: lo que se sube a internet se queda.", "Uso responsable: huella digital"),
    ]
    return t1, t2, t3


def retos_5():
    t1 = [
        ("El contador", "El contador empieza en 0. Pulsas B, A, A, B, B, B. ¿Qué número sale al final?",
         mkc("inp", "al presionarse el botón A", mk("var", "cambiar contador por 1"), mk("bas", "mostrar número contador"))
         + mkc("inp", "al presionarse el botón B", mif(("contador > 0", [mk("var", "cambiar contador por -1")])), mk("bas", "mostrar número contador")) + resp(),
         "0: B (sigue en 0), A (1), A (2), B (1), B (0), B (sigue en 0: no baja de 0).", "4.1 · Variables y condiciones"),
        ("El dado", "¿Qué números pueden salir con «escoger al azar de 1 a 6»? Si alguien pone «de 0 a 6», ¿qué número puede salir que no está en un dado?",
         mkc("inp", "si agitar", mk("bas", "mostrar número (escoger al azar de 1 a 6)")) + resps("Pueden salir:", "Con «de 0 a 6»:"),
         "Del 1 al 6. Con «de 0 a 6» puede salir el 0.", "4.2 · MakeCode: números al azar"),
        ("La pantalla de luces", "«graficar x 1 y 3»: ¿qué luz se enciende? Rodea. (La x cuenta columnas desde 0 por la izquierda; la y, filas desde 0 por arriba.)",
         ops([leds((3, 1)), leds((1, 3)), leds((1, 1))]),
         "B: columna 1 (la segunda) y fila 3 (la cuarta).", "4.1 · Coordenadas en la pantalla 5 × 5"),
        ("La lamparita", "Con este programa, ¿se encienden las luces si el nivel de luz es 20? ¿Y si es 80? ¿Y si es 50?",
         mkc("bas", "para siempre", mif(("nivel de luz < 50", [mk("bas", "mostrar LEDs (todas)")]), (None, [mk("bas", "borrar la pantalla")])))
         + resps("Con 20:", "Con 80:", "Con 50:"),
         "Con 20, sí. Con 80, no. Con 50, no: 50 no es menor que 50.", "4.1 · Sensores y umbral"),
    ]
    t2 = [
        ("Elige el umbral", "Medidas de luz con la placa destapada: 180, 200 y 160. Tapada: 20, 35 y 15. ¿Qué umbral separa bien el día de la noche? Rodea.",
         ops(["<b style='font-size:15pt'>10</b>", "<b style='font-size:15pt'>100</b>", "<b style='font-size:15pt'>190</b>"]),
         "B: 100. Con 10, la placa tapada (20, 35) parece de día; con 190, la destapada (160, 180) parece de noche.", "4.2 · Sensores: elegir el umbral"),
        ("La alarma del estuche", "La alarma empieza desactivada. Pasa esto: agitas, pulsas A, agitas, pulsas B, agitas. ¿Cuántas veces suena?",
         mkc("inp", "al presionarse el botón A", mk("var", "fijar activada a 1")) + mkc("inp", "al presionarse el botón B", mk("var", "fijar activada a 0"))
         + mkc("inp", "si agitar", mif(("activada = 1", [mk("mus", "reproduce secuencia tono")]))) + resp(),
         "Una vez: solo en la segunda sacudida, cuando estaba activada.", "4.1 · Estados (variable) y condiciones"),
        ("Busca el bicho", "Esta lamparita de noche está mal. ¿Cuándo se encienden las luces? ¿Qué hay que cambiar?",
         mkc("bas", "para siempre", mif(("nivel de luz > 50", [mk("bas", "mostrar LEDs (todas)")]), (None, [mk("bas", "borrar la pantalla")])))
         + resps("Se encienden:", "Cambio:"),
         "Se encienden con mucha luz (de día). Hay que cambiar > por <.", "4.1 · Depura"),
        ("La media", "Tres medidas de temperatura: 20 °C, 22 °C y 24 °C. ¿Cuál es la media? Si tienes la placa en la mano, ¿por qué marca más?",
         resps("Media:", "Porque:"),
         "22 °C. Marca más porque la placa mide la temperatura de su chip, y la mano lo calienta.", "4.1 · Datos: la media"),
    ]
    t3 = [
        ("Velocidad y tiempo", "El Nezha avanza 25 cm en 1 segundo. ¿Cuántos segundos necesita para 1,5 m? ¿Qué número pones en «pausa (ms)»?",
         resps("Segundos:", "pausa (ms):"),
         "6 segundos (150 ÷ 25) → pausa (ms) 6000.", "4.1 · Proporcionalidad: velocidad y tiempo"),
        ("¿Cuál va recto?", "En el coche del kit, los motores van en espejo. ¿Qué programa hace que vaya recto? Rodea.",
         ops([mk("var", "Set motor M1 speed to 50 %") + mk("var", "Set motor M2 speed to 50 %"), mk("var", "Set motor M1 speed to 50 %") + mk("var", "Set motor M2 speed to -50 %"),
              mk("var", "Set motor M1 speed to 0 %") + mk("var", "Set motor M2 speed to 50 %")], 1),
         "B. A gira sobre sí mismo (mismo signo) y C gira hacia un lado.", "4.2 · Robot Nezha: motores"),
        ("La máquina que aprende", "Una máquina ha aprendido solo con fotos de manzanas rojas. Le enseñas una manzana verde. ¿Qué pasa? Rodea.",
         '<div class="rt-row">' + picto("manzana_roja", 12) * 3 + "<b>→</b>" + picto("manzana_verde", 14) + "</div>"
         + ops(["La reconoce sin problema", "Se equivoca: todos sus ejemplos eran rojos", "Aprende sola el color verde"], 1),
         "B: los datos no eran variados (sesgo).", "IA: datos y sesgo"),
        ("¿Verdad o bulo?", "¿Qué mensaje hay que comprobar antes de creerlo o reenviarlo? Rodea.",
         ops(["«Un colegio de Madrid instala huertos en su patio»", "«¡Mañana no hay clase en toda España! ¡Pásalo!»", "«La NASA publica nuevas fotos de Marte»"], 1),
         "B: pide que lo reenvíes y no dice quién lo dice. Se comprueba en una fuente oficial.", "Uso responsable: contrastar la información"),
    ]
    return t1, t2, t3


def retos_6():
    t1 = [
        ("La mascota virtual", "El hambre empieza en 5. Pulsas A dos veces, pasan 20 segundos y agitas la placa. ¿Cuánta hambre tiene? ¿Está triste?",
         '<div class="rt-row" style="flex-wrap:nowrap;align-items:center;width:100%">'
         + pila(mkc("inp", "al presionarse el botón A", mif(("hambre > 0", [mk("var", "cambiar hambre por -1")]))), mkc("inp", "si agitar", mk("var", "cambiar hambre por 1")),
                mkc("bas", "para siempre", mk("bas", "pausa (ms) 10000"), mk("var", "cambiar hambre por 1"), mif(("hambre > 8", [mk("bas", "mostrar ícono (triste)")]))), sm=True)
         + '<div style="flex:1">' + resps("Hambre:", "¿Triste?:") + "</div></div>",
         "6 (5 − 2 + 2 + 1). No está triste: hace falta más de 8.", "4.1 · Estados y eventos múltiples"),
        ("El juego de reflejos", "«listo» vale falso hasta que sale el icono. Alguien pulsa A antes del icono. Sale el icono, pulsa B y después A. ¿Quién gana?",
         mkc("inp", "al presionarse el botón A", mif(("listo", [mk("var", "fijar listo a falso"), mk("bas", "mostrar cadena \"A\"")]))) + '<p class="rt-t">(el botón B, igual con «B»)</p>' + resp("Gana:"),
         "B. Antes del icono, «listo» es falso y A no cuenta; después, B lo pone a falso y el segundo A ya no cuenta.", "4.1 · Condiciones y variables lógicas"),
        ("Media, máximo y mínimo", "Temperaturas en cuatro sitios del cole: 19, 21, 24 y 20 °C. Calcula la media, el máximo y el mínimo.",
         resps("Media:", "Máximo:", "Mínimo:"),
         "Media 21 °C (84 ÷ 4). Máximo 24 °C. Mínimo 19 °C.", "4.1 · Datos: media, máximo y mínimo"),
        ("Milisegundos", "Completa: pausa (ms) 2500 son ___ segundos. 4 segundos son pausa (ms) ___.",
         resps("2500 ms =", "4 s ="),
         "2,5 segundos. 4000 ms.", "4.1 · Medida del tiempo"),
    ]
    t2 = [
        ("Engranajes", "El engranaje del motor tiene 12 dientes y el otro, 36. Si el del motor da 3 vueltas, ¿cuántas da el otro? ¿Gira más rápido o más despacio?",
         resps("Vueltas:", "Gira:"),
         "1 vuelta (3 × 12 ÷ 36). Más despacio, y con más fuerza.", "4.2 · Mecanismos"),
        ("El cuadrado del Nezha", "El robot avanza 25 cm en 1 s. ¿Qué pausa (ms) necesita para 50 cm? Si girar 90° son 600 ms, ¿cuántos ms para 120°?",
         resps("50 cm:", "120°:"),
         "2000 ms. 800 ms (600 × 120 ÷ 90).", "4.1 · Proporcionalidad y ángulos"),
        ("Funciones", "En este programa, ¿cuántas veces se ejecuta «girar_derecha»? Si cambias el tiempo del giro, ¿en cuántos sitios lo cambias?",
         mkc("inp", "al presionarse el botón A", mkc("loo", "repetir 4 veces", mk("fun", "llamada avanzar"), mk("fun", "llamada girar_derecha"))) + resps("Veces:", "Sitios:"),
         "4 veces. En 1 sitio: dentro de la función.", "4.1 · Funciones: generalizar y optimizar"),
        ("Polaridad", "Los motores van en espejo: M1 50 y M2 −50, el coche va recto hacia delante. ¿Qué hace con M1 50 y M2 50? ¿Y con M1 −50 y M2 50?",
         resps("M1 50 · M2 50:", "M1 −50 · M2 50:"),
         "Con 50 y 50 gira sobre sí mismo. Con −50 y 50 va recto hacia atrás.", "4.2 · Robot: polaridad"),
    ]
    t3 = [
        ("Radio", "La placa A está en el grupo 7 y envía un número. ¿Qué placas lo reciben? Rodéalas.",
         '<div class="rt-row">' + placa("A", 7, True) + placa("B", 7) + placa("C", 8) + placa("D", 7) + "</div>" + resp("Lo reciben:"),
         "B y D, las del mismo grupo. Por eso cada equipo usa su número de grupo.", "4.2 · Comunicación por radio"),
        ("Medidas en 3D", "Una pieza mide 4 cm. ¿Qué número escribes en Tinkercad, que trabaja en milímetros? Un dibujo a escala 1:2 mide 6 cm: ¿cuánto mide de verdad?",
         resps("En Tinkercad:", "De verdad:"),
         "40 mm. 12 cm (el doble del dibujo).", "4.1 · Medida y escala"),
        ("El semáforo de ruido", "Lee el programa. ¿Qué cara sale con un nivel de sonido de 160? ¿Y de 120? ¿Y de 60?",
         mkc("bas", "para siempre", mif(("nivel de sonido > 150", [mk("bas", "mostrar ícono (triste)")]), ("nivel de sonido > 90", [mk("bas", "mostrar ícono (meh)")]),
                                        (None, [mk("bas", "mostrar ícono (feliz)")])))
         + resps("160:", "120:", "60:"),
         "160, triste. 120, la seria (meh). 60, feliz.", "4.1 · Condiciones encadenadas"),
        ("¿Imagen real o hecha con IA?", "¿Qué ayuda a saber si una imagen es real o está hecha con IA? Rodea todo lo que ayuda.",
         ops(["Buscar de dónde viene la imagen", "Fijarse en detalles raros: manos, letras, sombras", "Creérsela porque parece muy real"], 1),
         "A y B. Que parezca real no prueba nada.", "IA generativa: uso crítico"),
    ]
    return t1, t2, t3


CURSOS = [("1º", "c1", retos_1, "1º S8, S15, S23 o una sesión de reserva"), ("2º", "c2", retos_2, "2º S8, S15, S21 o una sesión de reserva"),
          ("3º", "c3", retos_3, "3º S8, S16, S23 o una sesión de reserva"), ("4º", "c4", retos_4, "4º S8, S16, S23 o una sesión de reserva"),
          ("5º", "c5", retos_5, "5º S3, S7, S12 o una sesión opcional"), ("6º", "c6", retos_6, "6º S3, S7, S11 o una sesión opcional")]
TRIM = ["primer", "segundo", "tercer"]


def paginas():
    out = []
    for curso, col, fn, ses in CURSOS:
        lee = curso in ("1º", "2º")
        uso = ("<b>Cómo usarla:</b> una hoja por alumno al final del trimestre (15-20 minutos). "
               + ("El docente lee cada reto en voz alta; se responde rodeando o escribiendo el número. " if lee else "Individual y con calma. ")
               + "No es un examen: es una evidencia para la rúbrica (M19). Las soluciones están en la última hoja del curso.")
        tri = fn()
        for k, retos in enumerate(tri):
            body = (CSS + '<div class="rt-nom"><span>Nombre:</span><span>Fecha:</span></div><div class="rt-grid">'
                    + "".join(reto(i + 1, r[0], r[1], r[2]) for i, r in enumerate(retos)) + "</div>")
            out.append(M.page("M28", f"Retos del {TRIM[k]} trimestre · {curso}", curso, ses, uso, body, col, f"{curso} · {k + 1}.º trimestre"))
        filas = ""
        for k, retos in enumerate(tri):
            filas += f'<h2>{TRIM[k].capitalize()} trimestre</h2><table><tr><th style="width:22%">Reto</th><th>Solución</th><th style="width:27%">Qué evalúa</th></tr>'
            filas += "".join(f"<tr><td><b>{i + 1}.</b> {E(r[0])}</td><td>{E(r[3])}</td><td>{E(r[4])}</td></tr>" for i, r in enumerate(retos)) + "</table>"
        uso_d = ("<b>Para el docente.</b> Cada reto indica el criterio de la competencia específica 4 (4.1: pensamiento computacional; "
                 "4.2: herramientas tecnológicas) o el aspecto de uso responsable que trabaja. Si alguien falla, que explique cómo lo ha pensado: "
                 "el razonamiento cuenta más que el resultado. Anotad lo que veáis en el registro de la rúbrica (M19).")
        out.append(M.page("M28", f"Retos del trimestre · {curso} · soluciones", curso, "Para el docente", uso_d,
                          CSS + f'<div class="rt-sol">{filas}</div>', col, f"{curso} · soluciones"))
    return out
