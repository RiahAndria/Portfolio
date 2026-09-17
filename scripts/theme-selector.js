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

  fetch('components/theme-selector.html?v=3')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Unable to load theme selector component');
      }
      return response.text();
    })
    .then(function (markup) {
      mount.innerHTML = markup;
      initializeSelector(mount.querySelector('#themeSelector'));
    })
    .catch(function () {
      mount.remove();
    });
})();