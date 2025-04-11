<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  import Tabs from "./tabs.svelte";
  import Tab from "./tab.svelte";

  const props: ComponentProps["layout"] = $props();

  const ctx = getFormContext();
</script>

{#if props.type === "array-items"}
  <Tabs {...props} />
{:else if props.type === "array-item"}
  <Tab {...props} />
{:else}
  {@const Layout = getComponent(ctx, "layout", {
    ...props.config,
    uiSchema: {
      ...props.config.uiSchema,
      "ui:components": undefined,
    },
  })}
  <Layout {...props} />
{/if}
