import type { FormOptions, Theme } from "@sjsf/form";

import type { Specs } from "../specs/schemas.js";
import { arrayFieldTests } from "./array-field-snapshot-tests.js";
import { objectTests } from "./object-field-snapshot-tests.js";
import { type MatchSnapshotOptions } from "./snapshot-helpers.js";
import { widgetTests } from "./widget-snapshot-tests.js";

export interface FieldTestOptions {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  specs?: Specs;
  Form?: MatchSnapshotOptions["Form"];
}

export function fieldTests(theme: Theme, options: FieldTestOptions = {}) {
  const { specs, Form, ...ctx } = options;

  const snapshotCtx: MatchSnapshotOptions = {
    context: ctx.context,
    defaultFormOptions: ctx.defaultFormOptions,
    Form,
  };

  if (specs) {
    widgetTests(theme, specs, snapshotCtx);
  }
  arrayFieldTests(theme, snapshotCtx);
  objectTests(theme, snapshotCtx);
}

export { widgetTests } from "./widget-snapshot-tests.js";
