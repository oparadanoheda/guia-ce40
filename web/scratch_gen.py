# Genera los proyectos de Scratch (.sb3) de la guía: archivos con bichos y soluciones de referencia.
# Uso: python scratch_gen.py   -> materiales/scratch/*.sb3 (y copia en «Material imprimible/Scratch»)
import hashlib
import io
import json
import math
import struct
import wave
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "materiales" / "scratch"
OUT_ROOT = HERE.parent / "Material imprimible" / "Scratch"

# ------------------------------------------------------------------ recursos (dibujos y sonido propios)
SVG = {
    "robi1": '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="96" viewBox="0 0 80 96"><line x1="40" y1="4" x2="40" y2="16" stroke="#1a1d24" stroke-width="4"/><circle cx="40" cy="5" r="5" fill="#e8b000"/><rect x="10" y="16" width="60" height="46" rx="12" fill="#2c5bbf" stroke="#1a1d24" stroke-width="3"/><circle cx="28" cy="38" r="7" fill="#fff"/><circle cx="52" cy="38" r="7" fill="#fff"/><circle cx="29" cy="39" r="3" fill="#1a1d24"/><circle cx="53" cy="39" r="3" fill="#1a1d24"/><rect x="28" y="50" width="24" height="5" rx="2" fill="#fff"/><rect x="22" y="64" width="36" height="22" rx="6" fill="#2c5bbf" stroke="#1a1d24" stroke-width="3"/><rect x="24" y="86" width="10" height="8" rx="2" fill="#1a1d24"/><rect x="46" y="86" width="10" height="8" rx="2" fill="#1a1d24"/></svg>',
    "robi2": '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="96" viewBox="0 0 80 96"><line x1="40" y1="4" x2="40" y2="16" stroke="#1a1d24" stroke-width="4"/><circle cx="40" cy="5" r="5" fill="#e8b000"/><rect x="10" y="16" width="60" height="46" rx="12" fill="#2c5bbf" stroke="#1a1d24" stroke-width="3"/><circle cx="28" cy="38" r="7" fill="#fff"/><circle cx="52" cy="38" r="7" fill="#fff"/><circle cx="29" cy="39" r="3" fill="#1a1d24"/><circle cx="53" cy="39" r="3" fill="#1a1d24"/><path d="M28 50q12 9 24 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="22" y="64" width="36" height="22" rx="6" fill="#2c5bbf" stroke="#1a1d24" stroke-width="3"/><rect x="18" y="86" width="10" height="8" rx="2" fill="#1a1d24"/><rect x="52" y="86" width="10" height="8" rx="2" fill="#1a1d24"/></svg>',
    "manzana": '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="60" viewBox="0 0 56 60"><path d="M28 16c-8-6-24-4-24 16 0 16 12 26 20 26 2 0 3-1 4-1s2 1 4 1c8 0 20-10 20-26 0-20-16-22-24-16z" fill="#cf3f36" stroke="#1a1d24" stroke-width="3"/><path d="M28 16c0-6 2-10 5-13" fill="none" stroke="#6b4a2b" stroke-width="3" stroke-linecap="round"/><path d="M31 9c6-6 14-5 16-3-3 5-10 7-16 3z" fill="#2a8f4f" stroke="#1a1d24" stroke-width="2"/></svg>',
    "meteorito": '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><path d="M30 3l7 11 13-3-3 13 11 6-11 7 3 13-13-3-7 11-7-11-13 3 3-13-11-7 11-6-3-13 13 3z" fill="#7a4fc0" stroke="#1a1d24" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="26" r="4" fill="#fff"/><circle cx="36" cy="26" r="4" fill="#fff"/><path d="M22 38q8-6 16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
    "lapiz": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="#e07a1f" stroke="#1a1d24" stroke-width="2"/></svg>',
    "fondo1": '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><rect width="480" height="360" fill="#eaf3fb"/><rect y="300" width="480" height="60" fill="#cfe6c8"/></svg>',
    "fondo2": '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><rect width="480" height="360" fill="#1d2440"/><circle cx="60" cy="50" r="2" fill="#fff"/><circle cx="200" cy="90" r="2" fill="#fff"/><circle cx="330" cy="40" r="2" fill="#fff"/><circle cx="420" cy="120" r="2" fill="#fff"/><circle cx="120" cy="160" r="2" fill="#fff"/><rect y="300" width="480" height="60" fill="#3b3f5c"/></svg>',
    "blanco": '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><rect width="480" height="360" fill="#ffffff"/></svg>',
}
CENTER = {"robi1": (40, 50), "robi2": (40, 50), "manzana": (28, 32), "meteorito": (30, 30), "lapiz": (12, 12),
          "fondo1": (240, 180), "fondo2": (240, 180), "blanco": (240, 180)}


def beep_wav(freq=880, ms=180, rate=22050):
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        n = int(rate * ms / 1000)
        frames = b"".join(struct.pack("<h", int(12000 * math.sin(2 * math.pi * freq * i / rate) * (1 - i / n))) for i in range(n))
        w.writeframes(frames)
    return buf.getvalue(), n, rate


def md5(b):
    return hashlib.md5(b).hexdigest()


# ------------------------------------------------------------------ constructor de bloques
class Sprite:
    def __init__(self, name, costumes, x=0, y=0, size=100, stage=False, sound=False, visible=True):
        self.name, self.stage = name, stage
        self.costumes, self.x, self.y, self.size, self.visible = costumes, x, y, size, visible
        self.sound = sound
        self.blocks = {}
        self.n = 0
        self.variables = {}
        self.broadcasts = {}
        self.scripts = 0

    def _id(self):
        self.n += 1
        return f"{self.name[:3]}{self.n}"

    # un bloque: devuelve su id
    def b(self, opcode, inputs=None, fields=None, shadow=False, mutation=None):
        bid = self._id()
        self.blocks[bid] = {"opcode": opcode, "next": None, "parent": None, "inputs": inputs or {}, "fields": fields or {},
                            "shadow": shadow, "topLevel": False}
        if mutation:
            self.blocks[bid]["mutation"] = mutation
        return bid

    def link(self, ids):
        for a, c in zip(ids, ids[1:]):
            self.blocks[a]["next"] = c
            self.blocks[c]["parent"] = a
        return ids[0]

    def script(self, ids, x=None, y=None):
        first = self.link(ids)
        self.blocks[first]["topLevel"] = True
        self.blocks[first]["x"] = 40 if x is None else x
        self.blocks[first]["y"] = 40 + self.scripts * 170 if y is None else y
        self.scripts += 1
        return first

    def parent_inputs(self, bid):
        for name, val in self.blocks[bid]["inputs"].items():
            for v in val[1:]:
                if isinstance(v, str) and v in self.blocks:
                    self.blocks[v]["parent"] = bid

    def finish(self):
        for bid in list(self.blocks):
            self.parent_inputs(bid)


def num(v):
    return [1, [4, str(v)]]


def txt(v):
    return [1, [10, str(v)]]


class P:
    """Proyecto con escenario y objetos."""

    def __init__(self, backdrops=("fondo1",)):
        self.stage = Sprite("Stage", list(backdrops), stage=True)
        self.sprites = []
        self.extensions = []
        self.monitors = []
        self.vars = {}

    def sprite(self, *a, **k):
        s = Sprite(*a, **k)
        self.sprites.append(s)
        return s

    def var(self, name, value=0, show=True):
        vid = f"var_{name}"
        self.stage.variables[vid] = [name, value]
        self.vars[name] = vid
        if show:
            self.monitors.append({"id": vid, "mode": "default", "opcode": "data_variable", "params": {"VARIABLE": name},
                                  "spriteName": None, "value": value, "width": 0, "height": 0, "x": 5, "y": 5 + 27 * len(self.monitors),
                                  "visible": True, "sliderMin": 0, "sliderMax": 100, "isDiscrete": True})
        return vid

    def msg(self, name):
        bid = f"msg_{name}"
        self.stage.broadcasts[bid] = name
        return bid

    # --- atajos de bloques (todos reciben el objeto s) ---
    def vfield(self, name):
        return {"VARIABLE": [name, self.vars[name]]}

    def vrep(self, s, name):
        return s.b("data_variable", fields=self.vfield(name))

    def set(self, s, name, value):
        return s.b("data_setvariableto", inputs={"VALUE": txt(value) if not isinstance(value, list) else value}, fields=self.vfield(name))

    def change(self, s, name, by):
        return s.b("data_changevariableby", inputs={"VALUE": num(by)}, fields=self.vfield(name))

    def save(self, path):
        assets = {}
        snd = beep_wav()

        def target(sp, layer):
            costumes = []
            for c in sp.costumes:
                data = SVG[c].encode("utf-8")
                h = md5(data)
                assets[h + ".svg"] = data
                cx, cy = CENTER[c]
                costumes.append({"name": c, "dataFormat": "svg", "assetId": h, "md5ext": h + ".svg", "rotationCenterX": cx, "rotationCenterY": cy})
            sounds = []
            if sp.sound:
                data, n, rate = snd
                h = md5(data)
                assets[h + ".wav"] = data
                sounds.append({"name": "pop", "assetId": h, "dataFormat": "wav", "format": "", "rate": rate, "sampleCount": n, "md5ext": h + ".wav"})
            sp.finish()
            t = {"isStage": sp.stage, "name": sp.name, "variables": sp.variables, "lists": {}, "broadcasts": sp.broadcasts,
                 "blocks": sp.blocks, "comments": {}, "currentCostume": 0, "costumes": costumes, "sounds": sounds,
                 "volume": 100, "layerOrder": layer}
            if sp.stage:
                t.update({"tempo": 60, "videoTransparency": 50, "videoState": "on", "textToSpeechLanguage": None})
            else:
                t.update({"visible": sp.visible, "x": sp.x, "y": sp.y, "size": sp.size, "direction": 90, "draggable": False,
                          "rotationStyle": "don't rotate"})
            return t

        project = {"targets": [target(self.stage, 0)] + [target(s, i + 1) for i, s in enumerate(self.sprites)],
                   "monitors": self.monitors, "extensions": self.extensions,
                   "meta": {"semver": "3.0.0", "vm": "0.2.0", "agent": "Guia CE40"}}
        path.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
            z.writestr("project.json", json.dumps(project, ensure_ascii=False))
            for name, data in assets.items():
                z.writestr(name, data)
        print("ok", path.name)


# ------------------------------------------------------------------ piezas reutilizables
def flag(s):
    return s.b("event_whenflagclicked")


def key(s, k):
    return s.b("event_whenkeypressed", fields={"KEY_OPTION": [k, None]})


def say(s, text, secs=None):
    val = text if isinstance(text, list) else txt(text)
    if secs is None:
        return s.b("looks_say", inputs={"MESSAGE": val})
    return s.b("looks_sayforsecs", inputs={"MESSAGE": val, "SECS": num(secs)})


def wait(s, secs):
    return s.b("control_wait", inputs={"DURATION": num(secs)})


def repeat(s, times, body):
    first = s.link(body)
    return s.b("control_repeat", inputs={"TIMES": num(times), "SUBSTACK": [2, first]})


def forever(s, body):
    return s.b("control_forever", inputs={"SUBSTACK": [2, s.link(body)]})


def if_(s, cond, body):
    return s.b("control_if", inputs={"CONDITION": [2, cond], "SUBSTACK": [2, s.link(body)]})


def if_else(s, cond, body, body2):
    return s.b("control_if_else", inputs={"CONDITION": [2, cond], "SUBSTACK": [2, s.link(body)], "SUBSTACK2": [2, s.link(body2)]})


def repeat_until(s, cond, body):
    return s.b("control_repeat_until", inputs={"CONDITION": [2, cond], "SUBSTACK": [2, s.link(body)]})


def stop_all(s):
    return s.b("control_stop", fields={"STOP_OPTION": ["all", None]}, mutation={"tagName": "mutation", "children": [], "hasnext": "false"})


def rep_input(rid, default="0", kind=10):
    return [3, rid, [kind, default]]


def eq(s, a, b):
    return s.b("operator_equals", inputs={"OPERAND1": a, "OPERAND2": b})


def gt(s, a, b):
    return s.b("operator_gt", inputs={"OPERAND1": a, "OPERAND2": b})


def lt(s, a, b):
    return s.b("operator_lt", inputs={"OPERAND1": a, "OPERAND2": b})


def rnd(s, a, b):
    return s.b("operator_random", inputs={"FROM": num(a), "TO": num(b)})


def join(s, a, b):
    return s.b("operator_join", inputs={"STRING1": a, "STRING2": b})


def touching(s, other):
    menu = s.b("sensing_touchingobjectmenu", fields={"TOUCHINGOBJECTMENU": [other, None]}, shadow=True)
    return s.b("sensing_touchingobject", inputs={"TOUCHINGOBJECTMENU": [1, menu]})


def goto_random(s):
    menu = s.b("motion_goto_menu", fields={"TO": ["_random_", None]}, shadow=True)
    return s.b("motion_goto", inputs={"TO": [1, menu]})


def play(s):
    menu = s.b("sound_sounds_menu", fields={"SOUND_MENU": ["pop", None]}, shadow=True)
    return s.b("sound_play", inputs={"SOUND_MENU": [1, menu]})


def backdrop(s, name):
    menu = s.b("looks_backdrops", fields={"BACKDROP": [name, None]}, shadow=True)
    return s.b("looks_switchbackdropto", inputs={"BACKDROP": [1, menu]})


def arrows(s, step=10):
    for k, op, d in (("right arrow", "motion_changexby", step), ("left arrow", "motion_changexby", -step),
                     ("up arrow", "motion_changeyby", step), ("down arrow", "motion_changeyby", -step)):
        field = "DX" if op.endswith("xby") else "DY"
        s.script([key(s, k), s.b(op, inputs={field: num(d)})])


# ------------------------------------------------------------------ proyectos
def p4_s1_bichos():
    """4º S1: tres bichos (mover -10 a la derecha, sonido suelto, repetir 3 en vez de por siempre)."""
    p = P()
    r = p.sprite("Robi", ["robi1", "robi2"], sound=True)
    r.script([key(r, "right arrow"), r.b("motion_movesteps", inputs={"STEPS": num(-10)})])          # bicho 1
    r.script([key(r, "left arrow"), r.b("motion_movesteps", inputs={"STEPS": num(-10)})])
    r.script([flag(r), say(r, "¡Hola! Muéveme con las flechas", 2)])
    r.script([r.b("event_whenthisspriteclicked"), say(r, "¡Me has tocado!", 1)])
    r.script([play(r)], x=420, y=40)                                                                 # bicho 2: suelto
    r.script([flag(r), repeat(r, 3, [r.b("looks_nextcostume"), wait(r, 0.3)])])                   # bicho 3
    p.save(OUT / "4-S1-arregla-el-juego-3-bichos.sb3")


def p_clics_bicho_variable():
    """Torneo 1: la variable no vuelve a 0."""
    p = P()
    p.var("puntos")
    r = p.sprite("Robi", ["robi1", "robi2"], sound=True)
    r.script([flag(r), r.b("motion_gotoxy", inputs={"X": num(0), "Y": num(0)}), say(r, "¡Hazme clic!", 1)])  # falta dar a puntos 0
    r.script([r.b("event_whenthisspriteclicked"), p.change(r, "puntos", 1), play(r), goto_random(r)])
    r.script([flag(r), forever(r, [if_(r, eq(r, rep_input(p.vrep(r, "puntos")), num(10)), [say(r, "¡Has ganado!", 2), stop_all(r)])])])
    p.save(OUT / "4-S7-torneo-bicho-1-la-variable.sb3")


def p_tablas(bug=None):
    """Juego de las tablas (4º S6). bug='rama' cambia las ramas del si… si no."""
    p = P()
    for v in ("a", "b", "puntos"):
        p.var(v, show=(v == "puntos"))
    r = p.sprite("Robi", ["robi1", "robi2"], sound=True)
    ask = r.b("sensing_askandwait", inputs={"QUESTION": [3, join(r, rep_input(p.vrep(r, "a")), [3, join(r, txt(" x "), rep_input(p.vrep(r, "b"))), [10, ""]]), [10, ""]]})
    prod = r.b("operator_multiply", inputs={"NUM1": [3, p.vrep(r, "a"), [4, ""]], "NUM2": [3, p.vrep(r, "b"), [4, ""]]})
    cond = eq(r, [3, r.b("sensing_answer"), [10, ""]], [3, prod, [10, ""]])
    prod2 = r.b("operator_multiply", inputs={"NUM1": [3, p.vrep(r, "a"), [4, ""]], "NUM2": [3, p.vrep(r, "b"), [4, ""]]})
    good = [p.change(r, "puntos", 1), play(r), say(r, "¡Bien!", 1)]
    bad = [say(r, [3, join(r, txt("Era "), [3, prod2, [10, ""]]), [10, ""]], 2)]
    if bug == "rama":
        good, bad = bad, good
    body = [p.set(r, "a", [3, rnd(r, 1, 10), [10, ""]]), p.set(r, "b", [3, rnd(r, 1, 10), [10, ""]]), ask, if_else(r, cond, good, bad)]
    r.script([flag(r), p.set(r, "puntos", 0), repeat(r, 10, body),
              say(r, [3, join(r, txt("Puntos: "), rep_input(p.vrep(r, "puntos"))), [10, ""]])])
    name = "4-S7-torneo-bicho-2-la-condicion.sb3" if bug == "rama" else "4-S6-juego-de-las-tablas-solucion.sb3"
    p.save(OUT / name)


def p_poligono_bicho():
    """Torneo 3: número mal en el repetir (cuadrado que no se cierra)."""
    p = P(("blanco",))
    p.extensions = ["pen"]
    s = p.sprite("Lapiz", ["lapiz"])
    s.script([flag(s), s.b("pen_clear"), s.b("motion_gotoxy", inputs={"X": num(-50), "Y": num(-50)}),
              s.b("motion_pointindirection", inputs={"DIRECTION": [1, [8, "90"]]}), s.b("pen_penDown"),
              repeat(s, 3, [s.b("motion_movesteps", inputs={"STEPS": num(100)}), s.b("motion_turnleft", inputs={"DEGREES": num(90)}), wait(s, 0.3)]),
              s.b("pen_penUp"), say(s, "¡Mira mi cuadrado!", 2)])
    p.save(OUT / "4-S7-torneo-bicho-3-el-repetir.sb3")


def p5_s1_bichos():
    """5º S1 opción B: variable sin poner a 0, condición al revés y bucle con el número mal."""
    p = P()
    p.var("puntos")
    r = p.sprite("Robi", ["robi1", "robi2"], sound=True)
    r.script([flag(r), r.b("motion_gotoxy", inputs={"X": num(0), "Y": num(0)})])                               # bicho 1: sin puntos = 0
    r.script([r.b("event_whenthisspriteclicked"), p.change(r, "puntos", 1), play(r), goto_random(r)])
    r.script([flag(r), forever(r, [if_(r, lt(r, rep_input(p.vrep(r, "puntos")), num(10)), [say(r, "¡Has ganado!", None)])])])  # bicho 2
    r.script([flag(r), repeat(r, 2, [r.b("looks_nextcostume"), wait(r, 0.4)])])                               # bicho 3
    p.save(OUT / "5-S1-arregla-el-juego-3-bichos.sb3")


def p3_s14_atrapar():
    """3º S14: juego de atrapar (solución de referencia)."""
    p = P()
    p.var("puntos")
    r = p.sprite("Robi", ["robi1", "robi2"], x=0, y=-100, size=80)
    arrows(r, 10)
    m = p.sprite("Manzana", ["manzana"], x=120, y=80, sound=True)
    m.script([flag(m), p.set(m, "puntos", 0),
              forever(m, [if_(m, touching(m, "Robi"), [p.change(m, "puntos", 1), play(m), goto_random(m)])])])
    p.save(OUT / "3-S14-juego-de-atrapar-solucion.sb3")


def p4_s5_adivina():
    """4º S5: adivina el número con pistas y repetir hasta acertar (solución)."""
    p = P()
    p.var("secreto", show=False)
    r = p.sprite("Robi", ["robi1", "robi2"], sound=True)
    ans = lambda: [3, r.b("sensing_answer"), [10, ""]]
    sec = lambda: [3, p.vrep(r, "secreto"), [10, ""]]
    inner = if_else(r, gt(r, ans(), sec()), [say(r, "Es más pequeño", 1)], [say(r, "Es más grande", 1)])
    body = [r.b("sensing_askandwait", inputs={"QUESTION": txt("¿Qué número del 1 al 20 he pensado?")}),
            if_else(r, eq(r, ans(), sec()), [play(r), say(r, "¡Acertaste!", 2)], [inner])]
    r.script([flag(r), p.set(r, "secreto", [3, rnd(r, 1, 20), [10, ""]]),
              repeat_until(r, eq(r, ans(), sec()), body)])
    p.save(OUT / "4-S5-adivina-el-numero-solucion.sb3")


def p4_videojuego():
    """4º S10 a S13: videojuego completo de referencia (flechas, premio, enemigo, puntos, vidas, final y nivel 2)."""
    p = P(("fondo1", "fondo2"))
    p.var("puntos")
    p.var("vidas", 3)
    nivel2 = p.msg("nivel 2")
    st = p.stage
    st.script([flag(st), backdrop(st, "fondo1")])
    st.script([st.b("event_whenbroadcastreceived", fields={"BROADCAST_OPTION": ["nivel 2", nivel2]}), backdrop(st, "fondo2")])
    r = p.sprite("Robi", ["robi1", "robi2"], size=70)
    arrows(r, 10)
    r.script([flag(r), r.b("motion_gotoxy", inputs={"X": num(0), "Y": num(-100)}), p.set(r, "puntos", 0), p.set(r, "vidas", 3),
              forever(r, [r.b("motion_ifonedgebounce"),
                          if_(r, eq(r, rep_input(p.vrep(r, "vidas")), num(0)), [say(r, "Has perdido", 2), stop_all(r)]),
                          if_(r, eq(r, rep_input(p.vrep(r, "puntos")), num(10)), [say(r, "¡Has ganado!", 2), stop_all(r)])])])
    m = p.sprite("Manzana", ["manzana"], x=150, y=100, sound=True)
    m.script([flag(m), forever(m, [if_(m, touching(m, "Robi"), [p.change(m, "puntos", 1), play(m), goto_random(m),
                                                                 if_(m, eq(m, rep_input(p.vrep(m, "puntos")), num(5)),
                                                                     [m.b("event_broadcast", inputs={"BROADCAST_INPUT": [1, [11, "nivel 2", nivel2]]})])])])])
    e = p.sprite("Meteorito", ["meteorito"], x=-150, y=80)
    p.var("velocidad", 5, show=False)
    e.script([flag(e), p.set(e, "velocidad", 5), e.b("motion_pointindirection", inputs={"DIRECTION": [1, [8, "135"]]}),
              forever(e, [e.b("motion_movesteps", inputs={"STEPS": rep_input(p.vrep(e, "velocidad"), "5", 4)}), e.b("motion_ifonedgebounce"),
                          if_(e, touching(e, "Robi"), [p.change(e, "vidas", -1), say(e, "¡Ay!", None), goto_random(e), wait(e, 1), say(e, "", None)])])])
    e.script([e.b("event_whenbroadcastreceived", fields={"BROADCAST_OPTION": ["nivel 2", nivel2]}), p.set(e, "velocidad", 10)])
    p.save(OUT / "4-S13-videojuego-completo-solucion.sb3")


PROJECTS = [p4_s1_bichos, p_clics_bicho_variable, lambda: p_tablas("rama"), p_poligono_bicho, lambda: p_tablas(),
            p5_s1_bichos, p3_s14_atrapar, p4_s5_adivina, p4_videojuego]

if __name__ == "__main__":
    for f in PROJECTS:
        f()
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob("*.sb3"):
        (OUT_ROOT / f.name).write_bytes(f.read_bytes())
