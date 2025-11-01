export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    paymentKey?: string;
  }>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    redirect("/cart");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect(`/sign-in?redirect_url=/payments/success?orderId=${orderId}`);
  }

  const supabase = createClerkSupabaseClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, clerk_id, total_amount, status, shipping_address")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order || order.clerk_id !== userId) {
    console.error("결제 완료 페이지: 주문을 찾을 수 없습니다.", { orderId, error });
    redirect("/orders");
  }

  if (order.status === "pending") {
    await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", orderId);
  }

  await supabase.from("cart_items").delete().eq("clerk_id", userId);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">결제가 완료되었습니다 🎉</h1>
        <p className="text-sm text-muted-foreground">
          주문 번호: {order.id}
        </p>
      </header>

      <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">결제 금액</span>
          <span className="text-xl font-semibold text-gray-900">
            {formatCurrency(Number(order.total_amount ?? 0))}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          배송정보: {order.shipping_address?.recipient} • {order.shipping_address?.phone}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href={`/orders/${orderId}`}>주문 상세 보기</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/products">쇼핑 계속하기</Link>
        </Button>
      </div>
    </div>
  );
}

