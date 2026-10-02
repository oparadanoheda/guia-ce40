# Comprueba que los bloques de Scratch y MakeCode que cita la guía se llaman igual que en los editores en español.
#
# Los nombres oficiales salen de las traducciones de Scratch («es», scratch-l10n) y de MakeCode para micro:bit («es-ES»),
# más los bloques de las extensiones del Nezha y PlanetX, que están en inglés. Se guardan en bloques_oficiales.json para que
# la comprobación funcione sin conexión.
#
# Qué se revisa: lo que va entre `…` en las sesiones y en la guía de herramientas (apartados de Scratch, micro:bit y Nezha),
# lo que va en **negrita** si está junto a una flecha (→) o lleva un número, los bloques dibujados en las chuletas M20 y M21
# y en los retos M28, y las notas de los archivos .sb3.
#
# Lo que no puede ver: una errata en la primera palabra («dicir ¡Hola!») hace que la cita no parezca un bloque, y el
# contenido de los huecos (números, opciones de los menús) no se revisa.
#
# Uso (desde web/):
#   python revisar_bloques.py               comprueba
#   python revisar_bloques.py --actualizar  descarga de nuevo los nombres oficiales y comprueba
#   python revisar_bloques.py --todos       además, lista cada bloque citado con su nombre oficial
# Termina con error (código 1) si algún bloque citado no existe con ese nombre.
import json
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
CACHE = HERE / "bloques_oficiales.json"

FUENTES = {
    "scratch_bloques": "https://raw.githubusercontent.com/scratchfoundation/scratch-l10n/master/editor/blocks/es.json",
    "scratch_extensiones": "https://raw.githubusercontent.com/scratchfoundation/scratch-l10n/master/editor/extensions/es.json",
    "makecode_editor": "https://makecode.microbit.org/api/translations?lang=es-ES&filename=strings.json&approved=true",
    "makecode_core": "https://makecode.microbit.org/api/translations?lang=es-ES&filename=microbit%2Fcore-strings.json&approved=true",
    "makecode_radio": "https://makecode.microbit.org/api/translations?lang=es-ES&filename=microbit%2Fradio-strings.json&approved=true",
    "makecode_microfono": "https://makecode.microbit.org/api/translations?lang=es-ES&filename=microbit%2Fmicrophone-strings.json&approved=true",
    "nezha": "https://raw.githubusercontent.com/elecfreaks/pxt-nezha/v1.3.9/main.ts",
    "planetx": "https://raw.githubusercontent.com/elecfreaks/pxt-planetx/v1.5.33/basic.ts",
}
# Bloques cuyo texto no está entero en la traducción: el menú de «detener» es aparte y el editor de MakeCode añade al bloque
# de radio su parámetro (receivedNumber…). «Crear una función...» es el botón de la categoría Funciones.
EXTRA = {"scratch": ["detener %1"],
         "makecode": ["al recibir radio %receivedNumber", "al recibir radio %receivedString", "al recibir radio %name %value",
                      "Crear una función %1"]}


# ------------------------------------------------------------------ nombres oficiales
def descargar(url):
    req = urllib.request.Request(url, headers={"User-Agent": "guia-ce40"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8")


def actualizar():
    d = {k: descargar(u) for k, u in FUENTES.items()}
    scratch = list(json.loads(d["scratch_bloques"]).values())
    for k, v in json.loads(d["scratch_extensiones"]).items():
        # de las extensiones, solo los bloques (no el nombre de la categoría ni los menús de una palabra)
        if k.split(".")[0] in ("pen", "music", "makeymakey") and not k.endswith("categoryName") and (" " in v.strip() or "[" in v):
            scratch.append(re.sub(r"\[[A-Z_]+\]", "%1", v))
    makecode = []
    for k in ("makecode_core", "makecode_radio", "makecode_microfono"):
        makecode += [v for key, v in json.loads(d[k]).items() if key.endswith("|block")]
    # bloques propios del editor (si, mientras, fijar, cambiar, llamada…): son las cadenas con %1
    makecode += [v for key, v in json.loads(d["makecode_editor"]).items() if re.search(r"%\d", key)]
    extensiones = []
    for k in ("nezha", "planetx"):
        extensiones += [b.replace("\\\\%", "%").replace("\\%", "%") for b in re.findall(r'block="([^"]+)"', d[k])]
    datos = {"nota": "Generado por revisar_bloques.py --actualizar. Fuentes: " + ", ".join(FUENTES.values()),
             "fecha": date.today().isoformat(), "scratch": sorted(set(scratch)), "makecode": sorted(set(makecode)),
             "extensiones": sorted(set(extensiones))}
    CACHE.write_text(json.dumps(datos, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"Nombres oficiales actualizados: {len(datos['scratch'])} de Scratch, {len(datos['makecode'])} de MakeCode, "
          f"{len(datos['extensiones'])} de Nezha y PlanetX.")
    return datos


HUECO = re.compile(r"^(?:%\d+|%\{\d+\}|%[A-Za-z_][\w.]*(?:=[\w.]+)?|\$[A-Za-z_]\w*)$")


def fichas(t):
    """Plantilla oficial → lista de palabras y huecos (None), sin paréntesis ni corchetes, como las citas."""
    t = t.replace("|", " ").replace("\\%", "%")
    t = re.sub(r"(%[A-Za-z_]\w*)%", r"\1 %", t)                 # «%speed%» → hueco y «%»
    t = re.sub(r"(%\d+|%[A-Za-z_]\w*)([?!.,])", r"\1 \2", t)     # «%1?» → hueco y «?»
    t = re.sub(r"[()\[\]«»\"“”]", " ", t)
    return [None if HUECO.match(w) else w for w in t.split()]


def patron(t):
    """Plantilla oficial → expresión regular, o None si empieza por un hueco («%1 o %2», «$MEMBER»): la guía siempre
    cita los bloques por su primera palabra. Las palabras cuentan enteras. Un hueco del medio tiene que llevar algo;
    los huecos del final pueden faltar, porque la guía a veces los omite («mostrar ícono», «iniciar sonido»)."""
    f = fichas(t)
    if not f or f[0] is None:
        return None
    ultimo = max(i for i, w in enumerate(f) if w)
    letra = lambda w, pos: re.match(r"\w", w[pos]) is not None
    rx = re.escape(f[0])
    for i in range(1, len(f)):
        w, antes = f[i], f[i - 1]
        if antes is not None:  # después de una palabra: espacio si los dos lados son letras
            sep = r"\s+" if (letra(antes, -1) and (w is None or letra(w, 0))) else r"\s*"
        else:  # después de un hueco
            sep = r"\s+" if (w is not None and letra(w, 0)) else r"\s*"
        if w is None:
            rx += f"(?:{sep}\\S.*?)" + ("?" if i > ultimo else "")
        else:
            rx += sep + re.escape(w)
    return re.compile("^" + rx + "$", re.I)


# ------------------------------------------------------------------ bloques citados en la guía
def limpia(t):
    t = re.sub(r"<[^>]+>", "", t)
    t = re.sub(r"\(V2\)", " ", t)                                 # nota de la chuleta: el bloque es de la micro:bit V2
    t = t.replace("…", " X ").replace("...", " X ")
    for icono in ("🏴", "↻", "↺", "⟨ ⟩", "●", "♥"):
        t = t.replace(icono, " X ")
    t = re.sub(r"[()\[\]«»\"“”]", " ", t)
    t = re.sub(r"\s+", " ", t).strip(" .,;")
    return t


# una negrita con un número que empieza así es texto («el cuadrado de 50 cm», «en los últimos 5 minutos»), no un bloque
PROSA = {"el", "la", "los", "las", "un", "una", "unos", "unas", "en", "de", "del", "con", "sin", "cada", "por", "para", "y", "o",
         "hasta", "desde"}


def candidatos_md(f, contexto):
    """(texto, sitio, contexto) de lo que va entre `…`, y de las negritas junto a una flecha o con un número."""
    s = (ROOT / f).read_text(encoding="utf-8")
    for m in re.finditer(r"`([^`\n]+)`|\*\*([^*\n]+)\*\*", s):
        t = m.group(1) or m.group(2)
        if m.group(2) is not None:
            cerca = s[max(0, m.start() - 4):m.start()] + s[m.end():m.end() + 4]
            primera = t.split()[0].lower() if t.split() else ""
            con_valor = re.search(r"\d|🏴|↻|↺", t) and primera not in PROSA
            if "→" not in cerca and not con_valor:
                continue
        n = s.count("\n", 0, m.start()) + 1
        yield t, f"{f}:{n}", contexto(s, m.start())


def contexto_sesiones(curso):
    """Igual que build_web: de 1º a 4º, Scratch; en 5º y 6º, MakeCode salvo las sesiones de Scratch."""
    def ctx(s, pos):
        if curso <= 4:
            return "scratch"
        cab = s.rfind("\n### ", 0, pos)
        titulo = s[cab:s.find("\n", cab + 1)] if cab >= 0 else ""
        return "scratch" if "scratch" in titulo.lower() else "makecode"
    return ctx


def contexto_guias(s, pos):
    """En la guía de herramientas solo cuentan los apartados de Scratch 3, micro:bit y Nezha."""
    cab = s.rfind("\n## ", 0, pos)
    titulo = s[cab:s.find("\n", cab + 1)].lower() if cab >= 0 else ""
    if any(w in titulo for w in ("micro:bit", "makecode", "nezha")):
        return "makecode"
    return "scratch" if "scratch 3" in titulo else None


def literales(src):
    return [m.group(2) for m in re.finditer(r"""(f?)"((?:[^"\\\n]|\\.)*)\"""", src)]


def candidatos_py():
    """Bloques dibujados en las chuletas (M20, M21), en los retos (M28) y las notas de los .sb3."""
    mat = (HERE / "materiales.py").read_text(encoding="utf-8")
    for nombre, ctx in (("m20", "scratch"), ("m21", "makecode")):
        i = mat.index(f"def {nombre}(")
        j = mat.index("\ndef ", i + 1)
        trozo = mat[i:j]
        trozo = trozo[:trozo.find("body =")] if "body =" in trozo else trozo
        cats = set(re.findall(r'\(\s*"([^"]+)",\s*(?:\[|"[a-z]+")', trozo))  # la primera cadena de cada fila es la categoría
        for t in literales(trozo):
            if t not in cats:
                yield t, f"materiales.py · {nombre.upper()}", ctx
    retos = (HERE / "retos_trimestre.py").read_text(encoding="utf-8")
    for m in re.finditer(r"\b(sb|sc|mk|mkc)\(\s*\"[a-z]+\"\s*,\s*f?\"((?:[^\"\\\n]|\\.)*)\"", retos):
        yield m.group(2), "retos_trimestre.py · M28", "scratch" if m.group(1).startswith("s") else "makecode"
    gen = (HERE / "scratch_gen.py").read_text(encoding="utf-8")
    for m in re.finditer(r"«([^»]+)»", gen):
        yield m.group(1), "scratch_gen.py · notas de los .sb3", "scratch"


FUENTES_MD = [("3_tercero.md", 3), ("4_cuarto.md", 4), ("5_quinto.md", 5), ("6_sexto.md", 6)]


def citas():
    for f, curso in FUENTES_MD:
        yield from candidatos_md(f, contexto_sesiones(curso))
    yield from candidatos_md("07_Guias_rapidas_herramientas.md", contexto_guias)
    yield from candidatos_py()


# ------------------------------------------------------------------ comprobación
OPERADOR = re.compile(r"\s(?:<|>|=|≤|≥|×|\*|/|\+|−|-|módulo)\s")
LOGICO = re.compile(r"\s(?:<|>|=|≤|≥|×|\*|/|\+|−|-|módulo|y|o)\s")


class Revisor:
    def __init__(self, datos):
        self.pats, self.prefijos, self.primeras = {}, {}, {}
        for ctx, lista in (("scratch", datos["scratch"]), ("makecode", datos["makecode"] + datos["extensiones"])):
            lista = lista + EXTRA[ctx]
            # solo las plantillas que empiezan por una palabra (fuera «(1) Piano» y demás menús numerados)
            self.pats[ctx] = [(t, p) for t in lista if (p := patron(t)) and re.match(r"[^\W\d_]|[¿¡]", fichas(t)[0])]
            self.primeras[ctx] = {fichas(t)[0].lower() for t, _ in self.pats[ctx]}
            # «número aleatorio», «radio enviar número»: el principio de un bloque, hasta su primer hueco, sirve para nombrarlo
            self.prefijos[ctx] = set()
            for t, _ in self.pats[ctx]:
                f = fichas(t)
                pre = f[:f.index(None)] if None in f else f
                if len(pre) >= 2:
                    self.prefijos[ctx].add(" ".join(pre).lower())

    def es_bloque(self, c):
        """Parece un bloque si empieza como alguno, de Scratch o de MakeCode (así se ve también el de la otra herramienta)."""
        p = c.split()
        return 2 <= len(p) <= 14 and any(p[0].lower() in s for s in self.primeras.values())

    def oficial(self, c, ctx):
        return next((o for o, p in self.pats[ctx] if p.match(c)), None) or (c.lower() if c.lower() in self.prefijos[ctx] else None)

    def revisa(self, t, ctx):
        """Devuelve (estado, detalle): «ok» con el nombre oficial, «mal» con la parte que no existe, o None si no es un bloque."""
        partes = [x for x in re.split(r"\s+(?:·|/|→)\s+", t) if x.strip()]
        if len(partes) > 1:  # varios bloques en una cita: «si … entonces · si no», «… → …»
            res = [self.revisa(x, ctx) for x in partes]
            malos = [r for r in res if r and r[0] == "mal"]
            return malos[0] if malos else (("ok", " · ".join(r[1] for r in res if r)) if any(res) else None)
        c = limpia(t)
        if not self.es_bloque(c):
            return None
        m = re.match(r"^si (.+?) entonces(?: (.+))?$", c, re.I)
        if m:  # «si puntos = 10 entonces decir ¡Has ganado!»: la condición y lo que va dentro
            cond, dentro = m.group(1), m.group(2)
            # la condición se revisa si tiene operadores o es un sensor («¿tocando…?»); si no, es una descripción
            # («si respuesta correcta entonces»)
            trozos = LOGICO.split(cond) if LOGICO.search(cond) else ([cond] if cond.startswith("¿") else [])
            for x in trozos:
                r = self.revisa(x, ctx)
                if (r and r[0] == "mal") or (r is None and x.startswith("¿")):  # lo que empieza por ¿ es un sensor
                    return r or ("mal", x)
            if dentro:  # lo de dentro: un bloque, o una descripción («entonces parar»)
                r = self.revisa(dentro, ctx)
                if r and r[0] == "mal":
                    return r
            return "ok", "si %1 entonces"
        hit = self.oficial(c, ctx)
        if hit:
            for dentro in re.findall(r"\(([^()]+)\)", t):  # un bloque dentro de otro: «mostrar número (escoger al azar de 1 a 6)»
                p = limpia(dentro).split()
                if p and p[0].lower() in self.primeras[ctx]:  # solo si empieza como un bloque de esta herramienta
                    r = self.revisa(dentro, ctx)
                    if r and r[0] == "mal":
                        return r
            return "ok", hit
        if t.rstrip().endswith(")"):  # nota final entre paréntesis: «mostrar LEDs (todas)»
            r = self.revisa(re.sub(r"\s*\([^()]*\)\s*$", "", t.rstrip()), ctx)
            if r and r[0] == "ok":
                return r
        trozos = []
        m2 = re.match(r"^si no (.+)$", c, re.I)
        if m2:  # «si no decir Impar»: la rama «si no» y lo que va dentro (un bloque o una descripción)
            r = self.revisa(m2.group(1), ctx)
            return r if r and r[0] == "mal" else ("ok", "si no" + (" · " + r[1] if r else ""))
        if OPERADOR.search(c):  # «nivel de luz < 50»: cada lado del operador
            trozos = OPERADOR.split(c)
        res = [self.revisa(x, ctx) for x in trozos]
        if trozos and not any(r and r[0] == "mal" for r in res):
            return "ok", "(compuesto) " + " · ".join(r[1] for r in res if r)
        return "mal", c


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    datos = actualizar() if "--actualizar" in sys.argv else json.loads(CACHE.read_text(encoding="utf-8"))
    rev = Revisor(datos)
    malos, buenos = {}, {}
    for t, donde, ctx in citas():
        if ctx is None or t.rstrip().endswith(":"):
            continue
        r = rev.revisa(t, ctx)
        if r is None:
            continue
        estado, detalle = r
        destino = buenos if estado == "ok" else malos
        destino.setdefault((limpia(t), ctx), [detalle, []])[1].append(donde)
    if "--todos" in sys.argv:
        for (c, ctx), (hit, _) in sorted(buenos.items()):
            print(f"  {ctx:8} {c!r:60} = {hit!r}")
    print(f"Bloques citados: {len(buenos) + len(malos)} distintos ({len(buenos)} con su nombre oficial).")
    if malos:
        print(f"\nNo existen con ese nombre ({len(malos)}):")
        for (c, ctx), (parte, donde) in sorted(malos.items()):
            sitios = sorted(set(donde))
            extra = f" (falla «{parte}»)" if parte != c else ""
            print(f"  {ctx:8} «{c}»{extra}  en {', '.join(sitios[:3])}{' …' if len(sitios) > 3 else ''}")
        sys.exit(1)
    print("Todos los bloques citados existen con ese nombre.")


if __name__ == "__main__":
    main()
