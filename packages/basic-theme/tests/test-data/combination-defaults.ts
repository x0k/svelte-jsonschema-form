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
      required: ["kind"],
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
      required: ["kind"],
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

export const arrayDefaultsOneOfSchema = {
  oneOf: [
    {
      title: "First",
      type: "array",
      default: [1],
      items: { type: "number" },
    },
    {
      title: "Second",
      type: "array",
      default: [2],
      items: { type: "number" },
    },
  ],
} as const satisfies Schema;

export const objectAndArrayDefaultsOneOfSchema = {
  type: "object",
  oneOf: [
    {
      title: "First",
      type: "object",
      properties: {
        kind: { type: "string", const: "first", default: "first" },
        runner: {
          type: "object",
          default: { name: "first" },
          properties: {
            name: { type: "string" },
            ratio: { type: "number", default: 0 },
          },
        },
        list: { type: "array", default: [1], items: { type: "number" } },
      },
    },
    {
      title: "Second",
      type: "object",
      properties: {
        kind: { type: "string", const: "second", default: "second" },
        runner: {
          type: "object",
          default: { name: "second" },
          properties: {
            name: { type: "string" },
            ratio: { type: "number", default: 0 },
          },
        },
        list: { type: "array", default: [2], items: { type: "number" } },
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

export const stringOneOfSchema = {
  type: "string",
  oneOf: [
    {
      title: "IPv4",
      pattern:
        "^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$",
    },
    {
      title: "IPv6",
      pattern: "^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::)$",
    },
  ],
} as const satisfies Schema;

export const numberOneOfSchema = {
  type: "number",
  oneOf: [
    { title: "Positive", minimum: 0 },
    { title: "Negative", maximum: 0 },
  ],
} as const satisfies Schema;

export const objectSharedOneOfSchema = {
  type: "object",
  properties: {
    shared: { type: "string", title: "Shared" },
  },
  oneOf: [
    { properties: { foo: { type: "string" } } },
    { properties: { bar: { type: "string" } } },
  ],
} as const satisfies Schema;

export const stringAnyOfSchema = {
  type: "string",
  anyOf: [
    { title: "Short", maxLength: 10 },
    { title: "Long", minLength: 11 },
  ],
} as const satisfies Schema;

export const numberAnyOfSchema = {
  type: "number",
  anyOf: [
    { title: "Positive", minimum: 0 },
    { title: "Negative", maximum: 0 },
  ],
} as const satisfies Schema;

export const objectSharedAnyOfSchema = {
  type: "object",
  properties: {
    shared: { type: "string", title: "Shared" },
  },
  anyOf: [
    { properties: { foo: { type: "string" } } },
    { properties: { bar: { type: "string" } } },
  ],
} as const satisfies Schema;

// Schemas from rjsf PR #5218 — test default restoration for disjoint properties
export const anyOfDisjointDefaultsSchema = {
  type: "object",
  properties: {
    age: { type: "integer", title: "Age" },
  },
  anyOf: [
    {
      title: "First method of identification",
      properties: {
        firstName: {
          type: "string",
          title: "First name",
          default: "Chuck",
        },
        lastName: { type: "string", title: "Last name" },
      },
    },
    {
      title: "Second method of identification",
      properties: {
        idCode: { type: "string", title: "ID code" },
      },
    },
  ],
} as const satisfies Schema;

export const oneOfDisjointDefaultsSchema = {
  type: "object",
  oneOf: [
    {
      title: "First method of identification",
      properties: {
        firstName: { type: "string", default: "Chuck" },
      },
    },
    {
      title: "Second method of identification",
      properties: {
        idCode: { type: "string" },
      },
    },
  ],
} as const satisfies Schema;

export const dependencyDefaultsSchema = {
  type: "object",
  properties: {
    triggersOverride: {
      type: "boolean",
      oneOf: [
        { title: "Override Repo Triggers", enum: [true] },
        { title: "Default to Repo Triggers", enum: [false] },
      ],
    },
  },
  dependencies: {
    triggersOverride: {
      oneOf: [
        {
          properties: {
            triggersOverride: { enum: [false] },
            repoData: {
              type: "object",
              properties: {
                triggers: {
                  type: "array",
                  default: [],
                  items: { type: "object" },
                },
              },
            },
          },
        },
        {
          properties: {
            triggersOverride: { enum: [true] },
            triggers: {
              type: "array",
              default: [],
              items: { type: "object" },
            },
          },
        },
      ],
    },
  },
} as const satisfies Schema;

// A parent `items` applies to every option, so each option declares its own
// item type here instead of contradicting a shared one.
export const arrayItemAnyOfSchema = {
  type: "array",
  title: "Array choice",
  anyOf: [
    {
      title: "With text items",
      items: {
        type: "string",
        title: "Item",
      },
    },
    {
      title: "Number items",
      items: {
        type: "number",
        title: "Item",
      },
    },
  ],
} as const satisfies Schema;

export const arrayInheritedItemsAnyOfSchema = {
  type: "array",
  title: "Array choice",
  items: {
    type: "string",
    title: "Item",
  },
  anyOf: [
    {
      title: "Up to three",
      maxItems: 3,
    },
    {
      title: "Four or more",
      minItems: 4,
    },
  ],
} as const satisfies Schema;

export const formattedStringOneOfSchema = {
  type: "string",
  format: "date",
  oneOf: [
    {
      title: "First half of the year",
      pattern: "^\\d{4}-(0[1-6])-\\d{2}$",
    },
    {
      title: "Second half of the year",
      pattern: "^\\d{4}-(0[7-9]|1[0-2])-\\d{2}$",
    },
  ],
} as const satisfies Schema;

// An option-level `default` populates its keys exactly as a property-level one
// does, so it has to count as the option declaring values for them.
export const optionLevelDefaultOneOfSchema = {
  oneOf: [
    {
      title: "Option A",
      type: "object",
      default: { kind: "a", runner: { name: "a" } },
      properties: {
        kind: { type: "string", const: "a" },
        runner: {
          type: "object",
          properties: { name: { type: "string" } },
        },
      },
    },
    {
      title: "Option B",
      type: "object",
      default: { kind: "b", runner: { name: "b" } },
      properties: {
        kind: { type: "string", const: "b" },
        runner: {
          type: "object",
          properties: { name: { type: "string" } },
        },
      },
    },
  ],
} as const satisfies Schema;

// An array option declares its default on the option itself, so the whole
// value goes stale on a switch rather than individual keys.
export const arrayOfObjectsDefaultOneOfSchema = {
  oneOf: [
    {
      title: "Option A",
      type: "array",
      default: [{ name: "a1" }],
      items: {
        type: "object",
        properties: { name: { type: "string" } },
      },
    },
    {
      title: "Option B",
      type: "array",
      default: [{ name: "b1" }],
      items: {
        type: "object",
        properties: { name: { type: "string" } },
      },
    },
  ],
} as const satisfies Schema;

const requiredArrayProperties = (name: string) => ({
  kind: { type: "string" as const, const: name, default: name },
  arr: {
    type: "array" as const,
    minItems: 2,
    items: { type: "string" as const, default: "z" },
    default: [`${name}1`],
  },
});

// The two schemas below differ only in where `required` is declared. The field
// renders each option merged with the parent's keywords, so both placements
// have to produce the same switch result.
export const parentRequiredArrayOneOfSchema = {
  type: "object",
  required: ["arr"],
  oneOf: [
    {
      title: "Option A",
      type: "object",
      properties: requiredArrayProperties("a"),
    },
    {
      title: "Option B",
      type: "object",
      properties: requiredArrayProperties("b"),
    },
  ],
} as const satisfies Schema;

export const optionRequiredArrayOneOfSchema = {
  type: "object",
  oneOf: [
    {
      title: "Option A",
      type: "object",
      required: ["arr"],
      properties: requiredArrayProperties("a"),
    },
    {
      title: "Option B",
      type: "object",
      required: ["arr"],
      properties: requiredArrayProperties("b"),
    },
  ],
} as const satisfies Schema;

// `false` is what the form computes for a required boolean, not something
// option A declares, so it is the user's value and option B's default must not
// displace it.
export const computedBooleanDefaultOneOfSchema = {
  oneOf: [
    {
      title: "Option A",
      type: "object",
      required: ["flag"],
      properties: {
        kind: { type: "string", const: "a", default: "a" },
        flag: { type: "boolean" },
      },
    },
    {
      title: "Option B",
      type: "object",
      properties: {
        kind: { type: "string", const: "b", default: "b" },
        flag: { type: "boolean", default: true },
      },
    },
  ],
} as const satisfies Schema;

// Sanitize clears a readOnly value that no longer matches its option's default
// rather than replacing it, so the new option's default only lands once the key
// is removed.
export const readOnlyDefaultOneOfSchema = {
  oneOf: [
    {
      title: "Option A",
      type: "object",
      properties: {
        kind: { type: "string", const: "a", default: "a" },
        license: { type: "string", default: "MIT", readOnly: true },
      },
    },
    {
      title: "Option B",
      type: "object",
      properties: {
        kind: { type: "string", const: "b", default: "b" },
        license: { type: "string", default: "Apache", readOnly: true },
      },
    },
  ],
} as const satisfies Schema;
