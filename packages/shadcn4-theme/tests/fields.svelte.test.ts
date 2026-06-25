import { fieldTests } from "theme-testing/tests";
import { expect } from "vitest";
import { page, userEvent, type Locator } from "vitest/browser";

import * as components from "../src/lib/components/ui/index.js";
import { theme } from "../src/lib/theme/index.js";
import { THEME_CONTEXT } from "../src/lib/theme/internal.js";
import Form from "./form.svelte";

async function selectOption(locator: Locator, label: string) {
  const button = locator.getByRole("button").first();
  await userEvent.click(button);
  await userEvent.click(page.getByRole("option", { name: label }).first());
}

async function assertSelectedOption(locator: Locator, label: string) {
  const button = locator.getByRole("button").first();
  await expect.element(button).toBeInTheDocument();
  expect(button.element().textContent).toContain(label);
}

async function assertOptionLabels(locator: Locator, labels: string[]) {
  const button = locator.getByRole("button").first();
  await userEvent.click(button);
  for (const label of labels) {
    const option = page.getByRole("option", { name: label }).first();
    await expect.element(option).toBeInTheDocument();
  }
  await userEvent.keyboard("{Escape}");
  await expect.element(button).toHaveAttribute("data-state", "closed");
}

async function assertDisabled(locator: Locator) {
  const button = locator.getByRole("button").first();
  await expect.element(button).toBeDisabled();
}

fieldTests(theme, {
  context: new Map([[THEME_CONTEXT, { components }]]),
  Form,
  selectOption,
  assertSelectedOption,
  assertOptionLabels,
  assertDisabled,
  skipTests: ["readonly field renders readonly input"],
});
