import { Skeleton } from "@/components/ui/skeleton";

/**
 * @file app/orders/[id]/loading.tsx
 * @description 주문 상세 페이지 로딩 스켈레톤
 */
export default function OrderDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 py-16">
      <header className="space-y-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-96" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </header>

      <section className="grid gap-6 rounded-3xl border bg-white p-6 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border bg-white p-6">
        <Skeleton className="h-6 w-32" />
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-40" />
        </div>
      </section>

      <div className="flex gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}

