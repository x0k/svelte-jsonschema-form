<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/help";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the help.
       */
      helpAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    helpAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { help, config }: ComponentProps["help"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...helpAttributes(ctx, config, "helpAttributes", {
    class: "sjsf-help",
  })}
>
  {help}
</div>
