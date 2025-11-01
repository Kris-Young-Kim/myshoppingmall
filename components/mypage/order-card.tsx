import Link from "next/link";

import { getOrderStatusBadgeClass, getOrderStatusLabel, type OrderSummary } from "@/types/order";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: OrderSummary;
}

export function OrderCard({ order }: OrderCardProps) {
  const createdAt = new Date(order.createdAt).toLocaleString("ko-KR");
  const badgeClass = getOrderStatusBadgeClass(order.status);
  const headline = order.headlineProduct ?? "상품 정보";
  const remainingCount = order.itemCount > 1 ? `외 ${order.itemCount - 1}건` : null;

  return (
    <article className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">주문 번호</p>
          <p className="text-sm font-semibold text-gray-900">{order.id}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{getOrderStatusLabel(order.status)}</span>
      </header>

      <div className="space-y-1 text-sm">
        <p className="text-gray-900">
          {headline}
          {remainingCount && <span className="text-muted-foreground"> {remainingCount}</span>}
        </p>
        <p className="text-muted-foreground">
          주문일시: {createdAt} · 결제 금액 {order.totalAmount.toLocaleString("ko-KR")}원
        </p>
        {order.recipient && <p className="text-muted-foreground">받는 분: {order.recipient}</p>}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/orders/${order.id}`}>상세 보기</Link>
        </Button>
      </div>
    </article>
  );
}

