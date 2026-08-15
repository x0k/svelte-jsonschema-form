<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      astryxRangeSlider?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import { Slider } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/range-slider";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["rangeSliderWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    customInputAttributes(ctx, config, "astryxRangeSlider", {})
  );
</script>

<Slider
  label={config.title ?? "Range"}
  value={[value?.start ?? 0, value?.end ?? 0]}
  onChange={(v: [number, number]) => {
    value = { start: v[0], end: v[1] };
    handlers.oninput?.();
  }}
  onChangeEnd={() => {
    handlers.onchange?.();
  }}
  min={typeof config.schema?.minimum === "number" ? config.schema.minimum : 0}
  max={typeof config.schema?.maximum === "number" ? config.schema.maximum : 100}
  step={typeof config.schema?.multipleOf === "number"
    ? config.schema.multipleOf
    : 1}
  isDisabled={attributes.disabled === true}
  isLabelHidden
/>
