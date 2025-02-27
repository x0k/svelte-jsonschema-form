<script lang="ts">
  import { SvelteKitForm, createMeta } from '$lib/client/index.js';
  import { theme } from '@sjsf/basic-theme';
  import { createSyncFormValidator } from '@sjsf/ajv8-validator';
  import { translation } from '@sjsf/form/translations/en';

  import type { ActionData, PageData } from './$types.js';

  import { ERROR_TYPE_OBJECTS } from './model.js';

  const meta = createMeta<ActionData, PageData, 'form'>('form');
  // additionalPropertyKeyValidationError={({ type, values }) =>
  //   `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`}
</script>

<SvelteKitForm
  {theme}
  {meta}
  idPrefix="form3"
  validator={createSyncFormValidator()}
  {translation}
  onSubmitError={console.warn}
  onSuccess={console.log}
  onFailure={console.error}
  uiSchema={{
    'ui:formElement': {
      'ui:options': {
        form: {
          action: '?/first',
          novalidate: true
        }
      }
    }
  }}
/>
