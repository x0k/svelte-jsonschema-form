import sdk from "@stackblitz/sdk";

import type { ActualTheme, Validator } from "@/shared";

import { buildLayer, mergeLayers, type Layer, type LayerFiles } from "./layer";

async function buildLayers(
  ...layers: Promise<{ layer: Layer }>[]
): Promise<LayerFiles> {
  const l = await Promise.all(layers);
  return buildLayer(l.map((l) => l.layer).reduce(mergeLayers));
}

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
  title: string;
  description?: string;
  theme: ActualTheme;
  validator: Validator;
}

export async function openProject({ title, description }: ProjectOptions) {
  const files = await buildLayers(import("./layers/sveltekit"));
  sdk.openProject(
    {
      title,
      files,
      template: "node",
      description,
    },
    {
      openFile: INITIAL_FILE,
    }
  );
}
