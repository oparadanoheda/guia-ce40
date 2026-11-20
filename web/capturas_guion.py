# Capturas de las sesiones con guion (ficha y proyección) con Edge sin interfaz, sobre web/_preview.html.
# Uso (tras build_web.py): python capturas_guion.py c6-s1 c6-s2   ->  web/picto/_hojas/g_*.png
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
WEB = HERE
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT = HERE / "picto" / "_hojas"
OUT.mkdir(exist_ok=True)
# una copia con un gancho: ?pz=1&opt=0 abre la proyección en esa pantalla; ?tab=1 elige la propuesta en la ficha
GANCHO = """<script>(function(){var q=location.search,m=/pz=(\\d)/.exec(q),o=/opt=(\\d)/.exec(q),x=/extra=(\\w+)/.exec(q);
setTimeout(function(){var s=document.getElementById(location.hash.slice(1));if(!s)return;
var t=s.querySelectorAll('.p-tabs [role=tab]');if(o&&t[+o[1]])t[+o[1]].click();
if(/abre=1/.test(q))s.querySelectorAll('details').forEach(function(d){d.open=true});
if(m){window.ProyectarSesion.open(s,+m[1]);
if(x){document.querySelector('.pz-resbtn').click();Array.prototype.forEach.call(document.querySelectorAll('.pz-reslist button'),function(b){if(b.textContent.indexOf(decodeURIComponent(x[1]))===0)b.click()});}}
},250);})();</script>"""
(WEB / "_cap.html").write_text((WEB / "_preview.html").read_text(encoding="utf-8") + GANCHO, encoding="utf-8")
base = (WEB / "_cap.html").as_uri()


def toma(nombre, query, sid, w, h):
    f = OUT / f"{nombre}.png"
    f.unlink(missing_ok=True)
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--user-data-dir={Path.home() / 'AppData/Local/Temp/opencode/edge-gq'}",
                    f"--window-size={w},{h}", "--virtual-time-budget=5000", f"--screenshot={f}", f"{base}{query}#{sid}"], capture_output=True, timeout=120)
    for _ in range(40):
        if f.exists():
            break
        time.sleep(0.5)
    print(f.name, f.exists())


for sid in sys.argv[1:]:
    n = sid.replace("c", "").replace("-s", "S")
    toma(f"g_{n}_ficha", "", sid, 1366, 2700)
    toma(f"g_{n}_hoy", "?pz=0", sid, 1366, 768)
    toma(f"g_{n}_mision", "?pz=1", sid, 1366, 768)
    toma(f"g_{n}_mision_1024", "?pz=1", sid, 1024, 768)
    toma(f"g_{n}_cierre", "?pz=2", sid, 1366, 768)
