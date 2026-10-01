# Genera el material imprimible (HTML -> PDF con Edge sin interfaz).
# Uso: python materiales.py   -> crea los PDF en "../Material imprimible" y en web/materiales/
import html
import random
import subprocess
import time
from pathlib import Path

from svgkit import (C, SJ, arrow_svg, grid_svg, path_cells, puzzle_block, robot_svg, shape_svg, simulate, solve)

HERE = Path(__file__).resolve().parent
SRC = HERE / "materiales" / "src"
OUT_WEB = HERE / "materiales"
OUT_ROOT = HERE.parent / "Material imprimible"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
E = html.escape
ARROW_COLOR = {"F": "#2c5bbf", "R": "#2a8f4f", "L": "#df7619", "B": "#6c44b0"}
ARROW_NAME = {"F": "AVANZA", "R": "GIRA A LA DERECHA", "L": "GIRA A LA IZQUIERDA", "B": "RETROCEDE"}

CSS = """
@page{size:A4;margin:9mm}
*{box-sizing:border-box}
body{margin:0;font-family:'Segoe UI',system-ui,sans-serif;color:#1a1d24;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{page-break-after:always;height:277mm;overflow:hidden;display:flex;flex-direction:column;gap:5mm}
.page:last-child{page-break-after:auto}
.hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid #1a1d24;padding-bottom:2.5mm}
.hd .k{font:600 8.5pt 'Segoe UI';letter-spacing:.12em;text-transform:uppercase;color:#6b7385}
.hd h1{font:700 19pt/1.1 Bahnschrift,'Segoe UI',sans-serif;margin:1mm 0 0;letter-spacing:-.01em}
.hd .code{font:700 24pt Bahnschrift,'Segoe UI';color:#fff;background:var(--c,#2c5bbf);padding:1mm 4mm;border-radius:2mm}
.meta{display:flex;gap:6mm;font-size:9pt;color:#434a59;flex-wrap:wrap}
.meta b{color:#1a1d24}
.uso{background:#f3f4f6;border-left:4px solid var(--c,#2c5bbf);padding:2mm 4mm;font-size:9pt;line-height:1.35}
.uso p{margin:0}
.ft{margin-top:auto;font-size:7.5pt;color:#8a92a3;display:flex;justify-content:space-between;border-top:1px solid #dfe3ea;padding-top:1.5mm}
.cards{display:grid;gap:0;flex:1;min-height:0}
.card{border:1.2px dashed #9aa1ad;padding:4mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2mm;text-align:center;break-inside:avoid}
.card .lbl{font:700 15pt/1.1 Bahnschrift,'Segoe UI';letter-spacing:.02em}
.card .sub{font-size:9pt;color:#6b7385}
.bigicon{font-size:52pt;line-height:1}
h2{font:700 13pt Bahnschrift,'Segoe UI';margin:2mm 0 1mm}
table{border-collapse:collapse;width:100%;font-size:10pt}
td,th{border:1px solid #9aa1ad;padding:2mm;vertical-align:top}
th{background:#f3f4f6;text-align:left}
.line{border-bottom:1px solid #9aa1ad;height:9mm}
.box{border:1.5px solid #1a1d24;border-radius:2mm;padding:3mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm}
.small{font-size:8.5pt;color:#6b7385}
.sol{font-size:9pt;background:#fff8e6;border:1px solid #f0d58a;border-radius:2mm;padding:2.5mm 3.5mm}
.prog{display:flex;gap:1.5mm;flex-wrap:wrap;justify-content:center}
.prog .cell{width:12mm;height:12mm;border:1.2px solid #9aa1ad;border-radius:1.5mm;display:flex;align-items:center;justify-content:center;position:relative}
.prog .cell i{position:absolute;top:-3.2mm;left:0;right:0;font:600 7pt 'Segoe UI';color:#6b7385;font-style:normal}
.prog .cell.bug{outline:2.5px solid #cf3f36;outline-offset:1px}
.seq{display:flex;gap:2mm;align-items:center}
.seq .it{width:12.5mm;height:12.5mm}
"""


def page(code, title, courses, sessions, uso, body, color="c5", subtitle="", style=""):
    return f'''<section class="page" style="--c:{C[color]};{style}">
<div class="hd"><div><div class="k">Código Escuela 4.0 · Material imprimible{(" · " + E(subtitle)) if subtitle else ""}</div><h1>{E(title)}</h1></div><div class="code">{code}</div></div>
<div class="meta"><span><b>Cursos:</b> {E(courses)}</span><span><b>Se usa en:</b> {E(sessions)}</span></div>
<div class="uso"><p>{uso}</p></div>
{body}
{credit_line() if "/picto/" in body and "Sergio Palao" not in body else ""}
<div class="ft"><span>Guía didáctica Código Escuela 4.0 · Primaria · 2026-2027</span><span>{code} · {E(title)}</span></div>
</section>'''


def cards(items, cols, rows):
    cells = "".join(f'<div class="card">{it}</div>' for it in items)
    return f'<div class="cards" style="grid-template-columns:repeat({cols},minmax(0,1fr));grid-template-rows:repeat({rows},minmax(0,1fr))">{cells}</div>'


def arrow_card(k, big=True):
    return f'<div style="width:{"52mm" if big else "30mm"};height:{"52mm" if big else "30mm"}">{arrow_svg(k, 100, ARROW_COLOR[k])}</div><div class="lbl">{ARROW_NAME[k]}</div>'


def repeat_card(n):
    return (f'<div style="width:52mm;height:52mm;border-radius:7mm;background:{SJ["ctrl"]};display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff">'
            f'<div style="font:700 20pt Bahnschrift">REPITE</div><div style="font:700 64pt/1 Bahnschrift">×{n}</div></div><div class="lbl">REPITE {n} VECES</div>'
            f'<div class="sub">Se pone delante de las tarjetas que se repiten</div>')


def mini_prog(prog, bugs=(), numbered=True, blanks=0):
    out = []
    for i, c in enumerate(prog):
        out.append(f'<div class="cell{" bug" if i in bugs else ""}">{("<i>" + str(i + 1) + "</i>") if numbered else ""}<div style="width:10mm;height:10mm">{arrow_svg(c, 100, ARROW_COLOR[c])}</div></div>')
    for i in range(blanks):
        out.append(f'<div class="cell">{("<i>" + str(len(prog) + i + 1) + "</i>") if numbered else ""}</div>')
    return f'<div class="prog">{"".join(out)}</div>'

# ------------------------------------------------------------------ materiales


def m01():
    pages = []
    uso = ("<b>Cómo usarlo:</b> imprime un juego por grupo (la primera hoja, dos veces) en cartulina o papel grueso y plastifícalo si puedes. "
           "Recorta por la línea de puntos. Sirven para el robot humano, los caminos en cuadrícula y como guía para programar True True.")
    pages.append(page("M01", "Tarjetas de flechas", "1º, 2º y 3º", "1º S1, S4, S9 · 2º S1, S4 · 3º S1, S3", uso,
                      cards([arrow_card("F")] * 6, 2, 3), "c1", "Hoja 1 de 3"))
    pages.append(page("M01", "Tarjetas de flechas", "1º, 2º y 3º", "1º S1, S4, S9 · 2º S1, S4 · 3º S1, S3", uso,
                      cards([arrow_card("R")] * 3 + [arrow_card("L")] * 3, 2, 3), "c1", "Hoja 2 de 3"))
    pages.append(page("M01", "Tarjetas de flechas", "1º, 2º y 3º", "1º S1, S4, S9 · 2º S1, S4 · 3º S1, S3", uso,
                      cards([repeat_card(2), repeat_card(3), repeat_card(4), arrow_card("B"),
                             '<div style="width:52mm;height:52mm;border-radius:7mm;background:#e0443a;display:flex;align-items:center;justify-content:center;color:#fff;font:700 26pt Bahnschrift">FIN</div><div class="lbl">FIN DEL PROGRAMA</div>',
                             '<div style="width:52mm;height:52mm;border-radius:7mm;border:3px dashed #9aa1ad"></div><div class="lbl">TARJETA LIBRE</div><div class="sub">Para inventar una orden nueva</div>'], 2, 3), "c1", "Hoja 3 de 3"))
    return pages







def block(color, label, icon="", kind="normal", tc="#fff"):
    ic = f'<span style="font-size:22pt;line-height:1">{icon}</span>' if icon else ""
    return f'<div style="width:62mm;height:36mm">{puzzle_block(color, label, ic, 200, 110, kind, tc)}</div>'




















MAPS = [
    ((2, 4), "N", (2, 1), []),
    ((0, 4), "N", (0, 1), [(1, 3)]),
    ((1, 4), "N", (3, 2), [(1, 1)]),
    ((4, 4), "N", (1, 1), [(4, 2), (2, 2)]),
    ((0, 4), "N", (4, 0), [(1, 3), (2, 1), (3, 3)]),
    ((2, 4), "N", (2, 0), [(2, 2), (1, 1), (3, 1)]),
]


def map_card(i, m, show_solution=False, w=58):
    start, d, goal, rocks = m
    sol = solve(start, d, goal, 5, set(rocks))
    path = path_cells(start, d, sol) if show_solution else None
    g = grid_svg(5, start, d, goal, rocks, cell=37, path=path)
    prog = mini_prog(sol) if show_solution else mini_prog("", blanks=len(sol) + 2)
    return (f'<div class="box" style="display:flex;flex-direction:column;gap:2mm;align-items:center">'
            f'<div style="font:700 11pt Bahnschrift;align-self:flex-start">Mapa {i + 1} · nivel {1 + i // 2}</div>'
            f'<div style="width:{w}mm">{g}</div>{prog}'
            f'<div class="small">{"Solución: " + str(len(sol)) + " tarjetas" if show_solution else "Dibuja las flechas del camino del robot hasta el tesoro"}</div></div>')


def m07():
    uso = ("<b>Cómo usarlo:</b> una hoja por pareja. El robot mira hacia arriba al empezar. Dibujan en las casillas las flechas del camino "
           "(flecha recta: avanza; flecha curva a la derecha: gira a la derecha; flecha curva a la izquierda: gira a la izquierda). Sobran casillas a propósito. La hoja de soluciones es para el docente.")
    cardsh = [map_card(i, m) for i, m in enumerate(MAPS)]
    sols = [map_card(i, m, True, 44) for i, m in enumerate(MAPS)]
    grid = lambda xs: f'<div class="two" style="flex:1">{"".join(xs)}</div>'
    return [page("M07", "Mapas del tesoro", "1º y 2º", "1º S4, S8 · 2º S1", uso, grid(cardsh[:4]), "c1", "Mapas 1 a 4"),
            page("M07", "Mapas del tesoro", "1º y 2º", "1º S4, S8 · 2º S1", uso, grid(cardsh[4:]), "c1", "Mapas 5 y 6"),
            page("M07", "Mapas del tesoro · soluciones", "1º y 2º", "Para el docente", "Solución más corta de cada mapa. Hay otras soluciones válidas si el robot llega al tesoro sin chocar.", f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;flex:1">{"".join(sols)}</div>', "c1", "Soluciones")]


BUGMAPS = [((2, 4), "N", (2, 1), []), ((0, 4), "N", (2, 2), []), ((4, 4), "N", (2, 1), [(4, 1)]),
           ((0, 4), "N", (3, 1), [(0, 1), (2, 3)]), ((1, 4), "N", (4, 0), [(1, 1), (3, 2)]), ((0, 0), "S", (4, 4), [(0, 3), (2, 2)])]


def make_bugs(m, k, seed):
    start, d, goal, rocks = m
    sol = solve(start, d, goal, 5, set(rocks))
    rnd = random.Random(seed)
    for _ in range(500):
        prog = list(sol)
        idx = sorted(rnd.sample(range(len(prog)), k))
        for i in idx:
            prog[i] = rnd.choice([c for c in "FRL" if c != prog[i]])
        r = simulate(start, d, "".join(prog), 5, set(rocks))
        if r is None or r[0] != goal:
            return sol, "".join(prog), idx
    raise RuntimeError("sin bicho")


def bug_card(i, m, k, show):
    sol, buggy, idx = make_bugs(m, k, i * 7 + k)
    start, d, goal, rocks = m
    g = grid_svg(5, start, d, goal, rocks, cell=37, path=path_cells(start, d, sol) if show else None)
    body = mini_prog(sol if show else buggy, bugs=idx if show else ())
    nums = ", ".join(str(j + 1) for j in idx)
    tip = ((f"Bichos en las casillas {nums}" if k > 1 else f"Bicho en la casilla {nums}") + ". Las flechas recuadradas ya están corregidas.") if show else         (f"Este programa tiene {k} bichos. Rodéalos y escribe debajo las flechas correctas." if k > 1 else "Este programa tiene 1 bicho. Rodéalo y escribe debajo la flecha correcta.")
    return (f'<div class="box" style="display:flex;flex-direction:column;gap:2mm;align-items:center">'
            f'<div style="font:700 11pt Bahnschrift;align-self:flex-start">Programa {i + 1} · {k} bicho{"s" if k > 1 else ""}</div>'
            f'<div style="width:50mm">{g}</div>{body}<div class="small">{tip}</div></div>')


def m08():
    uso = ("<b>Cómo usarlo:</b> una hoja por pareja. El robot mira hacia donde apunta. Siguen el programa con el dedo, casilla a casilla, "
           "y rodean las flechas que están mal. Nivel 1 (1 bicho) para 1º, nivel 2 (2 bichos) para 2º y nivel 3 (3 bichos) para 3º.")
    sets = [(1, BUGMAPS[:2]), (2, BUGMAPS[2:4]), (3, BUGMAPS[4:])]
    pages = []
    for k, ms in sets:
        cs = [bug_card(i + (k - 1) * 2, m, k, False) for i, m in enumerate(ms)] + [bug_card(i + (k - 1) * 2, m, k, True) for i, m in enumerate(ms)]
        pages.append(page("M08", f"Cazabichos · nivel {k}", "1º, 2º y 3º", "1º S6 · 2º S5 · 3º S6 · sesiones de reserva",
                          uso + " <b>La mitad inferior son las soluciones: dóblala o recórtala antes de repartir.</b>",
                          f'<div class="two" style="flex:1">{"".join(cs)}</div>', "c2", f"Nivel {k}"))
    return pages


R, B, Y, G, P = "#cf3f36", "#2c5bbf", "#e8b000", "#2a8f4f", "#6c44b0"
PATTERNS = [("AB", [("c", R), ("s", B)]), ("AAB", [("c", R), ("c", R), ("t", Y)]), ("ABC", [("s", B), ("t", Y), ("c", G)]),
            ("ABB", [("st", P), ("c", R), ("c", R)]), ("AABB", [("t", G), ("t", G), ("s", B), ("s", B)]), ("ABCD", [("c", R), ("s", B), ("t", Y), ("st", G)])]


def pattern_row(unit, n_show, n_blank, bug_at=None):
    seq = [unit[i % len(unit)] for i in range(n_show + n_blank)]
    items = []
    for i, (sh, col) in enumerate(seq):
        if i >= n_show:
            items.append(f'<div class="it">{shape_svg("blank", "#000")}</div>')
        else:
            if bug_at is not None and i == bug_at:
                others = [u for u in unit if u != (sh, col)] or [("st", P)]
                sh, col = others[0]
            items.append(f'<div class="it">{shape_svg(sh, col)}</div>')
    return f'<div class="seq">{"".join(items)}</div>'


def m09():
    uso = ("<b>Cómo usarlo:</b> una hoja por alumno. En la hoja 1 continúan cada patrón dibujando y coloreando las casillas vacías. "
           "En la hoja 2 buscan el «bicho»: la figura que rompe el patrón. Soluciones al pie de la hoja 2.")
    rows1 = "".join(f'<div style="display:flex;align-items:center;gap:4mm;padding:2.5mm 0;border-bottom:1px solid #dfe3ea"><b style="width:14mm">{n}</b>{pattern_row(u, 8 if len(u) < 4 else 8, 3)}</div>' for n, u in PATTERNS)
    grow = ""
    for k in range(1, 5):
        col = "".join(f'<div style="width:9mm;height:9mm;background:{B if k < 4 else "transparent"};border:{"0" if k < 4 else "1.5px dashed #9aa1ad"};border-radius:1mm"></div>' for _ in range(k))
        grow += f'<div style="display:flex;flex-direction:column-reverse;gap:1mm;align-items:center">{col}<div class="small">figura {k}</div></div>'
    rows1 += f'<div style="padding:3mm 0"><b>Patrón que crece:</b> dibuja la figura 4 y di cuántos cuadrados tendrá la figura 5.<div style="display:flex;gap:8mm;align-items:flex-end;margin-top:2mm">{grow}</div></div>'
    bugs = [(u, 3 + i % 4) for i, (_, u) in enumerate(PATTERNS)]
    rows2 = "".join(f'<div style="display:flex;align-items:center;gap:4mm;padding:2.5mm 0;border-bottom:1px solid #dfe3ea"><b style="width:14mm">{i + 1}</b>{pattern_row(u, 10, 0, b)}</div>' for i, (u, b) in enumerate(bugs))
    sol = "Soluciones hoja 2: el bicho está en la posición " + " · ".join(f"{i + 1}) {b + 1}ª" for i, (_, b) in enumerate(bugs)) + ". Patrón que crece: la figura 5 tiene 5 cuadrados."
    return [page("M09", "Patrones: continúa la serie", "1º y 2º", "1º S5 · 2º S3", uso, rows1, "c1", "Hoja 1 de 2"),
            page("M09", "Patrones: busca el bicho", "1º y 2º", "1º S6 · 2º S3, S5", uso, rows2 + f'<div class="sol">{sol}</div>', "c1", "Hoja 2 de 2")]












def flow_svg(steps, w=560):
    """Diagrama vertical. steps: (tipo, texto) o ("diam", texto, "loop"|"skip") para la rama NO."""
    y = 10
    out, diam_info, last_y = [], None, 0
    for i, st in enumerate(steps):
        t, tx = st[0], st[1]
        if t == "oval":
            out.append(f'<rect x="{w/2-90}" y="{y}" width="180" height="44" rx="22" fill="#e9f5ee" stroke="#2a8f4f" stroke-width="2.5"/>')
            h = 44
        elif t == "rect":
            out.append(f'<rect x="{w/2-130}" y="{y}" width="260" height="44" rx="4" fill="#eaf0fb" stroke="#2c5bbf" stroke-width="2.5"/>')
            h = 44
        else:
            out.append(f'<path d="M{w/2} {y} L{w/2+140} {y+36} L{w/2} {y+72} L{w/2-140} {y+36}Z" fill="#fff4e3" stroke="#df7619" stroke-width="2.5"/>')
            h = 72
            diam_info = (y, st[2] if len(st) > 2 else "loop")
            out.append(f'<text x="{w/2+8}" y="{y+h+16}" font-family="Segoe UI" font-size="13" font-weight="700">SÍ</text>')
            out.append(f'<text x="{w/2+150}" y="{y+28}" font-family="Segoe UI" font-size="13" font-weight="700">NO</text>')
        out.append(f'<text x="{w/2}" y="{y+h/2+5}" text-anchor="middle" font-family="Segoe UI" font-size="15" font-weight="600">{E(tx)}</text>')
        last_y = y
        y += h
        if i < len(steps) - 1:
            out.append(f'<path d="M{w/2} {y} V{y+24}" stroke="#1a1d24" stroke-width="2" marker-end="url(#ah)"/>')
            y += 26
    if diam_info:
        dy, mode = diam_info
        if mode == "loop":
            out.append(f'<path d="M{w/2+140} {dy+36} H{w-30} V{dy-12} H{w/2+6}" fill="none" stroke="#1a1d24" stroke-width="2" marker-end="url(#ah)"/>'
                       f'<text x="{w-36}" y="{dy+60}" text-anchor="end" font-family="Segoe UI" font-size="12" fill="#6b7385">espero</text>')
        else:
            out.append(f'<path d="M{w/2+140} {dy+36} H{w-30} V{last_y+22} H{w/2+92}" fill="none" stroke="#1a1d24" stroke-width="2" marker-end="url(#ah)"/>')
    return (f'<svg viewBox="0 0 {w} {y+10}" width="100%"><defs><marker id="ah" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
            f'<path d="M0 0L10 5L0 10Z" fill="#1a1d24"/></marker></defs>{"".join(out)}</svg>')










def m14():
    uso = ("<b>Cómo usarlo:</b> ficha para grupos de 3 o 4 como cierre del primer trimestre (sustituye a la «escape room»: no hace falta candado ni sobres). "
           "Cada prueba da un número. Con los cuatro números forman el código secreto y se lo dicen al docente. Soluciones en la última hoja.")
    g = grid_svg(4, (0, 3), "N", (3, 0), [], cell=44, extra=[(0, 0, "1"), (1, 0, "2"), (2, 0, "3"), (3, 0, "4"), (1, 1, "5"), (2, 1, "7"), (1, 2, "9"), (2, 2, "6"), (3, 1, "8"), (3, 2, "0"), (0, 1, "3"), (0, 2, "2")], goal_icon="")
    prog2 = "FFRF"
    end2 = simulate((0, 3), "N", prog2, 4, set())[0]
    val = {(0, 0): 1, (1, 0): 2, (2, 0): 3, (3, 0): 4, (1, 1): 5, (2, 1): 7, (1, 2): 9, (2, 2): 6, (3, 1): 8, (3, 2): 0, (0, 1): 3, (0, 2): 2}[end2]
    pa = pimg('aplaudir', 18)
    p2 = f'''<div class="two" style="flex:1">
<div class="box"><h2>Prueba 1 · El patrón</h2><p style="font:700 22pt Bahnschrift;letter-spacing:.1em">2 · 4 · 6 · ___</p><p class="small">¿Qué número sigue?</p><div class="box" style="width:25mm;height:18mm;margin-top:auto"></div></div>
<div class="box"><h2>Prueba 2 · El camino</h2><div style="display:flex;gap:4mm;align-items:center"><div style="width:48mm">{g}</div>{mini_prog(prog2, numbered=False)}</div><p class="small">Sigue el programa con el dedo. El robot empieza mirando hacia arriba. ¿En qué número termina?</p><div class="box" style="width:25mm;height:18mm"></div></div>
<div class="box"><h2>Prueba 3 · El bucle</h2><div style="display:flex;align-items:center;gap:3mm"><span style="font:700 15pt Bahnschrift">REPITE 3 VECES:</span><div style="width:18mm">{pa}</div><div style="width:18mm">{pa}</div></div><p class="small">¿Cuántas palmadas das en total?</p><div class="box" style="width:25mm;height:18mm"></div></div>
<div class="box"><h2>Prueba 4 · El bicho</h2><p style="font-size:11pt">Para lavarse las manos:<br>1. Abro el grifo · 2. Me enjabono · 3. Me seco · 4. Me aclaro</p><p class="small">¿En qué paso está el bicho (el primero que está mal)?</p><div class="box" style="width:25mm;height:18mm"></div></div></div>
<div class="box" style="font:700 16pt Bahnschrift;text-align:center">CÓDIGO SECRETO: [ &nbsp; ] [ &nbsp; ] [ &nbsp; ] [ &nbsp; ]</div>'''
    p3 = '''<div class="two" style="flex:1">
<div class="box"><h2>Prueba 1 · El diagrama</h2><p style="font-size:11pt">EMPIEZA con el número 7 → ¿Es par? → SÍ: divídelo entre 2 · NO: súmale 1 → ¿Es par? → SÍ: divídelo entre 2 · NO: súmale 1 → TERMINA</p><p class="small">¿Con qué número terminas?</p><div class="box" style="width:25mm;height:18mm"></div></div>
<div class="box"><h2>Prueba 2 · El bucle</h2><p style="font:700 15pt Bahnschrift">Empiezas en 0.<br>REPITE 3 VECES: suma 3</p><p class="small">¿En qué número acabas?</p><div class="box" style="width:25mm;height:18mm"></div></div>
<div class="box"><h2>Prueba 3 · La condición</h2><p style="font-size:11pt">SI el número es mayor que 5, ENTONCES réstale 5. SI NO, súmale 5.<br>Empiezas con el 2.</p><p class="small">¿Qué número obtienes?</p><div class="box" style="width:25mm;height:18mm"></div></div>
<div class="box"><h2>Prueba 4 · El bicho</h2><p style="font-size:11pt">Para dibujar un cuadrado:<br>1. REPITE 4 VECES · 2. avanza 3 pasos · 3. gira un cuarto de vuelta · 4. gira un cuarto de vuelta</p><p class="small">¿Qué paso sobra?</p><div class="box" style="width:25mm;height:18mm"></div></div></div>
<div class="box" style="font:700 16pt Bahnschrift;text-align:center">CÓDIGO SECRETO: [ &nbsp; ] [ &nbsp; ] [ &nbsp; ] [ &nbsp; ]</div>'''
    sol = f'''<div class="sol" style="font-size:11pt"><b>2º:</b> Prueba 1 → 8 · Prueba 2 → {val} · Prueba 3 → 6 · Prueba 4 → 3 (secarse va después de aclararse). <b>Código: 8 {val} 6 3</b></div>
<div class="sol" style="font-size:11pt"><b>3º:</b> Prueba 1 → 7 es impar → 8 → par → 4 · Prueba 2 → 9 · Prueba 3 → 2 no es mayor que 5 → 7 · Prueba 4 → sobra el paso 4. <b>Código: 4 9 7 4</b></div>
<p class="small">Si un grupo se atasca, se le puede dar una pista en voz alta. Lo importante es que expliquen cómo han llegado a cada número.</p>'''
    return [page("M14", "Misión final del trimestre · 2º", "2º", "2º S8", uso, p2, "c2", "2º"),
            page("M14", "Misión final del trimestre · 3º", "3º", "3º S8", uso, p3, "c3", "3º"),
            page("M14", "Misión final · soluciones", "2º y 3º", "Para el docente", "Soluciones de las dos fichas.", sol, "c2", "Soluciones")]


def m15():
    uso = ("<b>Cómo usarlo:</b> imprime en A4 horizontal y dobla por la mitad: queda un librito. Un pasaporte por alumno, que se guarda en la carpeta de clase. "
           "Al final de cada sesión, un sello o pegatina en su casilla. Al completar un trimestre, se colorea la insignia.")
    fz1, fz2, fz3 = face('feliz', 7), face('normal', 7), face('triste', 7)

    def passport(n_per_term, terms, title_terms):
        cols = "".join(f'<div><b style="font:700 11pt Bahnschrift">{t}</b><div style="display:grid;grid-template-columns:repeat(8,11mm);gap:1.5mm;margin-top:1mm">' +
                       "".join(f'<div style="width:11mm;height:11mm;border:1.5px dashed #9aa1ad;border-radius:50%;display:flex;align-items:center;justify-content:center;font:600 9pt Segoe UI;color:#9aa1ad">{k}</div>' for k in rng) +
                       '</div></div>' for t, rng in terms)
        return f'''<div style="display:grid;grid-template-columns:1fr 1fr;gap:0;flex:1;border:1.5px solid #1a1d24">
<div style="padding:5mm;border-right:1.5px dashed #9aa1ad;display:flex;flex-direction:column;gap:3mm;justify-content:center;text-align:center">
<div style="font:700 11pt Segoe UI;letter-spacing:.14em;color:#6b7385">CÓDIGO ESCUELA 4.0</div>
<div style="font:700 24pt/1 Bahnschrift">PASAPORTE DEL<br>PROGRAMADOR</div><div style="font-size:11pt">Curso 2026-2027</div>
<div style="margin:0 auto;width:36mm;height:36mm;border:2px solid #1a1d24;border-radius:4mm;display:flex;align-items:flex-end;justify-content:center;padding-bottom:2mm" class="small">Dibuja tu avatar</div>
<div style="text-align:left;font-size:11pt">Nombre: ______________________<br><br>Curso: _______ Grupo: _______</div></div>
<div style="padding:5mm;display:flex;flex-direction:column;gap:2.5mm;font-size:9pt">{cols}
<div><b style="font:700 11pt Bahnschrift">¿Cómo me ha ido?</b><table style="margin-top:1mm;font-size:9pt"><tr><th></th><th>{fz1}</th><th>{fz2}</th><th>{fz3}</th></tr>
<tr><td>{title_terms[0]}</td><td></td><td></td><td></td></tr><tr><td>{title_terms[1]}</td><td></td><td></td><td></td></tr><tr><td>{title_terms[2]}</td><td></td><td></td><td></td></tr></table></div></div></div>'''
    p1 = passport(8, [("1er trimestre", range(1, 9)), ("2º trimestre", range(9, 17)), ("3er trimestre", range(17, 25))], ["1er trimestre", "2º trimestre", "3er trimestre"])
    p2 = passport(4, [("1er trimestre", range(1, 4)), ("2º trimestre", range(4, 8)), ("3er trimestre", range(8, 13)), ("Sesiones extra", range(13, 17))], ["1er trimestre", "2º trimestre", "3er trimestre"])
    land = "<style>@page land{size:A4 landscape}</style>"
    st = "page:land;height:190mm"
    return [land + page("M15", "Pasaporte del programador · 1º a 4º", "1º a 4º", "Todas las sesiones", uso, p1, "c5", style=st),
            page("M15", "Pasaporte del programador · 5º y 6º", "5º y 6º", "Todas las sesiones", uso, p2, "c5", style=st)]


def m16():
    lines = lambda n: "".join('<div class="line"></div>' for _ in range(n))
    plan3 = '<div class="three" style="flex:1">' + "".join(f'<div class="box" style="display:flex;flex-direction:column"><b style="font:700 14pt Bahnschrift">{t}</b><div style="flex:1;min-height:90mm"></div>{lines(2)}</div>' for t in ("1. EMPIEZA", "2. PASA", "3. TERMINA")) + '</div>' \
        + '<div class="box" style="font-size:12pt">Mi programa necesita: ☐ empezar &nbsp; ☐ moverse &nbsp; ☐ repetir &nbsp; ☐ decir algo &nbsp; ☐ ____________</div>'
    team12 = f'''<div class="box" style="flex:1;display:flex;flex-direction:column;gap:3mm"><b style="font:700 14pt Bahnschrift">NUESTRA MISIÓN (dibujo)</b><div style="flex:1;min-height:70mm;border:1.5px dashed #9aa1ad;border-radius:2mm"></div>
<div class="three"><div class="box"><b>SALIDA</b><div class="line"></div></div><div class="box"><b>PARADA</b><div class="line"></div></div><div class="box"><b>META</b><div class="line"></div></div></div>
<b>NECESITAMOS:</b> ☐ robot &nbsp; ☐ tarjetas &nbsp; ☐ tablero &nbsp; ☐ fichas &nbsp; ☐ ___________
<table><tr><th>Rol</th><th>Nombre</th></tr><tr><td>Piloto</td><td></td></tr><tr><td>Copiloto</td><td></td></tr><tr><td>Material</td><td></td></tr><tr><td>Portavoz</td><td></td></tr></table></div>'''
    team36 = f'''<table><tr><th style="width:35%">Nombre del proyecto</th><td></td></tr><tr><th>¿Qué problema resuelve o qué queremos hacer?</th><td style="height:22mm"></td></tr>
<tr><th>¿Para quién es?</th><td></td></tr><tr><th>¿Cómo funciona? (dibujo: qué se toca o se mide → qué pasa)</th><td style="height:55mm"></td></tr>
<tr><th>Material</th><td style="height:14mm"></td></tr><tr><th>El programa necesita</th><td>☐ evento ☐ bucle ☐ condición ☐ variable ☐ sensor</td></tr></table>
<table><tr><th>Tarea</th><th>Quién</th><th>Sesión 1</th><th>Sesión 2</th><th>Sesión 3</th></tr>''' + "".join(f"<tr><td>{t}</td><td></td><td></td><td></td><td></td></tr>" for t in ("Construcción", "Programación", "Pruebas", "Portavoz")) + '</table><div class="box">Visto bueno del docente: ☐</div>'
    game = '''<table><tr><th style="width:38%">Título del juego</th><td></td></tr><tr><th>Personaje (lo que manejo) y teclas</th><td></td></tr><tr><th>Objetivo</th><td></td></tr>
<tr><th>Premio (suma puntos)</th><td></td></tr><tr><th>Enemigo u obstáculo (quita vidas)</th><td></td></tr><tr><th>¿Cómo se gana? ¿Cómo se pierde?</th><td></td></tr><tr><th>Fondo</th><td></td></tr></table>
<b>Dibujo de la pantalla</b><div style="flex:1;min-height:95mm;border:2px solid #1a1d24;border-radius:2mm;aspect-ratio:4/3"></div>
<div class="box">☐ bandera verde &nbsp; ☐ movimiento &nbsp; ☐ repetir o por siempre &nbsp; ☐ variable &nbsp; ☐ si… entonces</div>'''
    inv = '''<table><tr><th style="width:38%">Nombre del invento</th><td></td></tr><tr><th>¿Qué problema resuelve?</th><td style="height:20mm"></td></tr>
<tr><th>Sensor que usa</th><td>☐ botones ☐ movimiento ☐ luz ☐ temperatura ☐ sonido ☐ otro: ______</td></tr><tr><th>¿Qué hace cuando el sensor detecta algo?</th><td style="height:20mm"></td></tr>
<tr><th>Umbral (número a partir del cual reacciona)</th><td></td></tr><tr><th>Programa (dibuja los bloques)</th><td style="height:70mm"></td></tr><tr><th>¿Cómo lo probamos?</th><td style="height:18mm"></td></tr></table>'''
    uso = "<b>Cómo usarlo:</b> fichas de planificación. Se rellenan al principio del proyecto y se guardan en la carpeta del equipo para la siguiente sesión."
    return [page("M16", "Hoja de plan en 3 cuadros", "1º, 2º y 3º", "1º S15 · 2º S14 · 3º S15", uso, plan3, "c4", "1 de 5"),
            page("M16", "Hoja de proyecto en equipo · 1º y 2º", "1º y 2º", "1º S17 · 2º S17", uso, team12, "c4", "2 de 5"),
            page("M16", "Hoja de proyecto en equipo · 3º a 6º", "3º a 6º", "3º S19 · 4º S18 · 5º S11 · 6º S10", uso, team36, "c4", "3 de 5"),
            page("M16", "Hoja de diseño de juego", "3º y 4º", "3º S15 · 4º S9", uso, game, "c4", "4 de 5"),
            page("M16", "Plan de mi invento", "5º y 6º", "5º S6 · 6º S6", uso, inv, "c4", "5 de 5")]








def m19():
    rows = "".join("<tr>" + "<td style='height:7.2mm'></td>" * 6 + "</tr>" for _ in range(26))
    reg = f'''<p class="small">Código: <b>P</b> en proceso · <b>C</b> conseguido · <b>D</b> destacado. Se marca una sola vez por trimestre, en la sesión de producto.</p>
<table><tr><th style="width:32%">Alumno/a</th><th>Resuelve y explica</th><th>Depura</th><th>Colabora</th><th>Cuida el material</th><th>Observaciones</th></tr>{rows}</table>'''
    niveles = '''<table><tr><th>Criterio</th><th>En proceso</th><th>Conseguido</th><th>Destacado</th></tr>
<tr><td><b>Resuelve el reto</b> y explica cómo lo hizo</td><td>Lo resuelve con mucha ayuda</td><td>Lo resuelve y lo explica con sus palabras</td><td>Lo resuelve de otra forma o ayuda a otros</td></tr>
<tr><td><b>Depura</b>: encuentra y arregla errores</td><td>Necesita que le señalen el error</td><td>Encuentra el error probando</td><td>Lo encuentra antes de probar, razonando</td></tr>
<tr><td><b>Colabora</b> y respeta los roles</td><td>Le cuesta respetar turnos</td><td>Respeta su rol y el del compañero</td><td>Anima y organiza al grupo</td></tr>
<tr><td><b>Cuida</b> el material y usa los dispositivos con seguridad</td><td>Necesita recordatorios</td><td>Cumple las normas</td><td>Recuerda las normas a los demás</td></tr></table>'''
    auto12 = '<div style="width:100%;text-align:left;font-size:12pt"><b>Mi trimestre</b> &nbsp; Nombre: __________<table style="margin-top:2mm">' + "".join(f"<tr><td>{q}</td><td style='text-align:center'>" + face('feliz') + "</td><td style='text-align:center'>" + face('normal') + "</td><td style='text-align:center'>" + face('triste') + "</td></tr>" for q in ("He dado bien las instrucciones", "He ayudado a mi equipo", "He cuidado el material", "Me lo he pasado bien")) + "</table></div>"
    auto36 = '<div style="width:100%;text-align:left;font-size:11pt;display:flex;flex-direction:column;gap:2mm"><b>Mi trimestre</b><div>Nombre: ____________ Trimestre: ____</div><div>Lo que mejor me ha salido:</div><div class="line"></div><div>Lo que más me ha costado:</div><div class="line"></div><div>La próxima vez voy a:</div><div class="line"></div></div>'
    uso = "<b>Cómo usarlo:</b> registro de la rúbrica para toda la clase (hoja 1), descripción de niveles (hoja 2) y autoevaluaciones recortables (hoja 3: cuatro por hoja)."
    return [page("M19", "Registro de la rúbrica", "1º a 6º", "Sesión de producto de cada trimestre", uso, reg, "c6", "1 de 3"),
            page("M19", "Niveles de logro de la rúbrica", "1º a 6º", "Para el docente", uso, niveles, "c6", "2 de 3"),
            page("M19", "Autoevaluación", "1º a 6º", "Final de cada trimestre", uso, cards([auto12, auto12, auto36, auto36], 2, 2), "c6", "3 de 3")]


FLAG = '<svg viewBox="0 0 20 20" style="width:13px;height:13px;vertical-align:-2px"><path d="M4 18V3" stroke="#1a1d24" stroke-width="2"/><path d="M4 3h11l-3 3.5 3 3.5H4z" fill="#2a8f4f"/></svg>'
SCR = {"mov": "#4C97FF", "apa": "#9966FF", "son": "#CF63CF", "eve": "#FFBF00", "con": "#FFAB19", "sen": "#5CB1D6", "ope": "#59C059", "var": "#FF8C1A", "pen": "#0FBD8C"}


def sblock(cat, text, hat=False, c=False):
    col = SCR[cat]
    txtc = "#1a1d24" if cat == "eve" else "#fff"
    shape = "border-radius:14px 14px 4px 4px;padding-top:9px" if hat else "border-radius:4px"
    inner = f'<div style="background:{col};color:{txtc};{shape};padding:3px 8px;font:600 9pt Segoe UI;display:inline-block;border:1px solid rgba(0,0,0,.15)">{text}</div>'
    if c:
        inner = f'<div style="display:inline-flex;flex-direction:column"><div style="background:{col};color:#fff;border-radius:4px 4px 0 0;padding:3px 8px;font:600 9pt Segoe UI">{text}</div><div style="display:flex"><div style="width:10px;background:{col}"></div><div style="padding:2px 6px;font-size:7.5pt;color:#6b7385;border:1px dashed #c9ced8">bloques de dentro</div></div><div style="background:{col};height:7px;border-radius:0 0 4px 4px"></div></div>'
    return inner


def m20():
    rows = [("Eventos", [sblock("eve", "al hacer clic en " + FLAG, True), sblock("eve", "al presionar tecla [espacio]", True), sblock("eve", "al hacer clic en este objeto", True), sblock("eve", "enviar [mensaje1]"), sblock("eve", "al recibir [mensaje1]", True)], "3º S9 · 4º S10, S13"),
            ("Movimiento", [sblock("mov", "mover (10) pasos"), sblock("mov", "girar ↻ (15) grados"), sblock("mov", "ir a x: (0) y: (0)"), sblock("mov", "cambiar x en (10)"), sblock("mov", "cambiar y en (10)"), sblock("mov", "ir a posición aleatoria"), sblock("mov", "rebotar si toca un borde")], "3º S10 · 4º S10"),
            ("Apariencia", [sblock("apa", "decir [¡Hola!] durante (2) segundos"), sblock("apa", "siguiente disfraz"), sblock("apa", "cambiar fondo a [fondo1]"), sblock("apa", "fijar tamaño al (100) %"), sblock("apa", "mostrar"), sblock("apa", "esconder")], "3º S9, S12"),
            ("Sonido", [sblock("son", "tocar sonido [Miau]"), sblock("son", "tocar sonido [Miau] hasta que termine")], "3º S12"),
            ("Control", [sblock("con", "esperar (1) segundos"), sblock("con", "repetir (10)", c=True), sblock("con", "por siempre", c=True), sblock("con", "si ⟨ ⟩ entonces", c=True), sblock("con", "si ⟨ ⟩ entonces · si no", c=True), sblock("con", "repetir hasta que ⟨ ⟩", c=True), sblock("con", "detener [todos]")], "3º S11, S14 · 4º S2, S5"),
            ("Sensores", [sblock("sen", "¿tocando [objeto]?"), sblock("sen", "preguntar [¿…?] y esperar"), sblock("sen", "respuesta")], "3º S14 · 4º S5, S6"),
            ("Operadores", [sblock("ope", "número aleatorio entre (1) y (10)"), sblock("ope", "( ) = ( )"), sblock("ope", "( ) > ( )"), sblock("ope", "( ) * ( )"), sblock("ope", "unir [ ] [ ]"), sblock("ope", "( ) mod ( )")], "4º S5, S6"),
            ("Variables", [sblock("var", "dar a [puntos] el valor (0)"), sblock("var", "sumar a [puntos] (1)")], "3º S13 · 4º S4, S12"),
            ("Lápiz (extensión)", [sblock("pen", "borrar todo"), sblock("pen", "bajar lápiz"), sblock("pen", "subir lápiz"), sblock("pen", "fijar color del lápiz a ●")], "3º S11 · 4º S2")]
    cats = ["eve", "mov", "apa", "son", "con", "sen", "ope", "var", "pen"]
    body = "".join(f'<div style="display:grid;grid-template-columns:27mm 1fr 27mm;gap:3mm;align-items:start;padding:1.4mm 0;border-bottom:1px solid #dfe3ea"><b style="font:700 10.5pt Bahnschrift;color:{"#b38600" if cats[i] == "eve" else SCR[cats[i]]}">{n}</b><div style="display:flex;flex-wrap:wrap;gap:1.5mm;align-items:flex-start">{"".join(bs)}</div><span class="small">{s}</span></div>' for i, (n, bs, s) in enumerate(rows))
    uso = ("<b>Cómo usarlo:</b> los bloques de Scratch que se usan en la guía, con sus colores y en español. Imprime uno por pareja o proyéctalo. "
           "Si no encuentras un bloque, búscalo por su color: cada categoría tiene el suyo. Algún nombre puede variar un poco según la versión.")
    return [page("M20", "Chuleta de bloques de Scratch", "3º, 4º y 5º", "Todas las sesiones de Scratch", uso, body, "c3")]


MC = {"bas": "#1E90FF", "inp": "#D400D4", "mus": "#E63022", "led": "#5C2D91", "rad": "#E3008C", "loo": "#00AA00", "log": "#00A4A6", "var": "#DC143C", "mat": "#9400D3", "fun": "#3455DB"}


def m21():
    mb = lambda cat, t: f'<div style="background:{MC[cat]};color:#fff;border-radius:4px;padding:5px 10px;font:600 10pt Segoe UI;display:inline-block">{t}</div>'
    rows = [("Básico", "bas", ["al iniciar", "para siempre", "mostrar número ( )", "mostrar cadena \"Hola\"", "mostrar icono ♥", "borrar la pantalla", "pausa (ms) (100)"], "5º S2 · 6º S1"),
            ("Entrada", "inp", ["al presionar el botón A", "al agitar", "nivel de luz", "temperatura (°C)", "nivel de sonido", "al presionar el logo (V2)"], "5º S3, S4, S5 · 6º S2, S3"),
            ("Música", "mus", ["reproducir tono (Do) durante (1) compás", "reproducir melodía"], "5º S5"),
            ("Bucles", "loo", ["repetir (4) veces", "mientras ⟨ ⟩"], "6º S4"),
            ("Lógica", "log", ["si ⟨ ⟩ entonces", "si ⟨ ⟩ entonces · si no", "( ) < ( )", "( ) = ( )", "verdadero / falso"], "5º S4, S5 · 6º S2"),
            ("Variables", "var", ["establecer [contador] a (0)", "cambiar [contador] por (1)"], "5º S2, S3 · 6º S2"),
            ("Matemáticas", "mat", ["elegir al azar de (1) a (6)"], "5º S3"),
            ("Radio", "rad", ["radio establecer grupo (7)", "radio enviar número (1)", "al recibir radio número"], "5º S16 · 6º S14"),
            ("Funciones", "fun", ["crear una función", "llamar a [girar_derecha]"], "6º S6")]
    body = "".join(f'<div style="display:grid;grid-template-columns:28mm 1fr 30mm;gap:3mm;padding:2mm 0;border-bottom:1px solid #dfe3ea"><b style="font:700 11pt Bahnschrift;color:{MC[c]}">{n}</b><div style="display:flex;flex-wrap:wrap;gap:2mm">{"".join(mb(c, t) for t in bs)}</div><span class="small">{s}</span></div>' for n, c, bs, s in rows)
    body += '''<div class="box" style="font-size:10pt"><b>Pasar el programa a la placa:</b> 1) Conecta la micro:bit con el cable USB. 2) Pulsa <b>Descargar</b>. 3) Copia el archivo <b>.hex</b> a la unidad <b>MICROBIT</b> (como un pendrive). La luz trasera parpadea y el programa arranca.
<br><b>Nezha:</b> Extensiones → buscar «nezha». Motores en M1-M4, velocidad de −100 a 100 (negativo = sentido contrario).</div>'''
    uso = "<b>Cómo usarlo:</b> los bloques de MakeCode para micro:bit que se usan en la guía, con sus colores. Uno por pareja o proyectado. Primero siempre en el simulador."
    return [page("M21", "Chuleta de bloques de MakeCode", "5º y 6º", "Todas las sesiones de micro:bit y Nezha", uso, body, "c5")]


def m22():
    btn = lambda t: f'<div style="width:34mm;height:34mm;border:2.5px solid #1a1d24;border-radius:4mm;display:flex;align-items:center;justify-content:center;font:700 13pt Bahnschrift;background:repeating-linear-gradient(45deg,#f0f1f4 0 3mm,#fff 3mm 6mm)">{t}</div>'
    tmpl = f'''<div style="flex:1;border:2px solid #1a1d24;border-radius:4mm;position:relative;padding:8mm;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;place-items:center">
<div></div>{btn("ARRIBA")}<div></div>{btn("IZQUIERDA")}{btn("ESPACIO")}{btn("DERECHA")}<div></div>{btn("ABAJO")}<div></div>
<div style="position:absolute;bottom:4mm;left:8mm;right:8mm;height:14mm;border:2.5px solid #1a1d24;border-radius:3mm;display:flex;align-items:center;justify-content:center;font:700 12pt Bahnschrift;background:#fff4e3">TIERRA (EARTH): apoya aquí la otra mano</div></div>
<div class="uso"><p><b>Montaje:</b> pega esta hoja en un cartón. Cubre cada botón rayado con papel de aluminio y deja una tira de aluminio de 1 cm que llegue hasta el borde para poner la pinza. Los botones <b>no</b> se pueden tocar entre sí. Conecta cada tira a su tecla del Makey Makey y la zona de TIERRA a EARTH.</p></div>'''
    objs = ["Plátano", "Plastilina", "Papel de aluminio", "Lápiz (grafito)", "Cuchara de metal", "Goma de borrar", "Regla de plástico", "Lápiz de madera (sin punta)", "Papel", "Agua (en vaso)"]
    reg = '<table><tr><th>Objeto</th><th>Creo que… sí / no</th><th>Resultado sí / no</th></tr>' + "".join(f"<tr><td>{o}</td><td></td><td></td></tr>" for o in objs) + "<tr><td>________</td><td></td><td></td></tr>" * 3 + "</table><p class='small'>¿Qué tienen en común los objetos que conducen?</p><div class='line'></div><div class='line'></div>"
    uso = "<b>Cómo usarlo:</b> hoja 1: plantilla de mando para Makey Makey (una por grupo). Hoja 2: registro de «¿qué conduce?» (una por grupo)."
    return [page("M22", "Plantilla de mando para Makey Makey", "3º y 4º", "3º S20 · 4º S19", uso, tmpl, "c3", "1 de 2"),
            page("M22", "¿Qué conduce la electricidad?", "3º y 4º", "3º S17 · 4º S17", uso, reg, "c3", "2 de 2")]







CASES = [("Los vídeos que no se acaban", "Lucía abre una app de vídeos para ver uno. Una hora después sigue viendo vídeos que la app le recomienda, uno detrás de otro.",
          ["¿Quién decide qué vídeo sale después?", "¿Por qué a la app le interesa que sigas mirando?", "¿Qué podría hacer Lucía?"]),
         ("La foto falsa", "En un grupo de mensajes circula una foto de un tiburón nadando por una calle inundada. Mucha gente la comparte. Es una imagen hecha con IA.",
          ["¿Cómo podríamos saber que es falsa?", "¿Qué daño puede hacer compartirla?", "¿Qué harías si te llega?"]),
         ("La máquina que elige", "Una empresa usa una IA para elegir a quién contratar. La entrenaron solo con datos de personas que ya trabajaban allí, casi todas parecidas.",
          ["¿Por qué puede ser injusta?", "¿De quién es la responsabilidad?", "¿Cómo se podría arreglar?"]),
         ("La foto sin permiso", "Mario hace una foto a un compañero en el recreo y la sube a una red social sin preguntarle. Otros empiezan a comentar.",
          ["¿Qué ha hecho mal Mario?", "¿Se puede borrar del todo lo que se sube?", "¿Qué debería hacer el compañero?"])]


def m24():
    items = [f'<div style="width:100%;text-align:left;display:flex;flex-direction:column;gap:2mm"><div style="font:700 14pt Bahnschrift">Caso {i + 1} · {E(t)}</div><div style="font-size:11pt">{E(d)}</div>'
             + "".join(f'<div style="font-size:10.5pt">• {E(q)}</div><div class="line" style="height:6mm"></div>' for q in qs) + "</div>" for i, (t, d, qs) in enumerate(CASES)]
    uso = "<b>Cómo usarlo:</b> un caso por equipo. Lo leen, responden las preguntas en 15 minutos y lo exponen en 1 minuto. Después, entre todos, se escriben 3 normas para usar la IA y las redes con responsabilidad."
    return [page("M24", "Casos para debatir: IA, redes y huella digital", "6º (también 5º)", "6º S8 · 5º S9", uso, cards(items, 2, 2), "c6")]


def m25():
    grid = '<svg viewBox="0 0 520 300" width="100%"><g stroke="#c9ced8">' + "".join(f'<line x1="40" y1="{20 + i*25}" x2="510" y2="{20 + i*25}"/>' for i in range(11)) + '</g><path d="M40 20V270H510" stroke="#1a1d24" stroke-width="2" fill="none"/>' \
        + "".join(f'<text x="30" y="{274 - i*25}" font-size="11" text-anchor="end" font-family="Segoe UI">{i}</text>' for i in range(11)) + "</svg>"
    enc = f'''<div class="box"><b>Pregunta de la encuesta:</b> ______________________________________________</div>
<table><tr><th>Opción</th><th>Recuento (palotes)</th><th>Total</th></tr>{"<tr><td style='height:10mm'></td><td></td><td></td></tr>" * 5}</table><b>Gráfico de barras</b>{grid}<div class="box">La opción más votada (moda) es: ____________</div>'''
    dado = '<table><tr><th>Número del dado</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr><tr><td>Recuento (palotes)</td>' + "<td style='height:22mm'></td>" * 6 + '</tr><tr><td>Total</td>' + "<td></td>" * 6 + f'</tr></table><p>Tiramos el dado electrónico <b>30 veces</b>. ¿Sale todo más o menos igual? ______________</p><b>Gráfico</b>{grid}'
    med = '<table><tr><th>Lugar del colegio</th><th>Temperatura (°C)</th><th>Nivel de luz (0-255)</th><th>Hora</th></tr>' + "<tr><td style='height:11mm'></td><td></td><td></td><td></td></tr>" * 6 + '</table><div class="two"><div class="box">Media de temperatura: ______<br><span class="small">Suma de todas ÷ número de lugares</span></div><div class="box">Lugar con más luz: ______<br>Lugar más cálido: ______</div></div><div class="box">¿Por qué crees que ocurre?<div class="line"></div><div class="line"></div></div>'
    uso = "<b>Cómo usarlo:</b> hojas de registro de datos. Hoja 1: encuesta y gráfico de barras (3º, 4º). Hoja 2: frecuencias del dado electrónico (5º). Hoja 3: medidas con sensores (5º, 6º)."
    return [page("M25", "Registro de una encuesta", "3º y 4º", "3º S7 · 4º S8, S16", uso, enc, "c4", "1 de 3"),
            page("M25", "Frecuencias del dado electrónico", "5º", "5º S3", uso, dado, "c5", "2 de 3"),
            page("M25", "Medimos el colegio con sensores", "5º y 6º", "5º S4 · 6º S3", uso, med, "c6", "3 de 3")]



from pictos import path as _ppath, CREDITO as PCREDITO


def pimg(name, mm=30):
    return f'<img src="{_ppath(name)}" style="width:{mm}mm;height:{mm}mm;object-fit:contain;display:block;margin:0 auto" alt="">'


def credit_line():
    return f'<p class="small" style="margin:0">{E(PCREDITO)}</p>'


def face(kind, mm=9):
    mouth = {"feliz": "M10 22 Q18 30 26 22", "normal": "M11 24 H25", "triste": "M10 27 Q18 19 26 27"}[kind]
    col = {"feliz": "#2a8f4f", "normal": "#df7619", "triste": "#cf3f36"}[kind]
    return (f'<svg viewBox="0 0 36 36" style="width:{mm}mm;height:{mm}mm;vertical-align:middle"><circle cx="18" cy="18" r="16" fill="#fff" stroke="{col}" stroke-width="2.5"/>'
            f'<circle cx="12.5" cy="14" r="2.2" fill="{col}"/><circle cx="23.5" cy="14" r="2.2" fill="{col}"/><path d="{mouth}" fill="none" stroke="{col}" stroke-width="2.5" stroke-linecap="round"/></svg>')


FACES = face("feliz") + " &nbsp; " + face("normal") + " &nbsp; " + face("triste")


def glyph(kind, color="#fff", mm=11):
    s = f'stroke="{color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"'
    g = {
        "flag": f'<path d="M9 34V6" {s}/><path d="M9 7h20l-5 6 5 6H9" fill="#2a8f4f" stroke="{color}" stroke-width="2.5" stroke-linejoin="round"/>',
        "bubble": f'<path d="M6 8h28a3 3 0 013 3v14a3 3 0 01-3 3H17l-7 6v-6H6a3 3 0 01-3-3V11a3 3 0 013-3z" {s}/>',
        "grow": f'<rect x="12" y="14" width="10" height="10" {s}/><rect x="6" y="6" width="26" height="26" rx="2" stroke="{color}" stroke-width="2" stroke-dasharray="3 3" fill="none"/>',
        "shrink": f'<rect x="6" y="6" width="26" height="26" rx="2" {s}/><rect x="14" y="14" width="10" height="10" stroke="{color}" stroke-width="2" stroke-dasharray="3 3" fill="none"/>',
        "hide": f'<circle cx="19" cy="19" r="12" stroke="{color}" stroke-width="3" stroke-dasharray="4 4" fill="none"/>',
        "sound": f'<path d="M6 15h6l8-7v22l-8-7H6z" {s}/><path d="M25 13q4 6 0 12M29 9q8 10 0 20" {s}/>',
        "wait": f'<circle cx="19" cy="19" r="13" {s}/><path d="M19 11v9l6 4" {s}/>',
        "repeat": f'<path d="M9 16a10 10 0 0118-5M29 22a10 10 0 01-18 5" {s}/><path d="M27 5v6h-6M11 33v-6h6" {s}/>',
        "touch": f'<circle cx="19" cy="15" r="9" stroke="{color}" stroke-width="2" stroke-dasharray="3 3" fill="none"/><path d="M17 15v14l-4-3M17 22h8a2 2 0 012 2v8H17" {s}/>',
        "crash": f'<polygon points="19,4 23,14 34,12 26,20 32,31 21,26 15,35 14,24 4,22 12,15 8,6 17,11" {s}/>',
        "clap": f'<path d="M12 30l-4-12a3 3 0 015-2l5 10M18 26l-2-14a3 3 0 015-1l3 12M26 7l2-3M31 11l3-2M22 5V2" {s}/>',
        "bell": f'<path d="M10 27V17a9 9 0 0118 0v10l3 3H7z" {s}/><path d="M16 33a3 3 0 006 0" {s}/>',
        "mail": f'<rect x="5" y="9" width="28" height="20" rx="2" {s}/><path d="M5 11l14 10 14-10" {s}/>',
        "jump": f'<path d="M6 30q13-26 26 0" {s}/><path d="M26 26l6 4 1-7" {s}/>',
    }[kind]
    return f'<svg viewBox="0 0 38 38" style="width:{mm}mm;height:{mm}mm">{g}</svg>'


# ------------------------------------------------------------------ M02 movimientos
MOVES2 = [("saltar", "SALTA"), ("aplaudir", "APLAUDE"), ("dar_vuelta", "DA UNA VUELTA"), ("agacharse", "AGÁCHATE"), ("brazos_arriba", "BRAZOS ARRIBA"), ("andar", "ANDA UN PASO")]


def m02():
    uso = ("<b>Cómo usarlo:</b> una hoja por grupo. Con estas tarjetas se escriben coreografías y rutinas: se colocan en fila, "
           "se añade delante una tarjeta REPITE (M01) y otro grupo las ejecuta leyendo las tarjetas.")
    items = [pimg(p, 40) + f'<div class="lbl">{t}</div>' for p, t in MOVES2]
    return [page("M02", "Tarjetas de movimientos", "1º y 2º", "1º S2, S9 · 2º S4, S10", uso, cards(items, 2, 3) + credit_line(), "c1")]


# ------------------------------------------------------------------ M03 bloques de papel
def block2(color, label, icon="", kind="normal", tc="#fff"):
    return f'<div style="width:54mm;height:30mm">{puzzle_block(color, label, icon, 200, 110, kind, tc)}</div>'


def m03():
    uso = ("<b>Cómo usarlo:</b> bloques de papel con los mismos colores y formas que ScratchJr. Imprime un juego por grupo, recorta y plastifica. "
           "Se enganchan de izquierda a derecha como un tren; el programa empieza siempre con EMPIEZA (amarillo) y termina con FIN (rojo). "
           "En el bloque «DI» se escribe con rotulador de pizarra.")
    ar = lambda k: f'<span style="display:inline-block;width:11mm;height:11mm">{arrow_svg(k, 100, "rgba(0,0,0,0)")}</span>'
    dk = "#1a1d24"
    p1 = [block2(SJ["evento"], "EMPIEZA", glyph("flag", dk), "hat", dk), block2(SJ["mov"], "AVANZA", ar("F")), block2(SJ["mov"], "AVANZA", ar("F")),
          block2(SJ["mov"], "AVANZA", ar("F")), block2(SJ["mov"], "GIRA DERECHA", ar("R")), block2(SJ["mov"], "GIRA IZQUIERDA", ar("L")),
          block2(SJ["mov"], "RETROCEDE", ar("B")), block2(SJ["mov"], "SALTA", glyph("jump")), block2(SJ["fin"], "FIN", "", "end")]
    p2 = [block2(SJ["apar"], "DI «……»", glyph("bubble")), block2(SJ["apar"], "CRECE", glyph("grow")), block2(SJ["apar"], "ENCOGE", glyph("shrink")),
          block2(SJ["apar"], "DESAPARECE", glyph("hide")), block2(SJ["son"], "SONIDO", glyph("sound")), block2(SJ["ctrl"], "ESPERA", glyph("wait")),
          block2(SJ["ctrl"], "REPITE ___ VECES", glyph("repeat")), block2(SJ["ctrl"], "REPITE ___ VECES", glyph("repeat")), block2(SJ["fin"], "FIN", "", "end")]
    p3 = [block2(SJ["evento"], "CUANDO TOCO", glyph("touch", dk), "hat", dk), block2(SJ["evento"], "CUANDO CHOCA", glyph("crash", dk), "hat", dk),
          block2(SJ["evento"], "CUANDO APLAUDO", glyph("clap", dk), "hat", dk), block2(SJ["evento"], "CUANDO SUENA", glyph("bell", dk), "hat", dk),
          block2(SJ["evento"], "EMPIEZA", glyph("flag", dk), "hat", dk), block2(SJ["evento"], "ENVÍA MENSAJE", glyph("mail", dk), "normal", dk),
          block2(SJ["mov"], "AVANZA", ar("F")), block2(SJ["apar"], "DI «……»", glyph("bubble")), block2(SJ["fin"], "FIN", "", "end")]
    ses = "1º S10 a S16 y proyecto · 2º S10, S14, S17 a S21"
    return [page("M03", "Bloques de papel: movimiento", "1º y 2º", ses, uso, cards(p1, 3, 3), "c1", "Hoja 1 de 3"),
            page("M03", "Bloques de papel: apariencia y control", "1º y 2º", ses, uso, cards(p2, 3, 3), "c1", "Hoja 2 de 3"),
            page("M03", "Bloques de papel: eventos (2º)", "2º", "2º S10, S11, S14", uso, cards(p3, 3, 3), "c2", "Hoja 3 de 3")]


# ------------------------------------------------------------------ M04 SI / ENTONCES / SI NO
RULES2 = [("llover", "LLUEVE", "paraguas", "COJO EL PARAGUAS", "gorra", "COJO LA GORRA"),
          ("semaforo_peatones_verde", "EL MUÑECO ESTÁ EN VERDE", "mirar_lados", "MIRO A LOS LADOS Y CRUZO", "bordillo", "ESPERO EN EL BORDILLO"),
          ("sed", "TENGO SED", "beber_agua", "BEBO AGUA", "jugar", "SIGO JUGANDO"),
          ("timbre", "SUENA EL TIMBRE", "recreo", "SALGO AL RECREO", "trabajar", "SIGO TRABAJANDO"),
          ("dado", "EL DADO SALE PAR", "a:F", "AVANZO", "a:B", "RETROCEDO"),
          ("muro", "HAY UN MURO DELANTE", "a:R", "GIRO", "a:F", "AVANZO")]


def _cell(tag, color, p, t):
    art = f'<div style="width:30mm;height:30mm">{arrow_svg(p[2:], 100, ARROW_COLOR[p[2:]])}</div>' if p.startswith("a:") else pimg(p, 30)
    return (f'<div style="font:700 11pt Bahnschrift;color:#fff;background:{color};padding:1mm 3mm;border-radius:1.5mm">{tag}</div>{art}'
            f'<div class="lbl" style="font-size:10.5pt">{t}</div>')


def m04():
    uso = ("<b>Cómo usarlo:</b> una hoja por grupo. Recorta las tarjetas: <b>SI</b> (verde), <b>ENTONCES</b> (azul) y <b>SI NO</b> (rojo). "
           "En 2º se emparejan SI con ENTONCES. En 3º y 4º se añade la tarjeta SI NO para tener dos caminos. Cada fila es una regla completa.")
    pages = []
    for h, rules in enumerate((RULES2[:3], RULES2[3:])):
        items = []
        for a, at, b, bt, c, ct in rules:
            items += [_cell("SI", "#2a8f4f", a, at), _cell("ENTONCES", "#2c5bbf", b, bt), _cell("SI NO", "#cf3f36", c, ct)]
        pages.append(page("M04", "Tarjetas SI · ENTONCES · SI NO", "2º, 3º y 4º", "2º S9, S11, S14 · 3º S5 · 4º S3", uso,
                          cards(items, 3, 3) + credit_line(), "c2", f"Hoja {h + 1} de 2"))
    return pages


# ------------------------------------------------------------------ M05 roles
ROLES2 = [("rol_piloto", "PILOTO", "Yo pongo las manos", "Maneja el dispositivo, el robot o las tarjetas."),
          ("rol_copiloto", "COPILOTO", "Yo pongo los ojos", "Lee el reto, comprueba y avisa de los errores. No toca el dispositivo."),
          ("rol_material", "MATERIAL", "Yo cuido el material", "Recoge, cuenta, devuelve y pone a cargar."),
          ("rol_portavoz", "PORTAVOZ", "Yo pongo la voz", "Explica a la clase lo que ha hecho el grupo.")]


def m05():
    uso = ("<b>Cómo usarlo:</b> una hoja da dos juegos de roles. Deja un juego en cada mesa. En parejas solo se usan PILOTO y COPILOTO, "
           "que se cambian a mitad de la práctica. En grupos de 3 o 4, los roles rotan cada sesión.")
    items = [pimg(p, 24) + f'<div class="lbl" style="font-size:17pt">{n}</div><div style="font:italic 11pt Georgia">«{f}»</div><div class="sub">{d}</div>' for p, n, f, d in ROLES2] * 2
    return [page("M05", "Tarjetas de rol", "1º a 6º", "Todas las sesiones", uso, cards(items, 2, 4) + credit_line(), "c3")]


# ------------------------------------------------------------------ M06 tablero y fichas
TOKENS2 = [("robot", "ROBOT"), ("bandera_salida", "SALIDA"), ("tesoro", "TESORO"), ("piedra", "ROCA"), ("piedra", "ROCA"), ("piedra", "ROCA"),
           ("casa", "CASA"), ("arbol", "ÁRBOL"), ("colegio", "COLE"), ("buzon", "CORREOS"), ("contenedor", "CONTENEDOR"), ("semaforo_peatones_verde", "SEMÁFORO")]


def m06():
    uso = ("<b>Cómo usarlo:</b> tablero de mesa (hoja 1, mejor en A3) y fichas recortables (hoja 2). El alumnado mueve la ficha del robot con el dedo "
           "siguiendo las tarjetas de flechas. Las fichas sirven también para montar escenarios sobre el tapete de True True.")
    g = grid_svg(5, None, "N", (4, 0), [], cell=60, coords=True, goal_icon="")
    board = f'<div style="flex:1;display:flex;align-items:center;justify-content:center"><div style="width:180mm">{g}</div></div>'
    toks = [pimg(p, 26) + f'<div class="lbl" style="font-size:11pt">{t}</div>' for p, t in TOKENS2]
    return [page("M06", "Tablero de cuadrícula 5 × 5", "1º, 2º y 3º", "1º S4, S6, S9 · 2º S1, S4 · 3º S1", uso, board, "c1", "Hoja 1 de 2"),
            page("M06", "Fichas para el tablero", "1º, 2º y 3º", "1º S4, S6, S9 · 2º S1, S4 · 3º S1", uso, cards(toks, 3, 4) + credit_line(), "c1", "Hoja 2 de 2")]


# ------------------------------------------------------------------ M10 secuencias
ROUTINES2 = [("Lavarse las manos", [("grifo_abrir", "Abro el grifo"), ("frotar_jabon", "Me froto con jabón"), ("aclarar", "Me aclaro"), ("secar_toalla", "Me seco con la toalla")]),
             ("Ponerse los zapatos", [("calcetin_poner", "Me pongo los calcetines"), ("zapato", "Me pongo los zapatos"), ("atar_cordones", "Me ato los cordones"), ("andar", "Salgo a caminar")]),
             ("Plantar una semilla", [("sembrar", "Siembro la semilla"), ("regar", "La riego"), ("brotar", "Sale un brote"), ("planta_maceta", "Crece la planta")]),
             ("Hacer una tostada", [("pan_molde", "Cojo una rebanada de pan"), ("tostadora", "La meto en la tostadora"), ("untar", "Unto la tostada"), ("desayunar", "Me la como")]),
             ("Lavarse los dientes", [("cepillo", "Cojo el cepillo"), ("pasta_dientes", "Pongo la pasta"), ("cepillarse", "Me cepillo los dientes"), ("enjuagarse", "Me enjuago la boca")]),
             ("Cruzar la calle", [("bordillo", "Me paro en el bordillo"), ("peaton_rojo", "Espero: muñeco en rojo"), ("peaton_verde", "El muñeco se pone verde"), ("mirar_lados", "Miro a los dos lados"), ("paso_cebra", "Cruzo por el paso de cebra")])]
SHUF4, SHUF5 = [2, 0, 3, 1], [3, 0, 4, 1, 2]


def m10():
    uso = ("<b>Cómo usarlo:</b> cada fila es una rutina con un único orden posible. Se recortan las viñetas de una fila, se mezclan y el grupo las ordena "
           "de izquierda a derecha. Después la leen en voz alta con «primero, después, luego, por último». El número pequeño de la esquina indica el orden correcto.")
    pages = []
    for part in (ROUTINES2[:3], ROUTINES2[3:]):
        rows = ""
        for name, steps in part:
            order = SHUF5 if len(steps) == 5 else SHUF4
            cells = "".join(f'<div class="card" style="position:relative;padding:2mm"><span style="position:absolute;right:2mm;bottom:1mm;font-size:7pt;color:#b0b6c2">{j + 1}</span>{pimg(steps[j][0], 30 if len(steps) == 4 else 25)}<div style="font:600 10.5pt/1.15 Bahnschrift;margin-top:1.5mm">{steps[j][1]}</div></div>' for j in order)
            rows += f'<h2>{name}</h2><div class="cards" style="grid-template-columns:repeat({len(steps)},1fr);height:62mm">{cells}</div>'
        pages.append(page("M10", "Secuencias para ordenar", "1º y 2º", "1º S2, S3 · 2º S2", uso, rows + credit_line(), "c1"))
    return pages


# ------------------------------------------------------------------ M11 ¿Qué animal soy?
ANIMALS2 = [("perro", "Perro"), ("caballo", "Caballo"), ("pajaro", "Pájaro"), ("avestruz", "Avestruz"), ("pez", "Pez"), ("ballena", "Ballena"), ("mariposa", "Mariposa"), ("serpiente", "Serpiente")]
QUESTIONS2 = ["¿Tiene plumas?", "¿Tiene cuatro patas?", "¿Vive en el agua?", "¿Puede volar?", "¿Es más grande que una persona?"]


def m11():
    uso = ("<b>Cómo usarlo:</b> una hoja de tarjetas y una hoja de árbol por grupo. Se lee la pregunta de arriba y se reparten las tarjetas: "
           "las que dicen SÍ van a la izquierda y las que dicen NO, a la derecha. Se sigue con cada montón hasta que quede un solo animal "
           "y se escribe su nombre en la casilla de puntos.")
    an = [pimg(p, 34) + f'<div class="lbl" style="font-size:13pt">{n}</div>' for p, n in ANIMALS2]
    qs = "".join(f'<div class="box" style="font:600 11pt Bahnschrift;text-align:center">{q}</div>' for q in QUESTIONS2)
    # árbol guiado: (x, y, texto) de cada pregunta y sus dos hijos (pregunta o casilla final)
    Q = {"plumas": (190, 30, "¿Tiene plumas?"), "vuela1": (80, 130, "¿Puede volar?"), "agua": (360, 130, "¿Vive en el agua?"),
         "grande1": (240, 230, "¿Es más grande que una persona?"), "patas": (480, 230, "¿Tiene cuatro patas?"),
         "grande2": (400, 330, "¿Es más grande que una persona?"), "vuela2": (560, 330, "¿Puede volar?")}
    KIDS = {"plumas": ("vuela1", "agua"), "vuela1": (40, 120), "agua": ("grande1", "patas"), "grande1": (200, 280),
            "patas": ("grande2", "vuela2"), "grande2": (360, 440), "vuela2": (520, 600)}
    W, H = 136, 40
    g = ['<svg viewBox="0 0 640 470" width="100%" font-family="Bahnschrift, Segoe UI"><g stroke="#1a1d24" stroke-width="2" fill="none">']
    labels = []
    for k, (x, y, t) in Q.items():
        for side, ch in zip(("SÍ", "NO"), KIDS[k]):
            if isinstance(ch, str):
                cx, cy = Q[ch][0], Q[ch][1]
            else:
                cx, cy = ch, y + 100
            x0 = x - 30 if side == "SÍ" else x + 30
            g.append(f'<path d="M{x0} {y + H/2}L{cx} {cy - H/2 if isinstance(ch, str) else cy - 32}"/>')
            mx, my = (x0 + cx) / 2, (y + H/2 + cy - 30) / 2
            col = "#2a8f4f" if side == "SÍ" else "#cf3f36"
            labels.append(f'<rect x="{mx - 14}" y="{my - 9}" width="28" height="16" rx="8" fill="{col}"/><text x="{mx}" y="{my + 3.5}" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">{side}</text>')
            if not isinstance(ch, str):
                g.append(f'<rect x="{cx - 32}" y="{cy - 32}" width="64" height="58" rx="7" stroke-dasharray="4 3" stroke="#6b7385"/>')
    for k, (x, y, t) in Q.items():
        g.append(f'<rect x="{x - W/2}" y="{y - H/2}" width="{W}" height="{H}" rx="9" fill="#fff4e6" stroke="#e07a1f"/>')
        words = t.split(" ")
        lines = [t] if len(t) <= 22 else [" ".join(words[:3]), " ".join(words[3:])]
        for i, ln in enumerate(lines):
            dy = (i - (len(lines) - 1) / 2) * 13 + 4
            labels.append(f'<text x="{x}" y="{y + dy}" font-size="11.5" font-weight="600" fill="#1a1d24" text-anchor="middle">{ln}</text>')
    g.append("</g>" + "".join(labels) + "</svg>")
    sol = "<b>Para ir más lejos:</b> por detrás, inventad otro árbol que empiece por otra pregunta. ¿Os hacen falta más preguntas o menos?"
    return [page("M11", "¿Qué animal soy? Tarjetas", "2º (también 1º y 3º)", "2º S12, S13 · 1º S14", uso,
                 cards(an, 4, 2) + f'<h2>Preguntas de ayuda (recortar)</h2><div class="three">{qs}</div>' + credit_line(), "c2", "Hoja 1 de 2"),
            page("M11", "¿Qué animal soy? Árbol de preguntas", "2º (también 1º y 3º)", "2º S12", uso,
                 f'<div style="flex:1;display:flex;align-items:center">{"".join(g)}</div><p class="small" style="margin:0">{sol}</p>', "c2", "Hoja 2 de 2")]


# ------------------------------------------------------------------ M12 diagramas
def m12():
    uso = ("<b>Cómo usarlo:</b> hoja 1: formas para recortar y construir diagramas en la mesa (óvalo = empezar o terminar, rectángulo = hacer algo, "
           "rombo = pregunta de sí o no). Hoja 2: ejemplo resuelto. Hoja 3: diagrama para completar (solución en la ficha de la sesión).")
    ov = lambda t: f'<div style="width:52mm;height:20mm;border:2.5px solid #2a8f4f;background:#e9f5ee;border-radius:12mm;display:flex;align-items:center;justify-content:center;font:700 14pt Bahnschrift">{t}</div>'
    rc = '<div style="width:52mm;height:20mm;border:2.5px solid #2c5bbf;background:#eaf0fb;border-radius:1mm"></div>'
    dm = '<div style="width:34mm;height:34mm;border:2.5px solid #df7619;background:#fff4e3;transform:rotate(45deg);margin:6mm"></div>'
    shapes = cards([ov("EMPIEZA"), ov("TERMINA")] + [rc] * 6 + [dm] * 3 + ['<div class="sub" style="font-size:11pt">Las flechas se dibujan entre las formas</div>'], 3, 4)
    ex = flow_svg([("oval", "EMPIEZA"), ("rect", "Llego al paso de cebra"), ("diam", "¿Muñeco del semáforo en verde?", "loop"), ("rect", "Miro a los dos lados"), ("rect", "Cruzo la calle"), ("oval", "TERMINA")])
    ex_note = '<p class="small">Si la respuesta es NO, espero en el bordillo y vuelvo a mirar el semáforo de peatones: la flecha vuelve a la pregunta. Eso es un bucle dentro del diagrama.</p>'
    fill = flow_svg([("oval", "EMPIEZA"), ("rect", ""), ("diam", "¿La tierra está seca?", "skip"), ("rect", ""), ("rect", ""), ("oval", "TERMINA")])
    return [page("M12", "Formas de diagrama de flujo", "3º y 4º", "3º S2, S5 · 4º S3", uso, shapes, "c3", "Hoja 1 de 3"),
            page("M12", "Ejemplo: cruzar la calle", "3º y 4º", "3º S2 · 4º S3", uso, f'<div style="width:140mm;margin:0 auto">{ex}</div>{ex_note}', "c3", "Hoja 2 de 3"),
            page("M12", "Completa el diagrama: regar una planta", "3º y 4º", "3º S2", uso, f'<div style="width:140mm;margin:0 auto">{fill}</div>', "c3", "Hoja 3 de 3")]


# ------------------------------------------------------------------ M13 tableros
OCA2 = {3: "SI sacas un número par, avanza 2. SI NO, quédate donde estás.", 6: "SI sacas un 5 o un 6, salta a la 9. SI NO, avanza 1.",
        8: "SI sacas un 6, vuelve a tirar. SI NO, pierdes el turno.", 11: "SI sacas más de 3, avanza 2. SI NO, retrocede 2.",
        14: "SI sacas un número impar, retrocede 2. SI NO, avanza 1.", 17: "SI sacas un 1 o un 2, avanza 1. SI NO, retrocede 1."}


def m13():
    uso = ("<b>Cómo usarlo:</b> hoja 1 (3º): tablero de 20 casillas. Grupos de 3 o 4, un dado y una ficha por jugador (valen tapones). Se tira el dado y se avanza; "
           "si se cae en una casilla naranja, se lee su regla y se hace lo que diga con el número que se acaba de sacar. Gana quien llegue primero a la 20 (no hace falta número exacto). "
           "Hoja 2 (2º): tablero en blanco para crear un juego propio con al menos 3 reglas.")
    def board(n, rules, blank=False):
        cells = []
        for i in range(1, n + 1):
            r = rules.get(i, "")
            reg = blank and i in (4, 8, 12)
            bg = "#fff4e3" if (r or reg) else "#fff"
            extra = f'<span style="font-size:8.5pt;line-height:1.25">{E(r)}</span>' if r else ('<span class="small">regla: SI… ENTONCES…</span>' if reg else "")
            top = '<span style="font-size:9pt;font-weight:700">SALIDA</span>' if i == 1 else ""
            end = pimg("bandera_meta", 14) if i == n else ""
            cells.append(f'<div style="border:1.5px solid #1a1d24;background:{bg};padding:1.5mm;min-height:30mm;display:flex;flex-direction:column;gap:1mm">{top}<b style="font:700 13pt Bahnschrift">{i}</b>{extra}{end}</div>')
        return f'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:1.5mm;flex:1">{"".join(cells)}</div>'
    rules_card = '<div class="box"><b>Reglas de mi juego</b><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div>'
    return [page("M13", "La oca de las condiciones", "3º", "3º S5", uso, board(20, OCA2), "c3", "Hoja 1 de 2"),
            page("M13", "Mi juego de mesa con reglas", "2º", "2º S14, S15, S16", uso,
                 '<div class="box" style="font-size:10pt">Título: ____________________ &nbsp; Tema: ____________________</div>' + board(15, {}, True) + rules_card, "c2", "Hoja 2 de 2")]


# ------------------------------------------------------------------ M15, M17, M19: caritas
def m17():
    uso = "<b>Cómo usarlo:</b> se rellena al probar el proyecto de otro grupo. La versión con caritas es para 1º y 2º; la escrita, de 3º en adelante. Cuatro fichas por hoja."
    c12 = (f'<div style="display:flex;flex-direction:column;gap:2mm;width:100%;text-align:left;font-size:11pt"><b>Proyecto del equipo: __________</b>'
           f'<div>¿Funciona? &nbsp; {FACES}</div><div>¿Dónde falla? (dibujo o número del paso)</div><div style="height:20mm;border:1.2px dashed #9aa1ad"></div>'
           f'<div>Lo que más me gusta (dibujo)</div><div style="height:20mm;border:1.2px dashed #9aa1ad"></div></div>')
    c36 = ('<div style="display:flex;flex-direction:column;gap:1.5mm;width:100%;text-align:left;font-size:10pt"><b>Proyecto: _________ Probado por: _________</b>'
           '<div>¿Se entiende sin explicarlo? ☐ sí ☐ más o menos ☐ no</div><div>¿Funciona todo? ☐ sí ☐ casi ☐ no</div>'
           '<div><b>Error encontrado</b> (qué pasa y cuándo):</div><div class="line"></div><div><b>Lo que más nos ha gustado:</b></div><div class="line"></div>'
           '<div><b>Otra cosa que nos ha gustado:</b></div><div class="line"></div><div><b>Una idea para mejorar:</b></div><div class="line"></div></div>')
    return [page("M17", "Ficha de prueba · 1º y 2º", "1º y 2º", "1º S21 · 2º S15, S20", uso, cards([c12] * 4, 2, 2), "c4", "1 de 2"),
            page("M17", "Ficha de prueba y playtesting · 3º a 6º", "3º a 6º", "3º S16, S22 · 4º S7, S14, S22 · 5º S13 · 6º S13", uso, cards([c36] * 4, 2, 2), "c4", "2 de 2")]


def m18():
    uso = "<b>Cómo usarlo:</b> media hoja por equipo y sesión. Se rellena en los 5 minutos finales y se guarda dentro de la caja del kit. Se lee en los 3 primeros minutos de la siguiente sesión."
    t = '''<div style="width:100%;text-align:left;font-size:11pt;display:flex;flex-direction:column;gap:2.5mm"><div style="font:700 15pt Bahnschrift">DÓNDE LO DEJAMOS</div>
<div>Equipo: ____________________ &nbsp; Sesión nº: ____ &nbsp; Fecha: ________</div><div>Hoy hemos hecho:</div><div class="line"></div><div class="line"></div>
<div>Funciona: ☐ sí &nbsp; ☐ a medias &nbsp; ☐ no</div><div>Lo que falta:</div><div class="line"></div><div>Archivo guardado como: ______________________</div>
<div>Foto del montaje (sin caras): ☐ hecha</div><div>Para la próxima vez necesitamos: ______________________</div></div>'''
    return [page("M18", "Tarjeta «Dónde lo dejamos»", "5º y 6º", "Todas las sesiones de 5º y 6º", uso, cards([t, t], 1, 2), "c5")]


# ------------------------------------------------------------------ M23

NEWS = [("«Un colegio de Madrid instala huertos en su patio»", "Verdad probable", "Noticia normal, sin exagerar. Se puede comprobar en la web del colegio o del ayuntamiento."),
        ("«¡Increíble! Un perro aprende a hablar tres idiomas en una semana»", "Bulo", "Titular exagerado, con signos de exclamación y algo imposible."),
        ("Foto de una ciudad con edificios que se derriten como helado", "Imagen hecha con IA", "Algo imposible, formas raras, detalles que no encajan."),
        ("«Mañana no hay clase en toda España, pásalo»", "Bulo", "Pide que lo compartas, no dice quién lo dice ni da ninguna fuente."),
        ("Foto de una persona con seis dedos en una mano", "Imagen hecha con IA", "Las manos y los textos son los errores más típicos de las imágenes de IA."),
        ("«La NASA publica nuevas fotos de Marte tomadas por su robot»", "Verdad probable", "Fuente conocida y fácil de comprobar en su web oficial."),
        ("«Comer un limón al día evita todas las enfermedades»", "Bulo", "Promete demasiado y no cita a ningún experto ni estudio."),
        ("Vídeo de un gato tocando el piano perfectamente una canción difícil", "Posible IA o montaje", "Mira si aparece en medios fiables. Si solo está en una red social, desconfía.")]

FANT2 = [(["gato_tumbado"], "El gato duerme en el sofá", True), (["vaca", "volar"], "La vaca vuela por el cielo", False),
         (["pez"], "El pez nada en el agua", True), (["pez", "leer"], "El pez lee un libro", False),
         (["pajaro_volando"], "El pájaro vuela", True), (["caballo", "patinar"], "El caballo patina sobre ruedas", False),
         (["vaca", "vaso_leche"], "La vaca da leche", True), (["perro", "cantar"], "El perro canta una canción", False)]


def m23():
    def fcard(ps, t):
        art = '<span style="font:700 18pt Bahnschrift;color:#9aa1ad">+</span>'.join(f'<div style="width:24mm">{pimg(p, 24)}</div>' for p in ps)
        return f'<div style="display:flex;align-items:center;gap:2mm;justify-content:center">{art}</div><div style="font:600 12pt Bahnschrift">{t}</div><div class="small" style="margin-top:1mm">¿Puede pasar de verdad o es inventado?</div>'
    fan = [fcard(ps, t) for ps, t, _ in FANT2]
    sol1 = "Soluciones. Pasa de verdad: " + ", ".join(t.lower() for _, t, r in FANT2 if r) + ". Es inventado: " + ", ".join(t.lower() for _, t, r in FANT2 if not r) + "."
    news = [f'<div style="font:600 12pt Bahnschrift">{E(t)}</div><div class="small">¿Verdad, bulo o hecho con IA?</div>' for t, _, _ in NEWS]
    sol2 = "".join(f"<p style='margin:1mm 0'><b>{i + 1}. {E(v)}.</b> {E(p)}</p>" for i, (_, v, p) in enumerate(NEWS))
    uso1 = "<b>Cómo usarlo:</b> tarjetas para votar (verde: puede pasar de verdad; rojo: es inventado) o para proyectar. Se comenta por qué algo no puede pasar. Es la base para distinguir imágenes reales de imágenes inventadas."
    uso2 = "<b>Cómo usarlo:</b> una hoja por equipo, o proyectar una a una. Cada equipo decide y explica sus pistas. Después se leen las pistas de la hoja de soluciones."
    return [page("M23", "¿Puede pasar de verdad?", "1º y 2º", "1º S14 · 2º S13", uso1, cards(fan, 2, 4) + f'<div class="sol">{sol1}</div>' + credit_line(), "c1", "1º y 2º"),
            page("M23", "¿Verdad, bulo o IA?", "5º y 6º", "5º S9 · 6º S8", uso2, cards(news, 2, 4), "c5", "5º y 6º"),
            page("M23", "¿Verdad, bulo o IA? · soluciones y pistas", "5º y 6º", "Para el docente", "Pistas para comentar después de votar.", f'<div class="sol" style="font-size:10.5pt">{sol2}</div>', "c5", "Soluciones")]




# ------------------------------------------------------------------ M26 pósteres de conceptos · M27 palabras del curso
from vocabulario import POSTERS, VOCAB  # noqa: E402

PST_CSS = """<style>
.pst{gap:6mm}
.pst-top{background:var(--c);color:#fff;border-radius:5mm;padding:7mm 9mm 8mm}
.pst-k{font:600 9pt 'Segoe UI';letter-spacing:.14em;text-transform:uppercase;opacity:.85}
.pst-title{font:700 54pt/1 Bahnschrift,'Segoe UI';letter-spacing:-.01em;margin:2mm 0 3mm}
.pst-def{font:500 17pt/1.3 'Segoe UI'}
.pst-vis{flex:1;min-height:0;border:2px solid #e3e6ec;border-radius:5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5mm;padding:6mm}
.pst-lad{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.pst-lad div{border-top:5px solid var(--c);background:#f5f6f8;border-radius:0 0 3mm 3mm;padding:3mm 4mm;font:11pt/1.35 'Segoe UI'}
.pst-lad b{display:block;font:700 10pt Bahnschrift;letter-spacing:.06em;text-transform:uppercase;color:var(--c);margin-bottom:1mm}
.pst-key{font:italic 600 18pt Georgia,serif;text-align:center;color:#1a1d24}
.pst-key:before{content:'«'}.pst-key:after{content:'»'}
.vlab{font:700 12pt Bahnschrift,'Segoe UI';text-align:center}
.vsub{font:10pt 'Segoe UI';color:#6b7385;text-align:center}
.arrow-r{font:700 26pt Bahnschrift;color:#9aa1b1}
</style>"""

PCOLOR = ["c1", "c2", "c3", "c4", "c5", "c6", "c1", "c2", "c3", "c4"]


def _steps(items, mm=30):
    out = []
    for i, (pic, lab) in enumerate(items):
        if i:
            out.append('<div class="arrow-r">→</div>')
        out.append(f'<div style="display:flex;flex-direction:column;align-items:center;gap:2mm;width:{mm + 8}mm">'
                   f'<div style="font:700 14pt Bahnschrift;color:#fff;background:var(--c);width:9mm;height:9mm;border-radius:50%;display:flex;align-items:center;justify-content:center">{i + 1}</div>'
                   f'{pimg(pic, mm)}<div class="vlab">{lab}</div></div>')
    return f'<div style="display:flex;align-items:center;gap:3mm">{"".join(out)}</div>'


def _repite(n, inner, mm=13):
    cells = "".join(f'<div style="width:{mm}mm;height:{mm}mm">{arrow_svg(k, 100, ARROW_COLOR[k])}</div>' for k in inner)
    return (f'<div style="display:inline-flex;flex-direction:column;border-radius:3mm;overflow:hidden;border:2px solid #c46f00">'
            f'<div style="background:{SJ["ctrl"]};color:#fff;font:700 14pt Bahnschrift;padding:1.5mm 4mm">REPITE ×{n}</div>'
            f'<div style="display:flex;gap:1.5mm;padding:2mm 3mm;background:#fff4e3">{cells}</div></div>')


def _cards(prog, mm=11, bugs=()):
    return "".join(f'<div style="width:{mm}mm;height:{mm}mm;{"outline:3px solid #cf3f36;outline-offset:1.5mm;border-radius:2mm" if i in bugs else ""}">'
                   f'{arrow_svg(k, 100, ARROW_COLOR[k])}</div>' for i, k in enumerate(prog))


def _box(label, value, color="#2c5bbf"):
    return (f'<svg viewBox="0 0 150 130" style="width:46mm"><path d="M15 45 L75 20 L135 45 L135 115 L15 115 Z" fill="#eaf0fb" stroke="{color}" stroke-width="4" stroke-linejoin="round"/>'
            f'<rect x="30" y="4" width="90" height="26" rx="6" fill="{color}"/><text x="75" y="23" text-anchor="middle" font-family="Bahnschrift, Segoe UI" font-weight="700" font-size="16" fill="#fff">{label}</text>'
            f'<text x="75" y="100" text-anchor="middle" font-family="Bahnschrift, Segoe UI" font-weight="700" font-size="46" fill="#1a1d24">{value}</text></svg>')


def poster_visual(key):
    if key == "algoritmo":
        return _steps([("pan_molde", "Cojo el pan"), ("tostadora", "Lo tuesto"), ("untar", "Lo unto"), ("desayunar", "Me lo como")], 26) + \
            '<div class="vsub">Cada paso va en su sitio: si los cambio de orden, no sale la tostada.</div>'
    if key == "descomponer":
        parts = ["Personaje", "Premio", "Enemigo", "Puntos", "Final"]
        xs = [60, 190, 320, 450, 580]
        svg = ['<svg viewBox="0 0 640 250" style="width:172mm"><g stroke="#9aa1b1" stroke-width="3">']
        svg += [f'<line x1="320" y1="70" x2="{x}" y2="160"/>' for x in xs]
        svg.append('</g><rect x="170" y="10" width="300" height="60" rx="12" fill="#2a8f4f"/>'
                   '<text x="320" y="49" text-anchor="middle" font-family="Bahnschrift, Segoe UI" font-weight="700" font-size="22" fill="#fff">HACER UN VIDEOJUEGO</text>')
        for x, t in zip(xs, parts):
            svg.append(f'<rect x="{x - 58}" y="160" width="116" height="52" rx="10" fill="#e9f5ee" stroke="#2a8f4f" stroke-width="3"/>'
                       f'<text x="{x}" y="192" text-anchor="middle" font-family="Bahnschrift, Segoe UI" font-weight="700" font-size="18" fill="#1a1d24">{t}</text>')
        svg.append('</svg>')
        return "".join(svg) + '<div class="vsub">Un problema grande se parte en partes pequeñas que se hacen una a una.</div>'
    if key == "patron":
        R, B = "#cf3f36", "#2c5bbf"
        seq = [("c", R), ("s", B), ("c", R), ("s", B), ("c", R)]
        items = "".join(f'<div style="width:22mm;height:22mm">{shape_svg(sh, col)}</div>' for sh, col in seq)
        q = '<div style="width:22mm;height:22mm;border:3px dashed #9aa1b1;border-radius:3mm;display:flex;align-items:center;justify-content:center;font:700 30pt Bahnschrift;color:#9aa1b1">?</div>'
        return f'<div style="display:flex;gap:4mm;align-items:center">{items}{q}</div><div class="vsub">La regla: círculo rojo, cuadrado azul… ¿Qué viene ahora?</div>'
    if key == "bucle":
        long_ = f'<div style="display:flex;flex-wrap:wrap;gap:1.5mm;width:62mm;justify-content:center">{_cards("FRFRFRFR", 13)}</div>'
        return ('<div style="display:flex;gap:10mm;align-items:center">'
                f'<div style="display:flex;flex-direction:column;align-items:center;gap:3mm"><div class="vlab">SIN BUCLE</div>{long_}<div class="vsub">8 tarjetas</div></div>'
                '<div class="arrow-r">→</div>'
                f'<div style="display:flex;flex-direction:column;align-items:center;gap:3mm"><div class="vlab">CON BUCLE</div>{_repite(4, "FR", 15)}<div class="vsub">3 tarjetas</div></div></div>'
                '<div class="vsub">Los dos programas hacen lo mismo: un cuadrado.</div>')
    if key == "condicion":
        diam = ('<svg viewBox="0 0 320 120" style="width:95mm"><path d="M160 6 L314 60 L160 114 L6 60 Z" fill="#fff4e3" stroke="#df7619" stroke-width="4"/>'
                '<text x="160" y="55" text-anchor="middle" font-family="Bahnschrift, Segoe UI" font-weight="700" font-size="19" fill="#1a1d24">¿El muñeco del</text>'
                '<text x="160" y="79" text-anchor="middle" font-family="Bahnschrift, Segoe UI" font-weight="700" font-size="19" fill="#1a1d24">semáforo está en verde?</text></svg>')
        br = lambda tag, col, pic, lab: (f'<div style="display:flex;flex-direction:column;align-items:center;gap:2mm;width:60mm">'
                                         f'<div style="font:700 13pt Bahnschrift;color:#fff;background:{col};padding:1mm 5mm;border-radius:2mm">{tag}</div>{pimg(pic, 30)}<div class="vlab">{lab}</div></div>')
        return (f'{diam}<div style="display:flex;gap:18mm">{br("SÍ · ENTONCES", "#2a8f4f", "mirar_lados", "MIRO A LOS LADOS Y CRUZO")}'
                f'{br("SI NO", "#cf3f36", "bordillo", "ESPERO EN EL BORDILLO")}</div>')
    if key == "evento":
        hats = (f'<div style="display:flex;gap:6mm;align-items:flex-start;transform:scale(1.35);transform-origin:center;margin-top:4mm">'
                f'{sblock("eve", "al hacer clic en " + FLAG, True)}{sblock("eve", "al presionar tecla espacio", True)}</div>')
        return (_steps([("timbre", "CUANDO suena el timbre"), ("recreo", "salimos al recreo")], 34).replace('<div class="arrow-r">→</div>', '<div class="arrow-r" style="margin:0 6mm">→</div>')
                + '<div class="vsub">En Scratch, los eventos son los bloques amarillos con forma de gorro:</div>' + hats)
    if key == "variable":
        return (f'<div style="display:flex;align-items:center;gap:6mm">{_box("puntos", "3")}'
                '<div style="display:flex;flex-direction:column;align-items:center"><div style="font:700 20pt Bahnschrift;color:#2a8f4f">+1</div><div class="arrow-r">→</div></div>'
                f'{_box("puntos", "4")}</div><div class="vsub">La caja se sigue llamando «puntos», pero ahora guarda un 4.</div>'
                f'<div style="transform:scale(1.3)">{sblock("var", "sumar a puntos 1")}</div>')
    if key == "depurar":
        return ('<div style="display:flex;align-items:center;gap:8mm">'
                f'<div style="display:flex;flex-direction:column;align-items:center;gap:3mm"><div class="vlab" style="color:#cf3f36">CON BICHO</div><div style="display:flex;gap:2mm">{_cards("FFRF", 16, bugs=(2,))}</div></div>'
                '<div class="arrow-r">→</div>'
                f'<div style="display:flex;flex-direction:column;align-items:center;gap:3mm"><div class="vlab" style="color:#2a8f4f">ARREGLADO</div><div style="display:flex;gap:2mm">{_cards("FFFF", 16)}</div></div></div>'
                '<div class="vsub">El robot tenía que ir recto 4 casillas. El bicho está en la tarjeta 3.</div>'
                '<div style="display:flex;gap:6mm;font:11pt \'Segoe UI\'"><span>1. ¿Qué quería que pasara?</span><span>2. ¿Qué ha pasado?</span><span>3. ¿Dónde empieza a fallar?</span></div>')
    if key == "entradasalida":
        col = lambda t, color, inner, sub: (f'<div style="display:flex;flex-direction:column;align-items:center;gap:2mm;width:50mm">'
                                            f'<div style="font:700 13pt Bahnschrift;color:#fff;background:{color};padding:1mm 5mm;border-radius:2mm">{t}</div>{inner}<div class="vsub">{sub}</div></div>')
        salida = f'<div style="width:34mm;height:34mm">{arrow_svg("F", 100, ARROW_COLOR["F"])}</div>'
        return (f'<div style="display:flex;align-items:center;gap:4mm">{col("ENTRADA", "#2c5bbf", pimg("mano", 38), "Pulso un botón")}<div class="arrow-r">→</div>'
                f'{col("PROGRAMA", "#df7619", pimg("robot", 38), "El robot sigue sus instrucciones")}<div class="arrow-r">→</div>'
                f'{col("SALIDA", "#2a8f4f", salida, "El robot avanza")}</div>')
    if key == "optimizar":
        return ('<div style="display:flex;flex-direction:column;align-items:center;gap:3mm"><div class="vlab">ANTES · 12 tarjetas</div>'
                f'<div style="display:flex;gap:1.2mm">{_cards("FFFRFFFRFFFR", 11)}</div></div>'
                '<div class="arrow-r">↓</div>'
                f'<div style="display:flex;flex-direction:column;align-items:center;gap:3mm"><div class="vlab">DESPUÉS · 5 tarjetas</div>{_repite(3, "FFFR", 12)}</div>'
                '<div class="vsub">El mismo camino, con 7 tarjetas menos.</div>')
    raise KeyError(key)


def poster(i, key, title, definition, phrase, ladder):
    c = PCOLOR[i]
    zoom = {"algoritmo": 1.0, "descomponer": 1.0, "patron": 1.15, "bucle": 1.4, "condicion": 1.3, "evento": 1.35,
            "variable": 1.45, "depurar": 1.05, "entradasalida": 1.0, "optimizar": 1.2}[key]
    vis = poster_visual(key)
    lad ="".join(f"<div><b>{E(cyc)}</b>{E(txt)}</div>" for cyc, txt in ladder)
    body = (f'{PST_CSS}<div class="pst-top"><div class="pst-k">Código Escuela 4.0 · Concepto {i + 1} de {len(POSTERS)}</div>'
            f'<div class="pst-title">{E(title)}</div><div class="pst-def">{E(definition)}</div></div>'
            f'<div class="pst-vis"><div style="zoom:{zoom};display:flex;flex-direction:column;align-items:center;gap:5mm;max-width:100%">{vis}</div></div><div class="pst-lad">{lad}</div><div class="pst-key">{E(phrase)}</div>')
    if "/picto/" in vis:
        body += credit_line()
    return (f'<section class="page pst" style="--c:{C[c]}">{body}'
            f'<div class="ft"><span>Guía didáctica Código Escuela 4.0 · Primaria · 2026-2027</span><span>M26 · Póster «{E(title.capitalize())}»</span></div></section>')


def m26():
    uso = ("<b>Cómo usarlo:</b> un póster por concepto, para la pared del aula. Se imprimen en A4 o ampliados a A3 (la calidad no se pierde). "
           "Cada póster explica el concepto con un ejemplo y muestra cómo se trabaja en cada ciclo, así que sirve de 1º a 6º. "
           "Cuélgalo en la sesión en que aparece por primera vez y señálalo cuando vuelva a salir.")
    rows = "".join(f"<tr><td><b>{i + 1}. {E(t.capitalize())}</b></td><td>{E(d)}</td><td>{E(w)}</td></tr>" for i, (k, t, d, ph, lad, w) in enumerate(POSTERS))
    index = f"<table><tr><th style='width:26%'>Póster</th><th>Qué es</th><th style='width:24%'>Cuándo colgarlo</th></tr>{rows}</table>"
    pages = [page("M26", "Pósteres de conceptos", "1º a 6º", "Toda la etapa", uso, index, "c3", "Índice")]
    for i, (k, t, d, ph, lad, w) in enumerate(POSTERS):
        pages.append(poster(i, k, t, d, ph, lad))
    return pages


def m27():
    uso = ("<b>Cómo usarlo:</b> una hoja por curso con las palabras de programación nuevas de ese año, qué significan y en qué sesión aparecen. "
           "Para la pared del aula o para el cuaderno. Las de los cursos anteriores se siguen usando.")
    names = {1: "1º", 2: "2º", 3: "3º", 4: "4º", 5: "5º", 6: "6º"}
    pages = []
    for c, words in VOCAB.items():
        rows = "".join(f"<tr><td style='font:700 13pt Bahnschrift;width:30%'>{E(w)}</td><td style='font-size:11.5pt'>{E(d)}</td>"
                       f"<td style='width:10%;text-align:center;color:#6b7385'>{E(sn)}</td></tr>" for w, d, sn in words)
        body = f"<table><tr><th>Palabra</th><th>Qué significa</th><th>Sesión</th></tr>{rows}</table>"
        pages.append(page("M27", f"Palabras de {names[c]}", names[c], "Todo el curso", uso, body, f"c{c}", f"{names[c]} · hoja {c} de 6"))
    return pages


MATERIALS = [
    ("M01", "Tarjetas de flechas", "1º-3º", m01), ("M02", "Tarjetas de movimientos", "1º-2º", m02),
    ("M03", "Bloques de papel tipo ScratchJr", "1º-2º", m03), ("M04", "Tarjetas SI · ENTONCES · SI NO", "2º-4º", m04),
    ("M05", "Tarjetas de rol", "1º-6º", m05), ("M06", "Tablero de cuadrícula y fichas", "1º-3º", m06),
    ("M07", "Mapas del tesoro", "1º-2º", m07), ("M08", "Cazabichos por niveles", "1º-3º", m08),
    ("M09", "Patrones", "1º-2º", m09), ("M10", "Secuencias para ordenar", "1º-2º", m10),
    ("M11", "¿Qué animal soy?", "2º", m11), ("M12", "Diagramas de flujo", "3º-4º", m12),
    ("M13", "Tableros de juego con condiciones", "2º-3º", m13), ("M14", "Misión final del trimestre", "2º-3º", m14),
    ("M15", "Pasaporte del programador", "1º-6º", m15), ("M16", "Fichas de planificación", "1º-6º", m16),
    ("M17", "Fichas de prueba y playtesting", "1º-6º", m17), ("M18", "Tarjeta «Dónde lo dejamos»", "5º-6º", m18),
    ("M19", "Rúbrica y autoevaluación", "1º-6º", m19), ("M20", "Chuleta de bloques de Scratch", "3º-5º", m20),
    ("M21", "Chuleta de bloques de MakeCode", "5º-6º", m21), ("M22", "Plantilla de mando Makey Makey", "3º-4º", m22),
    ("M23", "¿Real o fantasía? · ¿Verdad, bulo o IA?", "1º-2º · 5º-6º", m23), ("M24", "Casos de IA y redes para debatir", "5º-6º", m24),
    ("M25", "Hojas de registro de datos", "3º-6º", m25),
    ("M26", "Pósteres de conceptos", "1º-6º", m26), ("M27", "Palabras del curso", "1º-6º", m27),
]


def slug(code, title):
    import unicodedata
    t = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode()
    t = "".join(ch if ch.isalnum() else "-" for ch in t).strip("-").lower()
    while "--" in t:
        t = t.replace("--", "-")
    return f"{code}-{t}"


def build(only=None):
    SRC.mkdir(parents=True, exist_ok=True)
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    index = []
    for code, title, courses, fn in MATERIALS:
        if only and code not in only:
            continue
        pages = fn()
        name = slug(code, title)
        doc = f'<!doctype html><html lang="es"><meta charset="utf-8"><title>{code} {E(title)}</title><style>{CSS}</style><body>{"".join(pages)}</body></html>'
        src = SRC / f"{name}.html"
        src.write_text(doc, encoding="utf-8")
        pdf_web = OUT_WEB / f"{name}.pdf"
        pdf_web.unlink(missing_ok=True)
        subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={HERE / ('.edge-perfil-' + code)}", "--no-pdf-header-footer", f"--print-to-pdf={pdf_web}", src.as_uri()],
                       check=True, capture_output=True, timeout=120)
        for _ in range(60):
            if pdf_web.exists() and pdf_web.stat().st_size > 0:
                break
            time.sleep(0.5)
        time.sleep(1)
        (OUT_ROOT / f"{name}.pdf").write_bytes(pdf_web.read_bytes())
        index.append((code, title, courses, name, len(pages)))
        print(code, name, len(pages), "págs")
    return index


if __name__ == "__main__":
    import sys
    build(set(sys.argv[1:]) or None)
