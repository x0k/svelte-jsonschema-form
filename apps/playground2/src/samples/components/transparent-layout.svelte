<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const props: ComponentProps["layout"] = $props();

  const ctx = getFormContext();
</script>

{#if props.type === "multi-field-controls"}
  {@const Layout = getComponent(ctx, "layout", {
    ...props.config,
    uiSchema: {
      ...props.config.uiSchema,
      "ui:components": undefined,
    },
  })}
  <Layout {...props} />
{:else}
  {@render props.children()}
{/if}
