import { defineAddon, defineAddonOptions, type SelectQuestion } from "sv";
import {
  isLabTheme,
  nonLegacyThemeOrSubThemes,
  themeTitle,
  validators,
  validatorTitle,
  isJsonSchemaValidator,
  type Validator,
  type NonLegacyThemeOrSubTheme,
  iconSets,
  iconSetTitle,
} from "meta";

export const ADDON_ID = "@sjsf/sv";

const SVELTE_KIT_INTEGRATION_OPTIONS = [
  { value: "no", label: "No" },
  { value: "formActions", label: "Form Actions" },
  {
    value: "remoteFunctions",
    label: "Remote Functions",
    hint: "experimental",
  },
] as const satisfies SelectQuestion<string>["options"];

export type SvelteKitIntegrationOption =
  (typeof SVELTE_KIT_INTEGRATION_OPTIONS)[number]["value"];

export const options = defineAddonOptions()
  .add("theme", {
    question: "Theme?",
    type: "select",
    default: "basic" satisfies NonLegacyThemeOrSubTheme,
    options: nonLegacyThemeOrSubThemes().map((t) => ({
      value: t,
      label: themeTitle(t),
      hint: isLabTheme(t) ? "experimental" : undefined,
    })),
  })
  .add("shadcnExtras", {
    question: "Add `shadcn-svelte-extras` components (experimental)?",
    type: "boolean",
    default: false,
    condition: (o) => o.theme === "shadcn4",
  })
  .add("icons", {
    question: "Icons?",
    type: "select",
    default: "none",
    options: [
      {
        value: "none",
        label: "None",
      },
      ...iconSets().map((i) => ({
        value: i,
        label: iconSetTitle(i),
      })),
    ],
  })
  .add("validator", {
    question: "Validator?",
    type: "select",
    default: "ajv8" satisfies Validator,
    options: validators().map((v) => ({
      value: v,
      label: validatorTitle(v),
    })),
  })
  .add("typeInference", {
    question:
      "Add library to infer TS types from JSON schemas (json-schema-to-ts)?",
    type: "boolean",
    default: true,
    condition: (o) => isJsonSchemaValidator(o.validator),
  })
  .add("sveltekit", {
    question: "Setup SvelteKit integration?",
    type: "select",
    default: "no" satisfies SvelteKitIntegrationOption,
    options: SVELTE_KIT_INTEGRATION_OPTIONS,
  })
  .build();

type Addon = ReturnType<typeof defineAddon<typeof ADDON_ID, typeof options>>;

type Workspace = Parameters<Addon["run"]>[0];

export type Context = Workspace & {
  isTs: boolean;
  ts: (content: string, alt?: string) => string;
};
