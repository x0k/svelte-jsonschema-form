import type { UiOptions, UiSchema } from "@sjsf/form";

import { constant } from "$lib/function.js";
import { Resolver } from "$lib/sjsf/resolver.js";
import {
  BOOLEAN_NODE_OPTIONS_SCHEMA,
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
import { Theme } from "$lib/sjsf/theme.js";

import type { BuilderDraggable } from "./context.svelte.js";

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
    [NodeType.Enum]: constant({ oneOfField: "enumField" }),
    [NodeType.MultiEnum]: constant({
      arrayField: "multiEnumField",
    }),
    [NodeType.String]: constant(undefined),
    [NodeType.Number]: constant(undefined),
    [NodeType.Boolean]: constant(undefined),
    [NodeType.File]: (node): UiSchema["ui:components"] => {
      if (node.options.multiple) {
        return {
          //@ts-expect-error
          arrayField: "filesField",
        };
      }
      return {
        stringField: "fileField",
      };
    },
    //@ts-expect-error
    [NodeType.Tags]: constant({
      arrayField: "tagsField",
    }),
  },
  [Resolver.Compat]: {
    [NodeType.Enum]: constant(undefined),
    [NodeType.MultiEnum]: constant(undefined),
    [NodeType.String]: constant(undefined),
    [NodeType.Number]: constant(undefined),
    [NodeType.Boolean]: constant(undefined),
    [NodeType.File]: constant(undefined),
    //@ts-expect-error
    [NodeType.Tags]: constant({
      arrayField: "tagsField",
    }),
  },
};

export const DEFAULT_WIDGETS: Record<WidgetNodeType, string> = {
  [NodeType.Enum]: ENUM_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.MultiEnum]: MULTI_ENUM_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.String]: STRING_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Number]: NUMBER_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Boolean]: BOOLEAN_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.File]: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default,
  [NodeType.Tags]: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default,
};
