import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/products", label: "상품" },
  { href: "/auth-test", label: "인증 테스트" },
  { href: "/storage-test", label: "스토리지" },
  { href: "/mypage", label: "마이페이지" },
];

const Navbar = () => {
  return (
    <header className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
      <Link href="/" className="text-2xl font-bold text-gray-900">
        민투어 샵
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition-colors hover:text-gray-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
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
    </header>
  );
};

export default Navbar;
