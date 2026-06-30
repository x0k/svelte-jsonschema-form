import type { FormOptions, Schema, Theme } from "@sjsf/form";
import type { Locator } from "vitest/browser";

export interface SelectCallbacks {
  selectOption?: (locator: Locator, label: string) => Promise<void>;
  assertSelectedOption?: (locator: Locator, label: string) => Promise<void>;
  assertOptionLabels?: (locator: Locator, labels: string[]) => Promise<void>;
  assertDisabled?: (locator: Locator) => Promise<void>;
}

// --- Primitive fields ---

export type PrimitiveTestFormOptions = Partial<FormOptions<any>> & {
  schema: Schema;
  theme: Theme;
};

export interface PrimitiveFieldTestContext extends SelectCallbacks {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  typeText?: (locator: Locator, text: string) => Promise<void>;
  assertValue?: (locator: Locator, value: string) => Promise<void>;
  toggleCheckbox?: (locator: Locator) => Promise<void>;
  skipTests?: string[];
}

// --- Array fields ---

export type ArrayTestFormOptions = Partial<FormOptions<any>> & {
  schema: Schema;
  theme: Theme;
};

export interface ArrayFieldTestContext {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  addItem?: (locator: Locator) => Promise<void>;
  removeItem?: (locator: Locator, index: number) => Promise<void>;
  skipTests?: string[];
}

// --- Object fields ---

export type ObjectTestFormOptions = Partial<FormOptions<any>> & {
  schema: Schema;
  theme: Theme;
};

export interface ObjectFieldTestContext extends SelectCallbacks {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  skipTests?: string[];
}

// --- Combination fields ---

export type CombinationTestFormOptions = Partial<FormOptions<any>> & {
  schema: Schema;
  theme: Theme;
};

export interface CombinationFieldTestContext extends SelectCallbacks {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  toggleCheckbox?: (locator: Locator) => Promise<void>;
  skipTests?: string[];
  /** Custom assertion for option text in SSR body. Default: `expect(body).toContain(title)` */
  assertOptionTextInBody?: (body: string, optionTitle: string) => void;
}
