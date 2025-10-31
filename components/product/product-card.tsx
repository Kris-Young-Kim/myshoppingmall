import Link from "next/link";
import type { ProductSummary } from "@/types/product";
import { getProductCategoryLabel } from "@/types/product";
import { cn } from "@/lib/utils";

/**
 * @file product-card.tsx
 * @description 상품 목록과 홈 화면에서 재사용되는 카드 컴포넌트입니다.
 *
 * 시각 요소:
 * - 카테고리별 그라데이션 배경
 * - 상품명, 요약 설명, 가격 표시
 * - 기본 링크 동작(`/products/[id]`)
 */

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const gradientByCategory: Record<string, string> = {
  electronics: "from-violet-500 via-blue-500 to-sky-400",
  clothing: "from-amber-400 via-orange-500 to-rose-500",
  books: "from-emerald-400 via-lime-400 to-cyan-400",
  food: "from-orange-500 via-amber-500 to-yellow-400",
  sports: "from-blue-500 via-indigo-500 to-purple-500",
  beauty: "from-rose-400 via-pink-500 to-fuchsia-500",
  home: "from-teal-500 via-cyan-500 to-blue-400",
};

export interface ProductCardProps {
  product: ProductSummary;
  href?: string;
  className?: string;
}

export function ProductCard({
  product,
  href = `/products/${product.id}`,
  className,
}: ProductCardProps) {
  const gradientClass = gradientByCategory[product.category] ?? "from-slate-500 to-slate-700";

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-3xl bg-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      <div className="relative h-48 overflow-hidden rounded-3xl bg-gradient-to-br text-white">
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradientClass)} aria-hidden />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="text-sm font-medium uppercase tracking-wide">
            {getProductCategoryLabel(product.category)}
          </div>
          <div className="text-2xl font-semibold leading-tight line-clamp-2">
            {product.name}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            {currencyFormatter.format(product.price)}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            재고 {product.stockQuantity.toLocaleString("ko-KR")}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

