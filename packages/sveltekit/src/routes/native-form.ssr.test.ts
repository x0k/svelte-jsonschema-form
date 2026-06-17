import type { Page } from "@sveltejs/kit";
import { render } from "svelte/server";
import { describe, expect, it, vi } from "vitest";

import type { InitialFormData, ValidatedFormData } from "$lib/model.js";

// https://github.com/sveltejs/svelte/issues/16832
const mockGetPage = vi.fn();
vi.mock("$app/state", () => ({
  get page() {
    return mockGetPage();
  },
}));

const m = await import("./native-form.svelte");

function renderForm(page: Partial<Page>) {
  mockGetPage.mockReturnValue(page);
  return render(m.default);
}

describe("native form SSR", () => {
  it("should render initial values", async () => {
    const { body } = renderForm({
      data: {
        form: {
          schema: { title: "Schema title", type: "string" },
          initialValue: "initial value",
          initialErrors: [
            {
              path: [],
              message: "error message",
            },
          ],
        } satisfies InitialFormData,
      },
    });
    expect(body).toContain("Schema title");
    expect(body).toContain("initial value");
    expect(body).toContain("error message");
  });
  it("should render action result", async () => {
    const { body } = renderForm({
      data: {
        form: {
          schema: { title: "Schema title", type: "string" },
          initialValue: "initial value",
          initialErrors: [
            {
              path: [],
              message: "error message",
            },
          ],
        } satisfies InitialFormData,
      },
      form: {
        form: {
          idPrefix: "root",
          isValid: false,
          data: "validated value",
          errors: [
            {
              path: [],
              message: "validation error message",
            },
          ],
          updateData: true,
        } satisfies ValidatedFormData<string, true>,
      },
    });
    expect(body).toContain("Schema title");
    expect(body).toContain("validated value");
    expect(body).toContain("validation error message");
  });
  it("should display the initial values if the validation was successful", async () => {
    const { body } = renderForm({
      data: {
        form: {
          schema: { title: "Schema title", type: "string" },
          initialValue: "initial value",
          initialErrors: [
            {
              path: [],
              message: "error message",
            },
          ],
        } satisfies InitialFormData,
      },
      form: {
        form: {
          idPrefix: "root",
          isValid: true,
          data: "validated value",
          errors: [
            {
              path: [],
              message: "validation error message",
            },
          ],
          updateData: false,
        } satisfies ValidatedFormData<string, true>,
      },
    });
    expect(body).toContain("Schema title");
    expect(body).toContain("initial value");
    expect(body).toContain("error message");
  });
});
