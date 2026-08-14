<script lang="ts" module>
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";
  import { ColorPicker as StdfColorPicker } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface ComponentProps {
      stdfColorPickerWidget: WidgetCommonProps<string>;
    }
    interface ComponentBindings {
      stdfColorPickerWidget: "value";
    }
    interface UiOptions {
      stdfColorPicker?: SvelteComponentProps<typeof StdfColorPicker>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["stdfColorPickerWidget"] = $props();

  const ctx = getFormContext();

  function onchange(_colors: string[]) {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<StdfColorPicker
  bind:value={
    () => value ?? "", (v) => (value = typeof v === "string" ? v : undefined)
  }
  {...uiOptionProps("stdfColorPicker")(
    {
      onchange,
    },
    config,
    ctx
  )}
/>
