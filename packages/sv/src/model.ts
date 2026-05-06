import { defineAddon, defineAddonOptions, type SelectQuestion } from "sv";
import {
  isLabTheme,
  themeOrSubThemeTitle,
  validators,
  validatorTitle,
  type Validator,
  type NonLegacyThemeOrSubTheme,
  iconSets,
  iconSetTitle,
  isThemeExtension,
  themeExtensionOrigin,
  type PrecompiledValidator,
  isPrecompiledOnlyValidator,
  isPrecompiledValidator,
  isLabValidator,
  isThemeWithSubThemes,
  themeSubThemes,
  themes,
  isLegacyTheme,
  precompiledValidatorSubPath,
  hyperjumpValidatorLocalizationSubPath,
  isSchemaValidator,
  zod4ValidatorVersionSubPath,
  externalValidatorPackage,
  internalValidatorSubPath,
} from "meta";

import packageJson from "../package.json" with { type: "json" };
import {
  createPrinter,
  type NamedImportOptions,
  type NamespaceImportOptions,
} from "./sv-utils.js";

const ADDON_ID = packageJson.name;

type SelectOption = SelectQuestion<string>["options"][number];

const SVELTE_KIT_INTEGRATION_OPTIONS = [
  { value: "no", label: "No" },
  { value: "formActions", label: "Form Actions" },
  {
    value: "remoteFunctions",
    label: "Remote Functions",
    hint: "experimental",
  },
] as const satisfies SelectOption[];

export type SvelteKitIntegrationOption =
  (typeof SVELTE_KIT_INTEGRATION_OPTIONS)[number]["value"];

function validatorOpt<V extends Validator>(v: V) {
  return {
    value: v,
    label: validatorTitle(v),
    hint: isLabValidator(v) ? "experimental" : undefined,
  } as const;
}

const PRECOMPILED_SUFFIX = `-precompiled`;

type WithPrecompiledSuffix<T extends string> =
  `${T}${typeof PRECOMPILED_SUFFIX}`;

function precompiledOpt<V extends PrecompiledValidator>(v: V) {
  return {
    value: `${v}${PRECOMPILED_SUFFIX}`,
    label: `${validatorTitle(v)} (precompiled)`,
    hint: isLabValidator(v) ? "experimental" : undefined,
  } as const;
}

export function isEndsWithPrecompiled(
  v: string,
): v is WithPrecompiledSuffix<string> {
  return v.endsWith(PRECOMPILED_SUFFIX);
}

export function withoutPrecompiledSuffix<V extends string>(
  v: V | WithPrecompiledSuffix<V>,
): V {
  return isEndsWithPrecompiled(v)
    ? (v.slice(0, -PRECOMPILED_SUFFIX.length) as V)
    : v;
}

function* themeOrSubThemeOptions() {
  for (const t of themes()) {
    if (isLegacyTheme(t)) {
      continue;
    }
    const hint = isLabTheme(t) ? `experimental` : undefined;
    yield {
      label: isThemeExtension(t)
        ? `${themeOrSubThemeTitle(themeExtensionOrigin(t))} & ${themeOrSubThemeTitle(t)}`
        : themeOrSubThemeTitle(t),
      value: t,
      hint,
    } satisfies SelectOption;
    if (isThemeWithSubThemes(t)) {
      for (const s of themeSubThemes(t)) {
        yield {
          label: themeOrSubThemeTitle(s),
          value: s,
          hint,
        } satisfies SelectOption;
      }
    }
  }
}

// WARN: DO NOT DESTRUCTURE
export const createOptions = (options: AddonOptions) =>
  defineAddonOptions()
    .add("themeOrSubTheme", {
      question: "Theme?",
      type: "select",
      default: "basic" satisfies NonLegacyThemeOrSubTheme,
      options: Array.from(themeOrSubThemeOptions()),
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
        ...Array.from(iconSets()).map((i) => ({
          value: i,
          label: iconSetTitle(i),
        })),
      ],
    })
    .add("validatorWithSuffix", {
      question: "Validator?",
      type: "select",
      default: "ajv8",
      options: Array.from(validators()).flatMap((v) => [
        ...(isPrecompiledOnlyValidator(v)
          ? [precompiledOpt(v)]
          : isPrecompiledValidator(v)
            ? [validatorOpt(v), precompiledOpt(v)]
            : [validatorOpt(v)]),
      ]),
    })
    .add("sveltekit", {
      question: "Setup SvelteKit integration?",
      type: "select",
      default: "no" satisfies SvelteKitIntegrationOption,
      options: SVELTE_KIT_INTEGRATION_OPTIONS,
      condition: () => options.isKit,
    })
    .build();

type Addon = ReturnType<
  typeof defineAddon<typeof ADDON_ID, ReturnType<typeof createOptions>>
>;

type Workspace = Parameters<Addon["run"]>[0];

export type Context = Workspace & {
  isTs: boolean;
  ts: (content: string, alt?: string) => string;
  js: (content: string, alt?: string) => string;
  lib: (path: string) => string;
};

export interface AddonOptions {
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

export function neverError(value: never, message: string) {
  return new Error(`${message}: ${value}`);
}

const createPostType = {
  inputType: "Post",
  sendSchema: false,
};

export function createValidator({
  options: { validatorWithSuffix },
  isTs,
  lib,
}: Context): {
  imports: (NamedImportOptions | NamespaceImportOptions)[];
  options: string;
  inputType: string;
  sendSchema: boolean;
} {
  if (isEndsWithPrecompiled(validatorWithSuffix)) {
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    const types = isTs
      ? [
          {
            imports: ["Post"],
            from: lib("post/model.generated"),
            isType: true,
          },
        ]
      : [];
    if (validator === "hyperjump") {
      return {
        ...createPostType,
        imports: [
          {
            imports: ["createFormValidatorFactory"],
            from: precompiledValidatorSubPath(validator),
          },
          {
            imports: ["localization"],
            from: hyperjumpValidatorLocalizationSubPath("en-us"),
          },
          {
            imports: ["schema", "ast"],
            from: lib("post/model.generated"),
          },
          ...types,
        ],
        options: `schema,
validator: createFormValidatorFactory({ ast, localization })`,
      };
    }
    return {
      ...createPostType,
      imports: [
        {
          imports: ["createFormValidatorFactory"],
          from: precompiledValidatorSubPath(validator),
        },
        {
          imports: ["schema"],
          from: lib("post/model.generated"),
        },
        {
          as: "validateFunctions",
          from: lib("post/validators.generated"),
        },
        ...types,
      ],
      options: `schema,
validator: createFormValidatorFactory({ validateFunctions })`,
    };
  }
  if (isSchemaValidator(validatorWithSuffix)) {
    const v = (
      {
        zod4: {
          import: {
            as: "z",
            from: "zod",
          },
          path: zod4ValidatorVersionSubPath("classic"),
          inferInput: "z.infer",
        },
        valibot: {
          import: {
            as: "v",
            from: "valibot",
          },
          path: externalValidatorPackage("valibot").name,
          inferInput: "v.InferInput",
        },
        "standard-schema": {
          import: {
            imports: ["StandardSchemaV1"],
            from: "@standard-schema/spec",
            isType: true,
          },
          path: internalValidatorSubPath("standard-schema"),
          inferInput: "StandardSchemaV1.InferInput",
        },
      } satisfies Record<
        typeof validatorWithSuffix,
        {
          import: NamedImportOptions | NamespaceImportOptions;
          path: string;
          inferInput: string;
        }
      >
    )[validatorWithSuffix];
    return {
      imports: [
        v.import,
        {
          imports: ["adapt"],
          from: v.path,
        },
        {
          imports: ["post"],
          from: lib("post"),
        },
      ],
      options: `...adapt(post)`,
      inputType: `${v.inferInput}<typeof post>`,
      sendSchema: false,
    };
  }
  return {
    ...createPostType,
    sendSchema: true,
    imports: [
      {
        imports: ["schema"],
        from: lib("post"),
      },
      ...(isTs
        ? [
            {
              imports: ["Post"],
              from: lib("post"),
              isType: true,
            },
          ]
        : []),
    ],
    options: "schema",
  };
}
