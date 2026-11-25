import { parseCount } from './model';

export type RefreshResult={count:number}|{error:string};
export type RefreshListener=(result:RefreshResult)=>void;
interface Subscription {seconds:number;active:boolean;version:number}

export function parseRefreshInterval(value:string|null):number {
  if(value===null||value==='0')return 0;
  if(!/^\d+$/.test(value)||Number(value)<60||Number(value)>3600)throw new Error('방문 수 확인 간격은 0 또는 60~3600초로 설정해 주세요.');
  return Number(value);
}

export function readVisitorCount(html:string):number {
  // Template contents are inert: parsing must not load blog images or execute analytics.
  const template=document.createElement('template');
  template.innerHTML=html;
  const nodes=[...template.content.querySelectorAll('visitor-village[count]')];
  if(!nodes.length)throw new Error('블로그 HTML에서 방문자 마을의 오늘 방문 수를 찾지 못했어요.');
  const counts=nodes.map(node=>{
    const raw=node.getAttribute('count')!;
    if(!raw.trim())throw new Error('오늘 방문 수가 비어 있어요.');
    return parseCount(raw);
  });
  if(counts.some(count=>count!==counts[0]))throw new Error('블로그의 마을마다 방문 수가 달라 자동 확인을 적용하지 못했어요.');
  return counts[0];
}

async function loadVisitorCount(signal:AbortSignal):Promise<number> {
  const response=await fetch(new URL('/',location.href),{signal,credentials:'omit',cache:'no-store',redirect:'error'});
  if(!response.ok||!response.headers.get('content-type')?.toLowerCase().includes('text/html'))throw new Error('블로그의 오늘 방문 수를 확인하지 못했어요.');
  return readVisitorCount(await response.text());
}

/** One sequential request for every visible widget in this document. */
export class SharedVisitorRefresh {
  private subscriptions=new Map<RefreshListener,Subscription>();
  private interval=0;
  private failures=0;
  private timer:ReturnType<typeof setTimeout>|undefined;
  private controller:AbortController|undefined;
  private generation=0;

  constructor(private load:(signal:AbortSignal)=>Promise<number>=loadVisitorCount) {}

  subscribe(listener:RefreshListener,seconds:number) {
    if(seconds===0){this.unsubscribe(listener);return;}
    const previous=this.subscriptions.get(listener);
    this.subscriptions.set(listener,{seconds,active:previous?.active??false,version:(previous?.version??0)+1});
    this.reconcile();
  }
  unsubscribe(listener:RefreshListener) {this.subscriptions.delete(listener);this.reconcile();}
  invalidate(listener:RefreshListener) {
    const entry=this.subscriptions.get(listener);if(entry)entry.version++;
  }
  setActive(listener:RefreshListener,active:boolean) {
    const entry=this.subscriptions.get(listener);
    if(!entry||entry.active===active)return;
    entry.active=active;entry.version++;this.reconcile();
  }
  private reconcile() {
    const active=[...this.subscriptions.values()].filter(entry=>entry.active);
    const next=active.length?Math.min(...active.map(entry=>entry.seconds)):0;
    if(next===this.interval)return;
    this.interval=next;
    clearTimeout(this.timer);this.timer=undefined;
    if(!next) {
      ++this.generation;this.controller?.abort();this.controller=undefined;
      this.failures=0;return;
    }
    if(!this.controller)this.schedule();
  }
  private schedule() {
    if(!this.interval)return;
    const base=this.interval*1000;
    const delay=Math.min(base*2**Math.min(this.failures,10),Math.max(base,900_000));
    this.timer=setTimeout(()=>{this.timer=undefined;void this.read();},delay);
  }
  private async read() {
    const generation=this.generation,controller=new AbortController();
    this.controller=controller;
    const recipients=[...this.subscriptions].filter(([,entry])=>entry.active)
      .map(([listener,entry])=>({listener,entry,version:entry.version}));
    let timedOut=false;
    const timeout=setTimeout(()=>{timedOut=true;controller.abort();},10_000);
    const aborted=new Promise<never>((_resolve,reject)=>{
      controller.signal.addEventListener('abort',()=>reject(new Error('방문 수 확인을 중단했어요.')),{once:true});
    });
    try {
      const count=parseCount(String(await Promise.race([this.load(controller.signal),aborted])));
      if(generation!==this.generation)return;
      this.failures=0;this.deliver(recipients,{count});
    } catch {
      if(generation!==this.generation)return;
      this.failures++;
      this.deliver(recipients,{error:timedOut?'방문 수 확인 시간이 초과됐어요. 잠시 후 다시 확인합니다.':'방문 수를 확인하지 못했어요. 마지막 숫자를 유지하고 잠시 후 다시 확인합니다.'});
    } finally {
      clearTimeout(timeout);
      if(generation===this.generation){this.controller=undefined;this.schedule();}
    }
  }
  private deliver(recipients:{listener:RefreshListener;entry:Subscription;version:number}[],result:RefreshResult) {
    for(const {listener,entry,version} of recipients) {
      if(this.subscriptions.get(listener)===entry&&entry.active&&entry.version===version)listener(result);
    }
  }
}

export const visitorRefresh=new SharedVisitorRefresh();
