import { isObject } from '@/lib/object.js';
import {
  isSchema,
  traverseSchemaDefinition,
  traverseSchemaValue,
  type Path,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

import type { IdConfig } from "./id-schema.js";

/** NOTE: `warn` will be removed in the next major release */
export type SchemaAnalysisStatus = boolean | "warn";

const INDEX_REGEX = /^\d+$/;

function idConfigAnalysis(idConfig: IdConfig): string[] {
  const errors: string[] = [];
  const keys = Object.keys(idConfig) as (keyof IdConfig)[];
  for (const key of keys) {
    const value = idConfig[key]!;
    if (value.length === 0) {
      errors.push(`idConfig: "${key}" is empty, please provide a value`);
      continue;
    }
    if (INDEX_REGEX.test(value)) {
      errors.push(
        `idConfig: "${key}" with value "${value}" should not be a non-negative integer`
      );
      continue;
    }
    for (const key2 of keys) {
      if (key === key2) {
        continue;
      }
      const value2 = idConfig[key2]!;
      if (value.includes(value2)) {
        errors.push(
          `idConfig: "${key}" with value "${value}" includes value "${value2}" of "${key2}", expected unique values`
        );
      }
    }
  }
  return errors;
}

function objectKeyAnalysis(
  issuer: string,
  idSeparatorEntries: [string, string][],
  key: string,
  path: Path
) {
  const errors: string[] = [];
  if (INDEX_REGEX.test(key)) {
    errors.push(
      `${issuer}: "${key}" (${path.join(".")}) should not be a non-negative integer`
    );
    return errors;
  }
  for (const [key, value] of idSeparatorEntries) {
    if (key.includes(value)) {
      errors.push(
        `${issuer}: Object key "${key}" (${path.join(".")}) includes separator "${key}" (${value}"), expected object key should not include separator value`
      );
    }
  }
  return errors;
}

function schemaValueAnalysis(
  issuer: string,
  idSeparatorEntries: [string, string][],
  value: SchemaValue
): string[] {
  const errors: string[] = [];
  traverseSchemaValue(value, {
    onEnter(_, ctx) {
      if (ctx.type !== "record") {
        return;
      }
      errors.push(
        ...objectKeyAnalysis(issuer, idSeparatorEntries, ctx.key, ctx.path)
      );
    },
  });
  return errors;
}

function schemaAnalysis(
  idSeparatorEntries: [string, string][],
  schema: Schema
): string[] {
  const errors: string[] = [];
  traverseSchemaDefinition(schema, {
    onEnter(node, ctx) {
      if (!isSchema(node)) {
        return;
      }
      const { properties, default: defaultValue } = node;
      if (properties !== undefined) {
        for (const key of Object.keys(properties)) {
          errors.push(
            ...objectKeyAnalysis(
              `schemaAnalysis`,
              idSeparatorEntries,
              key,
              ctx.path
            )
          );
        }
      }
      if (Array.isArray(defaultValue) || isObject(defaultValue)) {
        errors.push(
          ...schemaValueAnalysis(
            `schemaAnalysis::defaultValue(${ctx.path.join(".")}):`,
            idSeparatorEntries,
            defaultValue
          )
        );
      }
    },
  });
  return errors;
}
