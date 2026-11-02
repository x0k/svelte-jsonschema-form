import {
  registerSchema,
  unregisterSchema,
  validate,
  type SchemaObject,
  type Validator,
} from "@hyperjump/json-schema/draft-07";
import "@hyperjump/json-schema/formats-lite";
import type { Schema } from "@sjsf/form";
import { ON_CHANGE, ON_INPUT } from "@sjsf/form";
import {
  fragmentSchema,
  insertSubSchemaIds,
} from "@sjsf/form/validators/precompile";
import { describe, expect, test } from "vitest";

import { createFormValidatorFactory } from "./validator.js";

const inputSchema = {
  type: "object",
  required: ["email"],
  properties: {
    email: { type: "string", format: "email" },
  },
} as unknown as Schema;

describe("runtime compilation", () => {
  test("a runtime-compiled validator satisfies the retriever", async () => {
    const patch = insertSubSchemaIds(inputSchema, {
      fieldsValidationMode: ON_INPUT | ON_CHANGE,
      createId: () => `https://example.com/rv${Math.random()}`,
    });
    const schemas = fragmentSchema(patch);
    for (const schema of schemas) {
      registerSchema(
        Object.assign(
          { $schema: "http://json-schema.org/draft-07/schema" },
          schema as SchemaObject
        )
      );
    }

    // NOTE: no serialize()/restoreValidator() round-trip
    const compiled = new Map<string, Validator>();
    try {
      for (const schema of schemas) {
        compiled.set(schema.$id!, await validate(schema.$id!));
      }
    } finally {
      for (const s of schemas) {
        unregisterSchema(s.$id!);
      }
    }

    const factory = createFormValidatorFactory({
      validatorRetriever: (schema) => {
        const v = compiled.get((schema as { $id: string }).$id);
        if (!v)
          throw new Error(
            `no validator for ${(schema as { $id: string }).$id}`
          );
        return v;
      },
    });
    const formValidator = factory({ schema: patch.schema });

    // `format` is registered via formats-lite, so an invalid email must fail
    expect(
      formValidator.isValid(patch.schema, patch.schema, {
        email: "not-an-email",
      })
    ).toBe(false);
    expect(
      formValidator.isValid(patch.schema, patch.schema, {
        email: "user@example.com",
      })
    ).toBe(true);
    // `required` still catches a missing value
    expect(formValidator.isValid(patch.schema, patch.schema, {})).toBe(false);
  });
});
