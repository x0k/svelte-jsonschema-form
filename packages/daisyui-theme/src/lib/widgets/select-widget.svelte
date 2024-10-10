<script lang="ts">
  import type { WidgetProps } from "@sjsf/form";

  import { makeOptionsMapper } from './options.js';

  let {
    attributes,
    value = $bindable(),
    options,
    multiple,
    config,
  }: WidgetProps<"select"> = $props();
  
  const { readonly, ...rest } = $derived(attributes)

  // NOTE: On current version of svelte (5.0.0-next.259) this solution
  // can prevent only state modification, but the UI will be updated.
  // Looks like inputs with `bind:` attribute are not properly controlled.
  // TODO: Figure out is it a bug or not

  const { indexToValue, valueToIndex } = $derived(makeOptionsMapper(options))

  const guarded = {
    get value() {
      if (value === undefined) {
        return multiple ? [] : -1
      }
      if (!multiple) {
        return valueToIndex(value)
      }
      if (!Array.isArray(value)) {
        throw new Error("Value must be an array")
      }
      return value.map(valueToIndex)
    },
    set value(v) {
      if (readonly) {
        return
      }
      value = Array.isArray(v)
        ? v.map(indexToValue)
        : indexToValue(v)
    }
  }
</script>

{#snippet children()}
  {#if !multiple && config.schema.default === undefined}
    <option value={-1}>{attributes.placeholder}</option>
  {/if}
  {#each options as option, index (option.value)}
    <option value={index} disabled={option.disabled} >
      {option.label}
    </option>
  {/each}
{/snippet}
{#if multiple}
  <select
    class="select select-sm select-bordered grow"
    bind:value={guarded.value}
    multiple
    {...rest}
  >
    {@render children()}
  </select>
{:else}
  <select
    class="select select-sm select-bordered grow"
    bind:value={guarded.value}
    {...rest}
  >
    {@render children()}
  </select>
{/if}
