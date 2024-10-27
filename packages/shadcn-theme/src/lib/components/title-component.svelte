<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import { Label } from './ui/label'

  const { title, type, forId, required }: ComponentProps<"title"> = $props();
</script>

{#if type === "field"}
  <Label for={forId}>
    {title}
    {#if required}
      <span>*</span>
    {/if}
  </Label>
{:else}
  <div class="text-lg font-bold">{title}</div>
{/if}
