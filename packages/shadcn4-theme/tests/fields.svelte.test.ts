import { fieldTests } from "theme-testing/tests";
import { expect } from "vitest";
import { page, userEvent, type Locator } from "vitest/browser";

import * as components from "../src/lib/components/ui/index.js";
import { theme } from "../src/lib/theme/index.js";
import { THEME_CONTEXT } from "../src/lib/theme/internal.js";
import Form from "./form.svelte";

async function selectOption(locator: Locator, label: string) {
  await userEvent.click(locator.getByRole("button").first());
  await userEvent.click(page.getByRole("option", { name: label }).first());
}

async function assertSelectedOption(locator: Locator, label: string) {
  const button = locator.getByRole("button").first();
  await expect.element(button).toBeInTheDocument();
  expect(button.element().textContent).toContain(label);
}

async function assertOptionLabels(locator: Locator, labels: string[]) {
  await userEvent.click(locator.getByRole("button").first());
  for (const label of labels) {
    await expect
      .element(page.getByRole("option", { name: label }).first())
      .toBeInTheDocument();
  }
  await userEvent.keyboard("{Escape}");
}

fieldTests(theme, {
  context: new Map([[THEME_CONTEXT, { components }]]),
  Form,
  selectOption,
  assertSelectedOption,
  assertOptionLabels,
  skipTests: ["readonly field renders readonly input"],
});
