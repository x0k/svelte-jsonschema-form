import type { Theme } from "@sjsf/form";
import { getValueSnapshot } from "@sjsf/form";
import { describe, expect } from "vitest";
import { type Locator } from "vitest/browser";

import { renderFieldForm, skippableTest } from "./field-contract-core.js";
import { type CombinationFieldTestContext } from "./field-core.js";
import {
  ambiguousSchema,
  discriminatedSchema,
  discriminatedUiSchema,
  plainOneOfSchema,
} from "./test-data/combination-defaults.js";

async function doSelect(
  ctx: CombinationFieldTestContext | undefined,
  locator: Locator,
  label: string
) {
  if (ctx?.selectOption) {
    await ctx.selectOption(locator, label);
  } else {
    const selector = locator.getByRole("combobox").first();
    const select = selector.element() as HTMLSelectElement;
    const option = Array.from(select.options).find(
      (o) => o.textContent?.trim() === label
    );
    expect(option).toBeDefined();
    await selector.selectOptions(option!.value);
  }
}

async function doAssertSelected(
  ctx: CombinationFieldTestContext | undefined,
  locator: Locator,
  label: string
) {
  if (ctx?.assertSelectedOption) {
    await ctx.assertSelectedOption(locator, label);
  } else {
    const selector = locator.getByRole("combobox").first();
    const select = selector.element() as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).some(
      (o) => o.textContent?.trim() === label
    );
    expect(selected).toBe(true);
  }
}

async function doAssertLabels(
  ctx: CombinationFieldTestContext | undefined,
  locator: Locator,
  labels: string[]
) {
  if (ctx?.assertOptionLabels) {
    await ctx.assertOptionLabels(locator, labels);
  } else {
    const selector = locator.getByRole("combobox").first();
    for (const label of labels) {
      await expect
        .element(selector.getByRole("option", { name: label }))
        .toBeInTheDocument();
    }
  }
}

export function combinationFieldContractTests(
  theme: Theme,
  ctx: CombinationFieldTestContext = {}
) {
  const test = skippableTest(ctx.skipTests);

  describe("combination field contracts", () => {
    describe("discriminated oneOf", () => {
      test("selects initial option from discriminator value", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: { kind: "company", shared: "kept" },
        });

        await doAssertSelected(ctx, screen.locator, "Company kind");
        const val = getValueSnapshot(form) as any;
        expect(val.kind).toBe("company");
        expect(val.shared).toBe("kept");
      });

      test("switch from person to company", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: {
            kind: "person",
            name: "Grace",
            shared: "kept",
          },
        });

        await doSelect(ctx, screen.locator, "Company kind");
        await doAssertSelected(ctx, screen.locator, "Company kind");
        const val = getValueSnapshot(form) as any;
        expect(val.kind).toBe("company");
        expect(val.companyName).toBeDefined();
        expect(val.shared).toBe("kept");
      });
    });

    describe("ambiguous oneOf", () => {
      test("selects first option by default", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: ambiguousSchema,
        });

        await doAssertSelected(ctx, screen.locator, "String branch");
        const val = getValueSnapshot(form) as any;
        expect(val.shared).toBe("string-default");
      });
    });

    describe("plain oneOf", () => {
      test("renders first option by default", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: plainOneOfSchema,
        });

        await doAssertSelected(ctx, screen.locator, "First");
        const val = getValueSnapshot(form) as any;
        expect(val.firstField).toBe("default-first");
      });

      test("switch to second option", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: plainOneOfSchema,
        });

        await doSelect(ctx, screen.locator, "Second");
        await doAssertSelected(ctx, screen.locator, "Second");
        const val = getValueSnapshot(form) as any;
        expect(val.secondField).toBeDefined();
      });
    });

    describe("option labels", () => {
      test("shows correct option labels", async () => {
        const { screen } = renderFieldForm(ctx, {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
        });

        await doAssertLabels(ctx, screen.locator, [
          "Person from UI",
          "Company kind",
        ]);
      });
    });
  });
}
