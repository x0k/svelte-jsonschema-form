<script lang="ts" module>
  import { Input as StdfTextarea } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/textarea";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfTextarea?: SvelteComponentProps<typeof StdfTextarea>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    getId,
    isDisabled,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
    errors,
  }: ComponentProps["textareaWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));
</script>

<div {id}>
  <StdfTextarea
    type="textarea"
    autosize
    bind:value={() => value ?? "", (v) => (value = v)}
    {...uiOptionProps("stdfTextarea")(
      {
        readonly: config.schema.readOnly,
        disabled: isDisabled(ctx),
        state: errors.length > 0 ? "error" : "theme",
        onchange: (input) => {
          if (input) {
            handlers.oninput?.();
          } else {
            handlers.onchange?.();
          }
        },
      },
      config,
      ctx
    )}
  />
</div>
