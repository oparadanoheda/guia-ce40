/* Modos «Repaso 4º-6º»: los conceptos de los primeros cursos (si… entonces, bucles, algoritmos en la cuadrícula) con
   ejemplos y aspecto de 4º a 6º, y con los bloques escritos como en Scratch y MakeCode. Se abren con el preset «repaso»
   de cada herramienta (#p-semaforo.repaso, #p-bucles.repaso, #p-cuadricula.repaso). */
(function () {
  'use strict';
  var P = window.PJH, h = P.h, btn = P.btn, rnd = P.rnd, NS = P.NS, setStatus = P.setStatus;

  // ------------------------------------------------------------ bloques dibujados (colores de cada editor)
  var SC = { control: '#FFAB19', op: '#59C059', looks: '#9966FF', vars: '#FF8C1A', pen: '#0FBD8C', mov: '#4C97FF' };
  var MK = { bas: '#1E90FF', inp: '#D400D4', log: '#00A4A6', loo: '#00AA00', var: '#DC143C' };
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

  /* ================================================================ 4. Clasificador: reglas con y, o, no, y árbol de decisión */
  var par = function (n) { return n % 2 === 0; }, mult = function (k) { return function (n) { return n % k === 0; }; };
  var CL = [
    { t: 'Reglas con «y»', reglas: [['es par <b>y</b> mayor que 10', function (n) { return par(n) && n > 10; }],
      ['es múltiplo de 3 <b>y</b> menor que 15', function (n) { return n % 3 === 0 && n < 15; }],
      ['es impar <b>y</b> múltiplo de 5', function (n) { return !par(n) && n % 5 === 0; }]],
      q: '¿Puede algún número cumplir la regla «es par <b>y</b> es impar»?',
      a: 'No: con «y» tienen que cumplirse <b>las dos</b> y ningún número es par e impar a la vez. La caja del SÍ se quedaría vacía.' },
    { t: 'Reglas con «o»', reglas: [['es múltiplo de 3 <b>o</b> múltiplo de 5', function (n) { return n % 3 === 0 || n % 5 === 0; }],
      ['es menor que 5 <b>o</b> mayor que 25', function (n) { return n < 5 || n > 25; }],
      ['es múltiplo de 4 <b>o</b> múltiplo de 10', function (n) { return n % 4 === 0 || n % 10 === 0; }]],
      q: 'Con la regla «múltiplo de 3 <b>o</b> múltiplo de 5», ¿a qué caja va el 15?',
      a: 'Al <b>SÍ</b>: cumple las dos, y con «o» basta con una (o con las dos).' },
    { t: 'Reglas con «no»', reglas: [['<b>no</b> es múltiplo de 3', function (n) { return n % 3 !== 0; }],
      ['es par y <b>no</b> es múltiplo de 4', function (n) { return par(n) && n % 4 !== 0; }],
      ['<b>no</b> es mayor que 10', function (n) { return !(n > 10); }]],
      q: '«<b>No</b> es mayor que 10», ¿es lo mismo que «es menor que 10»?',
      a: 'Casi, pero no: el <b>10</b> no es mayor que 10, así que va al SÍ, y en cambio no es menor que 10. «No es mayor que 10» quiere decir «menor <b>o igual</b> que 10».' },
    { t: 'Árbol de decisión', arbol: true,
      q: '¿En qué caja acaban todos los múltiplos de 4? ¿Y el 6?',
      a: 'Los múltiplos de 4 son pares y van siempre a la <b>caja A</b>. El 6 es par pero no es múltiplo de 4: <b>caja B</b>. Así clasifica una máquina con un árbol de decisión: una pregunta detrás de otra.' }
  ];
  var ARBOL = { q: '¿Es par?', si: { q: '¿Es múltiplo de 4?', si: 'A', no: 'B', f: mult(4) }, no: { q: '¿Es múltiplo de 3?', si: 'C', no: 'D', f: mult(3) }, f: par };
  function repasoClasificador(root) {
    return marco(root, CL, function (n, left, right) {
      var txt = h('p', { class: 'pj-status' });
      if (!n.arbol) {
        var regla = null, usados = 0, pool = h('div', { class: 'rp-nums' }), si = h('div', { class: 'rp-bin-in' }), no = h('div', { class: 'rp-bin-in' });
        var nueva = function () {
          var otras = n.reglas.filter(function (r0) { return r0 !== regla; }); regla = otras[rnd(otras.length)]; usados = 0;
          si.innerHTML = ''; no.innerHTML = ''; pool.innerHTML = '';
          for (var k = 1; k <= 30; k++) (function (k) {
            pool.appendChild(h('button', { type: 'button', class: 'rp-num', text: String(k), onclick: function (e) {
              usados++; (regla[1](k) ? si : no).appendChild(h('span', { class: 'rp-num in', text: String(k) })); e.currentTarget.disabled = true;
              setStatus(txt, '', 'Números probados: ' + usados + '. ¿Cuál es la regla? Decidla antes de desvelarla.');
            } }));
          })(k);
          setStatus(txt, '', 'La máquina tiene una regla secreta. Tocad números y mirad a qué caja los manda.');
        };
        left.appendChild(h('h4', { text: 'Tocad un número' })); left.appendChild(pool);
        right.appendChild(h('div', { class: 'rp-bins' }, [h('div', { class: 'rp-bin yes' }, [h('h4', { text: 'SÍ cumple la regla' }), si]), h('div', { class: 'rp-bin no' }, [h('h4', { text: 'NO cumple la regla' }), no])]));
        right.appendChild(txt);
        right.appendChild(h('div', { class: 'pj-row' }, [btn('Desvelar la regla', function () { setStatus(txt, 'good'); txt.innerHTML = 'La regla era: el número <b>' + regla[0].replace(/<\/?b>/g, function (x) { return x; }) + '</b>. Comprobad que todos los del SÍ la cumplen y los del NO no.'; }, 'go'), btn('Otra regla', nueva)]));
        pensar(right, n.q, n.a);
        nueva();
        return;
      }
      // árbol de decisión
      var num = null, cajas = { A: [], B: [], C: [], D: [] }, tree = h('div', { class: 'rp-tree' }), big = h('p', { class: 'rp-bignum' });
      function pinta(camino) {
        var on = function (k) { return camino && camino.indexOf(k) >= 0 ? ' on' : ''; };
        var hoja = function (k) { return '<div class="rp-leaf' + on(k) + '"><b>' + k + '</b><span>' + (cajas[k].join(', ') || '&nbsp;') + '</span></div>'; };
        tree.innerHTML = '<div class="rp-q' + on('q1') + '">' + ARBOL.q + '</div>' +
          '<div class="rp-br"><div class="rp-side"><span class="rp-lab si' + on('q2') + '">SÍ</span><div class="rp-q' + on('q2') + '">' + ARBOL.si.q + '</div>' +
          '<div class="rp-br"><div class="rp-side"><span class="rp-lab si' + on('A') + '">SÍ</span>' + hoja('A') + '</div><div class="rp-side"><span class="rp-lab no' + on('B') + '">NO</span>' + hoja('B') + '</div></div></div>' +
          '<div class="rp-side"><span class="rp-lab no' + on('q3') + '">NO</span><div class="rp-q' + on('q3') + '">' + ARBOL.no.q + '</div>' +
          '<div class="rp-br"><div class="rp-side"><span class="rp-lab si' + on('C') + '">SÍ</span>' + hoja('C') + '</div><div class="rp-side"><span class="rp-lab no' + on('D') + '">NO</span>' + hoja('D') + '</div></div></div></div>';
      }
      function otro() { var libres = []; for (var k = 1; k <= 30; k++) if (!cajas.A.concat(cajas.B, cajas.C, cajas.D).some(function (x) { return x === k; })) libres.push(k); num = libres.length ? libres[rnd(libres.length)] : null; big.textContent = num === null ? '—' : String(num); pinta(); setStatus(txt, '', num === null ? 'Ya están todos los números.' : '¿En qué caja acabará el ' + num + '? Seguid las preguntas.'); }
      function camino() {
        if (num === null) return;
        var p1 = ARBOL.f(num), sub = p1 ? ARBOL.si : ARBOL.no, p2 = sub.f(num), caja = p2 ? sub.si : sub.no;
        cajas[caja].push(num); cajas[caja].sort(function (a, bb) { return a - bb; });
        pinta(['q1', p1 ? 'q2' : 'q3', caja]);
        setStatus(txt, 'good'); txt.innerHTML = 'El ' + num + ': ¿es par? <b>' + (p1 ? 'SÍ' : 'NO') + '</b> → ' + sub.q.toLowerCase().replace('¿', '¿') + ' <b>' + (p2 ? 'SÍ' : 'NO') + '</b> → caja <b>' + caja + '</b>.';
        num = null;
      }
      left.appendChild(h('h4', { text: 'El número' })); left.appendChild(big);
      left.appendChild(h('div', { class: 'pj-row' }, [btn('Ver el camino', camino, 'go'), btn('Otro número', otro)]));
      left.appendChild(txt);
      right.appendChild(tree);
      pensar(left, n.q, n.a);
      otro();
    });
  }

  /* ================================================================ 5. Patrones: figuras que crecen, series y bichos */
  function dots(cells, s) {  // cells: [[x, y]] en cuadros
    var mx = 0, my = 0; cells.forEach(function (c0) { mx = Math.max(mx, c0[0]); my = Math.max(my, c0[1]); });
    var W = (mx + 1) * s, H = (my + 1) * s;
    return '<svg viewBox="-2 -2 ' + (W + 4) + ' ' + (H + 4) + '" style="width:' + (W + 4) + 'px">' + cells.map(function (c0) { return '<rect x="' + c0[0] * s + '" y="' + (my - c0[1]) * s + '" width="' + (s - 3) + '" height="' + (s - 3) + '" rx="3" fill="#2c5bbf"/>'; }).join('') + '</svg>';
  }
  function palillos(n, s) {
    var W = n * s, out = '';
    for (var k = 0; k <= n; k++) out += '<line x1="' + k * s + '" y1="0" x2="' + k * s + '" y2="' + s + '"/>';
    for (var j = 0; j < n; j++) out += '<line x1="' + (j * s + 3) + '" y1="0" x2="' + ((j + 1) * s - 3) + '" y2="0"/><line x1="' + (j * s + 3) + '" y1="' + s + '" x2="' + ((j + 1) * s - 3) + '" y2="' + s + '"/>';
    return '<svg viewBox="-4 -4 ' + (W + 8) + ' ' + (s + 8) + '" style="width:' + (W + 8) + 'px" stroke="#b36b00" stroke-width="5" stroke-linecap="round">' + out + '</svg>';
  }
  var FIGS = [
    { t: 'La escalera', que: 'cuadrados', f: function (n) { return n * (n + 1) / 2; }, dib: function (n) { var c0 = []; for (var x = 0; x < n; x++) for (var y = 0; y <= x; y++) c0.push([x, y]); return dots(c0, 16); },
      regla: 'Cada figura añade una columna con un cuadrado más que la anterior: 1 + 2 + 3 + … Para la figura 10: 1 + 2 + … + 10 = <b>55</b>.' },
    { t: 'Cuadrados', que: 'cuadrados', f: function (n) { return n * n; }, dib: function (n) { var c0 = []; for (var x = 0; x < n; x++) for (var y = 0; y < n; y++) c0.push([x, y]); return dots(c0, 13); },
      regla: 'La figura n es un cuadrado de n × n. La figura 10: 10 × 10 = <b>100</b>.' },
    { t: 'Palillos', que: 'palillos', f: function (n) { return 3 * n + 1; }, dib: function (n) { return palillos(n, 26); },
      regla: 'La primera figura tiene 4 palillos y cada cuadrado nuevo añade 3. Figura n: 3 × n + 1. La figura 10: 3 × 10 + 1 = <b>31</b>.' }
  ];
  var SERIES = [
    { s: [3, 7, 11, 15], sig: 19, regla: 'Suma 4 cada vez. El 10.º número: 3 + 9 × 4 = <b>39</b>.' },
    { s: [50, 46, 42, 38], sig: 34, regla: 'Resta 4 cada vez. El 10.º número: 50 − 9 × 4 = <b>14</b>.' },
    { s: [1, 2, 4, 8], sig: 16, regla: 'Cada número es el doble del anterior. El 10.º: <b>512</b> (2 × 2 × … nueve veces).' },
    { s: [1, 1, 2, 3, 5], sig: 8, regla: 'Cada número es la suma de los dos anteriores (la sucesión de Fibonacci). Sigue: 8, 13, 21, 34…' },
    { s: [2, 5, 10, 17], sig: 26, regla: 'Se suma 3, luego 5, luego 7, luego 9: los impares. También es «posición × posición + 1». El 10.º: 10 × 10 + 1 = <b>101</b>.' }
  ];
  var BICHOS = [
    { s: [4, 8, 12, 15, 20, 24], mal: 3, bien: 16, regla: 'Suma 4: después del 12 va el <b>16</b>, no el 15.' },
    { s: [1, 3, 6, 10, 14, 21], mal: 4, bien: 15, regla: 'Se suma 2, 3, 4, 5, 6…: después del 10 va el <b>15</b> (10 + 5).' },
    { s: [100, 90, 80, 75, 60, 50], mal: 3, bien: 70, regla: 'Resta 10: después del 80 va el <b>70</b>.' },
    { s: [2, 4, 8, 16, 30, 64], mal: 4, bien: 32, regla: 'El doble cada vez: después del 16 va el <b>32</b>.' }
  ];
  var PA = [
    { t: 'Figuras que crecen', tipo: 'fig', q: '¿Qué figura de la escalera tiene 21 cuadrados?', a: 'La <b>figura 6</b>: 1 + 2 + 3 + 4 + 5 + 6 = 21.' },
    { t: 'Series de números', tipo: 'serie', q: 'En la serie que suma 4 (3, 7, 11, 15…), ¿estará el número 40?', a: '<b>No</b>: todos los números de la serie son 3 más un múltiplo de 4 (3, 7, 11…, 39, 43). El 40 es múltiplo de 4, así que no está.' },
    { t: 'Series con bicho', tipo: 'bicho', q: '¿Cómo se comprueba una serie sin equivocarse?', a: 'Mirando la <b>diferencia</b> (o la operación) entre cada número y el siguiente, uno por uno. Donde la diferencia cambia está el bicho.' }
  ];
  function repasoPatrones(root) {
    return marco(root, PA, function (n, left, right) {
      var i = 0, txt = h('p', { class: 'pj-status' }), show = h('div', { class: 'rp-pat' }), inp = h('input', { type: 'number', class: 'pj-input', style: 'width:7em', 'aria-label': 'Respuesta' });
      var lista = n.tipo === 'fig' ? FIGS : n.tipo === 'serie' ? SERIES : BICHOS;
      var tabs = h('div', { class: 'pj-row' });
      lista.forEach(function (x, k) { tabs.appendChild(btn(x.t || ('Serie ' + (k + 1)), function () { i = k; pinta(); })); });
      function pinta() {
        var x = lista[i]; setStatus(txt, '', ''); inp.value = '';
        Array.prototype.forEach.call(tabs.children, function (b0, k) { b0.classList.toggle('go', k === i); });
        if (n.tipo === 'fig') show.innerHTML = [1, 2, 3, 4].map(function (k) { return '<figure>' + x.dib(k) + '<figcaption>Figura ' + k + '<br><b>' + x.f(k) + '</b> ' + x.que + '</figcaption></figure>'; }).join('') + '<figure class="q"><div>?</div><figcaption>Figura 5</figcaption></figure>';
        else if (n.tipo === 'serie') show.innerHTML = x.s.map(function (v0) { return '<span class="rp-term">' + v0 + '</span>'; }).join('<i>,</i>') + '<i>,</i><span class="rp-term q">?</span>';
        else {
          show.innerHTML = '';
          x.s.forEach(function (v0, k) { show.appendChild(h('button', { type: 'button', class: 'rp-term', text: String(v0), onclick: function () {
            if (k === x.mal) { setStatus(txt, 'good'); txt.innerHTML = '¡Bicho encontrado! ' + x.regla; }
            else setStatus(txt, 'bad', 'Ese número está bien. Mirad la diferencia entre cada número y el siguiente.');
          } })); });
        }
        if (n.tipo !== 'bicho') setStatus(txt, '', n.tipo === 'fig' ? '¿Cuántos ' + x.que + ' tendrá la figura 5?' : '¿Qué número va después?');
        else setStatus(txt, '', 'Hay un número que rompe la serie. Tocadlo.');
      }
      function comprobar() {
        var x = lista[i], ok = n.tipo === 'fig' ? x.f(5) : x.sig, v0 = Number(inp.value);
        if (inp.value === '') { setStatus(txt, '', 'Escribid un número.'); return; }
        if (v0 === ok) { setStatus(txt, 'good'); txt.innerHTML = '¡Sí, ' + ok + '! ' + (n.tipo === 'fig' ? '¿Y la figura 10? Pensadlo y pulsad «Ver la regla».' : '¿Y el número que va en el puesto 10? Pensadlo y pulsad «Ver la regla».'); }
        else setStatus(txt, 'bad', 'No es ' + v0 + '. Mirad cómo cambia de una ' + (n.tipo === 'fig' ? 'figura' : 'posición') + ' a la siguiente.');
      }
      left.appendChild(tabs); left.appendChild(show);
      if (n.tipo !== 'bicho') {
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') comprobar(); });
        left.appendChild(h('div', { class: 'pj-row' }, [inp, btn('Comprobar', comprobar, 'go'), btn('Ver la regla', function () { setStatus(txt, 'good'); txt.innerHTML = lista[i].regla; })]));
      } else left.appendChild(h('div', { class: 'pj-row' }, [btn('Ver la solución', function () { setStatus(txt, 'good'); txt.innerHTML = 'El bicho es el ' + lista[i].s[lista[i].mal] + '. ' + lista[i].regla; })]));
      left.appendChild(txt);
      pensar(right, n.q, n.a);
      pinta();
    });
  }

  /* ================================================================ 6. Ordenar la secuencia: algoritmos con más de un orden posible */
  // antes: [a, b] = el paso a tiene que ir antes que el b. Si dos pasos no tienen orden entre ellos, valen los dos órdenes.
  var SEQ = [
    { t: 'Pasar el programa a la micro:bit',
      pasos: ['Hacer el programa y probarlo en el simulador', 'Conectar la micro:bit al ordenador con el cable USB', 'Pulsar «Descargar» en MakeCode', 'Copiar el archivo .hex en la unidad MICROBIT', 'Esperar a que la luz de la placa deje de parpadear', 'Probar el programa en la placa'],
      antes: [[0, 2], [1, 3], [2, 3], [3, 4], [4, 5]],
      nota: 'Fijaos: «Conectar la micro:bit» puede ir en varios sitios. Solo tiene que estar antes de copiar el archivo. Hay más de un orden correcto.',
      q: '¿Se puede conectar la placa antes de hacer el programa?', a: '<b>Sí</b>. Conectar solo tiene que ir antes de copiar el archivo. Un algoritmo puede tener pasos cuyo orden da igual.' },
    { t: 'Sumar 47 + 38 en columna',
      pasos: ['Coloco los números uno debajo del otro: unidades con unidades y decenas con decenas', 'Sumo las unidades: 7 + 8 = 15', 'Escribo el 5 y me llevo 1', 'Sumo las decenas y la que me llevo: 4 + 3 + 1 = 8', 'Escribo el 8: el resultado es 85'],
      antes: [[0, 1], [1, 2], [2, 3], [3, 4]],
      q: '¿Por qué hay que empezar por las unidades?', a: 'Porque al sumar las unidades puede haber <b>llevadas</b> (15 son 1 decena y 5 unidades), y esa decena hay que sumarla con las decenas.' },
    { t: 'La media de cuatro notas: 6, 8, 7 y 9',
      pasos: ['Sumo todas las notas: 6 + 8 + 7 + 9 = 30', 'Cuento cuántas notas hay: 4', 'Divido la suma entre el número de notas: 30 ÷ 4 = 7,5', 'Escribo la media: 7,5'],
      antes: [[0, 2], [1, 2], [2, 3]],
      nota: 'Sumar y contar pueden ir en cualquier orden: las dos cosas tienen que estar hechas antes de dividir.',
      q: '¿Importa si primero cuento las notas o si primero las sumo?', a: '<b>No</b>: las dos cosas tienen que estar antes de dividir, pero entre ellas no hay orden. Hay dos órdenes correctos.' },
    { t: 'Resolver un problema',
      pasos: ['Leo el problema entero', 'Busco los datos y lo que me preguntan', 'Decido qué operación tengo que hacer', 'Hago la operación', 'Compruebo si el resultado tiene sentido', 'Escribo la respuesta con una frase'],
      antes: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
      q: '¿Qué puede pasar si hago la operación sin leer el problema entero?', a: 'Que haga una operación que <b>no responde a la pregunta</b>. Leer y buscar lo que me preguntan va siempre primero.' }
  ];
  function repasoSecuencias(root) {
    return marco(root, SEQ, function (n, left, right) {
      var pool = h('div', { class: 'rp-pool' }), lista = h('ol', { class: 'rp-order' }), txt = h('p', { class: 'pj-status' }), orden = [], mezcla = [];
      function valido(o) { return n.antes.every(function (c0) { return o.indexOf(c0[0]) < o.indexOf(c0[1]); }); }
      function mezclar() {
        do { mezcla = P.shuffle(n.pasos.map(function (x, k) { return k; })); } while (valido(mezcla));
        orden = []; pinta(); setStatus(txt, '', 'Tocad los pasos en el orden en que se hacen.');
      }
      function pinta(malos) {
        pool.innerHTML = ''; lista.innerHTML = '';
        mezcla.forEach(function (k) { if (orden.indexOf(k) < 0) pool.appendChild(h('button', { type: 'button', class: 'rp-step', text: n.pasos[k], onclick: function () { orden.push(k); pinta(); } })); });
        orden.forEach(function (k, j) { lista.appendChild(h('li', {}, [h('button', { type: 'button', class: 'rp-step in' + (malos && malos.indexOf(k) >= 0 ? ' bad' : ''), text: n.pasos[k], title: 'Tocar para devolverlo', onclick: function () { orden.splice(j, 1); pinta(); } })])); });
      }
      function comprobar() {
        if (orden.length < n.pasos.length) { setStatus(txt, '', 'Faltan pasos por colocar.'); return; }
        if (valido(orden)) { setStatus(txt, 'good'); txt.innerHTML = '¡Orden correcto!' + (n.nota ? ' ' + n.nota : ''); P.burst(lista); return; }
        var malos = [];
        n.antes.forEach(function (c0) { if (orden.indexOf(c0[0]) > orden.indexOf(c0[1])) { malos.push(c0[0], c0[1]); } });
        pinta(malos);
        setStatus(txt, 'bad', 'Hay pasos que no pueden ir en ese orden: están marcados. ¿Qué tiene que estar hecho antes?');
      }
      left.appendChild(h('h4', { text: 'Pasos' })); left.appendChild(pool);
      right.appendChild(h('h4', { text: 'Nuestro orden' })); right.appendChild(lista); right.appendChild(txt);
      right.appendChild(h('div', { class: 'pj-row' }, [btn('Comprobar', comprobar, 'go'), btn('Mezclar otra vez', mezclar)]));
      pensar(right, n.q, n.a);
      mezclar();
    });
  }

  /* ================================================================ Variables (herramienta completa, con cuatro modos) */
  // Los bloques se escriben como en el editor elegido: Scratch (dar a … el valor, sumar a …) o MakeCode (fijar … a, cambiar … por).
  var ED = {
    scratch: { nom: 'Scratch', set: function (v0, x) { return 'dar a ' + r(SC.vars, v0) + ' el valor ' + x; }, chg: function (v0, x) { return 'sumar a ' + r(SC.vars, v0) + ' ' + x; },
      start: 'al hacer clic en <svg class="gflag" viewBox="0 0 16 16" role="img" aria-label="bandera verde"><path d="M3.2 1.6v12.8" stroke="#3d8a37" stroke-width="1.7" stroke-linecap="round"/><path d="M4 2.6c2.1-1.2 3.9.8 6 0 1-.4 1.9-.7 2.8-.5v6.4c-.9-.2-1.8.1-2.8.5-2.1.8-3.9-1.2-6 0z" fill="#4cbf56" stroke="#3d8a37" stroke-width=".9" stroke-linejoin="round"/></svg>', rep: function (n) { return 'repetir ' + v(n); }, until: function (c0) { return 'repetir hasta que ' + c0; }, wait: 'esperar ' + v(1) + ' segundos',
      say: function (x) { return 'decir ' + x; }, si: function (c0) { return 'si ' + c0 + ' entonces'; }, sino: 'si no', mul: '*', colV: SC.vars, colC: SC.control, colL: SC.looks, colO: SC.op, colE: '#FFBF00' },
    makecode: { nom: 'MakeCode', set: function (v0, x) { return 'fijar ' + r(MK.var, v0) + ' a ' + x; }, chg: function (v0, x) { return 'cambiar ' + r(MK.var, v0) + ' por ' + x; },
      start: 'al iniciar', rep: function (n) { return 'repetir ' + v(n) + ' veces'; }, until: null, wait: 'pausa (ms) ' + v(1000),
      say: function (x) { return 'mostrar cadena ' + x; }, si: function (c0) { return 'si ' + c0 + ' entonces'; }, sino: 'si no', mul: '×', colV: MK.var, colC: MK.loo, colL: MK.bas, colO: MK.log, colE: MK.bas }
  };
  function caja(nombre, valor, extra) {
    return '<div class="vr-caja"><span class="vr-nom">' + nombre + '</span><b class="vr-val' + (extra || '') + '">' + valor + '</b></div>';
  }

  // --- 1. La caja: dar el valor frente a sumar
  function modoCaja(box, ed, txt) {
    var val = 3, hist = [];
    var nSet = h('input', { type: 'number', value: 5, class: 'vr-in', 'aria-label': 'Valor que se da' }), nChg = h('input', { type: 'number', value: 2, class: 'vr-in', 'aria-label': 'Cantidad que se suma' });
    var cajaEl = h('div', { class: 'vr-cajas' }), tabla = h('table', { class: 'rp-trace' });
    function pinta(anim) {
      cajaEl.innerHTML = caja('puntos', val, anim ? ' ' + anim : '');
      tabla.innerHTML = '<tr><th>Bloque</th><th>puntos vale</th></tr>' + hist.map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td></tr>'; }).join('');
    }
    function blq(html, fn) { return h('div', { class: 'vr-blq' }, [h('div', { class: 'rp-b', style: 'background:' + ed.colV, html: html }), btn('Ejecutar', fn, 'go')]); }
    var b1 = blq(ed.set('puntos', ''), function () { var x = Number(nSet.value) || 0; var antes = val; val = x; hist.push([stripTags(ed.set('puntos', x)), val]); pinta('nuevo'); setStatus(txt, 'good'); txt.innerHTML = 'Valía ' + antes + '. «' + stripTags(ed.set('puntos', x)) + '» <b>borra lo que había</b> y guarda el ' + x + '.'; });
    b1.querySelector('.rp-b').appendChild(nSet);
    var b2 = blq(ed.chg('puntos', ''), function () { var x = Number(nChg.value) || 0; var antes = val; val = antes + x; hist.push([stripTags(ed.chg('puntos', x)), val]); pinta('suma'); setStatus(txt, 'good'); txt.innerHTML = 'Valía ' + antes + '. «' + stripTags(ed.chg('puntos', x)) + '» <b>parte de lo que había</b>: ' + antes + (x < 0 ? ' − ' + (-x) : ' + ' + x) + ' = ' + val + '.'; });
    b2.querySelector('.rp-b').appendChild(nChg);
    box.appendChild(h('div', { class: 'pj-two' }, [
      h('div', { class: 'pj-col' }, [h('h4', { text: 'Los bloques' }), b1, b2, h('p', { class: 'pj-info', text: 'Cambiad los números de los bloques. Antes de ejecutar: ¿cuánto valdrá puntos?' }),
        btn('Empezar otra vez (puntos vale 3)', function () { val = 3; hist = []; pinta(); setStatus(txt, '', ''); })]),
      h('div', { class: 'pj-col' }, [h('h4', { text: 'La caja' }), cajaEl, txt, tabla])]));
    pinta();
    return { q: 'Puntos vale 3. Ejecuto «' + stripTags(ed.chg('puntos', 2)) + '» dos veces y después «' + stripTags(ed.set('puntos', 5)) + '». ¿Cuánto vale?', a: '<b>5</b>. Las dos sumas lo llevan a 7, pero «' + stripTags(ed.set('puntos', 5)) + '» borra lo que había y pone el 5.' };
  }
  function stripTags(s0) { return s0.replace(/<[^>]+>/g, ''); }

  // --- 2. Juego de cálculo en directo: puntos, vidas y las condiciones que los miran
  function modoJuego(box, ed, txt) {
    var pts = 0, vid = 3, a = 0, bb = 0, fin = false;
    var prog = h('div', { class: 'rp-prog' }), cajas = h('div', { class: 'vr-cajas' }), preg = h('p', { class: 'vr-preg' }), resp = h('div', { class: 'pj-row vr-resp' });
    var L = {
      ini: c(ed.colE, [[ed.start, b(ed.colV, ed.set('puntos', v(0))) + b(ed.colV, ed.set('vidas', v(3))), 'ini']]),
      ok: c(ed.colO, [[ed.si(r(ed.colO, 'respuesta = a ' + ed.mul + ' b')), b(ed.colV, ed.chg('puntos', v(1))), 'ok'], [ed.sino, b(ed.colV, ed.chg('vidas', v(-1))), 'no']]),
      fin: c(ed.colO, [[ed.si(r(ed.colO, r(ed.colV, 'vidas') + ' = ' + v(0))), b(ed.colL, ed.say(v('Has perdido'))), 'pierde']]),
      gana: c(ed.colO, [[ed.si(r(ed.colO, r(ed.colV, 'puntos') + ' = ' + v(10))), b(ed.colL, ed.say(v('¡Has ganado!'))), 'gana']])
    };
    prog.innerHTML = L.ini + L.ok + L.fin + L.gana;
    function luz(ids) {
      prog.querySelectorAll('[data-r]').forEach(function (e) { e.classList.remove('on', 'off'); });
      ids.forEach(function (id) { prog.querySelectorAll('[data-r="' + id + '"]').forEach(function (e) { e.classList.add('on'); }); });
    }
    function pintaCajas(cual) { cajas.innerHTML = caja('puntos', pts, cual === 'p' ? ' suma' : '') + caja('vidas', vid, cual === 'v' ? ' resta' : ''); }
    function nueva() {
      if (fin) return;
      a = 2 + rnd(8); bb = 2 + rnd(8);
      var ok = a * bb, ops = [ok], cand = [ok + a, ok - a, ok + bb, ok - bb, ok + 1, ok - 1, ok + 10];
      while (ops.length < 3) { var x = cand[rnd(cand.length)]; if (x > 0 && ops.indexOf(x) < 0) ops.push(x); }
      ops = P.shuffle(ops);
      preg.innerHTML = a + ' × ' + bb + ' = <span>?</span>';
      resp.innerHTML = '';
      ops.forEach(function (x) { resp.appendChild(btn(String(x), function () { contesta(x); })); });
    }
    function contesta(x) {
      if (fin) return;
      var bien = x === a * bb;
      if (bien) pts++; else vid--;
      pintaCajas(bien ? 'p' : 'v');
      var ids = [bien ? 'ok' : 'no'];
      if (vid === 0) { ids.push('pierde'); fin = true; }
      else if (pts === 10) { ids.push('gana'); fin = true; }
      luz(ids);
      setStatus(txt, bien ? 'good' : 'bad');
      txt.innerHTML = (bien ? '¡Bien! ' + stripTags(ed.chg('puntos', 1)) + '.' : 'Era ' + (a * bb) + '. Se ejecuta el «' + ed.sino + '»: ' + stripTags(ed.chg('vidas', -1)) + '.') +
        (vid === 0 ? ' <b>Vidas vale 0</b>: se cumple la condición y el juego dice «Has perdido».' : pts === 10 ? ' <b>Puntos vale 10</b>: «¡Has ganado!».' : '');
      if (fin) { resp.innerHTML = ''; preg.innerHTML = vid === 0 ? 'Has perdido' : '¡Has ganado!'; }
      else setTimeout(nueva, 900);
    }
    function empezar() { pts = 0; vid = 3; fin = false; pintaCajas(); luz(['ini']); setStatus(txt, '', 'Con la bandera, puntos empieza en 0 y vidas en 3.'); nueva(); }
    box.appendChild(h('div', { class: 'pj-two' }, [
      h('div', { class: 'pj-col' }, [cajas, preg, resp, txt, btn('Empezar el juego', empezar, 'go')]),
      h('div', { class: 'pj-col' }, [h('h4', { text: 'El programa (' + ed.nom + ')' }), prog])]));
    empezar();
    return { q: '¿Qué pasaría si quitamos los bloques de la bandera y jugamos una segunda partida?', a: 'Puntos y vidas empezarían con lo que quedó de la partida anterior: quizá con 0 vidas, y el juego acabaría nada más empezar. Por eso <b>toda variable se pone a su valor de salida al empezar</b>.' };
  }

  // --- 3. ¿Cuánto vale al final? Programas cortos que se ejecutan paso a paso
  // instrucciones: ['set', v, expr], ['chg', v, n], ['rep', n, [...]], ['until', [v, '=', n], [...]] (en MakeCode, «mientras» con la condición contraria), ['wait'], ['say', v]
  var TRAZAS = [
    { t: 'Dar y sumar', vars: ['puntos'], ini: {}, prog: [['set', 'puntos', 3], ['chg', 'puntos', 2], ['chg', 'puntos', 2], ['set', 'puntos', 0], ['chg', 'puntos', 5]], preg: 'puntos',
      q: '¿Por qué las dos sumas de 2 no cuentan al final?', a: 'Porque después viene el bloque que pone puntos a 0 («dar a puntos el valor 0» en Scratch, «fijar puntos a 0» en MakeCode), y ese bloque borra lo que había. Solo cuenta lo que pasa <b>después</b> de él.' },
    { t: 'Sin valor inicial', vars: ['puntos'], ini: { puntos: 7 }, nota: 'Al empezar, puntos ya vale <b>7</b>: es lo que quedó de la partida anterior.', prog: [['rep', 3, [['chg', 'puntos', 1]]]], preg: 'puntos',
      q: 'Queríamos ganar 3 puntos y que puntos valiera 3. ¿Cómo se arregla?', a: 'Poniendo al principio, con la bandera, <b>«dar a puntos el valor 0»</b> (en MakeCode, «fijar puntos a 0»). Así cada partida empieza igual.' },
    { t: 'Cuenta atrás', vars: ['tiempo'], ini: {}, prog: [['set', 'tiempo', 5], ['until', ['tiempo', '=', 0], [['wait'], ['chg', 'tiempo', -1]]], ['say', '¡Se acabó!']], preg: 'tiempo',
      q: '¿Cuántas veces se ejecuta «esperar» si tiempo empieza en 5?', a: '<b>5 veces</b>: una por cada vuelta, hasta que tiempo vale 0. Por eso la cuenta atrás dura 5 segundos.' },
    { t: 'Intercambiar: con bicho', vars: ['a', 'b'], ini: {}, prog: [['set', 'a', 4], ['set', 'b', 9], ['set', 'a', 'b'], ['set', 'b', 'a']], preg: 'b',
      q: 'Queríamos que a valiera 9 y b valiera 4. ¿Por qué no sale?', a: 'Al hacer «a toma el valor de b», el 4 de a <b>se pierde</b>. Cuando b toma el valor de a, a ya vale 9. Hace falta una caja más para guardarlo (siguiente programa).' },
    { t: 'Intercambiar: bien', vars: ['a', 'b', 'aux'], ini: {}, prog: [['set', 'a', 4], ['set', 'b', 9], ['set', 'aux', 'a'], ['set', 'a', 'b'], ['set', 'b', 'aux']], preg: 'b',
      q: '¿Para qué sirve la variable aux?', a: 'Para <b>guardar el 4</b> antes de perderlo, como cuando se cambian dos vasos de agua y hace falta un tercer vaso.' },
    { t: 'El doble', vars: ['n'], ini: {}, prog: [['set', 'n', 1], ['rep', 5, [['set', 'n', ['n', 2]]]]], preg: 'n',
      q: '¿Y si repetimos 10 veces en lugar de 5?', a: '1 × 2 × 2… diez veces: <b>1024</b>. Duplicar crece muy deprisa.' }
  ];
  function expr(x, ed) { return typeof x === 'number' ? v(x) : typeof x === 'string' ? r(ed.colV, x) : r(ed.colO, r(ed.colV, x[0]) + ' ' + ed.mul + ' ' + v(x[1])); }
  function valor(x, st) { return typeof x === 'number' ? x : typeof x === 'string' ? st[x] : st[x[0]] * x[1]; }
  function pintaTraza(p, ed, ids) {  // HTML del programa; cada instrucción lleva su número
    var k = 0;
    function lista(L0) {
      return L0.map(function (ins) {
        var id = k++;
        if (ins[0] === 'set') return '<div data-i="' + id + '">' + b(ed.colV, ed.set(ins[1], expr(ins[2], ed))) + '</div>';
        if (ins[0] === 'chg') return '<div data-i="' + id + '">' + b(ed.colV, ed.chg(ins[1], v(ins[2]))) + '</div>';
        if (ins[0] === 'wait') return '<div data-i="' + id + '">' + b(ed.colC, ed.wait) + '</div>';
        if (ins[0] === 'say') return '<div data-i="' + id + '">' + b(ed.colL, ed.say(v(ins[1]))) + '</div>';
        var cab = ins[0] === 'rep' ? ed.rep(ins[1]) : ed.until ? ed.until(r(ed.colO, r(ed.colV, ins[1][0]) + ' = ' + v(ins[1][2]))) : 'mientras ' + r(ed.colO, r(ed.colV, ins[1][0]) + ' &gt; ' + v(ins[1][2]));
        return '<div data-i="' + id + '">' + c(ed.colC, [[cab, lista(ins[2]), -1]]) + '</div>';
      }).join('');
    }
    return c(ed.colE, [[ed.start, lista(p.prog), -1]]);
  }
  function ejecutaTraza(p) {  // pasos: [{i, st}]
    var st = {}, out = [], k = 0;
    p.vars.forEach(function (x) { st[x] = p.ini[x] !== undefined ? p.ini[x] : 0; });
    var ids = new Map();
    (function numera(L0) { L0.forEach(function (ins) { ids.set(ins, k++); if (ins[0] === 'rep' || ins[0] === 'until') numera(ins[2]); }); })(p.prog);
    (function corre(L0) {
      L0.forEach(function (ins) {
        if (out.length > 200) return;
        if (ins[0] === 'set') { st[ins[1]] = valor(ins[2], st); out.push({ i: ids.get(ins), st: Object.assign({}, st) }); }
        else if (ins[0] === 'chg') { st[ins[1]] += ins[2]; out.push({ i: ids.get(ins), st: Object.assign({}, st) }); }
        else if (ins[0] === 'wait' || ins[0] === 'say') out.push({ i: ids.get(ins), st: Object.assign({}, st), dice: ins[0] === 'say' ? ins[1] : null });
        else if (ins[0] === 'rep') for (var j = 0; j < ins[1]; j++) corre(ins[2]);
        else while (!(st[ins[1][0]] === ins[1][2]) && out.length < 200) { out.push({ i: ids.get(ins), st: Object.assign({}, st), mira: true }); corre(ins[2]); }
      });
    })(p.prog);
    return out;
  }
  function modoTraza(box, ed, txt) {
    var cur = 0, pasos = [], k = 0;
    var tabs = h('div', { class: 'pj-row' }), prog = h('div', { class: 'rp-prog' }), tabla = h('table', { class: 'rp-trace' }), inp = h('input', { type: 'number', class: 'pj-input', style: 'width:6em', 'aria-label': 'Predicción' });
    var nota = h('p', { class: 'pj-info' }), pregEl = h('p', { class: 'vr-q' }), pens = h('div');
    TRAZAS.forEach(function (p, i) { tabs.appendChild(btn(p.t, function () { abre(i); })); });
    function abre(i) {
      cur = i; var p = TRAZAS[i]; k = 0; pasos = ejecutaTraza(p);
      Array.prototype.forEach.call(tabs.children, function (x, j) { x.classList.toggle('go', j === i); });
      prog.innerHTML = pintaTraza(p, ed);
      nota.innerHTML = p.nota || '';
      pregEl.innerHTML = '¿Cuánto valdrá <b>' + p.preg + '</b> al final?';
      tabla.innerHTML = '<tr><th>Paso</th>' + p.vars.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' +
        '<tr><td>al empezar</td>' + p.vars.map(function (x) { return '<td>' + (p.ini[x] !== undefined ? p.ini[x] : 0) + '</td>'; }).join('') + '</tr>';
      inp.value = ''; setStatus(txt, '', '');
      pens.innerHTML = ''; pensar(pens, p.q, p.a);
    }
    function paso() {
      if (k >= pasos.length) { fin(); return; }
      var s = pasos[k++], p = TRAZAS[cur];
      prog.querySelectorAll('[data-i]').forEach(function (e) { e.classList.toggle('vr-now', +e.getAttribute('data-i') === s.i); });
      if (!s.mira) tabla.insertAdjacentHTML('beforeend', '<tr><td>' + (tabla.rows.length - 1) + '</td>' + p.vars.map(function (x) { return '<td>' + s.st[x] + '</td>'; }).join('') + '</tr>');
      if (s.dice) { setStatus(txt, '', 'Dice «' + s.dice + '».'); }
      if (k >= pasos.length) fin();
    }
    function fin() {
      var p = TRAZAS[cur], ult = pasos[pasos.length - 1].st[p.preg], pred = inp.value === '' ? null : Number(inp.value);
      setStatus(txt, pred === null || pred === ult ? 'good' : 'bad');
      txt.innerHTML = 'Al final, <b>' + p.preg + ' vale ' + ult + '</b>.' + (pred === null ? '' : pred === ult ? ' ¡La predicción era correcta!' : ' La predicción era ' + pred + '.');
    }
    box.appendChild(tabs);
    box.appendChild(h('div', { class: 'pj-two' }, [
      h('div', { class: 'pj-col' }, [nota, prog]),
      h('div', { class: 'pj-col' }, [pregEl, h('div', { class: 'pj-row' }, [inp, btn('Paso a paso', paso, 'go'), btn('Todo seguido', function () { while (k < pasos.length) paso(); })]), txt, tabla, pens])]));
    abre(0);
    return null;
  }

  // --- 4. La mascota virtual (6º S2, MakeCode): el estado de un programa
  var ICO = { contenta: CARA.contenta, triste: CARA.triste, graciosa: '#...#' + '.....' + '#####' + '...##' + '...##' };
  function modoMascota(box, ed0, txt) {
    var ed = ED.makecode, hambre = 5, pant = h('div', { class: 'vr-pant' }), cajas = h('div', { class: 'vr-cajas' }), prog = h('div', { class: 'rp-prog' });
    prog.innerHTML =
      c(MK.inp, [['al presionarse el botón ' + v('A'), c(MK.log, [[ed.si(r(MK.log, r(MK.var, 'hambre') + ' &gt; ' + v(0))), b(MK.var, ed.chg('hambre', v(-1))), 'A1']]) + b(MK.bas, 'mostrar ícono ' + leds(ICO.contenta).replace('rp-leds', 'rp-leds sm')), 'A']]) +
      c(MK.inp, [['al presionarse el botón ' + v('B'), b(MK.bas, 'mostrar número ' + r(MK.var, 'hambre')), 'B']]) +
      c(MK.inp, [['si ' + v('agitar'), b(MK.bas, 'mostrar ícono ' + leds(ICO.graciosa).replace('rp-leds', 'rp-leds sm')) + b(MK.var, ed.chg('hambre', v(1))), 'S']]) +
      c(MK.bas, [['para siempre', b(MK.bas, 'pausa (ms) ' + v(10000)) + b(MK.var, ed.chg('hambre', v(1))) + c(MK.log, [[ed.si(r(MK.log, r(MK.var, 'hambre') + ' &gt; ' + v(8))), b(MK.bas, 'mostrar ícono ' + leds(ICO.triste).replace('rp-leds', 'rp-leds sm')), 'T1']]), 'T']]);
    function luz(ids) { prog.querySelectorAll('[data-r]').forEach(function (e) { e.classList.toggle('on', ids.indexOf(e.getAttribute('data-r')) >= 0); }); }
    function pinta(muestra, cual) { cajas.innerHTML = caja('hambre', hambre, cual || ''); if (muestra !== undefined) pant.innerHTML = muestra; }
    function ev(id) {
      var ids = [id], m;
      if (id === 'A') { if (hambre > 0) { hambre--; ids.push('A1'); } m = leds(ICO.contenta); setStatus(txt, '', hambre === 0 && ids.length === 1 ? 'Hambre ya vale 0: el «si hambre > 0» no deja bajar más. Solo pone la cara contenta.' : 'Come: hambre baja 1 y pone la cara contenta.'); pinta(m, ids.length > 1 ? ' resta' : ''); }
      else if (id === 'B') { m = '<p class="vr-num">' + hambre + '</p>'; setStatus(txt, '', 'Enseña cuánta hambre tiene: lo que guarda la variable.'); pinta(m); }
      else if (id === 'S') { hambre++; m = leds(ICO.graciosa); setStatus(txt, '', 'Juega: pone la cara graciosa y le entra más hambre.'); pinta(m, ' suma'); }
      else { hambre++; if (hambre > 8) { ids.push('T1'); m = leds(ICO.triste); } setStatus(txt, hambre > 8 ? 'bad' : '', 'Pasan 10 segundos: hambre sube 1.' + (hambre > 8 ? ' Ahora es mayor que 8: cara triste.' : '')); pinta(m, ' suma'); }
      luz(ids);
    }
    box.appendChild(h('div', { class: 'pj-two' }, [
      h('div', { class: 'pj-col' }, [h('h4', { text: 'La placa' }), pant, cajas,
        h('div', { class: 'pj-row' }, [btn('Botón A (comer)', function () { ev('A'); }, 'go'), btn('Botón B (¿cómo está?)', function () { ev('B'); }), btn('Agitar (jugar)', function () { ev('S'); }), btn('Pasan 10 segundos', function () { ev('T'); })]),
        txt, btn('Empezar otra vez (hambre 5)', function () { hambre = 5; pinta(leds('.........................')); luz([]); setStatus(txt, '', ''); })]),
      h('div', { class: 'pj-col' }, [h('h4', { text: 'El programa (MakeCode)' }), prog])]));
    pinta(leds('.........................'));
    return { q: '¿Para qué sirve el «si hambre &gt; 0» del botón A?', a: 'Para que hambre <b>no baje de 0</b>. Sin él, dándole de comer muchas veces llegaría a −1, −2…, y no tiene sentido tener «menos que nada» de hambre.' };
  }

  var VMODOS = [['', 'La caja', modoCaja], ['juego', 'Juego de cálculo', modoJuego], ['traza', '¿Cuánto vale al final?', modoTraza], ['mascota', 'La mascota (MakeCode)', modoMascota]];
  function toolVariables(root) {
    var modo = '', ed = 'scratch', zona = h('div', { class: 'pj-mode' }), edRow = h('div', { class: 'pj-row vr-ed' });
    root.appendChild(edRow); root.appendChild(zona);
    function pinta() {
      edRow.innerHTML = '';
      if (modo !== 'mascota') {
        edRow.appendChild(h('span', { class: 'pj-info', text: 'Bloques de:' }));
        ['scratch', 'makecode'].forEach(function (e) { edRow.appendChild(btn(ED[e].nom, function () { ed = e; pinta(); }, ed === e ? 'go' : '')); });
      }
      zona.innerHTML = '';
      var txt = h('p', { class: 'pj-status' }), m = VMODOS.filter(function (x) { return x[0] === modo; })[0] || VMODOS[0];
      var pq = m[2](zona, ED[ed], txt);
      if (pq) pensar(zona, pq.q, pq.a);
      zona.appendChild(h('p', { class: 'pj-info', text: 'Una variable es una caja con nombre. El nombre no cambia; lo que guarda, sí.' }));
    }
    return { load: function (p) { modo = VMODOS.some(function (x) { return x[0] === p; }) ? p : ''; if (modo === 'mascota') ed = 'makecode'; pinta(); } };
  }
  window.Proyectables.register('variables', toolVariables);

  /* ================================================================ Coordenadas del escenario (herramienta completa, con cuatro modos) */
  // El escenario de Scratch: x de −240 a 240, y de −180 a 180, el (0, 0) en el centro. En SVG la y va hacia abajo: se dibuja en −y.
  function sg(n) { return n < 0 ? '−' + (-n) : String(n); }
  function escenario(extra) {
    var s = '<rect x="-240" y="-180" width="480" height="360" fill="#fbfcfe" stroke="#9aa6b8" stroke-width="2"/>';
    for (var gx = -200; gx <= 200; gx += 50) s += '<line x1="' + gx + '" y1="-180" x2="' + gx + '" y2="180" stroke="' + (gx % 100 ? '#e6eaf0' : '#cdd5e0') + '" stroke-width="1"/>';
    for (var gy = -150; gy <= 150; gy += 50) s += '<line x1="-240" y1="' + gy + '" x2="240" y2="' + gy + '" stroke="' + (gy % 100 ? '#e6eaf0' : '#cdd5e0') + '" stroke-width="1"/>';
    s += '<line x1="-240" y1="0" x2="240" y2="0" stroke="#1a1d24" stroke-width="2"/><line x1="0" y1="-180" x2="0" y2="180" stroke="#1a1d24" stroke-width="2"/>';
    var T = ' font-size="12" font-weight="700" fill="#1a1d24" stroke="#fbfcfe" stroke-width="4" paint-order="stroke"';
    for (var k = -200; k <= 200; k += 100) if (k) s += '<text x="' + k + '" y="15"' + T + ' text-anchor="middle">' + sg(k) + '</text>';
    for (var j = -100; j <= 100; j += 100) if (j) s += '<text x="-5" y="' + (-j + 4) + '"' + T + ' text-anchor="end">' + sg(j) + '</text>';
    s += '<text x="-5" y="15"' + T + ' text-anchor="end">0</text>';
    s += '<text x="236" y="-6"' + T + ' text-anchor="end" font-style="italic">x</text><text x="6" y="-166"' + T + ' font-style="italic">y</text>';
    // los límites del escenario, fuera del rectángulo para que no se pisen con los números de los ejes
    var L = ' font-size="12" font-weight="700" fill="#5f677a"';
    s += '<text x="246" y="4"' + L + '>240</text><text x="-246" y="4"' + L + ' text-anchor="end">−240</text>';
    s += '<text x="0" y="-186"' + L + ' text-anchor="middle">180</text><text x="0" y="196"' + L + ' text-anchor="middle">−180</text>';
    return s + (extra || '');
  }
  function gato(x, y) {
    var src = window.PICTO && window.PICTO.gato;
    return (src ? '<image href="' + src + '" x="' + (x - 24) + '" y="' + (-y - 24) + '" width="48" height="48"/>' : '') + '<circle cx="' + x + '" cy="' + (-y) + '" r="4" fill="#cf3f36"/>';
  }
  function svgEscenario() {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '-284 -200 568 402'); svg.setAttribute('class', 'co-stage');
    return svg;
  }
  function puntoDe(svg, e) {
    var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    var p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return [Math.max(-240, Math.min(240, Math.round(p.x))), Math.max(-180, Math.min(180, Math.round(-p.y)))];
  }
  function lectura() { return h('div', { class: 'co-read' }); }
  function pintaLectura(el, x, y, tit) { el.innerHTML = (tit ? '<span>' + tit + '</span>' : '') + '<b>x:</b> <i>' + sg(x) + '</i> <b>y:</b> <i>' + sg(y) + '</i>'; }

  // --- 1. Explorar
  function coExplorar(box, txt) {
    var x = 0, y = 0, svg = svgEscenario(), rGato = lectura(), rPunt = lectura();
    function pinta() { svg.innerHTML = escenario(gato(x, y)); pintaLectura(rGato, x, y, 'El gato'); }
    svg.addEventListener('pointermove', function (e) { var p = puntoDe(svg, e); pintaLectura(rPunt, p[0], p[1], 'El dedo'); });
    svg.addEventListener('click', function (e) {
      var p = puntoDe(svg, e); x = Math.round(p[0] / 10) * 10; y = Math.round(p[1] / 10) * 10; pinta();
      setStatus(txt, '', (x < 0 ? 'La x es negativa: está a la izquierda del centro. ' : x > 0 ? 'La x es positiva: a la derecha. ' : 'La x es 0: en la línea del centro. ') +
        (y < 0 ? 'La y es negativa: por debajo.' : y > 0 ? 'La y es positiva: por encima.' : 'La y es 0: en la línea del centro.'));
    });
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [svg]), h('div', { class: 'pj-col' }, [rGato, rPunt,
      h('p', { class: 'pj-info', text: 'Pasad el dedo por el escenario: abajo se ve la x y la y de cada punto, como en Scratch. Al tocar, el gato va ahí.' }), txt,
      btn('Al centro (0, 0)', function () { x = 0; y = 0; pinta(); setStatus(txt, '', 'El centro del escenario es el punto (0, 0).'); })])]));
    pintaLectura(rPunt, 0, 0, 'El dedo'); pinta();
    return { q: '¿En qué esquina está el punto (240, 180)? ¿Y (−240, −180)?', a: '(240, 180): <b>arriba a la derecha</b>, el punto más alejado del centro hacia ese lado. (−240, −180): <b>abajo a la izquierda</b>.' };
  }

  // --- 2. Con bloques
  var CO_RETOS = [
    { t: 'Reto 1', ini: [0, 0], prog: [['cx', 100], ['cy', 50]] },
    { t: 'Reto 2', ini: [-100, 50], prog: [['rep', 3, [['cx', 30]]]] },
    { t: 'Reto 3', ini: [50, -20], prog: [['cy', -100], ['cx', -150]] },
    { t: 'Reto 4', ini: [120, 80], prog: [['sx', 0], ['cy', -80]] },
    { t: 'Reto 5', ini: [0, 0], prog: [['go', -200, 100], ['cx', 50], ['cy', -50]] }
  ];
  function coTxt(ins) {
    return ins[0] === 'go' ? 'ir a x: ' + v(sg(ins[1])) + ' y: ' + v(sg(ins[2])) : ins[0] === 'cx' ? 'sumar a x ' + v(sg(ins[1])) : ins[0] === 'cy' ? 'sumar a y ' + v(sg(ins[1])) :
      ins[0] === 'sx' ? 'dar a x el valor ' + v(sg(ins[1])) : 'dar a y el valor ' + v(sg(ins[1]));
  }
  function coAplica(ins, p) {
    var x = p[0], y = p[1];
    if (ins[0] === 'go') { x = ins[1]; y = ins[2]; } else if (ins[0] === 'cx') x += ins[1]; else if (ins[0] === 'cy') y += ins[1]; else if (ins[0] === 'sx') x = ins[1]; else y = ins[1];
    return [Math.max(-240, Math.min(240, x)), Math.max(-180, Math.min(180, y))];
  }
  function coBloques(box, txt) {
    var pos = [0, 0], rastro = [[0, 0]], svg = svgEscenario(), rd = lectura(), panel = h('div', { class: 'co-panel' }), tabs = h('div', { class: 'pj-row' }), timer = null;
    function pinta() {
      var tr = rastro.length > 1 ? '<polyline points="' + rastro.map(function (p) { return p[0] + ',' + (-p[1]); }).join(' ') + '" fill="none" stroke="#df7619" stroke-width="3" stroke-dasharray="6 5"/>' : '';
      svg.innerHTML = escenario(tr + gato(pos[0], pos[1])); pintaLectura(rd, pos[0], pos[1], 'El gato');
    }
    function libre() {
      panel.innerHTML = '';
      var filas = [['go', 'ir a x:', 'y:', -100, 50], ['cx', 'sumar a x', null, 30], ['cy', 'sumar a y', null, -20], ['sx', 'dar a x el valor', null, 0], ['sy', 'dar a y el valor', null, 0]];
      filas.forEach(function (f) {
        var i1 = h('input', { type: 'number', value: f[3], class: 'vr-in', 'aria-label': 'número' }), i2 = f[2] ? h('input', { type: 'number', value: f[4], class: 'vr-in', 'aria-label': 'número' }) : null;
        var bk = h('div', { class: 'rp-b', style: 'background:' + SC.mov }, [f[1] + ' ', i1].concat(i2 ? [' ' + f[2] + ' ', i2] : []));
        panel.appendChild(h('div', { class: 'vr-blq' }, [bk, btn('Ejecutar', function () {
          var ins = f[0] === 'go' ? ['go', Number(i1.value) || 0, Number(i2.value) || 0] : [f[0], Number(i1.value) || 0];
          var antes = pos; pos = coAplica(ins, pos); rastro.push(pos); pinta();
          setStatus(txt, 'good'); txt.innerHTML = 'Estaba en (' + sg(antes[0]) + ', ' + sg(antes[1]) + ') y ahora está en <b>(' + sg(pos[0]) + ', ' + sg(pos[1]) + ')</b>.' +
            (ins[0] === 'cx' || ins[0] === 'cy' ? ' «Sumar» parte de donde estaba.' : ins[0] === 'go' ? ' «Ir a» no mira dónde estaba.' : ' «Dar el valor» cambia solo esa coordenada.');
        }, 'go')]));
      });
      panel.appendChild(btn('Borrar el rastro y volver al centro', function () { pos = [0, 0]; rastro = [[0, 0]]; pinta(); setStatus(txt, '', ''); }));
    }
    function reto(R) {
      clearInterval(timer);
      panel.innerHTML = ''; pos = R.ini.slice(); rastro = [pos.slice()]; pinta();
      var lista = '';
      R.prog.forEach(function (ins) { lista += ins[0] === 'rep' ? c(SC.control, [['repetir ' + v(ins[1]), ins[2].map(function (x) { return b(SC.mov, coTxt(x)); }).join(''), -1]]) : b(SC.mov, coTxt(ins)); });
      var px = h('input', { type: 'number', class: 'vr-in co-pred', 'aria-label': 'x que predecís' }), py = h('input', { type: 'number', class: 'vr-in co-pred', 'aria-label': 'y que predecís' });
      panel.appendChild(h('p', { class: 'pj-info', html: 'El gato empieza en <b>(' + sg(R.ini[0]) + ', ' + sg(R.ini[1]) + ')</b>. ¿Dónde acaba?' }));
      panel.appendChild(h('div', { class: 'rp-prog', html: lista }));
      panel.appendChild(h('div', { class: 'pj-row' }, ['Predicción: x ', px, ' y ', py, btn('Ejecutar el programa', function () {
        var pasos = [];
        R.prog.forEach(function (ins) { if (ins[0] === 'rep') { for (var k = 0; k < ins[1]; k++) ins[2].forEach(function (x) { pasos.push(x); }); } else pasos.push(ins); });
        pos = R.ini.slice(); rastro = [pos.slice()]; pinta();
        var i = 0;
        timer = setInterval(function () {
          if (i >= pasos.length) {
            clearInterval(timer);
            var ok = px.value !== '' && py.value !== '' && Number(px.value) === pos[0] && Number(py.value) === pos[1];
            setStatus(txt, px.value === '' ? 'good' : ok ? 'good' : 'bad');
            txt.innerHTML = 'Acaba en <b>(' + sg(pos[0]) + ', ' + sg(pos[1]) + ')</b>.' + (px.value === '' ? '' : ok ? ' ¡La predicción era correcta!' : ' La predicción era (' + sg(Number(px.value)) + ', ' + sg(Number(py.value)) + ').');
            return;
          }
          pos = coAplica(pasos[i++], pos); rastro.push(pos); pinta();
        }, document.documentElement.classList.contains('pj-still') ? 1 : 600);
      }, 'go')]));
    }
    tabs.appendChild(btn('Probar bloques', function () { marca(0); libre(); }));
    CO_RETOS.forEach(function (R, k) { tabs.appendChild(btn(R.t, function () { marca(k + 1); reto(R); })); });
    function marca(k) { Array.prototype.forEach.call(tabs.children, function (b0, j) { b0.classList.toggle('go', j === k); }); setStatus(txt, '', ''); }
    box.appendChild(tabs);
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [svg, rd]), h('div', { class: 'pj-col' }, [h('h4', { text: 'Bloques de Scratch' }), panel, txt])]));
    marca(0); libre(); pinta();
    return { q: 'El gato está en (−100, 50). Ejecuto «sumar a x 30» tres veces. ¿Dónde acaba?', a: 'En <b>(−10, 50)</b>: −100 + 30 + 30 + 30 = −10. La y no cambia. Cuidado con los negativos: −100 + 30 es −70, no −130.' };
  }

  // --- 3. ¿Dónde está? Leer las coordenadas de un punto, o colocar un punto
  function coDonde(box, txt) {
    var modo = 'leer', obj = null, toque = null, svg = svgEscenario(), ix = h('input', { type: 'number', class: 'vr-in co-pred', 'aria-label': 'x' }), iy = h('input', { type: 'number', class: 'vr-in co-pred', 'aria-label': 'y' });
    var zona = h('div', { class: 'co-panel' }), tabs = h('div', { class: 'pj-row' }), TOL = 15;
    function estrella(x, y, col) { var p = []; for (var k = 0; k < 10; k++) { var a = Math.PI / 5 * k - Math.PI / 2, rr = k % 2 ? 6 : 14; p.push((x + rr * Math.cos(a)).toFixed(1) + ',' + (-y + rr * Math.sin(a)).toFixed(1)); } return '<polygon points="' + p.join(' ') + '" fill="' + col + '" stroke="#1a1d24" stroke-width="1.5"/>'; }
    function pinta(reveal) {
      var s = '';
      if (modo === 'leer' && obj) s += estrella(obj[0], obj[1], '#f5c518');
      if (modo === 'colocar' && toque) s += '<circle cx="' + toque[0] + '" cy="' + (-toque[1]) + '" r="7" fill="#2c5bbf"/>';
      if (reveal && obj) s += (modo === 'colocar' ? estrella(obj[0], obj[1], '#f5c518') : '') + '<line x1="' + obj[0] + '" y1="0" x2="' + obj[0] + '" y2="' + (-obj[1]) + '" stroke="#df7619" stroke-width="2" stroke-dasharray="5 4"/><line x1="0" y1="' + (-obj[1]) + '" x2="' + obj[0] + '" y2="' + (-obj[1]) + '" stroke="#df7619" stroke-width="2" stroke-dasharray="5 4"/>';
      svg.innerHTML = escenario(s);
    }
    function nuevo() {
      obj = [(rnd(23) - 11) * 20, (rnd(17) - 8) * 20]; toque = null; ix.value = ''; iy.value = '';
      setStatus(txt, '', modo === 'leer' ? '¿En qué punto está la estrella? Escribid su x y su y.' : 'Tocad el punto (' + sg(obj[0]) + ', ' + sg(obj[1]) + ').'); pinta();
    }
    function compara(p) {
      var dx = p[0] - obj[0], dy = p[1] - obj[1], ok = Math.abs(dx) <= TOL && Math.abs(dy) <= TOL;
      setStatus(txt, ok ? 'good' : 'bad');
      txt.innerHTML = (ok ? '¡Bien! ' : '') + 'La estrella está en <b>(' + sg(obj[0]) + ', ' + sg(obj[1]) + ')</b>.' +
        (ok ? '' : ' En la x, ' + (dx ? 'os habéis ido ' + Math.abs(dx) + (dx > 0 ? ' a la derecha' : ' a la izquierda') : 'justo') + '; en la y, ' + (dy ? Math.abs(dy) + (dy > 0 ? ' hacia arriba' : ' hacia abajo') : 'justo') + '.');
      pinta(true);
    }
    svg.addEventListener('click', function (e) { if (modo !== 'colocar' || !obj) return; toque = puntoDe(svg, e); compara(toque); });
    function abre(m) {
      modo = m; zona.innerHTML = '';
      Array.prototype.forEach.call(tabs.children, function (b0, j) { b0.classList.toggle('go', (j === 0) === (m === 'leer')); });
      if (m === 'leer') zona.appendChild(h('div', { class: 'pj-row' }, ['x ', ix, ' y ', iy, btn('Comprobar', function () { if (ix.value === '' || iy.value === '') { setStatus(txt, '', 'Escribid la x y la y.'); return; } compara([Number(ix.value), Number(iy.value)]); }, 'go')]));
      zona.appendChild(btn(m === 'leer' ? 'Otra estrella' : 'Otro punto', nuevo));
      zona.appendChild(h('p', { class: 'pj-info', text: 'Se da por bueno si os quedáis a 15 pasos o menos en cada coordenada.' }));
      nuevo();
    }
    tabs.appendChild(btn('Leer: ¿dónde está la estrella?', function () { abre('leer'); }));
    tabs.appendChild(btn('Colocar: tocad el punto', function () { abre('colocar'); }));
    box.appendChild(tabs);
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [svg]), h('div', { class: 'pj-col' }, [zona, txt])]));
    abre('leer');
    return { q: '¿Cómo se lee un punto sin equivocarse?', a: 'Primero se baja (o se sube) <b>hasta el eje x</b> y se lee la x; después se va <b>hasta el eje y</b> y se lee la y. Primero la x, después la y. Las líneas naranjas de la solución hacen ese camino.' };
  }

  // --- 4. Dibujar uniendo puntos con «ir a» y el lápiz
  var CO_DIB = [
    { t: 'Cuadrado', pts: [[-100, -100], [100, -100], [100, 100], [-100, 100], [-100, -100]], hueco: [3], txt: 'Un cuadrado de 200 pasos de lado, con el centro en el (0, 0). Falta una esquina.' },
    { t: 'Rectángulo', pts: [[-150, -50], [150, -50], [150, 50], [-150, 50], [-150, -50]], hueco: [2], txt: 'Un rectángulo de 300 de ancho y 100 de alto, con el centro en el (0, 0). Falta una esquina.' },
    { t: 'Casa', pts: [[-80, -100], [80, -100], [80, 40], [0, 120], [-80, 40], [-80, -100]], hueco: [3], txt: 'Una casa: la pared es un cuadrado de 160 de lado y el tejado acaba en punta, 80 más arriba que la pared. Falta la punta del tejado.' },
    { t: 'Con bicho', pts: [[-120, -80], [120, -80], [120, 80], [-120, 80], [-120, -80]], mal: [2, [120, 60]], txt: 'Un rectángulo de 240 × 160 con el centro en el (0, 0). Hay una esquina mal: ¿cuál? Arreglad su número.' }
  ];
  function coDibujar(box, txt) {
    var svg = svgEscenario(), panel = h('div', { class: 'co-panel' }), tabs = h('div', { class: 'pj-row' }), timer = null;
    function abre(D, k) {
      clearInterval(timer);
      Array.prototype.forEach.call(tabs.children, function (b0, j) { b0.classList.toggle('go', j === k); });
      panel.innerHTML = ''; svg.innerHTML = escenario();
      setStatus(txt, '', '');
      panel.appendChild(h('p', { class: 'pj-info', text: D.txt }));
      var ins = [], prog = h('div', { class: 'rp-prog' });
      D.pts.forEach(function (p, i) {
        var vis = D.mal && D.mal[0] === i ? D.mal[1] : p, hueco = D.hueco && D.hueco.indexOf(i) >= 0, edit = hueco || D.mal;
        var ix = h('input', { type: 'number', class: 'vr-in', value: hueco ? '' : vis[0], 'aria-label': 'x del punto ' + (i + 1) }), iy = h('input', { type: 'number', class: 'vr-in', value: hueco ? '' : vis[1], 'aria-label': 'y del punto ' + (i + 1) });
        if (!edit) { ix.disabled = true; iy.disabled = true; }
        ins.push([ix, iy]);
        prog.appendChild(h('div', { class: 'rp-b' + (hueco ? ' co-hueco' : ''), style: 'background:' + SC.mov }, ['ir a x: ', ix, ' y: ', iy]));
        if (i === 0) prog.appendChild(h('div', { class: 'rp-b', style: 'background:' + SC.pen, text: 'bajar lápiz' }));
      });
      prog.insertBefore(h('div', { class: 'rp-b', style: 'background:' + SC.pen, text: 'borrar todo' }), prog.firstChild);
      panel.appendChild(prog);
      panel.appendChild(h('div', { class: 'pj-row' }, [btn('Dibujar', function () {
        var pts = ins.map(function (q) { return [Number(q[0].value), Number(q[1].value)]; });
        if (ins.some(function (q) { return q[0].value === '' || q[1].value === ''; })) { setStatus(txt, '', 'Faltan números por escribir.'); return; }
        var i = 1, linea = [pts[0]];
        clearInterval(timer);
        timer = setInterval(function () {
          linea.push(pts[i]);
          svg.innerHTML = escenario('<polyline points="' + linea.map(function (p) { return p[0] + ',' + (-p[1]); }).join(' ') + '" fill="none" stroke="#0FBD8C" stroke-width="5" stroke-linejoin="round"/>' +
            linea.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + (-p[1]) + '" r="5" fill="#1a1d24"/>'; }).join(''));
          if (++i >= pts.length) {
            clearInterval(timer);
            var ok = pts.every(function (p, k) { return p[0] === D.pts[k][0] && p[1] === D.pts[k][1]; });
            setStatus(txt, ok ? 'good' : 'bad');
            txt.innerHTML = ok ? '¡Correcto! Es ' + (D.t === 'Casa' ? 'la casa' : 'el ' + D.t.toLowerCase().replace('con bicho', 'rectángulo')) + '.' :
              'No sale bien. Mirad qué esquina no está donde tiene que estar: ¿qué coordenada falla, la x o la y?';
          }
        }, document.documentElement.classList.contains('pj-still') ? 1 : 450);
      }, 'go'), btn('Ver la solución', function () {
        ins.forEach(function (q, k) { q[0].value = D.pts[k][0]; q[1].value = D.pts[k][1]; });
        setStatus(txt, 'good', 'Estos son los puntos correctos. Pulsad «Dibujar».');
      })]));
    }
    CO_DIB.forEach(function (D, k) { tabs.appendChild(btn(D.t, function () { abre(D, k); })); });
    box.appendChild(tabs);
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [svg]), h('div', { class: 'pj-col' }, [panel, txt])]));
    abre(CO_DIB[0], 0);
    return { q: 'En un cuadrado con el centro en el (0, 0), ¿qué tienen en común las cuatro esquinas?', a: 'Los mismos números con distinto signo: (100, 100), (−100, 100), (−100, −100) y (100, −100). Cambia si está a la izquierda o a la derecha y arriba o abajo.' };
  }

  var CO_MODOS = [['', 'Explorar', coExplorar], ['bloques', 'Con bloques', coBloques], ['donde', '¿Dónde está?', coDonde], ['dibujar', 'Dibujar con «ir a»', coDibujar]];
  function toolCoordenadas(root) {
    var zona = h('div', { class: 'pj-mode' });
    root.appendChild(zona);
    return { load: function (p) {
      var m = CO_MODOS.filter(function (x) { return x[0] === p; })[0] || CO_MODOS[0], txt = h('p', { class: 'pj-status' });
      zona.innerHTML = '';
      var pq = m[2](zona, txt);
      if (pq) pensar(zona, pq.q, pq.a);
    } };
  }
  window.Proyectables.register('coordenadas', toolCoordenadas);

  window.PJRepaso = { semaforo: repasoSi, bucles: repasoBucles, cuadricula: repasoRobot, clasificador: repasoClasificador, patrones: repasoPatrones, secuencias: repasoSecuencias };
  // para comprobarlo desde fuera (pruebas)
  window.PJRepaso._prueba = { ejecuta: ejecuta, RETOS: RETOS, SEQ: SEQ };
})();
