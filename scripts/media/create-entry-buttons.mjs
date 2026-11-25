// Repository-native image buttons: current pixel artwork with editable localized labels.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {visitorPixels} from '../../src/characters.ts';

const dir='docs/assets/entry';
await mkdir(dir,{recursive:true});
await mkdir('public/media',{recursive:true});
const tree=`data:image/png;base64,${(await readFile('src/assets/cozy/tree-summer.png')).toString('base64')}`;
const xml=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const labels={
  ko:['마을 구경하기','계절을 바꾸며 작은 마을을 체험해 보세요.'],
  en:['Explore the village','Change the season and meet your pixel neighbors.'],
  ja:['村を見に行く','季節を変えて、小さな村を体験しましょう。'],
  'zh-CN':['逛逛小村庄','切换季节，看看像素村庄里的生活。'],
};
function character(style,x,y){
  const pixels=visitorPixels(style,'front',0);let shapes='';
  for(let row=0;row<28;row++)for(let col=0;col<20;col++){
    const i=(row*20+col)*4;if(!pixels[i+3])continue;
    shapes+=`<rect x="${col}" y="${row}" width="1" height="1" fill="rgb(${pixels[i]},${pixels[i+1]},${pixels[i+2]})" opacity="${pixels[i+3]/255}"/>`;
  }
  return `<g transform="translate(${x} ${y}) scale(3)" shape-rendering="crispEdges">${shapes}</g>`;
}
for(const [locale,[title,subtitle]] of Object.entries(labels)){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="240" viewBox="0 0 1000 240" role="img" aria-labelledby="title desc" lang="${locale}">
<title id="title">${xml(title)}</title><desc id="desc">${xml(subtitle)}</desc>
<path d="M12 0H988V12H1000V228H988V240H12V228H0V12H12Z" fill="#0e3032"/>
<path d="M16 8H984V16H992V224H984V232H16V224H8V16H16Z" fill="none" stroke="#acc68c" stroke-width="3"/>
<path d="M24 20H298V220H24Z" fill="#194b48"/>
<path d="M24 159H298V220H24Z" fill="#6b9257"/>
<path d="M67 188H255V210H67Z" fill="#e5d3a0"/>
<image href="${tree}" x="66" y="18" width="180" height="180" style="image-rendering:pixelated"/>
${character(0,43,119)}${character(6,228,119)}
<g fill="#f5e7bf"><rect x="37" y="174" width="5" height="5"/><rect x="285" y="183" width="5" height="5"/></g>
<g font-family="Arial, 'Noto Sans CJK KR', 'Apple SD Gothic Neo', 'Yu Gothic', sans-serif">
<text x="334" y="55" font-size="15" font-weight="700" letter-spacing="2" fill="#b9ce9e">PIXEL VISITOR VILLAGE</text>
<text x="330" y="119" font-size="56" font-weight="700" fill="#fff0c9">${xml(title)}</text>
<text x="334" y="161" font-size="21" fill="#cfdbc7">${xml(subtitle)}</text>
</g>
<path d="M924 94H936V106H948V118H960V130H948V142H936V154H924V140H938V130H902V118H938V108H924Z" fill="#fff0c9"/>
<path d="M334 190H869" stroke="#527365" stroke-width="2"/>
</svg>`;
  await writeFile(`${dir}/visit-village-${locale}.svg`,svg);
  await writeFile(`public/media/visit-village-${locale}.svg`,svg);
}
console.log('Created four self-contained localized village image buttons.');
