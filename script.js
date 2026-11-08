document.documentElement.classList.add('js');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo=document.querySelector('#hero-video');const previews=[...document.querySelectorAll('.film-preview')];
let previewsEnabled=!reducedMotion.matches,heroEnabled=!reducedMotion.matches,dialogOpen=false;
async function safePlay(video){try{await video.play();}catch{/* A user can start playback using the visible controls. */}}
const mediaObserver=new IntersectionObserver(entries=>{for(const entry of entries){const video=entry.target;video.dataset.visible=String(entry.isIntersecting);const enabled=video===heroVideo?heroEnabled:previewsEnabled;if(entry.isIntersecting&&enabled&&!document.hidden&&!dialogOpen)safePlay(video);else video.pause();}},{threshold:.2});[heroVideo,...previews].forEach(video=>mediaObserver.observe(video));
function syncMedia(){[heroVideo,...previews].forEach(video=>{const enabled=video===heroVideo?heroEnabled:previewsEnabled;if(video.dataset.visible==='true'&&enabled&&!dialogOpen&&!document.hidden)safePlay(video);else video.pause();});}
document.addEventListener('visibilitychange',()=>{syncMedia();if(document.hidden)player.pause();});reducedMotion.addEventListener('change',()=>{heroEnabled=!reducedMotion.matches;previewsEnabled=!reducedMotion.matches;syncMedia();});
const menuToggle=document.querySelector('.menu-toggle'),mobileMenu=document.querySelector('#mobile-menu');
let menuAnimation;
function setMenuPageState(open){
  document.body.classList.toggle('menu-open',open);
  document.querySelector('main').inert=open;
  document.querySelector('.whatsapp-float').inert=open;
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
}
function closeMenu({restoreFocus=true,animate=true}={}){
  if(mobileMenu.hidden)return;
  menuAnimation?.cancel();
  const finish=()=>{mobileMenu.hidden=true;setMenuPageState(false);if(restoreFocus)menuToggle.focus({preventScroll:true});};
  if(reducedMotion.matches||!animate){finish();return;}
  const motion=mobileMenu.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-8px)'}],{duration:160,easing:'ease-in'});
  menuAnimation=motion;motion.finished.then(finish).catch(()=>{});
}
function openMenu(){
  menuAnimation?.cancel();mobileMenu.hidden=false;setMenuPageState(true);
  if(!reducedMotion.matches){
    menuAnimation=mobileMenu.animate([{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'});
    menuAnimation.finished.catch(()=>{});
  }
  mobileMenu.querySelector('a').focus({preventScroll:true});
}
menuToggle.addEventListener('click',()=>menuToggle.getAttribute('aria-expanded')==='true'?closeMenu():openMenu());
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu({restoreFocus:false,animate:false})));
document.querySelector('.brand').addEventListener('click',()=>closeMenu({restoreFocus:false,animate:false}));
document.addEventListener('keydown',event=>{
  if(mobileMenu.hidden)return;
  if(event.key==='Escape'){event.preventDefault();closeMenu();return;}
  if(event.key==='Tab'){
    const controls=[menuToggle,...mobileMenu.querySelectorAll('a')];
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
matchMedia('(min-width:701px)').addEventListener('change',event=>{if(event.matches)closeMenu({restoreFocus:false,animate:false});});

const dialogMotions=new WeakMap();
function openSoftDialog(modal){
  dialogMotions.get(modal)?.animation?.cancel();
  modal.classList.remove('modal-leaving');modal.classList.add('modal-arriving');
  if(!modal.open)modal.showModal();
  const state={closing:false};dialogMotions.set(modal,state);
  if(reducedMotion.matches){modal.classList.remove('modal-arriving');return;}
  const cinema=modal.id==='film-dialog';
  const frames=cinema?[{opacity:0,transform:'translateY(32px) scale(.86)'},{opacity:1,transform:'translateY(10px) scale(.95)',offset:.55},{opacity:1,transform:'translateY(0) scale(1)'}]:[{opacity:0,transform:'translateY(18px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}];
  state.animation=modal.animate(frames,{duration:cinema?500:340,easing:'cubic-bezier(.22,.65,.3,1)'});
  state.animation.finished.then(()=>modal.classList.remove('modal-arriving')).catch(()=>{});
}
async function closeSoftDialog(modal){
  const previous=dialogMotions.get(modal);
  if(!modal.open||previous?.closing)return;
  const current=getComputedStyle(modal);
  const from={opacity:current.opacity,transform:current.transform};
  previous?.animation?.cancel();
  const state={closing:true};dialogMotions.set(modal,state);
  modal.dispatchEvent(new Event('closing'));
  modal.classList.remove('modal-arriving');modal.classList.add('modal-leaving');
  if(!reducedMotion.matches){
    const cinema=modal.id==='film-dialog';
    state.animation=modal.animate([from,{opacity:0,transform:cinema?'translateY(20px) scale(.93)':'translateY(12px) scale(.985)'}],{duration:cinema?280:220,easing:'cubic-bezier(.4,0,1,1)'});
    await state.animation.finished.catch(()=>{});
  }
  if(dialogMotions.get(modal)===state&&modal.open)modal.close();
}
document.querySelectorAll('dialog').forEach(modal=>{
  modal.addEventListener('cancel',event=>{event.preventDefault();closeSoftDialog(modal);});
  modal.addEventListener('close',()=>{dialogMotions.get(modal)?.animation?.cancel();dialogMotions.delete(modal);modal.classList.remove('modal-arriving','modal-leaving');});
});
const dialog=document.querySelector('#film-dialog'),player=document.querySelector('#film-player'),playbackMessage=document.querySelector('#playback-message');const films={'1':{title:'Os três anos da Liz.',file:'filme-01'},'2':{title:'Beleza em movimento.',file:'filme-02'},'3':{title:'Um dia de fé.',file:'filme-03'},'4':{title:'Memória viva.',file:'filme-04'}};let previousFocus;
document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',async()=>{const film=films[button.dataset.film];previousFocus=button;document.querySelector('#film-title').textContent=film.title;player.src=`assets/${film.file}.mp4`;player.poster=`assets/${film.file}-poster.jpg`;player.setAttribute('aria-label',film.title);player.muted=false;player.currentTime=0;playbackMessage.hidden=true;dialogOpen=true;syncMedia();openSoftDialog(dialog);try{await player.play();}catch{playbackMessage.textContent='Toque no botão de reprodução do vídeo para começar.';playbackMessage.hidden=false;}}));player.addEventListener('error',()=>{playbackMessage.textContent='Não foi possível carregar este filme. Confira sua conexão e tente abrir novamente.';playbackMessage.hidden=false;});
dialog.addEventListener('closing',()=>player.pause());
dialog.querySelector('.close-player').addEventListener('click',()=>closeSoftDialog(dialog));dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();dialogOpen=false;syncMedia();previousFocus?.focus({preventScroll:true});});dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeSoftDialog(dialog);}});
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}});},{threshold:.07});document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));
const hero=document.querySelector('.hero'),manifesto=document.querySelector('.manifesto'),words=[...document.querySelectorAll('.manifesto-text>span,.manifesto-text>em')];let ticking=false;
function updateScroll(){ticking=false;const total=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--read',String(total>0?scrollY/total:0));if(reducedMotion.matches)return;const heroRect=hero.getBoundingClientRect();if(heroRect.bottom>0){const progress=Math.min(1,Math.max(0,-heroRect.top/heroRect.height));hero.style.setProperty('--hero-scale',String(1.02+progress*.12));hero.style.setProperty('--hero-shift',`${progress*55}px`);hero.style.setProperty('--name-shift',`${progress*90}px`);}const r=manifesto.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const progress=Math.min(1,Math.max(0,(innerHeight*.92-r.top)/(innerHeight*.52)));words.forEach((word,i)=>word.style.setProperty('--word-opacity',String(Math.min(1,Math.max(.2,(progress-i*.035)*1.2)))));}}
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
document.querySelectorAll('main>section:not(.about-collage)').forEach(section=>{
  const shell=document.createElement('div');
  shell.className='scene-shell';
  if(section.classList.contains('hero'))shell.classList.add('hero-scene');
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
  event.preventDefault();
  history.pushState(null,'',hash);
  const top=(shell||target).getBoundingClientRect().top+scrollY;
  const heading=target.querySelector('h1,h2');
  const focusTarget=heading&&!heading.classList.contains('sr-only')?heading:target;
  focusTarget.setAttribute('tabindex','-1');focusTarget.focus({preventScroll:true});
  window.scrollTo({top,behavior:reducedMotion.matches?'instant':'smooth'});
}));

// A seamless ribbon with direct dragging, press-to-pause and native vertical touch scroll.
const feedbackRail=document.querySelector('#feedback-rail');
const feedbackTrack=feedbackRail.querySelector('.feedback-track');
const feedbackGroup=feedbackRail.querySelector('.feedback-group');
const feedbackClone=feedbackGroup.cloneNode(true);
feedbackClone.setAttribute('aria-hidden','true');
feedbackClone.querySelectorAll('button').forEach(button=>button.tabIndex=-1);
feedbackTrack.append(feedbackClone);
feedbackTrack.querySelectorAll('img').forEach(image=>image.draggable=false);
const feedbackMotion=document.querySelector('#feedback-motion');
let feedbackPaused=false,feedbackVisible=false,feedbackHeld=false,feedbackDrag=null;
let feedbackPeriod=0,feedbackPosition=0,feedbackVelocity=0,feedbackFrame=0,feedbackLastTime=0;
let feedbackBlockClickUntil=0;
function paintFeedback(){
  if(!feedbackPeriod)return;
  if(reducedMotion.matches)feedbackPosition=Math.max(0,Math.min(feedbackPosition,Math.max(0,feedbackPeriod-feedbackRail.clientWidth)));
  else feedbackPosition=((feedbackPosition%feedbackPeriod)+feedbackPeriod)%feedbackPeriod;
  feedbackTrack.style.transform=`translate3d(${-feedbackPosition}px,0,0)`;
}
function feedbackKeyboardFocus(){return feedbackRail.contains(document.activeElement)&&document.activeElement.matches(':focus-visible');}
function tickFeedback(time){
  feedbackFrame=0;
  if(reducedMotion.matches||feedbackPaused||feedbackHeld||!feedbackVisible||document.hidden||feedbackRail.classList.contains('is-reading')||feedbackKeyboardFocus())return;
  const elapsed=feedbackLastTime?Math.min(48,time-feedbackLastTime):0;
  feedbackLastTime=time;
  if(Math.abs(feedbackVelocity)>.012){
    feedbackPosition-=feedbackVelocity*elapsed;
    feedbackVelocity*=Math.exp(-elapsed/220);
  }else{feedbackVelocity=0;feedbackPosition-=feedbackPeriod/90000*elapsed;}
  paintFeedback();feedbackFrame=requestAnimationFrame(tickFeedback);
}
function startFeedback(){if(!feedbackFrame){feedbackLastTime=0;feedbackFrame=requestAnimationFrame(tickFeedback);}}
function syncFeedbackMotion(){
  feedbackRail.classList.toggle('is-paused',feedbackPaused);
  feedbackMotion.setAttribute('aria-pressed',String(feedbackPaused));
  feedbackMotion.setAttribute('aria-label',feedbackPaused?'Reproduzir carrossel':'Pausar carrossel');
  feedbackMotion.hidden=reducedMotion.matches;
  startFeedback();
}
function measureFeedback(){
  const ratio=feedbackPeriod?feedbackPosition/feedbackPeriod:0;
  feedbackPeriod=feedbackGroup.getBoundingClientRect().width;
  feedbackPosition=feedbackPeriod*ratio;paintFeedback();startFeedback();
}
feedbackMotion.addEventListener('click',()=>{feedbackPaused=!feedbackPaused;syncFeedbackMotion();});
new IntersectionObserver(entries=>{
  feedbackVisible=entries[0].isIntersecting;
  if(!feedbackVisible)feedbackVelocity=0;
  startFeedback();
}).observe(feedbackRail);
new ResizeObserver(measureFeedback).observe(feedbackGroup);
document.fonts.ready.then(measureFeedback);
document.addEventListener('visibilitychange',startFeedback);
reducedMotion.addEventListener('change',()=>{feedbackPosition=0;feedbackVelocity=0;measureFeedback();syncFeedbackMotion();});
feedbackRail.addEventListener('dragstart',event=>event.preventDefault());
feedbackRail.addEventListener('contextmenu',event=>{if(feedbackHeld)event.preventDefault();});
feedbackRail.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
  feedbackHeld=true;feedbackVelocity=0;
  feedbackDrag={id:event.pointerId,x:event.clientX,y:event.clientY,position:feedbackPosition,lastX:event.clientX,lastTime:performance.now(),started:performance.now(),horizontal:false};
});
feedbackRail.addEventListener('pointermove',event=>{
  const drag=feedbackDrag;if(!drag||event.pointerId!==drag.id)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.horizontal){
    if(Math.abs(dy)>9&&Math.abs(dy)>Math.abs(dx)){feedbackDrag=null;feedbackHeld=false;startFeedback();return;}
    if(Math.abs(dx)<7||Math.abs(dx)<Math.abs(dy)*1.15)return;
    drag.horizontal=true;feedbackRail.classList.add('dragging');feedbackRail.setPointerCapture(event.pointerId);
  }
  if(event.cancelable)event.preventDefault();
  const now=performance.now(),elapsed=Math.max(1,now-drag.lastTime);
  feedbackVelocity=Math.max(-2.5,Math.min(2.5,(event.clientX-drag.lastX)/elapsed));
  feedbackPosition=drag.position-dx;paintFeedback();
  drag.lastX=event.clientX;drag.lastTime=now;
});
function endFeedbackPointer(event){
  const drag=feedbackDrag;if(!drag||event.pointerId!==drag.id)return;
  const now=performance.now();
  if(drag.horizontal||now-drag.started>350)feedbackBlockClickUntil=now+450;
  if(!drag.horizontal||event.type==='pointercancel'||now-drag.lastTime>80)feedbackVelocity=0;
  feedbackDrag=null;feedbackHeld=false;feedbackRail.classList.remove('dragging');
  if(feedbackRail.hasPointerCapture(event.pointerId))feedbackRail.releasePointerCapture(event.pointerId);
  startFeedback();
}
feedbackRail.addEventListener('pointerup',endFeedbackPointer);
feedbackRail.addEventListener('pointercancel',endFeedbackPointer);
feedbackRail.addEventListener('lostpointercapture',endFeedbackPointer);
window.addEventListener('pointerup',endFeedbackPointer);
window.addEventListener('pointercancel',endFeedbackPointer);
window.addEventListener('blur',()=>{if(feedbackDrag)endFeedbackPointer({pointerId:feedbackDrag.id,type:'pointercancel'});});
feedbackRail.addEventListener('focusin',event=>{
  if(!event.target.matches(':focus-visible'))return;
  feedbackRail.scrollLeft=0;feedbackVelocity=0;
  const button=event.target.closest('[data-message]');
  if(button&&feedbackGroup.contains(button)){
    const cards=[...feedbackGroup.children],index=cards.indexOf(button.closest('.feedback-card'));
    const gap=parseFloat(getComputedStyle(feedbackGroup).columnGap)||28;
    feedbackPosition=index*(cards[0].getBoundingClientRect().width+gap);paintFeedback();
  }
});
feedbackRail.addEventListener('focusout',()=>queueMicrotask(startFeedback));
feedbackRail.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();feedbackVelocity=0;
  const card=feedbackGroup.querySelector('.feedback-card');
  const gap=parseFloat(getComputedStyle(feedbackGroup).columnGap)||28;
  feedbackPosition+=(event.key==='ArrowRight'?1:-1)*(card.getBoundingClientRect().width+gap);paintFeedback();
});
measureFeedback();syncFeedbackMotion();

const feedbackDialog=document.querySelector('#feedback-dialog');
const feedbackOriginal=document.querySelector('#feedback-original');
let feedbackTrigger;
feedbackRail.addEventListener('click',event=>{
  if(performance.now()<feedbackBlockClickUntil){event.preventDefault();event.stopPropagation();return;}
  const button=event.target.closest('[data-message]');
  if(!button)return;
  feedbackRail.classList.add('is-reading');
  feedbackTrigger=feedbackGroup.querySelector(`[data-message="${button.dataset.message}"]`)||button;
  feedbackOriginal.src=button.dataset.message;
  dialogOpen=true;syncMedia();openSoftDialog(feedbackDialog);
});
feedbackDialog.querySelector('.message-close').addEventListener('click',()=>closeSoftDialog(feedbackDialog));
feedbackDialog.addEventListener('close',()=>{feedbackRail.classList.remove('is-reading');dialogOpen=false;syncMedia();feedbackTrigger?.focus({preventScroll:true});startFeedback();});
feedbackDialog.addEventListener('click',event=>{
  if(event.target!==feedbackDialog)return;
  const box=feedbackDialog.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeSoftDialog(feedbackDialog);
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
    const videoProgress=clampProgress((progress-.10)/.82);
    const eased=videoProgress*videoProgress*(3-2*videoProgress);
    const copyProgress=clampProgress((viewport*.85-box.top)/(viewport*.6));
    card.style.setProperty('--film-rise',`${(1-eased)*viewport*.92}px`);
    card.style.setProperty('--film-opacity',String(clampProgress(videoProgress*1.6)));
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

// The portrait arrives first, followed by the copy; movement follows scroll position.
const aboutSection=document.querySelector('#sobre');
const aboutPortrait=aboutSection.querySelector('.portrait');
const aboutCopy=aboutSection.querySelector('.about-copy');
let aboutFrame=false;
function paintAbout(){
  aboutFrame=false;
  if(reducedMotion.matches){
    ['--portrait-rise','--portrait-opacity','--copy-rise','--copy-opacity'].forEach(name=>aboutSection.style.removeProperty(name));
    return;
  }
  const viewport=document.documentElement.clientHeight;
  const photoProgress=clampProgress((viewport*.97-aboutPortrait.getBoundingClientRect().top)/(viewport*.7));
  const copyProgress=clampProgress((viewport*.94-aboutCopy.getBoundingClientRect().top)/(viewport*.65));
  const ease=value=>1-Math.pow(1-value,3);
  aboutSection.style.setProperty('--portrait-rise',`${(1-ease(photoProgress))*90}px`);
  aboutSection.style.setProperty('--portrait-opacity',String(clampProgress(photoProgress*2)));
  aboutSection.style.setProperty('--copy-rise',`${(1-ease(copyProgress))*60}px`);
  aboutSection.style.setProperty('--copy-opacity',String(clampProgress(copyProgress*2)));
}
function queueAbout(){if(!aboutFrame){aboutFrame=true;requestAnimationFrame(paintAbout);}}
addEventListener('scroll',queueAbout,{passive:true});
addEventListener('resize',queueAbout);
reducedMotion.addEventListener('change',queueAbout);
document.fonts.ready.then(queueAbout);
paintAbout();

// Keep the opening invitation clear; expand the WhatsApp label afterward.
new IntersectionObserver(entries=>{
  document.body.classList.toggle('viewing-opening',entries[0].isIntersecting);
}).observe(hero);

// Align the visible rightmost ink, not the advance boxes or a guessed offset.
const portraitNameplate=document.querySelector('.portrait-nameplate');
const portraitName=portraitNameplate.querySelector('.portrait-name');
const portraitCaption=portraitNameplate.querySelector('.portrait-caption');
const portraitTypeMeasure=document.createElement('canvas').getContext('2d');
let captionAlignmentFrame=0;
function typeInkRight(element){
  const style=getComputedStyle(element),box=element.getBoundingClientRect();
  const text=element.textContent.trim();
  portraitTypeMeasure.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  portraitTypeMeasure.fontKerning=style.fontKerning;
  if('letterSpacing' in portraitTypeMeasure)portraitTypeMeasure.letterSpacing='0px';
  const metrics=portraitTypeMeasure.measureText(text);
  return box.left+(metrics.actualBoundingBoxRight??metrics.width)+(parseFloat(style.letterSpacing)||0)*Math.max(0,text.length-1);
}
function alignPortraitCaption(){
  captionAlignmentFrame=0;
  const current=parseFloat(portraitNameplate.style.getPropertyValue('--caption-ink-shift'))||0;
  const correction=typeInkRight(portraitName)-(typeInkRight(portraitCaption)-current);
  portraitNameplate.style.setProperty('--caption-ink-shift',`${Math.round(correction*100)/100}px`);
}
function queueCaptionAlignment(){if(!captionAlignmentFrame)captionAlignmentFrame=requestAnimationFrame(alignPortraitCaption);}
new ResizeObserver(queueCaptionAlignment).observe(portraitNameplate);
addEventListener('resize',queueCaptionAlignment);
document.fonts.ready.then(queueCaptionAlignment);
document.fonts.addEventListener('loadingdone',queueCaptionAlignment);
queueCaptionAlignment();
