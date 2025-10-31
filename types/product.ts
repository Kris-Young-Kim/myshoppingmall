/**
 * @file product.ts
 * @description 쇼핑몰 상품, 카테고리, 필터 파라미터에 대한 타입 정의를 제공합니다.
 *
 * 이 파일은 Supabase `products` 테이블 스키마를 기준으로 작성되었으며,
 * 상품 목록/상세 페이지와 데이터 쿼리 로직에서 재사용되는 공통 타입을 제공합니다.
 *
 * 주요 타입:
 * 1. `Product` – 상품 상세 정보를 표현합니다.
 * 2. `ProductSummary` – 목록 화면에서 사용하는 최소 필드 집합입니다.
 * 3. `ProductCategory` – 쇼핑몰에서 지원하는 카테고리 문자열 유니온입니다.
 * 4. `ProductFilterParams` – 서버/클라이언트에서 공유하는 필터 파라미터 정의입니다.
 *
 * @dependencies
 * - Supabase `products` 테이블 스키마 (`supabase/migrations/update_shopping_mall_schema.sql`)
 */

export const productCategories = [
  "electronics",
  "clothing",
  "books",
  "food",
  "sports",
  "beauty",
  "home",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export const productCategoryLabels: Record<ProductCategory, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

export function getProductCategoryLabel(category: string): string {
  return productCategoryLabels[category as ProductCategory] ?? category;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory | string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductSummary = Pick<
  Product,
  | "id"
  | "name"
  | "price"
  | "category"
  | "stockQuantity"
  | "isActive"
  | "createdAt"
  | "updatedAt"
> & {
  description: string | null;
  thumbnailUrl?: string;
};

export interface ProductFilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "created_at" | "price";
  sortDirection?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface ProductDetail extends Product {
  galleryImages?: string[];
  highlightTags?: string[];
}

