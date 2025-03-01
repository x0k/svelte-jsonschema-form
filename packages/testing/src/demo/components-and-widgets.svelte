<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    createForm,
    DEFAULT_ID_PREFIX,
    DEFAULT_ID_SEPARATOR,
    pathToId,
    type FormInternals,
    type ThemeResolver,
  } from "@sjsf/form";

  import Form from "./form.svelte";
  import * as widgets from "./widgets";
  import * as components from "./components";
  import { validator } from "./ajv-validator";
  import { translation } from "./translation";

  const {
    theme,
    append,
  }: {
    theme: ThemeResolver;
    createWidgetsForm?: (disabled: boolean) => FormInternals<any, any>;
    append?: Snippet;
  } = $props();

  const widgetsForm = createForm({
    ...widgets,
    theme,
    validator,
    translation,
  });
  const disabledWidgetsForm = createForm({
    ...widgets,
    disabled: true,
    theme,
    validator,
    translation,
  });

  const componentsForm = createForm({
    ...components,
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
