<script lang="ts">
  import type { ComponentProps } from "@/components/form";

  const { title, type, forId, required, ...props }: ComponentProps<"title"> =
    $props();
</script>

{#if type === "field"}
  <label style="font-weight: bold; padding-bottom: 0.5rem;" for={forId}>
    {title}
    {#if required}
      <span>*</span>
    {/if}
  </label>
{:else}
  <div style="font-weight: bold; padding-bottom: 0.5rem;" {...props}>{title}</div>
{/if}
