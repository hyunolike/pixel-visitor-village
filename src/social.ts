import type { Visitor } from './model';

export type SocialEmote='dots'|'heart'|'spark';
export interface SocialPair {firstId:number;secondId:number;age:number;emote:SocialEmote}
interface Participation {pair:SocialPair;partnerId:number}
interface Candidate {person:Visitor;x:number;y:number}

/** All times are active scene seconds. Searches have a fixed comparison budget. */
export class SocialModel {
  private active:SocialPair[]=[];
  private participants=new Map<number,Participation>();
  private cooldown=new Map<number,number>();
  private people=new Map<number,Visitor>();
  private source:readonly Visitor[]|undefined;
  private sourceLength=-1;
  private width=500;
  private height=240;
  private now=0;
  private nextSearch=2;
  private enabled=true;
  constructor(private random:()=>number=Math.random) {}
  get pairs():readonly SocialPair[] {return this.active;}
  getPartner(id:number):Participation|undefined {return this.participants.get(id);}

  reconcile(people:readonly Visitor[]) {
    this.people=new Map(people.map(person=>[person.id,person]));
    for(const pair of [...this.active])if(!this.people.has(pair.firstId)||!this.people.has(pair.secondId))this.release(pair);
    for(const id of this.cooldown.keys())if(!this.people.has(id))this.cooldown.delete(id);
    this.source=people;this.sourceLength=people.length;
  }
  reset() {
    for(const pair of [...this.active])this.release(pair);
    this.nextSearch=this.now+2;
  }
  setEnabled(enabled:boolean) {
    if(this.enabled===enabled)return;
    this.reset();this.enabled=enabled;
  }
  setViewport(width:number,height:number) {
    this.width=Math.max(1,Number.isFinite(width)?width:1);
    this.height=Math.max(1,Number.isFinite(height)?height:1);
    // Distance is a creation constraint. Preserve the oldest pairs on resize.
    const cap=this.width<220?1:3;
    for(const pair of this.active.slice(cap))this.release(pair);
  }
  step(people:readonly Visitor[],seconds:number) {
    if(!this.enabled||!Number.isFinite(seconds)||seconds<=0)return;
    if(people!==this.source||people.length!==this.sourceLength)this.reconcile(people);
    const dt=Math.min(.05,seconds);this.now+=dt;
    for(const pair of [...this.active]){
      pair.age+=dt;
      if(pair.age>=3-1e-9)this.release(pair);
    }
    if(this.now+1e-9<this.nextSearch)return;
    this.nextSearch=this.now+.4;
    if(this.active.length<(this.width<220?1:3))this.search(people);
  }
  private release(pair:SocialPair) {
    this.active=this.active.filter(current=>current!==pair);
    for(const id of [pair.firstId,pair.secondId]){
      this.participants.delete(id);
      if(this.people.has(id))this.cooldown.set(id,this.now+18);
    }
  }
  private search(people:readonly Visitor[]) {
    const cells=new Map<string,Candidate[]>();
    for(const person of people){
      if(this.participants.has(person.id)||(this.cooldown.get(person.id)??0)>this.now)continue;
      const x=person.x*this.width,y=person.y*this.height,key=`${Math.floor(x/42)},${Math.floor(y/42)}`;
      let cell=cells.get(key);if(!cell){cell=[];cells.set(key,cell);}
      if(cell.length<16)cell.push({person,x,y});
    }
    let comparisons=0;
    const cap=this.width<220?1:3;
    for(const cell of cells.values())for(const a of cell){
      if(this.participants.has(a.person.id))continue;
      const gx=Math.floor(a.x/42),gy=Math.floor(a.y/42);
      candidates:for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        for(const b of cells.get(`${gx+dx},${gy+dy}`)??[]){
          if(b.person.id<=a.person.id||this.participants.has(b.person.id))continue;
          if(++comparisons>512)return;
          const distance=Math.hypot(a.x-b.x,a.y-b.y);
          if(distance<22||distance>42||Math.abs(a.y-b.y)>14||crossesTrunk(a.person,b.person))continue;
          const emote=(['dots','heart','spark'] as const)[Math.max(0,Math.min(2,Math.floor(this.random()*3)))];
          const pair:SocialPair={firstId:a.person.id,secondId:b.person.id,age:0,emote};
          this.active.push(pair);
          this.participants.set(pair.firstId,{pair,partnerId:pair.secondId});
          this.participants.set(pair.secondId,{pair,partnerId:pair.firstId});
          if(this.active.length===cap)return;
          break candidates;
        }
      }
    }
  }
}

/** Slab intersection rejects greetings through the model's tree obstacle. */
function crossesTrunk(a:Visitor,b:Visitor):boolean {
  let enter=0,leave=1;
  for(const [start,end,low,high] of [[a.x,b.x,.46,.54],[a.y,b.y,.73,.83]]){
    const delta=end-start;
    if(Math.abs(delta)<1e-12){if(start<low||start>high)return false;continue;}
    const first=(low-start)/delta,second=(high-start)/delta;
    enter=Math.max(enter,Math.min(first,second));leave=Math.min(leave,Math.max(first,second));
    if(enter>leave)return false;
  }
  return true;
}
