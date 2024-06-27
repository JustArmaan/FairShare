import { test, expect, Page, BrowserContext } from "@playwright/test";
import { env } from "../env";
import { createUser, findUser } from "../src/server/services/user.service";

async function loadPage(page: Page) {
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

// Sign up test with confirmation code is not possible because the confirmation code is sent to the email
test("sign up", async ({ page }) => {
  await loadPage(page);
  await page.getByRole("link", { name: "Register" }).click();
  await page.locator("#input_field_p_first_name_first_name").fill("Fairshare");
  await page.locator("#input_field_p_last_name_last_name").fill("Share");
  await page
    .locator("#input_field_p_email_email")
    .fill("sharefairshare@gmail.com");
  await page.locator("#id_register_email_button").click();
  await page.locator("#input_field_p_confirmation_code_code_").fill("");
  await page.getByTestId("otp-submit-button").click();
  const userFile = "playwright/.auth/user.json";
  await page.context().storageState({ path: userFile });
  await page.waitForLoadState("domcontentloaded");
  await expect(
    page.getByRole("button", { name: "Click to get started" })
  ).toBeVisible();
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
