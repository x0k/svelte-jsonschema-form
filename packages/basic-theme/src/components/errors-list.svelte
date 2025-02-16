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
  import type { ComponentProps } from "@sjsf/form";

  const { errors, forId, config }: ComponentProps["errorsList"] = $props();
</script>

<ui
  style="color: red;"
  data-errors-for={forId}
  {...config.uiOptions?.errorsList}
>
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ui>
