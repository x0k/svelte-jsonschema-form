<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    createForm,
    type Schema,
    type Theme,
    type UiOptionsRegistryOption,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import {
    clearEdit,
    displayPrimitiveValue,
  } from "@sjsf/form/fields/actions/exports";

  import * as defaults from "../components/form-defaults.js";

  import Form from "./form.svelte";
  import { createSchemas, type Specs } from "./schemas.js";

  const {
    theme,
    append,
    specs,
    uiOptionsRegistry,
  }: {
    theme: Theme;
    specs: Specs;
    append?: Snippet;
  } & UiOptionsRegistryOption = $props();

  const widgetsSchemas = createSchemas(specs);

  const widgetsForm = $derived(
    createForm({
      ...defaults,
      ...widgetsSchemas,
      idPrefix: "widgets",
      theme,
      uiOptionsRegistry,
    })
  );
  const disabledWidgetsForm = $derived(
    createForm({
      ...defaults,
      ...widgetsSchemas,
      idPrefix: "widgetsDisabled",
      disabled: true,
      theme,
      uiOptionsRegistry,
    })
  );

  const componentsSchema: Schema = {
    type: "object",
    title: "Title",
    description: "description",
    properties: {
      optionalObject: {
        type: "object",
        properties: {
          optionalField: {
            type: "string",
          },
        },
      },
      optionalArray: {
        type: "array",
        items: {
          type: "string",
        },
      },
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
      oneOf: {
        type: "object",
        oneOf: [
          {
            title: "Foo",
            properties: {
              foo: {
                type: "string",
              },
              foo1: {
                type: "integer",
              },
            },
          },
          {
            title: "Bar",
            properties: {
              bar: {
                type: "number",
              },
              bar1: {
                type: "boolean",
              },
            },
          },
        ],
      },
    },
    additionalProperties: {
      type: "string",
    },
  };

  const componentsUiSchema: UiSchemaRoot = {
    optionalObject: {
      "ui:components": {
        objectTemplate: "optionalObjectTemplate",
      },
      "ui:options": {
        actions: {
          objectField: clearEdit,
        },
      },
      optionalField: {
        "ui:components": {
          fieldTemplate: "optionalFieldTemplate",
        },
        "ui:options": {
          actions: {
            stringField: clearEdit,
          },
        },
      },
    },
    optionalArray: {
      "ui:components": {
        arrayTemplate: "optionalArrayTemplate",
      },
      "ui:options": {
        actions: {
          arrayField: clearEdit,
        },
      },
      items: {
        "ui:options": {
          actions: {
            stringField: displayPrimitiveValue,
          },
        },
      },
    },
    array: {
      items: {
        "ui:options": {
          help: "test help",
        },
      },
    },
  };

  const componentsForm = createForm({
    ...defaults,
    schema: componentsSchema,
    uiSchema: componentsUiSchema,
    theme,
    initialValue: {
      optionalArray: ["foo"],
      array: ["fixed", 123],
      additional: "value",
    },
    initialErrors: [
      {
        path: [],
        message: "message",
      },
    ],
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
