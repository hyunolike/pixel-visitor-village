import type { Season } from './model';
import { themes } from './themes';
import { blend,brush,ellipse,hash,line,surface,type PixelBrush } from './pixel-art';
export { hash,surface } from './pixel-art';
export { backdrop } from './environment';

function branch(r:PixelBrush,x1:number,y1:number,x2:number,y2:number,width:number,winter=false):void{
  line(r,x1,y1,x2,y2,width+2,winter?'#566764':'#654c3e');
  line(r,x1,y1,x2,y2,width,winter?'#8b9787':'#99704d');
  line(r,x1-1,y1-1,x2-1,y2-1,Math.max(1,width*.3),winter?'#b2c1ae':'#bd9163');
}

export function seasonalTree(season:Season):HTMLCanvasElement{
  const {canvas,ctx}=surface(180,180),r=brush(ctx),t=themes[season];
  ellipse(r,90,175,39,4,'#2a4a3b28',1);
  branch(r,88,168,89,112,13,season==='winter');
  branch(r,87,163,71,176,5,season==='winter');branch(r,94,164,110,176,5,season==='winter');
  r(85,139,2,28,'#654c3e');r(92,151,2,17,'#654c3e');r(87,142,2,13,'#bd9163');

  if(season==='winter'){
    // Bare boughs support individual snow cushions, with air between the branches.
    for(const b of [[89,120,86,55,8],[89,111,58,87,8],[58,87,37,61,5],[58,87,30,85,4],[37,61,19,54,3],[86,78,69,53,6],[69,53,55,26,4],[69,53,86,35,3],[89,105,119,84,8],[119,84,142,55,5],[119,84,153,82,4],[142,55,160,43,3],[119,84,115,48,5],[115,48,126,27,3],[86,62,98,27,5],[98,27,93,14,3]]){
      branch(r,b[0],b[1],b[2],b[3],b[4],true);
    }
    for(const [x,y,rx,ry] of [[22,55,12,5],[45,58,17,6],[58,27,16,6],[83,37,13,6],[95,16,12,5],[121,28,14,6],[141,55,19,7],[154,82,14,5],[112,83,19,6],[60,86,21,6],[85,65,18,6]]){
      ellipse(r,x,y+2,rx,ry,'#78989c');ellipse(r,x-1,y,rx-1,ry,'#d3e2dd');ellipse(r,x-3,y-2,rx-3,Math.max(2,ry-2),'#f0f3e7');
      r(x+rx*.55,y+ry,1,3,'#d5e5df');
    }
    ellipse(r,91,176,26,3,'#e3ede5',1);r(76,174,11,1,'#f4f6e9');
    return canvas;
  }
  if(season==='christmas'){
    // Asset-load fallback only: the normal Christmas landmark remains its PNG.
    for(let tier=0;tier<6;tier++){
      const top=22+tier*19,spread=16+tier*10;
      for(let row=0;row<17;row+=2){const half=spread*.35+row*.55;r(90-half,top+row,half*2,3,tier%2?'#35684e':'#3d7553');}
      r(90-spread*.85,top+17,spread*1.7,3,'#dce7d8');
    }
    for(let i=0;i<20;i++){const y=48+hash(i+12)*92,x=90+(hash(i+51)-.5)*(y-10)*.7;r(x,y,3,3,i%2?'#db9b48':'#bd5d55');r(x,y,1,1,'#ffe7a3');}
    r(87,8,6,13,'#e1ac4f');r(83,12,14,5,'#e1ac4f');r(88,10,4,9,'#ffe7a3');
    return canvas;
  }

  branch(r,88,137,59,105,8);branch(r,91,136,123,102,8);branch(r,89,120,81,75,7);
  const foliage=surface(180,180),leaf=brush(foliage.ctx);
  const dark=blend(t.leaf,'#4a4439',.35),outline=blend(dark,'#35443d',.3),middle=blend(t.leaf,t.leaf2,.25),light=blend(t.leaf2,'#f5dfaa',.15);
  const lobes=[[46,77,29,27],[134,75,29,26],[68,105,37,24],[113,104,37,24],[90,64,54,46],[62,47,31,28],[112,43,34,29]];
  for(const [x,y,rx,ry] of lobes)ellipse(leaf,x,y,rx,ry,outline);
  for(const [x,y,rx,ry] of lobes)ellipse(leaf,x,y-1,rx-2,ry-2,dark);
  foliage.ctx.globalCompositeOperation='source-atop';
  for(const [x,y,rx,ry] of [[45,71,22,20],[72,90,33,23],[126,76,28,21],[91,60,46,34],[62,45,25,22],[111,40,28,23]])ellipse(leaf,x,y,rx,ry,middle);
  for(const [x,y,rx,ry] of [[51,58,18,12],[71,36,20,14],[112,28,19,12],[125,61,20,12],[88,67,23,13]])ellipse(leaf,x,y,rx,ry,light);
  for(let i=0;i<64;i++){
    const x=21+hash(i+31)*139,y=17+hash(i+79)*105;
    ellipse(leaf,x,y,3+hash(i+13)*5,2+hash(i+111)*2,i%3?middle:light,1);
    if(i%4===0)leaf(x-1,y-2,3,1,blend(light,'#f7e7bb',.15));
  }
  if(season==='spring')for(let i=0;i<38;i++){
    const x=25+hash(i+391)*129,y=19+hash(i+112)*98,c=i%3?'#f8d7d6':'#fff0de';
    leaf(x-2,y,5,1,c);leaf(x,y-2,1,5,c);leaf(x,y,1,1,'#ddac80');
  }
  if(season==='summer')for(let i=0;i<9;i++){
    const x=36+hash(i+223)*112,y=46+hash(i+113)*64;
    leaf(x,y,4,3,'#af6251');leaf(x+1,y-1,3,4,'#cf8060');leaf(x+1,y,1,1,'#f6c48c');leaf(x+2,y-2,1,1,'#4c6750');
  }
  if(season==='autumn')for(let i=0;i<23;i++){
    const x=24+hash(i+223)*132,y=24+hash(i+113)*94;
    leaf(x,y,3,1,i%2?'#e5b367':'#a55e40');leaf(x+1,y-1,1,3,i%2?'#e5b367':'#a55e40');
  }
  ctx.drawImage(foliage.canvas,0,0);
  for(let i=0;i<6;i++){const x=64+hash(i+20)*52,y=173+hash(i+13)*4;r(x,y,3,1,season==='autumn'?'#d3a05c':season==='spring'?'#eac1b8':'#759358');}
  return canvas;
}

export function treeGlow(){
  const {canvas,ctx}=surface(100,100),gradient=ctx.createRadialGradient(50,50,2,50,50,50);
  gradient.addColorStop(0,'#ffd67a38');gradient.addColorStop(1,'#ffd67a00');ctx.fillStyle=gradient;ctx.fillRect(0,0,100,100);return canvas;
}
