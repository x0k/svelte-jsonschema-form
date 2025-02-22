<script lang="ts">
  import type { Config } from "./config.js";
  import type { Id } from "./id.js";

  const {
    id,
    config,
  }: {
    id: Id | undefined | null;
    config: Config;
  } = $props();

  function createExamples(
    listId: Id | undefined | null,
    { schema: { examples, default: defaultValue } }: Config
  ) {
    if (!Array.isArray(examples) || !listId) {
      return;
    }
    return {
      listId,
      examples:
        defaultValue !== undefined && !examples.includes(defaultValue)
          ? [defaultValue].concat(examples)
          : examples,
    };
  }

  const examples = $derived(createExamples(id, config));
</script>

{#if examples}
  <datalist id={examples.listId}>
    {#each examples.examples as example (example)}
      <option value={example}></option>
    {/each}
  </datalist>
{/if}
