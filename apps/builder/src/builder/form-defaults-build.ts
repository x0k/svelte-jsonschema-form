import { Icons } from "$lib/sjsf/icons.js";
import type { Resolver } from "$lib/sjsf/resolver.js";
import type { Theme } from "$lib/sjsf/theme.js";
import type { Validator } from "$lib/sjsf/validators.js";

import {
  EPHEMERAL_WIDGET_IMPORTS,
  isBaseWidget,
  isEphemeralField,
  isEphemeralWidget,
  WIDGET_EXTRA_FIELDS,
  type EphemeralWidgetType,
  type EphemeralFieldType,
  type ExtraWidgetType,
  type WidgetType,
  EXTRA_WIDGET_IMPORTS,
  EPHEMERAL_WIDGET_DEFINITIONS,
} from "./model.js";

export interface FormDefaultsOptions {
  widgets: Set<WidgetType>;
  resolver: Resolver;
  theme: Theme;
  icons: Icons;
  validator: Validator;
}

function join(...args: (string | boolean)[]) {
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

function defineEphemeralFields(ephemeralFields: Set<EphemeralFieldType>) {
  if (ephemeralFields.size === 0) {
    return createDefinition("");
  }
  const fields = Array.from(ephemeralFields);
  return createDefinition(
    join2(
      `function assertStrings(
  arr: SchemaArrayValue | undefined
): asserts arr is string[] | undefined {
  if (
    arr !== undefined &&
    arr.find((item) => {
      return item !== undefined && typeof item !== "string";
    })
  ) {
    throw new TypeError("expected array of strings");
  }
}`,
      ...fields.map(
        (f) => `const ${f}FieldWrapper = cast(${f}Field, {
  value: {
    transform(props) {
      assertStrings(props.value);
      return props.value;
    },
  },
}) satisfies ComponentDefinition<"arrayField">;`
      ),
      declareModule(
        fields.map(
          (f) => `${f}FieldWrapper: FieldCommonProps<SchemaArrayValue>;`
        ),
        fields.map((f) => `${f}FieldWrapper: "value";`)
      )
    )
  );
}

function defineEphemeralWidgets(ephemeralWidgets: EphemeralWidgetType[]) {
  if (ephemeralWidgets.length === 0) {
    return createDefinition("");
  }
  return createDefinition(
    declareModule(
      ephemeralWidgets.map((w) => `${w}: ${EPHEMERAL_WIDGET_DEFINITIONS[w]};`),
      ephemeralWidgets.map((w) => `${w}: "value";`)
    )
  );
}

export function buildFormDefaults(options: FormDefaultsOptions): string {
  const extraFields = new Set<string>();
  const ephemeralFields = new Set<EphemeralFieldType>();
  const extraWidgets: ExtraWidgetType[] = [];
  const ephemeralWidgets: EphemeralWidgetType[] = [];
  for (const w of options.widgets) {
    if (!isBaseWidget(w)) {
      if (isEphemeralWidget(w)) {
        ephemeralWidgets.push(w);
      } else {
        extraWidgets.push(w);
      }
    }
    for (const f of WIDGET_EXTRA_FIELDS[w]) {
      if (isEphemeralField(f)) {
        ephemeralFields.add(f);
      } else {
        extraFields.add(f);
      }
    }
  }

  const hasEphemeral = ephemeralWidgets.length > 0 || ephemeralFields.size > 0;

  const ephemeralFieldsDefinition = defineEphemeralFields(ephemeralFields);
  const ephemeralWidgetsDefinition = defineEphemeralWidgets(ephemeralWidgets);

  const themeExport = hasEphemeral
    ? `export const theme = extendByRecord(base, {
  ${[
    ...Array.from(ephemeralFields).map((f) => `${f}FieldWrapper`),
    ...ephemeralWidgets,
  ].join(",\n  ")}
})`
    : "";

  const iconsExport =
    Icons.None === options.icons
      ? ""
      : `export { icons } from "@sjsf/${options.icons}-icons";\n`;

  return join2(
    defineTypeImports(
      ephemeralFieldsDefinition.imports.union(
        ephemeralWidgetsDefinition.imports
      )
    ),
    join(
      hasEphemeral &&
        'import { extendByRecord } from "@sjsf/form/lib/resolver";',
      ephemeralFields.size > 0 &&
        'import { cast } from "@sjsf/form/lib/component";'
    ),
    join(
      `export { resolver } from "@sjsf/form/resolvers/${options.resolver}";`,
      ...Array.from(extraFields).map(
        (f) => `import "@sjsf/form/fields/extra-fields/${f}-include";`
      ),
      ...Array.from(ephemeralFields).map(
        (f) =>
          `import ${f}Field from "@sjsf/form/fields/extra-fields/${f}.svelte";`
      )
    ),
    ephemeralFieldsDefinition.definition,
    join(
      `${hasEphemeral ? "import { theme as base" : "export { theme"} } from "@sjsf/${options.theme}-theme";`,
      ...extraWidgets.map(
        (w) =>
          `import "@sjsf/${options.theme}-theme/extra-widgets/${EXTRA_WIDGET_IMPORTS[w]}-include";`
      ),
      ...ephemeralWidgets.map(
        (w) =>
          `import ${w} from "@sjsf/${options.theme}-theme/extra-widgets/${EPHEMERAL_WIDGET_IMPORTS[w]}.svelte";`
      )
    ),
    ephemeralWidgetsDefinition.definition,
    themeExport,
    'export { translation } from "@sjsf/form/translations/en";',
    iconsExport,
    `import { createFormValidator } from "@sjsf/${options.validator}-validator";

export const validator = createFormValidator();`
  );
}
