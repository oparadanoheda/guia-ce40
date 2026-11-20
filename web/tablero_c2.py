# El tablero de la misión de las sesiones de 2º (el formato está explicado en tablero_clase.py).

TABLERO_C2 = {
    "c2-s1": {
        "A": {
            "titulo": "El robot llega a la meta",
            "pasos": [
                {"t": "Escribimos **todo** el programa con tarjetas.", "pics": ["tarjeta", "escribir"]},
                {"t": "Lo **revisamos** entre todos.", "pics": ["grupo", "pensar"]},
                {"t": "Pulsamos **«Ejecutar»** y miramos al robot.", "pics": ["robot", "pizarra"]},
            ],
            "ref": {"titulo": "El orden de hoy", "tipo": "lista",
                    "items": ["Primero escribo el programa.", "Después lo reviso.", "Al final lo ejecuto."]},
            "logro": ["El programa está entero antes de ejecutar.", "El robot no choca con las rocas.", "El robot llega."],
            "extra": "El camino con menos tarjetas.",
        },
        "B": {
            "titulo": "El robot busca el tesoro",
            "pasos": [
                {"t": "Colocamos el **robot,** el **tesoro** y **tres rocas.**", "pics": ["robot", "tesoro"]},
                {"t": "Escribimos el camino con **tarjetas en fila.**", "pics": ["tarjeta", "camino"]},
                {"t": "**Otro grupo** lo comprueba moviendo la ficha.", "pics": ["grupo", "senalar"]},
            ],
            "ref": {"titulo": "En nuestro tablero", "tipo": "pictos",
                    "items": [["robot", "El robot"], ["tesoro", "El tesoro"], ["piedra", "Tres rocas"]]},
            "logro": ["Las tarjetas están en fila.", "El robot no pisa las rocas.", "El robot llega al tesoro."],
            "extra": "El camino con menos tarjetas.",
        },
    },
    "c2-s2": {
        "A": {
            "titulo": "Lavarse las manos, en orden",
            "pasos": [
                {"t": "**Ordenamos** los 6 pasos.", "pics": ["ordenar", "pizarra"]},
                {"t": "¿Por qué este paso **no puede ir antes?**", "pics": ["pregunta", "pensar"]},
                {"t": "Tapamos un paso. **¿Qué pasa si falta?**", "pics": ["mano", "pregunta"]},
            ],
            "ref": {"titulo": "Palabras para ordenar", "tipo": "lista",
                    "items": ["Primero…", "Después…", "Al final…"]},
            "logro": ["Los 6 pasos están en orden.", "Sabemos por qué va cada paso en su sitio."],
            "extra": "Entre todos: el algoritmo de «preparar la mochila».",
        },
        "B": {
            "titulo": "Ordena y completa",
            "pasos": [
                {"t": "Tenemos **dos rutinas** mezcladas.", "pics": ["grupo", "papel"]},
                {"t": "Las **ordenamos.**", "pics": ["ordenar"]},
                {"t": "Escribimos en un papel **un paso que falta.**", "pics": ["escribir", "pensar"]},
            ],
            "ref": {"titulo": "Palabras para ordenar", "tipo": "lista",
                    "items": ["Primero…", "Después…", "Al final…"]},
            "logro": ["Las dos rutinas están en orden.", "Hemos añadido un paso que faltaba."],
            "extra": "Entre todos: el algoritmo de «preparar la mochila».",
        },
    },
    "c2-s3": {
        "A": {
            "titulo": "Patrones que se repiten y que crecen",
            "pasos": [
                {"t": "Miramos el patrón. **¿Qué va en el «?»?**", "pics": ["pizarra", "pregunta"]},
                {"t": "Decimos **la regla.**", "pics": ["explicar"]},
                {"t": "Un patrón **que crece:** figura 1, 2 y 3.", "pics": ["contar"]},
                {"t": "**¿Cómo será la figura 4?** ¿Y la 10?", "pics": ["pensar", "pregunta"]},
            ],
            "ref": {"titulo": "Para descubrir la regla", "tipo": "lista",
                    "items": ["¿Qué se repite?", "¿Qué viene después?", "Si crece: ¿cuántos más cada vez?"]},
            "logro": ["Sabemos qué va en cada «?».", "Sabemos decir la regla.", "Sabemos cómo será la figura 4."],
            "extra": "La hoja 2: buscad el bicho del patrón.",
        },
        "B": {
            "titulo": "Ficha de patrones",
            "pasos": [
                {"t": "Miramos cada patrón y buscamos **la regla.**", "pics": ["papel", "pensar"]},
                {"t": "**Continuamos** el patrón.", "pics": ["lapiz"]},
                {"t": "Hacemos también **el patrón que crece.**", "pics": ["contar"]},
                {"t": "Lo **corregimos** en la pizarra.", "pics": ["pizarra"]},
            ],
            "ref": {"titulo": "Para descubrir la regla", "tipo": "lista",
                    "items": ["¿Qué se repite?", "¿Qué viene después?", "Si crece: ¿cuántos más cada vez?"]},
            "logro": ["La hoja 1 está terminada.", "Sabemos decir la regla de un patrón."],
            "extra": "La hoja 2: buscad el bicho del patrón.",
        },
    },
    "c2-s4": {
        "A": {
            "titulo": "Largo contra corto",
            "pasos": [
                {"t": "La escalera: un programa **largo** y otro con **REPITE.**", "pics": ["escalera", "repite"]},
                {"t": "**¿Hacen lo mismo?** Contamos las tarjetas.", "pics": ["contar", "tarjeta"]},
                {"t": "Ahora, el **cuadrado** con **REPITE ×4.**", "pics": ["cuadrado", "repite"]},
                {"t": "Miramos el **rastro** del robot.", "pics": ["robot", "pizarra"]},
            ],
            "ref": {"titulo": "Las tarjetas de hoy", "tipo": "pictos",
                    "items": [["tarjeta", "Flechas"], ["repite", "REPITE"]]},
            "logro": ["Los dos programas de la escalera hacen lo mismo.", "El cuadrado tiene REPITE ×4.", "El robot vuelve al inicio."],
            "extra": "Un rectángulo de 2 × 3 con REPITE: ¿qué cambia?",
        },
        "B": {
            "titulo": "El cuadrado con REPITE",
            "pasos": [
                {"t": "Escribimos un **cuadrado** con tarjetas.", "pics": ["cuadrado", "tarjeta"]},
                {"t": "Usamos la tarjeta **REPITE.**", "pics": ["repite"],
                 "pista": "¿Cuántos lados tiene un cuadrado? ¿Qué hace el robot en cada lado?"},
                {"t": "**Otro grupo** lo comprueba en su tablero.", "pics": ["grupo", "robot"]},
            ],
            "ref": {"titulo": "Las tarjetas de hoy", "tipo": "pictos",
                    "items": [["tarjeta", "Flechas"], ["repite", "REPITE"]]},
            "logro": ["El programa tiene la tarjeta REPITE.", "El robot dibuja un cuadrado.", "El robot vuelve al inicio."],
            "extra": "Un rectángulo de 2 × 3 con REPITE: ¿qué cambia?",
        },
    },
    "c2-s5": {
        "A": {
            "titulo": "Cazabichos en la pizarra",
            "pasos": [
                {"t": "Miramos el programa **paso a paso.**", "pics": ["pizarra", "robot"]},
                {"t": "**¡Alto!** cuando el robot se equivoque.", "pics": ["bicho", "senalar"]},
                {"t": "Tocamos la **tarjeta mala** y la cambiamos.", "pics": ["tarjeta", "arreglar"]},
                {"t": "Probamos otra vez. **¿Queda otro bicho?** Hay dos.", "pics": ["pregunta", "bicho"]},
            ],
            "ref": {"titulo": "Cómo se caza un bicho", "tipo": "lista",
                    "items": ["Voy paso a paso.", "Busco el paso donde empieza el error.", "Cambio la tarjeta y pruebo."]},
            "logro": ["Sabemos en qué paso empieza el error.", "Hemos cambiado la tarjeta mala.", "Ahora el robot llega."],
            "extra": "Por parejas: meted dos bichos en un mapa para otra pareja.",
        },
        "B": {
            "titulo": "Cazabichos por parejas",
            "pasos": [
                {"t": "Seguimos el programa **con el dedo.**", "pics": ["pareja", "senalar"]},
                {"t": "**Rodeamos** los dos bichos de cada programa.", "pics": ["bicho", "lapiz"]},
                {"t": "Escribimos debajo la **flecha correcta.**", "pics": ["tarjeta", "escribir"]},
                {"t": "Lo **corregimos** en la pizarra.", "pics": ["pizarra"]},
            ],
            "ref": {"titulo": "Cómo se caza un bicho", "tipo": "lista",
                    "items": ["Voy paso a paso.", "Busco el paso donde empieza el error.", "Escribo la flecha correcta."]},
            "logro": ["Hemos rodeado los dos bichos.", "Hemos escrito la flecha correcta."],
            "extra": "Meted dos bichos en un mapa para otra pareja.",
        },
    },
    "c2-s6": {
        "A": {
            "titulo": "Volvemos a True True",
            "pasos": [
                {"t": "Reto 1: una **recta** de 3 casillas.", "pics": ["robot", "tarjeta"]},
                {"t": "Reto 2: un camino en **L.**", "pics": ["camino"]},
                {"t": "Reto 3: un camino en **U.**", "pics": ["camino"]},
                {"t": "**Contamos** las tarjetas de cada reto.", "pics": ["contar", "tarjeta"]},
            ],
            "ref": {"titulo": "Los tres retos", "tipo": "lista",
                    "items": ["Recta de 3 casillas.", "Camino en L.", "Camino en U."]},
            "logro": ["El robot hace la recta de 3 casillas.", "Hemos contado nuestras tarjetas.", "Hemos cuidado el robot."],
            "extra": "El camino en U con menos tarjetas.",
        },
        "B": {
            "titulo": "Recicla con True True",
            "pasos": [
                {"t": "Miramos **qué residuo** lleva el robot.", "pics": ["robot", "pensar"]},
                {"t": "Buscamos su **contenedor.**", "pics": ["contenedor"]},
                {"t": "Ponemos las **tarjetas** del camino.", "pics": ["tarjeta", "camino"]},
                {"t": "**Probamos** con el robot.", "pics": ["robot"]},
            ],
            "ref": {"titulo": "La misión", "tipo": "pictos",
                    "items": [["robot", "El robot lleva el residuo"], ["contenedor", "Al contenedor correcto"]]},
            "logro": ["El robot llega al contenedor correcto.", "Hemos cuidado el robot."],
            "extra": "El mismo camino con menos tarjetas.",
        },
    },
    "c2-s7": {
        "A": {
            "titulo": "El robot recorre un cuadrado",
            "pasos": [
                {"t": "Un **cuadrado** de 2 casillas de lado, **sin repetir.**", "pics": ["cuadrado", "tarjeta"]},
                {"t": "**Probamos:** ¿el robot vuelve al inicio?", "pics": ["robot", "pregunta"]},
                {"t": "Ahora lo **acortamos** repitiendo.", "pics": ["repite"],
                 "pista": "¿Cuántos lados tiene un cuadrado? ¿Qué hace el robot en cada lado?"},
                {"t": "Reto: un **rectángulo** de 2 × 3.", "pics": ["robot", "camino"],
                 "pista": "¿Todos los lados son iguales? ¿Qué trozo se repite entonces?"},
            ],
            "ref": {"titulo": "En cada lado del cuadrado", "tipo": "lista",
                    "items": ["Avanza.", "Avanza.", "Gira."]},
            "logro": ["El robot recorre el cuadrado.", "El robot vuelve al inicio.", "Sabemos qué trozo se repite."],
            "notas": [["¿El robot no vuelve al inicio?", "Mirad los giros: los cuatro, siempre hacia el mismo lado."]],
            "extra": "El rectángulo de 2 × 3 con REPITE.",
        },
        "B": {
            "titulo": "Figuras con True True",
            "pasos": [
                {"t": "Miramos **qué figura** nos toca.", "pics": ["cuadrado", "pensar"]},
                {"t": "Ponemos las **tarjetas** del camino.", "pics": ["tarjeta", "camino"]},
                {"t": "**Probamos** con el robot.", "pics": ["robot"]},
            ],
            "logro": ["El robot recorre la figura.", "El robot vuelve al inicio."],
            "extra": "El rectángulo de 2 × 3 con REPITE.",
        },
    },
    "c2-s8": {
        "A": {
            "titulo": "Misión final: el código secreto",
            "pasos": [
                {"t": "Resolvemos las **4 pruebas** de la ficha.", "pics": ["grupo", "papel"]},
                {"t": "Cada prueba da **un número.**", "pics": ["contar", "escribir"]},
                {"t": "Con los 4 números formamos el **código secreto.**", "pics": ["llave"]},
                {"t": "**Decimos** el código secreto.", "pics": ["explicar"]},
            ],
            "ref": {"titulo": "Las cuatro pruebas", "tipo": "lista",
                    "items": ["Un patrón.", "Un camino.", "Un bucle.", "Un bicho."]},
            "logro": ["Hemos hecho las 4 pruebas.", "Tenemos los 4 números.", "Hemos dicho el código secreto."],
            "extra": "Inventad una quinta prueba para otro grupo.",
        },
        "B": {
            "titulo": "Misión final en la pizarra",
            "pasos": [
                {"t": "Reto 1: un **patrón.**", "pics": ["pizarra", "pensar"]},
                {"t": "Reto 2: un **mapa.**", "pics": ["robot", "camino"]},
                {"t": "Reto 3: un **bucle.**", "pics": ["repite"]},
                {"t": "Reto 4: un **bicho.**", "pics": ["bicho"]},
            ],
            "ref": {"titulo": "Por equipos", "tipo": "lista",
                    "items": ["Sale un equipo cada vez.", "Lo pensamos juntos.", "Después, otro equipo."]},
            "logro": ["Hemos resuelto los 4 retos.", "Todos los equipos han salido."],
            "extra": "Inventad una quinta prueba para otro grupo.",
        },
    },
}
