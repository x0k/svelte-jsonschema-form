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
  import { idMapper, multipleOptions } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
  }: ComponentProps["multiSelectWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    selectAttributes(ctx, config, "multiSelect", handlers, {
      class: "basic-multi-select"
    })
  );

  const mapped = multipleOptions({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    })
</script>

<select multiple bind:value={mapped.value} {...attributes}>
  {#each options as option (option.id)}
    <option value={option.id} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
