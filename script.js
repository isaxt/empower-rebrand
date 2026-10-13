(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile index overlay */
  var side = document.getElementById('side');
  var toggle = document.querySelector('.side__toggle');
  function setOpen(open) {
    side.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Index';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setOpen(!side.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && side.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
  var links = Array.prototype.slice.call(document.querySelectorAll('.side__nav a'));
  links.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });

  /* active chapter */
  var nav = document.querySelector('.side__nav');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  function activate(id) {
    links.forEach(function (a) { a.removeAttribute('aria-current'); });
    var a = map[id];
    if (!a) return;
    a.setAttribute('aria-current', 'true');
    var top = a.offsetTop - nav.offsetTop;
    if (top < nav.scrollTop || top + a.offsetHeight > nav.scrollTop + nav.clientHeight) {
      nav.scrollTo({ top: top - nav.clientHeight / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  if ('IntersectionObserver' in window) {
    var chapters = document.querySelectorAll('.chapter[id]');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) activate(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    chapters.forEach(function (c) { io.observe(c); });
  }
  activate('overview');

  /* old / new toggle */
  document.querySelectorAll('.compare').forEach(function (cmp) {
    var btns = cmp.querySelectorAll('.seg__btn');
    var sets = cmp.querySelectorAll('.compare__set');
    function show(name) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.set === name ? 'true' : 'false'); });
      sets.forEach(function (s) { s.classList.toggle('is-on', s.dataset.set === name); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.set); }); });
    show('new');
  });

  /* reveal */
  var rv = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('reveal'); ro.observe(el); }
    });
  }

  /* lightbox */
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var opener = null;
  document.addEventListener('click', function (e) {
    var z = e.target.closest('.zoom');
    if (z && z.dataset.full) {
      opener = z; lbImg.src = z.dataset.full; lbImg.alt = z.dataset.alt || '';
      if (lb.showModal) lb.showModal();
    } else if (e.target === lb || e.target.closest('.lightbox__close')) { lb.close(); }
  });
  lb.addEventListener('close', function () { lbImg.removeAttribute('src'); if (opener) opener.focus(); });
})();
