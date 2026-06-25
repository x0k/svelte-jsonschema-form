import type { Theme } from "@sjsf/form";
import { describe, expect } from "vitest";
import { type Locator } from "vitest/browser";

import {
  expectValue,
  renderFieldForm,
  setInputValueAt,
  skippableTest,
} from "./field-contract-helpers.js";
import { type ArrayFieldTestContext } from "./field-test-context.js";

async function addItem(
  ctx: ArrayFieldTestContext | undefined,
  locator: Locator
) {
  if (ctx?.addItem) {
    await ctx.addItem(locator);
  } else {
    const button = locator.getByRole("button", { name: /add/i }).first();
    await button.click();
  }
}

async function removeItem(
  ctx: ArrayFieldTestContext | undefined,
  locator: Locator,
  index: number
) {
  if (ctx?.removeItem) {
    await ctx.removeItem(locator, index);
  } else {
    const button = locator.getByRole("button", { name: /del/i }).nth(index);
    await button.click();
  }
}

export function arrayFieldContractTests(
  theme: Theme,
  ctx: ArrayFieldTestContext = {}
) {
  const test = skippableTest(ctx.skipTests);

  describe("array field contracts", () => {
    describe("add items", () => {
      test("adds item to array", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "array", items: { type: "string" } },
          initialValue: ["a"],
        });

        await addItem(ctx, screen.locator);
        expectValue(form, ["a", ""]);
      });

      test("adds item to empty array", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "array", items: { type: "string" } },
          initialValue: [],
        });

        await addItem(ctx, screen.locator);
        expectValue(form, [""]);
      });

      test("adds multiple items preserves order", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "array", items: { type: "string" } },
          initialValue: [],
        });

        await addItem(ctx, screen.locator);
        await addItem(ctx, screen.locator);
        await addItem(ctx, screen.locator);

        setInputValueAt(screen.locator, 0, "first");
        setInputValueAt(screen.locator, 1, "second");
        setInputValueAt(screen.locator, 2, "third");

        expectValue(form, ["first", "second", "third"]);
      });
    });

    describe("remove items", () => {
      test("removes item from middle", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "array", items: { type: "string" } },
          initialValue: ["a", "b", "c"],
        });

        await removeItem(ctx, screen.locator, 1);
        expectValue(form, ["a", "c"]);
      });

      test("removes first item", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "array", items: { type: "string" } },
          initialValue: ["a", "b", "c"],
        });

        await removeItem(ctx, screen.locator, 0);
        expectValue(form, ["b", "c"]);
      });

      test("removes last item", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "array", items: { type: "string" } },
          initialValue: ["a", "b", "c"],
        });

        await removeItem(ctx, screen.locator, 2);
        expectValue(form, ["a", "b"]);
      });

      test("removes only item results in empty array", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "array", items: { type: "string" } },
          initialValue: ["only"],
        });

        await removeItem(ctx, screen.locator, 0);
        expectValue(form, []);
      });
    });

    describe("fixed-length tuples", () => {
      test("renders correct number of inputs and initial values", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "array",
            items: [{ type: "string" }, { type: "number" }],
          },
          initialValue: ["first", 100],
        });

        const element = screen.locator.element();
        const inputs = Array.from(
          element.querySelectorAll('input:not([type="hidden"])')
        ) as HTMLInputElement[];
        expect(inputs.length).toBe(2);
        expect(inputs[0]?.value).toBe("first");
        expect(inputs[1]?.value).toBe("100");
        expectValue(form, ["first", 100]);
      });
    });
  });
}
