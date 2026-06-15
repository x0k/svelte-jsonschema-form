import type { Schema, UiSchemaRoot, UiOptions } from "@sjsf/form";
import {
  NodeType,
  type CustomizableNodeType,
  COMMON_OPTIONS_SCHEMA,
  OBJECT_NODE_OPTIONS_SCHEMA,
  ARRAY_NODE_OPTIONS_SCHEMA,
  GRID_NODE_OPTIONS_SCHEMA,
  ENUM_OPTIONS_SCHEMA,
  MULTI_ENUM_OPTIONS_SCHEMA,
  STRING_NODE_OPTIONS_SCHEMA,
  NUMBER_NODE_OPTIONS_SCHEMA,
  BOOLEAN_NODE_OPTIONS_SCHEMA,
  FILE_NODE_OPTIONS_SCHEMA,
  TAGS_NODE_OPTIONS_SCHEMA,
  RANGE_NODE_OPTIONS_SCHEMA,
} from "meta/builder";

import { mergeSchemas } from "$lib/json-schema.js";
import { mergeUiSchemas } from "$lib/sjsf/ui-schema.js";

export type {
  Node,
  CustomizableNode,
  CustomizableNodeType,
  NodeOverridesMap,
  WidgetNode,
  WidgetNodeType,
  PredicateNode,
  ObjectPropertyNode,
  ObjectPropertyDependencyNode,
  ObjectNode,
  ArrayNode,
  GridCell,
  GridNode,
  EnumItemNode,
  EnumNode,
  MultiEnumNode,
  BooleanNode,
  FileNode,
  TagsNode,
  OperatorNode,
  Operator,
  ContainsOperator,
  EqOperator,
  InOperator,
  UniqueItemsOperator,
  PropertyOperator,
  HasPropertyOperator,
  UOperator,
  NOperator,
  SOperator,
  ComparisonOperator,
} from "meta/builder";

export {
  CUSTOMIZABLE_TYPE_TITLES,
  CUSTOMIZABLE_TYPES,
  OBJECT_NODE_OPTIONS_SCHEMA,
  ARRAY_NODE_OPTIONS_SCHEMA,
  GRID_NODE_OPTIONS_SCHEMA,
  ENUM_OPTIONS_SCHEMA,
  MULTI_ENUM_OPTIONS_SCHEMA,
  BOOLEAN_NODE_OPTIONS_SCHEMA,
  FILE_NODE_OPTIONS_SCHEMA,
  TAGS_NODE_OPTIONS_SCHEMA,
} from "meta/builder";

export const NODE_OPTIONS_SCHEMAS: {
  [T in CustomizableNodeType]: Schema;
} = {
  [NodeType.Object]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    OBJECT_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Array]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    ARRAY_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Grid]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    GRID_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Enum]: mergeSchemas(COMMON_OPTIONS_SCHEMA, ENUM_OPTIONS_SCHEMA),
  [NodeType.MultiEnum]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    MULTI_ENUM_OPTIONS_SCHEMA
  ),
  [NodeType.String]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    STRING_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Number]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    NUMBER_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Boolean]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    BOOLEAN_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.File]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    FILE_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Tags]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    TAGS_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Range]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    RANGE_NODE_OPTIONS_SCHEMA
  ),
};

const COMMON_UI_SCHEMA: UiSchemaRoot = {
  "ui:options": {
    titleAttributes: {
      class: "font-medium text-md py-2",
    },
  },
  description: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
  },
  defaultValue: {
    "ui:options": {
      titleAttributes: {
        class: "font-medium text-md",
      },
    },
  },
  widget: {
    "ui:components": {
      stringField: "enumField",
    },
  },
};

const ORDER = Object.keys(COMMON_OPTIONS_SCHEMA.properties);

function order(...titles: string[]): UiOptions {
  return {
    order: ORDER.concat(titles),
  };
}

export const NODE_OPTIONS_UI_SCHEMAS = {
  [NodeType.Object]: COMMON_UI_SCHEMA,
  [NodeType.Array]: mergeUiSchemas(COMMON_UI_SCHEMA, {
    defaultValue: {
      items: {
        "ui:options": {
          shadcn4Text: {
            placeholder: "Input JSON value",
          },
        },
      },
    },
  }),
  [NodeType.Grid]: mergeUiSchemas(COMMON_UI_SCHEMA, {
    cellSize: {
      "ui:components": {
        stringField: "enumField",
      },
    },
    gap: {
      "ui:options": {
        shadcn4Text: {
          placeholder: "Input CSS unit",
        },
      },
    },
  }),
  [NodeType.Enum]: mergeUiSchemas(COMMON_UI_SCHEMA, {
    "ui:options": order("widget", "inline", "*"),
    defaultValue: {
      "ui:options": {
        shadcn4Text: {
          placeholder: "Input JSON value",
        },
      },
    },
  }),
  [NodeType.MultiEnum]: mergeUiSchemas(COMMON_UI_SCHEMA, {
    "ui:options": order("widget", "inline", "*"),
    defaultValue: {
      items: {
        "ui:options": {
          shadcn4Text: {
            placeholder: "Input JSON value",
          },
        },
      },
      "ui:options": {
        orderable: false,
      },
    },
  }),
  [NodeType.String]: mergeUiSchemas(COMMON_UI_SCHEMA, {
    "ui:options": order("widget", "inputType", "placeholder", "*"),
    inputType: {
      "ui:components": {
        stringField: "enumField",
      },
    },
  }),
  [NodeType.Number]: mergeUiSchemas(COMMON_UI_SCHEMA, {
    "ui:options": order("widget", "*"),
  }),
  [NodeType.Boolean]: mergeUiSchemas(COMMON_UI_SCHEMA, {
    "ui:options": order("widget", "*"),
    defaultValue: {
      "ui:components": {
        booleanField: "booleanSelectField",
        selectWidget: "radioWidget",
      },
      "ui:options": {
        useLabel: false,
        enumNames: ["true", "false"],
        shadcn4RadioGroup: {
          style: "display: flex;",
        },
      },
    },
  }),
  [NodeType.File]: mergeUiSchemas(COMMON_UI_SCHEMA, {
    "ui:options": order("widget", "native", "multiple", "*", "help"),
  }),
  [NodeType.Tags]: COMMON_UI_SCHEMA,
  [NodeType.Range]: COMMON_UI_SCHEMA,
} satisfies Record<CustomizableNodeType, UiSchemaRoot>;
