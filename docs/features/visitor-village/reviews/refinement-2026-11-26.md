# 서비스 정리 최종 검토 (2026-11-26)

상태: 완료, 로컬 검증 통과. 기준 커밋5bea9201da858c200b0a81b4c965e3eec49edd5a, 작업 브랜치feat/refined-village-experience. 커밋, 푸시, PR과 공개 배포는 수행하지 않았다.

## 요구사항과 실제 변경

VV-REFINE-001–007을 적용했다. 모바일 첫 화면에 설치 링크를 노출하고 티스토리용 위젯임을 설명한다. 블로그 주소는 관리자 바로가기용 선택 입력이며 비워도 같은 삽입 코드를 만들고 복사한다. 입력한 잘못된 주소는 기존대로 번역된 오류를 보여 준다. 한 번의 감성적 제목 뒤에는 설치와 조작을 설명하는 제목을 사용한다. 중복 계절 select는 제거했고 전구 옵션은 크리스마스에만 표시한다.

기존180px 나무5종과 조형물은 사용자가 명시적으로 허용한 Pillow 방식으로 마감했다. 실루엣과 파일명을 유지하고 투명도를0/255로 정리했다. 나무16~27색, 조형물11색이며6개 합계208,003→23,773bytes(88.6% 감소)다. 원본의 alpha>=128 마스크 해시는 전후 동일하다. 원본1254px 생성 이미지는 보존하고 기준180px 사본, 팔레트, 처리 도구, 해시를 별도 기록했다. 생성 도구의 여름 시안과 인구 기반 자동 팔레트 시안은 실제 검토에서 제외했으며 최종 에셋의 출처로 사용하지 않았다.

설치 CSS의 중복 테마 덮어쓰기를 병합하고 사용하지 않는 홈/브랜드 규칙을 제거했다. 변경 서비스 소스는 고정 버전 개발용 Prettier로 정리했다. 위젯 모델과 공개 API는 변경하지 않았다. 작아진 PNG가 HTML에 인라인되지 않도록 서비스 빌드의 assetsInlineLimit을0으로 설정해 기존 캐시와 이미지 네트워크 실패 계약을 보존했다. 별도 위젯 번들은 계속 자체 에셋을 포함한다.

## 독립 검토

준비 검토는 별도 새 컨텍스트에서 수행했다. 초기 Major4건은 정확한 쓰기 경계, 실행 가능한 미디어 경로/명령, 기존 테스트 이전 범위, 선택 주소의 복사/복구/경쟁 상태였다. 계획과 회귀 검사를 보완한 뒤 재검토에서 준비 완료로 확인했다.

최종 검토도 별도 새 컨텍스트에서 읽기 전용으로 수행했다. 선택 주소 검증과 관리자 링크 제거, 복사 세대 보호, 포커스, CTA의 pointer-events와 계절 전달, CSS 반응형 경계, 외부 이미지 URL, 픽셀 마스크/출처와 영상 재현 소스를 확인했다. Critical/Important/Minor 코드 결함은 발견하지 않았다. 미디어 해시와 현재 촬영 위젯 해시,8개 실제 디코딩 프레임도 재확인했다.

## 검증 근거

- 변경 전 모바일 CTA 부재와 required 주소 입력을 새 회귀 검사로 재현했다. 변경 후8개 집중 동작/언어 검사가 통과했다. CSS 통합 후 남은 기존 제목 검사는 의도한 새 제목으로 이전했다.
- pnpm test:151/151. pnpm test:release:14/14.
- pnpm format:check, pnpm build(타입/서비스/독립 위젯), git diff --check 통과.
- 최종 pnpm test:e2e:90/90,55.4초. 최종 에셋/외부 이미지 URL/MP4/GIF/포스터를 포함한 production 빌드로 순차 실행했다.
- python3 scripts/media/refine-pixel-assets.py check:6개180×180, 이진 투명도, 동일 실루엣과 팔레트 상한 통과.
- README 상단 썸네일 SHA256:b6c8955e5a9202bc585cde996905a288ea99beeb1d14fc3d4967f2ab264fd4f9. 원본과 동일하다.

## 실제 화면과 영상

[변경 전후](../../../assets/refinement/before-after.png)는 같은390×844 CSS픽셀/DPR1이다. 새 화면은 로컬 production preview5208에서 촬영했다. 홈/설치/문서의1440×1024,390×844,320×850 총9화면은 오류0, 가로 넘침0이며 공통 헤더77/65px이다. 추가320px 영어/일본어/중국어 메뉴는 헤더 바로 아래에 열리고 화면 밖으로 넘치지 않는다. JavaScript 없는 문서와 키보드, 모션 줄이기,4개 설치 언어는 브라우저 회귀 검사에 포함한다.

[실제 다섯 계절](../../../assets/refinement/scene-seasons.png)은 각1440/390px에서 실제 계절 버튼을 눌러12명 시연 상태를 촬영한 위젯 영역 크롭이다. 페이지 제목 일부가 크롭되는 이 이미지는 미술 검수 자료이며 전체 페이지 레이아웃 평가는 별도 홈 캡처를 사용한다. [에셋 전후](../../../assets/refinement/art-seasons.png)와 실제 장면을 함께 확인했다. 작은 조형물 크기와 캐릭터 인사/초대 동작은 유지했다.

[영상 장면표](../../../assets/refinement/video-contact.png)는 현재 소스로 렌더한 장면이다. 최종 MP4는20초/600프레임/1920×1080/30fps/H.264/AAC다. FFmpeg 검사에서0.1초 이상 검은 구간이 없으며0/3/6/9/12/14.5/17/19.5초를 디코딩해 실제 파일도 확인했다. 17초는 의도한 forest색 전환이 한 프레임(약0.033초) 전체를 덮는다. 이는0.10초 전환 허용 이내이며 모든 표본에 장면이 보인다고 주장하지 않는다. 첫/끝은 브랜드와 마을이 보인다. [규격/해시](refinement-media.json)와 [재현 명령](../../../../assets/concepts/refinement-20261126/README.md)을 보존한다. 보존된 brag 소스의 Codex 수정이며 새 Claude Code 실행으로 설명하지 않는다.

## 참고한 판단 근거

[토스 UX Writing](https://toss.tech/article/8-writing-principles-of-toss)의 구체적이고 목적을 설명하는 문구, [GOV.UK 버튼](https://design-system.service.gov.uk/components/button/)의 주요 행동 구분, [NN/g 점진적 공개](https://www.nngroup.com/articles/progressive-disclosure/)와 [최소한의 디자인](https://www.nngroup.com/articles/aesthetic-minimalist-design/)을 동선/옵션 정리의 참고로 사용했다. [giscus](https://giscus.app/ko)와 [utterances](https://utteranc.es/)는 입력과 삽입 코드의 실제 관계를 비교했다. [Slynyrd 팔레트 글](https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes)은 제한된 색상과 색조 역할의 참고이며 외부 에셋은 복사하지 않았다.

공개 서비스는 기존 main 배포 상태다. 이번 검증은 로컬 빌드와 Chrome 자동화이며 실제 티스토리 스킨 설치나 실기기 Safari 검증을 완료했다고 설명하지 않는다.
