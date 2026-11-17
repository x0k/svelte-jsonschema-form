<script lang="ts" module>
  import type { DatePickerRootProps } from "@skeletonlabs/skeleton-svelte";
  import "@sjsf/form/fields/extra-widgets/date-input";

  declare module "@sjsf/form" {
    interface UiOptions {
      skeleton5DateInput?: DatePickerRootProps;
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
