import type { SchemaArrayValue } from "@sjsf/form/core";
import {
  pathToId,
  type PathToIdOptions,
  type Schema,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";

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

export const enumeration: Schema = {
  type: "string",
  enum: ["foo", "bar", "fuzz", "qux"],
};

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

export const createErrors = (keys: string[], options?: PathToIdOptions) =>
  keys.map(
    (key) =>
      ({
        error: null,
        instanceId: pathToId([key, "error"], options),
        propertyTitle: "error",
        message: `${key} error`,
      } satisfies ValidationError<null>)
  );

export type Specs = Record<string, [Schema, UiSchema]>;

export function createSchemas(
  specs: Specs,
  options?: PathToIdOptions
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
  const initialErrors = createErrors(keys, options);
  return { schema, uiSchema, initialErrors };
}

export function assertStrings(
  arr: SchemaArrayValue | undefined
): asserts arr is string[] | undefined {
  if (
    arr !== undefined &&
    arr.find((item) => {
      return item !== undefined && typeof item !== "string";
    })
  ) {
    throw new TypeError("expected array of strings");
  }
}
