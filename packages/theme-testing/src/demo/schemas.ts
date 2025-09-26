import type { Locator } from "@vitest/browser/context";
import type { SchemaArrayValue } from "@sjsf/form/core";
import {
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  type FormIdBuilder,
  type Schema,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";

import type * as triggers from "./triggers.js";

export const states = (schema: Schema): Schema => ({
  type: "object",
  properties: {
    default: schema,
    error: schema,
  },
});

export const boolean: Schema = {
  type: "boolean",
};

export const enumeration = {
  type: "string",
  enum: ["foo", "bar", "fuzz", "qux"],
} as const satisfies Schema;

export const uniqueArray: Schema = {
  type: "array",
  items: enumeration,
  uniqueItems: true,
};

export const file: Schema = {
  type: "string",
  format: "data-url",
};

export const filesArray: Schema = {
  type: "array",
  items: file,
};

export const number: Schema = {
  type: "number",
};

export const text: Schema = {
  type: "string",
};

export const uiStates = (uiSchema: UiSchema): UiSchema => ({
  default: uiSchema,
  error: uiSchema,
});

export const createErrors = (keys: string[], idBuilder: FormIdBuilder) =>
  keys.map(
    (key) =>
      ({
        error: null,
        instanceId: idBuilder.fromPath([key, "error"]),
        propertyTitle: "error",
        message: `${key} error`,
      }) satisfies ValidationError<null>
  );

export const FIELD_VALIDATION_MODE_NAMES = {
  [ON_INPUT]: "oninput",
  [ON_CHANGE]: "onchange",
  [ON_BLUR]: "onblur",
} as const satisfies Record<number, string>;

export const FIELD_VALIDATION_MODES = Object.keys(
  FIELD_VALIDATION_MODE_NAMES
).map(Number);

export type FieldValidationModeName =
  (typeof FIELD_VALIDATION_MODE_NAMES)[number];

export type FieldValidationTrigger = (locator: Locator) => Promise<void>;

type Triggers = typeof triggers;

export type Trigger = keyof {
  [K in keyof Triggers as Triggers[K] extends FieldValidationTrigger
    ? K
    : never]: true;
};

export const SWITCH_LABEL_TEXT = "switch";

export type Specs = Record<
  string,
  [Schema, UiSchema, Partial<Record<FieldValidationModeName, Trigger>>]
>;

export function createSchemas(
  specs: Specs,
  idBuilder: FormIdBuilder
): {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  initialErrors: ValidationError<any>[];
} {
  const keys = Object.keys(specs);
  const schema: Schema = {
    type: "object",
    properties: Object.fromEntries(
      keys.map((widget) => [widget, states(specs[widget]![0])])
    ),
  };
  const uiSchema: UiSchemaRoot = Object.fromEntries(
    keys.flatMap((widget) => {
      const uiSchema = specs[widget]![1];
      return Object.keys(uiSchema).length > 0
        ? [[widget, uiStates(uiSchema)]]
        : [];
    })
  );
  const initialErrors = createErrors(keys, idBuilder);
  return { schema, uiSchema, initialErrors };
}

export function assertStrings(
  arr: SchemaArrayValue | null | undefined
): asserts arr is string[] | undefined {
  if (arr?.some((item) => typeof item !== "string")) {
    throw new TypeError("expected array of strings");
  }
}
