document.documentElement.classList.add('js');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo=document.querySelector('#hero-video');const previewToggle=document.querySelector('#preview-toggle');const previews=[...document.querySelectorAll('.film-preview')];
let previewsEnabled=!reducedMotion.matches,heroEnabled=!reducedMotion.matches,dialogOpen=false;
async function safePlay(video){try{await video.play();}catch{/* A user can start playback using the visible controls. */}}
const mediaObserver=new IntersectionObserver(entries=>{for(const entry of entries){const video=entry.target;video.dataset.visible=String(entry.isIntersecting);const enabled=video===heroVideo?heroEnabled:previewsEnabled;if(entry.isIntersecting&&enabled&&!document.hidden&&!dialogOpen)safePlay(video);else video.pause();}},{threshold:.2});[heroVideo,...previews].forEach(video=>mediaObserver.observe(video));
function syncMedia(){[heroVideo,...previews].forEach(video=>{const enabled=video===heroVideo?heroEnabled:previewsEnabled;if(video.dataset.visible==='true'&&enabled&&!dialogOpen&&!document.hidden)safePlay(video);else video.pause();});}
function syncPreviewButton(){previewToggle.textContent=previewsEnabled?'Pausar prévias':'Reproduzir prévias';previewToggle.setAttribute('aria-pressed',String(previewsEnabled));}previewToggle.addEventListener('click',()=>{previewsEnabled=!previewsEnabled;syncPreviewButton();syncMedia();});syncPreviewButton();
document.addEventListener('visibilitychange',()=>{syncMedia();if(document.hidden)player.pause();});reducedMotion.addEventListener('change',()=>{heroEnabled=!reducedMotion.matches;previewsEnabled=!reducedMotion.matches;syncPreviewButton();syncMedia();});
const menuToggle=document.querySelector('.menu-toggle'),mobileMenu=document.querySelector('#mobile-menu');function closeMenu(){mobileMenu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menu');}menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';mobileMenu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){closeMenu();menuToggle.focus();}});
const dialog=document.querySelector('#film-dialog'),player=document.querySelector('#film-player'),playbackMessage=document.querySelector('#playback-message');const films={'1':{title:'Os três anos da Liz.',file:'filme-01'},'2':{title:'Beleza em movimento.',file:'filme-02'},'3':{title:'Um dia de fé.',file:'filme-03'},'4':{title:'Memória viva.',file:'filme-04'}};let previousFocus;
document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',async()=>{const film=films[button.dataset.film];previousFocus=button;document.querySelector('#film-title').textContent=film.title;player.src=`assets/${film.file}.mp4`;player.poster=`assets/${film.file}-poster.jpg`;player.setAttribute('aria-label',film.title);player.muted=false;player.currentTime=0;playbackMessage.hidden=true;dialogOpen=true;syncMedia();dialog.showModal();try{await player.play();}catch{playbackMessage.textContent='Toque no botão de reprodução do vídeo para começar.';playbackMessage.hidden=false;}}));player.addEventListener('error',()=>{playbackMessage.textContent='Não foi possível carregar este filme. Confira sua conexão e tente abrir novamente.';playbackMessage.hidden=false;});
dialog.querySelector('.close-player').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();dialogOpen=false;syncMedia();previousFocus?.focus();});dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}});},{threshold:.07});document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));
const hero=document.querySelector('.hero'),manifesto=document.querySelector('.manifesto'),words=[...document.querySelectorAll('.manifesto-text span,.manifesto-text em')];let ticking=false;
function updateScroll(){ticking=false;const total=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--read',String(total>0?scrollY/total:0));if(reducedMotion.matches)return;const heroRect=hero.getBoundingClientRect();if(heroRect.bottom>0){const progress=Math.min(1,Math.max(0,-heroRect.top/heroRect.height));hero.style.setProperty('--hero-scale',String(1.02+progress*.12));hero.style.setProperty('--hero-shift',`${progress*55}px`);hero.style.setProperty('--name-shift',`${progress*90}px`);}const r=manifesto.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const progress=Math.min(1,Math.max(0,(innerHeight*.75-r.top)/(r.height*.7)));words.forEach((word,i)=>word.style.setProperty('--word-opacity',String(Math.min(1,Math.max(.2,(progress-i*.14)*3.7)))));}}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}},{passive:true});addEventListener('resize',updateScroll);updateScroll();document.querySelector('#year').textContent=new Date().getFullYear();

// Copy contact details only after a deliberate click.
const emailButton=document.querySelector('#copy-email');
const phoneButton=document.querySelector('#copy-phone');
const copyStatus=document.querySelector('#copy-status');
const resetTimers=new Map();
let statusTimer;
async function copyContactText(text,trigger){
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch{}
  const field=document.createElement('textarea');
  field.value=text;field.setAttribute('readonly','');field.setAttribute('aria-hidden','true');
  field.style.cssText='position:fixed;top:0;left:-9999px;opacity:0;font-size:16px';
  document.body.append(field);field.select();field.setSelectionRange(0,text.length);
  let copied=false;
  try{copied=document.execCommand('copy');}catch{}
  field.remove();trigger.focus({preventScroll:true});
  return copied;
}
function bindContactCopy(button,text,label){
  button.addEventListener('click',async()=>{
    const copied=await copyContactText(text,button);
    clearTimeout(resetTimers.get(button));clearTimeout(statusTimer);
    button.classList.toggle('copied',copied);
    copyStatus.textContent=copied?`${label} copiado.`:`Não foi possível copiar. Selecione o ${label.toLowerCase()} e copie manualmente.`;
    resetTimers.set(button,setTimeout(()=>button.classList.remove('copied'),3500));
    statusTimer=setTimeout(()=>{copyStatus.textContent='';},5000);
  });
}
bindContactCopy(emailButton,emailButton.dataset.email,'E-mail');
bindContactCopy(phoneButton,phoneButton.dataset.phone,'Telefone');

// Keep sections centered briefly using native sticky positioning, without
// intercepting wheel/touch input. Tall sections remain readable to their end.
const scenes=[];
document.querySelectorAll('main>section:not(.manifesto)').forEach(section=>{
  const shell=document.createElement('div');
  shell.className='scene-shell';
  section.before(shell);shell.append(section);
  shell.style.setProperty('--scene-background',getComputedStyle(section).backgroundColor==='rgba(0, 0, 0, 0)'?'var(--paper)':getComputedStyle(section).backgroundColor);
  scenes.push({section,shell});
});
let sceneFrame;
function sizeScenes(){
  cancelAnimationFrame(sceneFrame);
  sceneFrame=requestAnimationFrame(()=>{
    const viewport=document.documentElement.clientHeight;
    const hold=Math.round(viewport*(innerWidth<=700?.18:.28));
    scenes.forEach(({section,shell})=>{
      const height=section.getBoundingClientRect().height;
      shell.style.setProperty('--scene-height',`${Math.max(viewport,height)}px`);
      shell.style.setProperty('--scene-hold',reducedMotion.matches?'0px':`${hold}px`);
      // Short sections pin at the center; long sections pin after the last
      // portion of their content has entered the viewport.
      shell.style.setProperty('--scene-top',`${height<=viewport?(viewport-height)/2:viewport-height}px`);
    });
    updateScroll();
  });
}
const sceneResizeObserver=new ResizeObserver(sizeScenes);
scenes.forEach(({section})=>sceneResizeObserver.observe(section));
addEventListener('resize',sizeScenes);
reducedMotion.addEventListener('change',sizeScenes);
document.fonts.ready.then(sizeScenes);
sizeScenes();
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const hash=link.getAttribute('href');
  if(hash==='#'||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const target=document.getElementById(hash.slice(1));
  if(!target)return;
  const shell=target.closest('.scene-shell');
  if(!shell)return;
  event.preventDefault();
  history.pushState(null,'',hash);
  const top=shell.getBoundingClientRect().top+scrollY;
  window.scrollTo({top,behavior:reducedMotion.matches?'instant':'smooth'});
}));

// Client messages: native touch scrolling, optional mouse drag, no autoplay.
const feedbackRail=document.querySelector('#feedback-rail');
const feedbackPrev=document.querySelector('#feedback-prev');
const feedbackNext=document.querySelector('#feedback-next');
function updateFeedbackControls(){
  const end=Math.max(0,feedbackRail.scrollWidth-feedbackRail.clientWidth);
  feedbackPrev.disabled=feedbackRail.scrollLeft<=2;
  feedbackNext.disabled=feedbackRail.scrollLeft>=end-2;
}
function moveFeedback(direction){
  const card=feedbackRail.querySelector('.feedback-card');
  const gap=parseFloat(getComputedStyle(feedbackRail).columnGap)||24;
  feedbackRail.scrollBy({left:direction*(card.offsetWidth+gap),behavior:reducedMotion.matches?'instant':'smooth'});
}
feedbackPrev.addEventListener('click',()=>moveFeedback(-1));
feedbackNext.addEventListener('click',()=>moveFeedback(1));
feedbackRail.addEventListener('scroll',updateFeedbackControls,{passive:true});
feedbackRail.addEventListener('keydown',event=>{
  if(event.target!==feedbackRail)return;
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
    event.preventDefault();moveFeedback(event.key==='ArrowLeft'?-1:1);
  }
});
let feedbackDrag=null;
feedbackRail.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0||event.target.closest('button,a'))return;
  feedbackDrag={x:event.clientX,left:feedbackRail.scrollLeft,id:event.pointerId};
  feedbackRail.setPointerCapture(event.pointerId);
});
feedbackRail.addEventListener('pointermove',event=>{
  if(!feedbackDrag)return;
  const distance=event.clientX-feedbackDrag.x;
  if(Math.abs(distance)>5){
    feedbackRail.classList.add('dragging');
    feedbackRail.scrollLeft=feedbackDrag.left-distance;
    event.preventDefault();
  }
});
function endFeedbackDrag(){feedbackDrag=null;feedbackRail.classList.remove('dragging');updateFeedbackControls();}
feedbackRail.addEventListener('pointerup',endFeedbackDrag);
feedbackRail.addEventListener('pointercancel',endFeedbackDrag);
feedbackRail.addEventListener('lostpointercapture',endFeedbackDrag);
new ResizeObserver(updateFeedbackControls).observe(feedbackRail);
document.fonts.ready.then(updateFeedbackControls);
updateFeedbackControls();

const feedbackDialog=document.querySelector('#feedback-dialog');
const feedbackOriginal=document.querySelector('#feedback-original');
let feedbackTrigger;
document.querySelectorAll('[data-message]').forEach(button=>button.addEventListener('click',()=>{
  feedbackTrigger=button;
  feedbackOriginal.src=button.dataset.message;
  dialogOpen=true;syncMedia();feedbackDialog.showModal();
}));
feedbackDialog.querySelector('.message-close').addEventListener('click',()=>feedbackDialog.close());
feedbackDialog.addEventListener('close',()=>{dialogOpen=false;syncMedia();feedbackTrigger?.focus({preventScroll:true});});
feedbackDialog.addEventListener('click',event=>{
  if(event.target!==feedbackDialog)return;
  const box=feedbackDialog.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)feedbackDialog.close();
});

// Desktop film sequence: copy arrives first; each portrait rises afterward.
// Native page scrolling is preserved; mobile uses its original card layout.
const desktopFilmStories=matchMedia('(min-width:701px)');
const filmStories=[...document.querySelectorAll('.film-card')];
const clampProgress=value=>Math.max(0,Math.min(1,value));
let filmStoryFrame=false;
function paintFilmStories(){
  filmStoryFrame=false;
  const animated=desktopFilmStories.matches&&!reducedMotion.matches;
  const viewport=document.documentElement.clientHeight;
  filmStories.forEach(card=>{
    const media=card.querySelector('.film-open');
    if(!animated){
      ['--film-rise','--film-opacity','--story-opacity','--story-shift'].forEach(property=>card.style.removeProperty(property));
      media.inert=false;
      return;
    }
    const box=card.getBoundingClientRect();
    const travel=Math.max(1,box.height-viewport);
    const progress=clampProgress(-box.top/travel);
    const videoProgress=clampProgress((progress-.12)/.68);
    const eased=1-Math.pow(1-videoProgress,3);
    const copyProgress=clampProgress((viewport*.85-box.top)/(viewport*.6));
    card.style.setProperty('--film-rise',`${(1-eased)*viewport*.92}px`);
    card.style.setProperty('--film-opacity',String(clampProgress(videoProgress*1.8)));
    card.style.setProperty('--story-opacity',String(copyProgress));
    card.style.setProperty('--story-shift',`${(1-copyProgress)*30}px`);
    media.inert=videoProgress<.04;
  });
}
function queueFilmStories(){if(!filmStoryFrame){filmStoryFrame=true;requestAnimationFrame(paintFilmStories);}}
addEventListener('scroll',queueFilmStories,{passive:true});
addEventListener('resize',queueFilmStories);
desktopFilmStories.addEventListener('change',()=>{sizeScenes();queueFilmStories();});
reducedMotion.addEventListener('change',queueFilmStories);
document.fonts.ready.then(queueFilmStories);
paintFilmStories();
