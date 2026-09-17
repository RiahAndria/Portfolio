(function () {
  var mount = document.getElementById('themeSelectorMount');

  if (!mount || !window.portfolioTheme) {
    return;
  }

  function initializeSelector(selector) {
    function closeTerminalIntroForClassicMode() {
      if (window.portfolioTheme.get().layout !== 'classic') {
        return;
      }

      var intro = document.getElementById('intro');
      if (intro) {
        intro.remove();
      }
      document.body.classList.remove('intro-active');
    }

    function closeSelector() {
      selector.hidden = true;
      document.body.classList.remove('theme-selector-active');
    }

    function openSelector() {
      selector.hidden = false;
      document.body.classList.add('theme-selector-active');
      var firstOption = selector.querySelector('.theme-selector-option');
      if (firstOption) {
        firstOption.focus();
      }
    }

    window.portfolioThemeSelector = {
      open: openSelector,
      close: closeSelector
    };

    if (window.portfolioTheme.hasSavedMode()) {
      closeSelector();
    } else {
      openSelector();
    }

    selector.querySelectorAll('[data-layout][data-theme]').forEach(function (option) {
      option.addEventListener('click', function () {
        window.portfolioTheme.set({
          layout: option.dataset.layout,
          theme: option.dataset.theme
        });
        window.location.reload();
      });
    });
  }

  function applySelectorLocale(selector, ui) {
    if (!ui || !ui.themeSelector) {
      return;
    }

    var labels = ui.themeSelector;
    selector.setAttribute('aria-label', labels.ariaLabel);
    selector.querySelector('.theme-selector-kicker').textContent = labels.kicker;
    selector.querySelector('#themeSelectorTitle').textContent = labels.title;
    selector.querySelector('.theme-option-root .theme-option-name').firstChild.textContent = labels.root;
    selector.querySelector('.theme-option-root .theme-option-desc').textContent = labels.rootDescription;
    selector.querySelector('.theme-option-zenith .theme-option-name').textContent = labels.zenith;
    selector.querySelector('.theme-option-zenith .theme-option-desc').textContent = labels.zenithDescription;
    selector.querySelector('.theme-option-eclipse .theme-option-name').textContent = labels.eclipse;
    selector.querySelector('.theme-option-eclipse .theme-option-desc').textContent = labels.eclipseDescription;
  }

  fetch('components/theme-selector.html?v=3')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Unable to load theme selector component');
      }
      return response.text();
    })
    .then(function (markup) {
      mount.innerHTML = markup;
      var selector = mount.querySelector('#themeSelector');
      initializeSelector(selector);
      var language = window.portfolioLanguage ? window.portfolioLanguage.get() : 'fr';
      return fetch('content/content.' + language + '.json?v=' + Date.now(), { cache: 'no-store' })
        .then(function (response) { return response.json(); })
        .then(function (content) { applySelectorLocale(selector, content.ui); });
    })
    .catch(function () {
      mount.remove();
    });
})();