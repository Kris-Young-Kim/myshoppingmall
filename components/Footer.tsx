import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

/**
 * @file Footer.tsx
 * @description FNB (Footer Navigation Bar) - 사이트 하단 네비게이션 및 정보
 */
export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* 브랜드 섹션 */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              민투어 샵
            </Link>
            <p className="text-sm text-muted-foreground">
              지금 떠나고 싶은 여행지, 민투어가 네이비 밤하늘처럼 설레게 안내해요
            </p>
          </div>

          {/* 빠른 링크 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">빠른 링크</h3>
            <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-gray-900">
                홈
              </Link>
              <Link href="/products" className="hover:text-gray-900">
                상품 목록
              </Link>
              <Link href="/cart" className="hover:text-gray-900">
                장바구니
              </Link>
              <Link href="/mypage" className="hover:text-gray-900">
                마이페이지
              </Link>
            </nav>
          </div>

          {/* 고객 지원 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">고객 지원</h3>
            <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link href="/checkout" className="hover:text-gray-900">
                주문하기
              </Link>
              <Link href="/mypage" className="hover:text-gray-900">
                주문 내역
              </Link>
            </nav>
          </div>

          {/* 연락처 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">연락처</h3>
            <div className="flex flex-col space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@mintour.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>서울특별시 강남구 테헤란로 123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 민투어. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

