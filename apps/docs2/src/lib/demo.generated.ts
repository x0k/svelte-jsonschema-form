import type { DemoData } from "./demo.ts";

export type DemoName =
  | "controlled-form"
  | "form-state"
  | "simple-setup"
  | "ui-schema";

export const DEMOS: Record<DemoName, () => Promise<{ default: DemoData }>> = {
  "controlled-form": () => import("./demos/controlled-form.ts"),
  "form-state": () => import("./demos/form-state.ts"),
  "simple-setup": () => import("./demos/simple-setup.ts"),
  "ui-schema": () => import("./demos/ui-schema.ts"),
};
