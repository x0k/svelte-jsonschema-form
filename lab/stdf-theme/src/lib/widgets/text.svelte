<script lang="ts" module>
  import { Input as StdfInput } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfText?: SvelteComponentProps<typeof StdfInput>;
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
    errors,
    handlers,
  }: ComponentProps["textWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));
</script>

<div {id}>
  <StdfInput
    bind:value={() => value ?? "", (v) => (value = v)}
    {...uiOptionProps("stdfText")(
      {
        title: config.title,
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
