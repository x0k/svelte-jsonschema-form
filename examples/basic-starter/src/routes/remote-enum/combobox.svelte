<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  import "@sjsf/form/fields/extra-widgets/combobox";

  declare module "@sjsf/form" {
    interface UiOptions {
      myCombobox?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";
  import {
    getEnumOptionsQueriesContext,
    getEnumOptionsQuery,
  } from "@sjsf/form/fields/extra/remote-enum.svelte";

  let {
    value = $bindable(),
    config,
    options,
    handlers,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["comboboxWidget"] = $props();

  const ctx = getFormContext();
  const queries = getEnumOptionsQueriesContext();
  const query = $derived(getEnumOptionsQuery(queries, "foo"));

  let input = $state.raw("");
</script>

<div class="combobox">
  <input
    {...inputAttributes(ctx, config, "myCombobox", handlers, {
      type: "search",
      autocomplete: "off",
    })}
    bind:value={
      () => mapped.current || input,
      (v) => {
        mapped.current = v;
        input = v;
        query.run(v);
      }
    }
  />
  {#if !mapped.current}
    {#each options as option (option.id)}
      <button
        type="button"
        onclick={() => {
          value = structuredClone(option.value);
        }}>{option.label}</button
      >
    {/each}
  {/if}
  {#if query.isProcessed}
    <div>Loading...</div>
  {/if}
</div>

<style>
  .combobox {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
