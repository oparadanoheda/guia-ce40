# Comprueba que ningún PDF del material se sale de la página (vertical ni horizontal).
# Uso: python revisar_pdfs.py [M03 M12 ...]   (sin argumentos, todos). Requiere haber generado antes los PDF.
# Imprime «OV ok» o las páginas que desbordan y cuántos píxeles.
import subprocess, sys, tempfile, time, fitz
from pathlib import Path
sys.path.insert(0, ".")
import materiales as M
T = Path(tempfile.gettempdir())
chk = """<script>(()=>{const r=[];document.querySelectorAll('.page').forEach((p,i)=>{const b=p.getBoundingClientRect().bottom;const R=p.getBoundingClientRect().right;let mx=0,mr=0;p.querySelectorAll('*').forEach(e=>{const rr=e.getBoundingClientRect();if(rr.height>0&&rr.width>0){mx=Math.max(mx,rr.bottom);mr=Math.max(mr,rr.right)}});if(mx>b+1)r.push((i+1)+':v+'+Math.round(mx-b));if(mr>R+1)r.push((i+1)+':h+'+Math.round(mr-R));});document.title='OV '+(r.join(' ')||'ok');})()</script>"""
only = set(sys.argv[1:])
for f in sorted(M.SRC.glob("M*.html")):
    if only and f.name[:3] not in only: continue
    t = f.read_text(encoding="utf-8").replace("</body>", chk + "</body>")
    tmp = T / ("ov_" + f.name); tmp.write_text(t, encoding="utf-8")
    pdf = T / ("ov_" + f.stem + ".pdf"); pdf.unlink(missing_ok=True)
    subprocess.run([M.EDGE, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={T/('ovp'+f.name[:3])}", "--no-pdf-header-footer", f"--print-to-pdf={pdf}", tmp.as_uri()], capture_output=True, timeout=120)
    for _ in range(60):
        if pdf.exists() and pdf.stat().st_size > 0: break
        time.sleep(0.5)
    time.sleep(0.5)
    print(f.name[:3], fitz.open(pdf).metadata.get("title"))
