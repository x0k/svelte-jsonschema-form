<script lang="ts">
  import { RawForm } from '@sjsf/form';
  import { createValidator2 } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/form/basic-theme';
  import { translation } from '@sjsf/form/translations/en';

  import { createMeta, createSvelteKitForm, createSvelteKitRequest } from '$lib/client';

  import type { PageData, ActionData } from './$types';

  const meta = createMeta<ActionData, PageData, 'form'>('form');
  const request = createSvelteKitRequest(meta, {
    onSuccess: console.log,
    onFailure: console.error
  });
  const form = createSvelteKitForm(meta, {
    ...theme,
    validator: createValidator2(),
    translation,
    onSubmit: request.run,
    onSubmitError: console.warn,
    additionalPropertyKeyValidationError({ separators }) {
      return `The content of these sequences ("${separators.join('", "')}") is prohibited`;
    }
  });
</script>

<RawForm {form} method="POST" novalidate />
