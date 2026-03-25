<script lang="ts" module>
  import { isSchemaObject } from "@sjsf/form/lib/json-schema";
  import type {
    Config,
    FieldCommonProps,
    SchemaValue,
    Schema,
  } from "@sjsf/form";

  import "@sjsf/form/extra-labels/clear";
  import "@sjsf/form/extra-labels/edit";

  declare module "@sjsf/form" {
    interface ComponentProps {
      nullableField: FieldCommonProps<SchemaValue>;
    }
    interface ComponentBindings {
      nullableField: "value";
    }
    interface FoundationalComponents {
      nullableField: {};
    }

    interface ButtonTypes {
      "clear-edit-action": {};
    }
  }

  export function isNullableField({ anyOf }: Schema) {
    if (anyOf?.length !== 2) {
      return false;
    }
    return anyOf.some((s) => isSchemaObject(s) && s.type === "null");
  }
</script>

<script lang="ts">
  import { isNil } from "@sjsf/form/lib/types";
  import {
    getDefaultValueForType,
    getSimpleSchemaType,
    type SchemaDefinition,
  } from "@sjsf/form/core";
  import {
    type ComponentProps,
    getComponent,
    getFieldComponent,
    getFieldErrors,
    getFormContext,
    isDisabled,
    retrieveTranslate,
    retrieveUiOption,
    retrieveUiSchema,
    Text,
    getDefaultFieldState,
  } from "@sjsf/form";
  import OptionalObjectTemplate from "@sjsf/form/templates/extra/optional-object.svelte";
  import OptionalArrayTemplate from "@sjsf/form/templates/extra/optional-array.svelte";
  import OptionalMultiFieldTemplate from "@sjsf/form/templates/extra/optional-multi-field.svelte";

  let {
    value = $bindable(),
    config,
    translate,
  }: ComponentProps["nullableField"] = $props();

  const ctx = getFormContext();

  const fieldConfig: Config = $derived.by(() => {
    const nullIndex = config.schema.anyOf?.findIndex(
      (s) => isSchemaObject(s) && s.type === "null"
    );
    let schema: SchemaDefinition;
    if (
      config.schema.anyOf?.length !== 2 ||
      nullIndex === undefined ||
      nullIndex < 0 ||
      ((schema = config.schema.anyOf[1 - nullIndex]), !isSchemaObject(schema))
    ) {
      throw new Error(
        `Invalid nullable field schema, expected '{ "anyOf": [{...}, { "type": "null" }] }', but got '${JSON.stringify(config.schema)}'`
      );
    }
    const uiSchema =
      config.uiSchema.anyOf?.length === 2
        ? retrieveUiSchema(ctx, config.uiSchema.anyOf[1 - nullIndex])
        : config.uiSchema;
    return {
      ...config,
      schema,
      uiSchema: {
        ...uiSchema,
        "ui:options": {
          action: clearEdit,
          ...uiSchema["ui:options"],
        },
        'ui:components': {
          objectTemplate: OptionalObjectTemplate,
          arrayTemplate: OptionalArrayTemplate,
          multiFieldTemplate: OptionalMultiFieldTemplate,
          ...uiSchema['ui:components']
        }
      },
    };
  });

  const Field = $derived(getFieldComponent(ctx, fieldConfig));
</script>

{#snippet clearEdit()}
  {@const Button = getComponent(ctx, "button", config)}
  <Button
    type="clear-edit-action"
    {config}
    disabled={config.schema.readOnly || isDisabled(ctx)}
    errors={getFieldErrors(ctx, config.path)}
    onclick={() => {
      value = isNil(value)
        ? (getDefaultFieldState(ctx, {
            schema: fieldConfig.schema,
            formData: undefined,
            includeUndefinedValues: "excludeObjectChildren",
          }) ?? getDefaultValueForType(getSimpleSchemaType(fieldConfig.schema)))
        : null;
    }}
  >
    <Text id={isNil(value) ? "edit" : "clear"} {config} {translate} />
  </Button>
{/snippet}

<Field
  type="field"
  bind:value={value as undefined}
  config={fieldConfig}
  uiOption={(opt) => retrieveUiOption(ctx, fieldConfig, opt)}
  translate={retrieveTranslate(ctx, fieldConfig)}
/>
