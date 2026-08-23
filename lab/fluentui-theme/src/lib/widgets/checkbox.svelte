<script lang="ts" module>
  import { Checkbox } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiCheckbox?: Omit<
        SvelteComponentProps<typeof Checkbox>,
        "checked" | "children" | "indeterminate"
      >;
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
  }: ComponentProps["checkboxWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<Checkbox
  bind:checked={() => value ?? false, (v) => (value = v)}
  {...uiOptionProps("fluentuiCheckbox")(
    {
      id,
      disabled: isDisabled(ctx),
      onchange,
    },
    config,
    ctx
  )}
>
  {config.title}
</Checkbox>
