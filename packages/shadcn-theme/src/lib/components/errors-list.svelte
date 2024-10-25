<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { errors, forId }: ComponentProps<"errorsList"> = $props();
</script>

<ui class="text-error-500" data-errors-for={forId}>
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ui>
