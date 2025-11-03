import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fetchProductDetail,
  fetchProductCategories,
} from "@/lib/supabase/queries/products";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { BuyNowButton } from "@/components/cart/buy-now-button";
import { Button } from "@/components/ui/button";
import { getProductCategoryLabel } from "@/types/product";

/**
 * @file app/(shop)/products/[id]/page.tsx
 * @description 상품 상세 페이지. Supabase에서 단일 상품을 조회하여 표시합니다.
 */

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

function extractTags(description: string | null, highlightTags?: string[]) {
  if (highlightTags && highlightTags.length > 0) return highlightTags;
  if (!description) return [];

  return description
    .split(/[#\n]/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .slice(0, 5);
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  console.group("[products/id] render");
  console.log("productId", id);

  const product = await fetchProductDetail(id);
  const categories = await fetchProductCategories();

  if (!product) {
    console.error("상품을 찾을 수 없습니다", id);
    console.groupEnd();
    notFound();
  }

  console.log("product.name", product.name);
  console.groupEnd();

  const tags = extractTags(product.description, product.highlightTags);

  return (
    <article className="space-y-12 pb-16">
      <Link
        href="/products"
        className="text-sm text-blue-600 underline-offset-4 hover:underline"
      >
        ← 상품 목록으로 돌아가기
      </Link>

      <header className="space-y-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-10 text-white shadow-lg">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
          {getProductCategoryLabel(product.category)}
        </span>
        <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>
        {product.description && (
          <p className="max-w-3xl text-base text-slate-100/90">
            {product.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-lg font-semibold">
          <span>{`${currencyFormatter.format(product.price)}부터`}</span>
          <span className="text-sm text-slate-200/70">
            재고 {product.stockQuantity.toLocaleString("ko-KR")}
          </span>
        </div>
      </header>

      <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-dashed border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900">상품 소개</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {product.description ?? "상품 설명이 준비 중입니다."}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900">상품 특징</h3>
            {tags.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                강조할 특징 정보가 없습니다.
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-4 rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">구매 정보</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>카테고리: {getProductCategoryLabel(product.category)}</li>
            <li>
              재고 수량: {product.stockQuantity.toLocaleString("ko-KR")}개
            </li>
            <li>
              최근 업데이트:{" "}
              {new Date(product.updatedAt).toLocaleString("ko-KR")}
            </li>
          </ul>

          <div className="space-y-4">
            <AddToCartButton
              productId={product.id}
              quantity={1}
              size="lg"
              className="w-full justify-center gap-2"
            />
            <BuyNowButton
              productId={product.id}
              quantity={1}
              size="lg"
              className="w-full gap-2"
            />
            <Button
              asChild
              variant="ghost"
              className="w-full justify-center text-sm text-blue-600"
            >
              <Link href="/cart">장바구니 바로가기</Link>
            </Button>
          </div>

          {categories.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">
                다른 카테고리 탐색
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category}
                    href={`/products?category=${category}`}
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-slate-400"
                  >
                    {getProductCategoryLabel(category)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </article>
  );
}
