import type { FormOptions, Schema, Theme } from "@sjsf/form";
import type { Locator } from "vitest/browser";

export type CombinationTestFormOptions = Partial<FormOptions<any>> & {
  schema: Schema;
  theme: Theme;
};

export interface CombinationFieldTestOptions {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  selectOption?: (locator: Locator, label: string) => Promise<void>;
  assertSelectedOption?: (locator: Locator, label: string) => Promise<void>;
  assertOptionLabels?: (locator: Locator, labels: string[]) => Promise<void>;
}
