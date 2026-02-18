/* ============================================================
   U-like-it Version 3 — Script
   Mode entdecken. Stadt beleben.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Scroll Reveal (Intersection Observer) ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '-60px 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- Header Scroll Behavior ---------- */
  var header = document.getElementById('site-header');
  var scrollThreshold = 60;

  function handleHeaderScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  var headerTicking = false;
  window.addEventListener('scroll', function () {
    if (!headerTicking) {
      requestAnimationFrame(function () {
        handleHeaderScroll();
        headerTicking = false;
      });
      headerTicking = true;
    }
  });

  handleHeaderScroll();

  /* ---------- Mobile Navigation ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
      document.body.classList.toggle('nav-open', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Menü öffnen');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Tab Switching (How it works) ---------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('aria-controls');

      tabBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      tabPanels.forEach(function (p) {
        p.classList.remove('active');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ---------- Parallax Backgrounds ---------- */
  var parallaxElements = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    var scrollY = window.scrollY;
    var viewportHeight = window.innerHeight;
    var viewportCenter = scrollY + viewportHeight / 2;

    parallaxElements.forEach(function (el) {
      var rate = parseFloat(el.getAttribute('data-parallax')) || 0.2;
      var rect = el.getBoundingClientRect();
      var elCenter = scrollY + rect.top + rect.height / 2;
      var offset = (viewportCenter - elCenter) * rate;
      el.style.transform = 'translateY(' + offset + 'px)';
    });
  }

  if (parallaxElements.length > 0) {
    var parallaxTicking = false;
    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(function () {
          updateParallax();
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    });
    window.addEventListener('resize', updateParallax);
    updateParallax();
  }

  /* ---------- Scroll Progress Bar ---------- */
  var scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    function updateScrollProgress() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }
    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateScrollProgress);
    });
    updateScrollProgress();
  }

  /* ---------- Hero Scroll Effect (Scale / Parallax beim Scrollen) ---------- */
  var heroInner = document.getElementById('hero-inner');
  if (heroInner) {
    function updateHeroScroll() {
      var scrollY = window.scrollY;
      var vh = window.innerHeight;
      var maxScroll = vh * 0.5;
      var t = Math.min(scrollY / maxScroll, 1);
      var scale = 1 - t * 0.06;
      var y = scrollY * 0.15;
      heroInner.style.transform = 'translateY(' + y + 'px) scale(' + scale + ')';
      heroInner.style.opacity = String(1 - t * 0.12);
    }
    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateHeroScroll);
    });
    updateHeroScroll();
  }

  /* ---------- Custom Cursor ---------- */
  var isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    var cursor = document.getElementById('custom-cursor');
    var cursorShadow = document.getElementById('custom-cursor-shadow');

    if (cursor && cursorShadow) {
      var mouseX = 0;
      var mouseY = 0;
      var shadowX = 0;
      var shadowY = 0;
      var idleTimer = null;

      document.body.classList.add('cursor-active');

      document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';

        document.body.classList.remove('cursor-idle');

        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
          document.body.classList.add('cursor-idle');
        }, 120);
      });

      function animateShadow() {
        shadowX += (mouseX - shadowX) * 0.12;
        shadowY += (mouseY - shadowY) * 0.12;
        cursorShadow.style.left = shadowX + 'px';
        cursorShadow.style.top = shadowY + 'px';
        requestAnimationFrame(animateShadow);
      }

      animateShadow();
    }
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition =
          target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

})();
