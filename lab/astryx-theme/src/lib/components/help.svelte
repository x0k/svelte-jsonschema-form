<script lang="ts" module>
  import type { TextProps } from "@astryx-svelte/core";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the Astryx Text props of the help.
       */
      astryxHelpAttributes?: Partial<TextProps>;
    }
  }
</script>

<script lang="ts">
  import { Text } from "@astryx-svelte/core";
  import {
    getFormContext,
    helpAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { help, config }: ComponentProps["help"] = $props();

  const ctx = getFormContext();

  const attrs = $derived(
    helpAttributes(ctx, config, "astryxHelpAttributes", {})
  );
</script>

<Text type="supporting" as="span" {...attrs}>
  {help}
</Text>
