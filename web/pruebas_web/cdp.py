# Pequeño cliente CDP para Edge sin interfaz: abre una página, evalúa JS y hace capturas.
import asyncio, base64, json, subprocess, time, urllib.request
from pathlib import Path
import websockets

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
HERE = Path(__file__).resolve().parent


class Browser:
    def __init__(self, port=9333, w=1920, h=1080):
        self.port, self.w, self.h = port, w, h

    async def __aenter__(self):
        prof = HERE / f".edge-{self.port}"
        self.proc = subprocess.Popen([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                                      f"--remote-debugging-port={self.port}", f"--user-data-dir={prof}",
                                      "--force-prefers-no-reduced-motion", "--autoplay-policy=no-user-gesture-required", "--allow-file-access-from-files",
                                      f"--window-size={self.w},{self.h}", "about:blank"])
        for _ in range(100):
            try:
                tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{self.port}/json"))
                page = [t for t in tabs if t["type"] == "page"][0]
                break
            except Exception:
                time.sleep(0.1)
        self.ws = await websockets.connect(page["webSocketDebuggerUrl"], max_size=2**28)
        self.id = 0
        self.pending = {}
        self.events = []
        self.reader = asyncio.create_task(self._read())
        await self.send("Runtime.enable")
        await self.send("Page.enable")
        await self.send("Log.enable")
        await self.send("Network.enable")
        await self.send("Network.setCacheDisabled", cacheDisabled=True)
        await self.send("Emulation.setDeviceMetricsOverride", width=self.w, height=self.h, deviceScaleFactor=1, mobile=False)
        await self.send("Emulation.setEmulatedMedia", features=[{"name": "prefers-reduced-motion", "value": "no-preference"}])
        return self

    async def _read(self):
        async for msg in self.ws:
            m = json.loads(msg)
            if "id" in m and m["id"] in self.pending:
                self.pending.pop(m["id"]).set_result(m)
            elif "method" in m:
                self.events.append(m)

    async def send(self, method, **params):
        self.id += 1
        fut = asyncio.get_event_loop().create_future()
        self.pending[self.id] = fut
        await self.ws.send(json.dumps({"id": self.id, "method": method, "params": params}))
        r = await asyncio.wait_for(fut, 60)
        if "error" in r:
            raise RuntimeError(r["error"])
        return r["result"]

    async def goto(self, url):
        self.events.clear()
        await self.send("Page.navigate", url=url)
        for _ in range(200):
            if any(e["method"] == "Page.loadEventFired" for e in self.events):
                break
            await asyncio.sleep(0.05)
        await asyncio.sleep(0.3)

    async def js(self, expr):
        r = await self.send("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True)
        if "exceptionDetails" in r:
            raise RuntimeError(r["exceptionDetails"].get("exception", {}).get("description") or r["exceptionDetails"])
        return r["result"].get("value")

    async def shot(self, path, fmt="png", quality=None):
        p = {"format": fmt}
        if quality:
            p["quality"] = quality
        r = await self.send("Page.captureScreenshot", **p)
        Path(path).write_bytes(base64.b64decode(r["data"]))

    def errors(self):
        out = []
        for e in self.events:
            if e["method"] == "Runtime.exceptionThrown":
                d = e["params"]["exceptionDetails"]
                out.append(d.get("exception", {}).get("description") or d.get("text"))
            elif e["method"] == "Runtime.consoleAPICalled" and e["params"]["type"] in ("error", "warning"):
                out.append(" ".join(str(a.get("value")) for a in e["params"]["args"]))
            elif e["method"] == "Log.entryAdded" and e["params"]["entry"]["level"] == "error":
                out.append(e["params"]["entry"]["text"])
        return out

    async def __aexit__(self, *a):
        try:
            await asyncio.wait_for(self.ws.send(json.dumps({"id": 999999, "method": "Browser.close"})), 3)
            await asyncio.sleep(0.3)
        except Exception:
            pass
        self.reader.cancel()
        await self.ws.close()
        subprocess.run(["taskkill", "/T", "/F", "/PID", str(self.proc.pid)], capture_output=True)
