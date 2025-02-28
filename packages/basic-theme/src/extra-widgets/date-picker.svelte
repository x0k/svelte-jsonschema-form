<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/legacy-fields/extra-widgets/date-picker";

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
    inputAttributes(ctx, config, handlers, config.uiOptions?.datePicker)
  );
</script>

<input type="date" bind:value style="flex-grow: 1" {...attributes} />
<Datalist id={attributes.list} {config} />
