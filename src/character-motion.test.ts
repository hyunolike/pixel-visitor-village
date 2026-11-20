import { describe, expect, it } from 'vitest';
import { visitorPose } from './character-motion';

const person={id:0,vx:.02,vy:.008,phase:0};

describe('visitor pose selection',()=>{
  it('uses screen-space velocity for front, back and side facings',()=>{
    expect(visitorPose(person,0,500,250)).toMatchObject({facing:'side',flip:false});
    expect(visitorPose({...person,vx:-.02},0,500,250)).toMatchObject({facing:'side',flip:true});
    expect(visitorPose(person,0,100,500)).toMatchObject({facing:'front',flip:false});
    expect(visitorPose({...person,vy:-.008},0,100,500)).toMatchObject({facing:'back',flip:false});
  });

  it('cycles through four walk poses instead of alternating two leg lengths',()=>{
    expect([0,.18,.35,.52].map(time=>visitorPose(person,time,500,250).frame)).toEqual([1,2,3,4]);
  });

  it('holds the standing pose during the model rest period',()=>{
    const resting={...person,phase:4.2};
    expect([0,.2,.4].map(time=>visitorPose(resting,time,500,250).frame)).toEqual([0,0,0]);
  });

  it('uses a blink pose only while resting',()=>{
    expect(visitorPose({...person,phase:4.7},0,500,250).frame).toBe(5);
    for(let time=0;time<15;time+=.07){
      if(Math.sin(time*.7+person.phase)>=-.45){
        expect(visitorPose(person,time,500,250).frame).toBeGreaterThanOrEqual(1);
        expect(visitorPose(person,time,500,250).frame).toBeLessThanOrEqual(4);
      }
    }
  });

  it('keeps poses deterministic at a frozen model time and offsets visitors',()=>{
    const frozen=visitorPose(person,.3,500,250);
    for(let i=0;i<20;i++)expect(visitorPose(person,.3,500,250)).toEqual(frozen);
    expect(visitorPose({...person,phase:1.5},.3,500,250).frame).not.toBe(frozen.frame);
  });

  it('reuses one pose object without carrying a previous visitor flip or frame',()=>{
    const scratch=visitorPose({...person,vx:-.02},0,500,250);
    const result=visitorPose({...person,phase:4.2},0,100,500,scratch);
    expect(result).toBe(scratch);
    expect(result).toEqual({facing:'front',flip:false,frame:0});
  });
});
