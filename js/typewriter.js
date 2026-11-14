/* Друк заголовка першого екрана по літерах.
   Повний заголовок завжди є в розмітці: для читачів екрана (.sr-only), для місця (.ghost)
   і в самому .typed-text. Тому без JavaScript і при prefers-reduced-motion
   заголовок просто видно одразу. При зміні мови друк зупиняється і показується повний текст. */
(function () {
  var el = document.querySelector('.hero-title .typed-text');
  if (!el) return;
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  } catch (e) { return; }

  var full = el.textContent;
  var n = 0;
  el.textContent = '';
  var timer = setInterval(function () {
    n += 1;
    el.textContent = full.slice(0, n);
    if (n >= full.length) stop();
  }, 55);

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  document.addEventListener('scm:langchange', function () {
    // i18n.js уже поставив повний текст новою мовою — лишаємо його.
    if (timer) stop();
  });
})();
