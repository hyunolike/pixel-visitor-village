import { describe, expect, it } from 'vitest';
import { CHARACTER_WIDTH, CHARACTER_HEIGHT, VISITOR_STYLES, VISITOR_FACINGS, visitorPixels } from './characters';
import { HOLIDAY_WIDTH, HOLIDAY_HEIGHT, holidayPixels } from './holiday-art';
import { SOCIAL_EMOTES, socialPixels } from './social-art';

describe('original visitor pixel sprites',()=>{
  it('lifts the right mitten instead of keeping an extra lowered hand while waving',()=>{
    const alpha=(frame:number)=>visitorPixels(1,'front',frame)[(22*CHARACTER_WIDTH+16)*4+3];
    expect(alpha(0)).toBe(255);expect(alpha(6)).toBe(0);expect(alpha(7)).toBe(0);
  });
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

describe('greeting frames and original icon bubbles',()=>{
  it('adds two distinct waving poses for every costume and facing',()=>{
    for(let style=0;style<8;style++)for(const facing of VISITOR_FACINGS){
      expect(visitorPixels(style,facing,6)).not.toEqual(visitorPixels(style,facing,0));
      expect(visitorPixels(style,facing,7)).not.toEqual(visitorPixels(style,facing,6));
    }
  });
  it('draws three distinct transparent 18 by 14 bubbles without text or external assets',()=>{
    expect(SOCIAL_EMOTES).toEqual(['dots','heart','spark']);
    const images=SOCIAL_EMOTES.map(kind=>socialPixels(kind));
    expect(new Set(images.map(pixels=>Array.from(pixels).join(','))).size).toBe(3);
    for(const pixels of images){
      expect(pixels).toHaveLength(18*14*4);
      expect(pixels[3]).toBe(0);
      expect([...pixels].some((value,index)=>index%4===3&&value===255)).toBe(true);
    }
  });
});

describe('original Christmas guest artwork',()=>{
  it('provides distinct Santa and Rudolph poses with a transparent pixel boundary',()=>{
    expect([HOLIDAY_WIDTH,HOLIDAY_HEIGHT]).toEqual([32,36]);
    const variants=new Set<string>();
    for(const kind of ['santa','rudolph'] as const)for(const frame of [0,1]){
      const pixels=holidayPixels(kind,frame);
      expect(pixels).toHaveLength(32*36*4);
      expect([...pixels].filter((_,index)=>index%4===3&&pixels[index]===255).length).toBeGreaterThan(150);
      for(let x=0;x<32;x++){expect(pixels[x*4+3]).toBe(0);expect(pixels[(35*32+x)*4+3]).toBe(0);}
      for(let y=0;y<36;y++){expect(pixels[(y*32)*4+3]).toBe(0);expect(pixels[(y*32+31)*4+3]).toBe(0);}
      variants.add(Array.from(pixels).join(','));
    }
    expect(variants.size).toBe(4);
  });
  it('keeps Rudolphs red nose distinct from Santas white beard',()=>{
    const nose=holidayPixels('rudolph',0).slice((17*32+29)*4,(17*32+29)*4+4);
    expect(nose[0]).toBeGreaterThan(nose[1]*1.5);expect(nose[3]).toBe(255);
    const beard=holidayPixels('santa',0).slice((18*32+15)*4,(18*32+15)*4+4);
    expect(beard[0]).toBeGreaterThan(220);expect(beard[1]).toBeGreaterThan(220);expect(beard[3]).toBe(255);
  });
});
