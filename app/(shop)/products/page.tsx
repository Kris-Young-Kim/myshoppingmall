import { notFound } from "next/navigation";
import { CategoryFilter } from "@/components/product/category-filter";
import { ProductCard } from "@/components/product/product-card";
import {
  fetchProductCategories,
  fetchProductSummaries,
} from "@/lib/supabase/queries/products";
import type { ProductFilterParams } from "@/types/product";
import { Button } from "@/components/ui/button";

/**
 * @file app/(shop)/products/page.tsx
 * @description 상품 목록 페이지. 카테고리/가격/정렬 필터를 지원합니다.
 */

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const SORT_OPTIONS = [
  { label: "최신순", value: "created_at", direction: "desc" },
  { label: "가격 낮은순", value: "price", direction: "asc" },
  { label: "가격 높은순", value: "price", direction: "desc" },
];

function parseNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const category = typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;
  const sortDirection =
    typeof params.sortDirection === "string" ? params.sortDirection : undefined;
  const minPrice = parseNumber(typeof params.minPrice === "string" ? params.minPrice : undefined);
  const maxPrice = parseNumber(typeof params.maxPrice === "string" ? params.maxPrice : undefined);

  const filterParams: ProductFilterParams = {
    category,
    minPrice,
    maxPrice,
    sortBy: sort === "price" ? "price" : "created_at",
    sortDirection: sortDirection === "asc" || sortDirection === "desc" ? sortDirection : undefined,
    limit: 12,
  };

  console.group("[products/page] render");
  console.log("searchParams", params);

  const [products, categories] = await Promise.all([
    fetchProductSummaries(filterParams),
    fetchProductCategories(),
  ]);

  if (!products && !categories) {
    console.error("상품 목록 데이터를 불러오지 못했습니다");
    console.groupEnd();
    notFound();
  }

  console.log("renderProducts", products.length);
  console.groupEnd();

  const queryForCategory = {
    sort: filterParams.sortBy,
    sortDirection: filterParams.sortDirection,
    minPrice: minPrice?.toString(),
    maxPrice: maxPrice?.toString(),
  };

  return (
    <div className="space-y-12 pb-16">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-gray-900">전체 상품</h1>
          <p className="text-sm text-muted-foreground">
            카테고리와 가격을 조합해 원하는 상품을 찾아보세요. 정렬 옵션은 링크로 즉시 적용됩니다.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            basePath="/products"
            query={queryForCategory}
          />

          <div className="flex flex-wrap items-center gap-3">
            {SORT_OPTIONS.map((option) => {
              const isActive =
                filterParams.sortBy === option.value &&
                (filterParams.sortDirection ?? "desc") === option.direction;
              const paramsObj = new URLSearchParams({
                ...queryForCategory,
                sort: option.value,
                sortDirection: option.direction,
              });
              if (category) paramsObj.set("category", category);

              return (
                <Button
                  key={`${option.value}-${option.direction}`}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <a href={`/products?${paramsObj.toString()}`}>{option.label}</a>
                </Button>
              );
            })}
          </div>

          <form className="flex w-full flex-wrap gap-3 rounded-2xl bg-slate-50 p-4" method="get">
            {category && <input type="hidden" name="category" value={category} />}
            {filterParams.sortBy && <input type="hidden" name="sort" value={filterParams.sortBy} />}
            {filterParams.sortDirection && (
              <input type="hidden" name="sortDirection" value={filterParams.sortDirection} />
            )}
            <label className="flex min-w-[160px] flex-1 flex-col text-xs font-medium text-muted-foreground">
              최소 가격
              <input
                name="minPrice"
                type="number"
                defaultValue={minPrice?.toString() ?? ""}
                className="mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="0"
                min={0}
              />
            </label>
            <label className="flex min-w-[160px] flex-1 flex-col text-xs font-medium text-muted-foreground">
              최대 가격
              <input
                name="maxPrice"
                type="number"
                defaultValue={maxPrice?.toString() ?? ""}
                className="mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="무제한"
                min={0}
              />
            </label>
            <Button type="submit" className="h-12 self-end">
              적용
            </Button>
          </form>
        </div>
      </section>

      <section className="space-y-4">
        {products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-muted-foreground/40 p-12 text-center text-muted-foreground">
            조건에 맞는 상품이 없습니다. 필터를 조정해보세요.
          </div>
        )}
      </section>
    </div>
  );
}

