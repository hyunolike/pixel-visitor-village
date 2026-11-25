import type { HolidayKind } from './holiday-cameo';

export const HOLIDAY_WIDTH=32;
export const HOLIDAY_HEIGHT=36;

/** Original pixel artwork: no downloaded assets, image requests or Canvas dependency. */
export function holidayPixels(kind:HolidayKind,frame:number):Uint8ClampedArray {
  const pixels=new Uint8ClampedArray(HOLIDAY_WIDTH*HOLIDAY_HEIGHT*4);
  const r=(x:number,y:number,w:number,h:number,color:string)=>{
    if(kind==='rudolph'&&frame%2&&y<26)y-=1;
    const rgba=[parseInt(color.slice(1,3),16),parseInt(color.slice(3,5),16),parseInt(color.slice(5,7),16),color.length===9?parseInt(color.slice(7,9),16):255];
    for(let row=Math.max(0,y);row<Math.min(HOLIDAY_HEIGHT,y+h);row++)for(let col=Math.max(0,x);col<Math.min(HOLIDAY_WIDTH,x+w);col++) {
      pixels.set(rgba,(row*HOLIDAY_WIDTH+col)*4);
    }
  };
  const ink='#293d36',white='#fff0c9',red='#cf6252',light='#f09171',brown='#ac7a48';
  r(5,34,23,1,'#233e3848');
  if(kind==='santa') {
    // Gift sack and its stitched top sit behind the coat.
    r(3,18,10,13,ink);r(4,19,8,11,'#806044');r(5,20,2,7,'#b98d59');
    r(5,17,6,3,'#d1af69');r(7,16,2,3,'#f1d18a');
    r(9,29,6,5,ink);r(20,29,5,5,ink);
    r(8,33,7,1,'#a0a1a0');r(20,33,7,1,'#a0a1a0');
    r(9,26,15,6,'#993c41');r(11,28,4,4,red);r(20,28,3,4,red);
    r(7,18,19,11,ink);r(8,19,17,9,red);r(9,19,4,6,light);
    r(16,19,3,7,white);r(8,27,17,2,white);
    r(5,20,4,8,ink);r(6,21,2,5,red);r(5,26,4,3,white);
    const hand=frame%2?13:21;
    r(25,hand,4,8,ink);r(25,hand+1,3,5,red);r(25,hand,4,3,white);
    r(8,25,17,3,'#453c3b');r(15,25,5,3,'#edc26a');r(16,26,3,1,'#453c3b');
    // Round face, rosy nose and a stepped white beard.
    r(10,8,13,11,ink);r(11,9,11,8,'#edbd91');r(11,10,3,5,'#ffdbb0');
    r(13,11,2,2,ink);r(19,11,2,2,ink);
    r(10,15,13,3,white);r(12,17,9,3,white);r(14,20,5,1,'#d6dcca');
    r(16,13,3,3,'#df9582');r(13,16,3,1,'#d0cbbb');r(19,16,3,1,'#d0cbbb');
    r(10,3,10,5,ink);r(11,3,8,4,red);r(12,2,6,2,light);
    r(18,4,6,4,red);r(22,6,4,3,white);
    r(9,7,15,3,white);r(10,7,13,1,'#ffffff');
  } else {
    // Four legs alternate slightly while the body stays on a fixed foot baseline.
    const step=frame%2;
    for(const [x,y] of [[6,26+step],[12,27-step],[22,26-step],[26,27+step]]) {
      const leg=x+(step?(x<16?1:-1):0);
      r(leg,y,3,33-y,ink);r(leg,y,2,31-y,brown);r(leg,32,4,2,ink);
    }
    r(4,19,22,10,ink);r(5,20,20,8,brown);r(7,20,12,3,'#c89461');
    r(9,25,12,3,'#e5c89b');r(2,20,3,4,'#f2dbb2');
    r(20,13,9,14,ink);r(21,14,7,12,brown);r(22,15,2,7,'#c89461');
    r(19,10,10,10,ink);r(20,11,8,8,'#c89461');
    r(17,10,5,3,brown);r(27,10,4,3,brown);r(18,11,3,1,'#e5c89b');
    r(25,16,6,5,ink);r(26,17,5,3,'#deb583');
    r(24,13,2,2,ink);r(24,13,1,1,white);
    r(29,16,2,3,red);r(29,16,1,1,'#ffb68e');
    // Branching antlers and a red winter scarf make Rudolph recognizable.
    r(21,3,2,8,'#73533c');r(18,3,5,2,'#73533c');r(18,2,2,3,'#b09168');
    r(20,6,3,2,'#b09168');r(26,2,2,9,'#73533c');r(27,4,4,2,'#b09168');
    r(29,2,2,3,'#73533c');r(24,6,4,2,'#b09168');
    r(20,19,9,3,red);r(23,22,3,5,red);r(20,19,7,1,light);
  }
  return pixels;
}
