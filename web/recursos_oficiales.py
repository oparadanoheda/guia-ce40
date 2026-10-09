# Recursos oficiales de Código Escuela 4.0 (EducaMadrid) y herramientas externas.
# Enlaces recogidos de https://www.educa2.madrid.org/web/centro.codigo-escuela-4.0 (septiembre 2026).

MV = "https://mediateca.educa.madrid.org/js/pdf/web/mediateca_viewer.php?id="
ST = "https://mediateca.educa.madrid.org/streaming.php?id={}&documentos=1&ext=.pdf"
FILES = "https://www.educa2.madrid.org/web/educamadrid/principal/files/4371220e-9718-4e15-8e78-3e998ef91ef0/Documentos/"
WEB = "https://www.educa2.madrid.org/web/centro.codigo-escuela-4.0/"

# ---------- Biblioteca por dispositivo ----------
LIBRARY = [
    {
        "id": "rec-talebot", "name": "Tale-Bot", "courses": "1º (orientativo) y apoyo en 1º-2º", "color": "c1",
        "intro": "Robot de suelo de la dotación de Infantil (Lote 1) que se programa con botones. En esta guía es el primer robot de 1º y un buen apoyo para el alumnado que lo necesite.",
        "groups": [
            ("Para empezar", [
                ("Vídeos, normas de uso para Primaria y situaciones de aprendizaje (apartado Infantil)", WEB + "e.-infantil", "Web"),
                ("Vídeo: configuración y accesorios del Tale-Bot", "https://mediateca.educa.madrid.org/video/pdop28bps8x5b6ay", "Vídeo"),
                ("Ficha de Tale-Bot en ALBOR (TIC y necesidades educativas especiales)", "https://www.educa2.madrid.org/web/albor/robotica/-/visor/tale-bot", "Web"),
            ]),
        ],
    },
    {
        "id": "rec-diversidad", "name": "Atención a la diversidad", "courses": "1º a 6º", "color": "c4",
        "intro": "Robótica accesible y pictogramas para adaptar el material de las sesiones.",
        "groups": [
            ("Recursos", [
                ("ALBOR: robótica y necesidades educativas especiales", "https://www.educa2.madrid.org/web/albor/robotica", "Web"),
                ("ALBOR: recursos TIC y NEE", "https://www.educa2.madrid.org/web/albor/recursos", "Web"),
                ("ARASAAC: pictogramas y materiales", "https://arasaac.org", "Web"),
            ]),
        ],
    },
    {
        "id": "rec-truetrue", "name": "True True", "courses": "1º a 3º", "color": "c1",
        "intro": "Robot de suelo que se programa con tarjetas de colores. Es el robot del primer ciclo en esta guía.",
        "groups": [
            ("Para empezar", [
                ("Manual docente (A4)", MV + "dz7amxzeoegpioah", "PDF"),
                ("Normas de uso para el aula (A3)", MV + "vild4b9fmu8ti5bx", "PDF"),
                ("Normas de uso (A4)", MV + "1cb89gmyxfb9wjbh", "PDF"),
                ("Tarjetas True True en castellano", MV + "xae65z5nrbjd7lwt", "PDF"),
                ("Tarjetas de roles para el trabajo cooperativo", MV + "sp2ki5sqi4obegwx", "PDF"),
                ("Vídeos de presentación y funcionalidades", WEB + "e.-primaria", "Web"),
                ("Vídeo: True True, el robot traga números", "https://mediateca.educa.madrid.org/video/ws78bce66gbank6a", "Vídeo"),
                ("Web del fabricante: recursos y tutoriales", "https://www.truetrue.es/recursos.html", "Web"),
                ("Calibración de motores", "https://complubot.com/calibracion-de-motores-con-truetrue-ajustando-su-movimiento-con-precision/", "Web"),
            ]),
            ("Situaciones de aprendizaje oficiales", [
                ("Camino numérico con True True", MV + "64b82p7kks3bvny4", "1º"),
                ("Educación vial con True True", MV + "pslxg8cp4bcnxpxc", "1º"),
                ("Explorando figuras geométricas con True True", MV + "xjrki2dno31dc419", "1º"),
                ("Recicla con True True", MV + "76vukai1zl4ixnc7", "1º-2º"),
                ("Inteligencia artificial con True True", MV + "8bsn28ao6hwo65r1", "en el centro, solo 5º-6º"),
                ("Explorando las partes del cuerpo humano", MV + "axkahu73befyio7d", "1º"),
                ("Bailando al ritmo con True True", MV + "ll65eskjduqctvva", "1º"),
                ("Exploradores del parque natural (inglés)", MV + "oilnuzkgejrldn7r", "1º"),
                ("¿Qué soy? True True con Scratch", MV + "b1iupxwt5ygeeqxa", "1º-2º"),
                ("Exploradores del mapa de Madrid con True True", MV + "g9odr2vk8rtxdo9o", "1º-2º"),
            ]),
            ("Más actividades", [
                ("Suma con True True", ST.format("ipwxmjmutnauyux5"), "1er ciclo"),
                ("True True y los números del 1 al 20", ST.format("sm8t1em6xhadvv98"), "1er ciclo"),
                ("Operaciones y polígonos con True True", ST.format("zedpgskcps58zk3h"), "2º ciclo"),
                ("Bailando con True True", ST.format("fcy1y56tvk196o8w"), "Internivel"),
                ("Actividad de Don Quijote con True True", ST.format("9muzt53gdgjvnxnh"), "Internivel"),
                ("Actividad de Halloween con True True", ST.format("274upnni6ko6jats"), "Internivel"),
                ("Escribe lo que ves y dibuja lo que lees", WEB + "primaria/-/visor/escribe-lo-que-ves-y-dibuja-lo-que-lees", "Recurso"),
            ]),
        ],
    },
    {
        "id": "rec-clicplay", "name": "Makey Makey · Clic and Play", "courses": "3º y 4º", "color": "c3",
        "intro": "Placa que convierte objetos conductores en teclas. En la web oficial aparece como Clic and Play; sus situaciones de aprendizaje traen el programa de Scratch hecho.",
        "groups": [
            ("Para empezar", [
                ("Manual docente (A4)", MV + "zf1ps2yb8362az2i", "PDF"),
                ("Normas de uso para el aula (A3)", MV + "q18b6rvbmrtf7ro2", "PDF"),
                ("Normas de uso (A4)", MV + "ejr76lddixibmseh", "PDF"),
                ("Vídeos: funcionamiento, tierra, cables, materiales conductores, Scratch", WEB + "e.-primaria", "Web"),
                ("Apps para probar (piano, bongos)", "https://makeymakey.com/pages/plug-and-play-makey-makey-apps", "Web"),
            ]),
            ("Situaciones de aprendizaje oficiales (con programa de Scratch)", [
                ("Clasificador interactivo de alimentos", MV + "w8ggks7jhflbrsrx", "3º-4º"),
                ("El esqueleto interactivo", MV + "k9136afazqnsmc5i", "3º-4º"),
                ("Mis rutinas saludables", MV + "dyaxd9yz82p7hlqo", "3º-4º"),
                ("Órganos interactivos", MV + "fnoqpnwru8yfzm8r", "3º-4º"),
                ("Quiz ¡Prevención en acción!", MV + "p9nyydelqet6fkbr", "3º-4º"),
                ("Duelo de decisiones saludables", MV + "bs65ekj2o74ldsr5", "3º-4º"),
                ("Funciones vitales", MV + "f99rnlbyrn621y7y", "3º-4º"),
                ("Monitor de funciones vitales", MV + "q5efflvc8868o8kh", "3º-4º"),
                ("La pirámide de los alimentos", MV + "8cu5l1zcbjosb76d", "3º-4º"),
                ("Ordenando secuencias de higiene", MV + "qiuny9sner8mpfxj", "3º-4º"),
            ]),
        ],
    },
    {
        "id": "rec-art2bit", "name": "ART2BIT de Jovi", "courses": "3º y 4º", "color": "c4",
        "intro": "Kit de arte y robótica con pintura conductiva. Opcional en esta guía, como alternativa de proyecto.",
        "groups": [
            ("Situaciones de aprendizaje oficiales", [
                ("Las capas de la Tierra", MV + "bhdn4nvsqnfjtwqk", "3º-4º"),
                ("El ciclo del agua", MV + "dzv6u83c2zq3du8e", "3º-4º"),
                ("Placas tectónicas", MV + "tuo3jhwojqc5bmnb", "3º-4º"),
                ("Hello Robots", MV + "so7uwpwxl8x2u9xy", "3º-4º"),
                ("Refugio lunar", MV + "ibyxg46jiyz3z7uy", "3º-4º"),
                ("Arte cinético", MV + "vm26zl6klyk1leog", "3º-4º"),
                ("Dibuja tu poema", MV + "vycmvx2pwn1lcbn8", "3º-4º"),
                ("Fanzine", MV + "gh1oazqtkyzfvv6a", "3º-4º"),
                ("Mundo geométrico", MV + "ay4n4oijd1wibepf", "3º-4º"),
                ("Volcano", MV + "nwdfk8u6yv3m3sae", "3º-4º"),
            ]),
        ],
    },
    {
        "id": "rec-nezha", "name": "micro:bit y Nezha Inventor", "courses": "5º y 6º (oficialmente desde 3º)", "color": "c5",
        "intro": "Placa programable con MakeCode y kit de robótica con motores, sensores y piezas de construcción.",
        "groups": [
            ("Rutas de aprendizaje para el docente", [
                ("Empezando con micro:bit en Primaria", ST.format("ej81b9sxiiej2m48"), "PDF"),
                ("Micro:bit y sus superpoderes", ST.format("yu49j7oymmv976u6"), "PDF"),
                ("De principiante a experto: tu ruta de aprendizaje con Nezha", ST.format("kms5gzjcrbr7srcr"), "PDF"),
                ("Tarjetas de roles para el trabajo cooperativo", "https://mediateca.educa.madrid.org/streaming.php?id=pdcyoe1bcki57bc8&documentos=1&ext=.pdf", "PDF"),
                ("Vídeo: presentación del kit micro:bit, Nezha y Kit de Robótica Creativa", "https://mediateca.educa.madrid.org/video/5d28f6kg4gabmwot", "Vídeo"),
                ("Vídeo: Kit Nezha Inventor y micro:bit", "https://mediateca.educa.madrid.org/video/7eae7kpke3l8x2qa", "Vídeo"),
                ("Vídeo: Kit Nezha Inventor V2 para micro:bit del aula", "https://mediateca.educa.madrid.org/video/5y6fidnyymv2e38k", "Vídeo"),
                ("Vídeo: los sensores del Kit de Robótica para micro:bit", "https://mediateca.educa.madrid.org/video/6miku4lze5wf5uf3", "Vídeo"),
                ("Vídeo: construye dispositivos con Nezha programando en MakeCode", "https://mediateca.educa.madrid.org/video/o1yydd1zlal6jfcj", "Vídeo"),
            ]),
            ("Situaciones de aprendizaje oficiales (guía, programa .hex y manual de montaje)", [
                ("Semáforo inteligente", MV + "rrwnp7afl5xbjt6m", "4º-6º", FILES + "Recursos%20nezha2/SA%204_microbit-SEM%C3%81FORO-INTELIGENTE.hex?t=1746781313105", MV + "3cnj7py2vsh2cubr"),
                ("Domótica escolar", MV + "pfihqyzqibcl5pyt", "3º-5º", FILES + "Recursos%20nezha2/SA%203_microbit-DOMOTICA-ESCOLAR.hex?t=1746781304958", MV + "af996ahr8mux1xdu"),
                ("Detector de temperatura y humedad", MV + "yf5eocgecq7c4m4c", "4º-5º", FILES + "Recursos%20nezha2/SA%202_microbit-DETECTOR-DE-TEMPERATURA-Y-HUMEDAD.hex?t=1746781294589", MV + "k6nsumwn9qwdobtr"),
                ("Los ecosistemas", MV + "k456lprj6wq6oowc", "4º-5º", FILES + "Recursos%20nezha2/SA%201_microbit-ACTIVIDAD-ECOSISTEMAS.hex?t=1746781256081", MV + "m6b4zfryw7ewaurt"),
                ("Vehículos y aceleración", MV + "5qqlvowlt8dzgp5w", "4º-6º", FILES + "Recursos%20nezha2/SA%205_microbit-VEH%C3%8DCULOS-Y-ACELERACION.hex?t=1746781322352", MV + "sxku4log98j4brkq"),
                ("Molinos de viento", MV + "csgglg5k4uux5klq", "4º-6º", FILES + "Recursos%20nezha2/SA%206_microbit-MOLINO-DE-VIENTO.hex?t=1746781331361", MV + "xesraegc7k3qeeqt"),
                ("Control de terremotos", MV + "qt6tg5yuleluhze2", "4º-6º", FILES + "Recursos%20nezha2/SA%207_microbit-CONTROL-DE-TERREMOTOS.hex?t=1746781347058", MV + "awgyrnthutr8v172"),
                ("Robot de peso", MV + "bdq7lqaz8zo4wwbw", "4º-6º", FILES + "Recursos%20nezha2/SA%208_microbit-ROBOT-DE-PESO.hex?t=1746781368310", MV + "qtf3ff7czoiifixd"),
                ("La araña detecta a su presa", MV + "vwgr2gdfo7pajtv4", "4º-6º", FILES + "Recursos%20nezha2/SA%209%20_microbit-ALIMENTACI%C3%93N-ARA%C3%91A.hex?t=1746781395678", MV + "ac52eaifi62yzepp"),
                ("Robot de transporte y seguridad", MV + "p91pegy2o57cifhh", "4º-6º", FILES + "Recursos%20nezha2/SA%2010_microbit-ROBOT-DE-TRANSPORTE-Y-SEGURIDAD%20%282%29.hex?t=1746781402146", MV + "3ssoh6byz44edjyh"),
            ]),
        ],
    },
    {
        "id": "rec-retos", "name": "Retos en 45 minutos · Misiones eXe", "courses": "Primaria", "color": "c2",
        "intro": "Misiones interactivas oficiales pensadas para una sesión. Muy útiles como sesión de reserva.",
        "groups": [
            ("Misiones", [
                ("True True se va de vacaciones", "https://www.educa2.madrid.org/web/educamadrid/principal/files/a5f7f571-6734-4d44-bab4-0f3587d9a5ec/index.html", "Primaria"),
                ("True True quiere ser superhéroe", "https://www.educa2.madrid.org/web/educamadrid/principal/files/ed9d535d-840a-43cd-8ac0-10cacd130ddf/index.html", "Inf./Prim."),
                ("¡Ayuda a PepeRot a elegir sus vacaciones!", "https://www.educa2.madrid.org/web/educamadrid/principal/files/6ddcda94-0bdb-4d01-abf0-164203e8ba26/index.html", "Primaria"),
                ("El desafío de las piedras misteriosas", "https://www.educa2.madrid.org/web/educamadrid/principal/files/8d453067-b225-4a01-af36-6e0a725a59d1/index.html", "Primaria"),
                ("Todas las misiones", WEB + "retos2425", "Web"),
            ]),
            ("Otros recursos de Primaria", [
                ("Carnival Parade (rutas y seguridad vial, inglés)", WEB + "primaria/-/visor/carnival-parade", "Recurso"),
                ("Cooperative Animals (inglés)", WEB + "primaria/-/visor/cooperative-animals", "Recurso"),
                ("Ahorradores en acción (educación financiera)", WEB + "primaria/-/visor/ahorradores-en-accion-la-gran-aventura-financiera", "Recurso"),
                ("Todos los recursos de Primaria", WEB + "primaria", "Web"),
            ]),
        ],
    },
    {
        "id": "rec-orient", "name": "Orientaciones y formación", "courses": "Todo el claustro", "color": "c6",
        "intro": "Documentos marco del programa y oferta de formación para el profesorado.",
        "groups": [
            ("Documentos", [
                ("Metodología (documento descargable)", "https://mediateca.educa.madrid.org/documentos/puask6s4fzo723x9/fs", "PDF"),
                ("Propuesta de secuenciación de contenidos", WEB + "propuesta-de-secuenciacion-de-contenidos1", "Web"),
                ("Diagnóstico del centro", WEB + "diagnostico1", "Web"),
                ("Normativa", WEB + "normativa", "Web"),
                ("Dispositivos de Primaria (vídeos y materiales)", WEB + "e.-primaria", "Web"),
                ("Semanas temáticas", WEB + "semanas-tematicas", "Web"),
                ("Oferta formativa", WEB + "oferta-formativa-2-trimestre.-curso-25/26", "Web"),
            ]),
        ],
    },
    {
        "id": "rec-externas", "name": "Herramientas gratuitas usadas en la guía", "courses": "Según curso", "color": "c4",
        "intro": "Todas funcionan sin cuenta de alumnado, salvo Tinkercad (ver la guía de herramientas).",
        "groups": [
            ("Programación", [
                ("ScratchJr: guía de la interfaz", "https://www.scratchjr.org/explore/interface", "2º-3º"),
                ("Scratch: crear un proyecto", "https://scratch.mit.edu/projects/editor/", "3º-5º"),
                ("Scratch: tutoriales", "https://scratch.mit.edu/ideas", "3º-5º"),
                ("MakeCode para micro:bit", "https://makecode.microbit.org/", "5º-6º"),
                ("micro:bit: proyectos y lecciones en español", "https://microbit.org/es-es/", "5º-6º"),
                ("Tinkercad: aprender", "https://www.tinkercad.com/learn", "5º-6º"),
                ("Teachable Machine", "https://teachablemachine.withgoogle.com/", "3º-6º"),
            ]),
            ("Sesiones de reserva", [
                ("Hora del Código: laberinto clásico", "https://studio.code.org/es/hoc/1", "3º-6º"),
                ("CS Unplugged en español", "https://www.csunplugged.org/es/", "Todos"),
                ("Pictogramas ARASAAC", "https://arasaac.org/", "1º-2º"),
            ]),
        ],
    },
]

# ---------- Enlaces automáticos dentro de las sesiones ----------
# Nombre (tal como aparece en el texto, en cursiva) -> URL
SA_LINKS = {
    "Camino numérico con True True": MV + "64b82p7kks3bvny4",
    "Educación vial con True True": MV + "pslxg8cp4bcnxpxc",
    "Explorando figuras geométricas con True True": MV + "xjrki2dno31dc419",
    "Recicla con True True": MV + "76vukai1zl4ixnc7",
    "Inteligencia Artificial con True True": MV + "8bsn28ao6hwo65r1",
    "Explorando las partes del cuerpo humano": MV + "axkahu73befyio7d",
    "Bailando al ritmo con True True": MV + "ll65eskjduqctvva",
    "Exploradores del mapa de Madrid con True True": MV + "g9odr2vk8rtxdo9o",
    "¿Qué soy? True True con Scratch": MV + "b1iupxwt5ygeeqxa",
    "Operaciones y polígonos con True True": ST.format("zedpgskcps58zk3h"),
    "Semáforo inteligente": MV + "rrwnp7afl5xbjt6m",
    "Domótica escolar": MV + "pfihqyzqibcl5pyt",
    "Domótica escolar con Kit Nezha Inventor": MV + "pfihqyzqibcl5pyt",
    "Detector de temperatura y humedad": MV + "yf5eocgecq7c4m4c",
    "Molinos de viento": MV + "csgglg5k4uux5klq",
    "Vehículos y aceleración": MV + "5qqlvowlt8dzgp5w",
    "El ciclo del agua": MV + "dzv6u83c2zq3du8e",
    "Mundo geométrico": MV + "ay4n4oijd1wibepf",
}

# Recursos que se añaden a la caja lateral de cada sesión según lo que se trabaja.
# (palabra clave en el texto de la sesión, [(título, url)])
SESSION_RULES = [
    ("True True", [("Manual docente de True True", MV + "dz7amxzeoegpioah"),
                   ("Normas de uso del robot", MV + "vild4b9fmu8ti5bx"),
                   ("Vídeos de funcionalidades", WEB + "e.-primaria")]),
    ("ScratchJr", [("ScratchJr: guía de la interfaz", "https://www.scratchjr.org/explore/interface")]),
    ("Scratch ", [("Editor de Scratch", "https://scratch.mit.edu/projects/editor/")]),
    ("Makey Makey", [("Manual docente Makey Makey / Clic and Play", MV + "zf1ps2yb8362az2i"),
                     ("Normas de uso", MV + "q18b6rvbmrtf7ro2")]),
    ("micro:bit", [("Empezando con micro:bit en Primaria", ST.format("ej81b9sxiiej2m48")),
                   ("MakeCode para micro:bit", "https://makecode.microbit.org/")]),
    ("Nezha", [("Ruta de aprendizaje con Nezha", ST.format("kms5gzjcrbr7srcr")),
               ("Vídeo: Kit Nezha Inventor y micro:bit", "https://mediateca.educa.madrid.org/video/7eae7kpke3l8x2qa")]),
    ("Tinkercad", [("Tinkercad: aprender", "https://www.tinkercad.com/learn")]),
    ("Teachable Machine", [("Teachable Machine", "https://teachablemachine.withgoogle.com/")]),
    ("ARASAAC", [("Pictogramas ARASAAC", "https://arasaac.org/")]),
    ("csunplugged", [("CS Unplugged en español", "https://www.csunplugged.org/es/")]),
]
