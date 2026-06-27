import { fieldTests } from "theme-testing/tests";
import { expect } from "vitest";
import type { Locator } from "vitest/browser";

import { theme } from "../src/index.js";
import { specs } from "../src/specs.js";
import { arrayFieldContractTests } from "./array-field-contract-tests.js";
import { combinationFieldContractTests } from "./combination-field-contract-tests.js";
import { dependencyEnumArrayContractTests } from "./dependency-enum-array-contract-tests.js";
import Form from "./form.svelte";
import { objectFieldContractTests } from "./object-field-contract-tests.js";
import { primitiveFieldContractTests } from "./primitive-field-contract-tests.js";

const toggleCheckbox = async (locator: Locator) => {
  const el = locator.element();
  const cb = el.querySelector(
    'input[type="checkbox"], button[role="checkbox"], button[role="switch"]'
  ) as HTMLElement;
  expect(cb).toBeDefined();
  cb.click();
};

primitiveFieldContractTests(theme, {
  toggleCheckbox,
  skipTests: ["readonly field renders readonly input"],
});
arrayFieldContractTests(theme);
objectFieldContractTests(theme);
combinationFieldContractTests(theme, { toggleCheckbox });
dependencyEnumArrayContractTests(theme, { toggleCheckbox });

fieldTests(theme, {
  specs,
  Form,
});
