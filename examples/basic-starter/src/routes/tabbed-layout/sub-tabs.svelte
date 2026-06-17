<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import * as defaults from "$lib/sjsf/defaults";
  import {
    Layout,
    createTabbedFocusOnFirstError,
    schema,
    setTabsContext,
    type TabsContext,
  } from "$lib/tabs";

  const tabsCtx: TabsContext = { current: undefined };
  setTabsContext(tabsCtx);

  const theme = overrideByRecord(defaults.theme, {
    layout: Layout,
  });

  const form = createForm({
    ...defaults,
    resolver,
    schema,
    theme,
    onSubmit: console.log,
    onSubmitError: createTabbedFocusOnFirstError(tabsCtx),
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
