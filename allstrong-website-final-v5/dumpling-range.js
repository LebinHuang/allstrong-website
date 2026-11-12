(() => {
  'use strict';
  const configurations = [
    { holes: 2, width: 16, output: 130000 },
    { holes: 2, width: 18, output: 130000 },
    { holes: 4, width: 24, output: 130000 },
    { holes: 4, width: 32, output: 140000 },
    { holes: 7, width: 36, output: 140000 }
  ];
  const initial = new URLSearchParams(location.search);
  const requestedWidth = Number(initial.get('size'));
  const initialHoles = Number(initial.get('holes')) || configurations.find(model => model.width === requestedWidth)?.holes || 4;
  const initialWidth = requestedWidth || (initialHoles === 4 ? 32 : 0);
  let selected = configurations.find(model => model.holes === initialHoles && model.width === initialWidth)
    || configurations.find(model => model.holes === initialHoles) || configurations[3];
  function updateURL() {
    const url = new URL(location.href);
    url.searchParams.set('holes', String(selected.holes));
    url.searchParams.set('size', String(selected.width));
    history.replaceState(null, '', url);
  }
  const format = value => value.toLocaleString('en-US');
  const widthPicker = document.getElementById('width-picker');
  const dialog = document.getElementById('quote-dialog');
  const modelImage = document.getElementById('model-image');
  const modelCaption = document.getElementById('model-image-caption');
  const modelImages = {
    2: { src: 'assets/dumpling/model-2-studio.webp', width: 1672, height: 941, alt: 'Allstrong two-hole dumpling range with two diagonal steaming openings', caption: '2-hole range shown. Reference image for the 16″ and 18″ configurations.' },
    4: { src: 'assets/dumpling/front.webp', width: 1800, height: 1005, alt: 'Allstrong four-hole dumpling range, complete frontal view', caption: '4-hole range shown. Reference image for the 24″ and 32″ configurations.' },
    7: { src: 'assets/dumpling/model-7-studio.webp', width: 1672, height: 941, alt: 'Allstrong seven-hole dumpling range with seven circular steaming openings', caption: '7-hole range shown. 36″ configuration.' }
  };
  const selectionText = () => `${selected.holes}-hole range · ${selected.width}″ wide · ${format(selected.output)} BTU/hr`;
  function update() {
    const photo = modelImages[selected.holes];
    if (modelImage.getAttribute('src') !== photo.src) modelImage.setAttribute('src', photo.src);
    modelImage.alt = photo.alt;
    modelImage.width = photo.width;
    modelImage.height = photo.height;
    modelCaption.textContent = photo.caption;
    document.querySelectorAll('[data-holes]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.holes) === selected.holes)));
    widthPicker.replaceChildren(...configurations.filter(model => model.holes === selected.holes).map(model => {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.width = model.width;
      button.textContent = `${model.width}″`;
      button.setAttribute('aria-pressed', String(model.width === selected.width));
      return button;
    }));
    document.getElementById('model-name').textContent = `${selected.holes}-HOLE / ${selected.width}″ CONFIGURATION`;
    document.getElementById('model-output').textContent = format(selected.output);
    document.getElementById('model-dimensions').textContent = `${selected.width}″ W × 39″ D × 60″ H`;
    document.getElementById('quote-selection').textContent = selectionText();
  }
  document.getElementById('hole-picker').addEventListener('click', event => {
    const button = event.target.closest('[data-holes]'); if (!button) return;
    selected = configurations.find(model => model.holes === Number(button.dataset.holes)); update(); updateURL();
  });
  widthPicker.addEventListener('click', event => {
    const button = event.target.closest('[data-width]'); if (!button) return;
    selected = configurations.find(model => model.holes === selected.holes && model.width === Number(button.dataset.width)); update(); updateURL();
  });
  document.querySelectorAll('[data-quote]').forEach(button => button.addEventListener('click', () => { document.getElementById('quote-selection').textContent = selectionText(); dialog.showModal(); }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  document.getElementById('quote-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget; if (!form.reportValidity()) return;
    const values = new FormData(form);
    const body = ['Hello Allstrong,', '', 'I would like a quote for a Dimsum & Dumpling Range.', '', `Configuration: ${selectionText()}`, `Overall size: ${selected.width}″ W × 39″ D × 60″ H`, `Fuel: ${values.get('fuel')}`, `Quantity: ${values.get('quantity')}`, '', `Name: ${values.get('name')}`, `Email: ${values.get('email')}`, '', 'Project notes:', values.get('notes') || '(none)', '', 'Please confirm steamer compatibility, included accessories and installation requirements.'].join('\n');
    window.location.href = `mailto:info@allstrong.com?subject=${encodeURIComponent(`Dumpling range inquiry — ${selected.holes} holes / ${selected.width} inch`)}&body=${encodeURIComponent(body)}`;
  });
  const menu = document.querySelector('.mobile-menu');
  const mobileNav = document.getElementById('mobile-nav');
  const closeMenu = () => { mobileNav.hidden = true; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; mobileNav.hidden = !open; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const intro = document.getElementById('hero-intro'), loop = document.getElementById('hero-loop');
  const stage = document.querySelector('.hero-stage');
  let introFinished = false, inView = false;
  const allowed = () => inView && !reduced.matches;
  const loopPlayer = AllstrongVideo.create(loop, {
    shouldPlay: () => allowed() && introFinished,
    onPlaying: () => intro.classList.add('finished')
  });
  const finishIntro = () => { introFinished = true; introPlayer.pause(); syncHero(); };
  const introPlayer = AllstrongVideo.create(intro, {
    shouldPlay: () => allowed() && !introFinished,
    onEnded: finishIntro, onError: finishIntro, onBlocked: finishIntro
  });
  function syncHero() {
    if (!allowed()) { introPlayer.pause(); loopPlayer.pause(); return; }
    if (introFinished) loopPlayer.play(); else introPlayer.play();
  }
  intro.addEventListener('timeupdate', () => { if (allowed() && intro.duration - intro.currentTime <= 3) loopPlayer.load(); });
  const ambient = [...document.querySelectorAll('[data-ambient]')].map(video => {
    const state = { video, visible: false };
    state.player = AllstrongVideo.create(video, { shouldPlay: () => state.visible && !reduced.matches });
    return state;
  });
  function syncMotion() {
    if (reduced.matches) { intro.classList.add('finished'); document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); }
    else if (!introFinished) intro.classList.remove('finished');
    syncHero();
    ambient.forEach(state => { if (state.visible && !reduced.matches) state.player.play(); else state.player.pause(); });
  }
  if ('IntersectionObserver' in window) {
    const preload = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting || reduced.matches) return;
      if (entry.target === stage) (introFinished ? loopPlayer : introPlayer).load();
      else ambient.find(state => state.video === entry.target).player.load();
      preload.unobserve(entry.target);
    }), { rootMargin: '350px 0px' });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.target === stage) { inView = entry.isIntersecting; syncHero(); }
      else {
        const state = ambient.find(item => item.video === entry.target);
        state.visible = entry.isIntersecting;
        if (state.visible && !reduced.matches) state.player.play(); else state.player.pause();
      }
    }), { threshold: .15 });
    [stage, ...ambient.map(state => state.video)].forEach(target => { preload.observe(target); observer.observe(target); });
    if (!reduced.matches) {
      document.documentElement.classList.add('js-motion');
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: .08 });
      document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    }
  } else { inView = true; ambient.forEach(state => state.visible = true); }
  reduced.addEventListener('change', syncMotion);
  syncMotion();
  update();
})();
