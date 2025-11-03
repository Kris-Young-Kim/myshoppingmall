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
  onReady?: (widget: PaymentWidgetInstance) => void;
  onError?: (error: Error) => void;
}

export function TossPaymentWidget({
  clientKey,
  customerKey,
  amount,
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
        console.log("clientKey 타입", typeof clientKey);
        console.log("clientKey 존재 여부", !!clientKey);
        console.log("clientKey 값", clientKey);
        console.log("clientKey 전체 길이", clientKey?.length ?? 0);
        console.log("clientKey 시작 문자열", clientKey?.substring(0, 15));
        console.log("clientKey 마지막 10자", clientKey?.substring(Math.max(0, clientKey.length - 10)));
        console.log("customerKey", customerKey ? `${customerKey.substring(0, 20)}...` : "없음");
        console.log("customerKey 전체 길이", customerKey?.length ?? 0);
        console.log("amount", amount);

        // 클라이언트 키 검증
        // 결제위젯 연동 키 형식: test_gck_... 또는 live_gck_... (결제위젯 전용)
        // 일반 결제창 API 키 형식: test_ck_... 또는 live_ck_... (결제창 전용, 사용 불가)
        
        // 빈 문자열 또는 공백만 있는 경우 체크
        const trimmedKey = (clientKey ?? "").trim();
        if (!trimmedKey || trimmedKey.length === 0) {
          const errorMsg = "클라이언트 키가 비어있습니다. NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수를 확인해 주세요.";
          console.error("[payment-widget] 클라이언트 키 비어있음", {
            clientKey,
            clientKeyType: typeof clientKey,
            trimmedKey,
          });
          setIsLoading(false);
          onError?.(new Error(errorMsg));
          console.groupEnd();
          return;
        }
        
        const isValidWidgetKey = 
          trimmedKey.startsWith("test_gck_") || 
          trimmedKey.startsWith("live_gck_");
        
        if (!isValidWidgetKey) {
          const errorMsg = "클라이언트 키 형식이 올바르지 않습니다. 결제위젯 연동 키(WidgetClientKey)를 사용해야 합니다. test_gck_ 또는 live_gck_로 시작해야 합니다.";
          console.error("[payment-widget] 클라이언트 키 형식 오류", {
            clientKey: trimmedKey,
            clientKeyLength: trimmedKey.length,
            clientKeyPrefix: trimmedKey.substring(0, 12),
            keyType: trimmedKey.startsWith("test_") ? "테스트" : trimmedKey.startsWith("live_") ? "라이브" : "알 수 없음",
            startsWithTestGck: trimmedKey.startsWith("test_gck_"),
            startsWithLiveGck: trimmedKey.startsWith("live_gck_"),
            expectedFormat: "test_gck_... 또는 live_gck_... (결제위젯 연동 키)",
            note: "test_ck_ 또는 live_ck_는 일반 결제창 API 키입니다. 결제위젯에는 사용할 수 없습니다.",
          });
          setIsLoading(false);
          onError?.(new Error(errorMsg));
          console.groupEnd();
          return;
        }

        // customerKey 검증
        if (!customerKey || customerKey.length < 2 || customerKey.length > 50) {
          const errorMsg = "customerKey는 2자 이상 50자 이하여야 합니다.";
          console.error("[payment-widget] customerKey 형식 오류", {
            customerKey: customerKey ? `${customerKey.substring(0, 20)}...` : "없음",
            length: customerKey?.length ?? 0,
          });
          setIsLoading(false);
          onError?.(new Error(errorMsg));
          console.groupEnd();
          return;
        }

        // 결제위젯 SDK 로드
        console.log("[payment-widget] loadPaymentWidget 호출 중...");
        console.log("[payment-widget] 전달되는 파라미터:", {
          clientKeyLength: trimmedKey.length,
          clientKeyPrefix: trimmedKey.substring(0, 12),
          customerKeyLength: customerKey?.length,
          customerKeyValue: customerKey,
        });
        
        // paymentWidget 변수를 try 블록 밖에서 선언하여 스코프 확장
        let paymentWidget: PaymentWidgetInstance;
        try {
          // 검증된 trimmedKey 사용
          paymentWidget = await loadPaymentWidget(trimmedKey, customerKey);
          paymentWidgetRef.current = paymentWidget;
          console.log("[payment-widget] loadPaymentWidget 성공");
        } catch (loadError) {
          console.error("[payment-widget] loadPaymentWidget 실패", loadError);
          console.error("[payment-widget] 에러 상세:", {
            errorMessage: loadError instanceof Error ? loadError.message : String(loadError),
            errorName: loadError instanceof Error ? loadError.name : undefined,
            errorStack: loadError instanceof Error ? loadError.stack : undefined,
          });
          throw loadError;
        }

        // 결제위젯 렌더링
        // currency를 명시적으로 지정 (기본값: KRW)
        console.log("[payment-widget] renderPaymentMethods 호출 중...");
        console.log("[payment-widget] renderPaymentMethods 파라미터:", {
          selector: "#payment-widget",
          amount,
          currency: "KRW",
          variantKey: "DEFAULT",
        });
        
        let paymentMethodsWidget: ReturnType<PaymentWidgetInstance["renderPaymentMethods"]>;
        try {
          paymentMethodsWidget = paymentWidget.renderPaymentMethods(
            "#payment-widget",
            { value: amount, currency: "KRW" },
            { variantKey: "DEFAULT" }
          );

          paymentMethodsWidgetRef.current = paymentMethodsWidget;
          console.log("[payment-widget] renderPaymentMethods 성공");
        } catch (renderError) {
          console.error("[payment-widget] renderPaymentMethods 실패", renderError);
          console.error("[payment-widget] 에러 상세:", {
            errorMessage: renderError instanceof Error ? renderError.message : String(renderError),
            errorName: renderError instanceof Error ? renderError.name : undefined,
            errorStack: renderError instanceof Error ? renderError.stack : undefined,
          });
          throw renderError;
        }

        // 결제위젯 준비 완료 이벤트
        paymentMethodsWidget.on("ready", () => {
          console.log("[payment-widget] 준비 완료");
          setIsLoading(false);
          onReady?.(paymentWidget);
        });

        // 에러 이벤트 리스너 추가
        paymentMethodsWidget.on("error", (error: any) => {
          console.error("[payment-widget] 위젯 에러 이벤트", error);
          setIsLoading(false);
          onError?.(error instanceof Error ? error : new Error(String(error)));
        });

        console.groupEnd();
      } catch (error) {
        console.error("[payment-widget] 초기화 실패", error);
        console.error("[payment-widget] 에러 상세", {
          clientKey: clientKey ? `${clientKey.substring(0, 20)}...` : "없음",
          clientKeyFormat: clientKey?.startsWith("test_ck_") ? "테스트" : clientKey?.startsWith("live_ck_") ? "프로덕션" : "형식 오류",
          customerKey: customerKey ? `${customerKey.substring(0, 20)}...` : "없음",
          customerKeyLength: customerKey?.length ?? 0,
          amount,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorCode: (error as any)?.code,
          errorStack: error instanceof Error ? error.stack : undefined,
        });
        setIsLoading(false);
        
        // 사용자 친화적인 에러 메시지 생성
        let userErrorMessage = "결제위젯을 불러오는 중 오류가 발생했습니다.";
        if (error instanceof Error) {
          if (error.message.includes("401") || error.message.includes("Unauthorized")) {
            userErrorMessage = "인증 오류가 발생했습니다. 클라이언트 키를 확인해 주세요.";
          } else if (error.message.includes("알 수 없는 에러")) {
            userErrorMessage = "결제위젯 초기화에 실패했습니다. Toss Payments 개발자센터에서 키를 확인해 주세요.";
          }
        }
        
        onError?.(new Error(userErrorMessage));
        console.groupEnd();
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

