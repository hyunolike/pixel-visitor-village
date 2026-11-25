import { afterEach, describe, expect, it, vi } from 'vitest';
import { getTreeLayout, getMonumentLayout, getVisitorSpriteLayout, MAX_VISITORS, parseCount, VillageModel } from './model';
import { koreanDay, noticeForCount } from './visitor-notice';
import { parseRefreshInterval, SharedVisitorRefresh } from './visitor-refresh';
import { getHolidayLayout, HolidayCameoModel } from './holiday-cameo';
import { SocialModel } from './social';
import { getBubbleLayout } from './social-art';

describe('visitor input', () => {
  it.each([[null,0],['',0],['0',0],['1',1],['37',37],[' 1,234 ',1234],['5000',5000]])('reads %s as %i', (value, count) => {
    expect(parseCount(value)).toBe(count);
  });
  it.each(['-1','NaN','Infinity','1e3','1.5','1,2','12,34','[##_count_today_##]','9007199254740992','5001',' '])('rejects %s without truncating', value => {
    expect(()=>parseCount(value)).toThrow();
  });
  it('has an explicit safety boundary',()=>expect(MAX_VISITORS).toBe(5000));
});

describe('visitor notice',()=>{
  it('announces the initial total without pretending they all just arrived',()=>{
    expect(noticeForCount(null,10,'2026-11-24')).toEqual({text:'오늘 방문 10',delta:0});
    expect(noticeForCount(null,0,'2026-11-24')).toEqual({text:'오늘 방문 0',delta:0});
  });
  it('combines an increase and ignores equal or decreasing totals',()=>{
    const previous={count:10,day:'2026-11-24'};
    expect(noticeForCount(previous,13,previous.day)).toEqual({text:'오늘 방문 13 (+3)',delta:3});
    expect(noticeForCount(previous,10,previous.day)).toBeNull();
    expect(noticeForCount(previous,4,previous.day)).toBeNull();
  });
  it('does not claim a new arrival across the Korean midnight boundary',()=>{
    expect(koreanDay(new Date('2026-11-24T14:59:59Z'))).toBe('2026-11-24');
    expect(koreanDay(new Date('2026-11-24T15:00:00Z'))).toBe('2026-11-25');
    expect(noticeForCount({count:2,day:'2026-11-24'},5,'2026-11-25')).toEqual({text:'오늘 방문 5',delta:0});
  });
});

describe('visitor refresh scheduling',()=>{
  afterEach(()=>vi.useRealTimers());
  it.each([[null,0],['0',0],['60',60],['3600',3600]])('accepts interval %s', (raw,seconds)=>{
    expect(parseRefreshInterval(raw as string|null)).toBe(seconds);
  });
  it.each(['','-1','59','1.5','NaN','3601','60x'])('rejects interval %s',raw=>{
    expect(()=>parseRefreshInterval(raw)).toThrow();
  });
  it('shares requests, waits a full minute, and only notifies visible subscribers',async()=>{
    vi.useFakeTimers();
    let reads=0;
    const values:number[]=[];
    const hidden:number[]=[];
    const refresh=new SharedVisitorRefresh(async()=>{reads++;return 13;});
    const first=(result:any)=>{if('count'in result)values.push(result.count);};
    const second=(result:any)=>{if('count'in result)hidden.push(result.count);};
    refresh.subscribe(first,60);refresh.subscribe(second,60);
    refresh.setActive(first,true);refresh.setActive(second,true);refresh.setActive(second,false);
    await vi.advanceTimersByTimeAsync(59_999);expect(reads).toBe(0);
    await vi.advanceTimersByTimeAsync(1);expect(reads).toBe(1);expect(values).toEqual([13]);expect(hidden).toEqual([]);
    refresh.unsubscribe(first);refresh.unsubscribe(second);
    await vi.advanceTimersByTimeAsync(120_000);expect(reads).toBe(1);
  });
  it('cancels requests and discards responses from a removed generation',async()=>{
    vi.useFakeTimers();
    let resolve!:(value:number)=>void;
    let signal!:AbortSignal;
    const received:number[]=[];
    const refresh=new SharedVisitorRefresh(async(s)=>{signal=s;return new Promise<number>(done=>{resolve=done;});});
    const listener=(result:any)=>{if('count'in result)received.push(result.count);};
    refresh.subscribe(listener,60);refresh.setActive(listener,true);
    await vi.advanceTimersByTimeAsync(60_000);
    refresh.unsubscribe(listener);expect(signal.aborted).toBe(true);
    resolve(99);await vi.advanceTimersByTimeAsync(0);expect(received).toEqual([]);
  });
  it('times out, backs off, and restores the configured interval after recovery',async()=>{
    vi.useFakeTimers();
    let reads=0;
    const results:any[]=[];
    const refresh=new SharedVisitorRefresh(async()=>{reads++;if(reads===1)return new Promise<number>(()=>{});return 14;});
    const listener=(result:any)=>results.push(result);
    refresh.subscribe(listener,60);refresh.setActive(listener,true);
    await vi.advanceTimersByTimeAsync(60_000);expect(reads).toBe(1);
    await vi.advanceTimersByTimeAsync(10_000);expect(results[0]).toHaveProperty('error');
    await vi.advanceTimersByTimeAsync(119_999);expect(reads).toBe(1);
    await vi.advanceTimersByTimeAsync(1);expect(reads).toBe(2);expect(results[1]).toEqual({count:14});
    await vi.advanceTimersByTimeAsync(60_000);expect(reads).toBe(3);
    refresh.unsubscribe(listener);
  });
  it('never accepts invalid counts and does not overlap requests',async()=>{
    vi.useFakeTimers();
    let reads=0;
    const results:any[]=[];
    const refresh=new SharedVisitorRefresh(async()=>{reads++;return 5001;});
    const listener=(result:any)=>results.push(result);
    refresh.subscribe(listener,60);refresh.setActive(listener,true);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(reads).toBe(1);expect(results[0]).toHaveProperty('error');
    refresh.unsubscribe(listener);
  });
  it('drops a response when a subscriber changes count or is reactivated mid-request',async()=>{
    vi.useFakeTimers();
    let resolve!:(value:number)=>void;
    const received:number[]=[];
    const refresh=new SharedVisitorRefresh(async()=>new Promise<number>(done=>{resolve=done;}));
    const changed=(result:any)=>{if('count'in result)received.push(result.count);};
    const resumed=(result:any)=>{if('count'in result)received.push(result.count);};
    refresh.subscribe(changed,60);refresh.subscribe(resumed,60);
    refresh.setActive(changed,true);refresh.setActive(resumed,true);
    await vi.advanceTimersByTimeAsync(60_000);
    refresh.invalidate(changed);refresh.setActive(resumed,false);refresh.setActive(resumed,true);
    resolve(12);await vi.advanceTimersByTimeAsync(0);expect(received).toEqual([]);
    refresh.unsubscribe(changed);refresh.unsubscribe(resumed);
  });
  it('uses the smallest active interval and resumes with a full delay',async()=>{
    vi.useFakeTimers();
    let reads=0;
    const values:number[]=[];
    const refresh=new SharedVisitorRefresh(async()=>{reads++;return reads;});
    const slow=(result:any)=>{if('count'in result)values.push(result.count);};
    const fast=()=>{};
    refresh.subscribe(slow,3600);refresh.setActive(slow,true);
    refresh.subscribe(fast,60);refresh.setActive(fast,true);
    await vi.advanceTimersByTimeAsync(60_000);expect(reads).toBe(1);expect(values).toEqual([1]);
    refresh.unsubscribe(fast);
    await vi.advanceTimersByTimeAsync(3_599_999);expect(reads).toBe(1);
    await vi.advanceTimersByTimeAsync(1);expect(reads).toBe(2);
    refresh.setActive(slow,false);await vi.advanceTimersByTimeAsync(3_600_000);expect(reads).toBe(2);
    refresh.setActive(slow,true);await vi.advanceTimersByTimeAsync(3_599_999);expect(reads).toBe(2);
    await vi.advanceTimersByTimeAsync(1);expect(reads).toBe(3);refresh.unsubscribe(slow);
  });
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

describe('decorative Christmas guests',()=>{
  const advance=(model:HolidayCameoModel,seconds:number)=>{
    for(let frame=0;frame<Math.round(seconds/.05);frame++)model.step(.05);
  };
  it('waits, shows Santa temporarily, then leaves a quiet interval before returning',()=>{
    const model=new HolidayCameoModel(()=>0);model.setEnabled(true);
    advance(model,3.9);expect(model.guest).toBeNull();
    advance(model,.2);expect(model.guest?.kind).toBe('santa');
    const first=model.guest!;
    expect(first.duration).toBe(5);expect(first.x).toBeLessThan(.4);
    advance(model,5);expect(model.guest).toBeNull();
    advance(model,19.5);expect(model.guest).toBeNull();
    advance(model,1);expect(model.guest?.kind).toBe('santa');
  });
  it('can independently choose Rudolph on the other side of the plaza',()=>{
    const model=new HolidayCameoModel(()=>.99);model.setEnabled(true);
    advance(model,7.9);expect(model.guest).toBeNull();
    advance(model,.2);expect(model.guest?.kind).toBe('rudolph');
    expect(model.guest!.x).toBeGreaterThan(.6);
    expect(model.guest!.duration).toBeGreaterThanOrEqual(5);
    expect(model.guest!.duration).toBeLessThanOrEqual(8);
    advance(model,8);expect(model.guest).toBeNull();
  });
  it('clears disabled guests and starts a fresh first delay on enabling',()=>{
    const model=new HolidayCameoModel(()=>0);
    advance(model,20);expect(model.guest).toBeNull();
    model.setEnabled(true);advance(model,4.1);expect(model.guest).not.toBeNull();
    model.setEnabled(false);expect(model.guest).toBeNull();
    advance(model,20);model.setEnabled(true);
    advance(model,3.9);expect(model.guest).toBeNull();
    advance(model,.2);expect(model.guest).not.toBeNull();
  });
  it('ignores invalid time, bounds resume jumps, and never changes real visitors',()=>{
    const people=new VillageModel();people.setCount(10);
    const before=structuredClone(people.visitors);
    const model=new HolidayCameoModel(()=>0);model.setEnabled(true);
    for(const dt of [NaN,Infinity,-1,0,9999])model.step(dt);
    expect(model.guest).toBeNull();
    advance(model,10);expect(people.visitors).toEqual(before);
  });
  it.each([[1000,420],[320,400],[135,200],[160,30],[1,1],[0,0]])('fits a guest inside a %sx%s world',(width,height)=>{
    const guest={kind:'santa' as const,x:.2,y:.84,age:1,duration:6};
    const layout=getHolidayLayout(width,height,guest),w=Math.max(1,width),h=Math.max(1,height);
    expect(layout.scale).toBeGreaterThan(0);
    expect(layout.x-16*layout.scale).toBeGreaterThanOrEqual(0);
    expect(layout.x+16*layout.scale).toBeLessThanOrEqual(w);
    expect(layout.y-36*layout.scale).toBeGreaterThanOrEqual(0);
    expect(layout.y).toBeLessThanOrEqual(h);
    expect(layout.alpha).toBe(1);
  });
  it('fades in and out without stretching the pixel art',()=>{
    const guest={kind:'rudolph' as const,x:.8,y:.84,age:0,duration:6};
    expect(getHolidayLayout(500,210,guest).alpha).toBe(0);
    expect(getHolidayLayout(500,210,{...guest,age:.15}).alpha).toBeCloseTo(.5);
    expect(getHolidayLayout(500,210,{...guest,age:5.85}).alpha).toBeCloseTo(.5);
    expect(getHolidayLayout(500,210,{...guest,age:6}).alpha).toBe(0);
  });
});

describe('automatic visitor greetings',()=>{
  const person=(id:number,x:number,y=.6)=>({id,x,y,vx:.02,vy:.01,phase:0});
  const advance=(social:SocialModel,people:ReturnType<typeof person>[],seconds:number)=>{
    for(let i=0;i<Math.round(seconds/.05);i++)social.step(people,.05);
  };
  it('freezes only participating visitors without changing count, IDs or velocity',()=>{
    const model=new VillageModel();model.setCount(3);model.setViewport(500,240);
    model.visitors.splice(0,3,person(0,.1),person(1,.16),person(2,.85));
    model.social.reconcile(model.visitors);
    for(let i=0;i<42;i++)model.step(.05);
    expect(model.social.pairs).toHaveLength(1);
    const before=model.visitors.map(p=>({...p}));
    for(let i=0;i<10;i++)model.step(.05);
    expect(model.visitors.slice(0,2)).toEqual(before.slice(0,2));
    expect(model.visitors[2].x).not.toBe(before[2].x);
    expect(model.visitors.map(p=>p.id)).toEqual([0,1,2]);
    model.setSeason('spring');expect(model.social.pairs).toHaveLength(0);
    model.setCount(0);model.setCount(3);expect(model.social.getPartner(0)).toBeUndefined();
  });
  it('preserves cooldown on reset but does not pass it to deleted and recreated IDs',()=>{
    const social=new SocialModel(()=>0),people=[person(0,.1),person(1,.16)];
    social.setViewport(500,240);advance(social,people,2.1);social.reset();
    advance(social,people,3);expect(social.pairs).toHaveLength(0);
    social.reconcile([]);social.reconcile(people);advance(social,people,.5);
    expect(social.pairs).toHaveLength(1);
  });
  it('waits for nearby candidates and gives each visitor only one partner',()=>{
    const social=new SocialModel(()=>0),people=[person(0,.1),person(1,.16),person(2,.22)];
    social.setViewport(500,240);advance(social,people,1.9);expect(social.pairs).toHaveLength(0);
    advance(social,people,.2);expect(social.pairs).toHaveLength(1);
    const pair=social.pairs[0];
    expect(social.getPartner(pair.firstId)?.partnerId).toBe(pair.secondId);
    expect(social.getPartner(pair.secondId)?.partnerId).toBe(pair.firstId);
    expect(new Set(social.pairs.flatMap(pair=>[pair.firstId,pair.secondId])).size).toBe(2);
    expect(social.pairs[0].emote).toBe('dots');
  });
  it('holds a three-second interaction then lets participants rest before another greeting',()=>{
    const social=new SocialModel(()=>0),people=[person(0,.1),person(1,.16)];
    social.setViewport(500,240);advance(social,people,2.1);
    expect(social.pairs[0].age).toBeLessThan(1.2);
    advance(social,people,1.5);expect(social.pairs[0].age).toBeGreaterThan(1.2);
    advance(social,people,1.6);expect(social.pairs).toHaveLength(0);
    expect(social.getPartner(0)).toBeUndefined();
    advance(social,people,17);expect(social.pairs).toHaveLength(0);
    advance(social,people,2);expect(social.pairs).toHaveLength(1);
  });
  it('rejects overlapping, distant, vertically separated and tree-separated candidates',()=>{
    for(const people of [
      [person(0,.1),person(1,.11)],
      [person(0,.1),person(1,.8)],
      [person(0,.1,.5),person(1,.16,.8)],
      [person(0,.44,.78),person(1,.56,.78)],
    ]){
      const social=new SocialModel(()=>0);social.setViewport(200,240);
      advance(social,people,3);expect(social.pairs).toHaveLength(0);
    }
  });
  it('caps pairs at three on desktop and one after switching to a small viewport',()=>{
    const people=[person(0,.1,.55),person(1,.16,.55),person(2,.1,.75),person(3,.16,.75),person(4,.7,.55),person(5,.76,.55),person(6,.7,.75),person(7,.76,.75)];
    const social=new SocialModel(()=>.5);social.setViewport(500,240);advance(social,people,2.1);
    expect(social.pairs).toHaveLength(3);
    const original=[...social.pairs],cancelled=original.slice(1).flatMap(pair=>[pair.firstId,pair.secondId]);
    social.setViewport(900,240);expect(social.pairs).toEqual(original);
    social.setViewport(180,240);expect(social.pairs).toHaveLength(1);
    expect(social.pairs[0]).toBe(original[0]);
    expect(new Set(social.pairs.flatMap(pair=>[pair.firstId,pair.secondId])).size).toBe(2);
    social.setViewport(500,240);advance(social,people,1);
    expect(social.pairs.flatMap(pair=>[pair.firstId,pair.secondId]).some(id=>cancelled.includes(id))).toBe(false);
  });
  it('releases removed participants, and reused visitor IDs cannot inherit an old pair',()=>{
    const social=new SocialModel(()=>0),people=[person(0,.1),person(1,.16)];
    social.setViewport(500,240);advance(social,people,2.1);
    social.reconcile([people[0]]);expect(social.pairs).toHaveLength(0);
    expect(social.getPartner(0)).toBeUndefined();expect(social.getPartner(1)).toBeUndefined();
    social.reconcile([]);social.reconcile(people);
    expect(social.getPartner(1)).toBeUndefined();
  });
  it('stops when disabled and ignores invalid or very large frame gaps',()=>{
    const social=new SocialModel(()=>0),people=[person(0,.1),person(1,.16)];
    social.setViewport(500,240);
    for(const dt of [NaN,Infinity,-1,0,99999])social.step(people,dt);
    expect(social.pairs).toHaveLength(0);
    advance(social,people,2.1);expect(social.pairs).toHaveLength(1);
    social.setEnabled(false);expect(social.pairs).toHaveLength(0);
    advance(social,people,60);expect(social.pairs).toHaveLength(0);
    social.setEnabled(true);advance(social,people,2.1);expect(social.pairs).toHaveLength(0);
    advance(social,people,17);expect(social.pairs).toHaveLength(1);
  });
  it('bounds candidate work when 5000 visitors occupy the same cell',()=>{
    let reads=0;
    const people=Array.from({length:5000},(_,id)=>({id,get x(){reads++;return .2;},y:.6,vx:0,vy:0,phase:0}));
    const social=new SocialModel(()=>0);social.setViewport(500,240);
    advance(social,people,2.1);
    expect(social.pairs).toHaveLength(0);
    expect(reads).toBeLessThan(20_000);
  });
  it.each([[500,240],[140,200],[160,30],[1,1],[0,0]])('keeps a speech bubble inside %sx%s',(width,height)=>{
    for(const x of [0,.5,1]){
      const bubble=getBubbleLayout(width,height,x,.51);
      expect(bubble.scale).toBeGreaterThan(0);
      expect(bubble.x-9*bubble.scale).toBeGreaterThanOrEqual(0);
      expect(bubble.x+9*bubble.scale).toBeLessThanOrEqual(Math.max(1,width));
      expect(bubble.y-14*bubble.scale).toBeGreaterThanOrEqual(0);
      expect(bubble.y).toBeLessThanOrEqual(Math.max(1,height));
    }
  });
});


describe('cozy village landmark placement',()=>{
  it.each([[468,238],[156,100],[128,100],[80,30],[1,1],[0,0]])('keeps the complete monument in a %sx%s world',(width,height)=>{
    const w=Math.max(1,width),h=Math.max(1,height),m=getMonumentLayout(width,height);
    expect(m.size).toBeGreaterThan(0);expect(m.x-m.size/2).toBeGreaterThanOrEqual(0);
    expect(m.x+m.size/2).toBeLessThanOrEqual(w);expect(m.base-m.size).toBeGreaterThanOrEqual(0);expect(m.base).toBeLessThanOrEqual(h);
  });
  it.each([[468,238],[156,100],[128,100]])('keeps the monument well-sized beneath the main tree at %sx%s',(width,height)=>{
    const tree=getTreeLayout(width,height),monument=getMonumentLayout(width,height);
    expect(monument.size/tree.size).toBeLessThanOrEqual(.33);
    expect(monument.size/tree.size).toBeGreaterThan(.25);
  });
  it('preserves all requested visitors without spawning or walking through the monument plinth',()=>{
    const model=new VillageModel();model.setCount(1000);
    const blocked=(p:{x:number;y:number})=>p.x>.39&&p.x<.48&&p.y>.80&&p.y<.84;
    expect(model.visitors).toHaveLength(1000);expect(model.visitors.some(blocked)).toBe(false);
    expect(model.visitors.some(p=>p.x>.34&&p.x<.39&&p.y>.76&&p.y<.84)).toBe(true);
    for(let i=0;i<200;i++)model.step(.05);
    expect(model.visitors).toHaveLength(1000);expect(model.visitors.some(blocked)).toBe(false);
  });
});


describe('complete visitor sprite display bounds',()=>{
  it.each([[128,100],[156,100],[210,100],[211,100],[80,30],[1,1],[0,0]])('keeps both atlas sizes fully visible at %sx%s',(width,height)=>{
    const w=Math.max(1,width),h=Math.max(1,height);
    for(const [sw,sh] of [[16,22],[20,28]])for(const [x,y] of [[.035,.51],[.965,.94],[0,0],[1,1]]){
      const p=getVisitorSpriteLayout(width,height,x,y,sw,sh);
      expect(p.scale).toBeGreaterThan(0);expect(p.scale).toBeLessThanOrEqual(1);
      expect(p.x-sw*p.scale/2).toBeGreaterThanOrEqual(-.000001);expect(p.x+sw*p.scale/2).toBeLessThanOrEqual(w+.000001);
      expect(p.y-sh*p.scale).toBeGreaterThanOrEqual(-.000001);expect(p.y).toBeLessThanOrEqual(h+.000001);
    }
  });
  it('keeps interior display points unchanged and pins the compact edge to eight pixels',()=>{
    expect(getVisitorSpriteLayout(128,100,.5,.8,16,22)).toEqual({x:64,y:80,scale:1});
    expect(getVisitorSpriteLayout(128,100,.035,.51,16,22)).toEqual({x:8,y:51,scale:1});
  });
});
