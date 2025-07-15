<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { CopyButton } from "$lib/components/copy-button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { THEME_TITLES, THEMES } from "$lib/sjsf/theme.js";
  import { RESOLVER_TITLES, RESOLVERS } from "$lib/sjsf/resolver.js";
  import { ICONS, ICONS_TITLES } from "$lib/sjsf/icons.js";
  import { VALIDATOR_TITLES, VALIDATORS } from "$lib/sjsf/validators.js";

  import { getBuilderContext } from "../context.svelte.js";
  import Container from "../container.svelte";
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
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-resolver`}>Resolver</Label>
    <Select.Root type="single" bind:value={ctx.resolver}>
      <Select.Trigger id={`${uniqueId}-resolver`} class="w-full">
        {RESOLVER_TITLES[ctx.resolver]}
      </Select.Trigger>
      <Select.Content>
        {#each RESOLVERS as r (r)}
          <Select.Item value={r}>{RESOLVER_TITLES[r]}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-validator`}>Validator</Label>
    <Select.Root type="single" bind:value={ctx.validator}>
      <Select.Trigger id={`${uniqueId}-validator`} class="w-full">
        {VALIDATOR_TITLES[ctx.validator]}
      </Select.Trigger>
      <Select.Content>
        {#each VALIDATORS as v (v)}
          <Select.Item value={v}>{VALIDATOR_TITLES[v]}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-icons`}>Icons</Label>
    <Select.Root type="single" bind:value={ctx.icons}>
      <Select.Trigger id={`${uniqueId}-icons`} class="w-full">
        {ICONS_TITLES[ctx.icons]}
      </Select.Trigger>
      <Select.Content>
        {#each ICONS as i (i)}
          <Select.Item value={i}>{ICONS_TITLES[i]}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
  <Button
    onclick={() => {
      ctx.route = { name: RouteName.Editor };
    }}>Edit</Button
  >
  <CopyButton
    text={() => {
      const url = new URL(window.location.href);
      url.search = "";
      url.hash = ctx.exportState();
      return url.toString();
    }}>Share</CopyButton
  >
</Container>
