# Datos del mapa de la etapa (herramientas, progresión y productos).

TOOLS = [
    # (clave, nombre, {(curso, trimestre)})
    ("des", "Desenchufado", {(1, 1), (1, 2), (1, 3), (2, 1), (2, 2), (2, 3), (3, 1)}),
    ("tb", "Robot Tale-Bot", {(1, 1)}),
    ("tt", "Robot True True", {(1, 2), (1, 3), (2, 1), (2, 2), (2, 3), (3, 1)}),
    ("pap", "Bloques de papel", {(1, 2), (1, 3), (2, 2)}),
    ("sjr", "ScratchJr", {(2, 3)}),
    ("scr", "Scratch", {(3, 2), (3, 3), (4, 1), (4, 2), (4, 3), (5, 1)}),
    ("mm", "Makey Makey", {(3, 3), (4, 3)}),
    ("mb", "micro:bit", {(5, 1), (5, 2), (5, 3), (6, 1), (6, 2), (6, 3)}),
    ("nz", "Nezha", {(5, 3), (6, 2), (6, 3)}),
    ("tk", "Tinkercad (3D)", {(5, 3), (6, 3)}),
    ("tm", "Teachable Machine", {(5, 3), (6, 3)}),
]
TOOL_NOTES = {
    ("tb", 1, 1): "S7-S8 · orientativo", ("tt", 1, 2): "desde S11", ("sjr", 2, 3): "S22-S24", ("scr", 5, 1): "repaso",
    ("des", 3, 1): "", ("tm", 5, 3): "demo", ("tm", 6, 3): "opcional",
}

STRANDS = [
    ("Secuencias y algoritmos", "pc", [
        (1, "Instrucciones en orden: robot humano, rutinas, mapas"),
        (2, "Secuencias más largas con giros y obstáculos"),
        (2, "Diagramas de flujo sencillos"),
        (3, "Diagramas con decisiones; diseñar un juego en papel"),
        (3, "Algoritmos para objetos que sienten y actúan"),
        (3, "Programas con varias partes y funciones")]),
    ("Patrones y descomposición", "pc", [
        (1, "Patrones AB, AAB, ABC; dividir una tarea en pasos"),
        (2, "Patrones que crecen; algoritmos de cada día"),
        (2, "Figuras con instrucciones; planificar un proyecto"),
        (2, "Polígonos y rosetones (giro = 360 ÷ lados)"),
        (3, "Un invento planificado por partes"),
        (3, "Generalizar: una función sirve para muchos casos")]),
    ("Bucles", "pc", [
        (1, "Tarjeta REPITE y bloque de papel"),
        (2, "REPITE para acortar programas y recorrer figuras"),
        (2, "repetir y por siempre en Scratch"),
        (3, "Bucles dentro de bucles; repetir hasta"),
        (3, "para siempre en micro:bit"),
        (3, "Bucles para optimizar el robot")]),
    ("Eventos", "pc", [
        (1, "La bandera verde: empezar"),
        (1, "Cuando toco, cuando choca (papel y ScratchJr)"),
        (2, "Teclas, clics y Makey Makey"),
        (2, "Varios eventos a la vez y mensajes"),
        (3, "Botones y sensores como eventos"),
        (3, "Muchos eventos en un programa (mascota virtual)")]),
    ("Condiciones", "pc", [
        (0, ""),
        (1, "Si… entonces: semáforo, reglas de juego, robot"),
        (2, "Si… si no; ¿tocando…? en Scratch"),
        (2, "Si… entonces… si no; comparar números"),
        (3, "Umbrales de sensores (luz, temperatura)"),
        (3, "Sensores que deciden (distancia, línea)")]),
    ("Variables", "pc", [
        (0, ""), (0, ""),
        (1, "Primer contador de puntos"),
        (2, "Puntos, vidas y números al azar"),
        (3, "Contadores y estados (activada / desactivada)"),
        (3, "Estado de una mascota; datos de sensores")]),
    ("Depuración y optimización", "pc", [
        (1, "Encontrar 1 o 2 bichos; menos tarjetas"),
        (1, "2 bichos; el programa más corto"),
        (2, "3 bichos; ordenar y quitar bloques"),
        (2, "Probar juegos de otros (playtesting)"),
        (3, "Depurar con sensores; revisar el programa"),
        (3, "Funciones y nombres claros")]),
    ("Robótica y electrónica", "rob", [
        (1, "Tale-Bot y True True: normas, partes, entrada y salida"),
        (1, "True True: recorridos y reglas"),
        (2, "Circuitos: qué conduce (Makey Makey)"),
        (2, "Fabricar un mando propio"),
        (2, "Placa con sensores; motores del Nezha"),
        (3, "Polaridad, mecanismos y sensores del Nezha")]),
    ("Datos e IA (IA solo en 5º y 6º)", "ia", [
        (1, "Clasificar objetos por sus características"),
        (1, "Árboles de preguntas; reglas para clasificar"),
        (2, "Encuestas, tablas y gráficos de barras"),
        (1, "Contrastar datos de dos fuentes"),
        (3, "IA: cómo aprende, sesgos y bulos"),
        (3, "IA generativa y ética; hoja de cálculo")]),
    ("Uso responsable y seguridad", "seg", [
        (1, "Cuidar el material, turnos, pedir ayuda"),
        (1, "Normas de la tablet; lo que se sube se queda"),
        (2, "Contraseñas, datos personales, trabajo sin conexión"),
        (2, "Navegación segura, contrastar, huella digital"),
        (3, "Normas de los kits; webs fiables; bulos"),
        (3, "Redes sociales, privacidad, huella digital")]),
    ("RA, QR y 3D", "ra", [
        (1, "Qué es un QR; un vídeo no es la realidad"),
        (1, "QR del proyecto (lo crea el docente)"),
        (1, "QR del museo interactivo"),
        (2, "QR de la feria de juegos"),
        (2, "Primer diseño en 3D (Tinkercad)"),
        (3, "Objeto útil en 3D; el alumnado crea sus QR")]),
    ("Proyecto del 3er trimestre", "pc", [
        (1, "Misión para True True"),
        (1, "Mapa de Madrid o Recicla con True True"),
        (2, "Museo interactivo con Makey Makey"),
        (2, "Juego con mando para 2º"),
        (3, "Invento para el colegio"),
        (3, "Proyecto de servicio y guía de legado")]),
]

PRODUCTS = [
    ("1º", "Mapas del tesoro y primer camino con Tale-Bot", "Espectáculo programado para el robot", "Misión para True True"),
    ("2º", "Misión final del trimestre (M14)", "Juego de mesa con reglas «si… entonces»", "Proyecto con True True + primer ScratchJr"),
    ("3º", "Misión final del trimestre (M14)", "Proyecto en Scratch con contador", "Pieza del museo interactivo"),
    ("4º", "Juego de las tablas", "Videojuego con puntos, vidas y final", "Juego con mando para 2º"),
    ("5º", "Dado electrónico", "Invento con un sensor", "Proyecto en equipo para el colegio"),
    ("6º", "Gráfico de datos o mascota virtual", "Proyecto con sensores y eventos", "Proyecto de servicio + legado"),
]

LEVEL_NAMES = {1: "Se introduce", 2: "Se desarrolla", 3: "Se consolida"}


