import {
  vi,
  beforeEach,
  describe,
  it,
  type MockInstance,
  afterEach,
  expect,
} from "vitest";
import Ajv from "ajv";

import { AjvValidator } from "@/lib/validator";

import type { Schema } from "./schema";
import type { Validator } from "./validator";
import { isMultiSelect, isSelect } from "./is-select";

let testValidator: Validator<any>;
let testValidatorMockValues: boolean[];
let testValidatorMock: MockInstance<Validator<any>["isValid"]>;

beforeEach(() => {
  testValidator = new AjvValidator(
    new Ajv({
      allErrors: true,
      discriminator: true,
      strict: false,
      verbose: true,
      multipleOfPrecision: 8,
    })
  );
  testValidatorMockValues = [];
  testValidatorMock = vi
    .spyOn(testValidator, "isValid")
    .mockImplementation(() => {
      if (testValidatorMockValues.length > 0) {
        return testValidatorMockValues.shift()!;
      }
      return true;
    });
});
afterEach(() => {
  testValidatorMock.mockClear();
});

describe("isSelect()", () => {
  it("should be false if items is undefined", () => {
    const schema: Schema = {};
    expect(isSelect(testValidator, schema, schema)).toBe(false);
  });
  describe("schema items enum is not an array", () => {
    it("should be false if oneOf/anyOf schemas are not all constants", () => {
      const schema: Schema = {
        anyOf: [{ type: "string", enum: ["Foo"] }, { type: "string" }],
      };
      expect(isSelect(testValidator, schema, schema)).toBe(false);
    });
    it("should be true if oneOf/anyOf schemas are all constants", () => {
      const schema: Schema = {
        oneOf: [
          { type: "string", enum: ["Foo"] },
          { type: "string", enum: ["Foo"] },
        ],
      };
      expect(isSelect(testValidator, schema, schema)).toBe(true);
    });
  });
  it("should retrieve reference schema definitions", () => {
    const schema: Schema = {
      definitions: {
        FooItem: { type: "string", enum: ["foo"] },
      },
      $ref: "#/definitions/FooItem",
    };
    expect(isSelect(testValidator, schema, schema)).toBe(true);
  });
});

describe("isMultiSelect()", () => {
  describe("uniqueItems is true", () => {
    describe("schema items enum is an array", () => {
      it("should be true", () => {
        const schema: Schema = {
          items: { enum: ["foo", "bar"] },
          uniqueItems: true,
        };
        expect(isMultiSelect(testValidator, schema, schema)).toBe(true);
      });
    });
    it("should be false if items is undefined", () => {
      const schema: Schema = {};
      expect(isMultiSelect(testValidator, schema, schema)).toBe(false);
    });
    describe("schema items enum is not an array", () => {
      it("should be false if oneOf/anyOf is not in items schema", () => {
        const schema: Schema = { items: {}, uniqueItems: true };
        expect(isMultiSelect(testValidator, schema, schema)).toBe(false);
      });
      it("should be false if oneOf/anyOf schemas are not all constants", () => {
        const schema: Schema = {
          items: {
            oneOf: [{ type: "string", enum: ["Foo"] }, { type: "string" }],
          },
          uniqueItems: true,
        };
        expect(isMultiSelect(testValidator, schema, schema)).toBe(false);
      });
      it("should be true if oneOf/anyOf schemas are all constants", () => {
        const schema: Schema = {
          items: {
            oneOf: [
              { type: "string", enum: ["Foo"] },
              { type: "string", enum: ["Foo"] },
            ],
          },
          uniqueItems: true,
        };
        expect(isMultiSelect(testValidator, schema, schema)).toBe(true);
      });
    });
    it("should retrieve reference schema definitions", () => {
      const schema: Schema = {
        definitions: {
          FooItem: { type: "string", enum: ["foo"] },
        },
        items: { $ref: "#/definitions/FooItem" },
        uniqueItems: true,
      };
      expect(isMultiSelect(testValidator, schema, schema)).toBe(true);
    });
  });
  it("should be false if uniqueItems is false", () => {
    const schema: Schema = {
      items: { enum: ["foo", "bar"] },
      uniqueItems: false,
    };
    expect(isMultiSelect(testValidator, schema, schema)).toBe(false);
  });
});
