/* Herramientas añadidas en la versión 1.1:
   - «Adivina el número» (buscar por la mitad), para 4º S5 y para hablar de optimizar.
   - «Cubos y vistas» (vistas de frente, desde arriba y de lado; contar cubos), para las sesiones de Tinkercad.
   - «Mensajes» (enviar y recibir en Scratch; radio de la micro:bit), para 4º S13 y 6º S14. */
(function () {
  'use strict';
  var P = window.PJH, h = P.h, btn = P.btn, rnd = P.rnd, setStatus = P.setStatus, burst = P.burst;
  function quieto() { return document.documentElement.classList.contains('pj-still'); }
  function num(n) { return n >= 10000 ? n.toLocaleString('es-ES') : String(n); }

  // cada herramienta: un modo por preset, dentro de su propio hueco
  function porModos(lista) {
    return function (root) {
      var zona = h('div', { class: 'pj-mode' });
      root.appendChild(zona);
      return { load: function (p) {
        var m = lista.filter(function (x) { return x[0] === p; })[0] || lista[0];
        zona.innerHTML = '';
        var pq = m[1](zona);
        if (pq) pensar(zona, pq.q, pq.a);
      } };
    };
  }
  function pensar(box, q, a) {
    var ans = h('p', { class: 'rp-ans', hidden: true, html: a });
    box.appendChild(h('div', { class: 'rp-think' }, [h('h2', { text: 'Para pensar' }), h('p', { html: q }), btn('Ver la respuesta', function () { ans.hidden = !ans.hidden; }), ans]));
  }
  // fila de botones que se comporta como un selector (el elegido, en oscuro)
  function selector(opciones, ini, fn) {
    var row = h('div', { class: 'pj-row', role: 'group' });
    opciones.forEach(function (o) {
      var b0 = btn(o[1], function () { marca(o[0]); fn(o[0]); });
      b0.setAttribute('data-v', String(o[0]));
      row.appendChild(b0);
    });
    function marca(v) { Array.prototype.forEach.call(row.children, function (b0) { var on = b0.getAttribute('data-v') === String(v); b0.classList.toggle('go', on); b0.setAttribute('aria-pressed', String(on)); }); }
    marca(ini);
    return row;
  }

  /* ================================================================ 1. Adivina el número */
  // Con pistas de «más grande / más pequeño» y preguntando siempre por la mitad, nunca hacen falta más de
  // ⌊log2 N⌋ + 1 preguntas: después de cada una quedan, como mucho, la mitad (redondeando hacia abajo).
  function maxPreguntas(n) { var k = 0; while (n >= 1) { k++; n = Math.floor(n / 2); } return k; }
  function cadena(n) { var c = [n]; while (n > 1) { n = Math.floor(n / 2); c.push(n); } return c; }
  function mitad(lo, hi) { return Math.floor((lo + hi) / 2); }
  function cuentaMitad(lo, hi) {
    var s = lo + hi, m = mitad(lo, hi);
    return '(' + num(lo) + ' + ' + num(hi) + ') : 2 = ' + (s % 2 ? num(m) + ' y medio; nos quedamos con el <b>' + num(m) + '</b>' : '<b>' + num(m) + '</b>');
  }
  var RANGOS = [[20, 'Del 1 al 20'], [100, 'Del 1 al 100'], [1000, 'Del 1 al 1000']];

  // La recta numérica: lo descartado, en gris; lo que aún puede ser, en color; los intentos, con su flecha.
  function recta(N, lo, hi, intentos, extra) {
    var X0 = 30, W = 840, s = '';
    function x(v) { return X0 + (N === 1 ? 0 : (v - 1) / (N - 1) * W); }
    if (N <= 100) {
      var w = W / N;
      for (var v = 1; v <= N; v++) {
        var dentro = v >= lo && v <= hi, xx = X0 + (v - 1) * w - (N > 1 ? 0 : 0);
        s += '<rect x="' + (xx - w / 2 + (N <= 20 ? 1.5 : .3)).toFixed(1) + '" y="34" width="' + (w - (N <= 20 ? 3 : .6)).toFixed(1) + '" height="34" rx="' + (N <= 20 ? 6 : 1) + '" fill="' + (dentro ? '#cfe0fb' : '#e4e6eb') + '" stroke="' + (dentro ? '#2c5bbf' : '#c3c8d2') + '" stroke-width="' + (N <= 20 ? 1.5 : 0) + '"/>';
        if (N <= 20 || v === 1 || v % 10 === 0) s += '<text x="' + xx.toFixed(1) + '" y="' + (N <= 20 ? 57 : 88) + '" text-anchor="middle" font-size="' + (N <= 20 ? 17 : 14) + '" font-weight="700" fill="' + (dentro ? '#1a1d24' : '#8a92a3') + '">' + v + '</text>';
      }
      x = function (v) { return X0 + (v - 1) * w; };
    } else {
      s += '<rect x="' + X0 + '" y="34" width="' + W + '" height="34" rx="4" fill="#e4e6eb"/>';
      if (lo <= hi) s += '<rect x="' + x(lo).toFixed(1) + '" y="34" width="' + Math.max(3, x(hi) - x(lo)).toFixed(1) + '" height="34" rx="4" fill="#cfe0fb" stroke="#2c5bbf" stroke-width="1.5"/>';
      for (var t = 0; t <= 1000; t += 100) { var tv = Math.max(1, t); s += '<line x1="' + x(tv) + '" y1="68" x2="' + x(tv) + '" y2="74" stroke="#8a92a3"/><text x="' + x(tv) + '" y="88" text-anchor="middle" font-size="14" font-weight="700" fill="#5d6474">' + tv + '</text>'; }
    }
    intentos.forEach(function (it, i) {
      var ult = i === intentos.length - 1, col = it.r === 0 ? '#257f46' : ult ? '#c8382f' : '#5d6474', xx = x(it.g).toFixed(1);
      s += '<line x1="' + xx + '" y1="24" x2="' + xx + '" y2="72" stroke="' + col + '" stroke-width="' + (ult ? 3 : 2) + '"/>' +
        '<path d="M' + xx + ' 30l-6 -10h12z" fill="' + col + '"/>' +
        '<text x="' + xx + '" y="15" text-anchor="middle" font-size="15" font-weight="800" fill="' + col + '">' + num(it.g) + (it.r > 0 ? ' ↑' : it.r < 0 ? ' ↓' : '') + '</text>';
    });
    if (extra) s += '<line x1="' + x(extra).toFixed(1) + '" y1="28" x2="' + x(extra).toFixed(1) + '" y2="74" stroke="#df7619" stroke-width="3" stroke-dasharray="5 4"/><text x="' + x(extra).toFixed(1) + '" y="104" text-anchor="middle" font-size="15" font-weight="800" fill="#ad5b12">mitad: ' + num(extra) + '</text>';
    return '<svg class="ad-recta" viewBox="0 0 900 110" role="img" aria-label="Recta numérica del 1 al ' + N + ': puede ser del ' + lo + ' al ' + hi + '">' + s + '</svg>';
  }
  function chips(intentos) {
    return '<ol class="ad-chips">' + intentos.map(function (it) {
      return '<li class="' + (it.r === 0 ? 'ok' : '') + (it.inutil ? ' inutil' : '') + '"><b>' + num(it.g) + '</b> ' + (it.r > 0 ? 'es más grande' : it.r < 0 ? 'es más pequeño' : '¡acertado!') + '</li>';
    }).join('') + '</ol>';
  }

  // --- 1a. El ordenador piensa un número; la clase adivina
  function adOrdenador(box) {
    var N = 100, secreto, lo, hi, intentos, fin, mid = null;
    var dib = h('div', { class: 'ad-dib' }), txt = h('p', { class: 'pj-status' }), lista = h('div'), cuenta = h('p', { class: 'pj-big' });
    var inp = h('input', { type: 'number', class: 'ad-in', min: 1, 'aria-label': 'Número que decís' });
    function nuevo() { secreto = 1 + rnd(N); lo = 1; hi = N; intentos = []; fin = false; mid = null; inp.max = N; inp.value = ''; setStatus(txt, '', 'He pensado un número del 1 al ' + num(N) + '. ¿Cuál es?'); pinta(); }
    function pinta() {
      dib.innerHTML = recta(N, lo, hi, intentos, mid);
      lista.innerHTML = chips(intentos);
      cuenta.innerHTML = 'Intentos: <b>' + intentos.length + '</b>' + (fin ? '' : ' · puede ser ' + (lo === hi ? 'solo el <b>' + num(lo) + '</b>' : 'del <b>' + num(lo) + '</b> al <b>' + num(hi) + '</b> (' + num(hi - lo + 1) + ' números)'));
    }
    function probar() {
      if (fin) { setStatus(txt, '', 'Ya lo habéis acertado. Pulsad «Otro número».'); return; }
      var g = Number(inp.value);
      if (inp.value === '' || !Number.isInteger(g) || g < 1 || g > N) { setStatus(txt, 'bad', 'Escribid un número entero del 1 al ' + num(N) + '.'); return; }
      mid = null;
      var inutil = g < lo || g > hi, r = g === secreto ? 0 : g < secreto ? 1 : -1;
      intentos.push({ g: g, r: r, inutil: inutil });
      if (r === 0) {
        fin = true;
        var mx = maxPreguntas(N);
        setStatus(txt, 'good', '¡Acertado! Era el ' + num(secreto) + '. Lo habéis encontrado en ' + intentos.length + (intentos.length === 1 ? ' intento' : ' intentos') +
          '. Preguntando siempre por la mitad, del 1 al ' + num(N) + ' nunca hacen falta más de ' + mx + '.');
        pinta(); burst(dib);
        return;
      }
      if (r > 0) lo = Math.max(lo, g + 1); else hi = Math.min(hi, g - 1);
      setStatus(txt, inutil ? 'bad' : '', (r > 0 ? 'Es más grande que ' : 'Es más pequeño que ') + num(g) + '.' +
        (inutil ? ' Esta pregunta no ha servido: el ' + num(g) + ' ya estaba descartado.' : ''));
      inp.value = ''; inp.focus(); pinta();
    }
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') probar(); });
    box.appendChild(selector(RANGOS, N, function (v) { N = v; nuevo(); }));
    box.appendChild(dib);
    box.appendChild(h('div', { class: 'pj-two' }, [
      h('div', { class: 'pj-col' }, [h('div', { class: 'pj-row' }, ['¿Es el…? ', inp, btn('Probar', probar, 'go')]), txt, cuenta,
        h('div', { class: 'pj-row' }, [btn('Pista: la mitad', function () {
          if (fin) return;
          mid = mitad(lo, hi); pinta();
          setStatus(txt, ''); txt.innerHTML = 'Puede ser del ' + num(lo) + ' al ' + num(hi) + '. La mitad: ' + cuentaMitad(lo, hi) + '. Si preguntáis por él, la respuesta descarta la mitad de los que quedan.';
        }), btn('Otro número', nuevo)])]),
      h('div', { class: 'pj-col' }, [h('h2', { text: 'Lo que hemos preguntado' }), lista])]));
    nuevo();
    return { q: 'Quedan los números del 51 al 100. ¿Por qué no conviene preguntar por el 99?',
      a: 'Porque, si no es, lo más probable es oír «más pequeño» y solo se descartan 2 números (el 99 y el 100). Preguntando por la mitad, el <b>75</b>, se descarta la mitad de lo que queda, sea cual sea la respuesta.' };
  }

  // --- 1b. La clase piensa un número; el ordenador adivina partiendo por la mitad
  function adClase(box) {
    var N = 100, lo, hi, preg, hist, fin, empezado;
    var dib = h('div', { class: 'ad-dib' }), txt = h('p', { class: 'pj-status' }), q = h('p', { class: 'ad-q' }), cuenta = h('p', { class: 'pj-info' }), lista = h('ol', { class: 'ad-hist' });
    var bMas = btn('Es más grande', function () { responde(1); }), bMenos = btn('Es más pequeño', function () { responde(-1); }), bSi = btn('¡Sí, es ese!', function () { responde(0); }, 'go');
    var resp = h('div', { class: 'pj-row' }, [bMas, bMenos, bSi]);
    function reinicia() {
      lo = 1; hi = N; preg = null; hist = []; fin = false; empezado = false; resp.hidden = true; lista.innerHTML = ''; dib.innerHTML = recta(N, lo, hi, []);
      q.innerHTML = 'Pensad un número del 1 al ' + num(N) + ' y escribidlo en un papel, sin que lo vea la pizarra.';
      cuenta.textContent = ''; setStatus(txt, '', '');
    }
    function pregunta() {
      preg = mitad(lo, hi);
      q.innerHTML = '¿Es el <b>' + num(preg) + '</b>?';
      cuenta.innerHTML = 'Puede ser del ' + num(lo) + ' al ' + num(hi) + '. Pregunto por la mitad: ' + cuentaMitad(lo, hi) + '.';
      dib.innerHTML = recta(N, lo, hi, hist.map(function (x) { return { g: x[0], r: x[1] }; }), preg);
    }
    function responde(r) {
      if (fin || !empezado) return;
      hist.push([preg, r]);
      lista.innerHTML = hist.map(function (x, i) { return '<li>¿Es el ' + num(x[0]) + '? → ' + (x[1] > 0 ? 'más grande' : x[1] < 0 ? 'más pequeño' : '¡sí!') + '</li>'; }).join('');
      if (r === 0) {
        fin = true; resp.hidden = true;
        q.innerHTML = '¡Es el <b>' + num(preg) + '</b>!';
        dib.innerHTML = recta(N, preg, preg, hist.map(function (x) { return { g: x[0], r: x[1] }; }));
        setStatus(txt, 'good', 'Lo he adivinado en ' + hist.length + (hist.length === 1 ? ' pregunta' : ' preguntas') + '. Con números del 1 al ' + num(N) + ' nunca necesito más de ' + maxPreguntas(N) + ', porque cada pregunta deja, como mucho, la mitad.');
        burst(q); return;
      }
      if (r > 0) lo = preg + 1; else hi = preg - 1;
      if (lo > hi) {
        fin = true; resp.hidden = true;
        q.innerHTML = '¡No puede ser!';
        setStatus(txt, 'bad', 'Con esas respuestas no queda ningún número posible. Revisad la lista: alguna respuesta está equivocada.');
        return;
      }
      pregunta();
    }
    box.appendChild(selector(RANGOS, N, function (v) { N = v; reinicia(); }));
    box.appendChild(dib);
    box.appendChild(h('div', { class: 'pj-two' }, [
      h('div', { class: 'pj-col' }, [q, resp, h('div', { class: 'pj-row' }, [btn('Empezar', function () { reinicia(); empezado = true; resp.hidden = false; pregunta(); }, 'go'), btn('Empezar otra vez', reinicia)]), cuenta, txt]),
      h('div', { class: 'pj-col' }, [h('h2', { text: 'Preguntas y respuestas' }), lista])]));
    reinicia();
    return { q: 'Si pensáis el 1, ¿cuántas preguntas hacen falta del 1 al 100? ¿Y si pensáis el 50?',
      a: 'El 50 se acierta a la primera: es la primera mitad. El 1 necesita 7: 50, 25, 12, 6, 3, 1… (cada vez «más pequeño»). Ningún número necesita más de 7.' };
  }

  // --- 1c. ¿Cuántas preguntas hacen falta?
  var CUANTOS = [10, 20, 100, 200, 1000, 1000000];
  function adCuantas(box) {
    var N = 100, dib = h('div', { class: 'ad-cadena' }), cmp = h('div', { class: 'ad-cmp' });
    function pinta() {
      var c = cadena(N);
      dib.innerHTML = c.map(function (n, i) {
        var w = Math.max(1.2, Math.log(n + 1) / Math.log(N + 1) * 100);
        return '<div class="ad-paso"><span>' + (i === 0 ? 'Al empezar' : 'Tras la pregunta ' + i) + '</span><i style="width:' + w.toFixed(1) + '%"></i><b>' + (i === 0 ? num(n) + ' números' : 'como mucho ' + num(n)) + '</b></div>';
      }).join('') + '<div class="ad-paso fin"><span>Pregunta ' + c.length + '</span><i style="width:1.2%"></i><b>queda 1: ¡ese es!</b></div>';
      cmp.innerHTML = '<div><small>De uno en uno</small><b>hasta ' + num(N) + '</b><span>intentos</span></div><div class="mejor"><small>Por la mitad</small><b>hasta ' + c.length + '</b><span>preguntas</span></div>';
    }
    var tabla = '<table class="ad-tabla"><thead><tr><th>Números</th><th>De uno en uno</th><th>Por la mitad</th></tr></thead><tbody>' +
      CUANTOS.map(function (n) { return '<tr><td>del 1 al ' + num(n) + '</td><td>' + num(n) + '</td><td><b>' + maxPreguntas(n) + '</b></td></tr>'; }).join('') + '</tbody></table>';
    box.appendChild(selector(CUANTOS.map(function (n) { return [n, 'Del 1 al ' + num(n)]; }), N, function (v) { N = v; pinta(); }));
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [h('h2', { text: 'Cada pregunta deja, como mucho, la mitad' }), dib]),
      h('div', { class: 'pj-col' }, [cmp, h('div', { class: 'tw', html: tabla }), h('p', { class: 'pj-info', text: 'La barra se dibuja más corta a cada paso, pero no a escala: del millón al 1 no cabría.' })])]));
    pinta();
    return { q: 'Del 1 al 100 hacen falta 7 preguntas. Si los números van del 1 al 200 (el doble), ¿cuántas hacen falta?',
      a: 'Solo <b>una más: 8</b>. La primera pregunta parte los 200 en dos mitades de 100, y desde ahí es como antes. Por eso, aunque los números se multipliquen por mil, las preguntas solo suman 10.' };
  }
  window.Proyectables.register('adivina', porModos([['', adOrdenador], ['clase', adClase], ['cuantas', adCuantas]]));

  /* ================================================================ 2. Cubos y vistas */
  // Las figuras son torres de cubos sobre una cuadrícula: H[y][x] es la altura de la torre; y = 0 es la fila del fondo y
  // la última fila es la de delante. Se miran de frente (desde delante), desde arriba y de lado (desde la derecha).
  // Dibujo isométrico: el eje x va hacia abajo a la derecha, el y hacia abajo a la izquierda y el z hacia arriba;
  // se ven la cara de arriba, la de delante y la de la derecha de cada cubo.
  var CS = 38, CA = CS * Math.sqrt(3) / 2, CB = CS / 2;
  function pr(x, y, z) { return [(x - y) * CA, (x + y) * CB - z * CS]; }
  function poly(pts, fill, stroke, sw) {
    return '<polygon points="' + pts.map(function (p) { var q = pr(p[0], p[1], p[2]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ') +
      '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '" stroke-linejoin="round"/>';
  }
  function flecha(a, b, txt, on, ancla) {
    var p = pr(a[0], a[1], a[2]), q = pr(b[0], b[1], b[2]), col = on ? '#ad5b12' : '#8a92a3', dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    var t1 = [q[0] - ux * 14 - uy * 7, q[1] - uy * 14 + ux * 7], t2 = [q[0] - ux * 14 + uy * 7, q[1] - uy * 14 - ux * 7];
    return '<g class="vi-fl' + (on ? ' on' : '') + '"><line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) + '" stroke="' + col + '" stroke-width="' + (on ? 5 : 3) + '" stroke-linecap="round"/>' +
      '<polygon points="' + q[0].toFixed(1) + ',' + q[1].toFixed(1) + ' ' + t1.map(function (v) { return v.toFixed(1); }).join(',') + ' ' + t2.map(function (v) { return v.toFixed(1); }).join(',') + '" fill="' + col + '"/>' +
      '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + (ancla === 'arriba' ? -10 : 22)).toFixed(1) + '" text-anchor="middle" font-size="17" font-weight="800" fill="' + col + '">' + txt + '</text></g>';
  }
  function iso(H, opt) {
    opt = opt || {};
    var D = H.length, W = H[0].length, s = '', cubos = [], HM = 4;
    for (var y = 0; y < D; y++) for (var x = 0; x < W; x++) s += poly([[x, y, 0], [x + 1, y, 0], [x + 1, y + 1, 0], [x, y + 1, 0]], '#eef1f6', '#c3cad6', 1);
    for (var y2 = 0; y2 < D; y2++) for (var x2 = 0; x2 < W; x2++) for (var z = 0; z < H[y2][x2]; z++) cubos.push([x2, y2, z]);
    // de lo más lejano a lo más cercano (el que mira está en la dirección x + y + z)
    cubos.sort(function (a, b) { return (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]); });
    cubos.forEach(function (c) {
      var x = c[0], y = c[1], z = c[2], st = '#1b3f8f';
      s += poly([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#5f88dd', st, 1.3);
      s += poly([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], '#2c5bbf', st, 1.3);
      s += poly([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#c3d6f8', st, 1.3);
    });
    if (opt.flechas !== false) {
      var f = opt.flecha;
      s += flecha([W / 2, D + 2.1, 0], [W / 2, D + .35, 0], 'De frente', f === 'frente');
      s += flecha([W + 2.1, D / 2, 0], [W + .35, D / 2, 0], 'De lado', f === 'lado');
      s += flecha([W / 2, D / 2, HM + 1.6], [W / 2, D / 2, HM + .55], 'Desde arriba', f === 'arriba', 'arriba');
    }
    var x0 = pr(0, D + 2.4, 0)[0] - 40, x1 = pr(W + 2.4, 0, 0)[0] + 40, y0 = pr(0, 0, HM + 2.4)[1] - 10, y1 = pr(W + 2.2, D + 2.2, 0)[1] + 30;
    return '<svg class="vi-iso" viewBox="' + x0.toFixed(0) + ' ' + y0.toFixed(0) + ' ' + (x1 - x0).toFixed(0) + ' ' + (y1 - y0).toFixed(0) + '" role="img" aria-label="Figura de ' + suma(H) + ' cubos">' + s + '</svg>';
  }
  function suma(H) { return H.reduce(function (a, f) { return a + f.reduce(function (b, v) { return b + v; }, 0); }, 0); }
  // las tres vistas, como cuadrículas de unos y ceros (fila 0 = la de arriba del dibujo)
  function vFrente(H) { var W = H[0].length; var col = []; for (var x = 0; x < W; x++) col.push(Math.max.apply(null, H.map(function (f) { return f[x]; }))); return col; }
  function vLado(H) { var col = []; for (var y = H.length - 1; y >= 0; y--) col.push(Math.max.apply(null, H[y])); return col; }  // a la izquierda, la fila de delante
  function alzadoGrid(col, R) { var g = []; for (var r = 0; r < R; r++) g.push(col.map(function (hh) { return hh >= R - r ? 1 : 0; })); return g; }
  function plantaGrid(H) { return H.map(function (f) { return f.map(function (v) { return v > 0 ? 1 : 0; }); }); }
  function espejo(g) { return g.map(function (f) { return f.slice().reverse(); }); }
  function clave(g) { return g.map(function (f) { return f.join(''); }).join('/'); }
  function dibujaGrid(g, opt) {
    opt = opt || {};
    var R = g.length, C = g[0].length, c = opt.c || 26, s = '';
    for (var r = 0; r < R; r++) for (var k = 0; k < C; k++) {
      var on = g[r][k];
      s += '<rect x="' + (k * c + 2) + '" y="' + (r * c + 2) + '" width="' + (c - 2) + '" height="' + (c - 2) + '" rx="3" fill="' + (on ? (opt.col || '#5f88dd') : 'none') + '" stroke="' + (on ? '#1b3f8f' : '#d5dae3') + '" stroke-width="' + (on ? 1.5 : 1) + '"' + (on ? '' : ' stroke-dasharray="3 3"') + '/>';
      if (opt.nums && opt.nums[r][k]) s += '<text x="' + (k * c + 1 + c / 2) + '" y="' + (r * c + 2 + c / 2) + '" text-anchor="middle" dominant-baseline="central" font-size="' + (c * .55) + '" font-weight="800" fill="#fff">' + opt.nums[r][k] + '</text>';
    }
    if (opt.suelo) s += '<line x1="0" y1="' + (R * c + 2) + '" x2="' + (C * c + 4) + '" y2="' + (R * c + 2) + '" stroke="#1a1d24" stroke-width="3"/>';
    return '<svg class="vi-grid" viewBox="0 0 ' + (C * c + 4) + ' ' + (R * c + 5) + '" role="img" aria-label="' + (opt.aria || 'vista') + '">' + s + '</svg>';
  }
  function tresVistas(H, R) {
    R = R || 4;
    function caja(t, svg) { return '<figure class="vi-vista"><figcaption>' + t + '</figcaption>' + svg + '</figure>'; }
    return '<div class="vi-vistas">' + caja('De frente', dibujaGrid(alzadoGrid(vFrente(H), R), { suelo: true, aria: 'vista de frente' })) +
      caja('Desde arriba', dibujaGrid(plantaGrid(H), { aria: 'vista desde arriba', col: '#9db8ef' })) +
      caja('De lado', dibujaGrid(alzadoGrid(vLado(H), R), { suelo: true, aria: 'vista de lado' })) + '</div>';
  }
  function copia(H) { return H.map(function (f) { return f.slice(); }); }

  // --- 2a. Construir
  var FIGURAS = [
    ['Escalera', [[3, 2, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]],
    ['Ele', [[2, 0, 0, 0], [1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]]],
    ['Torre y muro', [[1, 1, 1, 1], [0, 0, 0, 0], [0, 4, 0, 0], [0, 0, 0, 0]]],
    ['Pirámide', [[1, 1, 1, 0], [1, 2, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0]]],
    ['Vacía', [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]]
  ];
  function viConstruye(box) {
    var H = copia(FIGURAS[1][1]), poner = true, dib = h('div', { class: 'vi-dib' }), vistas = h('div'), cuenta = h('p', { class: 'pj-big' }), red = h('div', { class: 'vi-red' });
    function pinta() {
      dib.innerHTML = iso(H);
      vistas.innerHTML = tresVistas(H);
      var pisos = []; for (var k = 1; k <= 4; k++) { var n = 0; H.forEach(function (f) { f.forEach(function (v) { if (v >= k) n++; }); }); if (n) pisos.push(n); }
      cuenta.innerHTML = 'Cubos: <b>' + suma(H) + '</b>' + (pisos.length > 1 ? ' <small>(' + pisos.map(function (n, i) { return 'piso ' + (i + 1) + ': ' + n; }).join(' · ') + ')</small>' : '');
      red.innerHTML = '';
      H.forEach(function (f, y) { f.forEach(function (v, x) {
        red.appendChild(h('button', { type: 'button', class: 'vi-celda' + (v ? ' on' : ''), text: v ? String(v) : '', 'aria-label': 'Fila ' + (y + 1) + ', columna ' + (x + 1) + ': ' + v + ' cubos',
          onclick: function () { H[y][x] = poner ? Math.min(4, v + 1) : Math.max(0, v - 1); pinta(); } }));
      }); });
    }
    var modo = selector([[1, 'Poner cubos'], [0, 'Quitar cubos']], 1, function (v) { poner = !!v; });
    box.appendChild(selector(FIGURAS.map(function (f, i) { return [i, f[0]]; }), 1, function (i) { H = copia(FIGURAS[i][1]); pinta(); }));
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [dib, cuenta]),
      h('div', { class: 'pj-col' }, [h('h2', { text: 'La cuadrícula desde arriba (toca para poner o quitar)' }), modo, red,
        h('p', { class: 'pj-info', text: 'El número es cuántos cubos tiene cada torre. La fila de abajo es la de delante.' }), vistas])]));
    pinta();
    return { q: 'Haced una figura cuya vista de frente sea un cuadrado de 2 × 2. ¿Cuántos cubos hacen falta como mínimo? ¿Y como máximo, en esta cuadrícula?',
      a: 'Como mínimo <b>4</b>: dos torres de 2, una al lado de la otra. Se pueden añadir torres de 1 o 2 cubos detrás (en las mismas dos columnas) sin que cambie la vista de frente: como máximo, 2 columnas × 4 filas × 2 pisos = <b>16</b>.' };
  }

  // --- 2b. ¿Qué vista es?
  function viCual(box) {
    var H, pide = 'frente', ronda = 0, txt = h('p', { class: 'pj-status' }), dib = h('div', { class: 'vi-dib' }), q = h('p', { class: 'ad-q' }), ops = h('div', { class: 'vi-ops' }), aciertos = 0, hechas = 0, marc = h('p', { class: 'pj-info' });
    var NOM = { frente: 'de frente', lado: 'de lado (desde la derecha)', arriba: 'desde arriba' };
    function vista(t) { return t === 'arriba' ? plantaGrid(H) : alzadoGrid(t === 'frente' ? vFrente(H) : vLado(H), 3); }
    function nueva() {
      pide = ['frente', 'lado', 'arriba'][ronda++ % 3];
      var buenas;
      for (var i = 0; i < 400; i++) {
        H = []; for (var y = 0; y < 3; y++) { H.push([]); for (var x = 0; x < 3; x++) H[y].push(rnd(3) ? rnd(4) : 0); }
        var tot = suma(H);
        if (tot < 5 || tot > 11) continue;
        var V = { frente: vista('frente'), lado: vista('lado'), arriba: vista('arriba') }, ok = V[pide], mir = espejo(ok);
        var otra = pide === 'frente' ? V.lado : V.frente;
        var set = [clave(ok), clave(mir), clave(otra)];
        if (set[0] !== set[1] && set[0] !== set[2] && set[1] !== set[2]) { buenas = [[ok, 'ok'], [mir, 'espejo'], [otra, pide === 'frente' ? 'lado' : 'frente']]; break; }
      }
      buenas = P.shuffle(buenas);
      dib.innerHTML = iso(H, { flecha: pide });
      q.innerHTML = '¿Cuál es la vista <b>' + NOM[pide] + '</b>?';
      ops.innerHTML = '';
      buenas.forEach(function (o, k) {
        var b0 = h('button', { type: 'button', class: 'vi-op', 'aria-label': 'Opción ' + (k + 1), html: '<b>' + 'ABC'[k] + '</b>' + dibujaGrid(o[0], { suelo: pide !== 'arriba', col: pide === 'arriba' ? '#9db8ef' : null }) });
        b0.addEventListener('click', function () {
          if (ops.classList.contains('hecho')) return;
          ops.classList.add('hecho'); hechas++;
          b0.classList.add(o[1] === 'ok' ? 'bien' : 'mal');
          if (o[1] === 'ok') { aciertos++; setStatus(txt, 'good', '¡Sí! Esa es la vista ' + NOM[pide] + '.'); burst(b0); }
          else {
            Array.prototype.forEach.call(ops.children, function (c, j) { if (buenas[j][1] === 'ok') c.classList.add('bien'); });
            setStatus(txt, 'bad', o[1] === 'espejo' ? 'Esa está al revés, como en un espejo: es como se vería desde el otro lado.' : 'Esa es la vista ' + NOM[o[1]] + '.');
          }
          marc.textContent = 'Aciertos: ' + aciertos + ' de ' + hechas;
        });
        ops.appendChild(b0);
      });
      ops.classList.remove('hecho'); setStatus(txt, '', '');
    }
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [dib]), h('div', { class: 'pj-col' }, [q, ops, txt, h('div', { class: 'pj-row' }, [btn('Otra figura', nueva, 'go')]), marc])]));
    nueva();
    return { q: 'En la vista de frente no se sabe cuántas filas tiene la figura. ¿Qué vista lo dice?',
      a: 'La vista <b>desde arriba</b> (o la de lado): de frente, una torre de delante tapa las que tiene detrás. Por eso en los planos se dibujan al menos dos vistas.' };
  }

  // --- 2c. ¿Cuántos cubos?
  // Figuras «en grada»: las torres no crecen hacia delante ni hacia la derecha, así se ve la cara de arriba de todas.
  function grada() {
    for (;;) {
      var H = [];
      for (var y = 0; y < 4; y++) {
        H.push([]);
        for (var x = 0; x < 4; x++) {
          var lim = Math.min(y ? H[y - 1][x] : 4, x ? H[y][x - 1] : 4);
          H[y].push(x + y === 0 ? 2 + rnd(3) : lim ? Math.max(0, lim - rnd(3)) : 0);
        }
      }
      var tot = suma(H), alto = H[0][0];
      if (tot >= 7 && tot <= 22 && alto >= 3 && H[3][3] === 0) return H;
    }
  }
  function viCuantos(box) {
    var H, txt = h('p', { class: 'pj-status' }), dib = h('div', { class: 'vi-dib' }), sol = h('div', { class: 'vi-sol', hidden: true }), inp = h('input', { type: 'number', class: 'ad-in', min: 0, 'aria-label': 'Cubos que contáis' });
    function nueva() { H = grada(); dib.innerHTML = iso(H, { flechas: false }); sol.hidden = true; inp.value = ''; setStatus(txt, '', 'Ningún cubo está en el aire: cada torre llega hasta el suelo. ¿Cuántos cubos hay, contando los que no se ven?'); }
    function solucion() {
      var pisos = []; for (var k = 1; k <= 4; k++) { var n = 0; H.forEach(function (f) { f.forEach(function (v) { if (v >= k) n++; }); }); if (n) pisos.push(n); }
      sol.innerHTML = '<div class="vi-solgrid"><figure class="vi-vista"><figcaption>Desde arriba, con la altura de cada torre</figcaption>' + dibujaGrid(plantaGrid(H), { nums: H, c: 40, aria: 'planta con números' }) + '</figure>' +
        '<p>Por pisos: ' + pisos.map(function (n, i) { return 'piso ' + (i + 1) + ', <b>' + n + '</b>'; }).join(' · ') + '. Total: ' + pisos.join(' + ') + ' = <b>' + suma(H) + '</b> cubos.</p></div>';
      sol.hidden = false;
    }
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [dib]), h('div', { class: 'pj-col' }, [txt,
      h('div', { class: 'pj-row' }, ['Hay ', inp, ' cubos ', btn('Comprobar', function () {
        if (inp.value === '') { setStatus(txt, 'bad', 'Escribid cuántos cubos contáis.'); return; }
        var n = Number(inp.value), t = suma(H);
        if (n === t) { setStatus(txt, 'good', '¡Sí! Hay ' + t + ' cubos.'); burst(dib); }
        else setStatus(txt, 'bad', n < t ? 'Faltan cubos: contad también los que quedan tapados debajo de los de arriba.' : 'Os sobran cubos: ¿habéis contado alguno dos veces?');
        solucion();
      }, 'go')]), h('div', { class: 'pj-row' }, [btn('Ver la solución', solucion), btn('Otra figura', nueva)]), sol])]));
    nueva();
    return { q: '¿Por qué es más fácil contar por pisos que de uno en uno?',
      a: 'Porque cada piso es una capa plana: el piso 1 son todas las torres; el piso 2, las que tienen al menos 2 cubos, y así. Al contar por pisos se cuentan también los cubos tapados. Desde arriba, con el número de cada torre, basta con sumar: es el <b>volumen</b> contado en cubos.' };
  }
  window.Proyectables.register('vistas', porModos([['', viConstruye], ['cual', viCual], ['cuantos', viCuantos]]));

  /* ================================================================ 3. Mensajes */
  var SCC = { eve: '#FFBF00', control: '#FFAB19', looks: '#9966FF', vars: '#FF8C1A', op: '#59C059' };
  var MKC = { radio: '#E3008C', bas: '#1E90FF', inp: '#D400D4' };
  function blq(col, html, cls) { return '<div class="rp-b' + (cls ? ' ' + cls : '') + '" style="background:' + col + '">' + html + '</div>'; }
  function rep(col, html) { return '<span class="rp-r" style="background:' + col + '">' + html + '</span>'; }
  function val(x) { return '<span class="rp-v">' + x + '</span>'; }
  function sobre() { return '<svg class="ms-sobre" viewBox="0 0 30 22" aria-hidden="true"><rect x="1" y="1" width="28" height="20" rx="3" fill="#fff" stroke="#1a1d24" stroke-width="2"/><path d="M2 3l13 10L28 3" fill="none" stroke="#1a1d24" stroke-width="2"/></svg>'; }

  // --- 3a. Scratch: enviar y recibir
  // Cada objeto con sus programas: [mensaje que recibe, bloque que hace, qué cambia en el escenario]
  var OBJETOS = [
    { id: 'robi', nom: 'Robi', recibe: [['nivel 2', blq(SCC.looks, 'decir ' + val('¡Nivel 2!') + ' durante ' + val(2) + ' segundos'), 'dice'], ['fin del juego', blq(SCC.looks, 'decir ' + val('¡Fin!')), 'fin']],
      envia: [['nivel 2', 'puntos', 5], ['fin del juego', 'vidas', 0]] },
    { id: 'meteorito', nom: 'Meteorito', recibe: [['nivel 2', blq(SCC.vars, 'dar a ' + rep(SCC.vars, 'velocidad') + ' el valor ' + val(10)), 'rapido'], ['fin del juego', blq(SCC.looks, 'esconder'), 'esconde']] },
    { id: 'manzana', nom: 'Manzana', recibe: [['fin del juego', blq(SCC.looks, 'esconder'), 'esconde']] },
    { id: 'escenario', nom: 'Escenario', recibe: [['nivel 2', blq(SCC.looks, 'cambiar fondo a ' + val('espacio')), 'espacio'], ['fin del juego', blq(SCC.looks, 'cambiar fondo a ' + val('fin')), 'fondofin']] }
  ];
  function msScratch(box) {
    var est, cards = {}, creo = {}, txt = h('p', { class: 'pj-status' }), escena = h('div', { class: 'ms-escena' }), timer = null, mx = 60;
    function inicial() { est = { fondo: 'cielo', vel: 5, robiDice: '', ocultos: {} }; mx = 60; }
    function pintaEscena() {
      var f = est.fondo, s = '';
      if (f === 'cielo') s += '<rect width="480" height="270" fill="#cfe7fb"/><rect y="230" width="480" height="40" fill="#8fcf6e"/>';
      else if (f === 'espacio') { s += '<rect width="480" height="270" fill="#14183a"/>'; [[40, 30], [120, 80], [210, 40], [300, 100], [400, 50], [450, 140], [80, 160], [350, 190]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.2" fill="#fff"/>'; }); s += '<rect y="230" width="480" height="40" fill="#5b5f73"/>'; }
      else s += '<rect width="480" height="270" fill="#2a2e38"/><text x="240" y="135" text-anchor="middle" font-size="54" font-weight="800" fill="#fff">FIN</text>';
      if (!est.ocultos.manzana) s += '<g transform="translate(330 200)"><circle r="16" fill="#cf3f36" stroke="#8f2a22" stroke-width="2"/><path d="M0 -15q4 -9 11 -10" stroke="#3d6b2a" stroke-width="3" fill="none"/></g>';
      if (!est.ocultos.meteorito) s += '<g transform="translate(' + mx.toFixed(0) + ' 70)"><path d="M-46 -6L-12 -2L-12 2L-46 6Z" fill="#f5a24f" opacity=".7"/><circle r="16" fill="#8c6b4f" stroke="#5a4330" stroke-width="2"/><circle cx="-4" cy="-4" r="4" fill="#6f533b"/></g>' +
        '<text x="12" y="24" font-size="15" font-weight="700" fill="' + (f === 'cielo' ? '#1a1d24' : '#fff') + '">velocidad del meteorito: ' + est.vel + '</text>';
      s += '<g transform="translate(70 196) scale(.9) translate(-30 -30)">' + P.ROBOT_BODY + '</g>';
      if (est.robiDice) s += '<g transform="translate(100 140)"><rect x="0" y="-26" width="' + (est.robiDice.length * 11 + 24) + '" height="34" rx="12" fill="#fff" stroke="#1a1d24" stroke-width="2"/><text x="12" y="-3" font-size="17" font-weight="700" fill="#1a1d24">' + est.robiDice + '</text></g>';
      escena.innerHTML = '<svg viewBox="0 0 480 270" role="img" aria-label="Escenario del juego">' + s + '</svg>';
    }
    function mueve() {
      clearInterval(timer);
      if (quieto()) return;
      timer = setInterval(function () { if (!escena.isConnected) { clearInterval(timer); return; } if (!escena.offsetParent) return; mx += est.vel; if (mx > 520) mx = -40; pintaEscena(); }, 60);
    }
    var grid = h('div', { class: 'ms-objs' });
    OBJETOS.forEach(function (o) {
      var progs = o.recibe.map(function (r) { return '<div class="ms-prog" data-m="' + r[0] + '">' + blq(SCC.eve, 'al recibir ' + val(r[0]), 'hat') + r[1] + '</div>'; }).join('');
      if (o.envia) progs = o.envia.map(function (e) { return '<div class="ms-prog env" data-e="' + e[0] + '">' + '<div class="rp-c" style="--bc:' + SCC.control + '"><div class="rp-ch">si ' + rep(SCC.op, rep(SCC.vars, e[1]) + ' = ' + val(e[2])) + ' entonces</div><div class="rp-cin">' + blq(SCC.eve, 'enviar ' + val(e[0])) + '</div><div class="rp-cf"></div></div></div>'; }).join('') + progs;
      var marca = h('button', { type: 'button', class: 'ms-creo', 'aria-pressed': 'false', text: '¿Reacciona?' });
      marca.addEventListener('click', function () { creo[o.id] = !creo[o.id]; marca.setAttribute('aria-pressed', String(!!creo[o.id])); marca.textContent = creo[o.id] ? 'Creemos que sí' : '¿Reacciona?'; });
      var res = h('p', { class: 'ms-res' });
      var card = h('div', { class: 'ms-obj' }, [h('div', { class: 'ms-head' }, [h('b', { text: o.nom }), marca]), h('div', { class: 'ms-progs', html: progs }), res]);
      cards[o.id] = { card: card, res: res, marca: marca };
      grid.appendChild(card);
    });
    function limpia() {
      OBJETOS.forEach(function (o) { var c0 = cards[o.id]; c0.card.classList.remove('si', 'no', 'llega'); c0.res.innerHTML = ''; c0.card.querySelectorAll('.ms-prog').forEach(function (p) { p.classList.remove('on'); }); });
    }
    function envia(m) {
      limpia();
      var emisor = cards.robi.card.querySelector('[data-e="' + m + '"]');
      if (emisor) emisor.classList.add('on');
      var reaccionan = [], prediccion = Object.keys(creo).some(function (k) { return creo[k]; }), aciertos = 0;
      OBJETOS.forEach(function (o, i) {
        var c0 = cards[o.id], r = o.recibe.filter(function (x) { return x[0] === m; })[0];
        setTimeout(function () {
          c0.card.classList.add('llega', r ? 'si' : 'no');
          if (r) {
            c0.card.querySelector('[data-m="' + m + '"]').classList.add('on');
            c0.res.innerHTML = sobre() + ' Le llega «' + m + '» y <b>reacciona</b>.';
            if (r[2] === 'dice') est.robiDice = '¡Nivel 2!'; else if (r[2] === 'fin') est.robiDice = '¡Fin!';
            else if (r[2] === 'rapido') est.vel = 10; else if (r[2] === 'esconde') est.ocultos[o.id] = true;
            else if (r[2] === 'espacio') est.fondo = 'espacio'; else if (r[2] === 'fondofin') est.fondo = 'fin';
            pintaEscena();
          } else c0.res.innerHTML = sobre() + ' Le llega «' + m + '», pero no tiene «al recibir ' + m + '»: <b>no hace nada</b>.';
        }, quieto() ? 0 : 350 + 300 * i);
        if (r) reaccionan.push(o.nom);
        if (!!r === !!creo[o.id]) aciertos++;
      });
      setTimeout(function () {
        setStatus(txt, 'good', 'El mensaje «' + m + '» llega a todos los objetos. Reaccionan los que tienen «al recibir ' + m + '»: ' + reaccionan.join(', ').replace(/, ([^,]*)$/, ' y $1') + '.' +
          (prediccion ? ' Habéis acertado ' + aciertos + ' de ' + OBJETOS.length + '.' : ''));
      }, quieto() ? 0 : 350 + 300 * OBJETOS.length);
    }
    box.appendChild(h('p', { class: 'pj-info', text: 'Antes de enviar, tocad «¿Reacciona?» en los objetos que creéis que harán algo.' }));
    box.appendChild(h('div', { class: 'pj-row' }, [btn('Robi llega a 5 puntos', function () { envia('nivel 2'); }, 'go'), btn('Robi se queda sin vidas', function () { envia('fin del juego'); }, 'go'),
      btn('Empezar otra vez', function () { inicial(); limpia(); creo = {}; OBJETOS.forEach(function (o) { cards[o.id].marca.setAttribute('aria-pressed', 'false'); cards[o.id].marca.textContent = '¿Reacciona?'; }); setStatus(txt, '', ''); pintaEscena(); mueve(); })]));
    box.appendChild(h('div', { class: 'pj-two ms-two' }, [h('div', { class: 'pj-col' }, [escena, txt]), h('div', { class: 'pj-col' }, [grid])]));
    inicial(); pintaEscena(); mueve();
    return { q: 'Queremos que en el nivel 2 la manzana también cambie: que se haga más pequeña. ¿Qué hay que añadir y en qué objeto?',
      a: 'En la <b>manzana</b>: «al recibir nivel 2» → «fijar tamaño al 50 %». No hay que tocar a Robi: él ya envía el mensaje, y el mensaje llega a todos.' };
  }

  // --- 3b. Radio de la micro:bit: si compartes grupo, compartes mensajes
  var DIG = { 1: '..#...##....#....#...###.', 2: '###.....#..##..#....####.', 3: '####....#...#..#..#..##..', 4: '..##..#.#.#..#.####....#.', 5: '####.#....###.....####...',
    6: '...#...#...###.#...#.###.', 7: '#####...#...#...#...#....', 8: '.###.#...#.###.#...#.###.', 9: '.###.#...#.###...#...#...' };
  var RETOS_RADIO = [
    ['Libre', null, 'Cambiad los grupos y pulsad el botón A de una placa.'],
    ['Reto 1', function (g) { return g[0] === g[1] && g.filter(function (x) { return x === g[0]; }).length === 2; }, 'Los equipos 1 y 2 quieren hablar entre ellos sin que nadie más se entere.'],
    ['Reto 2', function (g) { return g[0] === g[1] && g[1] === g[2] && g[3] === g[4] && g[4] === g[5] && g[0] !== g[3]; }, 'Dos redes: los equipos 1, 2 y 3 en una, y los equipos 4, 5 y 6 en otra.'],
    ['Reto 3', function (g) { return g.every(function (x, i) { return g.indexOf(x) === i; }); }, 'Que nadie oiga a nadie: cada equipo en su grupo.']
  ];
  function placa(pat, sel) {
    var s = '<rect x="2" y="2" width="196" height="150" rx="16" fill="#1a1d24"/>';
    for (var i = 0; i < 25; i++) { var on = pat && pat[i] === '#'; s += '<rect x="' + (63 + (i % 5) * 16) + '" y="' + (39 + Math.floor(i / 5) * 16) + '" width="10" height="10" rx="2" fill="' + (on ? '#ff3b30' : '#3a3f4b') + '"/>'; }
    s += '<circle cx="30" cy="77" r="14" fill="#5d6474"/><text x="30" y="83" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">A</text>';
    s += '<circle cx="170" cy="77" r="14" fill="#5d6474"/><text x="170" y="83" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">B</text>';
    if (sel) s += '<circle cx="100" cy="77" r="70" fill="none" stroke="#E3008C" stroke-width="4" class="ms-onda"/>';
    return '<svg viewBox="0 0 200 154" aria-hidden="true">' + s + '</svg>';
  }
  function msRadio(box) {
    var G = [1, 1, 1, 1, 1, 1], muestra = [null, null, null, null, null, null], emisor = -1, numero = 1, reto = 0, txt = h('p', { class: 'pj-status' }), red = h('div', { class: 'ms-red' }), enun = h('p', { class: 'pj-big' });
    var nInp = h('select', { class: 'ms-num', 'aria-label': 'Número que se envía' });
    for (var k = 1; k <= 9; k++) nInp.appendChild(h('option', { value: k, text: String(k) }));
    nInp.addEventListener('change', function () { numero = +nInp.value; });
    function pinta() {
      red.innerHTML = '';
      G.forEach(function (g, i) {
        var menos = btn('−', function () { G[i] = Math.max(1, g - 1); limpiar(); pinta(); }), mas = btn('+', function () { G[i] = Math.min(9, g + 1); limpiar(); pinta(); });
        menos.setAttribute('aria-label', 'Bajar el grupo del equipo ' + (i + 1)); mas.setAttribute('aria-label', 'Subir el grupo del equipo ' + (i + 1));
        var pulsa = btn('Pulsar A', function () { enviar(i); });
        pulsa.setAttribute('aria-label', 'Pulsar el botón A del equipo ' + (i + 1));
        red.appendChild(h('div', { class: 'ms-mb' + (i === emisor ? ' emite' : muestra[i] ? ' recibe' : '') }, [
          h('b', { text: 'Equipo ' + (i + 1) }), h('div', { class: 'ms-svg', html: placa(muestra[i] ? DIG[muestra[i]] : null, i === emisor && !quieto()) }),
          h('div', { class: 'ms-grupo' }, [h('span', { text: 'grupo' }), menos, h('b', { text: String(g) }), mas]), pulsa]));
      });
    }
    function limpiar() { muestra = [null, null, null, null, null, null]; emisor = -1; }
    function enviar(i) {
      limpiar(); emisor = i;
      var rec = [];
      G.forEach(function (g, j) { if (j !== i && g === G[i]) { muestra[j] = numero; rec.push(j + 1); } });
      pinta();
      setStatus(txt, rec.length ? 'good' : '', 'El equipo ' + (i + 1) + ' envía el ' + numero + ' por el grupo ' + G[i] + '. ' +
        (rec.length ? (rec.length === 1 ? 'Lo recibe el equipo ' + rec[0] + ', que está' : 'Lo reciben los equipos ' + rec.join(', ').replace(/, ([^,]*)$/, ' y $1') + ', que están') + ' en el mismo grupo.' : 'Nadie más está en el grupo ' + G[i] + ': no lo recibe nadie.') +
        ' La placa que envía no lo muestra: no recibe sus propios mensajes.');
    }
    var tabs = selector(RETOS_RADIO.map(function (r, i) { return [i, r[0]]; }), 0, function (i) { reto = i; G = [1, 1, 1, 1, 1, 1]; limpiar(); pinta(); enun.textContent = RETOS_RADIO[i][2]; setStatus(txt, '', ''); comp.hidden = !RETOS_RADIO[i][1]; });
    var comp = btn('Comprobar el reto', function () {
      var ok = RETOS_RADIO[reto][1](G);
      setStatus(txt, ok ? 'good' : 'bad', ok ? '¡Reto conseguido! Probad a pulsar A en varias placas para verlo.' : 'Todavía no. Mirad los números de grupo: solo se oyen las placas que tienen el mismo.');
      if (ok) burst(red);
    }, 'go');
    comp.hidden = true;
    var prog = '<div class="rp-prog ms-mk">' +
      '<div class="ms-prog">' + blq(MKC.bas, 'al iniciar', 'hat') + blq(MKC.radio, 'radio establecer grupo ' + val('el de cada equipo')) + '</div>' +
      '<div class="ms-prog">' + blq(MKC.inp, 'al presionarse el botón ' + val('A'), 'hat') + blq(MKC.radio, 'radio enviar número ') + '</div>' +
      '<div class="ms-prog">' + blq(MKC.radio, 'al recibir radio ' + rep(MKC.radio, 'receivedNumber'), 'hat') + blq(MKC.bas, 'mostrar número ' + rep(MKC.radio, 'receivedNumber')) + '</div></div>';
    var progEl = h('div', { html: prog });
    // el número que se envía, dentro de su bloque
    progEl.querySelectorAll('.rp-b')[3].appendChild(nInp);
    box.appendChild(tabs);
    box.appendChild(enun);
    box.appendChild(h('div', { class: 'pj-two' }, [h('div', { class: 'pj-col' }, [red]), h('div', { class: 'pj-col' }, [h('h2', { text: 'El programa de todas las placas (MakeCode)' }), progEl, comp, txt])]));
    enun.textContent = RETOS_RADIO[0][2];
    pinta();
    return { q: 'En clase hay 6 equipos y cada uno elige su grupo al azar entre el 1 y el 9. ¿Puede pasar que dos equipos se oigan sin querer?',
      a: 'Sí, y es lo más probable: con 9 grupos y 6 equipos, casi 9 de cada 10 veces coinciden al menos dos (solo 60.480 de los 531.441 repartos posibles tienen los 6 grupos distintos). Por eso cada equipo pide su número al docente y se apunta en la pizarra. De verdad hay 256 grupos (del 0 al 255) y la idea es la misma: <b>si compartes grupo, compartes mensajes</b>.' };
  }
  window.Proyectables.register('mensajes', porModos([['', msScratch], ['radio', msRadio]]));

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-qrfull]'); if (!b) return;
    var q = b.closest('section.page').querySelector('.tqr');
    if (document.fullscreenElement) { document.exitFullscreen().catch(function () {}); return; }
    if (q.requestFullscreen) q.requestFullscreen().catch(function () { q.classList.toggle('tqr-max'); }); else q.classList.toggle('tqr-max');
  });
  document.addEventListener('click', function (e) { var q = e.target.closest && e.target.closest('.tqr.tqr-max'); if (q) q.classList.remove('tqr-max'); });

  window.PJNuevas = { maxPreguntas: maxPreguntas, cadena: cadena, mitad: mitad, vFrente: vFrente, vLado: vLado, suma: suma, grada: grada };
})();
