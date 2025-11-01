## Phase 5 · 주문 데이터 조회 설계

### 1. 목표

- 마이페이지에서 로그인 사용자의 주문 목록과 상세 정보를 안정적으로 조회.
- 상태 필터, 페이지네이션, 정렬 옵션을 최소한으로 지원.

### 2. API/함수 초안

| 함수 | 설명 |
| --- | --- |
| `fetchOrdersByUser({ clerkId, status?, limit?, cursor? })` | 사용자 ID 기반 주문 목록 조회. `created_at` 역순 정렬, 기본 10건. 커서 기반 페이지네이션(`created_at`, `id`). |
| `fetchOrderDetail({ clerkId, orderId })` | 단일 주문 + 주문 상품(`order_items`) + 배송 정보 + 결제 상태 조회. 사용자가 아닌 경우 `null` 반환. |
| `countOrdersByStatus({ clerkId })` *(옵션)* | 상태별 주문 건수 집계. 필터 UI에 숫자 배지 표시 용도. |

### 3. Supabase 쿼리 설계

```sql
-- 주문 목록 기본 SELECT
SELECT id,
       total_amount,
       status,
       created_at,
       shipping_address->>'recipient' AS recipient
FROM orders
WHERE clerk_id = $1
  AND ($2::text IS NULL OR status = $2)
ORDER BY created_at DESC, id DESC
LIMIT $3;
```

- 커서 기반 페이지네이션: `created_at < cursor_created_at OR (created_at = cursor_created_at AND id < cursor_id)` 조건 추가.
- 상태 필터: `status` 컬럼과 `ProductStatus` 타입(Typescript) 연동.

### 4. 타입 정의 초안 (`types/order.ts` 보강)

```ts
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderSummary {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  recipient?: string;
}

export interface OrderWithItems extends OrderSummary {
  shippingAddress: ShippingAddress;
  orderNote?: string | null;
  items: Array<{
    productId: string | null;
    productName: string;
    quantity: number;
    price: number;
  }>;
}
```

### 5. Server Action/Route 고려사항

- 목록/상세 모두 Server Component에서 직접 호출 가능 (Clerk 인증 정보 사용).
- 필요 시 `actions/orders.ts`에 필터/페이지네이션 적용 Server Action 작성.
- 주문 취소/재결제 등의 추가 기능은 Phase 5 범위에서 제외.

### 6. 성능/보안

- Supabase `orders` 테이블에 `clerk_id`, `created_at` 복합 인덱스 존재 여부 확인. 없다면 보충 고려.
- `order_items` 조인은 단일 주문 상세에서만 사용하여 N+1 방지.
- 서비스 롤 키 불필요; Clerk 토큰 기반 서버 클라이언트 사용.


