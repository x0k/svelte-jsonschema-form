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
    errors,
    handlers,
  }: ComponentProps["multiSelectWidget"] = $props();

  const mapped = multipleOptions({
    mapper: () => mapper,
    value: () => value,
    update: (v) => (value = v),
  });
  const ctx = getFormContext();
</script>

<select
  class={["select select-bordered grow", errors.length > 0 && "select-error"]}
  bind:value={mapped.current}
  multiple
  {...selectAttributes(ctx, config, "multiSelect", handlers, {})}
>
  {#each options as option (option.id)}
    <option value={option.mappedValue} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
