import {
  isOrderedSchemaDeepEqual,
  isSchemaDeepEqual,
  type Schema,
} from "@/core/index.js";

import type { FieldPath } from "./id.js";
import type { UiSchema } from "./ui-schema.js";

export interface Handlers {
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
  readonly handlers?: Handlers;
}

export function isConfigEqual(a: Config, b: Config) {
  return (
    a.path === b.path &&
    a.title === b.title &&
    a.required === b.required &&
    a.handlers === b.handlers &&
    isOrderedSchemaDeepEqual(a.schema, b.schema) &&
    isSchemaDeepEqual(a.uiSchema, b.uiSchema)
  );
}
