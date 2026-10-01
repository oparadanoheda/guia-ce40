# Vídeos animados de conceptos · encargo para Claude

Este documento es para ti, Claude. Contiene las normas comunes y el guion de cada **vídeo animado** que vas a crear para la guía didáctica **Código Escuela 4.0 · Primaria** de un colegio público de Madrid.

**Cómo vamos a trabajar**
- Los vídeos se hacen **de uno en uno**. En cada petición se te indicará el número del vídeo. Haz **solo ese**, siguiendo su guion y las normas comunes.
- Entrega **un único archivo** con el nombre que indica su guion (por ejemplo, `anim-bucle.html`). Si tienes acceso a la carpeta del proyecto, guárdalo en `animaciones_nuevas/`.
- Junto al archivo, entrega la lista de comprobaciones del apartado «Antes de entregar».
- Si algo del guion es imposible o contradice las normas, avisa antes de inventar una solución.

## Qué son

Son **vídeos animados cortos (45 a 90 segundos)** que explican un concepto de programación con una pequeña historia: el robot tiene un problema, lo intenta, aparece la idea y se resuelve. Se proyectan en la pizarra digital de un aula de Primaria (6 a 12 años), dentro de la asignatura de Matemáticas. **No son diapositivas**: se reproducen solos, de corrido, como un vídeo. Todo en castellano de España.

Se usarán de dos formas: como página interactiva dentro de la guía y convertidos a vídeo MP4. La conversión la hace otra herramienta, grabando fotograma a fotograma; por eso son obligatorias las normas de «Motor de animación».

## Normas comunes (para todos los vídeos)

### Formato técnico (obligatorio)

- Un único archivo .html autónomo: HTML, CSS y JavaScript dentro del archivo, dibujos en SVG o canvas dentro del archivo. Nada externo: ni bibliotecas, ni CDN, ni fuentes de Google, ni imágenes enlazadas. Tiene que funcionar abriendo el archivo sin internet.
- Tamaño máximo 400 KB.
- Lienzo lógico de **1920 × 1080** (16:9) que se escala a cualquier ventana manteniendo la proporción, con márgenes si hace falta. Debe verse bien a pantalla completa en una pizarra y en un portátil.
- Fondo #fbfbf8. Tipografía: system-ui, "Segoe UI", Arial, sans-serif. Texto en #1a1d24.

### Motor de animación (obligatorio, para poder grabarlo en MP4)

- Todo lo que se ve es **función del tiempo**: una función `render(t)`, con `t` en segundos, dibuja el fotograma exacto de ese instante. Nada de animaciones CSS, transiciones CSS ni cadenas de `setTimeout`. Solo `requestAnimationFrame` para hacer avanzar `t` mientras se reproduce.
- **Determinista:** sin números aleatorios (o con semilla fija). Ver el segundo 23,5 dos veces da exactamente el mismo fotograma.
- Expón este objeto global:
  `window.ANIM = { duration, seek(t), play(), pause(), chapters: [{ t, titulo }], pausas: [{ t, pregunta }] }`
  - `seek(t)` dibuja el instante `t` al momento y deja el vídeo en pausa.
- Si la dirección lleva `?export=1`, oculta todos los controles y la pantalla de inicio, no hace pausas para pensar y no reproduce nada solo. Los subtítulos **sí** se ven: quedan grabados en el MP4.

### Reproductor

- Al abrir, se muestra el primer fotograma con un **botón grande de reproducir** en el centro y el título del vídeo.
- Barra inferior que se oculta sola mientras se reproduce y reaparece al mover el ratón o tocar la pantalla:
  - reproducir/pausa;
  - **barra de progreso** con marcas de capítulo, que permite ir a cualquier momento tocando o arrastrando;
  - tiempo actual y total;
  - volver a empezar;
  - velocidad (0,75× y 1×);
  - interruptor **«Pausas para pensar»**;
  - pantalla completa.
- Teclado: espacio = reproducir/pausa; flechas izquierda y derecha = 5 segundos atrás o adelante; Inicio = volver a empezar.
- Al terminar se queda en el último fotograma (la frase clave), con el botón de volver a ver.

### Pausas para pensar

- Cada guion marca 2 o 3 momentos con una pregunta. La pregunta se coloca justo antes de que se vea la respuesta, para que la clase la prediga.
- **Si el interruptor está activado** (apagado por defecto), al llegar a ese momento el vídeo se para solo y muestra la pregunta en un recuadro grande. El docente pregunta a la clase y, cuando quiere, pulsa reproducir para continuar.
- Si está apagado, el vídeo sigue de corrido y la pregunta no aparece.

### Subtítulos (la narración)

- **No hay voz ni sonido.** La narración son subtítulos grandes en la parte inferior: como mínimo 4,5 % de la altura, fondo semitransparente oscuro y texto blanco.
- Usa exactamente los subtítulos del guion, en los tiempos indicados (puedes ajustar ±1 s para que encajen con la animación). Como máximo dos líneas a la vez.
- Si un subtítulo da la respuesta a una pausa para pensar, no aparece justo después de la pregunta: aparece cuando la respuesta se ve en pantalla (dentro del tramo de su guion y con al menos 3 s en pantalla).
- Ritmo lento, para que lean alumnos de 1º: cada subtítulo, al menos 3 segundos en pantalla.
- El vídeo termina siempre con la **FRASE CLAVE** grande y centrada, entre comillas «», durante al menos 4 segundos.

### Estilo visual

- Ilustración plana, limpia, amable, con esquinas redondeadas y sombras suaves. Nada recargado. Movimientos suaves (ease-in-out). Pequeños detalles que den vida: el robot «respira» o parpadea, el cofre brilla, una celebración con algo de confeti cuando sale bien. Sin exagerar.
- Cámara: se pueden usar acercamientos suaves para enfocar algo (una tarjeta, el robot), pero sin marear.
- Paleta (úsala, no inventes otros colores salvo grises):
  rojo #cf3f36 · naranja #df7619 · verde #2a8f4f · turquesa #108394 · azul #2c5bbf · morado #6c44b0 · amarillo #f5c518 · tinta #1a1d24 · gris claro #eceef2.
- Tablero, cuando haya cuadrícula: una isla. Agua #4fa3d9 alrededor con olas suaves, borde de arena #f2d39b y casillas de hierba en damero (#9ed97c y #8fcf6e, borde #6fb24f).
- Tarjetas de flechas, iguales que las de papel de la guía: cuadrado redondeado de color con una flecha blanca gruesa.
  - **AVANZA:** fondo azul #2c5bbf, flecha recta hacia arriba.
  - **GIRA A LA DERECHA:** fondo verde #2a8f4f, flecha curva en el sentido de las agujas del reloj.
  - **GIRA A LA IZQUIERDA:** fondo naranja #df7619, flecha curva en sentido contrario.
  - **REPITE:** tarjeta naranja #f39a2b con el texto «REPITE ×N»; las tarjetas que se repiten van DENTRO de ella.
- El personaje es SIEMPRE este robot (en el registro superior, su versión sobria; ver «Registro según la edad»): visto desde arriba, mira hacia donde apunta su triángulo amarillo. Úsalo tal cual, escalándolo. Mide 60 × 60 y su centro es (30, 30):

```svg
<svg viewBox="0 0 60 60"><ellipse cx="30" cy="54" rx="19" ry="4" fill="rgba(0,0,0,.18)"/><rect x="6" y="18" width="8" height="24" rx="3" fill="#1a1d24"/><rect x="46" y="18" width="8" height="24" rx="3" fill="#1a1d24"/><rect x="11" y="13" width="38" height="38" rx="11" fill="#2c5bbf" stroke="#1b3f8f" stroke-width="2.5"/><rect x="15" y="17" width="30" height="10" rx="5" fill="#ffffff" opacity=".18"/><path d="M22 13L30 1L38 13Z" fill="#f5c518" stroke="#b8860b" stroke-width="2" stroke-linejoin="round"/><circle cx="23" cy="29" r="5.5" fill="#fff"/><circle cx="37" cy="29" r="5.5" fill="#fff"/><circle cx="23" cy="27.5" r="2.6" fill="#1a1d24"/><circle cx="37" cy="27.5" r="2.6" fill="#1a1d24"/><path d="M23 41Q30 46 37 41" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>
```

### Accesibilidad

- Nada que parpadee más de 3 veces por segundo.
- Si el sistema tiene activado «reducir movimiento» (`prefers-reduced-motion`), se mantienen los movimientos necesarios para entender la historia, pero sin temblores, zooms de cámara, confeti ni rebotes.

### Reglas de contenido (no las rompas nunca)

- El robot empieza mirando hacia arriba salvo que se diga otra cosa.
- **AVANZA:** el robot pasa a la casilla de delante, hacia donde mira.
- **GIRA A LA DERECHA / IZQUIERDA:** el robot gira 90 grados SIN moverse de su casilla.
- Al ejecutar un programa, se ilumina la tarjeta que se está ejecutando en cada momento (borde amarillo #f5c518), y el robot hace ese movimiento a la vez.
- Los recuentos de tarjetas y pasos que aparezcan en pantalla tienen que ser exactos. Compruébalos antes de entregar.
- Nada de violencia, ni marcas comerciales, ni personajes conocidos. Personas, si aparecen: siluetas sencillas y diversas, sin rasgos detallados.

### Registro según la edad

Cada vídeo usa el registro que corresponde a sus cursos. Los subtítulos y los textos del guion no cambian; cambia el tratamiento visual.

| Registro | Cursos | Vídeos |
|---|---|---|
| **Inicial** | 1º-2º | 1, 3 y la versión A de 6, 8, 9 y 10 |
| **Medio** | 3º-4º | 2, 4, 5, 11 |
| **Superior** | 5º-6º | 7, 12, 13 y la versión B de 6, 8, 9 y 10 |

- Los vídeos que abarcan de 1º-2º a 5º-6º (6, 8, 9 y 10) tienen **dos versiones**: A (registro inicial) con el nombre del guion, y B (registro superior) con el sufijo `-superior` (por ejemplo, `anim-depurar-superior.html`).
- **Inicial:** lo descrito en «Estilo visual»: una pequeña historia, el robot como personaje (respira, parpadea, se alegra), celebraciones, ritmo lento.
- **Medio:** como el inicial, con menos adornos (sin sudor, sin saltitos de alegría) y algo más de información en pantalla.
- **Superior:**
  - Aspecto de herramienta real: paneles como los de un editor de bloques (escenario, variables, programa), bloques con sus nombres completos, monitores de variables, tablas de seguimiento y diagramas. Sin marcas ni logotipos.
  - El robot es un objeto del escenario, no un personaje: no respira, no se alegra, no suda. Se usa su **versión sobria**: misma silueta, colores y triángulo de dirección, pero sin ojos ni sonrisa. Mide 60 × 60 y su centro es (30, 30):

    ```svg
    <svg viewBox="0 0 60 60"><ellipse cx="30" cy="54" rx="19" ry="4" fill="rgba(0,0,0,.14)"/><rect x="6" y="18" width="8" height="24" rx="2" fill="#1a1d24"/><rect x="46" y="18" width="8" height="24" rx="2" fill="#1a1d24"/><rect x="11" y="13" width="38" height="38" rx="7" fill="#2c5bbf"/><rect x="17" y="24" width="26" height="6" rx="3" fill="#1a1d24"/><circle cx="37" cy="27" r="1.8" fill="#4fa3d9"/><rect x="17" y="38" width="26" height="2" rx="1" fill="#fff" opacity=".35"/><path d="M23 13L30 3L37 13Z" fill="#f5c518"/></svg>
    ```
  - Sin confeti, rebotes, temblores ni zooms de cámara. Movimientos limpios y cortos. El éxito se marca con un tic o con un cambio de valor, no con una celebración.
  - Más información a la vez: se permiten etiquetas pequeñas de apoyo (mínimo 2,5 % de la altura), además de los subtítulos.
  - Las pausas para pensar piden predecir un resultado o localizar un fallo.
  - La pantalla final muestra la frase clave sin la mascota.

### Antes de entregar, revisa y enumera en una lista breve

1. Que el archivo no carga nada externo.
2. Que `window.ANIM`, `seek(t)` y `?export=1` funcionan como se pide, y que la animación es determinista.
3. Que los movimientos del robot y los recuentos son correctos en todo el vídeo.
4. Que las pausas para pensar funcionan con el interruptor encendido y no aparecen con él apagado.
5. La duración total del vídeo.

---

## Guiones

Cada guion indica el archivo, el curso, la idea, los capítulos y una línea de tiempo con lo que pasa y el subtítulo exacto. Los tiempos son orientativos (±1 s). **Pausa** indica una pausa para pensar.

### 1. Algoritmo · `anim-algoritmo.html` · 1º y 2º · unos 60 s

**Idea:** un algoritmo es una lista de pasos en orden; el robot hace exactamente lo que dicen las tarjetas.
**Escenario:** isla de 5 × 5. Robot en la columna 3, fila 5, mirando hacia arriba. Cofre del tesoro (dibujo plano) en la columna 3, fila 2. Fila de tarjetas debajo del tablero.
**Capítulos:** El tesoro (0 s) · Las instrucciones (8 s) · ¿Y si cambio una? (26 s) · Qué es un algoritmo (48 s).

- **0-8 s** · Aparece la isla; la cámara se acerca al robot, que mira al cofre brillante. Subtítulo: «El robot quiere llegar al tesoro.»
- **8-16 s** · Caen una a una tres tarjetas AVANZA, numeradas 1, 2 y 3. Subtítulo: «Le damos instrucciones, una detrás de otra.»
- **16 s · Pausa:** «¿Llegará al tesoro con estas tarjetas?»
- **16-26 s** · Se ejecutan las tres tarjetas, iluminándose cada una; el robot avanza tres casillas y llega al cofre, que se abre. Celebración breve. Subtítulo: «Las sigue una a una… ¡y llega!»
- **26-34 s** · El robot vuelve a la salida. La tarjeta 2 se da la vuelta y pasa a ser GIRA A LA DERECHA. Subtítulo: «¿Y si cambiamos una tarjeta?»
- **34 s · Pausa:** «¿Dónde acabará ahora el robot?»
- **34-48 s** · Se ejecuta: avanza (fila 4), gira a la derecha sin moverse, avanza (columna 4, fila 4). No llega; sobre el robot aparece una interrogación suave. Subtítulo: «El robot no adivina: hace lo que pone.»
- **48-56 s** · Texto grande: «Un algoritmo es una lista de pasos en orden.» Subtítulo: el mismo.
- **56-62 s** · FRASE CLAVE: «Un robot no adivina: hace lo que le dices.»

### 2. Descomponer · `anim-descomponer.html` · 1º a 4º · unos 55 s

**Idea:** un problema grande se parte en partes pequeñas que se hacen una a una.
**Capítulos:** El problema (0 s) · Lo partimos (10 s) · Una parte cada vez (20 s) · Qué es descomponer (44 s).

- **0-10 s** · Un bloque verde enorme con el texto «HACER UN VIDEOJUEGO» cae en el centro y tiembla un poco; el robot lo mira, agobiado. Subtítulo: «Queremos hacer un videojuego. ¡Es mucho de golpe!»
- **10 s · Pausa:** «¿Qué partes tiene un videojuego?»
- **10-20 s** · El bloque se parte en 5 piezas que bajan unidas por líneas: Personaje, Premio, Enemigo, Puntos, Final. Subtítulo: «Lo partimos en piezas pequeñas.»
- **20-36 s** · Las piezas se completan una a una con un tic verde. A la vez, en una pantalla de juego a la derecha aparece cada parte: el robot (personaje), una manzana (premio), un meteorito morado con pinchos (enemigo), un marcador «Puntos: 0» y un cartel «¡Has ganado!» (final). Subtítulo: «Hacemos una pieza cada vez.»
- **36 s · Pausa:** «¿Qué pasará al juntar todas las piezas?»
- **36-44 s** · El juego cobra vida: el robot coge la manzana y el marcador pasa a «Puntos: 1». Subtítulo: «Al juntarlas, el juego está hecho.»
- **44-50 s** · Texto grande: «Descomponer es partir un problema grande en partes pequeñas.»
- **50-56 s** · FRASE CLAVE: «Paso a paso, todo es más fácil.»

### 3. Patrón · `anim-patron.html` · 1º a 3º · unos 55 s

**Idea:** un patrón es algo que se repite con una regla; si descubro la regla, sé lo que viene.
**Capítulos:** ¿Qué viene? (0 s) · La regla (10 s) · Patrones que crecen (24 s) · Qué es un patrón (40 s).

- **0-10 s** · El robot coloca figuras en fila: círculo rojo, cuadrado azul, círculo rojo, cuadrado azul, círculo rojo; queda un hueco con «?». Subtítulo: «El robot coloca figuras. ¿Qué viene ahora?»
- **10 s · Pausa:** «¿Qué figura va en el hueco?»
- **10-18 s** · Las figuras se agrupan en parejas (círculo rojo + cuadrado azul) con un recuadro suave. Subtítulo: «La regla: rojo, azul, rojo, azul…»
- **18-24 s** · El hueco se llena con un cuadrado azul que cae con un pequeño salto. Subtítulo: «¡Viene un cuadrado azul!»
- **24-32 s** · Tres figuras de cuadraditos naranjas: la 1 tiene 1, la 2 tiene 2 y la 3 tiene 3, en columna. La figura 4 es «?». Subtítulo: «Hay patrones que crecen.»
- **32 s · Pausa:** «¿Cuántos cuadrados tendrá la figura 4?»
- **32-40 s** · La «?» se convierte en 4 cuadraditos que aparecen uno a uno. Subtítulo: «Cada vez, uno más: la figura 4 tiene 4.»
- **40-48 s** · Texto grande: «Un patrón es algo que se repite siguiendo una regla.»
- **48-54 s** · FRASE CLAVE: «Busca lo que se repite.»

### 4. Bucle · `anim-bucle.html` · 1º a 4º · unos 75 s

**Idea:** un bucle repite varias veces lo mismo sin escribirlo cada vez. Mismo camino, menos tarjetas.
**Escenario:** isla de 4 × 4. Robot en la columna 2, fila 3, mirando hacia arriba. Va a recorrer un cuadrado de 1 casilla de lado y deja un rastro naranja (#df7619).
**Capítulos:** El cuadrado (0 s) · Sin bucle (8 s) · Lo que se repite (30 s) · Con bucle (42 s) · Qué es un bucle (64 s).

- **0-8 s** · Se ve el robot y, en línea discontinua, el cuadrado que quiere recorrer. Subtítulo: «El robot quiere dar una vuelta en cuadrado.»
- **8-16 s** · Caen 8 tarjetas: AVANZA, GIRA A LA DERECHA, AVANZA, GIRA A LA DERECHA, AVANZA, GIRA A LA DERECHA, AVANZA, GIRA A LA DERECHA. Contador grande: «8 tarjetas». Subtítulo: «Sin bucle, necesita 8 tarjetas.»
- **16-30 s** · Se ejecutan, iluminando cada tarjeta. Movimiento: avanza a la fila 2 y gira a la derecha; avanza a la columna 3 y gira a la derecha (mira abajo); avanza a la fila 3 y gira a la derecha (mira a la izquierda); avanza a la columna 2 y gira a la derecha (vuelve a mirar arriba). El rastro forma el cuadrado. Subtítulo: «Funciona… pero son muchas tarjetas.»
- **30 s · Pausa:** «¿Qué se repite en este programa?»
- **30-42 s** · Las tarjetas se agrupan en 4 parejas iguales con un recuadro y los números 1, 2, 3, 4. Subtítulo: «“Avanza, gira” se repite 4 veces.»
- **42-50 s** · Las 4 parejas se funden en una sola, que entra en una tarjeta «REPITE ×4». Contador: «3 tarjetas». Subtítulo: «Con un bucle: REPITE 4 veces.»
- **50 s · Pausa:** «¿Hará el mismo camino?»
- **50-64 s** · Se borra el rastro, el robot vuelve a la salida y se ejecuta el programa con REPITE. Contador «vuelta 1 de 4» … «vuelta 4 de 4»; se iluminan REPITE y, dentro, AVANZA y GIRA. El mismo cuadrado. Subtítulo: «Hace exactamente lo mismo.»
- **64-70 s** · Texto grande: «Un bucle repite varias veces lo mismo.» Debajo: «8 tarjetas → 3 tarjetas».
- **70-76 s** · FRASE CLAVE: «Menos tarjetas, mismo camino.»

### 5. Condición · `anim-condicion.html` · 2º a 4º · unos 70 s

**Idea:** una condición es una pregunta que decide qué se hace. Ejemplo: el semáforo de PEATONES (el del muñeco), no el de coches.
**Escenario:** un niño o una niña en silueta sencilla, en el bordillo, ante un paso de cebra. Semáforo de peatones con dos luces: muñeco rojo quieto arriba y muñeco verde caminando abajo.
**Capítulos:** ¿Puedo cruzar? (0 s) · En rojo (8 s) · En verde (22 s) · El diagrama (40 s) · Qué es una condición (58 s).

- **0-8 s** · Se ve la calle; el semáforo aún está apagado. Subtítulo: «¿Puedo cruzar? Depende del semáforo.»
- **8 s · Pausa:** «Si el muñeco está en rojo, ¿qué hago?»
- **8-22 s** · Se enciende el muñeco ROJO. El personaje se queda quieto en el bordillo. Subtítulo: «SI el muñeco está en rojo, ENTONCES espero.»
- **22-40 s** · Se enciende el muñeco VERDE. El personaje primero mira a la izquierda y a la derecha, y DESPUÉS cruza por el paso de cebra (el orden importa). Subtítulo: «SI está en verde, ENTONCES miro a los lados y cruzo.»
- **40-50 s** · Se dibuja un rombo naranja con «¿El muñeco está en verde?». Salen dos flechas: «SÍ» (verde) hacia «Miro a los lados y cruzo» y «NO» (roja) hacia «Espero en el bordillo». Subtítulo: «Así se dibuja una condición.»
- **50 s · Pausa:** «¿Qué camino del diagrama se sigue con el muñeco en rojo?»
- **50-58 s** · Junto al diagrama, en miniatura: luz roja (se ilumina la flecha NO) y luz verde (se ilumina la flecha SÍ). Subtítulo: «La pregunta decide el camino.»
- **58-64 s** · Texto grande: «Una condición es una pregunta que decide qué hacer.»
- **64-70 s** · FRASE CLAVE: «Si se cumple… si no…»

### 6. Evento · `anim-evento.html` · 2º a 6º · unos 65 s

**Idea:** un evento es la señal que hace que un programa empiece («CUANDO pasa algo…»). Cada programa espera su señal.
**Capítulos:** En el cole (0 s) · El bloque CUANDO (12 s) · Cada uno con su señal (22 s) · Qué es un evento (54 s).

- **0-12 s** · Un timbre de colegio suena (ondas) y unas siluetas de niños salen por una puerta al patio. Subtítulo: «CUANDO suena el timbre, salimos al recreo.»
- **12-22 s** · Arriba aparece una pieza amarilla con forma de «gorro», como los bloques de evento de Scratch (#f5c518, texto oscuro): «CUANDO suena el timbre», con otra pieza enganchada debajo: «salimos al recreo». Subtítulo: «En programación, esa señal se llama evento.»
- **22-30 s** · Tres robots en fila. Encima de cada uno, su bloque amarillo: «CUANDO toco la bandera verde», «CUANDO pulso la tecla espacio», «CUANDO aplaudo». Los tres esperan, respirando. Subtítulo: «Cada robot espera su señal.»
- **30 s · Pausa:** «Si toco la bandera verde, ¿qué robot se moverá?»
- **30-38 s** · Se ilumina una bandera verde: solo el primer robot da un saltito y avanza. Subtítulo: «Bandera verde: solo se mueve el primero.»
- **38 s · Pausa:** «Y si pulso la tecla espacio, ¿cuál se moverá?»
- **38-46 s** · Se ilumina la tecla «espacio»: solo se mueve el segundo. Subtítulo: «Tecla espacio: solo el segundo.»
- **46-54 s** · Unas manos aplauden (sin sonido): solo se mueve el tercero. Subtítulo: «Un aplauso: solo el tercero.»
- **54-60 s** · Texto grande: «Un evento es la señal que hace empezar un programa.»
- **60-66 s** · FRASE CLAVE: «Cada programa espera su señal.»

### 7. Variable · `anim-variable.html` · 3º a 6º · unos 65 s

**Idea:** una variable es una caja con nombre que guarda un número que puede cambiar.
**Escenario:** a la izquierda, una pequeña isla de juego con el robot, manzanas rojas y un meteorito morado; a la derecha, las «cajas» de las variables.
**Capítulos:** La caja (0 s) · Sumar puntos (12 s) · Otra caja (36 s) · Qué es una variable (54 s).

- **0-12 s** · Aparece una caja dibujada con una etiqueta azul «puntos» y un 0 grande dentro. Junto a ella, un bloque naranja (#ff8c1a, como las variables de Scratch): «dar a puntos el valor 0». Subtítulo: «Una variable es una caja con nombre. Al empezar, puntos vale 0.»
- **12 s · Pausa:** «Si el robot coge 3 manzanas, ¿qué número habrá en la caja?»
- **12-30 s** · El robot coge tres manzanas, una a una. Cada vez aparece el bloque «sumar a puntos 1» y el número de la caja cambia con un salto: 0 → 1 → 2 → 3. Subtítulo: «Cada manzana: sumar 1 a puntos.»
- **30-36 s** · Se iluminan la etiqueta «puntos» (no ha cambiado) y el «3» (ha cambiado). Subtítulo: «La caja se llama igual. Lo de dentro cambia.»
- **36-46 s** · Aparece una segunda caja, «vidas», con un 3. El robot choca con el meteorito: aparece «sumar a vidas -1» y vidas pasa a 2. Subtítulo: «Puede haber varias cajas: aquí, las vidas.»
- **46 s · Pausa:** «Si choca otra vez, ¿cuántas vidas le quedan?»
- **46-54 s** · Choca otra vez: vidas pasa a 1. Subtítulo: «Otro choque: le queda 1 vida.»
- **54-60 s** · Texto grande: «Una variable guarda un número que puede cambiar.»
- **60-66 s** · FRASE CLAVE: «La caja se llama igual; lo de dentro cambia.»

### 8. Depurar · `anim-depurar.html` · 1º a 6º · unos 75 s

**Idea:** depurar es encontrar el error («el bicho») y arreglarlo. Equivocarse es parte de programar.
**Escenario:** isla de 5 × 5. Robot en la columna 1, fila 5, mirando hacia arriba. Cofre en la columna 1, fila 1. Programa de 4 tarjetas numeradas: AVANZA, AVANZA, GIRA A LA DERECHA, AVANZA. Lo correcto sería AVANZA ×4: el bicho es la tarjeta 3.
**Capítulos:** El programa (0 s) · No llega (8 s) · Buscamos el bicho (22 s) · Lo arreglamos (46 s) · Qué es depurar (64 s).

- **0-8 s** · Aparecen el tablero, el robot, el cofre y las 4 tarjetas. Subtítulo: «El robot tiene que ir recto, 4 casillas, hasta el tesoro.»
- **8 s · Pausa:** «¿Llegará con este programa?»
- **8-22 s** · Se ejecuta: avanza (fila 4), avanza (fila 3), gira a la derecha sin moverse, avanza (columna 2, fila 3). Junto al robot aparece un bicho simpático (un escarabajo amable). Subtítulo: «¡No llega! El programa tiene un bicho.»
- **22-30 s** · Una flecha discontinua verde marca el camino que se quería (recto hasta el cofre) y una naranja el que ha hecho. Subtítulo: «¿Qué quería que pasara? ¿Qué ha pasado?»
- **30 s · Pausa:** «¿En qué tarjeta empieza a fallar?»
- **30-46 s** · El robot vuelve a la salida y se ejecuta paso a paso, despacio. Tarjetas 1 y 2: tic verde. Tarjeta 3: se marca en rojo y el bicho salta encima. Subtítulo: «Paso a paso… ¡aquí está el bicho!»
- **46-54 s** · La tarjeta 3 se da la vuelta y pasa a ser AVANZA; el bicho se va andando. Subtítulo: «Cambiamos la tarjeta 3.»
- **54-64 s** · Se ejecuta AVANZA ×4 y el robot llega al cofre. Celebración. Subtítulo: «Probamos otra vez… ¡conseguido!»
- **64-70 s** · Texto grande: «Depurar es encontrar el error y arreglarlo.»
- **70-76 s** · FRASE CLAVE: «¿Qué quería que pasara y qué ha pasado?»

### 9. Entrada y salida · `anim-entrada-salida.html` · 1º a 6º · unos 55 s

**Idea:** algo entra (lo que pulsamos o lo que mide un sensor), el programa decide y algo sale (lo que hace la máquina).
**Escenario:** tres columnas con su etiqueta: «ENTRADA» (azul #2c5bbf), «PROGRAMA» (naranja #df7619) y «SALIDA» (verde #2a8f4f), unidas por flechas. En cada ejemplo, una bolita de luz viaja de la entrada al programa y del programa a la salida.
**Capítulos:** Las tres partes (0 s) · Un botón (8 s) · Un toque (20 s) · Un sensor (32 s) · Resumen (46 s).

- **0-8 s** · Aparecen las tres columnas vacías. Subtítulo: «Las máquinas reciben algo y hacen algo.»
- **8-20 s** · ENTRADA: un dedo pulsa un botón con flecha. PROGRAMA: un engranaje gira. SALIDA: el robot avanza una casilla. Subtítulo: «Pulso un botón y el robot avanza.»
- **20 s · Pausa:** «Si toco el papel de aluminio, ¿qué saldrá?»
- **20-32 s** · ENTRADA: una mano toca una placa de papel de aluminio unida por un cable a una placa (sin marca). PROGRAMA: engranaje. SALIDA: notas musicales que salen de un altavoz (solo el dibujo). Subtítulo: «Toco el aluminio y suena una nota.»
- **32 s · Pausa:** «Si se hace de noche, ¿qué pasará con las luces?»
- **32-46 s** · ENTRADA: un sensor de luz; el sol se oculta tras una nube y anochece. PROGRAMA: engranaje. SALIDA: una placa con una cuadrícula de 5 × 5 luces rojas que se encienden. Subtítulo: «Hay poca luz y se encienden las luces.»
- **46-50 s** · Texto grande: «Entrada → programa → salida.»
- **50-56 s** · FRASE CLAVE: «Algo entra, el programa decide, algo sale.»

### 10. Optimizar · `anim-optimizar.html` · 1º a 6º · unos 70 s

**Idea:** optimizar es conseguir lo mismo con menos pasos.
**Escenario:** isla de 5 × 5. Robot en la columna 1, fila 5, mirando hacia arriba. Recorre tres lados de un cuadrado de 3 casillas de lado y deja un rastro naranja.
**Capítulos:** El programa largo (0 s) · ¿Qué se repite? (24 s) · El programa corto (36 s) · Qué es optimizar (60 s).

- **0-8 s** · Caen 12 tarjetas en fila: AVANZA, AVANZA, AVANZA, GIRA A LA DERECHA, repetido tres veces. Contador: «12 tarjetas». Subtítulo: «Este programa tiene 12 tarjetas.»
- **8-24 s** · Se ejecuta: el robot sube 3 casillas (fila 2) y gira a la derecha; avanza 3 a la derecha (columna 4) y gira a la derecha; baja 3 (fila 5) y gira a la derecha. Queda en la columna 4, fila 5, mirando a la izquierda. El rastro dibuja una forma de «∩». Subtítulo: «Funciona… pero es muy largo.»
- **24 s · Pausa:** «¿Qué se repite?»
- **24-36 s** · Las 12 tarjetas se agrupan en 3 grupos iguales de 4 (AVANZA, AVANZA, AVANZA, GIRA A LA DERECHA), con recuadros y los números 1, 2, 3. Subtítulo: «“Avanza 3 veces y gira” se repite 3 veces.»
- **36-44 s** · Los tres grupos se funden en uno que entra en una tarjeta «REPITE ×3». Contador: «5 tarjetas». Subtítulo: «Lo juntamos con REPITE ×3.»
- **44 s · Pausa:** «¿Cuántas tarjetas nos hemos ahorrado?»
- **44-60 s** · Se borra el rastro, el robot vuelve a la salida y se ejecuta el programa corto: hace exactamente el mismo recorrido. Al final aparece «12 − 5 = 7». Subtítulo: «Mismo camino, 7 tarjetas menos.»
- **60-66 s** · Texto grande: «Optimizar es conseguir lo mismo con menos pasos.»
- **66-72 s** · FRASE CLAVE: «¿Se podría hacer con menos pasos?»

### 11. Coordenadas (x, y) · `anim-coordenadas.html` · 3º y 4º · unos 70 s

**Idea:** dos números dicen dónde está algo: x (izquierda o derecha) e y (abajo o arriba). El centro es (0, 0).
**Escenario:** un escenario blanco como el de Scratch (proporción 4:3), con cuadrícula suave y ejes marcados cada 100: x de −200 a 200 e y de −150 a 150. Es una simplificación del de Scratch, que llega de −240 a 240 y de −180 a 180; dilo con un texto pequeño al principio.
**Capítulos:** El mapa (0 s) · La x (8 s) · La y (22 s) · Los dos números (34 s) · El reto (48 s) · Resumen (60 s).

- **0-8 s** · Aparece el escenario con el robot en el centro y la etiqueta (0, 0). Subtítulo: «El escenario de Scratch es como un mapa.»
- **8-22 s** · El robot se desliza a la derecha hasta x = 100 (contador «x = 100»); vuelve y va a la izquierda hasta x = −100 («x = −100»). Subtítulo: «La x dice izquierda o derecha. A la izquierda, negativos.»
- **22-34 s** · El robot vuelve al centro, sube a y = 100 y baja a y = −100. Subtítulo: «La y dice arriba o abajo.»
- **34 s · Pausa:** «Si x = 100 e y = 100, ¿dónde estará el robot?»
- **34-48 s** · El robot va a (100, 100) y luego a (−100, 50); en cada parada aparecen líneas discontinuas hasta los ejes y la etiqueta. Subtítulo: «Con dos números, (x, y), sabemos dónde está.»
- **48 s · Pausa:** «¿En qué coordenadas está la manzana?»
- **48-60 s** · Aparece una manzana en (200, −100); tras una pausa, se dibujan las líneas y la respuesta «(200, −100)». Subtítulo: «La manzana está en (200, −100).»
- **60-66 s** · Texto grande: «x: izquierda o derecha · y: arriba o abajo.»
- **66-72 s** · FRASE CLAVE: «Dos números dicen dónde está.»

### 12. Sensor y umbral · `anim-sensor-umbral.html` · 5º y 6º · unos 65 s

**Idea:** un sensor mide algo (aquí, la luz) y el programa lo compara con un número límite, el umbral, para decidir.
**Escenario:** una placa programable genérica (rectángulo con una cuadrícula de 5 × 5 luces y los botones A y B; sin marca). A su lado, una barra vertical «nivel de luz» de 0 a 255 y una línea discontinua roja en 50 con la etiqueta «umbral = 50». Arriba, un cielo que cambia del día a la noche.
**Capítulos:** Medir (0 s) · Comparar (12 s) · Se hace de noche (22 s) · Un umbral mal puesto (40 s) · Resumen (54 s).

- **0-12 s** · Hace sol; la barra sube hasta 200. Etiqueta «nivel de luz = 200». Subtítulo: «El sensor mide cuánta luz hay: 200.»
- **12-22 s** · Aparece el bloque «si nivel de luz < 50 entonces encender luces · si no apagar». Como 200 no es menor que 50, las luces siguen apagadas. Subtítulo: «El programa compara con el umbral: 50.»
- **22 s · Pausa:** «¿Cuándo se encenderán las luces?»
- **22-40 s** · Pasa una nube y anochece; la barra baja despacio: 200, 120, 80, 40. Al cruzar la línea del umbral, se ilumina la condición y se encienden las 25 luces. Subtítulo: «Al bajar de 50… ¡se encienden!»
- **40-54 s** · Vuelve el día (200). El umbral sube a 250: aunque haya sol, las luces se encienden. Aviso: «Hay que ajustar el umbral probando». Subtítulo: «Si el umbral está mal, el programa falla.»
- **44 s · Pausa** (antes de subir el umbral): «¿Qué pasará si pongo el umbral en 250?»
- **54-60 s** · Texto grande: «El umbral es el número a partir del cual el programa decide.»
- **60-66 s** · FRASE CLAVE: «Mide, compara y decide.»

### 13. Cómo aprende una máquina · `anim-aprende-maquina.html` · 5º y 6º · unos 75 s

**Idea:** una inteligencia artificial aprende de ejemplos; si los ejemplos no son variados, aprende mal (sesgo).
**Escenario:** el robot de siempre con una pequeña lupa, como «aprendiz», y un archivador que es su memoria. Frutas planas y claras.
**Capítulos:** Aprender con ejemplos (0 s) · La regla equivocada (14 s) · Ejemplos variados (40 s) · Resumen (62 s).

- **0-14 s** · Seis manzanas ROJAS con la etiqueta «manzana» entran una a una en el archivador. Subtítulo: «Enseñamos a la máquina qué es una manzana.»
- **14-20 s** · Bocadillo del robot: «manzana = fruta roja». Subtítulo: «La máquina saca una regla.»
- **20 s · Pausa:** «¿Acertará con una manzana verde?»
- **20-32 s** · Aparece una manzana VERDE: el robot dice «NO es una manzana» (cruz roja). Aparece una FRESA: dice «SÍ es una manzana» (cruz roja). Subtítulo: «Se equivoca dos veces.»
- **32-40 s** · Se resalta que los seis ejemplos eran rojos. Subtítulo: «Todos los ejemplos eran rojos: eso es un sesgo.»
- **40-50 s** · Entran manzanas rojas, verdes y amarillas. El bocadillo cambia a «manzana = redonda, con rabito, de cualquier color». Subtítulo: «Le damos ejemplos variados.»
- **50 s · Pausa:** «¿Y ahora acertará?»
- **50-62 s** · Manzana verde → «SÍ» (tic verde). Fresa → «NO» (tic verde). Subtítulo: «Ahora acierta.»
- **62-68 s** · Texto grande: «Una máquina aprende de los ejemplos que le damos.»
- **68-74 s** · FRASE CLAVE: «Si los datos fallan, la máquina falla.»
