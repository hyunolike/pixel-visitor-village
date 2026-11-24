# 설치 개편 설계의 builder check

- 대상: design.md의 `2026-11-24 설치 페이지 개편과 다국어 — 승인 대기 제안` 및 spec.md의 같은 날짜 설치 개편 수용 기준.
- 방식: brainstorming 스킬의 builder check 프롬프트에 따라 부모 대화를 전달하지 않은 fresh-context 에이전트 `install_design_check`에 읽기 전용으로 의뢰했다. 실제 완료 응답을 받은 뒤 기록했다.
- 질문: 구현 계획을 세우기 전에 답이 필요하고 잘못 추측하면 결과가 달라질 중요한 미정 사항이 있는가. 다국어 전환 시 상태 보존과 미리보기 동작을 포함한다.
- 실제 응답: `nothing important left`.
- 한계: 전체 EGM 단계나 코드/브라우저 검증은 수행하지 않았다. 사용자 시각 설계 승인도 아직 받지 않았다.
- 시각 보드: `docs/assets/install-redesign-proposal.png`는 Pillow로 그린 정적 UI 설계 도식이며 실제 제품 화면 캡처가 아니다. 마을 부분은 저장소 자체 에셋의 기존 캡처 `docs/assets/village-characters-v2.png`를 재사용했다. 새로운 외부 이미지/폰트를 배포 산출물로 가져오지 않았다.
