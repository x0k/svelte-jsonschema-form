<script lang="ts">
  import {
    createForm3,
    DEFAULT_ID_PREFIX,
    DEFAULT_ID_SEPARATOR,
    pathToId,
    type Theme,
  } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";

  import * as widgets from "./widgets";
  import * as components from "./components";
  import { validator } from "./ajv-validator";
  import Form from "./form.svelte";

  const { theme }: { theme: Theme } = $props();

  const widgetsForm = createForm3({
    ...theme,
    schema: widgets.schema,
    uiSchema: widgets.uiSchema,
    initialErrors: widgets.errors,
    validator,
    translation,
  });

  const componentsForm = createForm3({
    ...theme,
    initialValue: {
      array: ["fixed", 123],
      additional: "value",
    },
    initialErrors: [
      {
        instanceId: pathToId(DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR, []),
        message: "message",
        propertyTitle: "Title",
        error: null,
      },
    ],
    schema: components.schema,
    uiSchema: components.uiSchema,
    validator,
    translation,
  });
</script>

<div style="display: flex; gap: 2rem; padding: 2rem;">
  <div style="display: flex; flex-direction: column; flex: 1; gap: 1rem">
    <Form form={widgetsForm} />
  </div>
  <div style="display: flex; flex-direction: column; flex: 1; gap: 1rem">
    <Form form={componentsForm} />
  </div>
</div>
