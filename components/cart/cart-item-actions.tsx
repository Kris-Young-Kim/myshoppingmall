"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  updateCartItemQuantityAction,
  removeCartItemAction,
} from "@/actions/cart";
import { useToast } from "@/hooks/use-toast";

interface CartItemActionsProps {
  cartItemId: string;
  currentQuantity: number;
}

/**
 * @file cart-item-actions.tsx
 * @description 장바구니 아이템 수량 변경 및 삭제 액션 (토스트 포함)
 */
export function CartItemActions({
  cartItemId,
  currentQuantity,
}: CartItemActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleUpdateQuantity = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateCartItemQuantityAction(formData);
        toast({
          title: "수량이 변경되었습니다",
          description: "장바구니가 업데이트되었어요.",
        });
        router.refresh();
      } catch (error) {
        console.error("[cart] update quantity failed", error);
        toast({
          title: "수량 변경 실패",
          description: "다시 시도해 주세요.",
          variant: "destructive",
        });
      }
    });
  };

  const handleRemove = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await removeCartItemAction(formData);
        toast({
          title: "장바구니에서 제거되었습니다",
          description: "상품이 삭제되었어요.",
        });
        router.refresh();
      } catch (error) {
        console.error("[cart] remove failed", error);
        toast({
          title: "삭제 실패",
          description: "다시 시도해 주세요.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-3 sm:w-60">
      <form action={handleUpdateQuantity} className="flex items-center gap-2">
        <input type="hidden" name="cartItemId" value={cartItemId} />
        <label
          className="text-xs text-muted-foreground"
          htmlFor={`quantity-${cartItemId}`}
        >
          수량
        </label>
        <input
          id={`quantity-${cartItemId}`}
          name="quantity"
          type="number"
          min={0}
          defaultValue={currentQuantity}
          disabled={isPending}
          className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
        />
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          적용
        </Button>
      </form>

      <form action={handleRemove}>
        <input type="hidden" name="cartItemId" value={cartItemId} />
        <Button type="submit" variant="ghost" size="sm" disabled={isPending}>
          삭제
        </Button>
      </form>
    </div>
  );
}

