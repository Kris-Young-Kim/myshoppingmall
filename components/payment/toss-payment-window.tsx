"use client";

import { useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { Button } from "@/components/ui/button";

/**
 * @file toss-payment-window.tsx
 * @description Toss Payments V1 SDK 결제창 컴포넌트
 * 
 * API 개별 연동 키를 사용하여 결제창을 띄웁니다.
 * 결제창은 별도 페이지로 이동하여 결제를 진행합니다.
 */

interface TossPaymentWindowProps {
  clientKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  successUrl: string;
  failUrl: string;
  onError?: (error: Error) => void;
}

/**
 * 결제창 열기 함수
 */
export function openPaymentWindow({
  clientKey,
  amount,
  orderId,
  orderName,
  customerName,
  customerEmail,
  customerPhone,
  successUrl,
  failUrl,
  onError,
}: TossPaymentWindowProps) {
  return async () => {
    try {
      console.group("[payment-window] 결제창 열기");
      console.log("clientKey", clientKey ? `${clientKey.substring(0, 20)}...` : "없음");
      console.log("amount", amount);
      console.log("orderId", orderId);
      console.log("orderName", orderName);

      // 클라이언트 키 검증 (API 개별 연동 키: test_ck_ 또는 live_ck_)
      const trimmedKey = (clientKey ?? "").trim();
      if (!trimmedKey || trimmedKey.length === 0) {
        const errorMsg = "클라이언트 키가 비어있습니다. NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수를 확인해 주세요.";
        console.error("[payment-window] 클라이언트 키 비어있음");
        onError?.(new Error(errorMsg));
        console.groupEnd();
        return;
      }

      const isValidKey = trimmedKey.startsWith("test_ck_") || trimmedKey.startsWith("live_ck_");
      if (!isValidKey) {
        const errorMsg = "클라이언트 키 형식이 올바르지 않습니다. API 개별 연동 키(test_ck_ 또는 live_ck_)를 사용해야 합니다.";
        console.error("[payment-window] 클라이언트 키 형식 오류", {
          clientKeyPrefix: trimmedKey.substring(0, 12),
          expectedFormat: "test_ck_... 또는 live_ck_...",
        });
        onError?.(new Error(errorMsg));
        console.groupEnd();
        return;
      }

      // Toss Payments SDK 로드
      console.log("[payment-window] loadTossPayments 호출 중...");
      const tossPayments = await loadTossPayments(trimmedKey);
      console.log("[payment-window] loadTossPayments 성공");

      // 결제창 띄우기
      console.log("[payment-window] requestPayment 호출 중...");
      await tossPayments.requestPayment("카드", {
        amount,
        orderId,
        orderName,
        customerName,
        customerEmail,
        customerPhone,
        successUrl,
        failUrl,
      });

      console.log("[payment-window] 결제창 열기 성공");
      console.groupEnd();
    } catch (error) {
      console.error("[payment-window] 결제창 열기 실패", error);
      console.error("[payment-window] 에러 상세:", {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : undefined,
        errorCode: (error as any)?.code,
      });
      console.groupEnd();

      // 사용자 친화적인 에러 메시지 생성
      let userErrorMessage = "결제창을 여는 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        if (error.message.includes("USER_CANCEL")) {
          userErrorMessage = "결제가 취소되었습니다.";
        } else {
          userErrorMessage = error.message;
        }
      }

      onError?.(new Error(userErrorMessage));
    }
  };
}

/**
 * 결제하기 버튼 컴포넌트
 */
export function TossPaymentButton({
  clientKey,
  amount,
  orderId,
  orderName,
  customerName,
  customerEmail,
  customerPhone,
  successUrl,
  failUrl,
  onError,
  disabled = false,
  className,
}: TossPaymentWindowProps & { disabled?: boolean; className?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await openPaymentWindow({
        clientKey,
        amount,
        orderId,
        orderName,
        customerName,
        customerEmail,
        customerPhone,
        successUrl,
        failUrl,
        onError: (error) => {
          setIsLoading(false);
          onError?.(error);
        },
      })();
    } catch (error) {
      setIsLoading(false);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      size="lg"
      className={className}
    >
      {isLoading ? "결제창 열기 중..." : "결제하기"}
    </Button>
  );
}

