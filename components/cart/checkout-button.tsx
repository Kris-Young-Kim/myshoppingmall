"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

interface CheckoutButtonProps {
  itemCount: number;
  subtotal: number;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
}

/**
 * @file checkout-button.tsx
 * @description 장바구니에서 체크아웃 페이지로 이동하는 결제 버튼
 *
 * 장바구니 페이지의 "결제 진행하기" 버튼 컴포넌트입니다.
 * 클릭 시 체크아웃 페이지로 이동하며, 결제 관련 로그를 남깁니다.
 */
export function CheckoutButton({
  itemCount,
  subtotal,
  className,
  size = "lg",
  variant = "default",
}: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    console.group("[cart] 결제 진행하기 클릭");
    console.log("장바구니 상품 수", itemCount);
    console.log("총 결제 금액", subtotal);
    console.log("체크아웃 페이지로 이동");
    console.groupEnd();
  };

  return (
    <Button
      asChild
      size={size}
      variant={variant}
      className={className}
      data-testid="checkout-button"
      disabled={isPending}
    >
      <Link href="/checkout" onClick={handleClick}>
        {isPending ? "이동 중..." : "결제 진행하기"}
      </Link>
    </Button>
  );
}

