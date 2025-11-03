import { Skeleton } from "@/components/ui/skeleton";

/**
 * @file app/checkout/loading.tsx
 * @description 체크아웃 페이지 로딩 스켈레톤
 */
export default function CheckoutLoading() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 py-16 md:grid-cols-[1.5fr,1fr]">
      <section className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr,2fr]">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </section>

      <aside className="space-y-4 rounded-3xl border bg-white p-6">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        <Skeleton className="h-16 w-full" />
      </aside>
    </div>
  );
}

