<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import {
    formatLocalDate,
    parseLocalDateTime,
    replaceDatePart,
  } from "@sjsf/form/fields/date-time";
  import { getAbortSignal } from "svelte";

  import "vanilla-calendar-pro/styles/index.css";
  import type { Calendar } from "vanilla-calendar-pro";

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

  const inputValue = $derived(formatLocalDate(value));

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
            selectionDatesMode: "single",
            selectionTimeMode: false,
            selectedDates: value !== undefined ? [formatLocalDate(value)!] : [],
            enableJumpToSelectedDate: true,
            onChangeToInput(self) {
              const date = self.context.selectedDates[0];
              const datePart =
                date !== undefined ? parseLocalDateTime(date) : undefined;
              if (datePart !== undefined) {
                value = replaceDatePart(value, datePart);
              }
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
