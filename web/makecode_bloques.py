# Convierte main.ts en bloques con el propio MakeCode y guarda el resultado en makecode_bloques/*.blocks.
# Uso: python makecode_bloques.py [nombre ...]   (después, python makecode_gen.py)
# Necesita internet y Microsoft Edge. Abre makecode.microbit.org sin interfaz, importa cada proyecto (solo con
# main.ts), pasa a la vista de bloques y lo guarda con ?saveblocks=1, que descarga main.blocks.
# Si el editor no puede convertir algo a bloques, sale como bloque gris «typescript»: el script lo avisa.
import asyncio
import json
import shutil
import sys
import tempfile
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import makecode_gen as G  # noqa: E402

try:
    import websockets  # noqa: F401
except ImportError:
    sys.exit("Falta el paquete websockets: pip install websockets")

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
URL = "https://makecode.microbit.org/?lang=es-ES&saveblocks=1#editor"

DROP = """(async (name, text) => {
  const f = new File([text], name, {type: 'application/octet-stream'});
  const dt = new DataTransfer(); dt.items.add(f);
  document.body.dispatchEvent(new DragEvent('drop', {dataTransfer: dt, bubbles: true, cancelable: true}));
  return 'ok';
})(%s, %s)"""
NAME = "(document.querySelector('#fileNameInput2') || document.querySelector('input[aria-label*=\"nombre\" i]') || {}).value || ''"
CLICK_BLOCKS = """(() => { const e = [...document.querySelectorAll('[role=tab], [role=menuitem], [role=button], button, a')]
  .find(x => x.textContent.trim() === 'Bloques'); if (e) { e.click(); return true } return false })()"""
CLICK_SAVE = """(() => { const e = document.querySelector('button.save-editor-button, [aria-label="Guardar"], [title="Guardar"]');
  if (e) { e.click(); return true } return false })()"""


class Edge:
    def __init__(self, port, down):
        self.port, self.down = port, down

    async def __aenter__(self):
        import subprocess
        import urllib.request
        import websockets
        self.prof = Path(tempfile.mkdtemp(prefix="mk-edge-"))
        self.proc = subprocess.Popen([EDGE, "--headless=new", "--disable-gpu", "--no-first-run", f"--remote-debugging-port={self.port}",
                                      f"--user-data-dir={self.prof}", "--window-size=1400,900", "about:blank"])
        for _ in range(100):
            try:
                tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{self.port}/json"))
                page = [t for t in tabs if t["type"] == "page"][0]
                break
            except Exception:
                time.sleep(0.1)
        self.ws = await websockets.connect(page["webSocketDebuggerUrl"], max_size=2**28)
        self.n = 0
        await self.send("Page.enable")
        await self.send("Emulation.setDeviceMetricsOverride", width=1400, height=900, deviceScaleFactor=1, mobile=False)
        await self.send("Page.setDownloadBehavior", behavior="allow", downloadPath=str(self.down))
        return self

    async def editor_listo(self, intentos=3):
        """Abre MakeCode y espera al editor; si se queda en la pantalla de carga, recarga."""
        for _ in range(intentos):
            await self.send("Page.navigate", url=URL)
            for _ in range(180):
                await asyncio.sleep(1)
                if await self.js(CLICK_BLOCKS.replace("e.click(); return true", "return true")):
                    await asyncio.sleep(3)
                    return True
        return False

    async def send(self, method, **params):
        self.n += 1
        mid = self.n
        await self.ws.send(json.dumps({"id": mid, "method": method, "params": params}))
        while True:
            msg = json.loads(await asyncio.wait_for(self.ws.recv(), 60))
            if msg.get("id") == mid:
                return msg.get("result", {})

    async def js(self, expr):
        r = await self.send("Runtime.evaluate", expression=expr, awaitPromise=True, returnByValue=True)
        return r.get("result", {}).get("value")

    async def __aexit__(self, *a):
        await self.ws.close()
        self.proc.kill()
        shutil.rmtree(self.prof, ignore_errors=True)


async def main(solo):
    G.BLOQUES.mkdir(exist_ok=True)
    down = Path(tempfile.mkdtemp(prefix="mk-blocks-"))
    proyectos = [p for p in G.PROYECTOS if not solo or any(x in p[0] for x in solo)]
    async with Edge(9391, down) as b:
        if not await b.editor_listo():
            sys.exit("MakeCode no ha cargado: comprueba la conexión a internet")
        print("editor listo", flush=True)
        for nombre, titulo, sesion, deps, ts in proyectos:
            # el proyecto solo con main.ts (sin bloques todavía)
            data = G.proyecto(nombre, titulo, sesion, deps, ts)
            files = json.loads(data["source"])
            files["main.blocks"] = ""
            data["source"] = json.dumps(files, ensure_ascii=False)
            text = json.dumps(data, ensure_ascii=True)
            await b.js(DROP % (json.dumps(nombre + ".mkcd"), json.dumps(text)))
            for _ in range(60):
                await asyncio.sleep(1)
                if (await b.js(NAME)) == titulo:
                    break
            await asyncio.sleep(4)
            await b.js(CLICK_BLOCKS)
            await asyncio.sleep(5)
            antes = set(down.glob("*.blocks"))
            ok = await b.js(CLICK_SAVE)
            nuevo = None
            for _ in range(30):
                await asyncio.sleep(0.5)
                nuevos = [f for f in down.glob("*.blocks") if f not in antes]
                if nuevos:
                    nuevo = nuevos[0]
                    break
            if not nuevo:
                print("SIN DESCARGA", nombre, "(botón guardar:", ok, ")", flush=True)
                continue
            time.sleep(0.5)
            xml = nuevo.read_text(encoding="utf-8")
            gris = xml.count('type="typescript_statement"') + xml.count('type="typescript_expression"')
            (G.BLOQUES / f"{nombre}.blocks").write_text(xml, encoding="utf-8")
            print(nombre.ljust(36), f"{xml.count('<block '):3} bloques", "· BLOQUES GRISES: %d" % gris if gris else "", flush=True)
    shutil.rmtree(down, ignore_errors=True)


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1:]))
