import { createFormValidator } from "@sjsf/ajv8-validator";
import {
  BasicForm,
  createForm,
  getValueSnapshot,
  type FormOptions,
  type Theme,
} from "@sjsf/form";
import { DEFAULT_ID_PREFIX } from "@sjsf/form";
import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra/enum-include";
import "@sjsf/form/fields/extra/multi-enum-include";
import "@sjsf/form/templates/extra/optional-object-include";
import "@sjsf/form/templates/extra/optional-field-include";
import "@sjsf/form/templates/extra/optional-array-include";
import "@sjsf/form/templates/extra/optional-multi-field-include";
import { translation } from "@sjsf/form/translations/en";
import { expect, test as vitestTest, type TestAPI } from "vitest";
import { render } from "vitest-browser-svelte";
import { type Locator } from "vitest/browser";

const defaults = {
  translation,
  resolver,
  validator: createFormValidator,
  merger: createFormMerger,
  idBuilder: createFormIdBuilder({ idPrefix: DEFAULT_ID_PREFIX }),
};
import { type SelectCallbacks } from "./field-test-context.js";

export function skippableTest(skipTests?: string[]): TestAPI {
  const skip = skipTests ? new Set(skipTests) : undefined;
  if (!skip) return vitestTest;
  function skippedTest(name: string, ...args: any[]) {
    if (skip!.has(name)) {
      return vitestTest.skip(name, ...args);
    }
    return vitestTest(name, ...args);
  }
  Object.defineProperty(skippedTest, "skip", {
    value: vitestTest.skip.bind(vitestTest),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(skippedTest, "todo", {
    value: vitestTest.todo.bind(vitestTest),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(skippedTest, "only", {
    value: vitestTest.only.bind(vitestTest),
    writable: true,
    configurable: true,
  });
  return skippedTest as unknown as TestAPI;
}

export interface RenderFieldFormOptions {
  schema: FormOptions<any>["schema"];
  theme: Theme;
  uiSchema?: FormOptions<any>["uiSchema"];
  initialValue?: any;
  disabled?: boolean;
  readOnly?: boolean;
  initialErrors?: FormOptions<any>["initialErrors"];
}

export function renderFieldForm(
  ctx: {
    context?: Map<any, any>;
    defaultFormOptions?: Partial<FormOptions<any>>;
  },
  options: RenderFieldFormOptions
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

export function expectValue(
  form: ReturnType<typeof createForm>,
  expected: unknown
) {
  const actual = getValueSnapshot(form);
  expect(actual).toEqual(expected);
}

export function getInputValue(locator: Locator): string {
  const form = locator.element();
  const input = form.querySelector(
    'input:not([type="hidden"]):not([type="checkbox"])'
  ) as HTMLInputElement;
  return input?.value ?? "";
}

export function setInputValue(locator: Locator, value: string) {
  setInputValueAt(locator, 0, value);
}

export function setInputValueAt(
  locator: Locator,
  index: number,
  value: string
) {
  const form = locator.element();
  const inputs = form.querySelectorAll(
    'input:not([type="hidden"]):not([type="checkbox"])'
  );
  const input = inputs[index] as HTMLInputElement | undefined;
  if (input) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )!.set!;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export function clickCheckbox(locator: Locator) {
  const form = locator.element();
  const checkbox = form.querySelector(
    'button[role="checkbox"], input[type="checkbox"]'
  ) as HTMLElement;
  checkbox?.click();
}

export async function doAssertSelected(
  ctx: SelectCallbacks | undefined,
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

export async function doSelect(
  ctx: SelectCallbacks | undefined,
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

export async function doAssertLabels(
  ctx: SelectCallbacks | undefined,
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

export async function doAssertDisabled(
  ctx: SelectCallbacks | undefined,
  locator: Locator
) {
  if (ctx?.assertDisabled) {
    await ctx.assertDisabled(locator);
  } else {
    const selector = locator.getByRole("combobox").first();
    const select = selector.element() as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  }
}
