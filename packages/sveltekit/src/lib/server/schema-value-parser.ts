import { isObject } from '@sjsf/form/lib/object';
import { escapeRegex } from '@sjsf/form/lib/reg-exp';
import {
  getClosestMatchingOption2,
  getDiscriminatorFieldFromSchema,
  getSimpleSchemaType,
  isSchema,
  isSchemaArrayValue,
  isSchemaObjectValue,
  isSelect2,
  resolveRef,
  getKnownProperties,
  type Merger2,
  type SchemaArrayValue,
  type SchemaDefinition,
  type SchemaObjectValue,
  type Validator
} from '@sjsf/form/core';
import type { Schema, SchemaValue, UiSchema } from '@sjsf/form';

import type { Entries, EntriesConverter, Entry } from './entry';

export interface SchemaValueParserOptions<T> {
  schema: Schema;
  uiSchema: UiSchema;
  entries: Entries<T>;
  idPrefix: string;
  idSeparator: string;
  idPseudoSeparator: string;
  validator: Validator;
  merger: Merger2;
  convertEntries: EntriesConverter<T>;
}

const KNOWN_PROPERTIES = Symbol('known-properties');

export function parseSchemaValue<T>({
  convertEntries,
  entries,
  idPrefix,
  idPseudoSeparator,
  idSeparator: originalIdSeparator,
  schema: rootSchema,
  uiSchema: rootUiSchema,
  validator,
  merger
}: SchemaValueParserOptions<T>) {
  if (entries.length === 0) {
    return undefined;
  }

  const idSeparator = escapeRegex(originalIdSeparator);
  const BOUNDARY = `($|${idSeparator})`;
  let filter = '';
  const filterLengthStack: number[] = [];
  const entriesStack: Entries<T>[] = [removePseudoElements(entries, idPseudoSeparator)];

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

  function pushFilter(cmp: string) {
    filter += cmp;
    filterLengthStack.push(cmp.length);
  }

  function popFilter() {
    const len = filterLengthStack.pop()!;
    filter = filter.slice(0, -len);
  }

  function pushFilterAndEntries(cmp: string) {
    pushFilter(cmp);
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

  function parseObject(schema: Schema, uiSchema: UiSchema, value: SchemaObjectValue) {
    function setProperty(property: string, schemaDef: SchemaDefinition, uiSchema: UiSchema) {
      if (value[property] === undefined) {
        const propertyValue = parseSchemaDef(schemaDef, uiSchema);
        if (propertyValue !== undefined) {
          value[property] = propertyValue;
        }
      }
    }

    const { properties, additionalProperties } = schema;

    if (properties !== undefined) {
      for (const [property, schema] of Object.entries(properties)) {
        pushFilterAndEntries(`${idSeparator}${escapeRegex(property)}`);
        setProperty(property, schema, (uiSchema[property] ?? {}) as UiSchema);
        popEntriesAndFilter();
      }
    }
    if (additionalProperties !== undefined) {
      const knownProperties = new Set(getKnownProperties(schema, rootSchema));
      for (const entry of entriesStack[entriesStack.length - 1]) {
        const keyEnd = entry[0].indexOf(originalIdSeparator, filter.length);
        const key = entry[0].slice(filter.length, keyEnd === -1 ? undefined : keyEnd);
        if (knownProperties.has(key)) {
          addGroupEntry(KNOWN_PROPERTIES, entry);
        } else {
          addGroupEntry(key, entry);
        }
      }
      const { known, unknown } = popGroupEntries();
      entriesStack[entriesStack.length - 1] = known;
      for (const [key, entries] of unknown) {
        pushFilter(`${idSeparator}${escapeRegex(key)}`);
        entriesStack.push(entries);
        setProperty(key, additionalProperties, uiSchema.additionalProperties ?? {});
        entriesStack.pop();
        popFilter();
      }
    }
    return value;
  }

  function parseArray(schema: Schema, uiSchema: UiSchema, value: SchemaArrayValue) {
    const { items, additionalItems } = schema;
    if (items !== undefined) {
      if (Array.isArray(items)) {
        const uiItems = uiSchema.items ?? {};
        const uiIsArray = Array.isArray(uiItems);
        for (let i = 0; i < items.length; i++) {
          pushFilterAndEntries(`${idSeparator}${i}`);
          value.push(parseSchemaDef(items[i], uiIsArray ? uiItems[i] : uiItems));
          popEntriesAndFilter();
        }
        if (additionalItems !== undefined) {
          let i = items.length;
          while (entriesStack[entriesStack.length - 1].length > 0) {
            pushFilterAndEntries(`${idSeparator}${i++}`);
            if (i === items.length + 1 && entriesStack[entriesStack.length - 1].length === 0) {
              popEntriesAndFilter();
              break;
            }
            value.push(parseSchemaDef(additionalItems, uiSchema.additionalItems ?? {}));
            popEntriesAndFilter();
          }
        }
      } else {
        let i = 0;
        const uiItems = uiSchema.items ?? {};
        const uiIsArray = Array.isArray(uiItems);
        while (entriesStack[entriesStack.length - 1].length > 0) {
          pushFilterAndEntries(`${idSeparator}${i++}`);
          // Special case: array items have no indexes, but they have the same names
          if (i === 1 && entriesStack[entriesStack.length - 1].length === 0) {
            popEntriesAndFilter();
            const arrayEntries = entriesStack[entriesStack.length - 1];
            for (let j = 0; j < arrayEntries.length; j++) {
              entriesStack.push([arrayEntries[j]]);
              value.push(parseSchemaDef(items, uiIsArray ? (uiItems[j] ?? {}) : uiItems));
              entriesStack.pop();
            }
            arrayEntries.length = 0;
            break;
          }
          value.push(parseSchemaDef(items, uiIsArray ? uiItems[i - 1] : uiItems));
          popEntriesAndFilter();
        }
      }
    }
    return value;
  }

  function handleAllOf(
    allOf: Schema['allOf'],
    allOffUiSchema: UiSchema | UiSchema[],
    value: SchemaValue | undefined
  ) {
    if (!Array.isArray(allOf)) {
      return value;
    }
    const isArray = Array.isArray(allOffUiSchema);
    for (let i = 0; i < allOf.length; i++) {
      value = parseSchemaDef(allOf[i], isArray ? allOffUiSchema[i] : allOffUiSchema, value);
    }
    return value;
  }

  function handleOneOf(
    oneOf: Schema['oneOf'],
    schema: Schema,
    oneOfUiSchema: UiSchema | UiSchema[],
    value: SchemaValue | undefined
  ) {
    if (!Array.isArray(oneOf) || isSelect2(validator, merger, schema, rootSchema)) {
      return value;
    }
    const bestIndex = getClosestMatchingOption2(
      validator,
      merger,
      rootSchema,
      value,
      oneOf.map((def) => {
        if (typeof def === 'boolean') {
          return def ? {} : { not: {} };
        }
        return def;
      }),
      0,
      getDiscriminatorFieldFromSchema(schema)
    );
    return parseSchemaDef(
      oneOf[bestIndex],
      Array.isArray(oneOfUiSchema) ? oneOfUiSchema[bestIndex] : oneOfUiSchema,
      value
    );
  }

  function handleAnyOf(schema: Schema, uiSchema: UiSchema, value: SchemaValue | undefined) {
    const { anyOf } = schema;
    if (!Array.isArray(anyOf)) {
      return value;
    }
    if (
      value === undefined ||
      (isObject(value) &&
        (Array.isArray(value) ? value.length === 0 : Object.keys(value).length === 0))
    ) {
      return handleAllOf(anyOf, uiSchema.anyOf ?? uiSchema, value);
    }
    return handleOneOf(anyOf, schema, uiSchema.anyOf ?? uiSchema, value);
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

  function handleDependencies(schema: Schema, uiSchema: UiSchema, value: SchemaValue | undefined) {
    const { dependencies } = schema;
    if (dependencies === undefined || !isSchemaObjectValue(value)) {
      return value;
    }
    for (const [key, deps] of Object.entries(dependencies)) {
      if (!(key in value) || Array.isArray(deps)) {
        continue;
      }
      value = parseSchemaDef(deps, uiSchema, value) as SchemaObjectValue;
    }
    return value;
  }

  function parseSchemaDef(
    schema: SchemaDefinition,
    uiSchema: UiSchema,
    value?: SchemaValue
  ): SchemaValue | undefined {
    if (!isSchema(schema)) {
      return schema
        ? convertEntries({ schema, uiSchema, entries: entriesStack[entriesStack.length - 1] })
        : undefined;
    }
    const { $ref: ref } = schema;
    if (ref !== undefined) {
      return parseSchemaDef(resolveRef(ref, rootSchema), uiSchema);
    }
    const type = getSimpleSchemaType(schema);
    if (type === 'object') {
      value = parseObject(schema, uiSchema, isSchemaObjectValue(value) ? value : {});
    } else if (type === 'array') {
      value = parseArray(schema, uiSchema, isSchemaArrayValue(value) ? value : []);
    } else if (value === undefined) {
      value = convertEntries({ schema, uiSchema, entries: entriesStack[entriesStack.length - 1] });
    }
    return handleDependencies(
      schema,
      uiSchema,
      handleAnyOf(
        schema,
        uiSchema,
        handleAllOf(
          schema.allOf,
          (uiSchema.allOf as UiSchema) ?? uiSchema,
          handleOneOf(
            schema.oneOf,
            schema,
            uiSchema.oneOf ?? uiSchema,
            handleConditions(schema, uiSchema, value)
          )
        )
      )
    );
  }

  pushFilterAndEntries(`^${escapeRegex(idPrefix)}`);
  return parseSchemaDef(rootSchema, rootUiSchema);
}

function removePseudoElements<T>(entries: Entries<T>, idPseudoSeparator: string) {
  return entries.filter(([key]) => key.lastIndexOf(idPseudoSeparator) === -1);
}
