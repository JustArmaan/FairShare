import { chromium } from "playwright";
import { env } from "../env";

export async function getConfirmationCodeFromEmail() {
  const emailBrowser = await chromium.launch();
  const emailPage = await emailBrowser.newPage();
  await emailPage.goto("https://mail.google.com");

  await emailPage.locator('input[type="email"]').fill(env.playwrightEmail!);
  await emailPage.locator("#identifierNext").click();
  await emailPage
    .locator('input[type="password"]')
    .fill(env.playwrightPassword!);
  await emailPage.locator("#passwordNext").click();

  await emailPage.waitForSelector('table[role="grid"] tbody tr');
  await emailPage.reload();

  await emailPage.waitForTimeout(4000);
  await emailPage.reload();

  const recentEmail = await emailPage
    .locator('table[role="grid"] tbody tr')
    .first();
  await recentEmail.click();

  await emailPage.waitForSelector('div[style*="font-size:40px"]');
  const emailContent = await emailPage
    .locator('div[style*="font-size:40px"]')
    .innerText();

  const confirmationCode = emailContent.trim();

  await emailBrowser.close();

  return confirmationCode;
}
