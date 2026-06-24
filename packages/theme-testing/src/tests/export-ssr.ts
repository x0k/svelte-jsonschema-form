import type { FormOptions, Theme } from "@sjsf/form";

import { arrayFieldSsrTests } from "./array-field-ssr-tests.js";
import { combinationFieldSsrTests } from "./combination-field-ssr-tests.js";
import { objectFieldSsrTests } from "./object-field-ssr-tests.js";
import { primitiveFieldSsrTests } from "./primitive-field-ssr-tests.js";

export interface FieldSsrTestContext {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
}

export function fieldSsrTests(theme: Theme, options: FieldSsrTestContext = {}) {
  primitiveFieldSsrTests(theme, options);
  arrayFieldSsrTests(theme, options);
  objectFieldSsrTests(theme, options);
  combinationFieldSsrTests(theme, options);
}
