import { SocialModel } from './social';
export const MAX_VISITORS = 5000;
export const SEASONS = ['christmas', 'spring', 'summer', 'autumn', 'winter'] as const;
export type Season = typeof SEASONS[number];
export interface Visitor { id:number; x:number; y:number; vx:number; vy:number; phase:number }
const hash = (n:number) => { const value=Math.sin(n*127.1+31.7)*43758.5453;return value-Math.floor(value); };
const trunk = (x:number,y:number) => (x>.46&&x<.54&&y>.73&&y<.83)||(x>.39&&x<.48&&y>.80&&y<.84);

export function parseCount(raw:string|null):number {
  if(raw===null||raw==='') return 0;
  const text=raw.trim();
  if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(text)) throw new Error('오늘 방문자 수를 0 이상의 정수로 전달해 주세요.');
  const count=Number(text.replaceAll(',',''));
  validateCount(count);
  return count;
}
function validateCount(count:number):void {
  if(!Number.isSafeInteger(count)||count<0) throw new Error('방문자 수는 0 이상의 안전한 정수여야 해요.');
  if(count>MAX_VISITORS) throw new Error(`현재는 ${MAX_VISITORS.toLocaleString('ko-KR')}명까지 표시할 수 있어요. 입력한 수: ${count.toLocaleString('ko-KR')}명. 방문자 수를 줄여 표시하지는 않아요.`);
}
export function getTreeLayout(width:number,height:number) {
  const w=Math.max(0,width), h=Math.max(0,height);
  return {x:w/2,base:h*.80,size:Math.min(w*.74,h*.69)};
}

/** Separate foreground landmark; positive even in a not-yet-measured host. */
export function getMonumentLayout(width:number,height:number) {
  const w=Math.max(1,width),h=Math.max(1,height),size=Math.max(1,Math.min(w*.16,h*.22));
  return {x:Math.max(size/2,Math.min(w-size/2,w*.435)),base:Math.max(size,Math.min(h,h*.83)),size};
}

/** Keep the complete anchored sprite visible, including in very small hosts. */
export function getVisitorSpriteLayout(width:number,height:number,x:number,y:number,spriteWidth=20,spriteHeight=28) {
  const w=Math.max(1,width),h=Math.max(1,height);
  const scale=Math.min(1,w/spriteWidth,h/spriteHeight),half=spriteWidth*scale/2,tall=spriteHeight*scale;
  return {x:Math.max(half,Math.min(w-half,Math.round(x*w))),y:Math.max(tall,Math.min(h,Math.round(y*h))),scale};
}

/** Hit the displayed body, with a 24 CSS-pixel minimum target at any canvas scale. */
export function hitVisitor(people:readonly Visitor[],width:number,height:number,x:number,y:number,cssScaleX:number,cssScaleY:number):number|undefined {
  if(![width,height,x,y,cssScaleX,cssScaleY].every(Number.isFinite)||width<=0||height<=0||cssScaleX<=0||cssScaleY<=0||x<0||y<0||x>width||y>height)return;
  const compact=width<=210||height<110,sw=compact?16:20,sh=compact?22:28;
  let selected:number|undefined,front=-Infinity;
  for(const person of people){
    const point=getVisitorSpriteLayout(width,height,person.x,person.y,sw,sh);
    const halfWidth=Math.max(sw*point.scale,24/cssScaleX)/2;
    const halfHeight=Math.max(sh*point.scale,24/cssScaleY)/2;
    if(Math.abs(x-point.x)<=halfWidth&&Math.abs(y-(point.y-sh*point.scale/2))<=halfHeight&&(point.y>front||(point.y===front&&person.id>(selected??-1)))){selected=person.id;front=point.y;}
  }
  return selected;
}

export class VillageModel {
  readonly visitors:Visitor[]=[];
  readonly social=new SocialModel();
  season:Season='christmas';
  elapsed=0;
  greeting:{id:number;age:number}|null=null;
  greet(id:number):boolean {
    if(!Number.isInteger(id)||!this.visitors[id])return false;
    this.social.reset();this.greeting={id,age:0};return true;
  }
  invite():boolean {
    if(this.visitors.length>=MAX_VISITORS)return false;
    this.setCount(this.visitors.length+1);
    Object.assign(this.visitors.at(-1)!,{x:.5,y:.94,vx:0,vy:-.04});return true;
  }
  setCount(count:number):void {
    validateCount(count);
    while(this.visitors.length<count) {
      const id=this.visitors.length;
      let x=.04+hash(id+1)*.92;
      const y=.52+hash(id+301)*.40;
      if(trunk(x,y)) x=x<.445?.38:.56;
      this.visitors.push({id,x,y,vx:(hash(id+3)>.5?1:-1)*(.012+hash(id+7)*.012),vy:(hash(id+5)>.5?1:-1)*(.004+hash(id+9)*.006),phase:hash(id+39)*Math.PI*2});
    }
    this.visitors.length=count;
    if(this.greeting&&!this.visitors[this.greeting.id])this.greeting=null;
    this.social.reconcile(this.visitors);
  }
  setViewport(width:number,height:number) {this.social.setViewport(width,height);}
  setSeason(value:string):void {
    if(!(SEASONS as readonly string[]).includes(value)) throw new Error('선택할 수 없는 계절이에요. christmas, spring, summer, autumn, winter 중 하나를 사용해 주세요.');
    if(this.season!==value){this.social.reset();this.greeting=null;}
    this.season=value as Season;
  }
  step(seconds:number):void {
    if(!Number.isFinite(seconds)||seconds<=0) return;
    const dt=Math.min(.05,seconds);this.elapsed+=dt;
    if(this.greeting){this.greeting.age+=dt;if(this.greeting.age>=3-1e-9)this.greeting=null;}
    this.social.step(this.visitors,dt,this.greeting?.id);
    for(const p of this.visitors) {
      if(this.greeting?.id===p.id)continue;
      if(this.social.getPartner(p.id))continue;
      if(Math.sin(this.elapsed*.7+p.phase)<-.45) continue;
      let x=p.x+p.vx*dt,y=p.y+p.vy*dt;
      if(x<.035||x>.965) {p.vx*=-1;x=Math.max(.035,Math.min(.965,x));}
      if(y<.51||y>.94) {p.vy*=-1;y=Math.max(.51,Math.min(.94,y));}
      if(trunk(x,y)) {p.vx*=-1;p.vy*=-1;continue;}
      p.x=x;p.y=y;
    }
  }
}
