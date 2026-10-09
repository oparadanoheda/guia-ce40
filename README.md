# Guía didáctica · Código Escuela 4.0 · Primaria · 2026-2027

**Versión 1.2** · octubre de 2026

Programación de Código Escuela 4.0 para 1º a 6º de Primaria, integrada en el área de Matemáticas: 128 sesiones con opciones de actividad, 33 herramientas interactivas para la pizarra digital, 19 vídeos animados que explican los conceptos, 5 retos para las tablets y los portátiles del alumnado (con un QR o con un icono en el escritorio), 28 materiales imprimibles en PDF y proyectos de Scratch (15) y de MakeCode (24).

**La guía se consulta en la web de GitHub Pages de este repositorio:** https://oparadanoheda.github.io/guia-ce40/

## Qué hay aquí

| Carpeta o archivo | Contenido |
|---|---|
| `docs/` | La web publicada (`index.html`, PDF y proyectos de Scratch). GitHub Pages la sirve desde aquí |
| `00_General_CE40_26-27.md`, `1_primero.md` … `6_sexto.md`, `07_…`, `08_…` | Los textos de la guía: método, sesiones de cada curso, guías de herramientas y catálogo de material |
| `web/` | Los programas que generan la web, los PDF y los archivos de Scratch, y los vídeos de conceptos (`web/videos/`) |
| `Animaciones/` | Encargo y guiones de los vídeos, e informe de entrega |
| `LEEME_PROYECTO.md` | Documento del proyecto: decisiones, estructura, cómo se regenera, comprobaciones e historial |

## Regenerar la web

Desde la carpeta `web/` (Python 3 con `markdown`, `pypdf`, `PyMuPDF` y `segno`, y Microsoft Edge para los PDF):

```bash
python materiales.py      # PDF del material imprimible
python scratch_gen.py     # proyectos de Scratch
python build_web.py       # la web
python empaquetar.py      # copia la web a docs/ y crea el zip para el aula virtual
```

## Comprobar antes de publicar

```bash
python revisar_bloques.py           # los bloques citados se llaman como en Scratch y MakeCode
python revisar_pdfs.py              # ningún PDF se sale de la página
cd pruebas_scratch && npm test      # los proyectos de Scratch funcionan
cd pruebas_web && python probar_web.py   # la web: páginas, herramientas, proyección, accesibilidad y retos de la tablet
```

Detalles en `LEEME_PROYECTO.md`.

## Créditos

Pictogramas: Sergio Palao. Origen: ARASAAC (arasaac.org). Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón. Uso educativo y no comercial.
