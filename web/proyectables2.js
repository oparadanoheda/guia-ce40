/* Segunda tanda de proyectables: Bee-Bot, Hundir la flota, Píxel art, Laberinto de bloques, Cartas binarias, Simón, Balanza, Paridad y ¿Quién sale? */
(function () {
  'use strict';
  var P = window.PJH, h = P.h, btn = P.btn, shuffle = P.shuffle, rnd = P.rnd, NS = P.NS;
  function glyph(k) { var r = { F: 0, R: 90, B: 180, L: 270 }[k]; return '<svg viewBox="0 0 60 60" class="glyph"><g transform="rotate(' + r + ' 30 30)"><path d="M30 50V12M16 26L30 11L44 26" stroke="currentColor" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></svg>'; }
  function turn(k) { return '<svg viewBox="0 0 60 60" class="glyph"><g' + (k === 'L' ? ' transform="translate(60 0) scale(-1 1)"' : '') + '><path d="M14 34A16 16 0 1 1 46 34" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M37 28L46 38L55 28" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></svg>'; }
  function pic(name, cls) { var src = window.PICTO && window.PICTO[name]; return src ? '<img class="pic' + (cls ? ' ' + cls : '') + '" src="' + src + '" alt="" draggable="false">' : ''; }
  function svgPic(name, x, y, s) { var src = window.PICTO && window.PICTO[name]; return src ? '<image href="' + src + '" x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '"/>' : ''; }
  function credit() { return h('p', { class: 'pj-credit', text: window.PICTO_CREDITO || '' }); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var DIRS = ['N', 'E', 'S', 'O'], MV = { N: [0, -1], E: [1, 0], S: [0, 1], O: [-1, 0] }, ROT = { N: 0, E: 90, S: 180, O: 270 };
  var audio = null;
  function tone(freq, dur) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = freq; o.type = 'sine'; g.gain.value = 0.15;
      o.connect(g); g.connect(audio.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + (dur || 0.3)); o.stop(audio.currentTime + (dur || 0.3));
    } catch (e) { /* sin sonido */ }
  }

  /* ------------------------------------------------------------ Bee-Bot interactivo */
  var FARM = [['vaca', 'la vaca'], ['cerdo', 'el cerdo'], ['oveja', 'la oveja'], ['gallina', 'la gallina'], ['granja', 'la granja'], ['caballo', 'el caballo'], ['pato', 'el pato'], ['conejo', 'el conejo'], ['burro', 'el burro'], ['tractor', 'el tractor'], ['cabra', 'la cabra'], ['perro', 'el perro'], ['zanahoria', 'la zanahoria'], ['gallo', 'el gallo'], ['gato', 'el gato'], ['manzana_roja', 'la manzana']];
  var BEE_MATS = {
    cuadricula: { t: 'Cuadrícula libre 6 × 6', n: 6, cell: function () { return ''; } },
    numeros: { t: 'Camino numérico 1-25', n: 5, cell: function (x, y) { var r = 4 - y; var v = r * 5 + (r % 2 ? 5 - x : x + 1); return '<text x="30" y="40" text-anchor="middle" font-size="24" font-weight="700" fill="#1a1d24">' + v + '</text>'; }, label: function (x, y) { var r = 4 - y; return String(r * 5 + (r % 2 ? 5 - x : x + 1)); } },
    letras: { t: 'Abecedario (6 × 6)', n: 6, cell: function (x, y) { var l = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.charAt(y * 6 + x); return l ? '<text x="30" y="41" text-anchor="middle" font-size="26" font-weight="700" fill="#1a1d24">' + l + '</text>' : ''; }, label: function (x, y) { return 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.charAt(y * 6 + x) || 'una casilla vacía'; } },
    granja: { t: 'La granja (4 × 4)', n: 4, cell: function (x, y) { return svgPic(FARM[y * 4 + x][0], 6, 6, 48); }, label: function (x, y) { return FARM[y * 4 + x][1]; } }
  };
  // la abeja vista desde arriba, mirando hacia arriba (la rotación la pone la animación)
  var BEE_BODY = '<ellipse cx="30" cy="54" rx="15" ry="3.5" fill="rgba(0,0,0,.18)"/><ellipse cx="17" cy="24" rx="9" ry="7" fill="#dff3ff" stroke="#1a1d24" stroke-width="1.5" opacity=".95"/><ellipse cx="43" cy="24" rx="9" ry="7" fill="#dff3ff" stroke="#1a1d24" stroke-width="1.5" opacity=".95"/>' +
    '<ellipse cx="30" cy="33" rx="16" ry="20" fill="#f7c600" stroke="#1a1d24" stroke-width="2.2"/>' +
    '<path d="M15 31h30M14 39h32M17 47h26" stroke="#1a1d24" stroke-width="4"/>' +
    '<circle cx="24" cy="18" r="3.6" fill="#1a1d24"/><circle cx="36" cy="18" r="3.6" fill="#1a1d24"/><circle cx="25" cy="17" r="1.2" fill="#fff"/><circle cx="37" cy="17" r="1.2" fill="#fff"/>' +
    '<path d="M25 13Q22 5 18 4M35 13Q38 5 42 4" stroke="#1a1d24" stroke-width="2" fill="none" stroke-linecap="round"/>';
  function toolBee(root) {
    var mat = 'numeros', mem = [], pos, dir, ang = 0, target = null, busy = false, showMem = false, crashed = false;
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'pj-grid pj-beegrid');
    var memEl = h('div', { class: 'pj-beemem' }), msg = h('p', { class: 'pj-status' }), count = h('p', { class: 'pj-big' });
    var C = 60, layers = null;
    function reset() { var n = BEE_MATS[mat].n; pos = [0, n - 1]; dir = 'N'; ang = 0; crashed = false; draw(true); }
    // full = true redibuja el tapete; si no, solo se mueve la abeja (y la animación se ve)
    function draw(full) {
      var M = BEE_MATS[mat], n = M.n, W = n * C + 4;
      if (full || !layers) {
        var s = P.islandSVG(n, C);
        for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
          var tgt = target && target[0] === x && target[1] === y;
          s += '<g transform="translate(' + (x * C + 2) + ' ' + (y * C + 2) + ')" pointer-events="none">' +
            (tgt ? '<circle cx="30" cy="30" r="34" fill="url(#pjglow)" class="pj-glow"/><rect x="3" y="3" width="54" height="54" fill="none" stroke="#df7619" stroke-width="5" rx="6"/>' : '') + M.cell(x, y) + '</g>';
        }
        s += '<g class="pj-bot"><g class="pj-bot-rot"><g class="pj-bot-body">' + BEE_BODY + '</g></g></g><g class="pj-fx"></g>';
        svg.setAttribute('viewBox', '-26 -26 ' + (W + 52) + ' ' + (W + 52)); svg.innerHTML = s;
        layers = { bot: svg.querySelector('.pj-bot'), rot: svg.querySelector('.pj-bot-rot'), body: svg.querySelector('.pj-bot-body'), fx: svg.querySelector('.pj-fx') };
        layers.bot.classList.add('no-anim'); layers.rot.classList.add('no-anim');
      }
      layers.bot.style.transform = 'translate(' + (pos[0] * C + 2) + 'px,' + (pos[1] * C + 2) + 'px)';
      layers.rot.style.transform = 'translate(30px,30px) rotate(' + ang + 'deg) translate(-30px,-30px)';
      layers.body.classList.toggle('pj-shake', crashed);
      if (full) { void svg.getBoundingClientRect(); layers.bot.classList.remove('no-anim'); layers.rot.classList.remove('no-anim'); layers.fx.innerHTML = ''; }
      count.innerHTML = 'Órdenes en la memoria: <b>' + mem.length + '</b>';
      memEl.innerHTML = showMem ? mem.map(function (k) { return '<span>' + (k === 'P' ? '<b>II</b>' : (k === 'L' || k === 'R') ? turn(k) : glyph(k)) + '</span>'; }).join('') || '<em>vacía</em>' : '<em>La memoria está escondida, como en el robot de verdad.</em>';
    }
    function press(k) { if (busy) return; if (mem.length >= 40) { msg.textContent = 'La memoria está llena (40 órdenes).'; return; } mem.push(k); tone(660, 0.08); P.setStatus(msg, '', ''); draw(); }
    async function go() {
      if (busy || !mem.length) return; busy = true; reset(); P.setStatus(msg, '', ''); var n = BEE_MATS[mat].n;
      for (var i = 0; i < mem.length; i++) {
        var k = mem[i];
        if (k === 'L') { dir = DIRS[(DIRS.indexOf(dir) + 3) % 4]; ang -= 90; }
        else if (k === 'R') { dir = DIRS[(DIRS.indexOf(dir) + 1) % 4]; ang += 90; }
        else if (k === 'F' || k === 'B') {
          var d = k === 'F' ? dir : DIRS[(DIRS.indexOf(dir) + 2) % 4];
          var nx = pos[0] + MV[d][0], ny = pos[1] + MV[d][1];
          if (nx < 0 || ny < 0 || nx >= n || ny >= n) { crashed = true; draw(); break; }
          pos = [nx, ny];
        }
        tone(k === 'P' ? 330 : 520, 0.12); draw(); await wait(k === 'P' ? 900 : 650);
      }
      tone(880, 0.25); busy = false;
      var M = BEE_MATS[mat];
      if (crashed) P.setStatus(msg, 'bad', '¡La abeja se sale del tapete! Borra la memoria (botón X) y prueba otra vez.');
      else if (target && pos[0] === target[0] && pos[1] === target[1]) { P.setStatus(msg, 'good', '¡Conseguido! La abeja ha llegado.'); layers.fx.innerHTML = P.svgConfetti(pos[0] * C + 32, pos[1] * C + 32); }
      else if (target) P.setStatus(msg, 'bad', 'Está en ' + (M.label ? M.label(pos[0], pos[1]) : 'otra casilla') + '. ¿Qué orden ha fallado?');
      else P.setStatus(msg, '', M.label ? 'La abeja está en: ' + M.label(pos[0], pos[1]) : '');
    }
    function newTarget() { var n = BEE_MATS[mat].n; do { target = [rnd(n), rnd(n)]; } while (target[0] === 0 && target[1] === n - 1); var M = BEE_MATS[mat]; P.setStatus(msg, '', 'Reto: lleva la abeja a ' + (M.label ? '«' + M.label(target[0], target[1]) + '»' : 'la casilla marcada') + '. Recordad: primero se borra la memoria.'); draw(true); }
    var pad = h('div', { class: 'pj-beepad' }, [
      h('span'), btn(glyph('F'), function () { press('F'); }, 'arrow'), h('span'),
      btn(turn('L'), function () { press('L'); }, 'arrow'), btn('GO', go, 'goBee'), btn(turn('R'), function () { press('R'); }, 'arrow'),
      btn('<b>II</b>', function () { press('P'); }, 'small'), btn(glyph('B'), function () { press('B'); }, 'arrow'), btn('<b>X</b>', function () { if (!busy) { mem = []; reset(); msg.textContent = 'Memoria borrada.'; } }, 'small')]);
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [svg, msg]),
      h('div', { class: 'pj-col' }, [h('div', { class: 'pj-row' }, [btn('Nuevo reto', newTarget, 'go')]), h('div', { class: 'pj-beebody' }, [pad]), count,
        h('label', { class: 'pj-chk' }, [h('input', { type: 'checkbox', onchange: function (e) { showMem = e.target.checked; draw(); } }), ' Ver la memoria (para el docente)']), memEl,
        h('p', { class: 'pj-info', text: 'Flecha arriba: avanza una casilla · flecha abajo: retrocede · flechas curvas: gira sin moverse · II: pausa · X: borra la memoria · GO: ejecuta. Como el robot real, las órdenes se suman a las anteriores hasta que se borra la memoria.' })])]));
    return { load: function (p) { mat = BEE_MATS[p] ? p : 'numeros'; mem = []; target = null; layers = null; reset(); P.setStatus(msg, '', ''); } };
  }

  /* ------------------------------------------------------------ Hundir la flota */
  function toolFleet(root) {
    var n = 5, mode = 'letras', ships = [], shots = {}, turn = 0, teams = false, score = [0, 0], last = null;
    var board = h('div', { class: 'pj-fleet' }), msg = h('p', { class: 'pj-status' }), info = h('div', { class: 'pj-row' });
    var inp = h('input', { class: 'pj-input', placeholder: 'Ej.: B3', 'aria-label': 'Coordenada', size: 6 });
    function label(x, y) { return mode === 'letras' ? 'ABCDEFGH'.charAt(x) + (y + 1) : '(' + x + ', ' + (n - 1 - y) + ')'; }
    function place() {
      var sizes = n === 5 ? [3, 2, 1, 1] : [4, 3, 3, 2, 2, 1]; ships = []; var occ = {};
      sizes.forEach(function (sz) {
        for (var tries = 0; tries < 500; tries++) {
          var hor = rnd(2) === 0, x = rnd(hor ? n - sz + 1 : n), y = rnd(hor ? n : n - sz + 1), cells = [], ok = true;
          for (var i = 0; i < sz; i++) { var cx = x + (hor ? i : 0), cy = y + (hor ? 0 : i); for (var dx = -1; dx <= 1; dx++) for (var dy = -1; dy <= 1; dy++) if (occ[(cx + dx) + ',' + (cy + dy)]) ok = false; cells.push([cx, cy]); }
          if (ok) { cells.forEach(function (c) { occ[c[0] + ',' + c[1]] = 1; }); ships.push({ cells: cells, hits: 0 }); break; }
        }
      });
      shots = {}; score = [0, 0]; turn = 0; last = null; draw(); P.setStatus(msg, '', 'El ordenador ha escondido ' + ships.length + ' barcos. Decid una casilla.');
    }
    function fire(x, y) {
      var k = x + ',' + y; if (shots[k]) { msg.textContent = 'Esa casilla ya se ha dicho.'; return; }
      var hit = null; ships.forEach(function (s) { s.cells.forEach(function (c) { if (c[0] === x && c[1] === y) hit = s; }); });
      if (hit) { hit.hits++; shots[k] = hit.hits === hit.cells.length ? 'sunk' : 'hit'; if (shots[k] === 'sunk') hit.cells.forEach(function (c) { shots[c[0] + ',' + c[1]] = 'sunk'; }); if (teams) score[turn] += hit.hits === hit.cells.length ? 3 : 1; tone(hit.hits === hit.cells.length ? 880 : 660, 0.25); }
      else { shots[k] = 'water'; tone(220, 0.2); }
      var left = ships.filter(function (s) { return s.hits < s.cells.length; }).length;
      P.setStatus(msg, shots[k] === 'water' ? '' : 'good');
      msg.innerHTML = label(x, y) + ': <b>' + (shots[k] === 'water' ? 'agua' : shots[k] === 'hit' ? '¡tocado!' : '¡hundido!') + '</b> · Quedan ' + left + ' barcos · Disparos: ' + Object.keys(shots).length;
      if (!left) msg.innerHTML += ' · <b>¡Flota hundida!</b>';
      if (teams && shots[k] === 'water') turn = 1 - turn;
      last = k; draw();
      if (!left) P.burst(board);
    }
    function draw() {
      board.innerHTML = ''; board.style.gridTemplateColumns = '40px repeat(' + n + ', 1fr)';
      board.appendChild(h('span'));
      for (var x = 0; x < n; x++) board.appendChild(h('b', { text: mode === 'letras' ? 'ABCDEFGH'.charAt(x) : String(x) }));
      for (var y = 0; y < n; y++) {
        board.appendChild(h('b', { text: mode === 'letras' ? String(y + 1) : String(n - 1 - y) }));
        for (var xx = 0; xx < n; xx++) (function (x, y) {
          var st = shots[x + ',' + y];
          var just = last === x + ',' + y;
          board.appendChild(h('button', { type: 'button', class: 'pj-sea ' + (st || '') + (just ? ' just' : ''), 'aria-label': label(x, y), html: st === 'water' ? '<i class="w"></i>' : st === 'hit' ? '<i class="x"></i>' : st === 'sunk' ? '<i class="s"></i>' : '', onclick: function () { fire(x, y); } }));
        })(xx, y);
      }
      info.innerHTML = '';
      if (teams) ['Equipo A', 'Equipo B'].forEach(function (t, i) { info.appendChild(h('span', { class: 'pj-team' + (turn === i ? ' now' : ''), html: t + ': <b>' + score[i] + '</b>' })); });
    }
    function shootText() {
      var v = inp.value.trim().toUpperCase().replace(/\s/g, ''), x, y;
      if (mode === 'letras') { x = 'ABCDEFGH'.indexOf(v.charAt(0)); y = parseInt(v.slice(1), 10) - 1; }
      else { var m = v.match(/\(?(\d+),(\d+)\)?/); if (m) { x = +m[1]; y = n - 1 - +m[2]; } }
      if (x >= 0 && x < n && y >= 0 && y < n) fire(x, y); else msg.textContent = 'No entiendo esa casilla. Ejemplo: ' + (mode === 'letras' ? 'B3' : '2,4');
      inp.value = '';
    }
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') shootText(); });
    root.appendChild(h('div', { class: 'pj-row' }, [btn('Dos equipos', function () { teams = !teams; score = [0, 0]; draw(); }), btn('Nueva partida', place, 'go')]));
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [board]), h('div', { class: 'pj-col' }, [info, h('div', { class: 'pj-row' }, [inp, btn('Disparar', shootText, 'go')]), msg,
      h('p', { class: 'pj-info', html: 'Un alumno dice la casilla <b>primero la columna y después la fila</b> y la toca en la pizarra. En equipos: acertar da 1 punto, hundir un barco da 3, y el turno cambia al fallar.' })])]));
    return { load: function (p) { n = p === 'grande' || p === 'xy' ? 8 : 5; mode = p === 'xy' ? 'xy' : 'letras'; place(); } };
  }

  /* ------------------------------------------------------------ Píxel art con código */
  var PAL = ['#ffffff', '#1a1d24', '#e0443a', '#2c5bbf', '#f5c518', '#2a8f4f'], PALN = ['blanco', 'negro', 'rojo', 'azul', 'amarillo', 'verde'];
  var PIX = {
    corazon: ['0000000000', '0220002200', '2222022220', '2222222220', '2222222220', '0222222200', '0022222000', '0002220000', '0000200000', '0000000000'],
    casa: ['0000220000', '0002222000', '0022222200', '0222222220', '0033333300', '0031131300', '0031131300', '0033113300', '5555555555', '5555555555'],
    robot: ['0000400000', '0000100000', '0333333300', '0311331300', '0333333300', '0332222300', '0333333300', '0010000100', '0010000100', '0110001100'],
    pez: ['0000000000', '0000333000', '0033333300', '3333313330', '0333333333', '3333333330', '0033333300', '0000333000', '0000000000', '0000000000'],
    flecha: ['00100', '01110', '11111', '00100', '00100']
  };
  function rle(row) { var out = [], cur = row[0], k = 0; for (var i = 0; i < row.length; i++) { if (row[i] === cur) k++; else { out.push([cur, k]); cur = row[i]; k = 1; } } out.push([cur, k]); return out; }
  function toolPixel(root) {
    var key = 'corazon', grid = [], color = 1, mode = 'secreto', board = h('div', { class: 'pj-pix' }), code = h('ol', { class: 'pj-pixcode' }), msg = h('p', { class: 'pj-status' }), pal = h('div', { class: 'pj-row' });
    function load(k) { key = PIX[k] ? k : 'corazon'; var S = PIX[key]; grid = S.map(function (r) { return r.split('').map(function () { return 0; }); }); draw(); msg.textContent = mode === 'secreto' ? 'Cada fila dice cuántos cuadrados de cada color hay, de izquierda a derecha. Pintad el dibujo secreto.' : 'Pintad libremente: el código de cada fila se escribe solo.'; }
    function drawCode() {
      var src = mode === 'secreto' ? PIX[key].map(function (r) { return r.split('').map(Number); }) : grid;
      code.innerHTML = src.map(function (r, i) { return '<li>' + rle(r).map(function (p) { return '<span style="--c:' + PAL[p[0]] + '"><i></i>' + p[1] + '</span>'; }).join('') + '</li>'; }).join('');
    }
    function draw() {
      var S = PIX[key], n = S[0].length; board.innerHTML = ''; board.style.gridTemplateColumns = 'repeat(' + n + ', 1fr)';
      grid.forEach(function (r, y) { r.forEach(function (v, x) { var b = h('button', { type: 'button', class: 'pj-px', style: 'background:' + PAL[v], 'aria-label': 'fila ' + (y + 1) + ' columna ' + (x + 1) }); b.addEventListener('click', function () { grid[y][x] = grid[y][x] === color ? 0 : color; b.style.background = PAL[grid[y][x]]; b.classList.remove('bad'); if (mode === 'libre') drawCode(); }); board.appendChild(b); }); });
      drawCode();
      pal.innerHTML = ''; PAL.forEach(function (c, i) { pal.appendChild(h('button', { type: 'button', class: 'pj-swatch' + (i === color ? ' on' : ''), style: 'background:' + c, title: PALN[i], 'aria-label': PALN[i], onclick: function () { color = i; draw(); } })); });
    }
    function check() { var S = PIX[key], bad = 0; board.querySelectorAll('.pj-px').forEach(function (b, i) { var n = S[0].length, y = Math.floor(i / n), x = i % n; var ok = grid[y][x] === +S[y][x]; b.classList.toggle('bad', !ok); if (!ok) bad++; }); msg.textContent = bad ? 'Hay ' + bad + ' cuadrados distintos al código (marcados). ¿Dónde está el bicho?' : '¡Dibujo correcto!'; }
    root.appendChild(h('div', { class: 'pj-row' }, [btn('Comprobar', check), btn('Ver solución', function () { grid = PIX[key].map(function (r) { return r.split('').map(Number); }); draw(); })]));
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [pal, board]), h('div', { class: 'pj-col' }, [h('h4', { text: 'Código de cada fila' }), code, msg,
      h('p', { class: 'pj-info', text: 'Así guarda un ordenador una imagen: como números. «3 blancos, 4 rojos, 3 blancos» ocupa menos que decir el color de cada cuadrado uno a uno.' })])]));
    return { load: function (p) { if (p === 'libre') mode = 'libre'; else { mode = 'secreto'; if (PIX[p]) key = p; } load(key); } };
  }

  /* ------------------------------------------------------------ Laberinto de bloques */
  var LEVELS = [
    { m: ['#####', '#S.M#', '#####'], d: 'E', max: 3, tip: 'Usa «avanzar» hasta llegar a la meta.', allow: ['F'] },
    { m: ['#####', '#..M#', '#.###', '#S###', '#####'], d: 'N', max: 5, tip: 'Hay que girar en la esquina.', allow: ['F', 'L', 'R'] },
    { m: ['#######', '#S....M', '#######'], d: 'E', max: 2, tip: 'Pasillo largo: con «repetir hasta la meta» basta un bloque dentro.', allow: ['F', 'U'] },
    { m: ['#######', '#####M#', '####..#', '###..##', '##..###', '#S.####', '#######'], d: 'E', max: 5, tip: 'Escalera: dentro de «repetir hasta la meta» pon «avanzar, girar izquierda, avanzar, girar derecha».', allow: ['F', 'L', 'R', 'U'] },
    { m: ['######', '#M...#', '####.#', '#S...#', '######'], d: 'E', max: 5, tip: 'Dentro del «repetir», usa «si hay camino a la izquierda».', allow: ['F', 'L', 'R', 'U', 'IL'] },
    { m: ['#######', '#S..#.#', '###.#.#', '#M..#.#', '#.###.#', '#.....#', '#######'], d: 'E', max: 6, tip: 'Sigue la pared: si hay camino delante avanza; si no, gira. Usa «si… si no».', allow: ['F', 'L', 'R', 'U', 'IL', 'IR', 'IF'] }
  ];
  var BL = { F: 'avanzar', L: 'girar ↺ izquierda', R: 'girar ↻ derecha', U: 'repetir hasta la meta', IL: 'si hay camino a la izquierda', IR: 'si hay camino a la derecha', IF: 'si hay camino delante · si no' };
  function toolMaze(root) {
    var lv = 0, prog = [], target = null, st = {}, busy = false;
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'pj-grid');
    var pal = h('div', { class: 'pj-palette' }), progEl = h('div', { class: 'pj-blocks' }), msg = h('p', { class: 'pj-status' }), tip = h('p', { class: 'pj-info' }), lvRow = h('div', { class: 'pj-row' });
    function L() { return LEVELS[lv]; }
    function reset() { var m = L().m; m.forEach(function (r, y) { var x = r.indexOf('S'); if (x >= 0) st = { x: x, y: y, d: L().d, ang: ROT[L().d] }; }); draw(false, true); }
    function load(i) { lv = i; prog = []; target = null; layers = null; lvRow.querySelectorAll('button').forEach(function (b, k) { b.classList.toggle('go', k === i); }); tip.textContent = 'Nivel ' + (i + 1) + ': ' + L().tip + ' Máximo ' + L().max + ' bloques.'; buildPal(); reset(); renderProg(); msg.textContent = ''; }
    function buildPal() { pal.innerHTML = ''; L().allow.forEach(function (k) { pal.appendChild(h('button', { type: 'button', class: 'pj-sblk ' + (k === 'F' || k === 'L' || k === 'R' ? 'mov' : 'ctl'), text: BL[k], onclick: function () { add(k); } })); }); pal.appendChild(h('button', { type: 'button', class: 'pj-card close', html: '<b>Salir del bloque</b><span>Los siguientes van fuera</span>', onclick: function () { target = null; renderProg(); } })); }
    function mk(k) { return k === 'IF' ? { t: k, body: [], alt: [] } : (k === 'U' || k === 'IL' || k === 'IR') ? { t: k, body: [] } : { t: k }; }
    function add(k) { var b = mk(k); (target ? target.list : prog).push(b); if (b.body) target = { list: b.body, blk: b }; renderProg(); }
    function count(list) { return list.reduce(function (a, b) { return a + 1 + (b.body ? count(b.body) : 0) + (b.alt ? count(b.alt) : 0); }, 0); }
    function blkEl(b, list, i) {
      var cls = (b.t === 'F' || b.t === 'L' || b.t === 'R') ? 'mov' : 'ctl';
      var el = h('div', { class: 'pj-bl ' + cls + (target && target.blk === b ? ' act' : '') }, [h('span', { class: 'lbl', text: b.t === 'IF' ? 'si hay camino delante' : BL[b.t] })]);
      el.appendChild(h('button', { type: 'button', class: 'pj-x', text: '×', title: 'Quitar', onclick: function (e) { e.stopPropagation(); list.splice(i, 1); target = null; renderProg(); } }));
      if (b.body) {
        var inner = h('div', { class: 'pj-blin' }); b.body.forEach(function (c, j) { inner.appendChild(blkEl(c, b.body, j)); });
        inner.addEventListener('click', function (e) { if (e.target === inner) { target = { list: b.body, blk: b }; renderProg(); } });
        if (!b.body.length) inner.appendChild(h('span', { class: 'pj-hint', text: 'toca aquí y añade bloques' }));
        el.appendChild(inner);
        el.querySelector('.lbl').addEventListener('click', function () { target = { list: b.body, blk: b }; renderProg(); });
      }
      if (b.alt) {
        el.appendChild(h('span', { class: 'lbl', text: 'si no' }));
        var alt = h('div', { class: 'pj-blin' }); b.alt.forEach(function (c, j) { alt.appendChild(blkEl(c, b.alt, j)); });
        alt.addEventListener('click', function (e) { if (e.target === alt) { target = { list: b.alt, blk: b }; renderProg(); } });
        if (!b.alt.length) alt.appendChild(h('span', { class: 'pj-hint', text: 'toca aquí para el «si no»' }));
        el.appendChild(alt);
      }
      return el;
    }
    function renderProg() { progEl.innerHTML = ''; progEl.appendChild(h('div', { class: 'pj-bl evt', html: '<span class="lbl">al empezar</span>' })); prog.forEach(function (b, i) { progEl.appendChild(blkEl(b, prog, i)); }); var c = count(prog); P.setStatus(msg, '', 'Bloques: ' + c + ' de ' + L().max + (c > L().max ? ' · ¡Demasiados! Busca una forma más corta.' : '')); }
    function cellAt(x, y) { var r = L().m[y]; return r ? r.charAt(x) : '#'; }
    function free(dir) { var d = MV[dir]; return cellAt(st.x + d[0], st.y + d[1]) !== '#'; }
    function atGoal() { return cellAt(st.x, st.y) === 'M'; }
    var C = 50, layers = null;
    // full = true redibuja el laberinto; si no, solo se mueve el robot (con animación)
    function draw(fail, full) {
      var m = L().m;
      if (full || !layers) {
        var W = m[0].length * C, H = m.length * C, s = '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#8fcf6e"/>';
        m.forEach(function (r, y) { r.split('').forEach(function (ch, x) {
          if (ch === '#') s += '<rect x="' + x * C + '" y="' + y * C + '" width="' + C + '" height="' + C + '" fill="' + ((x + y) % 2 ? '#8fcf6e' : '#9ed97c') + '"/>' +
            '<ellipse cx="' + (x * C + 25) + '" cy="' + (y * C + 44) + '" rx="13" ry="3.5" fill="rgba(0,0,0,.15)"/><rect x="' + (x * C + 22) + '" y="' + (y * C + 32) + '" width="6" height="12" rx="2" fill="#7a5230"/>' +
            '<circle cx="' + (x * C + 25) + '" cy="' + (y * C + 20) + '" r="15" fill="#3f7d2c"/><circle cx="' + (x * C + 18) + '" cy="' + (y * C + 26) + '" r="10" fill="#4f9636"/><circle cx="' + (x * C + 31) + '" cy="' + (y * C + 15) + '" r="5" fill="#63ad46"/>';
          else s += '<rect x="' + (x * C + 1) + '" y="' + (y * C + 1) + '" width="' + (C - 2) + '" height="' + (C - 2) + '" rx="6" fill="#f2d39b" stroke="#d9b06a" stroke-width="1.5"/>';
          if (ch === 'M') s += '<circle cx="' + (x * C + 25) + '" cy="' + (y * C + 25) + '" r="30" fill="url(#pjglowm)" class="pj-glow"/><g transform="translate(' + (x * C + 14) + ' ' + (y * C + 7) + ')"><rect x="0" y="0" width="4" height="38" rx="1.5" fill="#1a1d24"/><path class="pj-flag" d="M4 2h22l-6 8 6 8H4z" fill="#cf3f36"/></g>';
        }); });
        s = '<defs><radialGradient id="pjglowm"><stop offset="0" stop-color="#ffe066" stop-opacity=".9"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient></defs>' + s;
        s += '<g class="pj-bot"><g class="pj-bot-rot"><g class="pj-bot-body">' + P.ROBOT_BODY + '</g></g></g><g class="pj-fx"></g>';
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.innerHTML = s;
        layers = { bot: svg.querySelector('.pj-bot'), rot: svg.querySelector('.pj-bot-rot'), body: svg.querySelector('.pj-bot-body'), fx: svg.querySelector('.pj-fx') };
        layers.bot.classList.add('no-anim'); layers.rot.classList.add('no-anim');
      }
      // el robot mide 60 y la casilla 50: se escala a 50/60
      layers.bot.style.transform = 'translate(' + (st.x * C) + 'px,' + (st.y * C) + 'px) scale(0.8333)';
      layers.rot.style.transform = 'translate(30px,30px) rotate(' + st.ang + 'deg) translate(-30px,-30px)';
      layers.body.classList.toggle('pj-shake', !!fail);
      if (full) { void svg.getBoundingClientRect(); layers.bot.classList.remove('no-anim'); layers.rot.classList.remove('no-anim'); layers.fx.innerHTML = ''; }
    }
    async function run() {
      if (busy) return; busy = true; reset(); P.setStatus(msg, '', ''); var steps = 0, fail = false;
      async function exec(list) {
        for (var i = 0; i < list.length; i++) {
          if (fail || atGoal() || steps > 150) return; var b = list[i]; steps++;
          if (b.t === 'F') { if (!free(st.d)) { fail = true; draw(true); return; } st.x += MV[st.d][0]; st.y += MV[st.d][1]; }
          else if (b.t === 'L') { st.d = DIRS[(DIRS.indexOf(st.d) + 3) % 4]; st.ang -= 90; }
          else if (b.t === 'R') { st.d = DIRS[(DIRS.indexOf(st.d) + 1) % 4]; st.ang += 90; }
          else if (b.t === 'U') { var guard = 0; while (!atGoal() && !fail && guard++ < 60) { var before = steps; await exec(b.body); if (steps === before) break; } continue; }
          else if (b.t === 'IL') { if (free(DIRS[(DIRS.indexOf(st.d) + 3) % 4])) await exec(b.body); continue; }
          else if (b.t === 'IR') { if (free(DIRS[(DIRS.indexOf(st.d) + 1) % 4])) await exec(b.body); continue; }
          else if (b.t === 'IF') { if (free(st.d)) await exec(b.body); else await exec(b.alt); continue; }
          draw(); await wait(380);
        }
      }
      await exec(prog); busy = false;
      if (atGoal()) {
        var okMax = count(prog) <= L().max;
        P.setStatus(msg, okMax ? 'good' : 'bad', okMax ? '¡Meta! Nivel superado con ' + count(prog) + ' bloques.' : '¡Meta! Pero con ' + count(prog) + ' bloques: el reto es usar ' + L().max + ' o menos.'); tone(880, .3);
        if (okMax) layers.fx.innerHTML = P.svgConfetti(st.x * C + 25, st.y * C + 25);
      }
      else P.setStatus(msg, 'bad', fail ? '¡Choque contra un árbol! Revisa el programa paso a paso.' : 'No ha llegado a la meta. ¿Qué falta?');
    }
    LEVELS.forEach(function (_, i) { lvRow.appendChild(btn(String(i + 1), function () { load(i); })); });
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [svg, tip, msg]),
      h('div', { class: 'pj-col' }, [h('h4', { text: 'Bloques' }), pal, h('h4', { text: 'Programa (toca dentro de un bloque naranja para meter bloques)' }), progEl,
        h('div', { class: 'pj-row' }, [btn('▶ Ejecutar', run, 'go'), btn('↺ Volver a empezar', function () { reset(); msg.textContent = ''; }), btn('Borrar programa', function () { prog = []; target = null; renderProg(); reset(); })])])]));
    return { load: function (p) { var i = parseInt(p, 10); load(i >= 1 && i <= LEVELS.length ? i - 1 : 0); } };
  }

  /* ------------------------------------------------------------ Cartas binarias */
  function toolBinary(root) {
    var k = 5, on = [], goal = null, cards = h('div', { class: 'pj-bin-cards' }), out = h('p', { class: 'pj-big' }), msg = h('p', { class: 'pj-status' });
    function vals() { var v = []; for (var i = k - 1; i >= 0; i--) v.push(Math.pow(2, i)); return v; }
    function draw() {
      var V = vals(); cards.innerHTML = '';
      V.forEach(function (v, i) {
        var dots = ''; for (var d = 0; d < v; d++) dots += '<i></i>';
        var c = h('button', { type: 'button', class: 'pj-bcard' + (on[i] ? ' on' : ''), html: on[i] ? '<div class="dots">' + dots + '</div><b>' + v + '</b>' : '<span>?</span>' });
        c.addEventListener('click', function () { on[i] = !on[i]; tone(on[i] ? 660 : 330, .08); draw(); }); cards.appendChild(c);
      });
      var sum = V.reduce(function (a, v, i) { return a + (on[i] ? v : 0); }, 0);
      out.innerHTML = 'Puntos: <b>' + sum + '</b> &nbsp; En binario: <b style="font-family:var(--mono)">' + on.map(function (x) { return x ? 1 : 0; }).join('') + '</b>';
      if (goal !== null) msg.textContent = sum === goal ? '¡Correcto! ' + goal + ' = ' + on.map(function (x) { return x ? 1 : 0; }).join('') : 'Reto: forma el número ' + goal + '.';
    }
    function setK(x) { k = x; on = new Array(k).fill(false); goal = null; msg.textContent = ''; draw(); }
    root.appendChild(h('div', { class: 'pj-row' }, [btn('Reto: forma un número', function () { goal = 1 + rnd(Math.pow(2, k) - 1); on = new Array(k).fill(false); draw(); }, 'go'),
      btn('Contar +1', function () { var V = vals(), sum = V.reduce(function (a, v, i) { return a + (on[i] ? v : 0); }, 0) + 1; if (sum >= Math.pow(2, k)) sum = 0; on = V.map(function (v) { if (sum >= v) { sum -= v; return true; } return false; }); goal = null; draw(); }),
      btn('Todas boca abajo', function () { on = new Array(k).fill(false); draw(); })]));
    root.appendChild(cards); root.appendChild(out); root.appendChild(msg);
    root.appendChild(h('p', { class: 'pj-info', text: 'Cada carta tiene el doble de puntos que la de su derecha. Carta visible = 1, carta tapada = 0. Así cuentan los ordenadores: solo con unos y ceros. ¿Cuál es el número más grande con 5 cartas?' }));
    return { load: function (p) { setK(p === '3' ? 3 : p === '4' ? 4 : 5); } };
  }

  /* ------------------------------------------------------------ Simón: memoria de secuencias */
  function toolSimon(root) {
    var PADS = [['F', '#e0443a', 392], ['R', '#2c5bbf', 494], ['B', '#2a8f4f', 587], ['L', '#d99a00', 659]];
    var seq = [], pos = 0, playing = false, pads = h('div', { class: 'pj-simon' }), msg = h('p', { class: 'pj-status' }), lvl = h('p', { class: 'pj-big' }), cardsRow = h('div', { class: 'pj-ltoks' }), showCards = false;
    var els = PADS.map(function (p, i) { var b = h('button', { type: 'button', class: 'pj-pad', style: 'background:' + p[1], html: glyph(p[0]) }); b.addEventListener('click', function () { press(i); }); pads.appendChild(b); return b; });
    function flash(i) { els[i].classList.add('lit'); tone(PADS[i][2], .35); return wait(420).then(function () { els[i].classList.remove('lit'); return wait(150); }); }
    async function play() { playing = true; msg.textContent = 'Mirad y escuchad…'; for (var i = 0; i < seq.length; i++) await flash(seq[i]); playing = false; pos = 0; msg.textContent = 'Ahora, ¡repetid la secuencia!'; draw(); }
    function draw() { lvl.innerHTML = 'Longitud de la secuencia: <b>' + seq.length + '</b>'; cardsRow.innerHTML = showCards ? seq.map(function (s) { return '<span class="tk" style="color:' + PADS[s][1] + '">' + glyph(PADS[s][0]) + '</span>'; }).join('') : ''; }
    function press(i) {
      if (playing || !seq.length) return; flash(i);
      if (i !== seq[pos]) { msg.textContent = '¡Bicho! Tocaba la flecha ' + { F: 'roja (arriba)', R: 'azul (derecha)', B: 'verde (abajo)', L: 'amarilla (izquierda)' }[PADS[seq[pos]][0]] + '. Habéis llegado a ' + (seq.length - 1) + ' pasos. Pulsad «Empezar» para otra ronda.'; seq = []; draw(); return; }
      pos++; if (pos === seq.length) { msg.textContent = '¡Bien! Una más…'; seq.push(rnd(4)); draw(); setTimeout(play, 900); }
    }
    root.appendChild(h('div', { class: 'pj-row' }, [btn('▶ Empezar', function () { seq = [rnd(4), rnd(4)]; draw(); play(); }, 'go'), btn('Repetir la secuencia', function () { if (seq.length) play(); }),
      h('label', { class: 'pj-chk' }, [h('input', { type: 'checkbox', onchange: function (e) { showCards = e.target.checked; draw(); } }), ' Ver la secuencia escrita (como un programa)'])]));
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col center' }, [pads]), h('div', { class: 'pj-col' }, [lvl, cardsRow, msg,
      h('p', { class: 'pj-info', text: 'Cada ronda añade un paso. Salen alumnos por turnos a tocar la secuencia. Una secuencia es un programa: el orden importa.' })])]));
    return { load: function () { seq = []; draw(); msg.textContent = 'Pulsa «Empezar».'; } };
  }

  /* ------------------------------------------------------------ Balanza para ordenar */
  function toolScale(root) {
    var n = 6, w = [], order = [], cmp = 0, sel = [], row = h('div', { class: 'pj-boxes' }), scale = h('div', { class: 'pj-scale' }), msg = h('p', { class: 'pj-status' }), revealed = false;
    var NAMES = 'ABCDEFGH';
    function start(k) { n = k || n; var pool = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n); w = pool; order = Array.from({ length: n }, function (_, i) { return i; }); cmp = 0; sel = []; revealed = false; draw(); scale.innerHTML = '<div class="beam"><span>?</span><span>?</span></div>'; msg.textContent = 'Las cajas pesan distinto, pero no se ve cuánto. Tocad dos cajas para compararlas en la balanza.'; }
    function draw() {
      row.innerHTML = '';
      order.forEach(function (b, i) {
        var e = h('button', { type: 'button', class: 'pj-box' + (sel.indexOf(i) >= 0 ? ' sel' : ''), html: '<b>' + NAMES[b] + '</b>' + (revealed ? '<small>' + w[b] + ' kg</small>' : '') });
        e.addEventListener('click', function () { if (sel.indexOf(i) >= 0) sel.splice(sel.indexOf(i), 1); else sel.push(i); if (sel.length > 2) sel.shift(); draw(); });
        row.appendChild(e);
      });
    }
    function compare() {
      if (sel.length !== 2) { msg.textContent = 'Elige dos cajas.'; return; }
      var a = order[sel[0]], b = order[sel[1]]; cmp++;
      var heavy = w[a] > w[b] ? a : b;
      scale.innerHTML = '<div class="beam ' + (heavy === a ? 'left' : 'right') + '"><span>' + NAMES[a] + '</span><span>' + NAMES[b] + '</span></div>';
      msg.textContent = 'Pesa más ' + NAMES[heavy] + '. Comparaciones: ' + cmp + '.'; tone(440, .15);
    }
    function swap() { if (sel.length !== 2) { msg.textContent = 'Elige dos cajas para cambiarlas de sitio.'; return; } var t = order[sel[0]]; order[sel[0]] = order[sel[1]]; order[sel[1]] = t; sel = []; draw(); }
    function check() { var ok = order.every(function (b, i) { return i === 0 || w[order[i - 1]] < w[b]; }); revealed = true; draw(); msg.textContent = ok ? '¡Ordenadas de la más ligera a la más pesada con ' + cmp + ' comparaciones! ¿Se podría con menos?' : 'Todavía no están en orden. Mirad los pesos.'; }
    root.appendChild(h('div', { class: 'pj-row' }, [btn('Nueva partida', function () { start(); }, 'go')]));
    root.appendChild(row); root.appendChild(h('div', { class: 'pj-row' }, [btn('Comparar en la balanza', compare, 'go'), btn('Cambiar de sitio', swap), btn('Comprobar el orden', check)]));
    root.appendChild(scale); root.appendChild(msg);
    root.appendChild(h('p', { class: 'pj-info', text: 'Objetivo: ordenar las cajas de la más ligera (izquierda) a la más pesada (derecha) usando la balanza el menor número de veces. Una estrategia: buscar la más ligera, ponerla la primera y repetir con las demás. Eso es un algoritmo de ordenación.' }));
    return { load: function (p) { start(p === '4' ? 4 : p === '8' ? 8 : 6); } };
  }

  /* ------------------------------------------------------------ Truco de magia de paridad */
  function toolParity(root) {
    var n = 5, g = [], parity = false, flipped = null, board = h('div', { class: 'pj-parity' }), msg = h('p', { class: 'pj-status' });
    function start() { g = []; for (var y = 0; y < n + 1; y++) { g.push([]); for (var x = 0; x < n + 1; x++) g[y].push(rnd(2)); } parity = false; flipped = null; draw(); msg.textContent = 'Paso 1: esta es la cuadrícula del alumnado (5 × 5). Paso 2: el mago añade una fila y una columna «para hacerlo más difícil».'; }
    function addParity() {
      for (var y = 0; y < n; y++) { var s = 0; for (var x = 0; x < n; x++) s += g[y][x]; g[y][n] = s % 2; }
      for (var xx = 0; xx <= n; xx++) { var t = 0; for (var yy = 0; yy < n; yy++) t += g[yy][xx]; g[n][xx] = t % 2; }
      parity = true; flipped = null; draw(); msg.textContent = 'Paso 3: el mago se da la vuelta. Un alumno toca UNA carta para darle la vuelta. Paso 4: el mago la adivina.';
    }
    function guess() {
      var row = -1, col = -1;
      for (var y = 0; y <= n; y++) { var s = 0; for (var x = 0; x <= n; x++) s += g[y][x]; if (s % 2) row = y; }
      for (var xx = 0; xx <= n; xx++) { var t = 0; for (var yy = 0; yy <= n; yy++) t += g[yy][xx]; if (t % 2) col = xx; }
      if (row < 0) { msg.textContent = 'No se ha dado la vuelta a ninguna carta.'; return; }
      board.querySelectorAll('.pj-pc')[row * (n + 1) + col].classList.add('found');
      msg.textContent = '¡Es esta! Fila ' + (row + 1) + ', columna ' + (col + 1) + '. El truco: con las cartas añadidas, cada fila y cada columna tenía un número PAR de cartas azules. La fila y la columna que ahora tienen un número impar señalan la carta.';
    }
    function draw() {
      board.innerHTML = ''; board.style.gridTemplateColumns = 'repeat(' + (n + 1) + ', 1fr)';
      for (var y = 0; y <= n; y++) for (var x = 0; x <= n; x++) (function (x, y) {
        var extra = (x === n || y === n);
        var b = h('button', { type: 'button', class: 'pj-pc' + (g[y][x] ? ' blue' : '') + (extra ? ' extra' : '') + (extra && !parity ? ' hidden' : '') });
        b.addEventListener('click', function () { if (extra && !parity) return; g[y][x] = 1 - g[y][x]; flipped = [x, y]; draw(); });
        board.appendChild(b);
      })(x, y);
    }
    root.appendChild(h('div', { class: 'pj-row' }, [btn('Nueva cuadrícula', start), btn('El mago añade fila y columna', addParity, 'go'), btn('El mago adivina la carta', guess, 'go')]));
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col center' }, [board]), h('div', { class: 'pj-col' }, [msg,
      h('p', { class: 'pj-info', text: 'Los ordenadores usan este mismo truco (bits de paridad) para descubrir si un dato se ha estropeado al enviarlo. Basado en la actividad «Detección de errores» de CS Unplugged.' })])]));
    return { load: start };
  }

  /* ------------------------------------------------------------ ¿Quién sale? y marcador */
  function toolPicker(root) {
    var list = [], left = [], big = h('div', { class: 'pj-pick' }, [h('b', { text: '?' })]), info = h('p', { class: 'pj-info' }), teams = [0, 0, 0, 0], tEl = h('div', { class: 'pj-teams' });
    var num = h('input', { type: 'number', min: 2, max: 40, value: 25, class: 'pj-input', 'aria-label': 'Número de alumnos' });
    var names = h('textarea', { class: 'pj-input', rows: 3, placeholder: 'Opcional: nombres o números de equipo, uno por línea', 'aria-label': 'Nombres' });
    function prepare() { var ns = names.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean); list = ns.length ? ns : Array.from({ length: +num.value || 25 }, function (_, i) { return String(i + 1); }); left = shuffle(list); info.textContent = 'Quedan ' + left.length + ' por salir.'; }
    async function pick() {
      if (!left.length) prepare();
      var chosen = left.pop();
      for (var i = 0; i < 12; i++) { big.firstChild.textContent = list[rnd(list.length)]; tone(300 + i * 40, .05); await wait(60 + i * 12); }
      big.firstChild.textContent = chosen; tone(880, .3); info.textContent = 'Quedan ' + left.length + ' por salir (nadie repite hasta que salgan todos).';
    }
    function drawTeams() { tEl.innerHTML = ''; ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4'].forEach(function (t, i) { tEl.appendChild(h('div', { class: 'pj-teambox' }, [h('span', { text: t }), h('b', { text: teams[i] }), h('div', { class: 'pj-row tight' }, [btn('+1', function () { teams[i]++; drawTeams(); }, 'go'), btn('−1', function () { teams[i] = Math.max(0, teams[i] - 1); drawTeams(); })])])); }); }
    root.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col center' }, [big, btn('¿Quién sale?', pick, 'go'), info]),
      h('div', { class: 'pj-col' }, [h('label', { class: 'pj-chk' }, ['Número de alumnos: ', num]), names, btn('Usar esta lista', prepare), h('h4', { text: 'Marcador de equipos' }), tEl, btn('Poner a cero', function () { teams = [0, 0, 0, 0]; drawTeams(); })])]));
    return { load: function () { prepare(); drawTeams(); } };
  }

  var R = window.Proyectables.register;
  R('beebot', toolBee); R('flota', toolFleet); R('pixelart', toolPixel); R('laberinto', toolMaze); R('binario', toolBinary);
  R('simon', toolSimon); R('balanza', toolScale); R('paridad', toolParity); R('quiensale', toolPicker);
})();
