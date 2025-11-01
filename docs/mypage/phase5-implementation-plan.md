## Phase 5 · 구현 및 테스트 전략

### 1. 컴포넌트/페이지 구조

- `app/mypage/page.tsx`
  - Clerk 인증 확인 → 미로그인 시 `/sign-in?redirect_url=/mypage` 이동
  - Supabase 서버 클라이언트로 주문 목록/요약 데이터 fetch
  - 상태 필터 파라미터 파싱 및 `order-status-tabs`에 전달
  - 로딩/에러 상태 처리 (suspense + skeleton)

- `components/mypage/profile-card.tsx`
  - `currentUser()` 정보 요약, 최근 주문 수 표시

- `components/mypage/order-status-tabs.tsx`
  - 필터 탭, 라우터 push (`useTransition` 고려)

- `components/mypage/order-card.tsx`
  - 주문 정보 표시, CTA 링크 `/orders/[id]`

### 2. 데이터 모듈

- `lib/supabase/queries/orders.ts`
  - `fetchUserOrders(params)`
  - `fetchOrderDetailForUser(params)`
  - `countOrdersByStatus(params)` *(선택)*
  - 에러 코드 PGRST205 대응, 빈 배열 반환 로깅

### 3. 테스트 계획

- **Vitest (unit/server)**
  - `fetchUserOrders`에 대한 파라미터/쿼리 형식 테스트 (mock Supabase client)
  - 상태 필터/페이지네이션 조건 로직 검증

- **Playwright (E2E)**
  - 로그인 후 마이페이지 접근 → 주문 리스트 노출 확인 (mock data)
  - 빈 상태 시 안내 메시지 확인
  - 상태 탭 전환 시 URL 및 카드 내용 업데이트

### 4. 로깅 & 모니터링

- Server Component에서 `console.group('[mypage] render')` 로 기본 로깅
- 에러 발생 시 `console.error` + 사용자 친화 메시지

### 5. 이후 단계 고려

- 주문 상세 모달 재사용 여부 평가 (Phase 5 범위: 링크 이동)
- 주문 취소/재결제 서버 액션은 후속 Phase 6 이상에서 다룰 것


