-- Unsplash 기반 카테고리 대표 이미지를 매핑합니다.
-- 모든 URL은 Unsplash MCP에서 수집한 것으로, 추후 자사 버킷 업로드로 교체 가능합니다.

-- 자유여행 (다낭, 도쿄 등)
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxWaWV0bmFtJTIwYmVhY2glMjB0cmF2ZWx8ZW58MHwwfHx8MTc2MjAwODMzNHww&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxWaWV0bmFtJTIwYmVhY2glMjB0cmF2ZWx8ZW58MHwwfHx8MTc2MjAwODMzNHww&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxWaWV0bmFtJTIwYmVhY2glMjB0cmF2ZWx8ZW58MHwwfHx8MTc2MjAwODMzNHww&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_free';

-- 국내여행 (제주, 속초 등)
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1750851606309-3aca404b1a57?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxKZWp1JTIwaXNsYW5kJTIwdHJhdmVsfGVufDB8MHx8fDE3NjIwMDgzMzl8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1750851606309-3aca404b1a57?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxKZWp1JTIwaXNsYW5kJTIwdHJhdmVsfGVufDB8MHx8fDE3NjIwMDgzMzl8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1750851606309-3aca404b1a57?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxKZWp1JTIwaXNsYW5kJTIwdHJhdmVsfGVufDB8MHx8fDE3NjIwMDgzMzl8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_domestic';

-- 패키지여행 (유럽 핵심 등)
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1759169306210-fd76290f7519?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxFdXJvcGVhbiUyMHRvdXIlMjBncm91cCUyMHRyYXZlbHxlbnwwfDB8fHwxNzYyMDA4MzQzfDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1759169306210-fd76290f7519?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxFdXJvcGVhbiUyMHRvdXIlMjBncm91cCUyMHRyYXZlbHxlbnwwfDB8fHwxNzYyMDA4MzQzfDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1759169306210-fd76290f7519?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxFdXJvcGVhbiUyMHRvdXIlMjBncm91cCUyMHRyYXZlbHxlbnwwfDB8fHwxNzYyMDA4MzQzfDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_package';

-- 가족여행
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1552249352-02a0817a2d95?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGJlYWNofGVufDB8MHx8fDE3NjIwMDgzNTB8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1552249352-02a0817a2d95?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGJlYWNofGVufDB8MHx8fDE3NjIwMDgzNTB8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1552249352-02a0817a2d95?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGJlYWNofGVufDB8MHx8fDE3NjIwMDgzNTB8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_family';

-- 테마여행 (오로라 크루즈 등)
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1684037828758-a6abda5102fa?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBjcnVpc2UlMjB0cmF2ZWx8ZW58MHwwfHx8MTc2MjAwODM1Nnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1684037828758-a6abda5102fa?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBjcnVpc2UlMjB0cmF2ZWx8ZW58MHwwfHx8MTc2MjAwODM1Nnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1684037828758-a6abda5102fa?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBjcnVpc2UlMjB0cmF2ZWx8ZW58MHwwfHx8MTc2MjAwODM1Nnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_theme';

-- 허니문
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1761069449669-1b17dc39831b?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxob25leW1vb24lMjByZXNvcnQlMjBiZWFjaHxlbnwwfDB8fHwxNzYyMDA4MzYxfDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1761069449669-1b17dc39831b?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxob25leW1vb24lMjByZXNvcnQlMjBiZWFjaHxlbnwwfDB8fHwxNzYyMDA4MzYxfDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1761069449669-1b17dc39831b?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxob25leW1vb24lMjByZXNvcnQlMjBiZWFjaHxlbnwwfDB8fHwxNzYyMDA4MzYxfDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_honeymoon';

-- 맞춤여행 (시드니 등)
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1703372930973-3c31a8cf6f18?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxTeWRuZXklMjBwcml2YXRlJTIwdG91cnxlbnwwfDB8fHwxNzYyMDA4Mzg0fDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1703372930973-3c31a8cf6f18?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxTeWRuZXklMjBwcml2YXRlJTIwdG91cnxlbnwwfDB8fHwxNzYyMDA4Mzg0fDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1703372930973-3c31a8cf6f18?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHxTeWRuZXklMjBwcml2YXRlJTIwdG91cnxlbnwwfDB8fHwxNzYyMDA4Mzg0fDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_custom';

-- 웰니스
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1654738763816-dc8c343b291e?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHJldHJlYXQlMjBCYWxpfGVufDB8MHx8fDE3NjIwMDgzODh8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1654738763816-dc8c343b291e?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHJldHJlYXQlMjBCYWxpfGVufDB8MHx8fDE3NjIwMDgzODh8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1654738763816-dc8c343b291e?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHJldHJlYXQlMjBCYWxpfGVufDB8MHx8fDE3NjIwMDgzODh8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_wellness';

-- 문화탐방
UPDATE public.products
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1653634371081-c49a574bfdcf?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwzfHxJc3RhbmJ1bCUyMGN1bHR1cmFsJTIwdG91cnxlbnwwfDB8fHwxNzYyMDA4Mzk0fDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1653634371081-c49a574bfdcf?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwzfHxJc3RhbmJ1bCUyMGN1bHR1cmFsJTIwdG91cnxlbnwwfDB8fHwxNzYyMDA4Mzk0fDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1653634371081-c49a574bfdcf?ixid=M3w4MTYyMzB8MHwxfHNlYXJjaHwzfHxJc3RhbmJ1bCUyMGN1bHR1cmFsJTIwdG91cnxlbnwwfDB8fHwxNzYyMDA4Mzk0fDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=900&q=80'
  ]
WHERE category = 'travel_culture';

