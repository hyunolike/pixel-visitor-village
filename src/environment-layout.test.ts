import { describe,expect,it } from 'vitest';
import { getVillageLayout } from './environment-layout';

describe('village scenery placement',()=>{
  it.each([[541,270],[317,200],[135,200],[160,30],[1,1],[0,0]])('keeps positive sized objects inside a %sx%s world',(width,height)=>{
    const w=Math.max(1,Math.round(width)),h=Math.max(1,Math.round(height));
    const objects=getVillageLayout(width,height);
    expect(objects.length).toBeGreaterThan(0);
    for(const object of objects){
      expect(object.width).toBeGreaterThan(0);expect(object.height).toBeGreaterThan(0);
      expect(object.x-object.width/2).toBeGreaterThanOrEqual(0);
      expect(object.x+object.width/2).toBeLessThanOrEqual(w);
      expect(object.y-object.height).toBeGreaterThanOrEqual(0);
      expect(object.y).toBeLessThanOrEqual(h);
      expect(Number.isInteger(object.x-object.width/2)).toBe(true);
    }
  });

  it('keeps solid scenery out of the central tree trunk',()=>{
    for(const [width,height] of [[541,270],[317,200],[135,200]])for(const object of getVillageLayout(width,height)){
      const overlap=object.x+object.width/2>width*.46&&object.x-object.width/2<width*.54&&object.y>height*.73&&object.y-object.height<height*.83;
      expect(overlap).toBe(false);
    }
  });

  it('reduces optional furniture on a narrow screen and keeps core houses',()=>{
    const mobile=getVillageLayout(135,200),desktop=getVillageLayout(541,270);
    expect(mobile.some(object=>object.kind==='cottage')).toBe(true);
    expect(mobile.some(object=>object.kind==='shop')).toBe(true);
    expect(mobile.some(object=>object.kind==='bench'||object.kind==='cabin'||object.kind==='sign')).toBe(false);
    expect(desktop.some(object=>object.kind==='bench')).toBe(true);
    expect(desktop.some(object=>object.kind==='cabin')).toBe(true);
    expect(desktop.some(object=>object.kind==='sign')).toBe(true);
  });

  it('is deterministic and places the foreground fences below walking feet',()=>{
    expect(getVillageLayout(541,270)).toEqual(getVillageLayout(541,270));
    const fences=getVillageLayout(541,270).filter(object=>object.kind==='fence');
    expect(fences).toHaveLength(2);
    for(const fence of fences)expect(fence.y).toBeGreaterThan(270*.94);
  });
});
