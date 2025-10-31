<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/title";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the field title
       */
      titleAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    titleAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { title, config, templateType }: ComponentProps["title"] = $props();

  const ctx = getFormContext();
</script>

<legend
  {...titleAttributes(ctx, config, "titleAttributes", {
    style: `display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: ${templateType === "fieldTemplate" ? "unset" : "larger"};`,
  })}
>
  {title}
</legend>
