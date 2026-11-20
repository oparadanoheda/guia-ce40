# El tablero de la misión de las sesiones de 1º (el formato está explicado en tablero_clase.py).

TECLAS = [["avanza", "Avanza"], ["retrocede", "Retrocede"], ["izquierda", "Gira"], ["derecha", "Gira"], ["go", "Empieza"], ["borrar", "Borrar"]]
PASOS_DE_MAS = ["¿Hace pasos de más?", "No se ha borrado la memoria. Pulsad borrar y probad otra vez."]

TABLERO_C1 = {
    "c1-s1": {
        "A": {
            "titulo": "El profe es el robot",
            "pasos": [
                {"t": "Mirad dónde está el **tesoro.**", "pics": ["tesoro"]},
                {"t": "Decid **una orden** cada vez.", "pics": ["robot", "tarjeta"]},
                {"t": "Solo valen las **tres órdenes** del robot.", "pics": ["pensar"]},
                {"t": "Al llegar, **contamos** las órdenes.", "pics": ["contar"]},
            ],
            "ref": {"titulo": "Las tres órdenes", "tipo": "lista",
                    "items": ["Avanza.", "Gira a la derecha.", "Gira a la izquierda."]},
            "logro": ["Hemos dado las órdenes de una en una.", "El robot ha llegado al tesoro."],
            "extra": "Escribid todas las tarjetas antes de mover al robot: eso es un programa.",
        },
        "B": {
            "titulo": "El robot de la pizarra",
            "pasos": [
                {"t": "El robot mira hacia su **nariz.**", "pics": ["robot"]},
                {"t": "Sale uno y toca **una tarjeta.**", "pics": ["pizarra", "tarjeta"]},
                {"t": "Antes, decimos **qué va a pasar.**", "pics": ["pensar"]},
                {"t": "Pulsamos «Ejecutar» y **comprobamos.**", "pics": ["tesoro"]},
            ],
            "ref": {"titulo": "Las tarjetas", "tipo": "lista",
                    "items": ["Avanza.", "Gira a la derecha.", "Gira a la izquierda."]},
            "logro": ["Hemos dicho antes qué iba a pasar.", "El robot ha llegado al tesoro."],
            "extra": "Escribid todas las tarjetas antes de mover al robot: eso es un programa.",
        },
    },
    "c1-s2": {
        "A": {
            "titulo": "Ordenamos en la pizarra",
            "pasos": [
                {"t": "Las viñetas están **desordenadas.**", "pics": ["pizarra"]},
                {"t": "¿Qué va **primero**? Pensad.", "pics": ["pensar"]},
                {"t": "Sale uno y **cambia dos** de sitio.", "pics": ["ordenar"]},
                {"t": "Al final, pulsamos **«Comprobar».**", "pics": ["senalar"]},
            ],
            "ref": {"titulo": "Las palabras del orden", "tipo": "lista",
                    "items": ["Primero", "Después", "Luego", "Por último"]},
            "logro": ["La rutina está en orden.", "Sabemos decir por qué."],
            "extra": "Tapamos una viñeta: ¿cuál falta?",
        },
        "B": {
            "titulo": "Ordenamos en la mesa",
            "pasos": [
                {"t": "**Ordenad** las viñetas de izquierda a derecha.", "pics": ["ordenar"]},
                {"t": "**Leedlas** en voz alta.", "pics": ["explicar"]},
                {"t": "**Comprobad** con el número pequeño de la esquina.", "pics": ["senalar"]},
            ],
            "ref": {"titulo": "Las palabras del orden", "tipo": "lista",
                    "items": ["Primero", "Después", "Luego", "Por último"]},
            "logro": ["La rutina está en orden.", "La hemos leído en voz alta.", "Los números de la esquina van seguidos."],
            "extra": "Tapad una viñeta: ¿cuál falta?",
        },
    },
    "c1-s3": {
        "A": {
            "titulo": "La tostada de la pizarra",
            "pasos": [
                {"t": "¿Cómo se hace una **tostada**?", "pics": ["pan_molde", "pregunta"]},
                {"t": "El profe es un robot: decid **cada paso.**", "pics": ["robot"]},
                {"t": "**Ordenamos** los 4 pasos en la pizarra.", "pics": ["ordenar", "pizarra"]},
                {"t": "¿Se puede hacer **antes** que el anterior?", "pics": ["pensar"]},
            ],
            "logro": ["Hemos dicho todos los pasos.", "Los 4 pasos están en orden."],
            "extra": "Inventad un paso que falte.",
        },
        "B": {
            "titulo": "Tres tareas en la mesa",
            "pasos": [
                {"t": "Las viñetas están mezcladas. **Separad** las tres tareas.", "pics": ["grupo"]},
                {"t": "**Ordenad** los pasos de cada una.", "pics": ["ordenar"]},
                {"t": "**Contad** una tarea a la clase.", "pics": ["explicar"]},
            ],
            "ref": {"titulo": "Las tres tareas", "tipo": "pictos",
                    "items": [["tostadora", "Hacer una tostada"], ["cepillarse", "Lavarse los dientes"], ["paso_cebra", "Cruzar la calle"]]},
            "logro": ["Las tres tareas están separadas.", "Cada tarea tiene sus pasos en orden.", "Sabemos decir por qué."],
            "extra": "Inventad un paso que falte.",
        },
    },
    "c1-s4": {
        "A": {
            "titulo": "El mapa del tesoro",
            "pasos": [
                {"t": "Buscad el **robot** y el **tesoro.**", "pics": ["robot", "tesoro"]},
                {"t": "**Dibujad las flechas** en las casillas.", "pics": ["dibujar", "camino"]},
                {"t": "Cada flecha, **un paso.**", "pics": ["contar"]},
                {"t": "Haced los mapas **1, 2, 3 y 4.**", "pics": ["mapa_tesoro"]},
            ],
            "logro": ["Las flechas llegan al tesoro.", "Hemos hecho los mapas 1 a 4."],
            "extra": "Mapas 5 y 6: buscad el camino más corto.",
        },
        "B": {
            "titulo": "Tablero de mesa",
            "pasos": [
                {"t": "Uno pone las **tarjetas** en fila.", "pics": ["tarjeta"]},
                {"t": "Otro **mueve el robot** siguiendo las tarjetas.", "pics": ["robot", "camino"]},
                {"t": "¿Ha llegado al **tesoro**?", "pics": ["tesoro"]},
                {"t": "Cambiad el tesoro de sitio y **otra vez.**", "pics": ["repite"]},
            ],
            "ref": {"titulo": "En el tablero", "tipo": "pictos",
                    "items": [["robot", "El robot"], ["tesoro", "El tesoro"], ["piedra", "Las rocas"]]},
            "logro": ["El robot llega al tesoro.", "Con el tesoro en otro sitio, también llega."],
            "extra": "Buscad el camino más corto.",
        },
    },
    "c1-s5": {
        "A": {
            "titulo": "Patrones con el cuerpo y en la pizarra",
            "pasos": [
                {"t": "**Palmada, palmada, pie.** ¿Qué viene ahora?", "pics": ["aplaudir"]},
                {"t": "**Inventad** otro patrón con el cuerpo.", "pics": ["idea"]},
                {"t": "En la pizarra: ¿qué va en la casilla **«?»**", "pics": ["pizarra", "pregunta"]},
                {"t": "La tocamos y **comprobamos.**", "pics": ["senalar"]},
            ],
            "logro": ["Sabemos qué viene después.", "Hemos inventado un patrón."],
            "extra": "El patrón que crece.",
        },
        "B": {
            "titulo": "Ficha de patrones",
            "pasos": [
                {"t": "Mirad el patrón: **¿qué se repite?**", "pics": ["pensar", "repite"]},
                {"t": "**Coloread** las casillas vacías.", "pics": ["lapiz"]},
                {"t": "Lo **comprobamos** en la pizarra.", "pics": ["pizarra"]},
            ],
            "logro": ["No queda ninguna casilla vacía.", "Cada patrón se repite siempre igual."],
            "extra": "El patrón que crece, al final de la hoja.",
        },
    },
    "c1-s6": {
        "A": {
            "titulo": "Bichos en la pizarra",
            "pasos": [
                {"t": "El robot **no llega.** Hay un bicho.", "pics": ["robot", "bicho"]},
                {"t": "Paso a paso: ¿en qué **tarjeta** empieza a fallar?", "pics": ["tarjeta", "pregunta"]},
                {"t": "Sale uno y **arregla** la tarjeta.", "pics": ["arreglar"]},
                {"t": "Ahora, el **patrón con bicho.**", "pics": ["bicho"]},
            ],
            "ref": {"titulo": "Cómo se caza un bicho", "tipo": "lista",
                    "items": ["¿Adónde tenía que llegar?", "¿Adónde ha llegado?", "¿En qué tarjeta empieza a fallar?"]},
            "logro": ["Hemos encontrado la tarjeta que falla.", "Ahora el robot llega."],
            "extra": "Meted un bicho en uno de vuestros mapas del tesoro para otra pareja.",
        },
        "B": {
            "titulo": "Ficha de cazabichos",
            "pasos": [
                {"t": "Seguid las flechas **con el dedo.**", "pics": ["senalar"]},
                {"t": "**Rodead** la flecha que falla.", "pics": ["bicho"]},
                {"t": "**Dibujad** debajo la flecha correcta.", "pics": ["dibujar"]},
            ],
            "ref": {"titulo": "Cómo se caza un bicho", "tipo": "lista",
                    "items": ["¿Adónde tenía que llegar?", "¿Adónde ha llegado?", "¿En qué flecha empieza a fallar?"]},
            "logro": ["Hemos rodeado la flecha que falla.", "Con la flecha nueva, llega."],
            "extra": "Meted un bicho en uno de vuestros mapas del tesoro para otra pareja.",
        },
    },
    "c1-s7": {
        "A": {
            "titulo": "Conocemos a Tale-Bot",
            "pasos": [
                {"t": "Antes de empezar, **borrad.**", "pics": ["borrar"]},
                {"t": "Pulsad **1, 2 o 3 flechas.**", "pics": ["robot"]},
                {"t": "Pulsad **GO** y mirad.", "pics": ["camino"]},
                {"t": "Ahora le toca **a otro.**", "pics": ["grupo"]},
            ],
            "ref": {"titulo": "Los botones de Tale-Bot", "tipo": "teclas", "items": TECLAS},
            "logro": ["Todos hemos programado un camino.", "Hemos borrado antes de cada camino.", "Hemos cogido el robot con dos manos."],
            "notas": [PASOS_DE_MAS],
            "extra": "Un camino de 4 o 5 pasos con un giro. Antes de pulsar GO, decid en qué casilla acabará.",
        },
        "B": {
            "titulo": "De la pizarra al suelo",
            "pasos": [
                {"t": "En la pizarra, uno **pulsa flechas.**", "pics": ["pizarra", "abeja"]},
                {"t": "Decimos **dónde acabará** y pulsamos GO.", "pics": ["pensar"]},
                {"t": "Después, con **Tale-Bot** en el tapete.", "pics": ["robot"]},
                {"t": "Antes de cada camino, **borrad.**", "pics": ["borrar"]},
            ],
            "ref": {"titulo": "Los botones de Tale-Bot", "tipo": "teclas", "items": TECLAS},
            "logro": ["Hemos dicho dónde acabará antes de pulsar GO.", "Hemos borrado antes de cada camino.", "Hemos cogido el robot con dos manos."],
            "notas": [PASOS_DE_MAS],
            "extra": "Un camino de 4 o 5 pasos con un giro. Antes de pulsar GO, decid en qué casilla acabará.",
        },
        "C": {
            "titulo": "Retos con Tale-Bot",
            "pasos": [
                {"t": "Escuchad el **reto.**", "pics": ["pregunta"]},
                {"t": "Antes de empezar, **borrad.**", "pics": ["borrar"]},
                {"t": "Pulsad las **flechas** y **GO.**", "pics": ["robot"]},
                {"t": "¿No sale? Borrad y **otra vez.**", "pics": ["arreglar"]},
            ],
            "ref": {"titulo": "Los botones de Tale-Bot", "tipo": "teclas", "items": TECLAS},
            "logro": ["Hemos hecho el reto.", "Hemos borrado antes de cada camino.", "Hemos cogido el robot con dos manos."],
            "notas": [PASOS_DE_MAS],
            "extra": "Antes de pulsar GO, decid en qué casilla acabará.",
        },
    },
    "c1-s8": {
        "A": {
            "titulo": "Primero las tarjetas, después los botones", "cols": 2,
            "pasos": [
                {"t": "Poned en la mesa las **tarjetas** del camino.", "pics": ["tarjeta", "camino"]},
                {"t": "**Borrad** la memoria.", "pics": ["borrar"]},
                {"t": "Pulsad los botones **en el orden** de las tarjetas. Y **GO.**", "pics": ["robot"]},
                {"t": "¿No llega? **Cambiad** la tarjeta que falla y otra vez.", "pics": ["arreglar"]},
                {"t": "Ahora, el tesoro **más lejos:** con un giro y una roca.", "pics": ["tesoro", "piedra"]},
            ],
            "ref": {"titulo": "Los botones de Tale-Bot", "tipo": "teclas", "items": TECLAS},
            "logro": ["Hemos puesto las tarjetas antes de pulsar.", "Hemos borrado antes de cada camino.", "El robot llega al tesoro."],
            "notas": [PASOS_DE_MAS],
            "extra": "El camino más corto para esquivar dos rocas.",
        },
        "B": {
            "titulo": "Carrera de metas",
            "pasos": [
                {"t": "Empezad por la **meta 1.**", "pics": ["bandera_meta"]},
                {"t": "**Borrad,** pulsad el camino y **GO.**", "pics": ["borrar", "robot"]},
                {"t": "¿Ha llegado? **Apuntadlo** en la pizarra.", "pics": ["escribir", "pizarra"]},
                {"t": "Después, la **meta 2** y la **meta 3.**", "pics": ["bandera_meta"]},
            ],
            "ref": {"titulo": "Los botones de Tale-Bot", "tipo": "teclas", "items": TECLAS},
            "logro": ["El robot ha llegado a la meta 1.", "Hemos borrado antes de cada camino.", "Hemos apuntado nuestras metas en la pizarra."],
            "notas": [PASOS_DE_MAS],
            "extra": "El camino más corto para esquivar dos rocas.",
        },
    },
}
