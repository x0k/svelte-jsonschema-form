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
  import { idMapper, singleOption, UNDEFINED_ID } from "@sjsf/form/options.svelte";

  let {
    handlers,
    value = $bindable(),
    options,
    config,
  }: ComponentProps["selectWidget"] = $props();

  const ctx = getFormContext();

  const { placeholder, ...attributes } = $derived(
    selectAttributes(ctx, config, "select", handlers, {
      class: "basic-select"
    })
  );

  const mapped = singleOption({
    mapper: () => idMapper(options),
    value: () => value,
    update: (v) => (value = v),
  })
</script>

<select bind:value={mapped.value} {...attributes}>
  {#if config.schema.default === undefined}
    <option value={UNDEFINED_ID}>{placeholder}</option>
  {/if}
  {#each options as option (option.id)}
    <option value={option.id} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
