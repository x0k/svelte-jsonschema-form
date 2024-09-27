<script lang="ts">
  import type { Schema, SchemaValue } from '../../schema';
  import type { UiSchema } from '../../ui-schema';
  import type { IdSchema } from '../../id-schema';
  import { getFormContext } from '../../context';
  import { getComponent, getField, getTemplate, getUiOptions, isDisabledOrReadonly } from '../../utils';
  
  import ObjectKeyInput from './object-key-input.svelte';
  import { getObjectContext } from './context';

  let {
    property,
    isAdditional,
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: {
    property: string;
    isAdditional: boolean;
    name: string;
    value: SchemaValue | undefined;
    schema: Schema;
    uiSchema: UiSchema;
    idSchema: IdSchema<SchemaValue> | undefined;
    required: boolean;
  } = $props()

  const ctx = getFormContext()
  const objCtx = getObjectContext()

  const Template = $derived(getTemplate(ctx, "object-property", uiSchema))
  const Field = $derived(getField(ctx, "root", uiSchema))
  const Button = $derived(getComponent(ctx, "button", uiSchema))
  const uiOptions = $derived(getUiOptions(ctx, uiSchema))
  const disabledOrReadonly = $derived(
    isDisabledOrReadonly(ctx, uiOptions?.input)
  )
</script>

{#snippet keyInput()}
  <ObjectKeyInput
    {property}
    {name}
    uiSchema={uiSchema.additionalPropertyKeyInput ?? {}}
    {idSchema}
  />
{/snippet}
{#snippet removeButton()}
  <Button
    type="object-property-remove"
    disabled={disabledOrReadonly}
    onclick={(e) => {
      e.preventDefault();
      if (objCtx.value === undefined) {
        console.warn("Object value is undefined")
        return
      }
      delete objCtx.value[property]
    }}
  />
{/snippet}
<Template
  {property}
  {name}
  {value}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
  {uiOptions}
  keyInput={isAdditional ? keyInput : undefined}
  removeButton={isAdditional ? removeButton : undefined}
>
  <Field
    bind:value
    {name}
    {required}
    {schema}
    {uiSchema}
    {idSchema}
  />
</Template>
