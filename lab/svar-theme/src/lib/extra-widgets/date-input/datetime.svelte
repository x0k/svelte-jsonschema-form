<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";

  import DateInputDate from "./date.svelte";
  import DateInputTime from "./time.svelte";

  let {
    value = $bindable(),
    ...props
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> = $props();
</script>

<div style="display: flex; gap: 0.5rem; align-items: center; width: 100%;">
  <div style="flex-grow: 1; min-width: 0;">
    <DateInputDate bind:value {...props} />
  </div>
  <div style="width: 8rem; flex-shrink: 0;">
    <DateInputTime bind:value {...props} paired />
  </div>
</div>
