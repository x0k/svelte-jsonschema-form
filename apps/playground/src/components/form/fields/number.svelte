<script lang="ts">
  import { noop } from '@/lib/function';

  import { getFormContext } from "../context";
  import { getUiOptions, getWidget, getWidgetProps } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();

  let {
    name,
    value = $bindable(),
    schema,
    idSchema,
    uiSchema,
    required,
  }: FieldProps<"number"> = $props();

  const Widget = $derived(getWidget(ctx, "number", uiSchema));
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
</script>

<Widget
  {...getWidgetProps(ctx, name, schema, uiSchema, idSchema, uiOptions)}
  bind:value
  {required}
  onblur={noop}
  onfocus={noop}
/>
