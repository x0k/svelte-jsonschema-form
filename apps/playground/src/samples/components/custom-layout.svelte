<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/components/form";

  const { config, type, children, attributes }: ComponentProps<"layout"> =
    $props();

  const ctx = getFormContext();

  // Default layout
  const Layout = $derived(
    getComponent(ctx, "layout", {
      ...config,
      uiSchema: {
        ...config.uiSchema,
        "ui:components": undefined,
      },
    })
  );
</script>

{#if type === "array-items"}
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem" data-layout="array-items" {...attributes}>
    {@render children()}
  </div>
{:else}
  <Layout {config} {type} {attributes} {children} />
{/if}
