import { isEndsWith2020, type FormState } from "meta/playground";
import { defineLayer, projectOpen, ProjectPlatform } from "meta/composer";
import { toast } from "svelte-sonner";

function createPlaygroundLayer({ schema }: FormState) {
  const pageSvelte = `<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import * as defaults from "$lib/form-defaults";

  const schema = ${JSON.stringify(schema, null, 2)} as const satisfies Schema;

  const form = createForm({
    ...defaults,
    schema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />`;
  return defineLayer({
    package: {
      name: "playground",
    },
    files: {
      "src/routes/+page.svelte": pageSvelte,
    },
  });
}

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
    name: "Playground",
    platform: platform,
    theme,
    validator,
    svelteKitIntegration: undefined,
    content: [Promise.resolve({ default: createPlaygroundLayer(formState) })],
  });
}
