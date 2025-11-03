"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavbarAuth } from "./navbar-auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/products", label: "상품" },
  { href: "/cart", label: "장바구니" },
  { href: "/mypage", label: "마이페이지" },
];

/**
 * @file Navbar.tsx
 * @description GNB (Global Navigation Bar) - 전체 페이지 공통 상단 네비게이션
 */
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          민투어 샵
        </Link>
        
        {/* 데스크톱 네비게이션 */}
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
          <NavbarAuth />
          
          {/* 모바일 메뉴 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <nav className="border-t bg-white md:hidden">
          <div className="flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
