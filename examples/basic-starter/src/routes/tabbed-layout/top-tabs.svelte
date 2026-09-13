<script lang="ts">
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    validate,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import * as defaults from "$lib/sjsf/defaults";
  import {
    createFocusOnFirstErrorTab,
    Layout,
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
  const focusOnFirstErrorTab = createFocusOnFirstErrorTab(tabsCtx);

  const form = createForm({
    ...defaults,
    resolver,
    schema,
    uiSchema,
    onValid: console.log,
  });
  const focusOnFirstError = createFocusOnFirstError({ form });
</script>

<BasicForm
  {form}
  novalidate
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onInvalid: focusOnFirstErrorTab(focusOnFirstError(e)),
    });
  }}
/>

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
