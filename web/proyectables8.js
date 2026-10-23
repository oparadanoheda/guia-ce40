/* Herramienta «Preguntas de salida» (versión 1.9): tres preguntas para el final de la sesión.
   Cada una enseña un programa con los bloques de Scratch (3º y 4º) o de MakeCode (5º y 6º) y tres respuestas.
   La clase vota (con los dedos: 1, 2 o 3), se toca la respuesta que dice la mayoría y «Ver la respuesta» enseña
   la buena y por qué. Un modo por concepto (#p-salida.bucle…); las sesiones donde se aprende cada uno lo enlazan. */
(function () {
  'use strict';
  var P = window.PJH, h = P.h, btn = P.btn, setStatus = P.setStatus, burst = P.burst, porModos = window.PJNuevas.porModos;

  // ------------------------------------------------------------ bloques dibujados (colores de cada editor)
  var SC = { eve: '#FFBF00', mov: '#4C97FF', looks: '#9966FF', control: '#FFAB19', sens: '#5CB1D6', vars: '#FF8C1A', pen: '#0FBD8C' };
  var MK = { bas: '#1E90FF', inp: '#D400D4', log: '#00A4A6', var: '#DC143C', gris: '#c3c7ce' };
  var BANDERA = '<svg class="ev-flag" viewBox="0 0 16 16" aria-label="bandera verde"><path d="M3.2 1.6v12.8" stroke="#3d8a37" stroke-width="1.7" stroke-linecap="round"/><path d="M4 2.6c2.1-1.2 3.9.8 6 0 1-.4 1.9-.7 2.8-.5v6.4c-.9-.2-1.8.1-2.8.5-2.1.8-3.9-1.2-6 0z" fill="#4cbf56" stroke="#3d8a37" stroke-width=".9"/></svg>';
  function v(x) { return '<span class="rp-v">' + x + '</span>'; }
  function b(col, html, cls) { return '<div class="rp-b' + (cls ? ' ' + cls : '') + '" style="background:' + col + '">' + html + '</div>'; }
  function r(col, html) { return '<span class="rp-r" style="background:' + col + '">' + html + '</span>'; }
  // bloque en C: [[cabecera, contenido], …] (con «si no», dos secciones)
  function c(col, secs) {
    return '<div class="rp-c" style="--bc:' + col + '">' + secs.map(function (s) {
      return '<div class="rp-ch">' + s[0] + '</div><div class="rp-cin">' + s[1] + '</div>';
    }).join('') + '<div class="rp-cf"></div></div>';
  }
  function hat(html) { return b(SC.eve, html, 'sl-hat'); }  // evento de Scratch, con su sombrero
  function pila(html, nota) { return '<div class="sl-pila">' + (nota ? '<p class="sl-nota">' + nota + '</p>' : '') + html + '</div>'; }
  var LED = {
    corazon: '.#.#.##########.###...#..', peque: '......#.#..###...#.......', si: '.........#...#.#.#...#...',
    no: '#...#.#.#...#...#.#.#...#', todo: '#########################'
  };
  function ico(k) {  // el dibujo dentro de «mostrar ícono» y «mostrar LEDs»
    var s = '';
    for (var i = 0; i < 25; i++) if (LED[k].charAt(i) === '#') s += '<rect x="' + (1 + (i % 5) * 4) + '" y="' + (1 + Math.floor(i / 5) * 4) + '" width="3.2" height="3.2" fill="#fff"/>';
    return '<span class="ev-ico"><svg viewBox="0 0 21 21" aria-label="icono">' + s + '</svg></span>';
  }
  function forma(tipo) {  // las respuestas que son un dibujo
    var d = { cuadrado: 'M14 14h36v36H14z', linea: 'M6 32h52', triangulo: 'M32 10l22 40H10z' }[tipo];
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="' + d + '" fill="none" stroke="#0FBD8C" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
  }
  var BANDERA_HAT = hat('al hacer clic en ' + BANDERA);
  var TECLA = function (t) { return hat('al presionar tecla ' + v(t + ' ▾')); };
  var TOCANDO = r(SC.sens, '¿tocando ' + v('Gato ▾') + '?');

  /* ================================================================ las preguntas
     q: la pregunta · prog: el programa · ops: las tres respuestas · ok: la buena (0, 1 o 2) · por: por qué */
  var SETS = {
    evento: { ed: 'Scratch', cursos: '3º y 4º', tit: 'Eventos', ps: [
      { prog: pila(BANDERA_HAT + b(SC.mov, 'mover ' + v(10) + ' pasos')) + pila(TECLA('flecha derecha') + b(SC.looks, 'decir ' + v('¡Hola!') + ' durante ' + v(2) + ' segundos')),
        q: 'Pulsamos la flecha derecha. ¿Qué pasa?',
        ops: ['El gato avanza 10 pasos', 'El gato dice «¡Hola!»', 'Las dos cosas'], ok: 1,
        por: 'Cada evento pone en marcha <b>su</b> programa. La flecha derecha empieza el que empieza con «al presionar tecla flecha derecha». El de la bandera espera a la bandera.' },
      { prog: pila(BANDERA_HAT + b(SC.looks, 'decir ' + v('Hola') + ' durante ' + v(2) + ' segundos')) + pila(b(SC.mov, 'mover ' + v(10) + ' pasos') + b(SC.mov, 'girar ↻ ' + v(15) + ' grados'), 'Estos bloques están sueltos'),
        q: 'Pulsamos la bandera verde. ¿Se mueve el gato?',
        ops: ['No: esos bloques no tienen un evento encima', 'Sí, después de decir «Hola»', 'Sí, a la vez que habla'], ok: 0,
        por: 'Un bloque suelto no empieza nunca solo: hace falta un evento arriba. Para que se mueva con la bandera, hay que encajarlo debajo de «decir».' },
      { prog: pila(BANDERA_HAT + c(SC.control, [['por siempre', b(SC.mov, 'si toca un borde, rebotar')]])) + pila(TECLA('flecha derecha') + b(SC.mov, 'sumar a x ' + v(10))),
        q: 'Pulsamos la bandera y después la flecha derecha. ¿Qué programas están funcionando?',
        ops: ['Solo el de la flecha: el nuevo para al otro', 'Solo el de la bandera', 'Los dos a la vez'], ok: 2,
        por: 'Varios programas pueden funcionar <b>a la vez</b>. El «por siempre» sigue mirando el borde mientras la flecha mueve al gato: así no se sale del escenario.' }
    ] },
    bucle: { ed: 'Scratch', cursos: '3º y 4º', tit: 'Bucles', ps: [
      { prog: pila(BANDERA_HAT + b(SC.pen, 'bajar lápiz') + c(SC.control, [['repetir ' + v(4), b(SC.mov, 'mover ' + v(100) + ' pasos') + b(SC.mov, 'girar ↻ ' + v(90) + ' grados')]])),
        q: '¿Qué dibuja el gato?',
        ops: [forma('cuadrado') + 'Un cuadrado', forma('linea') + 'Una línea recta', forma('triangulo') + 'Un triángulo'], ok: 0,
        por: 'Repite 4 veces «mover» y «girar 90»: cuatro lados iguales y cuatro giros de 90°. 4 × 90 = 360, una vuelta entera: se cierra un cuadrado.' },
      { prog: pila(BANDERA_HAT + c(SC.control, [['repetir ' + v(5), b(SC.mov, 'mover ' + v(10) + ' pasos')]])),
        q: '¿Cuántos pasos avanza el gato en total?',
        ops: ['10 pasos', '15 pasos', '50 pasos'], ok: 2,
        por: '«mover 10 pasos» se hace 5 veces: 5 × 10 = <b>50</b> pasos. El número de «repetir» dice cuántas veces se hace lo de dentro.' },
      { prog: pila(BANDERA_HAT + c(SC.control, [['por siempre', b(SC.looks, 'siguiente disfraz') + b(SC.control, 'esperar ' + v(0.2) + ' segundos')]])),
        q: '¿Cuándo deja de bailar el gato?',
        ops: ['Después de 10 vueltas', 'Nunca, hasta que pulsamos el botón rojo de parar', 'Cuando se le acaban los disfraces'], ok: 1,
        por: '«por siempre» no termina: vuelve a empezar una y otra vez (después del último disfraz viene otra vez el primero). Se para con el botón rojo. Para un número de veces, «repetir».' }
    ] },
    variable: { ed: 'Scratch', cursos: '3º y 4º', tit: 'Variables', ps: [
      { prog: pila(BANDERA_HAT + b(SC.vars, 'dar a ' + v('puntos ▾') + ' el valor ' + v(0))) + pila(hat('al hacer clic en este objeto') + b(SC.vars, 'sumar a ' + v('puntos ▾') + ' ' + v(1))),
        q: 'Pulsamos la bandera y hacemos 3 clics en el gato. ¿Cuánto vale puntos?',
        ops: ['1', '3', '4'], ok: 1,
        por: 'La bandera pone puntos a 0 y cada clic suma 1: 0 + 1 + 1 + 1 = <b>3</b>.' },
      { prog: pila(BANDERA_HAT + b(SC.vars, 'dar a ' + v('puntos ▾') + ' el valor ' + v(5)) + b(SC.vars, 'sumar a ' + v('puntos ▾') + ' ' + v(2)) + b(SC.vars, 'dar a ' + v('puntos ▾') + ' el valor ' + v(1))),
        q: '¿Cuánto vale puntos al final?',
        ops: ['8', '7', '1'], ok: 2,
        por: '«dar el valor» borra lo que había y pone el número nuevo; «sumar» parte de lo que había. Vale 5, después 7… y el último bloque deja <b>1</b>.' },
      { prog: pila(hat('al hacer clic en este objeto') + b(SC.vars, 'sumar a ' + v('puntos ▾') + ' ' + v(1)), 'Este juego no pone los puntos a 0'),
        q: 'Acabamos una partida con 7 puntos y pulsamos la bandera para jugar otra. ¿Con cuántos puntos empieza?',
        ops: ['Con 0', 'Con 7', 'Con 1'], ok: 1,
        por: 'La variable guarda el último número hasta que alguien lo cambia. Sin «dar a puntos el valor 0» con la bandera, la partida nueva empieza con <b>7</b>. Por eso los juegos empiezan poniendo sus variables a 0.' }
    ] },
    condicion: { ed: 'Scratch', cursos: '3º y 4º', tit: 'Si… entonces', ps: [
      { prog: pila(BANDERA_HAT + c(SC.control, [['por siempre', c(SC.control, [['si ' + TOCANDO + ' entonces', b(SC.vars, 'sumar a ' + v('puntos ▾') + ' ' + v(1)) + b(SC.mov, 'ir a ' + v('posición aleatoria ▾'))]])]]), 'En la manzana'),
        q: 'El gato todavía no toca la manzana. ¿Qué hace este programa?',
        ops: ['Suma 1 punto', 'Nada: vuelve a mirar si se tocan', 'Para el juego'], ok: 1,
        por: 'Si la condición no se cumple, lo de dentro del «si» se salta. El «por siempre» vuelve a preguntar «¿tocando Gato?» una y otra vez, hasta que se tocan.' },
      { prog: pila(BANDERA_HAT + c(SC.control, [['si ' + TOCANDO + ' entonces', b(SC.vars, 'sumar a ' + v('puntos ▾') + ' ' + v(1))]]), 'En la manzana, sin «por siempre»'),
        q: 'Pulsamos la bandera y, un rato después, el gato toca la manzana. ¿Suma un punto?',
        ops: ['Sí, 1 punto', 'Sí, y no para de sumar', 'No: solo lo pregunta una vez, al pulsar la bandera'], ok: 2,
        por: 'Sin «por siempre», la pregunta se hace una sola vez, justo al empezar, y en ese momento no se tocaban. Para mirar todo el rato, el «si» va dentro de «por siempre».' },
      { prog: pila(BANDERA_HAT + c(SC.control, [['por siempre', c(SC.control, [['si ' + TOCANDO + ' entonces', b(SC.vars, 'sumar a ' + v('puntos ▾') + ' ' + v(1))]])]]), 'En la manzana, sin «ir a posición aleatoria»'),
        q: 'El gato llega a la manzana y se queda encima. ¿Qué pasa con los puntos?',
        ops: ['Suben sin parar mientras se tocan', 'Suben 1 y se paran', 'No suben'], ok: 0,
        por: 'Mientras se tocan, en cada vuelta del «por siempre» la condición se cumple y suma otro punto. Por eso, después de sumar, la manzana salta a otro sitio.' }
    ] },
    evento_mk: { ed: 'MakeCode', cursos: '5º y 6º', tit: 'Eventos', ps: [
      { prog: pila(c(MK.bas, [['al iniciar', b(MK.bas, 'mostrar ícono ' + ico('corazon'))]])) + pila(c(MK.inp, [['al presionarse el botón ' + v('A ▾'), b(MK.bas, 'mostrar número ' + v(1))]])) + pila(c(MK.inp, [['al presionarse el botón ' + v('B ▾'), b(MK.bas, 'mostrar número ' + v(2))]])),
        q: 'Pasamos el programa a la placa y no tocamos nada. ¿Qué se ve?',
        ops: ['El corazón', 'El número 1', 'La pantalla apagada'], ok: 0,
        por: '«al iniciar» empieza solo, cuando la placa se enciende. Los programas de los botones esperan a que alguien los pulse.' },
      { prog: pila(c(MK.inp, [['al presionarse el botón ' + v('A ▾'), b(MK.bas, 'mostrar ícono ' + ico('si'))]])) + pila(b(MK.gris, 'mostrar número ' + v(5), 'sl-gris'), 'Este bloque está suelto'),
        q: 'Encendemos la placa y pulsamos A. ¿Sale el 5 en algún momento?',
        ops: ['Sí, al encender', 'Sí, después del ícono', 'No: está suelto, sin evento'], ok: 2,
        por: 'En MakeCode, un bloque que no está dentro de un evento sale en gris y no se hace nunca. Para que salga, hay que meterlo en «al iniciar» o en un botón.' },
      { prog: pila(c(MK.bas, [['al iniciar', b(MK.var, 'fijar ' + v('hambre ▾') + ' a ' + v(5))]])) + pila(c(MK.inp, [['al presionarse el botón ' + v('A ▾'), b(MK.var, 'cambiar ' + v('hambre ▾') + ' por ' + v(-1))]])) +
          pila(c(MK.inp, [['si ' + v('agitar ▾'), b(MK.var, 'cambiar ' + v('hambre ▾') + ' por ' + v(1))]])) + pila(c(MK.inp, [['al presionarse el botón ' + v('B ▾'), b(MK.bas, 'mostrar número ' + r(MK.var, 'hambre'))]])),
        q: 'Pulsamos A, otra vez A, agitamos la placa y pulsamos B. ¿Qué número sale?',
        ops: ['3', '4', '5'], ok: 1,
        por: 'Cada evento hace su parte: A resta 1 (dos veces), agitar suma 1 y B solo enseña el número. 5 − 1 − 1 + 1 = <b>4</b>.' }
    ] },
    siempre_mk: { ed: 'MakeCode', cursos: '5º y 6º', tit: 'Para siempre', ps: [
      { prog: pila(c(MK.bas, [['al iniciar', b(MK.bas, 'mostrar número ' + r(MK.inp, 'nivel de luz'))]]), 'Placa 1') + pila(c(MK.bas, [['para siempre', b(MK.bas, 'mostrar número ' + r(MK.inp, 'nivel de luz'))]]), 'Placa 2'),
        q: 'Tapamos las dos placas con la mano. ¿En cuál cambia el número?',
        ops: ['En la placa 1', 'En la placa 2', 'En las dos'], ok: 1,
        por: '«al iniciar» mide la luz una sola vez, al encender. «para siempre» la vuelve a medir sin parar: por eso nota que la habéis tapado.' },
      { prog: pila(c(MK.bas, [['para siempre', b(MK.bas, 'mostrar ícono ' + ico('corazon')) + b(MK.bas, 'mostrar ícono ' + ico('peque'))]])),
        q: '¿Qué se ve en la pantalla?',
        ops: ['Un corazón que late sin parar', 'El corazón grande, y se para', 'Solo el corazón pequeño'], ok: 0,
        por: '«para siempre» repite los dos iconos una y otra vez: grande, pequeño, grande, pequeño… Parece que late.' },
      { prog: pila(c(MK.bas, [['al iniciar', b(MK.var, 'fijar ' + v('contador ▾') + ' a ' + v(0))]])) + pila(c(MK.bas, [['para siempre', b(MK.var, 'cambiar ' + v('contador ▾') + ' por ' + v(1)) + b(MK.bas, 'mostrar número ' + r(MK.var, 'contador')) + b(MK.bas, 'pausa (ms) ' + v(1000))]])),
        q: '¿Qué hace esta placa?',
        ops: ['Enseña el 1 y se para', 'Enseña siempre el 0', 'Enseña 1, 2, 3… y sigue contando'], ok: 2,
        por: 'Lo de «al iniciar» se hace una vez: contador vale 0. Lo de «para siempre», una y otra vez: suma 1, lo enseña y espera un segundo. Cuenta sin parar.' }
    ] },
    variable_mk: { ed: 'MakeCode', cursos: '5º y 6º', tit: 'Variables', ps: [
      { prog: pila(c(MK.bas, [['al iniciar', b(MK.var, 'fijar ' + v('contador ▾') + ' a ' + v(0))]])) + pila(c(MK.inp, [['al presionarse el botón ' + v('A ▾'), b(MK.var, 'cambiar ' + v('contador ▾') + ' por ' + v(1)) + b(MK.bas, 'mostrar número ' + r(MK.var, 'contador'))]])),
        q: 'Pulsamos A tres veces. ¿Qué número se ve al final?',
        ops: ['3', '1', '0'], ok: 0,
        por: 'Al iniciar, contador vale 0. Cada A suma 1 y lo enseña: 1, 2 y <b>3</b>.' },
      { prog: pila(c(MK.bas, [['al iniciar', b(MK.var, 'fijar ' + v('puntos ▾') + ' a ' + v(5)) + b(MK.var, 'cambiar ' + v('puntos ▾') + ' por ' + v(2)) + b(MK.var, 'fijar ' + v('puntos ▾') + ' a ' + v(1)) + b(MK.bas, 'mostrar número ' + r(MK.var, 'puntos'))]])),
        q: '¿Qué número sale en la pantalla?',
        ops: ['8', '7', '1'], ok: 2,
        por: '«fijar … a» borra lo que había y pone el número nuevo; «cambiar … por» suma a lo que había. Vale 5, después 7, y el último «fijar» deja <b>1</b>.' },
      { prog: pila(c(MK.inp, [['al presionarse el botón ' + v('A ▾'), b(MK.var, 'fijar ' + v('activada ▾') + ' a ' + v(1))]])) + pila(c(MK.inp, [['al presionarse el botón ' + v('B ▾'), b(MK.var, 'fijar ' + v('activada ▾') + ' a ' + v(0))]])) +
          pila(c(MK.inp, [['si ' + v('agitar ▾'), c(MK.log, [['si ' + r(MK.log, r(MK.var, 'activada') + ' = ' + v(1)) + ' entonces', b(MK.bas, 'mostrar ícono ' + ico('no'))]])]]), 'La alarma del estuche'),
        q: 'Pulsamos A, después B, y agitamos la placa. ¿Sale la X de la alarma?',
        ops: ['Sí', 'No: B ha dejado activada en 0', 'Sale, y ya no se borra'], ok: 1,
        por: 'La variable guarda el último valor que se le da. A puso un 1, pero B lo cambió por 0: «activada = 1» no se cumple y la alarma no salta.' }
    ] },
    condicion_mk: { ed: 'MakeCode', cursos: '5º y 6º', tit: 'Si… si no', ps: [
      { prog: lampara(),
        q: 'El sensor de luz marca 30. ¿Qué hace la placa?',
        ops: ['Enciende todas las luces', 'Borra la pantalla', 'Nada'], ok: 0,
        por: '30 es menor que 50: la condición se cumple y se hace lo de «entonces».' },
      { prog: lampara(),
        q: '¿Y si marca justo 50?',
        ops: ['Enciende todas las luces', 'Borra la pantalla', 'Las dos cosas'], ok: 1,
        por: '50 <b>no</b> es menor que 50, así que se hace lo de «si no»: borra la pantalla. Las dos cosas a la vez, nunca: o una rama o la otra.' },
      { prog: lampara(),
        q: 'Queremos que se encienda antes, cuando aún hay un poco más de luz. ¿Qué cambiamos?',
        ops: ['El 50 por 20', '«&lt;» por «&gt;»', 'El 50 por 80'], ok: 2,
        por: 'El 50 es el <b>umbral</b>. Con 80, cualquier valor por debajo de 80 enciende: se enciende antes, con más luz. Con «&gt;», se encendería de día.' }
    ] }
  };
  function lampara() {
    return pila(c(MK.bas, [['para siempre', c(MK.log, [['si ' + r(MK.log, r(MK.inp, 'nivel de luz') + ' &lt; ' + v(50)) + ' entonces', b(MK.bas, 'mostrar LEDs ' + ico('todo'))], ['si no', b(MK.bas, 'borrar la pantalla')]])]]), 'La lamparita de noche');
  }

  /* ================================================================ la herramienta */
  var LETRAS = ['A', 'B', 'C'];
  var tecla = null;  // un solo atajo de teclado a la vez (el modo que se ve)
  function salida(id) {
    return function (box) {
      var S = SETS[id], i = 0, est = S.ps.map(function () { return { sel: null, visto: false }; });
      var puntos = h('div', { class: 'sl-puntos', role: 'group', 'aria-label': 'Preguntas' });
      var prog = h('div', { class: 'sl-prog' }), q = h('h2', { class: 'sl-q' }), ops = h('div', { class: 'sl-ops', role: 'group', 'aria-label': 'Respuestas' });
      var por = h('p', { class: 'sl-por', hidden: true }), txt = h('p', { class: 'pj-status' });
      var bVer = btn('Ver la respuesta', ver, 'go'), bSig = btn('Siguiente pregunta', function () { ir(i + 1); }), bOtra = btn('Volver a empezar', function () {
        est.forEach(function (e) { e.sel = null; e.visto = false; }); ir(0);
      });
      box.appendChild(h('div', { class: 'sl-cab' }, [
        h('p', { class: 'sl-tit', html: S.tit + ' <span>· Preguntas de salida · ' + S.ed + ' · ' + S.cursos + '</span>' }), puntos]));
      box.appendChild(h('div', { class: 'sl-two' }, [prog, h('div', { class: 'sl-lado' }, [q, ops,
        h('p', { class: 'sl-voto', text: 'Votad con los dedos: uno para la A, dos para la B y tres para la C. Después, tocad la que diga la mayoría.' }),
        h('div', { class: 'pj-row' }, [bVer, bSig, bOtra]), por, txt])]));
      S.ps.forEach(function (_, k) {
        puntos.appendChild(h('button', { type: 'button', class: 'sl-punto', 'aria-label': 'Pregunta ' + (k + 1), text: String(k + 1), onclick: function () { ir(k); } }));
      });
      function ir(k) {
        i = Math.max(0, Math.min(S.ps.length - 1, k));
        var p = S.ps[i];
        prog.innerHTML = p.prog;
        q.textContent = '';
        q.appendChild(h('span', { class: 'sl-num', text: 'Pregunta ' + (i + 1) + ' de ' + S.ps.length }));
        q.appendChild(h('span', { html: p.q }));
        ops.innerHTML = '';
        p.ops.forEach(function (o, k2) {
          ops.appendChild(h('button', { type: 'button', class: 'sl-op', 'aria-pressed': 'false', html: '<b class="sl-l">' + LETRAS[k2] + '</b><span class="sl-t">' + o + '</span>',
            onclick: function () { elige(k2); } }));
        });
        pinta();
      }
      function elige(k) {
        var e = est[i];
        if (e.visto) return;
        e.sel = e.sel === k ? null : k;
        pinta();
      }
      function ver() {
        var e = est[i];
        if (e.visto) return;
        e.visto = true;
        pinta();
        if (e.sel === S.ps[i].ok) burst(ops);
      }
      function pinta() {
        var p = S.ps[i], e = est[i];
        Array.prototype.forEach.call(ops.children, function (o, k) {
          o.setAttribute('aria-pressed', String(e.sel === k));
          o.classList.toggle('ok', e.visto && k === p.ok);
          o.classList.toggle('mal', e.visto && k === e.sel && k !== p.ok);
          o.classList.toggle('apaga', e.visto && k !== p.ok && k !== e.sel);
        });
        Array.prototype.forEach.call(puntos.children, function (b0, k) {
          var ek = est[k];
          if (k === i) b0.setAttribute('aria-current', 'step'); else b0.removeAttribute('aria-current');
          b0.classList.toggle('ok', ek.visto && ek.sel === S.ps[k].ok);
          b0.classList.toggle('mal', ek.visto && ek.sel !== null && ek.sel !== S.ps[k].ok);
        });
        por.hidden = !e.visto;
        por.innerHTML = e.visto ? '<b>' + LETRAS[p.ok] + '.</b> ' + p.por : '';
        bVer.hidden = e.visto;
        bSig.hidden = !e.visto || i === S.ps.length - 1;
        var fin = est.every(function (x) { return x.visto; });
        bOtra.hidden = !fin;
        if (!e.visto) setStatus(txt, '', e.sel === null ? 'Pensadlo antes de votar. No hay prisa.' : 'La clase dice la ' + LETRAS[e.sel] + '. ¿Seguro? Pulsad «Ver la respuesta».');
        else {
          var res = e.sel === null ? 'La buena es la ' + LETRAS[p.ok] + '.' : e.sel === p.ok ? '¡La clase ha acertado! Es la ' + LETRAS[p.ok] + '.' : 'Casi: la clase dijo la ' + LETRAS[e.sel] + ' y la buena es la ' + LETRAS[p.ok] + '.';
          if (fin) {
            var votadas = est.filter(function (x) { return x.sel !== null; }).length, bien = est.filter(function (x, k) { return x.sel === S.ps[k].ok; }).length;
            res += votadas ? ' En total, ' + bien + ' de ' + votadas + (votadas === 1 ? ' acertada.' : ' acertadas.') : '';
          }
          setStatus(txt, e.sel === null ? '' : e.sel === p.ok ? 'good' : 'bad', res);
        }
      }
      if (tecla) document.removeEventListener('keydown', tecla);
      tecla = function (ev) {
        if (!box.isConnected || box.closest('section.page').hidden || /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
        var k = { '1': 0, '2': 1, '3': 2, a: 0, b: 1, c: 2 }[ev.key.toLowerCase()];
        if (k !== undefined) { elige(k); ev.preventDefault(); }
        else if (ev.key === 'Enter' && ev.target === document.body) { if (!est[i].visto) ver(); else if (i < S.ps.length - 1) ir(i + 1); ev.preventDefault(); }
        else if (ev.key === 'ArrowRight' && est[i].visto) { ir(i + 1); ev.preventDefault(); }
        else if (ev.key === 'ArrowLeft') { ir(i - 1); ev.preventDefault(); }
      };
      document.addEventListener('keydown', tecla);
      ir(0);
    };
  }

  window.Proyectables.register('salida', porModos(Object.keys(SETS).map(function (k) { return [k, salida(k)]; })));
})();
