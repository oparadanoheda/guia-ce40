# Vídeos animados de conceptos (web/videos/anim-*.html). Fuente única para la web.
# Encargo y guiones: ../Animaciones/Prompts animaciones.md
#
# (id, archivo, concepto, cursos, frase que lo define, segundo para la miniatura, sesiones donde se enlaza)
# Las versiones «-superior» (aspecto de editor real) son para los cursos que ya programan en Scratch o MakeCode.
VIDEOS = [
    ("algoritmo", "anim-algoritmo.html", "Algoritmo", "1º-2º",
     "Un algoritmo es una lista de pasos en orden.", 24.8, ["c1-s1", "c2-s2"]),
    ("descomponer", "anim-descomponer.html", "Descomponer", "1º-4º",
     "Descomponer es partir un problema grande en partes pequeñas.", 36.0, ["c1-s3", "c2-s17", "c3-s15", "c4-s9"]),
    ("patron", "anim-patron.html", "Patrón", "1º-3º",
     "Un patrón es algo que se repite siguiendo una regla.", 39.6, ["c1-s5", "c2-s3"]),
    ("bucle", "anim-bucle.html", "Bucle", "1º-4º",
     "Un bucle repite varias veces lo mismo.", 55.7, ["c1-s9", "c2-s4", "c3-s3", "c3-s11", "c4-s2"]),
    ("condicion", "anim-condicion.html", "Condición", "2º-4º",
     "Una condición es una pregunta que decide qué hacer.", 32.7, ["c2-s9", "c2-s11", "c3-s5", "c4-s3"]),
    ("evento", "anim-evento.html", "Evento", "2º",
     "Un evento es la señal que hace empezar un programa.", 35.2, ["c2-s10", "c2-s23"]),
    ("evento-superior", "anim-evento-superior.html", "Evento", "3º-6º",
     "Un evento es la señal que hace empezar un programa.", 48.4, ["c3-s10", "c4-s13", "c6-s2"]),
    ("variable", "anim-variable.html", "Variable", "3º-6º",
     "Una variable guarda un número que puede cambiar.", 44.0, ["c3-s13", "c4-s4", "c4-s12"]),
    ("depurar", "anim-depurar.html", "Depurar", "1º-3º",
     "Depurar es encontrar el error y arreglarlo.", 45.6, ["c1-s6", "c2-s5", "c3-s6"]),
    ("depurar-superior", "anim-depurar-superior.html", "Depurar", "4º-6º",
     "Depurar es encontrar el error y arreglarlo.", 45.6, ["c4-s7", "c5-s6"]),
    ("entrada-salida", "anim-entrada-salida.html", "Entrada y salida", "1º-2º",
     "Entrada → programa → salida.", 44.8, ["c1-s7", "c2-s6"]),
    ("entrada-salida-superior", "anim-entrada-salida-superior.html", "Entrada y salida", "3º-6º",
     "Entrada → programa → salida.", 44.8, ["c3-s18", "c4-s17", "c5-s2"]),
    ("optimizar", "anim-optimizar.html", "Optimizar", "1º-2º",
     "Optimizar es conseguir lo mismo con menos pasos.", 28.8, ["c1-s20", "c2-s19"]),
    ("optimizar-superior", "anim-optimizar-superior.html", "Optimizar", "3º-6º",
     "Optimizar es conseguir lo mismo con menos pasos.", 57.6, ["c3-s22", "c4-s21", "c6-s6"]),
    ("coordenadas", "anim-coordenadas.html", "Coordenadas (x, y)", "3º-4º",
     "Dos números, x e y, dicen dónde está algo.", 38.4, ["c3-s10", "c4-s10"]),
    ("sensor-umbral", "anim-sensor-umbral.html", "Sensor y umbral", "5º-6º",
     "El umbral es el número a partir del cual el programa decide.", 39.6, ["c5-s4", "c5-s5", "c6-s5"]),
    ("aprende-maquina", "anim-aprende-maquina.html", "Cómo aprende una máquina", "5º-6º",
     "Una máquina aprende de los ejemplos que le damos.", 34.5, ["c5-s9", "c6-s8"]),
]

# sesión -> vídeos que se enlazan en ella
BY_SESSION = {}
for _v in VIDEOS:
    for _sid in _v[6]:
        BY_SESSION.setdefault(_sid, []).append(_v)
