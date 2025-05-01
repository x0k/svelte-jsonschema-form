<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import { BasicForm } from "@sjsf/form";

  import { theme } from "@/components/form-defaults";
  import { createMyForm } from "@/components/my-form";

  import {
    Layout,
    createTabbedFocusOnFirstError,
    schema,
    setTabsContext,
    type TabsContext,
  } from "./tabs";

  const tabsCtx: TabsContext = new Map();
  setTabsContext(tabsCtx);

  const form = createMyForm({
    schema,
    theme: overrideByRecord(theme, {
      layout: Layout,
    }),
    onSubmit: console.log,
    onSubmitError: createTabbedFocusOnFirstError(tabsCtx),
  });
</script>

<BasicForm {form} novalidate />
