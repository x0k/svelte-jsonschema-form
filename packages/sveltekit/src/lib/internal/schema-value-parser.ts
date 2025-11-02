import { escapeRegex } from '@sjsf/form/lib/reg-exp';
import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import {
  getClosestMatchingOption,
  getDiscriminatorFieldFromSchema,
  getSimpleSchemaType,
  isSchemaArrayValue,
  isSchemaObjectValue,
  isSelect,
  resolveRef,
  getKnownProperties,
  type Merger,
  type SchemaArrayValue,
  type SchemaDefinition,
  type SchemaObjectValue,
  type Validator,
  type Path
} from '@sjsf/form/core';
import {
  resolveUiRef,
  type IdentifiableFieldElement,
  type Schema,
  type SchemaValue,
  type UiSchema,
  type UiSchemaDefinition,
  type UiSchemaRoot
} from '@sjsf/form';

import type { Codec, Entries, Entry, EntryConverter } from '$lib/model.js';
import { KEY_INPUT_KEY, ONE_OF, ANY_OF, compilePatterns } from '$lib/internal.js';

export interface SchemaValueParserOptions<T> {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  entries: Entries<T>;
  idPrefix: string;
  idSeparator: string;
  idIndexSeparator: string;
  idPseudoSeparator: string;
  validator: Validator;
  merger: Merger;
  convertEntry: EntryConverter<T>;
  codec: Codec;
}

const KNOWN_PROPERTIES = Symbol('known-properties');

export function parseSchemaValue<T>(
  signal: AbortSignal,
  {
    convertEntry,
    entries,
    idPrefix,
    idIndexSeparator,
    idPseudoSeparator,
    idSeparator,
    schema: rootSchema,
    uiSchema: rootUiSchema,
    validator,
    merger,
    codec: { encode, decode }
  }: SchemaValueParserOptions<T>
): Promise<SchemaValue | undefined> {
  const escapedPropertySeparator = escapeRegex(idSeparator);
  const escapedIndexSeparator = escapeRegex(idIndexSeparator);
  const escapedPseudoSeparator = escapeRegex(idPseudoSeparator);
  const separators: Record<string, string> = {
    [escapedPropertySeparator]: idSeparator,
    [escapedIndexSeparator]: idIndexSeparator,
    [escapedPseudoSeparator]: idPseudoSeparator
  };
  const PROPERTY_OR_INDEX_SEPARATOR = `(${escapedPropertySeparator}|${escapedIndexSeparator})`;
  const BOUNDARY = `($|${escapedPropertySeparator}|${escapedPseudoSeparator}|${escapedIndexSeparator})`;
  const SEPARATED_KEY_INPUT_KEY = `${idPseudoSeparator}${encode(KEY_INPUT_KEY)}`;
  let filter = '';
  const filterLenStack: number[] = [];
  let pathStr = '';
  const pathStrLenStack: number[] = [];
  const path: Path = [];
  const entriesStack: Entries<T>[] = [entries];

  const convert = (schema: SchemaDefinition, uiSchema: UiSchema) =>
    convertEntry(signal, {
      path,
      schema,
      uiSchema,
      value: entriesStack[entriesStack.length - 1][0]?.[1]
    });

  const groups = new Map<string | typeof KNOWN_PROPERTIES, Entries<T>>();
  function addGroupEntry(key: string | typeof KNOWN_PROPERTIES, entry: Entry<T>) {
    const group = groups.get(key);
    if (group) {
      group.push(entry);
    } else {
      groups.set(key, [entry]);
    }
  }
  function popGroupEntries() {
    const known = groups.get(KNOWN_PROPERTIES) ?? [];
    groups.delete(KNOWN_PROPERTIES);
    const unknown = Array.from(groups.entries()) as [string, Entries<T>][];
    groups.clear();
    return { known, unknown };
  }

  function pushFilter(
    escapedSeparator: string,
    encodedKey: Path[number],
    decodedKey: Path[number]
  ) {
    path.push(decodedKey);
    const branch = `${separators[escapedSeparator] ?? ''}${encodedKey}`;
    pathStr += branch;
    pathStrLenStack.push(branch.length);
    const cmp = `${escapedSeparator}${typeof encodedKey === 'string' ? escapeRegex(encodedKey) : encodedKey}`;
    filter += cmp;
    filterLenStack.push(cmp.length);
  }

  function popFilter() {
    let len = filterLenStack.pop()!;
    filter = filter.slice(0, -len);
    len = pathStrLenStack.pop()!;
    pathStr = pathStr.slice(0, -len);
    path.pop();
  }

  function pushFilterAndEntries(
    escapedSeparator: string,
    encodedKey: Path[number],
    decodedKey: Path[number]
  ) {
    pushFilter(escapedSeparator, encodedKey, decodedKey);
    const last = entriesStack[entriesStack.length - 1];
    const regExp = new RegExp(filter + BOUNDARY);
    const right: Entries<T> = [];
    const left: Entries<T> = [];
    for (const entry of last) {
      if (regExp.test(entry[0])) {
        right.push(entry);
      } else {
        left.push(entry);
      }
    }
    entriesStack[entriesStack.length - 1] = left;
    entriesStack.push(right);
  }

  function popEntriesAndFilter() {
    entriesStack.pop();
    popFilter();
  }

  async function parseObject(schema: Schema, uiSchema: UiSchema, value: SchemaObjectValue) {
    const { properties, additionalProperties, patternProperties } = schema;

    async function setProperty(
      property: string,
      schemaDef: SchemaDefinition,
      uiSchema: UiSchemaDefinition
    ) {
      if (value[property] === undefined) {
        const propertyValue = await parseSchemaDef(schemaDef, uiSchema, undefined);
        if (propertyValue !== undefined) {
          value[property] = propertyValue;
        }
      }
    }

    if (properties !== undefined) {
      for (const [property, schema] of Object.entries(properties)) {
        pushFilterAndEntries(escapedPropertySeparator, encode(property), property);
        await setProperty(property, schema, (uiSchema[property] ?? {}) as UiSchema);
        popEntriesAndFilter();
      }
    }
    let knownProperties: Set<string>;
    const keyStart = pathStr.length + idSeparator.length;
    if (patternProperties !== undefined) {
      knownProperties ??= new Set(getKnownProperties(schema, rootSchema));
      const encodedKeyToNewDecodedKey = new Map<string, string>();
      const patterns = compilePatterns(patternProperties);
      for (const entry of entriesStack[entriesStack.length - 1]) {
        const str = entry[0];
        let keyEnd: number | undefined = str.slice(keyStart).search(PROPERTY_OR_INDEX_SEPARATOR);
        if (keyEnd === -1) {
          const val = entry[1];
          if (str.endsWith(SEPARATED_KEY_INPUT_KEY) && typeof val === 'string') {
            const encodedGroup = str.slice(keyStart, str.length - SEPARATED_KEY_INPUT_KEY.length);
            encodedKeyToNewDecodedKey.set(encodedGroup, val);
            continue;
          }
          keyEnd = undefined;
        }
        const encodedKey = str.slice(keyStart, keyEnd);
        const decodedKey = decode(encodedKey);
        if (knownProperties.has(decodedKey)) {
          addGroupEntry(KNOWN_PROPERTIES, entry);
        } else {
          addGroupEntry(decodedKey, entry);
        }
      }
      const { known, unknown } = popGroupEntries();
      entriesStack[entriesStack.length - 1] = known;
      for (const { regExp, schema } of patterns) {
        let shift = 0;
        for (let i = 0; i < unknown.length; i++) {
          const [decodedKey, items] = unknown[i];
          if (regExp.test(decodedKey)) {
            const encodedKey = encode(decodedKey);
            pushFilter(escapedPropertySeparator, encodedKey, decodedKey);
            entriesStack.push(items);
            await setProperty(
              encodedKeyToNewDecodedKey.get(encodedKey) ?? decodedKey,
              schema,
              uiSchema
            );
            entriesStack.pop();
            popFilter();
            shift++;
          } else {
            unknown[i - shift] = unknown[i];
          }
        }
        unknown.length -= shift;
      }
      if (unknown.length > 0) {
        for (const [, items] of unknown) {
          known.push(...items);
        }
      }
    }
    if (additionalProperties) {
      knownProperties ??= new Set(getKnownProperties(schema, rootSchema));
      const encodedKeyToNewDecodedKey = new Map<string, string>();
      for (const entry of entriesStack[entriesStack.length - 1]) {
        const str = entry[0];
        let keyEnd: number | undefined = str.slice(keyStart).search(PROPERTY_OR_INDEX_SEPARATOR);
        if (keyEnd === -1) {
          const val = entry[1];
          if (str.endsWith(SEPARATED_KEY_INPUT_KEY) && typeof val === 'string') {
            const encodedGroup = str.slice(keyStart, str.length - SEPARATED_KEY_INPUT_KEY.length);
            encodedKeyToNewDecodedKey.set(encodedGroup, val);
            continue;
          }
          keyEnd = undefined;
        }
        const encodedKey = str.slice(keyStart, keyEnd);
        const decodedKey = decode(encodedKey);
        if (knownProperties.has(decodedKey)) {
          addGroupEntry(KNOWN_PROPERTIES, entry);
        } else {
          addGroupEntry(decodedKey, entry);
        }
      }
      const { known, unknown } = popGroupEntries();
      entriesStack[entriesStack.length - 1] = known;
      const additionalUiSchema = uiSchema.additionalProperties ?? {};
      for (const [decodedKey, entries] of unknown) {
        const encodedKey = encode(decodedKey);
        pushFilter(escapedPropertySeparator, encodedKey, decodedKey);
        entriesStack.push(entries);
        await setProperty(
          encodedKeyToNewDecodedKey.get(encodedKey) ?? decodedKey,
          additionalProperties,
          additionalUiSchema
        );
        entriesStack.pop();
        popFilter();
      }
    }
    return value;
  }

  async function parseArray(schema: Schema, uiSchema: UiSchema, value: SchemaArrayValue) {
    const { items, additionalItems } = schema;
    if (items !== undefined) {
      const uiItems = uiSchema.items ?? {};
      const uiIsArray = Array.isArray(uiItems);
      let i = 0;
      if (Array.isArray(items)) {
        for (; i < items.length; i++) {
          pushFilterAndEntries(escapedIndexSeparator, i, i);
          value.push(await parseSchemaDef(items[i], uiIsArray ? uiItems[i] : uiItems, undefined));
          popEntriesAndFilter();
        }
        if (additionalItems !== undefined) {
          const additionalUiSchema = uiSchema.additionalItems ?? {};
          while (entriesStack[entriesStack.length - 1].length > 0) {
            pushFilterAndEntries(escapedIndexSeparator, i, i);
            i++;
            if (i === items.length + 1 && entriesStack[entriesStack.length - 1].length === 0) {
              popEntriesAndFilter();
              break;
            }
            value.push(await parseSchemaDef(additionalItems, additionalUiSchema, undefined));
            popEntriesAndFilter();
          }
        }
      } else {
        while (entriesStack[entriesStack.length - 1].length > 0) {
          pushFilterAndEntries(escapedIndexSeparator, i, i);
          i++;
          // Special case: array items have no indexes, but they have the same names
          if (i === 1 && entriesStack[entriesStack.length - 1].length === 0) {
            popEntriesAndFilter();
            const arrayEntries = entriesStack[entriesStack.length - 1];
            for (let j = 0; j < arrayEntries.length; j++) {
              entriesStack.push([arrayEntries[j]]);
              value.push(
                await parseSchemaDef(items, uiIsArray ? (uiItems[j] ?? {}) : uiItems, undefined)
              );
              entriesStack.pop();
            }
            arrayEntries.length = 0;
            break;
          }
          value.push(await parseSchemaDef(items, uiIsArray ? uiItems[i - 1] : uiItems, undefined));
          popEntriesAndFilter();
        }
      }
    }
    return value;
  }

  async function handleAllOf(
    allOf: SchemaDefinition[],
    schema: Schema,
    allOffUiSchema: UiSchemaDefinition | UiSchemaDefinition[],
    value: SchemaValue | undefined
  ) {
    const isArray = Array.isArray(allOffUiSchema);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { allOf: _, ...rest } = schema;
    for (let i = 0; i < allOf.length; i++) {
      const subSchema = allOf[i];
      value = await parseSchemaDef(
        typeof subSchema === 'boolean' ? subSchema : { ...rest, ...subSchema },
        isArray ? allOffUiSchema[i] : allOffUiSchema,
        value
      );
    }
    return value;
  }

  async function handleCombination(
    element: keyof IdentifiableFieldElement,
    schemas: SchemaDefinition[],
    uiSchemas: UiSchemaDefinition | UiSchemaDefinition[],
    schema: Schema,
    value: SchemaValue | undefined
  ) {
    if (isSelect(validator, merger, schema, rootSchema)) {
      return value;
    }
    pushFilterAndEntries(escapedPseudoSeparator, encode(element), element);
    const bestIndex =
      ((await convert({ type: 'integer' }, {})) as number | undefined) ??
      getClosestMatchingOption(
        validator,
        merger,
        rootSchema,
        value,
        schemas.map((def) => {
          if (typeof def === 'boolean') {
            return def ? {} : { not: {} };
          }
          return def;
        }),
        0,
        getDiscriminatorFieldFromSchema(schema)
      );
    popEntriesAndFilter();
    return parseSchemaDef(
      schemas[bestIndex],
      Array.isArray(uiSchemas) ? uiSchemas[bestIndex] : uiSchemas,
      value
    );
  }

  function handleConditions(schema: Schema, uiSchema: UiSchema, value: SchemaValue | undefined) {
    const { if: expression, then, else: otherwise } = schema;
    if (expression === undefined) {
      return value;
    }
    const isThenBranch =
      typeof expression === 'boolean'
        ? expression
        : validator.isValid(expression, rootSchema, value);
    const branch = isThenBranch ? then : otherwise;
    return branch === undefined ? value : parseSchemaDef(branch, uiSchema, value);
  }

  async function handleDependencies(
    schema: Schema,
    uiSchema: UiSchema,
    value: SchemaValue | undefined
  ) {
    const { dependencies } = schema;
    if (dependencies === undefined || !isSchemaObjectValue(value)) {
      return value;
    }
    for (const [key, deps] of Object.entries(dependencies)) {
      if (!(key in value) || Array.isArray(deps)) {
        continue;
      }
      value = (await parseSchemaDef(deps, uiSchema, value)) as SchemaObjectValue;
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
      return schema ? await convert(schema, uiSchema) : undefined;
    }
    const { $ref: ref } = schema;
    if (ref !== undefined) {
      return parseSchemaDef(resolveRef(ref, rootSchema), uiSchema, value);
    }
    // NOTE: We can execute `handleCombination` before `parseObject` because:
    // - correct schema index is stored under `oneof/anyof` pseduoelement
    // - handling of `additionalProperties` is based on `getKnownProperties`
    if (schema.oneOf) {
      value = await handleCombination(
        ONE_OF,
        schema.oneOf,
        uiSchema.oneOf ?? uiSchema,
        schema,
        value
      );
    }
    if (schema.anyOf) {
      value = await handleCombination(
        ANY_OF,
        schema.anyOf,
        uiSchema.anyOf ?? uiSchema,
        schema,
        value
      );
    }
    if (schema.allOf) {
      value = await handleAllOf(schema.allOf, schema, uiSchema, value);
    }
    const type = getSimpleSchemaType(schema);
    if (type === 'object') {
      value = await parseObject(schema, uiSchema, isSchemaObjectValue(value) ? value : {});
    } else if (type === 'array') {
      value = await parseArray(schema, uiSchema, isSchemaArrayValue(value) ? value : []);
    } else if (value === undefined) {
      value = await convert(schema, uiSchema);
    }
    value = await handleConditions(schema, uiSchema, value);
    return handleDependencies(schema, uiSchema, value);
  }

  pushFilterAndEntries('^', encode(idPrefix), idPrefix);
  path.pop();
  return parseSchemaDef(rootSchema, rootUiSchema, undefined);
}
