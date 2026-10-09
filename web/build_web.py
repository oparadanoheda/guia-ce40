# Genera la guía didáctica web a partir de los archivos .md de la carpeta superior.
# Uso: python build_web.py  ->  crea programacion_CE40.html en esta carpeta.
import html
import re
import sys
from pathlib import Path

import markdown
from markdown.extensions.toc import slugify_unicode

sys.path.insert(0, str(Path(__file__).resolve().parent))
from datos_etapa import TOOLS, TOOL_NOTES, STRANDS, PRODUCTS, LEVEL_NAMES  # noqa: E402
from recursos_oficiales import LIBRARY, SA_LINKS, SESSION_RULES  # noqa: E402
from catalogo import PROYECTABLES, EXTERNAS  # noqa: E402
import materiales as MAT  # noqa: E402
import makecode_gen as MK  # noqa: E402
from vocabulario import VOCAB  # noqa: E402
from videos import VIDEOS, BY_SESSION  # noqa: E402
from guias_proyectables import GUIAS  # noqa: E402
from mision_clase import MISION  # noqa: E402
from pictos_mision import pictos_paso  # noqa: E402
import json  # noqa: E402
MAT_INDEX = {code: (title, courses, MAT.slug(code, title)) for code, title, courses, _ in MAT.MATERIALS}
PJ_INDEX = {p[0]: p for p in PROYECTABLES}

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).resolve().parent / "programacion_CE40.html"
VERSION, VERSION_FECHA = "1.1", "octubre de 2026"
DESCRIPCION = ("Guía didáctica de Código Escuela 4.0 para 1º a 6º de Primaria, integrada en Matemáticas: 128 sesiones con propuestas, "
               "herramientas para la pizarra digital, vídeos de conceptos, material imprimible y proyectos de Scratch y MakeCode.")
FAVICON = ("data:image/svg+xml," + "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='2' y='2' width='13' height='13' rx='3' fill='%23c8382f'/%3E"
           "%3Crect x='17' y='2' width='13' height='13' rx='3' fill='%23257f46'/%3E%3Crect x='2' y='17' width='13' height='13' rx='3' fill='%232c5bbf'/%3E"
           "%3Crect x='17' y='17' width='13' height='13' rx='3' fill='%23ad5b12'/%3E%3C/svg%3E")
E = html.escape

COURSES = [
    ("c1", "1_primero.md", "Primer ciclo"), ("c2", "2_segundo.md", "Primer ciclo"),
    ("c3", "3_tercero.md", "Segundo ciclo"), ("c4", "4_cuarto.md", "Segundo ciclo"),
    ("c5", "5_quinto.md", "Tercer ciclo"), ("c6", "6_sexto.md", "Tercer ciclo"),
]
COURSE_TOOLS = {
    "c1": "Desenchufado · Tale-Bot · True True · bloques de papel",
    "c2": "Desenchufado · True True · ScratchJr al final",
    "c3": "True True · Scratch · Makey Makey",
    "c4": "Scratch · Makey Makey",
    "c5": "Scratch · micro:bit · Nezha · Tinkercad · IA",
    "c6": "micro:bit · Nezha · Tinkercad · IA · proyecto",
}
FILE_LINKS = {
    "00_General_CE40_26-27.md": ("metodo", "El método"),
    "1_primero.md": ("c1", "1º"), "2_segundo.md": ("c2", "2º"), "3_tercero.md": ("c3", "3º"),
    "4_cuarto.md": ("c4", "4º"), "5_quinto.md": ("c5", "5º"), "6_sexto.md": ("c6", "6º"),
    "07_Guias_rapidas_herramientas.md": ("herramientas", "Herramientas paso a paso"), "07": ("herramientas", "Herramientas paso a paso"),
    "08_Plantillas_y_material.md": ("material", "Material fotocopiable"), "08": ("material", "Material fotocopiable"),
}
# anclas de las guías: «g-» + título sin número (no dependen de la numeración de 07)
TOOL_GUIDES = [
    ("Tale-Bot", "g-tale-bot", "Tale-Bot"), ("True True", "g-true-true", "True True"), ("ScratchJr", "g-scratchjr", "ScratchJr"),
    ("Scratch ", "g-scratch-3", "Scratch"), ("Makey Makey", "g-makey-makey", "Makey Makey"),
    ("micro:bit", "g-microbit-y-makecode", "micro:bit"), ("Nezha", "g-nezha", "Nezha"),
    ("Tinkercad", "g-tinkercad", "Tinkercad"), ("Teachable Machine", "g-teachable-machine", "Teachable Machine"),
    (" QR", "g-códigos-qr", "códigos QR"),
]
TAG_NAMES = {"PC": "Pensamiento computacional", "ROB": "Robótica", "IA": "IA y datos", "SEG": "Uso responsable y seguridad", "RA": "RA, QR y 3D"}

ICON = {
    "target": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    "prep": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8.5 12l2 2 4-4M8.5 17h7"/></svg>',
    "shield": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    "ruler": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16L16 3l5 5L8 21z"/><path d="M7 12l2 2M10 9l2 2M13 6l2 2"/></svg>',
    "link": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>',
    "up": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    "down": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    "flag": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    "note": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>',
    "left": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    "right": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    "menu": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    "search": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>',
    "ext": '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg>',
}

PLAY_ICON = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/></svg>'
# La bandera verde de Scratch («al hacer clic en 🏴» en los .md) se dibuja: la guía no usa emojis.
FLAG = '<svg class="gflag" viewBox="0 0 16 16" role="img" aria-label="bandera verde"><path d="M3.2 1.6v12.8" stroke="#3d8a37" stroke-width="1.7" stroke-linecap="round"/><path d="M4 2.6c2.1-1.2 3.9.8 6 0 1-.4 1.9-.7 2.8-.5v6.4c-.9-.2-1.8.1-2.8.5-2.1.8-3.9-1.2-6 0z" fill="#4cbf56" stroke="#3d8a37" stroke-width=".9" stroke-linejoin="round"/></svg>'
PJ_ICON = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/></svg>'
RUBRIC = "rubrica"

# ---------------------------------------------------------------- markdown


def md(text, prefix="x-"):
    def slug(value, sep):
        return prefix + slugify_unicode(value, sep)
    h = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists", "toc"],
                          extension_configs={"toc": {"slugify": slug}})
    return post(h)


def links(h):
    def pj(m):
        ref, label = m.group(1), m.group(2)
        tool = ref.split(".")[0]
        return f'<a class="plink" href="#p-{ref}">{PJ_ICON}{label}</a>'
    def mt(m):
        code, label = m.group(1), m.group(2)
        if code not in MAT_INDEX:
            return label
        return f'<a class="mlink" href="materiales/{MAT_INDEX[code][2]}.pdf" target="_blank" rel="noopener"><b>{code}</b>{label}</a>'
    h = re.sub(r"\[\[P:([\w.]+)\|([^\]]+)\]\]", pj, h)
    h = re.sub(r"\[\[M:(M\d\d)\|([^\]]+)\]\]", mt, h)
    h = re.sub(r"\[\[S:([\w.-]+\.sb3)\|([^\]]+)\]\]",
               lambda m: f'<a class="mlink" href="materiales/scratch/{m.group(1)}" download><b>SB3</b>{m.group(2)}</a>', h)
    h = re.sub(r"\[\[S:([\w.-]+\.mkcd)\|([^\]]+)\]\]",
               lambda m: f'<a class="mlink" href="materiales/makecode/{m.group(1)}" download><b>MKCD</b>{m.group(2)}</a>', h)
    return h


def post(h):
    h = links(h)
    def rep(m):
        name = m.group(1)
        if name in FILE_LINKS:
            t, label = FILE_LINKS[name]
            return f'<a class="xref" href="#{t}">{label}</a>'
        return m.group(0)
    h = re.sub(r"<code>([^<]+)</code>", rep, h)
    h = re.sub(r"<code>(PC|ROB|IA|SEG|RA)</code>", lambda m: tag(m.group(1)), h)
    for name, url in sorted(SA_LINKS.items(), key=lambda x: -len(x[0])):
        h = h.replace(f"<em>{name}</em>", f'<a class="sa" href="{url}" target="_blank" rel="noopener"><em>{name}</em></a>')
    h = re.sub(r'<a href="(https?://[^"]+)">', r'<a href="\1" target="_blank" rel="noopener">', h)
    h = h.replace("<table>", '<div class="tw"><table>').replace("</table>", "</table></div>")
    return h


def cap(text):
    m = re.search(r"[^\W\d_]", text or "")
    return text if not m else text[:m.start()] + text[m.start()].upper() + text[m.start() + 1:]


def tag(t):
    return f'<span class="tag t-{t.lower()}" title="{TAG_NAMES[t]}">{t}</span>'


def inline(text):
    h = md(text)
    if h.startswith("<p>") and h.endswith("</p>") and h.count("<p>") == 1:
        h = h[3:-4]
    return h

# ---------------------------------------------------------------- parsing


META = ("Para proyectar", "Material listo", "Archivo de Scratch", "Archivo de MakeCode", "Qué aprenden", "Prepara antes", "Minuto de uso responsable", "Minuto SEG", "Frase clave", "Si va rápido", "Si cuesta",
        "Opción más sencilla", "Mates", "Producto", "Autoevaluación", "Pasos", "Opción ", "Cierre",
        "Para ti", "Aviso", "Sin caras", "Si hay", "Si coincide", "Si el grupo", "Si algún", "Solo sonidos",
        "Minuto")


def split_items(block):
    items, cur = [], None
    for line in block.split("\n"):
        if line.startswith("- "):
            if cur is not None:
                items.append(cur)
            cur = [line[2:]]
        elif cur is not None:
            cur.append(line[2:] if line.startswith("  ") else line)
    if cur is not None:
        items.append(cur)
    out = []
    for it in items:
        first, rest = it[0], "\n".join(it[1:])
        m = re.match(r"\*\*(.+?)\*\*\s*(.*)", first)
        if m:
            label = m.group(1).strip().rstrip(":")
            body = m.group(2).lstrip(":").strip()
            out.append((label, (body + ("\n" + rest if rest.strip() else "")).strip()))
        else:
            out.append((None, "- " + "\n  ".join(it)))
    return out


def parse_session(chunk):
    header, _, body = chunk.partition("\n")
    m = re.match(r"S(\d+) · (.*)", header.strip())
    num, rest = int(m.group(1)), m.group(2)
    tags = re.findall(r"`(PC|ROB|IA|SEG|RA)`", rest)
    title = re.sub(r"\s*`[^`]+`", "", rest).strip()
    body = re.sub(r"\n-{3,}\s*$", "", body.strip())
    s = {"num": num, "title": title, "tags": tags, "raw": title + "\n" + body, "intro": [], "sections": [],
         "notes": [], "hard": []}
    cur = None

    def new_sec(kind, label, name, first):
        nonlocal cur
        cur = {"kind": kind, "label": label, "name": name, "md": [first] if first else []}
        s["sections"].append(cur)

    def route(label, text):
        L = label
        if L.startswith("Qué aprenden"):
            s["obj"] = text
        elif L.startswith("Prepara antes"):
            s["prep"] = text
        elif L.startswith("Minuto de uso responsable") or L.startswith("Minuto SEG"):
            s["seg"] = text
            extra = L[len("Minuto de uso responsable" if L.startswith("Minuto de uso") else "Minuto SEG"):].strip()
            if extra:
                s["seg_extra"] = extra.strip("() ")
        elif L.startswith("Frase clave"):
            s["key"] = text.strip().strip('"“”«»')
        elif L.startswith("Si va rápido"):
            s["fast"] = text
        elif L.startswith("Si cuesta") or L.startswith("Opción más sencilla"):
            s["hard"].append(text)
        elif L.startswith("Mates"):
            s["math"] = text
        elif L.startswith("Para proyectar"):
            s["proj"] = text
        elif L.startswith("Material listo"):
            s["mat"] = text
        elif L.startswith("Archivo de Scratch"):
            s["sb3"] = text
        elif L.startswith("Archivo de MakeCode"):
            s["mkcd"] = text
        elif L.startswith("Producto"):
            s["product"] = (L, text)
        elif L.startswith("Autoevaluación"):
            s["self"] = ("Autoevaluación " + text).strip()
        elif L.startswith("Pasos"):
            new_sec("dev", "Desarrollo", L[5:].strip(" ()").capitalize(), text)
        elif re.match(r"Opción [A-D]", L):
            new_sec("opt", L[:8], L[8:].strip(" ·()"), text)
        else:
            s["notes"].append((L, text))

    for b in re.split(r"\n\s*\n", body):
        bs = b.strip()
        if not bs or bs == "---":
            continue
        if bs.startswith("- "):
            items = split_items(bs)
            if any(lbl and lbl.startswith(META) for lbl, _ in items):
                for lbl, txt in items:
                    if lbl:
                        route(lbl, txt)
                    else:
                        (cur["md"] if cur else s["intro"]).append(txt)
                continue
            (cur["md"] if cur else s["intro"]).append(bs)
        elif bs.startswith("**Pistas y soluciones"):
            s["sol"] = re.sub(r"^\*\*Pistas y soluciones[^*]*\*\*:?\s*", "", bs)
            cur = None
        elif bs.startswith("**Opción más sencilla"):
            s["hard"].append(re.sub(r"^\*\*Opción más sencilla:?\*\*:?\s*", "", bs))
        elif bs.startswith("**Opción"):
            m = re.match(r"\*\*(Opción [A-D])\s*(?:·\s*)?(.*?):?\*\*:?\s*(.*)", bs, re.S)
            name = m.group(2).strip().replace("*", "")
            if name.startswith("(") and name.endswith(")"):
                name = name[1:-1]
            new_sec("opt", m.group(1), name[:1].upper() + name[1:], m.group(3).strip())
        elif bs.startswith("**Pasos"):
            m = re.match(r"\*\*Pasos\s*([^*]*?):?\*\*:?\s*(.*)", bs, re.S)
            name = m.group(1).strip().strip("()")
            new_sec("dev", "Desarrollo", name[:1].upper() + name[1:], m.group(2).strip())
        elif (bs.startswith("Si ") or bs.startswith("**Si ")) and cur is not None:
            s["notes"].append(("", bs))
        else:
            (cur["md"] if cur else s["intro"]).append(bs)
    return s


def parse_term(title, body):
    parts = re.split(r"^### ", body, flags=re.M)
    pre = re.sub(r"^-{3,}\s*$", "", parts[0], flags=re.M).strip()
    t = {"sessions": [parse_session(p) for p in parts[1:]], "contenidos": "", "pre": ""}
    if title.startswith("Sesiones opcionales"):
        t.update(label="Sesiones opcionales", sub=title.split("(", 1)[1].rstrip(")") if "(" in title else "", optional=True)
    else:
        m = re.match(r"(PRIMER|SEGUNDO|TERCER) TRIMESTRE\s*(?:·\s*(.*)|\((.*)\))?", title)
        t["label"] = {"PRIMER": "Primer trimestre", "SEGUNDO": "Segundo trimestre", "TERCER": "Tercer trimestre"}[m.group(1)]
        t["sub"] = (m.group(2) or "").strip()
        t["dates"] = (m.group(3) or "").strip()
        t["optional"] = False
    cm = re.search(r"\*\*Contenidos oficiales[^*]*\*\*\s*(.*?)(?:\n\s*\n|$)", pre, re.S)
    if cm:
        t["contenidos"] = cm.group(1).strip()
        pre = pre.replace(cm.group(0), "").strip()
    t["pre"] = pre
    return t


def parse_course(cid, fname, cycle):
    text = (ROOT / fname).read_text(encoding="utf-8")
    parts = re.split(r"^## ", text, flags=re.M)
    head = parts[0]
    h1 = head.split("\n", 1)[0][2:].strip()
    m = re.match(r"(\dº) de Primaria · [\"“«](.+?)[\"”»]", h1)
    c = {"id": cid, "num": m.group(1), "name": m.group(2), "cycle": cycle, "facts": [], "keys": [],
         "intro": [], "terms": [], "closing": []}
    for line in head.split("\n")[1:]:
        line = line.strip()
        if not line.startswith("**"):
            if line and c["keys"]:
                c["keys"][-1] = (c["keys"][-1][0], c["keys"][-1][1] + " " + line)
            continue
        if line.startswith("**Frecuencia"):
            # «**Frecuencia:** … · **Núcleo:** …»: se parte solo por los « · » que van antes de una etiqueta en negrita
            parts_ = re.split(r"\s+·\s+(?=\*\*[^*]+:\*\*)", line)
            c["facts"] = [(m.group(1).strip(), m.group(2).strip()) for m in (re.match(r"\*\*(.+?):\*\*\s*(.*)", x) for x in parts_) if m]
        else:
            mm = re.match(r"\*\*(.+?):\*\*\s*(.*)", line)
            if mm:
                c["keys"].append((mm.group(1), mm.group(2)))
    seen = False
    for p in parts[1:]:
        title, _, body = p.partition("\n")
        title = title.strip()
        body = re.sub(r"^-{3,}\s*$", "", body, flags=re.M).strip()
        if "TRIMESTRE" in title or title.startswith("Sesiones opcionales"):
            seen = True
            c["terms"].append(parse_term(title, body))
        elif not seen:
            c["intro"].append((title, body))
        else:
            c["closing"].append((title, body))
    n = 0
    for t in c["terms"]:
        for s in t["sessions"]:
            s["id"] = f"{cid}-s{s['num']}"
            s["term"] = t
            n += 1
    c["count"] = n
    return c

# ---------------------------------------------------------------- render: session


def structure_bar(quincenal):
    parts = ([("Tarjeta", 3), ("Misión", 7), ("Práctica", 25), ("Compartir", 5), ("Guardar", 5)] if quincenal else
             [("Arranque", 5), ("Misión", 7), ("Práctica", 23), ("Compartir", 5), ("Cierre", 5)])
    segs = "".join(f'<span class="sb-seg sb-{i}" style="flex:{m}"><b>{E(n)}</b><small>{m} min</small></span>' for i, (n, m) in enumerate(parts))
    return f'<div class="sbar" role="img" aria-label="Estructura de la sesión de 45 minutos">{segs}</div>'


def session_resources(s):
    # la sesión y el texto de su trimestre (que dice con qué robot es el proyecto), pero sin las «Nota:»
    # aclaratorias: la de 2º T2 habla de ScratchJr precisamente para decir que no se usa
    pre = re.sub(r"\*\*Nota:?\*\*.*?(?:\n\s*\n|\Z)", "", s["term"]["pre"], flags=re.S)
    raw = s["raw"] + "\n" + pre
    out, seen = [], set()
    for name, url in SA_LINKS.items():
        if name in raw and url not in seen:
            out.append(("Situación oficial: " + name, url, True)); seen.add(url)
    for key, links in SESSION_RULES:
        if key in raw or key in raw.replace("\n", " "):
            for t, u in links:
                if u not in seen:
                    out.append((t, u, True)); seen.add(u)
    guides = []
    for key, anchor, label in TOOL_GUIDES:
        if key in raw:
            guides.append((f"Guía paso a paso: {label}", "#" + anchor, False))
    return out[:6] + guides[:2]


def render_sections(s):
    secs = s["sections"]
    if not secs:
        return ""
    if len(secs) == 1:
        sec = secs[0]
        head = "Desarrollo de la sesión" if sec["kind"] == "dev" else f'{sec["label"].replace("Opción", "Propuesta")}'
        name = f' <span>· {E(sec["name"])}</span>' if sec["name"] else ""
        return (f'<div class="props single"><h2 class="p-h">{head}{name}</h2>'
                f'<div class="p-body">{md(chr(10).join(p for p in sec["md"]))}</div></div>')
    def short(sec):
        return ("la principal" if sec["kind"] == "dev" else sec["label"].replace("Opción ", "")) + (f' «{sec["name"]}»' if sec["name"] else "")
    tabs, panels = [], []
    for i, sec in enumerate(secs):
        letter = sec["label"].replace("Opción ", "") if sec["kind"] == "opt" else "★"
        label = "Propuesta principal" if sec["kind"] == "dev" else sec["label"].replace("Opción", "Propuesta")
        pid = f'{s["id"]}-p{i}'
        tabs.append(f'<button type="button" role="tab" id="{pid}-t" aria-controls="{pid}" aria-selected="{str(i == 0).lower()}" tabindex="{0 if i == 0 else -1}">'
                    f'<span class="p-letter">{E(letter)}</span><span class="p-tl"><small>{E(label)}</small>{E(sec["name"] or "")}</span></button>')
        others = [short(x) for j, x in enumerate(secs) if j != i]
        others = ", ".join(others[:-1]) + " y " + others[-1] if len(others) > 1 else others[0]
        printed = (f'<h2 class="p-print">{E(label)}{" · " + E(sec["name"]) if sec["name"] else ""}</h2>'
                   f'<p class="p-print p-print-o">Otras propuestas en la guía: {E(others)}.</p>')
        panels.append(f'<div class="p-body" role="tabpanel" id="{pid}" aria-labelledby="{pid}-t"{"" if i == 0 else " hidden"}>'
                      f'{printed}{md(chr(10) + chr(10).join(sec["md"]))}</div>')
    return (f'<div class="props"><h2 class="p-h">Propuestas de actividad <span>· elige una</span></h2>'
            f'<div class="p-tabs" role="tablist" aria-label="Propuestas de actividad">{"".join(tabs)}</div>{"".join(panels)}</div>')


def plain(text):
    """Texto sin marcas: para la vista de proyección."""
    text = re.sub(r"\[\[[PMS]:[^|\]]+\|([^\]]+)\]\]", r"\1", text or "")
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    return re.sub(r"[*`]", "", text).strip()


def pz_text(text):
    """Markdown de la ficha → HTML corto para proyectar: sin enlaces (los botones de herramientas van aparte)."""
    t = re.sub(r"\[\[[PMS]:[^|\]]+\|([^\]]+)\]\]", r"**\1**", text or "")
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)
    t = E(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"\*([^*\n]+)\*", r"<i>\1</i>", t)
    t = re.sub(r"`([^`]+)`", r"<b>\1</b>", t)
    return t.strip()


def pz_steps(text):
    """Pasos de una propuesta: cada elemento de la lista (o cada párrafo) es un paso; las sublistas se unen a su paso."""
    steps = []
    for chunk in re.split(r"\n\s*\n", (text or "").strip()):
        lines = chunk.split("\n")
        if not any(re.match(r"(\d+\.|-)\s", l) for l in lines):
            steps.append(" ".join(l.strip() for l in lines))
            continue
        for l in lines:
            if re.match(r"(\d+\.|-)\s", l):
                steps.append(re.sub(r"^(\d+\.|-)\s+", "", l).strip())
            elif steps and l.strip():
                steps[-1] += " · " + re.sub(r"^(\d+\.|-)\s+", "", l.strip())
    return [pz_text(x) for x in steps if x.strip()]


# Qué se usa en cada sesión semanal (1º a 4º), para el cierre de la proyección. Lo que no aparece es de papel.
USO_SESION = {
    "c1": {"robot": {7, 8, 11, 12, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24}},
    "c2": {"robot": {6, 7, 11, 18, 19, 20, 21}, "tablet": {22, 23, 24}},
    "c3": {"robot": {4}, "scratch": set(range(9, 17)), "makey": {17, 18, 20, 21, 22, 23, 24}},
    "c4": {"scratch": {1, 2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16}, "makey": {17, 19, 20, 21, 22, 23, 24}},
}
CIERRE = {
    "robot": ["Sello en el pasaporte", "Tarjetas contadas y en su caja", "Robots apagados y a cargar"],
    "tablet": ["Sello en el pasaporte", "El proyecto se queda guardado en la tablet", "Tablets a cargar"],
    "scratch": ["Sello en el pasaporte", "Guardamos el proyecto con el nombre de la pareja", "Portátiles cerrados y a cargar"],
    "makey": ["Sello en el pasaporte", "Guardamos el proyecto con el nombre del grupo", "Kit de Makey Makey completo en su caja"],
    "papel": ["Sello en el pasaporte", "Cada cosa a su caja: tarjetas, fichas y material"],
}


def pz_icons():
    """Iconos de la guía para la proyección de 1º y 2º (como data URI): tarjeta de flecha, REPITE y bloque de papel."""
    from urllib.parse import quote
    from svgkit import arrow_svg, SJ
    tarjeta = arrow_svg("F", 100, "#2c5bbf").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ', 1)
    repite = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" rx="14" fill="%s"/>'
              '<text x="50" y="40" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="#fff" text-anchor="middle">REPITE</text>'
              '<text x="50" y="80" font-family="Arial,sans-serif" font-size="38" font-weight="700" fill="#fff" text-anchor="middle">×3</text></svg>') % SJ["ctrl"]
    bloque = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100"><path d="M10 14 Q10 8 16 8 L98 8 Q104 8 104 14 L104 38 '
              'Q114 38 114 50 Q114 62 104 62 L104 86 Q104 92 98 92 L16 92 Q10 92 10 86 L10 62 Q20 62 20 50 Q20 38 10 38 Z" '
              'fill="%s" stroke="rgba(0,0,0,.25)" stroke-width="3"/><path d="M57 74V30M42 45L57 28L72 45" stroke="#fff" '
              'stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>') % SJ["mov"]
    uri = lambda svg: "data:image/svg+xml;charset=utf-8," + quote(svg)
    return {"tarjeta": uri(tarjeta), "repite": uri(repite), "bloque": uri(bloque)}


def close_list(c, s):
    """Cierre de la sesión en la pizarra: lo que se guarda y se recoge según lo que se ha usado ese día."""
    uso = next((k for k, nums in USO_SESION.get(c["id"], {}).items() if s["num"] in nums), "papel")
    return CIERRE[uso]


def projection_data(c, s, quin, prev=None):
    seg = s.get("seg", "")
    quotes = re.findall(r"[\"“«]([^\"”»]{8,})[\"”»]", seg)
    # la frase y su pregunta; si el texto es largo (minutos ampliados), solo las frases entre comillas
    seg_txt = cap(" ".join(q.strip() for q in quotes) if quotes and len(plain(seg)) > 140 else plain(seg))
    tools = [(label, ref) for ref, label in re.findall(r"\[\[P:([\w.]+)\|([^\]]+)\]\]", s.get("proj", ""))]
    words = [(w, d) for w, d, sn in VOCAB.get(int(c["id"][1]), []) if sn == f'S{s["num"]}']
    phases = ([("Tarjeta", 3), ("Misión", 7), ("Práctica", 25), ("Compartir", 5), ("Guardar", 5)] if quin else
              [("Arranque", 5), ("Misión", 7), ("Práctica", 23), ("Compartir", 5), ("Cierre", 5)])
    # la misión: los retos (si la sesión los trae fuera de las propuestas) y los pasos de cada propuesta
    retos, intro = [], []
    for chunk in s["intro"]:
        m = re.match(r"\*\*(Retos[^*]*?):?\*\*:?\s*(.*)", chunk, re.S)
        if m:
            retos.append({"label": "Retos", "name": cap(m.group(1).replace("Retos", "").strip(" ()")), "steps": pz_steps(m.group(2))})
        else:
            intro.append(chunk)
    props = [{"label": "Desarrollo" if sec["kind"] == "dev" else sec["label"].replace("Opción", "Propuesta"), "name": sec["name"] or "",
              "steps": pz_steps("\n\n".join(sec["md"]))} for sec in s["sections"]]
    if not props and intro and not retos:
        props = [{"label": "Desarrollo", "name": "", "steps": pz_steps("\n\n".join(intro))}]
    # en la pizarra, la misión contada para la clase (mision_clase.py); la ficha queda para el docente
    mc = MISION.get(s["id"], {})
    if mc.get("retos"):
        retos = [{"label": "Retos", "name": "", "steps": [pz_text(x) for x in mc["retos"]]}]
    retos = [r for r in retos if r["steps"]]
    for pr in props:
        key = "D" if pr["label"] == "Desarrollo" else pr["label"][-1]
        if key in mc:
            pr["steps"] = [pz_text(x) for x in mc[key]]
    fast = pz_text(mc["extra"] if "extra" in mc else cap(s.get("fast", "")))
    visual = c["id"] in ("c1", "c2")
    if visual:
        for m in retos + props:
            m["pics"] = [pictos_paso(plain(re.sub(r"<[^>]+>", "", x))) for x in m["steps"]]
    d = {"course": f'{c["num"]} · {c["name"]}', "num": s["num"], "title": s["title"], "obj": cap(plain(s.get("obj", ""))),
         "seg": seg_txt, "key": plain(s.get("key", "")), "words": words, "tools": tools,
         "videos": [(v[2], v[0]) for v in BY_SESSION.get(s["id"], [])], "quincenal": quin, "phases": phases,
         "missions": retos + props, "fast": fast,
         "visual": visual, "fastPics": pictos_paso(plain(re.sub(r"<[^>]+>", "", fast))) if visual else [],
         "close": None if quin else close_list(c, s),
         "prev": {"title": prev["title"], "key": plain(prev.get("key", "")), "num": prev["num"]} if prev else None}
    return json.dumps(d, ensure_ascii=False).replace("</", "<\\/")


def render_session(c, s, prev, nxt, idx):
    t = s["term"]
    quin = c["id"] in ("c5", "c6")
    crumbs = f'<a href="#{c["id"]}">{c["num"]} · {E(c["name"])}</a><span>/</span>{E(t["label"])}'
    obj = f'<p class="f-obj">{inline(cap(s["obj"]))}</p>' if s.get("obj") else ""
    tags = "".join(tag(x) for x in s["tags"])
    tag_legend = "".join(f'<li>{tag(x)} {TAG_NAMES[x]}</li>' for x in s["tags"])

    main = []
    if s["intro"]:
        main.append(f'<div class="f-intro">{md(chr(10) + chr(10).join(s["intro"]))}</div>')
    main.append(render_sections(s))
    if s.get("sol"):
        main.append(more("Pistas y soluciones de los retos", '<p class="small">Para el docente: primero la pregunta, después la pista y solo al final la solución.</p>' + blocks(md(chr(10) + s["sol"]), "scratch" if "scratch" in s["title"].lower() or c["id"] in ("c1", "c2", "c3", "c4") else "makecode"), did=s["id"] + "-sol"))
    if s.get("key"):
        main.append(f'<figure class="keyq"><blockquote>{inline(s["key"])}</blockquote><figcaption>Frase clave</figcaption></figure>')
    if s.get("fast") or s["hard"]:
        cols = ""
        if s.get("fast"):
            cols += f'<div class="div-box up"><h3>{ICON["up"]} Para ampliar</h3>{md(cap(s["fast"]))}</div>'
        if s["hard"]:
            cols += f'<div class="div-box down"><h3>{ICON["down"]} Para simplificar</h3>{md(chr(10) + chr(10).join(cap(h) for h in s["hard"]))}</div>'
        main.append(f'<section class="diversity" aria-label="Atención a la diversidad"><h2 class="mini">Atención a la diversidad</h2><div class="div-grid">{cols}</div></section>')
    if s.get("product") or s.get("self"):
        body = ""
        if s.get("product"):
            body += f'<p><strong>{E(s["product"][0])}:</strong> {inline(s["product"][1])}</p>'
        if s.get("self"):
            body += f'<p>{inline(s["self"])}</p>'
        m28 = f' · <a href="materiales/{MAT_INDEX["M28"][2]}.pdf" target="_blank" rel="noopener">Retos del trimestre (M28)</a>' if "M28" in MAT_INDEX else ""
        body += f'<p class="small"><a href="#{RUBRIC}">Ver la rúbrica y los niveles de logro</a>{m28}</p>'
        main.append(f'<div class="eval">{ICON["flag"]}<div><h3>Evaluación del trimestre</h3>{body}</div></div>')
    if s["notes"]:
        items = "".join(f'<li>{"<strong>" + E(l) + ":</strong> " if l else ""}{inline(cap(tx))}</li>' for l, tx in s["notes"])
        main.append(f'<div class="notes">{ICON["note"]}<div><h3>A tener en cuenta</h3><ul>{items}</ul></div></div>')

    side = []
    vids = BY_SESSION.get(s["id"], [])
    if s.get("proj") or s.get("mat") or s.get("sb3") or s.get("mkcd") or vids:
        use = ""
        if vids:
            use += f'<h4>{"Vídeo del concepto" if len(vids) == 1 else "Vídeos de los conceptos"}</h4><p>' + "".join(
                f'<a class="vlink" href="#v-{v[0]}">{PLAY_ICON}{E(v[2])}</a> ' for v in vids).strip() + '</p>'
        if s.get("proj"):
            use += f'<h4>Para proyectar</h4><p>{inline(s["proj"])}</p>'
        if s.get("mat"):
            use += f'<h4>Material listo para imprimir</h4><p>{inline(s["mat"])}</p>'
        if s.get("sb3"):
            use += f'<h4>Archivos de Scratch</h4><p>{inline(s["sb3"])}</p><p class="small">Se abren en Scratch con Archivo › Load from your computer (esa opción sale en inglés).</p>'
        if s.get("mkcd"):
            use += (f'<h4>Archivos de MakeCode</h4><p>{inline(s["mkcd"])}</p><p class="small">Se abren en makecode.microbit.org con '
                    f'Importar › Importar archivo (o arrastrándolos al editor). Desde ahí, Descargar para pasarlos a la placa.</p>')
        use = re.sub(r'</a>\s*·\s*(?=<a class="[mp]link")', '</a>', use)
        side.append(f'<div class="card use"><h3>{ICON["prep"]} Para usar en esta sesión</h3>{use}</div>')
    if s.get("prep"):
        side.append(f'<div class="card"><h3>{ICON["note"]} Antes de la sesión</h3>{md(cap(s["prep"]))}</div>')
    if s.get("seg"):
        extra = f' <small>({E(s["seg_extra"])})</small>' if s.get("seg_extra") else ""
        side.append(f'<div class="card"><h3>{ICON["shield"]} Minuto de uso responsable{extra}</h3>{md(cap(s["seg"]))}</div>')
    if s.get("math"):
        side.append(f'<div class="card"><h3>{ICON["ruler"]} Matemáticas</h3>{md(cap(s["math"]))}</div>')
    res = session_resources(s)
    if res:
        lis = "".join(f'<li><a href="{u}"{" target=_blank rel=noopener" if ext else ""}>{E(tl)}{ICON["ext"] if ext else ""}</a></li>' for tl, u, ext in res)
        side.append(f'<div class="card res"><h3>{ICON["link"]} Recursos</h3><ul>{lis}</ul></div>')
    if tag_legend:
        pass  # la leyenda de bloques repetía las etiquetas de la cabecera

    pager = '<nav class="pager" aria-label="Sesiones">'
    pager += (f'<a class="pg prev" href="#{prev["id"]}">{ICON["left"]}<span><small>Anterior · S{prev["num"]}</small>{E(prev["title"])}</span></a>' if prev else '<span></span>')
    pager += (f'<a class="pg next" href="#{nxt["id"]}"><span><small>Siguiente · S{nxt["num"]}</small>{E(nxt["title"])}</span>{ICON["right"]}</a>' if nxt else '<span></span>')
    pager += "</nav>"

    total = c["count"]
    return f'''<section class="page ficha" id="{s["id"]}" data-course="{c["id"]}" style="--c:var(--{c["id"]})" hidden>
<div class="sheet">
<header class="f-head">
  <div class="f-num" aria-hidden="true"><small>Sesión</small><b>{s["num"]}</b></div>
  <div class="f-titles"><p class="crumbs">{crumbs}<span>/</span>Sesión {idx} de {total}</p>
  <h1>{E(s["title"])}</h1>{obj}<div class="tags">{tags}</div>
  <div class="f-actions"><button type="button" class="pz-open"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M10 7l5 3-5 3z"/></svg>Proyectar la sesión</button><button type="button" class="pr-open" title="Imprime la ficha con la propuesta que tengas elegida y las pistas y soluciones"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>Imprimir</button></div></div>
</header>
<script type="application/json" class="pz-data">{projection_data(c, s, quin, prev)}</script>

<div class="f-grid"><div class="f-main">{"".join(main)}</div><div class="f-side">{"".join(side)}</div></div>
{pager}
</div></section>'''

# ---------------------------------------------------------------- render: course


def render_course(c):
    facts = "".join(f'<div><dt>{E(a)}</dt><dd>{inline(b)}</dd></div>' for a, b in c["facts"])
    facts += f'<div><dt>Herramientas</dt><dd>{E(COURSE_TOOLS[c["id"]])}</dd></div>'
    keys = "".join(f'<div class="krow"><dt>{E(a)}</dt><dd>{inline(cap(b))}</dd></div>' for a, b in c["keys"])

    # lo que no es para entrar a una sesión va al final, en desplegables
    intro = {t: b for t, b in c["intro"]}
    def pick(prefix):
        return next((b for t, b in c["intro"] + c["closing"] if t.startswith(prefix)), "")
    consult = []
    if pick("Qué tienen"):
        consult.append(more("Objetivos del curso", md(pick("Qué tienen"))))
    if pick("Vínculo") or pick("Currículo"):
        consult.append(more("Matemáticas: vínculo y currículo (Decreto 61/2022)", md(pick("Vínculo")) + md(pick("Currículo"), c["id"] + "-cur-")))
    for prefix, title in (("Palabras", "Palabras del curso"), ("Material", "Material para preparar"), ("Atención", "Atención a la diversidad"),
                          ("Evaluación", "Evaluación"), ("Sesiones de reserva", "Sesiones de reserva")):
        if pick(prefix):
            consult.append(more(title, md(pick(prefix), c["id"] + "-" + prefix[:3].lower() + "-")))
    if keys:
        consult.append(more("Cómo es este curso: hilo conductor y dispositivos", f'<dl class="keys">{keys}</dl>'))
    known = ("Qué tienen", "Vínculo", "Currículo", "Palabras", "Resumen", "Material", "Atención", "Evaluación", "Sesiones de reserva")
    for t, b in c["intro"] + c["closing"]:
        if not t.startswith(known):
            consult.append(more(t, md(b, c["id"] + "-x-")))

    terms = []
    for i, t in enumerate(c["terms"]):
        rows = []
        for s in t["sessions"]:
            prod = '<span class="pflag" title="Sesión de producto y rúbrica">Producto</span>' if s.get("product") else ""
            obj_s = f'<small>{inline(cap(s["obj"]))}</small>' if s.get("obj") else ""
            rows.append(f'<li><a href="#{s["id"]}"><span class="n">S{s["num"]}</span><span class="t"><b>{E(s["title"])}</b>{obj_s}</span>'
                        f'<span class="tg">{"".join(tag(x) for x in s["tags"])}{prod}</span></a></li>')
        cont = more("Contenidos oficiales", f'<p>{inline(cap(t["contenidos"]))}</p>') if t["contenidos"] else ""
        pre = more("Sobre este trimestre", md(t["pre"], c["id"] + f"-t{i}-")) if t["pre"] else ""
        sub = f'<p class="tsub">{E(t["sub"] or t.get("dates", ""))}</p>' if (t["sub"] or t.get("dates")) else ""
        terms.append(f'''<section class="term{" opt" if t["optional"] else ""}" id="{c["id"]}-t{i + 1}">
<div class="term-l"><p class="tlabel">{E(t["label"])}</p>{sub}{cont}{pre}</div>
<ol class="slist">{"".join(rows)}</ol></section>''')

    return f'''<section class="page course" id="{c["id"]}" style="--c:var(--{c["id"]})" hidden>
<header class="cover-band"><div class="cb-num" aria-hidden="true">{c["num"]}</div>
<div class="cb-text"><p class="eyebrow">{E(c["cycle"])} · Educación Primaria</p><h1>{E(c["name"])}</h1><p class="cb-sub">{c["num"]} de Primaria · {c["count"]} sesiones</p></div></header>
<div class="sheet">
<dl class="facts">{facts}</dl>
<h2 class="h-sec big">Sesiones</h2>
<p class="lead-s"><span class="pflag">Producto</span> marca la sesión que cierra el trimestre (rúbrica).</p>
{"".join(terms)}
<h2 class="h-sec">Para consultar</h2>
{"".join(consult)}
</div></section>'''

# ---------------------------------------------------------------- render: other pages


def split_general():
    text = (ROOT / "00_General_CE40_26-27.md").read_text(encoding="utf-8")
    parts = re.split(r"^## ", text, flags=re.M)
    secs = {}
    for p in parts[1:]:
        title, _, body = p.partition("\n")
        n = int(title.split(".")[0])
        secs[n] = (title.strip(), re.sub(r"^-{3,}\s*$", "", body, flags=re.M).strip())
    return secs


def gsec(secs, n, extra_before=""):
    title, body = secs[n]
    clean = re.sub(r"^\d+\.\s*", "", title)
    sid = "x-" + slugify_unicode(title, "-")
    return f'<h2 class="h-sec" id="{sid}">{E(clean)}</h2>{extra_before}{md(body)}'


def home(courses, secs):
    books = "".join(
        f'''<a class="book" href="#{c["id"]}" style="--c:var(--{c["id"]})"><span class="b-num">{c["num"]}</span>
<span class="b-name">{E(c["name"])}</span><span class="b-meta">{E(c["cycle"])} · {c["count"]} sesiones</span>
<span class="b-tools">{E(COURSE_TOOLS[c["id"]])}</span></a>''' for c in courses)
    title, body = secs[1]
    return f'''<section class="page home" id="inicio">
<header class="hero">
<div class="hero-text">
<p class="eyebrow">Guía didáctica del profesorado · Curso 2026-2027</p>
<h1>Código Escuela 4.0<br><span>Educación Primaria</span></h1>
<p class="hero-lead">Pensamiento computacional, robótica e inteligencia artificial en el área de Matemáticas. Programación completa de 1º a 6º, con cada sesión preparada para llevarla al aula sin necesidad de experiencia previa.</p>
<ul class="hero-facts"><li><b>128</b> sesiones desarrolladas</li><li><b>2-3</b> propuestas por sesión</li><li><b>+60</b> recursos oficiales enlazados</li></ul>
</div>
<div class="shelf" aria-label="Cursos">{books}</div>
</header>
<div class="sheet">
<div class="contents">
<a href="#metodo"><small>El método</small><b>Cómo es una sesión, roles, evaluación</b></a>
<a href="#etapa"><small>Mapa de la etapa</small><b>Qué se trabaja en cada curso</b></a>
<a href="#calendario"><small>Calendario</small><b>Fechas 2026-2027 por día de la semana</b></a>
<a href="#recursos"><small>Recursos oficiales</small><b>Manuales, situaciones de aprendizaje, vídeos</b></a>
<a href="#herramientas"><small>Herramientas paso a paso</small><b>True True, Scratch, micro:bit…</b></a>
<a href="#material"><small>Material fotocopiable</small><b>Tarjetas, pasaporte, fichas, rúbrica</b></a>
</div>
<h2 class="h-sec big">Cómo usar esta guía</h2>
<div class="ucards">
<div><b>Elige una propuesta</b><p>Cada sesión tiene un objetivo y 2 o 3 formas de trabajarlo. Con una basta.</p></div>
<div><b>El material está hecho</b><p>Fichas en PDF, herramientas para la pizarra y archivos de Scratch y MakeCode. No hay que fabricar nada.</p></div>
<div><b>Proyecta o imprime</b><p>«Proyectar la sesión» muestra a la clase el reto, las palabras nuevas y la herramienta. «Imprimir» saca la ficha en un A4 con la propuesta elegida.</p></div>
<div><b>Es orientativo</b><p>Si algo falla o el grupo va a otro ritmo, pasa a la opción con fichas o usa una sesión de reserva.</p></div>
</div>
<h2 class="h-sec">Así es una ficha de sesión</h2>
<div class="anatomy">
<div><b>1</b><p><strong>Objetivo y bloques.</strong> Lo que hay que trabajar sí o sí, sacado de la secuenciación oficial.</p></div>
<div><b>2</b><p><strong>Propuestas A, B, C.</strong> Caminos distintos para el mismo objetivo. La A se prepara casi sin material.</p></div>
<div><b>3</b><p><strong>Antes de la sesión.</strong> Todo lo que hay que tener listo, en menos de 10 minutos.</p></div>
<div><b>4</b><p><strong>Frase clave y diversidad.</strong> La idea que se llevan y cómo ampliar o simplificar.</p></div>
<div><b>5</b><p><strong>Recursos.</strong> Enlaces directos a los materiales oficiales de Código Escuela 4.0.</p></div>
</div>
</div></section>'''


def subsec(body, heading):
    """Texto de un apartado ### del documento general."""
    m = re.search(r"^### " + re.escape(heading) + r"[^\n]*\n(.*?)(?=^### |\Z)", body, flags=re.M | re.S)
    return m.group(1).strip() if m else ""


# Bloques de programación en las soluciones: `texto` se pinta con el color de su categoría (MakeCode y Scratch)
BLOCK_CATS = [("rad", ("al recibir radio",)), ("fun", ("llamada", "llamar a", "función")),
              ("inp", ("al presionar", "al pulsar el logotipo", "si agitar", "al agitar", "nivel de luz", "temperatura", "nivel de sonido", "aceleración", "brújula", "dirección de la brújula", "al detectar")),
              ("mat", ("escoger al azar", "elegir al azar", "número aleatorio")), ("mus", ("reproduce", "reproducir", "tocar nota", "tocar sonido")), ("rad", ("radio",)),
              ("loo", ("repetir", "mientras", "por siempre")),
              ("bas", ("al iniciar", "para siempre", "mostrar", "pausa", "borrar la pantalla", "esperar")),
              ("log", ("si ", "verdadero", "falso", "y ", "o ", "no ")), ("var", ("establecer", "cambiar", "dar a", "sumar a", "fijar"))]


SCRATCH_CATS = [("sc-eve", ("al hacer clic", "al presionar tecla", "al presionar la tecla", "al recibir", "enviar", "al comenzar como clon")),
                ("sc-mov", ("mover", "girar", "ir a", "sumar a x", "sumar a y", "dar a x", "dar a y", "cambiar x", "cambiar y", "deslizar", "si toca un borde", "rebotar", "apuntar", "posición x", "posición y")),
                ("sc-apa", ("decir", "pensar", "cambiar disfraz", "siguiente disfraz", "cambiar fondo", "mostrar", "esconder", "cambiar tamaño", "fijar tamaño")),
                ("sc-son", ("tocar sonido", "iniciar sonido", "detener todos los sonidos", "tocar nota")),
                ("sc-myb", ("definir",)),
                ("sc-con", ("esperar", "repetir", "por siempre", "si ", "detener", "crear clon", "eliminar este clon")),
                ("sc-sen", ("¿tocando", "tocando", "preguntar", "respuesta", "¿tecla", "cronómetro", "reiniciar cronómetro")),
                ("sc-ope", ("número aleatorio", "unir", "letra")),
                ("sc-var", ("dar a", "sumar a", "mostrar variable", "esconder variable")),
                ("sc-pen", ("bajar lápiz", "subir lápiz", "borrar todo", "fijar color de lápiz", "sellar"))]


def blocks(h, flavor="makecode"):
    """`texto` → bloque con el color de su categoría: MakeCode (micro:bit) o Scratch."""
    def rep(m):
        t = m.group(1)
        low = html.unescape(t).lower()
        if flavor == "scratch":
            cat = "sc-con" if low == "si" else next((c for c, keys in SCRATCH_CATS if low.startswith(keys)), "sc-var" if " " not in low else "mk-gen")
            return f'<span class="mkb {cat}">{t}</span>'
        cat = "log" if low in ("si", "y", "o", "no") else next((c for c, keys in BLOCK_CATS if low.startswith(keys)), "var" if " " not in low else "gen")
        return f'<span class="mkb mk-{cat}">{t}</span>'
    return re.sub(r"<code>([^<]+)</code>", rep, h)


def more(title, body_html, did=None):
    idattr = f' id="{did}"' if did else ""
    return f'<details class="more"{idattr}><summary>{E(title)}</summary><div class="more-body">{body_html}</div></details>'


def method_page(secs):
    s5 = secs[5][1]
    phases = [("Arranque", "5", "Una pregunta para recordar, el minuto de uso responsable y los roles."),
              ("Misión", "7", "El reto, con una demostración y la frase clave."),
              ("Práctica", "23", "En parejas o grupos. A mitad se cambian los roles."),
              ("Compartir", "5", "Un grupo enseña su solución o su mejor error."),
              ("Cierre", "5", "Frase clave, sello en el pasaporte y a recoger.")]
    ph = "".join(f'<div class="ph ph-{i}"><i style="width:{int(m) * 100 // 23}%"></i><span>{m} min</span><b>{n}</b><p>{t}</p></div>' for i, (n, m, t) in enumerate(phases))
    roles = [("rol_piloto", "Piloto", "Maneja el robot, el dispositivo o las tarjetas."), ("rol_copiloto", "Copiloto", "Lee el reto y comprueba. No toca."),
             ("rol_material", "Material", "Recoge, cuenta y pone a cargar."), ("rol_portavoz", "Portavoz", "Explica lo que ha hecho el grupo.")]
    rl = "".join(f'<div class="role"><img data-picto="{p}" alt=""><b>{n}</b><p>{t}</p></div>' for p, n, t in roles)
    qs = re.findall(r'^- ["«](.+?)["»]', subsec(s5, "Tres preguntas"), flags=re.M)
    qh = "".join(f'<blockquote>{E(q)}</blockquote>' for q in qs)
    tools = "".join(f'<li style="--c:var(--{cid})"><b>{cid[1]}º</b>{E(t)}</li>' for cid, t in COURSE_TOOLS.items())
    joker = re.findall(r"^- \*\*(.+?):\*\*", secs[10][1], flags=re.M)
    jk = "".join(f"<li>{post(inline(j))}</li>" for j in joker)
    details = "".join([
        more("Rúbrica completa y autoevaluación", md(secs[9][1]), "rubrica"),
        more("Minuto de uso responsable: banco de frases", md(subsec(s5, "Minuto de uso responsable"))),
        more("Atención a la diversidad: qué recurso usar en cada caso", md(secs[6][1])),
        more("Recursos de motivación (pasaporte, cazabichos, hilo conductor)", md(secs[7][1])),
        more("Material de cada curso y qué comprobar antes de empezar", md(secs[8][1])),
        more("Contenidos oficiales por curso y trimestre", md(secs[3][1])),
        more("Marco del programa y bloques (PC, ROB, IA, SEG, RA)", md(secs[2][1])),
        more("Sesiones comodín: en qué consiste cada una", md(secs[10][1])),
    ])
    return f'''<section class="page" id="metodo" hidden><div class="sheet doc">
<p class="eyebrow">El método</p><h1>Cómo funciona</h1>
<p class="lede">Todas las sesiones siguen la misma estructura. Al alumnado le da seguridad y a ti te ahorra trabajo.</p>
<h2 class="h-sec">La sesión de 45 minutos</h2>
<div class="phases">{ph}</div>
<p class="small">En 5º y 6º (quincenal) se recoge 5 minutos antes y cada equipo rellena la tarjeta «Dónde lo dejamos» (M18).</p>
<h2 class="h-sec">Roles en cada grupo</h2>
<div class="roles">{rl}</div>
<p class="small">En parejas, piloto y copiloto, y se cambian a mitad. En grupos, el rol cambia cada sesión. Tarjetas de rol: M05.</p>
<h2 class="h-sec">Tres preguntas para cualquier sesión</h2>
<div class="qs">{qh}</div>
<h2 class="h-sec">Evaluación</h2>
<div class="ecards"><div><b>Pasaporte</b><p>Un sello por sesión (M15).</p></div><div><b>Rúbrica</b><p>4 criterios, una vez por trimestre (M19).</p></div><div><b>Autoevaluación</b><p>Caritas en 1º y 2º; una frase desde 3º.</p></div></div>
<h2 class="h-sec">Herramientas de cada curso</h2>
<ul class="ctools">{tools}</ul>
<p class="small">Es orientativo: un recurso se adelanta o se alarga según el grupo. La evolución completa está en el <a href="#etapa">Mapa de la etapa</a>.</p>
<h2 class="h-sec">Sesiones de reserva</h2>
<ul class="chips">{jk}</ul>
<h2 class="h-sec">Para consultar</h2>
{details}
</div></section>'''


def calendar_page(secs):
    return f'''<section class="page" id="calendario" hidden><div class="sheet doc">
<p class="eyebrow">Calendario</p><h1>Sesiones del curso 2026-2027</h1>
{re.sub(r'<h3([^>]*)>(.*?)</h3>', r'<h2 class="h-sec"\1>\2</h2>', md(secs[4][1]))}</div></section>'''


def evolution_page():
    head = '<div class="tl-row tl-head"><div class="tl-label"></div>' + "".join(
        f'<div class="tl-course" style="grid-column:span 3;--c:var(--c{c})"><b>{c}º</b><small>{"semanal" if c <= 4 else "quincenal"}</small></div>'
        for c in range(1, 7)) + "</div>"
    sub = '<div class="tl-row tl-sub"><div class="tl-label"></div>' + "".join(
        f'<div class="tl-t{" tl-sep" if t == 1 and c > 1 else ""}">T{t}</div>' for c in range(1, 7) for t in (1, 2, 3)) + "</div>"
    rows = []
    for key, name, cells in TOOLS:
        cols = []
        for c in range(1, 7):
            for t in (1, 2, 3):
                sep = " tl-sep" if t == 1 and c > 1 else ""
                if (c, t) in cells:
                    left = (c, t - 1) in cells if t > 1 else (c - 1, 3) in cells
                    right = (c, t + 1) in cells if t < 3 else (c + 1, 1) in cells
                    cls = "on" + ("" if left else " l") + ("" if right else " r")
                    note = TOOL_NOTES.get((key, c, t), "")
                    cols.append(f'<div class="tl-c{sep}"><span class="bar k-{key} {cls}" title="{E(name)} · {c}º, T{t}"></span></div>')
                else:
                    cols.append(f'<div class="tl-c{sep}"></div>')
        rows.append(f'<div class="tl-row"><div class="tl-label"><i class="dot k-{key}"></i>{E(name)}</div>{"".join(cols)}</div>')
    timeline = f'<div class="scroll" tabindex="0" role="region" aria-label="Línea de tiempo de la etapa"><div class="tl">{head}{sub}{"".join(rows)}</div></div>'

    def pips(l):
        return '<span class="pips">' + "".join('<i class="pip on"></i>' if i < l else '<i class="pip"></i>' for i in range(3)) + "</span>"
    thead = '<tr><th class="sticky">Contenido</th>' + "".join(f'<th style="--c:var(--c{c})"><span class="cn">{c}º</span></th>' for c in range(1, 7)) + "</tr>"
    trs = []
    for name, tg, cells in STRANDS:
        tds = "".join('<td class="lv0"><span class="none">—</span></td>' if l == 0 else
                      f'<td class="lv{l}" title="{LEVEL_NAMES[l]}">{pips(l)}{E(tx)}</td>' for l, tx in cells)
        trs.append(f'<tr><th class="sticky" scope="row">{tag(tg.upper())}<span>{E(name)}</span></th>{tds}</tr>')
    grid = f'<div class="scroll" tabindex="0" role="region" aria-label="Progresión por bloques"><table class="prog"><thead>{thead}</thead><tbody>{"".join(trs)}</tbody></table></div>'
    legend = '<div class="legend">' + "".join(f'<span>{pips(l)}{LEVEL_NAMES[l]}</span>' for l in (1, 2, 3)) + '<span><span class="none">—</span> No se trabaja</span></div>'
    prod = ('<div class="scroll" tabindex="0" role="region" aria-label="Productos de cada trimestre"><table class="prod"><thead><tr><th>Curso</th><th>1er trimestre</th><th>2º trimestre</th><th>3er trimestre</th></tr></thead><tbody>'
            + "".join(f'<tr style="--c:var(--c{i + 1})"><th scope="row"><span class="cn">{c}</span></th><td>{E(a)}</td><td>{E(b)}</td><td>{E(d)}</td></tr>' for i, (c, a, b, d) in enumerate(PRODUCTS))
            + "</tbody></table></div>")
    return f'''<section class="page" id="etapa" hidden><div class="sheet">
<p class="eyebrow">Mapa de la etapa</p><h1>Evolución de 1º a 6º</h1>
<p class="lede">El primer ciclo trabaja sin pantallas, con el cuerpo, tarjetas y robots de suelo (Tale-Bot, que se programa con botones, y True True, con tarjetas). La pantalla entra al final de 2º, y los objetos programables (micro:bit y Nezha) en el tercer ciclo. Los contenidos crecen en espiral: cada curso retoma lo anterior y lo amplía.</p>
<h2 class="h-sec">Herramientas por trimestre</h2>
<p class="small">Cada barra indica los trimestres en que se usa la herramienta.</p>
{timeline}
<h2 class="h-sec">Progresión de contenidos</h2>
<p class="small">Qué se trabaja de cada contenido en cada curso, y con qué grado.</p>
{legend}{grid}
<h2 class="h-sec">Productos de cada trimestre</h2>
<p class="small">Lo que entrega el alumnado al final de cada trimestre. Es el momento de marcar la rúbrica.</p>
{prod}
</div></section>'''


def resources_page(secs):
    blocks = []
    for d in LIBRARY:
        groups = []
        for gname, items in d["groups"]:
            lis = []
            for it in items:
                title, url, meta = it[0], it[1], it[2]
                extra = ""
                if len(it) > 3:
                    extra = (f'<span class="rx"><a href="{it[3]}" target="_blank" rel="noopener">Programa .hex</a>'
                             f'<a href="{it[4]}" target="_blank" rel="noopener">Manual de montaje</a></span>')
                lis.append(f'<li><a class="rl" href="{url}" target="_blank" rel="noopener"><span>{E(title)}</span>{ICON["ext"]}</a>'
                           f'<span class="rm">{E(meta)}</span>{extra}</li>')
            groups.append(f'<div class="rgroup"><h4>{E(gname)}</h4><ul>{"".join(lis)}</ul></div>')
        blocks.append(f'''<details class="more rdev" id="{d["id"]}" style="--c:var(--{d["color"]})">
<summary><span><b>{E(d["name"])}</b> · {E(d["courses"])}</span></summary>
<div class="more-body"><p class="small">{E(d["intro"])}</p><div class="rgroups">{"".join(groups)}</div></div></details>''')
    return f'''<section class="page" id="recursos" hidden><div class="sheet">
<p class="eyebrow">Recursos oficiales</p><h1>Biblioteca de recursos</h1>
<p class="lede">Lo publicado por Código Escuela 4.0 en EducaMadrid, por dispositivo. Las fichas de sesión ya enlazan lo que necesitan.</p>
{"".join(blocks)}
<p class="small">Fuente: <a href="https://www.educa2.madrid.org/web/centro.codigo-escuela-4.0" target="_blank" rel="noopener">web de Código Escuela 4.0 en EducaMadrid</a>. Si algún enlace cambia, se puede buscar el recurso por su título en la web oficial.</p>
</div></section>'''


FOLD = ("Antes de", "Si algo falla", "Para aprender más", "Sobre los nombres")


def fold_blocks(body):
    """Parte un texto en bloques que empiezan por «**Etiqueta:**» y pliega los que no hacen falta al dar la clase."""
    blocks = re.split(r"\n(?=\*\*[^*\n]+:\*\*)", "\n" + body.strip())
    out = []
    for b in blocks:
        b = b.strip()
        if not b:
            continue
        m = re.match(r"\*\*([^*\n]+?):\*\*\s*(.*)", b, flags=re.S)
        if m and m.group(1).startswith(FOLD):
            out.append(more(m.group(1), md(m.group(2))))
        else:
            # si tras «**Etiqueta:**» viene una lista, hace falta una línea en blanco para que se vea como lista
            out.append(md(re.sub(r"^(\*\*[^*\n]+:\*\*)[ \t]*\n(?=\s*(?:[-*]|\d+\.) )", r"\1\n\n", b)))
    return "".join(out)


def tools_doc_page(pid, eyebrow, title, lede, fname, prefix):
    text = (ROOT / fname).read_text(encoding="utf-8").split("\n", 1)[1]
    parts = re.split(r"^## ", text, flags=re.M)
    # la tabla índice del principio sobra en la web: cada herramienta es ya un desplegable con sus cursos
    courses = {m.group(1).strip(): m.group(2).strip() for m in re.finditer(r"^\| ([^|]+) \| ([^|]+) \| \[Ver\]", parts[0], flags=re.M)}
    intro = "\n".join(l for l in parts[0].split("\n") if not l.startswith("|"))
    html_ = [fold_blocks(re.sub(r"^-{3,}\s*$", "", intro, flags=re.M))]
    for p in parts[1:]:
        head, _, body = p.partition("\n")
        name = re.sub(r"^\d+\.\s*", "", head.strip())
        sid = "g-" + slugify_unicode(name, "-")
        body = re.sub(r"^-{3,}\s*$", "", body, flags=re.M)
        cur = courses.get(name, "")
        html_.append(f'<details class="more tguide" id="{sid}"><summary><span><b>{E(name)}</b>{" · " + E(cur) if cur else ""}</span></summary>'
                     f'<div class="more-body">{fold_blocks(body)}</div></details>')
    return f'''<section class="page" id="{pid}" hidden><div class="sheet doc">
<p class="eyebrow">{eyebrow}</p><h1>{title}</h1><p class="lede">{lede}</p>
{"".join(html_)}</div></section>'''


def doc_page(pid, eyebrow, title, lede, fname, prefix):
    text = (ROOT / fname).read_text(encoding="utf-8")
    body = text.split("\n", 1)[1]
    return f'''<section class="page" id="{pid}" hidden><div class="sheet doc">
<p class="eyebrow">{eyebrow}</p><h1>{title}</h1><p class="lede">{lede}</p>
{md(body, prefix)}</div></section>'''

# ---------------------------------------------------------------- assemble


def build():
    courses = [parse_course(*c) for c in COURSES]
    secs = split_general()
    pages = [home(courses, secs), method_page(secs), calendar_page(secs), evolution_page()]
    for c in courses:
        pages.append(render_course(c))
        flat = [s for t in c["terms"] for s in t["sessions"]]
        for i, s in enumerate(flat):
            pages.append(render_session(c, s, flat[i - 1] if i else None, flat[i + 1] if i + 1 < len(flat) else None, i + 1))
    pages.append(resources_page(secs))
    pages.append(tools_doc_page("herramientas", "Herramientas paso a paso", "Guías rápidas de cada herramienta",
                          "Lo mínimo que hay que saber de cada robot o programa, y qué hacer cuando algo falla.",
                          "07_Guias_rapidas_herramientas.md", ""))
    pages.append(material_page())
    pages.append(projectables_page())
    pages.extend(tool_pages())
    pages.extend(video_pages(courses))
    pages.append('<section class="page" id="buscar" hidden><div class="sheet"><p class="eyebrow">Buscador</p><h1>Resultados</h1><p class="lede" id="sr-sum"></p><ol class="slist sr" id="sr"></ol></div></section>')

    course_nav = "".join(f'<a href="#{c["id"]}" data-nav="{c["id"]}" style="--c:var(--{c["id"]})"><i></i><b>{c["num"]}</b><span>{E(c["name"])}</span></a>' for c in courses)
    side = f'''<aside class="side" id="side">
<a class="logo" href="#inicio"><span class="lg-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span><b>Código Escuela 4.0</b><small>Guía didáctica · Primaria 26-27</small></span></a>
<label class="search">{ICON["search"]}<input id="q" type="search" placeholder="Buscar sesiones" aria-label="Buscar sesiones" autocomplete="off"></label>
<nav aria-label="Guía">
<p class="ng">La guía</p>
<a href="#inicio" data-nav="inicio">Presentación</a><a href="#metodo" data-nav="metodo">El método</a>
<a href="#etapa" data-nav="etapa">Mapa de la etapa</a><a href="#calendario" data-nav="calendario">Calendario</a>
<p class="ng">Cursos</p><div class="cnav">{course_nav}</div>
<p class="ng">Recursos</p>
<a href="#recursos" data-nav="recursos">Recursos oficiales</a><a href="#herramientas" data-nav="herramientas">Herramientas paso a paso</a>
<a href="#proyectar" data-nav="proyectar">Para proyectar</a><a href="#material" data-nav="material">Material imprimible</a>
</nav></aside>'''

    colofon = (f'<footer class="colophon"><p><b>Guía didáctica Código Escuela 4.0</b> · Educación Primaria · Curso 2026-2027 · Versión {VERSION} ({VERSION_FECHA})</p>'
               '<p>Pictogramas: Sergio Palao. Origen: <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a>. Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón. '
               'Los dibujos de las herramientas, los vídeos y los proyectos de Scratch y MakeCode son propios de la guía.</p></footer>')
    page = f'''<title>Guía didáctica Código Escuela 4.0</title>
<meta name="description" content="{DESCRIPCION}">
<meta name="theme-color" content="#e9ebef" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#0d0f13" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website"><meta property="og:locale" content="es_ES"><meta property="og:title" content="Guía didáctica Código Escuela 4.0 · Primaria 2026-2027"><meta property="og:description" content="{DESCRIPCION}">
<link rel="icon" href="{FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;0,7..72,600;1,7..72,400&family=IBM+Plex+Mono:wght@500;600&display=swap">
<style>{CSS}</style>
<div class="topbar"><button type="button" class="menu-btn" aria-controls="side" aria-expanded="false">{ICON["menu"]}<span>Índice</span></button><a href="#inicio" class="tb-title">Código Escuela 4.0 · Guía didáctica</a></div>
<div class="shell">{side}<main id="main">{"".join(pages).replace("🏴", FLAG)}{colofon}</main></div>
<script>{PJS};window.PZ_ICON={json.dumps(pz_icons())};</script>
<script>{JS}</script>'''
    OUT.write_text(page, encoding="utf-8")
    (OUT.parent / "_preview.html").write_text('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + page, encoding="utf-8")
    n = sum(c["count"] for c in courses)
    print(OUT.name, len(page), "bytes,", n, "sesiones")


SB3 = [
    ("3-S11-baile-solucion.sb3", "El baile · solución", "3º S11", "c3"),
    ("3-S11-figuras-solucion.sb3", "Figuras con el lápiz · solución", "3º S11", "c3"),
    ("3-S12-dialogo-solucion.sb3", "Diálogo de dos personajes · solución", "3º S12", "c3"),
    ("3-S13-variables-solucion.sb3", "Puntos con cada clic · solución", "3º S13", "c3"),
    ("3-S14-juego-de-atrapar-solucion.sb3", "Juego de atrapar · solución", "3º S14", "c3"),
    ("3-S21-museo-plantilla.sb3", "Plantilla del museo · 4 botones y un contador", "3º S20 y S21", "c3"),
    ("4-S1-arregla-el-juego-3-bichos.sb3", "Arregla el juego · 3 bichos", "4º S1", "c4"),
    ("4-S5-adivina-el-numero-solucion.sb3", "Adivina el número · solución", "4º S5", "c4"),
    ("4-S6-juego-de-las-tablas-solucion.sb3", "Juego de las tablas · solución", "4º S6", "c4"),
    ("4-S7-torneo-bicho-1-la-variable.sb3", "Torneo de bichos 1 · la variable", "4º S7", "c4"),
    ("4-S7-torneo-bicho-2-la-condicion.sb3", "Torneo de bichos 2 · la condición", "4º S7", "c4"),
    ("4-S7-torneo-bicho-3-el-repetir.sb3", "Torneo de bichos 3 · el repetir", "4º S7", "c4"),
    ("4-S10-videojuego-plantilla.sb3", "Videojuego · plantilla de inicio", "4º S10", "c4"),
    ("4-S13-videojuego-completo-solucion.sb3", "Videojuego completo · solución", "4º S10 a S13", "c4"),
    ("5-S1-arregla-el-juego-3-bichos.sb3", "Arregla el juego · 3 bichos", "5º S1", "c5"),
]


def material_page():
    import pypdf
    tiles = []
    color = {"1º": "c1", "2º": "c2", "3º": "c3", "4º": "c4", "5º": "c5", "6º": "c6"}
    for code, title, courses, _ in MAT.MATERIALS:
        name = MAT.slug(code, title)
        pdf = HERE / "materiales" / f"{name}.pdf"
        n = len(pypdf.PdfReader(str(pdf)).pages) if pdf.exists() else 0
        c = color.get(courses[:2], "c5")
        tiles.append(f'<a class="mat-tile" style="--c:var(--{c})" href="materiales/{name}.pdf" target="_blank" rel="noopener">'
                     f'<span class="mat-code">{code}</span><span><b>{E(title)}</b><small>{E(courses)} · {n} {"página" if n == 1 else "páginas"} · PDF</small></span></a>')
    sb3 = [f'<a class="mat-tile" style="--c:var(--{c})" href="materiales/scratch/{f}" download>'
           f'<span class="mat-code">SB3</span><span><b>{E(t)}</b><small>{E(w)} · Scratch</small></span></a>' for f, t, w, c in SB3]
    mk = [f'<a class="mat-tile" style="--c:var(--c{n[0]})" href="materiales/makecode/{n}.mkcd" download>'
          f'<span class="mat-code">MKCD</span><span><b>{E(t.split(" · ", 1)[1])}</b><small>{E(w)} · MakeCode</small></span></a>'
          for n, t, w, _, _ in MK.PROYECTOS]
    text = (ROOT / "08_Plantillas_y_material.md").read_text(encoding="utf-8").split("\n", 1)[1]
    intro = text.split("## Material imprimible")[0]
    return f'''<section class="page" id="material" hidden><div class="sheet">
<p class="eyebrow">Material imprimible</p><h1>Material listo para fotocopiar</h1>
<p class="lede">Cada PDF indica en su cabecera los cursos, las sesiones y cómo usarlo, y trae las soluciones.</p>
<div class="mat-gallery">{"".join(tiles)}</div>
<h2 style="margin-top:2.2rem">Archivos de Scratch</h2>
<p class="small">Se abren en Scratch con <b>Archivo › Load from your computer</b> (esa opción sale en inglés). Los de «bichos» tienen errores a propósito; las plantillas traen los dibujos y unas notas, sin programar.</p>
<div class="mat-gallery">{"".join(sb3)}</div>
<h2 style="margin-top:2.2rem">Archivos de MakeCode (micro:bit y Nezha)</h2>
<p class="small">Se abren en <a href="https://makecode.microbit.org/" target="_blank" rel="noopener">makecode.microbit.org</a> con <b>Importar › Importar archivo</b> o arrastrándolos al editor, y salen ya en bloques. Desde ahí, <b>Descargar</b> para pasarlos a la placa. Los del Nezha traen las extensiones del kit. Los de «bicho» tienen un error a propósito.</p>
<div class="mat-gallery">{"".join(mk)}</div>
{more("Consejos para organizar el material", md(intro, "m-"))}
</div></section>'''


def projectables_page():
    tiles = "".join(
        f'<a class="pj-tile" href="#p-{pid}"><small>{E(courses)}</small><b>{E(name)}</b><span>{E(desc)}</span></a>'
        for pid, ic, name, courses, desc, _ in PROYECTABLES)
    ext = "".join(f'<a class="ext-app" href="{u}" target="_blank" rel="noopener"><b>{E(n)} ↗</b><span>{E(d)}</span><small>{E(c)}</small></a>' for n, u, c, d in EXTERNAS)
    return f'''<section class="page" id="proyectar" hidden><div class="sheet">
<p class="eyebrow">Para proyectar</p><h1>Herramientas para la pizarra digital</h1>
<p class="lede">Para usar con toda la clase en la pizarra. Cada sesión enlaza la suya con el reto ya cargado. Más abajo, los <a href="#videos">vídeos que explican conceptos</a>.</p>
<div class="pj-gallery">{tiles}</div>
<h2 class="h-sec" id="videos">Vídeos que explican conceptos</h2>
<p class="small">Animaciones de uno a dos minutos, con subtítulos y efectos de sonido opcionales. Cada sesión enlaza el suyo.</p>
<div class="vid-gallery">{video_tiles()}</div>
<h2 class="h-sec">Otras aplicaciones recomendadas</h2>
<p class="small">Se abren en otra pestaña. Gratuitas y sin cuentas de alumnado.</p>
<div class="ext-apps">{ext}</div></div></section>'''


def tool_pages():
    out = []
    for pid, ic, name, courses, desc, presets in PROYECTABLES:
        chips = "".join(f'<a class="rindex-chip" href="#p-{pid}{("." + p) if p else ""}">{E(lbl)}</a>' for p, lbl in presets if len(presets) > 1)
        out.append(f'''<section class="page pj-page" id="p-{pid}" data-nav-key="proyectar" hidden><div class="sheet">
<div class="pj-head"><div><p class="eyebrow">Para proyectar · {E(courses)}</p><h1>{E(name)}</h1></div>
<div class="pj-row"><a class="pj-btn back-inline" href="#" hidden>← Volver a la sesión</a>{(f'<a class="pj-btn" href="#guia-{pid}">Guía para el docente</a>') if pid in GUIAS else ''}<button type="button" class="pj-btn" data-fullscreen>Pantalla completa</button><button type="button" class="pj-btn" data-still>Sin animaciones</button><a class="pj-btn" href="#proyectar">Todas las herramientas</a></div></div>
{('<nav class="rindex" aria-label="Retos">' + chips + '</nav>') if chips else ''}
<div class="pj-stage-root"></div>{tool_guide(pid)}</div></section>''')
    return out


def tool_guide(pid):
    g = GUIAS.get(pid)
    if not g:
        return ""
    body = f'<p class="g-idea">{inline(g["idea"])}</p>'
    body += '<h2 class="g-h">Qué contar a la clase</h2><ol>' + "".join(f'<li>{inline(x)}</li>' for x in g["contar"]) + '</ol>'
    qs = ""
    for q, pistas, sol in g.get("preguntas", []):
        qs += (f'<li><b>{inline(q)}</b><ul class="g-steps">' + "".join(f'<li><span class="g-tag">Pista</span> {inline(x)}</li>' for x in pistas)
               + f'<li><details><summary>Ver la solución</summary>{md(sol)}</details></li></ul></li>')
    if qs:
        body += f'<h2 class="g-h">Preguntas para pensar</h2><ol class="g-qs">{qs}</ol>'
    if g.get("mates"):
        body += f'<h2 class="g-h">Matemáticas</h2><p>{inline(g["mates"])}</p>'
    if g.get("saber"):
        body += '<h2 class="g-h">Para saber más</h2><ul>' + "".join(f'<li><a href="{u}" target="_blank" rel="noopener">{E(t)}</a></li>' for t, u in g["saber"]) + '</ul>'
    return more("Guía para el docente: qué contar, preguntas y soluciones", body, did=f"guia-{pid}")


def video_tiles():
    return "".join(
        f'<a class="vid-tile" href="#v-{vid}"><img src="videos/img/{vid}.jpg" alt="" loading="lazy" width="640" height="360">'
        f'<span><small>{E(courses)}</small><b>{E(title)}</b></span></a>'
        for vid, fname, title, courses, idea, t, sids in VIDEOS)


def video_pages(courses):
    names = {}
    for c in courses:
        for t in c["terms"]:
            for s in t["sessions"]:
                names[s["id"]] = (c["id"], f'{c["num"]} · S{s["num"]} · {s["title"]}')
    out = []
    for vid, fname, title, crs, idea, t, sids in VIDEOS:
        chips = "".join(f'<a class="rindex-chip" href="#{sid}" style="--c:var(--{names[sid][0]})">{E(names[sid][1])}</a>' for sid in sids)
        out.append(f'''<section class="page vid-page" id="v-{vid}" data-nav-key="proyectar" hidden><div class="sheet">
<div class="pj-head"><div><p class="eyebrow">Vídeo · {E(crs)}</p><h1>{E(title)}</h1></div>
<div class="pj-row"><a class="pj-btn back-inline" href="#" hidden>← Volver a la sesión</a><button type="button" class="pj-btn" data-vfull>Pantalla completa</button><a class="pj-btn" href="#videos">Todos los vídeos</a></div></div>
<div class="vid-frame"><iframe data-src="videos/{fname}" title="Vídeo: {E(title)}" allow="fullscreen" allowfullscreen></iframe></div>
<p class="vid-idea">{E(idea)}</p>
<ul class="vid-tips"><li><b>Pausas para pensar:</b> actívalas en la barra del vídeo y se detiene en dos preguntas para la clase.</li>
<li><b>Velocidad 0,75×</b> para los más pequeños. Teclado: espacio, ← → (5 s).</li><li><b>Sonido:</b> efectos suaves (pasos del robot, aciertos, el timbre…), sin voz ni música. Se activa en la barra del vídeo y el navegador lo recuerda. La narración son los subtítulos.</li></ul>
<h2 class="h-sec">Se usa en</h2><nav class="rindex" aria-label="Sesiones">{chips}</nav>
</div></section>''')
    return out


HERE = Path(__file__).resolve().parent
CSS = (HERE / "estilo.css").read_text(encoding="utf-8") + (HERE / "proyectables.css").read_text(encoding="utf-8") + (HERE / "proyectables2.css").read_text(encoding="utf-8") + (HERE / "proyectables3.css").read_text(encoding="utf-8") + (HERE / "proyectables4.css").read_text(encoding="utf-8") + (HERE / "proyectables5.css").read_text(encoding="utf-8") + (HERE / "proyeccion.css").read_text(encoding="utf-8") + (HERE / "videos.css").read_text(encoding="utf-8") + (HERE / "imprimir.css").read_text(encoding="utf-8")
JS = (HERE / "app.js").read_text(encoding="utf-8") + ";\n" + (HERE / "proyeccion.js").read_text(encoding="utf-8")
PJS = (HERE / "pictos_data.js").read_text(encoding="utf-8") + ";\n" + (HERE / "proyectables.js").read_text(encoding="utf-8") + ";\n" + (HERE / "proyectables2.js").read_text(encoding="utf-8") + ";\n" + (HERE / "proyectables5.js").read_text(encoding="utf-8") + ";\n" + (HERE / "proyectables6.js").read_text(encoding="utf-8")

if __name__ == "__main__":
    build()
