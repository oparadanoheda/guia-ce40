# Miniaturas de los vídeos animados para la web: un fotograma de cada vídeo, sin subtítulos.
# Uso: python videos_miniaturas.py   ->  videos/img/<id>.jpg (640 × 360)
# Necesita Microsoft Edge y los paquetes websockets y Pillow.
import asyncio
import base64
import io
import json
import subprocess
import time
import urllib.request
from pathlib import Path

import websockets
from PIL import Image

from videos import VIDEOS

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
HERE = Path(__file__).resolve().parent
SRC = HERE / "videos"
OUT = SRC / "img"
PORT = 9351


async def main():
    OUT.mkdir(exist_ok=True)
    proc = subprocess.Popen([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                             f"--remote-debugging-port={PORT}", f"--user-data-dir={HERE / '.edge-miniaturas'}",
                             "--window-size=1920,1080", "about:blank"])
    try:
        for _ in range(100):
            try:
                tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json"))
                ws_url = [t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"]
                break
            except Exception:
                time.sleep(0.1)
        async with websockets.connect(ws_url, max_size=2**27) as ws:
            n = 0

            async def send(method, **params):
                nonlocal n
                n += 1
                await ws.send(json.dumps({"id": n, "method": method, "params": params}))
                while True:
                    m = json.loads(await ws.recv())
                    if m.get("id") == n:
                        return m.get("result", {})

            async def js(expr):
                return (await send("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True)).get("result", {}).get("value")

            await send("Emulation.setDeviceMetricsOverride", width=1920, height=1080, deviceScaleFactor=1, mobile=False)
            await send("Emulation.setEmulatedMedia", features=[{"name": "prefers-reduced-motion", "value": "no-preference"}])
            for vid, fname, *_rest, t, _ in VIDEOS:
                await send("Page.navigate", url=(SRC / fname).as_uri() + "?export=1")
                for _ in range(100):
                    if await js("!!(window.ANIM && document.readyState === 'complete')"):
                        break
                    await asyncio.sleep(0.05)
                await js(f"ANIM.seek({t}); document.getElementById('sub').style.display = 'none';"
                         "new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))")
                shot = await send("Page.captureScreenshot", format="png")
                im = Image.open(io.BytesIO(base64.b64decode(shot["data"]))).convert("RGB").resize((640, 360), Image.LANCZOS)
                im.save(OUT / f"{vid}.jpg", quality=84, optimize=True)
                print(vid, (OUT / f"{vid}.jpg").stat().st_size // 1024, "KB")
    finally:
        proc.terminate()


if __name__ == "__main__":
    asyncio.run(main())
