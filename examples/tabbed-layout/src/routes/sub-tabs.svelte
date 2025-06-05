<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import { BasicForm, createForm } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";
  import {
    Layout,
    createTabbedFocusOnFirstError,
    schema,
    setTabsContext,
    type TabsContext,
  } from "$lib/tabs";

  const tabsCtx: TabsContext = new Map();
  setTabsContext(tabsCtx);

  const theme = overrideByRecord(defaults.theme, {
    layout: Layout,
  });

  const form = createForm({
    ...defaults,
    schema,
    theme,
    onSubmit: console.log,
    onSubmitError: createTabbedFocusOnFirstError(tabsCtx),
  });
</script>

<BasicForm {form} novalidate />
