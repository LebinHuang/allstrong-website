(() => {
  'use strict';
  const models = [
    {burners:1,length:30,weight:300,gas:'¾',water:'½',output:120000},
    {burners:2,length:56,weight:500,gas:'1',water:'½',output:240000},
    {burners:3,length:72,weight:600,gas:'1¼',water:'½',output:360000},
    {burners:4,length:92,weight:800,gas:'1½',water:'½',output:480000},
    {burners:5,length:120,weight:1000,gas:'1½',water:'¾',output:600000},
    {burners:6,length:140,weight:1200,gas:'1½ × 2',water:'¾',output:720000},
    {burners:7,length:160,weight:1400,gas:'1½ × 2',water:'¾ × 2',output:840000},
    {burners:8,length:190,weight:1600,gas:'1½ × 2',water:'¾ × 2',output:960000},
    {burners:9,length:210,weight:1800,gas:'1½ × 2',water:'¾ × 2',output:1080000}
  ];
  const params = new URLSearchParams(location.search);
  const requested = Number((params.get('model') || '').replace(/^ARE-/i,'')) || Number(params.get('burners'));
  let selected = models.find(m => m.burners === requested) || models[2];
  const $ = id => document.getElementById(id);
  const format = n => n.toLocaleString('en-US');
  const size = () => `${selected.length}″ × 42″ × 62″`;
  const inlet = value => value.replace(' ×','″ ×') + (value.includes('×')?'':'″');
  const selection = () => `ARE-${selected.burners} · ${selected.burners} ${selected.burners===1?'burner':'burners'} · ${format(selected.output)} BTU/hr`;
  const chamber = $('chamber-size');
  const dialog = $('quote-dialog');
  function update() {
    document.querySelectorAll('[data-burners]').forEach(b => b.setAttribute('aria-pressed',String(Number(b.dataset.burners)===selected.burners)));
    $('model-name').textContent = `ARE-${selected.burners} / ${selected.burners}-BURNER CONFIGURATION`;
    $('model-output').textContent = format(selected.output);
    $('model-dimensions').textContent = size();
    $('model-weight').textContent = `${format(selected.weight)} lbs`;
    $('model-gas').textContent = inlet(selected.gas);
    $('model-water').textContent = inlet(selected.water);
    $('configuration-image-note').textContent = selected.burners===3?'Specifications shown for this model.':`ARE-${selected.burners} specifications selected; 3-burner product image shown.`;
    $('quote-selection').textContent = `${selection()} · Chamber: ${chamber.value}`;
  }
  $('burner-picker').addEventListener('click', e => {
    const b = e.target.closest('[data-burners]'); if (!b) return;
    selected = models.find(m => m.burners===Number(b.dataset.burners)); update();
    const u = new URL(location.href); u.searchParams.set('model',`ARE-${selected.burners}`);u.searchParams.delete('burners');history.replaceState(null,'',u);
  });
  chamber.addEventListener('change',update);
  document.querySelectorAll('[data-quote]').forEach(b => b.addEventListener('click', () => {update();dialog.showModal();}));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  $('quote-form').addEventListener('submit', e => {
    e.preventDefault();if(!e.currentTarget.reportValidity())return;
    const f=new FormData(e.currentTarget);
    const body=['Hello Allstrong,','','I would like a quote for a Chinese Wok Range.','',`Configuration: ${selection()}`,`Overall size (L × W × H, approximate): ${size()}`,`Chamber diameter: ${chamber.value}`,`Gas inlet: ${inlet(selected.gas)}`,`Water inlet: ${inlet(selected.water)}`,`Fuel: ${f.get('fuel')}`,`Quantity: ${f.get('quantity')}`,'',`Name: ${f.get('name')}`,`Email: ${f.get('email')}`,'','Project notes:',f.get('notes')||'(none)','','Please confirm final burner ratings, included accessories and installation requirements.'].join('\n');
    location.href=`mailto:info@allstrong.com?subject=${encodeURIComponent(`Chinese wok range inquiry — ARE-${selected.burners}`)}&body=${encodeURIComponent(body)}`;
  });
  const menu=document.querySelector('.mobile-menu'),nav=$('mobile-nav');
  const closeMenu=()=>{nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');};
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const videos=[...document.querySelectorAll('video')];
  const visible=new Set();
  const completed=new WeakSet();
  async function play(video,manual=false){
    if(document.hidden||(!manual&&(reduced.matches||completed.has(video)||(video.hasAttribute('data-play-once')&&video.ended))))return;
    try{await video.play();}catch{const b=video.parentElement.querySelector('.video-retry');if(b)b.hidden=false;}
  }
  videos.forEach(video=>{
    const retry=video.parentElement.querySelector('.video-retry');
    const once=video.hasAttribute('data-play-once');
    video.muted=true;
    if(once){
      video.loop=false;
      video.addEventListener('ended',()=>{
        completed.add(video);
        if(retry){
          retry.innerHTML='Replay 360° <span aria-hidden="true">↻</span>';
          retry.hidden=false;
        }
      });
    }
    video.addEventListener('playing',()=>{if(retry)retry.hidden=true;});
    if(retry)retry.addEventListener('click',()=>{
      if(once&&(completed.has(video)||video.ended)){
        video.currentTime=0;
        completed.delete(video);
      }
      play(video,true);
    });
    if(reduced.matches){video.removeAttribute('autoplay');video.pause();if(retry)retry.hidden=false;}
  });
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(({target:video,isIntersecting})=>{
      if(isIntersecting){visible.add(video);play(video);}else{visible.delete(video);video.pause();}
    }),{threshold:.15});videos.forEach(video=>observer.observe(video));
    if(!reduced.matches){document.documentElement.classList.add('js-motion');const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));}
  }else{videos.forEach(v=>{visible.add(v);play(v);});}
  function applyMotion(){videos.forEach(video=>{if(reduced.matches){video.removeAttribute('autoplay');video.pause();const b=video.parentElement.querySelector('.video-retry');if(b)b.hidden=false;}else if(visible.has(video))play(video);});if(reduced.matches)document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
  if(reduced.addEventListener)reduced.addEventListener('change',applyMotion);else reduced.addListener(applyMotion);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());else visible.forEach(v=>play(v));});
  update();
})();
