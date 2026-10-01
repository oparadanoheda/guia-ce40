# Busca pictogramas en ARASAAC y crea hojas de contactos para elegir.
# Uso: python arasaac_buscar.py "término1" "término2" ...   -> picto/_hojas/hoja_N.png
import json, sys, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
CACHE = HERE / "picto" / "_cache"
SHEETS = HERE / "picto" / "_hojas"
CACHE.mkdir(parents=True, exist_ok=True)
SHEETS.mkdir(parents=True, exist_ok=True)


def search(term, n=6):
    url = "https://api.arasaac.org/api/pictograms/es/search/" + urllib.parse.quote(term)
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            data = json.load(r)
    except Exception:
        return []
    return [d["_id"] for d in data[:n]]


def get(pid, size=300):
    f = CACHE / f"{pid}.png"
    if not f.exists():
        url = f"https://static.arasaac.org/pictograms/{pid}/{pid}_{size}.png"
        with urllib.request.urlopen(url, timeout=20) as r:
            f.write_bytes(r.read())
    return f


def sheet(terms, name, n=7):
    cell = 150
    font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
    rows = []
    for t in terms:
        ids = search(t, n)
        rows.append((t, ids))
    W, H = 170 + n * cell, len(rows) * (cell + 22)
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    for i, (t, ids) in enumerate(rows):
        y = i * (cell + 22)
        d.text((6, y + 60), t[:22], fill="black", font=font)
        for j, pid in enumerate(ids):
            try:
                p = Image.open(get(pid)).convert("RGBA").resize((cell - 10, cell - 10))
                img.paste(p, (170 + j * cell, y), p)
            except Exception:
                pass
            d.text((170 + j * cell + 40, y + cell - 6), str(pid), fill="#c00", font=font)
    out = SHEETS / f"{name}.png"
    img.save(out)
    print(out)


if __name__ == "__main__":
    name = sys.argv[1]
    sheet(sys.argv[2:], name)
