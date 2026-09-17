(function () {
  var storageKey = 'portfolio-visual-mode';
  var defaultMode = {
    layout: 'classic',
    theme: getSystemThemePreference()
  };

  function getSystemThemePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function isValidLayout(layout) {
    return layout === 'terminal' || layout === 'classic';
  }

  function isValidTheme(theme) {
    return theme === 'light' || theme === 'dark';
  }

  function readMode() {
    try {
      var savedMode = JSON.parse(window.localStorage.getItem(storageKey));
      if (savedMode && isValidLayout(savedMode.layout) && isValidTheme(savedMode.theme)) {
        return savedMode;
      }
    } catch (error) {
    }

    return {
      layout: defaultMode.layout,
      theme: defaultMode.theme
    };
  }

  function hasSavedMode() {
    try {
      var savedMode = JSON.parse(window.localStorage.getItem(storageKey));
      return Boolean(savedMode && isValidLayout(savedMode.layout) && isValidTheme(savedMode.theme));
    } catch (error) {
      return false;
    }
  }

  function applyMode(mode, persist) {
    var layout = isValidLayout(mode.layout) ? mode.layout : defaultMode.layout;
    var theme = isValidTheme(mode.theme) ? mode.theme : defaultMode.theme;
    var root = document.documentElement;
    var appliedMode = { layout: layout, theme: theme };

    root.dataset.layout = layout;
    root.dataset.theme = theme;

    if (persist) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(appliedMode));
      } catch (error) {
      }
    }

    window.dispatchEvent(new CustomEvent('portfolio-mode-change', {
      detail: appliedMode
    }));

    return appliedMode;
  }

  var currentMode = applyMode(readMode(), false);

  if (window.matchMedia) {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var handleSystemThemeChange = function (e) {
      try {
        if (!hasSavedMode()) {
          currentMode = applyMode({
            layout: currentMode.layout,
            theme: e.matches ? 'dark' : 'light'
          }, false);
        }
      } catch (error) {
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }

  window.portfolioTheme = {
    get: function () {
      return {
        layout: currentMode.layout,
        theme: currentMode.theme
      };
    },
    hasSavedMode: hasSavedMode,
    set: function (mode) {
      currentMode = applyMode({
        layout: mode && mode.layout ? mode.layout : currentMode.layout,
        theme: mode && mode.theme ? mode.theme : currentMode.theme
      }, true);
      return this.get();
    },
    setLayout: function (layout) {
      return this.set({ layout: layout, theme: currentMode.theme });
    },
    setTheme: function (theme) {
      return this.set({ layout: currentMode.layout, theme: theme });
    },
    toggleLayout: function () {
      var nextLayout = currentMode.layout === 'terminal' ? 'classic' : 'terminal';
      return this.setLayout(nextLayout);
    },
    toggleTheme: function () {
      var nextTheme = currentMode.theme === 'dark' ? 'light' : 'dark';
      return this.setTheme(nextTheme);
    },
    reset: function () {
      currentMode = applyMode(defaultMode, true);
      return this.get();
    }
  };
})();