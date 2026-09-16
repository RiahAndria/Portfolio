document.documentElement.classList.add('js');

(function () {
  var intro = document.getElementById('intro');
  var introOutput = document.getElementById('introOutput');
  var introStep = 0;
  var typingDelay = 140;
  var eraseDelay = 90;

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

      writeText('sudo whoami', function () {
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

  if (intro && skipIntro) {
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
      writeText('welcome', function () {
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
})();
