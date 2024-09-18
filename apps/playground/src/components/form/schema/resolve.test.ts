import { expect, it, describe, beforeEach } from "vitest";
import * as utils from "@rjsf/utils";
import rjsfValidator from "@rjsf/validator-ajv8";
import Ajv from "ajv";

import { AjvValidator } from "@/lib/validator";

import { schemas } from "./fixtures/schemas";
import { retrieveSchema, resolveSchema, resolveAllReferences } from "./resolve";
import type { Validator } from "./validator";

let validator: Validator<any>;

beforeEach(() => {
  validator = new AjvValidator(
    new Ajv({
      allErrors: true,
      discriminator: true,
      strict: false,
      verbose: true,
      multipleOfPrecision: 8,
    })
  );
});

describe.skip('resolveAllReferences', () => {
  it("Should not modify schema", () => {
    for (const schema of schemas) {
      const clone = structuredClone(schema);
      resolveAllReferences(schema, schema);
      expect(clone).toEqual(schema);
    }
  })
})

describe.skip("resolveSchema", () => {
  it("Should not modify schema", () => {
    for (const schema of schemas) {
      const clone = structuredClone(schema);
      resolveSchema(validator, schema, schema, false, new Set());
      expect(clone).toEqual(schema);
    }
  })
})

describe("retrieveSchema", () => {
  it("Should work", () => {
    for (const schema of schemas) {
      expect(retrieveSchema(validator, schema, schema)).toEqual(
        utils.retrieveSchema(rjsfValidator, schema, schema)
      );
    }
  });
});
