/**
 * U like it - Static Site JavaScript
 * Minimal, functional JS preserving all original behaviors
 */

(function () {
  'use strict';

  /* =========================================================================
     1. STICKY HEADER - Show/hide on scroll
     ========================================================================= */
  const header = document.getElementById('site-header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;

    if (scrollY <= 0) {
      header.classList.add('c-nav__header--top');
      header.classList.remove('c-nav__header--visible');
      header.style.background = 'linear-gradient(180deg, #252d2d80 42.71%, #252d2d00)';
    } else if (scrollY > headerHeight) {
      if (scrollY < lastScrollY) {
        header.classList.add('c-nav__header--visible');
        header.classList.remove('c-nav__header--top');
        header.style.background = '';
      } else {
        header.classList.remove('c-nav__header--visible');
        header.classList.remove('c-nav__header--top');
      }
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Initial state: show header at top with transparent bg
  header.classList.add('c-nav__header--top');
  header.style.background = 'linear-gradient(180deg, #252d2d80 42.71%, #252d2d00)';

  /* =========================================================================
     2. MOBILE MENU
     ========================================================================= */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  let mobileMenuOpen = false;

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileMenuOpen = !mobileMenuOpen;
      if (mobileMenuOpen) {
        document.body.classList.add('body--no-scroll');
        // Create mobile menu overlay
        let overlay = document.getElementById('mobile-menu-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'mobile-menu-overlay';
          overlay.style.cssText = 'position:fixed;inset:0;background:#f9f3f0;z-index:50;padding:calc(var(--header-height,72px) + 2rem) 2rem 2rem;overflow-y:auto;animation:fadeIn .24s ease;';
          overlay.innerHTML = `
            <nav class="flex flex-col gap-24">
              <a href="#" class="text-h3" style="color:var(--theme-heading-color-light)">DIE APP</a>
              <a href="#" class="text-h3" style="color:var(--theme-heading-color-light)">UNTERNEHMENSLÖSUNGEN</a>
              <a href="#" class="text-h3" style="color:var(--theme-heading-color-light)">ÜBER UNS</a>
              <a href="#" class="text-h3" style="color:var(--theme-heading-color-light)">Über Lebensmittelrettung</a>
              <div class="flex flex-col gap-16 mt-32">
                <button class="btn btn--primary-base btn--primary" type="button" style="width:100%;">APP HERUNTERLADEN</button>
                <a href="https://store.toogoodtogo.com/onboarding" target="_blank" class="btn btn--primary-base btn--primary" style="justify-content:center;">UNTERNEHMEN REGISTRIEREN</a>
                <a href="https://store.toogoodtogo.com/login" target="_blank" class="c-nav__links-item" style="text-align:center;">MyStore anmelden</a>
              </div>
            </nav>
          `;
          document.body.appendChild(overlay);
        }
        overlay.style.display = 'block';
        // Change icon to X
        mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
      } else {
        closeMobileMenu();
      }
    });
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
    document.body.classList.remove('body--no-scroll');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay) overlay.style.display = 'none';
    if (mobileMenuBtn) {
      mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>';
    }
  }

  /* =========================================================================
     3. STEPS CAROUSEL (translate3d sliding)
     ========================================================================= */
  var track = document.getElementById('steps-track');
  var controls = document.getElementById('steps-controls');
  var mainImage = document.getElementById('steps-main-image');
  if (track && controls) {
    var slides = track.querySelectorAll('.c-steps-section__slide');
    var dots = controls.querySelectorAll('.c-carousel-indicator__dot');
    var prevBtn = controls.querySelector('.c-steps-prev');
    var nextBtn = controls.querySelector('.c-steps-next');
    var currentSlide = 0;
    var totalSlides = slides.length;
    var autoplayInterval;

    function goToSlide(index) {
      if (index < 0) index = 0;
      if (index >= totalSlides) index = totalSlides - 1;
      currentSlide = index;
      track.style.transform = 'translate3d(-' + (index * 100) + '%, 0, 0)';

      /* Step 3 uses different main image */
      if (mainImage) {
        mainImage.src = index === 2 ? 'images/step-3-main.png' : 'images/step-main.png';
      }

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });

      prevBtn.disabled = index === 0;
      prevBtn.style.opacity = index === 0 ? '0.3' : '';
      nextBtn.disabled = index === totalSlides - 1;
      nextBtn.style.opacity = index === totalSlides - 1 ? '0.3' : '';
    }

    prevBtn.addEventListener('click', function () {
      goToSlide(currentSlide - 1);
      resetAutoplay();
    });

    nextBtn.addEventListener('click', function () {
      goToSlide(currentSlide + 1);
      resetAutoplay();
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var slideIndex = parseInt(this.getAttribute('data-slide'));
        goToSlide(slideIndex);
        resetAutoplay();
      });
    });

    function autoplay() {
      autoplayInterval = setInterval(function () {
        var next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
      }, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      autoplay();
    }

    goToSlide(0);
    autoplay();
  }

  /* =========================================================================
     3b. SOLUTIONS TILES HOVER – swap shared images
     ========================================================================= */
  var solutionsMainImg = document.getElementById('solutions-main-image');
  var solutionsSubImg = document.getElementById('solutions-sub-image');
  var solutionsTiles = document.querySelectorAll('.solutions-tiles .c-tile[data-main][data-sub]');
  var defaultMain = 'images/tile1-main.png';
  var defaultSub = 'images/tile1-sub.png';

  if (solutionsMainImg && solutionsSubImg && solutionsTiles.length) {
    solutionsTiles.forEach(function (tile) {
      tile.addEventListener('mouseenter', function () {
        solutionsMainImg.src = this.getAttribute('data-main');
        solutionsSubImg.src = this.getAttribute('data-sub');
      });
      tile.addEventListener('mouseleave', function () {
        solutionsMainImg.src = defaultMain;
        solutionsSubImg.src = defaultSub;
      });
    });
  }

  /* =========================================================================
     4. BAG SECTION SCROLL ANIMATION
     ========================================================================= */
  const bagSection = document.getElementById('bag-section');
  if (bagSection) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          bagSection.classList.remove('animated--not-started');
          observer.unobserve(bagSection);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(bagSection);
  }

  /* =========================================================================
     4b. PARALLAX SECTION (fixed bg, footer gibi)
     ========================================================================= */
  const parallaxSection = document.querySelector('.c-parallax-section');
  if (parallaxSection) {
    const parallaxBg = parallaxSection.querySelector('.c-parallax-section__bg');
    if (parallaxBg) {
      function updateParallaxSection() {
        const rect = parallaxSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const inView = rect.bottom > 0 && rect.top < viewportHeight;
        if (inView) {
          parallaxBg.classList.add('is-fixed');
          parallaxSection.classList.add('is-parallax-active');
        } else {
          parallaxBg.classList.remove('is-fixed');
          parallaxSection.classList.remove('is-parallax-active');
        }
      }
      window.addEventListener('scroll', function () {
        requestAnimationFrame(updateParallaxSection);
      }, { passive: true });
      updateParallaxSection();
    }
  }

  /* =========================================================================
     5. FOOTER PARALLAX
     ========================================================================= */
  const footer = document.querySelector('.c-footer');
  if (footer) {
    const footerBack = footer.querySelector('.c-footer__back');
    const footerMain = footer.querySelector('.c-footer__main');

    if (footerBack && footerMain) {
      function updateParallax() {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (footerRect.bottom > 0 && footerRect.top < viewportHeight) {
          const progress = 1 - (footerRect.bottom / (viewportHeight + footerRect.height));
          footerBack.style.position = 'fixed';
          footerBack.style.bottom = '0';
          footerBack.style.left = '0';
          footerBack.style.right = '0';
          footerMain.style.position = 'fixed';
          footerMain.style.bottom = '0';
          footerMain.style.left = '0';
          footerMain.style.right = '0';
          footerMain.style.height = getComputedStyle(footer).getPropertyValue('--footer-parallax-height');
        }
      }

      window.addEventListener('scroll', function () {
        requestAnimationFrame(updateParallax);
      }, { passive: true });
      updateParallax();
    }
  }

  /* =========================================================================
     6. UTILITY STYLES (injected)
     ========================================================================= */
  const utilStyle = document.createElement('style');
  utilStyle.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    body.body--no-scroll { overflow: hidden; }
    .text-h3 {
      font-size: var(--h3-size);
      font-family: Korolev, Verdana, Arial Black, Arial, sans-serif;
      font-weight: 900;
      text-decoration: none;
      text-transform: uppercase;
    }
  `;
  document.head.appendChild(utilStyle);

  /* =========================================================================
     7. COOKIE CONSENT BANNER
     ========================================================================= */
  var coiOverlay = document.getElementById('coiOverlay');
  var showDetailsBtn = document.getElementById('show_details');
  var hideDetailsBtn = document.getElementById('hide_details');
  var acceptAllBtn = document.getElementById('acceptAllButton');
  var declineBtn = document.getElementById('declineButton');
  var consentGroup = document.querySelector('.coi-banner-consent-group');

  function showCookieBanner() {
    if (coiOverlay && !localStorage.getItem('cookieConsent')) {
      coiOverlay.style.display = 'flex';
      coiOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  function hideCookieBanner() {
    if (coiOverlay) {
      coiOverlay.style.display = 'none';
      coiOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  if (showDetailsBtn && hideDetailsBtn && consentGroup) {
    consentGroup.style.display = 'none';

    showDetailsBtn.addEventListener('click', function () {
      consentGroup.style.display = 'flex';
      showDetailsBtn.style.display = 'none';
      hideDetailsBtn.style.display = 'inline';
    });

    hideDetailsBtn.addEventListener('click', function () {
      consentGroup.style.display = 'none';
      hideDetailsBtn.style.display = 'none';
      showDetailsBtn.style.display = 'inline';
    });
  }

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', function () {
      localStorage.setItem('cookieConsent', 'all');
      hideCookieBanner();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function () {
      localStorage.setItem('cookieConsent', 'necessary');
      hideCookieBanner();
    });
  }


  /* =========================================================================
     8. HERO VIDEO SEQUENCE (Image -> Video -> Image)
     ========================================================================= */
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    // Wait 1.5 seconds (1500ms) before playing
    setTimeout(() => {
      heroVideo.style.opacity = '1';
      heroVideo.play().catch(err => console.log('Video play prevented:', err));
    }, 1500);

    // When video ends, hide it again
    heroVideo.addEventListener('ended', () => {
      heroVideo.style.opacity = '0';
    });
  }

  /* =========================================================================
     9. HERO TEXT CAROUSEL
     ========================================================================= */
  const heroTextElement = document.getElementById('hero-text-carousel');
  if (heroTextElement) {
    const phrases = [
      "RETTE DEINE INNENSTADT DEAL FÜR DEAL",
      "DEIN DEAL UM DIE ECKE SOFORT",
      "DIE KÜCHE HAT NOCH WAS ÜBRIG SCHNAPP’S DIR"
    ];
    let phraseIndex = 0;

    // Apply strict transition styles
    heroTextElement.style.transition = 'opacity 0.5s ease-in-out';
    heroTextElement.style.opacity = '1';

    setInterval(() => {
      // Fade out
      heroTextElement.style.opacity = '0';

      setTimeout(() => {
        // Change text
        phraseIndex = (phraseIndex + 1) % phrases.length;
        heroTextElement.textContent = phrases[phraseIndex];
        // Fade in
        heroTextElement.style.opacity = '1';
      }, 1000); // Wait for fade out to complete (0.5s)
    }, 2750); // 2000ms visible + 500ms transition
  }

  setTimeout(showCookieBanner, 500);

})();
