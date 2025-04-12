<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import { getArrayContext } from "@sjsf/form/fields/array/context.svelte";
  import Layout from "@sjsf/basic-theme/components/layout.svelte";

  import Tabs from "./tabs.svelte";
  import Tab from "./tab.svelte";

  const props: ComponentProps["layout"] = $props();

  const arrCtx = getArrayContext();

  const isTuple = $derived(arrCtx.fieldType === "tupleField");
</script>

{#if props.type === "array-items" && isTuple}
  <Tabs {...props} />
{:else if props.type === "array-item" && isTuple}
  <Tab {...props} />
{:else if !(props.type === "array-field-meta" && isTuple)}
  <Layout {...props} />
{/if}
