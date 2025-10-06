import type { RemoteFormInput } from '@sveltejs/kit';
import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import { resolveRef, type Path, type SchemaDefinition, type SchemaValue } from '@sjsf/form/core';
import {
  resolveUiRef,
  type Schema,
  type UiSchema,
  type UiSchemaDefinition,
  type Validator
} from '@sjsf/form';

import type { EntryConverter } from '$lib/server/entry.js';

type Input = RemoteFormInput[string] | undefined;

export interface SchemaValueParserOptions {
  schema: Schema;
  uiSchema: UiSchema;
  input: Input;
  validator: Validator;
  convertEntry: EntryConverter<Input>;
}

export function parseSchemaValue(
  signal: AbortSignal,
  {
    schema: rootSchema,
    uiSchema: rootUiSchema,
    input,
    validator,
    convertEntry
  }: SchemaValueParserOptions
) {
  const path: Path = [];

  const convert = (
    schema: SchemaDefinition,
    uiSchema: UiSchema,
    value: Input,
    defaultValue: SchemaValue | undefined
  ) =>
    convertEntry(signal, {
      path,
      schema,
      uiSchema,
      value,
      defaultValue
    });

  async function parseSchemaDef(
    schema: SchemaDefinition,
    uiSchema: UiSchemaDefinition,
    value: Input,
    defaultValue: SchemaValue | undefined
  ) {
    uiSchema = resolveUiRef(rootUiSchema, uiSchema) ?? {};
    if (!isSchemaObject(schema)) {
      return schema ? convert(schema, uiSchema, value, defaultValue) : defaultValue;
    }
    const { $ref: ref, oneOf, anyOf, allOf } = schema;
    if (ref !== undefined) {
      return parseSchemaDef(resolveRef(ref, rootSchema), uiSchema, value, defaultValue);
    }
  }

  return parseSchemaDef(rootSchema, rootUiSchema, input, undefined);
}
