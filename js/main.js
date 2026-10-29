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
    }, { threshold: 0.08, rootMargin: '0px 0px 4% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Header elevates once the hero scrolls past ---
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
        header.classList.remove('header-overlay');
      } else {
        header.classList.remove('scrolled');
        header.classList.add('header-overlay');
      }
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

  // --- Formspree-powered forms (hero quick form + main contact form) ---
  // Both post to the same Formspree endpoint set in each form's `action`.
  // Replace YOUR_FORM_ID in the HTML with your real Formspree form ID.
  function wireForm(formId, successId) {
    var form = document.getElementById(formId);
    if (!form) return;
    var success = successId ? document.getElementById(successId) : null;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      var endpoint = form.getAttribute('action');
      // If the Formspree endpoint hasn't been set yet, just show success locally.
      if (!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        showSuccess();
        return;
      }

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          showSuccess();
        } else {
          res.json().then(function (data) {
            var msg = (data && data.errors)
              ? data.errors.map(function (x) { return x.message; }).join(', ')
              : 'Something went wrong. Please try again, or call us directly.';
            resetButton();
            alert(msg);
          }).catch(function () {
            resetButton();
            alert('Something went wrong. Please try again, or call us directly.');
          });
        }
      }).catch(function () {
        resetButton();
        alert('Network error. Please try again, or call us directly.');
      });

      function showSuccess() {
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        if (submitBtn) submitBtn.textContent = 'Sent';
      }
      function resetButton() {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      }
    });
  }

  wireForm('leadForm', 'formSuccess');
  wireForm('heroForm', 'heroFormSuccess');
})();
