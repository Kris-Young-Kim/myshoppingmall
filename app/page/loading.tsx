import { Skeleton } from "@/components/ui/skeleton";

/**
 * @file app/page/loading.tsx
 * @description 홈페이지 로딩 스켈레톤
 */
export default function HomeLoading() {
  return (
    <div className="space-y-20">
      {/* 히어로 섹션 스켈레톤 */}
      <section className="relative -mx-4 space-y-12 rounded-[32px] bg-linear-to-b from-[#050c1e] via-[#061128] to-[#030813] px-4 pb-24 pt-12 text-slate-100 sm:mx-0 sm:px-8 lg:px-12">
        <div className="space-y-6">
          <Skeleton className="h-16 w-3/4 bg-white/10" />
          <Skeleton className="h-6 w-1/2 bg-white/10" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-full bg-white/10" />
            <Skeleton className="h-10 w-32 rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      {/* 상품 카드 그리드 스켈레톤 */}
      <section className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-3xl border bg-white p-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

