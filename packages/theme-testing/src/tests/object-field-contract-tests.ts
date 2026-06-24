import type { Theme } from "@sjsf/form";
import { describe, expect } from "vitest";

import {
  expectValue,
  renderFieldForm,
  setInputValue,
  setInputValueAt,
  skippableTest,
} from "./field-contract-core.js";
import { type ObjectFieldTestContext } from "./field-core.js";

export function objectFieldContractTests(
  theme: Theme,
  ctx: ObjectFieldTestContext = {}
) {
  const test = skippableTest(ctx.skipTests);

  describe("object field contracts", () => {
    describe("child input interaction", () => {
      test("typing in child field updates form value", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
          },
          initialValue: { name: "Alice" },
        });

        setInputValue(screen.locator, "Bob");
        expectValue(form, { name: "Bob" });
      });
    });

    describe("required properties", () => {
      test("renders error for missing required property", async () => {
        const { screen } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            required: ["name"],
          },
          initialErrors: [{ path: ["name"], message: "name is required" }],
        });

        await expect
          .element(screen.getByText("name is required"))
          .toBeInTheDocument();
      });
    });

    describe("additionalProperties", () => {
      test("renders initial additional property values", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            additionalProperties: { type: "string" },
          },
          initialValue: { name: "Alice", customField: "customValue" },
        });

        const element = screen.locator.element();
        const inputs = Array.from(
          element.querySelectorAll('input:not([type="hidden"])')
        ) as HTMLInputElement[];
        expect(inputs.length).toBe(3);
        expect(inputs[0]?.value).toBe("Alice");
        expect(inputs[1]?.value).toBe("customField");
        expect(inputs[2]?.value).toBe("customValue");
        expectValue(form, { name: "Alice", customField: "customValue" });
      });

      test("typing in additional property input updates form value", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            additionalProperties: { type: "string" },
          },
          initialValue: { name: "Alice", customField: "oldValue" },
        });

        setInputValueAt(screen.locator, 2, "newValue");
        expectValue(form, { name: "Alice", customField: "newValue" });
      });
    });
  });
}
