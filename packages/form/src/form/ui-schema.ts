import type { Resolver } from '@/lib/resolver.js';
import type { Path } from "@/core/index.js";

import type {
  CompatibleComponentType,
  ComponentDefinitions,
  FoundationalComponent,
} from "./components.js";
import type { Config } from './config.js';

export interface UiOptions {}

export type ExtraUiOptions = Resolver<
  Partial<Record<keyof UiOptions, Config>>,
  Partial<UiOptions>
>

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

// https://github.com/microsoft/TypeScript/issues/17867
export type UiSchema = UiSchemaContent & {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
};

export interface UiSchemaRootContent extends UiSchemaContent {
  "ui:globalOptions"?: UiOptions;
}

export type UiSchemaRoot = UiSchemaRootContent & {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
};

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
