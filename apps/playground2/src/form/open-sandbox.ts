import {
  isEndsWith2020,
  without2020Suffix,
  type FormState,
} from "meta/playground";
import { projectOpen, ProjectPlatform } from "meta/composer";
import { toast } from "svelte-sonner";

import { createPlaygroundLayer } from "./create-playground-layer";

export interface SandboxOptions {
  formState: FormState;
  platform: ProjectPlatform;
}

export async function openSandbox({ formState, platform }: SandboxOptions) {
  const { theme, validator } = formState;

  if (isEndsWith2020(validator)) {
    toast.error(`Draft 2020-12 validators are not yet supported`);
    return;
  }

  projectOpen({
    name: `Playground (${validator}, ${theme})`,
    platform: platform,
    theme,
    validator,
    svelteKitIntegration: undefined,
    content: [
      Promise.resolve({
        default: createPlaygroundLayer({
          ...formState,
          validator: without2020Suffix(validator),
        }),
      }),
    ],
  });
}
