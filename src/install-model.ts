import { SEASONS } from './model';

const installErrors = {
  empty: '티스토리 주소를 입력해 주세요.',
  invalid: '올바른 블로그 주소를 입력해 주세요. 예: myblog.tistory.com',
  unsafe: '계정 정보나 포트가 없는 http 또는 https 블로그 주소를 사용해 주세요.',
  public: '공개 티스토리 주소 또는 연결한 개인 도메인을 입력해 주세요.',
  module: '위젯 모듈의 웹 주소가 올바르지 않아요.',
  season: '올바른 계절을 선택해 주세요.',
};
export type InstallErrorCode = keyof typeof installErrors;
export class InstallError extends Error {
  constructor(public readonly code: InstallErrorCode) {
    super(installErrors[code]);
    this.name = 'InstallError';
  }
}

export function normalizeBlogUrl(raw:string):{origin:string;adminUrl:string} {
  const input=raw.trim();
  if(!input)throw new InstallError('empty');
  let url:URL;
  try {url=new URL(/^[a-z][a-z0-9+.-]*:/i.test(input)?input:`https://${input}`);}
  catch {throw new InstallError('invalid');}
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.port)throw new InstallError('unsafe');
  const host=url.hostname.toLowerCase(),labels=host.split('.');
  if(labels.length<2||labels.some(label=>!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))||/^\d+$/.test(labels.at(-1)!)||['localhost','local','internal'].includes(labels.at(-1)!))throw new InstallError('public');
  url.protocol='https:';
  return {origin:url.origin,adminUrl:`${url.origin}/manage`};
}

export function buildInstallSnippet(moduleUrl:string,season:string='christmas',refresh=false):string {
  let url:URL;
  try {url=new URL(moduleUrl);} catch {throw new InstallError('module');}
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw new InstallError('module');
  if(!(SEASONS as readonly string[]).includes(season))throw new InstallError('season');
  const source=url.href.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  return `<script type="module" src="${source}"></script>\n<visitor-village\n  count="[##_count_today_##]"\n  season="${season}"${refresh?'\n  refresh-interval="60"':''}\n  style="display: block; width: 100%; height: 420px;"\n></visitor-village>`;
}
