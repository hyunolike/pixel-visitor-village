export const PROP_SIZES={cottage:[72,80],shop:[76,76],cabin:[62,68],lamp:[18,46],bench:[38,24],sign:[24,30],fence:[100,18]} as const;
export type PropKind=keyof typeof PROP_SIZES;
export interface VillageObjectLayout{kind:PropKind;x:number;y:number;width:number;height:number;variant:number}

export function getVillageLayout(width:number,height:number,map=false):VillageObjectLayout[]{
  const w=Math.max(1,Math.round(width)),h=Math.max(1,Math.round(height));
  const scale=Math.min(1,Math.max(.62,w/520),Math.max(.5,h/260),w/160,h/100);
  const items:VillageObjectLayout[]=[];
  const place=(kind:PropKind,nx:number,ny:number,size=1,variant=0)=>{
    const [naturalWidth,naturalHeight]=PROP_SIZES[kind];
    const objectWidth=Math.max(1,Math.min(w,Math.round(kind==='fence'?w*.23:naturalWidth*scale*size)));
    const objectHeight=Math.max(1,Math.min(h,Math.round(naturalHeight*scale*size)));
    const left=Math.max(0,Math.min(w-objectWidth,Math.round(nx*w-objectWidth/2)));
    const bottom=Math.max(objectHeight,Math.min(h,Math.round(ny*h)));
    items.push({kind,x:left+objectWidth/2,y:bottom,width:objectWidth,height:objectHeight,variant});
  };
  place('cottage',map?.22:.13,map?.58:.63);
  place('shop',map?.82:.87,map?.58:.60);
  if(w>=340)place('cabin',map?.91:.925,map?.74:.81,.92);
  place('lamp',.27,.755);place('lamp',.73,.755,1,1);
  if(w>=200){place('bench',.24,.88);place('bench',.77,.865,1,1);}
  if(w>=230)place('sign',.075,.81);
  place('fence',.145,.99);place('fence',.855,.99,1,1);
  return items;
}
