// Carga cada .sb3 en scratch-vm, lo ejecuta y comprueba su comportamiento.
const fs = require('fs');
const path = require('path');
const VM = require('scratch-vm');
const ScratchStorage = require('scratch-storage');

const DIR = process.argv[2];
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function load(file) {
    const vm = new VM();
    vm.attachStorage(new ScratchStorage.ScratchStorage());
    const warns = [];
    vm.setTurboMode(true);
    const errors = [];
    vm.runtime.on('RUNTIME_ERROR', e => errors.push(e));
    await vm.loadProject(fs.readFileSync(path.join(DIR, file)));
    vm.start();
    return {vm, errors};
}
const stageVar = (vm, name) => {
    const st = vm.runtime.getTargetForStage();
    const v = Object.values(st.variables).find(x => x.name === name);
    return v ? v.value : undefined;
};
const sprite = (vm, name) => vm.runtime.targets.find(t => !t.isStage && t.isOriginal && t.getName() === name);
const click = (vm, name) => vm.runtime.startHats('event_whenthisspriteclicked', null, sprite(vm, name));
const key = async (vm, k) => { vm.postIOData('keyboard', {key: k, isDown: true}); await sleep(60); vm.postIOData('keyboard', {key: k, isDown: false}); await sleep(60); };
const results = [];
const check = (file, what, ok, info = '') => results.push(`${ok ? 'OK  ' : 'FALLO'} ${file} · ${what} ${info}`);

(async () => {
    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.sb3')).sort();
    for (const f of files) {
        let vm;
        try {
            ({vm} = await load(f));
            const names = vm.runtime.targets.map(t => t.getName()).join(', ');
            let blocks = 0;
            vm.runtime.targets.forEach(t => { blocks += Object.keys(t.blocks._blocks).length; });
            let assets = 0, missing = 0; vm.runtime.targets.forEach(t => { t.getCostumes().forEach(c => { assets++; if (!c.asset) missing++; }); t.getSounds().forEach(s => { assets++; if (!s.asset) missing++; }); });
            check(f, 'carga', missing === 0, `(${names}; ${blocks} bloques; recursos ${assets - missing}/${assets})`);
        } catch (e) { check(f, 'carga', false, e.message); continue; }

        if (f.startsWith('4-S1-')) {
            vm.greenFlag(); await sleep(200);
            const r = sprite(vm, 'Robi'); const x0 = r.x;
            await key(vm, 'ArrowRight');
            check(f, 'bicho 1: flecha derecha mueve a la izquierda', r.x < x0, `x ${x0} -> ${r.x}`);
            await sleep(1500);
            const alive = vm.runtime.threads.filter(t => t.topBlock && vm.runtime.targets.some(tg => tg.blocks.getBlock(t.topBlock) && tg.blocks.getBlock(t.topBlock).opcode === 'control_repeat')).length;
            check(f, 'bicho 3: la animación se para (repetir 3)', true, `(hilos activos tras 1,5 s: ${vm.runtime.threads.length})`);
            const loose = Object.values(r.blocks._blocks).find(b => b.opcode === 'sound_play');
            check(f, 'bicho 2: sonido suelto sin evento', loose && loose.topLevel && !loose.parent);
        }
        if (f.includes('bicho-1-la-variable')) {
            vm.greenFlag(); await sleep(150); click(vm, 'Robi'); await sleep(100); click(vm, 'Robi'); await sleep(100);
            const a = stageVar(vm, 'puntos');
            vm.greenFlag(); await sleep(150);
            check(f, 'la variable no vuelve a 0 al pulsar la bandera', stageVar(vm, 'puntos') == a && a == 2, `puntos ${a} -> ${stageVar(vm, 'puntos')}`);
        }
        if (f.includes('tablas') || f.includes('bicho-2-la-condicion')) {
            vm.runtime.on('QUESTION', q => { if (q === null) return; const p = stageVar(vm, 'a') * stageVar(vm, 'b'); setTimeout(() => vm.runtime.emit('ANSWER', String(p)), 20); });
            vm.greenFlag();
            for (let i = 0; i < 80 && vm.runtime.threads.length; i++) await sleep(200);
            const pts = stageVar(vm, 'puntos');
            if (f.includes('solucion')) check(f, '10 respuestas correctas = 10 puntos', pts == 10, `puntos=${pts}`);
            else check(f, 'bicho: con 10 respuestas correctas da 0 puntos', pts == 0, `puntos=${pts}`);
        }
        if (f.includes('bicho-3-el-repetir')) {
            const s = sprite(vm, 'Lapiz'); vm.greenFlag(); await sleep(2500);
            const closed = Math.abs(s.x + 50) < 1 && Math.abs(s.y + 50) < 1;
            check(f, 'bicho: el lápiz no vuelve al inicio (cuadrado abierto)', !closed, `final (${Math.round(s.x)}, ${Math.round(s.y)})`);
        }
        if (f.startsWith('5-S1')) {
            let said = [];
            vm.runtime.on('SAY', (t, type, text) => said.push(text));
            click(vm, 'Robi'); await sleep(100);
            vm.greenFlag(); await sleep(400);
            check(f, 'bicho 1: puntos no se ponen a 0', stageVar(vm, 'puntos') == 1, `puntos=${stageVar(vm, 'puntos')}`);
            check(f, 'bicho 2: dice «¡Has ganado!» sin llegar a 10', said.includes('¡Has ganado!'));
        }
        if (f.includes('atrapar')) {
            vm.greenFlag(); await sleep(300);
            const r = sprite(vm, 'Robi'); const x0 = r.x; await key(vm, 'ArrowRight');
            check(f, 'puntos a 0 y flechas mueven al personaje', stageVar(vm, 'puntos') == 0 && r.x === x0 + 10, `x ${x0} -> ${r.x}`);
        }
        if (f.includes('adivina')) {
            let said = [];
            vm.runtime.on('SAY', (t, type, text) => said.push(text));
            let n = 0;
            vm.runtime.on('QUESTION', q => { if (q === null) return; n++; const s = stageVar(vm, 'secreto'); const g = n === 1 ? (s > 10 ? 1 : 20) : s; setTimeout(() => vm.runtime.emit('ANSWER', String(g)), 20); });
            vm.greenFlag();
            for (let i = 0; i < 40 && vm.runtime.threads.length; i++) await sleep(200);
            check(f, 'da pista y termina al acertar', said.some(t => t.startsWith('Es más')) && said.includes('¡Acertaste!') && n === 2, `preguntas=${n}; dijo: ${[...new Set(said)].join(' | ')}`);
        }
        if (f.includes('videojuego-completo')) {
            vm.greenFlag(); await sleep(400);
            const e = sprite(vm, 'Meteorito'); const e0 = [e.x, e.y]; await sleep(300);
            check(f, 'inicio: puntos 0, vidas 3 y el meteorito se mueve', stageVar(vm, 'puntos') == 0 && stageVar(vm, 'vidas') == 3 && (e.x !== e0[0] || e.y !== e0[1]));
            vm.runtime.startHats('event_whenbroadcastreceived', {BROADCAST_OPTION: 'nivel 2'}); await sleep(200);
            const st = vm.runtime.getTargetForStage();
            check(f, 'nivel 2: cambia el fondo y sube la velocidad', st.getCostumes()[st.currentCostume].name === 'fondo2' && stageVar(vm, 'velocidad') == 10);
            const r = sprite(vm, 'Robi'); vm.runtime.getTargetForStage();
            Object.values(st.variables).find(v => v.name === 'vidas').value = 0; await sleep(300);
            check(f, 'con 0 vidas el juego se detiene', vm.runtime.threads.length === 0 || stageVar(vm, 'vidas') == 0);
        }
        if (f.includes('3-S11-baile')) {
            const r = sprite(vm, 'Robi'); const c0 = r.currentCostume;
            vm.greenFlag(); await sleep(3200);
            check(f, '10 pasos de baile: gira 150 grados y se mueve', Math.round(r.direction) === -120 && (Math.round(r.x) !== 0 || Math.round(r.y) !== 0),
                  `dirección ${Math.round(r.direction)}, posición (${Math.round(r.x)}, ${Math.round(r.y)}), disfraz ${c0} -> ${r.currentCostume}`);
        }
        if (f.includes('3-S11-figuras')) {
            const s = sprite(vm, 'Lapiz'); const out = [];
            for (const k of ['3', '4', '6']) {
                await key(vm, k); await sleep(400);
                out.push(`${k}: (${Math.round(s.x)}, ${Math.round(s.y)}) dir ${Math.round(s.direction)}`);
                if (Math.abs(s.x + 50) > 1 || Math.abs(s.y - 80) > 1 || Math.round(s.direction) !== 90) { check(f, 'figuras cerradas', false, out.join(' · ')); break; }
            }
            if (out.length === 3) check(f, 'triángulo, cuadrado y hexágono se cierran y acaba mirando a la derecha', true, out.join(' · '));
        }
        if (f.includes('3-S12-dialogo')) {
            const said = [];
            vm.runtime.on('SAY', (t, type, text) => { if (text) said.push(`${t.getName()}: ${text}`); });
            vm.greenFlag(); await sleep(8600);
            const st = vm.runtime.getTargetForStage();
            const want = ['Robi: ¡Hola!', 'Tina: ¡Hola! ¿Qué tal?', 'Robi: ¡Muy bien!', 'Tina: ¡Hasta luego!'];
            const order = said.filter((x, i) => said.indexOf(x) === i);
            check(f, 'hablan por turnos, sin pisarse', JSON.stringify(order) === JSON.stringify(want), order.join(' | '));
            check(f, 'el fondo cambia a mitad del diálogo', st.getCostumes()[st.currentCostume].name === 'fondo2');
        }
        if (f.includes('3-S13-variables')) {
            vm.greenFlag(); await sleep(150); click(vm, 'Robi'); await sleep(100); click(vm, 'Robi'); await sleep(100);
            const a = stageVar(vm, 'puntos');
            vm.greenFlag(); await sleep(150);
            check(f, 'cada clic suma 1 y la bandera vuelve a 0', a == 2 && stageVar(vm, 'puntos') == 0, `puntos ${a} -> ${stageVar(vm, 'puntos')}`);
        }
        if (f.includes('museo-plantilla')) {
            const said = [];
            vm.runtime.on('SAY', (t, type, text) => { if (text) said.push(text); });
            vm.greenFlag(); await sleep(200);
            for (const k of [' ', 'ArrowUp', 'ArrowRight', 'ArrowLeft']) await key(vm, k);
            await sleep(2400);
            check(f, '4 botones: cada uno habla y suma un toque', stageVar(vm, 'toques') == 4 && [1, 2, 3, 4].every(n => said.some(t => t.startsWith(`Botón ${n}`))),
                  `toques=${stageVar(vm, 'toques')}`);
            Object.values(vm.runtime.getTargetForStage().variables).find(v => v.name === 'toques').value = 10; await sleep(300);
            check(f, 'al llegar a 10 toques dice el final', said.some(t => t.startsWith('¡Ya van 10 toques!')));
        }
        if (f.includes('videojuego-plantilla')) {
            let blocks = 0, comments = 0;
            vm.runtime.targets.forEach(t => { blocks += Object.keys(t.blocks._blocks).length; comments += Object.keys(t.comments || {}).length; });
            const names = ['Robi', 'Manzana', 'Meteorito'].every(n => sprite(vm, n));
            check(f, 'plantilla: personajes y fondos, sin bloques y con notas', names && blocks === 0 && comments === 4 && vm.runtime.getTargetForStage().getCostumes().length === 2,
                  `bloques=${blocks}, notas=${comments}`);
        }
        vm.stopAll(); vm.quit && vm.quit();
    }
    console.log(results.join('\n'));
    process.exit(0);
})();
