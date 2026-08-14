<script lang="ts" module>
  import { Slider as StdfSlider } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/range";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfRange?: SvelteComponentProps<typeof StdfSlider>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    isDisabled,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["rangeWidget"] = $props();

  const ctx = getFormContext();
</script>

<StdfSlider
  bind:value={() => value ?? config.schema.minimum ?? 0, (v) => (value = v)}
  minRange={config.schema.minimum}
  maxRange={config.schema.maximum}
  step={config.schema.multipleOf}
  {...uiOptionProps("stdfRange")(
    {
      disabled: isDisabled(ctx),
      onchange: (_value, _valueRange, _label, _labelRange) => {
        handlers.oninput?.();
        handlers.onchange?.();
      },
    },
    config,
    ctx
  )}
/>
