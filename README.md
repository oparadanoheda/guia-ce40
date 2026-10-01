# Guía didáctica · Código Escuela 4.0 · Primaria · 2026-2027

Programación de Código Escuela 4.0 para 1º a 6º de Primaria, integrada en el área de Matemáticas: 128 sesiones con opciones de actividad, herramientas interactivas para la pizarra digital, material imprimible en PDF y proyectos de Scratch.

**La guía se consulta en la web de GitHub Pages de este repositorio:** https://oparadanoheda.github.io/guia-ce40/

## Qué hay aquí

| Carpeta o archivo | Contenido |
|---|---|
| `docs/` | La web publicada (`index.html`, PDF y proyectos de Scratch). GitHub Pages la sirve desde aquí |
| `00_General_CE40_26-27.md`, `1_primero.md` … `6_sexto.md`, `07_…`, `08_…` | Los textos de la guía: método, sesiones de cada curso, guías de herramientas y catálogo de material |
| `web/` | Los programas que generan la web, los PDF y los archivos de Scratch |
| `LEEME_PROYECTO.md` | Documento del proyecto: decisiones, estructura, cómo se regenera, comprobaciones e historial |

## Regenerar la web

Desde la carpeta `web/` (Python 3 con `markdown`, `pypdf` y `PyMuPDF`, y Microsoft Edge para los PDF):

```bash
python materiales.py      # PDF del material imprimible
python scratch_gen.py     # proyectos de Scratch
python build_web.py       # la web
python empaquetar.py      # copia la web a docs/ y crea el zip para el aula virtual
```

Detalles en `LEEME_PROYECTO.md`.

## Créditos

Pictogramas: Sergio Palao. Origen: ARASAAC (arasaac.org). Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón. Uso educativo y no comercial.
