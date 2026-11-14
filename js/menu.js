/* Згорнуте меню (до 1279 px): кнопка «Меню» / «Закрити».
   Закривається кліком по пункту, клавішею Esc і при розширенні вікна. */
(function () {
  var btn = document.querySelector('.burger');
  var nav = document.getElementById('mnav');
  if (!btn || !nav) return;
  var label = btn.querySelector('[data-i18n]');

  function text(key) {
    return window.SCM_I18N ? window.SCM_I18N.t(key) : (key === 'menuClose' ? 'Закрити' : 'Меню');
  }

  function setOpen(open, returnFocus) {
    btn.setAttribute('aria-expanded', String(open));
    nav.hidden = !open;
    if (label) {
      label.setAttribute('data-i18n', open ? 'menuClose' : 'menu');
      label.textContent = text(open ? 'menuClose' : 'menu');
    }
    if (!open && returnFocus) btn.focus();
  }

  btn.addEventListener('click', function () {
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });

  var wide = window.matchMedia('(min-width: 1280px)');
  var onWide = function () { if (wide.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);
})();
