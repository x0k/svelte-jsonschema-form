<script lang="ts">
  import type { ClassValue } from "svelte/elements";

  import type { Node } from "$lib/builder/node.js";

  import { getBuilderContext } from "./context.svelte.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    node: Node;
    class?: ClassValue;
  }

  const { node, class: className }: Props = $props();

  const ctx = getBuilderContext();

  const data = $derived({
    errors: ctx.errors[node.id],
    warnings: ctx.warnings[node.id],
  });
</script>

{#snippet listOf(type: keyof typeof data)}
  {@const issues = data[type]}
  {#if issues !== undefined && issues.length > 0}
    <ul
      class={[
        "list-inside list-disc",
        {
          "text-destructive": type === "errors",
          "text-chart-3": type === "warnings",
        },
      ]}
    >
      {#each issues as issue}
        <li>{issue.message}</li>
      {/each}
    </ul>
  {/if}
{/snippet}

{#if data.errors || data.warnings}
  <div class={cn("p-2 flex flex-col gap-2", className)}>
    {@render listOf("errors")}
    {@render listOf("warnings")}
  </div>
{/if}
