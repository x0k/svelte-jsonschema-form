import { isObject } from "@sjsf/form/lib/object";
import type { CompatibleComponentType, Schema, UiSchemaRoot } from "@sjsf/form";
import type { PlaygroundTheme } from "meta/playground";
import { WIDGET_NAMES, type WidgetType } from "meta/builder";

import { constant } from "$lib/function.js";
import {
  NodeType,
  RangeValueType,
  type AbstractNode,
  type CustomizableNodeType,
  type Node,
  type NodeOverridesMap
} from "$lib/builder/index.js";

type Factory<T extends NodeType, R> = (node: Extract<Node, AbstractNode<T>>) => R;

type Factories<R> = { [T in NodeType]?: Factory<T, R> };

const basicThemeSchema: Factories<Schema> = {
  [NodeType.Enum]: constant({
    properties: {
      widget: {
        enum: ["selectWidget", "radioWidget"] satisfies CompatibleComponentType<"selectWidget">[]
      }
    }
  }),
  [NodeType.MultiEnum]: constant({
    properties: {
      widget: {
        enum: [
          "checkboxesWidget",
          "multiSelectWidget"
        ] satisfies CompatibleComponentType<"checkboxesWidget">[]
      }
    }
  }),
  [NodeType.String]: constant({
    properties: {
      widget: {
        enum: [
          "textWidget",
          "textareaWidget",
          "datePickerWidget"
        ] satisfies CompatibleComponentType<"textWidget">[]
      }
    }
  }),
  [NodeType.Number]: constant({
    properties: {
      widget: {
        enum: ["numberWidget", "rangeWidget"] satisfies CompatibleComponentType<"numberWidget">[]
      }
    }
  }),
  [NodeType.Boolean]: constant({
    properties: {
      widget: {
        enum: ["checkboxWidget"] satisfies CompatibleComponentType<"checkboxWidget">[]
      }
    }
  }),
  [NodeType.File]: constant({
    properties: {
      widget: {
        enum: ["fileWidget"] satisfies CompatibleComponentType<"fileWidget">[]
      }
    }
  })
};

export const THEME_SCHEMAS: Record<PlaygroundTheme, Factories<Schema>> = {
  basic: basicThemeSchema,
  pico: basicThemeSchema,
  daisyui5: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
            "daisyui5FilterRadioButtonsWidget"
          ] satisfies CompatibleComponentType<"selectWidget">[]
        }
      }
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget"
          ] satisfies CompatibleComponentType<"checkboxesWidget">[]
        }
      }
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
            "daisyui5CallyDatePickerWidget"
          ] satisfies CompatibleComponentType<"textWidget">[]
        }
      }
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
            "ratingWidget"
          ] satisfies CompatibleComponentType<"numberWidget">[]
        }
      }
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget"
          ] satisfies CompatibleComponentType<"checkboxWidget">[]
        }
      }
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: ["fileWidget"] satisfies CompatibleComponentType<"fileWidget">[]
        }
      }
    })
  },
  flowbite3: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
            "flowbite3ToggleRadioButtonsWidget"
          ] satisfies CompatibleComponentType<"selectWidget">[]
        }
      }
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget"
          ] satisfies CompatibleComponentType<"checkboxesWidget">[]
        }
      }
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget"
          ] satisfies CompatibleComponentType<"textWidget">[]
        }
      }
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: ["numberWidget", "rangeWidget"] satisfies CompatibleComponentType<"numberWidget">[]
        }
      }
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget"
          ] satisfies CompatibleComponentType<"checkboxWidget">[]
        }
      }
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: ["fileWidget"] satisfies CompatibleComponentType<"fileWidget">[]
        }
      }
    }),
    [NodeType.Tags]: constant({
      properties: {
        widget: {
          enum: ["tagsWidget"] satisfies CompatibleComponentType<"tagsWidget">[]
        }
      }
    }),
    [NodeType.Range]: (node) => ({
      properties: {
        widget: {
          [RangeValueType.String]: {
            enum: [
              "dateRangePickerWidget"
            ] satisfies CompatibleComponentType<"dateRangePickerWidget">[]
          } satisfies Schema,
          [RangeValueType.Number]: {} satisfies Schema
        }[node.valueType]
      }
    })
  },
  skeleton4: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
            "comboboxWidget"
          ] satisfies CompatibleComponentType<"selectWidget">[]
        }
      }
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget"
          ] satisfies CompatibleComponentType<"checkboxesWidget">[]
        }
      }
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget"
          ] satisfies CompatibleComponentType<"textWidget">[]
        }
      }
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
            "skeleton4SliderWidget",
            "ratingWidget"
          ] satisfies CompatibleComponentType<"numberWidget">[]
        }
      }
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget"
          ] satisfies CompatibleComponentType<"checkboxWidget">[]
        }
      }
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: [
            "fileWidget",
            "skeleton4FileUploadWidget"
          ] satisfies CompatibleComponentType<"fileWidget">[]
        }
      }
    }),
    [NodeType.Tags]: constant({
      properties: {
        widget: {
          enum: ["tagsWidget"] satisfies CompatibleComponentType<"tagsWidget">[]
        }
      }
    }),
    [NodeType.Range]: (node) => ({
      properties: {
        widget: {
          enum: {
            [RangeValueType.String]: [
              "dateRangePickerWidget"
            ] satisfies CompatibleComponentType<"dateRangePickerWidget">[],
            [RangeValueType.Number]: [
              "rangeSliderWidget"
            ] satisfies CompatibleComponentType<"rangeSliderWidget">[]
          }[node.valueType]
        }
      }
    })
  },
  shadcn4: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "comboboxWidget"
          ] satisfies CompatibleComponentType<"selectWidget">[]
        }
      }
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget"
          ] satisfies CompatibleComponentType<"checkboxesWidget">[]
        }
      }
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget"
          ] satisfies CompatibleComponentType<"textWidget">[]
        }
      }
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: ["numberWidget", "rangeWidget"] satisfies CompatibleComponentType<"numberWidget">[]
        }
      }
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget"
          ] satisfies CompatibleComponentType<"checkboxWidget">[]
        }
      }
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: ["fileWidget"] satisfies CompatibleComponentType<"fileWidget">[]
        }
      }
    }),
    [NodeType.Range]: (node) => ({
      properties: {
        widget: {
          enum: {
            [RangeValueType.String]: [
              "dateRangePickerWidget"
            ] satisfies CompatibleComponentType<"dateRangePickerWidget">[],
            [RangeValueType.Number]: [
              "rangeSliderWidget"
            ] satisfies CompatibleComponentType<"rangeSliderWidget">[]
          }[node.valueType]
        }
      }
    })
  },
  svar: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
            "comboboxWidget"
          ] satisfies CompatibleComponentType<"selectWidget">[]
        }
      }
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget"
          ] satisfies CompatibleComponentType<"checkboxesWidget">[]
        }
      }
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
            "svarColorPickerWidget",
            "svarColorSelectWidget"
          ] satisfies CompatibleComponentType<"textWidget">[]
        }
      }
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: ["numberWidget", "rangeWidget"] satisfies CompatibleComponentType<"numberWidget">[]
        }
      }
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget"
          ] satisfies CompatibleComponentType<"checkboxWidget">[]
        }
      }
    }),
    [NodeType.Range]: (node) => ({
      properties: {
        widget: {
          [RangeValueType.String]: {
            enum: [
              "dateRangePickerWidget"
            ] satisfies CompatibleComponentType<"dateRangePickerWidget">[]
          },
          [RangeValueType.Number]: {}
        }[node.valueType]
      }
    })
  },
  beercss: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: ["selectWidget", "radioWidget"] satisfies CompatibleComponentType<"selectWidget">[]
        }
      }
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: ["checkboxesWidget"] satisfies CompatibleComponentType<"checkboxesWidget">[]
        }
      }
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget"
          ] satisfies CompatibleComponentType<"textWidget">[]
        }
      }
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: ["numberWidget", "rangeWidget"] satisfies CompatibleComponentType<"numberWidget">[]
        }
      }
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget"
          ] satisfies CompatibleComponentType<"checkboxWidget">[]
        }
      }
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: ["fileWidget"] satisfies CompatibleComponentType<"fileWidget">[]
        }
      }
    })
  },
  "shadcn-extras": {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "comboboxWidget"
          ] satisfies CompatibleComponentType<"selectWidget">[]
        }
      }
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget"
          ] satisfies CompatibleComponentType<"checkboxesWidget">[]
        }
      }
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
            "shadcnExtrasIPv4AddressInputWidget",
            "shadcnExtrasNLPDateInputWidget",
            "shadcnExtrasPasswordWidget",
            "shadcnExtrasPhoneInputWidget"
          ] satisfies CompatibleComponentType<"textWidget">[]
        }
      }
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
            "shadcnExtrasStarRatingWidget"
          ] satisfies CompatibleComponentType<"numberWidget">[]
        }
      }
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget"
          ] satisfies CompatibleComponentType<"checkboxWidget">[]
        }
      }
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: [
            "fileWidget",
            "shadcnExtrasFileDropZoneWidget"
          ] satisfies CompatibleComponentType<"fileWidget">[]
        }
      }
    }),
    [NodeType.Tags]: constant({
      properties: {
        widget: {
          enum: ["shadcnExtrasTagsInputWidget"] satisfies CompatibleComponentType<"tagsWidget">[]
        }
      }
    }),
    [NodeType.Range]: (node) => ({
      properties: {
        widget: {
          enum: {
            [RangeValueType.String]: [
              "dateRangePickerWidget"
            ] satisfies CompatibleComponentType<"dateRangePickerWidget">[],
            [RangeValueType.Number]: [
              "rangeSliderWidget"
            ] satisfies CompatibleComponentType<"rangeSliderWidget">[]
          }[node.valueType]
        }
      }
    })
  }
};

export const THEME_UI_SCHEMAS: Record<PlaygroundTheme, Factories<UiSchemaRoot | undefined>> = {
  basic: schemasToEnumNames(THEME_SCHEMAS.basic),
  pico: schemasToEnumNames(THEME_SCHEMAS.pico),
  daisyui5: schemasToEnumNames(THEME_SCHEMAS.daisyui5),
  flowbite3: schemasToEnumNames(THEME_SCHEMAS.flowbite3),
  skeleton4: schemasToEnumNames(THEME_SCHEMAS.skeleton4),
  shadcn4: schemasToEnumNames(THEME_SCHEMAS.shadcn4),
  svar: schemasToEnumNames(THEME_SCHEMAS.svar),
  beercss: schemasToEnumNames(THEME_SCHEMAS.beercss),
  "shadcn-extras": schemasToEnumNames(THEME_SCHEMAS["shadcn-extras"])
};

function schemasToEnumNames(schemas: Factories<Schema>) {
  const result: Factories<UiSchemaRoot | undefined> = {};
  for (const [type, schema] of Object.entries(schemas)) {
    const uiSchema = schemaToEnumNames(schema as never);
    result[type as NodeType] = uiSchema;
  }
  return result;
}

function schemaToEnumNames<T extends NodeType>(factory: Factory<T, Schema>) {
  return (node: Extract<Node, AbstractNode<T>>): UiSchemaRoot | undefined => {
    const schema = factory(node);
    const widget = schema.properties?.widget;
    if (
      widget === undefined ||
      !isObject(widget) ||
      widget.enum === undefined ||
      widget.enum.some((v) => typeof v !== "string" || !(v in WIDGET_NAMES))
    ) {
      return undefined;
    }
    return {
      widget: {
        "ui:options": {
          enumNames: widget.enum.map((v) => WIDGET_NAMES[v as WidgetType])
        }
      }
    };
  };
}

const BASIC_THEME_CUSTOMIZABLE_NODE_TYPES = [
  NodeType.Object,
  NodeType.Grid,
  NodeType.Array,
  NodeType.Enum,
  NodeType.MultiEnum,
  NodeType.String,
  NodeType.Number,
  NodeType.Boolean,
  NodeType.File
] satisfies CustomizableNodeType[];

export const THEME_CUSTOMIZABLE_NODE_TYPES: Record<PlaygroundTheme, CustomizableNodeType[]> = {
  basic: BASIC_THEME_CUSTOMIZABLE_NODE_TYPES,
  pico: BASIC_THEME_CUSTOMIZABLE_NODE_TYPES,
  daisyui5: BASIC_THEME_CUSTOMIZABLE_NODE_TYPES,
  flowbite3: [...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES, NodeType.Tags, NodeType.Range],
  skeleton4: [...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES, NodeType.Tags, NodeType.Range],
  shadcn4: [...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES, NodeType.Range],
  svar: [...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES.filter((t) => t !== NodeType.File), NodeType.Range],
  beercss: BASIC_THEME_CUSTOMIZABLE_NODE_TYPES,
  "shadcn-extras": [...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES, NodeType.Tags, NodeType.Range]
};

export const THEME_RANGE_VALUE_TYPES: Record<PlaygroundTheme, RangeValueType[]> = {
  basic: [],
  pico: [],
  daisyui5: [],
  flowbite3: [RangeValueType.String],
  skeleton4: [RangeValueType.String, RangeValueType.Number],
  shadcn4: [RangeValueType.String, RangeValueType.Number],
  svar: [RangeValueType.String],
  beercss: [],
  "shadcn-extras": [RangeValueType.String, RangeValueType.Number]
};

export const THEME_NODE_OVERRIDES: Record<PlaygroundTheme, NodeOverridesMap> = {
  basic: {},
  pico: {},
  daisyui5: {},
  flowbite3: {},
  skeleton4: {},
  shadcn4: {},
  svar: {},
  beercss: {},
  "shadcn-extras": {
    [NodeType.Tags]: { widget: "shadcnExtrasTagsInputWidget" }
  }
};
