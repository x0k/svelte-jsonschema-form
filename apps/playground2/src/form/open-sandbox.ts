import {
  createSandboxFiles,
  type CustomComponentSources,
} from "meta/playground";
import { sandboxOpen, type SandboxPlatform } from "meta/sandbox";

import type { FormState } from "meta/playground";

import markdownDescriptionSource from "./custom-form-components/markdown-description.svelte?raw";
import transparentLayoutSource from "./custom-form-components/transparent-layout.svelte?raw";

export interface SandboxOptions {
  formState: FormState;
  platform: SandboxPlatform;
}

const componentSources: CustomComponentSources = {
  markdownDescription: markdownDescriptionSource,
  transparentLayout: transparentLayoutSource,
};

export async function openSandbox({ formState, platform }: SandboxOptions) {
  const { name, files } = createSandboxFiles(formState, componentSources);
  await sandboxOpen({ name, platform, files });
}
