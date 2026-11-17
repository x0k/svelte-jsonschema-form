<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import {
    formatLocalDate,
    formatLocalDateTime,
    formatLocalInputTime,
    parseLocalDateTime,
    parseLocalTime,
    replaceDatePart,
    replaceTimePart,
  } from "@sjsf/form/fields/date-time";
  import { getAbortSignal } from "svelte";

  import "vanilla-calendar-pro/styles/index.css";
  import { time, type Calendar } from "vanilla-calendar-pro";

  import "./options.js";

  let {
    value = $bindable(),
    config,
    errors,
    handlers,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> = $props();

  const ctx = getFormContext();

  const attributes = $derived.by(() => {
    // The handlers are attached by hand below: typed text is committed on
    // `change`, not on every `input`, so the value is not normalized while the
    // user is still typing.
    const props = inputAttributes(ctx, config, "dateInput", {}, {});
    props.type = "text";
    return props;
  });

  function handleChange(event: Event) {
    const raw = (event.currentTarget as HTMLInputElement).value.trim();
    value = raw === "" ? undefined : parseLocalDateTime(raw.replace(" ", "T"));
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const inputValue = $derived(formatLocalDateTime(value));

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
        uiOptionProps("daisyui5DateInputOptions")(
          {
            inputMode: true,
            extensions: [time],
            selectionDatesMode: "single",
            selectionTimeMode: 24,
            selectedDates: value !== undefined ? [formatLocalDate(value)!] : [],
            selectedTime:
              value !== undefined
                ? formatLocalInputTime(value)?.slice(0, 5)
                : undefined,
            enableJumpToSelectedDate: true,
            onChangeToInput(self) {
              const date = self.context.selectedDates[0];
              const time = self.context.selectedTime;
              const datePart =
                date !== undefined ? parseLocalDateTime(date) : undefined;
              const timePart =
                time !== undefined ? parseLocalTime(time) : undefined;
              const withDate =
                datePart !== undefined
                  ? replaceDatePart(value, datePart)
                  : value;
              value =
                timePart !== undefined
                  ? replaceTimePart(withDate, timePart)
                  : withDate;
              handlers.oninput?.();
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
  value={inputValue}
  {...attributes}
  onchange={handleChange}
  onblur={handlers.onblur}
/>
