# «Para repasar»: conceptos de sesiones o cursos anteriores que una sesión da por sabidos, con los recursos para repasarlos.
# Cada sesión lo dice en su .md:   - **Para repasar:** variable · evento · sensores · azar
# La web enseña, para cada concepto, los recursos del curso de la sesión y dónde se vio por última vez antes de ella.
#
# clave: (nombre, recursos, sesiones donde se trabaja, en orden)
# recursos: (cursos, tipo, referencia, texto)
#   cursos: los cursos a los que vale, como "3456"
#   tipo: "video" (id de videos.py) · "pizarra" (herramienta.modo) · "tablet" (reto) · "poster" (página de M26) ·
#         "material" (Mxx) · "bloque" (los bloques, cuando no hay otro recurso)
CONCEPTOS = {
    "algoritmo": ("Algoritmo", [
        ("34", "video", "algoritmo", ""), ("3456", "poster", 2, ""),
        ("3", "pizarra", "cuadricula.mapa3", "Robot en la cuadrícula"), ("456", "pizarra", "secuencias.repaso", "Ordena la secuencia (repaso)"),
        ("34", "tablet", "robot", "Programa al robot")], ["c1-s1", "c2-s2", "c3-s2"]),
    "bucle": ("Bucle (repetir)", [
        ("34", "video", "bucle", ""), ("3456", "poster", 5, ""),
        ("3", "pizarra", "bucles.cuadrado", "Bucles: largo o corto"), ("456", "pizarra", "bucles.repaso", "Bucles (repaso)"),
        ("34", "tablet", "robot", "Programa al robot (niveles 4 a 8)"), ("56", "tablet", "poligonos", "La tortuga y los polígonos")],
        ["c1-s9", "c2-s4", "c3-s3", "c3-s11", "c4-s2"]),
    "para-siempre": ("Para siempre (por siempre)", [
        ("34", "bloque", "", "En Scratch, **por siempre**: repite lo de dentro sin parar (para mover un objeto o mirar si toca algo todo el rato)."),
        ("56", "bloque", "", "En MakeCode, **para siempre**: repite lo de dentro sin parar (para mirar un sensor todo el rato).")],
        ["c3-s11", "c3-s14", "c5-s2"]),
    "condición": ("Condición (si… entonces)", [
        ("34", "video", "condicion", ""), ("3456", "poster", 6, ""),
        ("3", "pizarra", "semaforo.sino", "Semáforo: si… si no"), ("456", "pizarra", "semaforo.repaso", "Si… entonces (repaso)"),
        ("456", "tablet", "condiciones", "¿Qué hace el programa?")], ["c2-s9", "c2-s11", "c3-s5", "c4-s3", "c5-s4"]),
    "evento": ("Evento", [
        ("3456", "video", "evento-superior", ""), ("3456", "poster", 7, ""),
        ("34", "pizarra", "eventos", "Eventos en Scratch"), ("56", "pizarra", "eventos.microbit", "Eventos en la micro:bit"), ("3456", "pizarra", "eventos.reto", "Eventos · ¿cuáles empiezan?"),
        ("34", "bloque", "", "En Scratch: **al hacer clic en la bandera**, **al presionar tecla**, **al hacer clic en este objeto**."),
        ("56", "bloque", "", "En MakeCode: **al iniciar**, **al presionarse el botón A**, **al agitar**.")],
        ["c2-s10", "c3-s10", "c4-s10", "c5-s2", "c6-s2"]),
    "variable": ("Variable", [
        ("34", "video", "variable", ""), ("56", "video", "variable-makecode", ""), ("3456", "poster", 8, ""),
        ("3", "pizarra", "variables", "Variables: la caja"), ("4", "pizarra", "variables.traza", "Variables: ¿cuánto vale al final?"),
        ("56", "pizarra", "variables.mascota", "Variables con MakeCode"), ("3456", "tablet", "variables", "¿Cuánto vale?")],
        ["c3-s13", "c4-s4", "c5-s2", "c6-s2"]),
    "coordenadas": ("Coordenadas", [
        ("34", "video", "coordenadas", ""), ("3456", "pizarra", "coordenadas.donde", "Coordenadas: ¿dónde está?"),
        ("3456", "pizarra", "flota.xy", "Hundir la flota (x, y)"), ("3456", "tablet", "coordenadas", "Coordenadas")], ["c3-s10", "c4-s10"]),
    "sensores": ("Sensores y umbral", [
        ("56", "video", "sensor-umbral", ""), ("56", "pizarra", "umbral", "Sensor y umbral (luz)"), ("56", "pizarra", "umbral.temp", "Sensor y umbral (temperatura)"),
        ("56", "tablet", "condiciones", "¿Qué hace el programa? (con MakeCode)")], ["c5-s3", "c5-s4"]),
    "micro:bit": ("La micro:bit", [
        ("56", "video", "entrada-salida-superior", ""), ("56", "pizarra", "leds.corazon", "Matriz de LED de la micro:bit"),
        ("56", "material", "M21", "Chuleta de MakeCode")], ["c5-s2"]),
    "mensajes": ("Mensajes y radio", [
        ("456", "video", "mensaje", ""), ("4", "pizarra", "mensajes", "Mensajes en Scratch"), ("56", "pizarra", "mensajes.radio", "Radio de la micro:bit")],
        ["c4-s13", "c5-s16", "c6-s14"]),
    "funciones": ("Funciones", [
        ("6", "video", "funcion", ""),
        ("6", "bloque", "", "En MakeCode, Avanzado › Funciones › **crear una función**; se usa con **llamada**.")], ["c6-s6"]),
    "depurar": ("Depurar (cazar bichos)", [
        ("3", "video", "depurar", ""), ("456", "video", "depurar-superior", ""), ("3456", "poster", 9, ""),
        ("3", "pizarra", "cuadricula.bicho2", "Cazabichos"), ("456", "pizarra", "cuadricula.repaso", "Robot en la cuadrícula (repaso)")],
        ["c1-s6", "c2-s5", "c3-s6", "c4-s7", "c5-s6"]),
    "optimizar": ("Optimizar", [
        ("3456", "video", "optimizar-superior", ""), ("3456", "poster", 11, ""), ("3456", "tablet", "balanza", "Ordenar con la balanza")],
        ["c1-s20", "c2-s19", "c3-s22", "c4-s21", "c6-s6"]),
    "descomponer": ("Descomponer", [
        ("34", "video", "descomponer", ""), ("3456", "poster", 3, "")], ["c1-s3", "c2-s17", "c3-s15", "c4-s9"]),
    "entrada-salida": ("Entrada y salida", [
        ("3456", "video", "entrada-salida-superior", ""), ("3456", "poster", 10, "")], ["c1-s7", "c2-s6", "c3-s18", "c4-s17", "c5-s2"]),
    "circuitos": ("Circuitos (qué conduce)", [
        ("34", "pizarra", "circuito", "¿Conduce la electricidad?")], ["c3-s17", "c4-s17"]),
    "azar": ("Números al azar", [
        ("34", "bloque", "", "En Scratch: **número aleatorio entre 1 y 10** (Operadores) e **ir a posición aleatoria** (Movimiento)."),
        ("56", "bloque", "", "En MakeCode: **escoger al azar de 1 a 6** (Matemáticas). Cada vez sale un número distinto.")],
        ["c3-s13", "c4-s5", "c5-s3"]),
    "mitad": ("Buscar por la mitad", [
        ("3456", "video", "mitad", ""), ("3456", "pizarra", "adivina", "Adivina el número"), ("3456", "tablet", "adivina", "Adivina el número")],
        ["c4-s5", "c6-s6"]),
    "motores": ("Motores del Nezha", [
        ("56", "pizarra", "velocidad", "Velocidad × tiempo"), ("56", "tablet", "velocidad", "Aparca el coche Nezha"),
        ("56", "bloque", "", "**Set motor M1 speed to 50 %**: con el número en positivo gira hacia un lado y en negativo hacia el otro.")],
        ["c5-s8", "c6-s4"]),
    "ia": ("Cómo aprende una IA", [
        ("56", "video", "aprende-maquina", ""), ("56", "pizarra", "sesgo", "Entrena a la máquina"), ("56", "pizarra", "verdad.bulos", "Verdad, bulo o IA")],
        ["c5-s9", "c6-s8"]),
    "3d": ("Diseño en 3D y vistas", [
        ("56", "pizarra", "vistas", "Cubos y vistas"), ("56", "tablet", "cubos", "Cubos y vistas")], ["c5-s10", "c5-s15", "c6-s9"]),
    "datos": ("Datos: tabla y gráfico", [
        ("3456", "pizarra", "votaciones", "Votaciones y gráfico"), ("3456", "material", "M25", "Hojas de registro de datos")], ["c3-s7", "c6-s3"]),
    "ángulos": ("Giros y ángulos", [
        ("34", "pizarra", "poligonos", "Polígonos"), ("456", "tablet", "poligonos", "La tortuga y los polígonos")], ["c3-s3", "c4-s2"]),
}

# Lo que todavía no tiene recurso propio (vídeo o herramienta para la pizarra): para hacerlo.
FALTAN = [
    ("para-siempre", "Vídeo o herramienta: un bucle que no para (por siempre / para siempre) frente a repetir N veces, y para qué sirve mirar un sensor todo el rato."),
    ("azar", "Vídeo o herramienta: números al azar (el dado electrónico, la posición aleatoria) y por qué cada vez sale distinto."),
    ("funciones", "Herramienta para la pizarra o reto de tablet: dar nombre a un trozo de programa y llamarlo."),
    ("motores", "Vídeo: el coche Nezha, los dos motores y el signo de la velocidad (por qué uno va en positivo y el otro en negativo para avanzar)."),
    ("descomponer", "Herramienta para la pizarra en 3º-6º: partir un proyecto en partes (solo hay vídeo de 1º-4º y póster)."),
    ("datos", "Vídeo: preguntar, contar, ordenar en una tabla y dibujar el gráfico."),
    ("3d", "Vídeo: moverse en Tinkercad y las vistas de frente, de lado y desde arriba."),
]


def _norm(s):
    return s.strip().lower().replace("ó", "o").replace("í", "i").replace("á", "a").replace("é", "e").replace("ú", "u").replace(" ", "-")


CLAVES = {_norm(k): k for k in CONCEPTOS}


def clave(texto):
    """De lo que pone en el .md (p. ej. «Condición» o «para siempre») a la clave del concepto, o None."""
    return CLAVES.get(_norm(texto))


def antes(sid, sesiones):
    """La última sesión de la lista que va antes de sid (mismo curso con número menor, o un curso anterior)."""
    c, n = (int(x) for x in sid[1:].split("-s"))
    prev = [x for x in sesiones if (lambda cc, nn: cc < c or (cc == c and nn < n))(*(int(y) for y in x[1:].split("-s")))]
    return prev[-1] if prev else None
