import { pickSchemaType, typeOfValue } from "@sjsf/form/core";
import type { UiOptions, UiSchema } from "@sjsf/form";
import type { ExtraFieldFileName } from "meta";
import type { PlaygroundResolver, PlaygroundTheme } from "meta/playground";
import { type WidgetType, NodeType } from "meta/builder";

import { constant } from "$lib/function.js";
import {
  BOOLEAN_NODE_OPTIONS_SCHEMA,
  buildEnumValues,
  ENUM_OPTIONS_SCHEMA,
  FILE_NODE_OPTIONS_SCHEMA,
  MULTI_ENUM_OPTIONS_SCHEMA,
  NUMBER_NODE_OPTIONS_SCHEMA,
  STRING_NODE_OPTIONS_SCHEMA,
  TAGS_NODE_OPTIONS_SCHEMA,
  type AbstractNode,
  type Node,
  type TextWidgetParams,
  type WidgetNode,
  type WidgetNodeType
} from "$lib/builder/index.js";

import type { BuilderDraggable } from "./context.svelte.js";

export interface NodeProps<T extends NodeType> {
  node: Extract<Node, AbstractNode<T>>;
  draggable: BuilderDraggable;
  showRequired: boolean;
  unmount: () => void;
}

export enum RouteName {
  Editor = "editor",
  Preview = "preview"
}

export interface AbstractRoute<N extends RouteName> {
  name: N;
}

export interface EditorRoute extends AbstractRoute<RouteName.Editor> {}

export enum PreviewSubRouteName {
  Code = "code",
  Schema = "schema"
}

export interface PreviewRoute extends AbstractRoute<RouteName.Preview> {
  subRoute?: PreviewSubRouteName;
}

export type Route = EditorRoute | PreviewRoute;

function basicTextOptions(params: TextWidgetParams): UiOptions {
  return { text: { ...params } };
}

export const TEXT_WIDGET_OPTIONS: Record<PlaygroundTheme, (params: TextWidgetParams) => UiOptions> =
  {
    basic: basicTextOptions,
    pico: basicTextOptions,
    daisyui5: basicTextOptions,
    flowbite3: (params) => ({ flowbite3Text: { ...params } }),
    skeleton4: basicTextOptions,
    shadcn4: (params) => ({ shadcn4Text: { ...params } }),
    svar: (params) => ({
      svarText: { placeholder: params.placeholder, type: params.type as any }
    }),
    beercss: basicTextOptions,
    "shadcn-extras": (params) => ({ shadcn4Text: { ...params } })
  };

export const CHECKBOXES_WIDGET_OPTIONS: Record<PlaygroundTheme, (inline: boolean) => UiOptions> = {
  basic: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "display: flex; flex-direction: column; gap: 0.2rem;"
            }
          }
        },
  pico: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "display: flex; flex-direction: column; gap: 0.2rem;"
            }
          }
        },
  daisyui5: (inline) =>
    inline
      ? {
          layouts: {
            "field-content": {
              style: "display: flex; gap: 0.5rem;"
            }
          }
        }
      : {},
  flowbite3: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "flex-direction: column; gap: 0.2rem;"
            }
          }
        },
  skeleton4: (inline) =>
    inline
      ? {}
      : {
          layouts: {
            "field-content": {
              style: "flex-direction: column; gap: 0.2rem;"
            }
          }
        },
  shadcn4: (inline) =>
    inline
      ? {
          layouts: {
            "field-content": {
              style: "display: flex; gap: 1rem;"
            }
          }
        }
      : {},
  svar: (inline) =>
    inline
      ? {
          svarCheckboxes: {
            type: "inline"
          }
        }
      : {},
  beercss: (inline) =>
    inline
      ? {}
      : {
          beercssCheckboxesContainer: {
            class: "vertical"
          }
        },
  "shadcn-extras": (inline) =>
    inline
      ? {
          layouts: {
            "field-content": {
              style: "display: flex; gap: 1rem;"
            }
          }
        }
      : {}
};

export const RADIO_WIDGET_OPTIONS: Record<PlaygroundTheme, (inline: boolean) => UiOptions> = {
  ...CHECKBOXES_WIDGET_OPTIONS,
  shadcn4: (inline) =>
    inline
      ? {
          shadcn4RadioGroup: {
            style: "grid-auto-flow: column; grid-auto-columns: max-content;"
          }
        }
      : {},
  svar: (inline) =>
    inline
      ? {
          svarRadio: {
            type: "inline"
          }
        }
      : {},
  beercss: (inline) =>
    inline
      ? {}
      : {
          beercssRadioContainer: {
            class: "vertical"
          }
        },
  "shadcn-extras": (inline) =>
    inline
      ? {
          shadcn4RadioGroup: {
            style: "grid-auto-flow: column; grid-auto-columns: max-content;"
          }
        }
      : {}
};

export const DEFAULT_COMPONENTS: Record<
  PlaygroundResolver,
  {
    [T in WidgetNodeType]: (
      node: Extract<WidgetNode, AbstractNode<T>>
    ) => UiSchema["ui:components"];
  }
> = {
  basic: {
    [NodeType.Enum]: (node) => {
      const items = buildEnumValues(node.valueType, node.items);
      const type = pickSchemaType(items.map(typeOfValue));
      return {
        [`${type}Field`]: "enumField"
      } satisfies UiSchema["ui:components"];
    },
    [NodeType.MultiEnum]: constant({
      arrayField: "multiEnumField"
    }),
    [NodeType.String]: constant(undefined),
    [NodeType.Number]: constant(undefined),
    [NodeType.Boolean]: constant(undefined),
    [NodeType.File]: (node): UiSchema["ui:components"] => {
      if (node.options.multiple) {
        return {
          arrayField: node.options.native ? "arrayNativeFilesField" : "arrayFilesField"
        };
      }
      return node.options.native
        ? {
            unknownField: "unknownNativeFileField"
          }
        : {
            stringField: "fileField"
          };
    },
    [NodeType.Tags]: constant({
      arrayField: "arrayTagsField"
    }),
    [NodeType.Range]: constant({
      objectField: "aggregatedField"
    })
  },
  compat: {
    [NodeType.Enum]: constant(undefined),
    [NodeType.MultiEnum]: constant(undefined),
    [NodeType.String]: constant(undefined),
    [NodeType.Number]: constant(undefined),
    [NodeType.Boolean]: constant(undefined),
    [NodeType.File]: (node): UiSchema["ui:components"] => {
      if (!node.options.native) {
        return undefined;
      }
      return node.options.multiple
        ? {
            arrayField: "arrayNativeFilesField"
          }
        : {
            unknownField: "unknownNativeFileField"
          };
    },
    [NodeType.Tags]: constant({
      arrayField: "arrayTagsField"
    }),
    [NodeType.Range]: constant({
      objectField: "aggregatedField"
    })
  }
};

export const DEFAULT_WIDGETS: Record<WidgetNodeType, WidgetType> = {
  [NodeType.Enum]: ENUM_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.MultiEnum]: MULTI_ENUM_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.String]: STRING_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Number]: NUMBER_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Boolean]: BOOLEAN_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.File]: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Tags]: TAGS_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Range]: "aggregatedWidget"
};

const BASE_WIDGETS = [
  "textWidget",
  "numberWidget",
  "checkboxWidget",
  "selectWidget"
] as const satisfies WidgetType[];

export type BaseWidgetType = (typeof BASE_WIDGETS)[number];

const BASE_WIDGETS_SET = new Set<WidgetType>(BASE_WIDGETS);

export function isBaseWidget(w: WidgetType): w is BaseWidgetType {
  return BASE_WIDGETS_SET.has(w);
}

export type FileFieldMode = number;
export const FILE_FIELD_SINGLE_MODE = 1;
export const FILE_FIELD_MULTIPLE_MODE = FILE_FIELD_SINGLE_MODE << 1;
export const FILE_FIELD_NATIVE_SINGLE_MODE = FILE_FIELD_MULTIPLE_MODE << 1;
export const FILE_FIELD_NATIVE_MULTIPLE_MODE = FILE_FIELD_NATIVE_SINGLE_MODE << 1;

export function fileFieldModeToFields(mode: FileFieldMode): ExtraFieldFileName[] {
  const fields: ExtraFieldFileName[] = [];
  if (mode & FILE_FIELD_SINGLE_MODE) {
    fields.push("file");
  }
  if (mode & FILE_FIELD_MULTIPLE_MODE) {
    fields.push("files");
  }
  if (mode & FILE_FIELD_NATIVE_SINGLE_MODE) {
    fields.push("unknown-native-file");
  }
  if (mode & FILE_FIELD_NATIVE_MULTIPLE_MODE) {
    fields.push("array-native-files");
  }
  return fields;
}

const WIDGET_USE_LABEL: Record<WidgetType, boolean | Set<PlaygroundTheme>> = {
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
  rangeWidget: true,
  textareaWidget: true,
  radioButtonsWidget: false,
  ratingWidget: false,
  switchWidget: true,
  comboboxWidget: true,
  daisyui5FilterRadioButtonsWidget: false,
  daisyui5CallyDatePickerWidget: true,
  skeleton4SliderWidget: true,
  skeleton4FileUploadWidget: true,
  flowbite3ToggleRadioButtonsWidget: false,
  aggregatedWidget: false,
  svarColorPickerWidget: true,
  svarColorSelectWidget: true,
  dateRangePickerWidget: new Set(["svar", "flowbite3"]),
  rangeSliderWidget: false,
  shadcnExtrasFileDropZoneWidget: true,
  shadcnExtrasIPv4AddressInputWidget: false,
  shadcnExtrasNLPDateInputWidget: false,
  shadcnExtrasPasswordWidget: true,
  shadcnExtrasPhoneInputWidget: true,
  shadcnExtrasStarRatingWidget: false,
  shadcnExtrasTagsInputWidget: true
};

export function getUseLabel(theme: PlaygroundTheme, widgetType: WidgetType): boolean {
  const useLabel = WIDGET_USE_LABEL[widgetType];
  if (typeof useLabel === "boolean") {
    return useLabel;
  }
  return useLabel.has(theme);
}
