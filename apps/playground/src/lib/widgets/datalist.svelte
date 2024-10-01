<script lang="ts" module>
  import { computeId, type Config } from "@/components/form";

  export function dataListOptions({ schema: { examples, default: defaultValue }, idSchema }: Config) {
    if (!Array.isArray(examples)) {
      return
    }
    return {
      id: computeId(idSchema, "examples"),
      examples: defaultValue !== undefined && !examples.includes(defaultValue) ? [defaultValue].concat(examples) : examples
    }
  }
</script>

<script lang="ts">
  const {
    options
  }: {
    options: ReturnType<typeof dataListOptions>
  } = $props();
</script>

{#if options}
  <datalist id={options.id}>
    {#each options.examples as example (example)}
      <option value={example}></option>
    {/each}
  </datalist>
{/if}
