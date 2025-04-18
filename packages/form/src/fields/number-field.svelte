<script lang="ts" module>
  declare module "../form/index.js" {
    interface UiOptions {
      numberEmptyValue?: number;
    }
  }
</script>

<script lang="ts">
  import { identity } from "@/lib/function.js";
  import type { ComponentProps } from "@/form/index.js";

  import FieldBase from "./field-base.svelte";

  let { value = $bindable(), config }: ComponentProps["numberField"] = $props();
</script>

<FieldBase
  {config}
  showTitle
  useLabel
  widgetType="numberWidget"
  bind:value
  fromValue={identity}
  toValue={(v) => v ?? config.uiOptions?.numberEmptyValue}
/>
