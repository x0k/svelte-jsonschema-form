<script lang="ts" module>
  import type { SelectProps } from "flowbite-svelte/Select.svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      flowbiteSelect?: SelectProps;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    selectAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { singleOption, EMPTY_VALUE } from "@sjsf/form/options.svelte";
  import Select from "flowbite-svelte/Select.svelte";

  let {
    handlers,
    value = $bindable(),
    options,
    mapper,
    config,
  }: ComponentProps["selectWidget"] = $props();

  const mapped = singleOption({
    mapper: () => mapper,
    value: () => value,
    update: (v) => (value = v),
  });

  const ctx = getFormContext();

  const attributes = $derived(
    selectAttributes(ctx, config, "flowbiteSelect", handlers, {
      placeholder: "",
    })
  );
</script>

<Select bind:value={mapped.current} {...attributes}>
  {#if config.schema.default === undefined}
    <option value={EMPTY_VALUE}>{attributes.placeholder}</option>
  {/if}
  {#each options as option (option.id)}
    <option value={option.mappedValue} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</Select>
