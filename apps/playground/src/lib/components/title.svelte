<script lang="ts">
  import type { ComponentProps } from "@/components/form";

  const { title, type, forId, required, ...props }: ComponentProps<"title"> =
    $props();
</script>

{#if type === "field"}
  <label for={forId}>
    {title}
    {#if required}
      <span>*</span>
    {/if}
  </label>
{:else}
  <p {...props}>{title}</p>
{/if}
