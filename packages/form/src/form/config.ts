import {
  isOrderedSchemaDeepEqual,
  isSchemaDeepEqual,
  schemaRequiresTrueValue,
  type ReadonlySchemaValue,
  type Schema,
} from "#core/index.js";

import type { FieldPath } from "./id.js";
import type { UiSchema } from "./ui-schema.js";

export interface EventHandlers {
  onfocus?: () => void;
  onblur?: () => void;
  oninput?: () => void;
  onchange?: () => void;
}

export interface Config {
  readonly path: FieldPath;
  readonly title: string;
  readonly schema: Schema;
  readonly uiSchema: UiSchema;
  readonly required: boolean;
  readonly value: () => ReadonlySchemaValue | undefined;
  readonly eventHandlers?: EventHandlers;
}

/**
 * Whether a checkbox must be marked as required because the schema only allows
 * `true`. A plain required boolean can validly be `false`, so it must not get
 * the marker.
 */
export function configRequiresTrueValue(config: Config) {
  return config.required && schemaRequiresTrueValue(config.schema);
}

export function isConfigEqual(a: Config, b: Config) {
  return (
    a.path === b.path &&
    a.title === b.title &&
    a.required === b.required &&
    a.eventHandlers === b.eventHandlers &&
    // NOTE: Maintaining consistent function references is tedious and
    // error prone
    // a.value === b.value &&
    isOrderedSchemaDeepEqual(a.schema, b.schema) &&
    isSchemaDeepEqual(a.uiSchema, b.uiSchema)
  );
}
