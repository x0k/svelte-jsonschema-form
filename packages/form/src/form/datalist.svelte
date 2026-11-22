<script lang="ts">
  import { getExampleSuggestions } from "#core/index.js";

  import type { Config } from "./config.js";

  const {
    id,
    config,
  }: {
    id: string | undefined | null;
    config: Config;
  } = $props();

  const suggestions = $derived(getExampleSuggestions(config.schema));
</script>

{#if id && suggestions.size > 0}
  <datalist {id}>
    {#each suggestions as suggestion (suggestion)}
      <option value={suggestion}></option>
    {/each}
  </datalist>
{/if}
