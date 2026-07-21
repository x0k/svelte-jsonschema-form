<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/widgets/checkbox.svelte";

  let {
    config,
    value = $bindable(),
    handlers,
  }: ComponentProps["checkboxWidget"] = $props();

  const ctx = getFormContext();
</script>

<label class="flex cursor-pointer items-center space-x-2">
  <input
    type="checkbox"
    class="checkbox"
    bind:checked={() => value ?? false, (v) => (value = v)}
    {...inputAttributes(ctx, config, "checkbox", handlers, {})}
  />
  <p>{config.title}</p>
</label>
