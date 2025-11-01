import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProductCategoryLabel } from "@/types/product";

/**
 * @file category-filter.tsx
 * @description 상품 목록과 홈 화면에서 카테고리 탭을 렌더링하는 컴포넌트입니다.
 */

export interface CategoryFilterProps {
  categories: readonly string[];
  selectedCategory?: string;
  basePath?: string;
  query?: Record<string, string | undefined>;
}

function buildHref(
  category: string | undefined,
  basePath: string,
  query: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  if (category) {
    params.set("category", category);
  } else {
    params.delete("category");
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  basePath = "/products",
  query = {},
}: CategoryFilterProps) {
  const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b));
  const baseButtonClass = "rounded-full px-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-slate-200/80";
  const activeClass = "bg-slate-900 text-white border-slate-900 hover:bg-slate-800";
  const inactiveClass = "bg-white/90 text-slate-900 border-white/40 hover:bg-white";

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          baseButtonClass,
          selectedCategory ? inactiveClass : activeClass,
        )}
        asChild
      >
        <Link href={buildHref(undefined, basePath, query)}>전체</Link>
      </Button>

      {sortedCategories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <Button
            key={category}
            variant="outline"
            size="sm"
            className={cn(baseButtonClass, isActive ? activeClass : inactiveClass)}
            asChild
          >
            <Link href={buildHref(category, basePath, query)}>
              {getProductCategoryLabel(category)}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;

