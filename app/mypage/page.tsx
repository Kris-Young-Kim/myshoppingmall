export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProfileCard } from "@/components/mypage/profile-card";
import { OrderCard } from "@/components/mypage/order-card";
import { OrderStatusTabs } from "@/components/mypage/order-status-tabs";
import { Button } from "@/components/ui/button";
import { fetchOrdersByUser } from "@/lib/supabase/queries/orders";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getOrderStatusLabel, isOrderStatus, type OrderStatus } from "@/types/order";

interface MyPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function MyPage({ searchParams }: MyPageProps) {
  const params = await searchParams;
  console.group("[mypage] render");
  console.log("searchParams", params);

  const { userId } = await auth();
  if (!userId) {
    console.warn("[mypage] 인증되지 않은 접근. 로그인 페이지로 리다이렉트");
    console.groupEnd();
    redirect("/sign-in?redirect_url=/mypage");
  }

  const user = await currentUser();
  const supabase = createClerkSupabaseClient();

  const statusParam = params.status;
  const status = isOrderStatus(statusParam) ? (statusParam as OrderStatus) : undefined;

  const { orders, hasMore } = await fetchOrdersByUser({
    clerkId: userId,
    status,
    supabase,
  });

  console.log("orders.length", orders.length);
  console.log("filteredStatus", status ?? "전체");
  console.groupEnd();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <section className="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-purple-100 p-8 shadow-inner">
        <h1 className="text-3xl font-semibold text-gray-900">마이페이지</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          주문 내역과 배송 정보를 확인하고 필요한 작업을 진행하세요.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-4">
          <ProfileCard user={user} recentOrderCount={orders.length} />
          <div className="rounded-3xl border border-dashed border-gray-200 p-4 text-sm text-muted-foreground">
            결제 완료된 주문은 `결제 완료` 탭에서 확인할 수 있고, 취소된 주문은 `취소됨` 탭에서 관리할 수 있어요.
          </div>
        </aside>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">주문 내역</h2>
              <p className="text-sm text-muted-foreground">
                {status ? `${getOrderStatusLabel(status)} 상태의 주문을 보고 있어요.` : "최근 주문부터 순서대로 정렬되어 있어요."}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/products">상품 둘러보기</Link>
            </Button>
          </div>

          <OrderStatusTabs selectedStatus={status} />

          <div>
            {orders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center text-muted-foreground">
                아직 주문 내역이 없습니다. 마음에 드는 상품을 찾아 장바구니에 담아보세요.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>

          {hasMore && (
            <div className="text-center text-sm text-muted-foreground">
              더 많은 주문이 있습니다. 스크롤 기반 페이지네이션은 Phase 5 확장 항목입니다.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

