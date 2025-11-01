export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

interface FailPageProps {
  searchParams: Promise<{
    orderId?: string;
    message?: string;
  }>;
}

export default async function PaymentFailPage({ searchParams }: FailPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    redirect('/cart');
  }

  const { userId } = await auth();
  if (!userId) {
    redirect(`/sign-in?redirect_url=/payments/fail?orderId=${orderId}`);
  }

  const supabase = createClerkSupabaseClient();

  const { data: order } = await supabase
    .from('orders')
    .select('id, clerk_id, status')
    .eq('id', orderId)
    .maybeSingle();

  if (order && order.clerk_id === userId && order.status !== 'cancelled') {
    await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 py-16">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
        <h1 className="text-2xl font-semibold">주문이 취소되었습니다</h1>
        <p className="mt-3 text-sm">
          {params.message ?? '입금이 확인되지 않아 주문이 취소되었습니다. 다시 주문하시거나 고객센터로 문의해 주세요.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href="/checkout">새 주문 진행하기</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/cart">장바구니로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}

