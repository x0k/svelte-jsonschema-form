<script lang="ts">
  import type { Config } from "./config.js";

  const {
    id,
    config,
  }: {
    id: string | undefined | null;
    config: Config;
  } = $props();

  const examples = $derived.by(() => {
    const { default: defaultValue, examples } = config.schema;
    if (!Array.isArray(examples) || !id) {
      return;
    }
    return defaultValue !== undefined && !examples.includes(defaultValue)
      ? [defaultValue].concat(examples)
      : examples;
  });
</script>

{#if examples}
  <datalist {id}>
    {#each examples as example (example)}
      <option value={example}></option>
    {/each}
  </datalist>
{/if}
