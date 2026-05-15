import { EXTRA_WIDGETS } from "./widgets.generated.ts";

import { themePackage, type Theme } from "./themes.ts";

type ExtraWidgets = typeof EXTRA_WIDGETS;

export type ExtraWidgetFileNames = {
  [T in Theme]: keyof ExtraWidgets[T] & string;
};

export function themeExtraWidgets<T extends Theme>(
  theme: T,
): Iterable<ExtraWidgetFileNames[T]> {
  return Object.keys(EXTRA_WIDGETS[theme]) as Iterable<ExtraWidgetFileNames[T]>;
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
