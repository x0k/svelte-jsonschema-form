<script lang="ts">
  import {
    getFormContext,
    indexMapper,
    multipleOptions,
    selectAttributes,
    type WidgetProps,
  } from "@/form/index.js";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
  }: WidgetProps<"multiSelect"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(selectAttributes(ctx, config, handlers));

  const mapped = $derived(
    multipleOptions({
      mapper: () => indexMapper(options),
      value: () => value,
      update: (v) => (value = v),
    })
  );
</script>

<select multiple bind:value={mapped.value} style="flex-grow: 1" {...attributes}>
  {#each options as option, index (option.id)}
    <option value={index} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
