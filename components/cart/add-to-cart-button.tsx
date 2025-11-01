'use client';

import { useEffect, useState, useTransition, type ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { addToCartAction } from '@/actions/cart';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  onAdded?: () => void;
}

const RESET_BADGE_TIMEOUT = 2500;

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  variant = "default",
  size = "sm",
  onAdded,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isClicked, setIsClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        onAdded?.();
      } catch (error) {
        console.error('[cart] add failed', error);
        setErrorMessage('장바구니 담기에 실패했어요. 다시 시도해 주세요.');
      }
    });
  };

  return (
    <div className="flex flex-col items-stretch gap-1" aria-live="polite">
      <Button
        size={size}
        variant={isClicked ? 'outline' : variant}
        onClick={handleClick}
        disabled={isPending}
        className={className}
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

