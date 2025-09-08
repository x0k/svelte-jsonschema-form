// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/test/schema/sanitizeDataForNewSchemaTest.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { beforeEach, describe, expect, it } from "vitest";

import {
  FIRST_ONE_OF,
  oneOfData,
  oneOfSchema,
  SECOND_ONE_OF,
} from "./fixtures/test-data.js";
import type { Validator } from "./validator.js";
import { sanitizeDataForNewSchema } from "./sanitize-data-for-new-schema.js";
import { retrieveSchema } from "./resolve.js";
import type { Schema } from "./schema.js";
import { createValidator } from "./test-validator.js";
import type { Merger } from "./merger.js";
import { createMerger } from "./test-merger.js";

let testValidator: Validator;
let defaultMerger: Merger;

beforeEach(() => {
  testValidator = createValidator();
  defaultMerger = createMerger();
});

describe("sanitizeDataForNewSchema", () => {
  it('returns undefined when the new schema does not contain a "property" object', () => {
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        {},
        {},
        undefined
      )
    ).toBeUndefined();
  });
  // it('returns input formData when the old schema is not an object', () => {
  //   const newSchema = retrieveSchema2(testValidator, defaultMerger, SECOND_ONE_OF, oneOfSchema);
  //   expect(sanitizeDataForNewSchema2(testValidator, defaultMerger, oneOfSchema, newSchema, undefined, oneOfData)).toEqual(oneOfData);
  // });
  it('returns input formData when the old schema does not contain a "property" object', () => {
    const newSchema = retrieveSchema(
      testValidator,
      createMerger({
        merges: [
          {
            left: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  default: "second_option",
                  readOnly: true,
                },
                flag: { type: "boolean", default: false },
                inner_spec: { $ref: "#/definitions/inner_spec_def" },
                unique_to_second: { type: "integer" },
                labeled_options: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                },
              },
              required: ["name", "inner_spec"],
              additionalProperties: false,
            },
            right: { title: "second option" },
            result: {
              type: "object",
              title: "second option",
              properties: {
                name: {
                  type: "string",
                  default: "second_option",
                  readOnly: true,
                },
                flag: { type: "boolean", default: false },
                inner_spec: { $ref: "#/definitions/inner_spec_def" },
                unique_to_second: { type: "integer" },
                labeled_options: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                },
              },
              required: ["name", "inner_spec"],
              additionalProperties: false,
            },
          },
        ],
      }),
      SECOND_ONE_OF,
      oneOfSchema
    );
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        {},
        oneOfData
      )
    ).toEqual(oneOfData);
  });
  it("returns input formData when the new schema matches the data for the new schema rather than the old", () => {
    const newSchema = retrieveSchema(
      testValidator,
      createMerger({
        merges: [
          {
            left: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  default: "second_option",
                  readOnly: true,
                },
                flag: { type: "boolean", default: false },
                inner_spec: { $ref: "#/definitions/inner_spec_def" },
                unique_to_second: { type: "integer" },
                labeled_options: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                },
              },
              required: ["name", "inner_spec"],
              additionalProperties: false,
            },
            right: { title: "second option" },
            result: {
              type: "object",
              title: "second option",
              properties: {
                name: {
                  type: "string",
                  default: "second_option",
                  readOnly: true,
                },
                flag: { type: "boolean", default: false },
                inner_spec: { $ref: "#/definitions/inner_spec_def" },
                unique_to_second: { type: "integer" },
                labeled_options: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                },
              },
              required: ["name", "inner_spec"],
              additionalProperties: false,
            },
          },
        ],
      }),
      SECOND_ONE_OF,
      oneOfSchema
    );
    const oldSchema = structuredClone(
      retrieveSchema(
        testValidator,
        createMerger({
          merges: [
            {
              left: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "first_option",
                    readOnly: true,
                  },
                  flag: { type: "boolean", default: false },
                  inner_spec: { $ref: "#/definitions/inner_spec_2_def" },
                  unlabeled_options: {
                    oneOf: [
                      { type: "integer" },
                      { type: "array", items: { type: "integer" } },
                    ],
                  },
                },
                required: ["name", "inner_spec"],
                additionalProperties: false,
              },
              right: { title: "first option" },
              result: {
                type: "object",
                title: "first option",
                properties: {
                  name: {
                    type: "string",
                    default: "first_option",
                    readOnly: true,
                  },
                  flag: { type: "boolean", default: false },
                  inner_spec: { $ref: "#/definitions/inner_spec_2_def" },
                  unlabeled_options: {
                    oneOf: [
                      { type: "integer" },
                      { type: "array", items: { type: "integer" } },
                    ],
                  },
                },
                required: ["name", "inner_spec"],
                additionalProperties: false,
              },
            },
          ],
        }),
        FIRST_ONE_OF,
        oneOfSchema
      )
    );
    // Change the type of name to trigger a fall-thru
    // @ts-expect-error hack for test
    oldSchema.properties.name.type = "boolean";
    // By changing the type, the name will be marked as undefined
    const expected = { ...oneOfData, name: undefined };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        oneOfData
      )
    ).toEqual(expected);
  });
  it("returns input formData when the new schema and old schema match on a default", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: {
        defaultField: {
          type: "string",
          default: "myData",
        },
        anotherField: {
          type: "boolean",
        },
      },
    };
    const newSchema: Schema = {
      type: "object",
      properties: {
        defaultField: {
          type: "string",
          default: "myData",
        },
        anotherField: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        {
          notInEitherSchema: "keep",
          defaultField: "myData",
          anotherField: true,
        }
      )
    ).toEqual({ notInEitherSchema: "keep", defaultField: "myData" });
  });
  it("returns new schema const in formData when the old schema default matches in the formData", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: {
        defaultField: {
          type: "string",
          default: "myData",
        },
        anotherField: {
          type: "boolean",
        },
      },
    };
    const newSchema: Schema = {
      type: "object",
      properties: {
        defaultField: {
          type: "string",
          default: "yourData",
        },
        anotherField: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        {
          defaultField: "myData",
          anotherField: true,
        }
      )
    ).toEqual({ defaultField: "yourData" });
  });
  it("returns input formData when the old schema default does not match in the formData", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: {
        defaultField: {
          type: "string",
          default: "myData",
        },
        anotherField: {
          type: "boolean",
        },
      },
    };
    const newSchema: Schema = {
      type: "object",
      properties: {
        defaultField: {
          type: "string",
          default: "yourData",
        },
        anotherField: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        {
          defaultField: "fooData",
          anotherField: true,
        }
      )
    ).toEqual({ defaultField: "fooData" });
  });
  it("returns empty formData when the old schema default does not match in the formData, and new schema default is readOnly", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: {
        defaultField: {
          type: "string",
          default: "myData",
        },
        anotherField: {
          type: "boolean",
        },
      },
    };
    const newSchema: Schema = {
      type: "object",
      properties: {
        defaultField: {
          type: "string",
          default: "yourData",
          readOnly: true,
        },
        anotherField: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        {
          defaultField: "fooData",
          anotherField: true,
        }
      )
    ).toEqual({});
  });
  it("returns input formData when the new schema and old schema match on a const", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: {
        constField: {
          type: "string",
          const: "myData",
        },
        anotherField: {
          type: "boolean",
        },
      },
    };
    const newSchema: Schema = {
      type: "object",
      properties: {
        constField: {
          type: "string",
          const: "myData",
        },
        anotherField: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        {
          notInEitherSchema: "keep",
          constField: "myData",
          anotherField: true,
        }
      )
    ).toEqual({ notInEitherSchema: "keep", constField: "myData" });
  });
  it("returns new schema const in formData when the old schema const matches in the formData", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: {
        constField: {
          type: "string",
          const: "myData",
        },
        anotherField: {
          type: "boolean",
        },
      },
    };
    const newSchema: Schema = {
      type: "object",
      properties: {
        constField: {
          type: "string",
          const: "yourData",
        },
        anotherField: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        {
          constField: "myData",
          anotherField: true,
        }
      )
    ).toEqual({ constField: "yourData" });
  });
  it("returns empty formData when the old schema const does not match in the formData", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: {
        constField: {
          type: "string",
          const: "myData",
        },
        anotherField: {
          type: "boolean",
        },
      },
    };
    const newSchema: Schema = {
      type: "object",
      properties: {
        constField: {
          type: "string",
          const: "yourData",
        },
        anotherField: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        {
          constField: "fooData",
          anotherField: true,
        }
      )
    ).toEqual({});
  });
  it("returns empty formData after resolving schema refs", () => {
    const rootSchema: Schema = {
      definitions: {
        string_def: {
          type: "string",
        },
      },
    };
    const oldSchema: Schema = {
      type: "object",
      properties: {
        field: {
          $ref: "#/definitions/string_def",
        },
        oldField: {
          type: "string",
        },
      },
    };
    const newSchema: Schema = {
      type: "object",
      properties: {
        field: {
          $ref: "#/definitions/string_def",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        rootSchema,
        newSchema,
        oldSchema,
        { oldField: "test" }
      )
    ).toEqual({});
  });
  it("returns data when two arrays have same boolean items", () => {
    const oldSchema: Schema = {
      type: "array",
      items: true,
    };
    const newSchema: Schema = {
      type: "array",
      items: true,
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [1]
      )
    ).toEqual([1]);
  });
  it("returns undefined when two arrays have differing boolean items", () => {
    const oldSchema: Schema = {
      type: "array",
      items: false,
    };
    const newSchema: Schema = {
      type: "array",
      items: true,
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [1]
      )
    ).toBeUndefined();
  });
  it("returns undefined when one array has boolean items", () => {
    const oldSchema: Schema = {
      type: "array",
      items: false,
    };
    const newSchema: Schema = {
      type: "array",
      items: { type: "string" },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [1]
      )
    ).toBeUndefined();
  });
  it("returns undefined when both arrays has array items", () => {
    const oldSchema: Schema = {
      type: "array",
      items: [true],
    };
    const newSchema: Schema = {
      type: "array",
      items: [{ type: "string" }],
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [1]
      )
    ).toBeUndefined();
  });
  it("returns undefined when one arrays has array items", () => {
    const oldSchema: Schema = {
      type: "array",
      items: { type: "number" },
    };
    const newSchema: Schema = {
      type: "array",
      items: [{ type: "string" }],
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [1]
      )
    ).toBeUndefined();
  });
  it("returns undefined when the arrays has array items of different types", () => {
    const oldSchema: Schema = {
      type: "array",
      items: { type: "number" },
    };
    const newSchema: Schema = {
      type: "array",
      items: { type: "string" },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [1]
      )
    ).toBeUndefined();
  });
  it("returns trimmed array when the new schema has maxItems < size for simple type", () => {
    const oldSchema: Schema = {
      type: "array",
      items: { type: "string" },
    };
    const newSchema: Schema = {
      type: "array",
      maxItems: 1,
      items: { type: "string" },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        ["1", "2"]
      )
    ).toEqual(["1"]);
  });
  it("returns whole array when the new schema does not have maxItems for simple type", () => {
    const rootSchema: Schema = {
      definitions: {
        string_def: {
          type: "string",
        },
      },
    };
    const oldSchema: Schema = {
      type: "array",
      maxItems: 2,
      items: { $ref: "#/definitions/string_def" },
    };
    const newSchema: Schema = {
      type: "array",
      items: { $ref: "#/definitions/string_def" },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        rootSchema,
        newSchema,
        oldSchema,
        ["1", "2"]
      )
    ).toEqual(["1", "2"]);
  });
  it("returns trimmed array when the new schema has maxItems < size for object type", () => {
    const oldSchema: Schema = {
      type: "array",
      items: { type: "object", properties: { foo: { type: "string" } } },
    };
    const newSchema: Schema = {
      type: "array",
      maxItems: 1,
      items: { type: "object", properties: { foo: { type: "string" } } },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [{ foo: "1" }, { foo: "2" }]
      )
    ).toEqual([{ foo: "1" }]);
  });
  it("returns whole array when the new schema does not have maxItems for object type", () => {
    const oldSchema: Schema = {
      type: "array",
      maxItems: 2,
      items: { type: "object", properties: { foo: { type: "string" } } },
    };
    const newSchema: Schema = {
      type: "array",
      items: { type: "object", properties: { foo: { type: "string" } } },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [{ foo: "1" }, { foo: "2" }]
      )
    ).toEqual([{ foo: "1" }, { foo: "2" }]);
  });
  it("returns undefined object values when the new schema has different object type", () => {
    const oldSchema: Schema = {
      type: "array",
      items: { type: "object", properties: { foo: { type: "string" } } },
    };
    const newSchema: Schema = {
      type: "array",
      items: { type: "object", properties: { foo: { type: "number" } } },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        [{ foo: "1" }, { foo: "2" }]
      )
    ).toEqual([{ foo: undefined }, { foo: undefined }]);
  });
  it("returns undefined object values when the new schema has array with different object types", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: { foo: { type: "array", items: { type: "string" } } },
    };
    const newSchema: Schema = {
      type: "object",
      properties: { foo: { type: "array", items: { type: "number" } } },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        {
          foo: ["1"],
        }
      )
    ).toEqual({ foo: undefined });
  });
  it("returns formData when the new schema has field that is not in the old schema", () => {
    const oldSchema: Schema = {
      type: "object",
      properties: {},
    };
    const newSchema: Schema = {
      type: "object",
      properties: { foo: { type: "object" } },
    };
    const formData = { foo: "1" };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        formData
      )
    ).toEqual(formData);
  });
  it('returns empty object when the old schema is of type string and the new contains "property" field', () => {
    const oldSchema: Schema = { type: "string" };
    const newSchema: Schema = {
      properties: {
        foo: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        "qwerty"
      )
    ).toEqual({});
  });
  it('returns empty object when the old schema is of type array and the new contains "property" field', () => {
    const oldSchema: Schema = {
      type: "array",
      items: {
        type: "string",
      },
    };
    const newSchema: Schema = {
      properties: {
        foo: {
          type: "string",
        },
      },
    };
    expect(
      sanitizeDataForNewSchema(
        testValidator,
        defaultMerger,
        oneOfSchema,
        newSchema,
        oldSchema,
        ["qwerty", "asdfg"]
      )
    ).toEqual({});
  });
});
