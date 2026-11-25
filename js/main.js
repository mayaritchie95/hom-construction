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
      if (window.scrollY > 80) {
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

      // Custom email + phone validation (sets a friendly message, then native UI shows it)
      var emailField = form.querySelector('input[type="email"]');
      var phoneField = form.querySelector('input[type="tel"]');
      if (emailField) {
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        emailField.setCustomValidity(
          emailField.value && !emailRe.test(emailField.value.trim())
            ? 'Please enter a valid email address, e.g. name@example.com'
            : ''
        );
      }
      if (phoneField) {
        var digits = (phoneField.value || '').replace(/\D/g, '');
        phoneField.setCustomValidity(
          phoneField.value && (digits.length < 10 || digits.length > 11)
            ? 'Please enter a valid phone number (10 digits)'
            : ''
        );
      }

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

  // --- Alternating hero headline ---
  (function () {
    var phrases = document.querySelectorAll('.hero-rotator .hero-phrase');
    if (phrases.length < 2) return;
    var i = 0;
    setInterval(function () {
      phrases[i].classList.remove('is-active');
      i = (i + 1) % phrases.length;
      phrases[i].classList.add('is-active');
    }, 4500);
  })();

  // --- Gallery lightbox ---
  (function () {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCaption');
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    if (!items.length) return;
    var figures = items.map(function (fig) {
      var img = fig.querySelector('img');
      var cap = fig.querySelector('figcaption');
      return { src: img ? img.src : '', alt: img ? img.alt : '', cap: cap ? cap.textContent : '' };
    });
    var current = 0;

    function show(i) {
      current = (i + figures.length) % figures.length;
      var f = figures[current];
      lbImg.src = f.src; lbImg.alt = f.alt; lbCap.textContent = f.cap;
    }
    function open(i) {
      show(i);
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    items.forEach(function (fig, i) {
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.addEventListener('click', function () { open(i); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
    document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
  })();

  // --- Reviews carousel (auto-rotate, responsive, pause on hover) ---
  (function () {
    var track = document.getElementById('reviewsTrack');
    var dotsWrap = document.getElementById('reviewsDots');
    if (!track || !dotsWrap) return;
    var viewport = track.parentElement;
    var slides = Array.prototype.slice.call(track.children);
    var total = slides.length;
    var GAP = 22.4; // 1.4rem in px (approx; recalculated from computed style below)
    var page = 0, timer = null;

    function gapPx() {
      var g = parseFloat(getComputedStyle(track).gap);
      return isNaN(g) ? 22.4 : g;
    }
    function perView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 980) return 2;
      return 3;
    }
    function pageCount() { return Math.ceil(total / perView()); }

    function sizeSlides() {
      var pv = perView();
      var gap = gapPx();
      var vpW = viewport.clientWidth;
      var slideW = (vpW - gap * (pv - 1)) / pv;
      slides.forEach(function (s) { s.style.flex = '0 0 ' + slideW + 'px'; s.style.width = slideW + 'px'; });
      return { slideW: slideW, gap: gap, pv: pv };
    }

    function render() {
      var m = sizeSlides();
      var n = pageCount();
      if (page >= n) page = n - 1;
      if (page < 0) page = 0;
      var step = (m.slideW + m.gap) * m.pv;
      track.style.transform = 'translateX(-' + (page * step) + 'px)';
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle('active', i === page);
      });
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      var n = pageCount();
      for (var i = 0; i < n; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to review set ' + (i + 1));
        (function (idx) { b.addEventListener('click', function () { page = idx; render(); restart(); }); })(i);
        dotsWrap.appendChild(b);
      }
    }

    function next() { page = (page + 1) % pageCount(); render(); }
    function start() { if (!prefersReduced) timer = setInterval(next, 5000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    buildDots();
    render();
    start();

    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);

    var rT;
    window.addEventListener('resize', function () {
      clearTimeout(rT);
      rT = setTimeout(function () { buildDots(); render(); }, 150);
    });
  })();

  // Clear custom validation messages as the user types
  document.querySelectorAll('input[type="email"], input[type="tel"]').forEach(function (el) {
    el.addEventListener('input', function () { el.setCustomValidity(''); });
  });

  wireForm('leadForm', 'formSuccess');
  wireForm('heroForm', 'heroFormSuccess');
})();
