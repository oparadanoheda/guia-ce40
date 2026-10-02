# Guías para el docente de las herramientas para proyectar (salen en un desplegable bajo cada herramienta).
# Cada guía: idea (qué es, en una o dos frases), contar (guion breve para la clase, en el orden de uso),
# preguntas [(pregunta, [pistas de menos a más], solución en markdown)], mates (vínculo con el área) y saber [(texto, url)].
# Las preguntas hacen pensar: primero la pregunta, después las pistas y solo al final la solución.

GUIAS = {
    "binario": {
        "idea": "Cinco cartas con **1, 2, 4, 8 y 16 puntos**: cada una tiene el doble que la de su derecha. "
                "Cada carta solo puede estar **visible (1)** o **tapada (0)**, y con esas dos posiciones se forma cualquier número del 0 al 31. "
                "Es el **sistema binario**, el que usan los ordenadores: por dentro solo tienen interruptores encendidos o apagados.",
        "contar": [
            "Destapa las cartas una a una, de derecha a izquierda: 1, 2, 4… «¿Cuántos puntos tendrá la siguiente?». Que descubran que **cada carta tiene el doble**.",
            "Tapa todas y pide un número pequeño, por ejemplo el 5. «¿Qué cartas destapo?» → 4 + 1. Fíjate en la línea «En binario»: **00101**.",
            "Explica la regla: **carta visible = 1, carta tapada = 0**. El 5 se escribe 00101, igual que nosotros escribimos 5 con una cifra.",
            "Une la idea con la tecnología: un ordenador o la micro:bit no tienen cartas, tienen **millones de interruptores diminutos** (encendido = 1, apagado = 0). Con ellos guardan números, letras, fotos y música.",
            "Pulsa **Reto: forma un número** y que la clase lo resuelva. Después, **Contar +1** varias veces seguidas y que miren qué carta cambia más.",
        ],
        "preguntas": [
            ("¿Cuál es el número más grande que se puede formar con las 5 cartas?",
             ["¿Qué pasa si destapas todas?", "Suma 16 + 8 + 4 + 2 + 1."],
             "**31** (todas visibles: 11111). Con 3 cartas, 7; con 4, 15. El máximo es siempre **la carta siguiente menos 1** (32 − 1 = 31)."),
            ("¿Cómo se forma el 13? ¿Y el 21?",
             ["Empieza por la carta más grande que **no se pase** del número.", "Para el 13: ¿cabe el 16? No. ¿El 8? Sí, y quedan 5. ¿El 4? Sí, y queda 1…"],
             "**13 = 8 + 4 + 1 → 01101**. **21 = 16 + 4 + 1 → 10101**. El método (coger siempre la carta más grande que quepa) sirve para cualquier número."),
            ("¿Se puede formar un mismo número de dos maneras distintas?",
             ["Prueba con el 6: ¿hay otra forma además de 4 + 2?", "Cada carta solo se puede usar una vez."],
             "**No**: cada número tiene **una sola forma** de escribirse en binario. Por eso los ordenadores nunca se confunden al leerlo."),
            ("Pulsa «Contar +1» muchas veces. ¿Qué carta cambia más? ¿Cada cuánto cambia la del 2?",
             ["Mira solo la carta del 1 mientras cuentas.", "Apunta en la pizarra cuándo se gira la del 2."],
             "La del **1 cambia siempre** (visible, tapada, visible…); la del **2, cada 2**; la del **4, cada 4**… Como un cuentakilómetros, pero en base 2."),
            ("¿Qué tienen en común los números que llevan la carta del 1 visible?",
             ["Escribe los primeros: 1, 3, 5, 7…", "¿Qué pasa si sumas solo cartas de 2, 4, 8 y 16?"],
             "Son los **impares**. Las demás cartas son pares, así que sin la del 1 la suma siempre es par."),
            ("Si añadiéramos una sexta carta a la izquierda, ¿cuántos puntos tendría? ¿Hasta qué número llegaríamos?",
             ["Sigue el patrón: cada carta tiene el doble que la de su derecha.", "Después suma todas."],
             "**32 puntos**. Con 6 cartas se llega al **63** (64 − 1). Cada carta nueva duplica la cantidad de números que se pueden escribir."),
        ],
        "mates": "Potencias de 2 (1, 2, 4, 8, 16…), dobles, descomposición aditiva de un número, pares e impares, y el **valor posicional**: "
                 "en nuestro sistema cada posición vale 10 veces más (unidades, decenas, centenas); en binario, 2 veces más.",
        "saber": [
            ("CS Unplugged · Números binarios: la actividad original de las cartas, con fichas y guía (en español)", "https://csunplugged.org/es/topics/binary-numbers/"),
        ],
    },
}
