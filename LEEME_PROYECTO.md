# Guía Código Escuela 4.0 · Primaria · 2026-2027 — documento del proyecto

Documento de referencia para quien mantenga la guía (personas o asistentes de IA): qué es, qué se decidió y por qué, cómo está organizada, cómo se regenera y se comprueba, cómo se publica y qué queda pendiente. Última actualización: 30 de septiembre de 2026.

---

## 1. Qué es

Programación completa de **Código Escuela 4.0** para **1º a 6º de Primaria** de un colegio público de la Comunidad de Madrid, integrada en el área de **Matemáticas**, para el curso 2026-2027. Está pensada para que cualquier docente, sepa o no de programación, pueda dar las sesiones con el trabajo hecho.

- **128 sesiones:** 24 por curso de 1º a 4º (semanales) y 16 en 5º y 6º (12 núcleo + 4 opcionales, quincenales).
- Cada sesión tiene un objetivo fijo, **varias opciones de actividad**, frase clave, «Si cuesta», «Si va rápido» y vínculo con Matemáticas.
- **27 materiales imprimibles** en PDF (M01-M27, incluidos 10 pósteres de conceptos y el vocabulario por curso), **30 herramientas interactivas** para la pizarra digital (proyectables), **9 proyectos de Scratch** (.sb3) y una web que lo reúne todo.
- Cada ficha de sesión tiene un botón **«Proyectar la sesión»** que guía la sesión de principio a fin, a pantalla completa. Arriba, la **barra de fases** (Arranque, Misión, Práctica, Compartir y Cierre; en 5º-6º, Tarjeta, Misión, Práctica, Compartir y Guardar), sin cronómetro, con la fase actual resaltada; se toca una fase para saltar a ella. Diapositivas: portada, «Recordamos» (frase clave de la sesión anterior) o la tarjeta «Dónde lo dejamos», minuto de uso responsable, roles, vídeo, palabras nuevas, **la misión** (la propuesta abierta en la ficha, paso a paso; o los retos de la sesión), frase clave, manos a la obra (herramientas y reto extra), cambio de roles, compartir (con las tres preguntas) y cierre o guardar.

**Dónde está cada cosa para el profesorado:**

| Qué | Dónde |
|---|---|
| Web de la guía (vista previa privada) | https://claude.ai/artifact/9EnbQpgEXsa5JESFdnKHqm (versión 10). Los .sb3 no se descargan aquí: los artifacts no sirven ese tipo de archivo |
| Paquete para el aula virtual o una carpeta compartida | `Guia_CE40_2026-27_web.zip` (4,3 MB) |
| Instrucciones para subirlo al aula virtual | `Cómo subir la guía al aula virtual.txt` |
| PDF para imprimir | `Material imprimible/` (y `Material imprimible/Scratch/`) |

---

## 2. Decisiones del centro y criterios de trabajo (respetarlos siempre)

Son las indicaciones de la persona responsable. Cualquier cambio futuro debe mantenerlas.

**Organización**
- Frecuencia: **semanal en 1º-4º, quincenal en 5º-6º**. Sesiones de 45 minutos. Se empieza en octubre (septiembre queda fuera).
- **Primer ciclo (1º y 2º) principalmente desenchufado.** ScratchJr solo como iniciación en las tres últimas sesiones de 2º (S22-S24).
- **Tale-Bot en 1º** (Lote 1, dotación de Infantil): primer robot en S7-S8; True True desde S11. **Es orientativo**: se adelanta o se alarga según el progreso del grupo, y sirve de apoyo en cualquier curso.
- **Inteligencia artificial solo en 5º y 6º.** De 1º a 4º no hay sesiones de IA; sí clasificar, árboles de preguntas y datos, como pensamiento computacional y estadística.
- **Sin cuentas de alumnado.** Solo Tinkercad las necesitaría y requiere autorización del equipo directivo y del delegado de protección de datos. **Nunca caras** en fotos, vídeos ni Teachable Machine.
- El centro es **preferente de alumnado TEA**.

**Cómo tiene que ser el material**
- **Opciones, no actividades cerradas**, y concretas, para que las lleve a cabo alguien sin experiencia.
- **Dar el material hecho** («no les digas que hagan una flecha, dásela»). Nada que haya que dibujar o fabricar.
- **Nada «loco» de preparar**: ni gorros, ni yincanas ni escape rooms con candados.
- **Siempre una opción en la pizarra** (proyectable) y otra con fichas.
- **Calidad editorial**: aspecto de método de editorial, no de «hecho con IA». Nada de emojis; pictogramas de ARASAAC e iconos propios.
- **Rigor en el contenido.** Ejemplos de errores que hubo que corregir:
  - cruzar la calle: primero se espera al muñeco verde y después se miran los dos lados;
  - el semáforo tiene que ser el de peatones, con el muñeco;
  - una secuencia de «ordenar» debe tener un único orden posible: el sándwich se cambió por la tostada.

**Atención a la diversidad (criterio de la última revisión)**
- La guía da **recursos concretos del área**: materiales por niveles, versiones con pictogramas, Tale-Bot de apoyo, impresión en A3, Makey Makey como mando adaptado…
- **No incluye metodología genérica de aula** (rutinas, agendas visuales, pautas de ruido o de gestión del grupo): eso lo decide cada docente con el equipo de apoyo. Por eso se quitaron la agenda visual, las tarjetas para pedir y calmarse (antiguas M26 y M27) y el «aplauso silencioso».

---

## 3. Estructura de la carpeta

```
Programación Mate 4.0 26-27/
├── 00_General_CE40_26-27.md        Marco, calendario, sesión tipo, diversidad, evaluación, comodines, supuestos
├── 1_primero.md … 6_sexto.md        Las sesiones de cada curso
├── 07_Guias_rapidas_herramientas.md Tale-Bot, True True, ScratchJr, Scratch, Makey Makey, micro:bit, Nezha, Tinkercad, Teachable Machine, QR
├── 08_Plantillas_y_material.md      Catálogo de M01-M25, archivos de Scratch y proyectables
├── LEEME_PROYECTO.md                Este documento
├── Animaciones/                     Encargo de los vídeos (Prompts animaciones.md), informe de entrega y bandeja animaciones_nuevas/
├── Cómo subir la guía al aula virtual.txt
├── Guia_CE40_2026-27_web.zip        Paquete para distribuir (se regenera)
├── Material imprimible/             Copia de los PDF (y Scratch/ con los .sb3)
├── _version_anterior/               Copias de seguridad antes de cada revisión grande
├── dotación.md, Calendario días lectivos 26-27.md,
│   propuesta_secuenciacion_…md, planificación 24-25.md, secuenciación 24-25.md   ← documentos de partida
└── web/                             Todo lo que genera la web, los PDF y los .sb3
```

**`web/` en detalle**

| Archivo | Para qué |
|---|---|
| `build_web.py` | Genera `programacion_CE40.html` (la web, un solo archivo) y `_preview.html` a partir de los .md |
| `app.js`, `estilo.css` | Navegación (rutas `#c1-s7`, `#p-herramienta.variante`, búsqueda, pestañas) y estilos. Tema claro y oscuro, un color por curso (`--c1` a `--c6`) |
| `app.js` · «Volver a la sesión» | Al salir de una ficha hacia un recurso (herramienta, guía, rúbrica, material…) se guarda en `sessionStorage` (`ce40-origen`) la sesión, la posición, la propuesta abierta y, si se venía del modo proyección, la diapositiva. En el recurso aparece un botón fijo abajo a la izquierda y otro en la cabecera de las herramientas. Al volver (con el botón o con el «atrás» del navegador) se restaura todo; la proyección solo se reabre con el botón. Ir a otra sesión, a un curso o al inicio borra el origen |
| `proyeccion.js`, `proyeccion.css` | Modo proyección de cada sesión. Los datos van en un `<script type="application/json" class="pz-data">` dentro de cada ficha (función `projection_data` de `build_web.py`) |
| `vocabulario.py` | **Fuente única** del vocabulario por curso y de los 10 pósteres. De aquí salen M26, M27, el apartado «Palabras del curso» de cada .md y las palabras nuevas del modo proyección |
| `vocab_md.py` | Reescribe el apartado «Palabras del curso» de los seis .md a partir de `vocabulario.py` |
| `proyectables.js`, `proyectables2.js`, `proyectables*.css` | Las 30 herramientas de la pizarra (21 + 9) |
| `videos.py` | **Fuente única** de los vídeos de conceptos: archivo, cursos, frase, segundo de la miniatura y sesiones donde se enlazan |
| `videos/` | Los 17 vídeos (`anim-*.html`, autónomos) y `img/` con sus miniaturas. `videos.css` les da estilo en la web |
| `videos_miniaturas.py` | Crea las miniaturas de `videos/img/` con Edge sin interfaz (necesita `websockets` y `Pillow`) |
| `catalogo.py` | Lista de proyectables (nombre, cursos, descripción, variantes) y aplicaciones externas recomendadas |
| `recursos_oficiales.py` | Biblioteca de enlaces oficiales (EducaMadrid, Tale-Bot, True True, ART2BIT, Nezha, ALBOR, ARASAAC…) |
| `datos_etapa.py` | Datos del «Mapa de la etapa»: herramientas por trimestre, progresión por bloques y productos |
| `materiales.py` | Genera los 25 PDF (HTML → PDF con Edge sin interfaz) |
| `svgkit.py` | Dibujos SVG de los materiales (cuadrículas, flechas, bloques, diagramas) |
| `pictos.py` | Diccionario nombre → id de ARASAAC; descarga los pictogramas a `picto/` y crea `pictos_data.js` (base64 para la web) |
| `scratch_gen.py` | Genera los 9 proyectos .sb3 (dibujos y sonido propios) |
| `empaquetar.py` | Crea `../Guia_CE40_2026-27_web.zip` |
| `revisar_pdfs.py` | Comprueba que ningún PDF se sale de la página |
| `pruebas_scratch/` | Pruebas de los .sb3 en el motor oficial de Scratch (Node) |
| `capturas.py` | Capturas de la web sin interfaz (para revisar el aspecto) |
| `arasaac_buscar.py` | Busca pictogramas y crea hojas de contactos para elegir ids |
| `materiales/` | PDF generados, `src/` (HTML de cada PDF) y `scratch/` (.sb3) |
| `aplicar_bloques.py`, `aplicar_rev.py`, `quitar_emojis.py`, `materiales_rev.py`, `pj_bloques_nuevos.js` | Scripts de un solo uso de revisiones pasadas. Ya aplicados; se pueden borrar |

---

## 4. Formato de las sesiones en los .md (lo lee `build_web.py`)

```markdown
### S7 · Título de la sesión `ROB` `SEG`

- **Qué aprenden:** objetivo en una frase.
- **Prepara antes:** lo que hay que tener listo.
- **Para proyectar:** [[P:beebot.cuadricula|Bee-Bot interactivo]]
- **Material listo:** [[M:M05|Tarjetas de rol]] · [[M:M01|Tarjetas de flechas]]
- **Archivo de Scratch:** [[S:4-S1-arregla-el-juego-3-bichos.sb3|Arregla el juego · 3 bichos]]
- **Minuto de uso responsable:** "frase del banco" y su pregunta (todas las sesiones lo llevan).

**Opción A · Nombre de la opción**
1. Paso…

**Opción B · Otra opción**
Texto o pasos.

- **Frase clave:** "…"
- **Si va rápido:** ampliación concreta.
- **Si cuesta:** simplificación concreta.
- **Producto de T1:** … (en la sesión de cierre de trimestre)
- **Mates:** vínculo matemático concreto.
```

- **Etiquetas:** `PC` pensamiento computacional · `ROB` robótica · `IA` (solo 5º-6º) · `SEG` uso responsable · `RA` realidad aumentada, QR y 3D.
- **Opciones:** `**Opción A · …**` se convierte en pestañas. `**Pasos:**` crea un único bloque de desarrollo. `**Opción más sencilla:**` cuenta como «Si cuesta».
- **Enlaces especiales:**
  - `[[P:herramienta.variante|texto]]` abre un proyectable. Las variantes están en el código; hoy se usan 62 y todas existen.
  - `[[M:M07|texto]]` enlaza un PDF.
  - `[[S:archivo.sb3|texto]]` enlaza un proyecto de Scratch.
- **En la web:** «Si va rápido» y «Si cuesta» aparecen como «Para ampliar» y «Para simplificar» en el bloque «Atención a la diversidad». El resto de viñetas con etiqueta van a «A tener en cuenta».
- **Sesiones opcionales (5º y 6º, S13-S16):** son párrafos breves. Hay que dejar una **línea en blanco** entre las viñetas de cabecera y el párrafo; si no, el texto aparece en la columna lateral.
- **Cada curso tiene además:**
  - «Qué tienen que conseguir», «Vínculo con Matemáticas» y «Currículo de Matemáticas (Decreto 61/2022)»;
  - resumen, material, las sesiones por trimestre, «Atención a la diversidad en Xº», evaluación y sesiones de reserva.

---

## 5. Cómo regenerar todo

Desde `web/` (Python 3 con `markdown`, `pypdf` y `PyMuPDF`; Edge instalado en la ruta estándar):

```bash
python vocab_md.py             # solo si cambia vocabulario.py (reescribe «Palabras del curso» en los .md)
python pictos.py               # solo si cambian los pictogramas (descarga y crea pictos_data.js)
python materiales.py           # todos los PDF; o solo algunos: python materiales.py M04 M11
python scratch_gen.py          # los 9 .sb3 (y copia en Material imprimible/Scratch)
python videos_miniaturas.py    # solo si cambian los vídeos o el segundo de su miniatura en videos.py
python build_web.py            # la web: programacion_CE40.html
python empaquetar.py           # copia la web a ../docs/ (GitHub Pages) y crea el zip del aula virtual
```

- **Orden** si cambia todo: pictos → materiales → scratch → web → zip. Si solo cambian los .md, basta con `build_web.py` y `empaquetar.py`.
- `materiales.py` copia cada PDF también en `Material imprimible/`.
- **Pictogramas nuevos:**
  1. `python arasaac_buscar.py nombre_hoja "término1" "término2"` crea `picto/_hojas/nombre_hoja.png` con los ids.
  2. Añade `"nombre": id` en `P` dentro de `pictos.py` y ejecuta `python pictos.py`.
  3. En los materiales se usa con `pimg("nombre", mm)` y en los proyectables con `pic("nombre")`.
- **Crédito obligatorio** de los pictogramas: «Pictogramas: Sergio Palao. Origen: ARASAAC (arasaac.org). Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón». `page()` lo añade solo a cualquier página de PDF que contenga pictogramas.

---

## 6. Comprobaciones antes de publicar

| Qué | Cómo |
|---|---|
| Ningún PDF se sale de la página | `python revisar_pdfs.py` (desde `web/`). Debe decir `OV ok` en todos |
| Aspecto de los PDF | Abrir las páginas cambiadas y mirarlas (la herramienta Read del asistente muestra cada página como imagen) |
| Enlaces de la web | Tras `build_web.py`: ningún `[[P:`, `[[M:` ni `[[S:` sin resolver en el HTML |
| Todas las sesiones completas | Cada sesión con «Si cuesta», «Si va rápido», «Mates» y al menos un recurso enlazado (hoy, 128 de 128) |
| Los .sb3 funcionan | En `web/pruebas_scratch/`: `npm install` (una vez) y `npm test`. Carga cada proyecto en scratch-vm, comprueba que tiene todos sus dibujos y sonidos, y ejecuta pruebas de comportamiento: soluciones que funcionan y bichos que fallan como se describe |
| Aspecto de la web | `python capturas.py c1-s7 material etapa` crea imágenes en `picto/_hojas/cap_*.png` |
| El zip | Descomprimir en una carpeta temporal y abrir `index.html` |
| Vídeos nuevos o cambiados | Abrirlos con `?export=1` y llamar a `ANIM.seek(t)` en muchos instantes: sin errores de consola, barra oculta, mismo fotograma para el mismo `t`, recorridos y recuentos correctos. Ojo con los `id` repetidos (en el del sensor, un `id="bar"` del dibujo se comía la barra de controles) |

---

## 7. Publicar y distribuir

- **Artifact de Claude (vista previa privada):** se republica con la herramienta Artifact, `file_path = web/programacion_CE40.html` y `url` = el enlace de arriba.
  - Los PDF van como archivos `materiales/Mxx-….pdf`.
  - Los .sb3 **no se pueden** subir a un artifact (tampoco como zip): allí los botones SB3 no descargan.
  - Es privado; para que lo vea otra persona hay que compartirlo desde el menú de la página.
- **Aula virtual de EducaMadrid (Moodle), opción recomendada:**
  1. Recurso **Archivo** en un curso del claustro; se sube el zip.
  2. Pulsar sobre el zip y **Descomprimir**.
  3. **Establecer `index.html` como archivo principal**.
  4. En «Apariencia», **Mostrar: Abrir**.

  Pasos completos en `Cómo subir la guía al aula virtual.txt`. No está probado todavía en el aula virtual real.
- **Carpeta compartida o USB:** descomprimir el zip y abrir `index.html`. Funciona sin internet, salvo los enlaces externos y las fuentes de Google, que se sustituyen por otras.
- **GitHub Pages (sitio oficial de la guía):** https://oparadanoheda.github.io/guia-ce40/ · repositorio https://github.com/oparadanoheda/guia-ce40 (público).
  - La carpeta del proyecto **es** el repositorio Git: textos, `web/` y la web publicada en `docs/` (Pages sirve la rama `main`, carpeta `/docs`).
  - **Para publicar un cambio:** regenerar (`build_web.py` y `empaquetar.py`), revisar y luego `git add -A`, `git commit` y `git push`. La web se actualiza en 1-2 minutos.
  - El `.gitignore` deja fuera los documentos de partida del centro (dotación, planificación y secuenciación 24-25, calendario, propuesta de secuenciación), `_version_anterior/`, `Material imprimible/`, el zip y los temporales.
  - El `index.html` de `docs/` lleva `noindex` para que no salga en buscadores.
  - Autor de los commits: `oparadanoheda` con correo `noreply` de GitHub, configurado solo en este repositorio. La credencial la guarda Git Credential Manager tras iniciar sesión en el navegador.
- **Cabecera HTML:** `programacion_CE40.html` es un fragmento, porque el artifact añade su propio esqueleto. `empaquetar.py` le pone `<!doctype html>`, `charset` y `viewport` en el zip y en la copia para GitHub. Sin eso habría problemas de acentos, modo antiguo del navegador y vista diminuta en el móvil.
- **Netlify** (alternativa): arrastrar la carpeta `docs/` a app.netlify.com/drop.

---

## 8. Contenido: material, Scratch y proyectables

**Material imprimible (M01-M25):**
- M01 flechas · M02 movimientos · M03 bloques tipo ScratchJr · M04 SI/ENTONCES/SI NO · M05 roles
- M06 tablero 5×5 y fichas · M07 mapas del tesoro · M08 cazabichos · M09 patrones · M10 secuencias
- M11 ¿Qué animal soy? (árbol guiado de 4 niveles) · M12 diagramas de flujo · M13 oca de condiciones · M14 misión final · M15 pasaporte
- M16 planificación · M17 playtesting · M18 «Dónde lo dejamos» · M19 rúbrica · M20 chuleta Scratch
- M21 chuleta MakeCode · M22 mando Makey Makey · M23 ¿Puede pasar de verdad? / ¿Verdad, bulo o IA? · M24 casos de IA · M25 registro de datos
- M26 pósteres de conceptos (índice de cuándo colgarlos + 10 pósteres: algoritmo, descomponer, patrón, bucle, condición, evento, variable, depurar, entrada y salida, optimizar; cada uno con ejemplo y escalera 1º-2º / 3º-4º / 5º-6º). Cada póster está enlazado en la sesión donde se cuelga (21 enlaces).
- M27 palabras del curso (una hoja por curso, 12-14 palabras con su sesión)

Detalle en `08_Plantillas_y_material.md`.

**Archivos de Scratch (9, en `web/materiales/scratch/`):**
- **Con bichos:**
  - 4º S1 «Arregla el juego»: mover −10 con la flecha derecha, sonido suelto sin evento, repetir 3 en vez de por siempre.
  - 4º S7 torneo: la variable no vuelve a 0 / la condición al revés / un cuadrado con repetir 3.
  - 5º S1 «Arregla el juego»: puntos no se ponen a 0, «si puntos < 10» dice que has ganado, repetir 2 en vez de por siempre.
- **Soluciones:** 3º S14 juego de atrapar · 4º S5 adivina el número · 4º S6 juego de las tablas · 4º S10-S13 videojuego completo (flechas, premio, meteorito, puntos, vidas, final y nivel 2 con mensaje).
- **Personajes propios:** Robi (robot), manzana y meteorito. Se abren con *Archivo › Cargar desde tu ordenador*.

**Proyectables (30):**
- **Robot y secuencias:** robot en la cuadrícula · ordena la secuencia · patrones · bucles · semáforo de peatones · clasificador · ¿qué animal soy? · votaciones y gráfico · diagramas de flujo
- **Scratch y matemáticas:** polígonos · variables · coordenadas · circuito
- **micro:bit y Nezha:** LED de la micro:bit · sensor y umbral · velocidad × tiempo
- **IA y seguridad:** entrena a la máquina (solo 5º-6º) · verdad/bulo · contraseñas
- **Utilidades:** temporizador · código secreto
- **Juegos para la pizarra:** Bee-Bot (funciona como Tale-Bot) · hundir la flota · píxel art · laberinto de bloques · cartas binarias · Simón · balanza · magia de la paridad · ¿quién sale?

**Vídeos de conceptos (17, en `web/videos/`):**
- 13 conceptos: algoritmo, descomponer, patrón, bucle, condición, evento, variable, depurar, entrada y salida, optimizar, coordenadas, sensor y umbral, cómo aprende una máquina.
- Evento, depurar, entrada y salida y optimizar tienen dos versiones: la de 1º-2º (robot personaje) y la `-superior` (aspecto de editor real) para los cursos que ya programan en pantalla.
- De 45 a 76 s, con subtítulos. Reproductor propio: capítulos, velocidad 0,75×, pantalla completa, «Pausas para pensar» (dos preguntas por vídeo) y «Sonido», los dos apagados por defecto.
- **Sonido:** efectos sintetizados con Web Audio (sin archivos, sin voz y sin música): pasos y giros del robot, aparecer, acierto, error, duda, éxito, la frase clave y efectos propios (timbre, nota do de 0,5 s, aplauso, luces, pitido del semáforo de peatones, coches). Cada vídeo tiene su lista `SONIDOS` junto a `SUBS` (`[segundo, tipo]`); solo suenan durante la reproducción normal (no al saltar, al arrastrar ni con `?export=1`) y se callan al pausar. La elección se guarda en `localStorage` (`ce40-videos-sonido`). Los pasos y giros del robot se sacaron recorriendo cada vídeo con `seek` y detectando cuándo empieza a moverse.
- Cada vídeo es un HTML autónomo (sin nada externo) que se dibuja con `render(t)`. Expone `window.ANIM` (`duration`, `seek`, `play`, `pause`, `chapters`, `pausas`); con `?export=1` oculta los controles, por si un día se quieren grabar en MP4 (fotograma a fotograma con `seek` y ffmpeg; se probó con el del bucle: 2,7 MB).
- En la web: una página por vídeo (`#v-<id>`) dentro de «Para proyectar», con «Volver a la sesión»; enlace en la tarjeta «Para usar en esta sesión» de 46 sesiones, y una diapositiva «Vídeo» en el modo proyección. El reproductor se carga al entrar en la página y se descarga al salir.
- Los hizo otra instancia de Claude con el encargo `Animaciones/Prompts animaciones.md`; el informe de entrega está en `Animaciones/ENTREGA para Claude.md`. Para uno nuevo: pedirlo con ese encargo, dejarlo en `Animaciones/animaciones_nuevas/`, revisarlo, copiarlo a `web/videos/` y añadirlo a `videos.py`.

**Aplicaciones externas recomendadas:** Blockly Games, Quick Draw (5º-6º), AI for Oceans (5º-6º), Hora del Código, CS Unplugged.

---

## 9. Fuentes oficiales y licencias

- **Currículo:** Decreto 61/2022, de 13 de julio, de la Comunidad de Madrid (Educación Primaria). Los apartados «Currículo de Matemáticas» citan literalmente la competencia específica 4 (pensamiento computacional), sus criterios 4.1 y 4.2 por ciclo y los contenidos del ciclo. La asignación de sesiones a cada criterio es propia y conviene que la revise el equipo de ciclo. PDF usado: https://site.educa.madrid.org/cp.aulatres.fuenlabrada/wp-content/uploads/cp.aulatres.fuenlabrada/2024/12/Decreto-61-2022-de-13-de-julio-Curriculo.pdf
- **Código Escuela 4.0 (EducaMadrid):** https://www.educa2.madrid.org/web/centro.codigo-escuela-4.0. Apartado Infantil: vídeos de Tale-Bot, normas de uso para Primaria y situaciones de aprendizaje. Apartado Primaria: True True, ART2BIT, Nezha y misiones «Retos en 45'».
- **Tale-Bot:**
  - botones (avanza, retrocede, giros, GO, borrar), pausa, bucle, grabación de voz;
  - tapete de doble cara, soporte para rotulador y libro de 14 retos;
  - compatible con los tapetes de Bee-Bot.
  - Ficha en ALBOR: https://www.educa2.madrid.org/web/albor/robotica/-/visor/tale-bot
- **ALBOR** (TIC y necesidades educativas especiales de EducaMadrid): https://www.educa2.madrid.org/web/albor/robotica
- **Pictogramas:** ARASAAC (CC BY-NC-SA; uso no comercial, con crédito). Los dibujos de los .sb3, los iconos SVG y los proyectables son propios.
- **El texto de la legislación** no tiene derechos de autor (art. 13 de la Ley de Propiedad Intelectual), por eso se cita literal.

---

## 10. Historial de las revisiones

1. **Primera versión:** planificación original; se bajó un poco el nivel, se pasó a opciones de actividad concretas y se mantuvo el reparto semanal/quincenal.
2. **Primer ciclo desenchufado:** ScratchJr solo al final de 2º.
3. **Web:** una única página con mapa de la etapa (evolución por curso).
4. **Rediseño editorial**, con enlaces a los recursos de Código Escuela 4.0.
5. **Material y herramientas:** proyectables y material hecho (M01-M25), sin preparativos complicados. Después, aplicaciones insertadas para la pizarra (Bee-Bot, hundir la flota, laberinto…).
6. **Revisión de contenido y gráfica:**
   - calle, semáforo de peatones y tostada;
   - animales sin atributos ambiguos, M11 resoluble, reglas de la oca;
   - pictogramas de ARASAAC en lugar de emojis;
   - comprobación de desbordes en todos los PDF.
7. **Tale-Bot, diversidad e IA:** Tale-Bot en 1º (orientativo); IA solo en 5º-6º (se sustituyeron 1º S14, 2º S13, 3º S7 y 4º S15); primera versión de atención a la diversidad.
8. **Recorte de lo genérico:** fuera M26, M27, el aplauso silencioso y las pautas de aula; la diversidad queda centrada en recursos del área. Se añadió el currículo del Decreto 61/2022.
9. **Niveles y vínculos:** «Si cuesta» y «Si va rápido» en todas las sesiones; vínculos matemáticos concretos; recursos en las sesiones que no tenían.
10. **Archivos de Scratch** probados en scratch-vm, y zip para el aula virtual.
11. **Estudio de referentes** y primeras mejoras. Se compararon Teach Computing (Reino Unido), Barefoot, Code.org, la EPCIA del INTEF, editoriales españolas, Código Escuela 4.0 de Cantabria, Dr. Scratch, el test de Román-González, Bebras y la EU Code Week. Se añadieron los pósteres de conceptos (M26), el vocabulario por curso (M27 y en cada .md) y el modo proyección de cada sesión.
14. **Ambientación y animaciones en las herramientas** (ampliación del piloto del robot).
    - **Piezas comunes** en `proyectables.js`, exportadas en `window.PJH`: `islandSVG`, `ROBOT_BODY`, `svgConfetti`, `burst` (confeti sobre cualquier elemento), `setStatus` (franja verde o roja) y `replay`. Los estilos están en `proyectables4.css`.
    - **Robot, Bee-Bot y laberinto:** tablero de isla o camino de arena; personaje que se desliza y gira (capa del tablero fija y capa del personaje animada); temblor al chocar; confeti al llegar.
    - **Flota:** mar con olas, salpicadura al fallar, destello al tocar y barco hundido dibujado.
    - **Secuencias:** revisión en cascada.
    - **Patrones y clasificador:** aparición con salto y temblor al fallar.
    - **Semáforo:** resplandor del color.
    - **Votaciones:** barras que crecen.
    - **Circuito:** corriente que circula y bombilla que brilla.
    - **Temporizador:** anillo con el color de la fase.
    - **«¿Qué animal soy?»:** confeti al acertar.
    - **Interruptor «Sin animaciones»** en cada herramienta (clase `pj-still` en `<html>`, se guarda en `localStorage`). También respeta «reducir movimiento» del sistema. Sin sonidos nuevos.
    - **Sin cambios visuales** en el resto de herramientas (diagramas, polígonos, variables, coordenadas, LED, umbral, velocidad, sesgo, verdad, contraseñas, cifrado, píxel art, binario, Simón, balanza, paridad, ¿quién sale?, bucles).
13. **Menos texto y más visual** (criterio: lo esencial a la vista, el detalle en desplegables `<details class="more">`).
    - **Portada:** 4 tarjetas.
    - **«El método»:** fases, roles con pictogramas, tres preguntas, evaluación, herramientas y reserva; el resto, en desplegables.
    - **Calendario:** sin listados de fechas.
    - **Cada curso:** las sesiones primero y lo demás en «Para consultar»; sin la tabla de resumen.
    - **Herramientas paso a paso:** cada guía es un desplegable.
    - **Recursos:** cada dispositivo es un desplegable.
    - **Fichas:** sin la barra de fases ni la leyenda de bloques.
    - **Herramientas:** sin la descripción bajo el título.
    - **Cifras a la vista:** «El método», de 2.820 a ~390 palabras; cada curso, de ~1.800 a ~550; herramientas paso a paso, de 2.970 a ~120.
    - **Arreglos de paso:**
      - enlaces «Guía paso a paso» y «Ver la rúbrica» rotos desde la renumeración (ahora las anclas son `g-<herramienta>` y `rubrica`, y un enlace a un desplegable lo abre);
      - listas de «Lo básico» que salían en una línea;
      - guías de ScratchJr que aparecían en las sesiones desenchufadas de 2º T2 (los recursos se buscan en la sesión y en el texto del trimestre, sin sus «Nota:»).
15. **Repositorio en GitHub:** el proyecto pasa a ser un repositorio Git publicado en GitHub, con la web en `docs/`. Sustituye a la subida manual de archivos y a la carpeta «Para subir a GitHub».
12. **Botón «Volver a la sesión»:** al consultar una herramienta, guía o rúbrica desde una sesión, se vuelve al mismo punto. Se descartaron otras opciones: abrir las herramientas encima de la sesión (más riesgo, y solo resolvía las herramientas) y abrirlas en otra pestaña (recarga 2 MB y acumula pestañas en la pizarra).
16. **Vídeos de conceptos:** 17 vídeos animados encargados a otra instancia de Claude, revisados fotograma a fotograma e integrados en la web (galería, una página por vídeo, enlaces en 46 sesiones y diapositiva en el modo proyección). En la revisión se arregló el del sensor (el medidor no se veía y la barra salía al grabar), la regla de «Cómo aprende una máquina» (era circular: ahora «redonda, con rabito, de cualquier color»), el texto final de coordenadas, un aviso que se salía de su recuadro y las marcas de capítulo del patrón. Se decidió no hacer MP4. Después se añadieron efectos de sonido opcionales en los 17.
17. **Arreglos de herramientas tras la revisión del docente (2 de octubre):**
    - **Votaciones y gráfico:** un solo selector arriba (Mascotas · Juegos · Frutas · Dado · Mis opciones); cada encuesta con su pregunta; gráfico de barras proporcional con escala (antes las barras no guardaban la proporción); «Mis opciones» con casillas (pregunta opcional y de 2 a 8 opciones, que el navegador recuerda); dado dibujado que rueda y enseña el resultado y las últimas 20 tiradas.
    - **Sensor y umbral:** un solo selector (Luz · Temperatura). El botón «Luz» de arriba no hacía nada: al cargar sin variante no se volvía al modo luz.
    - **Hundir la flota:** el mismo fallo al volver a «5 × 5» después de «Coordenadas (x, y)».
    - **Todas las herramientas:** un solo selector, la fila de botones de arriba, que marca el reto abierto. Todas las opciones que solo estaban dentro subieron arriba: los 15 tableros del robot, AABB y ABCD en patrones, «Lavarse los dientes», tipo, color y tamaño en el clasificador, flecha, sí y no en los LED, casa y pez en píxel art, los 6 niveles del laberinto y 4 cartas binarias. Dentro solo quedan las acciones (ejecutar, comprobar, nueva partida…). Arreglado de paso: «Con bicho» después de «Que crece» no ponía bicho.
    - **Votaciones, pregunta abierta:** el título es una casilla vacía («Escribe aquí la pregunta, si quieres») para usar la misma encuesta en cualquier contexto.
18. **Piloto de guías y soluciones (2 de octubre, 6º S1):**
    - **6º S1:** fuera las cartas binarias, que no tenían relación con la sesión.
    - **«Pistas y soluciones de los retos»** en la sesión: desplegable para el docente con, por reto, una pregunta para pensar, pistas y la solución. Los bloques entre comillas invertidas salen con el color de su categoría de MakeCode o Scratch (función `blocks` de `build_web.py`). En el .md: un párrafo `**Pistas y soluciones:**` seguido de la lista, sin líneas en blanco dentro (las sublistas, con 4 y 8 espacios). No sale en el modo proyección.
    - **«Guía para el docente»** en la página de cada herramienta (botón arriba y desplegable debajo): qué es, qué contar a la clase, preguntas con pistas y solución oculta, matemáticas y para saber más. Fuente: `web/guias_proyectables.py`. Hecha la de las cartas binarias.
    - Revisión: 24 enlaces a herramientas en sesiones que no dicen para qué se usan (lista en la conversación del 2 de octubre; se puede repetir con el script de la sección 6).
19. **«Minuto de uso responsable»** (antes «Minuto SEG», un nombre que no se entendía): las 128 sesiones traen el suyo, una frase del banco y su pregunta, elegida a mano según lo que se hace ese día y sin repetir tema en sesiones seguidas (107 nuevas; las 21 que ya existían se mantienen). El banco de «El método» gana 7 frases. En el modo proyección va justo después de la portada.
20. **Guías para el docente en las 30 herramientas** (`web/guias_proyectables.py`): qué es, qué contar, preguntas con pistas y solución oculta, matemáticas y, donde existe, un enlace a CS Unplugged en español. Las soluciones del robot y del laberinto se calcularon con un simulador que copia las reglas de las herramientas.
    - **Enlaces sin explicar:** de los 23 enlaces a herramientas que las sesiones no explicaban, 5 se quitaron por no tener relación y los demás llevan su «para qué». Las votaciones de proyectos de la clase abren «Mis opciones».
    - **Errores de contenido encontrados al hacerlas:** el cazabichos 3 decía tener 2 bichos pero se arreglaba con 1 cambio (nuevo programa con 2 bichos de verdad); el circuito encendía la bombilla con el plátano y la mano (ahora «conduce muy poco»: no enciende una bombilla, sí sirve con Makey Makey); «Entrena a la máquina» tenía la regla circular «fruta con forma de manzana».
21. **Pistas y soluciones en las sesiones de programar (3º a 6º, 44 sesiones):** para cada reto, una pregunta para pensar, pistas y la solución con los bloques en sus colores (Scratch en 3º y 4º; MakeCode en 5º y 6º, salvo que el título diga Scratch), más los errores frecuentes. Se insertan con el script de un solo uso `poner_soluciones.py` (en la carpeta temporal de la sesión), justo antes de la «Frase clave».
22. **Sesiones desenchufadas:** sus retos se resuelven con las herramientas (soluciones en la «Guía para el docente» de cada una) o con el material impreso (soluciones en cada PDF). Solo se añadieron pistas y soluciones en 1º S12 y 2º S7 (cuadrado y rectángulo con REPITE), que no tenían respuesta en ningún sitio. De paso se corrigió la escalera del robot: tenía 5 escalones y 1º S12 la pedía con «REPITE ×3»; ahora es de 3 escalones en un tablero de 5 × 5, como la de «Bucles».
23. **Proyección de la sesión rehecha:** barra de fases arriba (sin cronómetro), una o varias diapositivas por fase, la misión paso a paso (cada pulsación resalta el siguiente paso) y los retos cuando la sesión los trae (como en 6º S1). El temporizador ya no aparece en la proyección. Los datos salen de `projection_data` (`pz_steps` y `pz_text` en `build_web.py`).
24. **La proyección es para la clase; la ficha, para el docente.** La misión de cada sesión y propuesta está escrita para el alumnado, en frases cortas, en `web/mision_clase.py` (clave: id de la sesión; dentro, «A», «B», «C»… o «D» si no hay propuestas, «retos» si hacen falta y «extra», el reto para quien termine, sin la solución). Si se cambia una propuesta en el .md, hay que revisar su texto ahí. En la barra de arriba, el botón **Recursos** abre los vídeos y las herramientas de la sesión en cualquier momento.
25. **Revisión completa (2 de octubre de 2026):**
    - **Nombres de bloques** como salen hoy en español de España, comprobados con las traducciones oficiales y en el editor. Scratch: «sumar a x», «si toca un borde, rebotar», «iniciar sonido», «módulo», «tocar nota … tiempos». MakeCode: «al presionarse el botón A», «si agitar», «escoger al azar», «mostrar ícono», «reproduce secuencia…», «llamada…». Chuletas M20 y M21 al día y nota en Herramientas paso a paso.
    - **Estructura:** en 5º S10 las dos formas de trabajar con Tinkercad salían dentro del minuto de uso responsable. 5º S6 y S11 ordenadas. Las opcionales de 5º y 6º (S13 a S16) tienen ya qué aprenden, pasos u opciones y frase clave, y las S16 su misión para la clase por opciones.
    - **Contenido:** Hora del Código → laberinto clásico (`code.org/learn` ya no lleva a los tutoriales); el dado de 3º S7 (el proyectable tira, no suma los datos de la clase); semáforo de ruido de 6º S10 con caras (la placa solo tiene luces rojas); lamparita de 5º S4 con «mostrar LEDs» (no hay icono de luna); «unir» con sus espacios; preguntas del minuto adaptadas a sesiones sin robot; «Se usa en» de 12 fichas según el uso real; hoja del dado de M25 para 3º y 5º.
    - **Proyección:** el cierre dice qué se guarda y se recoge según lo que se usa ese día (papel, robots, portátiles, Makey Makey o tablets: `USO_SESION` en `build_web.py`). La barra de fases no recorta las fases cortas en proyectores de 1024 px y en el móvil enseña la fase actual.
    - **Comprobado:** 30 herramientas (87 variantes, 929 pulsaciones sin errores), las 128 proyecciones, los 17 vídeos, los 27 PDF sin desbordes, ninguna página con desbordamiento horizontal en el móvil y modo oscuro.

Las copias de seguridad de cada paso están en `_version_anterior/`.

---

26. **Archivos de MakeCode y proyección visual (2 de octubre de 2026):** 24 proyectos .mkcd para 5º y 6º (`makecode_gen.py`; los bloques los genera el propio MakeCode con `makecode_bloques.py` y se guardan en `makecode_bloques/`), con las extensiones oficiales del Nezha (pxt-nezha v1.3.9 y PlanetX v1.5.33). En el coche del kit los motores van en espejo (recto: M1 positivo y M2 negativo). En MakeCode España la variable se fija con «fijar … a …». En la proyección de 1º y 2º, pictogramas en cada paso (`pictos_mision.py`) y botón «Leer» con la voz del sistema.

## 11. Pendiente e ideas

**Mejoras del estudio de referentes que aún no se han hecho** (propuestas, por orden de impacto):
- **Evaluación con evidencias:** una prueba breve por trimestre y curso al estilo Bebras (con dibujos en 1º-2º), con soluciones y ligada a los criterios 4.1 y 4.2. Añadir Dr. Scratch para los proyectos de 3º a 5º (gratuito y sin cuentas).
- **Eventos:**
  - EU Code Week en octubre (en 2025 fue del 11 al 26), que encaja con la S1-S2 de cada curso;
  - Bebras en noviembre y diciembre (en 2025, del 10 de noviembre al 19 de diciembre), como sesiones de reserva.
  
  Hay que confirmar las fechas de 2026.
- **Familias:** una carta por trimestre con qué se ha aprendido y un reto desenchufado para casa.
- **Arranque del profesorado:** presentación al claustro (unas 10 diapositivas) y «tu primera sesión en 10 minutos».
- **Seguimiento en la web:** marcar las sesiones hechas por grupo, guardado en el propio navegador.

**Revisado y que se deja como está (decisión del 1 de octubre de 2026)**
- La frase de objetivo bajo cada sesión en la lista del curso.
- Las aclaraciones pequeñas de algunas tarjetas de las herramientas (por ejemplo, «Las siguientes tarjetas van dentro»).

**Otros pendientes**

- **Probar el zip en el aula virtual real** de EducaMadrid (que Moodle muestre `index.html` y que los PDF y .sb3 se abran).
- **Abrir un .sb3 en el editor de Scratch** para ver que los bloques se muestran bien (ya están probados en el motor, no en el editor visual).
- **Revisar con el equipo de ciclo** la asignación de sesiones a los criterios y contenidos del Decreto 61/2022.
- **Plantilla imprimible de línea de salida y meta** para el Nezha (5º S8, 6º S4), que ahora dice «una regla o una tira de cinta». Y valorar si los mandos de Makey Makey (cartón, aluminio, celo) necesitan alguna ayuda más.
- **Posibles .sb3 nuevos:** plantillas de inicio del videojuego de 4º o del museo de Makey Makey de 3º; soluciones de 3º S11-S13.
- Borrar los scripts de un solo uso de `web/` si ya no se necesitan.
- **Quick, Draw!** (5º S9) no carga desde la red donde se hizo la revisión: la conexión se corta al cifrar, como hacen los filtros de red. La web funciona; hay que probarla desde la red del centro. Si está bloqueada, la alternativa es AI for Oceans.

---

## 12. Problemas técnicos conocidos y trucos

- **Edge sin interfaz escribe el PDF de forma asíncrona.** Por eso `materiales.py`:
  - borra el PDF antes de generarlo;
  - usa un perfil de navegador distinto por material (`.edge-perfil-Mxx`);
  - espera a que exista el archivo.
- **Páginas de A4 de altura fija** (277 mm, `overflow:hidden`): lo que no cabe se corta sin avisar, por eso existe `revisar_pdfs.py`. `cards()` usa `minmax(0,1fr)` para que las tarjetas no ensanchen la página.
- **`msedge --dump-dom` no devuelve nada en Windows.** `revisar_pdfs.py` escribe el resultado en el título del documento, imprime a PDF y lo lee con PyMuPDF.
- **El panel del navegador integrado se queda colgado** con la web (1,8 MB): para ver la web se usan las capturas de `capturas.py`, y `_preview.html` lleva el `charset` para abrirla en local.
- **Nombres de los bloques:** Scratch tiene «Español» (es) y «Español latinoamericano» (es-419), con nombres distintos («sumar a x 10» y «cambiar x en 10»). MakeCode distingue es-ES y es-MX. La guía usa los de España. Traducciones oficiales para comprobar: `scratch-l10n/editor/blocks/es.json` (GitHub) y `https://makecode.microbit.org/api/translations?lang=es-ES&filename=microbit%2Fcore-strings.json&approved=true`.
- **Panel del navegador integrado oculto:** `requestAnimationFrame` no corre y la proyección no avanza. Para probarla, Edge sin interfaz por CDP. Para ver en local la web publicada (con su `charset`), la configuración «guia-docs» de `.claude/launch.json` sirve `docs/` en el puerto 8766.
- **Barras invertidas desde bash:** los scripts de Python escritos con heredoc en el shell de esta máquina pueden convertir `\1` en un carácter de control. Para ediciones con expresiones regulares, escribir el script en un archivo con la herramienta de escritura, no con heredoc.
- **scratch-vm en Node:** necesita `attachStorage(new ScratchStorage.ScratchStorage())` para cargar los recursos del .sb3. Sin renderizador no funciona «¿tocando…?» ni el lápiz, así que esas partes no se pueden probar ahí. Los valores de las variables pueden venir como texto («0»), por eso las pruebas comparan con `==`.
- **Probar la navegación de la web sin interfaz** (Edge headless):
  - `_preview.html` no tiene `</body>`: el script de prueba se añade al final del archivo.
  - Con `--print-to-pdf`, el resultado se lee en el título del documento con PyMuPDF.
  - `requestAnimationFrame` no siempre se ejecuta (no hay fotogramas), así que la web restaura la posición con `scrollTo` inmediato y `setTimeout`.
  - `history.back()` cuelga la captura con páginas `file://`: se simula con un cambio de `location.hash`.
  - La consola de Windows necesita `PYTHONIOENCODING=utf-8` para imprimir «←».
- **Artifacts:**
  - no admiten iframes, impresión ni descargas (por eso los vídeos no se ven en la vista previa del artifact; sí en GitHub Pages y en el zip);
  - solo sirven tipos web (no .sb3 ni .zip);
  - los enlaces externos se abren en otra pestaña.
