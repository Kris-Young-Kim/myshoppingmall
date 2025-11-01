'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { addToCartAction } from '@/actions/cart';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
}

export function AddToCartButton({ productId, quantity = 1 }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      try {
        await addToCartAction({ productId, quantity });
        setIsClicked(true);
      } catch (error) {
        console.error('[cart] add failed', error);
      }
    });
  };

  return (
    <Button size="sm" variant={isClicked ? 'outline' : 'default'} onClick={handleClick} disabled={isPending}>
      {isPending ? '담는 중...' : isClicked ? '담김!' : '장바구니 담기'}
    </Button>
  );
}

export default AddToCartButton;

