export const hash=(n:number)=>{const value=Math.sin(n*127.1+31.7)*43758.5453;return value-Math.floor(value);};
export type PixelBrush=(x:number,y:number,width:number,height:number,color:string)=>void;

export function surface(width:number,height:number){
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(width));canvas.height=Math.max(1,Math.round(height));
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('2D 그래픽을 사용할 수 없어요.');
  ctx.imageSmoothingEnabled=false;return {canvas,ctx};
}
export function brush(ctx:CanvasRenderingContext2D):PixelBrush{
  return (x,y,width,height,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(width),Math.round(height));};
}
export function blend(color:string,toward:string,amount:number):string{
  const a=parseInt(color.slice(1),16),b=parseInt(toward.slice(1),16);
  const channel=(shift:number)=>Math.round(((a>>shift)&255)*(1-amount)+((b>>shift)&255)*amount).toString(16).padStart(2,'0');
  return '#'+channel(16)+channel(8)+channel(0);
}
/** Filled scanlines keep foliage and hills on the same integer pixel grid. */
export function ellipse(r:PixelBrush,x:number,y:number,rx:number,ry:number,color:string,step=2):void{
  for(let row=-Math.ceil(ry);row<ry;row+=step){
    const fraction=(row+step/2)/ry;
    const half=Math.max(0,Math.floor(rx*Math.sqrt(Math.max(0,1-fraction*fraction))));
    r(x-half,y+row,half*2+1,Math.min(step,ry-row),color);
  }
}
export function line(r:PixelBrush,x1:number,y1:number,x2:number,y2:number,width:number,color:string):void{
  let x=Math.round(x1),y=Math.round(y1);const endX=Math.round(x2),endY=Math.round(y2);
  const dx=Math.abs(endX-x),dy=-Math.abs(endY-y),sx=x<endX?1:-1,sy=y<endY?1:-1;
  let error=dx+dy;
  while(true){
    r(x-Math.floor(width/2),y-Math.floor(width/2),width,width,color);
    if(x===endX&&y===endY)break;
    const twice=error*2;
    if(twice>=dy){error+=dy;x+=sx;}
    if(twice<=dx){error+=dx;y+=sy;}
  }
}
