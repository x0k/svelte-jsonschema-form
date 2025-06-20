<script lang="ts">
  import { theme } from '@sjsf/basic-theme';
  import { createFormValidator } from '@sjsf/ajv8-validator';
  import { translation } from '@sjsf/form/translations/en';
  import { resolver } from '@sjsf/form/resolvers/basic'

  import {
    SvelteKitForm,
    createMeta,
    createAdditionalPropertyKeyValidator
  } from '$lib/client/index.js';

  import type { ActionData, PageData } from './$types.js';
  import { ERROR_TYPE_OBJECTS } from './model.js';

  const meta = createMeta<ActionData, PageData>().form;
  const validator = Object.assign(
    createFormValidator({ idPrefix: "form3" }),
    createAdditionalPropertyKeyValidator({
      error({ type, values }) {
        return `The presence of these ${ERROR_TYPE_OBJECTS[type]} ("${values.join('", "')}") is prohibited`;
      }
    })
  );
</script>

<SvelteKitForm
  {resolver}
  {theme}
  {meta}
  idPrefix="form3"
  {validator}
  {translation}
  onSubmitError={console.warn}
  onSuccess={console.log}
  onFailure={console.error}
  uiSchema={{
    'ui:options': {
      form: {
        action: '?/first',
        novalidate: true
      }
    }
  }}
/>
