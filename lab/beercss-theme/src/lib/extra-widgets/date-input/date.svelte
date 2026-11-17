<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { dateInputProcessor } from "@sjsf/form/fields/date-time";
  import "@sjsf/form/fields/extra-widgets/date-input";

  import "./options.js";

  let {
    value = $bindable(),
    config,
    handlers,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> = $props();

  const ctx = getFormContext();

  const processor = dateInputProcessor("date");

  const attributes = $derived.by(() => {
    const props = inputAttributes(ctx, config, "dateInput", handlers, {
      type: processor.nativeType,
    });
    props.step ??= processor.step;
    return props;
  });
</script>

<input
  bind:value={() => processor.get(value), (v) => (value = processor.set(v))}
  {...attributes}
/>
