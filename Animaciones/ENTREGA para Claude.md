# Entrega de los vídeos animados · Código Escuela 4.0 · Primaria

Este documento es para ti, Claude, la instancia que preparó el encargo `Prompts animaciones.md`. Resume qué se ha entregado, qué ha cambiado respecto a tu encargo (lo decidió el docente durante el trabajo), cómo usar y grabar los vídeos y qué queda pendiente.

**Importante:** `Prompts animaciones.md` se ha actualizado durante el trabajo. Usa esa versión, no la que tengas en memoria. La versión anterior de las animaciones en diapositivas está en `Prompts animaciones (antiguo).md`.

---

## 1. Qué se entrega

Diecisiete archivos HTML autónomos en `animaciones_nuevas/`: los 13 guiones y una segunda versión de 4 de ellos.

| N.º | Vídeo | Archivo | Registro | Duración | Pausas (s) |
|---|---|---|---|---|---|
| 1 | Algoritmo | `anim-algoritmo.html` | inicial | 62 s | 16, 34 |
| 2 | Descomponer | `anim-descomponer.html` | medio* | 56 s | 10, 36 |
| 3 | Patrón | `anim-patron.html` | inicial | 54 s | 10, 32 |
| 4 | Bucle | `anim-bucle.html` | medio* | 76 s | 30, 50 |
| 5 | Condición | `anim-condicion.html` | medio* | 70 s | 8, 50 |
| 6A | Evento | `anim-evento.html` | inicial | 66 s | 30, 38 |
| 6B | Evento | `anim-evento-superior.html` | superior | 66 s | 30, 38 |
| 7 | Variable | `anim-variable.html` | superior | 66 s | 12, 46 |
| 8A | Depurar | `anim-depurar.html` | inicial | 76 s | 8, 30 |
| 8B | Depurar | `anim-depurar-superior.html` | superior | 76 s | 8, 30 |
| 9A | Entrada y salida | `anim-entrada-salida.html` | inicial | 56 s | 20, 32 |
| 9B | Entrada y salida | `anim-entrada-salida-superior.html` | superior | 56 s | 20, 32 |
| 10A | Optimizar | `anim-optimizar.html` | inicial | 72 s | 24, 44 |
| 10B | Optimizar | `anim-optimizar-superior.html` | superior | 72 s | 24, 44 |
| 11 | Coordenadas | `anim-coordenadas.html` | medio | 72 s | 34, 48 |
| 12 | Sensor y umbral | `anim-sensor-umbral.html` | superior | 66 s | 22, 44,4 |
| 13 | Cómo aprende una máquina | `anim-aprende-maquina.html` | superior | 74 s | 20, 50 |

\* Los vídeos 2, 4 y 5 se hicieron **antes** de que existieran los registros. Su estilo es el inicial (con sudor, saltitos o confeti), aunque la tabla los asigna al medio. Ver el apartado 6.

Todos los archivos ocupan entre 30 y 44 KB y no cargan nada externo. La carpeta `animaciones_nuevas/version_diapositivas/` guarda una versión antigua del vídeo 1 en formato de diapositivas. No forma parte de la entrega, pero el docente quiere conservarla.

---

## 2. Cambios respecto a tu encargo original

Todos están ya escritos en `Prompts animaciones.md`.

1. **Tres registros según la edad** (sección nueva «Registro según la edad»): inicial (1º-2º), medio (3º-4º) y superior (5º-6º).
   - El docente vio los vídeos demasiado infantiles para los mayores.
   - El registro superior tiene aspecto de herramienta real: paneles de editor, bloques con sus nombres completos, monitores, tablas de seguimiento y métricas. No hay confeti, rebotes ni zooms.
   - En el superior se permiten etiquetas pequeñas, de al menos el 2,5 % de la altura.
2. **Dos versiones para los vídeos que abarcan de 1º-2º a 5º-6º** (6, 8, 9 y 10): la A en registro inicial, con el nombre del guion, y la B en registro superior, con el sufijo `-superior`.
3. **Robot sobrio en el registro superior.**
   - Tiene la misma silueta, los mismos colores y el mismo triángulo de dirección, pero sin ojos ni sonrisa. El SVG está en el `.md`.
   - Los registros inicial y medio mantienen el robot original.
   - En el superior, la pantalla final muestra la frase clave sin mascota.
4. **Todos los guiones tienen dos pausas para pensar.** Se añadió una segunda en los guiones 2, 6, 9, 11 y 12, que solo tenían una. Las preguntas nuevas están en sus guiones del `.md`. Cada pausa va justo antes de que se vea la respuesta.
5. **Ningún subtítulo da la respuesta a una pausa.**
   - Cuando un subtítulo del guion responde a la pregunta, aparece en el momento en que la respuesta se ve en pantalla, no justo después de la pregunta.
   - Siempre queda dentro del tramo de su guion y está al menos 3 s en pantalla.
   - Por eso, en algunos tramos hay unos segundos sin subtítulo mientras se ve la acción.

---

## 3. Contrato técnico (igual en todos los archivos)

- **Lienzo lógico:** 1920 × 1080, que se escala a la ventana con márgenes.
- **Animación:** todo se dibuja con `render(t)`, con `t` en segundos.
  - No hay animaciones ni transiciones CSS, ni `setTimeout`.
  - `requestAnimationFrame` solo hace avanzar el tiempo durante la reproducción.
- **Determinismo:** el confeti usa una semilla fija, así que el mismo `t` produce siempre el mismo fotograma.
  - Se comprobó en cada archivo comparando el estado completo de la página dos veces en el mismo instante.
- **API global:** `window.ANIM = { duration, seek(t), play(), pause(), chapters, pausas }`. `seek(t)` dibuja ese instante al momento y deja el vídeo en pausa.
- **`?export=1`:**
  - Oculta la barra y la pantalla de inicio.
  - Desactiva las pausas y no reproduce nada solo.
  - Los subtítulos siguen visibles y bajan un poco, porque no hay barra que esquivar.
- **Reproductor:**
  - Botón grande de inicio.
  - Barra que se oculta sola, con marcas de capítulo (y de pausa cuando el interruptor está activado). Se puede tocar o arrastrar.
  - Tiempo actual y total, volver a empezar y velocidad 0,75× / 1×.
  - Interruptor «Pausas para pensar», apagado por defecto.
  - Pantalla completa y «↺ Volver a ver» al terminar.
  - Teclado: espacio, ← → (5 s) e Inicio.
- **«Reducir movimiento»:** se mantienen los movimientos necesarios. Se quitan la cámara, el confeti, los rebotes, los temblores y la respiración del robot.

### Cómo grabar los MP4

1. Abre cada archivo con `?export=1` en un navegador Chromium sin interfaz, con una ventana de exactamente 1920 × 1080 (por ejemplo, Playwright o Puppeteer).
2. **Desactiva «reducir movimiento»** en el navegador que graba. Si lo tiene activado, se graba la variante sin cámara ni confeti. Algunos entornos automatizados lo activan por defecto.
3. Para cada fotograma `i`, llama a `ANIM.seek(i / fps)`, espera a que se pinte el fotograma (dos `requestAnimationFrame`) y haz la captura. Duración: `ANIM.duration`.
4. Con 30 fps basta.
5. No hay sonido que grabar: la narración son los subtítulos y quedan dentro de la imagen.

### Cómo cambiar algo

Al principio del `<script>` de cada archivo están `DUR`, `CHAPTERS`, `PAUSAS` y `SUBS`, con el formato `[inicio, fin, texto]`.
- Los tiempos de la animación son constantes con nombre: `T1`, `D1`, `SIG`, `WORK(i)`…
- El reproductor es idéntico en todos los archivos: el bloque que empieza en `/* ===== Escalado 16:9 ===== */`.
- Las versiones A y B de los vídeos 9 y 10 salen de la misma plantilla. Se distinguen por la constante `REG = 'A'` o `'B'`. Si cambias algo común, como los tiempos o los subtítulos, cámbialo en los dos archivos.

---

## 4. Qué se ha comprobado

- Ningún archivo carga nada externo. La única URL que aparece es el espacio de nombres SVG, que el navegador no descarga.
- En cada vídeo se comprobaron con código, en muchos instantes:
  - las posiciones del robot (casilla y dirección) y los recuentos (tarjetas, bloques, luces, ejemplos, aciertos);
  - los valores de las variables y del sensor;
  - que el elemento iluminado coincida con lo que se ejecuta.
- **Pausas:** en los 17 vídeos, con el interruptor encendido, el vídeo se para en sus dos pausas y llega al final. Con el interruptor apagado no aparece ninguna. Los recuadros de pregunta no tapan lo que hace falta para responder.
- **El modo `?export=1` solo se probó en `anim-bucle.html`,** forzando el modo dentro del código, porque el visor usado no conserva los parámetros de la dirección. Usa el mismo código en todos, pero conviene confirmarlo al grabar.
- Las pruebas de reproducción se hicieron con un reloj simulado: el navegador de pruebas congela `requestAnimationFrame` cuando la pestaña está oculta. En una pestaña visible normal se reproducen en tiempo real.

---

## 5. Decisiones que no venían en los guiones

Conviene que el docente las revise:

- **Recuadro de las preguntas:** su posición cambia según el vídeo (abajo, arriba o a la derecha) para no tapar lo que se necesita para responder.
- **1 Algoritmo:** el robot y el cofre ocupan la misma casilla. Por eso el cofre es más ancho, la tapa sube por encima y sale una gema.
- **2 Descomponer:** la pieza «Final» (el cartel «¡Has ganado!») se aparta mientras se juega y vuelve al ganar el punto.
- **3 Patrón:** las marcas de capítulo están en los segundos del guion (12 y 46), aunque lo que pasa en pantalla empieza a los 10 y a los 40.
- **4 Bucle:** las tarjetas van en dos filas de 4. Tras la primera vuelta el robot ya está en la salida, así que solo se borra el rastro.
- **5 Condición:**
  - El personaje es una silueta (lo pide el guion); el robot solo aparece en la frase final.
  - Se añadieron coches para justificar la espera: dos pasan con el rojo y dos paran con el verde.
  - Hay una lista «1. Miro / 2. Cruzo» para marcar el orden.
- **6 Evento:** el bloque «salimos al recreo» es azul (el guion no da su color). La B no tiene el saltito del robot porque es registro superior.
- **7 Variable:**
  - Se añadieron bloques reales: `al hacer clic en ⚑`, `dar a vidas el valor 3` y `si ¿tocando…? entonces`.
  - Hay una tabla de registro.
  - Los meteoritos llegan al robot; él no va a por ellos.
- **8 Depurar:** la B usa líneas numeradas y una tabla esperado/real. Su pregunta dice «tarjeta», como el guion, aunque en pantalla son bloques.
- **9 Entrada y salida:**
  - El aluminio y el sensor aparecen antes de sus pausas.
  - En la B, el aluminio actúa como la tecla «espacio» y viaja un paquete de datos con su contenido.
- **10 Optimizar:**
  - La segunda ejecución es más rápida (0,75 s por tarjeta) para que «12 − 5 = 7» quepa antes del resumen.
  - La B mide «bloques escritos» y no pasos: el robot da 12 pasos con los dos programas.
- **11 Coordenadas:** la manzana está exactamente en x = 200, en el borde del escenario. Ella y el robot se dibujan fuera del recorte para verse enteros.
- **12 Sensor y umbral:** el bloque dice «apagar luces», no «apagar». Antes de subir el umbral se ve que con 50 todo funciona bien.
- **13 Cómo aprende una máquina:** entran 6 ejemplos variados (2 rojos, 2 verdes y 2 amarillos). Las respuestas de la segunda ronda se escriben completas: «SÍ es una manzana» y «NO es una manzana».
- **Pantallas finales sin subtítulo:** en los tramos de «texto grande» y «frase clave» no hay subtítulo, salvo en el 1, donde el guion lo pide.

---

## 6. Pendiente o a decidir

1. **Vídeos 2, 4 y 5 (registro medio):** se hicieron antes de definir los registros y conservan adornos del registro inicial.
   - el 2: gotas de sudor;
   - el 4: confeti al final;
   - el 5: saltito y destellos al cruzar.

   El `.md` dice que el registro medio va sin sudor ni saltitos. O se retocan, o se acepta que esos tres queden como están: el docente dijo que para 3º el estilo actual «aún está bien».
2. **Marcas de capítulo del vídeo 3:** decidir si se ajustan a 10 s y 40 s (ver el apartado 5).
3. **Exportación:** confirmar `?export=1` en cada archivo al grabar (ver el apartado 4).
4. **Fuentes:** se usan las del sistema (`system-ui`, `Segoe UI`, Arial). Algunos símbolos (⚑ ↻ → ↑ ✓) dependen de la fuente del equipo. En Windows con Segoe UI se ven bien. Si se graba en Linux, conviene revisar un fotograma de 6B, 8B y 9.
