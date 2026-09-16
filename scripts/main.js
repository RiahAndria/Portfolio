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
          intro.classList.add('is-complete');
          document.body.classList.remove('intro-active');
          window.dispatchEvent(new Event('portfolio-ready'));
          window.setTimeout(function () {
            intro.remove();
          }, 950);
        }, 1000);
      });
    });
    intro.classList.add('is-erasing');
  }

  function advanceIntro(event) {
    if (!intro || introStep !== 1) {
      return;
    }

    event.preventDefault();
    finishIntro();
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
      writeText('welcome', function () {});
    }, 650);
    intro.addEventListener('pointermove', function (event) {
      intro.style.setProperty('--intro-x', event.clientX + 'px');
      intro.style.setProperty('--intro-y', event.clientY + 'px');
    });
    intro.addEventListener('pointerdown', function (event) {
      var ripple = document.createElement('span');
      ripple.className = 'intro-click-ripple';
      ripple.style.left = event.clientX + 'px';
      ripple.style.top = event.clientY + 'px';
      intro.appendChild(ripple);
      window.setTimeout(function () {
        ripple.remove();
      }, 700);
    });
    window.addEventListener('pointerdown', advanceIntro, { capture: true, passive: false });
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
    var heroPanes = heroGallery.querySelectorAll('.hero-image-pane img');
    var heroIndex = 0;

    if (heroImages.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.setInterval(function () {
        heroIndex = (heroIndex + 1) % heroImages.length;
        heroPanes.forEach(function (image) {
          image.classList.add('is-changing');
        });
        window.setTimeout(function () {
          heroPanes.forEach(function (image) {
            image.src = heroImages[heroIndex];
            image.classList.remove('is-changing');
          });
        }, 450);
      }, 5000);
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
    function openProject(event) {
      if (event.target.closest('a')) {
        return;
      }

      window.location.href = card.getAttribute('data-detail');
    }

    card.addEventListener('click', openProject);
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = card.getAttribute('data-detail');
      }
    });
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
      lightbox.innerHTML = '<button class="image-lightbox-close" type="button" aria-label="Fermer">×</button><button class="image-lightbox-prev" type="button" aria-label="Image précédente">←</button><img class="image-lightbox-image" alt=""><button class="image-lightbox-next" type="button" aria-label="Image suivante">→</button>';
      document.body.appendChild(lightbox);
      lightbox.querySelector('button').addEventListener('click', function () { lightbox.close(); });
      var lightboxImage = lightbox.querySelector('.image-lightbox-image');
      var previousButton = lightbox.querySelector('.image-lightbox-prev');
      var nextButton = lightbox.querySelector('.image-lightbox-next');

      function showImage(index) {
        currentIndex = (index + images.length) % images.length;
        lightboxImage.src = images[currentIndex].src;
        lightboxImage.alt = images[currentIndex].alt;
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
})();
