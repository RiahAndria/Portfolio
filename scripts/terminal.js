(function () {
  var form = document.getElementById('terminalForm');
  var input = document.getElementById('terminalCommand');
  var output = document.getElementById('terminalOutput');
  var prompt = document.getElementById('terminalPrompt');

  if (!form || !input || !output) {
    return;
  }

  var siteData = null;
  var currentPath = [];
  var awaitingSudoPassword = false;

  var easterEggs = {
    'sudo hire me': 'Permission denied: candidate is clearly overqualified.',
    'sudo rm -rf/': 'nice try buddy',
    'sudo make me a sandwich': 'What? Make it yourself.',
    'git push origin main --force': 'Force push blocked. The portfolio has trust issues.',
    'sudo apt install creativity': 'Creativity is already installed and running.'
  };

  function addLine(text, className) {
    var line = document.createElement('p');
    line.className = className || 'terminal-response';
    line.textContent = text;
    output.appendChild(line);
  }

  function addCommandLine(command) {
    var line = document.createElement('p');
    var commandPrompt = document.createElement('span');
    var commandText = document.createElement('span');

    line.className = 'terminal-command-line';
    commandPrompt.className = 'terminal-command-prompt';
    commandPrompt.textContent = 'riah@portfolio:' + pathLabel() + '$ ';
    commandText.textContent = command;
    line.appendChild(commandPrompt);
    line.appendChild(commandText);
    output.appendChild(line);
  }

  function pathLabel() {
    return currentPath.length ? '~/' + currentPath.join('/') : '~';
  }

  function updatePrompt() {
    if (prompt) {
      prompt.textContent = 'riah@portfolio:' + pathLabel() + '$';
    }
  }

  function showSudoPasswordPrompt() {
    awaitingSudoPassword = true;
    input.type = 'password';
    prompt.textContent = '[sudo] password for riah:';
  }

  function finishSudoPasswordPrompt() {
    awaitingSudoPassword = false;
    input.type = 'text';
    updatePrompt();
    addLine('Permission denied.', 'terminal-error');
  }

  function projectIds() {
    return siteData ? Object.keys(siteData.projects) : [];
  }

  function currentProject() {
    if (currentPath[0] !== 'projects' || currentPath.length !== 2 || !siteData) {
      return null;
    }
    return siteData.projects[currentPath[1]] || null;
  }

  function listDirectory() {
    if (!currentPath.length) {
      return 'about.txt  formation.txt  skills.config  contact.txt\nskills/\nprojects/';
    }
    if (currentPath.length === 1 && currentPath[0] === 'skills') {
      return 'skills.config';
    }
    if (currentPath.length === 1 && currentPath[0] === 'projects') {
      return projectIds().map(function (id) { return id + '/'; }).join('\n');
    }
    if (currentProject()) {
      return 'about.txt  project.config';
    }
    return 'skills.config';
  }

  function fileContent(fileName) {
    if (!siteData) {
      return 'Loading portfolio data...';
    }

    var project = currentProject();
    if (fileName === 'about.txt' && project) {
      return JSON.stringify({ title: project.title, meta: project.meta, description: project.description, features: project.features }, null, 2);
    }
    if (fileName === 'project.config' && project) {
      return JSON.stringify({ type: project.type, stack: project.stack, status: project.status, link: project.link }, null, 2);
    }
    if (fileName === 'about.txt' && !currentPath.length) {
      return JSON.stringify({ title: siteData.site.title, owner: siteData.site.owner, role: siteData.home.hero.role, bio: siteData.home.hero.bio }, null, 2);
    }
    if (fileName === 'formation.txt' && !currentPath.length) {
      return JSON.stringify({ school: siteData.home.hero.school, level: siteData.home.hero.level }, null, 2);
    }
    if (fileName === 'skills.config' && (currentPath.length === 0 || currentPath[0] === 'skills')) {
      return JSON.stringify(siteData.home.skills, null, 2);
    }
    if (fileName === 'contact.txt' && !currentPath.length) {
      return JSON.stringify({ email: siteData.site.email, github: siteData.site.github, linkedin: siteData.site.linkedin }, null, 2);
    }
    return null;
  }

  function changeDirectory(target) {
    if (!target || target === '~' || target === '/') {
      currentPath = [];
      return null;
    }

    var nextPath = target.split('/').filter(Boolean);
    if (target === '..') {
      currentPath.pop();
      return null;
    }
    if (nextPath[0] === '~') {
      nextPath.shift();
    }
    var candidate = currentPath.slice();
    nextPath.forEach(function (part) {
      if (part === '..') candidate.pop();
      else if (part !== '.') candidate.push(part);
    });
    var valid = candidate.length === 1 && ['skills', 'projects'].indexOf(candidate[0]) >= 0;
    valid = valid || (candidate.length === 2 && candidate[0] === 'projects' && projectIds().indexOf(candidate[1]) >= 0);
    if (!valid && candidate.length) {
      return 'cd: no such directory: ' + target;
    }
    currentPath = candidate;
    return null;
  }

  function runCommand(rawCommand) {
    var normalizedCommand = rawCommand.trim().toLowerCase();
    if (easterEggs[normalizedCommand]) {
      if (normalizedCommand === 'sudo hire me') {
        addLine('[sudo] password for riah:');
        showSudoPasswordPrompt();
        return;
      }
      addLine(easterEggs[normalizedCommand]);
      return;
    }

    var parts = rawCommand.trim().split(/\s+/);
    var command = parts[0].toLowerCase();
    var argument = parts.slice(1).join(' ');

    if (command === 'clear') {
      output.innerHTML = '';
      return;
    }
    if (command === 'open' || command === 'exit') {
      window.location.href = 'index.html';
      return;
    }
    if (command === 'ls') {
      addLine(listDirectory());
      return;
    }
    if (command === 'cd') {
      var directoryError = changeDirectory(argument);
      if (directoryError) addLine(directoryError, 'terminal-error');
      updatePrompt();
      return;
    }
    if (command === 'cat') {
      var content = fileContent(argument);
      addLine(content || 'cat: ' + argument + ': No such file', content ? 'terminal-response' : 'terminal-error');
      return;
    }
    if (command === 'whoami') {
      addLine(siteData ? siteData.site.owner + '\n' + siteData.home.hero.role : 'Rianala Masinjaka Andriamananjara');
      return;
    }
    if (command === 'help') {
      addLine('Available commands:\n  help       Show this list\n  clear      Clear the terminal\n  ls         List the current directory\n  cd         Navigate through portfolio sections and projects\n  cat        Display a portfolio file as JSON\n  whoami     Display the current profile\n  easter egg Reveal hidden commands\n  open       Return to the portfolio terminal prompt\n  exit       Return to the portfolio');
      return;
    }
    if (normalizedCommand === 'easter egg') {
      addLine('Hidden commands:\n  sudo hire me\n  sudo rm -rf/\n  sudo make me a sandwich\n  git push origin main --force\n  sudo apt install creativity');
      return;
    }
    addLine('Command not found: ' + command + '. Type "help" for available commands.', 'terminal-error');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var rawCommand = input.value.trim();

    if (!rawCommand) {
      return;
    }

    if (awaitingSudoPassword) {
      input.value = '';
      finishSudoPasswordPrompt();
      return;
    }

    addCommandLine(input.value);
    input.value = '';
    runCommand(rawCommand);
  });

  var language = window.portfolioLanguage ? window.portfolioLanguage.get() : 'fr';
  fetch('content/content.' + language + '.json?v=' + Date.now(), { cache: 'no-store' })
    .then(function (response) { return response.json(); })
    .then(function (content) { siteData = content; })
    .catch(function () { addLine('Unable to load the selected content file.', 'terminal-error'); });
})();
