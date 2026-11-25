import type { Visitor } from './model';

export type VisitorFacing='front'|'side'|'back';
export interface VisitorPose { facing:VisitorFacing; flip:boolean; frame:number }

export function interactionPose(dx:number,dy:number,age:number,result:VisitorPose={facing:'front',flip:false,frame:0}):VisitorPose {
  const side=Math.abs(dx)>=Math.abs(dy);
  result.facing=side?'side':dy<0?'back':'front';result.flip=side&&dx<0;
  result.frame=age<1.2?6+Math.floor(age*4)%2:0;
  return result;
}

/** The model owns time: pausing it also freezes footsteps and blinking. */
export function visitorPose(person:Pick<Visitor,'vx'|'vy'|'phase'>,elapsed:number,width:number,height:number,result:VisitorPose={facing:'front',flip:false,frame:0}):VisitorPose {
  const side=Math.abs(person.vx*width)>=Math.abs(person.vy*height);
  const facing:VisitorFacing=side?'side':person.vy<0?'back':'front';
  const walking=Math.sin(elapsed*.7+person.phase)>=-.45;
  const frame=walking
    ? 1+Math.floor(elapsed*6+person.phase*2/Math.PI)%4
    : (elapsed+person.phase)%4.8>4.62?5:0;
  result.facing=facing;result.flip=side&&person.vx<0;result.frame=frame;
  return result;
}
