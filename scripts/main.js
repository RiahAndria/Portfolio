document.documentElement.classList.add('js');

(function () {
  function assetPath(path) {
    return document.body.dataset.project && path && !path.startsWith('../') ? '../../' + path : path;
  }

  function renderGallery(gallery, images) {
    gallery.innerHTML = '';
    images.forEach(function (item) {
      var link = document.createElement('button');
      link.className = 'project-shot-link';
      link.type = 'button';
      if (item.video) {
        var video = document.createElement('video');
        video.className = 'project-shot project-shot-video';
        video.src = assetPath(item.video);
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.setAttribute('aria-label', item.caption || 'Vidéo du projet');
        link.appendChild(video);
      } else {
        var image = document.createElement('img');
        image.className = 'project-shot';
        image.src = assetPath(item.image);
        image.alt = item.caption || '';
        image.dataset.caption = item.caption || '';
        link.appendChild(image);
      }
      gallery.appendChild(link);
    });

    if (!images.length) {
      gallery.innerHTML = '<div class="project-shot">Images à ajouter depuis le fichier de contenu</div><div class="project-shot">Capture à ajouter</div><div class="project-shot">Capture à ajouter</div>';
    }
  }

  function renderProjectDetails(projectDescription, project, ui) {
    projectDescription.querySelectorAll('.project-extra').forEach(function (element) {
      element.remove();
    });

    var isClassicLayout = document.documentElement.dataset.layout === 'classic';

    if (isClassicLayout && ui && ui.projectPage) {
      var descriptionHeading = document.createElement('h3');
      descriptionHeading.className = 'project-description-heading';
      descriptionHeading.textContent = ui.projectPage.descriptionGeneral;
      projectDescription.querySelector('p').before(descriptionHeading);
    }

    if (project.context) {
      var context = document.createElement('div');
      context.className = 'project-extra project-context';
      context.innerHTML = '<span class="project-extra-command">$ cat context.txt</span>';
      if (isClassicLayout && ui && ui.projectPage) {
        context.dataset.classicTitle = ui.projectPage.context;
        context.insertAdjacentHTML('afterbegin', '<h3 class="project-classic-heading">' + ui.projectPage.context + '</h3>');
      }
      var contextText = document.createElement('p');
      contextText.textContent = project.context;
      context.appendChild(contextText);
      projectDescription.appendChild(context);
    }

    if (Array.isArray(project.features) && project.features.length) {
      var features = document.createElement('div');
      features.className = 'project-extra project-features';
      features.innerHTML = '<span class="project-extra-command">$ ls features/</span>';
      if (isClassicLayout && ui && ui.projectPage) {
        features.dataset.classicTitle = ui.projectPage.features;
        features.insertAdjacentHTML('afterbegin', '<h3 class="project-classic-heading">' + ui.projectPage.features + '</h3>');
      }
      var featureList = document.createElement('ul');
      project.features.forEach(function (feature) {
        var featureItem = document.createElement('li');
        featureItem.textContent = feature;
        featureList.appendChild(featureItem);
      });
      features.appendChild(featureList);
      projectDescription.appendChild(features);
    }

    if (Array.isArray(project.contributors) && project.contributors.length) {
      var contributors = document.createElement('div');
      contributors.className = 'project-extra project-contributors';
      contributors.innerHTML = '<span class="project-extra-command">$ cat contributors.txt</span>';
      if (isClassicLayout && ui && ui.projectPage) {
        contributors.dataset.classicTitle = ui.projectPage.contributors;
        contributors.insertAdjacentHTML('afterbegin', '<h3 class="project-classic-heading">' + ui.projectPage.contributors + '</h3>');
      }
      var contributorList = document.createElement('ul');
      project.contributors.forEach(function (contributor) {
        var contributorItem = document.createElement('li');
        var contributorName = document.createElement('span');
        contributorName.textContent = contributor.name;
        contributorItem.appendChild(contributorName);
        if (contributor.github) {
          var contributorLink = document.createElement('a');
          contributorLink.href = contributor.github;
          contributorLink.target = '_blank';
          contributorLink.rel = 'noopener';
          contributorLink.textContent = '[github]';
          contributorItem.appendChild(document.createTextNode(' '));
          contributorItem.appendChild(contributorLink);
        }
        contributorList.appendChild(contributorItem);
      });
      contributors.appendChild(contributorList);
      projectDescription.appendChild(contributors);
    }
  }

  function applyUiContent(ui) {
    if (!ui) {
      return;
    }

    document.documentElement.lang = ui.document.htmlLang;
    var descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.content = ui.document.description;
    }
    var projectPage = ui.projectPage;
    if (projectPage) {
      var projectDescriptionTitle = document.querySelector('.project-description-title');
      var projectGalleryTitle = document.querySelector('.project-page-section h2');
      var projectRefresh = document.querySelector('.project-refresh');
      var projectBack = document.querySelector('.project-back');
      var projectGithub = document.querySelector('.project-page-actions .flag-link');
      if (projectDescriptionTitle) projectDescriptionTitle.textContent = projectPage.about;
      if (projectGalleryTitle) projectGalleryTitle.textContent = projectPage.gallery;
      if (projectRefresh) projectRefresh.setAttribute('aria-label', projectPage.refresh);
      if (projectBack) projectBack.textContent = projectPage.back;
      if (projectGithub) {
        projectGithub.textContent = document.documentElement.dataset.layout === 'classic'
          ? (projectPage.source || projectPage.github)
          : projectPage.github;
      }
    }
    if (!document.querySelector('.nav')) {
      return;
    }
    document.querySelector('.skip-link').textContent = ui.navigation.skipToContent;
    document.querySelector('.nav').setAttribute('aria-label', ui.navigation.ariaLabel);
    document.querySelector('.nav-list a[href="#accueil"]').textContent = ui.navigation.home;
    document.querySelector('.nav-list a[href="#competences"]').textContent = ui.navigation.skills;
    document.querySelector('.nav-list a[href="#projets"]').textContent = ui.navigation.projects;
    document.getElementById('navToggle').setAttribute('aria-label', ui.navigation.openMenu);
    document.getElementById('settingsToggle').setAttribute('aria-label', ui.settings.open);
    document.getElementById('settingsToggle').title = ui.settings.title;
    document.getElementById('settingsTheme').textContent = ui.settings.theme;
    var languageControl = document.getElementById('settingsLanguage');
    if (languageControl) {
      languageControl.setAttribute('aria-label', ui.settings.languageToggle);
      var currentLanguage = window.portfolioLanguage ? window.portfolioLanguage.get() : 'fr';
      languageControl.querySelectorAll('[data-language]').forEach(function (option) {
        var isActive = option.dataset.language === currentLanguage;
        option.setAttribute('aria-checked', String(isActive));
        option.classList.toggle('is-active', isActive);
      });
    }
    document.querySelector('.settings-tip').textContent = ui.settings.tip;
    document.getElementById('intro').setAttribute('aria-label', ui.intro.ariaLabel);
    document.querySelector('.classic-profile-card').setAttribute('aria-label', ui.home.profileCardLabel);
    document.querySelector('.classic-profile-school').previousElementSibling.textContent = ui.home.profileSchool;
    document.querySelector('.classic-profile-level').previousElementSibling.textContent = ui.home.profileSpecialty;
    document.querySelector('.classic-profile-details div:nth-child(3) dt').textContent = ui.home.profileFocus;
    document.querySelector('.classic-profile-details div:nth-child(3) dd').textContent = ui.home.profileFocusValue;
    document.querySelector('.classic-profile-status').innerHTML = '<span></span> ' + ui.home.profileStatus;
    document.querySelector('.skills-config').setAttribute('aria-label', ui.home.skillsAriaLabel);
    document.querySelector('.config-window-bar > span:nth-child(2)').textContent = ui.home.skillsWindow;
    document.querySelector('.config-window-bar .config-status').textContent = ui.home.loaded;
  }

  function hydrateContent(content) {
    var site = content.site;
    var projectId = document.body.dataset.project;
    var project = projectId ? content.projects[projectId] : null;

    document.title = project ? project.title + ' - Portfolio' : site.title;
    applyUiContent(content.ui);

    var navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
      navBrand.firstChild.textContent = site.brand;
      navBrand.querySelector('span').textContent = site.brandSuffix;
    }
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      link.href = 'mailto:' + site.email;
    });
    document.querySelectorAll('a[href*="github.com"]').forEach(function (link) {
      link.href = site.github;
    });
    document.querySelectorAll('a[href*="linkedin.com"]').forEach(function (link) {
      link.href = site.linkedin;
    });
    var footerOwner = document.querySelector('footer > span:first-child');
    if (footerOwner) {
      footerOwner.textContent = '\u00a9 ' + site.year + ' - ' + site.owner;
    }

    if (project) {
      document.querySelector('.project-page-kicker').textContent = '$ project --open ' + projectId;
      document.querySelector('.project-page h1').textContent = project.title;
      document.querySelector('.project-page-meta').textContent = project.meta;
      if (document.documentElement.dataset.layout === 'classic') {
        var projectContainer = document.querySelector('.project-page > .container');
        if (!projectContainer.querySelector('.classic-project-back')) {
          var topBack = document.createElement('a');
          topBack.className = 'classic-project-back';
          topBack.href = '../../index.html#projets';
          topBack.innerHTML = '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i><span>' + content.ui.projectPage.back.replace(/^<\s*/, '') + '</span>';
          projectContainer.insertBefore(topBack, projectContainer.firstElementChild);
        }

        var existingSummary = projectContainer.querySelector('.classic-project-summary');
        if (existingSummary) {
          existingSummary.remove();
        }
        var summary = document.createElement('p');
        summary.className = 'classic-project-summary';
        summary.textContent = project.description;
        document.querySelector('.project-page-meta').after(summary);

        document.querySelector('.project-page-kicker').textContent = project.type === 'school_project'
          ? 'Projet scolaire'
          : project.type;

        var existingBadges = document.querySelector('.classic-project-badges');
        if (existingBadges) {
          existingBadges.remove();
        }
        var badges = document.createElement('div');
        badges.className = 'classic-project-badges';
        [
          { icon: 'fa-graduation-cap', label: content.ui.projectPage.type, value: project.type === 'school_project' ? content.ui.projectPage.type.replace(/^Type de projet$/, 'Scolaire') : project.meta.split(' — ')[0] },
          { label: content.ui.projectPage.stack, value: project.stack },
          { icon: 'fa-circle-check', label: content.ui.projectPage.status, value: content.ui.projectPage.status }
        ].forEach(function (item) {
          var badge = document.createElement('div');
          badge.className = 'classic-project-badge';
          badge.innerHTML = '<small>' + item.label + '</small><strong>' + (item.icon ? '<i class="fa-solid ' + item.icon + '" aria-hidden="true"></i> ' : '') + item.value + '</strong>';
          badges.appendChild(badge);
        });
        summary.after(badges);
      }
      var projectGithub = project.link && project.link[0] ? project.link[0].url : '';
      var projectGithubLink = document.querySelector('.project-page-actions .flag-link');
      if (projectGithubLink && projectGithub) {
        projectGithubLink.href = projectGithub;
      }
      document.querySelector('.project-readout').innerHTML = '<span>type = "' + project.type + '"</span><span>stack = "' + project.stack + '"</span><span>status = "' + project.status + '"</span>';
      var projectDescription = document.querySelector('.project-description');
      projectDescription.querySelector('p').textContent = project.description;
      renderProjectDetails(projectDescription, project, content.ui);
      renderGallery(document.querySelector('.project-gallery'), project.gallery);
      return;
    }

    var hero = content.home.hero;
    var isClassicLayout = document.documentElement.dataset.layout === 'classic';
    document.querySelector('.hero-kicker').firstChild.textContent = hero.command;
    document.querySelector('.hero h1').textContent = isClassicLayout ? content.ui.home.classicGreeting : hero.name;
    document.querySelector('.hero-role').textContent = hero.role;
    document.querySelector('.hero-school .prompt').textContent = hero.schoolCommand;
    document.querySelector('.hero-school .out:nth-of-type(2)').innerHTML = '&gt; <b>' + hero.school + '</b>';
    document.querySelector('.hero-school .out:nth-of-type(3)').textContent = '> ' + hero.level;
    document.querySelector('.hero-bio').textContent = hero.bio;
    var profileName = document.querySelector('.classic-profile-name');
    var profileRole = document.querySelector('.classic-profile-role');
    var profileSchool = document.querySelector('.classic-profile-school');
    var profileLevel = document.querySelector('.classic-profile-level');
    if (profileName) profileName.textContent = isClassicLayout ? hero.name : hero.name.replace(/^[^ ]+\s+/, '');
    if (profileRole) profileRole.textContent = hero.role;
    if (profileSchool) profileSchool.textContent = hero.school.replace(/^Ecole Nationale d'Informatique \(ENI\) /, 'ENI ');
    if (profileLevel) profileLevel.textContent = hero.level.replace(/Ingéniérie Logicielle & Systèmes d'Information/, 'ILSI');
    document.querySelector('.hero-gallery').dataset.images = hero.heroImages.join(',');
    document.querySelector('.hero-image-pane--left .hero-image-current').src = hero.heroImages[0];
    document.querySelector('.hero-image-pane--left .hero-image-next').src = hero.heroImages[0];
    document.querySelector('.hero-image-pane--right .hero-image-current').src = hero.heroImages[1] || hero.heroImages[0];
    document.querySelector('.hero-image-pane--right .hero-image-next').src = hero.heroImages[1] || hero.heroImages[0];

    var skills = content.home.skills;
    document.querySelector('#competences .section-head h2').innerHTML = '<span class="mark">##</span> ' + skills.title;
    document.querySelector('#competences .section-head p').textContent = skills.description;
    document.querySelector('.config-value').textContent = '"' + skills.profile + '"';
    var configValues = document.querySelectorAll('.config-list');
    var skillGroups = [
      { key: content.ui.home.skillGroups.languages, terminalKey: 'languages', values: skills.languages },
      { key: content.ui.home.skillGroups.tooling, terminalKey: 'tooling', values: skills.tooling },
      { key: content.ui.home.skillGroups.frameworks, terminalKey: 'frameworks', values: skills.frameworks },
      { key: content.ui.home.skillGroups.databases, terminalKey: 'databases', values: skills.databases }
    ];
    skillGroups.forEach(function (group, index) {
      var line = configValues[index].closest('.config-line');
      var skillMarkup = group.values.map(function (value) {
        var item = document.createElement('span');
        item.textContent = value;
        return item.outerHTML;
      }).join(isClassicLayout ? '' : ', ');

      configValues[index].innerHTML = isClassicLayout ? skillMarkup : '[' + skillMarkup + ']';
      line.querySelector('.config-key').textContent = isClassicLayout ? group.key : group.terminalKey;

      if (isClassicLayout) {
        line.dataset.skillCount = String(group.values.length);
        line.dataset.skillKey = group.key;
        line.dataset.skillId = group.terminalKey;
        line.style.setProperty('--skill-span', group.values.length >= 5 ? '2' : '1');
      } else {
        line.removeAttribute('data-skill-count');
        line.removeAttribute('data-skill-key');
        line.removeAttribute('data-skill-id');
        line.style.removeProperty('--skill-span');
      }
    });
    document.querySelector('.config-comment > span:last-child').textContent = skills.comment;
    document.querySelector('.config-preview img').src = skills.previewImage;
    document.querySelector('.config-preview figcaption').innerHTML = '<span>preview</span> / ' + skills.previewLabel;

    var projectContent = content.home.projects;
    document.querySelector('#projets .section-head h2').innerHTML = '<span class="mark">##</span> ' + projectContent.title;
    document.querySelector('#projets .section-head p').textContent = projectContent.description;
    var cards = Array.from(document.querySelectorAll('.project-card'));
    cards.forEach(function (card) {
      var id = card.dataset.detail.split('/').pop().replace('.html', '');
      var item = content.projects[id];
      if (!item) return;
      card.setAttribute('aria-label', content.ui.home.projectCardLabel.replace('{title}', item.title));
      card.querySelector('h4').textContent = item.title;
      card.querySelector('.project-status').textContent = item.meta;
      var cardGithubLink = card.querySelector('.project-links a');
      var cardGithub = item.link && item.link[0] ? item.link[0].url : '';
      if (cardGithubLink && cardGithub) {
        cardGithubLink.href = cardGithub;
      }
      var preview = card.querySelector('.project-preview');
      if (item.preview) {
        preview.innerHTML = '<img class="project-preview-image" src="' + item.preview + '" alt="">';
      }
    });
    projectContent.groups.forEach(function (group, index) {
      var groupElement = document.querySelectorAll('.projects-group')[index];
      groupElement.querySelector('h3').innerHTML = '<span class="mark">&gt;</span> ' + group.title;
    });
  }

  function start(content) {
  var intro = document.getElementById('intro');
  var siteContent = content ? content.site : null;
  var introOutput = document.getElementById('introOutput');
  var introStep = 0;
  var typingDelay = 140;
  var eraseDelay = 90;

    if (intro && siteContent) {
      intro.querySelector('.intro-prompt').textContent = siteContent.introPrompt;
    }

  function writeText(text, onComplete) {
    introOutput.textContent = '';
    var index = 0;

    function writeNext() {
      if (index >= text.length) {
        onComplete();
        return;
      }

      var character = document.createElement('span');
      character.className = 'intro-character';
      character.textContent = text[index] === ' ' ? '\u00a0' : text[index];
      introOutput.appendChild(character);
      index += 1;
      window.setTimeout(writeNext, typingDelay);
    }

    writeNext();
  }

  function eraseText(onComplete) {
    function eraseNext() {
      var characters = introOutput.querySelectorAll('.intro-character');

      if (!characters.length) {
        onComplete();
        return;
      }

      characters[characters.length - 1].remove();
      window.setTimeout(eraseNext, eraseDelay);
    }

    eraseNext();
  }

  function finishIntro() {
    if (!intro || introStep !== 1) {
      return;
    }

    introStep = 2;
    eraseText(function () {
      intro.classList.remove('is-erasing');
      intro.classList.add('is-command');

      writeText(siteContent ? siteContent.introCommand : 'sudo whoami', function () {
        window.setTimeout(function () {
          intro.classList.add('is-exiting');
          window.setTimeout(function () {
            intro.classList.add('is-complete');
            document.body.classList.remove('intro-active');
            window.dispatchEvent(new Event('portfolio-ready'));
            window.setTimeout(function () {
              intro.remove();
            }, 950);
          }, 650);
        }, 1000);
      });
    });
    intro.classList.add('is-erasing');
  }

  function blockIntroInteraction(event) {
    if (!intro || !document.body.classList.contains('intro-active')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  function showClickRipple(event) {
    if (intro && document.body.classList.contains('intro-active')) {
      return;
    }

    var ripple = document.createElement('span');
    ripple.className = 'intro-click-ripple';
    ripple.style.left = event.clientX + 'px';
    ripple.style.top = event.clientY + 'px';
    document.body.appendChild(ripple);
    window.setTimeout(function () {
      ripple.remove();
    }, 700);
  }

  window.addEventListener('pointerdown', showClickRipple);
  window.addEventListener('pointerdown', blockIntroInteraction, { capture: true, passive: false });
  window.addEventListener('wheel', blockIntroInteraction, { capture: true, passive: false });
  window.addEventListener('touchstart', blockIntroInteraction, { capture: true, passive: false });
  window.addEventListener('keydown', blockIntroInteraction, { capture: true, passive: false });

  var returningProject = window.sessionStorage.getItem('portfolio-return-project');
  var skipIntro = window.location.hash === '#projets' || Boolean(returningProject);
  var disableIntro = skipIntro || document.documentElement.dataset.layout === 'classic';

  if (intro && disableIntro) {
    intro.remove();
    intro = null;
  }

  if (skipIntro) {
    var projectsSection = document.getElementById('projets');
    document.documentElement.style.scrollBehavior = 'auto';
    if (projectsSection) {
      window.scrollTo(0, projectsSection.getBoundingClientRect().top + window.scrollY - 76);
    }
    window.setTimeout(function () {
      document.documentElement.style.scrollBehavior = '';
    }, 0);
  }

  if (intro) {
    document.body.classList.add('intro-active');
    intro.focus();
    introOutput.textContent = '';
    intro.style.setProperty('--intro-x', '50%');
    intro.style.setProperty('--intro-y', '50%');
    window.setTimeout(function () {
      if (introStep !== 0) {
        return;
      }

      introStep = 1;
      intro.classList.add('is-welcome');
      writeText(siteContent ? siteContent.introWelcome : 'welcome', function () {
        window.setTimeout(finishIntro, 350);
      });
    }, 650);
    intro.addEventListener('pointermove', function (event) {
      intro.style.setProperty('--intro-x', event.clientX + 'px');
      intro.style.setProperty('--intro-y', event.clientY + 'px');
    });
  }

  var toggle = document.getElementById('navToggle');
  var navList = document.getElementById('navList');
  var settingsToggle = document.getElementById('settingsToggle');
  var settingsPanel = document.getElementById('settingsPanel');
  var settingsTheme = document.getElementById('settingsTheme');
  var settingsLanguage = document.getElementById('settingsLanguage');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Ouvrir le menu');
      });
    });
  }

  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', function () {
      var isOpen = !settingsPanel.hidden;
      settingsPanel.hidden = isOpen;
      settingsToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.settings-menu')) {
        settingsPanel.hidden = true;
        settingsToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        settingsPanel.hidden = true;
        settingsToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (settingsTheme) {
    settingsTheme.addEventListener('click', function () {
      if (window.portfolioThemeSelector) {
        window.portfolioThemeSelector.open();
      }
      if (settingsPanel && settingsToggle) {
        settingsPanel.hidden = true;
        settingsToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (settingsLanguage) {
    settingsLanguage.querySelectorAll('[data-language]').forEach(function (option) {
      option.addEventListener('click', function () {
        if (!window.portfolioLanguage || option.dataset.language === window.portfolioLanguage.get()) {
          return;
        }
        window.portfolioLanguage.set(option.dataset.language);
        window.location.reload();
      });
    });
  }

  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-list a');

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  } else {
    sections.forEach(function (section) {
      section.classList.add('is-visible');
    });
  }

  var heroGallery = document.querySelector('.hero-gallery');
  if (heroGallery) {
    var heroImages = heroGallery.getAttribute('data-images').split(',').map(function (path) {
      return path.trim();
    }).filter(Boolean);
    var heroPanes = heroGallery.querySelectorAll('.hero-image-pane');
    var heroIndex = 0;

    if (heroImages.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.setInterval(function () {
        heroIndex = (heroIndex + 1) % heroImages.length;
        heroPanes.forEach(function (pane) {
          var nextImage = pane.querySelector('.hero-image-next');
          nextImage.src = heroImages[heroIndex];
          pane.classList.add('is-changing');
        });
        window.setTimeout(function () {
          heroPanes.forEach(function (pane) {
            var currentImage = pane.querySelector('.hero-image-current');
            var nextImage = pane.querySelector('.hero-image-next');
            currentImage.src = nextImage.src;
            pane.classList.remove('is-changing');
          });
        }, 1400);
      }, 7000);
    }
  }

  document.querySelectorAll('.flag-link').forEach(function (link) {
    link.addEventListener('click', function () {
      link.classList.remove('is-clicked');
      window.requestAnimationFrame(function () {
        link.classList.add('is-clicked');
      });
      window.setTimeout(function () {
        link.classList.remove('is-clicked');
      }, 220);
    });
  });

  document.querySelectorAll('.project-card[data-detail]').forEach(function (card) {
    if (returningProject && card.getAttribute('data-detail').endsWith(returningProject)) {
      card.style.viewTransitionName = 'project-card';
      card.classList.add('is-returning');
      window.sessionStorage.removeItem('portfolio-return-project');
    }

    function navigateToProject() {
      if (card.classList.contains('is-opening')) {
        return;
      }

      window.sessionStorage.setItem('portfolio-return-project', card.getAttribute('data-detail').split('/').pop());
      card.style.viewTransitionName = 'project-card';
      card.classList.add('is-opening');
      window.setTimeout(function () {
        window.location.href = card.getAttribute('data-detail');
      }, 460);
    }

    function openProject(event) {
      if (event.target.closest('a')) {
        return;
      }

      navigateToProject();
    }

    card.addEventListener('click', openProject);
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigateToProject();
      }
    });

    card.addEventListener('animationend', function (event) {
      if (event.animationName === 'project-card-return') {
        card.classList.remove('is-returning');
        card.style.viewTransitionName = '';
      }
    });
  });

  document.querySelectorAll('.project-back').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var projectPage = window.location.pathname.split('/').pop();
      window.sessionStorage.setItem('portfolio-return-project', projectPage);

      var projectMain = document.querySelector('.project-page');
      if (!projectMain || link.classList.contains('is-leaving')) {
        return;
      }

      event.preventDefault();
      link.classList.add('is-leaving');
      projectMain.classList.add('is-closing');
      window.setTimeout(function () {
        window.location.href = link.href;
      }, 420);
    });
  });

  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) {
      return;
    }

    var browserBackProject = window.sessionStorage.getItem('portfolio-return-project');
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.classList.remove('is-opening', 'is-returning');
      card.style.viewTransitionName = '';

      if (browserBackProject && card.getAttribute('data-detail').endsWith(browserBackProject)) {
        card.style.viewTransitionName = 'project-card';
        card.classList.add('is-returning');
        window.sessionStorage.removeItem('portfolio-return-project');
      }
    });

    var projectsSection = document.getElementById('projets');
    document.documentElement.style.scrollBehavior = 'auto';
    if (projectsSection) {
      window.scrollTo(0, projectsSection.getBoundingClientRect().top + window.scrollY - 76);
    }
    window.setTimeout(function () {
      document.documentElement.style.scrollBehavior = '';
    }, 0);
  });

  document.querySelectorAll('.project-shot-link').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var gallery = trigger.closest('.project-gallery');
      var images = Array.from(gallery.querySelectorAll('.project-shot-link img'));
      var currentIndex = images.indexOf(trigger.querySelector('img'));

      if (currentIndex < 0) {
        return;
      }

      var lightbox = document.createElement('dialog');
      lightbox.className = 'image-lightbox';
      lightbox.innerHTML = '<button class="image-lightbox-close" type="button" aria-label="Fermer">×</button><button class="image-lightbox-prev" type="button" aria-label="Image précédente">←</button><figure class="image-lightbox-figure"><figcaption class="image-lightbox-caption"></figcaption><img class="image-lightbox-image" alt=""></figure><button class="image-lightbox-next" type="button" aria-label="Image suivante">→</button>';
      document.body.appendChild(lightbox);
      lightbox.querySelector('button').addEventListener('click', function () { lightbox.close(); });
      var lightboxImage = lightbox.querySelector('.image-lightbox-image');
      var lightboxCaption = lightbox.querySelector('.image-lightbox-caption');
      var previousButton = lightbox.querySelector('.image-lightbox-prev');
      var nextButton = lightbox.querySelector('.image-lightbox-next');

      function showImage(index) {
        currentIndex = (index + images.length) % images.length;
        lightboxImage.src = images[currentIndex].src;
        lightboxImage.alt = images[currentIndex].alt;
        lightboxCaption.textContent = images[currentIndex].dataset.caption || images[currentIndex].alt;
      }

      previousButton.addEventListener('click', function () { showImage(currentIndex - 1); });
      nextButton.addEventListener('click', function () { showImage(currentIndex + 1); });
      lightbox.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (event.key === 'ArrowRight') showImage(currentIndex + 1);
      });
      lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
          lightbox.close();
        }
      });
      lightbox.addEventListener('close', function () { lightbox.remove(); });
      showImage(currentIndex);
      lightbox.showModal();
    });
  });

  document.querySelectorAll('.project-gallery').forEach(function (gallery) {
    var links = Array.from(gallery.querySelectorAll('.project-shot-link'));

    if (links.length <= 3) {
      return;
    }

    var overflowLink = links[2];
    var overflowLabel = document.createElement('span');
    overflowLabel.className = 'project-gallery-more';
    overflowLabel.textContent = '+' + (links.length - 3);
    overflowLink.appendChild(overflowLabel);
    overflowLink.classList.add('project-shot-link--more');
  });
  }

  var language = window.portfolioLanguage ? window.portfolioLanguage.get() : 'fr';
  var contentUrl = (document.body.dataset.project ? '../../content/content.' : 'content/content.') + language + '.json';

  fetch(contentUrl + '?v=' + Date.now(), { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Unable to load ' + contentUrl);
      }
      return response.json();
    })
    .then(function (content) {
      hydrateContent(content);
      window.dispatchEvent(new Event('portfolio-content-ready'));
      start(content);
    })
    .catch(function (error) {
      console.error('Portfolio content could not be loaded:', error);
      window.dispatchEvent(new Event('portfolio-content-ready'));
      document.body.classList.remove('intro-active');
      var introElement = document.getElementById('intro');
      if (introElement) {
        introElement.remove();
      }
      document.body.classList.add('content-load-error');
      document.querySelector('main').innerHTML = '<div class="content-error"><h1>Erreur de contenu</h1><p>Le fichier de contenu est vide ou invalide. Corrigez-le puis rechargez la page.</p></div>';
    });
})();
