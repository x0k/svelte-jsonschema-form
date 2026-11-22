<script lang="ts" module>
  import type {
    Calendar as _Calendar,
    CalendarSingleRootProps,
    WithoutChildrenOrChild,
  } from "bits-ui";
  import type { Component } from "svelte";
  import "@sjsf/form/fields/extra-widgets/date-input";

  import type { ButtonProps } from "../types/button.js";
  import "../types/popover.js";

  declare module "@sjsf/form" {
    interface UiOptions {
      shadcn4DateInput?: Omit<
        WithoutChildrenOrChild<CalendarSingleRootProps>,
        "type"
      >;
      shadcn4DateInputTrigger?: ButtonProps;
      shadcn4DateInputFormatter?: (date: Date) => string;
    }
  }

  declare module "../context.js" {
    interface ThemeComponents {
      // @ts-expect-error too complex
      Calendar: Component<
        WithoutChildrenOrChild<_Calendar.RootProps>,
        {},
        "value" | "placeholder" | "ref"
      >;
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
