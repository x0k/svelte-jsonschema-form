<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the errors list.
       */
      errorsList?: HTMLAttributes<HTMLUListElement>;
    }
  }
</script>

<script lang="ts">
  import {
    errorsListAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { errors, config }: ComponentProps["errorsList"] = $props();

  const ctx = getFormContext();
</script>

<ul
  {...errorsListAttributes(ctx, config, "errorsList", {
    style: "color: red; list-style-position: inside; padding: 0; margin: 0;",
  })}
>
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ul>
