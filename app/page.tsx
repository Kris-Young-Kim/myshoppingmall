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
      description:
        "Toss Payments 연동으로 빠르고 안전하게 예약을 완료할 수 있어요.",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-sky-900 via-sky-700 to-indigo-900 px-8 py-16 text-white shadow-xl">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.5fr,1fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
              <Compass className="h-4 w-4" /> 민투어 추천 여행
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                지금 떠나고 싶은 여행지, 민투어가 더 설레게 만들어 드릴게요
              </h1>
              <p className="text-base leading-7 text-white/80 md:text-lg">
                계절별 특가와 맞춤 추천으로 완성한 여행 컬렉션. 원하는 여정을
                고르면, 항공·숙소·현지 투어까지 한 번에 확인할 수 있습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-white text-sky-900 hover:bg-white/90"
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
                className="border-white/40 text-white hover:bg-white/10"
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
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/90 transition hover:border-white/70 hover:bg-white/20"
                >
                  <Flame className="h-3.5 w-3.5" />
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {promiseHighlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur transition hover:border-white/40 hover:bg-white/20"
              >
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <Icon className="h-5 w-5" />
                  {title}
                </div>
                <p className="mt-2 text-sm text-white/80">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
              <Flame className="h-6 w-6 text-orange-500" /> HOT SALE
            </h2>
            <p className="text-sm text-muted-foreground">
              지금 예약하면 더 큰 혜택을 받을 수 있는 시즌 특가 상품이에요.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
          >
            전체 상품 보기
          </Link>
        </div>

        <CategoryFilter categories={categoryList} basePath="/products" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.length > 0 ? (
            featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-muted-foreground/30 p-10 text-center text-muted-foreground">
              현재 등록된 HOT SALE 상품이 없습니다. Supabase 콘솔에서 상품을
              추가해보세요.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            민투어 인기 여행 테마
          </h2>
          <p className="text-sm text-muted-foreground">
            테마별 추천 상품을 빠르게 둘러보세요.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "미식 투어",
              description: "현지 맛집 투어와 쿠킹 클래스로 가득한 미식 여행",
              href: "/products?tags=gourmet",
              accent: "from-pink-500 via-red-400 to-amber-400",
            },
            {
              title: "아트 & 힐링",
              description:
                "전시 관람과 온천 스파가 함께하는 여유로운 여성 여행",
              href: "/products?tags=healing",
              accent: "from-sky-500 via-blue-500 to-indigo-500",
            },
            {
              title: "가족 맞춤",
              description: "아이와 함께 즐기는 테마파크 & 체험형 여행",
              href: "/products?tags=family",
              accent: "from-emerald-400 via-lime-400 to-teal-500",
            },
          ].map((theme) => (
            <Link
              key={theme.title}
              href={theme.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20",
                  `bg-gradient-to-br ${theme.accent}`,
                )}
              />
              <div className="relative space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700">
                  여행 테마
                </span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {theme.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {theme.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  테마 상품 보기
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {trending.length > 0 && (
        <section className="space-y-6">
          <header className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              이번 주 인기 상품
            </h2>
            <p className="text-sm text-muted-foreground">
              최근 업데이트된 상품을 그리드로 한눈에 살펴보세요.
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
