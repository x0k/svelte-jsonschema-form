<script lang="ts">
  import { getLocalTimeZone, parseDate } from "@internationalized/date";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import {
    ariaInvalidProp,
    composeProps,
    customInputAttributes,
    getFormContext,
    handlersAttachment,
    retrieveUiOption,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";
  import {
    formatLocalDate,
    replaceDatePart,
  } from "@sjsf/form/fields/date-time";

  import { getThemeContext } from "../../context.js";

  const ctx = getFormContext();
  const themeCtx = getThemeContext();

  const { Popover, PopoverTrigger, Button, PopoverContent, Calendar } =
    $derived(themeCtx.components);

  let {
    value = $bindable(),
    config,
    handlers,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> = $props();

  const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

  const attributes = $derived(
    customInputAttributes(ctx, config, "shadcn4DateInput", {
      initialFocus: true,
      onValueChange: () => {
        oninput?.();
        onchange?.();
      },
    })
  );

  const parsedDate = $derived.by(() => {
    const date = formatLocalDate(value);
    return date !== undefined ? parseDate(date) : undefined;
  });

  const formatDate = $derived.by(() => {
    const formatter = retrieveUiOption(
      ctx,
      config,
      "shadcn4DateInputFormatter"
    );
    if (formatter !== undefined) {
      return formatter;
    }
    const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
    });
    return (date: Date) => dateTimeFormat.format(date);
  });

  const triggerContent = $derived(
    value !== undefined ? formatDate(value) : undefined
  );
</script>

<Popover>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        class="w-full justify-between font-normal"
        {...composeProps(
          ctx,
          config,
          {},
          uiOptionProps("shadcn4DateInputTrigger"),
          handlersAttachment(buttonHandlers),
          ariaInvalidProp
        )}
      >
        <span>
          {triggerContent}
        </span>
        <ChevronDownIcon />
      </Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent>
    <Calendar
      bind:value={
        () => parsedDate,
        (v) => (value = replaceDatePart(value, v?.toDate(getLocalTimeZone())))
      }
      {...attributes}
      type="single"
    />
  </PopoverContent>
</Popover>
