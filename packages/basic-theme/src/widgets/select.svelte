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
  import { indexMapper, singleOption } from "@sjsf/form/options.svelte";

  let {
    handlers,
    value = $bindable(),
    options,
    config,
  }: ComponentProps["selectWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    selectAttributes(ctx, config, "select", handlers, {
      style: "flex-grow: 1",
    })
  );

  const mapped = $derived(
    singleOption({
      mapper: () => indexMapper(options),
      value: () => value,
      update: (v) => (value = v),
    })
  );
</script>

<select bind:value={mapped.value} {...attributes}>
  {#if config.schema.default === undefined}
    <option value={-1}>{attributes.placeholder}</option>
  {/if}
  {#each options as option, index (option.id)}
    <option value={index} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
