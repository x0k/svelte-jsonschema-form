<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

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
  {...helpAttributes("helpAttributes")(
    {
      style: "font-weight: 300;",
    },
    config,
    ctx
  )}
>
  {help}
</div>
