/* Перемикач мови UA / EN.
   - тексти: елементи з data-i18n="ключ";
   - атрибути: data-i18n-attr="aria-label:ключ;title:ключ";
   - словники: window.SCM_TEXTS (js/texts.js).
   Мова береться з ?lang=en в адресі, інакше із запам'ятованого вибору, інакше — українська.
   Після зміни мови на document надсилається подія "scm:langchange" (detail.lang). */
(function () {
  var TEXTS = window.SCM_TEXTS;
  if (!TEXTS) return;
  var KEY = 'scm-lang';
  var current = 'uk';

  function t(key, lang) {
    var dict = TEXTS[lang || current] || TEXTS.uk;
    return key in dict ? dict[key] : TEXTS.uk[key];
  }

  function apply(lang) {
    if (!TEXTS[lang]) lang = 'uk';
    current = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length === 2) el.setAttribute(p[0], t(p[1]));
      });
    });
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
    document.title = lang === 'en'
      ? 'Tours, exhibits and courses — Software and Computer Museum'
      : 'Екскурсії, експонати й курси — Software and Computer Museum';

    document.dispatchEvent(new CustomEvent('scm:langchange', { detail: { lang: lang } }));
  }

  function setLang(lang) {
    apply(lang);
    try { localStorage.setItem(KEY, lang); } catch (e) { /* приватний режим — не запам'ятовуємо */ }
    try {
      var url = new URL(window.location.href);
      if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    } catch (e) { /* старий браузер — адреса не змінюється */ }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lang]');
    if (btn) setLang(btn.getAttribute('data-lang'));
  });

  var initial = 'uk';
  try {
    var fromUrl = new URLSearchParams(window.location.search).get('lang');
    var saved = localStorage.getItem(KEY);
    initial = fromUrl === 'en' || fromUrl === 'uk' ? fromUrl : (saved || 'uk');
  } catch (e) { /* без доступу до сховища — українська */ }

  window.SCM_I18N = { t: function (key) { return t(key); }, lang: function () { return current; }, set: setLang };
  if (initial !== 'uk') apply(initial);
})();
