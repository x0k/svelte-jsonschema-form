<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    createForm,
    pathToId,
    type Schema,
    type Theme,
    type UiSchema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/ajv8-validator";
  import { translation } from "@sjsf/form/translations/en";
  import { resolver } from '@sjsf/form/resolvers/compat';
  import '@sjsf/form/fields/extra-fields/enum-include';
  import '@sjsf/form/fields/extra-fields/multi-enum-include';
  import '@sjsf/form/fields/extra-fields/file-include';
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
  } from "./schemas";

  const {
    theme,
    append,
    additionalSpecs,
  }: {
    theme: Theme;
    additionalSpecs?: Record<string, [Schema, UiSchema]>;
    append?: Snippet;
  } = $props();

  const validator = createFormValidator();

  const widgetsSchemas = (idPrefix: string) =>
    createSchemas(
      {
        checkbox: [boolean, {}],
        checkboxes: [uniqueArray, {}],
        file: [file, {}],
        multiFile: [
          {
            type: "array",
            items: file,
          },
          {},
        ],
        number: [number, {}],
        select: [enumeration, {}],
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
