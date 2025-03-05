<script lang="ts">
  import { BasicForm, setFromContext } from '@sjsf/form';
  import { createFormValidator } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/basic-theme';
  import { translation } from '@sjsf/form/translations/en';

  import {
    createMeta,
    createAdditionalPropertyKeyValidator,
    setupSvelteKitForm
  } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';
  import { ERROR_TYPE_OBJECTS } from './model.js';

  const meta = createMeta<ActionData, PageData>().form2;
  const validator = Object.assign(
    createFormValidator(),
    createAdditionalPropertyKeyValidator({
      error({ type, values }) {
        return `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`;
      }
    })
  );
  const { form } = setupSvelteKitForm(meta, {
    theme,
    schema: {
      title: 'Parent',
      additionalProperties: {
        title: 'Child',
        type: 'object',
        additionalProperties: {
          title: 'value',
          type: 'string'
        }
      }
    },
    validator,
    translation,
    onSubmitError: console.warn
  });
  setFromContext(form.context);
</script>

<BasicForm {form} method="POST" action="?/second" />
