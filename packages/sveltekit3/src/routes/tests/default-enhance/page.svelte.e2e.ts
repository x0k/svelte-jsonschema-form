import { expect, test } from "@playwright/test";

/**
 * The default `enhance` fallback, with no callback to defer to.
 *
 * Kit resets the form it attached to once a submission succeeds, so the reset
 * has to reach the form the user can see. `connect()` submits through a hidden
 * form of its own whose inputs are wire fields, not the user's, so forwarding
 * the reset means running ahead of Kit's own `reset` listener and keeping it
 * from re-reading those fields as the form value.
 */
test.describe("connect() with the default enhance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/default-enhance");
    // Clicking before hydration leaves the form with its native submit, so the
    // page reloads instead of enhancing, and the assertions race the
    // navigation.
    await page.waitForLoadState("networkidle");
  });

  test("submits the current values", async ({ page }) => {
    const form = page.locator("form").first();
    await expect(form.getByLabel("First name")).toHaveValue("Jane");

    await form.getByLabel("First name").fill("Default");
    await form.getByLabel("Last name").fill("Enhance");
    await form.locator('button[type="submit"]').click();

    await expect
      .poll(async () =>
        (await page.request.get("/tests?firstName=Default")).json()
      )
      .toMatchObject({ firstName: "Default", lastName: "Enhance" });
  });

  test("resets to the initial data once the submission succeeds", async ({
    page,
  }) => {
    const form = page.locator("form").first();

    await form.getByLabel("First name").fill("Submitted");
    await form.getByLabel("Last name").fill("Values");
    await form.locator('button[type="submit"]').click();

    await expect
      .poll(async () =>
        (await page.request.get("/tests?firstName=Submitted")).json()
      )
      .toMatchObject({ firstName: "Submitted", lastName: "Values" });

    // Kit resets the form it attached to after a successful submission, so the
    // visible form goes back to its initial data without any `enhance` callback.
    await expect(form.getByLabel("First name")).toHaveValue("Jane");
    await expect(form.getByLabel("Last name")).toHaveValue("Doe");
  });

  test("does not read its own wire fields back as the form value", async ({
    page,
  }) => {
    const form = page.locator("form").first();

    await form.getByLabel("First name").fill("Wire");
    await form.getByLabel("Last name").fill("Fields");
    await form.locator('button[type="submit"]').click();

    await expect
      .poll(async () =>
        (await page.request.get("/tests?firstName=Wire")).json()
      )
      .toMatchObject({ firstName: "Wire", lastName: "Fields" });

    // The regression this guards: Kit's `reset` listener read the hidden form
    // back with `new FormData(form)` after an `await tick()`, so its inputs
    // became the form value and emptied the visible ones while the state still
    // held the submission. Resetting to the initial data above means those keys
    // never reached the visible form.
    const value = await form.getByLabel("First name").inputValue();
    expect(value).not.toContain("__sjsf");
  });

  test("keeps the values when validation fails", async ({ page }) => {
    const form = page.locator("form").first();

    // The initial data requires at least two characters
    await form.getByLabel("First name").fill("J");
    await form.locator('button[type="submit"]').click();

    await expect(
      form.getByText("must NOT have fewer than 2 characters")
    ).toBeVisible();
    await expect(form.getByLabel("First name")).toHaveValue("J");
    await expect(form.getByLabel("Last name")).toHaveValue("Doe");
  });
});
