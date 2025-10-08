import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import { isRecord } from '@sjsf/form/lib/object';
import {
  getClosestMatchingOption,
  getDiscriminatorFieldFromSchema,
  getKnownProperties,
  getSimpleSchemaType,
  isSchemaArrayValue,
  isSchemaObjectValue,
  isSelect,
  resolveRef,
  type Merger,
  type Path,
  type SchemaArrayValue,
  type SchemaDefinition,
  type SchemaObjectValue,
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

import { KEY_INPUT_KEY, ONE_OF, type EntryConverter } from '$lib/model.js';

import { decode } from '../id-builder/codec.js';

export type Input<T> = T | { [key: string]: Input<T> } | Input<T>[] | undefined;

export interface SchemaValueParserOptions<T> {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  input: Input<T>;
  validator: Validator;
  merger: Merger;
  convertEntry: EntryConverter<T | undefined>;
  pseudoSeparator: string;
}

export function parseSchemaValue<T>(
  signal: AbortSignal,
  {
    schema: rootSchema,
    uiSchema: rootUiSchema,
    input,
    validator,
    merger,
    convertEntry,
    pseudoSeparator
  }: SchemaValueParserOptions<T>
) {
  const path: Path = [];
  const SEPARATED_KEY_INPUT_KEY = `${pseudoSeparator}${KEY_INPUT_KEY}`;

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

  async function parseArray(
    schema: Schema,
    uiSchema: UiSchema,
    input: Input<T>,
    value: SchemaArrayValue
  ): Promise<SchemaValue | undefined> {
    const { items, additionalItems } = schema;
    if (Array.isArray(input) && items !== undefined) {
      const uiItems = uiSchema.items ?? {};
      const uiIsArray = Array.isArray(uiItems);
      let i = 0;
      if (Array.isArray(items)) {
        for (; i < items.length; i++) {
          value.push(
            await parseSchemaDef(items[i], uiIsArray ? uiItems[i] : uiItems, input[i], undefined)
          );
        }
        if (additionalItems !== undefined) {
          const additionalUiSchema = uiSchema.additionalItems ?? {};
          while (i < input.length) {
            value.push(
              await parseSchemaDef(additionalItems, additionalUiSchema, input[i++], undefined)
            );
          }
        }
      } else {
        for (; i < input.length; i++) {
          value.push(
            await parseSchemaDef(items, uiIsArray ? uiItems[i] : uiItems, input[i], undefined)
          );
        }
      }
    }
    return value;
  }

  async function parseObject(
    schema: Schema,
    uiSchema: UiSchema,
    input: Input<T>,
    value: SchemaObjectValue
  ) {
    if (!isRecord(input)) {
      return value;
    }

    async function setProperty(
      property: string,
      input: Input<T>,
      schemaDef: SchemaDefinition,
      uiSchema: UiSchemaDefinition
    ) {
      if (value[property] === undefined) {
        const propValue = await parseSchemaDef(schemaDef, uiSchema, input, undefined);
        if (propValue !== undefined) {
          value[property] = propValue;
        }
      }
    }

    const { properties, additionalProperties } = schema;
    if (properties !== undefined) {
      const keys = Object.keys(properties);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        await setProperty(key, input[key], properties[key], (uiSchema[key] ?? {}) as UiSchema);
      }
    }
    if (additionalProperties !== undefined) {
      const knownProperties = new Set(getKnownProperties(schema, rootSchema));
      const keys = Object.keys(input);
      const additionalKeys = new Map<string, string>();
      const additionalUiSchema = uiSchema.additionalProperties ?? {};
      for (let i = 0; i < keys.length; i++) {
        const encodedKey = keys[i];
        const key = decode(encodedKey);
        if (knownProperties.has(key)) {
          continue;
        }
        const val = input[encodedKey];
        if (key.endsWith(SEPARATED_KEY_INPUT_KEY) && typeof val === 'string') {
          const k = key.substring(0, key.length - SEPARATED_KEY_INPUT_KEY.length);
          if (k !== val) {
            additionalKeys.set(k, val);
          }
          continue;
        }
        await setProperty(
          additionalKeys.get(key) ?? key,
          val,
          additionalProperties,
          additionalUiSchema
        );
        additionalKeys.delete(key);
      }
      // NOTE: fallback
      for (const [oldKey, newKey] of additionalKeys) {
        if (!(oldKey in value)) {
          continue;
        }
        value[newKey] = value[oldKey];
        delete value[oldKey];
      }
    }
    return value;
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
    const type = getSimpleSchemaType(schema);
    if (type === 'object') {
      value = await parseObject(schema, uiSchema, input, isSchemaObjectValue(value) ? value : {});
    } else if (type === 'array') {
      value = await parseArray(schema, uiSchema, input, isSchemaArrayValue(value) ? value : []);
    } else if (value === undefined) {
      value = await convert(schema, uiSchema, input);
    }
    return value;
  }

  return parseSchemaDef(rootSchema, rootUiSchema, input, undefined);
}
