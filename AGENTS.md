# AGENTS.md

Guía didáctica «Código Escuela 4.0 · Primaria» (128 sesiones de 1º a 6º) y la web que la publica. El contenido son los `.md` de la raíz; `web/` lo convierte en una web de un solo archivo que se copia a `docs/` (GitHub Pages, rama `main`).

**Lee `LEEME_PROYECTO.md` antes de cambiar nada**: apartado 2 (criterios del centro), 4 (formato de las sesiones, que es lo que analiza `build_web.py`), 5-6 (regenerar y comprobar) y 12 (problemas conocidos). Es el documento vivo del proyecto: cada cambio importante se apunta en su historial (apartado 10).

Se trabaja y se responde en español de España.

## Criterios de contenido (del centro, no negociables)

- **No inventar contenido.** Nada sobre robots, programas o material que no esté ya en la guía (`07_Guias_rapidas_herramientas.md`, `08_Plantillas_y_material.md`, `web/materiales.py`, `web/catalogo.py`, `web/guias_proyectables.py`). Lo añadido de cosecha propia se le dice al usuario.
- **Sin emojis** en ningún texto. Única excepción: la bandera de Scratch dentro del nombre del bloque (`al hacer clic en 🏴`), que la web dibuja. Comillas latinas «…».
- **IA solo en 5º y 6º.** 1º y 2º son desenchufados (sin editor: ahí no hay bloques entre comillas invertidas).
- **Material hecho, opciones concretas**, siempre una opción en la pizarra y otra con fichas; nada que el docente tenga que fabricar. Sin cuentas de alumnado, nunca caras.
- **Los nombres de bloques** van entre comillas invertidas y son los oficiales de Scratch «es» y MakeCode «es-ES» (no los latinoamericanos). No se escriben de memoria: se copian de la sesión o se comprueban con `revisar_bloques.py`.
- La web cumple WCAG 2.1 AA (lo comprueba `probar_web.py accesibilidad`).

## Dónde se edita cada cosa

- **Sesiones:** `1_primero.md` … `6_sexto.md`. El formato es estricto; `build_web.py` se para si algo no cuadra.
- **Fuentes únicas** (no editar a mano lo que generan): `web/vocabulario.py` → «Palabras del curso» de los `.md` (con `vocab_md.py`), M26 y M27; `web/videos.py` → vídeos y sus sesiones; `web/repaso.py` → «Para repasar» y mapa de conceptos; `web/catalogo.py` → herramientas y sus variantes (`[[P:herramienta.variante|…]]`).
- **Lo que ve la clase al proyectar** (el tablero de la misión) está aparte del `.md`, en `web/tablero_cN.py` (formato en la cabecera de `web/tablero_clase.py`), y hay que mantenerlo a la par cuando se cambia una propuesta.
- **Generado, no tocar a mano:** `docs/`, `web/programacion_CE40.html`, `web/_*.html`, `web/pictos_data.js`, `web/materiales/`, el zip.
- **Fuera de git** (`.gitignore`): los documentos de partida del centro, `_version_anterior/`, `Material imprimible/`, `.claude/`. `.taste-skill/` son maquetas de diseño sin seguimiento.

## Formato de las sesiones (con guion)

Todas las sesiones tienen las fases `**Empezamos (10 min):**`, `**A trabajar (25 min):**`, `**Cerramos (10 min):**` (deben sumar 45). El formato antiguo ya no se lee: si una sesión no tiene las tres fases, o le queda `**Prepara antes:**` o `**Pasos:**`, `build_web.py` se para.

- Criterios para escribir o cambiar una sesión: `web/INSTRUCCIONES_GUION.md` (con ellas se pasaron todas al guion). Para revisarla: `web/REVISION_GUION.md`.
- Roles y minuto de uso responsable no son pasos; si las normas de uso son el contenido de la sesión, van como primer paso de «Empezamos» y se quita la línea del minuto.
- El tablero da los bloques sueltos de cada paso y pistas, nunca la solución ni cuáles son los bichos de un archivo.
- Sublistas con 4 espacios; sin líneas en blanco dentro de una lista; línea en blanco entre bloques.

## Comandos

Todo desde `web/` (Python 3 con `markdown`, `pypdf`, `PyMuPDF`, `segno`; Edge instalado para PDF, capturas y pruebas).

```powershell
python valida_guion.py c3        # segundos: comprueba las sesiones con guion de un curso (sin argumentos, los seis)
python revisar_bloques.py        # los bloques citados existen con ese nombre
python build_web.py              # genera programacion_CE40.html; falla si hay enlaces, conceptos o tableros que no cuadran
python empaquetar.py             # copia a ../docs/ y crea el zip; las pruebas miran docs/, así que va antes de probar
python capturas_guion.py c2-s7   # capturas de ficha y proyección en picto/_hojas/g_*.png (tras build_web.py)
```

Si solo cambian los `.md` o los tableros: `valida_guion.py` → `revisar_bloques.py` → `build_web.py` → `empaquetar.py`. Los PDF (`materiales.py M04 M11`), los `.sb3` (`scratch_gen.py`) y los pictogramas (`pictos.py`) solo se regeneran si cambian sus fuentes.

Pruebas de la web, desde `web/pruebas_web/`:

```powershell
$env:PYTHONIOENCODING="utf-8"            # sin esto la consola de Windows falla al imprimir
python probar_web.py estatico            # segundos
python probar_web.py proyeccion          # minutos; incluye que cada tablero cabe a 1024×768 y 1366×768
python probar_web.py accesibilidad       # larga: lanzarla en segundo plano
python probar_web.py                     # todo, unos 50 minutos (también paginas, herramientas, tablet)
```

Debe terminar en «RESULTADO: todo bien». Otros: `python revisar_pdfs.py` (PDF sin desbordes), `npm test` en `web/pruebas_scratch/` (los `.sb3`).

## Trampas de esta máquina (Windows, PowerShell)

- **Los `.md` usan CRLF y UTF-8.** Usa la herramienta de edición, o un script de Python guardado en un archivo que lea y escriba bytes conservando CRLF. `Get-Content`/`Set-Content` y los heredocs de PowerShell estropean acentos, comillas y barras invertidas.
- La salida de PowerShell muestra los acentos como `�`: es la consola, no el archivo. No «arregles» el archivo por eso.
- Si una prueba se corta, quedan procesos de Edge sin interfaz (`--remote-debugging-port`) y la siguiente prueba se conecta al navegador viejo, con resultados que no cuadran: ciérralos antes de repetir.
- Los PDF no se pueden leer directamente: conviértelos a PNG con PyMuPDF y mira la imagen.
- Para ver el aspecto de la web usa capturas (`capturas.py`, `capturas_guion.py`); el navegador integrado se cuelga con ella.

## Publicar

- Publicar es `git push` a `main`: la web pública se actualiza sola en 1-2 minutos. **No hagas commit ni push sin que el usuario lo pida.**
- Antes: regenerar, `empaquetar.py` y pruebas en verde; `docs/` debe ir en el mismo commit que sus fuentes.
- La versión está en varios sitios a la vez: `VERSION` en `web/build_web.py`, dos textos en `web/empaquetar.py`, `README.md` y la cabecera e historial de `LEEME_PROYECTO.md`. Los commits de versión siguen el patrón «Versión 1.9: qué cambia».
- El autor de los commits ya está configurado en el repositorio (`oparadanoheda`, correo `noreply`); no lo cambies.
