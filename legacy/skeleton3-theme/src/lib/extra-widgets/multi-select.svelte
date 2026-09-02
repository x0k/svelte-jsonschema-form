<script lang="ts">
  import {
    getFormContext,
    selectAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { multipleOptions } from "@sjsf/form/options.svelte";
  import "@sjsf/basic-theme/extra-widgets/multi-select.svelte";

  let {
    value = $bindable(),
    options,
    mapper,
    config,
    handlers,
  }: ComponentProps["multiSelectWidget"] = $props();

  const ctx = getFormContext();

  const mapped = multipleOptions({
    mapper: () => mapper,
    value: () => value,
    update: (v) => (value = v),
  });
</script>

<select
  multiple
  bind:value={mapped.current}
  class="select"
  {...selectAttributes(ctx, config, "multiSelect", handlers, {})}
>
  {#each options as option (option.id)}
    <option value={option.mappedValue} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
