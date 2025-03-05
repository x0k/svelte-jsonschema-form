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
    readonly: {
      ...schema,
      readOnly: true,
    },
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

export const number: Schema = {
  type: "number",
};

export const text: Schema = {
  type: "string",
};

export const uiStates = (uiSchema: UiSchema): UiSchema => ({
  default: uiSchema,
  readonly: uiSchema,
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
      }) satisfies ValidationError<null>
  );

export function createSchemas(
  specs: Record<string, [Schema, UiSchema]>,
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
    keys.map((widget) => [widget, uiStates(specs[widget]![1])])
  );
  const initialErrors = createErrors(keys, options);
  return { schema, uiSchema, initialErrors };
}
