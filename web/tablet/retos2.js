/* Retos de Código Escuela 4.0 · segunda tanda: cartas binarias, mensajes secretos, la tortuga y los polígonos, píxel art,
   ¿qué hace el programa?, la regla secreta, ordenar con la balanza y velocidad × tiempo.
   Cada actividad se registra con RetosAPI.registra; el núcleo (tablet.js) pone el menú, los niveles y las estrellas. */
(function () {
  'use strict';
  var BANDERA = "<svg viewBox=\"0 0 16 16\" width=\"22\" height=\"22\" aria-label=\"bandera verde\" style=\"display:inline-block\"><path d=\"M3.2 1.6v12.8\" stroke=\"#3d8a37\" stroke-width=\"1.7\" stroke-linecap=\"round\"/><path d=\"M4 2.6c2.1-1.2 3.9.8 6 0 1-.4 1.9-.7 2.8-.5v6.4c-.9-.2-1.8.1-2.8.5-2.1.8-3.9-1.2-6 0z\" fill=\"#4cbf56\" stroke=\"#3d8a37\" stroke-width=\".9\"/></svg>";
  var A = window.RetosAPI, h = A.h, rnd = A.rnd, shuffle = A.shuffle, sg = A.sg, PRUEBA = A.prueba;

  // Partida de rondas: N retos por nivel; al final, las estrellas según los aciertos.
  // El primer fallo de cada ronda no cuenta: sale una pista y se vuelve a intentar (otra). Si se acierta, cuenta como acierto.
  function partida(act, nivel, total, lado, est, ronda, bSig, nuevo) {
    var P = { bien: 0, hecho: 0, segunda: false };
    function cuenta(next) { ronda.textContent = 'Reto ' + (P.hecho + (next ? 1 : 0)) + ' de ' + total + ' · aciertos: ' + P.bien; }
    return {
      ronda: function () { return P.hecho; },
      empieza: function () { bSig.hidden = true; P.segunda = false; cuenta(true); },
      otra: function (pista) { if (P.segunda) return false; P.segunda = true; A.estado(est, 'pista', 'Todavía no. ' + pista); return true; },
      puedeOtra: function () { return !P.segunda; },
      acaba: function (ok, msg) {
        P.hecho++; if (ok) P.bien++;
        A.estado(est, ok ? 'bien' : 'mal', ok && P.segunda ? msg.replace('¡Muy bien! ', '¡Ahora sí! ') : msg); cuenta(false);
        if (P.hecho >= total) {
          var e = A.estrellasRondas(P.bien, total);
          A.apunta(act, nivel, e);
          A.resultado(est, P.bien, total, e);
          var b = A.boton('Jugar otra vez', function () { P.bien = 0; P.hecho = 0; b.remove(); nuevo(); }, 'verde');
          lado.append(b);
        } else bSig.hidden = false;
      }
    };
  }
  function base(zona, izq) {
    var est = h('p', { class: 'estado' }), enun = h('p', { class: 'enunciado' }), ronda = h('p', { class: 'ronda' }), lado = h('div', { class: 'panel' });
    zona.append(h('div', { class: 'juego' }, [h('div', { class: 'panel' }, izq), lado]));
    return { est: est, enun: enun, ronda: ronda, lado: lado };
  }

  /* ================================================================ 6. Cartas binarias */
  // Cada carta tiene el doble de puntos que la de su derecha. Boca arriba cuenta; boca abajo, no: así se escriben los números con unos y ceros.
  var NIV_BIN = [{ t: '¿Qué número es? (4 cartas)', n: 4, modo: 'leer' }, { t: '¿Qué número es? (5 cartas)', n: 5, modo: 'leer' },
    { t: 'Forma el número (5 cartas)', n: 5, modo: 'formar' }, { t: 'Forma el número (6 cartas)', n: 6, modo: 'formar' }];
  function carta(valor, arriba, pulsable) {
    var s = '<rect x="2" y="2" width="96" height="136" rx="10" fill="' + (arriba ? '#fff' : '#2c5bbf') + '" stroke="#1a1d24" stroke-width="3"/>';
    if (arriba) {
      var cols = valor >= 16 ? 4 : valor >= 4 ? 2 : 1, filas = Math.ceil(valor / cols), gx = 80 / cols, gy = Math.min(26, 104 / filas), r = Math.min(9, gx * .4, gy * .4);
      for (var i = 0; i < valor; i++) { var cx = 10 + gx / 2 + (i % cols) * gx, cy = 20 + gy / 2 + Math.floor(i / cols) * gy; s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#1a1d24"/>'; }
    } else for (var k = 0; k < 6; k++) s += '<path d="M10 ' + (20 + k * 20) + 'L90 ' + (30 + k * 20) + '" stroke="#5f88dd" stroke-width="5"/>';
    return '<svg viewBox="0 0 100 140" aria-hidden="true">' + s + '</svg>';
  }
  function binario(zona, nivel) {
    var nv = NIV_BIN[nivel - 1], vals = [], up = [], obj = 0, hecho = false;
    for (var i = nv.n - 1; i >= 0; i--) vals.push(Math.pow(2, i));
    var fila = h('div', { class: 'cartas' }), bits = h('p', { class: 'bits' });
    var B = base(zona, [fila, bits, h('p', { class: 'ayuda', text: 'Cada carta tiene el doble de puntos que la de su derecha. Boca arriba cuenta (1); boca abajo, no (0).' })]);
    var bSig = A.boton('Siguiente', nuevo, 'primario'), cas = A.casilla(), tec = null, bOk = null;
    var J = partida('binario', nivel, 8, B.lado, B.est, B.ronda, bSig, nuevo);
    function pinta(mostrar) {
      fila.innerHTML = '';
      vals.forEach(function (v, i) {
        var b = h('button', { type: 'button', class: 'carta' + (up[i] ? ' arriba' : ''), html: carta(v, up[i]) + '<b>' + (up[i] || mostrar ? v : '') + '</b>', 'aria-label': 'Carta de ' + v + (up[i] ? ', boca arriba' : ', boca abajo'),
          onclick: function () { if (nv.modo !== 'formar' || hecho) return; up[i] = !up[i]; pinta(); } });
        if (nv.modo !== 'formar') b.disabled = true;
        fila.append(b);
      });
      bits.textContent = mostrar || nv.modo === 'formar' ? up.map(function (u) { return u ? '1' : '0'; }).join(' ') : '';
    }
    function nuevo() {
      hecho = false; J.empieza();
      var max = Math.pow(2, nv.n) - 1, ant = obj;
      do obj = 1 + rnd(max); while (obj === ant);
      PRUEBA.obj = obj;
      if (nv.modo === 'leer') { up = vals.map(function (v) { return (obj & v) > 0; }); tec.limpia(); B.enun.innerHTML = '¿Qué número forman las cartas?'; }
      else { up = vals.map(function () { return false; }); B.enun.innerHTML = 'Pon boca arriba las cartas que suman <b>' + obj + '</b>.'; }
      pinta(false);
      A.estado(B.est, '', nv.modo === 'leer' ? 'Suma los puntos de las cartas que están boca arriba.' : 'Toca una carta para darle la vuelta.');
    }
    function comprueba(n) {
      var suma = vals.reduce(function (a, v, i) { return a + (up[i] ? v : 0); }, 0), ok = nv.modo === 'leer' ? n === obj : suma === obj;
      var arriba = vals.filter(function (v, i) { return up[i]; });
      if (!ok && J.otra(nv.modo === 'leer' ? 'Suma los puntos de las cartas boca arriba: ' + arriba.join(' + ') + ' = ?'
        : 'Tus cartas suman ' + suma + '. Empieza por la carta más grande que no se pase de ' + obj + ' y ve añadiendo cartas.')) { if (tec) tec.limpia(); return; }
      hecho = true;
      pinta(true);
      if (nv.modo === 'leer') J.acaba(n === obj, (n === obj ? '¡Muy bien! ' : 'No. ') + 'Es el <b>' + obj + '</b>: ' + vals.filter(function (v, i) { return up[i]; }).join(' + ') + ' = ' + obj + '. En binario: ' + up.map(function (u) { return u ? 1 : 0; }).join('') + '.');
      else J.acaba(suma === obj, suma === obj ? '¡Muy bien! ' + vals.filter(function (v, i) { return up[i]; }).join(' + ') + ' = ' + obj + '. En binario: ' + up.map(function (u) { return u ? 1 : 0; }).join('') + '.' : 'Tus cartas suman ' + suma + ', no ' + obj + '. Empieza por la carta más grande que quepa.');
    }
    B.lado.append(B.enun, B.ronda);
    if (nv.modo === 'leer') {
      tec = A.teclado([cas], function (v) { if (hecho) { if (!bSig.hidden) nuevo(); return; } if (v[0] === null) { A.estado(B.est, 'mal', 'Escribe un número.'); return; } comprueba(v[0]); });
      B.lado.append(h('div', { class: 'respuesta' }, ['Es el', cas]), tec.el);
    } else {
      bOk = A.boton('Comprobar', function () { if (!hecho) comprueba(); }, 'verde');
      B.lado.append(h('div', { class: 'fila' }, [bOk]));
      A.tecla(function (k) { if (k === 'Enter') { if (hecho) { if (!bSig.hidden) nuevo(); } else comprueba(); return true; } return false; });
    }
    B.lado.append(B.est, h('div', { class: 'fila' }, [bSig]));
    PRUEBA.resuelve = function () {
      if (nv.modo === 'leer') { String(obj).split('').forEach(function (d) { pulsaTecla(d); }); pulsaTecla('Comprobar'); }
      else { up = vals.map(function (v) { return (obj & v) > 0; }); pinta(); bOk.click(); }
    };
    nuevo();
  }
  function pulsaTecla(k) { [].find.call(document.querySelectorAll('.tecla'), function (b) { return b.textContent === k; }).click(); }

  /* ================================================================ 7. Mensajes secretos */
  var ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  var SIMB = '●■▲◆★▼◀▶◐◑◒◓○□△◇☆▽◁▷✚✖◎▣◈▤▥'.split('').map(function (c) { return c + '︎'; });  // FE0E: que no salgan como emoji
  // Sin tildes (la clave no las tiene). Las dos primeras palabras de cada nivel son cortas (3 o 4 letras), las dos siguientes de 4 o 5 y las últimas, más largas.
  var PALABRAS = ['SOL', 'MAR', 'LUZ', 'OSO', 'PAN', 'UVA', 'SUMA', 'CUBO', 'MAPA', 'NUBE', 'GATO', 'LUNA', 'TREN', 'FLOR', 'CASA', 'DATO', 'PATO', 'NIDO',
    'ROBOT', 'BUCLE', 'DATOS', 'RESTA', 'MITAD', 'DOBLE', 'CLAVE', 'VIDAS', 'RECTA', 'RELOJ', 'LIBRO', 'BARCO', 'PLAYA', 'QUESO',
    'BLOQUE', 'SENSOR', 'EVENTO', 'PUNTOS', 'MANZANA', 'ESTRELLA', 'PLANETA', 'PRISMA', 'TESORO', 'PIRATA', 'BANDERA', 'MONTAÑA', 'ARAÑA', 'CUADRADO', 'ESCUELA', 'SECRETO', 'CAMINO', 'PUENTE'];
  var LARGO = [[3, 4], [3, 4], [4, 5], [4, 5], [5, 8], [5, 8]];
  var NIV_CIF = [{ t: 'Código de números', modo: 'num' }, { t: 'Código de símbolos', modo: 'sim' }, { t: 'Desplazamiento de 3', modo: 'cesar3' }, { t: 'Descubre el desplazamiento', modo: 'cesar' }];
  function mueve(ch, k) { var i = ABC.indexOf(ch); return i < 0 ? ch : ABC[(i + k + 27 * 3) % 27]; }
  function cifrado(zona, nivel) {
    var nv = NIV_CIF[nivel - 1], pal = '', clave = 3, prueba = 0, hecho = false, ant = '';
    var msg = h('div', { class: 'cifra' }), llave = h('div', { class: 'llave' });
    var B = base(zona, [h('p', { class: 'panel-tit', text: 'El mensaje' }), msg, h('p', { class: 'panel-tit', text: 'La clave' }), llave]);
    var bSig = A.boton('Siguiente', nuevo, 'primario'), cas = h('div', { class: 'casilla ancha', role: 'textbox', 'aria-readonly': 'true', 'aria-label': 'Palabra que escribes' }), tec = null, vista = h('p', { class: 'cifra-prueba' });
    var marca = h('p', { class: 'cifra-marca' }), unidad = nv.modo === 'num' ? 'número' : nv.modo === 'sim' ? 'símbolo' : 'letra';
    var J = partida('cifrado', nivel, 6, B.lado, B.est, B.ronda, bSig, nuevo);
    function codigo(p) {
      if (nv.modo === 'num') return p.split('').map(function (c) { return ABC.indexOf(c) + 1; });
      if (nv.modo === 'sim') return p.split('').map(function (c) { return SIMB[ABC.indexOf(c)]; });
      return p.split('').map(function (c) { return mueve(c, clave); });
    }
    function pintaLlave() {
      if (nv.modo === 'num' || nv.modo === 'sim') llave.innerHTML = ABC.map(function (c, i) { return '<span><b>' + (nv.modo === 'num' ? i + 1 : SIMB[i]) + '</b>' + c + '</span>'; }).join('');
      else llave.innerHTML = '<div class="tira">' + ABC.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>' +
        '<p class="ayuda">' + (nv.modo === 'cesar3' ? 'Cada letra se ha cambiado por la que va <b>3 puestos después</b> (la Ñ cuenta). Para leerlo, vuelve 3 puestos atrás: la D es la A.' : 'Cada letra va unos puestos después (de 1 a 5). Prueba desplazamientos hasta que salga una palabra.') + '</p>';
    }
    // tocar un número, símbolo o letra del mensaje lo ilumina en la clave (así no hay que buscarlo entre 27)
    function ilumina(i, b) {
      [].forEach.call(llave.querySelectorAll('span'), function (x, k) { x.classList.toggle('on', k === i); });
      [].forEach.call(msg.children, function (x) { x.classList.toggle('on', x === b); });
    }
    function nuevo() {
      hecho = false; J.empieza();
      var lg = LARGO[Math.min(J.ronda(), LARGO.length - 1)], pool = PALABRAS.filter(function (w) { return w.length >= lg[0] && w.length <= lg[1] && w !== ant; });
      pal = pool[rnd(pool.length)]; ant = pal;
      clave = nv.modo === 'cesar' ? 1 + rnd(5) : 3; prueba = 0;
      PRUEBA.palabra = pal; PRUEBA.clave = clave;
      msg.innerHTML = ''; marca.innerHTML = '';
      codigo(pal).forEach(function (c) {
        var i = nv.modo === 'num' ? c - 1 : nv.modo === 'sim' ? SIMB.indexOf(c) : ABC.indexOf(c);
        msg.append(h('button', { type: 'button', class: 'cod', text: String(c), 'aria-label': 'Buscar ' + c + ' en la clave', onclick: function () { ilumina(i, this); } }));
      });
      ilumina(-1, null);
      if (tec) tec.limpia();
      if (nv.modo === 'cesar') pintaPrueba();
      B.enun.innerHTML = nv.modo === 'cesar' ? '¿Cuántos puestos se ha movido cada letra?' : '¿Qué palabra es?';
      A.estado(B.est, '', nv.modo === 'num' ? 'Busca cada número en la clave: el 1 es la A.' : nv.modo === 'sim' ? 'Busca cada símbolo en la clave.' : nv.modo === 'cesar3' ? 'Para cada letra, vuelve 3 puestos atrás en la tira.' : 'Cambia el desplazamiento hasta que se lea una palabra.');
    }
    function pintaPrueba() { vista.innerHTML = 'Con <b>' + prueba + '</b> puestos se lee: <span>' + codigo(pal).map(function (c) { return mueve(c, -prueba); }).join('') + '</span>'; }
    B.lado.append(B.enun, B.ronda);
    if (nv.modo === 'cesar') {
      var menos = A.boton('−', function () { if (hecho) return; prueba = (prueba + 5) % 6; pintaPrueba(); }), mas = A.boton('+', function () { if (hecho) return; prueba = (prueba + 1) % 6; pintaPrueba(); });
      menos.setAttribute('aria-label', 'Un puesto menos'); mas.setAttribute('aria-label', 'Un puesto más');
      var bOk = A.boton('Comprobar', function () {
        if (hecho) return;
        if (prueba !== clave && J.otra('Prueba los desplazamientos del 1 al 5, uno a uno, y elige el que deja una palabra que se entiende.')) return;
        hecho = true;
        J.acaba(prueba === clave, (prueba === clave ? '¡Muy bien! ' : 'No. ') + 'La clave era <b>' + clave + '</b> y la palabra, <b>' + pal + '</b>.');
      }, 'verde');
      B.lado.append(h('div', { class: 'fila' }, [menos, mas]), vista, h('div', { class: 'fila' }, [bOk]));
      A.tecla(function (k) { if (k === 'ArrowRight' || k === '+') { mas.click(); return true; } if (k === 'ArrowLeft' || k === '-') { menos.click(); return true; } if (k === 'Enter') { if (hecho) { if (!bSig.hidden) nuevo(); } else bOk.click(); return true; } return false; });
      PRUEBA.resuelve = function () { prueba = clave; pintaPrueba(); bOk.click(); };
    } else {
      tec = A.tecladoLetras(cas, function (v) {
        if (hecho) { if (!bSig.hidden) nuevo(); return; }
        if (!v) { A.estado(B.est, 'mal', 'Escribe la palabra.'); return; }
        if (v !== pal && J.otra(pistaPalabra(v))) {
          marca.innerHTML = v.length === pal.length ? 'Tu palabra: ' + v.split('').map(function (c, i) { return '<span class="' + (c === pal[i] ? 'l-ok' : 'l-no') + '">' + c + '</span>'; }).join('') : '';
          return;
        }
        hecho = true; marca.innerHTML = '';
        J.acaba(v === pal, (v === pal ? '¡Muy bien! ' : 'No. ') + 'La palabra es <b>' + pal + '</b>.');
      });
      // la pista: cuántas letras faltan o cuáles están mal (se puede borrar con «Borrar» y corregir)
      function pistaPalabra(v) {
        if (v.length !== pal.length) return 'La palabra tiene ' + pal.length + ' letras: una por cada ' + unidad + ' del mensaje.';
        var n = 0; for (var i = 0; i < pal.length; i++) if (v[i] !== pal[i]) n++;
        return (n === 1 ? 'Hay 1 letra que no está bien (la subrayada)' : 'Hay ' + n + ' letras que no están bien (las subrayadas)') + '. Toca su ' + unidad + ' en el mensaje y ' + (unidad === 'letra' ? 'búscala' : 'búscalo') + ' en la clave.';
      }
      B.lado.append(cas, marca, tec.el);
      PRUEBA.resuelve = function () { pal.split('').forEach(function (c) { pulsaTecla(c); }); pulsaTecla('Comprobar'); };
    }
    B.lado.append(B.est, h('div', { class: 'fila' }, [bSig]));
    pintaLlave(); nuevo();
  }

  /* ================================================================ 8. La tortuga y los polígonos */
  // repetir n { mover 100 pasos; girar g grados }: la figura se cierra cuando n × g es una vuelta entera (o varias, en las estrellas).
  var FIGS = {
    triangulo: ['un triángulo', 3, 1], cuadrado: ['un cuadrado', 4, 1], pentagono: ['un pentágono', 5, 1], hexagono: ['un hexágono', 6, 1],
    octogono: ['un octógono', 8, 1], eneagono: ['un eneágono (9 lados)', 9, 1], decagono: ['un decágono (10 lados)', 10, 1], dodecagono: ['un dodecágono (12 lados)', 12, 1],
    estrella5: ['una estrella de 5 puntas', 5, 2], estrella8: ['una estrella de 8 puntas', 8, 3], estrella9: ['una estrella de 9 puntas', 9, 4], estrella12: ['una estrella de 12 puntas', 12, 5]
  };
  var NIV_POL = [{ t: 'Polígonos sencillos', f: ['cuadrado', 'triangulo', 'hexagono', 'pentagono'] }, { t: 'Más lados', f: ['octogono', 'eneagono', 'decagono', 'dodecagono'] },
    { t: 'Estrellas', f: ['estrella5', 'estrella8', 'estrella9', 'estrella12'] }];
  function camino(n, g) { var x = 0, y = 0, a = -90, p = [[0, 0]]; for (var i = 0; i < n; i++) { x += 100 * Math.cos(a * Math.PI / 180); y += 100 * Math.sin(a * Math.PI / 180); p.push([x, y]); a += g; } return p; }
  function dibujoTortuga(p, ok) {
    var xs = p.map(function (q) { return q[0]; }), ys = p.map(function (q) { return q[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), w = Math.max(x1 - x0, 100), hh = Math.max(y1 - y0, 100), m = Math.max(w, hh) * .12;
    var s = '<polyline points="' + p.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ') + '" fill="' + (ok ? 'rgba(42,143,79,.12)' : 'none') + '" stroke="' + (ok ? '#257f46' : '#0FBD8C') + '" stroke-width="' + (Math.max(w, hh) / 90).toFixed(2) + '" stroke-linejoin="round" stroke-linecap="round"/>';
    s += '<circle cx="0" cy="0" r="' + (Math.max(w, hh) / 45).toFixed(1) + '" fill="#c8382f"/>';
    return '<svg class="dibujo tortuga" viewBox="' + (x0 - m).toFixed(1) + ' ' + (y0 - m).toFixed(1) + ' ' + (w + 2 * m).toFixed(1) + ' ' + (hh + 2 * m).toFixed(1) + '" role="img" aria-label="Dibujo de la tortuga">' + s + '</svg>';
  }
  function poligonos(zona, nivel) {
    var nv = NIV_POL[nivel - 1], k = 0, F = null, hecho = false, dib = h('div', { class: 'lienzo' }), prog = h('div', { class: 'prog' });
    var B = base(zona, [dib, prog]);
    var cN = A.casilla(), cG = A.casilla(), bSig = A.boton('Siguiente', nuevo, 'primario');
    var J = partida('poligonos', nivel, 4, B.lado, B.est, B.ronda, bSig, nuevo);
    function bloquesHtml(n, g) {
      var v = function (x) { return '<span class="v">' + x + '</span>'; };
      return '<div class="b ev" style="background:#FFBF00;color:#1a1d24">al hacer clic en ' + BANDERA + '</div><div class="b" style="background:#0FBD8C">bajar lápiz</div>' +
        '<div class="c" style="--bc:#FFAB19"><div class="c-cab" style="background:#FFAB19;color:#1a1d24">repetir ' + v(n) + '</div><div class="c-in"><div class="b" style="background:#4C97FF">mover ' + v(100) + ' pasos</div><div class="b" style="background:#4C97FF">girar ↻ ' + v(g) + ' grados</div></div><div class="c-pie" style="background:#FFAB19"></div></div>';
    }
    var tec = A.teclado([cN, cG], function (v) {
      if (hecho) { if (!bSig.hidden) nuevo(); return; }
      var n = v[0], g = v[1];
      if (n === null || g === null) { A.estado(B.est, 'mal', 'Escribe cuántas veces repetir y cuánto girar.'); return; }
      if (n < 1 || n > 36 || g < 0 || g > 360) { A.estado(B.est, 'mal', 'Repetir: de 1 a 36 veces. Girar: de 0 a 360 grados.'); return; }
      var p = camino(n, g), cierra = Math.hypot(p[p.length - 1][0], p[p.length - 1][1]) < .5;
      // también vale repetir más veces la misma figura (repetir 12 y girar 60 dibuja el hexágono dos veces)
      var gOk = Math.abs(g - 360 * F[2] / F[1]) < .01 || Math.abs(g - 360 * (F[1] - F[2]) / F[1]) < .01, ok = n % F[1] === 0 && gOk;
      prog.innerHTML = bloquesHtml(n, g); dib.innerHTML = dibujoTortuga(p, ok);
      if (!ok) {  // primer fallo: la pista dice qué cuenta hacer, no el resultado; las casillas se quedan para corregir
        var pis = [];
        if (n % F[1] !== 0) pis.push('Repetir: una vez por cada ' + (F[2] === 1 ? 'lado' : 'punta') + ' (' + F[1] + ').');
        if (!gOk) pis.push(F[2] === 1 ? 'Girar: una vuelta entera son 360 grados, repartidos entre ' + F[1] + ' esquinas: 360 : ' + F[1] + ' = ?' : 'Girar: la tortuga da ' + F[2] + ' vueltas, ' + F[2] + ' × 360 grados, repartidos entre ' + F[1] + ' puntas.');
        if (J.otra(pis.join(' '))) return;
      }
      if (ok) { hecho = true; J.acaba(true, '¡Es ' + F[0] + '! ' + (n > F[1] ? 'La dibuja ' + (n / F[1]) + ' veces: con repetir ' + F[1] + ' basta. ' : n + ' × ' + sg(g) + ' = ' + (n * g) + ' grados: ' + (F[2] === 1 ? 'una vuelta entera.' : F[2] + ' vueltas enteras.'))); return; }
      hecho = true;
      J.acaba(false, 'Has girado ' + n + ' × ' + g + ' = ' + (n * g) + ' grados en total' + (cierra ? ' y la figura se cierra, pero no es ' + F[0] + '.' : ', y la figura no se cierra.') + ' Pista: ' + (F[2] === 1 ? F[1] + ' lados y una vuelta: 360 : ' + F[1] + ' = ' + (360 / F[1]) + ' grados.' : F[1] + ' puntas y ' + F[2] + ' vueltas: ' + F[2] + ' × 360 : ' + F[1] + ' = ' + (360 * F[2] / F[1]) + ' grados.'));
    });
    function nuevo() {
      hecho = false; J.empieza();
      F = FIGS[nv.f[k++ % nv.f.length]]; PRUEBA.fig = F;
      tec.limpia(); prog.innerHTML = bloquesHtml('?', '?'); dib.innerHTML = '';
      B.enun.innerHTML = 'Dibuja <b>' + F[0] + '</b>.';
      A.estado(B.est, '', F[2] === 1 ? '¿Cuántas veces se repite? ¿Cuánto gira en cada esquina para dar una vuelta entera?' : 'En una estrella, la tortuga da más de una vuelta antes de volver al principio.');
    }
    B.lado.append(B.enun, B.ronda, h('div', { class: 'respuesta' }, ['repetir', cN, 'girar', cG, 'grados']), tec.el, B.est, h('div', { class: 'fila' }, [bSig]));
    PRUEBA.resuelve = function () { cN.click(); String(F[1]).split('').forEach(pulsaTecla); cG.click(); String(360 * F[2] / F[1]).split('').forEach(pulsaTecla); pulsaTecla('Comprobar'); };
    nuevo();
  }

  /* ================================================================ 9. Píxel art */
  var PAL = ['#ffffff', '#1a1d24', '#e0443a', '#2c5bbf', '#f5c518', '#2a8f4f'], PALN = ['blanco', 'negro', 'rojo', 'azul', 'amarillo', 'verde'];
  var PIX = [
    ['La flecha', ['00100', '01110', '11111', '00100', '00100']],
    ['El corazón', ['0000000000', '0220002200', '2222022220', '2222222220', '2222222220', '0222222200', '0022222000', '0002220000', '0000200000', '0000000000']],
    ['El pez', ['0000000000', '0000333000', '0033333300', '3333313330', '0333333333', '3333333330', '0033333300', '0000333000', '0000000000', '0000000000']],
    ['La casa', ['0000220000', '0002222000', '0022222200', '0222222220', '0033333300', '0031131300', '0031131300', '0033113300', '5555555555', '5555555555']],
    ['El robot', ['0000400000', '0000100000', '0333333300', '0311331300', '0333333300', '0332222300', '0333333300', '0010000100', '0010000100', '0110001100']]
  ];
  function tramos(fila) { var out = [], c = fila[0], k = 0; for (var i = 0; i < fila.length; i++) { if (fila[i] === c) k++; else { out.push([c, k]); c = fila[i]; k = 1; } } out.push([c, k]); return out; }
  function pixel(zona, nivel) {
    var D = PIX[nivel - 1], S = D[1].map(function (r) { return r.split('').map(Number); }), N = S[0].length, G = S.map(function (r) { return r.map(function () { return 0; }); });
    var color = 1, intentos = 0, hecho = false, pintando = false, filaSel = -1;
    var usados = []; S.forEach(function (r) { r.forEach(function (v) { if (usados.indexOf(v) < 0) usados.push(v); }); });
    if (usados.indexOf(0) < 0) usados.push(0);
    usados.sort(); color = usados.filter(function (v) { return v; })[0] || 1;
    var tab = h('div', { class: 'pix', style: 'grid-template-columns:repeat(' + N + ',1fr)' }), cod = h('ol', { class: 'pixcod' }), pal = h('div', { class: 'fila' });
    var B = base(zona, [tab]);
    function pintaTab(errores) {
      tab.innerHTML = '';
      G.forEach(function (r, y) { r.forEach(function (v, x) {
        var c = h('div', { class: 'px' + (errores && errores[y][x] ? ' mal' : '') + (y === filaSel ? ' sel' : ''), style: 'background:' + PAL[v], role: 'button', 'aria-label': 'fila ' + (y + 1) + ', columna ' + (x + 1) + ': ' + PALN[v] });
        c.dataset.x = x; c.dataset.y = y;
        tab.append(c);
      }); });
    }
    function pon(e) { var c = e.target.closest && e.target.closest('.px'); if (!c || hecho) return; var x = +c.dataset.x, y = +c.dataset.y; if (G[y][x] !== color) { G[y][x] = color; c.style.background = PAL[color]; c.classList.remove('mal'); } }
    tab.addEventListener('pointerdown', function (e) { pintando = true; pon(e); try { tab.releasePointerCapture(e.pointerId); } catch (x) { /* nada */ } });
    tab.addEventListener('pointerover', function (e) { if (pintando) pon(e); });
    window.addEventListener('pointerup', function () { pintando = false; });
    S.forEach(function (r, y) {
      var b = h('button', { type: 'button', 'aria-pressed': 'false', 'aria-label': 'Fila ' + (y + 1) + ': ' + tramos(r).map(function (t) { return t[1] + ' ' + PALN[t[0]]; }).join(', ') + '. Toca para marcarla en el dibujo.',
        html: tramos(r).map(function (t) { return '<span><i style="background:' + PAL[t[0]] + '"></i>' + t[1] + '</span>'; }).join('') });
      b.addEventListener('click', function () {
        filaSel = filaSel === y ? -1 : y;
        [].forEach.call(cod.querySelectorAll('button'), function (x, k) { x.classList.toggle('on', k === filaSel); x.setAttribute('aria-pressed', String(k === filaSel)); });
        [].forEach.call(tab.children, function (c) { c.classList.toggle('sel', +c.dataset.y === filaSel); });
      });
      cod.append(h('li', {}, [b]));
    });
    usados.forEach(function (v) {
      var b = h('button', { type: 'button', class: 'color' + (v === color ? ' on' : ''), style: '--c:' + PAL[v], 'aria-label': 'Pintar de ' + PALN[v], html: '<i></i>' + PALN[v] });
      b.addEventListener('click', function () { color = v; [].forEach.call(pal.children, function (x) { x.classList.toggle('on', x === b); }); });
      pal.append(b);
    });
    var bOk = A.boton('Comprobar', function () {
      if (hecho) return;
      intentos++;
      var mal = S.map(function (r, y) { return r.map(function (v, x) { return G[y][x] !== v; }); }), n = mal.reduce(function (a, r) { return a + r.filter(Boolean).length; }, 0);
      if (!n) { hecho = true; var e = intentos === 1 ? 3 : intentos === 2 ? 2 : 1; A.apunta('pixel', nivel, e); A.estado(B.est, 'bien', '¡Es ' + D[0].toLowerCase() + '! ' + A.tresEstrellas(e, 24)); pintaTab(); return; }
      pintaTab(mal); A.estado(B.est, 'mal', n === 1 ? 'Hay 1 cuadrado que no está bien: está marcado.' : 'Hay ' + n + ' cuadrados que no están bien: están marcados.');
    }, 'verde');
    var bBorra = A.boton('Borrar el dibujo', function () { if (hecho) return; G = S.map(function (r) { return r.map(function () { return 0; }); }); pintaTab(); });
    B.lado.append(h('p', { class: 'enunciado', html: 'Pinta <b>' + D[0].toLowerCase() + '</b> siguiendo el código.' }), h('p', { class: 'ayuda', text: 'Cada fila dice, de izquierda a derecha, cuántos cuadrados seguidos van de cada color. Toca una fila del código para marcarla en el dibujo.' }), pal, cod, B.est, h('div', { class: 'fila' }, [bOk, bBorra]));
    A.estado(B.est, '', 'Elige un color y toca los cuadrados (o arrastra el dedo).');
    A.tecla(function (k) { if (k === 'Enter') { bOk.click(); return true; } return false; });
    PRUEBA.resuelve = function () { G = S.map(function (r) { return r.slice(); }); pintaTab(); bOk.click(); };
    pintaTab();
  }

  /* ================================================================ 10. ¿Qué hace el programa? (condiciones) */
  // Scratch: la variable puntos y «decir». MakeCode: el sensor de temperatura y «mostrar cadena». «>» es estricto: 10 no es mayor que 10.
  var NIV_SI = [{ t: 'Si… entonces' }, { t: 'Si… si no' }, { t: 'Tres caminos' }, { t: 'Con «y» y «o»' }];
  var EDI = {
    scratch: { nom: 'Scratch', ini: '<div class="b ev" style="background:#FFBF00;color:#1a1d24">al hacer clic en ' + BANDERA + '</div>', ctl: '#FFAB19', ctlTxt: '#1a1d24', op: '#59C059',
      dato: '<span class="r" style="background:#FF8C1A;color:#fff">puntos</span>', unidad: '', sal: function (t) { return '<div class="b" style="background:#9966FF">decir ' + v('¡' + t + '!') + '</div>'; },
      si: 'si', ent: 'entonces', sino: 'si no', sinosi: null, y: 'y', o: 'o', sal2: ['Ganaste', 'Sigue jugando'], sal3: ['Ganaste', 'Casi', 'Sigue jugando'], dentro: ['Bien', 'Fuera'], rango: [0, 30], ve: function (x) { return 'puntos vale <b>' + x + '</b>'; } },
    makecode: { nom: 'MakeCode', ini: '<div class="b ev" style="background:#1E90FF">al iniciar</div>', ctl: '#00A4A6', ctlTxt: '#fff', op: '#00A4A6',
      dato: '<span class="r" style="background:#D400D4;color:#fff">temperatura (°C)</span>', unidad: ' °C', sal: function (t) { return '<div class="b" style="background:#1E90FF">mostrar cadena ' + v('"' + t + '"') + '</div>'; },
      si: 'si', ent: 'entonces', sino: 'si no', sinosi: 'si no, si', y: 'y', o: 'o', sal2: ['CALOR', 'FRESCO'], sal3: ['CALOR', 'BIEN', 'FRESCO'], dentro: ['BIEN', 'AVISO'], rango: [0, 40], ve: function (x) { return 'el termómetro marca <b>' + x + ' °C</b>'; } }
  };
  function v(x) { return '<span class="v">' + x + '</span>'; }
  var editorSi = 'scratch';
  try { editorSi = localStorage.getItem('ce40-tablet-editor') || 'scratch'; } catch (e) { /* nada */ }
  function cond(E, c) {  // c: [op, n] o ['y'|'o', [op, n], [op, n]]
    function una(k) { return '<span class="r" style="background:' + E.op + ';color:#fff">' + E.dato + ' ' + (k[0] === '>' ? '&gt;' : '&lt;') + ' ' + v(k[1]) + '</span>'; }
    if (c[0] === 'y' || c[0] === 'o') return '<span class="r" style="background:' + E.op + ';color:#fff">' + una(c[1]) + ' ' + (c[0] === 'y' ? E.y : E.o) + ' ' + una(c[2]) + '</span>';
    return una(c);
  }
  function cumple(c, x) { if (c[0] === 'y') return cumple(c[1], x) && cumple(c[2], x); if (c[0] === 'o') return cumple(c[1], x) || cumple(c[2], x); return c[0] === '>' ? x > c[1] : x < c[1]; }
  function bloqueSi(E, ramas) {  // ramas: [[condición o null, salida o null]]
    var s = '<div class="c" style="--bc:' + E.ctl + '">';
    ramas.forEach(function (r, i) {
      var cab = i === 0 ? E.si + ' ' + cond(E, r[0]) + ' ' + E.ent : r[0] ? (E.sinosi ? E.sinosi + ' ' + cond(E, r[0]) + ' ' + E.ent : E.sino) : E.sino;
      s += '<div class="c-cab" style="background:' + E.ctl + ';color:' + E.ctlTxt + '">' + cab + '</div><div class="c-in">' + (r[1] ? E.sal(r[1]) : '') + '</div>';
    });
    return s + '<div class="c-pie" style="background:' + E.ctl + '"></div></div>';
  }
  // En Scratch no hay «si no, si»: el segundo «si» va dentro del «si no».
  function programaSi(E, P) {
    if (P.tipo === 3 && !E.sinosi) {
      var dentro = bloqueSi(E, [[P.c2, P.o[1]], [null, P.o[2]]]);
      return E.ini + '<div class="c" style="--bc:' + E.ctl + '"><div class="c-cab" style="background:' + E.ctl + ';color:' + E.ctlTxt + '">' + E.si + ' ' + cond(E, P.c1) + ' ' + E.ent + '</div><div class="c-in">' + E.sal(P.o[0]) +
        '</div><div class="c-cab" style="background:' + E.ctl + ';color:' + E.ctlTxt + '">' + E.sino + '</div><div class="c-in">' + dentro + '</div><div class="c-pie" style="background:' + E.ctl + '"></div></div>';
    }
    if (P.tipo === 3) return E.ini + bloqueSi(E, [[P.c1, P.o[0]], [P.c2, P.o[1]], [null, P.o[2]]]);
    if (P.tipo === 1) return E.ini + bloqueSi(E, [[P.c1, P.o[0]]]);
    return E.ini + bloqueSi(E, [[P.c1, P.o[0]], [null, P.o[1]]]);
  }
  function genSi(nivel, E) {
    var lo = E.rango[0], hi = E.rango[1], P = {}, T;
    if (nivel <= 2) {
      T = 5 + rnd(hi - 10);
      P = { tipo: nivel === 1 ? 1 : 2, c1: ['>', T], o: E.sal2 };
      P.x = rnd(4) ? lo + rnd(hi - lo + 1) : T;  // a veces justo el número de la condición
    } else if (nivel === 3) {
      var t2 = 5 + rnd(10), t1 = t2 + 5 + rnd(10);
      P = { tipo: 3, c1: ['>', t1], c2: ['>', t2], o: E.sal3 };
      P.x = [t1, t2, lo + rnd(hi - lo + 1), lo + rnd(hi - lo + 1)][rnd(4)];
    } else {
      var a = 5 + rnd(8), b = a + 6 + rnd(10);
      // «y»: dentro del intervalo; «o»: fuera de él
      P = rnd(2) ? { tipo: 2, c1: ['y', ['>', a], ['<', b]], o: E.dentro } : { tipo: 2, c1: ['o', ['<', a], ['>', b]], o: [E.dentro[1], E.dentro[0]] };
      P.x = [a, b, a + 1 + rnd(b - a - 1), rnd(a), b + 1 + rnd(Math.max(1, hi - b))][rnd(5)];
    }
    P.sale = P.tipo === 3 ? (cumple(P.c1, P.x) ? P.o[0] : cumple(P.c2, P.x) ? P.o[1] : P.o[2]) : cumple(P.c1, P.x) ? P.o[0] : P.tipo === 1 ? null : P.o[1];
    return P;
  }
  function condiciones(zona, nivel) {
    var P = null, hecho = false, progEl = h('div', { class: 'prog' }), dato = h('p', { class: 'dato' }), ops = h('div', { class: 'ops-txt' });
    var sel = h('div', { class: 'fila' }, ['Bloques de: ']);
    var B = base(zona, [sel, dato, progEl]);
    var bSig = A.boton('Siguiente', nuevo, 'primario');
    var J = partida('condiciones', nivel, 8, B.lado, B.est, B.ronda, bSig, nuevo);
    function E() { return EDI[editorSi]; }
    function nuevo() {
      hecho = false; J.empieza();
      P = genSi(nivel, E()); PRUEBA.si = P;
      progEl.innerHTML = programaSi(E(), P);
      dato.innerHTML = 'Al empezar, ' + E().ve(P.x) + '.';
      B.enun.innerHTML = '¿Qué hace el programa?';
      var opciones = P.tipo === 3 ? P.o.slice() : P.tipo === 2 ? P.o.slice() : [P.o[0], null];
      ops.innerHTML = '';
      opciones.forEach(function (o) {
        var b = h('button', { type: 'button', class: 'op-txt', html: o ? E().sal(o) : '<b>No hace nada</b>' });
        b.addEventListener('click', function () {
          if (hecho) return;
          hecho = true;
          var ok = o === P.sale;
          b.classList.add(ok ? 'bien' : 'mal');
          J.acaba(ok, (ok ? '¡Muy bien! ' : 'No. ') + explica(P));
        });
        b.dataset.ok = String(o === P.sale);
        ops.append(b);
      });
      A.estado(B.est, '', 'Mira el valor y sigue el programa: ¿se cumple la condición?');
    }
    function explica(P) {
      var x = P.x + E().unidad;
      if (P.tipo === 3) return cumple(P.c1, P.x) ? 'Se cumple la primera condición (' + x + ' es mayor que ' + P.c1[1] + ').' : cumple(P.c2, P.x) ? 'La primera no se cumple, pero la segunda sí (' + x + ' es mayor que ' + P.c2[1] + ').' : 'No se cumple ninguna de las dos: va al último «si no».';
      var c = P.c1, s = cumple(c, P.x);
      if (c[0] === 'y') return s ? 'Se cumplen las dos partes del «y».' : 'Con «y» tienen que cumplirse las dos partes, y ' + (cumple(c[1], P.x) ? 'la segunda' : 'la primera') + ' no se cumple.';
      if (c[0] === 'o') return s ? 'Con «o» basta con que se cumpla una de las dos partes.' : 'No se cumple ninguna de las dos partes del «o».';
      var txt = x + (s ? ' sí' : ' no') + ' es ' + (c[0] === '>' ? 'mayor' : 'menor') + ' que ' + c[1] + (P.x === c[1] ? ' (es igual: «' + (c[0] === '>' ? 'mayor' : 'menor') + '» no incluye el ' + c[1] + ')' : '') + '.';
      return txt + (P.tipo === 1 && !s ? ' Como no hay «si no», no hace nada.' : '');
    }
    ['scratch', 'makecode'].forEach(function (k) {
      sel.append(h('button', { type: 'button', class: 'boton' + (editorSi === k ? ' primario' : ''), text: EDI[k].nom, 'aria-pressed': String(editorSi === k), onclick: function () {
        editorSi = k; try { localStorage.setItem('ce40-tablet-editor', k); } catch (e) { /* nada */ }
        [].forEach.call(sel.querySelectorAll('button'), function (b) { var on = b.textContent === EDI[k].nom; b.classList.toggle('primario', on); b.setAttribute('aria-pressed', String(on)); });
        if (!hecho) nuevo();
      } }));
    });
    B.lado.append(B.enun, B.ronda, ops, B.est, h('div', { class: 'fila' }, [bSig]));
    A.tecla(function (k) { if (k === 'Enter' && hecho && !bSig.hidden) { nuevo(); return true; } var n = +k; if (n >= 1 && n <= ops.children.length && !hecho) { ops.children[n - 1].click(); return true; } return false; });
    PRUEBA.resuelve = function () { [].find.call(ops.children, function (b) { return b.dataset.ok === 'true'; }).click(); };
    nuevo();
  }

  /* ================================================================ 11. La regla secreta */
  var REGLAS = [
    ['es par', function (n) { return n % 2 === 0; }, 1], ['es impar', function (n) { return n % 2 === 1; }, 1], ['es mayor que 15', function (n) { return n > 15; }, 1],
    ['es menor que 10', function (n) { return n < 10; }, 1], ['acaba en 5', function (n) { return n % 10 === 5; }, 1], ['acaba en 0', function (n) { return n % 10 === 0; }, 1],
    ['es mayor que 20', function (n) { return n > 20; }, 1],
    ['está en la tabla del 3', function (n) { return n % 3 === 0; }, 2, 'es múltiplo de 3'], ['está en la tabla del 4', function (n) { return n % 4 === 0; }, 2, 'es múltiplo de 4'],
    ['está en la tabla del 5', function (n) { return n % 5 === 0; }, 2, 'es múltiplo de 5'], ['está en la tabla del 6', function (n) { return n % 6 === 0; }, 2, 'es múltiplo de 6'],
    ['está en la tabla del 7', function (n) { return n % 7 === 0; }, 2, 'es múltiplo de 7'], ['está en la tabla del 9', function (n) { return n % 9 === 0; }, 2, 'es múltiplo de 9'],
    ['es par y mayor que 10', function (n) { return n % 2 === 0 && n > 10; }, 3], ['es menor que 5 o mayor que 25', function (n) { return n < 5 || n > 25; }, 3],
    ['no está en la tabla del 3', function (n) { return n % 3 !== 0; }, 3, 'no es múltiplo de 3'], ['es impar y menor que 15', function (n) { return n % 2 === 1 && n < 15; }, 3],
    ['es mayor que 10 y menor que 20', function (n) { return n > 10 && n < 20; }, 3], ['está en la tabla del 3 o en la del 5', function (n) { return n % 3 === 0 || n % 5 === 0; }, 3, 'es múltiplo de 3 o de 5']
  ];
  var NIV_REGLA = [{ t: 'Reglas sencillas' }, { t: 'Las tablas' }, { t: 'Con «y», «o» y «no»' }];
  function conjunto(r) { var s = ''; for (var n = 1; n <= 30; n++) s += r[1](n) ? '1' : '0'; return s; }
  function regla(zona, nivel) {
    var R = null, probados = {}, hecho = false, usadas = [], minimo = 3, tabla = h('div', { class: 'nums' }), ops = h('div', { class: 'ops-txt' }), cuenta = h('p', { class: 'ronda' });
    var B = base(zona, [h('p', { class: 'panel-tit', text: 'Toca un número: la máquina dice si cumple la regla' }), tabla, cuenta]);
    var bSig = A.boton('Siguiente', nuevo, 'primario');
    var J = partida('regla', nivel, 6, B.lado, B.est, B.ronda, bSig, nuevo);
    function pintaTabla() {
      tabla.innerHTML = '';
      for (var n = 1; n <= 30; n++) (function (n) {
        var st = probados[n], b = h('button', { type: 'button', class: 'num' + (st === true ? ' si' : st === false ? ' no' : ''), text: String(n), 'aria-label': n + (st === true ? ': sí' : st === false ? ': no' : '') });
        b.addEventListener('click', function () { if (hecho || n in probados) return; probados[n] = R[1](n); pintaTabla(); });
        tabla.append(b);
      })(n);
      var k = Object.keys(probados).length;
      cuenta.textContent = hecho ? 'Verde: sí cumple. Gris: no cumple.' : k ? 'Has probado ' + k + (k === 1 ? ' número.' : ' números.') + ' Verde: sí cumple. Gris: no cumple.' : '';
    }
    function nuevo() {
      hecho = false; J.empieza(); probados = {}; minimo = 3;
      var pool = REGLAS.filter(function (r) { return r[2] === nivel && usadas.indexOf(r[0]) < 0; });
      if (!pool.length) { usadas = []; pool = REGLAS.filter(function (r) { return r[2] === nivel; }); }
      R = pool[rnd(pool.length)]; usadas.push(R[0]); PRUEBA.regla = R[0];
      // tres reglas distintas de la buena (que no coincidan del 1 al 30), de este nivel o de los anteriores
      var ya = [conjunto(R)], otras = shuffle(REGLAS.filter(function (r) { return r[2] <= nivel && r !== R; })), distr = [];
      otras.forEach(function (r) { var c = conjunto(r); if (distr.length < 3 && ya.indexOf(c) < 0) { ya.push(c); distr.push(r); } });
      ops.innerHTML = '';
      shuffle([R].concat(distr)).forEach(function (r) {
        var b = h('button', { type: 'button', class: 'op-txt', html: '<span><b>El número ' + r[0] + '</b>' + (r[3] ? '<small>(' + r[3] + ')</small>' : '') + '</span>' });
        b.dataset.ok = String(r === R);
        b.addEventListener('click', function () {
          if (hecho) return;
          var k = Object.keys(probados).length;
          if (k < minimo) { A.estado(B.est, 'mal', minimo === 3 ? 'Prueba antes al menos 3 números.' : 'Prueba ' + (minimo - k === 1 ? 'un número más' : (minimo - k) + ' números más') + ' antes de volver a elegir.'); return; }
          if (r !== R && J.otra('Prueba 2 números más y vuelve a elegir: fíjate en los que dicen «sí».')) { b.disabled = true; b.classList.add('mal'); minimo = Math.min(30, k + 2); return; }
          hecho = true;
          b.classList.add(r === R ? 'bien' : 'mal');
          for (var n = 1; n <= 30; n++) if (!(n in probados)) probados[n] = R[1](n);
          pintaTabla();
          J.acaba(r === R, (r === R ? '¡Muy bien! ' : 'No. ') + 'La regla era: el número <b>' + R[0] + '</b>. Lo has descubierto probando ' + k + ' números.');
        });
        ops.append(b);
      });
      pintaTabla();
      B.enun.innerHTML = '¿Cuál es la regla secreta?';
      A.estado(B.est, '', 'Prueba números y fíjate en los que dicen «sí». Después, elige la regla.');
    }
    B.lado.append(B.enun, B.ronda, ops, B.est, h('div', { class: 'fila' }, [bSig]));
    A.tecla(function (k) { if (k === 'Enter' && hecho && !bSig.hidden) { nuevo(); return true; } return false; });
    PRUEBA.resuelve = function () { [1, 2, 3].forEach(function (n) { tabla.children[n - 1].click(); }); [].find.call(ops.children, function (b) { return b.dataset.ok === 'true'; }).click(); };
    nuevo();
  }

  /* ================================================================ 12. Ordenar con la balanza */
  // Mínimo de comparaciones que aseguran el orden en el peor caso: 3 cajas, 3; 4 cajas, 5; 5 cajas, 7.
  // Con 5 cajas, las 3 estrellas son con 8 (meter cada caja comparando primero con la del medio); el 7 necesita un truco: es el reto extra.
  var NIV_BAL = [{ t: '3 cajas', n: 3, opt: 3 }, { t: '4 cajas', n: 4, opt: 5 }, { t: '5 cajas', n: 5, opt: 8, extra: 7 }];
  function balanza(zona, nivel) {
    var nv = NIV_BAL[nivel - 1], NOM = 'ABCDE', peso = [], orden = [], plato = [], cmp = 0, fallos = 0, hecho = false, notas = [];
    var dib = h('div', { class: 'balanza' }), fila = h('div', { class: 'cajas' }), lista = h('ol', { class: 'pesadas' });
    var B = base(zona, [dib, h('p', { class: 'panel-tit', text: 'De más ligera a más pesada' }), fila]);
    function pesa() {
      var s = '<line x1="160" y1="40" x2="160" y2="150" stroke="#5d6474" stroke-width="8" stroke-linecap="round"/><path d="M120 160h80l-20-18h-40z" fill="#5d6474"/>';
      var inc = 0;
      if (plato.length === 2) inc = peso[plato[0]] > peso[plato[1]] ? 12 : -12;
      var y1 = 50 + inc * 2.4, y2 = 50 - inc * 2.4;
      s += '<line x1="40" y1="' + y1 + '" x2="280" y2="' + y2 + '" stroke="#1a1d24" stroke-width="7" stroke-linecap="round"/>';
      [[40, y1, plato[0]], [280, y2, plato[1]]].forEach(function (p) {
        s += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + p[0] + '" y2="' + (p[1] + 34) + '" stroke="#5d6474" stroke-width="3"/><path d="M' + (p[0] - 46) + ' ' + (p[1] + 34) + 'h92l-12 14h-68z" fill="#8a92a3"/>';
        if (p[2] !== undefined) s += '<rect x="' + (p[0] - 26) + '" y="' + (p[1] - 18) + '" width="52" height="52" rx="8" fill="#b65c06" stroke="#1a1d24" stroke-width="3"/><text x="' + p[0] + '" y="' + (p[1] + 17) + '" text-anchor="middle" font-size="28" font-weight="800" fill="#fff">' + NOM[p[2]] + '</text>';
      });
      dib.innerHTML = '<svg class="dibujo" viewBox="-16 0 352 200" role="img" aria-label="Balanza">' + s + '</svg>';
    }
    function pintaFila() {
      fila.innerHTML = '';
      orden.forEach(function (b, i) {
        var caja = h('div', { class: 'caja' + (plato.indexOf(b) >= 0 ? ' en' : '') });
        caja.append(h('button', { type: 'button', class: 'caja-b', html: '<b>' + NOM[b] + '</b>' + (hecho ? '<small>' + peso[b] + ' kg</small>' : ''), 'aria-label': 'Caja ' + NOM[b] + ': ponerla en la balanza',
          onclick: function () { if (hecho) return; if (plato.length === 2) plato = []; if (plato.indexOf(b) < 0) plato.push(b); if (plato.length === 2) { cmp++; var p0 = plato[0], p1 = plato[1]; notas.push(peso[p0] > peso[p1] ? NOM[p1] + ' pesa menos que ' + NOM[p0] : NOM[p0] + ' pesa menos que ' + NOM[p1]); pintaNotas(); } pesa(); pintaFila(); } }));
        caja.append(h('div', { class: 'flechas' }, [
          h('button', { type: 'button', text: '◀', 'aria-label': 'Mover ' + NOM[b] + ' a la izquierda', disabled: i === 0 || hecho ? '' : null, onclick: function () { orden.splice(i, 1); orden.splice(i - 1, 0, b); pintaFila(); } }),
          h('button', { type: 'button', text: '▶', 'aria-label': 'Mover ' + NOM[b] + ' a la derecha', disabled: i === orden.length - 1 || hecho ? '' : null, onclick: function () { orden.splice(i, 1); orden.splice(i + 1, 0, b); pintaFila(); } })]));
        fila.append(caja);
      });
    }
    function pintaNotas() { lista.innerHTML = notas.map(function (n) { return '<li>' + n + '</li>'; }).join(''); B.ronda.textContent = 'Pesadas: ' + cmp + ' · para 3 estrellas, ' + nv.opt + ' o menos' + (nv.extra ? ' (reto extra: ' + nv.extra + ')' : ''); }
    function empieza() {
      peso = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, nv.n); orden = shuffle(peso.map(function (_, i) { return i; }));
      plato = []; cmp = 0; fallos = 0; hecho = false; notas = []; PRUEBA.peso = peso;
      pesa(); pintaFila(); pintaNotas();
      A.estado(B.est, '', 'Toca dos cajas para pesarlas. Después, ordénalas con las flechas.');
    }
    var bOk = A.boton('Comprobar el orden', function () {
      if (hecho) return;
      for (var i = 0; i < orden.length - 1; i++) if (peso[orden[i]] > peso[orden[i + 1]]) {
        fallos++; A.estado(B.est, 'mal', 'Todavía no: ' + NOM[orden[i]] + ' pesa más que ' + NOM[orden[i + 1]] + '. Pésalas si no lo sabes.'); return;
      }
      if (cmp < nv.n - 1) { A.estado(B.est, 'pista', 'El orden está bien, pero así no se puede saber: con ' + nv.n + ' cajas hay que pesar al menos ' + (nv.n - 1) + ' veces.'); return; }
      hecho = true;
      var e = cmp <= nv.opt ? 3 : cmp <= nv.opt + 2 ? 2 : 1;
      if (fallos) e = Math.max(1, e - 1);
      A.apunta('balanza', nivel, e); pintaFila();
      A.estado(B.est, 'bien', '¡Ordenadas con ' + cmp + (cmp === 1 ? ' pesada' : ' pesadas') + '! ' + A.tresEstrellas(e, 24) + (e < 3 ? ' ¿Se puede con menos pesadas?' : nv.extra && cmp <= nv.extra && !fallos ? ' ¡Y el reto extra: ' + nv.extra + ' o menos!' : nv.extra ? ' Reto extra: ¿con ' + nv.extra + '?' : ''));
    }, 'verde');
    B.lado.append(h('p', { class: 'enunciado', html: 'Ordena las cajas de <b>más ligera</b> a <b>más pesada</b> con las menos pesadas posibles.' }), B.ronda, h('p', { class: 'panel-tit', text: 'Lo que sabemos' }), lista, B.est,
      h('div', { class: 'fila' }, [bOk, A.boton('Otras cajas', empieza)]));
    A.tecla(function (k) { if (k === 'Enter') { bOk.click(); return true; } return false; });
    // para las pruebas: ordenar y pesar cada caja con la siguiente (n − 1 pesadas)
    PRUEBA.resuelve = function () {
      orden.sort(function (a, b) { return peso[a] - peso[b]; }); pintaFila();
      for (var i = 0; i < orden.length - 1; i++) [orden[i], orden[i + 1]].forEach(function (c) { fila.querySelectorAll('.caja-b')[orden.indexOf(c)].click(); });
      bOk.click();
    };
    empieza();
  }

  /* ================================================================ 13. Aparca el coche Nezha: velocidad × tiempo */
  // A una potencia fija, el coche avanza siempre lo mismo cada segundo: distancia = velocidad × tiempo.
  // Se responde y el coche arranca con ese número: se ve dónde se para, con una marca roja por cada segundo.
  var NIV_VEL = [{ t: '¿Dónde para?' }, { t: 'Medios segundos' }, { t: '¿Cuánto tiempo?' }, { t: '¿Qué velocidad?' }];
  var VX0 = 120, VPX = 3.1, VFIN = 210;   // la punta del coche sale de x = 120; 1 cm son 3,1 px; la pista acaba en 210 cm
  function coma(x) { return String(x).replace('.', ','); }
  function vx(cm) { return VX0 + cm * VPX; }
  function seg(t) { return coma(t) + (t === 1 ? ' segundo' : ' segundos'); }
  var ICO_VEL = {
    vel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 16.5a8.5 8.5 0 1 1 17 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M12 16.5l4.6-5.2" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="16.5" r="2" fill="currentColor"/></svg>',
    tiempo: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13.5" r="7.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 13.5V9.6M9.6 3h4.8M12 3v2.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    dist: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="8" width="19" height="8.5" rx="1.6" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M6.5 8v3.6M10.5 8v2.2M14.5 8v3.6M18.5 8v2.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  // el coche Nezha de lado; (0, 0) es la punta delantera, a ras de la pista. Las ruedas giran al avanzar.
  function cocheLado(cm) {
    var a = (cm * VPX / 12 * 57.3) % 360, r = function (cx) { return '<circle cx="' + cx + '" cy="-12" r="12" fill="#1a1d24"/><circle cx="' + cx + '" cy="-12" r="7" fill="#5d6474"/><path transform="rotate(' + a.toFixed(1) + ' ' + cx + ' -12)" d="M' + cx + ' -18.5v13M' + (cx - 6.5) + ' -12h13" stroke="#c3c8d2" stroke-width="2.4" stroke-linecap="round"/>'; };
    return '<rect x="-68" y="-42" width="66" height="27" rx="7" fill="#3a3f4b" stroke="#1a1d24" stroke-width="2.5"/>' +
      '<rect x="-56" y="-53" width="38" height="12" rx="2.5" fill="#1a1d24"/><circle cx="-45" cy="-47" r="2" fill="#ff5a4f"/><circle cx="-37" cy="-47" r="2" fill="#ff5a4f"/><circle cx="-29" cy="-47" r="2" fill="#ff5a4f"/>' +
      '<rect x="-8" y="-36" width="6" height="8" rx="2" fill="#f5c518"/>' + r(-54) + r(-17);
  }
  function chispas(x, y) { var s = ''; for (var k = 0; k < 8; k++) { var an = k * Math.PI / 4, px = x + 52 * Math.cos(an), py = y + 52 * Math.sin(an); s += '<path transform="translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ') scale(1.6)" d="M0 -7l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#f5c518" stroke="#b8860b" stroke-width="1"/>'; } return s; }
  function pastilla(x, ico, txt) {
    return '<g transform="translate(' + x + ' 8)"><rect width="200" height="56" rx="28" fill="#fff" stroke="#d5dae3" stroke-width="2.5"/><g transform="translate(16 11) scale(1.4)" style="color:#2c5bbf">' + ico.replace('<svg viewBox="0 0 24 24" aria-hidden="true">', '').replace('</svg>', '') + '</g>' +
      '<text x="64" y="39" font-size="30" font-weight="800" fill="#1a1d24">' + txt + '</text></g>';
  }
  // la escena, de arriba abajo: el marcador (tiempo y distancia), la bandera de meta, la pista con el coche, la cinta métrica y las marcas de cada segundo
  function escenaVel(st) {
    var W = vx(VFIN) + 46, s = '';
    s += pastilla(10, ICO_VEL.tiempo, coma(Math.round(st.tm * 10) / 10) + ' s') + pastilla(222, ICO_VEL.dist, Math.round(st.pos) + ' cm');
    s += '<rect x="8" y="182" width="' + (W - 16) + '" height="96" rx="14" fill="#4a5060"/><line x1="24" y1="196" x2="' + (W - 24) + '" y2="196" stroke="#c3c8d2" stroke-width="4" stroke-dasharray="20 14"/>';
    s += '<rect x="' + (vx(0) - 4) + '" y="204" width="8" height="74" fill="#fff"/>';
    for (var k = 0; k < 8; k++) s += '<rect x="' + (vx(VFIN) + 6) + '" y="' + (150 + k * 16) + '" width="22" height="16" fill="' + (k % 2 ? '#fff' : '#c8382f') + '"/>';
    s += '<rect x="' + (vx(VFIN) + 6) + '" y="150" width="22" height="128" fill="none" stroke="#1a1d24" stroke-width="2.5"/>';
    if (st.meta != null) {
      var mx = vx(st.meta);
      for (var f = 0; f < 6; f++) for (var c = 0; c < 2; c++) s += '<rect x="' + (mx - 8 + c * 8) + '" y="' + (204 + f * 12.33).toFixed(1) + '" width="8" height="12.4" fill="' + ((f + c) % 2 ? '#fff' : '#1a1d24') + '"/>';
      s += '<line x1="' + mx + '" y1="84" x2="' + mx + '" y2="204" stroke="#5d6474" stroke-width="5" stroke-linecap="round"/>';
      for (var fy = 0; fy < 3; fy++) for (var fx = 0; fx < 4; fx++) s += '<rect x="' + (mx + 3 + fx * 13) + '" y="' + (86 + fy * 12) + '" width="13" height="12" fill="' + ((fx + fy) % 2 ? '#fff' : '#1a1d24') + '"/>';
      s += '<rect x="' + (mx + 3) + '" y="86" width="52" height="36" fill="none" stroke="#1a1d24" stroke-width="2"/>';
      s += (st.meta > 120 ? '<text x="' + (mx - 12) + '" y="116" text-anchor="end"' : '<text x="' + (mx + 64) + '" y="116"') + ' font-size="28" font-weight="800" fill="#1e7a45">meta: ' + st.meta + ' cm</text>';
    }
    if (st.cono != null) {
      var cx = vx(Math.min(st.cono, VFIN + 4));
      s += '<line x1="' + cx + '" y1="204" x2="' + cx + '" y2="278" stroke="#f5c518" stroke-width="5" stroke-dasharray="8 6"/>';
      s += '<path d="M' + (cx - 18) + ' 184L' + cx + ' 134L' + (cx + 18) + ' 184Z" fill="#f07a1a" stroke="#a24b06" stroke-width="2.5" stroke-linejoin="round"/><path d="M' + (cx - 10.5) + ' 162h21" stroke="#fff" stroke-width="7"/><rect x="' + (cx - 24) + '" y="181" width="48" height="8" rx="3" fill="#a24b06"/>';
      s += '<text x="' + cx + '" y="122" text-anchor="middle" font-size="28" font-weight="800" fill="#a24b06">' + st.cono + ' cm</text>';
    }
    s += '<rect x="' + (vx(0) - 20) + '" y="290" width="' + (vx(VFIN) - vx(0) + 40) + '" height="54" rx="8" fill="#f5c518" stroke="#b8860b" stroke-width="2.5"/>';
    for (var cm = 0; cm <= VFIN; cm += 10) {
      s += '<line x1="' + vx(cm) + '" y1="290" x2="' + vx(cm) + '" y2="' + (290 + (cm % 20 ? 12 : 20)) + '" stroke="#1a1d24" stroke-width="2.5"/>';
      if (cm % 20 === 0) s += '<text x="' + vx(cm) + '" y="335" text-anchor="middle" font-size="25" font-weight="800" fill="#1a1d24">' + cm + '</text>';
    }
    if (st.meta != null) s += '<line x1="' + vx(st.meta) + '" y1="290" x2="' + vx(st.meta) + '" y2="316" stroke="#1e7a45" stroke-width="7"/>';
    st.marcas.forEach(function (m) {
      s += '<circle cx="' + vx(m[0]) + '" cy="290" r="8" fill="#c8382f" stroke="#fff" stroke-width="2.5"/><text x="' + vx(m[0]) + '" y="374" text-anchor="middle" font-size="24" font-weight="800" fill="#c8382f">' + m[1] + '</text>';
    });
    s += '<g transform="translate(' + vx(Math.min(st.pos, VFIN)).toFixed(1) + ' 268) scale(1.5)">' + cocheLado(st.pos) + '</g>';
    if (st.brillo) s += chispas(vx(st.pos), 222);
    if (st.fuera) s += '<text x="' + (vx(VFIN) - 8) + '" y="140" text-anchor="end" font-size="28" font-weight="800" fill="#c8382f">¡Se sale de la pista!</text>';
    return '<svg viewBox="0 0 ' + W + ' 384" role="img" aria-label="El coche en la pista: ' + Math.round(st.pos) + ' centímetros en ' + coma(Math.round(st.tm * 10) / 10) + ' segundos">' + s + '</svg>';
  }
  function velocidad(zona, nivel) {
    var Q = null, hecho = false, corriendo = false, anim = null, st = null;
    var datos = h('div', { class: 'vel-datos' }), escena = h('div', { class: 'vel-escena' });
    var B = base(zona, [escena, datos, h('p', { class: 'ayuda', text: 'La distancia se mide desde la punta del coche. Cada segundo, el coche deja una marca roja en la cinta.' })]);
    zona.querySelector('.juego').classList.add('ancho');  // la pista necesita sitio
    var cas = A.casilla(), bSig = A.boton('Siguiente', nuevo, 'primario'), lab = h('span', { text: 'cm' });
    var J = partida('velocidad', nivel, 6, B.lado, B.est, B.ronda, bSig, nuevo);
    function gen() {
      var vv, t, d;
      do {
        if (nivel === 1) { vv = [10, 15, 20, 25, 30][rnd(5)]; t = 2 + rnd(5); }
        else if (nivel === 2) { vv = [10, 20, 30, 40][rnd(4)]; t = [0.5, 1.5, 2.5, 3.5, 4.5][rnd(5)]; }
        else if (nivel === 3) { vv = [10, 20, 25, 40][rnd(4)]; t = 1 + rnd(8); }
        else { t = [2, 4, 5][rnd(3)]; vv = 10 + 5 * rnd(7); }
        d = vv * t;
      } while (d > 200 || d < 20);
      return { v: vv, t: t, d: d, pide: nivel <= 2 ? 'd' : nivel === 3 ? 't' : 'v' };
    }
    function pintaEscena() { escena.innerHTML = escenaVel(st); }
    function pintaDatos(resp) {
      var C = [['vel', 'Velocidad', Q.pide === 'v', Q.v, 'cm/s'], ['tiempo', 'Tiempo', Q.pide === 't', Q.t, 's'], ['dist', 'Distancia', Q.pide === 'd', Q.d, 'cm']];
      datos.innerHTML = C.map(function (c) {
        var val = c[2] ? (resp == null ? '?' : coma(resp) + ' ' + c[4]) : coma(c[3]) + ' ' + c[4];
        return '<div class="vd' + (c[2] ? ' incog' : '') + '"><span class="vd-ico">' + ICO_VEL[c[0]] + '</span><span class="vd-nom">' + c[1] + '</span><b>' + val + '</b></div>';
      }).join('');
    }
    // el coche arranca a vv cm/s durante tt s (si llega al final de la pista, se para allí)
    function arranca(vv, tt, alParar) {
      cancelAnimationFrame(anim);
      var lejos = vv * tt, para = Math.min(lejos, VFIN), tPara = vv ? para / vv : 0;
      function marcas(tm) { var m = []; for (var s = 1; s <= tm + 1e-9; s++) m.push([vv * s, s + ' s']); return m; }
      function fin() { st.pos = para; st.tm = tPara; st.marcas = marcas(tPara); st.fuera = lejos > VFIN; corriendo = false; pintaEscena(); alParar(para); }
      corriendo = true; st.brillo = false; st.fuera = false;
      if (A.quieto() || PRUEBA.rapido) { fin(); return; }
      var t0 = null, dur = Math.max(800, Math.min(4200, tPara * 560));
      function paso(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur);
        st.tm = tPara * k; st.pos = vv * st.tm; st.marcas = marcas(st.tm); pintaEscena();
        if (k < 1) anim = requestAnimationFrame(paso); else fin();
      }
      anim = requestAnimationFrame(paso);
    }
    // la pista del primer fallo: la cuenta que hay que hacer, sin el resultado
    function pistaVel() {
      var v = Q.v, t = Q.t, d = Q.d;
      if (Q.pide === 'd') {
        if (t % 1 === 0) return 'En ' + seg(t) + ': ' + v + ' × ' + t + ' = ?';
        if (t < 1) return 'Medio segundo es la mitad de un segundo: ¿cuánto es la mitad de ' + v + '?';
        return 'En medio segundo avanza la mitad (' + v / 2 + ' cm). En ' + coma(t) + ' s: ' + v + ' × ' + Math.floor(t) + ' + ' + v / 2 + ' = ?';
      }
      if (Q.pide === 't') return '¿Cuántas veces cabe ' + v + ' en ' + d + '? Puedes ir sumando ' + v + ' + ' + v + ' + … hasta llegar a ' + d + '.';
      return 'Reparte ' + d + ' cm entre ' + t + ' segundos: ' + d + ' : ' + t + ' = ?';
    }
    function nuevo() {
      cancelAnimationFrame(anim); corriendo = false; hecho = false; J.empieza(); tec.limpia();
      Q = gen(); PRUEBA.vel = Q;
      st = { pos: 0, tm: 0, marcas: [], meta: Q.pide === 'd' ? null : Q.d, cono: null, fuera: false, brillo: false };
      pintaDatos(null); pintaEscena();
      B.enun.innerHTML = Q.pide === 'd' ? 'El coche va a <b>' + Q.v + ' cm por segundo</b> y anda <b>' + seg(Q.t) + '</b>. ¿En qué centímetro se para?'
        : Q.pide === 't' ? 'La meta está en <b>' + Q.d + ' cm</b> y el coche va a <b>' + Q.v + ' cm por segundo</b>. ¿Cuántos segundos tiene que andar para parar en la meta?'
          : 'La meta está en <b>' + Q.d + ' cm</b> y el coche tiene que llegar en <b>' + seg(Q.t) + '</b>. ¿A qué velocidad tiene que ir?';
      lab.textContent = Q.pide === 'd' ? 'cm' : Q.pide === 't' ? 's' : 'cm/s';
      A.estado(B.est, '', 'Escribe tu respuesta y pulsa «Comprobar»: el coche arrancará con tu número.');
    }
    var tec = A.teclado([cas], function (r) {
      if (corriendo) return;
      if (hecho) { if (!bSig.hidden) nuevo(); return; }
      if (r[0] === null) { A.estado(B.est, 'mal', 'Escribe un número.'); return; }
      var x = r[0], buena = Q.pide === 'd' ? Q.d : Q.pide === 't' ? Q.t : Q.v, ok = x === buena;
      var vv = Q.pide === 'v' ? x : Q.v, tt = Q.pide === 't' ? x : Q.t;
      if (Q.pide === 'd') st.cono = x;
      pintaDatos(x); tec.limpia();
      A.estado(B.est, '', 'El coche arranca…');
      if (!ok && J.puedeOtra()) {  // primer fallo: no cuenta
        // en «¿dónde se para?» anda solo 1 segundo (si anduviera todo, se vería la respuesta); en las otras, anda con tu número
        if (Q.pide === 'd') arranca(Q.v, Q.t > 1 ? 1 : 0, function () { J.otra((Q.t > 1 ? 'Mira la marca «1 s»: en 1 segundo avanza ' + Q.v + ' cm. ' : '') + pistaVel()); });
        else arranca(vv, tt, function (p) { J.otra('Con ' + coma(x) + (Q.pide === 't' ? ' s' : ' cm/s') + ' se para en ' + Math.round(p) + ' cm' + (vv * tt > VFIN ? ' (se sale de la pista)' : '') + ', y la meta está en ' + Q.d + ' cm. ' + pistaVel()); });
        return;
      }
      hecho = true;
      var cuenta = Q.pide === 'd' ? Q.v + ' × ' + coma(Q.t) + ' = ' + Q.d + ' cm' : Q.pide === 't' ? Q.d + ' : ' + Q.v + ' = ' + Q.t + ' s' : Q.d + ' : ' + Q.t + ' = ' + Q.v + ' cm/s';
      arranca(Q.pide === 'd' ? Q.v : vv, Q.pide === 'd' ? Q.t : tt, function (p) {
        if (ok) { st.brillo = true; pintaEscena(); }
        J.acaba(ok, ok ? '¡Muy bien! ' + (Q.pide === 'd' ? 'Se para justo en el cono: ' : 'Para justo en la meta: ') + cuenta + '.'
          : 'No. ' + (Q.pide === 'd' ? 'Se para en ' + Q.d + ' cm, no en ' + x + ' cm: ' : 'Con ' + coma(x) + (Q.pide === 't' ? ' s' : ' cm/s') + ' se para en ' + Math.round(p) + ' cm. La respuesta era ') + cuenta + '.');
      });
    });
    B.lado.append(B.enun, B.ronda, h('div', { class: 'respuesta' }, [cas, lab]), tec.el, B.est, h('div', { class: 'fila' }, [bSig]));
    PRUEBA.resuelve = function () { var r = Q.pide === 'd' ? Q.d : Q.pide === 't' ? Q.t : Q.v; String(r).split('').forEach(pulsaTecla); pulsaTecla('Comprobar'); };
    nuevo();
    return function () { cancelAnimationFrame(anim); };
  }

  A.registra({ id: 'condiciones', tit: '¿Qué hace el programa?', cursos: '4º a 6º', grupo: 'prog', col: '#00A4A6', desc: 'Si, si no, tres caminos, «y» y «o»: sigue el programa.', niveles: NIV_SI.map(function (n) { return n.t; }), fn: condiciones });
  A.registra({ id: 'velocidad', tit: 'Aparca el coche Nezha', cursos: '5º y 6º', grupo: 'mates', col: '#ad5b12', desc: 'Velocidad × tiempo: haz que el coche pare justo en la meta.', niveles: NIV_VEL.map(function (n) { return n.t; }), fn: velocidad });
  A.registra({ id: 'regla', tit: 'La regla secreta', cursos: '3º a 6º', grupo: 'logica', col: '#257f46', desc: 'Prueba números del 1 al 30 y descubre la regla de la máquina.', niveles: NIV_REGLA.map(function (n) { return n.t; }), fn: regla });
  A.registra({ id: 'balanza', tit: 'Ordenar con la balanza', cursos: '3º a 6º', grupo: 'logica', col: '#b65c06', desc: 'Ordena las cajas con las menos pesadas posibles.', niveles: NIV_BAL.map(function (n) { return n.t; }), fn: balanza });

  A.registra({ id: 'binario', tit: 'Cartas binarias', cursos: '3º a 6º', grupo: 'mates', col: '#2c5bbf', desc: 'Cuenta como un ordenador: con cartas boca arriba y boca abajo.', niveles: NIV_BIN.map(function (n) { return n.t; }), fn: binario });
  A.registra({ id: 'poligonos', tit: 'La tortuga y los polígonos', cursos: '4º a 6º', grupo: 'prog', col: '#0f7a8a', desc: 'Repetir y girar: ¿cuántos grados en cada esquina?', niveles: NIV_POL.map(function (n) { return n.t; }), fn: poligonos });
  A.registra({ id: 'cifrado', tit: 'Mensajes secretos', cursos: '3º a 6º', grupo: 'logica', col: '#6c44b0', desc: 'Descifra palabras con números, símbolos y desplazamientos.', niveles: NIV_CIF.map(function (n) { return n.t; }), fn: cifrado });
  A.registra({ id: 'pixel', tit: 'Píxel art', cursos: '3º y 4º', grupo: 'logica', col: '#c8382f', desc: 'Pinta el dibujo secreto siguiendo el código de cada fila.', niveles: PIX.map(function (d) { return d[0]; }), fn: pixel });
})();
