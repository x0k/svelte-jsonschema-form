<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { title, type, forId, required }: ComponentProps<"title"> = $props();
</script>

{#if type === "field"}
  <label class="m3-font-label-large" for={forId}>
    {title}
    {#if required}
      <span>*</span>
    {/if}
  </label>
{:else}
  <div class="m3-font-title-large">{title}</div>
{/if}
