import { Skeleton } from "@/components/ui/skeleton";

/**
 * @file app/(shop)/products/[id]/loading.tsx
 * @description 상품 상세 페이지 로딩 스켈레톤
 */
export default function ProductDetailLoading() {
  return (
    <article className="space-y-12 pb-16">
      <Skeleton className="h-5 w-48" />
      
      <header className="space-y-4 rounded-3xl bg-linear-to-br from-slate-900 to-slate-700 p-10">
        <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
        <Skeleton className="h-12 w-3/4 bg-white/10" />
        <Skeleton className="h-6 w-full bg-white/10" />
        <Skeleton className="h-6 w-1/2 bg-white/10" />
      </header>

      <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
        <aside className="space-y-4 rounded-3xl border bg-white p-8">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </aside>
      </section>
    </article>
  );
}

