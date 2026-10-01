# Piezas gráficas compartidas por el material imprimible y la web (flechas, robot, bloques, formas).
from collections import deque


def _pp(name):
    from pictos import path
    return path(name)

INK = "#1a1d24"
C = {"c1": "#cf3f36", "c2": "#df7619", "c3": "#2a8f4f", "c4": "#108394", "c5": "#2c5bbf", "c6": "#6c44b0"}
# Colores tipo ScratchJr
SJ = {"evento": "#f5c518", "mov": "#3f8fe6", "apar": "#a45bd6", "son": "#3db46d", "ctrl": "#f39a2b", "fin": "#e0443a"}


def arrow_svg(kind, size=100, color="#2c5bbf", fg="#ffffff", rounded=True):
    """Tarjeta cuadrada con flecha: F avanza, R gira derecha, L gira izquierda, B retrocede."""
    s = size
    bg = f'<rect x="2" y="2" width="{s-4}" height="{s-4}" rx="{s*0.14 if rounded else 0}" fill="{color}"/>'
    sw = s * 0.11
    if kind == "F":
        g = f'<path d="M{s/2} {s*0.8}V{s*0.24}M{s*0.3} {s*0.43}L{s/2} {s*0.22}L{s*0.7} {s*0.43}" stroke="{fg}" stroke-width="{sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    elif kind == "B":
        g = f'<path d="M{s/2} {s*0.2}V{s*0.76}M{s*0.3} {s*0.57}L{s/2} {s*0.78}L{s*0.7} {s*0.57}" stroke="{fg}" stroke-width="{sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    else:
        # arco de 3/4 de vuelta con punta
        r = s * 0.25
        cx, cy = s / 2, s * 0.54
        if kind == "R":
            d = f"M{cx - r} {cy} A{r} {r} 0 1 1 {cx} {cy + r}"
            tip = f"M{cx + s*0.02} {cy + r - s*0.13}L{cx - s*0.02} {cy + r}L{cx + s*0.1} {cy + r + s*0.1}"
            d = f"M{cx - r} {cy} A{r} {r} 0 1 1 {cx + r} {cy}"
            tip = f"M{cx + r - s*0.13} {cy - s*0.06}L{cx + r} {cy + s*0.07}L{cx + r + s*0.12} {cy - s*0.06}"
        else:
            d = f"M{cx + r} {cy} A{r} {r} 0 1 0 {cx - r} {cy}"
            tip = f"M{cx - r + s*0.13} {cy - s*0.06}L{cx - r} {cy + s*0.07}L{cx - r - s*0.12} {cy - s*0.06}"
        g = (f'<path d="{d}" stroke="{fg}" stroke-width="{sw}" fill="none" stroke-linecap="round"/>'
             f'<path d="{tip}" stroke="{fg}" stroke-width="{sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    return f'<svg viewBox="0 0 {s} {s}" width="100%" height="100%">{bg}{g}</svg>'


def robot_svg(direction="N", size=60, color="#2c5bbf"):
    rot = {"N": 0, "E": 90, "S": 180, "O": 270}[direction]
    s = size
    return (f'<svg viewBox="0 0 {s} {s}" width="100%" height="100%"><g transform="rotate({rot} {s/2} {s/2})">'
            f'<rect x="{s*.18}" y="{s*.26}" width="{s*.64}" height="{s*.6}" rx="{s*.14}" fill="{color}"/>'
            f'<path d="M{s*.34} {s*.26}L{s/2} {s*.06}L{s*.66} {s*.26}Z" fill="{color}"/>'
            f'<circle cx="{s*.38}" cy="{s*.46}" r="{s*.07}" fill="#fff"/><circle cx="{s*.62}" cy="{s*.46}" r="{s*.07}" fill="#fff"/>'
            f'<circle cx="{s*.38}" cy="{s*.44}" r="{s*.03}" fill="{INK}"/><circle cx="{s*.62}" cy="{s*.44}" r="{s*.03}" fill="{INK}"/>'
            f'<rect x="{s*.36}" y="{s*.64}" width="{s*.28}" height="{s*.07}" rx="{s*.03}" fill="#fff"/></g></svg>')


def shape_svg(shape, color, size=40):
    s = size
    if shape == "c":
        g = f'<circle cx="{s/2}" cy="{s/2}" r="{s*.4}" fill="{color}"/>'
    elif shape == "s":
        g = f'<rect x="{s*.12}" y="{s*.12}" width="{s*.76}" height="{s*.76}" rx="{s*.08}" fill="{color}"/>'
    elif shape == "t":
        g = f'<path d="M{s/2} {s*.1}L{s*.9} {s*.86}H{s*.1}Z" fill="{color}"/>'
    elif shape == "st":
        import math
        pts = []
        for i in range(10):
            r = s * (.44 if i % 2 == 0 else .19)
            a = -math.pi / 2 + i * math.pi / 5
            pts.append(f"{s/2 + r*math.cos(a):.1f},{s/2 + r*math.sin(a) + s*.04:.1f}")
        g = f'<polygon points="{" ".join(pts)}" fill="{color}"/>'
    elif shape == "blank":
        g = f'<rect x="{s*.1}" y="{s*.1}" width="{s*.8}" height="{s*.8}" rx="{s*.12}" fill="none" stroke="#9aa1ad" stroke-width="2" stroke-dasharray="4 3"/>'
    else:
        g = ""
    return f'<svg viewBox="0 0 {s} {s}" width="100%" height="100%">{g}</svg>'


def puzzle_block(color, label, icon_html="", width=180, height=110, kind="normal", text_color="#ffffff"):
    """Bloque tipo ScratchJr con pestaña a la izquierda y muesca a la derecha."""
    w, h = width, height
    k = h * 0.18
    if kind == "hat":  # evento: sin pestaña izquierda, parte superior redondeada
        d = (f"M6 {h*0.28} Q6 6 {w*0.35} 6 L{w-10} 6 Q{w-4} 6 {w-4} 12 L{w-4} {h/2 - k} "
             f"Q{w+k*0.2} {h/2 - k} {w+k*0.9} {h/2} Q{w+k*0.2} {h/2 + k} {w-4} {h/2 + k} L{w-4} {h-10} Q{w-4} {h-4} {w-10} {h-4} "
             f"L12 {h-4} Q6 {h-4} 6 {h-10} Z")
    elif kind == "end":
        d = (f"M12 6 L{w-20} 6 Q{w-4} 6 {w-4} {h/2} Q{w-4} {h-4} {w-20} {h-4} L12 {h-4} Q6 {h-4} 6 {h-10} "
             f"L6 {h/2 + k} Q{6+k*0.9} {h/2 + k} {6+k*0.9} {h/2} Q{6+k*0.9} {h/2 - k} 6 {h/2 - k} L6 12 Q6 6 12 6 Z")
    else:
        d = (f"M12 6 L{w-10} 6 Q{w-4} 6 {w-4} 12 L{w-4} {h/2 - k} Q{w+k*0.2} {h/2 - k} {w+k*0.9} {h/2} "
             f"Q{w+k*0.2} {h/2 + k} {w-4} {h/2 + k} L{w-4} {h-10} Q{w-4} {h-4} {w-10} {h-4} L12 {h-4} Q6 {h-4} 6 {h-10} "
             f"L6 {h/2 + k} Q{6+k*0.9} {h/2 + k} {6+k*0.9} {h/2} Q{6+k*0.9} {h/2 - k} 6 {h/2 - k} L6 12 Q6 6 12 6 Z")
    return (f'<svg viewBox="0 0 {w + k} {h}" width="100%" height="100%"><path d="{d}" fill="{color}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>'
            f'<foreignObject x="10" y="8" width="{w-24}" height="{h-16}"><div xmlns="http://www.w3.org/1999/xhtml" '
            f'style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:{text_color};'
            f'font:700 {h*0.16}px/1.1 Bahnschrift,\'Segoe UI\',sans-serif;text-align:center">{icon_html}<span>{label}</span></div></foreignObject></svg>')


# ------------------------------------------------------------------ cuadrícula y caminos
DIRS = ["N", "E", "S", "O"]
MOVE = {"N": (0, -1), "E": (1, 0), "S": (0, 1), "O": (-1, 0)}


def simulate(start, d, prog, size, rocks):
    x, y = start
    for c in prog:
        if c == "F":
            dx, dy = MOVE[d]
            x, y = x + dx, y + dy
            if not (0 <= x < size and 0 <= y < size) or (x, y) in rocks:
                return None
        elif c == "R":
            d = DIRS[(DIRS.index(d) + 1) % 4]
        elif c == "L":
            d = DIRS[(DIRS.index(d) - 1) % 4]
    return (x, y), d


def solve(start, d, goal, size, rocks):
    q = deque([(start, d, "")])
    seen = {(start, d)}
    while q:
        p, dd, prog = q.popleft()
        if p == goal:
            return prog
        for c in "FRL":
            r = simulate(p, dd, c, size, rocks)
            if r and r not in seen:
                seen.add(r)
                q.append((r[0], r[1], prog + c))
    return None


def grid_svg(size, start, d, goal, rocks, cell=40, path=None, goal_icon="tesoro", extra=None, robot_color="#2c5bbf", coords=False):
    n = size
    pad = 22 if coords else 2
    W = n * cell + pad + 2
    out = [f'<svg viewBox="0 0 {W} {W}" width="100%" height="100%" font-family="Segoe UI, sans-serif">']
    for i in range(n):
        for j in range(n):
            out.append(f'<rect x="{pad + i*cell}" y="{pad + j*cell}" width="{cell}" height="{cell}" fill="#fff" stroke="#9aa1ad" stroke-width="1.2"/>')
    if coords:
        for i in range(n):
            out.append(f'<text x="{pad + i*cell + cell/2}" y="15" text-anchor="middle" font-size="12" fill="#6b7385">{"ABCDEFGH"[i]}</text>')
            out.append(f'<text x="10" y="{pad + i*cell + cell/2 + 4}" text-anchor="middle" font-size="12" fill="#6b7385">{i+1}</text>')
    if path:
        pts = " ".join(f"{pad + x*cell + cell/2},{pad + y*cell + cell/2}" for x, y in path)
        out.append(f'<polyline points="{pts}" fill="none" stroke="#df7619" stroke-width="{cell*0.1}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="{cell*0.18} {cell*0.14}"/>')
    for (x, y) in rocks:
        out.append(f'<image href="{_pp("piedra")}" x="{pad + x*cell + cell*0.1}" y="{pad + y*cell + cell*0.1}" width="{cell*0.8}" height="{cell*0.8}"/>')
    for (x, y, ic) in (extra or []):
        out.append(f'<text x="{pad + x*cell + cell/2}" y="{pad + y*cell + cell*0.68}" text-anchor="middle" font-size="{cell*0.55}">{ic}</text>')
    gx, gy = goal
    if goal_icon == "tesoro":
        out.append(f'<image href="{_pp("tesoro")}" x="{pad + gx*cell + cell*0.08}" y="{pad + gy*cell + cell*0.08}" width="{cell*0.84}" height="{cell*0.84}"/>')
    elif goal_icon:
        out.append(f'<text x="{pad + gx*cell + cell/2}" y="{pad + gy*cell + cell*0.7}" text-anchor="middle" font-size="{cell*0.6}">{goal_icon}</text>')
    if start is None:
        out.append("</svg>")
        return "".join(out)
    sx, sy = start
    out.append(f'<g transform="translate({pad + sx*cell + cell*0.1} {pad + sy*cell + cell*0.1}) scale({cell*0.8/60})">{robot_svg(d, 60, robot_color)[len("<svg viewBox=\"0 0 60 60\" width=\"100%\" height=\"100%\">"):-6]}</g>')
    out.append("</svg>")
    return "".join(out)


def path_cells(start, d, prog):
    x, y = start
    cells = [(x, y)]
    for c in prog:
        if c == "F":
            dx, dy = MOVE[d]
            x, y = x + dx, y + dy
            cells.append((x, y))
        elif c == "R":
            d = DIRS[(DIRS.index(d) + 1) % 4]
        elif c == "L":
            d = DIRS[(DIRS.index(d) - 1) % 4]
    return cells
