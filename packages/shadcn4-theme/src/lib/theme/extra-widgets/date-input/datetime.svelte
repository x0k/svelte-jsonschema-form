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

<div class="flex w-full items-center gap-2">
  <div class="grow">
    <DateInputDate bind:value {...props} />
  </div>
  <div class="w-36 shrink-0">
    <DateInputTime bind:value {...props} paired />
  </div>
</div>
