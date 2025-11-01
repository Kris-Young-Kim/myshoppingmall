import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";
import { getProductCategoryLabel } from "@/types/product";

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
    <article
      data-testid="product-card"
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-transparent bg-white shadow-lg transition-all duration-300 hover:border-blue-200 hover:shadow-2xl",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <Link
          href={href}
          className="relative block aspect-[4/3] overflow-hidden"
          aria-label={`${product.name} 상세보기`}
        >
          {hasThumbnail ? (
            <Image
              src={product.thumbnailUrl!}
              alt={`${product.name} 이미지`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1280px) 320px, (min-width: 768px) 45vw, 100vw"
              priority={false}
              unoptimized
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-medium text-white/90 transition-transform duration-500 group-hover:scale-105",
                gradientClass,
              )}
            >
              상품 이미지 준비중
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <ShoppingBag className="h-3.5 w-3.5" />
            {getProductCategoryLabel(product.category)}
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <Link
            href={href}
            className="inline-flex items-start gap-2 text-left text-lg font-semibold leading-tight text-gray-900 transition-colors hover:text-blue-600 focus-visible:text-blue-600"
          >
            {product.name}
          </Link>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>재고 {product.stockQuantity.toLocaleString("ko-KR")}</span>
          <Link
            href={href}
            className="text-xs font-semibold text-blue-600 underline-offset-4 transition hover:underline"
          >
            상세 보기
          </Link>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-xl font-bold text-gray-900">
            {currencyFormatter.format(product.price)}
          </span>
          <AddToCartButton
            productId={product.id}
            className="min-w-[120px] justify-center"
            size="sm"
          />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

