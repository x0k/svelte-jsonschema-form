<script lang="ts">
  import { getFormContext } from '../../context.js';
  import { getTemplate } from '../../templates/index.js';
  import { getComponent } from '../../component.js';
  import { getErrors } from '../../utils.js';

  import { getField, type FieldProps } from '../model.js';
  import { isDisabledOrReadonly } from '../../is-disabled-or-readonly.js'
  
  import ObjectKeyInput from './object-key-input.svelte';

  let {
    config,
    property,
    isAdditional,
    value = $bindable(),
    obj = $bindable(),
  }: FieldProps<"objectProperty"> = $props()

  const ctx = getFormContext()

  const Template = $derived(getTemplate(ctx, "object-property", config))
  const Field = $derived(getField(ctx, "root", config))
  const Button = $derived(getComponent(ctx, "button", config))
  const disabledOrReadonly = $derived(
    isDisabledOrReadonly(ctx, config.uiOptions?.input)
  )
  const errors = $derived(getErrors(ctx, config.idSchema))
</script>

{#snippet keyInput()}
  <ObjectKeyInput
    bind:obj
    {property}
    name={config.name}
    uiSchema={config.uiSchema.additionalPropertyKeyInput ?? {}}
    idSchema={config.idSchema}
  />
{/snippet}
{#snippet removeButton()}
  <Button
    {errors}
    {config}
    type="object-property-remove"
    disabled={disabledOrReadonly}
    onclick={(e) => {
      e.preventDefault();
      delete obj[property]
    }}
  >
    {ctx.translation("remove-object-property")}
  </Button>
{/snippet}
<Template
  {property}
  {value}
  {config}
  {errors}
  keyInput={isAdditional ? keyInput : undefined}
  removeButton={isAdditional ? removeButton : undefined}
>
  <Field
    bind:value
    {config}
  />
</Template>
