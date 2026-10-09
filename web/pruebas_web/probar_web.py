# Pruebas de la web publicada (docs/index.html) en Edge sin interfaz. Necesita `websockets`.
#
#   python probar_web.py               todo lo que sigue, menos los enlaces externos
#   python probar_web.py estatico      HTML: ids repetidos, etiquetas mal cerradas, enlaces internos y archivos, emojis
#   python probar_web.py paginas       las ~190 páginas a 1366, 1024 y 375 px (móvil) y en oscuro: errores y desbordes
#   python probar_web.py herramientas  cada modo de cada herramienta con pulsaciones al azar (ordenador y móvil)
#                                      (con nombres detrás, solo esas: python probar_web.py herramientas adivina vistas)
#   python probar_web.py proyeccion    la proyección de las 128 sesiones a 1024×768 y 1366×768
#   python probar_web.py accesibilidad axe-core (WCAG 2.1 AA) en todas las páginas, en claro y en oscuro
#   python probar_web.py tablet        los retos de la tablet: todos los niveles resueltos, tres tamaños de pantalla, accesibilidad
#   python probar_web.py enlaces       responde cada enlace externo (tarda; necesita internet)
#
# Cada apartado termina con una línea «OK» o con la lista de lo que falla.
import asyncio, collections, concurrent.futures, json, re, ssl, sys, unicodedata, urllib.request
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent))
sys.stdout.reconfigure(encoding="utf-8")
from cdp import Browser  # noqa: E402
from catalogo import PROYECTABLES  # noqa: E402

DOCS = ROOT / "docs"
IDX = (DOCS / "index.html").as_uri()
AXE_URL = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js"
AXE = HERE / "axe.min.js"
fallos = []


def informe(nombre, problemas):
    if problemas:
        fallos.append(nombre)
        print(f"[{nombre}] {len(problemas)} problemas")
        for p in problemas[:40]:
            print("   ", p)
    else:
        print(f"[{nombre}] OK")


# ------------------------------------------------------------------ estático
class Parser(HTMLParser):
    VOID = set("area base br col embed hr img input link meta param source track wbr".split())
    OPT = set("p li dt dd tr td th thead tbody tfoot option optgroup colgroup caption rt rp html head body".split())

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.hrefs, self.srcs, self.stack, self.bad, self.text, self.noalt = collections.Counter(), [], [], [], [], [], 0
        self.inscript = False

    def handle_starttag(self, tag, a):
        d = dict(a)
        if "id" in d:
            self.ids[d["id"]] += 1
        if tag == "a" and "href" in d:
            self.hrefs.append(d["href"])
        if d.get("src"):
            self.srcs.append(d["src"])
        if tag == "img" and "alt" not in d:
            self.noalt += 1
        if tag in ("script", "style"):
            self.inscript = True
        if tag not in self.VOID:
            self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, a):
        d = dict(a)
        if "id" in d:
            self.ids[d["id"]] += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.inscript = False
        if tag in self.VOID:
            return
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                self.bad += [(t, pos) for t, pos in self.stack[i + 1:] if t not in self.OPT]
                del self.stack[i:]
                return
        self.bad.append((tag, self.getpos()))

    def handle_data(self, data):
        if not self.inscript:
            self.text.append(data)


def estatico():
    html = (DOCS / "index.html").read_text(encoding="utf-8")
    p = Parser()
    p.feed(html)
    prob = [f"id repetido: {k} ×{v}" for k, v in p.ids.items() if v > 1]
    prob += [f"etiqueta mal cerrada: {t} en {pos}" for t, pos in p.bad]
    for h in p.hrefs:
        if h.startswith("#") and len(h) > 1:
            base = h[1:].split(".")[0] if h.startswith("#p-") else h[1:]
            if base not in p.ids:
                prob.append(f"enlace interno roto: {h}")
    for h in p.hrefs + p.srcs:
        if not re.match(r"^(https?:|mailto:|#|data:|javascript:|blob:)", h) and not (DOCS / h.split("#")[0].split("?")[0]).exists():
            prob.append(f"archivo que no existe: {h}")
    if p.noalt:
        prob.append(f"{p.noalt} imágenes sin alt")
    texto = "".join(p.text)
    emojis = sorted({ch for ch in texto if unicodedata.category(ch) == "So" and ord(ch) >= 0x1F000})
    if emojis:
        prob.append("emojis en el texto: " + " ".join(emojis))
    for pat, que in [(r"\[\[[PMS]:", "enlace [[…]] sin convertir"), (r"\*\*\S[^*\n]{0,60}\*\*", "negrita de Markdown sin convertir"), (r"\]\(https?:", "enlace de Markdown sin convertir")]:
        for m in re.finditer(pat, texto):
            prob.append(f"{que}: «{texto[max(0, m.start() - 40):m.end() + 20].strip()}»")
    informe("estático", sorted(set(prob)))


# ------------------------------------------------------------------ páginas
CHECK = r"""(async (id)=>{ location.hash = '#'+id; await new Promise(r=>setTimeout(r, 120));
  const sec = document.getElementById(id); const vis = sec && !sec.hidden && sec.offsetParent !== null;
  const W = document.documentElement.clientWidth, over = document.documentElement.scrollWidth - W;
  let wide = [];
  if (over > 1) wide = [...sec.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect(); return r.right>W+1 && r.width>0}).slice(0,3)
     .map(e=>e.tagName.toLowerCase()+'.'+String(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className).split(' ')[0]);
  return {id, vis, over, wide};
})"""


async def paginas(b):
    prob = []
    for w, movil, oscuro in ((1366, False, False), (1024, False, False), (375, True, False), (1366, False, True)):
        await b.send("Emulation.setDeviceMetricsOverride", width=w, height=860, deviceScaleFactor=1, mobile=movil)
        await b.send("Emulation.setEmulatedMedia", features=[{"name": "prefers-color-scheme", "value": "dark" if oscuro else "light"}])
        await b.goto(IDX + "#inicio")
        await asyncio.sleep(1)
        ids = await b.js("[...document.querySelectorAll('main > section[id]')].map(s=>s.id)")
        for i in ids:
            r = await b.js(f"({CHECK})({json.dumps(i)})")
            if not r["vis"]:
                prob.append(f"{w}px: #{i} no se ve")
            if r["over"] > 1:
                prob.append(f"{w}px{' oscuro' if oscuro else ''}: #{i} se sale {r['over']} px por {r['wide']}")
        prob += [f"{w}px: consola: {e}" for e in b.errors()]
    print(f"    ({len(ids)} páginas en 4 tamaños y temas)")
    informe("páginas", prob)


# ------------------------------------------------------------------ herramientas
FUZZ = r"""(async (sel, n, seed)=>{
  let s = seed; const rnd = ()=>{ s = (s*1103515245+12345) % 2147483648; return s/2147483648; };
  const root = document.querySelector(sel); if(!root) return {err:'sin raíz '+sel, clicks:0, errs:[], over:0, raro:''};
  const errs = []; const old = window.onerror; window.onerror = (m,src,l,c)=>{ errs.push(String(m)+' @'+l+':'+c); };
  let clicks = 0;
  for (let i=0;i<n;i++){
    const c = [...root.querySelectorAll('button, [role=button], input, select, td[data-i], [data-k], svg [data-i], circle, rect, polygon')]
       .filter(e=>{ if(e.closest('a[href]')) return false; const r=e.getBoundingClientRect(); return r.width>0 && r.height>0 && !e.disabled; });
    if(!c.length) break;
    const e = c[Math.floor(rnd()*c.length)];
    try{
      if (e.tagName==='INPUT' && e.type!=='checkbox') { e.value = e.type==='text' ? ['', 'A', 'hola', '12', '-3'][Math.floor(rnd()*5)] : String(Math.floor(rnd()*60-20));
        e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); }
      else if (e.tagName==='SELECT') { e.selectedIndex = Math.floor(rnd()*e.options.length); e.dispatchEvent(new Event('change',{bubbles:true})); }
      else if (e.tagName==='INPUT') e.click();
      else { const r=e.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2;
        for (const t of ['pointerdown','mousedown','pointerup','mouseup']) e.dispatchEvent(new (t.startsWith('pointer')?PointerEvent:MouseEvent)(t,{bubbles:true,clientX:x,clientY:y}));
        e.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:x,clientY:y})); }
      clicks++;
    }catch(ex){ errs.push('pulsación: '+ex.message); }
    if (i%7===0) await new Promise(r=>setTimeout(r, 30));
  }
  await new Promise(r=>setTimeout(r, 400)); window.onerror = old;
  const m = root.innerText.match(/.{0,30}(NaN|undefined|\[object).{0,30}/);
  return {clicks, errs, over: document.documentElement.scrollWidth - document.documentElement.clientWidth, raro: m ? m[0] : ''};
})"""


SOLO = set()  # herramientas que se prueban (vacío: todas)


async def herramientas(b):
    prob, total = [], 0
    for w, movil, n in ((1366, False, 140), (375, True, 60)):
        await b.send("Emulation.setDeviceMetricsOverride", width=w, height=860, deviceScaleFactor=1, mobile=movil)
        await b.goto(IDX + "#inicio")
        await asyncio.sleep(1)
        for pid, *_r, presets in PROYECTABLES:
            if SOLO and pid not in SOLO:
                continue
            for p, _lab in presets:
                ruta = f"p-{pid}" + (f".{p}" if p else "")
                for seed in (7, 1234):
                    b.events.clear()
                    await b.js("location.hash = '#inicio'")
                    await asyncio.sleep(0.05)
                    await b.js(f"location.hash = '#{ruta}'")
                    await asyncio.sleep(0.3)
                    r = await b.js(f"({FUZZ})('#p-{pid} .pj-stage-root', {n}, {seed})")
                    total += r["clicks"]
                    cons = b.errors()
                    if r.get("err") or r["errs"] or r["over"] > 1 or r["raro"] or cons:
                        prob.append(f"{w}px #{ruta}: {r.get('err') or ''} {r['errs'][:2]} desborde={r['over']} {r['raro']} {cons[:2]}")
    print(f"    ({sum(len(t[5]) for t in PROYECTABLES if not SOLO or t[0] in SOLO)} modos, {total} pulsaciones)")
    informe("herramientas", prob)


# ------------------------------------------------------------------ proyección
PZ = r"""(async ()=>{ const out=[];
  for (const f of document.querySelectorAll('section.ficha')){ try{ location.hash='#'+f.id; await new Promise(r=>setTimeout(r,20));
      window.ProyectarSesion.open(f); let n=0, g=0; const mal=[];
      const chk=()=>{ const st=document.querySelector('.pz-stage'); const W=window.innerWidth;
        if ([...st.querySelectorAll('*')].some(e=>{const r=e.getBoundingClientRect(); return r.width>0 && r.right>W+1})) mal.push(n+': se sale por la derecha');
        const now=st.querySelector('.pz-steps li.now'); if(now){ const r=now.getBoundingClientRect(), s=st.getBoundingClientRect(); if(r.bottom>s.bottom+2||r.top<s.top-2) mal.push(n+': el paso actual no se ve'); } };
      chk();
      while(!document.querySelector('.pz-next').disabled && g++<120){ document.querySelector('.pz-next').click(); n++; await new Promise(r=>setTimeout(r,0)); chk(); }
      if (mal.length) out.push(f.id+' '+mal.slice(0,3).join(' · ')); window.ProyectarSesion.close();
    }catch(e){ out.push(f.id+' ERROR '+e); try{window.ProyectarSesion.close()}catch(_){}} }
  return out })()"""


async def proyeccion(b):
    prob = []
    for w, h in ((1024, 768), (1366, 768)):
        await b.send("Emulation.setDeviceMetricsOverride", width=w, height=h, deviceScaleFactor=1, mobile=False)
        await b.goto(IDX + "#inicio")
        await asyncio.sleep(1)
        prob += [f"{w}×{h}: {x}" for x in await b.js(PZ)]
        prob += [f"{w}×{h}: consola: {e}" for e in b.errors()]
    informe("proyección", prob)


# ------------------------------------------------------------------ accesibilidad
AX = r"""(async (id)=>{ location.hash='#'+id; await new Promise(r=>setTimeout(r,250));
  const r = await axe.run(document.getElementById(id), {runOnly:{type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']},
      rules:{'region':{enabled:false}, 'page-has-heading-one':{enabled:false}, 'landmark-one-main':{enabled:false}, 'bypass':{enabled:false}}});
  return r.violations.flatMap(v=>v.nodes.map(n=>[v.id, n.target.join(' '), (n.any[0]||n.all[0]||n.none[0]||{message:''}).message.slice(0,120)]));
})"""
# Excepción a propósito: los bloques dibujados copian los colores de Scratch y MakeCode con letra blanca, como el editor.
BLOQUES = re.compile(r"\.(blk|rp-b|rp-r|rp-ch|mov|ctl|pen|loo|log|bas|pj-sblk)\b")


async def accesibilidad(b):
    if not AXE.exists():
        AXE.write_bytes(urllib.request.urlopen(AXE_URL, timeout=60).read())
    prob = []
    for oscuro in (False, True):
        await b.send("Emulation.setDeviceMetricsOverride", width=1366, height=860, deviceScaleFactor=1, mobile=False)
        await b.send("Emulation.setEmulatedMedia", features=[{"name": "prefers-color-scheme", "value": "dark" if oscuro else "light"}])
        await b.goto(IDX + "#inicio")
        await asyncio.sleep(1)
        await b.js(AXE.read_text(encoding="utf-8") + ";1")
        ids = await b.js("[...document.querySelectorAll('main > section[id]')].map(s=>s.id)")
        agr = collections.defaultdict(list)
        for i in ids:
            for regla, sel, msg in await b.js(f"({AX})({json.dumps(i)})"):
                if regla == "color-contrast" and BLOQUES.search(sel):
                    continue
                agr[(regla, re.sub(r"#[\w-]+|:nth-child\(\d+\)", "", sel)[-70:])].append(i)
        prob += [f"{'oscuro' if oscuro else 'claro'} · {regla} · {sel} · {len(p)} páginas (p. ej. #{p[0]})" for (regla, sel), p in agr.items()]
    informe("accesibilidad", prob)


# ------------------------------------------------------------------ enlaces externos
def enlaces():
    html = (DOCS / "index.html").read_text(encoding="utf-8")
    urls = sorted(set(re.findall(r'href="(https?://[^"]+)"', html)) - {"https://fonts.googleapis.com", "https://fonts.gstatic.com"})
    urls = [u for u in urls if "fonts.g" not in u]
    ctx = ssl.create_default_context()

    def check(u):
        req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
                                                 "Accept-Language": "es-ES,es;q=0.9"})
        try:
            with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
                return u, r.status, r.geturl()
        except urllib.error.HTTPError as e:
            return u, e.code, ""
        except Exception as e:
            return u, "sin respuesta (" + type(e).__name__ + ")", ""

    with concurrent.futures.ThreadPoolExecutor(12) as ex:
        res = list(ex.map(check, urls))
    print(f"    ({len(urls)} enlaces externos)")
    informe("enlaces", [f"{c} {u}" for u, c, _ in res if c != 200] +
            [f"redirige: {u} → {f}" for u, c, f in res if c == 200 and f and f.rstrip("/") != u.rstrip("/") and "?" not in u])


# ------------------------------------------------------------------ retos para la tablet (docs/tablet/)
TAB_JUEGA = r"""(async (act, nivel)=>{
  const P = RETOS.prueba, B = t=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===t);
  const T = k=>[...document.querySelectorAll('.tecla')].find(b=>b.textContent===k).click();
  const escribe = n=>{ String(n).split('').forEach(ch=>T(ch==='-'?'−':ch)); T('Comprobar'); };
  const est = ()=>document.querySelector('.estado').textContent;
  location.hash = '#' + act + '/' + nivel; await new Promise(r=>setTimeout(r,150));
  if (act === 'adivina') { const N = [20,100,1000][nivel-1]; let lo=1, hi=N, k=0;
    while (k<25) { const g=Math.floor((lo+hi)/2); k++; escribe(g); const t=est(); if (t.startsWith('¡Es')) return [k, t]; if (t.includes('más grande')) lo=g+1; else hi=g-1; } return [k, est()]; }
  for (let i=0;i<8;i++) {
    if (act === 'coordenadas') { const o=P.obj;
      if (document.querySelectorAll('.casilla').length) { escribe(o[0]); document.querySelectorAll('.casilla')[1].click(); String(o[1]).split('').forEach(ch=>T(ch==='-'?'−':ch)); T('Comprobar'); }
      else { const svg=document.querySelector('.dibujo'), vb=svg.viewBox.baseVal, pt=svg.createSVGPoint();
        if (vb.x < 0) { pt.x=o[0]; pt.y=-o[1]; } else { const lv=[[0,6],[0,6],[-5,5],[-5,5]][nivel-1]; pt.x=46+(o[0]-lv[0])*56; pt.y=46+(lv[1]-o[1])*56; }
        const s=pt.matrixTransform(svg.getScreenCTM()); svg.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:s.x,clientY:s.y})); } }
    else if (act === 'variables') escribe(P.valor);
    else if (act === 'cubos') { if (nivel < 3) escribe(P.H.flat().reduce((a,b)=>a+b,0)); else document.querySelectorAll('.op')[P.buena].click(); }
    if (i < 7) B('Siguiente').click();
  }
  return [8, est()];
})"""


async def tablet(b):
    prob = []
    url = (DOCS / "tablet" / "index.html").as_uri()
    for w, hh in ((1024, 768), (768, 1024), (390, 844)):
        await b.send("Emulation.setDeviceMetricsOverride", width=w, height=hh, deviceScaleFactor=1, mobile=True)
        await b.goto(url)
        await asyncio.sleep(.5)
        await b.js("try{localStorage.clear();sessionStorage.setItem('ce40-tablet-entrada','1')}catch(e){}; 1")
        await b.goto(url)
        await asyncio.sleep(.5)
        refs = await b.js("RETOS.NIV_ROBOT.map((n,i)=>{const s=RETOS.simula(n,RETOS.leeRef(n.ref)); return s.llega && !s.choque})")
        prob += [f"robot nivel {i + 1}: la solución de referencia no llega" for i, ok in enumerate(refs) if not ok]
        for act, niveles in (("coordenadas", 5), ("variables", 4), ("cubos", 3), ("adivina", 3)):
            for nv in range(1, niveles + 1):
                n, t = await b.js(f"({TAB_JUEGA})({json.dumps(act)}, {nv})")
                bien = t.startswith("8 de 8") if act != "adivina" else (t.startswith("¡Es") and n <= [5, 7, 10][nv - 1])
                if not bien:
                    prob.append(f"{w}px {act} {nv}: {t[:80]}")
                over = await b.js("document.documentElement.scrollWidth - document.documentElement.clientWidth")
                if over > 1:
                    prob.append(f"{w}px {act} {nv}: se sale {over} px")
        for k in range(1, 11):
            await b.js(f"location.hash='#robot/{k}'")
            await asyncio.sleep(.08)
        # con el teclado del ordenador: el robot con las flechas y una respuesta con números y Enter
        async def tecla(k):
            cod = {"ArrowUp": 38, "ArrowLeft": 37, "ArrowRight": 39, "Enter": 13}.get(k, ord(k) if len(k) == 1 else 0)
            for t in ("keyDown", "keyUp"):
                await b.send("Input.dispatchKeyEvent", type=t, key=k, code=k if len(k) > 1 else "Digit" + k, windowsVirtualKeyCode=cod, text=k if (t == "keyDown" and len(k) == 1) else "")
        await b.js("location.hash='#robot/2'; document.activeElement && document.activeElement.blur(); 1")
        await asyncio.sleep(.2)
        for k in ("ArrowUp", "ArrowUp", "ArrowRight", "ArrowUp", "ArrowUp", "Enter"):
            await tecla(k)
        await asyncio.sleep(3.5)
        t = await b.js("document.querySelector('.estado').textContent")
        if not t.startswith("¡Llega"):
            prob.append(f"{w}px: el robot con el teclado no llega: {t[:60]}")
        await b.js("location.hash='#variables/1'; document.activeElement && document.activeElement.blur(); 1")
        await asyncio.sleep(.2)
        for ch in str(await b.js("RETOS.prueba.valor")):
            await tecla(ch)
        await tecla("Enter")
        t = await b.js("document.querySelector('.estado').textContent")
        if not t.startswith("¡Muy bien"):
            prob.append(f"{w}px: la respuesta con el teclado no funciona: {t[:60]}")
        prob += [f"{w}px: consola: {e}" for e in b.errors()]
    if not AXE.exists():
        AXE.write_bytes(urllib.request.urlopen(AXE_URL, timeout=60).read())
    await b.send("Emulation.setDeviceMetricsOverride", width=1024, height=768, deviceScaleFactor=1, mobile=True)
    await b.goto(url)
    await asyncio.sleep(.5)
    await b.js(AXE.read_text(encoding="utf-8") + ";1")
    for r in ("", "robot/4", "coordenadas/2", "variables/3", "cubos/3", "adivina/2"):
        vs = await b.js(f"""(async()=>{{ location.hash='#{r}'; await new Promise(x=>setTimeout(x,250));
          const res = await axe.run(document, {{runOnly:{{type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}}});
          return res.violations.flatMap(v=>v.nodes.map(n=>v.id+' · '+n.target.join(' ')))}})()""")
        # los bloques dibujados de «¿Cuánto vale?» (.b, .r, .c-cab) son la misma excepción: colores del editor con letra blanca
        prob += [f"accesibilidad #{r}: {v}" for v in vs if not re.search(r"\.(?:b|r|c-cab)(?![\w-])", v)]
    informe("tablet", prob)


async def navegador(partes):
    async with Browser(port=9480, w=1366, h=860) as b:
        for nombre, fn in (("paginas", paginas), ("herramientas", herramientas), ("proyeccion", proyeccion), ("accesibilidad", accesibilidad), ("tablet", tablet)):
            if nombre in partes:
                await fn(b)


def main():
    PARTES = ("estatico", "paginas", "herramientas", "proyeccion", "accesibilidad", "tablet", "enlaces")
    partes = [a for a in sys.argv[1:] if a in PARTES] or list(PARTES[:6])
    SOLO.update(a for a in sys.argv[1:] if a not in PARTES)
    if "estatico" in partes:
        estatico()
    if set(partes) & {"paginas", "herramientas", "proyeccion", "accesibilidad", "tablet"}:
        asyncio.run(navegador(partes))
    if "enlaces" in partes:
        enlaces()
    print("\nRESULTADO:", "todo bien" if not fallos else "revisar " + ", ".join(fallos))
    sys.exit(1 if fallos else 0)


if __name__ == "__main__":
    main()
