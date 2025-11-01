-- 카탈로그 이미지 버킷과 상품 이미지 컬럼 확장
-- 개발 환경에서는 공개 버킷으로 운영하며, 운영 전환 시 접근 제어를 재검토합니다.

-- 1. 카탈로그 이미지용 스토리지 버킷 생성 (이미 존재하면 속성만 갱신)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'catalog-images',
  'catalog-images',
  true, -- 카탈로그 이미지는 공개로 제공
  10485760, -- 10MB 제한
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. products 테이블에 썸네일 및 갤러리 컬럼 추가
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images TEXT[];


