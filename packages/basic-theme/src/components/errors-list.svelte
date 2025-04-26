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
    ERRORS_FOR_KEY,
    getFormContext,
    retrieveUiProps,
    type ComponentProps,
  } from "@sjsf/form";

  const { errors, config }: ComponentProps["errorsList"] = $props();

  const ctx = getFormContext();
</script>

<ui
  {...retrieveUiProps(ctx, config, "errorsList", {
    style: "color: red;",
    [ERRORS_FOR_KEY]: config.id,
  })}
>
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ui>
