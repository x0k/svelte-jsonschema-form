<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    createForm,
    DEFAULT_ID_PREFIX,
    DEFAULT_ID_SEPARATOR,
    pathToId,
    type FormState,
    type ThemeResolver,
  } from "@sjsf/form";

  import * as widgets from "./widgets";
  import * as components from "./components";
  import { validator } from "./ajv-validator";
  import Form from "./form.svelte";
  import { translation } from "./translation";

  const {
    theme,
    createWidgetsForm = () =>
      createForm({
        theme,
        schema: widgets.schema,
        uiSchema: widgets.uiSchema,
        initialErrors: widgets.errors(Object.keys(widgets.uiSchema)),
        validator,
        translation,
      }),
    append,
  }: {
    theme: ThemeResolver;
    createWidgetsForm?: () => FormState<any, any>;
    append?: Snippet;
  } = $props();

  const widgetsForm = createWidgetsForm();

  const componentsForm = createForm({
    theme,
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
    <Form context={widgetsForm.context} />
  </div>
  <div style="display: flex; flex-direction: column; flex: 1; gap: 1rem">
    <Form context={componentsForm.context} />
    {@render append?.()}
  </div>
</div>
