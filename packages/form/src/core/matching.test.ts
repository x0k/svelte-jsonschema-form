// This file was copied and modified from https://github.com/heath-freenome/react-jsonschema-form/blob/3f33fe3a0275c5ac355a90f8ac0179eee8dec1f8/packages/utils/test/schema/getClosestMatchingOptionTest.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  oneOfData,
  oneOfSchema,
  ONE_OF_SCHEMA_DATA,
  OPTIONAL_ONE_OF_DATA,
  OPTIONAL_ONE_OF_SCHEMA,
  ONE_OF_SCHEMA_OPTIONS,
  OPTIONAL_ONE_OF_SCHEMA_ONEOF,
} from "./fixtures/test-data.js";

import type { Schema } from "./schema.js";
import { calculateIndexScore, getClosestMatchingOption } from "./matching.js";
import { beforeEach, describe, expect, it } from "vitest";
import type { Validator } from "./validator.js";
import { makeTestValidator } from "./test-validator.js";

const firstOption = oneOfSchema.definitions!.first_option_def as Schema;
const secondOption = oneOfSchema.definitions!.second_option_def as Schema;

let testValidator: Validator;

beforeEach(() => {
  testValidator = makeTestValidator();
});

describe("calculateIndexScore", () => {
  it("returns 0 when schema is not specified", () => {
    expect(calculateIndexScore(testValidator, OPTIONAL_ONE_OF_SCHEMA)).toEqual(
      0
    );
  });
  it("returns 0 when schema.properties is undefined", () => {
    expect(
      calculateIndexScore(testValidator, OPTIONAL_ONE_OF_SCHEMA, {})
    ).toEqual(0);
  });
  it("returns 0 when schema.properties is not an object", () => {
    expect(
      calculateIndexScore(testValidator, OPTIONAL_ONE_OF_SCHEMA, {
        properties: "foo",
      } as unknown as Schema)
    ).toEqual(0);
  });
  it("returns 0 when properties type is boolean", () => {
    expect(
      calculateIndexScore(testValidator, OPTIONAL_ONE_OF_SCHEMA, {
        properties: { foo: true },
      })
    ).toEqual(0);
  });
  it("returns 0 when formData is empty object", () => {
    expect(
      calculateIndexScore(testValidator, oneOfSchema, firstOption, {})
    ).toEqual(0);
  });
  it.todo("returns 1 for first option in oneOf schema", () => {
    expect(
      calculateIndexScore(
        testValidator,
        oneOfSchema,
        firstOption,
        ONE_OF_SCHEMA_DATA
      )
    ).toEqual(1);
  });
  it("returns 8 for second option in oneOf schema", () => {
    expect(
      calculateIndexScore(
        testValidator,
        oneOfSchema,
        secondOption,
        ONE_OF_SCHEMA_DATA
      )
    ).toEqual(9);
  });
  it("returns 1 for a schema that has a type matching the formData type", () => {
    expect(
      calculateIndexScore(testValidator, oneOfSchema, { type: "boolean" }, true)
    ).toEqual(1);
  });
  it("returns 2 for a schema that has a const matching the formData value", () => {
    expect(
      calculateIndexScore(
        testValidator,
        oneOfSchema,
        { properties: { foo: { type: "string", const: "constValue" } } },
        { foo: "constValue" }
      )
    ).toEqual(2);
  });
  it("returns 0 for a schema that has a const that does not match the formData value", () => {
    expect(
      calculateIndexScore(
        testValidator,
        oneOfSchema,
        { properties: { foo: { type: "string", const: "constValue" } } },
        { foo: "aValue" }
      )
    ).toEqual(0);
  });
});
describe("oneOfMatchingOption", () => {
  it("oneOfSchema, oneOfData data, no options, returns -1", () => {
    expect(
      getClosestMatchingOption(testValidator, oneOfSchema, oneOfData, [])
    ).toEqual(-1);
  });
  it("oneOfSchema, no data, 2 options, returns -1", () => {
    expect(
      getClosestMatchingOption(testValidator, oneOfSchema, undefined, [
        { type: "string" },
        { type: "number" },
      ])
    ).toEqual(-1);
  });
  it("oneOfSchema, oneOfData, no options, selectedOption 2, returns 2", () => {
    expect(
      getClosestMatchingOption(testValidator, oneOfSchema, oneOfData, [], 2)
    ).toEqual(2);
  });
  it("oneOfSchema, no data, 2 options, returns -1", () => {
    expect(
      getClosestMatchingOption(
        testValidator,
        oneOfSchema,
        undefined,
        [{ type: "string" }, { type: "number" }],
        2
      )
    ).toEqual(2);
  });
  it.only("returns the first option, which kind of matches the data", () => {
    expect(
      getClosestMatchingOption(
        testValidator,
        oneOfSchema,
        { flag: true },
        ONE_OF_SCHEMA_OPTIONS
      )
    ).toEqual(0);
  });
  it("returns the second option, which exactly matches the data", () => {
    // First 3 are mocked false, with the fourth being true for the real second option
    testValidator = makeTestValidator({ isValid: [false, false, false, true] });
    expect(
      getClosestMatchingOption(
        testValidator,
        oneOfSchema,
        ONE_OF_SCHEMA_DATA,
        ONE_OF_SCHEMA_OPTIONS
      )
    ).toEqual(1);
  });
  it("returns the first matching option (i.e. second index) when data is ambiguous", () => {
    testValidator = makeTestValidator({
      isValid: [false, false, false, true, false, true],
    });
    const formData = { flag: false };
    expect(
      getClosestMatchingOption(
        testValidator,
        OPTIONAL_ONE_OF_SCHEMA,
        formData,
        OPTIONAL_ONE_OF_SCHEMA_ONEOF
      )
    ).toEqual(1);
  });
  it("returns the third index when data is clear", () => {
    testValidator = makeTestValidator({
      isValid: [false, false, false, false, false, true],
    });
    expect(
      getClosestMatchingOption(
        testValidator,
        OPTIONAL_ONE_OF_SCHEMA,
        OPTIONAL_ONE_OF_DATA,
        OPTIONAL_ONE_OF_SCHEMA_ONEOF
      )
    ).toEqual(2);
  });
  it("returns the second option when data matches for oneOf", () => {
    // From https://github.com/rjsf-team/react-jsonschema-form/issues/2944
    const oneOf: Schema[] = [
      {
        properties: {
          lorem: {
            type: "string",
          },
        },
        required: ["lorem"],
      },
      {
        properties: {
          ipsum: {
            oneOf: [
              {
                properties: {
                  day: {
                    type: "string",
                  },
                },
              },
              {
                properties: {
                  night: {
                    type: "string",
                  },
                },
              },
            ],
          },
        },
        required: ["ipsum"],
      },
    ];
    const schema = {
      type: "array",
      items: {
        oneOf,
      },
    } satisfies Schema;
    const formData = { ipsum: { night: "nicht" } };
    // Mock to return true for the last of the second one-ofs
    testValidator = makeTestValidator({
      isValid: [false, false, false, false, false, false, false, true],
    });
    expect(
      getClosestMatchingOption(
        testValidator,
        schema as unknown as Schema,
        formData,
        oneOf
      )
    ).toEqual(1);
  });
  it("returns the second option when data matches for anyOf", () => {
    const anyOf: Schema[] = [
      {
        properties: {
          lorem: {
            type: "string",
          },
        },
        required: ["lorem"],
      },
      {
        properties: {
          ipsum: {
            anyOf: [
              {
                properties: {
                  day: {
                    type: "string",
                  },
                },
              },
              {
                properties: {
                  night: {
                    type: "string",
                  },
                },
              },
            ],
          },
        },
        required: ["ipsum"],
      },
    ];
    const schema: Schema = {
      type: "array",
      items: {
        anyOf,
      },
    };
    const formData = { ipsum: { night: "nicht" } };
    // Mock to return true for the last of the second anyOfs
    testValidator = makeTestValidator({
      isValid: [false, false, false, false, false, false, false, true],
    });
    expect(
      getClosestMatchingOption(testValidator, schema, formData, anyOf)
    ).toEqual(1);
  });
  it("should return 0 when schema has discriminator but no matching data", () => {
    // Mock isValid to fail both values
    testValidator = makeTestValidator({
      isValid: [false, false, false, false],
    });
    const schema: Schema = {
      type: "object",
      definitions: {
        Foo: {
          title: "Foo",
          type: "object",
          properties: {
            code: {
              title: "Code",
              default: "foo_coding",
              enum: ["foo_coding"],
              type: "string",
            },
          },
        },
        Bar: {
          title: "Bar",
          type: "object",
          properties: {
            code: {
              title: "Code",
              default: "bar_coding",
              enum: ["bar_coding"],
              type: "string",
            },
          },
        },
      },
      //@ts-expect-error Discriminator field
      discriminator: {
        propertyName: "code",
      },
      oneOf: [{ $ref: "#/definitions/Foo" }, { $ref: "#/definitions/Bar" }],
    };
    const options = [
      schema.definitions!.Foo,
      schema.definitions!.Bar,
    ] as Schema[];
    expect(
      getClosestMatchingOption(
        testValidator,
        schema,
        undefined,
        options,
        -1,
        "code"
      )
    ).toEqual(-1);
  });
  it("should return Bar when schema has discriminator for bar", () => {
    // Mock isValid to pass the second value
    testValidator = makeTestValidator({ isValid: [false, false, false, true] });
    const schema: Schema = {
      type: "object",
      definitions: {
        Foo: {
          title: "Foo",
          type: "object",
          properties: {
            code: {
              title: "Code",
              default: "foo_coding",
              enum: ["foo_coding"],
              type: "string",
            },
          },
        },
        Bar: {
          title: "Bar",
          type: "object",
          properties: {
            code: {
              title: "Code",
              default: "bar_coding",
              enum: ["bar_coding"],
              type: "string",
            },
          },
        },
      },
      // @ts-expect-error Discriminator field
      discriminator: {
        propertyName: "code",
      },
      oneOf: [{ $ref: "#/definitions/Foo" }, { $ref: "#/definitions/Bar" }],
    };
    const formData = { code: "bar_coding" };
    const options = [
      schema.definitions!.Foo,
      schema.definitions!.Bar,
    ] as Schema[];
    // Use the schemaUtils to verify the discriminator prop gets passed
    // const schemaUtils = createSchemaUtils(testValidator, schema);
    expect(
      getClosestMatchingOption(
        testValidator,
        oneOfSchema,
        formData,
        options,
        0,
        "code"
      )
    ).toEqual(1);
  });
});
