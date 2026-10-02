# Pictogramas de ARASAAC usados en la guía (nombre -> id).
# Autor: Sergio Palao. Origen: ARASAAC (https://arasaac.org). Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón (España).
# Uso: python pictos.py  -> descarga, optimiza (web/picto/*.png) y genera web/pictos_data.js
import base64, io, json, urllib.request
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
DIR = HERE / "picto"
CREDITO = "Pictogramas: Sergio Palao. Origen: ARASAAC (arasaac.org). Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón."

P = {
    # rutinas
    "grifo_abrir": 21341, "jabon_poner": 35729, "frotar_jabon": 36910, "aclarar": 2443, "grifo_cerrar": 37022, "secar_toalla": 29052,
    "sembrar": 7245, "regar": 2816, "brotar": 17183, "planta_maceta": 3126,
    "calcetin_poner": 36573, "zapato": 32923, "atar_cordones": 17026, "andar": 32214,
    "cepillo": 2694, "pasta_dientes": 30087, "cepillarse": 2326, "enjuagarse": 8559,
    "pan_molde": 2865, "tostadora": 2598, "untar": 7292, "desayunar": 4625,
    "bordillo": 19526, "peaton_rojo": 36223, "peaton_verde": 36221, "mirar_lados": 37184, "paso_cebra": 3430,
    "semaforo_peatones_rojo": 4959, "semaforo_peatones_verde": 4958,
    # animales
    "perro": 7202, "caballo": 2294, "pajaro": 2490, "pinguino": 3243, "pez": 2520, "ballena": 2268, "mariposa": 26200, "serpiente": 2568,
    "gato": 7114, "gato_tumbado": 2406, "elefante": 2372, "vaca": 2609, "cerdo": 2327, "oveja": 2489, "gallina": 2403, "pato": 2563,
    "conejo": 2351, "burro": 2291, "cabra": 2295, "gallo": 2404, "pollito": 2533, "rana": 2543, "pajaro_volando": 26270, "avestruz": 2650, "periodico": 2845, "foto": 7107, "movil_mensaje": 37867,
    # frutas y verduras
    "manzana_roja": 2462, "manzana_verde": 13644, "manzana_amarilla": 13645, "pera": 2561, "fresa": 2400, "platano": 2530,
    "limon": 3022, "cereza": 8303, "kiwi": 2955, "uvas": 34120, "naranja": 2483, "brocoli": 23853, "zanahoria": 2619, "lechuga": 2446,
    # vehículos y lugares
    "camion_bomberos": 4925, "coche": 2340, "tractor": 2600, "granja": 32482,
    "robot": 6208, "piedra": 6594, "casa": 6964, "arbol": 3057, "colegio": 3082, "buzon": 2292, "contenedor": 38609,
    "tesoro": 6229, "estrella": 3100, "bandera_salida": 5918, "bandera_meta": 5919, "muro": 8266,
    # condiciones y acciones
    "llover": 7148, "paraguas": 2500, "gorra": 2411, "sed": 7273, "beber_agua": 2276, "jugar": 2439, "timbre": 31488,
    "recreo": 33064, "trabajar": 2599, "dado": 2731,
    "saltar": 2804, "aplaudir": 4563, "dar_vuelta": 31748, "agacharse": 16437, "brazos_arriba": 38629,
    "dormir": 2369, "nadar": 24903, "leer": 28643, "cantar": 28657, "patinar": 30578, "volar": 6246, "vaso_leche": 4769,
    # objetos del circuito
    "papel": 8349, "cuchara": 2362, "lapiz": 2440, "regla": 2815, "madera": 6143, "goma": 2409, "aluminio": 8250,
    "guante": 8353, "llave": 8153, "moneda": 4783, "mano": 2928, "vaso_agua": 4768,
    # roles
    "rol_piloto": 2712, "rol_copiloto": 2474, "rol_material": 32663, "rol_portavoz": 32290,
    # proyección de 1º y 2º: un pictograma junto a cada paso de la misión (pictos_mision.py)
    "camino": 38917, "pizarra": 30512, "grupo": 38444, "pareja": 7062, "contar": 2714, "escribir": 2380, "dibujar": 8088,
    "ordenar": 2872, "bicho": 7134, "pregunta": 7217, "senalar": 6612, "bailar": 35747, "tablet": 29151, "votar": 6631,
    "juego_mesa": 9810, "explicar": 8579, "arreglar": 6910, "borrar": 2286, "mapa_tesoro": 8625, "caja": 7054,
    "escalera": 2379, "cuadrado": 4616, "abeja": 24823, "campana": 5938, "pensar": 38796, "idea": 6531, "arbol_preguntas": 38143,
}


def fetch(pid):
    cache = DIR / "_cache" / f"{pid}.png"
    if not cache.exists():
        with urllib.request.urlopen(f"https://static.arasaac.org/pictograms/{pid}/{pid}_300.png", timeout=30) as r:
            cache.write_bytes(r.read())
    return cache


def build():
    DIR.mkdir(exist_ok=True)
    (DIR / "_cache").mkdir(exist_ok=True)
    data = {}
    for name, pid in P.items():
        im = Image.open(fetch(pid)).convert("RGBA")
        im.thumbnail((200, 200), Image.LANCZOS)
        # recorta el margen transparente para que todos ocupen lo mismo
        bbox = im.getbbox()
        if bbox:
            im = im.crop(bbox)
        canvas = Image.new("RGBA", (200, 200), (255, 255, 255, 0))
        im.thumbnail((190, 190), Image.LANCZOS)
        canvas.paste(im, ((200 - im.width) // 2, (200 - im.height) // 2), im)
        out = DIR / f"{name}.png"
        pal = canvas.quantize(colors=96, method=Image.FASTOCTREE)
        pal.save(out, optimize=True)
        data[name] = "data:image/png;base64," + base64.b64encode(out.read_bytes()).decode()
    js = "window.PICTO=" + json.dumps(data) + ";window.PICTO_CREDITO=" + json.dumps(CREDITO) + ";"
    (HERE / "pictos_data.js").write_text(js, encoding="utf-8")
    total = sum(len(v) for v in data.values())
    print(len(data), "pictogramas,", total // 1024, "KB en base64")


def path(name):
    return (DIR / f"{name}.png").as_uri()


if __name__ == "__main__":
    build()
