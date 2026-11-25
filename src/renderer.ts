import { Application, Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js';
import { loadVillageArt } from './village-art';
import { hash, seasonalTree, surface, treeGlow, monumentArt } from './art';
import { hitVisitor, getTreeLayout, getMonumentLayout, getVisitorSpriteLayout, VillageModel, type Season } from './model';
import { themes } from './themes';
import { createVillageScene,type VillageScenery } from './environment';
import { CHARACTER_WIDTH, CHARACTER_HEIGHT, CHARACTER_FRAMES, VISITOR_STYLES, VISITOR_FACINGS, visitorPixels } from './characters';
import { interactionPose, visitorPose, type VisitorPose } from './character-motion';
import { BUBBLE_WIDTH, BUBBLE_HEIGHT, SOCIAL_EMOTES, socialPixels, getBubbleLayout } from './social-art';
import { getHolidayLayout, HolidayCameoModel, type HolidayKind } from './holiday-cameo';
import { HOLIDAY_WIDTH, HOLIDAY_HEIGHT, holidayPixels } from './holiday-art';
import { defaultVillageLabels, type VillageLabels } from './village-labels';

export class VillageRenderer {
  private artFailures=new Set<string>();
  get assetErrorAttribute(){return this.artFailures.has('monument')?'monument':this.artFailures.has(this.model.season)?'tree':undefined;}
  get assetWarning(){return this.assetErrorAttribute?'일부 마을 그림을 불러오지 못해 기본 그림을 보여드려요.':'';}
  private app=new Application();
  private background=new Sprite();
  private objects=new Container();
  private tree=new Sprite();
  private monument=new Sprite();
  private monumentTexture:Texture|undefined;
  private compactFrames:Texture[][][]=[];
  private compactAtlas:Texture|undefined;
  private glow=new Sprite();
  private weather=new Graphics();
  private trees=new Map<Season,Texture>();
  private frames:Texture[][][]=[];
  private characterAtlas:Texture|undefined;
  private pose:VisitorPose={facing:'front',flip:false,frame:0};
  private people:Sprite[]=[];
  private bubbles:Sprite[]=[];
  private greetingBubble=new Sprite();
  private bubbleAtlas:Texture|undefined;
  private bubbleFrames:Texture[]=[];
  private backgroundTexture:Texture|undefined;
  private sceneryAtlas:Texture|undefined;
  private sceneryFrames:Texture[]=[];
  private scenerySprites:Sprite[]=[];
  private glowTexture:Texture|undefined;
  private dead=false;
  private glowEnabled=true;
  private initialized=false;
  private cameo=new HolidayCameoModel();
  private guestSprite=new Sprite();
  private guestAtlas:Texture|undefined;
  private guestFrames:Record<HolidayKind,Texture[]>={santa:[],rudolph:[]};
  private motionReduced=false;
  private labels:VillageLabels=defaultVillageLabels;

  private constructor(private frame:HTMLElement,private model:VillageModel) {}

  static async create(frame:HTMLElement,model:VillageModel,isCurrent:()=>boolean=()=>true) {
    const view=new VillageRenderer(frame,model);
    try {
      const art=await loadVillageArt();
      if(!isCurrent()){view.destroy();return;}
      view.artFailures=new Set(art.failed);
      await view.app.init({preference:['webgl'],width:1,height:1,resolution:1,backgroundAlpha:0,antialias:false,autoStart:false,sharedTicker:false,powerPreference:'low-power'});
      view.initialized=true;
      if(!isCurrent()){view.destroy();return;}
      // A source Canvas may be shared; each instance owns its disposable textures.
      const ownTexture=(source:HTMLCanvasElement)=>{const copy=surface(source.width,source.height);copy.ctx.drawImage(source,0,0);return Texture.from(copy.canvas);};
      for(const season of ['christmas','spring','summer','autumn','winter'] as const)view.trees.set(season,ownTexture(art.trees[season]??seasonalTree(season)));
      view.monumentTexture=ownTexture(art.monument??monumentArt());view.monumentTexture.source.scaleMode='nearest';
      view.monument.texture=view.monumentTexture;view.monument.anchor.set(.5,1);
      const atlas=surface(CHARACTER_WIDTH*CHARACTER_FRAMES,CHARACTER_HEIGHT*VISITOR_FACINGS.length*VISITOR_STYLES.length);
      view.characterAtlas=Texture.from(atlas.canvas);
      view.characterAtlas.source.scaleMode='nearest';
      for(let style=0;style<VISITOR_STYLES.length;style++) {
        const facings:Texture[][]=[];
        VISITOR_FACINGS.forEach((facing,direction)=>{
          const poses:Texture[]=[];
          for(let pose=0;pose<CHARACTER_FRAMES;pose++) {
            const x=pose*CHARACTER_WIDTH,y=(style*VISITOR_FACINGS.length+direction)*CHARACTER_HEIGHT;
            const image=atlas.ctx.createImageData(CHARACTER_WIDTH,CHARACTER_HEIGHT);
            image.data.set(visitorPixels(style,facing,pose));atlas.ctx.putImageData(image,x,y);
            poses.push(new Texture({source:view.characterAtlas!.source,frame:new Rectangle(x,y,CHARACTER_WIDTH,CHARACTER_HEIGHT)}));
          }
          facings.push(poses);
        });
        view.frames.push(facings);
      }
      view.characterAtlas.source.update();
      const compact=surface(16*CHARACTER_FRAMES,22*VISITOR_FACINGS.length*VISITOR_STYLES.length);
      for(let style=0;style<VISITOR_STYLES.length;style++)for(let direction=0;direction<VISITOR_FACINGS.length;direction++)for(let pose=0;pose<CHARACTER_FRAMES;pose++){
        const row=style*VISITOR_FACINGS.length+direction;
        compact.ctx.drawImage(atlas.canvas,pose*20,row*28,20,28,pose*16,row*22,16,22);
      }
      view.compactAtlas=Texture.from(compact.canvas);view.compactAtlas.source.scaleMode='nearest';
      view.compactFrames=view.frames.map((directions,style)=>directions.map((poses,direction)=>poses.map((_,pose)=>new Texture({source:view.compactAtlas!.source,frame:new Rectangle(pose*16,(style*3+direction)*22,16,22)}))));

      const balloons=surface(BUBBLE_WIDTH*SOCIAL_EMOTES.length,BUBBLE_HEIGHT);
      view.bubbleAtlas=Texture.from(balloons.canvas);view.bubbleAtlas.source.scaleMode='nearest';
      SOCIAL_EMOTES.forEach((kind,index)=>{
        const image=balloons.ctx.createImageData(BUBBLE_WIDTH,BUBBLE_HEIGHT);image.data.set(socialPixels(kind));
        balloons.ctx.putImageData(image,index*BUBBLE_WIDTH,0);
        view.bubbleFrames.push(new Texture({source:view.bubbleAtlas!.source,frame:new Rectangle(index*BUBBLE_WIDTH,0,BUBBLE_WIDTH,BUBBLE_HEIGHT)}));
      });
      view.bubbleAtlas.source.update();
      for(let i=0;i<3;i++){
        const bubble=new Sprite(view.bubbleFrames[0]);bubble.anchor.set(.5,1);bubble.visible=false;
        view.bubbles.push(bubble);view.objects.addChild(bubble);
      }
      view.greetingBubble.anchor.set(.5,1);view.greetingBubble.visible=false;view.objects.addChild(view.greetingBubble);
      const guests=surface(HOLIDAY_WIDTH*2,HOLIDAY_HEIGHT*2);
      view.guestAtlas=Texture.from(guests.canvas);view.guestAtlas.source.scaleMode='nearest';
      (['santa','rudolph'] as const).forEach((kind,row)=>{
        for(let pose=0;pose<2;pose++) {
          const image=guests.ctx.createImageData(HOLIDAY_WIDTH,HOLIDAY_HEIGHT);
          image.data.set(holidayPixels(kind,pose));
          guests.ctx.putImageData(image,pose*HOLIDAY_WIDTH,row*HOLIDAY_HEIGHT);
          view.guestFrames[kind].push(new Texture({source:view.guestAtlas!.source,frame:new Rectangle(pose*HOLIDAY_WIDTH,row*HOLIDAY_HEIGHT,HOLIDAY_WIDTH,HOLIDAY_HEIGHT)}));
        }
      });
      view.guestAtlas.source.update();view.guestSprite.anchor.set(.5,1);view.guestSprite.visible=false;
      view.objects.addChild(view.guestSprite);
      for(const texture of view.trees.values())texture.source.scaleMode='nearest';
      view.glowTexture=Texture.from(treeGlow());view.glow.texture=view.glowTexture;
      view.tree.anchor.set(.5,1);view.glow.anchor.set(.5);view.objects.sortableChildren=true;
      view.objects.addChild(view.tree,view.monument,view.glow);
      view.app.stage.addChild(view.background,view.objects,view.weather);
      view.app.canvas.setAttribute('role','img');frame.prepend(view.app.canvas);
      view.app.ticker.maxFPS=30;
      view.app.ticker.add(ticker=>{if(view.dead)return;model.step(ticker.deltaMS/1000);view.cameo.step(ticker.deltaMS/1000);view.renderState();});
      view.resize();return view;
    } catch(error) {view.destroy();throw error;}
  }

  resize() {
    if(this.dead)return;
    const width=Math.max(1,Math.round(this.frame.clientWidth/2));
    const height=Math.max(1,Math.round(this.frame.clientHeight/2));
    this.model.setViewport(width,height);
    this.app.renderer.resize(width,height);this.setTheme();
  }

  setTheme() {
    if(this.dead)return;
    this.cameo.setEnabled(this.model.season==='christmas'&&!this.motionReduced);
    const {width,height}=this.app.screen;
    const scene=createVillageScene(width,height,this.model.season);
    const previous=this.backgroundTexture;
    this.backgroundTexture=Texture.from(scene.ground);
    this.backgroundTexture.source.scaleMode='nearest';this.background.texture=this.backgroundTexture;previous?.destroy(true);
    this.setScenery(scene.objects);
    this.tree.texture=this.trees.get(this.model.season)!;
    const layout=getTreeLayout(width,height);
    this.tree.position.set(layout.x,layout.base);this.tree.width=layout.size;this.tree.height=layout.size;this.tree.zIndex=layout.base;
    const monument=getMonumentLayout(width,height);
    this.monument.position.set(monument.x,monument.base);this.monument.width=monument.size;this.monument.height=monument.size;this.monument.zIndex=monument.base;
    this.glow.position.set(layout.x,layout.base-layout.size*.35);this.glow.width=layout.size*.85;this.glow.height=layout.size*.85;this.glow.zIndex=layout.base+.01;
    this.renderState();this.app.render();
  }

  private clearScenery() {
    for(const sprite of this.scenerySprites){sprite.removeFromParent();sprite.destroy();}
    for(const texture of this.sceneryFrames)texture.destroy();
    this.sceneryAtlas?.destroy(true);
    this.scenerySprites=[];this.sceneryFrames=[];this.sceneryAtlas=undefined;
  }

  private setScenery(props:VillageScenery[]) {
    this.clearScenery();
    if(!props.length)return;
    const atlas=surface(props.reduce((sum,prop)=>sum+prop.width,0),Math.max(...props.map(prop=>prop.height)));
    this.sceneryAtlas=Texture.from(atlas.canvas);this.sceneryAtlas.source.scaleMode='nearest';
    let offset=0;
    for(const prop of props) {
      atlas.ctx.drawImage(prop.canvas,offset,0);
      const texture=new Texture({source:this.sceneryAtlas.source,frame:new Rectangle(offset,0,prop.width,prop.height)});
      this.sceneryFrames.push(texture);
      const sprite=new Sprite(texture);sprite.anchor.set(.5,1);sprite.position.set(prop.x,prop.y);sprite.zIndex=prop.y;
      this.scenerySprites.push(sprite);this.objects.addChild(sprite);offset+=prop.width;
    }
    this.sceneryAtlas.source.update();
  }

  setGlow(enabled:boolean) {this.glowEnabled=enabled;this.renderState();this.app.render();}
  setLabels(labels:VillageLabels) {this.labels=labels;this.renderOnce();}
  hitVisitor(x:number,y:number) {
    const bounds=this.app.canvas.getBoundingClientRect();
    return hitVisitor(this.model.visitors,this.app.screen.width,this.app.screen.height,x,y,bounds.width/this.app.screen.width,bounds.height/this.app.screen.height);
  }
  greetAt(clientX:number,clientY:number):number|undefined {
    const bounds=this.app.canvas.getBoundingClientRect();
    return this.hitVisitor((clientX-bounds.left)*this.app.screen.width/bounds.width,(clientY-bounds.top)*this.app.screen.height/bounds.height);
  }
  setMotionReduced(reduced:boolean) {
    if(this.dead)return;
    // A new renderer may inherit a model disabled by a previous connection.
    this.model.social.setEnabled(!reduced);
    if(this.motionReduced===reduced)return;
    this.motionReduced=reduced;
    this.cameo.setEnabled(this.model.season==='christmas'&&!reduced);
    this.renderOnce();
  }

  renderState() {
    if(this.dead)return;
    const {width,height}=this.app.screen;
    while(this.people.length<this.model.visitors.length) {
      const sprite=new Sprite(this.frames[this.people.length%VISITOR_STYLES.length][0][0]);sprite.anchor.set(.5,1);this.people.push(sprite);this.objects.addChild(sprite);
    }
    while(this.people.length>this.model.visitors.length) {const sprite=this.people.pop()!;sprite.removeFromParent();sprite.destroy();}
    this.model.visitors.forEach((p,index)=>{
      const sprite=this.people[index];
      const interaction=this.model.social.getPartner(p.id),partner=interaction?this.model.visitors[interaction.partnerId]:undefined;
      const greeting=this.model.greeting?.id===p.id?this.model.greeting:null;
      const pose=greeting
        ?{facing:'front' as const,flip:false,frame:this.motionReduced?6:6+Math.floor(greeting.age*4)%2}
        :interaction&&partner
        ?interactionPose((partner.x-p.x)*width,(partner.y-p.y)*height,interaction.pair.age,this.pose)
        :visitorPose(p,this.model.elapsed,width,height,this.pose);
      sprite.texture=(width<=210||height<110?this.compactFrames:this.frames)[p.id%VISITOR_STYLES.length][VISITOR_FACINGS.indexOf(pose.facing)][pose.frame];
      const point=getVisitorSpriteLayout(width,height,p.x,p.y,sprite.texture.width,sprite.texture.height);
      sprite.position.set(point.x,point.y);sprite.scale.set(pose.flip?-point.scale:point.scale,point.scale);sprite.zIndex=point.y;
    });
    const greeting=this.model.greeting;
    this.greetingBubble.visible=Boolean(greeting);
    if(greeting){
      const point=this.people[greeting.id].position;
      const layout=getBubbleLayout(width,height,point.x/width,point.y/height);
      this.greetingBubble.texture=this.bubbleFrames[SOCIAL_EMOTES.indexOf('heart')];
      this.greetingBubble.position.set(layout.x,layout.y);this.greetingBubble.scale.set(layout.scale);this.greetingBubble.zIndex=point.y+.1;
    }
    this.bubbles.forEach((sprite,index)=>{
      const pair=this.model.social.pairs[index];sprite.visible=Boolean(pair&&pair.age>=1.2);
      if(!sprite.visible)return;
      const person=this.model.visitors[pair.age<2.1?pair.firstId:pair.secondId];
      const point=this.people[person.id].position;
      const layout=getBubbleLayout(width,height,point.x/width,point.y/height);
      sprite.texture=this.bubbleFrames[SOCIAL_EMOTES.indexOf(pair.emote)];
      sprite.position.set(layout.x,layout.y);sprite.scale.set(layout.scale);sprite.zIndex=point.y+.1;
    });
    const guest=this.cameo.guest;
    this.guestSprite.visible=Boolean(guest);
    if(guest) {
      const layout=getHolidayLayout(width,height,guest);
      this.guestSprite.texture=this.guestFrames[guest.kind][layout.frame];
      this.guestSprite.position.set(layout.x,layout.y);this.guestSprite.scale.set(layout.scale);
      this.guestSprite.alpha=layout.alpha;this.guestSprite.zIndex=layout.y;
    }
    const guestDescription=guest?`, ${this.labels.guests[guest.kind]}`:'';
    const pairs=this.model.social.pairs;
    const socialDescription=pairs.length?`, ${this.labels.social(pairs.length,this.bubbles.some(sprite=>sprite.visible))}`:'';
    const description=`${this.labels.seasons[this.model.season]}, ${this.labels.visitors(this.model.visitors.length)}${guestDescription}${socialDescription}`;
    if(this.app.canvas.getAttribute('aria-label')!==description)this.app.canvas.setAttribute('aria-label',description);
    this.glow.visible=this.model.season==='christmas'&&this.glowEnabled;
    this.glow.alpha=.45+Math.sin(this.model.elapsed*.7)*.1;
    this.weather.clear();
    const snowy=this.model.season==='christmas'||this.model.season==='winter';
    const petals=this.model.season==='spring'||this.model.season==='autumn';
    if(snowy||petals) {
      for(let i=0;i<(snowy?45:17);i++) {
        const y=(hash(i+12)*height+this.model.elapsed*(5+hash(i+17)*5))%height;
        const x=(hash(i+74)*width+Math.sin(this.model.elapsed*.3+i)*5+width)%width;
        const px=Math.round(x),py=Math.round(y);
        this.weather.rect(px,py,i%5===0?2:1,1);
        if(!snowy&&i%3===0)this.weather.rect(px+1,py-1,1,2);
      }
      this.weather.fill({color:snowy?0xf0f8ee:this.model.season==='spring'?0xf3c4cd:0xa66b45,alpha:snowy?.65:1});
    }
  }

  renderOnce() {if(this.dead)return;this.renderState();this.app.render();}
  play(active:boolean) {if(this.dead)return;active?this.app.start():this.app.stop();}
  destroy() {
    if(this.dead)return;this.dead=true;
    this.clearScenery();
    if(this.initialized)this.app.destroy(true,{children:true});
    this.backgroundTexture?.destroy(true);this.glowTexture?.destroy(true);
    for(const texture of this.frames.flat(2))texture.destroy();
    this.characterAtlas?.destroy(true);
    for(const texture of this.compactFrames.flat(2))texture.destroy();
    this.compactAtlas?.destroy(true);this.monumentTexture?.destroy(true);
    for(const texture of this.bubbleFrames)texture.destroy();
    this.bubbleAtlas?.destroy(true);this.bubbleFrames=[];this.bubbles=[];
    for(const texture of Object.values(this.guestFrames).flat())texture.destroy();
    this.guestAtlas?.destroy(true);this.guestFrames={santa:[],rudolph:[]};
    for(const texture of this.trees.values())texture.destroy(true);
    this.people=[];this.frames=[];this.trees.clear();
  }
}
