<script lang="ts" module>
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";
  import type { Range } from "@sjsf/form/lib/range";
  import { Calendar as StdfCalendar, Cell as StdfCell } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/date-range-picker";

  declare module "@sjsf/form" {
    interface ComponentProps {
      // TODO: Remove in v4
      /** @deprecated use `dateRangePickerWidget` instead */
      stdfDateRangePickerWidget: WidgetCommonProps<Partial<Range<string>>>;
    }
    interface ComponentBindings {
      // TODO: Remove in v4
      /** @deprecated use `dateRangePickerWidget` instead */
      stdfDateRangePickerWidget: "value";
    }
    interface UiOptions {
      stdfDateRangePicker?: SvelteComponentProps<typeof StdfCalendar>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["dateRangePickerWidget"] = $props();

  const ctx = getFormContext();

  let visible = $state(false);

  const initSelectedDates = $derived(
    value?.start && value.end
      ? [value.start.replaceAll("-", ""), value.end.replaceAll("-", "")]
      : value?.start
        ? [value.start.replaceAll("-", "")]
        : []
  );

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }

  function onconfirm(dates: string[]) {
    visible = false;
    value =
      dates.length === 2
        ? { start: dates[0], end: dates[1] }
        : dates.length === 1
          ? { start: dates[0] }
          : undefined;
    onchange();
  }
</script>

<StdfCell
  title={config.title}
  detail={value?.start && value.end
    ? `${value.start} — ${value.end}`
    : (value?.start ?? "")}
  right="arrow"
  onclick={() => (visible = true)}
/>

<StdfCalendar
  bind:visible
  mode="range"
  {initSelectedDates}
  outFormat="YYYY-MM-DD"
  {...uiOptionProps("stdfDateRangePicker")(
    {
      onconfirm,
    },
    config,
    ctx
  )}
/>
