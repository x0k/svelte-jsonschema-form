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
  isThemeWithSubThemes,
  themeSubThemes,
  themes,
  isLegacyTheme,
  toTheme,
} from "meta";
import {
  codegenThemeOrSubTheme,
  codegenValidators,
  svelteKitIntegrations,
  withoutPrecompiledSuffix,
  type CodegenThemeOrSubTheme,
  type SvelteKitIntegration,
} from "meta/codegen";

import packageJson from "../package.json" with { type: "json" };
import { createPrinter } from "./sv-utils.js";

const ADDON_ID = packageJson.name;

type SelectOption = SelectQuestion<string>["options"][number];

const SVELTE_KIT_INTEGRATION_META: Record<
  SvelteKitIntegration,
  { label: string; experimental?: true }
> = {
  no: { label: "No" },
  formActions: { label: "Form Actions" },
  remoteFunctions: { label: "Remote Functions", experimental: true },
};

function* svelteKitIntegrationOptions() {
  for (const value of svelteKitIntegrations()) {
    const { label, experimental } = SVELTE_KIT_INTEGRATION_META[value];
    yield {
      value,
      label,
      hint: experimental && "experimental",
    } satisfies SelectOption;
  }
}

export function* themeOrSubThemeOptions() {
  for (const t of codegenThemeOrSubTheme()) {
    const theme = toTheme(t);
    const hint = isLabTheme(theme) ? `experimental` : undefined;
    yield {
      label: isThemeExtension(theme)
        ? `${themeOrSubThemeTitle(themeExtensionOrigin(theme))} & ${themeOrSubThemeTitle(t)}`
        : themeOrSubThemeTitle(t),
      value: t,
      hint,
    } satisfies SelectOption;
  }
}

export function* validatorOptions() {
  for (const value of codegenValidators()) {
    const withoutSuffix = withoutPrecompiledSuffix(value);
    yield {
      value,
      label: validatorTitle(withoutSuffix),
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
      default: "no" satisfies SvelteKitIntegration,
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
};

export interface AddonSetupOptions {
  isKit: boolean;
}

export function createContext(ws: Workspace): Context {
  const { language, directory, isKit } = ws;
  const isTs = language === "ts";
  const [ts, js] = createPrinter(isTs, !isTs);
  return {
    ...ws,
    isTs,
    ts: ts!,
    js: js!,
    lib: (path) => `${isKit ? "$lib" : directory.lib}/${path}`,
  };
}

export const POST_JSON_SCHEMA_PATH = `/post/schema.json`;
