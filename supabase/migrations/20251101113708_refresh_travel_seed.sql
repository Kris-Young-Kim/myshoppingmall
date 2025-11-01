-- 여행 상품으로 데모 데이터를 교체합니다.

-- 1) 기존 카테고리 기반 샘플 데이터 정리
DELETE FROM public.products
WHERE category IN (
  'electronics',
  'clothing',
  'books',
  'food',
  'sports',
  'beauty',
  'home'
);

-- 2) 여행 상품 샘플 데이터 삽입
INSERT INTO public.products (name, description, price, category, stock_quantity, is_active)
VALUES
  ('다낭 실속 자유여행 4박5일', '#베트남 #자유일정 #스파포함', 449000, 'travel_free', 80, true),
  ('제주 렌터카 & 풀빌라 3일', '#제주도 #렌터카포함 #노을뷰', 389000, 'travel_domestic', 95, true),
  ('도쿄 시티브레이크 3박4일', '#도시여행 #미식투어 #패스제공', 529000, 'travel_free', 120, true),
  ('방콕 골프 & 스파 4박6일', '#골프투어 #마사지무제한', 799000, 'travel_theme', 40, true),
  ('하와이 허니문 BEST 6박8일', '#허니문 #오션뷰스위트', 3150000, 'travel_honeymoon', 25, true),
  ('부산 출발 다낭 패키지 5일', '#노쇼핑 #가이드동행', 599000, 'travel_package', 70, true),
  ('서유럽 핵심 6개국 10일', '#파리 #로마 #인터라켄', 2890000, 'travel_package', 45, true),
  ('시드니·멜버른 맞춤 8일', '#호주 #프라이빗투어', 2550000, 'travel_custom', 20, true),
  ('뉴질랜드 남섬 캠퍼밴 9일', '#캠퍼밴 #자연투어', 2450000, 'travel_custom', 15, true),
  ('북유럽 오로라 크루즈 9일', '#오로라 #크루즈', 2750000, 'travel_theme', 22, true),
  ('코타키나발루 가족 리조트 4박5일', '#가족여행 #워터파크', 729000, 'travel_family', 65, true),
  ('발리 요가 & 디톡스 6일', '#웰니스 #요가리트릿', 1550000, 'travel_wellness', 30, true),
  ('규슈 온천 기차여행 4일', '#온천패스 #AR마을', 699000, 'travel_theme', 50, true),
  ('나트랑 호핑투어 5일', '#스노클링 #보트투어', 639000, 'travel_theme', 75, true),
  ('이스탄불 문화탐방 7일', '#세계문화유산 #현지미식', 1890000, 'travel_culture', 28, true),
  ('속초 미식 버스투어 2일', '#속초맛집 #어촌체험', 189000, 'travel_domestic', 120, true),
  ('강릉 커피로드 2박3일', '#커피투어 #감성숙소', 279000, 'travel_domestic', 90, true),
  ('부산 불꽃축제 스페셜 2박3일', '#불꽃축제 #요트투어', 349000, 'travel_domestic', 60, true),
  ('여수 아쿠아플라넷 & 케이블카 2일', '#가족여행 #케이블카', 259000, 'travel_family', 110, true),
  ('전주 한옥 감성투어 1박2일', '#한옥스테이 #한복체험', 199000, 'travel_culture', 130, true)
ON CONFLICT DO NOTHING;

