/* Proyectables para la pizarra digital. Cada herramienta se monta en su página (#p-<id>) y admite un reto precargado (#p-<id>.<reto>). */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function btn(label, fn, cls) { return h('button', { type: 'button', class: 'pj-btn ' + (cls || ''), onclick: fn, html: label }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rnd(n) { return Math.floor(Math.random() * n); }

  var COL = { F: '#2c5bbf', R: '#2a8f4f', L: '#df7619', B: '#6c44b0', U: '#2c5bbf', D: '#2c5bbf', E: '#2c5bbf', W: '#2c5bbf' };
  var NAME = { F: 'Avanza', R: 'Gira a la derecha', L: 'Gira a la izquierda', B: 'Retrocede', U: 'Arriba', D: 'Abajo', E: 'Derecha', W: 'Izquierda' };
  function arrowSVG(k) {
    var s = 100, bg = '<rect x="2" y="2" width="96" height="96" rx="14" fill="' + COL[k] + '"/>', g;
    var st = ' stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    var rot = { U: 0, E: 90, D: 180, W: 270 };
    if (k === 'F' || k in rot) g = '<g transform="rotate(' + (rot[k] || 0) + ' 50 50)"><path d="M50 80V24M30 43L50 22L70 43"' + st + '/></g>';
    else if (k === 'B') g = '<path d="M50 20V76M30 57L50 78L70 57"' + st + '/>';
    else if (k === 'R') g = '<path d="M25 54A25 25 0 1 1 75 54"' + st + '/><path d="M62 48L75 61L87 48"' + st + '/>';
    else g = '<path d="M75 54A25 25 0 1 0 25 54"' + st + '/><path d="M38 48L25 61L13 48"' + st + '/>';
    return '<svg viewBox="0 0 ' + s + ' ' + s + '" class="pj-arrow">' + bg + g + '</svg>';
  }
  function pic(name, cls) { var src = window.PICTO && window.PICTO[name]; return src ? '<img class="pic' + (cls ? ' ' + cls : '') + '" src="' + src + '" alt="" draggable="false">' : ''; }
  function credit() { return h('p', { class: 'pj-credit', text: window.PICTO_CREDITO || '' }); }
  function svgPic(name, x, y, s) { var src = window.PICTO && window.PICTO[name]; return src ? '<image href="' + src + '" x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '"/>' : ''; }
  var BURST = function (x, y) { return '<g transform="translate(' + x + ' ' + y + ')"><polygon points="0,-22 6,-8 21,-12 11,0 22,11 6,8 0,22 -6,8 -21,12 -11,0 -22,-11 -6,-8" fill="#ffd84a" stroke="#cf3f36" stroke-width="3"/></g>'; };
  function robotSVG(dir) {
    var rot = { N: 0, E: 90, S: 180, O: 270 }[dir];
    return '<g transform="rotate(' + rot + ' 30 30)">' + ROBOT_BODY + '</g>';
  }
  // Robi visto desde arriba: ruedas, cuerpo, ojos y la «nariz» amarilla que señala hacia dónde mira.
  var ROBOT_BODY =
    '<ellipse cx="30" cy="54" rx="19" ry="4" fill="rgba(0,0,0,.18)"/>' +
    '<rect x="6" y="18" width="8" height="24" rx="3" fill="#1a1d24"/><rect x="46" y="18" width="8" height="24" rx="3" fill="#1a1d24"/>' +
    '<rect x="11" y="13" width="38" height="38" rx="11" fill="#2c5bbf" stroke="#1b3f8f" stroke-width="2.5"/>' +
    '<rect x="15" y="17" width="30" height="10" rx="5" fill="#ffffff" opacity=".18"/>' +
    '<path d="M22 13L30 1L38 13Z" fill="#f5c518" stroke="#b8860b" stroke-width="2" stroke-linejoin="round"/>' +
    '<g class="pj-eyes"><circle cx="23" cy="29" r="5.5" fill="#fff"/><circle cx="37" cy="29" r="5.5" fill="#fff"/>' +
    '<circle cx="23" cy="27.5" r="2.6" fill="#1a1d24"/><circle cx="37" cy="27.5" r="2.6" fill="#1a1d24"/></g>' +
    '<path d="M23 41Q30 46 37 41" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>';
  // ---- Efectos comunes a todas las herramientas (se desactivan con «Sin animaciones» o con «reducir movimiento»)
  var CONF_COLS = ['#cf3f36', '#2c5bbf', '#f5c518', '#2a8f4f', '#df7619', '#6c44b0'];
  function svgConfetti(cx, cy) {
    var s = '';
    for (var k = 0; k < 26; k++) {
      var a = Math.PI * 2 * k / 26, r = 55 + (k % 3) * 22;
      s += '<rect class="pj-conf" x="' + (cx - 4) + '" y="' + (cy - 4) + '" width="8" height="8" rx="2" fill="' + CONF_COLS[k % 6] + '" style="--dx:' + Math.round(Math.cos(a) * r) + 'px;--dy:' + Math.round(Math.sin(a) * r) + 'px;animation-delay:' + (k % 4) * 40 + 'ms"/>';
    }
    return s;
  }
  // confeti sobre cualquier elemento de la página
  function burst(el) {
    if (!el || document.documentElement.classList.contains('pj-still')) return;
    var r = el.getBoundingClientRect(), box = document.createElement('div');
    box.className = 'pj-burst'; box.style.left = (r.left + r.width / 2) + 'px'; box.style.top = (r.top + r.height / 2) + 'px';
    for (var k = 0; k < 30; k++) {
      var a = Math.PI * 2 * k / 30, d = 80 + (k % 4) * 35, i = document.createElement('i');
      i.style.background = CONF_COLS[k % 6]; i.style.setProperty('--dx', Math.round(Math.cos(a) * d) + 'px'); i.style.setProperty('--dy', Math.round(Math.sin(a) * d) + 'px');
      i.style.animationDelay = (k % 5) * 30 + 'ms'; box.appendChild(i);
    }
    document.body.appendChild(box); setTimeout(function () { box.remove(); }, 1500);
  }
  function setStatus(el, kind, text) { el.className = 'pj-status' + (kind ? ' pj-' + kind : ''); if (text != null) el.textContent = text; }
  // vuelve a lanzar una animación CSS aunque la clase ya estuviera puesta
  function replay(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  // Tablero «isla»: agua, borde de arena y casillas de hierba en damero.
  function islandSVG(n, c) {
    var W = n * c + 4, s = '<defs><pattern id="pjwave" width="40" height="16" patternUnits="userSpaceOnUse"><path d="M0 8Q10 2 20 8T40 8" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="2"/></pattern>' +
      '<radialGradient id="pjglow"><stop offset="0" stop-color="#ffe066" stop-opacity=".95"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient></defs>';
    s += '<rect x="-30" y="-30" width="' + (W + 60) + '" height="' + (W + 60) + '" fill="#4fa3d9"/><rect x="-30" y="-30" width="' + (W + 60) + '" height="' + (W + 60) + '" fill="url(#pjwave)"/>';
    s += '<rect x="-12" y="-12" width="' + (W + 24) + '" height="' + (W + 24) + '" rx="22" fill="#f2d39b" stroke="#d9b06a" stroke-width="3"/>';
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      s += '<rect data-x="' + i + '" data-y="' + j + '" x="' + (2 + i * c) + '" y="' + (2 + j * c) + '" width="' + c + '" height="' + c + '" rx="4" fill="' + ((i + j) % 2 ? '#8fcf6e' : '#9ed97c') + '" stroke="#6fb24f" stroke-width="1.5"/>';
    }
    return s;
  }

  /* ------------------------------------------------------------------ 1. Cuadrícula programable */
  var MAPS = {
    mapa1: { n: 5, start: [2, 4], dir: 'N', goal: [2, 1], rocks: [] },
    mapa2: { n: 5, start: [0, 4], dir: 'N', goal: [0, 1], rocks: [[1, 3]] },
    mapa3: { n: 5, start: [1, 4], dir: 'N', goal: [3, 2], rocks: [[1, 1]] },
    mapa4: { n: 5, start: [4, 4], dir: 'N', goal: [1, 1], rocks: [[4, 2], [2, 2]] },
    mapa5: { n: 5, start: [0, 4], dir: 'N', goal: [4, 0], rocks: [[1, 3], [2, 1], [3, 3]] },
    mapa6: { n: 5, start: [2, 4], dir: 'N', goal: [2, 0], rocks: [[2, 2], [1, 1], [3, 1]] },
    libre: { n: 5, start: [0, 4], dir: 'N', goal: [4, 0], rocks: [] },
    grande: { n: 7, start: [0, 6], dir: 'N', goal: [6, 0], rocks: [[2, 5], [2, 4], [4, 2], [5, 2], [3, 0]] },
    bicho1: { n: 5, start: [2, 4], dir: 'N', goal: [2, 1], rocks: [], prog: 'FFR' , info: 'Este programa tiene 1 bicho. Tócalo para cambiarlo.' },
    bicho2: { n: 5, start: [0, 4], dir: 'N', goal: [2, 2], rocks: [], prog: 'FFLFF', info: 'Este programa tiene 1 bicho. Tócalo para cambiarlo.' },
    bicho3: { n: 5, start: [4, 4], dir: 'N', goal: [2, 1], rocks: [[4, 1]], prog: 'FFRFFLF', info: 'Este programa tiene 2 bichos.' },
    bicho4: { n: 5, start: [0, 4], dir: 'N', goal: [3, 1], rocks: [[0, 1], [2, 3]], prog: 'FFRFRFRF', info: 'Este programa tiene 2 bichos.' },
    escalera: { n: 5, start: [0, 4], dir: 'N', goal: [3, 1], rocks: [], trail: true, info: 'Programa la escalera usando REPITE: avanza, gira, avanza, gira…' },
    cuadrado: { n: 6, start: [1, 4], dir: 'N', goal: null, rocks: [], trail: true, info: 'Dibuja un cuadrado de 3 casillas de lado. ¿Cuántas veces se repite «avanza 3, gira»?' },
    absoluto: { n: 5, start: [0, 4], dir: 'N', goal: [4, 0], rocks: [[2, 2], [3, 3]], mode: 'abs', info: 'Modo fácil: flechas de dirección (arriba, abajo, izquierda, derecha). El robot no gira.' }
  };
  var DIRS = ['N', 'E', 'S', 'O'], MV = { N: [0, -1], E: [1, 0], S: [0, 1], O: [-1, 0] }, ABSD = { U: 'N', E: 'E', D: 'S', W: 'O' };

  function toolGrid(root) {
    var st = {}, cur = null, timer = null;
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'pj-grid');
    var progEl = h('div', { class: 'pj-prog' });
    var info = h('p', { class: 'pj-info' });
    var status = h('p', { class: 'pj-status' });
    var editSel = h('select', { class: 'pj-sel', 'aria-label': 'Qué colocar al tocar una casilla' }, [
      h('option', { value: '', text: 'Tocar casilla: nada' }), h('option', { value: 'rock', text: 'Tocar casilla: poner o quitar roca' }),
      h('option', { value: 'goal', text: 'Tocar casilla: mover el tesoro' }), h('option', { value: 'start', text: 'Tocar casilla: mover robot' })]);
    var palette = h('div', { class: 'pj-palette' });
    function load(k) {
      var m = MAPS[k] || MAPS.libre;
      st = { n: m.n, start: m.start.slice(), dir: m.dir, goal: m.goal ? m.goal.slice() : null, rocks: m.rocks.map(function (r) { return r.slice(); }),
        trail: !!m.trail, mode: m.mode || 'rel', prog: [], open: null };
      if (m.prog) st.prog = m.prog.split('').map(function (c) { return { t: c }; });
      info.textContent = m.info || (st.goal ? 'Programa al robot para llegar al tesoro sin chocar con las rocas.' : 'Programa libre.');
      buildPalette(); reset(); renderProg();
    }
    function buildPalette() {
      palette.innerHTML = '';
      var keys = st.mode === 'abs' ? ['U', 'D', 'W', 'E'] : ['F', 'R', 'L'];
      keys.forEach(function (k) { palette.appendChild(h('button', { type: 'button', class: 'pj-card', title: NAME[k], onclick: function () { add({ t: k }); }, html: arrowSVG(k) + '<span>' + NAME[k] + '</span>' })); });
      [2, 3, 4].forEach(function (n) { palette.appendChild(h('button', { type: 'button', class: 'pj-card rep', onclick: function () { openRep(n); }, html: '<b>REPITE<br>×' + n + '</b><span>Las siguientes tarjetas van dentro</span>' })); });
      palette.appendChild(h('button', { type: 'button', class: 'pj-card close', onclick: function () { st.open = null; renderProg(); }, html: '<b>Cerrar<br>repite</b><span>Vuelve a la fila principal</span>' }));
    }
    function add(tok) { if (st.open) st.open.body.push(tok); else st.prog.push(tok); renderProg(); }
    function openRep(n) { var r = { t: 'rep', n: n, body: [] }; st.prog.push(r); st.open = r; renderProg(); }
    function cycle(tok) {
      var order = st.mode === 'abs' ? ['U', 'E', 'D', 'W'] : ['F', 'R', 'L'];
      tok.t = order[(order.indexOf(tok.t) + 1) % order.length]; renderProg();
    }
    function cardEl(tok, list, i) {
      if (tok.t === 'rep') {
        var box = h('div', { class: 'pj-repbox' + (st.open === tok ? ' open' : '') }, [h('div', { class: 'pj-rephead', html: 'REPITE ×' + tok.n })]);
        var inner = h('div', { class: 'pj-repin' });
        tok.body.forEach(function (t, j) { inner.appendChild(cardEl(t, tok.body, j)); });
        if (!tok.body.length) inner.appendChild(h('span', { class: 'pj-hint', text: 'pon aquí las tarjetas' }));
        box.appendChild(inner);
        box.appendChild(h('button', { type: 'button', class: 'pj-x', title: 'Quitar', onclick: function () { list.splice(i, 1); if (st.open === tok) st.open = null; renderProg(); }, text: '×' }));
        return box;
      }
      var c = h('div', { class: 'pj-mini' }, []);
      tok.el = c;
      c.innerHTML = arrowSVG(tok.t) + '<i>' + (i + 1) + '</i>';
      c.title = 'Tocar: cambiar la flecha';
      c.addEventListener('click', function () { cycle(tok); });
      c.appendChild(h('button', { type: 'button', class: 'pj-x', title: 'Quitar', onclick: function (e) { e.stopPropagation(); list.splice(i, 1); renderProg(); }, text: '×' }));
      return c;
    }
    // la secuencia que ejecuta el robot: cada elemento es la tarjeta (con su elemento en pantalla)
    function flat(list) { var out = []; list.forEach(function (t) { if (t.t === 'rep') for (var k = 0; k < t.n; k++) out = out.concat(flat(t.body)); else out.push(t); }); return out; }
    function mark(tok) {
      progEl.querySelectorAll('.pj-mini.now').forEach(function (e) { e.classList.remove('now'); });
      if (tok && tok.el) tok.el.classList.add('now');
    }
    function count(list) { return list.reduce(function (a, t) { return a + (t.t === 'rep' ? 1 + count(t.body) : 1); }, 0); }
    function renderProg() {
      progEl.innerHTML = '';
      if (!st.prog.length) progEl.appendChild(h('span', { class: 'pj-hint', text: 'Toca las tarjetas de la derecha para escribir el programa.' }));
      st.prog.forEach(function (t, i) { progEl.appendChild(cardEl(t, st.prog, i)); });
      var steps = flat(st.prog).length;
      status.textContent = 'Tarjetas: ' + count(st.prog) + ' · Pasos que hace el robot: ' + steps;
    }
    var ANG = { N: 0, E: 90, S: 180, O: 270 };
    function reset() {
      stop(); mark(null); status.className = 'pj-status';
      cur = { x: st.start[0], y: st.start[1], d: st.dir, ang: ANG[st.dir], path: [[st.start[0], st.start[1]]], i: 0, crash: false, done: false };
      draw(true);
    }
    function stepOnce(seq) {
      if (cur.i >= seq.length || cur.crash) return false;
      var tok = seq[cur.i++], c = tok.t;
      mark(tok);
      if (c === 'R') { cur.d = DIRS[(DIRS.indexOf(cur.d) + 1) % 4]; cur.ang += 90; }
      else if (c === 'L') { cur.d = DIRS[(DIRS.indexOf(cur.d) + 3) % 4]; cur.ang -= 90; }
      else {
        var d = c === 'F' ? cur.d : c === 'B' ? DIRS[(DIRS.indexOf(cur.d) + 2) % 4] : ABSD[c];
        if (st.mode === 'abs') { var delta = ((ANG[d] - cur.ang) % 360 + 540) % 360 - 180; cur.ang += delta; cur.d = d; }
        var nx = cur.x + MV[d][0], ny = cur.y + MV[d][1];
        if (nx < 0 || ny < 0 || nx >= st.n || ny >= st.n || st.rocks.some(function (r) { return r[0] === nx && r[1] === ny; })) { cur.crash = true; }
        else { cur.x = nx; cur.y = ny; cur.path.push([nx, ny]); }
      }
      draw(false); return true;
    }
    function run() {
      reset(); var seq = flat(st.prog);
      timer = setInterval(function () { if (!stepOnce(seq)) { stop(); finish(seq); } }, 650);
    }
    function step() { var seq = flat(st.prog); if (!stepOnce(seq)) finish(seq); else if (cur.i >= seq.length) finish(seq); }
    function finish() {
      mark(null);
      if (cur.crash) { status.className = 'pj-status pj-bad'; status.textContent = '¡Choque! Busca el bicho: ¿en qué tarjeta empieza a fallar?'; }
      else if (st.goal && cur.x === st.goal[0] && cur.y === st.goal[1]) {
        status.className = 'pj-status pj-good'; status.textContent = '¡Tesoro conseguido! Tarjetas usadas: ' + count(st.prog) + '. ¿Se puede hacer con menos?';
        celebrate();
      }
      else if (st.goal) { status.className = 'pj-status pj-bad'; status.textContent = 'El robot no ha llegado al tesoro. ¿Qué tarjeta falta o sobra?'; }
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    var C = 60, layers = null;
    function px(v) { return 2 + v * C; }
    // full = true redibuja el tablero; si no, solo se mueven el robot y el rastro (así el movimiento se anima)
    function draw(full) {
      var n = st.n, W = n * C + 4;
      if (full || !layers) {
        svg.setAttribute('viewBox', '-26 -26 ' + (W + 52) + ' ' + (W + 52));
        var s = islandSVG(n, C) + '<g class="pj-trail"></g>';
        st.rocks.forEach(function (r) { s += svgPic('piedra', px(r[0]) + 6, px(r[1]) + 6, C - 12); });
        if (st.goal) s += '<g class="pj-goal"><circle cx="' + (px(st.goal[0]) + C / 2) + '" cy="' + (px(st.goal[1]) + C / 2) + '" r="' + (C * 0.62) + '" fill="url(#pjglow)" class="pj-glow"/>' +
          '<g class="pj-chest">' + svgPic('tesoro', px(st.goal[0]) + 5, px(st.goal[1]) + 5, C - 10) + '</g></g>';
        s += '<g class="pj-bot"><g class="pj-bot-rot"><g class="pj-bot-body">' + ROBOT_BODY + '</g></g></g><g class="pj-fx"></g>';
        svg.innerHTML = s;
        layers = { trail: svg.querySelector('.pj-trail'), bot: svg.querySelector('.pj-bot'), rot: svg.querySelector('.pj-bot-rot'), fx: svg.querySelector('.pj-fx') };
        layers.bot.classList.add('no-anim'); layers.rot.classList.add('no-anim');
      }
      var pts = cur.path.map(function (p) { return (px(p[0]) + C / 2) + ',' + (px(p[1]) + C / 2); }).join(' ');
      layers.trail.innerHTML = cur.path.length > 1 ? (st.trail ?
        '<polyline points="' + pts + '" fill="none" stroke="#df7619" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' :
        '<polyline points="' + pts + '" fill="none" stroke="#ffffff" stroke-opacity=".9" stroke-width="5" stroke-dasharray="2 11" stroke-linecap="round"/>') : '';
      layers.bot.style.transform = 'translate(' + px(cur.x) + 'px,' + px(cur.y) + 'px)';
      layers.rot.style.transform = 'translate(30px,30px) rotate(' + cur.ang + 'deg) translate(-30px,-30px)';
      layers.fx.innerHTML = cur.crash ? BURST(px(cur.x) + C / 2, px(cur.y) + 10) : '';
      svg.querySelector('.pj-bot-body').classList.toggle('pj-shake', cur.crash);
      if (full) { void svg.getBoundingClientRect(); layers.bot.classList.remove('no-anim'); layers.rot.classList.remove('no-anim'); }
    }
    function celebrate() {
      layers.fx.innerHTML = svgConfetti(px(st.goal[0]) + C / 2, px(st.goal[1]) + C / 2);
      var chest = svg.querySelector('.pj-chest'); if (chest) { chest.classList.remove('pj-bounce'); void chest.getBoundingClientRect(); chest.classList.add('pj-bounce'); }
    }
    svg.addEventListener('click', function (e) {
      var t = e.target; if (!t.hasAttribute('data-x') || !editSel.value) return;
      var x = +t.getAttribute('data-x'), y = +t.getAttribute('data-y');
      if (editSel.value === 'rock') { var i = st.rocks.findIndex(function (r) { return r[0] === x && r[1] === y; }); if (i >= 0) st.rocks.splice(i, 1); else st.rocks.push([x, y]); }
      if (editSel.value === 'goal') st.goal = [x, y];
      if (editSel.value === 'start') st.start = [x, y];
      reset();
    });
    var trailChk = h('label', { class: 'pj-chk' }, [h('input', { type: 'checkbox', onchange: function (e) { st.trail = e.target.checked; draw(false); } }), ' Dibujar el rastro']);
    root.appendChild(h('div', { class: 'pj-two' }, [
      h('div', { class: 'pj-col' }, [svg, status]),
      h('div', { class: 'pj-col' }, [info, h('h2', { text: 'Tarjetas' }), palette,
        h('h2', { text: 'Programa' }), progEl,
        h('div', { class: 'pj-row' }, [btn('▶ Ejecutar', run, 'go'), btn('Paso a paso', step), btn('↺ Volver a la salida', reset), btn('Borrar programa', function () { st.prog = []; st.open = null; renderProg(); reset(); })]),
        h('div', { class: 'pj-row' }, [editSel, trailChk])])]));
    return { load: function (p) { load(p || 'mapa1'); } };
  }

  /* ------------------------------------------------------------------ 2. Patrones */
  var SH = { c: '<circle cx="30" cy="30" r="24"/>', s: '<rect x="8" y="8" width="44" height="44" rx="5"/>', t: '<path d="M30 5L55 52H5Z"/>', st: '<polygon points="30,4 37,22 56,22 41,34 46,53 30,42 14,53 19,34 4,22 23,22"/>' };
  var PC = { R: '#cf3f36', B: '#2c5bbf', Y: '#e8b000', G: '#2a8f4f', P: '#6c44b0' };
  var PATS = { ab: [['c', 'R'], ['s', 'B']], aab: [['c', 'R'], ['c', 'R'], ['t', 'Y']], abc: [['s', 'B'], ['t', 'Y'], ['c', 'G']], abb: [['st', 'P'], ['c', 'R'], ['c', 'R']], aabb: [['t', 'G'], ['t', 'G'], ['s', 'B'], ['s', 'B']], abcd: [['c', 'R'], ['s', 'B'], ['t', 'Y'], ['st', 'G']] };
  function shapeSVG(p) { return '<svg viewBox="0 0 60 60" fill="' + PC[p[1]] + '">' + SH[p[0]] + '</svg>'; }
  function toolPatterns(root) {
    var row = h('div', { class: 'pj-pattern' }), msg = h('p', { class: 'pj-status' }), mode = 'seguir', kind = 'ab';
    function draw() {
      row.innerHTML = ''; setStatus(msg, '', '');
      if (kind === 'crece') {
        for (var k = 1; k <= 5; k++) {
          var col = h('div', { class: 'pj-grow' + (k > 3 ? ' hidden-fig' : '') });
          for (var q = 0; q < k; q++) col.appendChild(h('span', { class: 'pj-sq' }));
          col.appendChild(h('small', { text: 'figura ' + k }));
          (function (c) { c.addEventListener('click', function () { if (c.classList.contains('hidden-fig')) { c.classList.remove('hidden-fig'); replay(c, 'pj-pop'); } }); })(col);
          row.appendChild(col);
        }
        msg.textContent = 'Toca las figuras 4 y 5 para descubrirlas. ¿Cuántos cuadrados tendrá la figura 10?';
        return;
      }
      var u = PATS[kind], total = 12, show = mode === 'bicho' ? 12 : 8, bug = mode === 'bicho' ? 4 + rnd(6) : -1;
      for (var i = 0; i < total; i++) {
        var p = u[i % u.length];
        if (i === bug) { var o = u.filter(function (x) { return x[0] !== p[0] || x[1] !== p[1]; }); p = o.length ? o[rnd(o.length)] : ['st', 'P']; }
        var cell = h('button', { type: 'button', class: 'pj-shape' + (i >= show ? ' hid' : ''), 'aria-label': 'Figura ' + (i + 1) + (i >= show ? ' (tapada)' : '') });
        cell.innerHTML = i >= show ? '<span>?</span>' : shapeSVG(p);
        (function (cell, p, i) {
          cell.addEventListener('click', function () {
            if (cell.classList.contains('hid')) { cell.classList.remove('hid'); cell.innerHTML = shapeSVG(p); replay(cell, 'pj-pop'); }
            else if (mode === 'bicho') {
              cell.classList.add(i === bug ? 'ok' : 'no');
              if (i === bug) { setStatus(msg, 'good', '¡Bicho encontrado! Esa figura rompe el patrón.'); replay(cell, 'pj-pop'); burst(cell); }
              else { setStatus(msg, 'bad', 'Esa no es. Mira la regla que se repite.'); replay(cell, 'pj-shakeel'); }
            }
          });
        })(cell, p, i);
        row.appendChild(cell);
      }
      msg.textContent = mode === 'bicho' ? 'Una figura rompe el patrón. Tócala.' : 'Toca las casillas con «?» para comprobar lo que viene después.';
    }
    root.appendChild(h('div', { class: 'pj-row' }, [btn('Otro', draw)]));
    root.appendChild(row); root.appendChild(msg);
    return { load: function (p) { if (p === 'bicho') { mode = 'bicho'; if (!PATS[kind]) kind = 'ab'; } else { mode = 'seguir'; kind = PATS[p] || p === 'crece' ? p : 'ab'; } draw(); } };
  }

  /* ------------------------------------------------------------------ 3. Ordena la secuencia */
  // Solo rutinas con un orden único: cada paso depende del anterior.
  var ROUT = {
    manos: ['Lavarse las manos', [['grifo_abrir', 'Abro el grifo'], ['frotar_jabon', 'Me froto con jabón'], ['aclarar', 'Me aclaro'], ['secar_toalla', 'Me seco con la toalla']]],
    dientes: ['Lavarse los dientes', [['cepillo', 'Cojo el cepillo'], ['pasta_dientes', 'Pongo la pasta'], ['cepillarse', 'Me cepillo los dientes'], ['enjuagarse', 'Me enjuago la boca']]],
    zapatos: ['Ponerse los zapatos', [['calcetin_poner', 'Me pongo los calcetines'], ['zapato', 'Me pongo los zapatos'], ['atar_cordones', 'Me ato los cordones'], ['andar', 'Salgo a caminar']]],
    tostada: ['Hacer una tostada', [['pan_molde', 'Cojo una rebanada de pan'], ['tostadora', 'La meto en la tostadora'], ['untar', 'Unto la tostada'], ['desayunar', 'Me la como']]],
    semilla: ['Plantar una semilla', [['sembrar', 'Siembro la semilla'], ['regar', 'La riego'], ['brotar', 'Sale un brote'], ['planta_maceta', 'Crece la planta']]],
    calle: ['Cruzar la calle', [['bordillo', 'Me paro en el bordillo'], ['peaton_rojo', 'Espero: el muñeco está en rojo'], ['peaton_verde', 'El muñeco se pone en verde'], ['mirar_lados', 'Miro a los dos lados'], ['paso_cebra', 'Cruzo por el paso de cebra']]],
    manos6: ['Lavarse las manos (6 pasos)', [['grifo_abrir', 'Abro el grifo'], ['jabon_poner', 'Me pongo jabón'], ['frotar_jabon', 'Me froto las manos'], ['aclarar', 'Me aclaro'], ['grifo_cerrar', 'Cierro el grifo'], ['secar_toalla', 'Me seco']]]
  };
  var ROUT_ALIAS = { sandwich: 'tostada', salir: 'zapatos', manos7: 'manos6' };
  function toolSequence(root) {
    var key = 'manos', order = [], picked = -1, row = h('div', { class: 'pj-seq' }), msg = h('p', { class: 'pj-status' });
    function load(k) { k = ROUT_ALIAS[k] || k; key = ROUT[k] ? k : 'manos'; var n = ROUT[key][1].length; do { order = shuffle(Array.from({ length: n }, function (_, i) { return i; })); } while (order.every(function (v, i) { return v === i; })); picked = -1; draw(); setStatus(msg, '', 'Toca una viñeta y después otra para cambiarlas de sitio.'); }
    function draw(check) {
      row.innerHTML = ''; row.style.gridTemplateColumns = 'repeat(' + order.length + ', minmax(0, 1fr))';
      order.forEach(function (v, i) {
        var s = ROUT[key][1][v];
        var b = h('button', { type: 'button', class: 'pj-vign' + (picked === i ? ' sel' : '') + (check ? (v === i ? ' ok' : ' no') + ' pj-reveal' : ''), style: '--i:' + i, html: '<i>' + (i + 1) + '</i>' + pic(s[0]) + '<span>' + s[1] + '</span>' });
        b.addEventListener('click', function () {
          if (picked < 0) { picked = i; draw(); return; }
          var t = order[picked]; order[picked] = order[i]; order[i] = t; picked = -1; draw();
        });
        row.appendChild(b);
      });
    }
    root.appendChild(h('div', { class: 'pj-row' }, [btn('Comprobar', function () {
      draw(true); var ok = order.every(function (v, i) { return v === i; });
      if (ok) { setStatus(msg, 'good', '¡Secuencia correcta! Leedla en voz alta: «primero…, después…, luego…, por último…».'); setTimeout(function () { burst(row); }, order.length * 120); }
      else setStatus(msg, 'bad', 'Las viñetas marcadas en rojo no están en su sitio. ¿Qué tiene que pasar antes?');
    }, 'go'), btn('Mezclar otra vez', function () { load(key); })]));
    root.appendChild(row); root.appendChild(msg); root.appendChild(credit());
    return { load: function (p) { load(p || 'manos'); } };
  }

  /* ------------------------------------------------------------------ 4. Bucles: largo contra corto */
  var LOOPS = {
    palmadas: { t: 'Palmadas', body: [['p', 'aplaudir', 'aplaude']], n: 4 },
    escalera: { t: 'La escalera', body: [['a', 'F'], ['a', 'R'], ['a', 'F'], ['a', 'L']], n: 3 },
    cuadrado: { t: 'El cuadrado', body: [['a', 'F'], ['a', 'F'], ['a', 'R']], n: 4 },
    baile: { t: 'El baile', body: [['p', 'saltar', 'salta'], ['p', 'aplaudir', 'aplaude'], ['p', 'dar_vuelta', 'da una vuelta']], n: 3 }
  };
  function tok(t) { return t[0] === 'a' ? '<span class="tk">' + arrowSVG(t[1]) + '</span>' : '<span class="tk">' + pic(t[1]) + '<small>' + t[2] + '</small></span>'; }
  function toolLoops(root) {
    var key = 'palmadas', n = 4, box = h('div', { class: 'pj-loops' });
    var range = h('input', { type: 'range', min: 2, max: 6, value: 4, class: 'pj-range', 'aria-label': 'Número de repeticiones', oninput: function () { n = +range.value; draw(); } });
    function draw() {
      range.value = n; var L = LOOPS[key], long = [];
      for (var i = 0; i < n; i++) long = long.concat(L.body);
      box.innerHTML = '<div class="pj-lcol"><h2>Programa largo</h2><div class="pj-ltoks">' + long.map(tok).join('') + '</div><p class="pj-big"><b>' + long.length + '</b> tarjetas</p></div>' +
        '<div class="pj-lvs">=</div><div class="pj-lcol"><h2>Programa con bucle</h2><div class="pj-lrep"><b>REPITE ' + n + ' VECES</b><div class="pj-ltoks">' + L.body.map(tok).join('') + '</div></div><p class="pj-big"><b>' + (L.body.length + 1) + '</b> tarjetas</p></div>' +
        '<p class="pj-status" style="grid-column:1/-1">Los dos programas hacen exactamente lo mismo. Con el bucle se ahorran ' + (long.length - L.body.length - 1) + ' tarjetas: ' + n + ' veces ' + L.body.length + ' = ' + long.length + '.</p>';
    }
    root.appendChild(h('div', { class: 'pj-row' }, [h('label', { class: 'pj-chk' }, ['Repeticiones: ', range])]));
    root.appendChild(box); root.appendChild(credit());
    return { load: function (p) { if (LOOPS[p]) { key = p; n = LOOPS[p].n; } draw(); } };
  }

  /* ------------------------------------------------------------------ 5. Semáforo de peatones: si… entonces */
  function toolLight(root) {
    var green = false, siNo = false, light = h('button', { type: 'button', class: 'pj-plight', 'aria-label': 'Cambiar la luz del semáforo de peatones' });
    var rule = h('div', { class: 'pj-rule' }), ans = h('div', { class: 'pj-answer' });
    function draw(reveal) {
      light.innerHTML = pic(green ? 'semaforo_peatones_verde' : 'semaforo_peatones_rojo') + '<span>' + (green ? 'Muñeco en VERDE' : 'Muñeco en ROJO') + '</span>';
      light.classList.toggle('is-green', green); light.classList.toggle('is-red', !green);
      if (siNo) rule.innerHTML = '<p><b class="si">SI</b> el muñeco está en verde <b class="en">ENTONCES</b> miro a los dos lados y cruzo.</p><p><b class="sn">SI NO</b> espero en el bordillo.</p>';
      else rule.innerHTML = '<p><b class="si">SI</b> el muñeco está en rojo <b class="en">ENTONCES</b> espero en el bordillo.</p><p><b class="si">SI</b> el muñeco está en verde <b class="en">ENTONCES</b> miro a los dos lados y cruzo.</p>';
      if (!reveal) { ans.innerHTML = '<p class="pj-status">¿Qué hacemos? Pensadlo y tocad «Ver respuesta».</p>'; return; }
      ans.innerHTML = green
        ? '<div class="pj-do pj-pop">' + pic('mirar_lados') + pic('paso_cebra') + '</div><p class="pj-status pj-good">' + (siNo ? 'Se cumple la condición (está en verde): ' : '') + 'miro a los dos lados y cruzo por el paso de cebra.</p>'
        : '<div class="pj-do pj-pop">' + pic('bordillo') + '</div><p class="pj-status pj-bad">' + (siNo ? 'No se cumple la condición, así que se hace el SI NO: ' : '') + 'espero en el bordillo sin bajar a la calzada.</p>';
    }
    light.addEventListener('click', function () { green = !green; draw(); replay(light, 'pj-pop'); });
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col center' }, [light, h('p', { class: 'pj-info', text: 'Toca el semáforo para cambiar la luz.' })]),
      h('div', { class: 'pj-col' }, [rule, h('div', { class: 'pj-row' }, [btn('Ver respuesta', function () { draw(true); }, 'go'), btn('Luz al azar', function () { green = rnd(2) === 1; draw(); }),
      ]), ans])]));
    root.appendChild(credit());
    return { load: function (p) { siNo = p === 'sino'; draw(); } };
  }

  /* ------------------------------------------------------------------ 6. Clasificador y regla secreta */
  // [pictograma, nombre, color, tipo, tamaño]. Colores sin ambigüedad; el tomate no está (¿fruta o verdura?).
  var ITEMS = [['manzana_roja', 'manzana', 'rojo', 'fruta', 'pequeño'], ['fresa', 'fresa', 'rojo', 'fruta', 'pequeño'], ['camion_bomberos', 'camión de bomberos', 'rojo', 'vehículo', 'grande'], ['coche', 'coche', 'rojo', 'vehículo', 'grande'],
    ['platano', 'plátano', 'amarillo', 'fruta', 'pequeño'], ['limon', 'limón', 'amarillo', 'fruta', 'pequeño'], ['pollito', 'pollito', 'amarillo', 'animal', 'pequeño'],
    ['rana', 'rana', 'verde', 'animal', 'pequeño'], ['brocoli', 'brócoli', 'verde', 'verdura', 'pequeño'], ['lechuga', 'lechuga', 'verde', 'verdura', 'pequeño'], ['tractor', 'tractor', 'verde', 'vehículo', 'grande'],
    ['zanahoria', 'zanahoria', 'naranja', 'verdura', 'pequeño'], ['naranja', 'naranja', 'naranja', 'fruta', 'pequeño'],
    ['elefante', 'elefante', 'otro color', 'animal', 'grande'], ['ballena', 'ballena', 'otro color', 'animal', 'grande'], ['uvas', 'uvas', 'otro color', 'fruta', 'pequeño']];
  var CRIT = { tipo: ['Por tipo', 3, { fruta: 'Frutas', verdura: 'Verduras', animal: 'Animales', 'vehículo': 'Vehículos' }], color: ['Por color', 2, { rojo: 'Rojo', amarillo: 'Amarillo', verde: 'Verde', naranja: 'Naranja', 'otro color': 'Otro color' }], tam: ['Por tamaño', 4, { grande: 'Más grande que una persona', 'pequeño': 'Más pequeño que una persona' }] };
  var SECRETS = [['rojo', 2, 'es de color rojo'], ['animal', 3, 'es un animal'], ['grande', 4, 'es más grande que una persona'], ['fruta', 3, 'es una fruta'], ['verde', 2, 'es de color verde'], ['vehículo', 3, 'es un vehículo']];
  function itemBtn(it) { return h('button', { type: 'button', class: 'pj-item pic', title: it[1], html: pic(it[0]) + '<small>' + it[1] + '</small>' }); }
  function toolSort(root) {
    var crit = 'tipo', secret = null, guesses = 0, board = h('div', { class: 'pj-sortboard' }), msg = h('p', { class: 'pj-status' }), pool = h('div', { class: 'pj-pool' });
    function sortDraw() {
      secret = null; secRow.hidden = true; board.innerHTML = ''; pool.innerHTML = '';
      var C = CRIT[crit], idx = C[1];
      Object.keys(C[2]).forEach(function (g) {
        var b = h('div', { class: 'pj-bin' }, [h('h2', { text: C[2][g] })]);
        var inner = h('div', { class: 'pj-bin-in' }); b.appendChild(inner); board.appendChild(b);
        b.addEventListener('click', function () {
          var s = pool.querySelector('.sel'); if (!s) { setStatus(msg, '', 'Primero toca un objeto.'); return; }
          if (s.getAttribute('data-g') === g) {
            var it = h('span', { class: 'pj-pop', html: s.innerHTML }); inner.appendChild(it); s.remove(); replay(b, 'pj-okflash');
            setStatus(msg, 'good', '¡Bien clasificado!');
            if (!pool.children.length) { setStatus(msg, 'good', '¡Todo clasificado! Ahora probad con otro criterio.'); burst(board); }
          } else { setStatus(msg, 'bad', 'Ese no va ahí. Fijaos en su ' + (crit === 'tam' ? 'tamaño' : crit) + '.'); replay(b, 'pj-shakeel'); }
        });
      });
      shuffle(ITEMS).forEach(function (it) {
        var e = itemBtn(it); e.setAttribute('data-g', it[idx]);
        e.addEventListener('click', function () { pool.querySelectorAll('.sel').forEach(function (x) { x.classList.remove('sel'); }); e.classList.add('sel'); });
        pool.appendChild(e);
      });
      msg.textContent = 'Toca un objeto y después la caja donde va.';
    }
    function secretDraw() {
      secret = SECRETS[rnd(SECRETS.length)]; secRow.hidden = false; guesses = 0; board.innerHTML = ''; pool.innerHTML = '';
      var yes = h('div', { class: 'pj-bin yes' }, [h('h2', { text: 'SÍ cumple la regla' }), h('div', { class: 'pj-bin-in' })]);
      var no = h('div', { class: 'pj-bin no' }, [h('h2', { text: 'NO cumple la regla' }), h('div', { class: 'pj-bin-in' })]);
      board.appendChild(yes); board.appendChild(no);
      shuffle(ITEMS).forEach(function (it) {
        var e = itemBtn(it);
        e.addEventListener('click', function () { guesses++; var bin = it[secret[1]] === secret[0] ? yes : no; bin.querySelector('.pj-bin-in').appendChild(h('span', { class: 'pj-pop', html: e.innerHTML })); e.remove(); replay(bin, 'pj-okflash'); msg.textContent = 'Objetos probados: ' + guesses + '. ¿Ya sabéis la regla?'; });
        pool.appendChild(e);
      });
      msg.textContent = 'La máquina tiene una regla secreta. Tocad objetos y mirad a qué caja los manda. ¿Cuál es la regla?';
    }
    var secRow; root.appendChild(secRow = h('div', { class: 'pj-row' }, [btn('Otra regla secreta', secretDraw, 'go'), btn('Desvelar la regla', function () { if (secret) msg.textContent = 'La regla era: «' + secret[2] + '». Así aprende una máquina: mirando muchos ejemplos ya clasificados.'; })]));
    root.appendChild(pool); root.appendChild(board); root.appendChild(msg); root.appendChild(credit());
    return { load: function (p) { if (p === 'secreta') secretDraw(); else { crit = CRIT[p] ? p : 'tipo'; sortDraw(); } } };
  }

  /* ------------------------------------------------------------------ 7. ¿Qué animal soy? */
  // Cinco preguntas sin ambigüedad; cada animal tiene una combinación de respuestas distinta.
  var AQ = [['plumas', '¿Tiene plumas?'], ['patas4', '¿Tiene cuatro patas?'], ['agua', '¿Vive en el agua?'], ['vuela', '¿Puede volar?'], ['grande', '¿Es más grande que una persona?']];
  var AN = [['perro', 'Perro', { plumas: 0, patas4: 1, agua: 0, vuela: 0, grande: 0 }], ['caballo', 'Caballo', { plumas: 0, patas4: 1, agua: 0, vuela: 0, grande: 1 }],
    ['pajaro', 'Pájaro', { plumas: 1, patas4: 0, agua: 0, vuela: 1, grande: 0 }], ['avestruz', 'Avestruz', { plumas: 1, patas4: 0, agua: 0, vuela: 0, grande: 1 }],
    ['pez', 'Pez', { plumas: 0, patas4: 0, agua: 1, vuela: 0, grande: 0 }], ['ballena', 'Ballena', { plumas: 0, patas4: 0, agua: 1, vuela: 0, grande: 1 }],
    ['mariposa', 'Mariposa', { plumas: 0, patas4: 0, agua: 0, vuela: 1, grande: 0 }], ['serpiente', 'Serpiente', { plumas: 0, patas4: 0, agua: 0, vuela: 0, grande: 0 }]];
  function toolAnimals(root) {
    // Por defecto es la clase la que descarta: tras cada respuesta, se tocan los animales que ya no pueden ser.
    // Con «Descartar solos» lo hace el ordenador (como antes).
    var secret, out, asked, answers, auto = false, grid = h('div', { class: 'pj-animals' }), log = h('ol', { class: 'pj-log' }), msg = h('p', { class: 'pj-status' }), qs = h('div', { class: 'pj-qs' });
    var NOMBRE = { Perro: 'el perro', Caballo: 'el caballo', 'Pájaro': 'el pájaro', Avestruz: 'el avestruz', Pez: 'el pez', Ballena: 'la ballena', Mariposa: 'la mariposa', Serpiente: 'la serpiente' };
    function fits(a) { return answers.every(function (r) { return !!a[2][r[0]] === r[1]; }); }
    function alive() { return AN.filter(function (a) { return out.indexOf(a) < 0; }); }
    function start() {
      secret = AN[rnd(AN.length)]; out = []; asked = 0; answers = []; log.innerHTML = '';
      setStatus(msg, '', 'El ordenador ha pensado un animal. Elegid una pregunta de sí o no.'); draw();
      qs.innerHTML = ''; AQ.forEach(function (q) { qs.appendChild(btn(q[1], function (e) { ask(q, e.currentTarget); })); });
    }
    function found() {
      var v = alive();
      if (v.length !== 1 || v[0] !== secret) return false;
      setStatus(msg, 'good', '¡Es ' + NOMBRE[secret[1]] + '! Lo habéis encontrado con ' + asked + ' preguntas. ¿Se podría con menos?');
      burst(grid.querySelector('.pj-an:not(.out)'));
      return true;
    }
    function ask(q, b) {
      if (alive().length === 1 && alive()[0] === secret) return;
      b.disabled = true; asked++;
      var yes = !!secret[2][q[0]];
      answers.push([q[0], yes]);
      if (auto) out = AN.filter(function (a) { return !fits(a); });
      log.appendChild(h('li', { html: q[1] + ' <b>' + (yes ? 'SÍ' : 'NO') + '</b>' + (auto ? ' → quedan ' + alive().length : '') }));
      draw();
      if (auto) { if (!found()) setStatus(msg, '', 'Quedan ' + alive().length + ' animales. Elegid otra pregunta.'); }
      else setStatus(msg, '', 'La respuesta es ' + (yes ? 'SÍ' : 'NO') + '. Tocad los animales que ya no pueden ser para descartarlos.');
    }
    function toggle(a) {
      if (auto) return;
      var i = out.indexOf(a);
      if (i < 0) out.push(a); else out.splice(i, 1);
      draw();
      if (out.indexOf(secret) >= 0 && alive().length <= 1) setStatus(msg, 'bad', '¡Cuidado! Habéis descartado el animal que era. Pulsad «Comprobar» para ver dónde está el fallo.');
      else if (!found()) setStatus(msg, '', 'Quedan ' + alive().length + ' animales sin descartar.');
    }
    function check() {
      var wrongOut = out.filter(fits), wrongIn = alive().filter(function (a) { return !fits(a); });
      draw(wrongOut.concat(wrongIn));
      if (!wrongOut.length && !wrongIn.length) setStatus(msg, 'good', 'Todo bien descartado. ' + (alive().length > 1 ? 'Quedan ' + alive().length + ': elegid otra pregunta.' : ''));
      else setStatus(msg, 'bad', (wrongOut.length ? (wrongOut.length === 1 ? 'Habéis descartado 1 que todavía puede ser. ' : 'Habéis descartado ' + wrongOut.length + ' que todavía pueden ser. ') : '') + (wrongIn.length ? (wrongIn.length === 1 ? 'Queda 1 que ya no puede ser. ' : 'Quedan ' + wrongIn.length + ' que ya no pueden ser. ') : '') + 'Están marcados en rojo: repasad las respuestas.');
    }
    function draw(bad) {
      grid.innerHTML = '';
      AN.forEach(function (a) {
        var e = h('button', { type: 'button', class: 'pj-an' + (out.indexOf(a) >= 0 ? ' out' : '') + (bad && bad.indexOf(a) >= 0 ? ' bad' : ''),
          'aria-pressed': String(out.indexOf(a) >= 0), 'aria-label': a[1] + (out.indexOf(a) >= 0 ? ' (descartado)' : ''),
          html: pic(a[0]) + '<span>' + a[1] + '</span>' });
        e.addEventListener('click', function () { toggle(a); });
        grid.appendChild(e);
      });
    }
    var autoChk = h('input', { type: 'checkbox', onchange: function (e) { auto = e.target.checked; if (auto) out = AN.filter(function (a) { return !fits(a); }); draw(); if (!auto || !found()) setStatus(msg, '', auto ? 'El ordenador quita solo los que ya no pueden ser. Quedan ' + alive().length + '.' : 'Ahora descartáis vosotros: tocad los animales que ya no pueden ser.'); } });
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [grid]), h('div', { class: 'pj-col' }, [h('h2', { text: 'Preguntas' }), qs, log, msg,
      h('div', { class: 'pj-row' }, [btn('Comprobar', check), btn('Otro animal', start, 'go')]),
      h('label', { class: 'pj-chk' }, [autoChk, ' Descartar solos (el ordenador quita los que ya no pueden ser)'])])]));
    root.appendChild(credit());
    return { load: start };
  }

  /* ------------------------------------------------------------------ 8. Votaciones y gráfico */
  function toolVotes(root) {
    // Encuestas con pregunta, opciones y gráfico de barras con escala; y el dado para estudiar frecuencias.
    // Se elige arriba (Mascotas · Juegos · Frutas · Dado · Mis opciones).
    var PRE = {
      mascotas: ['Perro|perro', 'Gato|gato', 'Pez|pez', 'Pájaro|pajaro'],
      juegos: ['Jugar a la pelota|jugar', 'Leer|leer', 'Cantar|cantar', 'Patinar|patinar'],
      fruta: ['Manzana|manzana_roja', 'Plátano|platano', 'Fresa|fresa', 'Naranja|naranja']
    };
    var MINE_KEY = 'ce40-votos-mis-opciones';
    var mine = { q: '', o: ['', '', ''] };
    try { var sv = JSON.parse(localStorage.getItem(MINE_KEY) || 'null'); if (sv && sv.o && sv.o.length >= 2) mine = sv; } catch (e) { /* sin almacenamiento */ }

    var data = [], mode = 'votos', cols = [], rolling = false, history = [];
    // la pregunta queda abierta: la escribe el docente (o no) según el contexto
    var title = h('input', { type: 'text', class: 'pj-vq', placeholder: 'Escribe aquí la pregunta (si quieres)', 'aria-label': 'Pregunta de la votación', maxlength: 90 });
    title.addEventListener('input', function () { if (mode === 'mine') { mine.q = title.value; try { localStorage.setItem(MINE_KEY, JSON.stringify(mine)); } catch (e) { /* sin almacenamiento */ } } });
    var setup = h('div', { class: 'pj-mine' });
    var diceBox = h('div', { class: 'pj-dicebox' });
    var controls = h('div', { class: 'pj-row' });
    var yaxis = h('div', { class: 'pj-yax' }), grid = h('div', { class: 'pj-grid-lines' }), colsBox = h('div', { class: 'pj-bcols' }), xlab = h('div', { class: 'pj-xlab' });
    var chart = h('div', { class: 'pj-chart2' }, [yaxis, h('div', { class: 'pj-plot' }, [grid, colsBox]), h('span'), xlab]);
    var msg = h('p', { class: 'pj-status' });

    function still() { return document.documentElement.classList.contains('pj-still') || matchMedia('(prefers-reduced-motion: reduce)').matches; }
    function scale(top) {
      // escala «redonda»: pasos de 1, 2, 5, 10, 20, 25, 50… con como mucho 6 rayas
      var steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500], st = 1;
      for (var i = 0; i < steps.length; i++) { st = steps[i]; if (Math.ceil(Math.max(top, 5) / st) <= 6) break; }
      return { step: st, max: Math.max(5, Math.ceil(top / st) * st) };
    }
    function build(list) {
      data = list.map(function (n) { return { n: n, v: 0 }; });
      colsBox.innerHTML = ''; xlab.innerHTML = ''; cols = [];
      data.forEach(function (d) {
        var num = h('b', { class: 'pj-bnum', text: '0' }), bar = h('div', { class: 'pj-bar2' });
        var col = h('div', { class: 'pj-bcol' }, [bar, num]);
        colsBox.appendChild(col);
        var parts = d.n.split('|'), lab = h('div', { class: 'pj-xl' }, [h('span', { html: (parts[1] ? pic(parts[1], 'sm') : '') + '<span>' + parts[0] + '</span>' })]);
        if (mode === 'votos') lab.appendChild(h('div', { class: 'pj-row tight' }, [
          btn('+1', function () { d.v++; draw(d); }, 'go'), btn('−1', function () { if (d.v) { d.v--; draw(); } })]));
        xlab.appendChild(lab);
        cols.push({ d: d, col: col, bar: bar, num: num });
      });
      var n = data.length;
      colsBox.style.gridTemplateColumns = xlab.style.gridTemplateColumns = 'repeat(' + n + ',minmax(0,1fr))';
      draw();
    }
    function draw(changed) {
      var top = Math.max.apply(null, data.map(function (d) { return d.v; })), sc = scale(top);
      yaxis.innerHTML = ''; grid.innerHTML = '';
      for (var v = 0; v <= sc.max; v += sc.step) {
        var p = v / sc.max * 100;
        yaxis.appendChild(h('span', { style: 'bottom:' + p + '%', text: v }));
        grid.appendChild(h('i', { style: 'bottom:' + p + '%' }));
      }
      cols.forEach(function (c) {
        var p = c.d.v / sc.max * 100;
        c.bar.style.height = p + '%';
        c.num.style.bottom = p + '%';
        c.num.textContent = c.d.v;
        c.col.classList.toggle('top', c.d.v === top && top > 0);
        c.col.classList.toggle('zero', c.d.v === 0);
        if (changed === c.d) replay(c.num, 'pj-pop');
      });
      var total = data.reduce(function (a, d) { return a + d.v; }, 0);
      var modes = data.filter(function (d) { return d.v === top && top > 0; }).map(function (d) { return d.n.split('|')[0]; });
      msg.textContent = (mode === 'dado' ? 'Tiradas: ' : 'Votos: ') + total +
        (modes.length ? ' · Moda (' + (mode === 'dado' ? 'lo que más sale' : 'la más votada') + '): ' + modes.join(', ') : '');
    }

    /* ---- dado ---- */
    var PIPS = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]],
      5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 26], [28, 50], [28, 74], [72, 26], [72, 50], [72, 74]] };
    function dieSVG(n) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="5" y="5" width="90" height="90" rx="18" fill="#fff" stroke="#1a1d24" stroke-width="4"/>' +
        PIPS[n].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="' + (n === 1 ? '#cf3f36' : '#1a1d24') + '"/>'; }).join('') + '</svg>';
    }
    var bigDie = h('div', { class: 'pj-die', role: 'img', 'aria-label': 'Dado' }), dieTxt = h('p', { class: 'pj-dietxt' }), hist = h('div', { class: 'pj-hist' });
    diceBox.appendChild(h('div', { class: 'pj-diecol' }, [bigDie, dieTxt]));
    var dControls = h('div', { class: 'pj-row' });
    diceBox.appendChild(h('div', { class: 'pj-histcol' }, [dControls, h('p', { class: 'pj-info', text: 'Últimas tiradas' }), hist]));
    function showDie(n, label) { bigDie.innerHTML = dieSVG(n); bigDie.setAttribute('aria-label', 'Dado: ' + n); dieTxt.innerHTML = label || ''; }
    function drawHist() { hist.innerHTML = history.slice(-20).map(function (n) { return '<span>' + dieSVG(n) + '</span>'; }).join(''); }
    function roll(times) {
      if (rolling) return;
      var res = []; for (var i = 0; i < times; i++) res.push(rnd(6) + 1);
      function land() {
        rolling = false; bigDie.classList.remove('pj-rolling');
        res.forEach(function (r) { data[r - 1].v++; });
        history = history.concat(res); drawHist();
        showDie(res[res.length - 1], times === 1 ? 'Ha salido un <b>' + res[0] + '</b>' : times + ' tiradas · la última, un <b>' + res[res.length - 1] + '</b>');
        draw(times === 1 ? data[res[0] - 1] : null);
      }
      if (still()) { land(); return; }
      rolling = true; bigDie.classList.add('pj-rolling'); dieTxt.textContent = '';
      var k = 0, iv = setInterval(function () {
        showDie(rnd(6) + 1); k++;
        if (k >= 8) { clearInterval(iv); land(); }
      }, 75);
    }
    function dice() {
      mode = 'dado'; title.value = ''; title.hidden = false;
      diceBox.hidden = false; setup.hidden = true; chart.hidden = false; classBox.hidden = true; history = []; drawHist();
      build(['1', '2', '3', '4', '5', '6']);
      showDie(6, 'Pulsa «Tirar el dado»');
      controls.innerHTML = ''; dControls.innerHTML = '';
      dControls.appendChild(btn('Tirar el dado', function () { roll(1); }, 'go'));
      dControls.appendChild(btn('Tirar 10 veces', function () { roll(10); }));
      dControls.appendChild(btn('Tirar 100 veces', function () { roll(100); }));
      dControls.appendChild(btn('Empezar de cero', function () { dice(); }));
      controls.appendChild(btn('Dado de la clase', classDice));
    }

    /* ---- dado de la clase: las tiradas con dados de verdad, frente a 1000 del ordenador ---- */
    var classBox = h('div', { class: 'pj-classbox' });
    var ours = [0, 0, 0, 0, 0, 0], added = [], sim = null;
    function fairTxt(total) { var f = total / 6; return f === Math.round(f) ? String(f) : 'unas ' + Math.round(f); }
    function faces(v, x) {
      var f = []; v.forEach(function (n, i) { if (n === x) f.push(i + 1); });
      return f.length > 1 ? 'el ' + f.slice(0, -1).join(', el ') + ' y el ' + f[f.length - 1] : 'el ' + f[0];
    }
    function readout(v) {
      var top = Math.max.apply(null, v), low = Math.min.apply(null, v);
      if (top === low) return 'Todos los números han salido igual: ' + top + ' veces.';
      return 'Lo que más sale: ' + faces(v, top) + ' (' + top + '). Lo que menos: ' + faces(v, low) + ' (' + low + ').';
    }
    function barChart() {
      var yax = h('div', { class: 'pj-yax' }), lines = h('div', { class: 'pj-grid-lines' }), bars = h('div', { class: 'pj-bcols' }), xl = h('div', { class: 'pj-xlab' });
      var eq = h('div', { class: 'pj-eq' });
      var cap = h('p', { class: 'pj-ccap' }), note = h('p', { class: 'pj-info' });
      var cols = [];
      for (var i = 1; i <= 6; i++) {
        var num = h('b', { class: 'pj-bnum', text: '0' }), bar = h('div', { class: 'pj-bar2' }), col = h('div', { class: 'pj-bcol zero' }, [bar, num]);
        bars.appendChild(col);
        xl.appendChild(h('div', { class: 'pj-xl' }, [h('span', { class: 'pj-face', role: 'img', 'aria-label': String(i), html: dieSVG(i) })]));
        cols.push({ col: col, bar: bar, num: num });
      }
      bars.style.gridTemplateColumns = xl.style.gridTemplateColumns = 'repeat(6,minmax(0,1fr))';
      var el = h('div', { class: 'pj-cbox' }, [cap, h('div', { class: 'pj-chart2 pj-small' }, [yax, h('div', { class: 'pj-plot' }, [lines, bars, eq]), h('span'), xl]), note]);
      return { el: el, cap: cap, note: note, set: function (v) {
        var total = v.reduce(function (a, b) { return a + b; }, 0), fair = total / 6;
        var top = Math.max.apply(null, v), sc = scale(Math.max(top, fair * 2));
        yax.innerHTML = ''; lines.innerHTML = '';
        for (var y = 0; y <= sc.max; y += sc.step) {
          yax.appendChild(h('span', { style: 'bottom:' + (y / sc.max * 100) + '%', text: y }));
          lines.appendChild(h('i', { style: 'bottom:' + (y / sc.max * 100) + '%' }));
        }
        cols.forEach(function (c, k) {
          var p = v[k] / sc.max * 100;
          c.bar.style.height = p + '%'; c.num.style.bottom = p + '%'; c.num.textContent = v[k];
          c.col.classList.toggle('top', v[k] === top && top > 0); c.col.classList.toggle('zero', v[k] === 0);
        });
        eq.hidden = !total;
        eq.style.bottom = (fair / sc.max * 100) + '%';
        note.innerHTML = total ? '<span class="pj-eqkey" aria-hidden="true"></span>Si salieran igual: <b>' + fairTxt(total) + '</b> de cada número. ' + readout(v) : '';
      } };
    }
    var left = barChart(), right = barChart();
    var inputs = [], entry = h('div', { class: 'pj-dentry' });
    for (var fc = 1; fc <= 6; fc++) {
      var inp = h('input', { type: 'number', min: '0', max: '9999', step: '1', inputmode: 'numeric', class: 'pj-input pj-dnum', 'aria-label': 'Veces que ha salido el ' + fc });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addRolls(); } });
      inputs.push(inp);
      entry.appendChild(h('label', { class: 'pj-dfield' }, [h('span', { class: 'pj-face', html: dieSVG(fc) }), inp]));
    }
    var undoBtn = btn('Deshacer lo último', function () {
      var last = added.pop(); if (!last) return;
      last.forEach(function (n, i) { ours[i] -= n; });
      sim = null; updateClass();
    });
    var again = btn('Tirar otras 1000', simulate);
    var wait = h('div', { class: 'pj-cwait' }, [
      h('p', { class: 'pj-ccap', html: '¿Y con <b>1000</b> tiradas?' }),
      h('p', { class: 'pj-info', text: 'Cuando tengáis vuestras tiradas, el ordenador tira el dado 1000 veces para comparar.' }),
      btn('Comparar con 1000 tiradas del ordenador', simulate, 'go')]);
    right.el.appendChild(h('div', { class: 'pj-row' }, [again]));
    classBox.appendChild(h('p', { class: 'pj-info', html: 'Escribid cuántas veces ha salido cada número (las tiradas de una pareja o el total de la clase) y pulsad <b>Añadir</b>.' }));
    classBox.appendChild(h('div', { class: 'pj-row pj-dentryrow' }, [entry, btn('Añadir', addRolls, 'go'), undoBtn]));
    classBox.appendChild(h('div', { class: 'pj-cmp' }, [left.el, h('div', { class: 'pj-cbox' }, [wait, right.el])]));
    function addRolls() {
      var v = inputs.map(function (x) { var n = Math.floor(Number(x.value)); return isFinite(n) && n > 0 ? n : 0; });
      if (!v.some(Boolean)) { msg.textContent = 'Escribe cuántas veces ha salido cada número.'; inputs[0].focus(); return; }
      v.forEach(function (n, i) { ours[i] += n; });
      added.push(v); sim = null;
      inputs.forEach(function (x) { x.value = ''; });
      inputs[0].focus();
      updateClass();
    }
    function simulate() {
      if (!ours.some(Boolean)) { msg.textContent = 'Primero añadid vuestras tiradas.'; return; }
      sim = [0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 1000; i++) sim[rnd(6)]++;
      updateClass();
    }
    function updateClass() {
      var total = ours.reduce(function (a, b) { return a + b; }, 0);
      left.cap.innerHTML = 'Nuestras tiradas: <b>' + total + '</b>' + (added.length > 1 ? ' <small>(' + added.length + ' grupos)</small>' : '');
      left.set(ours);
      undoBtn.disabled = !added.length;
      wait.hidden = !!sim; right.el.hidden = !sim;
      if (sim) { right.cap.innerHTML = 'El ordenador: <b>1000</b> tiradas'; right.set(sim); }
      msg.textContent = !total ? '' : sim ? '¿En cuál se acercan más las barras a la línea «Si salieran igual»?' :
        'Si el dado es justo, cada número sale más o menos 1 de cada 6 veces: con ' + total + ' tiradas, ' + fairTxt(total) + ' veces cada uno.';
    }
    function classDice() {
      mode = 'clase'; title.value = ''; title.hidden = false;
      diceBox.hidden = true; setup.hidden = true; chart.hidden = true; classBox.hidden = false;
      ours = [0, 0, 0, 0, 0, 0]; added = []; sim = null;
      inputs.forEach(function (x) { x.value = ''; });
      updateClass();
      controls.innerHTML = '';
      controls.appendChild(btn('Empezar de cero', classDice));
      controls.appendChild(btn('Tirar en la pizarra', dice));
    }

    /* ---- encuestas ---- */
    function poll(q, list, isMine) {
      mode = 'votos'; title.value = q || ''; title.hidden = false;
      diceBox.hidden = true; setup.hidden = true; chart.hidden = false; classBox.hidden = true;
      build(list);
      if (isMine) mode = 'mine';
      controls.innerHTML = '';
      controls.appendChild(btn('Votos a 0', function () { data.forEach(function (d) { d.v = 0; }); draw(); }));
    }
    function preset(key) {
      poll('', PRE[key]);
    }
    function editMine() {
      mode = 'votos'; title.hidden = true;
      diceBox.hidden = true; chart.hidden = true; classBox.hidden = true; setup.hidden = false; controls.innerHTML = ''; msg.textContent = '';
      setup.innerHTML = '';
      var qIn = h('input', { type: 'text', class: 'pj-input', value: mine.q, placeholder: 'Por ejemplo: ¿Cuál es tu deporte favorito?', 'aria-label': 'Pregunta' });
      var list = h('ol', { class: 'pj-optlist' });
      function addRow(val, focus) {
        if (list.children.length >= 8) return;
        var inp = h('input', { type: 'text', class: 'pj-input', value: val || '', maxlength: 24, placeholder: 'Opción ' + (list.children.length + 1), 'aria-label': 'Opción' });
        inp.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          var next = li.nextSibling;
          if (next) next.querySelector('input').focus(); else if (inp.value.trim()) addRow('', true);
        });
        var del = btn('×', function () { if (list.children.length > 2) { list.removeChild(li); renumber(); } });
        del.setAttribute('aria-label', 'Quitar esta opción');
        var li = h('li', {}, [inp, del]);
        list.appendChild(li); renumber();
        if (focus) inp.focus();
      }
      function renumber() { Array.prototype.forEach.call(list.querySelectorAll('input'), function (x, i) { x.placeholder = 'Opción ' + (i + 1); }); }
      mine.o.forEach(function (v) { addRow(v); });
      var err = h('p', { class: 'pj-status' });
      setup.appendChild(h('label', { class: 'pj-mlab', text: 'Pregunta (si quieres)' }));
      setup.appendChild(qIn);
      setup.appendChild(h('label', { class: 'pj-mlab', text: 'Opciones (de 2 a 8)' }));
      setup.appendChild(list);
      setup.appendChild(h('div', { class: 'pj-row' }, [
        btn('+ Añadir opción', function () { addRow('', true); }),
        btn('Empezar la votación', function () {
          var opts = Array.prototype.map.call(list.querySelectorAll('input'), function (x) { return x.value.trim().replace(/\|/g, ''); });
          var used = opts.filter(Boolean);
          if (used.length < 2) { err.textContent = 'Escribe al menos dos opciones.'; return; }
          mine = { q: qIn.value.trim(), o: opts.length >= 2 ? opts : used };
          try { localStorage.setItem(MINE_KEY, JSON.stringify(mine)); } catch (e) { /* sin almacenamiento */ }
          poll(mine.q, used, true);
          controls.appendChild(btn('Cambiar las opciones', editMine));
        }, 'go')]));
      setup.appendChild(err);
    }

    setup.hidden = true; diceBox.hidden = true; classBox.hidden = true;
    root.appendChild(title); root.appendChild(setup); root.appendChild(diceBox); root.appendChild(classBox); root.appendChild(chart);
    root.appendChild(h('div', { class: 'pj-vfoot' }, [msg, controls]));
    return { load: function (p) {
      if (p === 'dado') dice();
      else if (p === 'clase') classDice();
      else if (p === 'mis') editMine();
      else preset(PRE[p] ? p : 'mascotas');
    } };
  }

  /* ------------------------------------------------------------------ 9. Diagramas de flujo paso a paso */
  // Cada diagrama es un grafo dibujado a mano en una rejilla (columna c, fila r): nodos 'o' (óvalo: empezar y terminar),
  // 'r' (rectángulo: hacer algo) y 'd' (rombo: pregunta de sí o no, con dos salidas). Las flechas llevan sus puntos de paso;
  // «junta: true» es una flecha que acaba sobre otra línea (cuando dos caminos se juntan o un bucle vuelve atrás).
  var FLOWS = {
    calle: { t: 'Cruzar la calle',
      n: { s: ['o', 'EMPIEZA', 1, 0], a: ['r', 'Llego al paso de cebra', 1, 1], d: ['d', '¿El muñeco del semáforo está en verde?', 1, 2],
        y1: ['r', 'Miro a los dos lados', 1, 3], y2: ['r', 'Cruzo por el paso de cebra', 1, 4], e: ['o', 'TERMINA', 1, 5], no: ['r', 'Espero en el bordillo', 2.15, 2] },
      e: [['s', 'a'], ['a', 'd'], ['d', 'y1', 'SÍ'], ['y1', 'y2'], ['y2', 'e'], ['d', 'no', 'NO', 'R', 'L'],
        ['no', 'd', '', 'T', null, [[2.15, 1.5], [1, 1.5]], 'Vuelvo a mirar el semáforo: el diagrama vuelve atrás hasta que la respuesta es SÍ. Eso es un bucle.']] },
    planta: { t: 'Regar una planta',
      n: { s: ['o', 'EMPIEZA', 1, 0], a: ['r', 'Miro la maceta', 1, 1], d: ['d', '¿La tierra está seca?', 1, 2], y1: ['r', 'Cojo la regadera', 1, 3],
        y2: ['r', 'Riego la planta', 1, 4], e: ['o', 'TERMINA', 1, 5] },
      e: [['s', 'a'], ['a', 'd'], ['d', 'y1', 'SÍ'], ['y1', 'y2'], ['y2', 'e'], ['d', 'e', 'NO', 'R', 'R', [[2, 2], [2, 5]], 'La tierra está húmeda: no hace falta regar. Se salta los pasos de regar y termina.']] },
    par: { t: '¿Par o impar?',
      n: { s: ['o', 'EMPIEZA', 1, 0], a: ['r', 'Pienso un número', 1, 1], d: ['d', '¿Es par?', 1, 2], p: ['r', 'Digo «PAR»', 0, 3], i: ['r', 'Digo «IMPAR»', 2, 3], e: ['o', 'TERMINA', 1, 4] },
      e: [['s', 'a'], ['a', 'd'], ['d', 'p', 'SÍ', 'L', 'T', [[0, 2]]], ['d', 'i', 'NO', 'R', 'T', [[2, 2]]], ['p', 'e', '', 'B', 'L', [[0, 4]]], ['i', 'e', '', 'B', 'R', [[2, 4]]]] },
    adivina: { t: 'Adivina el número',
      n: { s: ['o', 'EMPIEZA', 1, 0], a: ['r', 'El ordenador piensa un número del 1 al 20', 1, 1], b: ['r', 'Digo un número', 1, 2], d1: ['d', '¿He acertado?', 1, 3],
        ok: ['r', 'Dice «¡Acertaste!»', 1, 4], e: ['o', 'TERMINA', 1, 5], d2: ['d', '¿Mi número es mayor que el secreto?', 2.2, 3],
        m1: ['r', 'Dice «es más pequeño»', 2.2, 4], m2: ['r', 'Dice «es más grande»', 3.3, 4] },
      e: [['s', 'a'], ['a', 'b'], ['b', 'd1'], ['d1', 'ok', 'SÍ'], ['ok', 'e'], ['d1', 'd2', 'NO', 'R', 'L'], ['d2', 'm1', 'SÍ'], ['d2', 'm2', 'NO', 'R', 'T', [[3.3, 3]]],
        ['m1', 'b', '', 'B', null, [[2.2, 4.6], [3.95, 4.6], [3.95, 1.5], [1, 1.5]], 'Vuelvo a decir otro número: es un bucle que se repite hasta acertar.'],
        ['m2', 'b', '', 'R', null, [[3.95, 4]], 'Vuelvo a decir otro número: es un bucle que se repite hasta acertar.']] }
  };
  function toolFlow(root) {
    var key = 'calle', at = 's', last = null, seen = {}, svgBox = h('div', { class: 'pj-flowbox' }), ctr = h('div', { class: 'pj-row' }), msg = h('p', { class: 'pj-status' });
    var CW = 250, RH = 118, PX = 24, PY = 18, SZ = { o: [150, 52], r: [200, 64], d: [216, 104] };
    function X(c) { return PX + c * CW + CW / 2; }
    function Y(r) { return PY + r * RH + RH / 2; }
    function ancla(id, side) {
      var nd = FLOWS[key].n[id], w = SZ[nd[0]][0] / 2, hh = SZ[nd[0]][1] / 2, x = X(nd[2]), y = Y(nd[3]);
      return side === 'T' ? [x, y - hh] : side === 'B' ? [x, y + hh] : side === 'L' ? [x - w, y] : [x + w, y];
    }
    function salidas(id) { return FLOWS[key].e.filter(function (ed) { return ed[0] === id; }); }
    function draw() {
      var F = FLOWS[key], s = '', maxX = 0, maxY = 0;
      Object.keys(F.n).forEach(function (id) { var nd = F.n[id]; maxX = Math.max(maxX, X(nd[2]) + SZ[nd[0]][0] / 2); maxY = Math.max(maxY, Y(nd[3]) + SZ[nd[0]][1] / 2); });
      F.e.forEach(function (ed, k) {
        var a = ancla(ed[0], ed[3] || 'B'), pts = [a];
        (ed[5] || []).forEach(function (p) { pts.push([X(p[0]), Y(p[1])]); });
        if (ed[4] !== null) pts.push(ancla(ed[1], ed[4] || 'T'));
        pts.forEach(function (p) { maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); });
        var cls = 'pj-fe' + (seen['e' + k] ? ' done' : '') + (last === k ? ' hot' : '');
        s += '<path class="' + cls + '" d="' + pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join('') + '" marker-end="url(#pjfa-' + (last === k ? 'hot' : seen['e' + k] ? 'done' : 'n') + ')"/>';
        if (ed[2]) {
          var dx = pts[1][0] - pts[0][0], dy = pts[1][1] - pts[0][1], lx = pts[0][0] + (dx ? Math.sign(dx) * 22 : 14), ly = pts[0][1] + (dy ? Math.sign(dy) * 24 : -10);
          s += '<text class="pj-fl' + (ed[2] === 'SÍ' ? ' si' : ' no') + '" x="' + lx + '" y="' + ly + '" text-anchor="' + (dx < 0 ? 'end' : 'start') + '">' + ed[2] + '</text>';
        }
      });
      Object.keys(F.n).forEach(function (id) {
        var nd = F.n[id], w = SZ[nd[0]][0], hh = SZ[nd[0]][1], x = X(nd[2]), y = Y(nd[3]);
        var cls = 'pj-fn ' + nd[0] + (id === at ? ' now' : seen[id] ? ' done' : '');
        var shape = nd[0] === 'o' ? '<rect x="' + (x - w / 2) + '" y="' + (y - hh / 2) + '" width="' + w + '" height="' + hh + '" rx="' + hh / 2 + '"/>'
          : nd[0] === 'r' ? '<rect x="' + (x - w / 2) + '" y="' + (y - hh / 2) + '" width="' + w + '" height="' + hh + '" rx="6"/>'
          : '<path d="M' + x + ' ' + (y - hh / 2) + 'L' + (x + w / 2) + ' ' + y + 'L' + x + ' ' + (y + hh / 2) + 'L' + (x - w / 2) + ' ' + y + 'Z"/>';
        var tw = nd[0] === 'd' ? w * 0.62 : w - 16, th = nd[0] === 'd' ? hh * 0.7 : hh - 6;
        s += '<g class="' + cls + '">' + shape + '<foreignObject x="' + (x - tw / 2) + '" y="' + (y - th / 2) + '" width="' + tw + '" height="' + th + '"><div xmlns="http://www.w3.org/1999/xhtml">' + nd[1] + '</div></foreignObject></g>';
      });
      var W = maxX + PX, H = maxY + PY;
      var mk = function (id, col) { return '<marker id="pjfa-' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="' + col + '"/></marker>'; };
      svgBox.innerHTML = '<svg class="pj-flowsvg" style="max-width:' + Math.round(W * 1.1) + 'px" viewBox="0 0 ' + W + ' ' + H + '"><defs>' + mk('n', '#8a93a5') + mk('done', '#2c5bbf') + mk('hot', '#df7619') + '</defs>' + s + '</svg>';
      ctr.innerHTML = '';
      var nd = F.n[at], out = salidas(at);
      if (nd[0] === 'd') out.forEach(function (ed) { ctr.appendChild(btn(ed[2], function () { go(ed); }, ed[2] === 'SÍ' ? 'go' : '')); });
      else if (out.length) ctr.appendChild(btn('Siguiente paso', function () { go(out[0]); }, 'go'));
      else ctr.appendChild(btn('Empezar otra vez', function () { start(); }, 'go'));
    }
    function go(ed) {
      var F = FLOWS[key];
      last = F.e.indexOf(ed); seen['e' + last] = true; seen[at] = true; at = ed[1];
      msg.textContent = ed[6] || (F.n[at][0] === 'd' ? 'Una pregunta: ¿SÍ o NO? Votad antes de elegir.' : F.n[at][0] === 'o' ? '¡Fin del recorrido! ¿Qué camino habéis seguido?' : '');
      draw();
    }
    function start() { at = 's'; last = null; seen = {}; msg.textContent = ''; draw(); }
    root.appendChild(h('div', { class: 'pj-two pj-flowtwo' }, [h('div', { class: 'pj-col' }, [svgBox]), h('div', { class: 'pj-col' }, [
      h('p', { class: 'pj-info', html: '<b>Óvalo</b>: empezar o terminar · <b>Rectángulo</b>: hacer algo · <b>Rombo</b>: pregunta de sí o no, con dos salidas' }), ctr, msg])]));
    return { load: function (p) { key = FLOWS[p] ? p : 'calle'; start(); } };
  }

  /* ------------------------------------------------------------------ 10. Polígonos con la tortuga */
  function toolPoly(root) {
    var n = 4, len = 100, rose = false, svg = document.createElementNS(NS, 'svg'), code = h('div', { class: 'pj-code' }), tbl = h('div', { class: 'pj-status' });
    svg.setAttribute('viewBox', '-220 -220 440 440'); svg.setAttribute('class', 'pj-turtle');
    var nIn = h('input', { type: 'range', min: 3, max: 12, value: 4, class: 'pj-range', 'aria-label': 'Lados', oninput: function () { n = +nIn.value; draw(); } });
    var lIn = h('input', { type: 'range', min: 40, max: 140, value: 100, class: 'pj-range', 'aria-label': 'Longitud del lado', oninput: function () { len = +lIn.value; draw(); } });
    function draw() {
      var ang = 360 / n, pts = [], x = 0, y = 0, a = -90, s = '';
      var reps = rose ? 12 : 1;
      for (var r = 0; r < reps; r++) {
        x = 0; y = 0; a = -90 + r * 30; pts = [[x, y]];
        for (var i = 0; i < n; i++) { x += len * Math.cos(a * Math.PI / 180); y += len * Math.sin(a * Math.PI / 180); pts.push([x, y]); a += ang; }
        var minx = rose ? 0 : Math.min.apply(null, pts.map(function (p) { return p[0]; })), maxx = rose ? 0 : Math.max.apply(null, pts.map(function (p) { return p[0]; }));
        var miny = rose ? 0 : Math.min.apply(null, pts.map(function (p) { return p[1]; })), maxy = rose ? 0 : Math.max.apply(null, pts.map(function (p) { return p[1]; }));
        var ox = -(minx + maxx) / 2, oy = -(miny + maxy) / 2;
        s += '<polyline points="' + pts.map(function (p) { return (p[0] + ox) + ',' + (p[1] + oy); }).join(' ') + '" fill="none" stroke="hsl(' + (r * 30 + 210) + ',70%,50%)" stroke-width="' + (rose ? 2.5 : 5) + '" stroke-linejoin="round"/>';
        if (!rose) s += '<circle cx="' + (pts[0][0] + ox) + '" cy="' + (pts[0][1] + oy) + '" r="7" fill="#df7619"/>';
      }
      svg.innerHTML = s;
      code.innerHTML = (rose ? '<div class="blk ctl">repetir 12</div><div class="ind">' : '') + '<div class="blk pen">bajar lápiz</div><div class="blk ctl">repetir <b>' + n + '</b></div><div class="ind"><div class="blk mov">mover <b>' + len + '</b> pasos</div><div class="blk mov">girar ↻ <b>' + (Math.round(ang * 10) / 10) + '</b> grados</div></div>' + (rose ? '<div class="blk mov">girar ↻ 30 grados</div></div>' : '');
      tbl.innerHTML = n + ' lados → cada giro: 360 ÷ ' + n + ' = <b>' + (Math.round(ang * 10) / 10) + '°</b>';
    }
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col center' }, [svg]), h('div', { class: 'pj-col' }, [
      h('label', { class: 'pj-chk' }, ['Lados: ', nIn]), h('label', { class: 'pj-chk' }, ['Longitud: ', lIn]),
      h('div', { class: 'pj-row' }, [btn('Triángulo', function () { n = 3; nIn.value = 3; draw(); }), btn('Cuadrado', function () { n = 4; nIn.value = 4; draw(); }), btn('Hexágono', function () { n = 6; nIn.value = 6; draw(); })]),
      code, tbl])]));
    return { load: function (p) { rose = p === 'roseton'; if (p === 'triangulo') n = 3; nIn.value = n; draw(); } };
  }

  /* ------------------------------------------------------------------ 11. Variables: está en proyectables5.js */

  /* ------------------------------------------------------------------ 12. Coordenadas del escenario: está en proyectables5.js */

  /* ------------------------------------------------------------------ 13. ¿Conduce la electricidad? */
  var OBJS = [['platano', 'Plátano', 2], ['papel', 'Papel', 0], ['cuchara', 'Cuchara de metal', 1], ['lapiz', 'Mina de lápiz (grafito)', 1], ['regla', 'Regla de plástico', 0], ['madera', 'Madera', 0],
    ['goma', 'Goma de borrar', 0], ['aluminio', 'Papel de aluminio', 1], ['moneda', 'Moneda', 1], ['mano', 'Una mano', 2], ['guante', 'Guante de lana', 0], ['llave', 'Llave', 1]];
  function toolCircuit(root) {
    var cur = null, svg = document.createElementNS(NS, 'svg'), tbl = h('table', { class: 'pj-table' }), msg = h('p', { class: 'pj-status' }), res = {};
    svg.setAttribute('viewBox', '0 0 420 270'); svg.setAttribute('class', 'pj-circ');
    function draw(lit) {
      var img = cur && window.PICTO ? '<image href="' + PICTO[cur[0]] + '" x="236" y="160" width="68" height="68"/>' : '<text x="270" y="207" text-anchor="middle" font-size="34" fill="var(--pj-muted)">?</text>';
      svg.classList.toggle('pj-lit', !!lit);
      svg.innerHTML = '<path d="M90 200 H40 V60 H195 M265 60 H380 V200 H310 M230 200 H120" fill="none" stroke="var(--pj-ink)" stroke-width="5" stroke-linecap="round"/>' +
        (lit ? '<path class="pj-flow" d="M40 200 V60 H195 M265 60 H380 V200 H310 M230 200 H120" fill="none" stroke="#ffd84a" stroke-width="5" stroke-linecap="round" stroke-dasharray="4 14"/>' : '') +
        '<rect x="62" y="180" width="60" height="40" rx="6" fill="#e8b000" stroke="var(--pj-ink)" stroke-width="3"/><rect x="122" y="192" width="8" height="16" fill="var(--pj-ink)"/><text x="92" y="206" text-anchor="middle" font-size="15" font-weight="700" fill="#1a1d24">PILA</text>' +
        (lit ? '<circle class="pj-halo" cx="230" cy="60" r="52" fill="#ffe680" opacity=".55"/>' : '') +
        '<circle cx="230" cy="60" r="32" fill="' + (lit ? '#ffd84a' : 'var(--pj-bg2)') + '" stroke="var(--pj-ink)" stroke-width="4"/><path d="M218 70 q12 -26 24 0" fill="none" stroke="var(--pj-ink)" stroke-width="3"/><rect x="218" y="92" width="24" height="12" rx="3" fill="#9aa1ad"/>' +
        '<rect x="232" y="156" width="76" height="76" rx="10" fill="var(--pj-cell)" stroke="var(--pj-line)" stroke-width="3" stroke-dasharray="6 5"/>' + img +
        '<text x="270" y="256" text-anchor="middle" font-size="13" fill="var(--pj-muted)">hueco del circuito</text>';
    }
    function drawTable() { var k = Object.keys(res); tbl.innerHTML = k.length ? '<tr><th>Objeto</th><th>¿Conduce?</th></tr>' + k.map(function (n) { return '<tr><td>' + n + '</td><td><b class="' + (res[n] === 1 ? 'yes' : 'no') + '">' + (res[n] === 1 ? 'Sí' : res[n] === 2 ? 'Muy poco' : 'No') + '</b></td></tr>'; }).join('') : ''; }
    var pick = h('div', { class: 'pj-pool' });
    OBJS.forEach(function (o) { pick.appendChild(h('button', { type: 'button', class: 'pj-item pic', title: o[1], html: pic(o[0]) + '<small>' + o[1] + '</small>', onclick: function () { cur = o; draw(false); msg.textContent = o[1] + ': ¿se encenderá la bombilla? Votad y después pulsad «Probar».'; } })); });
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [svg, msg]), h('div', { class: 'pj-col' }, [h('h2', { text: 'Elige un objeto' }), pick,
      btn('Probar el circuito', function () { if (!cur) { msg.textContent = 'Primero elige un objeto.'; return; } draw(cur[2] === 1); res[cur[1]] = cur[2]; drawTable(); msg.textContent = cur[2] === 1 ? '¡Se enciende! ' + cur[1] + ': conduce la electricidad.' : cur[2] === 2 ? 'No se enciende. ' + cur[1] + ': conduce muy poco, no lo bastante para una bombilla. Con Makey Makey, que nota corrientes muy pequeñas, sí sirve como tecla.' : 'No se enciende. ' + cur[1] + ': no conduce la electricidad.'; }, 'go'), tbl])]));
    root.appendChild(credit());
    return { load: function () { draw(false); drawTable(); } };
  }

  /* ------------------------------------------------------------------ 14. Matriz de LED de la micro:bit */
  var ICONS = { corazon: '0101011111111110111000100', sonrisa: '0000001010000001000101110', flecha: '0010001110101010010000100', si: '0000000001000100101000100', no: '1000101010001000101010001', vacio: '0000000000000000000000000' };
  function toolLeds(root) {
    var on = ICONS.corazon.split('').map(Number), grid = h('div', { class: 'pj-leds' }), info = h('p', { class: 'pj-big' });
    function draw() {
      grid.innerHTML = '';
      on.forEach(function (v, i) {
        var b = h('button', { type: 'button', class: 'pj-led' + (v ? ' on' : ''), 'aria-label': 'LED x ' + (i % 5) + ' y ' + Math.floor(i / 5) });
        b.addEventListener('click', function () { on[i] = on[i] ? 0 : 1; draw(); });
        b.addEventListener('mouseenter', function () { info.innerHTML = 'x: <b>' + (i % 5) + '</b> &nbsp; y: <b>' + Math.floor(i / 5) + '</b>'; });
        grid.appendChild(b);
      });
    }
    var icons = h('div', { class: 'pj-row' });
    icons.appendChild(btn('Apagar todas', function () { on = ICONS.vacio.split('').map(Number); draw(); }));
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col center' }, [h('div', { class: 'pj-mb' }, [h('span', { class: 'pj-mbbtn', text: 'A' }), grid, h('span', { class: 'pj-mbbtn', text: 'B' })])]),
      h('div', { class: 'pj-col' }, [icons, info, h('p', { class: 'pj-info', text: 'La pantalla es una cuadrícula de 5 × 5 luces. La x va de 0 a 4 hacia la derecha y la y de 0 a 4 hacia abajo. Toca las luces para dibujar.' }),
        btn('Contar luces encendidas', function () { info.innerHTML = 'Luces encendidas: <b>' + on.reduce(function (a, b) { return a + b; }, 0) + '</b> de 25'; }, 'go')])]));
    return { load: function (p) { if (ICONS[p]) on = ICONS[p].split('').map(Number); draw(); } };
  }

  /* ------------------------------------------------------------------ 15. Sensor y umbral */
  function toolThreshold(root) {
    var kind = 'luz', val = 120, thr = 50, out = h('div', { class: 'pj-throut' }), code = h('div', { class: 'pj-code' }), meter = h('div', { class: 'pj-meter' });
    var vIn = h('input', { type: 'range', class: 'pj-range', min: 0, max: 255, value: 120, 'aria-label': 'Valor del sensor', oninput: function () { val = +vIn.value; draw(); } });
    var tIn = h('input', { type: 'range', class: 'pj-range', min: 0, max: 255, value: 50, 'aria-label': 'Umbral', oninput: function () { thr = +tIn.value; draw(); } });
    function draw() {
      var L = kind === 'luz', unit = L ? '' : ' °C', max = L ? 255 : 40;
      vIn.max = max; tIn.max = max;
      var cond = L ? val < thr : val > thr;
      out.innerHTML = L ? (cond ? '<svg viewBox="0 0 100 100" class="pj-ico"><path d="M62 14a38 38 0 1 0 24 58A32 32 0 0 1 62 14z" fill="#f5c518" stroke="#1a1d24" stroke-width="3"/></svg><p>Se enciende la luz de noche</p>' : '<svg viewBox="0 0 100 100" class="pj-ico"><circle cx="50" cy="50" r="20" fill="#f5c518" stroke="#1a1d24" stroke-width="3"/><g stroke="#e8b000" stroke-width="6" stroke-linecap="round"><path d="M50 8v12M50 80v12M8 50h12M80 50h12M20 20l9 9M71 71l9 9M80 20l-9 9M29 71l-9 9"/></g></svg><p>Hay luz: la pantalla se apaga</p>') : (cond ? '<svg viewBox="0 0 100 100" class="pj-ico"><rect x="40" y="8" width="20" height="62" rx="10" fill="#fff" stroke="#1a1d24" stroke-width="3"/><circle cx="50" cy="78" r="15" fill="#cf3f36" stroke="#1a1d24" stroke-width="3"/><rect x="45" y="22" width="10" height="56" fill="#cf3f36"/></svg><p>¡Hace calor! Aviso: abrid la ventana</p>' : '<svg viewBox="0 0 100 100" class="pj-ico"><rect x="40" y="8" width="20" height="62" rx="10" fill="#fff" stroke="#1a1d24" stroke-width="3"/><circle cx="50" cy="78" r="15" fill="#2c5bbf" stroke="#1a1d24" stroke-width="3"/><rect x="45" y="50" width="10" height="28" fill="#2c5bbf"/></svg><p>Temperatura normal</p>');
      meter.innerHTML = '<div class="fill" style="width:' + (val / max * 100) + '%"></div><div class="thr" style="left:' + (thr / max * 100) + '%"><span>umbral ' + thr + unit + '</span></div><em>' + (L ? 'nivel de luz ' : 'temperatura ') + val + unit + '</em>';
      code.innerHTML = '<div class="blk loo">para siempre</div><div class="ind"><div class="blk log">si <b>' + (L ? 'nivel de luz &lt; ' : 'temperatura &gt; ') + thr + '</b> entonces</div><div class="ind"><div class="blk bas">' + (L ? 'mostrar luna' : 'mostrar aviso') + '</div></div><div class="blk log">si no</div><div class="ind"><div class="blk bas">' + (L ? 'borrar pantalla' : 'mostrar cara feliz') + '</div></div></div>' +
        '<p class="pj-status">Ahora: ' + val + unit + (L ? (cond ? ' es menor que ' : ' no es menor que ') : (cond ? ' es mayor que ' : ' no es mayor que ')) + thr + unit + ' → ' + (cond ? 'se cumple' : 'no se cumple') + '.</p>';
    }
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col center' }, [out, meter]), h('div', { class: 'pj-col' }, [
      h('label', { class: 'pj-chk' }, ['Lo que mide el sensor: ', vIn]), h('label', { class: 'pj-chk' }, ['Umbral: ', tIn]), code])]));
    // el modo se elige arriba (Luz · Temperatura); al cambiar, se ponen sus valores de partida
    return { load: function (p) { if (p === 'temp') { kind = 'temp'; val = 22; thr = 26; } else { kind = 'luz'; val = 120; thr = 50; }
      vIn.max = tIn.max = kind === 'luz' ? 255 : 40; vIn.value = val; tIn.value = thr; draw(); } };
  }

  /* ------------------------------------------------------------------ 16. Velocidad por tiempo (Nezha) */
  function toolSpeed(root) {
    var v = 20, t = 2, pred = null, track = h('div', { class: 'pj-track' }), msg = h('p', { class: 'pj-status' }), rob = h('div', { class: 'pj-car', html: '<svg viewBox="0 0 120 70"><rect x="10" y="14" width="96" height="32" rx="8" fill="#2c5bbf" stroke="#1a1d24" stroke-width="3"/><rect x="34" y="4" width="46" height="18" rx="4" fill="#1a1d24"/><rect x="40" y="8" width="34" height="10" rx="2" fill="#17a077"/><circle cx="32" cy="52" r="13" fill="#1a1d24"/><circle cx="32" cy="52" r="5" fill="#9aa1ad"/><circle cx="88" cy="52" r="13" fill="#1a1d24"/><circle cx="88" cy="52" r="5" fill="#9aa1ad"/><circle cx="108" cy="30" r="4" fill="#f5c518"/></svg>' }), anim;
    var vIn = h('input', { type: 'range', class: 'pj-range', min: 5, max: 40, step: 5, value: 20, 'aria-label': 'Velocidad', oninput: function () { v = +vIn.value; label(); } });
    var tIn = h('input', { type: 'range', class: 'pj-range', min: 1, max: 5, step: 0.5, value: 2, 'aria-label': 'Tiempo', oninput: function () { t = +tIn.value; label(); } });
    var lab = h('p', { class: 'pj-big' }), rows = [];
    for (var i = 0; i <= 200; i += 20) track.appendChild(h('span', { class: 'tick', style: 'left:' + (i / 2) + '%', text: i }));
    track.appendChild(rob);
    function label() { lab.innerHTML = 'Velocidad <b>' + v + ' cm/s</b> · Tiempo <b>' + t + ' s</b>'; }
    function go() {
      cancelAnimationFrame(anim); var d = v * t, t0 = null;
      function f(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / (t * 1000)); rob.style.left = Math.min(100, d * k / 2) + '%'; if (k < 1) anim = requestAnimationFrame(f); else { msg.innerHTML = 'Ha recorrido <b>' + d + ' cm</b> = ' + v + ' × ' + t + '.'; rows.unshift(v + ' cm/s × ' + t + ' s = ' + d + ' cm'); log.innerHTML = rows.slice(0, 6).map(function (r) { return '<li>' + r + '</li>'; }).join(''); } }
      rob.style.left = '0%'; anim = requestAnimationFrame(f);
    }
    var log = h('ol', { class: 'pj-log' });
    root.appendChild(track);
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [label && lab, h('label', { class: 'pj-chk' }, ['Velocidad: ', vIn]), h('label', { class: 'pj-chk' }, ['Tiempo: ', tIn]), btn('▶ Arrancar el robot', go, 'go'), msg]),
      h('div', { class: 'pj-col' }, [h('p', { class: 'pj-info', text: 'Antes de arrancar, que la clase prediga cuántos centímetros avanzará. Distancia = velocidad × tiempo.' }), h('h2', { text: 'Pruebas' }), log])]));
    return { load: function () { label(); rob.style.left = '0%'; } };
  }

  /* ------------------------------------------------------------------ 17. Entrenar una máquina (sesgo) */
  var FR = [['manzana_roja', 'manzana', 'rojo'], ['manzana_verde', 'manzana', 'verde'], ['manzana_amarilla', 'manzana', 'amarillo'], ['fresa', 'fresa', 'rojo'],
    ['cereza', 'cereza', 'rojo'], ['pera', 'pera', 'verde'], ['platano', 'plátano', 'amarillo'], ['limon', 'limón', 'amarillo']];
  function toolBias(root) {
    var train = [], rule = '', trainEl = h('div', { class: 'pj-train' }), learned = h('p', { class: 'pj-learned' }), test = h('div', { class: 'pj-pool' }), msg = h('div', { class: 'pj-answer' });
    // La máquina busca lo que tienen en común sus ejemplos de «manzana».
    // Si todas las manzanas que ha visto son del mismo color, aprende «manzana = ese color» (sesgo).
    // Si ha visto manzanas de varios colores, aprende que lo que importa es la forma.
    function learn() {
      var apples = train.filter(function (t) { return t[1] === 'manzana'; });
      var colors = apples.map(function (t) { return t[2]; }).filter(function (c, i, a) { return a.indexOf(c) === i; });
      rule = !apples.length ? '' : colors.length === 1 ? 'color:' + colors[0] : 'forma';
      learned.innerHTML = !rule ? 'Todavía no ha aprendido nada.' : rule === 'forma' ? 'La máquina ha aprendido: <b>«manzana = fruta redonda, con rabito, de cualquier color»</b>.' : 'La máquina ha aprendido: <b>«manzana = fruta de color ' + colors[0] + '»</b>.';
    }
    function predict(it) { if (!rule) return null; return rule === 'forma' ? it[1] === 'manzana' : it[2] === rule.split(':')[1]; }
    function drawTrain() { trainEl.innerHTML = train.length ? train.map(function (t) { return '<span class="' + (t[1] === 'manzana' ? 'yes' : 'no') + '">' + pic(t[0]) + '<small>' + (t[1] === 'manzana' ? 'es manzana' : 'no es manzana') + '</small></span>'; }).join('') : '<em>Sin ejemplos todavía</em>'; }
    function set(list) { train = list.map(function (i) { return FR[i]; }); drawTrain(); learn(); msg.innerHTML = '<p class="pj-status">Probad la máquina con las frutas de abajo.</p>'; }
    FR.forEach(function (it) {
      test.appendChild(h('button', { type: 'button', class: 'pj-item pic', title: it[1], html: pic(it[0]) + '<small>' + it[1] + '</small>', onclick: function () {
        var p = predict(it); if (p === null) { msg.innerHTML = '<p class="pj-status">Primero hay que entrenar la máquina.</p>'; return; }
        var ok = p === (it[1] === 'manzana');
        msg.innerHTML = '<div class="pj-do">' + pic(it[0]) + '</div><p class="pj-status">La máquina dice: <b>' + (p ? 'ES UNA MANZANA' : 'NO ES UNA MANZANA') + '</b>. ' + (ok ? 'Ha acertado.' : '<span class="bad">Se ha equivocado.</span>') + '</p>';
      } }));
    });
    root.appendChild(h('div', { class: 'pj-row' }, [btn('1. Entrenar solo con manzanas rojas', function () { set([0, 0, 0, 5, 6, 7]); }), btn('2. Entrenar con manzanas de todos los colores', function () { set([0, 1, 2, 3, 4, 5, 6, 7]); }, 'go')]));
    root.appendChild(h('h2', { text: 'Ejemplos con los que aprende la máquina' })); root.appendChild(trainEl); root.appendChild(learned);
    root.appendChild(h('h2', { text: 'Probad la máquina: tocad una fruta' })); root.appendChild(test); root.appendChild(msg);
    root.appendChild(h('p', { class: 'pj-info', text: 'Con los ejemplos del botón 1, todas las manzanas que ve son rojas, así que la máquina cree que «manzana» significa «rojo»: dice que la fresa y la cereza son manzanas y que la manzana verde no lo es. Eso es un sesgo. Con ejemplos variados (botón 2) aprende lo importante. La máquina aprende de los datos que le damos, también de sus errores.' }));
    root.appendChild(credit());
    return { load: function () { set([0, 0, 0, 5, 6, 7]); } };
  }

  /* ------------------------------------------------------------------ 18. ¿Real o fantasía? / ¿Verdad, bulo o IA? */
  var KIND = {
    titular: '<svg viewBox="0 0 48 48" class="kind"><rect x="6" y="8" width="36" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 16h24M12 23h10M12 30h10M27 23h9v10h-9z" stroke="currentColor" stroke-width="3" fill="none"/></svg>',
    foto: '<svg viewBox="0 0 48 48" class="kind"><rect x="5" y="10" width="38" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="17" cy="20" r="4" fill="currentColor"/><path d="M8 35l11-10 7 6 6-5 10 9" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
    mensaje: '<svg viewBox="0 0 48 48" class="kind"><path d="M8 10h32a3 3 0 013 3v17a3 3 0 01-3 3H20l-9 7v-7H8a3 3 0 01-3-3V13a3 3 0 013-3z" fill="none" stroke="currentColor" stroke-width="3"/></svg>'
  };
  var DECKS = {
    fantasia: { opts: ['Puede pasar de verdad', 'Es inventado'], cards: [
      [['gato_tumbado'], 'El gato duerme en el sofá', 0, 'Los gatos duermen muchas horas al día. Pasa de verdad.'],
      [['vaca', 'volar'], 'La vaca vuela por el cielo', 1, 'Las vacas no tienen alas: no pueden volar.'],
      [['pez'], 'El pez nada en el agua', 0, 'Los peces viven y nadan en el agua. Pasa de verdad.'],
      [['pez', 'leer'], 'El pez lee un libro', 1, 'Los peces no saben leer: es inventado.'],
      [['pajaro_volando'], 'El pájaro vuela', 0, 'Los pájaros tienen alas y vuelan. Pasa de verdad.'],
      [['caballo', 'patinar'], 'El caballo patina sobre ruedas', 1, 'Un caballo no puede ponerse patines: es inventado.'],
      [['vaca', 'vaso_leche'], 'La vaca da leche', 0, 'La leche que bebemos viene de las vacas. Pasa de verdad.'],
      [['perro', 'cantar'], 'El perro canta una canción', 1, 'Los perros ladran, pero no cantan canciones: es inventado.']] },
    bulos: { opts: ['Verdad', 'Bulo', 'Hecho con IA'], cards: [
      ['titular', '«Un colegio de Madrid instala huertos en su patio»', 0, 'Es una noticia normal, sin exagerar, y se puede comprobar en la web del colegio o del ayuntamiento.'],
      ['titular', '«¡Increíble! Un perro aprende a hablar tres idiomas en una semana»', 1, 'Titular exagerado, con exclamaciones, y cuenta algo imposible.'],
      ['foto', 'Foto de una ciudad con edificios que se derriten como un helado', 2, 'Algo imposible con formas raras: es típico de las imágenes hechas con IA.'],
      ['mensaje', '«Mañana no hay clase en toda España. ¡Pásalo!»', 1, 'Pide que lo reenvíes y no dice quién lo dice. Hay que comprobarlo en una fuente oficial.'],
      ['foto', 'Foto de una persona con seis dedos en una mano', 2, 'Los dedos de las manos son uno de los errores más típicos de las imágenes hechas con IA.'],
      ['titular', '«La NASA publica nuevas fotos de Marte tomadas por su robot»', 0, 'La fuente es conocida y se puede comprobar en su web oficial.'],
      ['mensaje', '«Comer un limón al día evita todas las enfermedades»', 1, 'Promete demasiado y no cita a ningún médico ni estudio.']] }
  };
  function toolTruth(root) {
    var deck = 'fantasia', i = 0, card = h('div', { class: 'pj-truth' }), opts = h('div', { class: 'pj-row' }), msg = h('p', { class: 'pj-status' });
    function draw() {
      var D = DECKS[deck], c = D.cards[i];
      var art = deck === 'fantasia' ? '<div class="pj-do">' + c[0].map(function (n) { return pic(n); }).join('<b class="plus">+</b>') + '</div>' : '<div class="pj-kind">' + KIND[c[0]] + '<small>' + { titular: 'Titular', foto: 'Imagen', mensaje: 'Mensaje' }[c[0]] + '</small></div>';
      card.innerHTML = art + '<span>' + c[1] + '</span><small>' + (i + 1) + ' de ' + D.cards.length + '</small>'; msg.textContent = 'Votad primero y después tocad vuestra respuesta.';
      opts.innerHTML = ''; D.opts.forEach(function (o, k) { opts.appendChild(btn(o, function () { msg.innerHTML = (k === c[2] ? '<b class="yes">¡Correcto!</b> ' : '<b class="no">No.</b> Es «' + D.opts[c[2]] + '». ') + c[3]; })); });
      opts.appendChild(btn('Siguiente →', function () { i = (i + 1) % D.cards.length; draw(); }, 'go'));
    }
    root.appendChild(card); root.appendChild(opts); root.appendChild(msg); root.appendChild(credit());
    return { load: function (p) { if (DECKS[p]) deck = p; i = 0; draw(); } };
  }

  /* ------------------------------------------------------------------ 19. Contraseñas */
  function toolPass(root) {
    var inp = h('input', { type: 'text', class: 'pj-input big', placeholder: 'Escribe una contraseña de ejemplo (nunca una real)', autocomplete: 'off', 'aria-label': 'Contraseña de ejemplo' }), bar = h('div', { class: 'pj-meter' }), list = h('ul', { class: 'pj-checks' }), pairs = h('div', { class: 'pj-row' }), msg = h('p', { class: 'pj-status' });
    function score(p) {
      var c = [[p.length >= 12, 'Tiene 12 caracteres o más'], [/[A-Z]/.test(p) && /[a-z]/.test(p), 'Mezcla mayúsculas y minúsculas'], [/\d/.test(p), 'Tiene números'], [/[^A-Za-z0-9]/.test(p), 'Tiene símbolos (. ! ? #)'], [p && !/^(1234|123456|password|contraseña|qwerty|abc)/i.test(p), 'No es una contraseña típica']];
      return c;
    }
    function draw() {
      var c = score(inp.value), n = c.filter(function (x) { return x[0]; }).length;
      bar.innerHTML = '<div class="fill" style="width:' + (n * 20) + '%;background:' + ['#cf3f36', '#cf3f36', '#df7619', '#e8b000', '#2a8f4f', '#2a8f4f'][n] + '"></div><em>' + ['Muy débil', 'Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'][n] + '</em>';
      list.innerHTML = c.map(function (x) { return '<li class="' + (x[0] ? 'ok' : '') + '"><i></i>' + x[1] + '</li>'; }).join('');
    }
    inp.addEventListener('input', draw);
    var PAIRS = [['pepe', 'MiPerroSaltaAlas7!'], ['12345678', 'Luna.Verde.2026'], ['ElSolDeMadrid', 'sol']];
    PAIRS.forEach(function (p, k) { pairs.appendChild(btn('Par ' + (k + 1), function () { msg.innerHTML = '¿Cuál es más segura? A) <b>' + p[0] + '</b> · B) <b>' + p[1] + '</b>'; inp.value = ''; draw(); })); });
    root.appendChild(inp); root.appendChild(bar); root.appendChild(list);
    root.appendChild(h('h2', { text: 'Juego: ¿cuál es más segura?' })); root.appendChild(pairs); root.appendChild(msg);
    root.appendChild(h('p', { class: 'pj-info', text: 'Truco: una frase fácil de recordar con mayúsculas, números y un símbolo. Y la contraseña no se presta nunca, como el cepillo de dientes.' }));
    return { load: draw };
  }

  /* ------------------------------------------------------------------ 20. Temporizador de sesión */
  function toolTimer(root) {
    var PH = { semanal: [['Arranque', 5, 'Pregunta de repaso y minuto de uso responsable'], ['Misión', 7, 'Reto y demostración'], ['Práctica', 23, 'Trabajo en parejas o grupos. Cambio de rol a mitad'], ['Compartir', 5, 'Un grupo enseña su solución o su error'], ['Cierre', 5, 'Frase clave, sello y recogida']],
      quincenal: [['Tarjeta', 3, 'Leer «Dónde lo dejamos»'], ['Misión', 7, 'Reto y demostración'], ['Práctica', 25, 'Trabajo en equipos'], ['Compartir', 5, 'Un equipo enseña su avance'], ['Guardar', 5, 'Guardar archivo, recoger kit, rellenar tarjeta']] };
    var kind = 'semanal', left = 45 * 60, run = null, big = h('div', { class: 'pj-clock' }), phases = h('div', { class: 'pj-phases' });
    function draw() {
      var used = 45 * 60 - left, acc = 0, curI = 0, P = PH[kind];
      P.forEach(function (p, i) { if (used >= acc) curI = i; acc += p[1] * 60; });
      var m = Math.floor(left / 60), s = left % 60;
      // anillo: cuánto queda de la fase actual
      var start = 0; for (var k = 0; k < curI; k++) start += P[k][1] * 60;
      var frac = Math.max(0, Math.min(1, 1 - (used - start) / (P[curI][1] * 60)));
      big.style.setProperty('--p', (frac * 100).toFixed(1));
      big.style.setProperty('--ph', ['var(--c5)', 'var(--c6)', 'var(--c3)', 'var(--c2)', 'var(--c1)'][curI]);
      big.innerHTML = '<div class="pj-ring"><div><b>' + m + ':' + (s < 10 ? '0' : '') + s + '</b><span>' + P[curI][0] + '</span></div></div><small>' + P[curI][2] + '</small>';
      phases.innerHTML = P.map(function (p, i) { return '<div class="' + (i === curI ? 'now' : i < curI ? 'done' : '') + '" style="flex:' + p[1] + '"><b>' + p[0] + '</b><small>' + p[1] + ' min</small></div>'; }).join('');
    }
    function toggle() { if (run) { clearInterval(run); run = null; } else run = setInterval(function () { left = Math.max(0, left - 1); draw(); if (!left) { clearInterval(run); run = null; } }, 1000); }
    root.appendChild(big); root.appendChild(phases);
    root.appendChild(h('div', { class: 'pj-row' }, [btn('Empezar / pausar', toggle, 'go'), btn('Siguiente fase', function () { var P = PH[kind], acc = 0, used = 45 * 60 - left; for (var i = 0; i < P.length; i++) { acc += P[i][1] * 60; if (acc > used) { left = 45 * 60 - acc; break; } } draw(); }), btn('Reiniciar', function () { left = 45 * 60; draw(); }),
      ]));
    return { load: function (p) { kind = PH[p] ? p : 'semanal'; left = 2700; draw(); } };
  }

  /* ------------------------------------------------------------------ 21. Código secreto */
  function toolCipher(root) {
    var SYM = '●■▲◆★▼◀▶◐◑◒◓○□△◇☆▽◁▷✚✖◎▣◈▤▥'.split(''), ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split(''), kind = 'num';
    var inp = h('input', { type: 'text', class: 'pj-input big', placeholder: 'Escribe un mensaje', 'aria-label': 'Mensaje', value: 'HOLA' }), out = h('div', { class: 'pj-cipher' }), key = h('div', { class: 'pj-key' });
    function enc(ch) { var i = ABC.indexOf(ch); if (i < 0) return ch === ' ' ? ' / ' : ch; return kind === 'num' ? (i + 1) : SYM[i]; }
    function draw() {
      out.innerHTML = inp.value.toUpperCase().split('').map(function (c) { return '<span><b>' + enc(c) + '</b><small>' + (c === ' ' ? '␣' : c) + '</small></span>'; }).join('');
      key.innerHTML = ABC.map(function (c, i) { return '<span><b>' + c + '</b>' + (kind === 'num' ? i + 1 : SYM[i]) + '</span>'; }).join('');
    }
    inp.addEventListener('input', draw);
    var hide = h('label', { class: 'pj-chk' }, [h('input', { type: 'checkbox', onchange: function (e) { out.classList.toggle('hideplain', e.target.checked); } }), ' Ocultar el mensaje original']);
    root.appendChild(h('div', { class: 'pj-row' }, [inp, btn('Código de números', function () { kind = 'num'; draw(); }), btn('Código de símbolos', function () { kind = 'sym'; draw(); }), hide]));
    root.appendChild(out); root.appendChild(h('h2', { text: 'Clave' })); root.appendChild(key);
    return { load: draw };
  }

  /* ------------------------------------------------------------------ registro */
  var TOOLS = {
    cuadricula: toolGrid, patrones: toolPatterns, secuencias: toolSequence, bucles: toolLoops, semaforo: toolLight, clasificador: toolSort,
    animales: toolAnimals, votaciones: toolVotes, diagrama: toolFlow, poligonos: toolPoly,
    circuito: toolCircuit, leds: toolLeds, umbral: toolThreshold, velocidad: toolSpeed, sesgo: toolBias, verdad: toolTruth,
    contrasenas: toolPass, temporizador: toolTimer, cifrado: toolCipher
  };
  var mounted = {}, repMounted = {};
  window.PJH = { h: h, btn: btn, shuffle: shuffle, rnd: rnd, arrowSVG: arrowSVG, NS: NS,
    islandSVG: islandSVG, ROBOT_BODY: ROBOT_BODY, svgConfetti: svgConfetti, burst: burst, setStatus: setStatus, replay: replay };
  window.Proyectables = {
    register: function (id, fn) { TOOLS[id] = fn; },
    isMounted: function (id) { return !!(mounted[id] || repMounted[id]); },
    open: function (id, preset) {
      var page = document.getElementById('p-' + id); if (!page || !TOOLS[id]) return;
      var stage = page.querySelector('.pj-stage-root');
      // «Repaso 4º-6º» (proyectables5.js): la misma herramienta, adaptada a 4º-6º, en otro hueco de la página
      var rep = preset === 'repaso' && window.PJRepaso && window.PJRepaso[id];
      var box = stage.__boxes || (stage.__boxes = {});
      if (rep) {
        if (!box.rep) { box.rep = h('div', { class: 'pj-mode' }); stage.appendChild(box.rep); repMounted[id] = window.PJRepaso[id](box.rep); }
        if (box.main) box.main.hidden = true;
        box.rep.hidden = false;
        try { repMounted[id].load(); } catch (e) { console.error(e); }
      } else {
        if (!box.main) { box.main = h('div', { class: 'pj-mode' }); stage.insertBefore(box.main, stage.firstChild); mounted[id] = TOOLS[id](box.main); }
        if (box.rep) box.rep.hidden = true;
        box.main.hidden = false;
        try { mounted[id].load(preset); } catch (e) { console.error(e); }
      }
      var chips = page.querySelectorAll('.rindex-chip');
      Array.prototype.forEach.call(chips, function (c, i) {
        var hp = c.getAttribute('href').split('.')[1] || '';
        if ((preset ? hp === preset : i === 0)) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
      });
    }
  };
  // «Sin animaciones»: se recuerda en este navegador
  function stillLabel() { var on = document.documentElement.classList.contains('pj-still'); document.querySelectorAll('[data-still]').forEach(function (b) { b.textContent = on ? 'Con animaciones' : 'Sin animaciones'; b.setAttribute('aria-pressed', String(on)); }); }
  try { if (localStorage.getItem('ce40-sin-animaciones') === '1') document.documentElement.classList.add('pj-still'); } catch (e) { /* sin almacenamiento */ }
  stillLabel();
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-still]'); if (!b) return;
    var on = document.documentElement.classList.toggle('pj-still');
    try { localStorage.setItem('ce40-sin-animaciones', on ? '1' : '0'); } catch (err) { /* sin almacenamiento */ }
    stillLabel();
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-fullscreen]'); if (!b) return;
    var el = b.closest('section.page');
    if (document.fullscreenElement) { document.exitFullscreen().catch(function () {}); return; }
    if (el.requestFullscreen) el.requestFullscreen().catch(function () { el.classList.toggle('pj-max'); });
    else el.classList.toggle('pj-max');
  });
})();
