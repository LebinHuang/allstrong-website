(()=>{'use strict';
const models={6:{widths:[16,18],output:130000,layout:'2 × 3'},9:{widths:[24],output:130000,layout:'3 × 3'},12:{widths:[32],output:140000,layout:'4 × 3'}};
const params=new URLSearchParams(location.search);let holes=[6,9,12].includes(Number(params.get('holes')))?Number(params.get('holes')):9;let sixWidth=params.get('width')==='18'?18:16;
function render(){const m=models[holes],width=holes===6?sixWidth:m.widths[0];document.querySelectorAll('[data-holes]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.holes)===holes)));document.querySelectorAll('[data-width]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.width)===sixWidth)));document.getElementById('width-picker').hidden=holes!==6;document.getElementById('model-name').textContent=`${holes}-HOLE / ${width}″ CONFIGURATION`;document.getElementById('model-output').textContent=m.output.toLocaleString('en-US');document.getElementById('model-dimensions').textContent=`${width}″ × 39″ × 60″`;document.getElementById('model-layout').textContent=`${holes} / ${m.layout} layout`;document.getElementById('configuration-image-note').textContent=holes===9?'Specifications shown for the cooker in this video.':`${holes}-hole specifications selected. The video shows the 9-hole cooker.`;document.querySelectorAll('[data-row]').forEach(r=>r.classList.toggle('is-selected',r.dataset.row===`${holes}-${width}`));const subject=`Ramen Cooker inquiry — ${holes} holes / ${width} inch`;const body=['Hello Allstrong,','','I would like a quote for a Ramen Cooker.',`Configuration: ${holes} holes / ${width} inch width`,`Overall size: ${width} W × 39 D × 60 H inches`,`Burner output: ${m.output.toLocaleString('en-US')} BTU/hr`,'','Fuel type:','Quantity:','Project notes:',''].join('\n');document.querySelectorAll('[data-quote]').forEach(a=>a.href=`mailto:info@allstrong.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)}
function updateURL(){const u=new URL(location.href);u.searchParams.set('holes',holes);if(holes===6)u.searchParams.set('width',sixWidth);else u.searchParams.delete('width');history.replaceState(null,'',u)}document.querySelectorAll('[data-holes]').forEach(b=>b.addEventListener('click',()=>{holes=Number(b.dataset.holes);render();updateURL()}));document.querySelectorAll('[data-width]').forEach(b=>b.addEventListener('click',()=>{sixWidth=Number(b.dataset.width);render();updateURL()}));render();
const menu=document.querySelector('.mobile-menu'),nav=document.getElementById('mobile-nav');function closeMenu(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const states=new Map();
function wantsPlayback(state){return state.visible&&!state.manualPause&&!document.hidden&&(!reduced.matches||state.userPlayed)}
function bufferAhead(video){
  for(let i=0;i<video.buffered.length;i++){
    if(video.buffered.start(i)<=video.currentTime+.05&&video.buffered.end(i)>video.currentTime)return video.buffered.end(i)-video.currentTime;
  }
  return 0;
}
function label(state){
  const active=wantsPlayback(state)&&(!state.video.paused||state.buffering||state.playPending);
  const kind=state.video.id==='hero-film'?'film':'video';
  state.button.innerHTML=`${active?'Pause':'Play'} ${kind} <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${active?'M9 5v14M15 5v14':'M8 5l11 7-11 7Z'}"/></svg>`;
  state.button.setAttribute('aria-label',`${active?'Pause':'Play'} ${state.video.id==='hero-film'?'product film':'boiling water video'}`);
}
function loadVideo(state){
  if(state.loaded)return;
  const connection=navigator.connection;
  const lightweight=matchMedia('(max-width: 760px)').matches||connection?.saveData||['slow-2g','2g','3g'].includes(connection?.effectiveType);
  state.loaded=true;
  state.video.src=lightweight?state.video.dataset.mobileSrc:state.video.dataset.desktopSrc;
  state.video.preload='auto';
  state.video.load();
}
function reconcile(state){
  const video=state.video;
  if(!wantsPlayback(state)){state.buffering=false;video.pause();label(state);return}
  loadVideo(state);
  if(!video.paused||state.playPending){label(state);return}
  const remaining=Number.isFinite(video.duration)?Math.max(0,video.duration-video.currentTime):2;
  // Keep a short reserve before starting or resuming after a network stall.
  const target=Math.min(2,remaining);
  if(video.readyState<2||bufferAhead(video)+.05<target){state.buffering=true;label(state);return}
  state.buffering=false;
  state.playPending=true;
  label(state);
  video.play().catch(error=>{if(error.name!=='AbortError'&&wantsPlayback(state))state.manualPause=true}).finally(()=>{
    state.playPending=false;
    if(!wantsPlayback(state))video.pause();
    label(state);
  });
}
for(const video of document.querySelectorAll('video')){
  const button=document.querySelector(`[data-video="${video.id}"]`);
  const state={video,button,visible:false,loaded:false,manualPause:false,userPlayed:false,buffering:false,playPending:false};
  states.set(video,state);
  video.muted=true;
  button.addEventListener('click',()=>{
    if(wantsPlayback(state)&&(!video.paused||state.buffering||state.playPending))state.manualPause=true;
    else{state.manualPause=false;state.userPlayed=true}
    reconcile(state);
  });
  for(const event of ['progress','loadedmetadata','loadeddata','canplay','canplaythrough'])video.addEventListener(event,()=>reconcile(state));
  video.addEventListener('waiting',()=>{if(wantsPlayback(state)){state.buffering=true;video.pause();reconcile(state)}});
  for(const event of ['play','pause','playing'])video.addEventListener(event,()=>label(state));
  video.addEventListener('error',()=>{state.loaded=false;state.manualPause=true;state.buffering=false;label(state)});
  label(state);
}
const preloadObserver=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting&&!reduced.matches){loadVideo(states.get(entry.target));preloadObserver.unobserve(entry.target)}
},{rootMargin:'350px 0px'});
const playbackObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){const state=states.get(entry.target);state.visible=entry.isIntersecting;reconcile(state)}
},{threshold:.15});
states.forEach(state=>{preloadObserver.observe(state.video);playbackObserver.observe(state.video)});
document.addEventListener('visibilitychange',()=>states.forEach(reconcile));
reduced.addEventListener('change',()=>states.forEach(reconcile));
const dialog=document.getElementById('image-dialog'),image=document.getElementById('enlarged-image');document.querySelectorAll('[data-enlarge]').forEach(b=>b.addEventListener('click',()=>{const original=b.querySelector('img');image.src=b.dataset.enlarge;image.alt=original.alt;document.getElementById('enlarged-caption').textContent=original.alt;dialog.showModal()}));dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
})();
