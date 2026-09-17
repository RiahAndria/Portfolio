(function () {
  var prompt = document.getElementById('navTerminalInput');
  var command = '';

  if (!prompt) {
    return;
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

    if (event.key === 'Enter') {
      if (command.trim().toLowerCase() === 'open') {
        window.location.href = 'terminal.html';
      }
      if (command.trim().toLowerCase() === 'theme' && window.portfolioThemeSelector) {
        window.portfolioThemeSelector.open();
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
