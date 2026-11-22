<script lang="ts">
  import {
    getFormContext,
    handlersAttachment,
    getId,
    isDisabled,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";
  import {
    formatLocalInputTime,
    parseLocalTime,
    replaceTimePart,
  } from "@sjsf/form/fields/date-time";

  let {
    value = $bindable(),
    config,
    errors,
    handlers,
    paired = false,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> & {
    paired?: boolean;
  } = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  const attributes = $derived(
    handlersAttachment(handlers)({
      id: paired ? `${id}-time` : id,
      name: paired ? `${id}-time` : id,
      required: config.required,
      readonly: config.schema.readOnly,
      disabled: isDisabled(ctx),
      "aria-invalid": errors.length > 0,
      ...(paired ? { "aria-label": config.title } : {}),
    })
  );
</script>

<input
  type="time"
  step="1"
  class="input"
  bind:value={
    () => formatLocalInputTime(value),
    (v) => (value = replaceTimePart(value, parseLocalTime(v)))
  }
  {...attributes}
/>
