graph TD
Start([방문]) --> Home[홈 페이지]

    Home --> HotSale[HOT SALE 섹션]
    HotSale --> CategoryTabs[카테고리 탭]
    HotSale --> FeaturedCarousel[추천 상품 캐러셀]

    CategoryTabs --> ProductsPage[상품 목록 페이지]
    FeaturedCarousel --> ProductsPage

    Home --> ShortcutLinks[바로가기 메뉴]
    ShortcutLinks --> ProductsPage
    ShortcutLinks --> MyPage[마이페이지]

    ProductsPage --> FilterPanel[필터 & 정렬 패널]
    FilterPanel --> ProductGrid[상품 카드 리스트]
    ProductGrid --> ProductCard[ProductCard 컴포넌트]

    ProductCard --> ProductDetail[상품 상세 페이지]
    ProductDetail --> Gallery[상세 이미지/정보]
    ProductDetail --> CtaSection[CTA & 장바구니 버튼]

    CtaSection --> Cart[장바구니]
    Cart --> Order[주문/결제 정보]
    Order --> ManualPay[입금 안내 페이지]
    ManualPay --> Success{입금 확인?}
    Success -->|Yes| Complete[주문 확정]
    Success -->|No| Order

    MyPage --> OrderList[주문 내역]
    Complete --> MyPage

    style Start fill:#e1f5e1
    style ProductCard fill:#e8f4ff
    style ProductDetail fill:#fcefe7
    style ManualPay fill:#e1f0ff
