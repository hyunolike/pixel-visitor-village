import type { Season } from './model';
import { themes, type Theme } from './themes';
export const hash=(n:number)=>{const value=Math.sin(n*127.1+31.7)*43758.5453;return value-Math.floor(value);};
const palette=['#b96463','#5a8e9b','#d1aa62','#758966','#9c7da0','#9d7766'];
export function surface(width:number,height:number) {
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(width));canvas.height=Math.max(1,Math.round(height));
  const ctx=canvas.getContext('2d');if(!ctx) throw new Error('2D 그래픽을 사용할 수 없어요.');
  ctx.imageSmoothingEnabled=false;return {canvas,ctx};
}
function brush(ctx:CanvasRenderingContext2D) {return (x:number,y:number,w:number,h:number,color:string)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};}
export function visitorArt(color:number,frame:number) {
  const {canvas,ctx}=surface(13,19),r=brush(ctx),coat=palette[color%palette.length];
  r(3,17,7,2,'#45605244');r(4,4,5,4,'#d6af89');r(3,2,7,3,coat);r(4,1,5,2,coat);
  r(3,8,7,5,coat);r(2,8,2,4,coat);r(10,9,1,3,'#c6a17f');r(4,13,2,3-frame,'#49535b');r(7,13,2,2+frame,'#49535b');r(4,8,5,1,'#e1cfaa');r(8,5,1,1,'#4e463e');
  if(color%3===0) {r(9,12,4,4,'#b77d51');r(9,11,4,1,'#e5c592');}
  return canvas;
}
function house(ctx:CanvasRenderingContext2D,x:number,y:number,s:number,t:Theme,snow:boolean) {
  const r=brush(ctx),width=34*s,height=22*s;
  r(x-width/2,y-height,width,height,t.wall);r(x-width/2,y-height,width,3*s,'#7f6b5c');
  for(let i=0;i<5;i++) r(x-(12+i*2.2)*s,y-height-(16-i*3)*s,(24+i*4.4)*s,4*s,t.roof);
  if(snow) for(let i=0;i<4;i++) r(x-(13+i*2.1)*s,y-height-(17-i*3)*s,(26+i*4.2)*s,2*s,'#d3e2d9');
  r(x+10*s,y-height-17*s,5*s,12*s,'#8b7d70');r(x-5*s,y-14*s,8*s,14*s,'#6d6357');
  r(x-12*s,y-15*s,5*s,7*s,t.night?'#edcd87':'#8baca5');r(x+7*s,y-15*s,5*s,7*s,t.night?'#edcd87':'#8baca5');r(x-10*s,y+s,19*s,2*s,'#acb6a6');
}
export function backdrop(width:number,height:number,season:Season) {
  const {canvas,ctx}=surface(width,height),r=brush(ctx),t=themes[season],w=canvas.width,h=canvas.height;
  r(0,0,w,h,t.sky);
  if(t.night) {for(let i=0;i<45;i++)r(hash(i+5)*w,hash(i+22)*h*.37,1,1,i%4?'#94b8b5':'#e5d2a0');r(w*.86,h*.12,9,9,'#dce4c7');r(w*.86+4,h*.12-2,6,12,t.sky);}
  for(let i=0;i<19;i++){const bh=h*(.05+hash(i+11)*.09);r(i*w/18,h*.39-bh,w/17,bh,t.haze);}
  r(0,h*.39,w,h,t.ground);
  for(let i=0;i<90;i++)r(hash(i+222)*w,h*.4+hash(i+559)*h*.6,2+hash(i+44)*5,1,t.ground2);
  for(let i=0;i<15;i++) {
    const x=i*w/14,base=h*.43,size=16+hash(i+88)*14;r(x,base,2,5,'#655d50');
    for(let row=0;row<6;row++)r(x-row*1.5,base-size+row*3,2+row*3,4,t.pine);
    if(t.night||season==='winter')r(x-2,base-size+8,7,2,'#bdd6d0');
  }
  const cy=h*.80;
  for(let i=-8;i<=8;i++){const breadth=Math.sqrt(Math.max(0,1-i*i/81))*w*.33;r(w/2-breadth,cy+i*2,breadth*2,2,t.path);}
  r(w*.49,cy,w*.065,h-cy,t.path);
  house(ctx,w*.135,h*.62,Math.min(1.15,w/310),t,t.night||season==='winter');
  house(ctx,w*.85,h*.58,Math.min(.95,w/340),t,t.night||season==='winter');
  if(w>260)house(ctx,w*.92,h*.78,.68,t,t.night||season==='winter');
  for(const x of [w*.22,w*.78]){r(x,h*.76-23,2,24,'#495c57');r(x-3,h*.76-24,8,2,'#495c57');r(x-2,h*.76-22,6,6,t.night?'#f1d78e':'#b1bca0');r(x-3,h*.76-16,8,2,'#495c57');}
  for(const x of [w*.03,w*.74]){r(x,h*.955,w*.23,2,'#82928a');r(x,h*.97,w*.23,2,'#82928a');for(let i=0;i<7;i++)r(x+i*w*.036,h*.94,2,h*.05,'#71877b');}
  return canvas;
}
export function seasonalTree(season:Season) {
  const {canvas,ctx}=surface(180,180),r=brush(ctx),t=themes[season],x=90,base=178,size=174,top=base-size;
  r(x-6,base-size*.45,12,size*.44,'#7a5a43');r(x-12,base-3,24,4,'#7a5a43');r(x-16,base-size*.5,8,size*.23,'#7a5a43');r(x+9,base-size*.56,8,size*.25,'#7a5a43');
  for(let row=0;row<12;row++){const breadth=(.34+Math.sin(row/12*Math.PI)*.54)*size;r(x-breadth/2,top+row*size*.052,breadth,size*.08,row<8?t.leaf:t.pine);}
  for(let i=0;i<46;i++)r(x+(hash(i+183)-.5)*size*.72,top+hash(i+55)*size*.5,4+hash(i+88)*5,3+hash(i+91)*3,i%3?t.leaf2:t.leaf);
  if(season==='winter')for(let i=0;i<9;i++)r(x-size*.29+hash(i+74)*size*.5,top+size*.13+hash(i+3)*size*.34,12,3,'#e4efea');
  if(season==='spring')for(let i=0;i<17;i++)r(x+(hash(i+54)-.5)*size*.65,top+hash(i+49)*size*.5,3,3,'#ffe5d9');
  return canvas;
}
export function treeGlow() {
  const {canvas,ctx}=surface(100,100);const gradient=ctx.createRadialGradient(50,50,2,50,50,50);
  gradient.addColorStop(0,'#ffd67a38');gradient.addColorStop(1,'#ffd67a00');ctx.fillStyle=gradient;ctx.fillRect(0,0,100,100);return canvas;
}
