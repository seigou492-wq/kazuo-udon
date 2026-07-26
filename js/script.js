// スマホ用ナビの開閉
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
});

// リンクを押したら閉じる
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// スクロールでヘッダーに背景色をつける
const header = document.querySelector('.header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// お品書きページの料理写真スライダー
document.querySelectorAll('[data-category-slider]').forEach((sliderShell, index) => {
  const slider = sliderShell.querySelector('.category-image-slider');
  const previousButton = sliderShell.querySelector('.category-slider-prev');
  const nextButton = sliderShell.querySelector('.category-slider-next');

  if (!slider || !previousButton || !nextButton) return;

  slider.id = `category-image-slider-${index + 1}`;
  previousButton.setAttribute('aria-controls', slider.id);
  nextButton.setAttribute('aria-controls', slider.id);

  const updateButtons = () => {
    const end = slider.scrollWidth - slider.clientWidth - 2;
    previousButton.disabled = slider.scrollLeft <= 2;
    nextButton.disabled = slider.scrollLeft >= end;
  };

  const moveSlider = (direction) => {
    slider.scrollBy({
      left: direction * slider.clientWidth * 0.84,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };

  previousButton.addEventListener('click', () => moveSlider(-1));
  nextButton.addEventListener('click', () => moveSlider(1));
  slider.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons, { passive: true });
  updateButtons();
});

// お品書きのタブは、それぞれ独立して開閉する。
// 別の「＋」を押しても、すでに開いたタブはそのまま表示しておく。

// スクロールに合わせて要素をふわっと表示
// （IntersectionObserverが使えない環境では何もせず、そのまま表示する）
if ('IntersectionObserver' in window && document.visibilityState === 'visible') {
  const targets = document.querySelectorAll(
    'h2, .night-style-heading, .night-style-card, .night-style-hours, .about-catch, .about-intro, .feature, .recommend-marquees, .category-slider-shell, .menu-list, .access-details, .interior-guide, .banquet-card'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px' });

  targets.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
