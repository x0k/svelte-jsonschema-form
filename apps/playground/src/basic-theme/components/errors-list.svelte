<script lang="ts">
  import type { ComponentProps } from "@/form";

  const { errors }: ComponentProps<"errorsList"> = $props();
</script>

<ui style="color: red;">
  {#each errors as err}
    <li>{err.message}</li>
  {/each}
</ui>
