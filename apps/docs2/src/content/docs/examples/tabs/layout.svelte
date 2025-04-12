<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import Layout from "@sjsf/basic-theme/components/layout.svelte";

  import Tabs from "./tabs.svelte";
  import Tab from "./tab.svelte";

  const props: ComponentProps["layout"] = $props();
</script>

{#if props.type === "array-items" && Array.isArray(props.config.schema.items)}
  <Tabs {...props} />
{:else if props.type === "array-item" && props.config.required}
  <Tab {...props} />
{:else if !(props.type === "array-field-meta" && props.config.required)}
  <Layout {...props} />
{/if}
