import type { Theme } from "@sjsf/form";

import { arrayFieldSsrTests } from "./array-field-ssr-tests.js";
import { combinationFieldSsrTests } from "./combination-field-ssr-tests.js";
import type { CombinationFieldTestContext } from "./field-test-context.js";
import { objectFieldSsrTests } from "./object-field-ssr-tests.js";
import { primitiveFieldSsrTests } from "./primitive-field-ssr-tests.js";

/**
 * The context is forwarded verbatim to each suite, so it exposes the union of
 * the hooks they accept. Themes whose widgets render differently on the server
 * use `assertOptionTextInBody` to override the default option-text assertion.
 */
export interface FieldSsrTestContext extends CombinationFieldTestContext {}

export function fieldSsrTests(theme: Theme, options: FieldSsrTestContext = {}) {
  primitiveFieldSsrTests(theme, options);
  arrayFieldSsrTests(theme, options);
  objectFieldSsrTests(theme, options);
  combinationFieldSsrTests(theme, options);
}
