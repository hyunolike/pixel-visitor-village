import type { Season } from './model';
export interface Theme {name:string;description:string;sky:string;haze:string;ground:string;ground2:string;path:string;pine:string;roof:string;wall:string;leaf:string;leaf2:string;night:boolean}
/** Shared warm ramps: teal outlines, cream masonry and terracotta roofs. */
export const themes:Record<Season,Theme>={
  christmas:{name:'크리스마스 광장',description:'따뜻한 전구와 리본으로 꾸민 마을',sky:'#10383c',haze:'#245b53',ground:'#a9c8b6',ground2:'#c6d9c4',path:'#e6d9aa',pine:'#356b50',roof:'#ba6346',wall:'#f0dba8',leaf:'#397348',leaf2:'#91ac54',night:true},
  spring:{name:'꽃이 피는 봄 광장',description:'분홍 꽃과 연둣빛이 번지는 마을',sky:'#164846',haze:'#30695b',ground:'#769d60',ground2:'#93b373',path:'#e8d5a2',pine:'#376e50',roof:'#c06a46',wall:'#f3dfaf',leaf:'#dc9ba4',leaf2:'#f5c4b7',night:false},
  summer:{name:'초록이 짙어진 여름 광장',description:'둥근 과일나무 아래 모이는 마을',sky:'#103b3d',haze:'#24594e',ground:'#6b9257',ground2:'#85a76a',path:'#e5d19a',pine:'#2d674b',roof:'#bd6641',wall:'#f3dfaf',leaf:'#397348',leaf2:'#8fab53',night:false},
  autumn:{name:'단풍이 물든 가을 광장',description:'황금빛 나무와 작은 호박의 마을',sky:'#283f3b',haze:'#536b4c',ground:'#99965e',ground2:'#b0aa72',path:'#e7cea0',pine:'#637d4d',roof:'#b55c3e',wall:'#f1d9a8',leaf:'#bf7440',leaf2:'#e6ad57',night:false},
  winter:{name:'눈이 쌓인 겨울 광장',description:'크림빛 눈을 포근하게 얹은 마을',sky:'#214950',haze:'#487276',ground:'#c5d7cd',ground2:'#dee6d5',path:'#b4c8b7',pine:'#548074',roof:'#9b684f',wall:'#ead8b1',leaf:'#719489',leaf2:'#d5e1ca',night:false}
};
