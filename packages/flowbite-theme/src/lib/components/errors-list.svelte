<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { errors, forId }: ComponentProps<"errorsList"> = $props();
</script>

<ui class="text-red-700 dark:text-red-500" data-errors-for={forId}>
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ui>
