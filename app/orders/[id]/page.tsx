export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { fetchOrderDetailForUser } from "@/lib/supabase/queries/orders";
import { getOrderStatusBadgeClass, getOrderStatusLabel } from "@/types/order";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/orders");
  }

  const { id } = await params;

  console.group("[orders/id] render");
  console.log("orderId", id);

  const order = await fetchOrderDetailForUser({ clerkId: userId, orderId: id });

  if (!order) {
    console.warn("[orders/id] 주문을 찾을 수 없습니다", { orderId: id });
    console.groupEnd();
    notFound();
  }

  console.log("order.status", order.status, "itemCount", order.items.length);
  console.groupEnd();

  const totalAmount = Number(order.totalAmount ?? 0);
  const badgeClass = getOrderStatusBadgeClass(order.status);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">주문 상세</h1>
        <p className="text-sm text-muted-foreground">
          주문 번호: {order.id} • {new Date(order.createdAt).toLocaleString("ko-KR")}
        </p>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {getOrderStatusLabel(order.status)}
        </span>
      </header>

      <section className="grid gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <h2 className="text-base font-semibold text-gray-900">배송 정보</h2>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-medium text-gray-900">{order.shippingAddress.recipient}</p>
            <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
            <p className="mt-2 text-muted-foreground">
              ({order.shippingAddress.postcode}) {order.shippingAddress.addressLine1}
            </p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-muted-foreground">{order.shippingAddress.addressLine2}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <h2 className="text-base font-semibold text-gray-900">주문 메모</h2>
          <div className="rounded-2xl bg-slate-50 p-4 text-muted-foreground">
            {order.orderNote ?? "남겨진 메모가 없습니다."}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">주문 상품</h2>
        <div className="divide-y divide-gray-100 text-sm">
          {order.items.map((item) => {
            const lineTotal = Number(item.price ?? 0) * item.quantity;
            return (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">수량 {item.quantity}개</p>
                </div>
                <p className="font-medium text-gray-900">{formatCurrency(lineTotal)}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 text-base font-semibold">
          <span>총 결제 금액</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </section>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/products">쇼핑 계속하기</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/mypage">마이페이지로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}

