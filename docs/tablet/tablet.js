/* Retos en la tablet · Código Escuela 4.0
   Página para el alumnado: se abre con un QR (…/tablet/#robot, #coordenadas, #variables, #cubos, #adivina).
   Sin cuentas y sin conexión con nada: las estrellas se guardan solo en esta tablet (localStorage) y se pueden borrar.
   Para la diversidad del aula: el primer fallo de cada reto no cuenta (sale una pista y se vuelve a intentar),
   «Escuchar» lee la pantalla en voz alta, no hay tiempo ni sonidos y se puede empezar por cualquier nivel. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function $(id) { return document.getElementById(id); }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) e.append(c); });
    return e;
  }
  var PRUEBA = {};
  var teclaFisica = null;  // lo que hace el teclado del ordenador en la actividad abierta
  var conRaton = matchMedia('(pointer: fine)').matches;  // estado actual de cada actividad, para las pruebas automáticas
  function rnd(n) { return Math.floor(Math.random() * n); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function quieto() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function sg(n) { return n < 0 ? '−' + (-n) : String(n); }
  function num(n) { return n >= 10000 ? n.toLocaleString('es-ES') : sg(n); }
  var ICO = {
    bien: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#257f46"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mal: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#c8382f"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#2c5bbf"/><path d="M12 11v6M12 7.2v.1" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
    pista: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#ad5b12"/><path d="M12 5.6a4.3 4.3 0 0 0-2.5 7.8c.6.4.9 1 .9 1.6h3.2c0-.6.3-1.2.9-1.6A4.3 4.3 0 0 0 12 5.6zM10.4 17.6h3.2" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    avanza: '<svg viewBox="0 0 24 24"><path d="M12 3l7 8h-4.5v10h-5V11H5z"/></svg>',
    izq: '<svg viewBox="0 0 24 24"><path d="M9 4L3 9.5 9 15v-3.5h5a3.5 3.5 0 0 1 3.5 3.5v6h3v-6A6.5 6.5 0 0 0 14 8.5H9z"/></svg>',
    der: '<svg viewBox="0 0 24 24"><path d="M15 4l6 5.5-6 5.5v-3.5h-5A3.5 3.5 0 0 0 6.5 15v6h-3v-6A6.5 6.5 0 0 1 10 8.5h5z"/></svg>',
    rep: '<svg viewBox="0 0 24 24"><path d="M17 3l4 4-4 4V8H8a3 3 0 0 0-3 3v1H2v-1a6 6 0 0 1 6-6h9zM7 21l-4-4 4-4v3h9a3 3 0 0 0 3-3v-1h3v1a6 6 0 0 1-6 6H7z"/></svg>'
  };
  function estrella(on, tam) { return '<svg viewBox="0 0 24 24" width="' + (tam || 22) + '" height="' + (tam || 22) + '" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" fill="' + (on ? '#f5c518' : '#d5dae3') + '" stroke="' + (on ? '#b8860b' : '#b9c0cc') + '" stroke-width="1.2" stroke-linejoin="round"/></svg>'; }
  function tresEstrellas(n, tam) { return '<span class="e3" aria-label="' + n + ' de 3 estrellas">' + estrella(n >= 1, tam) + estrella(n >= 2, tam) + estrella(n >= 3, tam) + '</span>'; }

  /* ------------------------------------------------------------ estrellas guardadas en la tablet */
  var CLAVE = 'ce40-tablet-v1', PROG = {};
  try { PROG = JSON.parse(localStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { PROG = {}; }
  function guarda() { try { localStorage.setItem(CLAVE, JSON.stringify(PROG)); } catch (e) { /* sin almacenamiento: no pasa nada */ } }
  function estrellasDe(act, nivel) { return (PROG[act] && PROG[act][nivel]) || 0; }
  function apunta(act, nivel, n) { PROG[act] = PROG[act] || {}; if (n > (PROG[act][nivel] || 0)) { PROG[act][nivel] = n; guarda(); } }
  function totalDe(a) { var t = 0; for (var i = 1; i <= a.niveles.length; i++) t += estrellasDe(a.id, i); return t; }

  /* ------------------------------------------------------------ pantalla completa */
  var docEl = document.documentElement, botonPC = $('pc');
  function puedePC() { return !!(docEl.requestFullscreen || docEl.webkitRequestFullscreen); }
  function enPC() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function instalada() { return matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }
  function ponerPC() {
    var f = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
    if (!f) return;
    try { var p = f.call(docEl, { navigationUI: 'hide' }); if (p && p.catch) p.catch(function () {}); } catch (e) { /* el navegador no lo permite */ }
  }
  function quitarPC() { var f = document.exitFullscreen || document.webkitExitFullscreen; if (f) try { f.call(document); } catch (e) { /* nada */ } }
  function marcaPC() {
    var on = enPC();
    botonPC.setAttribute('aria-pressed', String(on));
    botonPC.querySelector('span').textContent = on ? 'Salir de pantalla completa' : 'Pantalla completa';
    botonPC.hidden = instalada() || !puedePC();
  }
  botonPC.addEventListener('click', function () { if (enPC()) quitarPC(); else ponerPC(); });
  document.addEventListener('fullscreenchange', marcaPC);
  document.addEventListener('webkitfullscreenchange', marcaPC);
  // al abrir: una pantalla con el botón grande (pasar a pantalla completa necesita que se toque algo)
  function entrada() {
    var visto = false;
    try { visto = sessionStorage.getItem('ce40-tablet-entrada') === '1'; } catch (e) { /* nada */ }
    if (visto || instalada() || enPC()) return;
    var caja = $('entrada');
    if (!puedePC()) { $('entrada-pc').hidden = true; $('entrada-nota').hidden = false; $('entrada-no').textContent = 'Entendido'; }
    caja.hidden = false;
    function cierra() { caja.hidden = true; try { sessionStorage.setItem('ce40-tablet-entrada', '1'); } catch (e) { /* nada */ } }
    $('entrada-pc').onclick = function () { ponerPC(); cierra(); };
    $('entrada-no').onclick = cierra;
  }

  /* ------------------------------------------------------------ piezas comunes */
  function estado(el, tipo, html) {
    el.className = 'estado' + (tipo ? ' ' + tipo : '');
    el.innerHTML = (tipo === 'bien' ? ICO.bien : tipo === 'mal' ? ICO.mal : tipo === 'pista' ? ICO.pista : ICO.info) + '<span>' + html + '</span>';
    if (tipo && !quieto()) { el.classList.remove('anim-sale'); void el.offsetWidth; el.classList.add('anim-sale'); }
  }
  function boton(texto, fn, cls) { return h('button', { type: 'button', class: 'boton' + (cls ? ' ' + cls : ''), html: texto, onclick: fn }); }
  // teclado numérico propio (así no sale el teclado de la tablet y tapa la pantalla)
  function teclado(casillas, ok, conMenos) {
    var act = 0, vals = casillas.map(function () { return ''; });
    function pinta() { casillas.forEach(function (c, i) { c.textContent = vals[i] === '' ? ' ' : vals[i].replace('-', '−'); c.classList.toggle('activa', i === act); }); }
    casillas.forEach(function (c, i) { c.addEventListener('click', function () { act = i; pinta(); }); });
    function tecla(t) {
      if (t === 'ok') { ok(vals.map(function (v) { return v === '' || v === '-' ? null : Number(v); })); return; }
      var v = vals[act];
      if (t === 'borra') v = v.slice(0, -1);
      else if (t === '-') v = v.charAt(0) === '-' ? v.slice(1) : '-' + v;
      else if (v.replace('-', '').length < 7) v = (v === '0' ? '' : v === '-0' ? '-' : v) + t;
      vals[act] = v; pinta();
    }
    var teclas = ['7', '8', '9', 'borra', '4', '5', '6', conMenos ? '-' : '', '1', '2', '3', '', '0', 'ok'];
    var t = h('div', { class: 'teclado' });
    teclas.forEach(function (k) {
      if (k === '') { t.append(h('span')); return; }
      var b = h('button', { type: 'button', class: 'tecla' + (k === 'ok' ? ' ok' : k === 'borra' ? ' borra' : ''), text: k === 'borra' ? 'Borrar' : k === 'ok' ? 'Comprobar' : k === '-' ? '−' : k,
        'aria-label': k === 'borra' ? 'Borrar' : k === 'ok' ? 'Comprobar' : k === '-' ? 'Menos' : k, onclick: function () { tecla(k); } });
      if (k === 'ok') b.style.gridColumn = 'span 2';
      t.append(b);
    });
    teclaFisica = function (k) {
      if (/^[0-9]$/.test(k)) { tecla(k); return true; }
      if (k === 'Backspace' || k === 'Delete') { tecla('borra'); return true; }
      if (k === 'Enter') { tecla('ok'); return true; }
      if ((k === '-' || k === 'Subtract') && conMenos) { tecla('-'); return true; }
      if (casillas.length > 1 && (k === 'Tab' || k === 'ArrowRight' || k === ',' || k === 'ArrowLeft')) { act = (act + (k === 'ArrowLeft' ? casillas.length - 1 : 1)) % casillas.length; pinta(); return true; }
      return false;
    };
    if (conRaton) t.append(h('p', { class: 'pista-teclado', text: casillas.length > 1 ? 'Con el teclado: números, flecha → para pasar a la otra casilla y Enter.' : 'Con el teclado: números y Enter.' }));
    pinta();
    return { el: t, limpia: function () { vals = casillas.map(function () { return ''; }); act = 0; pinta(); }, siguiente: function () { if (act < casillas.length - 1) { act++; pinta(); } } };
  }
  function casilla() { return h('div', { class: 'casilla', role: 'button', tabindex: '0', 'aria-label': 'respuesta' }); }
  // teclado de letras (con la Ñ): escribe en una casilla ancha
  function tecladoLetras(cas, ok) {
    var val = '';
    function pinta() { cas.textContent = val === '' ? ' ' : val; cas.classList.add('activa'); }
    function tecla(t) {
      if (t === 'ok') { ok(val); return; }
      if (t === 'borra') val = val.slice(0, -1); else if (val.length < 14) val += t;
      pinta();
    }
    var t = h('div', { class: 'teclado letras' });
    'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('').forEach(function (k) { t.append(h('button', { type: 'button', class: 'tecla', text: k, onclick: function () { tecla(k); } })); });
    t.append(h('button', { type: 'button', class: 'tecla borra', text: 'Borrar', 'aria-label': 'Borrar', onclick: function () { tecla('borra'); } }));
    var bok = h('button', { type: 'button', class: 'tecla ok', text: 'Comprobar', onclick: function () { tecla('ok'); } });
    t.append(bok);
    teclaFisica = function (k) {
      if (/^[a-zñA-ZÑ]$/.test(k)) { tecla(k.toUpperCase()); return true; }
      if (k === 'Backspace' || k === 'Delete') { tecla('borra'); return true; }
      if (k === 'Enter') { tecla('ok'); return true; }
      return false;
    };
    if (conRaton) t.append(h('p', { class: 'pista-teclado', text: 'Con el teclado: escribe la palabra y pulsa Enter.' }));
    pinta();
    return { el: t, limpia: function () { val = ''; pinta(); } };
  }
  // rondas: 8 por nivel; estrellas según aciertos
  function marcador(total) { return { total: total, hecho: 0, bien: 0 }; }
  function estrellasRondas(bien, total) { return bien === total ? 3 : bien >= total - 2 ? 2 : bien >= Math.ceil(total / 2) ? 1 : 0; }
  // al acabar las rondas: sin estrellas no sale en rojo, sino una invitación a volver a jugar
  function resultado(el, bien, total, e) { estado(el, e ? 'bien' : '', bien + ' de ' + total + ' aciertos. ' + (e ? tresEstrellas(e, 24) : 'Juega otra vez: con práctica sale mejor.')); }

  /* ================================================================ 1. Programa al robot */
  // x de 0 a 5 (izquierda → derecha), y de 0 a 5 (arriba → abajo). Dirección: 0 arriba, 1 derecha, 2 abajo, 3 izquierda.
  // ref: la solución corta (las 3 estrellas son para quien lo consigue con esos bloques o menos).
  var NIV_ROBOT = [
    { t: 'Recto', ini: [0, 5, 0], meta: [0, 2], rocas: [[1, 3], [2, 5]], ref: 'AAA', ayuda: 'Toca los bloques para escribir el programa. Después, «Ejecutar».' },
    { t: 'Un giro', ini: [0, 5, 0], meta: [2, 3], rocas: [[1, 5], [2, 4]], ref: 'AADAA', ayuda: 'Girar no mueve al robot de casilla: solo cambia hacia dónde mira.' },
    { t: 'La roca', ini: [0, 5, 1], meta: [3, 3], rocas: [[1, 5], [2, 4], [3, 5]], ref: 'IAADAAA', ayuda: 'Mira hacia dónde apunta el robot antes de empezar.' },
    { t: 'Repetir', ini: [0, 4, 1], meta: [5, 4], rocas: [[2, 3], [3, 5]], ref: 'R5(A)', ayuda: 'Para 3 estrellas: el bloque Repetir hace varias veces lo que lleva dentro.' },
    { t: 'La U', ini: [1, 4, 0], meta: [3, 4], rocas: [[2, 3], [2, 4], [2, 5]], ref: 'R2(AAD)AA', ayuda: 'Busca lo que se repite: «avanzar, avanzar, girar».' },
    { t: 'Escalera', ini: [0, 5, 1], meta: [3, 2], rocas: [[2, 5], [3, 4], [4, 3]], ref: 'R3(AIAD)', ayuda: 'Cada escalón: avanzar, girar, avanzar, girar.' },
    { t: 'Gran escalera', ini: [0, 5, 1], meta: [5, 0], rocas: [[3, 5], [5, 3], [0, 2]], ref: 'R5(AIAD)', ayuda: 'Es como la escalera, pero más larga.' },
    { t: 'La vuelta', ini: [0, 5, 0], meta: [3, 5], rocas: [[1, 5], [2, 5], [1, 4], [2, 4], [1, 3], [2, 3]], ref: 'R3(AAAD)', ayuda: 'Tres lados iguales: ¿qué se repite?' },
    { t: 'Bajada', ini: [0, 0, 2], meta: [5, 5], rocas: [[0, 3], [3, 0], [5, 2]], ref: 'R5(AIAD)', ayuda: 'El robot mira hacia abajo. ¿Hacia dónde gira a la izquierda?' },
    { t: 'Montaña', ini: [0, 5, 1], meta: [5, 4], rocas: [[2, 5], [3, 5], [4, 4], [1, 2]], ref: 'R3(AIAD)R2(ADAI)', ayuda: 'Primero se sube y después se baja. Puedes usar dos Repetir.' }
  ];
  var DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  function leeRef(s) {  // 'R3(AIAD)AA' → programa
    var out = [], i = 0;
    while (i < s.length) {
      var ch = s[i];
      if (ch === 'R') { var m = /^R(\d+)\(([AID]+)\)/.exec(s.slice(i)); out.push({ t: 'R', n: +m[1], c: m[2].split('').map(function (x) { return { t: x }; }) }); i += m[0].length; }
      else { out.push({ t: ch }); i++; }
    }
    return out;
  }
  function cuentaBloques(p) { return p.reduce(function (a, b) { return a + 1 + (b.t === 'R' ? cuentaBloques(b.c) : 0); }, 0); }
  function pasos(p) { var out = []; p.forEach(function (b, i) { if (b.t === 'R') { for (var k = 0; k < b.n; k++) b.c.forEach(function (x, j) { out.push({ t: x.t, ref: [i, j] }); }); } else out.push({ t: b.t, ref: [i] }); }); return out; }
  // simula un programa: devuelve las posiciones y si choca
  function simula(niv, p) {
    var x = niv.ini[0], y = niv.ini[1], d = niv.ini[2], tray = [{ x: x, y: y, d: d }], choque = null, ps = pasos(p);
    for (var i = 0; i < ps.length; i++) {
      var s = ps[i];
      if (s.t === 'I') d = (d + 3) % 4;
      else if (s.t === 'D') d = (d + 1) % 4;
      else {
        var nx = x + DIRS[d][0], ny = y + DIRS[d][1];
        if (nx < 0 || ny < 0 || nx > 5 || ny > 5) { choque = { i: i, fuera: true }; break; }
        if (niv.rocas.some(function (r) { return r[0] === nx && r[1] === ny; })) { choque = { i: i, roca: [nx, ny] }; break; }
        x = nx; y = ny;
      }
      tray.push({ x: x, y: y, d: d, paso: i });
    }
    return { tray: tray, choque: choque, llega: !choque && x === niv.meta[0] && y === niv.meta[1], pasos: ps };
  }
  var CEL = 64;
  function tablero(niv, pose, rastro) {
    var s = '<rect x="0" y="0" width="' + (CEL * 6 + 40) + '" height="' + (CEL * 6 + 40) + '" rx="26" fill="#4fa3d9"/><rect x="10" y="10" width="' + (CEL * 6 + 20) + '" height="' + (CEL * 6 + 20) + '" rx="18" fill="#f2d39b"/>';
    for (var y = 0; y < 6; y++) for (var x = 0; x < 6; x++) s += '<rect x="' + (20 + x * CEL) + '" y="' + (20 + y * CEL) + '" width="' + CEL + '" height="' + CEL + '" fill="' + ((x + y) % 2 ? '#8fcf6e' : '#9ed97c') + '" stroke="#6fb24f" stroke-width="1.5"/>';
    niv.rocas.forEach(function (r) { var cx = 20 + r[0] * CEL + CEL / 2, cy = 20 + r[1] * CEL + CEL / 2; s += '<path d="M' + (cx - 22) + ' ' + (cy + 16) + 'L' + (cx - 14) + ' ' + (cy - 10) + 'L' + (cx + 2) + ' ' + (cy - 20) + 'L' + (cx + 20) + ' ' + (cy - 6) + 'L' + (cx + 24) + ' ' + (cy + 16) + 'Z" fill="#8a8f99" stroke="#5d6474" stroke-width="2.5" stroke-linejoin="round"/>'; });
    var mx = 20 + niv.meta[0] * CEL + CEL / 2, my = 20 + niv.meta[1] * CEL + CEL / 2, pt = [];
    for (var k = 0; k < 10; k++) { var a = Math.PI / 5 * k - Math.PI / 2, rr = k % 2 ? 11 : 26; pt.push((mx + rr * Math.cos(a)).toFixed(1) + ',' + (my + rr * Math.sin(a)).toFixed(1)); }
    s += '<polygon points="' + pt.join(' ') + '" fill="#f5c518" stroke="#b8860b" stroke-width="2.5" stroke-linejoin="round"/>';
    if (rastro && rastro.length > 1) s += '<polyline points="' + rastro.map(function (p) { return (20 + p.x * CEL + CEL / 2) + ',' + (20 + p.y * CEL + CEL / 2); }).join(' ') + '" fill="none" stroke="#df7619" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>';
    var rx = 20 + pose.x * CEL + CEL / 2, ry = 20 + pose.y * CEL + CEL / 2;
    s += '<g transform="translate(' + rx + ' ' + ry + ') rotate(' + (pose.d * 90) + ') scale(.95) translate(-30 -30)"><ellipse cx="30" cy="54" rx="19" ry="4" fill="rgba(0,0,0,.18)"/><rect x="6" y="18" width="8" height="24" rx="3" fill="#1a1d24"/><rect x="46" y="18" width="8" height="24" rx="3" fill="#1a1d24"/><rect x="11" y="13" width="38" height="38" rx="11" fill="#2c5bbf" stroke="#1b3f8f" stroke-width="2.5"/><path d="M22 13L30 1L38 13Z" fill="#f5c518" stroke="#b8860b" stroke-width="2" stroke-linejoin="round"/><circle cx="23" cy="29" r="5.5" fill="#fff"/><circle cx="37" cy="29" r="5.5" fill="#fff"/><circle cx="23" cy="27.5" r="2.6" fill="#1a1d24"/><circle cx="37" cy="27.5" r="2.6" fill="#1a1d24"/><path d="M23 41Q30 46 37 41" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>';
    if (pose.choque) s += '<circle cx="' + (20 + pose.choque[0] * CEL + CEL / 2) + '" cy="' + (20 + pose.choque[1] * CEL + CEL / 2) + '" r="30" fill="none" stroke="#c8382f" stroke-width="6"/>';
    return '<svg class="dibujo tab" viewBox="0 0 ' + (CEL * 6 + 40) + ' ' + (CEL * 6 + 40) + '" role="img" aria-label="Tablero del robot">' + s + '</svg>';
  }
  var NOMBRE = { A: 'avanzar', I: 'girar a la izquierda', D: 'girar a la derecha' };
  function robot(zona, nivel) {
    var niv = NIV_ROBOT[nivel - 1], prog = [], destino = null, corriendo = false, timer = null;
    var dib = h('div'), est = h('p', { class: 'estado' }), progEl = h('div', { class: 'programa' }), cuenta = h('p', { class: 'ronda' });
    var bEjec = boton('Ejecutar', ejecutar, 'primario'), bSalir = boton('Salir del Repetir', function () { destino = null; pinta(); });
    var bRep = nivel >= 4 ? h('button', { type: 'button', class: 'bq repb', html: ICO.rep + 'repetir', onclick: function () { if (destino === null) añade('R'); } }) : null;
    function pose0() { return { x: niv.ini[0], y: niv.ini[1], d: niv.ini[2] }; }
    function lista() { return destino === null ? prog : prog[destino].c; }
    function añade(t) {
      if (corriendo) return;
      if (t === 'R') { prog.push({ t: 'R', n: 2, c: [] }); destino = prog.length - 1; }
      else lista().push({ t: t });
      pinta(); dib.innerHTML = tablero(niv, pose0());
    }
    function pbloque(b, onclick) {
      return h('button', { type: 'button', class: 'pb ' + (b.t === 'A' ? 'mov' : 'gir'), html: (b.t === 'A' ? ICO.avanza : b.t === 'I' ? ICO.izq : ICO.der) + NOMBRE[b.t], 'aria-label': NOMBRE[b.t] + ' (toca para quitarlo)', onclick: onclick });
    }
    function pinta(on) {
      progEl.innerHTML = '';
      if (!prog.length) progEl.append(h('p', { class: 'vacio', text: 'Aquí va el programa. Toca un bloque de arriba.' }));
      prog.forEach(function (b, i) {
        if (b.t !== 'R') {
          var e = pbloque(b, function () { if (corriendo) return; prog.splice(i, 1); if (destino !== null && destino > i) destino--; pinta(); });
          if (on && on.length === 1 && on[0] === i) e.classList.add('on');
          progEl.append(e); return;
        }
        var dentro = h('div', { class: 'rep-in' });
        if (!b.c.length) dentro.append(h('p', { class: 'vacio', text: 'Toca bloques para meterlos aquí' }));
        b.c.forEach(function (x, j) {
          var e = pbloque(x, function (ev) { ev.stopPropagation(); if (corriendo) return; b.c.splice(j, 1); pinta(); });
          if (on && on[0] === i && on[1] === j) e.classList.add('on');
          dentro.append(e);
        });
        var menos = h('button', { type: 'button', text: '−', 'aria-label': 'Menos veces', onclick: function (ev) { ev.stopPropagation(); if (b.n > 2) b.n--; pinta(); } });
        var mas = h('button', { type: 'button', text: '+', 'aria-label': 'Más veces', onclick: function (ev) { ev.stopPropagation(); if (b.n < 9) b.n++; pinta(); } });
        var quita = h('button', { type: 'button', class: 'quitar', text: 'Quitar', onclick: function (ev) { ev.stopPropagation(); if (corriendo) return; prog.splice(i, 1); destino = null; pinta(); } });
        var caja = h('div', { class: 'rep' + (destino === i ? ' destino' : ''), onclick: function () { if (!corriendo) { destino = i; pinta(); } } },
          [h('div', { class: 'rep-cab' }, [h('span', { html: ICO.rep.replace('<svg', '<svg width="22" height="22" style="fill:#fff"') }), 'repetir', menos, h('b', { text: String(b.n) }), mas, 'veces', quita]), dentro]);
        progEl.append(caja);
      });
      var n = cuentaBloques(prog), ref = cuentaBloques(leeRef(niv.ref));
      cuenta.innerHTML = 'Bloques: <b>' + n + '</b> · para 3 estrellas, ' + ref + ' o menos. Para quitar un bloque, tócalo.';
      bSalir.hidden = destino === null;
      if (bRep) bRep.disabled = destino !== null;
    }
    function ejecutar() {
      if (corriendo || !prog.length) { if (!prog.length) estado(est, 'mal', 'El programa está vacío.'); return; }
      if (prog.some(function (b) { return b.t === 'R' && !b.c.length; })) { estado(est, 'mal', 'Hay un Repetir vacío: mete bloques dentro o quítalo.'); return; }
      var r = simula(niv, prog), i = 0;
      corriendo = true; bEjec.disabled = true; destino = null;
      estado(est, '', 'El robot sigue el programa…');
      var paso = function () {
        if (i >= r.tray.length) {
          corriendo = false; bEjec.disabled = false; pinta();
          if (r.choque) {
            var c = r.choque.roca || null, last = r.tray[r.tray.length - 1];
            dib.innerHTML = tablero(niv, { x: last.x, y: last.y, d: last.d, choque: c || [last.x + DIRS[last.d][0], last.y + DIRS[last.d][1]] }, r.tray);
            estado(est, 'mal', r.choque.fuera ? '¡Se sale del tablero! Mira el bloque que se ha quedado marcado.' : '¡Choca con una roca! Mira el bloque que se ha quedado marcado.');
            pinta(r.pasos[r.choque.i].ref);
          } else if (r.llega) {
            var n = cuentaBloques(prog), ref = cuentaBloques(leeRef(niv.ref)), e = n <= ref ? 3 : n <= ref + 2 ? 2 : 1;
            apunta('robot', nivel, e); cabecera();
            estado(est, 'bien', '¡Llega a la estrella! ' + tresEstrellas(e, 24) + (e < 3 ? ' ¿Se puede hacer con menos bloques?' : ''));
            pintaNiveles();
          } else estado(est, 'mal', 'El programa termina, pero el robot no está en la estrella.');
          return;
        }
        var p = r.tray[i];
        dib.innerHTML = tablero(niv, p, r.tray.slice(0, i + 1));
        if (p.paso !== undefined) pinta(r.pasos[p.paso].ref);
        i++;
        timer = setTimeout(paso, quieto() ? 60 : 420);
      };
      paso();
    }
    var paleta = h('div', { class: 'bloques' }, [
      h('button', { type: 'button', class: 'bq mov', html: ICO.avanza + 'avanzar', onclick: function () { añade('A'); } }),
      h('button', { type: 'button', class: 'bq gir', html: ICO.izq + 'girar a la izquierda', onclick: function () { añade('I'); } }),
      h('button', { type: 'button', class: 'bq gir', html: ICO.der + 'girar a la derecha', onclick: function () { añade('D'); } }),
      bRep]);
    zona.append(h('div', { class: 'juego' }, [
      h('div', { class: 'panel' }, [dib, est]),
      h('div', { class: 'panel' }, [h('p', { class: 'enunciado', html: 'Nivel ' + nivel + ' · ' + niv.t + ': lleva al robot a la <b>estrella</b>.' }), h('p', { class: 'ayuda', text: niv.ayuda }), paleta, conRaton ? h('p', { class: 'pista-teclado', text: 'Con el teclado: ↑ avanzar, ← y → girar' + (nivel >= 4 ? ', R repetir' : '') + ', Enter ejecutar, ⌫ quitar el último.' }) : null, progEl, cuenta,
        h('div', { class: 'fila' }, [bEjec, bSalir, boton('Volver a empezar', function () { if (corriendo) return; clearTimeout(timer); dib.innerHTML = tablero(niv, pose0()); estado(est, '', 'El robot está en la salida.'); pinta(); }),
          boton('Borrar el programa', function () { if (corriendo) return; prog = []; destino = null; pinta(); dib.innerHTML = tablero(niv, pose0()); })])])]));
    teclaFisica = function (k) {
      if (k === 'ArrowUp') { añade('A'); return true; }
      if (k === 'ArrowLeft') { añade('I'); return true; }
      if (k === 'ArrowRight') { añade('D'); return true; }
      if ((k === 'r' || k === 'R') && bRep && destino === null) { añade('R'); return true; }
      if (k === 'Escape' && destino !== null) { destino = null; pinta(); return true; }
      if (k === 'Enter') { ejecutar(); return true; }
      if (k === 'Backspace' && !corriendo) { var l = lista(); if (l.length) { l.pop(); } else if (destino !== null) { prog.splice(destino, 1); destino = null; } pinta(); return true; }
      return false;
    };
    dib.innerHTML = tablero(niv, pose0()); estado(est, '', 'Mira hacia dónde apunta el robot (su punta amarilla).'); pinta();
    return function () { clearTimeout(timer); };
  }

  /* ================================================================ 2. Coordenadas */
  // Niveles: cuadrícula del 0 al 6 (3º-4º), plano con negativos del −5 al 5 (5º-6º) y escenario de Scratch.
  var NIV_COORD = [
    { t: 'Toca el punto (0 a 6)', tipo: 'tocar', min: 0, max: 6 },
    { t: '¿Dónde está? (0 a 6)', tipo: 'leer', min: 0, max: 6 },
    { t: 'Toca el punto (−5 a 5)', tipo: 'tocar', min: -5, max: 5 },
    { t: '¿Dónde está? (−5 a 5)', tipo: 'leer', min: -5, max: 5 },
    { t: 'Escenario de Scratch', tipo: 'scratch' }
  ];
  function plano(nv, marcas) {
    // devuelve [svg, función que pasa de un toque a (x, y)]
    if (nv.tipo === 'scratch') {
      var s = '<rect x="-240" y="-180" width="480" height="360" fill="#fbfcfe" stroke="#9aa6b8" stroke-width="2"/>';
      for (var gx = -200; gx <= 200; gx += 50) s += '<line x1="' + gx + '" y1="-180" x2="' + gx + '" y2="180" stroke="' + (gx % 100 ? '#e6eaf0' : '#cdd5e0') + '"/>';
      for (var gy = -150; gy <= 150; gy += 50) s += '<line x1="-240" y1="' + gy + '" x2="240" y2="' + gy + '" stroke="' + (gy % 100 ? '#e6eaf0' : '#cdd5e0') + '"/>';
      s += '<line x1="-240" y1="0" x2="240" y2="0" stroke="#1a1d24" stroke-width="2"/><line x1="0" y1="-180" x2="0" y2="180" stroke="#1a1d24" stroke-width="2"/>';
      var T = ' font-size="15" font-weight="700" fill="#1a1d24" stroke="#fbfcfe" stroke-width="4" paint-order="stroke"';
      [-200, -100, 100, 200].forEach(function (k) { s += '<text x="' + k + '" y="18"' + T + ' text-anchor="middle">' + sg(k) + '</text>'; });
      [-100, 100].forEach(function (k) { s += '<text x="-6" y="' + (-k + 5) + '"' + T + ' text-anchor="end">' + sg(k) + '</text>'; });
      s += '<text x="-6" y="18"' + T + ' text-anchor="end">0</text><text x="232" y="-8"' + T + ' text-anchor="end" font-style="italic">x</text><text x="8" y="-164"' + T + ' font-style="italic">y</text>';
      return { svg: '<svg class="dibujo" viewBox="-252 -192 504 384" role="img" aria-label="Escenario de Scratch">' + s + (marcas || '') + '</svg>',
        a: function (x, y) { return [x, -y]; }, de: function (px, py) { return [Math.round(px), Math.round(-py)]; } };
    }
    var n = nv.max - nv.min, C = 56, M = 46, W = n * C + 2 * M;
    function X(x) { return M + (x - nv.min) * C; }
    function Y(y) { return M + (nv.max - y) * C; }
    var s2 = '<rect x="0" y="0" width="' + W + '" height="' + W + '" rx="14" fill="#fbfcfe"/>';
    for (var v = nv.min; v <= nv.max; v++) {
      s2 += '<line x1="' + X(v) + '" y1="' + Y(nv.min) + '" x2="' + X(v) + '" y2="' + Y(nv.max) + '" stroke="#d5dae3" stroke-width="2"/>';
      s2 += '<line x1="' + X(nv.min) + '" y1="' + Y(v) + '" x2="' + X(nv.max) + '" y2="' + Y(v) + '" stroke="#d5dae3" stroke-width="2"/>';
    }
    var ox = nv.min < 0 ? 0 : nv.min, oy = nv.min < 0 ? 0 : nv.min;
    s2 += '<line x1="' + X(nv.min) + '" y1="' + Y(oy) + '" x2="' + (X(nv.max) + 20) + '" y2="' + Y(oy) + '" stroke="#1a1d24" stroke-width="3"/><path d="M' + (X(nv.max) + 28) + ' ' + Y(oy) + 'l-12 -7v14z" fill="#1a1d24"/>';
    s2 += '<line x1="' + X(ox) + '" y1="' + Y(nv.min) + '" x2="' + X(ox) + '" y2="' + (Y(nv.max) - 20) + '" stroke="#1a1d24" stroke-width="3"/><path d="M' + X(ox) + ' ' + (Y(nv.max) - 28) + 'l-7 12h14z" fill="#1a1d24"/>';
    var T2 = ' font-size="20" font-weight="800" fill="#1a1d24" stroke="#fbfcfe" stroke-width="5" paint-order="stroke"';
    for (var k = nv.min; k <= nv.max; k++) {
      if (k !== ox || nv.min >= 0) s2 += '<text x="' + X(k) + '" y="' + (Y(oy) + 26) + '"' + T2 + ' text-anchor="middle">' + sg(k) + '</text>';
      if (k !== oy) s2 += '<text x="' + (X(ox) - 10) + '" y="' + (Y(k) + 7) + '"' + T2 + ' text-anchor="end">' + sg(k) + '</text>';
    }
    s2 += '<text x="' + (X(nv.max) + 24) + '" y="' + (Y(oy) - 12) + '"' + T2 + ' font-style="italic">x</text><text x="' + (X(ox) + 12) + '" y="' + (Y(nv.max) - 22) + '"' + T2 + ' font-style="italic">y</text>';
    return { svg: '<svg class="dibujo" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="Plano de coordenadas">' + s2 + (marcas || '') + '</svg>',
      a: function (x, y) { return [X(x), Y(y)]; }, de: function (px, py) { return [Math.round((px - M) / C) + nv.min, nv.max - Math.round((py - M) / C)]; } };
  }
  function estrellaEn(p, r) { var pt = []; for (var k = 0; k < 10; k++) { var a = Math.PI / 5 * k - Math.PI / 2, rr = k % 2 ? r * .42 : r; pt.push((p[0] + rr * Math.cos(a)).toFixed(1) + ',' + (p[1] + rr * Math.sin(a)).toFixed(1)); } return '<polygon points="' + pt.join(' ') + '" fill="#f5c518" stroke="#b8860b" stroke-width="2.5" stroke-linejoin="round"/>'; }
  function coordenadas(zona, nivel) {
    var nv = NIV_COORD[nivel - 1], M = marcador(8), obj = null, ant = null, hecho = false, segunda = false;
    var dib = h('div'), est = h('p', { class: 'estado' }), enun = h('p', { class: 'enunciado' }), ronda = h('p', { class: 'ronda' }), lado = h('div', { class: 'panel' });
    var cx = casilla(), cy = casilla(), tec = null, bSig = boton('Siguiente', siguiente, 'primario');
    function nuevo() {
      do {
        obj = nv.tipo === 'scratch' ? [(rnd(21) - 10) * 20, (rnd(15) - 7) * 20] : [nv.min + rnd(nv.max - nv.min + 1), nv.min + rnd(nv.max - nv.min + 1)];
      } while (ant && obj[0] === ant[0] && obj[1] === ant[1] || (nv.min < 0 && (obj[0] === 0 || obj[1] === 0) && rnd(3)));
      ant = obj; hecho = false; segunda = false; bSig.hidden = true; PRUEBA.obj = obj;
      ronda.textContent = 'Reto ' + (M.hecho + 1) + ' de ' + M.total + ' · aciertos: ' + M.bien;
      if (nv.tipo === 'leer') { enun.innerHTML = '¿En qué punto está la <b>estrella</b>?'; tec.limpia(); }
      else enun.innerHTML = 'Toca el punto <b>(' + sg(obj[0]) + ', ' + sg(obj[1]) + ')</b>';
      pinta();
      estado(est, '', nv.tipo === 'leer' ? 'Primero la x (los números de abajo) y después la y.' : nv.tipo === 'scratch' ? 'La x va de −240 a 240 y la y de −180 a 180.' : 'Primero ve por la x y después sube o baja por la y.');
    }
    function pinta(toque, bien, guia) {
      var P = plano(nv), m = '';
      if (nv.tipo === 'leer' || hecho) { var q = P.a(obj[0], obj[1]); m += estrellaEn(q, nv.tipo === 'scratch' ? 16 : 20); }
      if ((hecho && !bien) || guia) {
        var o = P.a(obj[0], obj[1]), b0 = P.a(obj[0], nv.tipo === 'scratch' ? 0 : (nv.min < 0 ? 0 : nv.min)), z = P.a(nv.tipo === 'scratch' || nv.min < 0 ? 0 : nv.min, obj[1]);
        m += '<line x1="' + o[0] + '" y1="' + b0[1] + '" x2="' + o[0] + '" y2="' + o[1] + '" stroke="#df7619" stroke-width="4" stroke-dasharray="7 6"/><line x1="' + z[0] + '" y1="' + o[1] + '" x2="' + o[0] + '" y2="' + o[1] + '" stroke="#df7619" stroke-width="4" stroke-dasharray="7 6"/>';
      }
      if (toque) { var t = P.a(toque[0], toque[1]); m += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="' + (nv.tipo === 'scratch' ? 9 : 13) + '" fill="' + (bien ? '#257f46' : '#c8382f') + '" stroke="#fff" stroke-width="3"/>'; }
      dib.innerHTML = plano(nv, m).svg;
      var svg = dib.querySelector('svg');
      if (nv.tipo !== 'leer') svg.addEventListener('click', function (e) {
        if (hecho) return;
        var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        var p = pt.matrixTransform(svg.getScreenCTM().inverse()), d = P.de(p.x, p.y);
        if (nv.tipo !== 'scratch') { d[0] = Math.max(nv.min, Math.min(nv.max, d[0])); d[1] = Math.max(nv.min, Math.min(nv.max, d[1])); }
        responde(d);
      });
    }
    // la pista del primer fallo: cómo buscar el punto, sin decirlo
    function lado0(v, pos, neg) { return v > 0 ? pos : v < 0 ? neg : 'en la línea del centro'; }
    function pistaCoord() {
      var neg = nv.min < 0;
      if (nv.tipo === 'leer') return neg ? 'Pista: sigue la línea naranja desde la estrella hasta el eje horizontal (la x) y hasta el vertical (la y).' : 'Pista: sigue la línea naranja desde la estrella hasta los números de abajo (la x) y hasta los de la izquierda (la y).';
      if (nv.tipo === 'scratch') return 'Pista: x = ' + sg(obj[0]) + ' está ' + lado0(obj[0], 'a la derecha del centro', 'a la izquierda del centro') + ', e y = ' + sg(obj[1]) + ', ' + lado0(obj[1], 'hacia arriba', 'hacia abajo') + '. Cada línea gris son 50 pasos.';
      return 'Pista: busca primero el ' + sg(obj[0]) + ' en ' + (neg ? 'el eje horizontal' : 'los números de abajo') + ' (la x)' + (obj[1] === 0 ? '; la y es 0, así que no subas ni bajes.' : ' y después ' + (obj[1] < 0 ? 'baja' : 'sube') + ' hasta el ' + sg(obj[1]) + ' (la y).');
    }
    function responde(d) {
      var bien = nv.tipo === 'scratch' ? Math.abs(d[0] - obj[0]) <= 15 && Math.abs(d[1] - obj[1]) <= 15 : d[0] === obj[0] && d[1] === obj[1];
      var dicho = nv.tipo === 'leer' ? 'Habéis escrito (' + sg(d[0]) + ', ' + sg(d[1]) + ').' : 'Habéis tocado (' + sg(d[0]) + ', ' + sg(d[1]) + ').';
      if (!bien && !segunda) {  // primer fallo: una pista y otra oportunidad
        segunda = true;
        pinta(nv.tipo === 'leer' ? null : d, false, nv.tipo === 'leer');
        if (tec) tec.limpia();
        estado(est, 'pista', 'Todavía no. ' + dicho + ' ' + pistaCoord());
        return;
      }
      hecho = true; M.hecho++;
      if (bien) M.bien++;
      pinta(nv.tipo === 'leer' ? null : d, bien);
      estado(est, bien ? 'bien' : 'mal', (bien ? (segunda ? '¡Ahora sí! ' : '¡Muy bien! ') : '') + 'La estrella está en (' + sg(obj[0]) + ', ' + sg(obj[1]) + ').' + (bien ? '' : ' ' + dicho));
      ronda.textContent = 'Reto ' + M.hecho + ' de ' + M.total + ' · aciertos: ' + M.bien;
      if (M.hecho >= M.total) fin(); else bSig.hidden = false;
    }
    function siguiente() { nuevo(); }
    function fin() {
      var e = estrellasRondas(M.bien, M.total);
      apunta('coordenadas', nivel, e); cabecera(); pintaNiveles();
      resultado(est, M.bien, M.total, e);
      bSig.hidden = true;
      lado.append(boton('Jugar otra vez', function () { M = marcador(8); this.remove(); nuevo(); }, 'verde'));
    }
    lado.append(enun, ronda);
    if (nv.tipo === 'leer') {
      tec = teclado([cx, cy], function (v) { if (hecho) { if (!bSig.hidden) siguiente(); return; } if (v[0] === null || v[1] === null) { estado(est, 'mal', 'Escribe la x y la y.'); return; } responde(v); }, nv.min < 0);
      lado.append(h('div', { class: 'respuesta' }, ['(', cx, ',', cy, ')']), tec.el);
    }
    lado.append(est, h('div', { class: 'fila' }, [bSig]));
    zona.append(h('div', { class: 'juego' }, [h('div', { class: 'panel' }, [dib]), lado]));
    nuevo();
  }

  /* ================================================================ 3. ¿Cuánto vale? */
  var NIV_VAR = [
    { t: 'Dar el valor y sumar' }, { t: 'Cuidado con «dar el valor»' }, { t: 'Con repetir' }, { t: 'Dos variables' }
  ];
  var ED = {
    scratch: { nom: 'Scratch', ini: '<div class="b ev" style="background:#FFBF00;color:#1a1d24">al hacer clic en <svg viewBox="0 0 16 16" width="22" height="22" aria-label="bandera verde"><path d="M3.2 1.6v12.8" stroke="#3d8a37" stroke-width="1.7" stroke-linecap="round"/><path d="M4 2.6c2.1-1.2 3.9.8 6 0 1-.4 1.9-.7 2.8-.5v6.4c-.9-.2-1.8.1-2.8.5-2.1.8-3.9-1.2-6 0z" fill="#4cbf56" stroke="#3d8a37" stroke-width=".9"/></svg></div>',
      col: '#FF8C1A', ctl: '#FFAB19', dar: function (v, x) { return 'dar a ' + rr(this.col, v) + ' el valor ' + x; }, suma: function (v, x) { return 'sumar a ' + rr(this.col, v) + ' ' + x; },
      rep: function (n) { return 'repetir ' + vv(n); } },
    makecode: { nom: 'MakeCode', ini: '<div class="b ev" style="background:#1E90FF">al iniciar</div>',
      col: '#DC143C', ctl: '#00AA00', dar: function (v, x) { return 'fijar ' + rr(this.col, v) + ' a ' + x; }, suma: function (v, x) { return 'cambiar ' + rr(this.col, v) + ' por ' + x; },
      rep: function (n) { return 'repetir ' + vv(n) + ' veces'; } }
  };
  function rr(col, x) { return '<span class="r" style="background:' + col + ';color:#fff">' + x + '</span>'; }
  function vv(x) { return '<span class="v">' + sg(x) + '</span>'; }
  // genera un programa: lista de instrucciones y la variable que se pregunta
  function genVar(nivel) {
    var a, b, n, d, p = [];
    if (nivel === 1) { a = rnd(11); p.push(['dar', 'puntos', a]); p.push(['suma', 'puntos', 1 + rnd(9)]); if (rnd(2)) p.push(['suma', 'puntos', 1 + rnd(9)]); return { p: p, q: 'puntos' }; }
    if (nivel === 2) { a = 5 + rnd(10); p.push(['dar', 'puntos', a]); p.push(['suma', 'puntos', 2 + rnd(8)]); b = rnd(6); p.push(['dar', 'puntos', b]); p.push(['suma', 'puntos', rnd(2) && b > 0 ? -(1 + rnd(b)) : 1 + rnd(9)]); return { p: p, q: 'puntos' }; }
    if (nivel === 3) { a = rnd(11); n = 2 + rnd(5); d = 2 + rnd(8); p.push(['dar', 'puntos', a]); p.push(['rep', n, [['suma', 'puntos', d]]]); return { p: p, q: 'puntos' }; }
    a = rnd(6); b = 2 + rnd(5); n = 2 + rnd(4);
    p.push(['dar', 'puntos', a]); p.push(['dar', 'extra', b]); p.push(['rep', n, [['suma', 'puntos', 'extra']]]);
    if (rnd(2)) p.push(['suma', 'extra', 1 + rnd(5)]);
    return { p: p, q: rnd(3) ? 'puntos' : 'extra' };
  }
  function ejecutaVar(p) {
    var vars = {}, traza = [];
    function val(x) { return typeof x === 'string' ? vars[x] : x; }
    function paso(ins) {
      if (ins[0] === 'dar') vars[ins[1]] = val(ins[2]);
      else if (ins[0] === 'suma') vars[ins[1]] = (vars[ins[1]] || 0) + val(ins[2]);
      traza.push([ins, ins[1], vars[ins[1]]]);
    }
    p.forEach(function (ins) { if (ins[0] === 'rep') { for (var k = 0; k < ins[1]; k++) ins[2].forEach(paso); } else paso(ins); });
    return { vars: vars, traza: traza };
  }
  function bloqueVar(E, ins) {
    var x = typeof ins[2] === 'string' ? rr(E.col, ins[2]) : vv(ins[2]);
    return '<div class="b" style="background:' + E.col + '">' + (ins[0] === 'dar' ? E.dar(ins[1], x) : E.suma(ins[1], x)) + '</div>';
  }
  function progVar(E, p) {
    return '<div class="prog">' + E.ini + p.map(function (ins) {
      if (ins[0] !== 'rep') return bloqueVar(E, ins);
      return '<div class="c" style="--bc:' + E.ctl + '"><div class="c-cab" style="background:' + E.ctl + '">' + E.rep(ins[1]) + '</div><div class="c-in">' + ins[2].map(function (x) { return bloqueVar(E, x); }).join('') + '</div><div class="c-pie" style="background:' + E.ctl + '"></div></div>';
    }).join('') + '</div>';
  }
  var editor = 'scratch';
  try { editor = localStorage.getItem('ce40-tablet-editor') || 'scratch'; } catch (e) { /* nada */ }
  function variables(zona, nivel) {
    var M = marcador(8), G = null, hecho = false, segunda = false;
    var progEl = h('div'), est = h('p', { class: 'estado' }), enun = h('p', { class: 'enunciado' }), ronda = h('p', { class: 'ronda' }), traza = h('div');
    var cas = casilla(), bSig = boton('Siguiente', nuevo, 'primario'), lado = h('div', { class: 'panel' });
    // la pista del primer fallo: cómo seguir el programa en este nivel, sin dar el número
    function pistaVar() {
      var sc = editor === 'scratch', dar = sc ? '«dar el valor»' : '«fijar»', sum = sc ? '«sumar a»' : '«cambiar»';
      if (nivel === 1) return 'Pista: empieza por el número de ' + dar + ' y súmale los números de ' + sum + '.';
      if (nivel === 2) {
        var neg = G.p.filter(function (i) { return i[0] === 'suma' && i[2] < 0; })[0];
        return 'Pista: ' + dar + ' borra lo que había. Empieza a contar desde el último ' + dar + '.' + (neg ? ' ' + (sc ? 'Sumar ' : 'Cambiar por ') + sg(neg[2]) + ' es quitar ' + (-neg[2]) + '.' : '');
      }
      if (nivel === 3) { var r = G.p[1], d = r[2][0][2], veces = []; for (var k = 0; k < r[1]; k++) veces.push(sg(d)); return 'Pista: empieza en ' + sg(G.p[0][2]) + ' y suma ' + veces.join(' + ') + ' (' + r[1] + ' veces).'; }
      return 'Pista: mira primero cuánto vale extra. En cada vuelta del repetir, puntos suma lo que vale extra.' + (G.p.length > 3 ? ' Al final, extra cambia otra vez.' : '');
    }
    var tec = teclado([cas], function (v) {
      if (hecho) { if (!bSig.hidden) nuevo(); return; }
      if (v[0] === null) { estado(est, 'mal', 'Escribe un número.'); return; }
      var R = ejecutaVar(G.p), ok = v[0] === R.vars[G.q];
      if (!ok && !segunda) { segunda = true; tec.limpia(); estado(est, 'pista', 'Todavía no. ' + pistaVar()); return; }
      hecho = true; M.hecho++;
      if (ok) M.bien++;
      estado(est, ok ? 'bien' : 'mal', (ok ? (segunda ? '¡Ahora sí! ' : '¡Muy bien! ') : 'No: ') + G.q + ' vale <b>' + sg(R.vars[G.q]) + '</b>.');
      if (!ok) traza.innerHTML = '<table class="traza"><thead><tr><th>Paso</th><th>Variable</th><th>Vale</th></tr></thead><tbody>' + R.traza.map(function (t, i) { return '<tr><td>' + (i + 1) + '</td><td>' + t[1] + '</td><td>' + sg(t[2]) + '</td></tr>'; }).join('') + '</tbody></table>';
      ronda.textContent = 'Reto ' + M.hecho + ' de ' + M.total + ' · aciertos: ' + M.bien;
      if (M.hecho >= M.total) {
        var e = estrellasRondas(M.bien, M.total);
        apunta('variables', nivel, e); cabecera(); pintaNiveles();
        resultado(est, M.bien, M.total, e);
        lado.append(boton('Jugar otra vez', function () { M = marcador(8); this.remove(); nuevo(); }, 'verde'));
      } else bSig.hidden = false;
    });
    function nuevo() {
      G = genVar(nivel); PRUEBA.G = G; PRUEBA.valor = ejecutaVar(G.p).vars[G.q]; hecho = false; segunda = false; bSig.hidden = true; traza.innerHTML = ''; tec.limpia();
      progEl.innerHTML = progVar(ED[editor], G.p);
      enun.innerHTML = 'Al terminar el programa, ¿cuánto vale <b>' + G.q + '</b>?';
      ronda.textContent = 'Reto ' + (M.hecho + 1) + ' de ' + M.total + ' · aciertos: ' + M.bien;
      estado(est, '', nivel === 2 ? '«' + (editor === 'scratch' ? 'Dar el valor' : 'Fijar') + '» borra lo que había.' : nivel === 3 ? 'Lo de dentro de repetir se hace varias veces.' : 'Sigue los bloques en orden, de arriba abajo.');
    }
    var sel = h('div', { class: 'fila' }, ['Bloques de: ']);
    ['scratch', 'makecode'].forEach(function (k) {
      sel.append(h('button', { type: 'button', class: 'boton' + (editor === k ? ' primario' : ''), text: ED[k].nom, 'aria-pressed': String(editor === k), onclick: function () {
        editor = k; try { localStorage.setItem('ce40-tablet-editor', k); } catch (e) { /* nada */ }
        Array.prototype.forEach.call(sel.querySelectorAll('button'), function (b) { var on = b.textContent === ED[k].nom; b.classList.toggle('primario', on); b.setAttribute('aria-pressed', String(on)); });
        if (G) progEl.innerHTML = progVar(ED[editor], G.p);
      } }));
    });
    lado.append(enun, ronda, h('div', { class: 'respuesta' }, [cas]), tec.el, est, traza, h('div', { class: 'fila' }, [bSig]));
    zona.append(h('div', { class: 'juego' }, [h('div', { class: 'panel' }, [sel, progEl]), lado]));
    nuevo();
  }

  /* ================================================================ 4. Cubos y vistas */
  var NIV_CUBOS = [{ t: '¿Cuántos cubos? (fácil)' }, { t: '¿Cuántos cubos?' }, { t: '¿Qué vista es?' }];
  var CS = 40, CA = CS * Math.sqrt(3) / 2, CB = CS / 2;
  function pr(x, y, z) { return [(x - y) * CA, (x + y) * CB - z * CS]; }
  function poly(pts, fill, st, sw) { return '<polygon points="' + pts.map(function (p) { var q = pr(p[0], p[1], p[2]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ') + '" fill="' + fill + '" stroke="' + st + '" stroke-width="' + sw + '" stroke-linejoin="round"/>'; }
  function suma(H) { return H.reduce(function (a, f) { return a + f.reduce(function (b, v) { return b + v; }, 0); }, 0); }
  function iso(H, flecha) {
    var D = H.length, W = H[0].length, s = '', cub = [];
    for (var y = 0; y < D; y++) for (var x = 0; x < W; x++) s += poly([[x, y, 0], [x + 1, y, 0], [x + 1, y + 1, 0], [x, y + 1, 0]], '#eef1f6', '#c3cad6', 1);
    for (var y2 = 0; y2 < D; y2++) for (var x2 = 0; x2 < W; x2++) for (var z = 0; z < H[y2][x2]; z++) cub.push([x2, y2, z]);
    cub.sort(function (a, b) { return (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]); });
    cub.forEach(function (c) { var x = c[0], y = c[1], z = c[2];
      s += poly([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#5f88dd', '#1b3f8f', 1.3);
      s += poly([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], '#2c5bbf', '#1b3f8f', 1.3);
      s += poly([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#c3d6f8', '#1b3f8f', 1.3); });
    if (flecha) {
      var a = flecha === 'frente' ? [W / 2, D + 2, 0] : flecha === 'lado' ? [W + 2, D / 2, 0] : [W / 2, D / 2, 5.4], b = flecha === 'frente' ? [W / 2, D + .4, 0] : flecha === 'lado' ? [W + .4, D / 2, 0] : [W / 2, D / 2, 4.4];
      var p = pr(a[0], a[1], a[2]), q = pr(b[0], b[1], b[2]);
      s += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="#ad5b12" stroke-width="6" stroke-linecap="round"/><circle cx="' + q[0] + '" cy="' + q[1] + '" r="9" fill="#ad5b12"/>';
      s += '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><ellipse rx="26" ry="16" fill="#fff" stroke="#ad5b12" stroke-width="4"/><circle r="8" fill="#ad5b12"/></g>';
    }
    var x0 = pr(0, D + 2.6, 0)[0] - 30, x1 = pr(W + 2.6, 0, 0)[0] + 30, y0 = pr(0, 0, 6)[1], y1 = pr(W + 2.4, D + 2.4, 0)[1] + 10;
    return '<svg class="dibujo" viewBox="' + x0.toFixed(0) + ' ' + y0.toFixed(0) + ' ' + (x1 - x0).toFixed(0) + ' ' + (y1 - y0).toFixed(0) + '" role="img" aria-label="Figura de cubos">' + s + '</svg>';
  }
  function grada(D, max) {
    for (;;) {
      var H = [];
      for (var y = 0; y < D; y++) { H.push([]); for (var x = 0; x < D; x++) { var lim = Math.min(y ? H[y - 1][x] : max, x ? H[y][x - 1] : max); H[y].push(x + y === 0 ? max - rnd(2) : lim ? Math.max(0, lim - rnd(3)) : 0); } }
      var t = suma(H);
      if (t >= D * 2 && t <= D * D * max * .6 && H[D - 1][D - 1] === 0 && H[0][0] >= 2) return H;
    }
  }
  function vFrente(H) { var W = H[0].length, c = []; for (var x = 0; x < W; x++) c.push(Math.max.apply(null, H.map(function (f) { return f[x]; }))); return c; }
  function vLado(H) { var c = []; for (var y = H.length - 1; y >= 0; y--) c.push(Math.max.apply(null, H[y])); return c; }
  function alzado(c, R) { var g = []; for (var r = 0; r < R; r++) g.push(c.map(function (v) { return v >= R - r ? 1 : 0; })); return g; }
  function planta(H) { return H.map(function (f) { return f.map(function (v) { return v > 0 ? 1 : 0; }); }); }
  function espejo(g) { return g.map(function (f) { return f.slice().reverse(); }); }
  function clave(g) { return g.map(function (f) { return f.join(''); }).join('/'); }
  function rejilla(g, suelo, col) {
    var R = g.length, C = g[0].length, c = 34, s = '';
    for (var r = 0; r < R; r++) for (var k = 0; k < C; k++) s += '<rect x="' + (k * c + 2) + '" y="' + (r * c + 2) + '" width="' + (c - 2) + '" height="' + (c - 2) + '" rx="4" fill="' + (g[r][k] ? col : 'none') + '" stroke="' + (g[r][k] ? '#1b3f8f' : '#d5dae3') + '" stroke-width="2"' + (g[r][k] ? '' : ' stroke-dasharray="4 4"') + '/>';
    if (suelo) s += '<line x1="0" y1="' + (R * c + 3) + '" x2="' + (C * c + 4) + '" y2="' + (R * c + 3) + '" stroke="#1a1d24" stroke-width="4"/>';
    return '<svg viewBox="0 0 ' + (C * c + 4) + ' ' + (R * c + 6) + '" aria-hidden="true">' + s + '</svg>';
  }
  var NOMV = { frente: 'de frente', lado: 'de lado (desde la derecha)', arriba: 'desde arriba' };
  // la figura por pisos, vista desde arriba: cada cuadrado es un cubo de ese piso
  function porPisos(H) {
    var max = Math.max.apply(null, H.map(function (f) { return Math.max.apply(null, f); })), cont = h('div', { class: 'pisos', role: 'group', 'aria-label': 'La figura piso a piso' });
    for (var k = 1; k <= max; k++) {
      var g = H.map(function (f) { return f.map(function (x) { return x >= k ? 1 : 0; }); });
      cont.append(h('figure', {}, [h('div', { html: rejilla(g, false, '#9db8ef') }), h('figcaption', { text: 'Piso ' + k })]));
    }
    return cont;
  }
  function cubos(zona, nivel) {
    var M = marcador(8), H = null, hecho = false, pide = null, vuelta = 0, segunda = false;
    var dib = h('div'), est = h('p', { class: 'estado' }), enun = h('p', { class: 'enunciado' }), ronda = h('p', { class: 'ronda' }), lado = h('div', { class: 'panel' }), ops = h('div', { class: 'ops' });
    var cas = casilla(), bSig = boton('Siguiente', nuevo, 'primario'), tec = null;
    function acaba(ok, msg) {
      hecho = true; M.hecho++; if (ok) M.bien++;
      estado(est, ok ? 'bien' : 'mal', msg);
      ronda.textContent = 'Reto ' + M.hecho + ' de ' + M.total + ' · aciertos: ' + M.bien;
      if (M.hecho >= M.total) {
        var e = estrellasRondas(M.bien, M.total);
        apunta('cubos', nivel, e); cabecera(); pintaNiveles();
        resultado(est, M.bien, M.total, e);
        lado.append(boton('Jugar otra vez', function () { M = marcador(8); this.remove(); nuevo(); }, 'verde'));
      } else bSig.hidden = false;
    }
    function nuevo() {
      hecho = false; segunda = false; bSig.hidden = true; dib.classList.remove('con-pisos');
      ronda.textContent = 'Reto ' + (M.hecho + 1) + ' de ' + M.total + ' · aciertos: ' + M.bien;
      if (nivel < 3) {
        H = nivel === 1 ? grada(3, 2) : grada(4, 4); PRUEBA.H = H;
        dib.innerHTML = iso(H);
        enun.innerHTML = '¿Cuántos <b>cubos</b> hay?';
        tec.limpia();
        estado(est, '', 'Ningún cubo está en el aire: cada torre llega al suelo. Cuenta también los que no se ven.');
        return;
      }
      pide = ['frente', 'lado', 'arriba'][vuelta++ % 3];
      var buenas = null;
      for (var i = 0; i < 400 && !buenas; i++) {
        H = []; for (var y = 0; y < 3; y++) { H.push([]); for (var x = 0; x < 3; x++) H[y].push(rnd(3) ? rnd(4) : 0); }
        var t = suma(H); if (t < 5 || t > 11) continue;
        var V = { frente: alzado(vFrente(H), 3), lado: alzado(vLado(H), 3), arriba: planta(H) }, ok = V[pide], mir = espejo(ok), otra = pide === 'frente' ? V.lado : V.frente;
        if (clave(ok) !== clave(mir) && clave(ok) !== clave(otra) && clave(mir) !== clave(otra)) buenas = [[ok, 'ok'], [mir, 'espejo'], [otra, pide === 'frente' ? 'lado' : 'frente']];
      }
      buenas = shuffle(buenas); PRUEBA.buena = buenas.map(function (b) { return b[1]; }).indexOf('ok');
      dib.innerHTML = iso(H, pide);
      enun.innerHTML = '¿Cuál es la vista <b>' + NOMV[pide] + '</b>? Mira desde el ojo.';
      ops.innerHTML = '';
      buenas.forEach(function (o, k) {
        var b = h('button', { type: 'button', class: 'op', 'aria-label': 'Opción ' + 'ABC'[k], html: '<b>' + 'ABC'[k] + '</b>' + rejilla(o[0], pide !== 'arriba', pide === 'arriba' ? '#9db8ef' : '#5f88dd') });
        b.addEventListener('click', function () {
          if (hecho) return;
          b.classList.add(o[1] === 'ok' ? 'bien' : 'mal');
          if (o[1] !== 'ok') Array.prototype.forEach.call(ops.children, function (c, j) { if (buenas[j][1] === 'ok') c.classList.add('bien'); });
          acaba(o[1] === 'ok', o[1] === 'ok' ? '¡Sí! Es la vista ' + NOMV[pide] + '.' : o[1] === 'espejo' ? 'Esa está al revés, como en un espejo: así se ve desde el otro lado.' : 'Esa es la vista ' + NOMV[o[1]] + '.');
        });
        ops.append(b);
      });
      estado(est, '', 'Toca la opción correcta.');
    }
    lado.append(enun, ronda);
    if (nivel < 3) {
      tec = teclado([cas], function (v) {
        if (hecho) { if (!bSig.hidden) nuevo(); return; }
        if (v[0] === null) { estado(est, 'mal', 'Escribe un número.'); return; }
        var pisos = []; for (var k = 1; k <= 4; k++) { var n = 0; H.forEach(function (f) { f.forEach(function (x) { if (x >= k) n++; }); }); if (n) pisos.push(n); }
        var t = suma(H);
        if (v[0] !== t && !segunda) {  // primer fallo: la figura por pisos y otra oportunidad
          segunda = true; tec.limpia(); dib.classList.add('con-pisos'); dib.append(porPisos(H));
          estado(est, 'pista', 'Todavía no. Pista: cuenta piso a piso. Debajo de la figura está cada piso visto desde arriba: cada cuadrado es un cubo.');
          return;
        }
        acaba(v[0] === t, (v[0] === t ? (segunda ? '¡Ahora sí! ' : '¡Muy bien! ') : 'No. ') + 'Hay <b>' + t + '</b> cubos: ' + pisos.map(function (n, i) { return 'piso ' + (i + 1) + ', ' + n; }).join('; ') + '.');
      });
      lado.append(h('div', { class: 'respuesta' }, ['Hay', cas, 'cubos']), tec.el);
    } else lado.append(ops);
    lado.append(est, h('div', { class: 'fila' }, [bSig]));
    zona.append(h('div', { class: 'juego' }, [h('div', { class: 'panel' }, [dib]), lado]));
    nuevo();
  }

  /* ================================================================ 5. Adivina el número */
  var NIV_ADIVINA = [{ t: 'Del 1 al 20', n: 20 }, { t: 'Del 1 al 100', n: 100 }, { t: 'Del 1 al 1000', n: 1000 }];
  function maxPreguntas(n) { var k = 0; while (n >= 1) { k++; n = Math.floor(n / 2); } return k; }
  function adivina(zona, nivel) {
    var N = NIV_ADIVINA[nivel - 1].n, MX = maxPreguntas(N), sec, lo, hi, ints, fin;
    var recta = h('div'), est = h('p', { class: 'estado' }), enun = h('p', { class: 'enunciado' }), lista = h('p', { class: 'ronda' }), cas = casilla(), lado = h('div', { class: 'panel' });
    var bOtra = boton('Otro número', nuevo, 'primario');
    function dibuja() {
      var W = 900, x = function (v) { return 30 + (v - 1) / (N - 1) * (W - 60); }, s = '<rect x="30" y="30" width="' + (W - 60) + '" height="40" rx="8" fill="#e4e6eb"/>';
      if (lo <= hi) s += '<rect x="' + x(lo).toFixed(1) + '" y="30" width="' + Math.max(8, x(hi) - x(lo)).toFixed(1) + '" height="40" rx="8" fill="#9db8ef" stroke="#2c5bbf" stroke-width="2"/>';
      [1, N / 4, N / 2, 3 * N / 4, N].forEach(function (v) { v = Math.max(1, Math.round(v)); s += '<text x="' + x(v).toFixed(1) + '" y="100" text-anchor="middle" font-size="24" font-weight="800" fill="#5d6474">' + num(v) + '</text>'; });
      ints.forEach(function (g, i) { var xx = x(g[0]).toFixed(1), col = g[1] === 0 ? '#257f46' : i === ints.length - 1 ? '#c8382f' : '#5d6474'; s += '<line x1="' + xx + '" y1="22" x2="' + xx + '" y2="78" stroke="' + col + '" stroke-width="4"/>'; });
      recta.innerHTML = '<svg class="dibujo" viewBox="0 0 ' + W + ' 110" role="img" aria-label="Recta del 1 al ' + N + '">' + s + '</svg>';
    }
    function nuevo() {
      sec = 1 + rnd(N); PRUEBA.sec = sec; lo = 1; hi = N; ints = []; fin = false; tec.limpia();
      enun.innerHTML = 'He pensado un número del <b>1</b> al <b>' + num(N) + '</b>. ¿Cuál es?';
      lista.textContent = 'Intentos: 0. ¿Lo encuentras en ' + MX + ' o menos?';
      estado(est, '', 'Escribe un número y pulsa «Comprobar».');
      dibuja();
    }
    var tec = teclado([cas], function (v) {
      if (fin) { nuevo(); return; }
      var g = v[0];
      if (g === null || g < 1 || g > N) { estado(est, 'mal', 'Escribe un número del 1 al ' + num(N) + '.'); return; }
      var r = g === sec ? 0 : g < sec ? 1 : -1, inutil = g < lo || g > hi;
      ints.push([g, r]); tec.limpia();
      if (r > 0) lo = Math.max(lo, g + 1); else if (r < 0) hi = Math.min(hi, g - 1);
      lista.textContent = 'Intentos: ' + ints.length + ' · ' + ints.map(function (x) { return num(x[0]) + (x[1] > 0 ? ' ↑' : x[1] < 0 ? ' ↓' : ' ¡sí!'); }).join('  ');
      if (r === 0) {
        fin = true; lo = hi = g;
        var e = ints.length <= MX ? 3 : ints.length <= MX + 3 ? 2 : 1;
        apunta('adivina', nivel, e); cabecera(); pintaNiveles();
        estado(est, 'bien', '¡Es el ' + num(sec) + '! En ' + ints.length + (ints.length === 1 ? ' intento. ' : ' intentos. ') + tresEstrellas(e, 24) + (e < 3 ? ' Pista: pregunta siempre por la mitad de lo que queda.' : ''));
      } else estado(est, inutil ? 'mal' : '', (r > 0 ? 'Es <b>más grande</b> que ' : 'Es <b>más pequeño</b> que ') + num(g) + '.' + (inutil ? ' Ese número ya estaba descartado.' : ' Puede ser del ' + num(lo) + ' al ' + num(hi) + '.'));
      dibuja();
    });
    lado.append(enun, h('div', { class: 'respuesta' }, ['¿Es el', cas, '?']), tec.el, est, lista, h('div', { class: 'fila' }, [bOtra]));
    zona.append(h('div', { class: 'juego' }, [h('div', { class: 'panel' }, [recta, h('p', { class: 'ayuda', text: 'Lo azul es donde todavía puede estar el número.' })]), lado]));
    nuevo();
  }

  /* ------------------------------------------------------------ menú, niveles y rutas */
  var ACTS = [
    { id: 'robot', tit: 'Programa al robot', cursos: '3º y 4º', desc: 'Llega a la estrella con avanzar, girar y repetir.', grupo: 'prog', col: '#2c5bbf', niveles: NIV_ROBOT.map(function (n) { return n.t; }), fn: robot },
    { id: 'coordenadas', tit: 'Coordenadas', cursos: '3º a 6º', desc: 'Toca el punto o di dónde está la estrella.', grupo: 'mates', col: '#257f46', niveles: NIV_COORD.map(function (n) { return n.t; }), fn: coordenadas },
    { id: 'variables', tit: '¿Cuánto vale?', cursos: '3º a 6º', desc: 'Lee el programa y di cuánto vale la variable al final.', grupo: 'prog', col: '#b65c06', niveles: NIV_VAR.map(function (n) { return n.t; }), fn: variables },
    { id: 'cubos', tit: 'Cubos y vistas', cursos: '4º a 6º', desc: 'Cuenta los cubos y elige la vista correcta.', grupo: 'mates', col: '#6c44b0', niveles: NIV_CUBOS.map(function (n) { return n.t; }), fn: cubos },
    { id: 'adivina', tit: 'Adivina el número', cursos: '3º a 6º', desc: 'Encuéntralo con «más grande» y «más pequeño».', grupo: 'mates', col: '#0f7a8a', niveles: NIV_ADIVINA.map(function (n) { return n.t; }), fn: adivina }
  ];
  var app = $('app'), titulo = $('titulo'), estrellasEl = $('estrellas'), actual = null, nivelActual = 1, limpiar = null, nivEl = null;
  /* ------------------------------------------------------------ escuchar: lee en voz alta el enunciado, los datos, las opciones y las pistas */
  // Con la voz del propio dispositivo (no sale nada a internet). Para quien lee con dificultad o está aprendiendo español.
  var bEsc = $('escuchar') || h('button', { hidden: '' }, [h('span')]), habla = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window, voz = null;
  function eligeVoz() {
    var vs = speechSynthesis.getVoices().filter(function (v) { return /^es/i.test(v.lang); });
    voz = vs.filter(function (v) { return /es[-_]ES/i.test(v.lang); })[0] || vs[0] || null;
  }
  function paraVoz(s) {
    return s.replace(/−/g, ' menos ').replace(/×/g, ' por ').replace(/(\d)\s*:\s*(\d)/g, '$1 entre $2').replace(/cm\/s/g, 'centímetros por segundo')
      .replace(/(\d) ?cm\b/g, '$1 centímetros').replace(/°C/g, ' grados').replace(/[«»↻◀▶→↑↓]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function textoPantalla() {
    var partes = [];
    [].forEach.call(app.querySelectorAll('.enunciado, .dato, .ayuda, .ops-txt, .estado'), function (e) {
      if (!e.offsetParent) return;
      if (e.classList.contains('ops-txt')) { [].forEach.call(e.children, function (b, i) { partes.push('Opción ' + (i + 1) + ': ' + b.textContent); }); return; }
      partes.push(e.textContent);
    });
    return paraVoz(partes.map(function (p) { p = p.trim(); return /[.?!]$/.test(p) ? p : p.replace(/:$/, '') + '.'; }).join(' '));
  }
  function marcaEsc(on) { bEsc.querySelector('span').textContent = on ? 'Parar' : 'Escuchar'; }
  function callar() { if (habla && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel(); marcaEsc(false); }
  if (habla) {
    eligeVoz();
    if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', eligeVoz);
    bEsc.addEventListener('click', function () {
      if (speechSynthesis.speaking || speechSynthesis.pending) { callar(); return; }
      var u = new SpeechSynthesisUtterance(textoPantalla());
      u.lang = voz ? voz.lang : 'es-ES'; if (voz) u.voice = voz; u.rate = .92;
      u.onend = u.onerror = function () { marcaEsc(false); };
      marcaEsc(true); speechSynthesis.speak(u);
    });
  }
  function cabecera() {
    bEsc.hidden = !habla || !actual;
    if (!actual) { titulo.textContent = 'Retos de Código Escuela 4.0'; estrellasEl.innerHTML = ''; document.title = 'Retos · Código Escuela 4.0'; return; }
    titulo.textContent = actual.tit;
    document.title = actual.tit + ' · Retos de Código Escuela 4.0';
    estrellasEl.innerHTML = estrella(true, 24) + '<span>' + totalDe(actual) + ' de ' + actual.niveles.length * 3 + '</span>';
  }
  function pintaNiveles() {
    if (!nivEl || !actual) return;
    nivEl.innerHTML = '';
    actual.niveles.forEach(function (t, i) {
      var n = i + 1;
      var corto = actual.niveles.length > 5;
      nivEl.append(h('button', { type: 'button', class: 'nivel' + (corto ? ' corto' : ''), 'aria-current': String(n === nivelActual), 'aria-label': 'Nivel ' + n + ': ' + t, html: '<span>' + (corto ? n : n + '. ' + t) + '</span><span class="est">' + tresEstrellas(estrellasDe(actual.id, n), 16) + '</span>',
        onclick: function () { location.hash = '#' + actual.id + '/' + n; } }));
    });
  }
  var GRUPOS = [['prog', 'Programación'], ['mates', 'Matemáticas'], ['logica', 'Lógica y códigos']];
  function menu() {
    GRUPOS.forEach(function (g) {
    var lista = ACTS.filter(function (a) { return a.grupo === g[0]; });
    if (!lista.length) return;
    app.append(h('h2', { class: 'grupo', text: g[1] }));
    var m = h('div', { class: 'menu' });
    lista.forEach(function (a) {
      m.append(h('button', { type: 'button', class: 'tarjeta', style: '--c:' + a.col, onclick: function () { location.hash = '#' + a.id; },
        html: '<small>' + a.cursos + '</small><b>' + a.tit + '</b><span>' + a.desc + '</span><span class="est">' + estrella(true, 22) + '<span>' + totalDe(a) + ' de ' + a.niveles.length * 3 + '</span></span>' }));
    });
    app.append(m);
    });
    app.append(h('div', { class: 'pie' }, [h('span', { text: 'Sin cuentas: las estrellas se guardan solo en este dispositivo.' }),
      boton('Borrar las estrellas de este dispositivo', function () { if (confirm('¿Borrar todas las estrellas de este dispositivo?')) { PROG = {}; guarda(); ruta(); } })]));
  }
  function ruta() {
    if (limpiar) { limpiar(); limpiar = null; }
    callar();
    teclaFisica = null;
    app.innerHTML = '';
    var m = /^#?([a-z]+)(?:\/(\d+))?/.exec(location.hash || '');
    actual = m && ACTS.filter(function (a) { return a.id === m[1]; })[0] || null;
    if (!actual) { cabecera(); menu(); window.scrollTo(0, 0); return; }
    nivelActual = Math.min(Math.max(1, +(m[2] || 1)), actual.niveles.length);
    cabecera();
    nivEl = h('nav', { class: 'niveles', 'aria-label': 'Niveles' });
    app.append(nivEl);
    pintaNiveles();
    var zona = h('div');
    app.append(zona);
    limpiar = actual.fn(zona, nivelActual) || null;
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', ruta);
  document.addEventListener('keydown', function (e) {
    if (!teclaFisica || e.ctrlKey || e.altKey || e.metaKey) return;
    var a = document.activeElement;
    if (e.key === 'Enter' && a && a.tagName === 'BUTTON' && !a.classList.contains('tecla')) return;  // Enter sobre un botón: lo pulsa
    if (teclaFisica(e.key)) e.preventDefault();
  });
  // instalar como aplicación (Chrome y Edge): icono en el escritorio y sin barras del navegador
  var avisoInstalar = null, bInst = $('instalar');
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); avisoInstalar = e; bInst.hidden = false; });
  bInst.addEventListener('click', function () { if (!avisoInstalar) return; avisoInstalar.prompt(); avisoInstalar.userChoice.then(function () { avisoInstalar = null; bInst.hidden = true; }); });
  window.addEventListener('appinstalled', function () { bInst.hidden = true; });
  // sin conexión: una vez abierta, la página se guarda en el dispositivo
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(function () { /* nada */ });
  function inicio() { marcaPC(); ruta(); entrada(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicio); else setTimeout(inicio, 0);
  // para las pruebas
  window.RetosAPI = {
    h: h, rnd: rnd, shuffle: shuffle, sg: sg, num: num, ICO: ICO, estrella: estrella, tresEstrellas: tresEstrellas, quieto: quieto,
    estado: estado, boton: boton, teclado: teclado, tecladoLetras: tecladoLetras, casilla: casilla, marcador: marcador, estrellasRondas: estrellasRondas, resultado: resultado,
    apunta: function (act, nivel, n) { apunta(act, nivel, n); cabecera(); pintaNiveles(); }, prueba: PRUEBA, conRaton: conRaton,
    tecla: function (fn) { teclaFisica = fn; },
    registra: function (a) { ACTS.push(a); }
  };
  window.RETOS = { NIV_ROBOT: NIV_ROBOT, simula: simula, leeRef: leeRef, cuentaBloques: cuentaBloques, ejecutaVar: ejecutaVar, genVar: genVar, prueba: PRUEBA };
})();
