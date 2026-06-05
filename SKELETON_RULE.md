# Skeleton Rules

이 문서는 API 기반 UI 로딩 상태 구현 규칙입니다.

## 1) 적용 범위
- `useQuery` / `useGet*` 결과를 렌더링하는 UI는 로딩 중 Skeleton을 표시해야 합니다.
- `useMutation`의 pending 상태는 기본적으로 Skeleton 대상이 아닙니다(버튼 비활성/텍스트 유지).

## 2) 구현 컴포넌트
- Skeleton은 반드시 `src/components/ui/Skeleton.tsx`만 사용합니다.

## 3) 치환 단위
- API 영향이 있는 **텍스트 노드 단위**로 Skeleton을 적용합니다.
- 정적 텍스트, 아이콘, 버튼 프레임, 레이아웃 컨테이너는 Skeleton으로 대체하지 않습니다.
- 전체 컴포넌트를 통째로 Skeleton으로 바꾸는 패턴은 금지합니다.

## 4) 사이즈 기준
- Height 우선순위:
  1. Figma MCP 측정 height
  2. 기존 컴포넌트의 실제 렌더 높이
  3. Tailwind 폰트 크기/line-height 기반 추정
- Width는 기본적으로 Skeleton 기본값(`w-full`)을 사용합니다.

## 5) 예외
- 차트/배지 등 텍스트 외 요소도 API 값에 직접 의존하면 부분 Skeleton 또는 placeholder 처리를 허용합니다.

## 6) 신규 컴포넌트 체크리스트
- API 결과를 출력하는 텍스트가 있는가?
- 로딩 시 해당 텍스트만 Skeleton으로 치환했는가?
- 정적 UI 요소가 Skeleton으로 바뀌지 않았는가?
- Skeleton height가 Figma MCP 또는 폰트 기준으로 맞춰졌는가?

## 7) PR 체크리스트
- [ ] 전체 컴포넌트 대체형 Skeleton이 없는가?
- [ ] API 영향 텍스트만 Skeleton 처리했는가?
- [ ] 정적 텍스트/아이콘/버튼 구조를 유지했는가?
- [ ] `Skeleton.tsx`만 사용했는가?
