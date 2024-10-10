<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { errors }: ComponentProps<"errorsList"> = $props();
</script>

<ui class="text-error">
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ui>
