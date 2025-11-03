"use client";

import { useTransition, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TossPaymentWidget, requestPayment } from "@/components/payment/toss-payment-widget";
import { createOrderDraftAction } from "@/actions/payments";
import { useToast } from "@/hooks/use-toast";
import { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

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
 * @description Toss Payments를 사용한 체크아웃 폼 (결제위젯 포함)
 */
export function TossCheckoutForm({
  subtotal,
  cartItems,
  clientKey,
  customerKey,
}: TossCheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    if (!isPaymentReady || !paymentWidgetRef.current) {
      toast({
        title: "결제위젯이 준비되지 않았습니다",
        description: "잠시 후 다시 시도해 주세요.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        console.group("[checkout] 주문 생성 및 결제 요청");
        
        // 1. 주문 생성
        const orderResult = await createOrderDraftAction(formData);

        console.log("주문 생성 완료", { orderId: orderResult.orderId, amount: orderResult.totalAmount });

        // 2. 결제 요청
        const successUrl = `${window.location.origin}/payments/success`;
        const failUrl = `${window.location.origin}/payments/fail`;

        const paymentResult = await requestPayment(
          paymentWidgetRef.current!,
          orderResult.orderId,
          orderResult.orderName,
          orderResult.totalAmount,
          customerKey,
          successUrl,
          failUrl
        );

        console.log("결제 요청 성공", paymentResult);
        console.groupEnd();

        // 결제 요청 성공 시 자동으로 리다이렉트됨
      } catch (error) {
        console.error("[checkout] 주문/결제 실패", error);
        console.groupEnd();
        toast({
          title: "결제 실패",
          description: error instanceof Error ? error.message : "다시 시도해 주세요.",
          variant: "destructive",
        });
      }
    });
  };

  const handlePaymentWidgetReady = (widget: PaymentWidgetInstance) => {
    paymentWidgetRef.current = widget;
    setIsPaymentReady(true);
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

          {/* 결제위젯 */}
          <TossPaymentWidget
            clientKey={clientKey}
            customerKey={customerKey}
            amount={subtotal}
            onReady={handlePaymentWidgetReady}
            onError={(error) => {
              toast({
                title: "결제위젯 로드 실패",
                description: error.message,
                variant: "destructive",
              });
            }}
          />

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
            <Button type="submit" size="lg" disabled={isPending || !isPaymentReady}>
              {isPending ? "처리 중..." : isPaymentReady ? "결제하기" : "결제위젯 준비 중..."}
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

