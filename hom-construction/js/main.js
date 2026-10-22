// HOM Construction — interactions
(function () {
  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

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
