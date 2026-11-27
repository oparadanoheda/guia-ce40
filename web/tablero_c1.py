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
    # ---------------------------------------------------------------- segundo trimestre
    "c1-s9": {
        "A": {
            "titulo": "Largo o corto",
            "pasos": [
                {"t": "Hacemos **los dos programas:** el largo y el corto.", "pics": ["aplaudir"]},
                {"t": "¿Hacen **lo mismo**? ¿Cuál es **más corto**?", "pics": ["pensar"]},
                {"t": "Mirad el número del **REPITE:** ¿cuántas palmadas son?", "pics": ["repite", "contar"]},
                {"t": "Ahora, **el baile.**", "pics": ["bailar"]},
            ],
            "ref": {"titulo": "Es lo mismo", "tipo": "lista",
                    "items": ["Palmada, palmada, palmada, palmada.", "REPITE ×4: palmada."]},
            "logro": ["Sabemos cuántas veces se repite.", "Sabemos qué programa es más corto."],
            "extra": "¿Cuántas palmadas hay en «REPITE 3: palmada, palmada»?",
        },
        "B": {
            "titulo": "Bailes con tarjetas",
            "pasos": [
                {"t": "Poned en fila **2 tarjetas** de movimientos.", "pics": ["saltar", "brazos_arriba"]},
                {"t": "Delante, la tarjeta **REPITE.**", "pics": ["repite"]},
                {"t": "Otro grupo **lo baila** leyendo las tarjetas.", "pics": ["grupo", "bailar"]},
                {"t": "**Cambiamos** los programas.", "pics": ["grupo"]},
            ],
            "ref": {"titulo": "Las tarjetas de movimientos", "tipo": "pictos",
                    "items": [["saltar", "Salta"], ["aplaudir", "Aplaude"], ["dar_vuelta", "Da una vuelta"],
                              ["agacharse", "Agáchate"], ["brazos_arriba", "Brazos arriba"], ["andar", "Anda un paso"]]},
            "logro": ["La tarjeta REPITE va delante.", "Otro grupo ha bailado nuestro programa."],
            "extra": "¿Cuántas palmadas hay en «REPITE 3: palmada, palmada»?",
        },
    },
    "c1-s10": {
        "A": {
            "titulo": "El tren de bloques",
            "pasos": [
                {"t": "Empezad con el bloque **EMPIEZA.**", "pics": ["bloque"]},
                {"t": "Enganchad los bloques **en orden,** como un tren.", "pics": ["bloque", "ordenar"]},
                {"t": "Terminad con **FIN.**", "pics": ["bandera_meta"]},
                {"t": "Otro grupo **mueve la ficha** del robot en su tablero.", "pics": ["robot", "grupo"]},
            ],
            "ref": {"titulo": "El programa de la pizarra", "tipo": "lista",
                    "items": ["EMPIEZA", "Avanza", "Avanza", "Gira a la derecha", "Avanza", "FIN"]},
            "logro": ["El programa empieza con EMPIEZA y acaba con FIN.", "Otro grupo lo ha hecho en su tablero."],
            "extra": "Un programa con 6 bloques o más.",
        },
        "B": {
            "titulo": "Tarjetas y bloques",
            "pasos": [
                {"t": "Buscad el **bloque** que hace lo mismo que cada **tarjeta.**", "pics": ["tarjeta", "bloque"]},
                {"t": "Ponedlos **juntos.**", "pics": ["ordenar"]},
                {"t": "**Traducid** un camino: de tarjetas a bloques.", "pics": ["camino", "bloque"]},
            ],
            "logro": ["Cada tarjeta tiene su bloque.", "Hemos escrito el camino con bloques."],
            "extra": "Un programa con 6 bloques o más.",
        },
    },
    "c1-s11": {
        "A": {
            "titulo": "Del papel al robot",
            "pasos": [
                {"t": "Montad el camino con **bloques de papel.**", "pics": ["bloque", "camino"]},
                {"t": "Poned las **tarjetas del robot** en el mismo orden.", "pics": ["tarjeta", "ordenar"]},
                {"t": "**Cargad** las tarjetas y probad.", "pics": ["robot"]},
                {"t": "¿Falla? Cambiad el bloque **y la tarjeta.**", "pics": ["arreglar"]},
            ],
            "ref": {"titulo": "Las normas de True True", "tipo": "lista",
                    "items": ["Se coge con dos manos.", "Nunca en el borde de la mesa.", "Se apaga al terminar."]},
            "logro": ["Las tarjetas van en el mismo orden que los bloques.", "El robot llega al tesoro.", "Hemos cogido el robot con dos manos."],
            "extra": "El camino en U con el menor número de tarjetas.",
        },
        "B": {
            "titulo": "Retos de meta",
            "pasos": [
                {"t": "Empezad por la **meta 1:** un camino recto.", "pics": ["bandera_meta"]},
                {"t": "Poned las **tarjetas** y cargadlas.", "pics": ["tarjeta", "robot"]},
                {"t": "¿Ha llegado? A por la **meta 2:** en L.", "pics": ["bandera_meta"]},
                {"t": "Y la **meta 3:** en U.", "pics": ["bandera_meta"]},
            ],
            "ref": {"titulo": "Las normas de True True", "tipo": "lista",
                    "items": ["Se coge con dos manos.", "Nunca en el borde de la mesa.", "Se apaga al terminar."]},
            "logro": ["El robot ha llegado a la meta 1.", "Hemos probado la meta 2 y la meta 3.", "Hemos cogido el robot con dos manos."],
            "extra": "El camino en U con el menor número de tarjetas.",
        },
    },
    "c1-s12": {
        "A": {
            "titulo": "La escalera",
            "pasos": [
                {"t": "La escalera **sin REPITE:** contad las tarjetas.", "pics": ["escalera", "contar"]},
                {"t": "Ahora **con REPITE:** ¿cuántas tarjetas?", "pics": ["repite", "contar"]},
                {"t": "Haced la escalera con **el robot.**", "pics": ["robot", "escalera"]},
            ],
            "ref": {"titulo": "Cómo se pone REPITE", "tipo": "lista",
                    "items": ["Primero, REPITE y cuántas veces.", "Después, las tarjetas que se repiten."]},
            "logro": ["Sabemos cuántas tarjetas ahorra el REPITE.", "El robot ha subido la escalera."],
            "extra": "Un rectángulo de 2 × 3 casillas: ¿qué se repite y cuántas veces?",
        },
        "B": {
            "titulo": "El cuadrado",
            "pasos": [
                {"t": "El robot hace un **cuadrado** de 2 casillas de lado.", "pics": ["cuadrado", "robot"]},
                {"t": "¿Qué se **repite** en cada lado?", "pics": ["repite", "pensar"],
                 "pista": "¿Cuántos lados tiene un cuadrado? ¿Qué hace el robot en cada lado?"},
                {"t": "¿**Cuántas veces**? Ponedlo en el REPITE.", "pics": ["contar"]},
                {"t": "Probadlo con **el robot.**", "pics": ["robot"]},
            ],
            "ref": {"titulo": "Cómo se pone REPITE", "tipo": "lista",
                    "items": ["Primero, REPITE y cuántas veces.", "Después, las tarjetas que se repiten."]},
            "logro": ["El robot vuelve al principio.", "Hemos usado REPITE."],
            "notas": [["¿No vuelve al principio?", "Mirad los giros: siempre hacia el mismo lado."]],
            "extra": "Un rectángulo de 2 × 3 casillas: ¿qué se repite y cuántas veces?",
        },
    },
    "c1-s13": {
        "A": {
            "titulo": "La historia del robot",
            "pasos": [
                {"t": "Contamos la historia **con bloques,** paso a paso.", "pics": ["bloque"]},
                {"t": "Lo ejecutamos y miramos **el rastro.**", "pics": ["robot", "camino"]},
                {"t": "**Cambiamos un bloque:** ¿cambia la historia?", "pics": ["pensar"]},
            ],
            "ref": {"titulo": "La historia", "tipo": "lista",
                    "items": ["El robot sale de casa.", "Va al árbol.", "Da una vuelta.", "Vuelve."]},
            "logro": ["El robot hace la historia en orden.", "Sabemos qué cambia si cambiamos un bloque."],
            "extra": "Que la historia tenga un REPITE: dos vueltas al árbol.",
        },
        "B": {
            "titulo": "Historia en el tablero",
            "pasos": [
                {"t": "Poned la **casa,** el **árbol** y el **cole** en el tablero.", "pics": ["casa", "arbol"]},
                {"t": "Escribid **con bloques** el paseo del robot.", "pics": ["bloque", "camino"]},
                {"t": "Otro grupo **lo representa** con la ficha.", "pics": ["grupo", "robot"]},
            ],
            "ref": {"titulo": "En el tablero", "tipo": "pictos",
                    "items": [["casa", "Casa"], ["arbol", "Árbol"], ["colegio", "Cole"]]},
            "logro": ["Hemos escrito el paseo con bloques.", "Otro grupo ha hecho nuestro paseo."],
            "extra": "Que la historia tenga un REPITE: dos vueltas al árbol.",
        },
    },
    "c1-s14": {
        "A": {
            "titulo": "Dos estaciones",
            "pasos": [
                {"t": "Escribid el camino con **tarjetas de flechas.**", "pics": ["tarjeta", "camino"]},
                {"t": "En **Tale-Bot:** borrad, pulsad los botones y GO.", "pics": ["borrar", "robot"]},
                {"t": "Cambiad de estación: el **mismo programa** en True True.", "pics": ["robot", "tarjeta"]},
                {"t": "¿Ha llegado **igual**?", "pics": ["tesoro", "pregunta"]},
            ],
            "ref": {"titulo": "Los botones de Tale-Bot", "tipo": "teclas", "items": TECLAS},
            "logro": ["Tale-Bot ha llegado al tesoro.", "True True ha llegado con el mismo programa."],
            "notas": [PASOS_DE_MAS],
            "extra": "Otro grupo adivina a qué ficha llega vuestro programa antes de ejecutarlo.",
        },
        "B": {
            "titulo": "En la pizarra",
            "pasos": [
                {"t": "Dictad un **camino** para la abeja.", "pics": ["abeja", "camino"]},
                {"t": "Lo apuntamos con **tarjetas** en la pizarra.", "pics": ["tarjeta", "pizarra"]},
                {"t": "Pulsamos y **comprobamos.**", "pics": ["senalar"]},
                {"t": "Un grupo lo hace con **el robot.**", "pics": ["robot"]},
            ],
            "logro": ["La abeja ha llegado.", "El robot ha hecho el mismo camino."],
            "extra": "Otro grupo adivina a qué ficha llega vuestro programa antes de ejecutarlo.",
        },
    },
    "c1-s15": {
        "A": {
            "titulo": "Espectáculo del robot",
            "pasos": [
                {"t": "Dibujad el plan: **empieza, pasa, termina.**", "pics": ["dibujar"]},
                {"t": "Escribid el programa **con bloques.**", "pics": ["bloque"]},
                {"t": "Tiene que llevar **un REPITE.**", "pics": ["repite"]},
                {"t": "Pasadlo a **las tarjetas** y probad.", "pics": ["tarjeta", "robot"]},
            ],
            "ref": {"titulo": "El espectáculo lleva", "tipo": "lista",
                    "items": ["Empieza.", "Al menos un movimiento.", "Un REPITE.", "Fin."]},
            "logro": ["El programa tiene empieza, movimiento, REPITE y fin.", "El robot hace nuestro espectáculo."],
            "extra": "Dos REPITE distintos en el espectáculo.",
        },
        "B": {
            "titulo": "Espectáculo en la pizarra",
            "pasos": [
                {"t": "Escribid el programa **con bloques.**", "pics": ["bloque"]},
                {"t": "Tiene que llevar **un REPITE.**", "pics": ["repite"]},
                {"t": "Lo ejecutamos en **la pizarra.**", "pics": ["pizarra", "robot"]},
            ],
            "ref": {"titulo": "El espectáculo lleva", "tipo": "lista",
                    "items": ["Empieza.", "Al menos un movimiento.", "Un REPITE.", "Fin."]},
            "logro": ["El programa tiene empieza, movimiento, REPITE y fin.", "El robot de la pizarra hace nuestro espectáculo."],
            "extra": "Dos REPITE distintos en el espectáculo.",
        },
        "C": {
            "titulo": "Bailando al ritmo",
            "pasos": [
                {"t": "Escuchad **el reto.**", "pics": ["pregunta"]},
                {"t": "Poned las **tarjetas** en orden.", "pics": ["tarjeta", "ordenar"]},
                {"t": "**Probad** con el robot.", "pics": ["robot"]},
                {"t": "¿No sale? **Cambiad** la tarjeta que falla.", "pics": ["arreglar"]},
            ],
            "logro": ["Hemos hecho el reto.", "El robot hace nuestro baile."],
            "extra": "Dos REPITE distintos en el espectáculo.",
        },
    },
    "c1-s16": {
        "A": {
            "titulo": "Muestra de espectáculos",
            "pasos": [
                {"t": "Cada grupo enseña su **espectáculo:** 2 minutos.", "pics": ["robot", "explicar"]},
                {"t": "La clase dice **una cosa** que le ha gustado.", "pics": ["explicar"]},
                {"t": "Al final, **cazabichos** en la pizarra.", "pics": ["bicho", "pizarra"]},
            ],
            "ref": {"titulo": "Cómo se caza un bicho", "tipo": "lista",
                    "items": ["¿Adónde tenía que llegar?", "¿Adónde ha llegado?", "¿En qué tarjeta empieza a fallar?"]},
            "logro": ["Todos los grupos han enseñado su espectáculo.", "Hemos encontrado el bicho."],
            "extra": "Meted un bicho a propósito en el programa de otro grupo para que lo encuentre.",
        },
        "B": {
            "titulo": "Intercambio de programas",
            "pasos": [
                {"t": "Coged el programa de **otro grupo.**", "pics": ["grupo"]},
                {"t": "**Ejecutadlo.**", "pics": ["robot"]},
                {"t": "¿Sale **distinto** de lo que querían? Hay **un bicho.**", "pics": ["bicho"]},
                {"t": "**Buscad** dónde empieza a fallar.", "pics": ["pensar"]},
            ],
            "ref": {"titulo": "Cómo se caza un bicho", "tipo": "lista",
                    "items": ["¿Qué querían que pasara?", "¿Qué ha pasado?", "¿En qué bloque empieza a fallar?"]},
            "logro": ["Hemos ejecutado el programa de otro grupo.", "Si había un bicho, lo hemos encontrado."],
            "extra": "Meted un bicho a propósito en el programa de otro grupo para que lo encuentre.",
        },
    },
    # ---------------------------------------------------------------- tercer trimestre: misión para True True
    "c1-s17": {
        "D": {
            "titulo": "Elegimos la misión",
            "pasos": [
                {"t": "Elegimos **la misión** del robot.", "pics": ["robot", "idea"]},
                {"t": "Elegimos las fichas: **salida, parada y meta.**", "pics": ["bandera_salida", "bandera_meta"]},
                {"t": "La **dibujamos** en la hoja.", "pics": ["dibujar", "papel"]},
                {"t": "Apuntamos **quién hace qué.**", "pics": ["grupo", "escribir"]},
            ],
            "ref": {"titulo": "Misiones de ejemplo", "tipo": "pictos",
                    "items": [["buzon", "Llevar la carta a correos"], ["contenedor", "Llevar la basura al contenedor"],
                              ["colegio", "Ir de casa al cole"]]},
            "logro": ["Tenemos misión.", "Hemos dibujado la salida, la parada y la meta.", "Sabemos quién hace qué."],
            "extra": "Añadid una segunda parada.",
        },
    },
    "c1-s18": {
        "A": {
            "titulo": "Montamos el escenario",
            "pasos": [
                {"t": "Miramos **la hoja** del grupo.", "pics": ["papel", "pensar"]},
                {"t": "Ponemos **las fichas** en el tapete.", "pics": ["casa", "arbol"]},
                {"t": "Probamos una **ruta corta** hasta la parada.", "pics": ["robot", "camino"]},
            ],
            "ref": {"titulo": "Las fichas", "tipo": "pictos",
                    "items": [["casa", "Casa"], ["arbol", "Árbol"], ["colegio", "Cole"], ["buzon", "Correos"],
                              ["contenedor", "Contenedor"], ["semaforo_peatones_verde", "Semáforo"]]},
            "logro": ["Las fichas están donde dice la hoja.", "El robot llega a la parada."],
            "extra": "Poned una roca en el camino directo: el robot tiene que rodearla.",
        },
        "B": {
            "titulo": "Educación vial",
            "pasos": [
                {"t": "Montamos **la ciudad** en el tapete.", "pics": ["casa", "paso_cebra"]},
                {"t": "El robot **para en el semáforo.**", "pics": ["robot", "semaforo_peatones_rojo"]},
                {"t": "Ponemos las **tarjetas** y probamos.", "pics": ["tarjeta", "robot"]},
            ],
            "logro": ["El robot para en el semáforo.", "Hemos probado la ruta."],
            "extra": "Poned una roca en el camino directo: el robot tiene que rodearla.",
        },
    },
    "c1-s19": {
        "D": {
            "titulo": "Programamos la misión",
            "pasos": [
                {"t": "Escribimos la ruta con **bloques de papel.**", "pics": ["bloque", "camino"]},
                {"t": "La **revisamos** con el dedo en el tapete.", "pics": ["senalar", "camino"]},
                {"t": "Ponemos las **tarjetas** en el mismo orden y probamos.", "pics": ["tarjeta", "robot"]},
                {"t": "¿Falla? Buscamos **la tarjeta que falla.**", "pics": ["bicho", "tarjeta"]},
            ],
            "ref": {"titulo": "Si falla", "tipo": "lista",
                    "items": ["No empezamos de cero.", "Buscamos la tarjeta que falla.", "La cambiamos y probamos."]},
            "logro": ["La ruta está escrita con bloques.", "Las tarjetas están en el mismo orden.", "El robot hace la misión."],
            "extra": "La misión de vuelta: de la meta a la salida.",
        },
    },
    "c1-s20": {
        "A": {
            "titulo": "El programa más corto",
            "pasos": [
                {"t": "**Contamos** las tarjetas de nuestra misión.", "pics": ["contar", "tarjeta"]},
                {"t": "Buscamos lo que **se repite.**", "pics": ["repite", "pensar"]},
                {"t": "Lo hacemos **con menos** tarjetas.", "pics": ["repite", "tarjeta"]},
                {"t": "**Probamos:** ¿llega igual?", "pics": ["robot", "pregunta"]},
                {"t": "Lo apuntamos: **antes… ahora…**", "pics": ["pizarra", "escribir"]},
            ],
            "ref": {"titulo": "En la pizarra", "tipo": "lista", "items": ["Antes: 12 tarjetas.", "Ahora: 8 tarjetas.", "4 menos."]},
            "logro": ["Hemos contado las tarjetas.", "Tenemos un programa más corto.", "El robot llega igual."],
            "extra": "¿Cuál es el programa más corto de la clase? Comprobad que llega igual.",
        },
        "B": {
            "titulo": "Detectives de tarjetas",
            "pasos": [
                {"t": "Miramos **el programa de otro grupo.**", "pics": ["grupo", "tarjeta"]},
                {"t": "Buscamos tarjetas **que sobran.**", "pics": ["senalar", "borrar"]},
                {"t": "Buscamos tarjetas **que se pueden juntar** con REPITE.", "pics": ["repite"]},
                {"t": "Se lo decimos **al otro grupo.**", "pics": ["explicar"]},
            ],
            "ref": {"titulo": "Una pista", "tipo": "lista", "items": ["Dos «avanza» seguidos se pueden juntar: REPITE ×2."]},
            "logro": ["Hemos encontrado tarjetas que sobran o que se pueden juntar.", "Se lo hemos dicho al otro grupo."],
            "extra": "¿Cuál es el programa más corto de la clase? Comprobad que llega igual.",
        },
    },
    "c1-s21": {
        "D": {
            "titulo": "Cazabichos cruzado",
            "pasos": [
                {"t": "Dejamos **nuestra misión** montada.", "pics": ["robot", "tarjeta"]},
                {"t": "Probamos la misión **de otro grupo.**", "pics": ["grupo", "robot"]},
                {"t": "Marcamos **la ficha de caritas.**", "pics": ["papel", "lapiz"]},
                {"t": "Volvemos y **arreglamos** la nuestra.", "pics": ["arreglar"]},
            ],
            "ref": {"titulo": "La ficha", "tipo": "pictos",
                    "items": [["robot", "¿Funciona?"], ["bicho", "¿Dónde falla?"], ["estrella", "Lo que más me gusta"]]},
            "logro": ["Hemos probado la misión de otro grupo.", "Hemos rellenado la ficha.", "Hemos arreglado lo que nos han dicho."],
            "extra": "Proponed al otro grupo una mejora, además del bicho.",
        },
    },
    "c1-s22": {
        "D": {
            "titulo": "Ensayamos la presentación",
            "pasos": [
                {"t": "Decimos: **«Nuestra misión es…»**", "pics": ["explicar"]},
                {"t": "**«El robot sale de…»**", "pics": ["bandera_salida", "robot"]},
                {"t": "**«Usamos … tarjetas.»**", "pics": ["contar", "tarjeta"]},
                {"t": "Uno lo dice; **los demás mueven el robot.**", "pics": ["grupo", "robot"]},
            ],
            "ref": {"titulo": "Nuestra frase", "tipo": "lista",
                    "items": ["Nuestra misión es…", "El robot sale de…", "Usamos … tarjetas."]},
            "logro": ["Sabemos decir la frase entera.", "El robot hace la misión mientras la decimos."],
            "extra": "Explicad el recorrido con «delante de», «detrás de» o «a la derecha de».",
        },
    },
    "c1-s23": {
        "D": {
            "titulo": "Presentamos los proyectos",
            "pasos": [
                {"t": "Contamos **la misión.**", "pics": ["explicar"]},
                {"t": "Contamos **cómo la programamos.**", "pics": ["tarjeta"]},
                {"t": "Contamos **un bicho** que encontramos.", "pics": ["bicho"]},
                {"t": "El robot hace la misión **en directo.**", "pics": ["robot"]},
            ],
            "ref": {"titulo": "En 3 minutos", "tipo": "lista",
                    "items": ["La misión.", "Cómo la programamos.", "Un bicho que encontramos."]},
            "logro": ["Hemos presentado nuestra misión.", "El robot la ha hecho en directo.",
                      "Hemos dicho algo que nos ha gustado de otro grupo."],
            "extra": "Adivinad cuántas tarjetas ha usado cada grupo antes de que lo diga.",
        },
    },
    "c1-s24": {
        "A": {
            "titulo": "Las misiones favoritas",
            "pasos": [
                {"t": "Elegimos **las misiones favoritas.**", "pics": ["votar"]},
                {"t": "Las **repetimos** con el robot.", "pics": ["robot", "tarjeta"]},
                {"t": "Recibimos **el pasaporte.**", "pics": ["papel", "estrella"]},
            ],
            "logro": ["Hemos repetido las misiones favoritas.", "Tenemos el pasaporte completo."],
            "extra": "Inventad un reto nuevo para el curso que viene.",
        },
        "B": {
            "titulo": "Enseñamos a Infantil",
            "pasos": [
                {"t": "Por parejas, **con un niño de Infantil.**", "pics": ["pareja"]},
                {"t": "Le enseñamos a **meter una tarjeta.**", "pics": ["tarjeta"]},
                {"t": "Y a **mover el robot.**", "pics": ["robot"]},
            ],
            "logro": ["Un niño de Infantil ha movido el robot.", "Le hemos explicado cómo se mete una tarjeta."],
            "extra": "Inventad un reto nuevo para el curso que viene.",
        },
    },
}
