import type { FormOptions, Schema, Theme } from "@sjsf/form";
import type { Locator } from "vitest/browser";

// --- Primitive fields ---

export type PrimitiveTestFormOptions = Partial<FormOptions<any>> & {
  schema: Schema;
  theme: Theme;
};

export interface PrimitiveFieldTestContext {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  typeText?: (locator: Locator, text: string) => Promise<void>;
  assertValue?: (locator: Locator, value: string) => Promise<void>;
  toggleCheckbox?: (locator: Locator) => Promise<void>;
  selectOption?: (locator: Locator, label: string) => Promise<void>;
  assertSelectedOption?: (locator: Locator, label: string) => Promise<void>;
  assertOptionLabels?: (locator: Locator, labels: string[]) => Promise<void>;
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

export interface ObjectFieldTestContext {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  skipTests?: string[];
}

// --- Combination fields ---

export type CombinationTestFormOptions = Partial<FormOptions<any>> & {
  schema: Schema;
  theme: Theme;
};

export interface CombinationFieldTestContext {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
  selectOption?: (locator: Locator, label: string) => Promise<void>;
  assertSelectedOption?: (locator: Locator, label: string) => Promise<void>;
  assertOptionLabels?: (locator: Locator, labels: string[]) => Promise<void>;
  skipTests?: string[];
}
