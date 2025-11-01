export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  removeCartItemAction,
  updateCartItemQuantityAction,
} from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

interface CartItemRow {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number | string;
    description: string | null;
    category: string | null;
  } | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/cart");
  }

  const supabase = createClerkSupabaseClient();

  const { data: cartItems = [] } = await supabase
    .from("cart_items")
    .select(
      "id, quantity, product:products(id, name, price, description, category)",
    )
    .eq("clerk_id", userId)
    .order("created_at", { ascending: true });

  const typedCartItems = cartItems as unknown as CartItemRow[];

  const normalizedItems = typedCartItems.filter(
    (item): item is CartItemRow & { product: NonNullable<CartItemRow["product"]> } =>
      Boolean(item.product),
  );

  const subtotal = normalizedItems.reduce((sum, item) => {
    return sum + Number(item.product.price ?? 0) * item.quantity;
  }, 0);

  if (normalizedItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl space-y-10 py-16">
        <div className="rounded-3xl border border-dashed border-muted-foreground/40 p-12 text-center">
          <h1 className="text-3xl font-semibold">장바구니가 비어 있습니다.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            마음에 드는 상품을 장바구니에 담아보세요.
          </p>
          <Button asChild className="mt-8">
            <Link href="/products">상품 둘러보기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 py-16 md:grid-cols-[2fr,1fr]">
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold">장바구니</h1>
          <p className="text-sm text-muted-foreground">
            수량을 조정하거나 필요 없는 상품을 제거할 수 있어요.
          </p>
        </header>

        <div className="space-y-4">
          {normalizedItems.map((item) => {
            const price = Number(item.product.price ?? 0);
            const lineTotal = price * item.quantity;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.product.name}
                  </h2>
                  {item.product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.product.description}
                    </p>
                  )}
                  <span className="text-sm font-medium text-gray-500">
                    {item.product.category ?? "기타"}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-3 sm:w-60">
                  <span className="text-base font-semibold text-gray-900">
                    {formatCurrency(lineTotal)}
                  </span>

                  <form
                    action={updateCartItemQuantityAction}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <label className="text-xs text-muted-foreground" htmlFor={`quantity-${item.id}`}>
                      수량
                    </label>
                    <input
                      id={`quantity-${item.id}`}
                      name="quantity"
                      type="number"
                      min={0}
                      defaultValue={item.quantity}
                      className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                    <Button type="submit" variant="outline" size="sm">
                      적용
                    </Button>
                  </form>

                  <form action={removeCartItemAction}>
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <Button type="submit" variant="ghost" size="sm">
                      삭제
                    </Button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="flex h-fit flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">주문 요약</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>상품 금액</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>배송비</span>
              <span>주문 시 계산</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 text-base font-semibold">
          <span>예상 결제 금액</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link href="/checkout">결제 진행하기</Link>
        </Button>

        <Button asChild variant="ghost" size="sm" className="w-full">
          <Link href="/products">쇼핑 계속하기</Link>
        </Button>
      </aside>
    </div>
  );
}

