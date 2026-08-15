<script lang="ts" module>
  import type {
    TextColorMap,
    TextProps,
    HeadingProps,
  } from "@astryx-svelte/core";

  declare module "@astryx-svelte/core" {
    interface TextColorMap {
      error: true;
    }
  }

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the Astryx Text props of the field title (fieldTemplate).
       */
      astryxTitleAttributes?: Partial<TextProps>;
      /**
       * Overrides the Astryx Heading props of the field title (objectTemplate).
       */
      astryxHeadingAttributes?: Partial<HeadingProps>;
    }
  }
</script>

<script lang="ts">
  import { Heading, Text } from "@astryx-svelte/core";
  import {
    getFormContext,
    titleAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/title.svelte";

  const { title, config, templateType }: ComponentProps["title"] = $props();

  const ctx = getFormContext();

  const fieldAttrs = $derived(
    titleAttributes(ctx, config, "astryxTitleAttributes", {})
  );

  const objectAttrs = $derived(
    titleAttributes(ctx, config, "astryxHeadingAttributes", {})
  );
</script>

{#if templateType === "fieldTemplate"}
  <Text type="label" color="secondary" {...fieldAttrs}>
    {title}
    {#if config.required}
      <Text type="label" color="error" display="inline">*</Text>
    {/if}
  </Text>
{:else}
  <Heading level={6} {...objectAttrs}>
    {title}
  </Heading>
{/if}
