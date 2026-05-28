import { isObject } from "@sjsf/form/lib/object";
import type { Schema, UiSchemaRoot } from "@sjsf/form";
import type { PlaygroundTheme } from "meta/playground";
import {
  themeWidgetAvailability,
  WIDGET_RANGE_VALUE_TYPE,
  WIDGET_NAMES,
  NodeType,
  type WidgetType
} from "meta/builder";

import type { Node, NodeOverridesMap } from "$lib/builder/index.js";

export function themeNodeWidgetSchema(
  theme: PlaygroundTheme,
  nodeType: NodeType,
  node?: Node
): Schema | undefined {
  const avail = themeWidgetAvailability(theme);
  const widgets = avail[nodeType];
  if (!widgets?.length) return undefined;

  if (nodeType === NodeType.Range && node) {
    const rvt = (node as any).valueType;
    const filtered = widgets.filter((w: string) => {
      const rvtForWidget = WIDGET_RANGE_VALUE_TYPE[w as WidgetType];
      return rvtForWidget === undefined || rvtForWidget === rvt;
    });
    return filtered.length
      ? { properties: { widget: { enum: filtered } } }
      : { properties: { widget: {} } };
  }

  return { properties: { widget: { enum: widgets } } };
}

export function themeNodeWidgetUiSchema(
  theme: PlaygroundTheme,
  nodeType: NodeType,
  node?: Node
): UiSchemaRoot | undefined {
  const schema = themeNodeWidgetSchema(theme, nodeType, node);
  if (!schema) return undefined;

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
}

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
