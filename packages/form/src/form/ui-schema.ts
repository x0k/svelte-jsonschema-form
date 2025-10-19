import type { Resolver } from "@/lib/resolver.js";
import type { RPath, SchemaValue } from "@/core/index.js";

import type {
  CompatibleComponentType,
  ComponentDefinitions,
  ComponentProps,
  FoundationalComponentType,
} from "./components.js";
import type { Config } from "./config.js";
import type { ActionField, FieldAction } from "./field-actions.js";
import type { TranslatorDefinitions } from "./translation.js";

export interface UiOptions {
  /**
   * Overrides the title of the field.
   */
  title?: string;
  /**
   * Overrides form translation
   */
  translations?: Partial<TranslatorDefinitions>;
  /**
   * Field action
   */
  action?: FieldAction<SchemaValue | undefined>;
  /**
   * A typed field action takes precedence over `action`
   */
  actions?: Partial<{
    [T in ActionField]: FieldAction<ComponentProps[T]["value"]>;
  }>;
}

export type UiOption = <O extends keyof UiOptions>(opt: O) => UiOptions[O];

export interface UiOptionsRegistry {}

export type ResolvableUiOption<T> =
  | {
      [K in keyof UiOptionsRegistry as UiOptionsRegistry[K] extends T
        ? K
        : never]: `registry:${K}`;
    }[keyof UiOptionsRegistry]
  | T;

export type ResolvableUiOptions = {
  [K in keyof UiOptions]: ResolvableUiOption<UiOptions[K]>;
};

export interface UiSchemaContent {
  /**
   * Extendable set of UI options
   */
  "ui:options"?: ResolvableUiOptions;
  /**
   * Components override
   */
  "ui:components"?: Partial<{
    [T in FoundationalComponentType]:
      | Exclude<CompatibleComponentType<T>, T>
      | ComponentDefinitions[T];
  }>;
  items?: UiSchemaDefinition | UiSchemaDefinition[];
  anyOf?: UiSchemaDefinition[];
  oneOf?: UiSchemaDefinition[];
  additionalProperties?: UiSchemaDefinition;
  additionalPropertyKeyInput?: UiSchemaDefinition;
  additionalItems?: UiSchemaDefinition;
}

export type UiSchema = UiSchemaContent & {
  // This is should be `UiSchemaDefinition` type, but
  // https://github.com/microsoft/TypeScript/issues/17867
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
};

export interface UiSchemaRef {
  $ref: string;
}

export type UiSchemaDefinition = UiSchema | UiSchemaRef;

export type UiSchemaRoot = UiSchemaDefinition & {
  "ui:globalOptions"?: UiOptions;
  "ui:definitions"?: Record<string, UiSchema>;
};

export type ExtraUiOptions = Resolver<
  Partial<Record<keyof UiOptions, Config>>,
  Partial<UiOptions>
>;

export function isUiSchemaRef(
  def: UiSchemaDefinition | undefined
): def is UiSchemaRef {
  return typeof def?.$ref === "string";
}

export function resolveUiRef(
  rootSchema: UiSchemaRoot,
  schemaDef: UiSchemaDefinition | undefined
): UiSchema | undefined {
  return isUiSchemaRef(schemaDef)
    ? rootSchema["ui:definitions"]?.[schemaDef.$ref]
    : schemaDef;
}

export function resolveUiOption<O extends keyof UiOptions>(
  uiSchemaRoot: UiSchemaRoot,
  uiOptionsRegistry: UiOptionsRegistry,
  uiSchema: UiSchema,
  option: O
): UiOptions[O] | undefined {
  let value = uiSchema["ui:options"]?.[option];
  if (value === undefined) {
    value = uiSchemaRoot["ui:globalOptions"]?.[option];
  }
  if (typeof value === "string" && value.startsWith("registry:")) {
    return uiOptionsRegistry[value.substring(9) as keyof UiOptionsRegistry];
  }
  return value;
}

export function getUiSchemaByPath(
  rootSchema: UiSchemaRoot,
  schemaDef: UiSchemaDefinition | undefined,
  path: RPath
): UiSchema | undefined {
  let schema = resolveUiRef(rootSchema, schemaDef);
  for (let i = 0; i < path.length; i++) {
    if (schema === undefined) {
      return undefined;
    }
    const alt = schema.anyOf ?? schema.oneOf;
    if (alt) {
      let def: UiSchema | undefined;
      const slice = path.slice(i);
      for (const sub of alt) {
        def = getUiSchemaByPath(rootSchema, sub, slice);
        if (def !== undefined) {
          return def;
        }
      }
      // Alt schema may be mixed with normal schema so
      // no early exit here
    }
    const k = path[i];
    const { items, additionalItems, additionalProperties } = schema;
    schema = resolveUiRef(
      rootSchema,
      (schema[k as string] as UiSchema) ??
        (Array.isArray(items) ? items[k as number] : items) ??
        additionalProperties ??
        additionalItems
    );
  }
  return schema;
}

export function getRootUiSchemaTitleByPath(
  uiSchemaRoot: UiSchemaRoot,
  path: RPath
) {
  return getUiSchemaByPath(uiSchemaRoot, uiSchemaRoot, path)?.["ui:options"]
    ?.title;
}
