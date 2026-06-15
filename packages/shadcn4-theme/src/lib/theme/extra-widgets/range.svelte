<script lang="ts" module>
  import type { SliderSingleRootProps, WithoutChildrenOrChild } from "bits-ui";
  import "@sjsf/form/fields/extra-widgets/range";

  import "../types/slider.js";

  declare module "@sjsf/form" {
    interface UiOptions {
      shadcn4Range?: Omit<
        WithoutChildrenOrChild<SliderSingleRootProps>,
        "type"
      >;
    }
  }
</script>

<script lang="ts">
  import {
    customInputAttributes,
    getFormContext,
    getId,
    type ComponentProps,
  } from "@sjsf/form";

  import { getThemeContext } from "../context.js";

  const ctx = getFormContext();
  const themeCtx = getThemeContext();

  const { Slider } = $derived(themeCtx.components);

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["rangeWidget"] = $props();

  const id = $derived(getId(ctx, config.path));
</script>

<Slider
  bind:value={() => value ?? 0, (v) => (value = v)}
  {...customInputAttributes(ctx, config, "shadcn4Range", {
    id,
    min: config.schema.minimum,
    max: config.schema.maximum,
    step: config.schema.multipleOf,
    onValueChange: handlers.oninput,
    onValueCommit: handlers.onchange,
  })}
  type="single"
/>
