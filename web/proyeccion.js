// Modo proyección: guía la sesión de principio a fin, a pantalla completa.
// Arriba, la barra de fases de la sesión (sin cronómetro) con la fase actual; debajo, una diapositiva cada vez.
(function () {
  var box = null, slides = [], cur = 0, data = null, lastSlide = null, propSel = 0;

  var ROLES = [
    ['Piloto', 'Maneja el dispositivo, el robot o las tarjetas.'],
    ['Copiloto', 'Lee el reto, comprueba y avisa de los errores. No toca el dispositivo.'],
    ['Material', 'Recoge, cuenta y devuelve el material. Lo pone a cargar.'],
    ['Portavoz', 'Explica lo que ha hecho el grupo.']
  ];
  var TRES = ['¿Qué queríais que pasara y qué ha pasado?', '¿En qué paso exacto empezaba a fallar?', '¿Se podría hacer con menos pasos?'];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function html(tag, cls, h) { var e = el(tag, cls); e.innerHTML = h; return e; }
  function slide(phase, kind) { var s = el('div', 'pz-slide' + (kind ? ' pz-' + kind : '')); return { phase: phase, el: s, steps: 0, step: 0 }; }
  function head(S, label, title) {
    S.el.appendChild(el('span', 'pz-label', label));
    if (title) S.el.appendChild(el('h2', 'pz-h2', title));
  }

  function build(d) {
    var out = [], Q = d.quincenal;

    /* ---- Arranque (o Tarjeta en 5º y 6º) ---- */
    var a = slide(0, 'cover');
    a.el.appendChild(el('p', 'pz-eyebrow', d.course + ' · Sesión ' + d.num));
    a.el.appendChild(el('h1', 'pz-title', d.title));
    if (d.obj) {
      var o = el('div', 'pz-obj');
      o.appendChild(el('span', 'pz-label', 'Hoy aprendemos'));
      o.appendChild(el('p', null, d.obj));
      a.el.appendChild(o);
    }
    out.push(a);

    if (d.prev) {
      var r = slide(0);
      head(r, Q ? 'Tarjeta «Dónde lo dejamos»' : 'Recordamos', Q ? 'Leemos la tarjeta y seguimos donde lo dejamos' : '¿Qué aprendimos la sesión pasada?');
      if (d.prev.key) r.el.appendChild(el('blockquote', 'pz-key pz-key-sm', d.prev.key));
      r.el.appendChild(el('p', 'pz-sub', 'Sesión ' + d.prev.num + ' · ' + d.prev.title));
      out.push(r);
    }
    if (d.seg) {
      var m = slide(0);
      head(m, 'Minuto de uso responsable');
      m.el.appendChild(el('p', 'pz-big', d.seg));
      out.push(m);
    }
    var ro = slide(0);
    head(ro, 'Roles', 'Cada uno con su rol');
    var rg = el('div', 'pz-roles');
    ROLES.forEach(function (x, i) {
      var c = el('div', 'pz-role');
      c.appendChild(el('b', null, x[0]));
      c.appendChild(el('p', null, x[1]));
      if (i > 1) c.classList.add('pz-role-g');
      rg.appendChild(c);
    });
    ro.el.appendChild(rg);
    ro.el.appendChild(el('p', 'pz-sub', 'En parejas: piloto y copiloto. En grupos de 3 o 4, también material y portavoz.'));
    out.push(ro);

    /* ---- Misión ---- */
    if (d.videos && d.videos.length) {
      var v = slide(1);
      head(v, 'Vídeo', d.videos.length === 1 ? d.videos[0][0] : 'Vemos los vídeos');
      var vg = el('div', 'pz-vids');
      d.videos.forEach(function (x) {
        var b = el('button', 'pz-vid');
        b.type = 'button';
        var im = el('img'); im.src = 'videos/img/' + x[1] + '.jpg'; im.alt = '';
        b.appendChild(im);
        b.appendChild(el('span', null, '▶  ' + x[0]));
        b.addEventListener('click', function () { go('#v-' + x[1]); });
        vg.appendChild(b);
      });
      v.el.appendChild(vg);
      out.push(v);
    }
    if (d.words && d.words.length) {
      var w = slide(1);
      head(w, d.words.length === 1 ? 'Palabra nueva' : 'Palabras nuevas');
      var g = el('div', 'pz-words');
      d.words.forEach(function (x) {
        var c = el('div', 'pz-word');
        c.appendChild(el('b', null, x[0]));
        c.appendChild(el('p', null, x[1]));
        g.appendChild(c);
      });
      w.el.appendChild(g);
      out.push(w);
    }
    var retos = d.missions.filter(function (x) { return x.label === 'Retos'; });
    var props = d.missions.filter(function (x) { return x.label !== 'Retos'; });
    retos.forEach(function (R) { out.push(stepsSlide('Retos', R.name || 'Los retos de hoy', R.steps, true)); });
    if (props.length) out.push(missionSlide(props));
    if (d.key) {
      var k = slide(1, 'keyslide');
      head(k, 'Frase clave');
      k.el.appendChild(el('blockquote', 'pz-key', d.key));
      out.push(k);
    }

    /* ---- Práctica ---- */
    var p = slide(2);
    head(p, 'Práctica', 'Manos a la obra');
    var tools = d.tools.filter(function (t) { return t[1].indexOf('temporizador') !== 0; });  // la barra de arriba ya marca la fase
    if (tools.length) {
      var bt = el('div', 'pz-tools');
      tools.forEach(function (t) {
        var b = el('button', 'pz-tool', t[0]);
        b.type = 'button';
        b.addEventListener('click', function () { go('#p-' + t[1]); });
        bt.appendChild(b);
      });
      p.el.appendChild(bt);
    } else {
      p.el.appendChild(el('p', 'pz-big', 'Trabajamos en parejas o en grupos. Si algo no sale: ¿qué queríais que pasara y qué ha pasado?'));
    }
    if (d.fast) {
      var f = el('div', 'pz-extra');
      f.appendChild(el('span', null, '¿Habéis terminado? Reto extra'));
      f.appendChild(html('p', null, d.fast));
      p.el.appendChild(f);
    }
    out.push(p);
    var cr = slide(2, 'keyslide');
    head(cr, 'A mitad de la práctica', 'Cambio de roles');
    cr.el.appendChild(el('p', 'pz-big', 'El piloto pasa a copiloto y el copiloto, a piloto.'));
    out.push(cr);

    /* ---- Compartir ---- */
    var c = slide(3);
    head(c, 'Compartir', 'Un grupo enseña su solución o su error más interesante');
    var ul = el('ul', 'pz-qs');
    TRES.forEach(function (q) { ul.appendChild(el('li', null, q)); });
    c.el.appendChild(ul);
    out.push(c);

    /* ---- Cierre (o Guardar en 5º y 6º) ---- */
    var z = slide(4, 'close');
    head(z, Q ? 'Guardar' : 'Cierre', '¿Qué hemos aprendido hoy?');
    if (d.key) z.el.appendChild(el('blockquote', 'pz-key pz-key-sm', d.key));
    var ck = el('ul', 'pz-check');
    (Q ? ['Guardamos el archivo con el nombre del equipo', 'Kit completo en su caja', 'Rellenamos la tarjeta «Dónde lo dejamos»']
       : (d.close || ['Sello en el pasaporte', 'Guardamos el trabajo', 'Recogemos el material'])).forEach(function (t) { ck.appendChild(el('li', null, t)); });
    z.el.appendChild(ck);
    out.push(z);
    return out;
  }

  // Lista de pasos que se recorren uno a uno con las flechas (el paso actual, resaltado)
  function stepsSlide(label, title, steps, cards) {
    var S = slide(1, cards ? 'retoslide' : null);
    head(S, label, title);
    var ol = el('ol', cards ? 'pz-retos' : 'pz-steps');
    steps.forEach(function (t) { ol.appendChild(html('li', null, t)); });
    S.el.appendChild(ol);
    S.steps = steps.length; S.list = ol;
    return S;
  }
  function missionSlide(props) {
    var S = slide(1);
    S.el.appendChild(el('span', 'pz-label', 'La misión'));
    var tabs = null;
    if (props.length > 1) {
      tabs = el('div', 'pz-props');
      props.forEach(function (P, i) {
        var b = el('button', 'pz-prop', P.label.replace('Propuesta ', '') + (P.name ? ' · ' + P.name : ''));
        b.type = 'button';
        b.addEventListener('click', function () { propSel = i; fill(); render(); });
        tabs.appendChild(b);
      });
      S.el.appendChild(tabs);
    }
    var h2 = el('h2', 'pz-h2'), ol = el('ol', 'pz-steps');
    S.el.appendChild(h2); S.el.appendChild(ol);
    function fill() {
      var P = props[Math.min(propSel, props.length - 1)];
      h2.textContent = P.name || 'Nuestra misión de hoy';
      ol.innerHTML = '';
      P.steps.forEach(function (t) { ol.appendChild(html('li', null, t)); });
      S.steps = P.steps.length; S.step = 0;
      if (tabs) Array.prototype.forEach.call(tabs.children, function (b, i) { b.classList.toggle('on', i === propSel); });
    }
    S.list = ol; S.fill = fill;
    fill();
    return S;
  }

  function render() {
    var S = slides[cur], stage = box.querySelector('.pz-stage');
    var rl = box.querySelector('.pz-reslist'); if (rl) { rl.hidden = true; box.querySelector('.pz-resbtn').setAttribute('aria-expanded', 'false'); }
    stage.innerHTML = '';
    stage.appendChild(S.el);
    if (S.list) Array.prototype.forEach.call(S.list.children, function (li, i) {
      li.classList.toggle('now', i === S.step);
      li.classList.toggle('done', i < S.step);
    });
    // barra de fases: la actual resaltada; dentro, un punto por diapositiva de esa fase
    box.querySelectorAll('.pz-seg').forEach(function (seg, k) {
      seg.classList.toggle('on', k === S.phase);
      seg.classList.toggle('past', k < S.phase);
      var dots = seg.querySelector('.pz-segdots');
      dots.innerHTML = '';
      slides.forEach(function (x, i) { if (x.phase === k) { var dd = el('i'); if (i === cur) dd.className = 'on'; dots.appendChild(dd); } });
    });
    box.querySelector('.pz-prev').disabled = cur === 0 && S.step === 0;
    box.querySelector('.pz-next').disabled = cur === slides.length - 1 && (!S.steps || S.step >= S.steps - 1);
    var nx = box.querySelector('.pz-next');
    nx.textContent = S.steps && S.step < S.steps - 1 ? 'Siguiente paso ›' : 'Siguiente ›';
  }

  function move(n) {
    var S = slides[cur];
    if (S.steps && n > 0 && S.step < S.steps - 1) { S.step++; render(); return; }
    if (S.steps && n < 0 && S.step > 0) { S.step--; render(); return; }
    var k = Math.max(0, Math.min(slides.length - 1, cur + n));
    if (k !== cur) { cur = k; render(); }
  }
  function jumpPhase(k) {
    for (var i = 0; i < slides.length; i++) if (slides[i].phase === k) { cur = i; render(); return; }
  }

  function close() {
    if (!box) return;
    document.removeEventListener('keydown', onKey);
    box.remove();
    box = null;
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { /* sin pantalla completa */ }
  }

  function go(hash) {
    lastSlide = cur;  // para volver a esta diapositiva con «Volver a la sesión»
    close();
    location.hash = hash;
  }

  function onKey(e) {
    if (e.key === 'Escape') { close(); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { move(1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { move(-1); e.preventDefault(); }
  }

  function open(section, start) {
    var raw = section.querySelector('script.pz-data');
    if (!raw) return;
    data = JSON.parse(raw.textContent);
    // la propuesta que está abierta en la ficha es la que se proyecta
    var tabs = section.querySelectorAll('.p-tabs [role=tab]');
    propSel = 0;
    Array.prototype.forEach.call(tabs, function (t, i) { if (t.getAttribute('aria-selected') === 'true') propSel = i; });
    slides = build(data);
    cur = Math.max(0, Math.min(slides.length - 1, start || 0));
    box = el('div', 'pz');
    box.style.setProperty('--pz', (getComputedStyle(section).getPropertyValue('--c') || '').trim() || '#2c5bbf');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Proyectar la sesión');

    var top = el('div', 'pz-top');
    top.appendChild(el('span', 'pz-crumb', data.course.split(' · ')[0] + ' · S' + data.num));
    var bar = el('div', 'pz-bar');
    data.phases.forEach(function (ph, k) {
      var seg = el('button', 'pz-seg');
      seg.type = 'button';
      seg.style.flex = ph[1];
      seg.appendChild(el('b', null, ph[0]));
      seg.appendChild(el('small', null, ph[1] + ' min'));
      seg.appendChild(el('span', 'pz-segdots'));
      seg.addEventListener('click', function () { jumpPhase(k); });
      bar.appendChild(seg);
    });
    top.appendChild(bar);
    // Recursos de la sesión siempre a mano: vídeos y herramientas
    var res = (data.videos || []).map(function (v) { return ['▶ ' + v[0], '#v-' + v[1]]; })
      .concat(data.tools.filter(function (t) { return t[1].indexOf('temporizador') !== 0; }).map(function (t) { return [t[0], '#p-' + t[1]]; }));
    if (res.length) {
      var rw = el('div', 'pz-res'), rb = el('button', 'pz-resbtn', 'Recursos'), rl = el('div', 'pz-reslist');
      rb.type = 'button'; rb.setAttribute('aria-expanded', 'false'); rl.hidden = true;
      rb.addEventListener('click', function () { rl.hidden = !rl.hidden; rb.setAttribute('aria-expanded', String(!rl.hidden)); });
      res.forEach(function (r) { var b = el('button', null, r[0]); b.type = 'button'; b.addEventListener('click', function () { go(r[1]); }); rl.appendChild(b); });
      rw.appendChild(rb); rw.appendChild(rl); top.appendChild(rw);
    }
    var x = el('button', 'pz-x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Salir (Esc)');
    x.addEventListener('click', close);
    top.appendChild(x);
    box.appendChild(top);

    var stage = el('div', 'pz-stage');
    stage.addEventListener('click', function (e) {
      if (e.target.closest('button')) return;
      move(e.clientX > window.innerWidth / 3 ? 1 : -1);
    });
    box.appendChild(stage);
    var nav = el('div', 'pz-nav');
    var p = el('button', 'pz-prev', '‹ Anterior'); p.type = 'button'; p.addEventListener('click', function () { move(-1); });
    var n = el('button', 'pz-next', 'Siguiente ›'); n.type = 'button'; n.addEventListener('click', function () { move(1); });
    nav.appendChild(p); nav.appendChild(el('span', 'pz-hint', 'Flechas del teclado o toca la pantalla · toca una fase para saltar a ella · Esc para salir')); nav.appendChild(n);
    box.appendChild(nav);
    document.body.appendChild(box);
    document.addEventListener('keydown', onKey);
    try { if (box.requestFullscreen) box.requestFullscreen().catch(function () {}); } catch (e) { /* el navegador no lo permite */ }
    render();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.pz-open');
    if (b) open(b.closest('section.ficha'));
  });
  window.ProyectarSesion = {
    open: open, close: close,
    takeSlide: function () { var s = lastSlide; lastSlide = null; return s; }
  };
})();
