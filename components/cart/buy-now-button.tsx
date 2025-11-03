"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart";
import { useToast } from "@/hooks/use-toast";
import type { ComponentProps } from "react";

interface BuyNowButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
}

/**
 * @file buy-now-button.tsx
 * @description 바로 구매 버튼 - 장바구니에 추가 후 체크아웃 페이지로 이동
 * 
 * 주요 기능:
 * 1. 상품을 장바구니에 추가
 * 2. 체크아웃 페이지로 리다이렉트
 * 3. 체크아웃 페이지에서 Toss Payments 결제위젯을 통해 결제 진행
 */
export function BuyNowButton({
  productId,
  quantity = 1,
  className,
  variant = "outline",
  size = "lg",
}: BuyNowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleClick = () => {
    console.group("[buy-now] 바로 구매 시작");
    console.log("productId", productId);
    console.log("quantity", quantity);

    startTransition(async () => {
      try {
        // 1. 장바구니에 상품 추가
        await addToCartAction({ productId, quantity });
        
        console.log("[buy-now] 장바구니 추가 완료, 체크아웃 페이지로 이동");
        console.groupEnd();

        toast({
          title: "장바구니에 추가되었습니다",
          description: "결제 페이지로 이동합니다.",
        });

        // 2. 체크아웃 페이지로 이동
        router.push("/checkout");
      } catch (error) {
        console.error("[buy-now] 실패", error);
        console.groupEnd();
        toast({
          title: "바로 구매 실패",
          description: error instanceof Error ? error.message : "다시 시도해 주세요.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      <ShoppingCart className="h-4 w-4" />
      {isPending ? "처리 중..." : "바로 구매"}
    </Button>
  );
}

