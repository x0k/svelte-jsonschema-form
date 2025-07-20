import { isObject } from "@sjsf/form/lib/object";
import type {
  CompatibleComponentType,
  Schema,
  UiSchema,
  UiSchemaRoot,
} from "@sjsf/form";

import { Theme, type WidgetType } from "$lib/sjsf/theme.js";
import { NodeType } from "$lib/builder/index.js";

import { WIDGET_NAMES } from "./model.js";

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
    [NodeType.Tags]: {
      properties: {
        widget: {
          enum: [
            "tagsWidget",
          ] satisfies CompatibleComponentType<"tagsWidget">[],
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
    [NodeType.Tags]: {
      properties: {
        widget: {
          enum: [
            "tagsWidget",
          ] satisfies CompatibleComponentType<"tagsWidget">[],
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

export const THEME_MISSING_FIELDS: Record<Theme, Set<NodeType>> = {
  [Theme.Basic]: new Set([NodeType.Tags]),
  [Theme.Daisy5]: new Set([NodeType.Tags]),
  [Theme.Flowbite3]: new Set([]),
  [Theme.Skeleton3]: new Set([]),
  [Theme.Shadcn4]: new Set([NodeType.Tags]),
};

export const THEME_APP_CSS: Record<Theme, string> = {
  [Theme.Basic]: "",
  [Theme.Daisy5]: '@source "../node_modules/@sjsf/daisyui5-theme/dist";',
  [Theme.Flowbite3]: '@source "../node_modules/@sjsf/flowbite3-theme/dist";',
  [Theme.Skeleton3]: '@source "../node_modules/@sjsf/skeleton3-theme/dist";',
  [Theme.Shadcn4]: '@source "../node_modules/@sjsf/shadcn4-theme/dist";',
};
