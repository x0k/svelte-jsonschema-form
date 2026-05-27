import { WIDGETS } from "./widgets.generated.ts";

import { themePackage, type Theme } from "./themes.ts";

type Widgets = typeof WIDGETS;

export type WidgetFileNames = {
  [T in Theme]: keyof Widgets[T]["widgets"] & string;
};

export type ExtraWidgetFileNames = {
  [T in Theme]: keyof Widgets[T]["extraWidgets"] & string;
};

export type WidgetTypes = {
  [T in Theme]:
    | Widgets[T]["widgets"][WidgetFileNames[T]]
    | Widgets[T]["extraWidgets"][ExtraWidgetFileNames[T]];
};

// export function themeExtraWidgets<T extends Theme>(
//   theme: T,
// ): Iterable<ExtraWidgetFileNames[T]> {
//   return Object.keys(WIDGETS[theme]["extraWidgets"]) as Iterable<
//     ExtraWidgetFileNames[T]
//   >;
// }

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
