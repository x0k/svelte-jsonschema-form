import {
  isLabTheme,
  themeOrSubThemeTitle,
  iconSets,
  iconSetTitle,
  isThemeExtension,
  themeExtensionOrigin,
  isLabValidator,
  toTheme,
  FIELD_VALIDATION_FLAGS,
  type Generated,
  type SvelteKitProject,
  resolveSvelteKitProject,
} from "meta";
import {
  kitPathFactory,
  codegenSvelteKitIntegrations,
  codegenThemeOrSubTheme,
  codegenValidators,
  createForm,
  createValidator,
  type CodegenSvelteKitIntegration,
  type CodegenThemeOrSubTheme,
  type FieldsValidationMode,
  type FormDefinition,
  type PathFactory,
  type Schema,
  type UiSchemaRoot,
  type ValidatorDefinition,
} from "meta/codegen";
import type * as _uiSchemaAugmentation from "meta/playground";
import {
  defineAddon,
  defineAddonOptions,
  type OptionValues,
  type SelectQuestion,
} from "sv";

import packageJson from "../package.json" with { type: "json" };
import { createPrinter, defineDemoPage, type DemoPage } from "./sv-utils.js";

const _ADDON_ID = packageJson.name;

type SelectOption = SelectQuestion<string>["options"][number];

const SVELTE_KIT_INTEGRATION_META: Record<
  CodegenSvelteKitIntegration,
  { label: string; experimental?: true }
> = {
  no: { label: "No" },
  formActions: { label: "Form Actions" },
  remoteFunctions: { label: "Remote Functions", experimental: true },
};

function* svelteKitIntegrationOptions() {
  for (const value of codegenSvelteKitIntegrations()) {
    const { label, experimental } = SVELTE_KIT_INTEGRATION_META[value];
    yield {
      value,
      label,
      hint: experimental && "experimental",
    } satisfies SelectOption;
  }
}

export function* themeOrSubThemeOptions() {
  for (const themeOrSubTheme of codegenThemeOrSubTheme()) {
    const theme = toTheme(themeOrSubTheme);
    const hint = isLabTheme(theme) ? `experimental` : undefined;
    const title = themeOrSubThemeTitle(themeOrSubTheme);
    yield {
      label: isThemeExtension(theme)
        ? `${themeOrSubThemeTitle(themeExtensionOrigin(theme))} & ${title}`
        : title,
      value: themeOrSubTheme,
      hint,
    } satisfies SelectOption;
  }
}

export function* svValidators() {
  for (const validator of codegenValidators()) {
    if (validator.draft2020) {
      continue;
    }
    yield validator;
  }
}

export type SvValidator = Generated<typeof svValidators>;

export function* validatorOptions() {
  for (const validator of svValidators()) {
    let title: string = validator.name;
    if (validator.draft2020) {
      title = `${title} (2020-12)`;
    }
    if (validator.precompiled) {
      title = `${title} (precompiled)`;
    }
    yield {
      value: JSON.stringify(validator),
      label: title,
      hint: isLabValidator(validator.name) ? "experimental" : undefined,
    } satisfies SelectOption;
  }
}

export function* iconOptions() {
  yield {
    value: "none",
    label: "None",
  } as const;
  for (const i of iconSets()) {
    yield {
      value: i,
      label: iconSetTitle(i),
    } as const;
  }
}

export const addonOptions = defineAddonOptions()
  .add("themeOrSubTheme", {
    question: "Select a theme (or sub-theme)",
    type: "select",
    default: "basic" satisfies CodegenThemeOrSubTheme,
    options: Array.from(themeOrSubThemeOptions()),
  })
  .add("icons", {
    question: "Choose an icon set",
    type: "select",
    default: "none",
    options: Array.from(iconOptions()),
  })
  .add("validator", {
    question: "Select a validation engine",
    type: "select",
    default: JSON.stringify({
      name: "ajv8",
      precompiled: false,
      draft2020: false,
    } satisfies SvValidator),
    options: Array.from(validatorOptions()),
  })
  .add("sveltekit", {
    question: "Enable SvelteKit integration?",
    type: "select",
    default: "no" satisfies CodegenSvelteKitIntegration,
    options: Array.from(svelteKitIntegrationOptions()),
  })
  .add("demo", {
    type: "boolean",
    default: true,
    question: "Do you want to include a demo?",
  })
  .build();

type Addon = ReturnType<
  typeof defineAddon<typeof _ADDON_ID, typeof addonOptions>
>;

type Workspace = Parameters<Addon["run"]>[0];

export type ContextOptions = Omit<
  OptionValues<typeof addonOptions>,
  "validator"
> & {
  validator: SvValidator;
};

export type Context = Omit<Workspace, "options"> & {
  options: ContextOptions;
  isTs: boolean;
  ts: (content: string, alt?: string) => string;
  js: (content: string, alt?: string) => string;
  lib: PathFactory;
  /** SvelteKit 3 project shape, generated code targets Kit 3 only */
  kit: SvelteKitProject;
  validator: ValidatorDefinition;
  form: FormDefinition;
  /** demo route wiring, `undefined` for non-SvelteKit projects */
  demoPage: DemoPage | undefined;
};

export interface AddonSetupOptions {
  isKit: boolean;
}

export function createContext(ws: Workspace): Context {
  const { language, file, directory, isKit } = ws;
  const isTs = language === "ts";
  const [ts, js] = createPrinter(isTs, !isTs);
  const options: ContextOptions = {
    ...ws.options,
    validator: JSON.parse(ws.options.validator),
  };
  const kit = resolveSvelteKitProject();
  const lib: PathFactory = isKit
    ? kitPathFactory
    : (path) =>
        file.getRelative({
          from: `${directory.kitRoutes}/sjsf.svelte`,
          to: `${directory.lib}/${path}`,
        });
  const validator = createValidator({
    ...options,
    isTs,
    lib,
    modelName: POST_MODEL_NAME,
  });
  const form = createForm({
    ...options,
    disabled: false,
    omitExtraData: false,
    isTs,
    modelName: POST_MODEL_NAME,
    validator,
    sveltekitPackage: kit.pkg,
  });
  return {
    ...ws,
    options,
    isTs,
    ts: ts!,
    js: js!,
    lib,
    kit,
    validator,
    form,
    demoPage: isKit
      ? defineDemoPage(DEMO_NAME, ws.language, directory.kitRoutes)
      : undefined,
  };
}

export const POST_MODEL_NAME = "post";

/** name of the add-on demo route, also used as the `DemoLinks` entry name */
export const DEMO_NAME = "sjsf";

export const POST_MODEL_DIR = `/${POST_MODEL_NAME}/`;

export const POST_SCHEMA = {
  title: "Post",
  type: "object",
  properties: {
    title: {
      title: "Title",
      type: "string",
    },
    content: {
      title: "Content",
      type: "string",
      minLength: 10,
    },
  },
  required: ["title", "content"],
} satisfies Schema;

export const POST_ZOD_SCHEMA = `import * as z from "zod";

export default z.object({
  title: z.string(),
  content: z.string().min(10),
})`;

export const POST_VALIBOT_SCHEMA = `import * as v from "valibot";

export default v.object({
  title: v.string(),
  content: v.pipe(v.string(), v.minLength(10)),
})`;

export const POST_UI_SCHEMA = {
  content: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
  },
} satisfies UiSchemaRoot;

export const POST_INITIAL_VALUE = { title: "New post", content: "" };

export const POST_FIELDS_VALIDATION_MODE: FieldsValidationMode =
  FIELD_VALIDATION_FLAGS.ON_INPUT | FIELD_VALIDATION_FLAGS.ON_CHANGE;

export const POST_EXTRA_WIDGETS = ["textarea"] as const;
