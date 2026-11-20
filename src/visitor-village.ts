import { VillageModel, parseCount } from './model';
import { VillageRenderer } from './renderer';
import { themes } from './themes';
import styles from './widget.css?inline';

export class VisitorVillage extends HTMLElement {
  static observedAttributes=['count','season','paused','glow'];
  private model=new VillageModel();
  private view:VillageRenderer|undefined;
  private frame:HTMLElement;
  private status:HTMLElement;
  private nameLabel:HTMLElement;
  private generation=0;
  private resizeObserver:ResizeObserver|undefined;
  private intersectionObserver:IntersectionObserver|undefined;
  private visible=true;
  private motion:MediaQueryList|undefined;
  private errors=new Map<string,string>();
  private loadError='';
  private onMotion=()=>{this.applyPlayback();this.emit('village-change');};
  private onVisibility=()=>this.applyPlayback();

  constructor() {
    super();
    const shadow=this.attachShadow({mode:'open'});
    shadow.innerHTML=`<style>${styles}</style><section class="village" aria-label="방문자 마을"><p class="name"></p><div class="status" role="status" aria-live="polite"></div></section>`;
    this.frame=shadow.querySelector('.village')!;this.status=shadow.querySelector('.status')!;this.nameLabel=shadow.querySelector('.name')!;
  }
  get visitorCount(){return this.model.visitors.length;}
  get season(){return this.model.season;}
  get ready(){return Boolean(this.view);}
  get motionReduced(){return this.motion?.matches??false;}
  getVisitors(){return this.model.visitors.map(({id,x,y})=>({id,x,y}));}
  private detail(){return {count:this.visitorCount,season:this.season,paused:this.hasAttribute('paused')||this.motionReduced};}
  private emit(name:string,detail:unknown=this.detail()){this.dispatchEvent(new CustomEvent(name,{detail,bubbles:true,composed:true}));}
  private showStatus(){this.status.textContent=this.loadError||[...this.errors.values(),this.season==='christmas'?this.view?.assetWarning:''].filter(Boolean).join(' ');}

  attributeChangedCallback(attribute:string,_previous:string|null,value:string|null) {
    try {
      if(attribute==='count')this.model.setCount(parseCount(value));
      if(attribute==='season')this.model.setSeason(value??'christmas');
      this.errors.delete(attribute);this.nameLabel.textContent=themes[this.model.season].name;
      if(attribute==='season')this.view?.setTheme();
      if(attribute==='glow')this.view?.setGlow(value!=='false');
      this.showStatus();this.applyPlayback();this.view?.renderOnce();this.emit('village-change');
    } catch(error) {
      const message=error instanceof Error?error.message:String(error);this.errors.set(attribute,message);this.showStatus();this.emit('village-error',{attribute,message});
    }
  }

  connectedCallback() {
    const generation=++this.generation;
    this.visible=true;this.loadError='';this.showStatus();
    this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.motion.addEventListener('change',this.onMotion);
    document.addEventListener('visibilitychange',this.onVisibility);
    this.nameLabel.textContent=themes[this.model.season].name;
    void VillageRenderer.create(this.frame,this.model,()=>generation===this.generation&&this.isConnected).then(view=>{
      if(!view)return;
      if(generation!==this.generation||!this.isConnected){view.destroy();return;}
      this.view=view;view.setGlow(this.getAttribute('glow')!=='false');
      this.resizeObserver=new ResizeObserver(()=>{view.resize();this.applyPlayback();});this.resizeObserver.observe(this);
      this.intersectionObserver=new IntersectionObserver(entries=>{this.visible=entries[0]?.isIntersecting??true;this.applyPlayback();});this.intersectionObserver.observe(this);
      this.showStatus();this.applyPlayback();this.emit('village-ready');this.emit('village-change');
      if(view.assetWarning&&this.season==='christmas')this.emit('village-error',{attribute:'tree',message:view.assetWarning});
    }).catch(error=>{
      if(generation!==this.generation||!this.isConnected)return;
      this.loadError='마을 그래픽을 시작하지 못했어요. WebGL을 지원하는 브라우저에서 다시 열어 주세요.';
      this.showStatus();this.emit('village-error',{attribute:'renderer',message:error instanceof Error?error.message:String(error)});
    });
  }

  private applyPlayback() {
    if(!this.view)return;
    const active=!this.hasAttribute('paused')&&!this.motionReduced&&!document.hidden&&this.visible&&this.clientWidth>0&&this.clientHeight>0;
    this.view.play(active);
  }
  disconnectedCallback() {
    ++this.generation;this.resizeObserver?.disconnect();this.intersectionObserver?.disconnect();
    this.resizeObserver=undefined;this.intersectionObserver=undefined;
    this.motion?.removeEventListener('change',this.onMotion);this.motion=undefined;
    document.removeEventListener('visibilitychange',this.onVisibility);
    this.view?.destroy();this.view=undefined;
  }
}
if(!customElements.get('visitor-village'))customElements.define('visitor-village',VisitorVillage);
declare global {interface HTMLElementTagNameMap {'visitor-village':VisitorVillage}}
