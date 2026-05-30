import {
  isEndsWith2020,
  without2020Suffix,
  type FormState,
} from "meta/playground";
import { projectOpen, ProjectPlatform } from "meta/composer";
import { toast } from "svelte-sonner";

import { createSandboxLayer } from "./create-sandbox-layer";

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
    name: "Sandbox",
    platform: platform,
    theme,
    validator,
    svelteKitIntegration: undefined,
    content: [
      Promise.resolve({
        default: createSandboxLayer({
          ...formState,
          validator: without2020Suffix(validator),
        }),
      }),
    ],
  });
}
