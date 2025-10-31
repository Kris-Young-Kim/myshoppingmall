import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProductCategoryLabel } from "@/types/product";

/**
 * @file category-filter.tsx
 * @description 상품 목록과 홈 화면에서 카테고리 탭을 렌더링하는 컴포넌트입니다.
 */

export interface CategoryFilterProps {
  categories: string[];
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

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory ? "outline" : "default"}
        size="sm"
        className={cn("rounded-full px-4")}
        asChild
      >
        <Link href={buildHref(undefined, basePath, query)}>전체</Link>
      </Button>

      {sortedCategories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <Button
            key={category}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className="rounded-full px-4"
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

