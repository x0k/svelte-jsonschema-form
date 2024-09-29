<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  import { createTransformation } from '../svelte.svelte';

  let {
    attributes,
    value = $bindable(),
    options,
    multiple,
  }: WidgetProps<"select"> = $props();
  
  const { readonly, ...rest } = $derived(attributes)

  // NOTE: On current version of svelte (5.0.0-next.259) this solution
  // can prevent only state modification, but the UI will be updated.
  // Looks like inputs with `bind:` attribute are not properly controlled.
  // TODO: Figure out is it a bug or not

  const transformed = createTransformation({
    transform: () => value,
    guard: () => !readonly,
    update: (v) => {
      value = v
    }
  })
</script>

{#snippet children()}
  {#each options as option}
    <option value={option.value}>
      {option.label}
    </option>
  {/each}
{/snippet}
{#if multiple}
  <select
    multiple
    bind:value={transformed.value}
    style="flex-grow: 1"
    {...rest}
  >
    {@render children()}
  </select>
{:else}
  <select
    bind:value={transformed.value}
    style="flex-grow: 1"
    {...rest}
  >
    {@render children()}
  </select>
{/if}
