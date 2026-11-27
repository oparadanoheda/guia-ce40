// Modo proyección de la sesión («Proyectar la sesión»): tres pantallas (Hoy, La misión y Cierre).
// La de la misión es un tablero que se queda puesto durante la práctica: los pasos, los bloques que hacen falta,
// una referencia visual, «Lo hemos conseguido si…» y el reto para quien termine.
// Los roles y el minuto de uso responsable no son pantallas: se abren desde «Recursos» si se quieren usar.
// Los datos van en <script type="application/json" class="pz2-data"> dentro de la ficha (tablero_data de build_web.py).
(function () {
  var box = null, d = null, cur = 0, opt = 0, last = null, hechos = {};
  var memoria = {};  // lo marcado en cada sesión: se conserva al abrir un recurso y volver
  var NOMBRES = ['Hoy', 'La misión', 'Cierre'];
  var TECLAS = {
    avanza: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V5M5 12l7-7 7 7"/></svg>',
    retrocede: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v15M5 12l7 7 7-7"/></svg>',
    izquierda: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 13L4 8l5-5M4 8h10a6 6 0 010 12h-3"/></svg>',
    derecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 13l5-5-5-5M20 8H10a6 6 0 000 12h3"/></svg>',
    go: 'GO',
    borrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  // la bandera verde de Scratch (la guía no usa emojis)
  var BANDERA = '<svg viewBox="0 0 16 16" role="img" aria-label="bandera verde"><path d="M3.2 1.6v12.8" stroke="#3d8a37" stroke-width="1.7" stroke-linecap="round"/><path d="M4 2.6c2.1-1.2 3.9.8 6 0 1-.4 1.9-.7 2.8-.5v6.4c-.9-.2-1.8.1-2.8.5-2.1.8-3.9-1.2-6 0z" fill="#4cbf56" stroke="#3d8a37" stroke-width=".9" stroke-linejoin="round"/></svg>';

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function html(tag, cls, h) { var e = el(tag, cls); e.innerHTML = h; return e; }
  function btn(cls, text, fn) { var b = el('button', cls, text); b.type = 'button'; b.addEventListener('click', fn); return b; }
  // los pasos y los logros se marcan también con el teclado (Tab, y Enter o espacio)
  function teclado(li) {
    li.tabIndex = 0;
    li.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === li) { e.preventDefault(); li.click(); } });
  }
  function pics(names) {
    var w = el('span', 'pz-pics');
    (names || []).forEach(function (n) {
      var src = (window.PZ_ICON && window.PZ_ICON[n]) || (window.PICTO && window.PICTO[n]);
      if (src) { var im = el('img'); im.src = src; im.alt = ''; w.appendChild(im); }
    });
    return w.children.length ? w : null;
  }
  // vídeos y herramientas de la sesión (el temporizador no: no hay fases que cronometrar en la pizarra)
  function recursos() {
    return (d.videos || []).map(function (v) { return ['Vídeo: ' + v[0], '#v-' + v[1]]; })
      .concat((d.tools || []).filter(function (t) { return t[1].indexOf('temporizador') !== 0; }).map(function (t) { return [t[0], '#p-' + t[1]]; }));
  }

  // Leer en voz alta (1º y 2º): la voz del sistema en español, sin internet. En el tablero lee el paso actual.
  function callar() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* sin voz */ } }
  function leer() {
    if (!window.speechSynthesis || !box) return;
    var now = box.querySelector('.pz2-steps li.now .pz2-row'), sl = box.querySelector('.pz-stage .pz-slide');
    var t = cur === 1 ? (now ? now.textContent : box.querySelector('.pz2-head h2').textContent) : sl.innerText;
    callar();
    var u = new SpeechSynthesisUtterance(String(t).replace(/\s+/g, ' ').trim());
    u.lang = 'es-ES'; u.rate = 0.9;
    var vs = window.speechSynthesis.getVoices();
    var v = vs.filter(function (x) { return /^es[-_]ES/i.test(x.lang); })[0] || vs.filter(function (x) { return /^es/i.test(x.lang); })[0];
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  /* ---- pantalla 1: Hoy ---- */
  function hoy() {
    var s = el('div', 'pz-slide pz-cover pz2-hoy');
    s.appendChild(el('p', 'pz-eyebrow', d.course + ' · Sesión ' + d.num));
    s.appendChild(el('h1', 'pz-title', d.title));
    if (d.obj) {
      var o = el('div', 'pz-obj');
      o.appendChild(el('span', 'pz-label', 'Hoy aprendemos'));
      o.appendChild(el('p', null, d.obj));
      s.appendChild(o);
    }
    (d.words || []).forEach(function (w) {
      var p = el('p', 'pz2-word');
      p.appendChild(document.createTextNode('Palabra nueva: '));
      p.appendChild(el('b', null, w[0] + '.'));
      p.appendChild(document.createTextNode(' ' + w[1]));
      s.appendChild(p);
    });
    if (d.videos && d.videos.length) {
      var g = el('div', 'pz-tools');
      d.videos.forEach(function (v) { g.appendChild(btn('pz-tool', 'Ver el vídeo: ' + v[0], function () { go('#v-' + v[1]); })); });
      s.appendChild(g);
    }
    return s;
  }

  /* ---- pantalla 2: el tablero de la misión ---- */
  function referencia(R) {
    var ref = el('section', 'pz2-ref'), g;
    ref.appendChild(el('h3', null, R.titulo));
    if (R.tipo === 'teclas') {
      g = el('div', 'pz2-keys');
      R.items.forEach(function (k) {
        var c = el('div', 'pz2-key');
        c.appendChild(html('i', k[0] === 'go' ? 'go' : (k[0] === 'borrar' ? 'del' : ''), TECLAS[k[0]]));
        c.appendChild(el('span', null, k[1])); g.appendChild(c);
      });
    } else if (R.tipo === 'leds') {
      g = el('div', 'pz2-leds');
      R.items.forEach(function (k) {
        var c = el('div', 'pz2-led'), m = el('div');
        m.setAttribute('role', 'img'); m.setAttribute('aria-label', 'Pantalla de la micro:bit: ' + k[1]);
        k[0].split('').forEach(function (ch) { m.appendChild(el('i', ch === '1' ? 'on' : '')); });
        c.appendChild(m); c.appendChild(el('span', null, k[1])); g.appendChild(c);
      });
    } else if (R.tipo === 'pictos') {
      g = el('div', 'pz2-pictos');
      R.items.forEach(function (k) {
        var c = el('div', 'pz2-picto'), im = pics([k[0]]);
        if (im) c.appendChild(im);
        c.appendChild(el('span', null, k[1])); g.appendChild(c);
      });
    } else if (R.tipo === 'tabla') {
      g = el('table', 'pz2-tabla');
      R.items.forEach(function (row, i) {
        var tr = el('tr');
        row.forEach(function (x, j) { var c = el(i === 0 || j === 0 ? 'th' : 'td', null, x); if (i === 0) c.scope = 'col'; else if (j === 0) c.scope = 'row'; tr.appendChild(c); });
        g.appendChild(tr);
      });
    } else {
      g = el('ol', 'pz2-lista');
      R.items.forEach(function (x) { g.appendChild(el('li', null, x)); });
    }
    ref.appendChild(g);
    return ref;
  }

  function mision() {
    var T = d.tableros[Math.min(opt, d.tableros.length - 1)], key = opt + ':';
    var s = el('div', 'pz-slide'), board = el('div', 'pz2-board'), main = el('div', 'pz2-main'), side = el('aside', 'pz2-side');
    var head = el('div', 'pz2-head');
    head.appendChild(el('span', 'pz-label', 'La misión'));
    if (d.tableros.length > 1) {
      var os = el('div', 'pz2-opts');
      d.opciones.forEach(function (name, i) {
        var b = btn('pz2-opt' + (i === opt ? ' on' : ''), name, function () { opt = i; render(); });
        b.setAttribute('aria-pressed', String(i === opt));
        os.appendChild(b);
      });
      head.appendChild(os);
    }
    head.appendChild(el('h2', null, T.titulo));
    main.appendChild(head);

    var ol = el('ol', 'pz2-steps' + (T.cols === 2 ? ' cols2' : '') + (T.retos ? ' retos' : ''));
    if (T.etiqueta) ol.style.setProperty('--et', '"' + T.etiqueta + ' "');
    var done = hechos[key + 'n'] || 0;
    T.pasos.forEach(function (P, i) {
      var li = el('li', i < done ? 'done' : (i === done ? 'now' : ''));
      var body = el('div', 'pz2-body'), row = el('div', 'pz2-row'), p = pics(P.pics);
      if (p) row.appendChild(p);
      row.appendChild(html('span', null, P.t));
      body.appendChild(row);
      if (P.bloques) {
        var bl = el('div', 'pz2-blocks');
        P.bloques.forEach(function (b) {
          var sp = el('span', 'mkb ' + b[0]), partes = b[1].split('{bandera}');
          partes.forEach(function (x, k) { if (k) sp.appendChild(html('span', 'pz2-flag', BANDERA)); sp.appendChild(document.createTextNode(x)); });
          bl.appendChild(sp);
        });
        body.appendChild(bl);
      }
      if (P.pista) {
        var h = el('div', 'pz2-hint'), shown = hechos[key + 'p' + i];
        h.appendChild(btn(null, shown ? 'Ocultar la pista' : 'Pista', function (e) { e.stopPropagation(); hechos[key + 'p' + i] = !shown; render(); }));
        if (shown) h.appendChild(el('span', null, P.pista));
        body.appendChild(h);
      }
      li.appendChild(body);
      // tocar un paso lo deja como el actual; tocar el actual lo da por hecho
      li.addEventListener('click', function () { hechos[key + 'n'] = (i === done) ? i + 1 : i; render(); });
      teclado(li);
      ol.appendChild(li);
    });
    main.appendChild(ol);
    var rs = recursos();
    if (rs.length) {
      var tb = el('div', 'pz2-tools');
      tb.appendChild(el('small', null, 'Abrir:'));
      rs.forEach(function (r) { tb.appendChild(btn(null, r[0], function () { go(r[1]); })); });
      main.appendChild(tb);
    }

    if (T.ref) side.appendChild(referencia(T.ref));
    var lg = el('section');
    lg.appendChild(el('h3', null, 'Lo hemos conseguido si…'));
    var ul = el('ul', 'pz2-ok');
    T.logro.forEach(function (t, i) {
      var li = el('li', hechos[key + 'l' + i] ? 'on' : '', t);
      li.addEventListener('click', function () { hechos[key + 'l' + i] = !hechos[key + 'l' + i]; render(); });
      teclado(li);
      ul.appendChild(li);
    });
    lg.appendChild(ul);
    side.appendChild(lg);
    (T.notas || []).forEach(function (n) { var at = el('section'); at.appendChild(el('h3', null, n[0])); at.appendChild(el('p', null, n[1])); side.appendChild(at); });
    if (T.extra) { var ex = el('section', 'pz2-extra'); ex.appendChild(el('h3', null, '¿Habéis terminado?')); ex.appendChild(el('p', null, T.extra)); side.appendChild(ex); }
    board.appendChild(main); board.appendChild(side); s.appendChild(board);
    return s;
  }

  /* ---- pantalla 3: Cierre ---- */
  function cierre() {
    var s = el('div', 'pz-slide pz2-fin');
    s.appendChild(el('span', 'pz-label', '¿Qué hemos aprendido hoy?'));
    if (d.key) s.appendChild(el('blockquote', 'pz-key', d.key));
    if (d.salida && d.salida.length) {
      var g = el('div', 'pz-tools');
      d.salida.forEach(function (t) { g.appendChild(btn('pz-tool', 'Preguntas de salida: ' + t[0], function () { go('#p-' + t[1]); })); });
      s.appendChild(g);
    }
    var ck = el('ul', 'pz-check');
    d.recoger.forEach(function (t) { ck.appendChild(el('li', null, t)); });
    s.appendChild(ck);
    return s;
  }

  /* ---- lo que se abre encima, desde «Recursos»: roles, minuto de uso responsable y el QR de las tablets ---- */
  function encima(kind, dato) {
    var ov = el('div', 'pz2-over'), p = el('div');
    p.appendChild(btn('pz-x', '×', function () { ov.remove(); })).setAttribute('aria-label', 'Cerrar');
    if (kind === 'roles') {
      p.appendChild(el('span', 'pz-label', 'Roles'));
      var g = el('div', 'pz-roles');
      d.roles.forEach(function (r) {
        var c = el('div', 'pz-role');
        if (window.PICTO && window.PICTO[r[2]]) { var im = el('img'); im.src = window.PICTO[r[2]]; im.alt = ''; c.appendChild(im); }
        c.appendChild(el('b', null, r[0])); c.appendChild(el('p', null, r[1])); g.appendChild(c);
      });
      p.appendChild(g);
      p.appendChild(el('p', 'pz-sub', 'A mitad de la práctica, cambio: el piloto pasa a copiloto y el copiloto, a piloto.'));
      p.appendChild(el('p', 'pz2-credito', 'Pictogramas: Sergio Palao, ARASAAC (CC BY-NC-SA)'));
    } else if (kind === 'tablet') {
      p.appendChild(el('span', 'pz-label', 'En las tablets o los portátiles'));
      var c2 = el('div', 'pz-qr'); c2.appendChild(el('b', null, dato[0]));
      var w = document.createElement('div'); w.innerHTML = dato[2]; c2.appendChild(w.firstChild);
      p.appendChild(c2);
      p.appendChild(el('p', 'pz-qrnota', 'Tablets: escanead el código con la cámara y pulsad «Empezar a pantalla completa». Portátiles: abrid el icono «Retos CE 4.0».'));
    } else {
      p.appendChild(el('span', 'pz-label', 'Minuto de uso responsable'));
      p.appendChild(el('p', 'pz-big', d.seg));
    }
    ov.appendChild(p);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    box.appendChild(ov);
  }

  function render() {
    var stage = box.querySelector('.pz-stage');
    callar();
    stage.innerHTML = '';
    stage.appendChild([hoy, mision, cierre][cur]());
    box.querySelectorAll('.pz2-tab').forEach(function (t, i) { t.classList.toggle('on', i === cur); t.setAttribute('aria-pressed', String(i === cur)); });
    box.querySelector('.pz-prev').disabled = cur === 0;
    box.querySelector('.pz-next').disabled = cur === 2;
    box.querySelector('.pz-reslist').hidden = true;
    box.querySelector('.pz-resbtn').setAttribute('aria-expanded', 'false');
  }
  function move(n) { var k = Math.max(0, Math.min(2, cur + n)); if (k !== cur) { cur = k; render(); } }
  function close() {
    if (!box) return;
    callar();
    document.removeEventListener('keydown', onKey);
    box.remove(); box = null;
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { /* sin pantalla completa */ }
  }
  function go(hash) { last = cur; close(); location.hash = hash; }  // «Volver a la sesión» reabre esta pantalla
  function onKey(e) {
    if (e.key === 'Escape') { var ov = box.querySelector('.pz2-over'); if (ov) ov.remove(); else close(); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === 'PageDown') { move(1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { move(-1); e.preventDefault(); }
    else if ((e.key === 'l' || e.key === 'L') && d.visual) { leer(); e.preventDefault(); }
  }

  function open(section, start) {
    var raw = section.querySelector('script.pz2-data');
    if (!raw) return;
    d = JSON.parse(raw.textContent);
    hechos = memoria[section.id] || (memoria[section.id] = {});
    // la propuesta que está abierta en la ficha es la que se proyecta
    opt = 0;
    Array.prototype.forEach.call(section.querySelectorAll('.p-tabs [role=tab]'), function (t, i) { if (t.getAttribute('aria-selected') === 'true') opt = i; });
    cur = Math.max(0, Math.min(2, start || 0));
    box = el('div', 'pz pz2' + (d.visual ? ' pz-visual' : ''));
    box.style.setProperty('--pz', (getComputedStyle(section).getPropertyValue('--c') || '').trim() || '#2c5bbf');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Proyectar la sesión');
    var top = el('div', 'pz-top');
    top.appendChild(el('span', 'pz-crumb', d.course.split(' · ')[0] + ' · S' + d.num));
    var tabs = el('div', 'pz2-tabs');
    NOMBRES.forEach(function (n, i) { tabs.appendChild(btn('pz2-tab', n, function () { cur = i; render(); })); });
    top.appendChild(tabs);
    var rw = el('div', 'pz-res'), rl = el('div', 'pz-reslist');
    var rb = btn('pz-resbtn', 'Recursos', function () { rl.hidden = !rl.hidden; rb.setAttribute('aria-expanded', String(!rl.hidden)); });
    rl.hidden = true;
    recursos().concat((d.salida || []).map(function (t) { return ['Preguntas de salida: ' + t[0], '#p-' + t[1]]; }))
      .forEach(function (r) { rl.appendChild(btn(null, r[0], function () { go(r[1]); })); });
    (d.tablet || []).forEach(function (t) { rl.appendChild(btn(null, 'En tablets o portátiles: ' + t[0], function () { rl.hidden = true; encima('tablet', t); })); });
    if (rl.children.length) rl.appendChild(el('hr'));
    rl.appendChild(el('small', null, 'Si quieres añadirlo'));
    rl.appendChild(btn(null, 'Roles', function () { rl.hidden = true; encima('roles'); }));
    if (d.seg) rl.appendChild(btn(null, 'Minuto de uso responsable', function () { rl.hidden = true; encima('seg'); }));
    rw.appendChild(rb); rw.appendChild(rl); top.appendChild(rw);
    var x = btn('pz-x', '×', close); x.setAttribute('aria-label', 'Salir (Esc)');
    top.appendChild(x);
    box.appendChild(top);
    box.appendChild(el('div', 'pz-stage'));
    var nav = el('div', 'pz-nav');
    nav.appendChild(btn('pz-prev', '‹ Anterior', function () { move(-1); }));
    if (d.visual && window.speechSynthesis) {
      var sp = html('button', 'pz-say', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Leer');
      sp.type = 'button'; sp.setAttribute('aria-label', 'Leer en voz alta (tecla L)');
      sp.addEventListener('click', leer);
      nav.appendChild(sp);
    }
    nav.appendChild(el('span', 'pz-hint', 'Toca un paso para marcarlo · flechas del teclado para cambiar de pantalla · ' + (d.visual ? 'L para leer · ' : '') + 'Esc para salir' +
      (d.visual ? ' · Pictogramas: Sergio Palao, ARASAAC (CC BY-NC-SA)' : '')));
    nav.appendChild(btn('pz-next', 'Siguiente ›', function () { move(1); }));
    box.appendChild(nav);
    document.body.appendChild(box);
    document.addEventListener('keydown', onKey);
    try { if (box.requestFullscreen) box.requestFullscreen().catch(function () {}); } catch (e) { /* el navegador no lo permite */ }
    render();
  }

  // «Proyectar la sesión» de la ficha (y «Proyectar el tablero», que abre directamente La misión: data-pz="1")
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.pz-open');
    if (b) open(b.closest('section.ficha'), +(b.getAttribute('data-pz') || 0));
  });
  // la usan app.js («Volver a la sesión» reabre la pantalla que estaba puesta), probar_web.py y capturas_guion.py
  window.ProyectarSesion = {
    open: open, close: close,
    takeSlide: function () { var s = last; last = null; return s; }
  };
})();
