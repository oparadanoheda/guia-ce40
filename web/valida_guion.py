# Comprueba las sesiones con guion de un curso sin generar toda la web: python valida_guion.py c3
# Lee el .md del curso, monta la ficha y el tablero de cada sesión y avisa de lo que falta
# (fases que no suman 45 minutos, tablero que no existe o no coincide con las propuestas, enlaces que no existen…).
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
import build_web as B  # noqa: E402

for cid in sys.argv[1:] or [c[0] for c in B.COURSES]:
    c = B.parse_course(*next(x for x in B.COURSES if x[0] == cid))
    flat = [s for t in c["terms"] for s in t["sessions"]]
    con = []
    for i, s in enumerate(flat):
        # build_web.py se para si una sesión no tiene guion o si le queda «Prepara antes» o «Pasos» del formato antiguo
        h = B.render_session(c, s, flat[i - 1] if i else None, flat[i + 1] if i + 1 < len(flat) else None, i + 1)
        con.append(f'S{s["num"]}')
        suelto = re.findall(r"\[\[[A-Z]:[^\]]*\]\]", h)
        if suelto:
            raise SystemExit(f'{s["id"]}: enlaces sin resolver: {", ".join(sorted(set(suelto)))}')
        for k in ("hoy", "necesitas", "logro", "antes", "key"):
            if not s.get(k):
                raise SystemExit(f'{s["id"]}: falta «{ {"hoy": "Hoy", "necesitas": "Necesitas", "logro": "Lo han conseguido si", "antes": "Antes de la clase", "key": "Frase clave"}[k] }»')
        if s["intro"]:
            print(f'  aviso · {s["id"]}: hay texto suelto antes del guion: {s["intro"][0][:60]}…')
    print(f'{c["num"]}: {len(con)} de {len(flat)} sesiones con guion ({", ".join(con) or "ninguna"}). Todo bien.')
