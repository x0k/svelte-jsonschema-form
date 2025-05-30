// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/b12175679079be956570349771dddd65406b3773/packages/utils/test/schema/getDefaultFormStateTest.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  describe,
  it,
  test,
  expect,
  afterAll,
  beforeAll,
  beforeEach,
  vi,
  type MockInstance,
} from "vitest";

import type { Schema } from "./schema.js";
import type { Validator } from "./validator.js";
import { createValidator } from "./test-validator.js";
import { RECURSIVE_REF, RECURSIVE_REF_ALLOF } from "./fixtures/test-data.js";
import {
  AdditionalItemsHandling,
  computeDefaults,
  ensureFormDataMatchingSchema,
  getArrayDefaults,
  getDefaultBasedOnSchemaType,
  getDefaultFormState,
  getInnerSchemaForArrayItem,
  getObjectDefaults,
  type Experimental_DefaultFormStateBehavior,
} from "./default-state.js";
import { defaultMerger } from "./merger.js";

let testValidator: Validator;

beforeEach(() => {
  testValidator = createValidator();
});

const defaults = {
  isSchemaRoot: true,
  rootSchema: {},
  includeUndefinedValues: false,
  stack: new Set<string>(),
  required: false,
  parentDefaults: undefined,
  experimental_defaultFormStateBehavior: {},
  rawFormData: undefined,
  shouldMergeDefaultsIntoFormData: false,
};

describe("getDefaultFormState2()", () => {
  let consoleWarnSpy: MockInstance<typeof console.warn>;
  beforeAll(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {}); // mock this to avoid actually warning in the tests
  });
  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  describe("object schemas", () => {
    describe("schema with a ref", () => {
      const schema: Schema = {
        definitions: {
          foo: {
            type: "number",
            default: 42,
          },
          testdef: {
            type: "object",
            properties: {
              foo: {
                $ref: "#/definitions/foo",
              },
            },
          },
        },
        $ref: "#/definitions/testdef",
      };
      const expected = {
        foo: 42,
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema },
            expected
          )
        ).toBe(undefined);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rawFormData: {}, rootSchema: schema },
            expected
          )
        ).toEqual({});
      });
    });

    describe("schema with a const property", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          test: {
            type: "string",
            const: "test",
          },
        },
      };
      const expected = {
        test: "test",
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema },
            undefined
          )
        ).toEqual(expected);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rawFormData: {}, rootSchema: schema },
            undefined
          )
        ).toEqual(expected);
      });

      describe("constAsDefaults is never", () => {
        const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
          {
            constAsDefaults: "never",
          };
        const expected = {};

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              undefined,
              schema,
              undefined,
              experimental_defaultFormStateBehavior
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              experimental_defaultFormStateBehavior,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual(expected);
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rawFormData: {},
                rootSchema: schema,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual(expected);
        });
      });
    });

    describe("an object with an optional property that has a nested required property", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "string",
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      const expected = {
        requiredProperty: "foo",
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema },
            undefined
          )
        ).toEqual(expected);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rawFormData: {}, rootSchema: schema },
            undefined
          )
        ).toEqual(expected);
      });
    });

    describe("an object with an optional property that has a nested required property with default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "string",
                default: "",
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      const expected = {
        requiredProperty: "foo",
        optionalProperty: { nestedRequiredProperty: "" },
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
          })
        );
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema },
            undefined
          )
        ).toEqual(expected);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rawFormData: {}, rootSchema: schema },
            undefined
          )
        ).toEqual(expected);
      });
    });

    describe("an object with an optional property that has a nested required property and includeUndefinedValues", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "object",
                properties: {
                  undefinedProperty: {
                    type: "string",
                  },
                },
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      const includeUndefinedValues = true;
      const expected = {
        optionalProperty: {
          nestedRequiredProperty: {
            undefinedProperty: undefined,
          },
        },
        requiredProperty: "foo",
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema,
            includeUndefinedValues
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            includeUndefinedValues,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema, includeUndefinedValues },
            undefined
          )
        ).toEqual(expected);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rawFormData: {},
              rootSchema: schema,
              includeUndefinedValues,
            },
            undefined
          )
        ).toEqual(expected);
      });
    });

    describe("an object with an optional property that has a nested required property and includeUndefinedValues is 'excludeObjectChildren'", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalNumberProperty: {
            type: "number",
          },
          optionalObjectProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "object",
                properties: {
                  undefinedProperty: {
                    type: "string",
                  },
                },
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      const includeUndefinedValues = "excludeObjectChildren";
      const expected = {
        optionalNumberProperty: undefined,
        optionalObjectProperty: {
          nestedRequiredProperty: {},
        },
        requiredProperty: "foo",
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema,
            includeUndefinedValues
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            includeUndefinedValues,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema, includeUndefinedValues },
            undefined
          )
        ).toEqual(expected);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rawFormData: {},
              rootSchema: schema,
              includeUndefinedValues,
            },
            undefined
          )
        ).toEqual(expected);
      });
    });

    describe("an object with an additionalProperties", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        additionalProperties: true,
        required: ["requiredProperty"],
        default: {
          foo: "bar",
        },
      };
      const expected = {
        requiredProperty: "foo",
        foo: "bar",
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
            },
            { foo: "bar" }
          )
        ).toEqual(expected);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rawFormData: {},
              rootSchema: schema,
            },
            { foo: "bar" }
          )
        ).toEqual(expected);
      });
    });

    describe("an object with an additionalProperties and includeUndefinedValues", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        additionalProperties: {
          type: "string",
        },
        required: ["requiredProperty"],
        default: {
          foo: "bar",
        },
      };
      const includeUndefinedValues = true;
      const expected = {
        requiredProperty: "foo",
        foo: "bar",
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema,
            includeUndefinedValues
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            includeUndefinedValues,
          })
        );
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema, includeUndefinedValues },
            { foo: "bar" }
          )
        ).toEqual(expected);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rawFormData: {},
              rootSchema: schema,
              includeUndefinedValues,
            },
            { foo: "bar" }
          )
        ).toEqual(expected);
      });
    });

    describe("an object with additionalProperties type object with defaults and formdata", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          test: {
            title: "Test",
            type: "object",
            properties: {
              foo: {
                type: "string",
              },
            },
            additionalProperties: {
              type: "object",
              properties: {
                host: {
                  title: "Host",
                  type: "string",
                  default: "localhost",
                },
                port: {
                  title: "Port",
                  type: "integer",
                  default: 389,
                },
              },
            },
          },
        },
      };
      const rawFormData = { test: { foo: "x", newKey: {} } };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            rawFormData,
            schema
          )
        ).toEqual({
          test: {
            foo: "x",
            newKey: {
              host: "localhost",
              port: 389,
            },
          },
        });
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            rawFormData,
          })
        ).toEqual({
          test: {
            newKey: {
              host: "localhost",
              port: 389,
            },
          },
        });
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema, rawFormData },
            undefined
          )
        ).toEqual({
          test: {
            newKey: {
              host: "localhost",
              port: 389,
            },
          },
        });
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema, rawFormData },
            undefined
          )
        ).toEqual({
          test: {
            newKey: {
              host: "localhost",
              port: 389,
            },
          },
        });
      });

      describe("an object with additionalProperties type object with formdata and no defaults", () => {
        const schema: Schema = {
          type: "object",
          properties: {
            test: {
              title: "Test",
              type: "object",
              properties: {
                foo: {
                  type: "string",
                },
              },
              additionalProperties: {
                type: "object",
                properties: {
                  host: {
                    title: "Host",
                    type: "string",
                  },
                  port: {
                    title: "Port",
                    type: "integer",
                  },
                },
              },
            },
          },
        };
        const rawFormData = { test: { foo: "x", newKey: {} } };

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              rawFormData,
              schema
            )
          ).toEqual({
            test: {
              foo: "x",
              newKey: {},
            },
          });
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              rawFormData,
            })
          ).toEqual({
            test: {
              newKey: {},
            },
          });
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema, rawFormData },
              undefined
            )
          ).toEqual({
            test: {
              newKey: {},
            },
          });
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema, rawFormData },
              undefined
            )
          ).toEqual({
            test: {
              newKey: {},
            },
          });
        });
      });

      describe("an object with additionalProperties type object with no defaults and non-object formdata", () => {
        const schema: Schema = {
          type: "object",
          properties: {
            test: {
              title: "Test",
              type: "object",
              properties: {
                foo: {
                  type: "string",
                },
              },
              additionalProperties: {
                type: "object",
                properties: {
                  host: {
                    title: "Host",
                    type: "string",
                  },
                  port: {
                    title: "Port",
                    type: "integer",
                  },
                },
              },
            },
          },
        };
        const rawFormData = {};
        const expected = {};

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              rawFormData,
              schema
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              rawFormData,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema, rawFormData },
              undefined
            )
          ).toEqual(expected);
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema, rawFormData },
              undefined
            )
          ).toEqual(expected);
        });
      });

      describe("an object with deep nested dependencies with formData", () => {
        beforeEach(() => {
          // Mock isValid so that withExactlyOneSubschema works as expected
          testValidator = createValidator({
            cases: [
              {
                schema: {
                  type: "object",
                  properties: { first: { enum: ["yes"] } },
                },
                value: { first: "yes" },
                result: true,
              },
              {
                schema: {
                  type: "object",
                  properties: { first: { enum: ["no"] } },
                },
                value: { first: "yes" },
                result: false,
              },
            ],
          });
        });

        const schema: Schema = {
          type: "object",
          properties: {
            nestedObject: {
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
            },
          },
        };
        const rawFormData = {
          nestedObject: {
            first: "yes",
          },
        };

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              rawFormData,
              schema,
              false,
              {
                emptyObjectFields: "populateAllDefaults",
                allOf: "skipDefaults",
                arrayMinItems: {
                  populate: "populate" as any,
                  mergeExtraDefaults: false,
                },
                mergeDefaultsIntoFormData: "useFormDataIfPresent",
              }
            )
          ).toEqual({
            nestedObject: {
              first: "yes",
              second: {
                deeplyNestedThird: "before",
              },
            },
          });
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              rawFormData,
            })
          ).toEqual({
            nestedObject: {
              first: "no",
              second: {
                deeplyNestedThird: "before",
              },
            },
          });
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema, rawFormData },
              undefined
            )
          ).toEqual({
            nestedObject: {
              first: "no",
              second: {
                deeplyNestedThird: "before",
              },
            },
          });
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema, rawFormData },
              undefined
            )
          ).toEqual({
            nestedObject: {
              first: "no",
              second: {
                deeplyNestedThird: "before",
              },
            },
          });
        });
      });

      describe("handling an invalid property schema", () => {
        const schema: Schema = {
          type: "object",
          properties: {
            invalidProperty: "not a valid property value",
          },
        } as Schema;
        const includeUndefinedValues = "excludeObjectChildren";
        const expected = {};

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              undefined,
              schema,
              includeUndefinedValues
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              includeUndefinedValues,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema, includeUndefinedValues },
              undefined
            )
          ).toEqual(expected);
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rawFormData: {},
                rootSchema: schema,
                includeUndefinedValues,
              },
              undefined
            )
          ).toEqual(expected);
        });
      });

      describe("a recursive schema", () => {
        const schema = RECURSIVE_REF;
        // NOTE: defined at L410
        // const includeUndefinedValues = 'excludeObjectChildren';

        test("getDefaultFormState", () => {
          // NOTE: `includeUndefinedValues` is not used L861
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              undefined,
              schema
            )
          ).toEqual({
            children: {
              name: "",
            },
            name: "",
          });
        });

        test("computeDefaults", () => {
          // NOTE: `includeUndefinedValues` is not used L1275
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
            })
          ).toEqual({
            name: "",
          });
        });

        test("getDefaultBasedOnSchemaType", () => {
          // NOTE: `includeUndefinedValues` is not used L1598
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema },
              undefined
            )
          ).toBe(undefined);
        });

        test("getObjectDefaults", () => {
          // NOTE: `includeUndefinedValues` is not used L1930
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rawFormData: {}, rootSchema: schema },
              undefined
            )
          ).toEqual({});
        });
      });

      describe("a recursive allof schema", () => {
        const schema = RECURSIVE_REF_ALLOF;
        const expected = {
          value: [undefined],
        };

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              undefined,
              schema
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rootSchema: schema },
              undefined
            )
          ).toEqual(expected);
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rawFormData: {}, rootSchema: schema },
              undefined
            )
          ).toEqual(expected);
        });
      });

      describe("a simple schema and no optional args", () => {
        const schema: Schema = { type: "string" };
        const expected = undefined;

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(testValidator, defaultMerger, schema, undefined)
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, defaults)
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              defaults,
              undefined
            )
          ).toEqual(expected);
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              { ...defaults, rawFormData: {} },
              undefined
            )
          ).toEqual({});
        });
      });

      describe("an object const value merge with formData", () => {
        const schema: Schema = {
          type: "object",
          properties: {
            localConst: {
              type: "string",
              const: "local",
            },
            RootConst: {
              type: "object",
              properties: {
                attr1: {
                  type: "number",
                },
                attr2: {
                  type: "boolean",
                },
              },
              const: {
                attr1: 1,
                attr2: true,
              },
            },
            RootAndLocalConst: {
              type: "string",
              const: "FromLocal",
            },
            fromFormData: {
              type: "string",
            },
          },
          const: {
            RootAndLocalConst: "FromRoot",
          },
        };
        const rawFormData = {
          fromFormData: "fromFormData",
        };
        const includeUndefinedValues = false;
        const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
          {
            emptyObjectFields: "skipDefaults",
          };

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              rawFormData,
              schema,
              includeUndefinedValues,
              experimental_defaultFormStateBehavior
            )
          ).toEqual({
            localConst: "local",
            RootConst: {
              attr1: 1,
              attr2: true,
            },
            RootAndLocalConst: "FromLocal",
            fromFormData: "fromFormData",
          });
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              rawFormData,
              includeUndefinedValues,
              experimental_defaultFormStateBehavior,
            })
          ).toEqual({
            localConst: "local",
            RootConst: {
              attr1: 1,
              attr2: true,
            },
            RootAndLocalConst: "FromLocal",
          });
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                rawFormData,
                includeUndefinedValues,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual({
            localConst: "local",
            RootConst: {
              attr1: 1,
              attr2: true,
            },
            RootAndLocalConst: "FromLocal",
          });
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                rawFormData,
                includeUndefinedValues,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual({
            localConst: "local",
            RootConst: {
              attr1: 1,
              attr2: true,
            },
            RootAndLocalConst: "FromLocal",
          });
        });

        describe("constAsDefault is never", () => {
          const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
            {
              emptyObjectFields: "skipDefaults",
              constAsDefaults: "never",
            };

          test("getDefaultFormState", () => {
            expect(
              getDefaultFormState(
                testValidator,
                defaultMerger,
                schema,
                rawFormData,
                schema,
                includeUndefinedValues,
                experimental_defaultFormStateBehavior
              )
            ).toEqual({
              fromFormData: "fromFormData",
            });
          });

          test("computeDefaults", () => {
            expect(
              computeDefaults(testValidator, defaultMerger, schema, {
                ...defaults,
                rootSchema: schema,
                rawFormData,
                includeUndefinedValues,
                experimental_defaultFormStateBehavior,
              })
            ).toEqual({});
          });

          test("getDefaultBasedOnSchemaType", () => {
            expect(
              getDefaultBasedOnSchemaType(
                testValidator,
                defaultMerger,
                schema,
                {
                  ...defaults,
                  rootSchema: schema,
                  experimental_defaultFormStateBehavior,
                },
                undefined
              )
            ).toEqual({});
          });

          test("getObjectDefaults", () => {
            expect(
              getObjectDefaults(
                testValidator,
                defaultMerger,
                schema,
                {
                  ...defaults,
                  rawFormData: {},
                  rootSchema: schema,
                  experimental_defaultFormStateBehavior,
                },
                undefined
              )
            ).toEqual({});
          });
        });
      });
    });

    describe("an object with non valid formData for enum properties", () => {
      beforeEach(() => {
        testValidator = createValidator({
          cases: [
            {
              schema: {
                type: "object",
                properties: { animal: { enum: ["Cat"] } },
              },
              value: { animal: "Fish", food: "meat", water: null },
              result: false,
            },
            {
              schema: {
                type: "object",
                properties: { animal: { enum: ["Fish"] } },
              },
              value: { animal: "Fish", food: "meat", water: null },
              result: true,
            },
          ],
        });
      });

      const schema: Schema = {
        type: "object",
        properties: {
          animal: {
            enum: ["Cat", "Fish"],
          },
        },
        dependencies: {
          animal: {
            oneOf: [
              {
                properties: {
                  animal: {
                    enum: ["Cat"],
                  },
                  food: {
                    type: "string",
                    enum: ["meat", "grass", "fish"],
                    default: "meat",
                  },
                },
              },
              {
                properties: {
                  animal: {
                    enum: ["Fish"],
                  },
                  food: {
                    type: "string",
                    enum: ["insect", "worms"],
                    default: "worms",
                  },
                  water: {
                    type: "string",
                    enum: ["lake", "sea"],
                    default: "sea",
                  },
                },
              },
            ],
          },
        },
      };
      const rawFormData = {
        animal: "Fish",
        food: "meat",
        water: null,
      };
      const shouldMergeDefaultsIntoFormData = true;

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            rawFormData,
            schema
          )
        ).toEqual({
          animal: "Fish",
          food: "worms",
          water: null,
        });
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            rawFormData,
            shouldMergeDefaultsIntoFormData,
          })
        ).toEqual({
          animal: "Fish",
          food: "worms",
          water: "sea",
        });
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              rawFormData,
              shouldMergeDefaultsIntoFormData,
            },
            undefined
          )
        ).toEqual({
          animal: "Fish",
        });
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              rawFormData,
              shouldMergeDefaultsIntoFormData,
            },
            undefined
          )
        ).toEqual({
          animal: "Fish",
        });
      });

      describe('mergeDefaultsIntoFormData set to "useDefaultIfFormDataUndefined"', () => {
        const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
          {
            mergeDefaultsIntoFormData: "useDefaultIfFormDataUndefined",
          };
        const expected = {
          animal: "Fish",
          food: "worms",
          water: "sea",
        };

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              rawFormData,
              schema,
              undefined,
              experimental_defaultFormStateBehavior
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              rawFormData,
              experimental_defaultFormStateBehavior,
              shouldMergeDefaultsIntoFormData,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                rawFormData,
                shouldMergeDefaultsIntoFormData,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual({
            animal: "Fish",
          });
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                rawFormData,
                shouldMergeDefaultsIntoFormData,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual({
            animal: "Fish",
          });
        });
      });
    });

    describe("an object with a valid formData and enum property with default value", () => {
      test("getDefaultFormState", () => {
        const schema: Schema = {
          type: "object",
          properties: {
            test: {
              type: "string",
              enum: [
                { label: "a", value: "a" },
                { label: "b", value: "b" },
              ],
              default: { label: "a", value: "a" },
            },
          },
        };

        expect(
          getDefaultFormState(testValidator, defaultMerger, schema, {
            test: { label: "b", value: "b" },
          })
        ).toEqual({
          test: { label: "b", value: "b" },
        });
      });
    });

    describe("oneOf with const values", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          oneOfField: {
            title: "One Of Field",
            type: "string",
            oneOf: [
              {
                const: "username",
                title: "Username and password",
              },
              {
                const: "secret",
                title: "SSO",
              },
            ],
          },
        },
        required: ["oneOfField"],
      };

      describe("constAsDefaults is always", () => {
        const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
          {
            constAsDefaults: "always",
          };
        const expected = {
          oneOfField: "username",
        };

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              undefined,
              schema,
              undefined,
              experimental_defaultFormStateBehavior
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              experimental_defaultFormStateBehavior,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual(expected);
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rawFormData: {},
                rootSchema: schema,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual(expected);
        });
      });

      describe("constAsDefaults is skipOneOf", () => {
        const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
          {
            constAsDefaults: "skipOneOf",
          };
        const expected = {};

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              undefined,
              schema,
              undefined,
              experimental_defaultFormStateBehavior
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              experimental_defaultFormStateBehavior,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual(expected);
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rawFormData: {},
                rootSchema: schema,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual(expected);
        });
      });

      describe("constAsDefaults is never", () => {
        const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
          {
            constAsDefaults: "never",
          };
        const expected = {};

        test("getDefaultFormState", () => {
          expect(
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              undefined,
              schema,
              undefined,
              experimental_defaultFormStateBehavior
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              experimental_defaultFormStateBehavior,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual(expected);
        });

        test("getObjectDefaults", () => {
          expect(
            getObjectDefaults(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rawFormData: {},
                rootSchema: schema,
                experimental_defaultFormStateBehavior,
              },
              undefined
            )
          ).toEqual(expected);
        });
      });
    });

    describe("an object with invalid formData const and constAsDefault set to always", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          stringField: {
            type: "string",
            const: "fromConst",
          },
        },
      };
      const rawFormData = {
        stringField: "fromFormData",
      };
      const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
        {
          constAsDefaults: "always",
        };
      const expected = {
        stringField: "fromConst",
      };

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            rawFormData,
            schema,
            undefined,
            experimental_defaultFormStateBehavior
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            rawFormData,
            experimental_defaultFormStateBehavior,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              rawFormData,
              experimental_defaultFormStateBehavior,
            },
            undefined
          )
        ).toEqual(expected);
      });

      test("getObjectDefaults", () => {
        expect(
          getObjectDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              rawFormData,
              experimental_defaultFormStateBehavior,
            },
            undefined
          )
        ).toEqual(expected);
      });
    });
  });

  describe("array schemas", () => {
    describe("array with defaults with no formData", () => {
      const schema: Schema = {
        type: "array",
        minItems: 4,
        default: ["Raphael", "Michaelangelo"],
        items: {
          type: "string",
          default: "Unknown",
        },
      };
      const includeUndefinedValues = "excludeObjectChildren";
      const expected = ["Raphael", "Michaelangelo", "Unknown", "Unknown"];

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema,
            includeUndefinedValues
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            includeUndefinedValues,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              includeUndefinedValues,
            },
            ["Raphael", "Michaelangelo"]
          )
        ).toEqual(expected);
      });

      test("getArrayDefaults", () => {
        expect(
          getArrayDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              includeUndefinedValues,
            },
            ["Raphael", "Michaelangelo"]
          )
        ).toEqual(expected);
      });

      describe("with empty array as formData", () => {
        const rawFormData: never[] = [];
        const experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior =
          {
            arrayMinItems: {
              mergeExtraDefaults: true,
              populate: "all",
            },
          };

        test("getDefaultFormState", () => {
          expect(
            // NOTE: `rawFormData` is not used L1003
            getDefaultFormState(
              testValidator,
              defaultMerger,
              schema,
              undefined,
              schema,
              includeUndefinedValues,
              experimental_defaultFormStateBehavior
            )
          ).toEqual(expected);
        });

        test("computeDefaults", () => {
          expect(
            computeDefaults(testValidator, defaultMerger, schema, {
              ...defaults,
              rootSchema: schema,
              rawFormData,
              includeUndefinedValues,
              experimental_defaultFormStateBehavior,
            })
          ).toEqual(expected);
        });

        test("getDefaultBasedOnSchemaType", () => {
          expect(
            getDefaultBasedOnSchemaType(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                rawFormData,
                includeUndefinedValues,
                experimental_defaultFormStateBehavior,
              },
              ["Raphael", "Michaelangelo"]
            )
          ).toEqual(expected);
        });

        test("getArrayDefaults", () => {
          expect(
            getArrayDefaults(
              testValidator,
              defaultMerger,
              schema,
              {
                ...defaults,
                rootSchema: schema,
                rawFormData,
                includeUndefinedValues,
                experimental_defaultFormStateBehavior,
              },
              ["Raphael", "Michaelangelo"]
            )
          ).toEqual(expected);
        });
      });
    });

    describe("array with no defaults", () => {
      const schema: Schema = {
        type: "array",
        minItems: 4,
        items: {
          type: "string",
        },
      };
      const includeUndefinedValues = "excludeObjectChildren";
      const expected: undefined[] = [
        undefined,
        undefined,
        undefined,
        undefined,
      ];

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema,
            includeUndefinedValues
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            includeUndefinedValues,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema, includeUndefinedValues },
            undefined
          )
        ).toEqual(expected);
      });

      test("getArrayDefaults", () => {
        expect(
          getArrayDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              includeUndefinedValues,
            },
            undefined
          )
        ).toEqual(expected);
      });
    });

    describe("array const value populate as defaults", () => {
      const schema: Schema = {
        type: "array",
        minItems: 4,
        const: ["ConstFromRoot", "ConstFromRoot"],
        items: {
          type: "string",
          const: "Constant",
        },
      };
      const includeUndefinedValues = "excludeObjectChildren";
      const expected = [
        "ConstFromRoot",
        "ConstFromRoot",
        "Constant",
        "Constant",
      ];

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema,
            includeUndefinedValues
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            includeUndefinedValues,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              includeUndefinedValues,
            },
            ["ConstFromRoot", "ConstFromRoot"]
          )
        ).toEqual(expected);
      });

      test("getArrayDefaults", () => {
        expect(
          getArrayDefaults(
            testValidator,
            defaultMerger,
            schema,
            {
              ...defaults,
              rootSchema: schema,
              includeUndefinedValues,
            },
            ["ConstFromRoot", "ConstFromRoot"]
          )
        ).toEqual(expected);
      });
    });

    describe("an invalid array schema", () => {
      const schema: Schema = {
        type: "array",
        items: "not a valid item value",
      } as Schema;
      const includeUndefinedValues = "excludeObjectChildren";
      const expected: never[] = [];

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            schema,
            undefined,
            schema,
            includeUndefinedValues
          )
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            includeUndefinedValues,
          })
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema, includeUndefinedValues },
            undefined
          )
        ).toEqual(expected);
      });

      test("getArrayDefaults", () => {
        expect(
          getArrayDefaults(
            testValidator,
            defaultMerger,
            schema,
            { ...defaults, rootSchema: schema, includeUndefinedValues },
            undefined
          )
        ).toEqual(expected);
      });
    });

    describe("simple schema and no optional args", () => {
      const schema: Schema = { type: "array" };
      const expected: never[] = [];

      test("getDefaultFormState", () => {
        expect(
          getDefaultFormState(testValidator, defaultMerger, schema)
        ).toEqual(expected);
      });

      test("computeDefaults", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, defaults)
        ).toEqual(expected);
      });

      test("getDefaultBasedOnSchemaType", () => {
        expect(
          getDefaultBasedOnSchemaType(
            testValidator,
            defaultMerger,
            schema,
            defaults,
            undefined
          )
        ).toEqual(expected);
      });

      test("getArrayDefaults", () => {
        expect(
          getArrayDefaults(
            testValidator,
            defaultMerger,
            schema,
            defaults,
            undefined
          )
        ).toEqual(expected);
      });
    });
  });

  it("getInnerSchemaForArrayItem() item of type boolean returns empty schema", () => {
    expect(
      getInnerSchemaForArrayItem(
        { items: [true] },
        AdditionalItemsHandling.Ignore,
        0
      )
    ).toEqual({});
  });

  describe("getValidFormData", () => {
    let schema: Schema;
    it("Test schema with non valid formData for enum property", () => {
      schema = {
        type: "string",
        enum: ["a", "b", "c"],
      };

      expect(
        ensureFormDataMatchingSchema(
          testValidator,
          defaultMerger,
          schema,
          schema,
          "d"
        )
      ).toBeUndefined();
    });
    it("Test schema with valid formData for enum property", () => {
      expect(
        ensureFormDataMatchingSchema(
          testValidator,
          defaultMerger,
          schema,
          schema,
          "b"
        )
      ).toEqual("b");
    });
    it("Test schema with const property", () => {
      schema = {
        type: "string",
        enum: ["a", "b", "c"],
        const: "a",
      };

      expect(
        ensureFormDataMatchingSchema(
          testValidator,
          defaultMerger,
          schema,
          schema,
          "a"
        )
      ).toEqual("a");
    });
    it("Test schema with valid formData with an enum and its default value", () => {
      schema = {
        type: "string",
        enum: [
          { label: "a", value: "a" },
          { label: "b", value: "b" },
        ],
        default: { label: "a", value: "a" },
      };

      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          label: "b",
          value: "b",
        })
      ).toEqual({
        label: "b",
        value: "b",
      });
    });
  });

  // NOTE: We don't support AJV `$data` property
  // describe('AJV $data reference in const property in schema should not be treated as default/const value', () => {
  //   let schema: Schema;
  //   it('test nested object with $data in the schema', () => {
  //     schema = {
  //       type: 'object',
  //       properties: {
  //         email: {
  //           type: 'string',
  //           title: 'E-mail',
  //           format: 'email',
  //         },
  //         emailConfirm: {
  //           type: 'string',
  //           const: {
  //             $data: '/email',
  //           },
  //           title: 'Confirm e-mail',
  //           format: 'email',
  //         },
  //         nestedObject: {
  //           type: 'object',
  //           properties: {
  //             nestedEmail: {
  //               type: 'string',
  //               title: 'E-mail',
  //               format: 'email',
  //             },
  //             nestedEmailConfirm: {
  //               type: 'string',
  //               title: 'Confirm e-mail',
  //               const: {
  //                 $data: '/nestedObject/nestedEmail',
  //               },
  //               format: 'email',
  //             },
  //           },
  //         },
  //         nestedObjectConfirm: {
  //           type: 'object',
  //           properties: {
  //             nestedEmailConfirm: {
  //               type: 'string',
  //               title: 'Confirm e-mail',
  //               const: {
  //                 $data: '/nestedObject/nestedEmail',
  //               },
  //               format: 'email',
  //             },
  //           },
  //         },
  //         arrayConfirm: {
  //           type: 'array',
  //           items: {
  //             type: 'string',
  //             title: 'Confirm e-mail',
  //             const: {
  //               $data: '/nestedObject/nestedEmail',
  //             },
  //             format: 'email',
  //           },
  //         },
  //       },
  //     };
  //     expect(
  //       computeDefaults3(testValidator, defaultMerger, schema, {
  //         ...defaults,
  //         rootSchema: schema,
  //       })
  //     ).toEqual({
  //       arrayConfirm: [],
  //     });
  //   });
  //   it('test nested object with $data in the schema and emptyObjectFields set to populateRequiredDefaults', () => {
  //     expect(
  //       computeDefaults3(testValidator, defaultMerger, schema, {
  //         ...defaults,
  //         rootSchema: schema,
  //         experimental_defaultFormStateBehavior: { emptyObjectFields: 'populateRequiredDefaults' },
  //       })
  //     ).toEqual({});
  //   });
  //   it('test nested object with $data in the schema and emptyObjectFields set to skipEmptyDefaults', () => {
  //     expect(
  //       computeDefaults3(testValidator, defaultMerger, schema, {
  //         ...defaults,
  //         rootSchema: schema,
  //         experimental_defaultFormStateBehavior: { emptyObjectFields: 'skipEmptyDefaults' },
  //       })
  //     ).toEqual({});
  //   });
  //   it('test nested object with $data in the schema and emptyObjectFields set to skipDefaults', () => {
  //     expect(
  //       computeDefaults3(testValidator, defaultMerger, schema, {
  //         ...defaults,
  //         rootSchema: schema,
  //         experimental_defaultFormStateBehavior: { emptyObjectFields: 'skipDefaults' },
  //       })
  //     ).toEqual({});
  //   });
  // });

  describe("default form state behavior: ignore min items unless required", () => {
    it("should return empty data for an optional array property with minItems", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalArray: {
            type: "array",
            minItems: 2,
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "requiredOnly" },
          },
        })
      ).toEqual({});
    });
    it("should return empty array when given an empty array as form data for an optional array property with minItems", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalArray: {
            type: "array",
            minItems: 2,
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          rawFormData: { optionalArray: [] },
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "requiredOnly" },
          },
        })
      ).toEqual({ optionalArray: [] });
    });
    it("should return undefined filled array for a required array property with minItems", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          requiredArray: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
          },
        },
        required: ["requiredArray"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "requiredOnly" },
          },
        })
      ).toEqual({ requiredArray: [undefined, undefined] });
    });
    it("should return defaults array for a required array property with minItems", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          requiredArray: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            default: ["default0", "default1"],
          },
        },
        required: ["requiredArray"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "requiredOnly" },
          },
        })
      ).toEqual({ requiredArray: ["default0", "default1"] });
    });
    it("should not combine defaults with raw form data for a required array property with minItems", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          requiredArray: {
            type: "array",
            items: { type: "string", default: "default0" },
            minItems: 2,
          },
        },
        required: ["requiredArray"],
      };
      // merging defaults with formData does not happen in computeDefaults, regardless of parameters
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          rawFormData: { requiredArray: ["raw0"] },
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "requiredOnly" },
          },
        })
      ).toEqual({ requiredArray: ["default0", "default0"] });
    });
  });

  describe('default form state behavior: arrayMinItems.populate = "never"', () => {
    it("should not be filled if minItems defined and required", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          requiredArray: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
        },
        required: ["requiredArray"],
      };

      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ requiredArray: [] });
    });
    it("should not be filled if minItems defined and non required", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          nonRequiredArray: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ nonRequiredArray: [] });
    });

    it("should be filled with default values if required", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          requiredArray: {
            type: "array",
            default: ["raw0"],
            items: { type: "string" },
            minItems: 1,
          },
        },
        required: ["requiredArray"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ requiredArray: ["raw0"] });
    });

    it("should be filled with default values if non required", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          nonRequiredArray: {
            type: "array",
            default: ["raw0"],
            items: { type: "string" },
            minItems: 1,
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ nonRequiredArray: ["raw0"] });
    });

    it("should be filled with default values partly and not fill others", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          nonRequiredArray: {
            type: "array",
            default: ["raw0"],
            items: { type: "string" },
            minItems: 2,
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          rawFormData: { nonRequiredArray: ["raw1"] },
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ nonRequiredArray: ["raw1"] });
    });

    it("should not add items to formData", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          nonRequiredArray: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          rawFormData: { nonRequiredArray: ["not add"] },
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ nonRequiredArray: ["not add"] });
    });

    it("should be empty array if minItems not defined and required", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          requiredArray: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["requiredArray"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ requiredArray: [] });
    });
    it("should be empty array if minItems not defined and non required", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          nonRequiredArray: {
            type: "array",
            items: { type: "string" },
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ nonRequiredArray: [] });
    });

    it("injecting data should be stopped at the top level of tree", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          nonRequiredArray: {
            type: "array",
            minItems: 2,
            items: {
              type: "object",
              properties: {
                nestedValue: { type: "string" },
                nestedArray: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({ nonRequiredArray: [] });
    });
    it("no injecting for childs", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          nonRequiredArray: {
            type: "array",
            minItems: 2,
            items: {
              type: "object",
              properties: {
                nestedValue: { type: "string" },
                nestedArray: {
                  type: "array",
                  minItems: 3,
                  items: { type: "string" },
                },
              },
            },
          },
        },
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          rawFormData: {
            nonRequiredArray: [
              {
                nestedArray: ["raw0"],
              },
            ],
          },
          experimental_defaultFormStateBehavior: {
            arrayMinItems: { populate: "never" },
          },
        })
      ).toStrictEqual({
        nonRequiredArray: [
          {
            nestedArray: ["raw0"],
          },
        ],
      });
    });
  });
  /**
   * emptyObjectFields options tests
   */
  describe('default form state behavior: emptyObjectFields = "populateRequiredDefaults"', () => {
    it("test an object with an optional property that has a nested required property", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "string",
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "populateRequiredDefaults",
          },
        })
      ).toEqual({ requiredProperty: "foo" });
    });
    it("test an object with a nested required property in a ref", () => {
      const schema: Schema = {
        type: "object",
        definitions: {
          nestedRequired: {
            properties: {
              nested: {
                type: "string",
                default: "foo",
              },
            },
            required: ["nested"],
          },
        },
        properties: {
          nestedRequiredProperty: {
            $ref: "#/definitions/nestedRequired",
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty", "nestedRequiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "populateRequiredDefaults",
          },
        })
      ).toEqual({
        requiredProperty: "foo",
        nestedRequiredProperty: { nested: "foo" },
      });
    });
    it("test an object with a nested optional property in a ref", () => {
      const schema: Schema = {
        type: "object",
        definitions: {
          nestedOptional: {
            properties: {
              nested: {
                type: "string",
                default: "foo",
              },
            },
          },
        },
        properties: {
          nestedOptionalProperty: {
            $ref: "#/definitions/nestedOptional",
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty", "nestedOptionalProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "populateRequiredDefaults",
          },
        })
      ).toEqual({ requiredProperty: "foo", nestedOptionalProperty: {} });
    });
    it("test an object with an optional property that has a nested required property with default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "string",
                default: "",
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "populateRequiredDefaults",
          },
        })
      ).toEqual({ requiredProperty: "foo" });
    });
    it("test an object with a required property that has a nested optional property which has a nested required property with default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          baseRequiredProperty: {
            type: "object",
            properties: {
              optionalProperty: {
                type: "object",
                properties: {
                  nestedRequiredProperty: {
                    type: "string",
                    default: "",
                  },
                },
                required: ["nestedRequiredProperty"],
              },
              requiredProperty: {
                type: "string",
                default: "foo",
              },
            },
            required: ["requiredProperty"],
          },
          baseOptionalProperty: {
            type: "string",
            default: "baseOptionalProperty",
          },
        },
        required: ["baseRequiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "populateRequiredDefaults",
          },
        })
      ).toEqual({
        baseRequiredProperty: {
          requiredProperty: "foo",
        },
      });
    });
    it("test an object with an optional property that has a nested required property and includeUndefinedValues", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "object",
                properties: {
                  undefinedProperty: {
                    type: "string",
                  },
                },
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          includeUndefinedValues: true,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "populateRequiredDefaults",
          },
        })
      ).toEqual({
        optionalProperty: {
          nestedRequiredProperty: {
            undefinedProperty: undefined,
          },
        },
        requiredProperty: "foo",
      });
    });
    it("test an object with an optional property that has a nested required property and includeUndefinedValues is 'excludeObjectChildren'", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalNumberProperty: {
            type: "number",
          },
          optionalObjectProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "object",
                properties: {
                  undefinedProperty: {
                    type: "string",
                  },
                },
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          includeUndefinedValues: "excludeObjectChildren",
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "populateRequiredDefaults",
          },
        })
      ).toEqual({
        optionalNumberProperty: undefined,
        optionalObjectProperty: {},
        requiredProperty: "foo",
      });
    });
  });
  describe('default form state behavior: emptyObjectFields = "skipDefaults"', () => {
    it("test an object with an optional property that has a nested required property", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "string",
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipDefaults",
          },
        })
      ).toEqual({});
    });
    it("test an object with an optional property that has a nested required property with default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "string",
                default: "",
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipDefaults",
          },
        })
      ).toEqual({});
    });
    it("test an object with an optional property that has a nested required property and includeUndefinedValues", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "object",
                properties: {
                  undefinedProperty: {
                    type: "string",
                  },
                },
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          includeUndefinedValues: true,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipDefaults",
          },
        })
      ).toEqual({
        optionalProperty: {
          nestedRequiredProperty: {
            undefinedProperty: undefined,
          },
        },
        requiredProperty: "foo",
      });
    });
    it("test an object with an optional property that has a nested required property and includeUndefinedValues is 'excludeObjectChildren'", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalNumberProperty: {
            type: "number",
          },
          optionalObjectProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "object",
                properties: {
                  undefinedProperty: {
                    type: "string",
                  },
                },
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          includeUndefinedValues: "excludeObjectChildren",
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipDefaults",
          },
        })
      ).toEqual({
        optionalNumberProperty: undefined,
        optionalObjectProperty: {},
        requiredProperty: "foo",
      });
    });
  });
  describe('default form state behavior: emptyObjectFields = "skipEmptyDefaults"', () => {
    it("test an object with an optional property that has a nested required property", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "string",
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipEmptyDefaults",
          },
        })
      ).toEqual({ requiredProperty: "foo" });
    });
    it("test an object with a nested required property in a ref", () => {
      const schema: Schema = {
        type: "object",
        definitions: {
          nestedRequired: {
            properties: {
              nested: {
                type: "string",
                default: "foo",
              },
            },
            required: ["nested"],
          },
        },
        properties: {
          nestedRequiredProperty: {
            $ref: "#/definitions/nestedRequired",
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty", "nestedRequiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipEmptyDefaults",
          },
        })
      ).toEqual({
        requiredProperty: "foo",
        nestedRequiredProperty: { nested: "foo" },
      });
    });
    it("test an object with a nested optional property in a ref", () => {
      const schema: Schema = {
        type: "object",
        definitions: {
          nestedOptional: {
            properties: {
              nested: {
                type: "string",
                default: "foo",
              },
            },
          },
        },
        properties: {
          nestedOptionalProperty: {
            $ref: "#/definitions/nestedOptional",
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty", "nestedOptionalProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipEmptyDefaults",
          },
        })
      ).toEqual({
        nestedOptionalProperty: {
          nested: "foo",
        },
        requiredProperty: "foo",
      });
    });
    it("test an object with an optional property that has a nested required property with default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "string",
                default: "",
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipEmptyDefaults",
          },
        })
      ).toEqual({
        optionalProperty: {
          nestedRequiredProperty: "",
        },
        requiredProperty: "foo",
      });
    });
    it("test an object with an optional property that has a nested required property and includeUndefinedValues", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "object",
                properties: {
                  undefinedProperty: {
                    type: "string",
                  },
                },
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          includeUndefinedValues: true,
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipEmptyDefaults",
          },
        })
      ).toEqual({
        optionalProperty: {
          nestedRequiredProperty: {
            undefinedProperty: undefined,
          },
        },
        requiredProperty: "foo",
      });
    });
    it("test an object with an optional property that has a nested required property and includeUndefinedValues is 'excludeObjectChildren'", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          optionalNumberProperty: {
            type: "number",
          },
          optionalObjectProperty: {
            type: "object",
            properties: {
              nestedRequiredProperty: {
                type: "object",
                properties: {
                  undefinedProperty: {
                    type: "string",
                  },
                },
              },
            },
            required: ["nestedRequiredProperty"],
          },
          requiredProperty: {
            type: "string",
            default: "foo",
          },
        },
        required: ["requiredProperty"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          includeUndefinedValues: "excludeObjectChildren",
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipEmptyDefaults",
          },
        })
      ).toEqual({
        optionalNumberProperty: undefined,
        optionalObjectProperty: {},
        requiredProperty: "foo",
      });
    });
    it("test an optional array without default value, an optional array with a default value, and a required array", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          array: {
            type: "array",
            title: "Multiple Select Input",
            items: {
              type: "string",
              enum: ["option1", "option2"],
            },
            uniqueItems: true,
          },
          arrayWithDefault: {
            type: "array",
            title: "Required multiple Select Input",
            items: {
              type: "string",
              enum: ["option1", "option2"],
            },
            uniqueItems: true,
            default: ["option1"],
          },
          arrayRequired: {
            type: "array",
            title: "Required multiple Select Input",
            items: {
              type: "string",
              enum: ["option1", "option2"],
            },
            uniqueItems: true,
          },
        },
        required: ["arrayRequired"],
      };
      expect(
        computeDefaults(testValidator, defaultMerger, schema, {
          ...defaults,
          rootSchema: schema,
          includeUndefinedValues: "excludeObjectChildren",
          experimental_defaultFormStateBehavior: {
            emptyObjectFields: "skipEmptyDefaults",
          },
        })
      ).toEqual({ arrayWithDefault: ["option1"] });
    });
  });

  describe("root default", () => {
    it("should map root schema default to form state, if any", () => {
      expect(
        getDefaultFormState(testValidator, defaultMerger, {
          type: "string",
          default: "foo",
        })
      ).toEqual("foo");
    });
    it("should keep existing form data that is equal to 0", () => {
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          {
            type: "number",
            default: 1,
          },
          0
        )
      ).toEqual(0);
    });
    it("should keep existing form data that is equal to false", () => {
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          {
            type: "boolean",
          },
          false
        )
      ).toEqual(false);
    });

    it.each([null, undefined, NaN])(
      "should overwrite existing form data that is equal to a %s",
      (noneValue) => {
        expect(
          getDefaultFormState(
            testValidator,
            defaultMerger,
            {
              type: "number",
              default: 1,
            },
            noneValue
          )
        ).toEqual(1);
      }
    );
  });
  describe("nested default", () => {
    it("should map schema object prop default to form state", () => {
      expect(
        getDefaultFormState(testValidator, defaultMerger, {
          type: "object",
          properties: {
            string: {
              type: "string",
              default: "foo",
            },
          },
        })
      ).toEqual({ string: "foo" });
    });
    it("should default to empty object if no properties are defined", () => {
      expect(
        getDefaultFormState(testValidator, defaultMerger, {
          type: "object",
        })
      ).toEqual({});
    });
    it("should recursively map schema object default to form state", () => {
      expect(
        getDefaultFormState(testValidator, defaultMerger, {
          type: "object",
          properties: {
            object: {
              type: "object",
              properties: {
                string: {
                  type: "string",
                  default: "foo",
                },
              },
            },
          },
        })
      ).toEqual({ object: { string: "foo" } });
    });
    it("should map schema array default to form state", () => {
      expect(
        getDefaultFormState(testValidator, defaultMerger, {
          type: "object",
          properties: {
            array: {
              type: "array",
              default: ["foo", "bar"],
              items: {
                type: "string",
              },
            },
          },
        })
      ).toEqual({ array: ["foo", "bar"] });
    });
    it("should recursively map schema array default to form state", () => {
      expect(
        getDefaultFormState(testValidator, defaultMerger, {
          type: "object",
          properties: {
            object: {
              type: "object",
              properties: {
                array: {
                  type: "array",
                  default: ["foo", "bar"],
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        })
      ).toEqual({ object: { array: ["foo", "bar"] } });
    });
    it("should propagate nested defaults to resulting formData by default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          object: {
            type: "object",
            properties: {
              array: {
                type: "array",
                default: ["foo", "bar"],
                items: {
                  type: "string",
                },
              },
              bool: {
                type: "boolean",
                default: true,
              },
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        object: { array: ["foo", "bar"], bool: true },
      });
    });
    it("should keep parent defaults if they don`t have a node level default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          level1: {
            type: "object",
            default: {
              level2: {
                leaf1: 1,
                leaf2: 1,
                leaf3: 1,
                leaf4: 1,
              },
            },
            properties: {
              level2: {
                type: "object",
                default: {
                  // No level2 default for leaf1
                  leaf2: 2,
                  leaf3: 2,
                },
                properties: {
                  leaf1: { type: "number" }, // No level2 default for leaf1
                  leaf2: { type: "number" }, // No level3 default for leaf2
                  leaf3: { type: "number", default: 3 },
                  leaf4: { type: "number" }, // Defined in formData.
                },
              },
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          level1: { level2: { leaf4: 4 } },
        })
      ).toEqual({
        level1: {
          level2: { leaf1: 1, leaf2: 2, leaf3: 3, leaf4: 4 },
        },
      });
    });
    it("should support nested values in formData", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { type: "object", properties: { leaf1: { type: "string" } } },
                { anyOf: [{ required: ["leaf1"] }] },
              ],
            },
            value: { leaf1: "a" },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          level1: {
            type: "object",
            properties: {
              level2: {
                oneOf: [
                  {
                    type: "object",
                    properties: {
                      leaf1: {
                        type: "string",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      };
      const formData = {
        level1: {
          level2: {
            leaf1: "a",
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, formData)
      ).toEqual({
        level1: { level2: { leaf1: "a" } },
      });
    });
    it("should use parent defaults for ArrayFields", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          level1: {
            type: "array",
            default: [1, 2, 3],
            items: { type: "number" },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        level1: [1, 2, 3],
      });
    });
    it("should use parent defaults for ArrayFields if declared in parent", () => {
      const schema: Schema = {
        type: "object",
        default: { level1: [1, 2, 3] },
        properties: {
          level1: {
            type: "array",
            items: { type: "number" },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        level1: [1, 2, 3],
      });
    });
    it("should map item defaults to fixed array default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          array: {
            type: "array",
            items: [
              {
                type: "string",
                default: "foo",
              },
              {
                type: "number",
              },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        array: ["foo", undefined],
      });
    });
    it("should merge schema array item defaults from grandparent for overlapping default definitions", () => {
      const schema: Schema = {
        type: "object",
        default: {
          level1: { level2: ["root-default-1", "root-default-2"] },
        },
        properties: {
          level1: {
            type: "object",
            properties: {
              level2: {
                type: "array",
                items: [
                  {
                    type: "string",
                    default: "child-default-1",
                  },
                  {
                    type: "string",
                  },
                ],
              },
            },
          },
        },
      };

      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        level1: { level2: ["child-default-1", "root-default-2"] },
      });
    });
    it("should overwrite schema array item defaults from parent for nested default definitions", () => {
      const schema: Schema = {
        type: "object",
        default: {
          level1: {
            level2: [{ item: "root-default-1" }, { item: "root-default-2" }],
          },
        },
        properties: {
          level1: {
            type: "object",
            default: { level2: [{ item: "parent-default-1" }, {}] },
            properties: {
              level2: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    item: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      };

      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        level1: { level2: [{ item: "parent-default-1" }, {}] },
      });
    });
    it("should merge schema array item defaults from the same item for overlapping default definitions", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          level1: {
            type: "array",
            default: ["property-default-1", "property-default-2"],
            items: [
              {
                type: "string",
                default: "child-default-1",
              },
              // this falls back to an empty item when it is missing
            ],
          },
        },
      };

      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        level1: ["child-default-1", "property-default-2"],
      });
    });
    it("should merge schema from additionalItems defaults into property default", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          level1: {
            type: "array",
            default: [
              {
                item: "property-default-1",
              },
              {},
            ],
            additionalItems: {
              type: "object",
              properties: {
                item: {
                  type: "string",
                  default: "additional-default",
                },
              },
            },
            items: [
              {
                type: "object",
                properties: {
                  item: {
                    type: "string",
                  },
                },
              },
            ],
          },
        },
      };

      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        level1: [
          { item: "property-default-1" },
          { item: "additional-default" },
        ],
      });
    });
    it("should overwrite defaults over multiple levels with arrays", () => {
      const schema: Schema = {
        type: "object",
        default: {
          level1: [
            {
              item: "root-default-1",
            },
            {
              item: "root-default-2",
            },
            {
              item: "root-default-3",
            },
            {
              item: "root-default-4",
            },
          ],
        },
        properties: {
          level1: {
            type: "array",
            default: [
              {
                item: "property-default-1",
              },
              {},
              {},
            ],
            additionalItems: {
              type: "object",
              properties: {
                item: {
                  type: "string",
                  default: "additional-default",
                },
              },
            },
            items: [
              {
                type: "object",
                properties: {
                  item: {
                    type: "string",
                  },
                },
              },
              {
                type: "object",
                properties: {
                  item: {
                    type: "string",
                    default: "child-default-2",
                  },
                },
              },
            ],
          },
        },
      };

      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        level1: [
          { item: "property-default-1" },
          { item: "child-default-2" },
          { item: "additional-default" },
        ],
      });
    });
    it("should use schema default for referenced definitions", () => {
      const schema: Schema = {
        definitions: {
          foo: {
            type: "number",
          },
          testdef: {
            type: "object",
            properties: {
              foo: {
                $ref: "#/definitions/foo",
              },
            },
          },
        },
        $ref: "#/definitions/testdef",
        default: { foo: 42 },
      };

      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          undefined,
          schema
        )
      ).toEqual({
        foo: 42,
      });
    });
    it("should populate defaults for oneOf + ref", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    fooProp: { type: "string" },
                    fooProp2: { type: "string", default: "fooProp2" },
                  },
                },
                {
                  anyOf: [
                    { required: ["fooProp"] },
                    { required: ["fooProp2"] },
                  ],
                },
              ],
            },
            value: { fooProp: "fooProp" },
            result: true,
          },
          {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    barProp: { type: "string" },
                    barProp2: { type: "string", default: "barProp2" },
                  },
                },
                {
                  anyOf: [
                    { required: ["barProp"] },
                    { required: ["barProp2"] },
                  ],
                },
              ],
            },
            value: { fooProp: "fooProp" },
            result: false,
          },
          {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    fooProp: { type: "string" },
                    fooProp2: { type: "string", default: "fooProp2" },
                  },
                },
                {
                  anyOf: [
                    { required: ["fooProp"] },
                    { required: ["fooProp2"] },
                  ],
                },
              ],
            },
            value: { barProp: "barProp" },
            result: false,
          },
          {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    barProp: { type: "string" },
                    barProp2: { type: "string", default: "barProp2" },
                  },
                },
                {
                  anyOf: [
                    { required: ["barProp"] },
                    { required: ["barProp2"] },
                  ],
                },
              ],
            },
            value: { barProp: "barProp" },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        definitions: {
          foo: {
            type: "object",
            properties: {
              fooProp: {
                type: "string",
              },
              fooProp2: {
                type: "string",
                default: "fooProp2",
              },
            },
          },
          bar: {
            type: "object",
            properties: {
              barProp: {
                type: "string",
              },
              barProp2: {
                type: "string",
                default: "barProp2",
              },
            },
          },
        },
        oneOf: [
          {
            $ref: "#/definitions/foo",
          },
          {
            $ref: "#/definitions/bar",
          },
        ],
      };
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          { fooProp: "fooProp" },
          schema
        )
      ).toEqual({
        fooProp: "fooProp",
        fooProp2: "fooProp2",
      });
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          { barProp: "barProp" },
          schema
        )
      ).toEqual({
        barProp: "barProp",
        barProp2: "barProp2",
      });
    });
    it("should fill array with additional items schema when items is empty", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          array: {
            type: "array",
            minItems: 1,
            additionalItems: {
              type: "string",
              default: "foo",
            },
            items: [],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        array: ["foo"],
      });
    });
    it("should not fill array with additional items from schema when items is empty and form data contains partial array", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          array: {
            type: "array",
            minItems: 2,
            additionalItems: {
              type: "string",
              default: "foo",
            },
            items: [],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          array: ["bar"],
        })
      ).toEqual({
        array: ["bar"],
      });
    });
    it("should fill defaults in existing array items", () => {
      const schema: Schema = {
        type: "array",
        minItems: 2,
        items: {
          type: "object",
          properties: {
            item: {
              type: "string",
              default: "foo",
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, [{}])
      ).toEqual([{ item: "foo" }]);
    });
    it("defaults passed along for multiselect arrays when minItems is present", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          array: {
            type: "array",
            minItems: 1,
            uniqueItems: true,
            default: ["foo", "qux"],
            items: {
              type: "string",
              enum: ["foo", "bar", "fuzz", "qux"],
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        array: ["foo", "qux"],
      });
    });
    it("returns empty defaults when no item defaults are defined", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          array: {
            type: "array",
            minItems: 1,
            uniqueItems: true,
            items: {
              type: "string",
              enum: ["foo", "bar", "fuzz", "qux"],
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        array: [],
      });
    });
    it("returns explicit defaults along with auto-fill when provided", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          turtles: {
            type: "array",
            minItems: 4,
            default: ["Raphael", "Michaelangelo"],
            items: {
              type: "string",
              default: "Unknown",
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        turtles: ["Raphael", "Michaelangelo", "Unknown", "Unknown"],
      });
    });
  });
  describe("defaults with allOf", () => {
    it("should populate root defaults for allOf", () => {
      const schema: Schema = {
        allOf: [
          {
            properties: {
              first: {
                title: "First",
                type: "string",
              },
            },
          },
          {
            properties: {
              second: {
                title: "Second",
                type: "string",
              },
            },
          },
        ],
        default: {
          second: "Second 2!",
        },
        type: "object",
      };

      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        second: "Second 2!",
      });
    });

    const schema: Schema = {
      title: "Example",
      type: "object",
      properties: {
        animalInfo: {
          properties: {
            animal: {
              type: "string",
              default: "Cat",
              enum: ["Cat", "Fish"],
            },
          },
          allOf: [
            {
              if: {
                properties: {
                  animal: {
                    const: "Cat",
                  },
                },
              },
              then: {
                properties: {
                  food: {
                    type: "string",
                    default: "meat",
                    enum: ["meat", "grass", "fish"],
                  },
                },
                required: ["food"],
              },
            },
          ],
        },
      },
    };

    describe('default form state behaviour: allOf = "populateDefaults"', () => {
      it("should populate default values correctly", () => {
        testValidator = createValidator({
          cases: [
            {
              schema: { properties: { animal: { const: "Cat" } } },
              value: {},
              result: true,
            },
          ],
        });
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            experimental_defaultFormStateBehavior: {
              allOf: "populateDefaults",
            },
          })
        ).toEqual({ animalInfo: { animal: "Cat", food: "meat" } });
      });
    });

    describe('default form state behaviour: allOf = "skipDefaults"', () => {
      it("should populate default values correctly", () => {
        expect(
          computeDefaults(testValidator, defaultMerger, schema, {
            ...defaults,
            rootSchema: schema,
            experimental_defaultFormStateBehavior: { allOf: "skipDefaults" },
          })
        ).toEqual({ animalInfo: { animal: "Cat" } });
      });
    });
  });
  describe("defaults with oneOf", () => {
    it("should not populate defaults for empty oneOf", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "string",
            oneOf: [],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({});
    });
    it("should populate defaults for oneOf", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "string",
            oneOf: [
              { type: "string", default: "a" },
              { type: "string", default: "b" },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        name: "a",
      });
    });
    it("should populate root defaults for oneOf", () => {
      const schema: Schema = {
        oneOf: [
          {
            properties: {
              first: {
                title: "First",
                type: "string",
              },
            },
          },
          {
            properties: {
              second: {
                title: "Second",
                type: "string",
              },
            },
          },
        ],
        default: {
          second: "Second 2!",
        },
        type: "object",
      };

      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { properties: { first: { title: "First", type: "string" } } },
                { anyOf: [{ required: ["first"] }] },
              ],
            },
            value: { second: "Second 2!" },
            result: false,
          },
          {
            schema: {
              allOf: [
                { properties: { second: { title: "Second", type: "string" } } },
                { anyOf: [{ required: ["second"] }] },
              ],
            },
            value: { second: "Second 2!" },
            result: true,
          },
        ],
      });

      expect(getDefaultFormState(testValidator, defaultMerger, schema)).toEqual(
        {
          second: "Second 2!",
        }
      );
    });
    it("should populate defaults for oneOf when `type`: `object` is missing", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { properties: { name: { type: "string", default: "a" } } },
                { anyOf: [{ required: ["name"] }] },
              ],
            },
            value: {},
            result: false,
          },
          {
            schema: {
              allOf: [
                { properties: { id: { type: "number", default: 13 } } },
                { anyOf: [{ required: ["id"] }] },
              ],
            },
            value: {},
            result: false,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        oneOf: [
          {
            properties: { name: { type: "string", default: "a" } },
          },
          {
            properties: { id: { type: "number", default: 13 } },
          },
        ],
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        name: "a",
      });
    });
    it("should populate nested default values for oneOf", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "object",
            oneOf: [
              {
                type: "object",
                properties: {
                  first: { type: "string", default: "First Name" },
                },
              },
              { type: "string", default: "b" },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        name: {
          first: "First Name",
        },
      });
    });
    it("should not populate nested default values for oneOf, when not required", () => {
      const schema: Schema = {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "object",
            oneOf: [
              {
                type: "object",
                properties: {
                  first: { type: "string", default: "First Name" },
                },
              },
              { type: "string", default: "b" },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          {},
          undefined,
          undefined,
          {
            emptyObjectFields: "populateRequiredDefaults",
          }
        )
      ).toEqual({ name: {} });
    });
    it("should populate nested default values for oneOf, when required is merged in", () => {
      const schema: Schema = {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "object",
            required: ["first"],
            oneOf: [
              {
                type: "object",
                properties: {
                  first: { type: "string", default: "First Name" },
                },
              },
              {
                type: "object",
                properties: {
                  first: { type: "string", default: "1st Name" },
                },
              },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          {},
          undefined,
          undefined,
          {
            emptyObjectFields: "populateRequiredDefaults",
          }
        )
      ).toEqual({
        name: {
          first: "First Name",
        },
      });
    });
    it("should populate nested default values merging required fields", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                {
                  properties: {
                    bar: { type: "number" },
                    baz: { default: "bazIsRequired" },
                  },
                },
                { anyOf: [{ required: ["bar"] }, { required: ["baz"] }] },
              ],
            },
            value: {},
            result: false,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        required: ["foo", "bar"],
        properties: {
          foo: {
            type: "string",
            default: "fooVal",
          },
        },
        oneOf: [
          {
            properties: {
              bar: {
                type: "number",
              },
              baz: {
                default: "bazIsRequired",
              },
            },
            required: ["baz"],
          },
        ],
      };
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          {},
          undefined,
          undefined,
          {
            emptyObjectFields: "populateRequiredDefaults",
          }
        )
      ).toEqual({ foo: "fooVal", baz: "bazIsRequired" });
    });
    it("should populate defaults for oneOf + dependencies", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { type: "object", properties: { name: { type: "string" } } },
                { anyOf: [{ required: ["name"] }] },
              ],
            },
            value: { name: "Name" },
            result: true,
          },
          {
            schema: {
              type: "object",
              properties: { name: { type: "string" } },
            },
            value: { name: "Name" },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        oneOf: [
          {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        ],
        dependencies: {
          name: {
            oneOf: [
              {
                properties: {
                  name: {
                    type: "string",
                  },
                  grade: {
                    default: "A",
                  },
                },
              },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          name: "Name",
        })
      ).toEqual({
        name: "Name",
        grade: "A",
      });
    });
    it("should populate defaults for oneOf second option", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          test: {
            oneOf: [
              { properties: { a: { type: "string", default: "a" } } },
              { properties: { b: { type: "string", default: "b" } } },
            ],
          },
        },
      };
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { properties: { a: { type: "string", default: "a" } } },
                { anyOf: [{ required: ["a"] }] },
              ],
            },
            value: { b: "b" },
            result: false,
          },
          {
            schema: {
              allOf: [
                { properties: { b: { type: "string", default: "b" } } },
                { anyOf: [{ required: ["b"] }] },
              ],
            },
            value: { b: "b" },
            result: true,
          },
        ],
      });
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          test: { b: "b" },
        })
      ).toEqual({
        test: { b: "b" },
      });
    });
  });
  describe("defaults with anyOf", () => {
    it("should not populate defaults for empty oneOf", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "string",
            anyOf: [],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({});
    });
    it("should populate defaults for anyOf", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "string",
            anyOf: [
              { type: "string", default: "a" },
              { type: "string", default: "b" },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        name: "a",
      });
    });
    it("should populate root defaults for anyOf", () => {
      const schema: Schema = {
        anyOf: [
          {
            properties: {
              first: {
                title: "First",
                type: "string",
              },
            },
          },
          {
            properties: {
              second: {
                title: "Second",
                type: "string",
              },
            },
          },
        ],
        default: {
          second: "Second 2!",
        },
        type: "object",
      };

      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { properties: { first: { title: "First", type: "string" } } },
                { anyOf: [{ required: ["first"] }] },
              ],
            },
            value: { second: "Second 2!" },
            result: false,
          },
          {
            schema: {
              allOf: [
                { properties: { second: { title: "Second", type: "string" } } },
                { anyOf: [{ required: ["second"] }] },
              ],
            },
            value: { second: "Second 2!" },
            result: true,
          },
        ],
      });

      expect(getDefaultFormState(testValidator, defaultMerger, schema)).toEqual(
        {
          second: "Second 2!",
        }
      );
    });
    it("should populate nested default values for anyOf", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "object",
            anyOf: [
              {
                type: "object",
                properties: {
                  first: { type: "string", default: "First Name" },
                },
              },
              { type: "string", default: "b" },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {})
      ).toEqual({
        name: {
          first: "First Name",
        },
      });
    });
    it("should not populate nested default values for anyOf, when not required", () => {
      const schema: Schema = {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "object",
            anyOf: [
              {
                type: "object",
                properties: {
                  first: { type: "string", default: "First Name" },
                },
              },
              { type: "string", default: "b" },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          {},
          undefined,
          undefined,
          {
            emptyObjectFields: "populateRequiredDefaults",
          }
        )
      ).toEqual({ name: {} });
    });
    it("should populate nested default values for anyOf, when required is merged in", () => {
      const schema: Schema = {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "object",
            required: ["first"],
            anyOf: [
              {
                type: "object",
                properties: {
                  first: { type: "string", default: "First Name" },
                },
              },
              {
                type: "object",
                properties: {
                  first: { type: "string", default: "1st Name" },
                },
              },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          {},
          undefined,
          undefined,
          {
            emptyObjectFields: "populateRequiredDefaults",
          }
        )
      ).toEqual({
        name: {
          first: "First Name",
        },
      });
    });
    it("should populate nested default values merging required fields", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                {
                  properties: {
                    bar: { type: "number" },
                    baz: { default: "bazIsRequired" },
                  },
                },
                { anyOf: [{ required: ["bar"] }, { required: ["baz"] }] },
              ],
            },
            value: {},
            result: false,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        required: ["foo", "bar"],
        properties: {
          foo: {
            type: "string",
            default: "fooVal",
          },
        },
        anyOf: [
          {
            properties: {
              bar: {
                type: "number",
              },
              baz: {
                default: "bazIsRequired",
              },
            },
            required: ["baz"],
          },
        ],
      };
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          {},
          undefined,
          undefined,
          {
            emptyObjectFields: "populateRequiredDefaults",
          }
        )
      ).toEqual({ foo: "fooVal", baz: "bazIsRequired" });
    });
    it("should populate defaults for anyOf + dependencies", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { type: "object", properties: { name: { type: "string" } } },
                { anyOf: [{ required: ["name"] }] },
              ],
            },
            value: { name: "Name" },
            result: true,
          },
          {
            schema: {
              type: "object",
              properties: { name: { type: "string" } },
            },
            value: { name: "Name" },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        anyOf: [
          {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        ],
        dependencies: {
          name: {
            oneOf: [
              {
                properties: {
                  name: {
                    type: "string",
                  },
                  grade: {
                    type: "string",
                    default: "A",
                  },
                },
              },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          name: "Name",
        })
      ).toEqual({
        name: "Name",
        grade: "A",
      });
    });
    it("should populate defaults for anyOf second option", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          test: {
            anyOf: [
              { properties: { a: { type: "string", default: "a" } } },
              { properties: { b: { type: "string", default: "b" } } },
            ],
          },
        },
      };
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { properties: { a: { type: "string", default: "a" } } },
                { anyOf: [{ required: ["a"] }] },
              ],
            },
            value: { b: "b" },
            result: false,
          },
          {
            schema: {
              allOf: [
                { properties: { b: { type: "string", default: "b" } } },
                { anyOf: [{ required: ["b"] }] },
              ],
            },
            value: { b: "b" },
            result: true,
          },
        ],
      });
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          test: { b: "b" },
        })
      ).toEqual({
        test: { b: "b" },
      });
    });
  });
  describe("with dependencies", () => {
    it("should populate defaults for dependencies", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              type: "object",
              properties: { name: { type: "string" } },
            },
            value: { name: "Name" },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
        dependencies: {
          name: {
            oneOf: [
              {
                properties: {
                  name: {
                    type: "string",
                  },
                  grade: {
                    type: "string",
                    default: "A",
                  },
                },
              },
            ],
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          name: "Name",
        })
      ).toEqual({
        name: "Name",
        grade: "A",
      });
    });
    it("should populate defaults for nested dependencies", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              type: "object",
              properties: { name: { type: "string" } },
            },
            value: { name: "Name" },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          foo: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
            dependencies: {
              name: {
                oneOf: [
                  {
                    properties: {
                      name: {
                        type: "string",
                      },
                      grade: {
                        type: "string",
                        default: "A",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          foo: { name: "Name" },
        })
      ).toEqual({
        foo: {
          name: "Name",
          grade: "A",
        },
      });
    });
    it("should populate defaults for nested dependencies in arrays", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              type: "object",
              properties: { name: { type: "string" } },
            },
            value: { name: "Name" },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        type: "array",
        items: {
          properties: {
            foo: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
              },
              dependencies: {
                name: {
                  oneOf: [
                    {
                      properties: {
                        name: {
                          type: "string",
                        },
                        grade: {
                          type: "string",
                          default: "A",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, [
          { foo: { name: "Name" } },
        ])
      ).toEqual([
        {
          foo: {
            name: "Name",
            grade: "A",
          },
        },
      ]);
    });
    it("should populate defaults for nested dependencies in arrays when matching enum values in oneOf", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              type: "object",
              properties: { name: { enum: ["first"] } },
            },
            value: { name: "first" },
            result: true,
          },
          {
            schema: {
              type: "object",
              properties: { name: { enum: ["second"] } },
            },
            value: { name: "first" },
            result: false,
          },
          {
            schema: {
              type: "object",
              properties: { name: { enum: ["first"] } },
            },
            value: { name: "second" },
            result: false,
          },
          {
            schema: {
              type: "object",
              properties: { name: { enum: ["second"] } },
            },
            value: { name: "second" },
            result: true,
          },
          {
            schema: {
              type: "object",
              properties: { name: { enum: ["first"] } },
            },
            value: { name: "third" },
            result: false,
          },
          {
            schema: {
              type: "object",
              properties: { name: { enum: ["second"] } },
            },
            value: { name: "third" },
            result: false,
          },
        ],
      });
      const schema: Schema = {
        type: "array",
        items: {
          properties: {
            foo: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
              },
              dependencies: {
                name: {
                  oneOf: [
                    {
                      properties: {
                        name: {
                          enum: ["first"],
                        },
                        grade: {
                          type: "string",
                          default: "A",
                        },
                      },
                    },
                    {
                      properties: {
                        name: {
                          enum: ["second"],
                        },
                        grade: {
                          type: "string",
                          default: "B",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, [
          { foo: { name: "first" } },
          { foo: { name: "second" } },
          { foo: { name: "third" } },
        ])
      ).toEqual([
        {
          foo: {
            name: "first",
            grade: "A",
          },
        },
        {
          foo: {
            name: "second",
            grade: "B",
          },
        },
        {
          foo: {
            name: "third",
          },
        },
      ]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "ignoring oneOf in dependencies because there isn't exactly one subschema that is valid"
      );
    });
    it("should populate defaults for nested oneOf + dependencies", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              allOf: [
                { type: "object", properties: { name: { type: "string" } } },
                { anyOf: [{ required: ["name"] }] },
              ],
            },
            value: { name: "Name" },
            result: true,
          },
          {
            schema: {
              type: "object",
              properties: { name: { type: "string" } },
            },
            value: { name: "Name" },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          foo: {
            oneOf: [
              {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                },
              },
            ],
            dependencies: {
              name: {
                oneOf: [
                  {
                    properties: {
                      name: {
                        type: "string",
                      },
                      grade: {
                        type: "string",
                        default: "A",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          foo: { name: "Name" },
        })
      ).toEqual({
        foo: {
          name: "Name",
          grade: "A",
        },
      });
    });
    it("should populate defaults for properties to ensure the dependencies conditions are resolved based on it", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: { const: "username", title: "Username and password" },
            value: "username",
            result: true,
          },
          {
            schema: { const: "secret", title: "SSO" },
            value: "username",
            result: false,
          },
          {
            schema: { properties: { credentialType: { const: "username" } } },
            value: { credentialType: "username" },
            result: true,
          },
          {
            schema: { properties: { credentialType: { const: "secret" } } },
            value: { credentialType: "username" },
            result: false,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        required: ["authentication"],
        properties: {
          authentication: {
            title: "Authentication",
            type: "object",
            properties: {
              credentialType: {
                title: "Credential type",
                type: "string",
                default: "username",
                oneOf: [
                  {
                    const: "username",
                    title: "Username and password",
                  },
                  {
                    const: "secret",
                    title: "SSO",
                  },
                ],
              },
            },
            dependencies: {
              credentialType: {
                allOf: [
                  {
                    if: {
                      properties: {
                        credentialType: {
                          const: "username",
                        },
                      },
                    },
                    then: {
                      properties: {
                        usernameAndPassword: {
                          type: "object",
                          properties: {
                            username: {
                              type: "string",
                              title: "Username",
                            },
                            password: {
                              type: "string",
                              title: "Password",
                            },
                          },
                          required: ["username", "password"],
                        },
                      },
                      required: ["usernameAndPassword"],
                    },
                  },
                  {
                    if: {
                      properties: {
                        credentialType: {
                          const: "secret",
                        },
                      },
                    },
                    then: {
                      properties: {
                        sso: {
                          type: "string",
                          title: "SSO",
                        },
                      },
                      required: ["sso"],
                    },
                  },
                ],
              },
            },
          },
        },
      };
      expect(getDefaultFormState(testValidator, defaultMerger, schema)).toEqual(
        {
          authentication: {
            credentialType: "username",
            usernameAndPassword: {},
          },
        }
      );
    });
    it("should populate defaults for nested dependencies when formData passed to computeDefaults is undefined", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              type: "object",
              properties: { bit_rate_cfg_mode: { enum: [0] } },
            },
            value: { bit_rate_cfg_mode: 0 },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          can_1: {
            type: "object",
            properties: {
              phy: {
                title: "Physical",
                description: "XYZ",
                type: "object",
                properties: {
                  bit_rate_cfg_mode: {
                    title: "Sub title",
                    description: "XYZ",
                    type: "integer",
                    default: 0,
                  },
                },
                dependencies: {
                  bit_rate_cfg_mode: {
                    oneOf: [
                      {
                        properties: {
                          bit_rate_cfg_mode: {
                            enum: [0],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, undefined)
      ).toEqual({
        can_1: {
          phy: {
            bit_rate_cfg_mode: 0,
          },
        },
      });
    });
    it("should not crash for defaults for nested dependencies when formData passed to computeDefaults is null", () => {
      testValidator = createValidator({
        cases: [
          {
            schema: {
              type: "object",
              properties: { bit_rate_cfg_mode: { enum: [0] } },
            },
            value: { bit_rate_cfg_mode: 0 },
            result: true,
          },
        ],
      });
      const schema: Schema = {
        type: "object",
        properties: {
          can_1: {
            type: "object",
            properties: {
              phy: {
                title: "Physical",
                description: "XYZ",
                type: "object",
                properties: {
                  bit_rate_cfg_mode: {
                    title: "Sub title",
                    description: "XYZ",
                    type: "integer",
                    default: 0,
                  },
                },
                dependencies: {
                  bit_rate_cfg_mode: {
                    oneOf: [
                      {
                        properties: {
                          bit_rate_cfg_mode: {
                            enum: [0],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, {
          can_1: { phy: null },
        })
      ).toEqual({
        can_1: {
          phy: null,
        },
      });
    });
  });
  describe("with schema keys not defined in the formData", () => {
    it("shouldn`t add in undefined keys to formData", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          foo: { type: "string" },
          bar: { type: "string" },
        },
      };
      const formData = {
        foo: "foo",
        baz: "baz",
      };
      const result = {
        foo: "foo",
        baz: "baz",
      };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, formData)
      ).toEqual(result);
    });
  });
  describe("object with defaults and undefined in formData, testing mergeDefaultsIntoFormData", () => {
    let schema: Schema;
    let defaultedFormData: any;
    beforeAll(() => {
      schema = {
        type: "object",
        properties: {
          field: {
            type: "string",
            default: "foo",
          },
        },
        required: ["field"],
      };
      defaultedFormData = { field: "foo" };
    });
    it("returns field value of default when formData is empty", () => {
      const formData = {};
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, formData)
      ).toEqual(defaultedFormData);
    });
    it("returns field value of undefined when formData has undefined for field", () => {
      const formData = { field: undefined };
      expect(
        getDefaultFormState(testValidator, defaultMerger, schema, formData)
      ).toEqual(formData);
    });
    it("returns field value of default when formData has undefined for field and `useDefaultIfFormDataUndefined`", () => {
      const formData = { field: undefined };
      expect(
        getDefaultFormState(
          testValidator,
          defaultMerger,
          schema,
          formData,
          undefined,
          undefined,
          {
            mergeDefaultsIntoFormData: "useDefaultIfFormDataUndefined",
          }
        )
      ).toEqual(defaultedFormData);
    });
  });
  it("should return undefined defaults for a required array property with minItems", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        requiredArray: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
        },
      },
    };
    expect(
      getDefaultFormState(
        testValidator,
        defaultMerger,
        schema,
        undefined,
        schema,
        false
      )
    ).toEqual({
      requiredArray: [undefined, undefined],
    });
  });
  it("should not combine defaults with raw form data for a required array property with minItems", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        requiredArray: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
        },
      },
    };
    expect(
      getDefaultFormState(
        testValidator,
        defaultMerger,
        schema,
        { requiredArray: ["raw0"] },
        schema,
        false
      )
    ).toEqual({
      requiredArray: ["raw0"],
    });
  });
  it("should combine ALL defaults with raw form data for a array property with minItems", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        requiredArray: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
        },
      },
    };
    expect(
      getDefaultFormState(
        testValidator,
        defaultMerger,
        schema,
        { requiredArray: ["raw0"] },
        schema,
        false,
        {
          arrayMinItems: { mergeExtraDefaults: true },
        }
      )
    ).toEqual({
      requiredArray: ["raw0", undefined],
    });
  });
  it("should return given defaults for a required array property with minItems", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        requiredArray: {
          type: "array",
          items: { type: "string", default: "default0" },
          minItems: 2,
        },
      },
      required: ["requiredArray"],
    };
    expect(
      getDefaultFormState(
        testValidator,
        defaultMerger,
        schema,
        undefined,
        schema,
        false,
        {
          arrayMinItems: { populate: "requiredOnly" },
        }
      )
    ).toEqual({ requiredArray: ["default0", "default0"] });
  });
  it("should not combine defaults with raw form data for a required array property with minItems", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        requiredArray: {
          type: "array",
          items: { type: "string", default: "default0" },
          minItems: 2,
        },
      },
      required: ["requiredArray"],
    };
    expect(
      getDefaultFormState(
        testValidator,
        defaultMerger,
        schema,
        { requiredArray: ["raw0"] },
        schema,
        false,
        {
          arrayMinItems: { populate: "requiredOnly" },
        }
      )
    ).toEqual({ requiredArray: ["raw0"] });
  });
  it("should combine ALL defaults with raw form data for a required array property with minItems", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        requiredArray: {
          type: "array",
          items: { type: "string", default: "default0" },
          minItems: 2,
        },
      },
      required: ["requiredArray"],
    };
    expect(
      getDefaultFormState(
        testValidator,
        defaultMerger,
        schema,
        { requiredArray: ["raw0"] },
        schema,
        false,
        {
          arrayMinItems: { populate: "requiredOnly", mergeExtraDefaults: true },
        }
      )
    ).toEqual({ requiredArray: ["raw0", "default0"] });
  });
  it("should not populate defaults for array items when computeSkipPopulate returns true", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        stringArray: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
        },
        numberArray: {
          type: "array",
          items: { type: "number" },
          minItems: 1,
        },
      },
      required: ["stringArray", "numberArray"],
    };
    expect(
      getDefaultFormState(
        testValidator,
        defaultMerger,
        schema,
        {},
        schema,
        false,
        {
          arrayMinItems: {
            computeSkipPopulate: (_, schema) =>
              !Array.isArray(schema?.items) &&
              typeof schema?.items !== "boolean" &&
              schema?.items?.type === "number",
          },
        }
      )
    ).toEqual({ stringArray: [undefined], numberArray: [] });
  });
});
