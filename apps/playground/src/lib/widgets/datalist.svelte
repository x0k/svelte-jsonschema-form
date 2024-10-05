<script lang="ts" module>
  import type { HTMLInputAttributes } from 'svelte/elements';
  
  import { type Config } from "@/components/form";

  export function makeExamples(
    { schema: { examples, default: defaultValue } }: Config,
    { list }: HTMLInputAttributes,
  ) {
    if (!Array.isArray(examples) || !list) {
      return
    }
    return {
      id: list,
      examples: defaultValue !== undefined && !examples.includes(defaultValue) ? [defaultValue].concat(examples) : examples
    }
  }
</script>

<script lang="ts">
  const {
    examples,
  }: {
    examples: ReturnType<typeof makeExamples>
  } = $props();
</script>

{#if examples}
  <datalist id={examples.id}>
    {#each examples.examples as example (example)}
      <option value={example}></option>
    {/each}
  </datalist>
{/if}
