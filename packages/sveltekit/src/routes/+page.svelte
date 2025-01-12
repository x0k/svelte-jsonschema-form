<script lang="ts">
  import { FormContent } from '@sjsf/form';
  import { createValidator2 } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/form/basic-theme';
  import { translation } from '@sjsf/form/translations/en';

  import { useSvelteKitForm, meta } from '$lib/client';

  import type { PageData, ActionData } from './$types';

  const { form, enhance } = useSvelteKitForm(meta<ActionData, PageData>(), "form", {
    ...theme,
    validator: createValidator2(),
    translation,
    onSuccess: console.log,
    onFailure: console.warn,
    onSubmitError: console.error,
    additionalPropertyKeyValidationError({ separators }) {
      return `The content of these sequences ("${separators.join('", "')}") is prohibited`;
    }
  });
</script>

<form use:enhance method="POST" novalidate style="display: flex; flex-direction: column; gap: 1rem">
  <FormContent bind:value={form.formValue} />
  <button type="submit" style="padding: 0.5rem;">Submit</button>
</form>
