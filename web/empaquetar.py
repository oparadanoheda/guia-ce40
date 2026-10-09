# Prepara la guía para distribuirla fuera de Claude.
# Uso: python empaquetar.py
#   -> ../Guia_CE40_2026-27_web.zip        (aula virtual de EducaMadrid, carpeta compartida, USB)
#   -> ../docs/                             (la web que publica GitHub Pages desde el repositorio)
import shutil
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "Guia_CE40_2026-27_web.zip"
GH = HERE.parent / "docs"

LEEME = """GUÍA DIDÁCTICA · CÓDIGO ESCUELA 4.0 · PRIMARIA · 2026-2027
Versión 1.0 · octubre de 2026

Cómo abrirla
- Con conexión o sin ella: descomprime la carpeta y abre index.html con doble clic
  (mejor con Chrome, Edge o Firefox).
- Los PDF del material imprimible están en la carpeta «materiales».
- Los proyectos de Scratch están en «materiales/scratch». Se abren en Scratch con
  Archivo > Load from your computer (esa opción sale en inglés).
- Los proyectos de MakeCode (micro:bit y Nezha) están en «materiales/makecode». Se abren
  en makecode.microbit.org con Importar > Importar archivo, o arrastrándolos al editor.
- Los vídeos de conceptos están en «videos» y se ven desde la guía (Para proyectar).
- Sin internet funciona todo menos los enlaces a webs externas (EducaMadrid,
  Scratch online…); el tipo de letra cambia, pero el contenido es el mismo.

No cambies los nombres de los archivos ni de las carpetas: la guía los enlaza.

Pictogramas: Sergio Palao. Origen: ARASAAC (arasaac.org). Licencia: CC BY-NC-SA.
Propiedad: Gobierno de Aragón.
"""

README = """# Guía didáctica · Código Escuela 4.0 · Primaria · 2026-2027

Programación de Código Escuela 4.0 para 1º a 6º de Primaria, integrada en el área de Matemáticas:
128 sesiones con opciones de actividad, herramientas para la pizarra digital, material imprimible en PDF
y proyectos de Scratch y de MakeCode. Versión 1.0 (octubre de 2026).

**Para abrir la guía**, usa la dirección de GitHub Pages de este repositorio
(Settings › Pages), no esta página.

- `index.html`: la guía completa (un solo archivo).
- `materiales/`: material imprimible en PDF (M01-M28).
- `materiales/scratch/`: proyectos de Scratch (.sb3).
- `materiales/makecode/`: proyectos de MakeCode para micro:bit y Nezha (.mkcd).
- `videos/`: vídeos animados de conceptos (HTML) y sus miniaturas.

Pictogramas: Sergio Palao. Origen: ARASAAC (arasaac.org). Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón.
Uso educativo y no comercial.
"""


def page(noindex=False):
    """La guía como documento HTML completo (la web de Claude añade esta cabecera por su cuenta; fuera de Claude hace falta)."""
    body = (HERE / "programacion_CE40.html").read_text(encoding="utf-8")
    head = ('<!doctype html>\n<html lang="es">\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n')
    if noindex:
        head += '<meta name="robots" content="noindex, nofollow">\n'
    return head + body


def files():
    out = [(p, f"materiales/{p.name}") for p in sorted((HERE / "materiales").glob("M*.pdf"))]
    out += [(p, f"materiales/scratch/{p.name}") for p in sorted((HERE / "materiales" / "scratch").glob("*.sb3"))]
    out += [(p, f"materiales/makecode/{p.name}") for p in sorted((HERE / "materiales" / "makecode").glob("*.mkcd"))]
    out += [(p, f"videos/{p.name}") for p in sorted((HERE / "videos").glob("anim-*.html"))]
    out += [(p, f"videos/img/{p.name}") for p in sorted((HERE / "videos" / "img").glob("*.jpg"))]
    return out


def make_zip():
    OUT.unlink(missing_ok=True)
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("index.html", page())
        for src, arc in files():
            z.write(src, arc)
        z.writestr("LEEME.txt", LEEME.replace("\n", "\r\n"))
    print(OUT.name, len(files()) + 2, "archivos,", round(OUT.stat().st_size / 1e6, 1), "MB")


def make_github():
    if GH.exists():
        shutil.rmtree(GH)
    (GH / "materiales" / "scratch").mkdir(parents=True)
    (GH / "materiales" / "makecode").mkdir(parents=True)
    (GH / "videos" / "img").mkdir(parents=True)
    (GH / "index.html").write_text(page(noindex=True), encoding="utf-8")
    for src, arc in files():
        shutil.copyfile(src, GH / arc)
    n = sum(1 for p in GH.rglob("*") if p.is_file())
    size = sum(p.stat().st_size for p in GH.rglob("*") if p.is_file())
    print("docs/ (web publicada):", n, "archivos,", round(size / 1e6, 1), "MB")


if __name__ == "__main__":
    make_zip()
    make_github()
