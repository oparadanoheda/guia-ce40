# «Para repasar»: conceptos de sesiones o cursos anteriores que una sesión da por sabidos, con los recursos para repasarlos.
# Cada sesión lo dice en su .md:   - **Para repasar:** variable · evento · sensores · azar
# La web enseña, para cada concepto, los recursos del curso de la sesión y dónde se vio por última vez antes de ella.
# Con los mismos datos se hace el «Mapa de conceptos» (#conceptos): cada concepto de 1º a 6º, con las sesiones donde se
# aprende, las que lo dan por sabido y los recursos de cada curso (por eso hay también recursos de 1º y 2º).
#
# clave: (nombre, recursos, sesiones donde se trabaja, en orden)
# recursos: (cursos, tipo, referencia, texto)
#   cursos: los cursos a los que vale, como "3456"
#   tipo: "video" (id de videos.py) · "pizarra" (herramienta.modo) · "tablet" (reto) · "poster" (página de M26) ·
#         "material" (Mxx) · "bloque" (los bloques, cuando no hay otro recurso)
CONCEPTOS = {
    "algoritmo": ("Algoritmo", [
        ("1234", "video", "algoritmo", ""), ("123456", "poster", 2, ""), ("12", "pizarra", "secuencias.manos", "Ordena la secuencia"),
        ("3", "pizarra", "cuadricula.mapa3", "Robot en la cuadrícula"), ("456", "pizarra", "secuencias.repaso", "Ordena la secuencia (repaso)"),
        ("34", "tablet", "robot", "Programa al robot")], ["c1-s1", "c2-s2", "c3-s2"]),
    "patrón": ("Patrón", [
        ("123", "video", "patron", ""), ("123456", "poster", 4, ""), ("123", "pizarra", "patrones.ab", "Patrones"),
        ("456", "pizarra", "patrones.repaso", "Patrones y series (repaso)"), ("123", "material", "M09", "Patrones")], ["c1-s5", "c2-s3", "c3-s1"]),
    "bucle": ("Bucle (repetir)", [
        ("1234", "video", "bucle", ""), ("123456", "poster", 5, ""), ("12", "pizarra", "bucles.palmadas", "Bucles: largo o corto"),
        ("3", "pizarra", "bucles.cuadrado", "Bucles: largo o corto"), ("456", "pizarra", "bucles.repaso", "Bucles (repaso)"),
        ("34", "tablet", "robot", "Programa al robot (niveles 4 a 8)"), ("56", "tablet", "poligonos", "La tortuga y los polígonos"),
        ("34", "pizarra", "salida.bucle", "Tres preguntas")],
        ["c1-s9", "c2-s4", "c3-s3", "c3-s11", "c4-s2"]),
    "para-siempre": ("Para siempre (por siempre)", [
        ("34", "bloque", "", "En Scratch, **por siempre**: repite lo de dentro sin parar (para mover un objeto o mirar si toca algo todo el rato)."),
        ("56", "bloque", "", "En MakeCode, **para siempre**: repite lo de dentro sin parar (para mirar un sensor todo el rato)."),
        ("56", "pizarra", "salida.siempre_mk", "Tres preguntas")],
        ["c3-s11", "c3-s14", "c5-s2"]),
    "condición": ("Condición (si… entonces)", [
        ("234", "video", "condicion", ""), ("123456", "poster", 6, ""), ("2", "pizarra", "semaforo", "Semáforo: si… entonces"),
        ("3", "pizarra", "semaforo.sino", "Semáforo: si… si no"), ("456", "pizarra", "semaforo.repaso", "Si… entonces (repaso)"),
        ("456", "tablet", "condiciones", "¿Qué hace el programa?"),
        ("34", "pizarra", "salida.condicion", "Tres preguntas"), ("56", "pizarra", "salida.condicion_mk", "Tres preguntas")], ["c2-s9", "c2-s11", "c3-s5", "c4-s3", "c5-s4"]),
    "evento": ("Evento", [
        ("2", "video", "evento", ""), ("3456", "video", "evento-superior", ""), ("123456", "poster", 7, ""),
        ("34", "pizarra", "eventos", "Eventos en Scratch"), ("56", "pizarra", "eventos.microbit", "Eventos en la micro:bit"), ("3456", "pizarra", "eventos.reto", "Eventos · ¿cuáles empiezan?"),
        ("34", "pizarra", "salida.evento", "Tres preguntas"), ("56", "pizarra", "salida.evento_mk", "Tres preguntas"),
        ("34", "bloque", "", "En Scratch: **al hacer clic en la bandera**, **al presionar tecla**, **al hacer clic en este objeto**."),
        ("56", "bloque", "", "En MakeCode: **al iniciar**, **al presionarse el botón A**, **al agitar**.")],
        ["c2-s10", "c3-s10", "c4-s10", "c5-s2", "c6-s2"]),
    "variable": ("Variable", [
        ("34", "video", "variable", ""), ("56", "video", "variable-makecode", ""), ("123456", "poster", 8, ""),
        ("3", "pizarra", "variables", "Variables: la caja"), ("4", "pizarra", "variables.traza", "Variables: ¿cuánto vale al final?"),
        ("56", "pizarra", "variables.mascota", "Variables con MakeCode"), ("3456", "tablet", "variables", "¿Cuánto vale?"),
        ("34", "pizarra", "salida.variable", "Tres preguntas"), ("56", "pizarra", "salida.variable_mk", "Tres preguntas")],
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
        ("123", "video", "depurar", ""), ("456", "video", "depurar-superior", ""), ("123456", "poster", 9, ""), ("12", "pizarra", "cuadricula.bicho1", "Cazabichos"),
        ("3", "pizarra", "cuadricula.bicho2", "Cazabichos"), ("456", "pizarra", "cuadricula.repaso", "Robot en la cuadrícula (repaso)")],
        ["c1-s6", "c2-s5", "c3-s6", "c4-s7", "c5-s6"]),
    "optimizar": ("Optimizar", [
        ("12", "video", "optimizar", ""), ("3456", "video", "optimizar-superior", ""), ("123456", "poster", 11, ""), ("3456", "tablet", "balanza", "Ordenar con la balanza")],
        ["c1-s20", "c2-s19", "c3-s22", "c4-s21", "c6-s6"]),
    "descomponer": ("Descomponer", [
        ("1234", "video", "descomponer", ""), ("123456", "poster", 3, "")], ["c1-s3", "c2-s17", "c3-s15", "c4-s9"]),
    "entrada-salida": ("Entrada y salida", [
        ("12", "video", "entrada-salida", ""), ("3456", "video", "entrada-salida-superior", ""), ("123456", "poster", 10, "")], ["c1-s7", "c2-s6", "c3-s18", "c4-s17", "c5-s2"]),
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


# Mapa de conceptos (#conceptos): los grupos en que se ordena y una frase que dice qué es cada concepto
# (la de su póster de M26 o su vídeo cuando lo tiene, más corta).
GRUPOS = [
    ("Programar", ["algoritmo", "patrón", "descomponer", "bucle", "para-siempre", "condición", "evento", "variable",
                   "mensajes", "funciones", "depurar", "optimizar"]),
    ("Matemáticas en el código", ["coordenadas", "ángulos", "azar", "mitad", "datos", "3d"]),
    ("Robots, dispositivos e IA", ["entrada-salida", "circuitos", "micro:bit", "sensores", "motores", "ia"]),
]
DEFINICION = {
    "algoritmo": "Una lista de pasos, en orden, para conseguir algo.",
    "patrón": "Algo que se repite siguiendo una regla.",
    "descomponer": "Partir un problema grande en partes pequeñas.",
    "bucle": "Repetir varias veces lo mismo sin escribirlo cada vez.",
    "para-siempre": "Un bucle que no termina: repite lo de dentro todo el rato.",
    "condición": "Una pregunta que decide qué hace el programa.",
    "evento": "La señal que hace que un programa empiece.",
    "variable": "Una caja con nombre que guarda un número que puede cambiar.",
    "mensajes": "Un evento que se envía: empiezan los programas que lo esperan.",
    "funciones": "Un trozo de programa con nombre, que se usa llamándolo.",
    "depurar": "Buscar el error (el «bicho») y arreglarlo.",
    "optimizar": "Conseguir lo mismo con menos pasos o de forma más clara.",
    "coordenadas": "Dos números, x e y, dicen dónde está algo.",
    "ángulos": "En un polígono regular, cada giro es 360 : número de lados.",
    "azar": "El programa escoge un número sin que sepamos cuál.",
    "mitad": "Cada pregunta buena descarta la mitad de lo que queda.",
    "datos": "Preguntar, contar, ordenar en una tabla y dibujar el gráfico.",
    "3d": "Un objeto en 3D se ve distinto de frente, de lado y desde arriba.",
    "entrada-salida": "Algo entra (un botón, un sensor), el programa decide y algo sale.",
    "circuitos": "La corriente pasa si el circuito se cierra con algo que conduce.",
    "micro:bit": "Una placa con botones, sensores y 25 luces que se programa con MakeCode.",
    "sensores": "El sensor mide; el umbral es el número a partir del cual el programa decide.",
    "motores": "Un motor por rueda: el número dice cuánto gira y su signo, hacia qué lado.",
    "ia": "Una máquina aprende de los ejemplos que le damos.",
}
assert sorted(k for _, ks in GRUPOS for k in ks) == sorted(CONCEPTOS) == sorted(DEFINICION)


def _norm(s):
    return s.strip().lower().replace("ó", "o").replace("í", "i").replace("á", "a").replace("é", "e").replace("ú", "u").replace(" ", "-")


CLAVES = {_norm(k): k for k in CONCEPTOS}


def clave(texto):
    """De lo que pone en el .md (p. ej. «Condición» o «para siempre») a la clave del concepto, o None."""
    return CLAVES.get(_norm(texto))


def ancla(k):
    """El id de la fila del concepto en el mapa: «k-variable», «k-microbit»…"""
    return "k-" + _norm(k).replace(":", "")


def antes(sid, sesiones):
    """La última sesión de la lista que va antes de sid (mismo curso con número menor, o un curso anterior)."""
    c, n = (int(x) for x in sid[1:].split("-s"))
    prev = [x for x in sesiones if (lambda cc, nn: cc < c or (cc == c and nn < n))(*(int(y) for y in x[1:].split("-s")))]
    return prev[-1] if prev else None
