import { OrderListSkeleton } from "@/components/mypage/order-list-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <section className="h-32 animate-pulse rounded-3xl bg-slate-100" />
      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
        <OrderListSkeleton />
      </div>
    </div>
  );
}

