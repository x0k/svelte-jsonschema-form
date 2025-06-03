import type { Schema, UiSchemaRoot } from "@sjsf/form";
import type { Sample } from "@/core/index.js";

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

const schema: Schema = {
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
};

const uiSchema: UiSchemaRoot = {
  "ui:options": {
    order: [
      "preset",
      "collapseIndexes",
      "joinPrimitiveArrayValues",
      "combineArraysOfObjects",
      "stabilizeOrderOfPropertiesInArraysOfObjects",
      "proportionalSizeAdjustmentThreshold",
      "cornerCellValue",
      "transform",
      "horizontalReflect",
      "verticalReflect",
      "transpose",
      "format",
      "asciiFormat",
      "paginate",
      "createOnOpen",
    ],
  },
};

export default {
  resolver: "compat",
  schema,
  uiSchema,
  initialValue: {
    preset: TransformPreset.Default,
    transform: false,
    format: OutputFormat.HTML,
    paginate: false,
    createOnOpen: true,
  },
} satisfies Sample;
