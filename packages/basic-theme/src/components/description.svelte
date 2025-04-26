<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the description.
       */
      descriptionAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    retrieveUiProps,
    type ComponentProps,
  } from "@sjsf/form";

  const { description, config }: ComponentProps["description"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...retrieveUiProps(ctx, config, "descriptionAttributes", {
    style: "font-weight: 300;",
  })}
>
  {description}
</div>
