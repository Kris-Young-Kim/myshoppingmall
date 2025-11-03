import { Skeleton } from "@/components/ui/skeleton";

/**
 * @file app/(shop)/products/loading.tsx
 * @description 상품 목록 페이지 로딩 스켈레톤
 */
export default function ProductsLoading() {
  return (
    <div className="space-y-12 pb-16">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* 필터 섹션 스켈레톤 */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </section>

      {/* 상품 그리드 스켈레톤 */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-3xl border bg-white p-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </section>
    </div>
  );
}

