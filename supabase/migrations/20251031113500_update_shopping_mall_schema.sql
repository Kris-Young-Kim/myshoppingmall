-- ==========================================
  -- Clerk + Supabase 쇼핑몰 스키마
  -- RLS 없이 애플리케이션 레벨에서 clerk_id로 필터링
  -- 파일명: 20251030120000_create_shopping_mall_schema.sql
  -- ==========================================

  -- 1. 상품 테이블 생성
  CREATE TABLE IF NOT EXISTS public.products (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
      category TEXT,
      stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
  );

  -- 2. 장바구니 테이블 생성
  CREATE TABLE IF NOT EXISTS public.cart_items (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      clerk_id TEXT NOT NULL,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE
  CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      UNIQUE(clerk_id, product_id)
  );

  -- 3. 주문 테이블 생성
  CREATE TABLE IF NOT EXISTS public.orders (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      clerk_id TEXT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
      status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'confirmed', 'shipped',
  'delivered', 'cancelled')),
      shipping_address JSONB,
      order_note TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
  );

  -- 4. 주문 상세 테이블 생성
  CREATE TABLE IF NOT EXISTS public.order_items (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE
  RESTRICT,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
  );

  -- 5. updated_at 자동 갱신 함수 생성
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = now();
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- 6. updated_at 트리거 등록
  CREATE TRIGGER set_updated_at_products
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER set_updated_at_cart_items
      BEFORE UPDATE ON cart_items
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER set_updated_at_orders
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

  -- 7. 인덱스 생성 (성능 최적화)
  CREATE INDEX IF NOT EXISTS idx_cart_items_clerk_id ON
  cart_items(clerk_id);
  CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON
  cart_items(product_id);
  CREATE INDEX IF NOT EXISTS idx_orders_clerk_id ON orders(clerk_id);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON
  orders(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON
  order_items(order_id);
  CREATE INDEX IF NOT EXISTS idx_products_category ON
  products(category);
  CREATE INDEX IF NOT EXISTS idx_products_is_active ON
  products(is_active);

  -- 8. RLS 비활성화
  ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

  -- 9. 테이블 소유자 설정
  ALTER TABLE public.products OWNER TO postgres;
  ALTER TABLE public.cart_items OWNER TO postgres;
  ALTER TABLE public.orders OWNER TO postgres;
  ALTER TABLE public.order_items OWNER TO postgres;

  -- 10. 권한 부여
  GRANT ALL ON TABLE public.products TO anon, authenticated,
  service_role;
  GRANT ALL ON TABLE public.cart_items TO anon, authenticated,
  service_role;
  GRANT ALL ON TABLE public.orders TO anon, authenticated,
  service_role;
  GRANT ALL ON TABLE public.order_items TO anon, authenticated,
  service_role;

 -- 11. 샘플 데이터 (여행 상품 중심 20개)
 INSERT INTO products (name, description, price, category, stock_quantity) VALUES
  -- 해외 자유여행 & 허니문
  ('다낭 실속 자유여행 4박5일', '#베트남 #자유일정 #스파포함', 449000, 'travel_free', 80),
  ('제주 렌터카 & 풀빌라 3일', '#제주도 #렌터카포함 #노을뷰', 389000, 'travel_domestic', 95),
  ('도쿄 시티브레이크 3박4일', '#도시여행 #미식투어 #패스제공', 529000, 'travel_free', 120),
  ('방콕 골프 & 스파 4박6일', '#골프투어 #마사지무제한', 799000, 'travel_theme', 40),
  ('하와이 허니문 BEST 6박8일', '#허니문 #오션뷰스위트', 3150000, 'travel_honeymoon', 25),

  -- 인기 패키지 & 맞춤 일정
  ('부산 출발 다낭 패키지 5일', '#노쇼핑 #가이드동행', 599000, 'travel_package', 70),
  ('서유럽 핵심 6개국 10일', '#파리 #로마 #인터라켄', 2890000, 'travel_package', 45),
  ('시드니·멜버른 맞춤 8일', '#호주 #프라이빗투어', 2550000, 'travel_custom', 20),
  ('뉴질랜드 남섬 캠퍼밴 9일', '#캠퍼밴 #자연투어', 2450000, 'travel_custom', 15),
  ('북유럽 오로라 크루즈 9일', '#오로라 #크루즈', 2750000, 'travel_theme', 22),

  -- 가족/테마형 상품
  ('코타키나발루 가족 리조트 4박5일', '#가족여행 #워터파크', 729000, 'travel_family', 65),
  ('발리 요가 & 디톡스 6일', '#웰니스 #요가리트릿', 1550000, 'travel_wellness', 30),
  ('규슈 온천 기차여행 4일', '#온천패스 #AR마을', 699000, 'travel_theme', 50),
  ('나트랑 호핑투어 5일', '#스노클링 #보트투어', 639000, 'travel_theme', 75),
  ('이스탄불 문화탐방 7일', '#세계문화유산 #현지미식', 1890000, 'travel_culture', 28),

  -- 국내 특화 상품
  ('속초 미식 버스투어 2일', '#속초맛집 #어촌체험', 189000, 'travel_domestic', 120),
  ('강릉 커피로드 2박3일', '#커피투어 #감성숙소', 279000, 'travel_domestic', 90),
  ('부산 불꽃축제 스페셜 2박3일', '#불꽃축제 #요트투어', 349000, 'travel_domestic', 60),
  ('여수 아쿠아플라넷 & 케이블카 2일', '#가족여행 #케이블카', 259000, 'travel_family', 110),
  ('전주 한옥 감성투어 1박2일', '#한옥스테이 #한복체험', 199000, 'travel_culture', 130)
 ON CONFLICT DO NOTHING;