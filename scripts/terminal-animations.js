(function () {
  var characterDelay = 105;
  var formation = document.querySelector('.hero-school');
  var skillsSection = document.getElementById('competences');
  var skillsConfig = document.querySelector('.skills-config');
  var introReady = false;

  function typeCharacters(element, text, delay, onComplete) {
    element.textContent = '';
    var index = 0;

    function typeNext() {
      if (index >= text.length) {
        if (onComplete) {
          onComplete();
        }
        return;
      }

      var character = document.createElement('span');
      character.className = 'terminal-character';
      character.textContent = text[index] === ' ' ? '\u00a0' : text[index];
      element.appendChild(character);
      index += 1;
      window.setTimeout(typeNext, delay);
    }

    typeNext();
  }

  function revealFormation() {
    if (!formation || formation.classList.contains('is-terminal-started')) {
      return;
    }

    formation.classList.add('is-terminal-started');
    var command = formation.querySelector('.prompt');
    var outputLines = Array.from(formation.querySelectorAll('.out'));

    typeCharacters(command, '$ cat formation.txt', characterDelay, function () {
      outputLines.forEach(function (line, index) {
        window.setTimeout(function () {
          line.classList.add('is-terminal-visible');
        }, 120 + index * 110);
      });
    });
  }

  function revealSkills() {
    if (!skillsConfig || skillsConfig.classList.contains('is-terminal-started')) {
      return;
    }

    skillsConfig.classList.add('is-terminal-started');
    var command = skillsConfig.querySelector('.config-command');
    var lines = Array.from(skillsConfig.querySelectorAll('.config-line'));

    typeCharacters(command, '$ cat skills.config', 78, function () {
      lines.forEach(function (line, index) {
        window.setTimeout(function () {
          line.classList.add('is-terminal-visible');
        }, 90 + index * 65);
      });
    });
  }

  window.addEventListener('portfolio-ready', function () {
    if (introReady) {
      return;
    }

    introReady = true;
    window.setTimeout(revealFormation, 280);
  });

  if (!document.getElementById('intro')) {
    window.setTimeout(revealFormation, 280);
  }

  if (skillsSection && skillsConfig && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealSkills();
          observer.disconnect();
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .2 });

    observer.observe(skillsSection);
  } else {
    revealSkills();
  }
})();
