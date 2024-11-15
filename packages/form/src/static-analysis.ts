import { isObject } from "@/lib/object.js";
import {
  isSchema,
  makeSchemaDefinitionTraverser,
  SCHEMA_KEYS,
  traverseSchemaValue,
  type Path,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

import {
  DEFAULT_ID_SEPARATOR,
  DEFAULT_ID_PREFIX,
  DEFAULT_PSEUDO_ID_SEPARATOR,
} from "./form/id-schema.js";

export const SEQUENCE_OF_DIGITS_REGEX = /^\d+$/;

export interface SchemaIssue {
  issuer: string;
  message: string;
  path: Path;
}

export const ID_CONFIG_ISSUER = "idConfig";
export const SCHEMA_ISSUER = "schema";

export interface IdConfig {
  prefix: string;
  separator: string;
  pseudoSeparator: string;
}

export function makeIdConfig({
  prefix = DEFAULT_ID_PREFIX,
  pseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR,
  separator = DEFAULT_ID_SEPARATOR
}: Partial<IdConfig> = {}): IdConfig {
  return {
    prefix,
    separator,
    pseudoSeparator
  };
}

export type IdSeparatorEntries = [string, string][];

export function makeIdSeparatorEntries(idConfig: IdConfig): [string, string][] {
  return Object.entries(idConfig).filter((e) => e[0] !== "prefix");
}

export function* idConfigAnalysis(idConfig: IdConfig): Generator<SchemaIssue> {
  const keys = Object.keys(idConfig) as (keyof IdConfig)[];
  for (const key of keys) {
    const value = idConfig[key]!;
    if (value.length === 0) {
      yield {
        issuer: ID_CONFIG_ISSUER,
        message: `values is empty, please provide a value`,
        path: [key],
      };
      continue;
    }
    if (SEQUENCE_OF_DIGITS_REGEX.test(value)) {
      yield {
        issuer: ID_CONFIG_ISSUER,
        message: `value "${value}" should not be a sequence of digits`,
        path: [key],
      };
      continue;
    }
    for (const key2 of keys) {
      if (key === key2) {
        continue;
      }
      const value2 = idConfig[key2]!;
      if (value.includes(value2)) {
        yield {
          issuer: ID_CONFIG_ISSUER,
          message: `value "${value}" includes a value "${value2}" of key "${key2}", expected unique values`,
          path: [key],
        };
      }
    }
  }
}

export function* objectKeyAnalysis(
  issuer: string,
  idSeparatorEntries: IdSeparatorEntries,
  key: string,
  path: Path
): Generator<SchemaIssue> {
  for (const [separator, value] of idSeparatorEntries) {
    if (separator.includes(value)) {
      yield {
        issuer,
        message: `key "${key}" includes separator "${separator}: ${value}", expected: key should not include separator value`,
        path,
      };
    }
  }
}

export function* schemaValueAnalysis(
  issuer: string,
  idSeparatorEntries: IdSeparatorEntries,
  value: SchemaValue,
  basePath: Path = []
): Generator<SchemaIssue> {
  yield* traverseSchemaValue(value, {
    *onEnter(_, ctx) {
      if (ctx.type !== "record") {
        return;
      }
      yield* objectKeyAnalysis(
        issuer,
        idSeparatorEntries,
        ctx.key,
        basePath.concat(ctx.path)
      );
    },
  });
}

export function* schemaAnalysis(
  idSeparatorEntries: IdSeparatorEntries,
  schema: Schema
): Generator<SchemaIssue> {
  yield* makeSchemaDefinitionTraverser(SCHEMA_KEYS, {
    *onEnter(node, ctx) {
      if (!isSchema(node)) {
        return;
      }
      const { properties, default: defaultValue } = node;
      if (properties !== undefined) {
        for (const key of Object.keys(properties)) {
          yield* objectKeyAnalysis(
            SCHEMA_ISSUER,
            idSeparatorEntries,
            key,
            ctx.path
          );
        }
      }
      if (Array.isArray(defaultValue) || isObject(defaultValue)) {
        yield* schemaValueAnalysis(
          `${SCHEMA_ISSUER}::default`,
          idSeparatorEntries,
          defaultValue,
          ctx.path
        );
      }
    },
  })(schema);
}

export interface StaticAnalysisOptions<T extends SchemaValue> {
  schema: Schema;
  idConfig: IdConfig;
  initialValue?: T;
}

export function* staticAnalysis<T extends SchemaValue>({
  schema,
  idConfig,
  initialValue,
}: StaticAnalysisOptions<T>): Generator<SchemaIssue> {
  yield* idConfigAnalysis(idConfig);
  const idSeparatorEntries = makeIdSeparatorEntries(idConfig);
  yield* schemaAnalysis(idSeparatorEntries, schema);
  if (initialValue !== undefined) {
    yield* schemaValueAnalysis(
      "initialValue",
      idSeparatorEntries,
      initialValue
    );
  }
}
