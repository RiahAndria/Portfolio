(function () {
  var prompt = document.getElementById('navTerminalInput');
  var commandGuide = document.getElementById('commandGuide');
  var command = '';

  if (!prompt) {
    return;
  }

  function openCommandGuide() {
    if (commandGuide && typeof commandGuide.showModal === 'function') {
      commandGuide.showModal();
    }
  }

  function reloadWithLanguage(language) {
    if (window.portfolioLanguage && ['fr', 'en'].indexOf(language) >= 0) {
      window.portfolioLanguage.set(language);
      window.location.reload();
    }
  }

  function reloadWithTheme(themeName) {
    var themes = {
      root: { layout: 'terminal', theme: 'dark' },
      zenith: { layout: 'classic', theme: 'light' },
      eclipse: { layout: 'classic', theme: 'dark' }
    };
    var theme = themes[themeName];
    if (theme && window.portfolioTheme) {
      window.portfolioTheme.set(theme);
      window.location.reload();
    }
  }

  function navigateToSection(section) {
    var sections = {
      home: 'accueil',
      skill: 'competences',
      skills: 'competences',
      pjts: 'projets',
      projects: 'projets'
    };
    if (sections[section]) {
      window.location.hash = sections[section];
    }
  }

  function runShortcut(rawCommand) {
    var parts = rawCommand.trim().toLowerCase().split(/\s+/);
    var commandToken = parts[0];
    var hyphenIndex = commandToken.indexOf('-');
    var baseCommand = hyphenIndex > 0 ? commandToken.slice(0, hyphenIndex) : commandToken;
    var argument = hyphenIndex > 0 ? commandToken.slice(hyphenIndex + 1) : parts[1];
    var themeAliases = { '01': 'root', root: 'root', '02': 'zenith', zenith: 'zenith', '03': 'eclipse', eclipse: 'eclipse' };

    if (baseCommand === 'theme') {
      if (argument && themeAliases[argument]) {
        reloadWithTheme(themeAliases[argument]);
      } else if (window.portfolioThemeSelector) {
        window.portfolioThemeSelector.open();
      }
      return true;
    }
    if (baseCommand === 'lang' && argument) {
      reloadWithLanguage(argument);
      return true;
    }
    if (['home', 'skill', 'skills', 'pjts', 'projects'].indexOf(baseCommand) >= 0) {
      navigateToSection(baseCommand);
      return true;
    }
    return false;
  }

  var commandGuideClose = document.getElementById('commandGuideClose');
  if (commandGuideClose && commandGuide) {
    commandGuideClose.addEventListener('click', function () {
      commandGuide.close();
    });
    commandGuide.addEventListener('click', function (event) {
      if (event.target === commandGuide) {
        commandGuide.close();
      }
    });
  }

  function isEditableTarget(target) {
    return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
  }

  document.addEventListener('keydown', function (event) {
    if (isEditableTarget(event.target) || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (event.key === 'Backspace') {
      command = command.slice(0, -1);
      prompt.textContent = command;
      return;
    }

    if (event.key === 'Escape') {
      command = '';
      prompt.textContent = '';
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      var normalizedCommand = command.trim().toLowerCase();
      if (normalizedCommand === 'open') {
        window.location.href = 'terminal.html';
      }
      if (runShortcut(normalizedCommand)) {
        command = '';
        prompt.textContent = '';
        return;
      }
      if (['command', 'commands', 'commande', 'commandes', 'shortcuts'].indexOf(normalizedCommand) >= 0) {
        window.setTimeout(openCommandGuide, 0);
      }
      command = '';
      prompt.textContent = '';
      return;
    }

    if (event.key.length === 1) {
      command += event.key;
      prompt.textContent = command;
    }
  });
})();
