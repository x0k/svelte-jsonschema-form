<script lang="ts">
  import { themeOrSubThemeTitle } from "meta";
  import {
    playgroundIconSets,
    playgroundIconSetTitle,
    playgroundResolvers,
    playgroundThemes
  } from "meta/playground";
  import { SandboxPlatform } from 'meta/sandbox'
  import { builderValidators, builderValidatorTitle } from "meta/builder";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ExternalLink from "@lucide/svelte/icons/external-link";

  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { CopyButton } from "$lib/components/copy-button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Select from "$lib/components/select.svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { encodeJson } from "$lib/url.js";

  import { openSandbox } from "../open-sandbox.js";
  import { RouteName } from "../model.js";
  import { getBuilderContext } from "../context.svelte.js";
  import Container from "../container.svelte";

  const ctx = getBuilderContext();

  const uniqueId = $props.id();

  let action = $state<SandboxPlatform | 'playground'>("playground");

  async function handleMainClick() {
    if (action === "playground") {
      const url = `https://x0k.github.io/svelte-jsonschema-form/playground3#${encodeJson(ctx.createPlaygroundSample())}`;
      window.open(url);
    } else {
      await openSandbox({
        platform: action,
        theme: ctx.theme,
        validator: ctx.validator,
        schema: ctx.schema,
        uiSchema: ctx.uiSchema,
        html5Validation: ctx.html5Validation,
        resolver: ctx.resolver,
        icons: ctx.icons,
        widgets: ctx.uiSchemaWidgets,
        fileFieldMode: ctx.uiSchemaFileFieldMode
      });
    }
  }
</script>

<Container class="mb-4 flex flex-col gap-4 p-3">
  <div class="text-md py-2 font-medium">Form options</div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-theme`}>Theme</Label>
    <Select
      class="w-full"
      labelId="{uniqueId}-theme"
      bind:value={ctx.theme}
      items={playgroundThemes()}
      itemLabel={themeOrSubThemeTitle}
    />
  </div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-resolver`}>Resolver</Label>
    <Select
      class="w-full"
      labelId="{uniqueId}-resolver"
      bind:value={ctx.resolver}
      items={playgroundResolvers()}
    />
  </div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-validator`}>Validator</Label>
    <Select
      class="w-full"
      labelId="{uniqueId}-validator"
      bind:value={ctx.validator}
      items={builderValidators()}
      itemLabel={builderValidatorTitle}
    />
  </div>
  <div class="flex flex-col gap-1.5">
    <Label for={`${uniqueId}-icons`}>Icons</Label>
    <Select
      class="w-full"
      labelId="{uniqueId}-icons"
      bind:value={ctx.icons}
      items={playgroundIconSets()}
      itemLabel={playgroundIconSetTitle}
    />
  </div>
  <div class="flex items-center gap-2">
    <Checkbox id="{uniqueId}-html5v" bind:checked={ctx.html5Validation} />
    <Label class="text-base" for="{uniqueId}-html5v">HTML5 validation</Label>
  </div>
  <Button
    onclick={() => {
      ctx.route = { name: RouteName.Editor };
    }}
  >
    Edit
  </Button>
  <div class="flex flex-col gap-2">
    <ButtonGroup.Root class="w-full">
      <Button variant="ghost" class="flex-1 gap-2" onclick={handleMainClick}>
        Open in {action === "playground" ? "Playground" : action}
        <ExternalLink tabindex={-1} />
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class={buttonVariants({ variant: "ghost" })}>
          <ChevronDown class="size-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onclick={() => (action = "playground")}>
            Playground
          </DropdownMenu.Item>
          <DropdownMenu.Item onclick={() => (action = SandboxPlatform.StackBlitz)}>
            StackBlitz
          </DropdownMenu.Item>
          <DropdownMenu.Item onclick={() => (action = SandboxPlatform.SvelteLab)}>
            SvelteLab
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </ButtonGroup.Root>
    <CopyButton
      text={() => {
        const url = new URL(window.location.href);
        url.search = "";
        url.hash = encodeJson(ctx.exportState());
        return url.toString();
      }}>Share</CopyButton
    >
  </div>
</Container>
