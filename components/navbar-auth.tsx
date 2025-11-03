"use client";

import { useEffect, useState } from "react";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * @file navbar-auth.tsx
 * @description Navbar의 인증 관련 UI (로그인 버튼 / 사용자 버튼)
 * 
 * 이 컴포넌트는 클라이언트 컴포넌트로 분리하여 Clerk의 SignedOut/SignedIn을 사용합니다.
 * Hydration Mismatch를 방지하기 위해 마운트 후에만 Clerk 컴포넌트를 렌더링합니다.
 */
export function NavbarAuth() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // 서버 렌더링 및 초기 클라이언트 렌더링 시에는 로그인 버튼 플레이스홀더 표시
    return (
      <div className="flex items-center gap-3">
        <Button size="sm" disabled>
          로그인
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="sm">로그인</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

