import { some } from '@sjsf/form/lib/array';
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
  typeOfSchema,
  isArrayOrObjectSchemaType,
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

import type { Entries, EntryConverter, Entry } from './entry.js';

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
}

const KNOWN_PROPERTIES = Symbol('known-properties');

const KEY_INPUT_KEY: keyof IdentifiableFieldElement = 'key-input';
const ONE_OF = 'oneof' satisfies keyof IdentifiableFieldElement;
const ANY_OF = 'anyof' satisfies keyof IdentifiableFieldElement;

export function parseSchemaValue<T>(
  signal: AbortSignal,
  {
    convertEntry,
    entries,
    idPrefix,
    idPseudoSeparator,
    idSeparator,
    schema: rootSchema,
    uiSchema: rootUiSchema,
    validator,
    merger,
    idIndexSeparator
  }: SchemaValueParserOptions<T>
): Promise<SchemaValue | undefined> {
  const escapedIdSeparator = escapeRegex(idSeparator);
  const escapedIndexSeparator = escapeRegex(idIndexSeparator);
  const escapedIdOrIndexSeparator = `(${escapedIdSeparator}|${escapedIndexSeparator})`;
  const escapedPseudoSeparator = escapeRegex(idPseudoSeparator);

  const BOUNDARY = `($|${escapedIdSeparator}|${escapedPseudoSeparator}|${escapedIndexSeparator})`;
  const SEPARATED_KEY_INPUT_KEY = `${idPseudoSeparator}${KEY_INPUT_KEY}`;
  let filter = '';
  const filterLengthStack: number[] = [];
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

  function pushFilter(escapedSeparator: string, item: Path[number]) {
    const cmp = `${escapedSeparator}${typeof item === 'string' ? escapeRegex(item) : item}`;
    path.push(item);
    filter += cmp;
    filterLengthStack.push(cmp.length);
  }

  function popFilter() {
    const len = filterLengthStack.pop()!;
    filter = filter.slice(0, -len);
    path.pop();
  }

  function pushFilterAndEntries(escapedSeparator: string, item: Path[number]) {
    pushFilter(escapedSeparator, item);
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
    const { properties, additionalProperties } = schema;

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
        pushFilterAndEntries(escapedIdSeparator, property);
        await setProperty(property, schema, (uiSchema[property] ?? {}) as UiSchema);
        popEntriesAndFilter();
      }
    }
    if (additionalProperties !== undefined) {
      const knownProperties = new Set(getKnownProperties(schema, rootSchema));
      const additionalKeys = new Map<string, string>();
      const isObjectOrArraySchema =
        isSchemaObject(additionalProperties) &&
        some(typeOfSchema(additionalProperties), isArrayOrObjectSchemaType);
      for (const entry of entriesStack[entriesStack.length - 1]) {
        const str = entry[0];
        let keyEnd: number | undefined = str.indexOf(idSeparator, filter.length);
        if (keyEnd !== -1 && !isObjectOrArraySchema) {
          keyEnd = -1;
        }
        if (keyEnd === -1) {
          const val = entry[1];
          if (str.endsWith(SEPARATED_KEY_INPUT_KEY) && typeof val === 'string') {
            const group = str.slice(filter.length, str.length - SEPARATED_KEY_INPUT_KEY.length);
            additionalKeys.set(group, val);
            continue;
          }
          keyEnd = undefined;
        }
        const key = str.slice(filter.length, keyEnd);
        if (knownProperties.has(key)) {
          addGroupEntry(KNOWN_PROPERTIES, entry);
        } else {
          addGroupEntry(key, entry);
        }
      }
      const { known, unknown } = popGroupEntries();
      entriesStack[entriesStack.length - 1] = known;
      for (const [key, entries] of unknown) {
        pushFilter(escapedIdSeparator, key);
        entriesStack.push(entries);
        await setProperty(
          additionalKeys.get(key) ?? key,
          additionalProperties,
          uiSchema.additionalProperties ?? {}
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
      if (Array.isArray(items)) {
        const uiItems = uiSchema.items ?? {};
        const uiIsArray = Array.isArray(uiItems);
        for (let i = 0; i < items.length; i++) {
          pushFilterAndEntries(escapedIdOrIndexSeparator, i);
          value.push(await parseSchemaDef(items[i], uiIsArray ? uiItems[i] : uiItems, undefined));
          popEntriesAndFilter();
        }
        if (additionalItems !== undefined) {
          let i = items.length;
          while (entriesStack[entriesStack.length - 1].length > 0) {
            pushFilterAndEntries(escapedIdOrIndexSeparator, i++);
            if (i === items.length + 1 && entriesStack[entriesStack.length - 1].length === 0) {
              popEntriesAndFilter();
              break;
            }
            value.push(
              await parseSchemaDef(additionalItems, uiSchema.additionalItems ?? {}, undefined)
            );
            popEntriesAndFilter();
          }
        }
      } else {
        let i = 0;
        const uiItems = uiSchema.items ?? {};
        const uiIsArray = Array.isArray(uiItems);
        while (entriesStack[entriesStack.length - 1].length > 0) {
          pushFilterAndEntries(escapedIdOrIndexSeparator, i++);
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
    pushFilterAndEntries(escapedPseudoSeparator, element);
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
      value = await handleAllOf(
        schema.allOf,
        schema,
        (uiSchema.allOf as UiSchema | UiSchema[]) ?? uiSchema,
        value
      );
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

  pushFilterAndEntries('^', idPrefix);
  path.pop();
  return parseSchemaDef(rootSchema, rootUiSchema, undefined);
}
