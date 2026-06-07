import { defineAddon, defineAddonOptions, type SelectQuestion } from "sv";
import {
  isLabTheme,
  themeOrSubThemeTitle,
  validatorTitle,
  iconSets,
  iconSetTitle,
  isThemeExtension,
  themeExtensionOrigin,
  isLabValidator,
  toTheme,
  FIELD_VALIDATION_FLAGS,
} from "meta";
import {
  codegenSvelteKitIntegrations,
  codegenThemeOrSubTheme,
  codegenValidators,
  createForm,
  createValidator,
  isEndsWithPrecompiled,
  withoutPrecompiledSuffix,
  type CodegenSvelteKitIntegration,
  type CodegenThemeOrSubTheme,
  type FieldsValidationMode,
  type FormDefinition,
  type Schema,
  type UiSchemaRoot,
  type ValidatorDefinition,
} from "meta/codegen";
import type * as _uiSchemaAugmentation from "meta/playground";

import packageJson from "../package.json" with { type: "json" };
import { createPrinter } from "./sv-utils.js";

const ADDON_ID = packageJson.name;

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

export function* validatorOptions() {
  for (const value of codegenValidators()) {
    const withoutSuffix = withoutPrecompiledSuffix(value);
    const title = validatorTitle(withoutSuffix);
    yield {
      value,
      label: isEndsWithPrecompiled(value) ? `${title} (precompiled)` : title,
      hint: isLabValidator(withoutSuffix) ? "experimental" : undefined,
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

// WARN: DO NOT DESTRUCTURE
export const createOptions = (options: AddonSetupOptions) =>
  defineAddonOptions()
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
    .add("validatorWithSuffix", {
      question: "Select a validation engine",
      type: "select",
      default: "ajv8",
      options: Array.from(validatorOptions()),
    })
    .add("sveltekit", {
      question: "Enable SvelteKit integration?",
      type: "select",
      default: "no" satisfies CodegenSvelteKitIntegration,
      options: Array.from(svelteKitIntegrationOptions()),
      condition: () => options.isKit,
    })
    .add("demo", {
      type: "boolean",
      default: true,
      question: "Do you want to include a demo?",
    })
    .build();

type Addon = ReturnType<
  typeof defineAddon<typeof ADDON_ID, ReturnType<typeof createOptions>>
>;

type Workspace = Parameters<Addon["run"]>[0];

export type AddonOptions = Workspace["options"];

export type Context = Workspace & {
  isTs: boolean;
  ts: (content: string, alt?: string) => string;
  js: (content: string, alt?: string) => string;
  lib: (path: string) => string;
  validator: ValidatorDefinition;
  form: FormDefinition;
};

export interface AddonSetupOptions {
  isKit: boolean;
}

export function createContext(ws: Workspace): Context {
  const { language, directory, isKit } = ws;
  const isTs = language === "ts";
  const [ts, js] = createPrinter(isTs, !isTs);
  const lib = (path: string) => `${isKit ? "$lib" : directory.lib}/${path}`;
  const validator = createValidator({
    ...ws.options,
    isTs,
    lib,
    modelName: POST_MODEL_NAME,
  });
  const form = createForm({
    ...ws.options,
    disabled: false,
    isTs,
    modelName: POST_MODEL_NAME,
    validator,
  });
  return {
    ...ws,
    isTs,
    ts: ts!,
    js: js!,
    lib,
    validator,
    form,
  };
}

export const POST_MODEL_NAME = "post";

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
