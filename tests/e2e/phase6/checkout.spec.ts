import { test, expect } from "@playwright/test";

const clerkEmail = process.env.CLERK_TEST_EMAIL;
const clerkPassword = process.env.CLERK_TEST_PASSWORD;

test.describe("Phase 6 · 핵심 사용자 시나리오", () => {
  test.skip(!clerkEmail || !clerkPassword, "CLERK_TEST_EMAIL / CLERK_TEST_PASSWORD 환경변수가 필요합니다.");

  test("로그인 후 상품을 장바구니에 담고 체크아웃 페이지까지 이동한다", async ({ page }) => {
    test.slow();

    await test.step("Clerk 로그인", async () => {
      await page.goto("/sign-in?redirect_url=/");

      const identifierInput = page.locator('input[name="identifier"], input[type="email"]').first();
      await expect(identifierInput).toBeVisible();
      await identifierInput.fill(clerkEmail!);

      const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
      await expect(passwordInput).toBeVisible();
      await passwordInput.fill(clerkPassword!);

      await Promise.all([
        page.waitForURL("**/", { timeout: 15_000 }),
        page.getByRole("button", { name: /로그인|sign in/i }).click(),
      ]);
    });

    await test.step("장바구니 초기화", async () => {
      await page.goto("/cart");

      const hasItems = await page.locator('[data-testid="cart-item"]').first().isVisible().catch(() => false);
      if (!hasItems) {
        return;
      }

      while (await page.locator('[data-testid="cart-item"]').count()) {
        await page.locator('[data-testid="cart-item"]').first().getByRole("button", { name: "삭제" }).click();
        await page.waitForTimeout(500);
      }
    });

    let productName = "";

    await test.step("상품 상세 진입 및 장바구니 추가", async () => {
      await page.goto("/");

      const productCard = page.locator('[data-testid="product-card"]').first();
      await expect(productCard).toBeVisible();

      productName = (await productCard.locator("a").first().innerText()).trim();

      await productCard.locator("a").first().click();

      await expect(page).toHaveURL(/\/products\//);

      const addToCartButton = page.getByTestId("add-to-cart-button");
      await expect(addToCartButton).toBeVisible();
      await addToCartButton.click();

      await expect(addToCartButton).toHaveText(/담겼어요/);
    });

    await test.step("장바구니와 체크아웃 페이지 확인", async () => {
      await page.goto("/cart");

      const cartItem = page.locator('[data-testid="cart-item"]').filter({ hasText: productName });
      await expect(cartItem).toBeVisible();

      await page.getByRole("link", { name: "결제 진행하기" }).click();
      await expect(page).toHaveURL(/\/checkout$/);

      await expect(page.getByRole("heading", { name: "주문 정보 입력" })).toBeVisible();
      await expect(page.getByLabel("받는 분")).toBeVisible();
      await expect(page.getByRole("button", { name: "주문 신청하기" })).toBeEnabled();
    });

    await test.step("수동 입금 안내 확인", async () => {
      await page.getByLabel("받는 분").fill("테스트 사용자");
      await page.getByLabel("연락처").fill("010-1111-2222");
      await page.getByLabel("우편번호").fill("12345");
      await page.getByLabel("기본 주소").fill("서울특별시 테스트구 테스트로 1");

      await page.getByRole("button", { name: "주문 신청하기" }).click();

      await expect(page).toHaveURL(/\/payments\/manual/);
      await expect(page.getByRole("heading", { name: "주문이 접수되었습니다" })).toBeVisible();
      await expect(page.getByText("입금 계좌")).toBeVisible();
    });
  });
});

