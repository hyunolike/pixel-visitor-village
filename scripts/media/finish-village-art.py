"""User-authorized deterministic pixel/palette finishing. Run prepare|finish|check."""
import argparse, hashlib, io, json, subprocess
from pathlib import Path
from PIL import Image, ImageFilter, __version__ as PILLOW
ROOT = Path(__file__).resolve().parents[2]
RECORD = ROOT / 'assets/concepts/cohesive-20261126'
DIRECTION = json.loads((ROOT / 'src/art-direction.json').read_text())
SOURCES = json.loads((RECORD / 'source-manifest.json').read_text())
CACHE = ROOT / '.cache/cohesive-art-inputs'

def digest(data): return hashlib.sha256(data).hexdigest()
def palette(names): return list(dict.fromkeys(c for n in names for c in DIRECTION['ramps'][n]))
def rgb(c): return tuple(int(c[i:i+2],16) for i in (1,3,5))
def pixels(im): return list(im.get_flattened_data() if hasattr(im,'get_flattened_data') else im.getdata())
def source(path):
    item=SOURCES['files'][path]; cached=CACHE/Path(path).name
    if cached.exists(): data=cached.read_bytes()
    else:
        data=subprocess.check_output(['git','show',item['commit']+':'+path],cwd=ROOT)
        CACHE.mkdir(parents=True,exist_ok=True);cached.write_bytes(data)
    if digest(data)!=item['sha256']: raise ValueError('Baseline hash mismatch: '+path)
    return Image.open(io.BytesIO(data)).convert('RGBA')
def mask(im): return bytes(255 if p[3]>=128 else 0 for p in pixels(im))
def remap(im,hexes,binary=False,cold=False):
    colors=[rgb(c) for c in hexes]; cache={}
    nonwater=[c for c in colors if c not in [rgb(x) for x in DIRECTION['ramps']['water']]]
    def nearest(p,index):
        interior=cold and index//im.width>im.height*.48 and im.width*.06<index%im.width<im.width*.94
        key=(*p[:3],interior)
        if key not in cache:
            r,g,b=p[:3]
            cache[key]=min(nonwater if interior else colors,key=lambda c:(r-c[0])**2+(g-c[1])**2+(b-c[2])**2)
        return cache[key]
    result=Image.new('RGBA',im.size)
    result.putdata([(*nearest(p,i),255 if binary else p[3]) if p[3]>=128 or (not binary and p[3]) else (0,0,0,0) for i,p in enumerate(pixels(im))])
    return result

def prepare():
    for path in SOURCES['files']: source(path)
    print('Verified immutable baseline inputs: '+str(len(SOURCES['files'])))
def finish():
    prepare(); metrics={}
    for path in SOURCES['files']:
        original=source(path); name=Path(path).stem; terrain='landscape-' in name
        colors=palette(DIRECTION['terrainRamps'][name.removeprefix('landscape-')] if terrain else DIRECTION['objectAssetRamps'][name])
        if terrain:
            small=original.resize((768,512),Image.Resampling.NEAREST)
            season=name.removeprefix('landscape-')
            mapped=remap(small,colors,cold=season in ('winter','christmas'))
            # Source-color sky classification preserves hill silhouettes instead of clipping at a horizontal row.
            sky=small.getpixel((0,0))[:3];original_pixels=pixels(small)
            base=rgb(DIRECTION['terrainSky'][season])
            mapped.putdata([(*base,255) if i//mapped.width<mapped.height*.48 and sum((a-b)**2 for a,b in zip(original_pixels[i][:3],sky))<=36**2 else p for i,p in enumerate(pixels(mapped))])
            indexed=Image.new('P',small.size);lookup={rgb(c):i for i,c in enumerate(colors)}
            table=[channel for c in colors for channel in rgb(c)];table.extend([0]*(768-len(table)))
            indexed.putpalette(table);indexed.putdata([lookup[p[:3]] for p in pixels(mapped)])
            small=indexed.filter(ImageFilter.ModeFilter(3)).convert('RGB')
            output=small.resize((1536,1024),Image.Resampling.NEAREST)
            png=CACHE/(name+'-finished.png');output.save(png)
            subprocess.run(['cwebp','-quiet','-lossless','-exact','-z','6',str(png),'-o',str(ROOT/path)],check=True)
        else:
            output=remap(original,colors,binary=True);output.save(ROOT/path,optimize=True)
        exported=Image.open(ROOT/path).convert('RGBA')
        metrics[path]={'sourceSha256':SOURCES['files'][path]['sha256'],'sha256':digest((ROOT/path).read_bytes()),'bytesBefore':(CACHE/Path(path).name).stat().st_size,'bytesAfter':(ROOT/path).stat().st_size,'size':list(exported.size),'paletteLimit':len(colors),'colors':len({p[:3] for p in pixels(exported) if p[3]}),'maskSha256':digest(mask(exported))}
    (RECORD/'exports.json').write_text(json.dumps({'paletteSha256':digest((ROOT/'src/art-direction.json').read_bytes()),'recipeSha256':digest(Path(__file__).read_bytes()),'pillow':PILLOW,'webp':subprocess.check_output(['cwebp','-version'],text=True).strip(),'assets':metrics},indent=2)+'\n')
    check()
def check():
    record=json.loads((RECORD/'exports.json').read_text());metrics=record['assets']
    assert record['paletteSha256']==digest((ROOT/'src/art-direction.json').read_bytes()),'Palette record is stale'
    assert record['recipeSha256']==digest(Path(__file__).read_bytes()),'Recipe record is stale'
    assert set(metrics)==set(SOURCES['files']),'Incomplete export record'
    for path,item in metrics.items():
        im=Image.open(ROOT/path).convert('RGBA');before=source(path);name=Path(path).stem;terrain='landscape-' in name
        allowed={rgb(c) for c in palette(DIRECTION['terrainRamps'][name.removeprefix('landscape-')] if terrain else DIRECTION['objectAssetRamps'][name])}
        assert im.size==before.size,(path,'dimensions')
        assert not any(p[:3] not in allowed for p in pixels(im) if p[3]),(path,'palette')
        assert all(p[3] in (0,255) for p in pixels(im)),(path,'binary alpha')
        if terrain:
            assert all(p[3]==255 for p in pixels(im)),(path,'opaque')
            assert im.tobytes()==im.resize((768,512),Image.Resampling.NEAREST).resize(im.size,Image.Resampling.NEAREST).tobytes(),(path,'2x grid')
        else: assert mask(im)==mask(before),(path,'silhouette')
        assert digest((ROOT/path).read_bytes())==item['sha256'],(path,'output changed')
    print(json.dumps({'checked':len(metrics),'exactRasterSilhouettes':True,'backgroundGrid':'2x2','bytesBefore':sum(x['bytesBefore'] for x in metrics.values()),'bytesAfter':sum(x['bytesAfter'] for x in metrics.values())}))
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('stage',choices=['prepare','finish','check']);args=parser.parse_args();globals()[args.stage]()
