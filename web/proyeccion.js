// Modo proyección: vista de la sesión para la clase, a pantalla completa y por diapositivas.
(function () {
  var box = null, slides = [], cur = 0, data = null, color = '', lastSlide = null;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function build(d) {
    var out = [];
    var s1 = el('div', 'pz-slide pz-cover');
    s1.appendChild(el('p', 'pz-eyebrow', d.course + ' · Sesión ' + d.num));
    s1.appendChild(el('h1', 'pz-title', d.title));
    if (d.obj) {
      var o = el('div', 'pz-obj');
      o.appendChild(el('span', 'pz-label', 'Hoy aprendemos'));
      o.appendChild(el('p', null, d.obj));
      s1.appendChild(o);
    }
    out.push(s1);

    if (d.videos && d.videos.length) {
      var sv = el('div', 'pz-slide');
      sv.appendChild(el('span', 'pz-label', 'Vídeo'));
      sv.appendChild(el('h2', 'pz-h2', d.videos.length === 1 ? d.videos[0][0] : 'Vemos los vídeos'));
      var vg = el('div', 'pz-vids');
      d.videos.forEach(function (v) {
        var b = el('button', 'pz-vid');
        b.type = 'button';
        var im = el('img');
        im.src = 'videos/img/' + v[1] + '.jpg';
        im.alt = '';
        b.appendChild(im);
        b.appendChild(el('span', null, '▶  ' + v[0]));
        b.addEventListener('click', function (e) { e.stopPropagation(); go('#v-' + v[1]); });
        vg.appendChild(b);
      });
      sv.appendChild(vg);
      out.push(sv);
    }
    if (d.seg) {
      var s2 = el('div', 'pz-slide');
      s2.appendChild(el('span', 'pz-label', 'Minuto SEG · uso responsable'));
      s2.appendChild(el('p', 'pz-big', d.seg));
      out.push(s2);
    }
    if (d.words && d.words.length) {
      var s3 = el('div', 'pz-slide');
      s3.appendChild(el('span', 'pz-label', d.words.length === 1 ? 'Palabra nueva' : 'Palabras nuevas'));
      var g = el('div', 'pz-words');
      d.words.forEach(function (w) {
        var c = el('div', 'pz-word');
        c.appendChild(el('b', null, w[0]));
        c.appendChild(el('p', null, w[1]));
        g.appendChild(c);
      });
      s3.appendChild(g);
      out.push(s3);
    }
    if (d.key) {
      var s4 = el('div', 'pz-slide pz-keyslide');
      s4.appendChild(el('span', 'pz-label', 'Frase clave'));
      s4.appendChild(el('blockquote', 'pz-key', d.key));
      out.push(s4);
    }
    var s5 = el('div', 'pz-slide');
    s5.appendChild(el('span', 'pz-label', 'Manos a la obra'));
    s5.appendChild(el('h2', 'pz-h2', d.tools.length ? 'Abrimos la herramienta de la sesión' : 'Trabajamos en equipo'));
    var bt = el('div', 'pz-tools');
    d.tools.forEach(function (t) {
      var b = el('button', 'pz-tool', t[0]);
      b.type = 'button';
      b.addEventListener('click', function () { go('#p-' + t[1]); });
      bt.appendChild(b);
    });
    var tm = el('button', 'pz-tool pz-timer', 'Temporizador de la sesión');
    tm.type = 'button';
    tm.addEventListener('click', function () { go('#p-temporizador.' + (d.quincenal ? 'quincenal' : 'semanal')); });
    bt.appendChild(tm);
    s5.appendChild(bt);
    var bar = el('div', 'pz-phases');
    d.phases.forEach(function (p) {
      var ph = el('div', 'pz-phase');
      ph.style.flex = p[1];
      ph.appendChild(el('b', null, p[0]));
      ph.appendChild(el('small', null, p[1] + ' min'));
      bar.appendChild(ph);
    });
    s5.appendChild(bar);
    out.push(s5);

    var s6 = el('div', 'pz-slide pz-close');
    s6.appendChild(el('span', 'pz-label', 'Para terminar'));
    s6.appendChild(el('h2', 'pz-h2', '¿Qué hemos aprendido hoy?'));
    if (d.key) s6.appendChild(el('blockquote', 'pz-key pz-key-sm', d.key));
    s6.appendChild(el('p', 'pz-sub', 'Recogemos el material y guardamos el trabajo.'));
    out.push(s6);
    return out;
  }

  function render() {
    var stage = box.querySelector('.pz-stage');
    stage.innerHTML = '';
    stage.appendChild(slides[cur]);
    box.querySelectorAll('.pz-dot').forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    box.querySelector('.pz-prev').disabled = cur === 0;
    box.querySelector('.pz-next').disabled = cur === slides.length - 1;
  }

  function move(n) {
    var k = Math.max(0, Math.min(slides.length - 1, cur + n));
    if (k !== cur) { cur = k; render(); }
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
    color = getComputedStyle(section).getPropertyValue('--c') || '';
    slides = build(data);
    cur = Math.max(0, Math.min(slides.length - 1, start || 0));
    box = el('div', 'pz');
    box.style.setProperty('--pz', color.trim() || '#2c5bbf');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Proyectar la sesión');
    var top = el('div', 'pz-top');
    top.appendChild(el('span', 'pz-crumb', data.course + ' · S' + data.num));
    var dots = el('div', 'pz-dots');
    slides.forEach(function (_, i) {
      var d = el('button', 'pz-dot');
      d.type = 'button';
      d.setAttribute('aria-label', 'Diapositiva ' + (i + 1));
      d.addEventListener('click', function () { cur = i; render(); });
      dots.appendChild(d);
    });
    top.appendChild(dots);
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
    nav.appendChild(p); nav.appendChild(el('span', 'pz-hint', 'Flechas del teclado o toca la pantalla · Esc para salir')); nav.appendChild(n);
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
