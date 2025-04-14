import { mergeSchemas } from "@sjsf/form/core";
import {
  ON_ARRAY_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type Schema,
} from "@sjsf/form";
import { describe, expect, it } from "vitest";

import { fragmentSchema, insertSubSchemaIds } from "./schema.js";

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

describe("insertSubSchemaIds", () => {
  it("should insert ids properly", () => {
    expect(insertSubSchemaIds(inputSchema)).toEqual({
      ids: new Map([
        ["#/", "sjsf__0"],
        ["#/oneOf/0", "sjsf__1"],
        ["#/definitions/second", "sjsf__2"],
      ]),
      schema: mergeSchemas(
        inputSchema,
        {
          $id: "sjsf__0",
          definitions: {
            second: {
              $id: "sjsf__2",
            },
          },
          oneOf: [
            {
              $id: "sjsf__1",
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
      ids: new Map([
        ["#/", "sjsf__0"],
        ["#/definitions/test", "sjsf__1"],
        ["#/oneOf/0", "sjsf__2"],
        ["#/oneOf/0/properties/firstName", "sjsf__3"],
        ["#/definitions/second", "sjsf__4"],
      ]),
      schema: mergeSchemas(
        inputSchema,
        {
          $id: "sjsf__0",
          definitions: {
            test: {
              $id: "sjsf__1",
            },
            second: {
              $id: "sjsf__4",
            },
          },
          oneOf: [
            {
              properties: {
                firstName: {
                  $id: "sjsf__3",
                },
              },
              $id: "sjsf__2",
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
      ids: new Map([
        ["#/", "sjsf__0"],
        ["#/definitions/second/properties/items", "sjsf__1"],
        ["#/oneOf/0", "sjsf__2"],
        ["#/definitions/second", "sjsf__3"],
      ]),
      schema: mergeSchemas(
        inputSchema,
        {
          $id: "sjsf__0",
          definitions: {
            second: {
              $id: "sjsf__3",
              properties: {
                items: {
                  $id: "sjsf__1",
                },
              },
            },
          },
          oneOf: [
            {
              $id: "sjsf__2",
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
      ids: new Map([
        ["#/", "sjsf__0"],
        ["#/definitions/second/properties/props", "sjsf__2"],
        ["#/oneOf/0", "sjsf__3"],
        ["#/definitions/second", "sjsf__4"],
      ]),
      schema: mergeSchemas(
        inputSchema,
        {
          $id: "sjsf__0",
          definitions: {
            second: {
              $id: "sjsf__4",
              properties: {
                props: {
                  $id: "sjsf__2",
                },
              },
            },
          },
          oneOf: [
            {
              $id: "sjsf__3",
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
    const { schema, ids } = insertSubSchemaIds(inputSchema);
    expect(fragmentSchema(schema, ids)).toEqual([
      {
        $id: "sjsf__1",
        properties: {
          firstName: {
            title: "First name",
            type: "string",
          },
          lastName: {
            $ref: "sjsf__0#/definitions/test",
          },
        },
        title: "First method of identification",
      },
      {
        $id: "sjsf__2",
        properties: {
          idCode: {
            $ref: "sjsf__0#/definitions/test",
          },
          items: {
            items: {
              $ref: "sjsf__0#/definitions/test",
            },
            title: "Third",
            type: "array",
          },
          props: {
            properties: {
              test: {
                $ref: "sjsf__0#/definitions/test",
              },
            },
          },
        },
        title: "Second method of identification",
      },
      {
        $id: "sjsf__0",
        definitions: {
          second: {
            $ref: "sjsf__2#",
          },
          test: {
            type: "string",
          },
        },
        oneOf: [
          {
            $ref: "sjsf__1#",
          },
          {
            $ref: "sjsf__0#/definitions/second",
          },
        ],
      },
    ]);
  });
  it("should properly fragment schema 2", () => {
    const { schema, ids } = insertSubSchemaIds(inputSchema, {
      fieldsValidationMode: ON_INPUT | ON_ARRAY_CHANGE | ON_OBJECT_CHANGE,
    });
    expect(fragmentSchema(schema, ids)).toEqual([
      {
        $id: "sjsf__6",
        title: "First name",
        type: "string",
      },
      {
        $id: "sjsf__5",
        properties: {
          firstName: {
            $ref: "sjsf__6#",
          },
          lastName: {
            $ref: "sjsf__0#/definitions/test",
          },
        },
        title: "First method of identification",
      },
      {
        $id: "sjsf__1",
        type: "string",
      },
      {
        $id: "sjsf__3",
        items: {
          $ref: "sjsf__0#/definitions/test",
        },
        title: "Third",
        type: "array",
      },
      {
        $id: "sjsf__4",
        properties: {
          test: {
            $ref: "sjsf__0#/definitions/test",
          },
        },
      },
      {
        $id: "sjsf__7",
        properties: {
          idCode: {
            $ref: "sjsf__0#/definitions/test",
          },
          items: {
            $ref: "sjsf__3#",
          },
          props: {
            $ref: "sjsf__4#",
          },
        },
        title: "Second method of identification",
      },
      {
        $id: "sjsf__0",
        definitions: {
          second: {
            $ref: "sjsf__7#",
          },
          test: {
            $ref: "sjsf__1#",
          },
        },
        oneOf: [
          {
            $ref: "sjsf__5#",
          },
          {
            $ref: "sjsf__0#/definitions/second",
          },
        ],
      },
    ]);
  });
});
