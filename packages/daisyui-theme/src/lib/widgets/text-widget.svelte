<script lang="ts">
  import { type WidgetProps } from "@/form/index.js";

  import Datalist, { makeExamples } from "./datalist.svelte";

  let {
    value = $bindable(),
    attributes,
    config,
  }: WidgetProps<"text"> = $props();

  const examples = $derived(makeExamples(config, attributes));
</script>

<input type="text" bind:value style="flex-grow: 1" {...attributes} />
<Datalist {examples} />
