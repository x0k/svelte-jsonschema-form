<script lang="ts" module>
  import { Slider } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/range";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiRange?: Omit<SvelteComponentProps<typeof Slider>, "value">;
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

  function onchange(v: number) {
    value = v;
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<Slider
  bind:value={() => value ?? config.schema.minimum ?? 0, (v) => (value = v)}
  {...uiOptionProps("fluentuiRange")(
    {
      min: config.schema.minimum,
      max: config.schema.maximum,
      step: config.schema.multipleOf,
      disabled: isDisabled(ctx),
      onChange: onchange,
    },
    config,
    ctx
  )}
/>
