<script lang="ts">
  import { CheckboxInput } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/widgets/checkbox.svelte";

  let {
    config,
    value = $bindable(),
    handlers,
  }: ComponentProps["checkboxWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    customInputAttributes(ctx, config, "checkbox", {})
  );
</script>

<CheckboxInput
  label={config.title ?? "Checkbox"}
  value={value ?? false}
  onChange={(v: boolean) => {
    value = v;
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  isDisabled={attributes.disabled === true}
/>
