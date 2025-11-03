import Link from "next/link";
import React from "react";
import { NavbarAuth } from "./navbar-auth";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/products", label: "상품" },
  { href: "/cart", label: "장바구니" },
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
      <NavbarAuth />
    </header>
  );
};

export default Navbar;
