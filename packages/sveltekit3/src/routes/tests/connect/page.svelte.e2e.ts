import { expect, test } from "@playwright/test";

import { defineFormTests } from "../form-e2e-helpers.js";

defineFormTests({
  name: "connect() remote form",
  route: "/tests/connect",
});

test.describe("connect() file upload", () => {
  test("submits a File alongside the other fields", async ({ page }) => {
    await page.goto("/tests/connect");
    // Clicking before hydration leaves the form with its native submit, so the
    // page reloads instead of enhancing, and the assertions race the
    // navigation.
    await page.waitForLoadState("networkidle");

    const form = page.locator("form").first();
    await expect(form.getByLabel("First name")).toHaveValue("Jane");

    // A real `<input type="file">`, so the submitted value holds a `File` and
    // the replacer has to inject a hidden file input for Kit to read back
    await form.getByLabel("Native file").setInputFiles({
      name: "avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from("not-really-a-png"),
    });

    await form.getByLabel("First name").fill("Uploads");
    await form.getByLabel("Last name").fill("WithFile");
    await form.locator('button[type="submit"]').click();

    // The values here have to be unique to this test — otherwise a previous
    // test's payload would satisfy the assertion even if this submission was
    // rejected. Kit v3 rejects the whole submission with
    // `form_field_unbound` unless every field name ends with `/{formId}`, the
    // injected file input included.
    await expect
      .poll(async () =>
        (await page.request.get("/tests?firstName=Uploads")).json()
      )
      .toMatchObject({
        firstName: "Uploads",
        lastName: "WithFile",
        nativeFile: { name: "avatar.png", type: "image/png" },
      });
  });
});
