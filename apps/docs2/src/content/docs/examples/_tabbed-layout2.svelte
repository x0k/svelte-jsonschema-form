<script lang="ts">
  import { BasicForm, type UiSchemaRoot } from "@sjsf/form";

  import { createMyForm } from "@/components/my-form";

  import {
    Layout,
    makeTabbedFocusOnFirstError,
    schema,
    setTabsContext,
    type TabsContext,
  } from "./tabs";

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

  const tabsCtx: TabsContext = new Map();
  setTabsContext(tabsCtx);

  const form = createMyForm({
    schema,
    uiSchema,
    onSubmit: console.log,
    onSubmitError: makeTabbedFocusOnFirstError(tabsCtx),
  });
</script>

<BasicForm {form} novalidate />
