import type {
  CompatibleComponentType,
  ComponentProps,
  ComponentType,
  Schema,
  UiSchema,
  UiSchemaRoot,
} from "@sjsf/form";

import { NodeType } from "$lib/builder/index.js";
import { Theme } from "$lib/sjsf.js";
import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";
import { isObject } from "@sjsf/form/lib/object";

export const THEME_SCHEMAS: Record<Theme, { [T in NodeType]?: Schema }> = {
  [Theme.Basic]: {
    [NodeType.Enum]: {
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    },
    [NodeType.MultiEnum]: {
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    },
    [NodeType.String]: {
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    },
    [NodeType.Number]: {
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    },
    [NodeType.Boolean]: {
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    },
    [NodeType.File]: {
      properties: {
        widget: {
          enum: [
            "fileWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    },
  },
  [Theme.Daisy5]: {
    [NodeType.Enum]: {
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
            "filterRadioButtonsWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    },
    [NodeType.MultiEnum]: {
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    },
    [NodeType.String]: {
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
            "pikadayDatePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    },
    [NodeType.Number]: {
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
            "ratingWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    },
    [NodeType.Boolean]: {
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    },
    [NodeType.File]: {
      properties: {
        widget: {
          enum: [
            "fileWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    },
  },
  [Theme.Flowbite3]: {
    [NodeType.Enum]: {
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    },
    [NodeType.MultiEnum]: {
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    },
    [NodeType.String]: {
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    },
    [NodeType.Number]: {
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    },
    [NodeType.Boolean]: {
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    },
    [NodeType.File]: {
      properties: {
        widget: {
          enum: [
            "fileWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    },
  },
  [Theme.Skeleton3]: {
    [NodeType.Enum]: {
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    },
    [NodeType.MultiEnum]: {
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    },
    [NodeType.String]: {
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    },
    [NodeType.Number]: {
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
            "sliderWidget",
            "ratingWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    },
    [NodeType.Boolean]: {
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    },
    [NodeType.File]: {
      properties: {
        widget: {
          enum: [
            "fileWidget",
            "fileUploadWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    },
  },
  [Theme.Shadcn4]: {
    [NodeType.Enum]: {
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "comboboxWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    },
    [NodeType.MultiEnum]: {
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    },
    [NodeType.String]: {
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    },
    [NodeType.Number]: {
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    },
    [NodeType.Boolean]: {
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    },
    [NodeType.File]: {
      properties: {
        widget: {
          enum: [
            "fileWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    },
  },
};

export type WidgetType = {
  [T in ComponentType]: ComponentProps[T] extends WidgetCommonProps<any>
    ? T
    : never;
}[ComponentType];

export const WIDGET_NAMES: Record<WidgetType, string> = {
  textWidget: "Text input",
  numberWidget: "Number input",
  selectWidget: "Select",
  checkboxWidget: "Checkbox",
  fileWidget: "File input",
  checkboxesWidget: "Checkboxes",
  tagsWidget: "Tags",
  datePickerWidget: "Date picker",
  multiSelectWidget: "Multi Select",
  radioWidget: "Radio group",
  sliderWidget: "Slider",
  rangeWidget: "Range",
  textareaWidget: "Textarea",
  radioButtonsWidget: "Radio buttons",
  ratingWidget: "Rating",
  switchWidget: "Switch",
  comboboxWidget: "Combobox",
  filterRadioButtonsWidget: "Radio buttons 2",
  pikadayDatePickerWidget: "Pikaday date picker",
  fileUploadWidget: "Drop zone",
};

export const THEME_UI_SCHEMAS: Record<
  Theme,
  {
    [T in NodeType]?: UiSchemaRoot;
  }
> = {
  [Theme.Basic]: schemasToEnumNames(THEME_SCHEMAS[Theme.Basic]),
  [Theme.Daisy5]: schemasToEnumNames(THEME_SCHEMAS[Theme.Daisy5]),
  [Theme.Flowbite3]: schemasToEnumNames(THEME_SCHEMAS[Theme.Flowbite3]),
  [Theme.Skeleton3]: schemasToEnumNames(THEME_SCHEMAS[Theme.Skeleton3]),
  [Theme.Shadcn4]: schemasToEnumNames(THEME_SCHEMAS[Theme.Shadcn4]),
};

function schemaToEnumNames(schema: Schema): UiSchema | undefined {
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
        enumNames: widget.enum.map((v) => WIDGET_NAMES[v as WidgetType]),
      },
    },
  };
}

function schemasToEnumNames(schemas: Partial<Record<NodeType, Schema>>) {
  const map = new Map<NodeType, UiSchema>();
  for (const [type, schema] of Object.entries(schemas)) {
    const uiSchema = schemaToEnumNames(schema);
    if (uiSchema === undefined) {
      continue;
    }
    map.set(type as NodeType, uiSchema);
  }
  return Object.fromEntries(map);
}
