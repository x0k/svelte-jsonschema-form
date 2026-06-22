import type { UiSchema } from "@sjsf/form";

import { createComposer } from "../composer/index.ts";
import type { ExtraFieldFileName } from "../fields.ts";
import type {
  PlaygroundTheme,
  PlaygroundIconSet,
} from "../playground/index.ts";
import { type Theme, toTheme } from "../themes.ts";
import { WIDGETS } from "../widgets.generated.ts";
import {
  isThemeBaseWidget,
  widgetFileName,
  type ExtraWidgetFileNames,
} from "../widgets.ts";
import type { WidgetType } from "../widgets.ts";
import type { BuilderValidator2 } from "./model.ts";

export interface BuilderSandboxOptions {
  name: string;
  theme: PlaygroundTheme;
  validator: BuilderValidator2;
  schema: string;
  uiSchema: UiSchema;
  icons: PlaygroundIconSet;
  widgets: WidgetType[];
  fields: ExtraFieldFileName[];
}

export async function createSandboxFiles({
  name,
  theme,
  validator,
  schema,
  uiSchema,
  icons,
  widgets,
  fields,
}: BuilderSandboxOptions): Promise<Record<string, string>> {
  const actualTheme = toTheme(theme as Theme);
  const themeWidgets = WIDGETS[actualTheme];

  const extraWidgets: ExtraWidgetFileNames[Theme][] = [];
  for (const widgetType of widgets) {
    if (
      !isThemeBaseWidget(actualTheme, widgetType) &&
      widgetType in themeWidgets.extraWidgets
    ) {
      const fileName = widgetFileName(actualTheme, widgetType);
      extraWidgets.push(fileName as ExtraWidgetFileNames[Theme]);
    }
  }

  return createComposer({
    name,
    language: "ts",
    themeOrSubTheme: theme,
    icons,
    validator,
    sveltekit: "no",
    widgets: extraWidgets,
    fields,
    extraFiles: {},
    extraDependencies: [],
    codeTransformers: [],
    modelName: "model",
    schema: schema,
    uiSchema,
    initialValue: undefined,
    fieldsValidationMode: 0,
    merger: {},
    uiOptionsRegistry: {},
    moduleAugmentation: {},
    themeExtension: [],
    omitExtraData: false,
    focusOnFirstError: true,
    disabled: false,
  });
}
