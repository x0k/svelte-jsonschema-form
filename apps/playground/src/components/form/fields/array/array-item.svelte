<script lang="ts">
  import { getFormContext } from "../../context";
  import type { IdSchema } from "../../id-schema";
  import type { Schema, SchemaValue } from "../../schema";
  import type { UiSchema } from "../../ui-schema";
  import { getComponent, getField, getTemplate } from "../../utils";
  import { getArrayContext } from './context';

  let {
    index,
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
    //
    canMoveUp,
    canMoveDown,
    canAdd,
    canRemove,
  }: {
    index: number;
    name: string;
    value: SchemaValue | undefined;
    schema: Schema;
    uiSchema: UiSchema;
    idSchema: IdSchema<SchemaValue>;
    required: boolean;

    canMoveUp: boolean;
    canMoveDown: boolean;
    canAdd: boolean;
    canRemove: boolean;
  } = $props();

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array-item", uiSchema));
  const Field = $derived(getField(ctx, "root", uiSchema));
  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const Button = $derived(getComponent(ctx, "button", uiSchema))

  const moveUp = $derived(arrayCtx.orderable && canMoveUp)
  const moveDown = $derived(arrayCtx.orderable && canMoveDown)
  const remove = $derived(arrayCtx.removable && canAdd)
  const copy = $derived(arrayCtx.copyable && canAdd)
  const toolbar = $derived(moveUp || moveDown || remove || copy)
</script>

{#snippet buttons()}
  
{/snippet}
<Template {index} {name} {value} {schema} {uiSchema} {idSchema} {required} >
  <Field {name} bind:value {schema} {uiSchema} {idSchema} {required} />
</Template>
