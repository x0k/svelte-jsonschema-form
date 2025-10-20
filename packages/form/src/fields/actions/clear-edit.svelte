<script lang="ts" module>
  import type { Ref } from "@/lib/svelte.svelte.js";
  import { isNil } from "@/lib/types.js";
  import { getDefaultValueForType, getSimpleSchemaType } from "@/core/index.js";
  import {
    getComponent,
    getDefaultFieldState,
    isDisabled,
    retrieveTranslate,
    Text,
    type Config,
    type FieldErrors,
    type FormState,
    type SchemaValue,
  } from "@/form/index.js";

  import "@/form/extra-labels/clear.js";
  import "@/form/extra-labels/edit.js";

  declare module "../components.js" {
    interface ButtonTypes {
      "clear-edit-action": {};
    }
  }

  export { clearEdit };
</script>

{#snippet clearEdit(
  ctx: FormState<unknown>,
  config: Config,
  valueRef: Ref<SchemaValue | undefined>,
  errors: FieldErrors
)}
  {@const Button = getComponent(ctx, "button", config)}
  <Button
    type="clear-edit-action"
    {config}
    disabled={config.schema.readOnly || isDisabled(ctx)}
    {errors}
    onclick={() => {
      valueRef.current = isNil(valueRef.current)
        ? (getDefaultFieldState(ctx, {
            schema: config.schema,
            formData: undefined,
            includeUndefinedValues: "excludeObjectChildren",
          }) ?? getDefaultValueForType(getSimpleSchemaType(config.schema)))
        : undefined;
    }}
  >
    <Text
      id={isNil(valueRef.current) ? "edit" : "clear"}
      {config}
      translate={retrieveTranslate(ctx, config)}
    />
  </Button>
{/snippet}
