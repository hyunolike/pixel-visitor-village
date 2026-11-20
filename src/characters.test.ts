import { describe, expect, it } from 'vitest';
import { CHARACTER_WIDTH, CHARACTER_HEIGHT, VISITOR_STYLES, VISITOR_FACINGS, visitorPixels } from './characters';

describe('original visitor pixel sprites',()=>{
  it('provides eight distinct characters on a consistent transparent 20 by 28 canvas',()=>{
    expect([CHARACTER_WIDTH,CHARACTER_HEIGHT,VISITOR_STYLES.length]).toEqual([20,28,8]);
    const variants=VISITOR_STYLES.map((_,style)=>Array.from(visitorPixels(style,'front',0)).join(','));
    expect(new Set(variants).size).toBe(8);
  });

  it('renders all atlas poses with visible art and a transparent edge',()=>{
    for(let style=0;style<VISITOR_STYLES.length;style++)for(const facing of VISITOR_FACINGS)for(let frame=0;frame<6;frame++){
      const pixels=visitorPixels(style,facing,frame);
      expect(pixels).toHaveLength(20*28*4);
      let opaque=0;
      for(let i=3;i<pixels.length;i+=4)if(pixels[i]===255)opaque++;
      expect(opaque).toBeGreaterThan(100);
      expect(pixels[3]).toBe(0);
      expect(pixels[(20-1)*4+3]).toBe(0);
    }
  });

  it('distinguishes front, side and back and every footstep of the walk cycle',()=>{
    for(let style=0;style<8;style++){
      expect(new Set(VISITOR_FACINGS.map(facing=>Array.from(visitorPixels(style,facing,0)).join(','))).size).toBe(3);
      for(const facing of VISITOR_FACINGS){
        const steps=[1,2,3,4].map(frame=>Array.from(visitorPixels(style,facing,frame)).join(','));
        expect(new Set(steps).size).toBe(4);
      }
    }
  });

  it('keeps the complete hat silhouette when the head bobs upward',()=>{
    const headPixels=(pixels:Uint8ClampedArray,rows:number)=>{
      let count=0;
      for(let i=3;i<20*rows*4;i+=4)if(pixels[i]===255)count++;
      return count;
    };
    for(let style=0;style<8;style++)for(const facing of VISITOR_FACINGS){
      expect(headPixels(visitorPixels(style,facing,2),15)).toBe(headPixels(visitorPixels(style,facing,0),16));
    }
  });

  it('keeps blinking visible for front and side poses, including glasses',()=>{
    for(let style=0;style<8;style++)for(const facing of ['front','side'] as const){
      expect(visitorPixels(style,facing,5)).not.toEqual(visitorPixels(style,facing,0));
    }
  });
});
