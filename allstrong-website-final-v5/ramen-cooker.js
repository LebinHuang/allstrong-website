(() => {
  'use strict';
  const models = {6:{widths:[16,18],btu:'130,000',label:'06 / SIX HOLES',word:'six'},9:{widths:[24],btu:'130,000',label:'09 / NINE HOLES',word:'nine'},12:{widths:[32],btu:'140,000',label:'12 / TWELVE HOLES',word:'twelve'}};
  let holes = 9, sixWidth = 16;
  function render() {
    const model = models[holes], width = holes === 6 ? sixWidth : model.widths[0];
    const src = `images/ramen-cooker-${holes}.webp`;
    const img = document.getElementById('rc-image');
    img.src = src; img.alt = `Allstrong ${model.word}-hole commercial ramen cooker with stainless-steel exhaust`;
    document.getElementById('rc-enlarge').href = src;
    document.getElementById('rc-image-label').textContent = model.label;
    document.getElementById('rc-selected').textContent = `${holes}-hole configuration`;
    document.getElementById('rc-output').textContent = model.btu;
    document.getElementById('rc-size').textContent = `${width} × 39 × 60″`;
    document.getElementById('rc-six-width').hidden = holes !== 6;
    document.querySelectorAll('[data-holes]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.holes) === holes)));
    document.querySelectorAll('[data-size]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.size) === sixWidth)));
    document.querySelectorAll('[data-model]').forEach(row => row.classList.toggle('is-selected',row.dataset.model === `${holes}-${width}`));
  }
  function updateURL() {
    const url = new URL(location.href);
    url.searchParams.set('holes',String(holes));
    if (holes === 6) url.searchParams.set('size',String(sixWidth)); else url.searchParams.delete('size');
    history.replaceState(null,'',url);
  }
  document.querySelectorAll('[data-holes]').forEach(button => button.addEventListener('click',() => { holes=Number(button.dataset.holes); render(); updateURL(); }));
  document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click',() => { sixWidth=Number(button.dataset.size); render(); updateURL(); }));
  const params = new URLSearchParams(location.search);
  const requested = Number(params.get('holes'));
  if (Object.hasOwn(models,requested)) holes=requested;
  if (params.get('size') === '18') sixWidth=18;
  render();
})();
