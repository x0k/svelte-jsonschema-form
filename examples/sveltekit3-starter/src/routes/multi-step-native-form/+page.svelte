<script lang="ts">
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
    getValue,
  } from "@sjsf/form";
  import { isRecord } from "@sjsf/form/lib/object";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit3/client";

  import * as defaults from "#lib/sjsf/defaults.js";

  import type { ActionData, PageData } from "./$types.js";
  import { STEP_KEY } from "./model.js";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        config.path.length === 1
          ? {
              "object-property": {
                get style(): string {
                  return `display: ${
                    config.path[0] === step ? "block" : "none"
                  }`;
                },
              },
            }
          : undefined,
    }),
  });
  // `getValue` returns the live form value, so this derived tracks only the
  // properties it reads. The style getter then reruns when `step` changes,
  // not when unrelated fields change.
  const step = $derived.by(() => {
    const value = getValue(form);
    return isRecord(value) ? value[STEP_KEY] : undefined;
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
