<script lang="ts" module>
  import { Input as StdfInput } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfNumber?: SvelteComponentProps<typeof StdfInput>;
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
  }: ComponentProps["numberWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));
</script>

<div {id}>
  <StdfInput
    type="number"
    bind:value={
      () => (value === undefined ? "" : String(value)),
      (v) => (value = v === "" ? undefined : Number(v))
    }
    {...uiOptionProps("stdfNumber")(
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
