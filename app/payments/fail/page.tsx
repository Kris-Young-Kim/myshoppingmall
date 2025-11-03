import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * @file app/payments/fail/page.tsx
 * @description Toss Payments 결제 실패 페이지
 */
function PaymentFailContent() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-gray-900">결제에 실패했습니다</h1>
        <p className="text-sm text-muted-foreground">
          결제를 다시 시도하거나 다른 결제 수단을 선택해 주세요.
        </p>
      </header>

      <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">안내사항</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>카드 한도 초과, 잔액 부족 등의 이유로 결제가 실패할 수 있습니다.</li>
          <li>결제 정보를 다시 확인한 후 시도해 주세요.</li>
          <li>문제가 지속되면 고객센터로 문의해 주세요.</li>
        </ul>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild size="sm">
          <Link href="/cart">장바구니로 돌아가기</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/products">상품 목록으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailContent />
    </Suspense>
  );
}
