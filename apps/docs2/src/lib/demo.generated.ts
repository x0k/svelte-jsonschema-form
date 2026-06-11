import type { DemoData } from "./demo.ts";

export type DemoName =
  | "action-example"
  | "all-icons"
  | "async-validation"
  | "controlled-form"
  | "custom-keyword"
  | "customizable-text"
  | "dependencies"
  | "errors-list"
  | "extra-ui-options"
  | "fields-validation"
  | "file-size-validator"
  | "focus-on-first-error"
  | "form-state"
  | "icons"
  | "if-then-else"
  | "live-validation"
  | "manual-mode"
  | "multiple-forms"
  | "one-of"
  | "prevent-page-reload"
  | "programmatic-control"
  | "simple-setup"
  | "ui-schema";

export const DEMOS: Record<DemoName, () => Promise<{ default: DemoData }>> = {
  "action-example": () => import("./demos/action-example.ts"),
  "all-icons": () => import("./demos/all-icons.ts"),
  "async-validation": () => import("./demos/async-validation.ts"),
  "controlled-form": () => import("./demos/controlled-form.ts"),
  "custom-keyword": () => import("./demos/custom-keyword.ts"),
  "customizable-text": () => import("./demos/customizable-text.ts"),
  "dependencies": () => import("./demos/dependencies.ts"),
  "errors-list": () => import("./demos/errors-list.ts"),
  "extra-ui-options": () => import("./demos/extra-ui-options.ts"),
  "fields-validation": () => import("./demos/fields-validation.ts"),
  "file-size-validator": () => import("./demos/file-size-validator.ts"),
  "focus-on-first-error": () => import("./demos/focus-on-first-error.ts"),
  "form-state": () => import("./demos/form-state.ts"),
  "icons": () => import("./demos/icons.ts"),
  "if-then-else": () => import("./demos/if-then-else.ts"),
  "live-validation": () => import("./demos/live-validation.ts"),
  "manual-mode": () => import("./demos/manual-mode.ts"),
  "multiple-forms": () => import("./demos/multiple-forms.ts"),
  "one-of": () => import("./demos/one-of.ts"),
  "prevent-page-reload": () => import("./demos/prevent-page-reload.ts"),
  "programmatic-control": () => import("./demos/programmatic-control.ts"),
  "simple-setup": () => import("./demos/simple-setup.ts"),
  "ui-schema": () => import("./demos/ui-schema.ts"),
};
