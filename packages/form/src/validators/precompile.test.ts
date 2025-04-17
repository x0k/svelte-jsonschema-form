import { describe, expect, it } from "vitest";

import { insertValue } from "@/lib/trie.js";
import { mergeSchemas, refToPath } from "@/core/index.js";
import {
  ON_ARRAY_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type Schema,
} from "@/form/main.js";

import {
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
    trie = insertValue(trie, refToPath(key), data[key]!);
  }
  return trie;
}

describe("insertSubSchemaIds", () => {
  it("should insert ids properly", () => {
    expect(insertSubSchemaIds(inputSchema)).toEqual({
      subSchemas: subSchemas({
        "#": { id: "v0", combinationBranch: false },
        "#/oneOf/0": { id: "v1", combinationBranch: true },
        "#/definitions/second": { id: "v2", combinationBranch: true },
      }),
      schema: mergeSchemas(
        inputSchema,
        {
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
        } satisfies Schema,
        { arraySubSchemasMergeType: "override" }
      ),
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
      schema: mergeSchemas(
        inputSchema,
        {
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
        } satisfies Schema,
        { arraySubSchemasMergeType: "override" }
      ),
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
      schema: mergeSchemas(
        inputSchema,
        {
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
        } satisfies Schema,
        { arraySubSchemasMergeType: "override" }
      ),
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
      schema: mergeSchemas(
        inputSchema,
        {
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
        } satisfies Schema,
        { arraySubSchemasMergeType: "override" }
      ),
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
});
