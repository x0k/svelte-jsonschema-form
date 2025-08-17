import { bench, describe, expect } from "vitest";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
// @ts-expect-error
import jsonSchemaCompare from "json-schema-compare";

import { isEqual } from "./json-schema-compare.js";

interface TestCase {
  name: string;
  expected: boolean;
  a: JSONSchema7Definition;
  b: JSONSchema7Definition;
}

type SchemaWithProperties = JSONSchema7 & {
  properties: Exclude<JSONSchema7["properties"], undefined>;
};

const largeSchema: SchemaWithProperties = {
  type: "object",
  properties: {},
};

for (let i = 0; i < 100; i++) {
  largeSchema.properties[`prop${i}`] = { type: "string", minLength: i };
}

const largeSchema2 = structuredClone(largeSchema);
// @ts-expect-error
largeSchema2.properties.prop50.minLength = 999;

enum TransformPreset {
  Default = "Default",
  Manual = "Manual",
}

enum OutputFormat {
  HTML = "HTML",
  XLSX = "XLSX",
  ASCII = "ASCII",
}

enum ASCIITableFormat {
  MySQL = "MySql",
  MarkdownLike = "Markdown Like",
}

const realSchema = {
  type: "object",
  title: "Options",
  properties: {
    preset: {
      title: "Preset",
      type: "string",
      enum: Object.values(TransformPreset),
      default: TransformPreset.Default,
    },
    transform: {
      title: "Transform",
      description: "Apply a transformation to the output data",
      type: "boolean",
      default: false,
    },
    format: {
      title: "Output format",
      type: "string",
      enum: Object.values(OutputFormat),
      default: OutputFormat.HTML,
    },
    paginate: {
      title: "Paginate",
      description:
        "Partitioning the input data (object or array) into pages by their keys",
      type: "boolean",
      default: false,
    },
    createOnOpen: {
      type: "boolean",
      title: "Create on open",
      description: "Creating a table when opening a share link",
      default: true,
    },
  },
  required: ["preset", "format"],
  dependencies: {
    preset: {
      oneOf: [
        {
          properties: {
            preset: {
              const: TransformPreset.Default,
            },
          },
        },
        {
          properties: {
            preset: {
              const: TransformPreset.Manual,
            },
            collapseIndexes: {
              title: "Combine nested indexes",
              description:
                "Combines hierarchical indexes into one cell (1.1, 1.2, ...)",
              type: "boolean",
              default: true,
            },
            joinPrimitiveArrayValues: {
              title: "Combine simple values",
              description:
                "Combines the values of an array of primitives into one cell (separated by ',')",
              type: "boolean",
              default: true,
            },
            combineArraysOfObjects: {
              title: "Combine objects",
              description: "Combine arrays of objects into a single object",
              type: "boolean",
              default: false,
            },
            stabilizeOrderOfPropertiesInArraysOfObjects: {
              title: "Stabilize order of properties",
              description:
                "Stabilizing the order in which properties are displayed for arrays of objects",
              type: "boolean",
              default: true,
            },
            proportionalSizeAdjustmentThreshold: {
              title: "Proportional size adjustment threshold",
              description:
                "Specifies the threshold to which the value (height, width) can be increased for a proportional increase. The default is 1 (by 100%).",
              type: "number",
              minimum: 0,
              default: 1,
            },
            cornerCellValue: {
              title: "Corner cell value",
              description: "The value of the corner cell.",
              type: "string",
              default: "№",
            },
          },
          required: ["proportionalSizeAdjustmentThreshold"],
        },
      ],
    },
    transform: {
      oneOf: [
        {
          properties: {
            transform: {
              const: false,
            },
          },
        },
        {
          properties: {
            transform: {
              const: true,
            },
            horizontalReflect: {
              type: "boolean",
              title: "Reflect horizontally",
              default: false,
            },
            verticalReflect: {
              type: "boolean",
              title: "Reflect vertically",
              default: false,
            },
            transpose: {
              type: "boolean",
              title: "Transpose",
              default: false,
            },
          },
        },
      ],
    },
    format: {
      oneOf: [
        {
          properties: {
            format: {
              const: OutputFormat.HTML,
            },
          },
        },
        {
          properties: {
            format: {
              const: OutputFormat.XLSX,
            },
          },
        },
        {
          properties: {
            format: {
              const: OutputFormat.ASCII,
            },
            asciiFormat: {
              type: "string",
              title: "ASCII table format",
              enum: Object.values(ASCIITableFormat),
              default: ASCIITableFormat.MySQL,
            },
          },
        },
      ],
    },
  },
} as const satisfies JSONSchema7;

const realSchema2 = structuredClone(realSchema);
// @ts-expect-error
realSchema2.dependencies.preset.oneOf[1].properties.proportionalSizeAdjustmentThreshold.default = 10;

const cases: TestCase[] = [
  {
    name: "simple",
    expected: false,
    a: {
      title: "title 1",
      type: ["object"],
      uniqueItems: false,
      dependencies: {
        name: ["age", "lastName"],
      },
      required: ["name", "age", "name"],
    },
    b: {
      title: "title 2",
      type: "object",
      required: ["age", "name"],
      dependencies: {
        name: ["lastName", "age"],
      },
      properties: {
        name: {
          minLength: 0,
        },
      },
    },
  },
  {
    name: "deduplication",
    expected: true,
    a: {
      anyOf: [{ type: "string" }, { type: "number" }, { type: "string" }],
    },
    b: {
      anyOf: [{ type: "number" }, { type: "string" }],
    },
  },
  {
    name: "large",
    expected: true,
    a: largeSchema,
    b: structuredClone(largeSchema),
  },
  {
    name: "large (negative)",
    expected: false,
    a: largeSchema,
    b: largeSchema2,
  },
  {
    name: "real",
    expected: true,
    a: realSchema,
    b: structuredClone(realSchema),
  },
  {
    name: "real (negative)",
    expected: false,
    a: realSchema,
    b: realSchema2,
  },
];

describe("isEqual vs json-schema-compare", () => {
  for (const { name, a, b, expected } of cases) {
    describe(name, () => {
      bench("isEqual", () => {
        expect(isEqual(a, b)).toBe(expected);
      });
      bench("json-schema-compare", () => {
        expect(jsonSchemaCompare(a, b)).toBe(expected);
      });
    });
  }
});
