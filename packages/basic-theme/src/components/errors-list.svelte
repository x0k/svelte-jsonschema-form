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
  import { getFormContext, type ComponentProps } from "@sjsf/form";

  const { errors, config }: ComponentProps["errorsList"] = $props();

  const ctx = getFormContext();
</script>

<ui
  style="color: red;"
  data-errors-for={config.id}
  {...config.uiOptions?.errorsList}
  {...ctx.extraUiOptions?.("errorsList", config)}
>
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ui>
