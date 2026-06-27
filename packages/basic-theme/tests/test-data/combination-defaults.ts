import type { Schema, UiSchemaRoot } from "@sjsf/form";

export const discriminatedSchema = {
  type: "object",
  title: "Combination",
  discriminator: {
    propertyName: "kind",
  },
  oneOf: [
    {
      title: "Person option",
      type: "object",
      properties: {
        kind: {
          const: "person",
          title: "Person kind",
          default: "person",
        },
        name: {
          type: "string",
          title: "Name",
          default: "Ada",
        },
        shared: {
          type: "string",
          title: "Shared",
        },
      },
    },
    {
      title: "Company option",
      type: "object",
      properties: {
        kind: {
          const: "company",
          title: "Company kind",
          default: "company",
        },
        companyName: {
          type: "string",
          title: "Company Name",
          default: "Acme",
        },
        shared: {
          type: "string",
          title: "Shared",
        },
      },
    },
  ],
} as const satisfies Schema;

export const discriminatedUiSchema = {
  oneOf: [
    {
      kind: {
        "ui:options": {
          title: "Person from UI",
        },
      },
    },
    {},
  ],
} satisfies UiSchemaRoot;

export const ambiguousSchema = {
  type: "object",
  anyOf: [
    {
      title: "String branch",
      type: "object",
      properties: {
        shared: {
          type: "string",
          title: "Shared",
          default: "string-default",
        },
      },
    },
    {
      title: "Number branch",
      type: "object",
      properties: {
        shared: {
          type: "number",
          title: "Shared",
          default: 7,
        },
      },
    },
  ],
} as const satisfies Schema;

export const plainOneOfSchema = {
  type: "object",
  oneOf: [
    {
      title: "First",
      type: "object",
      properties: {
        firstField: {
          type: "string",
          title: "First Field",
          default: "default-first",
        },
      },
    },
    {
      title: "Second",
      type: "object",
      properties: {
        secondField: {
          type: "number",
          title: "Second Field",
          default: 42,
        },
      },
    },
  ],
} as const satisfies Schema;

export const refObjectOneOfSchema = {
  title: "oneOf Example",
  type: "object",
  properties: {
    status: {
      $ref: "#/definitions/status",
    },
  },
  definitions: {
    status: {
      title: "Field Status",
      type: "object",
      oneOf: [
        {
          title: "Approved",
          type: "object",
        },
        {
          title: "Rejected",
          type: "object",
          properties: {
            reason: {
              title: "Rejection Reason",
              type: "string",
            },
          },
        },
      ],
    },
  },
} as const satisfies Schema;

export const refObjectAnyOfSchema = {
  title: "anyOf Example",
  type: "object",
  properties: {
    status: {
      $ref: "#/definitions/status",
    },
  },
  definitions: {
    status: {
      title: "Field Status",
      type: "object",
      anyOf: [
        {
          title: "Approved",
          type: "object",
        },
        {
          title: "Rejected",
          type: "object",
          properties: {
            reason: {
              title: "Rejection Reason",
              type: "string",
            },
          },
        },
      ],
    },
  },
} as const satisfies Schema;
