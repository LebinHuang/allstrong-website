(() => {
  'use strict';
  const root = document.querySelector('.series-showcase');
  if (!root) return;
  const product = (name, image, href, description, label = name) => ({name,image,href,description,label});
  const series = [
    {name:'Wok', word:'WOK', products:[
      product('California-Style Wok Range','california-style-wok-range.webp','california-style-wok-range.html','Explore the California-style configuration in the Allstrong Wok Range series.','California-Style'),
      product('Chinese Wok Range','wok-range.webp','chinese-wok-range.html','Commercial wok cooking, built around the demands of your kitchen.','Chinese Wok'),
      product('Multi-Function Wok Range','multi-function-wok-range.webp','multi-function-wok-range.html','Explore the wok station at the heart of the Multi-Function range.','Multi-Function')
    ]},
    {name:'Steamer', word:'STEAM', products:[
      product('Steamer Cabinet','steamer-cabinets.webp','steamer-cabinets.html','A dedicated steaming configuration for a commercial kitchen.','Steamer Cabinet')
    ]},
    {name:'Dumpling', word:'DUMPLING', products:[
      product('Dumpling Range — 4 Holes','dumpling-range-4.webp','dumpling-range.html?holes=4&size=32','Explore the four-hole dumpling range configuration.','4-Hole Dumpling'),
      product('Dumpling Range — 7 Holes','dumpling-range-7.webp','dumpling-range.html?holes=7&size=36#models','Explore the seven-hole dumpling range configuration.','7-Hole Dumpling')
    ]},
    {name:'Ramen', word:'RAMEN', products:[
      product('Ramen Cooker — 9 Holes','ramen-cooker-9.webp','ramen-cooker.html?holes=9','24-inch configuration with 130,000 BTU/hr output.','9 Holes'),
      product('Ramen Cooker — 6 Holes','ramen-cooker-6.webp','ramen-cooker.html?holes=6','16-inch or 18-inch configurations with 130,000 BTU/hr output.','6 Holes'),
      product('Ramen Cooker — 12 Holes','ramen-cooker-12.webp','ramen-cooker.html?holes=12','32-inch configuration with 140,000 BTU/hr output.','12 Holes')
    ]},
    {name:'Rice Noodle', word:'RICE NOODLE', products:[
      product('Rice Noodle Range','rice-noodle-range.webp','rice-noodle-range.html','A steaming station designed for rice noodle preparation.','Rice Noodle')
    ]},
    {name:'Roast', word:'ROAST', products:[
      product('BBQ Oven','bbq-oven.webp','bbq-oven.html','Explore Allstrong commercial roasting equipment.','BBQ Oven'),
      product('Roaster Oven','roaster-oven.webp','roaster-oven.html','A cabinet-style commercial roasting configuration.','Roaster Oven'),
      product('Roaster Oven with Microwave','roaster-oven-micro.webp','roaster-oven-micro.html','Explore the roaster version with microwave.','With Microwave')
    ]},
    {name:'Grill', word:'GRILL', products:[
      product('Mongolian BBQ Range','mongolian-bbq-range.webp','mongolian-bbq-range.html','A circular cooking surface for Mongolian barbecue service.')
    ]},
    {name:'Auto Cooker', word:'AUTO COOKER', products:[
      product('Auto Cooker','auto-cooker.webp','auto-cooker.html','Explore Allstrong automatic cooking equipment.')
    ]},
    {name:'Soup Cooker', word:'SOUP COOKER', products:[
      product('Soup Cooker','kettle-cooker.webp','kettle-cooker.html','Explore Allstrong soup cooking equipment.')
    ]},
    {name:'Cool', word:'COOL', products:[
      product('Air Cooler','air-cooler.webp','air-cooler.html','Explore the Allstrong air cooler cabinet.')
    ]},
    {name:'Thaw', word:'THAW', products:[
      product('Thawing Machine','thawing-machine.webp','thawing-machine.html','Explore a stainless-steel thawing station for your kitchen.')
    ]}
  ];
  const deck = root.querySelector('.ss-deck');
  const word = root.querySelector('.ss-word');
  const details = root.querySelector('.ss-details');
  const variants = root.querySelector('.ss-variants');
  const nav = root.querySelector('.ss-nav');
  const status = root.querySelector('.ss-live');
  root.style.setProperty('--ss-series-count', series.length);
  root.querySelector('.ss-total').textContent = String(series.length).padStart(2,'0');
  root.querySelector('.ss-product-count').textContent = `${series.reduce((count,s)=>count+s.products.length,0)} Products`;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0, variant = 0, pointer = null, suppressClick = false;
  const items = series.map((s,i) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'ss-item'; button.dataset.series = i;
    button.setAttribute('aria-label',`Show ${s.name} series`);
    const img = document.createElement('img'); img.className = 'ss-object';
    img.src = `images/${s.products[0].image}`; img.alt = s.products[0].name;
    img.draggable = false; img.decoding = 'async';
    const label = document.createElement('span'); label.className = 'ss-side-label'; label.textContent = `${s.name} Series`;
    button.append(img,label); deck.append(button);
    button.addEventListener('click', () => { if (!suppressClick && i !== selected) show(i); });
    const tab = document.createElement('button'); tab.type='button'; tab.className='ss-series-btn';
    tab.innerHTML = `<small>${String(i+1).padStart(2,'0')}</small><span>${s.name} Series</span>`;
    tab.addEventListener('click',()=>show(i)); nav.append(tab);
    return button;
  });
  const tabs = [...nav.children];
  function show(index, announce=true, variantIndex=0) {
    selected = (index + series.length) % series.length; variant = variantIndex;
    const s=series[selected], p=s.products[variant];
    root.dataset.activeSeries=s.name; root.dataset.activeProduct=p.name;
    items.forEach((item,i)=> {
      let distance=(i-selected+series.length)%series.length;
      if(distance>series.length/2) distance-=series.length;
      item.dataset.position=distance; item.style.setProperty('--ss-offset',distance);
      item.tabIndex=Math.abs(distance)===1?0:-1;
      item.setAttribute('aria-hidden',Math.abs(distance)>1?'true':'false');
      const img=item.querySelector('img'), chosen=series[i].products[i===selected?variant:0];
      const src=`images/${chosen.image}`;
      if(img.getAttribute('src')!==src) {
        img.src=src; img.alt=chosen.name;
        item.classList.remove('is-variant'); void item.offsetWidth; item.classList.add('is-variant');
      }
      item.style.removeProperty('--ss-x'); item.style.removeProperty('--ss-y');
      tabs[i].setAttribute('aria-pressed',i===selected?'true':'false');
    });
    if(word.textContent!==s.word) {
      word.textContent=s.word; word.dataset.long=String(s.word.length>7); word.classList.remove('is-arriving'); void word.offsetWidth; word.classList.add('is-arriving');
    }
    details.querySelector('.ss-category').textContent=`${s.name} Series / Allstrong`;
    details.querySelector('.ss-name').textContent=p.name;
    details.querySelector('.ss-description').textContent=p.description;
    details.querySelector('.ss-cta').href=p.href;
    root.querySelector('.ss-current').textContent=String(selected+1).padStart(2,'0');
    variants.replaceChildren();
    if(s.products.length>1) s.products.forEach((v,i)=>{
      const button=document.createElement('button'); button.type='button'; button.className='ss-variant';
      button.textContent=v.label; button.setAttribute('aria-pressed',i===variant?'true':'false');
      button.addEventListener('click',()=>{
        show(selected,true,i);
        variants.children[i].focus({preventScroll:true});
      }); variants.append(button);
    });
    if(announce) status.textContent=`${s.name} series. ${p.name}. ${selected+1} of ${series.length}.`;
    if(nav.scrollWidth>nav.clientWidth) {
      const tab=tabs[selected]; nav.scrollTo({left:tab.offsetLeft-nav.offsetLeft-(nav.clientWidth-tab.clientWidth)/2,behavior:motion.matches?'instant':'smooth'});
    }
  }
  root.querySelector('.ss-arrow-prev').addEventListener('click',()=>show(selected-1));
  root.querySelector('.ss-arrow-next').addEventListener('click',()=>show(selected+1));
  root.addEventListener('keydown',e=> {
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
    e.preventDefault();
    show(e.key==='Home'?0:e.key==='End'?series.length-1:selected+(e.key==='ArrowRight'?1:-1));
    if(e.target.closest('.ss-nav')) tabs[selected].focus({preventScroll:true});
  });
  deck.addEventListener('pointerdown',e=> {
    if(e.button!==0 || e.target.closest('.ss-arrow')) return;
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY}; suppressClick=false;
  });
  deck.addEventListener('pointermove',e=>{
    if(pointer) {
      if(Math.abs(e.clientX-pointer.x)>12) {suppressClick=true;deck.classList.add('is-dragging');}
      return;
    }
    if(motion.matches || e.pointerType!=='mouse') return;
    const r=deck.getBoundingClientRect();
    items[selected].style.setProperty('--ss-x',`${((e.clientX-r.left)/r.width-.5)*12}px`);
    items[selected].style.setProperty('--ss-y',`${((e.clientY-r.top)/r.height-.5)*7}px`);
  });
  function endDrag(e,cancelled=false) {
    if(!pointer || pointer.id!==e.pointerId) return;
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
    if(!cancelled && Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) show(selected+(dx<0?1:-1));
    pointer=null;deck.classList.remove('is-dragging');
    setTimeout(()=>{suppressClick=false;},0);
  }
  window.addEventListener('pointerup',e=>endDrag(e));
  window.addEventListener('pointercancel',e=>endDrag(e,true));
  deck.addEventListener('pointerleave',()=>{items[selected].style.setProperty('--ss-x','0px');items[selected].style.setProperty('--ss-y','0px');});
  show(0,false);
})();

