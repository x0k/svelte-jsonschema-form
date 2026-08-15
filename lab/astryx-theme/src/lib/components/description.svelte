<script lang="ts" module>
  import type { TextProps } from "@astryx-svelte/core";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the Astryx Text props of the description.
       */
      astryxDescriptionAttributes?: Partial<TextProps>;
    }
  }
</script>

<script lang="ts">
  import { Text } from "@astryx-svelte/core";
  import {
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { description, config }: ComponentProps["description"] = $props();

  const ctx = getFormContext();

  const attrs = $derived(
    descriptionAttributes(ctx, config, "astryxDescriptionAttributes", {})
  );
</script>

<Text type="supporting" as="p" {...attrs}>
  {description}
</Text>
