<script lang="ts" module>
  import type { TextColorMap, TextProps } from "@astryx-svelte/core";

  declare module "@astryx-svelte/core" {
    interface TextColorMap {
      error: true;
    }
  }

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the Astryx Text props of the field label.
       */
      astryxLabelAttributes?: Partial<TextProps>;
    }
  }
</script>

<script lang="ts">
  import { Text } from "@astryx-svelte/core";
  import {
    getFormContext,
    labelAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/label.svelte";

  const { title, config }: ComponentProps["label"] = $props();

  const ctx = getFormContext();

  const attrs = $derived(
    labelAttributes(ctx, config, "astryxLabelAttributes", {})
  );
</script>

<Text type="label" as="label" {...attrs}>
  {title}
  {#if config.required}
    <Text type="label" color="error" display="inline">*</Text>
  {/if}
</Text>
