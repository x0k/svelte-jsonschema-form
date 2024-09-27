<script lang="ts">
  import { getFormContext } from "../../context";
  import { getTemplate, getUiOptions, isSelect } from "../../utils";

  import type { FieldProps } from "../model";

  import StringSelectWidget from "./string-select-widget.svelte";
  import StringTextWidget from "./string-text-widget.svelte";

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"string"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", uiSchema));

  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
</script>

<Template
  showTitle={true}
  {name}
  {value}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
  {uiOptions}
>
  {#if isSelect(ctx, schema)}
    <StringSelectWidget
      {name}
      bind:value
      {schema}
      {uiSchema}
      {uiOptions}
      {idSchema}
      {required}
    />
  {:else}
    <StringTextWidget
      {name}
      bind:value
      {schema}
      {uiSchema}
      {uiOptions}
      {idSchema}
      {required}
    />
  {/if}
</Template>
