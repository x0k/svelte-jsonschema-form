import { expect, test } from "@playwright/test";

/**
 * The default `enhance` fallback, with no callback to defer to.
 *
 * It cannot restore the form afterwards: Kit's reset is guarded by
 * `isConnected`, so `connect()` has to leave the injected form detached, which
 * means Kit never resets it and never re-reads its wire fields as the form
 * value. The visible form therefore keeps what the user typed, matching the
 * state it submits from. Resetting is the caller's job, via
 * `enhance(async ({ submit }) => { if (await submit()) form.reset(); })`.
 */
test.describe("connect() with the default enhance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/default-enhance");
  });

  test("submits the current values", async ({ page }) => {
    const form = page.locator("form").first();
    await expect(form.getByLabel("First name")).toHaveValue("Jane");

    await form.getByLabel("First name").fill("Default");
    await form.getByLabel("Last name").fill("Enhance");
    await form.locator('button[type="submit"]').click();

    await expect
      .poll(async () => (await page.request.get("/tests")).json())
      .toMatchObject({ firstName: "Default", lastName: "Enhance" });
  });

  test("leaves the submitted values on screen instead of blanking", async ({
    page,
  }) => {
    const form = page.locator("form").first();

    await form.getByLabel("First name").fill("Kept");
    await form.getByLabel("Last name").fill("Visible");
    await form.locator('button[type="submit"]').click();

    await expect
      .poll(async () => (await page.request.get("/tests")).json())
      .toMatchObject({ firstName: "Kept", lastName: "Visible" });

    // The regression: Kit used to reset the injected form while it was still
    // connected, then read that form's own wire fields back as the form value,
    // which emptied these inputs while the state still held the submission.
    await expect(form.getByLabel("First name")).toHaveValue("Kept");
    await expect(form.getByLabel("Last name")).toHaveValue("Visible");
  });
});
