<script lang="ts" module>
  import type { HTMLSelectAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      select?: HTMLSelectAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    selectAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import {
    idMapper,
    singleOption,
    EMPTY_VALUE,
  } from "@sjsf/form/options.svelte";

  let {
    handlers,
    value = $bindable(),
    options,
    config,
    clearable = config.schema.default === undefined,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["selectWidget"] = $props();

  const ctx = getFormContext();

  const { placeholder, ...attributes } = $derived(
    selectAttributes(ctx, config, "select", handlers, {
      class: "sjsf-select",
    }),
  );
</script>

<select bind:value={mapped.current} {...attributes}>
  {#if clearable}
    <option value={EMPTY_VALUE}>{placeholder}</option>
  {/if}
  {#each options as option (option.id)}
    <option value={option.mappedValue ?? option.id} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
