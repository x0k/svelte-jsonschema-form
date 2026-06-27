import {
  createFormMerger,
  type FormMergerOptions,
} from "@sjsf/form/mergers/modern";
import { describe, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";
import {
  checkboxDepsSchema,
  checkboxDepsUiSchema,
  selectDepsSchema,
  selectDepsUiSchema,
} from "./test-data/dependency-enum-array-defaults.js";

describe("dependency enum array contracts", () => {
  test("should remove enum values in array when dependency switches", async () => {
    const { form } = await renderFieldForm({
      schema: checkboxDepsSchema,
      uiSchema: checkboxDepsUiSchema,
      initialValue: { opt: false },
    });

    await userEvent.click(page.getByRole("checkbox", { name: "c" }));
    expectValue(form, { opt: false, arr: ["c"] });

    await userEvent.click(page.getByRole("checkbox").first());
    expectValue(form, { opt: true, arr: [] });
  });

  test("array item defaults update when dependencies switch with mergeExtraDefaults", async () => {
    const mergerWithExperimental = (options: FormMergerOptions) =>
      createFormMerger({
        ...options,
        arrayMinItems: { mergeExtraDefaults: true },
      });

    const { form } = await renderFieldForm({
      merger: mergerWithExperimental,
      schema: selectDepsSchema,
      uiSchema: selectDepsUiSchema,
      initialValue: { select_item: "item1" },
    });

    expectValue(form, {
      select_item: "item1",
      item_detail: ["item_detail1", "item_detail2"],
    });

    await userEvent.selectOptions(page.getByRole("combobox").first(), "item2");

    expectValue(form, {
      select_item: "item2",
      item_detail: ["item_detail3", "item_detail4"],
    });
  });
});
