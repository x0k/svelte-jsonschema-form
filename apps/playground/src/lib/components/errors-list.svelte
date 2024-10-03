<script lang="ts">
  import type { ComponentProps } from "@/components/form";

  const { errors }: ComponentProps<"errorsList"> = $props();
</script>

<ui style="color: red;">
  {#each errors as err (err.message)}
    <li>{err.message}</li>
  {/each}
</ui>
