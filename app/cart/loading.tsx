import { Skeleton } from "@/components/ui/skeleton";

/**
 * @file app/cart/loading.tsx
 * @description 장바구니 페이지 로딩 스켈레톤
 */
export default function CartLoading() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 py-16 md:grid-cols-[2fr,1fr]">
      <section className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-3xl border bg-white p-6 sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex flex-col items-end gap-3 sm:w-60">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="flex h-fit flex-col gap-6 rounded-3xl border bg-white p-6">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
      </aside>
    </div>
  );
}

