<script lang="ts">
  import {
    getField,
    getTemplate,
    getComponent,
    getErrors,
    getFormContext,
    isDisabled,
  } from "../../context/index.js";

  import type { FieldProps } from "../model.js";

  import { getObjectContext } from "./context.js";
  import ObjectKeyInput from "./object-key-input.svelte";

  let {
    config,
    property,
    isAdditional,
    value = $bindable(),
  }: FieldProps<"objectProperty"> = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const Template = $derived(getTemplate(ctx, "object-property", config));
  const Field = $derived(getField(ctx, "root", config));
  const Button = $derived(getComponent(ctx, "button", config));
  const disabled = $derived(isDisabled(ctx, config.uiOptions?.input));
  const errors = $derived(getErrors(ctx, config.idSchema));
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
    {disabled}
    type="object-property-remove"
    onclick={(e) => {
      e.preventDefault();
      objCtx.removeProperty(property)
    }}
  >
    <ctx.IconOrTranslation data={["remove-object-property"]} />
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
  <Field bind:value {config} />
</Template>
