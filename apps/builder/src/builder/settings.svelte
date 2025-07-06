<script lang="ts">
  import {
    type CustomizableNode,
    isCustomizableNode,
  } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { THEME_TITLES, THEMES } from "$lib/sjsf.js";

  import { getBuilderContext } from "./context.svelte.js";
  import NodeSettings from "./node-settings.svelte";

  const ctx = getBuilderContext();
  const themeId = $props.id();
</script>

<div class="flex flex-col gap-2">
  <Label for={themeId}>Theme</Label>
  <Select.Root type="single" bind:value={ctx.theme}>
    <Select.Trigger id={themeId} class="w-full">
      {THEME_TITLES[ctx.theme]}
    </Select.Trigger>
    <Select.Content>
      {#each THEMES as t (t)}
        <Select.Item value={t}>{THEME_TITLES[t]}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
  <Button disabled={ctx.rootNode === undefined}>Preview</Button>
  {#if ctx.selectedNode && isCustomizableNode(ctx.selectedNode)}
    {#key ctx.selectedNode.id}
      <NodeSettings
        bind:node={
          () => ctx.selectedNode as CustomizableNode,
          (n) => ctx.updateSelectedNode(n)
        }
      />
    {/key}
  {/if}
</div>
