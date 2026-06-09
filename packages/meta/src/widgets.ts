import { WIDGETS } from "./widgets.generated.ts";

import { themePackage, type Theme } from "./themes.ts";

type Widgets = typeof WIDGETS;

export type WidgetFileNames = {
  [T in Theme]: keyof Widgets[T]["widgets"] & string;
};

export type ExtraWidgetFileNames = {
  [T in Theme]: keyof Widgets[T]["extraWidgets"] & string;
};

type BaseWidgetType<T extends Theme> =
  Widgets[T]["widgets"][WidgetFileNames[T]];

type ExtraWidgetType<T extends Theme> =
  Widgets[T]["extraWidgets"][ExtraWidgetFileNames[T]];

export type WidgetTypes = {
  [T in Theme]: BaseWidgetType<T> | ExtraWidgetType<T> | "aggregatedWidget";
};

export type WidgetType = WidgetTypes[Theme];

const _widgetFileNames = {} as Record<WidgetType, string>;
for (const _theme of Object.values(WIDGETS)) {
  for (const [f, t] of Object.entries(_theme.widgets)) {
    _widgetFileNames[t] = f;
  }
  for (const [f, t] of Object.entries(_theme.extraWidgets)) {
    _widgetFileNames[t] = f;
  }
}
_widgetFileNames["aggregatedWidget"] = "virtual-widget-import";

export function widgetFileName<T extends Theme>(
  _theme: T,
  widgetType: WidgetTypes[T],
) {
  return _widgetFileNames[widgetType as WidgetType] as
    | WidgetFileNames[T]
    | ExtraWidgetFileNames[T]
    | "virtual-widget-import";
}

export function isThemeBaseWidget<T extends Theme>(
  theme: T,
  widgetType: string,
): boolean {
  const widgets = WIDGETS[theme];
  for (const w of Object.values(widgets.widgets)) {
    if (widgetType === w) {
      return true;
    }
  }
  return false;
}

export function themeExtraWidgets<T extends Theme>(
  theme: T,
): Iterable<ExtraWidgetFileNames[T]> {
  return Object.keys(WIDGETS[theme]["extraWidgets"]) as Iterable<
    ExtraWidgetFileNames[T]
  >;
}

export function themeExtraWidgetSubPath<T extends Theme>(
  theme: T,
  widget: ExtraWidgetFileNames[T],
  include = false,
) {
  return `${themePackage(theme).name}/extra-widgets/${widget}${include ? "-include" : ""}`;
}

const CLIENT_SIDE_ONLY_EXTRA_WIDGETS: {
  [T in Theme]?: ExtraWidgetFileNames[T][];
} = {
  daisyui5: ["cally-date-picker"],
};

export function isThemeClientSideOnlyExtraWidget<T extends Theme>(
  theme: T,
  widget: ExtraWidgetFileNames[T],
) {
  return CLIENT_SIDE_ONLY_EXTRA_WIDGETS[theme]?.includes(widget);
}

export function* themeExtraWidgetOptionalDependencies<T extends Theme>(
  theme: T,
  widget: ExtraWidgetFileNames[T],
) {
  const deps = WIDGETS[theme].optionalDeps;
  for (const [lib, widgets] of Object.entries(deps)) {
    for (const w of widgets) {
      if (w === widget) {
        yield lib;
        break;
      }
    }
  }
}
