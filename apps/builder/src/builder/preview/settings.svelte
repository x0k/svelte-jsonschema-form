<script lang="ts">
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Copy from "@lucide/svelte/icons/copy";
  import Download from "@lucide/svelte/icons/download";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { themeOrSubThemeTitle } from "meta";
  import {
    builderValidators2,
    builderValidatorId,
    builderValidatorFromId,
    builderValidatorTitle,
    type BuilderValidatorId,
  } from "meta/builder";
  import {
    playgroundIconSets,
    playgroundIconSetTitle,
    playgroundResolvers,
    playgroundThemes,
  } from "meta/playground";
  import {
    SANDBOX_PLATFORMS,
    sandboxPlatformLabel,
    sandboxPlatformIcon,
  } from "meta/sandbox";
  import { toast } from "svelte-sonner";

  import Select from "$lib/components/select.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { copyTextToClipboard } from "$lib/copy-to-clipboard";
  import { encodeJson } from "$lib/url.js";

  import Container from "../container.svelte";
  import { getBuilderContext } from "../context.svelte.js";
  import { RouteName, VALIDATOR_ITEMS, VALIDATOR_LABELS } from "../model.js";

  const ctx = getBuilderContext();

  const uniqueId = $props.id();
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
      bind:value={
        () => builderValidatorId(ctx.validator),
        (v) => {
          ctx.validator = builderValidatorFromId(v);
        }
      }
      items={VALIDATOR_ITEMS}
      labels={VALIDATOR_LABELS}
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
      <Button
        variant="ghost"
        class="flex-1 gap-2"
        onclick={async () => {
          try {
            const url = new URL(window.location.href);
            url.search = "";
            url.hash = encodeJson(ctx.exportState());
            const str = url.toString();
            await copyTextToClipboard(str);
            toast.success("Link copied");
          } catch (err) {
            console.error(err);
            toast.error("An error has occurred");
          }
        }}
      >
        Share
        <Copy tabindex={-1} />
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class={buttonVariants({ variant: "ghost" })}>
          <ChevronDown class="size-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-46">
          <DropdownMenu.Item
            onclick={() => {
              const url = `https://x0k.github.io/svelte-jsonschema-form/playground3#${encodeJson(ctx.createPlaygroundSample())}`;
              window.open(url);
            }}
            >Open in Playground
            <ExternalLink class="ml-auto" />
          </DropdownMenu.Item>
          {#each SANDBOX_PLATFORMS as platform (platform)}
            <DropdownMenu.Item onclick={() => ctx.openSandbox(platform)}>
              {sandboxPlatformLabel(platform)}
              {#if sandboxPlatformIcon(platform) === "external-link"}
                <ExternalLink class="ml-auto" />
              {:else}
                <Download class="ml-auto" />
              {/if}
            </DropdownMenu.Item>
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </ButtonGroup.Root>
  </div>
</Container>
