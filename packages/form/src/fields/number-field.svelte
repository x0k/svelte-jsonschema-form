<script lang="ts" module>
  const field = "numberField";
  declare module "../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface UiOptions {
      numberEmptyValue?: number;
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import FieldBase from "./field-base.svelte";

  let {
    value = $bindable(),
    config,
    uiOption,
  }: ComponentProps[typeof field] = $props();
</script>

<FieldBase
  {field}
  {config}
  {uiOption}
  showTitle
  useLabel
  bind:value
  widgetType="numberWidget"
  fromValue={(v) => v ?? undefined}
  toValue={(v) => v ?? uiOption("numberEmptyValue")}
/>
