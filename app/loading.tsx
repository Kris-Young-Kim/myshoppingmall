import { Skeleton } from "@/components/ui/skeleton";

/**
 * @file app/loading.tsx
 * @description 루트 레벨 로딩 스켈레톤
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="h-12 w-64 mb-8" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

