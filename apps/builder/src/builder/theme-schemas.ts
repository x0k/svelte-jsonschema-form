import type { CompatibleComponentType, Schema, UiSchemaRoot } from "@sjsf/form";

import { NodeType, type AbstractNode, type Node } from "$lib/builder/index.js";
import { Theme } from "$lib/sjsf.js";

function constant<T>(data: T) {
  return () => data;
}

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
  },
  [Theme.Daisy5]: {},
  [Theme.Flowbite3]: {},
  [Theme.Skeleton3]: {},
  [Theme.Shadcn4]: {},
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
