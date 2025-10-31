<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/date-picker";

  declare module "@sjsf/form" {
    interface UiOptions {
      datePicker?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    Datalist,
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["datePickerWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "datePicker", handlers, {
      type: "date",
      style: "flex-grow: 1",
    })
  );
</script>

<input bind:value {...attributes} />
<Datalist id={attributes.list} {config} />
