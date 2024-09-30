<script lang="ts">
  import type { WidgetProps } from "@/components/form";
  import { proxy } from '@/lib/svelte.svelte';

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

  const guarded = proxy(() => value, {
    guard: () => !readonly,
    update: (v) => {
      value = v
    }
  })
</script>

{#snippet children()}
  {#if !multiple && config.schema.default === undefined}
    <option value={undefined}>{attributes.placeholder}</option>
  {/if}
  {#each options as option}
    <option value={option.value}>
      {option.label}
    </option>
  {/each}
{/snippet}
{#if multiple}
  <select
    multiple
    bind:value={guarded.value}
    style="flex-grow: 1"
    {...rest}
  >
    {@render children()}
  </select>
{:else}
  <select
    bind:value={guarded.value}
    style="flex-grow: 1"
    {...rest}
  >
    {@render children()}
  </select>
{/if}
