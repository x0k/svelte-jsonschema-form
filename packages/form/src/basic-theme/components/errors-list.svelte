<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      /**
       * Overrides the attributes of the errors list.
       */
      errorsList?: HTMLAttributes<HTMLUListElement>;
    }
  }
</script>

<script lang="ts">
  import type { Components } from "@/form/index.js";

  const { errors, forId, config }: Components["errorsList"] = $props();
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
