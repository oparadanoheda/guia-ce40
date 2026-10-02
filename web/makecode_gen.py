# Genera los proyectos de MakeCode (.mkcd) de 5º y 6º: soluciones de referencia y programas con bichos.
# Uso: python makecode_gen.py   -> materiales/makecode/*.mkcd (y copia en «Material imprimible/MakeCode»)
#
# Un .mkcd es el archivo de proyecto de MakeCode: se abre en makecode.microbit.org con Importar › Importar archivo
# (o arrastrándolo sobre el editor). Aquí va en JSON sin comprimir, que MakeCode también acepta: el programa en
# TypeScript (main.ts) y sus bloques (main.blocks), para que se abra directamente en la vista de bloques.
# Se escribe solo con ASCII (los acentos, escapados): MakeCode lee el JSON sin comprimir byte a byte.
# Las extensiones del Nezha son las mismas que usan las situaciones oficiales de Código Escuela 4.0.
import json
import shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "materiales" / "makecode"
OUT_ROOT = HERE.parent / "Material imprimible" / "MakeCode"
# Los bloques (main.blocks) los genera el propio MakeCode a partir de main.ts (ver LEEME_PROYECTO.md)
BLOQUES = HERE / "makecode_bloques"

NEZHA = {"pxt-nezha": "github:elecfreaks/pxt-nezha#v1.3.9"}
PLANETX = {"pxt-PlanetX": "github:elecfreaks/pxt-planetx#v1.5.33"}

# Avanzar con el coche del kit: los dos motores van en espejo (uno en positivo y el otro en negativo).
RECTO = """neZha.setMotorSpeed(neZha.MotorList.M1, {v})
    neZha.setMotorSpeed(neZha.MotorList.M2, -{v})"""

# (archivo, título que ve el docente, sesión, extensiones, programa)
PROYECTOS = [
    # ---------------------------------------------------------------- 5º
    ("5-S2-contador", "5º S2 · Contador con los botones", "5º S2", {}, """
input.onButtonPressed(Button.A, function () {
    contador += 1
    basic.showNumber(contador)
})
// Reto: que baje con B y no pase de 0
input.onButtonPressed(Button.B, function () {
    if (contador > 0) {
        contador += -1
    }
    basic.showNumber(contador)
})
let contador = 0
basic.showIcon(IconNames.Heart)
"""),
    ("5-S3-dado", "5º S3 · El dado electrónico", "5º S3", {}, """
input.onGesture(Gesture.Shake, function () {
    // La animación antes del número
    basic.showIcon(IconNames.SmallSquare)
    basic.showIcon(IconNames.Square)
    basic.showNumber(randint(1, 6))
})
"""),
    ("5-S3-contador-de-pasos", "5º S3 · Contador de pasos", "5º S3", {}, """
input.onGesture(Gesture.Shake, function () {
    pasos += 1
    basic.showNumber(pasos)
})
input.onButtonPressed(Button.A, function () {
    pasos = 0
    basic.showNumber(pasos)
})
let pasos = 0
"""),
    ("5-S4-lamparita", "5º S4 · Lamparita de noche", "5º S4", {}, """
basic.forever(function () {
    // El umbral (50) se ajusta midiendo la luz de la clase
    if (input.lightLevel() < 50) {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else {
        basic.clearScreen()
    }
})
"""),
    ("5-S5-alarma-del-estuche", "5º S5 · Alarma del estuche", "5º S5", {}, """
input.onButtonPressed(Button.A, function () {
    activada = 1
    basic.showIcon(IconNames.Yes)
})
input.onButtonPressed(Button.B, function () {
    activada = 0
    basic.clearScreen()
})
input.onGesture(Gesture.Shake, function () {
    if (activada == 1) {
        basic.showIcon(IconNames.No)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
})
let activada = 0
"""),
    ("5-S6-bicho-1-lamparita", "5º S6 · Bicho 1: la lamparita", "5º S6", {}, """
basic.forever(function () {
    if (input.lightLevel() > 50) {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else {
        basic.clearScreen()
    }
})
"""),
    ("5-S6-bicho-2-contador", "5º S6 · Bicho 2: el contador", "5º S6", {}, """
input.onButtonPressed(Button.A, function () {
    contador += 1
})
let contador = 0
basic.showNumber(contador)
"""),
    ("5-S6-bicho-3-dado", "5º S6 · Bicho 3: el dado", "5º S6", {}, """
input.onGesture(Gesture.Shake, function () {
    basic.showNumber(randint(0, 6))
})
"""),
    ("5-S8-nezha-avanza", "5º S8 · El Nezha avanza 1 segundo", "5º S8", NEZHA, """
input.onButtonPressed(Button.A, function () {
    // Los dos motores van en espejo: para ir recto, M1 en positivo y M2 en negativo.
    // Si el coche gira en vez de avanzar, cambia el signo de M2.
    """ + RECTO.format(v=50) + """
    basic.pause(1000)
    neZha.stopAllMotor()
})
"""),
    ("5-S11-biblioteca-silenciosa", "5º S7 y S11 · Biblioteca silenciosa (micro:bit V2)", "5º S7, S11", {}, """
basic.forever(function () {
    // El 128 se ajusta midiendo en la biblioteca de verdad
    if (input.soundLevel() > 128) {
        basic.showIcon(IconNames.Sad)
    } else {
        basic.clearScreen()
    }
})
"""),
    ("5-S14-nezha-para-ante-obstaculo", "5º S14 · El Nezha para ante un obstáculo", "5º S14", {**NEZHA, **PLANETX}, """
basic.forever(function () {
    // Sensor de ultrasonidos en el puerto J1
    if (PlanetX_Basic.ultrasoundSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.Distance_Unit_List.Distance_Unit_cm) < 10) {
        neZha.stopAllMotor()
    } else {
        """ + RECTO.format(v=30).replace("\n    ", "\n        ") + """
    }
})
"""),
    ("5-S16-radio", "5º S16 · Radio entre dos placas", "5º S16", {}, """
input.onButtonPressed(Button.A, function () {
    radio.sendNumber(1)
})
radio.onReceivedNumber(function (receivedNumber) {
    basic.showNumber(receivedNumber)
})
// Las dos placas, con el mismo programa y el mismo grupo
radio.setGroup(7)
"""),
    # ---------------------------------------------------------------- 6º
    ("6-S1-contador", "6º S1 · Reto 2: contador", "6º S1", {}, """
input.onButtonPressed(Button.A, function () {
    contador += 1
    basic.showNumber(contador)
})
input.onButtonPressed(Button.B, function () {
    contador += -1
    basic.showNumber(contador)
})
input.onButtonPressed(Button.AB, function () {
    contador = 0
    basic.showNumber(contador)
})
let contador = 0
basic.showNumber(contador)
"""),
    ("6-S1-juego-de-reflejos", "6º S1 · Reto 4: juego de reflejos", "6º S1", {}, """
input.onButtonPressed(Button.A, function () {
    if (listo) {
        listo = false
        basic.showString("A")
    }
})
input.onButtonPressed(Button.B, function () {
    if (listo) {
        listo = false
        basic.showString("B")
    }
})
// Para otra ronda, se reinicia la placa
let listo = false
basic.pause(randint(1000, 5000))
basic.showIcon(IconNames.Heart)
listo = true
"""),
    ("6-S2-mascota-virtual", "6º S2 · La mascota virtual", "6º S2", {}, """
input.onButtonPressed(Button.A, function () {
    if (hambre > 0) {
        hambre += -1
    }
    basic.showIcon(IconNames.Happy)
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(hambre)
})
input.onGesture(Gesture.Shake, function () {
    basic.showIcon(IconNames.Silly)
    hambre += 1
})
input.onButtonPressed(Button.AB, function () {
    music.play(music.stringPlayable("C D E F G F E D ", 120), music.PlaybackMode.UntilDone)
})
let hambre = 5
basic.forever(function () {
    basic.pause(10000)
    hambre += 1
    if (hambre > 8) {
        basic.showIcon(IconNames.Sad)
    }
})
"""),
    ("6-S3-medimos-el-colegio", "6º S3 · Medimos temperatura y luz", "6º S3", {}, """
input.onButtonPressed(Button.A, function () {
    basic.showNumber(input.temperature())
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(input.lightLevel())
})
"""),
    ("6-S4-nezha-cuadrado", "6º S4 · El Nezha recorre un cuadrado", "6º S4", NEZHA, """
input.onButtonPressed(Button.A, function () {
    for (let index = 0; index < 4; index++) {
        // Avanzar 50 cm: los motores van en espejo
        """ + RECTO.format(v=50).replace("\n    ", "\n        ") + """
        basic.pause(tiempo_avance)
        // Girar un cuarto de vuelta: los dos motores con el mismo signo
        neZha.setMotorSpeed(neZha.MotorList.M1, 50)
        neZha.setMotorSpeed(neZha.MotorList.M2, 50)
        basic.pause(tiempo_giro)
    }
    neZha.stopAllMotor()
})
// Los dos tiempos se miden y se ajustan con cada robot
let tiempo_avance = 2000
let tiempo_giro = 600
"""),
    ("6-S5-tres-eventos", "6º S5 · Tres eventos, tres comportamientos", "6º S5", NEZHA, """
input.onButtonPressed(Button.A, function () {
    """ + RECTO.format(v=50) + """
})
input.onButtonPressed(Button.B, function () {
    neZha.stopAllMotor()
})
input.onButtonPressed(Button.AB, function () {
    neZha.setMotorSpeed(neZha.MotorList.M1, 50)
    neZha.setMotorSpeed(neZha.MotorList.M2, 50)
})
"""),
    ("6-S5-nezha-para-ante-obstaculo", "6º S5 · El Nezha para ante un obstáculo", "6º S5", {**NEZHA, **PLANETX}, """
basic.forever(function () {
    // Sensor de ultrasonidos en el puerto J1
    if (PlanetX_Basic.ultrasoundSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.Distance_Unit_List.Distance_Unit_cm) < 10) {
        neZha.stopAllMotor()
    } else {
        """ + RECTO.format(v=30).replace("\n    ", "\n        ") + """
    }
})
"""),
    ("6-S6-cuadrado-con-funciones", "6º S6 · El cuadrado con funciones", "6º S6", NEZHA, """
function avanzar () {
    """ + RECTO.format(v=50) + """
    basic.pause(tiempo_avance)
}
function girar_derecha () {
    // Si gira hacia el otro lado, cambia los dos signos
    neZha.setMotorSpeed(neZha.MotorList.M1, 50)
    neZha.setMotorSpeed(neZha.MotorList.M2, 50)
    basic.pause(tiempo_giro)
}
input.onButtonPressed(Button.A, function () {
    for (let index = 0; index < 4; index++) {
        avanzar()
        girar_derecha()
    }
    neZha.stopAllMotor()
})
let tiempo_avance = 2000
let tiempo_giro = 600
"""),
    ("6-S10-semaforo-de-ruido", "6º S10 · Semáforo de ruido (micro:bit V2)", "6º S10", {}, """
basic.forever(function () {
    ruido = input.soundLevel()
    // Los números se ajustan en el comedor de verdad
    if (ruido > 150) {
        basic.showIcon(IconNames.Sad)
    } else if (ruido > 90) {
        basic.showIcon(IconNames.Meh)
    } else {
        basic.showIcon(IconNames.Happy)
    }
})
let ruido = 0
"""),
    ("6-S14-timbre-a-distancia", "6º S14 · Timbre a distancia", "6º S14", {}, """
input.onButtonPressed(Button.A, function () {
    radio.sendNumber(1)
})
radio.onReceivedNumber(function (receivedNumber) {
    basic.showIcon(IconNames.Heart)
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    basic.clearScreen()
})
// Cada equipo, su número de grupo
radio.setGroup(23)
"""),
    ("6-S14-mando-por-radio", "6º S14 · Mando por radio (placa que se inclina)", "6º S14", {}, """
basic.forever(function () {
    if (input.acceleration(Dimension.X) > 300) {
        radio.sendNumber(2)
    } else if (input.acceleration(Dimension.X) < -300) {
        radio.sendNumber(3)
    } else {
        radio.sendNumber(1)
    }
    basic.pause(100)
})
// El mismo grupo que el robot
radio.setGroup(23)
"""),
    ("6-S14-robot-por-radio", "6º S14 · Robot Nezha que obedece al mando", "6º S14", NEZHA, """
radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 1) {
        // Recto: los motores van en espejo
        """ + RECTO.format(v=40).replace("\n    ", "\n        ") + """
    } else if (receivedNumber == 2) {
        neZha.setMotorSpeed(neZha.MotorList.M1, 40)
        neZha.setMotorSpeed(neZha.MotorList.M2, 0)
    } else if (receivedNumber == 3) {
        neZha.setMotorSpeed(neZha.MotorList.M1, 0)
        neZha.setMotorSpeed(neZha.MotorList.M2, -40)
    }
})
radio.setGroup(23)
"""),
]


def ordenar(ts):
    """Las variables, arriba del todo (como las escribe MakeCode): luego los eventos y lo de «al iniciar»."""
    lineas = ts.strip().split("\n")
    decl, resto, coment = [], [], []
    for ln in lineas:
        if ln.startswith("//"):
            coment.append(ln)          # el comentario va con la línea que le sigue
        elif ln.startswith("let "):
            decl += coment + [ln]
            coment = []
        else:
            resto += coment + [ln]
            coment = []
    return "\n".join(decl + resto + coment)


def proyecto(nombre, titulo, sesion, deps, ts):
    ts = ordenar(ts)
    cfg = {
        "name": titulo,
        "description": f"Guía Código Escuela 4.0 · {sesion}",
        "dependencies": {"core": "*", "radio": "*", "microphone": "*", **deps},
        "files": ["main.blocks", "main.ts", "README.md"],
        "preferredEditor": "blocksprj",
    }
    readme = f"# {titulo}\n\nGuía didáctica Código Escuela 4.0 · {sesion}. Programa de referencia para el docente.\n"
    bl = BLOQUES / f"{nombre}.blocks"
    blocks = bl.read_text(encoding="utf-8") if bl.exists() else ""
    files = {"pxt.json": json.dumps(cfg, ensure_ascii=False, indent=4), "main.blocks": blocks, "main.ts": ts.strip() + "\n", "README.md": readme}
    return {"meta": {"cloudId": "pxt/microbit", "editor": "blocksprj", "name": titulo}, "source": json.dumps(files, ensure_ascii=False)}


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    for nombre, titulo, sesion, deps, ts in PROYECTOS:
        data = json.dumps(proyecto(nombre, titulo, sesion, deps, ts), ensure_ascii=True, indent=1)
        (OUT / f"{nombre}.mkcd").write_text(data, encoding="utf-8")
        shutil.copy2(OUT / f"{nombre}.mkcd", OUT_ROOT / f"{nombre}.mkcd")
        print(nombre)
    sin = [n for n, *_ in PROYECTOS if not (BLOQUES / f"{n}.blocks").exists()]
    print(len(PROYECTOS), "proyectos", f"· sin bloques todavía: {sin}" if sin else "· todos con bloques")


if __name__ == "__main__":
    build()
