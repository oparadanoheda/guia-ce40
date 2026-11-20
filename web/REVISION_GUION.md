# Revisión de las sesiones con guion

Lista de comprobación para revisar las sesiones de un trimestre ya pasadas al formato con guion. Lee antes `web/INSTRUCCIONES_GUION.md` (cómo tenían que hacerse) y el apartado 2 de `LEEME_PROYECTO.md` (criterios del centro). El original de cada sesión se ve con `git show HEAD:<archivo>.md` (el último commit tiene el formato antiguo).

Revisa cada sesión entera, comparándola con su original, y **corrige** lo que encuentres (en el `.md` del curso y en su `web/tablero_cN.py`). No toques otros archivos.

## En la ficha (`.md`)

1. **No se ha perdido nada.** Cada paso, dato, cantidad, aviso, ejemplo y pregunta del original está en algún sitio del guion (o en la lista final de viñetas con etiqueta). Las pistas y soluciones están intactas. Las líneas de cabecera («Para proyectar», «Material listo», archivos, «Para repasar», preguntas de salida, tablets, frase clave, si va rápido, si cuesta, producto, autoevaluación, mates) siguen igual.
2. **No se ha inventado contenido.** Lo añadido se limita a «Hoy», «Necesitas», «Lo han conseguido si», la pregunta del cierre, el paso de recoger y frases de enlace. Quita o corrige cualquier dato nuevo sobre robots, programas o material que no esté en la guía (`07_Guias_rapidas_herramientas.md`, `08_Plantillas_y_material.md`, `web/materiales.py`).
3. **El reparto en fases tiene sentido.** «Empezamos» es lo que hace el docente con toda la clase y cabe en 10 minutos; «A trabajar» es lo que hace el alumnado y llena 25 minutos; «Cerramos» tiene una puesta en común con una pregunta concreta, la frase clave en negrita y la recogida. Si «A trabajar» se queda corto, mira si el original (pasos, «Si va rápido», herramientas, retos de tablet) da para un paso más; no inventes actividades.
4. **«Hoy», «Necesitas» y «Lo han conseguido si»** valen para todas las propuestas de la sesión (o dicen para cuál es cada cosa), son concretos y coinciden con lo que luego pasa en el guion.
5. **«Antes de la clase»** recoge todo lo que había en «Prepara antes» y todo el material de «Material listo» que hay que imprimir (salvo M05, tarjetas de rol, y la rúbrica M19 si la sesión no la usa). Lo que es solo de una propuesta lo dice («Para la propuesta B…»).
6. **Roles y minuto de uso responsable no aparecen como pasos** (ni «Piloto», «Copiloto», «cambio de roles»). Excepción decidida: cuando las normas de uso son el contenido de la sesión (la S1 de cada curso, 1º S7), son el primer paso de «Empezamos» y la sesión no lleva línea «Minuto de uso responsable».
7. **Los recursos están en su paso** y son los mismos enlaces de la cabecera (misma herramienta y variante, mismo texto). El vídeo de la sesión (`web/videos.py`) está en «Empezamos». Una herramienta que el original no decía cuándo usar puede quedarse sin paso.
8. **Coherencia entre propuestas:** lo que es igual en todas está una sola vez tras «En todas las propuestas»; no hay fases repetidas palabra por palabra sin motivo.
9. **Lengua:** castellano de España, frases claras, comillas latinas «…», sin emojis (salvo la bandera de Scratch en los bloques), sin erratas. Bloques entre comillas invertidas solo de 3º a 6º y con el nombre exacto del original.

## En el tablero (`web/tablero_cN.py`)

1. **Los pasos son lo que hace la clase mientras trabaja**, en orden, y corresponden a «A trabajar» de esa propuesta. De 3 a 6 pasos, frases cortas para la edad.
2. **No dan la solución**: ni en los pasos, ni en la pista, ni en la referencia, ni en los bloques (bloques sueltos, no el programa montado; en los archivos con bichos no se dice cuál es el bicho).
3. **«Lo hemos conseguido si…»** se puede comprobar mirando el trabajo y coincide con «Lo han conseguido si» de la ficha.
4. **La referencia (`ref`) ayuda de verdad** y es correcta. Si no aporta, se quita.
5. **`extra`** es el «Si va rápido» de la sesión, sin solución.
6. **En 1º y 2º**, los pictogramas (`pics`) existen en `web/pictos.py` y representan el paso; si uno despista más que ayuda, cámbialo o quítalo.
7. **Cabe en la pizarra:** frases cortas; si hay más de cuatro pasos o llevan bloques, `"cols": 2`.

## Al terminar

Desde `web/`: `python valida_guion.py cN` («Todo bien») y, de 3º a 6º, `python revisar_bloques.py`. No ejecutes `build_web.py`, `empaquetar.py` ni git que modifique nada (`git show` y `git diff` sí).

Entrega un informe breve: qué has corregido en cada sesión (o «sin cambios») y qué dudas de contenido quedan que solo puede resolver el centro.
