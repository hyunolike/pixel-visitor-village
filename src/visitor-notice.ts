export interface CountSnapshot {count:number;day:string}
export interface CountNotice {text:string;delta:number}

export function koreanDay(date:Date):string {
  return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}

export function noticeForCount(previous:CountSnapshot|null,count:number,day:string):CountNotice|null {
  const delta=previous&&previous.day===day?count-previous.count:0;
  if(previous&&previous.day===day&&delta<=0)return null;
  const total=count.toLocaleString('ko-KR');
  return {text:`오늘 방문 ${total}${delta>0?` (+${delta.toLocaleString('ko-KR')})`:''}`,delta};
}
