import type { CompatibleComponentType, Schema, UiSchemaRoot } from "@sjsf/form";

import { NodeType, type AbstractNode, type Node } from "$lib/builder/index.js";
import { Theme } from "$lib/sjsf.js";
import { constant } from "$lib/function.js";

export const THEME_SCHEMAS: Record<
  Theme,
  { [T in NodeType]?: (node: Extract<Node, AbstractNode<T>>) => Schema }
> = {
  [Theme.Basic]: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: [
            "fileWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    }),
  },
  [Theme.Daisy5]: {
    [NodeType.Enum]: constant({
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
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    }),
    [NodeType.String]: constant({
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
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
            "ratingWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: [
            "fileWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    }),
  },
  [Theme.Flowbite3]: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: [
            "fileWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    }),
  },
  [Theme.Skeleton3]: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "radioButtonsWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    }),
    [NodeType.Number]: constant({
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
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: [
            "fileWidget",
            "fileUploadWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    }),
  },
  [Theme.Shadcn4]: {
    [NodeType.Enum]: constant({
      properties: {
        widget: {
          enum: [
            "selectWidget",
            "radioWidget",
            "comboboxWidget",
          ] satisfies CompatibleComponentType<"selectWidget">[],
        },
      },
    }),
    [NodeType.MultiEnum]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxesWidget",
            "multiSelectWidget",
          ] satisfies CompatibleComponentType<"checkboxesWidget">[],
        },
      },
    }),
    [NodeType.String]: constant({
      properties: {
        widget: {
          enum: [
            "textWidget",
            "textareaWidget",
            "datePickerWidget",
          ] satisfies CompatibleComponentType<"textWidget">[],
        },
      },
    }),
    [NodeType.Number]: constant({
      properties: {
        widget: {
          enum: [
            "numberWidget",
            "rangeWidget",
          ] satisfies CompatibleComponentType<"numberWidget">[],
        },
      },
    }),
    [NodeType.Boolean]: constant({
      properties: {
        widget: {
          enum: [
            "checkboxWidget",
            "switchWidget",
          ] satisfies CompatibleComponentType<"checkboxWidget">[],
        },
      },
    }),
    [NodeType.File]: constant({
      properties: {
        widget: {
          enum: [
            "fileWidget",
          ] satisfies CompatibleComponentType<"fileWidget">[],
        },
      },
    }),
  },
};

export const THEME_UI_SCHEMAS: Record<
  Theme,
  {
    [T in NodeType]?: (
      node: Extract<Node, AbstractNode<T>>
    ) => UiSchemaRoot | undefined;
  }
> = {
  [Theme.Basic]: {},
  [Theme.Daisy5]: {},
  [Theme.Flowbite3]: {},
  [Theme.Skeleton3]: {},
  [Theme.Shadcn4]: {},
};
