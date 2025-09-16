import type { Schema, UiSchema } from "@sjsf/form";

import { Icons, ICONS_PEER_DEPS } from "$lib/sjsf/icons.js";
import type { Resolver } from "$lib/sjsf/resolver.js";
import {
  Theme,
  THEME_OPTIONAL_DEPS,
  THEME_PEER_DEPS,
  type WidgetType,
} from "$lib/sjsf/theme.js";
import { VALIDATOR_PEER_DEPS, type Validator } from "$lib/sjsf/validators.js";

import {
  EPHEMERAL_WIDGET_IMPORTS,
  isBaseWidget,
  isEphemeralField,
  isEphemeralWidget,
  WIDGET_EXTRA_FIELD,
  type EphemeralWidgetType,
  type EphemeralFieldType,
  type ExtraWidgetType,
  EXTRA_WIDGET_IMPORTS,
  EPHEMERAL_WIDGET_DEFINITIONS,
  type FileFieldMode,
  fileFieldModeToFields,
  EPHEMERAL_FIELD_VALUE_TYPES,
  type ArrayAssertType,
  type AssertType,
  EPHEMERA_FIELD_ASSERT_TYPE,
  isArrayAssertType,
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

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

export function join(...args: (string | boolean)[]) {
  return args.filter(Boolean).join("\n");
}

function join2(...args: (string | boolean)[]) {
  return args.filter(Boolean).join("\n\n");
}

function declareModule(props: string[], bindings: string[]) {
  return `declare module "@sjsf/form" {
  interface ComponentProps {
    ${props.join("\n    ")}
  }
  interface ComponentBindings {
    ${bindings.join("\n    ")}
  }
}`;
}

const CORE_FORM_TYPES = ["SchemaArrayValue"] as const;
type CoreFormType = (typeof CORE_FORM_TYPES)[number];

const DIRECT_FORM_TYPES = [
  "FieldCommonProps",
  "SchemaValue",
  "ComponentDefinition",
] as const;
type DirectFormTypes = (typeof DIRECT_FORM_TYPES)[number];

const WIDGETS_FORM_TYPES = ["WidgetCommonProps", "Options"] as const;
type WidgetsFormType = (typeof WIDGETS_FORM_TYPES)[number];

const FORM_TYPES = [
  ...CORE_FORM_TYPES,
  ...DIRECT_FORM_TYPES,
  ...WIDGETS_FORM_TYPES,
];

type FormType = CoreFormType | DirectFormTypes | WidgetsFormType;

function defineTypeImports(formTypes: Set<FormType>) {
  if (formTypes.size === 0) {
    return "";
  }
  const present = (t: FormType) => formTypes.has(t);
  const imports = {
    "form/core": CORE_FORM_TYPES.filter(present),
    form: DIRECT_FORM_TYPES.filter(present),
    "form/fields/widgets": WIDGETS_FORM_TYPES.filter(present),
  };
  return Object.entries(imports)
    .filter((e) => e[1].length > 0)
    .map(
      ([k, types]) => `import type {
  ${types.join(",\n  ")}
} from "@sjsf/${k}";`
    )
    .join("\n");
}

function createDefinition(definition: string) {
  const imports = new Set<FormType>();
  if (definition.length === 0) {
    return {
      definition,
      imports,
    };
  }
  for (const t of FORM_TYPES) {
    if (definition.includes(t)) {
      imports.add(t);
    }
  }
  return {
    definition,
    imports,
  };
}

const ASSERTS: Record<AssertType, string> = {
  file:
    `function assertFile(v: unknown): asserts v is File | undefined {
  if (v !== undefined && !(v instanceof File)) {
    throw new Error(
      ` +
    '`expected "undefined" or "File" type, but got "${typeof v}"`' +
    `
    );
  }
}`,
};

const ARRAY_ASSERTS: Record<ArrayAssertType, string> = {
  strings: `const assertStrings: ArrayAssert<string> = createArrayAssert(
  "string",
  (v: SchemaValue): v is string => typeof v === "string"
);`,
  files: `const assertFiles: ArrayAssert<File> = createArrayAssert(
  "File",
  (v): v is File => v instanceof File
);`,
};

function defineEphemeralFields(ephemeralFields: Set<EphemeralFieldType>) {
  if (ephemeralFields.size === 0) {
    return createDefinition("");
  }
  const fields = Array.from(ephemeralFields);
  const asserts: AssertType[] = [];
  const arrayAsserts: ArrayAssertType[] = [];
  for (const f of fields) {
    const assertType = EPHEMERA_FIELD_ASSERT_TYPE[f];
    if (isArrayAssertType(assertType)) {
      arrayAsserts.push(assertType);
    } else {
      asserts.push(assertType);
    }
  }
  return createDefinition(
    join2(
      arrayAsserts.length > 0 &&
        `type ArrayAssert<T extends SchemaValue> = (
  arr: SchemaArrayValue | null | undefined
) => asserts arr is T[] | undefined;

function createArrayAssert<T extends SchemaValue>(
  itemName: string,
  isItem: (v: SchemaValue) => v is T
): ArrayAssert<T> {
  return (arr) => {
    if (arr?.some((item) => item === undefined || !isItem(item))) {
      throw new TypeError(` +
          '`expected "${itemName}[]" or "undefined"`' +
          `);
    }
  };
}`,
      ...arrayAsserts.map((a) => ARRAY_ASSERTS[a]),
      ...asserts.map((a) => ASSERTS[a]),
      ...fields.map(
        (f) => `const ${f}FieldWrapper = cast(${f}Field, {
  value: {
    transform(props) {
      assert${capitalize(EPHEMERA_FIELD_ASSERT_TYPE[f])}(props.value);
      return props.value;
    },
  },
}) satisfies ComponentDefinition<"arrayField">;`
      ),
      declareModule(
        fields.map(
          (f) =>
            `${f}FieldWrapper: FieldCommonProps<${EPHEMERAL_FIELD_VALUE_TYPES[f]}>;`
        ),
        fields.map((f) => `${f}FieldWrapper: "value";`)
      )
    )
  );
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
  const ephemeralFieldTypes = new Set<EphemeralFieldType>();
  const extraWidgetTypes: ExtraWidgetType[] = [];
  const ephemeralWidgetTypes: EphemeralWidgetType[] = [];
  for (const w of widgets) {
    if (!isBaseWidget(w)) {
      if (isEphemeralWidget(w)) {
        ephemeralWidgetTypes.push(w);
      } else {
        extraWidgetTypes.push(w);
      }
    }
    const fields = fileFieldModeToFields(fileFieldMode);
    const f = WIDGET_EXTRA_FIELD[w];
    if (f !== undefined) {
      fields.push(f);
    }
    for (const f of fields) {
      if (isEphemeralField(f)) {
        ephemeralFieldTypes.add(f);
      } else {
        extraFields.add(f);
      }
    }
  }

  const hasEphemeral =
    ephemeralWidgetTypes.length > 0 || ephemeralFieldTypes.size > 0;

  const ephemeralFields = defineEphemeralFields(ephemeralFieldTypes);
  const ephemeralWidgets = createDefinition(
    ephemeralWidgetTypes.length > 0
      ? declareModule(
          ephemeralWidgetTypes.map(
            (w) => `${w}: ${EPHEMERAL_WIDGET_DEFINITIONS[w]};`
          ),
          ephemeralWidgetTypes.map((w) => `${w}: "value";`)
        )
      : ""
  );

  const themeExport = hasEphemeral
    ? `export const theme = extendByRecord(base, {
  ${[
    ...Array.from(ephemeralFieldTypes).map((f) => `${f}FieldWrapper`),
    ...ephemeralWidgetTypes,
  ].join(",\n  ")}
})`
    : "";

  const iconsExport =
    Icons.None === icons
      ? false
      : `export { icons } from "@sjsf/${icons}-icons";`;

  return join2(
    defineTypeImports(ephemeralFields.imports.union(ephemeralWidgets.imports)),
    join(
      hasEphemeral &&
        'import { extendByRecord } from "@sjsf/form/lib/resolver";',
      ephemeralFieldTypes.size > 0 &&
        'import { cast } from "@sjsf/form/lib/component";'
    ),
    join(
      `export { resolver } from "@sjsf/form/resolvers/${resolver}";`,
      ...Array.from(extraFields).map(
        (f) =>
          `import "@sjsf/form/fields/extra-fields/${camelToKebabCase(f)}-include";`
      ),
      ...Array.from(ephemeralFieldTypes).map(
        (f) =>
          `import ${f}Field from "@sjsf/form/fields/extra-fields/${camelToKebabCase(f)}.svelte";`
      )
    ),
    ephemeralFields.definition,
    join(
      `${hasEphemeral ? "import { theme as base" : "export { theme"} } from "@sjsf/${theme}-theme";`,
      ...extraWidgetTypes.map(
        (w) =>
          `import "@sjsf/${theme}-theme/extra-widgets/${EXTRA_WIDGET_IMPORTS[w]}-include";`
      ),
      ...ephemeralWidgetTypes.map(
        (w) =>
          `import ${w} from "@sjsf/${theme}-theme/extra-widgets/${EPHEMERAL_WIDGET_IMPORTS[w]}.svelte";`
      )
    ),
    ephemeralWidgets.definition,
    themeExport,
    iconsExport,
    'export { translation } from "@sjsf/form/translations/en";',
    `export { createFormValidator as createValidator } from "@sjsf/${validator}-validator";`,
    `export { createFormMerger as createMerger } from "@sjsf/form/mergers/modern";`
  );
}

export interface FormDotSvelteOptions {
  theme: Theme;
  schema: Schema;
  uiSchema: UiSchema | undefined;
}

export function buildFormDotSvelte({
  theme,
  schema,
  uiSchema = {},
}: FormDotSvelteOptions): string {
  const isShadcn = theme === Theme.Shadcn4;
  const schemaLines = JSON.stringify(schema, null, 2).split("\n");
  const uiSchemaLines = JSON.stringify(uiSchema, null, 2).split("\n");
  return join(
    `<script lang="ts">
  import { createForm, BasicForm, type Schema, type UiSchemaRoot } from "@sjsf/form";`,
    isShadcn &&
      `  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";`,
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
    `</script>`
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
  let cmd = `npm i @sjsf/form @sjsf/${theme}-theme @sjsf/${validator}-validator`;
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
