<script lang="ts">
  import {
    type CustomizableNode,
    isCustomizableNode,
  } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { THEME_TITLES, THEMES } from "$lib/sjsf/theme.js";
  
  import { getBuilderContext } from "./context.svelte.js";
  import Container from "./container.svelte";
  import NodeSettings from "./node-settings.svelte";

  const ctx = getBuilderContext();
  const themeId = $props.id();
</script>

<Container class="flex flex-col gap-4 mb-4 p-3">
  <div class="font-medium text-md py-2">Form options</div>
  <div class="flex flex-col gap-1.5">
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
  </div>
  <Button disabled={ctx.rootNode === undefined}>Preview</Button>
</Container>
{#if ctx.selectedNode && isCustomizableNode(ctx.selectedNode)}
  <Container class="p-3">
    {#key `${ctx.theme}-${ctx.selectedNode.id}`}
      <NodeSettings
        bind:node={
          () => ctx.selectedNode as CustomizableNode,
          (n) => ctx.updateSelectedNode(n)
        }
      />
    {/key}
  </Container>
{/if}
