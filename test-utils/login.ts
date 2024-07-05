import { expect, Page } from "@playwright/test";
import { loadPage } from "../tests/example.spec";
import { env } from "../env";

export async function login(page: Page) {
  await loadPage(page);
  await page.getByRole("link", { name: "Log In" }).click();
  await page.locator("#input_field_p_email_email").fill(env.playwrightEmail!);
  await page.locator("#id_register_email_button").click();
  await page.waitForSelector('input[type="password"]');
  await page.locator('input[type="password"]').fill(env.playwrightPassword!);
  await page
    .locator("button.kui-button--primary.kui-button--full-width")
    .click();

  await page.waitForLoadState("domcontentloaded");
  const userFile = "playwright/.auth/user.json";
  await page.context().storageState({ path: userFile });
  await page.waitForLoadState("domcontentloaded");
  await expect(page).toHaveURL(new RegExp(`${env.baseUrl}.*/home/page`));
}
