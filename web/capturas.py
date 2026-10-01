# Capturas de la web con Edge sin interfaz: python capturas.py hash1 hash2 ...
import subprocess, sys, time
from pathlib import Path
H = Path(__file__).resolve().parent
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT = H / "picto" / "_hojas"
page = (H / "_preview.html").as_uri()
w = 1366
for i, hs in enumerate(sys.argv[1:]):
    f = OUT / f"cap_{hs.replace('.', '_')}.png"
    f.unlink(missing_ok=True)
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--user-data-dir={H / ('.edge-cap-' + str(i))}",
                    f"--window-size={w},900", "--virtual-time-budget=4000", f"--screenshot={f}", page + "#" + hs], capture_output=True, timeout=120)
    for _ in range(40):
        if f.exists():
            break
        time.sleep(0.5)
    print(f.name, f.exists())
