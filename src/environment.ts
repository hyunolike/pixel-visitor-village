import type { Season } from './model';
import { themes,type Theme } from './themes';
import { getVillageLayout,PROP_SIZES,type PropKind,type VillageObjectLayout } from './environment-layout';
import { blend,brush,ellipse,hash,surface,type PixelBrush } from './pixel-art';

export interface VillageScenery extends VillageObjectLayout{canvas:HTMLCanvasElement}
export interface VillageScene{ground:HTMLCanvasElement;objects:VillageScenery[]}
const wood='#654d35',woodLight='#c39a60',ink='#2c4539';
const snowy=(season:Season)=>season==='christmas'||season==='winter';

function pine(r:PixelBrush,x:number,base:number,height:number,color:string,snow=false):void{
  r(x-1,base-4,2,5,'#756858');
  for(let row=0;row<7;row++){
    const spread=1+row*height*.065;
    r(x-spread,base-height+row*height*.12,spread*2+1,height*.17,color);
    if(snow&&row%2===1)r(x-spread+1,base-height+row*height*.12,spread*1.3+1,1,'#d4e4df');
  }
}
function shrub(r:PixelBrush,x:number,y:number,size:number,season:Season):void{
  const t=themes[season],dark=blend(t.pine,'#203e31',.22),light=blend(t.leaf2,'#a2b66a',.35);
  ellipse(r,x,y,size,size*.52,dark,2);ellipse(r,x-1,y-2,size-2,size*.44,t.pine,2);ellipse(r,x-size*.25,y-size*.2,size*.45,size*.2,snowy(season)?'#e5e7cb':light,2);
}
function flowers(r:PixelBrush,x:number,y:number,season:Season):void{
  if(snowy(season)){
    r(x-4,y,9,2,'#b0c8c8');r(x-3,y-1,6,2,'#ecf2e8');return;
  }
  for(let i=0;i<3;i++){
    const dx=x-4+i*4,dy=y-(i===1?2:0);
    r(dx,dy-3,1,4,'#51744f');r(dx-1,dy-1,3,1,'#709758');
    if(season==='autumn'){
      r(dx-1,dy-2,3,2,i===1?'#dfaa51':'#b87942');
    }else{
      const petal=season==='spring'?(i%2?'#f1c9cc':'#e18e9e'):(i%2?'#f3dd8d':'#dfb661');
      r(dx-1,dy-4,3,1,petal);r(dx,dy-5,1,3,petal);r(dx,dy-4,1,1,'#fff0bd');
    }
  }
}
function windowBox(r:PixelBrush,x:number,y:number,width:number,season:Season):void{
  r(x-1,y,width+2,3,wood);r(x,y,width,1,woodLight);
  for(let i=1;i<width;i+=4)flowers(r,x+i,y,season);
}
function window(r:PixelBrush,x:number,y:number,width:number,height:number,t:Theme):void{
  r(x-1,y-1,width+2,height+2,wood);r(x,y,width,height,'#e5d8b9');
  r(x+1,y+1,width-2,height-2,t.night?'#e8bf70':'#81aba9');
  r(x+2,y+2,Math.max(1,(width-4)/2),2,t.night?'#ffe1a0':'#c1d9cb');
  r(x+Math.floor(width/2),y,1,height,'#eee0bf');r(x,y+Math.floor(height/2),width,1,'#eee0bf');
  r(x-2,y+height+1,width+4,2,woodLight);
}
function house(kind:'cottage'|'shop'|'cabin',season:Season):HTMLCanvasElement{
  const [w,h]=PROP_SIZES[kind],{canvas,ctx}=surface(w,h),r=brush(ctx),t=themes[season];
  const cold=snowy(season),floor=h-9,roofBase=Math.round(h*(kind==='shop'?.39:kind==='cabin'?.46:.43)),cx=Math.floor(w/2);
  const roof=kind==='cabin'?blend(t.roof,'#466c72',.45):t.roof;
  const roofDark=blend(roof,'#3c4146',.35),roofLight=blend(roof,'#f0bd78',.33);
  ellipse(r,cx,h-3,w*.43,3,'#2c4b3b35',1);
  // Warm front, shaded side wall, stone footing and alternating wall joints.
  r(8,roofBase-1,w-16,floor-roofBase+3,ink);
  r(10,roofBase,w-20,floor-roofBase,t.wall);
  r(w-19,roofBase+2,9,floor-roofBase-2,blend(t.wall,wood,.28));
  r(11,roofBase+1,2,floor-roofBase-2,blend(t.wall,'#fff5d8',.55));
  for(let y=roofBase+7;y<floor-2;y+=7)for(let x=14+(y%2)*3;x<w-20;x+=12)r(x,y,6,1,blend(t.wall,wood,.12));
  r(8,floor-1,w-16,3,'#827869');r(10,floor,w-20,1,'#b7ae92');
  // Chimney is behind the stepped, tiled roof.
  r(w-24,3,8,roofBase-8,roofDark);r(w-23,4,5,roofBase-10,'#a38d7c');
  for(let y=6;y<roofBase-7;y+=4)r(w-23,y,5,1,'#7c6f64');
  r(w-25,2,10,3,cold?'#e5ede2':'#b7aa91');
  if(cold){r(w-22,0,3,1,'#dbe6de88');r(w-20,1,3,1,'#dbe6de66');}
  for(let y=6;y<=roofBase;y+=3){
    const half=Math.round(4+(w/2-6)*(y-6)/(roofBase-6));
    r(cx-half,y,half*2+1,4,roofDark);r(cx-half+2,y,Math.max(1,half*2-3),3,roof);
    r(cx-half+2,y,Math.max(1,half*.7),1,roofLight);
    for(let x=cx-half+7+(y%2)*4;x<cx+half-3;x+=11)r(x,y,1,3,roofDark);
    if(cold&&y%6===0)r(cx-half+1,y-1,Math.max(1,half*.75),2,'#dce8df');
  }
  r(1,roofBase+2,w-2,2,wood);r(3,roofBase+2,w-6,1,woodLight);
  if(cold){r(2,roofBase-1,w-4,3,'#dce8df');r(5,roofBase-2,w-11,1,'#f4f5e7');}
  // Little attic window and gable trim give each roof a readable centre.
  r(cx-4,roofBase-12,9,9,roofDark);r(cx-3,roofBase-11,7,6,woodLight);
  r(cx-2,roofBase-10,5,4,t.night?'#f2ce84':'#92bcb1');r(cx,roofBase-10,1,4,'#efdfb5');
  const doorX=kind==='shop'?w-29:cx-6,doorY=floor-24;
  r(doorX-1,doorY-1,14,25,wood);r(doorX,doorY,12,24,'#987750');
  r(doorX+1,doorY+1,2,22,'#bc9b66');r(doorX+3,doorY+3,6,8,t.night?'#e3b96b':'#648a86');
  r(doorX+3,doorY+7,6,1,woodLight);r(doorX+8,doorY+15,2,2,'#e4c178');
  r(doorX-3,floor+2,18,2,'#6f7469');r(doorX-2,floor+2,16,1,'#c4bea4');
  if(kind==='shop'){
    window(r,14,floor-26,18,13,t);
    const awningY=roofBase+7;
    r(10,awningY-1,w-21,8,wood);
    for(let x=11;x<w-11;x+=6){const c=((x-11)/6)%2===0?blend(roof,'#e9aaa0',.28):'#eee1bb';r(x,awningY,5,5,c);r(x+1,awningY+5,3,1,c);}
    windowBox(r,14,floor-11,18,season);
  }else{
    window(r,14,floor-26,9,10,t);
    window(r,w-32,floor-26,9,10,t);
    windowBox(r,14,floor-13,9,season);windowBox(r,w-32,floor-13,9,season);
  }
  // Doorstep pots change with the season, including little harvest pumpkins.
  for(const x of [6,w-11]){
    if(season==='autumn'){
      r(x,floor-3,7,5,'#a55d35');r(x+1,floor-4,5,6,'#df9a43');r(x+3,floor-3,1,5,'#b87d37');r(x+3,floor-6,1,2,'#697149');
    }else{
      r(x,floor-2,6,4,'#986f58');r(x-1,floor-3,8,2,'#bd9972');flowers(r,x+3,floor-3,season);
    }
  }
  if(kind!=='cabin'){shrub(r,6,floor+1,7,season);shrub(r,w-7,floor+1,7,season);}
  if(season==='christmas')for(let x=8;x<w-6;x+=7){r(x,roofBase+5,1,1,'#536b4a');r(x,roofBase+6,1,2,x%3?'#f1cd78':'#d27666');}
  return canvas;
}
function furniture(kind:Exclude<PropKind,'cottage'|'shop'|'cabin'|'fence'>,season:Season):HTMLCanvasElement{
  const [w,h]=PROP_SIZES[kind],{canvas,ctx}=surface(w,h),r=brush(ctx),t=themes[season],cold=snowy(season);
  if(kind==='lamp'){
    if(t.night){ellipse(r,9,12,8,11,'#ffe1a515');ellipse(r,9,12,6,8,'#ffe1a522');}
    ellipse(r,9,44,7,2,'#2c4b3b35',1);r(5,40,8,3,'#475b55');r(7,16,4,25,'#405751');r(8,17,1,23,'#91a694');
    r(5,6,8,11,'#405751');r(6,8,6,7,t.night||cold?'#f3d48b':'#bdcbaa');r(7,8,2,6,t.night?'#ffedba':'#e5e7c4');
    r(4,5,10,2,'#52695c');r(6,3,6,2,'#52695c');r(8,2,2,1,'#52695c');r(4,16,10,2,'#52695c');
    if(cold){r(4,4,10,1,'#e6eee5');r(7,2,4,1,'#e6eee5');}
  }else if(kind==='bench'){
    ellipse(r,19,22,17,2,'#2c4b3b32',1);r(6,9,3,13,'#465c54');r(29,9,3,13,'#465c54');
    for(const y of [5,10]){r(3,y,32,3,wood);r(4,y,30,1,woodLight);r(5,y+1,4,1,'#c4aa80');}
    r(2,16,34,4,wood);r(3,15,32,2,woodLight);r(5,19,3,3,'#465c54');r(30,19,3,3,'#465c54');
    if(cold){r(4,4,28,2,'#e7eee3');r(3,14,31,1,'#e7eee3');}
    if(season==='autumn'){r(25,14,3,1,'#d2a14d');r(26,13,1,3,'#ba7940');}
  }else{
    ellipse(r,12,28,8,2,'#2c4b3b30',1);r(10,10,4,18,wood);r(11,12,1,15,woodLight);
    r(2,3,18,11,wood);r(20,5,2,7,wood);r(22,7,1,3,wood);
    r(3,4,16,8,'#ba9668');r(4,5,14,1,'#d4b27e');
    r(7,7,4,1,'#4d7460');r(6,8,6,2,'#4d7460');r(8,10,2,2,'#4d7460');r(15,7,3,1,'#eee2ba');r(17,8,2,1,'#eee2ba');
    if(cold)r(2,2,17,2,'#e5ede2');
  }
  return canvas;
}
function fence(width:number,height:number,season:Season):HTMLCanvasElement{
  const {canvas,ctx}=surface(width,height),r=brush(ctx),t=themes[season],cold=snowy(season);
  const scale=height/18,post=Math.max(2,Math.round(3*scale)),gap=Math.max(7,Math.round(12*scale));
  const dark=t.night?'#647568':'#796b55',light=t.night?'#b2c4ad':'#c1a987';
  r(1,height-2,width-2,2,'#34574732');
  for(const y of [.38,.68]){r(1,height*y,width-2,Math.max(1,2*scale),dark);r(1,height*y,width-2,1,light);if(cold)r(1,height*y-1,width-2,1,'#dae7de');}
  for(let x=3;x<width-1;x+=gap){r(x,2,post,height-3,dark);r(x,2,1,height-5,light);r(x+1,1,Math.max(1,post-2),1,light);if(cold)r(x-1,1,post+2,1,'#edf2e8');}
  return canvas;
}

function ground(width:number,height:number,season:Season):HTMLCanvasElement{
  const {canvas,ctx}=surface(width,height),r=brush(ctx),w=canvas.width,h=canvas.height,t=themes[season];
  const cold=snowy(season),cx=w/2,cy=h*.82,rx=w*.35,ry=Math.max(4,h*.085);
  r(0,0,w,h,t.sky);
  if(t.night){
    for(let i=0;i<46;i++)r(hash(i+12)*w,hash(i+42)*h*.35,i%7===0?2:1,1,i%4?'#91b5b5':'#e5d4a6');
    ellipse(r,w*.88,h*.12,5,6,'#e7e2b4',1);ellipse(r,w*.88+3,h*.12-2,5,6,t.sky,1);
  }else{
    for(const [nx,ny] of [[.14,.14],[.78,.2]]){const c=blend(t.sky,'#fff9e6',.40);ellipse(r,w*nx,h*ny,w*.07,3,c);ellipse(r,w*nx-7,h*ny-2,w*.03,4,c);}
  }
  for(let x=0;x<w;x+=3){
    const y=h*.37-Math.sin(x/w*7+.8)*h*.025-Math.cos(x/w*12)*h*.02;
    r(x,y,3,h*.46-y,blend(t.haze,t.sky,.45));
  }
  for(let i=0;i<28;i++)pine(r,w*i/27,h*.435,8+hash(i+45)*Math.min(17,h*.07),blend(t.pine,t.haze,.62));
  r(0,h*.435,w,h,t.ground);
  for(let i=0;i<17;i++)pine(r,w*i/16,h*.49,12+hash(i+88)*Math.min(20,h*.1),blend(t.pine,t.ground,.12),cold);
  for(let i=0;i<10;i++){const x=w*(i+.5)/10;shrub(r,x,h*.515,5+hash(i+77)*4,season);}
  const nearGrass=blend(t.ground,'#3e7054',cold?.08:.20),lightGrass=blend(t.ground,'#ece5ac',.18);
  for(let y=Math.round(h*.49);y<h;y+=13)for(let x=2;x<w;x+=19){
    const seed=x*7+y*13;
    const px=x+hash(seed)*6,py=y+hash(seed+1)*5;
    if(((px-cx)/Math.max(1,rx+4))**2+((py-cy)/Math.max(1,ry+3))**2<1||(py>cy&&Math.abs(px-cx)<w*.055))continue;
    if(cold){if(hash(seed+2)>.65){r(px,py,4,1,'#e5eee6');r(px+2,py-1,2,1,'#c7d9d4');}}
    else if(hash(seed+2)>.52){r(px,py,1,3,nearGrass);r(px-2,py+2,5,1,lightGrass);r(px+2,py+1,1,2,nearGrass);}
  }
  // A transparent path mask clips staggered paving stones to plaza and entry road.
  const path=surface(w,h),p=brush(path.ctx),edge=blend(t.path,'#687463',.28);
  ellipse(p,cx,cy+1,rx+2,ry+2,'#4c66522b');ellipse(p,cx,cy,rx,ry,edge);
  p(cx-w*.046,cy,w*.092,h-cy,edge);ellipse(p,cx,cy-1,Math.max(1,rx-3),Math.max(2,ry-2),t.path);
  p(cx-w*.046+2,cy,Math.max(1,w*.092-4),h-cy,t.path);
  path.ctx.globalCompositeOperation='source-atop';
  for(let y=Math.max(0,Math.round(cy-ry-3));y<h;y+=5)for(let x=(y%2)*4-8;x<w;x+=10){
    const color=blend(t.path,hash(x+y*5)>.5?'#fff4d8':'#8c9077',.10);
    p(x,y,8,3,color);p(x+1,y,6,1,blend(color,'#fff4dd',.17));
  }
  ctx.drawImage(path.canvas,0,0);
  for(const [nx,ny] of [[.055,.88],[.12,.92],[.89,.91],[.96,.85],[.045,.70],[.96,.67]]){
    const x=w*nx,y=h*ny;
    if(!cold)ellipse(r,x,y,6,3,blend(t.ground,t.pine,.30));
    flowers(r,x,y,season);
  }
  if(season==='autumn')for(let i=0;i<26;i++){
    const x=hash(i+381)*w,y=h*.55+hash(i+41)*h*.4;
    if(Math.abs(x-cx)<w*.12&&Math.abs(y-cy)<ry)continue;
    r(x,y,2,1,i%2?'#b77b42':'#d9ac5e');r(x+1,y-1,1,2,i%2?'#d9ac5e':'#b77b42');
  }
  return canvas;
}

/** Scenery is built only on resize/theme changes; no animation or visitor data here. */
export function createVillageScene(width:number,height:number,season:Season,map=false):VillageScene{
  const terrain=ground(width,height,season);
  const objects=getVillageLayout(terrain.width,terrain.height,map).map(layout=>{
    if(layout.kind==='fence')return {...layout,canvas:fence(layout.width,layout.height,season)};
    const source=layout.kind==='cottage'||layout.kind==='shop'||layout.kind==='cabin'?house(layout.kind,season):furniture(layout.kind,season);
    const scaled=surface(layout.width,layout.height);scaled.ctx.drawImage(source,0,0,layout.width,layout.height);
    return {...layout,canvas:scaled.canvas};
  });
  return {ground:terrain,objects};
}

/** Preserve the single-canvas API for stills and older composition consumers. */
export function backdrop(width:number,height:number,season:Season):HTMLCanvasElement{
  const scene=createVillageScene(width,height,season),ctx=scene.ground.getContext('2d')!;
  for(const prop of [...scene.objects].sort((a,b)=>a.y-b.y))ctx.drawImage(prop.canvas,prop.x-prop.width/2,prop.y-prop.height);
  return scene.ground;
}
