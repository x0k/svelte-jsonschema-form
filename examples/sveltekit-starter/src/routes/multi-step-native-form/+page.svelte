<script lang="ts">
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { isRecord } from '@sjsf/form/lib/object'
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
    getValueSnapshot,
  } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";
  import { STEP_KEY } from "./model";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        config.path.length === 1
          ? {
              "object-property": {
                get style(): string {
                  const snap = getValueSnapshot(form)
                  const step = isRecord(snap) && snap[STEP_KEY]
                  return `display: ${
                    // NOTE: Remember that each call to form.value causes a new
                    // form state snapshot to be created.
                    // If performance is critical for you can use controlled form
                    config.path[0] === step ? "block" : "none"
                  }`;
                },
              },
            }
          : undefined,
    }),
  });
  setFormContext(form);
</script>

<form
  novalidate
  method="POST"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Content />
  <SubmitButton />
</form>
