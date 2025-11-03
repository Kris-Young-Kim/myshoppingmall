"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TossPaymentButton } from "@/components/payment/toss-payment-window";
import { createOrderDraftAction } from "@/actions/payments";
import { useToast } from "@/hooks/use-toast";

interface TossCheckoutFormProps {
  subtotal: number;
  cartItems: Array<{
    id: string;
    quantity: number;
    product: { name: string } | null;
  }>;
  clientKey: string;
  customerKey: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * @file toss-checkout-form.tsx
 * @description Toss Payments API 개별 연동을 사용한 체크아웃 폼 (결제창 방식)
 */
export function TossCheckoutForm({
  subtotal,
  cartItems,
  clientKey,
  customerKey,
}: TossCheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [orderData, setOrderData] = useState<{
    orderId: string;
    orderName: string;
    totalAmount: number;
    customerName: string;
    customerPhone?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        console.group("[checkout] 주문 생성");
        
        // 주문 생성
        const orderResult = await createOrderDraftAction(formData);

        console.log("주문 생성 완료", { orderId: orderResult.orderId, amount: orderResult.totalAmount });
        console.groupEnd();

        // 주문 정보 저장 (결제 버튼에서 사용)
        setOrderData({
          orderId: orderResult.orderId,
          orderName: orderResult.orderName,
          totalAmount: orderResult.totalAmount,
          customerName: formData.get("recipient")?.toString() || "고객",
          customerPhone: formData.get("phone")?.toString(),
        });

        toast({
          title: "주문 정보가 준비되었습니다",
          description: "결제하기 버튼을 눌러 결제를 진행해 주세요.",
        });
      } catch (error) {
        console.error("[checkout] 주문 생성 실패", error);
        console.groupEnd();
        toast({
          title: "주문 생성 실패",
          description: error instanceof Error ? error.message : "다시 시도해 주세요.",
          variant: "destructive",
        });
      }
    });
  };

  const handlePaymentError = (error: Error) => {
    console.error("[checkout] 결제창 오류", error);
    toast({
      title: "결제 실패",
      description: error.message,
      variant: "destructive",
    });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 py-16 md:grid-cols-[1.5fr,1fr]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">주문 정보 입력</h1>
          <p className="text-sm text-muted-foreground">
            배송 정보를 입력한 뒤 결제를 진행해 주세요.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {/* 배송 정보 입력 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="recipient">
                받는 분
              </label>
              <input
                id="recipient"
                name="recipient"
                required
                disabled={isPending}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
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
                disabled={isPending}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
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
                disabled={isPending}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
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
                disabled={isPending}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
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
              disabled={isPending}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
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
              disabled={isPending}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
              placeholder="문 앞에 놓아주세요."
            />
          </div>

          {/* 주문 생성 완료 후 결제 버튼 표시 */}
          {orderData && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">결제하기</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                주문 정보가 준비되었습니다. 결제하기 버튼을 눌러 결제를 진행해 주세요.
              </p>
              <TossPaymentButton
                clientKey={clientKey}
                amount={orderData.totalAmount}
                orderId={orderData.orderId}
                orderName={orderData.orderName}
                customerName={orderData.customerName}
                customerEmail={customerKey.includes("@") ? customerKey : undefined}
                customerPhone={orderData.customerPhone}
                successUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/payments/success`}
                failUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/payments/fail`}
                onError={handlePaymentError}
                disabled={isPending}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm">
            <span className="text-muted-foreground">주문 예정 금액</span>
            <span className="text-base font-semibold text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:justify-end">
            <Button asChild variant="outline" disabled={isPending}>
              <Link href="/cart">장바구니로 돌아가기</Link>
            </Button>
            <Button type="submit" size="lg" disabled={isPending || !!orderData}>
              {isPending ? "주문 정보 준비 중..." : orderData ? "결제 준비 완료" : "주문 정보 입력하기"}
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">주문 상품</h2>
        <ul className="space-y-3 text-sm">
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {item.product?.name ?? "상품 정보 없음"}
              </span>
              <span>{`${item.quantity}개`}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

