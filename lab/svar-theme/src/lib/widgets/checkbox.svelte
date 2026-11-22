<script lang="ts" module>
  import { Checkbox as SvarCheckbox } from "@svar-ui/svelte-core";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      svarCheckbox?: SvelteComponentProps<typeof SvarCheckbox>;
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
    config,
    value = $bindable(),
    handlers,
    mustBeChecked,
  }: ComponentProps["checkboxWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  const label = $derived(mustBeChecked ? `${config.title} *` : config.title);

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<SvarCheckbox
  bind:value={() => value ?? false, (v) => (value = v)}
  {...uiOptionProps("svarCheckbox")(
    {
      id,
      label,
      disabled: isDisabled(ctx),
      onchange,
    },
    config,
    ctx
  )}
/>
