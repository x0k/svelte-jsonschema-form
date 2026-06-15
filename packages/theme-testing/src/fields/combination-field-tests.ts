import { type Theme } from "@sjsf/form";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { type Locator } from "vitest/browser";

import * as defaults from "../lib/form-defaults.js";
import {
  type CombinationFieldTestOptions,
  type CombinationTestFormOptions,
} from "./combination-field-core.js";
import {
  ambiguousSchema,
  discriminatedSchema,
  discriminatedUiSchema,
} from "./test-data/combination-defaults.js";
import TestForm from "./test-form.svelte";

function renderForm(
  options: CombinationTestFormOptions,
  testOptions?: CombinationFieldTestOptions
) {
  const target = document.body.appendChild(document.createElement("div"));
  return render(TestForm, {
    target,
    context: testOptions?.context,
    props: {
      ...defaults,
      ...testOptions?.defaultFormOptions,
      ...options,
    } as const,
  });
}

function readValue(screen: ReturnType<typeof render>): unknown {
  const text = screen.getByTestId("form-value").element().textContent;
  expect(text).toBeTruthy();
  return JSON.parse(text!);
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
  testOptions: CombinationFieldTestOptions | undefined,
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
  testOptions: CombinationFieldTestOptions | undefined,
  labels: string[]
) {
  await (testOptions?.assertOptionLabels ?? defaultAssertOptionLabels)(
    screen.locator,
    labels
  );
}

async function selectOption(
  screen: ReturnType<typeof render>,
  testOptions: CombinationFieldTestOptions | undefined,
  label: string
) {
  await (testOptions?.selectOption ?? defaultSelectOption)(
    screen.locator,
    label
  );
}

export function combinationFieldTests(
  theme: Theme,
  testOptions?: CombinationFieldTestOptions
) {
  describe("combination fields", () => {
    test("selects initial option from discriminator value", async () => {
      const screen = renderForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: { kind: "company", shared: "kept" },
        },
        testOptions
      );

      await assertSelectedOption(screen, testOptions, "Company kind");
      expect(readValue(screen)).toEqual({
        kind: "company",
        shared: "kept",
        companyName: "Acme",
      });
    });

    test("renders current option fields after normalization", async () => {
      const screen = renderForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: { kind: "company", shared: "kept" },
        },
        testOptions
      );

      await expect
        .element(screen.getByLabelText("Company Name"))
        .toHaveValue("Acme");
      expect(readValue(screen)).toEqual({
        kind: "company",
        shared: "kept",
        companyName: "Acme",
      });
    });

    test("keeps internally normalized object on an ambiguous option", async () => {
      const screen = renderForm(
        {
          theme,
          schema: ambiguousSchema,
        },
        testOptions
      );

      await assertSelectedOption(screen, testOptions, "String branch");
      expect(readValue(screen)).toEqual({ shared: "string-default" });
    });

    test("sanitizes previous option data when switching options", async () => {
      const screen = renderForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: {
            kind: "person",
            name: "Grace",
            shared: "kept",
          },
        },
        testOptions
      );

      await selectOption(screen, testOptions, "Company kind");
      await assertSelectedOption(screen, testOptions, "Company kind");
      expect(readValue(screen)).toEqual({
        kind: "company",
        companyName: "Acme",
        shared: "kept",
      });
    });

    test("uses discriminator ui-schema titles before schema titles", async () => {
      const screen = renderForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
        },
        testOptions
      );

      await assertOptionLabels(screen, testOptions, [
        "Person from UI",
        "Company kind",
      ]);
    });
  });
}
