import type { DemoData } from "./demo.ts";

export type DemoName =
  | "action-example"
  | "ajv"
  | "ajv-precompile"
  | "all-icons"
  | "async-validation"
  | "ata"
  | "ata-precompile"
  | "cfworker"
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
  | "hyperjump"
  | "icons"
  | "if-then-else"
  | "live-validation"
  | "manual-mode"
  | "multiple-forms"
  | "one-of"
  | "prevent-page-reload"
  | "programmatic-control"
  | "schemasafe"
  | "schemasafe-precompile"
  | "simple-setup"
  | "standard-schema"
  | "ui-schema"
  | "valibot"
  | "zod4";

export const DEMOS: Record<DemoName, () => Promise<{ default: DemoData }>> = {
  "action-example": () => import("./demos/action-example.ts"),
  "ajv": () => import("./demos/ajv.ts"),
  "ajv-precompile": () => import("./demos/ajv-precompile.ts"),
  "all-icons": () => import("./demos/all-icons.ts"),
  "async-validation": () => import("./demos/async-validation.ts"),
  "ata": () => import("./demos/ata.ts"),
  "ata-precompile": () => import("./demos/ata-precompile.ts"),
  "cfworker": () => import("./demos/cfworker.ts"),
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
  "hyperjump": () => import("./demos/hyperjump.ts"),
  "icons": () => import("./demos/icons.ts"),
  "if-then-else": () => import("./demos/if-then-else.ts"),
  "live-validation": () => import("./demos/live-validation.ts"),
  "manual-mode": () => import("./demos/manual-mode.ts"),
  "multiple-forms": () => import("./demos/multiple-forms.ts"),
  "one-of": () => import("./demos/one-of.ts"),
  "prevent-page-reload": () => import("./demos/prevent-page-reload.ts"),
  "programmatic-control": () => import("./demos/programmatic-control.ts"),
  "schemasafe": () => import("./demos/schemasafe.ts"),
  "schemasafe-precompile": () => import("./demos/schemasafe-precompile.ts"),
  "simple-setup": () => import("./demos/simple-setup.ts"),
  "standard-schema": () => import("./demos/standard-schema.ts"),
  "ui-schema": () => import("./demos/ui-schema.ts"),
  "valibot": () => import("./demos/valibot.ts"),
  "zod4": () => import("./demos/zod4.ts"),
};
