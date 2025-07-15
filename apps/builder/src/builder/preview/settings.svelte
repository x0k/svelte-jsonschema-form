<script lang="ts">
  import ExternalLink from "@lucide/svelte/icons/external-link";

  import { Button } from "$lib/components/ui/button/index.js";
  import { CopyButton } from "$lib/components/copy-button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { THEME_TITLES, THEMES } from "$lib/sjsf/theme.js";
  import { RESOLVER_TITLES, RESOLVERS } from "$lib/sjsf/resolver.js";
  import { ICONS, ICONS_TITLES } from "$lib/sjsf/icons.js";
  import { VALIDATOR_TITLES, VALIDATORS } from "$lib/sjsf/validators.js";
  import Select from "$lib/components/select.svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  import { RouteName } from "../model.js";
  import { getBuilderContext } from "../context.svelte.js";
  import Container from "../container.svelte";

  const ctx = getBuilderContext();

  const uniqueId = $props.id();
</script>

<Container class="flex flex-col gap-4 mb-4 p-3">
  <div class="font-medium text-md py-2">Form options</div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-theme`}>Theme</Label>
    <Select
      class="w-full"
      labelId="{uniqueId}-theme"
      bind:value={ctx.theme}
      items={THEMES}
      labels={THEME_TITLES}
    />
  </div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-resolver`}>Resolver</Label>
    <Select
      class="w-full"
      labelId="{uniqueId}-resolver"
      bind:value={ctx.resolver}
      items={RESOLVERS}
      labels={RESOLVER_TITLES}
    />
  </div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-validator`}>Validator</Label>
    <Select
      class="w-full"
      labelId="{uniqueId}-validator"
      bind:value={ctx.validator}
      items={VALIDATORS}
      labels={VALIDATOR_TITLES}
    />
  </div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-icons`}>Icons</Label>
    <Select
      class="w-full"
      labelId="{uniqueId}-icons"
      bind:value={ctx.icons}
      items={ICONS}
      labels={ICONS_TITLES}
    />
  </div>
  <div class="flex items-center gap-2">
    <Checkbox id="{uniqueId}-html5v" bind:checked={ctx.html5Validation} />
    <Label class="text-base" for="{uniqueId}-html5v">HTML5 validation</Label>
  </div>
  <Button
    onclick={() => {
      ctx.route = { name: RouteName.Editor };
    }}>Edit</Button
  >
  <div class="flex flex-col gap-2">
    <Button
      variant="ghost"
      class="flex items-center gap-2"
      onclick={() => {
        const url = `https://x0k.github.io/svelte-jsonschema-form/playground2#${ctx.createPlaygroundState()}`;
        window.open(url);
      }}
      >Playground <div><ExternalLink tabindex={-1} /></div></Button
    >
    <CopyButton
      text={() => {
        const url = new URL(window.location.href);
        url.search = "";
        url.hash = ctx.exportState();
        return url.toString();
      }}>Share</CopyButton
    >
  </div>
</Container>
