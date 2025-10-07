import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import {
  getClosestMatchingOption,
  getDiscriminatorFieldFromSchema,
  isSelect,
  resolveRef,
  type Merger,
  type Path,
  type SchemaDefinition,
  type SchemaValue
} from '@sjsf/form/core';
import {
  resolveUiRef,
  type IdentifiableFieldElement,
  type Schema,
  type UiSchema,
  type UiSchemaDefinition,
  type UiSchemaRoot,
  type Validator
} from '@sjsf/form';

import { ONE_OF, type EntryConverter } from '$lib/model.js';

type Input<T> = T | { [key: string]: Input<T> } | Input<T>[];

export interface SchemaValueParserOptions<T> {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  input: Input<T>;
  validator: Validator;
  merger: Merger;
  convertEntry: EntryConverter<T>;
}

export function parseSchemaValue<T>(
  signal: AbortSignal,
  {
    schema: rootSchema,
    uiSchema: rootUiSchema,
    input,
    validator,
    merger,
    convertEntry
  }: SchemaValueParserOptions<T>
) {
  const path: Path = [];

  const convert = (schema: SchemaDefinition, uiSchema: UiSchema, input: Input<T>) =>
    convertEntry(signal, {
      path,
      schema,
      uiSchema,
      value: input as T
    });

  async function parseCombination(
    element: keyof IdentifiableFieldElement,
    schemas: SchemaDefinition[],
    uiSchemas: UiSchemaDefinition | UiSchemaDefinition[],
    schema: Schema,
    value: SchemaValue | undefined
  ) {
    if (isSelect(validator, merger, schema, rootSchema)) {
      return value;
    }
    const bestIndex =
      ((await convert({ type: 'integer' }, {}, input)) as number | undefined) ??
      getClosestMatchingOption(
        validator,
        merger,
        rootSchema,
        value,
        schemas.map((s) => {
          if (typeof s === 'boolean') {
            return s ? {} : { not: {} };
          }
          return s;
        }),
        0,
        getDiscriminatorFieldFromSchema(schema)
      );
    return parseSchemaDef(
      schemas[bestIndex],
      Array.isArray(uiSchemas) ? uiSchemas[bestIndex] : uiSchemas,
      input,
      value
    );
  }

  async function parseSchemaDef(
    schema: SchemaDefinition,
    uiSchema: UiSchemaDefinition,
    input: Input<T>,
    value: SchemaValue | undefined
  ): Promise<SchemaValue | undefined> {
    uiSchema = resolveUiRef(rootUiSchema, uiSchema) ?? {};
    if (!isSchemaObject(schema)) {
      return schema ? convert(schema, uiSchema, input) : undefined;
    }
    const { $ref: ref, oneOf, anyOf, allOf } = schema;
    if (ref !== undefined) {
      return parseSchemaDef(resolveRef(ref, rootSchema), uiSchema, input, value);
    }
    if (oneOf) {
      value = await parseCombination(ONE_OF, oneOf, uiSchema.oneOf ?? uiSchema, schema, value);
    }
    return value;
  }

  return parseSchemaDef(rootSchema, rootUiSchema, input, undefined);
}
