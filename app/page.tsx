export const dynamic = "force-dynamic";

import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { Compass, Globe2, Route, Sparkle } from "lucide-react";

import { CategoryFilter } from "@/components/product/category-filter";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
  fetchProductCategories,
  fetchProductSummaries,
} from "@/lib/supabase/queries/products";
import { cn } from "@/lib/utils";
import { productCategories } from "@/types/product";

/**
 * @file page.tsx (Shop Home)
 * @description 쇼핑몰 홈 트래픽의 첫 진입점. HOT SALE 섹션과 추천 상품 캐러셀을 노출합니다.
 */

export default async function ShopHomePage() {
  console.group("[home/page] render");

  const [hotSaleProducts, categories] = await Promise.all([
    fetchProductSummaries({ limit: 9 }),
    fetchProductCategories(),
  ]);

  console.log("hotSaleProducts", hotSaleProducts.length);
  console.log("availableCategories", categories.length);
  console.groupEnd();

  const categoryList = categories.length > 0 ? categories : productCategories;
  const featured = hotSaleProducts.slice(0, 6);
  const trending = hotSaleProducts.slice(6);

  const destinationPills = [
    { label: "제주 감성 투어", href: "/products?category=travel-jeju" },
    { label: "유럽 핵심 6개국", href: "/products?category=travel-europe" },
    { label: "나만의 맞춤 자유여행", href: "/products?category=custom" },
  ];

  const promiseHighlights = [
    {
      icon: Globe2,
      title: "전 세계 120+ 도시",
      description:
        "민투어 큐레이터가 엄선한 인기 여행지를 실시간으로 업데이트합니다.",
    },
    {
      icon: Route,
      title: "맞춤 일정 설계",
      description:
        "가족 여행, 허니문, 워케이션까지 원하는 테마로 플랜을 추천해 드려요.",
    },
    {
      icon: Sparkle,
      title: "안전한 예약과 결제",
      description: "전담 매니저가 입금 확인 후 안전하게 일정을 확정해 드려요.",
    },
  ];

  return (
    <div className="relative -mx-4 space-y-20 rounded-[32px] bg-gradient-to-b from-[#050c1e] via-[#061128] to-[#030813] px-4 pb-24 pt-12 text-slate-100 shadow-[0_48px_140px_rgba(5,12,30,0.6)] sm:mx-0 sm:px-8 lg:px-12">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#101f3e] via-[#0a162d] to-[#050b18] px-8 py-16 shadow-2xl">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1680&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(90,190,255,0.18),transparent_55%)]" />
        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.5fr,1fr]">
          <div className="space-y-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              <Compass className="h-4 w-4" /> 민투어 추천 여행
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                지금 떠나고 싶은 여행지,
                <br className="hidden sm:block" />
                민투어가 네이비 밤하늘처럼
                <br className="hidden lg:block" />
                설레게 안내해요
              </h1>
              <p className="text-base leading-7 text-slate-200/85 md:text-lg">
                계절 특가와 맞춤 일정이 준비된 프리미엄 여행 컬렉션. 원하는
                여정을 선택하면 항공, 숙소, 현지 투어까지 한 번에 제안해
                드릴게요.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-full border border-transparent bg-[#7ef3d3] px-6 text-[#041024] transition hover:bg-[#6ce5c4]"
              >
                <Link href="/products">
                  지금 특가 확인하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-[#7ef3d3]/60 bg-white/5 px-6 text-[#9bf6de] transition hover:bg-white/10"
              >
                <Link href="/products?category=custom">
                  맞춤 일정 상담 받기
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {destinationPills.map((pill) => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:border-[#7ef3d3]/70 hover:bg-[#0e213f]/70"
                >
                  <Flame className="h-3.5 w-3.5 text-[#ffb76b]" />
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {promiseHighlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(10,22,45,0.35)] transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-100">
                  <Icon className="h-5 w-5 text-[#7ef3d3]" />
                  {title}
                </div>
                <p className="mt-2 text-sm text-slate-300/90">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8 rounded-[28px] border border-white/10 bg-[#0b1830]/80 p-8 shadow-[0_32px_80px_rgba(5,12,28,0.55)] backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-50">
              <Flame className="h-6 w-6 text-[#ffb76b]" /> HOT SALE
            </h2>
            <p className="text-sm text-slate-300/80">
              지금 예약하면 특별 혜택이 더해지는 시즌 한정 민투어 특가입니다.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-[#7dd6ff] underline-offset-4 transition hover:text-[#9ce6ff] hover:underline"
          >
            전체 상품 보기
          </Link>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
          <CategoryFilter categories={categoryList} basePath="/products" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.length > 0 ? (
            featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-white/30 bg-[#0f1f3f]/60 p-10 text-center text-slate-300/90">
              현재 등록된 HOT SALE 상품이 없습니다. Supabase 콘솔에서 상품을
              추가해 주세요.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-8 rounded-[28px] border border-white/8 bg-[#0a162b]/85 p-8 shadow-[0_28px_70px_rgba(4,10,24,0.5)] backdrop-blur">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-50">
            민투어 인기 여행 테마
          </h2>
          <p className="text-sm text-slate-300/85">
            다크 네이비 밤하늘 아래에서 만나보는 테마별 추천 여행 컬렉션이에요.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "미식 투어",
              description: "현지 맛집 투어와 쿠킹 클래스로 가득한 미식 여행",
              href: "/products?tags=gourmet",
              accent: "from-[#ff8fb7] via-[#ff6a95] to-[#ffb347]",
            },
            {
              title: "아트 & 힐링",
              description:
                "전시 관람과 온천 스파가 함께하는 여유로운 여성 여행",
              href: "/products?tags=healing",
              accent: "from-[#5ac8fa] via-[#3478f6] to-[#5b2df1]",
            },
            {
              title: "가족 맞춤",
              description: "아이와 함께 즐기는 테마파크 & 체험형 여행",
              href: "/products?tags=family",
              accent: "from-[#4ade80] via-[#16c784] to-[#0ea5e9]",
            },
          ].map((theme) => (
            <Link
              key={theme.title}
              href={theme.href}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1b33]/80 p-6 shadow-[0_24px_64px_rgba(6,14,34,0.55)] transition hover:-translate-y-1 hover:shadow-[0_32px_88px_rgba(10,24,52,0.65)]"
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30",
                  `bg-gradient-to-br ${theme.accent}`,
                )}
              />
              <div className="relative space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-slate-100/90">
                  여행 테마
                </span>
                <h3 className="text-xl font-semibold text-slate-50">
                  {theme.title}
                </h3>
                <p className="text-sm text-slate-300/90">{theme.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8ddcff]">
                  테마 상품 보기
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {trending.length > 0 && (
        <section className="space-y-8 rounded-[28px] border border-white/8 bg-[#071226]/85 p-8 shadow-[0_28px_72px_rgba(3,9,22,0.6)] backdrop-blur">
          <header className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-slate-50">
              이번 주 인기 여행
            </h2>
            <p className="text-sm text-slate-300/85">
              방금 업데이트된 여행 상품을 다크 네이비 그리드로 한눈에
              살펴보세요.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
