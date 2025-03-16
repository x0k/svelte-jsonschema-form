import type { Path } from "@/core/index.js";

import type {
  CompatibleComponentType,
  ComponentDefinitions,
  FoundationalComponent,
} from "./components.js";

export type UiSchemaRoot = UiSchemaRootIndex & UiSchemaRootContent;

export interface UiSchemaRootIndex {
  [key: string]: UiSchemaRootContent[keyof UiSchemaRootContent];
}

export interface UiSchemaRootContent extends UiSchemaContent {
  "ui:globalOptions"?: UiOptions;
}

export interface UiSchemaContent {
  "ui:options"?: UiOptions;
  "ui:components"?: Partial<{
    [T in FoundationalComponent]:
      | Exclude<CompatibleComponentType<T>, T>
      | ComponentDefinitions[T];
  }>;
  items?: UiSchema | UiSchema[];
  anyOf?: UiSchema[];
  oneOf?: UiSchema[];
  additionalProperties?: UiSchema;
  additionalPropertyKeyInput?: UiSchema;
  additionalItems?: UiSchema;
}

export interface UiOptions {}

export type UiSchema = UiSchemaIndex & UiSchemaContent;

export interface UiSchemaIndex {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
}

export function getUiSchemaByPath(
  schema: UiSchema | undefined,
  path: Path
): UiSchema | undefined {
  for (let i = 0; i < path.length; i++) {
    if (schema === undefined) {
      return undefined;
    }
    const alt = schema.anyOf ?? schema.oneOf;
    if (alt) {
      let def: UiSchema | undefined;
      const slice = path.slice(i);
      for (const sub of alt) {
        def = getUiSchemaByPath(sub, slice);
        if (def !== undefined) {
          return def;
        }
      }
      // Alt schema may be mixed with normal schema so
      // no early exit here
    }
    const k = path[i];
    const { items, additionalItems, additionalProperties }: UiSchema = schema;
    schema =
      (schema[k as string] as UiSchema) ??
      (Array.isArray(items) ? items[k as number] : items) ??
      additionalProperties ??
      additionalItems;
  }
  return schema;
}
