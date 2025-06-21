<script lang="ts">
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
    pathToId,
  } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";
  import { steps } from "./model";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        rootPaths.has(config.id)
          ? {
              "object-property": {
                get style(): string {
                  return `display: ${
                    config.id.endsWith(form.value?.step!) ? "block" : "none"
                  }`;
                },
              },
            }
          : undefined,
    }),
  });
  const rootPaths = new Set(["step", ...steps].map((l) => pathToId([l])));
  setFormContext(form.context);
</script>

<form
  novalidate
  method="POST"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Content />
  <SubmitButton />
</form>
