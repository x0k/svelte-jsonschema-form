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
  type Schema,
  type UiSchema,
  type UiSchemaDefinition,
  type UiSchemaRoot,
  type Validator
} from '@sjsf/form';

import { ANY_OF, KEY_INPUT_KEY, ONE_OF, type EntryConverter } from '$lib/model.js';

import { decode, encode } from '../id-builder/codec.js';

export type Input<T> = T | { [key: string]: Input<T> } | Input<T>[] | undefined;

export interface SchemaValueParserOptions<T> {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  input: Record<string, Input<T>>;
  validator: Validator;
  merger: Merger;
  convertEntry: EntryConverter<T>;
  idPrefix: string;
  pseudoPrefix: string;
}

type CombinationIdentifiableElement = typeof ONE_OF | typeof ANY_OF;

export async function parseSchemaValue<T>(
  signal: AbortSignal,
  {
    schema: rootSchema,
    uiSchema: rootUiSchema,
    input,
    validator,
    merger,
    convertEntry,
    idPrefix,
    pseudoPrefix
  }: SchemaValueParserOptions<T>
) {
  const path: Path = [];
  const inputStack: Input<T>[] = [input];
  const encodedPseudoPrefix = encode(pseudoPrefix);
  const keyInputStack: Input<T>[] = [input[`${encodedPseudoPrefix}${encode(KEY_INPUT_KEY)}`]];
  const oneOfStack: Input<T>[] = [input[`${encodedPseudoPrefix}${encode(ONE_OF)}`]];
  const anyOfStack: Input<T>[] = [input[`${encodedPseudoPrefix}${encode(ANY_OF)}`]];
  const COMBINATION_STACKS: Record<CombinationIdentifiableElement, Input<T>[]> = {
    [ONE_OF]: oneOfStack,
    [ANY_OF]: anyOfStack
  };

  function pushKey(input: Record<string, Input<T>>, decodedKey: string) {
    path.push(decodedKey);
    const encodedKey = encode(decodedKey);
    inputStack.push(input[encodedKey]);
    const keyInput = keyInputStack[keyInputStack.length - 1];
    keyInputStack.push(isRecord(keyInput) ? keyInput[encodedKey] : undefined);
    const oneOf = oneOfStack[oneOfStack.length - 1];
    oneOfStack.push(isRecord(oneOf) ? oneOf[encodedKey] : undefined);
    const anyOf = anyOfStack[anyOfStack.length - 1];
    anyOfStack.push(isRecord(anyOf) ? anyOf[encodedKey] : undefined);
  }
  function pushIndex(input: Input<T>[], index: number) {
    path.push(index);
    inputStack.push(input[index]);
    const keyInput = keyInputStack[keyInputStack.length - 1];
    keyInputStack.push(Array.isArray(keyInput) ? keyInput[index] : undefined);
    const oneOf = oneOfStack[oneOfStack.length - 1];
    oneOfStack.push(Array.isArray(oneOf) ? oneOf[index] : undefined);
    const anyOf = anyOfStack[anyOfStack.length - 1];
    anyOfStack.push(Array.isArray(anyOf) ? anyOf[index] : undefined);
  }
  function pop() {
    path.pop();
    inputStack.pop();
    keyInputStack.pop();
    oneOfStack.pop();
    anyOfStack.pop();
  }

  const convert = (schema: SchemaDefinition, uiSchema: UiSchema, value: Input<T>) =>
    convertEntry(signal, {
      path,
      schema,
      uiSchema,
      value: value as T | undefined
    });

  async function parseCombination(
    element: CombinationIdentifiableElement,
    schemas: SchemaDefinition[],
    uiSchemas: UiSchemaDefinition | UiSchemaDefinition[],
    schema: Schema,
    value: SchemaValue | undefined
  ) {
    if (isSelect(validator, merger, schema, rootSchema)) {
      return value;
    }
    const stack = COMBINATION_STACKS[element];
    const bestIndex =
      ((await convert(
        { type: 'integer' },
        {},
        (stack[stack.length - 1] as Record<string, Input<T>>)[encodedPseudoPrefix]
      )) as number | undefined) ??
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
      value
    );
  }

  async function parseArray(
    schema: Schema,
    uiSchema: UiSchema,
    value: SchemaArrayValue
  ): Promise<SchemaValue | undefined> {
    const { items, additionalItems } = schema;
    const input = inputStack[inputStack.length - 1];
    if (Array.isArray(input) && items !== undefined) {
      const uiItems = uiSchema.items ?? {};
      const uiIsArray = Array.isArray(uiItems);
      let i = 0;
      if (Array.isArray(items)) {
        for (; i < items.length; i++) {
          pushIndex(input, i);
          value.push(await parseSchemaDef(items[i], uiIsArray ? uiItems[i] : uiItems, undefined));
          pop();
        }
        if (additionalItems !== undefined) {
          const additionalUiSchema = uiSchema.additionalItems ?? {};
          while (i < input.length) {
            pushIndex(input, i++);
            value.push(await parseSchemaDef(additionalItems, additionalUiSchema, undefined));
            pop();
          }
        }
      } else {
        for (; i < input.length; i++) {
          pushIndex(input, i);
          value.push(await parseSchemaDef(items, uiIsArray ? uiItems[i] : uiItems, undefined));
          pop();
        }
      }
    }
    return value;
  }

  async function parseObject(schema: Schema, uiSchema: UiSchema, value: SchemaObjectValue) {
    const input = inputStack[inputStack.length - 1];
    if (!isRecord(input)) {
      return value;
    }

    async function setProperty(
      property: string,
      schemaDef: SchemaDefinition,
      uiSchema: UiSchemaDefinition
    ) {
      if (value[property] === undefined) {
        const propValue = await parseSchemaDef(schemaDef, uiSchema, undefined);
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
        pushKey(input, key);
        await setProperty(key, properties[key], (uiSchema[key] ?? {}) as UiSchema);
        pop();
      }
    }
    if (additionalProperties !== undefined) {
      const knownProperties = new Set(getKnownProperties(schema, rootSchema));
      const keys = Object.keys(input);
      let additionalKeys = keyInputStack[keyInputStack.length - 1] as
        | Record<string, Record<string, string>>
        | undefined;
      if (!isRecord(additionalKeys)) {
        additionalKeys = {};
      }
      const additionalUiSchema = uiSchema.additionalProperties ?? {};
      for (let i = 0; i < keys.length; i++) {
        const encodedKey = keys[i];
        const key = decode(encodedKey);
        if (knownProperties.has(key)) {
          continue;
        }
        pushKey(input, key);
        await setProperty(
          additionalKeys[encodedKey][encodedPseudoPrefix] ?? key,
          additionalProperties,
          additionalUiSchema
        );
        pop();
      }
    }
    return value;
  }

  async function parseSchemaDef(
    schema: SchemaDefinition,
    uiSchema: UiSchemaDefinition,
    value: SchemaValue | undefined
  ): Promise<SchemaValue | undefined> {
    uiSchema = resolveUiRef(rootUiSchema, uiSchema) ?? {};
    if (!isSchemaObject(schema)) {
      return schema ? convert(schema, uiSchema, inputStack[inputStack.length - 1]) : undefined;
    }
    const { $ref: ref, oneOf, anyOf, allOf } = schema;
    if (ref !== undefined) {
      return parseSchemaDef(resolveRef(ref, rootSchema), uiSchema, value);
    }
    if (oneOf) {
      value = await parseCombination(ONE_OF, oneOf, uiSchema.oneOf ?? uiSchema, schema, value);
    }
    if (anyOf) {
      value = await parseCombination(ANY_OF, anyOf, uiSchema.anyOf ?? uiSchema, schema, value);
    }
    const type = getSimpleSchemaType(schema);
    if (type === 'object') {
      value = await parseObject(schema, uiSchema, isSchemaObjectValue(value) ? value : {});
    } else if (type === 'array') {
      value = await parseArray(schema, uiSchema, isSchemaArrayValue(value) ? value : []);
    } else if (value === undefined) {
      value = await convert(schema, uiSchema, inputStack[inputStack.length - 1]);
    }
    return value;
  }

  pushKey(input, idPrefix);
  path.pop();
  return parseSchemaDef(rootSchema, rootUiSchema, undefined);
}
