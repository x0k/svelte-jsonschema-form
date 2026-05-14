import { describe, expect, it } from "vitest";

import { insertValue } from "@/lib/trie.js";
import { createMerger } from "@/lib/json-schema/index.js";
import { pathFromRef } from "@/core/index.js";
import {
  ON_ARRAY_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type Schema,
} from "@/form/main.js";

import {
  createValidatorRetriever,
  fragmentSchema,
  insertSubSchemaIds,
  type SchemaMeta,
  type SubSchemas,
} from "./precompile.js";

const inputSchema: Schema = {
  definitions: {
    test: {
      type: "string",
    },
    second: {
      title: "Second method of identification",
      properties: {
        idCode: {
          $ref: "#/definitions/test",
        },
        items: {
          title: "Third",
          type: "array",
          items: {
            $ref: "#/definitions/test",
          },
        },
        props: {
          properties: {
            test: {
              $ref: "#/definitions/test",
            },
          },
        },
      },
    },
  },
  oneOf: [
    {
      title: "First method of identification",
      properties: {
        firstName: {
          type: "string",
          title: "First name",
        },
        lastName: {
          $ref: "#/definitions/test",
        },
      },
    },
    {
      $ref: "#/definitions/second",
    },
  ],
};

function subSchemas(data: Record<string, SchemaMeta>): SubSchemas {
  let trie: SubSchemas;
  for (const key of Object.keys(data)) {
    trie = insertValue(trie, pathFromRef(key), data[key]!);
  }
  return trie;
}

const { mergeSchemaDefinitions: mergeSchemas } = createMerger({
  mergers: {
    oneOf: (a, b) => {
      const copy = a.slice();
      for (let i = 0; i < b.length; i++) {
        copy[i] = mergeSchemas(a[i]!, b[i]!);
      }
      return copy;
    },
  },
});

describe("insertSubSchemaIds", () => {
  it("should insert ids properly", () => {
    expect(insertSubSchemaIds(inputSchema)).toEqual({
      subSchemas: subSchemas({
        "#": { id: "v0", combinationBranch: false },
        "#/oneOf/0": { id: "v1", combinationBranch: true },
        "#/definitions/second": { id: "v2", combinationBranch: true },
      }),
      schema: mergeSchemas(inputSchema, {
        $id: "v0",
        definitions: {
          second: {
            $id: "v2",
          },
        },
        oneOf: [
          {
            $id: "v1",
          },
        ],
      } satisfies Schema),
    });
  });
  it("should inset ids properly 2", () => {
    expect(
      insertSubSchemaIds(inputSchema, { fieldsValidationMode: ON_INPUT })
    ).toEqual({
      subSchemas: subSchemas({
        "#": { id: "v0", combinationBranch: false },
        "#/definitions/test": { id: "v1", combinationBranch: false },
        "#/oneOf/0": { id: "v2", combinationBranch: true },
        "#/oneOf/0/properties/firstName": {
          id: "v3",
          combinationBranch: false,
        },
        "#/definitions/second": { id: "v4", combinationBranch: true },
      }),
      schema: mergeSchemas(inputSchema, {
        $id: "v0",
        definitions: {
          test: {
            $id: "v1",
          },
          second: {
            $id: "v4",
          },
        },
        oneOf: [
          {
            properties: {
              firstName: {
                $id: "v3",
              },
            },
            $id: "v2",
          },
        ],
      } satisfies Schema),
    });
  });
  it("should inset ids properly 3", () => {
    expect(
      insertSubSchemaIds(inputSchema, { fieldsValidationMode: ON_ARRAY_CHANGE })
    ).toEqual({
      subSchemas: subSchemas({
        "#": { id: "v0", combinationBranch: false },
        "#/definitions/second/properties/items": {
          id: "v1",
          combinationBranch: false,
        },
        "#/oneOf/0": { id: "v2", combinationBranch: true },
        "#/definitions/second": { id: "v3", combinationBranch: true },
      }),
      schema: mergeSchemas(inputSchema, {
        $id: "v0",
        definitions: {
          second: {
            $id: "v3",
            properties: {
              items: {
                $id: "v1",
              },
            },
          },
        },
        oneOf: [
          {
            $id: "v2",
          },
        ],
      } satisfies Schema),
    });
  });
  it("should inset ids properly 4", () => {
    expect(
      insertSubSchemaIds(inputSchema, {
        fieldsValidationMode: ON_OBJECT_CHANGE,
      })
    ).toEqual({
      subSchemas: subSchemas({
        "#": { id: "v0", combinationBranch: false },
        "#/definitions/second/properties/props": {
          id: "v2",
          combinationBranch: false,
        },
        "#/oneOf/0": { id: "v3", combinationBranch: true },
        "#/definitions/second": { id: "v1", combinationBranch: true },
      }),
      schema: mergeSchemas(inputSchema, {
        $id: "v0",
        definitions: {
          second: {
            $id: "v1",
            properties: {
              props: {
                $id: "v2",
              },
            },
          },
        },
        oneOf: [
          {
            $id: "v3",
          },
        ],
      } satisfies Schema),
    });
  });
});

describe("fragmentSchema", () => {
  it("should properly fragment schema", () => {
    expect(fragmentSchema(insertSubSchemaIds(inputSchema))).toEqual([
      {
        $id: "v1",
        properties: {
          firstName: {
            title: "First name",
            type: "string",
          },
          lastName: {
            $ref: "v0#/definitions/test",
          },
        },
        title: "First method of identification",
      },
      {
        $id: "v1ag",
        allOf: [
          {
            $ref: "v1#",
          },
          {
            anyOf: [
              {
                required: ["firstName"],
              },
              {
                required: ["lastName"],
              },
            ],
          },
        ],
      },
      {
        $id: "v2",
        properties: {
          idCode: {
            $ref: "v0#/definitions/test",
          },
          items: {
            items: {
              $ref: "v0#/definitions/test",
            },
            title: "Third",
            type: "array",
          },
          props: {
            properties: {
              test: {
                $ref: "v0#/definitions/test",
              },
            },
          },
        },
        title: "Second method of identification",
      },
      {
        $id: "v2ag",
        allOf: [
          {
            $ref: "v2#",
          },
          {
            anyOf: [
              {
                required: ["idCode"],
              },
              {
                required: ["items"],
              },
              {
                required: ["props"],
              },
            ],
          },
        ],
      },
      {
        $id: "v0",
        definitions: {
          second: {
            $ref: "v2#",
          },
          test: {
            type: "string",
          },
        },
        oneOf: [
          {
            $ref: "v1#",
          },
          {
            $ref: "v0#/definitions/second",
          },
        ],
      },
    ]);
  });
  it("should properly fragment schema 2", () => {
    const data = insertSubSchemaIds(inputSchema, {
      fieldsValidationMode: ON_INPUT | ON_ARRAY_CHANGE | ON_OBJECT_CHANGE,
    });
    expect(fragmentSchema(data)).toEqual([
      {
        $id: "v6",
        title: "First name",
        type: "string",
      },
      {
        $id: "v5",
        properties: {
          firstName: {
            $ref: "v6#",
          },
          lastName: {
            $ref: "v0#/definitions/test",
          },
        },
        title: "First method of identification",
      },
      {
        $id: "v5ag",
        allOf: [
          {
            $ref: "v5#",
          },
          {
            anyOf: [
              {
                required: ["firstName"],
              },
              {
                required: ["lastName"],
              },
            ],
          },
        ],
      },
      {
        $id: "v1",
        type: "string",
      },
      {
        $id: "v3",
        items: {
          $ref: "v0#/definitions/test",
        },
        title: "Third",
        type: "array",
      },
      {
        $id: "v4",
        properties: {
          test: {
            $ref: "v0#/definitions/test",
          },
        },
      },
      {
        $id: "v2",
        properties: {
          idCode: {
            $ref: "v0#/definitions/test",
          },
          items: {
            $ref: "v3#",
          },
          props: {
            $ref: "v4#",
          },
        },
        title: "Second method of identification",
      },
      {
        $id: "v2ag",
        allOf: [
          {
            $ref: "v2#",
          },
          {
            anyOf: [
              {
                required: ["idCode"],
              },
              {
                required: ["items"],
              },
              {
                required: ["props"],
              },
            ],
          },
        ],
      },
      {
        $id: "v0",
        definitions: {
          second: {
            $ref: "v2#",
          },
          test: {
            $ref: "v1#",
          },
        },
        oneOf: [
          {
            $ref: "v5#",
          },
          {
            $ref: "v0#/definitions/second",
          },
        ],
      },
    ]);
  });
  it("should remove $id in augmented schema", () => {
    const data = insertSubSchemaIds(
      {
        oneOf: [
          {
            type: "object",
            properties: {
              kind: { type: "string", enum: ["cat"] },
              lives: { type: "number" },
            },
            required: ["kind"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              kind: { type: "string", enum: ["dog"] },
              breed: { type: "string" },
            },
            required: ["kind"],
            additionalProperties: false,
          },
        ],
      },
      {
        fieldsValidationMode: ON_INPUT | ON_ARRAY_CHANGE | ON_OBJECT_CHANGE,
      }
    );
    expect(fragmentSchema(data)).toEqual([
      { type: "string", enum: ["cat"], $id: "v2" },
      { type: "number", $id: "v3" },
      {
        type: "object",
        properties: { kind: { $ref: "v2#" }, lives: { $ref: "v3#" } },
        required: ["kind"],
        additionalProperties: false,
        $id: "v1",
      },
      {
        allOf: [
          {
            type: "object",
            properties: { kind: { $ref: "v2#" }, lives: { $ref: "v3#" } },
            additionalProperties: true,
          },
          { anyOf: [{ required: ["kind"] }, { required: ["lives"] }] },
        ],
        $id: "v1ag",
      },
      { type: "string", enum: ["dog"], $id: "v5" },
      { type: "string", $id: "v6" },
      {
        type: "object",
        properties: { kind: { $ref: "v5#" }, breed: { $ref: "v6#" } },
        required: ["kind"],
        additionalProperties: false,
        $id: "v4",
      },
      {
        allOf: [
          {
            type: "object",
            properties: { kind: { $ref: "v5#" }, breed: { $ref: "v6#" } },
            additionalProperties: true,
          },
          { anyOf: [{ required: ["kind"] }, { required: ["breed"] }] },
        ],
        $id: "v4ag",
      },
      { oneOf: [{ $ref: "v1#" }, { $ref: "v4#" }], $id: "v0" },
    ]);
  });
});

type FakeValidator = { name: string };

function makeRegistry(entries: Record<string, FakeValidator>) {
  return {
    get: (id: string) => entries[id],
  };
}

describe("createValidatorRetriever", () => {
  describe("when $id is present", () => {
    it("returns the validator from the registry", () => {
      const validator: FakeValidator = { name: "my-validator" };
      const retriever = createValidatorRetriever({
        registry: makeRegistry({ "schema/foo": validator }),
      });

      const result = retriever({ $id: "schema/foo" });

      expect(result).toBe(validator);
    });

    it("throws when the validator is not in the registry", () => {
      const retriever = createValidatorRetriever({
        registry: makeRegistry({}),
      });

      expect(() =>
        retriever({ $id: "schema/missing" } satisfies Schema)
      ).toThrow('Validator with id "schema/missing" not found');
    });
  });

  describe("when $id is present and additionalProperties is true", () => {
    it("falls through to the base id when the open variant is absent", () => {
      const baseValidator: FakeValidator = { name: "base-validator" };
      const retriever = createValidatorRetriever({
        registry: makeRegistry({ "schema/foo": baseValidator }),
      });

      const result = retriever({
        $id: "schema/foo",
        additionalProperties: true,
      });

      expect(result).toBe(baseValidator);
    });

    it("throws when neither open nor base validator exists", () => {
      const retriever = createValidatorRetriever({
        registry: makeRegistry({}),
      });

      expect(() =>
        retriever({
          $id: "schema/missing",
          additionalProperties: true,
        } satisfies Schema)
      ).toThrow('Validator with id "schema/missing" not found');
    });

    it("does NOT do an open lookup when additionalProperties is false", () => {
      const openValidator: FakeValidator = { name: "open-validator" };
      const baseValidator: FakeValidator = { name: "base-validator" };
      const retriever = createValidatorRetriever({
        registry: makeRegistry({
          "schema/foo": baseValidator,
          "schema/foo_open": openValidator,
        }),
      });

      const result = retriever({
        $id: "schema/foo",
        additionalProperties: false,
      });

      // should get the base validator, not the open one
      expect(result).toBe(baseValidator);
    });
  });

  describe("when $id is absent", () => {
    it("derives the id via the combination augmentation from allOf[0].$id", () => {
      const combinedValidator: FakeValidator = { name: "combined" };
      // We need to know what key the default combination augmentation produces.
      // Use the augmentation itself to avoid hard-coding the suffix here.
      const baseId = "schema/base";
      let combinedId!: string;
      createValidatorRetriever({
        registry: {
          get: (id) => {
            combinedId = id;
            return combinedValidator;
          },
        },
      })({ allOf: [{ $id: baseId }] } satisfies Schema);

      // The combined id should differ from the base id (suffix was appended)
      expect(combinedId).not.toBe(baseId);
      expect(combinedId).toContain(baseId);

      // A fresh retriever with the real key returns the validator
      const retriever = createValidatorRetriever({
        registry: makeRegistry({ [combinedId]: combinedValidator }),
      });
      const result = retriever({ allOf: [{ $id: baseId }] });
      expect(result).toBe(combinedValidator);
    });

    it("throws when allOf is empty", () => {
      const retriever = createValidatorRetriever({
        registry: makeRegistry({}),
      });

      expect(() => retriever({ allOf: [] } satisfies Schema)).toThrow(
        "Schema id not found"
      );
    });

    it("throws when allOf is undefined", () => {
      const retriever = createValidatorRetriever({
        registry: makeRegistry({}),
      });

      expect(() => retriever({} satisfies Schema)).toThrow(
        "Schema id not found"
      );
    });

    it("throws when allOf[0] is not an object", () => {
      const retriever = createValidatorRetriever({
        registry: makeRegistry({}),
      });

      expect(() => retriever({ allOf: [true] } satisfies Schema)).toThrow(
        "Schema id not found"
      );
    });

    it("throws when allOf[0] is an object without $id", () => {
      const retriever = createValidatorRetriever({
        registry: makeRegistry({}),
      });

      expect(() => retriever({ allOf: [{}] } satisfies Schema)).toThrow(
        "Schema id not found"
      );
    });
  });

  // -------------------------------------------------------------------------
  // Custom idAugmentations
  // -------------------------------------------------------------------------

  describe("custom idAugmentations", () => {
    it("overrides the combination augmentation", () => {
      const validator: FakeValidator = { name: "custom-combined" };
      const customKey = "schema/base__CUSTOM";
      const retriever = createValidatorRetriever({
        registry: makeRegistry({ [customKey]: validator }),
        idAugmentations: {
          combination: (id) => `${id}__CUSTOM`,
        },
      });

      const result = retriever({
        allOf: [{ $id: "schema/base" }],
      });

      expect(result).toBe(validator);
    });
  });
});
