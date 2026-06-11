import type { DemoData } from "./demo.ts";

export type DemoName =
  | "action-example"
  | "all-icons"
  | "async-validation"
  | "controlled-form"
  | "customizable-text"
  | "errors-list"
  | "extra-ui-options"
  | "fields-validation"
  | "focus-on-first-error"
  | "form-state"
  | "icons"
  | "live-validation"
  | "simple-setup"
  | "ui-schema";

export const DEMOS: Record<DemoName, () => Promise<{ default: DemoData }>> = {
  "action-example": () => import("./demos/action-example.ts"),
  "all-icons": () => import("./demos/all-icons.ts"),
  "async-validation": () => import("./demos/async-validation.ts"),
  "controlled-form": () => import("./demos/controlled-form.ts"),
  "customizable-text": () => import("./demos/customizable-text.ts"),
  "errors-list": () => import("./demos/errors-list.ts"),
  "extra-ui-options": () => import("./demos/extra-ui-options.ts"),
  "fields-validation": () => import("./demos/fields-validation.ts"),
  "focus-on-first-error": () => import("./demos/focus-on-first-error.ts"),
  "form-state": () => import("./demos/form-state.ts"),
  "icons": () => import("./demos/icons.ts"),
  "live-validation": () => import("./demos/live-validation.ts"),
  "simple-setup": () => import("./demos/simple-setup.ts"),
  "ui-schema": () => import("./demos/ui-schema.ts"),
};
