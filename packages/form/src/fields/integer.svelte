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

  let { value = $bindable(), config }: ComponentProps["integerField"] =
    $props();
</script>

<FieldBase
  {config}
  showTitle
  useLabel
  widgetType="numberWidget"
  bind:value={
    () => value,
    (v) => {
      if (Number.isInteger(v)) {
        value = v;
      } else if (v === undefined) {
        value = config.uiOptions?.numberEmptyValue;
      }
    }
  }
  fromValue={identity}
  toValue={identity}
/>
