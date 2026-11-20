import type { VisitorFacing } from './character-motion';

export const CHARACTER_WIDTH=20;
export const CHARACTER_HEIGHT=28;
export const VISITOR_FACINGS=['front','side','back'] as const;

// Original designs. Every costume uses the same anatomy and foot baseline.
export const VISITOR_STYLES=[
  {name:'딸기 우편배달부',hat:'beret',coat:'#d36372',light:'#ee9192',shade:'#9d405d',accent:'#ffe3a8',hair:'#754a44',skin:'#f3c6a0',skinShade:'#d79b7e'},
  {name:'민트 산책가',hat:'beanie',coat:'#4b9b99',light:'#80c7b5',shade:'#326771',accent:'#f5d49a',hair:'#594645',skin:'#eab88b',skinShade:'#c38b6a'},
  {name:'노란 우비 친구',hat:'hood',coat:'#e3ac4f',light:'#ffda78',shade:'#ad743d',accent:'#fff2c8',hair:'#825748',skin:'#c88b65',skinShade:'#a86c55'},
  {name:'라벤더 리본',hat:'bow',coat:'#9a78ad',light:'#c3a4d0',shade:'#69577f',accent:'#f7b6bc',hair:'#4c414f',skin:'#f3c6a0',skinShade:'#d79b7e'},
  {name:'숲속 정원사',hat:'cap',coat:'#6a9963',light:'#a6bd7c',shade:'#456851',accent:'#f7d497',hair:'#a16e45',skin:'#eab88b',skinShade:'#c38b6a'},
  {name:'밤색 책방지기',hat:'hair',coat:'#b77a59',light:'#d7a17a',shade:'#80564e',accent:'#9dd4cd',hair:'#473b40',skin:'#c88b65',skinShade:'#a86c55'},
  {name:'크림 곰돌이',hat:'bear',coat:'#c5bb9c',light:'#f2e9ce',shade:'#8e927d',accent:'#e6a3a1',hair:'#79594d',skin:'#f3c6a0',skinShade:'#d79b7e'},
  {name:'밤하늘 털모자',hat:'pompom',coat:'#617da1',light:'#97b3cb',shade:'#425570',accent:'#d8b1c9',hair:'#a8754e',skin:'#eab88b',skinShade:'#c38b6a'},
] as const;

const ink='#34434b';
const boots='#434354';
const colors=new Map<string,readonly number[]>();

/** Pixel buffers keep art testable without a DOM or a GPU. No smoothing. */
export function visitorPixels(style:number,facing:VisitorFacing,frame:number):Uint8ClampedArray {
  const outfit=VISITOR_STYLES[style%VISITOR_STYLES.length];
  const pixels=new Uint8ClampedArray(CHARACTER_WIDTH*CHARACTER_HEIGHT*4);
  const r=(x:number,y:number,w:number,h:number,color:string)=>{
    let rgba=colors.get(color);
    if(!rgba){rgba=[parseInt(color.slice(1,3),16),parseInt(color.slice(3,5),16),parseInt(color.slice(5,7),16),color.length===9?parseInt(color.slice(7,9),16):255];colors.set(color,rgba);}
    for(let row=Math.max(0,y);row<Math.min(CHARACTER_HEIGHT,y+h);row++)for(let col=Math.max(0,x);col<Math.min(CHARACTER_WIDTH,x+w);col++){
      const index=(row*CHARACTER_WIDTH+col)*4;
      pixels[index]=rgba[0];pixels[index+1]=rgba[1];pixels[index+2]=rgba[2];pixels[index+3]=rgba[3];
    }
  };
  const stepping=frame>=1&&frame<=4;
  const bob=frame===2||frame===4?-1:0;
  const stride=frame===1?1:frame===3?-1:0;
  const blink=frame===5;
  const side=facing==='side';
  const back=facing==='back';
  // One spare top row keeps the beret stem/pompom inside the frame on a passing step.
  const y=(value:number)=>value+bob+1;

  // Ground shadow is independent of the head bounce.
  r(5,26,10,1,'#26453c48');r(3,27,14,1,'#26453c28');

  // Alternate planted feet; the passing poses have different leading legs.
  const leftX=side?7-stride:6+(frame===4?1:0);
  const rightX=side?10+stride:11-(frame===2?1:0);
  r(leftX,21+stride,3,4,ink);r(rightX,21-stride,3,4,ink);
  r(leftX,22+stride,2,2,'#677080');r(rightX,22-stride,2,2,'#677080');
  r(leftX-1,24+stride,4,2,boots);r(rightX,24-stride,4,2,boots);
  r(leftX-1,24+stride,2,1,'#a5a1a1');r(rightX+1,24-stride,2,1,'#a5a1a1');

  // Coat, mittens and a small scarf remain readable at native resolution.
  r(side?6:4,y(16),side?8:12,6,ink);
  r(side?7:5,y(15),side?7:10,7,outfit.shade);
  r(side?8:6,y(16),side?5:8,5,outfit.coat);
  r(side?8:6,y(16),side?2:3,3,outfit.light);
  r(side?7:5,y(22),side?7:10,1,ink);
  const leftArm=stride||(!stepping?0:frame===2?-1:1);
  if(!side){
    r(3,y(17+leftArm),3,4,ink);r(4,y(17+leftArm),2,2,outfit.light);
    r(3,y(20+leftArm),3,2,outfit.skinShade);r(4,y(20+leftArm),2,1,outfit.skin);
  }
  r(side?13:14,y(17-leftArm),3,4,ink);r(side?13:14,y(17-leftArm),2,2,outfit.coat);
  r(side?13:14,y(20-leftArm),3,2,outfit.skinShade);r(side?13:14,y(20-leftArm),2,1,outfit.skin);
  r(side?8:6,y(15),side?6:8,2,outfit.accent);
  if(!back){r(side?12:11,y(17),2,3,outfit.accent);r(side?10:9,y(19),1,1,outfit.accent);r(side?10:9,y(21),1,1,outfit.accent);}

  // Broad, rounded head: a dark one-pixel silhouette on every background.
  r(6,y(2),8,1,ink);r(4,y(3),12,2,ink);r(3,y(5),14,7,ink);r(4,y(12),12,2,ink);r(6,y(14),8,1,ink);
  r(4,y(5),12,7,back?outfit.hair:outfit.skin);
  r(5,y(12),10,2,back?outfit.hair:outfit.skinShade);
  r(5,y(4),10,3,outfit.hair);r(4,y(6),2,4,outfit.hair);r(14,y(6),2,3,outfit.hair);
  if(back){
    r(5,y(6),10,7,outfit.hair);r(6,y(13),8,1,outfit.shade);r(7,y(6),2,4,outfit.light);
  }else if(side){
    r(4,y(6),5,7,outfit.hair);r(7,y(11),2,3,outfit.hair);
    r(16,y(9),2,2,outfit.skinShade);r(16,y(9),1,1,outfit.skin);
    r(13,y(blink?10:9),2,blink?1:3,ink);
    if(!blink)r(13,y(9),1,1,'#fff5de');
    r(12,y(12),2,1,'#d98583');r(15,y(12),1,1,'#9b6159');
  }else{
    r(6,y(blink?10:9),2,blink?1:3,ink);r(12,y(blink?10:9),2,blink?1:3,ink);
    if(!blink){r(6,y(9),1,1,'#fff5de');r(12,y(9),1,1,'#fff5de');}
    r(5,y(12),2,1,'#e19791');r(13,y(12),2,1,'#e19791');r(9,y(13),2,1,'#a36b64');
    r(8,y(6),2,1,outfit.hair);r(12,y(7),2,1,outfit.hair);
  }

  // Costume-specific silhouettes, rather than just a palette swap.
  if(outfit.hat==='beret'){
    r(8,y(0),2,2,ink);r(5,y(2),11,1,ink);r(3,y(3),14,3,ink);
    r(4,y(3),12,2,outfit.coat);r(6,y(2),8,2,outfit.light);r(5,y(6),11,1,outfit.shade);
    r(side?4:14,y(19),4,4,'#795548');r(side?4:14,y(19),4,1,'#edc281');
  }else if(outfit.hat==='beanie'||outfit.hat==='pompom'){
    r(5,y(1),10,2,ink);r(4,y(3),12,4,ink);r(5,y(2),10,3,outfit.coat);
    r(5,y(2),3,2,outfit.light);r(3,y(5),14,2,ink);r(4,y(5),12,2,outfit.accent);
    r(6,y(5),1,2,outfit.light);r(10,y(5),1,2,outfit.light);r(14,y(5),1,2,outfit.light);
    if(outfit.hat==='pompom'){r(8,y(0),4,2,ink);r(9,y(0),2,2,outfit.accent);}
  }else if(outfit.hat==='hood'||outfit.hat==='bear'){
    r(5,y(2),10,2,outfit.coat);r(4,y(4),12,2,outfit.light);
    r(3,y(6),2,7,outfit.shade);r(15,y(6),2,7,outfit.shade);
    r(4,y(6),1,6,outfit.light);r(15,y(6),1,6,outfit.light);
    if(back){r(5,y(6),10,8,outfit.coat);r(6,y(6),3,5,outfit.light);}
    if(outfit.hat==='bear'){
      r(3,y(1),4,3,ink);r(13,y(1),4,3,ink);
      r(4,y(1),2,3,outfit.light);r(14,y(1),2,3,outfit.light);
      r(4,y(2),2,1,outfit.accent);r(14,y(2),2,1,outfit.accent);
    }else{r(2,y(5),16,1,ink);r(3,y(5),14,1,outfit.light);}
  }else if(outfit.hat==='cap'){
    r(5,y(2),10,3,ink);r(6,y(2),8,3,outfit.coat);r(7,y(2),3,1,outfit.light);
    r(side?9:4,y(5),side?9:12,2,ink);r(side?10:5,y(5),side?8:10,1,outfit.accent);
  }else if(outfit.hat==='bow'){
    r(3,y(4),2,9,outfit.hair);r(15,y(4),2,9,outfit.hair);r(4,y(12),2,2,outfit.hair);
    r(4,y(1),3,3,ink);r(8,y(1),3,3,ink);r(5,y(1),2,2,outfit.accent);r(8,y(1),2,2,outfit.accent);r(7,y(2),1,2,outfit.coat);
  }else{
    r(4,y(3),11,3,outfit.hair);r(5,y(2),4,2,outfit.hair);r(7,y(3),4,1,'#776059');
    if(!back){
      if(side){
        r(12,y(9),4,3,outfit.accent);r(13,y(10),2,1,ink);
        if(!blink)r(13,y(10),1,1,'#fff5de');
      }else{
        r(5,y(9),4,3,outfit.accent);r(11,y(9),4,3,outfit.accent);r(9,y(10),2,1,outfit.accent);r(6,y(10),2,1,ink);r(12,y(10),2,1,ink);
        if(!blink){r(6,y(10),1,1,'#fff5de');r(12,y(10),1,1,'#fff5de');}
      }
    }
  }
  if(back){
    r(7,y(17),7,6,ink);r(8,y(17),5,5,outfit.accent);r(9,y(17),2,1,'#fff0ce');r(8,y(20),5,1,outfit.shade);
  }
  return pixels;
}
