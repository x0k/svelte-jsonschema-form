<script lang="ts" module>
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { Options } from "vanilla-calendar-pro";

  declare module "@sjsf/form" {
    interface ComponentProps {
      daisyui5VcDatePickerWidget: WidgetCommonProps<string>;
    }
    interface ComponentBindings {
      daisyui5VcDatePickerWidget: "value";
    }
    interface UiOptions {
      daisyui5VcCalendarInput?: HTMLInputAttributes;
      daisyui5VcCalendarOptions?: Options;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import { getAbortSignal } from "svelte";

  import "vanilla-calendar-pro/styles/index.css";
  import type { Calendar } from "vanilla-calendar-pro";

  let {
    value = $bindable(),
    config,
    errors,
    handlers,
  }: ComponentProps["daisyui5VcDatePickerWidget"] = $props();

  const ctx = getFormContext();

  let input: HTMLInputElement;
  let calendar: Calendar | undefined;
  let deinit: (() => void) | undefined;

  $effect(() => {
    const signal = getAbortSignal();
    import("vanilla-calendar-pro").then(({ Calendar }) => {
      if (signal.aborted) {
        return;
      }
      calendar = new Calendar(
        input,
        uiOptionProps("daisyui5VcCalendarOptions")(
          {
            inputMode: true,
            selectedDates: value ? [value] : undefined,
            enableJumpToSelectedDate: true,
            onChangeToInput(self) {
              value = self.context.selectedDates[0];
              handlers.onchange?.();
            },
          },
          config,
          ctx
        )
      );
      deinit = calendar.init();
    });
    return () => {
      deinit?.();
      calendar?.destroy();
    };
  });
</script>

<input
  bind:this={input}
  class={["input input-border w-full", errors.length > 0 && "input-error"]}
  {...inputAttributes(ctx, config, "daisyui5VcCalendarInput", handlers, {
    type: "text",
    value,
  })}
/>
