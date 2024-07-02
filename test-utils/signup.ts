import { loadPage } from "../tests/example.spec";
import { Page, expect } from "@playwright/test";
import { env } from "../env";
import { getConfirmationCodeFromEmail } from "./emailConfirmation";

export async function signup(page: Page) {
     await loadPage(page);
     await page.getByRole("link", { name: "Register" }).click();
     await page
       .locator("#input_field_p_first_name_first_name")
       .fill("Fairshare");
     await page.locator("#input_field_p_last_name_last_name").fill("Share");
     await page
       .locator("#input_field_p_email_email")
       .fill("sharefairshare@gmail.com");
     await page.locator("#id_register_email_button").click();

     await expect(page.getByRole("textbox", { name: "Code" })).toBeVisible();

     const confirmationCode = await getConfirmationCodeFromEmail();

     await page
       .locator("#input_field_p_confirmation_code_code_")
       .fill(confirmationCode);
     await page.getByTestId("otp-submit-button").click();

     const userFile = "playwright/.auth/user.json";
     await page.context().storageState({ path: userFile });
     await page.waitForLoadState("domcontentloaded");

     await page
       .locator("#input_field_p_first_password_password")
       .fill(env.playwrightPassword!);
     await page
       .locator("#input_field_p_second_password_confirm_password")
       .fill(env.playwrightPassword!);

     await page
       .locator("button.kui-button.kui-button--primary.kui-button--full-width")
       .click();

     await expect(
       page.getByRole("button", { name: "Click to get started" })
     ).toBeVisible();
}