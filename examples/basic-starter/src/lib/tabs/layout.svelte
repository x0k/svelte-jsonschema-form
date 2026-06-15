<script lang="ts">
  import Layout from "@sjsf/basic-theme/components/layout.svelte";
  import type { ComponentProps } from "@sjsf/form";
  import { isFixedItems } from "@sjsf/form/core";
  import { getArrayContext } from "@sjsf/form/fields/array/context.svelte";

  import Tab from "./tab.svelte";
  import Tabs from "./tabs.svelte";

  const props: ComponentProps["layout"] = $props();

  const arrCtx = getArrayContext();

  const isTuple = $derived(isFixedItems(arrCtx.config().schema));
</script>

{#if props.type === "array-items" && isTuple}
  <Tabs {...props} />
{:else if props.type === "array-item" && isTuple}
  <Tab {...props} />
{:else if !(props.type === "array-field-meta" && isTuple)}
  <Layout {...props} />
{/if}
