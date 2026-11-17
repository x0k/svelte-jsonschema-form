<script lang="ts">
  import {
    Datalist,
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";
  import { dateInputProcessor } from "@sjsf/form/fields/date-time";

  import "./options.js";

  let {
    value = $bindable(),
    config,
    handlers,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> = $props();

  const ctx = getFormContext();

  const processor = dateInputProcessor("time");

  const attributes = $derived.by(() => {
    const props = inputAttributes(ctx, config, "dateInput", handlers, {
      type: processor.nativeType,
      class: "sjsf-text",
    });
    props.step ??= processor.step;
    return props;
  });
</script>

<input
  bind:value={() => processor.get(value), (v) => (value = processor.set(v))}
  {...attributes}
/>
<Datalist id={attributes.list} {config} />
