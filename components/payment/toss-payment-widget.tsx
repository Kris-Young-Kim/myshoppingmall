"use client";

import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

/**
 * @file toss-payment-widget.tsx
 * @description Toss Payments V1 SDK 결제위젯 컴포넌트
 * 
 * 주문서에 결제위젯을 삽입하고 결제 요청을 처리합니다.
 */

interface TossPaymentWidgetProps {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderName: string;
  orderId: string;
  onReady?: (widget: PaymentWidgetInstance) => void;
  onError?: (error: Error) => void;
}

export function TossPaymentWidget({
  clientKey,
  customerKey,
  amount,
  orderName,
  orderId,
  onReady,
  onError,
}: TossPaymentWidgetProps) {
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initPaymentWidget = async () => {
      try {
        console.group("[payment-widget] 초기화");
        console.log("clientKey", clientKey);
        console.log("customerKey", customerKey);
        console.log("amount", amount);

        // 결제위젯 SDK 로드
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        paymentWidgetRef.current = paymentWidget;

        // 결제위젯 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: amount },
          { variantKey: "DEFAULT" }
        );

        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        // 결제위젯 준비 완료 이벤트
        paymentMethodsWidget.on("ready", () => {
          console.log("[payment-widget] 준비 완료");
          setIsLoading(false);
          onReady?.(paymentWidget);
        });

        console.groupEnd();
      } catch (error) {
        console.error("[payment-widget] 초기화 실패", error);
        setIsLoading(false);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    initPaymentWidget();
  }, [clientKey, customerKey, amount, onReady, onError]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">결제 수단 선택</h2>
        {isLoading && (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            결제위젯을 불러오는 중...
          </div>
        )}
        <div id="payment-widget" className={isLoading ? "hidden" : ""} />
      </div>

      {/* 결제 버튼은 부모 컴포넌트에서 처리 */}
    </div>
  );
}

/**
 * 결제 요청 함수
 */
export async function requestPayment(
  paymentWidget: PaymentWidgetInstance,
  orderId: string,
  orderName: string,
  amount: number,
  customerKey: string,
  successUrl: string,
  failUrl: string
) {
  console.group("[payment-widget] 결제 요청");
  console.log("orderId", orderId);
  console.log("orderName", orderName);
  console.log("amount", amount);

  try {
    const result = await paymentWidget.requestPayment({
      orderId,
      orderName,
      successUrl,
      failUrl,
      customerEmail: customerKey, // 실제로는 이메일 사용
      customerName: customerKey,
    });

    console.log("[payment-widget] 결제 요청 성공", result);
    console.groupEnd();

    return result;
  } catch (error) {
    console.error("[payment-widget] 결제 요청 실패", error);
    console.groupEnd();
    throw error;
  }
}

