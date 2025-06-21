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
  import { rootKeys, STEP_KEY } from "./model";

  const meta = createMeta<ActionData, PageData>().form;

  const rootIds = new Set(rootKeys.map((l) => pathToId([l])));
  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        rootIds.has(config.id)
          ? {
              "object-property": {
                get style(): string {
                  return `display: ${
                    // NOTE: Remember that each call to form.value causes a new
                    // form state snapshot to be created.
                    // If performance is critical for you, use:
                    // ```ts
                    // import type { FormInternalContext } from "@sjsf/form";
                    // import type { Value } from "./model";
                    // ...
                    // const stateRef = (
                    //   form.context as FormInternalContext<
                    //     typeof defaults.validator
                    //   >
                    // ).value as Value;
                    // ```
                    // and `stateRef.step`
                    config.id.endsWith(form.value?.[STEP_KEY]!)
                      ? "block"
                      : "none"
                  }`;
                },
              },
            }
          : undefined,
    }),
  });
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
