# Cómo pasar una sesión al formato con guion

Estas instrucciones son para reescribir las sesiones de un trimestre de un curso de la guía «Código Escuela 4.0 · Primaria» (carpeta del proyecto: la raíz del repositorio). Lee antes, enteros:

1. `LEEME_PROYECTO.md`, apartados 2 («Decisiones del centro y criterios de trabajo») y 4 («Formato de las sesiones», incluido «Sesiones con guion»).
2. El modelo ya hecho: en `5_quinto.md` las sesiones S1, S2 y S3 (primer trimestre) y sus tableros en `web/tablero_c5.py`. También `6_sexto.md` S1 a S3 y `web/tablero_c6.py`.
3. La cabecera de `web/tablero_clase.py` (el formato del tablero).

## Qué hay que entregar

Para cada sesión del trimestre que te toque:

**A. En el `.md` del curso**, la sesión reescrita en el formato con guion (mira el modelo):

- Se conservan tal cual el título con sus etiquetas, «Qué aprenden», y las líneas «Para proyectar», «Preguntas de salida», «En tablets o portátiles», «Material listo», «Archivo de Scratch», «Para repasar», «Minuto de uso responsable», «Frase clave», «Si va rápido», «Si cuesta», «Producto de T…», «Autoevaluación» y «Mates», y el bloque `**Pistas y soluciones:**` entero, sin tocar.
- Se añaden las líneas `- **Hoy:**` (qué hace la clase, una frase), `- **Necesitas:**` (lo imprescindible) y `- **Lo han conseguido si:**` (cómo sabe el docente que ha salido; concreto y observable).
- Se quita `- **Prepara antes:**` y su contenido pasa a `**Antes de la clase:**`: una lista de cosas que hacer, cada una con el enlace a lo que se prepara al final de la línea (`[[M:…]]`, `[[S:…]]`). Todo el material de «Material listo» que haya que imprimir debe aparecer aquí, salvo las tarjetas de rol (M05), que van solas en «Si quieres añadirlo». Si un material lleva aclaración, se escribe pegada al enlace: `[[M:M07|Mapas del tesoro]] (hojas 1 y 2)`.
- El desarrollo se reparte en tres fases, **siempre con estos nombres y estos minutos**: `**Empezamos (10 min):**`, `**A trabajar (25 min):**` y `**Cerramos (10 min):**`. Cada una es una lista numerada de pasos para el docente.
  - **Empezamos:** lo que hace el docente con toda la clase: presentar, demostrar, el vídeo o la herramienta de la pizarra, explicar la misión. En las sesiones quincenales (5º y 6º), el primer paso es leer la tarjeta «Dónde lo dejamos».
  - **A trabajar:** lo que hace el alumnado, por parejas o grupos. Es el corazón de la sesión.
  - **Cerramos:** un grupo enseña lo suyo con una pregunta concreta para la clase; la frase clave en negrita (`Frase clave: **«…»**`); las preguntas de salida si la sesión las tiene; y recoger (qué se guarda y dónde).
- Si la sesión tiene propuestas (`**Opción A · …**`, `**Opción B · …**`), cada propuesta lleva sus fases debajo de su título. Las fases que son iguales en todas van una sola vez, después de una línea `**En todas las propuestas:**` (normalmente «Cerramos»). Si la sesión tenía `**Pasos:**` (sin propuestas), las tres fases van seguidas, sin título de opción.
- **Los recursos, en el paso donde se usan.** Los enlaces del final de un paso salen como botones debajo de ese paso: `[[P:herramienta.variante|Nombre]]` (herramienta de la pizarra), `[[V:id|Nombre]]` (vídeo; los ids y qué sesiones los usan están en `web/videos.py`: pon el vídeo de la sesión en el paso de «Empezamos» donde se presenta el concepto), `[[M:M07|Nombre]]`, `[[S:archivo|Nombre]]`. Usa los mismos enlaces y textos que ya tiene la sesión en sus líneas de cabecera. Si una herramienta de «Para proyectar» no tiene un uso claro en el texto original, no la coloques en ningún paso (queda en la cabecera) y dilo en tu informe.
- Las sublistas van con **4 espacios** de sangría. Los nombres de bloques de Scratch o MakeCode van entre comillas invertidas (`` `por siempre` ``), exactamente como están escritos ya en la sesión o en sus pistas y soluciones: no inventes ni cambies nombres de bloques. En 1º y 2º (sin editor) no se usan comillas invertidas.
- Las observaciones sueltas del original («**Sin Tale-Bot:** …», «**Si el grupo ya maneja…**», «**Aviso:** …», «**Para ti:** …») no se pierden: o se convierten en un paso del guion, o se dejan como viñeta con etiqueta en la lista final (junto a «Frase clave»), y saldrán en «A tener en cuenta».
- No dejes líneas en blanco dentro de una lista. Deja una línea en blanco entre bloques (entre la lista de cabecera, «Antes de la clase», cada opción, cada fase, las pistas y la lista final).

**B. En `web/tablero_cN.py`** (N = el número del curso), una entrada por sesión en el diccionario `TABLERO_CN`: el tablero de la misión, que es lo que ve la clase en la pizarra mientras trabaja. Una clave por propuesta («A», «B», «C»…) o «D» si la sesión no tiene propuestas. Mira el modelo de 5º y la cabecera de `tablero_clase.py`.

- `pasos`: de 3 a 6 frases cortas, escritas para el alumnado («Programamos…», «Probad…»), con lo importante en `**negrita**`. Son el procedimiento que tienen que seguir mientras trabajan, no un resumen de la sesión. Si son muchos o llevan bloques, `"cols": 2`.
- `bloques` (solo de 3º a 6º, en las sesiones con editor): los bloques que necesitan en ese paso, sueltos (no el programa montado), con el nombre exacto que ya usa la sesión.
- `pista`: solo en los pasos difíciles; sale de «Para pensar» o «Pista» de las pistas y soluciones. Nunca la solución.
- `pics` (solo 1º y 2º): uno o dos pictogramas por paso, con nombres de `web/pictos.py` (diccionario `P`) o los iconos `tarjeta`, `repite`, `bloque`. Elige los que de verdad representen el paso.
- `ref`: una referencia visual que ayude mientras trabajan. Tipos: `lista` (frases numeradas), `tabla` (la primera fila es la cabecera), `pictos` (`[[pictograma, pie]]`), `leds`, `teclas`. Si no hay ninguna útil, no pongas `ref`.
- `logro`: dos o tres frases de «Lo hemos conseguido si…», que la clase pueda comprobar mirando su trabajo.
- `notas`: opcional, `[[título, texto]]` para un recordatorio («¿Algo no sale?»).
- `extra`: el reto para quien termine (de «Si va rápido»), sin la solución.

## Criterios (importantes)

- **Rigor: no inventes contenido.** Todo sale de lo que ya dice la sesión (pasos, opciones, pistas y soluciones, notas). No añadas datos sobre los robots, los programas o el material que no estén en la guía (mira `07_Guias_rapidas_herramientas.md` y `08_Plantillas_y_material.md` si dudas). Lo único nuevo que puedes escribir es: «Hoy», «Necesitas», «Lo han conseguido si», la pregunta del cierre, y las frases del tablero (que son las mismas ideas, dichas para la clase). Apunta en tu informe cada cosa que hayas añadido de tu cosecha.
- **Roles y minuto de uso responsable ya no son pasos.** No escribas pasos con «roles», «Piloto», «Copiloto», «cambio de roles» ni el minuto de uso responsable: la ficha los ofrece aparte. Donde el original decía «El Piloto pulsa; el Copiloto comprueba», escribe «uno pulsa y el otro comprueba». Excepción: si el minuto de uso responsable es el contenido de la sesión (normas de uso del robot, por ejemplo), pasa a ser un paso de «Empezamos» y se quita su línea de la cabecera.
- **Opciones concretas, material hecho, nada de preparar cosas raras.** Mantén todas las propuestas que tiene la sesión.
- **Sin emojis** (la única excepción es la bandera verde de Scratch, que ya se escribe así en los bloques: `al hacer clic en 🏴`). Comillas latinas «…». Castellano de España.
- En 1º y 2º las frases del tablero son muy cortas y con palabras sencillas: el docente las lee en voz alta.
- De 1º a 4º no hay IA.

## Cómo trabajar

- Edita **solo** el `.md` de tu curso y tu `web/tablero_cN.py`. No toques ningún otro archivo ni ejecutes `build_web.py`, `empaquetar.py` ni comandos de git.
- Los `.md` tienen finales de línea CRLF: usa la herramienta de edición (que los conserva) y no reescribas el archivo entero con otra codificación. Archivos en UTF-8.
- Cambia únicamente las sesiones del trimestre que te toca; el resto del archivo no se toca.
- Comprueba tu trabajo, desde la carpeta `web/`, con `python valida_guion.py cN` (debe terminar en «Todo bien» y listar tus sesiones como «con guion»). En 3º y 4º, además, `python revisar_bloques.py` (debe decir «Todos los bloques citados existen con ese nombre»). Corrige hasta que pasen.
- Al terminar, entrega un informe breve: sesiones hechas; lo que has añadido de tu cosecha; herramientas de «Para proyectar» que no has colocado en ningún paso; y cualquier duda de contenido o incoherencia que hayas visto en el original.
