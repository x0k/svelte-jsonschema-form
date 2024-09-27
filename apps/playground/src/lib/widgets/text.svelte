<script lang="ts">
  import { getFormContext, type WidgetProps } from "@/components/form";
  import { getUiOptions } from "@/components/form/utils";

  let {
    value = $bindable(),
    schema,
    uiSchema,
    ...rest
  }: WidgetProps<"text"> = $props();
  const ctx = getFormContext();
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
</script>

<input
  {...rest}
  type={uiOptions?.inputType ?? "text"}
  bind:value
  name={rest.id}
  minlength={schema.minLength}
  pattern={schema.pattern}
/>
