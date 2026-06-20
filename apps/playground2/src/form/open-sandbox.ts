import {
  createSandboxFiles,
  type CustomComponents,
  type NormalizedFormState,
} from "meta/playground";
import { sandboxOpen, type SandboxPlatform } from "meta/sandbox";

import markdownDescriptionSource from "./custom-form-components/markdown-description.svelte?raw";
import transparentLayoutSource from "./custom-form-components/transparent-layout.svelte?raw";

export interface SandboxOptions {
  formState: NormalizedFormState;
  platform: SandboxPlatform;
}

const customComponents: CustomComponents = {
  markdownDescription: markdownDescriptionSource,
  transparentLayout: transparentLayoutSource,
};

export async function openSandbox({ formState, platform }: SandboxOptions) {
  const name = `Playground (${formState.theme}, ${formState.validator})`;
  const files = await createSandboxFiles({ name, customComponents, formState });
  await sandboxOpen({
    name,
    platform,
    files,
  });
}
