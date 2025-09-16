<script lang="ts">
  import { identity } from "@/lib/function.js";
  import type { ComponentProps } from "@/form/index.js";

  import FieldBase from "./field-base.svelte";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["booleanField"] = $props();
</script>

<FieldBase
  {config}
  {uiOption}
  bind:value
  widgetType="checkboxWidget"
  showTitle={uiOption("hideTitle") === false}
  useLabel
  fromValue={(v) => v ?? undefined}
  toValue={identity}
/>
