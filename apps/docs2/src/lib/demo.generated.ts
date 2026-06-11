import type { DemoData } from "./demo.ts";

export type DemoName =
  | "all-icons"
  | "async-validation"
  | "controlled-form"
  | "errors-list"
  | "fields-validation"
  | "focus-on-first-error"
  | "form-state"
  | "icons"
  | "live-validation"
  | "simple-setup"
  | "ui-schema";

export const DEMOS: Record<DemoName, () => Promise<{ default: DemoData }>> = {
  "all-icons": () => import("./demos/all-icons.ts"),
  "async-validation": () => import("./demos/async-validation.ts"),
  "controlled-form": () => import("./demos/controlled-form.ts"),
  "errors-list": () => import("./demos/errors-list.ts"),
  "fields-validation": () => import("./demos/fields-validation.ts"),
  "focus-on-first-error": () => import("./demos/focus-on-first-error.ts"),
  "form-state": () => import("./demos/form-state.ts"),
  "icons": () => import("./demos/icons.ts"),
  "live-validation": () => import("./demos/live-validation.ts"),
  "simple-setup": () => import("./demos/simple-setup.ts"),
  "ui-schema": () => import("./demos/ui-schema.ts"),
};
