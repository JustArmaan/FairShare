import { test, expect, Page, BrowserContext } from "@playwright/test";
import { env } from "../env";
import { createUser, findUser } from "../src/server/services/user.service";
import { getConfirmationCodeFromEmail } from "../test-utils/emailConfirmation";
import { login } from "../test-utils/login";
import { signup } from "../test-utils/signup";

export async function loadPage(page: Page) {
  await page.goto(`${env.baseUrl}`);
  await page.waitForLoadState("domcontentloaded");
}

async function setCookies(context: BrowserContext) {
  await context.addCookies([
    {
      name: "testing",
      value: "true",
      url: `${env.baseUrl}`,
    },
  ]);
}

test.beforeEach(async ({ page, context }) => {
  await setCookies(context);
  const user = await findUser("test");
  if (!user) {
    await createUser({
      id: "test",
      firstName: "Fairshare",
      lastName: "test",
      email: "fairshare@test.com",
      color: "accent-blue",
    });
  }

  await page.goto(`${env.baseUrl}`);
});

test("sign up", async ({ page }) => {
  await signup(page);
});

test("login", async ({ page }) => {
  await login(page);
});

test("loginWithGoogle", async ({ page }) => {
  await loadPage(page);
  await page.getByRole("link", { name: "Log In" }).click();
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await page.waitForLoadState("load");
  await page.getByRole("link", { name: "Use another account" }).click();
  await page.waitForLoadState("domcontentloaded");
  await page.locator("#identifierId").fill(`${env.playwrightEmail}`);
  await page.locator("#identifierNext").click();
  await page.waitForSelector('input[type="password"]');
  await page
    .locator('input[type="password"]')
    .fill(`${env.playwrightPassword}`);
  await page.locator("#passwordNext").click();
  const userFile = "playwright/.auth/admin.json";
  await page.context().storageState({ path: userFile });
});

test("login and create a group", async ({ page }) => {
  await login(page);

  await page.locator('a:has(p:has-text("Groups"))').click();
  await page.waitForLoadState("domcontentloaded");

  await page.locator('button:has(span:has-text("Create New Group"))').click();
  await page.locator('input[name="groupName"]').fill("Roomates");
  await page.locator("#select-icon").click();
  await page
    .locator('button[data-category-id="./groupIcons/drink.svg"]')
    .click();
  await page.locator('button[data-color="card-red"]').click();
  await page.locator('button:has-text("Create Group")').click();

  await page.waitForSelector(
    "div.cursor-pointer.hover\\:opacity-80.transition-all.bg-primary-black"
  );
  await expect(
    page.locator(
      "div.cursor-pointer.hover\\:opacity-80.transition-all.bg-primary-black"
    )
  ).toBeVisible();
});
