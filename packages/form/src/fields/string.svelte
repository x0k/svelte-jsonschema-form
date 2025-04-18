<script lang="ts" module>
  declare module "../form/index.js" {
    interface UiOptions {
      stringEmptyValue?: string;
    }
  }
</script>

<script lang="ts">
  import { identity } from "@/lib/function.js";
  import type { ComponentProps } from "@/form/index.js";

  import FieldBase from "./field-base.svelte";

  let { config, value = $bindable() }: ComponentProps["stringField"] = $props();
</script>

<FieldBase
  {config}
  showTitle
  useLabel
  widgetType="textWidget"
  bind:value
  fromValue={identity}
  toValue={(v) => v || config.uiOptions?.stringEmptyValue}
/>
