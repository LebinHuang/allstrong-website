(() => {
 'use strict';
 const models=[{doors:1,width:24,output:130000},{doors:2,width:30,output:140000},{doors:3,width:36,output:140000}];
 let selected=models.find(m=>m.doors===Number(new URLSearchParams(location.search).get('doors')))||models[2];
 const dialog=document.getElementById('quote-dialog');
 const selection=()=>`${selected.doors}-door cabinet · ${selected.width}″ wide · ${selected.output.toLocaleString('en-US')} BTU/hr`;
 function update(){
  document.querySelectorAll('[data-doors]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.doors)===selected.doors)));
  document.getElementById('model-name').textContent=`${selected.doors}-DOOR / ${selected.width}″ CONFIGURATION`;
  document.getElementById('model-output').textContent=selected.output.toLocaleString('en-US');
  document.getElementById('model-dimensions').textContent=`${selected.width}″ W × 39″ D × 72″ H`;
  document.getElementById('quote-selection').textContent=selection();
  document.getElementById('configuration-image-note').textContent=selected.doors===3?'Specifications shown for this model.':`${selected.doors}-door / ${selected.width}″ specifications selected; 3-door product photo shown.`;
 }
 document.getElementById('door-picker').addEventListener('click',e=>{const b=e.target.closest('[data-doors]');if(!b)return;selected=models.find(m=>m.doors===Number(b.dataset.doors));update();const u=new URL(location.href);u.searchParams.set('doors',String(selected.doors));history.replaceState(null,'',u);});
 document.querySelectorAll('[data-quote]').forEach(b=>b.addEventListener('click',()=>{update();dialog.showModal();}));
 document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 document.getElementById('quote-form').addEventListener('submit',e=>{
  e.preventDefault();if(!e.currentTarget.reportValidity())return;const f=new FormData(e.currentTarget);
  const body=['Hello Allstrong,','','I would like a quote for a Steamer Cabinet Range.','',`Configuration: ${selection()}`,`Overall size: ${selected.width}″ W × 39″ D × 72″ H`,`Fuel: ${f.get('fuel')}`,`Quantity: ${f.get('quantity')}`,'',`Name: ${f.get('name')}`,`Email: ${f.get('email')}`,'','Project notes:',f.get('notes')||'(none)','','Please confirm included accessories and installation requirements.'].join('\n');
  location.href=`mailto:info@allstrong.com?subject=${encodeURIComponent(`Steamer cabinet inquiry — ${selected.doors} doors / ${selected.width} inch`)}&body=${encodeURIComponent(body)}`;
 });
 const menu=document.querySelector('.mobile-menu'),nav=document.getElementById('mobile-nav');
 const closeMenu=()=>{nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const film=document.getElementById('cabinet-film'),loop=document.getElementById('cabinet-steam-loop'),stage=document.querySelector('.cabinet-hero__film');
 let finished=false,inView=false;
 const active=()=>finished?loop:film;
 const pause=()=>{film.pause();loop.pause();};
 const play=()=>{if(reduced.matches||document.hidden||!inView)return;const target=active();const p=target.play();if(p&&p.catch)p.catch(()=>{});};
 const showLoop=()=>{if(finished&&!reduced.matches)stage.classList.add('is-looping');};
 loop.addEventListener('playing',showLoop);
 const finish=()=>{finished=true;film.pause();play();if(loop.readyState>=2&&!loop.paused)showLoop();};
 film.addEventListener('ended',finish);film.addEventListener('error',finish);
 loop.addEventListener('error',()=>{stage.classList.remove('is-looping');});
 const applyMotion=()=>{stage.classList.toggle('is-reduced',reduced.matches);if(reduced.matches){pause();film.removeAttribute('autoplay');document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}else play();};
 applyMotion();
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{inView=entry.isIntersecting;if(inView)play();else pause();}),{threshold:.15});observer.observe(stage);
  if(!reduced.matches){document.documentElement.classList.add('js-motion');const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target);}}),{threshold:.06});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));}
 }else{inView=true;play();}
 if(reduced.addEventListener)reduced.addEventListener('change',applyMotion);else reduced.addListener(applyMotion);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else play();});
 const states=[
  ['closed-steam','Three cabinet doors closed, with steam leaving the rooftop exhausts'],
  ['bottom-open','Lower chamber open and releasing steam; upper two doors closed'],
  ['bottom-middle-open','Lower and middle chambers open and releasing steam'],
  ['all-open','All three chambers open, with steam rising from every chamber and both rooftop exhausts']
 ];
 const steps=[...document.querySelectorAll('[data-state]')],image=document.getElementById('operation-image');
 steps.forEach((button,i)=>button.addEventListener('click',()=>{image.src=`assets/steamer/${states[i][0]}.webp`;image.alt=states[i][1];steps.forEach((other,j)=>other.setAttribute('aria-pressed',String(i===j)));}));
 update();
})();
