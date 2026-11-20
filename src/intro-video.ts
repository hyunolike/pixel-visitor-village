/** Native controls remain available if autoplay is blocked or motion is reduced. */
export function setupIntroVideo(video:HTMLVideoElement,status:HTMLElement):void {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false;
  let active=false;
  let attempted=false;
  let resume=false;

  const sync=()=>{
    const next=visible&&!document.hidden;
    if(next===active)return;
    active=next;
    if(!active){
      // Remember user intent before a policy pause; manual pauses stay paused.
      resume=!video.paused;
      video.pause();
      return;
    }
    const play=resume||(!attempted&&!reduced.matches);
    attempted=true;resume=false;
    if(play)void video.play().catch(()=>{/* The visitor can use the native play control. */});
  };
  const observer=new IntersectionObserver(entries=>{
    visible=entries.some(entry=>entry.isIntersecting);sync();
  });
  observer.observe(video);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{
    if(reduced.matches){attempted=true;resume=false;video.pause();}
  });
  video.addEventListener('error',()=>{status.hidden=false;});
}
