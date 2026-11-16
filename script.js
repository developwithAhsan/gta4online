(() => {
  'use strict';
  const status=document.getElementById('gameStatus');
  const stage=document.getElementById('gameStage');
  const nav=document.getElementById('mainNav');
  const menuToggle=document.getElementById('menuToggle');
  const controlsToggle=document.getElementById('controlsToggle');
  const controlsSettings=document.getElementById('controlsSettings');
  const reload=document.getElementById('reloadGame');
  const fullscreen=document.getElementById('fullscreenGame');
  const rotate=document.getElementById('rotateScreen');
  const play=document.getElementById('playGameButton');
  const year=document.getElementById('year');
  const progress=document.getElementById('scrollProgress');
  const backToTop=document.getElementById('backToTop');
  const noClient='A compatible, authorized GTA IV game client has not been connected yet. The portal and control interface are ready, but there is no game stream to load.';
  const sayNoClient=()=>{if(status)status.textContent=noClient;};
  play?.addEventListener('click',sayNoClient);
  reload?.addEventListener('click',sayNoClient);
  menuToggle?.addEventListener('click',()=>{
    const open=nav?.classList.toggle('is-open')||false;
    menuToggle.setAttribute('aria-expanded',String(open));
  });
  nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('is-open');menuToggle?.setAttribute('aria-expanded','false');
  }));
  controlsToggle?.addEventListener('click',()=>{
    const active=window.GTATouchControls?.active??(controlsToggle.getAttribute('aria-expanded')==='true');
    window.GTATouchControls?.setActive(!active);
  });
  controlsSettings?.addEventListener('click',()=>window.GTATouchControls?.openSettings());
  const mobile=()=>window.matchMedia('(pointer: coarse)').matches||('ontouchstart' in window);
  async function enterFullscreen(lockLandscape){
    try{
      if(!document.fullscreenElement){
        if(stage?.requestFullscreen)await stage.requestFullscreen();
        else await document.documentElement.requestFullscreen();
      }else await document.exitFullscreen();
      if(lockLandscape&&document.fullscreenElement&&screen.orientation?.lock){
        try{await screen.orientation.lock('landscape');}catch(_){}
      }
      if(status)status.textContent=document.fullscreenElement?'Portal fullscreen active':'Fullscreen closed';
    }catch(_){if(status)status.textContent='Fullscreen was blocked by the browser. Use the browser menu to enter fullscreen.';}
  }
  fullscreen?.addEventListener('click',()=>enterFullscreen(mobile()));
  rotate?.addEventListener('click',()=>enterFullscreen(true));
  document.addEventListener('fullscreenchange',()=>{
    if(fullscreen)fullscreen.innerHTML=document.fullscreenElement?'⤢ <span>Exit Fullscreen</span>':'⛶ <span>Fullscreen</span>';
  });
  if(year)year.textContent=String(new Date().getFullYear());
  function updateScroll(){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const percent=max>0?(window.scrollY/max)*100:0;
    if(progress?.firstElementChild)progress.firstElementChild.style.width=percent+'%';
    backToTop?.classList.toggle('is-visible',window.scrollY>420);
  }
  window.addEventListener('scroll',updateScroll,{passive:true});
  window.addEventListener('resize',updateScroll);
  backToTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  updateScroll();
  if(status)status.textContent='GTA IV portal ready · game client not connected';
})();