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
const quotes=['“Ficou incrível.<br>A luz ficou perfeita.”','“Eu amei muito.<br>Foi o melhor até hoje.”','“Eu amei e<br>todo mundo amou!!”'];let quoteIndex=0;function changeQuote(direction){quoteIndex=(quoteIndex+direction+quotes.length)%quotes.length;document.querySelector('#quote-text').innerHTML=quotes[quoteIndex];}document.querySelector('#quote-prev').addEventListener('click',()=>changeQuote(-1));document.querySelector('#quote-next').addEventListener('click',()=>changeQuote(1));
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
