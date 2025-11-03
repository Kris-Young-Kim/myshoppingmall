export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { TossCheckoutForm } from "@/components/checkout/toss-checkout-form";
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

  // Toss Payments 환경 변수
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  if (!clientKey) {
    throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수가 설정되지 않았습니다.");
  }

  // customerKey 생성: Clerk userId를 기반으로 안전한 고유 키 생성
  // Toss Payments 요구사항: 영문 대소문자, 숫자, 특수문자(-, _, =, ., @)를 포함한 2-50자
  // userId 형식이 이미 요구사항을 만족하므로 그대로 사용 (예: user_xxx)
  // 만약 형식이 맞지 않으면 userId를 기반으로 변환
  const customerKey = userId.replace(/[^a-zA-Z0-9_=.-@]/g, "_").substring(0, 50) || `customer_${userId}`;

  return (
    <TossCheckoutForm
      subtotal={subtotal}
      cartItems={normalized}
      clientKey={clientKey}
      customerKey={customerKey}
    />
  );
}

