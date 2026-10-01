# Animaciones de conceptos · encargo para Claude

Este documento es para ti, Claude. Contiene las normas comunes y el guion de cada animación que vas a crear para la guía didáctica **Código Escuela 4.0 · Primaria** de un colegio público de Madrid.

**Cómo vamos a trabajar**
- Las animaciones se hacen **de una en una**. En cada petición se te indicará el número de la animación. Haz **solo esa**, siguiendo su guion y las normas comunes.
- Entrega **un único archivo** con el nombre que indica su guion (por ejemplo, `anim-bucle.html`). Si tienes acceso a la carpeta del proyecto, guárdalo en `animaciones_nuevas/`.
- Junto al archivo, entrega la lista de comprobaciones del apartado «Antes de entregar».
- Si algo del guion es imposible o contradice las normas, avisa antes de inventar una solución.

## Para qué sirven

Son animaciones para proyectar en la pizarra digital de un aula de Primaria (6 a 12 años). Explican conceptos de programación dentro de la asignatura de Matemáticas. Las maneja el docente delante de toda la clase. Todo en castellano de España.

## Normas comunes (para todas las animaciones)

### Formato técnico (obligatorio)

- Un único archivo .html autónomo: HTML, CSS y JavaScript dentro del archivo, dibujos en SVG dentro del archivo. Nada externo: ni bibliotecas, ni CDN, ni fuentes de Google, ni imágenes enlazadas. Tiene que funcionar abriendo el archivo sin internet.
- Tamaño máximo 300 KB.
- Escenario en proporción 16:9 que se ajusta a cualquier ventana (se escala manteniendo la proporción, con márgenes si hace falta). Debe verse bien a pantalla completa en una pizarra y en un portátil.
- Fondo #fbfbf8. Tipografía: system-ui, "Segoe UI", Arial, sans-serif. Texto en #1a1d24.

### Control (lo maneja el docente)

- La animación va por escenas. NO avanza sola: al terminar cada escena se queda quieta hasta que el docente pulsa «Siguiente».
- Botones grandes abajo: «◀ Anterior», «▶ Siguiente», «↺ Repetir escena». Puntos de progreso (uno por escena). Botón «Pantalla completa».
- Teclado: flecha derecha o espacio = siguiente; flecha izquierda = anterior; R = repetir escena.
- Si el sistema tiene activado «reducir movimiento» (prefers-reduced-motion), cada escena se muestra directamente en su estado final, sin animación.
- Sin sonido. Nada que parpadee más de 3 veces por segundo.

### Texto en pantalla

- Muy poco texto: como máximo una frase corta por escena (unas 12 palabras), grande (como mínimo el 4 % de la altura del escenario) y con buen contraste.
- Usa exactamente los textos que te indique en cada animación.
- La última escena muestra siempre la FRASE CLAVE entre comillas «», grande y centrada.

### Estilo visual

- Ilustración plana, limpia, amable, con esquinas redondeadas y sombras suaves. Nada infantilizado en exceso ni recargado. Movimientos suaves (ease-in-out), de 0,4 a 0,8 s por movimiento.
- Paleta (úsala, no inventes otros colores salvo grises):
  rojo #cf3f36 · naranja #df7619 · verde #2a8f4f · turquesa #108394 · azul #2c5bbf · morado #6c44b0 · amarillo #f5c518 · tinta #1a1d24 · gris claro #eceef2.
- Tablero cuando haya cuadrícula: una isla. Agua #4fa3d9 alrededor, borde de arena #f2d39b, casillas de hierba en damero (#9ed97c y #8fcf6e, borde #6fb24f).
- Tarjetas de flechas (iguales que las de papel de la guía): cuadrado redondeado de color con una flecha blanca gruesa.
  · AVANZA: fondo azul #2c5bbf, flecha recta hacia arriba.
  · GIRA A LA DERECHA: fondo verde #2a8f4f, flecha curva en el sentido de las agujas del reloj.
  · GIRA A LA IZQUIERDA: fondo naranja #df7619, flecha curva en sentido contrario.
  · REPITE: tarjeta naranja #f39a2b con el texto «REPITE ×N»; las tarjetas que se repiten van DENTRO de ella.
- El personaje es SIEMPRE este robot (visto desde arriba, mira hacia donde apunta su triángulo amarillo). Úsalo tal cual, escalándolo. Mide 60 × 60 y su centro es (30, 30):

```svg
<svg viewBox="0 0 60 60"><ellipse cx="30" cy="54" rx="19" ry="4" fill="rgba(0,0,0,.18)"/><rect x="6" y="18" width="8" height="24" rx="3" fill="#1a1d24"/><rect x="46" y="18" width="8" height="24" rx="3" fill="#1a1d24"/><rect x="11" y="13" width="38" height="38" rx="11" fill="#2c5bbf" stroke="#1b3f8f" stroke-width="2.5"/><rect x="15" y="17" width="30" height="10" rx="5" fill="#ffffff" opacity=".18"/><path d="M22 13L30 1L38 13Z" fill="#f5c518" stroke="#b8860b" stroke-width="2" stroke-linejoin="round"/><circle cx="23" cy="29" r="5.5" fill="#fff"/><circle cx="37" cy="29" r="5.5" fill="#fff"/><circle cx="23" cy="27.5" r="2.6" fill="#1a1d24"/><circle cx="37" cy="27.5" r="2.6" fill="#1a1d24"/><path d="M23 41Q30 46 37 41" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>
```

### Reglas de contenido (no las rompas nunca)

- El robot empieza mirando hacia arriba salvo que se diga otra cosa.
- AVANZA: el robot pasa a la casilla de delante (hacia donde mira).
- GIRA A LA DERECHA / IZQUIERDA: el robot gira 90 grados SIN moverse de su casilla.
- Al ejecutar un programa, ilumina la tarjeta que se está ejecutando en cada momento (borde amarillo #f5c518).
- Los recuentos de tarjetas y pasos que aparezcan en pantalla tienen que ser exactos. Compruébalos antes de entregar.
- Nada de violencia, ni marcas comerciales, ni personajes conocidos. Personas, si aparecen: siluetas sencillas y diversas, sin rasgos detallados.

### Antes de entregar, revisa y enumera en una lista breve:

1. que el archivo no carga nada externo;
2. que los recuentos y movimientos del robot son correctos escena a escena;
3. que funciona «reducir movimiento» y el teclado.

---

## Guiones

Cada guion indica el archivo, el curso, la idea, las escenas y los textos exactos que deben aparecer en pantalla.

### 1. Algoritmo · `anim-algoritmo.html` · 1º y 2º

**Idea:** un algoritmo es una lista de pasos en orden; el robot hace exactamente lo que dicen las tarjetas.

Tablero isla de 5 × 5. El robot en la casilla de abajo del centro (columna 3, fila 5), mirando hacia arriba. Un cofre del tesoro (dibujo plano sencillo) en la columna 3, fila 2. Debajo o al lado del tablero, una fila de tarjetas.

- **Escena 1** · Texto: «El robot quiere llegar al tesoro.» Aparecen el tablero, el robot y el cofre; el cofre brilla suavemente.
- **Escena 2** · Texto: «Le damos instrucciones en orden.» Aparecen, una a una, tres tarjetas AVANZA numeradas 1, 2 y 3.
- **Escena 3** · Texto: «El robot las sigue una a una.» Se ejecutan las tres tarjetas, iluminando cada una; el robot avanza tres casillas y llega al cofre. Pequeña celebración (unas pocas estrellas o confeti, sin exagerar).
- **Escena 4** · Texto: «¿Y si cambio una tarjeta?» El robot vuelve a la salida. La tarjeta 2 se cambia por GIRA A LA DERECHA (verde).
- **Escena 5** · Texto: «El robot no adivina: hace lo que pone.» Se ejecuta: avanza (fila 4), gira a la derecha sin moverse, avanza (columna 4, fila 4). No llega al tesoro; aparece una interrogación suave sobre el robot.
- **Escena 6** · Texto grande, centrado: «Un algoritmo es una lista de pasos en orden.» Debajo, la FRASE CLAVE: «Un robot no adivina: hace lo que le dices.»

### 2. Descomponer · `anim-descomponer.html` · 1º a 4º

**Idea:** un problema grande se parte en partes pequeñas que se hacen una a una.

- **Escena 1** · Texto: «Queremos hacer un videojuego.» En el centro, un bloque grande y verde (#2a8f4f) con el texto «HACER UN VIDEOJUEGO». Parece enorme y difícil (por ejemplo, tiembla un poco o tiene un signo de interrogación).
- **Escena 2** · Texto: «¡Es mucho de golpe! Lo partimos.» El bloque se divide en 5 piezas que bajan conectadas por líneas: Personaje, Premio, Enemigo, Puntos, Final.
- **Escena 3** · Texto: «Hacemos una parte cada vez.» Las piezas se van completando una a una con un tic verde; a la vez, en una pantalla de juego sencilla a la derecha aparece cada parte: el robot (personaje), una manzana (premio), un meteorito morado con pinchos (enemigo), un marcador «Puntos: 0» (puntos) y un cartel «¡Has ganado!» (final).
- **Escena 4** · Texto: «Al juntarlas, el juego está hecho.» La pantalla de juego completa se anima brevemente: el robot coge la manzana y el marcador pasa a «Puntos: 1».
- **Escena 5** · Texto grande: «Descomponer es partir un problema grande en partes pequeñas.» FRASE CLAVE: «Paso a paso, todo es más fácil.»

### 3. Patrón · `anim-patron.html` · 1º a 3º

**Idea:** un patrón es algo que se repite con una regla; si descubro la regla, sé lo que viene.

- **Escena 1** · Texto: «¿Qué viene ahora?» Aparecen de izquierda a derecha: círculo rojo, cuadrado azul, círculo rojo, cuadrado azul, círculo rojo, y una casilla con «?».
- **Escena 2** · Texto: «La regla: rojo, azul, rojo, azul…» Las figuras se agrupan en parejas (círculo rojo + cuadrado azul) con un recuadro suave alrededor de cada pareja.
- **Escena 3** · Texto: «¡Viene un cuadrado azul!» La «?» se convierte en un cuadrado azul con un pequeño salto.
- **Escena 4** · Texto: «Hay patrones que crecen.» Tres figuras hechas con cuadraditos naranjas: la figura 1 tiene 1 cuadrado, la 2 tiene 2 y la 3 tiene 3 (en columna). Debajo, «figura 1», «figura 2», «figura 3». La figura 4 es una «?».
- **Escena 5** · Texto: «Cada vez, uno más: la figura 4 tiene 4.» La «?» se convierte en 4 cuadraditos que aparecen uno a uno.
- **Escena 6** · Texto grande: «Un patrón es algo que se repite siguiendo una regla.» FRASE CLAVE: «Busca lo que se repite.»

### 4. Bucle · `anim-bucle.html` · 1º a 4º

**Idea:** un bucle repite varias veces lo mismo sin escribirlo cada vez. Mismo camino, menos tarjetas.

Tablero isla de 4 × 4. Robot en la columna 2, fila 3, mirando hacia arriba. Vamos a dibujar un cuadrado de 1 casilla de lado (el robot deja un rastro naranja #df7619 por donde pasa).

- **Escena 1** · Texto: «Queremos que el robot dé una vuelta en cuadrado.» Se ve el robot y, en línea discontinua suave, el cuadrado que va a recorrer.
- **Escena 2** · Texto: «Sin bucle: 8 tarjetas.» Aparecen 8 tarjetas: AVANZA, GIRA A LA DERECHA, AVANZA, GIRA A LA DERECHA, AVANZA, GIRA A LA DERECHA, AVANZA, GIRA A LA DERECHA. Un contador grande: «8 tarjetas».
- **Escena 3** · Texto: «Fíjate: “avanza, gira” se repite 4 veces.» Las tarjetas se agrupan en 4 parejas iguales, con un recuadro alrededor de cada pareja y los números 1, 2, 3, 4.
- **Escena 4** · Texto: «Con bucle: REPITE ×4.» Las 4 parejas se funden en una sola pareja (AVANZA, GIRA A LA DERECHA) que entra dentro de una tarjeta naranja «REPITE ×4». Contador: «3 tarjetas».
- **Escena 5** · Texto: «Hace exactamente lo mismo.» Se ejecuta el programa con REPITE. En cada vuelta se ilumina la tarjeta REPITE y aparece un contador «vuelta 1 de 4» … «vuelta 4 de 4»; dentro, se iluminan AVANZA y GIRA. Movimiento correcto: desde (columna 2, fila 3) mirando arriba: avanza a la fila 2, gira a la derecha; avanza a la columna 3, gira a la derecha (mira abajo); avanza a la fila 3, gira a la derecha (mira a la izquierda); avanza a la columna 2, gira a la derecha (vuelve a mirar arriba). El rastro forma el cuadrado.
- **Escena 6** · Texto grande: «Un bucle repite varias veces lo mismo.» Debajo, «8 tarjetas → 3 tarjetas». FRASE CLAVE: «Menos tarjetas, mismo camino.»

### 5. Condición · `anim-condicion.html` · 2º a 4º

**Idea:** una condición es una pregunta que decide qué se hace. Ejemplo de la vida real: el semáforo de PEATONES (el del muñeco), no el de coches.

Personaje: un niño o una niña en silueta sencilla, en el bordillo, delante de un paso de cebra. Semáforo de peatones con dos luces: muñeco rojo quieto arriba, muñeco verde caminando abajo.

- **Escena 1** · Texto: «¿Puedo cruzar? Depende del semáforo.» Se ve la escena; el semáforo está apagado.
- **Escena 2** · Texto: «SI el muñeco está en rojo, ENTONCES espero.» Se enciende el muñeco ROJO (resplandor suave). El personaje se queda quieto en el bordillo; aparece un pequeño cartel «Espero en el bordillo».
- **Escena 3** · Texto: «SI el muñeco está en verde, ENTONCES miro y cruzo.» Se enciende el muñeco VERDE. El personaje primero mira a la izquierda y a la derecha (gira la cabeza) y DESPUÉS cruza por el paso de cebra. El orden es importante: primero mirar, luego cruzar.
- **Escena 4** · Texto: «Así se dibuja una condición.» Diagrama: un rombo naranja (#df7619) con la pregunta «¿El muñeco está en verde?». Del rombo salen dos flechas: «SÍ» (verde) hacia una caja «Miro a los lados y cruzo», y «NO» (roja) hacia una caja «Espero en el bordillo».
- **Escena 5** · Texto: «La pregunta decide el camino.» Se repite la escena 2 y la 3 en miniatura junto al diagrama, iluminando en cada caso la flecha que se sigue (primero NO, luego SÍ).
- **Escena 6** · Texto grande: «Una condición es una pregunta que decide qué hacer.» FRASE CLAVE: «Si se cumple… si no…»

### 6. Evento · `anim-evento.html` · 2º a 6º

**Idea:** un evento es la señal que hace que un programa empiece («CUANDO pasa algo…»). Cada programa espera su señal.

- **Escena 1** · Texto: «En el cole también hay eventos.» Un timbre de colegio (dibujo plano). Suena (ondas que salen) y unas siluetas de niños salen por una puerta al patio.
- **Escena 2** · Texto: «CUANDO suena el timbre, salimos al recreo.» Aparece arriba una pieza amarilla con forma de «gorro» (como los bloques de evento de Scratch, color #f5c518 con texto oscuro) que dice «CUANDO suena el timbre», y debajo, enganchada, una pieza «salimos al recreo».
- **Escena 3** · Texto: «Cada programa espera su señal.» Tres robots iguales en fila. Encima de cada uno, su bloque de evento amarillo: «CUANDO toco la bandera verde», «CUANDO pulso la tecla espacio», «CUANDO aplaudo». Los tres esperan quietos (respiran un poco).
- **Escena 4** · Texto: «Señal: bandera verde.» Se ilumina una bandera verde; solo el primer robot se mueve (da un saltito y avanza). Los otros siguen quietos.
- **Escena 5** · Texto: «Señal: tecla espacio.» Se ilumina una tecla «espacio»; solo se mueve el segundo robot.
- **Escena 6** · Texto: «Señal: un aplauso.» Aparece un icono de manos aplaudiendo; solo se mueve el tercer robot.
- **Escena 7** · Texto grande: «Un evento es la señal que hace empezar un programa.» FRASE CLAVE: «Cada programa espera su señal.»

### 7. Variable · `anim-variable.html` · 3º a 6º

**Idea:** una variable es una caja con nombre que guarda un número que puede cambiar.

- **Escena 1** · Texto: «Una variable es una caja con nombre.» Aparece una caja dibujada (frontal, sencilla) con una etiqueta azul que dice «puntos». Dentro, un número grande «0».
- **Escena 2** · Texto: «Al empezar, ponemos puntos a 0.» Junto a la caja aparece un bloque naranja (#ff8c1a, como las variables de Scratch) «dar a puntos el valor 0»; el 0 de la caja se ilumina.
- **Escena 3** · Texto: «Cada manzana: sumar 1 a puntos.» A la izquierda, una pequeña escena: el robot se mueve y coge una manzana roja. Cada vez que la coge, aparece el bloque «sumar a puntos 1» y el número de la caja cambia con un salto: 0 → 1 → 2 → 3 (tres manzanas).
- **Escena 4** · Texto: «La caja se llama igual. Lo de dentro cambia.» La etiqueta «puntos» se ilumina (no cambia) y el número «3» se ilumina (ha cambiado).
- **Escena 5** · Texto: «Puede haber varias cajas.» Aparece una segunda caja con la etiqueta «vidas» y el número «3». El robot choca con un meteorito morado: «vidas» pasa de 3 a 2 con el bloque «sumar a vidas -1».
- **Escena 6** · Texto grande: «Una variable guarda un número que puede cambiar.» FRASE CLAVE: «La caja se llama igual; lo de dentro cambia.»

### 8. Depurar · `anim-depurar.html` · 1º a 6º

**Idea:** depurar es encontrar el error («el bicho») y arreglarlo. Equivocarse es parte de programar.

Tablero isla de 5 × 5. Robot en la columna 1, fila 5, mirando hacia arriba. Cofre en la columna 1, fila 1. Programa: AVANZA, AVANZA, GIRA A LA DERECHA, AVANZA (cuatro tarjetas numeradas 1 a 4). El programa CORRECTO sería AVANZA ×4; el bicho es la tarjeta 3.

- **Escena 1** · Texto: «Queremos llegar al tesoro: recto, 4 casillas.» Aparecen el tablero, el robot, el cofre y las 4 tarjetas.
- **Escena 2** · Texto: «Lo probamos… ¡no llega!» Se ejecuta: avanza (fila 4), avanza (fila 3), gira a la derecha sin moverse (mira a la derecha), avanza (columna 2, fila 3). Aparece un pequeño bicho simpático (un escarabajo de dibujo amable) junto al robot.
- **Escena 3** · Texto: «1. ¿Qué quería que pasara? 2. ¿Qué ha pasado?» Una flecha discontinua verde marca el camino que se quería (recto hasta el cofre) y una naranja el que ha hecho.
- **Escena 4** · Texto: «3. ¿Dónde empieza a fallar?» El robot vuelve a la salida y se ejecuta paso a paso, despacio. Tarjetas 1 y 2: tic verde. Tarjeta 3: se marca en rojo con el bicho encima: «¡Aquí está el bicho!».
- **Escena 5** · Texto: «Cambiamos la tarjeta 3.» La tarjeta 3 (GIRA A LA DERECHA) se da la vuelta y se convierte en AVANZA. El bicho se va andando.
- **Escena 6** · Texto: «Probamos otra vez… ¡conseguido!» Se ejecuta AVANZA ×4 y llega al cofre. Pequeña celebración.
- **Escena 7** · Texto grande: «Depurar es encontrar el error y arreglarlo.» FRASE CLAVE: «¿Qué quería que pasara y qué ha pasado?»

### 9. Entrada y salida · `anim-entrada-salida.html` · 1º a 6º

**Idea:** algo entra (lo que pulsamos o lo que mide un sensor), el programa decide y algo sale (lo que hace la máquina).

Estructura fija en las escenas 2 a 4: tres columnas con su etiqueta arriba: «ENTRADA» (azul #2c5bbf), «PROGRAMA» (naranja #df7619), «SALIDA» (verde #2a8f4f), unidas por flechas. Una bolita de luz viaja de la entrada al programa y del programa a la salida.

- **Escena 1** · Texto: «Las máquinas reciben algo y hacen algo.» Aparecen las tres columnas vacías con sus etiquetas.
- **Escena 2** · Texto: «Pulso un botón y el robot avanza.» ENTRADA: un dedo pulsa un botón con flecha. PROGRAMA: un pequeño robot pensando (engranaje girando). SALIDA: el robot avanza una casilla.
- **Escena 3** · Texto: «Toco el aluminio y suena una nota.» ENTRADA: una mano toca una placa de papel de aluminio conectada con un cable (Makey Makey, sin marca). PROGRAMA: engranaje. SALIDA: una nota musical que sale de un altavoz (sin sonido real, solo el icono).
- **Escena 4** · Texto: «Hay poca luz y se encienden las luces.» ENTRADA: un sensor de luz y un sol que se va ocultando tras una nube. PROGRAMA: engranaje. SALIDA: una placa con una cuadrícula de 5 × 5 luces rojas que se encienden.
- **Escena 5** · Texto grande: «Entrada → programa → salida.» FRASE CLAVE: «Algo entra, el programa decide, algo sale.»

### 10. Optimizar · `anim-optimizar.html` · 1º a 6º

**Idea:** optimizar es conseguir lo mismo con menos pasos.

Tablero isla de 5 × 5. Robot en la columna 1, fila 5, mirando hacia arriba. Va a recorrer tres lados de un cuadrado de 3 casillas de lado (deja rastro naranja).

- **Escena 1** · Texto: «Este programa funciona…» Aparecen 12 tarjetas en fila: AVANZA, AVANZA, AVANZA, GIRA A LA DERECHA, repetido tres veces. Contador: «12 tarjetas». Se ejecuta: el robot sube 3 casillas (fila 2), gira a la derecha, avanza 3 a la derecha (columna 4), gira a la derecha, baja 3 (fila 5), gira a la derecha. Queda en la columna 4, fila 5, mirando a la izquierda. El rastro dibuja una forma de «∩».
- **Escena 2** · Texto: «… pero es muy largo. ¿Qué se repite?» Las 12 tarjetas se agrupan en 3 grupos iguales de 4 (AVANZA, AVANZA, AVANZA, GIRA A LA DERECHA), con un recuadro en cada grupo y los números 1, 2, 3.
- **Escena 3** · Texto: «Lo juntamos con REPITE ×3.» Los tres grupos se funden en uno que entra en una tarjeta «REPITE ×3». Contador: «5 tarjetas».
- **Escena 4** · Texto: «Mismo camino, 7 tarjetas menos.» Se borra el rastro, el robot vuelve a la salida y se ejecuta el programa corto: hace exactamente el mismo recorrido. Al final, «12 − 5 = 7».
- **Escena 5** · Texto grande: «Optimizar es conseguir lo mismo con menos pasos.» FRASE CLAVE: «¿Se podría hacer con menos pasos?»

### 11. Coordenadas (x, y) · `anim-coordenadas.html` · 3º y 4º (opcional)

**Idea:** dos números dicen dónde está algo: x (izquierda-derecha) e y (abajo-arriba). El centro es (0, 0).

Un escenario rectangular blanco como el de Scratch (proporción 4:3), con una cuadrícula suave. Ejes con marcas cada 100: x de −200 a 200 y y de −150 a 150 (simplificado del de Scratch, que va de −240 a 240 y de −180 a 180; dilo en la escena 1 con un texto pequeño).

- **Escena 1** · Texto: «El escenario de Scratch es un mapa.» Aparece el escenario con el robot en el centro. Etiqueta (0, 0) en el centro.
- **Escena 2** · Texto: «x: izquierda o derecha.» El robot se desliza a la derecha hasta x = 100; un contador grande «x = 0 … 100». Luego vuelve y va a la izquierda hasta x = −100: «x = −100». Los números negativos van a la izquierda.
- **Escena 3** · Texto: «y: arriba o abajo.» El robot vuelve al centro, sube a y = 100 y luego baja a y = −100.
- **Escena 4** · Texto: «Dos números: (x, y).» El robot va a (100, 100), luego a (−100, 50); en cada parada aparecen líneas discontinuas hasta los ejes y la etiqueta con las coordenadas.
- **Escena 5** · Texto: «¿Dónde está la manzana?» Aparece una manzana en (200, −100). Tras una pausa se muestran las líneas y la respuesta «(200, −100)».
- **Escena 6** · Texto grande: «x dice izquierda-derecha; y dice arriba-abajo.» FRASE CLAVE: «Dos números dicen dónde está.»

### 12. Sensor y umbral · `anim-sensor-umbral.html` · 5º y 6º (opcional)

**Idea:** un sensor mide algo (aquí, la luz) y el programa compara con un número límite, el umbral, para decidir.

Una placa programable genérica (rectángulo con una cuadrícula de 5 × 5 luces y dos botones A y B; sin marca). A su lado, una barra vertical «nivel de luz» de 0 a 255 y una línea horizontal discontinua roja en 50 con la etiqueta «umbral = 50».

- **Escena 1** · Texto: «El sensor mide cuánta luz hay.» Un sol brilla; la barra sube hasta unos 200. Etiqueta «nivel de luz = 200».
- **Escena 2** · Texto: «El programa compara con el umbral.» Aparece un bloque «si nivel de luz < 50 entonces encender luces · si no apagar». 200 no es menor que 50 → luces apagadas.
- **Escena 3** · Texto: «Se hace de noche…» Una nube y después la noche: la barra baja despacio: 200, 120, 80, 40. Al cruzar la línea del umbral, la condición se ilumina y las 25 luces se encienden.
- **Escena 4** · Texto: «Si el umbral está mal, falla.» El umbral sube a 250: aunque haya sol (200), las luces se encienden. Un aviso: «Hay que ajustar el umbral probando».
- **Escena 5** · Texto grande: «El umbral es el número a partir del cual el programa decide.» FRASE CLAVE: «Mide, compara y decide.»

### 13. Cómo aprende una máquina · `anim-aprende-maquina.html` · 5º y 6º (opcional)

**Idea:** una inteligencia artificial aprende de ejemplos; si los ejemplos no son variados, aprende mal (sesgo).

Personaje: un robot «aprendiz» (puedes usar el robot del estilo con una pequeña lupa). Frutas dibujadas planas y claras.

- **Escena 1** · Texto: «Enseñamos a la máquina qué es una manzana.» Le mostramos 6 ejemplos marcados «manzana»: las 6 son manzanas ROJAS. Van entrando en una «memoria» (un archivador) una a una.
- **Escena 2** · Texto: «La máquina saca una regla.» Aparece un bocadillo del robot: «manzana = fruta roja».
- **Escena 3** · Texto: «Ahora le preguntamos.» Una manzana VERDE: el robot dice «NO es una manzana» (cruz roja). Una FRESA (roja): dice «SÍ es una manzana» (también mal). Dos errores.
- **Escena 4** · Texto: «Los ejemplos no eran variados: eso es un sesgo.» Se resalta que todos los ejemplos eran rojos.
- **Escena 5** · Texto: «Le damos ejemplos variados.» Entran manzanas rojas, verdes y amarillas. El bocadillo cambia a «manzana = fruta con forma de manzana».
- **Escena 6** · Texto: «Ahora acierta.» Manzana verde → «SÍ» (tic verde). Fresa → «NO» (tic verde).
- **Escena 7** · Texto grande: «Una máquina aprende de los ejemplos que le damos.» FRASE CLAVE: «Si los datos fallan, la máquina falla.»
