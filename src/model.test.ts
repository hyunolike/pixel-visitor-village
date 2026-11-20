import { describe, expect, it } from 'vitest';
import { getTreeLayout, MAX_VISITORS, parseCount, VillageModel } from './model';

describe('visitor input', () => {
  it.each([[null,0],['',0],['0',0],['1',1],['37',37],[' 1,234 ',1234],['5000',5000]])('reads %s as %i', (value, count) => {
    expect(parseCount(value)).toBe(count);
  });
  it.each(['-1','NaN','Infinity','1e3','1.5','1,2','12,34','[##_count_today_##]','9007199254740992','5001',' '])('rejects %s without truncating', value => {
    expect(()=>parseCount(value)).toThrow();
  });
  it('has an explicit safety boundary',()=>expect(MAX_VISITORS).toBe(5000));
});

describe('village state', () => {
  it('creates exactly 0, 1 and 37 characters',()=> {
    const model=new VillageModel();
    for(const count of [0,1,37,0]) {model.setCount(count);expect(model.visitors).toHaveLength(count);}
  });
  it('preserves existing identities and positions through a count or season change',()=> {
    const model=new VillageModel();model.setCount(24);model.step(.05);
    const first=model.visitors[0], snapshot=structuredClone(model.visitors);
    model.setSeason('spring');expect(model.visitors).toEqual(snapshot);
    model.setCount(37);expect(model.visitors[0]).toBe(first);
    expect(model.visitors.slice(0,24)).toEqual(snapshot);
    model.setCount(1);expect(model.visitors[0]).toBe(first);
  });
  it('rejects invalid updates without losing the last valid village',()=> {
    const model=new VillageModel();model.setCount(37);
    for(const count of [-1,NaN,Infinity,1.5,5001]) expect(()=>model.setCount(count)).toThrow();
    expect(model.visitors).toHaveLength(37);
    expect(()=>model.setSeason('oops')).toThrow();expect(model.season).toBe('christmas');
  });
  it('keeps walking characters inside the ground and outside the trunk',()=> {
    const model=new VillageModel();model.setCount(1000);
    for(let frame=0;frame<800;frame++) model.step(.05);
    for(const p of model.visitors) {
      expect(p.x).toBeGreaterThanOrEqual(.035);expect(p.x).toBeLessThanOrEqual(.965);
      expect(p.y).toBeGreaterThanOrEqual(.51);expect(p.y).toBeLessThanOrEqual(.94);
      expect(p.x>.46&&p.x<.54&&p.y>.73&&p.y<.83).toBe(false);
    }
  });
  it('ignores invalid time and limits tab-resume jumps',()=> {
    const model=new VillageModel();model.setCount(37);
    const before=structuredClone(model.visitors);
    model.step(NaN);model.step(-2);expect(model.visitors).toEqual(before);
    model.step(9999);
    for(let i=0;i<37;i++) expect(Math.hypot(model.visitors[i].x-before[i].x,model.visitors[i].y-before[i].y)).toBeLessThan(.003);
  });
});

describe('responsive tree placement',()=> {
  it.each([[320,400],[1024,520],[0,0],[160,200]])('fits %sx%s without clipping', (width,height)=> {
    const {x,base,size}=getTreeLayout(width,height);
    expect(x).toBe(width/2);expect(size).toBeGreaterThanOrEqual(0);
    expect(base-size).toBeGreaterThanOrEqual(0);expect(base).toBeLessThanOrEqual(height);
    expect(x-size/2).toBeGreaterThanOrEqual(0);expect(x+size/2).toBeLessThanOrEqual(width);
  });
});
