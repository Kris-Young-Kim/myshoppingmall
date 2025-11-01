import { createClient } from "@supabase/supabase-js";
import type {
  ProductDetail,
  ProductFilterParams,
  ProductSummary,
} from "@/types/product";

/**
 * @file products.ts
 * @description Supabase에서 상품 데이터를 조회하기 위한 서버 전용 쿼리 모듈입니다.
 *
 * 모든 함수는 Server Component 또는 Server Action에서 사용되는 것을 가정하며,
 * Clerk 세션을 기반으로 한 Supabase 인증을 사용합니다. Phase 2 구현 단계에서
 * 실제 쿼리 로직과 필터링/정렬 기능을 채워넣게 됩니다.
 *
 * 노출 함수:
 * 1. `fetchProductSummaries` – 리스트 화면용 상품 요약 정보 조회
 * 2. `fetchProductDetail` – 상품 상세 정보 조회
 * 3. `fetchProductCategories` – 사용 가능한 카테고리 목록 조회
 */

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  gallery_images?: string[] | null;
  highlight_tags?: string[] | null;
}

const DEFAULT_LIMIT = 20;

type NormalizedParams = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: "created_at" | "price";
  sortDirection: "asc" | "desc";
  limit: number;
  offset: number;
};

function transformRowToSummary(row: ProductRow): ProductSummary {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    stockQuantity: row.stock_quantity,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function transformRowToDetail(row: ProductRow): ProductDetail {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    stockQuantity: row.stock_quantity,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    galleryImages: row.gallery_images ?? undefined,
    highlightTags: row.highlight_tags ?? undefined,
  };
}

function normalizeParams(params: ProductFilterParams): NormalizedParams {
  const limit = params.limit && params.limit > 0 ? params.limit : DEFAULT_LIMIT;
  const offset = params.offset && params.offset > 0 ? params.offset : 0;

  return {
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sortBy: params.sortBy ?? "created_at",
    sortDirection: params.sortDirection ?? "desc",
    limit,
    offset,
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchProductSummaries(
  params: ProductFilterParams = {},
): Promise<ProductSummary[]> {
  const normalized = normalizeParams(params);

  console.group("[products] fetchProductSummaries");
  console.log("입력 파라미터", normalized);

  let query = supabase
    .from("products")
    .select(
      "id, name, description, price, category, stock_quantity, is_active, created_at, updated_at",
    )
    .eq("is_active", true);

  if (normalized.category) {
    query = query.eq("category", normalized.category);
  }
  if (typeof normalized.minPrice === "number") {
    query = query.gte("price", normalized.minPrice);
  }
  if (typeof normalized.maxPrice === "number") {
    query = query.lte("price", normalized.maxPrice);
  }

  query = query
    .order(normalized.sortBy, { ascending: normalized.sortDirection === "asc" })
    .range(normalized.offset, normalized.offset + normalized.limit - 1);

  const { data, error } = await query;

  if (error) {
    if (error.code === "PGRST205") {
      console.warn("[products] products 테이블이 존재하지 않습니다. 빈 배열을 반환합니다.", error);
      console.groupEnd();
      return [];
    }

    console.error("상품 목록 조회 실패", error);
    console.groupEnd();
    throw error;
  }

  const summaries = (data ?? []).map(transformRowToSummary);
  console.log("조회된 상품 수", summaries.length);
  console.groupEnd();
  return summaries;
}

export async function fetchProductDetail(
  productId: string,
): Promise<ProductDetail | null> {

  console.group("[products] fetchProductDetail");
  console.log("productId", productId);

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, category, stock_quantity, is_active, created_at, updated_at, gallery_images, highlight_tags",
    )
    .eq("id", productId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      console.warn("[products] 상품을 찾을 수 없습니다.", { productId });
      console.groupEnd();
      return null;
    }

    console.error("상품 상세 조회 실패", error);
    console.groupEnd();
    throw error;
  }

  if (!data || !data.is_active) {
    console.log("상품이 존재하지 않거나 비활성 상태", productId);
    console.groupEnd();
    return null;
  }

  const detail = transformRowToDetail(data as ProductRow);
  console.log("조회된 상품 이름", detail.name);
  console.groupEnd();
  return detail;
}

export async function fetchProductCategories(): Promise<string[]> {

  console.group("[products] fetchProductCategories");

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true);

  if (error) {
    if (error.code === "PGRST205") {
      console.warn("[products] products 테이블 없음. 기본 카테고리 반환", error);
      console.groupEnd();
      return [];
    }

    console.error("카테고리 조회 실패", error);
    console.groupEnd();
    throw error;
  }

  const categories = Array.from(
    new Set((data ?? []).map((row) => row.category).filter(Boolean)),
  ).sort();

  console.log("활성 카테고리 수", categories.length);
  console.groupEnd();
  return categories;
}

