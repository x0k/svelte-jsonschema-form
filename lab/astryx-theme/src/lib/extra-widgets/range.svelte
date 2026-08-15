<script lang="ts">
  import { Slider } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/extra-widgets/range.svelte";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["rangeWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(customInputAttributes(ctx, config, "range", {}));
</script>

<Slider
  label={config.title ?? "Range"}
  value={value ?? 0}
  onChange={(v: number) => {
    value = v;
    handlers.oninput?.();
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
