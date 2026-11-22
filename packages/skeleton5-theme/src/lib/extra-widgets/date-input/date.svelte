<script lang="ts">
  import {
    customInputAttributes,
    getFormContext,
    getId,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";
  import {
    formatLocalDate,
    parseLocalDateTime,
    replaceDatePart,
  } from "@sjsf/form/fields/date-time";
  import { DatePicker, parseDate, Portal } from "@skeletonlabs/skeleton-svelte";

  let {
    value = $bindable(),
    config,
    handlers,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  const dateValue = $derived.by(() => {
    const date = formatLocalDate(value);
    return date !== undefined ? [parseDate(date)] : undefined;
  });
</script>

<DatePicker
  class="w-full"
  {...customInputAttributes(ctx, config, "skeleton5DateInput", {
    ids: {
      input: () => id,
    },
    value: dateValue,
    name: id,
    readOnly: config.schema.readOnly,
    onValueChange: (details) => {
      const date = details.value[0];
      value = replaceDatePart(
        value,
        date !== undefined ? parseLocalDateTime(date.toString()) : undefined
      );
    },
  })}
>
  <DatePicker.Control>
    <DatePicker.Input required={config.required} {...handlers} />
    <DatePicker.Trigger />
  </DatePicker.Control>
  <Portal>
    <DatePicker.Positioner>
      <DatePicker.Content>
        <DatePicker.View view="day">
          <DatePicker.Context>
            {#snippet children(datePicker)}
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.TableHead>
                  <DatePicker.TableRow>
                    {#each datePicker().weekDays as weekDay, id (id)}
                      <DatePicker.TableHeader
                        >{weekDay.short}</DatePicker.TableHeader
                      >
                    {/each}
                  </DatePicker.TableRow>
                </DatePicker.TableHead>
                <DatePicker.TableBody>
                  {#each datePicker().weeks as week, id (id)}
                    <DatePicker.TableRow>
                      {#each week as day, id (id)}
                        <DatePicker.TableCell value={day}>
                          <DatePicker.TableCellTrigger
                            >{day.day}</DatePicker.TableCellTrigger
                          >
                        </DatePicker.TableCell>
                      {/each}
                    </DatePicker.TableRow>
                  {/each}
                </DatePicker.TableBody>
              </DatePicker.Table>
            {/snippet}
          </DatePicker.Context>
        </DatePicker.View>
        <DatePicker.View view="month">
          <DatePicker.Context>
            {#snippet children(datePicker)}
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.TableBody>
                  {#each datePicker().getMonthsGrid( { columns: 4, format: "short" } ) as months, id (id)}
                    <DatePicker.TableRow>
                      {#each months as month, id (id)}
                        <DatePicker.TableCell value={month.value}>
                          <DatePicker.TableCellTrigger
                            >{month.label}</DatePicker.TableCellTrigger
                          >
                        </DatePicker.TableCell>
                      {/each}
                    </DatePicker.TableRow>
                  {/each}
                </DatePicker.TableBody>
              </DatePicker.Table>
            {/snippet}
          </DatePicker.Context>
        </DatePicker.View>
        <DatePicker.View view="year">
          <DatePicker.Context>
            {#snippet children(datePicker)}
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.TableBody>
                  {#each datePicker().getYearsGrid( { columns: 4 } ) as years, id (id)}
                    <DatePicker.TableRow>
                      {#each years as year, id (id)}
                        <DatePicker.TableCell value={year.value}>
                          <DatePicker.TableCellTrigger
                            >{year.label}</DatePicker.TableCellTrigger
                          >
                        </DatePicker.TableCell>
                      {/each}
                    </DatePicker.TableRow>
                  {/each}
                </DatePicker.TableBody>
              </DatePicker.Table>
            {/snippet}
          </DatePicker.Context>
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Positioner>
  </Portal>
</DatePicker>
