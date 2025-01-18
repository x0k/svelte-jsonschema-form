
<script lang="ts">
  import { RawForm, setFromContext } from '@sjsf/form';
  import { createValidator2 } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/form/basic-theme';
  import { translation } from '@sjsf/form/translations/en';

  import { createMeta, createSvelteKitForm, createSvelteKitRequest } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';
  
    import { ERROR_TYPE_OBJECTS } from './model.js';

  const meta = createMeta<ActionData, PageData, 'form2'>('form2');
  const request = createSvelteKitRequest(meta, {
    onSuccess: console.log,
    onFailure: console.error
  });
  const form = createSvelteKitForm(meta, {
    ...theme,
    schema: {
      title: 'Parent',
      additionalProperties: {
        title: 'Child',
        type: "object",
        additionalProperties: {
          title: "value",
          type: "string"
        }
      }
    },
    validator: createValidator2(),
    translation,
    onSubmit: request.run,
    onSubmitError: console.warn,
    additionalPropertyKeyValidationError({ type, values }) {
      return `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`;
    },
  });
  setFromContext(form.context);
</script>

<RawForm {form} method="POST" action="?/second" />
