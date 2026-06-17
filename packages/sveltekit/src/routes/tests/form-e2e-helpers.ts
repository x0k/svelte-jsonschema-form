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
      await expect(form.getByLabel("First name")).toHaveValue("Jane");
      await expect(form.getByLabel("Last name")).toHaveValue("Doe");

      await form.getByLabel("First name").fill("J");

      await form.locator('button[type="submit"]').click();

      if (native) {
        await page.waitForURL(`**${route}**`);
      }

      const currentForm = native ? page.locator("form").first() : form;
      await expect(
        currentForm.getByText("must NOT have fewer than 2 characters")
      ).toBeVisible();
      await expect(currentForm.getByLabel("First name")).toHaveValue("J");
      await expect(currentForm.getByLabel("Last name")).toHaveValue("Doe");
    });

    test("sends correct values to the server and resets to initial data", async ({
      page,
    }) => {
      const currentForm = native ? page.locator("form").first() : form;

      await expect(currentForm.getByLabel("First name")).toHaveValue("Jane");
      await expect(currentForm.getByLabel("Last name")).toHaveValue("Doe");

      await currentForm.getByLabel("First name").fill("Alice");
      await currentForm.getByLabel("Last name").fill("Smith");

      await currentForm.locator('button[type="submit"]').click();

      if (native) {
        await page.waitForURL(`**${route}**`);
      }

      const response = await page.request.get("/tests");
      const data = await response.json();
      expect(data).toEqual({ firstName: "Alice", lastName: "Smith" });

      const afterForm = native ? page.locator("form").first() : form;
      await expect(afterForm.getByLabel("First name")).toHaveValue("Jane");
      await expect(afterForm.getByLabel("Last name")).toHaveValue("Doe");
    });
  });
}
