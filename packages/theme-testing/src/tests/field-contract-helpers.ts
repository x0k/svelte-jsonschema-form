import {
  BasicForm,
  createForm,
  getValueSnapshot,
  type FormOptions,
  type Theme,
} from "@sjsf/form";
import { expect, test as vitestTest, type TestAPI } from "vitest";
import { render } from "vitest-browser-svelte";
import { type Locator } from "vitest/browser";

import * as defaults from "../lib/form-defaults.js";
import { type SelectCallbacks } from "./field-test-context.js";

export function skippableTest(skipTests?: string[]): TestAPI {
  if (!skipTests?.length) return vitestTest;
  const skip = new Set(skipTests);
  return Object.assign(
    (name: string, ...args: any[]) =>
      skip.has(name)
        ? vitestTest.skip(name, ...args)
        : vitestTest(name, ...args),
    vitestTest
  );
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
