import { some } from '@sjsf/form/lib/array';
import { isObject } from '@sjsf/form/lib/object';
import { escapeRegex } from '@sjsf/form/lib/reg-exp';
import { type Trie, getNodeByKeys, insertValue } from '@sjsf/form/lib/trie';
import {
  getClosestMatchingOption,
  getDiscriminatorFieldFromSchema,
  getSimpleSchemaType,
  isSchema,
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
  isArrayOrObjectSchemaType
} from '@sjsf/form/core';
import type { IdentifiableFieldElement, Schema, SchemaValue, UiSchema } from '@sjsf/form';

import { IDENTIFIABLE_FIELD_ELEMENTS } from '../model.js';

import type { Entries, EntriesConverter, Entry } from './entry.js';

export interface SchemaValueParserOptions<T> {
  schema: Schema;
  uiSchema: UiSchema;
  entries: Entries<T>;
  idPrefix: string;
  idSeparator: string;
  idPseudoSeparator: string;
  validator: Validator;
  merger: Merger;
  convertEntries: EntriesConverter<T>;
  identifiableElementsTrie?: Trie<string, true>;
}

const KNOWN_PROPERTIES = Symbol('known-properties');

const KEY_INPUT_KEY: keyof IdentifiableFieldElement = 'key-input';

let DEFAULT_IDENTIFIABLE_ELEMENTS_TRIE: Trie<string, true>;

for (const key of IDENTIFIABLE_FIELD_ELEMENTS) {
  DEFAULT_IDENTIFIABLE_ELEMENTS_TRIE = insertValue(
    DEFAULT_IDENTIFIABLE_ELEMENTS_TRIE,
    key.split(''),
    true
  );
}

function removePseudoElements<T>(
  entries: Entries<T>,
  idPseudoSeparator: string,
  blacklist: Trie<string, boolean>
) {
  return entries.filter(([key]) => {
    const index = key.lastIndexOf(idPseudoSeparator);
    if (index === -1) {
      return true;
    }
    const subKey = key.substring(index + idPseudoSeparator.length);
    if (subKey === KEY_INPUT_KEY) {
      return true;
    }
    // Numbers are used for enum option ids, not inputs
    // if (Number.isInteger(Number(subKey))) {
    //   return false;
    // }
    const node = getNodeByKeys(blacklist, subKey.split(''));
    return node?.value !== true;
  });
}

export function parseSchemaValue<T>({
  convertEntries,
  entries,
  idPrefix,
  idPseudoSeparator,
  idSeparator: originalIdSeparator,
  schema: rootSchema,
  uiSchema: rootUiSchema,
  validator,
  merger,
  identifiableElementsTrie = DEFAULT_IDENTIFIABLE_ELEMENTS_TRIE
}: SchemaValueParserOptions<T>) {
  if (entries.length === 0) {
    return undefined;
  }
  const idSeparator = escapeRegex(originalIdSeparator);
  const BOUNDARY = `($|${idSeparator})`;
  const SEPARATED_KEY_INPUT_KET = `${idPseudoSeparator}${KEY_INPUT_KEY}`;
  let filter = '';
  const filterLengthStack: number[] = [];
  const entriesStack: Entries<T>[] = [
    removePseudoElements(entries, idPseudoSeparator, identifiableElementsTrie)
  ];

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
      const additionalKeys = new Map<string, string>();
      const isObjectOrArraySchema =
        isSchema(additionalProperties) &&
        some(typeOfSchema(additionalProperties), isArrayOrObjectSchemaType);
      for (const entry of entriesStack[entriesStack.length - 1]) {
        const str = entry[0];
        let keyEnd: number | undefined = str.indexOf(originalIdSeparator, filter.length);
        if (keyEnd !== -1 && !isObjectOrArraySchema) {
          keyEnd = -1;
        }
        if (keyEnd === -1) {
          const val = entry[1];
          if (str.endsWith(SEPARATED_KEY_INPUT_KET) && typeof val === 'string') {
            const group = str.slice(filter.length, str.length - SEPARATED_KEY_INPUT_KET.length);
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
        pushFilter(`${idSeparator}${escapeRegex(key)}`);
        entriesStack.push(entries);
        setProperty(
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
    if (!Array.isArray(oneOf) || isSelect(validator, merger, schema, rootSchema)) {
      return value;
    }
    const bestIndex = getClosestMatchingOption(
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
