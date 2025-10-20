// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/test/schema/retrieveSchemaTest.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";

import { type Schema, ADDITIONAL_PROPERTY_FLAG } from "./schema.js";
import {
  getAllPermutationsOfXxxOf,
  resolveAnyOrOneOfSchemas,
  resolveCondition,
  resolveDependencies,
  retrieveSchema,
  retrieveSchemaInternal,
  stubExistingAdditionalProperties,
  withExactlyOneSubSchema,
} from "./resolve.js";
import {
  PROPERTY_DEPENDENCIES,
  RECURSIVE_REF,
  RECURSIVE_REF_ALLOF,
  SCHEMA_DEPENDENCIES,
  SCHEMA_AND_REQUIRED_DEPENDENCIES,
  SCHEMA_AND_ONEOF_REF_DEPENDENCIES,
  SCHEMA_WITH_ONEOF_NESTED_DEPENDENCIES,
  SCHEMA_WITH_SINGLE_CONDITION,
  SCHEMA_WITH_MULTIPLE_CONDITIONS,
  SCHEMA_WITH_NESTED_CONDITIONS,
  SUPER_SCHEMA,
} from "./fixtures/test-data.js";
import type { Validator } from "./validator.js";
import { createValidator } from "./test-validator.js";
import type { Merger } from "./merger.js";
import { createMerger } from "./test-merger.js";

let testValidator: Validator;
let defaultMerger: Merger;

beforeEach(() => {
  testValidator = createValidator();
  defaultMerger = createMerger();
});

describe("resolveDependencies()", () => {
  it("test an object with dependencies", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        first: {
          type: "string",
          enum: ["no", "yes"],
          default: "no",
        },
      },
      dependencies: {
        first: {
          oneOf: [
            {
              properties: {
                first: {
                  enum: ["yes"],
                },
                second: {
                  type: "object",
                  properties: {
                    deeplyNestedThird: {
                      type: "string",
                      enum: ["before", "after"],
                      default: "before",
                    },
                  },
                },
              },
            },
            {
              properties: {
                first: {
                  enum: ["no"],
                },
              },
            },
          ],
        },
      },
    };

    // Mock isValid so that withExactlyOneSubschema works as expected
    testValidator = createValidator({
      cases: [
        {
          schema: { type: "object", properties: { first: { enum: ["yes"] } } },
          value: { first: "yes" },
          result: true,
        },
        {
          schema: { type: "object", properties: { first: { enum: ["no"] } } },
          value: { first: "yes" },
          result: false,
        },
      ],
    });
    defaultMerger = createMerger({
      merges: [
        {
          left: {
            type: "object",
            properties: {
              first: { type: "string", enum: ["no", "yes"], default: "no" },
            },
          },
          right: {
            properties: {
              second: {
                type: "object",
                properties: {
                  deeplyNestedThird: {
                    type: "string",
                    enum: ["before", "after"],
                    default: "before",
                  },
                },
              },
            },
          },
          result: {
            type: "object",
            properties: {
              first: { type: "string", enum: ["no", "yes"], default: "no" },
              second: {
                type: "object",
                properties: {
                  deeplyNestedThird: {
                    type: "string",
                    enum: ["before", "after"],
                    default: "before",
                  },
                },
              },
            },
          },
        },
      ],
    });
    expect(
      resolveDependencies(
        testValidator,
        defaultMerger,
        schema,
        schema,
        false,
        new Set(),
        {
          first: "yes",
        }
      )
    ).toEqual([
      {
        type: "object",
        properties: {
          first: {
            type: "string",
            enum: ["no", "yes"],
            default: "no",
          },
          second: {
            type: "object",
            properties: {
              deeplyNestedThird: {
                type: "string",
                enum: ["before", "after"],
                default: "before",
              },
            },
          },
        },
      },
    ]);
  });
});
describe("retrieveSchema()", () => {
  let consoleWarnSpy: MockInstance<typeof console.warn>;
  beforeAll(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {}); // mock this to avoid actually warning in the tests
  });
  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });
  afterEach(() => {
    consoleWarnSpy.mockClear();
  });
  it("should `resolve` a schema which contains definitions", () => {
    const schema: Schema = { $ref: "#/definitions/address" };
    const address: Schema = {
      type: "object",
      properties: {
        street_address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
      },
      required: ["street_address", "city", "state"],
    };
    const rootSchema: Schema = { definitions: { address } };

    expect(
      retrieveSchema(testValidator, defaultMerger, schema, rootSchema)
    ).toEqual(address);
  });
  it("should `resolve` a schema which contains definitions not in `#/definitions`", () => {
    const address: Schema = {
      type: "object",
      properties: {
        street_address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
      },
      required: ["street_address", "city", "state"],
    };
    const schema: Schema = {
      $ref: "#/definitions/address",
      definitions: { address },
    };

    expect(
      retrieveSchema(
        testValidator,
        createMerger({
          merges: [
            {
              left: {
                type: "object",
                properties: {
                  street_address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                },
                required: ["street_address", "city", "state"],
              },
              right: {
                definitions: {
                  address: {
                    type: "object",
                    properties: {
                      street_address: { type: "string" },
                      city: { type: "string" },
                      state: { type: "string" },
                    },
                    required: ["street_address", "city", "state"],
                  },
                },
              },
              result: {
                type: "object",
                properties: {
                  street_address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                },
                required: ["street_address", "city", "state"],
                definitions: {
                  address: {
                    type: "object",
                    properties: {
                      street_address: { type: "string" },
                      city: { type: "string" },
                      state: { type: "string" },
                    },
                    required: ["street_address", "city", "state"],
                  },
                },
              },
            },
          ],
        }),
        schema,
        schema
      )
    ).toEqual({
      definitions: { address },
      ...address,
    });
  });
  it("should give an error when JSON pointer is not in a URI encoded format", () => {
    const address: Schema = {
      type: "object",
      properties: {
        street_address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
      },
      required: ["street_address", "city", "state"],
    };
    const schema: Schema = {
      $ref: "/definitions/schemas/address",
      definitions: { address },
    };

    expect(() =>
      retrieveSchema(testValidator, defaultMerger, schema, schema)
    ).toThrowError("Invalid reference: ");
  });
  it("should give an error when JSON pointer does not point to anything", () => {
    const schema: Schema = {
      $ref: "#/definitions/schemas/address",
      definitions: { schemas: {} },
    };

    expect(() =>
      retrieveSchema(testValidator, defaultMerger, schema, schema)
    ).toThrowError("Could not find a definition");
  });
  it("should `resolve` escaped JSON Pointers", () => {
    const schema: Schema = { $ref: "#/definitions/a~0complex~1name" };
    const address: Schema = { type: "string" };
    const rootSchema: Schema = {
      definitions: { "a~complex/name": address },
    };

    expect(
      retrieveSchema(testValidator, defaultMerger, schema, rootSchema)
    ).toEqual(address);
  });
  it("should `resolve` and stub out a schema which contains an `additionalProperties` with a definition", () => {
    const schema: Schema = {
      type: "object",
      additionalProperties: {
        $ref: "#/definitions/address",
      },
    };

    const address: Schema = {
      type: "object",
      properties: {
        street_address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
      },
      required: ["street_address", "city", "state"],
    };

    const rootSchema: Schema = { definitions: { address } };
    const formData = { newKey: {} };

    expect(
      retrieveSchema(testValidator, defaultMerger, schema, rootSchema, formData)
    ).toEqual({
      ...schema,
      properties: {
        newKey: {
          ...address,
          [ADDITIONAL_PROPERTY_FLAG]: true,
        },
      },
    });
  });
  it("should `resolve` and stub out a schema which contains an `additionalProperties` with a type and definition", () => {
    const schema: Schema = {
      type: "string",
      additionalProperties: {
        $ref: "#/definitions/number",
      },
    };

    const number: Schema = {
      type: "number",
    };

    const rootSchema: Schema = { definitions: { number } };
    const formData = { newKey: {} };

    expect(
      retrieveSchema(testValidator, defaultMerger, schema, rootSchema, formData)
    ).toEqual({
      ...schema,
      properties: {
        newKey: {
          ...number,
          [ADDITIONAL_PROPERTY_FLAG]: true,
        },
      },
    });
  });
  it("should `resolve` and stub out a schema which contains an `additionalProperties` with oneOf", () => {
    const oneOf: Schema[] = [
      {
        type: "string",
      },
      {
        type: "number",
      },
    ];
    const schema: Schema = {
      additionalProperties: {
        oneOf,
      },
      type: "object",
    };

    const formData = { newKey: {} };
    expect(
      retrieveSchema(testValidator, defaultMerger, schema, {}, formData)
    ).toEqual({
      ...schema,
      properties: {
        newKey: {
          type: "object",
          oneOf,
          [ADDITIONAL_PROPERTY_FLAG]: true,
        },
      },
    });
  });
  it("should `resolve` and stub out a schema which contains an `additionalProperties` with anyOf", () => {
    const anyOf: Schema[] = [
      {
        type: "string",
      },
      {
        type: "number",
      },
    ];
    const schema: Schema = {
      additionalProperties: {
        anyOf,
      },
      type: "object",
    };

    const formData = { newKey: {} };
    expect(
      retrieveSchema(testValidator, defaultMerger, schema, {}, formData)
    ).toEqual({
      ...schema,
      properties: {
        newKey: {
          type: "object",
          anyOf,
          [ADDITIONAL_PROPERTY_FLAG]: true,
        },
      },
    });
  });
  it("should handle null formData for schema which contains additionalProperties", () => {
    const schema: Schema = {
      additionalProperties: {
        type: "string",
      },
      type: "object",
    };

    const formData = null;
    expect(
      retrieveSchema(testValidator, defaultMerger, schema, {}, formData)
    ).toEqual({
      ...schema,
      properties: {},
    });
  });
  it.todo("should prioritize local definitions over foreign ones", () => {
    const schema: Schema = {
      $ref: "#/definitions/address",
      title: "foo",
    };
    const address: Schema = {
      type: "string",
      title: "bar",
    };
    const rootSchema: Schema = { definitions: { address } };

    expect(
      retrieveSchema(
        testValidator,
        createMerger({
          merges: [
            {
              left: { type: "string", title: "bar" },
              right: { title: "foo" },
              result: {
                type: "string",
                title: "bar",
              },
            },
          ],
        }),
        schema,
        rootSchema
      )
    ).toEqual({
      ...address,
      title: "foo",
    });
  });
  it("recursive ref should resolve once", () => {
    const result = retrieveSchema(
      testValidator,
      createMerger({
        merges: [
          {
            left: {
              type: "object",
              properties: {
                name: { title: "Name", type: "string", default: "" },
                children: { $ref: "#/definitions/@enum" },
              },
            },
            right: {
              definitions: {
                "@enum": {
                  type: "object",
                  properties: {
                    name: { title: "Name", type: "string", default: "" },
                    children: { $ref: "#/definitions/@enum" },
                  },
                },
              },
            },
            result: {
              type: "object",
              properties: {
                name: { title: "Name", type: "string", default: "" },
                children: { $ref: "#/definitions/@enum" },
              },
              definitions: {
                "@enum": {
                  type: "object",
                  properties: {
                    name: { title: "Name", type: "string", default: "" },
                    children: { $ref: "#/definitions/@enum" },
                  },
                },
              },
            },
          },
        ],
      }),
      RECURSIVE_REF,
      RECURSIVE_REF
    );
    expect(result).toEqual({
      definitions: RECURSIVE_REF.definitions,
      ...(RECURSIVE_REF.definitions!["@enum"] as Schema),
    });
  });
  it("recursive allof ref should resolve once", () => {
    const result = retrieveSchema(
      testValidator,
      createMerger({
        allOfMerges: [
          {
            input: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    name: { title: "Name", type: "string", default: "" },
                    _id: { title: "Value", type: "number" },
                    children: {
                      title: "Subvalues",
                      type: "array",
                      items: { allOf: [{ $ref: "#/definitions/@enum" }] },
                    },
                  },
                },
              ],
            },
            result: {
              type: "object",
              properties: {
                name: { title: "Name", type: "string", default: "" },
                _id: { title: "Value", type: "number" },
                children: {
                  title: "Subvalues",
                  type: "array",
                  items: { allOf: [{ $ref: "#/definitions/@enum" }] },
                },
              },
            },
          },
        ],
      }),
      (RECURSIVE_REF_ALLOF.properties?.value as Schema).items as Schema,
      RECURSIVE_REF_ALLOF
    );
    expect(result).toEqual({
      ...(RECURSIVE_REF_ALLOF.definitions!["@enum"] as Schema),
    });
  });
  it("should `resolve` refs inside of a properties key with bad property", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        firstName: "some mame" as unknown as Schema,
      },
    };
    const rootSchema: Schema = {
      type: "object",
    };
    expect(
      retrieveSchema(testValidator, defaultMerger, schema, rootSchema)
    ).toEqual(schema);
  });
  it("should `resolve` refs inside of a properties key", () => {
    const entity: Schema = {
      type: "string",
      title: "Entity",
    };
    const schema: Schema = {
      type: "object",
      properties: {
        entity: {
          $ref: "#/definitions/entity",
        },
      },
    };
    const rootSchema: Schema = {
      type: "object",
      definitions: {
        entity,
      },
    };
    expect(
      retrieveSchema(testValidator, defaultMerger, schema, rootSchema)
    ).toEqual({
      type: "object",
      properties: {
        entity: {
          ...entity,
        },
      },
    });
  });
  it("should `resolve` refs inside of an items key", () => {
    const entity: Schema = {
      type: "string",
      title: "Entity",
    };
    const schema: Schema = {
      type: "array",
      items: {
        $ref: "#/definitions/entity",
      },
    };
    const rootSchema: Schema = {
      type: "object",
      definitions: {
        entity,
      },
    };
    expect(
      retrieveSchema(testValidator, defaultMerger, schema, rootSchema)
    ).toEqual({
      type: "array",
      items: {
        ...entity,
      },
    });
  });
  it("should `resolve` sibling refs to the same definition", () => {
    const schema = {
      definitions: {
        address: {
          type: "object",
          properties: {
            street_address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
          },
          required: ["street_address", "city", "state"],
        },
      },
      type: "object",
      properties: {
        billing_address: {
          title: "Billing address",
          $ref: "#/definitions/address",
        },
        shipping_address: {
          title: "Shipping address",
          $ref: "#/definitions/address",
        },
      },
    } satisfies Schema;
    expect(
      retrieveSchema(
        testValidator,
        createMerger({
          merges: [
            {
              left: {
                type: "object",
                properties: {
                  street_address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                },
                required: ["street_address", "city", "state"],
              },
              right: { title: "Billing address" },
              result: {
                type: "object",
                title: "Billing address",
                properties: {
                  street_address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                },
                required: ["street_address", "city", "state"],
              },
            },
            {
              left: {
                type: "object",
                properties: {
                  street_address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                },
                required: ["street_address", "city", "state"],
              },
              right: { title: "Shipping address" },
              result: {
                type: "object",
                title: "Shipping address",
                properties: {
                  street_address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                },
                required: ["street_address", "city", "state"],
              },
            },
          ],
        }),
        schema,
        schema
      )
    ).toEqual({
      ...schema,
      properties: {
        billing_address: {
          ...schema.definitions.address,
          title: "Billing address",
        },
        shipping_address: {
          ...schema.definitions.address,
          title: "Shipping address",
        },
      },
    });
  });
  describe("property dependencies", () => {
    describe("false condition", () => {
      it("should not add required properties", () => {
        const rootSchema: Schema = { definitions: {} };
        const formData = {};
        expect(
          retrieveSchema(
            testValidator,
            defaultMerger,
            PROPERTY_DEPENDENCIES,
            rootSchema,
            formData
          )
        ).toEqual({
          type: "object",
          properties: {
            a: { type: "string" },
            b: { type: "integer" },
          },
          required: ["a"],
        });
      });
    });

    describe("true condition", () => {
      describe("when required is not defined", () => {
        it("should define required properties", () => {
          const schema: Schema = {
            ...PROPERTY_DEPENDENCIES,
            required: undefined,
          };
          const rootSchema: Schema = { definitions: {} };
          const formData = { a: "1" };
          expect(
            retrieveSchema(
              testValidator,
              createMerger({
                merges: [
                  {
                    left: {
                      type: "object",
                      properties: {
                        a: { type: "string" },
                        b: { type: "integer" },
                      },
                      required: undefined,
                    },
                    right: { required: ["b"] },
                    result: {
                      type: "object",
                      properties: {
                        a: { type: "string" },
                        b: { type: "integer" },
                      },
                      required: ["b"],
                    },
                  },
                ],
              }),
              schema,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string" },
              b: { type: "integer" },
            },
            required: ["b"],
          });
        });
        it("should not define required properties, when the dependency is a boolean", () => {
          const schema: Schema = {
            ...PROPERTY_DEPENDENCIES,
            required: undefined,
            dependencies: {
              a: true,
            },
          };
          const rootSchema: Schema = { definitions: {} };
          const formData = { a: "1" };
          expect(
            retrieveSchema(
              testValidator,
              defaultMerger,
              schema,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string" },
              b: { type: "integer" },
            },
          });
        });
      });

      describe("when required is defined", () => {
        it("should concat required properties", () => {
          const rootSchema: Schema = { definitions: {} };
          const formData = { a: "1" };
          expect(
            retrieveSchema(
              testValidator,
              createMerger({
                merges: [
                  {
                    left: {
                      type: "object",
                      properties: {
                        a: { type: "string" },
                        b: { type: "integer" },
                      },
                      required: ["a"],
                    },
                    right: { required: ["b"] },
                    result: {
                      type: "object",
                      properties: {
                        a: { type: "string" },
                        b: { type: "integer" },
                      },
                      required: ["a", "b"],
                    },
                  },
                ],
              }),
              PROPERTY_DEPENDENCIES,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string" },
              b: { type: "integer" },
            },
            required: ["a", "b"],
          });
        });
      });
    });
  });
  describe("schema dependencies", () => {
    describe("conditional", () => {
      describe("false condition", () => {
        it("should not modify properties", () => {
          const rootSchema: Schema = { definitions: {} };
          const formData = {};
          expect(
            retrieveSchema(
              testValidator,
              defaultMerger,
              SCHEMA_DEPENDENCIES,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string" },
            },
          });
        });
      });

      describe("true condition", () => {
        it("should add properties", () => {
          const rootSchema: Schema = { definitions: {} };
          const formData = { a: "1" };
          expect(
            retrieveSchema(
              testValidator,
              createMerger({
                merges: [
                  {
                    left: {
                      type: "object",
                      properties: { a: { type: "string" } },
                    },
                    right: { properties: { b: { type: "integer" } } },
                    result: {
                      type: "object",
                      properties: {
                        a: { type: "string" },
                        b: { type: "integer" },
                      },
                    },
                  },
                ],
              }),
              SCHEMA_DEPENDENCIES,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string" },
              b: { type: "integer" },
            },
          });
        });
        it("should concat required properties", () => {
          const rootSchema: Schema = { definitions: {} };
          const formData = { a: "1" };
          expect(
            retrieveSchema(
              testValidator,
              createMerger({
                merges: [
                  {
                    left: {
                      type: "object",
                      properties: {
                        a: { type: "string" },
                        b: { type: "integer" },
                      },
                      required: ["a"],
                    },
                    right: {
                      properties: { a: { type: "string" } },
                      required: ["b"],
                    },
                    result: {
                      type: "object",
                      properties: {
                        a: { type: "string" },
                        b: { type: "integer" },
                      },
                      required: ["a", "b"],
                    },
                  },
                ],
              }),
              SCHEMA_AND_REQUIRED_DEPENDENCIES,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string" },
              b: { type: "integer" },
            },
            required: ["a", "b"],
          });
        });
        it("should not concat enum properties, but should concat `required` properties", () => {
          const schema: Schema = {
            type: "object",
            properties: {
              a: { type: "string", enum: ["FOO", "BAR", "BAZ"] },
              b: { type: "string", enum: ["GREEN", "BLUE", "RED"] },
            },
            required: ["a"],
            dependencies: {
              a: {
                properties: {
                  a: { enum: ["FOO"] },
                  b: { enum: ["BLUE"] },
                },
                required: ["a", "b"],
              },
            },
          };
          const rootSchema: Schema = { definitions: {} };
          const formData = { a: "FOO" };
          expect(
            retrieveSchema(
              testValidator,
              createMerger({
                merges: [
                  {
                    left: {
                      type: "object",
                      properties: {
                        a: { type: "string", enum: ["FOO", "BAR", "BAZ"] },
                        b: { type: "string", enum: ["GREEN", "BLUE", "RED"] },
                      },
                      required: ["a"],
                    },
                    right: {
                      properties: {
                        a: { enum: ["FOO"] },
                        b: { enum: ["BLUE"] },
                      },
                      required: ["a", "b"],
                    },
                    result: {
                      type: "object",
                      properties: {
                        a: { type: "string", enum: ["FOO"] },
                        b: { type: "string", enum: ["BLUE"] },
                      },
                      required: ["a", "b"],
                    },
                  },
                ],
              }),
              schema,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string", enum: ["FOO"] },
              b: { type: "string", enum: ["BLUE"] },
            },
            required: ["a", "b"],
          });
        });
      });

      describe("with $ref in dependency", () => {
        it("should retrieve referenced schema", () => {
          const schema: Schema = {
            type: "object",
            properties: {
              a: { type: "string" },
            },
            dependencies: {
              a: {
                $ref: "#/definitions/needsB",
              },
            },
          };
          const rootSchema: Schema = {
            definitions: {
              needsB: {
                properties: {
                  b: { type: "integer" },
                },
              },
            },
          };
          const formData = { a: "1" };
          expect(
            retrieveSchema(
              testValidator,
              createMerger({
                merges: [
                  {
                    left: {
                      type: "object",
                      properties: { a: { type: "string" } },
                    },
                    right: { properties: { b: { type: "integer" } } },
                    result: {
                      type: "object",
                      properties: {
                        a: { type: "string" },
                        b: { type: "integer" },
                      },
                    },
                  },
                ],
              }),
              schema,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string" },
              b: { type: "integer" },
            },
          });
        });
      });

      describe("with $ref in oneOf", () => {
        it("should retrieve referenced schemas", () => {
          // Mock isValid so that withExactlyOneSubschema works as expected
          testValidator = createValidator({
            cases: [
              {
                schema: {
                  type: "object",
                  properties: { a: { enum: ["typeA"] } },
                },
                value: { a: "typeB" },
                result: false,
              },
              {
                schema: {
                  type: "object",
                  properties: { a: { enum: ["typeB"] } },
                },
                value: { a: "typeB" },
                result: true,
              },
            ],
          });
          defaultMerger = createMerger({
            merges: [
              {
                left: {
                  type: "object",
                  properties: { a: { enum: ["typeA", "typeB"] } },
                },
                right: { properties: { c: { type: "boolean" } } },
                result: {
                  type: "object",
                  properties: {
                    a: { enum: ["typeA", "typeB"] },
                    c: { type: "boolean" },
                  },
                },
              },
            ],
          });
          const schema: Schema = {
            type: "object",
            properties: {
              a: { enum: ["typeA", "typeB"] },
            },
            dependencies: {
              a: {
                oneOf: [
                  { $ref: "#/definitions/needsA" },
                  { $ref: "#/definitions/needsB" },
                ],
              },
            },
          };
          const rootSchema: Schema = {
            definitions: {
              needsA: {
                properties: {
                  a: { enum: ["typeA"] },
                  b: { type: "number" },
                },
              },
              needsB: {
                properties: {
                  a: { enum: ["typeB"] },
                  c: { type: "boolean" },
                },
              },
            },
          };
          const formData = { a: "typeB" };
          expect(
            retrieveSchema(
              testValidator,
              defaultMerger,
              schema,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { enum: ["typeA", "typeB"] },
              c: { type: "boolean" },
            },
          });
        });
      });
    });

    describe("dynamic", () => {
      describe("false condition", () => {
        it("should not modify properties", () => {
          const schema: Schema = {
            ...SCHEMA_AND_ONEOF_REF_DEPENDENCIES,
            properties: {
              a: { type: "string" },
            },
            definitions: undefined,
          };
          const formData = {};
          expect(
            retrieveSchema(
              testValidator,
              defaultMerger,
              schema,
              SCHEMA_AND_ONEOF_REF_DEPENDENCIES,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string" },
            },
          });
        });
      });

      describe("true condition", () => {
        it("should add `first` properties given `first` data", () => {
          // Mock isValid so that withExactlyOneSubschema works as expected
          testValidator = createValidator({
            cases: [
              {
                schema: {
                  type: "object",
                  properties: { a: { enum: ["int"] } },
                },
                value: { a: "int" },
                result: true,
              },
              {
                schema: {
                  type: "object",
                  properties: { a: { enum: ["bool"] } },
                },
                value: { a: "int" },
                result: false,
              },
            ],
          });
          defaultMerger = createMerger({
            merges: [
              {
                left: {
                  type: "object",
                  properties: { a: { type: "string", enum: ["int", "bool"] } },
                  definitions: undefined,
                },
                right: { properties: { b: { type: "integer" } } },
                result: {
                  type: "object",
                  properties: {
                    a: { type: "string", enum: ["int", "bool"] },
                    b: { type: "integer" },
                  },
                },
              },
            ],
          });
          const schema: Schema = {
            ...SCHEMA_AND_ONEOF_REF_DEPENDENCIES,
            definitions: undefined,
          };
          const formData = { a: "int" };
          expect(
            retrieveSchema(
              testValidator,
              defaultMerger,
              schema,
              SCHEMA_AND_ONEOF_REF_DEPENDENCIES,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string", enum: ["int", "bool"] },
              b: { type: "integer" },
            },
          });
        });

        it("should add `second` properties given `second` data", () => {
          // Mock isValid so that withExactlyOneSubschema works as expected
          testValidator = createValidator({
            cases: [
              {
                schema: {
                  type: "object",
                  properties: { a: { enum: ["int"] } },
                },
                value: { a: "bool" },
                result: false,
              },
              {
                schema: {
                  type: "object",
                  properties: { a: { enum: ["bool"] } },
                },
                value: { a: "bool" },
                result: true,
              },
            ],
          });
          defaultMerger = createMerger({
            merges: [
              {
                left: {
                  type: "object",
                  properties: { a: { type: "string", enum: ["int", "bool"] } },
                  definitions: undefined,
                },
                right: { properties: { b: { type: "boolean" } } },
                result: {
                  type: "object",
                  properties: {
                    a: { type: "string", enum: ["int", "bool"] },
                    b: { type: "boolean" },
                  },
                },
              },
            ],
          });
          const schema: Schema = {
            ...SCHEMA_AND_ONEOF_REF_DEPENDENCIES,
            definitions: undefined,
          };
          const formData = { a: "bool" };
          expect(
            retrieveSchema(
              testValidator,
              defaultMerger,
              schema,
              SCHEMA_AND_ONEOF_REF_DEPENDENCIES,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string", enum: ["int", "bool"] },
              b: { type: "boolean" },
            },
          });
        });

        describe("showing/hiding nested dependencies", () => {
          let schema: Schema;
          let rootSchema: Schema;
          beforeAll(() => {
            schema = SCHEMA_WITH_ONEOF_NESTED_DEPENDENCIES;
            rootSchema = { definitions: {} };
          });

          it("should not include nested dependencies that should be hidden", () => {
            // Mock isValid so that withExactlyOneSubschema works as expected
            testValidator = createValidator({
              cases: [
                {
                  schema: {
                    type: "object",
                    properties: { employee_accounts: { const: true } },
                  },
                  value: { employee_accounts: false, update_absences: "BOTH" },
                  result: false,
                },
              ],
            });
            const formData = {
              employee_accounts: false,
              update_absences: "BOTH",
            };
            expect(
              retrieveSchema(
                testValidator,
                defaultMerger,
                schema,
                rootSchema,
                formData
              )
            ).toEqual({
              type: "object",
              properties: {
                employee_accounts: {
                  type: "boolean",
                  title: "Employee Accounts",
                },
              },
            });
            expect(consoleWarnSpy).toHaveBeenCalledWith(
              "ignoring oneOf in dependencies because there isn't exactly one subschema that is valid"
            );
          });

          it("should include nested dependencies that should not be hidden", () => {
            // Mock isValid so that withExactlyOneSubschema works as expected
            testValidator = createValidator({
              cases: [
                {
                  schema: {
                    type: "object",
                    properties: { employee_accounts: { const: true } },
                  },
                  value: { employee_accounts: true, update_absences: "BOTH" },
                  result: true,
                },
                {
                  schema: {
                    type: "object",
                    properties: { update_absences: { const: "BOTH" } },
                  },
                  value: { employee_accounts: true, update_absences: "BOTH" },
                  result: true,
                },
                {
                  schema: {
                    type: "object",
                    properties: { update_absences: { const: "MEDICAL_ONLY" } },
                  },
                  value: { employee_accounts: true, update_absences: "BOTH" },
                  result: false,
                },
                {
                  schema: {
                    type: "object",
                    properties: {
                      update_absences: { const: "NON_MEDICAL_ONLY" },
                    },
                  },
                  value: { employee_accounts: true, update_absences: "BOTH" },
                  result: false,
                },
              ],
            });
            defaultMerger = createMerger({
              merges: [
                {
                  left: {
                    type: "object",
                    properties: {
                      employee_accounts: {
                        type: "boolean",
                        title: "Employee Accounts",
                      },
                    },
                  },
                  right: {
                    properties: {
                      update_absences: {
                        title: "Update Absences",
                        type: "string",
                        oneOf: [{ title: "Both", const: "BOTH" }],
                      },
                    },
                  },
                  result: {
                    type: "object",
                    properties: {
                      employee_accounts: {
                        type: "boolean",
                        title: "Employee Accounts",
                      },
                      update_absences: {
                        title: "Update Absences",
                        type: "string",
                        oneOf: [{ title: "Both", const: "BOTH" }],
                      },
                    },
                  },
                },
                {
                  left: {
                    type: "object",
                    properties: {
                      employee_accounts: {
                        type: "boolean",
                        title: "Employee Accounts",
                      },
                      update_absences: {
                        title: "Update Absences",
                        type: "string",
                        oneOf: [{ title: "Both", const: "BOTH" }],
                      },
                    },
                  },
                  right: {
                    properties: {
                      permitted_extension: {
                        title: "Permitted Extension",
                        type: "integer",
                      },
                    },
                  },
                  result: {
                    type: "object",
                    properties: {
                      employee_accounts: {
                        type: "boolean",
                        title: "Employee Accounts",
                      },
                      update_absences: {
                        title: "Update Absences",
                        type: "string",
                        oneOf: [{ title: "Both", const: "BOTH" }],
                      },
                      permitted_extension: {
                        title: "Permitted Extension",
                        type: "integer",
                      },
                    },
                  },
                },
              ],
            });
            const formData = {
              employee_accounts: true,
              update_absences: "BOTH",
            };
            expect(
              retrieveSchema(
                testValidator,
                defaultMerger,
                schema,
                rootSchema,
                formData
              )
            ).toEqual({
              type: "object",
              properties: {
                employee_accounts: {
                  type: "boolean",
                  title: "Employee Accounts",
                },
                permitted_extension: {
                  title: "Permitted Extension",
                  type: "integer",
                },
                update_absences: {
                  title: "Update Absences",
                  type: "string",
                  oneOf: [
                    {
                      title: "Both",
                      const: "BOTH",
                    },
                  ],
                },
              },
            });
          });
        });
      });

      describe("with $ref in dependency", () => {
        it("should retrieve the referenced schema", () => {
          // Mock isValid so that withExactlyOneSubschema works as expected
          testValidator = createValidator({
            cases: [
              {
                schema: {
                  type: "object",
                  properties: { a: { enum: ["int"] } },
                },
                value: { a: "bool" },
                result: false,
              },
              {
                schema: {
                  type: "object",
                  properties: { a: { enum: ["bool"] } },
                },
                value: { a: "bool" },
                result: true,
              },
            ],
          });
          defaultMerger = createMerger({
            merges: [
              {
                left: {
                  type: "object",
                  properties: { a: { type: "string", enum: ["int", "bool"] } },
                },
                right: {
                  properties: {
                    b: { type: "boolean" },
                  },
                },
                result: {
                  type: "object",
                  properties: {
                    a: { type: "string", enum: ["int", "bool"] },
                    b: { type: "boolean" },
                  },
                },
              },
            ],
          });
          const schema: Schema = {
            type: "object",
            properties: {
              a: { type: "string", enum: ["int", "bool"] },
            },
            dependencies: {
              a: {
                $ref: "#/definitions/typedInput",
              },
            },
          };
          const rootSchema: Schema = {
            definitions: {
              typedInput: {
                oneOf: [
                  {
                    properties: {
                      a: { enum: ["int"] },
                      b: { type: "integer" },
                    },
                  },
                  {
                    properties: {
                      a: { enum: ["bool"] },
                      b: { type: "boolean" },
                    },
                  },
                ],
              },
            },
          };
          const formData = { a: "bool" };
          expect(
            retrieveSchema(
              testValidator,
              defaultMerger,
              schema,
              rootSchema,
              formData
            )
          ).toEqual({
            type: "object",
            properties: {
              a: { type: "string", enum: ["int", "bool"] },
              b: { type: "boolean" },
            },
          });
        });
      });
    });
  });
  describe("allOf", () => {
    it("should merge types", () => {
      const schema: Schema = {
        allOf: [{ type: ["string", "number", "null"] }, { type: "string" }],
      };
      const rootSchema: Schema = { definitions: {} };
      const formData = {};
      expect(
        retrieveSchema(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: {
                  allOf: [
                    { type: ["string", "number", "null"] },
                    { type: "string" },
                  ],
                },
                result: {
                  type: "string",
                },
              },
            ],
          }),
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "string",
      });
    });
    it("should not merge `allOf.contains` schemas", () => {
      // https://github.com/rjsf-team/react-jsonschema-form/issues/2923#issuecomment-1946034240
      const schema: Schema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            a: {
              type: "string",
            },
          },
        },
        allOf: [
          {
            maxItems: 5,
          },
          {
            contains: {
              type: "object",
              properties: {
                a: {
                  pattern: "1",
                },
              },
            },
          },
          {
            contains: {
              type: "object",
              properties: {
                a: {
                  pattern: "2",
                },
              },
            },
          },
        ],
      };
      const rootSchema: Schema = { definitions: {} };
      const formData = {};
      expect(
        retrieveSchema(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { a: { type: "string" } },
                  },
                  allOf: [{ maxItems: 5 }],
                },
                result: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { a: { type: "string" } },
                  },
                  maxItems: 5,
                },
              },
            ],
          }),
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "array",
        items: {
          type: "object",
          properties: {
            a: {
              type: "string",
            },
          },
        },
        maxItems: 5,
        allOf: [
          {
            contains: {
              type: "object",
              properties: {
                a: {
                  pattern: "1",
                },
              },
            },
          },
          {
            contains: {
              type: "object",
              properties: {
                a: {
                  pattern: "2",
                },
              },
            },
          },
        ],
      });
    });
    it("should not merge incompatible types", () => {
      const schema: Schema = {
        allOf: [{ type: "string" }, { type: "boolean" }],
      };
      const rootSchema: Schema = { definitions: {} };
      const formData = {};
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          schema,
          rootSchema,
          formData
        )
      ).toEqual({});
      expect(consoleWarnSpy).toBeCalledWith(
        expect.stringMatching(/could not merge subschemas in allOf/),
        expect.any(Error)
      );
    });
    it("should return allOf and top level schemas when expand all", () => {
      const schema: Schema = {
        properties: { test: { type: "string" } },
        allOf: [{ type: "string" }, { type: "boolean" }],
      };
      const rootSchema: Schema = { definitions: {} };
      const formData = {};
      const { allOf, ...restOfSchema } = schema;
      expect(
        retrieveSchemaInternal(
          testValidator,
          defaultMerger,
          schema,
          rootSchema,
          formData,
          true
        )
      ).toEqual([...allOf!, restOfSchema]);
    });
    it("should merge types with $ref in them", () => {
      const schema: Schema = {
        allOf: [{ $ref: "#/definitions/1" }, { $ref: "#/definitions/2" }],
      };
      const rootSchema: Schema = {
        definitions: {
          "1": { type: "string" },
          "2": { minLength: 5 },
        },
      };
      const formData = {};
      expect(
        retrieveSchema(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: { allOf: [{ type: "string" }, { minLength: 5 }] },
                result: {
                  type: "string",
                  minLength: 5,
                },
              },
            ],
          }),
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "string",
        minLength: 5,
      });
    });
    it("should properly merge schemas with nested allOf`s", () => {
      const schema: Schema = {
        allOf: [
          {
            type: "string",
            allOf: [{ minLength: 2 }, { maxLength: 5 }],
          },
          {
            type: "string",
            allOf: [{ default: "hi" }, { minLength: 4 }],
          },
        ],
      };
      const rootSchema: Schema = { definitions: {} };
      const formData = {};
      expect(
        retrieveSchema(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: {
                  type: "string",
                  allOf: [{ minLength: 2 }, { maxLength: 5 }],
                },
                result: {
                  type: "string",
                  minLength: 2,
                  maxLength: 5,
                },
              },
              {
                input: {
                  type: "string",
                  allOf: [{ default: "hi" }, { minLength: 4 }],
                },
                result: {
                  type: "string",
                  default: "hi",
                  minLength: 4,
                },
              },
              {
                input: {
                  allOf: [
                    { type: "string", minLength: 2, maxLength: 5 },
                    { type: "string", default: "hi", minLength: 4 },
                  ],
                },
                result: {
                  type: "string",
                  minLength: 4,
                  maxLength: 5,
                  default: "hi",
                },
              },
            ],
          }),
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "string",
        minLength: 4,
        maxLength: 5,
        default: "hi",
      });
    });
  });
  describe("Conditional schemas (If, Then, Else)", () => {
    it("should resolve if, then", () => {
      // Mock errors so that resolveCondition2 works as expected
      testValidator = createValidator({
        cases: [
          {
            schema: {
              properties: { country: { const: "United States of America" } },
            },
            value: {
              country: "United States of America",
              postal_code: "20500",
            },
            result: true,
          },
        ],
      });
      defaultMerger = createMerger({
        merges: [
          {
            left: {
              type: "object",
              properties: {
                country: {
                  default: "United States of America",
                  enum: ["United States of America", "Canada"],
                },
              },
            },
            right: {
              properties: { postal_code: { pattern: "[0-9]{5}(-[0-9]{4})?" } },
            },
            result: {
              type: "object",
              properties: {
                country: {
                  default: "United States of America",
                  enum: ["United States of America", "Canada"],
                },
                postal_code: { pattern: "[0-9]{5}(-[0-9]{4})?" },
              },
            },
          },
        ],
      });
      const rootSchema: Schema = { definitions: {} };
      const formData = {
        country: "United States of America",
        postal_code: "20500",
      };
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          SCHEMA_WITH_SINGLE_CONDITION,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "object",
        properties: {
          country: {
            default: "United States of America",
            enum: ["United States of America", "Canada"],
          },
          postal_code: { pattern: "[0-9]{5}(-[0-9]{4})?" },
        },
      });
    });
    it("should resolve if, else", () => {
      // Mock errors so that resolveCondition2 works as expected
      testValidator = createValidator({
        cases: [
          {
            schema: {
              properties: { country: { const: "United States of America" } },
            },
            value: { country: "Canada", postal_code: "K1M 1M4" },
            result: false,
          },
        ],
      });
      defaultMerger = createMerger({
        merges: [
          {
            left: {
              type: "object",
              properties: {
                country: {
                  default: "United States of America",
                  enum: ["United States of America", "Canada"],
                },
              },
            },
            right: {
              properties: {
                postal_code: { pattern: "[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" },
              },
            },
            result: {
              type: "object",
              properties: {
                country: {
                  default: "United States of America",
                  enum: ["United States of America", "Canada"],
                },
                postal_code: { pattern: "[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" },
              },
            },
          },
        ],
      });
      const rootSchema: Schema = { definitions: {} };
      const formData = {
        country: "Canada",
        postal_code: "K1M 1M4",
      };
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          SCHEMA_WITH_SINGLE_CONDITION,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "object",
        properties: {
          country: {
            default: "United States of America",
            enum: ["United States of America", "Canada"],
          },
          postal_code: { pattern: "[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" },
        },
      });
    });
    it("should resolve multiple conditions", () => {
      // Mock errors so that resolveCondition2 works as expected
      testValidator = createValidator({
        cases: [
          {
            schema: { properties: { animal: { const: "Cat" } } },
            value: { animal: "Cat" },
            result: true,
          },
          {
            schema: { properties: { animal: { const: "Fish" } } },
            value: { animal: "Cat" },
            result: false,
          },
        ],
      });
      defaultMerger = createMerger({
        merges: [
          {
            left: { required: ["food"] },
            right: {
              properties: {
                food: { type: "string", enum: ["meat", "grass", "fish"] },
              },
            },
            result: {
              properties: {
                food: { type: "string", enum: ["meat", "grass", "fish"] },
              },
              required: ["food"],
            },
          },
        ],
        allOfMerges: [
          {
            input: {
              type: "object",
              properties: { animal: { enum: ["Cat", "Fish"] } },
              allOf: [
                {
                  properties: {
                    food: { type: "string", enum: ["meat", "grass", "fish"] },
                  },
                  required: ["food"],
                },
                {},
                { required: ["animal"] },
              ],
            },
            result: {
              type: "object",
              properties: {
                animal: { enum: ["Cat", "Fish"] },
                food: { type: "string", enum: ["meat", "grass", "fish"] },
              },
              required: ["animal", "food"],
            },
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          animal: {
            enum: ["Cat", "Fish"],
          },
        },
        allOf: [
          {
            if: {
              properties: { animal: { const: "Cat" } },
            },
            then: {
              properties: {
                food: { type: "string", enum: ["meat", "grass", "fish"] },
              },
            },
            required: ["food"],
          },
          {
            if: {
              properties: { animal: { const: "Fish" } },
            },
            then: {
              properties: {
                food: {
                  type: "string",
                  enum: ["insect", "worms"],
                },
                water: {
                  type: "string",
                  enum: ["lake", "sea"],
                },
              },
              required: ["food", "water"],
            },
          },
          {
            required: ["animal"],
          },
        ],
      };
      const rootSchema: Schema = { definitions: {} };
      const formData = {
        animal: "Cat",
      };

      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "object",
        properties: {
          animal: {
            enum: ["Cat", "Fish"],
          },
          food: { type: "string", enum: ["meat", "grass", "fish"] },
        },
        required: ["animal", "food"],
      });
    });
    it("should resolve multiple conditions in nested allOf blocks", () => {
      // Mock errors so that resolveCondition2 works as expected
      testValidator = createValidator({
        cases: [
          {
            schema: {
              required: ["Animal"],
              properties: { Animal: { const: "Cat" } },
            },
            value: { Animal: "Dog", Breed: { BreedName: "Dalmation" } },
            result: false,
          },
          {
            schema: {
              required: ["Animal"],
              properties: { Animal: { const: "Dog" } },
            },
            value: { Animal: "Dog", Breed: { BreedName: "Dalmation" } },
            result: true,
          },
        ],
      });
      const rootSchema: Schema = { definitions: {} };
      const formData = {
        Animal: "Dog",
        Breed: {
          BreedName: "Dalmation",
        },
      };

      expect(
        retrieveSchema(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: {
                  type: "object",
                  properties: {
                    Animal: {
                      default: "Cat",
                      enum: ["Cat", "Dog"],
                      title: "Animal",
                      type: "string",
                    },
                  },
                  allOf: [
                    {},
                    {
                      properties: {
                        Breed: {
                          title: "Breed",
                          properties: {
                            BreedName: {
                              default: "Alsatian",
                              enum: ["Alsatian", "Dalmation"],
                              title: "Breed name",
                              type: "string",
                            },
                          },
                          allOf: [
                            {
                              if: {
                                required: ["BreedName"],
                                properties: {
                                  BreedName: { const: "Alsatian" },
                                },
                              },
                              then: {
                                properties: {
                                  Fur: {
                                    default: "brown",
                                    enum: ["black", "brown"],
                                    title: "Fur",
                                    type: "string",
                                  },
                                },
                                required: ["Fur"],
                              },
                            },
                            {
                              if: {
                                required: ["BreedName"],
                                properties: {
                                  BreedName: { const: "Dalmation" },
                                },
                              },
                              then: {
                                properties: {
                                  Spots: {
                                    default: "small",
                                    enum: ["large", "small"],
                                    title: "Spots",
                                    type: "string",
                                  },
                                },
                                required: ["Spots"],
                              },
                            },
                          ],
                          required: ["BreedName"],
                        },
                      },
                    },
                  ],
                  required: ["Animal"],
                },
                result: {
                  type: "object",
                  properties: {
                    Animal: {
                      default: "Cat",
                      enum: ["Cat", "Dog"],
                      title: "Animal",
                      type: "string",
                    },
                    Breed: {
                      title: "Breed",
                      properties: {
                        BreedName: {
                          default: "Alsatian",
                          enum: ["Alsatian", "Dalmation"],
                          title: "Breed name",
                          type: "string",
                        },
                      },
                      allOf: [
                        {
                          if: {
                            required: ["BreedName"],
                            properties: {
                              BreedName: { const: "Alsatian" },
                            },
                          },
                          then: {
                            properties: {
                              Fur: {
                                default: "brown",
                                enum: ["black", "brown"],
                                title: "Fur",
                                type: "string",
                              },
                            },
                            required: ["Fur"],
                          },
                        },
                        {
                          if: {
                            required: ["BreedName"],
                            properties: {
                              BreedName: { const: "Dalmation" },
                            },
                          },
                          then: {
                            properties: {
                              Spots: {
                                default: "small",
                                enum: ["large", "small"],
                                title: "Spots",
                                type: "string",
                              },
                            },
                            required: ["Spots"],
                          },
                        },
                      ],
                      required: ["BreedName"],
                    },
                  },
                  required: ["Animal"],
                },
              },
            ],
          }),
          SCHEMA_WITH_MULTIPLE_CONDITIONS,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "object",
        properties: {
          Animal: {
            default: "Cat",
            enum: ["Cat", "Dog"],
            title: "Animal",
            type: "string",
          },
          Breed: {
            properties: {
              BreedName: {
                default: "Alsatian",
                enum: ["Alsatian", "Dalmation"],
                title: "Breed name",
                type: "string",
              },
            },
            allOf: [
              {
                if: {
                  required: ["BreedName"],
                  properties: {
                    BreedName: {
                      const: "Alsatian",
                    },
                  },
                },
                then: {
                  properties: {
                    Fur: {
                      default: "brown",
                      enum: ["black", "brown"],
                      title: "Fur",
                      type: "string",
                    },
                  },
                  required: ["Fur"],
                },
              },
              {
                if: {
                  required: ["BreedName"],
                  properties: {
                    BreedName: {
                      const: "Dalmation",
                    },
                  },
                },
                then: {
                  properties: {
                    Spots: {
                      default: "small",
                      enum: ["large", "small"],
                      title: "Spots",
                      type: "string",
                    },
                  },
                  required: ["Spots"],
                },
              },
            ],
            required: ["BreedName"],
            title: "Breed",
          },
        },
        required: ["Animal"],
      });
    });
    it("should resolve $ref", () => {
      // Mock errors so that resolveCondition2 works as expected
      testValidator = createValidator({
        cases: [
          {
            schema: { properties: { animal: { const: "Cat" } } },
            value: { animal: "Cat" },
            result: true,
          },
          {
            schema: { properties: { animal: { const: "Fish" } } },
            value: { animal: "Cat" },
            result: false,
          },
        ],
      });
      defaultMerger = createMerger({
        allOfMerges: [
          {
            input: {
              type: "object",
              properties: { animal: { enum: ["Cat", "Fish"] } },
              allOf: [
                {
                  properties: {
                    food: { type: "string", enum: ["meat", "grass", "fish"] },
                  },
                  required: ["food"],
                },
                {},
                { required: ["animal"] },
              ],
            },
            result: {
              type: "object",
              properties: {
                animal: { enum: ["Cat", "Fish"] },
                food: { type: "string", enum: ["meat", "grass", "fish"] },
              },
              required: ["animal", "food"],
            },
          },
        ],
        merges: [
          {
            left: { required: ["food"] },
            right: {
              properties: {
                food: { type: "string", enum: ["meat", "grass", "fish"] },
              },
            },
            result: {
              properties: {
                food: { type: "string", enum: ["meat", "grass", "fish"] },
              },
              required: ["food"],
            },
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          animal: {
            enum: ["Cat", "Fish"],
          },
        },
        allOf: [
          {
            if: {
              properties: { animal: { const: "Cat" } },
            },
            then: {
              $ref: "#/definitions/cat",
            },
            required: ["food"],
          },
          {
            if: {
              properties: { animal: { const: "Fish" } },
            },
            then: {
              $ref: "#/definitions/fish",
            },
          },
          {
            required: ["animal"],
          },
        ],
      };

      const rootSchema: Schema = {
        definitions: {
          cat: {
            properties: {
              food: { type: "string", enum: ["meat", "grass", "fish"] },
            },
          },
          fish: {
            properties: {
              food: {
                type: "string",
                enum: ["insect", "worms"],
              },
              water: {
                type: "string",
                enum: ["lake", "sea"],
              },
            },
            required: ["food", "water"],
          },
        },
      };

      const formData = {
        animal: "Cat",
      };

      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "object",
        properties: {
          animal: {
            enum: ["Cat", "Fish"],
          },
          food: { type: "string", enum: ["meat", "grass", "fish"] },
        },
        required: ["animal", "food"],
      });
    });
    it("handles nested if then else", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              properties: { country: { const: "USA" } },
              required: ["country"],
            },
            value: { country: "USA", state: "New York" },
            result: true,
          },
          {
            schema: {
              properties: { state: { const: "New York" } },
              required: ["state"],
            },
            value: { country: "USA", state: "New York" },
            result: true,
          },
        ],
      });
      defaultMerger = createMerger({
        merges: [
          {
            left: {
              properties: {
                state: { type: "string", enum: ["California", "New York"] },
              },
              required: ["state"],
            },
            right: {
              properties: {
                city: {
                  type: "string",
                  enum: ["New York City", "Buffalo", "Rochester"],
                },
              },
            },
            result: {
              properties: {
                state: { type: "string", enum: ["California", "New York"] },
                city: {
                  type: "string",
                  enum: ["New York City", "Buffalo", "Rochester"],
                },
              },
              required: ["state"],
            },
          },
          {
            left: {
              type: "object",
              properties: { country: { enum: ["USA"] } },
              required: ["country"],
            },
            right: {
              properties: {
                state: { type: "string", enum: ["California", "New York"] },
                city: {
                  type: "string",
                  enum: ["New York City", "Buffalo", "Rochester"],
                },
              },
              required: ["state"],
            },
            result: {
              type: "object",
              properties: {
                country: { enum: ["USA"] },
                state: { type: "string", enum: ["California", "New York"] },
                city: {
                  type: "string",
                  enum: ["New York City", "Buffalo", "Rochester"],
                },
              },
              required: ["country", "state"],
            },
          },
        ],
      });
      const rootSchema: Schema = {};
      const formData = {
        country: "USA",
        state: "New York",
      };

      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          SCHEMA_WITH_NESTED_CONDITIONS,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "object",
        properties: {
          country: {
            enum: ["USA"],
          },
          state: { type: "string", enum: ["California", "New York"] },
          city: {
            type: "string",
            enum: ["New York City", "Buffalo", "Rochester"],
          },
        },
        required: ["country", "state"],
      });
    });
    it("overrides the base schema with a conditional branch when merged", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          myString: {
            type: "string",
            minLength: 5,
          },
        },
        if: true,
        then: {
          properties: {
            myString: {
              minLength: 10, // This value of minLength should override the original value
            },
          },
        },
      };
      const rootSchema: Schema = { definitions: {} };
      const formData = {};
      expect(
        retrieveSchema(
          testValidator,
          createMerger({
            merges: [
              {
                left: {
                  type: "object",
                  properties: { myString: { type: "string", minLength: 5 } },
                },
                right: { properties: { myString: { minLength: 10 } } },
                result: {
                  type: "object",
                  properties: { myString: { type: "string", minLength: 10 } },
                },
              },
            ],
          }),
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        type: "object",
        properties: {
          myString: {
            type: "string",
            minLength: 10,
          },
        },
      });
    });
  });
  describe("withExactlyOneSubschema()", () => {
    it("Handle conditions with falsy subschema, subschema.properties, or condition schema", () => {
      const schema: Schema = {
        type: "integer",
      };
      const oneOf: Schema["oneOf"] = [
        true,
        { properties: undefined },
        { properties: { foo: { type: "string" } } },
      ];
      expect(
        withExactlyOneSubSchema(
          testValidator,
          defaultMerger,
          schema,
          schema,
          "bar",
          oneOf,
          false,
          new Set()
        )
      ).toEqual([schema]);
    });
  });
  describe("withPatternProperties()", () => {
    it("validates schemas with conditions inside patternProperties", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          foo: {
            type: "object",
          },
        },
        patternProperties: {
          "^[a-z]+$": {
            type: "object",
            properties: {
              isString: { type: "boolean" },
            },
            allOf: [
              {
                if: {
                  properties: { isString: { const: true } },
                },
                then: {
                  properties: {
                    value: {
                      type: "string",
                    },
                  },
                },
              },
              {
                if: {
                  properties: { isString: { const: false } },
                },
                then: {
                  properties: {
                    value: {
                      type: "number",
                    },
                  },
                },
              },
            ],
          },
        },
      };
      const rootSchema: Schema = { definitions: {} };
      testValidator = createValidator({
        cases: [
          {
            schema: { properties: { isString: { const: true } } },
            value: { isString: true },
            result: true,
          },
          {
            schema: { properties: { isString: { const: false } } },
            value: { isString: true },
            result: false,
          },
        ],
      });
      defaultMerger = createMerger({
        allOfMerges: [
          {
            input: {
              type: "object",
              properties: { isString: { type: "boolean" } },
              allOf: [{ properties: { value: { type: "string" } } }, {}],
            },
            result: {
              type: "object",
              properties: {
                isString: { type: "boolean" },
                value: { type: "string" },
              },
            },
          },
          {
            input: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    isString: { type: "boolean" },
                    value: { type: "string" },
                  },
                },
                { type: "object" },
              ],
            },
            result: {
              type: "object",
              properties: {
                isString: { type: "boolean" },
                value: { type: "string" },
              },
            },
          },
          {
            input: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    isString: { type: "boolean" },
                    value: { type: "string" },
                  },
                },
              ],
            },
            result: {
              type: "object",
              properties: {
                isString: { type: "boolean" },
                value: { type: "string" },
              },
            },
          },
        ],
      });
      expect(
        retrieveSchema(testValidator, defaultMerger, schema, rootSchema, {
          foo: { isString: true },
          bar: { isString: true },
        })
      ).toEqual({
        ...schema,
        properties: {
          foo: {
            type: "object",
            properties: {
              isString: { type: "boolean" },
              value: { type: "string" },
            },
          },
          bar: {
            [ADDITIONAL_PROPERTY_FLAG]: true,
            type: "object",
            properties: {
              isString: { type: "boolean" },
              value: { type: "string" },
            },
          },
        },
      });
      testValidator = createValidator({
        cases: [
          {
            schema: { properties: { isString: { const: true } } },
            value: { isString: false },
            result: false,
          },
          {
            schema: { properties: { isString: { const: false } } },
            value: { isString: false },
            result: true,
          },
        ],
      });
      defaultMerger = createMerger({
        allOfMerges: [
          {
            input: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    isString: { type: "boolean" },
                    value: { type: "number" },
                  },
                },
                { type: "object" },
              ],
            },
            result: {
              type: "object",
              properties: {
                isString: { type: "boolean" },
                value: { type: "number" },
              },
            },
          },
          {
            input: {
              type: "object",
              properties: { isString: { type: "boolean" } },
              allOf: [{}, { properties: { value: { type: "number" } } }],
            },
            result: {
              type: "object",
              properties: {
                isString: { type: "boolean" },
                value: { type: "number" },
              },
            },
          },
          {
            input: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    isString: { type: "boolean" },
                    value: { type: "number" },
                  },
                },
              ],
            },
            result: {
              type: "object",
              properties: {
                isString: { type: "boolean" },
                value: { type: "number" },
              },
            },
          },
        ],
      });
      expect(
        retrieveSchema(testValidator, defaultMerger, schema, rootSchema, {
          foo: { isString: false },
          bar: { isString: false },
        })
      ).toEqual({
        ...schema,
        properties: {
          foo: {
            type: "object",
            properties: {
              isString: { type: "boolean" },
              value: { type: "number" },
            },
          },
          bar: {
            [ADDITIONAL_PROPERTY_FLAG]: true,
            type: "object",
            properties: {
              isString: { type: "boolean" },
              value: { type: "number" },
            },
          },
        },
      });
    });
    it("merges all subschemas that match the patternProperties regex", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          foo: { type: "number" },
          baz: { type: "boolean" },
        },
        patternProperties: {
          "^foo": {
            minimum: 10,
          },
          "^foo.*": {
            maximum: 20,
          },
          "^bar": {
            multipleOf: 2,
          },
        },
      };
      const rootSchema: Schema = { definitions: {} };
      const formData = {};
      expect(
        retrieveSchema(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: {
                  allOf: [{ minimum: 10 }, { maximum: 20 }, { type: "number" }],
                },
                result: {
                  type: "number",
                  minimum: 10,
                  maximum: 20,
                },
              },
            ],
          }),
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          foo: {
            type: "number",
            minimum: 10,
            maximum: 20,
          },
          baz: {
            type: "boolean",
          },
        },
      });
    });
  });
  describe("stubExistingAdditionalProperties()", () => {
    it("deals with undefined formData", () => {
      const schema = { type: "string", properties: {} } satisfies Schema;
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          defaultMerger,
          schema,
          schema,
          {}
        )
      ).toEqual({
        ...schema,
        properties: {},
      });
    });
    // it("deals with non-object formData", () => {
    //   const schema = { type: "string", properties: {} } satisfies Schema;
    //   expect(
    //     stubExistingAdditionalProperties(
    //       testValidator,
    //       defaultMerger,
    //       schema,
    //       schema,
    //       []
    //     )
    //   ).toEqual({
    //     ...schema,
    //     properties: {},
    //   });
    // });
    it("has property keys that match formData, additionalProperties is boolean", () => {
      const schema = {
        additionalProperties: true,
        properties: {},
      } satisfies Schema;
      const formData = { bar: 1, baz: false, foo: "str" };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          defaultMerger,
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          bar: {
            type: "number",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
          baz: {
            type: "boolean",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
          foo: {
            type: "string",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has property keys that match schema AND formData, additionalProperties is boolean", () => {
      const schema = {
        properties: {
          foo: { type: "string" },
          bar: { type: "number" },
        },
        additionalProperties: true,
      } satisfies Schema;
      const formData = { foo: "blah", bar: 1, baz: true };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          defaultMerger,
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          ...schema.properties,
          baz: {
            type: "boolean",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has additionalProperties of type number", () => {
      const schema = {
        additionalProperties: { type: "number" },
        properties: {},
      } satisfies Schema;
      const formData = { bar: 1 };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          defaultMerger,
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          bar: {
            ...(schema.additionalProperties as object),
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has additionalProperties of empty object", () => {
      const schema = {
        additionalProperties: {},
        properties: {},
      } satisfies Schema;
      const formData = { foo: "blah", bar: 1, baz: true };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          defaultMerger,
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          foo: {
            type: "string",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
          bar: {
            type: "number",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
          baz: {
            type: "boolean",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has additionalProperties with a ref", () => {
      const schema = {
        additionalProperties: { $ref: "#/definitions/foo" },
        properties: {},
      } satisfies Schema;
      const rootSchema: Schema = {
        definitions: {
          foo: { type: "string" },
        },
      };
      const formData = { bar: "blah" };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          defaultMerger,
          schema,
          rootSchema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          bar: {
            type: "string",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has property keys that does not match patternProperties, no additionalProperties", () => {
      const schema = {
        patternProperties: {
          "^foo": {
            type: "string",
          },
          "^bar": {
            type: "number",
          },
        },
        properties: {},
      } satisfies Schema;
      const formData = { baz: 1 };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          defaultMerger,
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          baz: {
            type: "null",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has property keys that match patternProperties", () => {
      const schema = {
        patternProperties: {
          "^foo": {
            type: "string",
          },
          "^bar": {
            type: "number",
            minimum: 10,
          },
        },
        properties: {},
      } satisfies Schema;
      const formData = { bar: 1 };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: { allOf: [{ type: "number", minimum: 10 }] },
                result: { type: "number", minimum: 10 },
              },
            ],
          }),
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          bar: {
            type: "number",
            minimum: 10,
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has property keys that match multiple patternProperties", () => {
      const schema = {
        patternProperties: {
          "^foo": {
            type: "string",
          },
          "^bar": {
            type: "number",
            minimum: 10,
          },
          "^ba.*": {
            type: "number",
            maximum: 20,
          },
        },
        properties: {},
      } satisfies Schema;
      const formData = { bar: 1 };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: {
                  allOf: [
                    { type: "number", minimum: 10 },
                    { type: "number", maximum: 20 },
                  ],
                },
                result: {
                  type: "number",
                  minimum: 10,
                  maximum: 20,
                },
              },
            ],
          }),
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          bar: {
            type: "number",
            minimum: 10,
            maximum: 20,
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has property keys that match patternProperties, additionalProperties is boolean", () => {
      const schema = {
        patternProperties: {
          "^foo": {
            type: "string",
          },
          "^bar": {
            type: "number",
            minimum: 10,
          },
        },
        additionalProperties: true,
        properties: {},
      } satisfies Schema;
      const formData = { bar: 1, baz: true };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: { allOf: [{ type: "number", minimum: 10 }] },
                result: { type: "number", minimum: 10 },
              },
            ],
          }),
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          bar: {
            type: "number",
            minimum: 10,
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
          baz: {
            type: "boolean",
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
    it("has property keys that match patternProperties, additionalProperties is object", () => {
      const schema = {
        patternProperties: {
          "^foo": {
            type: "string",
          },
          "^bar": {
            type: "number",
            minimum: 10,
          },
        },
        additionalProperties: {
          type: "number",
          maximum: 20,
        },
        properties: {},
      } satisfies Schema;
      const formData = { bar: 1, baz: 2 };
      expect(
        stubExistingAdditionalProperties(
          testValidator,
          createMerger({
            allOfMerges: [
              {
                input: { allOf: [{ type: "number", minimum: 10 }] },
                result: { type: "number", minimum: 10 },
              },
            ],
          }),
          schema,
          schema,
          formData
        )
      ).toEqual({
        ...schema,
        properties: {
          bar: {
            type: "number",
            minimum: 10,
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
          baz: {
            type: "number",
            maximum: 20,
            [ADDITIONAL_PROPERTY_FLAG]: true,
          },
        },
      });
    });
  });
  describe("getAllPermutationsOfXxxOf()", () => {
    it("returns a single permutation when there are only one version of each row", () => {
      const oneOfs: Schema[][] = [
        [{ title: "A", type: "string" }],
        [{ title: "B", type: "number" }],
        [{ title: "C", type: "boolean" }],
      ];
      expect(getAllPermutationsOfXxxOf(oneOfs)).toEqual([
        [
          { title: "A", type: "string" },
          { title: "B", type: "number" },
          { title: "C", type: "boolean" },
        ],
      ]);
    });
    it("returns 2 permutations when there are 2 versions in one row and one in another", () => {
      const oneOfs: Schema[][] = [
        [{ title: "A", type: "string" }],
        [
          { title: "B1", type: "number" },
          { title: "B2", type: "boolean" },
        ],
      ];
      expect(getAllPermutationsOfXxxOf(oneOfs)).toEqual([
        [
          { title: "A", type: "string" },
          { title: "B1", type: "number" },
        ],
        [
          { title: "A", type: "string" },
          { title: "B2", type: "boolean" },
        ],
      ]);
    });
    it("returns 6 permutations when there are 3 in row 1, 2 in row 2 and one in row 3", () => {
      const oneOfs: Schema[][] = [
        [{ title: "A", type: "string" }],
        [
          { title: "B1", type: "number" },
          { title: "B2", type: "boolean" },
        ],
        [
          { title: "C1", type: "string" },
          { title: "C2", type: "number" },
          { title: "C3", type: "boolean" },
        ],
      ];
      expect(getAllPermutationsOfXxxOf(oneOfs)).toEqual([
        [
          { title: "A", type: "string" },
          { title: "B1", type: "number" },
          { title: "C1", type: "string" },
        ],
        [
          { title: "A", type: "string" },
          { title: "B2", type: "boolean" },
          { title: "C1", type: "string" },
        ],
        [
          { title: "A", type: "string" },
          { title: "B1", type: "number" },
          { title: "C2", type: "number" },
        ],
        [
          { title: "A", type: "string" },
          { title: "B2", type: "boolean" },
          { title: "C2", type: "number" },
        ],
        [
          { title: "A", type: "string" },
          { title: "B1", type: "number" },
          { title: "C3", type: "boolean" },
        ],
        [
          { title: "A", type: "string" },
          { title: "B2", type: "boolean" },
          { title: "C3", type: "boolean" },
        ],
      ]);
    });
  });
  describe("resolveAnyOrOneOfSchemas()", () => {
    it("resolves anyOf with $ref for single element, merging schemas", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { type: "object", properties: { name: { type: "string" } } },
                { anyOf: [{ required: ["name"] }] },
              ],
            },
            value: [],
            result: false,
          },
        ],
      });
      const anyOfSchema: Schema = SUPER_SCHEMA.properties?.multi as Schema;
      expect(
        resolveAnyOrOneOfSchemas(
          testValidator,
          createMerger({
            merges: [
              {
                left: { title: "multi" },
                right: {
                  type: "object",
                  properties: { name: { type: "string" } },
                },
                result: {
                  title: "multi",
                  type: "object",
                  properties: { name: { type: "string" } },
                },
              },
            ],
          }),
          anyOfSchema,
          SUPER_SCHEMA,
          false,
          []
        )
      ).toEqual([
        {
          ...(SUPER_SCHEMA.definitions?.foo as Schema),
          title: "multi",
        },
      ]);
    });
    it("resolves oneOf with $ref for expandedAll elements, merging schemas", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    choice: { type: "string", const: "one" },
                    other: { type: "number" },
                  },
                },
                { anyOf: [{ required: ["choice"] }, { required: ["other"] }] },
              ],
            },
            value: [],
            result: false,
          },
          {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    choice: { type: "string", const: "two" },
                    more: { type: "string" },
                  },
                },
                { anyOf: [{ required: ["choice"] }, { required: ["more"] }] },
              ],
            },
            value: [],
            result: false,
          },
        ],
      });
      const oneOfSchema: Schema = SUPER_SCHEMA.properties?.single as Schema;
      expect(
        resolveAnyOrOneOfSchemas(
          testValidator,
          createMerger({
            merges: [
              {
                left: { required: ["choice"] },
                right: {
                  type: "object",
                  required: ["more"],
                  properties: {
                    choice: { type: "string", const: "one" },
                    other: { type: "number" },
                  },
                },
                result: {
                  type: "object",
                  required: ["choice", "more"],
                  properties: {
                    choice: { type: "string", const: "one" },
                    other: { type: "number" },
                  },
                },
              },
              {
                left: { required: ["choice"] },
                right: {
                  type: "object",
                  properties: {
                    choice: { type: "string", const: "two" },
                    more: { type: "string" },
                  },
                },
                result: {
                  type: "object",
                  properties: {
                    choice: { type: "string", const: "two" },
                    more: { type: "string" },
                  },
                  required: ["choice"],
                },
              },
            ],
          }),
          oneOfSchema,
          SUPER_SCHEMA,
          true,
          []
        )
      ).toEqual([
        {
          ...(SUPER_SCHEMA.definitions?.choice1 as Schema),
          required: ["choice", "more"],
        },
        {
          ...(SUPER_SCHEMA.definitions?.choice2 as Schema),
          required: ["choice"],
        },
      ]);
    });
    it("resolves oneOf with multiple $refs", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    field: {
                      properties: {
                        a: { enum: ["typeA"] },
                        b: { type: "number" },
                      },
                    },
                  },
                },
                { anyOf: [{ required: ["field"] }] },
              ],
            },
            value: [],
            result: false,
          },
          {
            schema: {
              type: "array",
              items: {
                properties: { a: { enum: ["typeB"] }, c: { type: "boolean" } },
              },
            },
            value: [],
            result: true,
          },
        ],
      });
      const schema: Schema = {
        oneOf: [
          {
            type: "object",
            properties: {
              field: {
                $ref: "#/definitions/aObject",
              },
            },
          },
          {
            type: "array",
            items: {
              $ref: "#/definitions/bObject",
            },
          },
        ],
      };
      const rootSchema: Schema = {
        definitions: {
          aObject: {
            properties: {
              a: { enum: ["typeA"] },
              b: { type: "number" },
            },
          },
          bObject: {
            properties: {
              a: { enum: ["typeB"] },
              c: { type: "boolean" },
            },
          },
        },
      };
      expect(
        resolveAnyOrOneOfSchemas(
          testValidator,
          defaultMerger,
          schema,
          rootSchema,
          true,
          []
        )
      ).toEqual([
        {
          type: "object",
          properties: {
            field: {
              properties: {
                a: { enum: ["typeA"] },
                b: { type: "number" },
              },
            },
          },
        },
        {
          type: "array",
          items: {
            properties: {
              a: { enum: ["typeB"] },
              c: { type: "boolean" },
            },
          },
        },
      ]);
    });
  });
  describe("resolveCondition()", () => {
    it("returns both conditions with expandAll", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              properties: { country: { const: "United States of America" } },
            },
            value: {},
            result: true,
          },
        ],
      });
      expect(
        resolveCondition(
          testValidator,
          createMerger({
            merges: [
              {
                left: {
                  type: "object",
                  properties: {
                    country: {
                      default: "United States of America",
                      enum: ["United States of America", "Canada"],
                    },
                  },
                },
                right: {
                  properties: {
                    postal_code: { pattern: "[0-9]{5}(-[0-9]{4})?" },
                  },
                },
                result: {
                  type: "object",
                  properties: {
                    country: {
                      default: "United States of America",
                      enum: ["United States of America", "Canada"],
                    },
                    postal_code: { pattern: "[0-9]{5}(-[0-9]{4})?" },
                  },
                },
              },
              {
                left: {
                  type: "object",
                  properties: {
                    country: {
                      default: "United States of America",
                      enum: ["United States of America", "Canada"],
                    },
                  },
                },
                right: {
                  properties: {
                    postal_code: { pattern: "[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" },
                  },
                },
                result: {
                  type: "object",
                  properties: {
                    country: {
                      default: "United States of America",
                      enum: ["United States of America", "Canada"],
                    },
                    postal_code: { pattern: "[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" },
                  },
                },
              },
            ],
          }),
          SCHEMA_WITH_SINGLE_CONDITION,
          SCHEMA_WITH_SINGLE_CONDITION,
          true,
          new Set()
        )
      ).toEqual([
        {
          type: "object",
          properties: {
            ...SCHEMA_WITH_SINGLE_CONDITION.properties,
            ...(SCHEMA_WITH_SINGLE_CONDITION.then as Schema).properties,
          },
        },
        {
          type: "object",
          properties: {
            ...SCHEMA_WITH_SINGLE_CONDITION.properties,
            ...(SCHEMA_WITH_SINGLE_CONDITION.else as Schema).properties,
          },
        },
      ]);
    });
    it("returns neither condition with expandAll, using boolean based then/else", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              properties: { country: { const: "United States of America" } },
            },
            value: {},
            result: true,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          country: {
            default: "United States of America",
            enum: ["United States of America", "Canada"],
          },
        },
        if: {
          properties: { country: { const: "United States of America" } },
        },
        then: false,
        else: true,
      };
      expect(
        resolveCondition(
          testValidator,
          defaultMerger,
          schema,
          schema,
          true,
          new Set()
        )
      ).toEqual([
        {
          type: "object",
          properties: {
            ...SCHEMA_WITH_SINGLE_CONDITION.properties,
          },
        },
      ]);
    });
  });
  describe("retrieveSchema() with resolveAnyOfOrOneOfRefs", () => {
    it("resolves simple ref with no anyOf or oneOfs when false", () => {
      const priceSchema: Schema = SUPER_SCHEMA.properties?.price as Schema;
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          priceSchema,
          SUPER_SCHEMA,
          {}
        )
      ).toEqual({
        ...(SUPER_SCHEMA.definitions?.price as Schema),
      });
    });
    it("resolves simple ref with no anyOf or oneOfs when true", () => {
      const priceSchema: Schema = SUPER_SCHEMA.properties?.price as Schema;
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          priceSchema,
          SUPER_SCHEMA,
          {},
          true
        )
      ).toEqual({
        ...(SUPER_SCHEMA.definitions?.price as Schema),
      });
    });
    it("does not resolves the references inside of anyOfs when false", () => {
      const anyOfSchema: Schema = SUPER_SCHEMA.properties?.multi as Schema;
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          anyOfSchema,
          SUPER_SCHEMA,
          {}
        )
      ).toEqual(anyOfSchema);
    });
    it("resolves the references inside of anyOfs when true", () => {
      const anyOfSchema: Schema = SUPER_SCHEMA.properties?.multi as Schema;
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          anyOfSchema,
          SUPER_SCHEMA,
          {},
          true
        )
      ).toEqual({
        ...anyOfSchema,
        anyOf: [
          {
            ...(SUPER_SCHEMA.definitions?.foo as Schema),
          },
        ],
      });
    });
    it("does not resolves the references inside of oneOfs when false", () => {
      const oneOfSchema: Schema = SUPER_SCHEMA.properties?.single as Schema;
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          oneOfSchema,
          SUPER_SCHEMA,
          {},
          false
        )
      ).toEqual(oneOfSchema);
    });
    it("resolves the references inside of oneOfs when true", () => {
      const oneOfSchema: Schema = SUPER_SCHEMA.properties?.single as Schema;
      expect(
        retrieveSchema(
          testValidator,
          defaultMerger,
          oneOfSchema,
          SUPER_SCHEMA,
          {},
          true
        )
      ).toEqual({
        ...oneOfSchema,
        oneOf: [
          {
            ...(SUPER_SCHEMA.definitions?.choice1 as Schema),
          },
          {
            ...(SUPER_SCHEMA.definitions?.choice2 as Schema),
          },
        ],
      });
    });
  });
});
