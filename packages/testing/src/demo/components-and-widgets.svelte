<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    createForm,
    pathToId,
    type Schema,
    type Theme,
    type UiOptionsRegistryOption,
    type UiSchemaRoot,
  } from "@sjsf/form";

  import * as defaults from "../components/form-defaults";

  import Form from "./form.svelte";
  import { createSchemas, type Specs } from "./schemas";
  import { DEFAULT_SPECS } from "./default-specs";

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

  const widgetsSchemas = (idPrefix: string) =>
    createSchemas(Object.assign(DEFAULT_SPECS, additionalSpecs), { idPrefix });

  const widgetsForm = $derived(
    createForm({
      ...defaults,
      ...widgetsSchemas("widgets"),
      idPrefix: "widgets",
      theme,
      uiOptionsRegistry,
    })
  );
  const disabledWidgetsForm = $derived(
    createForm({
      ...defaults,
      ...widgetsSchemas("widgetsDisabled"),
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
    ...defaults,
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
