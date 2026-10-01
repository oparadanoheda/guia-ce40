# Escribe (o reescribe) el apartado «Palabras del curso» de cada .md a partir de vocabulario.py.
# Uso: python vocab_md.py
import re
from pathlib import Path
from vocabulario import VOCAB

ROOT = Path(__file__).resolve().parent.parent
FILES = {1: "1_primero.md", 2: "2_segundo.md", 3: "3_tercero.md", 4: "4_cuarto.md", 5: "5_quinto.md", 6: "6_sexto.md"}

for c, fn in FILES.items():
    p = ROOT / fn
    s = p.read_text(encoding="utf-8")
    rows = "\n".join(f"| **{w}** | {d} | {sn} |" for w, d, sn in VOCAB[c])
    sec = (f"## Palabras del curso\n\n"
           f"Vocabulario de programación nuevo en {c}º (las palabras de cursos anteriores se siguen usando). "
           f"Está en una hoja para la pared del aula: [[M:M27|Palabras del curso]]. Los conceptos principales tienen además su póster: [[M:M26|Pósteres de conceptos]].\n\n"
           f"| Palabra | Qué significa | Sesión |\n|---|---|---|\n{rows}\n\n")
    s = re.sub(r"## Palabras del curso\n.*?(?=## )", "", s, flags=re.S)
    i = s.index("## Resumen del curso")
    s = s[:i] + sec + s[i:]
    p.write_text(s, encoding="utf-8")
    print("ok", fn, len(VOCAB[c]), "palabras")
