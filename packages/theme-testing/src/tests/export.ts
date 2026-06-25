import type { FormOptions, Theme } from "@sjsf/form";
import type { Locator } from "vitest/browser";

import type { Specs } from "../specs/schemas.js";
import { arrayFieldContractTests } from "./array-field-contract-tests.js";
import { arrayFieldTests } from "./array-field-snapshot-tests.js";
import { combinationFieldContractTests } from "./combination-field-contract-tests.js";
import { type SelectCallbacks } from "./field-test-context.js";
import { objectFieldContractTests } from "./object-field-contract-tests.js";
import { objectTests } from "./object-field-snapshot-tests.js";
import { primitiveFieldContractTests } from "./primitive-field-contract-tests.js";
import { type MatchSnapshotOptions } from "./snapshot-helpers.js";
import { widgetTests } from "./widget-snapshot-tests.js";

export interface FieldTestContext extends SelectCallbacks {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  addItem?: (locator: Locator, index: number) => Promise<void>;
  removeItem?: (locator: Locator, index: number) => Promise<void>;
  typeText?: (locator: Locator, text: string) => Promise<void>;
  assertValue?: (locator: Locator, value: string) => Promise<void>;
  toggleCheckbox?: (locator: Locator) => Promise<void>;
  skipTests?: string[];
}

export interface FieldTestOptions extends FieldTestContext {
  specs?: Specs;
  Form?: MatchSnapshotOptions["Form"];
}

export function fieldTests(theme: Theme, options: FieldTestOptions = {}) {
  const {
    specs,
    Form,
    selectOption,
    assertSelectedOption,
    assertOptionLabels,
    assertDisabled,
    addItem,
    removeItem,
    typeText,
    assertValue,
    toggleCheckbox,
    skipTests,
    ...ctx
  } = options;

  const fieldCtx = {
    context: ctx.context,
    defaultFormOptions: ctx.defaultFormOptions,
    selectOption,
    assertSelectedOption,
    assertOptionLabels,
    assertDisabled,
    skipTests,
  };

  const combinationCtx = {
    ...fieldCtx,
    selectOption,
    assertSelectedOption,
    assertOptionLabels,
    assertDisabled,
    skipTests,
  };

  const snapshotCtx: MatchSnapshotOptions = {
    context: ctx.context,
    defaultFormOptions: ctx.defaultFormOptions,
    Form,
  };

  primitiveFieldContractTests(theme, fieldCtx);
  arrayFieldContractTests(theme, fieldCtx);
  objectFieldContractTests(theme, fieldCtx);
  combinationFieldContractTests(theme, combinationCtx);

  if (specs) {
    widgetTests(theme, specs, snapshotCtx);
  }
  arrayFieldTests(theme, snapshotCtx);
  objectTests(theme, snapshotCtx);
}

export { widgetTests } from "./widget-snapshot-tests.js";
