<script lang="ts">
  import type { SchemaValue } from '../../schema';
  import type { Config } from '../../config';
  import { getFormContext } from '../../context';
  import { getTemplate } from '../../templates';
  import { getComponent } from '../../component';

  import { getField } from '../model';
  import { isDisabledOrReadonly } from '../is-disabled-or-readonly'
  
  import ObjectKeyInput from './object-key-input.svelte';
  import { getObjectContext } from './context';
  import { getErrors } from '../../utils';

  let {
    config,
    property,
    isAdditional,
    value = $bindable(),
  }: {
    config: Config,
    property: string;
    isAdditional: boolean;
    value: SchemaValue | undefined;
  } = $props()

  const ctx = getFormContext()
  const objCtx = getObjectContext()

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
