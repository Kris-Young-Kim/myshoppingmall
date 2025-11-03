"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/**
 * @file app/payments/success/page.tsx
 * @description Toss Payments 결제 성공 페이지
 */
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(true);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        toast({
          title: "결제 정보 누락",
          description: "결제 정보가 올바르지 않습니다.",
          variant: "destructive",
        });
        router.push("/payments/fail");
        return;
      }

      try {
        console.group("[payments/success] 결제 승인 요청");
        console.log("paymentKey", paymentKey);
        console.log("orderId", orderId);
        console.log("amount", amount);

        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("결제 승인 실패", data);
          toast({
            title: "결제 승인 실패",
            description: data.error || "결제 승인에 실패했습니다.",
            variant: "destructive",
          });
          router.push(`/payments/fail?orderId=${orderId}`);
          return;
        }

        console.log("결제 승인 성공", data);
        console.groupEnd();

        toast({
          title: "결제가 완료되었습니다",
          description: "주문 내역에서 확인할 수 있습니다.",
        });

        setIsConfirming(false);
        
        // 3초 후 주문 상세 페이지로 이동
        setTimeout(() => {
          router.push(`/orders/${orderId}`);
        }, 3000);
      } catch (error) {
        console.error("[payments/success] 결제 승인 오류", error);
        toast({
          title: "결제 승인 오류",
          description: "다시 시도해 주세요.",
          variant: "destructive",
        });
        router.push(`/payments/fail?orderId=${orderId}`);
      }
    };

    confirmPayment();
  }, [searchParams, router, toast]);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          {isConfirming ? "결제 승인 중..." : "결제가 완료되었습니다"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isConfirming
            ? "잠시만 기다려 주세요."
            : "주문 내역 페이지로 이동합니다."}
        </p>
      </header>

      {!isConfirming && (
        <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>주문 번호</span>
              <span>{orderId}</span>
            </div>
            {amount && (
              <div className="flex justify-between text-muted-foreground">
                <span>결제 금액</span>
                <span className="font-semibold text-gray-900">
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                    maximumFractionDigits: 0,
                  }).format(Number(amount))}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {orderId && (
          <Button asChild size="sm">
            <Link href={`/orders/${orderId}`}>주문 상세 보기</Link>
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href="/products">다른 상품 둘러보기</Link>
        </Button>
      </div>
    </div>
  );
}
