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
    customInputAttributes,
    getFormContext,
    getId,
    isDisabled,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["rangeWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  // `Slider` throws when `min >= max` or `step > max - min`, so the schema
  // bounds have to be widened into a valid range before they are handed over.
  const min = $derived(config.schema.minimum ?? 0);
  const max = $derived(config.schema.maximum ?? min + 100);
  const step = $derived.by(() => {
    const span = max - min;
    const { multipleOf } = config.schema;
    return typeof multipleOf === "number" &&
      multipleOf > 0 &&
      multipleOf <= span
      ? multipleOf
      : Math.min(1, span);
  });

  // `Slider` only invokes its `onChange` callback from the clamping watcher,
  // never on drag or keyboard, and its root element is a `role="slider"` div
  // that emits no native `input`/`change`. The binding setter is the only
  // reliable notification point.
  function update(v: number) {
    value = v;
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const attributes = $derived(
    customInputAttributes(ctx, config, "fluentuiRange", {
      id,
      "aria-label": config.title,
      min,
      max,
      step,
      disabled: isDisabled(ctx) || config.schema.readOnly === true,
    })
  );
</script>

<Slider bind:value={() => value ?? min, update} {...attributes} />
