<script lang="ts" module>
  import type { HTMLSelectAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/multi-select";

  declare module "@sjsf/form" {
    interface UiOptions {
      multiSelect?: HTMLSelectAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    selectAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { indexMapper, multipleOptions } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
  }: ComponentProps["multiSelectWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    selectAttributes(ctx, config, "multiSelect", handlers, {
      style: "flex-grow: 1",
    })
  );

  const mapped = $derived(
    multipleOptions({
      mapper: () => indexMapper(options),
      value: () => value,
      update: (v) => (value = v),
    })
  );
</script>

<select multiple bind:value={mapped.value} {...attributes}>
  {#each options as option, index (option.id)}
    <option value={index} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
