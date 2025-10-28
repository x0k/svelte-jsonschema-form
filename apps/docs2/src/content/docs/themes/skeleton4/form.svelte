<script lang="ts">
  import { fromRecord } from "@sjsf/form/lib/resolver";
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { theme } from "@sjsf/skeleton4-theme";
  import { specs } from "@sjsf/skeleton4-theme/specs";

  import { createAstro } from "@/astro.svelte";
  import * as defaults from "@/lib/form/defaults";

  import { createSchemas } from "../_demo-schema";

  const astro = createAstro();

  let rootNode = $state<Node>();
  const options = {
    getRootNode() {
      return rootNode!;
    },
  };

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
    extraUiOptions: fromRecord({
      skeleton3Slider: options,
      skeleton3FileUpload: options,
      skeleton3Rating: options,
      skeleton3Segment: options,
      skeleton3Switch: options,
      skeleton3Tags: options,
    }),
  });

  let divEl: HTMLElement;
  $effect(() => {
    rootNode = divEl.getRootNode();
  });
</script>

<div bind:this={divEl}></div>

{#if rootNode}
  <BasicForm
    {form}
    novalidate
    class="flex flex-col gap-4 {astro.darkOrLight}"
    style="margin-bottom: 1rem;"
    data-theme="cerberus"
  />
{/if}

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
