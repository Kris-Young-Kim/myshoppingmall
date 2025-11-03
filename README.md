<div align="center">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.JS_15-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="next.js" />
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=000000" alt="react" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=ffffff" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=ffffff" alt="tailwind" />
    <img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=ffffff" alt="clerk" />
    <img src="https://img.shields.io/badge/-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=ffffff" alt="supabase" />
  </div>

  <h1 align="center">민투어 여행 쇼핑몰</h1>
  <h3 align="center">Next.js 15 · Clerk · Supabase · Tailwind v4</h3>

  <p align="center">
    여행 패키지 탐색과 수동 입금 결제 흐름을 지원하는 풀스택 쇼핑몰 MVP
  </p>
</div>

## 📚 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [주요 기능](#주요-기능)
3. [기술 스택](#기술-스택)
4. [빠른 시작](#빠른-시작)
5. [운영 가이드](#운영-가이드)
6. [테스트](#테스트)
7. [배포](#배포)
8. [프로젝트 구조](#프로젝트-구조)
9. [참고 문서](#참고-문서)

## 프로젝트 개요

- 여행 상품 기반 이커머스 MVP
- 다크 네이비 테마 기반으로 홈/상품/주문 전 과정 구현
- 결제는 Toss Payments를 제거하고 **수동 계좌 이체**로 단순화
- Supabase Storage(공개 버킷)와 Unsplash 이미지를 활용한 카탈로그 구성

## 주요 기능

- Clerk 인증과 Supabase 사용자 동기화 (한국어 로컬라이징)
- 홈 화면 HOT SALE, 카테고리 필터, 추천 테마 블록
- 상품 카드/상세에서 가격 표기 시 `…부터` 자동 노출
- 장바구니 추가/삭제/수량 조정 및 주문 생성 서버 액션
- 주문 신청 후 `/payments/manual`에서 계좌 이체 안내 노출
- 마이페이지에서 주문 내역과 상세 확인, 상태 필터 지원
- Playwright 기반 핵심 플로우 E2E 시나리오 (`tests/e2e/phase6/checkout.spec.ts`)

## 기술 스택

- **Next.js 15 / React 19** (App Router, Server Components 우선)
- **TypeScript** (strict)
- **Clerk** 인증 + **Supabase** (PostgreSQL, Storage)
- **Tailwind CSS v4**, **shadcn/ui**, **lucide-react**
- **React Hook Form + Zod** 폼 유효성 검증
- **pnpm** 패키지 매니저

> 개발 환경에서는 **모든 Supabase 테이블에 RLS를 비활성화**합니다.

## 빠른 시작

### 사전 준비물

- Node.js 18 이상, pnpm, Git
- Supabase 프로젝트와 Clerk 애플리케이션
- Unsplash 이미지 권장 (현재는 URL로 직접 참조)

### 환경 변수 설정

`.env` 파일에 다음 값을 채워주세요 (`.env.example` 참고).

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STORAGE_BUCKET=uploads

# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

### 의존성 설치 & 개발 서버

```bash
pnpm install
pnpm dev
```

`http://localhost:3000`에서 앱을 확인할 수 있습니다.

### 데이터베이스 마이그레이션

원격 Supabase 프로젝트에 연결한 뒤 다음 명령으로 최신 스키마를 적용합니다.

```bash
pnpm dlx supabase@latest db push
```

적용되는 주요 마이그레이션:

- `20251101140500_add_catalog_image_support.sql`: `catalog-images` 버킷, `thumbnail_url`, `gallery_images`
- `20251101141500_update_product_thumbnails.sql`: 카테고리별 Unsplash 이미지 매핑

> Docker 로컬 인스턴스를 사용하지 않는 경우에도 `supabase db push`는 원격 연결만으로 동작합니다.

## 운영 가이드

### 수동 입금 결제 플로우

1. 사용자가 `/checkout`에서 배송 정보 입력 후 **주문 신청하기** 제출
2. 서버 액션 `submitManualPaymentAction`이 주문을 `pending` 상태로 생성하고 장바구니를 비웁니다.
3. `/payments/manual?orderId=<id>`에서 입금 계좌(국민은행)와 금액 안내
4. 운영자가 입금 확인 후 Supabase `orders.status`를 `confirmed`로 수동 업데이트합니다.
5. 취소 시 `cancelled`, 상품 발송 후 `shipped` 상태로 변경하는 시나리오를 가정합니다.

### 상품 데이터 관리

- `supabase/migrations/20251101113708_refresh_travel_seed.sql`에서 여행 테마 샘플 데이터를 제공합니다.
- 추가 상품은 Supabase 콘솔 또는 SQL Editor에서 직접 입력합니다.
- 이미지 URL은 현재 Unsplash 원본을 사용하며, 향후 자체 업로드 시 `catalog-images` 버킷을 활용합니다.

### 로그 & 관측

- 핵심 서버 액션에는 `console.group`/`console.log`로 이벤트가 기록됩니다.
- Vercel 배포 후에는 Vercel Logs와 Supabase Logs로 모니터링합니다.

## 테스트

- `pnpm test` (Vitest 단위 테스트)
- `pnpm test:e2e` (Playwright, `checkout` 플로우)
- 테스트 계정 정보는 `.env.test` 등 별도 관리 후 Playwright 환경변수로 주입해주세요.

## 배포

- Vercel CLI: `vercel`, `vercel --prod`
- 필수 환경 변수는 Vercel 프로젝트 환경에 동일하게 설정합니다.
- Clerk 개발 키 경고가 발생하면 프로덕션 키로 교체하거나 Clerk 환경을 Production으로 전환합니다.

## 프로젝트 구조

```
nextjs-supabase-boilerplate-main/
├── actions/
│   ├── cart.ts
│   └── payments.ts
├── app/
│   ├── (shop)/products/           # 상품 목록 & 상세 라우트
│   ├── api/sync-user/             # Clerk → Supabase 사용자 동기화
│   ├── auth-test/                 # 인증 점검용 페이지
│   ├── cart/                      # 장바구니
│   ├── checkout/                  # 주문 정보 입력
│   ├── mypage/                    # 주문 내역/상세
│   ├── orders/[id]/               # 주문 상세 페이지
│   ├── payments/{manual,success,fail}/
│   ├── storage-test/              # 스토리지 업로드 테스트
│   ├── layout.tsx
│   ├── page.tsx                   # 홈 (다크 네이비 테마)
│   └── globals.css
├── components/
│   ├── cart/
│   ├── mypage/
│   ├── product/
│   ├── providers/
│   └── ui/                        # shadcn/ui 래퍼
├── docs/
│   ├── admin-product-guide.md
│   ├── prd.md
│   ├── TODO.md
│   ├── payments/
│   ├── reference/
│   └── mypage/
├── lib/supabase/                  # 환경별 클라이언트와 쿼리
├── supabase/migrations/
├── tests/                         # Vitest + Playwright
└── … 기타 설정 파일
```

## 참고 문서

- `docs/prd.md`: 요구사항 및 구현 현황
- `docs/TODO.md`: 단계별 작업 체크리스트
- `docs/payments/toss-payments-plan.md`: Toss → 수동 입금 전환 기록
- `docs/admin-product-guide.md`: 상품 등록 가이드
- `docs/reference/mermaid.md`: 전체 사용자 플로우 다이어그램

---

문의나 개선 아이디어가 있다면 이슈를 남겨주세요. ✈️
