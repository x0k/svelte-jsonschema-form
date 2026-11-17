<script lang="ts" module>
  import type { DatepickerProps, TimepickerProps } from "flowbite-svelte/types";
  import "@sjsf/form/fields/extra-widgets/date-input";

  declare module "@sjsf/form" {
    interface UiOptions {
      flowbite3DateInput?: DatepickerProps;
      flowbite3TimeInput?: TimepickerProps;
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  import DateInputDate from "./date-input/date.svelte";
  import DateInputDatetime from "./date-input/datetime.svelte";
  import DateInputTime from "./date-input/time.svelte";

  let {
    value = $bindable(),
    inputType,
    ...props
  }: ComponentProps["dateInputWidget"] = $props();
</script>

{#if inputType === "time"}
  <DateInputTime bind:value {...props} />
{:else if inputType === "datetime"}
  <DateInputDatetime bind:value {...props} />
{:else}
  <DateInputDate bind:value {...props} />
{/if}
