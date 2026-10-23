/* Herramienta «Eventos» (versión 1.7): qué programa se pone en marcha con cada evento.
   - En Scratch: Robi y la estrella con varios programas. La bandera, las teclas y el clic ponen en marcha los que empiezan
     con ese evento, a la vez si son varios, también en objetos distintos. Un bloque suelto no empieza nunca.
   - En la micro:bit: al iniciar, los botones A y B y agitar la placa, con el programa de MakeCode y la pantalla de luces.
   - ¿Cuáles empiezan?: un evento y varios programas; la clase elige los que se ponen en marcha y se comprueba. */
(function () {
  'use strict';
  var P = window.PJH, h = P.h, btn = P.btn, rnd = P.rnd, shuffle = P.shuffle, setStatus = P.setStatus, burst = P.burst, N = window.PJNuevas;
  var porModos = N.porModos, pensar = N.pensar, selector = N.selector;
  function quieto() { return document.documentElement.classList.contains('pj-still'); }
  function lista(xs) { return xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1]; }

  var SC = { eve: '#FFBF00', mov: '#4C97FF', looks: '#9966FF', control: '#FFAB19', sens: '#5CB1D6' };
  var MK = { bas: '#1E90FF', inp: '#D400D4', mat: '#9400D3', led: '#7600A8' };
  var BANDERA = '<svg class="ev-flag" viewBox="0 0 16 16" aria-label="bandera verde"><path d="M3.2 1.6v12.8" stroke="#3d8a37" stroke-width="1.7" stroke-linecap="round"/><path d="M4 2.6c2.1-1.2 3.9.8 6 0 1-.4 1.9-.7 2.8-.5v6.4c-.9-.2-1.8.1-2.8.5-2.1.8-3.9-1.2-6 0z" fill="#4cbf56" stroke="#3d8a37" stroke-width=".9"/></svg>';
  function val(x) { return '<span class="rp-v">' + x + '</span>'; }
  function blq(col, html, cls) { return '<div class="rp-b' + (cls ? ' ' + cls : '') + '" style="background:' + col + '">' + html + '</div>'; }
  // Las luces de la micro:bit (5 × 5): iconos de MakeCode y cifras
  var LED = {
    corazon: '.#.#.##########.###...#..', si: '.........#...#.#.#...#...', no: '#...#.#.#...#...#.#.#...#', feliz: '.....##.##.....#...#.###.',
    1: '..#...##....#....#...###.', 2: '###.....#..##..#....####.', 3: '####....#...#..#..#..##..', 4: '..##..#.#.#..#.####....#.', 5: '####.#....###.....####...', 6: '...#...#...###.#...#.###.'
  };
  function icoMini(k) {  // el icono dentro del bloque «mostrar ícono»
    var s = '';
    for (var i = 0; i < 25; i++) if (LED[k].charAt(i) === '#') s += '<rect x="' + (1 + (i % 5) * 4) + '" y="' + (1 + Math.floor(i / 5) * 4) + '" width="3.2" height="3.2" fill="#fff"/>';
    return '<span class="ev-ico"><svg viewBox="0 0 21 21" aria-label="icono">' + s + '</svg> ▾</span>';
  }

  /* ================================================================ 1. En Scratch */
  var EV_SC = {
    bandera: { boton: BANDERA + ' Bandera verde', dice: 'Hacemos clic en la bandera verde', hat: 'al hacer clic en ' + BANDERA },
    espacio: { boton: 'Tecla espacio', dice: 'Pulsamos la tecla espacio', hat: 'al presionar tecla ' + val('espacio ▾') },
    derecha: { boton: 'Flecha derecha →', dice: 'Pulsamos la flecha derecha', hat: 'al presionar tecla ' + val('flecha derecha ▾') },
    clic: { boton: 'Clic en Robi', dice: 'Hacemos clic en Robi', hat: 'al hacer clic en este objeto' }
  };
  // [objeto, evento (null: bloques sueltos), nombre para el resumen, bloques: [categoría, texto, acción]]
  var PROGS_SC = [
    ['Robi', 'bandera', 'Robi va a su sitio y saluda', [['mov', 'ir a x: ' + val(-150) + ' y: ' + val(-60), { ir: [-150, -60] }], ['looks', 'decir ' + val('¡Hola!') + ' durante ' + val(2) + ' segundos', { decir: '¡Hola!', s: 2 }]]],
    ['Robi', 'derecha', 'Robi avanza', [['mov', 'mover ' + val(40) + ' pasos', { mover: 40 }]]],
    ['Robi', 'espacio', 'Robi salta', [['mov', 'cambiar y en ' + val(60), { dy: 60 }], ['control', 'esperar ' + val(1) + ' segundos', { esperar: 1 }], ['mov', 'cambiar y en ' + val(-60), { dy: -60 }]]],
    ['Robi', 'clic', 'Robi se queja', [['looks', 'decir ' + val('¡Me has tocado!') + ' durante ' + val(1) + ' segundos', { decir: '¡Me has tocado!', s: 1 }]]],
    ['Robi', null, '', [['looks', 'decir ' + val('¿Cuándo me toca?'), { decir: '¿Cuándo me toca?', s: 1.5 }]]],
    ['Estrella', 'bandera', 'la estrella aparece', [['mov', 'ir a x: ' + val(140) + ' y: ' + val(90), { irE: [140, 90] }], ['looks', 'mostrar', { mostrar: 1 }]]],
    ['Estrella', 'espacio', 'la estrella gira', [['mov', 'girar ↻ ' + val(45) + ' grados', { girar: 45 }]]]
  ];
  function evScratch(box) {
    var st, cards = [], pred = {}, timers = [], corriendo = 0, txt = h('p', { class: 'pj-status' }), escena = h('div', { class: 'ev-escena' });
    function vivo() { return escena.isConnected; }
    function espera(fn, ms) { timers.push(setTimeout(function () { if (vivo()) fn(); }, ms)); }
    function inicial() { st = { rx: 0, ry: -60, rDice: '', ex: 140, ey: 90, eDir: 0, eVis: false, eDice: '' }; }
    function star(x, y, r) { var pt = []; for (var k = 0; k < 10; k++) { var a = Math.PI / 5 * k - Math.PI / 2, rr = k % 2 ? r * .45 : r; pt.push((x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1)); } return pt.join(' '); }
    function bocadillo(x, y, t) { var w = t.length * 10.5 + 26; return '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 0h' + w + 'a12 12 0 0 1 12 12v14a12 12 0 0 1-12 12H26l-14 12 2-12H0a12 12 0 0 1-12-12V12A12 12 0 0 1 0 0z" fill="#fff" stroke="#1a1d24" stroke-width="2.2"/><text x="' + (w / 2) + '" y="25" text-anchor="middle" font-size="17" font-weight="700" fill="#1a1d24">' + t + '</text></g>'; }
    function pinta() {
      var X = function (x) { return 240 + x; }, Y = function (y) { return 180 - y; };
      var s = '<rect width="480" height="360" fill="#d8ecfb"/><circle cx="410" cy="60" r="26" fill="#fff4c2"/><path d="M0 290Q120 262 240 288T480 282V360H0z" fill="#9ed97c"/><path d="M0 312Q160 296 300 316T480 306V360H0z" fill="#8fcf6e"/>';
      if (st.eVis) s += '<polygon points="' + star(X(st.ex), Y(st.ey), 28) + '" transform="rotate(' + st.eDir + ' ' + X(st.ex) + ' ' + Y(st.ey) + ')" fill="#f5c518" stroke="#b8860b" stroke-width="3" stroke-linejoin="round"/>';
      s += '<g class="ev-robi" transform="translate(' + X(st.rx) + ' ' + Y(st.ry) + ') scale(1.25) translate(-30 -30)">' + P.ROBOT_BODY + '</g>';
      if (st.rDice) s += bocadillo(X(st.rx) + 30, Y(st.ry) - 92, st.rDice);
      escena.innerHTML = '<svg viewBox="0 0 480 360" role="img" aria-label="Escenario: Robi' + (st.eVis ? ' y la estrella' : '') + (st.rDice ? '. Robi dice: ' + st.rDice : '') + '">' + s + '</svg>';
      var r = escena.querySelector('.ev-robi');
      r.addEventListener('click', function () { dispara('clic'); });
    }
    function haz(a) {
      if (a.ir) { st.rx = a.ir[0]; st.ry = a.ir[1]; }
      else if (a.irE) { st.ex = a.irE[0]; st.ey = a.irE[1]; }
      else if (a.mover) st.rx = Math.min(200, st.rx + a.mover);
      else if (a.dy) st.ry += a.dy;
      else if (a.girar) st.eDir += a.girar;
      else if (a.mostrar) st.eVis = true;
      else if (a.decir) { st.rDice = a.decir; var t = a.decir; espera(function () { if (st.rDice === t) { st.rDice = ''; pinta(); } }, a.s * 1000); }
      pinta();
      return a.esperar ? a.esperar * 1000 : a.decir ? a.s * 1000 : 650;
    }
    // ejecuta un programa: el bloque que se está haciendo, iluminado
    function ejecuta(c, fin) {
      c.el.classList.add('on');
      var i = 0;
      (function paso() {
        c.bloques.forEach(function (b) { b.classList.remove('paso'); });
        if (i >= c.p[3].length) { c.el.classList.remove('on'); fin(); return; }
        c.bloques[i].classList.add('paso');
        var ms = haz(c.p[3][i][2]);
        i++;
        espera(paso, ms);
      })();
    }
    var eventos = h('div', { class: 'pj-row ev-eventos' });
    var botones = {};
    Object.keys(EV_SC).forEach(function (k) { botones[k] = btn(EV_SC[k].boton, function () { dispara(k); }, 'go'); eventos.appendChild(botones[k]); });
    function dispara(ev) {
      if (corriendo) return;
      var van = cards.filter(function (c) { return c.p[1] === ev; }), hubo = Object.keys(pred).length > 0, ok = 0;
      cards.forEach(function (c, i) {
        c.el.classList.remove('va', 'no-va', 'pred-ok', 'pred-mal');
        c.el.classList.add(c.p[1] === ev ? 'va' : 'no-va');
        if (hubo) { var acierta = !!pred[i] === (c.p[1] === ev); c.el.classList.add(acierta ? 'pred-ok' : 'pred-mal'); if (acierta) ok++; }
      });
      corriendo = van.length;
      Object.keys(botones).forEach(function (k) { botones[k].disabled = true; });
      var nombres = van.map(function (c) { return c.p[2]; });
      setStatus(txt, 'good', EV_SC[ev].dice + ': ' + (van.length === 1 ? 'se pone en marcha 1 programa: ' + nombres[0] + '.' : 'se ponen en marcha ' + van.length + ' programas a la vez: ' + lista(nombres) + '.') +
        (hubo ? ' Habéis acertado ' + ok + ' de ' + cards.length + '.' : ''));
      van.forEach(function (c) { ejecuta(c, function () { corriendo--; if (!corriendo) { Object.keys(botones).forEach(function (k) { botones[k].disabled = false; }); pred = {}; cards.forEach(function (c2) { c2.creo.setAttribute('aria-pressed', 'false'); c2.creo.textContent = '¿Empieza?'; c2.el.classList.remove('va', 'no-va'); }); } }); });
    }
    var cols = h('div', { class: 'ev-objs' });
    ['Robi', 'Estrella'].forEach(function (obj) {
      var col = h('div', { class: 'ev-obj' }, [h('h2', { text: obj === 'Robi' ? 'Programas de Robi' : 'Programas de la estrella' })]);
      PROGS_SC.forEach(function (p, i) {
        if (p[0] !== obj) return;
        var html = (p[1] ? blq(SC.eve, EV_SC[p[1]].hat, 'hat ev-hat') : '') + p[3].map(function (b) { return blq(SC[b[0]], b[1]); }).join('');
        var creo = h('button', { type: 'button', class: 'ms-creo', 'aria-pressed': 'false', text: '¿Empieza?' });
        creo.addEventListener('click', function () { pred[i] = !pred[i]; if (!pred[i]) delete pred[i]; creo.setAttribute('aria-pressed', String(!!pred[i])); creo.textContent = pred[i] ? 'Creemos que sí' : '¿Empieza?'; });
        var el = h('div', { class: 'ev-prog' + (p[1] ? '' : ' suelto') }, [h('div', { class: 'ev-pila', html: html }), p[1] ? creo : h('span', { class: 'ev-nota', text: 'Sin evento' })]);
        var c = { p: p, el: el, creo: creo, bloques: Array.prototype.slice.call(el.querySelectorAll('.rp-b:not(.hat)')) };
        cards.push(c);
        col.appendChild(el);
      });
      cols.appendChild(col);
    });
    function reinicia() { timers.forEach(clearTimeout); timers = []; corriendo = 0; pred = {}; inicial(); pinta(); setStatus(txt, '', 'Tocad «¿Empieza?» en los programas que creéis que se pondrán en marcha y después elegid un evento.');
      cards.forEach(function (c) { c.el.classList.remove('on', 'va', 'no-va', 'pred-ok', 'pred-mal'); c.creo.setAttribute('aria-pressed', 'false'); c.creo.textContent = '¿Empieza?'; c.bloques.forEach(function (b) { b.classList.remove('paso'); }); });
      Object.keys(botones).forEach(function (k) { botones[k].disabled = false; }); }
    // con el teclado del aula: espacio y flecha derecha, como en Scratch
    function tecla(e) {
      if (!vivo()) { document.removeEventListener('keydown', tecla); return; }
      if (!escena.offsetParent || e.ctrlKey || e.altKey || e.metaKey) return;
      var a = document.activeElement, enLibre = !a || a === document.body || (a.closest && a.closest('.ev-eventos'));
      if (e.key === 'ArrowRight') { e.preventDefault(); dispara('derecha'); }
      else if (e.key === ' ' && enLibre) { e.preventDefault(); dispara('espacio'); }
    }
    document.addEventListener('keydown', tecla);
    box.appendChild(eventos);
    box.appendChild(h('div', { class: 'pj-two ev-two' }, [h('div', { class: 'pj-col' }, [escena, txt, h('div', { class: 'pj-row' }, [btn('Empezar otra vez', reinicia)]),
      h('p', { class: 'pj-info', text: 'También se puede pulsar la tecla espacio o la flecha derecha del teclado, o hacer clic en Robi.' })]), h('div', { class: 'pj-col' }, [cols])]));
    reinicia();
    return { q: 'Robi tiene un programa sin evento: «decir ¿Cuándo me toca?». ¿Cuándo se pone en marcha?',
      a: '<b>Nunca</b>, mientras se juega: ningún evento lo pone en marcha. En Scratch solo funciona si se hace clic encima del bloque, y eso no lo hace quien juega. Es un bicho frecuente: el programa está bien, pero le falta el evento de arriba.' };
  }

  /* ================================================================ 2. En la micro:bit */
  var EV_MB = {
    iniciar: { boton: 'Encender la placa', dice: 'Encendemos la placa', head: 'al iniciar', col: MK.bas },
    A: { boton: 'Botón A', dice: 'Pulsamos el botón A', head: 'al presionarse el botón ' + val('A ▾'), col: MK.inp },
    B: { boton: 'Botón B', dice: 'Pulsamos el botón B', head: 'al presionarse el botón ' + val('B ▾'), col: MK.inp },
    agitar: { boton: 'Agitar la placa', dice: 'Agitamos la placa', head: 'al ' + val('agitar ▾'), col: MK.inp }
  };
  var PROGS_MB = [
    ['iniciar', 'el corazón de «al iniciar»', [[MK.bas, 'mostrar ícono ' + icoMini('corazon'), { led: 'corazon' }]]],
    ['A', 'el «sí» del botón A', [[MK.bas, 'mostrar ícono ' + icoMini('si'), { led: 'si' }]]],
    ['B', 'el «no» del botón B', [[MK.bas, 'mostrar ícono ' + icoMini('no'), { led: 'no' }]]],
    ['agitar', 'el dado', [[MK.bas, 'mostrar número <span class="rp-r" style="background:' + MK.mat + '">escoger al azar de ' + val(1) + ' a ' + val(6) + '</span>', { dado: 1 }]]],
    [null, '', [[MK.bas, 'mostrar cadena ' + val('"Hola"'), {}]]]
  ];
  function placaGrande(pat, pulsa) {
    var s = '<rect x="4" y="4" width="312" height="240" rx="26" fill="#23262e" stroke="#0f1115" stroke-width="3"/>' +
      '<ellipse cx="160" cy="34" rx="22" ry="11" fill="none" stroke="#d4a940" stroke-width="3"/><circle cx="153" cy="34" r="3" fill="#d4a940"/><circle cx="167" cy="34" r="3" fill="#d4a940"/>';
    for (var i = 0; i < 25; i++) {
      var on = pat && pat.charAt(i) === '#', x = 108 + (i % 5) * 24, y = 62 + Math.floor(i / 5) * 24;
      if (on) s += '<rect x="' + (x - 5) + '" y="' + (y - 5) + '" width="20" height="26" rx="6" fill="#ff4136" opacity=".3"/>';
      s += '<rect x="' + x + '" y="' + y + '" width="10" height="16" rx="2.5" fill="' + (on ? '#ff4136' : '#4b4f5a') + '"/>';
    }
    [['A', 50], ['B', 270]].forEach(function (b) {
      s += '<g class="ev-mbbtn" data-b="' + b[0] + '"><rect x="' + (b[1] - 26) + '" y="104" width="52" height="52" rx="8" fill="#c3c8d2"/><circle cx="' + b[1] + '" cy="130" r="' + (pulsa === b[0] ? 13 : 17) + '" fill="' + (pulsa === b[0] ? '#5d6474' : '#1a1d24') + '"/>' +
        '<text x="' + b[1] + '" y="90" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">' + b[0] + '</text></g>';
    });
    s += '<path d="M4 200H316V218Q316 244 290 244H30Q4 244 4 218Z" fill="#d4a940"/>';
    [[34, '0'], [92, '1'], [150, '2'], [212, '3V'], [278, 'GND']].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="214" r="8" fill="#23262e"/><text x="' + p[0] + '" y="236" text-anchor="middle" font-size="12" font-weight="800" fill="#23262e">' + p[1] + '</text>'; });
    return s;
  }
  function evMicrobit(box) {
    var pat = null, pulsa = null, cards = [], pred = {}, timers = [], txt = h('p', { class: 'pj-status' }), placa = h('div', { class: 'ev-placa' });
    function vivo() { return placa.isConnected; }
    function espera(fn, ms) { timers.push(setTimeout(function () { if (vivo()) fn(); }, ms)); }
    function pinta() {
      placa.innerHTML = '<svg viewBox="0 0 320 248" role="img" aria-label="La micro:bit: ' + (pat ? 'la pantalla está encendida' : 'la pantalla está apagada') + '">' + placaGrande(pat, pulsa) + '</svg>';
      Array.prototype.forEach.call(placa.querySelectorAll('.ev-mbbtn'), function (g) { g.addEventListener('click', function () { dispara(g.getAttribute('data-b')); }); });
    }
    var eventos = h('div', { class: 'pj-row ev-eventos' }), botones = {};
    Object.keys(EV_MB).forEach(function (k) { botones[k] = btn(EV_MB[k].boton, function () { dispara(k); }, 'go'); eventos.appendChild(botones[k]); });
    function dispara(ev) {
      var c = cards.filter(function (x) { return x.p[0] === ev; })[0], hubo = Object.keys(pred).length > 0, ok = 0;
      timers.forEach(clearTimeout); timers = [];
      cards.forEach(function (x, i) {
        x.el.classList.remove('va', 'no-va', 'pred-ok', 'pred-mal', 'on');
        x.el.classList.add(x === c ? 'va' : 'no-va');
        if (hubo) { var acierta = !!pred[i] === (x === c); x.el.classList.add(acierta ? 'pred-ok' : 'pred-mal'); if (acierta) ok++; }
      });
      if (ev === 'iniciar') pat = null;
      pulsa = ev === 'A' || ev === 'B' ? ev : null;
      placa.classList.remove('agita'); if (ev === 'agitar' && !quieto()) { void placa.offsetWidth; placa.classList.add('agita'); }
      pinta();
      var a = c.p[2][0][2], dado = 0;
      espera(function () {
        pulsa = null; c.el.classList.add('on');
        if (a.led) pat = LED[a.led]; else if (a.dado) { dado = 1 + rnd(6); pat = LED[dado]; }
        pinta();
        espera(function () { c.el.classList.remove('on'); }, 900);
      }, quieto() ? 0 : 350);
      setStatus(txt, 'good', EV_MB[ev].dice + ': se pone en marcha ' + c.p[1] + '. Los demás programas esperan a su evento; el bloque suelto no empieza nunca.' + (hubo ? ' Habéis acertado ' + ok + ' de ' + cards.length + '.' : ''));
      pred = {}; cards.forEach(function (x) { x.creo.setAttribute('aria-pressed', 'false'); x.creo.textContent = '¿Empieza?'; });
    }
    var progs = h('div', { class: 'ev-mk' });
    PROGS_MB.forEach(function (p, i) {
      var inner = p[2].map(function (b) { return blq(b[0], b[1]); }).join('');
      var html = p[0] ? '<div class="rp-c" style="--bc:' + EV_MB[p[0]].col + '"><div class="rp-ch">' + EV_MB[p[0]].head + '</div><div class="rp-cin">' + inner + '</div><div class="rp-cf"></div></div>' : inner;
      var creo = h('button', { type: 'button', class: 'ms-creo', 'aria-pressed': 'false', text: '¿Empieza?' });
      creo.addEventListener('click', function () { pred[i] = !pred[i]; if (!pred[i]) delete pred[i]; creo.setAttribute('aria-pressed', String(!!pred[i])); creo.textContent = pred[i] ? 'Creemos que sí' : '¿Empieza?'; });
      var el = h('div', { class: 'ev-prog' + (p[0] ? '' : ' suelto') }, [h('div', { class: 'ev-pila', html: html }), p[0] ? creo : h('span', { class: 'ev-nota', text: 'Suelto: MakeCode lo pone en gris' })]);
      cards.push({ p: p, el: el, creo: creo });
      progs.appendChild(el);
    });
    function tecla(e) {
      if (!vivo()) { document.removeEventListener('keydown', tecla); return; }
      if (!placa.offsetParent || e.ctrlKey || e.altKey || e.metaKey) return;
      var a = document.activeElement;
      if (a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) return;
      var k = (e.key || '').toLowerCase();
      if (k === 'a' || k === 'b') { e.preventDefault(); dispara(k.toUpperCase()); }
    }
    document.addEventListener('keydown', tecla);
    box.appendChild(eventos);
    box.appendChild(h('div', { class: 'pj-two ev-two' }, [h('div', { class: 'pj-col center' }, [placa, txt, h('p', { class: 'pj-info', text: 'También se pueden tocar los botones A y B de la placa dibujada, o pulsar las teclas A y B del teclado.' })]),
      h('div', { class: 'pj-col' }, [h('h2', { text: 'El programa (MakeCode)' }), progs])]));
    pinta();
    setStatus(txt, '', 'Tocad «¿Empieza?» en los programas que creéis que se pondrán en marcha y después elegid un evento.');
    return { q: 'En la micro:bit, ¿por qué el bloque «mostrar cadena "Hola"» no sale nunca en la pantalla?',
      a: 'Porque no está dentro de ningún evento: nadie lo pone en marcha. MakeCode lo deja en <b>gris</b> para avisar. Hay que meterlo dentro de «al iniciar», de un botón o de «al agitar».' };
  }

  /* ================================================================ 3. ¿Cuáles empiezan? */
  // Scratch: [objeto, evento, bloque]. Eventos: bandera, espacio, derecha, arriba, a, clic, recibir, null (suelto)
  var HAT_SC = { bandera: 'al hacer clic en ' + BANDERA, espacio: 'al presionar tecla ' + val('espacio ▾'), derecha: 'al presionar tecla ' + val('flecha derecha ▾'),
    arriba: 'al presionar tecla ' + val('flecha arriba ▾'), a: 'al presionar tecla ' + val('a ▾'), clic: 'al hacer clic en este objeto', recibir: 'al recibir ' + val('empezar ▾') };
  var CUERPOS = { Robi: [['mov', 'mover ' + val(10) + ' pasos'], ['looks', 'decir ' + val('¡Hola!')], ['looks', 'cambiar disfraz a ' + val('robi-b ▾')], ['mov', 'girar ↻ ' + val(15) + ' grados'], ['mov', 'cambiar y en ' + val(20)]],
    Estrella: [['mov', 'girar ↻ ' + val(45) + ' grados'], ['looks', 'mostrar'], ['looks', 'esconder'], ['looks', 'cambiar tamaño en ' + val(10)], ['mov', 'ir a ' + val('posición aleatoria ▾')]] };
  var RONDA_SC = [{ ev: 'bandera', dice: EV_SC.bandera.dice }, { ev: 'espacio', dice: EV_SC.espacio.dice }, { ev: 'derecha', dice: EV_SC.derecha.dice },
    { ev: 'clic', obj: 'Robi', dice: 'Hacemos clic en Robi' }, { ev: 'clic', obj: 'Estrella', dice: 'Hacemos clic en la estrella' }];
  function porQueSc(c, R) {
    if (c.ev === R.ev && (c.ev !== 'clic' || c.obj === R.obj)) return 'Empieza con ese evento: se pone en marcha.';
    if (c.ev === null) return 'No tiene evento: no empieza nunca (en Scratch, solo si se hace clic encima del bloque).';
    if (c.ev === 'recibir') return 'Espera el mensaje «empezar», y nadie lo ha enviado.';
    if (c.ev === 'clic') return R.ev === 'clic' ? 'Es de ' + (c.obj === 'Robi' ? 'Robi' : 'la estrella') + ': solo empieza si se hace clic en ' + (c.obj === 'Robi' ? 'Robi.' : 'la estrella.') : 'Espera a que se haga clic en ' + (c.obj === 'Robi' ? 'Robi.' : 'la estrella.');
    if (c.ev === 'bandera') return 'Empieza con la bandera verde.';
    return 'Empieza con otra tecla: ' + { espacio: 'espacio', derecha: 'flecha derecha', arriba: 'flecha arriba', a: 'la letra a' }[c.ev] + '.';
  }
  function generaSc() {
    var R = RONDA_SC[rnd(RONDA_SC.length)], cards = [], usados = {};
    function libres(obj) { return CUERPOS[obj].filter(function (b) { return !usados[obj + b[1]]; }); }
    function nueva(obj, ev) {
      if (!libres(obj).length) obj = obj === 'Robi' ? 'Estrella' : 'Robi';  // si a un objeto no le quedan bloques distintos
      var cs = libres(obj), b = cs[rnd(cs.length)]; usados[obj + b[1]] = 1; cards.push({ obj: obj, ev: ev, b: b });
    }
    var n = R.ev === 'clic' ? 1 + rnd(2) : 1 + rnd(3);   // cuántos se ponen en marcha (1 a 3; con el clic, en el mismo objeto)
    for (var k = 0; k < n; k++) nueva(R.ev === 'clic' ? R.obj : (k % 2 ? 'Estrella' : 'Robi'), R.ev);
    var trampas = shuffle(R.ev === 'clic' ? [['clic', R.obj === 'Robi' ? 'Estrella' : 'Robi'], ['bandera'], [null], ['espacio'], ['recibir']] :
      R.ev === 'bandera' ? [['clic'], [null], ['espacio'], ['recibir'], ['a']] : [['bandera'], [R.ev === 'espacio' ? 'arriba' : 'espacio'], [null], ['clic'], ['a'], [R.ev === 'derecha' ? 'arriba' : 'derecha']]);
    while (cards.length < 6) { var t = trampas.shift(); nueva(t[1] || (rnd(2) ? 'Robi' : 'Estrella'), t[0]); }
    cards = shuffle(cards);
    cards.forEach(function (c) { c.va = c.ev === R.ev && (R.ev !== 'clic' || c.obj === R.obj); c.porque = porQueSc(c, R); });
    return { R: R, cards: cards };
  }
  function htmlSc(c) { return '<span class="ev-de">' + (c.obj === 'Robi' ? 'Robi' : 'Estrella') + '</span>' + (c.ev ? blq(SC.eve, HAT_SC[c.ev], 'hat ev-hat') : '') + blq(SC[c.b[0]], c.b[1]); }
  // MakeCode: cada evento, un solo programa (MakeCode no deja repetir el mismo evento)
  var HAT_MB = { iniciar: ['al iniciar', MK.bas], siempre: ['para siempre', MK.bas], A: ['al presionarse el botón ' + val('A ▾'), MK.inp], B: ['al presionarse el botón ' + val('B ▾'), MK.inp],
    AB: ['al presionarse el botón ' + val('A+B ▾'), MK.inp], agitar: ['al ' + val('agitar ▾'), MK.inp] };
  var CUERPOS_MB = ['mostrar ícono ' + icoMini('corazon'), 'mostrar ícono ' + icoMini('feliz'), 'mostrar ícono ' + icoMini('si'), 'mostrar ícono ' + icoMini('no'), 'mostrar número ' + val(7), 'mostrar cadena ' + val('"Hola"'), 'borrar la pantalla'];
  var RONDA_MB = [{ ev: 'iniciar', dice: 'Encendemos la placa' }, { ev: 'A', dice: 'Pulsamos solo el botón A' }, { ev: 'B', dice: 'Pulsamos solo el botón B' }, { ev: 'agitar', dice: 'Agitamos la placa' }];
  function porQueMb(c, R) {
    if (c.va) return c.ev === 'siempre' ? 'Empieza al encender la placa, justo después de «al iniciar», y ya no para.' : 'Empieza con ese evento: se pone en marcha.';
    if (c.ev === null) return 'Está suelto, fuera de todo evento: MakeCode lo pone en gris y no se ejecuta nunca.';
    if (c.ev === 'siempre') return 'Ya estaba en marcha desde que se encendió la placa: este evento no lo pone en marcha.';
    if (c.ev === 'iniciar') return 'Solo empieza al encender o reiniciar la placa.';
    if (c.ev === 'AB') return 'Hay que pulsar A y B a la vez.';
    return 'Espera a otro evento: ' + { A: 'el botón A', B: 'el botón B', agitar: 'agitar la placa' }[c.ev] + '.';
  }
  function generaMb() {
    var R = RONDA_MB[rnd(RONDA_MB.length)], cuerpos = shuffle(CUERPOS_MB);
    var evs = shuffle(['iniciar', 'siempre', 'A', 'B', 'AB', 'agitar'].filter(function (e) { return e !== R.ev; })).slice(0, 4);
    if (R.ev === 'iniciar' && evs.indexOf('siempre') < 0) evs[0] = 'siempre';
    var cards = [R.ev].concat(evs).map(function (e, i) { return { ev: e, b: cuerpos[i] }; });
    cards.push({ ev: null, b: cuerpos[5] });
    cards = shuffle(cards);
    cards.forEach(function (c) { c.va = c.ev === R.ev || (R.ev === 'iniciar' && c.ev === 'siempre'); c.porque = porQueMb(c, R); });
    return { R: R, cards: cards };
  }
  function htmlMb(c) {
    var inner = blq(MK.bas, c.b);
    return c.ev ? '<div class="rp-c" style="--bc:' + HAT_MB[c.ev][1] + '"><div class="rp-ch">' + HAT_MB[c.ev][0] + '</div><div class="rp-cin">' + inner + '</div><div class="rp-cf"></div></div>' : inner;
  }
  function evReto(box) {
    var editor = 'scratch', ronda = 0, bien = 0, TOTAL = 6, G = null, hecho = false;
    var enun = h('div', { class: 'ev-carta' }), grid = h('div', { class: 'ev-retos' }), txt = h('p', { class: 'pj-status' }), cuenta = h('p', { class: 'pj-info' });
    var bOk = btn('Comprobar', comprobar, 'go'), bSig = btn('Siguiente', siguiente, 'go');
    function nuevo() {
      hecho = false; bSig.hidden = true; bOk.hidden = false;
      G = editor === 'scratch' ? generaSc() : generaMb();
      enun.innerHTML = '<span class="ev-carta-pre">Evento</span><b>' + G.R.dice + '</b>';
      grid.innerHTML = '';
      grid.classList.toggle('mk', editor !== 'scratch');
      G.cards.forEach(function (c) {
        var b = h('button', { type: 'button', class: 'ev-reto' + (c.ev ? '' : ' suelto'), 'aria-pressed': 'false', html: '<span class="ev-pila">' + (editor === 'scratch' ? htmlSc(c) : htmlMb(c)) + '</span><span class="ev-porque"></span>' });
        b.addEventListener('click', function () { if (hecho) return; c.sel = !c.sel; b.setAttribute('aria-pressed', String(c.sel)); });
        c.btn = b; grid.appendChild(b);
      });
      cuenta.textContent = 'Ronda ' + (ronda + 1) + ' de ' + TOTAL + ' · aciertos: ' + bien;
      setStatus(txt, '', 'Tocad los programas que se ponen en marcha con este evento (puede haber más de uno) y pulsad «Comprobar».');
    }
    function comprobar() {
      if (hecho) return;
      hecho = true; bOk.hidden = true;
      var mal = 0;
      G.cards.forEach(function (c) {
        var cls = c.va && c.sel ? 'ok' : c.va ? 'falta' : c.sel ? 'mal' : 'nada';
        if (cls === 'falta' || cls === 'mal') mal++;
        c.btn.classList.add(cls);
        c.btn.querySelector('.ev-porque').textContent = (cls === 'ok' ? 'Sí. ' : cls === 'falta' ? 'Este también. ' : cls === 'mal' ? 'No. ' : '') + c.porque;
      });
      ronda++; if (!mal) bien++;
      var n = G.cards.filter(function (c) { return c.va; }).length;
      setStatus(txt, mal ? 'bad' : 'good', (mal ? 'Casi. ' : '¡Muy bien! ') + (n === 1 ? 'Se pone en marcha 1 programa.' : 'Se ponen en marcha ' + n + ' programas, a la vez.') + (mal ? ' Mirad la explicación debajo de cada uno.' : ''));
      if (!mal) burst(enun);
      cuenta.textContent = 'Ronda ' + ronda + ' de ' + TOTAL + ' · aciertos: ' + bien;
      if (ronda < TOTAL) { bSig.hidden = false; bSig.innerHTML = 'Siguiente'; }
      else { bSig.hidden = false; bSig.innerHTML = 'Otra partida'; setStatus(txt, bien >= TOTAL - 1 ? 'good' : '', bien + ' de ' + TOTAL + ' rondas sin fallos. ' + (bien === TOTAL ? '¡Perfecto!' : 'Otra partida, a por más.')); }
    }
    function siguiente() { if (ronda >= TOTAL) { ronda = 0; bien = 0; } nuevo(); }
    var tabs = selector([['scratch', 'Scratch'], ['makecode', 'MakeCode']], editor, function (v) { editor = v; ronda = 0; bien = 0; nuevo(); });
    box.appendChild(tabs);
    box.appendChild(enun);
    box.appendChild(grid);
    box.appendChild(h('div', { class: 'pj-row' }, [bOk, bSig]));
    box.appendChild(txt);
    box.appendChild(cuenta);
    nuevo();
    return { q: '¿Puede un programa empezar sin un evento arriba?',
      a: '<b>No.</b> Todo programa empieza con un evento: la bandera, una tecla, un clic, un mensaje, un botón, al iniciar… Sin evento, nadie lo pone en marcha. Y un mismo evento puede poner en marcha <b>varios programas a la vez</b>, también en objetos distintos.' };
  }

  window.Proyectables.register('eventos', porModos([['', evScratch], ['microbit', evMicrobit], ['reto', evReto]]));
})();
