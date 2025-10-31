export const dynamic = "force-dynamic";

import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { CategoryFilter } from "@/components/product/category-filter";
import { ProductCard } from "@/components/product/product-card";
import {
  fetchProductCategories,
  fetchProductSummaries,
} from "@/lib/supabase/queries/products";
import { Button } from "@/components/ui/button";
import { productCategories } from "@/types/product";

/**
 * @file page.tsx (Shop Home)
 * @description 쇼핑몰 홈 트래픽의 첫 진입점. HOT SALE 섹션과 추천 상품 캐러셀을 노출합니다.
 */

export default async function ShopHomePage() {
  console.group("[home/page] render");

  const [hotSaleProducts, categories] = await Promise.all([
    fetchProductSummaries({ limit: 9 }),
    fetchProductCategories(),
  ]);

  console.log("hotSaleProducts", hotSaleProducts.length);
  console.log("availableCategories", categories.length);
  console.groupEnd();

  const categoryList = categories.length > 0 ? categories : productCategories;
  const featured = hotSaleProducts.slice(0, 6);
  const trending = hotSaleProducts.slice(6);

  return (
    <div className="space-y-16 pb-20">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-white to-purple-100 px-8 py-14 shadow-inner">
        <div className="max-w-5xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-sky-600 shadow">
            <Flame className="h-4 w-4" />
            시즌 한정 특가
          </span>
          <h1 className="text-4xl font-bold leading-snug text-gray-900 md:text-5xl">
            &ldquo;지금 떠나야 더 저렴한&rdquo; 인기 여행 상품을 만나보세요
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">
            Supabase에 저장된 HOT SALE 상품 데이터를 기반으로 실시간 추천을 보여드립니다.
            간편한 카테고리 선택으로 원하는 여행을 빠르게 찾아보세요.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/products" className="gap-2">
                지금 상품 둘러보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/products?sort=price&sortDirection=asc">가격 낮은순 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
              <Flame className="h-6 w-6 text-orange-500" /> HOT SALE
            </h2>
            <p className="text-sm text-muted-foreground">
              카테고리를 선택해 원하는 여행 상품만 빠르게 확인하세요.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
          >
            전체 상품 보기
          </Link>
        </div>

        <CategoryFilter categories={categoryList} basePath="/products" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.length > 0 ? (
            featured.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-muted-foreground/30 p-10 text-center text-muted-foreground">
              현재 등록된 HOT SALE 상품이 없습니다. Supabase 콘솔에서 상품을 추가해보세요.
            </div>
          )}
        </div>
      </section>

      {trending.length > 0 && (
        <section className="space-y-6">
          <header className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">이번 주 인기 상품</h2>
            <p className="text-sm text-muted-foreground">
              최근 업데이트된 상품을 그리드로 한눈에 살펴보세요.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
