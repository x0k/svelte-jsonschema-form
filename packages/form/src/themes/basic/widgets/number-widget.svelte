<script lang="ts">
  import type { WidgetProps } from "@/form";

  import Datalist, { makeExamples } from "./datalist.svelte";

  let {
    value = $bindable(),
    attributes,
    config,
  }: WidgetProps<"number"> = $props();
  const examples = $derived(makeExamples(config, attributes));
</script>

{#if attributes.type === "range"}
  <span style="padding: 0 1rem; min-width: 3ex;">
    {value}
  </span>
{/if}
<input type="number" bind:value style="flex-grow: 1" {...attributes} />
<Datalist {examples} />
