// MHT CTA deck controller
(() => {
  const deck = document.querySelector('#mht-cta-deck');
  if (!deck) return;

  const slides = [...deck.querySelectorAll('.mht-slide')];
  const navButtons = [...deck.querySelectorAll('.mht-nav-btn')];

  const setActive = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    navButtons.forEach((btn, i) => {
      btn.classList.toggle('is-active', i === index);
      btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const idx = slides.indexOf(visible.target);
      if (idx >= 0) setActive(idx);
    },
    {
      root: null,
      threshold: [0.25, 0.5, 0.75],
      rootMargin: '-10% 0px -20% 0px'
    }
  );

  slides.forEach(slide => observer.observe(slide));

  navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      slides[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      setActive(index);
    });
  });

  // subtle parallax for hero stats
  const hero = deck.querySelector('.mht-deck__hero');
  const stats = [...deck.querySelectorAll('.mht-stat')];

  const updateParallax = () => {
    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = Math.max(-1, Math.min(1, (rect.top + rect.height * 0.5 - vh * 0.5) / vh));

    stats.forEach((card, i) => {
      const offset = progress * (i + 1) * -8;
      card.style.transform = `translateY(${offset}px)`;
    });
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);
})();
