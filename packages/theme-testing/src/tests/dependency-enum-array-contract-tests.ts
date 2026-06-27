import type { Theme } from "@sjsf/form";
import {
  createFormMerger,
  type FormMergerOptions,
} from "@sjsf/form/mergers/modern";
import { describe, expect } from "vitest";
import { type Locator } from "vitest/browser";

import {
  doSelect,
  expectValue,
  renderFieldForm,
  skippableTest,
} from "./field-contract-helpers.js";
import { type CombinationFieldTestContext } from "./field-test-context.js";
import {
  checkboxDepsSchema,
  checkboxDepsUiSchema,
  selectDepsSchema,
  selectDepsUiSchema,
} from "./test-data/dependency-enum-array-defaults.js";

function clickArrayCheckboxByLabel(formLocator: Locator, label: string) {
  const form = formLocator.element();
  const labels = form.querySelectorAll(
    "label, [role='checkbox'] + span, [role='switch'] + span"
  );
  let checkbox: HTMLElement | undefined;
  for (const el of labels) {
    if (el.textContent?.trim() === label) {
      const container = el.closest("div");
      checkbox =
        container?.querySelector(
          'input[type="checkbox"], button[role="checkbox"], button[role="switch"]'
        ) ?? undefined;
      break;
    }
  }
  if (!checkbox) {
    const allCheckboxes = form.querySelectorAll(
      'input[type="checkbox"], button[role="checkbox"], button[role="switch"]'
    );
    for (const cb of allCheckboxes) {
      const cbLabel = cb
        .closest("div")
        ?.querySelector("label")
        ?.textContent?.trim();
      if (cbLabel === label) {
        checkbox = cb as HTMLElement;
        break;
      }
    }
  }
  expect(
    checkbox,
    `Expected to find checkbox with label "${label}"`
  ).toBeDefined();
  checkbox!.click();
}

export function dependencyEnumArrayContractTests(
  theme: Theme,
  ctx: CombinationFieldTestContext & {
    toggleCheckbox: (locator: Locator) => Promise<void>;
  }
) {
  const test = skippableTest(ctx.skipTests);

  describe("dependency enum array contracts", () => {
    test("should remove enum values in array when dependency switches", async () => {
      const { screen, form } = renderFieldForm(ctx, {
        theme,
        schema: checkboxDepsSchema,
        uiSchema: checkboxDepsUiSchema,
        initialValue: { opt: false },
      });

      // Click arr-c checkbox by label text — works regardless of theme rendering
      clickArrayCheckboxByLabel(screen.locator, "c");
      expectValue(form, { opt: false, arr: ["c"] });

      // Toggle opt to true — arr schema changes to enums ['a', 'b'].
      // Invalid enum value 'c' should be removed.
      await ctx.toggleCheckbox(screen.locator);
      expectValue(form, { opt: true, arr: [] });
    });

    test("array item defaults update when dependencies switch with mergeExtraDefaults", async () => {
      const mergerWithExperimental = (options: FormMergerOptions) =>
        createFormMerger({
          ...options,
          arrayMinItems: { mergeExtraDefaults: true },
        });

      const { screen, form } = renderFieldForm(
        {
          ...ctx,
          defaultFormOptions: {
            ...ctx.defaultFormOptions,
            merger: mergerWithExperimental,
          },
        },
        {
          theme,
          schema: selectDepsSchema,
          uiSchema: selectDepsUiSchema,
          initialValue: { select_item: "item1" },
        }
      );

      // Initial state: select_item='item1' → item_detail defaults to ['item_detail1', 'item_detail2']
      expectValue(form, {
        select_item: "item1",
        item_detail: ["item_detail1", "item_detail2"],
      });

      // Switch to item2 via combobox
      await doSelect(ctx, screen.locator, "item2");

      // item_detail should update to ['item_detail3', 'item_detail4']
      expectValue(form, {
        select_item: "item2",
        item_detail: ["item_detail3", "item_detail4"],
      });
    });
  });
}
