// This file was copied and modified from https://github.com/mokkabonna/json-schema-merge-allof/blob/1cc2aa53a5d33c17d0e9c59b13eed77d86ad91c3/test/specs/index.spec.js
// MIT © Martin Hansen
// Modifications made by Roman Krasilnikov.

import { Ajv } from "ajv";
import type { JSONSchema7Definition } from "json-schema";
import { describe, expect, it } from "vitest";

import { createDeduplicator, createIntersector } from "@/lib/array.js";
import { createComparator } from "@/lib/json-schema-compare/index.js";

import { createMerger } from "./json-schema-merge.js";
import { createAllOfMerger } from "./all-of-merge.js";

const testPatternsMerger = (a: string, b: string) =>
  a === b ? a : `(?=${a})(?=${b})`;

const { compareSchemaValues, compareSchemaDefinitions } = createComparator();

const { mergeArrayOfSchemaDefinitions } = createMerger({
  mergePatterns: testPatternsMerger,
  intersectJson: createIntersector(compareSchemaValues),
  deduplicateJsonSchemaDef: createDeduplicator(compareSchemaDefinitions),
});

const { mergeAllOf } = createAllOfMerger(mergeArrayOfSchemaDefinitions);

const ajv = new Ajv();

function merger(schema: JSONSchema7Definition) {
  const result = mergeAllOf(schema);
  try {
    if (!ajv.validateSchema(result)) {
      throw new Error("Schema returned by resolver isn't valid.");
    }
    return result;
  } catch (e) {
    if (e instanceof Error && !/stack/i.test(e.message)) {
      throw e;
    }
  }
}

describe("basic", () => {
  // CHANGED: We don't support `deep` merge right now
  it("merges schema with same object reference multiple places", () => {
    const commonSchema = {
      allOf: [
        {
          properties: {
            test: true,
          },
        },
      ],
    };
    const result = merger({
      allOf: [commonSchema, commonSchema],
    });

    expect(result).toEqual({
      properties: {
        test: true,
      },
    });
  });

  it("does not alter original schema", () => {
    const schema = {
      allOf: [
        {
          properties: {
            test: true,
          },
        },
      ],
    };

    const result = merger(schema);

    expect(result).toEqual({
      properties: {
        test: true,
      },
    });

    expect(result).not.toBe(schema);
    expect(schema).toEqual({
      allOf: [
        {
          properties: {
            test: true,
          },
        },
      ],
    });
  });

  it("combines simple usecase", () => {
    const result = merger({
      allOf: [
        {
          type: "string",
          minLength: 1,
        },
        {
          type: "string",
          maxLength: 5,
        },
      ],
    });

    expect(result).toEqual({
      type: "string",
      minLength: 1,
      maxLength: 5,
    });
  });

  it("combines without allOf", () => {
    const result = merger({
      properties: {
        foo: {
          type: "string",
        },
      },
    });

    expect(result).toEqual({
      properties: {
        foo: {
          type: "string",
        },
      },
    });
  });

  describe("simple resolve functionality", () => {
    // CHANGED: We use `last` strategy for `title` merging
    it("merges with default resolver if not defined resolver", () => {
      const result = merger({
        title: "schema1",
        allOf: [
          {
            title: "schema2",
          },
          {
            title: "schema3",
          },
        ],
      });

      expect(result).toEqual({
        title: "schema3",
      });

      const result3 = merger({
        allOf: [
          {
            title: "schema2",
          },
          {
            title: "schema3",
          },
        ],
      });

      expect(result3).toEqual({
        title: "schema3",
      });
    });

    it("merges minLength if conflict", () => {
      const result = merger({
        allOf: [
          {
            minLength: 1,
          },
          {
            minLength: 5,
          },
        ],
      });

      expect(result).toEqual({
        minLength: 5,
      });
    });

    it("merges minimum if conflict", () => {
      const result = merger({
        allOf: [
          {
            minimum: 1,
          },
          {
            minimum: 5,
          },
        ],
      });

      expect(result).toEqual({
        minimum: 5,
      });
    });

    it("merges exclusiveMinimum if conflict", () => {
      const result = merger({
        allOf: [
          {
            exclusiveMinimum: 1,
          },
          {
            exclusiveMinimum: 5,
          },
        ],
      });

      expect(result).toEqual({
        exclusiveMinimum: 5,
      });
    });

    it("merges minItems if conflict", () => {
      const result = merger({
        allOf: [
          {
            minItems: 1,
          },
          {
            minItems: 5,
          },
        ],
      });

      expect(result).toEqual({
        minItems: 5,
      });
    });

    it("merges maximum if conflict", () => {
      const result = merger({
        allOf: [
          {
            maximum: 1,
          },
          {
            maximum: 5,
          },
        ],
      });

      expect(result).toEqual({
        maximum: 1,
      });
    });

    it("merges exclusiveMaximum if conflict", () => {
      const result = merger({
        allOf: [
          {
            exclusiveMaximum: 1,
          },
          {
            exclusiveMaximum: 5,
          },
        ],
      });

      expect(result).toEqual({
        exclusiveMaximum: 1,
      });
    });

    it("merges maxItems if conflict", () => {
      const result = merger({
        allOf: [
          {
            maxItems: 1,
          },
          {
            maxItems: 5,
          },
        ],
      });

      expect(result).toEqual({
        maxItems: 1,
      });
    });

    it("merges maxLength if conflict", () => {
      const result = merger({
        allOf: [
          {
            maxLength: 4,
          },
          {
            maxLength: 5,
          },
        ],
      });

      expect(result).toEqual({
        maxLength: 4,
      });
    });

    it("merges uniqueItems to most restrictive if conflict", () => {
      const result = merger({
        allOf: [
          {
            uniqueItems: true,
          },
          {
            uniqueItems: false,
          },
        ],
      });

      expect(result).toEqual({
        uniqueItems: true,
      });

      expect(
        merger({
          allOf: [
            {
              uniqueItems: false,
            },
            {
              uniqueItems: false,
            },
          ],
        })
      ).toEqual({
        uniqueItems: false,
      });
    });

    it("throws if merging incompatible type", () => {
      expect(() => {
        merger({
          allOf: [
            {
              type: "null",
            },
            {
              type: "number",
            },
          ],
        });
      }).to.throw(/incompatible/);
    });

    it("merges type if conflict", () => {
      const result = merger({
        allOf: [
          {},
          {
            type: ["string", "null", "object", "array"],
          },
          {
            type: ["string", "null"],
          },
          {
            type: ["null", "string"],
          },
        ],
      });

      expect(result).toEqual({
        type: ["string", "null"],
      });

      const result2 = merger({
        allOf: [
          {},
          {
            type: ["string", "null", "object", "array"],
          },
          {
            type: "string",
          },
          {
            type: ["null", "string"],
          },
        ],
      });

      expect(result2).toEqual({
        type: "string",
      });

      expect(() => {
        merger({
          allOf: [
            {
              type: ["null"],
            },
            {
              type: ["string", "object"],
            },
          ],
        });
      }).to.throw(/incompatible/);
    });

    // CHANGED: We use different sorting algorithm
    it("merges enum", () => {
      const result = merger({
        allOf: [
          {},
          {
            enum: ["string", "null", "object", {}, [2], [1], null],
          },
          {
            enum: ["string", {}, [1], [1]],
          },
          {
            enum: ["null", "string", {}, [3], [1], null],
          },
        ],
      });

      expect(result).toEqual({
        enum: ["string", {}, [1]],
      });
    });

    // CHANGED: we use different error text
    it("throws if enum is incompatible", () => {
      expect(() => {
        merger({
          allOf: [
            {},
            {
              enum: ["string", {}],
            },
            {
              enum: [{}, "string"],
            },
          ],
        });
      }).not.to.throw(/empty/);

      expect(() => {
        merger({
          allOf: [
            {},
            {
              enum: ["string", {}],
            },
            {
              enum: [[], false],
            },
          ],
        });
      }).to.throw(/empty/);
    });

    it("merges const", () => {
      const result = merger({
        allOf: [
          {},
          {
            const: ["string", {}],
          },
          {
            const: ["string", {}],
          },
        ],
      });

      expect(result).toEqual({
        const: ["string", {}],
      });
    });

    it("merges anyOf", () => {
      const result = merger({
        allOf: [
          {
            anyOf: [
              {
                required: ["123"],
              },
            ],
          },
          {
            anyOf: [
              {
                required: ["123"],
              },
              {
                required: ["456"],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        anyOf: [
          {
            required: ["123"],
          },
          {
            required: ["123", "456"],
          },
        ],
      });
    });

    // CHANGED: we use different sorting algorithm
    it("merges anyOf by finding valid combinations", () => {
      const result = merger({
        allOf: [
          {
            anyOf: [
              {
                type: ["null", "string", "array"],
              },
              {
                type: ["null", "string", "object"],
              },
            ],
          },
          {
            anyOf: [
              {
                type: ["null", "string"],
              },
              {
                type: ["integer", "object", "null"],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        anyOf: [
          {
            type: ["null", "string"],
          },
          {
            type: "null",
          },
          {
            type: ["null", "object"],
          },
        ],
      });
    });

    it.skip("extracts common logic", () => {
      const result = merger({
        allOf: [
          {
            anyOf: [
              {
                type: ["null", "string", "array"],
                minLength: 5,
              },
              {
                type: ["null", "string", "object"],
                minLength: 5,
              },
            ],
          },
          {
            anyOf: [
              {
                type: ["null", "string"],
                minLength: 5,
              },
              {
                type: ["integer", "object", "null"],
              },
            ],
          },
        ],
      });

      // TODO I think this is correct
      // TODO implement functionality
      expect(result).toEqual({
        type: "null",
        minLength: 5,
        anyOf: [
          {
            type: "string",
          },
        ],
      });
    });

    it.skip("merges anyOf into main schema if left with only one combination", () => {
      const result = merger({
        required: ["abc"],
        allOf: [
          {
            anyOf: [
              {
                required: ["123"],
              },
              {
                required: ["456"],
              },
            ],
          },
          {
            anyOf: [
              {
                required: ["123"],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        required: ["abc", "123"],
      });
    });

    it.skip("merges nested allOf if inside singular anyOf", () => {
      const result = merger({
        allOf: [
          {
            anyOf: [
              {
                required: ["123"],
                allOf: [
                  {
                    required: ["768"],
                  },
                ],
              },
            ],
          },
          {
            anyOf: [
              {
                required: ["123"],
              },
              {
                required: ["456"],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        anyOf: [
          {
            required: ["123", "768"],
          },
          {
            required: ["123", "456", "768"],
          },
        ],
      });
    });

    it("throws if no intersection at all", () => {
      expect(() => {
        merger({
          allOf: [
            {
              anyOf: [
                {
                  type: ["object", "string", "null"],
                },
              ],
            },
            {
              anyOf: [
                {
                  type: ["array", "integer"],
                },
              ],
            },
          ],
        });
      }).to.throw(/incompatible/);

      expect(() => {
        merger({
          allOf: [
            {
              anyOf: [
                {
                  type: ["object", "string", "null"],
                },
              ],
            },
            {
              anyOf: [
                {
                  type: ["array", "integer"],
                },
              ],
            },
          ],
        });
      }).to.throw(/incompatible/);
    });

    it("merges more complex oneOf", () => {
      const result = merger({
        allOf: [
          {
            oneOf: [
              {
                type: ["array", "string", "object"],
                required: ["123"],
              },
              {
                required: ["abc"],
              },
            ],
          },
          {
            oneOf: [
              {
                type: ["string"],
              },
              {
                type: ["object", "array"],
                required: ["abc"],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        oneOf: [
          {
            type: "string",
            required: ["123"],
          },
          {
            type: ["array", "object"],
            required: ["123", "abc"],
          },
          {
            type: ["string"],
            required: ["abc"],
          },
          {
            type: ["object", "array"],
            required: ["abc"],
          },
        ],
      });
    });

    // CHANGED: we don't support `deep` merge right now
    it("merges nested allOf if inside singular oneOf", () => {
      const result = merger({
        allOf: [
          {
            type: ["array", "string", "number"],
            oneOf: [
              mergeAllOf({
                required: ["123"],
                allOf: [
                  {
                    required: ["768"],
                  },
                ],
              }),
            ],
          },
          {
            type: ["array", "string"],
          },
        ],
      });

      expect(result).toEqual({
        type: ["array", "string"],
        oneOf: [
          {
            required: ["123", "768"],
          },
        ],
      });
    });

    // CHANGED: i don't see how `array` and `object` types
    // in the first schema can be compatible
    it("merges nested allOf if inside multiple oneOf", () => {
      expect(() => {
        merger({
          allOf: [
            {
              type: ["array", "string", "number"],
              oneOf: [
                mergeAllOf({
                  type: ["array", "object"],
                  allOf: [
                    {
                      type: "object",
                    },
                  ],
                }),
              ],
            },
            {
              type: ["array", "string"],
              oneOf: [
                {
                  type: "string",
                },
                {
                  type: "object",
                },
              ],
            },
          ],
        });
      }).toThrow(/incompatible/);

      // expect(result).toEqual({
      //   type: ["array", "string"],
      //   oneOf: [
      //     {
      //       type: "object",
      //     },
      //   ],
      // });
    });

    // NOTE: Don't see why this schemas are incompatible
    it.skip("throws if no compatible when merging oneOf", () => {
      expect(() => {
        merger({
          allOf: [
            {},
            {
              oneOf: [
                {
                  required: ["123"],
                },
              ],
            },
            {
              oneOf: [
                {
                  required: ["fdasfd"],
                },
              ],
            },
          ],
        });
      }).to.throw(/incompatible/);

      expect(() => {
        merger({
          allOf: [
            {},
            {
              oneOf: [
                {
                  required: ["123"],
                },
                {
                  properties: {
                    name: {
                      type: "string",
                    },
                  },
                },
              ],
            },
            {
              oneOf: [
                {
                  required: ["fdasfd"],
                },
              ],
            },
          ],
        });
      }).to.throw(/incompatible/);
    });

    // not ready to implement this yet
    it.skip("merges singular oneOf", () => {
      const result = merger({
        properties: {
          name: {
            type: "string",
          },
        },
        allOf: [
          {
            properties: {
              name: {
                type: "string",
                minLength: 10,
              },
            },
          },
          {
            oneOf: [
              {
                required: ["123"],
              },
              {
                properties: {
                  name: {
                    type: "string",
                    minLength: 15,
                  },
                },
              },
            ],
          },
          {
            oneOf: [
              {
                required: ["abc"],
              },
              {
                properties: {
                  name: {
                    type: "string",
                    minLength: 15,
                  },
                },
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        properties: {
          name: {
            type: "string",
            minLength: 15,
          },
        },
      });
    });

    it("merges not using allOf", () => {
      const result = merger({
        allOf: [
          {
            not: {
              properties: {
                name: {
                  type: "string",
                },
              },
            },
          },
          {
            not: {
              properties: {
                name: {
                  type: ["string", "null"],
                },
              },
            },
          },
        ],
      });

      expect(result).toEqual({
        not: {
          anyOf: [
            {
              properties: {
                name: {
                  type: "string",
                },
              },
            },
            {
              properties: {
                name: {
                  type: ["string", "null"],
                },
              },
            },
          ],
        },
      });
    });

    it("merges contains", () => {
      const result = merger({
        allOf: [
          {},
          {
            contains: {
              properties: {
                name: {
                  type: "string",
                  pattern: "bar",
                },
              },
            },
          },
          {
            contains: {
              properties: {
                name: {
                  type: "string",
                  pattern: "foo",
                },
              },
            },
          },
        ],
      });

      expect(result).toEqual({
        contains: {
          properties: {
            name: {
              type: "string",
              pattern: testPatternsMerger("bar", "foo"),
            },
          },
        },
      });
    });

    it("merges pattern using allOf", () => {
      const result = merger({
        allOf: [
          {},
          {
            pattern: "fdsaf",
          },
          {
            pattern: "abba",
          },
        ],
      });

      expect(result).toEqual({
        pattern: testPatternsMerger("fdsaf", "abba"),
      });

      const result2 = merger({
        allOf: [
          {
            pattern: "abba",
          },
        ],
      });

      expect(result2).toEqual({
        pattern: "abba",
      });
    });

    it("extracts pattern from anyOf and oneOf using | operator in regexp");

    // CHANGED: why `allOf` is not merged in the original test ???
    it("merges multipleOf using allOf or direct assignment", () => {
      const result = merger({
        allOf: [
          {
            title: "foo",
            type: ["number", "integer"],
            multipleOf: 2,
          },
          {
            type: "integer",
            multipleOf: 3,
          },
        ],
      });

      expect(result).toEqual({
        type: "integer",
        title: "foo",
        multipleOf: 6,
      });

      const result2 = merger({
        allOf: [
          {
            multipleOf: 1,
          },
        ],
      });

      expect(result2).toEqual({
        multipleOf: 1,
      });
    });

    it("merges multipleOf by finding lowest common multiple (LCM)", () => {
      const result = merger({
        allOf: [
          {},
          {
            multipleOf: 0.2,
            allOf: [
              {
                multipleOf: 2,
                allOf: [
                  {
                    multipleOf: 2,
                    allOf: [
                      {
                        multipleOf: 2,
                        allOf: [
                          {
                            multipleOf: 3,
                            allOf: [
                              {
                                multipleOf: 1.5,
                                allOf: [
                                  {
                                    multipleOf: 0.5,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            multipleOf: 0.3,
          },
        ],
      });

      expect(result).toEqual({
        multipleOf: 6,
      });

      expect(
        merger({
          allOf: [
            {
              multipleOf: 4,
            },
            {
              multipleOf: 15,
            },
            {
              multipleOf: 3,
            },
          ],
        })
      ).toEqual({
        multipleOf: 60,
      });

      expect(
        merger({
          allOf: [
            {
              multipleOf: 0.3,
            },
            {
              multipleOf: 0.7,
            },
            {
              multipleOf: 1,
            },
          ],
        })
      ).toEqual({
        multipleOf: 21,
      });

      expect(
        merger({
          allOf: [
            {
              multipleOf: 0.5,
            },
            {
              multipleOf: 2,
            },
          ],
        })
      ).toEqual({
        multipleOf: 2,
      });

      expect(
        merger({
          allOf: [
            {
              multipleOf: 0.3,
            },
            {
              multipleOf: 0.5,
            },
            {
              multipleOf: 1,
            },
          ],
        })
      ).toEqual({
        multipleOf: 3,
      });

      expect(
        merger({
          allOf: [
            {
              multipleOf: 0.3,
            },
            {
              multipleOf: 0.7,
            },
            {
              multipleOf: 1,
            },
          ],
        })
      ).toEqual({
        multipleOf: 21,
      });

      expect(
        merger({
          allOf: [
            {
              multipleOf: 0.4,
            },
            {
              multipleOf: 0.7,
            },
            {
              multipleOf: 3,
            },
          ],
        })
      ).toEqual({
        multipleOf: 42,
      });

      expect(
        merger({
          allOf: [
            {
              multipleOf: 0.2,
            },
            {
              multipleOf: 0.65,
            },
            {
              multipleOf: 1,
            },
          ],
        })
      ).toEqual({
        multipleOf: 13,
      });

      expect(
        merger({
          allOf: [
            {
              multipleOf: 100000,
            },
            {
              multipleOf: 1000000,
            },
            {
              multipleOf: 500000,
            },
          ],
        })
      ).toEqual({
        multipleOf: 1000000,
      });
    });
  });

  describe("merging arrays", () => {
    // CHANGED: we use `last` strategy for default merging
    it("merges required object", () => {
      expect(
        merger({
          required: ["prop2"],
          allOf: [
            {
              required: ["prop2", "prop1"],
            },
          ],
        })
      ).toEqual({
        required: ["prop2", "prop1"],
      });
    });

    // CHANGED: we use `last` strategy for default merging
    it("merges default value", () => {
      expect(
        merger({
          default: [
            "prop2",
            {
              prop1: "foo",
            },
          ],
          allOf: [
            {
              default: ["prop2", "prop1"],
            },
          ],
        })
      ).toEqual({
        default: ["prop2", "prop1"],
      });
    });

    // CHANGED: we use `last` strategy for default merging
    it("merges default value", () => {
      expect(
        merger({
          default: {
            foo: "bar",
          },
          allOf: [
            {
              default: ["prop2", "prop1"],
            },
          ],
        })
      ).toEqual({
        default: ["prop2", "prop1"],
      });
    });
  });

  describe("merging objects", () => {
    // CHANGED: we use `last` strategy for title merging
    it("merges child objects", () => {
      expect(
        merger({
          properties: {
            name: {
              title: "Name",
              type: "string",
            },
          },
          allOf: [
            {
              properties: {
                name: {
                  title: "allof1",
                  type: "string",
                },
                added: {
                  type: "integer",
                },
              },
            },
            {
              properties: {
                name: {
                  type: "string",
                },
              },
            },
          ],
        })
      ).toEqual({
        properties: {
          name: {
            title: "allof1",
            type: "string",
          },
          added: {
            type: "integer",
          },
        },
      });
    });
    it("merges boolean schemas", () => {
      expect(
        merger({
          properties: {
            name: true,
          },
          allOf: [
            {
              properties: {
                name: {
                  title: "allof1",
                  type: "string",
                },
                added: {
                  type: "integer",
                },
              },
            },
            {
              properties: {
                name: {
                  type: "string",
                  minLength: 5,
                },
              },
            },
          ],
        })
      ).toEqual({
        properties: {
          name: {
            title: "allof1",
            type: "string",
            minLength: 5,
          },
          added: {
            type: "integer",
          },
        },
      });
      expect(
        merger({
          properties: {
            name: false,
          },
          allOf: [
            {
              properties: {
                name: {
                  title: "allof1",
                  type: "string",
                },
                added: {
                  type: "integer",
                },
              },
            },
            {
              properties: {
                name: true,
              },
            },
          ],
        })
      ).toEqual({
        properties: {
          name: false,
          added: {
            type: "integer",
          },
        },
      });
      expect(
        merger({
          allOf: [true, false],
        })
      ).toEqual(false);
      expect(
        merger({
          properties: {
            name: true,
          },
          allOf: [
            {
              properties: {
                name: false,
                added: {
                  type: "integer",
                },
              },
            },
            {
              properties: {
                name: true,
              },
            },
          ],
        })
      ).toEqual({
        properties: {
          name: false,
          added: {
            type: "integer",
          },
        },
      });
    });
    // CHANGED: we don't support `deep` merge right now,
    // we use `last` strategy for the `title` property
    it("merges all allOf", () => {
      expect(
        merger({
          properties: {
            name: mergeAllOf({
              allOf: [
                {
                  pattern: "^.+$",
                },
              ],
            }),
          },
          allOf: [
            {
              properties: {
                name: true,
                added: mergeAllOf({
                  type: "integer",
                  title: "pri1",
                  allOf: [
                    {
                      title: "pri2",
                      type: ["string", "integer"],
                      minimum: 15,
                      maximum: 10,
                    },
                  ],
                }),
              },
              allOf: [
                {
                  properties: {
                    name: true,
                    added: {
                      type: "integer",
                      minimum: 5,
                    },
                  },
                  allOf: [
                    {
                      properties: {
                        added: {
                          title: "pri3",
                          type: "integer",
                          minimum: 10,
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              properties: {
                name: true,
                added: {
                  minimum: 7,
                },
              },
            },
          ],
        })
      ).toEqual({
        properties: {
          name: {
            pattern: "^.+$",
          },
          added: {
            type: "integer",
            title: "pri3",
            minimum: 15,
            maximum: 10,
          },
        },
      });
    });
  });

  // describe.skip('merging definitions', () => {
  //   it('merges circular', () => {
  //     const schema = {
  //       properties: {
  //         person: {
  //           properties: {
  //             name: {
  //               type: 'string',
  //               minLength: 8
  //             }
  //           },
  //           allOf: [{
  //             properties: {
  //               name: {
  //                 minLength: 5,
  //                 maxLength: 10
  //               }
  //             },
  //             allOf: [{
  //               properties: {
  //                 prop1: {
  //                   minLength: 7
  //                 }
  //               }
  //             }]
  //           }]
  //         }
  //       }
  //     }

  //     schema.properties.person.properties.child = schema.properties.person

  //     const expected = {
  //       person: {
  //         properties: {
  //           name: {
  //             minLength: 8,
  //             maxLength: 10,
  //             type: 'string'
  //           },
  //           prop1: {
  //             minLength: 7
  //           }
  //         }
  //       }
  //     }

  //     expected.person.properties.child = expected.person

  //     const result = merger(schema)

  //     expect(result).toEqual({
  //       properties: expected
  //     })
  //   })

  //   it('merges any definitions and circular', () => {
  //     const schema = {
  //       properties: {
  //         person: {
  //           $ref: '#/definitions/person'
  //         }
  //       },
  //       definitions: {
  //         person: {
  //           properties: {
  //             name: {
  //               type: 'string',
  //               minLength: 8
  //             },
  //             child: {
  //               $ref: '#/definitions/person'
  //             }
  //           },
  //           allOf: [{
  //             properties: {
  //               name: {
  //                 minLength: 5,
  //                 maxLength: 10
  //               }
  //             },
  //             allOf: [{
  //               properties: {
  //                 prop1: {
  //                   minLength: 7
  //                 }
  //               }
  //             }]
  //           }]
  //         }
  //       }
  //     }

  //     return $RefParser.dereference(schema).then(function(dereferenced) {
  //       const expected = {
  //         person: {
  //           properties: {
  //             name: {
  //               minLength: 8,
  //               maxLength: 10,
  //               type: 'string'
  //             },
  //             prop1: {
  //               minLength: 7
  //             }
  //           }
  //         }
  //       }

  //       expected.person.properties.child = expected.person

  //       const result = merger(schema)

  //       expect(result).toEqual({
  //         properties: expected,
  //         definitions: expected
  //       })

  //       expect(result).toBe(dereferenced)

  //       expect(result.properties.person.properties.child).toBe(result.definitions.person.properties.child)
  //       expect(result.properties.person.properties.child).toBe(dereferenced.properties.person)
  //     })
  //   })
  // })

  describe("dependencies", () => {
    // CHANGED: we don't support `deep` merge right now
    it("merges simliar schemas", () => {
      const result = merger({
        dependencies: {
          foo: mergeAllOf({
            type: ["string", "null", "integer"],
            allOf: [
              {
                minimum: 5,
              },
            ],
          }),
          bar: ["prop1", "prop2"],
        },
        allOf: [
          {
            dependencies: {
              foo: mergeAllOf({
                type: ["string", "null"],
                allOf: [
                  {
                    minimum: 7,
                  },
                ],
              }),
              bar: ["prop4"],
            },
          },
        ],
      });

      expect(result).toEqual({
        dependencies: {
          foo: {
            type: ["string", "null"],
            minimum: 7,
          },
          bar: ["prop1", "prop2", "prop4"],
        },
      });
    });

    it("merges mixed mode dependency", () => {
      const result = merger({
        dependencies: {
          bar: {
            type: ["string", "null", "integer"],
            required: ["abc"],
          },
        },
        allOf: [
          {
            dependencies: {
              bar: ["prop4"],
            },
          },
        ],
      });

      expect(result).toEqual({
        dependencies: {
          bar: {
            type: ["string", "null", "integer"],
            required: ["abc", "prop4"],
          },
        },
      });
    });
  });

  describe("propertyNames", () => {
    // CHANGED: we don't support `deep` merging right now
    it("merges simliar schemas", () => {
      const result = merger({
        propertyNames: mergeAllOf({
          type: "string",
          allOf: [
            {
              minLength: 5,
            },
          ],
        }),
        allOf: [
          {
            propertyNames: mergeAllOf({
              type: "string",
              pattern: "abc.*",
              allOf: [
                {
                  maxLength: 7,
                },
              ],
            }),
          },
        ],
      });

      expect(result).toEqual({
        propertyNames: {
          type: "string",
          pattern: "abc.*",
          minLength: 5,
          maxLength: 7,
        },
      });
    });
  });
});
