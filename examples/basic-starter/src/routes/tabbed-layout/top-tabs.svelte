<script lang="ts">
  import { BasicForm, createForm, type UiSchemaRoot } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";
  import {
    Layout,
    createTabbedFocusOnFirstError,
    schema,
    setTabsContext,
    type TabsContext,
  } from "$lib/tabs";

  const uiSchema = {
    "ui:components": {
      layout: Layout,
    },
    items: {
      "ui:components": {
        layout: Layout,
      },
    },
  } satisfies UiSchemaRoot;

  const tabsCtx: TabsContext = { current: undefined };
  setTabsContext(tabsCtx);

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    onSubmit: console.log,
    onSubmitError: createTabbedFocusOnFirstError(tabsCtx),
  });
</script>

<BasicForm {form} novalidate />
