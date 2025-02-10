<script lang="ts">
  import { getComponent, getErrors, getFormContext } from "@/form/index.js";

  import type { FieldProps } from "../fields.js";

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

  const Template = $derived(
    getComponent(ctx, "objectPropertyTemplate", config)
  );
  const Field = $derived(getComponent(ctx, "rootField", config));
  const Button = $derived(getComponent(ctx, "button", config));
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
    type="object-property-remove"
    onclick={() => {
      objCtx.removeProperty(property);
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
