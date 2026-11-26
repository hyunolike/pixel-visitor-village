import { fitArtPixels } from './art-palette.ts';
import type { SocialEmote } from './social';
export const SOCIAL_EMOTES=['dots','heart','spark'] as const;
export const BUBBLE_WIDTH=18;
export const BUBBLE_HEIGHT=14;

/** Original tiny icon balloons. Shared by all visitors, no external assets. */
export function socialPixels(kind:SocialEmote):Uint8ClampedArray {
  const pixels=new Uint8ClampedArray(BUBBLE_WIDTH*BUBBLE_HEIGHT*4);
  const rect=(x:number,y:number,w:number,h:number,color:readonly number[])=>{
    for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++)pixels.set(color,(row*BUBBLE_WIDTH+col)*4);
  };
  const ink=[38,62,53,255],paper=[255,239,196,255];
  rect(2,0,14,12,ink);rect(0,2,18,8,ink);rect(3,1,12,10,paper);rect(1,3,16,6,paper);
  rect(7,11,4,2,ink);rect(7,11,2,1,paper);rect(7,13,2,1,ink);
  if(kind==='dots')for(const x of [4,8,12])rect(x,5,2,2,ink);
  if(kind==='heart'){
    const red=[225,103,87,255];rect(4,3,4,4,red);rect(10,3,4,4,red);rect(6,4,6,4,red);rect(7,8,4,1,red);rect(8,9,2,1,red);
  }
  if(kind==='spark'){
    const gold=[203,149,62,255];rect(8,2,2,8,gold);rect(5,5,8,2,gold);rect(7,4,4,4,gold);rect(8,5,2,2,[255,216,116,255]);
  }
  return fitArtPixels(pixels);
}
export function getBubbleLayout(width:number,height:number,x:number,y:number) {
  const w=Math.max(1,width),h=Math.max(1,height),scale=Math.min(1,w/BUBBLE_WIDTH,h/BUBBLE_HEIGHT);
  const half=BUBBLE_WIDTH*scale/2;
  return {x:Math.max(half,Math.min(w-half,Math.round(x*w))),y:Math.max(BUBBLE_HEIGHT*scale,Math.min(h,Math.round(y*h-30))),scale};
}
