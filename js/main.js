// HOM Construction — interactions
(function () {
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Enable animation styles only when motion is allowed.
  if (!prefersReduced) {
    document.documentElement.classList.add('js-anim');
  }

  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // --- Scroll reveals ---
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!prefersReduced && 'IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Header elevates once the hero scrolls past ---
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile nav
  var toggle = document.querySelector('.menu-toggle');
  var mnav = document.querySelector('.mobile-nav');
  if (toggle && mnav) {
    toggle.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      mnav.setAttribute('aria-hidden', !open);
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mnav.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // Lead form (front-end only; wire to email/CRM backend on launch)
  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // TODO on launch: POST to email endpoint, Formspree, or landing-page handler.
      var success = document.getElementById('formSuccess');
      if (success) success.hidden = false;
      form.querySelector('button[type="submit"]').disabled = true;
      success && success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
