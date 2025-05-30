<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    createForm,
    pathToId,
    type ComponentDefinition,
    type Schema,
    type Theme,
    type UiOptionsRegistryOption,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/ajv8-validator";
  import { translation } from "@sjsf/form/translations/en";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import FilesField from "@sjsf/form/fields/extra-fields/files.svelte";
  import "@sjsf/form/fields/extra-fields/enum-include";
  import "@sjsf/form/fields/extra-fields/multi-enum-include";
  import "@sjsf/form/fields/extra-fields/file-include";
  import "@sjsf/form/fields/extra-fields/files-include";

  import Form from "./form.svelte";
  import {
    createSchemas,
    boolean,
    enumeration,
    file,
    number,
    text,
    uniqueArray,
    type Specs,
    filesArray,
    assertStrings,
  } from "./schemas";
  import { cast } from "@sjsf/form/lib/component";

  const {
    theme,
    append,
    additionalSpecs,
    uiOptionsRegistry,
  }: {
    theme: Theme;
    additionalSpecs?: Specs;
    append?: Snippet;
  } & UiOptionsRegistryOption = $props();

  const validator = createFormValidator();

  const filesAsArrayField = cast(FilesField, {
    value: {
      transform(props) {
        assertStrings(props.value);
        return props.value;
      },
    },
  }) satisfies ComponentDefinition<"arrayField">;

  const widgetsSchemas = (idPrefix: string) =>
    createSchemas(
      {
        checkbox: [boolean, {}],
        checkboxes: [
          uniqueArray,
          {
            "ui:components": {
              arrayField: "multiEnumField",
            },
          },
        ],
        file: [
          file,
          {
            "ui:components": {
              stringField: "fileField",
            },
          },
        ],
        multiFile: [
          filesArray,
          {
            "ui:components": {
              arrayField: filesAsArrayField,
            },
          },
        ],
        number: [number, {}],
        select: [
          enumeration,
          {
            "ui:components": {
              stringField: "enumField",
            },
          },
        ],
        text: [text, {}],
        ...additionalSpecs,
      },
      { idPrefix }
    );

  const widgetsForm = $derived(
    createForm({
      ...widgetsSchemas("widgets"),
      resolver,
      idPrefix: "widgets",
      theme,
      validator,
      translation,
      uiOptionsRegistry,
    })
  );
  const disabledWidgetsForm = $derived(
    createForm({
      ...widgetsSchemas("widgetsDisabled"),
      resolver,
      idPrefix: "widgetsDisabled",
      disabled: true,
      theme,
      validator,
      translation,
      uiOptionsRegistry,
    })
  );

  const componentsSchema: Schema = {
    type: "object",
    title: "Title",
    description: "description",
    properties: {
      array: {
        type: "array",
        items: [
          {
            type: "string",
          },
        ],
        additionalItems: {
          type: "number",
        },
      },
    },
    additionalProperties: {
      type: "string",
    },
  };

  const componentsUiSchema: UiSchemaRoot = {
    array: {
      items: {
        "ui:options": {
          help: "test help",
        },
      },
    },
  };

  const componentsForm = createForm({
    resolver,
    schema: componentsSchema,
    uiSchema: componentsUiSchema,
    theme,
    initialValue: {
      array: ["fixed", 123],
      additional: "value",
    },
    initialErrors: [
      {
        instanceId: pathToId([]),
        message: "message",
        propertyTitle: "Title",
        error: null as any,
      },
    ],
    validator,
    translation,
    uiOptionsRegistry,
  });
</script>

<div style="display: flex; gap: 2rem; padding: 2rem;">
  <div style="display: flex; flex-direction: column; flex: 1; gap: 1rem">
    <Form form={widgetsForm} />
  </div>
  <div style="display: flex; flex-direction: column; flex: 1; gap: 1rem">
    <Form form={disabledWidgetsForm} />
  </div>
  <div style="display: flex; flex-direction: column; flex: 1; gap: 1rem">
    <Form form={componentsForm} />
    {@render append?.()}
  </div>
</div>
