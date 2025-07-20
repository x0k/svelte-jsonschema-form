import type {
  ComponentProps,
  ComponentType,
  UiOptions,
  UiSchema,
} from "@sjsf/form";
import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

import { constant } from "$lib/function.js";
import { Resolver } from "$lib/sjsf/resolver.js";
import {
  BOOLEAN_NODE_OPTIONS_SCHEMA,
  buildEnumValues,
  ENUM_OPTIONS_SCHEMA,
  FILE_NODE_OPTIONS_SCHEMA,
  MULTI_ENUM_OPTIONS_SCHEMA,
  NodeType,
  NUMBER_NODE_OPTIONS_SCHEMA,
  STRING_NODE_OPTIONS_SCHEMA,
  type AbstractNode,
  type Node,
  type TextWidgetParams,
  type WidgetNode,
  type WidgetNodeType,
} from "$lib/builder/index.js";
import { Theme, type WidgetType } from "$lib/sjsf/theme.js";

import type { BuilderDraggable } from "./context.svelte.js";
import { pickSchemaType, typeOfValue } from "@sjsf/form/core";

export interface NodeProps<T extends NodeType> {
  node: Extract<Node, AbstractNode<T>>;
  draggable: BuilderDraggable;
  showRequired: boolean;
  unmount: () => void;
}

export enum RouteName {
  Editor = "editor",
  Preview = "preview",
}

export interface AbstractRoute<N extends RouteName> {
  name: N;
}

export interface EditorRoute extends AbstractRoute<RouteName.Editor> {}

export enum PreviewSubRouteName {
  Code = "code",
  Schema = "schema",
}

export interface PreviewRoute extends AbstractRoute<RouteName.Preview> {
  subRoute?: PreviewSubRouteName;
}

export type Route = EditorRoute | PreviewRoute;

function basicTextOptions(params: TextWidgetParams): UiOptions {
  return { text: { ...params } };
}

export const TEXT_WIDGET_OPTIONS: Record<
  Theme,
  (params: TextWidgetParams) => UiOptions
> = {
  [Theme.Basic]: basicTextOptions,
  [Theme.Daisy5]: basicTextOptions,
  [Theme.Flowbite3]: (params) => ({ flowbite3Text: params }),
  [Theme.Skeleton3]: basicTextOptions,
  [Theme.Shadcn4]: (params) => ({ shadcn4Text: { ...params } }),
};

export const CHECKBOXES_WIDGET_OPTIONS: Record<
  Theme,
  (inline: boolean) => UiOptions
> = {
  [Theme.Basic]: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "display: flex; flex-direction: column; gap: 0.2rem;",
            },
          },
        },
  [Theme.Daisy5]: (inline) =>
    inline
      ? {
          layouts: {
            "field-content": {
              style: "display: flex; gap: 0.5rem;",
            },
          },
        }
      : {},
  [Theme.Flowbite3]: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "flex-direction: column; gap: 0.2rem;",
            },
          },
        },
  [Theme.Skeleton3]: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "flex-direction: column; gap: 0.2rem;",
            },
          },
        },
  [Theme.Shadcn4]: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "flex-direction: column;",
            },
          },
        },
};

export const RADIO_WIDGET_OPTIONS: Record<
  Theme,
  (inline: boolean) => UiOptions
> = {
  ...CHECKBOXES_WIDGET_OPTIONS,
  [Theme.Shadcn4]: (inline) =>
    inline
      ? {
          shadcn4RadioGroup: {
            style: "grid-auto-flow: column; grid-auto-columns: max-content;",
          },
        }
      : {},
};

export const DEFAULT_COMPONENTS: Record<
  Resolver,
  {
    [T in WidgetNodeType]: (
      node: Extract<WidgetNode, AbstractNode<T>>
    ) => UiSchema["ui:components"];
  }
> = {
  [Resolver.Basic]: {
    [NodeType.Enum]: (node) => {
      const items = buildEnumValues(node.valueType, node.items);
      const type = pickSchemaType(items.map(typeOfValue));
      return {
        [`${type}Field`]: "enumField",
      } satisfies UiSchema["ui:components"];
    },
    [NodeType.MultiEnum]: constant({
      arrayField: "multiEnumField",
    }),
    [NodeType.String]: constant(undefined),
    [NodeType.Number]: constant(undefined),
    [NodeType.Boolean]: constant(undefined),
    [NodeType.File]: (node): UiSchema["ui:components"] => {
      if (node.options.multiple) {
        return {
          arrayField: "filesFieldWrapper",
        };
      }
      return {
        stringField: "fileField",
      };
    },
    [NodeType.Tags]: constant({
      arrayField: "tagsFieldWrapper",
    }),
  },
  [Resolver.Compat]: {
    [NodeType.Enum]: constant(undefined),
    [NodeType.MultiEnum]: constant(undefined),
    [NodeType.String]: constant(undefined),
    [NodeType.Number]: constant(undefined),
    [NodeType.Boolean]: constant(undefined),
    [NodeType.File]: constant(undefined),
    [NodeType.Tags]: constant({
      arrayField: "tagsFieldWrapper",
    }),
  },
};

export const DEFAULT_WIDGETS: Record<WidgetNodeType, WidgetType> = {
  [NodeType.Enum]: ENUM_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.MultiEnum]: MULTI_ENUM_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.String]: STRING_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Number]: NUMBER_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Boolean]: BOOLEAN_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.File]: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Tags]: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default,
};

const BASE_WIDGETS = [
  "textWidget",
  "numberWidget",
  "checkboxWidget",
  "selectWidget",
] as const satisfies WidgetType[];

export type BaseWidgetType = (typeof BASE_WIDGETS)[number];

const BASE_WIDGETS_SET = new Set<WidgetType>(BASE_WIDGETS);

export function isBaseWidget(w: WidgetType): w is BaseWidgetType {
  return BASE_WIDGETS_SET.has(w);
}

const EPHEMERAL_WIDGETS = [
  "filterRadioButtonsWidget",
  "pikadayDatePickerWidget",
  "fileUploadWidget",
  "sliderWidget",
] as const satisfies WidgetType[];

export type EphemeralWidgetType = (typeof EPHEMERAL_WIDGETS)[number];

export type ExtraWidgetType = Exclude<
  WidgetType,
  BaseWidgetType | EphemeralWidgetType
>;

const EPHEMERAL_WIDGETS_SET = new Set<WidgetType>(EPHEMERAL_WIDGETS);

export function isEphemeralWidget(w: WidgetType): w is EphemeralWidgetType {
  return EPHEMERAL_WIDGETS_SET.has(w);
}

const EPHEMERAL_FIELDS = ["files", "tags"] as const;

export type EphemeralFieldType = (typeof EPHEMERAL_FIELDS)[number];

const EPHEMERAL_FIELDS_SET = new Set<string>(EPHEMERAL_FIELDS);

export function isEphemeralField(field: string): field is EphemeralFieldType {
  return EPHEMERAL_FIELDS_SET.has(field);
}

export type FileFieldMode = number;
export const FILE_FIELD_SINGLE_MODE = 1;
export const FILE_FIELD_MULTIPLE_MODE = FILE_FIELD_SINGLE_MODE << 1;

export function fileFieldModeToFields(mode: FileFieldMode): string[] {
  const fields: string[] = [];
  if (mode & FILE_FIELD_SINGLE_MODE) {
    fields.push("file");
  }
  if (mode & FILE_FIELD_MULTIPLE_MODE) {
    fields.push("files");
  }
  return fields;
}

export const WIDGET_EXTRA_FIELD: Record<WidgetType, string | undefined> = {
  textWidget: undefined,
  numberWidget: undefined,
  selectWidget: "enum",
  checkboxWidget: undefined,
  fileWidget: undefined,
  checkboxesWidget: "multi-enum",
  tagsWidget: "tags",
  datePickerWidget: undefined,
  multiSelectWidget: "multi-enum",
  radioWidget: "enum",
  sliderWidget: undefined,
  rangeWidget: undefined,
  textareaWidget: undefined,
  radioButtonsWidget: "enum",
  ratingWidget: undefined,
  switchWidget: undefined,
  comboboxWidget: "enum",
  filterRadioButtonsWidget: "enum",
  pikadayDatePickerWidget: undefined,
  fileUploadWidget: undefined,
};

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

export const WIDGET_USE_LABEL: Record<WidgetType, boolean> = {
  textWidget: true,
  numberWidget: true,
  selectWidget: true,
  checkboxWidget: true,
  fileWidget: true,
  checkboxesWidget: false,
  tagsWidget: true,
  datePickerWidget: true,
  multiSelectWidget: true,
  radioWidget: false,
  sliderWidget: true,
  rangeWidget: true,
  textareaWidget: true,
  radioButtonsWidget: false,
  ratingWidget: false,
  switchWidget: true,
  comboboxWidget: true,
  filterRadioButtonsWidget: false,
  pikadayDatePickerWidget: true,
  fileUploadWidget: true,
};

export const EXTRA_WIDGET_IMPORTS: Record<ExtraWidgetType, string> = {
  fileWidget: "file",
  checkboxesWidget: "checkboxes",
  tagsWidget: "tags",
  datePickerWidget: "date-picker",
  multiSelectWidget: "multi-select",
  radioWidget: "radio",
  rangeWidget: "range",
  textareaWidget: "textarea",
  radioButtonsWidget: "radio-buttons",
  ratingWidget: "rating",
  switchWidget: "switch",
  comboboxWidget: "combobox",
};

export const EPHEMERAL_WIDGET_IMPORTS: Record<EphemeralWidgetType, string> = {
  filterRadioButtonsWidget: "filter-radio-buttons",
  pikadayDatePickerWidget: "pikaday-date-picker",
  fileUploadWidget: "file-upload",
  sliderWidget: "slider",
};

export const EPHEMERAL_WIDGET_DEFINITIONS: Record<EphemeralWidgetType, string> =
  {
    filterRadioButtonsWidget: "WidgetCommonProps<SchemaValue> & Options",
    pikadayDatePickerWidget: "WidgetCommonProps<string>",
    fileUploadWidget: `WidgetCommonProps<FileList> & {
      multiple: boolean;
      loading: boolean;
      processing: boolean;
    }`,
    sliderWidget: "WidgetCommonProps<number>",
  };
