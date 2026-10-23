# «Material listo para imprimir» con miniaturas: qué página de cada PDF usa cada sesión, y su imagen.
# Lee la cabecera de cada página de los PDF (título, «Cursos:» y «Se usa en:») y elige, para cada material que
# enlaza una sesión, la página que le toca:
#   1. la que dice la ficha: «(hoja 2)», «(nivel 1)»; en M26, el póster del concepto: «Póster «Bucle»»;
#   2. la que se llama igual que el enlace;
#   3. la que cita la sesión en «Se usa en»;
#   4. la que más se parece al enlace y es del curso de la sesión.
# Las páginas «Para el docente» (soluciones) solo salen si se piden con su número.
# Las miniaturas (JPEG) se crean en materiales/min/ la primera vez y cuando cambia el PDF.
import re
import unicodedata
from pathlib import Path

import fitz

HERE = Path(__file__).resolve().parent
PDFS = HERE / "materiales"
MIN = PDFS / "min"
ANCHO = 160  # px de las miniaturas (en la sesión y en la galería de material se ven a unos 60-80 px)
# Elección a mano cuando la cabecera no basta: (sesión, material) → página
A_MANO = {
    ("c1-s12", "M03"): 2,  # el bloque REPITE está en la hoja de apariencia y control
    ("c1-s10", "M06"): 1, ("c2-s1", "M06"): 1,  # «Tablero y fichas»: se abre en el tablero
}


def _n(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(ch for ch in s if unicodedata.category(ch) != "Mn")


def _palabras(s):
    return {w for w in re.findall(r"[a-z0-9]+", _n(s)) if len(w) >= 3}


def _usos(texto):
    """«1º S10 a S15 y S19 · 2º S10, S18» → {(1, 10), …, (1, 15), (1, 19), (2, 10), (2, 18)}"""
    out = set()
    for parte in texto.split("·"):
        m = re.match(r"\s*(\d)º\s+(.*)", parte)
        if not m:
            continue
        c, resto = int(m.group(1)), m.group(2)
        for a, b in re.findall(r"S(\d+) a S(\d+)", resto):
            out |= {(c, n) for n in range(int(a), int(b) + 1)}
        out |= {(c, int(n)) for n in re.findall(r"S(\d+)", resto)}
    return out


def _cursos(texto):
    """«1º a 4º» → {1, 2, 3, 4}; «1º, 2º y 3º» → {1, 2, 3}; «6º (también 5º)» → {5, 6}"""
    m = re.match(r"\s*(\d)º a (\d)º", texto)
    if m:
        return set(range(int(m.group(1)), int(m.group(2)) + 1))
    return {int(x) for x in re.findall(r"(\d)º", texto)}


_CACHE = {}


def pdf(code):
    return next(PDFS.glob(f"{code}-*.pdf"))


def paginas(code):
    """Las páginas del PDF con su título, cursos, sesiones y si son para el docente."""
    if code not in _CACHE:
        pags = []
        for pg in fitz.open(pdf(code)):
            lineas = [l.strip() for l in pg.get_text().split("\n") if l.strip()]
            cab = lineas[0].startswith("CÓDIGO ESCUELA 4.0")
            cursos = next((l[7:] for l in lineas if l.startswith("Cursos:")), "")
            usa = next((l[10:] for l in lineas if l.startswith("Se usa en:")), "")
            pags.append({"titulo": lineas[1] if cab else lineas[0].capitalize(), "cursos": _cursos(cursos),
                         "usos": _usos(usa), "docente": usa.strip() == "Para el docente"})
        _CACHE[code] = pags
    return _CACHE[code]


def pagina(code, etiqueta, pista="", curso=0, num=0):
    """La página (desde 1) que usa la sesión `curso`º S`num` del material `code`, enlazado como `etiqueta` y con `pista`."""
    pags = paginas(code)
    if (f"c{curso}-s{num}", code) in A_MANO:
        return A_MANO[(f"c{curso}-s{num}", code)]
    if len(pags) == 1:
        return 1
    m = re.search(r"\b(?:hojas?|nivel)\s+(\d+)", _n(pista + " " + etiqueta))
    if m and 1 <= int(m.group(1)) <= len(pags):
        return int(m.group(1))
    m = re.search(r"«(.+?)»", etiqueta)
    if code == "M26" and m:
        return next((i for i, p in enumerate(pags, 1) if _n(p["titulo"]) == _n(m.group(1))), 1)
    pal = _palabras(etiqueta)

    def nota(ip):
        i, p = ip
        s = 0
        if _n(p["titulo"]) == _n(etiqueta):
            s += 50
        if (curso, num) in p["usos"]:
            s += 20
        if pal:
            s += 10 * len(pal & _palabras(p["titulo"])) / len(pal)
        if curso in p["cursos"]:
            s += 5
        if p["docente"]:
            s -= 30
        return (s, -i)
    return max(enumerate(pags, 1), key=nota)[0]


def miniatura(code, pag=1):
    """Ruta (relativa a la web) de la miniatura de la página `pag`; la crea si no existe o si el PDF es más nuevo."""
    nombre = f"{code}-{pag}.jpg"
    out = MIN / nombre
    src = pdf(code)
    if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
        MIN.mkdir(exist_ok=True)
        pg = fitz.open(src)[pag - 1]
        z = ANCHO / pg.rect.width
        pg.get_pixmap(matrix=fitz.Matrix(z, z), alpha=False).save(out, jpg_quality=80)
    return f"materiales/min/{nombre}"


def piezas(texto):
    """La línea «Material listo» en piezas: [(código, etiqueta, pista)]; el texto sin enlace va con código ""."""
    out, pos = [], 0

    def entre(raw):
        # lo que hay entre dos enlaces: lo pegado al enlace anterior es su aclaración («(hoja 2)»);
        # lo que va tras « · » es otro texto suelto («normas de uso… (ver Recursos oficiales)»)
        trozos = raw.split("·")
        if out and out[-1][0]:
            out[-1] = out[-1][:2] + (trozos[0].strip().strip("()").strip(),)
            trozos = trozos[1:]
        out.extend(("", t.strip(), "") for t in trozos if t.strip())
    for m in re.finditer(r"\[\[M:(M\d\d)\|([^\]]+)\]\]", texto):
        entre(texto[pos:m.start()])
        out.append((m.group(1), m.group(2), ""))
        pos = m.end()
    entre(texto[pos:])
    return out
