import { expect, test, type Locator } from "@playwright/test";

export interface TestRouteOptions {
  name: string;
  route: string;
  /** Native forms do full page reload; enhanced/connect use AJAX */
  native?: boolean;
}

export function defineFormTests({
  name,
  route,
  native = false,
}: TestRouteOptions) {
  test.describe(name, () => {
    let form: Locator;

    test.beforeEach(async ({ page }) => {
      await page.goto(route);
      form = page.locator("form").first();
    });

    test("renders the form", async () => {
      await expect(form).toBeVisible();
      await expect(form).toHaveAttribute("method", "POST");
      const action = await form.getAttribute("action");
      expect(action).toBeTruthy();
      await expect(form.getByLabel("First name")).toBeVisible();
      await expect(form.getByLabel("Last name")).toBeVisible();
      await expect(
        form.getByText("A customizable registration form")
      ).toBeVisible();
      await expect(
        form.getByText("A simple form with additional properties example.")
      ).toBeVisible();
    });

    test("preserves field values after validation error", async ({ page }) => {
      await form.getByLabel("First name").fill("John");

      await form.locator('button[type="submit"]').click();

      if (native) {
        await page.waitForURL(`**${route}**`);
      }

      const currentForm = native ? page.locator("form").first() : form;
      await expect(
        currentForm.getByText("must have required property").first()
      ).toBeVisible();
      await expect(currentForm.getByLabel("First name")).toHaveValue("John");
    });

    test("sends correct values to the server", async ({ page }) => {
      await form.getByLabel("First name").fill("Alice");
      await form.getByLabel("Last name").fill("Smith");

      await form.locator('button[type="submit"]').click();

      if (native) {
        await page.waitForURL(`**${route}**`);
      } else {
        await expect(form.getByLabel("First name")).toHaveValue("");
        await expect(form.getByLabel("Last name")).toHaveValue("");
      }

      const response = await page.request.get("/tests");
      const data = await response.json();
      expect(data).toEqual({ firstName: "Alice", lastName: "Smith" });
    });
  });
}
