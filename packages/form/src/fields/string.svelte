<script lang="ts" module>
  const field = "stringField"
  declare module "../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface UiOptions {
      stringEmptyValue?: string;
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import FieldBase from "./field-base.svelte";

  let {
    config,
    value = $bindable(),
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
  widgetType="textWidget"
  fromValue={(v) => v ?? undefined}
  toValue={(v) => v || uiOption("stringEmptyValue")}
/>
