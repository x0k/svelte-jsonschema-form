import {
  BasicForm,
  createForm,
  getValueSnapshot,
  type Theme,
} from "@sjsf/form";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { type Locator } from "vitest/browser";

import * as defaults from "../lib/form-defaults.js";
import {
  type CombinationFieldTestContext,
  type CombinationTestFormOptions,
} from "./combination-field-core.js";
import {
  ambiguousSchema,
  discriminatedSchema,
  discriminatedUiSchema,
} from "./test-data/combination-defaults.js";

function renderForm(
  ctx: CombinationFieldTestContext,
  options: CombinationTestFormOptions
) {
  const target = document.body.appendChild(document.createElement("div"));
  const form = createForm({
    ...defaults,
    ...ctx.defaultFormOptions,
    ...options,
  });
  const screen = render(BasicForm, {
    target,
    context: ctx.context,
    props: { form },
  });
  return { screen, form };
}

function getCombinationSelector(locator: Locator) {
  return locator.getByRole("combobox").first();
}

async function defaultSelectOption(locator: Locator, label: string) {
  const selector = getCombinationSelector(locator);
  const select = selector.element() as HTMLSelectElement;
  const option = Array.from(select.options).find(
    (option) => option.textContent?.trim() === label
  );
  expect(option).toBeDefined();
  await selector.selectOptions(option!.value);
}

async function defaultAssertSelectedOption(locator: Locator, label: string) {
  const selector = getCombinationSelector(locator);
  const select = selector.element() as HTMLSelectElement;
  const selected = Array.from(select.selectedOptions).some(
    (option) => option.textContent?.trim() === label
  );
  expect(selected).toBe(true);
}

async function assertSelectedOption(
  screen: ReturnType<typeof render>,
  testOptions: CombinationFieldTestContext | undefined,
  label: string
) {
  await (testOptions?.assertSelectedOption ?? defaultAssertSelectedOption)(
    screen.locator,
    label
  );
}

async function defaultAssertOptionLabels(locator: Locator, labels: string[]) {
  for (const label of labels) {
    await expect
      .element(locator.getByRole("option", { name: label }))
      .toBeInTheDocument();
  }
}

async function assertOptionLabels(
  screen: ReturnType<typeof render>,
  testOptions: CombinationFieldTestContext | undefined,
  labels: string[]
) {
  await (testOptions?.assertOptionLabels ?? defaultAssertOptionLabels)(
    screen.locator,
    labels
  );
}

async function selectOption(
  screen: ReturnType<typeof render>,
  testOptions: CombinationFieldTestContext | undefined,
  label: string
) {
  await (testOptions?.selectOption ?? defaultSelectOption)(
    screen.locator,
    label
  );
}

export function combinationFieldTests(
  theme: Theme,
  ctx: CombinationFieldTestContext = {}
) {
  describe("combination fields", () => {
    test("selects initial option from discriminator value", async () => {
      const { screen, form } = renderForm(ctx, {
        theme,
        schema: discriminatedSchema,
        uiSchema: discriminatedUiSchema,
        initialValue: { kind: "company", shared: "kept" },
      });

      await assertSelectedOption(screen, ctx, "Company kind");
      expect(getValueSnapshot(form)).toEqual({
        kind: "company",
        shared: "kept",
        companyName: "Acme",
      });
    });

    test("renders current option fields after normalization", async () => {
      const { screen, form } = renderForm(ctx, {
        theme,
        schema: discriminatedSchema,
        uiSchema: discriminatedUiSchema,
        initialValue: { kind: "company", shared: "kept" },
      });

      await expect
        .element(screen.getByLabelText("Company Name"))
        .toHaveValue("Acme");
      expect(getValueSnapshot(form)).toEqual({
        kind: "company",
        shared: "kept",
        companyName: "Acme",
      });
    });

    test("keeps internally normalized object on an ambiguous option", async () => {
      const { screen, form } = renderForm(ctx, {
        theme,
        schema: ambiguousSchema,
      });

      await assertSelectedOption(screen, ctx, "String branch");
      expect(getValueSnapshot(form)).toEqual({ shared: "string-default" });
    });

    test("sanitizes previous option data when switching options", async () => {
      const { screen, form } = renderForm(ctx, {
        theme,
        schema: discriminatedSchema,
        uiSchema: discriminatedUiSchema,
        initialValue: {
          kind: "person",
          name: "Grace",
          shared: "kept",
        },
      });

      await selectOption(screen, ctx, "Company kind");
      await assertSelectedOption(screen, ctx, "Company kind");
      expect(getValueSnapshot(form)).toEqual({
        kind: "company",
        companyName: "Acme",
        shared: "kept",
      });
    });

    test("uses discriminator ui-schema titles before schema titles", async () => {
      const { screen } = renderForm(ctx, {
        theme,
        schema: discriminatedSchema,
        uiSchema: discriminatedUiSchema,
      });

      await assertOptionLabels(screen, ctx, ["Person from UI", "Company kind"]);
    });
  });
}
