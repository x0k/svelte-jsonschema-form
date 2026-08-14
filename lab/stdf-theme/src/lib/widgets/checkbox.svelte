<script lang="ts" module>
  import { CheckboxItem as StdfCheckboxItem } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfCheckbox?: SvelteComponentProps<typeof StdfCheckboxItem>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    getId,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    config,
    value = $bindable(),
    handlers,
  }: ComponentProps["checkboxWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<StdfCheckboxItem
  checked={value ?? false}
  onclick={() => {
    value = !(value ?? false);
    onchange();
  }}
  {...uiOptionProps("stdfCheckbox")(
    {
      name: id,
    },
    config,
    ctx
  )}
>
  {config.title}
</StdfCheckboxItem>
