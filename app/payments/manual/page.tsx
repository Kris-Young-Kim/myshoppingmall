export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { fetchOrderDetailForUser } from "@/lib/supabase/queries/orders";

interface ManualPaymentPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ManualPaymentPage({ searchParams }: ManualPaymentPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    redirect("/orders");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect(`/sign-in?redirect_url=/payments/manual?orderId=${orderId}`);
  }

  const order = await fetchOrderDetailForUser({ clerkId: userId, orderId });
  if (!order) {
    redirect("/orders");
  }

  const totalAmount = Number(order.totalAmount ?? 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">주문이 접수되었습니다</h1>
        <p className="text-sm text-muted-foreground">
          주문 번호: {order.id} • {new Date(order.createdAt).toLocaleString("ko-KR")}
        </p>
      </header>

      <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">입금 정보</h2>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-900">
          <p className="font-semibold">입금 계좌</p>
          <p className="mt-1">국민은행 123456-12-345678 (주)민투어</p>
          <p className="mt-3 font-semibold">입금 금액</p>
          <p className="mt-1">{formatCurrency(totalAmount)}</p>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>주문자 성함과 동일한 이름으로 24시간 이내 입금해 주세요.</li>
          <li>입금 확인 후 ‘결제 대기’ 상태가 ‘결제 완료’로 변경되며 여행 담당자가 연락드립니다.</li>
          <li>입금이 어려우신 경우 주문 번호를 함께 고객센터로 알려 주세요.</li>
        </ul>
      </section>

      <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">주문 요약</h2>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>상품 수</span>
          <span>{order.items.length}개</span>
        </div>
        <div className="flex justify-between border-t border-dashed border-gray-200 pt-4 text-base font-semibold">
          <span>총 결제 예정 금액</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href={`/orders/${orderId}`}>주문 상세 보기</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/products">다른 상품 둘러보기</Link>
        </Button>
      </div>
    </div>
  );
}


