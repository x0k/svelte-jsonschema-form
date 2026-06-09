import { createSandboxFiles } from "meta/playground";
import { sandboxOpen, type SandboxPlatform } from "meta/sandbox";

import type { CustomComponents, FormState } from "meta/playground";

import markdownDescriptionSource from "./custom-form-components/markdown-description.svelte?raw";
import transparentLayoutSource from "./custom-form-components/transparent-layout.svelte?raw";

export interface SandboxOptions {
  formState: FormState;
  platform: SandboxPlatform;
}

const customComponents: CustomComponents = {
  markdownDescription: markdownDescriptionSource,
  transparentLayout: transparentLayoutSource,
};

export async function openSandbox({ formState, platform }: SandboxOptions) {
  const name = `Playground (${formState.theme}, ${formState.validator})`;
  const files = createSandboxFiles({ name, customComponents, formState });
  await sandboxOpen({
    name,
    platform,
    files,
  });
}
