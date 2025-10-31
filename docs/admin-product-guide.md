# Supabase 상품 등록 가이드

Phase 2에서 사용하는 `products` 테이블에 새 상품을 등록할 때 참고할 수 있는 체크리스트입니다.

## 1. 테이블 접근

1. Supabase 프로젝트 대시보드 접속 → `Table editor`
2. `products` 테이블 선택
3. `Insert row` 버튼 클릭

## 2. 필드 설명

| 컬럼 | 타입 | 설명 | 예시 |
| --- | --- | --- | --- |
| `name` | `text` | 상품 이름 | `마카오 실속 금까기` |
| `description` | `text` | 리스트/상세에 노출될 요약 문장 (줄바꿈 가능) | `#가성비 #특가 ...` |
| `price` | `numeric(10,2)` | 상품 금액 (KRW 기준) | `509000` |
| `category` | `text` | `electronics`, `clothing`, `books` 등 미리 정의된 카테고리 문자열 | `travel_free` (커스텀 허용) |
| `stock_quantity` | `integer` | 남은 재고 수량 | `120` |
| `is_active` | `boolean` | 판매 노출 여부, 기본 값 `true` | `true` |
| `gallery_images` | `text[]` (선택) | 상세 페이지에서 사용할 이미지 URL 배열 | `{ "https://.../cover.png" }` |
| `highlight_tags` | `text[]` (선택) | 상세 페이지 태그 (자동 해시태그 대신 사용) | `{ "특가", "자유여행" }` |

> **TIP**: `category` 컬럼은 코드상으로 강제되지 않으므로 자유롭게 추가할 수 있지만, `types/product.ts`에서 라벨을 정의하면 프론트 화면에 한글 이름으로 표현할 수 있습니다.

## 3. 샘플 데이터

```sql
INSERT INTO products (name, description, price, category, stock_quantity, highlight_tags)
VALUES (
  '다낭 실속 금까기',
  '#전문가 추천 자유여행 패키지\n#호텔 & 스파 포함',
  449000,
  'travel_free',
  80,
  ARRAY['항공권 포함', '조식 제공', '가이드 옵션']
);
```

## 4. 상품 업데이트

- 가격/재고만 수정할 경우 `price`, `stock_quantity` 컬럼을 업데이트하면 됩니다.
- 비활성화하고 싶으면 `is_active = false`로 설정하세요. 프론트에서는 자동으로 숨겨집니다.
- 이미지 URL은 Public Storage에 업로드한 경로 또는 외부 CDN 주소를 사용할 수 있습니다.

## 5. 체크리스트

- [ ] `name`, `price`, `category`, `stock_quantity` 필수 값 입력
- [ ] `is_active` 값 확인 (판매 중이면 `true`)
- [ ] 신규 카테고리 추가 시 `types/product.ts`에서 라벨 반영
- [ ] 테스트 데이터 입력 후 프론트에서 목록/상세 페이지 확인

