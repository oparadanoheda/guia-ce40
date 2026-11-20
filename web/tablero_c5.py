# El tablero de la misión de las sesiones de 5º (el formato está explicado en tablero_clase.py).
from tablero_leds import CONTENTA, TRISTE, CORAZON, CORAZON_P, UNO, TRES, FLECHA_N, FLECHA_S  # noqa: F401

TABLERO_C5 = {
    "c5-s1": {
        "A": {
            "titulo": "Reto relámpago en Scratch", "cols": 2, "retos": True, "etiqueta": "Nivel",
            "pasos": [
                {"t": "**Bucle:** un personaje que da vueltas sin parar y cambia de disfraz.",
                 "bloques": ["por siempre", "girar ↻ 15 grados", "siguiente disfraz"],
                 "pista": "Si va demasiado deprisa, poned un «esperar» dentro del bucle."},
                {"t": "**Variable:** que cuente puntos cada vez que hacemos clic en él.",
                 "bloques": ["al hacer clic en este objeto", "sumar a puntos 1"],
                 "pista": "Al pulsar la bandera, los puntos tienen que empezar en 0."},
                {"t": "**Condición:** si llega a 10 puntos, dice «¡Has ganado!».",
                 "bloques": ["si puntos = 10 entonces", "decir ¡Has ganado! durante 2 segundos"],
                 "pista": "La pregunta va justo debajo de sumar el punto."},
            ],
            "ref": {"titulo": "Las tres herramientas", "tipo": "lista",
                    "items": ["Bucle: repite.", "Variable: guarda un número que cambia.", "Condición: decide."]},
            "logro": ["El personaje gira sin parar.", "Cada clic suma un punto.", "Con 10 puntos dice «¡Has ganado!»."],
            "extra": "El nivel 3 con un «si… si no»: que diga cuántos puntos faltan.",
        },
        "B": {
            "titulo": "Arregla el juego",
            "pasos": [
                {"t": "Probad el juego: la bandera **dos veces seguidas** y jugad hasta el final."},
                {"t": "Tiene **3 bichos.** Decid qué debería pasar y qué pasa.",
                 "pista": "Mirad los puntos al volver a empezar, cuándo dice «¡Has ganado!» y cuánto dura la animación."},
                {"t": "Arregladlos **de uno en uno** y probad después de cada cambio."},
            ],
            "ref": {"titulo": "Cómo se caza un bicho", "tipo": "lista",
                    "items": ["¿Qué queríamos que pasara?", "¿Qué ha pasado?", "¿En qué bloque empieza a fallar?"]},
            "logro": ["Los puntos empiezan en 0.", "Solo dice «¡Has ganado!» con 10 puntos.", "La animación no se para."],
            "extra": "Meted un bicho nuevo para que lo encuentre otra pareja.",
        },
    },
    "c5-s2": {"D": {
        "titulo": "Nuestra primera micro:bit", "cols": 2,
        "pasos": [
            {"t": "**Al empezar,** un corazón.", "bloques": ["al iniciar", "mostrar ícono"]},
            {"t": "**Botón A,** un 1. **Botón B,** un 2.", "bloques": ["al presionarse el botón A", "mostrar número"]},
            {"t": "**Reto:** un corazón que late.", "bloques": ["para siempre", "mostrar ícono"],
             "pista": "¿Qué tiene que pasar una y otra vez? Corazón grande, corazón pequeño… Si late muy deprisa, una pausa."},
            {"t": "**Reto:** un contador que suma 1 con el botón A.", "bloques": ["cambiar contador por 1", "mostrar número"],
             "pista": "Cread antes la variable «contador», en Variables."},
            {"t": "**A la placa de verdad:** cable, Descargar y copiar el archivo a la unidad MICROBIT."},
        ],
        "ref": {"titulo": "Así tiene que funcionar", "tipo": "leds",
                "items": [[CORAZON, "Al empezar"], [UNO, "Botón A"], [CORAZON_P, "El corazón late"]]},
        "logro": ["Funciona en el simulador.", "Lo hemos pasado a la placa de verdad.", "Sabemos cuál es la entrada y cuál la salida."],
        "extra": "Que el contador baje con el botón B… y no pase de 0.",
    }},
    "c5-s3": {
        "A": {
            "titulo": "El dado electrónico", "cols": 2,
            "pasos": [
                {"t": "**Al agitar,** sale un número del 1 al 6.", "bloques": ["si agitar", "mostrar número", "escoger al azar de 1 a 6"],
                 "pista": "Si a veces sale un 0, mirad los números de «escoger al azar»."},
                {"t": "**Mejora:** una animación antes del número.", "bloques": ["mostrar ícono"]},
                {"t": "**A la placa** y a jugar."},
                {"t": "**Investigamos:** tirad el dado 30 veces y apuntad cada resultado."},
            ],
            "ref": {"titulo": "La hoja de recuento", "tipo": "tabla",
                    "items": [["Número", "1", "2", "3", "4", "5", "6"], ["Veces", "", "", "", "", "", ""]]},
            "logro": ["Al agitar sale un número del 1 al 6.", "Funciona en la placa.", "Tenemos apuntadas las 30 tiradas."],
            "notas": [["¿Es justo nuestro dado?", "En 30 tiradas, cada número sale unas 5 veces… más o menos."]],
            "extra": "Un dado que no repita el número anterior.",
        },
        "B": {
            "titulo": "El contador de pasos", "cols": 2,
            "pasos": [
                {"t": "Cada sacudida **suma un paso** y lo enseña.", "bloques": ["si agitar", "cambiar pasos por 1", "mostrar número"]},
                {"t": "**Botón A:** vuelve a 0.", "bloques": ["al presionarse el botón A", "fijar pasos a 0"]},
                {"t": "A la placa, **al tobillo,** y a caminar 20 pasos."},
                {"t": "¿Cuenta bien? **¿Por qué** a veces cuenta de más o de menos?", "pista": "El sensor nota sacudidas, no pasos."},
            ],
            "ref": {"titulo": "La prueba", "tipo": "lista",
                    "items": ["Poned el contador a 0.", "Caminad 20 pasos contando en voz alta.", "Comparad: ¿qué marca la placa?"]},
            "logro": ["Cuenta al agitar y vuelve a 0 con el botón A.", "Lo hemos probado caminando.", "Sabemos explicar por qué no cuenta exacto."],
            "extra": "El dado electrónico: al agitar, un número del 1 al 6.",
        },
    },
}
