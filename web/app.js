(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll('section.page'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var side = document.getElementById('side');
  var menuBtn = document.querySelector('.menu-btn');

  function currentHash() {
    try { return decodeURIComponent(location.hash.slice(1)); } catch (e) { return location.hash.slice(1); }
  }

  // «Volver a la sesión»: se recuerda la sesión de la que se sale hacia un recurso
  // (herramienta, guía, rúbrica, material…) y se restaura al volver.
  var ORIGIN_KEY = 'ce40-origen';
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { /* navegador antiguo */ }
  var origin = null, currentPage = null;
  try { origin = JSON.parse(sessionStorage.getItem(ORIGIN_KEY) || 'null'); } catch (e) { origin = null; }
  function saveOrigin() {
    try { if (origin) sessionStorage.setItem(ORIGIN_KEY, JSON.stringify(origin)); else sessionStorage.removeItem(ORIGIN_KEY); } catch (e) { /* sin almacenamiento */ }
  }
  function isFicha(p) { return p && p.classList.contains('ficha'); }
  // páginas que no son «recursos»: navegar a ellas es cambiar de tema, no consultar algo
  function isNavPage(p) { return !p || p.id === 'inicio' || p.id === 'buscar' || /^c\d$/.test(p.id); }
  function fichaLabel(f) {
    var a = f.querySelector('.crumbs a');
    var course = a ? a.textContent.split('·')[0].trim() : '';
    return course + ' · S' + f.querySelector('.f-num b').textContent + ' · ' + f.querySelector('h1').textContent;
  }
  var backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'back-pill';
  backBtn.hidden = true;
  document.body.appendChild(backBtn);
  backBtn.addEventListener('click', function () { if (origin) { origin.viaButton = true; saveOrigin(); location.hash = origin.id; } });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.back-inline');
    if (b && origin) { e.preventDefault(); origin.viaButton = true; saveOrigin(); location.hash = origin.id; }
  });
  function updateBack(page) {
    var on = !!origin && !isFicha(page) && !isNavPage(page) && document.getElementById(origin.id);
    backBtn.hidden = !on;
    document.querySelectorAll('.back-inline').forEach(function (b) { b.hidden = !on; });
    if (!on) return;
    var label = '← Volver a ' + origin.label;
    backBtn.textContent = label;
    backBtn.style.setProperty('--c', 'var(--' + origin.course + ')');
    document.querySelectorAll('.back-inline').forEach(function (b) { b.textContent = '← Volver a la sesión'; b.title = label; });
  }
  function leaving(from, to) {
    if (!isFicha(from) || to === from) return;
    if (isFicha(to) || isNavPage(to)) { origin = null; saveOrigin(); return; }
    var tab = from.querySelector('.p-tabs [aria-selected="true"]');
    var pz = window.ProyectarSesion && window.ProyectarSesion.takeSlide ? window.ProyectarSesion.takeSlide() : null;
    origin = { id: from.id, course: from.getAttribute('data-course'), label: fichaLabel(from), scroll: window.scrollY,
               tab: tab ? tab.id : null, pz: pz };
    saveOrigin();
  }
  function restore(page) {
    if (!origin || page.id !== origin.id) return false;
    var o = origin;
    origin = null; saveOrigin();
    if (o.tab) { var t = document.getElementById(o.tab); if (t) t.click(); }
    // la página ya está visible: se coloca en el sitio al momento y otra vez un instante después,
    // por si el navegador mueve la vista al terminar de cambiar de página
    window.scrollTo(0, o.scroll || 0);
    setTimeout(function () { window.scrollTo(0, o.scroll || 0); }, 60);
    if (o.pz != null && o.viaButton && window.ProyectarSesion) window.ProyectarSesion.open(page, o.pz);
    return true;
  }

  function show(id, fromLoad) {
    var preset = null;
    if (id && id.indexOf('p-') === 0 && id.indexOf('.') > 0) { preset = id.slice(id.indexOf('.') + 1); id = id.slice(0, id.indexOf('.')); }
    var el = id ? document.getElementById(id) : null;
    if (el && el.tagName === 'DETAILS') el.open = true;  // un enlace a un desplegable lo abre
    var page = el && el.classList.contains('page') ? el : (el ? el.closest('section.page') : null);
    // herramienta: se carga al entrar en ella; un enlace a algo de dentro (su guía) solo la carga si aún no lo estaba
    if (page && page.classList.contains('pj-page') && window.Proyectables && (el === page || !window.Proyectables.isMounted(page.id.slice(2)))) {
      var tid = page.id.slice(2), pre = el === page ? (preset || '') : '';
      setTimeout(function () { window.Proyectables.open(tid, pre); }, 0);
    }
    if (!page) { page = document.getElementById('inicio'); el = null; }
    leaving(currentPage, page);
    if (origin && (isNavPage(page) || (isFicha(page) && page.id !== origin.id))) { origin = null; saveOrigin(); }
    currentPage = page;
    pages.forEach(function (p) { p.hidden = p !== page; });
    // vídeos: el de la página visible se carga al entrar y se descarga al salir (así deja de reproducirse)
    document.querySelectorAll('.vid-page iframe').forEach(function (f) {
      var want = f.closest('section.page') === page ? f.getAttribute('data-src') : '';
      if (want && f.getAttribute('src') !== want) f.setAttribute('src', want);
      else if (!want && f.hasAttribute('src')) f.removeAttribute('src');
    });
    var key = page.getAttribute('data-course') || page.getAttribute('data-nav-key') || page.id;
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === key); });
    var restored = restore(page);
    updateBack(page);
    if (restored) {
      /* la posición la pone restore() */
    } else if (el && el !== page) {
      requestAnimationFrame(function () { el.scrollIntoView({ block: 'start' }); });
    } else if (!fromLoad) {
      window.scrollTo(0, 0);
    }
    var h1 = page.querySelector('h1');
    document.title = (page.id === 'inicio' || !h1) ? 'Guía didáctica Código Escuela 4.0' : h1.textContent + ' · Código Escuela 4.0';
    closeMenu();
  }

  function closeMenu() {
    if (side) side.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn) menuBtn.addEventListener('click', function () {
    var open = !side.classList.contains('open');
    side.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  window.addEventListener('hashchange', function () { show(currentHash(), false); });
  show(currentHash(), true);

  // Vídeos: pantalla completa del reproductor
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-vfull]'); if (!b) return;
    var f = b.closest('section.page').querySelector('.vid-frame iframe');
    if (f && f.requestFullscreen) f.requestFullscreen().catch(function () {});
  });

  // Pestañas de propuestas
  document.querySelectorAll('.p-tabs').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role=tab]'));
    function select(t) {
      tabs.forEach(function (b) {
        var on = b === t;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        select(n); n.focus(); e.preventDefault();
      });
    });
  });

  // Imprimir la ficha: sale la propuesta elegida y, abiertas, las pistas y soluciones
  var printOpened = [];
  window.addEventListener('beforeprint', function () {
    printOpened = [];
    if (!isFicha(currentPage)) return;
    currentPage.querySelectorAll('details:not([open])').forEach(function (d) { d.open = true; printOpened.push(d); });
  });
  window.addEventListener('afterprint', function () {
    printOpened.forEach(function (d) { d.open = false; });
    printOpened = [];
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.pr-open')) window.print();
  });

  // Buscador de sesiones
  var q = document.getElementById('q');
  var list = document.getElementById('sr');
  var sum = document.getElementById('sr-sum');
  var fichas = Array.prototype.slice.call(document.querySelectorAll('section.ficha')).map(function (f) {
    return {
      id: f.id,
      course: f.getAttribute('data-course'),
      crumb: f.querySelector('.crumbs').textContent,
      title: f.querySelector('h1').textContent,
      num: f.querySelector('.f-num b').textContent,
      text: f.textContent.toLowerCase()
    };
  });
  var timer;
  if (q) q.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var term = q.value.trim().toLowerCase();
      if (!term) { if (location.hash === '#buscar') location.hash = 'inicio'; return; }
      var hits = fichas.filter(function (f) { return f.text.indexOf(term) !== -1; });
      sum.textContent = hits.length + (hits.length === 1 ? ' sesión contiene ' : ' sesiones contienen ') + '«' + q.value.trim() + '».';
      list.innerHTML = '';
      hits.forEach(function (f) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + f.id;
        a.style.setProperty('--c', 'var(--' + f.course + ')');
        a.innerHTML = '<span class="n">S' + f.num + '</span><span class="t"><b></b><small></small></span>';
        a.querySelector('b').textContent = f.title;
        a.querySelector('small').textContent = f.crumb;
        li.appendChild(a);
        list.appendChild(li);
      });
      if (location.hash !== '#buscar') location.hash = 'buscar'; else show('buscar', true);
    }, 180);
  });
})();
;(function () {
  // pictogramas de la página «El método» (los datos ya están en la web)
  document.querySelectorAll('img[data-picto]').forEach(function (i) {
    if (window.PICTO && window.PICTO[i.getAttribute('data-picto')]) i.src = window.PICTO[i.getAttribute('data-picto')];
  });
})();
