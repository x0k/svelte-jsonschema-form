<script lang="ts">
  import {
    customInputAttributes,
    getFormContext,
    handlersAttachment,
    getId,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";
  import {
    formatLocalDate,
    parseLocalDateTime,
    replaceDatePart,
  } from "@sjsf/form/fields/date-time";
  import Datepicker from "flowbite-svelte/Datepicker.svelte";

  let {
    value = $bindable(),
    config,
    handlers,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onChange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<div class="w-full">
  <Datepicker
    bind:value={
      () => {
        const date = formatLocalDate(value);
        return date !== undefined ? parseLocalDateTime(date) : undefined;
      },
      (v) => (value = replaceDatePart(value, v))
    }
    {...customInputAttributes(ctx, config, "flowbite3DateInput", {
      inputProps: handlersAttachment(handlers)({
        id,
        name: id,
      }),
      required: config.required,
      showActionButtons: true,
      autohide: false,
      onselect: onChange,
      onclear: onChange,
    })}
  />
</div>
