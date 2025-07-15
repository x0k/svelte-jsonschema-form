<script lang="ts">
  import CircleX from "@lucide/svelte/icons/circle-x";
  import CircleAlert from "@lucide/svelte/icons/circle-alert";

  import {
    type CustomizableNode,
    isCustomizableNode,
  } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { CopyButton } from "$lib/components/copy-button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { THEME_TITLES, THEMES } from "$lib/sjsf/theme.js";

  import { getBuilderContext } from "../context.svelte.js";
  import Container from "../container.svelte";
  import NodeSettings from "../node-settings.svelte";
  import { RouteName } from "../model.js";

  const ctx = getBuilderContext();
  const uniqueId = $props.id();
</script>

<Container class="flex flex-col gap-4 mb-4 p-3">
  <div class="font-medium text-md py-2">Form options</div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-theme`}>Theme</Label>
    <Select.Root type="single" bind:value={ctx.theme}>
      <Select.Trigger id={`${uniqueId}-theme`} class="w-full">
        {THEME_TITLES[ctx.theme]}
      </Select.Trigger>
      <Select.Content>
        {#each THEMES as t (t)}
          <Select.Item value={t}>{THEME_TITLES[t]}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
  <div class="flex items-center gap-2">
    <Checkbox id={`${uniqueId}-ignore`} bind:checked={ctx.ignoreWarnings} />
    <Label class="text-base" for={`${uniqueId}-ignore`}>Ignore warnings</Label>
  </div>
  <Button
    disabled={ctx.rootNode === undefined}
    onclick={() => {
      if (ctx.validate()) {
        ctx.build();
        ctx.route = { name: RouteName.Preview };
      }
    }}>Preview</Button
  >
  {#if ctx.errorsCount || ctx.warningsCount}
    <div class="flex gap-4 items-center justify-start flex-wrap">
      {#if ctx.errorsCount}
        <div class="flex gap-2 items-center">
          <CircleX class="text-destructive" />
          {ctx.errorsCount} error{ctx.errorsCount > 1 ? "s" : ""}
        </div>
      {/if}
      {#if ctx.warningsCount}
        <div class="flex gap-2 items-center">
          <CircleAlert class="text-chart-3" />
          {ctx.warningsCount} warning{ctx.warningsCount > 1 ? "s" : ""}
        </div>
      {/if}
    </div>
  {/if}
  <CopyButton
    text={() => {
      const url = new URL(window.location.href);
      url.search = "";
      url.hash = ctx.exportState();
      return url.toString();
    }}>Share</CopyButton
  >
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
