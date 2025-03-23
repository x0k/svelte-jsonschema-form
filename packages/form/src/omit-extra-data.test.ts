import { describe, expect, it, beforeEach } from "vitest";

import type { Validator } from "./core/validator.js";
import type { Schema } from "./core/schema.js";
import { createValidator } from "./core/test-validator.js";
import { defaultMerger } from "./core/merger.js";

import { omitExtraData } from "./omit-extra-data.js";

let validator: Validator;

beforeEach(() => {
  validator = createValidator();
});

// Most of the tests are AI generated and the test cases are duplicated.
// However, this is better than nothing (a few bugs were found),
// the quality of tests can be improved over time.

describe("omitExtraData", () => {
  it("should omit extra data", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
      },
    };
    const formData = { foo: "bar", baz: "baz" };
    expect(omitExtraData(validator, defaultMerger, schema, formData)).eql({
      foo: "bar",
    });
  });

  it("should omit extra data 2", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "string" },
      },
    };
    const formData = { foo: "foo", baz: "baz" };
    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      foo: "foo",
    });
  });

  it("should not omit additionalProperties", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "string" },
        add: {
          type: "object",
          additionalProperties: {},
        },
      },
    };
    const formData = { foo: "foo", baz: "baz", add: { prop: 123 } };
    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      foo: "foo",
      add: { prop: 123 },
    });
  });

  it("should rename formData key if key input is renamed in a nested object", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        nested: {
          additionalProperties: { type: "string" },
        },
      },
    };
    const formData = { nested: { key1: "value" } };

    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      nested: { key1: "value" },
    });
  });

  it("should allow oneOf data entry", () => {
    const schema: Schema = {
      type: "object",
      oneOf: [
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
              type: "string",
            },
          },
          required: ["ipsum"],
        },
      ],
    };
    const formData = { lorum: "", lorem: "foo" };

    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      lorem: "foo",
    });
  });

  it("should allow anyOf data entry", () => {
    const schema: Schema = {
      type: "object",
      anyOf: [
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
              type: "string",
            },
          },
          required: ["ipsum"],
        },
      ],
    };
    const formData = { ipsum: "" };

    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      ipsum: "",
    });
  });

  it("should return an empty object for an empty schema and value", () => {
    const schema = {};
    const value = {};

    const result = omitExtraData(validator, defaultMerger, schema, value);
    expect(result).toEqual({});
  });

  it("should retain fields that match the schema", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name"],
    };
    const value = {
      name: "John",
      age: 30,
      extraField: "remove me",
    };

    const result = omitExtraData(validator, defaultMerger, schema, value);
    expect(result).toEqual({
      name: "John",
      age: 30,
    });
  });

  it("should remove fields not defined in the schema", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    };
    const value = {
      name: "Jane",
      age: 25,
    };

    const result = omitExtraData(validator, defaultMerger, schema, value);
    expect(result).toEqual({
      name: "Jane",
    });
  });

  it("should handle nested objects", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            name: { type: "string" },
            address: {
              type: "object",
              properties: {
                city: { type: "string" },
              },
            },
          },
        },
      },
    };
    const value = {
      user: {
        name: "Alice",
        address: {
          city: "Wonderland",
          zipcode: 12345,
        },
        extraField: "remove me",
      },
    };

    const result = omitExtraData(validator, defaultMerger, schema, value);
    expect(result).toEqual({
      user: {
        name: "Alice",
        address: {
          city: "Wonderland",
        },
      },
    });
  });

  it("should handle arrays with items schema", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        tags: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    };
    const value = {
      tags: ["tag1", "tag2", 123],
    };

    const result = omitExtraData(validator, defaultMerger, schema, value);
    expect(result).toEqual({
      tags: ["tag1", "tag2", 123],
    });
  });

  it("should handle missing optional fields", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
    };
    const value = {
      name: "Bob",
    };

    const result = omitExtraData(validator, defaultMerger, schema, value);
    expect(result).toEqual({
      name: "Bob",
    });
  });

  it("should handle primitive types correctly", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        isActive: { type: "boolean" },
      },
    };
    const value = {
      isActive: true,
      extraField: "remove me",
    };

    const result = omitExtraData(validator, defaultMerger, schema, value);
    expect(result).toEqual({
      isActive: true,
    });
  });

  it("should ignore fields not matching array item schema", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
            },
          },
        },
      },
    };
    const value = {
      items: [{ id: 1 }, { id: 2, extraField: "remove me" }, { invalid: true }],
    };

    const result = omitExtraData(validator, defaultMerger, schema, value);
    expect(result).toEqual({
      items: [{ id: 1 }, { id: 2 }, {}],
    });
  });

  it("should handle null type", () => {
    const schema: Schema = {
      type: "null",
    };
    expect(omitExtraData(validator, defaultMerger, schema, null)).toBe(null);
    expect(omitExtraData(validator, defaultMerger, schema, undefined)).toBe(
      undefined
    );
    expect(omitExtraData(validator, defaultMerger, schema, "null")).toBe(
      "null"
    );
  });

  describe("object type", () => {
    it("should remove extra properties from objects", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
        required: ["name"],
      };

      const input = {
        name: "John",
        age: 30,
        extraField: "should be removed",
        anotherExtra: 42,
      };

      expect(omitExtraData(validator, defaultMerger, schema, input)).toEqual({
        name: "John",
        age: 30,
      });
    });

    it("should handle nested objects", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              name: { type: "string" },
              contact: {
                type: "object",
                properties: {
                  email: { type: "string" },
                },
              },
            },
          },
        },
      };

      const input = {
        user: {
          name: "John",
          contact: {
            email: "john@example.com",
            phone: "123-456-7890", // Should be removed
          },
          extraField: true, // Should be removed
        },
        someOtherField: "remove me", // Should be removed
      };

      expect(omitExtraData(validator, defaultMerger, schema, input)).toEqual({
        user: {
          name: "John",
          contact: {
            email: "john@example.com",
          },
        },
      });
    });

    it("should handle empty objects", () => {
      const schema: Schema = {
        type: "object",
        properties: {},
      };

      expect(omitExtraData(validator, defaultMerger, schema, {})).toEqual({});
      expect(
        omitExtraData(validator, defaultMerger, schema, { extra: "field" })
      ).toEqual({});
    });
  });

  describe("array type", () => {
    it("should handle arrays of primitive types", () => {
      const schema: Schema = {
        type: "array",
        items: { type: "string" },
      };

      const input = ["valid", 123, "also valid", true];
      expect(omitExtraData(validator, defaultMerger, schema, input)).toEqual([
        "valid",
        123,
        "also valid",
        true,
      ]);
    });

    it("should handle arrays of objects", () => {
      const schema: Schema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
          },
          required: ["id"],
        },
      };

      const input = [
        { id: 1, name: "John", extra: true },
        { id: 2, extra: "remove" },
        { name: "Invalid" },
        { id: 3, name: "Jane", tags: ["a", "b"] },
      ];

      expect(omitExtraData(validator, defaultMerger, schema, input)).toEqual([
        { id: 1, name: "John" },
        { id: 2 },
        { name: "Invalid" },
        { id: 3, name: "Jane" },
      ]);
    });

    it("should handle tuple validation", () => {
      const schema: Schema = {
        type: "array",
        items: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
        additionalItems: false,
      };

      const input = ["test", 42, true, "extra", "items"];
      expect(omitExtraData(validator, defaultMerger, schema, input)).toEqual([
        "test",
        42,
        true,
      ]);
    });
  });

  describe("combined schemas", () => {
    it("should handle oneOf", () => {
      const schema: Schema = {
        oneOf: [
          { type: "string" },
          {
            type: "object",
            properties: {
              value: { type: "string" },
            },
          },
        ],
      };

      expect(
        omitExtraData(validator, defaultMerger, schema, "direct string")
      ).toBe("direct string");
      expect(
        omitExtraData(validator, defaultMerger, schema, {
          value: "test",
          extra: true,
        })
      ).toEqual({
        value: "test",
      });
    });

    it("should handle allOf", () => {
      const schema: Schema = {
        allOf: [
          {
            type: "object",
            properties: {
              name: { type: "string" },
            },
          },
          {
            type: "object",
            properties: {
              age: { type: "number" },
            },
          },
        ],
      };

      const input = {
        name: "John",
        age: 30,
        extra: true,
      };

      expect(omitExtraData(validator, defaultMerger, schema, input)).toEqual({
        name: "John",
        age: 30,
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty schema", () => {
      const schema = {};
      expect(
        omitExtraData(validator, defaultMerger, schema, { any: "value" })
      ).toEqual({ any: "value" });
    });

    it("should handle undefined/null inputs", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      };

      expect(omitExtraData(validator, defaultMerger, schema, undefined)).toBe(
        undefined
      );
      expect(omitExtraData(validator, defaultMerger, schema, null)).toBe(
        undefined
      );
    });
  });

  describe("anyOf", () => {
    it("should handle simple anyOf with primitive types", () => {
      const schema: Schema = {
        anyOf: [{ type: "string" }, { type: "number" }],
      };

      expect(omitExtraData(validator, defaultMerger, schema, "test")).toBe(
        "test"
      );
      expect(omitExtraData(validator, defaultMerger, schema, 42)).toBe(42);
      // Validation is not our responsibility
      expect(omitExtraData(validator, defaultMerger, schema, true)).toBe(true);
    });

    it("should handle anyOf with objects having different properties", () => {
      const schema: Schema = {
        anyOf: [
          {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            required: ["name"],
          },
          {
            type: "object",
            properties: {
              id: { type: "number" },
            },
            required: ["id"],
          },
        ],
      };

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          name: "John",
          extra: true,
        })
      ).toEqual({ name: "John" });
      expect(
        omitExtraData(validator, defaultMerger, schema, {
          id: 123,
          extra: true,
        })
      ).toEqual({ id: 123 });
      expect(
        omitExtraData(validator, defaultMerger, schema, { extra: true })
      ).toEqual({});
    });
  });

  describe("allOf", () => {
    it("should handle allOf with property merging", () => {
      const schema: Schema = {
        allOf: [
          {
            type: "object",
            properties: {
              name: { type: "string" },
            },
          },
          {
            type: "object",
            properties: {
              age: { type: "number" },
            },
          },
          {
            type: "object",
            properties: {
              email: { type: "string" },
            },
          },
        ],
      };

      const input = {
        name: "John",
        age: 30,
        email: "john@example.com",
        extra: true,
      };

      expect(omitExtraData(validator, defaultMerger, schema, input)).toEqual({
        name: "John",
        age: 30,
        email: "john@example.com",
      });
    });

    it("should handle allOf with nested object constraints", () => {
      const schema: Schema = {
        allOf: [
          {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
              },
            },
          },
          {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  age: { type: "number" },
                },
              },
            },
          },
        ],
      };

      const input = {
        user: {
          name: "John",
          age: 30,
          extra: true,
        },
        extraTop: true,
      };

      expect(omitExtraData(validator, defaultMerger, schema, input)).toEqual({
        user: {
          name: "John",
          age: 30,
        },
      });
    });
  });

  describe("oneOf", () => {
    it("should handle oneOf with exclusive conditions", () => {
      const schema: Schema = {
        oneOf: [
          {
            type: "object",
            properties: {
              type: { const: "user" },
              username: { type: "string" },
            },
            required: ["type", "username"],
          },
          {
            type: "object",
            properties: {
              type: { const: "admin" },
              adminId: { type: "number" },
            },
            required: ["type", "adminId"],
          },
        ],
      };

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          type: "user",
          username: "john",
          extra: true,
        })
      ).toEqual({
        type: "user",
        username: "john",
      });

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          type: "admin",
          adminId: 123,
          extra: true,
        })
      ).toEqual({
        type: "admin",
        adminId: 123,
      });
    });

    it("should handle oneOf with array variations", () => {
      const schema: Schema = {
        oneOf: [
          {
            type: "array",
            items: { type: "string" },
          },
          {
            type: "array",
            items: { type: "number" },
          },
        ],
      };

      expect(
        omitExtraData(validator, defaultMerger, schema, ["a", "b", "c"])
      ).toEqual(["a", "b", "c"]);
      expect(
        omitExtraData(validator, defaultMerger, schema, [1, 2, 3])
      ).toEqual([1, 2, 3]);
      // Validation is not our responsibility
      expect(
        omitExtraData(validator, defaultMerger, schema, ["a", 1, "b"])
      ).toEqual(["a", 1, "b"]);
    });
  });

  describe("not", () => {
    it("should handle simple not conditions", () => {
      const schema: Schema = {
        not: { type: "string" },
      };

      expect(omitExtraData(validator, defaultMerger, schema, 42)).toBe(42);
      // Validation is not our responsibility
      expect(omitExtraData(validator, defaultMerger, schema, "test")).toBe(
        "test"
      );
    });

    it("should handle not with object patterns", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          type: { type: "string" },
          value: {
            not: {
              type: "object",
              properties: {
                forbidden: { type: "boolean" },
              },
            },
          },
        },
      };

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          type: "test",
          value: "simple value",
          extra: true,
        })
      ).toEqual({
        type: "test",
        value: "simple value",
      });

      // We don't support validation, also the schema type
      // for the `value` cannot be inferred correctly
      expect(
        omitExtraData(validator, defaultMerger, schema, {
          type: "test",
          value: { forbidden: true },
        })
      ).toEqual({
        type: "test",
        value: { forbidden: true },
      });
    });
  });

  describe("nested compounds", () => {
    it("should handle anyOf within allOf", () => {
      const schema: Schema = {
        allOf: [
          {
            type: "object",
            properties: {
              id: { type: "number" },
            },
          },
          {
            anyOf: [
              {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
              },
              {
                type: "object",
                properties: {
                  username: { type: "string" },
                },
              },
            ],
          },
        ],
      };

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          id: 1,
          name: "John",
          extra: true,
        })
      ).toEqual({
        id: 1,
        name: "John",
      });

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          id: 2,
          username: "john_doe",
          extra: true,
        })
      ).toEqual({
        id: 2,
        username: "john_doe",
      });
    });

    it("should handle oneOf within anyOf", () => {
      const schema: Schema = {
        anyOf: [
          { type: "string" },
          {
            oneOf: [
              {
                type: "object",
                properties: {
                  age: { type: "number" },
                },
              },
              {
                type: "object",
                properties: {
                  year: { type: "number" },
                },
              },
            ],
          },
        ],
      };

      expect(omitExtraData(validator, defaultMerger, schema, "test")).toBe(
        "test"
      );
      validator = createValidator({
        isValid: [
          false, // compare with string
        ],
      });
      expect(
        omitExtraData(validator, defaultMerger, schema, {
          age: 25,
          extra: true,
        })
      ).toEqual({ age: 25 });
      validator = createValidator({
        isValid: [
          false, // compare with string
          true, // compare with anyOf
          false, // compare with age
        ],
      });
      expect(
        omitExtraData(validator, defaultMerger, schema, {
          year: 1990,
          extra: true,
        })
      ).toEqual({ year: 1990 });
    });

    it("should handle complex nested combinations", () => {
      const schema: Schema = {
        oneOf: [
          {
            allOf: [
              {
                type: "object",
                properties: {
                  type: { const: "user" },
                },
              },
              {
                anyOf: [
                  {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                    },
                  },
                  {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            properties: {
              type: { const: "system" },
              code: { type: "string" },
            },
          },
        ],
      };

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          type: "user",
          name: "John",
          extra: true,
        })
      ).toEqual({
        type: "user",
        name: "John",
      });

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          type: "user",
          id: 123,
          extra: true,
        })
      ).toEqual({
        type: "user",
        id: 123,
      });

      expect(
        omitExtraData(validator, defaultMerger, schema, {
          type: "system",
          code: "ABC",
          extra: true,
        })
      ).toEqual({
        type: "system",
        code: "ABC",
      });
    });
  });
});
