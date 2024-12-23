<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { title, type, forId, required }: ComponentProps<"title"> = $props();
</script>

{#if type === "field"}
  <label class="label-text" for={forId}>
    {title}
    {#if required}
      <span>*</span>
    {/if}
  </label>
{:else}
  <div class="font-bold text-xl">{title}</div>
{/if}
