"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { submitManualPaymentAction } from "@/actions/payments";
import { useToast } from "@/hooks/use-toast";

interface CheckoutFormProps {
  subtotal: number;
  cartItems: Array<{
    id: string;
    quantity: number;
    product: { name: string } | null;
  }>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * @file checkout-form.tsx
 * @description 체크아웃 폼 컴포넌트 (토스트 포함)
 */
export function CheckoutForm({ subtotal, cartItems }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await submitManualPaymentAction(formData);
        toast({
          title: "주문이 접수되었습니다",
          description: "입금 안내 페이지로 이동합니다.",
        });
        // redirect는 서버 액션에서 처리됨
      } catch (error) {
        console.error("[checkout] submit failed", error);
        toast({
          title: "주문 실패",
          description: "다시 시도해 주세요.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 py-16 md:grid-cols-[1.5fr,1fr]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">주문 정보 입력</h1>
          <p className="text-sm text-muted-foreground">
            배송 정보를 입력한 뒤 주문을 완료해 주세요.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
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

          <div className="space-y-4 rounded-2xl border border-dashed border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900">입금 안내</h2>
            <p className="text-sm text-muted-foreground">
              아래 계좌로 주문 금액을 입금해 주세요. 입금이 확인되면 주문이 확정되고 여행 담당자가 개별 연락을 드립니다.
            </p>
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-gray-900">
              <p className="font-semibold">입금 계좌</p>
              <p className="mt-1">국민은행 123456-12-345678 (주)민투어</p>
              <p className="mt-2 text-muted-foreground">
                ※ 주문자 성함과 동일한 이름으로 24시간 이내 입금해 주세요.
              </p>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
              <li>입금이 늦어질 경우 고객센터로 미리 알려 주세요.</li>
              <li>입금 확인 후 주문 상태가 &apos;결제 대기&apos;에서 &apos;결제 완료&apos;로 변경됩니다.</li>
            </ul>
          </div>

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
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "처리 중..." : "주문 신청하기"}
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
        <div className="border-t border-dashed border-gray-200 pt-4 text-sm text-muted-foreground">
          입금 확인 후 주문 내역 페이지와 알림으로 진행 상황을 안내해 드립니다.
        </div>
      </aside>
    </div>
  );
}

