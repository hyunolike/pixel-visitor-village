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
  const ink='#263e38',bark='#9b6a3d',barkLight='#d09b59';
  ellipse(r,90,174,33,4,'#274b3528',1);
  branch(r,90,168,88,103,14);branch(r,88,130,54,94,7);branch(r,92,126,128,86,7);
  r(84,123,4,43,barkLight);r(94,142,3,26,'#76512f');
  if(season==='winter'){
    for(const [x1,y1,x2,y2,w] of [[88,108,78,33,6],[80,69,52,44,5],[54,46,29,36,3],[91,118,132,62,6],[130,65,153,50,3],[87,119,39,93,5],[42,94,22,78,3],[104,99,144,102,5]])branch(r,x1,y1,x2,y2,w,true);
    for(const [x,y,rx,ry] of [[29,34,17,7],[62,45,21,9],[81,30,20,8],[142,49,23,9],[34,78,20,8],[58,95,22,7],[134,101,26,9]]){
      ellipse(r,x,y+2,rx,ry,ink,2);ellipse(r,x,y,rx-2,ry-1,'#91afa1',2);ellipse(r,x-2,y-2,rx-3,ry-2,'#f5e8c9',2);
    }
    return canvas;
  }
  if(season==='christmas'){
    for(let y=28;y<143;y+=2){const tier=Math.floor((y-28)/29),half=9+tier*11+(y-28-tier*29)*.6;r(90-half,y,half*2+1,3,ink);r(93-half,y,half*2-5,2,y%6?'#39734b':'#5f914e');}
    for(const [x,y] of [[73,61],[111,94],[58,121],[126,131]]){r(x-3,y-3,7,7,ink);r(x-2,y-2,5,5,'#e5b65a');r(x-1,y-2,2,2,'#fff0bf');}
    for(const [x,y] of [[90,76],[103,123]]){r(x-6,y-2,5,5,'#d76e54');r(x+1,y-2,5,5,'#d76e54');r(x-1,y-1,3,4,'#a4493b');}
    r(87,12,6,18,ink);r(82,18,16,6,ink);r(88,14,4,14,'#efbf61');r(84,19,12,4,'#efbf61');r(89,16,2,8,'#fff0bf');
    for(const [x,y,c] of [[65,155,'#ca6049'],[110,157,'#5b8757']] as const){r(x-9,y-1,18,15,ink);r(x-8,y,16,13,c);r(x-1,y,3,13,'#f3dfae');r(x-8,y+3,16,2,'#f3dfae');}
    return canvas;
  }
  const dark=blend(t.leaf,ink,.32),light=blend(t.leaf2,'#f5dfad',.12);
  const masses=[[48,83,31,25],[127,89,33,26],[80,100,43,28],[93,60,52,36],[65,43,30,26],[118,40,29,22]];
  for(const [x,y,rx,ry] of masses)ellipse(r,x,y,rx,ry,ink,3);
  for(const [x,y,rx,ry] of masses){ellipse(r,x,y-1,rx-2,ry-3,dark,3);ellipse(r,x-3,y-5,rx-3,ry-5,t.leaf,3);ellipse(r,x-8,y-11,rx*.6,ry*.45,light,3);}
  for(const [x,y] of [[55,72],[112,48],[130,92]]){
    if(season==='summer'){r(x-3,y-2,6,6,'#d96649');r(x-2,y-2,2,2,'#f4c48b');}
    else if(season==='spring'){r(x-4,y,9,3,'#f9dfc3');r(x-1,y-3,3,9,'#f9dfc3');}
    else{r(x-2,y,6,2,'#eac16f');r(x,y-2,2,6,'#eac16f');}
  }
  return canvas;
}

export function treeGlow(){
  const {canvas,ctx}=surface(100,100),r=brush(ctx);
  ellipse(r,50,50,45,38,'#ffe3a00a',2);ellipse(r,50,50,34,29,'#ffe3a00c',2);ellipse(r,50,50,22,19,'#ffe3a012',2);return canvas;
}


/** Recovery silhouette for the independently loaded Tistory landmark. */
export function monumentArt():HTMLCanvasElement {
  const {canvas,ctx}=surface(180,180),r=brush(ctx);
  ellipse(r,90,157,57,14,'#263e38',2);ellipse(r,90,154,54,12,'#83937e',2);
  r(35,153,110,13,'#71816e');r(38,156,104,3,'#b7b99c');
  for(const x of [47,74,106,132])r(x,155,2,13,'#425e51');
  ellipse(r,90,144,57,10,'#a5ad91',2);ellipse(r,90,141,52,7,'#d7d0a5',2);
  ellipse(r,90,77,60,66,'#263e38',2);ellipse(r,90,76,56,62,'#c64e3d',2);
  ellipse(r,88,72,53,59,'#ef6149',2);
  for(const [x,y] of [[69,60],[90,60],[111,60],[90,83],[90,106]])ellipse(r,x,y,7,7,'#fff0c9',1);
  return canvas;
}
