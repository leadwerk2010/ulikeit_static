/**
 * U-Like-It Landing – Navigation, Scroll-Reveal, Parallax
 */

(function () {
  'use strict';

  // ---------- Mobile Nav ----------
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', !expanded);
    });
  }

  // ---------- Scroll Reveal (Intersection Observer) ----------
  var revealEls = document.querySelectorAll('.reveal');
  var revealOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  }, revealOptions);

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---------- Parallax ----------
  var parallaxEls = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    parallaxEls.forEach(function (el) {
      var rate = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      var rect = el.getBoundingClientRect();
      var centerY = rect.top + rect.height / 2;
      var viewportCenter = window.innerHeight / 2;
      var offset = (centerY - viewportCenter) * rate * 0.15;
      el.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    });
  }

  // ---------- Header: beim Scrollen fixieren (über Hero liegend, danach fest) ----------
  var header = document.querySelector('.site-header');
  if (header) {
    function updateHeaderScroll() {
      if (window.pageYOffset > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(updateHeaderScroll); }, { passive: true });
    updateHeaderScroll();
  }

  function onScroll() {
    requestAnimationFrame(updateParallax);
  }

  if (parallaxEls.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateParallax();
  }

  // ---------- Custom Cursor: oranger Kreis folgt Maus, Schatten läuft versetzt nach ----------
  var cursorEl = document.getElementById('custom-cursor');
  var cursorShadowEl = document.getElementById('custom-cursor-shadow');

  if (cursorEl && cursorShadowEl) {
    var mouseX = 0;
    var mouseY = 0;
    var shadowX = 0;
    var shadowY = 0;
    var lastMove = 0;
    var restThreshold = 120;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMove = Date.now();
      cursorEl.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
    }, { passive: true });

    function updateShadow() {
      var now = Date.now();
      if (now - lastMove > restThreshold) {
        shadowX = mouseX;
        shadowY = mouseY;
      } else {
        var ease = 0.1;
        shadowX += (mouseX - shadowX) * ease;
        shadowY += (mouseY - shadowY) * ease;
      }
      cursorShadowEl.style.transform = 'translate(' + shadowX + 'px, ' + shadowY + 'px)';
      requestAnimationFrame(updateShadow);
    }
    requestAnimationFrame(updateShadow);
  }

  document.body.classList.add('loaded');
})();
