<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  const { errors, forId }: ComponentProps<"errorsList"> = $props();
</script>

<ui style="color: red;" data-errors-for={forId}>
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ui>
