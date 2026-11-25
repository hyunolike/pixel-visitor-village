import {copyFile,mkdir,access,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const folder='brag-output/intro-refresh';
await mkdir(`${folder}/work/previous`,{recursive:true});
for(const path of ['public/media/intro.mp4','public/media/intro-poster.jpg','docs/assets/intro-preview.gif']){
  const backup=`${folder}/work/previous/${path.split('/').at(-1)}`;
  try{await access(backup);}catch{await copyFile(path,backup);}
}
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames','-show_entries','format=duration,size','-of','json',`${folder}/work/intro-final.mp4`],{encoding:'utf8'}));
const video=probe.streams.find(s=>s.codec_type==='video');
if(video.width!==1920||video.height!==1080||video.nb_frames!=='600'||video.codec_name!=='h264'||probe.format.duration!=='20.000000'||!probe.streams.some(s=>s.codec_name==='aac'))throw new Error('Unexpected delivery video');
await copyFile(`${folder}/work/intro-final.mp4`,'public/media/intro.mp4');
execFileSync('ffmpeg',['-y','-loglevel','error','-ss','2.5','-i','public/media/intro.mp4','-frames:v','1','-q:v','2','public/media/intro-poster.jpg']);
execFileSync('ffmpeg',['-y','-loglevel','error','-i','public/media/intro.mp4','-t','7','-filter_complex','[0:v]fps=12,scale=720:406:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a','-loop','0','docs/assets/intro-preview.gif']);
const files={};
for(const path of ['public/media/intro.mp4','public/media/intro-poster.jpg','docs/assets/intro-preview.gif','docs/assets/architecture/architecture-ko.png','docs/assets/architecture/architecture-en.png']){
  const content=await readFile(path);files[path]={bytes:content.length,sha256:createHash('sha256').update(content).digest('hex')};
}
await writeFile(`${folder}/work/delivery-manifest.json`,JSON.stringify({probe,files},null,2));
console.log(JSON.stringify({probe,files},null,2));
