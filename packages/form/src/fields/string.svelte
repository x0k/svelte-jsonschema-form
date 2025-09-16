<script lang="ts" module>
  declare module "../form/index.js" {
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
  }: ComponentProps["stringField"] = $props();
</script>

<FieldBase
  {config}
  {uiOption}
  showTitle
  useLabel
  widgetType="textWidget"
  bind:value
  fromValue={(v) => v ?? undefined}
  toValue={(v) => v || uiOption("stringEmptyValue")}
/>
