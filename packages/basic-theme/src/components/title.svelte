<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

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
    retrieveUiProps,
    type ComponentProps,
  } from "@sjsf/form";

  const { title, config, type }: ComponentProps["title"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...retrieveUiProps(ctx, config, "titleAttributes", {
    style: `font-weight: bold; font-size: ${type === "field" ? "unset" : "larger"};`,
  })}
>
  {title}
</div>
