import { expect, it, describe, beforeEach } from "vitest";
import * as utils from "@rjsf/utils";
import rjsfValidator from "@rjsf/validator-ajv8";
import Ajv from "ajv";

import { AjvValidator } from "@/lib/validator";

import { schemas } from "./fixtures/schemas";
import { retrieveSchema } from "./resolve";
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

describe("resolveSchema", () => {
  it("Should work", () => {
    for (const schema of schemas) {
      expect(retrieveSchema(validator, schema, schema)).toEqual(
        utils.retrieveSchema(rjsfValidator, schema, schema, undefined)
      );
    }
  });
});
