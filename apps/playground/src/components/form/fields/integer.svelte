<script lang="ts">
  import { createTransformation } from "@/lib/svelte.svelte";
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

  const transformation = createTransformation({
    transform: () => value,
    guard: (v) => Number.isInteger(v) || v === null,
    update: (v) => {
      value = v;
    },
  });
  const uiOptions = $derived(getUiOptions(ctx, uiSchema))
</script>

<Widget
  {...getWidgetProps(ctx, name, schema, uiSchema, idSchema, uiOptions)}
  bind:value={transformation.value}
  {required}
  onfocus={noop}
  onblur={noop}
/>
