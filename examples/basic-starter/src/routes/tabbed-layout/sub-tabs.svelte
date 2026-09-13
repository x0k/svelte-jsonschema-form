<script lang="ts">
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    validate,
  } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import * as defaults from "$lib/sjsf/defaults";
  import {
    Layout,
    createFocusOnFirstErrorTab,
    schema,
    setTabsContext,
    type TabsContext,
  } from "$lib/tabs";

  const tabsCtx: TabsContext = { current: undefined };
  setTabsContext(tabsCtx);
  const focusOnFirstErrorTab = createFocusOnFirstErrorTab(tabsCtx);

  const theme = overrideByRecord(defaults.theme, {
    layout: Layout,
  });

  const form = createForm({
    ...defaults,
    resolver,
    schema,
    theme,
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
