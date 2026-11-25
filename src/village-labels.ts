import type { Season } from './model';
import { themes } from './themes';

/** Optional presentation labels. The embedded widget keeps its Korean defaults. */
export interface VillageLabels {
  region: string;
  repository: string;
  repositoryLabel: string;
  loadError: string;
  assetWarning: string;
  seasons: Record<Season, string>;
  visitors: (count: number) => string;
  guests: {santa: string; rudolph: string};
  social: (pairs:number,reacting:boolean)=>string;
  today: (count: number, delta: number) => string;
  recent: (count: number) => string;
}

export const defaultVillageLabels: VillageLabels = {
  region: '방문자 마을',
  repository: 'GitHub에서 보기 ↗',
  repositoryLabel: 'Pixel Visitor Village 저장소 보기 (새 탭)',
  loadError: '마을 그래픽을 시작하지 못했어요. WebGL을 지원하는 브라우저에서 다시 열어 주세요.',
  assetWarning: '일부 마을 그림을 불러오지 못해 기본 그림을 보여드려요.',
  seasons: {
    christmas: themes.christmas.name, spring: themes.spring.name,
    summer: themes.summer.name, autumn: themes.autumn.name, winter: themes.winter.name,
  },
  visitors: count => `방문자 ${count}명`,
  guests: {santa: '산타 (크리스마스 장식)', rudolph: '루돌프 (크리스마스 장식)'},
  social: (pairs,reacting)=>`캐릭터 ${pairs}쌍 ${reacting?'말풍선 반응':'손 인사'}`,
  today: (count, delta) => `오늘 방문 ${count.toLocaleString('ko-KR')}${delta > 0 ? ` (+${delta.toLocaleString('ko-KR')})` : ''}`,
  recent: count => `최근 확인 ${count.toLocaleString('ko-KR')}`,
};
