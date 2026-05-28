import { WIDGETS } from "../widgets.generated.ts";
import { isThemeExtension, themeExtensionOrigin, toTheme } from "../themes.ts";
import type { PlaygroundTheme } from "../playground/themes.ts";
import {
  WIDGET_NODE_TYPE,
  WIDGET_RANGE_VALUE_TYPE,
} from "./widget-node-type.ts";
import type { WidgetType } from "./widget-names.ts";
import { NodeType, RangeValueType } from "./node-types.ts";
import type { CustomizableNodeType } from "./node-types-full.ts";
import { BASE_CUSTOMIZABLE_NODE_TYPES } from "./customizable-node-types.ts";

export function themeWidgetAvailability(theme: PlaygroundTheme) {
  const actualTheme = toTheme(theme);
  const libMeta = WIDGETS[actualTheme];

  let allWidgetNames: WidgetType[];

  if (isThemeExtension(actualTheme)) {
    const origin = themeExtensionOrigin(actualTheme);
    const originMeta = WIDGETS[origin];
    allWidgetNames = [
      ...Object.values(originMeta.widgets),
      ...Object.values(originMeta.extraWidgets),
      ...Object.values(libMeta.extraWidgets),
    ];
  } else {
    allWidgetNames = [
      ...Object.values(libMeta.widgets),
      ...Object.values(libMeta.extraWidgets),
    ];
  }

  const result: Partial<Record<NodeType, WidgetType[]>> = {};
  for (const widgetName of allWidgetNames) {
    const nodeType = WIDGET_NODE_TYPE[widgetName];
    if (nodeType === undefined) continue;
    (result[nodeType] ??= []).push(widgetName);
  }

  return result;
}

export function themeCustomizableNodeTypes(
  theme: PlaygroundTheme,
): CustomizableNodeType[] {
  const avail = themeWidgetAvailability(theme);
  const types = [...BASE_CUSTOMIZABLE_NODE_TYPES];

  if (avail[NodeType.Tags]?.length) types.push(NodeType.Tags);
  if (avail[NodeType.Range]?.length) types.push(NodeType.Range);
  if (!avail[NodeType.File]?.length) {
    const idx = types.indexOf(NodeType.File);
    if (idx >= 0) types.splice(idx, 1);
  }

  return types;
}

export function themeRangeValueTypes(theme: PlaygroundTheme): RangeValueType[] {
  const avail = themeWidgetAvailability(theme);
  const rangeWidgets = avail[NodeType.Range] ?? [];
  const valueTypes = new Set<RangeValueType>();
  for (const w of rangeWidgets) {
    const rvt = WIDGET_RANGE_VALUE_TYPE[w];
    if (rvt !== undefined) valueTypes.add(rvt);
  }
  return [...valueTypes];
}
