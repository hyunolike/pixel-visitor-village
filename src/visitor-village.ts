import { VillageModel, parseCount } from './model';
import { VillageRenderer } from './renderer';
import styles from './widget.css?inline';
import { koreanDay, noticeForCount, type CountNotice, type CountSnapshot } from './visitor-notice';
import { parseRefreshInterval, visitorRefresh, type RefreshResult } from './visitor-refresh';
import { defaultVillageLabels, type VillageLabels } from './village-labels';
import { setupMapScene } from './map-scene';
import { shouldCelebrateArrival } from './village-effects';

interface PendingNotice {snapshot:CountSnapshot;notice:CountNotice;fresh:boolean}

export class VisitorVillage extends HTMLElement {
  static observedAttributes=['count','season','paused','glow','refresh-interval','interactive','illustrated','data-map-scene','effects'];
  private greetingCursor=0;
  private model=new VillageModel();
  private view:VillageRenderer|undefined;
  private sceneBackdrop:HTMLImageElement|null=null;
  private sceneCleanup:(()=>void)|undefined;
  private sceneConnected=false;
  private frame:HTMLElement;
  private status:HTMLElement;
  private nameLabel:HTMLElement;
  private notice:HTMLElement;
  private noticeTimer:ReturnType<typeof setTimeout>|undefined;
  private lastNotice:CountSnapshot|null=null;
  private pendingNotice:PendingNotice|null=null;
  private shownNotice:PendingNotice|null=null;
  private refreshSeconds=0;
  private refreshError='';
  private generation=0;
  private resizeObserver:ResizeObserver|undefined;
  private intersectionObserver:IntersectionObserver|undefined;
  private visible=true;
  private motion:MediaQueryList|undefined;
  private errors=new Map<string,string>();
  private loadError='';
  private localizedLabels:VillageLabels|undefined;
  private onMotion=()=>{this.applyPlayback();this.emit('village-change');};
  private onVisibility=()=>this.applyPlayback();
  private onRefresh=(result:RefreshResult)=>{
    if('error'in result) {
      this.refreshError=result.error;
      this.emit('village-error',{attribute:'refresh',message:result.error});
    } else {
      this.refreshError='';
      this.setAttribute('count',String(result.count));
    }
    this.showStatus();
  };

  constructor() {
    super();
    const shadow=this.attachShadow({mode:'open'});
    shadow.innerHTML=`<style>${styles}</style><section class="village" aria-label="방문자 마을"><p class="name"></p><p class="notice" aria-hidden="true" aria-live="polite" aria-atomic="true" data-open="false"></p><a class="repository" href="https://github.com/hyunolike/pixel-visitor-village" target="_blank" rel="noopener noreferrer" aria-label="Pixel Visitor Village 저장소 보기 (새 탭)"><span>GitHub에서 보기 ↗</span></a><div class="status" role="status" aria-live="polite"></div></section>`;
    this.frame=shadow.querySelector('.village')!;this.status=shadow.querySelector('.status')!;this.nameLabel=shadow.querySelector('.name')!;
    this.notice=shadow.querySelector('.notice')!;
    this.frame.addEventListener('click',event=>{
      if(!this.hasAttribute('interactive')||!(event.target instanceof HTMLCanvasElement))return;
      const id=this.view?.greetAt(event.clientX,event.clientY);
      if(id!==undefined)this.greetVisitor(id);
    });
  }
  /** Optional illustrated presentation. The source is copied into instance-owned textures. */
  setSceneBackdrop(source:HTMLImageElement|null):void {
    if(source&&(!source.complete||source.naturalWidth===0))return;
    this.sceneBackdrop=source;this.view?.setSceneBackdrop(source);
  }
  get visitorCount(){return this.model.visitors.length;}
  get season(){return this.model.season;}
  get ready(){return Boolean(this.view);}
  get motionReduced(){return this.motion?.matches??false;}
  getVisitors(){return this.model.visitors.map(({id,x,y})=>({id,x,y}));}
  greetVisitor(id?:number):boolean {
    if(!this.hasAttribute('interactive')||!this.isConnected||!this.view||!this.visitorCount)return false;
    const target=id??this.greetingCursor%this.visitorCount;
    if(!this.model.greet(target))return false;
    this.greetingCursor=target+1;this.view.renderOnce();this.emit('village-greet',{id:target});return true;
  }
  inviteVisitor():boolean {
    if(!this.hasAttribute('interactive')||!this.isConnected||!this.view||!this.model.invite())return false;
    this.setAttribute('count',String(this.visitorCount));this.view.renderOnce();this.emit('village-invite',{count:this.visitorCount});return true;
  }
  get labels():VillageLabels{return this.localizedLabels??defaultVillageLabels;}
  set labels(labels:VillageLabels) {
    this.localizedLabels=labels;
    this.frame.setAttribute('aria-label',labels.region);
    this.view?.setLabels(labels);
    const repository=this.shadowRoot!.querySelector<HTMLAnchorElement>('.repository')!;
    repository.setAttribute('aria-label',labels.repositoryLabel);
    repository.querySelector('span')!.textContent=labels.repository;
    this.nameLabel.textContent=labels.seasons[this.model.season];
    if(this.shownNotice)this.renderNotice(this.shownNotice);
    else this.notice.textContent='';
    this.showStatus();
  }
  private detail(){return {count:this.visitorCount,season:this.season,paused:this.hasAttribute('paused')||this.motionReduced};}
  private emit(name:string,detail:unknown=this.detail()){this.dispatchEvent(new CustomEvent(name,{detail,bubbles:true,composed:true}));}
  private showStatus(){
    const assetWarning=this.view?.assetWarning;
    this.status.textContent=(this.loadError?this.labels.loadError:'')||[...this.errors.values(),this.refreshError,assetWarning?(this.localizedLabels?.assetWarning??assetWarning):''].filter(Boolean).join(' ');
    this.frame.classList.toggle('has-status',Boolean(this.status.textContent));
  }
  private reportArtWarning(){
    const attribute=this.view?.assetErrorAttribute;
    if(attribute)this.emit('village-error',{attribute,message:this.labels.assetWarning});
  }
  private setupScene(){
    if(this.sceneConnected&&this.isConnected&&!this.sceneCleanup&&(this.hasAttribute('illustrated')||this.hasAttribute('data-map-scene')))
      this.sceneCleanup=setupMapScene(this);
  }

  attributeChangedCallback(attribute:string,_previous:string|null,value:string|null) {
    if(attribute==='illustrated'||attribute==='data-map-scene'){this.setupScene();return;}
    if(attribute==='count')visitorRefresh.invalidate(this.onRefresh);
    try {
      if(attribute==='count') {
        const previous=this.visitorCount;
        this.model.setCount(parseCount(value));
        if(this.visitorCount<previous||this.lastNotice?.day!==koreanDay(new Date()))this.view?.clearArrival();
        this.errors.delete('count');
        if(previous!==this.visitorCount||!this.lastNotice||this.lastNotice.day!==koreanDay(new Date()))this.queueNotice(previous);
      }
      if(attribute==='season')this.model.setSeason(value??'christmas');
      if(attribute==='refresh-interval') {
        this.refreshSeconds=parseRefreshInterval(value);
        this.refreshError='';
        if(this.isConnected)visitorRefresh.subscribe(this.onRefresh,this.refreshSeconds);
      }
      this.errors.delete(attribute);this.nameLabel.textContent=this.labels.seasons[this.model.season];
      if(attribute==='season'){this.view?.setTheme();this.reportArtWarning();}
      if(attribute==='glow')this.view?.setGlow(value!=='false');
      if(attribute==='effects')this.view?.setEffectsEnabled(value!=='off');
      if(attribute==='interactive'&&value===null)this.model.greeting=null;
      this.showStatus();this.applyPlayback();this.view?.renderOnce();this.emit('village-change');
    } catch(error) {
      const message=error instanceof Error?error.message:String(error);this.errors.set(attribute,message);this.showStatus();this.emit('village-error',{attribute,message});
    }
  }

  connectedCallback() {
    const generation=++this.generation;
    this.sceneConnected=true;
    this.setupScene();
    this.visible=false;this.loadError='';this.showStatus();
    this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.motion.addEventListener('change',this.onMotion);
    document.addEventListener('visibilitychange',this.onVisibility);
    this.nameLabel.textContent=this.labels.seasons[this.model.season];
    visitorRefresh.subscribe(this.onRefresh,this.refreshSeconds);
    void VillageRenderer.create(this.frame,this.model,()=>generation===this.generation&&this.isConnected).then(view=>{
      if(!view)return;
      if(generation!==this.generation||!this.isConnected){view.destroy();return;}
      this.view=view;view.setSceneBackdrop(this.sceneBackdrop);view.setLabels(this.labels);view.setGlow(this.getAttribute('glow')!=='false');view.setEffectsEnabled(this.getAttribute('effects')!=='off');
      this.resizeObserver=new ResizeObserver(()=>{view.resize();this.applyPlayback();});this.resizeObserver.observe(this);
      this.intersectionObserver=new IntersectionObserver(entries=>{this.visible=entries[0]?.isIntersecting??true;this.applyPlayback();});this.intersectionObserver.observe(this);
      if(!this.lastNotice&&!this.pendingNotice)this.queueNotice();
      this.showStatus();this.applyPlayback();this.emit('village-ready');this.emit('village-change');
      this.reportArtWarning();
    }).catch(error=>{
      if(generation!==this.generation||!this.isConnected)return;
      this.loadError='마을 그래픽을 시작하지 못했어요. WebGL을 지원하는 브라우저에서 다시 열어 주세요.';
      this.showStatus();this.emit('village-error',{attribute:'renderer',message:error instanceof Error?error.message:String(error)});
    });
  }

  private arrivalAllowed(){
    return !this.hasAttribute('paused')&&this.getAttribute('effects')!=='off'&&!(this.motion?.matches??matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  private applyPlayback() {
    this.frame.classList.toggle('compact',this.clientHeight<120);
    const visible=!document.hidden&&this.visible&&this.clientWidth>0&&this.clientHeight>0;
    if(!this.arrivalAllowed()){
      if(this.pendingNotice)this.pendingNotice.fresh=false;
      if(this.shownNotice)this.shownNotice.fresh=false;
    }
    this.view?.setMotionReduced(this.motionReduced);
    this.view?.play(visible&&!this.hasAttribute('paused')&&!this.motionReduced);
    visitorRefresh.setActive(this.onRefresh,visible&&Boolean(this.view));
    if(visible)this.presentNotice();
    else if(this.shownNotice) {
      this.pendingNotice??=this.shownNotice;this.closeNotice();
    }
  }
  private queueNotice(previousCount=this.visitorCount) {
    if(this.errors.has('count'))return;
    const snapshot={count:this.visitorCount,day:koreanDay(new Date())};
    if(this.lastNotice&&snapshot.day===this.lastNotice.day&&snapshot.count<previousCount) {
      this.lastNotice=snapshot;this.pendingNotice=null;this.closeNotice();return;
    }
    const notice=noticeForCount(this.lastNotice,snapshot.count,snapshot.day);
    this.pendingNotice=notice?{snapshot,notice,fresh:this.arrivalAllowed()}:null;
    this.presentNotice();
  }
  private presentNotice() {
    if(!this.pendingNotice||!this.view||!this.visible||document.hidden||this.clientWidth<=0||this.clientHeight<=0)return;
    const current=this.pendingNotice;this.pendingNotice=null;this.shownNotice=current;this.lastNotice=current.snapshot;
    const celebrate=shouldCelebrateArrival({delta:current.notice.delta,day:current.snapshot.day,today:koreanDay(new Date()),fresh:current.fresh});
    current.fresh=false;
    if(celebrate&&this.arrivalAllowed())this.view.celebrateArrival();
    // A paused notice is not a fresh reading: don't relabel yesterday's count as today's.
    this.renderNotice(current);
    this.notice.dataset.open='true';this.notice.setAttribute('aria-hidden','false');this.frame.classList.add('notice-open');
    clearTimeout(this.noticeTimer);
    this.noticeTimer=setTimeout(()=>this.closeNotice(),3000);
  }
  private closeNotice() {
    clearTimeout(this.noticeTimer);this.noticeTimer=undefined;this.shownNotice=null;
    this.notice.dataset.open='false';this.notice.setAttribute('aria-hidden','true');this.frame.classList.remove('notice-open');
  }
  private renderNotice(current:PendingNotice) {
    this.notice.textContent=current.snapshot.day===koreanDay(new Date())
      ?this.labels.today(current.snapshot.count,current.notice.delta):this.labels.recent(current.snapshot.count);
  }
  disconnectedCallback() {
    this.sceneConnected=false;
    this.model.greeting=null;this.greetingCursor=0;
    this.model.social.reset();
    visitorRefresh.unsubscribe(this.onRefresh);
    this.pendingNotice??=this.shownNotice;this.closeNotice();
    ++this.generation;this.resizeObserver?.disconnect();this.intersectionObserver?.disconnect();
    this.resizeObserver=undefined;this.intersectionObserver=undefined;
    this.motion?.removeEventListener('change',this.onMotion);this.motion=undefined;
    document.removeEventListener('visibilitychange',this.onVisibility);
    this.view?.destroy();this.view=undefined;
    this.sceneCleanup?.();this.sceneCleanup=undefined;
  }
}
if(!customElements.get('visitor-village'))customElements.define('visitor-village',VisitorVillage);
declare global {interface HTMLElementTagNameMap {'visitor-village':VisitorVillage}}
