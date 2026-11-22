/** Test doubles for the core interfaces and a factory for the shared context. */

import { createCoreContext, type CoreContext } from "./context.js";
import {
  isSchemaDeepEqual,
  isSchemaValueDeepEqual,
  type ValueHandler,
} from "./deep-equal.js";
import type { Logger } from "./logger.js";
import type { Merger } from "./merger.js";
import type { Schema, SchemaValue } from "./schema.js";
import type { Validator } from "./validator.js";

interface TestCase {
  schema: Schema;
  value: SchemaValue;
  result: boolean;
}

export function createValidator({
  cases = [],
}: { cases?: TestCase[] } = {}): Validator {
  return {
    isValid(schema, value) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const c = cases.find(
        (c) =>
          isSchemaDeepEqual(c.schema, schema) &&
          isSchemaValueDeepEqual(c.value, value)
      );
      if (c === undefined) {
        throw new Error(
          `Cannot find test case with ${JSON.stringify({ schema, value })}`
        );
      }
      return c.result;
    },
  };
}

export function createMerger({
  merges = [],
  allOfMerges = [],
}: {
  merges?: {
    left: Schema;
    right: Schema;
    result: Schema;
  }[];
  allOfMerges?: {
    input: Schema;
    result: Schema;
  }[];
} = {}): Merger {
  return {
    // NOTE: `retrieveSchemaInternal` calls `mergeAllOf` inside a try-catch
    // and silently drops `allOf` on error, so a missing `allOfMerges` entry
    // will not fail loudly. Always declare every expected `allOf` merge.
    mergeAllOf(schema) {
      const c = allOfMerges.find((c) => isSchemaDeepEqual(c.input, schema));
      if (c === undefined) {
        throw new Error(
          `Cannot find allOfMerge case with ${JSON.stringify({ input: schema })}`
        );
      }
      return c.result;
    },
    mergeSchemas(a, b) {
      const c = merges.find(
        (c) => isSchemaDeepEqual(c.left, a) && isSchemaDeepEqual(c.right, b)
      );
      if (c === undefined) {
        // console.log({ merges, a, b });
        throw new Error(
          `Cannot find merge case with ${JSON.stringify({ left: a, right: b })}`
        );
      }
      return c.result;
    },
  };
}

export interface TestContextOptions {
  validator?: Validator;
  merger?: Merger;
  valueHandler?: ValueHandler;
  rootSchema?: Schema;
  logger?: Logger;
}

export const testValueHandler: ValueHandler = {
  isValueDeepEqual: isSchemaValueDeepEqual,
};

export const testLogger: Logger = {
  warn() {},
  error() {},
};

export interface TestLogMessage {
  level: "warn" | "error";
  message: string;
  error: unknown;
}

export interface TestLoggerOptions {
  messages?: TestLogMessage[];
}

/** Creates a logger that records what it is given, for tests that assert on it. */
export function createTestLogger({ messages }: TestLoggerOptions): Logger {
  return {
    warn(message, error) {
      messages?.push({ level: "warn", message, error });
    },
    error(message, error) {
      messages?.push({ level: "error", message, error });
    },
  };
}

/** Builds a `CoreContext` with test doubles for the fields a test does not care about. */
export function createTestContext({
  validator = createValidator(),
  merger = createMerger(),
  valueHandler = testValueHandler,
  rootSchema = {},
  logger = testLogger,
}: TestContextOptions = {}): CoreContext {
  return createCoreContext({
    validator,
    merger,
    valueHandler,
    rootSchema,
    logger,
  });
}
