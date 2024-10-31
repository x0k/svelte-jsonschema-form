<script lang="ts">
  import { createForm, type Theme } from '@sjsf/form';
  import { translation } from '@sjsf/form/translations/en';

  import * as widgets from './widgets';
  import * as components from './components';
  import { validator } from './ajv-validator';
  import Form from './form.svelte';

  const { theme }: { theme: Theme } = $props();

  const [widgetsCtx, widgetsForm] = createForm({
    ...theme,
    schema: widgets.schema,
    uiSchema: widgets.uiSchema,
    validator,
    translation,
  })

  const [componentsCtx, componentsForm] = createForm({
    ...theme,
    initialValue: {
      array: ['fixed', 123],
      additional: 'value'
    },
    schema: components.schema,
    uiSchema: components.uiSchema,
    validator,
    translation,
  })
</script>

<div style="display: flex; gap: 2rem; padding: 2rem;">
  <div style="display: flex; flex-direction: column; flex: 1; gap: 1rem">
    <Form context={widgetsCtx} form={widgetsForm} />
  </div>
  <div style="display: flex; flex-direction: column; flex: 1; gap: 1rem">
    <Form context={componentsCtx} form={componentsForm} />
  </div>
</div>
