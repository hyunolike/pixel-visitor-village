import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';
import treeUrl from './assets/christmas-tree.png';
import { backdrop, hash, seasonalTree, surface, treeGlow, visitorArt } from './art';
import { getTreeLayout, VillageModel, type Season } from './model';
import { themes } from './themes';

async function christmasArt() {
  const image=new Image();
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('크리스마스 나무 이미지를 불러오지 못했어요.'));image.src=treeUrl;});
  const {canvas,ctx}=surface(image.naturalWidth,image.naturalHeight);ctx.drawImage(image,0,0);return canvas;
}

export class VillageRenderer {
  assetWarning='';
  private app=new Application();
  private background=new Sprite();
  private objects=new Container();
  private tree=new Sprite();
  private glow=new Sprite();
  private weather=new Graphics();
  private trees=new Map<Season,Texture>();
  private frames:Texture[][]=[];
  private people:Sprite[]=[];
  private backgroundTexture:Texture|undefined;
  private glowTexture:Texture|undefined;
  private dead=false;
  private glowEnabled=true;
  private initialized=false;

  private constructor(private frame:HTMLElement,private model:VillageModel) {}

  static async create(frame:HTMLElement,model:VillageModel,isCurrent:()=>boolean=()=>true) {
    const view=new VillageRenderer(frame,model);
    try {
      let christmas:HTMLCanvasElement|undefined;
      try {christmas=await christmasArt();} catch {view.assetWarning='나무 이미지를 불러오지 못해 기본 나무를 보여드려요.';}
      if(!isCurrent()){view.destroy();return;}
      christmas??=seasonalTree('christmas');
      await view.app.init({preference:['webgl'],width:1,height:1,resolution:1,backgroundAlpha:0,antialias:false,autoStart:false,sharedTicker:false,powerPreference:'low-power'});
      view.initialized=true;
      if(!isCurrent()){view.destroy();return;}
      view.trees.set('christmas',Texture.from(christmas));
      for(const season of ['spring','summer','autumn','winter'] as const) view.trees.set(season,Texture.from(seasonalTree(season)));
      for(let color=0;color<6;color++) view.frames.push([Texture.from(visitorArt(color,0)),Texture.from(visitorArt(color,1))]);
      for(const texture of [...view.trees.values(),...view.frames.flat()])texture.source.scaleMode='nearest';
      view.glowTexture=Texture.from(treeGlow());view.glow.texture=view.glowTexture;
      view.tree.anchor.set(.5,1);view.glow.anchor.set(.5);view.objects.sortableChildren=true;
      view.objects.addChild(view.tree,view.glow);
      view.app.stage.addChild(view.background,view.objects,view.weather);
      view.app.canvas.setAttribute('role','img');frame.prepend(view.app.canvas);
      view.app.ticker.maxFPS=30;
      view.app.ticker.add(ticker=>{if(view.dead)return;model.step(ticker.deltaMS/1000);view.renderState();});
      view.resize();return view;
    } catch(error) {view.destroy();throw error;}
  }

  resize() {
    if(this.dead)return;
    const width=Math.max(1,Math.round(this.frame.clientWidth/2));
    const height=Math.max(1,Math.round(this.frame.clientHeight/2));
    this.app.renderer.resize(width,height);this.setTheme();
  }

  setTheme() {
    if(this.dead)return;
    const {width,height}=this.app.screen;
    const previous=this.backgroundTexture;
    this.backgroundTexture=Texture.from(backdrop(width,height,this.model.season));
    this.backgroundTexture.source.scaleMode='nearest';this.background.texture=this.backgroundTexture;previous?.destroy(true);
    this.tree.texture=this.trees.get(this.model.season)!;
    const layout=getTreeLayout(width,height);
    this.tree.position.set(layout.x,layout.base);this.tree.width=layout.size;this.tree.height=layout.size;this.tree.zIndex=layout.base;
    this.glow.position.set(layout.x,layout.base-layout.size*.35);this.glow.width=layout.size*.85;this.glow.height=layout.size*.85;this.glow.zIndex=layout.base+.01;
    this.renderState();this.app.render();
  }

  setGlow(enabled:boolean) {this.glowEnabled=enabled;this.renderState();this.app.render();}

  renderState() {
    if(this.dead)return;
    const {width,height}=this.app.screen;
    while(this.people.length<this.model.visitors.length) {
      const sprite=new Sprite(this.frames[this.people.length%6][0]);sprite.anchor.set(.5,1);this.people.push(sprite);this.objects.addChild(sprite);
    }
    while(this.people.length>this.model.visitors.length) {const sprite=this.people.pop()!;sprite.removeFromParent();sprite.destroy();}
    this.model.visitors.forEach((p,index)=>{
      const sprite=this.people[index];
      const walking=Math.sin(this.model.elapsed*.7+p.phase)>=-.45;
      const frame=walking&&Math.sin(this.model.elapsed*6+p.phase)>0?1:0;
      sprite.texture=this.frames[p.id%6][frame];sprite.position.set(Math.round(p.x*width),Math.round(p.y*height));sprite.scale.x=p.vx<0?-1:1;sprite.zIndex=sprite.y;
    });
    this.app.canvas.setAttribute('aria-label',`${themes[this.model.season].name}, 방문자 ${this.model.visitors.length}명`);
    this.glow.visible=this.model.season==='christmas'&&this.glowEnabled;
    this.glow.alpha=.45+Math.sin(this.model.elapsed*.7)*.1;
    this.weather.clear();
    const snowy=this.model.season==='christmas'||this.model.season==='winter';
    const petals=this.model.season==='spring'||this.model.season==='autumn';
    if(snowy||petals) {
      for(let i=0;i<(snowy?45:17);i++) {
        const y=(hash(i+12)*height+this.model.elapsed*(5+hash(i+17)*5))%height;
        const x=(hash(i+74)*width+Math.sin(this.model.elapsed*.3+i)*5+width)%width;
        this.weather.rect(Math.round(x),Math.round(y),i%5===0?2:1,i%5===0?2:1);
      }
      this.weather.fill({color:snowy?0xf0f8ee:this.model.season==='spring'?0xf3c4cd:0xa66b45,alpha:snowy?.65:1});
    }
  }

  renderOnce() {if(this.dead)return;this.renderState();this.app.render();}
  play(active:boolean) {if(this.dead)return;active?this.app.start():this.app.stop();}
  destroy() {
    if(this.dead)return;this.dead=true;
    if(this.initialized)this.app.destroy(true,{children:true});
    this.backgroundTexture?.destroy(true);this.glowTexture?.destroy(true);
    for(const texture of [...this.trees.values(),...this.frames.flat()])texture.destroy(true);
    this.people=[];this.frames=[];this.trees.clear();
  }
}
