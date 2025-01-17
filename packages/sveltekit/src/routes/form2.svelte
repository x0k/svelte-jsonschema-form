
<script lang="ts">
  import { Content, RawForm, setFromContext } from '@sjsf/form';
  import { createValidator2 } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/form/basic-theme';
  import { translation } from '@sjsf/form/translations/en';

  import { createMeta, createSvelteKitForm, createSvelteKitRequest } from '$lib/client/index.js';

  import type { PageData, ActionData } from './$types.js';

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
    additionalPropertyKeyValidationError({ separators }) {
      return `The content of these sequences ("${separators.join('", "')}") is prohibited`;
    },
  });
  setFromContext(form.context);
</script>

<RawForm {form} />
