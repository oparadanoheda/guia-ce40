# Pictogramas para la misión de 1º y 2º en la proyección: cada paso lleva uno o dos, elegidos por palabras clave.
# Los nombres son los de pictos.py (ARASAAC) o los iconos propios de la guía (tarjeta, repite, bloque, que se
# dibujan igual que en M01 y M03). Gana la palabra que aparece antes en la frase.
import re

REGLAS = [
    (r"árbol de preguntas", "arbol_preguntas"),
    (r"\brobots?\b|tale-bot|true true", "robot"),
    (r"\babeja\b", "abeja"),
    (r"\brepite\b|\brepetir\b", "repite"),
    (r"\btarjetas?\b|\bflechas?\b|\bórdenes\b", "tarjeta"),
    (r"\bbloques?\b", "bloque"),
    (r"\bmapas?\b", "mapa_tesoro"),
    (r"\btesoro\b", "tesoro"),
    (r"\bcaminos?\b|\bruta\b|\brecorrido\b", "camino"),
    (r"\bbichos?\b", "bicho"),
    (r"\bpizarra\b", "pizarra"),
    (r"\bescalera\b", "escalera"),
    (r"\bcuadrados?\b|\brectángulo\b|\bfiguras?\b", "cuadrado"),
    (r"\bpalmadas?\b|\baplaud", "aplaudir"),
    (r"\bbail", "bailar"),
    (r"\bagach", "agacharse"),
    (r"\bbrazos arriba\b", "brazos_arriba"),
    (r"\bcampanilla\b", "campana"),
    (r"\bdedo\b", "senalar"),
    (r"\bdibuj", "dibujar"),
    (r"\bescrib", "escribir"),
    (r"\bordena(?!dor)|\ben orden\b", "ordenar"),
    (r"\bborra", "borrar"),
    (r"\barregla", "arreglar"),
    (r"\bcuántas?\b|\bcuántos\b|\bcontamos (?:las|nuestras|cuántas)\b", "contar"),
    (r"\bvota", "votar"),
    (r"\bjuego de mesa\b", "juego_mesa"),
    (r"\bdados?\b", "dado"),
    (r"\bpreguntas?\b|\badivin", "pregunta"),
    (r"\ben rojo\b", "semaforo_peatones_rojo"),
    (r"\ben verde\b|\bsemáforo\b|\bmuñeco\b|\bluz\b", "semaforo_peatones_verde"),
    (r"\bcalle\b|\bpaso de cebra\b|\bcruz[ao]\b", "paso_cebra"),
    (r"\banimal", "perro"),
    (r"\btostada\b", "untar"),
    (r"\bmanos\b", "frotar_jabon"),
    (r"\bgato\b", "gato"),
    (r"\btablets?\b|\bscratchjr\b|\bpantalla\b", "tablet"),
    (r"\bcaja\b|\bclasific", "caja"),
    (r"\bcasa\b", "casa"),
    (r"\bárbol\b", "arbol"),
    (r"\bcole\b|\bcolegio\b", "colegio"),
    (r"\bcorreos\b|\bcarta\b", "buzon"),
    (r"\bcontenedor\b|\bresiduos?\b", "contenedor"),
    (r"\brocas?\b", "piedra"),
    (r"\bmetas?\b", "bandera_meta"),
    (r"\bsalida\b", "bandera_salida"),
    (r"\bpresenta|\bexplica|\benseña|\bcuenta su\b|\bportavoz\b|\bcontamos un|\bcontad el\b", "explicar"),
    (r"\binvent", "idea"),
    (r"\bgrupos?\b|\bequipos?\b", "grupo"),
    (r"\bparejas?\b|\bcompañer", "pareja"),
    (r"\bjuga|\bjuego\b", "jugar"),
    (r"\bpiensa|\bpensamos\b", "pensar"),
]
_RX = [(re.compile(rx, re.I), name) for rx, name in REGLAS]


def pictos_paso(texto, maximo=2):
    """Los pictogramas de un paso, en el orden en que aparecen sus palabras en la frase."""
    t = texto.lower()
    hallados = []
    for rx, name in _RX:
        m = rx.search(t)
        if m and name not in (n for _, n in hallados):
            hallados.append((m.start(), name))
    nombres = [n for _, n in sorted(hallados)]
    # el árbol de preguntas no es un árbol del patio
    if "arbol" in nombres and ("arbol_preguntas" in nombres or "pregunt" in t or "respuesta" in t):
        nombres = ["arbol_preguntas" if n == "arbol" else n for n in nombres if n != "arbol_preguntas"]
    # un semáforo en rojo no lleva también el verde
    if "semaforo_peatones_rojo" in nombres and "semaforo_peatones_verde" in nombres and "verde" not in t:
        nombres.remove("semaforo_peatones_verde")
    return nombres[:maximo]
