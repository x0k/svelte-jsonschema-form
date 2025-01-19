<script lang="ts">
  import { SvelteKitForm, createMeta } from '$lib/client/index.js';
  import { theme } from '@sjsf/form/basic-theme';
  import { createValidator2 } from '@sjsf/ajv8-validator';
  import { translation } from '@sjsf/form/translations/en';

  import type { ActionData, PageData } from './$types.js';

  import { ERROR_TYPE_OBJECTS } from './model.js';

  const meta = createMeta<ActionData, PageData, 'form'>('form');
</script>

<SvelteKitForm
  {...theme}
  {meta}
  idPrefix="form3"
  validator={createValidator2()}
  {translation}
  onSubmitError={console.warn}
  onSuccess={console.log}
  onFailure={console.error}
  additionalPropertyKeyValidationError={({ type, values }) =>
    `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`}
  uiSchema={{
    'ui:formElement': {
      'ui:options': {
        form: {
          action: "?/first",
          novalidate: true
        }
      }
    }
  }}
/>
