---
description: 임시 MVP 성공 지표 대시보드 구성안
globs: docs/reference/mvp-dashboard.md
alwaysApply: false
---

- **Overview**
  - 민투어 여행 쇼핑몰 MVP 성과를 빠르게 파악하기 위한 임시 대시보드 설계
  - Vercel Analytics, Supabase Dashboard, Clerk Dashboard에서 제공하는 기본 지표 활용

- **Core Metrics**
  - 주문 신청 수 (Supabase `orders` 테이블 `status = 'pending'` 이상)
  - 입금 확인 완료율 (`status = 'confirmed'` / 전체 주문)
  - 장바구니 추가율 (`cart_items` 일일 고유 사용자 / 방문자)
  - 신규 회원 수 (Clerk Dashboard Recent Sign-ups)
  - 페이지 체류 시간 및 이탈률 (Vercel Web Analytics)

- **Data Sources**
  - Supabase SQL Snippets: `supabase/migrations/` 기반 스키마 참고
  - Vercel Analytics API 또는 대시보드 내 Export 기능
  - Clerk Management API (선택) 또는 대시보드 CSV 다운로드

- **Visualization (예시 도구)**
  - Google Sheets / Looker Studio로 Supabase CSV 임포트 후 시각화
  - Metabase 또는 Supabase 자체 대시보드로 간단한 차트 생성

- **Update Cadence**
  - 주 1회 데이터 추출 및 공유
  - 입금 확인 상태는 운영팀 수동 업데이트 직후 체크

- **Next Steps**
  - 자동화 필요 시 Supabase Scheduled Function 또는 Edge Function 검토
  - 향후 GA4 연동 후 사용자 행동 세션 지표 확장

