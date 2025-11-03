import type { Schema, UiSchema } from "@sjsf/form";

import { Icons, ICONS_PEER_DEPS } from "$lib/sjsf/icons.js";
import type { Resolver } from "$lib/sjsf/resolver.js";
import {
  ActualTheme,
  LabTheme,
  packageFromTheme,
  type Theme,
  THEME_OPTIONAL_DEPS,
  THEME_PEER_DEPS,
  type WidgetType,
} from "$lib/sjsf/theme.js";
import { VALIDATOR_PEER_DEPS, type Validator } from "$lib/sjsf/validators.js";

import {
  isBaseWidget,
  WIDGET_EXTRA_FIELD,
  type ExtraWidgetType,
  EXTRA_WIDGET_IMPORTS,
  type FileFieldMode,
  fileFieldModeToFields,
} from "./model.js";

export interface FormDefaultsOptions {
  widgets: Set<WidgetType>;
  resolver: Resolver;
  theme: Theme;
  icons: Icons;
  validator: Validator;
  fileFieldMode: FileFieldMode;
}

function camelToKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function join(...args: (string | boolean)[]) {
  return args.filter(Boolean).join("\n");
}

function join2(...args: (string | boolean)[]) {
  return args.filter(Boolean).join("\n\n");
}

export function buildFormDefaults({
  widgets,
  icons,
  resolver,
  theme,
  validator,
  fileFieldMode,
}: FormDefaultsOptions): string {
  const extraFields = new Set<string>();
  const extraWidgetTypes: ExtraWidgetType[] = [];
  for (const w of widgets) {
    if (!isBaseWidget(w)) {
      extraWidgetTypes.push(w);
    }
    const fields = fileFieldModeToFields(fileFieldMode);
    const widgetExtraField = WIDGET_EXTRA_FIELD[w];
    if (widgetExtraField !== undefined) {
      fields.push(widgetExtraField);
    }
    for (const f of fields) {
      extraFields.add(f);
    }
  }

  const iconsExport =
    Icons.None === icons
      ? false
      : `export { icons } from "@sjsf/${icons}-icons";`;

  return join2(
    join(
      `export { resolver } from "@sjsf/form/resolvers/${resolver}";`,
      ...Array.from(extraFields).map(
        (f) =>
          `import "@sjsf/form/fields/extra/${camelToKebabCase(f)}-include";`
      )
    ),
    join(
      `export { theme } from "${packageFromTheme(theme)}";`,
      ...extraWidgetTypes.map(
        (w) =>
          `import "${packageFromTheme(theme)}/extra-widgets/${EXTRA_WIDGET_IMPORTS[w]}-include";`
      )
    ),
    iconsExport,
    'export { translation } from "@sjsf/form/translations/en";',
    `export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/modern";`,
    `export { createFormMerger as merger } from "@sjsf/form/mergers/modern";`,
    `export { createFormValidator as validator } from "@sjsf/${validator}-validator";`
  );
}

export interface FormDotSvelteOptions {
  theme: Theme;
  schema: Schema;
  uiSchema: UiSchema | undefined;
  html5Validation: boolean;
}

export function buildFormDotSvelte({
  theme,
  schema,
  uiSchema = {},
  html5Validation,
}: FormDotSvelteOptions): string {
  const isShadcn = theme === ActualTheme.Shadcn4;
  const isSvar = theme === LabTheme.Svar;
  const schemaLines = JSON.stringify(schema, null, 2).split("\n");
  const uiSchemaLines = JSON.stringify(uiSchema, null, 2).split("\n");
  return join(
    `<script lang="ts">
  import { createForm, BasicForm, type Schema, type UiSchemaRoot } from "@sjsf/form";`,
    isShadcn &&
      `  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";`,
    isSvar && `  import { Willow } from "@svar-ui/svelte-core";`,
    `
  import * as defaults from "$lib/form/defaults.js";

  const schema = ${schemaLines.join("\n  ")} as const satisfies Schema;

  const uiSchema: UiSchemaRoot = ${uiSchemaLines.join("\n  ")}

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    onSubmit: console.log
  })`,
    isShadcn &&
      `
  setThemeContext({ components })`,
    `</script>`,
    isSvar && `<Willow>`,
    `<BasicForm {form}${html5Validation ? "" : " novalidate"} />`,
    isSvar && `</Willow>`
  );
}

export interface InstallShOptions {
  theme: Theme;
  validator: Validator;
  icons: Icons;
  widgets: Set<WidgetType>;
}

export function buildInstallSh({
  theme,
  validator,
  icons,
  widgets,
}: InstallShOptions) {
  const peer = Array.from(
    new Set(
      [
        VALIDATOR_PEER_DEPS[validator],
        THEME_PEER_DEPS[theme],
        ICONS_PEER_DEPS[icons],
      ]
        .filter(Boolean)
        .flatMap((s) => s.split(" "))
    )
  );
  let cmd = `npm i @sjsf/form ${packageFromTheme(theme)} @sjsf/${validator}-validator`;
  if (icons !== Icons.None) {
    cmd += ` @sjsf/${icons}-icons`;
  }
  const optional = Object.entries(THEME_OPTIONAL_DEPS[theme])
    .filter(([_, libWidgets]) => {
      for (const w of libWidgets) {
        if (widgets.has(w)) {
          return true;
        }
      }
      return false;
    })
    .map(([lib]) => lib);
  if (optional.length > 0) {
    cmd += ` ${optional.join(" ")}`;
  }
  return join(peer.length > 0 && `# peer deps: ${peer.join(" ")}`, cmd);
}
