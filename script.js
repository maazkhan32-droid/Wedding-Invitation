const preloader=document.getElementById('preloader');
const welcome=document.getElementById('welcome');
const invitation=document.getElementById('invitation');
const openingLoader=document.getElementById('openingLoader');
const enterButton=document.getElementById('enterInvitation');
const rig=document.getElementById('lanternRig');
const hanger=document.getElementById('hanger');
const rope=document.getElementById('rope');
const hit=document.getElementById('lanternHit');
const backgroundMusic=document.getElementById('backgroundMusic');
const musicToggle=document.getElementById('musicToggle');
const scrollHintArrows=document.getElementById('scrollHintArrows');
const cfg=window.WEDDING_CONFIG||{};
let musicMuted=false;
function setText(key,value){document.querySelectorAll(`[data-wedding="${key}"]`).forEach(el=>el.textContent=value??'');}
function setHref(key,value){document.querySelectorAll(`[data-wedding-href="${key}"]`).forEach(el=>el.href=value||'#');}
function dateParts(iso){
  if(!iso) return {day:'',month:'',year:'',long:'',welcome:''};
  const d=new Date(`${iso}T12:00:00`);
  if(Number.isNaN(d.getTime())) return {day:'',month:'',year:'',long:'',welcome:''};
  const months=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const longMonths=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return {day:String(d.getDate()).padStart(2,'0'),month:months[d.getMonth()],year:String(d.getFullYear()),long:`${d.getDate()} ${longMonths[d.getMonth()]} ${d.getFullYear()}`,welcome:`${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`};
}
function applyWeddingConfig(){
  const n=dateParts(cfg.nikah?.date), w=dateParts(cfg.walima?.date);
  const groom=cfg.groom?.name||'', bride=cfg.bride?.name||'';
  const groomInitial=cfg.initials?.groom||groom.trim().charAt(0)||'G', brideInitial=cfg.initials?.bride||bride.trim().charAt(0)||'B';
  setText('groomName',groom); setText('brideName',bride);
  setText('groomShort',groom); setText('brideShort',bride);
  setText('groomFather',cfg.groom?.father?`(S/O ${cfg.groom.father})`:''); setText('brideFather',cfg.bride?.father?`(D/O ${cfg.bride.father})`:'');
  setText('groomInitial',groomInitial.toUpperCase()); setText('brideInitial',brideInitial.toUpperCase());
  setText('welcomeDate',n.welcome); setText('mainDate',n.day&&n.month&&n.year?`${n.day} · ${n.month} · ${n.year}`:'');
  setText('welcomeTime',cfg.nikah?.time); setText('welcomeVenue',cfg.nikah?.venue); setText('welcomeCity',(cfg.nikah?.address||'').split(',')[0]);
  setText('nikahDay',n.day); setText('nikahMonth',n.month); setText('nikahYear',n.year); setText('nikahTime',cfg.nikah?.time); setText('nikahVenue',cfg.nikah?.venue); setText('nikahAddress',(cfg.nikah?.address||'').replace(/\n/g,' ')); document.querySelectorAll('.venue-map-btn').forEach(a=>a.href=cfg.nikah?.map||'#');
  setText('walimaDay',w.day); setText('walimaMonth',w.month); setText('walimaYear',w.year); setText('walimaTime',cfg.walima?.time); setText('walimaVenue',cfg.walima?.venue); setText('walimaAddress',(cfg.walima?.address||'').replace(/\n/g,' ')); document.querySelectorAll('.gold-btn').forEach(a=>{if(a.textContent.includes('WALIMA LOCATION'))a.href=cfg.walima?.map||'#'}); document.querySelectorAll('.outline-btn').forEach(a=>a.href=cfg.walima?.map||'#');
  setText('countdownDateLabel',n.long); setText('countdownTime',cfg.nikah?.time); setText('footerYear',n.year);
  const family=cfg.familySurname?`Invitation from the ${cfg.familySurname} Family`:''; setText('familyInvitation',family);
  const tel='tel:'+(cfg.contact?.phone||'').replace(/[^0-9+]/g,''); document.querySelectorAll('.contact-call').forEach(a=>{a.href=tel;a.setAttribute('aria-label',`Get in touch with the ${cfg.familySurname||'family'}`)});
  const wb=document.querySelector('.first-page-art'); if(wb&&cfg.assets?.welcomeBackground) wb.style.setProperty('--welcome-bg',`url("${cfg.assets.welcomeBackground}")`);
  const ib=document.querySelector('.invitation-fixed-bg'); if(ib&&cfg.assets?.invitationBackground) ib.style.setProperty('--invitation-bg',`url("${cfg.assets.invitationBackground}")`);
  const couple=document.querySelector('.main-couple'); if(couple&&cfg.assets?.couple) couple.src=cfg.assets.couple;
  const photos=document.querySelectorAll('.venue-photo'); if(photos[0]&&cfg.assets?.nikahVenue) photos[0].src=cfg.assets.nikahVenue; if(photos[1]&&cfg.assets?.walimaVenue) photos[1].src=cfg.assets.walimaVenue;
  if(backgroundMusic&&cfg.assets?.music) backgroundMusic.src=cfg.assets.music;
  document.title=groom&&bride?`Wedding Invitation · ${groom} & ${bride}`:'Wedding Invitation';
  const meta=document.querySelector('meta[name="description"]'); if(meta) meta.content=groom&&bride?`The wedding invitation of ${groom} and ${bride}.`:'A cinematic wedding invitation.';
}
function updateDynamicFavicon(){
  const groomInitial=(cfg.initials?.groom||cfg.groom?.name||'G').trim().charAt(0).toUpperCase()||'G';
  const brideInitial=(cfg.initials?.bride||cfg.bride?.name||'B').trim().charAt(0).toUpperCase()||'B';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#07130f"/><rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="#c7a34e" stroke-opacity=".55"/><text x="32" y="39" text-anchor="middle" font-family="Georgia,serif" font-size="20" letter-spacing="1" fill="#f0d28a">${groomInitial}&amp;${brideInitial}</text></svg>`;
  const link=document.querySelector('link[rel="icon"]')||document.head.appendChild(Object.assign(document.createElement('link'),{rel:'icon'}));
  link.type='image/svg+xml'; link.href='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
applyWeddingConfig();
updateDynamicFavicon();

/* Intelligent name fitting: side-by-side only when the actual rendered names fit.
   Otherwise the safe stacked layout remains in place. Re-runs after fonts load and on resize. */
function updateCoupleNameLayout(){
  const welcomeNames=document.querySelector('.welcome h1');
  const mainNames=document.querySelector('#invitation .gold-names');
  const fit=(el,sideClass)=>{
    if(!el) return;
    el.classList.remove(sideClass);
    // Start from the safe stacked layout, then test the side-by-side composition.
    el.classList.add(sideClass);
    const fits=el.scrollWidth <= el.clientWidth + 1 && Array.from(el.children).every(child=>{
      const er=el.getBoundingClientRect(), cr=child.getBoundingClientRect();
      return cr.left >= er.left - 1 && cr.right <= er.right + 1;
    });
    if(!fits) el.classList.remove(sideClass);
  };
  fit(welcomeNames,'names-side-by-side');
  fit(mainNames,'names-side-by-side');
}
const scheduleNameLayout=()=>requestAnimationFrame(()=>requestAnimationFrame(updateCoupleNameLayout));
scheduleNameLayout();
window.addEventListener('resize',scheduleNameLayout,{passive:true});
if(document.fonts && document.fonts.ready){document.fonts.ready.then(scheduleNameLayout).catch(()=>{});}

const target=new Date(cfg.nikah?.countdownDateTime||'').getTime();
const countdownEls={d:[document.getElementById('fdays'),document.getElementById('days')],h:[document.getElementById('fhours'),document.getElementById('hours')],m:[document.getElementById('fminutes'),document.getElementById('minutes')],s:[document.getElementById('fseconds'),document.getElementById('seconds')]};
function updateCountdown(){const remaining=Number.isFinite(target)?Math.max(0,target-Date.now()):0;const d=Math.floor(remaining/86400000),h=Math.floor(remaining%86400000/3600000),m=Math.floor(remaining%3600000/60000),s=Math.floor(remaining%60000/1000);[[d,'d'],[h,'h'],[m,'m'],[s,'s']].forEach(([v,k])=>countdownEls[k].forEach(el=>{if(el)el.textContent=String(v).padStart(2,'0')}));}
updateCountdown();setInterval(updateCountdown,1000);

// Scroll guidance: show the animated corner arrows only at the top of the main invitation.
// As soon as the guest starts scrolling, fade them away and keep them hidden for the session.
if(invitation && scrollHintArrows){
  const invitationScroller=invitation.querySelector('.invitation-scroll');
  let scrollHintDismissed=false;
  const hideScrollHint=()=>{
    if(scrollHintDismissed) return;
    scrollHintDismissed=true;
    scrollHintArrows.classList.add('is-hidden');
  };
  if(invitationScroller){
    invitationScroller.addEventListener('scroll',()=>{
      if(invitationScroller.scrollTop>2) hideScrollHint();
    },{passive:true});
    invitationScroller.addEventListener('touchmove',hideScrollHint,{passive:true});
    invitationScroller.addEventListener('wheel',hideScrollHint,{passive:true});
  }
  scrollHintArrows.classList.remove('is-hidden');
}

window.addEventListener('load',()=>setTimeout(()=>preloader.classList.add('done'),1100));

document.documentElement.classList.add('invitation-locked');
document.body.classList.add('invitation-locked');

/* Physical lantern: fixed pivot, rope lengthens downward, lantern follows rope bottom.
   Horizontal drag maps naturally to pendulum direction: dragging right swings right. */
let dragging=false,opened=false,pull=0,swing=0,velocityX=0,velocityY=0,startX=0,startY=0,lastX=0,lastY=0,lastT=0,pid=null,raf=0;
const baseRope=118;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function render(){
  const ropeLength=baseRope+pull;
  rope.style.height=ropeLength+'px';
  hit.style.top=ropeLength+'px';
  hanger.style.transform=`rotate(${swing}deg)`;
  rig.style.setProperty('--pull',pull+'px');
  rig.style.setProperty('--swing',swing+'deg');
}
function animateSpring(){
  cancelAnimationFrame(raf);
  let vy=velocityY*0.42;
  let vx=velocityX*0.42;
  function step(){
    // spring toward rest; pull cannot become negative
    const ay=-0.026*pull;
    vy=(vy+ay)*0.88;
    pull+=vy;
    if(pull<0){pull=0;vy*=-0.28}
    // pendulum swing settles smoothly
    const ax=-0.065*swing;
    vx=(vx+ax)*0.90;
    swing+=vx;
    if(Math.abs(pull)<.25&&Math.abs(vy)<.3&&Math.abs(swing)<.25&&Math.abs(vx)<.25){pull=0;swing=0;render();return}
    render(); raf=requestAnimationFrame(step);
  }
  raf=requestAnimationFrame(step);
}
let musicStarted=false;
let musicUnlockListening=true;
function startBackgroundMusic(){
  if(!backgroundMusic || musicMuted)return;
  // Always attempt autoplay first. Browsers that permit audible autoplay will start here.
  // On iOS/Android browsers that block autoplay, the first real page interaction below
  // retries play() directly from the user-gesture event.
  backgroundMusic.volume=0;
  const playPromise=backgroundMusic.play();
  if(playPromise && playPromise.then){
    playPromise.then(()=>{ musicStarted=true; }).catch(()=>{ /* autoplay blocked; wait for a user gesture */ });
  }
  const started=performance.now();
  function fadeIn(now){
    if(!backgroundMusic || musicMuted)return;
    const t=Math.min(1,(now-started)/1400);
    backgroundMusic.volume=0.28*(1-Math.pow(1-t,3));
    if(t<1)requestAnimationFrame(fadeIn);
  }
  requestAnimationFrame(fadeIn);
}
function unlockMusicFromGesture(){
  if(!backgroundMusic || musicMuted || musicStarted)return;
  // Must be called synchronously from a trusted user gesture for iOS Safari and
  // other browsers that block audible autoplay.
  backgroundMusic.volume=0.28;
  const playPromise=backgroundMusic.play();
  if(playPromise && playPromise.then){
    playPromise.then(()=>{
      musicStarted=true;
      removeMusicUnlockListeners();
    }).catch(()=>{});
  }
}
function removeMusicUnlockListeners(){
  if(!musicUnlockListening)return;
  ['pointerdown','touchstart','keydown'].forEach(type=>document.removeEventListener(type,unlockMusicFromGesture,{capture:true}));
  musicUnlockListening=false;
}
['pointerdown','touchstart','keydown'].forEach(type=>document.addEventListener(type,unlockMusicFromGesture,{capture:true,passive:true}));
// Try audible autoplay immediately. If the browser blocks it, the gesture listeners above
// start the same audio on the user's first tap/click/keypress.
startBackgroundMusic();
function stopBackgroundMusic(){
  if(!backgroundMusic)return;
  const start=backgroundMusic.volume, started=performance.now();
  function fadeOut(now){
    const t=Math.min(1,(now-started)/500);
    backgroundMusic.volume=start*(1-t);
    if(t<1)requestAnimationFrame(fadeOut);
    else backgroundMusic.pause();
  }
  requestAnimationFrame(fadeOut);
}
if(musicToggle){
  musicToggle.addEventListener('click',()=>{
    musicMuted=!musicMuted;
    musicToggle.setAttribute('aria-pressed',String(musicMuted));
    musicToggle.classList.toggle('muted',musicMuted);
    const label=musicToggle.querySelector('.music-label');
    if(label)label.textContent=musicMuted?'MUSIC OFF':'MUSIC ON';
    if(musicMuted)stopBackgroundMusic();
    else if(opened)startBackgroundMusic();
  });
}
function openInvitation(){
  if(opened)return;
  opened=true; dragging=false; welcome.classList.add('opening');
  // Keep the call here as an additional fallback: the lantern release is itself a user gesture.
  startBackgroundMusic();
  cancelAnimationFrame(raf);
  // Lift the lantern and retract its glowing rope before revealing the invitation.
  const startPull=pull,startSwing=swing,start=performance.now();
  function lift(now){
    const t=clamp((now-start)/950,0,1);
    const e=1-Math.pow(1-t,4);
    pull=startPull*(1-e);
    swing=startSwing*(1-e);
    render();
    if(t<1){raf=requestAnimationFrame(lift)}else{
      pull=0;swing=0;render();
      // Give the reveal a deliberate 1.5-second luxury loading beat.
      openingLoader.classList.add('show');
      const percentEl=document.getElementById('openingPercent');
      const loadStart=performance.now();
      const loadDuration=1000;
      function cinematicLoad(now){
        const t=Math.min(1,(now-loadStart)/loadDuration);
        const eased=1-Math.pow(1-t,3);
        if(percentEl) percentEl.textContent=Math.round(eased*100)+'%';
        const bar=openingLoader.querySelector('.opening-progress span');
        if(bar) bar.style.width=(eased*100)+'%';
        if(t<1){ requestAnimationFrame(cinematicLoad); }
        else {
          setTimeout(()=>{
            openingLoader.classList.remove('show');
            welcome.classList.add('opened');
            document.body.classList.add('invitation-open');
            document.body.classList.remove('invitation-locked');
            document.documentElement.classList.remove('invitation-locked');
            invitation.scrollTop=0;
            requestAnimationFrame(()=>{ invitation.classList.add('revealed'); });
          },90);
        }
      }
      requestAnimationFrame(cinematicLoad);
    }
  }
  raf=requestAnimationFrame(lift);
}
function pointerDown(e){
  if(opened||dragging)return;
  dragging=true;pid=e.pointerId;startX=lastX=e.clientX;startY=lastY=e.clientY;lastT=performance.now();velocityX=velocityY=0;
  welcome.classList.add('dragging');
  try{rig.setPointerCapture(pid)}catch(_){ }
  e.preventDefault();
}
function pointerMove(e){
  if(!dragging||e.pointerId!==pid)return;
  const now=performance.now(),dt=Math.max(8,now-lastT);
  const dx=e.clientX-lastX,dy=e.clientY-lastY;
  velocityX=dx/dt*16.67;velocityY=dy/dt*16.67;
  lastX=e.clientX;lastY=e.clientY;lastT=now;
  pull=clamp(e.clientY-startY,0,Math.min(innerHeight*.48,360));
  // Negative rotation makes the bottom of a top-pivoted pendulum move right for positive dx.
  swing=clamp(-((e.clientX-startX)/Math.max(100,innerWidth*.34))*12,-13,13);
  render();e.preventDefault();
}
function pointerUp(e){
  if(!dragging||e.pointerId!==pid)return;
  dragging=false;welcome.classList.remove('dragging');
  try{rig.releasePointerCapture(pid)}catch(_){ }
  const threshold=Math.min(105,innerHeight*.18);
  if(pull>=threshold||velocityY>5){openInvitation();}
  else animateSpring();
}
rig.addEventListener('pointerdown',pointerDown,{passive:false});
rig.addEventListener('pointermove',pointerMove,{passive:false});
rig.addEventListener('pointerup',pointerUp,{passive:false});
rig.addEventListener('pointercancel',pointerUp,{passive:false});

// Keyboard accessibility: Enter/Space opens the invitation.
rig.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInvitation()}});

// Fallback button if a visitor prefers not to drag.
if(enterButton){
  enterButton.addEventListener('click',()=>openInvitation());
  enterButton.addEventListener('pointerdown',e=>e.stopPropagation());
}

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.style.transition='transform .18s ease-out, box-shadow .65s cubic-bezier(.22,1,.36,1), border-color .5s ease';
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1200px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-5px) scale(1.012)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}

const calendarButton=document.getElementById('calendar');
if(calendarButton){calendarButton.addEventListener('click',()=>{
  const c=window.WEDDING_CONFIG||{}, startDate=new Date(c.nikah?.countdownDateTime||c.nikah?.date||Date.now()), endDate=new Date(startDate.getTime()+Number(c.calendar?.durationHours||3)*3600000);
  const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z'); const local=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'').slice(0,15);
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation Template//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+((c.customerSlug||'wedding')+'-'+startDate.getTime())+'@wedding','DTSTAMP:'+stamp(new Date()),'DTSTART;TZID=Asia/Kolkata:'+local(startDate),'DTEND;TZID=Asia/Kolkata:'+local(endDate),'SUMMARY:'+(c.calendar?.title||'Wedding Ceremony'),'LOCATION:'+((c.nikah?.venue||'')+', '+(c.nikah?.address||'')),'DESCRIPTION:Nikaah of '+(c.groom?.name||'')+' & '+(c.bride?.name||'')+' — '+(c.nikah?.time||''),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));a.download=(c.calendar?.title||'Wedding Ceremony').replace(/[^a-z0-9]+/gi,'-')+'.ics';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  const toast=document.getElementById('toast');if(toast){toast.textContent=(c.calendar?.title||'Wedding Ceremony')+' added';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400);}
});}
