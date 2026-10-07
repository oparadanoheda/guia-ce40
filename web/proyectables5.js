/* Modos «Repaso 4º-6º»: los conceptos de los primeros cursos (si… entonces, bucles, algoritmos en la cuadrícula) con
   ejemplos y aspecto de 4º a 6º, y con los bloques escritos como en Scratch y MakeCode. Se abren con el preset «repaso»
   de cada herramienta (#p-semaforo.repaso, #p-bucles.repaso, #p-cuadricula.repaso). */
(function () {
  'use strict';
  var P = window.PJH, h = P.h, btn = P.btn, rnd = P.rnd, NS = P.NS, setStatus = P.setStatus;

  // ------------------------------------------------------------ bloques dibujados (colores de cada editor)
  var SC = { control: '#FFAB19', op: '#59C059', looks: '#9966FF', vars: '#FF8C1A', pen: '#0FBD8C', mov: '#4C97FF' };
  var MK = { bas: '#1E90FF', inp: '#D400D4', log: '#00A4A6', loo: '#00AA00' };
  function b(col, html) { return '<div class="rp-b" style="background:' + col + '">' + html + '</div>'; }
  // bloque en C: secciones [cabecera, contenido, número de rama]
  function c(col, secs) {
    return '<div class="rp-c" style="--bc:' + col + '">' + secs.map(function (s) {
      return '<div class="rp-ch" data-r="' + s[2] + '">' + s[0] + '</div><div class="rp-cin" data-r="' + s[2] + '">' + s[1] + '</div>';
    }).join('') + '<div class="rp-cf"></div></div>';
  }
  function r(col, html) { return '<span class="rp-r" style="background:' + col + '">' + html + '</span>'; }
  function v(x) { return '<span class="rp-v">' + x + '</span>'; }
  function mostrar(prog, rama) {
    prog.querySelectorAll('[data-r]').forEach(function (e) {
      var k = +e.getAttribute('data-r');
      e.classList.toggle('on', rama !== null && k === rama);
      e.classList.toggle('off', rama !== null && k !== rama && k >= 0);
    });
  }
  function leds(pat) {  // pat: 25 caracteres, # encendido
    return '<div class="rp-leds">' + pat.split('').map(function (ch) { return '<i' + (ch === '#' ? ' class="on"' : '') + '></i>'; }).join('') + '</div>';
  }
  var CARA = { contenta: '.....' + '.#.#.' + '.....' + '#...#' + '.###.', triste: '.....' + '.#.#.' + '.....' + '.###.' + '#...#', seria: '.#.#.' + '.....' + '...#.' + '..#..' + '.#...' };

  // armazón común: pestañas de nivel, programa y controles a la izquierda; resultado y «para pensar» a la derecha
  function marco(root, niveles, pinta) {
    var tabs = h('div', { class: 'rp-tabs', role: 'tablist' }), left = h('div', { class: 'pj-col' }), right = h('div', { class: 'pj-col' });
    root.appendChild(h('p', { class: 'rp-tag', text: 'Repaso 4º-6º' }));
    root.appendChild(tabs);
    root.appendChild(h('div', { class: 'pj-two rp-two' }, [left, right]));
    var cur = 0;
    function abrir(i) {
      cur = i;
      Array.prototype.forEach.call(tabs.children, function (t, k) { t.setAttribute('aria-selected', String(k === i)); });
      left.innerHTML = ''; right.innerHTML = '';
      pinta(niveles[i], left, right);
    }
    niveles.forEach(function (n, i) { tabs.appendChild(h('button', { type: 'button', role: 'tab', class: 'rp-tab', html: '<b>' + (i + 1) + '</b> ' + n.t, onclick: function () { abrir(i); } })); });
    return { load: function () { abrir(cur); } };
  }
  function pensar(box, q, a) {
    var ans = h('p', { class: 'rp-ans', hidden: true, html: a });
    box.appendChild(h('div', { class: 'rp-think' }, [h('h4', { text: 'Para pensar' }), h('p', { html: q }), btn('Ver la respuesta', function () { ans.hidden = !ans.hidden; }), ans]));
  }
  function deslizador(c0, onchange) {
    var out = h('b', { class: 'rp-val', text: String(c0.val) });
    var inp = h('input', { type: 'range', min: c0.min, max: c0.max, step: c0.step || 1, value: c0.val, class: 'pj-range', 'aria-label': c0.aria || c0.label });
    inp.addEventListener('input', function () { c0.val = +inp.value; out.textContent = String(c0.val); onchange(); });
    return h('label', { class: 'rp-ctl' }, [h('span', { html: c0.label }), inp, out]);
  }

  /* ================================================================ 1. Si… entonces */
  var SI = [
    { t: 'Si… entonces', ed: 'MakeCode', vars: [{ id: 'luz', label: r(MK.inp, 'nivel de luz'), min: 0, max: 255, val: 120 }],
      prog: function () {
        return c(MK.bas, [['para siempre', c(MK.log, [['si ' + r(MK.log, r(MK.inp, 'nivel de luz') + ' &lt; ' + v(50)) + ' entonces', b(MK.bas, 'mostrar LEDs ' + leds('#########################').replace('rp-leds', 'rp-leds sm')), 0]]), -1]]);
      },
      run: function (s) { return s.luz < 50 ? { rama: 0, out: leds('#########################'), txt: 'Se cumple la condición (' + s.luz + ' es menor que 50): se encienden todos los LED.' } : { rama: null, out: leds('.........................'), txt: 'No se cumple (' + s.luz + ' no es menor que 50): lo de dentro se salta y la pantalla se queda como estaba.' }; },
      q: 'Se hace de noche, se encienden los LED… y vuelve la luz. ¿Se apagan?',
      a: 'No: en el programa no hay nada que los apague. Hace falta un <b>si no</b> con <b>borrar la pantalla</b> (nivel 2).' },
    { t: 'Si… si no', ed: 'MakeCode', vars: [{ id: 'luz', label: r(MK.inp, 'nivel de luz'), min: 0, max: 255, val: 50 }],
      prog: function () {
        return c(MK.bas, [['para siempre', c(MK.log, [['si ' + r(MK.log, r(MK.inp, 'nivel de luz') + ' &lt; ' + v(50)) + ' entonces', b(MK.bas, 'mostrar LEDs ' + leds('#########################').replace('rp-leds', 'rp-leds sm')), 0], ['si no', b(MK.bas, 'borrar la pantalla'), 1]]), -1]]);
      },
      run: function (s) { return s.luz < 50 ? { rama: 0, out: leds('#########################'), txt: 'Se cumple la condición: se encienden los LED.' } : { rama: 1, out: leds('.........................'), txt: 'No se cumple la condición, así que se hace el <b>si no</b>: se borra la pantalla.' }; },
      q: 'Con el nivel de luz justo en 50, ¿se encienden o se apagan?',
      a: 'Se apagan: 50 <b>no</b> es menor que 50. La condición es «&lt; 50», no «≤ 50». Probadlo con el deslizador.' },
    { t: 'Tres caminos', ed: 'MakeCode', vars: [{ id: 'son', label: r(MK.inp, 'nivel de sonido'), min: 0, max: 255, val: 120 }],
      prog: function () {
        return c(MK.bas, [['para siempre', c(MK.log, [
          ['si ' + r(MK.log, r(MK.inp, 'nivel de sonido') + ' &gt; ' + v(150)) + ' entonces', b(MK.bas, 'mostrar ícono ' + leds(CARA.triste).replace('rp-leds', 'rp-leds sm')), 0],
          ['si no, si ' + r(MK.log, r(MK.inp, 'nivel de sonido') + ' &gt; ' + v(90)) + ' entonces', b(MK.bas, 'mostrar ícono ' + leds(CARA.seria).replace('rp-leds', 'rp-leds sm')), 1],
          ['si no', b(MK.bas, 'mostrar ícono ' + leds(CARA.contenta).replace('rp-leds', 'rp-leds sm')), 2]]), -1]]);
      },
      run: function (s) {
        if (s.son > 150) return { rama: 0, out: leds(CARA.triste), txt: s.son + ' es mayor que 150: cara triste. Las otras ramas ya no se miran.' };
        if (s.son > 90) return { rama: 1, out: leds(CARA.seria), txt: s.son + ' no es mayor que 150, pero sí que 90: cara seria.' };
        return { rama: 2, out: leds(CARA.contenta), txt: 'No se cumple ninguna de las dos condiciones: se hace el <b>si no</b>, cara contenta.' };
      },
      q: '¿Y si cambiamos el orden y preguntamos primero «&gt; 90» y después «&gt; 150»? ¿Qué sale con 200?',
      a: 'Saldría la cara <b>seria</b>: se hace la primera condición que se cumple y las demás ya no se miran. Por eso la condición más exigente va primero. Es el semáforo de ruido de 6º.' },
    { t: 'Dos condiciones con «y»', ed: 'Scratch', vars: [{ id: 'pun', label: r(SC.vars, 'puntos'), min: 0, max: 15, val: 8 }, { id: 'vid', label: r(SC.vars, 'vidas'), min: 0, max: 3, val: 1 }],
      prog: function () {
        return c(SC.control, [['si ' + r(SC.op, r(SC.op, r(SC.vars, 'puntos') + ' &gt; ' + v(9)) + ' y ' + r(SC.op, r(SC.vars, 'vidas') + ' &gt; ' + v(0))) + ' entonces', b(SC.looks, 'decir ' + v('¡Has ganado!')), 0]]);
      },
      run: function (s) {
        var a = s.pun > 9, bb = s.vid > 0;
        return a && bb ? { rama: 0, out: '<div class="rp-bubble">¡Has ganado!</div>', txt: 'Se cumplen <b>las dos</b>: más de 9 puntos y alguna vida.' }
          : { rama: null, out: '<div class="rp-bubble none">(no dice nada)</div>', txt: (a ? '' : 'No hay más de 9 puntos. ') + (bb ? '' : 'No quedan vidas. ') + 'Con <b>y</b> tienen que cumplirse las dos.' };
      },
      q: '¿Qué pasa con 12 puntos y 0 vidas? ¿Y si cambiamos «y» por «o»?',
      a: 'Con «y», nada: falta una de las dos. Con «<b>o</b>» bastaría una: diría «¡Has ganado!» aunque no queden vidas, y eso no tiene sentido en el juego.' },
    { t: 'Una u otra con «o»', ed: 'Scratch', vars: [{ id: 'tie', label: r(SC.vars, 'tiempo'), min: 0, max: 30, val: 12 }, { id: 'vid', label: r(SC.vars, 'vidas'), min: 0, max: 3, val: 2 }],
      prog: function () {
        return c(SC.control, [['si ' + r(SC.op, r(SC.op, r(SC.vars, 'tiempo') + ' = ' + v(0)) + ' o ' + r(SC.op, r(SC.vars, 'vidas') + ' = ' + v(0))) + ' entonces', b(SC.looks, 'decir ' + v('Fin del juego')), 0]]);
      },
      run: function (s) {
        var a = s.tie === 0, bb = s.vid === 0;
        return a || bb ? { rama: 0, out: '<div class="rp-bubble">Fin del juego</div>', txt: 'Se cumple ' + (a && bb ? 'las dos' : a ? 'una: se acabó el tiempo' : 'una: no quedan vidas') + '. Con <b>o</b> basta una.' }
          : { rama: null, out: '<div class="rp-bubble none">(no dice nada)</div>', txt: 'No se cumple ninguna: queda tiempo y quedan vidas.' };
      },
      q: '¿Y si cambiamos «o» por «y»?',
      a: 'Solo acabaría si se terminan el tiempo <b>y</b> las vidas a la vez. Si te quedas sin vidas con tiempo de sobra, el juego seguiría: no es lo que queremos.' }
  ];
  function repasoSi(root) {
    return marco(root, SI, function (n, left, right) {
      var prog = h('div', { class: 'rp-prog', html: n.prog() }), out = h('div', { class: 'rp-out' }), txt = h('p', { class: 'pj-status' });
      var s = {};
      function oculta() { mostrar(prog, null); out.innerHTML = '<p class="rp-wait">¿Qué hará el programa? Pensadlo antes de verlo.</p>'; setStatus(txt, '', ''); }
      n.vars.forEach(function (x) { s[x.id] = x.val; });
      left.appendChild(h('h4', { text: 'Así se escribe en ' + n.ed }));
      left.appendChild(prog);
      var ctl = h('div', { class: 'rp-ctls' });
      n.vars.forEach(function (x) { ctl.appendChild(deslizador(x, function () { s[x.id] = x.val; oculta(); })); });
      left.appendChild(ctl);
      right.appendChild(h('h4', { text: 'Qué pasa' }));
      right.appendChild(out); right.appendChild(txt);
      right.appendChild(h('div', { class: 'pj-row' }, [btn('Ver qué pasa', function () { var res = n.run(s); mostrar(prog, res.rama); out.innerHTML = res.out; setStatus(txt, res.rama === null ? '' : 'good'); txt.innerHTML = res.txt; }, 'go'),
        btn('Valores al azar', function () { n.vars.forEach(function (x) { x.val = x.min + rnd(Math.floor((x.max - x.min) / (x.step || 1)) + 1) * (x.step || 1); s[x.id] = x.val; }); left.innerHTML = ''; right.innerHTML = ''; repaint(); })]));
      pensar(right, n.q, n.a);
      oculta();
      function repaint() { var i = SI.indexOf(n); root.querySelectorAll('.rp-tab')[i].click(); }
    });
  }

  /* ================================================================ 2. Bucles */
  function tortuga(cmds) {  // cmds: lista de ['m', pasos] o ['g', grados]; como en Scratch: empieza mirando a la derecha (90)
    var x = 0, y = 0, d = 90, pts = [[0, 0]];
    cmds.forEach(function (k) {
      if (k[0] === 'g') d += k[1];
      else { x += k[1] * Math.sin(d * Math.PI / 180); y += k[1] * Math.cos(d * Math.PI / 180); pts.push([x, y]); }
    });
    return pts;
  }
  function dibujo(pts) {
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    var w = Math.max(maxx - minx, 40), hh = Math.max(maxy - miny, 40), pad = 0.12 * Math.max(w, hh) + 10;
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + (p[0] - minx + pad).toFixed(1) + ' ' + (maxy - p[1] + pad).toFixed(1); }).join('');
    var len = 0; for (var i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    var W = w + 2 * pad, H = hh + 2 * pad, sw = Math.max(W, H) / 110;
    return '<svg class="rp-draw" viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '"><path d="' + d + '" fill="none" stroke="#0FBD8C" stroke-width="' + (sw * 1.6).toFixed(2) + '" stroke-linejoin="round" stroke-linecap="round" style="--len:' + len.toFixed(0) + '"/>' +
      '<circle cx="' + (pts[0][0] - minx + pad).toFixed(1) + '" cy="' + (maxy - pts[0][1] + pad).toFixed(1) + '" r="' + (sw * 2.4).toFixed(2) + '" fill="#1a1d24"/></svg>';
  }
  var DIV360 = [2, 3, 4, 5, 6, 8, 9, 10, 12];
  var BU = [
    { t: 'Repetir', vars: [{ id: 'n', label: r(SC.control, 'repetir') + ' (veces)', min: 3, max: 10, val: 4 }, { id: 'g', label: r(SC.mov, 'girar ↻') + ' (grados)', min: 30, max: 180, step: 15, val: 90 }],
      prog: function (s) {
        return b(SC.pen, 'borrar todo') + b(SC.pen, 'bajar lápiz') +
          c(SC.control, [['repetir ' + v(s.n), b(SC.mov, 'mover ' + v(60) + ' pasos') + b(SC.mov, 'girar ↻ ' + v(s.g) + ' grados'), 0]]);
      },
      run: function (s) {
        var cmds = []; for (var i = 0; i < s.n; i++) { cmds.push(['m', 60]); cmds.push(['g', s.g]); }
        var tot = s.n * s.g, cierra = tot % 360 === 0;
        return { pts: tortuga(cmds), txt: '«mover» y «girar» se ejecutan <b>' + s.n + ' veces</b> cada uno. En total gira ' + s.n + ' × ' + s.g + ' = <b>' + tot + '°</b>: ' +
          (cierra ? (tot === 360 ? 'una vuelta completa' : tot / 360 + ' vueltas completas') + ', así que la figura se cierra.' : 'no es una vuelta completa, así que la figura no se cierra.') };
      },
      q: 'Con 6 repeticiones, ¿qué giro hace falta para que la figura se cierre? ¿Y con 5?',
      a: '360 ÷ 6 = <b>60°</b> (hexágono) y 360 ÷ 5 = <b>72°</b> (pentágono). Con 5 repeticiones y 144° también se cierra: es una estrella, porque da dos vueltas (5 × 144 = 720).' },
    { t: 'Un bucle dentro de otro', vars: [{ id: 'r', label: r(SC.control, 'repetir') + ' de fuera (veces)', min: 0, max: DIV360.length - 1, val: 4, fmt: function (i) { return DIV360[i]; } }],
      prog: function (s) {
        var R = DIV360[s.r];
        return b(SC.pen, 'borrar todo') + b(SC.pen, 'bajar lápiz') +
          c(SC.control, [['repetir ' + v(R), c(SC.control, [['repetir ' + v(4), b(SC.mov, 'mover ' + v(50) + ' pasos') + b(SC.mov, 'girar ↻ ' + v(90) + ' grados'), 1]]) + b(SC.mov, 'girar ↻ ' + v(360 / R) + ' grados'), 0]]);
      },
      run: function (s) {
        var R = DIV360[s.r], cmds = [];
        for (var i = 0; i < R; i++) { for (var j = 0; j < 4; j++) { cmds.push(['m', 50]); cmds.push(['g', 90]); } cmds.push(['g', 360 / R]); }
        return { pts: tortuga(cmds), txt: 'Dibuja <b>' + R + ' cuadrados</b>. El bucle de dentro se ejecuta entero en cada vuelta del de fuera: «mover» se ejecuta ' + R + ' × 4 = <b>' + (R * 4) + ' veces</b>. El último giro, ' + (360 / R) + '°, reparte los cuadrados en una vuelta: ' + R + ' × ' + (360 / R) + ' = 360.' };
      },
      q: 'Con 8 repeticiones fuera, ¿cuántas veces se ejecuta «mover»? ¿Y cuántos bloques tendría el programa sin bucles?',
      a: '8 × 4 = <b>32 veces</b>. Sin bucles habría que escribir 32 «mover», 32 «girar 90» y 8 «girar 45»: <b>72 bloques</b> en lugar de 6.' },
    { t: 'Repetir hasta que', trace: true, vars: [{ id: 'a', label: 'Empieza en', min: 0, max: 5, val: 0 }, { id: 's', label: r(SC.vars, 'sumar a pasos'), min: 1, max: 5, val: 3 }, { id: 'l', label: 'Hasta que pasos &gt;', min: 10, max: 30, val: 20 }],
      prog: function (s) {
        return b(SC.vars, 'dar a ' + r(SC.vars, 'pasos') + ' el valor ' + v(s.a)) +
          c(SC.control, [['repetir hasta que ' + r(SC.op, r(SC.vars, 'pasos') + ' &gt; ' + v(s.l)), b(SC.vars, 'sumar a ' + r(SC.vars, 'pasos') + ' ' + v(s.s)), 0]]) +
          b(SC.looks, 'decir ' + r(SC.vars, 'pasos'));
      },
      run: function (s) {
        var p = s.a, rows = [], k = 0;
        while (!(p > s.l) && k < 100) { k++; rows.push([k, p, p + s.s]); p += s.s; }
        var t = '<table class="rp-trace"><tr><th>Vuelta</th><th>pasos al empezar</th><th>pasos al terminar</th></tr>' +
          rows.map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td><td>' + x[2] + '</td></tr>'; }).join('') + '</table>';
        return { html: t, txt: 'Da <b>' + k + (k === 1 ? ' vuelta' : ' vueltas') + '</b> y dice <b>' + p + '</b>. Antes de cada vuelta mira la condición: cuando pasos ya es mayor que ' + s.l + ', para.' };
      },
      q: 'Si pasos ya empieza siendo mayor que el límite, ¿cuántas vueltas da?',
      a: '<b>Ninguna</b>: «repetir hasta que» mira la condición <b>antes</b> de cada vuelta. Si ya se cumple al principio, no entra.' }
  ];
  function repasoBucles(root) {
    return marco(root, BU, function (n, left, right) {
      var s = {}, prog = h('div', { class: 'rp-prog' }), out = h('div', { class: 'rp-out' }), txt = h('p', { class: 'pj-status' });
      n.vars.forEach(function (x) { s[x.id] = x.val; });
      function pinta() { prog.innerHTML = n.prog(s); }
      function oculta() { pinta(); out.innerHTML = '<p class="rp-wait">' + (n.trace ? '¿Cuántas vueltas dará? ¿Qué número dirá?' : '¿Qué dibujará? ¿Cuántas veces se ejecuta cada bloque?') + '</p>'; setStatus(txt, '', ''); }
      left.appendChild(h('h4', { text: 'Así se escribe en Scratch' }));
      left.appendChild(prog);
      var ctl = h('div', { class: 'rp-ctls' });
      n.vars.forEach(function (x) {
        var d = deslizador(x, function () { s[x.id] = x.val; if (x.fmt) d.querySelector('.rp-val').textContent = String(x.fmt(x.val)); oculta(); });
        if (x.fmt) d.querySelector('.rp-val').textContent = String(x.fmt(x.val));
        ctl.appendChild(d);
      });
      left.appendChild(ctl);
      right.appendChild(h('h4', { text: 'Qué pasa' }));
      right.appendChild(out); right.appendChild(txt);
      right.appendChild(h('div', { class: 'pj-row' }, [btn('Ejecutar', function () {
        var res = n.run(s); out.innerHTML = res.html || dibujo(res.pts); setStatus(txt, 'good'); txt.innerHTML = res.txt;
      }, 'go')]));
      pensar(right, n.q, n.a);
      oculta();
    });
  }

  /* ================================================================ 3. Robot en la cuadrícula: algoritmos con coordenadas */
  // Programas: 'F' avanzar, 'R' girar derecha, 'L' girar izquierda, { rep: n, body: [...] }
  var DV = { N: [0, 1], E: [1, 0], S: [0, -1], O: [-1, 0] }, ORD = ['N', 'E', 'S', 'O'];
  var DNOM = { N: 'hacia arriba', E: 'hacia la derecha', S: 'hacia abajo', O: 'hacia la izquierda' };
  function rep(n, body) { return { rep: n, body: body }; }
  var RETOS = [
    { t: '¿Dónde acaba? 1', tipo: 'fin', start: [0, 0, 'N'], prog: [rep(3, ['F']), 'R', rep(2, ['F'])] },
    { t: '¿Dónde acaba? 2', tipo: 'fin', start: [1, 1, 'E'], prog: [rep(4, ['F', 'F', 'L'])] },
    { t: '¿Dónde acaba? 3', tipo: 'fin', start: [0, 0, 'N'], prog: [rep(2, ['F', 'R', 'F', 'L'])] },
    { t: '¿Dónde acaba? 4', tipo: 'fin', start: [0, 0, 'E'], prog: [rep(2, [rep(3, ['F']), 'L'])] },
    { t: 'Cazabichos 1', tipo: 'bicho', start: [0, 0, 'N'], goal: [3, 2], prog: [rep(2, ['F']), 'L', rep(3, ['F'])], bug: '3', fix: [rep(2, ['F']), 'R', rep(3, ['F'])],
      why: 'Hay que girar a la <b>derecha</b>: mirando hacia arriba, la meta está a la derecha. Con «girar a la izquierda» se sale del tablero.' },
    { t: 'Cazabichos 2', tipo: 'bicho', start: [0, 0, 'E'], goal: [2, 4], prog: [rep(2, ['F']), 'L', rep(3, ['F'])], bug: '4', fix: [rep(2, ['F']), 'L', rep(4, ['F'])],
      why: 'Para subir de y = 0 a y = 4 hacen falta <b>4</b> pasos: el segundo bucle tiene que ser «repetir 4 veces».' },
    { t: 'Cazabichos 3', tipo: 'bicho', start: [1, 1, 'N'], goal: [1, 1], goalDir: 'N', prog: [rep(3, ['F', 'F', 'R'])], bug: '1', fix: [rep(4, ['F', 'F', 'R'])],
      why: 'Queremos un cuadrado de lado 2 y volver al punto de partida mirando hacia arriba. Un cuadrado tiene <b>4</b> lados: «repetir 4 veces».' }
  ];
  function lineas(prog) {  // [{id, txt, nivel, ins}] en el orden en que se ven
    var out = [], k = 0;
    (function walk(list, lvl) {
      list.forEach(function (it) {
        k++;
        if (typeof it === 'string') out.push({ id: String(k), lvl: lvl, ins: it });
        else { out.push({ id: String(k), lvl: lvl, rep: it.rep }); walk(it.body, lvl + 1); }
      });
    })(prog, 0);
    return out;
  }
  function ejecuta(prog, start, n) {  // pasos [{x, y, d, id, choca}]
    var x = start[0], y = start[1], d = start[2], steps = [{ x: x, y: y, d: d, id: null }], k = 0, choca = false;
    (function walk(list) {
      list.forEach(function (it) {
        k++; var id = String(k);
        if (choca) return;
        if (typeof it === 'string') {
          if (it === 'F') { x += DV[d][0]; y += DV[d][1]; if (x < 0 || y < 0 || x >= n || y >= n) choca = true; }
          else d = ORD[(ORD.indexOf(d) + (it === 'R' ? 1 : 3)) % 4];
          steps.push({ x: x, y: y, d: d, id: id, choca: choca });
        } else {
          var base = k;
          for (var i = 0; i < it.rep && !choca; i++) { k = base; walk(it.body); }
          if (!it.rep) { k = base; }
          k = base + cuenta(it.body);
        }
      });
    })(prog);
    return steps;
  }
  function cuenta(list) { return list.reduce(function (a, it) { return a + 1 + (typeof it === 'string' ? 0 : cuenta(it.body)); }, 0); }
  function nombre(l) { return l.rep ? 'repetir ' + v(l.rep) + ' veces' : l.ins === 'F' ? 'avanzar una casilla' : l.ins === 'R' ? 'girar 90° a la derecha' : 'girar 90° a la izquierda'; }
  function pos(p) { return '(' + p[0] + ', ' + p[1] + ')'; }
  function repasoRobot(root) {
    var N = 6;
    return marco(root, RETOS, function (rt, left, right) {
      var svg = document.createElementNS(NS, 'svg'), txt = h('p', { class: 'pj-status' }), sel = null, timer = null;
      svg.setAttribute('class', 'rp-grid');
      var S = 64, ML = 40, MT = 12, MB = 34, W = ML + N * S + 26, H = MT + N * S + MB;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      function cx(x) { return ML + x * S + S / 2; }
      function cy(y) { return MT + (N - 1 - y) * S + S / 2; }
      function robot(p, choca) {
        var ang = { N: 0, E: 90, S: 180, O: 270 }[p.d];
        return '<g transform="translate(' + cx(p.x) + ' ' + cy(p.y) + ') rotate(' + ang + ')"><rect x="-22" y="-22" width="44" height="44" rx="10" fill="' + (choca ? '#cf3f36' : '#2c5bbf') + '"/><path d="M0 -15 L12 6 L-12 6 Z" fill="#fff"/></g>';
      }
      function tablero(steps, upto) {
        var s = '<rect x="' + ML + '" y="' + MT + '" width="' + (N * S) + '" height="' + (N * S) + '" fill="#f3f6fa"/>';
        for (var i = 0; i <= N; i++) {
          s += '<line x1="' + (ML + i * S) + '" y1="' + MT + '" x2="' + (ML + i * S) + '" y2="' + (MT + N * S) + '" stroke="#c9d3df" stroke-width="2"/>';
          s += '<line x1="' + ML + '" y1="' + (MT + i * S) + '" x2="' + (ML + N * S) + '" y2="' + (MT + i * S) + '" stroke="#c9d3df" stroke-width="2"/>';
        }
        for (var k = 0; k < N; k++) {
          s += '<text x="' + cx(k) + '" y="' + (MT + N * S + 24) + '" text-anchor="middle" font-size="18" font-weight="700" fill="#1a1d24">' + k + '</text>';
          s += '<text x="' + (ML - 12) + '" y="' + (cy(k) + 6) + '" text-anchor="end" font-size="18" font-weight="700" fill="#1a1d24">' + k + '</text>';
        }
        s += '<text x="' + (ML + N * S + 6) + '" y="' + (MT + N * S + 24) + '" font-size="16" font-style="italic" fill="#5f677a">x</text><text x="' + (ML - 26) + '" y="' + (MT + 2) + '" font-size="16" font-style="italic" fill="#5f677a">y</text>';
        if (rt.goal) s += '<rect x="' + (cx(rt.goal[0]) - 26) + '" y="' + (cy(rt.goal[1]) - 26) + '" width="52" height="52" rx="12" fill="none" stroke="#df7619" stroke-width="5" stroke-dasharray="8 6"/>';
        if (steps) {
          var path = steps.slice(0, upto + 1).filter(function (p) { return !p.choca; }).map(function (p, i) { return (i ? 'L' : 'M') + cx(p.x) + ' ' + cy(p.y); }).join('');
          s += '<path d="' + path + '" fill="none" stroke="#2c5bbf" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/>';
          var p = steps[Math.min(upto, steps.length - 1)];
          s += robot(p.choca ? steps[upto - 1] : p, p.choca);
        } else s += robot({ x: rt.start[0], y: rt.start[1], d: rt.start[2] });
        svg.innerHTML = s;
      }
      var prog = h('div', { class: 'rp-prog rp-robot' });
      lineas(rt.prog).forEach(function (l) {
        var e = h('div', { class: 'rp-line' + (l.rep ? ' rep' : ''), style: 'margin-left:' + (l.lvl * 1.6) + 'em', 'data-id': l.id, html: nombre(l) });
        if (rt.tipo === 'bicho') { e.setAttribute('role', 'button'); e.setAttribute('tabindex', '0'); e.addEventListener('click', function () { sel = l.id; prog.querySelectorAll('.rp-line').forEach(function (x) { x.classList.toggle('sel', x === e); }); }); }
        prog.appendChild(e);
      });
      function anima(p, done) {
        clearInterval(timer);
        var steps = ejecuta(p, rt.start, N), i = 0;
        var still = document.documentElement.classList.contains('pj-still');
        if (still) { tablero(steps, steps.length - 1); done(steps); return; }
        tablero(steps, 0);
        timer = setInterval(function () {
          i++;
          prog.querySelectorAll('.rp-line').forEach(function (x) { x.classList.toggle('run', steps[i] && x.getAttribute('data-id') === steps[i].id); });
          tablero(steps, i);
          if (i >= steps.length - 1) { clearInterval(timer); prog.querySelectorAll('.rp-line').forEach(function (x) { x.classList.remove('run'); }); done(steps); }
        }, 420);
      }
      var st = rt.start;
      left.appendChild(h('p', { class: 'pj-info', html: rt.tipo === 'fin'
        ? 'El robot empieza en <b>' + pos(st) + '</b> mirando <b>' + DNOM[st[2]] + '</b>. ¿En qué casilla acaba y hacia dónde mira?'
        : 'El robot empieza en <b>' + pos(st) + '</b> mirando <b>' + DNOM[st[2]] + '</b> y tiene que llegar a <b>' + pos(rt.goal) + '</b>' + (rt.goalDir ? ' mirando ' + DNOM[rt.goalDir] : '') + '. El programa tiene <b>un bicho</b>: tocad la línea que falla.' }));
      left.appendChild(prog);
      right.appendChild(svg); right.appendChild(txt);
      var fila = h('div', { class: 'pj-row' });
      if (rt.tipo === 'fin') {
        fila.appendChild(btn('Ejecutar el programa', function () {
          anima(rt.prog, function (steps) {
            var f = steps[steps.length - 1];
            setStatus(txt, 'good'); txt.innerHTML = 'Acaba en <b>' + pos([f.x, f.y]) + '</b> mirando <b>' + DNOM[f.d] + '</b>. «avanzar» se ha ejecutado ' + steps.filter(function (p) { return p.id && lineas(rt.prog).some(function (l) { return l.id === p.id && l.ins === 'F'; }); }).length + ' veces.';
          });
        }, 'go'));
      } else {
        fila.appendChild(btn('Comprobar', function () {
          if (!sel) { setStatus(txt, '', 'Primero tocad la línea que creéis que falla.'); return; }
          if (sel === rt.bug) { setStatus(txt, 'good'); txt.innerHTML = '¡Bicho encontrado! ' + rt.why; }
          else setStatus(txt, 'bad', 'Esa línea está bien. Probad a ejecutar el programa para ver dónde se tuerce.');
        }, 'go'));
        fila.appendChild(btn('Ejecutar el programa', function () {
          anima(rt.prog, function (steps) {
            var f = steps[steps.length - 1];
            setStatus(txt, f.choca ? 'bad' : '');
            txt.innerHTML = f.choca ? 'El robot se sale del tablero.' : 'Acaba en ' + pos([f.x, f.y]) + ' mirando ' + DNOM[f.d] + ', y tenía que llegar a ' + pos(rt.goal) + (rt.goalDir ? ' mirando ' + DNOM[rt.goalDir] : '') + '.';
          });
        }));
        fila.appendChild(btn('Ver el programa arreglado', function () {
          anima(rt.fix, function (steps) { var f = steps[steps.length - 1]; setStatus(txt, 'good'); txt.innerHTML = 'Arreglado: llega a ' + pos([f.x, f.y]) + ' mirando ' + DNOM[f.d] + '. ' + rt.why; });
        }));
      }
      right.appendChild(fila);
      tablero(null, 0);
    });
  }

  window.PJRepaso = { semaforo: repasoSi, bucles: repasoBucles, cuadricula: repasoRobot };
  // para comprobarlo desde fuera (pruebas)
  window.PJRepaso._prueba = { ejecuta: ejecuta, RETOS: RETOS };
})();
