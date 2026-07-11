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

// トップページのおすすめメニューを、2段・逆方向に自動で流す
const recommendedMenuRows = {
  right: [
    { name: 'ごぼう天うどん', price: '700円', image: 'images/menu-retouched/goboten-udon.jpg', target: 'udon-menu' },
    { name: '明太釜玉うどん', price: '850円', image: 'images/menu-retouched/mentai-kamatama.jpg', target: 'udon-menu' },
    { name: '肉ぶっかけうどん', price: '1,000円', image: 'images/menu-retouched/niku-bukkake.jpg', target: 'udon-menu' },
    { name: '牛すじうどん', price: '850円', image: 'images/menu-retouched/gyusuji-udon.jpg', target: 'udon-menu' },
    { name: 'カツ丼', price: '850円', image: 'images/katudon.png', target: 'udon-menu' },
    { name: '釜たまうどん', price: '600円', image: 'images/menu-retouched/kamatama.jpg', target: 'udon-menu' }
  ],
  left: [
    { name: 'せせりの炭火焼', price: '700円', image: 'images/menu-retouched/seseri.jpg', target: 'izakaya-menu' },
    { name: '牛スジの煮込み', price: '600円', image: 'images/menu-retouched/gyusuji-nikomi.jpg', target: 'izakaya-menu' },
    { name: 'チーズボール', price: '650円', image: 'images/menu-retouched/cheese-balls.jpg', target: 'izakaya-menu' },
    { name: 'ほたるイカの沖漬', price: '600円', image: 'images/menu-retouched/hotaruika.jpg', target: 'izakaya-menu' },
    { name: 'あぶり明太子', price: '600円', image: 'images/menu-retouched/aburi-mentaiko.jpg', target: 'izakaya-menu' },
    { name: 'エイひれあぶり', price: '600円', image: 'images/menu-retouched/eihire.jpg', target: 'izakaya-menu' }
  ]
};

document.querySelectorAll('[data-menu-marquee]').forEach((marquee) => {
  const direction = marquee.dataset.menuMarquee;
  const items = recommendedMenuRows[direction] || recommendedMenuRows.left;
  const track = document.createElement('div');
  track.className = 'menu-marquee-track';

  const createGroup = (duplicate = false) => {
    const group = document.createElement('div');
    group.className = 'menu-marquee-group';

    if (duplicate) {
      group.setAttribute('aria-hidden', 'true');
    }

    items.forEach((item) => {
      const card = document.createElement('a');
      const image = document.createElement('img');
      const caption = document.createElement('span');
      const name = document.createElement('span');
      const price = document.createElement('span');

      card.className = 'recommend-card';
      card.href = `menu.html#${item.target}`;
      if (duplicate) card.tabIndex = -1;
      image.src = item.image;
      image.alt = duplicate ? '' : item.name;
      image.loading = 'lazy';
      image.decoding = 'async';
      caption.className = 'recommend-card-caption';
      name.textContent = item.name;
      price.className = 'recommend-card-price';
      price.textContent = item.price;
      caption.append(name, price);
      card.append(image, caption);
      group.append(card);
    });

    return group;
  };

  track.append(createGroup(), createGroup(true));
  marquee.append(track);
});

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

// スクロールに合わせて要素をふわっと表示
// （IntersectionObserverが使えない環境では何もせず、そのまま表示する）
if ('IntersectionObserver' in window && document.visibilityState === 'visible') {
  const targets = document.querySelectorAll(
    'h2, .about-catch, .about-intro, .feature, .recommend-marquees, .category-slider-shell, .menu-list, .access-grid'
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
