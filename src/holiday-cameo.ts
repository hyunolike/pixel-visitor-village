export type HolidayKind='santa'|'rudolph';
export interface HolidayGuest {kind:HolidayKind;x:number;y:number;age:number;duration:number}

/** Decorative guests use active animation time, never the real visitor model or wall time. */
export class HolidayCameoModel {
  private enabled=false;
  private remaining=0;
  private current:HolidayGuest|null=null;
  constructor(private random:()=>number=()=>Math.random()) {}
  get guest():Readonly<HolidayGuest>|null {return this.current;}

  setEnabled(enabled:boolean) {
    if(this.enabled===enabled)return;
    this.enabled=enabled;this.current=null;
    this.remaining=enabled?4+this.random()*4:0;
  }
  step(seconds:number) {
    if(!this.enabled||!Number.isFinite(seconds)||seconds<=0)return;
    const dt=Math.min(.05,seconds);
    if(this.current) {
      const age=this.current.age+dt;
      if(age>=this.current.duration) {
        this.current=null;this.remaining=20+this.random()*20;
      } else this.current={...this.current,age};
      return;
    }
    this.remaining-=dt;
    if(this.remaining>1e-9)return;
    const kind=this.random()<.5?'santa':'rudolph';
    const right=this.random()>=.5;
    this.current={kind,x:(right?.68:.16)+this.random()*.16,y:.82+this.random()*.05,age:0,duration:5+this.random()*3};
  }
}

export function getHolidayLayout(width:number,height:number,guest:Readonly<HolidayGuest>) {
  const w=Math.max(1,width),h=Math.max(1,height);
  const scale=Math.min(1,w/32,h/36);
  return {
    x:Math.max(16*scale,Math.min(w-16*scale,w*guest.x)),
    y:Math.max(36*scale,Math.min(h,h*guest.y)),
    scale,
    alpha:Math.max(0,Math.min(1,guest.age/.3,(guest.duration-guest.age)/.3)),
    frame:Math.floor(guest.age*2)%2,
  };
}
