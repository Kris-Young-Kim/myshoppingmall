import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/types/product";
import { getProductCategoryLabel } from "@/types/product";
import { cn } from "@/lib/utils";

/**
 * @file product-card.tsx
 * @description 상품 목록과 홈 화면에서 재사용되는 카드 컴포넌트입니다.
 * 이미지가 없을 경우 그라데이션 플레이스홀더와 메시지를 노출합니다.
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
  const hasThumbnail = Boolean(product.thumbnailUrl);

  return (
    <Link
      href={href}
      className={cn(
        "group block h-full rounded-3xl bg-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-3xl p-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
          {hasThumbnail ? (
            <Image
              src={product.thumbnailUrl!}
              alt={`${product.name} 이미지`}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 320px, (min-width: 768px) 45vw, 100vw"
              priority={false}
              unoptimized
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-medium text-white/90",
                gradientClass,
              )}
            >
              상품 이미지 준비중
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {getProductCategoryLabel(product.category)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 pt-0">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
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

