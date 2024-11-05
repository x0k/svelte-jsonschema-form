import { isObject } from "@/lib/object.js";
import {
  isSchema,
  traverseSchemaDefinition,
  traverseSchemaValue,
  type Path,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

import {
  DEFAULT_ID_INDEX_SEPARATOR,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_PROPERTY_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  type IdConfig,
} from "./form/id-schema.js";

const INDEX_REGEX = /^\d+$/;

export interface SchemaIssue {
  issuer: string;
  message: string;
  path: Path;
}

const ID_CONFIG_ISSUER = "idConfig";
const SCHEMA_ISSUER = "schema";

function* idConfigAnalysis(idConfig: IdConfig): Generator<SchemaIssue> {
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
    if (INDEX_REGEX.test(value)) {
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

function* objectKeyAnalysis(
  issuer: string,
  idSeparatorEntries: [string, string][],
  key: string,
  path: Path
): Generator<SchemaIssue> {
  if (INDEX_REGEX.test(key)) {
    yield {
      issuer,
      message: `key "${key}" should not be a sequence of digits`,
      path,
    };
  }
  for (const [key, value] of idSeparatorEntries) {
    if (key.includes(value)) {
      yield {
        issuer,
        message: `key "${key}" includes separator "${key}: ${value}", expected: key should not include separator value`,
        path,
      };
    }
  }
}

function* schemaValueAnalysis(
  issuer: string,
  idSeparatorEntries: [string, string][],
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

function* schemaAnalysis(
  idSeparatorEntries: [string, string][],
  schema: Schema
): Generator<SchemaIssue> {
  yield* traverseSchemaDefinition(schema, {
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
  });
}

export interface StaticAnalysisOptions<T extends SchemaValue> {
  schema: Schema;
  idPrefix?: string;
  idPropertySeparator?: string;
  idIndexSeparator?: string;
  idPseudoSeparator?: string;
  initialValue?: T;
}

export function* staticAnalysis<T extends SchemaValue>({
  schema,
  idPrefix = DEFAULT_ID_PREFIX,
  idPropertySeparator = DEFAULT_ID_PROPERTY_SEPARATOR,
  idIndexSeparator = DEFAULT_ID_INDEX_SEPARATOR,
  idPseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR,
  initialValue,
}: StaticAnalysisOptions<T>): Generator<SchemaIssue> {
  const idConfig: IdConfig = {
    prefix: idPrefix,
    propertySeparator: idPropertySeparator,
    indexSeparator: idIndexSeparator,
    pseudoSeparator: idPseudoSeparator,
  };
  yield* idConfigAnalysis(idConfig);
  const idSeparatorEntries: [string, string][] = Object.entries(
    idConfig
  ).filter((e) => e[0] !== "prefix");
  yield* schemaAnalysis(idSeparatorEntries, schema);
  if (initialValue !== undefined) {
    yield* schemaValueAnalysis(
      "initialValue",
      idSeparatorEntries,
      initialValue
    );
  }
}
