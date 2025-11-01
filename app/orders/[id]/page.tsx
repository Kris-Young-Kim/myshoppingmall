export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

interface OrderRow {
  id: string;
  clerk_id: string;
  total_amount: number | string;
  status: string;
  shipping_address: {
    recipient: string;
    phone: string;
    postcode: string;
    addressLine1: string;
    addressLine2?: string | null;
  } | null;
  order_note: string | null;
  created_at: string;
  items: {
    id: string;
    product_name: string;
    quantity: number;
    price: number | string;
  }[];
}

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

  const supabase = createClerkSupabaseClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, clerk_id, total_amount, status, shipping_address, order_note, created_at, items:order_items(id, product_name, quantity, price)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("주문 조회 실패", error);
    notFound();
  }

  if (!order || order.clerk_id !== userId) {
    notFound();
  }

  const typedOrder = order as OrderRow;
  const totalAmount = Number(typedOrder.total_amount ?? 0);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">주문 상세</h1>
        <p className="text-sm text-muted-foreground">
          주문 번호: {typedOrder.id} • {new Date(typedOrder.created_at).toLocaleString("ko-KR")}
        </p>
      </header>

      <section className="grid gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <h2 className="text-base font-semibold text-gray-900">배송 정보</h2>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-medium text-gray-900">{typedOrder.shipping_address?.recipient}</p>
            <p className="text-muted-foreground">{typedOrder.shipping_address?.phone}</p>
            <p className="mt-2 text-muted-foreground">
              ({typedOrder.shipping_address?.postcode}) {typedOrder.shipping_address?.addressLine1}
            </p>
            {typedOrder.shipping_address?.addressLine2 && (
              <p className="text-muted-foreground">{typedOrder.shipping_address.addressLine2}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <h2 className="text-base font-semibold text-gray-900">주문 메모</h2>
          <div className="rounded-2xl bg-slate-50 p-4 text-muted-foreground">
            {typedOrder.order_note ?? '남겨진 메모가 없습니다.'}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">주문 상품</h2>
        <div className="divide-y divide-gray-100 text-sm">
          {typedOrder.items.map((item) => {
            const lineTotal = Number(item.price ?? 0) * item.quantity;
            return (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900">{item.product_name}</p>
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
          <Link href="/orders">주문 목록 보기 (준비중)</Link>
        </Button>
      </div>
    </div>
  );
}

