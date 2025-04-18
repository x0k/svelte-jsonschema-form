<script lang="ts">
  import { identity } from "@/lib/function.js";
  import type { ComponentProps } from "@/form/index.js";

  import FieldBase from "./field-base.svelte";

  let { config, value = $bindable() }: ComponentProps["booleanField"] =
    $props();
</script>

<FieldBase
  {config}
  bind:value
  widgetType="checkboxWidget"
  showTitle={config.uiOptions?.hideTitle === false}
  useLabel
  fromValue={identity}
  toValue={identity}
/>
