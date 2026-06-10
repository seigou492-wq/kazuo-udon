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

// スクロールに合わせて要素をふわっと表示
// （IntersectionObserverが使えない環境では何もせず、そのまま表示する）
if ('IntersectionObserver' in window && document.visibilityState === 'visible') {
  const targets = document.querySelectorAll(
    'h2, .about-catch, .about-intro, .feature, .menu-photos figure, .menu-list, .access-grid'
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
