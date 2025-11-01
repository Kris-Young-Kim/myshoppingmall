export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { initiateTossPaymentAction } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

interface CartItemRow {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number | string;
  } | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function CheckoutPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/checkout");
  }

  const supabase = createClerkSupabaseClient();
  const { data: cartItems = [] } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products(id, name, price)")
    .eq("clerk_id", userId);

  const typedCart = cartItems as unknown as CartItemRow[];

  const normalized = typedCart.filter(
    (item): item is CartItemRow & { product: NonNullable<CartItemRow["product"]> } =>
      Boolean(item.product),
  );

  if (normalized.length === 0) {
    redirect("/cart");
  }

  const subtotal = normalized.reduce((sum, item) => {
    const price = Number(item.product.price ?? 0);
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="mx-auto grid max-w-5xl gap-10 py-16 md:grid-cols-[1.5fr,1fr]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">주문 정보 입력</h1>
          <p className="text-sm text-muted-foreground">
            배송 정보를 입력한 뒤 주문을 완료해 주세요.
          </p>
        </div>

        <form action={initiateTossPaymentAction} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="recipient">
                받는 분
              </label>
              <input
                id="recipient"
                name="recipient"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm"
                placeholder="홍길동"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                연락처
              </label>
              <input
                id="phone"
                name="phone"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm"
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr,2fr]">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="postcode">
                우편번호
              </label>
              <input
                id="postcode"
                name="postcode"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm"
                placeholder="00000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="addressLine1">
                기본 주소
              </label>
              <input
                id="addressLine1"
                name="addressLine1"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm"
                placeholder="서울특별시 OO구 OO로 123"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="addressLine2">
              상세 주소
            </label>
            <input
              id="addressLine2"
              name="addressLine2"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm"
              placeholder="아파트 동/호수 등을 입력해주세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="orderNote">
              배송 메모 (선택)
            </label>
            <textarea
              id="orderNote"
              name="orderNote"
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm"
              placeholder="문 앞에 놓아주세요."
            />
          </div>

          <div className="space-y-4 rounded-2xl border border-dashed border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900">결제 수단</h2>
            <p className="text-sm text-muted-foreground">
              토스페이먼츠 테스트 모드로 결제가 진행됩니다. 결제 페이지에서 결제를 완료하거나 취소할 수 있습니다.
            </p>
            <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value="toss"
                defaultChecked
                className="h-4 w-4"
              />
              <span className="font-medium text-gray-900">토스페이먼츠 (테스트)</span>
            </label>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm">
            <span className="text-muted-foreground">주문 예정 금액</span>
            <span className="text-base font-semibold text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:justify-end">
            <Button asChild variant="outline">
              <Link href="/cart">장바구니로 돌아가기</Link>
            </Button>
            <Button type="submit" size="lg">
              결제 진행하기
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">주문 상품</h2>
        <ul className="space-y-3 text-sm">
          {normalized.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <span className="text-muted-foreground">{item.product.name}</span>
              <span>{`${item.quantity}개`}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-dashed border-gray-200 pt-4 text-sm text-muted-foreground">
          결제 완료 후 주문 내역 페이지에서 상세 정보를 확인할 수 있어요.
        </div>
      </aside>
    </div>
  );
}

