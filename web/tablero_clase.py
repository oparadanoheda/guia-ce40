# El tablero de la misión: lo que ve la clase en la pizarra mientras trabaja (modo proyección de las sesiones con guion).
# La ficha de la sesión es para el docente; esto es para el alumnado: los pasos en frases cortas, los bloques que
# van a necesitar (sueltos, no el programa montado), una pista para los pasos difíciles, una referencia visual,
# cómo saber si lo han conseguido y el reto para quien termine.
#
# Clave: id de la sesión. Dentro, un tablero por propuesta ("A", "B"…) o "D" si la sesión no tiene propuestas.
#   titulo   el nombre de la misión
#   cols     2 para repartir los pasos en dos columnas (cuando son muchos o llevan bloques)
#   retos    True si los pasos son retos sueltos («Reto 1», «Reto 2»…) y no pasos seguidos; "etiqueta" cambia la palabra («Nivel»)
#   pasos    [{"t": frase (con **negrita**), "bloques": [nombres], "pista": texto, "pics": [pictogramas]}]
#            "pics" solo se usa en 1º y 2º: nombres de pictos.py (o tarjeta, repite, bloque). Si no se pone, se eligen solos por las palabras de la frase.
#            Los bloques se escriben como en el editor; build_web.py les pone el color y revisar_bloques.py los comprueba.
#   ref      la referencia visual: {"titulo", "tipo", "items"}
#              tipo "leds":   [[25 ceros y unos de la pantalla, pie]]
#              tipo "tabla":  la primera fila es la cabecera
#              tipo "lista":  frases numeradas
#              tipo "teclas": [[tecla, pie]] (avanza, retrocede, izquierda, derecha, go, borrar)
#              tipo "pictos": [[pictograma, pie]] (nombres de pictos.py, o tarjeta, repite, bloque)
#   logro    «Lo hemos conseguido si…»: frases que la clase va marcando
#   notas    [[título, texto]]: recuadros de ayuda («¿Algo no sale?», «La media»…)
#   extra    «¿Habéis terminado?»: el reto para quien acabe, sin la solución
#
# Hay un archivo por curso (tablero_c1.py … tablero_c6.py); aquí se juntan.
from tablero_c1 import TABLERO_C1
from tablero_c2 import TABLERO_C2
from tablero_c3 import TABLERO_C3
from tablero_c4 import TABLERO_C4
from tablero_c5 import TABLERO_C5
from tablero_c6 import TABLERO_C6

TABLERO = {**TABLERO_C1, **TABLERO_C2, **TABLERO_C3, **TABLERO_C4, **TABLERO_C5, **TABLERO_C6}
