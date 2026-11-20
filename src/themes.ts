import type { Season } from './model';
export interface Theme {name:string;description:string;sky:string;haze:string;ground:string;ground2:string;path:string;pine:string;roof:string;wall:string;leaf:string;leaf2:string;night:boolean}
export const themes:Record<Season,Theme>={
  christmas:{name:'크리스마스 광장',description:'황금 별, 따뜻한 전구와 빨간 리본',sky:'#18313c',haze:'#294d53',ground:'#b3cdca',ground2:'#c5dad5',path:'#dfdfc4',pine:'#335f59',roof:'#944946',wall:'#dac6a1',leaf:'#34634b',leaf2:'#477c56',night:true},
  spring:{name:'꽃이 피는 봄 광장',description:'분홍 꽃잎이 흩날리는 봄의 나무',sky:'#d4e8dc',haze:'#a9ccc0',ground:'#9fc18d',ground2:'#b0cc9b',path:'#e2d9b4',pine:'#64917d',roof:'#a66f67',wall:'#f1dfbd',leaf:'#dc8f9e',leaf2:'#f4bdc4',night:false},
  summer:{name:'초록이 짙어진 여름 광장',description:'초록 잎이 무성한 여름의 나무',sky:'#b7d9dc',haze:'#87b8b2',ground:'#73a87a',ground2:'#87b687',path:'#d5cfa7',pine:'#427d64',roof:'#a56851',wall:'#ead5ad',leaf:'#2f7b55',leaf2:'#55a367',night:false},
  autumn:{name:'단풍이 물든 가을 광장',description:'황금빛 낙엽이 내려앉는 가을의 나무',sky:'#e2d9c0',haze:'#b6b499',ground:'#b2ad7c',ground2:'#c2b78b',path:'#e2c59b',pine:'#7b8768',roof:'#945648',wall:'#e7d0a4',leaf:'#b8663b',leaf2:'#df9c49',night:false},
  winter:{name:'눈이 쌓인 겨울 광장',description:'가지에 눈꽃이 내려앉은 겨울의 나무',sky:'#b3cbd5',haze:'#88acb9',ground:'#d1e0de',ground2:'#dfe9e4',path:'#b8cbc7',pine:'#688b8d',roof:'#626f7d',wall:'#d8cdb8',leaf:'#6c9290',leaf2:'#bbd3ce',night:false}
};
