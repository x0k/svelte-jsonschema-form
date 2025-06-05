import sdk from "@stackblitz/sdk";

import {
  Example,
  VALIDATOR_PACKAGES,
  VALIDATOR_VERSIONS,
  VALIDATORS,
  VERSION,
  type ActualTheme,
  type Validator,
} from "@/shared";

import { buildLayers, type Layer } from "./layer";

type LayerPromise = Promise<{ layer: Layer }>;

const INITIAL_FILE = "src/routes/+page.svelte";

export function openThemeStarter(theme: ActualTheme) {
  sdk.openGithubProject(
    `x0k/svelte-jsonschema-form/tree/examples-gallery/examples/${theme}-starter`,
    {
      openFile: INITIAL_FILE,
    }
  );
}

export interface ProjectOptions {
  example: Example;
  theme: ActualTheme;
  validator: Validator;
}

const VALIDATOR_LAYERS = Object.fromEntries(
  VALIDATORS.map(
    (validator) =>
      [
        validator,
        Promise.resolve({
          layer: {
            formDefaults: {
              validator,
            },
            package: {
              dependencies: {
                [VALIDATOR_PACKAGES[validator]]: VALIDATOR_VERSIONS[validator],
                [`@sjsf/${validator}-validator`]: VERSION,
              },
            },
          },
        }),
      ] as const
  )
) as Record<Validator, LayerPromise>;

const THEME_LAYERS: Record<ActualTheme, () => LayerPromise[]> = {
  basic: () => [import("./layers/basic")],
  daisyui5: () => [import("./layers/tailwind4"), import("./layers/daisyui5")],
  flowbite3: () => [import("./layers/tailwind4")],
  shadcn4: () => [import("./layers/tailwind4")],
  skeleton3: () => [import("./layers/tailwind4")],
};

const EXAMPLE_LAYERS: Record<Example, () => LayerPromise> = {
  [Example.AnimatedArray]: () => import("./examples/animated-array"),
};

export async function openProject({
  example,
  theme,
  validator,
}: ProjectOptions) {
  const layers: Awaited<LayerPromise>[] = await Promise.all([
    import("./layers/sveltekit"),
    ...THEME_LAYERS[theme](),
    VALIDATOR_LAYERS[validator],
    EXAMPLE_LAYERS[example](),
  ]);
  sdk.openProject(
    {
      title: `${example} (${theme}, ${validator})`,
      files: buildLayers(layers.map((l) => l.layer)),
      template: "node",
    },
    {
      openFile: INITIAL_FILE,
    }
  );
}
