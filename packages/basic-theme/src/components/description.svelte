<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import '@sjsf/form/fields/extra-components/description';

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
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { description, config }: ComponentProps["description"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...descriptionAttributes(ctx, config, "descriptionAttributes", {
    class: 'sjsf-description'
  })}
>
  {description}
</div>
