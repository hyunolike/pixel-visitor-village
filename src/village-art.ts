import type { Season } from './model';
import { surface } from './pixel-art';
import christmas from './assets/cozy/tree-christmas.png';
import spring from './assets/cozy/tree-spring.png';
import summer from './assets/cozy/tree-summer.png';
import autumn from './assets/cozy/tree-autumn.png';
import winter from './assets/cozy/tree-winter.png';
import monument from './assets/cozy/tistory-monument.png';

export interface VillageArt {trees:Partial<Record<Season,HTMLCanvasElement>>;monument?:HTMLCanvasElement;failed:string[]}
const treeUrls:Record<Season,string>={christmas,spring,summer,autumn,winter};
const ready=new Map<string,HTMLCanvasElement>();
const pending=new Map<string,Promise<HTMLCanvasElement>>();

/** Cache completed source art, never a failed request or a caller's Pixi texture. */
function load(url:string):Promise<HTMLCanvasElement> {
  const cached=ready.get(url);if(cached)return Promise.resolve(cached);
  const request=pending.get(url);if(request)return request;
  const job=new Promise<HTMLCanvasElement>((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>{
      try{const {canvas,ctx}=surface(180,180);ctx.drawImage(image,0,0,180,180);resolve(canvas);}
      catch(error){reject(error);}
    };
    image.onerror=()=>reject(new Error('Village artwork unavailable'));
    image.src=url;
  }).then(canvas=>{ready.set(url,canvas);return canvas;}).finally(()=>pending.delete(url));
  pending.set(url,job);return job;
}

export async function loadVillageArt():Promise<VillageArt> {
  const result:VillageArt={trees:{},failed:[]};
  await Promise.all((Object.entries(treeUrls) as [Season,string][]).map(async([season,url])=>{
    try{result.trees[season]=await load(url);}catch{result.failed.push(season);}
  }));
  try{result.monument=await load(monument);}catch{result.failed.push('monument');}
  return result;
}
