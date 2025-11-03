'use client';

import { useEffect, useState, useTransition, type ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { addToCartAction } from '@/actions/cart';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
}

const RESET_BADGE_TIMEOUT = 2500;

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  variant = "default",
  size = "sm",
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isClicked, setIsClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isClicked) return;

    const timeout = setTimeout(() => {
      setIsClicked(false);
    }, RESET_BADGE_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [isClicked]);

  const handleClick = () => {
    startTransition(async () => {
      try {
        await addToCartAction({ productId, quantity });
        setIsClicked(true);
        setErrorMessage(null);
        toast({
          title: "장바구니에 추가되었습니다",
          description: "장바구니 페이지에서 확인할 수 있어요.",
        });
      } catch (error) {
        console.error('[cart] add failed', error);
        const errorMsg = '장바구니 담기에 실패했어요. 다시 시도해 주세요.';
        setErrorMessage(errorMsg);
        toast({
          title: "장바구니 담기 실패",
          description: errorMsg,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div
      className="flex flex-col items-stretch gap-1"
      aria-live="polite"
      data-testid="add-to-cart-container"
    >
      <Button
        size={size}
        variant={isClicked ? 'outline' : variant}
        onClick={handleClick}
        disabled={isPending}
        className={className}
        data-testid="add-to-cart-button"
      >
        {isPending ? '담는 중…' : isClicked ? '장바구니에 담겼어요!' : '장바구니 담기'}
      </Button>
      {errorMessage && (
        <span className="text-xs text-rose-500">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export default AddToCartButton;

