import type { DirectoryNode, FileSystemTree } from "@webcontainer/api";
import sdk from "@stackblitz/sdk";
import lz from "lz-string";

import {
  GenericExample,
  SvelteKitExample,
  VALIDATOR_DEPENDENCIES,
  validatorPackage,
  VALIDATORS,
  ValidatorSpecificExample,
  VERSION,
  type Example,
  type Theme,
  type Validator,
} from "@/shared";

import {
  buildLayers,
  type CodeTransformer,
  type Layer,
  type LayerFiles,
} from "./layer";
import {
  schemaToZodTransform,
  schemaToValibotTransform,
} from "./schema-transform";

type LayerPromise = Promise<{ layer: Layer }>;

const INITIAL_FILE = "src/routes/+page.svelte";

export enum Platform {
  StackBlitz = "StackBlitz",
  SvelteLab = "SvelteLab",
}

export const PLATFORMS = Object.values(Platform);

export interface ProjectOptions {
  platform: Platform;
  example: Example;
  theme: Theme;
  validator: Validator;
}

const VALIDATOR_TRANSFORMERS: Partial<Record<Validator, CodeTransformer>> = {
  Zod: schemaToZodTransform,
  Valibot: schemaToValibotTransform,
};

const VALIDATOR_LAYERS = Object.fromEntries(
  VALIDATORS.map((validator) => {
    const pkg = validatorPackage(validator);
    const transform = VALIDATOR_TRANSFORMERS[validator];
    return [
      validator,
      Promise.resolve({
        layer: {
          codeTransformers: transform && [transform],
          formDefaults: {
            validator,
          },
          package: {
            dependencies: pkg
              ? {
                  [pkg]: VERSION,
                  ...VALIDATOR_DEPENDENCIES[validator],
                }
              : VALIDATOR_DEPENDENCIES[validator],
          },
        },
      }),
    ] satisfies [Validator, LayerPromise];
  })
) as Record<Validator, LayerPromise>;

const THEME_LAYERS: Record<Theme, () => LayerPromise[]> = {
  basic: () => [import("./layers/basic")],
  pico: () => [import("./layers/pico")],
  daisyui: () => [import("./layers/tailwind3"), import("./layers/daisyui")],
  daisyui5: () => [import("./layers/tailwind4"), import("./layers/daisyui5")],
  flowbite: () => [import("./layers/tailwind3"), import("./layers/flowbite")],
  flowbite3: () => [import("./layers/tailwind4"), import("./layers/flowbite3")],
  skeleton3: () => [import("./layers/tailwind4"), import("./layers/skeleton3")],
  skeleton4: () => [import("./layers/tailwind4"), import("./layers/skeleton4")],
  shadcn: () => [import("./layers/tailwind3"), import("./layers/shadcn")],
  shadcn4: () => [import("./layers/tailwind4"), import("./layers/shadcn4")],
  "shadcn-extras": () => [
    import("./layers/tailwind4"),
    import("./layers/shadcn-extras"),
  ],
  svar: () => [import("./layers/svar")],
  beercss: () => [import("./layers/beercss")],
};

const EXAMPLE_LAYERS: Record<Example, () => LayerPromise> = {
  [GenericExample.Starter]: () => import("./examples/starter"),
  [GenericExample.AnimatedArray]: () => import("./examples/animated-array"),
  [GenericExample.MarkdownDescription]: () =>
    import("./examples/markdown-description"),
  [GenericExample.TabbedLayout]: () => import("./examples/tabbed-layout"),
  [GenericExample.AsyncCombobox]: () => import("./examples/async-combobox"),
  [GenericExample.Formulas]: () => import("./examples/formulas"),
  [GenericExample.PatternPropertiesValidator]: () =>
    import("./examples/pattern-properties-validator"),
  [GenericExample.DecomposedField]: () => import("./examples/decomposed-field"),
  [GenericExample.LayoutSlots]: () => import("./examples/layout-slots"),
  [GenericExample.PreuploadFile]: () => import("./examples/preupload-file"),
  [GenericExample.OptionalDataControls]: () =>
    import("./examples/optional-data-controls"),
  [GenericExample.SchemaTransformation]: () =>
    import("./examples/schema-transformation"),
  [GenericExample.LabelOnLeft]: () => import("./examples/label-on-left"),
  [GenericExample.Draft2020]: () => import("./examples/draft-2020-12"),
  [GenericExample.MultiStep]: () => import("./examples/multi-step"),
  [GenericExample.EnumWidgets]: () => import("./examples/enum-widgets"),
  [SvelteKitExample.FormActionsWithoutJs]: () =>
    import("./examples/form-actions-without-js"),
  [SvelteKitExample.MultiStepNativeForm]: () =>
    import("./examples/multi-step-native-form"),
  [SvelteKitExample.FormActions]: () => import("./examples/form-actions"),
  [SvelteKitExample.FormActionsFlex]: () =>
    import("./examples/form-actions-flex"),
  [SvelteKitExample.FormActionsDynamicSchema]: () =>
    import("./examples/form-actions-dynamic-schema"),
  [SvelteKitExample.RemoteFunctions]: () =>
    import("./examples/remote-functions"),
  [SvelteKitExample.RemoteFunctionsEnhance]: () =>
    import("./examples/remote-functions-enhance"),
  [SvelteKitExample.RemoteFunctionsDynamicSchema]: () =>
    import("./examples/remote-functions-dynamic-schema"),
  [SvelteKitExample.RemoteFunctionsWithoutJs]: () =>
    import("./examples/remote-functions-without-js"),
  [ValidatorSpecificExample.ZodStarter]: () => import("./examples/zod-starter"),
  [ValidatorSpecificExample.ValibotStarter]: () =>
    import("./examples/valibot-starter"),
  [ValidatorSpecificExample.ArkTypeStarter]: () =>
    import("./examples/arktype-starter"),
  [ValidatorSpecificExample.TypeBoxStarter]: () =>
    import("./examples/typebox-starter"),
};

const PLATFORM_FACTORIES: Record<
  Platform,
  (options: ProjectOptions, files: LayerFiles) => void
> = {
  [Platform.StackBlitz]: ({ example, theme, validator }, files) =>
    sdk.openProject(
      {
        title: `${example} (${theme}, ${validator})`,
        files,
        template: "node",
      },
      {
        openFile: INITIAL_FILE,
      }
    ),
  [Platform.SvelteLab]: (_, files) => openSvelteLab(files),
};

export async function openProject(options: ProjectOptions) {
  const { example, theme, validator, platform } = options;
  const layers: Awaited<LayerPromise>[] = await Promise.all([
    import("./layers/sveltekit"),
    ...THEME_LAYERS[theme](),
    VALIDATOR_LAYERS[validator],
    EXAMPLE_LAYERS[example](),
  ]);
  const files = buildLayers(layers.map((l) => l.layer));
  PLATFORM_FACTORIES[platform](options, files);
}

function openSvelteLab(files: LayerFiles) {
  const encoded = lz.compressToEncodedURIComponent(
    JSON.stringify(convertToFileSystemTree(files))
  );
  const params = new URLSearchParams([["code", encoded]]);
  const url = `https://www.sveltelab.dev/#${params.toString()}`;
  window.open(url);
}

function convertToFileSystemTree(
  flatFiles: Record<string, string>
): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const [path, content] of Object.entries(flatFiles)) {
    const parts = path.split("/");
    let current = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      const dirName = parts[i];
      let dir: FileSystemTree[string] | undefined = current[dirName];
      if (dir === undefined || !("directory" in dir)) {
        dir = {
          directory: {},
        } satisfies DirectoryNode;
        current[dirName] = dir;
      }
      current = dir.directory!;
    }
    const fileName = parts[parts.length - 1];
    current[fileName] = {
      file: {
        contents: content,
      },
    };
  }
  return tree;
}
